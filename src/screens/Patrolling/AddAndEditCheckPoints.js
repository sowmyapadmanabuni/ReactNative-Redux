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
    View
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
            checkPointId: ''
        });
        this.getUserLocation = this.getUserLocation.bind(this)

    }


    setPointName(text) {
        this.setState({
            checkPointName: text
        })
    }

    componentWillMount() {
        let params = this.props.navigation.state.params !== undefined ? this.props.navigation.state.params.data.item : null;
        console.log("Params Received:", params);
        if (params === null) {
            if (Platform.OS === 'ios' ? this.getUserLocation() : this.requestLocationPermission())
                this.getUserLocation();
        } else {
            let gpsLocationArr = params.cpgpsPnt.split(" ");
            console.log("GPS LOC:", gpsLocationArr);
            this.setState({
                isEditing: true,
                checkPointName: params.cpCkPName,
                gpsLocation: params.cpgpsPnt,
                region: {
                    latitude: gpsLocationArr[0],
                    longitude: gpsLocationArr[1]
                },
                selectedIndex: params.cpcPntAt === "StartPoint" ? 0 : params.cpcPntAt === "EndPoint" ? 1 : 0,
                checkPointId: params.cpChkPntID
            })
        }
        console.log("Params:", params);

    };

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
                        latitudeDelta:LATITUDE_DELTA
                    }
                })
            });
        } catch (e) {
            console.log("Error:", e);
        }
    }

    log(data, val) {
        console.log(data, val)
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

    onRegionChange(region) {
        let self = this;
        console.log("scdc", region);
        self.setState({
            region: {
                latitude: region.latitude,
                longitude: region.longitude,
                latitudeDelta: region.latitudeDelta,
                longitudeDelta: region.longitudeDelta,
            },
            gpsLocation: region.latitude.toFixed(4) + "," + region.longitude.toFixed(4),
            buttonVisibility: false
        });
    };

    getCurrentLocation() {
        console.log("Setting GPS");
        this.state.buttonVisibility ? this.getUserLocation() : null;
        this.setState({
            gpsLocation: this.state.region.latitude.toFixed(4) + "," + this.state.region.longitude.toFixed(4)
        })
    };

    validateFields() {
        if (base.utils.validate.isBlank(this.state.checkPointName)) {
            alert("Please enter Check Point Name")
        } else if (this.state.gpsLocation === "Set GPS Location") {
            alert("Please Select a location")
        } else {
            this.addCheckPoint()
        }
    }

    async addCheckPoint() {
        base.utils.logger.log(this.props);
        let self = this;

        let gpsLocation = this.state.region.latitude + " " + this.state.region.longitude;

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
                "MEMemID": self.props.userReducer.MyOYEMemberID,
                "ASAssnID": self.props.SelectedAssociationID,
                "CPCPntAt": self.state.checkPointType
            };
        }

        let stat = self.state.isEditing ? await OyeSafeApi.editCheckPoint(details) : await OyeSafeApi.addCheckPoint(details);
        console.log("Stat:", stat);
        try {
            if (stat !== undefined && stat !== null) {
                if (stat.success) {
                    Alert.alert(
                        'Success',
                        'Check Point has been added successfully',
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
        console.log(val, index);
        this.setState({
            selectedValue: val,
            selectedIndex: index,
            checkPointType: index === 0 ? "StartPoint" : index === 1 ? "EndPoint" : "CheckPoint"
        });
    }


    render() {
        base.utils.logger.log(this.state);
        let headerText = this.state.isEditing ? "Edit Check Point" : "Add Check Point";
        return (
            <ScrollView onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{headerText}</Text>
                    </View>
                    <View style={styles.mapBox}>
                        <MapView
                            ref={map => {
                                this.map = map
                            }}
                            provider={PROVIDER_GOOGLE}
                            style={styles.map}
                            region={this.state.region}
                            showsUserLocation={true}
                            showsBuildings={true}
                            followsUserLocation={true}
                            zoomEnabled={true}
                            minZoomLevel={19}
                            onRegionChange={(region) => this.onRegionChange(region)}
                        >
                            {this.renderUserLocation()}
                        </MapView>
                    </View>

                    <View style={styles.textView}>
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
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={styles.gpsView}>
                            <Image
                                resizeMode={'cover'}
                                style={styles.gpsIcon}
                                source={require('../../../icons/location.png')}
                            />
                            <Text>{this.state.gpsLocation}</Text>
                        </View>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.getCurrentLocation()} style={{
                            borderWidth: 1,
                            height: "35%",
                            width: "35%",
                            borderRadius: 12,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderColor: this.state.buttonVisibility ? base.theme.colors.primary : base.theme.colors.grey
                        }}>
                            <Text
                                style={{color: this.state.buttonVisibility ? base.theme.colors.primary : base.theme.colors.grey}}>Set
                                GPS</Text>
                        </TouchableHighlight>
                    </View>
                    <EmptyView height={35}/>
                    <View style={styles.radioView}>
                        <RadioForm
                            formHorizontal={true}
                            animation={true}
                        >
                            {this.state.types2.map((obj, i) => {
                                let is_selected = this.state.selectedIndex === i;
                                return (
                                    <View key={i} style={styles.radioButtonWrap}>
                                        <RadioButton
                                            isSelected={is_selected}
                                            obj={obj}
                                            index={i}
                                            buttonSize={10}
                                            labelHorizontal={true}
                                            buttonColor={base.theme.colors.primary}
                                            labelColor={base.theme.colors.black}
                                            style={[i !== this.state.types2.length - 1 && styles.radioStyle]}
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
                    <View style={styles.buttonView}>
                        <OSButton onButtonClick={() => this.props.navigation.goBack(null)} oSBText={"Cancel"}
                                  oSBType={"custom"}
                                  oSBBackground={base.theme.colors.red}
                                  height={30} borderRadius={10}/>
                        <OSButton onButtonClick={() => this.validateFields()}
                                  oSBText={this.state.isEditing ? "Edit" : "Add"} oSBType={"custom"}
                                  oSBBackground={base.theme.colors.primary}
                                  height={30} borderRadius={10}/>
                    </View>
                </View>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        height: hp("100%"),
        backgroundColor: base.theme.colors.white,
        paddingBottom: Platform.OS === 'ios' ? hp('80%') : hp('70%')
    },
    header: {
        alignItems: 'center',
        justifyContent: "center",
        height: hp('10%')
    },
    headerText: {
        fontSize: 15,
        fontFamily: base.theme.fonts.medium,
        color: base.theme.colors.primary
    },
    mapBox: {
        height: hp('50%'),
        width: "90%",
        borderWidth: 1,
        alignSelf: 'center'
    },
    textView: {
        marginTop: 40,
        width: '90%',
        alignSelf: 'center',
        //height:'20%'
    },
    gpsView: {
        marginTop: 20,
        width: '50%',
        marginLeft: "5%",
        borderBottomWidth: 0.6,
        flexDirection: 'row',
        alignItems: 'center'
    },
    gpsIcon: {
        height: 30,
        width: 30
    },
    gpsButtonView: {
        borderWidth: 1,
        height: "35%",
        width: "35%",
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',

    },
    gpsButton: {
        color: base.theme.colors.primary
    },
    buttonView: {
        borderWidth: 0,
        width: "100%",
        height: hp('10%'),
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row'
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    radioView: {
        height: "20%",
        width: "90%",
        alignSelf: 'center'
    },
    radioButtonWrap: {
        marginRight: 5
    },
    radioStyle: {
        paddingRight: 10
    },

});

const mapStateToProps = state => {
    return {
        oyeURL: state.OyespaceReducer.oyeURL,
        champBaseURL: state.OyespaceReducer.champBaseURL,
        oye247BaseURL: state.OyespaceReducer.oye247BaseURL,
        oyeBaseURL: state.OyespaceReducer.oyeBaseURL,
        userReducer: state.UserReducer,
        SelectedAssociationID: state.UserReducer.SelectedAssociationID
    }
};

export default connect(mapStateToProps)(AddAndEditCheckPoints)