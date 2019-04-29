import React, { Component } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator,
    Platform, alertMessage, Image, Picker, Button, Alert, ScrollView
} from "react-native";
import PhoneInput from "react-native-phone-input";
import { openDatabase } from 'react-native-sqlite-storage';
import ImagePicker from 'react-native-image-picker';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import { TextField } from 'react-native-material-textfield';
import { Fonts } from '../pages/src/utils/Fonts';
import { Dropdown } from 'react-native-material-dropdown';
import firebase from 'react-native-firebase';
import axios from 'axios';
import CountryPicker, {
    getAllCountries
  } from 'react-native-country-picker-modal';
import _ from 'lodash';
import { CLOUD_FUNCTION_URL } from '../constant';

var db = openDatabase({ name: 'UserDatabase.db' });


var date = new Date().getDate();
var month = new Date().getMonth() + 1;
var year = new Date().getFullYear();

class CreateWorker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            valid: "",
            type: "",
            value: "",
            isLoading: false,
            PickerValueHolder: '0',
            isDateTimePickerVisible: false,
            datetime: moment(new Date()).format('HH:mm'),
            dobText: moment(new Date()).format('YYYY-MM-DD'),
            isDateTimePickerVisible1: false,
            datetime1: moment(new Date()).format('HH:mm'),
            dobDate: null,
            dobDate1: null,
            endDate: moment(new Date()).format('YYYY-MM-DD'),
            cca2: 'IN',
            callingCode: '91',
            FirstName: global.MyFirstName,
            LastName: global.MyLastName,
            MobileNumber: global.MyMobileNumber,
            EmailId: global.MyEmail,
            loading: false,
            memberList: null,
        };

        this.renderInfo = this.renderInfo.bind(this);

    }

    Firstname = (firstname) => {
        this.setState({ FirstName: firstname })
    }

    Lastname = (lastname) => {
        this.setState({ LastName: lastname })
    }

    Mobile = (mobile) => {
        this.setState({ MobileNumber: mobile })
    }

    Email = (email) => {
        this.setState({ EmailId: email })
    }

    componentDidMount() {
        
    }
    //Function
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
            maxDate: new Date() //To restirct future date
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
            dobText: moment(date).format('YYYY-MM-DD'),

        });
    }

    onDOBDatePicked1 = (date) => {
        this.setState({
            dobDate1: date,
            endDate: moment(date).format('YYYY-MM-DD')
        });
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (datetime) => {
        console.log('A date has been picked: ', datetime);

        this._hideDateTimePicker();
        this.setState({
            datetime: moment(datetime).format('HH:mm'),
        });
    };

    _showDateTimePicker1 = () => this.setState({ isDateTimePickerVisible1: true });

    _hideDateTimePicker1 = () => this.setState({ isDateTimePickerVisible1: false });

    _handleDatePicked1 = (datetime1) => {
        console.log('A date has been picked: ', datetime1);

        this._hideDateTimePicker1();
        this.setState({
            datetime1: moment(datetime1).format('HH:mm'),
        });
    };

    submit = (first, last, mobile,email, PickerValueHolder,) => {
        this.setState({ loading: true })
        const reg = /^[0]?[6789]\d{9}$/;
        let regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
       
        if (first == '' ) {
            alert('Enter First Name');
            this.setState({ loading: false })
            return false
        }   
        else if (last == '' ) {
            alert('Enter Last Name');
            this.setState({ loading: false })
            return false

        } else if(mobile=='')  {
            alert('Enter Mobile Number');
            this.setState({ loading: false })
            return false 
        }
        else if(email=='')  {
            alert('Enter Email ID');
            this.setState({ loading: false })
            return false 
        }
        else if(PickerValueHolder==0)  {
            alert('Select Role');
            this.setState({ loading: false })
            return false 
        }
        else {
            console.log("associationId",this.props.navigation.state.params.associtionID)
            console.log("block",this.props.navigation.state.params.blockID)
            console.log("unitId",this.props.navigation.state.params.unitID)
            console.log(parseInt(this.state.PickerValueHolder))
            console.log(this.state.FirstName)
            console.log(this.state.MobileNumber)
            console.log(this.state.LastName)
            console.log(this.state.EmailId)
            console.log(this.state.dobText)
            console.log(this.state.dobText)
            anu = {
                "ASAssnID"     : this.props.navigation.state.params.associtionID,
                "BLBlockID"    : this.props.navigation.state.params.blockID,
                "UNUnitID"     : this.props.navigation.state.params.unitID,
                "MRMRoleID"    : parseInt(this.state.PickerValueHolder),
                "FirstName"    : this.state.FirstName,
                "MobileNumber" : this.state.MobileNumber,
                "ISDCode"      : "+91",
                "LastName"     : this.state.LastName,
                "Email"        : this.state.EmailId,
                "SoldDate"     : this.state.dobText,
                "OccupancyDate": this.state.dobText,
            }

            let champBaseURL = global.champBaseURL;
            console.log(champBaseURL)

            axios.post(`${champBaseURL}/association/join`, {
                ASAssnID     : this.props.navigation.state.params.associtionID,
                BLBlockID    : this.props.navigation.state.params.blockID,
                UNUnitID     : this.props.navigation.state.params.unitID,
                MRMRoleID    : parseInt(this.state.PickerValueHolder),
                FirstName    : this.state.FirstName,
                MobileNumber : this.state.MobileNumber,
                ISDCode      : "+91",
                LastName     : this.state.LastName,
                Email        : this.state.EmailId,
                SoldDate     : this.state.dobText,
                OccupancyDate: this.state.dobText,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
                }
            })
            .then(response => {
                console.log('*******')
                console.log('here_1 ')
                console.log('*******')
                let responseData_1 = response.data;
                if(responseData_1.success) {

                    let headers_2 = {
                        "Content-Type": "application/json",
                        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
                    }
                    
                    let mobileNo = '+91' + global.MyMobileNumber;
                    console.log(mobileNo)
                    axios.post('http://apidev.oyespace.com/oyeliving/api/v1/Member/GetRequestorDetails', {
                        ACMobile : mobileNo,
                        ASAssnID : this.props.navigation.state.params.associtionID,
                        UNUnitID : this.props.navigation.state.params.unitID,
                        MRMRoleID: parseInt(this.state.PickerValueHolder),
                    }, {
                        headers: headers_2
                    })
                    .then(response_2 => {
                        let responseData_2 = response_2.data.data.member;
                        console.log('*******')
                        console.log('here_2 ', responseData_2)

                        if(!(_.isEmpty(responseData_2))) {
                            let userID = global.MyAccountID;
                            let sbUnitID = this.props.navigation.state.params.unitID;
                            let unitName = this.props.navigation.state.params.unitName;
                            let sbSubID = global.MyAccountID.toString() + this.props.navigation.state.params.associtionID.toString() + 'usernotif';
                            let sbRoleId = this.state.PickerValueHolder === '6' ? '2' : '3';
                            let sbMemID = responseData_2.meMemID;
                            let sbName = this.state.FirstName + " " + this.state.LastName;
                            let associationID = this.props.navigation.state.params.associtionID;
                            let associationName = this.props.navigation.state.params.associationName;
                            let ntType = "Join";
                            let ntTitle = 'Request to join' + ' ' + associationName + ' ' + 'Association';
                            let ntDesc = sbName + ' ' + 'requested to join' +  unitName + ' ' + 'unit in ' + associationName + ' ' + 'association';

                            console.log("userId", userID)
                            console.log("sbUnitID", sbUnitID)
                            console.log("sbSubID", sbSubID)
                            console.log("sbRoleId", sbRoleId)
                            console.log("sbMemID", sbMemID)
                            console.log("sbName", sbName)
                            console.log("associationID", associationID)
                            console.log("ntType", ntType)
                            console.log("ntTitle", ntTitle)
                            console.log("ntDesc", ntDesc)

                            firebase.messaging().subscribeToTopic(sbSubID);
                            // alert(sbSubID)
                            // Send a push notification to the admin here
                            axios.post(`${CLOUD_FUNCTION_URL}/sendAdminNotification`, {
                                userID: userID.toString(),
                                sbUnitID: sbUnitID.toString(),
                                unitName: unitName.toString(),
                                sbSubID: sbSubID.toString(),
                                sbRoleId: sbRoleId,
                                sbMemID: sbMemID.toString(),
                                sbName: sbName,
                                associationID: associationID.toString(),
                                associationName: associationName,
                                ntType: ntType,
                                ntTitle: ntTitle,
                                ntDesc: ntDesc,
                            }).then(response_3 => {
                                this.setState({ loading: false })
                                console.log('*******')
                                console.log('here_3 ')
                                console.log('*******')
                                let responseData_3 = response_3.data;
                                console.log(responseData_3)
                                this.props.navigation.navigate('SplashScreen');
                                Alert.alert('Alert', 'Request Send to Admin Successfully',
                                [
                                    { text: 'Ok', onPress: () => { } },
                                ],
                                { cancelable: false }
                                ); 
                            })
                        } else {
                            this.setState({ loading: false })
                            Alert.alert('Alert', 'You have already requested to join previously, your request is under review. You would be notified once review is complete',
                                [
                                    { text: 'Ok', onPress: () => { } },
                                ],
                                { cancelable: false }
                            );
                        }
                    })
                    .catch(error => {
                        this.setState({ loading: false })
                        console.log('********')
                        console.log(error)
                        console.log('********')
                    })
                } else {
                    this.setState({ loading: false })
                    Alert.alert('Alert', 'Request not sent..!',
                        [
                            { text: 'Ok', onPress: () => {} },
                        ],
                        { cancelable: false }
                    );
                }
            })
            .catch(error => {
                console.log("second error", error)
                this.setState({ loading: false })
                Alert.alert('Alert', 'Request not sent..!',
                    [
                        { text: 'Ok', onPress: () => { } },
                    ],
                    { cancelable: false }
                );
            })
        }
    }

    Validate(first, last, mobile,PickerValueHolder) {

        const reg = /^[0]?[6789]\d{9}$/;
        let regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
       
        if (first == '' ) {
            alert('Enter First Name');
            return false
        }   
        else if (last == '' ) {
            alert('Enter Last Name');
            return false

        } else if(mobile=='')  {
            alert('Enter Mobile Number');
            return false 
        }
        else if(PickerValueHolder==0)  {
            alert('Select Role');
            return false 
        }
        
        return true

    }

    renderInfo() {
    }

    render() {
        const { navigate } = this.props.navigation;
        console.log(this.props.navigation.state.params)
        // console.log(global)
        return (

            <View style={styles.container}>
                
        <View
style={{
paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:40,
}}>
<TouchableOpacity onPress={() => navigate(('Unit'), { cat: '' })}
style={{ flex: 1 , alignSelf:'center'}}>
<Image source={require('../pages/assets/images/back.png')}
style={{ height: 25, width: 25,  }} />
</TouchableOpacity>
<Text style={{ flex: 2, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>
<View style={{ flex: 3, alignSelf: 'center' }}>
<Image source={require('../pages/assets/images/OyeSpace_hor.png')}
style={{
height: 38, width: 95, margin: 5,
alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
}} />
</View>
<View style={{ flex: 3,alignSelf: 'flex-end',alignItems:'flex-end',justifyContent:'flex-end' }}>
                         

                        </View>


</View>
                    <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
<Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',justifyContent:'center',alignContent:'center',marginLeft:'3%'}}>Register User</Text>
        
                <ScrollView>
                    <View style={{ flexDirection: 'column' }}>
                        
                        {this.state.isLoading ? <View style={{ height: '15%' }}>
                            <ActivityIndicator />
                        </View> : <Text style={{ height: '0%' }}> </Text>}
                        <View style={styles.rectangle}>
                        <Picker
                            selectedValue={this.state.PickerValueHolder}
                            style={{ marginLeft: 5, marginRight:5  }}
                            onValueChange={(itemValue, itemIndex) => this.setState({ PickerValueHolder: itemValue })} >
                            <Picker.Item label="Joining as" value='0' />
                            <Picker.Item label="Owner" value="6" />
                            <Picker.Item label="Tenant" value="7" />
                        </Picker>

                        <View style={{ flexDirection: 'row' }}>


                                <View style={{
                                    flex: 1,paddingLeft:5,paddingRight:5,
                                }}>
  

                                    <TextField

                                        label='First Name'
                                        autoCapitalize='words'
                                        value={this.state.FirstName}
                                        fontSize={12}
                                        labelHeight={10}
                                        maxLength={30}
                                        characterRestriction={30}
                                        activeLineWidth={0.5}
                                        onChangeText={this.Firstname}
                                    />
                                </View>
                                <View style={{
                                    flex: 1,paddingLeft:5,paddingRight:5,
                                }}>
                                    <TextField
                                        flex={1}
                                        label='Last Name'
                                        value={this.state.LastName}
                                        autoCapitalize='words'
                                        fontSize={12}
                                        labelHeight={10}
                                        maxLength={30}
                                        characterRestriction={30}
                                        activeLineWidth={0.5}
                                        onChangeText={this.Lastname}
                                    />
                                </View>
           
                            </View>

           <View style={{ flexDirection: 'row', marginLeft: '5%', }}>
          <View style={{ flex: 0.10, flexDirection: 'row', alignItems: 'center', }}>
            <CountryPicker
              onChange={value => {
                this.setState({ cca2: value.cca2, callingCode: value.callingCode })
              }}
              cca2={this.state.cca2}
              translation="eng"
            ></CountryPicker>
          </View>
          <View style={{ flex: 0.12, flexDirection: 'row', marginLeft: 2, alignItems: 'center' }}>
            <Text style={{ color: 'black', fontSize: 12 }}>+{this.state.callingCode}</Text>
          </View>

          <View style={{ flex: 0.80, marginTop: 16 }}>
            <TextField
              label='Mobile Number'
              fontSize={12}
              value={this.state.MobileNumber}
              labelHeight={10}
              characterRestriction={10}
              activeLineWidth={0.5}
              keyboardType='numeric'
              maxLength={10}
              onChangeText={this.Mobile}
            />

          </View>
        </View>
        <View style={{ flex: 0.80, marginTop: 16 }}>
            <TextField
              label='Email ID'
              fontSize={12}
              value={this.state.EmailId}
              labelHeight={10}
              characterRestriction={50}
              activeLineWidth={0.5}
              keyboardType='email-address'
              maxLength={30}
              onChangeText={this.Email}
            />

          </View>
          {this.state.PickerValueHolder=="2"?
          <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ fontSize: 12, color: 'black', marginTop: 13, marginLeft: '2%' }}>Sold Date </Text>
                                <TouchableOpacity style={{ height: 40, }} onPress={this.onDOBPress.bind(this)} >
                                    <View style={styles.datePickerBox}>
                                        <Text style={styles.subtext1}>{this.state.dobText}</Text>
                                    </View>
                                </TouchableOpacity>
                                <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />
                                <Text style={{ fontSize: 12, color: 'black', }}> </Text>
                            </View>:
                             <View style={{ flex: 1, flexDirection: 'row' }}>
                             <Text style={{ fontSize: 12, color: 'black', marginTop: 13, marginLeft: '2%' }}>Occupied Date </Text>
                             <TouchableOpacity style={{ height: 40, }} onPress={this.onDOBPress.bind(this)} >
                                 <View style={styles.datePickerBox}>
                                     <Text style={styles.subtext1}>{this.state.endDate}</Text>
                                 </View>
                             </TouchableOpacity>
                             <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />
                             <Text style={{ fontSize: 12, color: 'black', }}> </Text>
                         </View>}
                            {this.state.loading ? 
                                <ActivityIndicator /> :
                                <TouchableOpacity style={styles.loginScreenButton}
                                    onPress={this.submit.bind(this, 
                                        this.state.FirstName,
                                        this.state.LastName,
                                        this.state.MobileNumber,
                                        this.state.EmailId,
                                        this.state.PickerValueHolder)}>

                                    <Text style={styles.loginScreenText}> Request Admin </Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({

    container: {
        justifyContent: 'center', backgroundColor: "#fff", height: '100%', width: '100%',
    },

    rectangle: {
        backgroundColor: 'white', padding: 5, 
        margin: 5,  alignContent: 'center',
    },
    loginScreenButton: {
        alignSelf: 'center',
        paddingTop: 2,
        paddingBottom: 2,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'orange',
        marginTop:20,
      },
      loginScreenText: {
        color: 'black', fontSize: 15, fontWeight: 'bold'
        },
    input: {
        marginLeft: '2%', marginRight: '2%', marginTop: '2%', height: 40, borderColor: '#F2F2F2',
        backgroundColor: '#F2F2F2', borderWidth: 1.5, borderRadius: 2,
        flexDirection: 'row',
    },
    picker: {
        transform: [
           { scaleX: .8 }, 
           { scaleY: .8 },
        ]
      },
    input_two: {
        marginLeft: 15, marginTop: 15, height: 40,
        borderColor: '#F2F2F2', backgroundColor: '#F2F2F2',
        borderWidth: 1.5, borderRadius: 2,
    },

    imagee: { height: 14, width: 14, margin: 10, },

    text: { fontSize: 13, color: 'black', justifyContent: 'center', },

    submitButton: {
        backgroundColor: '#7a42f4', padding: 10, margin: 15, height: 40,
    },

    submitButtonText: { color: '#FA9917' },
    subtext1: { fontSize: 12, color: 'black', margin: 2 },
    datePickerBox: {
        marginTop: 10,
        marginLeft: 4,
        borderColor: '#828282',
        borderWidth: 0.5,
        padding: 0,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        height: 25,
        justifyContent: 'center'
    },
})

export default CreateWorker;