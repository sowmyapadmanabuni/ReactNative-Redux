import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View,
  TextInput, Button, Dimensions, FlatList, ActivityIndicator,
  TouchableHighlight, Alert,
  TouchableOpacity, ScrollView, Picker, Image, NetInfo
} from 'react-native';
import ImagePicker from 'react-native-image-picker'
import ImageLoad from 'react-native-image-placeholder';
import { DatePickerDialog } from 'react-native-datepicker-dialog'
import { openDatabase } from 'react-native-sqlite-storage';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  TextField
} from
  'react-native-material-textfield';
console.disableYellowBox = true;
import { createStackNavigator, createAppContainer } from 'react-navigation';

var db = openDatabase({ name: global.DB_NAME });
import moment from 'moment';
import { Fonts } from '../pages/src/utils/Fonts';



export default class ResolveIncident extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dobText: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      dobDate: null,
      Guardname:'',
      data: null
    };

  }

  

  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.setState({
      Guardname:params.cat4
    })
    NetInfo.isConnected.addEventListener(  'connectionChange',   this._handleConnectivityChange);

    NetInfo.isConnected.fetch().done((isConnected) => {

      if (isConnected == true) {
        this.setState({ connection_Status: "Online" })
      } else {
        this.setState({ connection_Status: "Offline" })
        Alert.alert('No Internet', 'Please Connect to the Internet. ',
          [
            { text: 'Ok', onPress: () => { } },
          ],
          { cancelable: false }
        );

      }

    });

  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(  'connectionChange',  this._handleConnectivityChange );
  }

  _handleConnectivityChange = (isConnected) => {

    if (isConnected == true) {
      this.setState({ connection_Status: "Online" })
    }  else {
      this.setState({ connection_Status: "Offline" })
     // alert('You are offline...');
    }

  };
  static navigationOptions = {
    title: 'Resolve Incident',
    headerStyle: {
      backgroundColor: '#696969',
    },
    headerTitleStyle: {
      color: '#fff',
    }
  };

  handleGuardName = (text)  => {

    let newText =   '';
    let numbers =    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxzyz ';

    for (var   i = 0;   i < text.length;  i++) {

      if (numbers.indexOf(text[i]) > -1) {
        newText =    newText + text[i];
      } else {
        // your call back function
        alert("Please Remove Special Characters");
      }

    }

    this.setState({
      Guardname: newText
    })

  }


  submit = () => {

    const { params } = this.props.navigation.state;
    if(this.state.Guardname===''){
alert('Enter Guard Name Who Resolved This Incident')
    }
// else if(params.cat4===''){
//   alert('Please Assign Task to Guard before Resolve it')
// }
else
    {
      var today = new Date();

      date = today.getFullYear() + "-" + parseInt(today.getMonth() + 1) + "-" + today.getDate();
      console.log('date', date);
      anu = {
        "TKRsldBy": this.state.Guardname,
        "TKRsCmnts": params.cat,
        "TKRsImage": 'Association' + global.SelectedAssociationID + 'EMERGENCY' + 'INCIDENT' + params.cat2 + "N" + '0' + ".jpg",
        "TKRsldOn": date,
        "TKTktID": params.cat2
      }
      console.log('anu', anu)
      fetch('http://' + global.oyeURL + '/oye247/OyeLivingApi/v1/Ticketing/TicketingResolveStatusUpdate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
          },

          body: JSON.stringify(anu)
        })
        .then((response) => response.json())
        .then((responseJson) => {

          if (responseJson.success) {
            console.log('ravii', responseJson);

            Alert.alert('Success', 'Incident Resolved successfully !',
              [
                { text: 'Ok', onPress: () => { this.props.navigation.navigate('ViewIncidentsScreen') } },
              ],
              { cancelable: false }
            );

          }  else {

            console.log('hiii', failed);
            Alert.alert('Alert', 'Incident Resolved Failed',
              [
                { text: 'Ok', onPress: () => { } },
              ],
              { cancelable: false }

            );

          }

          console.log('suvarna', 'hi');
        })
        .catch((error) => {
          console.error(error);
          Alert.alert("Incident Resolved Failed");
        });

    }

  }

  updateStatus = () => {

  }

  mobilevalidate = () => {

    navigator.geolocation.getCurrentPosition((position) => {
      lat = position.coords.latitude;
      long = position.coords.longitude;
      const currentposition = JSON.stringify(position);
      console.log('suvarna', currentposition);
      this.setState({ currentposition, lat, long });
    });

  }

  render() {

    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;

    //  this.state.lat=params.cat;
    //  this.state.long=params.cat1;

    return (
        <View style={styles.container}>
            <View
      style={{
        paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
        borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
      }}>
      <TouchableOpacity onPress={() => navigate(('ViewIncidentsScreen'), { cat: '' })}
        style={{ flex: 1 }}>
        <Image source={require('../pages/assets/images/back.png')}
          style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
      </TouchableOpacity>
      <Text style={{ flex: 2, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>
      <Text style={{ flex: 6, fontSize: 16, color: 'black', fontFamily: Fonts.PoppinsExtraBold, alignSelf: 'center' }}>Resolve Incident</Text>
      <View style={{ flex: 3, alignSelf: 'center' }}>
        <Image source={require('../pages/assets/images/OyeSpace_hor.png')}
          style={{
            height: 35, width: 105, margin: 5,
            alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
          }} />
      </View>
    </View>
         <ScrollView>
          <View style={{flex:1, flexDirection: 'column', marginLeft: '10%' }}>
            <TouchableHighlight
              style={[styles.profileImgContainer, { borderColor: 'orange', borderWidth: 1 }]} >

              <Image source={{ uri: global.viewImageURL + 'Association' + global.SelectedAssociationID + 'EMERGENCY' + 'INCIDENT' + params.cat2 + "N" + "0" + '.jpg' }} style={styles.profileImg} />
            </TouchableHighlight>

            <Text style={styles.text}>Incident ID: {params.cat2}</Text>
            <Text style={styles.text}>Incident Category: {params.cat6}</Text>
            <Text style={styles.text}>Incident Details: {params.cat}</Text>
            <Text style={styles.text}>Incident Resolved on: {this.state.dobText}</Text>
            <View style={{ flexDirection: 'row'}}>
            <View style={{ flex: 0.45,}}>
            <Text style={styles.text}>Incident Resolved by:</Text>
            </View>
            <View style={{ flex: 0.55,}}>
            <TextField

label='Guard Name'

autoCapitalize='sentences'
value={this.state.Guardname}
editable={true}
labelHeight={15}
maxLength={30}
characterRestriction={30}
activeLineWidth={0.5}

fontSize={12}

onChangeText={
  this.handleGuardName}

/>
</View>
</View>
          </View>
          <View style={{flex:1.5, alignSelf: 'center' }}>
              <TouchableOpacity
                style={styles.loginScreenButton}
                onPress={this.submit.bind(this)}>
                <Text style={{  color: 'black', fontSize:hp('2.5%'), padding: '1%', margin: '1%', fontWeight: 'bold' }}> Resolve Incident </Text>
              </TouchableOpacity>
            </View>
            </ScrollView>
        </View>
       
     
    )

  }

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    height: 800,
    backgroundColor: 'white',
  },

  input: {
    margin: 10,
    height: 60,
    borderColor: 'orange',
    borderWidth: 1
  },

  rectangle: {
    flex: 1,
    backgroundColor: 'white',
    height: '100%',
    padding: 10, borderColor: 'orange',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    borderRadius: 2,
    borderWidth: 1,
  },
  loginScreenButton: {
    alignSelf: 'center',
    paddingTop: 2,
    paddingBottom: 2,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'orange'
  },

  profileImgContainer: {
    marginLeft: 3,
    height: 120,
    width: 120,
    marginTop: 10,
  },

  profileImg: {
    height: 120,
    width: 120,
  },

  submitButton: {
    backgroundColor: '#ff8c00',
    padding: 10,
    margin: 15,
    height: 40,
    justifyContent: 'center',
    color: 'white'

  },

  mybutton: {
    backgroundColor:  'white',
    paddingRight: 12,
    paddingLeft: 12,
    color: 'orange',
    marginTop: '5%',
    height: "18%",
    borderColor: 'orange',
    borderRadius:  0,
    borderWidth:  2,
    textAlign: 'center',
  },

  text: {
    fontSize: 15,
    marginLeft: 5,
    marginTop: 15,
    fontFamily: Fonts.PoppinsRegular,
    color: 'black',
  },

  datePickerBox: {
    marginBottom: 32,
    marginLeft: 60,
    borderColor: '#ABABAB',
    borderWidth: 0.5,
    padding: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    height: 25,
    justifyContent: 'center'
  },

  datePickerText: {
    fontSize: 14,
    marginLeft: 5,
    borderWidth: 0,
    color: '#121212',
  },

  inputLayout: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
  },

  image: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 100 / 2
  },

})

