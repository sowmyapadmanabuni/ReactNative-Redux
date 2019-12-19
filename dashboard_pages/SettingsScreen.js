
import React, { Component } from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity, FlatList, Platform, Switch,ScrollView} from 'react-native';
import HeaderStyles from '../src/components/dashBoardHeader/HeaderStyles';
import base from '../src/base';
import {connect} from 'react-redux';
import ElevatedView from "react-native-elevated-view";
import ToggleSwitch from 'toggle-switch-react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

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
            broadcastValue:false,
            sideBarData: [{name: "Notification Settings", id: 0, isSelected: false}, {
                name: "SOS",
                id: 1,
                isSelected: false
            }],
            vendorListData: [
                {title: "In-App Request", id: 0, isSelected: false},
                {title: "In-App Notification", id: 1, isSelected: false},
                {title: "IVR Call Request", id: 2, isSelected: false},
                {title: "Telegram Notification", id: 3, isSelected: false},
                {title: "SMS", id: 4, isSelected: false},
            ],

            vendorExitListData: [
                {title: "In-App Request", id: 0, isSelected: false},
                {title: "In-App Notification", id: 1, isSelected: false},
                {title: "IVR Call Request", id: 2, isSelected: false},
                {title: "Telegram Notification", id: 3, isSelected: false},
                {title: "SMS", id: 4, isSelected: false},
            ],

            KidExitList: [
                {title: "In-App Request", id: 0, isSelected: false},
                {title: "In-App Notification", id: 1, isSelected: false},
                {title: "IVR Call Request", id: 2, isSelected: false},
                {title: "Telegram Notification", id: 3, isSelected: false},
                {title: "SMS", id: 4, isSelected: false},
            ],

            serviceList: [
                {title: "In-App Notification", id: 0, isSelected: false},
                {title: "Telegram Notification", id: 1, isSelected: false},
            ],

            guestList: [
                {title: "In-App Request", id: 0, isSelected: false},
                {title: "In-App Notification", id: 1, isSelected: false},
                {title: "IVR Call Request", id: 2, isSelected: false},
                {title: "Telegram Notification", id: 3, isSelected: false},
                {title: "SMS", id: 4, isSelected: false},
            ],

            broadcastList: [
                {title: "In-App Notification", id: 0, isSelected: false},
                {title: "Telegram Notification", id: 1, isSelected: false},
            ],

            invoiceGeneratedList: [
                {title: "In-App Notification", id: 0, isSelected: false},
                {title: "Telegram Notification", id: 1, isSelected: false},
            ],

            invoiceDueList: [
                {title: "In-App Notification", id: 0, isSelected: false},
                {title: "Telegram Notification", id: 1, isSelected: false},
            ],

            receiptsGeneratedList: [
                {title: "In-App Notification", id: 0, isSelected: false},
                {title: "Telegram Notification", id: 1, isSelected: false},
            ],

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
            InvoiceValue: false,
            notificationInvoice: false,
            telegramInvoices: false,
            notificationInvoiceDue: false,
            telegramInvoicesDue: false,
            notificationReceipts: false,
            telegramInvoicesReceipts: false,

            setting: true,
            sos: false,
            isSelected: 0,

        }
    }

    vendorSwitchValueOff(){
        if (this.state.vendorSwitchValue){
            this.setState({
                vendorSwitchValue:false
            });
            let setData = this.state.vendorListData;
            for (let i = 0; i < setData.length; i++) {
                setData[i].isSelected = false
            }
            this.setState({
                vendorListData: setData
            })

            let setData2 = this.state.vendorExitListData;
            for (let i = 0; i < setData2.length; i++) {
                setData2[i].isSelected = false

            }
            this.setState({
                vendorExitListData: setData2
            })
        }
        else{
            this.setState({
                vendorSwitchValue:true
            });
        }


    }

    kidExitValueOff(){
        if (this.state.kidExit){
            this.setState({
                kidExit:false
            });

            let setData = this.state.KidExitList;
            for (let i = 0; i < setData.length; i++) {
                setData[i].isSelected = false
            }
            this.setState({
                KidExitList: setData
            })
        }
        else{
            this.setState({
                kidExit: true
            })
        }

    }

    serviceValueOff(){
        if(this.state.Service){
            this.setState({
                Service:false
            });
            let setData = this.state.serviceList;
            for (let i = 0; i < setData.length; i++) {
                setData[i].isSelected = false

            }
            this.setState({
                serviceList: setData
            })
        }
        else{
            this.setState({
                Service:true
            })
        }

    }

    guestValueOff(){
        if(this.state.guestValue) {
            this.setState({
                guestValue: false
            });
            let setData = this.state.guestList;
            for (let i = 0; i < setData.length; i++) {
                setData[i].isSelected = false
            }
            this.setState({
                guestList: setData
            })
        }
        else{
            this.setState({
                guestValue:true
            })
        }
    }

    broadcastValueOff(){
        if(this.state.broadcastValue) {
            this.setState({
                broadcastValue: false
            });
            let setData = this.state.broadcastList;
            for (let i = 0; i < setData.length; i++) {
                    setData[i].isSelected = false
            }
            this.setState({
                broadcastList: setData
            })
        }
        else{
            this.setState({
                broadcastValue:true
            })
        }
    }

    InvoiceValueOff(){
        if(this.state.InvoiceValue) {
            this.setState({
                InvoiceValue: false
            });
            let setData = this.state.invoiceGeneratedList;
            for (let i = 0; i < setData.length; i++) {
                setData[i].isSelected = false
            }
            this.setState({
                invoiceGeneratedList: setData
            })

            let setData2 = this.state.invoiceDueList;
            for (let i = 0; i < setData2.length; i++) {
                setData2[i].isSelected = false

            }
            this.setState({
                invoiceDueList: setData2
            })

            let setData3 = this.state.receiptsGeneratedList;
            for (let i = 0; i < setData3.length; i++) {
                setData3[i].isSelected = false

            }
            this.setState({
                receiptsGeneratedList: setData3
            })
        }
        else{
            this.setState({
                InvoiceValue:true
            })
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

    changeTheScreen(item) {
        let setData = this.state.sideBarData;
        console.log('GET THE ITEM VAL###', item, setData)

        for (let i = 0; i < setData.length; i++) {
            if (item.item.id === i) {
                setData[i].isSelected = true
            } else {
                setData[i].isSelected = false

            }
            console.log("----> ", i);
        }
        this.setState({
            sideBarData: setData
        })
    }

    vendorToggle(item) {
        if(this.state.vendorSwitchValue) {
            console.log(">>>>>", item)

            let setData = this.state.vendorListData;
            for (let i = 0; i < setData.length; i++) {
                if (item.item.id === i) {
                    setData[i].isSelected = !setData[i].isSelected
                }
            }
            this.setState({
                vendorListData: setData
            })
        }
    }

    vendorExitToggle(item) {
        if(this.state.vendorSwitchValue) {
            console.log(">>>>>", item)

            let setData = this.state.vendorExitListData;
            for (let i = 0; i < setData.length; i++) {
                if (item.item.id === i) {
                    setData[i].isSelected = !setData[i].isSelected
                }
            }
            this.setState({
                vendorExitListData: setData
            })
        }
    }

    KidExitToggle(item) {
        if(this.state.kidExit) {
            console.log(">>>>>", item);

            let setData = this.state.KidExitList;
            for (let i = 0; i < setData.length; i++) {
                if (item.item.id === i) {
                    setData[i].isSelected = !setData[i].isSelected
                }
            }
            this.setState({
                KidExitList: setData
            })
        }
    }

    guestToggle(item) {
        if(this.state.guestValue) {
            console.log(">>>>>", item);

            let setData = this.state.guestList;
            for (let i = 0; i < setData.length; i++) {
                if (item.item.id === i) {
                    setData[i].isSelected = !setData[i].isSelected
                }
            }
            this.setState({
                guestList: setData
            })
        }
    }

    broadcastToggle(item) {
        if(this.state.broadcastValue) {
            console.log(">>>>>", item);

            let setData = this.state.broadcastList;
            for (let i = 0; i < setData.length; i++) {
                if (item.item.id === i) {
                    setData[i].isSelected = !setData[i].isSelected
                }
            }
            this.setState({
                broadcastList: setData
            })
        }
    }

    invoiceGeneratedToggle(item) {
        if(this.state.InvoiceValue) {
            console.log(">>>>>", item);

            let setData = this.state.invoiceGeneratedList;
            for (let i = 0; i < setData.length; i++) {
                if (item.item.id === i) {
                    setData[i].isSelected = !setData[i].isSelected
                }
            }
            this.setState({
                invoiceGeneratedList: setData
            })
        }
    }

    invoiceDueToggle(item) {
        if(this.state.InvoiceValue) {
            console.log(">>>>>", item);

            let setData = this.state.invoiceDueList;
            for (let i = 0; i < setData.length; i++) {
                if (item.item.id === i) {
                    setData[i].isSelected = !setData[i].isSelected
                }
            }
            this.setState({
                invoiceDueList: setData
            })
        }
    }

    receiptGeneratedToggle(item) {
        if(this.state.InvoiceValue) {
            console.log(">>>>>", item);

            let setData = this.state.receiptsGeneratedList;
            for (let i = 0; i < setData.length; i++) {
                if (item.item.id === i) {
                    setData[i].isSelected = !setData[i].isSelected
                }
            }
            this.setState({
                receiptsGeneratedList: setData
            })
        }
    }

    serviceToggle(item) {
        console.log(">>>>>", item);

        let setData = this.state.serviceList;
        for (let i = 0; i < setData.length; i++) {
            if (item.item.id === i) {
                setData[i].isSelected = !setData[i].isSelected
            }
        }
        this.setState({
            serviceList: setData
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

    VendorList(item) {
        console.log("item ", item);
        return (
            <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center',marginBottom:hp(0.5)}}>
                <View style={{width: wp(80), flex: 1}}>
                    <Text>
                        {item.item.title}
                    </Text>
                </View>
                <View
                    style={{
                        //backgroundColor:'yellow',
                        flex: 1,
                        alignItems: 'flex-end',
                        transform: [{scaleX: 0.8}, {scaleY: 0.8}]
                    }}
                >
                    <ToggleSwitch
                        isOn={item.item.isSelected}
                        onColor="#FFB400"
                        offColor="#DCDCE5"
                        size="small"
                        onToggle={isOn => this.vendorToggle(item)}
                    />
                </View>

            </View>
        )
    }

    VendorExitList(item) {
        console.log("item ", item);
        return (
            <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center',marginBottom:hp(0.5)}}>
                <View style={{width: wp(80), flex: 1}}>
                    <Text>
                        {item.item.title}
                    </Text>
                </View>
                <View
                    style={{
                        //backgroundColor:'yellow',
                        flex: 1,
                        alignItems: 'flex-end',
                        transform: [{scaleX: 0.8}, {scaleY: 0.8}]
                    }}
                >
                    <ToggleSwitch
                        isOn={item.item.isSelected}
                        onColor="#FFB400"
                        offColor="#DCDCE5"
                        size="small"
                        onToggle={isOn => this.vendorExitToggle(item)}
                    />
                </View>

            </View>
        )
    }

    KidExit(item) {
        console.log("item ", item);
        return (
            <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center',marginBottom:hp(0.5)}}>
                <View style={{width: wp(80), flex: 1}}>
                    <Text>
                        {item.item.title}
                    </Text>
                </View>
                <View
                    style={{
                        //backgroundColor:'yellow',
                        flex: 1,
                        alignItems: 'flex-end',
                        transform: [{scaleX: 0.8}, {scaleY: 0.8}]
                    }}
                >
                    <ToggleSwitch
                        isOn={item.item.isSelected}
                        onColor="#FFB400"
                        offColor="#DCDCE5"
                        size="small"
                        onToggle={isOn => this.KidExitToggle(item)}
                    />
                </View>

            </View>
        )
    }

    guest(item) {
        console.log("item ", item);
        return (
            <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center',marginBottom:hp(0.5)}}>
                <View style={{width: wp(80), flex: 1}}>
                    <Text>
                        {item.item.title}
                    </Text>
                </View>
                <View
                    style={{
                        //backgroundColor:'yellow',
                        flex: 1,
                        alignItems: 'flex-end',
                        transform: [{scaleX: 0.8}, {scaleY: 0.8}]
                    }}
                >
                    <ToggleSwitch
                        isOn={item.item.isSelected}
                        onColor="#FFB400"
                        offColor="#DCDCE5"
                        size="small"
                        onToggle={isOn => this.guestToggle(item)}
                    />
                </View>

            </View>
        )
    }

    service(item) {
        console.log("item ", item);
        return (
            <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center',marginBottom:hp(0.5)}}>
                <View style={{width: wp(80), flex: 1}}>
                    <Text>
                        {item.item.title}
                    </Text>
                </View>
                <View
                    style={{
                        //backgroundColor:'yellow',
                        flex: 1,
                        alignItems: 'flex-end',
                        transform: [{scaleX: 0.8}, {scaleY: 0.8}]
                    }}
                >
                    <ToggleSwitch
                        isOn={item.item.isSelected}
                        onColor="#FFB400"
                        offColor="#DCDCE5"
                        size="small"
                        onToggle={isOn => this.serviceToggle(item)}
                    />
                </View>

            </View>
        )
    }

    broadcast(item) {
        console.log("item ", item);
        return (
            <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center',marginBottom:hp(0.5)}}>
                <View style={{width: wp(80), flex: 1}}>
                    <Text>
                        {item.item.title}
                    </Text>
                </View>
                <View
                    style={{
                        //backgroundColor:'yellow',
                        flex: 1,
                        alignItems: 'flex-end',
                        transform: [{scaleX: 0.8}, {scaleY: 0.8}]
                    }}
                >
                    <ToggleSwitch
                        isOn={item.item.isSelected}
                        onColor="#FFB400"
                        offColor="#DCDCE5"
                        size="small"
                        onToggle={isOn => this.broadcastToggle(item)}
                    />
                </View>

            </View>
        )
    }

    invoiceGenerated(item) {
        console.log("item ", item);
        return (
            <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center',marginBottom:hp(0.5)}}>
                <View style={{width: wp(80), flex: 1}}>
                    <Text>
                        {item.item.title}
                    </Text>
                </View>
                <View
                    style={{
                        //backgroundColor:'yellow',
                        flex: 1,
                        alignItems: 'flex-end',
                        transform: [{scaleX: 0.8}, {scaleY: 0.8}]
                    }}
                >
                    <ToggleSwitch
                        isOn={item.item.isSelected}
                        onColor="#FFB400"
                        offColor="#DCDCE5"
                        size="small"
                        onToggle={isOn => this.invoiceGeneratedToggle(item)}
                    />
                </View>

            </View>
        )
    }

    invoiceDue(item) {
        console.log("item ", item);
        return (
            <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center',marginBottom:hp(0.5)}}>
                <View style={{width: wp(80), flex: 1}}>
                    <Text>
                        {item.item.title}
                    </Text>
                </View>
                <View
                    style={{
                        //backgroundColor:'yellow',
                        flex: 1,
                        alignItems: 'flex-end',
                        transform: [{scaleX: 0.8}, {scaleY: 0.8}]
                    }}
                >
                    <ToggleSwitch
                        isOn={item.item.isSelected}
                        onColor="#FFB400"
                        offColor="#DCDCE5"
                        size="small"
                        onToggle={isOn => this.invoiceDueToggle(item)}
                    />
                </View>

            </View>
        )
    }

    receiptGenerated(item) {
        console.log("item ", item);
        return (
            <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center',marginBottom:hp(0.5)}}>
                <View style={{width: wp(80), flex: 1}}>
                    <Text>
                        {item.item.title}
                    </Text>
                </View>
                <View
                    style={{
                        //backgroundColor:'yellow',
                        flex: 1,
                        alignItems: 'flex-end',
                        transform: [{scaleX: 0.8}, {scaleY: 0.8}]
                    }}
                >
                    <ToggleSwitch
                        isOn={item.item.isSelected}
                        onColor="#FFB400"
                        offColor="#DCDCE5"
                        size="small"
                        onToggle={isOn => this.receiptGeneratedToggle(item)}
                    />
                </View>

            </View>
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
                                              elevation: 10,
                                              borderWidth: 0.5,
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              backgroundColor: base.theme.colors.white,
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

                    <View style={{flex:1,flexDirection:'row', }}>
                        <View style={{paddingLeft:wp(1)}}>

                            <FlatList
                                style={{
                                    height:wp(100),
                                    //marginLeft:wp('18'),
                                    //marginTop:hp(5),
                                    //backgroundColor:'yellow',
                                }}
                                extraData={this.state}
                                data={this.state.sideBarData}
                                renderItem={(item) => this.renderSideBar(item)}
                                //keyExtractor={item => item.id}
                            />

                        </View>

                        <View
                            style={{
                                borderTopLeftRadius:20,
                                flex:1,
                                width:wp(80),
                                paddingTop:hp(5),
                                //paddingLeft:wp(8),
                                //paddingRight:wp(8),
                                borderWidth: 1,
                               // alignItems: 'center',
                               // justifyContent: 'center',
                                backgroundColor: base.theme.colors.white,
                                shadowOpacity: Platform.OS === 'ios' ? 0.0015 * 8 + 0.18 : 0,
                                shadowRadius: Platform.OS === 'ios' ? 0.54 * 8 : 0,
                                shadowOffset: {
                                    height: Platform.OS === 'ios' ? 0.6 * 8 : 0,
                                },
                                shadowColor: base.theme.colors.greyHead,
                                borderColor: base.theme.colors.greyHead,
                                elevation:8,
                               // borderTopLeftRadius: 20,
                                //flex: 1,
                              //  width: wp(90),
                              //  paddingTop: hp(5),
                               // paddingLeft: wp(8),
                               // paddingRight: wp(8),
                            }}
                        >
                            <View style={{
                                //backgroundColor:'red',
                                marginLeft:wp(8),
                                marginRight:wp(8),
                                marginBottom:hp(8),
                            }}>

                                <View style={{ flexDirection:'row' , alignItems:'center', }}>
                                    <View style={{width: wp(60), }}>
                                        <Text style={{
                                            fontSize:20,
                                            color: base.theme.colors.black
                                        }}>Vendors/Deliveries</Text>
                                    </View>
                                    <View style={{ flex:1, alignItems: 'flex-end'}}>
                                   <Switch
                                        style={{
                                            alignSelf:'flex-end',
                                            marginLeft:wp(2),
                                            //alignItems: 'flex-end',
                                            transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#45B591', false: '#EF3939'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=>this.vendorSwitchValueOff()}
                                        // onValueChange = {()=> {
                                        //     this.setState({vendorSwitchValue: !this.state.vendorSwitchValue})
                                        //     if (this.state.vendorSwitchValue){
                                        //         this.vendorSwitchValueOff()
                                        //     }
                                        // }}
                                        value = {this.state.vendorSwitchValue}
                                    />
                                    </View>
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', marginTop:hp(2),marginBottom:hp(1)}}>
                                    <Text style={{color: base.theme.colors.black}}>Entry</Text>
                                </View>

                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    style={{
                                        width:wp(80),
                                        //marginLeft:wp('18'),
                                        //marginTop:hp(5),
                                        //backgroundColor:'yellow',
                                    }}
                                    data={this.state.vendorListData}
                                    renderItem={(item) => this.VendorList(item)}
                                    //keyExtractor={item => item.id}
                                />

                                <View
                                    style={{
                                        //backgroundColor:'yellow',
                                        height:hp(3),
                                        alignSelf:'center',
                                        justifyContent:'center'
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor:'#EAEAEA',
                                            width:wp(80),
                                            height:hp(0.2),
                                            alignSelf:'center',
                                        }}
                                    />
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', marginBottom:hp(1)}}>
                                    <Text style={{color: base.theme.colors.black}} >Exit</Text>
                                </View>

                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    style={{
                                        width:wp(80),
                                        //marginLeft:wp('18'),
                                        //marginTop:hp(5),
                                        //backgroundColor:'yellow',
                                    }}
                                    data={this.state.vendorExitListData}
                                    renderItem={(item) => this.VendorExitList(item)}
                                    //keyExtractor={item => item.id}
                                />

                                <View
                                    style={{
                                        //backgroundColor:'yellow',
                                        height:hp(4),
                                        alignSelf:'center',
                                        justifyContent:'center'
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor:'#D3D3D3',
                                            width:wp(90),
                                            height:hp(0.2),
                                            alignSelf:'center',
                                        }}
                                    />
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', alignSelf:'center', marginBottom:hp(2)}}>
                                    <View style={{width:wp(80), flex:1}}>
                                        <Text style={{
                                            fontSize:20,
                                            color: base.theme.colors.black
                                        }}>Kid Exit</Text>
                                    </View>

                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#45B591', false: '#EF3939'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=>this.kidExitValueOff()}
                                        //onValueChange = {()=> this.setState({kidExit: !this.state.kidExit})}
                                        value = {this.state.kidExit}
                                    />
                                </View>

                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    style={{
                                        width:wp(80),
                                        //marginLeft:wp('18'),
                                        //marginTop:hp(5),
                                        //backgroundColor:'yellow',
                                    }}
                                    data={this.state.KidExitList}
                                    renderItem={(item) => this.KidExit(item)}
                                    //keyExtractor={item => item.id}
                                />

                                <View
                                    style={{
                                        //backgroundColor:'yellow',
                                        height:hp(4),
                                        alignSelf:'center',
                                        justifyContent:'center'
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor:'#D3D3D3',
                                            width:wp(90),
                                            height:hp(0.2),
                                            alignSelf:'center',
                                        }}
                                    />
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', marginBottom:hp(2)}}>
                                    <Text style={{
                                        fontSize:20,
                                        color: base.theme.colors.black
                                    }}>Service Provider/Staff</Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#45B591', false: '#EF3939'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=>this.serviceValueOff()}
                                        //onValueChange = {()=> this.setState({Service: !this.state.Service})}
                                        value = {this.state.Service}
                                    />

                                </View>

                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    style={{
                                        width:wp(80),
                                        //marginLeft:wp('18'),
                                        //marginTop:hp(5),
                                        //backgroundColor:'yellow',
                                    }}
                                    data={this.state.serviceList}
                                    renderItem={(item) => this.service(item)}
                                    //keyExtractor={item => item.id}
                                />

                                <View
                                    style={{
                                        //backgroundColor:'yellow',
                                        height:hp(4),
                                        alignSelf:'center',
                                        justifyContent:'center'
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor:'#D3D3D3',
                                            width:wp(90),
                                            height:hp(0.2),
                                            alignSelf:'center',
                                        }}
                                    />
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', marginBottom:hp(2)}}>
                                    <Text style={{
                                        fontSize:20,
                                        color: base.theme.colors.black
                                    }}>Surprise Guest</Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#45B591', false: '#EF3939'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=>this.guestValueOff()}
                                        //onValueChange = {()=> this.setState({guestValue: !this.state.guestValue})}
                                        value = {this.state.guestValue}
                                    />
                                </View>


                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    style={{
                                        width:wp(80),
                                        //marginLeft:wp('18'),
                                        //marginTop:hp(5),
                                        //backgroundColor:'yellow',
                                    }}
                                    data={this.state.guestList}
                                    renderItem={(item) => this.guest(item)}
                                    //keyExtractor={item => item.id}
                                />


                                <View
                                    style={{
                                        //backgroundColor:'yellow',
                                        height:hp(4),
                                        alignSelf:'center',
                                        justifyContent:'center'
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor:'#D3D3D3',
                                            width:wp(90),
                                            height:hp(0.2),
                                            alignSelf:'center',
                                        }}
                                    />
                                </View>


                                <View style={{ flexDirection:'row' , alignItems:'center', marginBottom:hp(2)}}>
                                    <Text style={{
                                        fontSize:20,
                                        color: base.theme.colors.black
                                    }}>Broadcast</Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#45B591', false: '#EF3939'}}
                                        thumbTintColor="white"
                                        onValueChange = {(value)=>this.broadcastValueOff(value)}
                                        //onValueChange = {()=> this.setState({vendorSwitchValue: !this.state.vendorSwitchValue})}
                                        value = {this.state.broadcastValue}
                                    />
                                </View>

                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    style={{
                                        width:wp(80),
                                        //marginLeft:wp('18'),
                                        //marginTop:hp(5),
                                        //backgroundColor:'yellow',
                                    }}
                                    data={this.state.broadcastList}
                                    renderItem={(item) => this.broadcast(item)}
                                    //keyExtractor={item => item.id}
                                />

                                <View
                                    style={{
                                        //backgroundColor:'yellow',
                                        height:hp(4),
                                        alignSelf:'center',
                                        justifyContent:'center'
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor:'#D3D3D3',
                                            width:wp(90),
                                            height:hp(0.2),
                                            alignSelf:'center',
                                        }}
                                    />
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', }}>
                                    <Text style={{
                                        fontSize:20,
                                        color: base.theme.colors.black
                                    }}>Invoice & Receipts</Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#45B591', false: '#EF3939'}}
                                        thumbTintColor="white"
                                        onValueChange = {(value)=>this.InvoiceValueOff(value)}
                                        //onValueChange = {()=> this.setState({InvoiceValue: !this.state.InvoiceValue})}
                                        value = {this.state.InvoiceValue}
                                    />
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', marginTop:hp(2),marginBottom:hp(1)}}>
                                    <Text style={{color: base.theme.colors.black}}>Invoices Generated </Text>
                                </View>

                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    style={{
                                        width:wp(80),
                                        //marginLeft:wp('18'),
                                        //marginTop:hp(5),
                                        //backgroundColor:'yellow',
                                    }}
                                    data={this.state.invoiceGeneratedList}
                                    renderItem={(item) => this.invoiceGenerated(item)}
                                    //keyExtractor={item => item.id}
                                />




                                <View style={{ flexDirection:'row' , alignItems:'center', marginTop:hp(2),marginBottom:hp(1)}}>
                                    <Text style={{color: base.theme.colors.black}}>Invoices Due </Text>
                                </View>

                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    style={{
                                        width:wp(80),
                                        //marginLeft:wp('18'),
                                        //marginTop:hp(5),
                                        //backgroundColor:'yellow',
                                    }}
                                    data={this.state.invoiceDueList}
                                    renderItem={(item) => this.invoiceDue(item)}
                                    //keyExtractor={item => item.id}
                                />


                                <View style={{ flexDirection:'row' , alignItems:'center', marginTop:hp(2),marginBottom:hp(1)}}>
                                    <Text style={{color: base.theme.colors.black}}>Receipts Generated </Text>
                                </View>

                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    style={{
                                        width:wp(80),
                                        //marginLeft:wp('18'),
                                        //marginTop:hp(5),
                                        //backgroundColor:'yellow',
                                    }}
                                    data={this.state.receiptsGeneratedList}
                                    renderItem={(item) => this.receiptGenerated(item)}
                                    //keyExtractor={item => item.id}
                                />


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
