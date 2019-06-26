import React, { Component } from 'react';
import { AppRegistry, Platform, Alert, TouchableOpacity, ScrollView, PermissionsAndroid, StyleSheet,
  Linking, Text, Image, View, FlatList, ActivityIndicator, Button } from 'react-native';
import { DatePickerDialog } from 'react-native-datepicker-dialog'
import moment from 'moment';
//import { Fonts } from '../pages/src/utils/Fonts';

import RNHTMLtoPDF from 'react-native-html-to-pdf';

import FileViewer from 'react-native-file-viewer';

var date = new Date().getDate();
var month = new Date().getMonth() + 1;
var year = new Date().getFullYear();
var htmlVariable="No";

export default class SecurityDailyReport extends Component {
  ShowCurrentDate = () => {

    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

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
      imageLoading: true,
      WorkerId: 8,
      WorkerName: [],
      htmlData:'No Data',
      chosenDate: new Date(),
      
    }

    this.setDate = this.setDate.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    console.log('SecurityDailyReport', 'constructor');
    console.log('SecurityDailyReport ', this.state.WorkerId);
    this.name = this.namebyid.bind(this, this.state.WorkerId);

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
          alert('WRITE_EXTERNAL_STORAGE permission denied');
        }
      } catch (err) {
        alert('Write permission err '+ err);
        console.warn(err);
      }
    }
    //Calling the External Write permission function
    Platform.OS === 'ios' ?  '': requestExternalWritePermission();
   // requestExternalWritePermission();
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

// async createPDF() {
//   let options = {
//     //Content to print
//     html:
//       '<h1 style="text-align: center;"><strong>Attendance Report of ' + this.state.dobText+'</strong></h1>'+
//       '<p style="text-align: center;">'+this.state.htmlData+'</p>',
      
//     //File Name
//     fileName: 'Report'+global.SelectedAssociationID+'_' + this.state.dobText,
//     //File directory
//     directory: 'docs',
//   };
//   let file = await RNHTMLtoPDF.convert(options);
//   console.log(file.filePath);
//   this.setState({filePath:file.filePath});
//   Linking.canOpenURL(file.filePath).then(supported => {
//     if (!supported) {
//       console.log('Can\'t handle url: ' + file.filePath);
//       return Linking.openURL(file.filePath);
//     } else {
//       return Linking.openURL(file.filePath);
//     }
//   }).catch(err => console.error('An error occurred', err));
  
// }

async createPDF() {

  let options = {

    //Content to print

    html:

      '<h1 style="text-align: center;"><strong>Attendance Report from ' + this.state.dobText+'</strong></h1>'+
      '<p style="text-align: center;">'+this.state.htmlData+'</p>',
      
    //File Name
    fileName: 'Report'+global.SelectedAssociationID+'_' + this.state.dobText,

    html:
    '<h1 style="text-align: center;"><strong>Attendance Report to ' + this.state.dobText1+'</strong></h1>'+
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
       Alert.alert("PDF Created");
    })
    .catch(error => {
        // error
        console.log('error ' + this.state.filePath);
       Alert.alert("PDF Created at "+ this.state.filePath);
    }); 
    Linking.canOpenURL(file.filePath).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + file.filePath);
        return Linking.openURL(file.filePath);
      } else {
        return Linking.openURL(file.filePath);
      }
    }).catch(err => console.error('An error occurred', err));
  }


  renderItem = ({ item }) => {

    const { navigate } = this.props.navigation;
    // { atAttndID: 4,       atAtyID: 0,  atsDate: '2018-11-26T00:00:00',   ateDate: '0001-01-01T00:00:00',
    //    atsTime: '2018-11-26T10:17:20',    ateTime: '0001-01-01T00:00:00',  atEntryPt: 'Attendance Point',
    //      atExitPt: '',  wkWorkID: 4,  wsWrkSTID: 1, atgpsPnt: '12.8467694,77.6480307',
    //    atimeiNo: '911568950706600',  atMemType: 'Guard', atAtdType: '',   meMemID: 2,
    //    asAssnID: 1,   atdCreated: '2018-11-26T10:17:20',   atdUpdated: '0001-01-01T00:00:00',   atIsActive: true } 
    //WorkID,M.FName, M.LName,M.Desgn, M.WrkType,A.AttendanceID, A.EndTime,A.StartTime
    return (
      <View style={{ backgroundColor: '#FFFEFE' }}>
        <View style={{ flex: 1, flexDirection: 'row', padding: 2 }}>
          <View style={{ flex: 7, flexDirection: 'row' }}>
            {/* if({item.oyeMemberRoleID}==1){
                      <Text> admin </Text>
                   }else{
                       <Text>rejected</Text> 
                   } */}

            <Text style={{
              flex: 3, fontSize: 14, 
              color: 'black', marginBottom: 8, marginRight: 20, width: '35%'
            }}>{item.FName}  {item.LName}</Text>
            {/*   <Text style={mystyles.title}>{item.wkWorkID} {this.worker_name(item.wkWorkID)} </Text>  
          <Text style={mystyles.intime}>{item.atsTime} </Text>
            <Text style={mystyles.intime}>{item.ateTime} </Text> */}
            <Text style={{ flex: 2, fontSize: 14,  color: 'black', marginLeft: 15 }}
            >{item.StartTime} </Text>
            <Text style={{ flex: 2, fontSize: 14,  color: 'black', marginLeft: 15 }}
            >{item.EndTime} </Text>
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
    console.log('SecurityDailyReport componentDidMount ', this.state.dobText.toString);
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    const { params } = this.props.navigation.state;
   


    const url = 'http://'+global.oyeURL+'oye247/api/v1/Attendance/GetAttendanceListByDatesAndID';
    console.log('SecurityDailyReport componentdidmount '+url)

    requestBody = {
        "ATSDate" : "2018-12-22",
        "ATEDate"	: "2018-12-24",
        "ASAssnID"	: 2
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('GetAttendanceListByAssocID workers', responseJson);
        this.setState({
          dataSource: responseJson.data.attendanceListByAttendyID,
          //  dataSource: responseJson.data.attendanceListByAttendyID,
          //  dataSource:responseJson.data.attendanceListByAttendyID.filter(x => x.atMemType =='RegularVisitor'),
          isLoading: false
        })

        if (responseJson.success) {
          
          console.log('workers count', responseJson.data.attendanceListByAttendyID.length);
          for (let i = 0; i < responseJson.data.attendanceListByAttendyID.length; i++) {
            //  this.state.WorkerId=responseJson.data.workers[i].wkWorkID;

            this.insert_GuardAttendance(responseJson.data.attendanceListByAttendyID[i].atAttndID,
              responseJson.data.attendanceListByAttendyID[i].asAssnID, responseJson.data.attendanceListByAttendyID[i].wkWorkID,
              responseJson.data.attendanceListByAttendyID[i].atimeiNo, responseJson.data.attendanceListByAttendyID[i].atsDate,
              responseJson.data.attendanceListByAttendyID[i].ateDate, responseJson.data.attendanceListByAttendyID[i].atsTime,
              responseJson.data.attendanceListByAttendyID[i].ateTime);
             
             
            console.log("ravi sir", this.state.WorkerId)
          }

          var temp = [];
          this.setState({
            htmlData: "No Data for Selected Date"
          })
          htmlVariable="";
         

        }

      })
      .catch((error) => {
        console.log('err ' + error)
      })
  }

  insert_GuardAttendance(attendance_id, association_id, guard_id, imei_no, start_date, end_date, start_time, end_time) {
    
  }

  SampleFunction = () => {
    // Write your own code here, Which you want to execute on Floating Button Click Event.
    Alert.alert("Floating Button Clicked");

  }
  namebyid(Workerid) {
    
  }

  worker_name(Workerid) {
    var name_of_worker = null;
  }

 

  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    return (

      
<View
style={{
backgroundColor: 
'#FFF' }}>


<View style={{flexDirection:'row',}}>
                    <View style={{flex:1, marginTop:43,marginRight:0, justifyContent:'center',marginLeft:'2%'}}>
                        <TouchableOpacity onPress={() => navigate(('ResDashBoard'), { cat: '' })}
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

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>Security Attendance Report</Text>

{/* <View
style={{

paddingTop: 
5, paddingRight: 
2, paddingLeft: 
2, flexDirection: 
'row', paddingBottom: 
2,

borderColor: 
'white', borderRadius: 
0, borderWidth: 
2, textAlign: 
'center', marginTop: 
25,

}}>

<TouchableOpacity
onPress={()=> navigate(('ResDashBoard'), {
cat: '' })}

style={{
flex: 1 }}>

<Image
source={require('../pages/assets/images/back.png')}

style={{
height: 25,
width: 25,
margin: 5,
alignSelf: 'center' }}
/>

</TouchableOpacity>

<Text
style={{
flex: 2,
paddingLeft: 5,
fontSize: 14,
color: 'black',
alignContent: 
'flex-start', alignSelf: 
'center' }}>
</Text>

<Text
style={{
flex: 6,
fontSize: 16,
color: 'black',
alignSelf: 'center',alignContent:'center',justifyContent:'center',fontWeight:'bold'
 }}>Security Attendance Report</Text>

<View
style={{
flex: 3,
alignSelf: 'center' }}>

<Image
source={require('../pages/assets/images/OyeSpace_hor.png')}

style={{

height: 35,
width: 105,
margin: 5,

alignSelf: 
'center', justifyContent: 
'center', alignItems: 
'center'

}} />

</View>

</View>
<View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View> */}

              <View style={{ flexDirection: 'row', justify: 'center', margin: 1, }}>
                  <View style={{ flex: 0.4, flexDirection: 'row',padding:'3%',}}>
                      <Text style={{ fontSize: 14, color: 'black', margin: 2}}>From Date:</Text>
                      <TouchableOpacity onPress={this.onDOBPress.bind(this)}>
                        <View style={styles.datePickerBox}>
                          <Text style={styles.datePickerText}>{this.state.dobText} </Text>
                          <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />
                        </View >
                      </TouchableOpacity>
                  </View>
                  <View style={{ flex: 0.4, flexDirection: 'row',padding:'3%', marginLeft:'5%' }}>
                      <Text style={{ fontSize: 14, color: 'black', margin: 2}}>To Date:</Text>
                      <TouchableOpacity onPress={this.onDOBPress1.bind(this)}
                      >
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

        <View style={{ height: '10%', marginLeft:'10%' }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
          
            
            { Platform.OS === 'ios' ? <View>
           
            </View>: 
            <TouchableOpacity  style={styles.mybutton} onPress={this.createPDF.bind(this)}>
          <View>
            <Text style={styles.submitButtonText}>Create PDF</Text>
            </View>
          </TouchableOpacity>
          }
            <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />

          </View>
          <View style={{ height: '40%', flex: 1, flexDirection: 'row', padding: 2, marginTop: 5 }}>
            <View style={{ flex: 1, justify: 'center', flexDirection: 'row' }}>
              <Text style={styles.hguard_name}>Name</Text>
              <Text style={styles.hintime}>In Time</Text>
              <Text style={styles.hintime}>Out time</Text>
            </View>
          </View>
        </View>
        <View style={{ height: '60%' }}>
          <ScrollView>
            <FlatList
              data={this.state.dataSource}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => item.wkWorkID}
              ItemSeparatorComponent={this.renderSeparator}
            />
          </ScrollView>

          <TouchableOpacity activeOpacity={0.5} onPress={this.SampleFunction} style={styles.TouchableOpacityStyle} >
          </TouchableOpacity>
        </View>
        <View style={{alignSelf:'flex-end', justifyContent:'flex-end'}}>
            <TouchableOpacity  style={styles.rectangle} 
            onPress={this.createPDF.bind(this)}
            >
              <View>
                <Text style={styles.createPDFButtonText}>Create PDF</Text>
              </View>
            </TouchableOpacity>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
 
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  hguard_name:{
fontSize:  14,
    
    color :   'black',
    marginBottom:8, 
    marginRight:20,
    width:'35%'
    },
    hintime:{
      fontSize: 14,
      
      color : 'black',
      marginLeft:15
      },
  datePickerBox1: {
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
  datePickerBox: {
    margin: 5, borderColor: '#ABABAB', borderWidth: 0.5, padding: 0,
    borderTopLeftRadius: 4, borderTopRightRadius: 4, borderBottomLeftRadius: 4, borderBottomRightRadius: 4,
    justifyContent: 'center'
  },
  datePickerText: { fontSize: 15, marginLeft: 5, marginRight: 5, borderWidth: 0, color: '#121212', },
  submitButtonText: {
    color: 'black',
    margin: '1%',
    textAlign: 'center'
  },
  mybutton: {
    alignSelf: 'center',
    marginTop: 2, marginLeft:5,marginRight:5,marginBottom:2, 
    padding: 2,
   
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'orange'
  },
  mybuttonDisable: {
    alignSelf: 'center',
    marginTop: 5, width: '40%',
    paddingTop: 2,
    paddingBottom: 2,
    backgroundColor: 'lightgrey',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'lightgrey'
  },
  rectangle: {
    backgroundColor: 'white', padding: 10, borderColor: 'orange',
    margin: 5, borderRadius: 2, borderWidth: 1, alignContent: 'center', marginBottom:'10%',marginRight:'5%',
},
createPDFButtonText: { color: '#FA9917' },
});
