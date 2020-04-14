/**
* Sample React Native App
* https://github.com/facebook/react-native
*
* @format
* @flow
*/

import React, { Component } from 'react';
import { Platform, StyleSheet, Alert, Text, ToastAndroid, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-datepicker'
import MultipleChoice from 'rn-multiple-choice'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class Schedulemeeting extends Component {
  constructor() {
    super();
    this.state = {
      chosenDate: new Date(),
      chosenTime: new Date(),
      Subject: "",
      Agenda: "",
      Location: "",
      Gps: "",
      option: ''
    };
    this.setDate = this.setDate.bind(this);
    this.setTime = this.setTime.bind(this);
  }
  static navigationOptions = {
    title: ' Schedule Meeting',
    headerStyle: {
      backgroundColor: '#696969',
    },
    headerTitleStyle: {
      color: '#fff',
    }
  };




  subject = (details) => {
    this.setState({ Subject: details })
  }
  details = (meeting_agenda) => {
    this.setState({ Agenda: meeting_agenda })
  }

  Gpssetting = (gps) => {
    this.setState({ Gps: gps })
  }
  location = (place) => {
    this.setState({ Location: place })
  }


  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }
  setTime(newTime) {
    this.setState({ chosenTime: newTime })
  }

  mobilevalidate = () => {
    const { navigate } = this.props.navigation;

    msub = this.state.Subject;
    mAgenda = this.state.Agenda;
    mLocation = this.state.Location;
    mGps = this.state.Gps;

    if (msub.length <= 3) {
      ToastAndroid.show('Invalid Subject', ToastAndroid.SHORT);
    }
    else if (mAgenda.length < 3) {
      ToastAndroid.show('Invalid Agenda', ToastAndroid.SHORT);

    }


    else if (mGps.length == 0) {
      ToastAndroid.show('Invalid Gps', ToastAndroid.SHORT);
    }


    // else if (reg.test(mobilenumber) === false) {
    //     ToastAndroid.show(' enter valid number', ToastAndroid.SHORT);

    //   this.setState({
    //     mobilevalidate: false,
    //     telephone: mobilenumber,

    //   });
    //   return false;
    // }

    /*{"accountID":89, "Association": { "associationID":null, "PropertyCode":null, "Name":"New RET123", 
    "Country":" India", "Locality":"Banashankari  Bengaluru  Karnataka",
"Pincode":"560032", "GPSLocation":"12.9254533, 77.54675700000007", "RegistrationNo":"RET12", 
"Website":"www.google.com",
"email":"newret@ret.com", "ManagerName":"RETS", "ManagerMobile":"+917878787878",
 "RateType":"flatRatevalue", "UnitOfMeasuremnet":"sqft",
"DueMonth":"January", "BillGenerationDay":1, "MaintPymtFreq":"Monthly", "DueDay":1, 
"LatePaymentChargeFreq":"Annually",
"StartFromMonth":"January", "StartFromDay":1, "LatePaymentCharge":"2", "TotalUnits":"20",
 "FYStart":null, "panNo":"qqqqq1111q",
"panDocument":"Images/59385796.png", "panFileType":"png", "gstNo":"11qqqqq1111q1z5", "referralCode":"AQWE",
"BankDetails":[
{
"associationID":null, "BankName":"SBI", "IFSC":"SBIA1111111", "AccountNumber":"5865877777", "AccountType":"Savings",
"AccountBalance":"100", "IsDefault":"1"
}
]
}               
} 
 */

    /*
                  * {"associationid":30,
                  "subject":"ch jvk",
                  "agenda":"jvivi",
                  "details":"suv",
                  "scheduledtime":"10-13-2018",
                  "location":"uv ugg",
                  "gpspoint":"12.8467636,77.6480533",
                  "meetingfor":"SecurityGuard ",
                  "scheduledby":"Basavaraj Gudageri 1676",
                  "status":"scheduled"}*/


    /** {"associationid":30,
"subject":msub,
"agenda":mAgenda,
"details":"suv",
"scheduledtime":this.state.chosenDate.toString(),
"location":mLocation,
"gpspoint":mGps,
"meetingfor":"SecurityGuard ",
"scheduledby":"Basavaraj",
"status":"scheduled"}*/


    else {
      console.log('raviii', this.state.option);

      anu = {
        "associationid": 30,
        "subject": msub,
        "agenda": mAgenda,
        "details": "suv",
        "scheduledtime": this.state.chosenDate.toString(),
        "location": mLocation,
        "gpspoint": mGps,
        "meetingfor": this.state.option,
        "scheduledby": "Basavaraj",
        "status": "scheduled"
      }
      console.log('aaanuuuuu', anu);

      fetch('http://oye247api.oye247.com/oye247/api/v1/NoticeBoards/create',
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
          if (responseJson.success) {
            console.log('ravii', responseJson);
            ToastAndroid.show('sent suceefully !', ToastAndroid.SHORT);

          }
          else {
            ToastAndroid.show('failed to send !', ToastAndroid.SHORT);
          }
        })
        .catch((error) => {
          console.error(error);
          ToastAndroid.show(' caught error in sending otp', ToastAndroid.SHORT);
        });
    }
  }





  render() {

    return (


      <ScrollView style={styles.container}>
        <View>
          <MultipleChoice
            options={[
              'Evevyone',
              'Resident',
              'Security',
              'Supervisor',
              'Admin'
            ]}
            selectedOptions={['Evevyone']}
            maxSelectedOptions={1}
            onSelection={(option) => this.state.option = option}

          />
          <Text>

          </Text>


          <TextInput style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Subject"
            placeholderTextColor="#9a73ef"
            autoCapitalize="none"
            onChangeText={this.subject} />

          <TextInput style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Agenda"
            placeholderTextColor="#9a73ef"
            autoCapitalize="none"
            onChangeText={this.details} />

          <TextInput style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Location"
            placeholderTextColor="#9a73ef"
            autoCapitalize="none"
            onChangeText={this.location} />

          <TextInput style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Gps"
            placeholderTextColor="#9a73ef"
            autoCapitalize="none"
            onChangeText={this.Gpssetting} />

          <View style={{ flex: 1, flexDirection: 'row' }}>

            <DatePicker
              // style={{width: 200}}
              // defaultDate={new Date(2018, 4, 4)}
              //   minimumDate={new Date(2018, 1, 1)}
              //   maximumDate={new Date(2018, 12, 31)}

              mode="time"

              // format="DD-MM-YYYY"

              // confirmBtnText="Confirm"
              // cancelBtnText="Cancel"
              // customStyles={{

              //   dateInput: {
              //     marginLeft: -10
              //   }
              // ... You can check the source to find the other keys.
              // }}
              onDateChange={this.setTime}
            />

            <Text style={{ flex: 1, FlexDirection: 'row' }}>

              Time: {this.state.chosenTime.toString()}
            </Text>


            <View >

              <DatePicker
                // style={{width: 200}}
                // defaultDate={new Date(2018, 4, 4)}
                //   minimumDate={new Date(2018, 1, 1)}
                //   maximumDate={new Date(2018, 12, 31)}

                mode="date"

                format="MM-DD-YYYY"

                // confirmBtnText="Confirm"
                // cancelBtnText="Cancel"
                // customStyles={{

                //   dateInput: {
                //     marginLeft: -10
                //   }
                // ... You can check the source to find the other keys.
                // }}
                onDateChange={this.setDate}
              />

              <Text style={{ flex: 1, FlexDirection: 'row' }}>
                Date: {this.state.chosenDate.toString().substring(4, 12)}
              </Text>


            </View>
          </View>


          <TouchableOpacity
            style={styles.submitButton}
            onPress={this.mobilevalidate.bind(this)}>
            <Text style={styles.submitButtonText}> Submit </Text>
          </TouchableOpacity>

        </View>


      </ScrollView>

    );
  }



  // constructor(props){
  //     super(props)
  //     this.state = {date:"2016-05-15"}
  //   }

  //   render(){
  //     return (
  //       <DatePicker
  //         style={{width: 200}}
  //         date={this.state.date}
  //         mode="date"
  //         placeholder="select date"
  //         format="YYYY-MM-DD"
  //         minDate="2016-05-01"
  //         maxDate="2016-06-01"
  //         confirmBtnText="Confirm"
  //         cancelBtnText="Cancel"
  //         customStyles={{
  //           dateIcon: {
  //             position: 'absolute',
  //             left: 0,
  //             top: 4,
  //             marginLeft: 0
  //           },
  //           dateInput: {
  //             marginLeft: 36
  //           }
  //           // ... You can check the source to find the other keys.
  //         }}
  //         onDateChange={(date) => {this.setState({date: date})}}
  //       />
  //     )
  //   }





  //   render() {
  //     return (
  //       <View style={styles.Container}>
  //        <MapView style={styles.map}
  //      initialRegion={{
  //       latitude: 37.78825,
  //       longitude: -122.4324,
  //       latitudeDelta: 0.0922,
  //       longitudeDelta: 0.0421
  //     }}>
  //     <MapView.Marker coordinate={{
  //        latitude: 59.32932349999999,
  //        longitude: 18.068580800000063

  //     }}
  //     title={'my marker'
  //     }
  //     description={'my description'}/>
  // </MapView>

  //       </View>
  //     );
  //   }
}


const styles = StyleSheet.create({
  container: {
    paddingTop: 23,
    padding: 10,
  },
  input: {
    margin: 10,
    width: '100%',
    height: 40,

    borderWidth: 1,

  },
  submitButton: {
    backgroundColor: '#7a42f4',
    padding: 10,
    margin: 15,
    height: 40,
  },
  submitButtonText: {
    color: 'white'
  }
})


// const styles = StyleSheet.create({
//   Container: {
//   width:'100%',
//   height:300

//   },map:{

//    width:'100%',
//    height:'100%'

// }

// });
