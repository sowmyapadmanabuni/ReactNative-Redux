import React, { Component } from 'react';
import { AppRegistry, Platform, Alert, TouchableOpacity, ScrollView, PermissionsAndroid, StyleSheet,
  Linking, Text, Image, View, FlatList, ActivityIndicator, Button,SafeAreaView,Dimensions } from 'react-native';

import { Dropdown } from 'react-native-material-dropdown';

// import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

import Calendar from 'react-native-calendar-select';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import SwitchExample from '../registration_pages/SwitchExample';

// import RazorpayCheckout from 'react-native-razorpay';

var year1 = "OFF";
var year2 = "OFF";
var year3 = "OFF"

export default class Subscription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count:1,
            amount:2499,
            drop_down_data:[],

            totAmt:'',
            text:'',

            startDate: new Date(2017, 6, 12),  
            endDate: new Date(2017, 8, 2),

            date:new Date(),

            PickerValueHolder: '0',

            SubscriptionValidity: '',

            totalAmount:0,
            switchStYear1: false,
            switchStYear2: false,
            switchStYear3: false,


            toggleSwitchCount: 0,
        };
        this.confirmDate = this.confirmDate.bind(this);
        this.openCalendar = this.openCalendar.bind(this);
    }

    _onStateChange(newState) {
        const value = newState ? "ON" : "OFF";
        this.setState({ toggleText: value })
    }

    toggleSwitchDoNotDistrub = (value) => {
        this.setState({ switchStYear1: value })
        if (value == true) {
            year1 = "ON";
            this.setState({
                totalAmount: (this.state.amount * this.state.count * 12)
            })
        } else {
            year1 = "OFF";
        }
    }

    toggleSwitchLeaveAtGuard = (value) => {
        this.setState({ switchStYear2: value })
        if (value == true) {
            year2 = "ON";
            this.setState({
                totalAmount: (this.state.amount * this.state.count * 24)
            })
        } else {
            year2 = "OFF";
        }
    }

    toggleSwitchOTPVerification = (value) => {
        this.setState({ switchStYear3: value })
        if (value == true) {
            year3 = "ON";
            this.setState({
                totalAmount: (this.state.amount * this.state.count * 36)
            })
        } else {
            year3 = "OFF";
        }
    }


    confirmDate({startDate, endDate, startMoment, endMoment}) {
        this.setState({
          startDate,
          endDate
        });
      }
      openCalendar() {
        this.calendar && this.calendar.open();
      }
    _incrementCount = () => {
        this.setState({
            count: this.state.count + 1,
            
          })
      }
      _decrementCount = () => {
        this.setState({
            count: this.state.count - 1,
          })
      }

      onSelect(value){
        this.setState({
          text: value
        })
        console.log("Amont:", this.state.text);
        Alert.alert("Amount", this.state.text);
      }


      handleTimeCategory = (Time_category) => {
        this.setState({ PickerValueHolder: Time_category })
    }
    

    fnGetSubscription()  {
        //   const url1 = 'http://192.168.1.39:80/oye247/api/v1/GetWorkersList'
        const url3 = 'http://' + global.oyeURL + 'oyesafe/OyeLivingApi/v1/Subscription/Create'
        member = 
        {
            "SULPymtD" : moment(new Date()).format('YYYY-MM-DD'),
                "SULPymtBy" 	 : 1,
                "SUNoofDvs" 	 : 2,
                "PRID"  : 2,
                "PYID" : 1,
                "ASAssnID" : 30,
            "OyeLivingSubs": "False", 
            "OyeSafeSubs": "True",
            "TrialOyeLiving" : "True", 
            "TrialOyeSafe" : "True",
            "Biometrics" : "True",
             "TimeOfDelivery" : this.state.date + this.state.PickerValueHolder ,
            "DeviceName"  : "Nokia 2.1 Smart Phone",
            "SUTotVal":this.state.totalAmount
            }
        
                    console.log('Subscription ', url3 + ' start ' + JSON.stringify(member));

                    fetch(url3, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
                        },
                        body: JSON.stringify(member)
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            this.setState({
                                //dataSource: responseJson.data.workers.filter(x => x.associationID == global.SelectedAssociationID), 
                                isLoading: false
                            })
                            console.log('Subscription res', responseJson);
                            if (responseJson.success) {
                                // console.log('ravii workers', responseJson);
                                //isBefore(new Date(), add(new Date(), 1, 'day'));
                                //const date = new Date(2016, 6, 1); // J

                            } else {
                                console.log('Subscription ', 'else ');

                            }
                        })
                        .catch((error) => {
                            console.log(error)
                        })
    }
                    

    fnRazorPayment() {
        this.toggleSwitchOnetap()
        var options = {
            description: 'Payment for Subscription',
            image: 'https://www.oyespace.com/img/Oyespace/Oyesafe/OyeSafe%20Dark%20Big.png',
            currency: 'INR',
            key: 'rzp_live_5IrgJE67ikiink',
            amount: this.state.totalAmount * 100,
            external: {
                wallets: ['paytm']
            },
            name: 'Oyesafe ',
            prefill: {
                email: global.MyEmail,
                contact: global.MyMobileNumber,
                name: global.MyFirstName
            },
            theme: { color: '#ED8A19' }
        }
        RazorpayCheckout.open(options).then((data) => {
            // handle success
            alert(`Success: ${data.razorpay_payment_id}`);
        }).catch((error) => {
            // handle failure
            alert(`Error: ${error.code} | ${error.description}`);
        });
        RazorpayCheckout.onExternalWalletSelection(data => {
            alert(`External Wallet Selected: ${data.external_wallet} `);
        });
        
    }

    toggleSwitchOnetap() {
        if(this.state.switchStYear1 == false && this.state.switchStYear2 == false && this.state.switchStYear3 == false){
            alert('Select Atleast One toggle option');
            return false;
        }
        if (this.state.switchStYear1 == true && this.state.switchStYear2 == true && this.state.switchStYear3 == true) {
            alert('Select Only One toggle option');
            return false;
        }
        if (this.state.switchStYear1 == true && this.state.switchStYear2 == true) {
            Alert.alert('Select Only One toggle option');
            return false;
        }
        if (this.state.switchStYear2 == true && this.state.switchStYear3 == true) {
            Alert.alert('Select Only One toggle option');
            return false;
        }
        if (this.state.switchStYear1 == true && this.state.switchStYear3 == true) {
            Alert.alert('Select Only One toggle option');
            return false;
        }
    }





    render() {
        const { navigate } = this.props.navigation;
        const { params } = this.props.navigation.state;

        let data = [{
            value: '9:00 A.M. to 11:00 A.M.',
          }, {
            value: '11:00 A.M. to 01:00 P.M.',
          }, {
            value: '02:00 P.M. to 04:00 P.M.',
          }, {
              value: '4:00 P.M. to 06:00 P.M.',
          }];
          var subscriptionYear = [
            {label:"1 Year ("+ (this.state.amount * this.state.count * 12) + ")", value: (this.state.amount * this.state.count * 12)},
            {label:"2 Year ("+ (this.state.amount * this.state.count * 24) + ")", value: (this.state.amount * this.state.count * 24)},
            {label:"3 Year ("+ (this.state.amount * this.state.count * 36) + ")", value: (this.state.amount * this.state.count * 36)},
        ];
          
        return (
            
            <View style={styles.container}>
            <View style={{flexDirection:'row',}}>
                    <View style={{flex:1, marginTop:43,marginRight:0, justifyContent:'center',marginLeft:'2%'}}>
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
                    <View style={{ flex: 6, alignItems:'center', justifyContent:'center',}}>
                    <Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
                        style={{height: 40, width: 95, marginTop: 45,marginBottom:5}} />
                    </View>  
                    <View style={{flex:1,marginTop:45, marginRight:10, justifyContent:'center',}}>    
                    </View>                 
                </View> 

                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>Subscription</Text>
                

            <View style={{ flexDirection: 'column', paddingTop: 2,
                paddingBottom: 2, paddingLeft:5,paddingRight:5,margin:'3%',
                backgroundColor: 'white',
                borderRadius: 5,
                borderWidth: 1,
                borderColor: 'orange'  }}>
                
                <View style={{flexDirecton:'column'}}>
                    <View><Text style={{color:'black', fontWeight:'bold',fontSize:15, justifyContent:'center', alignSelf:'center'}}>Cost Per Device</Text></View>
                    <View style={{ flexDirection:'row'}}>
                        <Image source={require('../pages/assets/images/menu_button.png')} style={{width:20, height:20}}/>
                        <Text>Nokia 2.1 Smart Phone</Text>
                    </View>

                    <View style={{flexDirection:'row', justifyContent:'flex-end', alignItems:'flex-end', marginRight:'5%'}}>
                        {/* <Text style={{ color:'black', fontWeight:'bold',fontSize:15, justifyContent:'flex-end', alignSelf:'center'}}>+</Text> */}
                        {this.state.count <= 1 ? 
                        <TouchableOpacity
                                style={styles.mybuttonDisable}     >
                                <Text style={{height:0}}></Text>
                            </TouchableOpacity>  
                                : <TouchableOpacity
                                // style={styles.loginScreenButton12}
                                onPress={this._decrementCount}
                                underlayColor='#fff'>
                                <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black', }}>-</Text>
                            </TouchableOpacity> }
                            
                            <Text style={{ fontSize: 20, color: 'black', }}
                                        
                                        value={this.state.count}
                                        
                                        > {this.state.count}</Text>
                                    <TouchableOpacity
                                        // style={styles.loginScreenButton12}
                                        onPress={this._incrementCount}
                                        underlayColor='#fff'>
                                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black', }}>+</Text>
                                    </TouchableOpacity> 
                    </View>
                     
                    <View style={{ flexDirection:'row'}}>
                        <Image source={require('../pages/assets/images/menu_button.png')} style={{width:20, height:20}}/>
                        <Text>Secugan Biometric</Text>
                    </View>
                    

                    <View style={{flexDirection:'column',marginTop:5}}>
                            
                            {/* <RadioForm 
                                radio_props={subscriptionYear}
                                onPress={(value) => {Alert.alert("Value:", value.toString())}}
                                initial={-1}
                            
                            
                            
                            /> */}
                            
                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Text>Select Any One Option</Text>
                            </View>    
                            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                <Text style={{ flex:5 ,fontSize: 15,  color: 'black', marginLeft: 10 }}>1 Year(Rs {this.state.amount * this.state.count * 12}/-)</Text>
                                <SwitchExample
                                    toggleSwitch1={this.toggleSwitchDoNotDistrub}
                                    switch1Value={this.state.switchStYear1} />
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                <Text style={{ flex:5 ,fontSize: 15,  color: 'black', marginLeft: 10 }}>2 Years(Rs {this.state.amount * this.state.count * 24}/-)</Text>
                                <SwitchExample
                                    toggleSwitch1={this.toggleSwitchLeaveAtGuard}
                                    switch1Value={this.state.switchStYear2} />
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                <Text style={{flex:5 , fontSize: 15,  color: 'black', marginLeft: 10 }}>3 Years(Rs {this.state.amount * this.state.count * 36}/-)</Text>
                                <SwitchExample
                                    toggleSwitch1={this.toggleSwitchOTPVerification}
                                    switch1Value={this.state.switchStYear3} />
                            </View>



                        {/* <RadioGroup onSelect = {(index, value) => this.onSelect(index, value)}>
                            <RadioButton value={this.state.amount * this.state.count * 12} >
                                <Text>1 Year ({this.state.amount * this.state.count * 12})</Text>
                            </RadioButton>
                    
                            <RadioButton value={this.state.amount * this.state.count * 24}>
                                <Text>2 Year ({this.state.amount * this.state.count * 24})</Text>
                            </RadioButton>
                    
                            <RadioButton value={'this.state.amount * this.state.count * 36'}>
                                <Text>3 Year ({this.state.amount * this.state.count * 36})</Text>
                            </RadioButton>
                        </RadioGroup>
                         */}
                        {/* <Text style={styles.text}>{this.state.text}</Text> */}
                        
                    </View> 
                    <View style={{flexDirection:'column',marginLeft: 15, paddingRight: 15 }}>
                        
                        <View style={{ alignItems:'center',justifyContent:'center',marginTop:5,}}>
                            <Text style={{color:'orange', fontWeight:'bold',alignItems:'center',justifyContent:'center',fontSize:12}}>Click here to Select Date</Text>
                            {/* <Calendar 
                                i18n="en"
                                ref={(calendar) => {this.calendar = calendar;}}
                                customI18n={customI18n}
                                color={color}
                                format="DDMMYYYY"
                                minDate="01032019"
                                maxDate="31122025"
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                onConfirm={this.confirmDate}
                            /> */}
                        </View>
                        <View>
                            <DatePicker
                                style={{width: Dimensions.get('window').width - 100}}
                                date={this.state.date}
                                mode="date"
                                placeholder="Click me to Select Date"
                                format="DD-MM-YYYY"
                                minDate="28-02-2019"
                                maxDate="31-12-2025"
                                confirmBtnText="OK"
                                cancelBtnText="Cancel"
                                customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                                // ... You can check the source to find the other keys.
                                }}
                                onDateChange={(date) => {this.setState({date: date})}}
                            />
                        </View>
                        <Dropdown
                            label='Select Time Range'
                            data={data}
                            onChangeText={this.handleTimeCategory}
                        />
                    </View>        
                </View> 
                <View style={{color: 'white', backgroundColor: 'white',justifyContent:'flex-end',alignItems:'flex-end' }} >
                            <Text style={{
                                justifyContent: 'flex-end', textAlign: 'center',alignItems:'flex-end',marginRight:'5%',
                                fontSize: 16, padding: 10, color: 'white', backgroundColor: 'red',width:100,height:40,marginBottom:10,}}
                                onPress={this.fnRazorPayment.bind(this)}
                            >Checkout</Text>
                        </View>   
            </View>
        </View>
    )};
}
    
    const styles = StyleSheet.create({
        container: {
            flex:1,
          },  
      TouchableOpacityStyle: {
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
      },
      rectangle: {
        backgroundColor: 'white', padding: 10, borderColor: 'orange',
        margin: 5, borderRadius: 2, borderWidth: 1, alignContent: 'center', marginBottom:'10%',marginRight:'5%',
    },
    createPDFButtonText: { color: '#FA9917' },
    });