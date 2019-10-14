import React, {Component} from 'react';
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
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {NavigationEvents} from 'react-navigation';
import {connect} from 'react-redux';
import base from '../src/base';
import {updateIdDashboard} from '../src/actions';

import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import IcoMoonConfig from '../src/assets/selection.json';

const Icon = createIconSetFromIcoMoon(IcoMoonConfig);

class VehicleList extends Component {
    static navigationOptions = {
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
    }

    componentDidMount() {
        let self = this;
        setTimeout(() => {
            self.getVehicleList();
            this.setState({
                isLoading: false
            });
        }, 1500);
        base.utils.validate.checkSubscription(this.props.userReducer.SelectedAssociationID);

    }

    componentDidUpdate() {
        setTimeout(() => {
            BackHandler.addEventListener('hardwareBackPress', () =>
                this.processBackPress()
            );
        }, 100);
    }

    componentWillUnmount() {
        setTimeout(() => {
            BackHandler.removeEventListener('hardwareBackPress', () =>
                this.processBackPress()
            );
        }, 0);
    }

    
    processBackPress() {
        console.log("Part");
        const {goBack} = this.props.navigation;
        goBack(null);
        return true;
    }

    getVehicleList = () => {
        console.log('props in vehicle list:', this.props);
        fetch(
            `http://${this.props.oyeURL}/oyeliving/api/v1/Vehicle/GetVehicleListByUnitID/${this.props.dashBoardReducer.uniID}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1'
                }
            }
        )
            .then(response => response.json())
            .then(responseJson => {
                console.log('Vehicle List ------', responseJson);
                this.setState({
                    isLoading: false,
                    dataSource: responseJson.data.vehicleListByUnitID
                });
                const {updateIdDashboard} = this.props;
                updateIdDashboard({
                    prop: 'vehiclesCount',
                    value: responseJson.data.vehicleListByUnitID.length
                });
            })

            .catch(error => {
                this.setState({loading: false});
                console.log(error);
            });
        const {updateIdDashboard} = this.props;
        updateIdDashboard({
            prop: 'vehiclesCount',
            value: 0
        });
    };

    renderItem = ({item, index}) => {
        const swipeSettings = {
            autoClose: true,
            onClose: (secId, rowId, direction) => {
                this.setState({activeRowKey: null});
            },
            onOpen: (secId, rowId, direction) => {
                this.setState({activeRowKey: item.key});
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
        return (
            // <Swipeout {...swipeSettings} style={{backgroundColor:'#fff'}}>
            <View style={styles.maincolumn}>
                <View style={styles.divider}/>
                <View style={styles.firstRow}>
                    <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
                        {item.veType == 'Two Wheeler' ? (
                            <Icon size={hp('5%')} name="wheeler"/>
                        ) : (
                            <Icon size={hp('5%')} name="wheeler1"/>
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
                        <Text style={{fontSize: wp('4%'), fontWeight: 'bold'}}>
                            {item.veMakeMdl}
                        </Text>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                        <View style={styles.vehType}>
                            <Text style={{color: '#909091', fontSize: hp('1.7%')}}>
                                {item.veType}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.secondRow}>
                    <View style={styles.firstBox}>
                        <View style={{margin: hp('0.1%')}}>
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
                        <View style={{margin: hp('0.1%')}}>
                            <Text
                                style={{
                                    fontSize: hp('1.5%'),
                                    marginLeft: wp('0.5%'),
                                    marginRight: wp('0.5%')
                                }}
                            >
                                {item.veRegNo}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.secondBox}>
                        <View style={{margin: hp('0.1%')}}>
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
                        <View style={{margin: hp('0.1%')}}>
                            <Text
                                style={{
                                    fontSize: hp('1.5%'),
                                    marginLeft: wp('0.5%'),
                                    marginRight: wp('0.5%')
                                }}
                            >
                                {item.veStickNo}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.thirdBox}>
                        <View style={{margin: hp('0.1%')}}>
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
                        <View style={{margin: hp('0.1%')}}>
                            <Text
                                style={{
                                    fontSize: hp('1.5%'),
                                    marginLeft: wp('0.5%'),
                                    marginRight: wp('0.5%')
                                }}
                            >
                                {item.uplNum}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.thirdRow}>
                    <View style={{flexDirection: 'row'}}>
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
                            <Icon size={hp('3%')} color="#ff8c00" name="edit"/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                right: 10
                            }}
                            onPress={() => this.deleteVehicle(item.veid)}
                        >
                            <Icon size={hp('3%')} color="#ff8c00" name="delete"/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.divider}/>
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
        console.log('The Unit Id is coming?', this.props.dashBoardReducer.uniID);
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    {/* <Header/> */}

                    <SafeAreaView style={{backgroundColor: '#ff8c00'}}>
                        <View style={[styles.viewStyle1, {flexDirection: 'row'}]}>
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
                            <View style={{flex: 0.2}}>
                                {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
                            </View>
                        </View>
                        <View style={{borderWidth: 1, borderColor: 'orange'}}/>
                    </SafeAreaView>

                    <Text style={styles.titleOfScreen}>Vehicles</Text>

                    <View style={styles.progress}>
                        <ActivityIndicator size="large" color="#F3B431"/>
                    </View>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                {/* <Header/> */}

                <SafeAreaView style={{backgroundColor: '#ff8c00'}}>
                    <View style={[styles.viewStyle1, {flexDirection: 'row'}]}>
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
                        <View style={{flex: 0.2}}>
                            {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
                        </View>
                    </View>
                    <View style={{borderWidth: 1, borderColor: 'orange'}}/>
                </SafeAreaView>

                <NavigationEvents
                    onDidFocus={payload => this.getVehicleList()}
                    onWillBlur={payload => this.getVehicleList()}
                />
                <Text style={styles.titleOfScreen}>Vehicles</Text>

                    <FlatList
                    contentContainerStyle={this.state.dataSource.length === 0 && styles.centerEmptySet}
                        style={{marginTop: 15,}}
                        data={this.state.dataSource}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => item.veid.toString()}
                        ListEmptyComponent={
                            <View
                        style={{
                            
                            alignItems: 'center',
                            justifyContent: 'center',
                            
                        }}
                    >
                        <Icon size={hp('10%')} name="wheeler1"/>
                        <Text
                            style={{
                                backgroundColor: 'white',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: hp('1.6%')
                            }}
                        >
                            Add your vehicle details
                        </Text>
                    </View>
                        }
                    />
               
                <View style={{height: hp('7%')}}></View>

                <TouchableOpacity
                    style={styles.floatButton}
                    onPress={() => this.props.navigation.navigate('AddVehiclesScreen')}
                >
                    <Text
                        style={styles.plusTextStyle}
                    >
                        +
                    </Text>
                </TouchableOpacity>

                
            </View>
        );
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
        color: '#ff8c00',
        marginBottom: hp('1.6%')
    },
    centerEmptySet: { justifyContent: 'center', alignItems: 'center', height: '100%' },
    maincolumn: {
        flexDirection: 'column'
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
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        elevation: 2,
        position: 'relative'
    },
    image1: {
        width: wp('34%'),
        height: hp('18%'),
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

    };
};

export default connect(
    mapStateToProps,
    {updateIdDashboard}
)(VehicleList);
