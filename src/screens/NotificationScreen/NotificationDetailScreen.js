// const DEV = true;

// import React, { PureComponent } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   Image,
//   SafeAreaView,
//   Dimensions,
//   Linking,
//   Platform,
//   TouchableOpacity
// } from 'react-native';
// import { Button, Header, Avatar } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import axios from 'axios';
// import { CLOUD_FUNCTION_URL } from '../../../constant';
// import { connect } from 'react-redux';
// import {
//   updateApproveAdmin,
//   getNotifications,
//   createUserNotification,
//   storeOpenedNotif,
//   onNotificationOpen
// } from '../../actions';

// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp
// } from 'react-native-responsive-screen';

// import _ from 'lodash';
// import base from '../../base';
// import Collapsible from 'react-native-collapsible';

// // ("ntJoinStat");

// class NotificationDetailScreen extends PureComponent {
//   constructor(props) {
//     super(props);

//     this.state = {
//       loading: false,
//       date: '',
//       reqStatus: '',
//       adminStatLoading: true,
//       adminStat: null,

//       unitIDD: '',
//       dataSource: [],
//       requestorMob: '',

//       dataSource1: [],
//       requestorMob1: '',

//       showButtons: true,

//       appendButtonClicked: false,
//       replaceButtonClicked: false
//     };

//     this.checkAdminNotifStatus = this.checkAdminNotifStatus.bind(this);
//     this.showAppendReplaceUI = this.showAppendReplaceUI.bind(this);
//   }

//   componentDidMount() {
//     const { navigation } = this.props;
//     // const details = navigation.getParam("details", "NO-ID");
//     const index = navigation.getParam('index', 'NO-ID');
//     const notifications = navigation.getParam('notifications', 'NO-ID');
//     const ntid = navigation.getParam('ntid', 'NO-ID');
//     const oyeURL = navigation.getParam('oyeURL', 'NO-ID');
//     const savedNoifId = navigation.getParam('savedNoifId', 'NO-ID');
//     this.props.onNotificationOpen(notifications, index, oyeURL);
//     this.props.storeOpenedNotif(savedNoifId, ntid);

//     // this.manageJoinRequest();
//     this.checkAdminNotifStatus();

//     // this.getRequestorAndResDetails()
//   }

//   checkAdminNotifStatus() {
//     const { navigation, champBaseURL } = this.props;
//     const details = navigation.getParam('details', 'NO-ID');
//     console.log(details, 'detailssss');
//     axios
//       .post(
//         `${this.props.champBaseURL}/Member/GetMemberJoinStatus`,
//         {
//           ACAccntID: details.acNotifyID,
//           UNUnitID: details.sbUnitID,
//           ASAssnID: details.asAssnID
//         },
//         {
//           headers: {
//             'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
//             'Content-Type': 'application/json'
//           }
//         }
//       )
//       .then(res => {
//         this.setState({ adminStatLoading: false });
//         let data = res.data.data;
//         console.log(data, 'adminData');
//         if (data) {
//           if (data.member.meJoinStat === 'Accepted') {
//             this.setState({ adminStat: 'Accepted' });
//           } else if (data.member.meJoinStat === 'Rejected') {
//             this.setState({ adminStat: 'Rejected' });
//           }
//         }
//       })
//       .catch(error => {
//         console.log(error, 'adminDataError');
//         this.setState({ adminStatLoading: false });
//       });

//     fetch(
//       `http://${this.props.oyeURL}/oyeliving/api/v1/GetAccountListByAccountID/${details.acNotifyID}`,
//       {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1'
//         }
//       }
//     )
//       .then(response => response.json())
//       .then(responseJson => {
//         console.log('Response Json', responseJson);
//         this.setState({
//           dataSource1: responseJson.data.account,
//           requestorMob1: responseJson.data.account[0].acMobile
//         });
//         console.log(
//           'Mobile Number1:',
//           this.state.dataSource,
//           this.state.requestorMob1
//         );
//       })
//       .catch(error => {
//         console.log(error);
//       });
//     fetch(
//       `http://${this.props.oyeURL}/oyeliving/api/v1/UnitOwner/GetUnitOwnerListByUnitID/${details.sbUnitID}`,
//       {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1'
//         }
//       }
//     )
//       .then(response => response.json())
//       .then(responseJson => {
//         console.log('Response Json', responseJson);
//         this.setState({
//           dataSource: responseJson.data.unitsByUnitID[0],
//           requestorMob: responseJson.data.unitsByUnitID[0].uoMobile
//         });
//         console.log('Mobile Number:', this.state.dataSource);
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   }

//   /**
//    * @author
//    * Anooj Krishnan G
//    *
//    * @method
//    * manageJoinRequest: Handles the Unit Join request.
//    *
//    * @description
//    * Request will be handled based on occupancy status of Unit.
//    *
//    * Occuppancy Status is as follows:
//    * 1. Sold Owner Occupied Unit (Only Owner will be there)
//    * 2. Sold Tenant Occupied Unit (Owner & Tenant both)
//    * 3. UnSold Vacant Unit (No Owner & Tenant- vacant)
//    * 4. UnSold Tenant Occupied Unit (Only Tenant)
//    * 5. Sold Vacant Unit ( Owner only but vacant)
//    *
//    * Approve/Replace option must be visible for 1, 2,
//    * (4 if request is as tenant)
//    * & ( 5 if request is as owner)
//    *
//    * Rest of the cases will be handled in normal accept/reject method
//    *
//    */
//   // async manageJoinRequest() {
//   //   try {
//   //     const { navigation } = this.props;
//   //     const details = navigation.getParam('details', 'NO-ID');
//   //     const role = details.sbRoleID;
//   //     base.utils.logger.logArgs('NotificationDetailScreen', details);
//   //     //if(details != undefined && details.ntType == "Join" && details.ntJoinStat == "" && details.ntIsActive){
//   //     this.setState({ loading: true });
//   //     const response = await base.services.OyeLivingApi.getUnitDetailByUnitId(
//   //       details.sbUnitID
//   //     );
//   //     this.setState({ loading: false });
//   //     base.utils.logger.logArgs('NotificationDetailScreen2', response);
//   //     if (response.success && response.data.unit != undefined) {
//   //       let unitInfo = response.data.unit;
//   //       if (
//   //         unitInfo.unOcStat == base.utils.strings.SOLD_OWNER_OCCUPIED_UNIT ||
//   //         unitInfo.unOcStat == base.utils.strings.SOLD_TENANT_OCCUPIED_UNIT
//   //       ) {
//   //         this.showAppendReplaceUI(details, unitInfo, role);
//   //       } else if (
//   //         unitInfo.unOcStat == base.utils.strings.UNSOLD_TENANT_OCCUPIED_UNIT &&
//   //         role == base.utils.strings.USER_TENANT
//   //       ) {
//   //       } else if (
//   //         unitInfo.unOcStat == base.utils.strings.SOLD_VACANT_UNIT &&
//   //         role == base.utils.strings.USER_OWNER
//   //       ) {
//   //       }
//   //     } else {
//   //       base.utils.logger.logArgs('manageJoinRequest', 'No Active Request');
//   //     }
//   //     // else{
//   //     // }
//   //   } catch (e) {
//   //     base.utils.logger.logArgs(e);
//   //   }
//   // }

//   showAppendReplaceUI(details) {
//     const { showButtons } = this.state;
//     return (
//       <Collapsible collapsed={showButtons}>
//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             justifyContent: 'center'
//           }}
//         >
//           <Button
//             title="Append"
//             containerStyle={{ marginHorizontal: 5 }}
//             buttonStyle={{ borderColor: 'green', paddingHorizontal: 10 }}
//             titleStyle={{ color: 'green' }}
//             type="outline"
//             onPress={() => {
//               this.append(details);
//             }}
//           />
//           <Button
//             title="Replace"
//             containerStyle={{ marginHorizontal: 5 }}
//             buttonStyle={{ borderColor: 'green', paddingHorizontal: 10 }}
//             type="outline"
//             titleStyle={{ color: 'green' }}
//             onPress={() => {
//               this.replace(details);
//             }}
//           />
//         </View>
//       </Collapsible>
//     );
//   }

//   approve = () => {
//     // const { showButtons } = this.state;
//     this.setState(prevState => ({ showButtons: !prevState.showButtons }));
//   };

//   append = item => {
//     const { oyeURL } = this.props;

//     this.setState({ loading: true, appendButtonClicked: true });
//     // console.log(item);

//     const headers = {
//       'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
//       'Content-Type': 'application/json'
//     };

//     axios
//       .post(
//         this.props.champBaseURL + 'MemberRoleChangeToAdminOwnerUpdate',
//         {
//           MRMRoleID: item.sbRoleID,
//           MEMemID: item.sbMemID,
//           UNUnitID: item.sbUnitID
//         },
//         {
//           headers: headers
//         }
//       )
//       .then(response => {
//         let roleName = item.sbRoleID === 2 ? 'Owner' : 'Tenant';

//         axios
//           .post(`${CLOUD_FUNCTION_URL}/sendUserNotification`, {
//             sbSubID: item.sbSubID,
//             ntTitle: 'Request Approved',
//             ntDesc:
//               'Your request to join ' +
//               item.mrRolName +
//               ' ' +
//               ' unit in ' +
//               item.asAsnName +
//               ' association as ' +
//               roleName +
//               ' has been approved',
//             ntType: 'Join_Status',
//             associationID: item.asAssnID
//           })
//           .then(() => {
//             DateUnit = {
//               MemberID: item.sbMemID,
//               UnitID: item.sbUnitID,
//               MemberRoleID: item.sbRoleID,
//               UNSldDate: item.unSldDate,
//               UNOcSDate: item.unOcSDate
//             };

//             appendTenant = {
//               MEMemID: item.sbMemID,
//               UNUnitID: item.sbUnitID,
//               MRMRoleID: item.sbRoleID
//             };

//             this.props.createUserNotification(
//               'Join_Status',
//               this.props.oyeURL,
//               item.acNotifyID,
//               1,
//               'Your request to join ' +
//                 item.mrRolName +
//                 ' ' +
//                 ' unit in ' +
//                 item.asAsnName +
//                 ' association as ' +
//                 roleName +
//                 ' has been approved',
//               'resident_user',
//               'resident_user',
//               item.sbSubID,
//               'resident_user',
//               'resident_user',
//               'resident_user',
//               'resident_user',
//               'resident_user',
//               false,
//               this.props.MyAccountID
//             );

//             fetch(
//               `${this.props.champBaseURL}Unit/UpdateUnitRoleStatusAndDate`,
//               {
//                 method: 'POST',
//                 headers: {
//                   'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
//                   'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(DateUnit)
//               }
//             )
//               .then(response => response.json())
//               .then(responseJson => {
//                 fetch(
//                   `http://${this.props.oyeURL}/oyeliving/api/v1/AppendMemberOwnerOrTenant`,
//                   {
//                     method: 'POST',
//                     headers: {
//                       'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
//                       'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify(appendTenant)
//                   }
//                 )
//                   .then(response => response.json())
//                   .then(responseJson_2 => {
//                     console.log(JSON.stringify(appendTenant));
//                     console.log(responseJson_2);

//                     StatusUpdate = {
//                       NTID: item.ntid,
//                       NTStatDesc: 'Request Sent'
//                       //NTStatDesc: responseJson_2.data.string
//                     };

//                     fetch(
//                       `http://${this.props.oyeURL}/oyesafe/api/v1/NotificationAcceptanceRejectStatusUpdate`,
//                       {
//                         method: 'POST',
//                         headers: {
//                           'X-OYE247-APIKey':
//                             '7470AD35-D51C-42AC-BC21-F45685805BBE',
//                           'Content-Type': 'application/json'
//                         },
//                         body: JSON.stringify(StatusUpdate)
//                       }
//                     )
//                       .then(response => {
//                         response.json();
//                         console.log('Response', response);
//                       })
//                       .then(responseJson_3 => {
//                         console.log(item.ntid, 'ntid');
//                         console.log('NTJoinStat');
//                         axios
//                           .post(
//                             `http://${oyeURL}/oyesafe/api/v1/Notification/NotificationJoinStatusUpdate`,
//                             {
//                               NTID: item.ntid,
//                               NTJoinStat: 'Accepted'
//                             },
//                             {
//                               headers: {
//                                 'X-OYE247-APIKey':
//                                   '7470AD35-D51C-42AC-BC21-F45685805BBE',
//                                 'Content-Type': 'application/json'
//                               }
//                             }
//                           )
//                           .then(() => {
//                             console.log('updated suc');
//                             this.props.getNotifications(
//                               this.props.oyeURL,
//                               this.props.MyAccountID
//                             );
//                             this.setState({
//                               loading: false,
//                               date: StatusUpdate.NTStatDesc
//                             });

//                             setTimeout(() => {
//                               this.props.navigation.navigate('ResDashBoard');
//                             }, 300);
//                           })
//                           .catch(error => {
//                             console.log('Join Status', error);
//                             Alert.alert('Join Status', error.message);
//                             this.setState({
//                               loading: false
//                             });
//                           });

//                         // this.props.updateApproveAdmin(
//                         //   this.props.approvedAdmins,
//                         //   item.sbSubID
//                         // );
//                       })
//                       .catch(error => {
//                         console.log('StatusUpdate', error);
//                         Alert.alert('StatusUpdate', error.message);
//                         this.setState({ loading: false });
//                       });
//                   })
//                   .catch(error => {
//                     console.log('Update', error);
//                     Alert.alert('Update', error.message);
//                     this.setState({ loading: false });
//                   });
//               })
//               .catch(error => {
//                 console.log('DateUnit', error);
//                 Alert.alert('DateUnit', error.message);
//                 this.setState({ loading: false });
//               });
//           })
//           .catch(error => {
//             console.log('firebase', error);
//             Alert.alert('firebase', error.message);
//             this.setState({ loading: false });
//           });
//       })
//       .catch(error => {
//         console.log('MemberRoleChange', error);
//         Alert.alert('MemberRoleChange', error.message);
//         this.setState({ loading: false });
//       });
//   };

//   replace = item => {
//     this.setState({ loading: true, replaceButtonClicked: true });
//     console.log(item);

//     const headers = {
//       'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
//       'Content-Type': 'application/json'
//     };

//     axios
//       .post(
//         this.props.champBaseURL + 'MemberRoleChangeToAdminOwnerUpdate',
//         {
//           MRMRoleID: item.sbRoleID,
//           MEMemID: item.sbMemID,
//           UNUnitID: item.sbUnitID
//         },
//         {
//           headers: headers
//         }
//       )
//       .then(response => {
//         let roleName = item.sbRoleID === 2 ? 'Owner' : 'Tenant';

//         axios
//           .post(`${CLOUD_FUNCTION_URL}/sendUserNotification`, {
//             sbSubID: item.sbSubID,
//             ntTitle: 'Request Approved',
//             ntDesc:
//               'Your request to join ' +
//               item.mrRolName +
//               ' ' +
//               ' unit in ' +
//               item.asAsnName +
//               ' association as ' +
//               roleName +
//               ' has been approved',
//             ntType: 'Join_Status',
//             associationID: item.asAssnID
//           })
//           .then(() => {
//             DateUnit = {
//               MemberID: item.sbMemID,
//               UnitID: item.sbUnitID,
//               MemberRoleID: item.sbRoleID,
//               UNSldDate: item.unSldDate,
//               UNOcSDate: item.unOcSDate
//             };

//             UpdateTenant = {
//               MEMemID: item.sbMemID,
//               UNUnitID: item.sbUnitID,
//               MRMRoleID: item.sbRoleID
//             };

//             this.props.createUserNotification(
//               'Join_Status',
//               this.props.oyeURL,
//               item.acNotifyID,
//               1,
//               'Your request to join ' +
//                 item.mrRolName +
//                 ' ' +
//                 ' unit in ' +
//                 item.asAsnName +
//                 ' association as ' +
//                 roleName +
//                 ' has been approved',
//               'resident_user',
//               'resident_user',
//               item.sbSubID,
//               'resident_user',
//               'resident_user',
//               'resident_user',
//               'resident_user',
//               'resident_user',
//               false,
//               this.props.MyAccountID
//             );

//             fetch(
//               `${this.props.champBaseURL}Unit/UpdateUnitRoleStatusAndDate`,
//               {
//                 method: 'POST',
//                 headers: {
//                   'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
//                   'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(DateUnit)
//               }
//             )
//               .then(response => response.json())
//               .then(responseJson => {
//                 fetch(
//                   `http://${this.props.oyeURL}/oyeliving/api/v1/UpdateMemberOwnerOrTenantInActive/Update`,
//                   {
//                     method: 'POST',
//                     headers: {
//                       'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
//                       'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify(UpdateTenant)
//                   }
//                 )
//                   .then(response => response.json())
//                   .then(responseJson_2 => {
//                     console.log(JSON.stringify(UpdateTenant));
//                     console.log(responseJson_2);

//                     StatusUpdate = {
//                       NTID: item.ntid,
//                       NTStatDesc: 'Request Sent'
//                       //NTStatDesc: responseJson_2.data.string
//                     };

//                     fetch(
//                       `http://${this.props.oyeURL}/oyesafe/api/v1/NotificationAcceptanceRejectStatusUpdate`,
//                       {
//                         method: 'POST',
//                         headers: {
//                           'X-OYE247-APIKey':
//                             '7470AD35-D51C-42AC-BC21-F45685805BBE',
//                           'Content-Type': 'application/json'
//                         },
//                         body: JSON.stringify(StatusUpdate)
//                       }
//                     )
//                       .then(response => {
//                         response.json();
//                         console.log('Response', response);
//                       })
//                       .then(responseJson_3 => {
//                         console.log(item.ntid, 'ntid');
//                         console.log('NTJoinStat');
//                         axios
//                           .post(
//                             `http://${this.props.oyeURL}/oyesafe/api/v1/Notification/NotificationJoinStatusUpdate`,
//                             {
//                               NTID: item.ntid,
//                               NTJoinStat: 'Accepted'
//                             },
//                             {
//                               headers: {
//                                 'X-OYE247-APIKey':
//                                   '7470AD35-D51C-42AC-BC21-F45685805BBE',
//                                 'Content-Type': 'application/json'
//                               }
//                             }
//                           )
//                           .then(() => {
//                             console.log('updated suc');
//                             this.props.getNotifications(
//                               this.props.oyeURL,
//                               this.props.MyAccountID
//                             );
//                             this.setState({
//                               loading: false,
//                               date: StatusUpdate.NTStatDesc
//                             });

//                             setTimeout(() => {
//                               this.props.navigation.navigate('ResDashBoard');
//                             }, 300);
//                           })
//                           .catch(error => {
//                             console.log('Join Status', error);
//                             Alert.alert('Join Status', error.message);
//                             this.setState({
//                               loading: false
//                             });
//                           });

//                         // this.props.updateApproveAdmin(
//                         //   this.props.approvedAdmins,
//                         //   item.sbSubID
//                         // );
//                       })
//                       .catch(error => {
//                         console.log('StatusUpdate', error);
//                         Alert.alert('StatusUpdate', error.message);
//                         this.setState({ loading: false });
//                       });
//                   })
//                   .catch(error => {
//                     console.log('Update', error);
//                     Alert.alert('Update', error.message);
//                     this.setState({ loading: false });
//                   });
//               })
//               .catch(error => {
//                 console.log('DateUnit', error);
//                 Alert.alert('DateUnit', error.message);
//                 this.setState({ loading: false });
//               });
//           })
//           .catch(error => {
//             console.log('firebase', error);
//             Alert.alert('firebase', error.message);
//             this.setState({ loading: false });
//           });
//       })
//       .catch(error => {
//         console.log('MemberRoleChange', error);
//         Alert.alert('MemberRoleChange', error.message);
//         this.setState({ loading: false });
//       });
//   };

//   reject = (item, status) => {
//     const { oyeURL } = this.props;
//     if (status) {
//       Alert.alert(
//         'Oyespace',
//         'You have already responded to this request!',
//         [{ text: 'Ok', onPress: () => {} }],
//         { cancelable: false }
//       );
//     } else {
//       this.setState({ loading: true });

//       const headers = {
//         'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
//         'Content-Type': 'application/json'
//       };
//       axios
//         .get(
//           `http://${this.props.oyeURL}/oyesafe/api/v1/NotificationActiveStatusUpdate/${item.ntid}`,
//           {
//             headers: {
//               'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE',
//               'Content-Type': 'application/json'
//             }
//           }
//         )
//         .then(() => {
//           let roleName = item.sbRoleID === 1 ? 'Owner' : 'Tenant';
//           axios
//             .get(
//               `http://${this.props.oyeURL}/oyeliving/api/v1//Member/UpdateMemberStatusRejected/${item.sbMemID}`,
//               {
//                 headers: {
//                   'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
//                   'Content-Type': 'application/json'
//                 }
//               }
//             )
//             .then(succc => {
//               console.log(succc, 'worked');
//               axios
//                 .post(`${CLOUD_FUNCTION_URL}/sendUserNotification`, {
//                   sbSubID: item.sbSubID,
//                   ntTitle: 'Request Declined',
//                   ntDesc:
//                     'Your request to join' +
//                     item.mrRolName +
//                     ' ' +
//                     ' unit in ' +
//                     item.asAsnName +
//                     ' association as ' +
//                     roleName +
//                     ' has been declined',
//                   ntType: 'Join_Status'
//                 })
//                 .then(() => {
//                   this.props.createUserNotification(
//                     'Join_Status',
//                     this.props.oyeURL,
//                     item.acNotifyID,
//                     1,
//                     'Your request to join' +
//                       item.mrRolName +
//                       ' ' +
//                       ' unit in ' +
//                       item.asAsnName +
//                       ' association as ' +
//                       roleName +
//                       ' has been declined',
//                     'resident_user',
//                     'resident_user',
//                     item.sbSubID,
//                     'resident_user',
//                     'resident_user',
//                     'resident_user',
//                     'resident_user',
//                     'resident_user',
//                     false,
//                     this.props.MyAccountID
//                   );

//                   axios
//                     .post(
//                       `http://${oyeURL}/oyesafe/api/v1/Notification/NotificationJoinStatusUpdate`,
//                       {
//                         NTID: item.ntid,
//                         NTJoinStat: 'Rejected'
//                       },
//                       {
//                         headers: {
//                           'X-OYE247-APIKey':
//                             '7470AD35-D51C-42AC-BC21-F45685805BBE',
//                           'Content-Type': 'application/json'
//                         }
//                       }
//                     )
//                     .then(() => {
//                       this.props.getNotifications(
//                         this.props.oyeURL,
//                         this.props.MyAccountID
//                       );

//                       this.setState({ loading: false });
//                       // this.props.updateApproveAdmin(
//                       //   this.props.approvedAdmins,
//                       //   item.sbSubID
//                       // );
//                       setTimeout(() => {
//                         this.props.navigation.navigate('ResDashBoard');
//                       }, 300);
//                     })
//                     .catch(error => {
//                       console.log('Join Status', error);
//                       Alert.alert('Join Status', error.message);
//                       this.setState({
//                         loading: false
//                       });
//                     });
//                 })
//                 .catch(error => {
//                   Alert.alert('@@@@@@@@@@@@@@@', error.message);
//                   this.setState({ loading: false });
//                 });
//             })
//             .catch(error => {
//               console.log("update didn't work", error);
//             });
//         })
//         .catch(error => {
//           // Alert.alert("******************", error.message);
//           console.log(error, 'first api');
//           this.setState({ loading: false });
//         });
//       // })
//       // .catch(error => {
//       //   // Alert.alert("#################", error.message);
//       //   console.log(error, "last");
//       //   this.setState({ loading: false });
//       // });
//     }
//   };

//   renderButton = () => {
//     const { loading, adminStatLoading, adminStat } = this.state;
//     const { navigation } = this.props;
//     const details = navigation.getParam('details', 'NO-ID');

//     let subId = details.sbSubID;
//     // let status = _.includes(approvedAdmins, subId);
//     // let status = false;

//     let status;

//     if (loading || adminStatLoading) {
//       return (
//         <View
//           style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
//         >
//           <ActivityIndicator />
//         </View>
//       );
//     } else {
//       if (details.ntType === 'Join_Status') {
//         return null;
//       } else if (details.ntType === 'gate_app') {
//         return null;
//       } else {
//         if (adminStat) {
//           return null;
//         } else {
//           if (details.ntJoinStat) {
//             if (details.ntJoinStat === 'Accepted') {
//               status = (
//                 <View
//                   style={{
//                     alignItems: 'center',
//                     justifyContent: 'center'
//                   }}
//                 >
//                   <Text> {this.state.date || 'Request Accepted'} </Text>
//                 </View>
//               );
//             } else if (details.ntJoinStat === 'Rejected') {
//               status = (
//                 <View
//                   style={{
//                     alignItems: 'center',
//                     justifyContent: 'center'
//                   }}
//                 >
//                   <Text>{this.state.date || 'Request Rejected'}</Text>
//                 </View>
//               );
//             }
//           } else {
//             status = (
//               <View style={styles.buttonContainer}>
//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     width: '100%',
//                     justifyContent: 'space-around',
//                     marginBottom: '10%'
//                   }}
//                 >
//                   <View
//                     style={{
//                       flexDirection: 'column',
//                       justifyContent: 'flex-start',
//                       alignItems: 'center'
//                     }}
//                   >
//                     <Avatar
//                       onPress={() => this.reject(details)}
//                       overlayContainerStyle={{
//                         backgroundColor: 'red'
//                       }}
//                       rounded
//                       icon={{
//                         name: 'close',
//                         type: 'font-awesome',
//                         size: 15,
//                         color: '#fff'
//                       }}
//                     />
//                     <Text style={{ color: 'red' }}> Reject </Text>
//                   </View>
//                   <View
//                     style={{
//                       flexDirection: 'column',
//                       justifyContent: 'flex-start',
//                       alignItems: 'center'
//                     }}
//                   >
//                     <Avatar
//                       onPress={() => this.approve(details)}
//                       overlayContainerStyle={{
//                         backgroundColor: 'orange'
//                       }}
//                       rounded
//                       icon={{
//                         name: 'check',
//                         type: 'font-awesome',
//                         size: 15,
//                         color: '#fff'
//                       }}
//                     />
//                     <Text style={{ color: 'orange' }}> Approve </Text>
//                   </View>
//                 </View>
//                 <View>{this.showAppendReplaceUI(details)}</View>
//               </View>
//             );
//           }
//         }
//       }

//       return status;
//     }
//   };

//   renderDetails = () => {
//     const { navigation } = this.props;
//     const details = navigation.getParam('details', 'NO-ID');
//     if (
//       this.state.replaceButtonClicked === true &&
//       this.state.appendButtonClicked === false
//     ) {
//       return (
//         <View style={{ flexDirection: 'column' }}>
//           <View style={{ flexDirection: 'row' }}>
//             <Text>Resident Name: </Text>
//             <Text>{this.state.dataSource.uofName} </Text>
//             <Text>{this.state.dataSource.uolName}</Text>
//           </View>
//           {/* <View style={{ flexDirection: 'row' }}>
//                   <Text>Unit Name: </Text>
//                   <Text>{
//                     (details.ntDesc !== undefined) ? details.ntDesc.split(' ')[5].trim() : ''
//                   }{" "}
//                   </Text>
//                 </View> */}
//           <View style={{ flexDirection: 'row' }}>
//             <Text>Mobile: </Text>
//             <TouchableOpacity
//               onPress={() => {
//                 {
//                   Platform.OS === 'android'
//                     ? Linking.openURL(
//                         `tel:${
//                           this.state.requestorMob ? this.state.requestorMob : ''
//                         }`
//                       )
//                     : Linking.openURL(
//                         `tel:${
//                           this.state.requestorMob ? this.state.requestorMob : ''
//                         }`
//                       );
//                 }
//               }}
//             >
//               <View style={{ flexDirection: 'row' }}>
//                 <Text>
//                   {this.state.requestorMob ? this.state.requestorMob : ''}
//                 </Text>
//                 <Image
//                   style={{ width: hp('2%'), height: hp('2%') }}
//                   source={require('../../../icons/call.png')}
//                 />
//               </View>
//             </TouchableOpacity>
//           </View>
//         </View>
//       );
//     } else if (
//       this.state.appendButtonClicked === true &&
//       this.state.replaceButtonClicked === false
//     ) {
//       return (
//         <View style={{ flexDirection: 'column' }}>
//           <View style={{ flexDirection: 'row' }}>
//             <Text>Resident Name: </Text>
//             <Text>{this.state.dataSource.uofName} </Text>
//             <Text>{this.state.dataSource.uolName}</Text>
//           </View>

//           <View style={{ flexDirection: 'row' }}>
//             <Text>Mobile: </Text>
//             <TouchableOpacity
//               onPress={() => {
//                 {
//                   Platform.OS === 'android'
//                     ? Linking.openURL(
//                         `tel:${
//                           this.state.requestorMob ? this.state.requestorMob : ''
//                         }`
//                       )
//                     : Linking.openURL(
//                         `tel:${
//                           this.state.requestorMob ? this.state.requestorMob : ''
//                         }`
//                       );
//                 }
//               }}
//             >
//               <View style={{ flexDirection: 'row' }}>
//                 <Text>
//                   {this.state.requestorMob ? this.state.requestorMob : ''}
//                 </Text>
//                 <Image
//                   style={{ width: hp('2%'), height: hp('2%') }}
//                   source={require('../../../icons/call.png')}
//                 />
//               </View>
//             </TouchableOpacity>
//           </View>
//         </View>
//       );
//     } else {
//       return (
//         <View style={{ flex: 1, marginLeft: hp('5%'), marginTop: hp('15%') }}>
//           <View style={{ flexDirection: 'column', marginBottom: hp('5%') }}>
//             <View style={{ flexDirection: 'row' }}>
//               <Text>Requestor Name: </Text>
//               <Text>
//                 {details.ntDesc !== undefined
//                   ? details.ntDesc.split(' ')[0].trim()
//                   : ''}{' '}
//               </Text>
//               <Text>
//                 {details.ntDesc !== undefined
//                   ? details.ntDesc.split(' ')[1].trim()
//                   : ''}
//               </Text>
//             </View>
//             <View style={{ flexDirection: 'row' }}>
//               <Text>Unit Name: </Text>
//               <Text>
//                 {details.ntDesc !== undefined
//                   ? details.ntDesc.split(' ')[5].trim()
//                   : ''}{' '}
//               </Text>
//             </View>
//             <View style={{ flexDirection: 'row' }}>
//               <Text>Mobile: </Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   {
//                     Platform.OS === 'android'
//                       ? Linking.openURL(
//                           `tel:${
//                             this.state.requestorMob1
//                               ? this.state.requestorMob1
//                               : ''
//                           }`
//                         )
//                       : Linking.openURL(
//                           `tel:${
//                             this.state.requestorMob1
//                               ? this.state.requestorMob1
//                               : ''
//                           }`
//                         );
//                   }
//                 }}
//               >
//                 <View style={{ flexDirection: 'row' }}>
//                   <Text>
//                     {this.state.requestorMob1 ? this.state.requestorMob1 : ''}
//                   </Text>
//                   <Image
//                     style={{ width: hp('2%'), height: hp('2%') }}
//                     source={require('../../../icons/call.png')}
//                   />
//                 </View>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={{ flexDirection: 'column' }}>
//             <View style={{ flexDirection: 'row' }}>
//               <Text>Resident Name: </Text>
//               <Text>{this.state.dataSource.uofName} </Text>
//               <Text>{this.state.dataSource.uolName}</Text>
//             </View>
//             <View style={{ flexDirection: 'row' }}>
//               <Text>Mobile: </Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   {
//                     Platform.OS === 'android'
//                       ? Linking.openURL(
//                           `tel:${
//                             this.state.requestorMob
//                               ? this.state.requestorMob
//                               : ''
//                           }`
//                         )
//                       : Linking.openURL(
//                           `tel:${
//                             this.state.requestorMob
//                               ? this.state.requestorMob
//                               : ''
//                           }`
//                         );
//                   }
//                 }}
//               >
//                 <View style={{ flexDirection: 'row' }}>
//                   <Text>
//                     {this.state.requestorMob ? this.state.requestorMob : ''}
//                   </Text>
//                   <Image
//                     style={{ width: hp('2%'), height: hp('2%') }}
//                     source={require('../../../icons/call.png')}
//                   />
//                 </View>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       );
//     }
//   };

//   render() {
//     const { navigation } = this.props;
//     const details = navigation.getParam('details', 'NO-ID');
//     // console.log('DETAILS:', details)
//     return (
//       <View style={styles.container}>
//         {/* <Header
//           leftComponent={{
//             icon: "arrow-left",
//             color: "#ED8A19",
//             type: "material-community",
//             onPress: () => navigation.pop()
//           }}
//           containerStyle={{
//             borderBottomColor: "#ED8A19",
//             borderBottomWidth: 2
//           }}
//           centerComponent={
//             <Image
//               source={require("../../../pages/assets/images/OyeSpace.png")}
//               style={{ height: 90, width: 90 }}
//             />
//           }
//           backgroundColor="#fff"
//         /> */}

//         <SafeAreaView style={{ backgroundColor: '#ff8c00' }}>
//           <View style={[styles.viewStyle1, { flexDirection: 'row' }]}>
//             <View style={styles.viewDetails1}>
//               <TouchableOpacity
//                 onPress={() => {
//                   this.props.navigation.goBack();
//                 }}
//               >
//                 <View
//                   style={{
//                     height: hp('4%'),
//                     width: wp('15%'),
//                     alignItems: 'flex-start',
//                     justifyContent: 'center'
//                   }}
//                 >
//                   <Image
//                     resizeMode="contain"
//                     source={require('../../../icons/back.png')}
//                     style={styles.viewDetails2}
//                   />
//                 </View>
//               </TouchableOpacity>
//             </View>
//             <View
//               style={{
//                 width: '35%',
//                 justifyContent: 'center',
//                 alignItems: 'center'
//               }}
//             >
//               <Image
//                 style={[styles.image]}
//                 source={require('../../../icons/headerLogo.png')}
//               />
//             </View>
//             <View style={{ width: '35%' }}></View>
//           </View>
//           <View style={{ borderWidth: 1, borderColor: 'orange' }} />
//         </SafeAreaView>
//         <Text style={styles.titleStyle}> {details.ntDesc} </Text>
//         <View style={{ height: hp('8%') }}>
//           {details.ntType === 'Join_Status' ? null : this.renderButton()}
//         </View>

//         {this.renderDetails()}
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1
//     // marginTop: 15,
//   },

//   viewStyle1: {
//     backgroundColor: '#fff',
//     height: hp('7%'),
//     width: '100%',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     elevation: 2,
//     position: 'relative'
//   },
//   viewDetails1: {
//     width: '30%',
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     marginLeft: 10
//   },
//   viewDetails2: {
//     alignItems: 'flex-start',
//     justifyContent: 'center',
//     width: hp('3%'),
//     height: hp('3%'),
//     marginTop: 5
//     // marginLeft: 10
//   },
//   image: {
//     width: wp('24%'),
//     height: hp('10%')
//   },

//   buttonContainer: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     marginTop: 15
//   },

//   titleStyle: {
//     fontSize: 16,
//     marginBottom: 5,
//     textAlign: 'center'
//   }
// });

// const mapStateToProps = state => {
//   return {
//     approvedAdmins: state.AppReducer.approvedAdmins,
//     champBaseURL: state.OyespaceReducer.champBaseURL,
//     oyeURL: state.OyespaceReducer.oyeURL,
//     MyAccountID: state.UserReducer.MyAccountID,
//     page: state.NotificationReducer.page
//   };
// };

// export default connect(
//   mapStateToProps,
//   {
//     updateApproveAdmin,
//     getNotifications,
//     createUserNotification,
//     onNotificationOpen,
//     storeOpenedNotif
//   }
// )(NotificationDetailScreen);

import React, {PureComponent} from 'react';
import {
    ActivityIndicator,
    Alert,
    BackHandler,
    FlatList,
    Image,
    Linking,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {Avatar} from 'react-native-elements';
import axios from 'axios';
import {CLOUD_FUNCTION_URL} from '../../../constant';
import {connect} from 'react-redux';
import {
    createUserNotification,
    getNotifications,
    onNotificationOpen,
    storeOpenedNotif,
    updateApproveAdmin
} from '../../actions';

import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import base from '../../base';
import firebase from "react-native-firebase";

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
            replaceButtonClicked: false
        };

        this.checkAdminNotifStatus = this.checkAdminNotifStatus.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;
        // const details = navigation.getParam("details", "NO-ID");
        const index = navigation.getParam('index', 'NO-ID');
        const notifications = navigation.getParam('notifications', 'NO-ID');
        const ntid = navigation.getParam('ntid', 'NO-ID');
        const oyeURL = navigation.getParam('oyeURL', 'NO-ID');
        const savedNoifId = navigation.getParam('savedNoifId', 'NO-ID');
        this.props.onNotificationOpen(notifications, index, oyeURL);
        this.props.storeOpenedNotif(savedNoifId, ntid);
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            console.log("Notification Detail screen");
            this.props.navigation.goBack(null);
            return true;
        });

        this.manageJoinRequest();
        this.checkAdminNotifStatus();
        // console.log(this.props, 'notificationdetailscreen');
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
        const {goBack} = this.props.navigation;
        goBack(null);
    }

    checkAdminNotifStatus() {
        const {navigation, champBaseURL} = this.props;
        const details = navigation.getParam('details', 'NO-ID');
        console.log(details, 'detailssss');

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
                this.setState({adminStatLoading: false});
                let data = res.data.data;

                console.log(data, res, 'adminData');
                if (data) {
                    if (
                        data.member.meJoinStat === 'Accepted' &&
                        data.member.mrmRoleID === details.sbRoleID &&
                        data.member.meIsActive
                    ) {
                        this.setState({adminStat: 'Accepted'});
                    } else if (
                        data.member.meJoinStat === 'Rejected' &&
                        data.member.mrmRoleID === details.sbRoleID &&
                        data.member.meIsActive
                    ) {
                        this.setState({adminStat: 'Rejected'});
                    }
                }
            })
            .catch(error => {
                console.log(error, 'adminDataError');
                this.setState({adminStatLoading: false});
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
            const {navigation} = this.props;
            const details = navigation.getParam('details', 'NO-ID');
            const role = details.sbRoleID;
            base.utils.logger.logArgs('NotificationDetailScreen', details);
            //if(details != undefined && details.ntType == "Join" && details.ntJoinStat == "" && details.ntIsActive){
            this.setState({loading: true});
            const response = await base.services.OyeLivingApi.getUnitDetailByUnitId(
                details.sbUnitID
            );
            this.setState({loading: false});
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

    showAppendReplaceUI(notification, unitInfo, accessedRole) {
    }

    approve = (item, status) => {
        const {oyeURL} = this.props;
        if (status) {
            Alert.alert(
                'Oyespace',
                'You have already responded to this request!',
                [{
                    text: 'Ok', onPress: () => {
                    }
                }],
                {cancelable: false}
            );
        } else {
            let MemberID = global.MyOYEMemberID;
            this.setState({loading: true});
            console.log(item);

            const headers = {
                'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
                'Content-Type': 'application/json'
            };

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
                            DateUnit = {
                                MemberID: item.sbMemID,
                                UnitID: item.sbUnitID,
                                MemberRoleID: item.sbRoleID,
                                UNSldDate: item.unSldDate,
                                UNOcSDate: item.unOcSDate
                            };

                            UpdateTenant = {
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
                                        .then(responseJson_2 => {
                                            console.log(JSON.stringify(UpdateTenant));
                                            console.log(responseJson_2);

                                            StatusUpdate = {
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
                                                    console.log('Response', response);
                                                })
                                                .then(responseJson_3 => {
                                                    console.log(item.ntid, 'ntid');
                                                    console.log('NTJoinStat');
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
                                                    this.setState({loading: false});
                                                });
                                        })
                                        .catch(error => {
                                            console.log('Update', error);
                                            Alert.alert('Update', error.message);
                                            this.setState({loading: false});
                                        });
                                })
                                .catch(error => {
                                    console.log('DateUnit', error);
                                    Alert.alert('DateUnit', error.message);
                                    this.setState({loading: false});
                                });
                        })
                        .catch(error => {
                            console.log('firebase', error);
                            Alert.alert('firebase', error.message);
                            this.setState({loading: false});
                        });
                })
                .catch(error => {
                    console.log('MemberRoleChange', error);
                    Alert.alert('MemberRoleChange', error.message);
                    this.setState({loading: false});
                });
        }
    };

    reject = (item, status) => {
        const {oyeURL} = this.props;
        if (status) {
            Alert.alert(
                'Oyespace',
                'You have already responded to this request!',
                [{
                    text: 'Ok', onPress: () => {
                    }
                }],
                {cancelable: false}
            );
        } else {
            this.setState({loading: true});

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
                            `http://${this.props.oyeURL}/oyeliving/api/v1//Member/UpdateMemberStatusRejected/${item.sbMemID}`,
                            {
                                headers: {
                                    'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
                                    'Content-Type': 'application/json'
                                }
                            }
                        )
                        .then(succc => {
                            console.log(succc, 'worked');
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

                                            this.setState({loading: false});
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
                                    this.setState({loading: false});
                                });
                        })
                        .catch(error => {
                            console.log("update didn't work", error);
                        });
                })
                .catch(error => {
                    // Alert.alert("******************", error.message);
                    console.log(error, 'first api');
                    this.setState({loading: false});
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
        const {loading, adminStatLoading, adminStat} = this.state;
        const {navigation} = this.props;
        const details = navigation.getParam('details', 'NO-ID');

        let subId = details.sbSubID;
        // let status = _.includes(approvedAdmins, subId);
        // let status = false;

        let status;

        if (loading || adminStatLoading) {
            return (
                <View
                    style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
                >
                    <ActivityIndicator/>
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
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontWeight: '500'}}> {'Request Accepted'} </Text>
                        </View>
                    );
                } else if (adminStat === 'Rejected') {
                    return (
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontWeight: '500'}}> {'Request Rejected'} </Text>
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
                            <View stlye={{}}>
                                <View style={styles.buttonContainer}>
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Avatar
                                            onPress={() => this.reject(details)}
                                            overlayContainerStyle={{
                                                backgroundColor: 'red'
                                            }}
                                            rounded
                                            icon={{
                                                name: 'close',
                                                type: 'font-awesome',
                                                size: 15,
                                                color: '#fff'
                                            }}
                                        />
                                        <Text style={{color: 'red'}}> Reject </Text>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Avatar
                                            onPress={() => this.approve(details)}
                                            overlayContainerStyle={{
                                                backgroundColor: 'orange'
                                            }}
                                            rounded
                                            icon={{
                                                name: 'check',
                                                type: 'font-awesome',
                                                size: 15,
                                                color: '#fff'
                                            }}
                                        />
                                        <Text style={{color: 'orange'}}> Approve </Text>
                                    </View>
                                </View>

                                <View
                                    style={{
                                        flexDirection: 'column',
                                        marginTop: hp('10%'),
                                        marginBottom: hp('2%'),
                                        marginLeft: hp('2%')
                                    }}
                                >
                                    <View>
                                        <Text style={{color: '#ff8c00'}}>Requestor </Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <View style={{flex: 1}}>
                                            <Text>Name</Text>
                                        </View>
                                        <View style={{flex: 2, flexDirection: 'row'}}>
                                            <Text>
                                                {details.ntDesc !== undefined
                                                    ? details.ntDesc.split(' ')[0].trim()
                                                    : ''}{' '}
                                            </Text>
                                            <Text>
                                                {details.ntDesc !== undefined
                                                    ? details.ntDesc.split(' ')[1].trim()
                                                    : ''}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <View style={{flex: 2.5}}>
                                            <Text>Mobile</Text>
                                        </View>
                                        <View style={{flex: 5}}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    Platform.OS === 'android'
                                                        ? Linking.openURL(`tel:${this.state.requestorMob1}`)
                                                        : Linking.openURL(
                                                        `tel:${this.state.requestorMob1}`
                                                        );
                                                }}
                                            >
                                                <View style={{flexDirection: 'row'}}>
                                                    <Text>{this.state.requestorMob1}</Text>
                                                    <Image
                                                        style={{width: hp('2%'), height: hp('2%')}}
                                                        source={require('../../../icons/call.png')}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <View style={{flex: 1}}>
                                            <Text>Unit</Text>
                                        </View>
                                        <View style={{flex: 2}}>
                                            <Text>
                                                {details.ntDesc !== undefined
                                                    ? details.ntDesc.split(' ')[5].trim()
                                                    : ''}{' '}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            borderWidth: 1,
                                            borderColor: '#E5E5E5',
                                            marginTop: hp('1%'),
                                            marginBottom: hp('3%')
                                        }}
                                    />
                                </View>
                            </View>
                        );
                    }
                }
            }

            return status;
        }
    };

    renderDetails = () => {
        const {navigation} = this.props;
        const details = navigation.getParam('details', 'NO-ID');

        console.log('DETAILS', details);
        return (
            <View style={{marginTop: hp('20%')}}>
                <View style={{marginLeft: hp('2%')}}>
                    <Text style={{color: '#ff8c00'}}>Current Status</Text>
                </View>
                <View style={{flexDirection: 'row', marginLeft: hp('2%')}}>
                    <View style={{flex: 1}}>
                        <Text>Occupancy</Text>
                    </View>
                    <View style={{flex: 2}}>
                        <Text>{this.state.dataSource3} </Text>
                    </View>
                </View>
                <FlatList
                    style={{height: '100%'}}
                    data={this.state.dataSource2.reverse()}
                    renderItem={({item}) => (
                        <View
                            style={{flex: 1, marginLeft: hp('2%'), marginTop: hp('1%')}}
                        >
                            <View style={{flexDirection: 'column'}}>
                                <View style={{flexDirection: 'row'}}>
                                    <View style={{flex: 1}}>
                                        <Text>Resident Name</Text>
                                    </View>
                                    <View style={{flex: 2}}>
                                        <Text>{item.name} </Text>
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <View style={{flex: 2.5}}>
                                        <Text>Mobile</Text>
                                    </View>
                                    <View style={{flex: 5, zIndex: 100}}>
                                        <TouchableOpacity
                                            // onPress={() => alert("here")}

                                            onPress={() => {
                                                Platform.OS === 'android'
                                                    ? Linking.openURL(
                                                    `tel:${item.number ? item.number : ''}`
                                                    )
                                                    : Linking.openURL(
                                                    `tel:${item.number ? item.number : ''}`
                                                    );
                                            }}
                                        >
                                            <View style={{flexDirection: 'row'}}>
                                                <Text>{item.number ? item.number : ''}</Text>
                                                <Image
                                                    style={{width: hp('2%'), height: hp('2%')}}
                                                    source={require('../../../icons/call.png')}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                />
            </View>
        );
    };

    render() {
        const {navigation} = this.props;
        const details = navigation.getParam('details', 'NO-ID');
        // console.log("DETAILS", details)
        console.log(this.state.adminStat, this.state.adminStatLoading, 'adminStat');
        return (
            <View style={styles.container}>
                <SafeAreaView style={{backgroundColor: '#ff8c00'}}>
                    <View style={[styles.viewStyle1, {flexDirection: 'row'}]}>
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
                        <View style={{width: '35%'}}>
                            {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
                        </View>
                    </View>
                    <View style={{borderWidth: 1, borderColor: 'orange'}}/>
                </SafeAreaView>
                <View style={{marginTop: hp('2%')}}>
                    <Text style={styles.titleStyle}> {details.ntDesc} </Text>
                </View>

                <View style={{height: hp('8%')}}>
                    {details.ntType === 'Join_Status' ? null : this.renderButton()}
                </View>
                {this.state.dataSource3 === '' ? (
                    <View></View>
                ) : (
                    <View>{this.renderDetails()}</View>
                )}
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
        shadowOffset: {width: 0, height: 2},
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
        width: hp('3%'),
        height: hp('3%'),
        marginTop: 5
        // marginLeft: 10
    },
    image: {
        width: wp('34%'),
        height: hp('18%')
    },

    buttonContainer: {
        flex: 1,
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
        page: state.NotificationReducer.page
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
