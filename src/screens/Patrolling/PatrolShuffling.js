/*
 * @Author: Sarthak Mishra 
 * @Date: 2019-09-30 11:29:48 
 * @Last Modified by: Sarthak Mishra
 * @Last Modified time: 2020-03-19 16:15:35
 */


import React from 'react';
import {
    Alert,
    AsyncStorage,
    BackHandler,
    Dimensions,
    FlatList,
    Image,
    Text,
    TouchableHighlight,
    View
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

import { connect } from 'react-redux';
import base from "../../base";
import FloatingActionButton from "../../components/FloatingButton";
import OyeSafeApi from "../../base/services/OyeSafeApi";
import CheckBox from 'react-native-check-box';
import ElevatedView from 'react-native-elevated-view';
import EmptyView from "../../components/common/EmptyView";
import { updateSelectedCheckPoints } from '../../../src/actions';
import Modal from "react-native-modal";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import DraggableFlatList from 'react-native-draggable-flatlist'
import PatrollingCheckPointsStyles from "./PatrollingCheckPointsStyles";
const { height, width } = Dimensions.get('screen');
import Toast, { DURATION } from 'react-native-easy-toast';
import LottieView from 'lottie-react-native';


const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;




class PatrolShuffling extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            scrolled: {},
            isModalOpen: false,
            region: {
                latitude: '',
                longitude: '',
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            cpName: "",
            isLottieModalOpen: false
        }
    }


    UNSAFE_componentWillMount() {
        this.setState({
            data: this.props.selectedCheckPoints.selectedCheckPoints,
            isLottieModalOpen: true
        })
    }

    renderItem = ({ item, index, drag, moveEnd, isActive }) => {
        console.log("SKJCKJDC:", item, drag, moveEnd, isActive);
        let data = item;
        console.log("Item:", item.item);
        return (

            <TouchableHighlight
                underlayColor={base.theme.colors.transparent}
                style={[PatrollingCheckPointsStyles.checkBoxView, { backgroundColor: isActive ? base.theme.colors.primary : base.theme.colors.white }]}
                onLongPress={drag}
                onPressOut={moveEnd}
                onPressIn={drag}
            >
                <View style={PatrollingCheckPointsStyles.checkBoxView}>
                    <TouchableHighlight onPress={() => this.mapModal(data)}
                        underlayColor={base.theme.colors.transparent}
                        style={{ justifyContent: 'center' }}>
                        <View>
                            <Image
                                style={PatrollingCheckPointsStyles.mapImage}
                                source={require('../../../icons/map1.png')}
                            />
                            <Image
                                resizeMode={'center'}
                                style={PatrollingCheckPointsStyles.mapImage1}
                                source={require('../../../icons/zoom.png')}
                            />
                        </View>
                    </TouchableHighlight>
                    <View style={PatrollingCheckPointsStyles.centerView}>
                        <View style={PatrollingCheckPointsStyles.centerTextView}>
                            <Text style={PatrollingCheckPointsStyles.centerTextStyle}>{data.cpCkPName}</Text>
                        </View>
                        <View style={PatrollingCheckPointsStyles.locationView}>
                            <Image
                                resizeMode={'center'}
                                style={PatrollingCheckPointsStyles.locationImageStyle}
                                source={require('../../../icons/location.png')}
                            />
                            <Text numberOfLines={1}
                                style={PatrollingCheckPointsStyles.locationText}>{data.cpgpsPnt}</Text>
                        </View>
                        <View style={PatrollingCheckPointsStyles.locationView}>
                            <Image
                                resizeMode={'center'}
                                style={PatrollingCheckPointsStyles.locationImageStyle}
                                source={require('../../../icons/checkpoint.png')}
                            />
                            <Text style={PatrollingCheckPointsStyles.locationText}>{data.cpcPntAt}</Text>
                        </View>
                    </View>
                </View>

            </TouchableHighlight>
        )
    }


    mapModal(data) {
        console.log("Data:", data);
        let res = data.cpgpsPnt.split(" ");
        console.log("Res:", parseFloat(res[0]), parseFloat(res[1]));
        this.setState({
            isModalOpen: !this.state.isModalOpen,
            region: {
                latitude: parseFloat(res[0]),
                longitude: parseFloat(res[1]),
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            cpName: data.cpCkPName
        })
    }

    openMapModal() {
        return (
            <Modal isVisible={this.state.isModalOpen}
                style={PatrollingCheckPointsStyles.mapViewModal}>
                <View
                    style={PatrollingCheckPointsStyles.modalView}>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                        <View>
                            <Text style={PatrollingCheckPointsStyles.modalText}>{this.state.cpName}</Text>
                        </View>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            style={PatrollingCheckPointsStyles.modalTouchable}
                            onPress={() => this.setState({ isModalOpen: false })}>
                            <Text style={PatrollingCheckPointsStyles.modalText}>Close</Text>
                        </TouchableHighlight>
                    </View>
                    <MapView
                        ref={map => {
                            this.map = map
                        }}
                        provider={PROVIDER_GOOGLE}
                        style={PatrollingCheckPointsStyles.map}
                        region={this.state.region}
                        showsUserLocation={false}
                        showsBuildings={true}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        pitchEnabled={false}
                        rotateEnabled={false}
                        followsUserLocation={true}
                        minZoomLevel={20}
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
                    style={PatrollingCheckPointsStyles.marker}
                    coordinate={{ latitude: lat, longitude: long }}>

                </Marker>
            </View>
        )
    }

    updateStore() {
        const { updateSelectedCheckPoints } = this.props;
        updateSelectedCheckPoints({ value: this.state.data });

    }



    render() {
        console.log("Props Received:", this.state.data);

        return (
            <View style={{ flex: 1, backgroundColor: base.theme.colors.white }}>
                <View style={PatrollingCheckPointsStyles.header}>
                    <Text

                        style={[PatrollingCheckPointsStyles.headerText, { textAlign: 'center', color: base.theme.colors.primary }]}>Swipe the seleted checkpoints up and down{'\n'}to set the patrolling path</Text>
                </View>
                <DraggableFlatList
                    data={this.state.data}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                  //  scrollPercent={15}
                    horizontal={false}
                    onDragEnd={({ data }) => this.setState({ data }, () => this.updateStore())}
                />
                {this.openMapModal()}
                {this.openLottieModal()}
            </View>
        )
    }


    openLottieModal() {
        return (
            <Modal isVisible={this.state.isLottieModalOpen}
                style={{

                    backgroundColor: base.theme.colors.transparent,
                    alignSelf: 'center',
                    justifySelf: 'center',
                    justifyContent: 'center',
                    width: wp('100%'),
                    height: hp('50%')
                }}>
                <Image style={{
                    alignSelf: 'center',
                    height: hp('15%'),
                    width: hp('15%')
                }}
                    source={require('../../../icons/swipe.png')} />
                <View style={{ marginTop: hp('2'), height: hp('10'), width: wp('75'), alignSelf: 'center', borderRadius: hp('5'), backgroundColor: 'rgba(192, 192, 192, 0.3)', justifyContent: 'center', alignItem: 'center' }}>
                    <Text style={{ marginTop: hp('0'), alignSelf: 'center', justifySelf: 'center', color: base.theme.colors.white, fontSize: hp('1.8'), }}>You can change the patrolling path by swiping </Text>
                    <Text style={{ marginTop: hp('0'), alignSelf: 'center', justifySelf: 'center', color: base.theme.colors.white, fontSize: hp('1.8') }}>the checkpoints up and down.</Text>
                </View>
                <View style={{ marginTop: hp('2'), height: hp('10'), width: wp('80'), alignSelf: 'center', borderRadius: hp('5'), backgroundColor: '#1AFF0000', justifyContent: 'center', borderColor: "#000000", alignItems: 'center' }}>
                    <Text style={{
                        marginTop: hp('2'),
                        alignSelf: 'center',
                        justifySelf: 'center',
                        color: base.theme.colors.primary,
                        fontFamily: base.theme.fonts.medium, fontSize: hp('1.8')
                    }}>Please make sure that the starting point of patrolling </Text>
                    <Text style={{
                        marginTop: hp('0'),
                        alignSelf: 'center',
                        width: wp('80'),
                        color: base.theme.colors.primary, fontSize: hp('1.8'),
                        fontFamily: base.theme.fonts.medium,
                    }}>is at first and End point of patrolling is at last position in the list </Text>

                </View>
                <TouchableHighlight
                    underlayColor={base.theme.colors.transparent}
                    onPress={() => this.setState({ isLottieModalOpen: false })}>
                    <Text style={{
                        borderBottomWidth: 2, borderColor: "#FFFFFF", marginTop: hp('5'), alignSelf: 'center', color: base.theme.colors.white, fontSize: 20,
                        fontFamily: base.theme.fonts.medium
                    }}>Got It</Text>
                </TouchableHighlight>
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
        SelectedAssociationID: state.DashboardReducer.assId,
        selectedCheckPoints: state.PatrollingReducer
    }
};

export default connect(mapStateToProps, { updateSelectedCheckPoints })(PatrolShuffling);
