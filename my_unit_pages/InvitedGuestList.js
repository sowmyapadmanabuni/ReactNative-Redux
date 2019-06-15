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
  ActivityIndicator,
  SafeAreaView,
  Dimensions
} from "react-native";
// import Header from "./src/components/common/Header";
import { Card, CardItem } from "native-base";
import { NavigationEvents } from "react-navigation";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import {connect} from 'react-redux';

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
      error: null
    };
    this.arrayholder = [];
  }
  componentDidMount() {
    this.getInvitationList();
  }

  getInvitationList = () => {
    fetch(
      `http://${this.props.oyeURL}/oye247/api/v1/Invitation/GetInvitationListByAssocID/${this.props.SelectedAssociationID}`,
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
          isLoading: false,
          dataSource: responseJson.data.invitation,
          error: responseJson.error || null,
          loading: false
        });
        this.arrayholder = responseJson.data.invitation;
      })
      .catch(error => {
        this.setState({ error, loading: false });
        console.log(error);
      });
  };

  searchFilterFunction = text => {
    this.setState({
      value: text
    });

    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.infName.toUpperCase()} ${item.inlName.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      dataSource: newData
    });
  };
  renderItem = ({ item, index }) => {
    // console.log(item,index)
    return (
      <View style={{ flexDirection: "column" }}>
        <View style={{ borderColor: "#707070", borderWidth: wp("0.1%") }} />
        <View
          style={[
            styles.listItem,
            {
              justifyContent: "space-between",
              paddingRight: 0,
              height: hp("15%")
            }
          ]}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.contactIcon}>
              {item.infName[0].toUpperCase()}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {item.infName} {item.inlName}
            </Text>
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.infoNumber}>{item.inMobile}</Text>
            </View>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end", paddingRight: 0 }}>
            <Card style={{ paddingTop: 0, }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("QRCodeGeneration", {
                    value: this.state.dataSource[index]
                  });
                }}
              >
                <CardItem bordered>
                  <Image
                    style={styles.images}
                    source={require("../icons/share.png")}
                  />
                </CardItem>
              </TouchableOpacity>
            </Card>
            <Card style={{ marginTop: 0, }}>
              <TouchableOpacity
                onPress={() => {
                  {
                    Platform.OS === "android"
                      ? Linking.openURL(`telprompt:${item.inMobile}`)
                      : Linking.openURL(`tel:${item.inMobile}`);
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
        <View style={{ borderColor: "#707070", borderWidth: wp("0.05%") }} />
      </View>
    );
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.contaianer}>
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
       
          <Text style={styles.titleOfScreen}>My Guests</Text>

          <View style={styles.progress}>
            <ActivityIndicator size="large" color="#F3B431" />
          </View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
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
          onDidFocus={payload => this.getInvitationList()}
          onWillBlur={payload => this.getInvitationList()}
        />
        <Text style={styles.titleOfScreen}> My Guests </Text>

        <TextInput
          style={styles.textinput}
          placeholder="search...."
          // lightTheme
          round
          onChangeText={this.searchFilterFunction}
        />
        <FlatList
          style={{ marginTop: hp('1.5%') }}
          data={this.state.dataSource.sort((a, b) =>
            a.infName.localeCompare(b.infName)
          )}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => item.inInvtID.toString()}
        />

        <TouchableOpacity
          style={[styles.floatButton, { alignSelf: "center", marginLeft: 2 }]}
          onPress={() => this.props.navigation.navigate("InviteGuestScreen")}
        >
          <Text
            style={{
              fontSize: hp('5%'),
              color: "#fff",
              fontWeight: "bold",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              marginBottom: hp('0.5%')
            }}
          >
            +
          </Text>
          {/* <Entypo 
                    name="plus"
                    size={30}
                    color="#fff"
                /> */}
        </TouchableOpacity>
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

  progress: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  textinput: {
    height: hp('6%'),
    borderWidth: hp('0.1%'),
    borderColor: "#fff",
    marginHorizontal: hp('1%'),
    paddingLeft: hp('2%'),
    fontSize: hp('3.5%'),
    backgroundColor: "#f4f4f4",
    borderRadius: hp('2%')
  },
  listItem: {
    flexDirection: "row",
    paddingLeft: hp("1.6%"),
    paddingRight: hp("1.6%"),
    paddingBottom: hp("2%"),
    paddingTop: hp("1%")
  },
  iconContainer: {
    width: hp("8%"),
    height: hp("8%"),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff8c00",
    borderRadius: 100,
    marginTop: hp("2%")
  },
  contactIcon: {
    fontSize: hp("3.5%"),
    color: "#fff"
  },
  infoContainer: {
    flexDirection: "column",
    paddingLeft: hp("1.6%"),
    paddingTop: hp("2%")
  },
  infoText: {
    fontSize: hp("2.5%"),
    fontWeight: "bold",
    paddingLeft: hp("1%"),
    color: "#000"
  },
  infoNumber: {
    fontSize: hp("2%"),
    fontWeight: "100",
    paddingLeft: hp("1%"),
    paddingTop: hp("1%"),
    color: "grey"
  },

  titleOfScreen: {
    marginTop: hp('1.5%'),
    textAlign: "center",
    fontSize: hp('2.4%'),
    fontWeight: "bold",
    marginBottom: hp('1.5%'),
    color:'#ff8c00'
  },

  floatButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0)",
    alignItems: "center",
    justifyContent: "center",
    width: hp('8%'),
    position: "absolute",
    bottom: hp('2.5%'),
    right: hp('2.5%'),
    height: hp('8%'),
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
  }
});

const mapStateToProps = state => {
  return {
    oyeURL: state.OyespaceReducer.oyeURL,
    SelectedAssociationID: state.UserReducer.SelectedAssociationID,
  };
};

export default connect(mapStateToProps)(MyGuests);
