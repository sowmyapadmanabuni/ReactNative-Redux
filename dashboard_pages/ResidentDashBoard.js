import React, { Component } from 'react';
//import react in our code.
import {
  StyleSheet, Platform, StatusBar, View, Text, Image, Picker, TextInput,
  TouchableOpacity, YellowBox, ScrollView, Alert
} from 'react-native';
// import all basic components
import { DrawerNavigator, StackNavigator,createStackNavigator } from 'react-navigation';
import Pie from 'react-native-pie';
import { mystyles } from '../pages/styles';
import Mybutton from '../pages/components/Mybutton';
import { Fonts } from '../pages/src/utils/Fonts';
import RNExitApp from 'react-native-exit-app';

console.disableYellowBox = true;
var dateToday = new Date().getDate();
var monthToday = new Date().getMonth() + 1;
var yearToday = new Date().getFullYear();

class ResNavigationDrawerStructure extends Component {

  //Structure for the navigatin Drawer
  toggleDrawer = () => {
    //Props to open/close the drawer
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>

        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          {/*Donute Button Image */}
          <Image
             source={require('../pages/assets/images/menu_button.png')}
            style={{ width: 25, height: 25, marginLeft: 5 }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

class Screen1 extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      guard_tot_count: 0,
      guard_onduty_count: 0,
      dataSourceAssnPkr: [],
      AssnPickerValueHolder: '',
      dataSourceUnitPkr: [],
      UnitPickerValueHolder: '',
      SubscriptionValidity: '',
    };

  }
  componentWillUpdate(nextProps, nextState) {
    if (this.state.guard_tot_count == nextState.guard_tot_count) {
        // alert('componentWillUpdate if');
    }else{
     // alert('componentWillUpdate else');
    }
  }
  componentDidMount() {
    console.log('componentdidmount')

    //   const url1 = 'http://192.168.1.39:80/oye247/api/v1/GetWorkersList'
    const url1 = 'http://' + global.oyeURL + '/oyesafe/api/v1/Subscription/GetLatestSubscriptionByAssocID/' + global.SelectedAssociationID
    fetch(url1, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          //dataSource: responseJson.data.workers.filter(x => x.associationID == global.SelectedAssociationID), 
          // dataSource: responseJson.data.workers.filter(x => x.asAssnID == 25),
          isLoading: false
        })
        console.log('Subscription res', responseJson);
        if (responseJson.success) {
          // console.log('ravii workers', responseJson);
          console.log('Subscription count', responseJson.data.subscription);
          this.setState({
            SubscriptionValidity: responseJson.data.subscription.sueDate,
          });
          console.log('Subscription ', responseJson.data.subscription.sueDate);

        } else {
          console.log('Subscription ', 'else ');
          //   const url1 = 'http://192.168.1.39:80/oye247/api/v1/GetWorkersList'
          const url3 = 'http://' + global.oyeURL + '/oyesafe/api/v1/Subscription/Create'
          member = {
            "ASAssnID": global.SelectedAssociationID,
            "SULPymtD": "2018-11-26",// yearToday+"-"+monthToday+"-"+dateToday,
            "SULPymtBy": 2,
            "SUNoofUnit": 2,
            "PRID": 4,
            "PYID": 1,

          }
          console.log('Subscription ', url3 + ' start ' + member);

          fetch(url3, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
            },
            body: JSON.stringify(member)
          })
            .then((response) => response.json())
            .then((responseJson) => {
              this.setState({
                //dataSource: responseJson.data.workers.filter(x => x.associationID == global.SelectedAssociationID), 
                // dataSource: responseJson.data.workers.filter(x => x.asAssnID == 25),
                isLoading: false
              })
              console.log('Subscription res', responseJson);
              if (responseJson.success) {
                // console.log('ravii workers', responseJson);

              } else {
                console.log('Subscription ', 'else ');

              }
            })
            .catch((error) => {
              console.log(error)
            })
        }
      })
      .catch((error) => {
        console.log(error)
      })
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    

    console.log('attendance ')
    //const url2 = 'http://'+global.oyeURL+'/oye247/api/v1/Attendance/GetAttendanceListByStartDateAndAssocID/' + global.SelectedAssociationID+'/2018-11-26'
    const url2 = 'http://' + global.oyeURL + '/oye247/api/v1/Attendance/GetAttendanceListByAssocID/' + global.SelectedAssociationID
    fetch(url2, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {

        console.log('attendance anu', responseJson + ' ' + url2);

        if (responseJson.success) {
          //   console.log('ravii attendance', responseJson);
          console.log('attendance count', responseJson.data.attendanceListByAttendyID.length);
          for (let i = 0; i < responseJson.data.attendanceListByAttendyID.length; ++i) {
            //     temp.push(results.rows.item(i));
            console.log('Results attendance', responseJson.data.attendanceListByAttendyID[i].atAttndID + ' '
              + responseJson.data.attendanceListByAttendyID[i].wkWorkID);
            //"attendanceListByAssocID": [    {    "atAttndID": 3,      "atAtyID": 0,
            //  "atsDate": "2018-11-12T00:00:00",   "ateDate": "2018-02-25T00:00:00",   "atsTime": "1900-01-01T06:22:50",
            //  "ateTime": "2018-11-13T02:25:23",   "atEntryPt": "MainGate",     "atExitPt": "Gardern",
            //  "wkWorkID": 8,     "wsWrkSTID": 8,     "atgpsPnt": "12.2323 323.23262",
            //  "atimeiNo": "546546546",     "atMemType": "Guard",      "atAtdType": "Wok",
            //  "meMemID": 2,    "asAssnID": 25,     "atdCreated": "2018-11-12T00:00:00",
            //   "atdUpdated": "0001-01-01T00:00:00",              "atIsActive": true          }
            if (responseJson.data.attendanceListByAssocID[i].atsDate == year + '-' + month + '-' + date + 'T00:00:00') {
              console.log('today attendance', responseJson.data.attendanceListByAssocID[i].atAttndID + ' '
                + responseJson.data.attendanceListByAssocID[i].atsDate);
              this.insert_GuardAttendance(responseJson.data.attendanceListByAssocID[i].atAttndID,
                responseJson.data.attendanceListByAssocID[i].asAssnID, responseJson.data.attendanceListByAssocID[i].wkWorkID,
                responseJson.data.attendanceListByAssocID[i].atimeiNo, responseJson.data.attendanceListByAssocID[i].atsDate,
                responseJson.data.attendanceListByAssocID[i].ateDate, responseJson.data.attendanceListByAssocID[i].atsTime,
                responseJson.data.attendanceListByAssocID[i].ateTime);
            } else {
              console.log('not today attendance', responseJson.data.attendanceListByAssocID[i].atAttndID + ' '
                + responseJson.data.attendanceListByAssocID[i].atsDate);
            }

          }

        } else {
          //alert('Not a Member');

        }

      })
      .catch((error) => {
        console.log('attendance ' + error)
      })

  }

  
  insert_GuardAttendance(attendance_id, association_id, guard_id, imei_no, start_date, end_date, start_time, end_time) {
   
  }

  exitApp = () => {
    RNExitApp.exitApp();
  };

  deleteUser = () => {
    var that = this;
   
  };
  onAssnPickerValueChange = (value, index) => {
    global.SelectedAssociationID = value;
    //global.AssociationName=results.rows.item(i).AsnName;
    console.log('Results dataSourceUnitPkr UnitID', value + ' ' + value);
  

    this.setState(
      {
        "AssnPickerValueHolder": value
      },

      () => {
        // here is our callback that will be fired after state change.
        //Alert.alert("Throttlemode", this.state.AssnPickerValueHolder+' ' +global.SelectedAssociationID);
        console.log('SelectedAssociationID ', this.state.AssnPickerValueHolder + ' ' + global.SelectedAssociationID);

      }
    );
  }

  syncUnits(assnID) {
    console.log('bf syncUnits ', assnID);

    console.log('unitlist start ', assnID)
    console.log('componentdidmount')
    //const url = 'http://oye247api.oye247.com/oye247/api/v1/OYEUnit/OYEUnitlist/'+assnID
    const url = 'http://' + global.oyeURL + '/champ/api/v1/Unit/GetUnitListByAssocID/' + assnID
    console.log(url)
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('unitlist in ', responseJson)
        this.setState({

          isLoading: false
        })

        if (responseJson.success) {
          console.log('ravii', responseJson);
          console.log('responseJson count unit ', responseJson.data.unit.length);
         
          for (let i = 0; i < responseJson.data.unit.length; ++i) {
            //     temp.push(results.rows.item(i));

            console.log('Results unit', responseJson.data.unit[i].unUniName + ' ' + responseJson.data.unit[i].unUnitID);

            this.insert_units(responseJson.data.unit[i].unUnitID,
              responseJson.data.unit[i].asAssnID,
              responseJson.data.unit[i].unUniName, responseJson.data.unit[i].unUniType,
              responseJson.data.unit[i].flFloorID, responseJson.data.unit[i].unIsActive,
              responseJson.data.unit[i].parkingLotNumber);

          }

         

        } else {
          console.log('failurre')
        }
      })
      .catch((error) => {
        this.setState({

          isLoading: false
        })
        console.log(error)
        console.log('unitlist err ', error)

      })
  }

  insert_units(unit_id, association_id, UnitName, type, admin_account_id, created_date_time, parking_slot_number
  ) {
    
  }

  //Screen1 Component
  render() {
    console.log('SelectedAssociationID ', global.SelectedAssociationID);

    return (
      <View style={{
        
        paddingTop: 2,justifyContent: 'center',
        alignItems: 'center',
        marginTop: 1
      }}>
        <ScrollView style={{ backgroundColor: 'white' }}>
          <Text>Guards Attendance {global.SelectedAssociationID} {global.SelectedUnitID}  {global.MyEmail}
            {global.MyMobileNumber} {global.SelectedRole} {global.SelectedRole1}
           </Text>
          <Text style={{
            color: '#000000', fontSize: 13, fontFamily: Fonts.Tahoma,
            textAlign: 'center'
          }}> Subscription Valid till: {this.state.SubscriptionValidity} </Text>

          <Text style={{
            color: '#000000', fontSize: 14, fontFamily: Fonts.Tahoma,
            fontWeight: 'bold', textAlign: 'center'
          }}>Welcome {global.MyFirstName} {global.MyLastName},
          </Text>

          <View style={{ flexDirection: "row" }}>
            <Picker
              selectedValue={this.state.AssnPickerValueHolder}
              style={{ width: '60%' }}
              onValueChange={this.onAssnPickerValueChange} >

              {this.state.dataSourceAssnPkr.map((item, key) => (
                <Picker.Item label={item.AsnName} value={item.AssociationID} key={key} />)
              )}

            </Picker>
            {/*   onValueChange={(itemValue, itemIndex) => {global.SelectedAssociationID=itemValue}} >
 */}
            <Picker
              selectedValue={this.state.UnitPickerValueHolder}
              style={{ width: '40%' }}
              onValueChange={(itemValue, itemIndex) => { global.SelectedUnitID = itemValue }} >

              {this.state.dataSourceUnitPkr.map((item, key) => (
                <Picker.Item label={item.UnitName} value={item.OYEUnitID} key={key} />)
              )}

            </Picker>
          </View>
          <View style={{
            flexDirection: "column", backgroundColor: 'white', padding: 10, borderColor: '#ED8A19',
            margin: 5, borderRadius: 5, borderWidth: 1, width: '90%', alignItems: 'center',
          }}>
            <Pie
              radius={65}
              //completly filled pie chart with radius 70
              series={[25, 30, 45]}
              innerRadius={40}
              //values to show and color sequentially
              colors={['#ED8A19', '#5B618A', '#E3D081']}
            />

            {/* <Mybutton
              title="Guard List"
              customClick={() => this.props.navigation.navigate('GuardListScreen')}
            /> */}
            <View style={{
              flex: 1, flexDirection: 'column', marginLeft: '2%', marginTop: 5, height: 40, backgroundColor:
                'white',
            }}>

              <TouchableOpacity
                style={{
                  paddingTop: 2, paddingRight: 12, paddingLeft: 12,
                  paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                }}
                onPress={() => this.props.navigation.navigate('GuardListScreen')}  /*Products is navigation name*/>
                <Image source={require('../pages/assets/images/eye_orange.png')}
                  style={{ height: 20, width: 25, margin: 2, alignSelf: 'center' }} />
                <Text style={{ fontSize: 13, fontFamily: Fonts.OpenSansRegular, color: 'black', paddingBottom: 10 }}> View Guard List </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text>Guards Attendance {this.state.guard_onduty_count}/{(this.state.guard_tot_count + this.state.guard_onduty_count)}</Text>
          
          <View style={{ flexDirection: "row" ,flex:7,width:'95%'}}>
          <TouchableOpacity
                style={{
                  paddingTop: 2, paddingRight: 2, paddingLeft: 2,flex:2,alignItems: 'center',
                  paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                }}
                onPress={() => this.props.navigation.navigate('ViewVisitorsScreen')}  /*Products is navigation name*/>
                <Image source={require('../pages/assets/images/my_visitors_orange.png')}
                  style={{ height: 25, width: 25, margin: 2, alignSelf: 'center' }} />
                <Text style={{ fontSize: 12, fontFamily: Fonts.OpenSansRegular, color: 'black', paddingBottom: 5 }}>My Visitors</Text>
              </TouchableOpacity>
             {/*  <Mybutton
              title="View Visitors "
              customClick={() => this.props.navigation.navigate('ViewVisitorsScreen')}
            /> */}
             <TouchableOpacity
                style={{
                  paddingTop: 2, paddingRight: 2, paddingLeft: 2,flex:3,alignItems: 'center',
                  paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                }}
                onPress={() => this.props.navigation.navigate('ViewRegularVisitorScreen')}  /*Products is navigation name*/>
                <Image source={require('../pages/assets/images/service_provider_orange.png')}
                  style={{ height: 25, width: 25, margin: 2, alignSelf: 'center' }} />
                <Text style={{ fontSize: 12, fontFamily: Fonts.OpenSansRegular, color: 'black', paddingBottom: 5 }}>Service Provider</Text>
              </TouchableOpacity>
             {/*  <Mybutton
              title="View Regular Visitor"
              customClick={() => this.props.navigation.navigate('ViewRegularVisitorScreen')}
            />
            <Mybutton
              title="Invite Guest"
              customClick={() => this.props.navigation.navigate('InviteGuestScreen')}
            />
 */}
             <TouchableOpacity
                style={{
                  paddingTop: 2, paddingRight: 2, paddingLeft: 2,flex:2,alignItems: 'center',
                  paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                }}
                onPress={() => this.props.navigation.navigate('InvitedGuestListScreen')}  /*Products is navigation name*/>
                <Image source={require('../pages/assets/images/invite_guest_orange.png')}
                  style={{ height: 25, width: 25, margin: 2, alignSelf: 'center' }} />
                <Text style={{ fontSize: 12, fontFamily: Fonts.OpenSansRegular, color: 'black', paddingBottom: 5 }}>Invite Guest</Text>
              </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" ,flex:3}}>
          <TouchableOpacity
                style={{
                  paddingTop: 2, paddingRight: 12, paddingLeft: 12,flex:1,alignItems: 'center',
                  paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                }}
                onPress={() => this.props.navigation.navigate('ResNavDrawerMenuScreen')}  /*Products is navigation name*/>
                <Image source={require('../pages/assets/images/eye_orange.png')}
                  style={{ height: 20, width: 25, margin: 2, alignSelf: 'center' }} />
                <Text style={{ fontSize: 13, fontFamily: Fonts.OpenSansRegular, color: 'black', paddingBottom: 10 }}> Nav Drawer </Text>
              </TouchableOpacity>
         {/*    <Mybutton
              title="Nav Drawer"
              customClick={() => this.props.navigation.navigate('ResNavDrawerMenuScreen')}
            /> */}
             <TouchableOpacity
                style={{
                  paddingTop: 2, paddingRight: 12, paddingLeft: 12,flex:1,alignItems: 'center',
                  paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                }}
                onPress={() => this.props.navigation.navigate('ViewmembersScreen')}  /*Products is navigation name*/>
                <Image source={require('../pages/assets/images/eye_orange.png')}
                  style={{ height: 20, width: 25, margin: 2, alignSelf: 'center' }} />
                <Text style={{ fontSize: 13, fontFamily: Fonts.OpenSansRegular, color: 'black', paddingBottom: 10 }}> View Members </Text>
              </TouchableOpacity>

           {/*  <Mybutton
              title="View Members "
              customClick={() => this.props.navigation.navigate('ViewmembersScreen')}
            /> */}
          </View>
          <View style={{ flexDirection: "row" ,flex:7,width:'95%'}}>
          <TouchableOpacity
                style={{
                  paddingTop: 2, paddingRight: 2, paddingLeft: 2,flex:2,alignItems: 'center',
                  paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                }}
                onPress={() => this.props.navigation.navigate('ViewVisitorsScreen')}  /*Products is navigation name*/>
                <Image source={require('../pages/assets/images/my_visitors_orange.png')}
                  style={{ height: 25, width: 25, margin: 2, alignSelf: 'center' }} />
                <Text style={{ fontSize: 12, fontFamily: Fonts.OpenSansRegular, color: 'black', paddingBottom: 5 }}>My Visitors</Text>
              </TouchableOpacity>
             {/*  <Mybutton
              title="View Visitors "
              customClick={() => this.props.navigation.navigate('ViewVisitorsScreen')}
            /> */}
             <TouchableOpacity
                style={{
                  paddingTop: 2, paddingRight: 2, paddingLeft: 2,flex:3,alignItems: 'center',
                  paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                }}
                onPress={() => this.props.navigation.navigate('SecurityDailyReportScreen')}  /*Products is navigation name*/>
                <Image source={require('../pages/assets/images/attendance_report_orange.png')}
                  style={{ height: 25, width: 25, margin: 2, alignSelf: 'center' }} />
                <Text style={{ fontSize: 12, fontFamily: Fonts.OpenSansRegular, color: 'black', paddingBottom: 5 }}>Attendance Report</Text>
              </TouchableOpacity>
             {/*  <Mybutton
              title="View Regular Visitor"
              customClick={() => this.props.navigation.navigate('ViewRegularVisitorScreen')}
            />
            <Mybutton
              title="View Incidents "
              customClick={() => this.props.navigation.navigate('ViewIncidentsScreen')}
            />
 */}
             <TouchableOpacity
                style={{
                  paddingTop: 2, paddingRight: 2, paddingLeft: 2,flex:2,alignItems: 'center',
                  paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                }}
                onPress={() => this.props.navigation.navigate('ViewIncidentsScreen')}  /*Products is navigation name*/>
                <Image source={require('../pages/assets/images/assigned_task_orange.png')}
                  style={{ height: 25, width: 25, margin: 2, alignSelf: 'center' }} />
                <Text style={{ fontSize: 12, fontFamily: Fonts.OpenSansRegular, color: 'black', paddingBottom: 5 }}>Assigned Task</Text>
              </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" ,flex:6,width:'95%'}}>
          <TouchableOpacity
                style={{
                  paddingTop: 2, paddingRight: 2, paddingLeft: 2,flex:2,alignItems: 'center',
                  paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                }}
                onPress={() => this.props.navigation.navigate('AdminSettingsScreen')}  /*Products is navigation name*/>
                <Image source={require('../pages/assets/images/admin_functions.png')}
                  style={{ height: 25, width: 25, margin: 2, alignSelf: 'center' }} />
                <Text style={{ fontSize: 12, fontFamily: Fonts.OpenSansRegular, color: 'black', paddingBottom: 5 }}>Admin Settings</Text>
              </TouchableOpacity>
             {/*   <Mybutton
              title="Admin Settings"
              customClick={() => this.props.navigation.navigate('AdminSettingsScreen')}
            /> */}
             <TouchableOpacity
                style={{
                  paddingTop: 2, paddingRight: 2, paddingLeft: 2,flex:2,alignItems: 'center',
                  paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                }}
                onPress={() => this.props.navigation.navigate('PatrollingListScreen')}  /*Products is navigation name*/>
                <Image source={require('../pages/assets/images/patrol_shifts_orange.png')}
                  style={{ height: 25, width: 25, margin: 2, alignSelf: 'center' }} />
                <Text style={{ fontSize: 12, fontFamily: Fonts.OpenSansRegular, color: 'black', paddingBottom: 5 }}>Patrolling List</Text>
              </TouchableOpacity>
             {/*   <Mybutton
              title="Patrolling List  "
              customClick={() => this.props.navigation.navigate('PatrollingListScreen')}
            />
              <Mybutton
              title="Check Point List "
              customClick={() => this.props.navigation.navigate('CheckPointListScreen')}
            />
 */}
             <TouchableOpacity
                style={{
                  paddingTop: 2, paddingRight: 2, paddingLeft: 2,flex:2,alignItems: 'center',
                  paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                }}
                onPress={() => this.props.navigation.navigate('CheckPointListScreen')}  /*Products is navigation name*/>
                <Image source={require('../pages/assets/images/checkpoint_orange.png')}
                  style={{ height: 25, width: 25, margin: 2, alignSelf: 'center' }} />
                <Text style={{ fontSize: 12, fontFamily: Fonts.OpenSansRegular, color: 'black', paddingBottom: 5 }}>Check Point List</Text>
              </TouchableOpacity>

          
          </View>
          <View style={{ flexDirection: "row" ,flex:6,width:'95%'}}>
          <TouchableOpacity
                style={{
                  paddingTop: 2, paddingRight: 2, paddingLeft: 2,flex:2,alignItems: 'center',
                  paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                }}
                onPress={() => this.props.navigation.navigate('EditProfileScreen')}  /*Products is navigation name*/>
                <Image source={require('../pages/assets/images/admin_functions.png')}
                  style={{ height: 25, width: 25, margin: 2, alignSelf: 'center' }} />
                <Text style={{ fontSize: 12, fontFamily: Fonts.OpenSansRegular, color: 'black', paddingBottom: 5 }}>Edit Profile</Text>
              </TouchableOpacity>
             {/*   <Mybutton
              title="Edit Profile "
              customClick={() => this.props.navigation.navigate('EditProfileScreen')}
            /> */}
             <TouchableOpacity
                style={{
                  paddingTop: 2, paddingRight: 2, paddingLeft: 2,flex:2,alignItems: 'center',
                  paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                }}
                onPress={() => this.props.navigation.navigate('ViewFamilyMembersListScreen')}  /*Products is navigation name*/>
                <Image source={require('../pages/assets/images/patrol_shifts_orange.png')}
                  style={{ height: 25, width: 25, margin: 2, alignSelf: 'center' }} />
                <Text style={{ fontSize: 12, fontFamily: Fonts.OpenSansRegular, color: 'black', paddingBottom: 5 }}>Family Member</Text>
              </TouchableOpacity>
             {/*    <Mybutton
              title="View Family Member "
              customClick={() => this.props.navigation.navigate('ViewFamilyMembersListScreen')}
            />
              
 */}
             <TouchableOpacity
                style={{
                  paddingTop: 2, paddingRight: 2, paddingLeft: 2,flex:2,alignItems: 'center',
                  paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                }}
                onPress={() => this.deleteUser.bind(this)}  /*Products is navigation name*/>
                <Image source={require('../pages/assets/images/logout.png')}
                  style={{ height: 25, width: 25, margin: 2, alignSelf: 'center' }} />
                <Text style={{ fontSize: 12, fontFamily: Fonts.OpenSansRegular, color: 'black', paddingBottom: 5 }}>Log Out</Text>
              </TouchableOpacity>

          
          </View>
          <View style={{ flexDirection: "column" }}>
           
          <Mybutton
              title="Log OUT "
              customClick={this.deleteUser.bind(this)}
            />
            {/*  <Mybutton
              title="Registration  "
              customClick={() => this.props.navigation.navigate('RegistrationPageScreen')}
            />
               <Mybutton
              title="Add Vehicles "
              customClick={() => this.props.navigation.navigate('AddVehiclesScreen')}
            />
              <Mybutton
              title="NotificationScreen   "
              customClick={() => this.props.navigation.navigate('NotificationScreen')}
            />
            <Mybutton
              title="NotificationScreen  2 "
              customClick={() => this.props.navigation.navigate('NotificationScreen2')}
            />
            */}
            
            {/*  <Mybutton
              title="Image Upload"
              customClick={() => this.props.navigation.navigate('UploadImageScreen')}
            /> */}
             <Mybutton
        title="BottomNavigationScreen"
        customClick={() => this.props.navigation.navigate('BottomNavigationScreen')}
      />  
       <Mybutton
        title="DrawerNavigator"
        customClick={() => this.props.navigation.navigate('DrawerNavigator')}
      />  
           
          </View>

          <View style={{ flexDirection: "row" }}>
           
          
          </View>

          <View style={{ flexDirection: "row" }}>
           {/*  <Mybutton
              title="Exit "
              customClick={this.exitApp.bind(this)}
            /> */}
         
          </View>

          <View style={{ flexDirection: "row" }}>
           {/*  <Mybutton
              title="QR Code "
              customClick={() => this.props.navigation.navigate('QRCodeGenScreen')}
            /> */}

            {/* <Pie
          radius={70}
          //completly filled pie chart with radius 70
          innerRadius={40}
          //to make donut pie chart define inner radius
          series={[10, 20, 30, 40]}
          //values to show and color sequentially
          colors={['#f00', '#0f0', '#00f', '#ff0']}
        />
        <Text>Donut Pie Chart</Text>
        
          <Pie
            radius={70}
            //completly filled pie chart with radius 100
            innerRadius={65}
            series={[55]}
            //values to show and color sequentially
            colors={['#f00']}
            backgroundColor="#ddd"
          /> */}
          </View>
         
        </ScrollView>
       {/*  <View style={{ flexDirection: "row",height:'100%',width:'50%', position: 'absolute',
    top: 0, left: 0,backgroundColor:'yellow' }}>
          
           </View> */}
      </View>
    );
  }
}

class Screen2 extends Component {
  //Screen2 Component
  render() {
   // this.props.navigation.navigate('GuardListScreen');
    return (


      <View
        style={mystyles.rectangle}>
        <Text style={{ fontSize: 23 }}> Screen ddddddddddd </Text>
        <View
          style={{ flex: 1, flexDirection: 'column' }}>

          <Text
            style={mystyles.title}>Hello World</Text>

          <Text
            style={mystyles.subtext}>Hello World</Text>

          <View
            style={{ flex: 1, flexDirection: 'row' }}>

            <View
              style={{ flex: 1, flexDirection: 'column' }}>

              <Text
                style={mystyles.text}>Country :
Hello World</Text>

              <Text
                style={mystyles.text}>Total Units :
Hello World</Text>

            </View>


          </View>

        </View>

      </View>


    );
  }
}

class Screen3 extends Component {
  //Screen3 Component
  render() {
    return (
      <View style={styles.MainContainer}>
        <Text style={{ fontSize: 23 }}> Screen 3 </Text>
      </View>
    );
  }
}

const FirstActivity_StackNavigator = StackNavigator({
  //All the screen from the Screen1 will be indexed here 
  First: {
    screen: Screen1,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <ResNavigationDrawerStructure navigationProps={navigation} />,
      title: 'Screen 1',
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});

const Screen2_StackNavigator = StackNavigator({
  //All the screen from the Screen2 will be indexed here
  Second: {
    screen: Screen2,
    // navigationOptions: ({ navigation }) => ({
    //   title: 'Screen 2',
    //   drawerLabel: 'Notifications',

    //   headerLeft: <ResNavigationDrawerStructure navigationProps={navigation} />,

    //   headerStyle: {
    //     backgroundColor: '#FF9800',
    //   },
    //   headerTintColor: '#fff',
    // }),
  },
});

const Screen3_StackNavigator = StackNavigator({
  //All the screen from the Screen3 will be indexed here
  Third: {
    screen: Screen3,
    navigationOptions: ({ navigation }) => ({
      title: 'Screen3',
      headerLeft: <ResNavigationDrawerStructure navigationProps={navigation} />,

      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});

const DrawerNavigatorExample = DrawerNavigator({
  //Drawer Optons and indexing
  Screen1: { //Title
    screen: FirstActivity_StackNavigator,
    title: 'Resident Dashboard '
  },

  Screen2: {//Title
    title: 'Deeee',
    screen: Screen2,
    navigationOptions: {
      title: 'NotificationScreen ',
       headerStyle: { backgroundColor: '#FA9917' },
      // headerTintColor: '#ffffff',
    },
  },

  Screen3: {//Title
    screen: Screen3_StackNavigator,
  },
});
export default DrawerNavigatorExample;//Screen1 ;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    marginTop: 50,
    justifyContent: 'center',
    backgroundColor: 'white'
  },
});