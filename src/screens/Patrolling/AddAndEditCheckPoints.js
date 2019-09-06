/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-25
 */

import React from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Keyboard,
    PermissionsAndroid,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,Linking,
    View,BackHandler
} from 'react-native';
import {connect} from 'react-redux';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen'
import base from "../../base";
import {TextField} from "react-native-material-textfield";
import OSButton from "../../components/osButton/OSButton";
import EmptyView from "../../components/common/EmptyView";
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import RadioForm, {RadioButton} from 'react-native-simple-radio-button';
import OyeSafeApi from "../../base/services/OyeSafeApi";
import AddAndEditCheckPointStyles from "./AddAndEditCheckPointStyles";
import Geolocation from 'react-native-geolocation-service';
var RNFS = require('react-native-fs');
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';



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
            cpArray:[],
            distance:0,
            isDataCorrect:true,
            latitude:0,
            longitude:0,
            isSet:false,
            lastLatLong:0,
            locationArrStored : []
            
        });

        
        this.getUserLocation = this.getUserLocation.bind(this)

    }

    


    setPointName(text) {
        this.setState({
            checkPointName: text
        })
    }

    componentDidMount() {
       
      }

    componentWillMount() {
        console.log("SCDMVD:",this.props.navigation.state.params);
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
            },()=>this.getAllCheckPoints())
        }
            
        console.log("Params:", params);

    };


    checkGPSStatus(params){
        if(Platform.OS === "android"){
            RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
            .then(data => {
                console.log("DATATATATATATATTATA:",data)
                    this.locationPermissionsAccess(params);  
            }).catch(err => {

            console.log("DATATATATATATATTATA err",err)
                this.showDenialAlertMessage();
  });
        }
      
    }



    locationPermissionsAccess(params){
        (async () => {
            { try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    
                )
    
    
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            this.getUserLocation(params)
    
                        },
                        (error) => {
                            Alert.alert(
                                'Location',
                                'We are not able to get your current location.',
                                [
                                    {text: 'Cancel', onPress: () => this.props.navigation.navigate('ResDashBoard'), style: 'cancel'},
                                    {text: 'Try Again', onPress: () => this.getUserLocation(params)},
                                ],
                                { cancelable: false }
                            )
                        },
                        { enableHighAccuracy:false, timeout: 5000, maximumAge: 1000, distanceFilter: 1 }
                    );
                } else {
                    console.log("Permission deny")
                    this.props.navigation.navigate("ResDashBoard")
    
                }
            } catch (err) {
                console.error("No Access  to location" + err);
            }
            }
        })();
    }



    componentDidMount(){
        this.watchuserPosition();

    }

    watchuserPosition(){
        let locationArrStored = [];
        this.watchId = Geolocation.watchPosition(
            (position) => {
              console.log("sdvdfgddhdgs",position);
              let LocationData = position.coords;
              locationArrStored.push(LocationData);
                this.setState({
                    region: {
                        latitude: LocationData.latitude,
                        longitude: LocationData.longitude,
                        longitudeDelta:LONGITUDE_DELTA,
                        latitudeDelta:LATITUDE_DELTA,
                    },
                    gpsLocation: parseFloat(LocationData.latitude).toFixed(5) + "," + parseFloat(LocationData.longitude).toFixed(5),
                    locationArrStored:locationArrStored
                  })   
            },
            (error) => {
              console.log(error);
            },
            { enableHighAccuracy: false, distanceFilter: 1, interval: 5000, fastestInterval: 2000,useSignificantChanges: true,timeout:1000 }
          );
    }
    

    componentWillUnmount(){
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
            )

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
                self.setState({
                    region: {
                        latitude: LocationData.latitude,
                        longitude: LocationData.longitude,
                        longitudeDelta:LONGITUDE_DELTA,
                        latitudeDelta:LATITUDE_DELTA,
                        
                    },
                    isEditing:params===null?false:true,
                    checkPointName:params!==null? params.cpCkPName:this.state.checkPointName,
                    gpsLocation: LocationData.latitude + "," + LocationData.longitude,
                    selectedIndex:params!==null? params.cpcPntAt === "StartPoint" ? 0 : params.cpcPntAt === "EndPoint" ? 1 : 2:this.state.selectedIndex,
                    checkPointId: params!==null?params.cpChkPntID:this.state.checkPointId,
                    selectedValue:params!==null? params.cpcPntAt === "StartPoint" ? 0 : params.cpcPntAt === "EndPoint" ? 1 : 2:this.state.selectedValue,
                },()=>this.getAllCheckPoints())
            });
        } catch (e) {
            console.log("Error:",e);
            self.showDenialAlertMessage(error)
                }
    }


    showDenialAlertMessage(error){
        if (Platform.OS === 'ios') {
            Alert.alert(
                'Location permission denied',
                'Please allow the location permission',
                [
                    {text: "Don't Allow",onPress:()=>this.props.navigation.navigate("ResDashBoard"), style: 'cancel'},
                    {text: 'Allow', onPress: () => this.navigateToSettings()}
                ]
            );
        }
        else {
            Alert.alert(
                'Location permission denied',
                'Please provide location permissions in application settings',
                [
                    {text: "Ok", onPress: () => this.navigateToSettings()}
                ]
            );
        }
    }



    navigateToSettings(){
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
        }
        else {
           this.props.navigation.navigate("ResDashBoard")
        }
    }

    async getAllCheckPoints(){
        let self = this;
        base.utils.logger.log(self.props);

        let stat = await OyeSafeApi.getCheckPointList(self.props.SelectedAssociationID);
        //let stat = await OyeSafeApi.getCheckPointList(8);

       
        
        try {
            if (stat.success) {
                console.log("Stat in ALl CP List:",stat.data.checkPointListByAssocID)
                let cpListLength = stat.data.checkPointListByAssocID.length;
                self.setState({
                    cpArray:stat.data.checkPointListByAssocID,
                    lastLatLong : stat.data.checkPointListByAssocID[cpListLength-1].cpgpsPnt
                })
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
                <Marker key={1024}
                        pinColor={base.theme.colors.green}
                        style={{alignItems: 'center', justifyContent: 'center'}}
                        coordinate={{latitude: lat, longitude: long}}>
                </Marker>
            </View>
        )
    }

    validateFields() {
        if (base.utils.validate.isBlank(this.state.checkPointName)) {
            alert("Please enter Check Point Name")
        }
        else{
            // if(this.state.lastLatLong !== 0){
            //     let storedArr = this.state.locationArrStored;
            // let latArr = [];
            // let longArr = [];
            // for(let i in storedArr){
            //     console.log("DMKLNKBVDKLDNKNDKNSKCDVNCDV>N:",storedArr[i])
            //     latArr.push(parseFloat(storedArr[i].latitude).toFixed(5));
            //     longArr.push(parseFloat(storedArr[i].longitude).toFixed(5))
            // }

            // let latMean = 0;
            // let longMean = 0;
            // let latSum = 0;
            // let longSum = 0;

            // for(let i in latArr){
            //     latSum += parseFloat(latArr[i]);
            //     latMean = parseFloat(latSum/latArr.length);
            // }

            // for(let i in longArr){
            //     longSum += parseFloat(longArr[i]);
            //     longMean = parseFloat(longSum/longArr.length)
            // }
            
            // let lastLatLongParsed = (this.state.lastLatLong).split(" ");
            // let lastLat = parseFloat(lastLatLongParsed[0]).toFixed(5);
            // let lastLong = parseFloat(lastLatLongParsed[1]).toFixed(5);
            // let latDiff = lastLat-latMean;
            // let longDiff = lastLong-longMean;

            // console.log('JSHDVBDKJVDJVHDVKDVKJDV:',latMean,longMean,lastLat,lastLong,latDiff,longDiff);

            // this.setState({
            //     region:{ 
            //         latitude:parseFloat(latMean).toFixed(6),
            //         longitude:parseFloat(longMean).toFixed(6)
            //     }
            // },()=>this.addCheckPoint())
            // }
            //else{
                 this.addCheckPoint();
            //}
           
        }
    }

    async addCheckPoint() {
        base.utils.logger.log(this.props);
        let self = this;

        let gpsLocation = parseFloat(this.state.region.latitude) + " " + parseFloat(this.state.region.longitude);

        let details = {};

        if (self.state.isEditing) {
            details = {
                "CPCkPName": self.state.checkPointName,
                "CPGPSPnt": gpsLocation,
                "CPCPntAt": self.state.checkPointType,
                "CPChkPntID": self.state.checkPointId
            };
        } else {
            details = {
                "CPCkPName": self.state.checkPointName,
                "CPGPSPnt": gpsLocation,
                "ASAssnID": self.props.SelectedAssociationID,
                "CPCPntAt": self.state.checkPointType
            };
        }

        let stat = self.state.isEditing ? await OyeSafeApi.editCheckPoint(details) : await OyeSafeApi.addCheckPoint(details);
        console.log("Stat:",stat,details)
        try {
            if (stat !== undefined && stat !== null) {
                if (stat.success) {
                    let message = self.state.isEditing?"Check Point has been edited successfully":"Check Point has added been successfully"
                    Alert.alert(
                        'Success',
                        message,
                        [
                            {
                                text: 'See Checkpoints',
                                onPress: () => this.props.navigation.navigate('patrollingCheckPoint', {isRefreshing: true})
                            },
                        ],
                        {cancelable: false},
                    );
                } else {
                    alert("Oops, Something went wrong\n Possible Reason:-" + stat.error.message);
                }
            }
        } catch (e) {
            base.utils.logger.log(e)
        }
    }

    setRadioButtonValue(val, index) {
        console.log("VAL & index:",val,index)
        this.setState({
            selectedValue: val,
            selectedIndex: index,
            checkPointType: index === 0 ? "StartPoint" : index === 1 ? "EndPoint" : "CheckPoint"
        });
    }


    render() {
        console.log("State",this.state);
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
                            scrollEnabled={false}
                        >
                            {this.renderUserLocation()}
                        </MapView>
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
                            <Text style={{fontFamily:base.theme.fonts.medium,fontSize:hp('2.5%')}}>{this.state.gpsLocation}</Text>
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
                        <OSButton onButtonClick={() => this.validateFields()}
                                  oSBText={this.state.isEditing ? "Edit" : "Add"} oSBType={"custom"}
                                  oSBBackground={this.state.isDataCorrect?base.theme.colors.primary:base.theme.colors.grey}
                                  height={30} borderRadius={10}/>
                    </View>
                </View>
            </ScrollView>
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