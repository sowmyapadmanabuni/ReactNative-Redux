
import React, { Component } from 'react';
import {
  Platform, Button, StyleSheet, TextInput, Image, Text, View, FlatList, ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import Communications from 'react-native-communications';
import ActionButton from 'react-native-action-button';
//import { Fonts } from '../pages/src/utils/Fonts'
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: global.DB_NAME });

export default class ViewmembersList extends Component {
  constructor() {
    super()
    this.state = {
      dataSource: [],
      isLoading: true
    }
    console.log('ViewmembersList', 'constructor');
  }
  static navigationOptions = {
    title: 'View MembersList',
    headerStyle: {
      backgroundColor: '#696969',
    },
    headerTitleStyle: {
      color: '#fff',
    }
  };

  renderItem = ({ item }) => {
    //OwnerFirstName, UO.OwnerLastName, UO.OwnerMobile, '+ ' A.UnitID, A.UnitName
    console.log('ViewmembersList renderItem ', item.uofName + ', ' + item.uolName);
    return (
      <TouchableOpacity style={{ flex: 1, flexDirection: 'row', marginBottom: 3 }}
        /* onPress={() => ToastAndroid.show(item.book_title,ToastAndroid.SHORT)}*/
        onPress={() => alert(item.subject)}>
        <View style={{ flex: 1, justifyContent: 'center', marginLeft: 5 }}>
          <Text style={{ fontSize: 18, color: 'green', marginBottom: 15 }}>
            {item.uofName} {item.uolName}{item.OwnerAssnID }{ item.AssociationID}
          </Text>
          <Text style={{ fontSize: 16, color: 'red' }}>
            {item.uoMobile}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderSeparator = () => {
    return (
      <View
        style={{ height: 1, width: '100%', backgroundColor: 'darkgrey' }}>
      </View>
    )
  }

  componentDidMount() {
    console.log('ViewmembersList componentdidmount start ', global.SelectedAssociationID);
    //const url = 'http://oye247api.oye247.com/oye247/api/v1/OYEUnit/OYEUnitlist/'+params.id
    const urlUnitList = global.champBaseURL + 'Unit/GetUnitListByAssocID/' + global.SelectedAssociationID
    console.log(urlUnitList)
    fetch(urlUnitList, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('ViewmembersList unitlist responseJson ', responseJson)

        if (responseJson.success) {
          console.log('responseJson count unit ', responseJson.data.unit.length);
          db.transaction(tx => {
            tx.executeSql('delete  FROM OyeUnit where AssociationID=' + global.SelectedAssociationID, [], (tx, results) => {
              console.log('Results OyeUnit delete ', results.rowsAffected);
            });
          });
          for (let i = 0; i < responseJson.data.unit.length; ++i) {
            //     temp.push(results.rows.item(i));
            console.log('Results unit', responseJson.data.unit[i].unUniName + ' ' + responseJson.data.unit[i].unUnitID);

            this.insert_units(responseJson.data.unit[i].unUnitID,
              responseJson.data.unit[i].asAssnID,
              responseJson.data.unit[i].unUniName, responseJson.data.unit[i].unUniType,
              responseJson.data.unit[i].flFloorID, responseJson.data.unit[i].unIsActive,
              responseJson.data.unit[i].parkingLotNumber);

          }

        } else {
          console.log('failurre')
        }
      })
      .catch((error) => {
        console.log('unitlist err ', error);
       
      })
    const url = global.champBaseURL + 'Member/GetMemUniOwnerTenantListByAssoc/' + global.SelectedAssociationID
    console.log('ViewmembersList ', 'componentdidmount '+ url);

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('ViewmembersList responseJson ', responseJson.data.members);
        console.log('ViewmembersList responseJson ', responseJson.data.unitOwner);
        for (let i = 0; i < responseJson.data.unitOwner.length; ++i) {
          //     temp.push(results.rows.item(i));

          console.log('Results UnitOwner ', responseJson.data.unitOwner[i].uofName + ' ' + responseJson.data.unitOwner[i].unUnitID);

          //  "uoid": 20, "uofName": "Basava",  "uolName": "K", "uoMobile": "+919480107369", "uoMobile1": "",
          //  "uoMobile2": "", "uoMobile3": "",  "uoMobile4": "", "uoEmail": "",  "uoEmail1": "",
          //  "uoEmail2": "", "uoEmail3": "", "uoEmail4": "",  "uocdAmnt": 12.36,  "uoisdCode": null,
          // "unUnitID": 46,  "asAssnID": 30,  "uodCreated": "2018-11-20T09:55:20",
          //  "uodUpdated": "0001-01-01T00:00:00",  "uoIsActive": true

          this.insert_unitOwners(responseJson.data.unitOwner[i].uoid,
            responseJson.data.unitOwner[i].unUnitID, responseJson.data.unitOwner[i].asAssnID,
            responseJson.data.unitOwner[i].uofName, responseJson.data.unitOwner[i].uolName,
            responseJson.data.unitOwner[i].uoMobile, responseJson.data.unitOwner[i].uoEmail,
            responseJson.data.unitOwner[i].uocdAmnt, responseJson.data.unitOwner[i].uodCreated,
            responseJson.data.unitOwner[i].uodUpdated, responseJson.data.unitOwner[i].uoIsActive);
        }
        this.setState({
          //          dataSource: responseJson.data.unitOwner,
          isLoading: false
        })

        db.transaction(tx => {

          tx.executeSql('SELECT Distinct UO.OwnerId , UO.OwnerFirstName, UO.OwnerLastName, UO.OwnerMobile, ' +
            ' A.UnitID, A.UnitName ,UO.OwnerAssnID ,A.AssociationID  FROM OyeUnit A  left Join UnitOwner UO on UO.OwnerUnitID=A.UnitID ' +
             ' where A.AssociationID='+global.SelectedAssociationID, [], (tx, results) => {
              var temp = [];
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
                console.log('dataSourceUnitPkr UnitID ' + i, results.rows.item(i).OwnerFirstName + ' ' + results.rows.item(i).UnitName + ' ' + results.rows.item(i).UnitID);
              }
              this.setState({
                dataSource: temp,
              });
            });
        });
      })
      .catch((error) => {
        console.log('responseJson err ' + error)
      })
  }

  insert_unitOwners(owner_id, unit_id, association_id, owner_first_name, owner_last_name, owner_mobile,
    owner_email, owner_due_amnt, owner_created, owner_updated, owne_is_active
  ) {
    db.transaction(function (tx) {
      ////  'CREATE TABLE IF NOT EXISTS UnitOwner( OwnerId INTEGER,  OwnerFirstName VARCHAR(50) ,'
      //  + ' OwnerLastName VARCHAR(50), OwnerMobile VARCHAR(50), OwnerEmail VARCHAR(50), OwnerDueAmnt double, '
      //  + ' OwnerUnitID INTEGER, OwnerAssnID INTEGER , OwnerCreated VARCHAR(50), OwnerUpdated VARCHAR(50), OwnerIsActive boolean)',

      tx.executeSql(
        'INSERT INTO UnitOwner (OwnerId, OwnerUnitID, OwnerAssnID, OwnerFirstName, OwnerLastName, OwnerMobile,  ' +
        ' OwnerEmail,  OwnerDueAmnt, OwnerCreated ,OwnerUpdated,OwnerIsActive) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        [owner_id, unit_id, association_id, owner_first_name, owner_last_name, owner_mobile,
          owner_email, owner_due_amnt, owner_created, owner_updated, owne_is_active],
        (tx, results) => {
          console.log('INSERT UnitOwner ', results.rowsAffected + ' ' + owner_id);

        }
      );
    });
  }
  insert_units(unit_id, association_id, UnitName, type, admin_account_id, created_date_time, parking_slot_number
    ) {
      db.transaction(function (tx) {
        //// OyeUnit(UnitID integer , " +
        //" AssociationID integer , UnitName VARCHAR(20) ,  Type VARCHAR(20) , AdminAccountID integer , " +
        //" CreatedDateTime VARCHAR(20),  ParkingSlotNumber VARCHAR(20) )
        tx.executeSql(
          'INSERT INTO OyeUnit (UnitID, AssociationID, UnitName, Type, AdminAccountID, CreatedDateTime,  ' +
          '  ParkingSlotNumber ) VALUES (?,?,?,?,?,?,?)',
          [unit_id, association_id, UnitName, type, admin_account_id, created_date_time, parking_slot_number],
          (tx, results) => {
            console.log('Results oyeUnits ', results.rowsAffected + ' ' + association_id);
  
          }
        );
      });
    }
  render() {
    const { navigate } = this.props.navigation;
    //    //OwnerFirstName, UO.OwnerLastName, UO.OwnerMobile, '+ ' A.UnitID, A.UnitName

    return (

      <View style={{ backgroundColor: '#FFF', height: '100%' }}>
        <View>
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

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>Members List</Text>


          </View>
        </View>
      {this.state.isLoading
        ?
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#330066" animating />
        </View>
        :
        <View style={{ backgroundColor: '#fff', flex: 5,  }}>
        <View style={{ backgroundColor: '#fff',alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', padding: 2 ,marginLeft:'2%'}}>
                  <Text style={styles.text}>Unit</Text>
                  <Text style={[styles.title,{alignItems:'center',marginLeft:50}]}>Name</Text>
                  {/* <Text style={styles.status}>Status</Text> */}
                  <Text style={styles.contact}>Contact</Text>
                  {/* <TouchableOpacity style={{ flex: 1 }}    >
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                    </View>
                  </TouchableOpacity> */}
                </View>
        </View>
        <View
        style={{ height: 1,marginTop:2,marginBottom:2, width: '100%', backgroundColor: 'darkgrey' }}>
      </View>
          <FlatList
            style={{ flex: 4 }}
            data={this.state.dataSource}
            renderItem={({ item }) =>
              <View style={{ flex: 5, flexDirection: 'row', padding: 2 ,marginLeft:'2%'}}>
                <View style={{ flex: 1,}}>
                  <Text style={styles.text}>{item.UnitName}</Text>
                </View>
                <View style={{ flex: 5,marginLeft:'15%'}}>
                  <Text style={styles.title}>{item.OwnerFirstName} {item.OwnerLastName}</Text>
                </View>
                {/* <View style={{ flex: 5}}>
                  <Text style={styles.title}>{item.unOcStat}</Text>
                </View> */}
                <View style={{ flex: 1,}}>
                  <TouchableOpacity style={{ flex: 1 }}
                      onPress={() => Communications.phonecall(item.OwnerMobile, true)}>
                      <View style={{ flex: 1, flexDirection: 'row', }}>
                        <Image
                          source={require('../pages/assets/images/call_answer_green.png')}
                          style={{ height: 20, width: 20, alignItems: 'flex-end' }} />
                      </View>
                  </TouchableOpacity>
                </View>
              </View>
            }
            keyExtractor={({ uoid }, index) => uoid}
          />
          {/* <View style={{ flex: 1, justifyContent: 'center', }}>
            <ActionButton style={{ flex: 1, backgroundColor: '#fff' ,}} buttonColor="rgba(231,76,60,1)"
              onPress={() => navigate('CreateWorkerScreen', { cat: ' ' })}  >

            </ActionButton>
          </View> */}
          {/* <ActionButton style={{ flex: 1, }} buttonColor="rgba(250,153,23,1)"
            onPress={() => navigate('CreateUnitsScreen', { id: global.SelectedAssociationID })}  >

          </ActionButton> */}
        </View>}
        </View>

      // <View style = {{flex:1,flexDirection:'row', alignContent:'center',marginLeft:100,marginRight:40,marginBottom:100}}>
      //                 <TouchableOpacity 
      //                  style = {{backgroundColor:'white',paddingTop:8,
      //                  paddingRight:12,paddingLeft:12,paddingBottom:5,marginTop:5,
      //                  marginLeft:10,
      //                  marginRight:10,}}              >
      //                 <Text style = {{color:'orange',fontSize:14}}>Resend OTP </Text>
      //                 </TouchableOpacity>
      // <TimerCountdown style={styles.bottom}
      //             initialSecondsRemaining={1000*30}
      //             onTick={secondsRemaining => console.log('tick', secondsRemaining)}
      //             onTimeElapsed={() => console.log('complete')}
      //             allowFontScaling={true}
      //         />

      // </View >
      // <View style={{flex:0.90,flexDirection:'column',width:'50%',}} >
      // <Button title="ok"
      //                  color='orange' width='100%' flexDirection='row' marginLeft='10'                        />
      // </View>

      //         {/* < Text style={mystyles.otp_p_text}>
      //      Enter the OTP sent to
      //      </Text>
      //      <Text style={mystyles.editmobno}>
      //     7353079645
      //      </Text>
      //  <Button style={mystyles.editbut} title="ee">
      //  </Button>
      //  <View style = {{flex:1,flexDirection:'row'}}>
      //  <TextInput style={styles.input} >
      //  </TextInput>
      //  </View> */}
      //        </View>

    );
  }
}

const styles = StyleSheet.create({
  
  text: { fontSize: 14, color: 'black', flex: 1,},
  title: { fontSize: 14,  color: 'black', flex: 2, },
  status: { fontSize: 14,  color: 'black', flex: 2, },
  contact: { fontSize: 14,  color: 'black', flex: 1, },
  
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
    fontSize: 14,
  },
  input: {
    margin: 5,
    height: 40,
    borderBottomWidth: 1
  },
  
});
