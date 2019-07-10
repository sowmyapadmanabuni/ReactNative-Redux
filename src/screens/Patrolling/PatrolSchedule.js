/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */

import React from 'react';
import {Dimensions, FlatList, Image, StyleSheet, Switch, Text, TouchableHighlight, View,} from 'react-native';
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

    }

    componentWillMount() {
        this.getPatrollingList();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.navigation.state.params.refresh) {
            this.getPatrollingList()
        }
    }

    async getPatrollingList() {
        let self = this;

        let stat = await base.services.OyeSafeApi.getPatrollingShiftListByAssociationID(this.props.SelectedAssociationID);
        console.log("Stat in schedule patrolling", stat);
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
        console.log("State:", this.state);
        return (
            <Container style={styles.container}>
                <Subtitle style={styles.subtitle}>Patrolling Schedule</Subtitle>
                <View style={styles.childView}>
                    {this.state.patrollingCheckPoint.length > 0 ?
                        <FlatList
                            keyExtractor={(item, index) => index.toString()}
                            data={this.state.patrollingCheckPoint}
                            renderItem={(item, index) => this._renderPatrollingCheckPoints(item, index)}
                            extraData={this.state}
                        /> :
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text>No Patrolling Slots Available</Text>
                        </View>}
                </View>
                {this.openMapModal()}
                <FloatingButton onBtnClick={() => this.props.navigation.navigate('patrollingCheckPoint')}/>
            </Container>
        )
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

        this.setState({
            isModalOpen: !this.state.isModalOpen,
            cpData: data,
            splitCoords: coordsObjArr
        })
    }

    changeSnooze(data) {
        let patrolArray = this.state.patrollingCheckPoint;
        console.log(data);

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
            PSSnooze: !data.psSnooze,
            PSPtrlSID: data.psPtrlSID
        };
        let stat = await base.services.OyeSafeApi.updateSnooze(detail);

    }

    _renderPatrollingCheckPoints(item, index) {
        let data = item.item;
        return (
            <View style={styles.flatListView}>
                <TouchableHighlight onPress={() => this.mapModal(data)}
                                    underlayColor={base.theme.colors.transparent}
                                    style={{justifyContent: 'center'}}>
                    <View>
                        <Image
                            style={styles.mapImage}
                            source={require('../../../icons/map1.png')}
                        />
                        <Image
                            resizeMode={'center'}
                            style={styles.mapImage1}
                            source={require('../../../icons/zoom.png')}
                        />
                    </View>
                </TouchableHighlight>
                <View style={styles.centerView}>
                    <View style={styles.centerTextView}>
                        <Text style={styles.centerTextStyle}>{data.psSltName}</Text>
                    </View>
                    <View style={styles.locationView}>
                        <View style={{flexDirection: 'column'}}>
                            <View style={{flexDirection: 'row', marginTop: hp('1%')}}>
                                <Image
                                    style={styles.locationImageStyle}
                                    source={require('../../../icons/entry_time.png')}
                                />
                                <Text numberOfLines={1}
                                      style={styles.locationText}>Start : {moment(data.pseTime).format('hh:mm A')} Stop
                                    : {moment(data.pssTime).format('hh:mm A')}</Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: hp('1%')}}>
                                <Image
                                    style={styles.locationImageStyle}
                                    source={require('../../../icons/device.png')}
                                />
                                <Text numberOfLines={1}
                                      style={styles.locationText}>{data.deName}</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                marginTop: hp('1%'),
                                justifyContent: 'flex-start'
                            }}>
                                <Text numberOfLines={1}
                                      style={{
                                          fontFamily: base.theme.fonts.medium,
                                          color: base.theme.colors.black,
                                          fontSize: hp('2%'),
                                          marginLeft: wp('1%')
                                      }}>Alarm: </Text>
                                <MarqueeText
                                    duration={3000}
                                    marqueeOnStart
                                    loop
                                    marqueeDelay={1000}
                                    marqueeResetDelay={1000}
                                    numberOfLines={1}
                                    style={{
                                        width: wp('45%'),
                                        fontFamily: base.theme.fonts.light,
                                        color: base.theme.colors.black,
                                        fontSize: hp('2%'),
                                    }}>{data.psRepDays}</MarqueeText>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.rightView}>
                    <ElevatedView elevation={0}>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.editPatrol(data)}>
                            <Image style={styles.rightImageStyle}
                                   source={require('../../../icons/edit.png')}/>
                        </TouchableHighlight>
                    </ElevatedView>
                    <EmptyView height={10}/>
                    <ElevatedView elevation={0}>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.deletePatrolSlot(data)}>
                            <Image style={styles.rightImageStyle}
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
        this.props.navigation.navigate('patrollingCheckPoint', {data: data})
    }

    async deletePatrolSlot(data) {
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
            title: "Check Point QR",
            message: "Share Check Point QR",
            url: this.state.previewSource.uri
        };
        console.log("base 64:", shareImageBase64);
        Share.open(shareImageBase64).then((response) => {
            console.log(response)
        });
    }

    openMapModal() {
        let data = this.state.cpData;
        return (
            <Modal isVisible={this.state.isModalOpen}
                   style={{
                       flex: 1,
                       backgroundColor: base.theme.colors.transparent,
                       alignSelf: 'center',
                       width: wp('90%'),
                   }}>
                <TouchableHighlight ref='View'>
                    <View
                        style={{
                            height: hp("65%"),
                            justifyContent: 'flex-start',
                            backgroundColor: base.theme.colors.white,
                        }}>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            style={{
                                height: hp('7%'),
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                                alignSelf: 'flex-end',
                                width: wp('20%'),
                            }}
                            onPress={() => this.setState({isModalOpen: false})}>
                            <Text style={{
                                alignSelf: 'center',
                                color: base.theme.colors.primary,
                                fontFamily: base.theme.fonts.medium
                            }}>Close</Text>
                        </TouchableHighlight>
                        <View style={{borderWidth: 0, height: hp('12%'), width: wp('85%'), alignSelf: 'center'}}>
                            <Text>{data.psSltName}</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text
                                    style={{borderWidth: 0}}>Start: {moment(data.pseTime).format('hh:mm A')} Stop: {moment(data.pssTime).format('hh:mm A')}</Text>
                                <TouchableHighlight
                                    style={{width: wp('30%'), alignItems: 'flex-end'}}
                                    underlayColor={base.theme.colors.transparent}
                                    onPress={this.snapshot("View")}>
                                    <Image
                                        resizeMode={'cover'}
                                        style={{height: hp('3%'), width: hp('3%')}}
                                        source={require('../../../icons/share.png')}/>
                                </TouchableHighlight>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text numberOfLines={1}>Device: {data.deName} Alarm: </Text>
                                <MarqueeText
                                    style={{
                                        fontSize: 12,
                                        textAlign: "center",
                                        alignSelf: 'center',
                                        top: 1,
                                        width: wp('50%')
                                    }}
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
        console.log("LLLLL:", item, index);

        return (
            <Marker key={index}
                    coordinate={{latitude: item.latitude, longitude: item.longitude}}
                    pinColor={base.theme.colors.transparent}
            >
                <View style={{
                    height: hp('2%'),
                    width: hp('2%'),
                    borderRadius: hp('1%'),
                    backgroundColor: base.theme.colors.green
                }}/>
            </Marker>
        )
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    subtitle: {
        color: 'orange', fontSize: 20
    },
    childView: {
        justifyContent: 'center',
        width: "98%",
        alignSelf: 'center',
        height: hp('85%')
    },
    flatListView: {
        height: hp('19%'),
        width: "98%",
        borderBottomWidth: 1,
        alignSelf: 'center',
        flexDirection: 'row'
    },
    mapImage: {
        height: "80%",
        width: wp("20%")
    },
    mapImage1: {
        height: hp('20%'),
        width: wp("15%"),
        position: "absolute",
        alignSelf: 'flex-end'
    },
    centerView: {
        height: '70%',
        width: wp("50%"),
        alignSelf: 'center',
        marginLeft: wp('1%')
    },
    centerTextView: {
        height: hp('5%'),
        justifyContent: 'center'
    },
    centerTextStyle: {
        fontFamily: base.theme.fonts.bold,
        fontSize: 15
    },
    locationView: {
        flexDirection: 'row',
        height: hp('8%'),
        width: wp('50%'),
        alignItems: 'center',
    },
    locationImageStyle: {
        height: hp('3%'),
        width: hp('3%')
    },
    locationText: {
        width: wp('55%'),
        fontFamily: base.theme.fonts.light,
        color: base.theme.colors.black,
        fontSize: hp('2%'),
        marginLeft: wp('1%')
    },
    rightView: {
        height: "85%",
        width: wp('20%'),
        alignSelf: 'center',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    rightImageStyle: {
        height: hp('4%'),
        width: hp('4%')
    },
});


const mapStateToProps = state => {
    console.log(state)
    return {
        oyeURL: state.OyespaceReducer.oyeURL,
        champBaseURL: state.OyespaceReducer.champBaseURL,
        oye247BaseURL: state.OyespaceReducer.oye247BaseURL,
        oyeBaseURL: state.OyespaceReducer.oyeBaseURL,
        userReducer: state.UserReducer,
        SelectedAssociationID: state.UserReducer.SelectedAssociationID
    }
};


export default connect(mapStateToProps)(PatrolSchedule);