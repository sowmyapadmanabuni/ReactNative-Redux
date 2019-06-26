import React, { Component } from 'react';
import { AppRegistry, Platform, Alert, TouchableOpacity, ScrollView, PermissionsAndroid, StyleSheet, Text, Image, View, FlatList, ActivityIndicator } from 'react-native';

import { DatePickerDialog } from 'react-native-datepicker-dialog'
import moment from 'moment';
import { Fonts } from '../pages/src/utils/Fonts'


export default class Securityattendance extends Component {
  ShowCurrentDate = () => {

    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    Alert.alert(date + '-' + month + '-' + year);

  }
  static navigationOptions = {
    title: 'DailyHelp Report',
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
      <View style={{ backgroundColor: '#FFFEFE' }}  >
        <View style={{ flex: 1, flexDirection: 'row', padding: 2 }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {/* if({item.oyeMemberRoleID}==1){
                      <Text> admin </Text>
                   }else{
                       <Text>rejected</Text> 
                   } */}

            {/* <Text style={mystyles.title}>{item.oyeUnitID}</Text> */}
            {/* <Text style={mystyles.guard_name}> </Text>  */}

            <Text style={styles.intime}>{item.atsTime.substring(11, 21)} </Text>
            <Text style={styles.intime}>{item.ateTime.substring(11, 21)} </Text>
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
    console.log('params', this.props.navigation.state.params.fname + '' + this.props.navigation.state.params.id);
    console.log('componentdidmount')
    const url = 'http://' + global.oyeURL + '/oye247/api/v1/Attendance/GetAttendanceListByAttendyID/'+global.SelectedAssociationID
    const url1 = 'http://' + global.oyeURL + '/oye247/api/v1/Attendance/GetAttendanceList'
    console.log(url1)
    fetch(url1, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('ravii workers', responseJson);

        this.setState({
          dataSource: responseJson.data.attendance,
          dataSource: responseJson.data.attendance.filter(x => x.wkWorkID == this.props.navigation.state.params.id),

          isLoading: false
        })

        
      })
      .catch((error) => {
        console.log(error)
      })
  }
  SampleFunction = () => {

    // Write your own code here, Which you want to execute on Floating Button Click Event.
    Alert.alert("Floating Button Clicked");

  }
  namebyid() {
    
    return this.state.WorkerName;

  }
  render() {
    // console.log('ravi',this.state.dobText.toString())
    const { navigate } = this.props.navigation;
    return (

      this.state.isLoading
        ?

        <View style={{ backgroundColor: '#FFF', height: '100%' }}>
        <View>
        <View style={{flexDirection:'row',}}>
                    <View style={{flex:1, marginTop:43,marginRight:0, justifyContent:'center',marginLeft:10}}>
                        <TouchableOpacity onPress={() => navigate(('GuardListScreen'), { cat: '' })}
                        >
                        <Image source={require('../pages/assets/images/back.png')}
                        style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                        </TouchableOpacity>
                    </View>
                    {/* <TouchableOpacity 
                        style={{paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 1, alignItems: 'center', flexDirection: 'row',
                            paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:'6%'}}
                            onPress={() => this.props.navigation.navigate('SideMenu')}>
                        <Image source={require('../pages/assets/images/menu_button.png')}
                            style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                    </TouchableOpacity> */}
                    <View style={{ flex: 5, alignItems:'center', justifyContent:'center'}}>
                    <Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
                        style={{height: 40, width: 95, marginTop: 45,marginBottom:5}} />
                    </View>  
                    <View style={{flex:1,marginTop:45, marginRight:10, justifyContent:'center',}}>    
                    </View>                 
                </View> 

                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>Guard Attendance</Text>


          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#330066" animating />
          </View>
        </View>
        :
        <View style={{ backgroundColor: '#FFF' }}>
         <View>
        <View style={{flexDirection:'row',}}>
                    <View style={{flex:1, marginTop:43,marginRight:0, justifyContent:'center',marginLeft:10}}>
                        <TouchableOpacity onPress={() => navigate(('GuardListScreen'), { cat: '' })}
                        >
                        <Image source={require('../pages/assets/images/back.png')}
                        style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                        </TouchableOpacity>
                    </View>
                    {/* <TouchableOpacity 
                        style={{paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 1, alignItems: 'center', flexDirection: 'row',
                            paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:'6%'}}
                            onPress={() => this.props.navigation.navigate('SideMenu')}>
                        <Image source={require('../pages/assets/images/menu_button.png')}
                            style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                    </TouchableOpacity> */}
                    <View style={{ flex: 5, alignItems:'center', justifyContent:'center'}}>
                    <Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
                        style={{height: 40, width: 95, marginTop: 45,marginBottom:5}} />
                    </View>  
                    <View style={{flex:1,marginTop:45, marginRight:10, justifyContent:'center',}}>    
                    </View>                 
                </View> 

                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>Guard Attendance</Text>


          </View>
          <View style={{ height: '15%' }}>
            <View style={{ flex: 1, justify: 'center', flexDirection: 'row' }}>
              <Text style={{ fontSize: 18, color: 'black', marginTop: 10, marginLeft: 15 }}> Attendance report for :{this.props.navigation.state.params.fname} {this.props.navigation.state.params.lname}</Text>

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
                {/* <Text style={mystyles.hguard_name}></Text> */}
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

  intime:{
    fontSize:   14 ,
    color : 'black',
    marginLeft:15
    },
  hintime:{
    fontSize:  14,
    color :   'black',
    marginLeft:15
    },
  FloatingButtonStyle: {

    resizeMode: 'contain',
    width: 50,
    height: 50,
  }
});
AppRegistry.registerComponent('createassociation', () => createassociation);
