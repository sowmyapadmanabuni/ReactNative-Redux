/**
* Sample React Native App
* https://github.com/facebook/react-native
*
* @format
* @flow
*/

import React, { Component } from 'react'
import { View, Text, Alert, NetInfo, ScrollView, TouchableOpacity, Image } from 'react-native';
//import { Switch } from 'react-native-switch';
import SwitchExample from '../registration_pages/SwitchExample';
import { Fonts } from '../pages/src/utils/Fonts'


var doNotDisturb = "FALSE";
var leaveAtGuard = "FALSE";

var otpVerification = "OFF";
var photoVerification = "OFF";
var mobileMandatoryForVisitor = "OFF";
var nameMandatoryForVisitor = "OFF";
var preventGuardAutoLogoff = "OFF";
var preventFaceID = "OFF"

//import SimpleToggleButton from '../registration_pages/SimpleToggleButton'

var date = new Date().getDate();
var month = new Date().getMonth() + 1;
var year = new Date().getFullYear();

console.disableYellowBox = true;
export default class HomeContainer extends Component {

    constructor(props) {

        super(props);
        this._onStateChange = this._onStateChange.bind(this)
        this.state = {
            connection_Status: "",
            switchStDoNotDisturb: false,
            switchStLeaveAtGuard: false,

            switchStOTPVerification: false,
            switchStPhotoVerification: false,
            switchStMobMandatoryForVisitor: false,
            switchStNameMandatoryForVisitor: false,
            switchStPreventGuardAutoLogoff: false,
            switchStPreventFaceID: false,
            value: ''

        }

    }

    _onStateChange(newState) {
        const value = newState ? "ON" : "OFF";
        this.setState({ toggleText: value })
    }

    toggleSwitchDoNotDistrub = (value) => {
        this.setState({ switchStDoNotDisturb: value })
        if (value == true) {
            doNotDisturb = "TRUE";
            this.dnd();
        } else {
            doNotDisturb = "FALSE";
            this.dnd();
        }
        console.log('Switch doNotDisturb is: ' + doNotDisturb)
    }

    toggleSwitchLeaveAtGuard = (value) => {
        this.setState({ switchStLeaveAtGuard: value })
        console.log('Switch leaveAtGuard is: ' + value);
        if (value == true) {
            leaveAtGuard = "TRUE";
            this.dnd();
        } else {
            leaveAtGuard = "FALSE";
            this.dnd();
        }
        console.log('Switch leaveAtGuard is: ' + leaveAtGuard);
    }

    toggleSwitchOTPVerification = (value) => {
        this.setState({ switchStOTPVerification: value })
        console.log('Switch  otpVerification: ' + value)
        if (value == true) {
            otpVerification = "ON";
            this.makeRemoteRequest();
        } else {
            otpVerification = "OFF";
            this.makeRemoteRequest();
        }
        this.sendFCM("SyncAssociationSettings", "OTPStatus", global.MyOYEMemberID, otpVerification);
        //OTPStatus , PhotoStatus , NameStatus , MobileStatus , LogoffStatus 
        console.log('Switch  otpVerification: ' + otpVerification)

    }

    toggleSwitchPhotoVerification = (value) => {

        this.setState({ switchStPhotoVerification: value })
        console.log('Switch photoVerification is: ' + value)
        if (value == true) {
            photoVerification = "ON";
            this.makeRemoteRequest();
        } else {
            photoVerification = "OFF";
            this.makeRemoteRequest();
        }
        this.sendFCM("SyncAssociationSettings", "PhotoStatus", global.MyOYEMemberID, photoVerification);
        console.log('Switch photoVerification is: ' + photoVerification)

    }

    toggleSwitchMobMandatoryForVisitors = (value) => {
        this.setState({ switchStMobMandatoryForVisitor: value })
        console.log('Switch 5 is: ' + value)

        if (value == true) {
            mobileMandatoryForVisitor = "ON";
            this.makeRemoteRequest();
        } else {
            mobileMandatoryForVisitor = "OFF";
            this.makeRemoteRequest();
        }
        console.log('Switch mobileMandatoryForVisitor is: ' + mobileMandatoryForVisitor)
        this.sendFCM("SyncAssociationSettings", "MobileStatus", global.MyOYEMemberID, mobileMandatoryForVisitor);
        //OTPStatus , PhotoStatus , NameStatus , MobileStatus , LogoffStatus 

    }
    toggleSwitchFaceIDMandatory = (value) => {
        this.setState({ switchStPreventFaceID: value })
        console.log('Switch FaceIDforVisitor is: ' + value)

        if (value == true) {
            preventFaceID = "ON";
            this.makeRemoteRequest();
        } else {
            preventFaceID = "OFF";
            this.makeRemoteRequest();
        }
        console.log('Switch mobileFaceIDForVisitor is: ' + preventFaceID)
        this.sendFCM("SyncAssociationSettings", "MobileStatus", global.MyOYEMemberID, preventFaceID);
        //OTPStatus , PhotoStatus , NameStatus , MobileStatus , LogoffStatus 

    }

    toggleSwitch6 = (value) => {

        this.setState({ switchStNameMandatoryForVisitor: value })
        console.log('Switch nameMandatoryForVisitor is: ' + value)

        if (value == true) {
            nameMandatoryForVisitor = "ON";
            this.makeRemoteRequest();
        } else {
            nameMandatoryForVisitor = "OFF";
            this.makeRemoteRequest();
        }
        console.log('Switch nameMandatoryForVisitor is: ' + nameMandatoryForVisitor)
        this.sendFCM("SyncAssociationSettings", "NameStatus", global.MyOYEMemberID, nameMandatoryForVisitor);
        //OTPStatus , PhotoStatus ,  , MobileStatus , LogoffStatus 

    }

    toggleSwitchPreventGuardAutoLogoff = (value) => {
        this.setState({ switchStPreventGuardAutoLogoff: value })
        console.log('Switch preventGuardAutoLogoff is: ' + value)
        if (value == true) {
            preventGuardAutoLogoff = "ON";
            this.makeRemoteRequest();
        } else {
            preventGuardAutoLogoff = "OFF";
            this.makeRemoteRequest();
        }
        console.log('Switch preventGuardAutoLogoff is: ' + preventGuardAutoLogoff)
        this.sendFCM("SyncAssociationSettings", "LogoffStatus", global.MyOYEMemberID, preventGuardAutoLogoff);
        //OTPStatus , PhotoStatus ,  , MobileStatus ,  
    }

    componentDidMount() {

        NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectivityChange);
        NetInfo.isConnected.fetch().done((isConnected) => {

            if (isConnected == true) {
                this.setState({ connection_Status: "Online" })
            } else {
                this.setState({ connection_Status: "Offline" })
                Alert.alert('Alert', 'Please connect to the internet. ',
                    [
                        { text: 'Ok', onPress: () => { } },
                    ],
                    { cancelable: false }
                );
            }

        });
        //http://api.oyespace.com/oyeliving/api/v1/association/getAssociationList/30
        const url1 = global.champBaseURL + 'association/getAssociationList/' + global.SelectedAssociationID
        fetch(url1, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {

                console.log('associationlist responseJson', responseJson);
                if (responseJson.success) {
                    //    "asiCrFreq": 0,    "asAssnID": 30,    "asPrpCode": "P00030", "asAddress": "Chandapura",
                    //    "asCountry": "India", "asCity": "",  "asState": "",  "asPinCode": "561000",  "asAsnLogo": "",
                    //   "asAsnName": "Demo Association",   "asPrpName": "",  "asPrpType": "",  "asRegrNum": "",
                    //    "asWebURL": "",   "asMgrName": "Veer", "asMgrMobile": "+919807045464",   "asMgrEmail": "stay_alert@oye247.com",
                    //    "asAsnEmail": "",   "aspanStat": "",    "aspanNum": "FVNBD1232L",  "aspanDoc": "api.oyespace.com/FVNBD1232L",
                    //    "asNofBlks": 0,   "asNofUnit": 20, "asgstNo": "quwuehsjwiiwiei", "asTrnsCur": "",  "asRefCode": "no",
                    //    "asMtType": "", "asMtDimBs": 0, "asMtFRate": 0, "asUniMsmt": "", "asbGnDate": "0001-01-01T00:00:00",
                    //    "aslpcType": "",  "aslpChrg": 0, "aslpsDate": "0001-01-01T00:00:00", "asotpStat": "OFF", "asopStat": "OFF",
                    //    "asonStat": "ON", "asomStat": "OFF","asoloStat": "OFF", "asgpsPnt": null, "asdPyDate": "0001-01-01T00:00:00",
                    //    "asdCreated": "0001-01-01T00:00:00", "asdUpdated": "2018-12-14T11:07:03", "asIsActive": false,
                    //   "asbToggle": false,  "asavPymnt": false, "asaInvc": false, "asAlexaItg": false, "asaiPath": "",
                    //    "asOkGItg": false, "asokgiPath": "", "asSiriItg": false,"assiPath": "", "asCorItg": false,    "asciPath": "",
                    //  "ASONStat": "ON",
                    nameMandatoryForVisitor = responseJson.data.association.asonStat;
                    //    "ASOPStat":
                    photoVerification = responseJson.data.association.asopStat;
                    //"ASOMStat":
                    mobileMandatoryForVisitor = responseJson.data.association.asomStat;
                    //"ASOLOStat": 
                    preventGuardAutoLogoff = responseJson.data.association.asoloStat;
                    //"ASOTPStat": 
                    otpVerification = responseJson.data.association.asotpStat;
                    preventFaceID=responseJson.data.association.asotpStat
                    

                    console.log('Switch mobileMandatoryForVisitor is: ' + nameMandatoryForVisitor)
                    if (nameMandatoryForVisitor == "ON") {
                        this.setState({ switchStNameMandatoryForVisitor: true })
                    } else {
                        this.setState({ switchStNameMandatoryForVisitor: false })
                    }

                    console.log('Switch mobileMandatoryForVisitor is: ' + mobileMandatoryForVisitor)
                    if (mobileMandatoryForVisitor == "ON") {
                        this.setState({ switchStMobMandatoryForVisitor: true })
                    } else {
                        this.setState({ switchStMobMandatoryForVisitor: false })
                    }

                    console.log('Switch photoVerification is: ' + photoVerification)
                    if (photoVerification == "ON") {
                        this.setState({ switchStPhotoVerification: true })
                    } else {
                        this.setState({ switchStPhotoVerification: false })
                    }

                    console.log('Switch otpVerification is: ' + otpVerification)
                    if (otpVerification == "ON") {
                        this.setState({ switchStOTPVerification: true })
                    } else {
                        this.setState({ switchStOTPVerification: false })
                    }

                    console.log('Switch switchStPreventGuardAutoLogoff is: ' + preventGuardAutoLogoff)
                    if (preventGuardAutoLogoff == "ON") {
                        this.setState({ switchStPreventGuardAutoLogoff: true })
                    } else {
                        this.setState({ switchStPreventGuardAutoLogoff: false })
                    }
                    console.log('Switch switchStPreventFaceID is: ' + preventFaceID)
                    if (preventGuardAutoLogoff == "ON") {
                        this.setState({ switchStPreventFaceID: true })
                    } else {
                        this.setState({ switchStPreventFaceID: false })
                    }

                } else {
                    console.log('associationlist responseJson failurre')
                }
                

            })
            .catch((error) => {
                console.log('associationlist err ' + error)
            })

        anu = {
            "ACMobile": global.MyISDCode + global.MyMobileNumber
        }
        const url2 = global.champBaseURL + 'Member/GetMemberListByMobileNumber';
        console.log('anu', url2 + ' ff ' + global.MyISDCode + global.MyMobileNumber);
        fetch(url2,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //  "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
                    "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
                },
                body: JSON.stringify(anu)
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('bf responseJson ', responseJson);

                if (responseJson.success) {
                    console.log('MyMembership responseJson count', responseJson.data.memberList.filter(x => x.unUnitID == global.SelectedUnitID).length + ' ' + global.SelectedUnitID);
                    for (let i = 0; i < responseJson.data.memberList.filter(x => x.unUnitID == global.SelectedUnitID).length; ++i) {


                        console.log('Results MyMembership', responseJson.data.memberList[i].meMemID + ' ' + responseJson.data.memberList[i].asAssnID);
                        // this.insert_MyMembership(responseJson.data.memberList[i].meMemID, responseJson.data.memberList[i].asAssnID,
                        // responseJson.data.memberList[i].oyeUnitID, responseJson.data.memberList[i].firstName,
                        // responseJson.data.memberList[i].lastName, responseJson.data.memberList[i].mobileNumber,
                        // responseJson.data.memberList[i].email, responseJson.data.memberList[i].parentAccountID,
                        // responseJson.data.memberList[i].mrmRoleID, responseJson.data.memberList[i].meIsActive,
                        // responseJson.data.memberList[i].acAccntID, responseJson.data.memberList[i].vehicleNumber);

                        this.setState({ switchStDoNotDisturb: responseJson.data.memberList[0].medndStat })
                        if (this.state.switchStDoNotDisturb == true) {
                            doNotDisturb = "TRUE";
                        } else {
                            doNotDisturb = "FALSE";
                        }
                        console.log('Switch mobileMandatoryForVisitor is: ' + doNotDisturb)

                        this.setState({ switchStLeaveAtGuard: responseJson.data.memberList[0].melvaGrd })
                        if (this.state.switchStLeaveAtGuard == true) {
                            leaveAtGuard = "TRUE";
                        } else {
                            leaveAtGuard = "FALSE";
                        }
                        console.log('Switch leaveAtGuard is: ' + leaveAtGuard);
                    }

                } else {
                    //alert('You are not a Member of any Association');
                }
                console.log('suvarna', 'hi');
            })
            .catch((error) => {
                console.error(error);
            });
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

    dnd = () => {

        anu = {
            "MEDNDStat": doNotDisturb,
            "MEDNDStrt": year+"-"+month+"-"+date,//year+"-"+month+"-"+date, "2018-11-21"
            "MEDNDStop": year+"-"+month+"-"+(date+1),
            "MELVAGrd": leaveAtGuard,
            "MELVAGSrt": year+"-"+month+"-"+date,
            "MELVAGStp": year+"-"+month+"-"+(date+1),
            "MEVisATyp": "af",
            "MEMemID": global.MyOYEMemberID
        }
        console.log('anu', anu)

        fetch(global.champBaseURL + 'MemberDNDLeaveAtGuardStatus/Update',
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
                console.log('logresponse', responseJson);

                if (responseJson.success) {
                    alert('Updated successfully');
                } else {
                    console.log('hiii', 'failed');
                    alert('Updation failed');
                }

            })
            .catch((error) => {
                console.error(error);
                alert('error')
            });
        this.sendFCM("SyncMemberDNDstatus", doNotDisturb, global.MyOYEMemberID, leaveAtGuard);

    }

    makeRemoteRequest = () => {

        // "ASONStat" : "ON",
        // "ASOPStat" : "ON",
        // "ASOMStat" : "ON",
        // "ASOLOStat" : "ON",
        // "ASOTPStat" : "ON",
        // "ASAssnID" : 25
        // "ASFaceDet" :"True"

        anu = {

            "ASONStat": nameMandatoryForVisitor,
            "ASOPStat": photoVerification,
            "ASOMStat": mobileMandatoryForVisitor,
            "ASOLOStat": preventGuardAutoLogoff,
            "ASOTPStat": otpVerification,
            "ASAssnID": global.SelectedAssociationID,
            "ASFaceDet" :preventFaceID

        }

        console.log('anu', anu);
        fetch(global.champBaseURL + 'AssociationStatuses/Update',
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
                console.log('logresponse', responseJson);
                if (responseJson.success) {
                    alert('Updated successfully');
                } else {
                    console.log('hiii', 'failed');
                    alert('failed to send');
                }

            })
            .catch((error) => {
                console.error(error);
                alert('error')
            });

    }

    sendFCM(actvt, nam, iid, ob) {
        fcmMsg = {
            "data": {
                "activt": actvt,
                "name": nam,
                "nr_id": iid,
                "entry_type": "",
                "mobile": ob,
            },
            "to": "/topics/AllGuards" + global.SelectedAssociationID,
        }
        console.log('fcmMsg ', fcmMsg);
        fetch('https://fcm.googleapis.com/fcm/send',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "key=AAAAZFz1cFA:APA91bHV9vd8g4zSMR13q_IYrNmza0e0m0EgG4BJxzaQOcH3Nc3RRrTfYNyRryEgz0iDQwXhP-XYHAGOIcgYjLOf2KnwYp-6_9XKNdiYzjakfnFFruYz89BXpc474OWJBU_ZzCScV6Zy",
                },
                body: JSON.stringify(fcmMsg)
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('fcmMsg if ', responseJson);
            })
            .catch((error) => {
                console.error(error);
                console.log('fcmMsg err', error);
                //alert('caught error in fcmMsg');
            });
        ///FCM end
    }

    render() {
        const {
            navigate } = this.props.navigation;
        return (
            <View style={{ backgroundColor: '#FFF', height: '100%' }}>

<View style={{flexDirection:'row',}}>
                    <View style={{flex:1, marginTop:43,marginRight:0, justifyContent:'center',marginLeft:'2%'}}>
                        <TouchableOpacity onPress={() => navigate(('AdminFunction'), { cat: '' })}
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
                    <View style={{ flex: 6, alignItems:'center', justifyContent:'center',}}>
                    <Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
                        style={{height: 40, width: 95, marginTop: 45,marginBottom:5}} />
                    </View>  
                    <View style={{flex:1,marginTop:45, marginRight:10, justifyContent:'center',}}>    
                    </View>                 
                </View> 

                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>Admin Settings</Text>
                {this.state.isLoading
                    ?
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white'
                    }}>
                        <ActivityIndicator
                            size="large"
                            color="#330066"
                            animating />
                    </View>
                    :
                    <ScrollView>
                           
                        <View style={{ flexDirection: 'column', paddingTop: 2,
                        margin:'3%',paddingBottom:5,
                backgroundColor: 'white',
                borderRadius: 5,
                borderWidth: 1,
                borderColor: 'orange'  }}>

                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Text style={{flex:5 , fontSize: 15,  color: 'black', marginLeft: 10 }}>OTP Verification for Visitors: </Text>
                                <SwitchExample
                                    toggleSwitch1={this.toggleSwitchOTPVerification}
                                    onValueChange={(switch1Value3) => this.setState({ switch1Value3 })}
                                    switch1Value={this.state.switchStOTPVerification} />
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Text style={{flex:5 , fontSize: 15,  color: 'black', marginLeft: 10 }}>Photo of Visitors for Verification: </Text>
                                <SwitchExample
                                    toggleSwitch1={this.toggleSwitchPhotoVerification}
                                    switch1Value={this.state.switchStPhotoVerification} />
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Text style={{flex:5 , fontSize: 15,  color: 'black', marginLeft: 10 }}>Mobile Number mandatory for Visitors: </Text>
                                <SwitchExample
                                    toggleSwitch1={this.toggleSwitchMobMandatoryForVisitors}
                                    switch1Value={this.state.switchStMobMandatoryForVisitor} />
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Text style={{flex:5 , fontSize: 15,  color: 'black', marginLeft: 10 }}>Visitors Name mandatory: </Text>
                                <SwitchExample
                                    toggleSwitch1={this.toggleSwitch6}
                                    switch1Value={this.state.switchStNameMandatoryForVisitor} />
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Text style={{flex:5 , fontSize: 15,  color: 'black', marginLeft: 10 }}>Prevent Auto Logoff of Guards: </Text>
                                <SwitchExample
                                    toggleSwitch1={this.toggleSwitchPreventGuardAutoLogoff}
                                    switch1Value={this.state.switchStPreventGuardAutoLogoff} />
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Text style={{ flex:5 ,fontSize: 15,  color: 'black', marginLeft: 10 }}>Do Not Disturb: </Text>
                                <SwitchExample
                                    toggleSwitch1={this.toggleSwitchDoNotDistrub}
                                    switch1Value={this.state.switchStDoNotDisturb} />
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Text style={{ flex:5 ,fontSize: 15,  color: 'black', marginLeft: 10 }}>Leave the Courier with Guard: </Text>
                                <SwitchExample
                                    toggleSwitch1={this.toggleSwitchLeaveAtGuard}
                                    switch1Value={this.state.switchStLeaveAtGuard} />
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Text style={{flex:5 , fontSize: 15,  color: 'black', marginLeft: 10 }}>Face Detection Mandatory for Visitor: </Text>
                                <SwitchExample
                                    toggleSwitch1={this.toggleSwitchFaceIDMandatory}
                                    switch1Value={this.state.switchStPreventFaceID} />
                            </View>

                            {/* <Text style={{fontSize: 20, textAlign: 'center', marginBottom: 20}}> You are { this.state.connection_Status } </Text> */}
                            {/* <SimpleToggleButton onStateChange={this._onStateChange}/>
<Text>State: {toggleText} </Text> */}

                        </View>
                    </ScrollView>
                }
            </View>
        );

    }

}
