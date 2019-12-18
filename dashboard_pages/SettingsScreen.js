import React, { Component } from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity, FlatList, Platform, Switch} from 'react-native';
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
                    {item.item.fmName}
                </Text>
            </View>
        )
    }

    render(){
        //console.log("userReducer", userReducer);
        return(
            <View style={{flex:1}}>

                <View
                    style={{
                        //backgroundColor:'#aaa',
                        flexDirection:'row',
                        marginTop:hp(5),
                    }}
                >
                        <FlatList
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

                        <View style={{ flexDirection:'row' , alignItems:'center', backgroundColor:'yellow'}}>
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
