/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-07-18
 */

import React from 'react';
import {
    Alert,
    BackHandler,
    Dimensions,
    Image,
    Linking,
    PermissionsAndroid,
    Platform,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View,
    ScrollView
} from 'react-native';
import firebase from 'firebase';
import CreateSOSStyles from "./CreateSOSStyles";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import PatrollingCheckPointsStyles from "../Patrolling/PatrollingCheckPointsStyles";
import base from "../../base";
import EmptyView from "../../components/common/EmptyView";
import {connect} from "react-redux";
import ImagePicker from 'react-native-image-picker';
import {FlatList} from 'react-native-gesture-handler';
import {heightPercentageToDP, widthPercentageToDP} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

var Sound = require('react-native-sound');

const {height, width} = Dimensions.get('screen');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


class CreateSOS extends React.Component {
    constructor(props) {
        super(props);

        console.log("Props in Create SOS:", props);

        this.state = {
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            image: null,
            imageURI: null,
            isGuardDetailAvailable: false,
            deviceName: "",
            mobileNumber: "",
            imageArr: [],
            selectedImage: "",
            isModalOpen: false,
            sosImageArr: [],
            sosId:""
        };

        this.getCurrentLocation = this.getCurrentLocation.bind(this);
        this.createSOS = this.createSOS.bind(this);

    }

    componentWillMount() {
        Sound.setCategory('Playback');
        var sound = new Sound('sound_1.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            sound.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
            sound.setNumberOfLoops(-1);
        });
        

        console.log("Sound Loop:",sound.getNumberOfLoops())
        Platform.OS === 'ios' ? this.getCurrentLocation() : this.checkGPS();
    }

    checkGPS() {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
            .then(data => {
                console.log("DATATATATATATATTATA:", data);
                this.locationPermissionsAccess();
            }).catch(err => {

            console.log("DATATATATATATATTATA err", err);
            this.showDenialAlertMessage();
        });
    }

    locationPermissionsAccess() {
        (async () => {
            {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    );


                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                this.getCurrentLocation()

                            },
                            (error) => {
                                Alert.alert(
                                    'Location',
                                    'We are not able to get your current location.',
                                    [
                                        {
                                            text: 'Cancel',
                                            onPress: () => this.props.navigation.navigate('ResDashBoard'),
                                            style: 'cancel'
                                        },
                                        {text: 'Try Again', onPress: () => this.getCurrentLocation()},
                                    ],
                                    {cancelable: false}
                                )
                            },
                            {enableHighAccuracy: false, timeout: 5000, maximumAge: 1000, distanceFilter: 1}
                        );
                    } else {
                        console.log("Permission deny");
                        //alert("Location Permission denied")
                        this.showDenialAlertMessage()
                        //this.props.navigation.navigate("ResDashBoard")

                    }
                } catch (err) {
                    console.error("No Access  to location" + err);
                }
            }
        })();
    }

    showDenialAlertMessage() {
        if (Platform.OS === 'ios') {
            Alert.alert(
                'Location permission denied',
                'Please allow the location permission',
                [
                    {
                        text: "Don't Allow",
                        onPress: () => this.props.navigation.navigate("ResDashBoard"),
                        style: 'cancel'
                    },
                    {text: 'Allow', onPress: () => this.navigateToSettings()}
                ]
            );
        } else {
            Alert.alert(
                'Location permission denied',
                'Please provide location permissions in application settings',
                [
                    {text: "Ok", onPress: () => this.navigateToSettings()}
                ]
            );
        }
    }

    navigateToSettings() {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
        } else {
            this.props.navigation.navigate("ResDashBoard")
        }
    }


    componentDidUpdate() {
        if (Platform.OS === 'android') {
            setTimeout(() => {
                BackHandler.addEventListener('hardwareBackPress', () => this.processBackPress())
            }, 100)
        }
    }


    processBackPress(stat) {
        console.log("Part", stat);

        Alert.alert(
            'Stop SOS?',
            'Do you want to stop this SOS? ',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'Yes', onPress: () => this.stopSOS()},
            ],
            {cancelable: false},
          );
        return true;
    }


    stopSound(){
        Sound.setCategory('Playback');
        var sound = new Sound('sound_1.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            sound.stop((success) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        });
    }

    componentWillUnmount() {
        this.stopSound()
        BackHandler.removeEventListener('hardwareBackPress', () => this.processBackPress());
    }

    async getCurrentLocation() {
        console.log("User Reducer Data:", this.props);
        let self = this;
        try {
            await navigator.geolocation.getCurrentPosition((data) => {
                let LocationData = (data.coords);
                console.log("Location data:", LocationData);
                self.setState({
                    region: {
                        latitude: parseFloat(LocationData.latitude),
                        longitude: parseFloat(LocationData.longitude),
                        longitudeDelta: LONGITUDE_DELTA,
                        latitudeDelta: LATITUDE_DELTA
                    }
                }, () => this.props.navigation.state.params.isActive ? self.readUserData() : self.createSOS())
            });
        } catch (e) {
            console.log("Error:", e);
        }
    }

    componentDidMount() {
        this.readUserData()

    }


    async createSOS() {
        console.log('SOS',this.props.userReducer)
        let data = this.props;
        let associationID = data.associationID;
        //let associationID = 8;
        let userId = data.userReducer.MyAccountID;
        let userName =data.userReducer.userData.data.account[0].acfName;
        let userMobile = (data.userReducer.userData.data.account[0].acMobile).toString();
        let unitId = data.dashBoardReducer.uniID;
        let latitude = this.state.region.latitude;
        let longitude = this.state.region.longitude;
        let unitName = data.dashBoardReducer.selectedDropdown1;
        let isActive = true;


        console.log("Data to be saved:", this.state);
        let self = this;
        if (this.state.image === null) {
            firebase.database().ref('SOS/' + associationID + "/" + userId + "/").set({
                isActive, latitude, longitude, unitId, userId, userMobile, userName, unitName
            }).then((data) => {
                console.log("Data saved to RTD:", data);
                self.sendPushNotification();
            }).catch((error) => {
                console.log("Error:", error)
            })
        } else {
            const data = new FormData();
            let imgObj = {
                name: (this.state.image.fileName !== undefined) ? this.state.image.fileName : "XXXXX.jpg",
                uri: this.state.imageURI,
                type: (this.state.image.type !== undefined || this.state.image.type != null) ? this.state.image.type : "image/jpeg"
            };

            data.append('oyespace', imgObj);

            statForMediaUpload = await base.services.MediaUploadApi.uploadRelativeImage(data);
            console.log("Stat in Media Upload:", "http://mediaupload.oyespace.com/oyeliving/api/V1/", statForMediaUpload);
            let sosImage = "http://mediaupload.oyespace.com/" + statForMediaUpload;
            let imgArr = this.state.imageArr;
            console.log("Image Arr:", imgArr);
            imgArr.push(sosImage);
            this.setState({
                imageArr: imgArr
            }, () => {
                let tempArr = [];
                for (let i in imgArr) {
                    if (!imgArr[i].includes("content") && !imgArr[i].includes("file:///")) {
                        tempArr.push(imgArr[i])
                    }
                }
                let emergencyImages = tempArr;
                console.log("SOS Image Array:", emergencyImages);
                firebase.database().ref('SOS/' + associationID + "/" + userId + "/").update({
                    emergencyImages
                }).then((data) => {
                    console.log("Image Saved in RTDB", data);
                    //self.updateSOSInAPI(sosImage)
                }).catch((err) => {
                    console.log("Error:", err)
                });
            })

        }
    }


    async sendPushNotification(){
        let notificationDetails = {
            ntTitle:"ALERT !!!! Incoming SOS",
            ntDesc:this.props.userReducer.MyFirstName+" from your association has initiated a SOS. Please respond immediately",
            ntType:"SOS",
            sbSubID:"AllGuards"+this.props.associationID,
            associationID:this.props.associationID
        }

        let stat = await base.services.fcmservice.sendGatePN(notificationDetails);
        console.log("Notification Data",stat)
    }


    async createSOSInAPI() {
        let self = this;
        let data = self.props;

        let detail = {
            SOGPSPnt: self.state.region.latitude + "," + self.state.region.longitude,
            ACFName: data.userReducer.MyFirstName,
            ACMobile: (data.userReducer.MyMobileNumber).toString(),
            SOEmgyCnt: "",
            SOImage: "",
            ACAccntID: data.userReducer.MyAccountID,
            ASAssnID: data.associationID,
            // ACAccntID:455,
            // ASAssnID:5520
        };

        console.log("Stat in CreateSOSInAPI", detail);
        fetch(
            `http://api.oyespace.com/oyesafe/api/v1/SOS/Create`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
                },
                body: JSON.stringify(detail)
            }).then(response => response.json())
            .then(responseJson => {
            console.log("Response in Create SOS API:", responseJson)
            self.setState({
                sosId:responseJson.data.sosid
            })
        }).catch((err) => {
            console.log("Error", err)
        })
    }


    async updateSOSInAPI(imageURI) {
        let self = this;

        let detail = {
            SOImage : imageURI,
            SOSID   : self.state.sosId
        }
        console.log("Detail in SOS update:",detail)
    }

    async deleteSOSInAPI() {

    }


    readUserData() {
        let self = this;
        let associationID = self.props.associationID;
        //let associationID = 8;
        let userId = self.props.userReducer.MyAccountID;
        firebase.database().ref('SOS/' + associationID + "/" + userId + "/").on('value', function (snapshot) {
            let receivedData = snapshot.val();
            console.log("Receiveddata", snapshot.val(), self.state.isGuardDetailAvailable);
            if (receivedData !== null) {
                if ((receivedData.attendedBy !== undefined && receivedData.attendedBy !== null)) {
                    self.setState({
                        isGuardDetailAvailable: true,
                        deviceName: receivedData.attendedBy,
                        mobileNumber: receivedData.attendedByMobile,
                        imageArr: receivedData.emergencyImages === undefined ? [] : receivedData.emergencyImages,
                        region: {
                            latitude: receivedData.latitude,
                            longitude: receivedData.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }
                    })
                } else {
                    self.setState({
                        isGuardDetailAvailable: false,
                        imageArr: receivedData.emergencyImages === undefined ? [] : receivedData.emergencyImages,
                        region: {
                            latitude: receivedData.latitude,
                            longitude: receivedData.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }
                    })
                }
            } else {
                if (self.state.isGuardDetailAvailable) {
                    console.log("Receiveddata123");
                    self.props.navigation.goBack(null);
                }
            }
        });
    }

    openCamera() {

        if(this.state.imageArr.length>100){
            alert("Sorry, You can upload maximum 100 images in one SOS")
        }
        else{
            const options = {
                title: 'Take Image',
                quality: 0.5,       //Meduim Image Quality 
                storageOptions: {
                    skipBackup: true,
                    path: 'images',
                },
            };
            ImagePicker.launchCamera(options, (response) => {
                // Same code as in above section!
                console.log("Response:", response);
                if (!response.didCancel && !response.error) {
                    let imageArr = this.state.imageArr;
                    imageArr.push(response.uri);
                    this.setState({
                        image: response,
                        imageURI: response.uri,
                        imageArr: imageArr
                    }, () => this.createSOS())
                }
    
            });
        }
       
    }


    render() {
        let imageURI = this.state.imageURI === null ? require('../../../icons/camera.png') : {uri: this.state.imageURI};
        console.log("Guard Detail:", this.state);
        return (
            <ScrollView style={CreateSOSStyles.container}>
                <View style={{marginBottom:50}}>
                <View style={{height:heightPercentageToDP('10%'),
                width:widthPercentageToDP('100'),borderWidth:1,borderColor:base.theme.colors.primary,alignItems:'center',flexDirection:'row'}}>
                    <View style={{flex:0.50}}>
                    <Image
                    style={{height:40,width:40}}
                        source={require('../../../icons/back.png')}
                    />
                    </View>
                    <Text style={CreateSOSStyles.headerText}>SOS</Text>

                </View>
                <View style={CreateSOSStyles.header}>
                    <Text style={CreateSOSStyles.headerText}>Help On The Way</Text>
                </View>

                <View style={CreateSOSStyles.mapBox}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={CreateSOSStyles.map}
                        region={this.state.region}
                        showsUserLocation={false}
                        showsBuildings={true}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        pitchEnabled={false}
                        rotateEnabled={false}
                        followsUserLocation={true}
                        minZoomLevel={19}
                    >
                        {this.renderUserLocation()}
                    </MapView>
                </View>
                <EmptyView height={20}/>
                <View style={CreateSOSStyles.detailBox}>
                    <TouchableHighlight
                        underlayColor={base.theme.colors.transparent}
                        onPress={() => this.openCamera()} style={CreateSOSStyles.imageStyle}>
                        <Image
                            style={CreateSOSStyles.imageView}
                            source={imageURI}
                        />
                    </TouchableHighlight>

                    {this.state.isGuardDetailAvailable ?
                        <View style={CreateSOSStyles.guardView}>
                            <View style={CreateSOSStyles.guardHeadingView}>
                                <Text style={CreateSOSStyles.guardHeading}>Guard
                                    Detail</Text>
                            </View>
                            <Text>Device Name: {this.state.deviceName}</Text>
                            <Text>Mobile No.: {this.state.mobileNumber}</Text>
                        </View> : <View style={CreateSOSStyles.guardView}>
                            <Text style={CreateSOSStyles.guardHeading}>Waiting for confirmation ...</Text>
                        </View>}
                </View>
                <EmptyView height={30}/>
                <View style={{flexDirection: 'row', width: widthPercentageToDP('100%')}}>
                    {this.state.imageArr.length !== 0 ?
                        <View style={{width: widthPercentageToDP('90%'), left: 15, justifyContent: 'space-around'}}>
                            <FlatList
                                keyExtractor={(item, index) => index.toString()}
                                data={this.state.imageArr}
                                horizontal={true}
                                renderItem={(item, index) => this.renderImages(item, index)}
                                horizontal={true}
                            /></View> : <View/>
                    }
                </View>
                <EmptyView height={60}/>
                <View style={CreateSOSStyles.emergencyDetailBox}>
                    <View style={CreateSOSStyles.emergency}>
                        <Text style={CreateSOSStyles.emergencyHeader}>Emergency Contacts</Text>
                    </View>
                    <View style={CreateSOSStyles.detailBox}>
                        <TouchableOpacity
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.makePhoneCall(108)} style={CreateSOSStyles.cardView}>
                            <View style={CreateSOSStyles.subCardView}>
                                <Image style={CreateSOSStyles.imageStyles}
                                       source={require('../../../icons/ambulance.png')}>
                                </Image>
                                <View style={[CreateSOSStyles.subView]}>
                                    <Text style={CreateSOSStyles.count}>
                                        Ambulance
                                    </Text>
                                    <View style={{top: 5, flexDirection: 'row'}}>
                                        <Image
                                            resizeMode={'contain'}
                                            style={CreateSOSStyles.imageStyles1}
                                            source={require("../../../icons/call.png")}
                                        />
                                        <Text style={CreateSOSStyles.cardText}
                                              numberOfLines={2}>
                                            108
                                        </Text>
                                    </View>

                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.makePhoneCall(100)} style={CreateSOSStyles.cardView}>
                            <View style={CreateSOSStyles.subCardView}>
                                <Image style={CreateSOSStyles.imageStyles}
                                       source={require('../../../icons/police.png')}>
                                </Image>
                                <View style={[CreateSOSStyles.subView]}>
                                    <Text style={CreateSOSStyles.count}>
                                        Police
                                    </Text>
                                    <View style={{top: 5, flexDirection: 'row'}}>
                                        <Image
                                            resizeMode={'contain'}
                                            style={CreateSOSStyles.imageStyles1}
                                            source={require("../../../icons/call.png")}
                                        />
                                        <Text style={CreateSOSStyles.cardText}
                                              numberOfLines={2}>
                                            100
                                        </Text>
                                    </View>

                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.makePhoneCall(101)} style={CreateSOSStyles.cardView}>
                            <View style={CreateSOSStyles.subCardView}>
                                <Image style={CreateSOSStyles.imageStyles}
                                       source={require('../../../icons/fire_brigade.png')}>
                                </Image>
                                <View style={[CreateSOSStyles.subView]}>
                                    <Text style={CreateSOSStyles.count}>
                                        Fire Brigade
                                    </Text>
                                    <View style={{top: 5, flexDirection: 'row'}}>
                                        <Image
                                            resizeMode={'contain'}
                                            style={CreateSOSStyles.imageStyles1}
                                            source={require("../../../icons/call.png")}
                                        />
                                        <Text style={CreateSOSStyles.cardText}
                                              numberOfLines={2}>
                                            101
                                        </Text>
                                    </View>

                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableHighlight
                        underlayColor={base.theme.colors.transparent}
                        onPress={() => this.stopSOS()} style={CreateSOSStyles.stopSOSView}>
                        <View style={CreateSOSStyles.stopSOSTextView}>
                            <Text style={CreateSOSStyles.stopSOSText}>Stop SOS</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                {this._renderModal1()}
                </View>
            </ScrollView>
        )
    }

    _renderModal() {
        return (
            <Modal
                onRequestClose={() => this.setState({isModalOpen: false})}
                isVisible={this.state.isModalOpen}>
                <View style={{height: heightPercentageToDP('50%'), justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                        style={{
                            height: heightPercentageToDP('50%'),
                            width: heightPercentageToDP('50%'),
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

    _renderModal1() {
        return (
            <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={this.state.imageArr}
                horizontal={true}
                renderItem={(item, index) => this._renderModal(item, index)}
            />
        )
    }

    _enlargeImage(imageURI) {
        console.log("Sele:", imageURI);
        this.setState({
            selectedImage: imageURI,
            isModalOpen: true
        })
    }

    renderImages(item, index) {
        let imageURI = {uri: item.item};

        return (
            <TouchableHighlight
                onPress={() => this._enlargeImage(imageURI)}
                style={{height: 90, width: 90, flexDirection: 'row', justifyContent: "space-around", marginLeft: 10}}>
                <Image
                    style={CreateSOSStyles.imageView}
                    source={imageURI}
                />
            </TouchableHighlight>
        )

    }

    makePhoneCall(number) {
        Linking.openURL(`tel:${number}`)
    }

    async stopSOS() {
        let self = this;
        let associationID = self.props.associationID;
        //let associationID = 8;
        let userId = this.props.userReducer.MyAccountID;
        console.log("kscjd:", associationID, userId);
        self.stopSound();
        await firebase.database().ref('SOS/' + associationID + "/" + userId + "/").remove();
        self.setState({
            isGuardDetailAvailable: false
        });
        
        self.props.navigation.navigate("ResDashBoard");
    }

    async stopSOSInAPI(){
        let self = this;
        let detail = {
            SOSID:self.state.sosId,
            DEName:"",
            DEMobileNo:"",
            SOStatus:"Cancelled"
        };

        fetch(
            `http://api.oyespace.com/oyesafe/api/v1/SOS/SOSStopUpdate`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
                },
                body: JSON.stringify(detail)})
                .then(response => console.log("response in stop sos",response.json(),detail))
                .catch((err) => {
                    console.log("Error", err)
                })
    }

    renderUserLocation() {
        let self = this;
        let lat = self.state.region.latitude;
        let long = self.state.region.longitude;
        return (
            <View>
                <Marker key={1024}
                        pinColor={base.theme.colors.blue}
                        style={PatrollingCheckPointsStyles.marker}
                        coordinate={{latitude: lat, longitude: long}}>
                </Marker>
            </View>
        )
    }

}

const mapStateToProps = state => {
    return {
        associationID: state.UserReducer.SelectedAssociationID,
        userReducer: state.UserReducer,
        dashBoardReducer: state.DashboardReducer
    }
};


export default connect(mapStateToProps)(CreateSOS);
