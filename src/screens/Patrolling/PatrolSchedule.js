/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */

import React from 'react';
import {Dimensions, FlatList, Image, Alert, Switch, Text, TouchableHighlight, View,AsyncStorage,Platform,PermissionsAndroid} from 'react-native';
import {Container, Subtitle} from 'native-base';
import {connect} from 'react-redux';
import base from '../../base';
import FloatingButton from "../../components/FloatingButton";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import moment from 'moment';
import Modal from "react-native-modal";
import ElevatedView from "react-native-elevated-view";
import EmptyView from "../../components/common/EmptyView";
import MarqueeText from "react-native-marquee";
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from "react-native-maps";
import {captureRef, captureScreen} from "react-native-view-shot";
import Share from "react-native-share";
import PatrollingScheduleStyles from "./PatrollingScheduleStyles";

const catsSource = {
    uri: "https://i.imgur.com/5EOyTDQ.jpg"
};

const {height, width} = Dimensions.get('screen');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class PatrolSchedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            patrollingCheckPoint: [],
            isModalOpen: false,
            isSnoozeEnabled: false,
            isDataVisible: false,
            cpData: {},
            region: {
                latitude: 12.834938,
                longitude: 77.694891,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            },
            splitCoords: [],
            value: {
                format: "png",
                quality: 0.9,
                result: "data-uri",
                snapshotContentContainer: false
            },
            previewSource: catsSource,
            error: null,
            res: null,
            isCapturing: false
        };

        this.getPatrollingList = this.getPatrollingList.bind(this);
        this.getUserLocation = this.getUserLocation.bind(this)

    }

    componentWillMount() {
        if (Platform.OS === 'ios' ? this.getUserLocation() : this.requestLocationPermission())
        this.getPatrollingList();
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
                        gpsLocation: LocationData.latitude.toFixed(4) + "," + LocationData.longitude.toFixed(4)
                    }
                })
            });
        } catch (e) {
            console.log("Error:", e);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.navigation.state.params.refresh) {
            this.getPatrollingList()
        }
    }

    async getPatrollingList() {
        let self = this;

        let stat = await base.services.OyeSafeApi.getPatrollingShiftListByAssociationID(this.props.SelectedAssociationID);
        //let stat = await base.services.OyeSafeApi.getPatrollingShiftListByAssociationID(8);
        console.log("Stat:",stat,);
        try {
            if (stat.success) {
                self.setState({
                    patrollingCheckPoint: stat.data.patrollingShifts,
                    isDataVisible: true
                })
            }
        } catch (e) {
            console.log(e)
        }


    }


    render() {
        console.log("State:",this.state)
        return (
            <Container style={PatrollingScheduleStyles.container}>
                <Subtitle style={PatrollingScheduleStyles.subtitle}>Patrolling Schedule</Subtitle>
                <View style={PatrollingScheduleStyles.childView}>
                    {this.state.patrollingCheckPoint.length > 0 ?
                        <FlatList
                            keyExtractor={(item, index) => index.toString()}
                            data={this.state.patrollingCheckPoint}
                            renderItem={(item, index) => this._renderPatrollingCheckPoints(item, index)}
                            extraData={this.state}
                        /> :
                        <View style={PatrollingScheduleStyles.noSlotTextView}>
                            <Text>No Patrolling Slots Available</Text>
                        </View>}
                </View>
                {this.openMapModal()}
                <FloatingButton onBtnClick={() =>this.changePage()}/>
            </Container>
        )
    }

    changePage(){
        AsyncStorage.removeItem(base.utils.strings.patrolId);
        this.props.navigation.navigate('patrollingCheckPoint')
    }

    mapModal(data) {
        let coords = data.cpgpsPnts;
        let coordsArr = coords.split(';');
        let coordSplit = [];
        for (let i in coordsArr) {
            if (coordsArr[i] !== "") {
                coordSplit.push(coordsArr[i].split(' '));
            }
        }
        let coordsObj = {};
        let coordsObjArr = [];
        for (let i in coordSplit) {

            coordsObj = {
                latitude: parseFloat(coordSplit[i][0]),
                longitude: parseFloat(coordSplit[i][1])
            };
            coordsObjArr.push(coordsObj)
        }

        console.log("SBDVDVBK:",coordsObjArr)

        this.setState({
            isModalOpen: !this.state.isModalOpen,
            cpData: data,
            splitCoords: coordsObjArr,
            region: {
                latitude: coordsObjArr[0].latitude,
                longitude: coordsObjArr[0].longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            },
        })
    }

    changeSnooze(data) {
        let patrolArray = this.state.patrollingCheckPoint;

        for (let i in patrolArray) {
            if (patrolArray[i].psPtrlSID === data.psPtrlSID) {
                patrolArray[i].psSnooze = !patrolArray[i].psSnooze
            }
        }

        this.setState({
            patrollingCheckPoint: patrolArray
        }, () => this.updateSnooze(data))
    }

    async updateSnooze(data) {
        let detail = {
            PSSnooze: data.psSnooze,
            PSPtrlSID: data.psPtrlSID
        };

        let stat = await base.services.OyeSafeApi.updateSnooze(detail);

    }

    _renderPatrollingCheckPoints(item, index) {
        let data = item.item;
        return (
            <View style={PatrollingScheduleStyles.flatListView}>
                <TouchableHighlight onPress={() => this.mapModal(data)}
                                    underlayColor={base.theme.colors.transparent}
                                    style={{justifyContent: 'center'}}>
                    <View>
                        <Image
                            style={PatrollingScheduleStyles.mapImage}
                            source={require('../../../icons/map1.png')}
                        />
                        <Image
                            resizeMode={'center'}
                            style={PatrollingScheduleStyles.mapImage1}
                            source={require('../../../icons/zoom.png')}
                        />
                    </View>
                </TouchableHighlight>
                <View style={PatrollingScheduleStyles.centerView}>
                    <View style={PatrollingScheduleStyles.centerTextView}>
                        <Text style={PatrollingScheduleStyles.centerTextStyle}>{data.psSltName}</Text>
                    </View>
                    <View style={PatrollingScheduleStyles.locationView}>
                        <View style={{flexDirection: 'column'}}>
                            <View style={{flexDirection: 'row', marginTop: hp('1%')}}>
                                <Image
                                    style={PatrollingScheduleStyles.locationImageStyle}
                                    source={require('../../../icons/entry_time.png')}
                                />
                                <Text numberOfLines={1}
                                      style={PatrollingScheduleStyles.locationText}>Start : {moment(data.pssTime).format('hh:mm A')} Stop
                                    : {moment(data.pseTime).format('hh:mm A')}</Text>
                            </View>
                            <View style={PatrollingScheduleStyles.deviceView}>
                                <Image
                                    style={PatrollingScheduleStyles.locationImageStyle}
                                    source={require('../../../icons/device.png')}
                                />
                                <Text numberOfLines={1}
                                      style={PatrollingScheduleStyles.locationText}>{data.deName}</Text>
                            </View>
                            <View style={PatrollingScheduleStyles.alarmView}>
                                <Text numberOfLines={1}
                                      style={PatrollingScheduleStyles.alarmText}>Alarm: </Text>
                                <MarqueeText
                                    duration={3000}
                                    marqueeOnStart
                                    loop
                                    marqueeDelay={1000}
                                    marqueeResetDelay={1000}
                                    numberOfLines={1}
                                    style={PatrollingScheduleStyles.marqueeText}>{data.psRepDays}</MarqueeText>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={PatrollingScheduleStyles.rightView}>
                    <ElevatedView elevation={0}>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.editPatrol(data)}>
                            <Image style={PatrollingScheduleStyles.rightImageStyle}
                                   source={require('../../../icons/edit.png')}/>
                        </TouchableHighlight>
                    </ElevatedView>
                    <EmptyView height={10}/>
                    <ElevatedView elevation={0}>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.deletePatrolSlot(data)}>
                            <Image style={PatrollingScheduleStyles.rightImageStyle}
                                   source={require('../../../icons/delete.png')}/>
                        </TouchableHighlight>
                    </ElevatedView>
                    <EmptyView height={10}/>
                    <ElevatedView elevation={0}>
                        <Switch
                            style={{width: wp('10%')}}
                            onValueChange={() => this.changeSnooze(data)}
                            value={data.psSnooze}/>
                    </ElevatedView>
                </View>
            </View>
        )
    }

    editPatrol(data) {

        let key = base.utils.strings.patrolId;
        Platform.OS === 'ios'?AsyncStorage.setItem(key,data.psPtrlSID):AsyncStorage.setItem(key,(data.psPtrlSID).toString());
        this.props.navigation.navigate('patrollingCheckPoint', {data: data})
    }

    deletePatrolSlot(data){

        Alert.alert(
            'Attention',
            'Are you sure you want to delete this Patrol ?',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Deletion Cancelled'),
                style: 'cancel',
              },
              {text: 'Yes', onPress: () => this.deletePatrolSlot1(data)},
            ],
            {cancelable: false},
          );
    }

    async deletePatrolSlot1(data) {

        
        let self = this;
        let detail = {
            PSPtrlSID: data.psPtrlSID
        };

        let stat = await base.services.OyeSafeApi.deletePatrolSlot(detail);
        try {
            if (stat) {
                if (stat.success) {
                    self.getPatrollingList()
                }
            }
        } catch (e) {
            base.utils.logger.log(e)
        }

    }


    snapshot = refname => () =>
        (refname
                ? captureRef(this.refs[refname], this.state.value)
                : captureScreen(this.state.value)
        )
            .then(
                res =>
                    new Promise((success, failure) =>
                        Image.getSize(res, (width, height) => (
                            console.log(res, width, height), success(res)
                        ), failure))).then(res => this.setState({
                error: null, res, previewSource: {
                    uri: this.state.value.result === "base64" ? "data:image/" + this.state.value.format + ";base64," + res : res
                }
            }, () => this.share())
        )
            .catch(
                error => (
                    console.warn(error),
                        this.setState({error, res: null, previewSource: null})
                )
            );

    share() {
        let shareImageBase64 = {
            title: "Patrol Route",
            message: "Patrol Route",
            url: this.state.previewSource.uri
        };
        Share.open(shareImageBase64).then((response) => {
            console.log(response)
        });
    }


    openMapModal() {
        let data = this.state.cpData;
        return (
            <Modal isVisible={this.state.isModalOpen}
                   style={PatrollingScheduleStyles.mapModal}>
                <TouchableHighlight ref='View'>
                    <View
                        style={PatrollingScheduleStyles.mapModalView}>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            style={PatrollingScheduleStyles.mapTouchableView}
                            onPress={() => this.setState({isModalOpen: false})}>
                            <Text style={PatrollingScheduleStyles.closeText}>Close</Text>
                        </TouchableHighlight>
                        <View style={PatrollingScheduleStyles.slotView}>
                            <Text>{data.psSltName}</Text>
                            <View style={PatrollingScheduleStyles.shareView}>
                                <Text
                                    style={{borderWidth: 0}}>Start: {moment(data.pseTime).format('hh:mm A')} Stop: {moment(data.pssTime).format('hh:mm A')}</Text>
                                <TouchableHighlight
                                    style={PatrollingScheduleStyles.shareImageView}
                                    underlayColor={base.theme.colors.transparent}
                                    onPress={this.snapshot("View")}>
                                    <Image
                                        resizeMode={'cover'}
                                        style={PatrollingScheduleStyles.shareIcon}
                                        source={require('../../../icons/share.png')}/>
                                </TouchableHighlight>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text numberOfLines={1}>Device: {data.deName} Alarm: </Text>
                                <MarqueeText
                                    style={PatrollingScheduleStyles.marqView}
                                    duration={3000}
                                    marqueeOnStart
                                    loop
                                    marqueeDelay={1000}
                                    marqueeResetDelay={1000}
                                >{data.psRepDays}
                                </MarqueeText>
                            </View>
                        </View>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            initialRegion={this.state.region}
                            scrollEnabled={true}
                            minZoomLevel={19}
                            style={{flex: 1}}>
                          <Polyline
                                strokeColor={base.theme.colors.primary}
                                coordinates={this.state.splitCoords}
                                strokeWidth={4}
                                lineDashPhase={5}
                            />
                            {this.state.splitCoords.map((item, index) => this.renderMarker(item, index))}
                        </MapView>
                    </View>
                </TouchableHighlight>
            </Modal>
        )
    }

    renderMarker(item, index) {
        console.log("Item:", item.latitude,index);
        return (
            <Marker key={index}
                    coordinate={{latitude: item.latitude, longitude: item.longitude}}
                    pinColor={base.theme.colors.transparent}
            >
                <View style={PatrollingScheduleStyles.markerView}/>
            </Marker>
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


export default connect(mapStateToProps)(PatrolSchedule);