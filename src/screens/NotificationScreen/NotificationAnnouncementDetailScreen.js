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
  ActivityIndicator
} from 'react-native';
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
import ZoomImage from 'react-native-zoom-image';
import axios from 'axios';

import Sound from 'react-native-sound';
import AudioRecord from 'react-native-audio-record';
import RNFetchBlob from 'rn-fetch-blob';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType
} from 'react-native-audio-recorder-player';
import { ratio, screenWidth } from './Styles.js';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import Styles from './NotificationAnnouncementDetailScreenStyles.js';
import base from '../../base';
import { Easing } from 'react-native';
import { connect } from 'react-redux';

import { storeOpenedNotif, onNotificationOpen } from '../../actions';

class NotificationAnnouncementDetailScreen extends Component {
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

      imageData: '',
      image1: '',
      image2: '',
      image3: '',
      image4: '',
      image5: '',
      voice: '',
      notes: '',

      audioFile: '',
      recording: false,
      loaded: false,
      paused: true,

      isPause: true,
    };
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }


  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    let self = this;
    const { navigation } = this.props;
    // const details = navigation.getParam("details", "NO-ID");
    const index = navigation.getParam('index', 'NO-ID');
    const notifications = navigation.getParam('notifications', 'NO-ID');
    const ntid = navigation.getParam('ntid', 'NO-ID');
    const oyeURL = navigation.getParam('oyeURL', 'NO-ID');
    const savedNoifId = navigation.getParam('savedNoifId', 'NO-ID');
    this.props.onNotificationOpen(notifications, index, oyeURL);
    this.props.storeOpenedNotif(savedNoifId, ntid);
    setTimeout(() => {
      this.setState({
        isLoading: false
      });
      self.getAnnouncementData();
    }, 1000);
  }

  /*componentDidUpdate() {
    setTimeout(() => {
      BackHandler.addEventListener('hardwareBackPress', () =>
        this.processBackPress()
      );
    }, 100);
  }*/

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
   if(!this.state.paused){
     this.pause();
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
    console.log("PLAY");
    if (!this.state.loaded) {
      try {
        await this.load();
      } catch (error) {
        console.log(error);
      }
    }

    this.setState({ paused: false, playBtnId: 1 });
    Sound.setCategory('Playback');

    this.sound.play(success => {
      if (success) {
        console.log('successfully finished playing');
        this.setState({
          isPause: true,
          playBtnId: 0,
        });
      } else {
        console.log('playback failed due to audio decoding errors');
      }
      this.setState({ paused: true, playBtnId: 1 });
      // this.sound.release();
    });
  };

  pause = () => {
    console.log("PAUSE...")
    this.sound.pause();
    this.setState({ paused: true, playBtnId: 0 });
  };

  onStartPlay = async () => {
    const path = Platform.select({
      ios: 'hello.aac',
      android: 'hello.aac'
    });
    const msg = await this.audioRecorderPlayer.startPlayer(path);
    this.audioRecorderPlayer.setVolume(1.0);
    console.log(msg);
    this.audioRecorderPlayer.addPlayBackListener(e => {
      if (e.current_position === e.duration) {
        console.log('finished');
        this.audioRecorderPlayer.stopPlayer();
        this.setState({
          playBtnId: 1
        });
      }
      this.setState({
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.current_position)
        ),
        duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
        playBtnId: 1
      });
      console.log('Play Button Id', this.state.playTime);
    });
  };

  onStopPlay = async () => {
    console.log('onStopPlay');
    this.audioRecorderPlayer.stopPlayer();
    this.audioRecorderPlayer.removePlayBackListener();
    this.setState({
      playBtnId: 0
    });
  };

  getAnnouncementData = () => {
    let params = this.props.navigation.state.params;
    let associationid = params.associationid;
    let accountid = params.accountid;
    let notifyid = params.notifyid;
    console.log('params', notifyid, accountid, associationid,this.props.oyeURL);
    this.setState({
      isLoading: true
    });
    //http://apidev.oyespace.com/oyesafe/api/v1/Announcement/GetAnnouncementDetailsByAssocAndAnnouncementID/%7BAssociationID%7D/%7BAnnouncementID%7D
    axios
      .get(
        `http://${this.props.oyeURL}/oyesafe/api/v1/Announcement/GetAnnouncementDetailsByAssocAndAnnouncementID/${associationid}/${notifyid}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
          }
        }
      )
      .then(response => {
        console.log('Announcement_response', response);
        let accounceDetails = response.data.data.announcements[0];

        RNFetchBlob.config({
          fileCache: true,
          // by adding this option, the temp files will have a file extension
          appendExt: 'wav'
        })
          .fetch(
            'GET',
            `http://mediaupload.oyespace.com/${accounceDetails.anVoice}`,
            {
              //some headers ..
            }
          )
          .then(res => {
            // the temp file path with file extension `png`
            console.log('The file saved to ', res.path());
            // alert(JSON.stringify(res.path()));

            console.log('Announcement_Dataaaa', response);
            this.setState({
              isLoading: false,
              imageData: response.data.data.announcements[0].anImages,
              image1:
                'https://mediaupload.oyespace.com/' +
                response.data.data.announcements[0].anImages.split(',')[0],
              image2:
                'https://mediaupload.oyespace.com/' +
                response.data.data.announcements[0].anImages.split(',')[1],
              image3:
                'https://mediaupload.oyespace.com/' +
                response.data.data.announcements[0].anImages.split(',')[2],
              image4:
                'https://mediaupload.oyespace.com/' +
                response.data.data.announcements[0].anImages.split(',')[3],
              image5:
                'https://mediaupload.oyespace.com/' +
                response.data.data.announcements[0].anImages.split(',')[4],
              voice: response.data.data.announcements[0].anVoice,
              notes: response.data.data.announcements[0].anCmnts
            });
            console.log(
              'Announcement_Data',
              response.data.data.announcements[0]
            );
            console.log(
              'Announcement_Data',
              response.data.data.announcements[0].anImages.split(',')[0]
            );
            console.log(
              'Announcement_Data',
              response.data.data.announcements[0].anImages.split(',')[1]
            );
            console.log(
              'Announcement_Data',
              response.data.data.announcements[0].anImages.split(',')[2]
            );
            console.log(
              'Announcement_Data',
              response.data.data.announcements[0].anImages.split(',')[4]
            );
            console.log(
              'Announcement_Data',
              response.data.data.announcements[0].anImages.split(',')[3]
            );

            // this.setState({
            //   audioFile:
            //     Platform.OS === 'android'
            //       ? 'file://' + res.path()
            //       : '' + res.path()
            // });

            this.setState({
              audioFile: res.path()
            });
            // Beware that when using a file path as Image source on Android,
            // you must prepend "file://"" before the file path
            // imageView = (
            //   <Image
            //     source={{
            //       uri:
            //         Platform.OS === 'android'
            //           ? 'file://' + res.path()
            //           : '' + res.path()
            //     }}
            //   />
            // );
          });
      }).catch = e => {
      this.setState({
        isLoading: false,})
      console.log("ERROR IN ANNOUNCEMENT",e);
    };
  };
  render() {
    let playWidth =
      (this.state.currentPositionSec / this.state.currentDurationSec) *
      (screenWidth - 56 * ratio);
    if (!playWidth) playWidth = 0;

    console.log('imageData', this.state.imageData);
    return (
      <View style={Styles.container}>
        <SafeAreaView style={{ backgroundColor: '#ff8c00' }}>
          <View style={Styles.viewStyle1}>
            <View style={Styles.viewDetails1}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <View style={Styles.innerview}>
                  <Image
                    resizeMode="contain"
                    source={require('../../../icons/back.png')}
                    style={Styles.viewDetails2}
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
                style={Styles.image1}
                source={require('../../../icons/OyespaceSafe.png')}
              />
            </View>
            <View style={{ width: '35%' }}>
              {/* <Image source={require('../../../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
            </View>
          </View>
          <View style={{ borderWidth: 1, borderColor: 'orange' }} />
        </SafeAreaView>
        <View style={Styles.mainview}>
          <Text style={Styles.maintext}>Announcements</Text>
        </View>
        <Card style={Styles.card}>
          <View style={Styles.outerview}>
            <View style={Styles.firstview}>
              {this.state.imageData !== 'No Image' ? (
                <View style={Styles.firstview}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    <ZoomImage
                      source={{ uri: this.state.image1 }}
                      // style={Styles.image}
                      imgStyle={{
                        height: hp('10%'),
                        width: hp('10%'),
                        borderRadius: hp('1%'),
                        margin: hp('1%')
                      }}
                      duration={200}
                      enableScaling={false}
                      easingFunc={Easing.bounce}
                    />
                    <ZoomImage
                      source={{
                        uri: this.state.image2
                      }}
                      // style={Styles.image}
                      imgStyle={Styles.image}
                      duration={200}
                      enableScaling={false}
                      easingFunc={Easing.bounce}
                    />
                    <ZoomImage
                      source={{
                        uri: this.state.image3
                      }}
                      // style={Styles.image}
                      imgStyle={Styles.image}
                      duration={200}
                      enableScaling={false}
                      easingFunc={Easing.bounce}
                    />
                    <ZoomImage
                      source={{
                        uri: this.state.image4
                      }}
                      // style={Styles.image}
                      imgStyle={Styles.image}
                      duration={200}
                      enableScaling={false}
                      easingFunc={Easing.bounce}
                    />
                    <ZoomImage
                      source={{
                        uri: this.state.image5
                      }}
                      // style={Styles.image}
                      imgStyle={Styles.image}
                      duration={200}
                      enableScaling={false}
                      easingFunc={Easing.bounce}
                    />
                  </ScrollView>
                </View>
              ) : (
                <View style={Styles.textview}>
                  <Text style={Styles.text}>No image available.</Text>
                </View>
              )}
            </View>
            {this.state.voice === '' ? null : (
              <View style={Styles.secondview}>
                <Card style={Styles.playcardstyle}>
                  <View
                    style={{
                      width: hp('5%'),
                      height: hp('5%'),
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <TouchableOpacity onPress={() => {
                      this.setState({
                        isPause: !this.state.isPause
                      });
                      this.state.isPause ? this.play() : this.pause()
                    }
                    }>
                      <View
                        style={{
                          width: hp('5%'),
                          height: hp('5%'),
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Image source={
                          this.state.isPause ?
                              require('../../../icons/leave_vender_play.png'):
                              require('../../../icons/leave_vender_pause.png')
                        } />
                      </View>
                    </TouchableOpacity>
                  </View>
                </Card>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: hp('2.8%')
                  }}
                >
                  <Text>Click to play</Text>
                </View>
              </View>
            )}
          </View>
        </Card>
        <View style={Styles.thirdview}>
          <View style={Styles.message}>
            <Text style={Styles.messages}>Message</Text>
          </View>
          <View style={Styles.textbox}>
            <Text style={Styles.notes}>{this.state.notes}</Text>
          </View>
        </View>
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
  { onNotificationOpen, storeOpenedNotif }
)(NotificationAnnouncementDetailScreen);
