/*Home Screen With buttons to navigate to diffrent options*/
import React from 'react';
import { View, NetInfo, StyleSheet, Button, Alert, Image, Text, AppState, ActivityIndicator } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { mystyles } from '../pages/styles';
import { openDatabase } from 'react-native-sqlite-storage';
import { connect } from 'react-redux';
// import PushNotification from 'react-native-push-notification';
// import NotifService from '../dashboard_pages/NotifService';
import { TextField } from 'react-native-material-textfield';
import { updateUserInfo } from '../src/actions';

console.disableYellowBox = true;
global.DB_NAME = 'UserDatabase1.db';
var db = openDatabase({ name: global.DB_NAME });

async function requestReadSmsPermission() {
  try {
    var granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_SMS, {
        title: 'Auto Verification OTP',
        message: 'need access to read sms, to verify OTP'
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('READ_SMS permissions granted', granted);
      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS, {
          title: 'Receive SMS',
          message: 'Need access to receive sms, to verify OTP'
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('RECEIVE_SMS permissions granted', granted);
     
      } else {
        console.log('RECEIVE_SMS permissions denied');
      }
    } else {
      console.log('READ_SMS permissions denied');
    }
  } catch (err) {
  }
}

class SplashScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    // this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
    global.constantAdmin=1;
    global.constantOwner=2;
    global.constantTenant=3;
    global.constantMember=4;

//9450041258
  //  global.oyeURL = 'api.oyespace.com';
    global.oyeURL = 'apidev.oyespace.com';
    global.champBaseURL = 'https://' + global.oyeURL + '/oyeliving/api/v1/';
    global.oye247BaseURL = 'https://' + global.oyeURL + '/oye247/api/v1/';
    global.oyeBaseURL = 'mediaupload.oyespace.com';
    global.viewImageURL = 'http://' + global.oyeBaseURL + '/Images/';
    global.uploadImageURL = 'http://' + global.oyeBaseURL + '/oyeliving/api/v1/association/upload';
    //http://122.166.168.160/Images/assigned_task_orange.png
    //http://122.166.168.160/oyeliving/api/V1/association/upload
    //192.168.0.188:80 & 81
    //  "X-OYE247-APIKey"it: "7470AD35-D51C-42AC-BC21-F45685805BBE",
    // "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
    global.oyeMobileRegex = /^[0]?[456789]\d{9}$/;

    global.oyeNonSpecialRegex = /[^0-9A-Za-z ,]/;
    global.oyeNonSpecialNameRegex = /[^0-9A-Za-z .]/;
    global.oyeEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/;

    const regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    global.OyeFullName=/^[a-zA-Z ]+$/ ;
    const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Account'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {

            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS Account( AccountID INTEGER,  FirstName VARCHAR(50) ,'
              + ' LastName VARCHAR(50), MobileNumber VARCHAR(20), Email VARCHAR(50),  '
              + ' ISDCode VARCHAR(20))',
              []
            );

            // Account( AccountID INTEGER,  FirstName VARCHAR(50) ,LastName VARCHAR(50), '
            //  + '  MobileNumber VARCHAR(20), Email VARCHAR(50),  '+ ' ISDCode VARCHAR(20))

          }
        }
      );
    });

    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='CheckPointList'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS CheckPointList( CheckPointId INTEGER,  CheckPointName VARCHAR(50)) ,  GPSPoint VARCHAR(50), AssnID INTEGER',[]
            );
          }
        }
      );
    });

    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='OTPVerification'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {

            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS OTPVerification( ID INTEGER,  OTPVerified boolean ,'
              + '  MobileNumber VARCHAR(20),   ' + ' ISDCode VARCHAR(20),' + ' Time VARCHAR(50))',
              []
            );

          }
        }
      );
    });

    db.transaction(function (txn) {
      txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='Blocks'", [],
      function (tx, res) {
      
      console.log('item:', res.rows.length);
      if (res.rows.length == 0) {
      txn.executeSql(
      'CREATE TABLE IF NOT EXISTS Blocks(BlockID INTEGER, BlockName VARCHAR(50), '
      + ' BlockType VARCHAR(50),BlockUnits INTEGER,AssnID INTEGER)',
      []
      );
      }
      }
      );
      });

      
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='MyMembership'",
        [],
        function (tx, res) {
          console.log('splash item:', res.rows.length);
          if (res.rows.length == 0) {
            console.log('splash in:', res.rows.length);

            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS MyMembership( OYEMemberID INTEGER, AssociationID INTEGER, OYEUnitID INTEGER ,'
              + ' FirstName VARCHAR(40), LastName VARCHAR(40), MobileNumber VARCHAR(20), Email VARCHAR(30), ParentAccountID INTEGER, '
              + ' OYEMemberRoleID INTEGER, Status VARCHAR(20), AccountID INTEGER , VehicleNumber VARCHAR(100) )',
              []
            );
            console.log('splash out:', res.rows.length);

          }
        }
      );
    });

    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Association'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);

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
            // "asAlexaItg": false, alxex/ogoogle assistanrt "asaiPath": "",alexa p "asOkGItg": false,google
            // "asokgiPath": "", "asSiriItg": false, "assiPath": "", "asCorItg": false,
            // "asciPath": "", "bankDetails": [],  "unit": null

          }
        }
      );
    });

    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='OyeUnit'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {

            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS OyeUnit( UnitID INTEGER,  AssociationID INTEGER ,'
              + ' UnitName VARCHAR(20), Type VARCHAR(20), AdminAccountID INTEGER,  '
              + ' CreatedDateTime VARCHAR(20), ParkingSlotNumber VARCHAR(20) )',
              []
            );

            // OyeUnit(UnitID integer , " +
            //" AssociationID integer , UnitName VARCHAR(20) ,  Type VARCHAR(20) , AdminAccountID integer , " +
            //" CreatedDateTime VARCHAR(20),  ParkingSlotNumber VARCHAR(20) )

          }
        }
      );
    });
    // "ptPtrlID": 5,
    // "wkWorkID": 261,
    // "ptsDateT": "0001-01-01T00:00:00",
    // "pteDateT": "0001-01-01T00:00:00",
    // "psPtrlSID": 1,
    // "asAssnID": 66,
    // "ptdCreated": "2018-12-11T12:42:03",
    // "ptdUpdated": "0001-01-01T00:00:00",
    // "ptIsActive": true
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='PatrollingList'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {

            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS PatrollingList( WorkerID INTEGER,  AssociationID INTEGER ,'
              + ' PatrollingCreated VARCHAR(40), PatrollingEnded VARCHAR(40))',
              []
            );

            // OyeUnit(UnitID integer , " +
            //" AssociationID integer , UnitName VARCHAR(20) ,  Type VARCHAR(20) , AdminAccountID integer , " +
            //" CreatedDateTime VARCHAR(20),  ParkingSlotNumber VARCHAR(20) )

          }
        }
      );
    });

    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='UnitOwner'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {

            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS UnitOwner( OwnerId INTEGER,  OwnerFirstName VARCHAR(50) ,'
              + ' OwnerLastName VARCHAR(50), OwnerMobile VARCHAR(50), OwnerEmail VARCHAR(50), OwnerDueAmnt double, '
              + ' OwnerUnitID INTEGER, OwnerAssnID INTEGER , OwnerCreated VARCHAR(50), OwnerUpdated VARCHAR(50), OwnerIsActive boolean)',
              []
            );

            //  "uoid": 20, "uofName": "Basava",  "uolName": "K", "uoMobile": "+919480107369", "uoMobile1": "",
            //  "uoMobile2": "", "uoMobile3": "",  "uoMobile4": "", "uoEmail": "",  "uoEmail1": "",
            //  "uoEmail2": "", "uoEmail3": "", "uoEmail4": "",  "uocdAmnt": 12.36,  "uoisdCode": null,
            // "unUnitID": 46,  "asAssnID": 30,  "uodCreated": "2018-11-20T09:55:20",
            //  "uodUpdated": "0001-01-01T00:00:00",  "uoIsActive": true

          }
        }
      );
    });

    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Workers'", [],
        function (tx, res) {

          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS Workers( WorkID INTEGER, AssnID INTEGER , FName VARCHAR(50), '
              + ' LName VARCHAR(50), WKMobile VARCHAR(20), WKImgName VARCHAR(200), WrkType VARCHAR(20), '
              + ' Desgn VARCHAR(20), IDCrdNo VARCHAR(20), VendorID INTEGER, BlockID INTEGER, FloorID INTEGER,  '
              + ' Created VARCHAR(20), Updated VARCHAR(20), WKIsActive bool )',
              []
            );
          }
        }
      );
    


    });

    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Blocks'", [],
        function (tx, res) {

          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS Blocks(BlockID INTEGER, BlockName VARCHAR(50), '
              + ' BlockType VARCHAR(50),BlockUnits INTEGER,AssnID INTEGER)',
              []
            );
          }
        }
      );
    });

    db.transaction(function (txn) {
      txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='Attendance'", [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS Attendance( AttendanceID INTEGER, GuardID INTEGER, AssociationID INTEGER ,'
              + ' IMEINo VARCHAR(40), StartDate VARCHAR(20), EndDate VARCHAR(20), StartTime VARCHAR(20), StartGPSPoint VARCHAR(30), '
              + ' EndTime VARCHAR(20), EndGPSPoint VARCHAR(30) )', []
            );

            // create table IF NOT EXISTS Attendance(AttendanceID integer , " +
            //" GuardID integer , AssociationID integer , IMEINo VARCHAR(30), StartDate VARCHAR(20),EndDate VARCHAR(20),  " +
            //" StartTime VARCHAR(10), StartGPSPoint VARCHAR(30), " +
            //" EndTime VARCHAR(10) , EndGPSPoint VARCHAR(30) )

          }
        }
      );
    });

    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='UnitParkingID'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {

            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS UnitParkingID( UPID INTEGER, AssociationID INTEGER)',
              []
            );

          }
        }
      );
    });

    /* db.transaction(tx => {
      tx.executeSql('delete  FROM MyMembership ', [], (tx, results) => {
        console.log('Results MyMembership delete ', results.rowsAffected);
      });
    }); */

    db.transaction(tx1 => {
      tx1.executeSql('SELECT * FROM Account', [], (tx1, results1) => {
        console.log('Results Account ', results1.rows.length + ' ');
        //  AccountID, FirstName, LastName, MobileNumber, Email, ISDCode

        if (results1.rows.length > 0) {
          console.log('Results Account', results1.rows.item(0).AccountID + ' ' + results1.rows.item(0).FirstName + ' '
            + results1.rows.item(0).FirstName + ' ' + results1.rows.item(0).LastName + ' ' + results1.rows.item(0).MobileNumber
            + ' ' + results1.rows.item(0).ISDCode + ' ' + results1.rows.item(0).Email);

          global.MyAccountID = results1.rows.item(0).AccountID;
          global.MyFirstName = results1.rows.item(0).FirstName;
          global.MyLastName = results1.rows.item(0).LastName;
          global.MyEmail = results1.rows.item(0).Email;
          global.MyMobileNumber = results1.rows.item(0).MobileNumber;
          global.MyISDCode = results1.rows.item(0).ISDCode;

          // PushNotification.subscribeToTopic('Phone' +global.MyMobileNumber);
        //  PushNotification.subscribeToTopic('Phone' +global.MyISDCode.replace('+','')+global.MyMobileNumber);

          console.log('subscribeToTopic Phone ', global.MyISDCode+global.MyMobileNumber + ' ');

          db.transaction(txMyMem => {
            txMyMem.executeSql('SELECT * FROM MyMembership', [], (txMyMem, resultsMyMem) => {
              console.log('Results MyMembership ', resultsMyMem.rows.length + ' ');
              //  tx.executeSql('SELECT Distinct M.OYEUnitID, A.UnitName FROM MyMembership M inner Join OyeUnit A on
              // M.OYEUnitID=A.UnitID and M.AssociationID=' + global.SelectedAssociationID, [], (tx, results) => {
              //   UnitOwner (OwnerId, OwnerUnitID, OwnerAssnID, OwnerFirstName, OwnerLastName, OwnerMobile,  ' +
              //  ' OwnerEmail,  OwnerDueAmnt, OwnerCreated ,OwnerUpdated,OwnerIsActive

              if (resultsMyMem.rows.length > 0) {
                console.log('Results MyMembership', resultsMyMem.rows.item(0).AssociationID + ' ' + resultsMyMem.rows.item(0).OYEUnitID + ' '
                  + resultsMyMem.rows.item(0).FirstName + ' ' + resultsMyMem.rows.item(0).LastName + ' ' + resultsMyMem.rows.item(0).MobileNumber
                  + ' ' + resultsMyMem.rows.item(0).OYEMemberRoleID + ' ' + resultsMyMem.rows.item(0).Email);
                global.SelectedAssociationID = resultsMyMem.rows.item(0).AssociationID;
                global.SelectedUnitID = resultsMyMem.rows.item(0).OYEUnitID;
                global.MyOYEMemberID = resultsMyMem.rows.item(0).OYEMemberID;
                global.SelectedRole = resultsMyMem.rows.item(0).OYEMemberRoleID;
                global.SelectedMemberID = resultsMyMem.rows.item(0).OYEMemberID;

                for (let i = 0; i < resultsMyMem.rows.length; ++i) {
                  console.log('Results UnitID', resultsMyMem.rows.item(i).OYEUnitID + ' ' + resultsMyMem.rows.item(i).OYEMemberID);
                  //  this.innsert(results.rows.item(i).UnitID,results.rows.item(i).UnitName,results.rows.item(i).Type);
                  // PushNotification.subscribeToTopic('Unit' + resultsMyMem.rows.item(i).OYEUnitID);
                  // PushNotification.subscribeToTopic('Member' + resultsMyMem.rows.item(i).OYEMemberID);
                  // PushNotification.subscribeToTopic('AllMember' + resultsMyMem.rows.item(i).AssociationID);

                }
                this.props.navigation.navigate('ResDashBoard');

              } else {
                this.props.navigation.navigate('SelectMyRoleScreen');
              }

            });
          });

        } else {
          this.props.navigation.navigate('MobileValid');
        }

      });
    });

    /*  db.transaction(tx2 => {
       tx2.executeSql('SELECT Distinct M.OYEUnitID, UO.OwnerFirstName, OwnerLastName, OwnerMobile,'+
       ' FROM MyMembership M inner Join UnitOwner UO on '+
       ' M.OYEUnitID=UO.OwnerUnitID ' , [], (tx2, results2) => {
         console.log('Results MyMembership ', results2.rows.length+' ');
       //  tx.executeSql('SELECT Distinct M.OYEUnitID, A.UnitName FROM MyMembership M inner Join OyeUnit A on
       // M.OYEUnitID=A.UnitID and M.AssociationID=' + global.SelectedAssociationID, [], (tx, results) => {
      //   UnitOwner (OwnerId, OwnerUnitID, OwnerAssnID, OwnerFirstName, OwnerLastName, OwnerMobile,  ' +
       //  ' OwnerEmail,  OwnerDueAmnt, OwnerCreated ,OwnerUpdated,OwnerIsActive
 
         if(results2.rows.length>0){
           console.log('Results MyMembership', results2.rows.item(0).AssociationID+' '+results2.rows.item(0).OYEUnitID+' '
           +results2.rows.item(0).FirstName+' '+results2.rows.item(0).LastName+' '+results2.rows.item(0).MobileNumber
           +' '+results2.rows.item(0).OYEMemberRoleID+' '+results2.rows.item(0).Email);
          
           global.MyFirstName=results2.rows.item(0).FirstName;
           global.MyLastName=results2.rows.item(0).LastName;
           global.MyEmail=results2.rows.item(0).Email;
           global.MyOYEMemberID=results2.rows.item(0).OYEMemberID;
           global.MyMobileNumber=results2.rows.item(0).MobileNumber;
           global.SelectedRole=results2.rows.item(0).OYEMemberRoleID;
           this.props.navigation.navigate('ResDashBoard');
 
         }else{
           this.props.navigation.navigate('MobileValid');
         }
         
       });
     });    */


  }
  onRegister(token) {
    // Alert.alert("Registered !", JSON.stringify(token));
    console.log(token);
    this.setState({ registerToken: token.token, gcmRegistered: true });
  }

  onNotif(notif) {
    console.log(notif);
    Alert.alert(notif.title, notif.message);
  }

  handlePerm(perms) {
    Alert.alert("Permissions", JSON.stringify(perms));
  }
  state = {
    appState: AppState.currentState,
    netConnectionState: 'start',
    snackIsVisible: false,
    //Setting up the starting visible state of snackbar
    distance: 0,
  };

  componentDidMount() {

    NetInfo.getConnectionInfo().then((connectionInfo) => {
      this.setState({ "netConnectionState": connectionInfo.type });
      console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType
        + '|' + this.state.netConnectionState + '|' + this.state.appState);
    });

    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange.bind(this)
    );
  }

  _onRemoteNotification(notification) {

  }

  navigateAfterFinish = (screen) => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: screen })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  handleFirstConnectivityChange(connectionInfo) {
    this.setState({ "netConnectionState": connectionInfo.type });
    console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType
      + '|' + this.state.netConnectionState + '|' + this.state.appState);
    if (this.state.netConnectionState == 'cellular' || this.state.netConnectionState == 'wifi') {

    } else {
      alert('No net Connected');
    }
  }

  render() {

    // this.props.navigation.navigate('MobileValid');

    //   this.props.navigation.dispatch(NavigationActions.reset({
    // index: 0,
    // actions: [
    //   NavigationActions.navigate('MobileValid')
    // ]
    //   }));

    var n = global.MyVar + " SQLite Example " + this.state.netConnectionState;
    return (
      <View
        style={{
          flex: 1, flexDirection: 'column',
          backgroundColor: '#fff'
        }}>
        <View style={{
          width: '100%', height: '45%',
          alignContent: 'flex-end', justifyContent: 'flex-end'
        }}>
          <Image
            source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
            style={{ width: 150, height: 130, alignSelf: 'center' }}
          />
        </View>
        <ActivityIndicator />
        <Text style={{fontSize:8,color:'black',alignSelf:'center'}} > Data is loading..</Text>

        {/*         <Text style={mystyles.splashHeadline}> OYE SAFE</Text>*/}
        <Text style={mystyles.yourSafetyIsPriceless} > Your Safety is Priceless</Text>
        <Image
          source={require('../pages/assets/images/building_complex.png')}
          style={{ width: '100%', height: '35%', alignSelf: 'center' }}
        />
      </View>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

const mapStateToProps = state => {
  return {

  }
}

export default connect(mapStateToProps, { updateUserInfo })(SplashScreen);