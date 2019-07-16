import React,  { Component }  from 'react';
import {
    View,
    Text,
    FlatList,
    ScrollView,
    Image,
    TouchableOpacity,
    TouchableHighlight,Platform,Linking
} from 'react-native';
import base from '../../../base'
import {connect} from 'react-redux'
import CardView from "../../../components/cardView/CardView";
import {Dropdown} from "react-native-material-dropdown";
import ElevatedView from 'react-native-elevated-view'
import OSButton from "../../../components/osButton/OSButton";
import Style from './Style'
import axios from "axios";
import firebase from "react-native-firebase";
import _ from "lodash";
import {
  newNotifInstance,
  createNotification,
  getNotifications,
  updateJoinedAssociation,
  getDashSub,
  getDashAssociation,
  getDashUnits,
  updateUserInfo,
  updateApproveAdmin,
  getAssoMembers,
  updateDropDownIndex,
  createUserNotification,
  refreshNotifications,
} from "../../../actions";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.props=props;
        this.state={
            myUnitCardHeight:"80%",
            myUnitCardWidth:"25%",
            adminCardHeight:"70%",
            adminCardWidth:"22%",
            offersCardHeight:"70%",
            offersCardWidth:"22%",
            isSelectedCard:"UNIT",

            isLoading: false,
            assocList: [],
            assocName: "",
            assocId:"",

            unitList:[],
            unitName:"",
            falmilyMemebCount:null,
            vechiclesCount:null,
            visitorCount:null
            
        }
    }

    componentWillMount() {
        this.getListOfAssociation();
        this.getVehicleList();
    }

    requestNotifPermission = () => {
        const {
          MyAccountID,
          champBaseURL,
          receiveNotifications,
          oyeURL
        } = this.props;
    
        firebase
          .messaging()
          .hasPermission()
          .then(enabled => {
            if (enabled) {
              if (receiveNotifications) {
                this.listenForNotif();
              }
              // user has permissions
            } else {
              firebase
                .messaging()
                .requestPermission()
                .then(() => {
                  if (receiveNotifications) {
                    this.listenForNotif();
                  }
                  // User has authorised
                })
                .catch(error => {
                  // User has rejected permissions
                });
              // user doesn't have permission
            }
          });
    
        var headers = {
          "Content-Type": "application/json",
          "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
        };
    
        axios
          .get(`${champBaseURL}/GetAssociationListByAccountID/${MyAccountID}`, {
            headers: headers
          })
          .then(response => {
            let responseData = response.data.data;
    
            responseData.associationByAccount.map(association => {
              // console.log('***********')
              // console.log(association.asAsnName)
              // console.log(association.asAssnID)
              // console.log('***********')
              if (receiveNotifications) {
                firebase
                  .messaging()
                  .subscribeToTopic(association.asAssnID + "admin");
                // console.log(association.asAssnID);
              } else if (!receiveNotifications) {
                firebase
                  .messaging()
                  .unsubscribeFromTopic(association.asAssnID + "admin");
              }
            });
          });
    
        axios
          .get(
            `http://${oyeURL}/oyeliving/api/v1/Member/GetMemberListByAccountID/${MyAccountID}`,
            {
              headers: headers
            }
          )
          .then(response => {
            let data = response.data.data.memberListByAccount;
            // console.log("dataoye", data);
            data.map(units => {
              // console.log(units.unUnitID + "admin");
              // console.log(units.mrmRoleID + "role");
              if (receiveNotifications) {
                if (units.mrmRoleID === 2 || units.mrmRoleID === 3) {
                  // console.log(units.unUnitID + "admin");
                  firebase.messaging().subscribeToTopic(units.unUnitID + "admin");
                }
              } else if (!receiveNotifications) {
                firebase.messaging().unsubscribeFromTopic(units.unUnitID + "admin");
              }
            });
          });
      };
    
      showLocalNotification = notification => {
        // console.log(notification);
        const channel = new firebase.notifications.Android.Channel(
          "channel_id",
          "Oyespace",
          firebase.notifications.Android.Importance.Max
        ).setDescription("Oyespace channel");
        channel.enableLights(true);
        // channel.enableVibration(true);
        // channel.vibrationPattern([500]);
        firebase.notifications().android.createChannel(channel);
    
        const notificationBuild = new firebase.notifications.Notification({
          sound: "default",
          show_in_foreground: true
        })
          .setTitle(notification._title)
          .setBody(notification._body)
          .setNotificationId(notification._notificationId)
          // .setSound('default')
          .setData({
            ...notification._data,
            foreground: true
          })
          .android.setColor("#FF9100")
          .android.setLargeIcon("ic_notif")
          .android.setAutoCancel(true)
          .android.setSmallIcon("ic_stat_ic_notification")
          .android.setChannelId("channel_id")
          .android.setVibrate("default")
          // .android.setChannelId('notification-action')
          .android.setPriority(firebase.notifications.Android.Priority.Max);
    
        firebase.notifications().displayNotification(notificationBuild);
        this.setState({ foregroundNotif: notification._data });
      };
    
      listenForNotif = () => {
        let navigationInstance = this.props.navigation;
    
        this.notificationDisplayedListener = firebase
          .notifications()
          .onNotificationDisplayed(notification => {
            // console.log('___________')
            // console.log(notification)
            // console.log('____________')
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
          });
    
        this.notificationListener = firebase
          .notifications()
          .onNotification(notification => {
            // console.log('___________')
            // console.log(notification)
            // console.log('____________')
    
            if (notification._data.associationID) {
              // this.props.createNotification(notification._data, navigationInstance, false)
            }
    
            this.showLocalNotification(notification);
          });
    
        firebase.notifications().onNotificationOpened(notificationOpen => {
          const { MyAccountID } = this.props.userReducer;
          const { oyeURL } = this.props.oyespaceReducer;
          let details = notificationOpen.notification._data;
          if (notificationOpen.notification._data.admin === "true") {
            if (notificationOpen.action) {
              // this.props.newNotifInstance(notificationOpen.notification);
              // this.props.createNotification(
              //   notificationOpen.notification._data,
              //   navigationInstance,
              //   true,
              //   "true",
              //   this.props.oyeURL,
              //   this.props.MyAccountID
              // );
              // this.props.createNotification(notificationOpen.notification)
            }
            // this.props.newNotifInstance(notificationOpen.notification);
            // this.props.createNotification(notificationOpen.notification._data, navigationInstance, true, false)
          } else if (notificationOpen.notification._data.admin === "false") {
            this.props.createUserNotification(
              "Join_Status",
              oyeURL,
              MyAccountID,
              1,
              details.ntDesc,
              "resident_user",
              "resident_user",
              details.sbSubID,
              "resident_user",
              "resident_user",
              "resident_user",
              "resident_user",
              "resident_user",
              true
            );
            // this.props.navigation.navigate("NotificationScreen");
          }
    
          if (notificationOpen.notification._data.admin === "true") {
            this.props.refreshNotifications(oyeURL, MyAccountID);
            if (notificationOpen.notification._data.foreground) {
              // this.props.newNotifInstance(notificationOpen.notification);
              // this.props.createNotification(
              //   notificationOpen.notification._data,
              //   navigationInstance,
              //   true,
              //   "true",
              //   this.props.oyeURL,
              //   this.props.MyAccountID
              // );
            }
          } else if (notificationOpen.notification._data.admin === "gate_app") {
            this.props.refreshNotifications(oyeURL, MyAccountID);
            // this.props.newNotifInstance(notificationOpen.notification);
            // this.props.createNotification(
            //   notificationOpen.notification._data,
            //   navigationInstance,
            //   true,
            //   "gate_app",
            //   this.props.oyeURL,
            //   this.props.MyAccountID
            // );
            // this.props.newNotifInstance(notificationOpen.notification);
            // this.props.createNotification(notificationOpen.notification._data, navigationInstance, true, false)
          } else if (notificationOpen.notification._data.admin === "false") {
          }
          // this.props.getNotifications(oyeURL, MyAccountID);
          this.props.navigation.navigate("NotificationScreen");
        });
      };
    
      onChangeText = () => {
        // console.log("hhhhhhhhhhhhhh",this.state.data1)
      };
    
      didMount = () => {
        const { getDashSub, getDashAssociation, getAssoMembers } = this.props;
        const { MyAccountID, SelectedAssociationID } = this.props.userReducer;
        const { oyeURL } = this.props.oyespaceReducer;
        // this.props.updateApproveAdmin([]);
    
        getDashSub(oyeURL, SelectedAssociationID);
        getDashAssociation(oyeURL, MyAccountID);
        getAssoMembers(oyeURL, MyAccountID);
        this.requestNotifPermission();
        // this.getBlockList();
        this.props.getNotifications(oyeURL, MyAccountID);
        console.log("Notification")
      };

      componentDidMount(){
        console.log("Notification")
        const { getDashSub, getDashAssociation, getAssoMembers } = this.props;
        const { MyAccountID, SelectedAssociationID } = this.props.userReducer;
        const { oyeURL } = this.props.oyespaceReducer;
        // this.props.updateApproveAdmin([]);
    
        getDashSub(oyeURL, SelectedAssociationID);
        getDashAssociation(oyeURL, MyAccountID);
        getAssoMembers(oyeURL, MyAccountID);
        this.requestNotifPermission();
        // this.getBlockList();
        this.props.getNotifications(oyeURL, MyAccountID);

      }
      onAssociationChange = (value, index) => {
        const {
          associationid,
          getDashUnits,
          updateUserInfo,
          memberList,
          notifications,
          dropdown
        } = this.props;
        const { MyAccountID, SelectedAssociationID } = this.props.userReducer;
        const { oyeURL } = this.props.oyespaceReducer;
    
        getDashUnits(associationid[index].id, oyeURL, notifications, MyAccountID);
    
        updateUserInfo({
          prop: "SelectedAssociationID",
          value: dropdown[index].associationId
        });
    
        let memId = _.find(memberList, function(o) {
          return o.asAssnID === dropdown[index].associationId;
        });
    
        updateUserInfo({
          prop: "MyOYEMemberID",
          value: memId.meMemID
        });
    
        updateUserInfo({
          prop: "SelectedMemberID",
          value: dropdown[index].memberId
        });
      };
    

    async getListOfAssociation() {
        let self = this;
        self.setState({isLoading: true})
        console.log("APi",base.utils.strings.oyeLivingDashBoard)
        let stat = await base.services.OyeLivingApi.getAssociationListByAccountId(this.props.userReducer.MyAccountID);
        //self.setState({isLoading: false})
        try {
            if (stat && stat.data) {
                let assocList = [];
                for (let i = 0; i < stat.data.memberListByAccount.length; i++) {
                    if (stat.data.memberListByAccount[i]) {
                        assocList.push({value: stat.data.memberListByAccount[i].asAsnName, details: stat.data.memberListByAccount[i]})
                    }
                }
                self.setState({
                    assocList: assocList,
                    assocName: assocList[0].details.asAsnName,
                    assocId: assocList[0].details.asAssnID
                })
            }
        self.getUnitListByAssoc();

        } catch (error) {
            base.utils.logger.log(error)
        }

    }

    onAssociationChange(value, index) {
        let self = this;
        let assocList = self.state.assocList;
        for (let i = 0; i < assocList.length; i++) {
            if (i === index) {
                assocName = assocList[i].details.asAsnName;
                assocId = assocList[i].details.asAssnID;
            }
        }
        self.setState({
            assocName: value,
            assocId: assocId,

        });

    }

    async getUnitListByAssoc() {
        let self = this;
        //self.setState({isLoading: true})
        console.log("APi1233",self.state.assocId)
        let stat = await base.services.OyeLivingApi.getUnitListByAssoc(8);
        self.setState({isLoading: false})
        console.log("STAT123",stat)

        try {
            if (stat && stat.data) {
                let unitList = [];
                for (let i = 0; i < stat.data.members.length; i++) {
                    if (stat.data.members[i]) {
                        let Unit=""
                        // if(!stat.data.members[i].unUniName || stat.data.members[i].unUniName  ===""){
                        //     console.log('No Unit name',stat.data.members[i].unUniName)
                        //     Unit="Unit"+i

                        // }
                        // else{
                        //   Unit=stat.data.members[i].unUniName
                        // }
                        unitList.push({value:Unit, details: stat.data.members[i]})
                    }
                }
                console.log('JGjhgjhg',unitList)
                
                self.setState({
                    unitList: unitList,
                    unitName: unitList[0].value,
                })
            }
        } catch (error) {
            base.utils.logger.log(error)
        }

    }

    updateUnit(value, index) {
        console.log("Unit ", value,index)
        
    }
    
    

    getVehicleList = () => {
        fetch('http://apidev.oyespace.com/oyeliving/api/v1/Vehicle/GetVehicleListByMemID/13'
          , {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
            },
          })
            .then(response => response.json())
            .then(responseJson => {
              console.log("Manas",responseJson)
              this.setState({
                  //Object.keys(responseJson.data.unitsByBlockID).length
                vechiclesCount: Object.keys(responseJson.data.vehicleListByMemID).length,
              })
            })
            .catch(error=>{
              this.setState({ loading: false });
              console.log(error)})
      }
    render() {
       // base.utils.logger.log(this.props)
       console.log("Asociation",this.state.unitList, this.state.assocList)

        let associationList = this.state.assocList;
        let unitList = this.state.unitList;

        return (
            <View style={Style.container}>
                <View style={Style.dropDownContainer}>
                    <View style={Style.leftDropDown}>
                        <Dropdown
                            value={this.state.assocName}
                            data={associationList}
                            textColor={base.theme.colors.black}
                            inputContainerStyle={{ borderBottomColor: 'transparent' }}
                            dropdownOffset={{top: 10, left: 0}}
                            dropdownPosition={-3}
                            rippleOpacity={0}
                            onChangeText={(value, index) =>
                                this.onAssociationChange(value, index)
                            }
                        />
                    </View>
                    <View style={Style.rightDropDown}>
                        <Dropdown
                            value={this.state.unitName}
                            label="UNIT"
                            data={unitList}
                            inputContainerStyle={{ borderBottomColor: 'transparent' }}
                            textColor="#000"
                            dropdownOffset={{top: 10, left: 0}}
                            dropdownPosition={-3}
                            rippleOpacity={0}
                            onChangeText={(value, index) => {
                                this.updateUnit(value, index)
                            }}
                        />
                    </View>
                </View>
                {this.state.isSelectedCard==="UNIT"? this.myUnitCard() :
                    this.state.isSelectedCard==="ADMIN"? this.adminCard() : this.offersZoneCard() }
                <View style={Style.bottomCards}>
                    <CardView
                        height={this.state.myUnitCardHeight}
                        width={this.state.myUnitCardWidth} cardText={'My Unit'}
                        cardIcon={require("../../../../icons/my_unit.png")}
                        onCardClick={()=>this.changeCardStatus("UNIT")}
                        disabled={this.state.isSelectedCard === "UNIT"}
                    />
                    <CardView
                        height={this.state.adminCardHeight}
                        width={this.state.adminCardWidth}
                        cardText={'Admin'}
                        onCardClick={() => this.changeCardStatus("ADMIN")}
                        cardIcon={require("../../../../icons/user.png")}
                        disabled={this.state.isSelectedCard=== "ADMIN"}
                    />

                    {/* <CardView
                        height={this.state.offersCardHeight}
                        width={this.state.offersCardWidth}
                        cardText={'Offers Zone'}
                        cardIcon={require("../../../../icons/offers.png")}
                        backgroundColor={base.theme.colors.rosePink}
                        // onCardClick={() => this.changeCardStatus("OFFERS")}
                        disabled={this.state.isSelectedCard=== "OFFERS"}
                    /> */}

                </View>
                <View style={Style.supportContainer}>
                    <View style={Style.subSupportView}>
                        <TouchableOpacity onPress={() => {
                            {
                              Platform.OS === "android"
                                ? Linking.openURL(
                                    `tel:+919343121121`
                                  )
                                : Linking.openURL(
                                    `tel:+919343121121`
                                  );
                            }
                        }}>
                            <Image style={[Style.supportIcon]}
                                   source={require("../../../../icons/call.png")}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image
                                style={Style.supportIcon}
                                source={require("../../../../icons/chat.png")}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            Linking.openURL('mailto:happy@oyespace.com')
                        }}>
                            <Image
                                style={Style.supportIcon}
                                source={require("../../../../icons/email.png")}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )

    }

    changeCardStatus(status){
        this.setState({
            isSelectedCard:status
        })
        if(status =="UNIT"){
            this.setState({
                myUnitCardHeight:"80%",
                myUnitCardWidth:"25%",
                adminCardHeight:"70%",
                adminCardWidth:"22%",
                offersCardHeight:"70%",
                offersCardWidth:"22%",
            })
        }
        else if(status=="ADMIN"){
            this.setState({
                myUnitCardHeight:"70%",
                myUnitCardWidth:"22%",
                adminCardHeight:"80%",
                adminCardWidth:"25%",
                offersCardHeight:"70%",
                offersCardWidth:"22%",
            })

        }
        else if(status=="OFFERS"){

            this.setState({
                myUnitCardHeight:"70%",
                myUnitCardWidth:"22%",
                adminCardHeight:"70%",
                adminCardWidth:"22%",
                offersCardHeight:"80%",
                offersCardWidth:"25%",
            })

        }
    }


    navigateToScreen(){
        this.props.navigation.navigate("")
    }

    myUnitCard(){
        let invoiceList = [{invoiceNumber: 528, bill: "12,300", dueDate: '11-May-2019', status: "NOT PAID"},
            {invoiceNumber: 527, bill: "12,800", dueDate: '8-May-2019', status: "PAID"}]
        return(
            <ElevatedView elevation={6} style={Style.mainElevatedView}>

                <View style={Style.elevatedView}>
                    <CardView
                        height={"100%"}
                        width={"25%"} cardText={' Family Members'}
                        cardIcon={require("../../../../icons/view_all_visitors.png")}
                        cardCount={5}
                        marginTop={20}
                        backgroundColor={base.theme.colors.cardBackground}
                    />
                    <CardView
                        height={"100%"}
                        width={"25%"} cardText={'Vehicles'}
                        cardIcon={require("../../../../icons/vehicle.png")}
                        cardCount={this.state.vechiclesCount}
                        marginTop={20}
                        backgroundColor={base.theme.colors.cardBackground}
                        onCardClick={()=>this.props.navigation.navigate('MyVehicleListScreen')
                        }
                    />
                    <CardView
                        height={"100%"}
                        width={"25%"} cardText={'Visitors'}
                        cardIcon={require("../../../../icons/view_all_visitors.png")}
                        // cardCount={2}
                        marginTop={20}
                        backgroundColor={base.theme.colors.cardBackground}
                        onCardClick={()=>this.goToFirstTab()}/>
                </View>

                <View style={Style.elevatedViewSub}>
                    {/* <CardView
                        height={"100%"}
                        width={"39%"} cardText={'Documents'}
                        cardIcon={require("../../../../icons/report.png")}
                        cardCount={0}
                        backgroundColor={base.theme.colors.shadedWhite}
                    />
                    <CardView
                        height={"100%"}
                        width={"39%"} cardText={'Tickets'}
                        cardIcon={require("../../../../icons/tickets.png")}
                        cardCount={2}
                        backgroundColor={base.theme.colors.shadedWhite}
                    /> */}
                </View>
                {/* <ElevatedView elevation={0} style={Style.invoiceCardView}>
                    <View style={Style.invoiceHeadingView}>
                        <Text style={Style.invoiceText}>Invoices</Text>
                        <TouchableOpacity>
                            <Text style={Style.viewMoreText}>View more</Text>
                        </TouchableOpacity>
                    </View>
                    {invoiceList.length > 0 ?

                        <ScrollView style={Style.scrollView}>
                            <FlatList
                                data={invoiceList}
                                extraData={this.state}
                                style={Style.inVoiceFlatList}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={(item) => this.listOfInvoices(item)}
                            />
                        </ScrollView>
                        :
                        <View style={Style.noDataView}>
                            <Text style={Style.noDataMsg}>No Invoices</Text>
                        </View>
                    }

                </ElevatedView>
            */}
            </ElevatedView>
        )
    }

    adminCard(){
        return(
            <ElevatedView elevation={6} style={Style.mainElevatedView} >
                <Text>
                    ADMIN DASHBOARD
                </Text>
            </ElevatedView>
        )
    }

    offersZoneCard(){
        return(
            <ElevatedView elevation={6} style={Style.mainElevatedView} >
                <Text>
                    OFFERS ZONE
                </Text>
            </ElevatedView>
        )
    }


    listOfInvoices(item) {
        base.utils.logger.log(item);
        return (
            <TouchableHighlight underlayColor={'transparent'}>
                <View style={Style.invoiceView}>
                    <View style={Style.invoiceSubView}>
                        <Text style={Style.invoiceNumberText}>Invoice No. {item.item.invoiceNumber}
                        </Text>
                        <Text style={Style.billText}>
                            <Text style={Style.rupeeIcon}>{'\u20B9'}
                        </Text>
                            {item.item.bill}</Text>

                    </View>
                    <View style={Style.invoiceSubView}>
                        <Text style={Style.dueDate}>Due No. {item.item.dueDate}</Text>
                        <OSButton
                            height={'80%'}
                            width={'25%'}
                            borderRadius={15}
                            oSBBackground={item.item.status === "PAID" ? base.theme.colors.grey : base.theme.colors.primary}
                            oSBText={item.item.status === "PAID" ? "Paid" : "Pay Now"}/>
                    </View>
                </View>
            </TouchableHighlight>

        );
    }

    myUnit(){

    }

    goToFirstTab(){ 
        // const updateIdDashboard=this.props;
        // console.log("updateIdDashboard", this.props)
        // updateIdDashboard({prop:"assId", value:1})
        // updateIdDashboard({prop:"uniID", value:2})


        this.props.navigation.navigate("firstTab")
    }

}

const mapStateToProps = state => {
    return {
        userReducer: state.UserReducer,

        isCreateLoading: state.NotificationReducer.isCreateLoading,
    notificationCount: state.NotificationReducer.notificationCount,
    notifications: state.NotificationReducer.notifications,
    joinedAssociations: state.AppReducer.joinedAssociations,
    datasource: state.DashboardReducer.datasource,
    dropdown: state.DashboardReducer.dropdown,
    dropdown1: state.DashboardReducer.dropdown1,
    associationid: state.DashboardReducer.associationid,
    residentList: state.DashboardReducer.residentList,
    sold: state.DashboardReducer.sold,
    unsold: state.DashboardReducer.unsold,
    sold2: state.DashboardReducer.sold2,
    unsold2: state.DashboardReducer.unsold2,
    isLoading: state.DashboardReducer.isLoading,
    memberList: state.DashboardReducer.memberList,

    // Oyespace variables and user variables
    MyFirstName: state.UserReducer.MyFirstName,
    MyAccountID: state.UserReducer.MyAccountID,
    SelectedAssociationID: state.UserReducer.SelectedAssociationID,
    userReducer: state.UserReducer,

    // Oyespace urls
    oyeURL: state.OyespaceReducer.oyeURL,
    champBaseURL: state.OyespaceReducer.champBaseURL,
    oyespaceReducer: state.OyespaceReducer,
    receiveNotifications: state.NotificationReducer.receiveNotifications,

    };
};

export default connect(mapStateToProps , {
    newNotifInstance,
    createNotification,
    getNotifications,
    updateJoinedAssociation,
    getDashSub,
    getDashAssociation,
    getDashUnits,
    updateUserInfo,
    getAssoMembers,
    updateApproveAdmin,
    updateDropDownIndex,
    createUserNotification,
    refreshNotifications,
    
})(Dashboard)