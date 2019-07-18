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
import { NavigationEvents } from "react-navigation";
import { Avatar, Badge, Icon, withBadge } from "react-native-elements";
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
        // console.log(responseJson);
        this.setState({
          datasource: responseJson,
          myFirstName: responseJson.data.account[0].acfName
        });
      })
      .catch(error => console.log(error));
    // )
  };

  renderBadge = () => {
    const { notifications } = this.props;

    let count = 0;

    notifications.map((data, index) => {
      if (!data.read) {
        count += 1;
      }
    });

    const BadgedIcon = withBadge(count)(Icon);

    if (count >= 1) {
      return (
        <BadgedIcon
          color="#FF8C00"
          type="material"
          name="notifications"
          size={hp("4%")}
        />
      );
    } else
      return (
        <Icon
          color="#FF8C00"
          type="material"
          name="notifications"
          size={hp("4%")}
        />
      );

    console.log("count", count);
  };

  render() {
    return (
      <SafeAreaView style={{ backgroundColor: "orange" }}>
        <NavigationEvents
          onDidFocus={payload => this.myProfile()}
          onWillBlur={payload => this.myProfile()}
        />
        <View
          style={[
            styles.viewStyle,
            { flexDirection: "row", justifyContent: "space-between" }
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              // justifyContent: "center",
              alignItems: "center",
              marginLeft: 8,
              flex: 1
            }}
          >
            <TouchableOpacity
              onPress={() => this.props.navigate.navigate("MyProfileScreen")}
              style={{
                flexDirection: "row",
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  borderColor: "orange",
                  borderWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10
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
                      // justifyContent: "center",
                      alignItems: "center"
                    }}
                    source={{
                      uri:
                        // this.props.viewImageURL +
                        this.props.imageUrl +
                        "PERSONAssociation8NONREGULAR9447679600.jpg" +
                        this.props.MyAccountID +
                        ".jpg" +
                        "?random_number=" +
                        new Date().getTime()
                    }}
                  />
                ) : (
                  <Text style={{ fontWeight: "bold" }}>
                    {this.state.myFirstName.length.toString() === 0 ? (
                      <Text />
                    ) : (
                      <Text>{this.state.myFirstName[0]}</Text>
                    )}
                  </Text>
                )}
              </View>
              <Text style={{ fontWeight: "bold" }}>
                {this.state.myFirstName.length.toString() > 6 ? (
                  <Text>{this.state.myFirstName.substring(0, 6)}</Text>
                ) : (
                  this.state.myFirstName
                )}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 1,
              height: hp("7%"),
              width: 100,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
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
              alignItems: "flex-end",
              marginRight: 23,
              flex: 1
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
                {this.renderBadge()}
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
    viewImageURL: state.OyespaceReducer.viewImageURL,
    imageUrl: state.OyespaceReducer.imageUrl,
    notifications: state.NotificationReducer.notifications
  };
};

export default connect(mapStateToProps)(Header);
