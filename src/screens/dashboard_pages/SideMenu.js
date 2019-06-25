import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { ScrollView, Text, View, Share, Linking, StyleSheet, Helpers, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
//import { Fonts } from '../pages/src/utils/Fonts';
import { openDatabase } from 'react-native-sqlite-storage';
import Communications from 'react-native-communications';
import VersionNumber from 'react-native-version-number';


var db = openDatabase({ name: global.DB_NAME });

class SideMenu extends Component {
    
    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }

    shareLink = () => {
        Share.share({
            message: 'Download OYESpace App https://itunes.apple.com/us/app/oyespace/id1445274978?ls=1&mt=8',
        })
            //after successful share return result
            .then(result => console.log(result))
            //If any thing goes wrong it comes here
            .catch(errorMsg => console.log(errorMsg));
    };

    callContact = () => {
        Communications.phonecall('+919343121121', true);

    };
    sendMail = () => {
        Linking.openURL('mailto:happy@oyespace.com?subject=Feedback&body=Description:');

    };
    deleteUser = () => {
        var that = this;
        db.transaction(tx => {
            tx.executeSql('delete  FROM OTPVerification ', [], (tx, results) => {
                console.log('SideMenu Results OTPVerification delete ', results.rowsAffected);
            });
        });
        db.transaction(tx => {
            tx.executeSql('delete  FROM MyMembership ', [], (tx, results) => {
                console.log('SideMenu Results MyMembership delete ', results.rowsAffected);
            });
        });
        db.transaction(tx => {
            tx.executeSql('delete  FROM UnitOwner ', [], (tx, results) => {
                console.log('SideMenu Results UnitOwner delete ', results.rowsAffected);
            });
        });
        db.transaction(tx => {
            tx.executeSql('delete  FROM OyeUnit ', [], (tx, results) => {
                console.log('SideMenu Results OyeUnit delete ', results.rowsAffected);
            });
        });
        db.transaction(tx => {
            tx.executeSql('delete  FROM Association ', [], (tx, results) => {
                console.log('SideMenu Results Association delete ', results.rowsAffected);
            });
        });

        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM  Account ',
                [],
                (tx, results) => {
                    console.log('SideMenu Results Account ', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        console.log('SideMenu Results bf ', results.rowsAffected);
                        this.props.navigation.navigate('MobileValid');

                        alert('Log Out User Successfull');

                    } else {
                        alert('Logged Out Failed');
                    }
                }
            );
        });
    };
    render() {
        console.log('appVersion ' + VersionNumber.appVersion);
        console.log('buildVersion ' + VersionNumber.buildVersion);
        console.log('bundleIdentifier ' + VersionNumber.bundleIdentifier);
        console.log('bundleIdentifier ' + global.viewImageURL + 'PERSON' + global.MyAccountID + '.jpg');
        return (
            <View style={styles.container}>
              <View style={{
        backgroundColor: '#ffffff',
        flexDirection: "row",
        marginTop: 15
      }}>
     {/*  <Image
             source={require('../pages/assets/images/menu_button.png')}
            style={{ width: 30, height: 30, marginLeft: 15 ,alignSelf: 'flex-start',
          }}
          />
          <Text style={{
            color: '#000000', fontSize: 13, fontFamily: Fonts.Tahoma,
            textAlign: 'center'
          }}> Dashboard</Text> */}
          <TouchableOpacity
                                style={{
                                    paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 2, alignItems: 'center', flexDirection: 'row',
                                    paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                                }}
                                onPress={() => this.props.navigation.navigate('ResDashBoard')}  /*Products is navigation name*/>
                                <Image source={require('../../../pages/assets/images/back.png')}
                                    style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                                <Text style={{ fontSize: 12, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>Dashboard</Text>
                            </TouchableOpacity>
      </View> 
      <View style={{
        backgroundColor: 'lightgrey',
        flexDirection: "row",
        height:1,width:'100%'

      }}>
    
         
      </View> 
                <ScrollView showsVerticalScrollIndicator={true}>
                    <View >
                        {/* <Text style={{
                            color: '#000000', fontSize: 14, fontFamily: Fonts.Tahoma,
                            textAlign: 'center'
                        }}>Welcome {global.MyFirstName} {global.MyLastName}  </Text>
                        <Text style={{
                            color: '#000000', fontSize: 14, fontFamily: Fonts.Tahoma,
                            textAlign: 'center'
                        }}>Unit name  </Text>
                        <Text style={{
                            color: '#000000', fontSize: 14, fontFamily: Fonts.Tahoma,
                            textAlign: 'center'
                        }}>Login Details </Text> */}
                        <TouchableHighlight

                            style={[styles.profileImgContainer, {
                                borderColor: 'orange',
                                borderWidth: 1,marginLeft:10,
                            }]}
                        >

                            <Image
                                style={styles.image}
                                source={{ uri: global.viewImageURL + 'PERSON' + global.MyAccountID + '.jpg' }}
                                style={styles.profileImg}
                            />

                            {/* <Image source={ require('../pages/assets/images/man-user.png')} style={styles.profileImg} /> */}

                        </TouchableHighlight>
                        <Text style={{ padding: 5, textAlign: 'right', }} onPress={this.navigateToScreen('EditProfileScreen')}>
                            Edit Profile
              </Text>
                    </View>

                    <View>

                        <View style={styles.sectionHeadingStyle}>
                            {/* <TouchableOpacity
                                style={{
                                    paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 2, alignItems: 'center', flexDirection: 'row',
                                    paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                                }}
                                onPress={() => this.props.navigation.navigate('ViewVisitorsScreen')}>
                                <Image source={require('../pages/assets/images/my_visitors_orange.png')}
                                    style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                                <Text style={{ fontSize: 14, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>My Visitors</Text>
                            </TouchableOpacity> */}
                            {/*  <Mybutton
              title="View Visitors "
              customClick={() => this.props.navigation.navigate('ViewVisitorsScreen')}
            /> */}
                            {/* <TouchableOpacity
                                style={{
                                    paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 3, alignItems: 'center', flexDirection: 'row',
                                    paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                                }}
                                onPress={() => this.props.navigation.navigate('ViewRegularVisitorScreen')} >
                                <Image source={require('../pages/assets/images/service_provider_orange.png')}
                                    style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                                <Text style={{ fontSize: 14, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>Service Provider</Text>
                            </TouchableOpacity> */}
                            {/* <TouchableOpacity
                                style={{
                                    paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 2, alignItems: 'center', flexDirection: 'row',
                                    paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                                }}
                                onPress={() => this.props.navigation.navigate('InvitedGuestListScreen')} >
                                <Image source={require('../pages/assets/images/invite_guest_orange.png')}
                                    style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                                <Text style={{ fontSize: 14, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>My Guest</Text>
                            </TouchableOpacity> */}
                           
                            {/* <TouchableOpacity
                                style={{
                                    paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 2, alignItems: 'center', flexDirection: 'row',
                                    paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                                }}
                                onPress={() => this.props.navigation.navigate('ViewFamilyMembersListScreen')} >
                                <Image source={require('../pages/assets/images/family_member_orange.png')}
                                    style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                                <Text style={{ fontSize: 14, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>Family Member</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity
                                style={{
                                    paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 2, alignItems: 'center', flexDirection: 'row',
                                    paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                                }}
                                onPress={() => this.props.navigation.navigate('CheckPointListScreen')}  /*Products is navigation name*/>
                                <Image source={require('../../../pages/assets/images/checkpoint_orange.png')}
                                    style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                                <Text style={{ fontSize: 14, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>Patrolling Check Points</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 3, alignItems: 'center', flexDirection: 'row',
                                    paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                                }}
                                onPress={() => this.props.navigation.navigate('SecurityDailyReportScreen')}  /*Products is navigation name*/>
                                <Image source={require('../../../pages/assets/images/attendance_report_orange.png')}
                                    style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                                <Text style={{ fontSize: 14, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>Attendance Report</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 2, alignItems: 'center', flexDirection: 'row',
                                    paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                                }}
                                onPress={() => this.props.navigation.navigate('ViewAllVisitorsScreen')}  /*Products is navigation name*/>
                                <Image source={require('../../../pages/assets/images/my_visitors_orange.png')}
                                    style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                                <Text style={{ fontSize: 14, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>View All Visitors</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity
                                style={{
                                    paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 2, alignItems: 'center', flexDirection: 'row',
                                    paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                                }}
                                onPress={() => this.props.navigation.navigate('ViewIncidentsScreen')}>
                                <Image source={require('../pages/assets/images/assigned_task_orange.png')}
                                    style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                                <Text style={{ fontSize: 14, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>Assigned Task</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity
                                style={{
                                    paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 2, alignItems: 'center', flexDirection: 'row',
                                    paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                                }}
                                onPress={() => this.props.navigation.navigate('AdminSettingsScreen')}  /*Products is navigation name*/>
                                <Image source={require('../../../pages/assets/images/admin_functions.png')}
                                    style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                                <Text style={{ fontSize: 14, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>Admin Settings</Text>
                            </TouchableOpacity>
                            {/*   <Mybutton
              title="Admin Settings"
              customClick={() => this.props.navigation.navigate('AdminSettingsScreen')}
            /> */}
                            {/* <TouchableOpacity
                                style={{
                                    paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 2, alignItems: 'center', flexDirection: 'row',
                                    paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                                }}
                                onPress={() => this.props.navigation.navigate('PatrollingListScreen')}  >
                                <Image source={require('../pages/assets/images/patrol_shifts_orange.png')}
                                    style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                                <Text style={{ fontSize: 14, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>Patrolling List</Text>
                            </TouchableOpacity> */}
                            {/* <TouchableOpacity
                                style={{
                                    paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 2, alignItems: 'center', flexDirection: 'row',
                                    paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                                }}
                                onPress={() => this.props.navigation.navigate('WorkerShiftDetailsScreen')}  >
                                <Image source={require('../pages/assets/images/clock_orange.png')}
                                    style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                                <Text style={{ fontSize: 14, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>Worker Shifts</Text>
                            </TouchableOpacity> */}
                            {/* <Text style={styles.navItemStyle} onPress={this.navigateToScreen('ViewFamilyMembersListScreen')}>
                                ViewFamilyMembersListScreen
              </Text> */}
                            <TouchableOpacity
                                style={{
                                    paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 2, alignItems: 'center', flexDirection: 'row',
                                    paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                                }}
                                onPress={() => this.props.navigation.navigate('AssnListScreen')}  /*Products is navigation name*/>
                                <Image source={require('../../../pages/assets/images/join_association_orange.png')}
                                    style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                                <Text style={{ fontSize: 14, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>Join Association</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 2, alignItems: 'center', flexDirection: 'row',
                                    paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                                }}
                                onPress={() => this.props.navigation.navigate('CreateAssnScreen')}  /*Products is navigation name*/>
                                <Image source={require('../../../pages/assets/images/building.png')}
                                    style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                                <Text style={{ fontSize: 14, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>Create Association</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 2, alignItems: 'center', flexDirection: 'row',
                                    paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                                }}
                                onPress={this.callContact.bind(this)}  /*Products is navigation name*/>
                                <Image source={require('../../../pages/assets/images/contact_support_orange.png')}
                                    style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                                <Text style={{ fontSize: 14, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>Contact Support</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity
                                style={{
                                    paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 2, alignItems: 'center', flexDirection: 'row',
                                    paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                                }}
                                onPress={this.sendMail.bind(this)} >
                                <Image source={require('../pages/assets/images/email_img.png')}
                                    style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                                <Text style={{ fontSize: 14, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>Mail Support</Text>
                            </TouchableOpacity> */}

                            {/*   <Text style={styles.navItemStyle} onPress={this.callContact.bind(this)}>
                            Contact Support
              </Text> */}

                            <TouchableOpacity
                                style={{
                                    paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 2, alignItems: 'center', flexDirection: 'row',
                                    paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                                }}
                                onPress={() => this.props.navigation.navigate('SubscriptionScreen')}  /*Products is navigation name*/>
                                <Image source={require('../../../pages/assets/images/building.png')}
                                    style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                                <Text style={{ fontSize: 14, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>Subscription</Text>
                            </TouchableOpacity>

                            {/* <TouchableOpacity
                                style={{
                                    paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 2, alignItems: 'center', flexDirection: 'row',
                                    paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                                }}
                                onPress={() => {
                                    
                                    Linking.openURL('https://www.oyespace.com/TermsCond.html');
                                }} >
                                <Image source={require('../pages/assets/images/icons8-note.png')}
                                    style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                                <Text style={{ fontSize: 14, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>Terms of use</Text>
                            </TouchableOpacity> */}
                            {/* <TouchableOpacity
                                style={{
                                    paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 2, alignItems: 'center', flexDirection: 'row',
                                    paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                                }}
                                onPress={() => {
                                    
                                    Linking.openURL('https://itunes.apple.com/us/app/oyespace/id1445274978?ls=1&mt=8');
                                }} >
                                <Image source={require('../pages/assets/images/update.png')}
                                    style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                                <Text style={{ fontSize: 14, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>Check For Updates</Text>
                            </TouchableOpacity> */}
                            {/* <TouchableOpacity
                                style={{
                                    paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 2, alignItems: 'center', flexDirection: 'row',
                                    paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                                }}
                                onPress={this.shareLink.bind(this)}>
                                <Image source={require('../pages/assets/images/share.png')}
                                    style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                                <Text style={{ fontSize: 14, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>Share</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                    
                </ScrollView>
                <View style={[styles.navItemStyle,{position:'relative',left:0,right:0,bottom:0,top:250, flexDirection:"row",backgroundColor: 'lightgrey',height:30,}]}>
                        <Text style={{flex:1,justifyContent:'center',alignSelf:'center',paddingLeft:'10%', }} onPress={this.deleteUser.bind(this)}>Log Out</Text>
                        <Text style={{ flex:1,justifyContent:'center',alignSelf:'center',textAlign:'right', marginRight:'10%' }}>Version:{VersionNumber.appVersion}</Text>
                </View>
            </View>
        );
    }
}

SideMenu.propTypes = {
    navigation: PropTypes.object
};

export default SideMenu;

const styles = StyleSheet.create({
    container: {
        marginTop: 22,
        backgroundColor: 'white',
    },
    navItemStyle: {
        // padding: 10,
        justifyContent:'flex-end'
    },

    profileImgContainer: { marginTop: 5, height: 100, width: 100, borderRadius: 50, },

    profileImg: {  height: 100, width: 100, borderRadius: 50, },

    // navSectionStyle: {
    //     backgroundColor: 'lightgrey'
    // },
    sectionHeadingStyle: {
        paddingVertical: 10,
        paddingHorizontal: 5
    },
    // footerContainer: {
    //     padding: 5,
    //     flexDirection: 'row',
    //     backgroundColor: 'lightgrey'
    // },
});
