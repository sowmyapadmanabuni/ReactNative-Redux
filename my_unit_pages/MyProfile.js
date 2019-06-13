import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  PixelRatio,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  SafeAreaView
} from "react-native";
// import Header from "./src/components/common/Header";
import { Card, Item, Button } from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { NavigationEvents } from "react-navigation";
import { connect } from 'react-redux';

class MyProfile extends Component {
  state = {
    ImageSource: null,
    datasource: null,
    myFirstName:"",
  };

  static navigationOptions = {
    title: "My Profile",
    header: null
  };

  myProfile = () => {
    console.log("________\n before fetch");
    fetch(
      `http://${this.props.oyeURL}/oyeliving/api/v1/GetAccountListByAccountID/${this.props.MyAccountID}`,
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
          datasource: responseJson,
          myFirstName: responseJson.data.account[0].acfName
        });
        console.log("gghdsfjksdhfksdhkfsklfklsdjgg", this.state.datasource);
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", this.state.myFirstName);
        // global.myName = this.state.myFirstName;
        // console.log("#############", global.myName);  
      })
      .catch(error => console.log(error));
    // )
  };

  componentDidMount() {
    this.myProfile(); 
    
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.mainViewStyle}>
          {/* <Header /> */}
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
            onDidFocus={payload => this.myProfile()}
            onWillBlur={payload => this.myProfile()}
          />

          <View style={styles.mainContainer}>
            <View style={styles.textWrapper}>
              <ScrollView style={styles.scrollViewStyle}>
                <View style={styles.myProfileFlexStyle}>
                  <View style={styles.emptyViewStyle} />
                  <View style={styles.viewForMyProfileText}>
                    <Text style={styles.myProfileTitleStyle}>
                      {this.state.datasource
                        ? this.state.datasource.data.account[0].acfName.trim() !=
                          ""
                          ? this.state.datasource.data.account[0].acfName.trim() +
                            "'s "
                          : "My "
                        : "My "}
                      Profile
                    </Text>
                  </View>

                  <View style={styles.editButtonViewStyle}>
                    <TouchableOpacity
                      onPress={() => {
                        navigate("EditProfileScreen", {
                          profileDataSourceFirstName: this.state.datasource.data
                            .account[0].acfName,
                          profileDataSourceLastName: this.state.datasource.data
                            .account[0].aclName,
                          profileDataSourceEmail: this.state.datasource.data
                            .account[0].acEmail,
                          profileDataSourceAlternateEmail: this.state.datasource
                            .data.account[0].acEmail1
                        });
                      }}
                    >
                      <Image
                        style={styles.editButtonImageStyle}
                        source={require("../icons/edit.png")}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.containerView_ForProfilePicViewStyle}>
                  <View style={styles.viewForProfilePicImageStyle}>
                  {this.state.ImageSource != null 
                  ?
                  <Image
                  style={styles.profilePicImageStyle}
                  source={ 
                      {
                          uri: this.props.viewImageURL + 'PERSON' +
                          this.props.MyAccountID +
                          '.jpg'+'?random_number=' +new Date().getTime(),
                      }
                      }
                  />
                  :
                  <Image
                  style={styles.profilePicImageStyle}
                  source={ require("../icons/camwithgradientbg.png")}
                  />
                  }

                    {/* <Image
                      style={styles.profilePicImageStyle}
                      source={this.state.ImageSource != null ? 
                        {
                          uri: global.viewImageURL + 'PERSON' +
                            global.MyAccountID +
                            '.jpg'+'?random_number=' +new Date().getTime(),
                        }:
                        require("../icons/camwithgradientbg.png") 

                  
                        }
                    /> */}
                  </View>
                </View>

                <View>
                  <Card style={styles.myProfileCardsStyle}>
                    {/* <Item stackedLabel style={styles.cardItemsStyle}> */}
                    <Text style={styles.itemTextTitles}>First Name</Text>
                    {/* <View
                      style={{
                        borderColor: "#bfbfbf",
                        borderBottomWidth: hp("0.1%"),
                        paddingBottom: hp("0.2%"),
                        // paddingRight: hp("33.5%")
                      }}
                    > */}
                    <Text style={styles.itemTextValues}>
                      {this.state.datasource
                        ? this.state.datasource.data.account[0].acfName
                        : null}
                    </Text>
                    {/* </View> */}
                    {/* </Item> */}
                  </Card>
                </View>

                <View>
                  <Card style={styles.myProfileCardsStyle}>
                    {/* <Item stackedLabel style={styles.cardItemsStyle}> */}
                    <Text style={styles.itemTextTitles}>Last Name</Text>
                    {/* <View
                      style={{
                        borderColor: "#bfbfbf",
                        borderBottomWidth: hp("0.1%"),
                        paddingBottom: hp("0.2%"),
                        // paddingRight: hp("33.5%")
                      }}
                    > */}
                    <Text style={styles.itemTextValues}>
                      {this.state.datasource
                        ? this.state.datasource.data.account[0].aclName
                        : null}
                    </Text>
                    {/* </View> */}
                    {/* </Item> */}
                  </Card>
                </View>

                <View>
                  <Card style={styles.myProfileCardsStyle}>
                    {/* <Item stackedLabel style={styles.cardItemsStyle}> */}
                    <Text style={styles.itemTextTitles}>Email</Text>
                    {/* <View
                      style={{
                        borderColor: "#bfbfbf",
                        borderBottomWidth: hp("0.1%"),
                        paddingBottom: hp("0.2%"),
                        // paddingRight: hp("33.5%")
                      }}
                    > */}
                    <Text style={styles.itemTextValues}>
                      {this.state.datasource
                        ? this.state.datasource.data.account[0].acEmail
                        : null}
                    </Text>
                    {/* </View> */}
                    {/* </Item> */}
                  </Card>
                </View>

                <View>
                  <Card style={styles.myProfileCardsStyle}>
                    {/* <Item stackedLabel style={styles.cardItemsStyle}> */}
                    <Text style={styles.itemTextTitles}>Alternate Email </Text>
                    {/* <View
                      style={{
                        borderColor: "#bfbfbf",
                        borderBottomWidth: hp("0.1%"),
                        paddingBottom: hp("0.2%"),
                        paddingRight: hp("33.5%")
                      }}
                    > */}
                    <Text style={styles.itemTextValues}>
                      {this.state.datasource
                        ? this.state.datasource.data.account[0].acEmail1
                        : null}
                    </Text>
                    {/* </View> */}
                    {/* </Item> */}
                  </Card>
                </View>

                <View style={styles.viewForPaddingAboveAndBelowButtons}>
                  <Button bordered dark style={styles.buttonFamily} onPress={()=> this.props.navigation.navigate('VehicleListScreen')}>
                    <Text style={styles.textFamilyVehicle}>My Vehicles</Text>
                  </Button>
                  <Button bordered dark style={styles.buttonVehicle}>
                    <Text style={styles.textFamilyVehicle}>My Family</Text>
                  </Button>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  textWrapper: {
    height: hp("85%"),
    width: wp("95%")
  },
  mainViewStyle: {
    flex: 1
  },
  scrollViewStyle: {
    flex: 1
  },
  mainContainer: {
    flex: 1,
    // marginTop: 0,
    paddingHorizontal: hp("1.4%"),
    // paddingBottom: hp("80%"),
    backgroundColor: "#fff",
    flexDirection: "column"
  },
  myProfileFlexStyle: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: hp("2%")
    // marginBottom: 0
  },
  emptyViewStyle: {
    flex: 1
  },
  viewForMyProfileText: {
    flex: 4,
    justifyContent: "center",
    alignSelf: "center"
  },
  myProfileTitleStyle: {
    textAlign: "center",
    fontSize: hp("2.5%"),
    fontWeight: "500"
  },
  editButtonViewStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  editButtonImageStyle: {
    width: wp("7%"),
    height: hp("5%")
  },
  containerView_ForProfilePicViewStyle: {
    justifyContent: "center",
    alignItems: "center"
  },
  viewForProfilePicImageStyle: {
    width: wp("15%"),
    height: hp("15%"),
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("4%"),
    marginBottom: hp("8%"),
  },
  profilePicImageStyle: {
    width: 110,
    height: 110,
    borderColor: "orange",
    borderRadius: 55,
    borderWidth: hp("0.2%") / PixelRatio.get()
  },

  myProfileCardsStyle: {
    marginTop: hp("0.5%"),
    paddingHorizontal: hp("2%"),
    paddingVertical: hp("0.5%"),
    alignItems: "flex-start",
    justifyContent: "flex-start",
    height: hp("7%")
  },
  cardItemsStyle: {
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  itemTextTitles: {
    fontSize: hp("1.6%"),
    fontWeight: "300",
    // fontStyle: "italic",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    color: "#909091"
  },
  itemTextValues: {
    fontSize: hp("2%"),
    fontWeight: "300",
    paddingTop: hp("0.8%"),
    paddingHorizontal: 0,
    // paddingBottom: -8,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    color: "#474749"
  },

  viewForPaddingAboveAndBelowButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp("4%"),
    marginBottom: hp("2%"),
    marginHorizontal: hp("2%")
  },
  buttonVehicle: {
    width: wp("32%"),
    height: hp("5%"),
    borderRadius: hp("2.5%"),
    borderWidth: hp("0.2%"),
    borderColor: "orange",
    backgroundColor: "orange",
    justifyContent: "center"
  },
  buttonFamily: {
    width: wp("32%"),
    height: hp("5%"),
    borderRadius: hp("2.5%"),
    borderWidth: hp("0.2%"),
    borderColor: "#C3C3C3",
    backgroundColor: "#C3C3C3",
    justifyContent: "center"
  },
  textFamilyVehicle: {
    color: "white",
    fontWeight: "600",
    fontSize: hp("2%")
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

});

const mapStateToProps = state => {
    return {
        oyeURL: state.OyespaceReducer.oyeURL,
        MyAccountID: state.UserReducer.MyAccountID,
        viewImageURL: state.OyespaceReducer.viewImageURL
    }
}

export default connect(mapStateToProps)(MyProfile);