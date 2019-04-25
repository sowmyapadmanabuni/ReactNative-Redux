/**
* Sample React Native App
* https://github.com/facebook/react-native
*
* @format
* @flow
*/

import React, { Component } from 'react';
import {
    Platform, StyleSheet, Text, View, 
    TextInput, ScrollView, Alert, NetInfo, Button,KeyboardAvoidingView,TouchableWithoutFeedback, Dimensions, FlatList, PixelRatio, ActivityIndicator,
    TouchableOpacity, TouchableHighlight, Picker, Image,
} from 'react-native';
import ImagePicker from 'react-native-image-picker'
import DateTimePicker from 'react-native-modal-datetime-picker';
import { DatePickerDialog } from 'react-native-datepicker-dialog'
import { TextField } from 'react-native-material-textfield';
// import QRCode from 'react-native-qrcode-image';
// import QRCode from 'react-native-qrcode';
import { QRCode } from 'react-native-custom-qr-codes';
import moment from 'moment';
//import PhoneInput from "react-native-phone-input";
import CountryPicker, {
    getAllCountries
} from 'react-native-country-picker-modal'
import { captureScreen } from "react-native-view-shot";
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { Fonts } from '../pages/src/utils/Fonts'
import SwitchExample from '../registration_pages/SwitchExample.js';

var doNotDisturb = "FALSE";

const options = {
    title: 'Select a Photo',
    takePhotoButton: 'Take a Photo',
    chooseFromLibraryButton: 'Choose From Library',
    quality: 0.50,
    maxWidth: 600,
    maxHeight: 800,
    storageOptions: {
    skipBackup: true,
    },
};

export default class CreateCheckPoint extends Component {

    constructor(props) {
        super(props);
        this.qrCode = '';

        //let userLocaleCountryCode = DeviceInfo.getDeviceCountry()
        const userCountryData = getAllCountries()
       
        this.onButtonPressed = this.onButtonPressed.bind(this);

        // this.state = {
        //     switchStDoNotDisturb: false,
        // }
    }
    state = {

        currentposition: '',
        lat: '',
        long: '',
        height: 0,
        textname: '',
        textmsg: '',
        textnumber: '',
        textvno: '',
        textnop: 1,
        connection_Status: "",
        isDateTimePickerVisible: false,
        datetime: moment(new Date()).format('HH:mm a'),
        PickerValueHolder: '',
        valid: "",
        type: "",
        value: "",
        text: '',
        imageSource: null,
        dobText: moment(new Date()).format('DD-MM-YYYY'),
        dobTextDMY: moment(new Date()).format('DD-MM-YYYY'),

        isDateTimePickerVisible1: false,
        datetime1: moment(new Date()).format('HH:mm a'),
        dobDate: '',
        dobDate1: null,
        endDate: moment(new Date()).format('DD-MM-YYYY'),
        endDateDMY: moment(new Date()).format('DD-MM-YYYY'),
        imgPath: "",
        cca2: 'IN',
        callingCode: '91',
        inviteCreated: false,
        qrText:'',
        stInvitionID:0,
        imageURI : 'http://aboutreact.com/wp-content/uploads/2018/07/sample_img.png',
        dataBase64:null,

        switchStDoNotDisturb: false,
        count: 1
    }

    openShareScreen() {
        if (this.qrCode) {
            const shareOptions = { type: 'image/jpg', title: '', url: this.qrCode };
           /*  Share.open(shareOptions)
                .then(res => console.log(res))
                .catch(err => console.error(err)); */
        }
        //url: "data:image/png;base64,<base64_data>"
    }
    componentDidMount() {
        this.setState({
            textnop: '1'
        })
        NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectivityChange);
        NetInfo.isConnected.fetch().done((isConnected) => {
            if (isConnected == true) {
                this.setState({ connection_Status: "Online" })
            } else {
                this.setState({ connection_Status: "Offline" })
                Alert.alert('Alert', 'Please connect to the internet. ',
                    [
                        { text: 'Ok', onPress: () => { this.props.navigation.navigate('ResDashBoard') } },
                    ],
                    { cancelable: false }
                );
            }

        });
    }
    _incrementCount = () => {
        this.setState({
            count: this.state.count + 1
          })
      }
      _decrementCount = () => {
        this.setState({
            count: this.state.count - 1
          })
      }

    toggleSwitchDoNotDistrub = (value) => {
        this.setState({ switchStDoNotDisturb: value })
        if (value == true) {
            doNotDisturb = "TRUE";
            // this.dnd();
        } else {
            doNotDisturb = "FALSE";
            // this.dnd();
        }
        console.log('Switch doNotDisturb is: ' + doNotDisturb)
    }


    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectivityChange);
    }

    _handleConnectivityChange = (isConnected) => {
        if (isConnected == true) {
            this.setState({ connection_Status: "Online" })
        } else {
            this.setState({ connection_Status: "Offline" })
            alert('You are offline...');
        }
    };
    onButtonPressed() {
        ContactsWrapper.getContact()
            .then((contact) => {
                importingContactInfo: true,
                    console.log(contact.name, contact.phone);
                this.setState({
                    lat: contact.name,
                    long: contact.phone
                });

            })
            .catch((error) => {
                console.log("ERROR CODE: ", error.code);
                console.log("ERROR MESSAGE: ", error.message);
            });
    }
    selectPhoto() {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
                this.setState({
                    imageSource: source,
                    imgPath: response.uri,
                    data: response.data
                });
            }
        });

    }
    handleShiftName = (text) => {
        this.setState({ CheckPoint_name: text })
    }
    handlePhonenumber = (mobile) => {
        this.setState({textnumber:mobile})
    }
    handleTextmsg = (text) => {
        let newText = '';
        let numbers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxzyz.!, \n';

        for (var i = 0; i < text.length; i++) {
            if (numbers.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            }
            else {
                // your call back function
                alert("Please remove special characters");
            }
        }
        this.setState({ textmsg: newText });
    }
    handleName = (text) => {
        this.setState({textname:text})
    }
    handlevno = (text) => {
        let newText = '';
        let numbers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        for (var i = 0; i < text.length; i++) {
            if (numbers.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            }
            else {
                // your call back function
                alert("Please enter numbers and characters only");
            }
        }
        this.setState({ textvno: newText });

    }

    handlenoofpersons = (text) => {
        let newText = '';
        let numbers = '1234567890';

        for (var i = 0; i < text.length; i++) {
            if (numbers.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            } else {
                // your call back function
                alert("Please enter numbers");
            }
        }
        this.setState({ textnop: newText });
    }
    onDOBPress = () => {
        let dobDate = this.state.dobDate;

        if (!dobDate || dobDate == null) {
            dobDate = new Date();
            this.setState({
                dobDate: dobDate
            });
        }
        this.refs.dobDialog.open({
            date: dobDate,
            minDate: new Date() //To restirct future date
        });

    }
    onDOBPress1 = () => {
        let dobDate1 = this.state.dobDate1;

        if (!dobDate1 || dobDate1 == null) {
            dobDate1 = new Date();
            this.setState({
                dobDate1: dobDate1
            });
        }
        this.refs.dobDialog1.open({
            date: dobDate1,
            minDate: new Date() //To restirct future date
        });

    }
    onDOBDatePicked = (date) => {
        this.setState({
            dobDate: date,
            dobText: moment(date).format('DD-MM-YYYY'),
            dobTextDMY: moment(date).format('DD-MM-YYYY'),

        });
    }
    onDOBDatePicked1 = (date) => {
        this.setState({
            dobDate1: date,
            endDate: moment(date).format('DD-MM-YYYY'),
            endDateDMY: moment(date).format('DD-MM-YYYY'),

        });
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (datetime) => {
        console.log('A date has been picked: ', datetime);

        this._hideDateTimePicker();
        this.setState({
            datetime: moment(datetime).format('HH:mm a'),
        });
    };
    _showDateTimePicker1 = () => this.setState({ isDateTimePickerVisible1: true });

    _hideDateTimePicker1 = () => this.setState({ isDateTimePickerVisible1: false });

    _handleDatePicked1 = (datetime1) => {
        console.log('A date has been picked: ', datetime1);

        this._hideDateTimePicker1();
        this.setState({
            datetime1: moment(datetime1).format('HH:mm a'),
        });
    };
    static navigationOptions = {
        title: 'Create Worker Shift',
        headerStyle: {
            backgroundColor: '#696969',
        },
        headerTitleStyle: {
            color: '#fff',
        }
    };

    CheckpointName = (checkpointname) => {
        this.setState({ CheckPoint_name: checkpointname })
    }
    onSharePress = () => Share.share({
        title: 'Invitation',
        message: global.MyFirstName + ' invites you to ' + //global.AssociationUnitName + ' in ' +
         global.AssociationName + ' for ' + this.state.textmsg + ' on ' + this.state.dobText + ' at ' +
          this.state.datetime + '  '+'http://122.166.168.160/Images/Invitation' + global.SelectedAssociationID + 'QR' + this.state.stInvitionID + '.jpg'
          , // Note that according to the documentation at least one of "message" or "url" fields is required
        url: 'http://122.166.168.160/Images/Invitation' + global.SelectedAssociationID + 'QR' + this.state.stInvitionID + '.jpg',
        subject: 'Welcome'
    });

    onSharePressOnlyTxt = () => Share.share({
        title: 'Invitation',
        message: global.MyFirstName + ' invites you to ' + //global.AssociationUnitName + ' in ' +
         global.AssociationName + ' for ' + this.state.textmsg + ' on ' + this.state.dobText + ' at ' +
          this.state.datetime + '  '
          , // Note that according to the documentation at least one of "message" or "url" fields is required
          url: 'http://122.166.168.160/Images/Invitation' + global.SelectedAssociationID + 'QR' + this.state.stInvitionID + '.jpg',
          subject: 'Welcome'
    });

    submit = () => {

        mname = this.state.textname;
        mphone = this.state.textnumber;
        startDate = this.state.dobText + 'T' + this.state.datetime;
        endDate = this.state.endDate + 'T' + this.state.datetime1;
        starttime = this.state.datetime;
        endtime = this.state.datetime1;
        mtextmsg = this.state.textmsg;
        vno = this.state.textvno;
        ccp = this.state.callingCode;
        nop = this.state.count;
        const reg = /^[0]?[6789]\d{9}$/;
        const oyeNonSpecialRegex = /[^0-9A-Za-z ,]/;
        console.log('ram ram', nop);
        if (mname.length == 0) {
            alert('Enter Name');
            return false;
        } else if (global.OyeFullName.test(mname) === false) {
            alert('Name should not contain special characters or numbers ');
            return false;

        } else if (reg.test(mphone) === false) {
            alert('Mobile Number is not Valid');
            return false;    
        } else if (mphone.length < 10) {
            alert('Mobile number should not be less than 10 digits');
            return false;
        } else if (reg.test(mphone) === false) {
            alert('Mobile Number is not Valid');
            return false;

        }
        // else if (mtextmsg.length == 0) {
        //     alert('Enter Purpose of Visit');

        // } 
        else if (this.state.textnop.length == 0) {
            alert('Alert', 'Enter Number of Persons Expected');

        } else if (this.state.textnop == 0) {
            alert('Enter Valid Number of Persons Expected');

        }else if(startDate>endDate){
          alert('Enter valid start date to till date')
          return false;

        }else if(startDate==endDate && starttime==endtime){
            alert('Enter valid start time to till time')
            return false;  
        }else if(starttime || endtime){

        }
        else {

            anu = {
                "MeMemID": global.MyOYEMemberID,
                "UnUnitID": global.SelectedUnitID,
                "INFName": mname,
                "INLName": "",
                "INMobile": '+' + ccp + mphone,
                "INEmail": "",
                "INVchlNo": "",
                "INVisCnt": nop,
                "INPhoto": "SD",
                "INSDate": startDate,
                "INEDate": endDate,
                "INPOfInv": "",
                "INMultiEy": "true",
                "ASAssnID": global.SelectedAssociationID
            }

            console.log('anu', anu)
            alert('Data created',anu)
            const url = global.champBaseURL + 'Invitation/create'
            console.log('url', url)
            fetch('http://' + global.oyeURL + '/oye247/api/v1/Invitation/create',
                {
                    method: 'POST',
                    headers: {

                        'Content-Type': 'application/json',
                        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
                    },
                    body: JSON.stringify(anu)
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log('ravii', responseJson);
                    alert('Data created',responseJson)
                    if (responseJson.success) {
                        // PERSON + "Association" + prefManager.getAssociationId() + INVITED +
                        // dataObj.getInt("invitationID") + ".jpg";
                        const imgName = 'PERSON' + 'Association' + global.SelectedAssociationID + 'INVITED' + responseJson.data.invitation.inInvtID + '.jpg';
                        console.log('ram', imgName);
                        if (this.state.imgPath) {
                            var data = new FormData();
                            data.append('Test', { uri: this.state.imgPath, name: imgName, type: 'image/jpg' });
                            const config = {
                                method: 'POST',
                                headers: { "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1", "content-type": "multipart/form-data" },
                                body: data
                            };

                            console.log("Config", config);
                            fetch(global.uploadImageURL, config).then(responseData => {

                                console.log("sucess==>");
                                console.log(responseData._bodyText);
                                console.log(responseData);
                                alert("Image uploaded successfully")
                                //   this.props.navigation.navigate('GuardListScreen');

                            }).catch(err => {
                                console.log("err==>");
                                alert("Error with image upload!")
                                //  this.props.navigation.navigate('GuardListScreen');
                                console.log(err);
                            });

                        }
                       
                        this.qrGeneration(mname + "," + "" + "," + '+' + ccp + mphone + "," + responseJson.data.invitation.inInvtID + "," +
                         global.SelectedUnitID + "," +this.state.dobTextDMY + "," + this.state.datetime + "," + vno + "," + nop + "," +
                         this.state.endDateDMY + "," + responseJson.data.invitation.inInvtID + "," + global.SelectedAssociationID + ',', responseJson.data.invitation.inInvtID);

                    }
                    else {
                        console.log('invitation hiii', failed);
                        Alert.alert('Alert', 'Failed to create invitation',
                            [
                                { text: 'Ok', onPress: () => { } },
                            ],
                            { cancelable: false }
                        );
                    }
                    console.log('invitation', 'hi');
                })
                .catch((error) => {
                    console.log('invitation error', error);

                    Alert.alert('Alert', 'failed to create invitation',
                        [
                            { text: 'Ok', onPress: () => { } },
                        ],
                        { cancelable: false }
                    );
                });
        }
    }

    qrGeneration(txt, invitationID) {

        this.setState({
         
            inviteCreated: true,
            stInvitionID: invitationID,
            qrText:txt,
        })

    }
    takeScreenShot=()=>{
        //handler to take screnshot
        captureScreen({
          //either png or jpg or webm (Android). Defaults to png
          format: "jpg",
          //quality 0.0 - 1.0 (default). (only available on lossy formats like jpg)
          quality: 0.8
        })
        .then(
          //callback function to get the result URL of the screnshot
          uri => {this.setState({ imageURI : uri },)
        
           RNFS.readFile(this.state.imageURI, "base64").then(data => {
            // binary data
            console.log('data base64 '+data);
            this.setState({ dataBase64 : data });
            let shareImageBase64 = {
                title: "Invitation",
                message: global.MyFirstName + ' invites you to ' + //global.AssociationUnitName + ' in ' +
                global.AssociationName + ' for ' + this.state.textmsg + ' on ' + this.state.dobText + ' at ' +
                 this.state.datetime + '  ',
                url: 'data:image/png;base64,'+this.state.dataBase64,
                subject: "Share Invitation" //  for email
              };
              Share.open(shareImageBase64);
          });  
    
        },
          error => {console.error("Oops, Something Went Wrong", error),
          console.log('error uploadImage ',error)}
        );
       // this.uploadImage();
      
      
      }
    
      uploadImage(){
    
        //   alert('Guard Added Successfully!');
        console.log('WorkersLis uploadImage ', this.state.stInvitionID)
    
        const imgName = 'Invitation' + global.SelectedAssociationID + 'QR' + this.state.stInvitionID + '.jpg';
        //      String imgName = PERSON + "Association" + prefManager.getAssociationId() + GUARD + movie.getGuardID() + ".jpg";
        console.log('WorkersLis uploadImage  '+imgName+' '+this.state.imageURI);
    
        if (this.state.imageURI) {
            var data = new FormData();
            data.append('Test', { uri: this.state.imageURI, name: imgName, type: 'image/jpg' });
            const config = {
                method: 'POST',
                headers: { "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1", "content-type": "multipart/form-data" },
                body: data
            };
            console.log("Config", config);
            fetch(global.uploadImageURL, config).then(responseData => {
                console.log("sucess==>");
                console.log(responseData._bodyText);
                console.log(responseData);
                    // alert("Image uploaded done! Image "+imgName);
                     Alert.alert('Alert', 'Invitation created successfully',
                     [
                         { text: 'Share', onPress: () => { this.onSharePress() } },
                     ],
                     { cancelable: false }
                 );
            }).catch(err => {
                console.log("err==>");
                Alert.alert('Alert', 'Invitation created successfully',
                     [
                         { text: 'Share', onPress: () => { this.onSharePressOnlyTxt() } },
                     ],
                     { cancelable: false }
                 );
                console.log(err);
            });
        } else {
          alert("Error !")
        }
    }

    IncrementItem = () => {
        this.setState({ clicks: this.state.clicks++ });
      }
    DecreaseItem = () => {
    this.setState({ clicks: this.state.clicks--});
    }

    render() {
        const { navigate } = this.props.navigation;
        const { params } = this.props.navigation.state;
        let phone = ''
        // this.state.lat=params.cat;
        // this.state.long=params.cat1;
        console.log();
        return (
         
            <View style={styles.container}>
<View
style={{
paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
marginTop:25,
}}>
<TouchableOpacity onPress={() => navigate(('InvitedGuestListScreen'), { cat: '' })}
style={{ flex: 1 , alignSelf:'center'}}>
<Image source={require('../pages/assets/images/back.png')}
style={{ height: 25, width: 25, margin: 10, alignSelf: 'center' }} />
</TouchableOpacity>
<Text style={{ flex: 2, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>
<View style={{ flex: 3, alignSelf: 'center' }}>
<Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
style={{
height: 40, width: 95, margin: 5,
alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
}} />
</View>
<View style={{ flex: 3,alignSelf: 'flex-end',alignItems:'flex-end',justifyContent:'flex-end' }}>
                           

                        </View>


</View>
                    <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
<Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',justifyContent:'center',alignContent:'center', marginTop:10,marginBottom:5, marginLeft:2 }}>Invite Guests</Text>
            {!this.state.inviteCreated ?
                <View style={{ flexDirection: 'column', paddingTop: 2,
                paddingBottom: 2, paddingLeft:5,paddingRight:5,
                backgroundColor: 'white',
                borderRadius: 5,
                borderWidth: 1,
                borderColor: 'orange'  }}>
                    <ScrollView>
                        <TextField
                            label='Name'
                            autoCapitalize='sentences'
                            labelHeight={15}
                            maxLength={50}
                            characterRestriction={50}
                            activeLineWidth={0.5}
                            fontSize={16}
                            onChangeText={this.handleName}
                        />

                        <View style={{ flexDirection: 'row', }}>
                            <View style={{ flex: 0.10, flexDirection: 'row', marginTop: '3.5%' }}>
                                <CountryPicker
                                    onChange={value => {
                                        this.setState({ cca2: value.cca2, callingCode: value.callingCode })
                                    }}
                                    cca2={this.state.cca2}
                                    translation="eng"
                                />
                            </View>
                            <View style={{ flex: 0.10, flexDirection: 'row', marginTop: '4.5%' }}>
                                <Text style={{ color: 'black', fontSize: 12 }}>+{this.state.callingCode}</Text></View>

                            <View style={{ flex: 0.85 }}>
                                <TextField
                                    label='Mobile Number'
                                    fontSize={16}
                                    labelHeight={10}
                                    characterRestriction={10}
                                    activeLineWidth={0.5}
                                    keyboardType='numeric'
                                    maxLength={10}
                                    onChangeText={this.handlePhonenumber}
                                />
                            </View>
                            <View>

                            </View>
                        </View>

                        <Text style={{ fontSize: 16, color: 'grey', marginTop: 10, marginLeft: 2 }}>Invitation Validity:  </Text>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ fontSize: 12, color: 'black', marginTop: 13, }}>From </Text>
                            <TouchableOpacity style={{ height: 40, }} onPress={this.onDOBPress.bind(this)} >
                                <View style={styles.datePickerBox}>
                                    <Text style={styles.subtext1}>{this.state.dobText}</Text>
                                </View>
                            </TouchableOpacity>
                            <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />
                            <Text style={{ fontSize: 15, color: 'black', }}> </Text>

                            <TouchableOpacity onPress={this._showDateTimePicker}>
                                <DateTimePicker
                                    isVisible={this.state.isDateTimePickerVisible}
                                    onConfirm={this._handleDatePicked}
                                    mode='time'
                                    is24Hour={false}
                                    onCancel={this._hideDateTimePicker}
                                    
                                />
                                <View style={styles.datePickerBox}>
                                    <Text style={styles.subtext1}>{this.state.datetime}</Text>
                                </View>
                            </TouchableOpacity>


                            <DatePickerDialog ref="dobDialog1" onDatePicked={this.onDOBDatePicked1.bind(this)} />
                            <Text style={{ fontSize: 12, color: 'black', marginTop: 13, marginLeft: '2%' }}>till </Text>
                            <TouchableOpacity style={{ height: 40, }} onPress={this.onDOBPress1.bind(this)} >
                                <View style={styles.datePickerBox}>
                                    <Text style={styles.subtext1}>{this.state.endDate}</Text>
                                </View>
                            </TouchableOpacity>
                            <Text style={{ fontSize: 15, color: 'black', }}> </Text>
                            <TouchableOpacity onPress={this._showDateTimePicker1}>
                                <DateTimePicker
                                    isVisible={this.state.isDateTimePickerVisible1}
                                    onConfirm={this._handleDatePicked1}
                                    mode='time'
                                    is24Hour={false}
                                    onCancel={this._hideDateTimePicker1}
                                />
                                <View style={styles.datePickerBox}>
                                    <Text style={styles.subtext1}>{this.state.datetime1}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>


                        <View style={{borderColor:'orange',fontWeight:'bold'}}>
                            {/* <TextField
                                label='Purpose of Visit'
                                autoCapitalize='sentences'
                                labelHeight={10}
                                characterRestriction={150}
                                multiline={true}
                                maxLength={150}
                                activeLineWidth={0.5}
                                fontSize={12}
                                onChangeText={this.handleTextmsg}
                            /> */}
                            <View style={{ flexDirection: 'row', marginTop: 20, }}>
                                <Text style={{ fontSize: 16, color: 'grey', marginTop: 10, marginLeft: 2, marginLeft: 5,paddingRight:'45%' }}>Multiple Entries: </Text>
                                <SwitchExample style={{ justifyContent:'flex-end',  }}
                                    toggleSwitch1={this.toggleSwitchDoNotDistrub}
                                    switch1Value={this.state.switchStDoNotDisturb} />
                            </View>
                            <View style={{flexDirection:'row', alignSelf:'flex-start',justifyContent:'space-between',marginTop: 20 }}>
                               <Text style={{fontSize: 16, color: 'grey', marginTop: 10, marginLeft: 2,padding:5,}}>Guest Expected:</Text>

                            <View style={{flexDirection:'row', alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
                            {this.state.count <= 1 ? 
                            <TouchableOpacity
                            style={styles.mybuttonDisable}     >
                            <Text style={{height:0}}></Text>
                          </TouchableOpacity>  
                            : <TouchableOpacity
                            // style={styles.loginScreenButton12}
                            onPress={this._decrementCount}
                            underlayColor='#fff'>
                            <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'black', margin: 5 }}>-</Text>
                        </TouchableOpacity> }

                              
                                <Text style={{ fontSize: 20, color: 'black', marginTop:8, }}
                                    
                                    value={this.state.count}
                                    
                                    > {this.state.count}</Text>
                                    <View style={{flexDirection:'row', alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
                                    <TouchableOpacity
                                    // style={styles.loginScreenButton12}
                                    onPress={this._incrementCount}
                                    underlayColor='#fff'>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black', margin: 6,marginTop:10}}>+</Text>
                                </TouchableOpacity>
                                    </View>
                                
                            </View>  
     

                            </View>   
                            {/* <TextField
                                label='Number of Persons Expected'
                                autoCapitalize='sentences'
                                labelHeight={10}
                                value={this.state.textnop}
                                maxLength={3}
                                characterRestriction={3}
                                fontSize={12}
                                activeLineWidth={0.5}
                                keyboardType='number-pad'
                                autoCapitalize="none"
                                onChangeText={this.handlenoofpersons}
                            /> */}
                            {/* <KeyboardAvoidingView>
                            <TextField
                                label='Vehicle Number'
                                labelHeight={10}
                                characterRestriction={15}
                                maxLength={15}
                                autoCapitalize="characters"
                                fontSize={12}
                                activeLineWidth={0.5}
                                onChangeText={(text) => this.handlevno(text)}
                            />
                            </KeyboardAvoidingView> */}
                        </View>

                        {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Image source={this.state.imageSource !=
                                null ?
                                this.state.imageSource :
                                require('../pages/assets/images/icons8-manager-50.png')}
                                style={{
                                    height: 100, width: 100, margin: 10, borderColor:
                                        'orange', margin: '3%', borderRadius: 50, borderWidth: 2,
                                }} />
                            <TouchableOpacity
                                style={styles.loginScreenButton}
                                onPress={this.selectPhoto.bind(this)}
                                underlayColor='#fff'>
                                <Text style={{ fontWeight: 'bold', fontSize: 14, color: 'black', margin: 5 }}>CHOOSE IMAGE</Text>
                            </TouchableOpacity>
                        </View> */}
                        
                    </ScrollView>
                    <View style={{justifyContent:'center',alignItems:"center"}}>
                            <TouchableOpacity
                                style={[styles.loginScreenButton, {marginTop:10}]}
                                onPress={this.submit.bind(this)}
                                underlayColor='#fff'>
                                <Text style={{ fontWeight: 'bold', fontSize: 14, color: 'black', margin: 5,justifyContent:'center',alignItems:"center" }}>SUBMIT</Text>
                            </TouchableOpacity>
                    </View>
                </View>
                :
                <View style={{ flex: 1, flexDirection: 'column',  alignItems:'center', }}>
<TouchableOpacity onPress={this.takeScreenShot}
style={{margin:25,width:'100%',flexDirection:'row-reverse'}}>
             {/*  <Image source={require('../pages/assets/images/share.png')}
                style={{ height: 35, width: 35, margin: 10,  }} /> */}
            </TouchableOpacity> 
                    <QRCode logo={require('../pages/assets/images/Oyespaceqrcode.png')} logoSize={80} content= {this.state.qrText}/>
                    {/* <QRCode style={{ margin: 30,alignContent:'centre',alignSelf:'centre' }}
                     alignSelf='centre' value={this.state.qrText}
                        size={200} bgColor='black' fgColor='white' /> */}

                    <Button style={{marginTop:50,borderColor:'orange'}} title="Share" onPress={this.takeScreenShot} />
                     
                </View>}
            </View>
        )
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: 'white', borderColor: 'white', paddingLeft: 10, paddingRight: 10,
        borderRadius: 2, borderWidth: 1,
    },
    input: {
        marginTop: 10, fontSize: 12,
        height: 40, borderColor: '#F2F2F2', backgroundColor: '#F2F2F2', borderWidth: 4, borderRadius: 2,
    },

    subtext1: { fontSize: 12, color: 'black', margin: 2, },
    text: { fontSize: 13, color: 'black', justifyContent: 'center', },

    submitButton: {
        backgroundColor: '#ff8c00',
        padding: 10,
        margin: 15,
        height: 40,
        justifyContent: 'center',
        color: 'white'
    },
    mybutton: {
        backgroundColor: 'white',
        marginTop: 10,
        paddingRight: 5,
        paddingLeft: 5,
        height: 35,
        borderColor: 'orange',
        borderRadius: 0,
        borderWidth: 2,
        textAlign: 'center',
    },

    textInput: {
        fontSize: 10,
        height: 25
    },
    datePickerBox: {
        marginTop: 10,
        marginLeft: 4,
        borderColor: '#828282',
        // borderWidth: 0.5,
        borderBottomWidth:0.5,
        padding: 0,
        // borderTopLeftRadius: 4,
        // borderTopRightRadius: 4,
        // borderBottomLeftRadius: 4,
        // borderBottomRightRadius: 4,
        height: 25,
        justifyContent: 'center'
    },
    datePickerText: {
        fontSize: 12,
        marginLeft: 5,
        height: 40,
        borderWidth: 0,
        color: '#121212',
    },
    inputLayout: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
    },
    rectangle1: {
        flex: 1, backgroundColor: 'white', padding: 5, borderColor: 'orange',
        marginLeft: 5, marginRight: 5, borderRadius: 2, borderWidth: 1,
    },
    loginScreenButton: {
        paddingTop: 2,
        paddingBottom: 2,
        backgroundColor: 'white',
        // borderRadius: 10,
        borderWidth: 1,
        borderColor: 'orange'
    },
    loginScreenButton12: {
        paddingTop: 2,
        paddingBottom: 2,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'orange'
    },
    loginText: {
        color: '#fff',
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    image: {
        width: 100,
        height: 100,
        marginTop: 10,
        borderRadius: 100 / 2
    },
})
