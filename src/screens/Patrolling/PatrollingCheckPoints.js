/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-25
 */

import React from 'react';
import {Dimensions, FlatList, Image, Text, TouchableHighlight, View} from 'react-native';
import {connect} from 'react-redux';
import base from "../../base";
import FloatingActionButton from "../../components/FloatingButton";
import OyeSafeApi from "../../base/services/OyeSafeApi";
import CheckBox from 'react-native-check-box';
import ElevatedView from 'react-native-elevated-view';
import EmptyView from "../../components/common/EmptyView";
import {updateSelectedCheckPoints} from '../../../src/actions';
import Modal from "react-native-modal";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import PatrollingCheckPointsStyles from "./PatrollingCheckPointsStyles";

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
            isEditing: false,
            selectedArray: [],
            checkedArray: []
        };
        this.getCheckPoints = this.getCheckPoints.bind(this);
    };

    componentWillMount() {
        this.getCheckPoints();

        if (this.props.navigation.state.params !== undefined) {
            this.setState({isEditing: true})
        }

        this.updateStore();

    }

    componentWillReceiveProps(nextProps) {
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
        //let stat = await OyeSafeApi.getCheckPointList(8);
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
        return (
            <View style={PatrollingCheckPointsStyles.container}>
                <View style={PatrollingCheckPointsStyles.header}>
                    <Text
                        style={PatrollingCheckPointsStyles.headerText}>{this.state.checkPointArray.length > 0 ? "Select Patrolling Check Points" : ""}</Text>
                </View>
                <View style={PatrollingCheckPointsStyles.flatListView}>
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
                   style={PatrollingCheckPointsStyles.mapViewModal}>
                <View
                    style={PatrollingCheckPointsStyles.modalView}>
                    <TouchableHighlight
                        underlayColor={base.theme.colors.transparent}
                        style={PatrollingCheckPointsStyles.modalTouchable}
                        onPress={() => this.setState({isModalOpen: false})}>
                        <Text style={PatrollingCheckPointsStyles.modalText}>Close</Text>
                    </TouchableHighlight>
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
                        style={PatrollingCheckPointsStyles.marker}
                        coordinate={{latitude: lat, longitude: long}}>

                </Marker>
            </View>
        )
    }


    mapModal(data) {
        let res = data.item.cpgpsPnt.split(" ");
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
            <View style={PatrollingCheckPointsStyles.checkBoxView}>
                <View style={PatrollingCheckPointsStyles.checkPoint}>
                    <CheckBox
                        style={PatrollingCheckPointsStyles.checkBoxStyle}
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
                        <Text style={PatrollingCheckPointsStyles.centerTextStyle}>{data.item.cpCkPName}</Text>
                    </View>
                    <View style={PatrollingCheckPointsStyles.locationView}>
                        <Image
                            style={PatrollingCheckPointsStyles.locationImageStyle}
                            source={require('../../../icons/location.png')}
                        />
                        <Text numberOfLines={1}
                              style={PatrollingCheckPointsStyles.locationText}>{data.item.cpgpsPnt}</Text>
                    </View>
                </View>
                <View style={PatrollingCheckPointsStyles.rightView}>
                    <ElevatedView elevation={0}>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.props.navigation.navigate('qrScreen', {latLongData: data.item.cpgpsPnt})}>
                            <Image style={PatrollingCheckPointsStyles.rightImageStyle}
                                   source={require('../../../icons/qr-codes.png')}/>
                        </TouchableHighlight>
                    </ElevatedView>
                    <EmptyView height={10}/>
                    <ElevatedView elevation={0}>
                        <TouchableHighlight onPress={() => this.editCheckPoint(data)}>
                            <Image style={PatrollingCheckPointsStyles.rightImageStyle}
                                   source={require('../../../icons/edit.png')}/>
                        </TouchableHighlight>
                    </ElevatedView>
                    <EmptyView height={10}/>
                    <ElevatedView elevation={0}>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.deleteCP(data)}>
                            <Image style={PatrollingCheckPointsStyles.rightImageStyle}
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
        let selectedArr = this.state.selectedArray;
        if (selectedArr.length === 0) {
            selectedArr.push(item);
            for (let i in cpList) {
                if (item.item.cpChkPntID === cpList[i].cpChkPntID) {
                    cpList[i].isChecked = !item.item.isChecked
                }
            }
            this.setState({
                checkPointArray: cpList
            }, () => this.updateStore())
        } else {
            let splitLatLongArr = [];
            for (let i in cpList) {
                if (cpList[i].isChecked) {
                    splitLatLongArr.push(cpList[i])
                }
            }
            for (let i in selectedArr) {
                splitLatLongArr = base.utils.validate.strToArray(selectedArr[selectedArr.length - 1].item.cpgpsPnt);
            }

            let splitNewLatLongArr = base.utils.validate.strToArray(item.item.cpgpsPnt);
            let lat1 = parseFloat(splitLatLongArr[0]);
            let lat2 = parseFloat(splitNewLatLongArr[0]);
            let long1 = parseFloat(splitLatLongArr[1]);
            let long2 = parseFloat(splitNewLatLongArr[1]);
            let pcpStatus = base.utils.validate.distanceMeasurement(lat1, lat2, long1, long2);
            console.log("PCP Status:", pcpStatus, lat1, lat2, long1, long2);
            if (pcpStatus === true) {
                for (let i in cpList) {
                    if (item.item.cpChkPntID === cpList[i].cpChkPntID) {
                        cpList[i].isChecked = !item.item.isChecked
                    }
                }
                this.setState({
                    checkPointArray: cpList
                }, () => this.updateStore())
            } else {
                if (pcpStatus === 'less') {
                    alert("Distance between two Checkpoints must be minimum 10 ft")
                } else if (pcpStatus === 'more') {
                    alert("Distance between two Checkpoints must be maximum 20 ft")
                } else {
                    for (let i in cpList) {
                        if (item.item.cpChkPntID === cpList[i].cpChkPntID) {
                            cpList[i].isChecked = !item.item.isChecked
                        }
                        this.setState({
                            checkPointArray: cpList
                        }, () => this.updateStore())
                    }
                }
            }
        }
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

export default connect(mapStateToProps, {updateSelectedCheckPoints})(PatrollingCheckPoints);