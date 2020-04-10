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

import CountryPicker, {
    getAllCountries
  } from 'react-native-country-picker-modal'

var db = openDatabase({ name: 'UserDatabase.db' });

const options = {
    title: 'Select a Photo',
    takePhotoButton: 'Take a Photo',
    chooseFromLibraryButton: 'Choose From Library',
    quality: 1,
    maxWidth: 600,
    maxHeight: 800,
    storageOptions: {
      skipBackup: true,
    },
};
var date = new Date().getDate();
var month = new Date().getMonth() + 1;
var year = new Date().getFullYear();
//hardcodes blk,flr,
export default class CreateWorker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            valid: "",
            type: "",
            value: "",
            isLoading: false,
            PickerValueHolder: '0',
            WeekOffPickerValueHolder: '0',
            imgPath: "",
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
        };

        this.renderInfo = this.renderInfo.bind(this);

    }

    state = {
        FirstName: '',
        LastName: '',
        MobileNumber: '',
        EmailId: '',
        AadhaarNumber: '',
        PickerValueHolder: '0',
        WeekOffPickerValueHolder: '0',
        isLoading: false,

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

    Aadhaar = (aadhaar) => {
        this.setState({ AadhaarNumber: aadhaar })
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
    onAddGuard = (first, last, mobile, PickerValueHolder, aadhaar) => {
     

        var result = this.Validate(first, last, mobile, PickerValueHolder, aadhaar)

        if (result === true) {
            console.log('Validation', "Passed");
            //   let number = this.phone.getValue() + mobile;
            /* "{
                ""WKFName""	 : ""Sowmya"",
                ""WKLName""	 : ""Padmanabhuni"",
                ""WKMobile""   : ""9490791520"",
                ""WKISDCode""  : ""+91"",
                ""WKImgName""  : ""Somu.jpeg"",
                ""WKWrkType""  : ""RegularVisitor"",
                ""WKDesgn""    : ""Developer"",
                ""WKIDCrdNo""  : ""A00009"",
                ""VNVendorID"" : 1,
                ""BLBlockID""  : 27,
                ""FLFloorID""  : 18,
                ""ASAssnID""   : 25
                }
                " */
            member = {
                "ASAssnID": global.SelectedAssociationID,
                "OYEMemberID": global.MyOYEMemberID,
                "OYEMemberRoleID": 2,
                "WKFName": first,
                "WKLName": last,
                "WKMobile": mobile,
                "WKISDCode":'+' + this.state.callingCode,
                //    "EmailID": email,
                "WKDesgn": this.state.PickerValueHolder,
                "WKWrkType": "Security",
                "VNVendorID": 0,
                "BLBlockID": 0,
                "FLFloorID": 0,
                "WKIDCrdNo": aadhaar
            }
            this.setState({ isLoading: false });
            console.log('member', member);
            //const url = 'http://192.168.1.39:80/oye247/api/v1/Worker/Create'
            const url = 'http://' + global.oyeURL + '/oye247/api/v1/Worker/Create'
            fetch(url,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
                    },
                    body: JSON.stringify(member)

                })

                .then((response) => response.json())
                .then((responseJson) => {

                    if (responseJson.success) {
                        this.syncWorkers(responseJson.data.worker.wkWorkID);

                        console.log('response', responseJson);

                    } else {
                        console.log('hiii', 'failed');
                       // alert('Failed to Add ' + this.state.PickerValueHolder)
                    }
                    console.log('suvarna', 'hi');
                })
                .catch((error) => {
                    console.error(error);
                    console.log(' error ', error);

                    alert('Caught error while Adding ' + this.state.PickerValueHolder)
                });
        } else {
            console.log('Validation', "Failed");
            //alert(' Validation  Failed ')
        }

    }
    syncWorkers(workerID) {
        console.log('GetWorkersList componentdidmount ', workerID)

        anu = {
            "WSWSTName": "Shift of " + this.state.FirstName,
            "WSWeekOff": spinner,
            "WKWorkIDs,": workerID,
            "MEMemID": global.MyOYEMemberID,
            "WKWorkID": workerID,
            "WSSDate": this.state.dobText,
            "ASAssnID": global.SelectedAssociationID
        }

        console.log('anu', anu)
        fetch('http://' + global.oyeURL + '/oye247/api/v1/WorkerShiftTiming/Create',
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
                console.log('WorkersLis in ', responseJson)

                if (responseJson.success) {
                    console.log('ravii', responseJson);
                    alert(this.state.PickerValueHolder + ' Added Successfully!');

                } else {
                    console.log('failurre')
                    alert(this.state.PickerValueHolder + ' Added , Create Shift!');

                }
                this.uploadImage(workerID);
            })
            .catch((error) => {

                console.log('WorkersLis err ', error)
                alert(this.state.PickerValueHolder + ' Added , Create Shift!');
                this.uploadImage(workerID);
            })



    }

    uploadImage(workerID) {
        //   alert('Guard Added Successfully!');
        console.log('WorkersLis uploadImage ', workerID)

        const imgName = 'PERSONAssociation' + global.SelectedAssociationID + 'GUARD' + workerID + '.jpg';
        //      String imgName = PERSON + "Association" + prefManager.getAssociationId() + GUARD + movie.getGuardID() + ".jpg";
        console.log('WorkersLis uploadImage ', workerID + ' ' + imgName);

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
                //     alert("Image uploaded done! Image path=\nhttp://cohapi.careofhomes.com/Images/selfie.jpg")
                this.props.navigation.navigate('GuardListScreen');
            }).catch(err => {
                console.log("err==>");
                alert("Error with image upload!")
                this.props.navigation.navigate('GuardListScreen');
                console.log(err);
            });
        } else {
            this.props.navigation.navigate('GuardListScreen');

        }
    }

    Validate(first, last, mobile, PickerValueHolder, aadhaar) {

        const reg = /^[0]?[6789]\d{9}$/;
        let regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        console.log('Ok Pressed!' + this.state.PickerValueHolder + ' ' + PickerValueHolder);
        spinner = this.state.WeekOffPickerValueHolder;
         if(this.state.imgPath==""){
            Alert.alert('Alert', 'Take a Security Guard Photo',
          [
              { text: 'Ok', onPress: () => { } },
          ],
          { cancelable: false }
        );
          }
          else  if (first == '' || first == undefined) {
            alert('Enter First Name');
            return false
        }   else if (global.oyeOnlyAlpha.test(first) == false ){
                      alert('First Name only contains alphabets.');
                    return false;
        } else if (last == '' || last == undefined) {
            alert('Enter Last Name');
            return false

        } else if (reg.test(mobile) === false || first == undefined) {
            alert('Enter valid Mobile Number');

            return false;

          
        } else if (this.state.PickerValueHolder == '0' || this.state.PickerValueHolder == undefined) {
            alert('Select Work Type');
            return false
        } 
        else if (global.oyeNonSpecialNameRegex.test(aadhaar) == true) {
                       alert('ID Card Number Cannot contain special characters.');
            
                        return false;
                    }
        return true

    }

    GetPickerSelectedItemValue = () => {
        Alert.alert(this.state.PickerValueHolder);
    }

    handleIncidentCategory = (Incident_category) => {
            this.setState({ PickerValueHolder: Incident_category })
        }

    renderInfo() {
        if (this.state.value) {

            return (
                <View style={styles.info}>
                    <Text>Is Valid:{" "}
                        <Text style={{ fontWeight: "bold" }}>
                            {this.state.valid.toString()}
                        </Text>
                    </Text>
                    <Text>Type: <Text style={{ fontWeight: "bold" }}>{this.state.type}</Text>
                    </Text>
                    <Text>Value:{" "}
                        <Text style={{ fontWeight: "bold" }}>{this.state.value}</Text>
                    </Text>
                </View>

            );
        }
    }

    render() {
        const { navigate } = this.props.navigation;
        let data = [{
            value: 'Security Guard',
        }, 
        {
            value:'Supervisor',
        }];
        let data01 = [{
            value: 'Sunday',
        }, 
        {
            value:'Monday',
        },{
            value: 'Tuesday',
        }, 
        {
            value: 'Wednesday',
        }, 
        {
            value: 'Thursday',
        }, 
        {
            value: 'Friday',
        }, {
            value: 'Saturday',
        }, 
    ];
        return (

            <View style={styles.container}>
                    <View>
                    <View>
        <View style={{flexDirection:'row',}}>
                    <View style={{flex:1, marginTop:43,marginRight:0, justifyContent:'center',marginLeft:10}}>
                        <TouchableOpacity onPress={() => navigate(('GuardListScreen'), { cat: '' })}
                        >
                        <Image source={require('../pages/assets/images/back.png')}
                        style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                        </TouchableOpacity>
                    </View>
                    {/* <TouchableOpacity 
                        style={{paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 1, alignItems: 'center', flexDirection: 'row',
                            paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:'6%'}}
                            onPress={() => this.props.navigation.navigate('SideMenu')}>
                        <Image source={require('../pages/assets/images/menu_button.png')}
                            style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                    </TouchableOpacity> */}
                    <View style={{ flex: 5, alignItems:'center', justifyContent:'center'}}>
                    <Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
                        style={{height: 40, width: 95, marginTop: 45,marginBottom:5}} />
                    </View>  
                    <View style={{flex:1,marginTop:45, marginRight:10, justifyContent:'center',}}>    
                    </View>                 
                </View> 

                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>Create Worker</Text>


          </View>
</View>
                <ScrollView>
                    <View style={{ flexDirection: 'column' }}>
                        <Image
                            source={this.state.imageSource !=
                                null ?
                                this.state.imageSource :
                                require('../pages/assets/images/icons8-manager-50.png')}
                            style={{
                                height: 120, width: 120, margin: 10, alignSelf: 'center', borderColor:
                                    'orange', margin: 15, borderRadius: 60, borderWidth: 2,
                            }} />

                        <TouchableOpacity
                            style={styles.loginScreenButton}
                            onPress={this.selectPhoto.bind(this)}  >
                            <Text style={styles.loginScreenText}> Take a Photo </Text>
                        </TouchableOpacity>
                        {this.state.isLoading ? <View style={{ height: '15%' }}>
                            <ActivityIndicator />
                        </View> : <Text style={{ height: '0%' }}> </Text>}
                        <View style={styles.rectangle}>
                            <View style={{ flexDirection: 'row' }}>


                                <View style={{
                                    flex: 1,paddingLeft:5,paddingRight:5,
                                }}>
                                    <TextField

                                        label='First Name'
                                        autoCapitalize='words'
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
              labelHeight={10}
              characterRestriction={10}
              activeLineWidth={0.5}
              keyboardType='numeric'
              maxLength={10}
              onChangeText={this.Mobile}
            />

          </View>
        </View>
        <View style={{ }}>
       {/*  <View style={{ flex: 1, marginTop: 20, }}>
        <Text style={{ fontSize: 16, color: 'black', marginTop: 3, marginLeft: 5 }}>Choose worker type: </Text>
        </View> */}
        <View style={{ flex: 1}}>
        <Dropdown        
         label='Worker Type'
         data={data}
        fontSize={15}
        onChangeText={this.handleIncidentCategory}
       />
       
                            {/* <Picker style={styles.picker}
                                selectedValue={this.state.PickerValueHolder}
                                onValueChange={(itemValue, itemIndex) => this.setState({ PickerValueHolder: itemValue })} >
  
                                <Picker.Item label="Worker Type" value='0' />
                                <Picker.Item label="Security Guard" value='Security Guard' />
                                <Picker.Item label="Supervisor" value='Supervisor' />
                            </Picker> */}
                            </View>
                            </View>
                        
                                      <View style={{
                                    flex: 1,paddingLeft:5,paddingRight:5,
                                }}>
 <TextField
                                        flex={1}
                                        label='ID Card Number'
                                        autoCapitalize='characters'
                                        labelHeight={10}
                                        maxLength={30}
                                        characterRestriction={30}
                                        activeLineWidth={0.5}
                                        fontSize={12}
                                        onChangeText={this.Aadhaar}
                                    />
                            </View>
                           
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ fontSize: 12, color: 'black', marginTop: 13, marginLeft: '2%' }}>From </Text>
                                <TouchableOpacity style={{ height: 40, }} onPress={this.onDOBPress.bind(this)} >
                                    <View style={styles.datePickerBox}>
                                        <Text style={styles.subtext1}>{this.state.dobText}</Text>
                                    </View>
                                </TouchableOpacity>
                                <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />
                                <Text style={{ fontSize: 12, color: 'black', }}> </Text>

                                <TouchableOpacity onPress={this._showDateTimePicker}>
                                    <DateTimePicker
                                        isVisible={this.state.isDateTimePickerVisible}
                                        onConfirm={this._handleDatePicked}
                                        mode='time'
                                        is24Hour={false}
                                        onCancel={this._hideDateTimePicker} />
                                    <View style={styles.datePickerBox}>
                                        <Text style={styles.subtext1}>{this.state.datetime}</Text>
                                    </View>
                                </TouchableOpacity>
                                <DatePickerDialog ref="dobDialog1" onDatePicked={this.onDOBDatePicked1.bind(this)} />
                                <Text style={{ fontSize: 12, color: 'black', marginTop: 13, marginLeft: '2%' }}>To </Text>
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
                            <View style={{ }}>
                                {/* <View style={{ flex: 1, marginTop: 20, }}>
                                    <Text style={{ fontSize: 16, color: 'black', marginTop: 3, marginLeft: 5 }}>Work off day: </Text>
                                </View> */}
                                <View style={{ flex: 1 }}>

                                <Dropdown
                                    label='Choose Weekly Off day'
                                    data={data01}
                                />


                                    {/* <Picker
                                        style={styles.picker}
                                        selectedValue={this.state.WeekOffPickerValueHolder}

                                        onValueChange={(itemValue, itemIndex) => this.setState({ WeekOffPickerValueHolder: itemValue })} >
                                        <Picker.Item label="Choose Weekly Off day" value='0' />
                                        <Picker.Item label="Sunday" value='Sunday' />
                                        <Picker.Item label="Monday" value='Monday' />
                                        <Picker.Item label="Tuesday" value='Tuesday' />
                                        <Picker.Item label="Wednesday" value='Wednesday' />
                                        <Picker.Item label="Thursday" value='Thursday' />
                                        <Picker.Item label="Friday" value='Friday' />
                                        <Picker.Item label="Saturday" value='Saturday' />
                                    </Picker> */}
                                </View>
                            </View>
                            <TouchableOpacity style={styles.loginScreenButton}
                                onPress={this.onAddGuard.bind(this, 
                                    this.state.FirstName,
                                    this.state.LastName,
                                    this.state.MobileNumber,
                                    this.state.PickerValueHolder,
                                    this.state.AadhaarNumber)}>

                                <Text style={styles.loginScreenText}> Submit </Text>
                            </TouchableOpacity>
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

module.exports = CreateWorker;