
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
            myFamilyList: [],
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
            broadcastValue: false,
            headValue: false,


            newData:[],
            sampleDataList: [
                {
                    "data": {
                        "notificationSettingsTypes": [
                            {
                                "ncid": 1,
                                "nsCategory": "Vendors/Deliveries Entry",
                                "notificationSettings": [
                                    {
                                        "nsid": 1,
                                        "nsCategory": "Vendors/Deliveries Entry",
                                        "nsType": "In-App Requests",
                                        "nsdCreated": "2019-12-19T00:00:00",
                                        "nsIsActive": false
                                    },
                                    {
                                        "nsid": 2,
                                        "nsCategory": "Vendors/Deliveries Entry",
                                        "nsType": "In-App Notifications",
                                        "nsdCreated": "2019-12-19T00:00:00",
                                        "nsIsActive": false
                                    },
                                    {
                                        "nsid": 3,
                                        "nsCategory": "Vendors/Deliveries Entry",
                                        "nsType": "IVR Call Request",
                                        "nsdCreated": "2019-12-19T00:00:00",
                                        "nsIsActive": false
                                    },
                                    {
                                        "nsid": 4,
                                        "nsCategory": "Vendors/Deliveries Entry",
                                        "nsType": "Telegram Notifications",
                                        "nsdCreated": "2019-12-19T00:00:00",
                                        "nsIsActive": false
                                    },
                                    {
                                        "nsid": 5,
                                        "nsCategory": "Vendors/Deliveries Entry",
                                        "nsType": "SMS",
                                        "nsdCreated": "2019-12-19T00:00:00",
                                        "nsIsActive": false
                                    }
                                ]
                            },
                            {
                                "ncid": 2,
                                "nsCategory": "Vendors/Deliveries Exit",
                                "notificationSettings": [
                                    {
                                        "nsid": 6,
                                        "nsCategory": "Vendors/Deliveries Exit",
                                        "nsType": "In-App Requests",
                                        "nsdCreated": "2019-12-19T00:00:00",
                                        "nsIsActive": false
                                    },
                                    {
                                        "nsid": 7,
                                        "nsCategory": "Vendors/Deliveries Exit",
                                        "nsType": "In-App Notifications",
                                        "nsdCreated": "2019-12-19T00:00:00",
                                        "nsIsActive": false
                                    },
                                    {
                                        "nsid": 8,
                                        "nsCategory": "Vendors/Deliveries Exit",
                                        "nsType": "IVR Call Request",
                                        "nsdCreated": "2019-12-19T00:00:00",
                                        "nsIsActive": false
                                    },
                                    {
                                        "nsid": 9,
                                        "nsCategory": "Vendors/Deliveries Exit",
                                        "nsType": "Telegram Notifications",
                                        "nsdCreated": "2019-12-19T00:00:00",
                                        "nsIsActive": false
                                    },
                                    {
                                        "nsid": 10,
                                        "nsCategory": "Vendors/Deliveries Exit",
                                        "nsType": "SMS",
                                        "nsdCreated": "2019-12-19T00:00:00",
                                        "nsIsActive": false
                                    }
                                ]
                            }
                        ]
                    },
                    "apiVersion": "1.0",
                    "success": true
                }
            ],

            sampleDataList2: [
                {
                    id:4261,
                    name:'Jixy',
                    fmIsActive:true,
                    data:[
                        {
                            "data": {
                                "notificationSettingsTypes": [
                                    {
                                        "ncid": 1,
                                        "nsCategory": "Vendors/Deliveries Entry",
                                        "isActive":false,
                                        "notificationSettings": [
                                            {
                                                "nsid": 1,
                                                "nsCategory": "Vendors/Deliveries Entry",
                                                "nsType": "In-App Requests",
                                                "nsdCreated": "2019-12-19T00:00:00",
                                                "nsIsActive": false
                                            },
                                            {
                                                "nsid": 2,
                                                "nsCategory": "Vendors/Deliveries Entry",
                                                "nsType": "In-App Notifications",
                                                "nsdCreated": "2019-12-19T00:00:00",
                                                "nsIsActive": false
                                            },
                                            {
                                                "nsid": 3,
                                                "nsCategory": "Vendors/Deliveries Entry",
                                                "nsType": "IVR Call Request",
                                                "nsdCreated": "2019-12-19T00:00:00",
                                                "nsIsActive": false
                                            },
                                            {
                                                "nsid": 4,
                                                "nsCategory": "Vendors/Deliveries Entry",
                                                "nsType": "Telegram Notifications",
                                                "nsdCreated": "2019-12-19T00:00:00",
                                                "nsIsActive": false
                                            },
                                            {
                                                "nsid": 5,
                                                "nsCategory": "Vendors/Deliveries Entry",
                                                "nsType": "SMS",
                                                "nsdCreated": "2019-12-19T00:00:00",
                                                "nsIsActive": false
                                            }
                                        ]
                                    },
                                    {
                                        "ncid": 2,
                                        "nsCategory": "Vendors/Deliveries Exit",
                                        "isActive":false,
                                        "notificationSettings": [
                                            {
                                                "nsid": 6,
                                                "nsCategory": "Vendors/Deliveries Exit",
                                                "nsType": "In-App Requests",
                                                "nsdCreated": "2019-12-19T00:00:00",
                                                "nsIsActive": false
                                            },
                                            {
                                                "nsid": 7,
                                                "nsCategory": "Vendors/Deliveries Exit",
                                                "nsType": "In-App Notifications",
                                                "nsdCreated": "2019-12-19T00:00:00",
                                                "nsIsActive": false
                                            },
                                            {
                                                "nsid": 8,
                                                "nsCategory": "Vendors/Deliveries Exit",
                                                "nsType": "IVR Call Request",
                                                "nsdCreated": "2019-12-19T00:00:00",
                                                "nsIsActive": false
                                            },
                                            {
                                                "nsid": 9,
                                                "nsCategory": "Vendors/Deliveries Exit",
                                                "nsType": "Telegram Notifications",
                                                "nsdCreated": "2019-12-19T00:00:00",
                                                "nsIsActive": false
                                            },
                                            {
                                                "nsid": 10,
                                                "nsCategory": "Vendors/Deliveries Exit",
                                                "nsType": "SMS",
                                                "nsdCreated": "2019-12-19T00:00:00",
                                                "nsIsActive": false
                                            }
                                        ]
                                    }
                                ]
                            },
                            "apiVersion": "1.0",
                            "success": true
                        }
                    ],
                },
                {
                    id:4287,
                    name:'"HCL"',
                    fmIsActive:false,
                    data:[
                        {
                            "data": {
                                "notificationSettingsTypes": [
                                    {
                                        "ncid": 1,
                                        "nsCategory": "Vendors/Deliveries Entry",
                                        "isActive":false,
                                        "notificationSettings": [
                                            {
                                                "nsid": 1,
                                                "nsCategory": "Vendors/Deliveries Entry",
                                                "nsType": "In-App Requests",
                                                "nsdCreated": "2019-12-19T00:00:00",
                                                "nsIsActive": false
                                            },
                                            {
                                                "nsid": 2,
                                                "nsCategory": "Vendors/Deliveries Entry",
                                                "nsType": "In-App Notifications",
                                                "nsdCreated": "2019-12-19T00:00:00",
                                                "nsIsActive": false
                                            },
                                            {
                                                "nsid": 3,
                                                "nsCategory": "Vendors/Deliveries Entry",
                                                "nsType": "IVR Call Request",
                                                "nsdCreated": "2019-12-19T00:00:00",
                                                "nsIsActive": false
                                            },
                                            {
                                                "nsid": 4,
                                                "nsCategory": "Vendors/Deliveries Entry",
                                                "nsType": "Telegram Notifications",
                                                "nsdCreated": "2019-12-19T00:00:00",
                                                "nsIsActive": false
                                            },
                                            {
                                                "nsid": 5,
                                                "nsCategory": "Vendors/Deliveries Entry",
                                                "nsType": "SMS",
                                                "nsdCreated": "2019-12-19T00:00:00",
                                                "nsIsActive": false
                                            }
                                        ]
                                    },
                                ]
                            },
                            "apiVersion": "1.0",
                            "success": true
                        }
                    ],
                }
            ],

            sideBarData: [
                {name: "Notification Settings", id: 0, isSelected: true},
                {name: "SOS", id: 1, isSelected: false}
            ],

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

    componentDidMount() {

        let temp2 = this.state.sampleDataList2;
        console.log("sampleDataList2 ",this.state.sampleDataList2);
        console.log("temp2 ",temp2);
        console.log("notificationSettingsTypes ", temp2[0].data[0].data.notificationSettingsTypes);
        this.setState({
            newData : temp2[0].data[0].data.notificationSettingsTypes
        });

        this.getName(temp2)


        //this.myFamilyListGetData()

    }

    getName(item){
        let i;
        console.log("getName>>>item",item[0]);
        let list = {};
        for(i in item){
            console.log("getName>>>i ",i,item[i].id);
            let temp = item[i].id
            list.temp = item[i].name;
        }
        console.log("list ",list);
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
                console.log('::-> GET THE DATA', familyData);

                for (let i = 0; i < familyData.length; i++) {
                    if (this.props.MyAccountID === familyData[i].acAccntID) {
                        familyData[i].isFSelected = true;
                    } else {
                        familyData[i].isFSelected = false;
                    }
                }
                console.log('FAMILY DATA', familyData)

                this.setState({
                    myFamilyList: familyData.sort((a, b) =>
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
        console.log("renderTopViews>>>item ", item);
        console.log("renderTopViews>>>fmIsActive", item.item.fmIsActive);

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
                    elevation: 10,
                    borderWidth: 0.5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: item.item.fmIsActive ? base.theme.colors.white : base.theme.colors.greyCard,
                }}
                disabled={item.item.fmIsActive === true ? true : false}
                onPress={() => this.changeTheMember(item)}

            >
                <Text>
                    {item.item.name}
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

    guestToggle(item) {
        if (this.state.guestValue) {
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
        if (this.state.broadcastValue) {
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
                    width: wp(10),
                    marginTop: hp(6),
                    elevation: 10,
                    borderWidth: 0.5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: item.item.isSelected ? base.theme.colors.white : base.theme.colors.greyCard,

                }}
                disabled={item.item.isSelected}
                onPress={() => this.changeTheScreen(item)}

            >
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: wp(40),
                    transform: [{rotate: '-90deg'}]
                }}>
                    <Text style={{
                        fontSize: 14, color: base.theme.colors.black, paddingTop: hp('10'),
                        paddingBottom: hp('10')
                    }}>
                        {item.item.name}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    guest(item) {
        console.log("item ", item);
        return (
            <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginBottom: hp(0.5)}}>
                <View style={{width: wp(80), flex: 1}}>
                    <Text style={{
                        fontSize: 14,
                        color: base.theme.colors.notificationSecondaryTxtColor
                    }}>
                        {item.item.title}
                    </Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'flex-end',
                        right: wp(3),
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
            <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginBottom: hp(0.5)}}>
                <View style={{width: wp(80), flex: 1}}>
                    <Text style={{
                        fontSize: 14,
                        color: base.theme.colors.notificationSecondaryTxtColor
                    }}>
                        {item.item.title}
                    </Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'flex-end',
                        right: wp(3),
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
            <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginBottom: hp(0.5)}}>
                <View style={{width: wp(80), flex: 1}}>
                    <Text style={{
                        fontSize: 14,
                        color: base.theme.colors.notificationSecondaryTxtColor
                    }}>
                        {item.item.title}
                    </Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'flex-end',
                        right: wp(3),
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

    mainSwitchToggle(item){

        console.log("mainSwitchToggle>>>item ",item);
        console.log("mainSwitchToggle>>>item.",item.item.nsCategory)
        let setData = this.state.newData;
        let trueList=[];
        for (let i in setData) {
            if(setData[i].nsCategory === item.item.nsCategory){
                let j;
                for (j = 0; j < setData[i].notificationSettings.length; j++) {
                    console.log("setData[i] ", setData[i].notificationSettings);
                    trueList.push(setData[i].notificationSettings[j].nsIsActive);
                }
                console.log("trueList ",trueList);
                let temp = [...new Set(trueList)];
                console.log("temp-> ", temp.length, temp[0]);
                if(temp.length === 1 && temp[0] === false){
                    console.log("what: turn to TRUE [BEFORE]",setData[i]);
                    for (j = 0; j < setData[i].notificationSettings.length; j++) {
                        setData[i].notificationSettings[j].nsIsActive = true
                    }
                    this.setState({
                        newData : setData
                    });
                    console.log("what: turn to TRUE [after]",setData[i]);
                    return true;
                }
                else{
                    console.log("what: turn to TRUE [BEFORE]",setData[i]);
                    for (j = 0; j < setData[i].notificationSettings.length; j++) {
                        setData[i].notificationSettings[j].nsIsActive = false
                    }
                    this.setState({
                        newData : setData
                    });
                    console.log("what: turn to TRUE [after]",setData[i])
                    return false;
                }
            }
            //console.log("setData[i] ",setData[i].nsCategory);
        }


    }

    switchToggle(item){
        let setData = this.state.newData;
        console.log("switchToggle>item ", item);
        console.log("switchToggle>setData ",setData);
        let isTrue = true;
        let trueList=[];

        for (let i in setData) {
            if (item.item.nsCategory === setData[i].nsCategory){
                console.log("setData ",setData[i]);


                let j;
                // for(j=0; j<setData[i].notificationSettings.length; j++){
                //     console.log("setData[i].notificationSettings[j] ",setData[i].notificationSettings[j]);
                //     if (!setData[i].notificationSettings[j].nsIsActive){
                //         isTrue = false;
                //         break;
                //     }
                // }

                console.log("isTrue ",isTrue);
                for (j = 0; j < setData[i].notificationSettings.length; j++) {
                    console.log("setData[i] ",setData[i].notificationSettings[j].nsIsActive);
                    console.log("j>>> ",setData[i].notificationSettings[j].nsid,item.item.nsid);
                    console.log("fffff",setData[i].notificationSettings[j].nsid);

                    if (item.item.nsid === setData[i].notificationSettings[j].nsid){
                        console.log("INSIDE ",setData[i].notificationSettings[j])
                        setData[i].notificationSettings[j].nsIsActive = !setData[i].notificationSettings[j].nsIsActive
                    }
                }
                console.log("setData ", setData);



            }
            this.setState({
                newData : setData
            });
        }



    }

    renderSubSwitchList(item){
        console.log("renderSubSwitchList ",item.item);
        return(

            <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginBottom: hp(0.5)}}>
                <View style={{width: wp(80), flex: 1}}>
                    <Text style={{
                        fontSize: 14,
                        color: base.theme.colors.notificationSecondaryTxtColor
                    }}>
                        {item.item.nsType}
                    </Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'flex-end',
                        //right: wp(3),
                        transform: [{scaleX: 0.8}, {scaleY: 0.8}]
                    }}
                >
                    <ToggleSwitch
                        isOn={item.item.nsIsActive}
                        onColor="#FFB400"
                        offColor="#DCDCE5"
                        size="small"
                        onToggle={isOn => this.switchToggle(item)}
                    />
                </View>

            </View>
        )

    }

    renderNotificationSettingsItems(item){
        console.log(">>>>item: ", item);
        console.log(">>>> ", item.index);
        // for(let i in item.item.data.notificationSettingsTypes) {
        //     console.log("i>>>> ", i);
        // }


        return (
            <View>
                <View>
                    <View style={{
                        //backgroundColor:'yellow',
                        flex: 1,
                        flexDirection: 'row',
                    }}>
                        <View style={{
                            width: wp('80'),
                            flex: 1,
                            marginBottom:wp(2),
                        }}>
                            <Text style={{
                                fontSize: 20,
                                color: base.theme.colors.black
                            }}>{item.item.nsCategory}</Text>
                        </View>
                        <View style={{
                            width: wp('20'),
                        }}>
                            <Switch
                                style={{
                                    alignSelf: 'flex-end',
                                    transform: [{scaleX: Platform.OS === 'ios' ? 1 : 1.2}, {scaleY: Platform.OS === 'ios' ? 1 : 1.2}]
                                }}
                                trackColor={{
                                    true: base.theme.colors.whenMainSwitchOn,
                                    false: base.theme.colors.whenMainSwitchOff
                                }}
                                ios_backgroundColor={base.theme.colors.whenMainSwitchOff}
                                ios_backgroundColor={base.theme.colors.whenMainSwitchOff}
                                thumbTintColor="white"
                                onValueChange={() => {
                                    this.mainSwitchValue = this.mainSwitchToggle(item)
                                }
                                }
                                value={this.mainSwitchValue}
                                // value={ ()=>{
                                //     if (this.mainSwitchValue[1] === item.item.nsCategory){
                                //         this.mainSwitchValue[0]
                                //     }
                                // }
                                // }
                            />
                        </View>

                    </View>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        style={{
                            width:wp(80),
                        }}
                        data={item.item.notificationSettings}
                        renderItem={(item) => this.renderSubSwitchList(item)}
                    />

                </View>

                { this.state.newData.length !== 1 && this.state.newData.length-1 !== item.index &&
                <View
                    style={{
                        //position:'absolute',
                        width:wp(100),
                        height:hp(4),
                        alignSelf:'center',
                        justifyContent:'center'
                    }}
                >
                    <View
                        style={{

                            backgroundColor:'#D3D3D3',
                            width:wp(100),
                            height:hp(0.2),
                            //alignSelf:'center',
                        }}
                    />
                </View>

                }
            </View>
        )
    }

    render() {
        let sideBarData = this.state.sideBarData;
//let item = sampleDataList.item.item.data.notificationSettingsTypes
        return (
            <View style={{flex: 1}}>

                <ScrollView showsHorizontalScrollIndicator={false}>

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
                            data={this.state.sampleDataList2}
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


                    <View style={{flex:1,flexDirection:'row',}}>
                        <View style={{paddingLeft:wp(1)}}>

                            <FlatList
                                style={{
                                    height:wp(100),
                                }}
                                extraData={this.state}
                                data={this.state.sideBarData}
                                renderItem={(item) => this.renderSideBar(item)}
                            />

                        </View>

                        <View
                            style={{
                                borderTopLeftRadius:20,
                                flex:1,
                                height:hp(100),
                                width:wp(80),
                                paddingTop:hp(5),
                                borderWidth: 1,
                                backgroundColor: base.theme.colors.white,
                                shadowOpacity: Platform.OS === 'ios' ? 0.0015 * 8 + 0.18 : 0,
                                shadowRadius: Platform.OS === 'ios' ? 0.54 * 8 : 0,
                                shadowOffset: {
                                    height: Platform.OS === 'ios' ? 0.6 * 8 : 0,
                                },
                                shadowColor: base.theme.colors.greyHead,
                                borderColor: base.theme.colors.greyHead,
                                elevation:8,
                                //backgroundColor:'green',
                                alignItems:'center',
                            }}
                        >
                            {
                                sideBarData[0].isSelected ?


                                    < FlatList
                                        showsHorizontalScrollIndicator={false}
                                        style={{
                                            width:wp(80),
                                        }}
                                        data={this.state.newData}
                                        renderItem={(item) => this.renderNotificationSettingsItems(item)}
                                    />

                                    :
                                    <View>
                                        <Text>comming soon</Text>
                                    </View>
                            }
                        </View>

                    </View>

                </ScrollView>

            </View>
        )
    }

    /*changeTheMember(item) {
        let self = this;
        let familyData = self.state.myFamilyList;
        console.log('GET THE CHANGES IN ANDROID', item, familyData)

        for (let i = 0; i < familyData.length; i++) {
            console.log('GET THE ID', item.item.fmid, familyData[i].fmid)
            if (familyData[i].fmid === item.item.fmid) {
                console.log('GET THE ID1111', item.item.fmid, familyData[i].fmid)

                familyData[i].isFSelected = true
            } else {
                familyData[i].isFSelected = false
            }
            console.log("changeTheMember>>>familyData ",familyData);
            self.setState({
                myFamilyList: familyData

            })
        }
    }*/



    changeTheMember(item) {
        let self = this;
        let temp = this.state.sampleDataList2;
        console.log("changeTheMember>>>item ",item.item.data[0].data.notificationSettingsTypes);
        console.log("changeTheMember>>>sampleDataList2 ",this.state.sampleDataList2);
        console.log("changeTheMember>>>temp.. ",temp[0].data[0].data.notificationSettingsTypes);
        for (let i = 0; i < temp.length; i++){
            console.log("changeTheMember>>>temp[i] ",temp[i])
            if( item.item.id ===  temp[i].id){
                console.log("changeTheMember>>>: ", item.item.id, temp[i].id);
                temp[i].fmIsActive = true;
                this.setState({
                    sampleDataList2:temp,
                    newData : item.item.data[0].data.notificationSettingsTypes,
                })
            }
            else {
                    temp[i].fmIsActive = false
                }
        }

        console.log("newData ",this.state.newData);

        // let familyData = self.state.myFamilyList;
        // console.log('GET THE CHANGES IN ANDROID', item, familyData)
        //
        // for (let i = 0; i < familyData.length; i++) {
        //     console.log('GET THE ID', item.item.fmid, familyData[i].fmid)
        //     if (familyData[i].fmid === item.item.fmid) {
        //         console.log('GET THE ID1111', item.item.fmid, familyData[i].fmid)
        //         familyData[i].isFSelected = true
        //     } else {
        //         familyData[i].isFSelected = false
        //     }
        //     console.log("changeTheMember>>>familyData ",familyData);
        //     self.setState({
        //         myFamilyList: familyData
        //
        //     })
        // }
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
