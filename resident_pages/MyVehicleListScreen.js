import React, { Component } from 'react';
import {
    ActivityIndicator,
    Alert,
    BackHandler,
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import base from '../src/base';
import { updateIdDashboard } from '../src/actions';
import axios from 'axios';

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import IcoMoonConfig from '../src/assets/selection.json';
import FloatingButton from "../src/components/FloatingButton";

const Icon = createIconSetFromIcoMoon(IcoMoonConfig);

class VehicleList extends Component {
    static navigationOptions = {
        listLength: 0,
        title: 'Vehicle List',
        header: null
    };

    // open the home screen file lets test

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: [],
            activeRowKey: null
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount() {
        let self = this;
        // setTimeout(() => {

        //     this.setState({
        //         isLoading: false
        //     });
        // }, 1500);
        self.getVehicleList();
        base.utils.validate.checkSubscription(this.props.assId);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentDidUpdate() {
        /*setTimeout(() => {
            BackHandler.addEventListener('hardwareBackPress', () =>
                this.processBackPress()
            );
        }, 100);*/
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        /*setTimeout(() => {
            BackHandler.removeEventListener('hardwareBackPress', () =>
                this.processBackPress()
            );
        }, 0);*/
    }

    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }


    processBackPress() {
        console.log("Part");
        const { goBack } = this.props.navigation;
        goBack(null);
        return true;
    }

    async getVehicleList() {
        console.log('props in vehicle list:', this.props, this.props.assId, this.props.uniID, this.props.userReducer.MyAccountID);
        let myVehicleList = await base.services.OyeLivingApi.myVehicleListAPI(
            this.props.dashBoardReducer.assId,
            this.props.dashBoardReducer.uniID,
            this.props.userReducer.MyAccountID
        );
        console.log('GETTING DATA IN VEHICLES', myVehicleList)
        this.setState({
            isLoading: false
        })
        if (myVehicleList.success && myVehicleList.data.vehicleListByUnitID.length !== 0) {

            let vehicleList = myVehicleList.data.vehicleListByUnitID
            console.log('GETTING DATA IN VEHICLES111111', myVehicleList, vehicleList)

            this.setState({
                isLoading: false,
                dataSource: vehicleList,
                listLength: vehicleList.length,
            });

            const { updateIdDashboard } = this.props;
            updateIdDashboard({
                prop: 'vehiclesCount',
                value: vehicleList.length
            });
            console.log("responseJson.data ", responseJson.data)
        }
        else {
            console.log('GETTING DATA IN VEHICLES111111', myVehicleList)
            this.setState({ dataSource: [] });
            const { updateIdDashboard } = this.props;
            updateIdDashboard({
                prop: 'vehiclesCount',
                value: 0
            });
        }
    }





    renderItem = ({ item, index }) => {
        const swipeSettings = {
            autoClose: true,
            onClose: (secId, rowId, direction) => {
                this.setState({ activeRowKey: null });
            },
            onOpen: (secId, rowId, direction) => {
                this.setState({ activeRowKey: item.key });
            },
            right: [
                {
                    onPress: () => {
                        Alert.alert(
                            'Alert',
                            'Are you sure you want to delete?',
                            [
                                {
                                    text: 'No',
                                    onPress: () => console.log('cancel Pressed'),
                                    style: 'cancel'
                                },
                                {
                                    text: 'Yes',
                                    onPress: () => {
                                        this.state.dataSource.splice(index, 1);
                                    }
                                }
                            ],
                            {
                                cancelable: true
                            }
                        );
                    },
                    text: 'Delete',
                    type: 'delete'
                }
            ],
            rowId: this.props.index,
            section: 1
        };
        console.log("item ", item, index);
        return (
            // <Swipeout {...swipeSettings} style={{backgroundColor:'#fff'}}>
            <View style={[styles.maincolumn, {
                marginBottom: index == (this.state.listLength - 1) ? 70 : 0
            }]}>
                <View style={styles.divider} />
                <View style={styles.firstRow}>
                    <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                        {item.veType == 'Two Wheeler' ? (
                            <Icon size={hp('5%')} name="wheeler" />
                        ) : (
                                <Icon size={hp('5%')} name="wheeler1" />
                            )}
                    </View>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            marginLeft: hp('1%')
                        }}
                    >
                        <Text style={{ fontSize: wp('4%'), fontWeight: 'bold' }}>
                            {item.veMakeMdl}
                        </Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <View style={styles.vehType}>
                            <Text style={{ color: '#909091', fontSize: hp('1.7%') }}>
                                {item.veType}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.secondRow}>
                    <View style={styles.firstBox}>
                        <View style={{ margin: hp('0.1%') }}>
                            <Text
                                style={{
                                    fontSize: hp('1.5%'),
                                    marginLeft: wp('0.5%'),
                                    marginRight: wp('0.5%')
                                }}
                            >
                                Vehicle Number
                            </Text>
                        </View>
                        <View style={{ margin: hp('0.1%') }}>
                            <Text
                                style={{
                                    fontSize: hp('1.5%'),
                                    marginLeft: wp('0.5%'),
                                    marginRight: wp('0.5%'),
                                    color: base.theme.colors.green
                                }}
                            >
                                {item.veRegNo}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.secondBox}>
                        <View style={{ margin: hp('0.1%') }}>
                            <Text
                                style={{
                                    fontSize: hp('1.5%'),
                                    marginLeft: wp('0.5%'),
                                    marginRight: wp('0.5%')
                                }}
                            >
                                Vehicle Sticker Number
                            </Text>
                        </View>
                        <View style={{ margin: hp('0.1%') }}>
                            <Text
                                style={{
                                    fontSize: hp('1.5%'),
                                    marginLeft: wp('0.5%'),
                                    marginRight: wp('0.5%'),
                                    color: base.theme.colors.green

                                }}
                            >
                                {item.veStickNo}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.thirdBox}>
                        <View style={{ margin: hp('0.1%') }}>
                            <Text
                                style={{
                                    fontSize: hp('1.5%'),
                                    marginLeft: wp('0.5%'),
                                    marginRight: wp('0.5%')
                                }}
                            >
                                Parking Slot Number
                            </Text>
                        </View>
                        <View style={{ margin: hp('0.1%') }}>
                            <Text
                                style={{
                                    fontSize: hp('1.5%'),
                                    marginLeft: wp('0.5%'),
                                    marginRight: wp('0.5%'),
                                    color: base.theme.colors.green

                                }}
                            >
                                {item.uplNum}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.thirdRow}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{
                                right: 15
                            }}
                            onPress={() => {
                                this.props.navigation.navigate('EditVehiclesScreen', {
                                    VehName: item.veMakeMdl.toString(),
                                    VehNum: item.veRegNo.toString(),
                                    VehStickerNum: item.veStickNo.toString(),
                                    VehParkingSlotNum: item.uplNum.toString(),
                                    VehType: item.veType,
                                    Veid: item.veid
                                });
                            }}
                        >
                            <Icon size={hp('3%')} color="#B51414" name="edit" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                right: 10
                            }}
                            onPress={() => this.deleteVehicle(item.veid)}
                        >
                            <Icon size={hp('3%')} color="#B51414" name="delete" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.divider} />
            </View>
            // </Swipeout>
        );
    };

    async deleteVehicle(vehicleId) {
        let self = this;

        let detail = {
            VEIsActive: 'False',
            VEID: vehicleId
        };

        let stat = await base.services.OyeLivingApi.deleteVehicle(detail);

        console.log('Stat in delete API:', stat);

        try {
            if (stat.success) {
                self.getVehicleList();
            } else {
                alert('Something Went Wrong !!!');
            }
        } catch (e) {
            console.log('Error:', e);
        }
    }

    render() {
        console.log('RENDER THE DATA SOURCE', this.state.dataSource);
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    {/* <Header/> */}

                    <SafeAreaView style={{ backgroundColor: '#ff8c00' }}>
                        <View style={[styles.viewStyle1, { flexDirection: 'row' }]}>
                            <View style={styles.viewDetails1}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.goBack();
                                    }}
                                >
                                    <View
                                        style={{
                                            height: hp('4%'),
                                            width: wp('15%'),
                                            alignItems: 'flex-start',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Image
                                            resizeMode="contain"
                                            source={require('../icons/back.png')}
                                            style={styles.viewDetails2}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Image
                                    style={[styles.image1]}
                                    source={require('../icons/OyespaceSafe.png')}
                                />
                            </View>
                            <View style={{ flex: 0.2 }}>
                                {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
                            </View>
                        </View>
                        <View style={{ borderWidth: 1, borderColor: '#FFFFFF' }} />
                    </SafeAreaView>

                    <Text style={styles.titleOfScreen}>Vehicles</Text>

                    <View style={styles.progress}>
                        <ActivityIndicator size="large" color="#F3B431" />
                    </View>
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    {/* <Header/> */}

                    <SafeAreaView style={{ backgroundColor: '#ff8c00' }}>
                        <View style={[styles.viewStyle1, { flexDirection: 'row' }]}>
                            <View style={styles.viewDetails1}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.goBack();
                                    }}
                                >
                                    <View
                                        style={{
                                            height: hp('4%'),
                                            width: wp('15%'),
                                            alignItems: 'flex-start',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Image
                                            resizeMode="contain"
                                            source={require('../icons/back.png')}
                                            style={styles.viewDetails2}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Image
                                    style={[styles.image1]}
                                    source={require('../icons/OyespaceSafe.png')}
                                />
                            </View>
                            <View style={{ flex: 0.2 }}>
                                {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
                            </View>
                        </View>
                        <View style={{ borderWidth: 1, borderColor: 'orange' }} />
                    </SafeAreaView>

                    <NavigationEvents
                        onDidFocus={payload => this.getVehicleList()}
                        onWillBlur={payload => this.getVehicleList()}
                    />
                    <Text style={styles.titleOfScreen}>Vehicles</Text>
                    {this.state.dataSource.length !== 0 ?
                        <FlatList
                            contentContainerStyle={this.state.dataSource.length === 0 && styles.centerEmptySet}
                            style={{ marginTop: 15, }}
                            data={this.state.dataSource}
                            renderItem={this.renderItem}
                            keyExtractor={(item, index) => item.veid.toString()}

                        />
                        :
                        <View
                            style={{

                                alignItems: 'center',
                                justifyContent: 'center',

                            }}
                        >
                            <Icon size={hp('10%')} name="wheeler1" />
                            <Text
                                style={{
                                    backgroundColor: 'white',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: hp('1.6%')
                                }}
                            >
                                Add your vehicle details...
                            </Text>
                        </View>
                    }
                    <View style={{ height: hp('7%') }}></View>

                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        bottom: hp('5%'),
                        right: hp('3.5%'),
                        height: hp('6.5%'),
                    }}>
                        <FloatingButton marginTop={hp('80')} onBtnClick={() => this.changePage()} />
                    </View>
                </View>
            );
        }

    }
    changePage() {
        this.props.navigation.navigate('AddVehiclesScreen')
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column'
    },
    progress: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleOfScreen: {
        marginTop: hp('1.6%'),
        textAlign: 'center',
        fontSize: hp('2%'),
        fontWeight: 'bold',
        // color: '#ff8c00',
        marginBottom: hp('1.6%')
    },
    centerEmptySet: { justifyContent: 'center', alignItems: 'center', height: '100%' },
    maincolumn: {
        flexDirection: 'column',
    },
    divider: {
        backgroundColor: 'lightgray',
        height: hp('0.1%')
    },
    firstRow: {
        flexDirection: 'row',
        paddingTop: hp('1%'),
        marginHorizontal: hp('1%')
    },
    secondRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: wp('100%'),
        height: hp('7%')
    },
    thirdRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        alignSelf: 'flex-end'
    },
    vehType: {
        borderColor: 'lightgray',
        borderWidth: wp('0.4%'),
        borderRadius: hp('1.5%'),
        height: hp('3%'),
        alignItems: 'center',
        justifyContent: 'center',
        width: wp('25%')
    },
    firstBox: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: hp('0.1%'),
        borderRadius: wp('0.2%')
    },
    secondBox: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: hp('0.1%'),
        borderBottomWidth: hp('0.1%'),
        borderRadius: wp('0.2%')
    },
    thirdBox: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: hp('0.1%'),
        borderRadius: wp('0.2%')
    },

    floatButton: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0)',
        alignItems: 'center',
        justifyContent: 'center',
        width: hp('6.5%'),
        position: 'absolute',
        bottom: hp('5%'),
        right: hp('3.5%'),
        height: hp('6.5%'),
        backgroundColor: '#FF8C00',
        borderRadius: hp('4.5%'),
        // shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 3,
        shadowOpacity: 0.6
    },

    plusTextStyle: {
        fontSize: hp('4%'),
        color: '#fff',
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: hp('0.5%')
    },
    viewStyle1: {
        backgroundColor: '#fff',
        height: hp('7%'),
        width: Dimensions.get('screen').width,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
        position: 'relative'
    },
    image1: {
        // width: wp('34%'),
        // height: hp('18%'),
        marginRight: hp('3%')
    },

    viewDetails1: {
        flex: 0.3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 3
    },
    viewDetails2: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: hp('3%'),
        height: hp('3%'),
        marginTop: 5
        // marginLeft: 10
    }
});

const mapStateToProps = state => {
    return {
        dashBoardReducer: state.DashboardReducer,
        oyeURL: state.OyespaceReducer.oyeURL,
        userReducer: state.UserReducer,
        assId: state.DashboardReducer.assId,
        uniID: state.DashboardReducer.uniID,

    };
};

export default connect(
    mapStateToProps,
    { updateIdDashboard }
)(VehicleList);