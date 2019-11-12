import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  PermissionsAndroid,
  Platform,
  BackHandler
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-picker';
import ProgressLoader from 'rn-progress-loader';
import {
  Card,
  CardItem,
  Button,
  Item,
  Label,
  Input,
  InputGroup
} from 'native-base';
import base from '../../../../base';
import { Dropdown } from 'react-native-material-dropdown';
import ZoomImage from 'react-native-zoom-image';
import { Easing } from 'react-native';
import axios from 'axios';

import gateFirebase from 'firebase';
import Sound from 'react-native-sound';
import AudioRecord from 'react-native-audio-record';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
// import AudioRecorderPlayer, {
//   AVEncoderAudioQualityIOSType,
//   AVEncodingOption,
//   AudioEncoderAndroidType,
//   AudioSet,
//   AudioSourceAndroidType
// } from 'react-native-audio-recorder-player';
import { ratio, screenWidth } from './VendorStyles.js';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import StaffStyle from './StaffStyle.js';

// var audioRecorderPlayer;
const options = {
  sampleRate: 44100,
  channels: 1,
  bitsPerSample: 16,
  wavFile: 'test.wav'
};

class StaffLeaveWithVendor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      relativeImage1: '',
      relativeImage2: '',
      relativeImage3: '',
      relativeImage4: '',
      relativeImage5: '',

      myProfileImage1: '',
      myProfileImage2: '',
      myProfileImage3: '',
      myProfileImage4: '',
      myProfileImage5: '',

      mp3uri: '',
      mp3: '',

      imageUrl: '',
      photo: null,
      photoDetails: null,
      isPhotoAvailable: false,
      filePath: '',
      imagePath: '',
      id: '',

      buttonId: 1,
      playBtnId: 0,

      recordSecs: 0,
      recordTime: '00:00:00',
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00:00',
      duration: '00:00:00',

      isLoading: false,

      datasource: [],
      dataSource: [],

      visitorName: '',
      visitorId: '',
      visitorList: [],

      comment: '',
      dropdownValue: '',

      announcementId: '',

      audioFile: '',
      recording: false,
      loaded: false,
      paused: true,
      currentTime: '',

      timestamp: '',
      visworkID: ''
    };
    // this.audioRecorderPlayer = new AudioRecorderPlayer();
    // this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
  }

  checkPermission = async () => {
    AudioRecord.init(options);
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.RECORD_AUDIO).then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            this.requestPermission();
            console.log(
              'This feature is not available (on this device / in this context)'
            );
            break;
          case RESULTS.DENIED:
            this.requestPermission();
            console.log(
              'The permission has not been requested / is denied but requestable'
            );
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      });
    } else {
      check(PERMISSIONS.IOS.MICROPHONE).then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            this.requestPermission();
            console.log(
              'This feature is not available (on this device / in this context)'
            );
            break;
          case RESULTS.DENIED:
            this.requestPermission();
            console.log(
              'The permission has not been requested / is denied but requestable'
            );
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      });
    }
  };

  requestPermission = async () => {
    AudioRecord.init(options);
    if (Platform.OS === 'ios') {
      request(PERMISSIONS.IOS.MICROPHONE).then(result => {});
    } else {
      request(PERMISSIONS.ANDROID.RECORD_AUDIO).then(result => {});
    }
  };

  start = async () => {
    // AudioRecord.init(options);
    // setTimeout(() => {
    AudioRecord.init(options);
    AudioRecord.start();
    this.setState({
      audioFile: '',
      recording: true,
      loaded: false,
      buttonId: 2
    });
    this.timeStamp();
  };

  stop = async () => {
    if (!this.state.recording) return;
    console.log('stop record');
    let audioFile = await AudioRecord.stop();
    console.log('audioFile', audioFile);
    this.setState({ audioFile, recording: false, buttonId: 1, playBtnId: 1 });
    this.uploadAudio(audioFile);
  };

  timeStamp = () => {
    var time = Math.floor(Date.now());
    this.setState({
      timestamp: time
    });
  };

  load = () => {
    return new Promise((resolve, reject) => {
      if (!this.state.audioFile) {
        return reject('file path is empty');
      }

      this.sound = new Sound(this.state.audioFile, '', error => {
        if (error) {
          console.log('failed to load the file', error);
          return reject(error);
        }
        this.setState({ loaded: true });
        return resolve();
      });
    });
  };

  play = async () => {
    if (!this.state.loaded) {
      try {
        await this.load();
      } catch (error) {
        console.log(error);
      }
    }

    this.setState({ paused: false });
    Sound.setCategory('Playback');

    this.sound.play(success => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
      this.setState({ paused: true });
      // this.sound.release();
    });
  };

  pause = () => {
    this.sound.pause();
    this.setState({ paused: true, playBtnId: 1, buttonId: 1 });
  };

  componentDidMount() {
    this.checkPermission();
    this.visitorID();
    console.log(
      'IDDDDDDD',
      this.props.navigation.state.params.StaffId,
      this.props.navigation.state.params.StaffName
    );
    let self = this;
    setTimeout(() => {
      this.setState({
        isLoading: false
      });
    }, 1500);
    AudioRecord.init(options);

    axios
      .get(`http://${this.props.oyeURL}/oyesafe/api/v1/GetCurrentDateTime`, {
        headers: {
          'Content-Type': 'application/json',
          'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
        }
      })
      .then(res => {
        console.log(res.data, 'current time');
        this.setState({ currentTime: res.data.data.currentDateTime });
      })
      .catch(error => {
        console.log(error, 'erro_fetching_data');
        this.setState({ currentTime: 'failed' });
      });
  }

  componentDidUpdate() {
    setTimeout(() => {
      BackHandler.addEventListener('hardwareBackPress', () =>
        this.processBackPress()
      );
    }, 100);
  }

  componentWillUnmount() {
    setTimeout(() => {
      BackHandler.removeEventListener('hardwareBackPress', () =>
        this.processBackPress()
      );
    }, 0);
  }

  processBackPress() {
    console.log('Part');
    const { goBack } = this.props.navigation;
    goBack(null);
    return true;
  }

  setImage() {
    console.log('Set Image');
    const options = {
      quality: 0.5,
      maxWidth: 250,
      maxHeight: 250,
      cameraRoll: true,
      storageOptions: {
        skipBackup: true,
        path: 'tmp_files'
      }
    };
    let self = this;
    ImagePicker.launchCamera(options, response => {
      console.log('response:', response);
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        console.log('ImagePicker : ', response);
        switch (this.state.id) {
          case 1:
            self.setState({
              myProfileImage1: response.uri
            });
            this.uploadImage(response);
            // alert(response.uri);
            break;
          case 2:
            self.setState({
              myProfileImage2: response.uri
            });
            this.uploadImage(response);
            // alert(response.uri);
            break;
          case 3:
            self.setState({
              myProfileImage3: response.uri
            });
            this.uploadImage(response);
            // alert(response.uri);
            break;
          case 4:
            self.setState({
              myProfileImage4: response.uri
            });
            this.uploadImage(response);
            // alert(response.uri);
            break;
          case 5:
            self.setState({
              myProfileImage5: response.uri
            });
            this.uploadImage(response);
            // alert(response.uri);
            break;
        }
        // self.setState(
        //   {
        //     photo: response.uri,
        //     photoDetails: response,
        //     isPhotoAvailable: true,
        //     imagePath: response.path,
        //     relativeImage1: response.uri,
        //   },
        //   () => self.uploadImage(response),
        //   alert(response.uri),
        //   console.log('Image Details5', response.uri),
        // );
      }
    });
  }
  async uploadImage(response) {
    console.log('Image upload before', response);
    let self = this;
    let source = Platform.OS === 'ios' ? response.uri : response.uri;
    console.log('Source', source);
    const form = new FormData();
    let imgObj = {
      name: response.fileName !== undefined ? response.fileName : 'XXXXX.jpg',
      uri: source,
      type:
        response.type !== undefined || response.type != null
          ? response.type
          : 'image/jpeg'
    };
    form.append('image', imgObj);
    console.log('ImageObj', imgObj);
    let stat = await base.services.MediaUploadApi.uploadRelativeImage(form);
    // console.log('Photo upload response', stat, response);
    if (stat) {
      try {
        switch (this.state.id) {
          case 1:
            self.setState({
              relativeImage1: stat,
              isPhotoAvailable: true,
              photo: response.uri,
              photoDetails: response,
              imagePath: response.path
            });
            break;
          case 2:
            self.setState({
              relativeImage2: stat,
              isPhotoAvailable: true,
              photo: response.uri,
              photoDetails: response,
              imagePath: response.path
            });
            break;
          case 3:
            self.setState({
              relativeImage3: stat,
              isPhotoAvailable: true,
              photo: response.uri,
              photoDetails: response,
              imagePath: response.path
            });
            break;
          case 4:
            self.setState({
              relativeImage4: stat,
              isPhotoAvailable: true,
              photo: response.uri,
              photoDetails: response,
              imagePath: response.path
            });
            break;
          case 5:
            self.setState({
              relativeImage5: stat,
              isPhotoAvailable: true,
              photo: response.uri,
              photoDetails: response,
              imagePath: response.path
            });
            break;
        }
        console.log(
          'Photo upload response',
          stat,
          response,
          this.state.relativeImage1,
          this.state.relativeImage2,
          this.state.relativeImage3,
          this.state.relativeImage4,
          this.state.relativeImage5
        );
      } catch (err) {
        console.log('err', err);
      }
    }
  }

  // uploadAudio = async result => {
  //   console.log('Audio', result[0]);
  //   const path = Platform.OS === 'ios' ? result : result; //`Images/${result[0]}`;
  //   console.log('PATH', result[0], path);

  //   const formData = new FormData();

  //   formData.append('file', {
  //     uri: path,
  //     name: 'hello1111.aac',
  //     type: 'audio/aac'
  //   });

  //   console.log(formData, 'FormData');
  //   let stat = await base.services.MediaUploadApi.uploadRelativeImage(formData);
  //   try {
  //     this.setState({
  //       mp3: stat
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   console.log('Stat222222222222222222222222:', stat);
  // };

  uploadAudio = async result => {
    const newUri = result.replace('file://', 'file:///');

    // alert(JSON.stringify(result));

    console.log('Audio', result);
    const path = Platform.OS === 'ios' ? result : `file://${result}`;
    // console.log('PATH', path);

    // alert(JSON.stringify(path));
    const formData = new FormData();

    // alert(JSON.stringify(stat));

    formData.append('file', {
      uri: path,
      name: `${this.state.timestamp}hello.wav`,
      type: 'audio/wav'
    });

    console.log(formData, 'FormData');
    let stat = await base.services.MediaUploadApi.uploadRelativeImage(formData);
    try {
      this.setState({
        mp3: stat
      });
    } catch (e) {
      console.log('Errorrrrrrrrrrrrrr', e);
    }

    // alert(JSON.stringify(stat));
    console.log('Stat222222222222222222222222, UPLOAD:', stat);
  };

  image1Exp = () => {};
  image2Exp() {
    // alert('Button CLicked');
    return (
      <View>
        <ZoomImage
          source={{ uri: this.state.relativeImage2 }}
          imgStyle={{
            height: hp('4%'),
            width: hp('4%'),
            borderRadius: hp('2%'),
            borderColor: 'orange',
            borderWidth: hp('0.1%')
          }}
          duration={200}
          enableScaling={false}
          easingFunc={Easing.ease}
        />
      </View>
    );
  }

  onStartRecord = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permissions for write access',
            message: 'Give permission to your storage to write a file',
            buttonPositive: 'ok'
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the storage');
        } else {
          console.log('permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Permissions for write access',
            message: 'Give permission to your storage to write a file',
            buttonPositive: 'ok'
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
        } else {
          console.log('permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
    const path = Platform.select({
      ios: 'hello.m4a',
      android: 'sdcard/hello.aac' //here?
    });

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac
    };
    console.log('audioSet', audioSet);
    const uri = await this.audioRecorderPlayer.startRecorder(path, audioSet);
    this.audioRecorderPlayer.addRecordBackListener(e => {
      this.setState({
        recordSecs: e.current_position,
        recordTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.current_position)
        ),
        buttonId: 2
      });
    });
    // alert('Recording Started');
    // console.log(`uri: ${uri}`);
  };

  onStopRecord = async () => {
    const result = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
      buttonId: 1,
      playBtnId: 1,

      mp3uri: result
    });
    // alert('Recording Stop');
    // console.log('.substring(14, 23)', result.substring(14, 23));
    // console.log('this state uri', this.state.mp3uri);
    // this.uploadAudio(result.match('hello.m4a') || result.match('hello.mp3'));
    this.uploadAudio(result);
  };

  onStatusPress = e => {
    const touchX = e.nativeEvent.locationX;
    console.log(`touchX: ${touchX}`);
    const playWidth =
      (this.state.currentPositionSec / this.state.currentDurationSec) *
      (screenWidth - 56 * ratio);
    console.log(`currentPlayWidth: ${playWidth}`);

    const currentPosition = Math.round(this.state.currentPositionSec);
    console.log(`currentPosition: ${currentPosition}`);

    if (playWidth && playWidth < touchX) {
      const addSecs = Math.round(currentPosition + 3000);
      this.audioRecorderPlayer.seekToPlayer(addSecs);
      console.log(`addSecs: ${addSecs}`);
    } else {
      const subSecs = Math.round(currentPosition - 3000);
      this.audioRecorderPlayer.seekToPlayer(subSecs);
      console.log(`subSecs: ${subSecs}`);
    }
  };

  onStartPlay = async () => {
    // this.setState({
    //   playBtnId: 2
    // });
    // console.log('Play Button', this.state.playBtnId);
    const path = Platform.select({
      ios: 'hello.m4a',
      android: 'sdcard/hello.mp4'
    });
    const msg = await this.audioRecorderPlayer.startPlayer(path);
    this.audioRecorderPlayer.setVolume(1.0);
    console.log(msg);
    this.audioRecorderPlayer.addPlayBackListener(e => {
      if (e.current_position === e.duration) {
        console.log('finished');
        this.audioRecorderPlayer.stopPlayer();
        this.setState({
          playBtnId: 2
        });
      }
      this.setState({
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.current_position)
        ),
        duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
        playBtnId: 2
      });
      console.log('Play Button Id', this.state.playTime);
    });
  };

  onStopPlay = async () => {
    console.log('onStopPlay');
    this.audioRecorderPlayer.stopPlayer();
    this.audioRecorderPlayer.removePlayBackListener();
    this.setState({
      playBtnId: 1,
      buttonId: 1
    });
  };

  visitorID = () => {
    fetch(
      `http://${this.props.oyeURL}/oyesafe/api/v1/VisitorLog/GetVisitorLogByDatesAssocAndUnitID`,
      {
        method: 'POST',
        headers: {
          'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          StartDate: new Date(),
          EndDate: new Date(),
          ASAssnID: this.props.dashboardReducer.assId,
          UNUnitID: this.props.dashboardReducer.uniID,
          ACAccntID: this.props.userReducer.MyAccountID
        })
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        //var count = Object.keys(responseJson.data.visitorlogbydate).length;
        //console.log("fsbkfh", count);
        console.log('Deliveries___', responseJson);
        if (responseJson.success) {
          for (let i = 0; i < responseJson.data.visitorlog.length; i++) {
            if (
              responseJson.data.visitorlog[i].reRgVisID ==
              this.props.navigation.state.params.StaffId
            ) {
              this.setState({
                isLoading: false,
                dataSource: responseJson.data.visitorlog,
                visworkID: responseJson.data.visitorlog[i].vlVisLgID
              });
            }
            console.log(
              'visworkID',
              this.state.visworkID,
              responseJson.data.visitorlog[i].reRgVisID ===
                this.props.navigation.state.params.StaffId
            );
          }
        } else {
          this.setState({
            isLoading: false
          });
        }
      })

      .catch(error => {
        this.setState({ error, loading: false });
        console.log(error, '&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
      });
  };
  datasend = () => {
    let self = this;
    let img1 = self.state.relativeImage1 ? self.state.relativeImage1 : '';
    let img2 = self.state.relativeImage2 ? self.state.relativeImage2 : '';
    let img3 = self.state.relativeImage3 ? self.state.relativeImage3 : '';
    let img4 = self.state.relativeImage4 ? self.state.relativeImage4 : '';
    let img5 = self.state.relativeImage5 ? self.state.relativeImage5 : '';
    let comments = self.state.comment ? self.state.comment : '';
    let visitorid = this.state.visworkID;
    let visitorname = self.props.navigation.state.params.StaffName;
    let mp3 = self.state.mp3;
    console.log(
      'All Data',
      img1,
      img2,
      img3,
      img4,
      img5,
      mp3,
      comments,
      visitorid,
      visitorname,
      self.props.dashboardReducer.assId,
      self.props.dashboardReducer.uniID,
      this.props.oyeURL
    );
    this.setState({
      isLoading: true
    });
    fetch(
      `http://${this.props.oyeURL}/oyesafe/api/v1/VisitorLog/UpdateLeaveWithVendor`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
        },
        body: JSON.stringify({
          VLVenName: `${visitorname}`,
          VLCmnts: `${comments}`,
          VLVenImg: `${img1},${img2},${img3},${img4},${img5}`,
          VLVoiceNote: mp3,
          VLVisLgID: visitorid
        })
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        //var count = Object.keys(responseJson.data.visitorlogbydate).length;
        console.log('Reports_Data', responseJson);
        gateFirebase
          .database()
          .ref(
            `NotificationSync/A_${this.props.dashboardReducer.assId}/${visitorid}`
          )
          .update({
            newAttachment: true,
            updatedTime: this.state.currentTime
          });
        this.setState({
          isLoading: false,
          relativeImage1: '',
          relativeImage2: '',
          relativeImage3: '',
          relativeImage4: '',
          relativeImage5: '',

          myProfileImage1: '',
          myProfileImage2: '',
          myProfileImage3: '',
          myProfileImage4: '',
          myProfileImage5: '',

          mp3uri: '',
          mp3: '',

          imageUrl: '',
          photo: null,
          photoDetails: null,
          isPhotoAvailable: false,
          filePath: '',
          imagePath: '',
          id: '',

          buttonId: 1,
          playBtnId: 0,

          recordSecs: 0,
          recordTime: '00:00:00',
          currentPositionSec: 0,
          currentDurationSec: 0,
          playTime: '00:00:00',
          duration: '00:00:00',
          datasource: [],

          visitorName: '',
          visitorId: '',
          visitorList: [],

          comment: '',
          dropdownValue: '',

          announcementId: '',

          audioFile: '',
          recording: false,
          loaded: false,
          paused: true,
          currentTime: '',

          timestamp: ''
        });
        this.props.navigation.goBack();
      })

      .catch(error => {
        this.setState({
          isLoading: false,
          relativeImage1: '',
          relativeImage2: '',
          relativeImage3: '',
          relativeImage4: '',
          relativeImage5: '',

          myProfileImage1: '',
          myProfileImage2: '',
          myProfileImage3: '',
          myProfileImage4: '',
          myProfileImage5: '',

          mp3uri: '',
          mp3: '',

          imageUrl: '',
          photo: null,
          photoDetails: null,
          isPhotoAvailable: false,
          filePath: '',
          imagePath: '',
          id: '',

          buttonId: 1,
          playBtnId: 0,

          recordSecs: 0,
          recordTime: '00:00:00',
          currentPositionSec: 0,
          currentDurationSec: 0,
          playTime: '00:00:00',
          duration: '00:00:00',
          datasource: [],
          visitorName: '',
          visitorId: '',
          visitorList: [],

          comment: '',
          dropdownValue: '',

          announcementId: '',

          audioFile: '',
          recording: false,
          loaded: false,
          paused: true,
          currentTime: '',

          timestamp: ''
        });
        console.log(error, '&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
      });
  };
  render() {
    const { recording, paused, audioFile } = this.state;
    let playWidth =
      (this.state.currentPositionSec / this.state.currentDurationSec) *
      (screenWidth - 56 * ratio);
    if (!playWidth) playWidth = 0;
    console.log('COMMENT', this.state.comment.length);
    console.log('PROPS:', this.props.navigation.state.params);
    return (
      <View style={styles.container}>
        <View style={styles.viewForMyProfileText}>
          <Text
            style={{
              fontSize: hp('2.5%'),
              color: base.theme.colors.primary,
              textAlign: 'center'
            }}
          >
            Leave with Vendor
          </Text>
        </View>
        <KeyboardAwareScrollView>
          {/* <View
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >

          </View> */}
          <View style={StaffStyle.detailsMainView}>
            <View
              style={{ ...StaffStyle.detailsLeftView, marginLeft: hp('2%') }}
            >
              {this.props.navigation.state.params.Pic === '' ? (
                <Image
                  style={StaffStyle.staffImg}
                  source={{
                    uri:
                      'https://mediaupload.oyespace.com/' +
                      base.utils.strings.noImageCapturedPlaceholder
                  }}
                />
              ) : (
                <Image
                  style={StaffStyle.staffImg}
                  source={{
                    uri:
                      base.utils.strings.imageUrl +
                      this.props.navigation.state.params.Pic
                  }}
                />
              )}
              <View style={StaffStyle.textView1}>
                <Text style={StaffStyle.staffText1} numberofLines={1}>
                  {this.props.navigation.state.params.StaffName}
                </Text>
              </View>
              {this.props.navigation.state.params.DeptName && (
                <Text style={StaffStyle.desigText}>
                  {' '}
                  ({this.props.navigation.state.params.DeptName})
                </Text>
              )}
            </View>
          </View>

          <Card
            style={{
              height: hp('25%'),
              borderRadius: 10,
              marginLeft: hp('2%'),
              marginRight: hp('2%'),
              marginTop: hp('2%'),
              flexDirection: 'column'
            }}
          >
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <View style={styles.relativeImgView}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ id: 1 }), this.setImage();
                  }}
                >
                  {this.state.relativeImage1 === '' ? (
                    <View
                      style={{
                        justifyContent: 'space-evenly',
                        height: hp('8%')
                      }}
                    >
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: hp('4.5%'),
                          height: hp('4.5%'),
                          alignSelf: 'center'
                        }}
                      >
                        <Image
                          style={{ width: hp('4%'), height: hp('4%') }}
                          source={require('../../../../../icons/leave_vender_add.png')}
                        />
                      </View>
                      <View style={{ marginTop: hp('0.5%') }}>
                        <Text style={{ fontSize: hp('1.4%') }}>Add Photo</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.containerView_ForProfilePicViewStyle}>
                      <View>
                        <Image
                          style={{
                            height: hp('10%'),
                            width: hp('10%'),
                            borderRadius: hp('1%')
                          }}
                          source={{ uri: this.state.myProfileImage1 }}
                        />
                      </View>
                      {/* <TouchableOpacity>
                        <View style={styles.imagesmallCircle}>
                          <View
                            style={{
                              width: hp('5%'),
                              height: hp('5%'),
                              zIndex: 100
                            }}
                          >
                            <ZoomImage
                              style={[styles.smallImage]}
                              source={{ uri: this.state.myProfileImage1 }}
                              imgStyle={{
                                height: hp('4%'),
                                width: hp('4%'),
                                borderRadius: hp('2%'),
                                borderColor: 'orange',
                                borderWidth: hp('0.1%'),
                                marginRight: hp('2%')
                              }}
                            />
                          </View>

                          <View
                            style={{
                              width: hp('6%'),
                              height: hp('6%'),
                              position: 'absolute',
                              zIndex: 110
                            }}
                          >
                            <Text
                              style={{
                                width: hp('6%'),
                                height: hp('6%'),
                                fontSize: hp('3%'),
                                marginLeft: hp('1.5%'),
                                color: base.theme.colors.black,
                                fontWeight: '500'
                              }}
                            >
                              +
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                     */}
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              {this.state.relativeImage1 ? (
                <View style={styles.relativeImgView}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ id: 2 }), this.setImage();
                    }}
                  >
                    {this.state.relativeImage2 === '' ? (
                      <View
                        style={{
                          justifyContent: 'space-evenly',
                          height: hp('8%')
                        }}
                      >
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: hp('4.5%'),
                            height: hp('4.5%'),
                            alignSelf: 'center'
                          }}
                        >
                          <Image
                            style={{ width: hp('4%'), height: hp('4%') }}
                            source={require('../../../../../icons/leave_vender_add.png')}
                          />
                        </View>
                        <View style={{ marginTop: hp('0.5%') }}>
                          <Text style={{ fontSize: hp('1.4%') }}>
                            Add Photo
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.containerView_ForProfilePicViewStyle}>
                        <View>
                          <Image
                            style={{
                              height: hp('10%'),
                              width: hp('10%'),
                              borderRadius: hp('1%')
                            }}
                            source={{ uri: this.state.myProfileImage2 }}
                          />
                        </View>
                        {/* <TouchableOpacity>
                          <View style={styles.imagesmallCircle}> */}
                        {/* <View
                              style={{
                                width: hp('5%'),
                                height: hp('5%'),
                                zIndex: 100
                              }}
                            >
                              <ZoomImage
                                style={[styles.smallImage]}
                                source={{ uri: this.state.myProfileImage2 }}
                                imgStyle={{
                                  height: hp('4%'),
                                  width: hp('4%'),
                                  borderRadius: hp('2%'),
                                  borderColor: 'orange',
                                  borderWidth: hp('0.1%'),
                                  marginRight: hp('2%')
                                }}
                              />
                            </View>

                            <View
                              style={{
                                width: hp('6%'),
                                height: hp('6%'),
                                position: 'absolute',
                                zIndex: 110
                              }}
                            >
                              <Text
                                style={{
                                  width: hp('6%'),
                                  height: hp('6%'),
                                  fontSize: hp('3%'),
                                  marginLeft: hp('1.5%'),
                                  color: base.theme.colors.black,
                                  fontWeight: '500'
                                }}
                              >
                                +
                              </Text>
                            </View> */}

                        {/* <Image
                            style={{
                              width: hp('6%'),
                              height: hp('6%'),
                              marginBottom: hp('15%'),
                              position: 'absolute',
                              marginRight: hp('5%')
                              // backgroundColor: 'red'
                            }}
                            source={require('../../../../../icons/zoom_in_white.png')}
                          /> */}
                        {/* </View>
                        </TouchableOpacity> */}
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <View></View>
              )}
              {this.state.relativeImage1 && this.state.relativeImage2 ? (
                <View style={styles.relativeImgView}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ id: 3 }), this.setImage();
                    }}
                  >
                    {this.state.relativeImage3 === '' ? (
                      <View
                        style={{
                          justifyContent: 'space-evenly',
                          height: hp('8%')
                        }}
                      >
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: hp('4.5%'),
                            height: hp('4.5%'),
                            alignSelf: 'center'
                          }}
                        >
                          <Image
                            style={{ width: hp('4%'), height: hp('4%') }}
                            source={require('../../../../../icons/leave_vender_add.png')}
                          />
                        </View>
                        <View style={{ marginTop: hp('0.5%') }}>
                          <Text style={{ fontSize: hp('1.4%') }}>
                            Add Photo
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.containerView_ForProfilePicViewStyle}>
                        <View>
                          <Image
                            style={{
                              height: hp('10%'),
                              width: hp('10%'),
                              borderRadius: hp('1%')
                            }}
                            source={{ uri: this.state.myProfileImage3 }}
                          />
                        </View>
                        {/* <TouchableOpacity>
                          <View style={styles.imagesmallCircle}>
                            <View
                              style={{
                                width: hp('5%'),
                                height: hp('5%'),
                                zIndex: 100
                              }}
                            >
                              <ZoomImage
                                style={[styles.smallImage]}
                                source={{ uri: this.state.myProfileImage3 }}
                                imgStyle={{
                                  height: hp('4%'),
                                  width: hp('4%'),
                                  borderRadius: hp('2%'),
                                  borderColor: 'orange',
                                  borderWidth: hp('0.1%'),
                                  marginRight: hp('2%')
                                }}
                              />
                            </View>

                            <View
                              style={{
                                width: hp('6%'),
                                height: hp('6%'),
                                position: 'absolute',
                                zIndex: 110
                              }}
                            >
                              <Text
                                style={{
                                  width: hp('6%'),
                                  height: hp('6%'),
                                  fontSize: hp('3%'),
                                  marginLeft: hp('1.5%'),
                                  color: base.theme.colors.black,
                                  fontWeight: '500'
                                }}
                              >
                                +
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                       */}
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <View></View>
              )}
              {this.state.relativeImage1 &&
              this.state.relativeImage2 &&
              this.state.relativeImage3 ? (
                <View style={styles.relativeImgView}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ id: 4 }), this.setImage();
                    }}
                  >
                    {this.state.relativeImage4 === '' ? (
                      <View
                        style={{
                          justifyContent: 'space-evenly',
                          height: hp('8%')
                        }}
                      >
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: hp('4.5%'),
                            height: hp('4.5%'),
                            alignSelf: 'center'
                          }}
                        >
                          <Image
                            style={{ width: hp('4%'), height: hp('4%') }}
                            source={require('../../../../../icons/leave_vender_add.png')}
                          />
                        </View>
                        <View style={{ marginTop: hp('0.5%') }}>
                          <Text style={{ fontSize: hp('1.4%') }}>
                            Add Photo
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.containerView_ForProfilePicViewStyle}>
                        <View>
                          <Image
                            style={{
                              height: hp('10%'),
                              width: hp('10%'),
                              borderRadius: hp('1%')
                            }}
                            source={{ uri: this.state.myProfileImage4 }}
                          />
                        </View>
                        {/* <TouchableOpacity>
                          <View style={styles.imagesmallCircle}>
                            <View
                              style={{
                                width: hp('5%'),
                                height: hp('5%'),
                                zIndex: 100
                              }}
                            >
                              <ZoomImage
                                style={[styles.smallImage]}
                                source={{ uri: this.state.myProfileImage4 }}
                                imgStyle={{
                                  height: hp('4%'),
                                  width: hp('4%'),
                                  borderRadius: hp('2%'),
                                  borderColor: 'orange',
                                  borderWidth: hp('0.1%'),
                                  marginRight: hp('2%')
                                }}
                              />
                            </View>

                            <View
                              style={{
                                width: hp('6%'),
                                height: hp('6%'),
                                position: 'absolute',
                                zIndex: 110
                              }}
                            >
                              <Text
                                style={{
                                  width: hp('6%'),
                                  height: hp('6%'),
                                  fontSize: hp('3%'),
                                  marginLeft: hp('1.5%'),
                                  color: base.theme.colors.black,
                                  fontWeight: '500'
                                }}
                              >
                                +
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                       */}
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <View></View>
              )}

              {this.state.relativeImage1 &&
              this.state.relativeImage2 &&
              this.state.relativeImage3 &&
              this.state.relativeImage4 ? (
                <View style={styles.relativeImgView}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ id: 5 }), this.setImage();
                    }}
                  >
                    {this.state.relativeImage5 === '' ? (
                      <View
                        style={{
                          justifyContent: 'space-evenly',
                          height: hp('8%')
                        }}
                      >
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: hp('4.5%'),
                            height: hp('4.5%'),
                            alignSelf: 'center'
                          }}
                        >
                          <Image
                            style={{
                              width: hp('4%'),
                              height: hp('4%')
                            }}
                            source={require('../../../../../icons/leave_vender_add.png')}
                          />
                        </View>
                        <View style={{ marginTop: hp('0.3%') }}>
                          <Text style={{ fontSize: hp('1.4%') }}>
                            Add Photo
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.containerView_ForProfilePicViewStyle}>
                        <View>
                          <Image
                            style={{
                              height: hp('10%'),
                              width: hp('10%'),
                              borderRadius: hp('1%')
                            }}
                            source={{ uri: this.state.myProfileImage5 }}
                          />
                        </View>
                        {/* <TouchableOpacity>
                          <View style={styles.imagesmallCircle}>
                            <View
                              style={{
                                width: hp('5%'),
                                height: hp('5%'),
                                zIndex: 100
                              }}
                            >
                              <ZoomImage
                                style={[styles.smallImage]}
                                source={{ uri: this.state.myProfileImage5 }}
                                imgStyle={{
                                  height: hp('4%'),
                                  width: hp('4%'),
                                  borderRadius: hp('2%'),
                                  borderColor: 'orange',
                                  borderWidth: hp('0.1%'),
                                  marginRight: hp('2%')
                                }}
                              />
                            </View>

                            <View
                              style={{
                                width: hp('6%'),
                                height: hp('6%'),
                                position: 'absolute',
                                zIndex: 110
                              }}
                            >
                              <Text
                                style={{
                                  width: hp('6%'),
                                  height: hp('6%'),
                                  fontSize: hp('3%'),
                                  marginLeft: hp('1.5%'),
                                  color: base.theme.colors.black,
                                  fontWeight: '500'
                                }}
                              >
                                +
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                       */}
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <View></View>
              )}
            </ScrollView>

            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                marginTop: hp('2%'),
                height: hp('8%')
              }}
            >
              <View
                style={{
                  width: hp('8%'),
                  height: hp('8%'),
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {this.state.buttonId === 1 ? (
                  <TouchableOpacity onPress={() => this.start()}>
                    <View
                      style={{
                        width: hp('8%'),
                        height: hp('8%'),
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Image
                        style={{
                          width: hp('5%'),
                          height: hp('5%')
                        }}
                        source={require('../../../../../icons/leave_vender_record.png')}
                      />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => this.stop()}>
                    <View
                      style={{
                        width: hp('8%'),
                        height: hp('8%'),
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Image
                        style={{
                          width: hp('5%'),
                          height: hp('5%')
                        }}
                        source={require('../../../../../icons/leave_vender_stop.png')}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  height: hp('8%')
                }}
              >
                <View
                  style={{
                    flex: 1,
                    height: hp('5%'),
                    alignItems: 'flex-start',
                    justifyContent: 'center'
                  }}
                >
                  {this.state.buttonId === 1 ? (
                    <Text>Click mic to record</Text>
                  ) : (
                    <Text style={styles.txtRecordCounter}>Recording...</Text>
                  )}
                </View>
              </View>
              <Card
                style={{
                  width: hp('5%'),
                  height: hp('5%'),
                  marginRight: hp('2%'),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: hp('1%')
                }}
              >
                {this.state.playBtnId === 0 ? (
                  <Image
                    source={require('../../../../../icons/leave_vender_play1.png')}
                  />
                ) : (
                  <View>
                    {this.state.playBtnId === 1 && (
                      <TouchableOpacity onPress={() => this.play()}>
                        <View
                          style={{
                            width: hp('5%'),
                            height: hp('5%'),
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Image
                            source={require('../../../../../icons/leave_vender_play.png')}
                          />
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </Card>
            </View>
          </Card>
          <View
            style={{
              marginHorizontal: hp('3%'),
              marginTop: hp('2%')
            }}
          >
            <View style={{ marginTop: hp('2%'), marginBottom: hp('1%') }}>
              <Text style={{ fontSize: hp('1.8%') }}>Comment *</Text>
            </View>

            <View
              style={{
                borderColor: base.theme.colors.primary,
                borderWidth: hp('0.1%'),
                borderRadius: hp('1%'),
                height: hp('12%'),
                justifyContent: 'flex-end'
              }}
            >
              <Item
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: hp('2%'),
                  marginRight: hp('2%'),
                  // marginHorizontal: hp('3%'),
                  marginBottom: hp('3%')
                }}
              >
                <Input
                  multiline={true}
                  numberOfLines={4}
                  style={{ fontSize: hp('1.8%') }}
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="Write a comment here..."
                  value={this.state.comment}
                  onChangeText={comment => this.setState({ comment: comment })}
                />
              </Item>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: hp('2%')
              }}
            >
              <Button
                bordered
                warning
                style={styles.button}
                disabled={this.state.comment.length === 0}
                onPress={() => this.datasend()}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: hp('2%'),
                    fontWeight: '500'
                  }}
                >
                  Submit
                </Text>
              </Button>
            </View>
          </View>
        </KeyboardAwareScrollView>
        {/* <ProgressLoader
          isHUD={true}
          isModal={true}
          visible={this.state.isLoading}
          color={base.theme.colors.primary}
          hudColor={base.theme.colors.white}
        /> */}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    oyeURL: state.OyespaceReducer.oyeURL,
    dashboardReducer: state.DashboardReducer,
    userReducer: state.UserReducer
  };
};
export default connect(mapStateToProps)(StaffLeaveWithVendor);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  viewStyle1: {
    backgroundColor: base.theme.colors.white,
    height: hp('7%'),
    width: '100%',
    shadowColor: base.theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative'
  },
  viewDetails1: {
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10
  },
  viewDetails2: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: hp('3%'),
    height: hp('3%'),
    marginTop: 5
    // marginLeft: 10
  },
  image: {
    width: wp('34%'),
    height: hp('18%')
  },

  subContainer: {
    height: '35%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  relativeImgView: {
    height: hp('10%'),
    width: hp('10%'),
    borderRadius: hp('1%'),
    // borderWidth: 2,
    marginHorizontal: 10,
    marginTop: hp('2%'),
    borderColor: base.theme.colors.primary,
    backgroundColor: base.theme.colors.imageShadow,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  viewForMyProfileText: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: hp('1.8%')
  },
  containerView_ForProfilePicViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'yellow',
    height: hp('20%'),
    width: hp('12%')
    // marginTop: hp('2%')
  },
  imagesmallCircle: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: wp('40%'),
    height: hp('2%'),
    flexDirection: 'row'

    // backgroundColor: 'yellow'
  },
  smallImage: {
    width: hp('3.5%'),
    height: hp('3.5%'),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: hp('2%'),
    marginRight: hp('1%')
    // backgroundColor: 'yellow'
  },
  viewPlayer: {
    marginTop: 8 * ratio,
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  viewBar: {
    backgroundColor: base.theme.colors.playprogressbar,
    height: 4 * ratio,
    alignSelf: 'stretch'
  },
  viewBarPlay: {
    backgroundColor: 'white',
    height: 4 * ratio,
    width: 0
  },
  viewBarWrapper: {
    marginTop: 1 * ratio,
    marginHorizontal: 28 * ratio,
    alignSelf: 'stretch'
  },
  button: {
    width: hp('12%'),
    height: hp('5%'),
    borderRadius: 25,
    borderWidth: 2,
    backgroundColor: base.theme.colors.white,
    justifyContent: 'center',
    marginLeft: 30,
    marginRight: 30,
    borderColor: base.theme.colors.white,
    marginBottom: hp('2%'),
    backgroundColor: base.theme.colors.primary
  }
});
