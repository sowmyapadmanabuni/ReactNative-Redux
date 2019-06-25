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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

export default class admin extends React.Component {
  static navigationOptions = {
    title: "admin",
    header: null
  };
  render() {
    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
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
                    alignItems: 'flex-start',
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
                source={require("../../../icons/OyeSpace.png")}
              />
            </View>
            <View style={{ flex: 0.2 }}>
              {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
            </View>
          </View>
          <View style={{ borderWidth: 1, borderColor: "orange" }} />
        </SafeAreaView>
       
        
        <View style={styles.textWrapper}>
          <Text style={styles.admin1}>Administration</Text>

          <Card style={{ height: hp("68%") }}>
            <View style={{ flexDirection: "column", marginTop: hp("1%") }}>
              <View style={styles.view1}>
                <View style={styles.view2}>
                  <Image
                    source={require("../../../pages/assets/img/petrolling.png")}
                  />
                </View>
                  <View style={styles.view3}>
                     <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate("schedulePatrolling")
                        }
                      >
                      <View style={styles.view3}>
                        <Text style={styles.text1}>Patrolling Check Points</Text>
                      </View>
                     </TouchableOpacity>
                  </View>
                </View>
              <View style={styles.borderline} />
            </View>
            <View style={{ flexDirection: "column" }}>
              <View style={styles.view1}>
                <View style={styles.view2}>
                  <Image
                    source={require("../../../pages/assets/img/view_all_visitors1.png")}
                  />
                </View>
                <View style={styles.view3}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate("ViewAllVisitorsScreen")
                      }
                    >
                      <View style={styles.view3}>
                        <Text style={styles.text1}>View All Visitors</Text>
                      </View>
                    </TouchableOpacity>
                </View>
                
              </View>
              <View style={styles.borderline} />
            </View>
            <View style={{ flexDirection: "column" }}>
              <View style={styles.view1}>
                <View style={styles.view2}>
                  <Image source={require("../../../pages/assets/img/settings.png")} />
                </View>
                <View style={styles.view3}>
                  {/* <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("AdminSettingsScreen")
                    }
                  > */}
                    <View style={styles.view3}>
                      <Text style={styles.text1}>Admin Settings</Text>
                    </View>
                  {/* </TouchableOpacity> */}
              
                </View>
                </View>
              <View style={styles.borderline} />
            </View>
            <View style={{ flexDirection: "column" }}>
              <View style={styles.view1}>
                <View style={styles.view2}>
                  <Image
                    source={require("../../../pages/assets/img/join_asso.png")}
                  />
                </View>
                <View style={styles.view3}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate("AssnListScreen")
                      }
                    >
                      <View style={styles.view3}>
                        <Text style={styles.text1}>Join Association</Text>
                      </View>
                    </TouchableOpacity>
                </View>
                
              </View>
              <View style={styles.borderline} />
            </View>
            <View style={{ flexDirection: "column" }}>
              <View style={styles.view1}>
                <View style={styles.view2}>
                  <Image
                    source={require("../../../pages/assets/img/create_association1.png")}
                  />
                </View>
                <View style={styles.view3}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("CreateAssnScreen")
                  }
                >
                  <View style={styles.view3}>
                    <Text style={styles.text1}>Create Association</Text>
                  </View>
                </TouchableOpacity>
                </View>
                
              </View>
              <View style={styles.borderline} />
            </View>
            <View style={{ flexDirection: "column" }}>
              <View style={styles.view1}>
                <View style={styles.view2}>
                  <Image
                    source={require("../../../pages/assets/img/building2.png")}
                  />
                </View>
                <View style={styles.view3}>
                    {/* <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate("CreateBlockScreen")
                      }
                    > */}
                      <View style={styles.view3}>
                        <Text style={styles.text1}>Create Block and Units</Text>
                      </View>
                    {/* </TouchableOpacity> */}
                </View>
                
              </View>
              <View style={styles.borderline} />
            </View>
          </Card>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
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
  image1: {
    width: wp("17%"),
    height: hp("12%"),
    marginRight: hp("3%")
  },
  viewDetails2: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: hp("3%"),
    height: hp("3%"),
    marginTop: 5
    // marginLeft: 10
  },
  textWrapper: {
    height: hp("85%"), // 70% of height device screen
    width: wp("100%") // 80% of width device screen
  },
  admin1: {
    textAlign: "center",
    fontSize: hp("3%"),
    fontWeight: "500",
    marginTop: hp("2%"),
    marginBottom: hp("6%"),
    color: "#ff8c00"
  },
  borderline: {
    borderWidth: hp("0.08%"),
    borderColor: "#E8E8E8",
    width: wp("93%"),
    marginStart: hp("14%")
  },
  view1: {
    flexDirection: "row",
    height: hp("10%"),
    width: wp("99%")
  },
  view2: {
    alignContent: "flex-start",
    justifyContent: "center",
    marginLeft: hp("4%"),
    height: hp("10%"),
    width: wp("15%")
  },
  view3: {
    justifyContent: "center",
    marginLeft: hp("2%")
  },
  text1: {
    fontSize: hp("2.5%"),
    color: "#474749"
  }
});
