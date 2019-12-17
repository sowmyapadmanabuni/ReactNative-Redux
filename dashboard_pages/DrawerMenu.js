import React, { Component } from 'react';
import { View, StyleSheet, Image, Text,TouchableOpacity,FlatList } from 'react-native';
import HeaderStyles from '../src/components/dashBoardHeader/HeaderStyles';
import base from '../src/base';
import { connect } from 'react-redux';
import { Icon, withBadge } from 'react-native-elements';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MarqueeText from 'react-native-marquee';
import SettingsScreen from "./SettingsScreen";
 
class DrawerMenu extends Component {
    constructor(props) {
        super(props);
        console.log(this.props)
        this.state={
            menu:[{
                id:0,
                icon:require('../icons/settings_menu.png'),
                title:'Settings'
            },
            {
                id:1,
                icon:require('../icons/info_menu.png'),
                title:'About Us'
            }]
        }
    }

    getRoleName(roleId) {
        console.log("roleId_menu",roleId)
        console.log(
          'State in dashboard header_MENU:',
          this.props.dashboardReducer,
          this.props.dashboardReducer.dropdown1,
          this.props.dashboardReducer.selectedDropdown1
        );
        let dropDown = this.props.dashboardReducer.dropdown1;
        console.log("dropDown_MENU",dropDown)
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
            console.log(e)
          return '';
        }
      }

      renderMenuItems(menu, index){
          //borderBottomColor:'#00000010',borderBottomWidth:1
          /*return(
            <View style={{height:48,width:'100%',flexDirection:'row',alignItems:'center'}}>
                <Image style={{height:22,width:22}} source={menu.icon}/>
                <Text style={{alignSelf:'center',paddingHorizontal:4,marginLeft:8}}>{menu.title}</Text>
            </View>
          )*/
          return(
              <TouchableOpacity
                  style={{height:48,width:'100%',alignItems:'center',flexDirection:'row'}}
                  onPress={()=> this.props.navigation.navigate("settingsScreen")}
              >
                      <Image style={{height:22,width:22}} source={menu.icon}/>
                      <Text style={{alignSelf:'center',paddingHorizontal:4,marginLeft:8}}>{menu.title}</Text>
              </TouchableOpacity>
          )
      }

    render(){
        console.log("MENU_IMG",this.props.userReducer.userProfilePic)
        console.log('https://mediaupload.oyespace.com/' +
        base.utils.strings.noImageCapturedPlaceholder)
        console.log(this.props.userReducer.SelectedAssociationID)
        let role = this.props.userReducer.SelectedAssociationID != null
        ? this.getRoleName(this.props.dashboardReducer.role)
        : '';
        console.log("ROLE_STATE",role)
        return(
            <View style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#fff', flexDirection:'column',               
                paddingTop: 0,paddingHorizontal:8,borderLeftWidth:0,borderLeftColor:'orange'
              }}>   
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center', height:64,borderBottomWidth:1,borderBottomColor:'orange'}}>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                <TouchableOpacity
                onPress={() => this.props.navigation.navigate('MyProfileScreen')}
                >
              {this.props.userReducer.userProfilePic === null ||
              this.props.userReducer.userProfilePic === '' ? (
                <Image
                  style={[HeaderStyles.imageStyles,{height:42,width:42,borderRadius:42/2}]}
                  source={{
                    uri:
                      'https://mediaupload.oyespace.com/' +
                      base.utils.strings.noImageCapturedPlaceholder
                  }}
                />
              ) : (
                <Image
                style={[HeaderStyles.imageStyles,{height:42,width:42,borderRadius:42/2}]}
                  source={{
                    uri:
                      'http://mediaupload.oyespace.com/' +
                      this.props.userReducer.userProfilePic
                  }}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={[HeaderStyles.textContainer,{alignSelf:'center',justifyContent:'center',alignItems:'center',width:'100%'}]}>
                <TouchableOpacity
                style={{justifyContent:'center'}}
                  onPress={() => {
                    this.props.navigation.navigate('MyProfileScreen');
                  }}
                >
                  <MarqueeText
                    style={[HeaderStyles.residentName]}
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
                    role!=''?
                  <Text style={[HeaderStyles.statusText,{alignSelf:'flex-start',marginLeft:2}]} numberOfLines={1}>
                    {this.props.userReducer.SelectedAssociationID != null
                      ? this.getRoleName(this.props.dashboardReducer.role)
                      : ''}
                  </Text>:<View/>
                ) : (
                  <View style={{width:4,height:4,backgroundColor:'#000'}} />
                )}
              </View>
            </TouchableOpacity>
            </View>
            <View>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('MyProfileScreen');
              }}
            >
              <View style={[HeaderStyles.qrcode]}>
                <Image
                  style={[HeaderStyles.qrcodeStyles]}
                  source={require('../icons/qr_profile.png')}
                />
              </View>
            </TouchableOpacity>
            </View>
         
            </View>
            
            <FlatList
                    style={{marginTop:32}}
                            keyExtractor={(item, index) => index.toString()}
                            data={this.state.menu}                            
                            renderItem={(item, index) => this.renderMenuItems(item.item, index)}
                            />
              
              <View style={{position:'absolute',bottom:0,paddingHorizontal:8,paddingVertical:8,justifyContent:'center',witdh:'100%'}}>
                    <Text style={{color:'orange',alignSelf:'center',fontSize:12}}>Version 10.19</Text>
              </View>
            </View>
        )
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
  
  export default connect(mapStateToProps)(DrawerMenu);