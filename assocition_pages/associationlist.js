import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  TextInput,
  SafeAreaView,
} from "react-native";
import { Button } from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { NavigationEvents } from "react-navigation";
import { connect } from "react-redux";
import { Card, CardItem, Form, Item, Input, Icon } from "native-base"

class BlockDetail extends React.Component {
  static navigationOptions = {
    title: "JoinAssociation",
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      query: "",
      loading: false,
      error: null,
      searchText:""
    };
    this.arrayholder = [];
  }

  componentDidMount() {
    this.myJoinAssociationListGetData();
    setTimeout(() => {
      this.setState({
        isLoading: false
      });
    }, 3000);
    
  }

  searchFilterFunction = text => {
    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.asCountry.toUpperCase()} ${item.asAsnName.toUpperCase()} ${item.asPinCode.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      searchText:text,
      dataSource: newData
    });
  };

  myJoinAssociationListGetData = () => {
    // console.log("________")
    this.setState({ loading: true });

    fetch(
      `http://${
        this.props.oyeURL
      }/oyeliving/api/v1/association/getassociationlist`,
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
        console.log(responseJson);

        this.setState({
          isLoading: false,
          dataSource: responseJson.data.associations,
          error: responseJson.error || null,
          loading: false
        });
        this.arrayholder = responseJson.data.associations;
        console.log(
          this.state.dataSource,
          "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
        );
      })
      .catch(error => {
        this.setState({ error, loading: false });
        console.log(error, "77777777777777777777777777777");
      });
  };
  renderItem = ({ item }) => {
    return (
      <View style={styles.tableView}>
        <View style={styles.cellView}>
          <View style={styles.cellDataInColumn}>
            <View style={styles.blockNameFlexStyle}>
              <View
                style={{
                  flex: 5,
                  //alignItems: "flex-start",
                  flexDirection: "row",
                  alignContent: "flex-start"
                }}
              >
                <Image
                  style={styles.memberDetailIconImageStyle}
                  source={require("../icons/building.png")}
                />
                <Text style={styles.blockNameTextStyle}>{item.asAsnName}</Text>
              </View>
              <View
                style={{
                  flex: 5,
                  alignContent: "flex-end"
                }}
              >
                {/* <TouchableOpacity
                  onPress={() => {
                    // console.log(item)
                    console.log(item, "kjhgfhiljkhgfdsghjkhgfg");

                    this.props.navigation.navigate("EditAssociation", {
                      associationDetails: item,
                      associationDetails1: item.asCountry
                    });
                  }}
                >
                  <Image
                    style={styles.pencilBtnStyle}
                    source={require("../icons/pencil120.png")}
                  />
                </TouchableOpacity> */}
              </View>
            </View>
            <View style={styles.blockTypeFlexStyle}>
              <Text style={styles.blockTypeTextStyle}>
                {item.asAddress}, {item.asCity}
              </Text>
            </View>
            <View style={styles.blockTypeFlexStyle}>
              <Text style={styles.blockTypeTextStyle}>
                Country: {item.asCountry}
              </Text>
            </View>
            <View style={styles.blockTypeFlexStyle}>
              <View
                style={{
                  flex: 5,
                  //alignItems: "flex-start",
                  flexDirection: "row",
                  alignContent: "flex-start"
                }}
              >
                <Text style={styles.blockTypeTextStyle}>
                  Pincode: {item.asPinCode}
                </Text>
              </View>
              <View
                style={{
                  marginRight: hp("10%"),
                  flex: 5,
                  alignContent: "flex-end"
                }}
              >
                <Button
                  bordered
                  dark
                  style={styles.addUnitButton}
                  onPress={() => {
                    this.props.navigation.navigate("Unit", {
                      id: item.asAssnID,
                      associationName: item.asAsnName
                    });
                    this.setState({
                      dataSource:[],
                      arrayholder:[],
                      searchText:''
                    })
                  }}
                >
                  <Text style={styles.addUnitText}>Join</Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.lineAboveAndBelowFlatList} />
      </View>
    );
  };

  render() {
    const { navigate } = this.props.navigation;
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
                source={require("../icons/headerLogo.png")}
              />
            </View>
            <View style={{ flex: 0.2 }}>
              {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
            </View>
          </View>
          <View style={{ borderWidth: 1, borderColor: "orange" }} />
        </SafeAreaView>

          <Text style={styles.titleOfScreenStyle}>Join association</Text>

          <View style={styles.progressViewStyle}>
            <ActivityIndicator size="large" color="#F3B431" />
          </View>
        </View>
      );
    }
    return (
      <View style={styles.mainView}>
        {/* <Header /> */}
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
                source={require("../icons/headerLogo.png")}
              />
            </View>
            <View style={{ flex: 0.2 }}>
              {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
            </View>
          </View>
          <View style={{ borderWidth: 1, borderColor: "orange" }} />
        </SafeAreaView>

        <NavigationEvents
          onDidFocus={payload => this.myJoinAssociationListGetData()}
          onWillBlur={payload => this.myJoinAssociationListGetData()}
        />

        <View style={styles.containerViewStyle}>
          <Text style={styles.titleOfScreenStyle}>Join association</Text>

          <Form style={styles.formSearch}>
            <Item style={styles.inputItem}>
              <Input
                  value={this.state.searchText}
                marginBottom={hp("-1%")}
                placeholder="Search...."
                multiline={false}
                onChangeText={this.searchFilterFunction}
              />

              <Icon style={styles.icon} name="search" size={14} />
            </Item>
          </Form>

          {/* <TextInput
            style={styles.searchTextStyle}
            placeholder="Search by Country/Name/Pincode..."
            round
            onChangeText={this.searchFilterFunction}
          /> */}

          <View style={styles.lineAboveAndBelowFlatList} />
          
          <FlatList
            data={this.state.dataSource.sort((a, b) =>
              a.asAsnName.localeCompare(b.asAsnName)
            )}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.asAssnID.toString()}
          />

          {/* <TouchableOpacity
            style={[styles.floatButton]}
            //onPress={() => this.props.navigation.navigate("CreateAssociation")}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                aspectRatio: 1,
                paddingBottom: hp("0.8%")
                // backgroundColor: "red"
              }}
            >
              <Text
                style={{ fontSize: hp("5%"), color: "#fff", fontWeight: "700" }}
              >
                +
              </Text>
            </View>
          </TouchableOpacity> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  emptyViewStyle: {
    width: hp("15%")
  },
  editButtonViewStyle: {
    // backgroundColor: "yellow",
    marginRight: hp("3%"),
    justifyContent: "space-around",
    flexDirection: "row",
    alignSelf: "center"
  },
  viewForNoOfUnitsText: {
    justifyContent: "flex-start",
    alignSelf: "center"
    //flexDirection: "row"
  },
  progressViewStyle: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  formSearch: {
    marginBottom: hp("1%")
  },
  icon: {
    color: "orange"
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    elevation: 2,
    position: "relative"
  },
   image1: {
    width: wp("22%"),
    height: hp("12%"),
    marginRight: hp("3%")
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

  mainView: {
    flex: 1
  },
  containerViewStyle: {
    height: hp("87%"),
    width: wp("100%")
  },

  titleOfScreenStyle: {
    marginTop: hp("2%"),
    marginBottom: hp("2.5%"),
    textAlign: "center",
    fontSize: hp("2.3%"),
    fontWeight: "500",
    color: "#FF8C00"
  },

  lineAboveAndBelowFlatList: {
    backgroundColor: "lightgray",
    height: hp("0.1%")
  },
  floatButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0)",
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
    width: hp("8%"),
    position: "absolute",
    bottom: 20,
    right: 20,
    height: hp("8%"),
    backgroundColor: "#FF8C00",
    borderRadius: hp("5%"),
    // shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 3,
    shadowOpacity: 0.6
  },
  plusTextStyle: {
    flex: 1,
    fontSize: hp("5%"),
    color: "#fff",
    fontWeight: "700",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    // textAlign: "center",
    textAlignVertical: "center"
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

  blockTypeFlexStyle: {
    flexDirection: "row",
    flex: 1,
    width: hp("80%"),
    // alignItems: "center",
    // justifyContent: "flex-start",
    // alignSelf: "flex-start",
    marginVertical: hp("0.6%")
  },
  blockNameFlexStyle: {
    flexDirection: "row",
    flex: 1,
    // alignItems: "center",
    width: hp("80%"),
    // justifyContent: "flex-start",
    // alignSelf: "flex-start",
    marginVertical: hp("0.5%")
  },
  noOfUnitsFlex: {
    flex: 1,

    flexDirection: "row",
    justifyContent: "space-between",
    width: Dimensions.get("window").width

    // alignSelf: "flex-start",
    // marginVertical: hp("0.4%")
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
  blockTypeTextStyle: {
    fontSize: hp("2%"),
    color: "#909091",
    marginLeft: hp("3.5%"),
    fontWeight: "500"
  },
  numberOfUnitsTextStyle: {
    fontSize: hp("1.8%"),
    color: "#909091",
    marginLeft: hp("3.5%"),

    fontWeight: "500"
  },

  pencilBtnStyle: {
    height: wp("6%"),
    width: wp("6%")
  },
  addUnitButton: {
    width: wp("20%"),
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

export default connect(mapStateToProps)(BlockDetail);
