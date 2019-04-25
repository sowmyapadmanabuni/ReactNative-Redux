import React, { Component } from 'react';
import {
  AppRegistry, Dimensions, StyleSheet, Alert, Text, View, FlatList, ActivityIndicator,Image,
  AppState, TouchableOpacity, TextInput,
} from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
// import { Image } from 'react-native-elements';
import Communications from 'react-native-communications';
import Moment from 'moment';
import ActionButton from 'react-native-action-button';
//import { Fonts } from '../pages/src/utils/Fonts'
import { openDatabase } from 'react-native-sqlite-storage';
import PTRView from 'react-native-pull-to-refresh';

var db = openDatabase({ name: global.DB_NAME });
const screenWidth = Dimensions.get('window').width;

export default class guardlist extends Component {

  constructor() {
    super()
    this.state = {
      username:'',
      dataSource: [],
      isLoading: true,
      appState: AppState.currentState,
    }

    this.handleChange = this.handleChange.bind(this);

    console.log('guardlist', 'constructor');
  }

  //  "wkWorkID": 8, "wkfName": "Sowmya",  "wklName": "Padmanabhuni",
  //           "wkMobile": "+919490791520", "wkImgName": "Somu.jpeg",
  //           "wkWrkType": "RegularVisitor",  "wkDesgn": "Developer",
  //           "wkidCrdNo": "A00009", "vnVendorID": 1,  "blBlockID": 27,
  //           "flFloorID": 18,  "asAssnID": 25,   "wkdCreated": "2018-11-12T10:43:25",
  //           "wkdUpdated": "0001-01-01T00:00:00",  "wkIsActive": true

  renderItem = ({ item }) => {
    const { navigate } = this.props.navigation;
    return (
      //  imgName = PERSON + "Association" + prefManager.getAssociationId() + GUARD + movie.getGuardID() + ".jpg";

      <View style={styles.rectangle}>
        <View style={{ flex: 1, flexDirection: 'row' }}>

          <View style={{ width: 80, height: 100, marginRight: 10, flexDirection: 'column' }}>
            <ImageLoad
              style={{ width: 80, height: 100, marginRight: 10 }}
              loadingStyle={{ size: 'large', color: 'blue' }}
              //"PERSON"+"Association"+ASSOCIATIONID+"STAFF" +globalApiObject.data.worker.wkWorkID  + ".jpg"
              source={{ uri: global.viewImageURL+'PERSONAssociation' + item.asAssnID + 'STAFF' + item.wkWorkID + '.jpg' }} />
          </View>
          <View style={{ width: screenWidth - 160, flexDirection: 'column' }}>
            <Text style={styles.title}>{item.wkfName} {item.wklName}</Text>
            <Text style={styles.subtext}>{item.wkDesgn}</Text>
            {/* <Text style={styles.subtext}>ID Card Number: {item.wkidCrdNo}</Text>
            <Text style={styles.subtext}> {item.StartDate} {item.StartTime} </Text> */}
            {/* <Text style={styles.subtext} style={{ paddingTop: 20 }}>{item.wkWorkID}</Text> */}

            {/*  <TouchableOpacity
              onPress={() => Communications.phonecall(item.wkMobile, true)}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Image
                  source={require('../pages/assets/images/phone.png')}
                  style={{ height: 20, width: 20, alignItems: "center" }} />
                <Text style={styles.text}>{item.wkMobile}</Text>
              </View>
            </TouchableOpacity> */}
            {/* <View style={{ flex: 1, flexDirection: 'row' }}>
              <TouchableOpacity
                style={{ flex: 2, padding: 2 }}
                onPress={() => navigate('Securityattendance', { id: item.wkWorkID, fname: item.wkfName, lname: item.wklName })}>
                <Text style={{ padding: 5 }}>View Report</Text>
              </TouchableOpacity>

            </View> */}
          </View>
          <View
            style={{ height: '90%', marginTop: '2%', marginBottom: '2%', width: 1, backgroundColor: 'darkgrey' }}>
          </View>
          <View style={{ width: 40, padding: 5, flexDirection: 'column' }}>

            <TouchableOpacity style={{ margin: 5 }}
              onPress={() => Communications.phonecall(item.wkMobile, true)}>
              <Image
                source={require('../pages/assets/images/call_answer_green.png')}
                style={{ height: 20, width: 20, alignItems: "center" }} />

            </TouchableOpacity>
            {/* <TouchableOpacity
              style={{ margin: 5 }}
              onPress={() => navigate('Securityattendance', { id: item.wkWorkID, fname: item.wkfName, lname: item.wklName })}>
              <Image
                source={require('../pages/assets/images/calendar_orange.png')}
                style={{ height: 20, width: 20, alignItems: "center" }} />
            </TouchableOpacity> */}
            {/* <TouchableOpacity
              style={{ margin: 5 }}
              onPress={() => navigate('EditWorkerScreen', { id: item.wkWorkID, fname: item.wkfName, lname: item.wklName, asAssnID: item.asAssnID })}>
              <Image
                source={require('../pages/assets/images/edit.png')}
                style={{ height: 20, width: 20, alignItems: "center", justifyContent: 'center' }} />

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
  handleChange(e) {
    this.setState({
      username: e.nativeEvent.text
    });
  }
  //componentDidUpdate() {
  componentWillUpdate(nextProps, nextState) {

    if (this.state.dataSource.length == nextState.dataSource.length) {
       //alert('componentWillUpdate if');
    } else {
     //  alert('componentWillUpdate else');
    //}
    
    const url =  global.oye247BaseURL+'GetWorkerListByAssocID/' + global.SelectedAssociationID

  //  console.log(url)
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
      //  console.log('WorkersLis in ', responseJson)
        this.setState({
          dataSource: responseJson.data.worker.filter(x => x.wkDesgn == 'Security Guard'),
          // dataSource: responseJson.data.workers, 
          isLoading: false
        })

        if (responseJson.success) {
        //  console.log('ravii', responseJson);
         // console.log('responseJson count WorkersLis ', responseJson.data.worker.length);

          db.transaction(tx => {
            tx.executeSql('delete  FROM Workers where AssnID=' + global.SelectedAssociationID, [], (tx, results) => {
            //  console.log('Results Workers delete ', results.rowsAffected);
            });
          });

          for (let i = 0; i < responseJson.data.worker.length; ++i) {
            //     temp.push(results.rows.item(i));
            // "data": {  "workers": [  {
            //           "wkWorkID": 8, "wkfName": "Sowmya",  "wklName": "Padmanabhuni",
            //           "wkMobile": "+919490791520", "wkImgName": "Somu.jpeg",
            //           "wkWrkType": "RegularVisitor",  "wkDesgn": "Developer",
            //           "wkidCrdNo": "A00009", "vnVendorID": 1,  "blBlockID": 27,
            //           "flFloorID": 18,  "asAssnID": 25,   "wkdCreated": "2018-11-12T10:43:25",
            //           "wkdUpdated": "0001-01-01T00:00:00",  "wkIsActive": true
            //       },
            this.insert_Guards(responseJson.data.worker[i].wkWorkID,
              responseJson.data.worker[i].asAssnID, responseJson.data.worker[i].wkfName,
              responseJson.data.worker[i].wklName, responseJson.data.worker[i].wkMobile,
              responseJson.data.worker[i].wkImgName, responseJson.data.worker[i].wkWrkType,
              responseJson.data.worker[i].wkDesgn, responseJson.data.worker[i].wkidCrdNo,
              responseJson.data.worker[i].vnVendorID, responseJson.data.worker[i].blBlockID,
              responseJson.data.worker[i].flFloorID, responseJson.data.worker[i].wkdCreated,
              responseJson.data.worker[i].wkdUpdated, responseJson.data.worker[i].wkIsActive);

         //   console.log('Results WorkersLis', responseJson.data.worker[i].unUniName + ' ' + responseJson.data.worker[i].unUnitID);

          }

        //  console.log('App  come to  --' + this.state.appState)

        } else {
          console.log('failurre')
        }
      })
      .catch((error) => {
        this.setState({
          isLoading: false
        })

        console.log('WorkersLis err ', error)
      })
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    console.log('GetWorkersList componentdidmount ', global.SelectedAssociationID)

    const url =  global.oye247BaseURL+'GetWorkerListByAssocID/' + global.SelectedAssociationID
    //const url = 'http://' + global.oyeURL + '/oye247/api/v1/GetWorkersList'

    console.log(url)
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
      //  console.log('WorkersLis in ', responseJson)
        this.setState({
          dataSource: responseJson.data.worker.filter(x => x.asAssnID == global.SelectedAssociationID),
          // dataSource: responseJson.data.workers, 

          isLoading: false
        })

        if (responseJson.success) {
          console.log('responseJson count WorkersLis ', responseJson.data.worker.length);

          db.transaction(tx => {
            tx.executeSql('delete  FROM Workers where AssnID=' + global.SelectedAssociationID, [], (tx, results) => {
              console.log('Results Workers delete ', results.rowsAffected);
            });
          });

          for (let i = 0; i < responseJson.data.worker.length; ++i) {
            //     temp.push(results.rows.item(i));
            // "data": {  "workers": [  {
            //           "wkWorkID": 8, "wkfName": "Sowmya",  "wklName": "Padmanabhuni",
            //           "wkMobile": "+919490791520", "wkImgName": "Somu.jpeg",
            //           "wkWrkType": "RegularVisitor",  "wkDesgn": "Developer",
            //           "wkidCrdNo": "A00009", "vnVendorID": 1,  "blBlockID": 27,
            //           "flFloorID": 18,  "asAssnID": 25,   "wkdCreated": "2018-11-12T10:43:25",
            //           "wkdUpdated": "0001-01-01T00:00:00",  "wkIsActive": true
            //       },
            this.insert_Guards(responseJson.data.worker[i].wkWorkID,
              responseJson.data.worker[i].asAssnID, responseJson.data.worker[i].wkfName,
              responseJson.data.worker[i].wklName, responseJson.data.worker[i].wkMobile,
              responseJson.data.worker[i].wkImgName, responseJson.data.worker[i].wkWrkType,
              responseJson.data.worker[i].wkDesgn, responseJson.data.worker[i].wkidCrdNo,
              responseJson.data.worker[i].vnVendorID, responseJson.data.worker[i].blBlockID,
              responseJson.data.worker[i].flFloorID, responseJson.data.worker[i].wkdCreated,
              responseJson.data.worker[i].wkdUpdated, responseJson.data.worker[i].wkIsActive);

         //   console.log('Results WorkersLis', responseJson.data.worker[i].unUniName + ' ' + responseJson.data.worker[i].unUnitID);

          }
          if (responseJson.data.worker.filter(x => x.asAssnID == global.SelectedAssociationID).length == 0) {
            // Alert.alert(
            //   'No Guards / Supervisors',
            //   'Add Guards',
            //   [
            //     {
            //       text: 'Ok',
            //       onPress: () => this.props.navigation.navigate('CreateWorkerScreen'),
            //     },
            //     {
            //       text: 'Cancel',
            //       onPress: () => this.props.navigation.navigate('ResDashBoard'),
            //     },
            //   ],
            //   { cancelable: false }
            // );
          }
          console.log('App  come to  --' + this.state.appState)

        } else {
          console.log('failurre')
        }
      })
      .catch((error) => {
        this.setState({
          isLoading: false
        })
        // Alert.alert(
        //   'No Guards / Supervisors in this Association',
        //   'Add Guards',
        //   [
        //     {
        //       text: 'Ok',
        //       onPress: () => this.props.navigation.navigate('CreateWorkerScreen'),
        //     },
        //     {
        //       text: 'Cancel',
        //       onPress: () => this.props.navigation.navigate('ResDashBoard'),
        //     },
        //   ],
        //   { cancelable: false }
        // );
        console.log('WorkersLis err ', error)
      })

  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    console.log('App has come to  --' + nextAppState+' cc '+this.state.appState)

    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
    }
    this.setState({ appState: nextAppState });
  }

  insert_Guards(work_id, assn_id, first_name, last_name, wk_mobile, wk_img_name, wrk_type,
    desgn, idcrd_no, vendor_id, block_id, floor_id, created, updated, is_active) {
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO Workers (WorkID, AssnID, FName, LName, WKMobile, WKImgName, ' +
        ' WrkType , Desgn, IDCrdNo, VendorID, BlockID , FloorID ,Created, Updated ,  ' +
        ' WKIsActive ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [work_id, assn_id, first_name, last_name, wk_mobile, wk_img_name, wrk_type,
          desgn, idcrd_no, vendor_id, block_id, floor_id, created, updated, is_active],
        (tx, results) => {
//          console.log('inserting workers', results.rowsAffected + ' ' + work_id + ' ' + wk_mobile);

        }
      );
    });
  }

  
  makeRemoteRequest = () => {
    const { } = this.props.navigation.state;

    console.log('GetWorkersList componentdidmount ', global.SelectedAssociationID)

    const url =  global.oye247BaseURL+'GetWorkerListByAssocID/' + global.SelectedAssociationID
    //const url = 'http://' + global.oyeURL + '/oye247/api/v1/GetWorkersList'

    console.log(url)
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
      //  console.log('WorkersLis in ', responseJson)
        this.setState({
          dataSource: responseJson.data.worker.filter(x => x.asAssnID == global.SelectedAssociationID),
          // dataSource: responseJson.data.workers, 

          isLoading: false
        })

        if (responseJson.success) {
          console.log('responseJson count WorkersLis ', responseJson.data.worker.length);

          db.transaction(tx => {
            tx.executeSql('delete  FROM Workers where AssnID=' + global.SelectedAssociationID, [], (tx, results) => {
              console.log('Results Workers delete ', results.rowsAffected);
            });
          });

          for (let i = 0; i < responseJson.data.worker.length; ++i) {
            //     temp.push(results.rows.item(i));
            // "data": {  "workers": [  {
            //           "wkWorkID": 8, "wkfName": "Sowmya",  "wklName": "Padmanabhuni",
            //           "wkMobile": "+919490791520", "wkImgName": "Somu.jpeg",
            //           "wkWrkType": "RegularVisitor",  "wkDesgn": "Developer",
            //           "wkidCrdNo": "A00009", "vnVendorID": 1,  "blBlockID": 27,
            //           "flFloorID": 18,  "asAssnID": 25,   "wkdCreated": "2018-11-12T10:43:25",
            //           "wkdUpdated": "0001-01-01T00:00:00",  "wkIsActive": true
            //       },
            this.insert_Guards(responseJson.data.worker[i].wkWorkID,
              responseJson.data.worker[i].asAssnID, responseJson.data.worker[i].wkfName,
              responseJson.data.worker[i].wklName, responseJson.data.worker[i].wkMobile,
              responseJson.data.worker[i].wkImgName, responseJson.data.worker[i].wkWrkType,
              responseJson.data.worker[i].wkDesgn, responseJson.data.worker[i].wkidCrdNo,
              responseJson.data.worker[i].vnVendorID, responseJson.data.worker[i].blBlockID,
              responseJson.data.worker[i].flFloorID, responseJson.data.worker[i].wkdCreated,
              responseJson.data.worker[i].wkdUpdated, responseJson.data.worker[i].wkIsActive);

         //   console.log('Results WorkersLis', responseJson.data.worker[i].unUniName + ' ' + responseJson.data.worker[i].unUnitID);

          }
          if (responseJson.data.worker.filter(x => x.asAssnID == global.SelectedAssociationID).length == 0) {
            // Alert.alert(
            //   'No Guards / Supervisors',
            //   'Add Guards',
            //   [
            //     {
            //       text: 'Ok',
            //       onPress: () => this.props.navigation.navigate('CreateWorkerScreen'),
            //     },
            //     {
            //       text: 'Cancel',
            //       onPress: () => this.props.navigation.navigate('ResDashBoard'),
            //     },
            //   ],
            //   { cancelable: false }
            // );
          }
          console.log('App  come to  --' + this.state.appState)

        } else {
          console.log('failurre')
        }
      })
      .catch((error) => {
        this.setState({
          isLoading: false
        })
        // Alert.alert(
        //   'No Guards / Supervisors in this Association',
        //   'Add Guards',
        //   [
        //     {
        //       text: 'Ok',
        //       onPress: () => this.props.navigation.navigate('CreateWorkerScreen'),
        //     },
        //     {
        //       text: 'Cancel',
        //       onPress: () => this.props.navigation.navigate('ResDashBoard'),
        //     },
        //   ],
        //   { cancelable: false }
        // );
        console.log('WorkersLis err ', error)
      })

    return new Promise((resolve) => {
      setTimeout(() => { resolve() }, 2000)
    });

  }

  render() {

    const { navigate } = this.props.navigation;
    console.log('WorkersLis start ', this.state.appState)
    return (
      <View style={{ backgroundColor: '#FFF', height: '100%' }}>
      <View
style={{
paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:45
}}>
<TouchableOpacity onPress={() => navigate(('ResDashBoard'), { cat: '' })}
style={{ flex: 1 , alignSelf:'center'}}>
<Image source={require('../pages/assets/images/back.png')}
style={{ height: 25, width: 25,  }} />
</TouchableOpacity>
<Text style={{ flex: 2, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>
<View style={{ flex: 3, alignSelf: 'center' }}>
<Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
style={{
height: 38, width: 95, margin: 5,
alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
}} />
</View>
<View style={{ flex: 3,alignSelf: 'flex-end',alignItems:'flex-end',justifyContent:'flex-end' }}>
                         

                        </View>


</View>
                    <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
<Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',justifyContent:'center',alignContent:'center',marginBottom:10,marginLeft:'3%' }}>Guards List</Text>
        {/* <View
style={{
paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
}}>
<View style={{flex:1,marginRight:0, justifyContent:'center',marginLeft:'1%'}}>
<TouchableOpacity onPress={() => navigate(('ResDashBoard'), { cat: '' })}
style={{ flex: 1 , alignSelf:'center'}}>
<Image source={require('../pages/assets/images/back.png')}
style={{ height: 25, width: 25,  }} />
</TouchableOpacity>
</View>
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
<Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',justifyContent:'center',alignContent:'center',marginBottom:10 }}>Guards List</Text> */}

<View style={{ backgroundColor: '#ffffff' }}>
            <TextInput style={styles.searchInput}
              placeholder="Search by Name"
              onChange={this.handleChange}
            />
          </View>
      {this.state.isLoading
        ?
        <View style={{ flex: 1, justifyContent: 'center', }}>
          <ActivityIndicator size="large" color="#330066" animating />
        </View>
        :
        <View style={{ backgroundColor: '#fff', flex: 7, justifyContent: 'space-between' }}>
                     

          <View style={{ flex: 6, justifyContent: 'center', }}>
          <PTRView onRefresh={this.makeRemoteRequest} >
            <FlatList

              data={this.state.dataSource.filter(x => x.wkfName.toUpperCase().includes(this.state.username.toUpperCase()))}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => item.wkWorkID}
              ItemSeparatorComponent={this.renderSeparator}
            />
              </PTRView>
          </View>
        

          {/* <View style={{ flex: 1, justifyContent: 'center', }}>
           <ActionButton style={{ flex: 1, backgroundColor: '#fff', }} buttonColor="rgba(250,153,23,1)"
              onPress={() => navigate('CreateWorkerScreen', { cat: ' ' })}  >

            </ActionButton> 
          </View> */}
        </View>}
        </View>
    );
  }
}

const styles = StyleSheet.create({
  
  rectangle: {
    flex: 1, backgroundColor: 'white', padding: 10, borderColor: 'orange',
    marginLeft: 5, marginRight: 5, marginTop: 5, borderRadius: 2, borderWidth: 1,
  },
  searchInput: {
    height: 30, padding: 4, fontSize: 14, borderWidth: 1,
    borderColor: '#F2F2F2', borderRadius: 8, color: 'black', margin: 8
  },
  title: { fontSize: 15,  color: 'black', marginBottom: 5, },
  subtext: { fontSize: 15,  color: 'black', marginBottom: 2, },

});

