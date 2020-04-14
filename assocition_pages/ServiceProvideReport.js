import React, { Component } from 'react';
import { AppRegistry, Platform, Alert, TouchableOpacity, ScrollView, PermissionsAndroid, StyleSheet, Text, Image, View, FlatList, ActivityIndicator } from 'react-native';

import { DatePickerDialog } from 'react-native-datepicker-dialog'
import moment from 'moment';
import { openDatabase } from 'react-native-sqlite-storage';
import { Fonts } from '../pages/src/utils/Fonts'

var db = openDatabase({ name: global.DB_NAME });

export default class DailyHelpList extends Component {
  ShowCurrentDate = () => {

    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    Alert.alert(date + '-' + month + '-' + year);

  }
  static navigationOptions = {
    title: 'dailyHelp Report',
    headerStyle: {
      backgroundColor: '#696969',
    },
    headerTitleStyle: {
      color: '#fff',
    }
  };

  async componentDidMount() {

    await request_location_runtime_permission()

  }

  constructor() {
    super()
    this.state = {
      dataSource: [],
      isLoading: true,
      dobText: '2018-10-13',
      dobDate: null,
      imageLoading: true,
      WorkerId: 8,
      WorkerName: [],
      chosenDate: new Date(),

    }

    this.setDate = this.setDate.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    console.log('anu123', 'constructor');
    console.log('hidarling', this.state.WorkerId);
    this.name = this.namebyid.bind(this, this.state.WorkerId);
  }
  onDOBPress = () => {
    let dobDate = this.state.dobDate;

    if (!dobDate || dobDate == null) {
      dobDate = new Date();
      this.setState({
        dobDate: dobDate
      });
      this.makeRemoteRequest();
    }
    this.refs.dobDialog.open({
      date: dobDate,
      maxDate: new Date() //To restirct future date
    });

  }
  onDOBDatePicked = (date) => {
    this.setState({
      dobDate: date,
      dobText: moment(date).format('YYYY-MM-DD')

    });
    this.makeRemoteRequest();
  }
  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });
    this.makeRemoteRequest();
  }
  setDate(newDate) {
    this.setState({ chosenDate: newDate });
    this.makeRemoteRequest();
  }

  renderItem = ({ item }) => {
    const { navigate } = this.props.navigation;

    return (
      <View style={{ backgroundColor: '#FFFEFE' }}>
        <View style={{ flex: 1, flexDirection: 'row', padding: 2 }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {/* if({item.oyeMemberRoleID}==1){
                      <Text> admin </Text>
                   }else{
                       <Text>rejected</Text> 
                   } */}

            {/* <Text style={mystyles.title}>{item.oyeUnitID}</Text> */}

            <Text style={styles.guard_name}> {item.vlfName} {item.vllName}</Text>
            <Text style={styles.intime}>{item.vlEntryT.substring(11, 21)} </Text>
            <Text style={styles.intime}>{item.vlExitT.substring(11, 21)} </Text>

            {/* <Text style={mystyles.text}>{item.oyeMemberRoleID} </Text> */}
            {/* <Text style={mystyles.text}>{item.email}</Text> */}
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
    console.log('anu', this.state.dobText.toString);
    this.makeRemoteRequest();

  }

  makeRemoteRequest = () => {
    const { params } = this.props.navigation.state;
    // console.log(params.id)
    console.log('componentdidmount')
    const url = 'http://' + global.oyeURL + '/oyesafe/api/v1/VisitorLog/GetVisitorLogListByAssocID/'+ global.SelectedAssociationID
    console.log(url)
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
          dataSource: responseJson.data.visitorLog,
          // dataSource: responseJson.data.visitorLog.filter(x => x.vlVisLgID ==3),
          isLoading: false
        })

        console.log('anu', this.state.dataSource);
      })
      .catch((error) => {
        console.log(error)
      })
  }
  SampleFunction = () => {

    // Write your own code here, Which you want to execute on Floating Button Click Event.
    Alert.alert("Floating Button Clicked");

  }
  namebyid(Workerid) {
    db.transaction(tx => {
      tx.executeSql('SELECT FName FROM Workers where WorkID=?', [Workerid], (tx, results) => {
        for (let i = 0; i < results.rows.length; i++) {
          this.setState({
            WorkerName: results.rows.item(0).FName
          });
          console.log('check db',
            this.state.WorkerName + ',' + this.state.WorkerId);
        }
        console.log('check db',
          results.rows.length + "," + results.rows.item(0).FName);
        this.setState({
          panCount: results.rows.item,
        });

      });

    });
    return this.state.WorkerName;

  }
  render() {
    // console.log('ravi',this.state.dobText.toString())
    return (

      this.state.isLoading
        ?

        <View style={{ backgroundColor: '#FFF', height: '100%' }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#330066" animating />
          </View>
        </View>
        :
        <View style={{ backgroundColor: '#FFF' }}>
          <View style={{ height: '15%' }}>
            <View style={{ flex: 1, justify: 'center', flexDirection: 'row' }}>
              {/* <Text style={{ fontSize: 14, color: 'orange',marginTop:10}}>Select date</Text>
                <TouchableOpacity onPress={this.onDOBPress.bind(this)} >
                      <View style={styles.datePickerBox}>
                        <Text style={styles.datePickerText}>{this.state.dobText}</Text>
                      </View>
                   </TouchableOpacity>
                    <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} /> */}

            </View>
            <View style={{ height: '40%', flex: 1, flexDirection: 'row', padding: 2, marginTop: 5 }}>
              <View style={{ flex: 1, justify: 'center', flexDirection: 'row' }}>
                <Text style={styles.hguard_name}>Name</Text>
                <Text style={styles.hintime}>In Time</Text>
                <Text style={styles.hintime}>Out time</Text>
              </View>
            </View>
          </View>
          <View style={{ height: '80%' }}>
            <ScrollView>
              <FlatList
                data={this.state.dataSource}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => item.name}
                ItemSeparatorComponent={this.renderSeparator}
              />
            </ScrollView>
            <TouchableOpacity activeOpacity={0.5} onPress={this.SampleFunction} style={styles.TouchableOpacityStyle} >
            </TouchableOpacity>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCDCDC',
  },
  hguard_name: {
    fontSize: 14,
    fontFamily: Fonts.OpenSansRegular,
    color: 'black',
    marginBottom: 8,
    marginRight: 20,
    width: '35%'
  },
  hintime: {
    fontSize: 14,
    fontFamily: Fonts.OpenSansRegular,
    color: 'black',
    marginLeft: 15
  },

  guard_name: {
    fontSize:  14,
    fontFamily:Fonts.OpenSansRegular,
    color: 'black',
    marginBottom: 8,
    marginRight: 20,
    width: '35%'
  },

  intime: {
    fontSize: 14,
    fontFamily:Fonts.OpenSansRegular,
    color:  'black',
    marginLeft: 15
  },

  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  datePickerBox: {
    marginTop: 9,
    borderColor: 'orange',
    borderWidth: 0.5,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    height: 18,
    fontSize: 14,
    justifyContent: 'center',
    marginLeft: 120
  },
  datePickerText: {
    fontSize: 14,
    marginLeft: 5,
    borderWidth: 0,
    color: 'orange',
  },

  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
  }
});
AppRegistry.registerComponent('createassociation', () => createassociation);
