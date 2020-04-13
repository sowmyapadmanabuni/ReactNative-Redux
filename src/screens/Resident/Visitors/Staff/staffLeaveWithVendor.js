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
  BackHandler, TextInput, TouchableHighlight, Linking, KeyboardAvoidingView, Alert
} from 'react-native';
import {
  heightPercentageToDP,
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
import { ratio, screenWidth } from './VendorStyles.js';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import StaffStyle from './StaffStyle.js';
import OSButton from "../../../../components/osButton/OSButton";
import {FlatList} from "react-native-gesture-handler";
import CreateSOSStyles from "../../../SOS/CreateSOSStyles";
import Modal from "react-native-modal";

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
        vendorImages:[],
      imagesString:"",
      comment:"",
      audioRecord:"",
      audioToServer:"",
      currentTime:"",
      timeStamp:"",
      selectedImage: "",
      isModalOpen:false,
      isRecord:false,
      isPlay:true,
      isAudioPMGranted:false
    };

  }
  componentDidMount() {
     this.checkPermission()
    this.getCurrentTime();

  }

  componentDidUpdate() {
    setTimeout(() => {
      BackHandler.addEventListener('hardwareBackPress', () =>
          this.processBackPress()
      );
    }, 100);
  }

  componentWillUnmount() {
    this.pause();
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

  getCurrentTime(){
    console.log('GET DATAAAAA',this.props.oyeURL)
    axios
        .get(`http://${this.props.oyeURL}/oyesafe/api/v1/GetCurrentDateTime`, {
          headers: {
            'Content-Type': 'application/json',
            'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
          }
        })
        .then(res => {
         // console.log('current time',res);
          console.log('current time',res.data.data.currentDateTime);

          this.setState({ currentTime:res.data.data.currentDateTime });
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
            this.setState({
              isAudioPMGranted: true
            })
            break; 
          case RESULTS.BLOCKED:
            //this.requestPermission();
            Alert.alert('Permissions blocked so Please allow from the settings')
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
            this.setState({
              isAudioPMGranted: true
            })
            break;
          case RESULTS.BLOCKED:
            //this.requestPermission();
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
      request(PERMISSIONS.ANDROID.RECORD_AUDIO).then(result => {
        console.log('GetThePERMISSIONRESULTS',result)
        this.setState({
          isAudioPMGranted:result =="denied" || result == "blocked" || result == "unavailable" ? false : true
        })
      });
    }
  };



  render() {
    console.log("APPPERMISSIONSGIVEN@@@@@",this.state.isAudioPMGranted)
    return(
    <View style={{height:'100%',width:'100%',backgroundColor:base.theme.colors.white}}>
      <KeyboardAwareScrollView>
        <View style={{
          height:'100%',
          width:'100%',
          backgroundColor:base.theme.colors.white,
        }}>
          <View style={{alignItems:'center',justifyContent:'center',marginTop:10,}}>
            <Text style={{fontSize:18,color:base.theme.colors.primary}}>Leave with Staff </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center',marginLeft:20,marginTop:20,}}>
            {this.props.staffReducer.staffProfilePic === '' ?
                <Image style={StaffStyle.staffImg}
                       source={{uri: "https://mediaupload.oyespace.com/" + base.utils.strings.noImageCapturedPlaceholder}}
                />
                :
                <Image style={StaffStyle.staffImg}
                       source={{uri: 'data:image/png;base64,'+this.props.staffReducer.staffProfilePic}}
                       />
            }
            <View style={{ marginLeft: 10,height:'100%',
              width: '80%',flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
              <Text style={StaffStyle.staffText}
                    numberofLines={1}
                    ellipsizeMode={'tail'}>{this.props.staffReducer.staffName}</Text>
              {this.props.staffReducer.staffDesignation !="" ?
                  <Text style={StaffStyle.desigText}> ({' '}{this.props.staffReducer.staffDesignation}{' '})</Text>
                  : <View/>}
            </View>
          </View>
          <View style={{width:'95%',alignSelf:'center',marginTop:25,
            borderRadius:10, borderColor: base.theme.colors.shadedWhite,
            shadowColor: base.theme.colors.darkgrey,
            shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 1},
            shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.8,
            shadowRadius:Platform.OS === 'ios' ? 2: 1, elevation: 5,  borderWidth: 0.5,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:base.theme.colors.white
            }}>
            <View style={{marginTop:15,flexDirection:'row',marginRight:10,alignSelf:'flex-start'}}>
              {this.state.vendorImages.length !==0 ?
                  <FlatList
                      keyExtractor={(item, index) => index.toString()}
                      data={this.state.vendorImages}
                      renderItem={(item, index) => this.renderImages(item, index)}
                      horizontal={true}
                  />
                  : <View/>}
              {this.state.vendorImages.length===5?
                  <View/>:
                  <TouchableOpacity style={{width:80,height:80,backgroundColor:base.theme.colors.shadedWhite,
                    alignItems:'center',justifyContent:'center',borderRadius:10,marginLeft:10}}
                                    onPress={() => this.selectImage()}>
                    <Image borderStyle
                           style={{height:40,width:40,marginBottom:5}}
                           source={require('../../../../../icons/leave_vender_add.png')}
                    />
                    <Text style={{fontSize:12,color:base.theme.colors.black}}>
                      Add Photo
                    </Text>
                  </TouchableOpacity>}
            </View>
            <View style={{flexDirection:'row',alignItems:'space-between',marginTop:35,marginLeft:5,marginRight:5,marginBottom:20}}>
              {!this.state.isRecord ?
                  <TouchableOpacity style={{alignItems:'center',justifyContent:'center'}} onPress={() =>
                    this.state.isAudioPMGranted? this.start(): this.checkPermission()}>
                    <Image borderStyle
                           style={{height:40,width:40}}
                           source={require('../../../../../icons/leave_vender_record.png')}
                    />
                  </TouchableOpacity> :
                  <TouchableOpacity style={{alignItems:'center',justifyContent:'center'}}  onPress={() =>this.stop()}>
                    <Image borderStyle
                           style={{height:40,width:40}}
                           source={require('../../../../../icons/leave_vender_stop.png')}
                    />
                  </TouchableOpacity>}
              <View style={{width:'65%',height:40,marginLeft:7,alignItems:'flex-start',justifyContent:'center',}}>
                <Text style={{fontSize:16,color:base.theme.colors.grey,marginBottom:5}}>{!this.state.isRecord? "Click to record":"Recording...."}</Text>
                <View style={{width:'100%',height:'10%',backgroundColor:base.theme.colors.shadedWhite,borderRadius:5}}></View>
              </View>
              {this.state.audioRecord == "" ?
                  <TouchableOpacity style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 40,
                    width: 40,
                    marginLeft: 10,
                    borderRadius: 8,
                    borderColor: base.theme.colors.lightgrey,
                    backgroundColor: base.theme.colors.white,
                    shadowColor: base.theme.colors.greyHead,
                    shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 1},
                    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.2,
                    shadowRadius: 1,
                    elevation: 5,
                    borderBottomWidth: 0.5,
                  }} onPress={() => Alert.alert('Please record a audio to listen')}>
                    <Image resizeMode={'center'}
                           style={{height: 40, width: 40}}
                           source={require('../../../../../icons/leave_vender_play1.png')}
                    />
                  </TouchableOpacity>
                  :
                  this.state.isPlay ?
                      <TouchableOpacity style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 40,
                        width: 40,
                        marginLeft: 10,
                        borderRadius: 8,
                        borderColor: base.theme.colors.lightgrey,
                        backgroundColor: base.theme.colors.white,
                        shadowColor: base.theme.colors.greyHead,
                        shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 1},
                        shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.2,
                        shadowRadius: 1,
                        elevation: 5,
                        borderBottomWidth: 0.5,
                      }} onPress={() => this.play()}>
                        <Image resizeMode={'center'}
                               style={{height: 40, width: 40}}
                               source={require('../../../../../icons/leave_vender_play.png')}
                        />
                      </TouchableOpacity>
                      :
                      <TouchableOpacity style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 40,
                        width: 40,
                        marginLeft: 10,
                        borderRadius: 8,
                        borderColor: base.theme.colors.lightgrey,
                        backgroundColor: base.theme.colors.white,
                        shadowColor: base.theme.colors.greyHead,
                        shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 1},
                        shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.2,
                        shadowRadius: 1,
                        elevation: 5,
                        borderBottomWidth: 0.5,
                      }} onPress={() =>this.pause()}>
                        <Image resizeMode={'center'}
                               style={{height: 40, width: 40}}
                               source={require('../../../../../icons/leave_vender_pause.png')}
                        />
                      </TouchableOpacity>
              }
            </View>
          </View>
          <View style={{width:'90%',alignSelf:'center',marginTop:20,marginBottom:30}}>
            {/*<Text style={{fontSize:15,color:base.theme.colors.black}}>Comment</Text>
            <View style={{height:80,width:'100%',borderColor:base.theme.colors.primary,
              borderWidth:1.5,borderRadius:10,marginTop:10,
              justifyContent:'center',alignItems:'center'}}>
              <TextInput
                  style={{height:30, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey,paddingBottom:5,width:'90%'}}
                  onChangeText={(text) => this.setState({comment:text})}
                  value={this.state.comment}
                  placeholder="Write a comment here..."
                  placeholderTextColor={base.theme.colors.grey}
              />

            </View>*/}
            <View style={{width:'100%',alignItems:'center',justifyContent:'center',marginTop:10,marginBottom:30}}>
              <OSButton
                  height={'50%'}
                  width={'30%'}
                  borderRadius={25}
                  oSBText={'Submit'}
                  onButtonClick={() => this.checkValidation()}/>
            </View>

          </View>

        </View>
      </KeyboardAwareScrollView>

    </View>
    );
  }

  renderImages(item, index) {
    console.log('Images list ',item)
    let imageURI = {uri: item.item.fileUrl};

    return (
        <View style={{
          height: 80,
          width: 90,
          flexDirection: 'row',
          marginLeft: 10,
          backgroundColor: base.theme.colors.shadedWhite,
          borderRadius: 10,
          padding: 5
        }}>
                     <TouchableOpacity
                    style={{alignSelf: 'flex-end',}}
                    onPress={() => this._enlargeImage(imageURI)}
                >
                  <Image
                      style={CreateSOSStyles.imageViewExp}
                      source={imageURI}
                  />
                </TouchableOpacity>
              <TouchableOpacity
                  style={{height: 20, width: 20,}}
                  onPress={() => this.deleteImageFromList(item)}
              >
                <Image
                    style={{height: 20, width: 20, position: 'absolute', alignSelf: 'flex-start', marginLeft: 3}}
                    source={require('../../../../../icons/close_btn1.png')}
                />
              </TouchableOpacity>
        </View>

    )

  }

  deleteImageFromList(item) {
    let self = this;
    let imageList = self.state.vendorImages;
    let newImgList = [];
    let j = 0;
    for (let i = 0; i < imageList.length; i++) {
      if (item.index != i) {
        newImgList[j] = imageList[i]
        j = j + 1
      }
    }
    self.setState({
      vendorImages: newImgList
    })
  }
  _enlargeImage(imageURI) {
    console.log("Sele:", imageURI);
    this.setState({
      selectedImage: imageURI,
      isModalOpen: true
    })
  }
  _renderModal1() {
    return (
        <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={this.state.vendorImages}
            horizontal={true}
            renderItem={(item, index) => this._renderModal(item, index)}
        />
    )
  }
  _renderModal() {
    return (
        <Modal
            onRequestClose={() => this.setState({isModalOpen: false})}
            isVisible={this.state.isModalOpen}>
          <View style={{height: heightPercentageToDP('30%'), justifyContent: 'center', alignItems: 'center',borderRadius:10}}>
            <Image
                resizeMode={'contain'}
                style={{
                  height: heightPercentageToDP('40%'),
                  width: heightPercentageToDP('40%'),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                source={this.state.selectedImage}
            />
            <TouchableHighlight
                underlayColor={base.theme.colors.transparent}
                style={{top: 20}}
                onPress={() => this.setState({isModalOpen: false})}>
              <Text style={CreateSOSStyles.emergencyHeader}>Close</Text>
            </TouchableHighlight>
          </View>
        </Modal>
    )
  }

  checkValidation(){
    let self=this;
    if(self.state.audioRecord==""){
      Alert.alert('Please record audio.It is mandatory')
    }
    else{
      self.uploadAudio(self.state.audioRecord)
    }
  }

  selectImage() {
    console.log('Set Image');
    const options = {
      quality: 0.5,
      maxWidth: 250,
      maxHeight: 250,
      cameraRoll: false,
      storageOptions: {
        skipBackup: true,
        path: 'tmp_files'
      },
    };
    let self = this;
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
        console.log('IssueHere',response.error)
      } else if (response.customButton) {
        console.log('IssueHere11111',response.error)
      } else {
        console.log('ImagePicker : ', response);
        let img = self.state.vendorImages;
        img.push({fileUrl:response.uri, type: 'Image', res:response,isUpload:false,dataUrl:response.data})
        self.setState({
          vendorImages: img,
        })

      }
    });

  }

  async uploadFile() {
    console.log('List coming to upload file',this.state.vendorImages);
    this.setState({isLoading:true})
    let self = this;
    let vendorImages = self.state.vendorImages;
    for (let i = 0; i < vendorImages.length; i++) {
      if(!vendorImages[i].isUpload) {
        let source = (Platform.OS === 'ios') ? vendorImages[i].res.uri : vendorImages[i].res.uri;
        const form = new FormData();
        let imgObj = {
          name: (vendorImages[i].res.fileName || vendorImages[i].res.name !== undefined) ? vendorImages[i].res.fileName ? vendorImages[i].res.fileName : vendorImages[i].res.name : "XXXXX.jpg",
          uri: source,
          type: (vendorImages[i].res.type !== undefined || vendorImages[i].res.type != null) ? vendorImages[i].res.type : "image/jpeg"
        };
        form.append('image', imgObj);

        let stat = await base.services.MediaUploadApi.uploadRelativeImage(form);
        console.log('List coming to upload file666666',stat);

        if (stat) {
          try {
            self.setState({
              imagesString: self.state.imagesString != '' ? self.state.imagesString + ',' + stat : stat,
            })
          } catch (err) {
            self.setState({
              isLoading: false
            })
            console.log('err', err)
          }
        }
      }
    }
    self.submitVendorDetails()
  }

  start = async () => {
    AudioRecord.init(options);
  
    AudioRecord.start();
    this.setState({isRecord:true})
    this.timeStamp();
  };

  timeStamp = () => {
    var time = Math.floor(Date.now());
    this.setState({
      timestamp: time
    });
  };

  stop = async () => {
    this.setState({isRecord:false})
    console.log('stop record');
    let audioFile = await AudioRecord.stop();
    console.log('audioFile', audioFile);
    this.setState({audioRecord:audioFile})
    //this.uploadAudio(audioFile);
  };

  uploadAudio = async result => {

    const path = Platform.OS === 'ios' ? result : `file://${result}`;
   console.log('UPLOADING AUDIO',path,result)
    const formData = new FormData();

    formData.append('file', {
      uri: path,
      name: `${this.state.timestamp}hello.wav`,
      type: 'audio/wav'
    });

    console.log(formData, 'FormData');
    let stat = await base.services.MediaUploadApi.uploadRelativeImage(formData);
    console.log('Uploaded Audio file',stat)
    try {
      this.setState({
        audioToServer:stat
      });
    } catch (e) {
      console.log('Errorrrrrrrrrrrrrr', e);
    }

    //this.uploadFile()
    this.submitVendorDetails()


  };

  play = async () => {
    this.setState({isPlay:false})

    try {
        await this.load();
      } catch (error) {
        console.log(error);


    }

    Sound.setCategory('Playback');

    this.sound.play(success => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
      this.setState({isPlay:true})
    });
  };

  pause = () => {
    this.sound.pause();
    this.setState({isPlay:true})
  };

  load = () => {
    return new Promise((resolve, reject) => {
      if (!this.state.audioRecord) {
        return reject('file path is empty');
      }

      this.sound = new Sound(this.state.audioRecord, '', error => {
        if (error) {
          console.log('failed to load the file', error);
          return reject(error);
        }
        this.setState({ loaded: true });
        return resolve();
      });
    });
  };

  async submitVendorDetails(){
    var imgUrl=this.state.imagesString;

    let vendorImages=this.state.vendorImages;
    if(vendorImages.length !==0){
      for(let i=0;i<vendorImages.length;i++){
        // if(vendorImages[i].isUpload){
        //   //dataUrl
        //   imgUrl=imgUrl !=''?imgUrl+','+vendorImages[i].fileUrl:vendorImages[i].fileUrl
        // }
        imgUrl=imgUrl !=''?imgUrl+','+vendorImages[i].dataUrl:vendorImages[i].dataUrl

      }
    }
    let self=this
    console.log('List coming to upload file&&&&&&',imgUrl)
    self.setState({
      isLoading: true
    });
    let visitorId=self.props.staffReducer.staffId
    console.log('UPDATE FIELDS IN STAFF',self.props.staffReducer.staffName,self.state.comment,imgUrl,self.state.audioToServer,visitorId)
    fetch(
        `http://${this.props.oyeURL}/oyesafe/api/v1/VisitorLog/UpdateLeaveWithVendor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
          },
          body: JSON.stringify({
            VLVenName: self.props.staffReducer.staffName,
            VLCmnts: self.state.comment,
            VLVenImg: imgUrl,
            VLVoiceNote:self.state.audioToServer,
            VLVisLgID:visitorId
          })
        }
    )
        .then(response => response.json())
        .then(responseJson => {
          console.log('Reports_Data@@@@@@', responseJson);
          gateFirebase
              .database()
              .ref(
                  `NotificationSync/A_${this.props.dashboardReducer.assId}/${visitorId}`
              )
              .update({
                newAttachment:true,
                updatedTime:self.state.currentTime
              });
          this.setState({
            isLoading: false,
          });
        //  this.pause();
          this.setState({
            vendorImages:[],
            imagesString:"",
            comment:"",
            audioRecord:"",
            audioToServer:"",
           // currentTime:"",
            timeStamp:"",
            selectedImage: "",
            isModalOpen:false,
            isRecord:false,
            isPlay:true,
          })
          this.props.navigation.goBack();
        })
        .catch(error => {
          this.setState({
            isLoading: false,
          });
          console.log(error, '&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
        });
  }




}

const mapStateToProps = state => {
  return {
    oyeURL: state.OyespaceReducer.oyeURL,
    dashboardReducer: state.DashboardReducer,
    userReducer: state.UserReducer,
    staffReducer: state.StaffReducer,
    assId:state.DashboardReducer.assId ,
    uniID: state.DashboardReducer.uniID,

  };
};
export default connect(mapStateToProps)(StaffLeaveWithVendor);

