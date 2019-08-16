import React, { Component } from "react";
import {
  Platform,
  AppRegistry,
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  TextInput,
  Keyboard,
  Alert,
  ActivityIndicator
} from "react-native";
// import Header from "./src/components/common/Header";
import { NavigationEvents } from "react-navigation";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { connect } from "react-redux";
import { Card, CardItem, Form, Item, Input, Icon } from "native-base"

class MyGuests extends Component {
  static navigationOptions = {
    title: "My Guests",
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      ImageSource: null,

      loading: false,
      error: null
    };
    this.arrayholder = [];
  }
  componentDidMount() {
    this.getInvitationList();
    setTimeout(() => {
      this.setState({
        isLoading: false
      });
    }, 2500);
  }

  getInvitationList = () => {
    //      //http://localhost:64284/oye247/api/v1/GetInvitationListByAssocIDAndIsQRCodeGenerated

    console.log("Visitighfghfghfg@@@@@@@@@", this.props.dashBoardReducer.assId,this.props.dashBoardReducer.uniID,this.props.userReducer.MyAccountID);
    fetch(
      `http://${this.props.oyeURL}/oye247/api/v1/GetInvitationListByAssocIDAndIsQRCodeGenerated`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
        },
        body: JSON.stringify({
          ASAssnID : this.props.dashBoardReducer.assId,
          INInvVis : "Visited",
          UNUnitID : this.props.dashBoardReducer.uniID,
          ACAccntID: this.props.userReducer.MyAccountID
        })
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log("Visitighfghfghfg@@@@@@@@@", responseJson,this.props.userReducer.SelectedAssociationID,this.props.dashBoardReducer.uniID,this.props.userReducer.MyAccountID);
        this.setState({
          isLoading: false,
          dataSource: responseJson.data.invitation,
          error: responseJson.error || null,
          loading: false
        });
        this.arrayholder = responseJson.data.invitation;
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  searchFilterFunction = text => {
    this.setState({
      value: text
    });

    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.vlfName.toUpperCase()} ${item.vllName.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      dataSource: newData
    });
  };
  renderItem = ({ item, index }) => {
    console.log("List in visited ",item,index)
    return (
      <View style={{ flexDirection: "column" }}>
        <View style={{ borderColor: "#707070", borderWidth: wp("0.1%") }} />
        <View
          style={[
            styles.listItem,
            {
              justifyContent: "space-between",
              paddingRight: 0,
              height: hp("15%")
            }
          ]}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.contactIcon}>
              {item.vlfName[0].toUpperCase()}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {item.vlfName} {item.vllName}
            </Text>
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.infoNumber}>{item.vlMobile}</Text>
            </View>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end", paddingRight: 0 }}>
             <Card style={{ marginTop: hp('5%'), }}>
              <TouchableOpacity
                onPress={() => {
                  {
                    Platform.OS === "android"
                      ? Linking.openURL(`tel:${item.vlMobile}`)
                      : Linking.openURL(`telprompt:${item.vlMobile}`);
                  }
                }}
              >
                <CardItem bordered>
                  <Image
                    style={styles.images}
                    source={require("../icons/phone.png")}
                  />
                </CardItem>
              </TouchableOpacity>
            </Card>
          </View>
        </View>
        <View style={{ borderColor: "#707070", borderWidth: wp("0.05%") }} />
      </View>
    );
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.contaianer}>
          {/* <Header /> */}

          {/* <Text style={styles.titleOfScreen}>My Guests</Text> */}

          <View style={styles.progress}>
            <ActivityIndicator size="large" color="#F3B431" />
          </View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, marginTop:hp('1%') }}>
        {/* <Header /> */}
        <NavigationEvents
          onDidFocus={payload => this.getInvitationList()}
          onWillBlur={payload => this.getInvitationList()}
        />
        {/* <Text style={styles.titleOfScreen}> My Guests </Text> */}

        <Form style={styles.formSearch}>
            <Item style={styles.inputItem}>
              <Input
                marginBottom={hp("-1%")}
                placeholder="Search...."
                multiline={false}
                onChangeText={this.searchFilterFunction}
              />

              <Icon style={styles.icon} name="search" size={14} />
            </Item>
          </Form>

        {/* <TextInput
          style={styles.textinput}
          placeholder="search...."
          // lightTheme
          round
          onChangeText={this.searchFilterFunction}
        /> */}

        {this.state.dataSource.length === 0 ?
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}   >
              <Text style={{ backgroundColor: 'white',alignItems: 'center', justifyContent: 'center',fontSize:hp('1.8%') }}>No Data Available.</Text>
            </View>
          :  
        <FlatList
          style={{ marginTop: hp('1.5%') }}
          data={this.state.dataSource.sort((a, b) =>
            a.vlfName.localeCompare(b.vlfName)
          )}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => item.vlVisLgID.toString()}
        />
          }
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contaianer: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column"
  },
  progress: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  textinput: {
    height: hp('6%'),
    borderWidth: hp('0.1%'),
    borderColor: "#fff",
    marginHorizontal: hp('1%'),
    paddingLeft: hp('2%'),
    marginTop:hp('0.5%'),
    fontSize: hp('2.2%'),
    backgroundColor: "#f4f4f4",
    borderRadius: hp('4%'),
  },
  listItem: {
    flexDirection: "row",
    paddingLeft: hp("1.6%"),
    paddingRight: hp("1.6%"),
    paddingBottom: hp("2%"),
    paddingTop: hp("1%")
  },
  iconContainer: {
    width: hp("8%"),
    height: hp("8%"),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff8c00",
    borderRadius: 100,
    marginTop: hp("2%")
  },
  contactIcon: {
    fontSize: hp("3.5%"),
    color: "#fff"
  },
  infoContainer: {
    flexDirection: "column",
    paddingLeft: hp("1.6%"),
    paddingTop: hp("2%")
  },
  infoText: {
    fontSize: hp("2.5%"),
    fontWeight: "bold",
    paddingLeft: hp("1%"),
    color: "#000"
  },
  infoNumber: {
    fontSize: hp("2%"),
    fontWeight: "100",
    paddingLeft: hp("1%"),
    paddingTop: hp("1%"),
    color: "grey"
  },

  titleOfScreen: {
    marginTop: hp('1.5%'),
    textAlign: "center",
    fontSize: hp('2.4%'),
    fontWeight: "bold",
    marginBottom: hp('1.5%'),
    color:'#ff8c00'
  },

  floatButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0)",
    alignItems: "center",
    justifyContent: "center",
    width: hp('8%'),
    position: "absolute",
    bottom: hp('2.5%'),
    right: hp('2.5%'),
    height: hp('8%'),
    backgroundColor: "#FF8C00",
    borderRadius: 100,
    // shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 3,
    shadowOpacity: 0.6
  },
  images: {
    width: hp("1.6%"),
    height: hp("1.6%"),
    justifyContent: "center",
    alignItems: "center"
  },
  inputItem: {
    marginTop: wp("1%"),
    marginLeft: wp("4%"),
    marginRight: wp("4%"),
    //borderColor: "#909091"
    borderColor: "#000000"
  },
formSearch: {
    marginBottom: hp("1%")
  },
  icon: {
    color: "orange"
  }
});

const mapStateToProps = state => {
  return {
    approvedAdmins: state.AppReducer.approvedAdmins,
    champBaseURL: state.OyespaceReducer.champBaseURL,
    oyeURL: state.OyespaceReducer.oyeURL,
    MyAccountID: state.UserReducer.MyAccountID,
    dashBoardReducer:state.DashboardReducer,
    mediaupload:state.OyespaceReducer.mediaupload,
    userReducer: state.UserReducer
  };
};

export default connect(
  mapStateToProps,
)(MyGuests);