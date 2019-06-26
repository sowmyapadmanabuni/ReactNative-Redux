import React, { Component } from 'react';
import {
    Platform, StyleSheet, Text, View,
    TextInput, Alert, Button, Dimensions, FlatList, ScrollView, ActivityIndicator,
    TouchableOpacity, ToastAndroid, Picker, Image, Card, Avatar, NetInfo, TouchableHighlight
  } from 'react-native';
  import { Dropdown } from 'react-native-material-dropdown';
  import { Fonts } from '../pages/src/utils/Fonts';
  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import MultiSelect from 'react-native-multiple-select';
  import BlinkView from 'react-native-blink-view'
  import ImagePicker from 'react-native-image-picker';
  import moment from 'moment';
  const options = {
    title: 'Select a Photo',
    takePhotoButton: 'Take a Photo',
    chooseFromLibraryButton: 'Choose From Library',
    quality: 0.5,
    maxWidth: 600,
    maxHeight: 800,
    storageOptions: {
      skipBackup: true,
    },
};
  export default class SOS extends Component {
    
    constructor(props) {
    super(props)

    this.state = {

 
      isBlinking:true,
      imgPath: '',
      workerID: 0,
      lat: '',
      long: '',
      ticketingID:''

    }

   
    
}

selectPhoto() {

    ImagePicker.launchCamera(options, (response) => {
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

componentDidMount(){
this.createEmergency();
console.log("America",global.SelectedRole)
}
createEmergency = () => {
    navigator.geolocation.getCurrentPosition((position) => {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        
        console.log('createEmergency gps ', lat + ' ' + long);
        console.log('createEmergency gps ',this.state.workerID);
        const currentposition = JSON.stringify(position);
        console.log('createEmergency gps ', currentposition);
        this.setState({ currentposition, lat, long });
        console.log('createEmergency lat ', this.state.lat + ',' + this.state.long);
    });

    if (this.state.guard_tot_count != 0) {
        console.log('createEmergency ', 'start ' + this.state.workerID);
        anu = {
            "TTTktTyID": 1,
            "TKGPSPnt": this.state.lat + ',' + this.state.long,
            "TKRaisdBy": global.MyFirstName + ' ' + global.MyLastName,
            "TKRBCmnts": "Emergency",
            "TKRBEvid": "Emergency",
            "MEMemID": global.MyOYEMemberID,
            "TKEmail": "",
            "TKMobile": global.MyMobileNumber,
            "UNUnitID": global.SelectedUnitID,
            "ASAssnID": global.SelectedAssociationID
        }
        //"WKWorkID": 614,
        console.log('createEmergency ', anu)
        fetch('http://' + global.oyeURL + '/oye247/api/v1/Ticketing/Create',
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
                console.log('createEmergency responseJson ', responseJson);

                if (responseJson.success) {
                    this.setState({ticketingID:responseJson.data.ticketingID})
                    const imgName = 'Association' + global.SelectedAssociationID + 'INCIDENT' + responseJson.data.ticketingID + 'N' + '0' + '.jpg';
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
                        fetch('http://api.oyespace.com/oyeliving/api/v1/association/upload', config).then(responseData => {
                            console.log("sucess==>");
                            console.log(responseData._bodyText);
                            console.log(responseData);
                            //  alert("Image uploaded done! Image path=\nhttp://cohapi.careofhomes.com/Images/selfie.jpg")
                            //  this.props.navigation.navigate('ViewIncidentList');
                        }).catch(err => {
                            console.log("err==>");
                            alert("Error with image upload!")
                            //  this.props.navigation.navigate('GuardListScreen');
                            console.log(err);
                        });
                    }
                    
                    fcmMsg = {
                        "data": {
                            "activt": 'Emergency',
                            "unitID": global.SelectedUnitID,
                            "associationID": global.SelectedAssociationID,
                            "name": global.MyFirstName + " " + global.MyLastName,
                            "mob": global.MyMobileNumber,
                            "incidentId": responseJson.data.ticketingID,
                            "gps": '',//this.state.lat + ',' + this.state.long,
                            "gmtdatetime": moment(new Date()).format('YYYY-MM-DD HH:mm'),
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
                            console.log('suvarna', responseJson);
                            alert('Alerted Guards successfully');

                        })
                        .catch((error) => {
                            console.error(error);
                            alert('caught error in fcmMsg');
                        });

                } else {
                    console.log('createEmergency', 'failed');
                    Alert.alert('Alert', 'failed..!',
                        [
                            { text: 'Ok', onPress: () => { } },
                        ],
                        { cancelable: false }
                    );
                }

            })
            .catch((error) => {
                console.error(error);
                console.log('createEmergency err ', error);
               // alert('caught error in create');

            });
    } else {
      //  alert('No on Duty Guards ');
    }
};


uploadImage() {
    //   alert('Guard Added Successfully!');


    const imgName = 'Association' + global.SelectedAssociationID + 'EMERGENCYINCIDENT' + this.state.ticketingID + 'N' + '0' + '.jpg';
    //      String imgName = PERSON + "Association" + prefManager.getAssociationId() + GUARD + movie.getGuardID() + ".jpg";
   console.log('raju',imgName);

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
            this.props.navigation.navigate('ResDashBoard');
        }).catch(err => {
            console.log("err==>");
            alert("Error with image upload!")
            this.props.navigation.navigate('ResDashBoard');
           // this.props.navigation.navigate('GuardListScreen');
            console.log(err);
        });
    } else {
        this.props.navigation.navigate('ResDashBoard');

    }
}
render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ backgroundColor: '#FFF', height: '100%' }}>
        <View>
          <View
            style={{
              paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
              borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:45,
            }}>
            <TouchableOpacity onPress={() => navigate(('ResDashBoard'), { cat: '' })}
              style={{ flex: 1 }}>
              <Image source={require('../pages/assets/images/back.png')}
                style={{ height: 25, width: 25, margin: 10, alignSelf: 'center' }} />
            </TouchableOpacity>
            <Text style={{ flex: 3, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>
            <View style={{ flex: 12, alignSelf: 'center' }}>
              <Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
                style={{
                  height: 40, width: 105, margin: 5,
                  alignSelf: 'center', justifyContent: 'center', alignItems: 'flex-start'
                }} />
            </View>
            <View style={{ flex: 4, alignSelf: 'center',marginLeft:'10%' }}>
           <Text style={{color:'black',fontSize:15}}onPress={this.uploadImage.bind(this)}
           >End SOS</Text>
            </View>
          </View>
          <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
        </View>
        <View style={{ }}>
        <Text style={{fontSize: 16, color: 'black',  alignSelf: 'center', fontWeight:'bold' }}>SOS Alert</Text>
     <BlinkView blinking={this.state.isBlinking?true:false} delay={1000/2}>
     <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}}
                        >
                         <Image source={require('../pages/assets/images/red_icon.png')} style={{width:170,height:170,justifyContent:'center',alignItems:'center'}}/>
                         <Text style={{ fontSize: 12, color: 'black'}}>Alerting all guards</Text>
                    </TouchableOpacity>
      </BlinkView>
      <Image
                            source={this.state.imageSource !=
                                null ?
                                this.state.imageSource :
                                require('../pages/assets/images/image.png')}
                            style={{
                                height: 120, width: 120, margin: 10,alignSelf:'center', margin: 15, borderRadius: 60, borderWidth: 2,
                            }} />

                        <TouchableOpacity
                            style={styles.loginScreenButton}
                            onPress={this.selectPhoto.bind(this)}  >
                            <Text style={styles.loginScreenText}> Take a Photo </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.loginScreenButton}
                            onPress={this.uploadImage.bind(this)}  >
                            <Text style={styles.loginScreenText}> Submit </Text>
                        </TouchableOpacity>
     
   
    </View>
   
      </View>
    )
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
alignSelf:'center',
        paddingTop: 2,
        paddingBottom: 2,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'orange',
        marginTop:5,
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