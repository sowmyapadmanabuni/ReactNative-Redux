import React from "react"
import {
  ActivityIndicator,
  Easing,
  FlatList,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"

import {NavigationEvents} from "react-navigation"

import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen"

import ZoomImage from "react-native-zoom-image"
import Style from "./Style"
import base from "../../../../base"
import {connect} from "react-redux";

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
      isModelVisible: true,
      searchText: ""
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
        `http://${this.props.oyeURL}/oyesafe/api/v1/FamilyMemberDetailsDelete/update`,
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
    this.setState({loading: true})
    console.log("Data sending to get family", this.props.dashBoardReducer.assId, this.props.dashBoardReducer.uniID)
    let myFamilyList = await base.services.OyeSafeApiFamily.myFamilyList(this.props.dashBoardReducer.uniID, this.props.dashBoardReducer.assId)
    console.log("Get Family Data", myFamilyList);

    // for(let i=0;i<myFamilyList.length;i++)
    //let arr=

    this.setState({isLoading: false, loading: false})
    try {
      if (myFamilyList && myFamilyList.data) {
        this.setState({
          myfamily11: myFamilyList.data.familyMembers.sort((a, b) => (a.fmName > b.fmName) ? 1 : -1),
          clonedList: myFamilyList.data.familyMembers.sort((a, b) => (a.fmName > b.fmName) ? 1 : -1)
        })
        this.setState({familyData: myFamilyList})
      }
    } catch (error) {
      base.utils.logger.log(error)
      this.setState({error, loading: false})
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isLoading: false
      });
    }, 1500);
    this.myFamilyListGetData()
  }

  renderItem = ({item}) => {
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
                            `https://mediaupload.oyespace.com/` + item.fmImgName
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
                        myFamilyMobileNo: item.fmMobile.replace(item.fmisdCode, ""),
                        acAccntID: item.acAccntID,
                        asAssnID: item.asAssnID,
                        fmGurName: item.fmGurName,
                        fmImgName: item.fmImgName,
                        fmIsActive: item.fmIsActive,
                        fmMinor: item.fmMinor,
                        fmMobile: item.fmMobile,
                        fmName: item.fmName,
                        fmRltn: item.fmRltn,
                        fmid: item.fmid,
                        fmisdCode: item.fmisdCode,
                        fmlName: item.fmlName,
                        meMemID: item.meMemID,
                        unUnitID: item.unUnitID
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
          <View style={Style.lineAboveAndBelowFlatList}/>
        </View>
    )
  }

  handleSearch(text) {
    this.setState({searchText: text});
    console.log('Text', text)
    let sortList = this.state.clonedList;
    let filteredArray = [];
    if (text.length === 0) {
      filteredArray.push(this.state.clonedList)
    } else {
      for (let i in sortList) {
        if ((sortList[i].fmName.toLowerCase()).includes(text.toLowerCase()) || (sortList[i].fmRltn.toLowerCase()).includes(text.toLowerCase()) || (sortList[i].fmMobile.toLowerCase()).includes(text.toLowerCase())) {
          filteredArray.push(sortList[i])
        }
      }
    }
    this.setState({
      myfamily11: text.length === 0 ? filteredArray[0] : filteredArray
    });
  };

  render() {
    const {navigate} = this.props.navigation

    if (this.state.isLoading) {
      return (
          <View style={Style.mainView}>
            {/* <Header /> */}


            <SafeAreaView style={{backgroundColor: "#ff8c00"}}>
              <View style={[Style.viewStyle1, {flexDirection: "row"}]}>
                <View style={Style.viewDetails1}>
                  <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.goBack();
                      }}
                  >
                    <View
                        style={{
                          height: hp("4%"),
                          width: wp("15%"),
                          alignItems: 'flex-start',
                          justifyContent: "center"
                        }}
                    >
                      <Image
                          resizeMode="contain"
                          source={require("../../../../../icons/back.png")}
                          style={Style.viewDetails2}
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
                <View style={{flex: 0.2}}>
                  {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
                </View>
              </View>
              <View style={{borderWidth: 1, borderColor: "#ff8c00"}}/>
            </SafeAreaView>

            <View style={Style.progressViewStyle}>
              <ActivityIndicator size="large" color="#01CBC6"/>
            </View>
          </View>
      )
    }
    return (
        <View style={Style.mainView}>
          {/* <Header /> */}

          <SafeAreaView style={{backgroundColor: "#ff8c00"}}>
            <View style={[Style.viewStyle1, {flexDirection: "row"}]}>
              <View style={Style.viewDetails1}>
                <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.goBack();
                    }}
                >
                  <View
                      style={{
                        height: hp("4%"),
                        width: wp("15%"),
                        alignItems: 'flex-start',
                        justifyContent: "center"
                      }}
                  >
                    <Image
                        resizeMode="contain"
                        source={require("../../../../../icons/back.png")}
                        style={Style.viewDetails2}
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
              <View style={{flex: 0.2}}>
                {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
              </View>
            </View>
            <View style={{borderWidth: 1, borderColor: "#ff8c00"}}/>
          </SafeAreaView>

          <NavigationEvents
              onDidFocus={payload => this.myFamilyListGetData()}
              onWillBlur={payload => this.myFamilyListGetData()}
          />
          <View style={Style.containerViewStyle}>
            <Text style={Style.titleOfScreenStyle}>Family Members</Text>

            <View style={{flexDirection: 'row'}}>
              {/* <Item style={Style.inputItem}>

              <Input
                marginBottom={hp("-1%")}
                placeholder="Search...."
                multiline={false}
                onChangeText={this.searchFilterFunction}
              />

              <Icon style={Style.icon} name="search" size={14} />
            </Item>*/}
              <View
                  style={{flex: 0.9, height: hp("5.5%"), marginStart: hp("2%"), marginBottom: 50}}
              >
                <TextInput
                    // value={this.state.searchText}
                    style={{
                      height: hp("5.5%"),
                      backgroundColor: "#F5F5F5",
                      borderRadius: hp("7%"),
                      fontSize: hp("1.8%"),
                      paddingLeft: hp("2%")
                    }}
                    placeholder="  search...."
                    round
                    //autoCapitalize="characters"
                    onChangeText={(text) => this.handleSearch(text)}
                />
              </View>
            </View>
            {/* <View style={Style.lineAboveAndBelowFlatList} /> */}

            {this.state.familyData.length == 0 ?
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
                  <Text style={{
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: hp('1.6%')
                  }}>No Family Data Available.</Text>
                  <Text style={{
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: hp('1.6%')
                  }}>Add your family details.</Text>
                </View>
                :
                <FlatList
                    // data={this.state.dataSource.sort((a, b) =>
                    //   a.fmName.localeCompare(b.fmName)
                    // )}
                    data={this.state.myfamily11}
                    extraData={this.state}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => item.fmid.toString()}
                />

            }
            <TouchableOpacity
                style={Style.floatButton}
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
    mediaupload: state.OyespaceReducer.mediaupload,
    dashBoardReducer: state.DashboardReducer
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
