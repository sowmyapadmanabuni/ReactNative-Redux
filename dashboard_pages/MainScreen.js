import { 
    Text, 
    View, 
    Image, 
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    YellowBox
} from 'react-native';
import { Card, CardItem } from 'native-base';
import Header from  '../components/Header';
import { Dropdown } from 'react-native-material-dropdown'
import { VictoryPie } from 'victory-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SearchableDropdown from 'react-native-searchable-dropdown';
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import all basic components
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { withBadge } from 'react-native-elements';
import { DrawerNavigator, StackNavigator, createStackNavigator } from 'react-navigation';
import Pie from 'react-native-pie';
import { openDatabase } from 'react-native-sqlite-storage';
import { Fonts } from '../pages/src/utils/Fonts';
import { RemoteMessage, Notification } from 'react-native-firebase';
import RNExitApp from 'react-native-exit-app';
import moment from 'moment';
import axios from 'axios';
import firebase from 'react-native-firebase';
import { 
  newNotifInstance, 
  createNotification, 
  getNotifications, 
  updateJoinedAssociation,
  getDashSub,
  getDashAssociation
} from '../src/actions';

var sold =100;
var unsold=100;
var totalunits1=0;
var sold2=0;
var unsold2=0;
var Residentlist=[];

class Dashboard extends React.Component {
    static navigationOptions = {
    title: 'Dashboard',
    header: null
    }

    constructor(props){
        super(props);
        this.state = {
          datasource: null,
          datasource1:[],
          dropdown: [],
          dropdown1:[],
          datasource2:null,
          data1:[],
          value:null,
          associationid : null,
          ownername:"",
          tenantname:"",
          unitname:"",
          unitid:"",
          uoMobile:"",
        }
    }

    requestNotifPermission = () => {
        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    this.listenForNotif()
                    // user has permissions
                } else {
                    firebase.messaging().requestPermission()
                    .then(() => {
                        this.listenForNotif()
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
        }

        let ACAccntID = global.MyAccountID;
        axios.get(`${global.champBaseURL}/GetAssociationListByAccountID/${ACAccntID}`, {
            headers: headers
        })
        .then(response => {
            let responseData = response.data.data;

            responseData.associationByAccount.map((association) => {
                // console.log('***********')
                // console.log(association.asAsnName)
                // console.log(association.asAssnID)
                // console.log('***********')
                firebase.messaging().subscribeToTopic(association.asAssnID + 'admin')
            })
        })
    }

    showLocalNotification = (notification) => {
        console.log(notification)
        const channel = new firebase.notifications.Android.Channel('channel_id', 'Oyespace', firebase.notifications.Android.Importance.Max)
        .setDescription('Oyespace channel');
        channel.enableLights(true);
        // channel.enableVibration(true);
        // channel.vibrationPattern([500]);
        firebase.notifications().android.createChannel(channel);

        
        const notificationBuild = new firebase.notifications.Notification({
            sound: 'default',
            show_in_foreground: true,
        })
        .setTitle(notification._title)
        .setBody(notification._body)
        .setNotificationId(notification._notificationId)
        // .setSound('default')
        .setData({
            ...notification._data,
            foreground: true
        })
        .android.setColor('#FF9100') 
        .android.setLargeIcon('ic_notif')
        .android.setAutoCancel(true)
        .android.setSmallIcon('ic_stat_ic_notification')
        .android.setChannelId('channel_id')
        .android.setVibrate("default")
        // .android.setChannelId('notification-action')
        .android.setPriority(firebase.notifications.Android.Priority.Max)

        firebase.notifications().displayNotification(notificationBuild);
        this.setState({ foregroundNotif: notification._data })
    }

    listenForNotif = () => {
        let navigationInstance = this.props.navigation;

        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
            // console.log('___________')
            // console.log(notification)
            // console.log('____________') 
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        });

        this.notificationListener = firebase.notifications().onNotification((notification) => {

            // console.log('___________')
            // console.log(notification)
            // console.log('____________')

            if(notification._data.associationID) {
                // this.props.createNotification(notification._data, navigationInstance, false)
            }  

            this.showLocalNotification(notification);

        });

        firebase.notifications().onNotificationOpened((notificationOpen) => {
            // alert('opened')
            // console.log('**********')
            // console.log(notificationOpen.notification._data.admin)
            if(notificationOpen.notification._data.admin === 'true') {
                if(notificationOpen.action) {
                    this.props.newNotifInstance(notificationOpen.notification);
                    this.props.createNotification(notificationOpen.notification._data, navigationInstance, true, 'true')
                    // this.props.createNotification(notificationOpen.notification)
                }
                // this.props.newNotifInstance(notificationOpen.notification);
                // this.props.createNotification(notificationOpen.notification._data, navigationInstance, true, false)
            } else if (notificationOpen.notification._data.admin === 'false') {
                // this.props.newNotifInstance(notificationOpen.notification);
                // this.props.createNotification(notificationOpen.notification._data, navigationInstance, true, 'false')
            // this.props.newNotifInstance(notificationOpen.notification);
            // this.props.createNotification(notificationOpen.notification._data, navigationInstance, true, false)
            }

            if(notificationOpen.notification._data.admin === 'true') {
                if(notificationOpen.notification._data.foreground) {
                    this.props.newNotifInstance(notificationOpen.notification);
                    this.props.createNotification(notificationOpen.notification._data, navigationInstance, true, 'true')
                }
            } else if (notificationOpen.notification._data.admin === 'gate_app') {
                    this.props.newNotifInstance(notificationOpen.notification);
                    this.props.createNotification(notificationOpen.notification._data, navigationInstance, true, 'gate_app')
                // this.props.newNotifInstance(notificationOpen.notification);
                // this.props.createNotification(notificationOpen.notification._data, navigationInstance, true, false)
            } else if (notificationOpen.notification._data.admin === 'false') {
                // alert('clicked here')
                this.props.newNotifInstance(notificationOpen.notification);
                this.props.createNotification(notificationOpen.notification._data, navigationInstance, true, 'false')
            // this.props.newNotifInstance(notificationOpen.notification);
            // this.props.createNotification(notificationOpen.notification._data, navigationInstance, true, false)
            }
        });
        
    }

    unit=(unit)=>{

        fetch(`http://${global.oyeURL}/oyeliving/api/v1/Unit/GetUnitListByAssocID/${unit}`
        , {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
        },
        })
        .then(response => response.json())
        .then((responseJson) => {
            var count = Object.keys(responseJson.data.unit).length;
            let sold_data = [];
            let name=[];
            var sold1=0;
            var unsold1=0;
            var totalunits=0;
            Residentlist=name;
            for(var i=0;i<count;i++){
            // console.log("rohitbaba",responseJson.data.unit[i].unOcStat) // sold and unsold data 
            sold_data.push({ value: responseJson.data.unit[i].unOcStat });
            var count1=Object.keys(responseJson.data.unit[i].owner).length;
            for(var j=0;j<count1;j++)
            {
                // console.log("owner",responseJson.data.unit[i].owner[j].uofName)//owner list
                this.setState({ownername:responseJson.data.unit[i].owner[j].uofName})
                this.setState({unitname:responseJson.data.unit[i].unUniName})
                this.setState({unitid:responseJson.data.unit[i].unUnitID})
                this.setState({uoMobile:responseJson.data.unit[i].owner[j].uoMobile})
                // console.log("ownerlist",this.state.ownername)
                // console.log("unit",this.state.unitname)
                Residentlist.push({
                    name: this.state.ownername,
                    unit: this.state.unitname,
                    role: "Owner",
                    unitid:this.state.unitid,
                    uoMobile:this.state.uoMobile,
                })
            }
            var count2=Object.keys(responseJson.data.unit[i].tenant).length;
            for(var k=0;k<count2;k++)
            {
                
                // console.log("tenant",responseJson.data.unit[i].tenant[k].utfName)//tenat list
                this.setState({tenantname:responseJson.data.unit[i].tenant[k].utfName})
                this.setState({unitname:responseJson.data.unit[i].unUniName})
                // console.log("tenantlist",this.state.tenantname)
                // console.log("unit",this.state.unitname)
                Residentlist.push({
                    name: this.state.tenantname,
                    unit: this.state.unitname,
                    role: "Tenant"
                })
            }
            
                
            }
            // console.log("unitname,and name",Residentlist)
            // console.log("rohitpppppp",sold_data)
            for(var j=0;j<=sold_data.length-1;j++)
            {
            if(sold_data[j].value =='Sold'|| sold_data[j].value =='SoldOwner Occupied Units' || sold_data[j].value =='Sold Tenant Occupied' || sold_data[j].value =='Sold Vacant' || sold_data[j].value=='All Sold Flats'|| sold_data[j].value =='All Occupied Units')
            {
                sold1=sold1+1;
            }
            else if (sold_data[j].value=='Unsold Vacant' || sold_data[j].value=='Unsold Tenant Occupied'||sold_data[j].value=='All Unsold Flats'||sold_data[j].value=='All Vacant Units' || sold_data[j].value=='')
            {
                unsold1= unsold1+1;
            }
            totalunits++;
            }
            sold=((sold1/totalunits)*100).toFixed(0);
            unsold=((unsold1/totalunits)*100).toFixed(0);
            totalunits1=totalunits;
            sold2=sold1;
            unsold2=unsold1;


            // console.log("myfirst",sold)
            // console.log("mysecond",unsold)
            // console.log("mytotal",totalunits1)
            // console.log(responseJson)
            let units = [];
            responseJson.data.unit.map((data, index) => {
            units.push({ value: data.unUniName, name: data.unUniName, id: index })
            })

            this.setState({ dropdown1: units })
        })
        
        .catch(error=>console.log(error))
    }

    onChangeText=()=>{    
    // console.log("hhhhhhhhhhhhhh",this.state.data1)
    }

    componentDidMount() {
      const { getDashSub, getDashAssociation } = this.props;
        getDashSub();
        getDashAssociation();
        this.requestNotifPermission();
        // this.getBlockList();
        // this.props.getNotifications()
    }

    onAssociationChange = (value, index) => {
      this.unit(this.state.associationid[index].id)
    }

  render() {
    return (
      <View style={{flex:1}}>
        <Header navigate={this.props.navigation}/>
      <View style={styles.container}>
        <View style={styles.textWrapper}>
        <View style={{flex:1, flexDirection:'column',height:hp('60%')}}>
          <View style={{flexDirection:'row',height:hp('12%')}}>
            <Card style={{flex:0.7}}>
              <CardItem style={{flexDirection:'row',height:hp('10%')}}>
                <Image style={styles.image1} source={require('../icons/buil.png')}/>
                <Dropdown
                    containerStyle={{ flex: 1, width: wp('10%')}}
                    label='Building Complex Name'
                    value="Building Complex Name"
                    data={this.state.dropdown}
                    textColor="#000"
                    fontSize={hp("2%")}
                    dropdownPosition={-2}
                    onChangeText={(value, index) => this.onAssociationChange(value, index)}
                  />
            
                  
              </CardItem>
            </Card>
            <Card style={{flex:0.3}}>
              <CardItem style={{height:hp('10%')}}>
              <Dropdown
                  containerStyle={{ flex: 1, width: wp('10%')}}
                  label='Unit'
                  value="Unit"
                  data={this.state.dropdown1}
                  textColor="#000"
                  fontSize={hp('2%')}
                  dropdownPosition={-4}
                  
                />
               
              </CardItem>
            </Card>
          </View>
          
          <View style={{flexDirection:'row',height:hp('32%')}}>
            <Card style={{flex:0.5}}>
              <CardItem style={{height:hp('27%')}}>
                <View style={{flexDirection:'column'}}>
                      <View style={{flexDirection:'row'}}>
                        <Text style={styles.text1}>Occupied</Text>
                        <Text style={styles.text2}>{sold2}</Text>
                        <Image style={styles.image2} source={require('../icons/ww.png')}/>
                        
                      </View>
                      <View >
                            <VictoryPie
                              colorScale={[ "#ff8c00","#D0D0D0" ]}
                              innerRadius={hp('6.5%')}
                              radius={hp('8.5%')}
                              data={[sold,unsold]}
                              width={wp('39%')}
                             height={hp('22%')}
                             labels={() => null}
                            />
                            
                            <View style={styles.gauge}>
                            <Text style={[styles.gaugeText,{color:'#FF8C00'}]}>{sold}%</Text>
                          </View>
                      </View>
                    </View>
              </CardItem>
            </Card>
            <Card style={{flex:0.5}}>
              <CardItem style={{height:hp('27%')}}>
                <View style={{flexDirection:'column'}}>
                    <View style={{flexDirection:'row'}}>
                      <Text style={styles.text3}>Vacant</Text>
                      <Text style={styles.text4}>{unsold2}</Text>
                      <Image style={styles.image3} source={require('../icons/hhhh.png')}/>
                       </View>
                         <View>
                              <VictoryPie
                              colorScale={[ "#45B591","#D0D0D0" ]}
                              innerRadius={hp('6.5%')}
                              radius={hp('8.5%')}
                              data={[unsold,sold]}
                              width={wp('39%')}
                             height={hp('22%')}
                             labels={() => null}

                             
                              />
                          <View style={styles.gauge}>
                            <Text style={[styles.gaugeText,{color:'#45B591'}]}>{unsold}%</Text>
                          </View>
                      </View>
                  </View>
              </CardItem>
            </Card>
          </View>
          <View style={{height:hp('7%')}}>
          <TouchableOpacity  
            // onPress={() => this.props.navigation.navigate('ViewmembersScreen')}
            onPress={()=> {this.props.navigation.navigate('ViewmembersScreen' ,{
            data: Residentlist })}}>
            <Card style={{height:hp('5%'),alignItems:'center',flexDirection:'row'}}>
                <Image source={require('../icons/eye.png')} style={styles.image4}/>
                <Text style={{alignSelf:'center',color:'black'}}>View Resident List</Text>
            </Card>
          </TouchableOpacity>
          </View>
        </View>
        <View style={styles.view1}>
          <View style={{flexDirection:'column'}}>
            <Card style={styles.card}>
                {/* <CardItem Style={styles.cardItem}> */}
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('InvitedGuestListScreen')}>
                    <View style={{flexDirection:'column'}} >
                      <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',marginTop:hp('2%')}}>
                        <Image style={{width:hp('4%'),height:hp('3.1%'),marginBottom:hp('0.55%')}} source={require('../icons/guests.png')}/>
                      </View>
                      <View style={{justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:hp('1.5%')}}>Guests</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                {/* </CardItem> */}
                <View style={styles.view2}></View>
              </Card>
          </View>
          
          <View style={{flexDirection:'column'}}>
            <Card style={styles.card}>
              {/* <CardItem Style={styles.cardItem}> */}
                <TouchableOpacity onPress={() => this.props.navigation.navigate('GuardListScreen')}>
                  <View style={{flexDirection:'column'}}>
                    <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',marginTop:hp('2%')}}>
                      <Image style={{width:hp('4%'),height:hp('3.1%'),marginBottom:hp('0.55%')}} source={require('../icons/guards.png')}/>
                    </View>
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                      <Text style={{fontSize:hp('1.5%'),}}>Guards</Text>
                    </View>
                  </View>
                  </TouchableOpacity>
                {/* </CardItem> */}
                <View style={styles.view2}></View>
            </Card>
          </View>
          
          <View style={{flexDirection:'column'}}>
            <Card style={styles.card}>
              {/* <CardItem Style={styles.cardItem}> */}
                <TouchableOpacity onPress={() => this.props.navigation.navigate('ViewVisitorsScreen')}>
                  <View style={{flexDirection:'column'}}>
                    <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',marginTop:hp('2%')}}>
                      <Image style={{width:hp('4%'),height:hp('3.1%'),marginBottom:hp('0.55%')}} source={require('../icons/deliveries.png')}/>
                    </View>
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                      <Text style={{fontSize:hp('1.5%')}}>Deliveries</Text>
                    </View>
                  </View>
                  </TouchableOpacity>
                {/* </CardItem> */}
                <View style={styles.view2}></View>
            </Card>
          </View>
          <View style={{flexDirection:'column'}}>
            <Card style={styles.card}>
              {/* <CardItem Style={styles.cardItem}> */}
                <TouchableOpacity onPress={() => this.props.navigation.navigate('AdminFunction')}>
                  <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',marginTop:hp('2%')}}>
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                      <Image style={{width:hp('4%'),height:hp('3.1%'),marginBottom:hp('0.55%')}} source={require('../icons/admin.png')}/>
                    </View>
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                      <Text style={{fontSize:hp('1.5%'), }}>Admin</Text>
                    </View>
                  </View>
                  </TouchableOpacity>
                {/* </CardItem> */}
                <View style={styles.view2}></View>
            </Card>
          </View>
      </View>
      <View style={{height:hp('5%')}}>
      <Card style={styles.card1}>
            <Text style={{alignSelf:'center',fontSize:hp("2%")}}>Subscription valid until:<Text style={{alignSelf:'center',color:'#ff4732',fontSize:hp("2%")}}>
              {this.props.datasource ? this.props.datasource.data.subscription.sueDate : null}</Text>
            </Text>
          </Card>
        </View>
      </View>
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    backgroundColor: '#fff',
    padding:hp('0.7%'),
  },
  card:{
    borderBottomWidth:1,
    flexDirection:'column',
    width:Dimensions.get('window').width / 4 - 10,
    height:hp('9%'),
    alignItems:'center'
  },
  cardItem:{
    flexDirection:'column',
    borderColor:'orange',
    borderWidth:hp('10%'),
    // borderBottomWidth:30,
  },
  textWrapper: {
    height: hp('85%'), // 70% of height device screen
    width: wp('95%')   // 80% of width device screen
  },
  gaugeText: {
    backgroundColor: 'transparent',
    color: '#000',
    fontSize: hp("3%"),
  },
  image1:{
    width:wp("6%"),
    height:hp("3%"),
    marginRight:10,
    justifyContent:'space-between'
  },
  image2:{
    height:15,
    width:15,
    justifyContent:'flex-end',
    alignItems:'flex-end',
    marginBottom:hp('2.4%'),
    marginTop:hp('2.4%')
  },
  text1:{
    justifyContent:'flex-start', 
    alignItems:'flex-start',
    flex:5,
    color:'#FF8C00',
    marginBottom:hp('2.4%'),
    marginTop:hp('2.4%')
  },
  text2:{
    justifyContent:'flex-end',
    alignItems:'flex-end',
    color:'#FF8C00',
    marginBottom:hp('2.4%'),
    marginTop:hp('2.4%')
    },
  text3:{
    justifyContent:'flex-start',
    alignItems:'flex-start',
    flex:1,color:'#45B591',
    marginBottom:hp('2.4%'),
    marginTop:hp('2.4%')
    },
  text4:{
    justifyContent:'flex-end',
    alignItems:'flex-end',
    color:'#45B591',
    marginBottom:hp('2.4%'),
    marginTop:hp('2.4%')
    },
  image3:{
    height:hp("2%"),
    width:wp("3.5%"),
    justifyContent:'flex-end',
    alignItems:'flex-end',
    marginBottom:hp('2.4%'),
    marginTop:hp('2.4%')
  },
  image4:{
    width:wp("5%"),
    height:hp("2%"),
    justifyContent:'flex-start',
    marginLeft:hp("1%"),
    marginRight:hp("1%")
  },
  view1:{
    flexDirection:'row',
    margin:hp("0.5%"),
    alignItems:'center',
    justifyContent:'center',
    bottom:0,
    height:hp('12%')
  },
  view2:{
    borderWidth:hp('0.8%'),
    borderBottomEndRadius:hp('0.8%'),
    borderBottomStartRadius:hp('0.8%'),
    borderColor:'orange',
    width:Dimensions.get('window').width / 4 - 10,
    marginTop:hp('0.8%')
    
  },
  card1:{
    height:hp("4%"),
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#fff6e5',
    marginBottom:hp("2%")
  },
  gauge: {
    position: 'absolute',
    width: wp("40%"),
    height: hp("22%"),
    alignItems: 'center',
    justifyContent: 'center',
  }
});

const mapStateToProps = state => {
    return {
        isCreateLoading: state.NotificationReducer.isCreateLoading,
        notificationCount: state.NotificationReducer.notificationCount,
        joinedAssociations: state.AppReducer.joinedAssociations,
        datasource: state.DashboardReducer.datasource
    }
}

export default connect(mapStateToProps, { 
  newNotifInstance, 
  createNotification, 
  getNotifications, 
  updateJoinedAssociation,
  getDashSub,
  getDashAssociation
})(Dashboard);






