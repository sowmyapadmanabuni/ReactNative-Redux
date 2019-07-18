import React from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import base from "../../base";
import { connect } from "react-redux";
import HeaderStyles from "./HeaderStyles";

class DashBoardHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ImageSource: null,
      datasource: null
    };
  }

  componentDidMount() {
    this.myProfile();
  }
  myProfile = () => {
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
          ImageSource: responseJson.data.account[0].acImgName
        });
        console.log("gggg", datasource);
      })
      .catch(error => console.log(error));
  };

  render() {
    base.utils.logger.log(
      this.props.viewImageURL +
        "PERSON" +
        this.props.MyAccountID +
        ".jpg" +
        "?random_number=" +
        new Date().getTime()
    );

    return (
      <View style={HeaderStyles.container}>
        <View style={HeaderStyles.subContainerLeft}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("MyProfileScreen")}
          >
            {/* <Image style={HeaderStyles.imageStyles}
                               source={{uri:'https://via.placeholder.com/150/ff8c00/FFFFFF'}}>
                        </Image> */}
            {this.state.ImageSource == null ? (
              <Image
                style={HeaderStyles.imageStyles}
                source={{
                  uri: "https://via.placeholder.com/150/ff8c00/FFFFFF"
                }}
              />
            ) : (
              <Image
                style={HeaderStyles.imageStyles}
                source={{
                  uri:
                    "http://mediauploaddev.oyespace.com/Images/" +
                    this.state.ImageSource
                }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={HeaderStyles.textContainer}>
              <Text
                style={HeaderStyles.residentName} //{this.props.userName} {this.props.userStatus}
                numberOfLines={1}
              >
                {this.state.datasource
                  ? this.state.datasource.data.account[0].acfName
                  : null}
              </Text>
              <Text style={HeaderStyles.statusText} numberOfLines={1}>
                Owner
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={HeaderStyles.subContainerRight}>
          <Image
            style={HeaderStyles.appLogoStyles}
            source={require("../../../icons/headerLogo.png")}
          />
        </View>
        <View style={HeaderStyles.subContainerRight}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("NotificationScreen")}
          >
            <Image
              style={HeaderStyles.logoStyles}
              source={require("../../../icons/notifications.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    OyespaceReducer: state.OyespaceReducer,
    oyeURL: state.OyespaceReducer.oyeURL,
    MyAccountID: state.UserReducer.MyAccountID,
    MyFirstName: state.UserReducer.MyFirstName,
    viewImageURL: state.OyespaceReducer.viewImageURL
  };
};

export default connect(mapStateToProps)(DashBoardHeader);
