/**
* Sample React Native App
* https://github.com/facebook/react-native
*
* @format
* @flow
*/

import React, { Component } from 'react';
import {
    Platform, StyleSheet, Text, View,
    TextInput, Alert, Button, Dimensions, FlatList, ActivityIndicator,
    TouchableOpacity, ToastAndroid, Picker, Image
} from 'react-native';
import ImagePicker from 'react-native-image-picker'
import DateTimePicker from 'react-native-modal-datetime-picker';
import { DatePickerDialog } from 'react-native-datepicker-dialog'
import moment from 'moment';
import { openDatabase } from 'react-native-sqlite-storage';
import { TextField } from 'react-native-material-textfield';
import { Fonts } from '../pages/src/utils/Fonts';

var db = openDatabase({ name: global.DB_NAME });
var workerID=0;
export default class CreateCheckPoint extends Component {
    constructor(props) {
        super(props);

        this.state = {

        currentposition: '',
        lat: '',
        long: '',
        isDateTimePickerVisible: false,
        isDateTimePickerVisible1: false,
        datetime: moment(new Date()).format('HH:mm'), //moment(new Date()).format('HH:mm'),
        endTime: moment(new Date()).format('HH:mm'),
        CheckPoint_name: '',
        PickerValueHolder: '',
        dataSourceUnitPkr: [],
        text: '',
        imageSource: null,
        UnitPickerValueHolder: '',
        dobText: moment(new Date()).format('YYYY-MM-DD'),
        dobDate: null,
        dobDate1: null,
        endDate: moment(new Date()).format('YYYY-MM-DD'),

    }
    db.transaction(tx => {

        tx.executeSql('SELECT Distinct WorkID, AssnID, FName, LName FROM Workers where AssnID=' + global.SelectedAssociationID, [], (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
                console.log('dataSourceUnitPkr UnitID ' + i, results.rows.item(i).FName + ' ' + results.rows.item(i).WorkID);
            }
            this.setState({
                dataSourceUnitPkr: temp,
            });
        });
    });
}
    handleShiftName = (text) => {
        let newText = '';
        let numbers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxzyz ';

        for (var i = 0; i < text.length; i++) {
            if (numbers.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            }  else {
                // your call back function
                alert("Please Remove Special Characters");
            }
        }
        this.setState({ CheckPoint_name: newText });
    }
    onDOBPress = () => {
        let dobDate = this.state.dobDate;

        if (!dobDate || dobDate == null) {
            dobDate = new Date();
            this.setState({     dobDate: dobDate  });
        }
        this.refs.dobDialog.open({
            date: dobDate,
            minDate: new Date() //To restirct future date
        });

    }
    onDOBPress1 = () => {
        let dobDate1 = this.state.dobDate1;

        if (!dobDate1 || dobDate1 == null) {
            dobDate1 = new Date();
            this.setState({
                dobDate1: dobDate1
            });
        }
        this.refs.dobDialog1.open({
            date: dobDate1,
            minDate: new Date() //To restirct future date
        });

    }
    onDOBDatePicked = (date) => {
        this.setState({
            dobDate: date,
            dobText: moment(date).format('YYYY-MM-DD'),
        });
    }
    onDOBDatePicked1 = (date) => {
        this.setState({
            dobDate1: date,
            endDate: moment(date).format('YYYY-MM-DD')
        });
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });


    _showDateTimePicker1 = () => this.setState({ isDateTimePickerVisible1: true });

    _hideDateTimePicker1 = () => this.setState({ isDateTimePickerVisible1: false });

    _handleDatePicked = (datetime) => {
        console.log('A date has been picked: ', datetime);

        this._hideDateTimePicker();
        this.setState({
            datetime: moment(datetime).format('HH:mm'),
        });
    };
    _handleDatePickedEndTime = (datetime) => {
        console.log('A date has been picked: ', datetime);

        this._hideDateTimePicker1();
        this.setState({
            endTime: moment(datetime).format('HH:mm'),
        });
    };

    static navigationOptions = {
        title: 'Create Worker Shift',
        headerStyle: {
            backgroundColor: '#696969',
        },
        headerTitleStyle: {
            color: '#fff',
        }
    };

    CheckpointName = (checkpointname) => {
        this.setState({ CheckPoint_name: checkpointname })
    }

    submit = () => {
        mCheckPointName = this.state.CheckPoint_name;
        spinner = this.state.PickerValueHolder;
        startDate = this.state.dobText;
        endDate = this.state.endDate;
        console.log('ram ram', endDate);
        if (mCheckPointName.length == 0) {
            Alert.alert('Alert', 'Enter shift name',
                [
                    { text: 'Ok', onPress: () => { } },
                ],
                { cancelable: false }
            );

        } else if (spinner == 0) {
            Alert.alert('Alert', 'choose weekly off day',
                [
                    { text: 'Ok', onPress: () => { } },
                ],
                { cancelable: false }
            );

        }
        else {

            /*  {
                 "WSWSTName" : "Shift235",
                 "WSWeekOff" : "Sunday",
                 "WKWorkIDs," : "235",
                 "MEMemID" : 1059,
                 "WKWorkID" : 235,
                 "WSSDate" : "2018-12-25",
                 "WSEDate" : "2019-12-25",
                 "WSSTime" : "06:00",
                 "WSETime" : "23:00",
                 "ASAssnID" : 2
                 } */
            anu = {
                "WSWSTName": mCheckPointName,
                "WSWeekOff": spinner,
                "WKWorkIDs,": ""+workerID,
                "MEMemID": global.MyOYEMemberID,
                "WKWorkID": workerID,
                "WSSDate": startDate,
                "WSEDate": endDate,
                "WSSTime": '1900-01-01T'+this.state.datetime,
                "WSETime": '1900-01-01T'+this.state.endTime,
                "ASAssnID": global.SelectedAssociationID
            }

            console.log('anu', anu)
            fetch('http://' + global.oyeURL + '/oye247/api/v1/WorkerShiftTiming/Create',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
                    },
                    body: JSON.stringify(anu)
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log('ravii', responseJson);
                    if (responseJson.success) {
                       
                        Alert.alert('Alert', 'Worker Shift Added Successfully',
                            [
                                { text: 'Ok', onPress: () => { this.props.navigation.navigate('ResDashBoard') } },
                            ],
                            { cancelable: false }
                        );

                    }   else {
                        console.log('hiii', "failed");
                        Alert.alert('Alert', 'failed to send',
                            [
                                { text: 'Ok', onPress: () => { } },
                            ],
                            { cancelable: false }
                        );
                    }

                    console.log('suvarna', 'hi');
                })
                .catch((error) => {
                    console.error(error);
                    console.log('error', error);
                    alert("Error sending data");

                });

        }
    }

    onAssnPickerValueChange = (value, index) => {
        workerID= value;
        //global.AssociationName=results.rows.item(i).AsnName;
        console.log('Results dataSourceUnitPkr UnitID', workerID + ' ' + value);
        
        
        this.setState(
            {
                UnitPickerValueHolder: value
            }
        );

    }


    render() {
        const { navigate } = this.props.navigation;
        const { params } = this.props.navigation.state;
        // this.state.lat=params.cat;
        // this.state.long=params.cat1;

        return (
            <View style={styles.container}>
   
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

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>Create Worker</Text>


          </View>
   </View>
                <View style={{ flex: 0.8, flexDirection: 'column', }}>
                <View style={{ paddingLeft:10,paddingRight:10 }}>     
   <TextField
              label='Shift Name'
              fontSize={15}
              labelHeight={15}
              characterRestriction={50}
              activeLineWidth={0.5}
              maxLength={50}
              onChangeText={this.handleShiftName}
            />
            </View>
              <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 0.3,marginTop:'3%' }}>
                                <Text style={{ fontSize: 15, color: 'black', marginTop: 3, marginLeft: 10 }}>Security Guard: </Text>
                            </View>
                            <View style={{ flex: 0.7 }}>
                            <Picker
                            selectedValue={this.state.UnitPickerValueHolder}
                            style={{ fontSize: 15, color: 'black',}}
                            onValueChange={this.onAssnPickerValueChange} >
                            <Picker.Item label="Choose Security Guard" value='0' />
                            {this.state.dataSourceUnitPkr.map((item, key) => (
                                <Picker.Item label={item.FName} value={item.WorkID} key={key} />)
                            )}

                        </Picker>
                            </View>
                        </View>
                      
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 0.3, marginTop: 10, }}>
                                <Text style={{ fontSize: 15, color: 'black', marginTop: 3, marginLeft: 10 }}>Work off day: </Text>
                            </View>
                            <View style={{ flex: .7 }}>
                                <Picker
                                    style={{ fontSize: 5 }}
                                    selectedValue={this.state.PickerValueHolder}

                                    onValueChange={(itemValue, itemIndex) => this.setState({ PickerValueHolder: itemValue })} >
                                    <Picker.Item label="Choose weekly off day" value='0' />
                                    <Picker.Item label="Sunday" value='Sunday' />
                                    <Picker.Item label="Monday" value='Monday' />
                                    <Picker.Item label="Tuesday" value='Tuesday' />
                                    <Picker.Item label="Wednesday" value='Wednesday' />
                                    <Picker.Item label="Thursday" value='Thursday' />
                                    <Picker.Item label="Friday" value='Friday' />
                                    <Picker.Item label="Saturday" value='Saturday' />
                                </Picker>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row',alignSelf:'center', }}>
                            <Text style={{ fontSize: 15, marginBottom: 15,fontWeight: 'bold', color: 'black', fontWeight: 'bold' }}>Work Shift Details </Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>

<Text style={{ fontSize: 15, color: 'black', marginLeft: 10 }}>Start Time: </Text>
<TouchableOpacity onPress={this._showDateTimePicker}>
    <DateTimePicker
        isVisible={this.state.isDateTimePickerVisible}
        onConfirm={this._handleDatePicked}
        mode='time'
        is24Hour={false}
        onCancel={this._hideDateTimePicker}
    />
    <View style={styles.datePickerBox}>
        <Text style={styles.subtext1}>{this.state.datetime}</Text>
    </View>
</TouchableOpacity>
<Text style={{ fontSize: 15, color: 'black' }}>   End Time: </Text>

<TouchableOpacity onPress={this._showDateTimePicker1}>
    <DateTimePicker
        isVisible={this.state.isDateTimePickerVisible1}
        onConfirm={this._handleDatePickedEndTime}
        mode='time'
        is24Hour={false}
        onCancel={this._hideDateTimePicker}
    />
    <View style={styles.datePickerBox}>
        <Text style={styles.subtext1}>{this.state.endTime}</Text>
    </View>
</TouchableOpacity>
</View>
                        <View style={{ flexDirection: 'row' }}>

                            <Text style={{ fontSize: 15, color: 'black', marginLeft: 10 }}>From: </Text>
                            <TouchableOpacity style={{ height: 40 }} onPress={this.onDOBPress.bind(this)} >
                                <View style={styles.datePickerBox}>
                                    <Text style={styles.subtext1}>{this.state.dobText}</Text>
                                </View>
                            </TouchableOpacity>
                            <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />

                            <Text style={{ fontSize: 15, color: 'black' }}>  To: </Text>
                            <TouchableOpacity style={{ height: 40 }} onPress={this.onDOBPress1.bind(this)} >
                                <View style={styles.datePickerBox}>
                                    <Text style={styles.subtext1}>{this.state.endDate}</Text>
                                </View>
                            </TouchableOpacity>
                            <DatePickerDialog ref="dobDialog1" onDatePicked={this.onDOBDatePicked1.bind(this)} />
                        </View>
               

                   
                </View>
                <View style={{flex:1, alignSelf: 'center' }}>
                            <TouchableOpacity
                                style={styles.loginScreenButton}
                                onPress={this.submit.bind(this)}>
                                <Text style={{ fontSize: 15,  color: 'black', margin: 5 }}> Submit </Text>
                            </TouchableOpacity>
                            

                        </View>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white'
    },
    input: {
        margin: 10,
        height: 60,
        borderColor: 'orange',
        borderWidth: 1
    },
    rectangle1: {
        flex: 1, backgroundColor: 'white', padding: 5, borderColor: 'orange',
        marginLeft: 5, marginRight: 5, borderRadius: 2, borderWidth: 1,
    },
    subtext1: {
        fontSize: 15, color: 'black',
        margin: 4,
    },

    submitButton: {
        backgroundColor: '#ff8c00',
        padding: 10,
        margin: 15,
        height: 40,
        justifyContent: 'center',
        color: 'white'
    },
    mybutton: {
        backgroundColor: 'white',
        paddingRight: 12,
        paddingLeft: 12,
        height: 40,
        borderColor: 'orange',
        borderRadius: 0,
        borderWidth: 2,
        textAlign: 'center',
    },

    textInput: {
        fontSize: 10,
        height: 25
    },
    datePickerBox: {
        marginBottom: 32,
        marginLeft: 4,
        borderColor: '#828282',
        borderWidth: 0.5,
        padding: 0,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        height: 25,
        justifyContent: 'center'
    },
    datePickerText: {
        fontSize: 14,
        marginLeft: 5,
        height: 40,
        borderWidth: 0,
        color: '#121212',
    },
    inputLayout: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,

    }, loginScreenButton: {
        alignSelf: 'center',
        paddingTop: 2,
        paddingBottom: 2,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'orange'
      },
    rectangle1: {
        flex: 1, backgroundColor: 'white', padding: 5, borderColor: 'orange',
        marginLeft: 5, marginRight: 5, borderRadius: 2, borderWidth: 1,
    },
    image: {
        width: 100,
        height: 100,
        marginTop: 10,
        borderRadius: 100 / 2
    },
})
