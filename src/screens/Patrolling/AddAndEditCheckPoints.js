/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-25
 */

import React from 'react';
import {
    Alert,
    BackHandler,
    Dimensions,
    Image,
    Keyboard,
    Linking,
    PermissionsAndroid,
    Platform,
    ScrollView,
    Text,
    View,
    TouchableHighlight,
    Animated,Easing,NativeEventEmitter
} from 'react-native';
import {connect} from 'react-redux';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import base from "../../base";
import {TextField} from "react-native-material-textfield";
import OSButton from "../../components/osButton/OSButton";
import EmptyView from "../../components/common/EmptyView";
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import RadioForm, {RadioButton} from 'react-native-simple-radio-button';
import OyeSafeApi from "../../base/services/OyeSafeApi";
import AddAndEditCheckPointStyles from "./AddAndEditCheckPointStyles";
import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import wifi from 'react-native-android-wifi';
import LottieView from 'lottie-react-native';
import Modal from "react-native-modal";
import {RNLocationSatellites} from 'react-native-location-satellites';
const GPSEventEmitter = new NativeEventEmitter(RNLocationSatellites)



var RNFS = require('react-native-fs');


const {width, height} = Dimensions.get('window');


const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


class AddAndEditCheckPoints extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            gpsLocation: "Set GPS Location",
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            buttonVisibility: true,
            checkPointName: "",
            types2: [{label: 'Start Point', value: 0}, {label: 'End Point', value: 1}, {
                label: 'Checkpoint',
                value: 2
            },],
            selectedValue: 0,
            selectedIndex: 0,
            checkPointType: "StartPoint",
            isEditing: false,
            checkPointId: '',
            cpArray: [],
            distance: 0,
            isDataCorrect: true,
            latitude: 0,
            longitude: 0,
            isSet: false,
            lastLatLong: 0,
            locationArrStored: [],
            isLottieModalOpen:false,
            progress: new Animated.Value(0),
            accuracy:0,
            satelliteCount:0
        });

        this.thread = null;

        this.getUserLocation = this.getUserLocation.bind(this)


    }


    setPointName(text) {
        this.setState({
            checkPointName: text
        })
    }

    componentDidUpdate() {

        setTimeout(() => {
            BackHandler.addEventListener('hardwareBackPress', () => this.processBackPress())
        }, 100)
    }

    componentWillUnmount() {
        setTimeout(() => {
            BackHandler.removeEventListener('hardwareBackPress', () => this.processBackPress())
        }, 0)

    }

    processBackPress() {
        console.log("Part");
        const {goBack} = this.props.navigation;
        goBack(null);
    }

    async componentWillMount() {
        console.log("SCDMVD:", this.props.navigation.state.params);
        this.updateSatelliteCount();
        let params = this.props.navigation.state.params !== undefined ? this.props.navigation.state.params.data.item : null;
        if (params === null) {
            (Platform.OS === 'ios' ? this.getUserLocation(params) : this.checkGPSStatus(params))
        } else {
            let gpsLocationArr = params.cpgpsPnt.split(" ");
            this.checkGPSStatus(params);
            this.setState({
                isEditing: true,
                checkPointName: params.cpCkPName,
                gpsLocation: params.cpgpsPnt,
                region: {
                    latitude: parseFloat(gpsLocationArr[0]),
                    longitude: parseFloat(gpsLocationArr[1]),
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                },
                selectedIndex: params.cpcPntAt === "StartPoint" ? 0 : params.cpcPntAt === "EndPoint" ? 1 : 2,
                checkPointId: params.cpChkPntID,
                selectedValue: params.cpcPntAt === "StartPoint" ? 0 : params.cpcPntAt === "EndPoint" ? 1 : 2,
            }, () => this.getAllCheckPoints())
        }

        console.log("Params:", params);

    };


    scanWifiStrength(callback) {
        if (Platform.OS == 'android') {
            wifi.reScanAndLoadWifiList((wifiStringList) => {
                callback((wifiStringList))
            }, (error) => {
                callback("")
            });
        } else {
            callback("");
        }
    }


    checkGPSStatus(params) {
        if (Platform.OS === "android") {
            RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
                .then(data => {
                    console.log("locationPermissionsAccess...")
                    this.locationPermissionsAccess(params);
                }).catch(err => {

                this.showDenialAlertMessage();
            });
        }

    }


    //locationPermissionsAccess(params) {
    async locationPermissionsAccess(params) {
        console.log("locationPermissionsAccess")
        try {
            console.log("INSIDE")
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        console.log("Honor ", params);
                        this.getUserLocation(params)

                    },
                    (error) => {
                        console.log("error-> ", error);
                        Alert.alert(
                            'Location',
                            'We are not able to get your current location.',
                            [
                                {
                                    text: 'Cancel',
                                    onPress: () => this.props.navigation.navigate('ResDashBoard'),
                                    style: 'cancel'
                                },
                                {text: 'Try Again', onPress: () => this.getUserLocation(params)},
                            ],
                            {cancelable: false}
                        )
                    },
                    {enableHighAccuracy: true, timeout: 5000, maximumAge: 1000, distanceFilter: 1}
                );
            } else {
                console.log("Permission deny");
                this.props.navigation.navigate("ResDashBoard")

            }
        } catch (err) {
            console.error("No Access  to location" + err);
        }

        /*(async () => {
            {
                try {
                    console.log("INSIDE")
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                console.log("Honor ", params);
                                this.getUserLocation(params)

                            },
                            (error) => {
                                console.log("error-> ", error);
                                Alert.alert(
                                    'Location',
                                    'We are not able to get your current location.',
                                    [
                                        {
                                            text: 'Cancel',
                                            onPress: () => this.props.navigation.navigate('ResDashBoard'),
                                            style: 'cancel'
                                        },
                                        {text: 'Try Again', onPress: () => this.getUserLocation(params)},
                                    ],
                                    {cancelable: false}
                                )
                            },
                            {enableHighAccuracy: true, timeout: 5000, maximumAge: 1000, distanceFilter: 1}
                        );
                    } else {
                        console.log("Permission deny");
                        this.props.navigation.navigate("ResDashBoard")

                    }
                } catch (err) {
                    console.error("No Access  to location" + err);
                }
            }
        })();*/
    }


    componentDidMount() {
        console.log(RNLocationSatellites)
        this.updateSatelliteCount();
        this.watchuserPosition();
    }

    updateSatelliteCount(){
        console.log("updateSatelliteCount...");
        let self = this;
        console.log("startLocationUpdate>> ",RNLocationSatellites.startLocationUpdate());

        GPSEventEmitter.addListener('RNSatellite', (event) => {
            console.log(":RN SATELLITE:",event)
            self.setState({
                satelliteCount : event.satellites
            })
        });
    }

    watchuserPosition() {
        console.log("watchuserPosition...");
        let locationArrStored = [];
        this.watchId = Geolocation.watchPosition(
            (position) => {
                console.log("sdvdfgddhdgs", position);
                let LocationData = position.coords;
                locationArrStored.push(LocationData);
                RNLocationSatellites.startLocationUpdate();

                /*GPSEventEmitter.addListener('RNSatellite', (event) => {
                    console.log(":RN SATELLITE:",event)
                    this.setState({
                        satelliteCount:event.satellites
                    })
                });*/
                this.setState({
                    region: {
                        latitude: LocationData.latitude,
                        longitude: LocationData.longitude,
                        longitudeDelta: LONGITUDE_DELTA,
                        latitudeDelta: LATITUDE_DELTA,
                    },
                    gpsLocation: LocationData.latitude + "," + LocationData.longitude,
                    locationArrStored: locationArrStored,
                    accuracy:LocationData.accuracy
                },()=>this.renderUserLocation())
            },
            (error) => {
                console.log(error);
            },
            {
                enableHighAccuracy: true,
                distanceFilter: 5,
                timeout: 15000,
                maximumAge:15000
            }
        );
    }


    componentWillUnmount() {
        GPSEventEmitter.removeListener('RNSatellite')
        GPSEventEmitter.removeListener('EVENT_NAME')
        if (this.watchId !== null) {
            Geolocation.clearWatch(this.watchId);
        }
    }


    async requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Location Permission Required',
                    'message': 'OyeSpace needs access to your location'
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.getUserLocation();
                console.log("Location permission granted")
            } else {
                console.log("Location permission denied")
            }
        } catch (err) {
            console.warn(err)
        }
    }


    async getUserLocation(params) {

        let self = this;
        try {
            await navigator.geolocation.getCurrentPosition((data) => {
                let LocationData = (data.coords);
                console.log("Lcoation data:",LocationData);
                self.setState({
                    region: {
                        latitude: LocationData.latitude,
                        longitude: LocationData.longitude,
                        longitudeDelta: LONGITUDE_DELTA,
                        latitudeDelta: LATITUDE_DELTA,
                    },
                    accuracy:LocationData.accuracy,
                    isEditing: params === null ? false : true,
                    checkPointName: params !== null ? params.cpCkPName : this.state.checkPointName,
                    gpsLocation: LocationData.latitude + "," + LocationData.longitude,
                    selectedIndex: params !== null ? params.cpcPntAt === "StartPoint" ? 0 : params.cpcPntAt === "EndPoint" ? 1 : 2 : this.state.selectedIndex,
                    checkPointId: params !== null ? params.cpChkPntID : this.state.checkPointId,
                    selectedValue: params !== null ? params.cpcPntAt === "StartPoint" ? 0 : params.cpcPntAt === "EndPoint" ? 1 : 2 : this.state.selectedValue,
                }, () => this.getAllCheckPoints())
            });
        } catch (e) {
            console.log("Error:", e);
            self.showDenialAlertMessage(error)
        }
    }


    showDenialAlertMessage(error) {
        console.log("error ",error)
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

    async getAllCheckPoints() {
        let self = this;
        base.utils.logger.log(self.props);

        let stat = await OyeSafeApi.getCheckPointList(self.props.SelectedAssociationID);
        //let stat = await OyeSafeApi.getCheckPointList(8);

        try {
            console.log("stat ",stat);
            if (stat.success) {
                console.log("Stat in ALl CP List:", stat.data.checkPointListByAssocID);
                let cpListLength = stat.data.checkPointListByAssocID.length;
                self.setState({
                    cpArray: stat.data.checkPointListByAssocID,
                    lastLatLong: stat.data.checkPointListByAssocID[cpListLength - 1].cpgpsPnt
                },()=>self.updateSatelliteCount())
            }
        } catch (e) {
            base.utils.logger.log(e);
        }

    }

    renderUserLocation() {
        let self = this;
        let lat = self.state.region.latitude;
        let long = self.state.region.longitude;
        return (
            <View>
                <Marker.Animated key={1024+'_' + Date.now()}
                                 pinColor={base.theme.colors.green}
                                 style={{alignItems: 'center', justifyContent: 'center'}}
                                 animateMarkerToCoordinate={(data)=>console.log("Data:",data)}
                                 coordinate={{latitude: lat, longitude: long}}>

                </Marker.Animated>
            </View>
        )
    }

    checkCount(){
        if(this.state.satelliteCount > 4) {
            this.validateFields()
        }
        else{
            if (this.state.accuracy >=12 && this.state.accuracy<=15){
                this.validateFields()
            }
            else{
                Alert.alert("Failed to get accurate user position","Can't proceed further")
            }
        }
    }

    validateFields() {
            if (base.utils.validate.isBlank(this.state.checkPointName)) {
                alert("Please enter Check Point Name")
            } else {
                let self = this;
                self.setState({isLottieModalOpen: true})
                Animated.timing(self.state.progress, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.linear,
                }).start();
                setTimeout(() => {
                    self.setState({
                        isLottieModalOpen: false
                    })
                }, 2100);
                self.addCheckPoint()
            }
        }

    async addCheckPoint() {
        base.utils.logger.log(this.props);
        let self = this;
        self.scanWifiStrength(async function (wifiArray) {
            let gpsLocation = parseFloat(self.state.region.latitude) + " " + parseFloat(self.state.region.longitude);
            let details = {};
            if (self.state.isEditing) {
                details = {
                    "CPCkPName": self.state.checkPointName,
                    "CPGPSPnt": gpsLocation,
                    "CPCPntAt": self.state.checkPointType,
                    "CPChkPntID": self.state.checkPointId,
                    "CPSurrName": '[]'
                };
            } else {
                details = {
                    "CPCkPName": self.state.checkPointName,
                    "CPGPSPnt": gpsLocation,
                    "ASAssnID": self.props.SelectedAssociationID,
                    "CPCPntAt": self.state.checkPointType,
                    "CPSurrName": '[]'
                };
            }

            console.log("Stat123456:",details)

            let stat = self.state.isEditing ? await OyeSafeApi.editCheckPoint(details) : await OyeSafeApi.addCheckPoint(details);
            console.log("Stat:", stat, details);
            try {
                if (stat !== undefined && stat !== null) {
                    if (stat.success) {
                        let message = self.state.isEditing ? "Check Point has been edited successfully" : "Check Point has added been successfully";
                        Alert.alert(
                            'Success',
                            message,
                            [
                                {
                                    text: 'See Checkpoints',
                                    onPress: () => self.props.navigation.navigate('patrollingCheckPoint', {isRefreshing: true})
                                },
                            ],
                            {cancelable: false},
                        );
                    } else {
                        let errMessage = stat.error.message;
                        Alert.alert(
                            'Error',
                            errMessage,
                            [
                                {
                                    text: "Got It",
                                    onPress: () => self.props.navigation.navigate('patrollingCheckPoint', {isRefreshing: true})
                                },
                            ],
                            {cancelable: false},
                        );
                        // alert("Oops, Something went wrong\n Possible Reason:-" + stat.error.message);
                        // self.props.navigation.navigate('patrollingCheckPoint', {isRefreshing: true})
                    }
                }
            } catch (e) {
                base.utils.logger.log(e)
            }
        })

    }

    setRadioButtonValue(val, index) {
        console.log("VAL & index:", val, index);
        this.setState({
            selectedValue: val,
            selectedIndex: index,
            checkPointType: index === 0 ? "StartPoint" : index === 1 ? "EndPoint" : "CheckPoint"
        });
    }


    render() {
        console.log("this.state.satelliteCount ",this.state.satelliteCount)
        //(":RN SATELLITE:",event)
        //console.log("State", this.state);
        let headerText = this.state.isEditing ? "Edit Check Point" : "Add Check Point";
        return (
            <ScrollView onPress={() => Keyboard.dismiss()}>
                <View style={AddAndEditCheckPointStyles.container}>
                    <View style={AddAndEditCheckPointStyles.header}>
                        <Text style={AddAndEditCheckPointStyles.headerText}>{headerText}</Text>
                    </View>
                    <View style={AddAndEditCheckPointStyles.mapBox}>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={AddAndEditCheckPointStyles.map}
                            region={this.state.region}
                            showsUserLocation={true}
                            showsBuildings={true}
                            zoomEnabled={true}
                            zoomTapEnabled={true}
                            minZoomLevel={20}
                            scrollEnabled={true}
                            onUserLocationChange={(data)=>this.renderUserLocation()}
                        >
                            {this.renderUserLocation()}
                        </MapView>
                    </View>
                    <View style={{height:hp('1'),top:hp('3'),width:wp('80'),alignSelf:'center',justifyContent:'center',alignItems:'center'}}>
                        <Text>Accuracy: {parseFloat(this.state.accuracy).toFixed(4)}</Text>
                        <Text>Satellite Count: {this.state.satelliteCount}</Text>
                    </View>

                    <View style={AddAndEditCheckPointStyles.textView}>
                        <TextField
                            fontSize={12}
                            label={'Patrolling Check Point Name'}
                            value={this.state.checkPointName}
                            tintColor={base.theme.colors.grey}
                            textColor={base.theme.colors.black}
                            labelHeight={10}
                            activeLineWidth={0.5}
                            returnKeyType='done'
                            onChangeText={(text) => this.setPointName(text)}
                        />
                    </View>
                    <View style={AddAndEditCheckPointStyles.gpsLocView}>
                        <View style={AddAndEditCheckPointStyles.gpsView}>
                            <Image
                                resizeMode={'contain'}
                                style={AddAndEditCheckPointStyles.gpsIcon}
                                source={require('../../../icons/location.png')}
                            />
                            <Text style={{
                                fontFamily: base.theme.fonts.medium,
                                fontSize: hp('2.5%')
                            }}>{this.state.gpsLocation}</Text>
                        </View>
                    </View>
                    <EmptyView height={35}/>
                    <View style={AddAndEditCheckPointStyles.radioView}>
                        <RadioForm
                            formHorizontal={true}
                            animation={true}
                        >
                            {this.state.types2.map((obj, i) => {
                                let is_selected = this.state.selectedIndex === i;
                                return (
                                    <View key={i} style={AddAndEditCheckPointStyles.radioButtonWrap}>
                                        <RadioButton
                                            isSelected={is_selected}
                                            obj={obj}
                                            index={i}
                                            buttonSize={10}
                                            labelHorizontal={true}
                                            buttonColor={base.theme.colors.primary}
                                            labelColor={base.theme.colors.black}
                                            style={[i !== this.state.types2.length - 1 && AddAndEditCheckPointStyles.radioStyle]}
                                            onPress={(value, index) => {
                                                this.setRadioButtonValue(value, index)
                                            }}
                                        />
                                    </View>
                                )
                            })}
                        </RadioForm>
                    </View>
                    <EmptyView height={0}/>
                    <View style={AddAndEditCheckPointStyles.buttonView}>
                        <OSButton onButtonClick={() => this.props.navigation.goBack(null)} oSBText={"Cancel"}
                                  oSBType={"custom"}
                                  oSBBackground={base.theme.colors.red}
                                  height={30} borderRadius={10}/>
                        {/* <OSButton onButtonClick={() => this.validateFields()} */}
                        <OSButton onButtonClick={() => this.checkCount()}
                                  oSBText={this.state.isEditing ? "Edit" : "Add"} oSBType={"custom"}
                                  //oSBBackground={this.state.satelliteCount < 4 ? base.theme.colors.grey : base.theme.colors.primary}
                                  oSBBackground={base.theme.colors.primary}
                                  height={30} borderRadius={10}/>
                    </View>
                </View>
                {this.openLottieModal()}
            </ScrollView>
        )
    }

    openLottieModal(){
        return(
            <Modal isVisible={this.state.isLottieModalOpen}
                   animationOutTiming={500}
                   backdropOpacity={0.12}
                   style={{
                       top:hp('35'),
                       flex:0.3,
                       backgroundColor: base.theme.colors.white,
                       alignSelf: 'center',
                       justifySelf:'center',
                       justifyContent:'center',
                       //width: wp('55%'),
                       borderRadius:hp('20'),
                       flexDirection:'row',
                       height:hp('50%'),
                       width:wp('60')
                   }}>

                <LottieView
                    progress={this.state.progress}
                    loop={true}
                    style={{

                        backgroundColor: base.theme.colors.white,
                        alignSelf: 'center',
                        justifyContent:'center',
                    }}
                    source={require('../../assets/gps.json')}
                />
                <Text style={{top:hp('23'),color:base.theme.colors.primary,fontSize:hp('2')}}>Optimising Location...</Text>

            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
        oyeURL: state.OyespaceReducer.oyeURL,
        champBaseURL: state.OyespaceReducer.champBaseURL,
        oye247BaseURL: state.OyespaceReducer.oye247BaseURL,
        oyeBaseURL: state.OyespaceReducer.oyeBaseURL,
        userReducer: state.UserReducer,
        SelectedAssociationID: state.DashboardReducer.assId
    }
};

export default connect(mapStateToProps)(AddAndEditCheckPoints)