import React, { Component } from "react"
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,SafeAreaView
} from "react-native"
import { Button } from "native-base"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen"
import { NavigationEvents } from "react-navigation"
import {connect} from 'react-redux';

class BlockDetail extends React.Component {
  static navigationOptions = {
    title: "BlockDetail",
    header: null
  }
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      dataSource: [],

      loading: false,
      error: null
    }
    this.arrayholder = []
  }

  componentDidMount() {
    this.myBlockDetailListGetData()
    setTimeout(() => {
      this.setState({
        isLoading: false
      });
    }, 3000);
  }

  myBlockDetailListGetData = () => {
    // console.log("________")
    this.setState({ loading: true })

    fetch(`http://${this.props.oyeURL}/oyeliving/api/v1/Block/GetBlockListByAssocID/${this.props.SelectedAssociationID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson, "8888888888888888888888888888888888888")
        this.setState({
          isLoading: false,
          dataSource: responseJson.data.blocksByAssoc,
          error: responseJson.error || null,
          loading: false
        })
        this.arrayholder = responseJson.data.blocksByAssoc
        console.log(
          this.state.dataSource,
          "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
        )
      })
      .catch(error => {
        this.setState({ error, loading: false })
        console.log(error, "77777777777777777777777777777")
      })
  }

  renderItem = ({ item }) => {

    return (
      <View style={styles.tableView}>
        <View style={styles.cellView}>
          <View style={styles.cellDataInColumn}>
            <View style={styles.blockNameFlexStyle}>
              <Image
                style={styles.memberDetailIconImageStyle}
                source={require("../icons/building.png")}
              />
              <Text style={styles.blockNameTextStyle}>{item.blBlkName}</Text>
            </View>
            <View style={styles.blockTypeFlexStyle}>
              <Text style={styles.blockTypeTextStyle}>
                BlockType: {item.blBlkType}
              </Text>
            </View>
            <View style={styles.noOfUnitsFlex}>
              <View style={styles.viewForNoOfUnitsText}>
                <Text style={styles.numberOfUnitsTextStyle}>
                  No. Of Units:{" "}
                  <Text style={{ color: "#38BCDB", fontSize: hp("1.8%") }}>
                    {" "}
                    {item.blNofUnit}
                  </Text>
                </Text>
              </View>
              {/* <View style={styles.emptyViewStyle} /> */}
              <View style={styles.editButtonViewStyle}>
                {/* <TouchableOpacity
                  onPress={() => {
                    
                    this.props.navigation.navigate("EditBlockScreen", {
                      MyBlockName: item.blBlkName.toString(),
                      MyBlockType: item.blBlkType.toString(),
                      MyBlockNoOfUnits: item.blNofUnit.toString(),
                      MyBlockManagerName: item.blMgrName.toString(),
                      MyBlockMobileNumber: item.blMgrMobile.toString(),
                      MyBlockManagerEmail: item.blMgrEmail.toString(),
                      MyBlockFlatRate: item.asMtFRate.toString(),
                      MyBlockMaintenceValue: item.asMtDimBs.toString(),
                      MyBlockMeasurementType: item.asUniMsmt.toString(),
                      MyBlockInvoiceCreationFrequency: item.asiCrFreq.toString(),
                      MyBlockNextInvoiceGenerationDate: item.asbGnDate.toString(),
                      MyBlockDueDate: item.asdPyDate.toString(),
                      MyBlockLatePaymentChargeType: item.aslpcType.toString(),
                      MyBlockLatePaymentCharge: item.aslpChrg.toString(),
                      MyBlockStartsFrom: item.aslpsDate.toString(),
                      MyBlockId: item.blBlockID.toString()
                    })
                  }}
                >
                  <Image
                    style={styles.pencilBtnStyle}
                    source={require("../icons/pencil120.png")}
                  />
                </TouchableOpacity> */}
                <View style={{ marginLeft: hp("1%") }}>
                  <Button bordered dark style={styles.addUnitButton}
                    onPress={() => this.props.navigation.navigate("BlockWiseUnitListScreen",{
                      unitid: item.blBlockID,
                      blockName: item.blBlkName
                    })}
                  >
                    <Text style={styles.addUnitText}>Add Unit</Text>
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.lineAboveAndBelowFlatList} />
      </View>
    )
  }

  render() {
    const { navigate } = this.props.navigation
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, flexDirection: "column" }}>
          <SafeAreaView style={{ backgroundColor: "orange" }}>
            <View style={[styles.viewStyle1, { flexDirection: "row" }]}>
              <View style={styles.viewDetails1}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}
                >
                  <View
                    style={{
                      height: hp("6%"),
                      width: wp("20%"),
                      alignItems: "center",
                      justifyContent: "center",
                      alignContent: "center"
                    }}
                  >
                    <Image
                      source={require("../icons/backBtn.png")}
                      style={styles.viewDetails2}
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
                  style={[styles.image1]}
                  source={require("../icons/headerLogo.png")}
                />
              </View>
              <View style={{ flex: 0.2 }}>
                {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
              </View>
            </View>
            <View style={{ borderWidth: 1, borderColor: "orange" }} />
          </SafeAreaView>
          <Text style={styles.residentialListTitle}>Block Details</Text>
          <View style={styles.progress}>
            <ActivityIndicator size="large" color="#F3B431" />
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "center",
                position: 'relative',
                marginTop:hp('1%')
              }}
            >
              <Text>Please Wait</Text>
            </View>
          </View>
        </View>
      )
    }
    return (
      <View style={styles.mainView}>
        <SafeAreaView style={{ backgroundColor: "orange" }}>
          <View style={[styles.viewStyle1, { flexDirection: "row" }]}>
            <View style={styles.viewDetails1}>
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
                    source={require("../icons/back.png")}
                    style={styles.viewDetails2}
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
                style={[styles.image1]}
                source={require("../icons/OyeSpace.png")}
              />
            </View>
            <View style={{ flex: 0.2 }}>
              {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
            </View>
          </View>
          <View style={{ borderWidth: 1, borderColor: "orange" }} />
        </SafeAreaView>
       
        <NavigationEvents
          onDidFocus={payload => this.myBlockDetailListGetData()}
          onWillBlur={payload => this.myBlockDetailListGetData()}
        />

        <View style={styles.containerViewStyle}>
          <Text style={styles.titleOfScreenStyle}>Block Details</Text>

          <View style={styles.lineAboveAndBelowFlatList} />
          <FlatList
            data={this.state.dataSource.sort((a, b) =>
              a.blBlkName.localeCompare(b.blBlkName)
            )}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.blBlockID.toString()}
          />

          <TouchableOpacity
            style={[styles.floatButton]}
            onPress={() => this.props.navigation.navigate("CreateBlockScreen")}
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
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  emptyViewStyle: {
    width: hp("15%")
  },
  viewStyle1: {
    backgroundColor: "#fff",
    height: hp("7%"),
    width: Dimensions.get("screen").width,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: "relative"
  },
  residentialListTitle: {
    textAlign: "center",
    fontSize: hp("2.5%"),
    fontWeight: "bold",
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
    color: "#ff8c00"
  },
  progress: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  viewDetails1: {
    flex: 0.3,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 3
  },
  viewDetails2: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: wp("6%"),
    height: hp("2%")
  },
  image1: {
    width: wp("22%"),
    height: hp("12%"),
    marginRight: hp("1%")
  },

  editButtonViewStyle: {
    // backgroundColor: "yellow",
    marginRight: hp("3%"),
    justifyContent: "space-around",
    flexDirection: "row",
    alignSelf: "center"
  },
  viewForNoOfUnitsText: {
    justifyContent: "flex-start",
    alignSelf: "center"
    //flexDirection: "row"
  },
  progressViewStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  mainView: {
    flex: 1
  },
  containerViewStyle: {
    height: hp("87%"),
    width: wp("100%")
  },

  titleOfScreenStyle: {
    marginTop: hp("2%"),
    marginBottom: hp("2.5%"),
    textAlign: "center",
    fontSize: hp("2.3%"),
    fontWeight: "500",
    color: "#FF8C00"
  },

  lineAboveAndBelowFlatList: {
    backgroundColor: "lightgray",
    height: hp("0.1%")
  },
  floatButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0)",
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
    width: hp("8%"),
    position: "absolute",
    bottom: 20,
    right: 20,
    height: hp("8%"),
    backgroundColor: "#FF8C00",
    borderRadius: hp("5%"),
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
    fontSize: hp("5%"),
    color: "#fff",
    fontWeight: "700",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    // textAlign: "center",
    textAlignVertical: "center"
  },
  tableView: {
    flexDirection: "column"
  },
  cellView: {
    flexDirection: "row",
    marginLeft: wp("3%"),
    marginRight: wp("1%"),
    marginVertical: hp("1%")
    // justifyContent: "flex-start"
  },

  cellDataInColumn: {
    flexDirection: "column",
    alignItems: "flex-start"

    //justifyContent: "flex-start"
  },

  blockTypeFlexStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    marginVertical: hp("0.6%")
  },
  blockNameFlexStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    marginVertical: hp("0.5%")
  },
  noOfUnitsFlex: {
    flex: 1,

    flexDirection: "row",
    justifyContent: "space-between",
    width: Dimensions.get("window").width
  },
  memberDetailIconImageStyle: {
    width: wp("5%"),
    height: wp("5%")
  },
  blockNameTextStyle: {
    fontSize: hp("2%"),
    // color: "#909091",
    marginLeft: hp("1%"),
    fontWeight: "500"
  },
  blockTypeTextStyle: {
    fontSize: hp("2%"),
    color: "#909091",
    marginLeft: hp("3.5%"),
    fontWeight: "500"
  },
  numberOfUnitsTextStyle: {
    fontSize: hp("1.8%"),
    color: "#909091",
    marginLeft: hp("3.5%"),

    fontWeight: "500"
  },

  pencilBtnStyle: {
    height: wp("6%"),
    width: wp("6%")
  },
  addUnitButton: {
    width: wp("20%"),
    height: hp("3.6%"),
    borderRadius: hp("2%"),
    //borderWidth: hp("0.2%"),
    borderColor: "orange",
    backgroundColor: "orange",
    justifyContent: "center"
  },
  addUnitText: {
    color: "white",
    fontWeight: "700",
    fontSize: hp("1.6%")
  }
})

const mapStateToProps = state => {
    return {
      champBaseURL: state.OyespaceReducer.champBaseURL,
      SelectedAssociationID: state.UserReducer.SelectedAssociationID,
      MyAccountID: state.UserReducer.MyAccountID,
      oyeURL: state.OyespaceReducer.oyeURL  
    };
  };
  
  export default connect(mapStateToProps)(BlockDetail);
  