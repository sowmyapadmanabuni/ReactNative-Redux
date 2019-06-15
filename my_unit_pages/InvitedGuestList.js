
import React, { Component } from 'react';
import {
  AppRegistry, TouchableHighlight, NetInfo, Platform,
  Alert, TouchableOpacity, ScrollView, PermissionsAndroid,
  StyleSheet, Button, Text, Image, View, FlatList,TextInput,
  ActivityIndicator
} from 'react-native';
import { DatePickerDialog } from 'react-native-datepicker-dialog'
import moment from 'moment';
import { Fonts } from '../pages/src/utils/Fonts'
import ActionButton from 'react-native-action-button';
import QRCode from 'react-native-qrcode';
console.reportErrorsAsExceptions = false;
console.error = (error) => error.apply;
import Communications from 'react-native-communications';
import PTRView from 'react-native-pull-to-refresh';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import MyHeader from "../components/MyHeader";
import {connect} from 'react-redux';


class InvitedGuest extends Component {

  ShowCurrentDate = () => {

    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    Alert.alert(date + '-' + month + '-' + year);

  }

  /* static
      navigationOptions = {
 
       title: 'View VisitorList',
       headerStyle: {
         backgroundColor: '#FA9917',
       },
       headerTitleStyle: {
         color: '#fff',
       }
 
     }; */

  constructor() {

    super()
    this.state = {
      username:'',
      dataSource: [],
      isLoading: true,
      connection_Status: '',
      dobText: '2018-10-13',
      dobTextDMY: moment(new Date()).format('DD-MM-YYYY'),
      dobDate: null,
      imageLoading: true,
      chosenDate: new Date(),
      

    }

    this.handleChange = this.handleChange.bind(this);
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
      maxDate: new Date()
      //To restirct future date

    });

  }

  onDOBDatePicked = (date) => {

    this.setState({
      dobDate: date,
      dobText: moment(date).format('DD-MM-YYYY')

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

  componentDidMount() {

    this.makeRemoteRequest();

    NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectivityChange);

    NetInfo.isConnected.fetch().done((isConnected) => {

      if (isConnected == true) {
        this.setState({ connection_Status: "Online" });
      } else {
        this.setState({ connection_Status: "Offline" });
        Alert.alert('No Internet',
          'Please Connect to the Internet. ',
          [
            {
              text: 'Ok', onPress: () => { this.props.navigation.navigate('ResDashBoard') }
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

  handleChange(e) {
    this.setState({
      username: e.nativeEvent.text
    });
  }

  _handleConnectivityChange = (isConnected) => {

    if (isConnected == true) {
      this.setState({ connection_Status: "Online" });
    } else {
      this.setState({ connection_Status: "Offline" });
    }

  };

  renderItem = ({ item }) => {
    // this.qrGeneration(item.infName + "," + "" + "," + '+' + item.inMobile + "," + item.inInvtID+ "," +
    // global.SelectedUnitID + "," +item.insDate.substring(0,9) + "," + item.insDate.substring(11,18) + "," + item.inVchlNo + "," + item.inVisCnt + "," +
    // item.ineDate.substring(0,9) + "," + item.inInvtID+ "," + global.SelectedAssociationID + ',', item.inInvtID);
    const { navigate } = this.props.navigation;
    // console.log('manohar', 'http://cohapi.careofhomes.com/Images/PERSONAssociation1NONREGULAR' + item.vlVisLgID + '.jpg');

  //   var varEntryTime = moment().format(item.vlEntryT);
  //  let a = moment.utc(item.vlEntryT, "YYYY-MM-DDTHH:mm:ss Z").format('HH:mma');
  //  console.log('jai bhavani',a)
  //  var TimeString = item.vlEntryT.substring(11,18)
  //  var hourEnd = TimeString.indexOf(":");
  //  var H=+TimeString.substr(0, hourEnd);
  //  var h=H % 12 || 12;
  //  var ampm= (H<12 || H ===24)? " AM":" PM";
  //  TimeString= h + TimeString.substr(hourEnd, 3) + ampm;
  //  var ExitTimeString = item.vlExitT.substring(11,18)
  //  var hourEnd = ExitTimeString.indexOf(":");
  //  var H=+ExitTimeString.substr(0, hourEnd);
  //  var h=H % 12 || 12;
  //  var ampm= (H<12 || H ===24)? " AM":" PM";
  //  ExitTimeString= h + ExitTimeString.substr(hourEnd, 3) + ampm;
    
    return (
      <View
        style={styles.rectangle}>
        <View
          style={{ flex: 1, flexDirection: 'row', padding: 2 }}>

          <View
            style={{ flexDirection: 'column' }}>

            {/* <TouchableHighlight
              style={[styles.profileImgContainer, {
                borderColor: 'orange',
                borderWidth: 1
              }]}
            > */}

              {/* <Image
                source={{
                  uri: global.viewImageURL + 'PERSON' + 'Association' + global.SelectedAssociationID + 'INVITED' + item.inInvtID + '.jpg'
                }}
                style={styles.profileImg}
              /> */}

              {/* <Image source={ require('../pages/assets/images/man-user.png')} style={styles.profileImg} /> */}

            {/* </TouchableHighlight> */}

          </View>

          <View
            style={{ flex: 1, flexDirection: 'column', marginLeft: 15 }}>

            <Text
              style={styles.title}>{item.infName + ' ' + item.inlName}</Text>

<Text style={styles.text}>Invited on:{item.indCreated.substring(0, 10)} {item.indCreated.substring(11, 16)}</Text>
{/* <Text
              style={styles.text}>Purpose of Visit: {item.inpOfInv} </Text> */}
            <TouchableOpacity
              onPress={() => Communications.phonecall(item.inMobile, true)}>
              <View
                style={{ flex: 1, flexDirection: 'row' }}>
                <Image
                  source={require('../pages/assets/images/phone.png')}
                  style={{ height: 15, marginTop: '1%', width: 15, alignItems: "center" }}
                />

                <Text style={styles.text}>{item.inMobile}</Text>
              </View>
            </TouchableOpacity>
            {/* <Image source={require('./team.png')} /> */}
          </View>
          <TouchableOpacity
          onPress={() => navigate('ShareQRCode', {Name: item.infName,MobileNo:item.inMobile,invitationID:item.inInvtID,
        EntryTimeDate:item.insDate,InvitationPurpose:item.inpOfInv,ExitTimeDate:item.ineDate,Vehicleno:item.inVchlNo,VisitorCount:item.inVisCnt})}>
       <Image
                  source={require('../pages/assets/images/share.png')}
                  style={{ height: 25, marginTop: '1%', width: 25, alignItems: "center" }}
                />
                </TouchableOpacity>
                {/* message: global.MyFirstName + ' invites you to ' + //global.AssociationUnitName + ' in ' +
                global.AssociationName + ' for ' + params.InvitationPurpose + ' on ' + Entrydate + ' at ' +
                params.EntryTimeDate.substring(11,16) + '  ', */}
          {/* <Text  onPress={() => navigate('ShareQRCode', {Name: item.infName,MobileNo:item.inMobile,invitationID:item.inInvtID,
          EntryTimeDate:item.insDate,ExitTimeDate:item.ineDate,Vehicleno:item.inVchlNo,VisitorCount:item.inVisCnt})} style={styles.title}>{'SHARE'}</Text> */}
        </View>

        {/* <Image source={{uri: 'http://cohapi.careofhomes.com/Images/PERSONAssociation30NONREGULAR'+item.oyeNonRegularVisitorID+'.jpg'}}
style={{width: 40, height: 40,resizeMode : 'stretch'}} /> */}

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

  makeRemoteRequest = () => {

    const { } = this.props.navigation.state;
    console.log('componentdidmount')
    const url = 'http://' + this.props.oyeURL + '/oye247/api/v1/Invitation/GetInvitationListByAssocID/' + this.props.SelectedAssociationID
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
          dataSource: responseJson.data.invitation.filter(x => x.asAssnID == this.props.SelectedAssociationID),
          dataSource: responseJson.data.invitation.sort((a, b) => Date.parse(b.indCreated) - Date.parse(a.indCreated)),
          isLoading: false
        });

        console.log('anu', dataSource);
      })

      .catch((error) => {
        console.log(error)
      })

  }

  SampleFunction = () => {
    // Write your own code here, Which you want to execute on Floating Button Click Event.
    this.props.navigation.navigate('Unit');
    // Alert.alert("Floating Button Clicked");
  }

  render() {

    console.log('ravi',
      this.state.dobText.toString())

    const {
      navigate } = this.props.navigation;
    return (
      <View style={{ backgroundColor: '#FFF' }}>
  
<View style={{ height: '100%' }}>

<View>
        <View style={{flexDirection:'row',}}>
                    <View style={{flex:1, marginTop:43,marginRight:0, justifyContent:'center',marginLeft:10}}>
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
                    <View style={{ flex: 5, alignItems:'center', justifyContent:'center'}}>
                    <Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
                        style={{height: 40, width: 95, marginTop: 45,marginBottom:5}} />
                    </View>  
                    <View style={{flex:1,marginTop:45, marginRight:10, justifyContent:'center',}}>    
                    </View>                 
                </View> 

                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>My Guests</Text>


          </View>

          <View style={{ backgroundColor: '#ffffff' }}>
            <TextInput style={styles.searchInput}
              placeholder="Search by Name"
              onChange={this.handleChange}
            />
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
              <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white'
              }}>
                <Text style={{ backgroundColor: 'white' }}>No Invitations Sent</Text>
              </View>
              :
              
              <PTRView onRefresh={this.makeRemoteRequest} >
                <ScrollView>
                  <FlatList

                  
                    data={this.state.dataSource.filter(item => item.infName.includes(this.state.username) )}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => item.name}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListHeaderComponent={() => (!this.state.dataSource.length ?
                      <Text style={styles.emptyMessageStyle}>The list is empty</Text>
                      : null)
                    }

                  />
                </ScrollView>
              </PTRView>
          }
          <ActionButton buttonColor="#FA9917" onPress={() => navigate('InviteGuestScreen', { cat: '' })}  >
          </ActionButton>
        </View>
      </View>
    );

    return (

      this.state.isLoading

        ?

        <View
          style={{
            backgroundColor:
              '#FFF', height:
              '100%'
          }}>

          <View
            style={{
              flex: 1,
              justifyContent:
                'center', alignItems:
                'center'
            }}>

            <ActivityIndicator
              size="large"
              color="#330066"
              animating />

          </View>

          <ActionButton
            buttonColor="#FA9917"
            onPress={() => navigate('InviteGuestScreen', { cat: '' })}
          >

          </ActionButton>

        </View>




        :

        <View
          style={{
            backgroundColor:
              '#FFF', flex: 1
          }}>

          <View>

            <TouchableOpacity
              onPress={() => navigate(('ResDashBoard'), { cat: '' })}
              style={{
                paddingTop:
                  2, paddingRight:
                  2, paddingLeft:
                  2, flexDirection:
                  'row', paddingBottom:
                  2, borderColor:
                  'white', borderRadius:
                  0, borderWidth:
                  2, textAlign:
                  'center',
              }}>

              <Image
                source={require('../pages/assets/images/back.png')}


                style={{
                  flex: 1, height:
                    25, width:
                    25, margin:
                    5, alignSelf:
                    'center'
                }}
              />

              <Text
                style={{
                  flex: 3, fontSize:
                    12, paddingLeft:
                    5, fontSize: 14,
                  color: 'black', alignContent: 'flex-start',
                  alignSelf: 'center'
                }}>
              </Text>

              <Text
                style={{
                  flex: 4, fontSize:
                    12, fontSize: 14,
                  color: 'black',
                  alignSelf: 'center'
                }}>Invited Guest</Text>

              <Text
                style={{
                  flex: 4, fontSize:
                    12, fontSize: 14,
                  color: 'black',
                  alignSelf: 'center'
                }}></Text>

            </TouchableOpacity>

            <View
              style={{
                backgroundColor: 'lightgrey', flexDirection:
                  "row", width: '100%',
                height: 1,
              }}></View>

          </View>

          <View
            style={{
              backgroundColor:
                '#FFF'
            }}>

            <View
              style={{
                height: '8%'
              }}>

              <View
                style={{
                  flex: 1,
                  justify: 'center',
                  flexDirection:
                    'row'
                }}>

                <View
                  style={{
                    flex: 1,
                    flexDirection:
                      'row'
                  }}>

                  <Text
                    style={{
                      fontSize: 15,
                      color: 'black',
                      marginTop: 10
                    }}>Select date:
</Text>

                  <TouchableOpacity
                    onPress={this.onDOBPress.bind(this)}
                  >

                    <View
                      style={styles.datePickerBox}>

                      <Text
                        style={styles.datePickerText}>{this.state.dobText}</Text>

                    </View>

                  </TouchableOpacity>

                  <DatePickerDialog
                    ref="dobDialog"
                    onDatePicked={this.onDOBDatePicked.bind(this)}
                  />

                </View>

              </View>

            </View>

            <View
              style={{
                height: '85%'
              }}>




              <FlatList

                data={this.state.dataSource}

                renderItem={this.renderItem}

                keyExtractor={(item, index) => item.name}

                ItemSeparatorComponent={this.renderSeparator}

                ListHeaderComponent={() => (!this.state.dataSource.length ?

                  <Text
                    style={styles.emptyMessageStyle}>The
 list is empty</Text>

                  : null)

                }

              />

            </View>

            <ActionButton
              buttonColor="#FA9917"
              onPress={() => navigate('InviteGuestScreen', { cat: '' })}
            >

            </ActionButton>




            {/* <TouchableOpacity activeOpacity={0.5} onPress={this.SampleFunction} style={styles.TouchableOpacityStyle} >

<Image source={{ uri: 'https://reactnativecode.com/wp-content/uploads/2017/11/Floating_Button.png' }}

style={styles.FloatingButtonStyle} />

</TouchableOpacity> */}


          </View>

        </View>

    );

  }

}




const styles = StyleSheet.create({

    container: {

      flex:
        1,

      backgroundColor:
        '#DCDCDC',

    },

    rectangle: {
      flex: 1,
      backgroundColor:
        'white', padding: 10,
      borderColor: 'orange',

      marginLeft: 5,
      marginRight: 5,
      marginTop: 5,
      borderRadius:
        2, borderWidth:
        1,
    },

    TouchableOpacityStyle: {

      position:
        'absolute',

      width:
        50,

      height:
        50,

      alignItems:
        'center',

      justifyContent:
        'center',

      right:
        30,

      bottom:
        30,

    },

    title: {
      fontSize: 15,
      fontFamily: Fonts.Tahoma,
      color: 'black',
      marginBottom:
        2, fontWeight:
        'bold'
    },

    text: {
      fontSize: hp('2%'),
      color: 'black',
    },

    datePickerBox: {

      marginTop:
        9,

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

      height:
        25,

      justifyContent:
        'center'

    },

    datePickerText: {

      fontSize:
        14,

      marginLeft:
        5,

      borderWidth:
        0,

      color:
        '#121212',

    },

    emptyMessageStyle: {

      textAlign:
        'center',

    },

    text1: {

      fontSize:
        12,

      marginLeft:
        1,

      height:
        40,

      width:
        '100%',

      fontFamily:
        Fonts.OpenSansRegular,

      color:
        'black',

    },

    profileImgContainer: {

      marginLeft:
        3,

      height:
        80,

      width:
        80,

      borderRadius:
        40,

    },

    profileImg: {

      height:
        80,

      width:
        80,

      borderRadius:
        40,

    },

    submit: {

      backgroundColor:
        '#E0E0E0',

      borderRadius:
        10,

      borderWidth:
        4,

      borderColor:
        '#fff'

    },


    searchInput: {
      height: 30, padding: 4, fontSize: 14, borderWidth: 1,
      borderColor: '#F2F2F2', borderRadius: 8, color: 'black', margin: 8
    },

    FloatingButtonStyle: {

      resizeMode:
        'contain',

      width:
        50,

      height:
        50,

    }

  });

  const mapStateToProps = state => {
    return {
      oyeURL: state.OyespaceReducer.oyeURL,
      SelectedAssociationID: state.UserReducer.SelectedAssociationID,
    };
  };
  
export default connect(mapStateToProps)(InvitedGuest);




// import React, { Component } from 'react';
// import {
//   AppRegistry, TouchableHighlight, NetInfo, Platform,
//   Alert, TouchableOpacity, ScrollView, PermissionsAndroid,
//   StyleSheet, Button, Text, Image, View, FlatList,
//   ActivityIndicator
// } from 'react-native';
// import { DatePickerDialog } from 'react-native-datepicker-dialog'
// import moment from 'moment';
// import { Fonts } from '../pages/src/utils/Fonts'
// import ActionButton from 'react-native-action-button';
// import QRCode from 'react-native-qrcode';
// console.reportErrorsAsExceptions = false;
// console.error = (error) => error.apply;
// import Communications from 'react-native-communications';
// import PTRView from 'react-native-pull-to-refresh';
// import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

// export default class InvitedGuest extends Component {

//   ShowCurrentDate = () => {

//     var date = new Date().getDate();
//     var month = new Date().getMonth() + 1;
//     var year = new Date().getFullYear();

//     Alert.alert(date + '-' + month + '-' + year);

//   }

//   /* static
//       navigationOptions = {
 
//        title: 'View VisitorList',
//        headerStyle: {
//          backgroundColor: '#FA9917',
//        },
//        headerTitleStyle: {
//          color: '#fff',
//        }
 
//      }; */

//   constructor() {

//     super()
//     this.state = {
//       dataSource: [],
//       isLoading: true,
//       connection_Status: '',
//       dobText: '2018-10-13',
//       dobTextDMY: moment(new Date()).format('DD-MM-YYYY'),
//       dobDate: null,
//       imageLoading: true,
//       chosenDate: new Date(),

//     }

//     this.setDate = this.setDate.bind(this);
//     this.onDateChange = this.onDateChange.bind(this);

//     console.log('anu123', 'constructor');

//   }

//   onDOBPress = () => {

//     let dobDate = this.state.dobDate;

//     if (!dobDate || dobDate == null) {

//       dobDate = new Date();
//       this.setState({
//         dobDate: dobDate
//       });

//       this.makeRemoteRequest();
//     }

//     this.refs.dobDialog.open({
//       date: dobDate,
//       maxDate: new Date()
//       //To restirct future date

//     });

//   }

//   onDOBDatePicked = (date) => {

//     this.setState({
//       dobDate: date,
//       dobText: moment(date).format('YYYY-MM-DD')

//     });

//     this.makeRemoteRequest();

//   }

//   onDateChange(date) {

//     this.setState({
//       selectedStartDate: date,
//     });

//     this.makeRemoteRequest();

//   }

//   setDate(newDate) {

//     this.setState({ chosenDate: newDate });
//     this.makeRemoteRequest();

//   }

//   componentDidMount() {

//     this.makeRemoteRequest();

//     NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectivityChange);

//     NetInfo.isConnected.fetch().done((isConnected) => {

//       if (isConnected == true) {
//         this.setState({ connection_Status: "Online" });
//       } else {
//         this.setState({ connection_Status: "Offline" });
//         Alert.alert('No Internet',
//           'Please Connect to the Internet. ',
//           [
//             {
//               text: 'Ok', onPress: () => { this.props.navigation.navigate('ResDashBoard') }
//             },
//           ],
//           {
//             cancelable: false
//           }
//         );
//       }
//     });

//   }

//   componentWillUnmount() {
//     NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectivityChange);
//   }

//   _handleConnectivityChange = (isConnected) => {

//     if (isConnected == true) {
//       this.setState({ connection_Status: "Online" });
//     } else {
//       this.setState({ connection_Status: "Offline" });
//     }

//   };

//   renderItem = ({ item }) => {
//     // this.qrGeneration(item.infName + "," + "" + "," + '+' + item.inMobile + "," + item.inInvtID+ "," +
//     // global.SelectedUnitID + "," +item.insDate.substring(0,9) + "," + item.insDate.substring(11,18) + "," + item.inVchlNo + "," + item.inVisCnt + "," +
//     // item.ineDate.substring(0,9) + "," + item.inInvtID+ "," + global.SelectedAssociationID + ',', item.inInvtID);
//     const { navigate } = this.props.navigation;
//     // console.log('manohar', 'http://cohapi.careofhomes.com/Images/PERSONAssociation1NONREGULAR' + item.vlVisLgID + '.jpg');

//     return (
//       <View
//         style={styles.rectangle}>
//         <View
//           style={{ flex: 1, flexDirection: 'row', padding: 2 }}>

//           <View
//             style={{ flexDirection: 'column' }}>

//             <TouchableHighlight
//               style={[styles.profileImgContainer, {
//                 borderColor: 'orange',
//                 borderWidth: 1
//               }]}
//             >

//               <Image
//                 source={{
//                   uri: global.viewImageURL + 'PERSON' + 'Association' + global.SelectedAssociationID + 'INVITED' + item.inInvtID + '.jpg'
//                 }}
//                 style={styles.profileImg}
//               />

//               {/* <Image source={ require('../pages/assets/images/man-user.png')} style={styles.profileImg} /> */}

//             </TouchableHighlight>

//           </View>

//           <View
//             style={{ flex: 1, flexDirection: 'column', marginLeft: 15 }}>

//             <Text
//               style={styles.title}>{item.infName + ' ' + item.inlName}</Text>

//             <Text
//               style={styles.text}>Invited for:{item.insDate.substring(0, 10)} {item.insDate.substring(11, 16)}</Text>
// <Text
//               style={styles.text}>Purpose of Visit: {item.inpOfInv} </Text>
//             <TouchableOpacity
//               onPress={() => Communications.phonecall(item.inMobile, true)}>
//               <View
//                 style={{ flex: 1, flexDirection: 'row' }}>
//                 <Image
//                   source={require('../pages/assets/images/phone.png')}
//                   style={{ height: 15, marginTop: '1%', width: 15, alignItems: "center" }}
//                 />

//                 <Text style={styles.text}>{item.inMobile}</Text>
//               </View>
//             </TouchableOpacity>
//             {/* <Image source={require('./team.png')} /> */}
//           </View>
//           <TouchableOpacity
//           onPress={() => navigate('ShareQRCode', {Name: item.infName,MobileNo:item.inMobile,invitationID:item.inInvtID,
//         EntryTimeDate:item.insDate,InvitationPurpose:item.inpOfInv,ExitTimeDate:item.ineDate,Vehicleno:item.inVchlNo,VisitorCount:item.inVisCnt})}>
//        <Image
//                   source={require('../pages/assets/images/share.png')}
//                   style={{ height: 25, marginTop: '1%', width: 25, alignItems: "center" }}
//                 />
//                 </TouchableOpacity>
//                 {/* message: global.MyFirstName + ' invites you to ' + //global.AssociationUnitName + ' in ' +
//                 global.AssociationName + ' for ' + params.InvitationPurpose + ' on ' + Entrydate + ' at ' +
//                 params.EntryTimeDate.substring(11,16) + '  ', */}
//           {/* <Text  onPress={() => navigate('ShareQRCode', {Name: item.infName,MobileNo:item.inMobile,invitationID:item.inInvtID,
//           EntryTimeDate:item.insDate,ExitTimeDate:item.ineDate,Vehicleno:item.inVchlNo,VisitorCount:item.inVisCnt})} style={styles.title}>{'SHARE'}</Text> */}
//         </View>

//         {/* <Image source={{uri: 'http://cohapi.careofhomes.com/Images/PERSONAssociation30NONREGULAR'+item.oyeNonRegularVisitorID+'.jpg'}}
// style={{width: 40, height: 40,resizeMode : 'stretch'}} /> */}

//       </View>

//     )

//   }

//   renderSeparator = () => {

//     return (
//       <View
//         style={{ height: 2, width: '100%', backgroundColor: '#fff' }}>
//       </View>
//     )

//   }

//   makeRemoteRequest = () => {

//     const { } = this.props.navigation.state;
//     console.log('componentdidmount')
//     const url = 'http://' + global.oyeURL + '/oye247/api/v1/Invitation/GetInvitationListByAssocID/' + global.SelectedAssociationID
//     console.log(url)
//     fetch(url, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
//       },

//     })

//       .then((response) => response.json())
//       .then((responseJson) => {
//         this.setState({
//           dataSource: responseJson.data.invitation.filter(x => x.asAssnID == global.SelectedAssociationID),
//           isLoading: false
//         });

//         console.log('anu', dataSource);
//       })

//       .catch((error) => {
//         console.log(error)
//       })

//   }

//   SampleFunction = () => {
//     // Write your own code here, Which you want to execute on Floating Button Click Event.
//     this.props.navigation.navigate('Unit');
//     // Alert.alert("Floating Button Clicked");
//   }

//   render() {

//     console.log('ravi',
//       this.state.dobText.toString())

//     const {
//       navigate } = this.props.navigation;
//     return (
//       <View style={{ backgroundColor: '#FFF' }}>
        
//         <View style={{ height: '100%' }}>
//           <View>
//           <View
//                         style={{
//                             paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
//                             borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
//                             marginTop:20,
//                         }}>
//                         <TouchableOpacity onPress={() => navigate(('ResDashBoard'), { cat: '' })}
//                             style={{ flex: 1 , alignSelf:'center'}}>
//                             <Image source={require('../pages/assets/images/back.png')}
//                                 style={{ height: 25, width: 25, margin: 10, alignSelf: 'center' }} />
//                         </TouchableOpacity>
//                         <Text style={{ flex: 2, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>
//                         <Text style={{ flex: 6, fontSize: 16, color: 'black', fontWeight:'bold',  alignSelf: 'center' }}>Invited GuestList</Text>
//                         <View style={{ flex: 3, alignSelf: 'center' }}>
//                             <Image source={require('../pages/assets/images/OyeSpace_hor.png')}
//                                 style={{
//                                     height: 35, width: 105, margin: 5,
//                                     alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
//                                 }} />
//                         </View>
//                     </View>
//                     <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
//             <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
//           </View>
//           {this.state.isLoading
//             ?
//             <View style={{
//               flex: 1,
//               alignItems: 'center',
//               justifyContent: 'center',
//               backgroundColor: 'white'
//             }}>
//               <ActivityIndicator
//                 size="large"
//                 color="#330066"
//                 animating />
//             </View>
//             :
//             this.state.dataSource.length == 0 ?
//               <View style={{
//                 flex: 1,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 backgroundColor: 'white'
//               }}>
//                 <Text style={{ backgroundColor: 'white' }}>No Invitations Sent</Text>
//               </View>
//               :
//               <PTRView onRefresh={this.makeRemoteRequest} >
//                 <ScrollView>
//                   <FlatList
//                     data={this.state.dataSource}
//                     renderItem={this.renderItem}
//                     keyExtractor={(item, index) => item.name}
//                     ItemSeparatorComponent={this.renderSeparator}
//                     ListHeaderComponent={() => (!this.state.dataSource.length ?
//                       <Text style={styles.emptyMessageStyle}>The list is empty</Text>
//                       : null)
//                     }

//                   />
//                 </ScrollView>
//               </PTRView>
//           }
//           <ActionButton buttonColor="#FA9917" onPress={() => navigate('InviteGuestScreen', { cat: '' })}  >
//           </ActionButton>
//         </View>
//       </View>
//     );

//     return (

//       this.state.isLoading

//         ?

//         <View
//           style={{
//             backgroundColor:
//               '#FFF', height:
//               '100%'
//           }}>

//           <View
//             style={{
//               flex: 1,
//               justifyContent:
//                 'center', alignItems:
//                 'center'
//             }}>

//             <ActivityIndicator
//               size="large"
//               color="#330066"
//               animating />

//           </View>

//           <ActionButton
//             buttonColor="#FA9917"
//             onPress={() => navigate('InviteGuestScreen', { cat: '' })}
//           >

//           </ActionButton>

//         </View>




//         :

//         <View
//           style={{
//             backgroundColor:
//               '#FFF', flex: 1
//           }}>

//           <View>

//             <TouchableOpacity
//               onPress={() => navigate(('ResDashBoard'), { cat: '' })}
//               style={{
//                 paddingTop:
//                   2, paddingRight:
//                   2, paddingLeft:
//                   2, flexDirection:
//                   'row', paddingBottom:
//                   2, borderColor:
//                   'white', borderRadius:
//                   0, borderWidth:
//                   2, textAlign:
//                   'center',
//               }}>

//               <Image
//                 source={require('../pages/assets/images/back.png')}


//                 style={{
//                   flex: 1, height:
//                     25, width:
//                     25, margin:
//                     5, alignSelf:
//                     'center'
//                 }}
//               />

//               <Text
//                 style={{
//                   flex: 3, fontSize:
//                     12, paddingLeft:
//                     5, fontSize: 14,
//                   color: 'black', alignContent: 'flex-start',
//                   alignSelf: 'center'
//                 }}>
//               </Text>

//               <Text
//                 style={{
//                   flex: 4, fontSize:
//                     12, fontSize: 14,
//                   color: 'black',
//                   alignSelf: 'center'
//                 }}>Invited Guest</Text>

//               <Text
//                 style={{
//                   flex: 4, fontSize:
//                     12, fontSize: 14,
//                   color: 'black',
//                   alignSelf: 'center'
//                 }}></Text>

//             </TouchableOpacity>

//             <View
//               style={{
//                 backgroundColor: 'lightgrey', flexDirection:
//                   "row", width: '100%',
//                 height: 1,
//               }}></View>

//           </View>

//           <View
//             style={{
//               backgroundColor:
//                 '#FFF'
//             }}>

//             <View
//               style={{
//                 height: '8%'
//               }}>

//               <View
//                 style={{
//                   flex: 1,
//                   justify: 'center',
//                   flexDirection:
//                     'row'
//                 }}>

//                 <View
//                   style={{
//                     flex: 1,
//                     flexDirection:
//                       'row'
//                   }}>

//                   <Text
//                     style={{
//                       fontSize: 15,
//                       color: 'black',
//                       marginTop: 10
//                     }}>Select date:
// </Text>

//                   <TouchableOpacity
//                     onPress={this.onDOBPress.bind(this)}
//                   >

//                     <View
//                       style={styles.datePickerBox}>

//                       <Text
//                         style={styles.datePickerText}>{this.state.dobText}</Text>

//                     </View>

//                   </TouchableOpacity>

//                   <DatePickerDialog
//                     ref="dobDialog"
//                     onDatePicked={this.onDOBDatePicked.bind(this)}
//                   />

//                 </View>

//               </View>

//             </View>

//             <View
//               style={{
//                 height: '85%'
//               }}>




//               <FlatList

//                 data={this.state.dataSource}

//                 renderItem={this.renderItem}

//                 keyExtractor={(item, index) => item.name}

//                 ItemSeparatorComponent={this.renderSeparator}

//                 ListHeaderComponent={() => (!this.state.dataSource.length ?

//                   <Text
//                     style={styles.emptyMessageStyle}>The
//  list is empty</Text>

//                   : null)

//                 }

//               />

//             </View>

//             <ActionButton
//               buttonColor="#FA9917"
//               onPress={() => navigate('InviteGuestScreen', { cat: '' })}
//             >

//             </ActionButton>




//             {/* <TouchableOpacity activeOpacity={0.5} onPress={this.SampleFunction} style={styles.TouchableOpacityStyle} >

// <Image source={{ uri: 'https://reactnativecode.com/wp-content/uploads/2017/11/Floating_Button.png' }}

// style={styles.FloatingButtonStyle} />

// </TouchableOpacity> */}


//           </View>

//         </View>

//     );

//   }

// }




// const
//   styles = StyleSheet.create({

//     container: {

//       flex:
//         1,

//       backgroundColor:
//         '#DCDCDC',

//     },

//     rectangle: {
//       flex: 1,
//       backgroundColor:
//         'white', padding: 10,
//       borderColor: 'orange',

//       marginLeft: 5,
//       marginRight: 5,
//       marginTop: 5,
//       borderRadius:
//         2, borderWidth:
//         1,
//     },

//     TouchableOpacityStyle: {

//       position:
//         'absolute',

//       width:
//         50,

//       height:
//         50,

//       alignItems:
//         'center',

//       justifyContent:
//         'center',

//       right:
//         30,

//       bottom:
//         30,

//     },

//     title: {
//       fontSize: 15,
//       fontFamily: Fonts.Tahoma,
//       color: 'black',
//       marginBottom:
//         2, fontWeight:
//         'bold'
//     },

//     text: {
//       fontSize: hp('2%'),
//       color: 'black',
//     },

//     datePickerBox: {

//       marginTop:
//         9,

//       borderColor:
//         '#ABABAB',

//       borderWidth:
//         0.5,

//       padding:
//         0,

//       borderTopLeftRadius:
//         4,

//       borderTopRightRadius:
//         4,

//       borderBottomLeftRadius:
//         4,

//       borderBottomRightRadius:
//         4,

//       height:
//         25,

//       justifyContent:
//         'center'

//     },

//     datePickerText: {

//       fontSize:
//         14,

//       marginLeft:
//         5,

//       borderWidth:
//         0,

//       color:
//         '#121212',

//     },

//     emptyMessageStyle: {

//       textAlign:
//         'center',

//     },

//     text1: {

//       fontSize:
//         12,

//       marginLeft:
//         1,

//       height:
//         40,

//       width:
//         '100%',

//       fontFamily:
//         Fonts.OpenSansRegular,

//       color:
//         'black',

//     },

//     profileImgContainer: {

//       marginLeft:
//         3,

//       height:
//         80,

//       width:
//         80,

//       borderRadius:
//         40,

//     },

//     profileImg: {

//       height:
//         80,

//       width:
//         80,

//       borderRadius:
//         40,

//     },

//     submit: {

//       backgroundColor:
//         '#E0E0E0',

//       borderRadius:
//         10,

//       borderWidth:
//         4,

//       borderColor:
//         '#fff'

//     },




//     FloatingButtonStyle: {

//       resizeMode:
//         'contain',

//       width:
//         50,

//       height:
//         50,

//     }

//   });

