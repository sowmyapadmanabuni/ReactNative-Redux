import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { State } from "react-native-gesture-handler";
import { NavigationEvents } from "react-navigation";

import { connect } from "react-redux";

class Header extends React.Component {
  state = {
    ImageSource: null,
    datasource: null,
    myFirstName: ""
  };

  componentDidMount() {
    this.myProfile();
  }
  myProfile = () => {
    // console.log("________\n before fetch");
    fetch(
      `http://${this.props.oyeURL}/oyeliving/api/v1/GetAccountListByAccountID/${
        this.props.MyAccountID
      }`,
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
      })
      .catch(error => console.log(error));
    // )
  };
  render() {
    return (
      <SafeAreaView style={{ backgroundColor: "orange" }}>
        <NavigationEvents
          onDidFocus={payload => this.myProfile()}
          onWillBlur={payload => this.myProfile()}
        />
        <View style={[styles.viewStyle, { flexDirection: "row" }]}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 8
            }}
          >
            <TouchableOpacity
              onPress={() => this.props.navigate.navigate("MyProfileScreen")}
            >
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  borderColor: "orange",
                  borderWidth: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {this.state.ImageSource != null ? (
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      borderColor: "orange",
                      borderWidth: 1,
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                    source={{
                      uri:
                        this.props.viewImageURL +
                        "PERSON" +
                        this.props.MyAccountID +
                        ".jpg" +
                        "?random_number=" +
                        new Date().getTime()
                    }}
                  />
                ) : (
                  <Text>{this.props.MyFirstName[0].toUpperCase()}</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 20,
              height: hp("7%"),
              width: 100,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginLeft: hp("1%")
              }}
            >
              <Text style={{ fontWeight: "bold" }}>
                {this.state.myFirstName.length.toString() > 6
                  ? <Text>{this.state.myFirstName.substring(0, 6)}.</Text>
                  : this.state.myFirstName}
              </Text>
            </View>
            <View
              style={{
                flex: 2,
                height: hp("7%"),
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                style={[styles.image]}
                source={require("../icons/OyeSpace.png")}
              />
            </View>
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginRight: 8
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => this.props.navigate.navigate("NotificationScreen")}
            >
              <View
                style={{
                  flex: 0.2,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Image
                  source={require("../icons/notifications.png")}
                  style={{
                    width: hp("4.5%"),
                    height: hp("4%"),
                    justifyContent: "center",
                    alignItems: "flex-end"
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View style={{ borderWidth: 1, borderColor: "orange" }} />
      </SafeAreaView>
    );
  }
}

const styles = {
  viewStyle: {
    backgroundColor: "#fff",
    height: hp("7%"),
    width: Dimensions.get("screen").width,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: "relative"
  },
  image: {
    width: wp("17%"),
    height: hp("12%"),
    marginRight: 30
  }
};

const mapStateToProps = state => {
  return {
    oyeURL: state.OyespaceReducer.oyeURL,
    MyAccountID: state.UserReducer.MyAccountID,
    MyFirstName: state.UserReducer.MyFirstName,
    viewImageURL: state.OyespaceReducer.viewImageURL
  };
};

export default connect(mapStateToProps)(Header);
