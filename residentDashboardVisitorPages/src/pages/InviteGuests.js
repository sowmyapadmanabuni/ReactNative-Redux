/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Alert, BackHandler, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import Header from './src/components/common/Header'
import {Button, Form, Input, Item,} from "native-base"
import CountryPicker from 'react-native-country-picker-modal';
import {DatePickerDialog} from 'react-native-datepicker-dialog';
import moment from 'moment';
import Switch from '../../src/components/common/Switch.js'
import DateTimePicker from 'react-native-modal-datetime-picker';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view"
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {connect} from "react-redux";
import base from "../../../src/base";
import ProgressLoader from "rn-progress-loader";

var multipleEntries = "FALSE";

class InviteGuests extends Component {
    static navigationOptions = {
        title: "Invite Guests",
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {

            isLoading:false,
            buttonDisable:false,

            fname: "",
            lname: "",

            cca2: 'IN',
            callingCode: '91',

            mobNo: "",
            vehNo: "",
            emailId: "",
            purpose: "",

            dobText: moment(new Date()).format('YYYY-MM-DD'),//year + '-' + month + '-' + date,
            dobText1: moment(new Date()).format('YYYY-MM-DD'),//year + '-' + month + '-' + date,
            dobDate: "",
            dobDate1: "",

            isDateTimePickerVisible: false,
            isDateTimePickerVisible1: false,
            datetime: moment(new Date()).format('HH:mm:ss'),
            datetime1: moment(new Date()).format('HH:mm:ss'),
            datetimeString: new Date(),

            switch: false,

            count: 1,


        }
    }

    componentDidMount() {
        base.utils.validate.checkSubscription(this.props.userReducer.SelectedAssociationID)
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            console.log("Back KSCNJND");
            this.props.navigation.goBack(null); // works best when the goBack is async
            return true;
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    //Date Picker
    onDOBPress = () => {
        console.log('Date First selected ');

        let dobDate = this.state.dobDate;
        if (!dobDate || dobDate == null) {
            dobDate = new Date();
            this.setState({
                dobDate: dobDate
            });
        }
        this.refs.dobDialog.open({
            date: dobDate,
            minDate: new Date() //To restirct past dates
        });
    };
    onDOBPress1 = () => {
        console.log('Date Second selected ');

        let dobDate = this.state.dobDate1;
        if (!dobDate || dobDate == null) {
            dobDate = new Date();
            this.setState({
                dobDate1: dobDate
            });
        }
        this.refs.dobDialog1.open({
            date: dobDate,
            minDate: new Date()
        });
    };
    onDOBDatePicked = (date) => {
        console.log('Date selected First', date);
        console.log('Date selected First', moment(date).format('YYYY-MM-DD'));

        this.setState({
            dobDate: date,
            dobText: moment(date).format('YYYY-MM-DD'),
        });
    };
    onDOBDatePicked1 = (date) => {
        console.log('Date selected Second', date);
        console.log('Date selected Second Comp', moment(date).format('YYYY-MM-DD'));


        this.setState({
            dobDate1: date,
            dobText1: moment(date).format('YYYY-MM-DD'),
        });
    };

//Time Picker
    _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});
    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});
    _handleDatePicked = (datetime) => {
        console.log('A date has been picked: ', datetime);
        this._hideDateTimePicker();
        if (this.state.dobText === moment(new Date()).format('YYYY-MM-DD')) {
            if (moment(datetime).format('HH') < moment(new Date()).format('HH')) {
                alert('Invalid time')
            } else {
                this.setState({
                    datetime: moment(datetime).format('HH:mm:ss'),
                    datetimeString: datetime
                });
            }
        } else {
            this.setState({
                datetime: moment(datetime).format('HH:mm:ss'),
                datetimeString: datetime
            });
        }

    };
    _showDateTimePicker1 = () => this.setState({isDateTimePickerVisible1: true});
    _hideDateTimePicker1 = () => this.setState({isDateTimePickerVisible1: false});
    _handleDatePicked1 = (datetime1) => {
        this._hideDateTimePicker1();
        console.log('A date has been picked: ', datetime1, this.state.datetime);
        console.log('A date has been picked: ', this.state.datetime.split(':'));
        let dateArray = this.state.datetime.split(':');
        if (this.state.dobText === this.state.dobText1) {
            if (dateArray[0] > moment(datetime1).format('HH')) {
                alert('Invalid end date')
            } else {
                this.setState({
                    datetime1: moment(datetime1).format('HH:mm:ss'),
                });
            }
        } else {
            this.setState({
                datetime1: moment(datetime1).format('HH:mm:ss'),
            });
        }


    };


//Increment And Decrement
    incrementCount = () => {
        this.setState({
            count: this.state.count + 1
        })
    };
    decrementCount = () => {
        this.setState({
            count: this.state.count - 1
        })
    };


//Switch
    toggleSwitch = (value) => {
        this.setState({switch: value}, () => {
            console.log("DJFHEG:", this.state.switch)
        });
        if (value == true) {
            multipleEntries = "TRUE";
        } else {
            multipleEntries = "FALSE";
        }
        console.log('Switch doNotDisturb is: ' + multipleEntries)
    };

    sendInvitation = () => {
        this.setState({
            isLoading:true,
        });

        console.log("Send Invitation List", this.state, this.props);

        let startDate = this.state.dobText + ' ' + this.state.datetime;
        let endDate = this.state.dobText1 + ' ' + this.state.datetime1;

        let fname = this.state.fname;
        let lname = this.state.lname;
        let cca2 = this.state.cca2;
        let callingCode = this.state.callingCode;
        let mobNum = this.state.mobNo;
        let vehNo = this.state.vehNo;
        let emailId = this.state.emailId;
        let purpose = this.state.purpose;
        let dobDate = this.state.dobText;
        let dobDate1 = this.state.dobText1;
        time = this.state.datetime;
        let time1 = this.state.datetime1;
        let switches = this.state.switch;
        let count = this.state.count;

        const oyeMobileRegex = /^[0]?[456789]\d{9}$/;

        const oyeNonSpecialRegex = /[^0-9A-Za-z ,]/;
        const oyeNonSpecialNameRegex = /[^0-9A-Za-z .]/;
        const oyeEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/;

        const regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const OyeFirstName = /^[a-zA-Z ]+$/;
        const OyeLastName = /^[a-zA-Z ]+$/;
        const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


        if (fname.length == 0 || fname == '') {
            Alert.alert('Enter First Name');
            //return false;
        } else if (lname.length == 0 || lname == '') {
            Alert.alert('Enter Last Name');
            //return false;
        } else if (OyeFirstName.test(fname) === false) {
            Alert.alert('First Name should not contain Special Character & numbers');
            //return false
        } else if (OyeLastName.test(lname) === false) {
            Alert.alert('Last Name should not contain Special Character & numbers');
            //return false
        } else if (oyeNonSpecialRegex.test(vehNo) === true) {
            Alert.alert("Vehicle Number cannot contain special characters.")
        } else if (mobNum.length == 0) {
            //Alert.alert('Enter Mobile Number')
            return false
        } else if (mobNum.length < 10) {
            Alert.alert('Mobile number should not be less than 10 digits');
            //return false;
        } else if (purpose.length == 0 || purpose == '') {
            Alert.alert('Enter Purpose');
            //return false;
        }
        /*else if(!base.utils.validate.alphabetValidation(purpose)){
            Alert.alert('Special characters not allowed in purpose');
            return false;
        }*/
        else if (dobDate > dobDate1) {
            Alert.alert('Enter valid start date to Till date');
            //return false;
        } else if (time == time1 && dobDate == dobDate1) {
            Alert.alert('Enter valid start time to Till time');
            //return false;
        } else
        {
//http://apidev.oyespace.com/oye247/api/v1/Invitation/create
            console.log('Dates', dobDate + ' ' + time, dobDate1 + ' ' + time1);

            fetch(`http://${this.props.oyeURL}/oye247/api/v1/Invitation/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
                },
                body: JSON.stringify(
                    {
                        //"MeMemID"   :  4,
                        "UnUnitID": this.props.dashBoardReducer.uniID,
                        "INFName": fname,
                        "INLName": lname,
                        "INMobile": "+" + callingCode + mobNum,
                        "INEmail": emailId,
                        "INVchlNo": vehNo,
                        "INVisCnt": count,
                        "INPhoto": "SD",
                        "INSDate": startDate,
                        "INEDate": endDate,
                        "INPOfInv": purpose,
                        "INMultiEy": this.state.switch,
                        "ASAssnID": this.props.dashBoardReducer.assId,
                        "INQRCode": 1,
                        "ACAccntID": this.props.userReducer.MyAccountID
                    })
            })
                .then(response => response.json())
                .then(responseJson => {
                    console.log('Response JSON', responseJson);
                    Alert.alert("","Invitation created, please share the invitation using the share button");
                    this.props.navigation.goBack()
                })
                .catch(error => console.log(error))
        }
        this.setState({
            isLoading:false,
        });
    };

    mobileNumberInputCheck(text) {

        let check = /^\d$/;
        if (check.test(text[text.length - 1]) || text.length === 0) {
            console.log("text ",text)
            this.setState({ mobNo: text })
        }
    }

    render() {
        console.log("My Account Id -", this.props.accountId);
        return (
            <View style={styles.container}>
                {/* <Header/> */}
                <KeyboardAwareScrollView>

                    <Text style={styles.titleOfScreen}> Invite Guests </Text>
                    <Form style={{marginRight: hp('1.5%')}}>
                        <View style={{width: '100%', alignSelf: 'center'}}>
                            <Image source={require('../icons/illusn_bg.jpg')}
                                   style={{width: '100%', height: hp('20%')}}/>
                        </View>
                        <View style={{flexDirection: 'row',}}>

                            <Item style={{flex: 1}}>
                                {/* <Label style={{fontSize:hp('1.5%')}}>First Name</Label> */}
                                <Input style={{fontSize: hp('2%')}}
                                       autoCorrect={false}
                                       autoCapitalize="words"
                                       keyboardType="default"
                                       placeholder="First Name"
                                       onChangeText={fname => this.setState({fname: fname})}
                                />
                            </Item>
                            <Item style={{flex: 1}}>
                                {/* <Label style={{fontSize:hp('1.5%')}}>Last Name</Label> */}
                                <Input style={{fontSize: hp('2%')}}
                                       autoCorrect={false}
                                       autoCapitalize="words"
                                       keyboardType="default"
                                       placeholder="Last Name"
                                       onChangeText={lname => this.setState({lname: lname})}
                                />
                            </Item>

                        </View>
                        <View style={{flexDirection: 'row'}}>

                            <View style={{
                                flex: 0.35,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <CountryPicker
                                    hideAlphabetFilter={true}
                                    onChange={value => {
                                        this.setState({cca2: value.cca2, callingCode: value.callingCode})
                                    }}
                                    cca2={this.state.cca2}
                                    translation="eng"
                                ></CountryPicker>
                                <View style={{marginLeft: hp('1%'), justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{
                                        color: 'black',
                                        fontSize: hp('1.8%'),
                                        marginLeft: hp('0.1%')
                                    }}>+{this.state.callingCode}</Text>

                                </View>
                            </View>

                            <Item style={{flex: 0.5, marginLeft: hp('0.1%')}}>
                                {/* <Label style={{fontSize:hp('1.5%')}}>Mobile Number</Label> */}
                                <Input style={{fontSize: hp('2%')}}
                                       autoCorrect={false}
                                       autoCapitalize="words"
                                       keyboardType="number-pad"
                                       placeholder="Mobile Number"
                                       maxLength={10}
                                       onChangeText={mobNo => this.mobileNumberInputCheck(mobNo)}
                                       value={this.state.mobNo}
                                />
                            </Item>
                            <Item style={{flex: 0.5}}>
                                {/* <Label style={{fontSize:hp('1.5%')}}>Vehicle No.</Label> */}
                                <Input style={{fontSize: hp('2%')}}
                                       autoCorrect={false}
                                       autoCapitalize="characters"
                                       keyboardType="default"
                                       placeholder="Vehicle No."
                                       onChangeText={vehNo => this.setState({vehNo: vehNo})}
                                />
                            </Item>

                        </View>

                        <Item style={{flex: 1}}>
                            {/* <Label style={{fontSize:hp('1.5%')}}>Email Address</Label> */}
                            <Input style={{fontSize: hp('2%')}}
                                   autoCorrect={false}
                                   autoCapitalize="none"
                                   keyboardType="email-address"
                                   placeholder="Email Address"
                                   onChangeText={emailId => this.setState({emailId: emailId})}
                            />
                        </Item>

                        <Item style={{flex: 1}}>
                            {/* <Label style={{fontSize:hp('1.5%')}}>Purpose of Invitation</Label> */}
                            <Input style={{fontSize: hp('2%')}}
                                   autoCorrect={false}
                                   autoCapitalize="words"
                                   maxLength={30}
                                   keyboardType="default"
                                   placeholder="Purpose of Invitation"
                                   onChangeText={purpose => this.setState({purpose: purpose})}
                            />
                        </Item>

                        <View style={{flexDirection: 'column', marginTop: hp('1%'), marginLeft: hp('1.7%')}}>
                            <Text style={{fontSize: hp('1.5%'), color: 'grey', marginTop: hp('1%'),}}>Invitation
                                Validity:</Text>
                            <View style={{flexDirection: 'row', marginTop: hp('1%')}}>
                                <Text
                                    style={{color: '#ff8c00', marginRight: hp('1%'), fontSize: hp('1.8%')}}>From</Text>
                                <TouchableOpacity onPress={this.onDOBPress.bind(this)}>
                                    <View style={styles.datePickerBox}>
                                        <Text style={styles.datePickerText}>{this.state.dobText}</Text>
                                        <DatePickerDialog ref="dobDialog"
                                                          onDatePicked={this.onDOBDatePicked.bind(this)}/>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this._showDateTimePicker}>
                                    <View style={styles.datePickerBox}>
                                        <Text style={styles.subtext1}>{this.state.datetime}</Text>
                                        <DateTimePicker
                                            isVisible={this.state.isDateTimePickerVisible}
                                            onConfirm={this._handleDatePicked}
                                            mode='time'
                                            is24Hour={false}
                                            onCancel={this._hideDateTimePicker}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 3}}>
                                <Text style={{
                                    color: '#ff8c00',
                                    marginRight: hp('2.5%'),
                                    fontSize: hp('1.8%')
                                }}>Till</Text>
                                <TouchableOpacity onPress={this.onDOBPress1.bind(this)}>
                                    <View style={[styles.datePickerBox, {marginLeft: hp('0.7%')}]}>
                                        <Text style={styles.datePickerText}>{this.state.dobText1} </Text>
                                        <DatePickerDialog ref="dobDialog1"
                                                          onDatePicked={this.onDOBDatePicked1.bind(this)}/>
                                    </View>
                                </TouchableOpacity>
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
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignContent: 'space-between',
                            marginTop: 14,
                            marginLeft: hp('1.7%')
                        }}>
                            <Text style={{color: '#25CCF7', fontSize: hp('1.8%'),}}>Multiple Entries</Text>
                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                                <SwitchExample style={{justifyContent: 'flex-end',}}
                                               toggleSwitch1={this.toggleSwitch}
                                               switch1Value={this.state.switch}/>
                            </View>

                        </View>
                        <View style={{flexDirection: 'row', marginTop: hp('1%'), marginLeft: hp('1.7%')}}>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: hp('1.8%'), marginRight: hp('2%')}}>Guests Expected : </Text>
                            </View>
                            {/* <View style={{flexDirection:'row'}}>

                      {this.state.count <=1 ?
                        <TouchableOpacity><Text style={{height:0}}></Text></TouchableOpacity> :
                        <TouchableOpacity underlayColor='#fff' onPress={()=>{this.decrementCount()}}><Text style={{ color:'#25CCF7',fontSize:17 }}>-</Text></TouchableOpacity>
                      }
                      <Text style={{color:'#25CCF7',fontSize:17}}>{this.state.count}</Text>
                      <TouchableOpacity underlayColor='#fff' onPress={()=>{this.incrementCount()}}><Text style={{color:'#25CCF7',fontSize:17}}>+</Text></TouchableOpacity>
                  </View> */}
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <View style={[styles.incdecBtn]}>
                                    {this.state.count <= 1 ?
                                        <TouchableOpacity><Text style={{height: 0}}></Text></TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={this.decrementCount} underlayColor='#fff'>
                                            <Text style={{
                                                fontWeight: 'bold',
                                                fontSize: hp('2.5%'),
                                                color: '#25CCF7',
                                            }}>-</Text>
                                        </TouchableOpacity>
                                    }
                                    <Text style={{fontSize: hp('2.5%'), color: '#25CCF7',}}
                                          value={this.state.count}>{this.state.count}</Text>
                                    <TouchableOpacity onPress={this.incrementCount} underlayColor='#fff'>
                                        <Text style={{
                                            fontWeight: 'bold',
                                            fontSize: hp('2.5%'),
                                            color: '#25CCF7',
                                        }}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Form>
                    <View style={{
                        borderWidth: wp('0.1%'),
                        marginTop: hp('1%'),
                        marginBottom: hp('1%'),
                        borderColor: '#707070'
                    }}></View>
                    <View style={{flex: 0.1, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Button bordered info style={[styles.button, {backgroundColor: '#bcbcbc'}]}
                                onPress={() => this.props.navigation.goBack()}>
                            <Text style={{color: 'white', fontSize: hp('2%'), fontWeight: '500'}}>Cancel</Text>
                        </Button>
                        <Button bordered warning style={[styles.button, {backgroundColor: 'orange'}]}
                            //onPress={() => this.sendInvitation()}
                                onPress={() => {
                                    this.sendInvitation()
                                }}
                                disabled={this.state.buttonDisable}
                        >
                            <Text style={{color: 'white', fontSize: hp('2%'), fontWeight: '500'}}>Submit</Text>
                        </Button>
                    </View>

                </KeyboardAwareScrollView>
                <ProgressLoader
                    isHUD={true}
                    isModal={true}
                    visible={this.state.isLoading}
                    color={base.theme.colors.primary}
                    hudColor={"#FFFFFF"}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    containers: {},

    titleOfScreen: {
        marginTop: hp('1.5%'),
        textAlign: 'center',
        fontSize: hp('2.4%'),
        fontWeight: 'bold',
        marginBottom: hp('1.5%'),
        color: '#ff8c00',
        justifyContent: 'center',
        alignItems: 'center',
    },
    incdecBtn: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginRight: '5%',
        width: wp('14%'),
        height: hp('3.5%'),
        //borderWidth: hp('0.1%'),
        borderColor: 'orange',
        borderRadius: hp('0.6%'),
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
        marginBottom: hp('2%')
    },
    datePickerBox: {
        margin: hp('0.2%'),
        borderColor: '#ABABAB',
        borderBottomWidth: hp('0.1%'),
        justifyContent: 'center'

    },
    datePickerText: {fontSize: hp('1.8%'), marginLeft: hp('0.2%'), marginRight: hp('0.2%'), color: '#121212',},
    subtext1: {fontSize: hp('1.8%'), marginLeft: hp('0.2%'), marginRight: hp('0.2%'), color: '#121212'}
});

const mapStateToProps = state => {
    return {
        oyeURL: state.OyespaceReducer.oyeURL,
        MyFirstName: state.UserReducer.MyFirstName,
        MyLastName: state.UserReducer.MyLastName,
        MyMobileNumber: state.UserReducer.MyMobileNumber,
        viewImageURL: state.OyespaceReducer.viewImageURL,
        SelectedAssociationID: state.UserReducer.SelectedAssociationID,
        SelectedUnitID: state.UserReducer.SelectedUnitID,
        dashBoardReducer: state.DashboardReducer,
        userReducer: state.UserReducer
    };
};

export default connect(mapStateToProps)(InviteGuests);
