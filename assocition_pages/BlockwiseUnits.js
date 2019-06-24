import React, { Component } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  FlatList,
  Text,
  ActivityIndicator,
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
import {connect} from 'react-redux';

var Unitlist = [];

class UnitDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UnitName: "",
      UnitType: "",
      UnitId: "",
      UnitDimention: "",
      UniteRate: "",
      CalType: "",
      UnitStatus: "",
      OwnerfName: "",
      OwnerlName: "",
      OMobile: "",
      OGmail: "",
      OAMobile: "",
      OAGmail: "",
      TFname: "",
      TLname: "",
      Temail: "",
      Tmob: "",
      query: "",
      Osdate: "",
      Todate: "",
      empty: [],
      unitlist: [],
      Unitlist2: [],
      isLoading1: true,

      error: null,
      isLoading: true,
      dataSource: [],
      loading: false
    };
    this.arrayholder = [];
  }

  static navigationOptions = {
    title: "UnitDetails",
    header: null
  };

  componentDidMount = () => {
    this.UnitDetail();
    const {
      unitid,
    } = this.props.navigation.state.params
    // console.log("2424298749812749712947912",unitid)
    setTimeout(() => {
      this.setState({
        isLoading1: false
      });
    }, 5000);
  };
  UnitDetail = () => {
    const {
      unitid,
    } = this.props.navigation.state.params

console.log("2424298749812749712947912",unitid)
    // this.setState({ isLoading1: true });

    fetch(
      `http://${this.props.oyeURL}/oyeliving/api/v1/Unit/GetUnitListByBlockID/${unitid}`,
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
        let units = [];

        // console.log("hhhhhh",responseJson)

        // this.arrayholder = responseJson.data.unitsByBlockID
        var count = Object.keys(responseJson.data.unitsByBlockID).length;
        // console.log("#######",count)
        for (var i = 0; i < count; i++) {
          var count1 = Object.keys(responseJson.data.unitsByBlockID[i].owner)
            .length;
          for (var j = 0; j < count1; j++) {
            this.setState({
              UnitName: responseJson.data.unitsByBlockID[i].unUniName
            });
            this.setState({
              UnitType: responseJson.data.unitsByBlockID[i].unUniType
            });
            this.setState({
              UnitStatus: responseJson.data.unitsByBlockID[i].unOcStat
            });
            this.setState({
              UnitId: responseJson.data.unitsByBlockID[i].unUnitID
            });
            this.setState({
              Osdate: responseJson.data.unitsByBlockID[i].unSldDate
            });
            this.setState({
              UnitDimention: responseJson.data.unitsByBlockID[i].unDimens
            });
            this.setState({
              UniteRate: responseJson.data.unitsByBlockID[i].unRate
            });
            this.setState({
              CalType: responseJson.data.unitsByBlockID[i].unCalType
            });
            this.setState({
              OwnerfName: responseJson.data.unitsByBlockID[i].owner[j].uofName
            });
            this.setState({
              OwnerlName: responseJson.data.unitsByBlockID[i].owner[j].uolName
            });
            this.setState({
              OMobile: responseJson.data.unitsByBlockID[i].owner[j].uoMobile
            });
            this.setState({
              OGmail: responseJson.data.unitsByBlockID[i].owner[j].uoEmail
            });
            this.setState({
              OAMobile: responseJson.data.unitsByBlockID[i].owner[j].uoMobile1
            });
            this.setState({
              OAGmail: responseJson.data.unitsByBlockID[i].owner[j].uoEmail1
            });

            units.push({
              UnitName: this.state.UnitName,
              UnitType: this.state.UnitType,
              UnitStatus: this.state.UnitStatus,
              UnitId: this.state.UnitId,
              UnitDimention: this.state.UnitDimention,
              UnitRate: this.state.UniteRate,
              CalType: this.state.CalType,
              fName: this.state.OwnerfName,
              lName: this.state.OwnerlName,
              Mobile: this.state.OMobile,
              Email: this.state.OGmail,
              AEmail: this.state.OAGmail,
              AMobile: this.state.OAMobile,
              Osdate: this.state.Osdate,
              role: "owner"
            });
          }
          var count2 = Object.keys(responseJson.data.unitsByBlockID[i].tenant)
            .length;
          for (var k = 0; k < count2; k++) {
            this.setState({
              UnitName: responseJson.data.unitsByBlockID[i].unUniName
            });
            this.setState({
              UnitType: responseJson.data.unitsByBlockID[i].unUniType
            });
            this.setState({
              UnitStatus: responseJson.data.unitsByBlockID[i].unOcStat
            });
            this.setState({
              UnitId: responseJson.data.unitsByBlockID[i].unUnitID
            });
            this.setState({
              Todate: responseJson.data.unitsByBlockID[i].unOcSDate
            });
            this.setState({
              UnitDimention: responseJson.data.unitsByBlockID[i].unDimens
            });
            this.setState({
              UniteRate: responseJson.data.unitsByBlockID[i].unRate
            });
            this.setState({
              CalType: responseJson.data.unitsByBlockID[i].unCalType
            });
            this.setState({
              TFname: responseJson.data.unitsByBlockID[i].tenant[k].utfName
            });
            this.setState({
              TLname: responseJson.data.unitsByBlockID[i].tenant[k].utlName
            });
            this.setState({
              Tmob: responseJson.data.unitsByBlockID[i].tenant[k].utMobile
            });
            this.setState({
              Temail: responseJson.data.unitsByBlockID[i].tenant[k].utEmail
            });
            if (responseJson.data.unitsByBlockID[i].owner.length > 0) {
              this.setState({
                OwnerfName: responseJson.data.unitsByBlockID[i].owner[0].uofName
              });
              this.setState({
                OwnerlName: responseJson.data.unitsByBlockID[i].owner[0].uolName
              });
              this.setState({
                OMobile: responseJson.data.unitsByBlockID[i].owner[0].uoMobile
              });
              this.setState({
                OGmail: responseJson.data.unitsByBlockID[i].owner[0].uoEmail
              });
              this.setState({
                OAMobile: responseJson.data.unitsByBlockID[i].owner[0].uoMobile1
              });
              this.setState({
                OAGmail: responseJson.data.unitsByBlockID[i].owner[0].uoEmail1
              });
            }
            units.push({
              UnitName: this.state.UnitName,
              UnitType: this.state.UnitType,
              UnitStatus: this.state.UnitStatus,
              UnitId: this.state.UnitId,
              UnitDimention: this.state.UnitDimention,
              UnitRate: this.state.UniteRate,
              CalType: this.state.CalType,
              tfName: this.state.TFname,
              tlName: this.state.TLname,
              tMobile: this.state.Tmob,
              tEmail: this.state.Temail,
              fName: this.state.OwnerfName,
              lName: this.state.OwnerlName,
              Mobile: this.state.OMobile,
              Email: this.state.OGmail,
              AEmail: this.state.OAGmail,
              AMobile: this.state.OAMobile,
              Ocdate: this.state.Todate,
              role: "tenant"
            });
          }
        }
        this.setState({
          isLoading: false,
          dataSource: units,
          error: responseJson.error || null,
          unitlist: units,
          loading: false,
          isLoading1: false
        });
        this.arrayholder = units;
        // this.setState({ });
        // console.log("JJJJJJJJJJJJJJJJJ",this.state.unitlist)
      })
      .catch();

    // console.log("getting dada",this.props.navigation.state.params.data)
  };

  searchFilterFunction = text => {
    this.setState({
      value: text
    });

    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.Mobile} ${item.UnitName.toUpperCase()}  ${
        item.tMobile
      }
      ${item.fName.toString().toUpperCase()} ${item.tfName} `;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.setState({ unitlist: newData });
  };

  // handleSearch = text => {
  //   const { Unitlist1 } = this.state;
  //   this.setState({ query:text });
  //   let sortResident = Unitlist;
  //   this.setState({ Unitlist1:  [ ...sortResident.filter(item => item.OMobile.include(text) )  ]})
  // }

  render() {
    const {blockName, unitid} = this.props.navigation.state.params; 
    console.log('!@#!@#@$@#%#%@#$!@$@', blockName, unitid)
    if (this.state.isLoading1) {
      return (
        <View style={{ flex: 1, flexDirection: "column" }}>
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
                      height: hp("6%"),
                      width: wp("20%"),
                      alignItems: "center",
                      justifyContent: "center",
                      alignContent: "center"
                    }}
                  >
                    <Image
                      source={require("../icons/backBtn.png")}
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
          <Text style={styles.residentialListTitle}>Unit Details</Text>
          <View style={styles.progress}>
            <ActivityIndicator size="large" color="#F3B431" />
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "center",
                position: "absolute"
              }}
            >
              <Text>Please Wait</Text>
            </View>
          </View>
        </View>
      );
    }
    // console.log(this.state.unitlist)

    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <NavigationEvents
          onDidFocus={payload => this.UnitDetail()}
          onWillBlur={payload => this.UnitDetail()}
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
                    height: hp("6%"),
                    width: wp("20%"),
                    alignItems: "center",
                    justifyContent: "center",
                    alignContent: "center"
                  }}
                >
                  <Image
                    source={require("../icons/backBtn.png")}
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
        <View style={styles.textWrapper}>
          <Text style={styles.residentialListTitle}>Unit Details</Text>
          <View style={{ flexDirection: "column", height: hp("15%") }}>
            <View style={{ flex: 1, height: hp("4%"), marginBottom: hp("0%") }}>
              <TextInput
                style={styles.viewDetails3}
                placeholder="   Search by Name/Mobile No./Unit No.... "
                round
                onChangeText={this.searchFilterFunction}
              />
            </View>
            <View
              style={{
                height: hp("6%"),
                flexDirection: "row",
                marginTop: hp("1%")
              }}
            >
              <View
                style={{
                  flex: 0.85,
                  flexDirection: "row",
                  alignContent: "center"
                }}
              >
                <Button
                  bordered
                  warning
                  style={{
                    height: hp("4.6%"),
                    width: hp("15%"),
                    borderRadius: 20,
                    marginRight: hp("2%"),
                    marginLeft: hp("2%")
                  }}
                  onPress={() => {}}
                >
                  <Text style={{ color: "#ff8c00", paddingStart: hp(" 0.9%") }}>
                    {" "}
                    Export CSV
                  </Text>
                </Button>

                <Button
                  bordered
                  dark
                  style={{
                    height: hp("4.6%"),
                    width: hp("15%"),
                    borderRadius: 20
                  }}
                  
                >
                  <Text style={{ color: "black", paddingStart: hp(" 0.9%") }}>
                    {" "}
                    Import CSV
                  </Text>
                </Button>
              </View>
              <View style={{ flex: 0.15, justifyContent: "flex-end" }}>
                <TouchableOpacity
                  style={[styles.floatButton]}
                  onPress={() => this.props.navigation.navigate("AddUnit", {
                    blockname: blockName,
                    unit:  unitid
                  })}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      aspectRatio: 1
                    }}
                  >
                    <Text
                      style={{
                        fontSize: hp("5%"),
                        color: "#fff",
                        fontWeight: "200"
                      }}
                    >
                      +
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.viewDetails}>
            <View style={{ flex: 1 }}>
              <FlatList
                data={this.state.unitlist}
                keyExtractor={(item, index) => item.UnitName + index}
                extraData={this.state}
                renderItem={({ item, index }) => (
                  <Card style={{ height: hp("17%") }}>
                    <View style={{ marginTop: hp("1%") }}>
                      <View style={{ flexDirection: "column" }}>
                        <View
                          style={{ flexDirection: "row", height: hp("4%") }}
                        >
                          <View style={{ marginStart: hp("2%") }}>
                            <Image
                              style={{ width: hp("3%"), height: hp("3%") }}
                              source={require("../icons/building.png")}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.textDetails1}>
                              <Text style={{ fontWeight: "bold" }}>{`    ${
                                item.UnitName
                              } - `}</Text>
                              <Text style={{ color: "#38bcdb" }}>
                                {item.UnitType}
                              </Text>
                            </Text>
                          </View>
                          <View style={{ marginRight: hp("1.5%") }}>
                            <Text
                              style={[
                                styles.textDetails1,
                                { color: "#38bcdb" }
                              ]}
                            >{`${item.UnitStatus}`}</Text>
                          </View>
                        </View>
                        <View style={{ height: hp("3%") }}>
                          {item.role == "tenant" ? (
                            <Text style={styles.textDetails}>{`${item.tfName} ${
                              item.tlName
                            }`}</Text>
                          ) : (
                            <Text style={styles.textDetails}>{`${item.fName} ${
                              item.lName
                            }`}</Text>
                          )}
                        </View>
                        <View style={{ height: hp("3%") }}>
                          {item.role == "tenant" ? (
                            <Text
                              style={[styles.textDetails, { color: "#ff8c00" }]}
                            >{`${item.tMobile}`}</Text>
                          ) : (
                            <Text
                              style={[styles.textDetails, { color: "#ff8c00" }]}
                            >{`${item.Mobile}`}</Text>
                          )}
                        </View>
                        <View
                          style={{ flexDirection: "row", height: hp("3%") }}
                        >
                          <View style={{ flex: 0.99 }}>
                            {item.role == "tenant" ? (
                              <Text style={styles.textDetails}>{`${
                                item.tEmail
                              }`}</Text>
                            ) : (
                              <Text style={styles.textDetails}>{`${
                                item.Email
                              }`}</Text>
                            )}
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              this.props.navigation.navigate("EditUnit", {
                                UnitName: item.UnitName,
                                UnitType: item.UnitType,
                                UnitStatus: item.UnitStatus,
                                UnitId: item.UnitId,
                                UnitDimention: item.UnitDimention,
                                Rate: item.UnitRate,
                                CalType: item.CalType,
                                fName: item.fName,
                                lName: item.lName,
                                Mobile: item.Mobile,
                                Email: item.Email,
                                AEmail: item.AEmail,
                                AMobile: item.AMobile,
                                role: item.role,
                                tfName: item.tfName,
                                tlName: item.tlName,
                                tMobile: item.tMobile,
                                tEmail: item.tEmail,
                                Ocdate: item.Ocdate,
                                Osdate: item.Osdate
                              });
                            }}
                          >
                            <View style={{ width: hp("7%") }}>
                              <Image
                                style={{
                                  width: hp("2.5%"),
                                  height: hp("2.5%"),
                                  marginRight: hp("1%"),
                                  marginLeft: hp("1%")
                                }}
                                source={require("../icons/pencil120.png")}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Card>
                )}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  residentialListTitle: {
    textAlign: "center",
    fontSize: hp("2.5%"),
    fontWeight: "bold",
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
    color: "#ff8c00"
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
    fontSize: hp("1.8%"),
    paddingLeft: hp("2%"),
    paddingTop: hp("0.9%"),
    paddingBottom: hp("0.2%"),
    // fontWeight:'bold',
    color: "black"
  },
  textDetails1: {
    fontSize: hp("2%"),
    paddingLeft: hp("0.5%"),
    paddingTop: hp("0.2%"),
    paddingBottom: hp("0.2%"),
    // fontWeight:'bold',
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
    width: wp("22%"),
    height: hp("12%"),
    marginRight: hp("1%")
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
    width: wp("6%"),
    height: hp("2%")
  },
  viewDetails3: {
    height: hp("6.5%"),
    backgroundColor: "#F5F5F5",
    borderRadius: hp("7%"),
    //  borderBottomWidth:hp('0.2%'),
    fontSize: hp("1.8%")
  },
  viewDetails4: {
    height: hp("6.5%"),
    width: wp("19%"),
    backgroundColor: "#DCDCDC",
    alignContent: "center"
  },
  floatButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0)",
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
    width: hp("6%"),
    // position: "absolute",
    bottom: hp("0.5%"),
    // right: hp('3%'),
    height: hp("6%"),
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
  progress: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
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

export default connect(mapStateToProps)(UnitDetails);