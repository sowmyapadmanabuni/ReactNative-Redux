import React from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard, Platform
} from 'react-native';
import { Button, Form, Input, Item } from 'native-base';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
class WholeAssociationList extends React.Component {
  static navigationOptions = {
    title: 'WholeAssociationList',
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      filteredDataSource: [],
      emptyError: [],
      city: '',
      filteredArr: [],
      query: '',
      loading: false,
      error: null,
      searchText: '',
      searchBarFocused: false
    };
    this.arrayholder = [];
  }

  componentDidMount() {
    // this.myJoinAssociationListGetData();
    // console.log("City Name:", this.props.navigation.state.params.id)
    setTimeout(() => {
      this.setState(
        {
          isLoading: false
          // city: this.props.navigation.state.params.id
        },
        () => this.myJoinAssociationListGetData()
      );
    }, 1000);
    this.keyboardDidShow = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardWillShow = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHide = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    this.keyboardDidHide = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide
    );


    /*this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack(null); // works best when the goBack is async
      return true;
    });*/
  }

  keyboardDidShow = () => {
    this.setState({ searchBarFocused: true });
  };

  keyboardWillShow = () => {
    this.setState({ searchBarFocused: true });
  };

  keyboardWillHide = () => {
    this.setState({ searchBarFocused: false });
  };
  keyboardDidHide = () => {
    this.setState({ searchBarFocused: false });
  };
  componentWillUnmount() {
    console.log("Part>>>>>>>")
    /*BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack(null)
    });
    this.backHandler.remove();*/
  }


  // searchFilterFunction = text => {
  //   const newData = this.arrayholder.filter(item => {
  //     const itemData = `${item.asCountry.toUpperCase()} ${item.asAsnName.toUpperCase()} ${item.asPinCode.toUpperCase()}`;
  //     const textData = text.toUpperCase();

  //     return itemData.indexOf(textData) > -1;
  //   });
  //   this.setState({
  //     searchText: text,
  //     // dataSource: newData
  //   });
  // };

  searchFilterFunction = text => {
    const newData = this.state.dataSource.filter(item => {
      const itemData = `${item.asAsnName.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    console.log('Text', text);
    if (text.length === 0) {
      this.setState({
        filteredDataSource: [],
        searchText: ''
      });
    } else {
      this.setState({
        searchText: text,
        filteredDataSource: newData
      });
    }
    // let filteredArray = [];
    // console.log("Text", text)
    // let newData = this.state.filteredArr
    // console.log("kjsnak", newData)
    // if (text.length === 0) {
    //   this.setState({
    //     filteredDataSource: []
    //   })
    // } else {
    //   for (let i in newData) {
    //     if (text.toUpperCase().includes(newData[i].asAsnName.toUpperCase())) {
    //       console.log("New Data", newData[i])
    //       filteredArray.push(newData[i])
    //     }
    //   }
    // }
  };

  // setTextFuntion(text){
  //   let text  = text.toUpperCase();
  //   let data = this.state.dataSource;
  //   let filteredArray = [];

  //   for(let i in data){
  //       if(data[i].asAsnName.toUpperCase().includes(text)){
  //           filteredArray.push(data[i])
  //       }
  //   }
  //   this.setState({
  //       filteredDataSource:filteredArray
  //   })

  //   }

  myJoinAssociationListGetData = () => {
    // console.log("________")
    this.setState({ loading: true });

    fetch(
      `http://${this.props.oyeURL}/oyeliving/api/v1/association/getassociationlist`,
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
        let arr = [];
        let self = this;
        // for (let i in responseJson.data.associations) {
        //   // console.log("i is:", i)
        //   if (self.state.city === responseJson.data.associations[i].asPinCode.substring(0, 2)) {
        //     console.log("City Wise Associations", responseJson.data.associations[i])
        //     console.log("Pin Code", responseJson.data.associations[i].asPinCode.substring(0, 2))
        //     arr.push(responseJson.data.associations[i])
        //   }
        // }
        this.setState({
          isLoading: false,
          dataSource: responseJson.data.associations,
          // filteredArr: arr,
          error: responseJson.error || null,
          loading: false
        });
        this.arrayholder = responseJson.data.associations;
      })
      .catch(error => {
        this.setState({ error, loading: false });
        console.log(error, '77777777777777777777777777777');
      });
  };
  renderItem = ({ item }) => {
    console.log('RENDER_ITEM', item);
    return (
      <View style={styles.tableView}>
        <View style={styles.cellView}>
          <View style={styles.cellDataInColumn}>
            <View style={styles.blockNameFlexStyle}>
              <View
                style={{
                  flex: 5,
                  flexDirection: 'row',
                  alignContent: 'flex-start'
                }}
              >
                <Image
                  style={styles.memberDetailIconImageStyle}
                  source={require('../icons/building.png')}
                />
                <Text style={styles.blockNameTextStyle}>{item.asAsnName}</Text>
              </View>
              <View
                style={{
                  flex: 5,
                  alignContent: 'flex-end'
                }}
              >
                {/* <TouchableOpacity
                      onPress={() => {
                        // console.log(item)
                        console.log(item, "kjhgfhiljkhgfdsghjkhgfg");
    
                        this.props.navigation.navigate("EditAssociation", {
                          associationDetails: item,
                          associationDetails1: item.asCountry
                        });
                      }}
                    >
                      <Image
                        style={styles.pencilBtnStyle}
                        source={require("../icons/pencil120.png")}
                      />
                    </TouchableOpacity> */}
              </View>
            </View>
            <View style={styles.blockTypeFlexStyle}>
              <Text style={styles.blockTypeTextStyle}>
                {item.asAddress}, {item.asCity}
              </Text>
            </View>
            <View style={styles.blockTypeFlexStyle}>
              <Text style={styles.blockTypeTextStyle}>
                Country: {item.asCountry}
              </Text>
            </View>
            <View style={styles.blockTypeFlexStyle}>
              <View
                style={{
                  flex: 5,
                  //alignItems: "flex-start",
                  flexDirection: 'row',
                  alignContent: 'flex-start'
                }}
              >
                <Text style={styles.blockTypeTextStyle}>
                  Pincode: {item.asPinCode}
                </Text>
              </View>
              <View
                style={{
                  marginRight: hp('10%'),
                  flex: 5,
                  alignContent: 'flex-end'
                }}
              >
                <Button
                  bordered
                  dark
                  style={styles.addUnitButton}
                  onPress={() => {
                    this.props.navigation.navigate('Unit', {
                      id: item.asAssnID,
                      associationName: item.asAsnName
                    });
                    this.setState({
                      dataSource: [],
                      arrayholder: [],
                      filteredDataSource: [],
                      filteredArr: [],
                      searchText: ''
                    });
                  }}
                >
                  <Text style={styles.addUnitText}>Join</Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.lineAboveAndBelowFlatList} />
      </View>
    );
  };

  render() {
    const { navigate } = this.props.navigation;
    // console.log("I is......", this.props.navigation.state.params.name)
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
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
                      source={require('../icons/back.png')}
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
                  source={require('../icons/OyespaceSafe.png')}
                />
              </View>
              <View style={{ flex: 0.2 }}>
                {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
              </View>
            </View>
            <View style={{ borderWidth: 1, borderColor: '#EBECED' }} />
          </SafeAreaView>

          <Text style={styles.titleOfScreenStyle}>Join Association</Text>

          <View style={styles.progressViewStyle}>
            <ActivityIndicator size="large" color="#B51414" />
          </View>
        </View>
      );
    }
    return (
      <View style={styles.mainView}>
        {/* <Header /> */}
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
                    source={require('../icons/back.png')}
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
                source={require('../icons/OyespaceSafe.png')}
              />
            </View>
            <View style={{ flex: 0.2 }}>
              {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
            </View>
          </View>
          <View style={{ borderWidth: 1, borderColor: '#EBECED' }} />
        </SafeAreaView>

        <NavigationEvents
          onDidFocus={payload => this.myJoinAssociationListGetData()}
          onWillBlur={payload => this.myJoinAssociationListGetData()}
        />

        <View style={styles.containerViewStyle}>
          <Text style={styles.titleOfScreenStyle}>Join Association</Text>

          {/* <Form style={styles.formSearch}>
                        <Item style={styles.inputItem}>
                            <Input
                                value={this.state.searchText}
                                marginBottom={hp('-1%')}
                                placeholder="Search your association...."
                                multiline={false}
                                onChangeText={this.searchFilterFunction}
                            />

                            <Icon style={styles.icon} name="search" size={14}/>
                        </Item>
                    </Form> */}

          <Animatable.View
            style={{ ...styles.formSearch }}
            animation="slideInRight"
            duration={500}
          >
            <Item
              style={{
                ...styles.inputItem
              }}
            >
              <Animatable.View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: hp('5%'),
                  width: hp('4%'),
                  alignSelf: 'center'
                }}
                animation={
                  this.state.searchBarFocused ? 'fadeInLeft' : 'fadeInRight'
                }
                duration={400}
              >
                <Icon
                  style={styles.icon}
                  name={
                    this.state.searchBarFocused ? 'md-arrow-back' : 'ios-search'
                  }
                  size={30}
                />
              </Animatable.View>
              <Input
                style={{ marginLeft: hp('1%') }}
                value={this.state.searchText}
                marginBottom={hp('-1%')}
                placeholder="Search your association...."
                multiline={false}
                onChangeText={this.searchFilterFunction}
              />
            </Item>
          </Animatable.View>

          <View style={styles.lineAboveAndBelowFlatList} />

          {this.state.filteredDataSource.length === 0 ? (
            <FlatList
              style={{
                backgroundColor: this.state.searchBarFocused
                  ? '#F5F5F5'
                  : 'white'
              }}
              data={this.state.emptyError}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => item.asAssnID.toString()}
            />
          ) : (
            <FlatList
              // data={this.state.dataSource.sort((a, b) =>
              //   a.asAsnName.localeCompare(b.asAsnName)
              // )}
              style={{
                backgroundColor: this.state.searchBarFocused
                  ? '#F5F5F5'
                  : 'white'
              }}
              data={this.state.filteredDataSource}
              renderItem={this.renderItem}
              extraData={this.state}
              keyExtractor={(item, index) => item.asAssnID.toString()}
            />
          )}
          {/* <FlatList
            // data={this.state.dataSource.sort((a, b) =>
            //   a.asAsnName.localeCompare(b.asAsnName)
            // )}
            data={this.state.filteredDataSource}
            renderItem={this.renderItem}
            extraData={this.state}
            keyExtractor={(item, index) => item.asAssnID.toString()}
          /> */}

          {/* <TouchableOpacity
            style={[styles.floatButton]}
            //onPress={() => this.props.navigation.navigate("CreateAssociation")}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                aspectRatio: 1,
                paddingBottom: hp("0.8%")
                // backgroundColor: "red"
              }}
            >
              <Text
                style={{ fontSize: hp("5%"), color: "#fff", fontWeight: "700" }}
              >
                +
              </Text>
            </View>
          </TouchableOpacity> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column'
  },
  emptyViewStyle: {
    width: hp('15%')
  },
  editButtonViewStyle: {
    // backgroundColor: "yellow",
    marginRight: hp('3%'),
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignSelf: 'center'
  },
  viewForNoOfUnitsText: {
    justifyContent: 'flex-start',
    alignSelf: 'center'
    //flexDirection: "row"
  },
  progressViewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  formSearch: {
    marginBottom: hp('1%')
  },
  icon: {
    color: '#ff8c00'
  },
  inputItem: {
    marginTop: wp('1%'),
    marginLeft: wp('4%'),
    marginRight: wp('4%'),
    //borderColor: "#909091"
    borderColor: '#000000'
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
    // width: wp('34%'),
    // height: hp('18%'),
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
    // width: hp('3%'),
    // height: hp('3%'),
    marginTop: 5
    // marginLeft: 10
  },

  mainView: {
    flex: 1
  },
  containerViewStyle: {
    height: hp('87%'),
    width: wp('100%')
  },

  titleOfScreenStyle: {
    marginTop: hp('2%'),
    marginBottom: hp('2.5%'),
    textAlign: 'center',
    fontSize: hp('2.3%'),
    fontWeight: '500',
    color: '#FF8C00'
  },

  lineAboveAndBelowFlatList: {
    backgroundColor: 'lightgray',
    height: hp('0.1%')
  },
  floatButton: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0)',
    //alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: hp('8%'),
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: hp('8%'),
    backgroundColor: '#FF8C00',
    borderRadius: hp('5%'),
    // shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 3,
    shadowOpacity: 0.6
  },
  plusTextStyle: {
    flex: 1,
    fontSize: hp('5%'),
    color: '#fff',
    fontWeight: '700',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    // textAlign: "center",
    textAlignVertical: 'center'
  },
  tableView: {
    flexDirection: 'column'
  },
  cellView: {
    flexDirection: 'row',
    marginLeft: wp('3%'),
    marginRight: wp('1%'),
    marginVertical: hp('1%')
    // justifyContent: "flex-start"
  },

  cellDataInColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start'

    //justifyContent: "flex-start"
  },

  blockTypeFlexStyle: {
    flexDirection: 'row',
    flex: 1,
    width: hp('80%'),
    // alignItems: "center",
    // justifyContent: "flex-start",
    // alignSelf: "flex-start",
    marginVertical: hp('0.6%')
  },
  blockNameFlexStyle: {
    flexDirection: 'row',
    flex: 1,
    // alignItems: "center",
    width: hp('80%'),
    // justifyContent: "flex-start",
    // alignSelf: "flex-start",
    marginVertical: hp('0.5%')
  },
  noOfUnitsFlex: {
    flex: 1,

    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width

    // alignSelf: "flex-start",
    // marginVertical: hp("0.4%")
  },
  memberDetailIconImageStyle: {
    width: wp('5%'),
    height: wp('5%')
  },
  blockNameTextStyle: {
    fontSize: hp('2%'),
    // color: "#909091",
    marginLeft: hp('1%'),
    fontWeight: '500'
  },
  blockTypeTextStyle: {
    fontSize: hp('2%'),
    color: '#909091',
    marginLeft: hp('3.5%'),
    fontWeight: '500'
  },
  numberOfUnitsTextStyle: {
    fontSize: hp('1.8%'),
    color: '#909091',
    marginLeft: hp('3.5%'),

    fontWeight: '500'
  },

  pencilBtnStyle: {
    height: wp('6%'),
    width: wp('6%')
  },
  addUnitButton: {
    width: wp('20%'),
    height: hp('3.6%'),
    borderRadius: hp('2%'),
    //borderWidth: hp("0.2%"),
    borderColor: '#ff8c00',
    backgroundColor: '#ff8c00',
    justifyContent: 'center'
  },
  addUnitText: {
    color: 'white',
    fontWeight: '700',
    fontSize: hp('1.6%')
  },
  searchTextStyle: {
    height: hp('5.5%'),
    borderWidth: hp('0.2%'),
    borderRadius: hp('3%'),
    borderColor: '#f4f4f4',
    marginHorizontal: hp('1%'),
    marginBottom: hp('2%'),
    paddingLeft: hp('3%'),
    fontSize: hp('1.8%'),
    backgroundColor: '#f4f4f4'
  }
});

const mapStateToProps = state => {
  return {
    champBaseURL: state.OyespaceReducer.champBaseURL,
    SelectedAssociationID: state.DashboardReducer.assId,
    MyAccountID: state.UserReducer.MyAccountID,
    oyeURL: state.OyespaceReducer.oyeURL
    };
};

export default connect(mapStateToProps)(WholeAssociationList);
