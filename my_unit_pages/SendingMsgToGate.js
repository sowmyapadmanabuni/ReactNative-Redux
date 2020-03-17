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
  BackHandler, Alert
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
import base from '../src/base';
import { Dropdown } from 'react-native-material-dropdown';
import ZoomImage from 'react-native-zoom-image';
import { Easing } from 'react-native';
import axios from 'axios';

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
import { ratio, screenWidth } from './Styles.js';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import gateFirebase from 'firebase';

// var audioRecorderPlayer;
const options = {
  sampleRate: 44100,
  channels: 1,
  bitsPerSample: 16,
  wavFile: 'test.wav'
};

class SendingMsgToGate extends Component {
  sound = null;
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
      isPause:true,
    };
    // this.audioRecorderPlayer = new AudioRecorderPlayer();
    // this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
  }

  componentDidMount() {
    this.checkPermission();
    let self = this;
    console.log(this.props, this.state, 'sendingMsggat');
    setTimeout(() => {
      // self.visitorData();
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
        this.setState({
          isPause: true
        });
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
    ImagePicker.showImagePicker(options, response => {
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

  visitorData = async () => {
    this.setState({ isLoading: true });
    let today = moment(new Date(), 'DD-MM-YYYY').format('YYYY-MM-DD');

    // let date = today.format('YYYY-MM-DD');
    //oday.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();

    // console.log(date);
    // let date = new Date().getDate().format('YYYY-MM-DD');
    console.log('Date:', today);
    try {
      const response = await fetch(
        `http://${this.props.oyeURL}/oyesafe/api/v1/VisitorLog/GetVisitorLogByDatesAssocAndUnitID`,
        {
          method: 'POST',
          headers: {
            'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            StartDate: `${today}`,
            EndDate: `${today}`, //moment(new Date()).format('YYYY-MM-DD'),
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
          if (responseJson.success) {
            console.log('SUCCESS', responseJson);
            let data = responseJson.data.visitorlog.filter(
              x => x.vlVisType === 'Delivery'
            );
            let visitors = [];
            let visitorObj = {};
            for (let i in data) {
              console.log('data[i].vlExitT', data[i].vlExitT);
              if (
                data[i].vlExitT === '0001-01-01T00:00:00' ||
                data[i].vlExitT === 'NULL'
              ) {
                visitorObj = {
                  value: data[i].vlfName,
                  id: data[i].vlVisLgID
                };
                console.log('VALUE,ID', visitorObj.value, visitorObj.id);
                visitors.push(visitorObj);
                this.setState({
                  visitorList: visitors
                });
                console.log(
                  'DATAAAAAAA',
                  i,
                  data[i],
                  data[i].vlExitT,
                  visitors
                );
              }

              console.log('Visitors', visitorObj);
            }
            this.setState({
              isLoading: false,
              datasource: visitors
            });
            console.log('Visitor Data', this.state.datasource);
          } else {
            this.setState({
              isLoading: false,
              datasource: []
            });
          }
        });
      if (response) {
        console.log(
          'Visitor Data',
          response.data.visitorlog.filter(x => x.vlVisType === 'Delivery')
        );
        this.setState({ isLoading: false });
      }
    } catch (e) {
      this.setState({ isLoading: false });
    }
  };

  visitorsendtogate = async (value, index) => {
    let self = this;
    let visitorList = self.state.visitorList;

    let id, name;
    for (let i = 0; i < visitorList.length; i++) {
      console.log('VIsitor List', visitorList);
      if (i === index) {
        (id = visitorList[i].id), (name = visitorList[i].value);
      }
      console.log('id, name', id, name);
      self.setState({
        visitorName: name,
        visitorId: id
      });
    }
  };

  datasend = () => {
    let self = this;
    let img1 = self.state.relativeImage1 ? self.state.relativeImage1 : '';
    let img2 = self.state.relativeImage2 ? self.state.relativeImage2 : '';
    let img3 = self.state.relativeImage3 ? self.state.relativeImage3 : '';
    let img4 = self.state.relativeImage4 ? self.state.relativeImage4 : '';
    let img5 = self.state.relativeImage5 ? self.state.relativeImage5 : '';
    let comments = self.state.comment ? self.state.comment : '';
    let visitorid = self.state.visitorId;
    let visitorname = self.state.visitorName;
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
    axios
      .post(
        `http://${this.props.oyeURL}/oyesafe/api/v1/VisitorLog/UpdateLeaveWithVendor`,
        {
          VLVenName: `${this.props.navigation.state.params.fname}`,
          VLCmnts: `${comments}`,
          VLVenImg: `${img1},${img2},${img3},${img4},${img5}`,
          VLVoiceNote: mp3,
          VLVisLgID: this.props.navigation.state.params.id
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
          }
        }
      )

      .then(response => {
        console.log('Respo1111:', response);
        const { associationId, id } = this.props.navigation.state.params;
        console.log('PARAMS', this.props.navigation.state.params);
        let timeFormat = moment.utc().format();
        let anotherString = timeFormat.replace(/Z/g, '');
        console.log(anotherString, 'another_string');

        gateFirebase
          .database()
          .ref(`NotificationSync/A_${associationId}/${id}`)
          .update({
            newAttachment: true,
            attachmentTime: this.state.currentTime
          });
        // alert('Success');
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
          comment: '',
          dropdownValue: ''
        });
        this.props.navigation.goBack();
      })
      .catch(error => {
        console.log('Crash in profile', error);
      });
  };

  validateAnnouncement(){
    if (!this.state.audioFile)
      Alert.alert("","Audio cannot be empty");
    /*else if(this.state.comment.length === 0)
      Alert.alert("", "Message cannot be empty");*/
    else
      this.datasend()
  }

  render() {
    const { recording, paused, audioFile } = this.state;
    let playWidth =
      (this.state.currentPositionSec / this.state.currentDurationSec) *
      (screenWidth - 56 * ratio);
    if (!playWidth) playWidth = 0;
    console.log('COMMENT', this.state.comment.length);
    console.log('All_Data', this.props.navigation.state.params);
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
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {/* <Dropdown
              value={'Select Visitor' || ''}
              data={this.state.datasource}
              textColor={base.theme.colors.black}
              inputContainerStyle={{}}
              baseColor={base.theme.colors.black}
              placeholder="Select Visitor"
              placeholderTextColor={base.theme.colors.black}
              placeholderStyle={{ fontWeight: 'bold' }}
              labelHeight={hp('4%')}
              containerStyle={{
                width: wp('85%'),
                height: hp('8%')
              }}
              rippleOpacity={0}
              dropdownPosition={0}
              dropdownOffset={{ top: hp('10%'), left: 0 }}
              style={{ fontSize: hp('2.2%') }}
              onChangeText={(value, index) =>
                this.visitorsendtogate(value, index)
              }
              // ref={c => {
              //   dropdownValue = c;
              // }}
            /> */}
          </View>

          <View style={styles.detailsMainView}>
            <View style={{ ...styles.detailsLeftView, marginLeft: hp('2%') }}>
              {this.props.navigation.state.params.image === '' ? (
                <Image
                  style={styles.staffImg}
                  source={{
                    uri:
                      'https://mediaupload.oyespace.com/' +
                      base.utils.strings.noImageCapturedPlaceholder
                  }}
                />
              ) : (
                <Image
                  style={styles.staffImg}
                  source={{
                    uri:
                      base.utils.strings.imageUrl +
                      this.props.navigation.state.params.image
                  }}
                />
              )}
              <View style={styles.textView1}>
                <Text style={styles.staffText1} numberofLines={1}>
                  {this.props.navigation.state.params.fname}{' '}
                  {this.props.navigation.state.params.lname}
                </Text>
              </View>
            </View>
          </View>

          <Card style={{height: hp('25%'), borderRadius: 10, marginLeft: hp('2%'), marginRight: hp('2%'), marginTop: hp('2%'), flexDirection: 'column'}}>
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
                          source={require('../icons/leave_vender_add.png')}
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
                            source={require('../icons/leave_vender_add.png')}
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
                            source={require('../icons/zoom_in_white.png')}
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
                            source={require('../icons/leave_vender_add.png')}
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
                            source={require('../icons/leave_vender_add.png')}
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
                            source={require('../icons/leave_vender_add.png')}
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
                        source={require('../icons/leave_vender_record.png')}
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
                        source={require('../icons/leave_vender_stop.png')}
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
                  <Image source={require('../icons/leave_vender_play1.png')} />
                ) : (
                  <View>
                    {this.state.playBtnId === 1 && (
                      <TouchableOpacity onPress={() => {
                        this.setState({
                          isPause: !this.state.isPause
                        });
                        this.state.isPause ? this.play() : this.pause()
                      }}>
                        <View
                          style={{
                            width: hp('5%'),
                            height: hp('5%'),
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Image
                            source={
                              this.state.isPause ?
                                  require('../icons/leave_vender_play.png'):
                                  require('../icons/leave_vender_pause.png')
                            }
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
            {/*<View style={{ marginTop: hp('2%'), marginBottom: hp('1%') }}>
              <Text style={{ fontSize: hp('1.8%') }}>Message</Text>
            </View>*/}

            {/*<View
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
            </View>*/}
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
                //disabled={this.state.comment.length === 0}
                onPress={() => this.validateAnnouncement()}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: hp('2%'),
                    fontWeight: '500'
                  }}
                >
                  Send
                </Text>
              </Button>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <ProgressLoader
          isHUD={true}
          isModal={true}
          visible={this.state.isLoading}
          color={base.theme.colors.primary}
          hudColor={base.theme.colors.white}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    oyeURL: state.OyespaceReducer.oyeURL,
    dashboardReducer: state.DashboardReducer,
    userReducer: state.UserReducer,
    assId:state.DashboardReducer.assId ,
    uniID: state.DashboardReducer.uniID,
  };
};
export default connect(mapStateToProps)(SendingMsgToGate);

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
    //backgroundColor: base.theme.colors.white,
    justifyContent: 'center',
    marginLeft: 30,
    marginRight: 30,
    borderColor: base.theme.colors.white,
    marginBottom: hp('2%'),
    backgroundColor: base.theme.colors.primary
  },
  detailsMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '15%',
    width: '90%',
    marginTop: 20,
    justifyContent: 'space-between'
  },
  detailsLeftView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%'
  },
  staffImg: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignSelf: 'center'
  },
  textView1: {
    marginLeft: 10,
    width: hp('10%')
  },
  staffText1: {
    fontSize: hp('1.6%'),
    fontWeight: '500',
    color: base.theme.colors.black
  }
});
