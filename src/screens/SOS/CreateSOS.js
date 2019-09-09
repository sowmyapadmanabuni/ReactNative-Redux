/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-07-18
 */

import React from 'react';
import {Dimensions, Image, Linking, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import firebase from 'firebase';
import CreateSOSStyles from "./CreateSOSStyles";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import PatrollingCheckPointsStyles from "../Patrolling/PatrollingCheckPointsStyles";
import base from "../../base";
import EmptyView from "../../components/common/EmptyView";
import {connect} from "react-redux";
import ImagePicker from 'react-native-image-picker';

const {height, width} = Dimensions.get('screen');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


class CreateSOS extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            region: {
                latitude: '',
                longitude: '',
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            image: null,
            imageURI: null,
            isGuardDetailAvailable: false,
            deviceName:"",
            mobileNumber:""
        };

        this.getCurrentLocation = this.getCurrentLocation.bind(this);
        this.createSOS = this.createSOS.bind(this);

    }

    componentWillMount() {
        this.getCurrentLocation();
    }

    async getCurrentLocation() {
        console.log("User Reducer Data:", this.props)
        let self = this;
        try {
            await navigator.geolocation.getCurrentPosition((data) => {
                let LocationData = (data.coords);
                console.log("Location data:",LocationData);
                self.setState({
                    region: {
                        latitude: LocationData.latitude,
                        longitude: LocationData.longitude,
                        longitudeDelta: LONGITUDE_DELTA,
                        latitudeDelta: LATITUDE_DELTA
                    }
                }, () => self.createSOS())
            });
        } catch (e) {
            console.log("Error:", e);
        }
    }

    componentDidMount() {
        this.readUserData();
    }


    async createSOS() {
        let data = this.props;
        //let associationID = data.associationID;
        let associationID = 8;
        let userId = data.userReducer.MyAccountID;
        let userName = data.userReducer.MyFirstName;
        let userMobile = (data.userReducer.MyMobileNumber).toString();
        let unitId = data.dashBoardReducer.uniID;
        let sosImage = this.state.image === null ? "N/A" : this.state.image;
        let latitude = this.state.region.latitude;
        let longitude = this.state.region.longitude;
        let unitName = data.dashBoardReducer.selectedDropdown1;
        let isActive = true;

        console.log(data)

        console.log("Data:",associationID,userId,userMobile,userName,unitId,sosImage,latitude,longitude,unitName);

        if(this.state.image === null){
            firebase.database().ref('SOS/' + associationID + "/" + userId + "/").set({
                isActive,latitude,longitude,sosImage,unitId,userId,userMobile,userName,unitName
             }).then((data) => {
                 console.log("Data:", data)
             }).catch((error) => {
                 console.log("Error:", error)
             }) 
        }
        else{
            const data = new FormData();
            let imgObj = {
                name: (this.state.image.fileName !== undefined) ? this.state.image.fileName : "XXXXX.jpg",
                uri: this.state.imageURI,
                type: (this.state.image.type !== undefined || this.state.image.type != null) ? this.state.image.type : "image/jpeg"
            };

            data.append('oyespace', imgObj);
            console.log("Form Data:", data);
            statForMediaUpload = await base.services.MediaUploadApi.uploadRelativeImage(data);
            console.log("Stat in Media Upload:", "http://mediaupload.oyespace.com/oyeliving/api/V1/",statForMediaUpload);
            let sosImage = "http://mediaupload.oyespace.com/"+statForMediaUpload
            firebase.database().ref('SOS/' + associationID + "/" + userId + "/").update({
                sosImage
            });
        }
        
    }

    readUserData() {
        let self = this;
        //let associationID = self.props.associationID;
        let associationID = 8;
        let userId = self.props.userReducer.MyAccountID;
        firebase.database().ref('SOS/' + associationID + "/" + userId + "/").on('value', function (snapshot) {
            let receivedData = snapshot.val();
            console.log("Receiveddata", snapshot.val());
            if (receivedData !== null) {
                if ((receivedData.attendedBy !== undefined && receivedData.attendedBy !== null) ) {
                    self.setState({
                        isGuardDetailAvailable: true,
                        deviceName:receivedData.attendedBy,
                        mobileNumber:receivedData.attendedByMobile
                    })
                } else {
                    self.setState({
                        isGuardDetailAvailable: false
                    })
                }
            }
        });
    }

    openCamera() {
        const options = {
            title: 'Take Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            // Same code as in above section!
            console.log("Response:", response);
            this.setState({
                image: response,
                imageURI: response.uri
            }, () => this.createSOS())

        });
    }


    render() {
        let imageURI = this.state.imageURI === null ? require('../../../icons/camera.png') : {uri: this.state.imageURI};
        console.log("Guard Detail:",this.state.isGuardDetailAvailable   )
        return (
            <View style={CreateSOSStyles.container}>
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
                    <EmptyView width={50}/>
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
                                            source={require("../../../icons/call1.png")}
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
                                            source={require("../../../icons/call1.png")}
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
                                            source={require("../../../icons/call1.png")}
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

            </View>
        )
    }

    makePhoneCall(number) {
        Linking.openURL(`tel:${number}`)
    }

  async stopSOS() {
        //let associationID = self.props.associationID;
        let associationID = 8;
        let userId = this.props.userReducer.MyAccountID;
        console.log("kscjd:",associationID,userId)
        await firebase.database().ref('SOS/' + associationID + "/" + userId + "/").remove();
        this.setState({
            isGuardDetailAvailable:false
        })
        alert('SOS Alert Closed !!!');
        this.props.navigation.goBack();
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
