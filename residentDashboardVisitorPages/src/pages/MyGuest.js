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
import { connect } from "react-redux";
import Modal from "react-native-modal";
import { QRCode } from "react-native-custom-qr-codes";
import Share, { ShareSheet, Button } from "react-native-share";
import RNFS from "react-native-fs";
import { captureScreen } from "react-native-view-shot";
import base from "../../../src/base";

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
      error: null,

      isSelected: false,

      isModalVisible: false,
      association: "",
      qrText: "initial_qr",
      visible: false,
      qrShare: "initial_share",
      imageURI: "",
      dataBase64: "",
      selectedData:{}
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
    this.associationName();
  }
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  onCancel() {
    console.log("CANCEL");
    this.setState({ visible: false });
  }
  onOpen() {
    console.log("OPEN");
    this.setState({ visible: true });
  }
  // qrGeneration = () => {
  //   const { params } = this.props.navigation.state;
  //   // let txt = params.value.inInvtID + params.value.meMemID + params.value.unUnitID+params.value.infName+params.value.inlName+params.value.asAssnID
  //   //   +params.value.inEmail+params.value.inMobile+params.value.inMultiEy+params.value.inpOfInv +params.value.inVchlNo+params.value.inVisCnt+params.value.insDate+params.value.ineDate;
  //   let txt =
  //     items.infName +
  //     "," +
  //     items.inMobile.substring(0, 3) +
  //     "," +
  //     items.inMobile.substring(3, 13) +
  //     "," +
  //     items.inInvtID +
  //     "," +
  //     items.unUnitID +
  //     "," +
  //     "," +
  //     items.insDate.substring(0, 10) +
  //     "," +
  //     items.insDate.substring(11, 15) +
  //     ",," +
  //     items.inVisCnt +
  //     "," +
  //     items.insDate.substring(0, 10) +
  //     "," +
  //     items.asAssnID +
  //     "," +
  //     items.inIsActive;
  //   // let txt1 = "You are invited to " + params.value.infName + "'s home @ " + params.value.unUnitID + " " + params.value.insDate;
  //   let txt1 =
  //     items.infName +
  //     "," +
  //     items.inMobile.substring(0, 3) +
  //     "," +
  //     items.inMobile.substring(3, 13) +
  //     "," +
  //     items.inInvtID;
  //   "," +
  //     items.unUnitID +
  //     "," +
  //     "," +
  //     items.insDate.substring(0, 10) +
  //     "," +
  //     items.insDate.substring(11, 15) +
  //     ",," +
  //     items.inVisCnt +
  //     "," +
  //     items.insDate.substring(0, 10) +
  //     "," +
  //     items.asAssnID +
  //     "," +
  //     items.inIsActive;
  //   this.setState({
  //     qrText: txt,
  //     qrShare: txt1
  //   });
  //   console.log(txt);
  // };

  takeScreenShot = () => {
    // const { params } = this.props.navigation.state;
    captureScreen({
      format: "jpg",
      quality: 0.8
    }).then(
      //callback function to get the result URL of the screnshot
      uri => {
        this.setState({ imageURI: uri }),
          RNFS.readFile(this.state.imageURI, "base64").then(data => {
            // binary data
            console.log("data base64 " + data);
            this.setState({ dataBase64: data });
            let shareImagesBase64 = {
              title: "Invitation",
              message:
                params.value.infName +
                " invites you to " + //global.AssociationUnitName + ' in ' +
                // params.value.asAssnID
                this.state.association +
                " for " +
                params.value.inpOfInv +
                " on " +
                params.value.insDate.substring(0, 10) +
                " at " +
                params.value.insDate.substring(11, 16) +
                "  ",
              url: "data:image/png;base64," + this.state.dataBase64,
              subject: "Share Invitation" //  for email
            };
            this.setState({
              isModalVisible:false
            },()=>Share.open(shareImagesBase64))
            //Share.open(shareImagesBase64);
          });
      },
      error => {
        console.error("Oops, Something Went Wrong", error),
          console.log("error uploadImage ", error);
      }
    );
  };

  getInvitationList = () => {
    console.log("association id in guest", this.props)
    fetch(
      `http://${
        this.props.oyeURL
      }/oye247/api/v1/GetInvitationListByAssocIDAndIsQRCodeGenerated/${this.props.dashBoardReducer.assId}/True`,
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

  associationName = () => {
    fetch(
      `http://${
        this.props.oyeURL
      }/oyeliving/api/v1/association/getAssociationList/${this.props.dashBoardReducer.assId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          association: responseJson.data.association.asAsnName
        });
        console.log("!@#!@#!@$@#%@#$!@$@$!@$!@", this.state.association);
      })
      .catch(error => console.log(error));
  };

  setData(data){
      this.setState({
          selectedData:data
      },()=>this.Modal())
  }

  renderItem = ({ item, index }) => {
    // console.log(item,index)
    return (
      <View style={{ flexDirection: "column" }}>
        
          <View style={{ borderColor: "#707070", borderWidth: hp("0.03%") }} />
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
              <Card style={{ paddingTop: 0 }}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("QRCodeGeneration", {
                      value: this.state.dataSource[index]
                    });
                    // this.setData(item)
                    
                  }}
                >
                  <CardItem bordered>
                    <Image
                      style={styles.images}
                      source={require("../icons/share.png")}
                    />
                  </CardItem>
                </TouchableOpacity>
              </Card>
              <Card style={{ marginTop: 0 }}>
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
          <View style={{ borderColor: "#707070", borderWidth: hp("0.03%") }} />
        {/* {this.state.isSelected === true && this.renderDetails()} */}
        
      </View>
    );
  };

  modal() {
     console.log(this.state.selectedData);

    <Modal
          style={{ justifyContent: "center", alignContent: "center" }}
          isVisible={this.state.isModalVisible}
        >
          <View style={{ height: hp("50%"), width: hp("40%") }}>
            <View
              style={{
                flexDirection: "column",
                marginTop: hp("2%"),
                backgroundColor: "#fff",
                height: hp("16%")
              }}
            >
              <View
                style={{ flexDirection: "row", flex: 1, marginTop: hp("1.4%") }}
              >
                <View style={{ flex: 0.9, marginLeft: hp("2%") }}>
                  <Text style={{ color: "grey" }}>Association Name</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "black", fontWeight: "500" }}>
                    {this.state.association === ""
                      ? ""
                      : this.state.association}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", flex: 1 }}>
                <View style={{ flex: 0.9, marginLeft: hp("2%") }}>
                  <Text style={{ color: "grey" }}>Purpose of Visit</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "black", fontWeight: "500" }}>
                    {this.state.selectedData.inpOfInv}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", flex: 1 }}>
                <View style={{ flex: 0.9, marginLeft: hp("2%") }}>
                  <Text style={{ color: "grey" }}>Invited On</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "#38BCDB", fontWeight: "500" }}>
                    {/* {this.state.selectedData.insDate.substring(0, 10)}{" "}
                    {this.state.selectedData.insDate.substring(11, 16)} */}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", flex: 1 }}>
                {this.state.selectedData.inVisCnt === 1 ? (
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={{ flex: 0.9, marginLeft: hp("2%") }}>
                      <Text style={{ color: "grey" }}>Total Guest</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: "black", fontWeight: "500" }}>
                        {" "}
                        {this.state.selectedData.inVisCnt}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={{ flex: 0.9, marginLeft: hp("2%") }}>
                      <Text style={{ color: "grey" }}>Total Guests</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: "black", fontWeight: "500" }}>
                        {this.state.selectedData.inVisCnt}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: hp("3%")
              }}
            >
              <QRCode
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: hp("10%"),
                  borderWidth: hp("2%"),
                  backgroundColor: "black"
                }}
                logo={require("../icons/logo_QR.png")}
                logoSize={80}
                content={this.state.qrText}
                codeStyle="square"
                outerEyeStyle="square"
                innerEyeStyle="square"
              />
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                marginBottom: hp("5%")
              }}
            >
              
        <View style={{flexDirection:'row'}}>
        <TouchableOpacity onPress={() => this.toggleModal()}>
                <View
                  style={{
                    borderRadius: hp("1%"),
                    borderWidth: hp("0.1%"),
                    width: wp("15%"),
                    height: hp("6%"),
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: hp("5%"),
                    backgroundColor: "#fff",
                    borderColor: "#797979",
                    marginRight:hp('2%')
                  }}
                >
                  <Text
                    style={{
                      fontSize: hp("2.5%"),
                      color: "#797979",
                      fontWeight: "400"
                    }}
                  >
                    Close
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.takeScreenShot();
                }}
              >
                <View
                  style={{
                    borderRadius: hp("1%"),
                    borderWidth: hp("0.1%"),
                    width: wp("60%"),
                    height: hp("6%"),
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: hp("5%"),
                    backgroundColor: "#fff",
                    borderColor: "#797979"
                  }}
                >
                  <Text
                    style={{
                      fontSize: hp("2.5%"),
                      color: "#797979",
                      fontWeight: "700"
                    }}
                  >
                    Share QR Code
                  </Text>
                </View>
              </TouchableOpacity>

    
        </View>
             
                       
            </View>
          </View>
       
        </Modal>
  }
  render() {
    console.log("Dashboard",this.props.dashBoardReducer) 
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
      <View style={{ flex: 1, marginTop: hp("1%") }}>
        {/* <Header /> */}
        <NavigationEvents
          onDidFocus={payload => this.getInvitationList()}
          onWillBlur={payload => this.getInvitationList()}
        />
        {/* <Text style={styles.titleOfScreen}> My Guests </Text> */}

        <TextInput
          style={styles.textinput}
          placeholder="Search..."
          round
          onChangeText={this.searchFilterFunction}
        />
        <FlatList
          style={{ marginTop: hp("1.5%") }}
          data={this.state.dataSource.sort((a, b) =>
            a.infName.localeCompare(b.infName)
          )}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => item.inInvtID.toString()}
        />

        <TouchableOpacity
          style={[styles.floatButton, { alignSelf: "center", marginLeft: 2 }]}
          onPress={() => this.props.navigation.navigate("InviteGuests")}
        >
          <Text
            style={{
              fontSize: hp("5%"),
              color: "#fff",
              fontWeight: "bold",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              marginBottom: hp("0.5%")
            }}
          >
            +
          </Text>
          {/* <Entypo 
                    name="plus"
                    size={30}
                    color="#fff"
                /> */}
        </TouchableOpacity>
        {this.modal()}
      </View>
    );
  }
}

//shareow(){
 // let shareData = this.state.shareData;
//  let 
//}

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
    height: hp("5%"),
    borderWidth: hp("0.1%"),
    borderColor: "#fff",
    marginHorizontal: hp("1%"),
    paddingLeft: hp("2%"),
    marginTop: hp("0.5%"),
    fontSize: hp("2.2%"),
    borderBottomWidth: hp("0.5%"),
    borderColor: "#f4f4f4"
    // backgroundColor: "#f4f4f4",
    // borderRadius: hp('4%'),
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
    marginTop: hp("1.5%"),
    textAlign: "center",
    fontSize: hp("2.4%"),
    fontWeight: "bold",
    marginBottom: hp("1.5%"),
    color: "#ff8c00"
  },

  floatButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0)",
    alignItems: "center",
    justifyContent: "center",
    width: hp("8%"),
    position: "absolute",
    bottom: hp("2.5%"),
    right: hp("2.5%"),
    height: hp("8%"),
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
    dashBoardReducer:state.DashboardReducer 

  };
};


export default connect(mapStateToProps)(MyGuests);
