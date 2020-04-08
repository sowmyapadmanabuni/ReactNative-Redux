import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    Dimensions,
    Linking,
    Platform,
    TouchableOpacity,
    FlatList,
    BackHandler, TextInput, KeyboardAvoidingView, TouchableHighlight
} from 'react-native';
import { Button, Header, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { CLOUD_FUNCTION_URL } from '../../../constant';
import { connect } from 'react-redux';
import {
  updateApproveAdmin,
  getNotifications,
  createUserNotification,
  storeOpenedNotif,
  onNotificationOpen
} from '../../actions';

import {
    heightPercentageToDP,
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import gateFirebase from 'firebase';
import _ from 'lodash';
import base from '../../base';
import firebase from 'react-native-firebase';
import moment from "moment";
import Modal from "react-native-modal";
import OSButton from "../../components/osButton/OSButton";
import CreateSOSStyles from "../SOS/CreateSOSStyles";

// ("ntJoinStat");
class NotificationDetailScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      date: '',
      reqStatus: '',
      adminStatLoading: true,
      adminStat: null,

      unitIDD: '',
      dataSource: [],
      requestorMob: '',
      data: [],

      dataSource1: [],
      requestorMob1: '',

      dataSource2: [],
      dataSource3: '',

      showButtons: true,

      appendButtonClicked: false,
      replaceButtonClicked: false,
        reasonForReject:"",
        isRejModal:false,
        detailsToReject:{},
        selectedImage:"",
        isModalOpen: false
    };

    this.checkAdminNotifStatus = this.checkAdminNotifStatus.bind(this);
  }

  componentDidMount() {
    base.utils.validate.checkSubscription(
      this.props.assId
    );
    const { navigation } = this.props;
    // const details = navigation.getParam("details", "NO-ID");
    const index = navigation.getParam('index', 'NO-ID');
    const notifications = navigation.getParam('notifications', 'NO-ID');
    const ntid = navigation.getParam('ntid', 'NO-ID');
    const oyeURL = navigation.getParam('oyeURL', 'NO-ID');
    const savedNoifId = navigation.getParam('savedNoifId', 'NO-ID');
    this.props.onNotificationOpen(notifications, index, oyeURL);
    this.props.storeOpenedNotif(savedNoifId, ntid);
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      console.log('Notification Detail screen');
      this.props.navigation.goBack(null);
      return true;
    });

   // this.manageJoinRequest();
    this.checkAdminNotifStatus();
  }

  componentDidUpdate() {
    setTimeout(() => {
      BackHandler.addEventListener('hardwareBackPress', () =>
        this.processBackPress()
      );
    }, 100);
  }

  componentWillUnmount() {
    setTimeout(() => {
      BackHandler.removeEventListener('hardwareBackPress', () =>
        this.processBackPress()
      );
    }, 0);
  }

  processBackPress() {
    console.log('Part');
    const { goBack } = this.props.navigation;
    goBack(null);
  }

  checkAdminNotifStatus() {
    const { navigation, champBaseURL } = this.props;
    const details = navigation.getParam('details', 'NO-ID');
    console.log(details, 'detailssss');

    let roleId;

    if (parseInt(details.sbRoleID) === 2) {
      roleId = 6;
    } else {
      roleId = 7;
    }

    axios
      .post(
        `${this.props.champBaseURL}/Member/GetMemberJoinStatus`,
        {
          ACAccntID: details.acNotifyID,
          UNUnitID: details.sbUnitID,
          ASAssnID: details.asAssnID
        },
        {
          headers: {
            'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
            'Content-Type': 'application/json'
          }
        }
      )
      .then(res => {
        this.setState({ adminStatLoading: false });
        let data = res.data.data;

        console.log(data, res, 'adminData');
        if (data) {
          if (
            data.member.meJoinStat === 'Accepted' &&
            data.member.mrmRoleID === details.sbRoleID &&
            data.member.meIsActive
          ) {
            this.setState({ adminStat: 'Accepted' });
          } else if (
            data.member.meJoinStat === 'Rejected' &&
            parseInt(data.member.mrmRoleID) === roleId
            //  data.member.meIsActive
          ) {
            this.setState({ adminStat: 'Rejected' });
          }
        }
      })
      .catch(error => {
        console.log(error, 'adminDataError');
        this.setState({ adminStatLoading: false });
      });

    fetch(
      `http://${this.props.oyeURL}/oyeliving/api/v1/GetAccountListByAccountID/${details.acNotifyID}`,
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
        console.log('Response Json', responseJson);
        this.setState({
          dataSource1: responseJson.data.account,
          requestorMob1: responseJson.data.account[0].acMobile
        });
        console.log(
          'Mobile Number1:',
          this.state.dataSource,
          this.state.requestorMob1
        );
      })
      .catch(error => {
        console.log(error);
      });
    fetch(
      `http://${this.props.oyeURL}/oyeliving/api/v1/UnitOwner/GetUnitOwnerListByUnitID/${details.sbUnitID}`,
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
        console.log('Response Json', responseJson);
        this.setState({
          data: responseJson.data.unitsByUnitID,
          dataSource: responseJson.data.unitsByUnitID[0],
          requestorMob: responseJson.data.unitsByUnitID[0].uoMobile
        });
        console.log('Mobile Number:', this.state.dataSource);
      })
      .catch(error => {
        console.log(error);
      });

    fetch(
      //http://api.oyespace.com/oyeliving/api/v1/Unit/GetUnitListByUnitID/35894
      `http://${this.props.oyeURL}/oyeliving/api/v1/Unit/GetUnitListByUnitID/${details.sbUnitID}`,
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
        console.log('Response Json', responseJson);
        console.log(
          'Owner Tenant length',
          responseJson.data.unit.owner.length,
          responseJson.data.unit.tenant.length
        );
        let arr1 = [];
        let self = this;
        let arr2 = [];
        for (let i = 0; i < responseJson.data.unit.owner.length; i++) {
          for (let j = 0; j < responseJson.data.unit.tenant.length; j++) {
            arr1.push({
              name:
                responseJson.data.unit.owner[i].uofName +
                ' ' +
                responseJson.data.unit.owner[i].uolName,
              number: responseJson.data.unit.owner[i].uoMobile
            });
            // arr1.push(responseJson.data.unit.owner[i])
            arr2.push({
              name:
                responseJson.data.unit.tenant[j].utfName +
                ' ' +
                responseJson.data.unit.tenant[j].utlName,
              number: responseJson.data.unit.tenant[j].utMobile
            });

            // arr2.push(responseJson.data.unit.tenant[j])
          }
        }
        self.setState({
          dataSource2: [...arr1, ...arr2],
          dataSource3: responseJson.data.unit.unOcStat
        });
        console.log('DataSource2', this.state.dataSource2);
      })
      .catch(error => {
        console.log(error);
      });
  }

  /**
   * @author
   * Anooj Krishnan G
   *
   * @method
   * manageJoinRequest: Handles the Unit Join request.
   *
   * @description
   * Request will be handled based on occupancy status of Unit.
   *
   * Occuppancy Status is as follows:
   * 1. Sold Owner Occupied Unit (Only Owner will be there)
   * 2. Sold Tenant Occupied Unit (Owner & Tenant both)
   * 3. UnSold Vacant Unit (No Owner & Tenant- vacant)
   * 4. UnSold Tenant Occupied Unit (Only Tenant)
   * 5. Sold Vacant Unit ( Owner only but vacant)
   *
   * Approve/Replace option must be visible for 1, 2,
   * (4 if request is as tenant)
   * & ( 5 if request is as owner)
   *
   * Rest of the cases will be handled in normal accept/reject method
   *
   */
  async manageJoinRequest() {
    try {
      const { navigation } = this.props;
      const details = navigation.getParam('details', 'NO-ID');
      const role = details.sbRoleID;
      base.utils.logger.logArgs('NotificationDetailScreen', details);
      //if(details != undefined && details.ntType == "Join" && details.ntJoinStat == "" && details.ntIsActive){
      this.setState({ loading: true });
      const response = await base.services.OyeLivingApi.getUnitDetailByUnitId(
        details.sbUnitID
      );
      this.setState({ loading: false });
      base.utils.logger.logArgs('NotificationDetailScreen2', response);
      if (response.success && response.data.unit != undefined) {
        let unitInfo = response.data.unit;
        if (
          unitInfo.unOcStat == base.utils.strings.SOLD_OWNER_OCCUPIED_UNIT ||
          unitInfo.unOcStat == base.utils.strings.SOLD_TENANT_OCCUPIED_UNIT
        ) {
          this.showAppendReplaceUI(details, unitInfo, role);
        } else if (
          unitInfo.unOcStat == base.utils.strings.UNSOLD_TENANT_OCCUPIED_UNIT &&
          role == base.utils.strings.USER_TENANT
        ) {
        } else if (
          unitInfo.unOcStat == base.utils.strings.SOLD_VACANT_UNIT &&
          role == base.utils.strings.USER_OWNER
        ) {
        }
      } else {
        base.utils.logger.logArgs('manageJoinRequest', 'No Active Request');
      }
      // else{
      // }
    } catch (e) {
      base.utils.logger.logArgs(e);
    }
  }

  showAppendReplaceUI(notification, unitInfo, accessedRole) {}

  approve = (item, status) => {
    const { oyeURL } = this.props;
    if (status) {
      Alert.alert(
        'Oyespace',
        'You have already responded to this request!',
        [{ text: 'Ok', onPress: () => {} }],
        { cancelable: false }
      );
    } else {
      let MemberID = global.MyOYEMemberID;
      this.setState({ loading: true });
      console.log(item);

      const headers = {
        'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
        'Content-Type': 'application/json'
      };

      console.log(
        {
          MRMRoleID: item.sbRoleID,
          MEMemID: item.sbMemID,
          UNUnitID: item.sbUnitID
        },
        'body_memberROle'
      );
      axios
        .post(
          this.props.champBaseURL + 'MemberRoleChangeToAdminOwnerUpdate',
          {
            MRMRoleID: item.sbRoleID,
            MEMemID: item.sbMemID,
            UNUnitID: item.sbUnitID
          },
          {
            headers: headers
          }
        )
        .then(response => {
            console.log('JOINREQ_NOTIFI_RESPONSE@@@@@@',response)
          let roleName = item.sbRoleID === 2 ? 'Owner' : 'Tenant';

          axios
            .post(`${CLOUD_FUNCTION_URL}/sendUserNotification`, {
              sbSubID: item.sbSubID,
              ntTitle: 'Request Approved',
              ntDesc:
                'Your request to join ' +
                item.mrRolName +
                ' ' +
                ' unit in ' +
                item.asAsnName +
                ' association as ' +
                roleName +
                ' has been approved',
              ntType: 'Join_Status',
              associationID: item.asAssnID
            })
            .then(() => {
             let DateUnit = {
                MemberID: item.sbMemID,
                UnitID: item.sbUnitID,
                MemberRoleID: item.sbRoleID,
                UNSldDate: item.unSldDate,
                UNOcSDate: item.unOcSDate
              };

             let UpdateTenant = {
                MEMemID: item.sbMemID,
                UNUnitID: item.sbUnitID,
                MRMRoleID: item.sbRoleID
              };

              this.props.createUserNotification(
                'Join_Status',
                this.props.oyeURL,
                item.acNotifyID,
                1,
                'Your request to join ' +
                  item.mrRolName +
                  ' ' +
                  ' unit in ' +
                  item.asAsnName +
                  ' association as ' +
                  roleName +
                  ' has been approved',
                'resident_user',
                'resident_user',
                item.sbSubID,
                'resident_user',
                'resident_user',
                'resident_user',
                'resident_user',
                'resident_user',
                false,
                this.props.MyAccountID
              );

              fetch(
                `${this.props.champBaseURL}Unit/UpdateUnitRoleStatusAndDate`,
                {
                  method: 'POST',
                  headers: {
                    'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(DateUnit)
                }
              )
                .then(response => response.json())
                console.log('JOINREQ_NOTIFI_RESPONSE@@@@@@111111',response)
                .then(responseJson => {
                  fetch(
                    `http://${this.props.oyeURL}/oyeliving/api/v1/UpdateMemberOwnerOrTenantInActive/Update`,
                    {
                      method: 'POST',
                      headers: {
                        'X-Champ-APIKey':
                          '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(UpdateTenant)
                    }
                  )
                    .then(response => response.json())
                    console.log('JOINREQ_NOTIFI_RESPONSE@@@@@@22222',response)
                    .then(responseJson_2 => {
                      console.log(JSON.stringify(UpdateTenant));
                      console.log(responseJson_2);

                     let StatusUpdate = {
                        NTID: item.ntid,
                        NTStatDesc: 'Request Sent'
                        //NTStatDesc: responseJson_2.data.string
                      };

                      fetch(
                        `http://${this.props.oyeURL}/oyesafe/api/v1/NotificationAcceptanceRejectStatusUpdate`,
                        {
                          method: 'POST',
                          headers: {
                            'X-OYE247-APIKey':
                              '7470AD35-D51C-42AC-BC21-F45685805BBE',
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify(StatusUpdate)
                        }
                      )
                        .then(response => {
                          response.json();
                            console.log('JOINREQ_NOTIFI_RESPONSE@@@@@@33333',response)
                          console.log('Response', response);
                        })
                        .then(responseJson_3 => {
                          console.log(item.ntid, 'ntid');
                          console.log('NTJoinStat');
                            console.log('JOINREQ_NOTIFI_RESPONSE@@@@@@44444',response)
                          axios
                            .post(
                              `http://${this.props.oyeURL}/oyesafe/api/v1/Notification/NotificationJoinStatusUpdate`,
                              {
                                NTID: item.ntid,
                                NTJoinStat: 'Accepted'
                              },
                              {
                                headers: {
                                  'X-OYE247-APIKey':
                                    '7470AD35-D51C-42AC-BC21-F45685805BBE',
                                  'Content-Type': 'application/json'
                                }
                              }
                            )
                            .then(() => {
                              console.log('updated suc');
                              this.props.getNotifications(
                                this.props.oyeURL,
                                this.props.MyAccountID
                              );
                              this.setState({
                                loading: false,
                                date: StatusUpdate.NTStatDesc
                              });

                              setTimeout(() => {
                                this.props.navigation.navigate('ResDashBoard');
                              }, 300);
                            })
                            .catch(error => {
                              console.log('Join Status', error);
                              Alert.alert('Join Status', error.message);
                              this.setState({
                                loading: false
                              });
                            });

                          // this.props.updateApproveAdmin(
                          //   this.props.approvedAdmins,
                          //   item.sbSubID
                          // );
                        })
                        .catch(error => {
                          console.log('StatusUpdate', error);
                          Alert.alert('StatusUpdate', error.message);
                          this.setState({ loading: false });
                        });
                    })
                    .catch(error => {
                      console.log('Update', error);
                      Alert.alert('Update', error.message);
                      this.setState({ loading: false });
                    });
                })
                .catch(error => {
                  console.log('DateUnit', error);
                  Alert.alert('DateUnit', error.message);
                  this.setState({ loading: false });
                });
            })
            .catch(error => {
              console.log('firebase', error);
              Alert.alert('firebase', error.message);
              this.setState({ loading: false });
            });
        })
        .catch(error => {
          console.log('MemberRoleChange', error);
          Alert.alert('MemberRoleChange', error.message);
          this.setState({ loading: false });
        });
    }
  };

  reject = (item, status) => {
      this.setState({
          isRejModal:false
      })
      console.log('DETAILS DETAILS',item)
    const { oyeURL } = this.props;
    if (status) {
      Alert.alert(
        'Oyespace',
        'You have already responded to this request!',
        [{ text: 'Ok', onPress: () => {} }],
        { cancelable: false }
      );
    } else {
      this.setState({ loading: true });

      const headers = {
        'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
        'Content-Type': 'application/json'
      };
      axios
        .get(
          `http://${this.props.oyeURL}/oyesafe/api/v1/NotificationActiveStatusUpdate/${item.ntid}`,
          {
            headers: {
              'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE',
              'Content-Type': 'application/json'
            }
          }
        )
        .then(() => {
          let roleName = item.sbRoleID === 1 ? 'Owner' : 'Tenant';
          axios
            .get(
              `http://${this.props.oyeURL}/oyeliving/api/v1//Member/UpdateMemberStatusRejected/${item.sbMemID}/${this.state.reasonForReject}`,
              {
                headers: {
                  'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
                  'Content-Type': 'application/json'
                }
              }
            )
            .then(succc => {
              console.log(succc, 'worked');
              this.setState({reasonForReject:""})
              axios
                .post(`${CLOUD_FUNCTION_URL}/sendUserNotification`, {
                  sbSubID: item.sbSubID,
                  ntTitle: 'Request Declined',
                  ntDesc:
                    'Your request to join' +
                    item.mrRolName +
                    ' ' +
                    ' unit in ' +
                    item.asAsnName +
                    ' association as ' +
                    roleName +
                    ' has been declined',
                  ntType: 'Join_Status'
                })
                .then(() => {
                  this.props.createUserNotification(
                    'Join_Status',
                    this.props.oyeURL,
                    item.acNotifyID,
                    1,
                    'Your request to join' +
                      item.mrRolName +
                      ' ' +
                      ' unit in ' +
                      item.asAsnName +
                      ' association as ' +
                      roleName +
                      ' has been declined',
                    'resident_user',
                    'resident_user',
                    item.sbSubID,
                    'resident_user',
                    'resident_user',
                    'resident_user',
                    'resident_user',
                    'resident_user',
                    false,
                    this.props.MyAccountID
                  );

                  axios
                    .post(
                      `http://${oyeURL}/oyesafe/api/v1/Notification/NotificationJoinStatusUpdate`,
                      {
                        NTID: item.ntid,
                        NTJoinStat: 'Rejected' 
                      },
                      {
                        headers: {
                          'X-OYE247-APIKey':
                            '7470AD35-D51C-42AC-BC21-F45685805BBE',
                          'Content-Type': 'application/json'
                        }
                      }
                    )
                    .then(() => {
                      this.props.getNotifications(
                        this.props.oyeURL,
                        this.props.MyAccountID
                      );

                      this.setState({ loading: false });
                      // this.props.updateApproveAdmin(
                      //   this.props.approvedAdmins,
                      //   item.sbSubID
                      // );
                      setTimeout(() => {
                        this.props.navigation.navigate('ResDashBoard');
                      }, 300);
                    })
                    .catch(error => {
                      console.log('Join Status', error);
                      Alert.alert('Join Status', error.message);
                      this.setState({
                        loading: false
                      });
                    });
                })
                .catch(error => {
                  Alert.alert('@@@@@@@@@@@@@@@', error.message);
                  this.setState({ loading: false });
                });
            })
            .catch(error => {
              console.log("update didn't work", error);
            });
        })
        .catch(error => {
          // Alert.alert("******************", error.message);
          console.log(error, 'first api');
          this.setState({ loading: false });
        });
      // })
      // .catch(error => {
      //   // Alert.alert("#################", error.message);
      //   console.log(error, "last");
      //   this.setState({ loading: false });
      // });
    }
  };

  renderButton = () => {
    const { loading, adminStatLoading, adminStat } = this.state;
    const { navigation } = this.props;
    const details = navigation.getParam('details', 'NO-ID');

    let subId = details.sbSubID;
    // let status = _.includes(approvedAdmins, subId);
    // let status = false;
      let val=details.ntDesc.split(' ')
      console.log('DETAILS########',details)
      let status;

    if (loading || adminStatLoading) {
      return (
        <View
          style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
        >
          <ActivityIndicator />
        </View>
      );
    } else {
      if (details.ntType === 'Join_Status') {
        return null;
      } else if (details.ntType === 'gate_app') {
        return null;
      } else {
        if (adminStat === 'Accepted') {
          return (
                  <View style={{ justifyContent: 'center', alignItems: 'center',marginTop:10 }}>
              <Text style={{ fontWeight: '500' }}> {'Request Accepted'} </Text>
                  </View>
                  );
        } else if (adminStat === 'Rejected') {
          return (
            <View style={{ justifyContent: 'center', alignItems: 'center',marginTop:10 }}>
              <Text style={{ fontWeight: '500' }}> {'Request Rejected'} </Text>
            </View>
          );
        } else {
          if (details.ntJoinStat) {
            if (details.ntJoinStat === 'Accepted') {
              status = (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <View>
                    <Text> {this.state.date || 'Request Accepted'} </Text>
                  </View>
                </View>
              );
            } else if (details.ntJoinStat === 'Rejected') {
              status = (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text>{this.state.date || 'Request Rejected'}</Text>
                </View>
              );
            }
          } else {
            status = (
              <View >
                  <View style={{flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'space-between'}}>
                  <TouchableOpacity style={{  width: wp('10%'),
                      height: hp('10%'),
                      justifyContent: 'center', alignSelf:'center',
                      alignItems: 'center',marginLeft:40}}
                                    onPress={() => this._enlargeImage(details.userImage !="" ? "https://mediaupload.oyespace.com/" + details.userImage  :'https://mediaupload.oyespace.com/' + base.utils.strings.noImageCapturedPlaceholder)}
                  >
                      {details.userImage !=""  ?

                          <Image
                              style={{width: 80,
                                  height: 80,
                                  borderRadius: 40, position: 'relative'
                              }}
                              source={{uri:"https://mediaupload.oyespace.com/" + details.userImage }}
                          />
                          :

                          <Image
                              style={{width: 80,
                                  height: 80,
                                  borderRadius: 40, position: 'relative'
                              }}
                              source={{uri:'https://mediaupload.oyespace.com/' + base.utils.strings.noImageCapturedPlaceholder}}
                          />}

                  </TouchableOpacity>
                  <View
                  style={{
                      width:'70%',
                    flexDirection: 'column',
                      marginTop:hp('2%'),
                   // marginTop: hp('10%'),
                  //  marginBottom: hp('2%'),
                    marginLeft: hp('2%'),
                  }}
                >
                  <View>
                    <Text style={{ color: '#ff8c00' }}>Requestor </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                      <Text>Name</Text>
                    </View>
                    <View style={{ flex: 2, flexDirection: 'row' }}>
                        <Text style={{color:base.theme.colors.black}}>
                            {details.ntDesc !== undefined
                          ? details.ntDesc.split(' ')[0].trim()
                          : ''}{' '}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 2.5 }}>
                      <Text>Mobile</Text>
                    </View>
                 <View style={{ flex: 5 }}>

                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{color:base.theme.colors.black}}>{this.state.requestorMob1}</Text>
                        </View>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                      <Text>Unit</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                        <Text style={{color:base.theme.colors.black}}>
                        {details.ntDesc !== undefined
                          ? details.ntDesc.split(' ')[4].trim()
                          : ''}{' '}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: base.theme.colors.greyCard,
                      marginTop: hp('1%'),
                      marginBottom: hp('3%')
                    }}
                  />
                </View>
                  </View>
                  <View style={{flexDirection:'row',alignItems:'flex-end',alignSelf:'flex-end',position:'absolute',marginTop:'80%'}}>
                      <TouchableOpacity onPress={() => {
                          this.approve(details)
                      }}
                                        style={{flexDirection:'row',marginRight:20,alignItems:'center',justifyContent:'space-between'}}>
                          <Image
                              style={{width:30,height:30}}
                              source={require('../../../icons/allow.png')}
                          />
                          <Text style={{fontSize:16,color:base.theme.colors.themeColor,}}>Allow</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.rejectModal(details)
                      }  style={{flexDirection:'row',marginRight:20,alignItems:'center',justifyContent:'space-between'}}>
                          <Image
                              style={{width:30,height:30}}
                              source={require('../../../icons/deny.png')}
                          />
                          <Text style={{fontSize:16,color:base.theme.colors.red,}}>Deny</Text>
                      </TouchableOpacity>
                  </View>
              </View>
            );
          }
        }
      }
      return status;
    }
  };

    _enlargeImage(imageURI) {
        console.log('openimg',imageURI)
        let img={imageURI}
        this.setState({
            selectedImage:imageURI,
            isModalOpen: true
        })
    }


    _renderModal1() {
        console.log('openimg111111111',this.state.selectedImage)

        return (
            <Modal
                onRequestClose={() => this.setState({isModalOpen: false})}
                isVisible={this.state.isModalOpen}>
                <View style={{height: heightPercentageToDP('50%'), justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                        style={{
                            height: heightPercentageToDP('50%'),
                            width: heightPercentageToDP('50%'),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        source={{uri:this.state.selectedImage}}
                    />
                    <TouchableHighlight
                        underlayColor={base.theme.colors.transparent}
                        style={{top: 20}}
                        onPress={() => this.setState({isModalOpen: false})}>
                        <Text style={CreateSOSStyles.emergencyHeader}>Close</Text>
                    </TouchableHighlight>
                </View>
            </Modal>
        )
    }
  rejectModal(details){
      console.log('DETAILS@@@@@@@@@@@',details)
      this.setState({
          isRejModal:true,
          detailsToReject:details
      })

  }
  renderRejectModal(){
      console.log('REJECT MODAL BOX',this.state.isRejModal)
      return (
          <Modal
              style={{height: '110%', width: '100%', alignSelf: 'center',backgroundColor:'transparent',alignItems:'center'}}
              visible={this.state.isRejModal}
              transparent={true}
              onRequestClose={()=>this.setState({isRejModal:false})}>
              <View style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:'transparent',
                  height:hp('100%'),
                  width:wp('100%')
              }}>
              <View style={{width:'80%',height:230,backgroundColor:base.theme.colors.white,borderRadius:20,elevation:5,paddingTop:30,paddingLeft:15}}>
                  <Text style={{fontSize:16,color:base.theme.colors.black}}> Reason for Rejection</Text>
                  <TextInput
                      onChangeText={(text) => this.setState({reasonForReject:text})}
                      value={this.state.reasonForReject}
                      style={{
                          width: '80%',
                          fontSize: 12,
                          justifyContent:'flex-start',
                         // alignItems: 'center',
                          //justifyContent: 'center',
                          height: 100,
                          borderColor: base.theme.colors.greyHead,
                          borderWidth: 1
                      }}
                      multiline={true}
                      maxLength={100}
                      placeholderTextColor={base.theme.colors.grey}
                  />
                  <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:20,width:'80%'}}>
                      <OSButton
                          height={'50%'}
                          width={'30%'}
                          oSBText={'Cancel'}
                          borderRadius={10}
                          onButtonClick={()=>this.setState({isRejModal:false,reasonForReject:""})}
                      />
                      <OSButton
                          height={'50%'}
                          width={'30%'}
                          oSBText={'Submit'}
                          borderRadius={10}
                          onButtonClick={()=>this.reject(this.state.detailsToReject)}
                      />
                  </View>
              </View>
              </View>
          </Modal>
      )
  }

  renderDetails = () => {
    const { navigation } = this.props;
    const details = navigation.getParam('details', 'NO-ID');

    console.log('DETAILS', details);
    return (
      <View >
        <View style={{ marginLeft: hp('2%') }}>
          <Text style={{ color: '#ff8c00' }}>Current Status</Text>
        </View>
        <View style={{ flexDirection: 'row', marginLeft: hp('2%') }}>
          <View style={{ flex: 1 }}>
            <Text>Occupancy</Text>
          </View>
          <View style={{ flex: 2 }}>
              <Text style={{color:base.theme.colors.black}}>
                {this.state.dataSource3} </Text>
          </View>
        </View>
        <FlatList
          data={this.state.dataSource2.reverse()}
          renderItem={({ item }) => (
            <View
              style={{ flex: 1, marginLeft: hp('2%'), marginTop: hp('1%') }}
            >
              <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1 }}>
                    <Text>Resident Name</Text>
                  </View>
                  <View style={{ flex: 2 }}>
                      <Text style={{color:base.theme.colors.black}}>
                        {item.name} </Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 2.5 }}>
                    <Text>Mobile</Text>
                  </View>
                <View style={{ flex: 5, zIndex: 100 }}>

                      <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
                          {
                              Platform.OS === 'android'
                                  ? Linking.openURL(`tel:${item.number }`)
                                  : Linking.openURL(`telprompt:${item.number }`);
                          }}}>
                          <Text style={{color:base.theme.colors.black}}>
                            {item.number ? item.number : ''}</Text>
                      </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
          <View
              style={{
                  borderBottomWidth: 1,
                  borderColor:base.theme.colors.greyCard,
                  marginTop:10

              }}
          />

      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const details = navigation.getParam('details', 'NO-ID');

      let inDate=moment()._d
      let enDate= moment(details.ntdCreated)._d
      let duration = Math.abs(inDate-enDate)
      let days=Math.floor(duration / (1000 * 60 * 60 * 24));
      let hours=Math.floor(duration / (1000 * 60 *60));
      let mins=Math.floor(duration / (1000 *60));
      let valueDis= days >1? moment(details.ntdCreated).format('DD MMM YYYY'): days==1 ? "Yesterday": mins>=120? hours + " hours ago" :(mins<120 && mins>=60)? hours + " hour ago"
          :mins==0 ?"Just now":mins+" mins ago";
      console.log("DETAILS", details,valueDis)

      console.log(this.state.adminStat, this.state.adminStatLoading, 'adminStat');
    return (
      <View style={{
          borderRadius: 5, borderColor: base.theme.colors.lightgrey, backgroundColor: base.theme.colors.white,
          shadowColor: base.theme.colors.greyHead,
          shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 0.5},
          shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.2,
          shadowRadius: 0.5, elevation: 3,  borderBottomWidth: 0.5,
          width:'100%',
          height:'80%'
      }}>
        <SafeAreaView style={{ backgroundColor: '#ff8c00' }}>
          <View style={[styles.viewStyle1, { flexDirection: 'row' }]}>
            <View style={styles.viewDetails1}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
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
                    source={require('../../../icons/back.png')}
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
                source={require('../../../icons/OyespaceSafe.png')}
              />
            </View>
            <View style={{ width: '35%' }}>
              {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
            </View>
          </View>
          <View style={{ borderWidth: 1, borderColor: 'EBECED' }} />
        </SafeAreaView>
          <View style={{flexDirection:'row',width:'100%',height:'10%',backgroundColor:base.theme.colors.shadedWhite,marginTop:20}}>
             <View style={{width:'15%',}}>
              <Image
                  resizeMode={'center'}
                  style={{width:50, height:50,alignItems:'center',justifyContent:'center'}}
                  source={require('../../../icons/notification1.png')}
              />
             </View>
              <View style={{width:'65%',alignItems:'center',justifyContent:'center'}}>
              <Text style={{color:base.theme.colors.black,fontSize:12}}> {details.ntDesc} </Text>
              </View>
              <View style={{width:'20%',alignItems:'center',justifyContent:'center'}}>
                  <Text style={{color:base.theme.colors.grey,fontSize:12}}>{valueDis}</Text>
              </View>
          </View>
          {details.ntType === 'Join_Status' ? null : this.renderButton()}
        {this.state.dataSource3 === '' ? (
          <View></View>
        ) : (
          <View>{this.renderDetails()}</View>
        )}
        <KeyboardAvoidingView>
          {this.renderRejectModal()}
        </KeyboardAvoidingView>

          {this._renderModal1()}


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    // marginTop: 15,
  },

  viewStyle1: {
    backgroundColor: '#fff',
    height: hp('7%'),
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative'
  },
  viewDetails1: {
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10
  },
  viewDetails2: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    // width: hp('3%'),
    // height: hp('3%'),
    marginTop: 5
    // marginLeft: 10
  },
  image: {
    // width: wp('34%'),
    // height: hp('18%')
  },

  buttonContainer: {
   // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15
  },

  titleStyle: {
    fontSize: hp('1.8%'),
    marginBottom: 5,
    textAlign: 'left',
    marginLeft: hp('2%')
  }
});

const mapStateToProps = state => {
  return {
    approvedAdmins: state.AppReducer.approvedAdmins,
    champBaseURL: state.OyespaceReducer.champBaseURL,
    oyeURL: state.OyespaceReducer.oyeURL,
    MyAccountID: state.UserReducer.MyAccountID,
    page: state.NotificationReducer.page,
    userReducer: state.UserReducer,
      mediaupload: state.OyespaceReducer.mediaupload,
      assId:state.DashboardReducer.assId ,
    uniID: state.DashboardReducer.uniID,

  };
};

export default connect(
  mapStateToProps,
  {
    updateApproveAdmin,
    getNotifications,
    createUserNotification,
    onNotificationOpen,
    storeOpenedNotif
  }
)(NotificationDetailScreen);
