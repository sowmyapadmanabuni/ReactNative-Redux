
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View,ScrollView,ImageButton,
   TextInput,  Button,Dimensions,FlatList, ActivityIndicator,Form,
   TouchableHighlight,Alert,NetInfo,
   TouchableOpacity,Picker,Image} from 'react-native';
   import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: global.DB_NAME});
   import ImagePicker from 'react-native-image-picker'
   import { Dropdown } from 'react-native-material-dropdown';
   import { TextField } from 'react-native-material-textfield';
   import Communications
  from 'react-native-communications';
import moment from 'moment';
//import { Fonts } from '../pages/src/utils/Fonts';
console.disableYellowBox = true;
console.reportErrorsAsExceptions = false;

import { mystyles} from '../pages/styles' ;
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
const options = {
    title: 'Select a Photo',
    takePhotoButton: 'Take a Photo',
    chooseFromLibraryButton: 'Choose From Library',
    quality: 0.50,
    maxWidth: 600,
    maxHeight: 800,
    storageOptions: {
    skipBackup: true,
    },
};
 
export default class RaiseIncident extends Component {
  constructor(props) {
    super(props);
  this.state = {
  
    currentposition: '',
    lat:'',
    long:'',
    connection_Status:"",
    CheckPoint_name:'',
    PickerValueHolder : '',
    PickerValueHolderguard : '',
    WorkerID:'',
    text: '',
    imageSource: null,
    dobText: moment(new Date()).format('YYYY-MM-DD'),
    dobDate: null,
    data: null,
    imgPath:""
}
db.transaction(tx => {
  tx.executeSql('SELECT WorkID FROM Workers where AssnID=' + global.SelectedAssociationID+ ' ORDER BY WorkID ASC LIMIT 1', [], (tx, results) => {
    console.log('Results', results.rowsAffected);
    var temp=[];
    for (let i = 0; i < results.rows.length; ++i) {
      temp.push(results.rows.item(i));
      console.log('Guards ID', results.rows.item(i).WorkID);
      this.setState({
        WorkerID:results.rows.item(i).WorkID
      });
    }
    console.log('guard',WorkerID);
  });
});
}
 onDOBPress = () => {
  let dobDate = this.state.dobDate;
 
  if(!dobDate || dobDate == null){
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
handleIncidentCategory = (Incident_category) => {
  this.setState({ PickerValueHolder: Incident_category })
}
componentDidMount() {
 
  NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange

  );
 
  NetInfo.isConnected.fetch().done((isConnected) => {

    if(isConnected == true)
    {
      this.setState({connection_Status : "Online"})
  
    }
    else
    {
      this.setState({connection_Status : "Offline"})
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

  NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this._handleConnectivityChange

  );

}

_handleConnectivityChange = (isConnected) => {

  if(isConnected == true)
    {
      this.setState({connection_Status : "Online"})
    }
    else
    {
      this.setState({connection_Status : "Offline"})
      alert('You are offline...');
    }
};
selectPhoto() {
  navigator.geolocation.getCurrentPosition((position) => {
    lat=position.coords.latitude;
    long=position.coords.longitude;
   
     const currentposition = JSON.stringify(position);
     console.log('suvarna',currentposition);
     this.setState({ currentposition,lat,long });
 });
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
              imgPath:response.uri,
              data: response.data
          });
      }
  });
}
GetSelectedPickerItem=(itemValue)=>{
  if (this.state.PickerValueHolder === '0' ) {
    Alert.alert("Choose Incident Category");
  }else{
    Alert.alert(this.state.PickerValueHolder);
  }
 
}
handleChangeOption(val) {
  if (val !=="React Native" ) {
    this.setState({selectedValue: val});
  }
}
static navigationOptions = {
  title: 'Report Incident',
  headerStyle:{
      backgroundColor:'#696969',
  },
  headerTitleStyle:{
      color:'#fff',
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
 

submit=() =>{

  const { navigate } = this.props.navigation;
    CheckPoint_name:'',
    mCheckPointName=this.state.CheckPoint_name;
   spinner=this.state.PickerValueHolder;
   guardID=this.state.WorkerID;
   ImagePath=this.state.imgPath;
   mlat=this.state.lat;
   mlong= this.state.long;
 
   if(spinner==''){
    Alert.alert('Alert', 'Choose Incident Category',
    [
        { text: 'Ok', onPress: () => { } },
    ],
    { cancelable: false }
  );
  }
  else   if(mCheckPointName.length==0){
    Alert.alert('Alert', 'Enter Incident Details',
  [
      { text: 'Ok', onPress: () => { } },
  ],
  { cancelable: false }
);
  }
  else   if(ImagePath==""){
    Alert.alert('Alert', 'Take Incident Photo',
  [
      { text: 'Ok', onPress: () => { } },
  ],
  { cancelable: false }
);
  }
else if(mlat==''|| mlong==''){
  Alert.alert('Alert', 'Gps is disabled, in order to use the application properly you need to enable GPS of your device ',
  [
      { text: 'Ok', onPress: () => { } },
  ],
  { cancelable: false }
);
}

else{
  anu={"TTTktTyID" : 1,
	"TKGPSPnt" : this.state.lat+','+this.state.long,
	"TKRaisdBy" : global.MyFirstName+' '+global.MyLastName,
	"TKRBCmnts" : this.state.CheckPoint_name,
	"TKRBEvid" : this.state.PickerValueHolder,
	"WKWorkID" : guardID,
	"MEMemID" : global.MyOYEMemberID ,
	"TKEmail" : "",
	"TKMobile" : global.MyMobileNumber,
	"UNUnitID" : global.SelectedUnitID,
	"ASAssnID"	: global.SelectedAssociationID
}

console.log('anu',anu)
  fetch('http://'+global.oyeURL+'/oye247/api/v1/Ticketing/Create',
  {
          method: 'POST',
          headers: {
 
            'Content-Type': 'application/json',
            "X-OYE247-APIKey":"7470AD35-D51C-42AC-BC21-F45685805BBE",
 
},
          body: JSON.stringify(anu)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.success){
                console.log('ravii',responseJson);
                const imgName='Association'+global.SelectedAssociationID+'INCIDENT'+responseJson.data.ticketingID+'N'+'0'+'.jpg';
                console.log('ram',imgName);
                if (this.state.imgPath) {
                  var data = new FormData();
                  data.append('Test', { uri: this.state.imgPath, name: imgName, type: 'image/jpg' });
                  const config = {
                      method: 'POST',
                      headers: {"X-Champ-APIKey":"1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1","content-type": "multipart/form-data"},
                      body: data };
                      console.log("Config",config);
                       fetch(global.uploadImageURL, config).then(responseData => {
                         console.log("sucess==>");
                       console.log(responseData._bodyText);
                       console.log(responseData.toString());
                   // alert("Image uploaded done")
                       this.props.navigation.navigate('ViewIncidentList');
                      }).catch(err => {
                         console.log("err==>");
                         alert("Error with image upload!")
                       //  this.props.navigation.navigate('GuardListScreen');
                         console.log(err);
                      });
              }
              fcmMsg = {
                "data": {
                  "activt": 'incident',
                  "unitID":global.SelectedUnitID,
                  "associationID":global.SelectedAssociationID,
                  "name": global.MyFirstName + " " + global.MyLastName,
                  "mob":global.MyMobileNumber,
                  "incidentId": responseJson.data.ticketingID,
                  "gps":this.state.lat+','+this.state.long,
                  "gmtdatetime": moment(new Date()).format('YYYY-MM-DD HH:mm'),
                },
                "to": "/topics/AllGuards" + global.SelectedAssociationID,
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
                  console.log('suvarna', responseJson);
                })
                .catch((error) => {
                  console.error(error);
                 // alert('caught error in fcmMsg')
                });
                Alert.alert('Success', 'Incident Raised Successfully!',
                [
                    { text: 'Ok', onPress: () => {this.props.navigation.navigate('ViewIncidentsScreen') } },
                ],
                { cancelable: false }
              );
                //this.updateStatus();
 
            }
            else{
                console.log('hiii',failed);
           
            }
           
         
            
    console.log('suvarna','hi');
        })
        .catch((error) => {
          console.error(error);
          alert('Incident Creation Failed');
          //ToastAndroid.show(' caught error in sending otp', ToastAndroid.SHORT);
        });
}
}

mobilevalidate=() =>{
 

  navigator.geolocation.getCurrentPosition((position) => {
   lat=position.coords.latitude;
   long=position.coords.longitude;
  
    const currentposition = JSON.stringify(position);
    console.log('suvarna',currentposition);
    this.setState({ currentposition,lat,long });
});
}
 render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    let Incident_Category = [{
      value: 'Animal spotted',
    }, {
      value: 'Gate not closed',
    }, {
      value: 'Broken Fence',
    }, 
    {
      value: 'Broken Door',
    },
    {
      value: 'Broken Gate',
    },
    {
      value: 'Stranger in Premise',
    },
    {
      value: 'Others',
    }
  ];
    // this.state.lat=params.cat;
    // this.state.long=params.cat1;
    console.log();
    return (
       <View style = {styles.container}>
        <View style = {styles.rectangle}>
        <View>
<View
style={{
paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:25,
}}>
<TouchableOpacity onPress={() => navigate(('ViewIncidentsScreen'), { cat: '' })}
style={{ flex: 1 }}>
<Image source={require('../pages/assets/images/back.png')}
style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
</TouchableOpacity>
<Text style={{ flex: 4, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>
<Text style={{  flex: 6, fontSize: 16, color: 'black',  alignSelf: 'center' , fontWeight:'bold',alignItems:'center',justifyContent:'center' }}>Create Task</Text>
<View style={{ flex: 4, alignSelf: 'center' }}>
<Image source={require('../pages/assets/images/OyeSpace_hor.png')}
style={{
height: 35, width: 125, margin: 5,
alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
}} />
</View>
</View>
<View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
</View>
        <ScrollView keyboardShouldPersistTaps='always' >
   <View style={{flex:1,marginLeft:10,marginRight:10}}>
      <Dropdown
        label='Incident Category'
        data={Incident_Category}
        fontSize={15}
        onChangeText={this.handleIncidentCategory} 
      />
      </View>
      <View style = {{marginRight:10,marginLeft:10}}>
      <TextField
        label='Enter Incident Details'
        autoCapitalize='sentences'
        labelHeight={15}
        maxLength={50}
        characterRestriction={50}
        activeLineWidth={0.5}
        fontSize={15}
        onChangeText={ this.CheckpointName }
      />
      </View>

        <View style={{flexDirection:'row',flex:1}}>       
               <Image style={styles.image}
      source={this.state.imageSource != null ? this.state.imageSource:
        require('../pages/assets/images/image.png') }
      />
       <TouchableOpacity style={styles.loginScreenButton} onPress={this.selectPhoto.bind(this)}>
       <Text style = {{color:'black',margin:'1%',fontSize:15}}> Capture Image</Text>
       </TouchableOpacity>
       </View>
       <Text style={{ fontSize: 10, color: 'black',alignSelf:'center'}}>
{this.state.lat}{this.state.long}
          </Text>
          <TouchableOpacity
             style = {styles.loginScreenButton}
             onPress={this.submit.bind(this)}>
             <Text style = {{color:'black',fontSize:15}}> Submit </Text>
          </TouchableOpacity>
          </ScrollView> 
          <View style={{flexDirection:'row',paddingLeft:'15%', position:'absolute',bottom:0,}}> 
          <View style={{flexDirection:'column',flex:1}}>
          <TouchableOpacity onPress={()=> Communications.phonecall('108',true)}>
              <View style={{flex: 1,flexDirection: 'row'}}>
                <Image
                  source={require('../pages/assets/images/phone.png')}
                  style={{
                    height: 15,
                    marginTop: '3%',
                    width: 15,
                    alignItems: "center"
                  }}
                />
               <Text style={{fontWeight:'bold'}}>108</Text>
              </View>
            </TouchableOpacity>

          <Image style={styles.Bottom_image}
      source={require('../pages/assets/images/ambulance_new.png') }
      />
         <Text style={{fontWeight:'bold',alignSelf:'flex-start',marginBottom:20}}>Ambulance</Text>
          </View>
          <View style={{flexDirection:'column',flex:1}}>
          <TouchableOpacity onPress={()=> Communications.phonecall('100',true)}>
              <View style={{flex: 1,flexDirection: 'row'}}>
                <Image
                  source={require('../pages/assets/images/phone.png')}
                  style={{
                    height: 15,
                    marginTop: '3%',
                    width: 15,
                    alignItems: "center"
                  }}
                />
               <Text style={{fontWeight:'bold'}}>100</Text>
              </View>
            </TouchableOpacity>
          <Image style={styles.Bottom_image}
      source={require('../pages/assets/images/police_new.png') }
      />
       <Text style={{fontWeight:'bold',alignSelf:'stretch',marginBottom:20}}>Police</Text>
          </View>
          <View style={{flexDirection:'column',flex:1}}>
          <TouchableOpacity onPress={()=> Communications.phonecall('104',true)}>
              <View style={{flex: 1,flexDirection: 'row'}}>
                <Image
                  source={require('../pages/assets/images/phone.png')}
                  style={{
                    height: 15,
                    marginTop: '3%',
                    width: 15,
                    alignItems: "center"
                  }}
                />
               <Text style={{fontWeight:'bold'}}>104</Text>
              </View>
            </TouchableOpacity>
          <Image style={styles.Bottom_image}
      source={require('../pages/assets/images/firetruck_new.png') }
      />
      <Text style={{fontWeight:'bold',alignSelf:'stretch',marginBottom:20}}>Fire</Text>
          </View>
          </View>
          
          </View>
</View>

    )
}
 
}
const styles = StyleSheet.create ({
  container: {
     flex: 1,
     justifyContent:'center'
    
  },
  rectangle: { flex: 1, backgroundColor: 'white', borderColor: 'white',padding:5,
 marginLeft:5, marginRight:5, borderRadius: 2, borderWidth: 1, },
  input: {
    marginTop:10,
    marginRight:10,
    marginLeft:8,
   
},
 
  submitButton: {
    backgroundColor: '#ff8c00',
    padding: 10,
    margin: 15,
    height: 40,
    justifyContent:'center', 
    color:'white'
},
mybutton1: {
 
  backgroundColor:
  'white',
  marginLeft:20,
  borderColor:
  'orange',
  borderRadius:
  0,
  borderWidth:
  2,
 
 
  },
  loginScreenButton:{
    alignSelf:'center',
     paddingTop:2,
     paddingBottom:2,
     backgroundColor:'white',
     borderRadius:5,
     borderWidth: 1,
     borderColor: 'orange'
   },
mybutton: {
 
  backgroundColor:
  'white',
  alignSelf:'center',

  color:'orange',
  marginTop:10,
 
 
  borderColor:
  'orange',
 
  borderRadius:
  0,
 
  borderWidth:
  2,
 
  textAlign:'center',
 
  },
  mybutton1: {
 
    backgroundColor:
    'white',
    alignSelf:'center',
  
    color:'orange',
    borderColor:
    'orange',
   
    borderRadius:
    0,
   
    borderWidth:
    2,
   
    textAlign:'center',
   
    },
    bottom: {
      flex: 1,
      justifyContent: 'flex-end',
      marginBottom: 36
    },
 
textInput: {
  fontSize: 10,
  height: 25
},
datePickerBox:{
  marginBottom:32,
  marginLeft:60,
  borderColor: '#ABABAB',
  borderWidth: 0.5,
  padding: 0,
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  borderBottomLeftRadius: 4,
  borderBottomRightRadius: 4,
  height: 25,
  justifyContent:'center'
},
datePickerText: {
  fontSize: 14,
  marginLeft: 5,
  borderWidth: 0,
  color: '#121212',
},
inputLayout: {
  marginTop: 5,
  marginLeft:10,
  marginRight:10,
},
profileImgContainer: {
  marginLeft: 3,
  height: 100,
  width: 100,
  marginTop: 10,
  borderRadius: 50,
},
profileImg: {
  height: 10,
  width: 100,
  borderRadius: 50,
},

image: {
  width: 100,
  marginRight:'5%',
  height:100,
  marginTop: 10,
  borderRadius:50/2
},
Bottom_image: {
  width: 50,
  marginRight:'5%',
  height:40,
  marginTop: 10,
   marginBottom:5,

},
})