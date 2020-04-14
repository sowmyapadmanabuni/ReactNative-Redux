
import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View,
  TextInput, Button, Dimensions, FlatList, ActivityIndicator,
  TouchableHighlight, Alert, NetInfo,
  TouchableOpacity, ScrollView, Picker, Image
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import ImageLoad from 'react-native-image-placeholder';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import { openDatabase } from 'react-native-sqlite-storage';

console.disableYellowBox = true;
var db = openDatabase({ name: global.DB_NAME });
import moment from 'moment';
//import { Fonts } from '../pages/src/utils/Fonts';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
const options = {
  title: 'Select a Photo',
  takePhotoButton: 'Take a Photo',
  chooseFromLibraryButton: 'Choose From Gallery',
  quality: 1
};

export default class CreateCheckPoint extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentposition: '',
      connection_Status: "",
      lat: '',
      long: '',
      CheckPoint_name: '',
      PickerValueHolder: '',
      PickerValueHolderguard: [],
      dataSourceGuardPkr: [],
      text: '',
      imageSource: null,
      dobText: moment(new Date()).format('YYYY-MM-DD'),
      dobDate: null,
      data: null
    };
    db.transaction(tx => {
      tx.executeSql('SELECT Distinct FName FROM Workers where AssnID=' + global.SelectedAssociationID, [], (tx, results) => {
        console.log('Results', results.rowsAffected);
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
          console.log('Guards name', results.rows.item(i).FName);
        }

        this.setState({
          dataSourceGuardPkr: temp,
        });
      });
    });
  }

  onDOBPress = () => {
    let dobDate = this.state.dobDate;

    if (!dobDate || dobDate == null) {
      dobDate = new Date();
      this.setState({
        dobDate: dobDate
      });
    }
    this.refs.dobDialog.open({
      date: dobDate,
      minDate: new Date() //To restirct future date
    });

  }
  onDOBDatePicked = (date) => {
    this.setState({
      dobDate: date,
      dobText: moment(date).format('YYYY-MM-DD')

    });
  }
  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });
  }
  componentDidMount() {

    NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectivityChange);

    NetInfo.isConnected.fetch().done((isConnected) => {
      if (isConnected == true) {
        this.setState({ connection_Status: "Online" })
      }
      else {
        this.setState({ connection_Status: "Offline" })
        Alert.alert('Alert', 'Please connect to the internet. ',
          [
            { text: 'Ok', onPress: () => { } },
          ],
          { cancelable: false }
        );
      }

    });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectivityChange);
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
  selectPhoto() {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        this.setState({
          imageSource: source,
          data: response.data
        });
      }
    });
  }
  GetSelectedPickerItem = (itemValue) => {
    if (this.state.PickerValueHolder === '0') {
      Alert.alert("Choose incident category");
    } else {
      Alert.alert(this.state.PickerValueHolder);
    }

  }
  handleChangeOption(val) {
    if (val !== "React Native") {
      this.setState({ selectedValue: val });
    }
  }
  static navigationOptions = {
    title: 'Report Incident',
    headerStyle: {
      backgroundColor: '#696969',
    },
    headerTitleStyle: {
      color: '#fff',
    }
  };

  /**
   * { "AssociationID": 30,
  * "OYEMemberID": 1137 ,
   * "CheckPointName": "Haro Om",
   * "GPSPoint": "12.8467595,77.6480607",
   * "CreatedDate": "2018-10-11 03:14:37" }
  */
  CheckpointName = (checkpointname) => {
    this.setState({ CheckPoint_name: checkpointname })
  }

  submit = () => {
    const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;
    CheckPoint_name: '',
      mCheckPointName = this.state.CheckPoint_name;
    spinner = this.state.PickerValueHolder;
    spinnerguard = this.state.PickerValueHolderguard;
    mlat = this.state.lat;
    mlong = this.state.long;
    if (spinnerguard == 0) {
      Alert.alert('Alert', 'Assign task to security guard',
        [
          { text: 'Ok', onPress: () => { } },
        ],
        { cancelable: false }
      );
    } else {
      mCheckPointName = this.state.CheckPoint_name;
      spinner = this.state.PickerValueHolder;
      spinnerguard = this.state.PickerValueHolderguard;
      mlat = this.state.lat;
      mlong = this.state.long;

      anu = {
        "TKIsRjctd": "false",
        "TKApprBy": params.cat4,
        "TKABCmnts": this.state.CheckPoint_name,
        "TKAsgnTo": spinnerguard,
        "TKAsgnBy": params.cat4,
        "TKAsgnOn": params.cat3,
        "TKETA": this.state.dobText.toString(),
        "TKTktID": params.cat2

      }
      console.log('anu', anu)
      fetch(global.oye247BaseURL+'Ticketing/TicketingassignStatusUpdate',
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
            Alert.alert('Success', 'Task Assigned Successfully !',
              [
                { text: 'Ok', onPress: () => { this.props.navigation.navigate('ViewIncidentsScreen') } },
              ],
              { cancelable: false }
            );

          }
          else {
            console.log('hiii', failed);
            Alert.alert('Alert', 'failed..!',
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
          Alert.alert("caught error in sending data");
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
    console.log();
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
            <Text style={{ flex: 6, fontSize: 16, color: 'black',  alignSelf: 'center' }}>Assign Task</Text>
            <View style={{ flex: 3, alignSelf: 'center' }}>
              <Image source={require('../pages/assets/images/OyeSpace_hor.png')}
                style={{
                  height: 35, width: 105, margin: 5,
                  alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
                }} />
            </View>
          </View>
          <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>

          <ScrollView>
        <View style={styles.rectangle}>
            <View style={{ flex:1,flexDirection: 'column', marginLeft: '5%' }}>
              <TouchableHighlight
                style={[styles.profileImgContainer, { borderColor: 'orange', borderWidth: 1 }]}
              >
                <Image source={{ uri: global.viewImageURL+'Association' + global.SelectedAssociationID + 'INCIDENT' + params.cat2 + "N" + "0" + '.jpg' }} style={styles.profileImg} />

              </TouchableHighlight>
              <Text style={styles.text}>Incident Category: {params.cat6}</Text>
              <Text style={styles.text}>Incident Details: {params.cat}</Text>
              <Text style={styles.text}>Issue Raised by: {params.cat4}</Text>
              <Text style={styles.text}>Reported on: {params.cat3.substring(0, 10)}</Text>
              <Text style={styles.text}>Status: {params.cat5}</Text>
              <Text style={styles.text}>Issue Raised by Unit: {params.cat7}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={  {fontSize: 14,
    marginTop:15,
    color: 'black'}}>Assign to: </Text>
                <View style={{ flex: 1 }}>
                  <Picker
                  fontSize={12}
                    selectedValue={this.state.PickerValueHolderguard}
                    onValueChange={(itemValue, itemIndex) => this.setState({ PickerValueHolderguard: itemValue })} >
                    <Picker.Item label="Choose Security Guard" value='0' />
                    {this.state.dataSourceGuardPkr.map((item, key) => (
                      <Picker.Item label={item.FName} value={item.FName} key={key} />)
                    )}

                  </Picker>

                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 14,    color: 'black', marginLeft: "19%" }}>ETA: </Text>
                <TouchableOpacity onPress={this.onDOBPress.bind(this)} >
                  <View style={styles.datePickerBox}>
                    <Text style={{ color: 'black', fontSize: 15 }}>{this.state.dobText}</Text>
                  </View>
                </TouchableOpacity>
                <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />
              </View>
             
             
                </View>
              
                <TouchableHighlight
                  style={styles.loginScreenButton}
                  onPress={this.submit.bind(this)}>
                  <Text style={{color:'black',alignSelf:'center',fontSize:15,fontWeight:'bold'}}>  SUBMIT  </Text>
                </TouchableHighlight>
              
            </View>
      
            </ScrollView>
          </View>
     
    )
  }

}
const styles = StyleSheet.create({
  container: {
   flex:1,
    backgroundColor:'white'

  },
 
  input: {
    margin: 10,
    height: 60,
    borderColor: 'orange',
    borderWidth: 1
  },
  rectangle: {
    flex: 1, backgroundColor: 'white', borderColor: 'white',padding:5,
    height:'100%',
    marginLeft:5, marginRight:5, borderRadius: 2, borderWidth: 1,
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
  loginScreenButton: {
    alignSelf: 'center',
    paddingTop: 2,
    paddingBottom: 2,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'orange'
  },
  mybutton: {
    backgroundColor: 'white',
    marginTop: '5%',
    paddingRight: 8,
    paddingLeft: 8,
    color: 'orange',
    borderColor: 'orange',
    borderRadius: 0,
    borderWidth: 2,
    textAlign: 'center',

  },
  text: {
    fontSize: 15,
    marginLeft: 5,
    marginTop: 10,
    color: 'black',
  },

  datePickerBox: {
    marginBottom: '2%',
    borderColor: 'black',
    borderWidth: 1,
    marginLeft: '1%',
    paddingLeft: '5%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    height: 25,
    justifyContent: 'center'
  },
  datePickerText: {
    fontSize: 14,
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
//   input: {
//     margin: 15,
//     height: 40,
//     borderColor: '#7a42f4',
//     borderWidth: 1
//  },
//  submitButton: {
//   backgroundColor: '#7a42f4',
//   padding: 10,
//   margin: 15,
//   height: 40,
// }
// });