import React, { Component } from 'react';

import {

  AppRegistry, TouchableHighlight, Platform, Alert, TouchableOpacity,

  ScrollView, PermissionsAndroid, StyleSheet, Button, Text, Image, View, FlatList, ActivityIndicator

} from 'react-native';

import { DatePickerDialog } from 'react-native-datepicker-dialog'

import moment from 'moment';

import Communications from 'react-native-communications';

import ImageLoad from 'react-native-image-placeholder';

import { Fonts } from '../pages/src/utils/Fonts';

import RNHTMLtoPDF from 'react-native-html-to-pdf';

import FileViewer from 'react-native-file-viewer';

//import Share from 'react-native-share';




var date = new Date().getDate();

var month = new Date().getMonth() + 1;

var year = new Date().getFullYear();

var htmlVariable="No";
async function getLocationAsync() {
  const { Location, Permissions } = Expo;
  const { status } = await Permissions.askAsync(Permissions.WRITE_EXTERNAL_STORAGE);
  if (status === 'granted') {
    return true
  } else {
    throw new Error('Location permission not granted');
  }
}

// import React, { Component } from 'react';
// import {
//   AppRegistry, TouchableHighlight, Platform, Alert, TouchableOpacity,
//   ScrollView, PermissionsAndroid, StyleSheet, Button, Text, Image, View, FlatList, ActivityIndicator
// } from 'react-native';
// import { DatePickerDialog } from 'react-native-datepicker-dialog'
// import moment from 'moment';
// import Communications from 'react-native-communications';
// import ImageLoad from 'react-native-image-placeholder';
// import { Fonts } from '../pages/src/utils/Fonts';

export default class ViewAllVisitorsList extends Component {



  ShowCurrentDate = () => {

    Alert.alert(date + '-' + month + '-' + year);

  }



  async componentDidMount() {

    await request_location_runtime_permission()

  }



  constructor() {

    super()

    this.state = {

      dataSource: [],

      isLoading: true,

      dobText:  moment(new Date()).format('YYYY-MM-DD'),//year + '-' + month + '-' + date,
      dobText1:  moment(new Date()).format('YYYY-MM-DD'),//year + '-' + month + '-' + date,
      dobDate: null,
      dobDate1: null,

      imageLoading: true,

      chosenDate: new Date(),

       totalVisitors : 0,

       htmlData:'No Data',

       dataBase64:null,



    }



    this.setDate = this.setDate.bind(this);

    this.onDateChange = this.onDateChange.bind(this);

    console.log('anu123', 'constructor');



    var that = this;

    async function requestExternalWritePermission() {

      try {

        const granted = await PermissionsAndroid.request(

          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,

          {

            title: 'CameraExample App External Storage Write Permission',

            message:

              'CameraExample App needs access to Storage data in your SD Card ',

          }

        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {

          //If WRITE_EXTERNAL_STORAGE Permission is granted

          //changing the state to show Create PDF option

          that.setState({ isPermitted: true });

        } else {

         

        }

      } catch (err) {

        console.warn(err);

      }

    }

    //Calling the External Write permission function

    requestExternalWritePermission();



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

  onDOBPress1 = () => {

    let dobDate = this.state.dobDate1;
    if (!dobDate || dobDate == null) {
      dobDate = new Date();
      this.setState({
        dobDate: dobDate
      });
      this.makeRemoteRequest();
    }
    this.refs.dobDialog1.open({
      date: dobDate,
      maxDate: new Date() //To restirct future date
    });
  }


  onDOBDatePicked = (date) => {
    this.setState({
      dobDate: date,
      dobText: moment(date).format('YYYY-MM-DD'),
    });
    this.makeRemoteRequest();
  }

  onDOBDatePicked1 = (date) => {
    this.setState({
      dobDate1: date,
      dobText1: moment(date).format('YYYY-MM-DD'),
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

    var varEntryTime = moment().format(item.vlEntryT);
   let a = moment.utc(item.vlEntryT, "YYYY-MM-DDTHH:mm:ss Z").format('HH:mma');
   console.log('jai bhavani',a)
   var TimeString = item.vlEntryT.substring(11,18)
   var hourEnd = TimeString.indexOf(":");
   var H=+TimeString.substr(0, hourEnd);
   var h=H % 12 || 12;
   var ampm= (H<12 || H ===24)? " AM":" PM";
   TimeString= h + TimeString.substr(hourEnd, 3) + ampm;
   var ExitTimeString = item.vlExitT.substring(11,18)
   var hourEnd = ExitTimeString.indexOf(":");
   var H=+ExitTimeString.substr(0, hourEnd);
   var h=H % 12 || 12;
   var ampm= (H<12 || H ===24)? " AM":" PM";
   ExitTimeString= h + ExitTimeString.substr(hourEnd, 3) + ampm;


  

    console.log(varEntryTime+' renderitem ' + global.viewImageURL + 'PERSONAssociation' + item.asAssnID + 'NONREGULAR' + item.vlVisLgID + '.jpg');

    const { navigate } = this.props.navigation;

    const timeMessage = <View style={{ flexDirection: 'row' }}>

      <Image

        source={require('../pages/assets/images/enter.png')}

        style={{ height: 15, width: 15, marginRight: 5, alignItems: "center" }} />

      <Text style={styles.text}>

        {TimeString} </Text>

      <Image

        source={require('../pages/assets/images/exit.png')}

        style={{ height: 15, width: 15, marginRight: 5, paddingRight: 5, alignItems: "center", marginLeft: 30 }} />

      <Text style={styles.text}>{item.vlExitT.substring(11, 16)=='00:00'?item.vlExitT.substring(11, 16) :ExitTimeString}</Text>

    </View>;

   

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
                source={{ uri: global.viewImageURL + 'PERSONAssociation' + item.asAssnID + 'STAFF' + item.reRgVisID + '.jpg' }} />
                :
                <ImageLoad
                style={{ width: 100, height: 100, marginRight: 10 }}
                style={styles.profileImg}
                loadingStyle={{ size: 'large', color: 'blue' }}
                source={{ uri: global.viewImageURL + 'PERSONAssociation' + item.asAssnID + 'NONREGULAR' + item.vlMobile + '.jpg' }} />
                }
          </TouchableHighlight>


            {/* <TouchableHighlight

              style={[styles.profileImgContainer, { borderColor: 'orange', borderWidth: 1 }]} >

              <ImageLoad

                style={{ width: 100, height: 100, marginRight: 10 }}

                style={styles.profileImg}

                loadingStyle={{ size: 'large', color: 'blue' }}

                source={{ uri: global.viewImageURL + 'PERSONAssociation' + item.asAssnID + 'NONREGULAR' + item.vlVisLgID + '.jpg' }} />



            </TouchableHighlight> */}

            <TouchableHighlight style={styles.vehicleNum}

              underlayColor='#fff'>

              <Text style={styles.text1}>{item.vlVehNum}</Text>

            </TouchableHighlight>

          </View>



          <View style={{ flex: 2, flexDirection: 'column', marginLeft: 5 }}>

            <Text style={styles.title}>{item.vlfName + ' ' + item.vllName+ ' '}</Text>

            {item.vlEntryT.substring(11, 16) === '00:00' && item.vlVisType === 'Child_Exit'

              && item.vlCmnts === '' ? timeMessage : item.vlEntryT.substring(11, 16) === '00:00'

                && item.vlVisType === 'Service Provider'

                && item.vlCmnts === '' ? timeMessage: timeMessage}



            <Text style={styles.text}>Visiting : {item.unUniName}</Text>

            <TouchableOpacity onPress={() =>

              Communications.phonecall(item.vlMobile, true)}>

              <View

                style={{ flex: 1, flexDirection: 'row' }}>

                <Image

                  source={require('../pages/assets/images/call_answer_green.png')}

                  style={{ height: 15, width: 15, alignItems: "center" }} />

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
    if (this.state.dobText > this.state.dobText1) {
      Alert.alert('From Date Should be less than To Date')
      return false;
    }
    this.makeRemoteRequest();



  }

// componentDidUpdate(){
//   this.makeRemoteRequest();

// }

  makeRemoteRequest = () => {



    this.setState({

      isLoading: true

    })

    console.log('ff')

    console.log('componentdidmount')

    //http://localhost:64284/oyesafe/api/v1/VisitorLog/GetVisitorLogByDates

    //http://apidev.oyespace.com/oyesafe/api/v1/VisitorLog/GetVisitorLogByDates

    // const url = 'http://' + global.oyeURL + '/oyesafe/api/v1/Attendance/GetAttendanceListByDatesAndID';

    if (this.state.dobText > this.state.dobText1) {
      Alert.alert('From Date Should be less than To Date')
      return false;
    }
    const url = 'https://' + global.oyeURL + '/oyesafe/api/v1/VisitorLog/GetVisitorLogByDates';
    
    console.log(url)
    requestBody = {
      "StartDate" : this.state.dobText,
      "EndDate" :  this.state.dobText1,
      "ASAssnID" : global.SelectedAssociationID,
    }

    fetch(url, {

      method: 'POST',

      headers: {

        'Content-Type': 'application/json',

        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",

      },
      body: JSON.stringify(requestBody)
     

    })
    
      .then((response) => response.json())

      .then((responseJson) => {

        console.log('vievisitorlist ', responseJson);

        this.setState({

        //  dataSource: responseJson.data.visitorlogbydate.filter(x => x.unUnitID == global.SelectedUnitID),
        dataSource: responseJson.data.visitorlog.sort((a, b) => Date.parse(b.vldCreated) - Date.parse(a.vldCreated)),
        // dataSource: responseJson.data.visitorlog,

          isLoading: false

        })

        var total = 0;

        this.setState({

          htmlData: "No Data for Selected Date"

        })

        htmlVariable="";

        for (var i=0; i<this.state.dataSource.length; i++) {

            total += this.state.dataSource[i].vlVisCnt;

            htmlVariable+='<p style="text-align: center;"> '+this.state.dataSource[i].vlfName + ' ' + this.state.dataSource[i].vllName +

            '  ' + this.state.dataSource[i].vlEntryT + ' ' + this.state.dataSource[i].vlExitT +' ' + this.state.dataSource[i].vlVisCnt +'</p>';

         

        }

        this.setState({

        totalVisitors:total,

        htmlData:htmlVariable

        })

    console.log('total', total)

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

  handlePressLocalFile = () => {

    

      //Android

      console.log('bf ' + this.state.filePath);

      FileViewer.open(this.state.filePath)

      .then(() => {

          // success

          console.log('success ' + this.state.filePath);

      })

      .catch(error => {

          // error

          console.log('error ' + this.state.filePath);

      });

  }

  async createPDF() {

    let options = {

      //Content to print

      html:

        '<h1 style="text-align: center;"><strong>Visitor Report on ' + this.state.dobText+'</strong></h1>'+

        '<h3 style="text-align: center;">Visitors Count : '+this.state.totalVisitors+', Entries : '+this.state.dataSource.length+', Report Generated: '+moment(new Date()).format('YYYY-MM-DD hh:mm a')+'</h3>'+

        '<p style="text-align: center;">'+this.state.htmlData+'</p>',

        

      //File Name

      fileName: 'VisitorReport'+global.SelectedAssociationID+'_' + this.state.dobText,

      html:

      '<h1 style="text-align: center;"><strong>Visitor Report on ' + this.state.dobText1+'</strong></h1>'+

      '<h3 style="text-align: center;">Visitors Count : '+this.state.totalVisitors+', Entries : '+this.state.dataSource.length+', Report Generated: '+moment(new Date()).format('YYYY-MM-DD hh:mm a')+'</h3>'+

      '<p style="text-align: center;">'+this.state.htmlData+'</p>',

      

    //File Name

    fileName: 'VisitorReport'+global.SelectedAssociationID+'_' + this.state.dobText1,

      //File directory

      directory: 'docs',

    };

    let file = await RNHTMLtoPDF.convert(options);

    console.log(file.filePath);

    this.setState({filePath:file.filePath});

     FileViewer.open(this.state.filePath)

      .then(() => {

          // success

          console.log('success ' + this.state.filePath);

        //  Alert.alert("PDF Created");

      })

      .catch(error => {

          // error

          console.log('error ' + this.state.filePath);

         // Alert.alert("PDF Created at "+ this.state.filePath);

      }); 



    //   Share.open({

    //     title: 'Visitors Report : Date:'+this.state.dobText+', Report Generated: '+moment(new Date()).format('YYYY-MM-DD hh:mm a'),

    //     message: 'Visitors Count : '+this.state.totalVisitors+', Entries : '+this.state.dataSource.length+

    //     ', Report Generated: '+moment(new Date()).format('YYYY-MM-DD hh:mm a')+

    //     '\n Thanks and Regards, www.OyeSpace.com',

        

    //     url: 'file://'+this.state.filePath,

    //     subject: 'Visitors Count : '+this.state.totalVisitors+', Entries : '+this.state.dataSource.length+', Report Generated: '+moment(new Date()).format('YYYY-MM-DD hh:mm a'),

        

    // });

    Linking.canOpenURL(file.filePath).then(supported => {

      if (!supported) {

        console.log('Can\'t handle url: ' + file.filePath);

        return Linking.openURL(file.filePath);

      } else {

        return Linking.openURL(file.filePath);

      }

    }).catch(err => console.error('An error occurred', err));

    

  }



  render() {

    console.log('ravi', this.state.dobText.toString())

    const { navigate } = this.props.navigation;



    return (

      <View style={{ backgroundColor: '#FFF', height: '100%' }}>

        <View>

        <View style={{flexDirection:'row',}}>
                    <View style={{flex:1, marginTop:43,marginRight:0, justifyContent:'center',marginLeft:'2%'}}>
                        <TouchableOpacity onPress={() => navigate(('AdminFunction'), { cat: '' })}
                        >
                        <Image source={require('../pages/assets/images/back.png')}
                        style={{ height: 25, width: 25, margin: 5, alignSelf: 'flex-start' }} />
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

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>View All Visitors</Text>

        {/* <View

style={{

paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,

borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center', marginTop: 25,

}}>

            <TouchableOpacity onPress={() => navigate(('ResDashBoard'), { cat: '' })}

              style={{ flex: 1 }}>

              <Image source={require('../pages/assets/images/back.png')}

                style={{ height: 25, width: 25, margin: 10, alignSelf: 'center' }} />

            </TouchableOpacity>

            <Text style={{ flex: 3, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>

<Text style={{ flex: 6, fontSize: 16, color: 'black', alignSelf: 'center', alignItems:'center', justifyContent:'center',fontWeight:'bold' }}>View All Visitors</Text>

<View style={{ flex: 4, alignSelf: 'center' }}>
    <Image source={require('../pages/assets/images/OyeSpace_hor.png')}
    style={{
    height: 35, width: 105, margin: 5,
    alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
    }} />
</View>

          </View>

          <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View> */}

              <View style={{ flexDirection: 'row', justify: 'center', margin: 1, }}>
                  <View style={{ flex: 0.4, flexDirection: 'row',padding:'3%',}}>
                      <Text style={{ fontSize: 14, color: 'black', margin: 2}}>From: </Text>
                      <TouchableOpacity onPress={this.onDOBPress.bind(this)}>
                        <View style={styles.datePickerBox}>
                          <Text style={styles.datePickerText}>{this.state.dobText} </Text>
                          <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />
                        </View >
                      </TouchableOpacity>
                  </View>
                  <View style={{ flex: 0.4, flexDirection: 'row',padding:'3%', marginLeft:'5%' }}>
                      <Text style={{ fontSize: 14, color: 'black', margin: 2}}>To: </Text>
                      <TouchableOpacity onPress={this.onDOBPress1.bind(this)}>
                        <View style={styles.datePickerBox}>
                          <Text style={styles.datePickerText}>{this.state.dobText1} </Text>
                          <DatePickerDialog ref="dobDialog1" onDatePicked={this.onDOBDatePicked1.bind(this)} />
                        </View >
                      </TouchableOpacity>
                  </View>
                  <View style={{ flex: 0.2, padding:2 }}>
                    <Button title="GET" onPress={this.makeRemoteRequest}
                    />
                  </View>
              </View>


          <View style={{flexDirection: 'row', justify: 'center',margin:2, marginRight: 10, paddingLeft:'10%', }}>
              <Text style={{flex:1, fontSize: 15, color: 'black', margin: 2}}>Visitors Count : {this.state.totalVisitors}</Text>
              <Text style={{flex: 1, fontSize: 15, color: 'black', margin: 2}}>Entries : {this.state.dataSource.length}</Text>
          </View>
        </View>
        

       

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

              <View style={{ height: '73%' }}>

                <FlatList

                  data={this.state.dataSource}

                  renderItem={this.renderItem}

                  keyExtractor={(item, index) => item.name}

                  ItemSeparatorComponent={this.renderSeparator}

                />

                

              </View>
              <View style={{alignSelf:'flex-end', justifyContent:'flex-end',marginBottom:20}}>
            <TouchableOpacity  style={styles.rectangle} onPress={this.createPDF.bind(this)}>
              <View>
                <Text style={styles.createPDFButtonText}>Create PDF</Text>
              </View>
            </TouchableOpacity>
          </View>

            </View>

        }

          {/* <View style={{alignSelf:'flex-end', justifyContent:'flex-end'}}>
            <TouchableOpacity  style={styles.rectangle} onPress={this.createPDF.bind(this)}>
              <View>
                <Text style={styles.createPDFButtonText}>Create PDF</Text>
              </View>
            </TouchableOpacity>
          </View> */}

      </View>

    );

  }

}



const styles = StyleSheet.create({



  text: { fontSize: 14,  color: 'black', },

  title: { fontSize: 15,  color: 'black', marginBottom: 2, fontWeight: 'bold' },



  lighttext: { fontSize: 13, color: 'white', },



  TouchableOpacityStyle: {

    position: 'absolute', width: 50, height: 50, alignItems: 'center',

    justifyContent: 'center', right: 30, bottom: 30,

  },



  mybutton1: {

    backgroundColor: 'orange', paddingTop: 8, paddingRight: 12, paddingLeft: 12,

    paddingBottom: 8, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',

  },



  datePickerBox: {

    margin: 2, borderColor: '#ABABAB', borderWidth: 0.5, padding: 0,

    borderTopLeftRadius: 4, borderTopRightRadius: 4, borderBottomLeftRadius: 4, borderBottomRightRadius: 4,

    justifyContent: 'center'

  },



  datePickerText: { fontSize: 15, marginLeft: 5, marginRight: 5, borderWidth: 0, color: '#121212', },



  profileImgContainer: { marginLeft: 3, width: 80, marginTop: 5, borderRadius: 40, },



  profileImg: { height: 120, width: 80, borderRadius: 40, },



  vehicleNum: { backgroundColor: '#E0E0E0', padding: 2, borderRadius: 10, borderWidth: 1, borderColor: '#fff' },



  FloatingButtonStyle: { resizeMode: 'contain', width: 50, height: 50, },

  rectangle: {
    backgroundColor: 'white', padding: 10, borderColor: 'orange',
    margin: 5, borderRadius: 2, borderWidth: 1, alignContent: 'center', marginBottom:'10%',marginRight:'5%',
},

  createPDFButtonText: { color: '#FA9917' }



});



AppRegistry.registerComponent('createassociation', () => createassociation);