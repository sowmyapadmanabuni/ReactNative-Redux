import React from "react";
import {Image, Text, TouchableOpacity, View} from "react-native";
import base from "../../base";
import {connect} from "react-redux";
import HeaderStyles from "./HeaderStyles";
import {Icon, withBadge} from "react-native-elements";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";

class DashBoardHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ImageSource: null,
      datasource: null,
      myFirstName: ""
    };

    this.myProfile = this.myProfile.bind(this);
  }

  // renderBadge = () => {
  //   const { notifications } = this.props;

  //   let count = 0;

  //   notifications.map((data, index) => {
  //     if (!data.read) {
  //       count += 1;
  //     }
  //   });

  //   const BadgedIcon = withBadge(count)(Icon);

  //   return (
  //     <Icon
  //       color="#FF8C00"
  //       type="material"
  //       name="notifications"
  //       size={hp("4%")}
  //     />
  //   );
  // };

  componentWillMount() {
    this.myProfile();
  }

  renderBadge = () => {
    const {notifications} = this.props;

    let count = 0;

    notifications.map((data, index) => {
      if (data.ntIsActive) {
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
    // return (
    //   <Icon
    //     color="#FF8C00"
    //     type="material"
    //     name="notifications"
    //     size={hp("4%")}
    //   />
    // );
  };

   static refreshProfile() {
    this.myProfile()
  }


  async myProfile() {

    const response = await base.services.OyeLivingApi.getProfileFromAccount(
        this.props.MyAccountID
    );
    console.log("Ressdsc:", response, this.props.MyAccountID);
    this.setState({
      datasource: response,
      ImageSource: response.data.account[0].acImgName
    });

  };

  render() {
    console.log("State in dashboard header:", this.state);
    return (
        <View style={HeaderStyles.container}>
          <View style={HeaderStyles.subContainerLeft}>
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate("MyProfileScreen")}
            >
              {this.state.ImageSource === null || this.state.ImageSource === "" ? (
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
                            "http://mediaupload.oyespace.com/" +
                            this.state.ImageSource
                      }}
                  />
              )}
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={HeaderStyles.textContainer}>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate("MyProfileScreen")}
                >
                  <Text
                      style={HeaderStyles.residentName} //{this.props.userName} {this.props.userStatus}
                      numberOfLines={1}
                  >
                    {this.state.datasource
                        ? this.state.datasource.data.account[0].acfName
                        : null}
                  </Text>
                </TouchableOpacity>
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
              {/* <Image
              style={HeaderStyles.logoStyles}
              source={require("../../../icons/notifications.png")}
            /> */}
              {this.renderBadge()}
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
    viewImageURL: state.OyespaceReducer.viewImageURL,
    notifications: state.NotificationReducer.notifications
  };
};

export default connect(mapStateToProps)(DashBoardHeader);
