
import React, { Component } from 'react';

import {
  Platform, StyleSheet, Text, View,
  TextInput, Alert, Button, Dimensions, FlatList, ScrollView, ActivityIndicator,
  TouchableOpacity, ToastAndroid, Picker, Image, Card, Avatar, NetInfo, TouchableHighlight
} from 'react-native';
import ImagePicker from 'react-native-image-picker'
import { NavigationActions } from 'react-navigation';
import {
  DatePickerDialog
} from
  'react-native-datepicker-dialog'

import {
  openDatabase
} from
  'react-native-sqlite-storage';

import {
  TextField
} from
  'react-native-material-textfield';

var db = openDatabase({   name: global.DB_NAME});


export default
  class EditBlock
  extends Component {

  constructor(props) {

    super(props)

    this.state = {

      blockname: this.props.navigation.state.params.BlockName,
      noofunits: this.props.navigation.state.params.NoOfunits,
      connection_Status: "",

    }
 

  }

  handleblockname = (text) => {
    this.setState({
        blockname: text
    })
  }

  handlenofunits = (text) => {
    this.setState({
      noofunits: text
    })

  }

  componentDidMount() {
   
  

    NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectivityChange);

    NetInfo.isConnected.fetch().done((isConnected) => {

      if (isConnected == true) {

        this.setState({
          connection_Status: "Online"
        })

      } else {
        this.setState({
          connection_Status: "Offline"
        })

        Alert.alert('No Internet',
          'Please Connect to the Internet. ',
          [
            {
              text: 'Ok',
              onPress: () => { this.props.navigation.navigate('ResDashBoard') }
            },
          ],
          {
            cancelable: false
          }
        );

      }

    });

  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectivityChange);
  }

  _handleConnectivityChange = (isConnected) => {

    if (isConnected == true) {
      this.setState({
        connection_Status: "Online"
      })
    } else {
      this.setState({
        connection_Status: "Offline"
      })
      
    }

  };

  

  submit = () => {

    let regemail = /^[!@#$%^&*(),.?":{}|<>]/;
    const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;

    if (this.state.blockname == '' || this.state.blockname == undefined) {
      alert('Block Name should not be Empty');
    } else if (regemail.test(this.state.blockname) === true) {
      alert('Block Name should not contain Special Character');
    }
    else if (this.state.noofunits=== '0') {
      alert('No of Units should not be zero');
    }
    else if (regemail.test(this.state.noofunits) === true) {
      alert('No of Units should not contain Special Character');
    }  

    else {

    

      anu = {

        "BLBlkName"   : this.state.blockname,
          "BLBlkType"  : params.blocktype,
          "BLNofFlrs"  : 1,
          "BLNofUnit"  : this.state.noofunits,
          "ASAssnID"   : global.SelectedAssociationID,
          "BLIsActive"  : true,
          "BLBlockID"  : params.BlockID

      }
      
   

      console.log('anu', anu)
      //http://localhost:54400/oyeliving/api/v1/Block/GetBlockListByBlockID/{BlockID}
     // Block/BlockDetailsUpdate
      fetch(global.champBaseURL + 'Block/BlockDetailsUpdate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
          },
          body: JSON.stringify(anu)
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('logresponseupdate', responseJson);
          if (responseJson.success) {
            Alert.alert('Alert',
            'Updated Successfully',
            [
              {
                text: 'Ok', onPress: () => { }
              },
            ],
            {
              cancelable: false
            }
          );


          } else {
            console.log('hiii', failed);

            Alert.alert('Failed',
              'Updation Failed',
              [
                {
                  text: 'Ok', onPress: () => { this.props.navigation.navigate('ViewIncidentList');}
                },
              ],
              {
                cancelable: false
              }
            );
          }
        })
        .catch((error) => {
          console.log(error)
        })

    }

  }
 

  
  render() {
    console.log('image ', global.viewImageURL + 'PERSON' +
    global.MyAccountID +    '.jpg '+this.state.imageSource+ ' l '+this.state.imageSource !=null);
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    console.log('units',params.NoOfunits)
   
    


    const MAGNIFYING_GLASS_ICON = require('../pages/assets/images/icons8-manager-50.png');

    return (

      <View style={styles.container}>
        <View>
        <View
style={{
paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:45,
}}>
<TouchableOpacity onPress={() => navigate(('CreateBlockScreen'), { cat: '' })}
style={{ flex: 1 , alignSelf:'center'}}>
<Image source={require('../pages/assets/images/back.png')}
style={{ height: 25, width: 25,  }} />
</TouchableOpacity>
<Text style={{ flex: 2, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>
<View style={{ flex: 3, alignSelf: 'center' }}>
<Image source={require('../pages/assets/images/OyeSpace_hor.png')}
style={{
height: 38, width: 95, margin: 5,
alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
}} />
</View>
<View style={{ flex: 3,alignSelf: 'flex-end',alignItems:'flex-end',justifyContent:'flex-end' }}>
                         

                        </View>


</View>
                    <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
<Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',justifyContent:'center',alignContent:'center',marginBottom:10 }}>  Edit Block</Text>
  
        </View>

        <ScrollView>

          <View
            style={{
              flexDirection:
                'column', alignSelf:
                'center',
            }}>

          </View>

          <View

            style={styles.rectangle}>

            <View
              style={styles.row}>

              <View
                style={styles.inputWrap}>

                <TextField

                  label='Block Name'

                  autoCapitalize='sentences'

                  labelHeight={15}
                  maxLength={50}
                  characterRestriction={50}

                  activeLineWidth={0.5}

                  fontSize={12}
                  value={this.state.blockname} 
                  onChangeText={
                    this.handleblockname}

                />
              </View>
            </View>

            <View
              style={styles.row}>

              <View
                style={styles.inputWrap}>

                <TextField

                  label='No of Units'

                  keyboardType={"numeric"}

                 

                  labelHeight={15}

                  maxLength={3}
                  characterRestriction={3}

                  activeLineWidth={0.5}

                  fontSize={12}
                  value={this.state.noofunits}
                  onChangeText={
                    this.handlenofunits
                  }

                />

              </View>


            </View>


        

            <View
              style={{
                flexDirection:
                  'row', alignSelf:
                  'center'
              }}>

       

              <TouchableOpacity

                style={styles.loginScreenButton}

                onPress={this.submit.bind(this)}>

                <Text
                  style={{
                    fontSize: 15,
                    color: 'black', alignSelf: 'center'
                  }}>Update</Text>

              </TouchableOpacity>

            </View>


          </View>

        </ScrollView>

      </View>

    )

  }



}

const styles =
  StyleSheet.create({

    container: {

      justifyContent:
        'flex-start',

      backgroundColor:
        "#fff",

      height: '100%',

      width: '100%',

    },

    input: {

      marginLeft:
        20, marginRight:
        15, marginTop:
        5, marginBottom:
        5,

      height: 40,
      borderColor: '#F2F2F2',
      backgroundColor:
        '#F2F2F2', borderWidth:
        1.5, borderRadius:
        2,

    },



    submitButton: {

      backgroundColor:
        '#ff8c00',

      padding:
        10,

      margin: 15,

      height: 40,

      color: 'white'

    },

    mybutton: {

      backgroundColor:
        'white',

      marginTop:
        5,

      height: 40,

      borderColor:
        'orange',

      borderRadius:
        0,

      borderWidth:
        2,

      textAlign:
        'center',



    },

    rectangle: {

      backgroundColor:
        'white', padding:
        10, borderColor:
        'orange',

      marginLeft: 5,
      marginRight: 5, marginTop:
        5, borderRadius:
        2, borderWidth:
        1,

    },



    textInput: {

      fontSize:
        10,

      height: 25

    },

    datePickerBox: {

      marginBottom:
        32,

      marginLeft:
        60,

      borderColor:
        '#ABABAB',

      borderWidth:
        0.5,

      padding:
        0,

      borderTopLeftRadius:
        4,

      borderTopRightRadius:
        4,

      borderBottomLeftRadius:
        4,

      borderBottomRightRadius:
        4,

      height: 25,

      justifyContent:
        'center'

    },

    profileImgContainer: {

      marginTop:
        5,

      height: 100,

      width: 100,

      borderRadius:
        50,

    },

    profileImg: {

      height: 100,

      width: 100,

      borderRadius:
        50,


    },

    loginScreenButton: {

      alignSelf: 'center',

      width: '50%',

      marginLeft: 10,

      marginTop: 5,

      paddingTop: 2,

      paddingBottom: 2,

      backgroundColor: 'white',

      borderRadius: 5,

      borderWidth:
        1,

      borderColor:
        'orange'

    },

    datePickerText: {

      fontSize:
        14,

      marginLeft:
        5,

      borderWidth:
        0,

      color: '#121212',

    },

    imagee: {

      height: 14,

      width: 14,

      margin: 10,

    },

    row: {

      flex: 1,

      flexDirection:
        "row",

    },

    inputWrap: {

      flex: 1,

      marginLeft: 15,

      paddingRight: 15

    },



    ImageStyle: {

      padding:
        10,

      margin: 5,

      height: 25,

      width: 25,

      resizeMode:
        'stretch',

      alignItems:
        'center'

    },

    SectionStyle: {

      flexDirection:
        'row',

      backgroundColor:
        '#fff',

      borderWidth:
        .5,

      borderColor:
        '#000',

      height: 40,

      borderRadius:
        5,

      margin: 10

    },

    inputLayout: {

      marginTop:
        5,

      marginLeft:
        10,

      marginRight:
        10,

    },

    image: {

      width: 100,

      height: 100,

      marginTop:
        10,

      borderColor:
        'orange',

      borderRadius:
        2,

      borderRadius:
        100 / 2,

      alignSelf:
        'center',

      justifyContent:
        'center',

      alignItems:
        'center',

    },



  })