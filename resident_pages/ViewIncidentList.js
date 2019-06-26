import React, { Component } from 'react';
import { AppRegistry, Dimensions, TouchableHighlight, NetInfo, Platform, Alert, TouchableOpacity, ScrollView, PermissionsAndroid, StyleSheet, Text, Image, View, FlatList, ActivityIndicator } from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
//import { Fonts } from '../pages/src/utils/Fonts';
import moment from 'moment';

console.disableYellowBox = true;

import ActionButton from 'react-native-action-button';
import ZoomImage from 'react-native-zoom-image';
import { Easing } from 'react-native';
import PTRView from 'react-native-pull-to-refresh';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
export default class ViewIncidentList extends Component {

  constructor() {

    super()

    this.state = {
      dataSource: [],
      isLoading: true,
      connection_Status: "",
      dobText: '2018-10-13',
      dobDate: null,
      imageLoading: true,
      chosenDate: new Date(),

    }

    var today = new Date();
    date = today.getDate() + "/" + parseInt(today.getMonth() + 1) + "/" + today.getFullYear();
    console.log('date', date);

    this.setDate = this.setDate.bind(this);
    this.onDateChange = this.onDateChange.bind(this);

    console.log('anu123', 'constructor');

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
    const { params } = this.props.navigation.state;

    return (

      <View
        style={styles.rectangle}>
        <View style={{ flex: 0.7, flexDirection: 'row', padding: 2 }}>
          <View style={{ flexDirection: 'column' }}>
         
         
            <ZoomImage
            source={{ uri: global.viewImageURL + 'Association' + global.SelectedAssociationID + 'INCIDENT' + item.tkTktID + 'N' + '0' + '.jpg' }}
            imgStyle={styles.profileImg}
            placeholderSource={require('../pages/assets/images/back.png')}
            style={styles.profileImgContainer}
            duration={200}
            resizeMode='contain'
            enableScaling={true}
            easingFunc={Easing.ease}
          />       
            {
              item.tkAsgnTo === ""?
            
              <TouchableOpacity
              onPress={() => navigate('AssignTask', {
                cat: item.tkrbCmnts, cat2: item.tkTktID,
                cat3: item.tkRaiseDT, cat4: item.tkRaisdBy, cat5: item.tkStat, cat6: item.tkrbEvid, cat7: item.unUnitID
              })} style={styles.loginScreenButton1} >
              <Text style={{  fontWeight: 'bold',margin:hp('0.5%'),
              color: 'black', fontSize: hp('2.5%'),  }}> Assign Task </Text>

            </TouchableOpacity>
            : 
            <TouchableOpacity
              style={styles.mybuttonDisable}
              >
              <Text style={{fontSize:0,color:'black'}}></Text>
            </TouchableOpacity>
            
            } 
          </View>

          {/* "Association"+prefManager.getAssociationId()+INCIDENT+dataObj.getInt(ticketingID)+"N"+"0"+".jpg"; */}

          <View style={{ flex: 1.3, flexDirection: 'column', marginLeft: 5 }}>
          <Text style={styles.title}>{item.tkrbEvid}</Text>
            <Text style={styles.text}>Details: {item.tkrbCmnts}</Text>
            <Text style={styles.text}>Reported on: {item.tkRaiseDT.substring(0, 10)}</Text>
            {
              item.tkStat === "Pending"?
            
              <Text style={styles.text}>{item.tkStat}</Text>
            : 
            <Text style={styles.text}>{item.tkStat} by {item.tkRsldBy}</Text>
            
            } 
            <Text style={styles.text}>Issue raised by: {item.tkRaisdBy}</Text>
            {
              item.tkAsgnTo === ""?
            
              <Text style={styles.text}>Assigned to: {'Not Assigned'}</Text>
            : 
            <Text style={styles.text}>Assigned to: {item.tkAsgnTo}</Text>
            
            } 
               {
              item.tketa.substring(0, 10) === "0001-01-01"?
            
              <Text style={styles.text}>ETA: {'Not Assigned'}</Text>
            : 
            <Text style={styles.text}>ETA: {item.tketa.substring(0, 10)}</Text>
            
            } 

            <View style={{ flex: 1, flexDirection: 'row', }}>
              {
  item.tkStat === "Resolved" ? 
<TouchableOpacity
  style={styles.mybuttonDisable}
  >
  <Text style={{fontSize:0,color:'black'}}></Text>
</TouchableOpacity>
: 
<TouchableOpacity
onPress={() => navigate('ResolveIncident', {
  cat: item.tkrbCmnts, cat2: item.tkTktID,
  cat3: item.tkRaiseDT, cat4: item.tkAsgnTo, cat6: item.tkrbEvid
})} style={styles.loginScreenButton} >
<Text style={{  color: 'black', fontSize:hp('2.5%'), padding: '1%', margin: '1%', fontWeight: 'bold' }}> Resolve Incident </Text>
</TouchableOpacity>

}            
            </View>
          </View>
        </View>
      </View>

    )

    console.log(uri);

  }

  renderSeparator = () => {

    return (
      <View
        style={{ height: 2, width: '100%', backgroundColor: '#fff' }}>
      </View>

    )
  }

  componentDidMount() {

    this.makeRemoteRequest();

    NetInfo.isConnected.addEventListener(

      'connectionChange',

      this._handleConnectivityChange

    );

    NetInfo.isConnected.fetch().done((isConnected) => {

      if (isConnected == true) {

        this.setState({ connection_Status: "Online" })
      }

      else {

        this.setState({ connection_Status: "Offline" })

        Alert.alert('No Internet', 'Please connect to the internet. ',

          [

            { text: 'Ok', onPress: () => { this.props.navigation.navigate('ResDashBoard') } },

          ],

          { cancelable: false }

        );

      }
    });

  }


  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this._handleConnectivityChange
    );
  }



  _handleConnectivityChange = (isConnected) => {
    if (isConnected == true) {
      this.setState({ connection_Status: "Online" })
    }
    else {
      this.setState({ connection_Status: "Offline" })

      alert('You are offline...');
    }

  };

  makeRemoteRequest = () => {

    const { } = this.props.navigation.state;

    console.log('componentdidmount')

    const url = 'http://' + global.oyeURL + '/oye247/OyeLivingApi/v1/Ticketing/GetTicketingList'

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
          dataSource: responseJson.data.ticketing.filter(x => x.asAssnID == global.SelectedAssociationID),
          isLoading: false
        })
        console.log('anu', dataSource);
      })
      .catch((error) => {
        console.log(error)

      })
return new Promise((resolve) => {
  setTimeout(() => { resolve() }, 2000)
    });

  }


  render() {

    const { navigate } = this.props.navigation;

    console.log('ravi', this.state.dobText.toString())



    return (

      this.state.isLoading

        ?
        
        <View style={{ backgroundColor: '#FFF', height: '100%' }}>

          <View style={{flexDirection:'row',}}>
            <View style={{flex:0.5, marginTop:43,marginRight:0, justifyContent:'center',marginLeft:10}}>
                <TouchableOpacity onPress={() => navigate(('ResDashBoard'), { cat: '' })}>
                        <Image source={require('../pages/assets/images/back.png')}
                        style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={{paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 1, alignItems: 'center', flexDirection: 'row',paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:'6%'}}
              onPress={() => this.props.navigation.navigate('SideMenu')}>
              <Image source={require('../pages/assets/images/menu_button.png')}  style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
            </TouchableOpacity>
            <View style={{ flex: 5, alignItems:'center', justifyContent:'center',marginRight:'6%'}}>
              <Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}style={{height: 40, width: 95, marginTop: 45,marginBottom:5}} />
                    </View>  
                    <View style={{flex:1,marginTop:45, marginRight:10, justifyContent:'center',}}>    
                    </View>                 
                </View> 

                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>Assigned Tasks List</Text>
          {/* <View
            style={{
              paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
              borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
              marginTop:20,
            }}> */}
            {/* <TouchableOpacity onPress={() => navigate(('ResDashBoard'), { cat: '' })}
              style={{ flex: 1 }}>
              <Image source={require('../pages/assets/images/back.png')}
                style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
            </TouchableOpacity> */}
            {/* <Text style={{ flex: 2, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>
            <Text style={{ flex: 6, fontSize: 16, color: 'black',fontWeight:'bold',  alignSelf: 'center', alignContent:'center',justifyContent:'center',alignItems:'center',fontWeight:'bold' }}>Assigned Tasks List</Text>
            <View style={{ flex: 3, alignSelf: 'center' }}> */}
              {/* <Image source={require('../pages/assets/images/OyeSpace_hor.png')}
                style={{
                  height: 35, width: 105, margin: 5,
                  alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
                }} /> */}
            {/* </View> */}
          {/* </View> */}
          {/* <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View> */}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <ActivityIndicator size="large" color="#330066" animating />
            <ActionButton buttonColor="#FA9917" onPress={() => navigate('RaiseIncidentScreen', { cat: '' })}  >
            </ActionButton>
          </View>
        </View>
        :
        <View style={{ backgroundColor: '#FFF' }}>
          <View style={{ height: '0%' }}>
          </View>
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

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>Assigned Tasks List</Text>
            
            {this.state.dataSource.length == 0 ?
              <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white'
              }}>
                <Text style={{ backgroundColor: 'white' }}>No Task Created</Text>
              </View>
              :
              <PTRView onRefresh={this.makeRemoteRequest} >

                <ScrollView>
                  <FlatList

                    data={this.state.dataSource}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => item.name}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListHeaderComponent={() => (!this.state.dataSource.length ?
                      <Text style={styles.emptyMessageStyle}>No Task Created</Text>
                      : null)
                    }

    />


                </ScrollView>
              </PTRView>
            }
            <ActionButton buttonColor="#FA9917" onPress={() => navigate('RaiseIncidentScreen', { cat: '' })}  >
            </ActionButton>


          </View>

        </View>

    );

  }

}

const styles = StyleSheet.create({
  rectangle: { flex: 1, backgroundColor: 'white', padding:10, borderColor: 'orange',
  marginLeft:5, marginRight:5, marginTop:5, borderRadius: 2, borderWidth: 1, },
  
  profileImgContainer: {
    marginTop:'10%',
        height: hp('19%'),
    width: wp('30%'),
    borderColor: 'orange',
    borderWidth: 0.5
  },

  text: { fontSize: hp('2%'),  color : 'black', },

  profileImg: {
    height: hp('25.5%'),
    width: wp('30%'),
  },



  emptyMessageStyle: {
    textAlign: 'center',
  },

  title: { fontSize: hp('2.5%'), color: 'black',  },

  loginScreenButton1: {
    marginTop: '10%',
    paddingTop: '10%',
    backgroundColor: '#696969',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
  },

  loginScreenButton: {
    alignSelf: 'center',
    paddingTop: 2,
    paddingBottom: 2,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'orange',
        marginTop:10,
  },
  loginScreenButton1: {
    alignSelf: 'center',
    paddingTop: 1,
    marginTop:'2.5%',
    paddingBottom: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'orange'
  },

});

//AppRegistry.registerComponent('IncidentList', () => IncidentList);
