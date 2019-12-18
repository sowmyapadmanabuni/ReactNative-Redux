import React, { Component } from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity, FlatList, Platform, Switch,ScrollView} from 'react-native';
import HeaderStyles from '../src/components/dashBoardHeader/HeaderStyles';
import base from '../src/base';
import { connect } from 'react-redux';
import { Icon, withBadge } from 'react-native-elements';
import MarqueeText from 'react-native-marquee';
import ElevatedView from "react-native-elevated-view";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

class SettingsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myfamily11: [],
            familyData: [],
            vendorSwitchValue: false,
            inAppRequest: false,
            inAppNotification: false,
            ivr: false,
            telegram: false,
            sms: false,
            inAppRequestExit: false,
            inAppNotificationExit: false,
            ivrExit: false,
            telegramExit: false,
            smsExit: false,
            sideBarData: [{name: "Notification Settings", id: 0, isSelected: false}, {
                name: "SOS",
                id: 1,
                isSelected: false
            }],
            kidExit: false,
            inAppRequestKid: false,
            inAppNotificationEid: false,
            ivrKid: false,
            telegramKid: false,
            smsKid: false,
            Service: false,
            notificationService: false,
            telegramService: false,
            guestValue: false,
            inAppRequestGuest: false,
            inAppNotificationGuest: false,
            ivrGuest: false,
            telegramGuest: false,
            smsGuest: false,
            notificationBroadcast: false,
            telegramBroadcast: false,

            setting: true,
            sos: false,
            isSelected: 0,
        }
    }

    componentDidMount() {
        this.myFamilyListGetData()
    }

    async myFamilyListGetData() {
        console.log("myFamilyListGetData", this.props.userReducer);
        console.log("input ",
            this.props.dashboardReducer.uniID,
            this.props.dashboardReducer.assId,
            this.props.userReducer.MyAccountID
        );

        this.setState({loading: true});
        let myFamilyList = await base.services.OyeSafeApiFamily.myFamilyList(
            this.props.dashboardReducer.uniID,
            this.props.dashboardReducer.assId,
            this.props.userReducer.MyAccountID
        );

        console.log("myFamilyList ", myFamilyList);
        this.setState({isLoading: false, loading: false});
        try {
            if (myFamilyList.success && myFamilyList.data) {
                let familyData = myFamilyList.data.familyMembers;
                console.log('GET THE DATA', familyData)

                for (let i = 0; i < familyData.length; i++) {
                    if (this.props.MyAccountID === familyData[i].acAccntID) {
                        familyData[i].isFSelected = true;
                    } else {
                        familyData[i].isFSelected = false;
                    }
                }
                console.log('FAMILY DATA', familyData)

                this.setState({
                    myfamily11: familyData.sort((a, b) =>
                        a.fmName > b.fmName ? 1 : -1
                    ),
                });
            } else {
                this.showAlert(myFamilyList.error.message, true);
            }
        } catch (error) {
            base.utils.logger.log(error);
            this.setState({error, loading: false});
            const {updateIdDashboard} = this.props;
        }
    }

    renderTopViews(item) {
        console.log("item ", item);
        console.log("data>> ", item.item.fmlName)
        return (

            <TouchableOpacity
                style={{
                    shadowOpacity: Platform.OS === 'ios' ? 0.0015 * 10 + 0.18 : 0,
                    shadowRadius: Platform.OS === 'ios' ? 0.54 * 10 : 0,
                    shadowOffset: {
                        height: Platform.OS === 'ios' ? 0.6 * 10 : 0,
                    },
                    shadowColor: base.theme.colors.greyHead,
                    borderColor: base.theme.colors.greyHead,
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    width: wp(25),
                    height: hp(5),
                    marginRight: wp('5'),
                    // shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 0,},
                    // shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0,
                    // shadowRadius:Platform.OS === 'ios' ? 2: 0,
                    elevation: 10,
                    borderWidth: 0.5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: item.item.isFSelected ? base.theme.colors.white : base.theme.colors.greyHead,
                }}
                disabled={item.item.isFSelected}
                onPress={() => this.changeTheMember(item)}

            >
                <Text>
                    {item.item.fmName}
                </Text>
            </TouchableOpacity>
        )
    }

    changeTheScreen(item){
        let setData=this.state.sideBarData;
        console.log('GET THE ITEM VAL###',item,setData)

        for(let i=0;i<setData.length;i++){
            if (item.item.id === i){
                setData[i].isSelected=true
            }
            else{
                setData[i].isSelected=false

            }
            console.log("----> ",i);
        }
        this.setState({
            sideBarData:setData
        })
    }


    renderSideBar(item) {
        console.log("renderSideBar ", item);
        return (
            <TouchableOpacity
                style={{
                    shadowOpacity: Platform.OS === 'ios' ? 0.0015 * 10 + 0.18 : 0,
                    shadowRadius: Platform.OS === 'ios' ? 0.54 * 10 : 0,
                    shadowOffset: {
                        height: Platform.OS === 'ios' ? 0.6 * 10 : 0,
                    },
                    shadowColor: base.theme.colors.greyHead,
                    borderColor: base.theme.colors.greyHead,
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                    ///height: wp(50),
                    width: wp(10),
                   // width: wp(25),
                   // height: hp(5),
                    marginTop:hp(6),
                    // shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 0,},
                    // shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0,
                    // shadowRadius:Platform.OS === 'ios' ? 2: 0,
                    elevation: 10,
                    borderWidth: 0.5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: item.item.isSelected ? base.theme.colors.white : base.theme.colors.greyHead,

                }}
                disabled={item.item.isSelected}
                onPress={() => this.changeTheScreen(item)}

            >
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        //backgroundColor:'yellow',
                        //height:hp(10),
                        width: wp(40),
                        transform: [{rotate: '-90deg'}]
                    }}>
                        <Text style={{fontSize:14,color:base.theme.colors.black,paddingTop:hp('10'),
                            paddingBottom:hp('10')}}>
                            {item.item.name}
                        </Text>
                    </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={{flex: 1}}>

                <ScrollView>

                    <View
                        style={{
                            backgroundColor: base.theme.colors.white,
                            flexDirection: 'row',
                            marginTop: hp(5),
                        }}
                    >
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            style={{
                                width: wp(60),
                                marginLeft: wp('18'),
                                backgroundColor: base.theme.colors.white,
                            }}
                            horizontal={true}
                            data={this.state.myfamily11}
                            renderItem={(item) => this.renderTopViews(item)}
                            extraData={this.state}
                        />

                            <TouchableOpacity onPress={() => this.props.navigation.navigate("MyFamily")}

                                              style={{
                                                  shadowOpacity: Platform.OS === 'ios' ? 0.0015 * 10 + 0.18 : 0,
                                                  shadowRadius: Platform.OS === 'ios' ? 0.54 * 10 : 0,
                                                  shadowOffset: {
                                                      height: Platform.OS === 'ios' ? 0.6 * 10 : 0,
                                                  },
                                                  shadowColor: base.theme.colors.greyHead,
                                                  borderColor: base.theme.colors.greyHead,
                                                  borderTopLeftRadius: 10,
                                                  borderTopRightRadius: 10,
                                                  width: wp(15),
                                                  height: hp(5),
                                                  marginLeft: wp('5'),
                                                  // shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 0,},
                                                  // shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0,
                                                  // shadowRadius:Platform.OS === 'ios' ? 2: 0,
                                                  elevation: 10,
                                                  borderWidth: 0.5,
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  backgroundColor:  base.theme.colors.white ,
                                              }}
                            >
                                <Image
                                    resizeMode="contain"
                                    source={require('../icons/add.png')}
                                    style={{
                                        height: hp(2.5)
                                    }}
                                />
                            </TouchableOpacity>

                    </View>

                    <View style={{flex: 1, flexDirection: 'row',}}>
                        <View style={{paddingLeft: wp(1),
                            width:wp(11)}}>

                            <FlatList
                                style={{
                                    height: wp(100),
                                    //marginLeft:wp('18'),
                                    //marginTop:hp(5),
                                    //backgroundColor:'yellow',
                                }}
                                data={this.state.sideBarData}
                                renderItem={(item) => this.renderSideBar(item)}
                                //keyExtractor={item => item.id}
                            />



                        </View>

                        <View
                            style={{
                                borderWidth: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: base.theme.colors.white,
                                shadowOpacity: Platform.OS === 'ios' ? 0.0015 * 8 + 0.18 : 0,
                                shadowRadius: Platform.OS === 'ios' ? 0.54 * 8 : 0,
                                shadowOffset: {
                                    height: Platform.OS === 'ios' ? 0.6 * 8 : 0,
                                },
                                shadowColor: base.theme.colors.greyHead,
                                borderColor: base.theme.colors.greyHead,
                                elevation:8,
                                borderTopLeftRadius: 20,
                                //flex: 1,
                                width: wp(90),
                                paddingTop: hp(5),
                                paddingLeft: wp(8),
                                paddingRight: wp(8),
                            }}
                        >

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text style={{
                                    fontSize: 20
                                }}>Vendors/Deliveries</Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        transform: [{scaleX: 1.2}, {scaleY: 1.2}]
                                    }}
                                    trackColor={{true: '#45B591', false: 'grey'}}
                                    thumbTintColor="white"
                                    //onValueChange = {(value)=>this.toggleSwitch(value)}
                                    onValueChange={() => this.setState({vendorSwitchValue: !this.state.vendorSwitchValue})}
                                    value={this.state.vendorSwitchValue}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: hp(2)}}>
                                <Text>Entry</Text>
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text>
                                    In-App Request
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({inAppRequest: !this.state.inAppRequest})}
                                    value={this.state.inAppRequest}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text>
                                    In-App Notification
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({inAppNotification: !this.state.inAppNotification})}
                                    value={this.state.inAppNotification}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text>
                                    ivr Call Request
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({ivr: !this.state.ivr})}
                                    value={this.state.ivr}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text>
                                    Telegram Notification
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({telegram: !this.state.telegram})}
                                    value={this.state.telegram}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text>
                                    SMS
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({sms: !this.state.sms})}
                                    value={this.state.sms}
                                />
                            </View>

                            <View
                                style={{
                                    //backgroundColor:'yellow',
                                    height: hp(3),
                                    alignSelf: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: '#EAEAEA',
                                        width: wp(80),
                                        height: hp(0.2),
                                        alignSelf: 'center',
                                    }}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text>Exit</Text>
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text>
                                    In-App Request
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({inAppRequestExit: !this.state.inAppRequestExit})}
                                    value={this.state.inAppRequestExit}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text>
                                    In-App Notification
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({inAppNotificationExit: !this.state.inAppNotificationExit})}
                                    value={this.state.inAppNotificationExit}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text>
                                    ivr Call Request
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({ivrExit: !this.state.ivrExit})}
                                    value={this.state.ivrExit}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text>
                                    Telegram Notification
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({telegramExit: !this.state.telegramExit})}
                                    value={this.state.telegramExit}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text>
                                    SMS
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({smsExit: !this.state.smsExit})}
                                    value={this.state.smsExit}
                                />
                            </View>

                            <View
                                style={{
                                    //backgroundColor:'yellow',
                                    height: hp(5),
                                    alignSelf: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: '#D3D3D3',
                                        width: wp(90),
                                        height: hp(0.2),
                                        alignSelf: 'center',
                                    }}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text style={{
                                    fontSize: 20
                                }}>Kid Exit</Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        transform: [{scaleX: 1.2}, {scaleY: 1.2}]
                                    }}
                                    trackColor={{true: '#45B591', false: 'grey'}}
                                    thumbTintColor="white"
                                    //onValueChange = {(value)=>this.toggleSwitch(value)}
                                    onValueChange={() => this.setState({kidExit: !this.state.kidExit})}
                                    value={this.state.kidExit}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: hp(2),}}>
                                <Text>
                                    In-App Request
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({inAppRequestKid: !this.state.inAppRequestKid})}
                                    value={this.state.inAppRequestKid}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text>
                                    In-App Notification
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({inAppNotificationEid: !this.state.inAppNotificationEid})}
                                    value={this.state.inAppNotificationEid}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text>
                                    ivr Call Request
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({ivrKid: !this.state.ivrKid})}
                                    value={this.state.ivrKid}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text>
                                    Telegram Notification
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({telegramKid: !this.state.telegramKid})}
                                    value={this.state.telegramKid}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text>
                                    SMS
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({smsKid: !this.state.smsKid})}
                                    value={this.state.smsKid}
                                />
                            </View>

                            <View
                                style={{
                                    //backgroundColor:'yellow',
                                    height: hp(5),
                                    alignSelf: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: '#D3D3D3',
                                        width: wp(90),
                                        height: hp(0.2),
                                        alignSelf: 'center',
                                    }}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text style={{
                                    fontSize: 20
                                }}>Service Provider/Staff</Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        transform: [{scaleX: 1.2}, {scaleY: 1.2}]
                                    }}
                                    trackColor={{true: '#45B591', false: 'grey'}}
                                    thumbTintColor="white"
                                    //onValueChange = {(value)=>this.toggleSwitch(value)}
                                    onValueChange={() => this.setState({Service: !this.state.Service})}
                                    value={this.state.Service}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: hp(2),}}>
                                <Text>
                                    In-App Notification
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({notificationService: !this.state.notificationService})}
                                    value={this.state.notificationService}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text>
                                    Telegram Notification
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({telegramService: !this.state.telegramService})}
                                    value={this.state.telegramService}
                                />
                            </View>

                            <View
                                style={{
                                    //backgroundColor:'yellow',
                                    height: hp(5),
                                    alignSelf: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: '#D3D3D3',
                                        width: wp(90),
                                        height: hp(0.2),
                                        alignSelf: 'center',
                                    }}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text style={{
                                    fontSize: 20
                                }}>Surprise Guest</Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        transform: [{scaleX: 1.2}, {scaleY: 1.2}]
                                    }}
                                    trackColor={{true: '#45B591', false: 'grey'}}
                                    thumbTintColor="white"
                                    //onValueChange = {(value)=>this.toggleSwitch(value)}
                                    onValueChange={() => this.setState({guestValue: !this.state.guestValue})}
                                    value={this.state.guestValue}
                                />
                            </View>


                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: hp(2)}}>
                                <Text>
                                    In-App Request
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({inAppRequestGuest: !this.state.inAppRequestGuest})}
                                    value={this.state.inAppRequestGuest}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text>
                                    In-App Notification
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({inAppNotificationGuest: !this.state.inAppNotificationGuest})}
                                    value={this.state.inAppNotificationGuest}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text>
                                    ivr Call Request
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({ivrGuest: !this.state.ivrGuest})}
                                    value={this.state.ivrGuest}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text>
                                    Telegram Notification
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({telegramGuest: !this.state.telegramGuest})}
                                    value={this.state.telegramGuest}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text>
                                    SMS
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({smsGuest: !this.state.smsGuest})}
                                    value={this.state.smsGuest}
                                />
                            </View>

                            <View
                                style={{
                                    //backgroundColor:'yellow',
                                    height: hp(5),
                                    alignSelf: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: '#D3D3D3',
                                        width: wp(90),
                                        height: hp(0.2),
                                        alignSelf: 'center',
                                    }}
                                />
                            </View>


                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text style={{
                                    fontSize: 20
                                }}>Broadcast</Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        transform: [{scaleX: 1.2}, {scaleY: 1.2}]
                                    }}
                                    trackColor={{true: '#EF3939', false: 'grey'}}
                                    thumbTintColor="white"
                                    //onValueChange = {(value)=>this.toggleSwitch(value)}
                                    onValueChange={() => this.setState({vendorSwitchValue: !this.state.vendorSwitchValue})}
                                    value={this.state.vendorSwitchValue}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: hp(2),}}>
                                <Text>
                                    In-App Notification
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({notificationBroadcast: !this.state.notificationBroadcast})}
                                    value={this.state.notificationBroadcast}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text>
                                    Telegram Notification
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({telegramBroadcast: !this.state.telegramBroadcast})}
                                    value={this.state.telegramBroadcast}
                                />
                            </View>

                            <View
                                style={{
                                    //backgroundColor:'yellow',
                                    height: hp(5),
                                    alignSelf: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: '#D3D3D3',
                                        width: wp(90),
                                        height: hp(0.2),
                                        alignSelf: 'center',
                                    }}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text>
                                    Invoice & Receipts
                                </Text>
                                <Switch
                                    style={{
                                        flex: 1,
                                        alignSelf: 'flex-end',
                                        //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                    }}
                                    trackColor={{true: '#FFB400', false: 'grey'}}
                                    thumbTintColor="white"
                                    onValueChange={() => this.setState({telegramBroadcast: !this.state.telegramBroadcast})}
                                    value={this.state.telegramBroadcast}
                                />
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: hp(2)}}>
                                <Text>Invoices Generated </Text>
                            </View>


                        </View>
                    </View>

                </ScrollView>
            </View>
        )
    }

    changeTheMember(item) {
        let self = this;
        let familyData = self.state.myfamily11;
        console.log('GET THE CHANGES IN ANDROID', item, familyData)

        for (let i = 0; i < familyData.length; i++) {
            console.log('GET THE ID', item.item.fmid, familyData[i].fmid)
            if (familyData[i].fmid === item.item.fmid) {
                console.log('GET THE ID1111', item.item.fmid, familyData[i].fmid)
                familyData[i].isFSelected = true
            } else {
                familyData[i].isFSelected = false
            }
            self.setState({
                myfamily11: familyData
            })

        }
    }
}

const mapStateToProps = state => {
    return {
        OyespaceReducer: state.OyespaceReducer,
        oyeURL: state.OyespaceReducer.oyeURL,
        MyAccountID: state.UserReducer.MyAccountID,
        MyFirstName: state.UserReducer.MyFirstName,
        viewImageURL: state.OyespaceReducer.viewImageURL,
        notifications: state.NotificationReducer.notifications,
        userReducer: state.UserReducer,
        dashboardReducer: state.DashboardReducer
    };
};

export default connect(mapStateToProps)(SettingsScreen);
