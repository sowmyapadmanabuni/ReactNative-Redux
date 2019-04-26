import React, { Component } from 'react';
import { BackHandler, AppRegistry, Platform, StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import ActionButton from 'react-native-action-button';
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
      isLoading: true
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
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.rectangle}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
        <View>
        <Image 
                source={require('../pages/assets/images/icons8-manager-50.png')}  
                style={{flex:1, marginRight:40}} 
                 />
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.title}>{item.unUniName}</Text>
           
           {/* <Text style={styles.text}>Unit Type: {item.unUniType}</Text> */}
            </View>
            <TouchableOpacity
              style={styles.mybutton1}
              onPress={() => navigate('RegisterUser', { 
                unitID:item.unUnitID,
                associtionID:item.asAssnID,
                blockID:item.blBlockID,
                unitName: item.unUniName,
                associationName: params.associationName,
              })}>
              <Text style={styles.lighttext}> Register Me </Text>
            </TouchableOpacity>
          </View>
    
          <View style={{ backgroundColor: 'lightgrey', flexDirection: "column", width: 1, height:'80%' }}></View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={{ textAlign: 'center', fontSize: 13, color: 'green', flex: 1 }}> {item.unOwnStat}</Text>
            <View style={{ flex: 7 }} />
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
          this.props.navigation.navigate('ResDashBoard');
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
          dataSource: responseJson.data.unit,
          isLoading: false
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

  render() {

    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    console.log('unitlist start ', params.associationName);
    return(
      <View style={{ backgroundColor: '#ffffff',height: '100%'  }}>
        <View style={{ backgroundColor: '#ffffff' }}>
          <View
            style={{
              paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
              borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:40,
            }}>
            <TouchableOpacity onPress={() => this.handleBackButtonClick()}
              style={{ flex: 1 }}>
              <Image source={require('../pages/assets/images/back.png')}
                style={{ height: 25, width: 25, marginTop:'12%', justifyContent:'center',alignItems:'center' }} />
            </TouchableOpacity>
            {/* <Text style={{ flex: 1, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text> */}
            {/* <Text style={{ flex: 4, fontSize: 16, color: 'black', alignSelf: 'center' }}>Units List</Text> */}
            <View style={{ flex: 1, alignContent: 'center' }}>
              <Image source={require('../pages/assets/images/OyeSpace_hor.png')}
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
          <View style={{ backgroundColor: '#ffffff' ,height:'90%'}}>
          <Text style={{fontSize: 16, color: 'black',fontWeight:'bold', marginLeft:10 }}>Units List</Text>
            <FlatList
              //data={this.state.dataSource}
              style={{ marginBottom: 40,backgroundColor: '#ffffff' }}
              data={this.state.dataSource}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => item.unUnitID}
              ItemSeparatorComponent={this.renderSeparator} />
          </View>}
          {/* <ActionButton buttonColor="rgba(250,153,23,1)" onPress={() => navigate('CreateUnitsScreen', { id: params.id })}  >
          </ActionButton> */}
      </View>
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
              <Image source={require('../pages/assets/images/OyeSpace_hor.png')}
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
         {/*  <ActionButton style={{ flex: 1, }} buttonColor="#fa9917" onPress={() => navigate('CreateUnitsScreen', { id: params.id })}  >
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
  title: { fontSize: 18, fontFamily: Fonts.Tahoma, color : 'black', marginBottom:8,fontWeight:'bold',marginTop:10},
  mybutton1: {
    backgroundColor: 'orange', paddingRight: 5, paddingLeft: 5,
    paddingBottom: 1, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
  },
  lighttext: { fontSize: 15,  color: 'white',alignItems:'center',marginTop:10 },
});

AppRegistry.registerComponent('unitlist', () => unitlist);