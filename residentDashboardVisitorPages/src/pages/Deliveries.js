import React from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  FlatList,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
// import Header from "./src/components/common/Header"
import { Button, Card, CardItem, Form, Input, Item } from 'native-base';
import moment from 'moment';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import Collapsible from 'react-native-collapsible';
import base from '../../../src/base';

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import IcoMoonConfig from '../../../src/assets/selection.json';

import gateFirebase from 'firebase';
import backgroundHandler from "../../../src/components/backgroundHandler";

const Icon = createIconSetFromIcoMoon(IcoMoonConfig);

let dt = new Date();
dt.setDate(dt.getDate());
let _dt = dt;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      isLoading: true,

      //search bar
      loading: false,
      error: null,

      datetime: moment(new Date()).format('HH:mm:ss a'),

      //date picker
      dobText: moment(_dt).format('YYYY-MM-DD'), //year + '-' + month + '-' + date,
      dobDate: _dt,
      isDateTimePickerVisible: false,

      dobText1: moment(_dt).format('YYYY-MM-DD'),
      dobDate1: _dt,
      isDateTimePickerVisible1: false,

      switch: false,

      count: 1,

      open: false,

      buttonColor: ''
    };
    this.arrayholder = [];
  }

  componentDidMount() {
    let self = this;
    base.utils.validate.checkSubscription(
      this.props.assId
    );
    let newDataSource = [];
    this.state.dataSource.map(data => {
      newDataSource.push({ ...data, open: false });
    });
    setTimeout(() => {
      self.myVisitorsGetList();
      this.setState({
       // isLoading: false,
        dataSource: newDataSource
      });
      console.log("newDataSource ",newDataSource);
    }, 1000);
    // console.log("Association Id", this.props.dashBoardReducer.assId);
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

  //Date Picker 1
  onDOBPress = () => {
    let dobDate = this.state.dobDate;
    if (!dobDate || dobDate == null) {
      dobDate = new Date();
      this.setState({
        dobDate: dobDate
      });
    }
    this.refs.dobDialog.open({
      date: dobDate,
      maxDate: new Date() //To restirct past dates
    });
  };

  onDOBDatePicked = date => {
    console.log('Date Piceked !:', date);

    this.setState({
      dobDate: date,
      dobText: moment(date).format('YYYY-MM-DD')
    });
  };

  //Date Piker 2

  onDOBPress1 = () => {
    let dobDate = this.state.dobDate1;
    if (!dobDate || dobDate == null) {
      dobDate = new Date();
      this.setState({
        dobDate1: dobDate
      });
    }
    this.refs.dobDialog1.open({
      date: dobDate,
      maxDate: new Date() //To restirct past dates
    });
  };

  onDOBDatePicked1 = date => {
    console.log('Date Piceked !:', date);
    this.setState({
      dobDate1: date,
      dobText1: moment(date).format('YYYY-MM-DD')
    });
  };

  searchFilterFunction = text => {
    this.setState({
      value: text
    });

    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.vlfName.toUpperCase()} ${item.vlComName.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      dataSource: newData
    });
  };

  myVisitorsGetList = () => {
    this.setState({
      isLoading: true
    });
    console.log('Dates are -', this.state.dobDate, this.state.dobDate1);
    //moment(new Date()).format("YYYY-MM-DD")
    if (
      moment(this.state.dobDate).format('YYYY-MM-DD') >
      moment(this.state.dobDate1).format('YYYY-MM-DD')
    ) {
      this.setState({
        isLoading: false
      });
      Alert.alert('From date should be less than to date.');
      
      return false;
    } else {
      //http://apiuat.oyespace.com/oyesafe/api/v1/VisitorLog/GetVisitorLogByDatesAssocAndUnitID
      fetch(
        `http://${this.props.oyeURL}/oyesafe/api/v1/VisitorLog/GetVisitorLogByDatesAssocAndUnitID`,
        {
          method: 'POST',
          headers: {
            'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            StartDate: this.state.dobText,
            EndDate: this.state.dobText1,
            ASAssnID: this.props.dashBoardReducer.assId,
            UNUnitID: this.props.dashBoardReducer.uniID,
            ACAccntID: this.props.userReducer.MyAccountID
          })
        }
      )
        .then(response => response.json())
        .then(responseJson => {
          //var count = Object.keys(responseJson.data.visitorlogbydate).length;
          //console.log("fsbkfh", count);
          console.log(
            'Deliveries*******************************************',
            responseJson,
            this.state.dobText,
            this.state.dobText1,
            this.props.dashBoardReducer.assId,
            this.props.dashBoardReducer.uniID,
            this.props.userReducer.MyAccountID
          );
          if (responseJson.success) {
            this.setState({
              isLoading: false,
              dataSource:responseJson.data.visitorlog.filter(
                x => x.vlVisType === 'Delivery'
              ),
              error: responseJson.error || null,
              loading: false,
              dobDate: null,
              dobDate1: null
            });
            this.arrayholder = responseJson.data.visitorlog;
          } else {
            this.setState({
              isLoading: false,
              dataSource: [],
              loading: false,
              dobDate: null,
              dobDate1: null
            });
            //alert('No data for the selected combination of association and unit')
          }
        })

        .catch(error => {
          this.setState({ error, loading: false, isLoading: false, });
          console.log(error, '&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
        });
    }
  };

  toggleCollapsible = (index, value) => {
    let data = [...this.state.dataSource];

    data[index].open = !value;

    this.setState({ dataSource: data });
  };

  renderItem = ({ item, index }) => {
    console.log('Deliveries Items', item, this.props.mediaupload, index);
    // const time = item.vlEntryT;
    // const entertiming = time.subString();
    // console.log(entertiming);
    var color = null;
    let isButtonColorAvailable = false;
    gateFirebase
      .database()
      .ref(`NotificationSync/A_${item.asAssnID}/${item.vlVisLgID}`)
      .on('value', function(snapshot) {
        let val = snapshot.val();
        if (val !== null) {
          console.log(val, 'value_firebase');
          color = val.buttonColor;
          isButtonColorAvailable = color !== undefined && color !== null;
          console.log('COLOR', color, isButtonColorAvailable);
        }
      });

    return (
      <View
        style={{
          flexDirection: 'column',
          marginBottom: index === this.state.dataSource.length - 1 ? 80 : 0
        }}
      >
        <View style={{ borderColor: '#707070', borderWidth: wp('0.1%') }} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: hp('1.6%'),
                marginLeft: hp('1%'),
                marginTop: hp('1%')
              }}
            >
              Unit - {this.props.dashBoardReducer.selectedDropdown1}
            </Text>
          </View>
          <View style={{}}>
            <Text
              style={{
                color: '#ff8c00',
                fontSize: hp('1.6%'),
                marginRight: hp('1%'),
                marginTop: hp('1%')
              }}
            >
              {moment(item.vldCreated, 'YYYY-MM-DD').format('DD-MM-YYYY')}
            </Text>
          </View>
        </View>
        <View style={[styles.listItem]}>
          <View style={styles.iconContainer}>
            {item.vlEntryImg == '' ? (
              //   <Text style={styles.contactIcon}>
              //   {item.vlfName[0].toUpperCase()}
              // </Text>
              <Image
                style={styles.profilePicImageStyle}
                source={{
                  uri:
                    'https://mediaupload.oyespace.com/' +
                    base.utils.strings.noImageCapturedPlaceholder
                }}
              />
            ) : (
              <Image
                style={styles.profilePicImageStyle}
                source={{uri: 'data:image/png;base64,'+ item.vlEntryImg}}
                // source={{
                //   uri: `${this.props.mediaupload}` + item.vlEntryImg
                // }}
              />
            )}
          </View>
          <TouchableOpacity
            onPress={() => this.toggleCollapsible(index, item.open)}
          >
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                {item.vlfName} {item.vllName}
              </Text>
              {/* <View style={{ flexDirection: "column" }}>
                <Text style={styles.infoNumber}>{item.vlMobile}</Text>
              </View> */}
              <View style={{ flexDirection: 'row', marginBottom: hp('0.3%') }}>
                <View style={{ flexDirection: 'row' }}>
                  {/* user */}
                  <Icon color="#ff8c00" size={hp('2%')} name="user" />
                  <Text>{'  '}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: hp('1.5%') }}>{item.vlVisType}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: hp('0.3%') }}>
                <View style={{ flexDirection: 'row' }}>
                  {/* entry_time */}
                  <Icon color="#ff8c00" size={hp('2%')} name="entry_time" />
                  <Text>{'  '}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: hp('1.5%') }}>
                    Entry Time: {item.vlEntryT.substring(11, 16)}{' '}
                  </Text>
                </View>
                {moment(item.vlExitT).format('hh:mm') === '00:00' ? (
                  <View style={{ flexDirection: 'row' }}>
                    <View>
                      <Text style={{ fontSize: hp('1.5%') }}>
                        Exit Time: N.A.
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row' }}>
                    <View>
                      <Text style={{ fontSize: hp('1.5%') }}>
                        Exit Time: {item.vlExitT.substring(11, 16)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              <View style={{ flexDirection: 'row' }}>
                <View style={{ flexDirection: 'row' }}>
                  {/* location */}
                  <Icon color="#ff8c00" size={hp('2%')} name="location" />
                  <Text>{'  '}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: hp('1.5%') }}>
                    Entry Gate: {item.vlengName}{' '}
                  </Text>
                </View>
                {item.vlexgName === '' ? (
                  <View></View>
                ) : (
                  <View>
                    <Text style={{ fontSize: hp('1.5%') }}>
                      Exit Gate: {item.vlexgName}
                    </Text>
                  </View>
                )}
              </View>
              {/* <View>
              {item.open ?
                <View></View> :

                <View style={{ marginTop: hp('1%') }}>
                  <View style={{ borderBottomWidth: hp('0.1%'), borderBottomColor: '#474749', width: hp('5%'), justifyContent: 'center', alignSelf: 'center' }}>

                  </View>
                </View>
              }
              </View> */}
              {/* <View>
                <Text>{item.vlVisLgID}</Text>
              </View> */}
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 0 }}>

            <Card style={{ marginTop: 0 }}>
              <TouchableOpacity
                  style={{
                    justifyContent:'center',
                    alignItems:'center',
                  }}
                onPress={() => {
                  {
                    Platform.OS === 'android'
                      ? Linking.openURL(`tel:${item.vlMobile}`)
                      : Linking.openURL(`telprompt:${item.vlMobile}`);
                  }
                }}
              >
                <CardItem bordered>
                  <Icon color="#ff8c00" style={styles.image0} name="call" />
                </CardItem>

              </TouchableOpacity>
            </Card>

          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'center'
          }}
        >
          <TouchableOpacity
            onPress={() => this.toggleCollapsible(index, item.open)}
          >
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: hp('1%')
              }}
            >
              {item.open ? (
                <View />
              ) : (
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: '#ff8c00', marginRight: hp('1%') }}>
                    More
                  </Text>
                  <Icon color="#ff8c00" size={hp('1.8%')} name="show_more" />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <Collapsible duration={100} collapsed={!item.open}>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row', marginBottom: hp('0.5%') }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  flex: 1
                }}
              >
                <Text style={{ fontSize: hp('1.6%'), marginLeft: hp('1%') }}>
                  Delivery from:{' '}
                  <Text style={{ color: '#38bcdb' }}>{item.vlComName}</Text>
                </Text>
              </View>
              {item.vlExitT === '0001-01-01T00:00:00' &&
              isButtonColorAvailable &&
              color == '#75be6f' ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: hp('1%')
                  }}
                >
                  <Button
                    bordered
                    warning
                    style={styles.button2}
                    onPress={() =>
                      this.props.navigation.navigate('SendingMsgToGate', {
                        image: item.vlEntryImg,
                        fname: item.vlfName,
                        lname: item.vllName,
                        id: item.vlVisLgID,
                        associationId: item.asAssnID
                      })
                    }
                  >
                    <Text
                      style={{
                        fontSize: hp('1.6%')
                      }}
                    >
                      Leave with Vendor
                    </Text>
                  </Button>
                </View>
              ) : (
                <View />
              )}
            </View>
            {/* <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: hp('1.6%'), marginLeft: hp('1%'), marginBottom: hp('0.5%') }}>Entry approved by: {item.vlpOfVis}</Text>
                <Image />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: hp('1.6%'), marginLeft: hp('1%'), marginBottom: hp('0.5%') }}>Total Guests: {item.vlVisCnt}</Text>
                <Image />
              </View> */}

            {/* {!item.open ?
                <View></View> :

                <View style={{ marginBottom: hp('1%'), marginTop: hp('1%') }}>
                  <View style={{ borderBottomWidth: hp('0.1%'), borderBottomColor: '#474749', width: hp('5%'), justifyContent: 'center', alignSelf: 'center', marginLeft: hp('3%') }}>

                  </View>
                </View>
              } */}
            <TouchableOpacity
              onPress={() => this.toggleCollapsible(index, item.open)}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: hp('1%')
                }}
              >
                {!item.open ? (
                  <View></View>
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Text style={{ color: '#ff8c00', marginRight: hp('1%') }}>
                      Less
                    </Text>
                    <Icon color="#ff8c00" size={hp('1.8%')} name="show_less" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </Collapsible>

        <View
          style={{ borderColor: '#707070', borderBottomWidth: hp('0.1%') }}
        />
      </View>
    );
  };

  render() {
    console.log('View All Visitor', this.props.dashBoardReducer.assId);
    console.log('*******************************',this.state.dataSource);
    console.log('123123123#####', this.props);
    return (
      <View style={{ flex: 1, marginTop: hp('1%') }}>
        {/* <Text style={styles.titleOfScreen}> Visitors </Text> */}

        {/* <TextInput
            //source={require("./src/components/images/call.png")}
            style={styles.textinput}
            placeholder="Search by Name...."
            // lightTheme
            round
            onChangeText={this.searchFilterFunction}
          /> */}

        <Form>
          <Item style={styles.inputItem}>
            <Input
              marginBottom={hp('-1%')}
              placeholder="Search...."
              multiline={false}
              onChangeText={this.searchFilterFunction}
            />
            <Icon
              color="#ff8c00"
              size={hp('2.6%')}
              style={{ marginRight: hp('1.2%') }}
              name="search"
            />
          </Item>
        </Form>

        <View style={styles.datePickerButtonView}>
          <View
            style={{
              flex: 0.8,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginLeft: hp('-1%')
            }}
          >
            <View>
              <Text>From</Text>
            </View>
            {/* <View style={{ borderColor: "black", borderWidth: hp("0.05%") }}> */}
            <TouchableOpacity onPress={this.onDOBPress.bind(this)}>
              <View style={styles.datePickerBox}>
                <Text style={styles.datePickerText}>
                  {moment(this.state.dobText).format('YYYY-MM-DD')}{' '}
                </Text>
                <DatePickerDialog
                  ref="dobDialog"
                  onDatePicked={this.onDOBDatePicked.bind(this)}
                />

                <TouchableOpacity onPress={this.onDOBPress.bind(this)}>
                  <Icon
                    color="#ff8c00"
                    size={hp('2%')}
                    style={{ marginRight: hp('0.5') }}
                    name="cal"
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* </View> */}
            <View>
              <Text> To </Text>
            </View>
            {/* <View style={{ borderColor: "black", borderWidth: hp("0.05%") }}> */}
            <TouchableOpacity onPress={this.onDOBPress1.bind(this)}>
              <View style={styles.datePickerBox}>
                <Text style={styles.datePickerText}>
                  {moment(this.state.dobText1).format('YYYY-MM-DD')}
                </Text>
                <DatePickerDialog
                  ref="dobDialog1"
                  onDatePicked={this.onDOBDatePicked1.bind(this)}
                />
                <TouchableOpacity onPress={this.onDOBPress1.bind(this)}>
                  <Icon
                    color="#ff8c00"
                    size={hp('2%')}
                    style={{ marginRight: hp('0.5') }}
                    name="cal"
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* </View> */}
          </View>

          <View
            style={{
              flex: 0.2,

              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              marginRight: hp('-1.5%')
            }}
          >
            <Button
              bordered
              warning
              style={[styles.buttonUpdateStyle, { justifyContent: 'center' }]}
              onPress={() => this.myVisitorsGetList()}
            >
              <Text
                style={{
                  color: 'white',
                  fontWeight: '600',
                  fontSize: hp('2%')
                }}
              >
                Get
              </Text>
            </Button>
          </View>
        </View>
        {this.state.isLoading ? (
          <View style={styles.container}>
            <View style={styles.progress}>
              <ActivityIndicator size="large" color="#ff8c00" />
            </View>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={
              this.state.dataSource.length === 0 && styles.centerEmptySet
            }
            style={{ marginTop: hp('2%') }}
            data={this.state.dataSource.sort((a, b) =>
              b.vldCreated.localeCompare(a.vldCreated)
            )}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.vlVisLgID.toString()}
            ListEmptyComponent={
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* delivery-man */}
                <Icon
                  size={hp('10%')}
                  style={{ margin: hp('1%') }}
                  name="delivery-man"
                />
                <Text
                  style={{
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: hp('1.6%')
                  }}
                >
                  No entries for selected date
                </Text>
              </View>
            }
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  progress: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  textinput: {
    height: hp('6%'),
    borderWidth: hp('0.1%'),
    borderColor: '#fff',
    marginHorizontal: hp('1%'),
    paddingLeft: hp('2%'),
    marginTop: hp('0.5%'),
    fontSize: hp('2.2%'),
    backgroundColor: '#f4f4f4',
    borderRadius: hp('4%')
  },
  iconContainer: {
    width: hp('10%'),
    height: hp('10%'),
    // alignItems: "center",
    // justifyContent: "center",
    // borderColor: base.theme.colors.primary,
    borderRadius: 100
  },
  profilePicImageStyle: {
    width: hp('8%'),
    height: hp('8%'),
    borderColor: base.theme.colors.primary,
    borderRadius: hp('4%'),
    marginTop: hp('2%'),
    borderWidth: hp('0.1%')
  },
  datePickerButtonView: {
    marginTop: hp('1.5%'),
    flexDirection: 'row',
    //justifyContent: 'flex-end',
    justifyContent: 'space-around',
    marginHorizontal: hp('2%')
  },
  datePickerBox: {
    margin: hp('1.0%'),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: hp('0.2%'),
    height: hp('4%'),
    borderColor: '#bfbfbf',
    padding: 0
  },
  datePickerText: {
    fontSize: hp('1.5%'),
    marginLeft: 5,
    marginRight: 5,
    color: '#474749'
  },
  centerEmptySet: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  viewDatePickerImageStyle: {
    width: wp('3%'),
    height: hp('2.2%'),
    marginRight: hp('0.5%')
  },
  buttonUpdateStyle: {
    width: wp('16%'),
    borderRadius: hp('3%'),
    borderWidth: wp('2%'),
    height: hp('5%'),
    marginRight: hp('1%'),
    backgroundColor: '#B51414',
    borderColor: '#B51414'
  },
  listItem: {
    flexDirection: 'row',
    paddingLeft: hp('1.6%'),
    paddingRight: hp('1.6%'),
    paddingBottom: hp('2%'),
    paddingTop: hp('1%')
  },

  contactIcon: {
    width: hp('12%'),
    height: hp('12%'),
    fontSize: hp('3.5%'),
    color: '#fff'
  },
  infoContainer: {
    flexDirection: 'column',
    paddingLeft: hp('1.6%')
  },
  infoText: {
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: hp('0.5%')
  },
  infoNumber: {
    fontSize: hp('1.6%'),
    fontWeight: '100',
    color: 'grey',
    marginBottom: hp('0.5%')
  },

  titleOfScreen: {
    marginTop: hp('1.5%'),
    textAlign: 'center',
    fontSize: hp('2.4%'),
    fontWeight: 'bold',
    marginBottom: hp('1.5%'),
    color: base.theme.colors.primary
  },

  floatButton: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0)',
    alignItems: 'center',
    justifyContent: 'center',
    width: hp('8%'),
    position: 'absolute',
    bottom: hp('2.5%'),
    right: hp('2.5%'),
    height: hp('8%'),
    backgroundColor: base.theme.colors.primary,
    borderRadius: 100,
    // shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 3,
    shadowOpacity: 0.6
  },
  image0:{
    width: hp('2%'),
    height: hp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  images: {
    width: hp('1.6%'),
    height: hp('1.6%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputItem: {
    marginTop: wp('1%'),
    marginLeft: wp('4%'),
    marginRight: wp('4%'),
    //borderColor: "#909091"
    borderColor: '#000000'
  },
  formSearch: {
    marginBottom: hp('1%')
  },
  icon: {
    color: base.theme.colors.primary
  },
  button2: {
    width: hp('15%'),
    justifyContent: 'center',
    borderRadius: hp('10%'),
    borderWidth: hp('0.2%'),
    borderColor: base.theme.colors.primary
  }
});

const mapStateToProps = state => {
  return {
    dashBoardReducer: state.DashboardReducer,
    oyeURL: state.OyespaceReducer.oyeURL,
    mediaupload: state.OyespaceReducer.mediaupload,
    noImage: state.OyespaceReducer.noImage,
    userReducer: state.UserReducer,
    assId:state.DashboardReducer.assId ,
    uniID: state.DashboardReducer.uniID,
  };
};

export default connect(mapStateToProps)(App);
