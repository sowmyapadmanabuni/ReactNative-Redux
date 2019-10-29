import React, { Fragment, PureComponent } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { Card, ListItem, Button } from 'react-native-elements';
import {
  getNotifications,
  onEndReached,
  onNotificationOpen,
  refreshNotifications,
  storeOpenedNotif,
  toggleCollapsible,
  onGateApp
} from '../../actions';
import _ from 'lodash';
import { NavigationEvents } from 'react-navigation';
import Collapsible from 'react-native-collapsible';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import axios from 'axios';
import moment from 'moment';
import firebase from 'react-native-firebase';
import base from '../../base';
import gateFirebase from 'firebase';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import IcoMoonConfig from '../../assets/selection.json';

const Icon = createIconSetFromIcoMoon(IcoMoonConfig);

class NotificationScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      gateDetails: [],
      Date: [],
      Time: [],
      Date1: [],
      Time1: []
    };
    this.renderCollapseData = this.renderCollapseData.bind(this);
  }

  componentDidMount() {
    base.utils.validate.checkSubscription(
      this.props.userReducer.SelectedAssociationID
    );
    this.doNetwork(null, this.props.notifications);
    firebase.notifications().removeAllDeliveredNotifications();
    axios
      .get(`http://${this.props.oyeURL}/oyesafe/api/v1/GetCurrentDateTime`, {
        headers: {
          'Content-Type': 'application/json',
          'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
        }
      })
      .then(res => {
        console.log(res.data, 'current time');
        this.setState({ currentTime: res.data.data.currentDateTime });
      })
      .catch(error => {
        console.log(error, 'erro_fetching_data');
        this.setState({ currentTime: 'failed' });
      });

    //   alert('mounted');
    //   gateFirebase
    //     .database()
    //     .ref(`NotificationSync/${}`)
    //     .once('value')
    //     .then(snapshot => {
    //       console.log(snapshot.val(), 'value_firebase');
    //     //   alert('here');
    //     })
    //     .catch(error => {
    //       console.log(error, 'error_reading');
    //     //   alert('error');
    //     });
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

  keyExtractor = (item, index) => index.toString();

  onPress = (item, index) => {
    const { notifications, savedNoifId, oyeURL } = this.props;
    if (
      item.ntType === 'Join' ||
      item.ntType === 'Join_Status'

      // item.ntType === "gate_app"
    ) {
      this.props.navigation.navigate('NotificationDetailScreen', {
        details: item,
        index,
        notifications,
        oyeURL,
        savedNoifId,
        ntid: item.ntid
      });
      // this.props.onNotificationOpen(notifications, index, oyeURL);
      // this.props.storeOpenedNotif(savedNoifId, item.ntid);
    } else if (item.ntType === 'Announcement') {
      //Seperate Page i'll write
      console.log('Announcement_item', item);
      this.props.navigation.navigate('NotificationAnnouncementDetailScreen', {
        notifyid: item.acNotifyID,
        associationid: item.asAssnID,
        accountid: item.acAccntID,
        index,
        notifications,
        oyeURL,
        savedNoifId,
        ntid: item.ntid
      });
    }
  };

  renderIcons = (type, item, index) => {
    const { savedNoifId } = this.props;
    // let status = _.includes(savedNoifId, item.ntid);

    if (type === 'name') {
      if (!item.ntIsActive) {
        return 'mail-read';
      } else {
        return 'ios-mail-unread';
      }
    } else if (type === 'type') {
      if (!item.ntIsActive) {
        return 'octicon';
      } else {
        return 'ionicon';
      }
    } else if (type === 'style') {
      if (!item.ntIsActive) {
        return { backgroundColor: '#fff' };
      } else {
        return { backgroundColor: '#eee' };
      }
    }
  };

  renderTitle = type => {
    if (type === 'Join') {
      return 'Request to Join';
    } else if (type === 'Join_Status') {
      return 'Request to Join Status';
    } else if (type === 'gate_app') {
      return 'Gate App Notification';
    } else if (type === 'Announcement') {
      return 'Announcement';
    }
  };

  renderStyle = active => {
    if (active) {
      return { backgroundColor: '#eee' };
    } else return { backgroundColor: '#fff' };
  };

  gateAppNotif = () => {
    const { details } = this.props.navigation.state.params;
    // console.log("@#@$#$#@%#%#%#%@#%@#%", details.sbMemID);
    fetch(
      `http://${this.props.oyeURL}/oyesafe/api/v1/VisitorLog/GetVisitorLogListByVisLogID/` +
        details.sbMemID,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log('Response from server notification list', responseJson);
        this.setState({
          gateDetails: responseJson.data.visitorLog,
          Date:
            responseJson.data.visitorLog.vldCreated.substring(8, 10) +
            '-' +
            responseJson.data.visitorLog.vldCreated.substring(5, 7) +
            '-' +
            responseJson.data.visitorLog.vldCreated.substring(0, 4),
          Time: responseJson.data.visitorLog.vlEntryT.substring(11, 16),
          Date1:
            responseJson.data.visitorLog.vldUpdated.substring(8, 10) +
            '-' +
            responseJson.data.visitorLog.vldUpdated.substring(5, 7) +
            '-' +
            responseJson.data.visitorLog.vldUpdated.substring(0, 4),
          Time1: responseJson.data.visitorLog.vlExitT.substring(11, 16)
        });
        console.log(
          '@#!@$@#%#%#$^$^$%^$%^Gate Details',
          this.state.gateDetails,
          this.state.Date,
          this.state.Time
        );
      })
      .catch(error => {
        console.log(error);
      });
  };

  renderCollapseData(type, id) {
    console.log('Gate app get data$$$$$$', type, id);
    const { gateDetails } = this.state;
    let value = '';

    if (gateDetails.length <= 0) {
      value = '';
    } else {
      if (type === 'vlGtName') {
        let foundData = _.find(gateDetails, { sbMemID: id });
        console.log('founddata in notification', foundData);
        value = foundData ? foundData.vlGtName : '';
      } else if (type === 'vlfName') {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData ? foundData.vlfName : '';
      } else if (type === 'vlVisType') {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData ? foundData.vlVisType : '';
      } else if (type === 'vlComName') {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData ? foundData.vlComName : ' ';
      } else if (type === 'vlMobile') {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData ? foundData.vlMobile : '';
      } else if (type === 'vlEntryImg') {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData ? foundData.vlEntryImg : '';
      } else if (type === 'vlEntryT') {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData ? moment(foundData.vlEntryT).format('hh:mm A') : '';
      } else if (type === 'vlExitT') {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData ? moment(foundData.vlExitT).format('hh:mm A') : '';
      } else if (type === 'vldCreated') {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData
          ? moment(foundData.vldCreated, 'YYYY-MM-DD').format('DD-MM-YYYY')
          : '';
      } else if (type === 'vldUpdated') {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData
          ? moment(foundData.vldUpdated, 'YYYY-MM-DD').format('DD-MM-YYYY')
          : '';
      } else if (type === 'vlengName') {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData ? foundData.vlengName : '';
      } else if (type === 'vlexgName') {
        let foundData = _.find(gateDetails, { sbMemID: id });
        value = foundData ? foundData.vlexgName : '';
      }
    }

    console.log('return value', value);
    return value;
  }

  doNetwork = (item, notifications) => {
    let gateDetailsArr = [];

    this.props.notifications.map((data, index) => {
      if (data.ntType === 'gate_app') {
        axios
          .get(
            `http://${this.props.oyeURL}/oyesafe/api/v1/VisitorLog/GetVisitorLogListByVisLogID/${data.sbMemID}`,
            //data.sbMemID`,
            {
              headers: {
                'Content-Type': 'application/json',
                'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
              }
            }
          )
          .then(res => {
            let responseData = res.data.data;
            for (let i = 0; i < this.props.notifications.length; i++) {
              if (
                this.props.notifications[i].sbMemID ===
                responseData.visitorLog.vlVisLgID
              ) {
                console.log(
                  'Ids equal',
                  this.props.notifications[i].sbMemID,
                  responseData.visitorLog.vlVisLgID
                );
                this.props.notifications[i].vlEntryImg =
                  responseData.visitorLog.vlEntryImg;
                this.props.notifications[i].vlGtName =
                  responseData.visitorLog.vlGtName;
                this.props.notifications[i].vlfName =
                  responseData.visitorLog.vlfName;
                this.props.notifications[i].vlVisType =
                  responseData.visitorLog.vlVisType;
                this.props.notifications[i].vlComName =
                  responseData.visitorLog.vlComName;
                this.props.notifications[i].vlMobile =
                  responseData.visitorLog.vlMobile;
                this.props.notifications[i].vlEntryT =
                  responseData.visitorLog.vlEntryT;
                this.props.notifications[i].vldCreated =
                  responseData.visitorLog.vldCreated;
                this.props.notifications[i].vlengName =
                  responseData.visitorLog.vlengName;
                this.props.notifications[i].vlexgName =
                  responseData.visitorLog.vlexgName;
                this.props.notifications[i].vldUpdated =
                  responseData.visitorLog.vldUpdated;
                this.props.notifications[i].vlExitT =
                  responseData.visitorLog.vlExitT;
              }
            }
            this.setState(
              (prevState, newEmployer) => ({
                gateDetails: prevState.gateDetails.concat([
                  { ...responseData.visitorLog, ...data }
                ])
              }),
              () => {}
            );
          })
          .catch(error => {
            console.log(error, 'error while fetching networks');
          });
      }
      console.log('Props  notifications~~~~~', this.props.notifications);
    });
  };

  acceptgateVisitor = (visitorId, index, associationid) => {
    let oldNotif = [...this.props.notifications];
    console.log(visitorId, 'visitorLogid');
    oldNotif[index].opened = true;
    this.props.onGateApp(oldNotif);

    let timeFormat = moment.utc().format();
    let anotherString = timeFormat.replace(/Z/g, '');
    console.log(anotherString, 'another_string');

    // let

    // alert(oldNotif[index].opened)

    gateFirebase
      .database()
      .ref(`NotificationSync/A_${associationid}/${visitorId}`)
      .set({
        buttonColor: '#75be6f',
        opened: true,
        newAttachment: false,
        visitorlogId: visitorId,
        updatedTime: this.state.currentTime
        // status:
      })
      .then(() => {
        //    if (item.opened) {
        //      this.props.onNotificationOpen(notifications, index, oyeURL);
        //    }
      });
  };

  declinegateVisitor = (visitorId, index, associationid) => {
    console.log(visitorId, 'visitorLogid');
    let oldNotif = [...this.props.notifications];
    oldNotif[index].opened = true;
    this.props.onGateApp(oldNotif);

    let timeFormat = moment.utc().format();
    let anotherString = timeFormat.replace(/Z/g, '');
    console.log(anotherString, 'another_string');

    gateFirebase
      .database()
      .ref(`NotificationSync/A_${associationid}/${visitorId}`)
      .set({
        buttonColor: '#ff0000',
        opened: false,
        newAttachment: true,
        visitorlogId: visitorId,
        updatedTime: this.state.currentTime
      });
  };

  // {item.ntType === 'Announcement' && (
  //   <Card>
  //     <Text style={{ fontSize: hp('2.5%'), color: '#000' }}>
  //       {moment(item.ntdCreated, 'YYYY-MM-DD').format('DD-MM-YYYY')}
  //       {'     '}
  //       {moment(item.ntdCreated).format('hh:mm A')}
  //     </Text>

  //     <ListItem
  //       onPress={() => this.onPress(item, index)}
  //       title={this.renderTitle(item.ntType, item)}
  //       subtitle={item.ntDesc}
  //       leftIcon={{
  //         name: this.renderIcons('name', item, index),
  //         type: this.renderIcons('type', item, index),
  //         color: '#ED8A19'
  //       }}
  //       rightIcon={{
  //         name: this.renderIcons('name', item, index),
  //         type: this.renderIcons('type', item, index),
  //         color: '#ED8A19'
  //       }}
  //       containerStyle={this.renderIcons('style', item, index)}
  //     />
  //   </Card>
  // )}
  renderItem = ({ item, index }) => {
    const { savedNoifId, notifications, oyeURL } = this.props;

    let status = _.includes(savedNoifId, item.ntid);

    if (item.ntType !== 'gate_app') {
      return (
        <Card>
          <Text style={{ fontSize: hp('2.5%'), color: '#000' }}>
            {moment(item.ntdCreated, 'YYYY-MM-DD').format('DD-MM-YYYY')}
            {'     '}
            {moment(item.ntdCreated).format('hh:mm A')}
          </Text>
          {item.ntType !== 'gate_app' ? (
            <ListItem
              onPress={() => this.onPress(item, index)}
              title={this.renderTitle(item.ntType, item)}
              subtitle={item.ntDesc}
              leftIcon={{
                name: this.renderIcons('name', item, index),
                type: this.renderIcons('type', item, index),
                color: '#ED8A19'
              }}
              containerStyle={this.renderIcons('style', item, index)}
            />
          ) : (
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'column' }}>
                <Text>{item.ntDesc}</Text>
                <Text> {item.ntdCreated}</Text>
              </View>
              <Collapsible
                duration={100}
                style={{ flex: 1 }}
                collapsed={item.open}
              >
                <View style={{ backgroundColor: '#ED8A19' }}></View>
              </Collapsible>
            </View>
          )}
        </Card>
      );
    } else {
      console.log(
        'Gate app Notifications98989898',
        item,
        this.state.gateDetails
      );
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            console.log(
              'Clicked on the gate app notification ######',
              item,
              index
            );
            if (item.ntIsActive) {
              this.props.onNotificationOpen(notifications, index, oyeURL);
            }
            this.props.toggleCollapsible(notifications, item.open, index);
          }}
        >
          <Card containerStyle={this.renderStyle(item.ntIsActive)}>
            {item.ntType !== 'gate_app' ? (
              <ListItem
                onPress={() => this.onPress(item, index)}
                title={this.renderTitle(item.ntType, item)}
                subtitle={item.ntDesc}
                leftIcon={{
                  name: this.renderIcons('name', item, index),
                  type: this.renderIcons('type', item, index),
                  color: '#ED8A19'
                }}
                containerStyle={this.renderIcons('style', item, index)}
              />
            ) : (
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'column' }}>
                  <Text
                    style={{
                      fontSize: hp('2.5%'),
                      color: '#000'
                    }}
                  >
                    {moment(item.ntdCreated, 'YYYY-MM-DD').format('DD-MM-YYYY')}
                    {'     '}
                    {moment(item.ntdCreated).format('hh:mm A')}
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <View>
                      <Text>{item.ntDesc}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    {item.open ? (
                      <TouchableOpacity
                        style={{
                          alignItems: 'flex-end',
                          justifyContent: 'flex-end',
                          flexDirection: 'row',
                          marginTop: hp('1%')
                        }}
                        // onPress={()=>console.log('Check it is opened or not', item)}
                        onPress={() => {
                          console.log(
                            'Clicked on the gate app notification ######',
                            item,
                            index
                          );
                          if (item.ntIsActive) {
                            this.props.onNotificationOpen(
                              notifications,
                              index,
                              oyeURL
                            );
                          }
                          this.props.toggleCollapsible(
                            notifications,
                            item.open,
                            index
                          );
                        }}
                      >
                        <Text
                          style={{
                            color: '#ff8c00',
                            marginRight: hp('0.6%')
                          }}
                        >
                          More
                        </Text>
                        <Icon
                          color="#ff8c00"
                          size={hp('2%')}
                          name="show_more"
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{
                          alignItems: 'flex-end',
                          justifyContent: 'flex-end',
                          flexDirection: 'row',
                          marginTop: hp('1%'),
                          marginBottom: hp('1%')
                        }}
                        onPress={() => {
                          console.log(
                            'Clicked on the gate app notification ######',
                            item,
                            index
                          );
                          if (item.ntIsActive) {
                            this.props.onNotificationOpen(
                              notifications,
                              index,
                              oyeURL
                            );
                          }
                          this.props.toggleCollapsible(
                            notifications,
                            item.open,
                            index
                          );
                        }}
                      >
                        <Text
                          style={{
                            color: '#ff8c00',
                            marginRight: hp('0.6%')
                          }}
                        >
                          Less
                        </Text>
                        <Icon
                          color="#ff8c00"
                          size={hp('2%')}
                          name="show_less"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <Collapsible
                  duration={100}
                  style={{ flex: 1 }}
                  collapsed={item.open}
                  align="center"
                >
                  {item.sbMemID === 0 ? (
                    <View>
                      <Text>No Data</Text>
                    </View>
                  ) : (
                    <View style={{ flexDirection: 'column' }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'space-between'
                        }}
                      >
                        <View>
                          {item.vlEntryImg == '' ? (
                            <Image
                              style={styles.img}
                              source={{
                                uri:
                                  'https://mediaupload.oyespace.com/' +
                                  base.utils.strings.noImageCapturedPlaceholder
                              }}
                            />
                          ) : (
                            <Image
                              style={styles.img}
                              source={{
                                uri:
                                  `${this.props.mediaupload}` + item.vlEntryImg
                              }}
                            />
                          )}
                        </View>
                        <View>
                          <Text
                            style={{
                              color: base.theme.colors.black,
                              fontSize: hp('1.7%'),
                              fontWeight: '500',
                              marginLeft: 10
                            }}
                            numberOfLines={1}
                            maxLength={15}
                          >
                            {item.vlGtName} Association
                          </Text>
                          <Text
                            style={{
                              color: base.theme.colors.black,
                              marginLeft: 10
                            }}
                            numberOfLines={1}
                          >
                            {item.vlfName}
                            {''}
                          </Text>
                          <Text
                            style={{
                              color: base.theme.colors.black,
                              marginLeft: 10
                            }}
                            numberOfLines={1}
                          >
                            {item.vlVisType}
                            {''}{' '}
                            <Text style={{ color: '#38bcdb' }}>
                              {item.vlComName}
                              {''}
                            </Text>
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              {
                                Platform.OS === 'android'
                                  ? Linking.openURL(`tel:${item.vlMobile}`)
                                  : Linking.openURL(`tel:${item.vlMobile}`);
                              }
                            }}
                          >
                            <View
                              style={{
                                flexDirection: 'row',
                                marginLeft: 10
                              }}
                            >
                              <Text
                                style={{
                                  color: base.theme.colors.primary,
                                  fontWeight: 'bold'
                                }}
                              >
                                {item.vlMobile}
                              </Text>
                              {/* <Icon
                                color="#ff8c00"
                                size={hp('2.2%')}
                                name="call"
                              /> */}
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'space-between'
                        }}
                      >
                        <Text
                          style={{
                            color: base.theme.colors.primary,
                            fontWeight: 'bold'
                          }}
                        >
                          Entry:{' '}
                          <Text
                            style={{
                              color: base.theme.colors.black,
                              fontWeight: 'normal',
                              marginLeft: 5
                            }}
                          >
                            {moment(item.vldCreated, 'YYYY-MM-DD').format(
                              'DD-MM-YYYY'
                            )}{' '}
                            {moment(item.vlEntryT).format('hh:mm A')}
                          </Text>
                        </Text>
                        {item.vlengName !== '' ? (
                          <Text
                            style={{
                              color: base.theme.colors.primary,
                              fontWeight: 'bold',
                              marginLeft: 25
                            }}
                          >
                            From:{' '}
                            <Text
                              style={{
                                color: base.theme.colors.black,
                                fontWeight: 'normal',
                                marginLeft: 5
                              }}
                            >
                              {item.vlengName}{' '}
                            </Text>
                          </Text>
                        ) : (
                          <View />
                        )}
                      </View>
                      {item.vlexgName !== '' ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'space-between'
                          }}
                        >
                          <Text
                            style={{
                              color: base.theme.colors.primary,
                              fontWeight: 'bold'
                            }}
                          >
                            Exit:{' '}
                            <Text
                              style={{
                                color: base.theme.colors.black,
                                fontWeight: 'normal',
                                marginLeft: 5
                              }}
                            >
                              {moment(item.vldUpdated, 'YYYY-MM-DD').format(
                                'DD-MM-YYYY'
                              )}{' '}
                              {moment(item.vlExitT).format('hh:mm A')}{' '}
                            </Text>
                          </Text>
                          <Text
                            style={{
                              color: base.theme.colors.primary,
                              fontWeight: 'bold',
                              marginLeft: 25
                            }}
                          >
                            From:{' '}
                            <Text
                              style={{
                                color: base.theme.colors.black,
                                fontWeight: 'normal',
                                marginLeft: 5
                              }}
                            >
                              {item.vlexgName}
                            </Text>
                          </Text>
                        </View>
                      ) : (
                        <View />
                      )}
                      {item.opened ? null : (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            marginTop: 15
                          }}
                        >
                          <Button
                            buttonStyle={{ borderColor: '#75be6f' }}
                            onPress={() =>
                              this.acceptgateVisitor(
                                item.sbMemID,
                                index,
                                item.asAssnID
                              )
                            }
                            title="Accept"
                            type="outline"
                            titleStyle={{
                              color: '#75be6f',
                              fontSize: 14
                            }}
                          />
                          <Button
                            onPress={() =>
                              this.declinegateVisitor(
                                item.sbMemID,
                                index,
                                item.asAssnID
                              )
                            }
                            buttonStyle={{ borderColor: '#ff0000' }}
                            title="Decline"
                            titleStyle={{
                              color: '#ff0000',
                              fontSize: 14
                            }}
                            type="outline"
                          />
                        </View>
                      )}
                    </View>
                  )}
                </Collapsible>
              </View>
            )}
          </Card>
        </TouchableWithoutFeedback>
      );
    }
  };

  renderComponent = () => {
    const {
      loading,
      isCreateLoading,
      notifications,
      refresh,
      refreshNotifications,
      oyeURL,
      MyAccountID,
      footerLoading,
      page
    } = this.props;
    // console.log(loading)
    console.log('Data in notification', notifications);

    if (loading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff'
          }}
        >
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <Fragment>
          <FlatList
            keyExtractor={this.keyExtractor}
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }}
            ListFooterComponentStyle={{
              flex: 1,
              justifyContent: 'flex-end'
            }}
            data={notifications}
            ListFooterComponent={() =>
              footerLoading ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 10
                  }}
                >
                  <ActivityIndicator />
                </View>
              ) : null
            }
            renderItem={this.renderItem}
            extraData={this.props.notifications}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              // console.log("End Reached");
              // alert("On end")
              // this.props.onEndReached(oyeURL, page, notifications, MyAccountID);
            }}
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={() => {
                  refreshNotifications(
                    oyeURL,
                    MyAccountID,
                    null,
                    notifications
                  );
                }}
                progressBackgroundColor="#fff"
                tintColor="#ED8A19"
                colors={['#ED8A19']}
              />
            }
          />
        </Fragment>
      );
    }
  };

  render() {
    const { navigation, notifications, oyeURL, MyAccountID } = this.props;
    // const refresh = navigation.getParam("refresh", "NO-ID");
    // console.log(this.state.gateDetails, "gateDetails");
    // console.log("rendered");
    return (
      <View style={styles.container}>
        <NavigationEvents />

        <SafeAreaView style={{ backgroundColor: '#ff8c00' }}>
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
                    source={require('../../../icons/back.png')}
                    style={styles.viewDetails2}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Image
                style={[styles.image1]}
                source={require('../../../icons/OyespaceSafe.png')}
              />
            </View>
            <View style={{ flex: 0.2 }}></View>
          </View>
          <View style={{ borderWidth: 1, borderColor: '#ff8c00' }} />
        </SafeAreaView>

        <View style={{ flex: 1 }}>{this.renderComponent()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  img: {
    width: hp('12%'),
    height: hp('12%'),
    borderColor: 'orange',
    borderRadius: hp('6%'),
    // marginTop: hp("3%"),
    borderWidth: hp('0.2%')
  },

  viewStyle1: {
    backgroundColor: '#fff',
    height: hp('7%'),
    width: Dimensions.get('screen').width,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative'
  },
  image1: {
    width: wp('34%'),
    height: hp('18%'),
    marginRight: hp('3%')
  },

  viewDetails1: {
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 3
  },
  viewDetails2: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: hp('3%'),
    height: hp('3%'),
    marginTop: 5
    // marginLeft: 10
  }
});

const mapStateToProps = state => {
  return {
    notifications: state.NotificationReducer.notifications,
    isCreateLoading: state.NotificationReducer.isCreateLoading,
    loading: state.NotificationReducer.loading,
    savedNoifId: state.AppReducer.savedNoifId,
    oyeURL: state.OyespaceReducer.oyeURL,
    mediaupload: state.OyespaceReducer.mediaupload,
    MyAccountID: state.UserReducer.MyAccountID,
    refresh: state.NotificationReducer.refresh,
    page: state.NotificationReducer.page,
    footerLoading: state.NotificationReducer.footerLoading,
    userReducer: state.UserReducer
  };
};

export default connect(
  mapStateToProps,
  {
    onNotificationOpen,
    storeOpenedNotif,
    getNotifications,
    refreshNotifications,
    toggleCollapsible,
    onEndReached,
    onGateApp
  }
)(NotificationScreen);
