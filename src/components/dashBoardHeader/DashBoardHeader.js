import React from "react";
import {Text, View, TouchableOpacity, Image, StatusBar, SafeAreaView} from "react-native";
import base from "../../base";
import {connect, Provider} from "react-redux";
import HeaderStyles from "./HeaderStyles";
import { Avatar, Badge, Icon, withBadge } from "react-native-elements";
import { NavigationEvents } from "react-navigation";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Dashboard from "../../screens/Resident/Dashboard/Dashboard";

class DashBoardHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ImageSource: null,
            datasource: null,
            myFirstName: "",
            role:''
        };
    }

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
      
    };

    getRoleName(roleId){
        switch(roleId){
          case 1:
            return "Admin"
          case 2:
            return "Owner"
          case 3:
            return "Tenant"
          default:
            return ""
        }
    }

  

  render() {
    console.log(
      "State in dashboard header:",this.state
    );
    console.log("DASHREDUCER",this.props.dashboardReducer)
    return (
      <SafeAreaView style={{backgroundColor: "#ff8c00"}}>
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
              {
                this.props.userReducer.SelectedAssociationID!=null?
                <Text style={HeaderStyles.statusText} numberOfLines={1}>
                {
                  this.props.userReducer.SelectedAssociationID!=null?this.getRoleName(this.props.dashboardReducer.role):""
                }                
              </Text>:<View/>
              }
              
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
      </SafeAreaView>

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
        userReducer: state.UserReducer,
        dashboardReducer: state.DashboardReducer
    };
};

export default connect(mapStateToProps)(DashBoardHeader);