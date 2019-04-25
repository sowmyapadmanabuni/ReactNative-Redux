import React, { Component } from 'react'
import {
    View, Text, Alert, ScrollView, TouchableOpacity,TouchableHighlight, TextInput, Picker, Image,
    FlatList, ActivityIndicator, StyleSheet, NetInfo
} from 'react-native'
import { TextField } from 'react-native-material-textfield';
import { Dropdown } from 'react-native-material-dropdown';
import { Fonts } from '../pages/src/utils/Fonts';
import { openDatabase } from 'react-native-sqlite-storage';
// import Snackbar from 'react-native-snackbar';
var db = openDatabase({ name: global.DB_NAME});

class AddVehicles extends Component {

    static navigationOptions = {

        title: 'Add Vehicles',
        headerStyle: {
            backgroundColor: '#FA9917',
        },

        headerTitleStyle: {
            color: 'white',
        }
    };

    state = {
        vehiclenumber: '',
        vehiclespacenumber: '',
        vehiclestickernumber: '',
        vehicleModelnumber: '',
        connection_Status: "",
        PickerValueHolder: '',
        dataSource: [],
        ParkingID:'',
        isLoading: true
    }

    handleVehicleNo = (text) => {
        let newText = '';
        let numbers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxzyz0123456789 ';

        for (var i = 0; i < text.length; i++) {
            if (numbers.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            }
            else {
                // your call back function
        
                alert("Please Remove Special Characters");
            }
        }
        this.setState({ vehiclenumber: newText });
    }
    handleVeModel = (text) => {
        let newText = '';
        let numbers = ' ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxzyz0123456789 ';

        for (var i = 0; i < text.length; i++) {
            if (numbers.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            }
            else {
                // your call back function
                alert("Please Remove Special Characters");
            }
        }
        this.setState({ vehicleModelnumber: newText })
    }
    handleVeStickernumber = (text) => {
        let newText = '';
        let numbers = ' ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxzyz0123456789 ';

        for (var i = 0; i < text.length; i++) {
            if (numbers.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            }
            else {
                // your call back function
                alert("Please Remove Special Characters");
            }
        }
        this.setState({ vehiclestickernumber: newText })
    }
    handleVespacenumber = (text) => {
        let newText = '';
        let numbers = ' ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxzyz0123456789 ';

        for (var i = 0; i < text.length; i++) {
            if (numbers.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            }
            else {
                // your call back function
                alert("Please Remove Special characters");
            }
        }
        this.setState({ vehiclespacenumber: newText })
    }
    // handlePassword = (text) => {
    // this.setState({ password: text })
    // }
    handleVehicleType = (Vehicle_Type) => {
        this.setState({ PickerValueHolder: Vehicle_Type })
      }
    renderItem = ({ item }) => {
        const { navigate } = this.props.navigation;

        return (
            <View style={{flex:1,backgroundColor:'white'}}>
            <View style={styles.rectangle1}>

                <View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
                    <Text style={styles.title}>Vehicle Type: {item.veType}</Text>
                    <View style={{ marginLeft: '40%' }}>
                        <TouchableOpacity
                            onPress={() =>
                                Alert.alert(
                                    'Alert!',
                                    'Do you want to delete this vehicle',
                                    [
                                        { text: 'No', onPress: () => console.log('OK Pressed'), style: 'cancel' },
                                        { text: 'Yes', onPress: () => this.deleteVehicle(item.veid) },
                                    ],
                                    { cancelable: false }
                                )

                                // ()=>this.deleteVehicle(item.veid)
                            }>

                            <Image
                                style={styles.imagestyle}
                                source={require('../pages/assets/images/delete.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'column', marginLeft: 5 }}>
                    <Text style={styles.title}>Vehicle Number: {item.veRegNo}</Text>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={styles.title}>Parking Slot Number: {item.uplNum}</Text>
                    </View>
                    <Text style={{ fontSize: 12, color: 'black', marginBottom: 4, }}>Vehicle Name: {item.veMakeMdl}</Text>
                </View>
            </View>
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
        db.transaction(tx => {
            tx.executeSql('SELECT UPID FROM UnitParkingID where AssociationID=' + global.SelectedAssociationID+ ' ORDER BY UPID ASC LIMIT 1', [], (tx, results) => {
              console.log('UPID', results.rowsAffected);
              var temp=[];
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
                console.log('Unit PlatformID', results.rows.item(i).UPID);
                this.setState({
                    ParkingID:results.rows.item(i).UPID
                });
              }
              console.log('ParkingID',ParkingID);
            });
          });
        this.makeRemoteRequest();
        NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectivityChange);

        NetInfo.isConnected.fetch().done((isConnected) => {

            if (isConnected == true) {
                this.setState({ connection_Status: "Online" })
            } else {
                this.setState({ connection_Status: "Offline" })
                Alert.alert('No Internet', 'Please Connect to the Internet. ',
                    [
                        { text: 'Ok', onPress: () => { this.props.navigation.navigate('ResDashBoard') } },
                    ],
                    { cancelable: false }
                );
            }

        });
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectivityChange);
    }

    _handleConnectivityChange = (isConnected) => {

        if (isConnected == true) {
            this.setState({ connection_Status: "Online" })
        } else {
            this.setState({ connection_Status: "Offline" })
            alert('You are offline...');
        }
    };

    makeRemoteRequest = () => {

        const { } = this.props.navigation.state;
        console.log('ff')
        console.log('componentdidmount')
        const url = global.champBaseURL+'Vehicle/GetVehicleListByMemID/' + global.MyOYEMemberID

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
                this.setState({
                    dataSource: responseJson.data.vehicleListByMemID.filter(x => x.veIsActive == true),
                    isLoading: false
                })
                console.log('manu', dataSource);
            })

            .catch((error) => {
                console.log(error)
            })

    }

    deleteVehicle = (oyeVehicleID) => {

        // alert('you pressed key'+oyeVehicleID+'associationID'+associationID+oyeMemberID+oyeunitid+vehicleno+vehicleType)

        anu = {
            "VEIsActive": "False",
            "VEID": oyeVehicleID
        }
        console.log('anu', anu)
        fetch(global.champBaseURL+'Vehicle/VehicleStatusUpdate',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
                },
                body: JSON.stringify(anu)
            })

            .then((response) => response.json())

            .then((responseJson) => {

                if (responseJson.success) {
                    console.log('logresponse', responseJson);
                    alert('Vehicle deleted successfully!');
                    this.makeRemoteRequest();
                }
                else {
                    console.log('hiii', 'failed');
                    alert('failed to send !');
                }

            })

            .catch((error) => {
                console.error(error);
                alert('Vehicle is not deleted')
            });

    }

    login = () => {
        // alert('email: ' + etvehicle +'spinner: '+spinner)
        etvehicletype = this.state.PickerValueHolder;
        etvehiclenumber = this.state.vehiclenumber;
        etparkingspace = this.state.vehiclespacenumber;
        etvehiclemodel = this.state.vehicleModelnumber;
        etvehiclestickerno = this.state.vehiclestickernumber;
        etparkingid=this.state.ParkingID;

        if (etvehicletype == '') {
            alert('Choose Type of Vehicle' );

        }
        else if (etvehiclenumber.length == 0) {
            alert('Enter Vehicle Number');
        }
        else if (etparkingspace.length == 0) {
            alert('Enter Parking Space Number');
        }
        else {
            // "VERegNo" : "46723688",
            // "VEType"  : "car",
            // "VEMakeMdl": "adf",
            // "VEStickNo" : "adfdaf",
            // "UNUnitID" : 1,
            // "MEMemID" : 4,
            // "UPID" : 1,
            // "UPLNum" : "11",
            // "ASAssnID": 25
            // { "associationID": 30,
            // "oyeUnitID": 548,
            // "oyeMemberID": 288,
            // "vehicleno": "",
            // "vehicleType": "Two Wheeler" }

            anu = {
                "VERegNo": etvehiclenumber,
                "VEType": etvehicletype,
                "VEMakeMdl": etvehiclemodel,
                "VEStickNo": etvehiclestickerno,
                "UNUnitID": global.SelectedUnitID,
                "MEMemID": global.MyOYEMemberID,
                "UPID": etparkingid,
                "UPLNum": etparkingspace,
                "ASAssnID": global.SelectedAssociationID
            }

            console.log('anu', anu)

            fetch(global.champBaseURL+'Vehicle/Create',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
                    },
                    body: JSON.stringify(anu)
                })

                .then((response) => response.json())

                .then((responseJson) => {

                    if (responseJson.success) {
                        console.log('logresponse', responseJson);

                        alert('Vehicle Added Successfully!')
                        this.textInput1.clear();
                        this.textInput2.clear();
                        this.textInput3.clear();
                        this.textInput4.clear();
                        this.makeRemoteRequest();
                    } else {
                        console.log('hiii', 'failed');
                        alert('Failed to Add Vehicle!')
                    }
                })

                .catch((error) => {
                    console.error(error);
                    alert('Failed to Add Vehicle!')
                });
        }
    }

    render() {
        const { navigate } = this.props.navigation;

        let Vehicle_Type = [{
            value: 'Two Wheeler',
          }, {
            value: 'Four Wheeler',
          }
        ];
        return (
            <View style={styles.container}>
             
            <View style={styles.rectangle}>
            <View>
            <View
style={{
paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:45,
}}>
<TouchableOpacity onPress={() => navigate(('EditProfileScreen'), { cat: '' })}
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
<Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',justifyContent:'center',alignContent:'center',margin:10 }}>Add Vehicles</Text>
</View>
           <ScrollView>
            
                <View style={styles.row}>
                              
                        <Text style={{ fontSize: 12, color: 'black', marginLeft: 15,marginTop:'10%' }}>Type of Vehicle: </Text>
                    <View style={styles.inputWrap}>
                    <Dropdown
        label='Select Vehicle Type'
        data={Vehicle_Type}
        fontSize={12}
        onChangeText={this.handleVehicleType} 
      />
                   
                    </View>
                </View>
                  <View style={styles.row}>
                              <View style={styles.inputWrap}>
                              <TextField
              label='Vehicle Number'
              autoCapitalize='characters'
              labelHeight={15}
              characterRestriction={15}
              ref={input => { this.textInput1 = input }}
              maxLength={15}
              activeLineWidth={0.5}
              fontSize={12}
              onChangeText=
              {this.handleVehicleNo}
            />
              </View>
              <View style={styles.inputWrap}>
              <TextField
              label='Parking Slot Number'
              autoCapitalize='characters'
              labelHeight={15}
              characterRestriction={10}
              ref={input => { this.textInput2 = input }}
              maxLength={10}
              activeLineWidth={0.5}
              fontSize={12}
              onChangeText={ this.handleVespacenumber }
            />
              </View>
              
          
            </View>
            <View style={styles.row}>
                              <View style={styles.inputWrap}>
                              <TextField
              label='Vehicle Name(opt)'
              autoCapitalize='sentences'
              labelHeight={15}
              ref={input => { this.textInput3 = input }}
              maxLength={20}
              characterRestriction={20}
              activeLineWidth={0.5}
              fontSize={12}
              onChangeText={ this.handleVeModel}
            />
              </View>
              <View style={styles.inputWrap}>
              <TextField
              label='Vehicle Sticker Number(opt)'
              autoCapitalize='sentences'
              ref={input => { this.textInput4 = input }}
              maxLength={15}
              characterRestriction={15}
              labelHeight={15}
              activeLineWidth={0.5}
              fontSize={12}
              onChangeText={ this.handleVeStickernumber }
            />
              </View>
              
          
            </View>
                  
                  <View style={{ flexDirection: 'column', }}>
                    <TouchableHighlight
                     onPress={this.login.bind(this)}
                     underlayColor='#fff'>
                      <Text style={{ fontSize: 15, color: 'black',alignSelf:'center' }}> Add Vehicle </Text>
                    </TouchableHighlight>
                
                 
                
                <Text style={styles.subtext1}>VEHICLE LIST</Text>
                    <FlatList data={this.state.dataSource}
                        renderItem={this.renderItem}
                        ItemSeparatorComponent={this.renderSeparator}
                        ListHeaderComponent={() => (!this.state.dataSource.length ?
                            <Text style={{alignSelf:'center',color:'black'}}>The vehicle list is empty</Text>
                            : null)
                          }
                    />
             
            </View>
            </ScrollView>
            </View>
                </View>
          )
    }
}

export default AddVehicles

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center'
       
     },
     rectangle: { flex: 1, backgroundColor: 'white', borderColor: 'white', borderRadius: 2, borderWidth: 1, },
    input: { marginLeft: 5, height: 30, width: '40%', borderColor: 'orange', borderWidth: 1 },
    input1: {  marginLeft: 5, height: 30, width: '55%', borderColor: 'orange', borderWidth: 1 },
    imagestyle: { width: 20, height: 20 },
    rectangle1: {
        flex: 1, backgroundColor: 'white', padding: 5, borderColor: 'orange',
        marginLeft: 5, marginRight: 5, borderRadius: 2, borderWidth: 1,
    },

    title: { fontSize: 12, color: 'black', marginBottom: 4, },

    subtext: {
        fontSize: 12, color: 'black',
        marginBottom: 2,
    },
    row: {
        flex: 1,
        flexDirection: "row",
      },
      inputWrap: {
        flex: 1,
        marginLeft:15,
        paddingRight:5
      },

        loginScreenButton:{
            alignSelf:'center',
             paddingTop:2,
             paddingBottom:2,
             backgroundColor:'white',
             borderRadius:5,
             borderWidth: 1,
             borderColor: 'orange'
           },
    

    subtext1: {
        fontSize: 12, color: 'black',
        marginBottom: '2%',marginLeft:'5%'
    },

    submitButton: {
        backgroundColor: 'white', paddingTop: 10, marginLeft: 8, height: 40,
        paddingRight: 2, paddingLeft: 2, borderColor: 'orange',
        borderRadius: 0, borderWidth: 2, textAlign: 'center',
    },

    submitButtonText: { color: 'white' }

})
