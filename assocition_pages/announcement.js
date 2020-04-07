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
  BackHandler,
  Alert,TextInput
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-picker';
import ProgressLoader from 'rn-progress-loader';
import _ from 'lodash';
import {
  Card,
  Button,
  CardItem,
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

import * as fb from 'firebase';

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
import { CLOUD_FUNCTION_URL } from '../constant.js';
import firebase from 'react-native-firebase';
import RNFetchBlob from 'rn-fetch-blob';
import { createUserNotification } from '../src/actions';
import { connect } from 'react-redux';
import utils from '../src/base/utils';
import strings from "../src/base/utils/strings";

// var audioRecorderPlayer;

const options = {
  sampleRate: 44100,
  channels: 1,
  bitsPerSample: 16,
  wavFile: 'test.wav'
};

class Announcement extends Component {
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

      timestamp: '',

      isPause: true,
      isLoading:false
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    // this.audioRecorderPlayer = new AudioRecorderPlayer();
    // this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
  }

  componentDidMount() {
    this.checkPermission();
    let self = this;
    setTimeout(() => {
      this.setState({
        isLoading: false
      });
    }, 1500);
    AudioRecord.init(options);
    if(Platform.OS!='ios'){
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
  }

  componentDidUpdate() {
    /*setTimeout(() => {
      BackHandler.addEventListener('hardwareBackPress', () =>
          this.processBackPress()
      );
    }, 100);*/
  }

  componentWillUnmount() {
    if(Platform.OS!='ios'){
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    /*setTimeout(() => {
      BackHandler.removeEventListener('hardwareBackPress', () =>
          this.processBackPress()
      );
    }, 0);*/
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  processBackPress() {
    console.log('Part');
    const { goBack } = this.props.navigation;
    goBack(null);
    return true;
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
    if (!this.state.audioFile){
      console.log("PAUSE");
      this.sound.pause();
      this.setState({ paused: true, playBtnId: 1, buttonId: 1 });
    }
  };

  setImage() {
    console.log('Set Image');
    const options = {
      quality: 1,
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
    console.log('Stat222222222222222222222222', stat, response);
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
          'Photo_upload_response',
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

  // datasend = () => {
  //   axios
  //     .get(
  //       `http://${this.props.oyeURL}/oyeliving/api/v1/Member/GetMemberListByAssocID/${this.props.dashboardReducer.assId}`,
  //       {
  //         headers: {
  //           'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //     )
  //     .then(response => {
  //       console.log(
  //         'Respo1111:',
  //         response,
  //         response.data.data.announcement.anid
  //       );
  //       // this.setState({
  //       //   isLoading: false
  //       // });
  //       axios
  //         .post(`${CLOUD_FUNCTION_URL}/sendAllUserNotification`, {
  //           admin: 'false',
  //           ntType: ntType,
  //           ntDesc: ntDesc,
  //           ntTitle: ntTitle,
  //           associationID: associationId
  //         })
  //         .then(response_3 => {
  //           console.log('response_3', response_3);
  //           // this.setState({ loading: false });
  //           axios
  //             .get(
  //               `http://${this.props.oyeURL}/oyeliving/api/v1/Member/GetMemberListByAssocID/${this.props.dashboardReducer.assId}`,
  //               {
  //                 headers: {
  //                   'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
  //                   'Content-Type': 'application/json'
  //                 }
  //               }
  //             )
  //             .then(res => {
  //               let memberList = res.data.data.memberListByAssociation;
  //               let announcement = response.data.data.announcement.anid;
  //               console.log('RESPONSE', res);
  //               this.setState({
  //                 isLoading: false
  //               });
  //               let removedDuplicates = _.uniqBy(memberList, 'acAccntID');
  //               console.log(
  //                 'memberList1111',
  //                 memberList,
  //                 removedDuplicates,
  //                 announcement
  //               );
  //               removedDuplicates.map(data => {
  //                 console.log('adminssss', ntType, data);
  //                 this.props.createUserNotification(
  //                   ntType,
  //                   this.props.oyeURL,
  //                   data.acAccntID,
  //                   this.props.dashboardReducer.assId.toString(),
  //                   ntDesc,
  //                   'announcment',
  //                   'announcment',
  //                   'announcement',
  //                   'announcment',
  //                   'announcment',
  //                   'announcment',
  //                   'announcment',
  //                   'announcment',
  //                   false,
  //                   this.props.userReducer.MyAccountID,
  //                   announcement
  //                 );
  //               });
  //               this.props.navigation.goBack();

  //               // getAssoMembers(oyeURL, MyAccountID);

  //               // this.props.updateJoinedAssociation(
  //               //   this.props.joinedAssociations,
  //               //   unitList.unUnitID
  //               // );
  //             })
  //             .catch(error => {
  //               // getAssoMembers(oyeURL, MyAccountID);
  //               this.setState({
  //                 loading: false
  //               });

  //               console.log(error, 'errorAdmin');
  //             });
  //         });
  //     })
  //     .catch(error => {
  //       // getAssoMembers(oyeURL, MyAccountID);
  //       this.setState({
  //         loading: false
  //       });

  //       console.log(error, 'errorAdmin');
  //     });
  // };

  playPause(){
    console.log("isPause ",this.state.isPause);
  }

  datasend = () => {
    console.log("datasend ??")
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
    let accountId = self.props.userReducer.MyAccountID;
    let assocID = self.props.dashboardReducer.assId;
    console.log(
      'All Data',
      img1,
      img2,
      img3,
      img4,
      img5,
      comments,
      mp3,
      accountId,
      self.props.dashboardReducer.assId,

      visitorid,
      visitorname,
      self.props.dashboardReducer.uniID,
      this.props.oyeURL
    );
    let ntTitle =  strings.announcement; //'Announcement';
    let ntDesc = `${comments}`;
    let ntType = `Announcement`;
    let associationId = self.props.dashboardReducer.assId;

    let image = `${img1},${img2},${img3},${img4},${img5}`;

    console.log('INPUT FOR ANN@@@@@',image,ntDesc,accountId,assocID,mp3)

   
    axios
      .post(
        `http://${this.props.oyeURL}/oyesafe/api/v1/Announcement/Announcementcreate`,
        {
          ANImages: image,
          ANCmnts: `${comments}`,
          ACAccntID: accountId,
          ASAssnID: assocID,
          ANVoice: mp3
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
          }
        }
      )
      .then(response => {

        let announcementPath = `syncdashboard/isAnnouncementRefreshing/${assocID}`;
        let isAnnouncementNotificationUpdating = 0;

        

        fb.database().ref(announcementPath).set({
          isAnnouncementNotificationUpdating
        }).then((response)=>{
          console.log("Updated response:",response)
        }).catch(error=>{
          console.log("error while updating:",error)
        })

        fb.database().ref(announcementPath).remove().then((response)=>{
          console.log("Response Removed:",response)
        })

        console.log(
          'Respo1111:',
          response,
          response.data.data.announcement.anid
        );

        
        axios
          .post(`${CLOUD_FUNCTION_URL}/sendAllUserNotification`, {
            admin: 'false',
            ntType: ntType,
            ntDesc: ntDesc,
            ntTitle: ntTitle,
            associationID: associationId
          })
          .then(response_3 => {
            console.log('response_3', response_3);
            // this.setState({ loading: false });
            axios
              .get(
                `http://${this.props.oyeURL}/oyeliving/api/v1/Member/GetMemberListByAssocID/${this.props.dashboardReducer.assId}`,
                {
                  headers: {
                    'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
                    'Content-Type': 'application/json'
                  }
                }
              )
              .then(res => {
                let memberList = res.data.data.memberListByAssociation;
                let announcement = response.data.data.announcement.anid;
                console.log('RESPONSE', res);
                
                let removedDuplicates = _.uniqBy(memberList, 'acAccntID');
                console.log(
                  'memberList1111',
                  memberList,
                  removedDuplicates,
                  announcement
                );
                removedDuplicates.map(data => {
                  console.log('adminssss', ntType, data);
                  this.props.createUserNotification(
                    ntType,
                    this.props.oyeURL,
                    data.acAccntID,
                    this.props.dashboardReducer.assId.toString(),
                    ntDesc,
                    'announcment',
                    'announcment',
                    'announcement',
                    'announcment',
                    'announcment',
                    'announcment',
                    'announcment',
                    'announcment',
                    false,
                    this.props.userReducer.MyAccountID,
                    this.props.userReducer.MyISDCode+this.props.userReducer.MyMobileNumber,
                    "",
                    "",
                    announcement, 
                    );
                });
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

                 // isLoading: false,

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

                  timestamp: '',
                  loading: false
                };
                if(!this.state.paused){
                  
                  this.pause();
                }
                fb.database().ref(announcementPath).on('value',function(snapshot){
                  let receivedData = snapshot.val();
                   isAnnouncementNotificationUpdating = receivedData !== null?receivedData.isAnnouncementNotificationUpdating + 1:0
                })

                fb.database().ref(announcementPath).remove().then((response)=>{
                  console.log('Response:',response)
                }).catch(error=>{
                  this.setState({
                    isLoading: false
                  });
                  console.log("Error:",error);
                })
                this.setState({
                  isLoading: false
                });
                this.props.navigation.goBack();
                // getAssoMembers(oyeURL, MyAccountID);

                // this.props.updateJoinedAssociation(
                //   this.props.joinedAssociations,
                //   unitList.unUnitID
                // );
              })
              .catch(error => {
                // getAssoMembers(oyeURL, MyAccountID);
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

                  timestamp: '',
                  loading: false
                };

                console.log(error, 'errorAdmin');
              });
          });
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
        console.log('Crash in Announcement', error);
      });
  };

  validateAnnouncement(){
    this.setState({
      isLoading:true
    })
    if(this.state.comment.length === 0){
    this.setState({
      isLoading:false
    })
      Alert.alert("", "Message cannot be empty");
  }
    /*else if (!this.state.audioFile)
      Alert.alert("","Audio cannot be empty");*/
    else{
      this.datasend()
    }
  }

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
        <SafeAreaView style={{ backgroundColor: base.theme.colors.primary }}>
          <View style={[styles.viewStyle1, { flexDirection: 'row' }]}>
            <View style={styles.viewDetails1}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <View
                  style={{
                    height: hp('4%'),
                    width: wp('15%'),
                    alignItems: 'flex-start',
                    justifyContent: 'center'
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={require('../icons/back.png')}
                    style={styles.viewDetails2}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '35%',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Image
                // style={[styles.image]}
                source={require('../icons/OyespaceSafe.png')}
              />
            </View>
            <View style={{ width: '35%' }}>
              {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
            </View>
          </View>
          <View style={{ borderWidth: 1, borderColor: base.theme.colors.grey }} />
        </SafeAreaView>

        <View style={styles.viewForMyProfileText}>
          <Text
            style={{
              fontSize: hp('2.5%'),
              color: base.theme.colors.primary,
              textAlign: 'center'
            }}
          >
            {strings.announcement}
          </Text>
        </View>
        <KeyboardAwareScrollView>
          {/* <View
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >

          </View> */}

          <Card
            style={{
              flex:1,
              //height: hp('25%'),
              borderRadius: 10,
              marginLeft: hp('2%'),
              marginRight: hp('2%'),
              marginTop: hp('2%'),
              paddingBottom: hp('2%'),
              flexDirection: 'column',
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

            {/*<View
              style={{
                flexDirection: 'row',
                width: '100%',
                marginTop: hp('2%'),
                height: hp('8%'),
                backgroundColor:"yellow",
              }}
            >
              <View>
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
                    <Text>Recording...</Text>
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
                  borderRadius: hp('1%'),
                  //elevation: 5,
                  //shadowColor: base.theme.colors.darkgrey,
                  //shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 1},
                  //shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.8,
                  //shadowRadius:Platform.OS === 'ios' ? 2: 1, elevation: 5,  borderWidth: 0.5,
                }}
              >

                {this.state.playBtnId === 0 ? (
                  <Image source={
                    this.state.isPause ?
                    require('../icons/leave_vender_play1.png'):
                    require('../icons/leave_vender_pause.png')
                  } />
                ) : (
                  <View>
                    {this.state.playBtnId === 1 && (
                      <TouchableOpacity onPress={() =>{
                        console.log("this.state.isPause ",this.state.isPause);
                        this.setState({
                          isPause: !this.state.isPause
                        });
                        this.state.isPause ? this.play() : this.pause()
                      }
                      }
                          >
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

            </View>*/}
          </Card>
          <View
            style={{
              marginHorizontal: hp('3%'),
              marginTop: hp('2%')
            }}
          >
            <View style={{ marginTop: hp('2%'), marginBottom: hp('1%') }}>
              <Text style={{ fontSize: hp('1.8%') }}>Message</Text>
            </View>
            <View
              style={{
                borderColor: base.theme.colors.themeColor,
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
                <TextInput
                  multiline={true}
                  numberOfLines={4}
                  style={{ fontSize: hp('1.8%') }}
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="Write a comment here..."
                  onChangeText={comment => this.setState({ comment: comment })}
                />
              </Item>
            </View>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: hp('2%'),
                marginTop:'10%'
              }}
              onPress={() =>  {  this.validateAnnouncement()}}
            >
              <View
                
                style={styles.button}
                //disabled={this.state.comment.length === 0}
               // onPress={() => this.validateAnnouncement()}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: hp('2%'),
                    fontWeight: '500',
                    alignSelf:'center'
                  }}
                >
                  Send
                </Text>
              </View>
            </TouchableOpacity>
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
    userReducer: state.UserReducer
  };
};
export default connect(
  mapStateToProps,
  { createUserNotification }
)(Announcement);

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
    backgroundColor: base.theme.colors.themeColor,
    justifyContent: 'center',
    marginLeft: 30,
    marginRight: 30,
    borderColor: base.theme.colors.themeColor,
    marginBottom: hp('2%'),
  }
});
