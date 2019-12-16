import React from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import base from '../../base';
import { connect } from 'react-redux';
import HeaderStyles from './HeaderStyles';
import { Icon, withBadge } from 'react-native-elements';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MarqueeText from 'react-native-marquee';
import MenuDrawer from 'react-native-side-drawer'
import { DrawerActions } from 'react-navigation-drawer';

class DashBoardHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ImageSource: null,
      datasource: null,
      myFirstName: '',
      role: ''
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

    console.log(count, 'count');
    if (count >= 1) {
      return (
        <BadgedIcon
          color="#FF8C00"
          type="material"
          name="notifications"
          size={hp('4%')}
        />
      );
    } else
      return (
        <Icon
          color="#FF8C00"
          type="material"
          name="notifications"
          size={hp('4%')}
        />
      );
  };

  getRoleName(roleId) {
    console.log(
      'State in dashboard header:',
      this.props.dashboardReducer,
      this.props.dashboardReducer.dropdown1,
      this.props.dashboardReducer.selectedDropdown1
    );
    let dropDown = this.props.dashboardReducer.dropdown1;
    let myRole = roleId;
    for (let i = 0; i < dropDown.length; i++) {
      if (this.props.dashboardReducer.selectedDropdown1 === dropDown[i].name) {
        myRole = dropDown[i].myRoleId;
      }
    }
    try {
      //roleId = parseInt(roleId);
      if (myRole === 1) {
        return 'Owner'; //return 'Admin';
      } else if (myRole === 2) {
        return 'Owner';
      } else if (myRole === 3) {
        return 'Tenant';
      } else {
        return '';
      }
    } catch (e) {
      return '';
    }
  }

  openDrawer(){
    this.props.navigation.dispatch(DrawerActions.toggleDrawer());
  }

  render() {
    return (
      <SafeAreaView style={{ backgroundColor: '#ff8c00' }}>
        <View style={HeaderStyles.container}>
          <View style={HeaderStyles.subContainerLeft}>
            <TouchableOpacity onPress={()=>this.openDrawer()}>
            <Image
                  style={{height:24,width:24,alignSelf:'center'}}
                  source={require('../../../icons/menu_drawer.png')}
                />
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => this.props.navigation.navigate('MyProfileScreen')}
            >
              {this.props.userReducer.userProfilePic === null ||
              this.props.userReducer.userProfilePic === '' ? (
                <Image
                  style={HeaderStyles.imageStyles}
                  source={{
                    uri:
                      'https://mediaupload.oyespace.com/' +
                      base.utils.strings.noImageCapturedPlaceholder
                  }}
                />
              ) : (
                <Image
                  style={HeaderStyles.imageStyles}
                  source={{
                    uri:
                      'http://mediaupload.oyespace.com/' +
                      this.props.userReducer.userProfilePic
                  }}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={HeaderStyles.textContainer}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('MyProfileScreen');
                  }}
                >
                  <MarqueeText
                    style={HeaderStyles.residentName}
                    duration={3000}
                    marqueeOnStart
                    loop
                    marqueeDelay={1000}
                    marqueeResetDelay={1000}
                  >
                    {this.props.userReducer.userData
                      ? this.props.userReducer.userData.data.account[0].acfName
                      : null}
                  </MarqueeText>
                  
                </TouchableOpacity>
                {this.props.userReducer.SelectedAssociationID != null ? (
                  <Text style={HeaderStyles.statusText} numberOfLines={1}>
                    {this.props.userReducer.SelectedAssociationID != null
                      ? this.getRoleName(this.props.dashboardReducer.role)
                      : ''}
                  </Text>
                ) : (
                  <View />
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('MyProfileScreen');
              }}
            >
              <View style={HeaderStyles.qrcode}>
                <Image
                  style={HeaderStyles.qrcodeStyles}
                  source={require('../../../icons/qr_profile.png')}
                />
              </View>
            </TouchableOpacity>
          */}
          </View> 
          <View style={HeaderStyles.subContainerRight}>
            <Image
              style={HeaderStyles.appLogoStyles}
              source={require('../../../icons/OyespaceSafe.png')}
            />
          </View>
          <View style={HeaderStyles.subContainerRight}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('NotificationScreen')
              }
            >            
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
