import React, { Component } from 'react';
import {
  AppRegistry, TouchableHighlight, Platform, Alert, TouchableOpacity,
  ScrollView, PermissionsAndroid, StyleSheet, Button, Text, Image, View, FlatList, ActivityIndicator
} from 'react-native';
import { DatePickerDialog } from 'react-native-datepicker-dialog'
import moment from 'moment';
import Communications from 'react-native-communications';
import ImageLoad from 'react-native-image-placeholder';
//import { Fonts } from '../pages/src/utils/Fonts';
import {connect} from 'react-redux';

var date = new Date().getDate();
var month = new Date().getMonth() + 1;
var year = new Date().getFullYear();

class ViewVisitorsList extends Component {
  static navigationOptions = {
    tabBarLabel: 'ViewVisitorsList',
    drawerIcon: ({tintColor}) => {
        return (
          <Image source={require('../../../icons/OyeSpace.png')}
          style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
        );
    }
}
  ShowCurrentDate = () => {
    Alert.alert(date + '-' + month + '-' + year);
  }

  async componentDidMount() {
    await request_location_runtime_permission()
  }

  static navigationOptions = {
    title: 'View VisitorList',
    headerStyle: { backgroundColor: '#696969', },
    headerTitleStyle: { color: '#fff', }
  };

  constructor() {
    super()
    this.state = {
      dataSource: [],
      isLoading: true,
      dobText:  moment(new Date()).format('YYYY-MM-DD'),//year + '-' + month + '-' + date,
      dobDate: null,
      imageLoading: true,
      chosenDate: new Date(),

    }

    this.setDate = this.setDate.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    console.log('anu123', 'constructor');

  }

  updatePersssion = (peermissionStatus, visitorId, assnID) => {
    console.log('anu123', peermissionStatus + ' ' + visitorId + ' ' + assnID);

    member = {
      "VLCmnts": peermissionStatus,
      "VLCmntImg": "",
      "FMID": 4,
      "VLVisLgID": visitorId
    }
    console.log('member', member);
    //http://122.166.168.160/oyesafe/api/v1/VisitorCommentAndFMID/Update
    fetch('http://' + this.props.oyeURL + '/oyesafe/api/v1/VisitorCommentAndFMID/Update',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
        },
        body: JSON.stringify(member)
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          console.log('response', responseJson);
          //alert('member added suceefully !')
          ///FCM Start
          fcmMsg = {
            "data": {
              "activt": "childExitApproved",
              "name": this.props.MyFirstName + " " + this.props.MyLastName,
              "nr_id": visitorId,
              "entry_type": peermissionStatus,
              "mobile": this.props.MyMobileNumber,
            },
            "to": "/topics/AllGuards" + assnID,
          }
          console.log('fcmMsg ', fcmMsg);
          fetch('https://fcm.googleapis.com/fcm/send',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                "Authorization": "key=AAAAZFz1cFA:APA91bHV9vd8g4zSMR13q_IYrNmza0e0m0EgG4BJxzaQOcH3Nc3RRrTfYNyRryEgz0iDQwXhP-XYHAGOIcgYjLOf2KnwYp-6_9XKNdiYzjakfnFFruYz89BXpc474OWJBU_ZzCScV6Zy",
              },
              body: JSON.stringify(fcmMsg)
            })
            .then((response) => response.json())
            .then((responseJson) => {
              console.log('response fcmMsg', responseJson);
              if (responseJson.success) {
                //alert('member added suceefully !')
              } else {
                console.log('hiii', responseJson);
               // alert('fcmMsg failed  !')
              }
            })
            .catch((error) => {
              console.error(error);
              alert('caught error in fcmMsg');
            });
          ///FCM end
        }
        else {
          console.log('hiii', responseJson);
          alert('failed to add member !');
        }
        console.log('suvarna', 'hi');
      })
      .catch((error) => {
        console.error(error);
        alert('caught error in adding member');
      });
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

    console.log('renderitem ' + this.props.viewImageURL + 'PERSONAssociation' + item.asAssnID + 'NONREGULAR' + item.vlVisLgID + '.jpg');

    const { navigate } = this.props.navigation;
    const timeMessage = <View style={{ flexDirection: 'row' }}>
      {/* <Image
        source={require('../../../icons/enter.png')}
        style={{ height: 15, width: 15, marginRight: 5, alignItems: "center" }} /> */}
      <Text style={styles.text}>
        {item.vlEntryT.substring(11, 16)}</Text>
      {/* <Image
        source={require('../../../icons/exit.png')}
        style={{ height: 15, width: 15, marginRight: 5, paddingRight: 5, alignItems: "center", marginLeft: 30 }} /> */}
      <Text style={styles.text}>{item.vlExitT.substring(11, 16)}</Text>
    </View>;
    const childExitOptions = <View style={{ flexDirection: 'row' }}><TouchableOpacity
      style={styles.mybutton1}
      onPress={this.updatePersssion.bind(this, "Approved", item.vlVisLgID, item.asAssnID)}

             /*Products is navigation name  onPress={() => navigate('Unit', { id: item.asAssnID })} */>
      <Text style={styles.lighttext}> Allow </Text>
    </TouchableOpacity><TouchableOpacity
      style={styles.mybutton1}
      onPress={this.updatePersssion.bind(this, "Rejected", item.vlVisLgID, item.asAssnID)}  /*Products is navigation name*/>
        <Text style={styles.lighttext}> Reject </Text>
      </TouchableOpacity></View>;
    const courierEntryOptions = <View style={{ flexDirection: 'row' }}><TouchableOpacity
      style={styles.mybutton1}
      onPress={this.updatePersssion.bind(this, "Approved", item.vlVisLgID, item.asAssnID)}

              /*Products is navigation name  onPress={() => navigate('Unit', { id: item.asAssnID })} */>
      <Text style={styles.lighttext}> Allow </Text>
    </TouchableOpacity><TouchableOpacity
      style={styles.mybutton1}
      onPress={this.updatePersssion.bind(this, "Leave at Guard", item.vlVisLgID, item.asAssnID)}  /*Products is navigation name*/>
        <Text style={styles.lighttext}> Reject </Text>
      </TouchableOpacity></View>;
    const buttonUpdateDetails = <View style={{ flexDirection: 'row' }}><TouchableOpacity
      style={styles.mybutton1}
      onPress={() => navigate('UpdateDetailsScreen', { vlVisLgID: item.vlVisLgID, asAssnID: item.asAssnID })}

              /*Products is navigation name  onPress={() => navigate('Unit', { id: item.asAssnID })} */>
      <Text style={styles.lighttext}> Update Details </Text>
    </TouchableOpacity></View>;
    //PERSON+"Association"+prefManager.getAssociationId()+NONREGULAR+movie.getOYERegularVisitorID()+".jpg"
    //http://cohapi.careofhomes.com/Images/PERSONAssociation30NONREGULAR97.jpg
    //  console.log('NONREGULAR '+item.vlfName, 'http://cohapi.careofhomes.com/Images/PERSONAssociation' + item.asAssnID + 'NONREGULAR' + item.vlVisLgID + '.jpg  ' );
    return (
      <View style={{
        flex: 1, backgroundColor: 'white', padding: 5, borderColor: 'orange',
        marginLeft: 5, marginRight: 5, marginTop: 5, borderRadius: 2, borderWidth: 1,
      }}>
        <View style={{ flex: 3, flexDirection: 'row', padding: 1 }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>

            <TouchableHighlight
              style={[styles.profileImgContainer, { borderColor: 'orange', borderWidth: 1 }]} >
              { item.vlVisType === 'STAFF' ?
                <ImageLoad
                style={{ width: 100, height: 100, marginRight: 10 }}
                style={styles.profileImg}
                loadingStyle={{ size: 'large', color: 'blue' }}
                source={{ uri: this.props.viewImageURL + 'PERSONAssociation' + item.asAssnID + 'STAFF' + item.reRgVisID + '.jpg' }} />
                :
                <ImageLoad
                style={{ width: 100, height: 100, marginRight: 10 }}
                style={styles.profileImg}
                loadingStyle={{ size: 'large', color: 'blue' }}
                source={{ uri: this.props.viewImageURL + 'PERSONAssociation' + item.asAssnID + 'NONREGULAR' + item.vlVisLgID + '.jpg' }} />
                }
              {/* <ImageLoad
                style={{ width: 70, height: 70, marginRight: 10 }}
                style={styles.profileImg}
                loadingStyle={{ size: 'large', color: 'blue' }}
                source={{ uri: this.props.viewImageURL + 'PERSONAssociation' + item.asAssnID + 'NONREGULAR' + item.vlVisLgID + '.jpg' }} /> */}

            </TouchableHighlight>
            <TouchableHighlight style={[styles.vehicleNum, {width:100}]}
              underlayColor='#fff'>
              <Text>{item.vlVehNum}</Text>
            </TouchableHighlight>
          </View>

          <View style={{ flex: 2, flexDirection: 'column', marginLeft: 5 }}>
            <Text style={styles.title}>{item.vlfName + ' ' + item.vllName}</Text>
            {item.vlEntryT.substring(11, 16) === '00:00' && item.vlVisType === 'Child_Exit'
              && item.vlCmnts === '' ? childExitOptions : item.vlEntryT.substring(11, 16) === '00:00'
                && item.vlVisType === 'Service Provider'
                && item.vlCmnts === '' ? courierEntryOptions : timeMessage}

            <Text style={styles.text}>Visiting : {item.unUniName}</Text>
            <TouchableOpacity onPress={() =>
              Communications.phonecall(item.vlMobile, true)}>
              <View
                style={{ flex: 1, flexDirection: 'row' }}>
                {/* <Image
                  source={require('../../../icons/call_answer_green.png')}
                  style={{ height: 15, width: 15, alignItems: "center" }} /> */}
                <Text style={styles.text}>{item.vlMobile}</Text>
              </View>
            </TouchableOpacity>
            <View
              style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={styles.text}>Visitor Type : {item.vlVisType}  </Text>
              {item.vlEntryT.substring(11, 16) === '00:00' && item.vlVisType === 'Child_Exit'
                && item.vlCmnts === '' ? <Text style={styles.text}> </Text> : <Text style={styles.text}>{item.vlCmnts}  </Text>}
            </View>
            <Text style={styles.text}>Number of persons : {item.vlVisCnt}</Text>
            {/* <Image source={require('./team.png')}  /> */}
            {item.vlExitT.substring(11, 16) === '00:00' && item.vlVisType === 'Regular'
              && item.vlCmnts === '' ? buttonUpdateDetails : <Text style={styles.text}> </Text>}
            {item.vlExitT.substring(11, 16) === '00:00' && item.vlVisType === 'ServiceProvider'
              && item.vlCmnts === '' ? buttonUpdateDetails : <Text style={styles.text}> </Text>}

          </View>
          {/* <View style={{ backgroundColor: 'lightgrey', flexDirection: "column", width: 1, height:'80%', justifyContent:'center' }}></View> */}
          {/* <View style={{flex:.6, justifyContent:'center'}}>
          <TouchableOpacity onPress={() =>
              Communications.phonecall(item.vlMobile, true)}>
        <Image  
                 style={{margin:10, height:40, width:40}}
                source={require('../pages/assets/images/call_answer_green.png')}  
              
                 />

             </TouchableOpacity>    

          </View>   */}
        </View>
        
        {/* <Image source={{uri: 'http://cohapi.careofhomes.com/Images/PERSONAssociation30NONREGULAR'+item.oyeNonRegularVisitorID+'.jpg'}}
       style={{width: 40, height: 40,resizeMode : 'stretch'}} /> */}
      </View>
    )

  }

  renderSeparator = () => {
    return (
      <View style={{ height: 2, width: '100%', backgroundColor: '#fff' }}>
      </View>
    )

  }

  componentDidMount() {
    console.log('anu', this.state.dobText.toString);
    this.makeRemoteRequest();

  }

  makeRemoteRequest = () => {

    const { } = this.props.navigation.state;
    this.setState({
      isLoading: true
    })
    console.log('ff')
    console.log('componentdidmount')
    // http://api.oyespace.com/oyesafe/api/v1/VisitorLog/GetVisitorLogListByDCreatedAndAssocID/1/2018-11-26
    const url = 'http://' + this.props.oyeURL + '/oyesafe/api/v1/VisitorLog/GetVisitorLogListByDCreatedAndAssocID/' + this.props.SelectedAssociationID + '/' + this.state.dobText;
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
        console.log('vievisitorlist ', responseJson);
        this.setState({
          dataSource: responseJson.data.visitorlogbydate.filter(x => x.unUnitID == this.props.SelectedUnitID && x.vlVisType === 'Delivery' ),
       // dataSource: responseJson.data.visitorlogbydate,
          isLoading: false
        })
        // console.log('anu', dataSource);
      })
      .catch((error) => {
        console.log('err ' + error)
        this.setState({
          isLoading: false
        })
        Alert.alert("No Data for Selected Date");
      })

  }

  SampleFunction = () => {
    // Write your own code here, Which you want to execute on Floating Button Click Event.
    this.props.navigation.navigate('Unit');
    // Alert.alert("Floating Button Clicked");
  }

  render() {
    console.log('ravi', this.state.dobText.toString())
    const { navigate } = this.props.navigation;

    return (
      <View style={{ backgroundColor: '#FFF', height: '100%' }}>
        <View>
        {/* <View style={{flexDirection:'row',}}> */}
                    {/* <View style={{flex:1, marginTop:43,marginRight:0, justifyContent:'center',marginLeft:10}}>
                        <TouchableOpacity onPress={() => navigate(('ResDashBoard'), { cat: '' })}
                        >
                        <Image source={require('../../../icons/back.png')}
                        style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                        </TouchableOpacity>
                    </View> */}
                    {/* <TouchableOpacity 
                        style={{paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 1, alignItems: 'center', flexDirection: 'row',
                            paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:'6%'}}
                            onPress={() => this.props.navigation.navigate('SideMenu')}>
                        <Image source={require('../pages/assets/images/menu_button.png')}
                            style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                    </TouchableOpacity> */}
                    {/* <View style={{ flex: 5, alignItems:'center', justifyContent:'center'}}> */}
                    {/* <Image source={require('../../../icons/OyespaceRebrandingLogo.png')}
                        style={{height: 40, width: 95, marginTop: 45,marginBottom:5}} /> */}
                    {/* </View>  
                    <View style={{flex:1,marginTop:45, marginRight:10, justifyContent:'center',}}>    
                    </View>                 
                </View> 

                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>My Visitors</Text> */}
            
          <View style={{ flexDirection: 'row', justify: 'center', margin: 5 }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={{ fontSize: 15, color: 'black', margin: 5 }}>Select Date: </Text>
              <TouchableOpacity onPress={this.onDOBPress.bind(this)} >
                <View style={styles.datePickerBox}>
                  <Text style={styles.datePickerText}>{this.state.dobText}</Text>
                </View>
              </TouchableOpacity>
              <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />
            </View>
          </View>
        </View>
        {/*  <View style={{ height: '10%' }}>
          <View style={{ flex: 1, justify: 'center', flexDirection: 'row' , margin: 5}}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={{ fontSize: 15, color: 'black', marginTop: 10 }}>Select Date: </Text>
              <TouchableOpacity onPress={this.onDOBPress.bind(this)} >
                <View style={styles.datePickerBox}>
                  <Text style={styles.datePickerText}>{this.state.dobText}</Text>
                </View>
              </TouchableOpacity>
              <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />
            </View>
          </View>
        </View> */}
        {this.state.isLoading
          ?
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white'
          }}>
            <ActivityIndicator
              size="large"
              color="#330066"
              animating />
          </View>
          :
          this.state.dataSource.length == 0 ?
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}   >
              <Text style={{ backgroundColor: 'white' }}>No Visitors for Selected Date</Text>
            </View>
            :
            <View style={{ backgroundColor: '#FFF' }}>
              <View style={{ height: '90%' }}>
                <FlatList
                  data={this.state.dataSource}
                  renderItem={this.renderItem}
                  keyExtractor={(item, index) => item.name}
                  ItemSeparatorComponent={this.renderSeparator}
                />
                {/*  <TouchableOpacity activeOpacity={0.5} onPress={this.SampleFunction} style={styles.TouchableOpacityStyle} >
              <Image source={{ uri: 'https://reactnativecode.com/wp-content/uploads/2017/11/Floating_Button.png' }}
                style={styles.FloatingButtonStyle} />
            </TouchableOpacity> */}
              </View>
            </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({

  text: { fontSize: 14,  color: 'black', },
  title: { fontSize: 15, color: 'black', marginBottom: 2, fontWeight: 'bold' },

  lighttext: { fontSize: 13,  color: 'white', },

  TouchableOpacityStyle: {
    position: 'absolute', width: 50, height: 50, alignItems: 'center',
    justifyContent: 'center', right: 30, bottom: 30,
  },

  mybutton1: {
    backgroundColor: 'orange', paddingTop: 8, paddingRight: 12, paddingLeft: 12,
    paddingBottom: 8, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
  },

  datePickerBox: {
    margin: 5, borderColor: '#ABABAB', borderWidth: 0.5, padding: 0,
    borderTopLeftRadius: 4, borderTopRightRadius: 4, borderBottomLeftRadius: 4, borderBottomRightRadius: 4,
    justifyContent: 'center'
  },

  datePickerText: { fontSize: 15, marginLeft: 5, marginRight: 5, borderWidth: 0, color: '#121212', },

  profileImgContainer: { marginLeft: 3, width: 80, marginTop: 5, borderRadius: 40, },

  profileImg: { height: 120, width: 80, borderRadius: 40, },

  vehicleNum: { backgroundColor: '#E0E0E0', padding:5, borderRadius: 2, borderWidth: 1, borderColor: '#fff',alignSelf:"flex-start" },

  FloatingButtonStyle: { resizeMode: 'contain', width: 50, height: 50, }

});

AppRegistry.registerComponent('createassociation', () => createassociation);

const mapStateToProps = state => {
  return {
    oyeURL: state.OyespaceReducer.oyeURL,
    MyFirstName: state.UserReducer.MyFirstName,
    MyLastName: state.UserReducer.MyLastName,
    MyMobileNumber: state.UserReducer.MyMobileNumber,
    viewImageURL: state.OyespaceReducer.viewImageURL,
    SelectedAssociationID: state.UserReducer.SelectedAssociationID,
    SelectedUnitID: state.UserReducer.SelectedUnitID

  };
};

export default connect(mapStateToProps)(ViewVisitorsList);
