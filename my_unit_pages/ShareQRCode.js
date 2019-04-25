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
    TextInput, ScrollView, Alert, NetInfo, Button, Dimensions, FlatList, PixelRatio, ActivityIndicator,
    TouchableOpacity, TouchableHighlight, Picker, Image
} from 'react-native';
import ImagePicker from 'react-native-image-picker'
import DateTimePicker from 'react-native-modal-datetime-picker';
import { DatePickerDialog } from 'react-native-datepicker-dialog'
import { TextField } from 'react-native-material-textfield';
// import QRCode from 'react-native-qrcode-image';
// import QRCode from 'react-native-qrcode';
import { QRCode } from 'react-native-custom-qr-codes';

import moment from 'moment';
import PhoneInput from "react-native-phone-input";
import CountryPicker, {
    getAllCountries
} from 'react-native-country-picker-modal'
import { captureScreen } from "react-native-view-shot";
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { Fonts } from '../pages/src/utils/Fonts'

export default class ShareQRCode extends Component {

    constructor(props) {
        super(props);
        this.qrCode = '';
        const userCountryData = getAllCountries()
        let callingCode = null
        this.onButtonPressed = this.onButtonPressed.bind(this);
    }
    state = {
        inviteCreated: false,
        qrText: 'qwerty',
        Entrydate: '',
        stInvitionID: 0,
        dataBase64: null,
    }

    openShareScreen() {
        if (this.qrCode) {
            const shareOptions = { type: 'image/jpg', title: '', url: this.qrCode };
            Share.open(shareOptions)
                .then(res => console.log(res))
                .catch(err => console.error(err));
        }

    }
    componentDidMount() {
        const { params } = this.props.navigation.state;
        var EntryDate = params.EntryTimeDate.substring(0, 10);
        EntryDate = EntryDate.split('-');
        var EntryDateFormat = EntryDate.reverse().join('-');
        var ExitDate = params.EntryTimeDate.substring(0, 10);
        ExitDate = ExitDate.split('-');
        var ExitDateFormat = ExitDate.reverse().join('-');
        this.setState({

            Entrydate: EntryDateFormat
        })
        this.qrGeneration(params.Name + "," + "" + "," + params.MobileNo + "," + params.invitationID + "," +
            global.SelectedUnitID + "," + EntryDateFormat + "," + params.EntryTimeDate.substring(11, 16) + "," + params.Vehicleno + "," + params.VisitorCount + "," +
            ExitDateFormat + "," + params.invitationID + "," + 66 + ',', params.invitationID);

        NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectivityChange);
        NetInfo.isConnected.fetch().done((isConnected) => {
            if (isConnected == true) {
                this.setState({ connection_Status: "Online" })
            } else {
                this.setState({ connection_Status: "Offline" })
                Alert.alert('No Internet', 'Please Connect to the Internet. ',
                    [
                        { text: 'Ok', onPress: () => { this.props.navigation.navigate('ResDashBoard') } },
                    ],
                    { cancelable: false }
                );
            }

        });
    }
    qrGeneration(txt, invitationID) {

        this.setState({

            inviteCreated: true,
            stInvitionID: invitationID,
            qrText: txt,
        })

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

    onSharePress = () => Share.share({
        title: 'Invitation',
        message: global.MyFirstName + ' invites you to ' + //global.AssociationUnitName + ' in ' +
            global.AssociationName + ' for ' + this.state.textmsg + ' on ' + this.state.dobText + ' at ' +
            this.state.datetime + '  ' + 'http://122.166.168.160/Images/Invitation' + global.SelectedAssociationID + 'QR' + this.state.stInvitionID + '.jpg'
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

    takeScreenShot = () => {
        const { params } = this.props.navigation.state;
        captureScreen({
            format: "jpg",
            quality: 0.8
        })
            .then(
                //callback function to get the result URL of the screnshot
                uri => {
                    this.setState({ imageURI: uri }),
                    RNFS.readFile(this.state.imageURI, "base64").then(data => {
                        // binary data
                        console.log('data base64 ' + data);
                        this.setState({ dataBase64: data });
                        let shareImageBase64 = {
                            title: "Invitation",
                            message: global.MyFirstName + ' invites you to ' + //global.AssociationUnitName + ' in ' +
                                global.AssociationName + ' for ' + params.InvitationPurpose + ' on ' + this.state.Entrydate + ' at ' +
                                params.EntryTimeDate.substring(11, 16) + '  ',
                            url: 'data:image/png;base64,' + this.state.dataBase64,
                            subject: "Share Invitation" //  for email
                        };
                        Share.open(shareImageBase64);
                    });

                },
                error => {
                    console.error("Oops, Something Went Wrong", error),
                    console.log('error uploadImage ', error)
                }
            );
        // this.uploadImage();


    }

    render() {
        const { navigate } = this.props.navigation;
        const { params } = this.props.navigation.state;
        let phone = ''
        // this.state.lat=params.cat;
        // this.state.long=params.cat1;
        console.log();
        return (
            <View>
        <View style={{flexDirection:'row',}}>
                    <View style={{flex:1, marginTop:43,marginRight:0, justifyContent:'center',marginLeft:10}}>
                        <TouchableOpacity onPress={() => navigate(('InvitedGuestListScreen'), { cat: '' })}
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

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>Invited QR Code</Text>


         <View style={{flexDirection:'column', alignItems:'center',justifyContent:'center'}}>
         <QRCode logo={require('../pages/assets/images/Oyespaceqrcode.png')} logoSize={80} content={this.state.qrText}/>
         {/* <QRCode style={{  justifyContent:'center',alignItems:'center',alignSelf:'center', }} value={this.state.qrText}
                        size={200} bgColor='black' fgColor='white' /> */}

                    <Button style={{ marginTop: 50 }} title="Share" onPress={this.takeScreenShot} />
         </View>
                    

                    

 </View>

                
           
        )
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: 'white', borderColor: 'white', paddingLeft: 10, paddingRight: 10,
        borderRadius: 2, borderWidth: 1,
    },
})
