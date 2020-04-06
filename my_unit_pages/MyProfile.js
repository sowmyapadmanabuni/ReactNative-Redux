import React, { Component } from 'react';
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
  View,
  Platform,
  BackHandler
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Card, Button } from 'native-base';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import base from '../src/base';
import DashBoardHeader from '../src/components/dashBoardHeader/DashBoardHeader';
import { updateUserInfo } from '../src/actions';
import { QRCode } from 'react-native-custom-qr-codes';
import ProgressLoader from 'rn-progress-loader';

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import IcoMoonConfig from '../src/assets/selection.json';

const Icon = createIconSetFromIcoMoon(IcoMoonConfig);

class MyProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ImageSource: null,
      datasource: null,
      number: '',
     // isLoading: true
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.backButtonListener = null;
    this.currentRouteName = 'Main';
    this.lastBackButtonPress = null;
  }

  static navigationOptions = {
    title: 'My Profile',
    header: null
  };

  myProfile = () => {
    fetch(
      `http://${this.props.oyeURL}/oyeliving/api/v1/GetAccountListByAccountID/${this.props.MyAccountID}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1'
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log('My profile', responseJson);
        this.setState({
          
          datasource: this.props.dashBoardReducer.userData,
          ImageSource: this.props.dashBoardReducer.userProfilePic,
          number:
          this.props.dashBoardReducer.userQRCode +
            this.props.dashBoardReducer.assId
        });
       // const { updateUserInfo } = this.props;
        console.log(
          'Image at the second open',
          this.state.ImageSource,
          this.state.number
        );
        // updateUserInfo({
        //   prop: 'userData',
        //   value: responseJson
        // });
        // updateUserInfo({
        //   prop: 'userProfilePic',
        //   value: responseJson.data.account[0].acImgName
        // });
        this.setState({
          isLoading: false,
        })
          
       
      })
      .catch(error => console.log(error));
  };

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    console.log('Unit ID', this.props.dashBoardReducer.uniID);
    let self = this;
    // setTimeout(() => {
    //  // self.myProfile();
    //   self.setState({
    //     isLoading: false
    //   });
    // }, 1500);
    base.utils.validate.checkSubscription(
      this.props.SelectedAssociationID
    );
  }

  componentDidUpdate() {
    /*if (Platform.OS === 'android') {
      setTimeout(() => {
        BackHandler.addEventListener('hardwareBackPress', () =>
          this.processBackPress()
        );
      }, 100);
    }*/
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    // BackHandler.removeEventListener('backPress');
    //BackHandler.removeEventListener('hardwareBackPress', () => this.processBackPress());
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  processBackPress(stat) {
    console.log('Part', stat);
    const { goBack } = this.props.navigation;
    goBack(null);
    return true;
  }


  render() {
    console.log( 'State in My Profile:',this.props);
    const { navigate } = this.props.navigation;

    let userData= this.props.userReducer.userData;
    let userQR=this.props.userReducer.userQRCode +this.props.dashBoardReducer.assId
    console.log('Mobile number', this.state.number);
    return (
      <View style={styles.mainViewStyle}>
        {/* <Header /> */}
        <SafeAreaView style={{ backgroundColor: base.theme.colors.primary }}>
          <View style={[styles.viewStyle1, { flexDirection: 'row' }]}>
            <View style={styles.viewDetails1}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('ResDashBoard');
                }}
              >
                <View
                  style={{
                    height: hp('4%'),
                    width: wp('15%'),
                    alignItems: 'flex-start',
                    justifyContent: 'center'
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={require('../icons/back.png')}
                    style={styles.viewDetails2}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '35%',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Image
                style={[styles.image]}
                source={require('../icons/OyespaceSafe.png')}
              />
            </View>
            <View style={{ width: '35%' }}>
              {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
            </View>
          </View>
          <View style={{ borderWidth: 1, borderColor: 'orange' }} />
        </SafeAreaView>

        {/* <NavigationEvents
          onDidFocus={payload => this.myProfile()}
          onWillBlur={payload => this.myProfile()}
        /> */}

        <View style={styles.mainContainer}>
          <View style={styles.textWrapper}>
            <View style={styles.scrollViewStyle}>
              <View style={styles.myProfileFlexStyle}>
                <View style={styles.emptyViewStyle} />
                <View style={styles.viewForMyProfileText}>
                  <Text
                    style={{
                      fontSize: hp('2%'),
                      color: base.theme.colors.primary,
                      textAlign: 'center'
                    }}
                  >
                    My Profile / Resident ID
                  </Text>
                </View>
                <View style={styles.editButtonViewStyle}>
                  <TouchableOpacity
                    onPress={() => {
                      navigate('EditProfileScreen', {
                        firstName: userData.data.account[0]
                          .acfName,
                        lastName: userData.data.account[0].aclName,
                        primaryMobNum: userData.data.account[0]
                          .acMobile,
                        primeCCode: userData.data.account[0]
                          .acisdCode,
                        primeCName: userData.data.account[0]
                          .acCrtyCode,
                        alterMobNum: userData.data.account[0]
                          .acMobile1,
                        alterCCode: userData.data.account[0]
                          .acisdCode1,
                        alterCName: userData.data.account[0]
                          .acCrtyCode1,
                        primaryEmail: userData.data.account[0]
                          .acEmail,
                        alterEmail: userData.data.account[0]
                          .acEmail1,
                        myProfileImage: userData.data.account[0]
                          .acImgName
                      });
                    }}
                  >
                    <Icon
                      color={base.theme.colors.primary}
                      style={styles.editButtonImageStyle}
                      size={hp('2.8%')}
                      name="edit"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Card
                style={{
                  borderRadius: hp('3%'),
                  marginTop: hp('5%'),
                  width: Dimensions.get('window').width - 80,
                  // marginLeft: hp('5%'),
                  alignSelf: 'center',
                  zIndex: 1000,
                  elevation: 1000,
                  shadowColor: '#867F7F',
                  shadowOffset: {
                    height: 6
                  },
                  shadowOpacity: 0.2
                }}
              >
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: Dimensions.get('window').width - 80,
                    marginTop: hp('8%'),
                    alignSelf: 'center'
                  }}
                >
                  <Image
                    style={{
                      height: hp('16%'),
                      // marginRight: hp('2%'),
                      // marginLeft: hp('2%'),
                      position: 'absolute',
                      width: Dimensions.get('window').width - 80
                    }}
                    source={require('../icons/img_signup.png')}
                  />
                </View>
                <View style={styles.containerView_ForProfilePicViewStyle}>
                  <View style={styles.viewForProfilePicImageStyle}>
                  {this.props.userReducer.userProfilePic == '' || this.props.userReducer.userProfilePic==undefined || this.props.userReducer.userProfilePic==null
                    || this.props.userReducer.userProfilePic=="null"  ? (
                      <Image
                        style={{
                          ...styles.profilePicImageStyle,
                          position: 'relative'
                        }}
                        source={{
                          uri:
                            'https://mediaupload.oyespace.com/' +
                            base.utils.strings.noImageCapturedPlaceholder
                        }}
                      />
                    ) : (
                      <Image
                        style={{
                          ...styles.profilePicImageStyle,
                          position: 'relative'
                        }}
                        source={{
                          uri: 'data:image/png;base64,'+this.props.userReducer.userProfilePic
                        }}
                      />
                    )}
                  </View>
                </View>

                <View style={{ marginTop:hp('2%'),alignItems: 'center', marginBottom: hp('2%') }}>
                  <Text style={styles.itemTextValues1}>
                    {userData
                      ? userData.data.account[0].acfName +
                        ' ' +
                        userData.data.account[0].aclName
                      : null}
                  </Text>
                </View>
                 {userQR!== '' &&
                this.props.dashBoardReducer.dropdown.length !== 0 ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      //marginTop: hp('1%'),
                      marginBottom: hp('2%')
                    }}
                  >
                    <QRCode
                      logo={require('../icons/logo_QR.png')}
                      logoSize={hp('6%')}
                      size={hp('25%')}
                      content={userQR}
                      codeStyle="square"
                      outerEyeStyle="square"
                      innerEyeStyle="square"
                    />
                  </View>
                ) : null}
              </Card>

              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Image
                  style={{
                    width: Dimensions.get('window').width,
                    height: hp('4%'),
                    marginRight: hp('2%'),
                    marginLeft: hp('2%'),
                    position: 'absolute'
                  }}
                  source={require('../icons/shadow1.png')}
                />
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <View style={{ marginTop: hp('6%') }}>
                  <Button
                    bordered
                    warning
                    style={styles.button1}
                    onPress={() => this.props.navigation.navigate('City')}
                  >
                    <Text
                      style={{
                        fontSize: hp('2%'),
                        fontWeight: '500'
                      }}
                    >
                      Join Association
                    </Text>
                  </Button>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop:hp('2%'),
              bottom: hp('2%'),
              alignItems: 'flex-end',
              right: hp('3%')
            }}
          >
            <Text>Version: - {DeviceInfo.getVersion()}</Text>
          </View>
        </View>
        <ProgressLoader
          isHUD={true}
          isModal={true}
          visible={this.state.isLoading}
          color={base.theme.colors.primary}
          hudColor={base.theme.colors.white}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textWrapper: {
    height: hp('85%'),
    width: wp('95%')
  },
  mainViewStyle: {
    flex: 1
  },
  scrollViewStyle: {
    flex: 1
  },
  mainContainer: {
    flex: 1,

    paddingHorizontal: hp('1.4%'),

    backgroundColor: base.theme.colors.white,
    flexDirection: 'column'
  },
  myProfileFlexStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
    width: '100%'
  },
  emptyViewStyle: {
    width: hp('5%')
  },
  viewForMyProfileText: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  myProfileTitleStyle: {
    textAlign: 'center',
    fontSize: hp('2.5%'),
    fontWeight: '500'
  },
  editButtonViewStyle: {
    width: hp('5%'),
    alignItems: 'center',
    justifyContent: 'center'
  },
  editButtonImageStyle: {
    width: hp('3.5%'),
    height: hp('3.5%')
    // marginRight: 10
  },
  containerView_ForProfilePicViewStyle: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewForProfilePicImageStyle: {
    width: wp('15%'),
    height: hp('15%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%')
    // marginBottom: hp('2%')
  },
  profilePicImageStyle: {
    width: 110,
    height: 110,
    borderColor: 'orange',
    borderRadius: 55,
    // borderWidth: hp("0.2%") / PixelRatio.get()
    borderWidth: hp('0.2%')
  },

  itemTextValues: {
    fontSize: hp('2%'),
    fontWeight: '300',
    paddingTop: hp('0.8%'),
    paddingHorizontal: 0,

    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    color: base.theme.colors.textLight
  },
  itemTextValues1: {
    fontSize: hp('2.2%'),
    fontWeight: '500',
    paddingTop: hp('0.8%'),
    paddingHorizontal: 0,

    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    color: base.theme.colors.textLight
  },

  viewStyle1: {
    backgroundColor: base.theme.colors.white,
    height: hp('7%'),
    width: '100%',
    shadowColor: base.theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative'
  },

  image: {
    // width: wp('34%'),
    // height: hp('18%')
  },
  button1: {
    width: hp('40%'),
    justifyContent: 'center'
  },

  viewDetails2: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: hp('3%'),
    height: hp('3%'),
    marginTop: 5
    // marginLeft: 10
  },
  viewDetails1: {
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10
  }
});

const mapStateToProps = state => {
  return {
    oyeURL: state.OyespaceReducer.oyeURL,
    MyAccountID: state.UserReducer.MyAccountID,
    viewImageURL: state.OyespaceReducer.viewImageURL,
    imageUrl: state.OyespaceReducer.imageUrl,
    SelectedAssociationID: state.DashboardReducer.assId ,
    dashBoardReducer: state.DashboardReducer,
    mediaupload: state.OyespaceReducer.mediaupload,
    userReducer: state.UserReducer,
    assId:state.DashboardReducer.assId ,
    uniID: state.DashboardReducer.uniID,
  };
};

export default connect(
  mapStateToProps,
  { updateUserInfo }
)(MyProfile);