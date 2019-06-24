import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View,
  TextInput, Button, Dimensions, FlatList, Image, ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';


export default class CreateCheckPoint extends Component {

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state;

    this.state = {
      currentposition: '',
      lat: '',
      long: '',
      CheckPoint_name: ''
    }
    if(params.len == 0 ){
      this.setState({ CheckPoint_name: 'Attendance Point' })
     } 
     console.log('CreateCheckPoint constructor af', this.state.CheckPoint_name +' '+params.len);

  }

  static navigationOptions = {

    title: 'Create Check Points',
    headerStyle: {
      backgroundColor: '#696969',
    },
    headerTitleStyle: {
      color: '#fff',
    }

  };

  /** 
   * { "AssociationID": 30,
   * "OYEMemberID": 1137 , 
   * "CheckPointName": "Haro Om", 
   * "GPSPoint": "12.8467595,77.6480607", 
   * "CreatedDate": "2018-10-11 03:14:37" }
  */

  CheckpointName = (checkpointname) => {
    this.setState({ CheckPoint_name: checkpointname });
    console.log('CreateCheckPoint bf', this.state.CheckPoint_name);

  }

 
  submit = () => {
    console.log('CreateCheckPoint globalid', global.SelectedAssociationID);
    const { params } = this.props.navigation.state;

    // const { params } = this.props.navigation.state;
    console.log('CreateCheckPoint bf', this.state.CheckPoint_name+' '+params.len);

    if(params.len == 0 ){
      this.setState({ CheckPoint_name: 'Attendance Point' })
      mCheckPointName = 'Attendance Point' ;

     } else{
      mCheckPointName = this.state.CheckPoint_name;

     }

    console.log('CreateCheckPoint af', mCheckPointName);
    mlat = this.state.lat;
    mlong = this.state.long;
    console.log('CreateCheckPoint maplatlong', this.state.lat + "," + this.state.long+ "," + this.state.CheckPoint_name);
    
    if (mCheckPointName.length <= 3) {
      alert("Invalid Check Point Name");

    } else if(mlat== '' || mlong =='') {
      alert('Invalid GPS Point');
    } 
    else {

      responseObj = {
        "CPCkPName": mCheckPointName,
        "CPGPSPnt": mlat + ',' + mlong,
        "MEMemID": global.MyOYEMemberID,
        "ASAssnID": global.SelectedAssociationID
      }
      // // console.log('response',responseObj);
      //   anu={"AssociationID":30,
      //   "OYEMemberID":1137,
      //   "CheckPointName":this.state.CheckPoint_name,
      //  "GPSPoint":this.state.lat+','+this.state.long,
      //   "CreatedDate":'2018-10-11 03:14:37'
      // }

      console.log('anu', responseObj)

      fetch('http://' + global.oyeURL + '/oye247/OyeLivingApi/v1/CheckPoint/Create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
        },

        body: JSON.stringify(responseObj)
      })

        .then((response) => response.json())
        .then((responseJson) => {

          // console.log('Check ', responseJson);
          if (responseJson.success) {
            alert('Check Point created successfully')
            this.props.navigation.navigate('CheckPointListScreen');
          } else if(responseJson.error == 'Already GPS Point Exists'){
            alert('Already GPS Point Exists')
          }
          
          
          else {
            console.log('****************************Check Pointttttttttttttttttttt**************', responseJson.error);
            alert('Check for GPS point or Check Point already exist !', responseJson)
          } 

          

        })
        .catch((error) => {
          console.error(error);
          alert('Check Point already exist !')
        });

    }

  }

  mobilevalidate = () => {

    navigator.geolocation.getCurrentPosition((position) => {

      lat = position.coords.latitude;
      long = position.coords.longitude;

      const currentposition = JSON.stringify(position);
      console.log('suvarna', currentposition);
      this.setState({ currentposition, lat, long });
      this.state.lat = lat;
      this.state.long = long
      console.log('set gps', this.state.lat + "," + this.state.long);
      this.setState({ lat: position.coords.latitude })
      console.log('reset gps', this.state.lat + "," + this.state.long);

    });

  }

  render() {

    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    maplat = params.cat;
    mapLong = params.cat1;
    console.log('render gps', maplat + " " + mapLong);

    //this.state.lat = maplat
    // this.state.long = mapLong
    // this.state.lat=params.cat;
    // this.state.long=params.cat1;
    
    let CheckPoint_List = [{

            value: 'Patrolling Start Point',
      
            }, {
      
            value: 'Patrolling Point-1',
      
            },
      
            {
      
            value: 'Patrolling Point-2',
      
            },
      
            {
      
            value: 'Patrolling Point-3',
      
            },
      
            {
      
            value: 'Patrolling Point-4',
      
            },
            {
      
              value: 'Patrolling Point-5',
      
              },
              {
      
                value: 'Patrolling Point-6',
      
                },
                {
      
                  value: 'Patrolling Point-7',
      
                  }, {
      
                    value: 'Patrolling Point-8',
      
                    }, {
      
                      value: 'Patrolling Point-9',
      
                      }, {
      
                        value: 'Patrolling Point-10',
      
                        }, {
      
                          value: 'Patrolling Point-11',
      
                          }, {
      
                            value: 'Patrolling Point-12',
      
                            }, {
      
                              value: 'Patrolling Point-13',
      
                              }, {
      
                                value: 'Patrolling Point-14',
      
                                },
                                {
      
                                  value: 'Patrolling Point-15',
      
                                  },
                                  {
      
                                    value: 'Patrolling Point-16',
      
                                    },
                                    {
      
                                      value: 'Patrolling Point-17',
      
                                      },
                                {
      
                                  value: 'Patrolling Point-18',
      
                                  },
                                  {
      
                                    value: 'Patrolling Point-19',
      
                                    },
                                    {
      
                                      value: 'Patrolling Point-20',
      
                                      },
                                  {
      
                                    value: 'Patrolling End Point',
      
                                    }
      
            ];
    return (

      <View style={{
        flexDirection: 'column',
        backgroundColor: 'white',
      }}>
      <View style={{flexDirection:'row',}}>
                    <View style={{flex:1, marginTop:43,marginRight:0, justifyContent:'center',marginLeft:'2%'}}>
                        <TouchableOpacity onPress={() => navigate(('CheckPointListScreen'), { cat: '' })}
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

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>Create Check Point</Text>
        <View style={{ flexDirection: 'row', marginBottom: 10, marginTop: 10, }}>
          <Text style={{
            flexDirection: 'row', marginTop: 10, padding: 5, marginLeft: 20,
            marginRight: 15,
          }}>Check Points are used for Guard Attendance and during Patrolling </Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 10, marginTop: 10, }}>
        </View>
        <View style={{ marginBottom: 10, marginLeft: 15,marginRight:15}}>



<Dropdown

label='Select Check Point Name'

data={CheckPoint_List}

fontSize={14}

onChangeText={this.CheckpointName}

/>


</View>
        <View style={{ flexDirection: 'row', marginBottom: 10, marginTop: 10, height: 80 }}>
          <View style={{
            flexDirection: 'column',
            backgroundColor: 'white',
          }}>
            <Text style={{ marginLeft: 10, marginRight: 10, }}>  {this.state.lat} </Text>
            <Text style={{ marginLeft: 10, marginRight: 10, }}>  {this.state.long} </Text >
          </View>
        </View>

        <View style={{ flexDirection: 'row' }}>

          <TouchableOpacity
            style={{
              flex: 1, backgroundColor: 'white', borderColor: 'orange',
              borderRadius: 2, borderWidth: 1, height: 40, padding: 10, marginBottom: 20, marginLeft: 20,
              marginRight: 15, alignItems: 'center',
            }}
            onPress={this.mobilevalidate.bind(this)}>
            <Text style={styles.submitButtonText}>Get GPS</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{
              flex: 1, backgroundColor: 'white', borderColor: 'orange',
              borderRadius: 2, borderWidth: 1, height: 40, padding: 10, alignItems: 'center', marginLeft: 20,
              marginRight: 15, marginBottom: 380, marginTop: 5
            }}
            onPress={this.submit.bind(this)}
          >
            <Text style={styles.submitButtonText}> Create Check Point </Text>
          </TouchableOpacity>
        </View>
      </View>

    )

  }

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },

  input: {
    marginLeft: 20,
    marginRight: 15,
    marginBottom: 5,
    height: 40,
    flex: 3,
    borderColor: '#F2F2F2',
    backgroundColor: '#F2F2F2',
    borderWidth: 1.5,
    borderRadius: 2,
  },

  submitButtonText: {
    color: '#FA9917'
  }

})
