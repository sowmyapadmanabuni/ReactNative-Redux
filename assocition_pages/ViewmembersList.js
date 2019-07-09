import React, { Component } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  FlatList,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Alert
} from "react-native";
import {
  Card,
  CardItem,
  Container,
  Left,
  Body,
  Right,
  Title,
  Row,
  Button
} from "native-base";
import { TextInput } from "react-native-gesture-handler";
import { NavigationEvents } from "react-navigation";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { Dropdown } from "react-native-material-dropdown";
import { connect } from "react-redux";
import axios from "axios";
import _ from "lodash";
import { getDashUnits } from "../src/actions";

let data = [
  {
    value: "Admin",
    id: 1
  },
  {
    value: "Owner",
    id: 2
  }
];

var data1 = [];
var test = [];
let without = [];
const role = [];

class Resident extends Component {
  state = {
    fulldata: [],
    query: "",
    residentList: [],
    dataSource: [],
    selectedRoleData: 0,
    units: [],
    memberList: [],
    loading: true
  };

  static navigationOptions = {
    title: "resident",
    header: null
  };

  residentialListGetMethod = () => {};

  componentDidMount = () => {};

  changeRole = () => {
    console.log("myunit",this.state.selectedRoleData.selRolId)
    console.log("idddd",this.props.SelectedMemberID)
    const {
      getDashUnits,
      // selectedAssociation,
      selectedAssociationIndex,
      associationid,
      notifications
    } = this.props;
    const { MyAccountID, SelectedAssociationID } = this.props.userReducer;
   
    // const { oyeURL } = this.props.oyespaceReducer;
    //http://localhost:54400/oyeliving/api/v1/MemberRoleChangeToAdminOwnerUpdate
    //http://localhost:54400/oyeliving/api/v1/MemberRoleChangeToOwnerToAdminUpdate
    // const url = `http://${
    //   this.props.oyeURL
    // }/oyeliving/api/v1/MemberRoleChangeToOwnerToAdminUpdate`;

    const url = `http://${
      this.props.oyeURL
    }/oyeliving/api/v1/MemberRoleChangeToOwnerToAdminUpdate`;

    //  console.log("values", {
    //    ACMobile: this.state
    //      .selectedRoleData.uoMobile,
    //    UNUnitID: this.state
    //      .selectedRoleData.unitid,
    //    // MRMRoleID: this.state.selectedRoleData.selRolId
    //    // global.MyOYEMemberID
    //    MRMRoleID: this.state
    //      .selectedRoleData.selRolId,
    //    MEMemID: this.props
    //      .SelectedMemberID
    //  });

    requestBody = {
      ACMobile: this.state.selectedRoleData.uoMobile,
      UNUnitID: this.state.selectedRoleData.unitid,
      MRMRoleID: this.state.selectedRoleData.selRolId
      // global.MyOYEMemberID
      // MRMRoleID: this.state.selectedRoleData.selRolId,
      // MEMemID: this.props.SelectedMemberID
    };

    fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => response.json())

      .then(responseJson => {
        console.log("%%%%%%%%%%", responseJson);
        getDashUnits(
          associationid[selectedAssociationIndex].id,
          this.props.oyeURL,
          notifications,
          MyAccountID
        );
        this.props.navigation.goBack();
      })
      .catch(error => {
        console.log("err " + error);
        Alert.alert("No Data for Selected");
      });
  };

  selectRole = (item, index) => {
    let sortedList = this.state.residentList.sort((a, b) =>
      a.unit.localeCompare(b.unit)
    );
    // console.log(sortedList)
    return (
      <Dropdown
        label="Select Role"
        value={data.value}
        data={data}
        containerStyle={20}
        onChangeText={(val, vals) => {
          // console.log(val, vals)
          let currSel = sortedList[index];
          let value = {
            ...currSel,
            selRolId: (vals = vals + 1),
            selRolName: val
          };
          this.setState({ selectedRoleData: value });
          // console.log("mobie",this.state.selectedRoleData.uoMobile)
        }}
      />
    );
  };

  handleSearch = text => {
    const { residentList } = this.state;
    const { params } = this.props.navigation.state;
    this.setState({ query: text });

    let sortResident = params.data;

    this.setState({
      residentList: [
        ...sortResident.filter(
          item =>
            item.unit.toUpperCase().includes(text.toUpperCase()) ||
            item.name.toUpperCase().includes(text.toUpperCase())
        )
      ]
    });
  };

  renderAdminStatus = item => {
    console.log(item);
    if (item.uoRoleID === 1) {
      return <Text> Admin</Text>;
    } else return null;
  };

  render() {
    console.log("$$$$$$$$$$#%#%@#%#^$#^&%&%^&%^*^%*%^&$%^$", this.props.oyeURL);
    const { params } = this.props.navigation.state;
    // console.log(params)
    // console.log(this.props.associationid)
    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <NavigationEvents
          onDidFocus={payload => {
            residentList = params.data;
            this.setState({
              residentList: residentList.sort((a, b) =>
                a.unit.localeCompare(b.unit)
              )
            });
            residentList.sort((a, b) => a.unit.localeCompare(b.unit));
            this.setState({ units: residentList });
          }}
        />
        <SafeAreaView style={{ backgroundColor: "orange" }}>
          <View style={[styles.viewStyle1, { flexDirection: "row" }]}>
            <View style={styles.viewDetails1}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("ResDashBoard");
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
                    source={require("../icons/back.png")}
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
                source={require("../icons/OyeSpace.png")}
              />
            </View>
            <View style={{ flex: 0.2 }}>
              {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
            </View>
          </View>
          <View style={{ borderWidth: 1, borderColor: "orange" }} />
        </SafeAreaView>
        
        <View style={styles.textWrapper}>
          <Text style={styles.residentialListTitle}> Resident List </Text>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{ flex: 0.8, height: hp("5.5%"), marginStart: hp("2%") }}
            >
              <TextInput
                style={styles.viewDetails3}
                placeholder="  search...."
                round
                autoCapitalize="characters"
                onChangeText={this.handleSearch}
              />
            </View>
            <View
              style={{ flex: 0.3, height: hp("5.5%"), alignItems: "flex-end" }}
            >
              <View style={{ alignItems: "flex-end", marginEnd: hp("2%") }}>
                {this.state.selectedRoleData.selRolId == 1 ||
                this.state.selectedRoleData.selRolId == 2 ? (
                  <Button
                    rounded
                    warning
                    style={{ height: hp("5.5%"), width: wp("19%") }}
                    onPress={() => {
                      this.changeRole();
                    }}
                  >
                    <Text style={{ color: "white", paddingStart: hp(" 0.9%") }}>
                      {" "}
                      Update
                    </Text>
                  </Button>
                ) : (
                  <Button rounded style={styles.viewDetails4}>
                    <Text style={{ color: "white", paddingStart: hp("0.9%") }}>
                      {" "}
                      Update
                    </Text>
                  </Button>
                )}
              </View>
            </View>
          </View>
          <View style={styles.viewDetails}>
            <View style={{ flex: 1 }}>
              {/* {this.state.loading ? <Text> Loding </Text> :  */}
              <FlatList
                data={this.state.residentList}
                keyExtractor={(item, index) => item.unit + index}
                extraData={this.state.residentList}
                renderItem={({ item, index }) => (
                  <Card style={{ height: hp("14%") }}>
                    <View style={{ height: 1, backgroundColor: "lightgray" }} />
                    <View style={{ flexDirection: "row", flex: 1 }}>
                      <View style={{ flex: 1 }}>
                        <View Style={{ flexDirection: "column" }}>
                          <Text style={styles.textDetails}>{`Name: ${
                            item.name
                          }`}</Text>
                          <Text style={styles.textDetails}>{`Unit: ${
                            item.unit
                          }`}</Text>
                          <Text style={styles.textDetails}>{`Role: ${
                            item.role
                          }`}</Text>
                        </View>
                      </View>

                      <View style={{ flex: 0.5, marginRight: hp("3%") }}>
                        {item.role == "Owner" ? (
                          this.selectRole(item, index)
                        ) : (
                          <Text> </Text>
                        )}
                        {/* {this.renderAdminStatus(item)} */}
                        {item.uoRoleID === 1 ?<Text>Admin</Text>:<Text></Text>}
                        {/* {item.isAdmin && item.role=='Owner' ?   <Text> is Admin  </Text> : <Text> Owner </Text> } */}
                      </View>
                    </View>
                    <View style={{ height: 1, backgroundColor: "lightgray" }} />
                  </Card>
                )}
              />
              {/* } */}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    associationid: state.DashboardReducer.associationid,
    selectedAssociation: state.DashboardReducer.selectedAssociation,
    oyeURL: state.OyespaceReducer.oyeURL,
    SelectedMemberID: state.UserReducer.SelectedMemberID,
    selectedAssociationIndex: state.DashboardReducer.selectedAssociationIndex,
    notifications: state.NotificationReducer.notifications,
    userReducer: state.UserReducer
  };
};

export default connect(
  mapStateToProps,
  { getDashUnits }
)(Resident);

const styles = StyleSheet.create({
  residentialListTitle: {
    textAlign: "center",
    fontSize: hp("2.8%"),
    fontWeight: "bold",
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
    color: "orange"
  },
  viewDetails: {
    flexDirection: "column",
    flex: 1,
    paddingTop: hp("0.2%"),
    paddingLeft: hp("0.5%"),
    paddingRight: hp("0.5%")
  },
  cardDetails: {
    height: 60
  },

  textDetails: {
    fontSize: hp("1.9%"),
    paddingLeft: hp("5%"),
    paddingTop: hp("0.9%"),
    paddingBottom: hp("0.5%"),
    fontWeight: "bold",
    color: "black"
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
    width: wp("17%"),
    height: hp("12%"),
    marginRight: hp("3%")
  },
  textWrapper: {
    height: hp("85%"), // 70% of height device screen
    width: wp("100%") // 80% of width device screen
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
  },
  viewDetails3: {
    height: hp("5.5%"),
    backgroundColor: "#F5F5F5",
    borderRadius: hp("7%"),
    fontSize: hp("1.8%"),
    paddingLeft: hp("2%")
  },
  viewDetails4: {
    height: hp("5.5%"),
    width: wp("19%"),
    backgroundColor: "#DCDCDC",
    alignContent: "center"
  }
});
