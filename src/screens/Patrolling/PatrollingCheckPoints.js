/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-25
 */

import React from 'react';
import {Dimensions, FlatList, Image, StyleSheet, Text, TouchableHighlight, View,Platform} from 'react-native';
import {connect} from 'react-redux';
import base from "../../base";
import FloatingActionButton from "../../components/FloatingButton";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import OyeSafeApi from "../../base/services/OyeSafeApi";
import CheckBox from 'react-native-check-box';
import ElevatedView from 'react-native-elevated-view';
import EmptyView from "../../components/common/EmptyView";
import {updateSelectedCheckPoints} from '../../../src/actions';
import Modal from "react-native-modal";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";

const {height, width} = Dimensions.get('screen');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


class PatrollingCheckPoints extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkPointArray: [],
            isChecked: false,
            isModalOpen: false,
            region: {
                latitude: '',
                longitude: '',
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
        };
        this.getCheckPoints = this.getCheckPoints.bind(this);
        console.log("Props:", props);
    };

    componentWillMount() {
        this.getCheckPoints();
        this.updateStore();

    }

    componentWillReceiveProps(nextProps) {
        console.log("Next props:", nextProps);
        if (nextProps.navigation.state.params !== undefined) {
            if (nextProps.navigation.state.params.isRefreshing === true) {
                this.getCheckPoints();
            }

        }
    }

    async getCheckPoints() {
        let self = this;
        base.utils.logger.log(self.props);

        let stat = await OyeSafeApi.getCheckPointList(self.props.SelectedAssociationID);
        base.utils.logger.logArgs("Stat:", stat);
        try {
            if (stat && stat !== undefined) {
                let cpList = stat.data.checkPointListByAssocID
                self.updateCheckList(cpList)
            }
        } catch (e) {
            base.utils.logger.log(e);
        }

    }

    updateCheckList(cpList) {
        let cpListArr = [];
        if (this.props.navigation.state.params !== undefined) {
            if (this.props.navigation.state.params.isRefreshing) {
                cpListArr = cpList
            } else {
                let cpListIDs = this.props.navigation.state.params.data.psChkPIDs;
                let cpListIDArr = cpListIDs.split(",");
                console.log(cpList, cpListIDArr);
                for (let i in cpList) {
                    for (let j in cpListIDArr) {
                        if (cpList[i].cpChkPntID.toString() === cpListIDArr[j]) {
                            cpList[i].isChecked = true
                        }
                    }
                }
                cpListArr = cpList;
            }
        } else {
            cpListArr = cpList
        }

        this.setState({
            checkPointArray: cpListArr
        })

        if (this.props.navigation.state.params !== undefined) {
            this.updateStore();
        }

    }

    componentWillUnmount() {
        updateSelectedCheckPoints({value: null});
    }

    render() {
        console.log("State:", this.state)
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text
                        style={styles.headerText}>{this.state.checkPointArray.length > 0 ? "Select Patrolling Check Points" : ""}</Text>
                </View>
                <View style={styles.flatListView}>
                    {this.state.checkPointArray.length > 0 ?
                        <FlatList
                            keyExtractor={(item, index) => index.toString()}
                            data={this.state.checkPointArray}
                            renderItem={(item, index) => this._renderCheckPoints(item, index)}
                            extraData={this.state}/> :
                        <View style={{justifyContent: 'center'}}>
                            <Text>No Check Points available</Text>
                        </View>}
                </View>
                <FloatingActionButton onBtnClick={() => this.props.navigation.navigate('addCheckPoint')}/>
            </View>
        )
    }

    editCheckPoint(data) {
        this.props.navigation.navigate("addCheckPoint", {data: data})
    }


    updateStore() {
        let cpList = this.state.checkPointArray;
        const {updateSelectedCheckPoints} = this.props;
        let selectedCPArr = [];
        for (let i in cpList) {
            if (cpList[i].isChecked) {
                selectedCPArr.push(cpList[i]);
            }
        }
        updateSelectedCheckPoints({value: selectedCPArr});
    }

    openMapModal() {
        return (
            <Modal isVisible={this.state.isModalOpen}
                   style={{
                       flex: 1,
                       backgroundColor: base.theme.colors.transparent,
                       height: 50,
                       alignSelf: 'center',
                       width: wp('90%'),
                   }}>
                <View
                    style={{
                        height: hp("50%"),
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
                    <MapView
                        ref={map => {
                            this.map = map
                        }}
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        region={this.state.region}
                        showsUserLocation={false}
                        showsBuildings={true}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        pitchEnabled={false}
                        rotateEnabled={false}
                        followsUserLocation={true}
                        minZoomLevel={10}
                    >
                        {this.renderUserLocation()}
                    </MapView>
                </View>
            </Modal>
        )
    }

    renderUserLocation() {
        let self = this;
        let lat = self.state.region.latitude;
        let long = self.state.region.longitude;
        return (
            <View>
                <Marker key={1024}
                        pinColor={base.theme.colors.primary}
                        style={{alignItems: 'center', justifyContent: 'center'}}
                        coordinate={{latitude: lat, longitude: long}}>

                </Marker>
            </View>
        )
    }


    mapModal(data) {
        console.log("Data:", data);
        let res = data.item.cpgpsPnt.split(" ");
        console.log("res:", res);
        this.setState({
            isModalOpen: !this.state.isModalOpen,
            region: {
                latitude: res[0],
                longitude: res[1]
            }
        })
    }

    _renderCheckPoints(item) {
        let data = item;
        return (
            <View style={styles.checkBoxView}>
                <View style={{width: '10%'}}>
                    <CheckBox
                        style={styles.checkBoxStyle}
                        checkedCheckBoxColor={base.theme.colors.blue}
                        onClick={() => {
                            this.setCheckVal(data)
                        }}
                        isChecked={item.item.isChecked}/>
                </View>
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
                        <Text style={styles.centerTextStyle}>{data.item.cpCkPName}</Text>
                    </View>
                    <View style={styles.locationView}>
                        <Image
                            style={styles.locationImageStyle}
                            source={require('../../../icons/location.png')}
                        />
                        <Text numberOfLines={1}
                              style={styles.locationText}>{data.item.cpgpsPnt}</Text>
                    </View>
                </View>
                <View style={styles.rightView}>
                    <ElevatedView elevation={0}>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.props.navigation.navigate('qrScreen', {latLongData: data.item.cpgpsPnt})}>
                            <Image updateCheckListstyle={styles.rightImageStyle}
                                   source={require('../../../icons/qr-codes.png')}/>
                        </TouchableHighlight>
                    </ElevatedView>
                    <EmptyView height={10}/>
                    <ElevatedView elevation={0}>
                        <TouchableHighlight onPress={() => this.editCheckPoint(data)}>
                            <Image style={styles.rightImageStyle}
                                   source={require('../../../icons/edit.png')}/>
                        </TouchableHighlight>
                    </ElevatedView>
                    <EmptyView height={10}/>
                    <ElevatedView elevation={0}>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.deleteCP(data)}>
                            <Image style={styles.rightImageStyle}
                                   source={require('../../../icons/delete.png')}/>
                        </TouchableHighlight>
                    </ElevatedView>
                </View>
                {this.openMapModal()}
            </View>
        )
    }

    async deleteCP(data) {
        let self = this;

        let detail = {
            CPChkPntID: data.item.cpChkPntID
        }

        let stat = await base.services.OyeSafeApi.deleteCP(detail);
        base.utils.logger.log(stat);
        try {
            if (stat) {
                if (stat.success) {
                    alert("Check Point Deleted Successfully");
                    self.getCheckPoints();
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    setCheckVal(item) {
        let cpList = this.state.checkPointArray;
        console.info("Val:", item.item, cpList);
        for (let i in cpList) {
            if (item.item.cpChkPntID === cpList[i].cpChkPntID) {
                cpList[i].isChecked = !item.item.isChecked
            }
        }

        this.setState({
            checkPointArray: cpList
        }, () => this.updateStore())
    }

}


const styles = StyleSheet.create({
    container: {
        height: hp("100%"),
        width: '100%',
        backgroundColor: base.theme.colors.white
    },
    header: {
        alignItems: 'center',
        justifyContent: "center",
        height: "10%"
    },
    headerText: {
        fontSize: 15,
        fontFamily: base.theme.fonts.medium,
        color: base.theme.colors.primary
    },
    flatListView: {
        height: hp('75%'),
        flexDirection: 'row',
        justifyContent: 'center'
    },
    checkBoxView: {
        height:Platform.OS === 'ios' ?hp('20%'): hp('17%'),
        width: "98%",
        borderBottomWidth: 1,
        alignSelf: 'center',
        flexDirection: 'row'
    },
    checkBoxStyle: {
        flex: 1,
        padding: 10
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
        width: wp("40%"),
        alignSelf: 'center',
        marginLeft: wp('4%')
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
        height: hp('4%'),
        width: wp('38%'),
        alignItems: 'center',
    },
    locationImageStyle: {
        height: hp('3%'),
        width: hp('3%')
    },
    locationText: {
        width: wp('35%'),
        fontFamily: base.theme.fonts.thin
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
    map: {
        height: hp('50%'),
        alignSelf: 'center',
        width: wp('90%'),
    },
});

const mapStateToProps = state => {
    return {
        oyeURL: state.OyespaceReducer.oyeURL,
        champBaseURL: state.OyespaceReducer.champBaseURL,
        oye247BaseURL: state.OyespaceReducer.oye247BaseURL,
        oyeBaseURL: state.OyespaceReducer.oyeBaseURL,
        userReducer: state.UserReducer,
        SelectedAssociationID: state.UserReducer.SelectedAssociationID,
        selectedCheckPoints: state.PatrollingReducer
    }
};

export default connect(mapStateToProps, {updateSelectedCheckPoints})(PatrollingCheckPoints);