import React, { Component } from 'react';
import { View, StyleSheet, Image, Text,TouchableOpacity,FlatList } from 'react-native';
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

            <ElevatedView
                elevation={5}
                style={{
                    borderTopLeftRadius:5,
                    borderTopRightRadius:5,
                    width:wp(20),
                    height:hp(4),
                    marginRight:wp('2'),
                    alignItems:'center',
                    justifyContent:'center',
                }}
            >
                <Text>
                    {item.item.fmlName}
                </Text>
            </ElevatedView>
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
                            width:wp(8),
                            height:hp(4),
                            marginRight:wp('5'),
                            alignItems:'center',
                            justifyContent:'center',
                        }}
                    >
                        <Text>
                            +
                        </Text>
                    </ElevatedView>

                </View>

                <View style={{flex:1,flexDirection:'row'}}>
                    <View >
                        <ElevatedView
                            elevation={3}
                            style={{
                                borderTopLeftRadius:5,
                                borderBottomRightRadius:5,
                                height:wp(40),
                                width:wp(4),
                            }}
                        >
                        </ElevatedView>
                        <ElevatedView
                            elevation={3}
                            style={{
                                borderTopLeftRadius:5,
                                borderBottomRightRadius:5,
                                height:wp(10),
                                width:wp(7),
                            }}
                        >
                        </ElevatedView>
                    </View>
                    <ElevatedView
                        elevation={8}
                        style={{
                            //backgroundColor:'green',
                            borderTopLeftRadius:20,
                            flex:1,
                            width:wp(80),
                            //alignSelf:'flex-end',
                        }}
                    >

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