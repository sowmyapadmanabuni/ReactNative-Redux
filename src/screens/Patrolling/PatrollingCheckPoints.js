/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-25
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
import PatrollingCheckPointsStyles from "./PatrollingCheckPointsStyles";

const { height, width } = Dimensions.get('screen');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let isRefreshing = false;


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
            cpName: '',
            isEditing: false,
            selectedArray: [],
            checkedArray: [],
            points: [],
            selectedCP: [],
            receivedCP: []
        };
        this.getCheckPoints = this.getCheckPoints.bind(this);
        console.log("Receicved Porp@@@@@@@@@:", props)
    };

    componentWillMount() {
        this.getCheckPoints(false);

        if (this.props.navigation.state.params !== undefined) {
            this.setState({ isEditing: true })
            this.getCheckPointListBySlotId()
        }

        // this.updateStore();
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
        const { goBack } = this.props.navigation;
        goBack(null);
    }


    componentWillReceiveProps(nextProps) {
        console.log("Next Props:", nextProps);
        if (nextProps.navigation.state.params !== undefined) {
            if (nextProps.navigation.state.params.isRefreshing === true) {
                nextProps.navigation.state.params.isRefreshing = false;
                this.getCheckPoints(true);
            }
            else if(nextProps.navigation.state.params.isEditing){
                nextProps.navigation.state.params.isEditing = false;
                this.getCheckPointListBySlotId()
            }

        }
    }


    async getCheckPointListBySlotId() {
        let data = this.props.navigation.state.params;
        let self = this;
        console.log("getCheckPointListBySlotId:", data);

        let stat = await OyeSafeApi.getCheckPointListBySlotId(data.data.psPtrlSID);
        console.log("getCheckPointListBySlotId:", data, stat);
        try {
            if (stat.success) {
                self.setState({
                    receivedCP: stat.data.checkPointsBySchedule[0].point
                }, () => self.getCheckPoints(true))
            }
        } catch (e) {
            console.log(e)
        }

    }


    async getCheckPoints(isRefreshing) {
        let self = this;
        base.utils.logger.log(self.props);

        let stat = await OyeSafeApi.getCheckPointList(self.props.SelectedAssociationID);
        //let stat = await OyeSafeApi.getCheckPointList(8);
        console.log("Stat in Patrolling CP:", stat);
        try {
            if (stat && stat !== undefined) {
                let cpList = stat.data.checkPointListByAssocID;
                if (this.props.navigation.state.params !== undefined && this.props.navigation.state.params.isRefreshing) {
                    // let cpListIDs = this.props.navigation.state.params.data.psChkPIDs;
                    //     let cpListIDArr = cpListIDs.split(",");
                    //     let cpArr= [];
                    //     for (let i in cpList) {
                    //         for (let j in cpListIDArr) {
                    //             if (cpList[i].cpChkPntID.toString() === cpListIDArr[j]) {
                    //                 cpList[i].isChecked = true
                    //             }
                    //         }
                    //     }
                    this.setState({
                        checkPointArray: cpList
                    }, () => this.updateStore(cpList))
                } else if (this.props.navigation.state.params !== undefined && this.props.navigation.state.params.data !== undefined) {
                    let cpListIDs = this.state.receivedCP;
                    console.log("CPLISTID:", cpListIDs, cpList);
                    let cpArr = [];
                    for (let i in cpListIDs) {
                        for (let j in cpList) {
                            if (cpListIDs[i].psChkPID === cpList[j].cpChkPntID) {
                                cpList[j].isChecked = true
                            }
                        }
                    }
                    this.setState({
                        checkPointArray: cpList,
                        points: cpListIDs
                    }, () => this.updateStore(cpList))
                } else {
                    self.updateCheckList(cpList);
                }

            }
        } catch (e) {
            base.utils.logger.log(e);
        }

    }

    updateCheckList(cpList) {
        let cpListArr = [];
        if (this.props.navigation.state.params !== undefined) {
            // if (this.props.navigation.state.params.isRefreshing !== undefined) {
            //     cpListArr = cpList
            // } else {
            //     let cpListIDs = this.props.navigation.state.params.data.psChkPIDs;
            //     let cpListIDArr = cpListIDs.split(",");
            //     for (let i in cpList) {
            //         for (let j in cpListIDArr) {
            //             if (cpList[i].cpChkPntID.toString() === cpListIDArr[j]) {
            //                 cpList[i].isChecked = true
            //             }
            //         }
            //     }
            //     cpListArr = cpList;
            // }
            cpListArr = cpList

        } else {
            cpListArr = cpList
        }

        console.log("CPLISTARR:", cpListArr, cpList);
        this.setState({
            checkPointArray: cpListArr
        })

        //     if (this.props.navigation.state.params !== undefined) {
        //     if (this.props.navigation.state.params.isRefreshing === true) {
        //         this.updateStore();
        //     }
        // }

    }

    componentWillUnmount() {
        updateSelectedCheckPoints({ value: null });
    }

    onBackButtonPressAndroid() {
        console.log("Hitting:111222");
    }

    render() {
        console.log("State:", this.state.checkPointArray);
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
                            extraData={this.state} /> :
                        <View style={{ justifyContent: 'center' }}>
                            <Text>No Check Points available</Text>
                        </View>}
                </View>
                <FloatingActionButton onBtnClick={() => this.props.navigation.navigate('addCheckPoint')} />
            </View>
        )
    }

    editCheckPoint(data) {
        this.props.navigation.navigate("addCheckPoint", { data: data })
    }


    updateStore(cpListArray) {
        let cpList = cpListArray;
        const { updateSelectedCheckPoints } = this.props;
        console.log("CP List Array:", cpListArray, this.props);
        let selectedCPArr = [];
        for (let i in cpList) {
            if (cpList[i].isChecked) {
                selectedCPArr.push(cpList[i]);
            }
        }
        console.log("Selected CP:", cpListArray);
        updateSelectedCheckPoints({ value: selectedCPArr });
        this.updateCheckList(cpListArray)
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


    mapModal(data) {
        console.log("Data:", data);
        let res = data.item.cpgpsPnt.split(" ");
        console.log("Res:", parseFloat(res[0]), parseFloat(res[1]));
        this.setState({
            isModalOpen: !this.state.isModalOpen,
            region: {
                latitude: parseFloat(res[0]),
                longitude: parseFloat(res[1]),
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            cpName: data.item.cpCkPName
        })
    }

    navigateToQRScree(data) {
        console.log("Data on Sharing:", data.item);
        let dataForQR = data.item;
        let slicedGPSPNTS = dataForQR.cpgpsPnt.split(" ");
        console.log("Sliced GPS Point:", slicedGPSPNTS);
        let dataToBeSent = `${dataForQR.cpCkPName}, ${slicedGPSPNTS[0]},${slicedGPSPNTS[1]},${dataForQR.asAssnID},${dataForQR.cpChkPntID},QR_CODE`;
        console.log("Data To Be Sent:", dataToBeSent);
        this.props.navigation.navigate('qrScreen', { dataToBeSent })

    }

    _renderCheckPoints(item) {
        let data = item;
        console.log("Item:", item.item);
        return (
            <View style={PatrollingCheckPointsStyles.checkBoxView}>
                <View style={PatrollingCheckPointsStyles.checkPoint}>
                    <CheckBox
                        style={PatrollingCheckPointsStyles.checkBoxStyle}
                        checkedCheckBoxColor={base.theme.colors.blue}
                        onClick={() => {
                            this.setCheckVal(data)
                        }}
                        isChecked={item.item.isChecked} />
                </View>
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
                    <View style={PatrollingCheckPointsStyles.centerTextView}>
                        <Text style={PatrollingCheckPointsStyles.centerTextStyle}>Type:- {data.item.cpcPntAt}</Text>
                    </View>
                </View>
                <View style={PatrollingCheckPointsStyles.rightView}>
                    <ElevatedView elevation={0}>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.navigateToQRScree(data)}>
                            <Image style={PatrollingCheckPointsStyles.rightImageStyle}
                                source={require('../../../icons/qr-codes.png')} />
                        </TouchableHighlight>
                    </ElevatedView>
                    <EmptyView height={10} />
                    {/* <ElevatedView elevation={0}>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.editCheckPoint(data)}>
                            <Image style={PatrollingCheckPointsStyles.rightImageStyle}
                                source={require('../../../icons/edit.png')} />
                        </TouchableHighlight>
                    </ElevatedView> */}
                    <EmptyView height={10} />
                    {/* <ElevatedView elevation={0}>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.deleteCheckPoint(data)}>
                            <Image style={PatrollingCheckPointsStyles.rightImageStyle}
                                source={require('../../../icons/delete.png')} />
                        </TouchableHighlight>
                    </ElevatedView> */}
                </View>
                {this.openMapModal()}
            </View>
        )
    }

    deleteCheckPoint(data) {

        Alert.alert(
            'Attention',
            'Are you sure you want to delete this checkpoint ?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Deletion Cancelled'),
                    style: 'cancel',
                },
                { text: 'Yes', onPress: () => this.selectDeleteType(data) },
            ],
            { cancelable: false },
        );
    }

    selectDeleteType(data) {
        (this.state.isEditing) ? this.deleteSlotCP(data) : this.deleteCP(data);
    }




    async deleteSlotCP(data) {
        let self = this;
        let receivedCP = self.state.receivedCP;
        console.log("Hitting11111:", data.item.cpChkPntID, receivedCP)
        let tempArr = self.state.checkPointArray;
        let matchItem = false;
        for (let i in receivedCP) {
            console.log("Hitting11111344364:", data.item.cpChkPntID, receivedCP[i])

            if (data.item.cpChkPntID === receivedCP[i].psChkPID) {
                console.log("Hitting111112", receivedCP[i].psChkPID)
                matchItem = true;
            }

        }
        if (matchItem) {
            alert("You can't delete an active check point")
        }
        else {
            self.spliceArr(data.item.cpChkPntID)
        }


    }


    spliceArr(cpId) {
        let cpArr = this.state.checkPointArray
        for (let i in cpArr) {
            if (cpId === cpArr[i].cpChkPntID) {
                cpArr.splice(i, 1)
            }
        }

        this.setState({
            checkPointArray: cpArr
        }, () => this.updateStore(cpArr))

    }

    async deleteCP(data) {
        let self = this;

        let detail = {
            CPChkPntID: data.item.cpChkPntID
        };

        let stat = await base.services.OyeSafeApi.deleteCP(detail);
        base.utils.logger.log(stat);
        try {
            if (stat) {
                if (stat.success) {
                    alert("Check Point Deleted Successfully");
                    self.getCheckPoints(true);
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    setCheckVal(item) {
        let cpList = this.state.checkPointArray;
        let pointArr = this.state.points;
        let unselectedData = [];

        for (let i in cpList) {
            if (item.item.cpChkPntID === cpList[i].cpChkPntID) {
                console.log("Slelc:", cpList[i]);
                cpList[i].isChecked = !cpList[i].isChecked
            }
        }
        for (let i in pointArr) {
            for (let j in cpList) {
                if (!cpList[j].isChecked) {
                    console.log("fdnfgdsdgb", cpList[j]);
                    if (cpList[j].cpChkPntID === pointArr[i].psChkPID) {
                        unselectedData.push(pointArr[i].pcid)
                    }
                }
            }
        }
        AsyncStorage.setItem("PCID", JSON.stringify(unselectedData));


        this.setState({
            checkPointArray: cpList
        });
        this.updateStore(cpList)
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

export default connect(mapStateToProps, { updateSelectedCheckPoints })(PatrollingCheckPoints);