import React from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import base from "../../base";
import { connect } from "react-redux";
import HeaderStyles from "./HeaderStyles";
import { Avatar, Badge, Icon, withBadge } from "react-native-elements";
import { NavigationEvents } from "react-navigation";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";

class DashBoardHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ImageSource: null,
            datasource: null,
            myFirstName: ""
        };
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

    renderBadge = () => {
        const { notifications } = this.props;

        let count = 0;

        notifications.map((data, index) => {
            if (data.ntIsActive) {
                count += 1;
            }
        });

        const BadgedIcon = withBadge(count)(Icon);

        console.log(count, "count");
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

    /* componentDidMount() {
      let self = this;
      setTimeout(() => {
        self.myProfileNet();
      }, 500);
    }*/

    /* async myProfile(){
      console.log('AccId@@@@@',this.props)

      let response = await base.services.OyeLivingApi.getProfileFromAccount(
          this.props.MyAccountID
      );
      console.log("Joe",response);
      this.setState({
        datasource: response,
        ImageSource: response.data.account[0].acImgName
      });
    }*/

    myProfileNet = async () => {
        console.log("AccId@@@@@", this.props);
        let response = await base.services.OyeLivingApi.getProfileFromAccount(
            this.props.MyAccountID
        );
        console.log("Joe", response);
        this.setState({
            datasource: response,
            ImageSource: response.data.account[0].acImgName
        });
        // fetch(
        //   `https://apiuat.oyespace.com/oyeliving/api/v1/GetAccountListByAccountID/1`,
        //   {
        //     method: "GET",
        //     headers: {
        //       "Content-Type": "application/json",
        //       "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
        //     }
        //   }
        // )
        //   .then(response => response.json())
        //   .then(responseJson => {
        //     console.log(responseJson);

        //     this.setState({
        //       datasource: responseJson,
        //       ImageSource: responseJson.data.account[0].acImgName
        //     });
        //     console.log("gggg", datasource);
        //   })
        //   .catch(error => console.log(error));
    };

    render() {
        console.log(
            "State in dashboard header:",
            this.props.userReducer.userData,
            this.props.userReducer.userProfilePic
        );
        return (
            <View style={HeaderStyles.container}>
                <View style={HeaderStyles.subContainerLeft}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate("MyProfileScreen")}
                    >
                        {this.props.userReducer.userProfilePic === null ||
                        this.props.userReducer.userProfilePic === "" ? (
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
                                        this.props.userReducer.userProfilePic
                                }}
                            />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={HeaderStyles.textContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate("MyProfileScreen");
                                }}
                            >
                                <Text
                                    style={HeaderStyles.residentName} //{this.props.userName} {this.props.userStatus}
                                    numberOfLines={1}
                                >
                                    {this.props.userReducer.userData
                                        ? this.props.userReducer.userData.data.account[0].acfName
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
            />*/}
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
        notifications: state.NotificationReducer.notifications,
        userReducer: state.UserReducer
    };
};

export default connect(mapStateToProps)(DashBoardHeader);