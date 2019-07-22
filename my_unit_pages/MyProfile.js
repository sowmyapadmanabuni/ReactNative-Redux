import React, {Component} from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
// import Header from "./src/components/common/Header";
import {Button} from "native-base";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {NavigationEvents} from "react-navigation";
import {connect} from 'react-redux';
import DeviceInfo from 'react-native-device-info';

class MyProfile extends Component {
  state = {
    ImageSource: null,
    datasource: null
  }

  static navigationOptions = {
    title: "My Profile",
    header: null
  }

  myProfile = () => {
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
          console.log(responseJson)
          this.setState({
            datasource: responseJson,
            ImageSource: responseJson.data.account[0].acImgName
          })
        })
        .catch(error => console.log(error))
  }

  componentDidMount() {
    this.myProfile()
  }

  render() {
    // YellowBox.ignoreWarnings(["Warning:"])
    const {navigate} = this.props.navigation
    return (
        <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss()
            }}
        >
          <View style={styles.mainViewStyle}>
            {/* <Header /> */}
            <SafeAreaView style={{backgroundColor: "orange"}}>
              <View style={[styles.viewStyle1, {flexDirection: "row"}]}>
                <View style={styles.viewDetails1}>
                  <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate("ResDashBoard")
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
                      style={[styles.image]}
                      source={require("../icons/headerLogo.png")}
                  />
                </View>
                <View style={{flex: 0.2}}>
                  {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
                </View>
              </View>
              <View style={{borderWidth: 1, borderColor: "orange"}}/>
            </SafeAreaView>

            <NavigationEvents
                onDidFocus={payload => this.myProfile()}
                onWillBlur={payload => this.myProfile()}
            />

            <View style={styles.mainContainer}>
              <View style={styles.textWrapper}>
                <ScrollView style={styles.scrollViewStyle}>
                  <View style={styles.myProfileFlexStyle}>
                    <View style={styles.emptyViewStyle}/>
                    <View style={styles.viewForMyProfileText}>
                      <Text style={{fontSize: hp("2.5%"), color: "#ff8c00"}}>
                        My Profile
                      </Text>
                    </View>

                    <View style={styles.editButtonViewStyle}>
                      <TouchableOpacity
                          onPress={() => {
                            navigate("EditProfileScreen", {
                              profileDataSourceFirstName: this.state.datasource
                                ? this.state.datasource.data.account[0].acfName
                                : "",
                              profileDataSourceLastName: this.state.datasource
                                ? this.state.datasource.data.account[0].aclName
                                : "",
                              profileDataSourceIsdCode: this.state.datasource
                                ? this.state.datasource.data.account[0].acisdCode.substring(
                                    0,
                                    this.state.datasource.data.account[0].acisdCode
                                      .length - 2
                                  )
                                : "",
                              profileDataSourceIsdCode1: this.state.datasource
                                ? this.state.datasource.data.account[0].acisdCode1.substring(
                                    0,
                                    this.state.datasource.data.account[0].acisdCode1
                                      .length - 2
                                  )
                                : "",
                              profileDataSourceCca2: this.state.datasource
                                ? this.state.datasource.data.account[0].acisdCode
                                    .toString()
                                    .slice(-2)
                                : "",
                              profileDataSourceCca3: this.state.datasource
                                ? this.state.datasource.data.account[0].acisdCode1
                                    .toString()
                                    .slice(-2)
                                : "",
                              profileDataSourceMobileNumber: this.state.datasource
                                ? this.state.datasource.data.account[0].acMobile
                                : "",
                              profileDataSourceAlternateMobileNum: this.state
                                .datasource
                                ? this.state.datasource.data.account[0].acMobile1
                                : "",
                              profileDataSourceEmail: this.state.datasource
                                ? this.state.datasource.data.account[0].acEmail
                                : "",
                              profileDataSourceAlternateEmail: this.state.datasource
                                ? this.state.datasource.data.account[0].acEmail1
                                : "",
                              profileDataSourceImageName: this.state.datasource
                                ? this.state.datasource.data.account[0].acImgName
                                : ""
                            })
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
                      {this.state.ImageSource == null ? (
                          <Image
                              style={styles.profilePicImageStyle}
                              source={require("../icons/camwithgradientbg.png")}
                          />
                      ) : (
                          <Image
                              style={styles.profilePicImageStyle}
                              source={{
                                uri:
                                    "http://mediauploaddev.oyespace.com/Images/" +
                                    this.state.ImageSource
                              }}
                          />
                      )}
                    </View>
                  </View>

                  <View style={{alignItems: "center", marginBottom: hp("4%")}}>
                    <Text style={styles.itemTextValues1}>
                      {this.state.datasource
                          ? this.state.datasource.data.account[0].acfName +
                          " " +
                          this.state.datasource.data.account[0].aclName
                          : null}
                    </Text>
                  </View>
                  <View
                      style={{
                        marginLeft: hp("2%"),
                        marginBottom: hp("0.5%"),
                        flexDirection: "row"
                      }}
                  >
                    <Image
                        style={styles.editButtonImageStyle1}
                        source={require("../icons/call.png")}
                    />
                    <Text style={styles.itemTextValues}>
                      {this.state.datasource
                          ? " " +
                          this.state.datasource.data.account[0].acisdCode.substring(
                              0,
                              this.state.datasource.data.account[0].acisdCode
                                  .length 
                          ) +
                          " " +
                          this.state.datasource.data.account[0].acMobile
                          : null}
                    </Text>
                  </View>
                  <View
                      style={{
                        marginLeft: hp("2%"),
                        marginBottom: hp("3%"),
                        flexDirection: "row"
                      }}
                  >
                    <Image
                        style={styles.editButtonImageStyle1}
                        source={require("../icons/mail.png")}
                    />
                    <Text style={styles.itemTextValues}>
                      {this.state.datasource
                          ? "  " + this.state.datasource.data.account[0].acEmail
                          : null}
                    </Text>
                  </View>

                  <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                  >
                    <View>
                      <Button bordered style={styles.button1}
                              onPress={() => this.props.navigation.navigate('CreateAssnScreen')}>
                        <Text>Create Association</Text>
                      </Button>
                      <View/>
                      <View style={{marginTop: hp("2%")}}>
                        <Button bordered style={styles.button1}
                                onPress={() => this.props.navigation.navigate('AssnListScreen')}>
                          <Text>Join Existing Association</Text>
                        </Button>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </View>
              <View style={{bottom: hp('3%'), alignItems: 'flex-end', right: hp('3%')}}>
                <Text>Version: - {DeviceInfo.getVersion()}</Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
    )
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

    paddingHorizontal: hp("1.4%"),

    backgroundColor: "#fff",
    flexDirection: "column"
  },
  myProfileFlexStyle: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: hp("2%")
  },
  emptyViewStyle: {
    flex: 3
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
    flex: 1.5,
    alignItems: "center",
    justifyContent: "center"
  },
  editButtonImageStyle: {
    width: hp("3.5%"),
    height: hp("3.5%")
  },
  editButtonImageStyle1: {
    width: hp("3.5%"),
    height: hp("3.5%")
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
    marginBottom: hp("2%")
  },
  profilePicImageStyle: {
    width: 110,
    height: 110,
    borderColor: "orange",
    borderRadius: 55,
    // borderWidth: hp("0.2%") / PixelRatio.get()
    borderWidth: hp("0.2%")
  },

  itemTextValues: {
    fontSize: hp("2%"),
    fontWeight: "300",
    paddingTop: hp("0.8%"),
    paddingHorizontal: 0,

    alignItems: "flex-start",
    justifyContent: "flex-start",
    color: "#474749"
  },
  itemTextValues1: {
    fontSize: hp("2.2%"),
    fontWeight: "500",
    paddingTop: hp("0.8%"),
    paddingHorizontal: 0,

    alignItems: "flex-start",
    justifyContent: "flex-start",
    color: "#474749"
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

  image: {
    width: wp("24%"),
    height: hp("10%")
  },
  button1: {
    width: hp("40%"),
    justifyContent: "center"
  },

  viewDetails2: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: hp("3%"),
    height: hp("3%"),
    marginTop: 5
    // marginLeft: 10
  },
  viewDetails1: {
    flex: 0.3,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 3
  }
})


const mapStateToProps = state => {
  return {
    oyeURL: state.OyespaceReducer.oyeURL,
    MyAccountID: state.UserReducer.MyAccountID,
    viewImageURL: state.OyespaceReducer.viewImageURL,
    imageUrl: state.OyespaceReducer.imageUrl,
    SelectedAssociationID: state.UserReducer.SelectedAssociationID,
  }
}

export default connect(mapStateToProps)(MyProfile);