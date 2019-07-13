import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
  FlatList,
  TextInput,
  Dimensions,
  Alert
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { NavigationEvents } from "react-navigation";
import { Button } from "native-base";
// import Swipeout from 'react-native-swipeout';
import { connect } from "react-redux";

class UnitList extends Component {
  static navigationOptions = {
    title: "Unit List",
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      query: "",
      loading: false,
      error: null
      // value:""
    };
    this.arrayholder = [];
  }

  componentDidMount() {
    this.getUnitList();
  }

  searchFilterFunction = text => {
    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.unUniName.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      dataSource: newData
    });
  };

  getUnitList = () => {
    const { id, associationName } = this.props.navigation.state.params;
    fetch(
      `https://${
        this.props.oyeURL
      }/oyeliving/api/v1/Unit/GetUnitListByAssocID/` + id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log("Manas", responseJson);
        this.setState({
          isLoading: false,
          dataSource: responseJson.data.unit,
          error: responseJson.error || null,
          loading: false
        });
        this.arrayholder = responseJson.data.unit;
      })
      .catch(error => {
        this.setState({ loading: false });
        console.log(error);
      });
  };

  renderItem = ({ item, index }) => {
    return (
      <View style={styles.tableView}>
        <View style={styles.lineAboveAndBelowFlatList} />
        <View style={styles.cellView}>
          <View style={styles.cellDataInColumn}>
            <View style={styles.blockNameFlexStyle}>
              <Image
                style={styles.memberDetailIconImageStyle}
                source={require("../icons/buil.png")}
              />
              <Text style={styles.blockNameTextStyle}>{item.unUniName}</Text>
            </View>
            <View style={styles.noOfUnitsFlex}>
              <View style={styles.viewForNoOfUnitsText}>
                <Text style={styles.numberOfUnitsTextStyle}>
                  <Text
                    style={{
                      color: "#cdcdcd",
                      fontSize: hp("1.8%"),
                      fontWeight: "bold"
                    }}
                  >
                    {item.unOcStat}
                  </Text>
                </Text>
              </View>
              <View style={styles.editButtonViewStyle}>
                <View style={{ marginLeft: hp("1%") }}>
                  <Button
                    bordered
                    dark
                    style={styles.addUnitButton}
                    onPress={() =>
                      this.props.navigation.navigate("RegisterUser", {
                        unitList: item,
                        AssnId: this.props.navigation.state.params.id,
                        associationName: this.props.navigation.state.params.associationName
                      })
                    }
                  >
                    <Text style={styles.addUnitText}>Register Me</Text>
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.lineAboveAndBelowFlatList} />
      </View>
    );
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <SafeAreaView style={{ backgroundColor: "orange" }}>
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
          <NavigationEvents
          onDidFocus={payload => this.getUnitList()}
          onWillBlur={payload => this.getUnitList()}
        />
          <Text style={styles.titleOfScreen}>Unit List</Text>

          <View style={styles.progress}>
            <ActivityIndicator size="large" color="#F3B431" />
          </View>
        </View>
      );
    }
    const { id, associationName } = this.props.navigation.state.params;
    console.log("$$$$$$$$@$@!$!@$@%#^#$%&%^&%$", id, associationName);
    return (
      <View style={styles.container}>
        <NavigationEvents
          onDidFocus={payload => this.getUnitList()}
          onWillBlur={payload => this.getUnitList()}
        />
        <SafeAreaView style={{ backgroundColor: "orange" }}>
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

        <Text style={styles.titleOfScreen}>Unit List</Text>

        <TextInput
          style={styles.searchTextStyle}
          placeholder="Search by Unit Name"
          round
          onChangeText={this.searchFilterFunction}
        />

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
              No units available
            </Text>
          </View>
        ) : (
          <FlatList
            style={{ marginTop: 15 }}
            data={this.state.dataSource}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.unUnitID.toString()}
          />
          
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  searchTextStyle: {
    height: hp("5.5%"),
    borderWidth: hp("0.2%"),
    borderRadius: hp("3%"),
    borderColor: "#f4f4f4",
    marginHorizontal: hp("1%"),
    marginBottom: hp("2%"),
    paddingLeft: hp("3%"),
    fontSize: hp("1.8%"),
    backgroundColor: "#f4f4f4"
  },

  progress: {
    justifyContent: "center",
    alignItems: "center"
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
  image1: {
    width: wp("17%"),
    height: hp("12%"),
    marginRight: hp("3%")
  },
  titleOfScreen: {
    marginTop: hp("1.6%"),
    textAlign: "center",
    fontSize: hp("2%"),
    fontWeight: "bold",
    color: "#ff8c00",
    marginBottom: hp("1.6%")
  },

  lineAboveAndBelowFlatList: {
    backgroundColor: "lightgray",
    height: hp("0.1%")
  },

  tableView: {
    flexDirection: "column"
  },
  cellView: {
    flexDirection: "row",
    marginLeft: wp("3%"),
    marginRight: wp("1%"),
    marginVertical: hp("1%")
    // justifyContent: "flex-start"
  },
  cellDataInColumn: {
    flexDirection: "column",
    alignItems: "flex-start"

    //justifyContent: "flex-start"
  },
  blockNameFlexStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    marginVertical: hp("0.5%")
  },
  memberDetailIconImageStyle: {
    width: wp("5%"),
    height: wp("5%")
  },
  blockNameTextStyle: {
    fontSize: hp("2%"),
    // color: "#909091",
    marginLeft: hp("1%"),
    fontWeight: "500"
  },
  noOfUnitsFlex: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: Dimensions.get("window").width
  },
  viewForNoOfUnitsText: {
    justifyContent: "flex-start",
    alignSelf: "center"
  },
  numberOfUnitsTextStyle: {
    fontSize: hp("1.8%"),
    color: "#909091",
    marginLeft: hp("3.5%"),
    fontWeight: "500"
  },
  editButtonViewStyle: {
    marginRight: hp("3%"),
    justifyContent: "space-around",
    flexDirection: "row",
    alignSelf: "center"
  },
  addUnitButton: {
    width: wp("30%"),
    height: hp("3.6%"),
    borderRadius: hp("2%"),
    //borderWidth: hp("0.2%"),
    borderColor: "orange",
    backgroundColor: "orange",
    justifyContent: "center"
  },
  addUnitText: {
    color: "white",
    fontWeight: "700",
    fontSize: hp("1.6%")
  }
});

const mapStateToProps = state => {
  return {
    champBaseURL: state.OyespaceReducer.champBaseURL,
    SelectedAssociationID: state.UserReducer.SelectedAssociationID,
    MyAccountID: state.UserReducer.MyAccountID,
    oyeURL: state.OyespaceReducer.oyeURL
  };
};

export default connect(mapStateToProps)(UnitList);
