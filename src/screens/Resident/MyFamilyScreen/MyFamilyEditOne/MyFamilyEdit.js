import React, {Component} from "react"
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import ImagePicker from "react-native-image-picker";
import {Dropdown} from "react-native-material-dropdown";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import base from "../../../../base";
import {connect} from "react-redux";
import ContactsWrapper from "react-native-contacts-wrapper";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
const RNFS = require('react-native-fs');

import Style from '../MyFamilyAdd/Style';

class MyFamilyEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      relationList: [
        {
          value: "Spouse",
          id: 0
        }, {
          value: "Parents",
          id: 1
        }, {
          value: "Siblings",
          id: 2
        }, {
          value: "Child",
          id: 3
        }, {
          value: "Relative ",
          id: 4
        }, {
          value: "Other",
          id: 5
        }],
      relationName: '',
      cCode: '',
      mobileNumber: '',
      sendNum: '',
      isMinor: false,
      firstName: '',
      lastName: '',
      minorProps: [{label: 'Yes', value: 0},
        {label: 'No', value: 1}],
      isMinorSelected: 0,
      guardianName: '',
      relativeImage: '',
      imageUrl: '',
    }
  }

  componentWillMount() {
    this.setState({
      firstName: this.props.navigation.state.params.fmName,
      lastName: this.props.navigation.state.params.fmlName,
      mobileNumber: this.props.navigation.state.params.fmMobile
    })
  }

  render() {
    console.log('Isminor', this.state, this.props, this.props.navigation.state.params) //check the data and show according to it
    let mobPlaceHolder = this.state.isMinor && this.state.isMinorSelected === 0 ? "Guardian's Number" : "Mobile Number";
    return (
        <SafeAreaView style={Style.container}>
          <View style={Style.headerStyles}>
            <TouchableOpacity style={{width: '30%'}} onPress={() => {
              this.props.navigation.goBack()
            }}>
              <Image source={require("../../../../../icons/backBtn.png")}
                     style={Style.backIcon}/>
            </TouchableOpacity>
            <View style={{width: '30%', alignItems: 'center'}}>
              <Image source={require("../../../../../icons/headerLogo.png")}
                     style={{width: 50, height: 50}}/>
            </View>
            <View style={Style.nextView}>
              <TouchableOpacity style={Style.nextButton} onPress={() => this.validation()}>
                <Text style={Style.nextText}>NEXT</Text>
              </TouchableOpacity>
            </View>

          </View>
          <View style={Style.addFamilyMem}>
            <Text style={Style.addFamilyText}>Edit Family Member</Text>
          </View>
          <ScrollView>
            <View style={Style.subContainer}>
              <TouchableOpacity style={Style.relativeImgView} onPress={() => this.setImage()}>
                {this.props.navigation.state.params.fmImgName === '' && this.state.relativeImage ==='' ?
                    <Image style={{height: 40, width: 40, alignSelf: 'center'}}
                           source={require('../../../../../icons/camera.png')}
                    />
                    :
                    <Image style={{height: 90, width: 90, borderRadius: 45, alignSelf: 'center'}}
                           source={{uri: this.state.relativeImage===''?"http://mediaupload.oyespace.com/" +this.props.navigation.state.params.fmImgName:this.state.relativeImage}}/>
                }
              </TouchableOpacity>
            </View>
            <View style={Style.famTextView}>
              <Text style={Style.famText}>Family Details</Text>
            </View>
            <View style={Style.subMainView}>
              <Dropdown
                  value={this.props.navigation.state.params.fmRltn}
                  data={this.state.relationList}
                  textColor={base.theme.colors.black}
                  inputContainerStyle={{}}
                  //  label="Select Relationship"
                  baseColor="rgba(0, 0, 0, 1)"
                  placeholder="Relationship*"
                  placeholderTextColor={base.theme.colors.black}
                  labelHeight={hp("4%")}
                  containerStyle={{
                    width: wp("85%"),
                    height: hp("8%"),
                  }}
                  rippleOpacity={0}
                  dropdownPosition={-6}
                  dropdownOffset={{top: 0, left: 0,}}
                  style={{fontSize: hp("2.2%")}}
                  onChangeText={(value, index) => this.changeFamilyMember(value, index)}
              />
              <View style={Style.textInputView}>
                <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left'}}>First Name
                  <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                <TextInput
                    style={{height: 50, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey}}
                    onChangeText={(text) => this.setState({firstName: text})}
                    value={this.state.firstName}
                    placeholder="First Name"
                    placeholderTextColor={base.theme.colors.grey}
                />
              </View>
              <View style={Style.textInputView}>
                <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left'}}>Last Name
                  <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                <TextInput
                    style={{height: 50, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey}}
                    onChangeText={(text) => this.setState({lastName: text})}
                    value={this.state.lastName}
                    placeholder="Last Name"
                    placeholderTextColor={base.theme.colors.grey}
                    keyboardType={'default'}
                />
              </View>
              {this.state.isMinor ?
                  <View style={{
                    flexDirection: 'row',
                    height: '6%',
                    width: '90%',
                    justifyContent: 'flex-start',
                    marginTop: 25,
                  }}>
                    <Text style={{fontSize: 14, color: base.theme.colors.black}}>Minor</Text>
                    <RadioForm formHorizontal={true} animation={true}>
                      {this.state.minorProps.map((obj, i) => {
                        let onPress = (value, index) => {
                          this.setState({
                            isMinorSelected: value
                          })
                        };
                        return (
                            <RadioButton labelHorizontal={true} key={i.toString()}>
                              <RadioButtonInput
                                  obj={obj}
                                  index={i.toString()}
                                  isSelected={this.state.isMinorSelected === i}
                                  onPress={onPress}
                                  buttonInnerColor={base.theme.colors.primary}
                                  buttonOuterColor={base.theme.colors.primary}
                                  buttonSize={10}
                                  buttonStyle={{borderWidth: 0.7}}
                                  buttonWrapStyle={{marginLeft: 40}}
                              />
                              <RadioButtonLabel
                                  obj={obj}
                                  index={i.toString()}
                                  onPress={onPress}
                                  labelStyle={{color: base.theme.colors.black}}
                                  labelWrapStyle={{marginLeft: 10}}
                              />
                            </RadioButton>
                        )
                      })}
                    </RadioForm>
                  </View>
                  : <View/>}
              {this.state.isMinor && this.state.isMinorSelected === 0 ?
                  <View style={Style.textInputView}>
                    <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left'}}>Guardian's
                      Name
                      <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                    <TextInput
                        style={{height: 50, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey}}
                        onChangeText={(text) => this.setState({guardianName: text})}
                        value={this.props.navigation.state.params.fmGurName}
                        placeholder="Guardian's Name"
                        placeholderTextColor={base.theme.colors.grey}
                        keyboardType={'default'}
                    />
                  </View>
                  : <View/>}
              <View style={[Style.textInputView, {
                borderBottomWidth: 1,
                borderColor: base.theme.colors.lightgrey, marginBottom: 10
              }]}>
                <Text style={{
                  fontSize: 14,
                  color: base.theme.colors.black,
                  textAlign: 'left'
                }}>{mobPlaceHolder}
                  <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                <View style={Style.mobNumView}>
                  <TextInput
                      style={{height: 50, width: '80%',}}
                      onChangeText={(text) => this.setState({mobileNumber: text})}
                      value={this.state.mobileNumber}
                      placeholder={mobPlaceHolder}
                      placeholderTextColor={base.theme.colors.grey}
                      keyboardType={'phone-pad'}
                  />
                  <TouchableOpacity style={{width: 35, height: 35,}} onPress={() => this.getTheContact()}>
                    <Image source={require("../../../../../icons/phone-book.png")}
                           style={{width: 25, height: 25,}}/>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
    )
  }

  setImage() {
    console.log('Set Image')
    const options = {
      quality: (Platform.OS === 'ios' ? 0 : 1),
      maxWidth: 1000,
      maxHeight: 1000,
      storageOptons: {
        skipBackup: true
      }
    };
    let self = this;
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        console.log('ImagePicker : ', response);
        if (Platform.OS === 'ios') {
          console.log(response);
          self.uploadImage(response);
        } else {
          console.log('response', response);
          self.uploadImage(response);
        }

      }
    });

  }

  async uploadImage(response) {
    let self = this;
    let source = (Platform.OS === 'ios') ? response.uri : response.uri;
    const form = new FormData();
    let imgObj = {
      name: (response.fileName !== undefined) ? response.fileName : "XXXXX.jpg",
      uri: source,
      type: (response.type !== undefined || response.type != null) ? response.type : "image/jpeg"
    };
    form.append('image', imgObj)
    let stat = await base.services.MediaUploadApi.uploadRelativeImage(form);
    console.log('Photo upload response', stat)
    if (stat) {
      try {
        self.setState({
          relativeImage:response.uri,
          imageUrl:stat
        })

      } catch (err) {
        console.log('err', err)
      }
    }

  }

  deleteImage() {
    let filePath = this.state.relativeImage;
    RNFS.exists(filePath).then((result) => {
      if (result) {
        return RNFS.unlink(filePath).then(() => {
          console.log("File deleted", filePath)
          RNFS.scanFile(filePath)
              .then(() => {
                console.log('scanned');
              })
              .catch(err => {
                console.log(err);
              });
        }).catch((err) => {
          console.log(err)
        })
      }
    })
  }


  changeFamilyMember(value, index) {
    console.log('New Details', value, index)
    this.setState({
      relationName: value
    })
    if (value === 'Child') {
      this.setState({
        isMinor: true,
       // firsName:'',
        //lastName:'',
        mobileNumber:'',
        guardianName:''
      })
    } else {
      this.setState({
        isMinor: false
      })
    }
  }

  async getTheContact() {
    console.log('Get details', Platform.OS);
    let isGranted = false;
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        isGranted = true
      }

    } else {
      isGranted = true
    }

    if (isGranted) {
      ContactsWrapper.getContact()
          .then((contact) => {
            console.log('Details for mob', contact)
            let name = contact.name.split(" ")
            let mobCode = contact.phone.split('')
            let mobNum = contact.phone.replaceAll(/[ !@#$%^&*()_\-=\[\]{};':"\\|,.<>\/?]/, '')
            let sendMob = contact.phone.split(" ")

            if (mobCode[0] === '+') {
              console.log('plus')
              let mobCode2 = contact.phone.split(" ")
              console.log('mobCode', sendMob, mobCode, mobCode2, mobCode2[0])
              let arr = '';
              for (let i = 1; i < sendMob.length; i++) {
                arr = arr + sendMob[i]
              }
              console.log('mobbbbbb', arr)
              this.setState({
                cCode: mobCode2[0],
                sendNum: arr
              })

            } else {
              this.setState({
                sendNum: mobNum
              })
            }
            if (this.state.isMinor && this.state.isMinorSelected === 0) {
              this.setState({
                guardianName: name[0],
                mobileNumber: mobNum
              })
            } else {
              this.setState({
                firstName: name[0],
                lastName: name[1] !== "" ? name[1] : '',
                mobileNumber: mobNum,
              })
            }
          })
          .catch((error) => {
            console.log("ERROR CODE: ", error.code);
            console.log("ERROR MESSAGE: ", error.message);
          });
    }
  }

  validation() {
    console.log('Props**!!!', this.props);

    let self = this;
    /*if (self.props.navigation.state.params.fmRltn === '') {
      alert('Please Select relation')
    }else if (self.state.firstName === '') {
      alert('First Name is required')
    } else if(self.state.isMinor && self.state.isMinorSelected===0 && self.state.guardianName ===''){
      alert('Guardian name is Mandatory')
    }
    else if (self.state.mobileNumber === '') {
      alert('Please enter mobile number')
    }
    else if(self.props.dashBoardReducer.uniID===null){
      alert('Unit id is null')
    }
    else if(self.props.dashBoardReducer.assId===null){
      alert('Association id is null')
    }
    else {*/
    self.editRelativeDetails()

    // }
  }

  async editRelativeDetails() {
    console.log('Props**',this.props,this.state);
    console.log('hjhhjhjhj',this.state.mobileNumber,this.state.sendNum,this.state.cCode)
    let self = this;

    let relationName=self.state.relationName==="" ||self.state.relationName ===null ? self.props.navigation.state.params.fmRltn :self.state.relationName
  //let  cCodeSend=self.state.cCode==="" ||self.state.cCode ===null ? self.props.navigation.state.params.fmisdCode :self.state.cCode
  //  let mobileNumber=self.state.sendNum==="" || self.state.sendNum ===null ? self.props.navigation.state.params.fmMobile :self.state.sendNum
    let  isMinor=self.state.isMinor===false ? self.props.navigation.state.params.fmMinor :self.state.isMinor
        let firstName=self.state.firstName===""||  self.state.firstName ===null ? self.props.navigation.state.params.fmName :self.state.firstName
    let lastName=self.state.lastName==="" || self.state.lastName ===null ? self.props.navigation.state.params.fmlName :self.state.lastName
    let imgUrl=self.state.imageUrl==="" || self.state.imageUrl ===null ? self.props.navigation.state.params.fmImgName :self.state.imageUrl
    let guardianName=self.state.guardianName==="" || self.state.cCode ===null ? self.props.navigation.state.params.fmGurName :self.state.guardianName

    let mobCode = this.state.mobileNumber.split('')
    console.log('hhghfh',mobCode)
    let cCodeSend=this.state.cCode
    if(mobCode[0]==='+'){
      cCodeSend=''
    }

    let input = {
      "FMName"    :firstName,
      "FMMobile"  : self.state.mobileNumber,
      "FMISDCode" : cCodeSend,
      "UNUnitID"  : self.props.dashBoardReducer.uniID,
      "FMRltn"    : relationName,
      "ASAssnID"  : self.props.dashBoardReducer.assId,
      "FMImgName" :imgUrl ,
      "FMMinor"   :isMinor,
      "FMLName"   : lastName,
      "FMGurName" : guardianName,
      "MEMemID":self.props.navigation.state.params.meMemID,
      "FMID":self.props.navigation.state.params.fmid
    };
    let stat = await base.services.OyeSafeApiFamily.myFamilyEditMember(input)
    console.log('Stat in Add family', stat,input)
    if (stat.success) {
      try {
        this.deleteImage()

        this.props.navigation.goBack()
      } catch (err) {
        console.log('Error in adding Family Member')
      }
    }
    else {
      this.showAlert(stat.error.message,true)
      // Alert.alert('Attention', stat.error.message, [
      //     {
      //         text: 'Ok',
      //         onPress: () => console.log('Cancel Pressed'),
      //         style: 'cancel',
      //     },], {cancelable: false});

    }
  }

  showAlert(msg, ispop) {
    let self = this;
    setTimeout(() => {
      this.showMessage(this, "", msg, "OK", function () {

      });
    }, 500)
  }

  showMessage(self, title, message, btn, callback) {
    Alert.alert(title, message, [
      {
        text: btn, onPress: () => {
          self.setState({isLoading: false});
          callback()
        }
      }
    ])
  }

}


const mapStateToProps = state => {
  return {
    associationid: state.DashboardReducer.associationid,
    selectedAssociation: state.DashboardReducer.selectedAssociation,
    oyeURL: state.OyespaceReducer.oyeURL,
    dashBoardReducer: state.DashboardReducer
  };
}

export default connect(mapStateToProps)(MyFamilyEdit);

