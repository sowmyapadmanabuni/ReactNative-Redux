import React, { Component } from 'react';
import { BackHandler, AppRegistry, Platform, StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image, SafeAreaView, Linking } from 'react-native';
import ActionButton from 'react-native-action-button';
import RNFetchBlob from 'rn-fetch-blob';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { Toast, Colors } from 'react-native-ui-lib';
import FileViewer from 'react-native-file-viewer';
import Papa from 'papaparse';
import RNFS from 'react-native-fs';
import { Button } from 'react-native-elements';
import Communications from 'react-native-communications';
import { Fonts } from '../pages/src/utils/Fonts'
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: global.DB_NAME });

export default class unitlist extends Component {
  static navigationOptions = {
    title: 'My Unit',
    headerStyle: {
      backgroundColor: '#FA9917',
    },
    headerTitleStyle: {
      color: '#fff',
    }
  };

  constructor() {
    super()
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {
      dataSource: [],
      isLoading: true,
      dataSourcelength:0,
      NoofUnits:0,
      path: '',
      fileName: '',
      toastVisible: false,
      importMesssage: '',
      importError: false,
      importToast: false,
    }

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
              + ' CreatedDateTime VARCHAR(20), ParkingSlotNumber VARCHAR(20),OwnerMobileNumber VARCHAR(20) )',
              []
            );

            // OyeUnit(UnitID integer , " +
            //" AssociationID integer , UnitName VARCHAR(20) ,  Type VARCHAR(20) , AdminAccountID integer , " +
            //" CreatedDateTime VARCHAR(20),  ParkingSlotNumber VARCHAR(20) )

          }
        }
      );
    });
    console.log('unitlist', 'constructor');
  }

  // responseJson.data.unit[i].unUnitID,  responseJson.data.unit[i].asAssnID,
  //responseJson.data.unit[i].unUniName, responseJson.data.unit[i].unUniType,
  //responseJson.data.unit[i].flFloorID, responseJson.data.unit[i].unIsActive,
  //responseJson.data.unit[i].parkingLotNumber

  renderItem = ({ item }) => {
    const { navigate } = this.props.navigation;
  
    return (
      <View style={styles.rectangle}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
        <View>
        <Image 
                source={require('../pages/assets/images/unit.png')}  
                style={{flex:1, marginRight:40}} 
                 />
        </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.title}>{item.unUniName}</Text>
            <Text style={styles.text}>Unit Type: {item.unUniType}</Text>
            <Text style={styles.text}>Occupancy Status: {item.unOcStat}</Text>
            {/* <Text style={styles.text}>Mobile no: {item.owner.uoMobile}</Text> */}
            
           
          </View>

          <View style={{ backgroundColor: 'lightgrey', flexDirection: "column", width: 1, height:'80%' }}></View>
        
          
          
          {/*  {item.status }== 'Active'
            ?
            <TouchableOpacity
              onPress={() => navigate('addmembersScreen', { user: item })}>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <Image source={require('../pages/assets/images/checkbox.png')}

                  style={{ height: 40, width: 40, alignItems: "center" }} />
                <Text style={styles.text}>Reserved</Text>
              </View>
            </TouchableOpacity>
            : */}

         {/*  <TouchableOpacity
            onPress={() => navigate('addmembersScreen', { id: item.unUnitID })}>
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <Image source={require('../pages/assets/images/homee.png')}
                style={{ height: 40, width: 40, alignItems: "center" }} />
              <Text style={styles.text}> Register Me </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate('EditUnitsScreen', { asAssnID: item.asAssnID, unUnitID: item.unUnitID })}>
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <Image source={require('../pages/assets/images/edit.png')}
                style={{ height: 40, width: 40, alignItems: "center" }} />
            </View>
          </TouchableOpacity> */}
          {/* <View style={{flex:0.3}}>

          <TouchableOpacity style={{ margin: 5,flex:1 }}
              onPress={() => Communications.phonecall(item.owner.uoMobile, true)}>
        <Image  
                 style={{margin:10, height:30, width:30}}
                source={require('../pages/assets/images/call_answer_green.png')}  
              
                 />

</TouchableOpacity>

           </View>  */}
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

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    db.transaction(txMyMem => {
      txMyMem.executeSql('SELECT * FROM MyMembership', [], (txMyMem, resultsMyMem) => {
        console.log('unitlist Results MyMembership ', resultsMyMem.rows.length + ' ');

        if (resultsMyMem.rows.length > 0) {
          this.props.navigation.navigate('CreateBlockScreen');
        } else {
          this.props.navigation.navigate('AssnListScreen');
        }

      });
    });
    //this.props.navigation.navigate('SelectMyRoleScreen');
    return true;
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    console.log('unitlist componentdidmount start ', params.id);
    //const url = 'http://oye247api.oye247.com/oye247/api/v1/OYEUnit/OYEUnitlist/'+params.id
    const url = global.champBaseURL +'Unit/GetUnitListByAssocID/' + params.id
    console.log(url)
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('unitlist responseJson ', responseJson)
        this.setState({
          dataSource: responseJson.data.unit.filter(x => x.blBlockID == params.blockID),
          isLoading: false
        })
        var totalapilength=this.state.dataSource.length;
        this.setState({
          dataSourcelength: totalapilength,
          
      })
      this.setState({
        NoofUnits: params.units,
        
    })
        if (responseJson.success) {
          console.log('responseJson count unit ', responseJson.data.unit.length);
          for (let i = 0; i < responseJson.data.unit.length; ++i) {
            //     temp.push(results.rows.item(i));
            console.log('Results unit', responseJson.data.unit[i].unUniName + ' ' + responseJson.data.unit[i].unUnitID);
             console.log('mobile no',responseJson.data.unit[i].owner.uoMobile)
            this.insert_units(responseJson.data.unit[i].unUnitID,
              responseJson.data.unit[i].asAssnID,
              responseJson.data.unit[i].unUniName, responseJson.data.unit[i].unUniType,
              responseJson.data.unit[i].flFloorID, responseJson.data.unit[i].unIsActive,
              
              responseJson.data.unit[i].parkingLotNumber,
              responseJson.data.unit[i].owner.uoMobile);
              

          }

        } else {
          console.log('failurre')
        }
      })
      .catch((error) => {
        console.log('unitlist err ', error);
        this.setState({
          isLoading: false
        })
      })
  }

  insert_units(unit_id, association_id, UnitName, type, admin_account_id, created_date_time, parking_slot_number, owner_mobile_number
  ) {
    db.transaction(function (tx) {
      //// OyeUnit(UnitID integer , " +
      //" AssociationID integer , UnitName VARCHAR(20) ,  Type VARCHAR(20) , AdminAccountID integer , " +
      //" CreatedDateTime VARCHAR(20),  ParkingSlotNumber VARCHAR(20) )
      tx.executeSql(
        'INSERT INTO OyeUnit (UnitID, AssociationID, UnitName, Type, AdminAccountID, CreatedDateTime, ParkingSlotNumber,  ' +
        '  OwnerMobileNumber ) VALUES (?,?,?,?,?,?,?,?)',
        [unit_id, association_id, UnitName, type, admin_account_id, created_date_time, parking_slot_number,owner_mobile_number],
        (tx, results) => {
          console.log('Results oyeUnits ', results.rowsAffected + ' ' + results.tostring());

        }

      );
    });
  }

  exportCsv = () => {
    // const values = [
    //     ['build', '2017-11-05T05:40:35.515Z'],
    //     ['deploy', '2017-11-05T05:42:04.810Z']
    // ];
      
    const headerString = 'Unit Name,Unit Type,Ownership Status,Occupancy Date,Sold Date,Unit Dimension,Unit Calculation Type,Unit Rate,BlockID,AssociationID,AccountID,UnitOwner First Name,UnitOwner Last Name,UnitOwner Mobile Number,UnitOwner Alternate Mobile,UnitOwner EmailID,UnitOwner Alternate EmailID,UnitTenant First Name,UnitTenant Last Name,UnitTenant Mobile Number,UnitTenant Alternate Mobile Number,UnitTenant EmailID,UnitTenant Alternate EmailID,Unit Bank Name,Unit Bank IFSC Code,Account Number,Account Type,Unit Parking Lot Number\n'
//   const headerString = 'event,timestamp\n';
    // const rowString = values.map(d => `${d[0]},${d[1]}\n`).join('');
//   const csvString = `${headerString}${rowString}`;
    const csvString = `${headerString}`;

    let pathToWrite;

    if(Platform.OS === 'android') {
        pathToWrite = `${RNFetchBlob.fs.dirs.DownloadDir}/oyespace_unit.csv`;
    } else {
        pathToWrite = RNFS.DocumentDirectoryPath + '/oyespace_unit.csv';
    }

    console.log('pathToWrite', pathToWrite);

    RNFS.writeFile(pathToWrite, csvString, 'utf8')
    .then((success) => {
        console.log(`wrote file ${pathToWrite}`);
        this.setState({ toastVisible: true, path: pathToWrite })
        // this.readCsv()
        // console.log(success)
    })
    .catch((err) => {
        alert(err.message);
    });
  }

  readCsv = () => {
      const pathToWrite = `${RNFetchBlob.fs.dirs.DownloadDir}/${this.state.fileName}`;

      RNFS.readFile(this.state.path, 'utf8')
      .then((data) => {
          // console.log(data)
          let json = Papa.parse(data);

          console.log(json)
          console.log(json.data[0].length)

          if(json.data[1].length < 28 ) {
              // alert('Import Failed! Please make sure you fill all the fields and try again.');
              this.setState({ importToast: true, importMesssage: 'Import Failed! Please make sure you fill all the fields and try again.', importError: true })
          } else {
              // alert('Import Successful')
              this.setState({ importToast: true, importMesssage: 'Import Successful', importError: false })
          }
      })
      .catch(error => {
          console.log(error)
      })

      // RNFetchBlob.fs.readFile(this.state.path, 'utf8')
      //     .then((data) => {
      //     let json = Papa.parse(data);

      //     console.log(json)
      //     console.log(json.data[0].length)

      //     if(json.data[1].length < 28 ) {
      //         this.setState({ importToast: true, importMesssage: 'All fields must be filled', importError: true })
      //     } else {
      //         this.setState({ importToast: true, importMesssage: 'Import Successful', importError: false })
      //     }
      // })
  }

  importCsv = () => {
    DocumentPicker.show({
        filetype: [DocumentPickerUtil.allFiles()],
      },(error,res) => {

        console.log(error)

        if(error) {
            // alert('Please import a ')
        } else {
            this.readCsv()
            if(res.type !== 'text/comma-separated-values') {
                alert('You can only import CSV files!')
            } else {
                this.setState({ path: res.uri, fileName: res.fileName })
                this.readCsv()
            }
        }
    });
  }

  render() {

    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    // console.log('unitlist start ', params.id);

    const action =  [{label: 'Open csv', backgroundColor: Colors.red40, onPress: () => {
      FileViewer.open(this.state.path)
        .then(() => {
            console.log('open')
            this.setState({ toastVisible: false })
        })
        .catch(error => {
            console.log(error)
      });
    }}]
    return(
      <SafeAreaView style={{ backgroundColor: '#ffffff',height: '100%'  }}>
        <View style={{ backgroundColor: '#ffffff' }}>
          <View
            style={{
              paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
              borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:20,
            }}>
            <TouchableOpacity onPress={() => this.handleBackButtonClick()}
              style={{ flex: 1 }}>
              <Image source={require('../pages/assets/images/back.png')}
                style={{ height: 25, width: 25, marginTop:'8%', justifyContent:'center',alignItems:'center' }} />
            </TouchableOpacity>
            {/* <Text style={{ flex: 1, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text> */}
            {/* <Text style={{ flex: 4, fontSize: 16, color: 'black',  alignSelf: 'center' }}>Units List</Text> */}
            <View style={{ flex: 1, alignContent: 'center' }}>
              <Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
                style={{
                  height: 35, width: 95, margin: 10,
                  alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
                }} />
            </View>
            <View style={{flex:1}}>
              <Text></Text>
            </View>
          </View>
          <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
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
                <Text style={{ backgroundColor: 'white' }}>No Units Created</Text>
              </View>
              :
          <View style={{ backgroundColor: '#ffffff' ,height:'90%', marginTop: 7 }}>
            <Text style={{fontSize: 16, color: 'black',fontWeight:'bold', marginLeft:10 }}>Units List</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
            <Button
                icon={{
                  name: "file-export",
                  size: 16,
                  color: "white",
                  type: "material-community"
                }}
                title="Export CSV"
                titleStyle={{ fontSize: 14 }}
                buttonStyle={{ backgroundColor: 'orange' }}
                onPress={() => this.exportCsv()}
              />
              <Button
                icon={{
                  name: "file-import",
                  size: 16,
                  color: "white",
                  type: "material-community"
                }}
                title="Import CSV"
                titleStyle={{ fontSize: 14 }}
                buttonStyle={{ backgroundColor: 'orange' }}
                onPress={() => this.importCsv()}
              />
          </View>
            <FlatList
              //data={this.state.dataSource}
              style={{ marginBottom: 40,backgroundColor: '#ffffff' }}
              data={this.state.dataSource}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => item.unUnitID}
              ItemSeparatorComponent={this.renderSeparator} />
          </View>}
{this.state.dataSourcelength==this.state.NoofUnits?
<Text style={{color:'black',fontSize:15}}>You already created all units in this block</Text>:
          <ActionButton buttonColor="rgba(250,153,23,1)" onPress={() => navigate('CreateUnitsScreen', { id: params.id })}  >
          </ActionButton>}
          <Toast
            messageStyle={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center', fontWeight: '700' }}
            style={{ flex: 1, width: '100%' }}
            visible={this.state.toastVisible}
            position={'bottom'}
            message='Exported Successfully'
            autoDismiss={1500}
            onDismiss={() => this.setState({toastVisible: false })}
            // onDismiss={() => this.setState({showTopToast: false})}
            // allowDismiss={showDismiss}
            actions={action}
        />
        <Toast
            messageStyle={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center', fontWeight: '700' }}
            style={{ flex: 1, width: '100%' }}
            visible={this.state.importToast}
            position={'bottom'}
            backgroundColor={this.state.importError ? Colors.red40 : Colors.blue40 }
            message={this.state.importMesssage}
            autoDismiss={1500}
            onDismiss={() => this.setState({importToast: false })}
            // allowDismiss={showDismiss}
            // actions={action}
        />
      </SafeAreaView>
    );

    return (
      <View style={{ backgroundColor: '#ffffff' }}>
        <View style={{ backgroundColor: '#ffffff' }}>
          <View
            style={{
              paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
              borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
            }}>
            <TouchableOpacity onPress={() => this.handleBackButtonClick()}
              style={{ flex: 1 }}>
              <Image source={require('../pages/assets/images/back.png')}
                style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
            </TouchableOpacity>
            <Text style={{ flex: 3, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>
            <Text style={{ flex: 4, fontSize: 16, color: 'black', alignSelf: 'center' }}>Units List</Text>
            <View style={{ flex: 4, alignSelf: 'center' }}>
              <Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
                style={{
                  height: 35, width: 105, margin: 5,
                  alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
                }} />
            </View>
          </View>
          <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
        </View>
        {this.state.isLoading
        ?
        <View style={{ flex: 1, justifyContent: 'center', }}>
          <ActivityIndicator size="large" color="#330066" animating />
        </View>
        :
        <View style={{ backgroundColor: 'red', }}>
          <FlatList
            style={{ flex: 4, }}
            data={this.state.dataSource}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.unUnitID}
            ItemSeparatorComponent={this.renderSeparator}
          />
         {/*  <ActionButton style={{ flex: 1, }} buttonColor="rgba(250,153,23,1)" onPress={() => navigate('CreateUnitsScreen', { id: params.id })}  >
          </ActionButton> */}
        </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCDCDC',
  },
  rectangle: { flex: 1, backgroundColor: 'white', padding:10, borderColor: 'orange',
 marginLeft:5, marginRight:5, marginTop:5, borderRadius: 2, borderWidth: 1, },
 text: { fontSize: 15, color : 'black', },
 title: { fontSize: 15,color : 'black', marginBottom:2,fontWeight:'bold'},

});

AppRegistry.registerComponent('unitlist', () => unitlist);