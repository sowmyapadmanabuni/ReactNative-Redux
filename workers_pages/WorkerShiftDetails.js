import React, { Component } from 'react';
import {
  AppRegistry, Platform, StyleSheet, Text, View, FlatList, ActivityIndicator,
  Button, Alert, filter, Image, TouchableOpacity
} from 'react-native';
import Moment from 'moment';
import { openDatabase } from 'react-native-sqlite-storage';
import { Fonts } from '../pages/src/utils/Fonts';

import ActionButton from 'react-native-action-button';

var db = openDatabase({ name: global.DB_NAME });

export default class WorkerShiftDetails extends Component {

  static navigationOptions = {
    title: 'Worker Shift Details',
    headerStyle: {
      backgroundColor: '#696969',
    },
    headerTitleStyle: {
      color: '#fff',
    }
  };

  constructor() {
    super()
    this.state = {
      dataSource: [],
      isLoading: true
    }
    console.log('anu123', 'constructor');
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT * FROM sqlite_master WHERE type='table' AND name='WorkerShiftDetails1'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {

            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS WorkerShiftDetails1( WorkerShiftID INTEGER,AssociationID INTEGER ,'
              + ' WorkerName VARCHAR(30), ShiftStartDate VARCHAR(25), ShiftEndDate VARCHAR(25), ShiftStartTime VARCHAR(25), ShiftEndTime VARCHAR(25), '
              + ' Weeklyoff VARCHAR(30), CreatedTime VARCHAR(30),Status VARCHAR(30) )',
              []
            );

            // create table IF NOT EXISTS Attendance(AttendanceID integer , " +
            //" GuardID integer , AssociationID integer , IMEINo VARCHAR(30), StartDate VARCHAR(20),EndDate VARCHAR(20),  " +
            //" StartTime VARCHAR(10), StartGPSPoint VARCHAR(30), " +
            //" EndTime VARCHAR(10) , EndGPSPoint VARCHAR(30) )

          }
        }
      );
    });
  }

  handlePress(url) {
    //console.tron.log('Trying to access url')
    //console.tron.log(url)
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        //console.tron.log('Can\'t handle url: ' + url)
      } else {
        return Linking.openURL(url)

      }
    }).catch(err => console.error('An error occurred', err))
  }

  renderItem = ({ item }) => {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ backgroundColor: '#FFF' }}>
  
<View style={{ height: '100%' }}>

        <View style={{flexDirection:'row',}}>
                    <View style={{flex:0.5, marginTop:43,marginRight:0, justifyContent:'center',marginLeft:10}}>
                        <TouchableOpacity onPress={() => navigate(('ResDashBoard'), { cat: '' })}
                        >
                        <Image source={require('../pages/assets/images/back.png')}
                        style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity 
                        style={{paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 1, alignItems: 'center', flexDirection: 'row',
                            paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:'6%'}}
                            onPress={() => this.props.navigation.navigate('SideMenu')}>
                        <Image source={require('../pages/assets/images/menu_button.png')}
                            style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <View style={{ flex: 5, alignItems:'center', justifyContent:'center',marginRight:'6%'}}>
                    <Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
                        style={{height: 40, width: 95, marginTop: 45,marginBottom:5}} />
                    </View>  
                    <View style={{flex:1,marginTop:45, marginRight:10, justifyContent:'center',}}>    
                    </View>                 
                </View> 

                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>My Guests</Text>
      <View>
        <View style={styles.rectangle}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.title}>{item.wswstName} </Text>
            <Text style={styles.subtext}>Shift Details</Text>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={styles.subtext}>From: {item.wssDate.substring(0, 10)}</Text>
              <Text style={styles.subtext}>To: {item.wseDate.substring(0, 10)}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={styles.subtext}>From: {item.wssTime.substring(11, 19)}</Text>
              <Text style={styles.subtext}>To: {item.wseTime.substring(11, 19)}</Text>
            </View>
            <Text style={styles.subtext}>Weekly off : {item.wsWeekOff}</Text>
            {/* <TouchableOpacity
                     onPress={() => Communications.phonecall(item.mobileNumber, true)}>
                     <View style={{flex:1,flexDirection:'row'}}>
                        <Image
                        source={require('../pages/assets/images/phone.png')}
                        style={{height:20,width:20,alignItems:"center"}}/>
                        <Text style={mystyles.text}>{item.mobileNumber}</Text>
                     </View>
                     </TouchableOpacity> */}
          </View>
        </View>
      </View>
      </View>
      </View>
    )
  }
  renderSeparator = () => {
    return (
      <View
        style={{ height: 2, width: '100%', backgroundColor: '#fff' }}>
      </View>
    )
  }

  componentDidMount() {
    console.log('GetWorkerShiftTiming componentdidmount')
    const url = 'http://' + global.oyeURL + '/oye247/api/v1/WorkerShiftTiming/GetWorkerShiftTimingListByAssocID/' + global.SelectedAssociationID
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          dataSource: responseJson.data.workerShiftTiming,
          isLoading: false
        })
        console.log('GetWorkerShiftTiming responseJson', responseJson);
        if (responseJson.success) {
          console.log('GetWorkerShiftTiming count', responseJson.data.workerShiftTiming.length);
          for (let i = 0; i < responseJson.data.workerShiftTiming.length; ++i) {

            this.insert_ShiftDetails(responseJson.data.workerShiftTiming[i].wsWrkSTID,
              responseJson.data.workerShiftTiming[i].asAssnID, responseJson.data.workerShiftTiming[i].wswstName,
              responseJson.data.workerShiftTiming[i].wssDate,
              responseJson.data.workerShiftTiming[i].wseDate, responseJson.data.workerShiftTiming[i].wssTime,
              responseJson.data.workerShiftTiming[i].wseTime, responseJson.data.workerShiftTiming[i].wsWeekOff,
              responseJson.data.workerShiftTiming[i].wsdCreated, responseJson.data.workerShiftTiming[i].wsIsActive);

          }

        } else {
          alert('No Worker Shifts');
        }
      })
      .catch((error) => {
        console.log(error);
        alert('Error in getting Shifts');
      })

  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      this.state.isLoading
        ?
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#330066" animating />
        </View>
        :
        <View style={{ backgroundColor: '#fff', flex: 7, justifyContent: 'space-between' }}>
          <View style={{ flex: 6, justifyContent: 'center', }}>
            <FlatList

              data={this.state.dataSource}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => item.name}
              ItemSeparatorComponent={this.renderSeparator}
            />
          </View>
          <View style={{ flex: 1, justifyContent: 'center', }}>
            <ActionButton style={{ flex: 1, backgroundColor: '#fff', }} buttonColor="rgba(250,153,23,1)"
              onPress={() => navigate('CreateWorkerShiftScreen', { cat: ' ' })}  >

            </ActionButton>
          </View>
        </View>
    );
  }

  /* SecurityGuard( GuardID INTEGER, AccountID INTEGER, AssociationID INTEGER ,'
  +' OYEMemberID VARCHAR(40), OYEMemberRoleID VARCHAR(20), GuardRoleID VARCHAR(20), FirstName VARCHAR(20), LastName VARCHAR(30), ' 
  +' MobileNumber VARCHAR(20), PhotoName VARCHAR(200), CreatedDate VARCHAR(20), AadharNumber VARCHAR(20),  ' 
  +' Status VARCHAR(30) ) */

  //guard_id,association_id,oye_memberid,oye_member_roleid,guard_roleid,first_name,last_name,
  //mobile_number, aadhar_number, status
  insert_ShiftDetails(shift_id, association_id, worker_name, shift_startdate, shift_enddate, shift_starttime, shift_endtime,
    weekly_off, created_time, status) {

    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO WorkerShiftDetails1(WorkerShiftID, AssociationID, WorkerName, ShiftStartDate, ShiftEndDate,ShiftStartTime,ShiftEndTime, Weeklyoff, ' +
        ' CreatedTime , Status) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [shift_id, association_id, worker_name, shift_startdate, shift_enddate, shift_starttime, shift_endtime,
          weekly_off, created_time, status],
        (tx, results) => {
          console.log('Results WorkerShiftDetails1', results.rowsAffected);

        }
      );
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCDCDC',
  },
  subtext: { fontSize: 12,  color: 'black', margin: 2, },
  title: { fontSize: 14,  color: 'black', marginBottom: 8, },
  rectangle: {
    flex: 1, backgroundColor: 'white', padding: 10, borderColor: 'orange',
    marginLeft: 5, marginRight: 5, marginTop: 5, borderRadius: 2, borderWidth: 1,
  },

});

//AppRegistry.registerComponent('guardlist', () => guardlist);