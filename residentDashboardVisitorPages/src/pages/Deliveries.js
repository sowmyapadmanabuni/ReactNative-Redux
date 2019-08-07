import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  AppRegistry,
  TouchableOpacity,
  Linking,
  Keyboard,
  Alert,
  ActivityIndicator,
  TextInput,
  Easing,
  SafeAreaView,
  Dimensions
} from "react-native";
// import Header from "./src/components/common/Header"
import { Card, CardItem, Button, Form, Item, Input, Icon } from "native-base";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import DateTimePicker from "react-native-modal-datetime-picker";
import { DatePickerDialog } from "react-native-datepicker-dialog";
import ImageLoad from "react-native-image-placeholder";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import ZoomImage from "react-native-zoom-image";
import { connect } from "react-redux";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      isLoading: true,

      //search bar
      loading: false,
      error: null,

      datetime: moment(new Date()).format("HH:mm:ss a"),

      //date picker
      dobText: moment(new Date()).format("YYYY-MM-DD"), //year + '-' + month + '-' + date,
      dobDate: moment(new Date()).format("YYYY-MM-DD"),
      isDateTimePickerVisible: false,

      dobText1: moment(new Date()).format("YYYY-MM-DD"),
      dobDate1: moment(new Date()).format("YYYY-MM-DD"),
      isDateTimePickerVisible1: false,

      switch: false,

      count: 1
    };
    this.arrayholder = [];
  }

  //Date Picker 1
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
      maxDate: new Date() //To restirct past dates
    });
  };

  onDOBDatePicked = date => {
    this.setState({
      dobDate: date,
      dobText: moment(date).format("YYYY-MM-DD")
    });
  };

  //Date Piker 2

  onDOBPress1 = () => {
    let dobDate = this.state.dobDate1;
    if (!dobDate || dobDate == null) {
      dobDate = new Date();
      this.setState({
        dobDate1: dobDate
      });
    }
    this.refs.dobDialog1.open({
      date: dobDate,
      maxDate: new Date() //To restirct past dates
    });
  };

  onDOBDatePicked1 = date => {
    this.setState({
      dobDate1: date,
      dobText1: moment(date).format("YYYY-MM-DD")
    });
  };

  // //Time Picker
  // _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
  // _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
  // _handleDatePicked = (dataSource.data.visitorlogbydate.vlEntryT[0]) => {
  //   this.setState({
  //     datetime: moment(
  //       responseJson.data.visitorlogbydate.vlEntryT.substring(11, 16)
  //     ).format("HH:mm:ss a")
  //   });
  // };

  searchFilterFunction = text => {
    this.setState({
      value: text
    });

    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.vlfName.toUpperCase()} ${item.vlComName.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      dataSource: newData
    });
  };

  componentDidMount() {
    this.myVisitorsGetList();
    setTimeout(() => {
      this.setState({
        isLoading: false
      });
    }, 5000);
    console.log("Association Id", this.props.dashBoardReducer.assId);
  }
  myVisitorsGetList = () => {
    this.setState({
      isLoading:true
    })
    console.log("Dates are -",this.state.dobDate, this.state.dobDate1)
    //moment(new Date()).format("YYYY-MM-DD")
    if (moment(this.state.dobDate).format("YYYY-MM-DD") > moment(this.state.dobDate1).format("YYYY-MM-DD")) {
      Alert.alert("From Date should be less than To Date.");
      this.setState({
        isLoading:false
      })
      return false;
    } else {
      //http://apiuat.oyespace.com/oyesafe/api/v1/VisitorLog/GetVisitorLogByDatesAssocAndUnitID
      fetch(
          `http://${
              this.props.oyeURL
          }/oyesafe/api/v1/VisitorLog/GetVisitorLogByDatesAssocAndUnitID`,

          {
            method: "POST",
            headers: {
              "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              StartDate: this.state.dobText,
              EndDate: this.state.dobText1,
              ASAssnID: this.props.dashBoardReducer.assId,
              UNUnitID : this.props.dashBoardReducer.uniID
            })
          }
      )
          .then(response => response.json())
          .then(responseJson => {
            //var count = Object.keys(responseJson.data.visitorlogbydate).length;
            //console.log("fsbkfh", count);
            console.log(
                responseJson,
                "*******************************************"
            );
            this.setState({
              isLoading: false,
              dataSource: responseJson.data.visitorlog.filter(x => x.vlVisType === "Delivery"),
              error: responseJson.error || null,
              loading: false,
              dobDate: null,
              dobDate1: null
            });
            this.arrayholder = responseJson.data.visitorlog;
          })

          .catch(error => {
            this.setState({ error, loading: false });
            console.log(error, "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
          });
    }
  };

  renderItem = ({ item }) => {
    console.log(item);
    // const time = item.vlEntryT;
    // const entertiming = time.subString();
    // console.log(entertiming);
    return (
        <View style={styles.tableView}>
          <View style={styles.lineForCellView} />
          <View style={styles.cellView}>
            <View style={styles.containerImageView}>
              {item.vlEntryImg == "" ? (
                  <ZoomImage
                      source={require("../../../icons/placeholderImg.png")}
                      imgStyle={{
                        height: wp("20%"),
                        width: wp("20%"),
                        borderRadius: wp("20%") / 2,
                        borderColor: "orange",
                        borderWidth: hp("0.1%")
                      }}
                      //style={styles.mainCardItemImage}
                      //style={styles.dummyImageForProfile}
                      duration={300}
                      enableScaling={true}
                      easingFunc={Easing.bounce}
                  />
              ) : (
                  // <Image
                  //   style={styles.dummyImageForProfile}
                  //   source={require("./src/components/images/profile_img@png.png")}
                  // />
                  <ZoomImage
                      source={{
                        uri:
                            `${this.props.mediaupload}` + item.vlEntryImg
                      }}
                      imgStyle={{
                        height: wp("20%"),
                        width: wp("20%"),
                        borderRadius: wp("20%") / 2,
                        borderColor: "orange",
                        borderWidth: hp("0.1%")
                      }}
                      //style={styles.mainCardItemImage}
                      duration={300}
                      enableScaling={true}
                      easingFunc={Easing.bounce}
                  />
                  // <Image
                  //   style={styles.mainCardItemImage}
                  //   source={{
                  //     uri:
                  //       `${this.props.mediaupload}` + item.vlEntryImg
                  //   }}

                  // />
              )}
            </View>
            <View style={styles.textViewContainer}>
              <Text style={styles.nameTextStyle}>
                {item.vlfName}
                {/* {this.state.dataSource[0].vlfName} */}
              </Text>
              <View style={styles.viewTextStyle}>
                <Image
                    style={styles.viewImageStyle}
                    source={require("../../../icons/user.png")}
                />
                <Text style={styles.subNameTextStyleOne}>{item.vlComName} </Text>
              </View>
              <View style={styles.viewTextStyle}>
                <Image
                    style={styles.viewImageStyle}
                    source={require("../../../icons/entry_time.png")}
                />
                {/* <Text style={styles.subNameTextStyleTwo}>
                Entry: {item.vlEntryT.substring(5, 10)},
                {item.vlEntryT.substring(11, 16)} Exit:{" "}
                {item.vlExitT.substring(5, 10)},{item.vlExitT.substring(11, 16)}
                </Text>  */}
                {/* <Text style={styles.subNameTextStyleTwo}>
                Entry:
                {item.vlEntryT.substring(11, 16)} Exit:{" "}
                {item.vlExitT.substring(11, 16)}
              </Text> */}

                <Text style={styles.subNameTextStyleTwo}>
                  Entry:
                  {item.vlEntryT.substring(11, 19)}
                </Text>
                <Image
                    style={styles.viewImageStyle}
                    source={require("../../../icons/entry_time.png")}
                />
                <Text style={styles.subNameTextStyleTwo}>
                  Exit: {item.vlExitT.substring(11, 19)}
                </Text>
                {/* {moment(newDate(item.vlExitT.substring(11, 16))).format(
                "HH:mm:ss a"
              )} */}
                {/* {moment(
              newDate({item.vlExitT.substring(11, 16)}, "Hmm")).format("hh:mm")} */}
                {/* datetime: moment(new Date()).format("HH:mm:ss a") */}
              </View>
            </View>
            <View style={styles.cellEndIcons}>
              <Card>
                <TouchableOpacity
                    onPress={() => {
                      {
                        Platform.OS === "android"
                            ? Linking.openURL(`tel:${item.vlMobile}`)
                            : Linking.openURL(`telprompt:${item.vlMobile}`);
                      }
                    }}
                >
                  <View
                      style={{
                        width: hp("5.5%"),
                        height: hp("5.5%"),
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                  >
                    <Image
                        style={styles.smallCardItemImage}
                        source={require("../../../icons/call.png")}
                    />
                  </View>
                </TouchableOpacity>
              </Card>
            </View>
          </View>
          <View style={styles.lineForCellView} />
        </View>
    );
  };
  render() {
    console.log("View All Visitor", this.props.dashBoardReducer.assId);
    if (this.state.isLoading) {
      return (
          <View style={styles.container}>
            {/* <Header /> */}
            {/* <SafeAreaView style={{ backgroundColor: "orange" }}>
              <View style={[styles.viewStyle1, { flexDirection: "row" }]}>
                <View style={styles.viewDetails1}>
                  <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.goBack();
                      }}
                  >
                    <View
                        style={{
                          height: hp("4%"),
                          width: wp("15%"),
                          alignItems: "flex-start",
                          justifyContent: "center"
                        }}
                    >
                      <Image
                          resizeMode="contain"
                          source={require("../../../icons/back.png")}
                          style={styles.viewDetails2}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                >
                  <Image
                      style={[styles.image1]}
                      source={require("../../../icons/headerLogo.png")}
                  />
                </View>
                <View style={{ flex: 0.2 }}>
                </View>
              </View>
              <View style={{ borderWidth: 1, borderColor: "orange" }} />
            </SafeAreaView> */}

            <Text style={styles.titleOfScreen}>Visitors</Text>

            {/* <TextInput
            //source={require("./src/components/images/call.png")}
            style={styles.textinput}
            placeholder="Search by Name...."
            // lightTheme
            round
            onChangeText={this.searchFilterFunction}
          /> */}

            <Form>
              <Item style={styles.inputItem}>
                <Input
                    marginBottom={hp("-1%")}
                    placeholder="Search...."
                    multiline={false}
                    onChangeText={this.searchFilterFunction}
                />
                <Icon style={{ color: "orange" }} name="search" size={14} />
              </Item>
            </Form>

            <View style={styles.datePickerButtonView}>
              <View
                  style={{
                    flex: 0.8,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginLeft: hp("-1%")
                  }}
              >
                <View>
                  <Text style={{ color: "#38BCDB" }}>From</Text>
                </View>
                {/* <View style={{ borderColor: "black", borderWidth: hp("0.05%") }}> */}
                <TouchableOpacity onPress={this.onDOBPress.bind(this)}>
                  <View style={styles.datePickerBox}>
                    <Text style={styles.datePickerText}>
                      {this.state.dobText}{" "}
                    </Text>
                    <DatePickerDialog
                        ref="dobDialog"
                        onDatePicked={this.onDOBDatePicked.bind(this)}
                    />

                    <TouchableOpacity onPress={this.onDOBPress.bind(this)}>
                      <Image
                          style={[styles.viewDatePickerImageStyle]}
                          source={require("../../../icons/calender.png")}
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {/* </View> */}
                <View>
                  <Text style={{ color: "#38BCDB" }}> To </Text>
                </View>
                {/* <View style={{ borderColor: "black", borderWidth: hp("0.05%") }}> */}
                <TouchableOpacity onPress={this.onDOBPress1.bind(this)}>
                  <View style={styles.datePickerBox}>
                    <Text style={styles.datePickerText}>
                      {this.state.dobText1}
                    </Text>
                    <DatePickerDialog
                        ref="dobDialog1"
                        onDatePicked={this.onDOBDatePicked1.bind(this)}
                    />
                    <TouchableOpacity onPress={this.onDOBPress1.bind(this)}>
                      <Image
                          style={styles.viewDatePickerImageStyle}
                          source={require("../../../icons/calender.png")}
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {/* </View> */}
              </View>

              <View
                  style={{
                    flex: 0.2,

                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    marginRight: hp("-1.5%")
                  }}
              >
                <Button
                    bordered
                    warning
                    style={[styles.buttonUpdateStyle, { justifyContent: "center" }]}
                    onPress={() => this.myVisitorsGetList()}
                >
                  <Text
                      style={{
                        color: "white",
                        fontWeight: "600",
                        fontSize: hp("1.6%")
                      }}
                  >
                    Get
                  </Text>
                </Button>
              </View>
            </View>

            <View style={styles.progress}>
              <ActivityIndicator size="large" color="#01CBC6" />
            </View>
          </View>
      );
    }
    console.log(this.state.dataSource, "*******************************");
    console.log("ekjfhkwrghj");
    return (
        <View style={styles.mainView}>
          {/* <Header /> */}
          {/* <SafeAreaView style={{ backgroundColor: "orange" }}>
            <View style={[styles.viewStyle1, { flexDirection: "row" }]}>
              <View style={styles.viewDetails1}>
                <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.goBack();
                    }}
                >
                  <View
                      style={{
                        height: hp("4%"),
                        width: wp("15%"),
                        alignItems: "flex-start",
                        justifyContent: "center"
                      }}
                  >
                    <Image
                        resizeMode="contain"
                        source={require("../../../icons/back.png")}
                        style={styles.viewDetails2}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
              >
                <Image
                    style={[styles.image1]}
                    source={require("../../../icons/headerLogo.png")}
                />
              </View>
              <View style={{ flex: 0.2 }}>
              </View>
            </View>
            <View style={{ borderWidth: 1, borderColor: "orange" }} />
          </SafeAreaView> */}

          <View style={styles.textWrapper}>
            <Text style={styles.titleOfScreen}> Visitors </Text>

            {/* <TextInput
            //source={require("./src/components/images/call.png")}
            style={styles.textinput}
            placeholder="Search by Name...."
            // lightTheme
            round
            onChangeText={this.searchFilterFunction}
          /> */}

            <Form>
              <Item style={styles.inputItem}>
                <Input
                    marginBottom={hp("-1%")}
                    placeholder="Search...."
                    multiline={false}
                    onChangeText={this.searchFilterFunction}
                />
                <Icon style={{ color: "orange" }} name="search" size={14} />
              </Item>
            </Form>

            <View style={styles.datePickerButtonView}>
              <View
                  style={{
                    flex: 0.8,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginLeft: hp("-1%")
                  }}
              >
                <View>
                  <Text style={{ color: "#38BCDB" }}>From</Text>
                </View>
                {/* <View style={{ borderColor: "black", borderWidth: hp("0.05%") }}> */}
                <TouchableOpacity onPress={this.onDOBPress.bind(this)}>
                  <View style={styles.datePickerBox}>
                    <Text style={styles.datePickerText}>
                      {this.state.dobText}{" "}
                    </Text>
                    <DatePickerDialog
                        ref="dobDialog"
                        onDatePicked={this.onDOBDatePicked.bind(this)}
                    />

                    <TouchableOpacity onPress={this.onDOBPress.bind(this)}>
                      <Image
                          style={[styles.viewDatePickerImageStyle]}
                          source={require("../../../icons/calender.png")}
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {/* </View> */}
                <View>
                  <Text style={{ color: "#38BCDB" }}> To </Text>
                </View>
                {/* <View style={{ borderColor: "black", borderWidth: hp("0.05%") }}> */}
                <TouchableOpacity onPress={this.onDOBPress1.bind(this)}>
                  <View style={styles.datePickerBox}>
                    <Text style={styles.datePickerText}>
                      {this.state.dobText1}
                    </Text>
                    <DatePickerDialog
                        ref="dobDialog1"
                        onDatePicked={this.onDOBDatePicked1.bind(this)}
                    />
                    <TouchableOpacity onPress={this.onDOBPress1.bind(this)}>
                      <Image
                          style={styles.viewDatePickerImageStyle}
                          source={require("../../../icons/calender.png")}
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {/* </View> */}
              </View>

              <View
                  style={{
                    flex: 0.2,

                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    marginRight: hp("-1.5%")
                  }}
              >
                <Button
                    bordered
                    warning
                    style={[styles.buttonUpdateStyle, { justifyContent: "center" }]}
                    onPress={() => this.myVisitorsGetList()}
                >
                  <Text
                      style={{
                        color: "white",
                        fontWeight: "600",
                        fontSize: hp("2%")
                      }}
                  >
                    Get
                  </Text>
                </Button>
              </View>
            </View>

            {/* <TouchableOpacity onPress={this._showDateTimePicker}>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            mode="time"
            is24Hour={false}
            onCancel={this._hideDateTimePicker}
          />
          <View style={styles.datePickerBox}>
            <Text style={styles.subtext1}>{this.state.datetime}</Text>
          </View>
        </TouchableOpacity> */}
            {this.state.dataSource.length == 0 ? (
                <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "white"
                    }}
                >
                  <Text
                      style={{
                        backgroundColor: "white",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: hp("2%")
                      }}
                  >
                    No Entries for selected Date
                  </Text>
                  {/* <Text
                style={{
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: hp("2%")
                }}
              >
                Choose other date please.
              </Text> */}
                </View>
            ) : (
                <FlatList
                    style={{ marginTop: hp("2%") }}
                    data={this.state.dataSource.sort((a, b) =>
                        a.vlfName.localeCompare(b.vlfName)
                    )}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => item.fmid.toString()}
                />
            )}
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  textWrapper: {
    height: hp("85%"),
    width: wp("100%")
  },
  datePickerButtonView: {
    marginTop: hp("1.5%"),
    flexDirection: "row",
    justifyContent: "flex-end",
    justifyContent: "space-around",
    marginHorizontal: hp("2%")
  },
  container: {
    flex: 1,
    //backgroundColor: "#fff",
    flexDirection: "column"
  },
  progress: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  mainView: {
    flex: 1
  },
  titleOfScreen: {
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
    textAlign: "center",
    fontSize: hp("3%"),
    fontWeight: "500",
    color: "#FF8C00"
  },
  tableView: {
    flexDirection: "column"
  },
  lineForCellView: {
    backgroundColor: "lightgray",
    height: hp("0.1%")
  },
  cellView: {
    flexDirection: "row",
    paddingRight: 0,
    paddingLeft: hp("0.2"),
    paddingTop: hp("0.8%"),
    marginBottom: hp("0.8%"),
    justifyContent: "space-between"
  },
  containerImageView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
    //margin: 5
  },
  mainCardItemImage: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderColor: "orange",
    borderWidth: hp("0.1%")
  },
  dummyImageForProfile: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderColor: "orange",
    borderWidth: hp("0.1%")
  },
  textViewContainer: {
    flex: 3,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center"
  },
  viewTextStyle: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: hp("1.3%")
  },
  viewImageStyle: {
    flexDirection: "row",
    width: hp("2%"),
    height: hp("2%")
  },
  viewDatePickerImageStyle: {
    width: wp("3%"),
    height: hp("2.2%"),
    marginRight: hp("0.5%")
  },
  cellEndIcons: {
    flex: 0.6,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    flexDirection: "column",
    paddingTop: hp("0.3%")
  },
  smallCardItemImage: {
    width: hp("2.8%"),
    height: hp("2.8%")
  },
  nameTextStyle: {
    padding: hp("0.5%"),
    fontSize: hp("2%"),
    fontWeight: "600"
  },
  subNameTextStyleOne: {
    padding: hp("0.5%"),
    fontSize: hp("1.7%"),
    color: "#909091"
  },
  subNameTextStyleTwo: {
    padding: hp("0.5%"),
    fontSize: hp("1.7%"),
    color: "#909091"
  },
  textinput: {
    height: hp("5%"),
    borderWidth: hp("0.2%"),
    borderRadius: hp("3%"),
    borderColor: "#f4f4f4",
    marginHorizontal: hp("1.2%"),
    paddingLeft: hp("3%"),
    fontSize: hp("1.8%"),
    backgroundColor: "#f4f4f4"
  },
  datePickerBox: {
    margin: hp("1.0%"),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: hp("0.2%"),
    height: hp("4%"),
    borderColor: "#bfbfbf",
    padding: 0
  },

  datePickerText: {
    fontSize: hp("1.5%"),
    marginLeft: 5,
    marginRight: 5,
    color: "#474749"
  },

  buttonUpdateStyle: {
    width: wp("16%"),
    borderRadius: hp("3%"),
    borderWidth: wp("2%"),
    height: hp("5%"),
    marginRight: hp("1%"),
    backgroundColor: "orange",
    borderColor: "orange"
  },
  inputItem: {
    marginTop: wp("1%"),
    marginLeft: wp("4%"),
    marginRight: wp("4%"),
    //borderColor: "#909091"
    borderColor: "#000000"
  },
  viewStyle1: {
    backgroundColor: "#fff",
    height: hp("7%"),
    width: Dimensions.get("screen").width,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: "relative"
  },
  image1: {
    width: wp("22%"),
    height: hp("12%")
  },

  viewDetails1: {
    flex: 0.3,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 3
  },
  viewDetails2: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: hp("3%"),
    height: hp("3%"),
    marginTop: 5
    // marginLeft: 10
  }
});

const mapStateToProps = state => {
  return {
    dashBoardReducer: state.DashboardReducer,
    oyeURL: state.OyespaceReducer.oyeURL,
    mediaupload:state.OyespaceReducer.mediaupload,
  };
};

export default connect(mapStateToProps)(App);