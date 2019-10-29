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
import { Dropdown } from 'react-native-material-dropdown';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import Collapsible from 'react-native-collapsible';
import base from '../../base';

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import IcoMoonConfig from '../../assets/selection.json';

const Icon = createIconSetFromIcoMoon(IcoMoonConfig);

const data = [{ id: 1, value: 'Paid' }, { id: 2, value: 'UnPaid' }];

class ProfitAndLoss extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      dataSource: [],
      dataSource1: [],
      dataSource2: [],
      paid: 0
    };
  }

  componentDidMount() {
    let self = this;

    setTimeout(() => {
      self.myVisitorsGetList();
      this.setState({
        isLoading: false
      });
    }, 1000);
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

  myVisitorsGetList = () => {
    this.setState({
      isLoading: true
    });
    fetch(
      `https://${this.props.oyeURL}/oyeliving/api/v1/GetPaymentsListByAssocID/${this.props.dashBoardReducer.assId}`,
      {
        method: 'GET',
        headers: {
          'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
          'Content-Type': 'application/json'
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        //var count = Object.keys(responseJson.data.visitorlogbydate).length;
        console.log('Reports_Data', responseJson);
        this.setState({
          isLoading: false,
          dataSource: responseJson.data.payments,

          dataSource1: responseJson.data.payments.filter(
            x => x.pyStat === 'Paid'
          ),

          dataSource2: responseJson.data.payments.filter(
            x => x.pyStat === 'UnPaid'
          )
        });
        console.log('PAYMENTS', this.state.dataSource);
      })

      .catch(error => {
        this.setState({ isLoading: false });
        console.log(error, '&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
      });
  };

  renderItem = ({ item, index }) => {
    console.log('Deliveries Items', item, this.props.mediaupload, index);
    // const time = item.vlEntryT;
    // const entertiming = time.subString();
    // console.log(entertiming);
    return (
      <View
        style={{
          flexDirection: 'column',
          marginBottom: index === this.state.dataSource.length - 1 ? 80 : 0
        }}
      >
        <View style={{ borderColor: '#707070', borderWidth: wp('0.1%') }} />
        <View style={{ flex: 1 }}>
          {/* <View style={{flexDirection:'row'}}>
            <Text>Payment Id: -</Text>
            <Text>{item.pyid}</Text>
          </View> */}
          <View style={{ flexDirection: 'row' }}>
            <Text>IN Number: -</Text>
            <Text>{item.inNumber}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>Payment Status: -</Text>
            <Text>{item.pyStat}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>Payment Description: -</Text>
            <Text>{item.pyDesc}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>Payment Amount Due: -</Text>
            <Text>{item.pyAmtDue}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>Payment Tax: -</Text>
            <Text>{item.pyTax}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>Payment Balanace: -</Text>
            <Text>{item.pyBal}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>Payment Created: -</Text>
            <Text>{item.pydCreated}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>Unit Name: -</Text>
            <Text>{item.unUniName}</Text>
          </View>
        </View>
        <View style={{ borderColor: '#707070', borderWidth: wp('0.1%') }} />
      </View>
    );
  };

  changePayment(value, index) {
    console.log('New Details', value, index);
    if (value === 'Paid') {
      this.setState({
        paid: 1
      });
    } else if (value === 'UnPaid') {
      this.setState({
        paid: 2
      });
    } else {
      this.setState({
        paid: 0
      });
    }
  }

  render() {
    return (
      <View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Dropdown
            // value={'Select Visitor' || ''}
            data={data}
            textColor={base.theme.colors.black}
            inputContainerStyle={{}}
            baseColor={base.theme.colors.black}
            placeholder="Select Payment Status"
            placeholderTextColor={base.theme.colors.black}
            placeholderStyle={{ fontWeight: 'bold' }}
            labelHeight={hp('4%')}
            containerStyle={{
              width: wp('85%'),
              height: hp('8%')
            }}
            rippleOpacity={0}
            dropdownPosition={0}
            dropdownOffset={{ top: hp('10%'), left: 0 }}
            style={{ fontSize: hp('2.2%') }}
            onChangeText={(value, index) => this.changePayment(value, index)}
            // ref={c => {
            //   dropdownValue = c;
            // }}
          />
        </View>
        {this.state.paid === 1 ? (
          <FlatList
            contentContainerStyle={
              this.state.dataSource1.length === 0
              //&& styles.centerEmptySet
            }
            style={{ marginTop: hp('2%') }}
            data={this.state.dataSource1.sort((a, b) =>
              b.unUniName.localeCompare(a.unUniName)
            )}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.unUniName.toString()}
            ListEmptyComponent={
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
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
        ) : (
          <View>
            {this.state.paid === 2 ? (
              <FlatList
                contentContainerStyle={
                  this.state.dataSource2.length === 0
                  //&& styles.centerEmptySet
                }
                style={{ marginTop: hp('2%') }}
                data={this.state.dataSource2.sort((a, b) =>
                  b.unUniName.localeCompare(a.unUniName)
                )}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => item.unUniName.toString()}
                ListEmptyComponent={
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
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
            ) : (
              <FlatList
                contentContainerStyle={
                  this.state.dataSource.length === 0
                  //&& styles.centerEmptySet
                }
                style={{ marginTop: hp('2%') }}
                data={this.state.dataSource.sort((a, b) =>
                  b.unUniName.localeCompare(a.unUniName)
                )}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => item.unUniName.toString()}
                ListEmptyComponent={
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
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
        )}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    dashBoardReducer: state.DashboardReducer,
    oyeURL: state.OyespaceReducer.oyeURL,
    mediaupload: state.OyespaceReducer.mediaupload,
    noImage: state.OyespaceReducer.noImage,
    userReducer: state.UserReducer
  };
};

export default connect(mapStateToProps)(ProfitAndLoss);
