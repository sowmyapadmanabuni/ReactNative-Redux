import React, { Component } from 'react';
import {
  BackHandler, Image,
  AppRegistry, Platform, StyleSheet, Text, TextInput, View, FlatList, ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import MyHeader from "../components/MyHeader";
//import { Fonts } from '../pages/src/utils/Fonts';

var db = openDatabase({ name: global.DB_NAME });

export default class associationlist extends Component {


  constructor() {
    super()
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {
      username: '',
      dataSource: [],
      isLoading: true
    }

    console.log('associationlist', 'constructor');
    this.handleChange = this.handleChange.bind(this);
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Association'",
        [],
        function (tx, res) {
          console.log('associationlist item:', res.rows.length);

          if (res.rows.length == 0) {
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS Association( AsiCrFreq INTEGER, AssnID INTEGER, PrpCode VARCHAR(50), Address TEXT ,'
              + ' Country VARCHAR(50), City VARCHAR(50) , State VARCHAR(80), PinCode VARCHAR(40), AsnLogo VARCHAR(200),  '
              + 'AsnName VARCHAR(200) , PrpName VARCHAR(200),GPSLocation VARCHAR(40),'// MaintenanceRate double, MaintenancePenalty double,'
              + ' PrpType VARCHAR(50) , RegrNum VARCHAR(50), WebURL VARCHAR(50), MgrName VARCHAR(50), MgrMobile VARCHAR(20), '
              + ' MgrEmail VARCHAR(50) , AsnEmail VARCHAR(50), PanStat VARCHAR(50), PanNum VARCHAR(50), PanDoc VARCHAR(50), '
              + ' NofBlks INTEGER , NofUnit INTEGER, GstNo VARCHAR(50), TrnsCur VARCHAR(50), RefCode VARCHAR(50), '
              + ' MtType VARCHAR(50) , MtDimBs INTEGER, MtFRate INTEGER, UniMsmt VARCHAR(50), BGnDate VARCHAR(50), '
              + ' LpcType VARCHAR(50) , LpChrg INTEGER, LpsDate VARCHAR(50), OtpStat VARCHAR(50), PhotoStat VARCHAR(50), '
              + ' NameStat VARCHAR(50) , MobileStat VARCHAR(50), LogStat VARCHAR(50), GpsPnt VARCHAR(50), PyDate VARCHAR(50), '
              + ' Created VARCHAR(50) , Updated VARCHAR(50), IsActive bool, bToggle VARCHAR(50), AutovPymnt bool, '
              + ' AutoInvc bool , AlexaItg bool, aiPath VARCHAR(50), OkGItg bool, okgiPath VARCHAR(50), '
              + ' SiriItg bool , siPath VARCHAR(50), CorItg bool, ciPath VARCHAR(50), unit VARCHAR(50) ,Validity VARCHAR(50))',
              []
            );
            // "asiCrFreq": 0,  "asAssnID": 6, "asPrpCode": "", "asAddress": "Electronic City",
            // "asCountry": "India", "asCity": "Bangalore", "asState": "karnataka",  "asPinCode": "560101",
            // "asAsnLogo": "192.168.1.27:81/Images/Robo.jpeg", "asAsnName": "Prime Flora",  "asPrpName": "Electro",
            // "asPrpType": "", "asRegrNum": "6876768", "asWebURL": "www.careofhomes.com", "asMgrName": "Tapaswini",
            // "asMgrMobile": "7008295630",  "asMgrEmail": "tapaswiniransingh7@gmail.com",
            // "asAsnEmail": "tapaswini_ransingh@careofhomes.com",  "aspanStat": "True",  "aspanNum": "560066",
            // "aspanDoc": "", "asNofBlks": 9, "asNofUnit": 5, "asgstNo": "", "asTrnsCur": "",
            //   "asRefCode": "", "asMtType": "",Maintannace type "asMtDimBs": 0,dimension based value 
            // "asMtFRate": 0,maintance flat rate   "asUniMsmt": "",unit measurement
            // "asbGnDate": "2018-11-04T00:00:00", "aslpcType": "",late payment online/cash "aslpChrg": 0,late payment charge
            // "aslpsDate": "2018-11-04T00:00:00", "asotpStat": "ON", "asopStat": "ON",photo
            // "asonStat": "ON",name "asomStat": "ON",mobile  "asoloStat": "ON",log of staus "asgpsPnt": null,
            // "asdPyDate": "0001-01-01T00:00:00",payment date "asdCreated": "2018-11-04T00:00:00", "asdUpdated": "2018-11-04T00:00:00",
            // "asIsActive": true, "asbToggle": false, // "asavPymnt": false,is payment? "asaInvc": false,invoice
            // "asAlexaItg": false, alxex/ogoogle assistanrt "asaiPath": "",alexa p "asOkGItg": false,google // "asokgiPath": "", 
            // "asSiriItg": false, "assiPath": "", "asCorItg": false, // "asciPath": "", "bankDetails": [],  "unit": null


          }
        }
      );
    });
  }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    db.transaction(txMyMem => {
      txMyMem.executeSql('SELECT * FROM MyMembership', [], (txMyMem, resultsMyMem) => {
        console.log('associationlist Results MyMembership ', resultsMyMem.rows.length + ' ');

        if (resultsMyMem.rows.length > 0) {
          this.props.navigation.navigate('ResDashBoard');
        } else {
          this.props.navigation.navigate('SelectMyRoleScreen');
        }

      });
    });
    return true;
  }

  handleChange(e) {
    this.setState({
      username: e.nativeEvent.text
    });
  }

  /** 
   * {
"data": {
    "associations": [
        {
            "asiCrFreq": 0,
            "asAssnID": 6,
            "asPrpCode": "",
            "asAddress": "Electronic City",
            "asCountry": "India",
            "asCity": "Bangalore",
            "asState": "karnataka",
            "asPinCode": "560101",
            "asAsnLogo": "192.168.1.27:81/Images/Robo.jpeg",
            "asAsnName": "Prime Flora",
            "asPrpName": "Electro",
            "asPrpType": "",
            "asRegrNum": "6876768",
            "asWebURL": "www.careofhomes.com",
            "asMgrName": "Tapaswini",
            "asMgrMobile": "7008295630",
            "asMgrEmail": "tapaswiniransingh7@gmail.com",
            "asAsnEmail": "tapaswini_ransingh@careofhomes.com",
            "aspanStat": "True",
            "aspanNum": "560066",
            "aspanDoc": "",
            "asNofBlks": 9,
            "asNofUnit": 5,
            "asgstNo": "",
            "asTrnsCur": "",
            "asRefCode": "",
            "asMtType": "",Maintannace type
            "asMtDimBs": 0,dimension based value
            "asMtFRate": 0,maintance flat rate
            "asUniMsmt": "",unit measurement
            "asbGnDate": "2018-11-04T00:00:00",
            "aslpcType": "",late payment online/cash
            "aslpChrg": 0,late payment charge
            "aslpsDate": "2018-11-04T00:00:00",
            "asotpStat": "ON",
            "asopStat": "ON",photo
            "asonStat": "ON",name
            "asomStat": "ON",mobile
            "asoloStat": "ON",log of staus
            "asgpsPnt": null,
            "asdPyDate": "0001-01-01T00:00:00",payment date
            "asdCreated": "2018-11-04T00:00:00",
            "asdUpdated": "2018-11-04T00:00:00",
            "asIsActive": true,
            "asbToggle": false,
            // "asavPymnt": false,is payment?
            "asaInvc": false,invoice
            "asAlexaItg": false, alxex/ogoogle assistanrt
            "asaiPath": "",alexa p
            "asOkGItg": false,google
            "asokgiPath": "",
            "asSiriItg": false,
            "assiPath": "",
            "asCorItg": false,
            "asciPath": "",
            "bankDetails": [],
            "unit": null

        },
   * 
  */

  renderItem = ({ item }) => {
    // console.log('associationlist renderItem', item.asAsnName + "," + item.asPinCode + "," + item.asNofBlks + "," + item.asNofUnit);
    const { navigate } = this.props.navigation;
    // console.log("________-HEHR ____")
    // console.log(item)
    return (

      <View style={styles.rectangle}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text style={styles.title}>{item.asAsnName}</Text>
          <Text style={styles.subtext}>{item.asAddress} {item.asCity}</Text>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <Text style={styles.text}>Country : {item.asCountry}</Text>
              <Text style={styles.text}>Total Units : {item.asNofUnit} </Text>
            </View>
            <TouchableOpacity
              style={styles.mybutton1}
              onPress={() => navigate('Unit', { id: item.asAssnID, associationName: item.asAsnName })}  /*Products is navigation name*/>
              <Text style={styles.lighttext}> JOIN </Text>
            </TouchableOpacity>
            {/*Products is navigation name*/}
            {/* <TouchableOpacity
              style={styles.mybutton1}
              onPress={() => navigate('EditAssnScreen', {
                id: item.asAssnID,
                name: item.asAsnName,
                asAddress: item.asAddress,
                country: item.country, asCity: item.asCity,
                asState: item.asState,
                asPrpName: item.asPrpName,
                asMgrName: item.asMgrName,
                asMgrMobile: item.asMgrMobile,
                asMgrEmail: item.asMgrEmail,
                asNofUnit: item.asNofUnit + '',
                asMgrEmail: item.asMgrEmail,
                locality: item.asCity,
                asPinCode: item.asPinCode,
                asNofBlks: item.asNofBlks + '',
                asAsnEmail: item.asAsnEmail,
                asPrpType: item.asPrpType,
                panNo: item.aspanNum,
              })}  >
              <Text style={styles.lighttext}> Edit </Text>
            </TouchableOpacity> */}
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

    console.log('associationlist componentdidmount')
    const url = global.champBaseURL + 'association/getassociationlist'
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          dataSource: responseJson.data.associations, // dataSource: responseJson.data.associations.filter(x => x.associationID ==30) associationid  
          isLoading: false
        })

        console.log('associationlist responseJson', responseJson);
        if (responseJson.success) {

          console.log('responseJson count Association ', responseJson.data.associations.length);
          for (let i = 0; i < responseJson.data.associations.length; ++i) {

            console.log('Results Association', responseJson.data.associations[i].associationID + ' ' + responseJson.data.associations[i].name + ' ' + responseJson.data.associations[i].panNo);

          }

        } else {
          console.log('associationlist responseJson failurre')
        }

      })
      .catch((error) => {
        console.log('associationlist err ' + error)
      })
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ backgroundColor: '#ffffff' }}>
        <View style={{ backgroundColor: '#ffffff' }}>
        
        <View style={{flexDirection:'row',}}>
                    <View style={{flex:1, marginTop:43,marginRight:0, justifyContent:'center',marginLeft:'2%'}}>
                        <TouchableOpacity onPress={() => navigate(('AdminFunction'), { cat: '' })}
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
                    <View style={{ flex: 6, alignItems:'center', justifyContent:'center',}}>
                    <Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
                        style={{height: 40, width: 95, marginTop: 45,marginBottom:5}} />
                    </View>  
                    <View style={{flex:1,marginTop:45, marginRight:10, justifyContent:'center',}}>    
                    </View>                 
                </View> 

                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>Join Association</Text>


      {/* <MyHeader navigation={this.props.navigation} title="Menu" Image source={require('../pages/assets/images/menu_button.png')}
style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }}  /> */}
          {/* <View
            style={{
              paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
              borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
              marginTop:20,
            }}>
            <TouchableOpacity onPress={() => this.handleBackButtonClick()}
              style={{ flex: 1 }}>
              <Image source={require('../pages/assets/images/back.png')}
                style={{ height: 25, width: 25, margin: 10, alignSelf: 'center' }} />
            </TouchableOpacity>
            <Text style={{ flex: 3, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>
            <Text style={{ flex: 4, fontSize: 16, color: 'black',  alignSelf: 'center' }}>Associations</Text>
            <View style={{ flex: 4, alignSelf: 'center' }}>
              <Image source={require('../pages/assets/images/OyeSpace_hor.png')}
                style={{
                  height: 35, width: 105, margin: 5,
                  alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
                }} />
            </View>
          </View>
          <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View> */}
        </View>
        {this.state.isLoading
          ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
            <ActivityIndicator size="large" color="#330066" animating />
          </View>
          :
          <View style={{ backgroundColor: '#ffffff' }}>
            <TextInput style={styles.searchInput}
              placeholder="Search by Country/Name/Pincode.."
              onChange={this.handleChange}
            />
            <FlatList
              //data={this.state.dataSource}
              style={{ marginBottom: 40,backgroundColor: '#ffffff' }}
              data={this.state.dataSource.filter(item => item.asPinCode.includes(this.state.username.toUpperCase())
                || item.asAsnName.toUpperCase().includes(this.state.username.toUpperCase()) || item.asCountry.includes(this.state.username.toUpperCase()) || item.asCity.includes(this.state.username.toUpperCase()))}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => item.name}
              ItemSeparatorComponent={this.renderSeparator} />
          </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({

  main: {
    flex: 1, padding: 30, marginTop: 5, flexDirection: 'column',
    justifyContent: 'center', backgroundColor: '#2a8ab7'
  },

  title: { marginTop: 20, fontSize: 25, textAlign: 'center' },

  searchInput: {
    height: 30, padding: 4, fontSize: 14, borderWidth: 1,
    borderColor: '#F2F2F2', borderRadius: 8, color: 'black', margin: 8
  },

  buttonText: { fontSize: 18, color: '#111', alignSelf: 'center' },

  button: {
    height: 45, flexDirection: 'row', backgroundColor: 'white', borderColor: 'white', borderWidth: 1,
    borderRadius: 8, marginBottom: 10, marginTop: 10, alignSelf: 'stretch', justifyContent: 'center'
  },
  rectangle: {
    flex: 1, backgroundColor: 'white', padding: 10, borderColor: 'orange',
    marginLeft: 5, marginRight: 5, marginTop: 5, borderRadius: 2, borderWidth: 1,
  },
  title: { fontSize: 18,  color: 'black', marginBottom: 8, fontWeight: 'bold' },

  subtext: { fontSize: 12,  color: 'black', marginBottom: 10, },

  text: { fontSize: 10,  color: 'black', },

  mybutton1: {
    backgroundColor: 'orange', paddingTop: 8, paddingRight: 12, paddingLeft: 12,
    paddingBottom: 8, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
  },
  lighttext: { fontSize: 13,  color: 'white', },
});

AppRegistry.registerComponent('associationlist', () => associationlist);