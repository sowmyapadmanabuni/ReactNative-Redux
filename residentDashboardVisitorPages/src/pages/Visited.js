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
import { Card, CardItem } from "native-base";
import { NavigationEvents } from "react-navigation";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import {connect} from 'react-redux';

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
    }, 5000);
  }

  getInvitationList = () => {
    fetch(
      `http://${this.state.oyeURL}/oye247/api/v1/GetInvitationListByAssocIDAndIsQRCodeGenerated/${this.props.SelectedAssociationID}/False`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log("Manas", responseJson);
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
        console.log(error);
      });
  };

  searchFilterFunction = text => {
    this.setState({
      value: text
    });

    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.infName.toUpperCase()} ${item.inlName.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      dataSource: newData
    });
  };
  renderItem = ({ item, index }) => {
    // console.log(item,index)
    return (
      <View style={{ flexDirection: "column" }}>
        <View style={{ borderColor: "#707070", borderWidth: hp("0.03%")  }} />
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
              {item.infName[0].toUpperCase()}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {item.infName} {item.inlName}
            </Text>
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.infoNumber}>{item.inMobile}</Text>
            </View>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end", paddingRight: 0 }}>
             <Card style={{ marginTop: hp('5%'), }}>
              <TouchableOpacity
                onPress={() => {
                  {
                    Platform.OS === "android"
                      ? Linking.openURL(`tel:${item.inMobile}`)
                      : Linking.openURL(`telprompt:${item.inMobile}`);
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
        <View style={{ borderColor: "#707070", borderWidth: hp("0.03%")  }} />
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

        <TextInput
          style={styles.textinput}
          placeholder="search...."
          // lightTheme
          round
          onChangeText={this.searchFilterFunction}
        />
        <FlatList
          style={{ marginTop: hp('1.5%') }}
          data={this.state.dataSource.sort((a, b) =>
            a.infName.localeCompare(b.infName)
          )}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => item.inInvtID.toString()}
        />

        
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
  }
});

const mapStateToProps = state => {
  return {
    oyeURL: state.OyespaceReducer.oyeURL,
    MyFirstName: state.UserReducer.MyFirstName,
    MyLastName: state.UserReducer.MyLastName,
    MyMobileNumber: state.UserReducer.MyMobileNumber,
    viewImageURL: state.OyespaceReducer.viewImageURL,
    SelectedAssociationID: state.UserReducer.SelectedAssociationID,
    SelectedUnitID: state.UserReducer.SelectedUnitID,
    SelectedAssociationID: state.UserReducer.SelectedAssociationID
  };
};

export default connect(mapStateToProps)(MyGuests);
