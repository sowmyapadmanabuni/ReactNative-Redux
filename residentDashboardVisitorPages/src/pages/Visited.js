import React, { Component } from "react";
import {
  Platform,
  AppRegistry,
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  TextInput,
  Keyboard,
  Alert,
  ActivityIndicator
} from "react-native";
// import Header from "./src/components/common/Header";
import { NavigationEvents } from "react-navigation";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { connect } from "react-redux";
import DateTimePicker from "react-native-modal-datetime-picker";
import { DatePickerDialog } from "react-native-datepicker-dialog";
import { Card, CardItem, Form, Item, Input, Icon, Button } from "native-base"
import moment from "moment";
import Collapsible from "react-native-collapsible";

let dt = new Date();
dt.setDate(dt.getDate());
let _dt = dt;

class MyGuests extends Component {
  static navigationOptions = {
    title: "My Guests",
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      ImageSource: null,

      loading: false,
      error: null,

      datetime: moment(new Date()).format("HH:mm:ss a"),

      //date picker
      dobText: moment(_dt).format('YYYY-MM-DD'), //year + '-' + month + '-' + date,
      dobDate: _dt,
      isDateTimePickerVisible: false,

      dobText1: moment(_dt).format('YYYY-MM-DD'),
      dobDate1: _dt,
      isDateTimePickerVisible1: false,

      open: false
    };
    this.arrayholder = [];
  }
  componentDidMount() {
    let self = this;
    let newDataSource = [];
    this.state.dataSource.map((data) => {
      newDataSource.push({ ...data, open: false })
    })
    setTimeout(() => {
      self.getInvitationList();
      self.setState({
        isLoading: false,
        dataSource: newDataSource
      });
    }, 2500);
  }

  getInvitationList = () => {
    console.log("Visitighfghfghfg@@@@@@@@@", this.props.dashBoardReducer.assId, this.props.dashBoardReducer.uniID, this.props.userReducer.MyAccountID);
    fetch(
      `http://${this.props.oyeURL}/oye247/api/v1/GetInvitationListByAssocIDAndIsQRCodeGenerated`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
        },
        body: JSON.stringify({
          ASAssnID: this.props.dashBoardReducer.assId,
          INInvVis: "Visited",
          UNUnitID: this.props.dashBoardReducer.uniID,
          ACAccntID: this.props.userReducer.MyAccountID,
          StartDate: this.state.dobText,
          ToDate: this.state.dobText1
        })
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log("Visitighfghfghfg@@@@@@@@@", responseJson, this.props.userReducer.SelectedAssociationID, this.props.dashBoardReducer.uniID, this.props.userReducer.MyAccountID);
        this.setState({
          isLoading: false,
          dataSource: responseJson.data.invitation,
          error: responseJson.error || null,
          loading: false
        });
        this.arrayholder = responseJson.data.invitation;
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  searchFilterFunction = text => {
    this.setState({
      value: text
    });

    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.vlfName.toUpperCase()} ${item.vllName.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      dataSource: newData
    });
  };


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
    console.log("Date Piceked !:", date)

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
    console.log("Date Piceked !:", date)
    this.setState({
      dobDate1: date,
      dobText1: moment(date).format("YYYY-MM-DD")
    });
  };


  toggleCollapsible = (index, value) => {
    let data = [...this.state.dataSource]

    data[index].open = !value

    this.setState({ dataSource: data })
  }

  renderItem = ({ item, index }) => {
    console.log("List in visited ", item, index)
    return (
      <View style={{ flexDirection: 'column', marginBottom: index === this.state.dataSource.length - 1 ? 80 : 0 }}>
        <View style={{ borderColor: "#707070", borderWidth: wp("0.1%") }} />

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: hp('1.6%'), marginLeft: hp('1%'), marginTop: hp('1%') }}>Unit - {this.props.dashBoardReducer.selectedDropdown1}</Text>
          </View>
          <View style={{}}>
            <Text style={{ color: '#ff8c00', fontSize: hp('1.6%'), marginRight: hp('1%'), marginTop: hp('1%') }}>{moment(item.vldCreated, "YYYY-MM-DD").format("DD-MM-YYYY")}</Text>
          </View>
        </View>

        <View
          style={[
            styles.listItem,
            {
              justifyContent: "space-between",
              paddingRight: 0
            }
          ]}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.contactIcon}>
              {item.vlfName[0].toUpperCase()}
            </Text>
          </View>
          <TouchableOpacity onPress={() => this.toggleCollapsible(index, item.open)}>
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                {item.vlfName} {item.vllName}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flexDirection: 'row' }}>
                  <Image source={require('../../../icons/phone.png')} style={{ width: hp('1.5%'), height: hp('1.5%') }} />
                  <Text>{"  "}</Text>
                </View>
                <Text style={styles.infoNumber}>{item.vlMobile}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Image source={require('../../../icons/datetime.png')} style={{ width: hp('1.5%'), height: hp('1.5%') }} />
                <Text>{"  "}</Text>
                <View>
                  <Text style={{ fontSize: hp('1.2%') }}>Entry Date: {moment(item.vldCreated, "YYYY-MM-DD").format("DD-MM-YYYY")}{" "}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: hp('1.2%') }}>Entry Time: {item.vlEntryT.substring(11, 16)}</Text>
                </View>

              </View>


              {item.vlExitT === '0001-01-01T00:00:00'  ?
                <View style={{ flexDirection: 'row' }}>
                  <Image source={require('../../../icons/datetime.png')} style={{ width: hp('1.5%'), height: hp('1.5%') }} />
                  <Text>{"  "}</Text>
                  <Text style={{ fontSize: hp('1.2%') }}>Exit Date: N.A.{"  "}</Text>
                  <Text style={{ fontSize: hp('1.2%') }}>Exit Time: N.A.</Text>
                </View>
                :
                <View style={{ flexDirection: 'row' }}>
                  <Image source={require('../../../icons/datetime.png')} style={{ width: hp('1.5%'), height: hp('1.5%') }} />
                  <Text>{"  "}</Text>
                  <Text style={{ fontSize: hp('1.2%') }}>Exit Date: {moment(item.vldUpdated, "YYYY-MM-DD").format("DD-MM-YYYY")}{"  "}</Text>
                  <Text style={{ fontSize: hp('1.2%') }}>Exit Time: {item.vlExitT.substring(11, 16)}</Text>
                </View>
              }
              <View style={{ flexDirection: 'row' }}>
                <Image source={require('../../../icons/location.png')} style={{ width: hp('2%'), height: hp('2%') }} />
                <Text>{" "}</Text>
                <Text style={{ fontSize: hp('1.2%') }}>Entry Gate: {item.vlengName}{"  "}</Text>
                {item.vlexgName === "" ? <View></View> :
                  <View>
                    <Text style={{ fontSize: hp('1.2%') }}>Exit Gate: {item.vlexgName}</Text>
                  </View>
                }

              </View>
              {/* {item.open ?
                  <View></View> :

                  <View style={{ marginTop: hp('1%') }}>
                    <View style={{ borderBottomWidth: hp('0.1%'), borderBottomColor: '#474749', width: hp('5%'), justifyContent: 'center', alignSelf: 'center' }}>

                    </View>
                  </View>
                } */}
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: "flex-end", paddingRight: 0 }}>
            <Card style={{ marginTop: 0 }}>
              <TouchableOpacity
                onPress={() => {
                  {
                    Platform.OS === "android"
                      ? Linking.openURL(`tel:${item.vlMobile}`)
                      : Linking.openURL(`telprompt:${item.vlMobile}`);
                  }
                }}
              >
                <CardItem bordered>
                  <Image
                    style={styles.images}
                    source={require("../icons/phone.png")}
                  />
                </CardItem>
              </TouchableOpacity>
            </Card>
          </View>
        </View>

        <Collapsible
          duration={100}
          collapsed={!item.open}>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row', marginBottom: hp('0.5%') }}>
              <Text style={{ fontSize: hp('1.6%'), marginLeft: hp('1%') }}>Visited On: <Text style={{ color: '#38bcdb' }}>{moment(item.vldCreated, "YYYY-MM-DD").format("DD-MM-YYYY")}</Text>{" "}</Text>
              <Text style={{ fontSize: hp('1.6%'), marginLeft: hp('1%'), color: '#38bcdb' }}>{item.vlEntryT.substring(11, 16)}</Text>
            </View>
            <View>
              <Text style={{ fontSize: hp('1.6%'), marginLeft: hp('1%'), marginBottom: hp('0.5%') }}>Purpose of Visit: {item.vlpOfVis}</Text>
            </View>
            <View>
              <Text style={{ fontSize: hp('1.6%'), marginLeft: hp('1%'), marginBottom: hp('0.5%') }}>Total Guests: {item.vlVisCnt}</Text>
            </View>

            {!item.open ?
              <View></View> :

              <View style={{ marginBottom: hp('1%'), marginTop: hp('1%') }}>
                <View style={{ borderBottomWidth: hp('0.1%'), borderBottomColor: '#474749', width: hp('5%'), justifyContent: 'center', alignSelf: 'center', marginLeft: hp('3%') }}>

                </View>
              </View>
            }
          </View>
        </Collapsible>
        <View style={{ borderColor: "#707070", borderWidth: wp("0.1%") }} />
      </View>
    );
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.contaianer}>
          {/* <Header /> */}

          {/* <Text style={styles.titleOfScreen}>My Guests</Text> */}

          <View style={styles.progress}>
            <ActivityIndicator size="large" color="#F3B431" />
          </View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, marginTop: hp('1%') }}>
        {/* <Header /> */}
        <NavigationEvents
          onDidFocus={payload => this.getInvitationList()}
          onWillBlur={payload => this.getInvitationList()}
        />
        {/* <Text style={styles.titleOfScreen}> My Guests </Text> */}

        <Form style={styles.formSearch}>
          <Item style={styles.inputItem}>
            <Input
              marginBottom={hp("-1%")}
              placeholder="Search...."
              multiline={false}
              onChangeText={this.searchFilterFunction}
            />

            <Icon style={styles.icon} name="search" size={14} />
          </Item>
        </Form>

        {/* <TextInput
          style={styles.textinput}
          placeholder="search...."
          // lightTheme
          round
          onChangeText={this.searchFilterFunction}
        /> */}

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
                  {moment(this.state.dobText).format("YYYY-MM-DD")}{" "}
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
                  {moment(this.state.dobText1).format("YYYY-MM-DD")}
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
            onPress={() => this.getInvitationList()}
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

        {this.state.dataSource.length === 0 ?
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}   >
            <Text style={{ backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', fontSize: hp('1.8%') }}>No Data Available.</Text>
          </View>
          :
          <FlatList
            style={{ marginTop: hp('1.5%') }}
            data={this.state.dataSource.sort((a, b) =>
              a.vlfName.localeCompare(b.vlfName)
            )}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.vlVisLgID.toString()}
          />
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  contaianer: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column"
  },
  progress: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  textinput: {
    height: hp("6%"),
    borderWidth: hp("0.1%"),
    borderColor: "#fff",
    marginHorizontal: hp("1%"),
    paddingLeft: hp("2%"),
    marginTop: hp("0.5%"),
    fontSize: hp("2.2%"),
    backgroundColor: "#f4f4f4",
    borderRadius: hp("4%")
  },
  datePickerButtonView: {
    marginTop: hp("1.5%"),
    flexDirection: "row",
    justifyContent: "flex-end",
    justifyContent: "space-around",
    marginHorizontal: hp("2%")
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
  viewDatePickerImageStyle: {
    width: wp("3%"),
    height: hp("2.2%"),
    marginRight: hp("0.5%")
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
  listItem: {
    flexDirection: "row",
    paddingLeft: hp("1.6%"),
    paddingRight: hp("1.6%"),
    paddingBottom: hp("2%"),
    paddingTop: hp("1%")
  },
  iconContainer: {
    width: hp("6.5%"),
    height: hp("6.5%"),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff8c00",
    borderRadius: 100,
  },
  contactIcon: {
    fontSize: hp("3.5%"),
    color: "#fff"
  },
  infoContainer: {
    flexDirection: "column",
    paddingLeft: hp("1.6%"),
  },
  infoText: {
    fontSize: hp("2.2%"),
    fontWeight: "bold",
    color: "#000",
    marginBottom: hp('0.5%')
  },
  infoNumber: {
    fontSize: hp("1.6%"),
    fontWeight: "100",
    color: "grey",
    marginBottom: hp('0.5%')
  },

  titleOfScreen: {
    marginTop: hp("1.5%"),
    textAlign: "center",
    fontSize: hp("2.4%"),
    fontWeight: "bold",
    marginBottom: hp("1.5%"),
    color: "#ff8c00"
  },

  floatButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0)",
    alignItems: "center",
    justifyContent: "center",
    width: hp("8%"),
    position: "absolute",
    bottom: hp("2.5%"),
    right: hp("2.5%"),
    height: hp("8%"),
    backgroundColor: "#FF8C00",
    borderRadius: 100,
    // shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 3,
    shadowOpacity: 0.6
  },
  images: {
    width: hp("1.6%"),
    height: hp("1.6%"),
    justifyContent: "center",
    alignItems: "center"
  },
  inputItem: {
    marginTop: wp("1%"),
    marginLeft: wp("4%"),
    marginRight: wp("4%"),
    //borderColor: "#909091"
    borderColor: "#000000"
  },
  formSearch: {
    marginBottom: hp("1%")
  },
  icon: {
    color: "orange"
  }
});

const mapStateToProps = state => {
  return {
    approvedAdmins: state.AppReducer.approvedAdmins,
    champBaseURL: state.OyespaceReducer.champBaseURL,
    oyeURL: state.OyespaceReducer.oyeURL,
    MyAccountID: state.UserReducer.MyAccountID,
    dashBoardReducer: state.DashboardReducer,
    mediaupload: state.OyespaceReducer.mediaupload,
    userReducer: state.UserReducer
  };
};

export default connect(
  mapStateToProps,
)(MyGuests);