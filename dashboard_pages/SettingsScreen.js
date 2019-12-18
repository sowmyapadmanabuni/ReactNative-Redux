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
    constructor(props){
        super(props);
        this.state={
            myfamily11:[],
            familyData:[],
            vendorSwitchValue:false,
            inAppRequest: false,
            inAppNotification: false,
            IVR:false,
            telegram:false,
            sms: false,
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
                 let familyData=myFamilyList.data.familyMembers;
                 console.log('GET THE DATA',familyData)

                for(let i=0; i<familyData.length;i++){
                    if(this.props.MyAccountID===familyData[i].acAccntID){
                        familyData[i].isFSelected=true;
                    }
                    else{
                        familyData[i].isFSelected=false;
                    }
                }
            console.log('FAMILY DATA',familyData)

                this.setState({
                    myfamily11:familyData.sort((a, b) =>
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

    renderTopViews(item){
        console.log("item ", item);
        console.log("data>> ", item.item.fmlName)
        return(

            <TouchableOpacity
                style={{
                    shadowOpacity: Platform.OS === 'ios' ?0.0015 * 10 + 0.18 :0,
                    shadowRadius:Platform.OS === 'ios' ? 0.54 * 10 :0,
                    shadowOffset: {
                        height: Platform.OS === 'ios' ? 0.6 * 10: 0,
                    },
                    borderTopLeftRadius:12,
                    borderTopRightRadius:12,
                    width:wp(25),
                    height:hp(5),
                    marginRight:wp('5'),
                    borderColor: base.theme.colors.greyHead,
                    shadowColor: base.theme.colors.greyHead,
                   // shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 0,},
                   // shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0,
                   // shadowRadius:Platform.OS === 'ios' ? 2: 0,
                    elevation: 10,
                    borderWidth:0.5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:item.item.isFSelected? base.theme.colors.white :base.theme.colors.greyHead,
                }}
                disabled={item.item.isFSelected}
                onPress={()=>this.changeTheMember(item)}

            >
                <Text>
                    {item.item.fmName}
                </Text>
            </TouchableOpacity>
        )
    }

    changeTheMember(item){
        let self=this;
        let familyData=self.state.myfamily11;
        console.log('GET THE CHANGES IN ANDROID',item,familyData)

        for (let i=0;i<familyData.length;i++){
            console.log('GET THE ID',item.item.fmid,familyData[i].fmid)
            if(familyData[i].fmid===item.item.fmid){
                console.log('GET THE ID1111',item.item.fmid,familyData[i].fmid)
                familyData[i].isFSelected=true
            }
            else{
                familyData[i].isFSelected=false
            }
            self.setState({
                myfamily11:familyData
            })

        }
    }

    render(){
        return(
            <View style={{flex:1}}>
                <View
                    style={{
                        backgroundColor:base.theme.colors.white,
                        flexDirection:'row',
                        marginTop:hp(5),
                    }}
                >
                        <FlatList
                            style={{
                                width:wp(60),
                                marginLeft:wp('18'),
                                backgroundColor:base.theme.colors.white,
                            }}
                            horizontal={true}
                            data={this.state.myfamily11}
                            renderItem={(item) => this.renderTopViews(item)}
                            extraData={this.state}
                        />

                    <ElevatedView
                        elevation={3}
                        style={{
                            borderTopLeftRadius:5,
                            borderTopRightRadius:5,
                            width:wp(10),
                            height:hp(5),
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

                        </ElevatedView>
                    </View>

                    <ElevatedView
                        elevation={8}
                        style={{
                            borderTopLeftRadius:20,
                            flex:1,
                            width:wp(80),
                            paddingTop:hp(5),
                            paddingLeft:wp(8),
                            paddingRight:wp(8),
                        }}
                    >

                        <View style={{ flexDirection:'row' , alignItems:'center', }}>
                            <Text style={{
                                fontSize:20
                            }}>Vendors/Deliveries</Text>
                            <Switch
                                style={{
                                    flex:1,
                                    alignSelf:'flex-end',
                                    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                }}
                                trackColor={{true: '#45B591', false: 'grey'}}
                                thumbTintColor="white"
                                //onValueChange = {(value)=>this.toggleSwitch(value)}
                                onValueChange = {()=> this.setState({vendorSwitchValue: !this.state.vendorSwitchValue})}
                                value = {this.state.vendorSwitchValue}
                            />
                        </View>

                        <View style={{ flexDirection:'row' , alignItems:'center', }}>
                            <Text>Entry</Text>
                        </View>
                        <View style={{ flexDirection:'row' , alignItems:'center', }}>
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
                                onValueChange = {()=> this.setState({inAppRequest: !this.state.inAppRequest})}
                                value = {this.state.inAppRequest}
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
                                onValueChange = {()=> this.setState({inAppNotification: !this.state.inAppNotification})}
                                value = {this.state.inAppNotification}
                            />
                        </View>

                        <View style={{ flexDirection:'row' , alignItems:'center', }}>
                            <Text>
                                IVR Call Request
                            </Text>
                            <Switch
                                style={{
                                    flex:1,
                                    alignSelf:'flex-end',
                                    //transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
                                }}
                                trackColor={{true: '#FFB400', false: 'grey'}}
                                thumbTintColor="white"
                                onValueChange = {()=> this.setState({IVR: !this.state.IVR})}
                                value = {this.state.IVR}
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
                        </View>

                    </ElevatedView>
                </View>
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
