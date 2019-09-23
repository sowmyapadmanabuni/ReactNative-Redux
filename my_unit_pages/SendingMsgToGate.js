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
  Platform
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-picker';
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
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType
} from 'react-native-audio-recorder-player';
import { ratio, screenWidth } from './Styles.js';
import moment from 'moment';
import { connect } from 'react-redux';

var audioRecorderPlayer;
class HelloWorldApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      relativeImage1: '',
      relativeImage2: '',
      relativeImage3: '',
      relativeImage4: '',
      relativeImage5: '',

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

      datasource: []
    };
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
  }

  componentDidMount() {
    this.visitorData();
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
              photo: response.uri,
              photoDetails: response,
              isPhotoAvailable: true,
              imagePath: response.path,
              relativeImage1: response.uri
            });
            alert(response.uri);
            break;
          case 2:
            self.setState({
              photo: response.uri,
              photoDetails: response,
              isPhotoAvailable: true,
              imagePath: response.path,
              relativeImage2: response.uri
            });
            alert(response.uri);
            break;
          case 3:
            self.setState({
              photo: response.uri,
              photoDetails: response,
              isPhotoAvailable: true,
              imagePath: response.path,
              relativeImage3: response.uri
            });
            alert(response.uri);
            break;
          case 4:
            self.setState({
              photo: response.uri,
              photoDetails: response,
              isPhotoAvailable: true,
              imagePath: response.path,
              relativeImage4: response.uri
            });
            alert(response.uri);
            break;
          case 5:
            self.setState({
              photo: response.uri,
              photoDetails: response,
              isPhotoAvailable: true,
              imagePath: response.path,
              relativeImage5: response.uri
            });
            alert(response.uri);
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
      android: 'sdcard/hello.mp4'
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
    alert('Recording Started');
    console.log(`uri: ${uri}`);
  };

  onStopRecord = async () => {
    const result = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
      buttonId: 1,
      playBtnId: 1
    });
    alert('Recording Stop');
    console.log(result);
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

  visitorData = async () => {
    this.setState({ isLoading: true });
    let date = moment(new Date().getDate()).format('YYYY-MM-DD');
    console.log('Date:', date);
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
            StartDate: date, //'2019-09-04',
            EndDate: date, //'2019-09-23', //moment(new Date()).format('YYYY-MM-DD'),
            ASAssnID: this.props.dashBoardReducer.assId,
            UNUnitID: this.props.dashBoardReducer.uniID,
            ACAccntID: this.props.userReducer.MyAccountID
          })
        }
      )
        .then(response => response.json())
        .then(responseJson => {
          //var count = Object.keys(responseJson.data.visitorlogbydate).length;
          //console.log("fsbkfh", count);
          if (responseJson.success) {
            let data = responseJson.data.visitorlog.filter(
              x => x.vlVisType === 'Delivery'
            );
            let visitors = [];
            let visitorObj = {};
            for (let i in data) {
              console.log(i);
              visitorObj = {
                value: data[i].vlfName,
                id: data[i].vlVisLgID
              };
              visitors.push(visitorObj);
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
  render() {
    let playWidth =
      (this.state.currentPositionSec / this.state.currentDurationSec) *
      (screenWidth - 56 * ratio);
    if (!playWidth) playWidth = 0;

    return (
      <View style={styles.container}>
        <SafeAreaView style={{ backgroundColor: '#ff8c00' }}>
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
                style={[styles.image]}
                source={require('../icons/OyespaceSafe.png')}
              />
            </View>
            <View style={{ width: '35%' }}>
              {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
            </View>
          </View>
          <View style={{ borderWidth: 1, borderColor: 'orange' }} />
        </SafeAreaView>
        <View style={styles.viewForMyProfileText}>
          <Text
            style={{
              fontSize: hp('2.5%'),
              color: '#ff8c00',
              textAlign: 'center'
            }}
          >
            Leave with Vendor
          </Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Dropdown
            value={'Select Visitor'}
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
            dropdownPosition={-6}
            dropdownOffset={{ top: 0, left: 0 }}
            style={{ fontSize: hp('2.2%') }}
            //   onChangeText={(value, index) => this.changeFamilyMember(value, index)}
          />
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
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
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
                        source={{ uri: this.state.relativeImage1 }}
                      />
                    </View>
                    <TouchableOpacity>
                      <View style={styles.imagesmallCircle}>
                        <View
                          style={{
                            // backgroundColor: 'red',
                            width: hp('5%'),
                            height: hp('5%'),
                            zIndex: 100
                          }}
                        >
                          <ZoomImage
                            style={[styles.smallImage]}
                            source={{ uri: this.state.relativeImage1 }}
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
                            // backgroundColor: 'red',
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
                              color: '#000',
                              fontWeight: '500'
                              // backgroundColor: 'red'
                            }}
                          >
                            +
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
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
                          source={{ uri: this.state.relativeImage2 }}
                        />
                      </View>
                      <TouchableOpacity>
                        <View style={styles.imagesmallCircle}>
                          <View
                            style={{
                              // backgroundColor: 'red',
                              width: hp('5%'),
                              height: hp('5%'),
                              zIndex: 100
                            }}
                          >
                            <ZoomImage
                              style={[styles.smallImage]}
                              source={{ uri: this.state.relativeImage2 }}
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
                              // backgroundColor: 'red',
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
                                color: '#000',
                                fontWeight: '500'
                                // backgroundColor: 'red'
                              }}
                            >
                              +
                            </Text>
                          </View>

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
                        </View>
                      </TouchableOpacity>
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
                          source={{ uri: this.state.relativeImage3 }}
                        />
                      </View>
                      <TouchableOpacity>
                        <View style={styles.imagesmallCircle}>
                          <View
                            style={{
                              // backgroundColor: 'red',
                              width: hp('5%'),
                              height: hp('5%'),
                              zIndex: 100
                            }}
                          >
                            <ZoomImage
                              style={[styles.smallImage]}
                              source={{ uri: this.state.relativeImage3 }}
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
                              // backgroundColor: 'red',
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
                                color: '#000',
                                fontWeight: '500'
                                // backgroundColor: 'red'
                              }}
                            >
                              +
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
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
                          source={{ uri: this.state.relativeImage4 }}
                        />
                      </View>
                      <TouchableOpacity>
                        <View style={styles.imagesmallCircle}>
                          <View
                            style={{
                              // backgroundColor: 'red',
                              width: hp('5%'),
                              height: hp('5%'),
                              zIndex: 100
                            }}
                          >
                            <ZoomImage
                              style={[styles.smallImage]}
                              source={{ uri: this.state.relativeImage4 }}
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
                              // backgroundColor: 'red',
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
                                color: '#000',
                                fontWeight: '500'
                                // backgroundColor: 'red'
                              }}
                            >
                              +
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
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
                          source={{ uri: this.state.relativeImage5 }}
                        />
                      </View>
                      <TouchableOpacity>
                        <View style={styles.imagesmallCircle}>
                          <View
                            style={{
                              // backgroundColor: 'red',
                              width: hp('5%'),
                              height: hp('5%'),
                              zIndex: 100
                            }}
                          >
                            <ZoomImage
                              style={[styles.smallImage]}
                              source={{ uri: this.state.relativeImage5 }}
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
                              // backgroundColor: 'red',
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
                                color: '#000',
                                fontWeight: '500'
                                // backgroundColor: 'red'
                              }}
                            >
                              +
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
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
              marginTop: hp('2%')
              // backgroundColor: 'yellow'
            }}
          >
            <View>
              {this.state.buttonId === 1 ? (
                <TouchableOpacity onPress={() => this.onStartRecord()}>
                  <Image
                    style={{
                      width: hp('5%'),
                      height: hp('5%'),
                      marginLeft: hp('1%')
                    }}
                    source={require('../icons/leave_vender_record.png')}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => this.onStopRecord()}>
                  <Image
                    style={{
                      width: hp('5%'),
                      height: hp('5%'),
                      marginLeft: hp('1%')
                    }}
                    source={require('../icons/leave_vender_stop.png')}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <View style={{ alignItems: 'center' }}>
                {this.state.buttonId === 1 ? (
                  <Text>Click mic to record</Text>
                ) : (
                  <Text style={styles.txtRecordCounter}>
                    {this.state.recordTime}
                  </Text>
                )}
              </View>
              <View style={styles.viewPlayer}>
                <TouchableOpacity
                  style={styles.viewBarWrapper}
                  onPress={this.onStatusPress}
                >
                  <View style={styles.viewBar}>
                    <View style={[styles.viewBarPlay, { width: playWidth }]} />
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                {this.state.playBtnId === 2 ? (
                  <Text style={styles.txtCounter}>
                    {this.state.playTime} / {this.state.duration}
                  </Text>
                ) : (
                  <View></View>
                )}
              </View>
            </View>
            <Card
              style={{
                width: hp('5%'),
                height: hp('5%'),
                marginRight: hp('1%'),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: hp('1%')
              }}
            >
              {this.state.playBtnId === 0 ? (
                <Image source={require('../icons/leave_vender_play1.png')} />
              ) : (
                <View>
                  {this.state.playBtnId === 1 ? (
                    <TouchableOpacity onPress={() => this.onStartPlay()}>
                      <Image
                        source={require('../icons/leave_vender_play.png')}
                      />
                    </TouchableOpacity>
                  ) : (
                    <View>
                      {/* {this.state.buttonId === 1 &&
                      this.state.playBtnId === 2 ? ( */}
                      <TouchableOpacity onPress={() => this.onStopPlay()}>
                        <Image
                          source={require('../icons/leave_vender_pause.png')}
                        />
                      </TouchableOpacity>
                      {/* ) : (
                        <View></View>
                      )} */}
                    </View>
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
              borderColor: '#ff8c00',
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
                onChangeText={emailId => this.setState({ emailId: emailId })}
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
              // onPress={() => this.sendInvitation()}
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
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    oyeURL: state.OyespaceReducer.oyeURL,
    dashBoardReducer: state.DashboardReducer,
    userReducer: state.UserReducer
  };
};
export default connect(mapStateToProps)(HelloWorldApp);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  viewStyle1: {
    backgroundColor: '#fff',
    height: hp('7%'),
    width: '100%',
    shadowColor: '#000',
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
    borderColor: '#ff8c00',
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  viewForMyProfileText: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: hp('1.8%')
  },
  containerView_ForProfilePicViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'yellow',
    height: hp('20%'),
    width: hp('12%'),
    marginTop: hp('2%')
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
    backgroundColor: '#ccc',
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
    backgroundColor: 'white',
    justifyContent: 'center',
    marginLeft: 30,
    marginRight: 30,
    borderColor: '#fff',
    marginBottom: hp('2%'),
    backgroundColor: '#ff8c00'
  }
});
