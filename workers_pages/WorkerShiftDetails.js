import React, { Component } from 'react';
import {
  AppRegistry, Platform, StyleSheet, Text, View, FlatList, ActivityIndicator,
  Button, Alert, filter, Image, TouchableOpacity
} from 'react-native';
import Moment from 'moment';
import { Fonts } from '../pages/src/utils/Fonts';

import ActionButton from 'react-native-action-button';


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
  }

  handlePress(url) {
    
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
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

  
  insert_ShiftDetails(shift_id, association_id, worker_name, shift_startdate, shift_enddate, shift_starttime, shift_endtime,
    weekly_off, created_time, status) {

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

