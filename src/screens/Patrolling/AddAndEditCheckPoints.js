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
    TouchableHighlight,
    View,
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
            lastLatLong:0
        });

        
        this.getUserLocation = this.getUserLocation.bind(this)

    }

    


    setPointName(text) {
        this.setState({
            checkPointName: text
        })
    }

    componentWillMount() {
        console.log("SCDMVD:",this.props.navigation.state.params);
        let params = this.props.navigation.state.params !== undefined ? this.props.navigation.state.params.data.item : null;
        if (params === null) {
            (Platform.OS === 'ios' ? this.getUserLocation() : this.requestLocationPermission())
        } else {
            let gpsLocationArr = params.cpgpsPnt.split(" ");
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

    componentDidMount(){
        this.watchuserPosition();
    }

    watchuserPosition(){
        this.watchId = Geolocation.watchPosition(
            (position) => {
              console.log("sdvdfgddhdgs",position);
              let LocationData = position.coords;
                this.setState({
                    region: {
                        latitude: LocationData.latitude,
                        longitude: LocationData.longitude,
                        longitudeDelta:LONGITUDE_DELTA,
                        latitudeDelta:LATITUDE_DELTA,
                    },
                    gpsLocation: LocationData.latitude + "," + LocationData.longitude,
                  })  
                
            },
            (error) => {
              console.log(error);
            },
            { enableHighAccuracy: true, distanceFilter: 0, interval: 5000, fastestInterval: 2000 }
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


    async getUserLocation() {
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
                    gpsLocation: LocationData.latitude + "," + LocationData.longitude
                },()=>this.getAllCheckPoints())
            });
        } catch (e) {
            console.log("Error:", e);
        }
    }

    async getAllCheckPoints(){
        let self = this;
        base.utils.logger.log(self.props);

        //let stat = await OyeSafeApi.getCheckPointList(self.props.SelectedAssociationID);
        let stat = await OyeSafeApi.getCheckPointList(8);

       
        
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
            this.addCheckPoint();
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
                //"ASAssnID": self.props.SelectedAssociationID,
                "ASAssnID": 8,
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