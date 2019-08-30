import React, { PureComponent, Fragment } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  Platform,
  Linking,
  RefreshControl,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  SafeAreaView
} from "react-native";
import { connect } from "react-redux";
import { ListItem, Header, Card } from "react-native-elements";
import {
  onNotificationOpen,
  storeOpenedNotif,
  getNotifications,
  refreshNotifications,
  toggleCollapsible,
  onEndReached
} from "../../actions";
import _ from "lodash";
import { NavigationEvents } from "react-navigation";
import Collapsible from "react-native-collapsible";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import axios from "axios";
import moment from "moment";

class NotificationScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      gateDetails: [],
      Date: [],
      Time: [],
      Date1: [],
      Time1: []
    };
    this.renderCollapseData = this.renderCollapseData.bind(this);
  }

  componentDidMount() {
    // console.log("didmount");
    // this.gateAppNotif()
    this.doNetwork(null, this.props.notifications);
  }

  keyExtractor = (item, index) => index.toString();

  onPress = (item, index) => {
    const { notifications, savedNoifId, oyeURL } = this.props;
    if (
      item.ntType === "Join" ||
      item.ntType === "Join_Status"
      // item.ntType === "gate_app"
    ) {
      this.props.navigation.navigate("NotificationDetailScreen", {
        details: item,
        index,
        notifications,
        oyeURL,
        savedNoifId,
        ntid: item.ntid
      });

      // this.props.onNotificationOpen(notifications, index, oyeURL);
      // this.props.storeOpenedNotif(savedNoifId, item.ntid);
    }
  };

  renderIcons = (type, item, index) => {
    const { savedNoifId } = this.props;
    // let status = _.includes(savedNoifId, item.ntid);

    if (type === "name") {
      if (!item.ntIsActive) {
        return "mail-read";
      } else {
        return "ios-mail-unread";
      }
    } else if (type === "type") {
      if (!item.ntIsActive) {
        return "octicon";
      } else {
        return "ionicon";
      }
    } else if (type === "style") {
      if (!item.ntIsActive) {
        return { backgroundColor: "#fff" };
      } else {
        return { backgroundColor: "#eee" };
      }
    }
  };

  renderTitle = type => {
    if (type === "Join") {
      return "Request to Join";
    } else if (type === "Join_Status") {
      return "Request to Join Status";
    } else if (type === "gate_app") {
      return "Gate App Notification";
    }
  };

  renderStyle = active => {
    if (active) {
      return { backgroundColor: "#eee" };
    } else return { backgroundColor: "#fff" };
  };

  gateAppNotif = () => {
    const { details } = this.props.navigation.state.params;
    // console.log("@#@$#$#@%#%#%#%@#%@#%", details.sbMemID);
    fetch(
      `http://${this.props.oyeURL}/oyesafe/api/v1/VisitorLog/GetVisitorLogListByVisLogID/` +
        details.sbMemID,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log("Manas", responseJson);
        this.setState({
          gateDetails: responseJson.data.visitorLog,
          Date:
            responseJson.data.visitorLog.vldCreated.substring(8, 10) +
            "-" +
            responseJson.data.visitorLog.vldCreated.substring(5, 7) +
            "-" +
            responseJson.data.visitorLog.vldCreated.substring(0, 4),
          Time: responseJson.data.visitorLog.vlEntryT.substring(11, 16),
          Date1:
            responseJson.data.visitorLog.vldUpdated.substring(8, 10) +
            "-" +
            responseJson.data.visitorLog.vldUpdated.substring(5, 7) +
            "-" +
            responseJson.data.visitorLog.vldUpdated.substring(0, 4),
          Time1: responseJson.data.visitorLog.vlExitT.substring(11, 16)
        });
        console.log(
          "@#!@$@#%#%#$^$^$%^$%^Gate Details",
          this.state.gateDetails,
          this.state.Date,
          this.state.Time
        );
      })
      .catch(error => {
        console.log(error);
      });
  };

  renderCollapseData(type, id) {
    const { gateDetails } = this.state;
    let value = "";

    if (gateDetails.length <= 0) {
      value = "";
    } else {
      if (type === "vlGtName") {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData ? foundData.vlGtName : "";
      } else if (type === "vlfName") {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData ? foundData.vlfName : "";
      } else if (type === "vlVisType") {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData ? foundData.vlVisType : "";
      } else if (type === "vlComName") {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData ? foundData.vlComName : " ";
      } else if (type === "vlMobile") {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData ? foundData.vlMobile : "";
      } else if (type === "vlEntryImg") {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData ? foundData.vlEntryImg : "";
      } else if (type === "vlEntryT") {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData ? moment(foundData.vlEntryT).format("hh:mm A") : "";
      } else if (type === "vlExitT") {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData ? moment(foundData.vlExitT).format("hh:mm A") : "";
      } else if (type === "vldCreated") {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData
          ? moment(foundData.vldCreated, "YYYY-MM-DD").format("DD-MM-YYYY")
          : "";
      } else if (type === "vldUpdated") {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData
          ? moment(foundData.vldUpdated, "YYYY-MM-DD").format("DD-MM-YYYY")
          : "";
      } else if (type === "vlengName") {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData ? foundData.vlengName : "";
      } else if (type === "vlexgName") {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData ? foundData.vlexgName : "";
      }
    }

    return value;
  }

  doNetwork = (item, notifications) => {
    let gateDetailsArr = [];

    this.props.notifications.map((data, index) => {
      if (data.ntType === "gate_app") {
        axios
          .get(
            `http://${this.props.oyeURL}/oyesafe/api/v1/VisitorLog/GetVisitorLogListByVisLogID/${data.sbMemID}`,
            //data.sbMemID`,
            {
              headers: {
                "Content-Type": "application/json",
                "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
              }
            }
          )
          .then(res => {
            let responseData = res.data.data;
            console.log(responseData, "responseData");

            this.setState(
              (prevState, newEmployer) => ({
                gateDetails: prevState.gateDetails.concat([
                  { ...responseData.visitorLog, ...data }
                ])
              }),
              () => {}
            );
          })
          .catch(error => {
            console.log(error, "error while fetching networks");
          });
      }
    });
  };

  renderItem = ({ item, index }) => {
    const { savedNoifId, notifications, oyeURL } = this.props;
    let status = _.includes(savedNoifId, item.ntid);
    // console.log("NOTIF_ITEM:: ",item)
    if (item.ntType !== "gate_app") {
      return (
        <Card>
          <Text style={{ fontSize: hp("2.5%"), color: "#000" }}>
            {moment(item.ntdCreated, "YYYY-MM-DD").format("DD-MM-YYYY")}
            {"     "}
            {moment(item.ntdCreated).format("hh:mm A")}
          </Text>
          {item.ntType !== "gate_app" ? (
            <ListItem
              onPress={() => this.onPress(item, index)}
              title={this.renderTitle(item.ntType, item)}
              subtitle={item.ntDesc}
              leftIcon={{
                name: this.renderIcons("name", item, index),
                type: this.renderIcons("type", item, index),
                color: "#ED8A19"
              }}
              containerStyle={this.renderIcons("style", item, index)}
            />
          ) : (
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "column" }}>
                <Text>{item.ntDesc}</Text>
                <Text> {item.ntdCreated}</Text>
              </View>
              <Collapsible
                duration={100}
                style={{ flex: 1 }}
                collapsed={item.open}
              >
                <View style={{ backgroundColor: "#ED8A19" }}></View>
              </Collapsible>
            </View>
          )}
        </Card>
      );
    } else {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            console.log(item.ntIsActive);
            if (item.ntIsActive) {
              this.props.onNotificationOpen(notifications, index, oyeURL);
            }
            this.props.toggleCollapsible(notifications, item.open, index);
          }}
        >
          <Card containerStyle={this.renderStyle(item.ntIsActive)}>
            {item.ntType !== "gate_app" ? (
              <ListItem
                onPress={() => this.onPress(item, index)}
                title={this.renderTitle(item.ntType, item)}
                subtitle={item.ntDesc}
                leftIcon={{
                  name: this.renderIcons("name", item, index),
                  type: this.renderIcons("type", item, index),
                  color: "#ED8A19"
                }}
                containerStyle={this.renderIcons("style", item, index)}
              />
            ) : (
              <View style={{ flex: 1 }}>
                <View
                  style={{ flexDirection: "column", marginBottom: hp("1%") }}
                >
                  <Text
                    style={{
                      marginTop: 10,
                      fontSize: hp("2.5%"),
                      color: "#000"
                    }}
                  >
                    {moment(item.ntdCreated, "YYYY-MM-DD").format("DD-MM-YYYY")}
                    {"     "}
                    {moment(item.ntdCreated).format("hh:mm A")}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <View>
                      <Text>{item.ntDesc}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      {item.open ? (
                        <View
                          style={{
                            alignItems: "flex-end",
                            justifyContent: "flex-end",
                            flexDirection: "row",
                            marginTop: hp("3%")
                          }}
                        >
                          {/* <Text style={{ color: '#ff8c00' }}>More</Text> */}
                          <Image
                            style={{ width: hp("2%"), height: hp("2%") }}
                            source={require("../../../icons/show_more.png")}
                          />
                        </View>
                      ) : (
                        <View
                          style={{
                            alignItems: "flex-end",
                            justifyContent: "flex-end",
                            flexDirection: "row",
                            marginTop: hp("3%")
                          }}
                        >
                          {/* <Text style={{ color: '#ff8c00' }}>Less</Text> */}
                          <Image
                            style={{ width: hp("2%"), height: hp("2%") }}
                            source={require("../../../icons/show_less.png")}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                <Collapsible
                  duration={100}
                  style={{ flex: 1 }}
                  collapsed={item.open}
                  align="center"
                >
                  {item.sbMemID === 0 ? (
                    <View>
                      <Text>No Data</Text>
                    </View>
                  ) : (
                    <View style={{ flexDirection: "column" }}>
                      <View style={{ flexDirection: "row" }}>
                        <View style={{ marginBottom: hp("0.2%") }}>
                          {this.renderCollapseData(
                            "vlEntryImg",
                            item.sbMemID
                          ) === "" ? (
                            <Image
                              style={{ width: hp("20%"), height: hp("20%") }}
                              source={require("../../../icons/no_img_captured.png")}
                            />
                          ) : (
                            <Image
                              style={styles.img}
                              // style={styles.img}
                              source={{
                                uri:
                                  `${this.props.mediaupload}` +
                                  this.renderCollapseData(
                                    "vlEntryImg",
                                    item.sbMemID
                                  )
                              }}
                            />
                          )}
                        </View>
                        <View
                          style={{
                            flexDirection: "column",
                            marginLeft: hp("1%")
                          }}
                        >
                          <View style={{ marginBottom: 5 }}>
                            <Text
                              style={{
                                fontSize: hp("1.8%"),
                                fontWeight: "500"
                              }}
                            >
                              {this.renderCollapseData(
                                "vlGtName",
                                item.sbMemID
                              ) === "" ?
                                  <Image
                                  style={styles.img}
                                  source={{
                                    uri:
                                      `${this.props.noImage}`}}
                                />                                
                                :

                                <Image
                                  style={styles.img}
                                  source={{
                                    uri:
                                      `${this.props.mediaupload}` +
                                      this.renderCollapseData(
                                        "vlEntryImg",
                                        item.sbMemID
                                      )
                                  }}
                                />
                              }

                            </View>
                            <View style={{ flexDirection: 'column', marginLeft: hp('1%') }}>
                              <View style={{ marginBottom: 5 }}>
                                <Text style={{ fontSize: hp("1.8%"), fontWeight: '500' }}>
                                  {this.renderCollapseData("vlGtName", item.sbMemID)}{" "}
                                  Association
                                  </Text>
                              </View>

                              <View style={{ marginBottom: 5 }}>
                                <Text style={{ fontSize: hp("1.8%") }}>
                                  {this.renderCollapseData("vlfName", item.sbMemID)}{" "}

                                </Text>
                              </View>

                              <View style={{ flexDirection: "row", marginBottom: 5 }}>
                                <Text style={{ fontSize: hp("1.8%"), color: "#000" }}>
                                  {this.renderCollapseData(
                                    "vlVisType",
                                    item.sbMemID
                                  )}{" "}

                                </Text>
                                <Text style={{ fontSize: hp("1.8%"), color: "#38bcdb" }}>
                                  {this.renderCollapseData(
                                    "vlComName",
                                    item.sbMemID
                                  )}{" "}

                          <View style={{ marginBottom: 5 }}>
                            <Text style={{ fontSize: hp("1.8%") }}>
                              {this.renderCollapseData("vlfName", item.sbMemID)}{" "}
                            </Text>
                          </View>

                          <View
                            style={{ flexDirection: "row", marginBottom: 5 }}
                          >
                            <Text
                              style={{ fontSize: hp("1.8%"), color: "#000" }}
                            >
                              {this.renderCollapseData(
                                "vlVisType",
                                item.sbMemID
                              )}{" "}
                            </Text>
                            <Text
                              style={{ fontSize: hp("1.8%"), color: "#38bcdb" }}
                            >
                              {this.renderCollapseData(
                                "vlComName",
                                item.sbMemID
                              )}{" "}
                            </Text>
                          </View>
                          {this.renderCollapseData("vlMobile", item.sbMemID) !==
                          "" ? (
                            <View style={{ flexDirection: "row" }}>
                              <TouchableOpacity
                                onPress={() => {
                                  {
                                    Platform.OS === "android"
                                      ? Linking.openURL(
                                          `tel:${
                                            this.renderCollapseData(
                                              "vlMobile",
                                              item.sbMemID
                                            )
                                            // this.state.gateDetails
                                            //   .vlMobile
                                          }`
                                        )
                                      : Linking.openURL(
                                          `tel:${
                                            // this.state.gateDetails.vlMobile
                                            this.renderCollapseData(
                                              "vlMobile",
                                              item.sbMemID
                                            )
                                          }`
                                        );
                                  }
                                }}
                              >
                                <View style={{ flexDirection: "row" }}>
                                  <View>
                                    <Text
                                      style={{
                                        fontSize: hp("1.8%"),
                                        color: "#ff8c00"
                                      }}
                                    >
                                      {this.renderCollapseData(
                                        "vlMobile",
                                        item.sbMemID
                                      )}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      width: hp("2.2%"),
                                      height: hp("2.2%")
                                    }}
                                  >
                                    <Image
                                      style={{
                                        width: hp("2.2%"),
                                        height: hp("2.2%")
                                      }}
                                      source={require("../../../icons/call.png")}
                                    />
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <View></View>
                          )}
                        </View>
                      </View>

                      <View style={{ flexDirection: "row" }}>
                        <View style={{ flexDirection: "row" }}>
                          <Text
                            style={{ fontSize: hp("1.8%"), color: "#ff8c00" }}
                          >
                            Entry On:{" "}
                          </Text>
                          <View style={{ flexDirection: "row" }}>
                            <Text style={{ fontSize: hp("1.8%") }}>
                              {this.renderCollapseData(
                                "vldCreated",
                                item.sbMemID
                              )}{" "}
                            </Text>

                            <Text style={{ fontSize: hp("1.8%") }}>
                              {this.renderCollapseData(
                                "vlEntryT",
                                item.sbMemID
                              )}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            marginLeft: hp("2%")
                          }}
                        >
                          <Text
                            style={{ fontSize: hp("1.8%"), color: "#ff8c00" }}
                          >
                            From:{" "}
                          </Text>
                          <Text style={{ fontSize: hp("1.8%") }}>
                            {this.renderCollapseData("vlengName", item.sbMemID)}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <View
                          style={{
                            flexDirection: "row"
                          }}
                        >
                          {this.renderCollapseData(
                            "vlexgName",
                            item.sbMemID
                          ) !== "" ? (
                            <View
                              style={{
                                flexDirection: "row"
                              }}
                            >
                              <View style={{ flexDirection: "row" }}>
                                <Text
                                  style={{
                                    fontSize: hp("1.8%"),
                                    color: "#ff8c00"
                                  }}
                                >
                                  Exit On:{" "}
                                </Text>
                                <View style={{ flexDirection: "row" }}>
                                  <Text style={{ fontSize: hp("1.8%") }}>
                                    {this.renderCollapseData(
                                      "vldUpdated",
                                      item.sbMemID
                                    )}{" "}
                                  </Text>
                                  <Text style={{ fontSize: hp("1.8%") }}>
                                    {this.renderCollapseData(
                                      "vlExitT",
                                      item.sbMemID
                                    )}
                                  </Text>
                                </View>
                              </View>

                              <View
                                style={{
                                  flexDirection: "row",
                                  marginLeft: hp("3.3%")
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: hp("1.8%"),
                                    color: "#ff8c00"
                                  }}
                                >
                                  From:{" "}
                                </Text>
                                <Text style={{ fontSize: hp("1.8%") }}>
                                  {this.renderCollapseData(
                                    "vlexgName",
                                    item.sbMemID
                                  )}
                                </Text>
                              </View>
                            </View>
                          ) : (
                            <View></View>
                          )}
                        </View>
                      </View>
                    </View>
                  )}
                </Collapsible>
              </View>
            )}
            {/* <Text> {item.ntdCreated}</Text> */}
          </Card>
        </TouchableWithoutFeedback>
      );
    }
  };

  renderComponent = () => {
    const {
      loading,
      isCreateLoading,
      notifications,
      refresh,
      refreshNotifications,
      oyeURL,
      MyAccountID,
      footerLoading,
      page
    } = this.props;
    // console.log(loading)
    if (loading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff"
          }}
        >
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <Fragment>
          <FlatList
            keyExtractor={this.keyExtractor}
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }}
            ListFooterComponentStyle={{
              flex: 1,
              justifyContent: "flex-end"
            }}
            data={notifications}
            ListFooterComponent={() =>
              footerLoading ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginVertical: 10
                  }}
                >
                  <ActivityIndicator />
                </View>
              ) : null
            }
            renderItem={this.renderItem}
            extraData={this.props.notifications}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              // console.log("End Reached");
              // this.props.onEndReached(oyeURL, page, notifications, MyAccountID);
            }}
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={() => refreshNotifications(oyeURL, MyAccountID)}
                progressBackgroundColor="#fff"
                tintColor="#ED8A19"
                colors={["#ED8A19"]}
              />
            }
          />
        </Fragment>
      );
    }
  };

  render() {
    const { navigation, notifications, oyeURL, MyAccountID } = this.props;
    // const refresh = navigation.getParam("refresh", "NO-ID");
    // console.log(this.state.gateDetails, "gateDetails");
    // console.log("rendered");
    return (
      <View style={styles.container}>
        <NavigationEvents />

        <SafeAreaView style={{ backgroundColor: "#ff8c00" }}>
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
            <View style={{ flex: 0.2 }}></View>
          </View>
          <View style={{ borderWidth: 1, borderColor: "#ff8c00" }} />
        </SafeAreaView>

        <View style={{ flex: 1 }}>{this.renderComponent()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1
  },
  img: {
    width: hp("12%"),
    height: hp("12%"),
    borderColor: "orange",
    borderRadius: hp("6%"),
    // marginTop: hp("3%"),
    borderWidth: hp("0.2%")
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
  }
});

const mapStateToProps = state => {
  return {
    notifications: state.NotificationReducer.notifications,
    isCreateLoading: state.NotificationReducer.isCreateLoading,
    loading: state.NotificationReducer.loading,
    savedNoifId: state.AppReducer.savedNoifId,
    oyeURL: state.OyespaceReducer.oyeURL,
    mediaupload: state.OyespaceReducer.mediaupload,
    noImage: state.OyespaceReducer.noImage,
    MyAccountID: state.UserReducer.MyAccountID,
    refresh: state.NotificationReducer.refresh,
    page: state.NotificationReducer.page,
    footerLoading: state.NotificationReducer.footerLoading
  };
};

export default connect(
  mapStateToProps,
  {
    onNotificationOpen,
    storeOpenedNotif,
    getNotifications,
    refreshNotifications,
    toggleCollapsible,
    onEndReached
  }
)(NotificationScreen);
