import React, { Component } from "react"
import {
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  FlatList,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  TextInput,
  Dimensions,
  Animated,
  Easing,
  SafeAreaView
} from "react-native"
import { Card, CardItem, Form, Item, Input, Icon } from "native-base"

import { NavigationEvents } from "react-navigation"

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen"

import ZoomImage from "react-native-zoom-image"
import Style from "./Style"
import OyeSafeApiFamily from "../../../../base/services/OyeSafeApiFamily"
import base from "../../../../base"
import { connect } from "react-redux";

class MyFamilyList extends React.Component {
  static navigationOptions = {
    title: "MyFamilyList",
    header: null
  }

  constructor(props) {
    super(props)
    this.state = {
      familyData: [],
      isLoading: true,
      dataSource: [],
      query: "",
      loading: false,
      error: null,
      myFamilyList: [],
      myfamily11: [],
      isModelVisible: true
    }

    this.arrayholder = []
  }

  renderFlatList(item) {
    let itemID = item.id

    return (
      <TouchableHighlight onPress={() => this.deleteData(item.id)}>
        //some code
      </TouchableHighlight>
    )
  }

  deleteData(itemID) {
    console.log("fsdkjhfjsa", itemID)
    let itemId = itemID

    fetch(
      "http://apidev.oyespace.com/oyesafe/api/v1/FamilyMemberDetailsDelete/update",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
        },
        body: JSON.stringify({
          FMID: itemId
        })
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson)
        let data = responseJson
        if (data.success) {
          this.myFamilyListGetData()
        }
      })
      .catch(error => {
        console.log("error", error)
        alert("error")
      })
  }

  searchFilterFunction = text => {
    this.setState({
      value: text
    })

    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.fmName.toUpperCase()} ${item.fmName.toUpperCase()} ${item.fmName.toUpperCase()}`
      const textData = text.toUpperCase()

      return itemData.indexOf(textData) > -1
    })
    this.setState({
      dataSource: newData
    })
  }

  async myFamilyListGetData() {
    let self = this
    var familylist = ""
    console.log(base.utils.strings.oyeSafeUrlF)
    this.setState({ loading: true })
    // let family = await base.services.OyeSafeApiFamily.myFamilyList(4, 2)
    myFamilyList = await base.services.OyeSafeApiFamily.myFamilyList(this.props.dashBoardReducer.assId, this.props.dashBoardReducer.uniID)
    console.log(myFamilyList.data.familyMembers, "kljfksdjfksa")
    this.setState({ myfamily11: myFamilyList.data.familyMembers })
    this.setState({ familyData: myFamilyList })
    try {
      if (myFamilyList && myFamilyList.data) {
        this.setState({ isLoading: false, loading: false })
        for (let i = 0; i < myFamilyList.data.familyMembers.length; i++) {
          // familylist.push({
          //   value: MyFamilyList.data.familyMembers[i].fmName
          // })
          console.log(
            "hhghghjhjgfhj",
            myFamilyList.data.familyMembers[i].fmName
          )
        }
      }
    } catch (error) {
      base.utils.logger.log(error)
      this.setState({ error, loading: false })
    }
  }

  componentDidMount() {
    this.myFamilyListGetData()
  }

  renderItem = ({ item }) => {
    let itemID = item.id
    return (
      <View style={Style.tableView}>
        <View style={Style.cellView}>
          <View style={Style.imageContainerViewStyle}>
            {item.fmImgName == "" ? (
              <ZoomImage
                source={require("../../../../../icons/placeholderImg.png")}
                imgStyle={Style.placeholderImage}
                duration={300}
                enableScaling={true}
                easingFunc={Easing.bounce}
              />
            ) : (
              <ZoomImage
                source={{
                  uri:
                    "http://mediaupload.oyespace.com/Images/" + item.fmImgName
                }}
                imgStyle={Style.placeholderImage}
                duration={300}
                enableScaling={true}
                easingFunc={Easing.bounce}
              />
            )}
          </View>
          <View style={Style.middleFlexBlockForMemberDetailsViewContainer}>
            <Text style={Style.familyMemberNameTextStyle}>{item.fmName}</Text>
            <View style={Style.memberDetailFlexViewStyle}>
              <Image
                style={Style.memberDetailIconImageStyle}
                source={require("../../../../../icons/user.png")}
              />
              <Text style={Style.memberDetailsTextStyle}>{item.fmRltn}</Text>
            </View>

            <View style={Style.memberDetailFlexViewStyle}>
              <Image
                style={Style.memberDetailIconImageStyle}
                source={require("../../../../../icons/age.png")}
              />
              <Text style={Style.memberDetailsTextStyle}>{item.fmAge}</Text>
            </View>
            <View style={Style.memberDetailFlexViewStyle}>
              <Image
                style={Style.memberDetailIconImageStyle}
                source={require("../../../../../icons/call.png")}
              />
              <Text style={Style.memberDetailsTextStyle}>{item.fmMobile}</Text>
            </View>
          </View>
          <View style={Style.editAndCallIconsFlexStyle}>
            <View style={Style.threeBtnStyle}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("MyFamilyEdit", {
                    myFamilyName: item.fmName,
                    myFamilyMobileNo: item.fmMobile.replace(item.fmisdCode, ""),
                    myFamilyAge: item.fmAge,
                    myFamilyRelation: item.fmRltn,
                    myFamilyFmid: item.fmid,
                    myFamilyCallingcode: item.fmisdCode,
                    myFamilyCca2: item.fmFlag
                  })
                }}
              >
                <Image
                  style={Style.editAndCallButtonIconImageStyle}
                  source={require("../../../../../icons/edit.png")}
                />
              </TouchableOpacity>
            </View>

            <View style={Style.threeBtnStyle}>
              <TouchableOpacity
                onPress={() => {
                  {
                    Platform.OS === "android"
                      ? Linking.openURL(`tel:${item.fmMobile}`)
                      : Linking.openURL(`tel:${item.fmMobile}`)
                  }
                }}
              >
                <Image
                  style={Style.editAndCallButtonIconImageStyle}
                  source={require("../../../../../icons/call.png")}
                />
              </TouchableOpacity>
            </View>

            <View style={Style.threeBtnStyle}>
              <TouchableOpacity onPress={() => this.deleteData(item.fmid)}>
                <Image
                  style={Style.editAndCallButtonIconImageStyle}
                  source={require("../../../../../icons/delete.png")}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={Style.lineAboveAndBelowFlatList} />
      </View>
    )
  }

  render() {
    const { navigate } = this.props.navigation

    if (this.state.isLoading) {
      return (
        <View style={Style.progressViewStyle}>
          <ActivityIndicator size="large" color="#01CBC6" />
        </View>
      )
    }
    return (
      <View style={Style.mainView}>
        {/* <Header /> */}

        <SafeAreaView style={{ backgroundColor: "orange" }}>
          <View style={[Style.viewStyle1, { flexDirection: "row" }]}>
            <View style={Style.viewDetails1}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("ResDashBoard")
                }}
              >
                <View
                  style={{
                    height: hp("4%"),
                    width: wp("15%"),
                    alignItems: "flex-start",
                    justifyContent: "center"
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={require("../../../../../icons/back.png")}
                    //style={Style.viewDetails2}
                    style={{ width: 20, height: 20 }}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                style={[Style.image1]}
                source={require("../../../../../icons/headerLogo.png")}
              />
            </View>
            <View style={{ flex: 1 }} />
          </View>
          <View style={{ borderWidth: 1, borderColor: "#ff8c00" }} />
        </SafeAreaView>

        <NavigationEvents
          onDidFocus={payload => this.myFamilyListGetData()}
          onWillBlur={payload => this.myFamilyListGetData()}
        />
        <View style={Style.containerViewStyle}>
          <Text style={Style.titleOfScreenStyle}>My Family Members</Text>

          <Form style={Style.formSearch}>
            <Item style={Style.inputItem}>
              <Input
                marginBottom={hp("-1%")}
                placeholder="Search...."
                multiline={false}
                onChangeText={this.searchFilterFunction}
              />

              <Icon style={Style.icon} name="search" size={14} />
            </Item>
          </Form>
          {/* <View style={Style.lineAboveAndBelowFlatList} /> */}
          <FlatList
            // data={this.state.dataSource.sort((a, b) =>
            //   a.fmName.localeCompare(b.fmName)
            // )}
            data={this.state.myfamily11.sort((a, b) =>
              a.fmName.localeCompare(b.fmName)
            )}
            extraData={this.state}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.fmid.toString()}
          />

          <TouchableOpacity
            style={Style.floatingPlusButtonStyle}
            onPress={() => {
              this.props.navigation.navigate("MyFamily")
            }}
          >
            <Text style={Style.plusTextStyle}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    associationid: state.DashboardReducer.associationid,
    selectedAssociation: state.DashboardReducer.selectedAssociation,
    oyeURL: state.OyespaceReducer.oyeURL,
    dashBoardReducer:state.DashboardReducer
  };
};

export default connect(mapStateToProps)(MyFamilyList);

// createIdsForData = () => {
//   // returns a new array with ids from index
//   let dataWithIds = this.state.myfamily11.map((item, index) => {
//     item.id = index
//   })

//   this.setState({
//     myfamily11: dataWithIds
//   })
// }

// removeHandler = id => {
//   // returns new array with item filtered out
//   this.setState({
//     myfamily11: this.state.myfamily11.filter(item => item.id === id)
//   })
// }

// deleteItemById = id => {
//   this.setState({
//     value: id
//   })
//   const filteredData = this.state.myfamily11.filter(item => {
//     item.id === myFamilyList.data.familyMembers.fmid

//     return myFamilyList.data.familyMembers.fmid
//   })
//   this.setState({ myfamily11: filteredData })
// }
