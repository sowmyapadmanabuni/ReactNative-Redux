
import React, { Component } from 'react';

import {
  Platform, StyleSheet, Text, View,
  TextInput, Alert, Button, Dimensions, FlatList, ScrollView, ActivityIndicator,
  TouchableOpacity, ToastAndroid, Picker, Image, Card, Avatar, NetInfo, TouchableHighlight
} from 'react-native';
import ImagePicker from 'react-native-image-picker'
import { NavigationActions } from 'react-navigation';
import {
  DatePickerDialog
} from
  'react-native-datepicker-dialog'

import {
  openDatabase
} from
  'react-native-sqlite-storage';

import {
  TextField
} from
  'react-native-material-textfield';

var db = openDatabase({   name: global.DB_NAME});

import moment
  from 'moment';



const options = {

  title: 'Select a Photo',

  takePhotoButton:
    'Take a Photo',

  chooseFromLibraryButton:
    'Choose From Gallery',

  quality: 0.40,
       maxWidth: 600,
       maxHeight: 800,
       storageOptions: {
       skipBackup: true,
  },

};



export default
  class EditProfile
  extends Component {

  constructor() {

    super()

    this.state = {

      firstname: '',
      lastname: '',
      emailId: '',
      AlternateEmailID: '',
      isLoading: true,
      imageSource:null,
      data: null,
      imgPath: "",
      connection_Status: "",

    }

    console.log('EditProfile ', 'constructor');

  }


  handlefname = (text) => {

    let newText = '';
    let numbers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxzyz ';

    for (var i = 0; i < text.length; i++) {

      if (numbers.indexOf(text[i]) > -1) {
        newText = newText + text[i];
      } else {
        // your call back function
        alert("Please Remove Special Characters");
      }

    }

    this.setState({
      firstname: newText
    })

  }

  handlelname = (text) => {

    let newText = '';
    let numbers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxzyz ';

    for (var i = 0; i < text.length; i++) {

      if (numbers.indexOf(text[i]) > -1) {
        newText = newText + text[i];
      } else {
        // your call back function
        alert("Please Remove Special Characters");
      }

    }

    this.setState({
      lastname: newText
    })

  }

  handleemail = (text) => {
    this.setState({
      emailId: text
    })
  }

  handleAlternateEmailID = (text) => {
    this.setState({
      AlternateEmailID: text
    })

  }

  componentDidMount() {

    this.setState({

      firstname: global.MyFirstName,
      lastname: global.MyLastName,

      emailId: global.MyEmail,
      AlternateEmailID: ''
    })

    NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectivityChange);

    NetInfo.isConnected.fetch().done((isConnected) => {

      if (isConnected == true) {

        this.setState({
          connection_Status: "Online"
        })

      } else {
        this.setState({
          connection_Status: "Offline"
        })

        Alert.alert('No Internet',
          'Please Connect to the Internet. ',
          [
            {
              text: 'Ok',
              onPress: () => { this.props.navigation.navigate('ResDashBoard') }
            },
          ],
          {
            cancelable: false
          }
        );

      }

    });

  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectivityChange);
  }

  _handleConnectivityChange = (isConnected) => {

    if (isConnected == true) {
      this.setState({
        connection_Status: "Online"
      })
    } else {
      this.setState({
        connection_Status: "Offline"
      })
      alert('You are offline...');
    }

  };

  selectPhoto() {
    console.log('image bf ',global.viewImageURL+'PERSON'+global.MyAccountID+'.jpg '+this.state.imageSource+' l '+this.state.imageSource !=null);
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {
          uri: response.uri
        };

        this.setState({
          imageSource: source,
          imgPath: response.uri,
          data: response.data
        });

      }

    });
    console.log('image af ', global.viewImageURL+'PERSON'+global.MyAccountID+'.jpg '+this.state.imageSource+' l '+this.state.imageSource !=null);
  }

  static navigationOptions = {
    title: 'Edit Profile',
    headerStyle: {
      backgroundColor: '#696969',
    },

    headerTitleStyle: {
      color: '#fff',
    }

  };

  submit = () => {

    let regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    mfname = this.state.firstname;
    mlname = this.state.lastname;
    memail = this.state.emailId;
    mAltEmailID = this.state.AlternateEmailID;

    if (mfname == '' || mfname == undefined) {
      alert('First Name should not be Empty');
    } else if (global.oyeNonSpecialNameRegex.test(mfname) === true) {
      alert('First Name should not contain Special Character');
    } else if (mlname == '' || mlname == undefined) {
      alert('Last Name should not be Empty');
    } else if (global.oyeNonSpecialNameRegex.test(mlname) === true) {
      alert('Last Name should not contain Special Character');
    } else if (memail == '' || memail == undefined) {
      alert('Email ID should not be Empty');
    } else if (regemail.test(memail) === false || memail.length == 0) {
      alert('Enter Valid Email ID');
    } else if (memail == mAltEmailID) {
      alert('Primary EmaiID and Alternative Email ID should not be Same');
    }
    // else if (regemail.test(mpno) ===
    // false || mpno.length == 0) {
    // Alert.alert('Alert', 'Enter valid alternative emailID',
    // [
    // { text: 'Ok', onPress: () => { } },
    // ],
    // { cancelable: false }
    // );
    // }
    else {

      // {
      // "firstName" : "Sowmya",
      // "lastName" : "Padmanabhuni",
      // "email" : "Sowmya181992@gmail.com",
      // "vehicleNumber" : "KA 03 MW 831",
      // "mobileNumber" : "+919075437212"
      // }

      anu = {

        "ACFName": mfname,
        "ACLName": mlname,
        "ACEmail": memail,
        "ACMobile": global.MyMobileNumber,
        "ACISDCode":  global.MyISDCode,
        "ACMobile1": "",
        "ACISDCode1": "",
        "ACMobile2": "",
        "ACISDCode2": "",
        "ACMobile3": "",
        "ACISDCode3": "",
        "ACMobile4": "",
        "ACISDCode4": "",
        "ACEmail1": mAltEmailID,
        "ACEmail2": "",
        "ACEmail3": "",
        "ACEmail4": "",
        "ACAccntID": global.MyAccountID

      }

      console.log('anu', anu)

      fetch(global.champBaseURL + 'AccountDetails/Update',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
          },
          body: JSON.stringify(anu)
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('logresponseupdate', responseJson);
          if (responseJson.success) {

            global.MyFirstName = mfname;
            global.MyLastName = mlname;
            global.MyEmail = memail;
           global.MyalEmailID =  mAltEmailID;

            console.log('ramu', global.MyFirstName, global.MyalEmailID, global.MyEmail, global.MyLastName);
            const imgName = 'PERSON' + global.MyAccountID + '.jpg';
            console.log('ram', imgName);

            if (this.state.imgPath) {

              var data = new FormData();

              data.append('Test', { uri: this.state.imgPath, name: imgName, type: 'image/jpg' });

              const config = {
                method: 'POST',
                headers: {
                  "X-Champ-APIKey":
                    "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1", "content-type":
                    "multipart/form-data"
                },
                body: data
              };

              console.log("Config", config);

              fetch(global.uploadImageURL, config).then(responseData => {
                console.log("sucess==>");
                console.log(responseData._bodyText);
                console.log(responseData);
                alert("Image uploaded done!")
                this.props.navigation.navigate('ResDashBoard');

              }).catch(err => {
                console.log("err==>");
                alert("Error with image upload!")
                // this.props.navigation.navigate('GuardListScreen');
                console.log(err);
              });

            }

            //this.updateStatus();

            db.transaction((tx) => {
              tx.executeSql(
                'UPDATE Account set FirstName=?, LastName=? , Email=? where AccountID=?',
                [mfname, mlname, memail, global.MyAccountID],

                (tx, results) => {

                  console.log('Results', results.rowsAffected);
                  if (results.rowsAffected > 0) {
                    Alert.alert('Success',
                      'Profile Updated Successfully',
                      [
                        {
                          text: 'Ok',
                          onPress: () => this.props.navigation.navigate('ResDashBoard')
                        },
                      ],
                      {
                        cancelable: false
                      }
                    );
                  } else {
                    alert('Updation Failed');
                  }
                }
              );
            });

          } else {
            console.log('hiii', failed);

            Alert.alert('Failed',
              'User Updation Failed',
              [
                {
                  text: 'Ok', onPress: () => { }
                },
              ],
              {
                cancelable: false
              }
            );
          }
        })
        .catch((error) => {
          console.log(error)
        })

    }

  }

  render() {
    console.log('image ', global.viewImageURL + 'PERSON' +
    global.MyAccountID +    '.jpg '+this.state.imageSource+ ' l '+this.state.imageSource !=null);
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;

    const MAGNIFYING_GLASS_ICON = require('../pages/assets/images/icons8-manager-50.png');

    return (

      <View style={styles.container}>
        <View>
        <View
style={{
paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:45,
}}>
<TouchableOpacity onPress={() => navigate(('ResDashBoard'), { cat: '' })}
style={{ flex: 1 , alignSelf:'center'}}>
<Image source={require('../pages/assets/images/back.png')}
style={{ height: 25, width: 25,  }} />
</TouchableOpacity>
<Text style={{ flex: 2, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>
<View style={{ flex: 3, alignSelf: 'center' }}>
<Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
style={{
height: 38, width: 95, margin: 5,
alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
}} />
</View>
<View style={{ flex: 3,alignSelf: 'flex-end',alignItems:'flex-end',justifyContent:'flex-end' }}>
                         

                        </View>


</View>
                    <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
<Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',justifyContent:'center',alignContent:'center',marginBottom:2,marginLeft:'3%' }}>Edit Profile</Text>
  
        </View>

        <ScrollView>

          <View
            style={{
              flexDirection:
                'column', alignSelf:
                'center',
            }}>

            <TouchableHighlight

              style={[styles.profileImgContainer, {
                borderColor: 'orange',
                borderWidth: 1
              }]}
            >

              <Image
                style={styles.image}

                source={this.state.imageSource !=
                  null ? this.state.imageSource :

                  {
                    uri: global.viewImageURL + 'PERSON' +
                      global.MyAccountID +
                      '.jpg'+'?random_number=' +new Date().getTime(),
                  }}

                style={styles.profileImg}
              />

            </TouchableHighlight>

          </View>

          <TouchableOpacity
            style={styles.loginScreenButton}
            onPress={this.selectPhoto.bind(this)}>

            <Text
              style={{
                fontSize: 12,
                color: 'black', alignSelf: 'center'
              }}>
              Change Image </Text>

          </TouchableOpacity>
          <View

            style={styles.rectangle}>

            <View
              style={styles.row}>

              <View
                style={styles.inputWrap}>

                <TextField

                  label='First Name'

                  autoCapitalize='sentences'

                  labelHeight={15}

                  value={this.state.firstname}

                  maxLength={30}

                  activeLineWidth={0.5}

                  fontSize={12}

                  onChangeText={
                    this.handlefname}

                />

              </View>

              <View
                style={styles.inputWrap}>

                <TextField

                  label='Last Name'

                  autoCapitalize='sentences'

                  value={this.state.lastname}

                  labelHeight={15}

                  maxLength={30}

                  activeLineWidth={0.5}

                  fontSize={12}

                  onChangeText={
                    this.handlelname
                  }

                />

              </View>



            </View>

            <View
              style={styles.row}>

              <View
                style={styles.inputWrap}>

                <TextField

                  label='Email ID'

                  autoCapitalize='sentences'

                  value={this.state.emailId}

                  labelHeight={15}

                  maxLength={50}

                  activeLineWidth={0.5}

                  fontSize={12}

                  onChangeText={
                    this.handleemail
                  }

                />

              </View>


            </View>


            <View
              style={styles.inputWrap}>

              <TextField

                label='Alternate Email ID'

                autoCapitalize='sentences'

                //value={this.state.emailId}

                labelHeight={15}

                maxLength={50}

                activeLineWidth={0.5}

                fontSize={12}

                onChangeText={
                  this.handleAlternateEmailID
                }

              />

            </View>

            <View
              style={{
                flexDirection:
                  'row', alignSelf:
                  'center'
              }}>

              <TouchableOpacity

                style={styles.loginScreenButton}

                onPress={() => navigate('AddVehiclesScreen')}>

                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black', alignSelf: 'center'
                    }}>My Vehicles</Text>

              </TouchableOpacity>

              <TouchableOpacity

                style={styles.loginScreenButton}

                onPress={this.submit.bind(this)}>

                <Text
                  style={{
                    fontSize: 12,
                    color: 'black', alignSelf: 'center'
                  }}>Update</Text>

              </TouchableOpacity>

            </View>

            <TouchableOpacity

              title="Add Vehicles "

              customClick={() => this.props.navigation.navigate('AddVehiclesScreen')}
            />

          </View>

        </ScrollView>

      </View>

    )

  }



}

const styles =
  StyleSheet.create({

    container: {

      justifyContent:
        'flex-start',

      backgroundColor:
        "#fff",

      height: '100%',

      width: '100%',

    },

    input: {

      marginLeft:
        20, marginRight:
        15, marginTop:
        5, marginBottom:
        5,

      height: 40,
      borderColor: '#F2F2F2',
      backgroundColor:
        '#F2F2F2', borderWidth:
        1.5, borderRadius:
        2,

    },



    submitButton: {

      backgroundColor:
        '#ff8c00',

      padding:
        10,

      margin: 15,

      height: 40,

      color: 'white'

    },

    mybutton: {

      backgroundColor:
        'white',

      marginTop:
        5,

      height: 40,

      borderColor:
        'orange',

      borderRadius:
        0,

      borderWidth:
        2,

      textAlign:
        'center',



    },

    rectangle: {

      backgroundColor:
        'white', padding:
        10, borderColor:
        'orange',

      marginLeft: 5,
      marginRight: 5, marginTop:
        5, borderRadius:
        2, borderWidth:
        1,

    },



    textInput: {

      fontSize:
        10,

      height: 25

    },

    datePickerBox: {

      marginBottom:
        32,

      marginLeft:
        60,

      borderColor:
        '#ABABAB',

      borderWidth:
        0.5,

      padding:
        0,

      borderTopLeftRadius:
        4,

      borderTopRightRadius:
        4,

      borderBottomLeftRadius:
        4,

      borderBottomRightRadius:
        4,

      height: 25,

      justifyContent:
        'center'

    },

    profileImgContainer: {

      marginTop:
        5,

      height: 100,

      width: 100,

      borderRadius:
        50,

    },

    profileImg: {

      height: 100,

      width: 100,

      borderRadius:
        50,


    },

    loginScreenButton: {

      alignSelf: 'center',

      width: '40%',

      marginLeft: 10,

      marginTop: 5,

      paddingTop: 2,

      paddingBottom: 2,

      backgroundColor: 'white',

      borderRadius: 5,

      borderWidth:
        1,

      borderColor:
        'orange'

    },

    datePickerText: {

      fontSize:
        14,

      marginLeft:
        5,

      borderWidth:
        0,

      color: '#121212',

    },

    imagee: {

      height: 14,

      width: 14,

      margin: 10,

    },

    row: {

      flex: 1,

      flexDirection:
        "row",

    },

    inputWrap: {

      flex: 1,

      marginLeft: 15,

      paddingRight: 15

    },



    ImageStyle: {

      padding:
        10,

      margin: 5,

      height: 25,

      width: 25,

      resizeMode:
        'stretch',

      alignItems:
        'center'

    },

    SectionStyle: {

      flexDirection:
        'row',

      backgroundColor:
        '#fff',

      borderWidth:
        .5,

      borderColor:
        '#000',

      height: 40,

      borderRadius:
        5,

      margin: 10

    },

    inputLayout: {

      marginTop:
        5,

      marginLeft:
        10,

      marginRight:
        10,

    },

    image: {

      width: 100,

      height: 100,

      marginTop:
        10,

      borderColor:
        'orange',

      borderRadius:
        2,

      borderRadius:
        100 / 2,

      alignSelf:
        'center',

      justifyContent:
        'center',

      alignItems:
        'center',

    },



  })