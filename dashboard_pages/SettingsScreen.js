import React, {Component} from 'react';
import {FlatList, Image, Platform, ScrollView, Switch, Text, TouchableOpacity, View} from 'react-native';
import base from '../src/base';
import {connect} from 'react-redux';
import ElevatedView from "react-native-elevated-view";
import ToggleSwitch from 'toggle-switch-react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

class SettingsScreen extends Component {
    constructor(props){
        super(props);
        this.state={
            myfamily11:[],
            familyData:[],
            vendorSwitchValue:false,
            inAppRequest: false,
            inAppNotification: false,
            ivr:false,
            telegram:false,
            sms: false,
            inAppRequestExit:false,
            inAppNotificationExit:false,
            ivrExit:false,
            telegramExit:false,
            smsExit:false,
            sideBarData:[{name:"Notification Settings",id:0,isSelected:false},{name:"SOS",id:1,isSelected: false}],
            vendorListData: [
                {title:"In-App Request", id:0, isSelected:false},
                {title:"In-App Notification", id:1, isSelected:false},
                {title:"IVR Call Request", id:2, isSelected:false},
                {title:"Telegram Notification", id:3, isSelected:false},
                {title:"SMS", id:4, isSelected:false},
            ],

            vendorExitListData: [
                {title:"In-App Request", id:0, isSelected:false},
                {title:"In-App Notification", id:1, isSelected:false},
                {title:"IVR Call Request", id:2, isSelected:false},
                {title:"Telegram Notification", id:3, isSelected:false},
                {title:"SMS", id:4, isSelected:false},
            ],

            KidExitList: [
                {title:"In-App Request", id:0, isSelected:false},
                {title:"In-App Notification", id:1, isSelected:false},
                {title:"IVR Call Request", id:2, isSelected:false},
                {title:"Telegram Notification", id:3, isSelected:false},
                {title:"SMS", id:4, isSelected:false},
            ],

            serviceList: [
                {title:"In-App Notification", id:1, isSelected:false},
                {title:"Telegram Notification", id:3, isSelected:false},
            ],

            kidExit:false,
            inAppRequestKid:false,
            inAppNotificationEid:false,
            ivrKid:false,
            telegramKid:false,
            smsKid:false,
            Service:false,
            notificationService:false,
            telegramService:false,
            guestValue:false,
            inAppRequestGuest:false,
            inAppNotificationGuest:false,
            ivrGuest:false,
            telegramGuest:false,
            smsGuest:false,
            notificationBroadcast:false,
            telegramBroadcast:false,
            InvoiceValue:false,
            notificationInvoice:false,
            telegramInvoices:false,
            notificationInvoiceDue:false,
            telegramInvoicesDue:false,
            notificationReceipts:false,
            telegramInvoicesReceipts:false,

            setting:true,
            sos:false,
            isSelected:0,
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
                this.setState({
                    myfamily11: myFamilyList.data.familyMembers.sort((a, b) =>
                        a.fmName > b.fmName ? 1 : -1
                    ),
                    clonedList: myFamilyList.data.familyMembers.sort((a, b) =>
                        a.fmName > b.fmName ? 1 : -1
                    )
                });
                this.setState({familyData: myFamilyList});
            } else {
                this.showAlert(stat.error.message, true);
            }
        } catch (error) {
            base.utils.logger.log(error);
            this.setState({error, loading: false});
            const {updateIdDashboard} = this.props;
        }
    }

    renderTopViews(item){
        console.log("item ", item);
        console.log("data>> ", item.item.fmlName)
        return(

            <View
                //elevation={8}
                style={{
                    // borderTopLeftRadius:5,
                    // borderTopRightRadius:5,
                    // width:wp(20),
                    // height:hp(4),
                    // marginRight:wp('2'),
                    // alignItems:'center',
                    // justifyContent:'center',


                    borderTopLeftRadius:5,
                    borderTopRightRadius:5,
                    width:wp(20),
                    height:hp(4),
                    marginRight:wp('5'),
                    borderColor: base.theme.colors.shadedWhite,
                    //shadowColor: base.theme.colors.darkgrey,
                    shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 1},
                    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.8,
                    shadowRadius:Platform.OS === 'ios' ? 2: 1, elevation: 5,  borderWidth: 0.5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:base.theme.colors.white
                }}
            >
                <Text>
                    {item.item.fmlName}
                </Text>
            </View>
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

    vendorToggle(item){
        console.log(">>>>>",item)

        let setData=this.state.vendorListData;
        for(let i=0;i<setData.length;i++){
            if (item.item.id === i){
                setData[i].isSelected= !setData[i].isSelected
            }
        }
        this.setState({
            vendorListData:setData
        })
    }

    vendorExitToggle(item){
        console.log(">>>>>",item)

        let setData=this.state.vendorExitListData;
        for(let i=0;i<setData.length;i++){
            if (item.item.id === i){
                setData[i].isSelected= !setData[i].isSelected
            }
        }
        this.setState({
            vendorExitListData:setData
        })
    }

    KidExitToggle(item){
        console.log(">>>>>",item);

        let setData=this.state.KidExitList;
        for(let i=0;i<setData.length;i++){
            if (item.item.id === i){
                setData[i].isSelected= !setData[i].isSelected
            }
        }
        this.setState({
            KidExitList:setData
        })
    }

    serviceToggle(item){
        console.log(">>>>>",item);

        let setData=this.state.serviceList;
        for(let i=0;i<setData.length;i++){
            if (item.item.id === i){
                setData[i].isSelected= !setData[i].isSelected
            }
        }
        this.setState({
            serviceList:setData
        })
    }



    renderSideBar(item){
        console.log("renderSideBar ",item);
        let id= item.item.id;
        return(
            <TouchableOpacity
                onPress={()=> this.changeTheScreen(item)}
            >
                <ElevatedView
                    elevation={3}
                    style={{
                        marginTop:hp(6),
                        borderTopLeftRadius:5,
                        borderBottomLeftRadius:5,
                        height:wp(40),
                        width:wp(7),
                        alignItems:'center',
                        justifyContent:'center',
                        backgroundColor: item.item.isSelected ? "white" : "F5F5F5"
                        //backgroundColor: (!this.state.setting ? "#F5F5F5" : "white"),
                        //backgroundColor: this.state.setting ? "#F5F5F5" : "white"
                    }}
                >
                    <View style={{
                        alignItems:'center',
                        justifyContent:'center',
                        //backgroundColor:'yellow',
                        //height:hp(10),
                        width:wp(40),
                        transform: [{ rotate: '-90deg'}]
                    }}>
                        <Text>
                            {item.item.name}
                        </Text>
                    </View>
                </ElevatedView>
            </TouchableOpacity>
        )
    }

    VendorList(item){
        console.log("item ",item);
        return(
            <View style={{ flexDirection:'row' ,alignSelf:'center', alignItems:'center',}}>
                <View style={{width:wp(80), flex:1}}>
                    <Text>
                        {item.item.title}
                    </Text>
                </View>
                <View
                    style={{
                        //backgroundColor:'yellow',
                        flex:1,
                        alignItems:'flex-end',
                        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }]
                    }}
                >
                    <ToggleSwitch
                        isOn={item.item.isSelected}
                        onColor="#FFB400"
                        offColor="grey"
                        size="small"
                        onToggle={isOn => this.vendorToggle(item)}
                    />
                </View>

            </View>
        )
    }

    VendorExitList(item){
        console.log("item ",item);
        return(
            <View style={{ flexDirection:'row' ,alignSelf:'center', alignItems:'center',}}>
                <View style={{width:wp(80), flex:1}}>
                    <Text>
                        {item.item.title}
                    </Text>
                </View>
                <View
                    style={{
                        //backgroundColor:'yellow',
                        flex:1,
                        alignItems:'flex-end',
                        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }]
                    }}
                >
                    <ToggleSwitch
                        isOn={item.item.isSelected}
                        onColor="#FFB400"
                        offColor="grey"
                        size="small"
                        onToggle={isOn => this.vendorExitToggle(item)}
                    />
                </View>

            </View>
        )
    }

    KidExit(item){
        console.log("item ",item);
        return(
            <View style={{ flexDirection:'row' ,alignSelf:'center', alignItems:'center',}}>
                <View style={{width:wp(80), flex:1}}>
                    <Text>
                        {item.item.title}
                    </Text>
                </View>
                <View
                    style={{
                        //backgroundColor:'yellow',
                        flex:1,
                        alignItems:'flex-end',
                        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }]
                    }}
                >
                    <ToggleSwitch
                        isOn={item.item.isSelected}
                        onColor="#FFB400"
                        offColor="grey"
                        size="small"
                        onToggle={isOn => this.KidExitToggle(item)}
                    />
                </View>

            </View>
        )
    }

    service(item){
        console.log("item ",item);
        return(
            <View style={{ flexDirection:'row' ,alignSelf:'center', alignItems:'center',}}>
                <View style={{width:wp(80), flex:1}}>
                    <Text>
                        {item.item.title}
                    </Text>
                </View>
                <View
                    style={{
                        //backgroundColor:'yellow',
                        flex:1,
                        alignItems:'flex-end',
                        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }]
                    }}
                >
                    <ToggleSwitch
                        isOn={item.item.isSelected}
                        onColor="#FFB400"
                        offColor="grey"
                        size="small"
                        onToggle={isOn => this.serviceToggle(item)}
                    />
                </View>

            </View>
        )
    }

    render(){
        //console.log("userReducer", userReducer);
        return(
            <View style={{flex:1}}>
                <ScrollView>

                    <View
                        style={{
                            //backgroundColor:'#aaa',
                            flexDirection:'row',
                            marginTop:hp(5),
                        }}
                    >
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            style={{
                                width:wp(60),
                                marginLeft:wp('18'),
                                //marginTop:hp(5),
                                //backgroundColor:'yellow',
                            }}
                            horizontal={true}
                            data={this.state.myfamily11}
                            renderItem={(item) => this.renderTopViews(item)}
                            //keyExtractor={item => item.id}
                        />

                        <ElevatedView
                            elevation={3}
                            style={{
                                borderTopLeftRadius:5,
                                borderTopRightRadius:5,
                                width:wp(10),
                                height:hp(4),
                                marginRight:wp('5'),
                                alignItems:'center',
                                justifyContent:'center',
                            }}
                        >
                            <TouchableOpacity onPress={()=> this.props.navigation.navigate("MyFamily")}>
                                <Image
                                    resizeMode="contain"
                                    source={require('../icons/add.png')}
                                    style={{
                                        height:hp(2.5)
                                    }}
                                />
                            </TouchableOpacity>
                        </ElevatedView>

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

                            {/*<ElevatedView
                            elevation={3}
                            style={{
                                marginTop:hp(6),
                                borderTopLeftRadius:5,
                                borderBottomLeftRadius:5,
                                height:wp(40),
                                width:wp(7),
                                alignItems:'center',
                                justifyContent:'center',
                            }}
                        >
                            <View style={{
                                alignItems:'center',
                                justifyContent:'center',
                                //backgroundColor:'yellow',
                                //height:hp(10),
                                width:wp(40),
                                transform: [{ rotate: '-90deg'}]
                            }}>
                                <Text >
                                    Notification Settings
                                </Text>
                            </View>

                        </ElevatedView>

                        <ElevatedView
                            elevation={3}
                            style={{
                                marginTop:hp(8),
                                borderTopLeftRadius:5,
                                borderBottomLeftRadius:5,
                                height:wp(16),
                                width:wp(7),
                                alignItems:'center',
                                justifyContent:'center',
                            }}
                        >
                            <View style={{
                                alignItems:'center',
                                justifyContent:'center',
                                //backgroundColor:'yellow',
                                //height:hp(10),
                                width:wp(10),
                                transform: [{ rotate: '-90deg'}]
                            }}>
                                <Text >
                                    SOS
                                </Text>
                            </View>

                        </ElevatedView>*/}

                        </View>

                        <ElevatedView
                            elevation={8}
                            style={{
                                borderTopLeftRadius:20,
                                flex:1,
                                width:wp(80),
                                paddingTop:hp(5),
                                //paddingLeft:wp(8),
                                //paddingRight:wp(8),
                            }}
                        >
                            <View style={{
                                marginLeft:wp(8),
                                marginRight:wp(8)
                            }}>

                                <View style={{ flexDirection:'row' , alignItems:'center', }}>
                                    <Text style={{
                                        fontSize:20,
                                    }}>Vendors/Deliveries</Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            //alignSelf:'flex-end',
                                            transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#45B591', false: 'grey'}}
                                        thumbTintColor="white"
                                        //onValueChange = {(value)=>this.toggleSwitch(value)}
                                        onValueChange = {()=> this.setState({vendorSwitchValue: !this.state.vendorSwitchValue})}
                                        value = {this.state.vendorSwitchValue}
                                    />
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', marginTop:hp(2)}}>
                                    <Text>Entry</Text>
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


                                {/*<View style={{ flexDirection:'row' , alignItems:'center', width:wp(80)}}>
                            <Text>
                                In-App Request
                            </Text>
                            <View
                                style={{
                                    backgroundColor:'yellow',
                                    flex:1,
                                    alignItems:'flex-end',
                                    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }]
                                }}
                            >
                                <ToggleSwitch
                                    isOn={this.state.inAppRequest}
                                    onColor="#FFB400"
                                    offColor="grey"
                                    //label="Example label"
                                    //labelStyle={{ color: "black", fontWeight: "900" }}
                                    size="small"
                                    onToggle={isOn => this.setState({inAppRequest: !this.state.inAppRequest})}
                                />
                            </View>

                        </View>

                        <View style={{ flexDirection:'row' , alignItems:'center', width:wp(80)}}>
                            <Text>
                                In-App Notification
                            </Text>
                            <View
                                style={{
                                    backgroundColor:'yellow',
                                    flex:1,
                                    alignItems:'flex-end',
                                    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }]
                                }}
                            >
                                <ToggleSwitch
                                    isOn={this.state.inAppNotification}
                                    onColor="#FFB400"
                                    offColor="grey"
                                    //label="Example label"
                                    //labelStyle={{ color: "black", fontWeight: "900" }}
                                    size="small"
                                    onToggle={isOn => this.setState({inAppNotification: !this.state.inAppNotification})}
                                />
                            </View>

                        </View>

                        <View style={{ flexDirection:'row' , alignItems:'center', }}>
                            <Text>
                                ivr Call Request
                            </Text>
                            <Switch
                                style={{
                                    flex:1,
                                    alignSelf:'flex-end',
                                    //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                }}
                                trackColor={{true: '#FFB400', false: 'grey'}}
                                thumbTintColor="white"
                                onValueChange = {()=> this.setState({ivr: !this.state.ivr})}
                                value = {this.state.ivr}
                            />
                        </View>

                        <View style={{ flexDirection:'row' , alignItems:'center', }}>
                            <Text>
                                Telegram Notification
                            </Text>
                            <Switch
                                style={{
                                    flex:1,
                                    alignSelf:'flex-end',
                                    //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                }}
                                trackColor={{true: '#FFB400', false: 'grey'}}
                                thumbTintColor="white"
                                onValueChange = {()=> this.setState({telegram: !this.state.telegram})}
                                value = {this.state.telegram}
                            />
                        </View>

                        <View style={{ flexDirection:'row' , alignItems:'center', }}>
                            <Text>
                                SMS
                            </Text>
                            <Switch
                                style={{
                                    flex:1,
                                    alignSelf:'flex-end',
                                    //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                }}
                                trackColor={{true: '#FFB400', false: 'grey'}}
                                thumbTintColor="white"
                                onValueChange = {()=> this.setState({sms: !this.state.sms})}
                                value = {this.state.sms}
                            />
                        </View>*/}

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

                                <View style={{ flexDirection:'row' , alignItems:'center', }}>
                                    <Text>Exit</Text>
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



                                {/*<View style={{ flexDirection:'row' , alignItems:'center', }}>
                            <Text>
                                In-App Request
                            </Text>
                            <Switch
                                style={{
                                    flex:1,
                                    alignSelf:'flex-end',
                                    //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                }}
                                trackColor={{true: '#FFB400', false: 'grey'}}
                                thumbTintColor="white"
                                onValueChange = {()=> this.setState({inAppRequestExit: !this.state.inAppRequestExit})}
                                value = {this.state.inAppRequestExit}
                            />
                        </View>

                        <View style={{ flexDirection:'row' , alignItems:'center', }}>
                            <Text>
                                In-App Notification
                            </Text>
                            <Switch
                                style={{
                                    flex:1,
                                    alignSelf:'flex-end',
                                    //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                }}
                                trackColor={{true: '#FFB400', false: 'grey'}}
                                thumbTintColor="white"
                                onValueChange = {()=> this.setState({inAppNotificationExit: !this.state.inAppNotificationExit})}
                                value = {this.state.inAppNotificationExit}
                            />
                        </View>

                        <View style={{ flexDirection:'row' , alignItems:'center', }}>
                            <Text>
                                ivr Call Request
                            </Text>
                            <Switch
                                style={{
                                    flex:1,
                                    alignSelf:'flex-end',
                                    //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                }}
                                trackColor={{true: '#FFB400', false: 'grey'}}
                                thumbTintColor="white"
                                onValueChange = {()=> this.setState({ivrExit: !this.state.ivrExit})}
                                value = {this.state.ivrExit}
                            />
                        </View>

                        <View style={{ flexDirection:'row' , alignItems:'center', }}>
                            <Text>
                                Telegram Notification
                            </Text>
                            <Switch
                                style={{
                                    flex:1,
                                    alignSelf:'flex-end',
                                    //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                }}
                                trackColor={{true: '#FFB400', false: 'grey'}}
                                thumbTintColor="white"
                                onValueChange = {()=> this.setState({telegramExit: !this.state.telegramExit})}
                                value = {this.state.telegramExit}
                            />
                        </View>

                        <View style={{ flexDirection:'row' , alignItems:'center', }}>
                            <Text>
                                SMS
                            </Text>
                            <Switch
                                style={{
                                    flex:1,
                                    alignSelf:'flex-end',
                                    //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                }}
                                trackColor={{true: '#FFB400', false: 'grey'}}
                                thumbTintColor="white"
                                onValueChange = {()=> this.setState({smsExit: !this.state.smsExit})}
                                value = {this.state.smsExit}
                            />
                        </View>*/}

                                <View
                                    style={{
                                        //backgroundColor:'yellow',
                                        height:hp(5),
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

                                <View style={{ flexDirection:'row' , alignItems:'center', alignSelf:'center', backgroundColor:'yellow'}}>
                                    <View style={{width:wp(80), flex:1}}>
                                    <Text style={{
                                        fontSize:20
                                    }}>Kid Exit</Text>
                                    </View>

                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#45B591', false: 'grey'}}
                                        thumbTintColor="white"
                                        //onValueChange = {(value)=>this.toggleSwitch(value)}
                                        onValueChange = {()=> this.setState({kidExit: !this.state.kidExit})}
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

                                {/*<View style={{ flexDirection:'row' , alignItems:'center', marginTop:hp(2),}}>
                                    <Text>
                                        In-App Request
                                    </Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#FFB400', false: 'grey'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=> this.setState({inAppRequestKid: !this.state.inAppRequestKid})}
                                        value = {this.state.inAppRequestKid}
                                    />
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', }}>
                                    <Text>
                                        In-App Notification
                                    </Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#FFB400', false: 'grey'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=> this.setState({inAppNotificationEid: !this.state.inAppNotificationEid})}
                                        value = {this.state.inAppNotificationEid}
                                    />
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', }}>
                                    <Text>
                                        ivr Call Request
                                    </Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#FFB400', false: 'grey'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=> this.setState({ivrKid: !this.state.ivrKid})}
                                        value = {this.state.ivrKid}
                                    />
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', }}>
                                    <Text>
                                        Telegram Notification
                                    </Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#FFB400', false: 'grey'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=> this.setState({telegramKid: !this.state.telegramKid})}
                                        value = {this.state.telegramKid}
                                    />
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', }}>
                                    <Text>
                                        SMS
                                    </Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#FFB400', false: 'grey'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=> this.setState({smsKid: !this.state.smsKid})}
                                        value = {this.state.smsKid}
                                    />
                                </View>*/}

                                <View
                                    style={{
                                        //backgroundColor:'yellow',
                                        height:hp(5),
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
                                        fontSize:20
                                    }}>Service Provider/Staff</Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#45B591', false: 'grey'}}
                                        thumbTintColor="white"
                                        //onValueChange = {(value)=>this.toggleSwitch(value)}
                                        onValueChange = {()=> this.setState({Service: !this.state.Service})}
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

                                {/*<View style={{ flexDirection:'row' , alignItems:'center', marginTop:hp(2),}}>
                                    <Text>
                                        In-App Notification
                                    </Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#FFB400', false: 'grey'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=> this.setState({notificationService: !this.state.notificationService})}
                                        value = {this.state.notificationService}
                                    />
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', }}>
                                    <Text>
                                        Telegram Notification
                                    </Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#FFB400', false: 'grey'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=> this.setState({telegramService: !this.state.telegramService})}
                                        value = {this.state.telegramService}
                                    />
                                </View>*/}

                                <View
                                    style={{
                                        //backgroundColor:'yellow',
                                        height:hp(5),
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
                                        fontSize:20
                                    }}>Surprise Guest</Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#45B591', false: 'grey'}}
                                        thumbTintColor="white"
                                        //onValueChange = {(value)=>this.toggleSwitch(value)}
                                        onValueChange = {()=> this.setState({guestValue: !this.state.guestValue})}
                                        value = {this.state.guestValue}
                                    />
                                </View>



                                {/*<View style={{ flexDirection:'row' , alignItems:'center', marginTop:hp(2)}}>
                                    <Text>
                                        In-App Request
                                    </Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#FFB400', false: 'grey'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=> this.setState({inAppRequestGuest: !this.state.inAppRequestGuest})}
                                        value = {this.state.inAppRequestGuest}
                                    />
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', }}>
                                    <Text>
                                        In-App Notification
                                    </Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#FFB400', false: 'grey'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=> this.setState({inAppNotificationGuest: !this.state.inAppNotificationGuest})}
                                        value = {this.state.inAppNotificationGuest}
                                    />
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', }}>
                                    <Text>
                                        ivr Call Request
                                    </Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#FFB400', false: 'grey'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=> this.setState({ivrGuest: !this.state.ivrGuest})}
                                        value = {this.state.ivrGuest}
                                    />
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', }}>
                                    <Text>
                                        Telegram Notification
                                    </Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#FFB400', false: 'grey'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=> this.setState({telegramGuest: !this.state.telegramGuest})}
                                        value = {this.state.telegramGuest}
                                    />
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', }}>
                                    <Text>
                                        SMS
                                    </Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#FFB400', false: 'grey'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=> this.setState({smsGuest: !this.state.smsGuest})}
                                        value = {this.state.smsGuest}
                                    />
                                </View>*/}

                                <View
                                    style={{
                                        //backgroundColor:'yellow',
                                        height:hp(5),
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
                                        fontSize:20
                                    }}>Broadcast</Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#EF3939', false: 'grey'}}
                                        thumbTintColor="white"
                                        //onValueChange = {(value)=>this.toggleSwitch(value)}
                                        onValueChange = {()=> this.setState({vendorSwitchValue: !this.state.vendorSwitchValue})}
                                        value = {this.state.vendorSwitchValue}
                                    />
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', marginTop:hp(2),}}>
                                    <Text>
                                        In-App Notification
                                    </Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#FFB400', false: 'grey'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=> this.setState({notificationBroadcast: !this.state.notificationBroadcast})}
                                        value = {this.state.notificationBroadcast}
                                    />
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', }}>
                                    <Text>
                                        Telegram Notification
                                    </Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#FFB400', false: 'grey'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=> this.setState({telegramBroadcast: !this.state.telegramBroadcast})}
                                        value = {this.state.telegramBroadcast}
                                    />
                                </View>

                                <View
                                    style={{
                                        //backgroundColor:'yellow',
                                        height:hp(5),
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
                                        fontSize:20
                                    }}>Invoice & Receipts</Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#45B591', false: 'grey'}}
                                        thumbTintColor="white"
                                        //onValueChange = {(value)=>this.toggleSwitch(value)}
                                        onValueChange = {()=> this.setState({InvoiceValue: !this.state.InvoiceValue})}
                                        value = {this.state.InvoiceValue}
                                    />
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', marginTop:hp(2)}}>
                                    <Text>Invoices Generated </Text>
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center',}}>
                                    <Text>
                                        In-App Notification
                                    </Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#FFB400', false: 'grey'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=> this.setState({notificationInvoice: !this.state.notificationInvoice})}
                                        value = {this.state.notificationInvoice}
                                    />
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', }}>
                                    <Text>
                                        Telegram Notification
                                    </Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#FFB400', false: 'grey'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=> this.setState({telegramInvoices: !this.state.telegramInvoices})}
                                        value = {this.state.telegramInvoices}
                                    />
                                </View>




                                <View style={{ flexDirection:'row' , alignItems:'center', marginTop:hp(2)}}>
                                    <Text>Invoices Due </Text>
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center',}}>
                                    <Text>
                                        In-App Notification
                                    </Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#FFB400', false: 'grey'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=> this.setState({notificationInvoiceDue: !this.state.notificationInvoiceDue})}
                                        value = {this.state.notificationInvoiceDue}
                                    />
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', }}>
                                    <Text>
                                        Telegram Notification
                                    </Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#FFB400', false: 'grey'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=> this.setState({telegramInvoicesDue: !this.state.telegramInvoicesDue})}
                                        value = {this.state.telegramInvoicesDue}
                                    />
                                </View>






                                <View style={{ flexDirection:'row' , alignItems:'center', marginTop:hp(2)}}>
                                    <Text>Receipts Generated </Text>
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center',}}>
                                    <Text>
                                        In-App Notification
                                    </Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#FFB400', false: 'grey'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=> this.setState({notificationReceipts: !this.state.notificationReceipts})}
                                        value = {this.state.notificationReceipts}
                                    />
                                </View>

                                <View style={{ flexDirection:'row' , alignItems:'center', }}>
                                    <Text>
                                        Telegram Notification
                                    </Text>
                                    <Switch
                                        style={{
                                            flex:1,
                                            alignSelf:'flex-end',
                                            //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                        }}
                                        trackColor={{true: '#FFB400', false: 'grey'}}
                                        thumbTintColor="white"
                                        onValueChange = {()=> this.setState({telegramInvoicesReceipts: !this.state.telegramInvoicesReceipts})}
                                        value = {this.state.telegramInvoicesReceipts}
                                    />
                                </View>



                            </View>
                        </ElevatedView>
                    </View>

                </ScrollView>
            </View>
        )
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