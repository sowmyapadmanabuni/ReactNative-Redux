import React, { Component } from "react";

import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  Button,
  Dimensions,
  FlatList,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  ToastAndroid,
  Picker,
  Image,
  Card,
  Avatar,
  NetInfo,
  TouchableHighlight
} from "react-native";
import { Dropdown } from "react-native-material-dropdown";
import { Fonts } from "../pages/src/utils/Fonts";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import MultiSelect from "react-native-multiple-select";

import moment from "moment";

export default class CreatePatrollingShift extends Component {
  constructor() {
    super();

    this.state = {
      PatrollingDays: "",
      FrequencyValue: "",
      PickerValueHolderguard: [],
      PickerValueHolderCheckpoint: [],
      dataSourceGuardPkr: [],
      dataSourceCheckpointPkr: [],
      connection_Status: "",
      selectedItems: [],
      selectedItems1: [],
      dobText: moment(new Date()).format("YYYY-MM-DD")
    };
    this.items = [
      {
        id: "Sunday",
        name: "Sunday"
      },
      {
        id: "Monday",
        name: "Monday"
      },
      {
        id: "Tuesday",
        name: "Tuesday"
      },
      {
        id: "Wednesday",
        name: "Wednesday"
      },
      {
        id: "Thursday",
        name: "Thursday"
      },
      {
        id: "Friday",
        name: "Friday"
      },
      {
        id: "Saturday",
        name: "Saturday"
      }
    ];
    this.items1 = [
      {
        id: "Patrolling Start Point",
        name: "Patrolling Start Point"
      },
      {
        id: "Patrolling Point 1",
        name: "Patrolling Point 1"
      },
      {
        id: "Patrolling Point 2",
        name: "Patrolling Point 2"
      },
      {
        id: "Patrolling Point 3",
        name: "Patrolling Point 3"
      },
      {
        id: "Patrolling Point 4",
        name: "Patrolling Point 4"
      },
      {
        id: "Patrolling Point 5",
        name: "Patrolling Point 5"
      },
      {
        id: "Patrolling Point 6",
        name: "Patrolling Point 6"
      },
      {
        id: "Patrolling Point 7",
        name: "Patrolling Point 7"
      },
      {
        id: "Patrolling Point 8",
        name: "Patrolling Point 8"
      },
      {
        id: "Patrolling Point 9",
        name: "Patrolling Point 9"
      },
      {
        id: "Patrolling Point 10",
        name: "Patrolling Point 10"
      },
      {
        id: "Patrolling Point 11",
        name: "Patrolling Point 11"
      },
      {
        id: "Patrolling Point 12",
        name: "Patrolling Point 12"
      },
      {
        id: "Patrolling Point 13",
        name: "Patrolling Point 13"
      },
      {
        id: "Patrolling Point 14",
        name: "Patrolling Point 14"
      },
      {
        id: "Patrolling Point 15",
        name: "Patrolling Point 15"
      },
      {
        id: "Patrolling Point 16",
        name: "Patrolling Point 16"
      },
      {
        id: "Patrolling Point 17",
        name: "Patrolling Point 17"
      },
      {
        id: "Patrolling Point 18",
        name: "Patrolling Point 18"
      },
      {
        id: "Patrolling Point 19",
        name: "Patrolling Point 19"
      },
      {
        id: "Patrolling Point 20",
        name: "Patrolling Point 20"
      },
      {
        id: "Patrolling End Point",
        name: "Patrolling End Point"
      }
    ];
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
    console.log("raju", this.state.selectedItems);
  };
  onSelectedItemsChange1 = selectedItems1 => {
    this.setState({ selectedItems1 });
    console.log("raju", this.state.selectedItems1);
  };
  handleFrequencyValue = text => {
    this.setState({
      FrequencyValue: text
    });
  };

  handlePatrollingDays = text => {
    this.setState({
      PatrollingDays: text
    });
  };
  onDOBPress = () => {
    let dobDate = this.state.dobDate;

    if (!dobDate || dobDate == null) {
      dobDate = new Date();
      this.setState({
        dobDate: dobDate
      });
    }
    this.refs.dobDialog.open({
      date: dobDate,
      minDate: new Date() //To restirct future date
    });
  };
  onDOBDatePicked = date => {
    this.setState({
      dobDate: date,
      dobText: moment(date).format("YYYY-MM-DD")
    });
  };
  onDateChange(date) {
    this.setState({
      selectedStartDate: date
    });
  }

  componentDidMount() {
    this.setState({
      firstname: global.MyFirstName,
      lastname: global.MyLastName,

      emailId: global.MyEmail,
      AlternateEmailID: ""
    });

    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this._handleConnectivityChange
    );

    NetInfo.isConnected.fetch().done(isConnected => {
      if (isConnected == true) {
        this.setState({
          connection_Status: "Online"
        });
      } else {
        this.setState({
          connection_Status: "Offline"
        });

        Alert.alert(
          "No Internet",
          "Please Connect to the Internet. ",
          [
            {
              text: "Ok",
              onPress: () => {
                this.props.navigation.navigate("ResDashBoard");
              }
            }
          ],
          {
            cancelable: false
          }
        );
      }
    });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this._handleConnectivityChange
    );
  }

  _handleConnectivityChange = isConnected => {
    if (isConnected == true) {
      this.setState({
        connection_Status: "Online"
      });
    } else {
      this.setState({
        connection_Status: "Offline"
      });
      alert("You are offline...");
    }
  };
  static navigationOptions = {
    title: "Create Patrolling Shift",
    headerStyle: {
      backgroundColor: "#696969"
    },

    headerTitleStyle: {
      color: "#fff"
    }
  };

  submit = () => {
    //console.log('bharath',WorkID+CheckpointID);
    spinnerWorkID = this.state.PickerValueHolderguard;
    spinnerCheckPointID = this.state.PickerValueHolderCheckpoint;
    patrollingValidityDate = this.state.dobText;
    patrollingDay = this.state.selectedItems;
    frequencyValue = this.state.FrequencyValue;

    if (frequencyValue.length == 0) {
      Alert.alert(
        "Alert",
        "Choose Patrolling Time",
        [{ text: "Ok", onPress: () => {} }],
        { cancelable: false }
      );
    } else if (patrollingDay.length == 0) {
      Alert.alert(
        "Alert",
        "Choose Patrolling Day",
        [{ text: "Ok", onPress: () => {} }],
        { cancelable: false }
      );
    }
    // else if (spinnerWorkID == 0) {
    //     Alert.alert('Alert', 'Choose Security Guards',
    //         [
    //             { text: 'Ok', onPress: () => { } },
    //         ],
    //         { cancelable: false }
    //     );

    // }
    // else if (spinnerCheckPointID == 0) {
    //   Alert.alert('Alert', 'Choose Patrolling Checkpoint',
    //       [
    //           { text: 'Ok', onPress: () => { } },
    //       ],
    //       { cancelable: false }
    //   );

    // }
    else {
      anu = {
        PSPtrlFrq: frequencyValue,
        WKWorkIDs: "0",
        PSRepDays: patrollingDay,
        PSSDate: "null",
        PSChkPIDs: "0",
        ASAssnID: global.SelectedAssociationID

        //     "PSPtrlFrq" :frequencyValue,
        //  "WKWorkIDs"  : "0",
        //  "PSRepDays"  : patrollingDay,
        //  "PSSDate"    : patrollingValidityDate,
        //  "PSChkPIDs"  : "0",
        //  "ASAssnID"   : global.SelectedAssociationID
      };

      console.log("anu", anu);

      fetch(
        "http://apidev.oyespace.com/oye247/api/v1/PatrollingShifts/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
          },
          body: JSON.stringify(anu)
        }
      )
        .then(response => response.json())
        .then(responseJson => {
          console.log("logresponseupdate", responseJson);
          if (responseJson.success) {
            Alert.alert(
              "Success",
              "Patrolling Shift Added Successfully ",
              [
                {
                  text: "Ok",
                  onPress: () => {}
                }
              ],
              {
                cancelable: false
              }
            );
          } else {
            console.log("hiii", failed);

            Alert.alert(
              "Failed",
              "User Updation Failed",
              [
                {
                  text: "Ok",
                  onPress: () => {}
                }
              ],
              {
                cancelable: false
              }
            );
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    const { selectedItems } = this.state;
    const { selectedItems1 } = this.state;

    let Frequency_Type = [
      {
        value: "07:00 am"
      },
      {
        value: "09:00 am"
      },
      {
        value: "12:00 pm"
      },
      {
        value: "02:00 pm"
      },
      {
        value: "04:00 pm"
      },
      {
        value: "06:00 pm"
      },
      {
        value: "08:00 pm"
      }
    ];

    return (
      <View style={styles.container}>
        <View
          style={{
            paddingTop: 2,
            paddingRight: 2,
            paddingLeft: 2,
            flexDirection: "row",
            paddingBottom: 2,
            borderColor: "white",
            borderRadius: 0,
            borderWidth: 2,
            textAlign: "center",
            marginTop: 45
          }}
        >
          <TouchableOpacity
            onPress={() => navigate("ResDashBoard", { cat: "" })}
            style={{ flex: 1, alignSelf: "center" }}
          >
            <Image
              source={require("../pages/assets/images/back.png")}
              style={{ height: 25, width: 25 }}
            />
          </TouchableOpacity>
          <Text
            style={{
              flex: 2,
              paddingLeft: 5,
              fontSize: 14,
              color: "black",
              alignContent: "flex-start",
              alignSelf: "center"
            }}
          >
            {" "}
          </Text>
          <View style={{ flex: 3, alignSelf: "center" }}>
            <Image
              source={require("../pages/assets/images/OyespaceRebrandingLogo.png")}
              style={{
                height: 38,
                width: 95,
                margin: 5,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center"
              }}
            />
          </View>
          <View
            style={{
              flex: 3,
              alignSelf: "flex-end",
              alignItems: "flex-end",
              justifyContent: "flex-end"
            }}
          />
        </View>
        <View
          style={{
            backgroundColor: "lightgrey",
            flexDirection: "row",
            width: "100%",
            height: 1
          }}
        />
        <Text
          style={{
            fontSize: 16,
            color: "black",
            fontWeight: "bold",
            justifyContent: "center",
            alignContent: "center",
            marginBottom: 10,
            marginTop: 10,
            marginLeft: 10
          }}
        >
          Create Patrolling Shift
        </Text>
        <View
          style={{
            flexDirection: "column",
            paddingTop: 2,
            paddingBottom: 2,
            paddingLeft: 5,
            paddingRight: 5,
            backgroundColor: "white",
            borderRadius: 5,
            borderWidth: 1,
            borderColor: "orange",
            margin: 10
          }}
        >
          {/* <View
            style={{
              paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
              borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
            }}>
            <TouchableOpacity onPress={() => navigate(('ResDashBoard'), { cat: '' })}
              style={{ flex: 1 }}>
              <Image source={require('../pages/assets/images/back.png')}
                style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
            </TouchableOpacity>
            <Text style={{ flex: 2, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>
            <Text style={{ flex: 6, fontSize: 16, color: 'black', fontFamily: Fonts.PoppinsExtraBold, alignSelf: 'center' }}>Create Patrolling Shift</Text>
            <View style={{ flex: 3, alignSelf: 'center' }}>
              <Image source={require('../pages/assets/images/OyeSpace_hor.png')}
                style={{
                  height: 35, width: 105, margin: 5,
                  alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
                }} />
            </View>
          </View> */}
          <ScrollView style={{ marginBottom: 100 }}>
            <View style={styles.row}>
              <Text
                style={{
                  fontSize: 14,
                  width: wp("40%"),
                  color: "black",
                  marginTop: hp("5.5%")
                }}
              >
                Patrolling Time:{" "}
              </Text>
              <View style={styles.inputWrap}>
                <Dropdown
                  label="Patrolling Time"
                  data={Frequency_Type}
                  width={wp("70%")}
                  labelFontSize={10}
                  rippleOpacity={0}
                  fontSize={14}
                  onChangeText={this.handleFrequencyValue}
                />
              </View>
            </View>
            {/* <View style={styles.row}>
                              
                              <Text style={{ fontSize: 14, fontFamily:Fonts.PoppinsRegular, color: 'black', marginLeft: 15, }}>Validity Date: </Text>
                              <TouchableOpacity onPress={this.onDOBPress.bind(this)} >
                  <View style={styles.datePickerBox}>
                    <Text style={{ color: 'black', fontFamily:Fonts.PoppinsRegular,fontSize: hp('2%')}}>{this.state.dobText}</Text>
                  </View>
                </TouchableOpacity>
                <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />
                      </View> */}

            {/* <View style={{flex:1,flexDirection: 'row'}}>
        <View style={{flex:wp('40%')}}>                 
            <Text style={{ fontSize: 14, fontFamily:Fonts.PoppinsRegular,marginTop:hp('4%'), color: 'black'}}>Patrolling Days: </Text>
            </View>   
            <View style={{flex:wp('60%')}}> 
              
                           <Dropdown
              label='Select Patrolling Days'
              data={Patrolling_Days}
              width={wp('60%')}
              fontFamily={Fonts.PoppinsRegular}
              fontSize={14}
              onChangeText={this.handlePatrollingDays} 
            /> 
            </View>  
                      </View> */}
            <MultiSelect
              hideTags
              items={this.items}
              uniqueKey="id"
              ref={component => {
                this.multiSelect = component;
              }}
              onSelectedItemsChange={this.onSelectedItemsChange}
              selectedItems={selectedItems}
              selectText="Select Patrolling days"
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="orange"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="name"
              searchInputStyle={{ color: "#CCC" }}
              submitButtonColor="#CCC"
              submitButtonText="Submit"
            />
            <MultiSelect
              hideTags
              items={this.items1}
              uniqueKey="id"
              ref={component => {
                this.multiSelect = component;
              }}
              onSelectedItemsChange={this.onSelectedItemsChange1}
              selectedItems={selectedItems1}
              selectText="Select Check Points"
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="orange"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="name"
              searchInputStyle={{ color: "#CCC" }}
              submitButtonColor="#CCC"
              submitButtonText="Submit"
            />
            <TouchableOpacity
              style={[styles.loginScreenButton]}
              onPress={() => this.submit()}
            >
              <Text
                style={{ fontSize: 14, color: "black", alignSelf: "center" }}
              >
                Submit{" "}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",

    backgroundColor: "#fff",

    height: "100%",

    width: "100%"
  },

  input: {
    marginLeft: 20,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,

    height: 40,
    borderColor: "#F2F2F2",
    backgroundColor: "#F2F2F2",
    borderWidth: 1.5,
    borderRadius: 2
  },

  submitButton: {
    backgroundColor: "#ff8c00",

    padding: 10,

    margin: 15,

    height: 40,

    color: "white"
  },

  mybutton: {
    backgroundColor: "white",

    marginTop: 5,

    height: 40,

    borderColor: "orange",

    borderRadius: 0,

    borderWidth: 2,

    textAlign: "center"
  },

  rectangle: {
    backgroundColor: "white",
    padding: 10,
    borderColor: "orange",

    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    borderRadius: 2,
    borderWidth: 1
  },

  textInput: {
    fontSize: 10,

    height: 25
  },

  datePickerBox: {
    marginLeft: wp("50%"),

    marginLeft: 60,

    borderColor: "#ABABAB",

    borderWidth: 0.5,

    padding: 0,

    borderTopLeftRadius: 4,

    borderTopRightRadius: 4,

    borderBottomLeftRadius: 4,

    borderBottomRightRadius: 4,

    height: 25,

    justifyContent: "center"
  },

  profileImgContainer: {
    marginTop: 5,

    height: 100,

    width: 100,

    borderRadius: 50
  },

  profileImg: {
    height: 100,

    width: 100,

    borderRadius: 50
  },

  loginScreenButton: {
    alignSelf: "center",

    width: "50%",

    marginLeft: 10,

    marginTop: 5,

    paddingTop: 2,

    paddingBottom: 2,

    backgroundColor: "white",

    borderRadius: 5,

    borderWidth: 1,

    borderColor: "orange"
  },

  datePickerText: {
    fontSize: 14,

    marginLeft: 5,

    borderWidth: 0,

    color: "#121212"
  },

  imagee: {
    height: 14,

    width: 14,

    margin: 10
  },

  row: {
    flex: 1,

    flexDirection: "row"
  },

  inputWrap: {
    flex: 1,

    marginLeft: 5,

    paddingRight: 15
  },

  ImageStyle: {
    padding: 10,

    margin: 5,

    height: 25,

    width: 25,

    resizeMode: "stretch",

    alignItems: "center"
  },

  SectionStyle: {
    flexDirection: "row",

    backgroundColor: "#fff",

    borderWidth: 0.5,

    borderColor: "#000",

    height: 40,

    borderRadius: 5,

    margin: 10
  },

  inputLayout: {
    marginTop: 5,

    marginLeft: 10,

    marginRight: 10
  },

  image: {
    width: 100,

    height: 100,

    marginTop: 10,

    borderColor: "orange",

    borderRadius: 2,

    borderRadius: 100 / 2,

    alignSelf: "center",

    justifyContent: "center",

    alignItems: "center"
  }
});
