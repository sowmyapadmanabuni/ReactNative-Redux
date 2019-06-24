import React, { Component } from 'react';
import {
  Platform, StyleSheet, Button, Text, View, TextInput,
  FlatList, ActivityIndicator, TouchableOpacity, Image, Alert,
  ScrollView
} from 'react-native';
import ActionButton from 'react-native-action-button';
//import { Fonts } from '../pages/src/utils/Fonts';

export default class CheckPointList extends Component {

  constructor() {
    super()
    this.state = {
      dataSource: [],
      isLoading: true
    }
    console.log('CheckPointList', 'constructor');
  }

  renderItem = ({ item }) => {

    return (
      <TouchableOpacity style={{ flex: 1, flexDirection: 'row', marginBottom: 3 }}
        /* onPress={() => ToastAndroid.show(item.book_title,ToastAndroid.SHORT)}*/
        onPress={() => alert(item.subject)}>
        console.log('anu234',item.subject+', '+item.agenda);

       <View style={{ flex: 1, justifyContent: 'center', marginLeft: 5 }}>
          <Text style={{ fontSize: 18, color: 'green', marginBottom: 15 }}>
            {item.subject}
          </Text>
          <Text style={{ fontSize: 16, color: 'red' }}>
            {item.agenda}
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
    const url = 'http://' + global.oyeURL + '/oye247/OyeLivingApi/v1/CheckPoint/GetCheckPointByAssocID/' + global.SelectedAssociationID
    console.log('CheckPointList componentdidmount', '' + url)

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log('CheckPointList responseJson', responseJson);

        this.setState({
          dataSource: responseJson.data.checkPointListByAssocID,
          isLoading: false
        })


        db.transaction(tx => {
          tx.executeSql('delete  FROM CheckPointList where AssnID=' + global.SelectedAssociationID, [], (tx, results) => {
          });
        });
        for (let i = 0; i < responseJson.data.checkPoint.length; ++i) {
          this.insert_Guards(
            responseJson.data.checkPoint[i].cpChkPntID, responseJson.data.checkPoint[i].cpCkPName,
            responseJson.data.checkPoint[i].cpgpsPnt, responseJson.data.checkPoint[i].asAssnID);
        }


      })
      .catch((error) => {
        console.log('CheckPointList err ' + error)
      })

  }
insert_Guards(cpChkPntID, cpCkPName, cpgpsPnt, asAssnID) {
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO Workers (CheckPointId, CheckPointName, GPSPoint, AssnID '+
        ' ) VALUES (?,?,?,?)',
        [cpChkPntID, cpCkPName, cpgpsPnt, asAssnID],
        (tx, results) => {
//          console.log('inserting workers', results.rowsAffected + ' ' + work_id + ' ' + wk_mobile);
        }
      );
    });
  }
  componentDidUpdate() {

    const url = 'http://' + global.oyeURL + '/oye247/OyeLivingApi/v1/CheckPoint/GetCheckPointByAssocID/' + global.SelectedAssociationID
    // console.log('CheckPointList componentDidUpdate', '' + url)
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log('CheckPointList componentDidUpdate', responseJson);

        this.setState({
          dataSource: responseJson.data.checkPointListByAssocID,
          isLoading: false
        })
        // console.log('CheckPointList count '+this.state.dataSource.length)
      })
      .catch((error) => {
        console.log('CheckPointList err ' + error)
      })

  }

  //   shouldComponentUpdate(nextProps, nextState) {
  //     const isItemChanged = this.props.item != nextProps.item
  //     const isPortraitMode = this.props.isPortraitMode != nextProps.isPortraitMode
  //     return isItemChanged || isPortraitMode
  // }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ backgroundColor: '#FFF', height: '100%' }}>

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

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>Check Points</Text>
          {/* <View
            style={{
              paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
              borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
              marginTop:20,
            }}>
            <TouchableOpacity onPress={() => navigate(('ResDashBoard'), { cat: '' })}
              style={{ flex: 1, alignSelf:'center' }}>
              <Image source={require('../pages/assets/images/back.png')}
                style={{ height: 25, width: 25, marginLeft: 10, alignSelf: 'center' }} />
            </TouchableOpacity>
            <Text style={{ flex: 2, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>
            <Text style={{ flex: 6, fontSize: 16, color: 'black', alignSelf: 'center' }}>Check Points</Text>
            <View style={{ flex: 3, alignSelf: 'center' }}>
              <Image source={require('../pages/assets/images/OyeSpace_hor.png')}
                style={{
                  height: 35, width: 105, margin: 5,
                  alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
                }} />
            </View>
          </View>
          <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
        </View> */}
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
          <ScrollView>
            <FlatList
              extraData={this.state.refresh}
              data={this.state.dataSource}
              renderItem={({ item }) =>
                <View style={styles.rectangle}>

                  <View style={{ flex: 1, flexDirection: 'row', padding: 2 }}>

                    <View style={{ flex: 1, flexDirection: 'column' }}>
                      <View style={{ flex: 8, flexDirection: 'row', padding: 2 }}>
                        <View style={{ flex: 6, flexDirection: 'row', padding: 2 }}>
                          <Text style={styles.title}>{item.cpCkPName}</Text></View>
                        <TouchableOpacity style={{
                          flex: 1, backgroundColor: 'white', borderColor: 'orange',
                          borderRadius: 2, height: 40, padding: 10, width: 30
                        }}
                          onPress={() => navigate('CheckPointListMapScreen', { gps: item.cpgpsPnt })}>

                          <Image source={require('../pages/assets/images/placeholder.png')} style={{ height: 30, width: 30, justifyContent: "flex-start" }}
                          />
                        </TouchableOpacity>

                        {/* <TouchableOpacity style={{marginRight:5,flex:1}}>
      <Image source={require('../pages/assets/images/edit.png')}style={{height: 30, width: 30, alignItems: "flex-end", }} 
onPress={() => navigate('EditCheckPointScreenswitch', {name:item.checkPointName,gps:item.gpsPoint})}/>
    </TouchableOpacity> */}

                        <TouchableOpacity
                          style={{ flex: 1, backgroundColor: 'white', padding: 10, }}
                          onPress={() => navigate('EditCheckPointScreen', { CkPName: item.cpCkPName, ChkPntID: item.cpChkPntID, cpgpsPnt: item.cpgpsPnt })}>
                          <Image source={require('../pages/assets/images/edit.png')} style={{ height: 30, width: 30, alignItems: "flex-end", }} />

                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ flex: 1, backgroundColor: 'white', padding: 10, }}
                          onPress={() => navigate('QRCodeGenScreen', { name: item.cpCkPName, ChkPntID: item.cpChkPntID, cpgpsPnt: item.cpgpsPnt })}>
                          <Image source={require('../pages/assets/images/qr_code_orange.png')} style={{ height: 30, width: 30, alignItems: "flex-end", }} />

                        </TouchableOpacity>
                      </View>
                      <Text style={styles.text}>{item.cpgpsPnt} </Text>
                      <View style={{ flex: 1, flexDirection: 'row', marginBottom: 5 }}>
                      </View>
                    </View>
                  </View>
                </View>

              }
              keyExtractor={({ cpChkPntID }, index) => cpChkPntID}

            //           data={this.state.dataSource}
            //  extraData={this.state.dataSource}
            />
          </ScrollView>
        }
          <ActionButton buttonColor="#FA9917" onPress={() => navigate('CreateCheckPointScreen', { cat: '',cpList:this.state.dataSource })}  >
          </ActionButton>
      </View>

    );

  }

  //   render() {
  //     const { navigate } = this.props.navigation;
  //     return (
  //       this.state.isLoading

  //         ?
  //         <View style={{backgroundColor:'#FFF',height: '100%'}}>
  //                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //                   <ActivityIndicator size="large" color="#330066" animating />
  //                 </View>
  //                 </View>

  //         :

  //         <View style={styles.container}>
  //         <ScrollView>
  //           <FlatList
  //             data={this.state.dataSource}
  //             renderItem={({item}) =>
  //             <View
  //             style={styles.rectangle}>
  //                         <View style={{flex: 1, flexDirection:'row',  padding: 2  }}>
  //                         <View style={{flex: 1, flexDirection:'column' }}>
  //                           <Text style={styles.title}>{item.checkPointName}</Text>
  //                           <Text style={styles.text}>{item.gpsPoint}</Text>
  //                           <Button title="gps"
  //                  color='orange' width='20%'
  //                 onPress={() => navigate('Create', {user:1})}  /*Products is navigation name*/ 
  //                  />
  //                        </View>
  //                          </View>
  //                          </View> 
  //             }
  //             keyExtractor={({checkPointID}, index) => checkPointID}
  //           />
  //           </ScrollView>
  //           <ActionButton buttonColor="rgba(231,76,60,1)"   onPress={() => navigate('CheckPoint',{cat:'Category two'})}  >
  // </ActionButton>
  //         </View>
  //     );
  //   }

}

const styles = StyleSheet.create({

  container: {  flex: 1, alignItems: 'center', backgroundColor: 'white' },

  rectangle: { flex: 1, backgroundColor: 'white', padding: 10, borderColor: 'orange',
    marginLeft: 5, marginRight: 5, marginTop: 5, borderRadius: 2, borderWidth: 1,
  },

  title: { fontSize: 18,  color: 'black', marginBottom: 8, fontWeight: 'bold' },

  text: { fontSize: 10,  color: 'black', },

});
