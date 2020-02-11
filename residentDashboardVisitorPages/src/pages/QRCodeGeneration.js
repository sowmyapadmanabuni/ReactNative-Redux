import React, { Component } from 'react';
import {
  Platform,
  AppRegistry,
  View,
  StyleSheet,
  Text,
  Clipboard,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  ScrollView,
  TouchableHighlight
} from 'react-native';
// import Header from './src/components/common/Header'
import { QRCode } from 'react-native-custom-qr-codes';
import { NavigationEvents } from 'react-navigation';
import Share, { ShareSheet, Button } from 'react-native-share';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import RNFS from 'react-native-fs';
import { captureRef, captureScreen } from 'react-native-view-shot';
import { connect } from 'react-redux';
import base from "../../../src/base";

const catsSource = {
  uri: 'https://i.imgur.com/5EOyTDQ.jpg'
};

class QRCodeGeneration extends Component {
  static navigationOptions = {
    title: 'QRCodeGeneration',
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      qrText: 'initial_qr',
      visible: false,
      qrShare: 'initial_share',
      imageURI: '',
      dataBase64: '',
      association: '',
      value: {
        format: 'png',
        quality: 0.9,
        result: 'data-uri',
        snapshotContentContainer: false
      },
      previewSource: catsSource,
      error: null,
      res: null,
      isCapturing: false
    };
  }

  componentDidMount() {
    base.utils.validate.checkSubscription(this.props.userReducer.SelectedAssociationID)
    this.associationName();
    this.qrGeneration();
  }
  onCancel() {
    console.log('CANCEL');
    this.setState({ visible: false });
  }
  onOpen() {
    console.log('OPEN');
    this.setState({ visible: true });
  }

  qrGeneration = () => {
    const { params } = this.props.navigation.state;
    console.log('Params@!@#!@#!@#', params);
    /*{"infName":"Vinay",
    "inMobile":"7975536425",
    "inInvtID":4261,"unUnitID":40851,
    "insDate":"2020-02-05T06:22:04",
    "ineDate":"2020-02-19T06:22:04",
    "inVisCnt":2,"asAssnID":14948,
    "inIsActive":true*/
    let input={
      "infName":params.value.infName,
      "inMobile":params.value.inMobile.substring(3, 13),
      "inInvtID":params.value.inInvtID,
      "unUnitID":params.value.unUnitID,
      "insDate":params.value.insDate.substring(0, 10),
      "ineDate":params.value.ineDate.substring(0, 10),
      "inVisCnt":params.value.inVisCnt,
      "asAssnID":params.value.asAssnID,
      "inIsActive":params.value.inMultiEy
    }
    // let txt = params.value.inInvtID + params.value.meMemID + params.value.unUnitID+params.value.infName+params.value.inlName+params.value.asAssnID
    //   +params.value.inEmail+params.value.inMobile+params.value.inMultiEy+params.value.inpOfInv +params.value.inVchlNo+params.value.inVisCnt+params.value.insDate+params.value.ineDate;
    let txt =
      params.value.infName +
      ',' +
      params.value.inMobile.substring(0, 3) +
      ',' +
      params.value.inMobile.substring(3, 13) +
      ',' +
      params.value.inInvtID +
      ',' +
      params.value.unUnitID +
      ',' +
      ',' +
      params.value.insDate.substring(0, 10) +
      ',' +
      params.value.insDate.substring(11, 16) +
      ',,' +
      params.value.inVisCnt +
      ',' +
      params.value.ineDate.substring(0, 10) +
      ',' +
      params.value.asAssnID +
      ',' +
      params.value.inMultiEy;

    let txt1 =
      params.value.infName +
      ',' +
      params.value.inMobile.substring(0, 3) +
      ',' +
      params.value.inMobile.substring(3, 13) +
      ',' +
      params.value.inInvtID;
    ',' +
      params.value.unUnitID +
      ',' +
      ',' +
      params.value.insDate.substring(0, 10) +
      ',' +
      params.value.insDate.substring(11, 16) +
      ',,' +
      params.value.inVisCnt +
      ',' +
      params.value.ineDate.substring(0, 10) +
      ',' +
      params.value.asAssnID +
      ',' +
      params.value.inMultiEy;
    console.log('Share QR code',txt,txt1,input,JSON.stringify(input))
    this.setState({
      qrText: JSON.stringify(input),
      qrShare: JSON.stringify(input)
    });
    console.log(txt);
  };

  takeScreenShot = () => {
    const { params } = this.props.navigation.state;
    captureScreen({
      format: 'jpg',
      quality: 0.8
    }).then(
      //callback function to get the result URL of the screnshot
      uri => {
        this.setState({ imageURI: uri }),
          RNFS.readFile(this.state.imageURI, 'base64').then(data => {
            // binary data
            console.log('data base64 ' + data);
            this.setState({ dataBase64: data });
            let shareImagesBase64 = {
              title: 'Invitation',
              message:
                params.value.infName +
                ' invites you to ' + //global.AssociationUnitName + ' in ' +
                // params.value.asAssnID
                this.state.association +
                ' for ' +
                params.value.inpOfInv +
                ' on ' +
                params.value.insDate.substring(0, 10) +
                ' at ' +
                params.value.insDate.substring(11, 16) +
                '  ',
              url: 'data:image/png;base64,' + this.state.dataBase64,
              subject: 'Share Invitation' //  for email
            };
            Share.open(shareImagesBase64);
          });
      },
      error => {
        console.error('Oops, Something Went Wrong', error),
          console.log('error uploadImage ', error);
      }
    );
  };

  associationName = () => {
    fetch(
      `http://${this.props.oyeURL}/oyeliving/api/v1/association/getAssociationList/${this.props.dashBoardReducer.assId}`,
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
        this.setState({
          association: responseJson.data.association.asAsnName
        });
        console.log('!@#!@#!@$@#%@#$!@$@$!@$!@', this.state.association);
      })
      .catch(error => console.log(error));
  };

  snapshot = refname => () =>
    (refname
      ? captureRef(this.refs[refname], this.state.value)
      : captureScreen(this.state.value)
    )
      .then(
        res =>
          new Promise((success, failure) =>
            Image.getSize(
              res,
              (width, height) => (
                console.log(res, width, height), success(res)
              ),
              failure
            )
          )
      )
      .then(res =>
        this.setState(
          {
            error: null,
            res,
            previewSource: {
              uri:
                this.state.value.result === 'base64'
                  ? 'data:image/' + this.state.value.format + ';base64,' + res
                  : res
            }
          },
          () => this.share()
        )
      )
      .catch(
        error => (
          console.warn(error),
          this.setState({ error, res: null, previewSource: null })
        )
      );

  share() {
    const { params } = this.props.navigation.state;
    console.log('Params:', params);
    let sharingDetail = {
      title: 'Invitation',
      // message:
      //     params.value.infName +
      //     " invites you to " + //global.AssociationUnitName + ' in ' +
      //     // params.value.asAssnID
      //     this.state.association +
      //     " for " +
      //     params.value.inpOfInv +
      //     " on " +
      //     params.value.insDate.substring(0, 10) +
      //     " at " +
      //     params.value.insDate.substring(11, 16) +
      //     "  ",
      url: this.state.previewSource.uri
    };
    console.log('Sharing data:', sharingDetail);
    Share.open(sharingDetail).then(response => {
      console.log(response);
    });
  }

  render() {
    const { params } = this.props.navigation.state;
    let shareOptions = {
      title: 'Invitation',
      message: this.state.qrShare,
      // url: "http://facebook.github.io/react-native/",
      subject: 'Welcome' //  for email
    };

    let wholeData =
      params.value.infName +
      ' invites you to ' + //global.AssociationUnitName + ' in ' +
      params.value.asAssnID +
      ' for ' +
      params.value.inpOfInv +
      ' on ' +
      params.value.insDate.substring(0, 10) +
      ' at ' +
      params.value.insDate.substring(11, 16);
    // this.setState({dataBase64: wholeData})
    let shareImageBase64 = {
      title: 'Invitation',
      message:
        params.value.infName +
        ' invites you to ' + //global.AssociationUnitName + ' in ' +
        params.value.asAssnID +
        ' for ' +
        params.value.inpOfInv +
        ' on ' +
        params.value.insDate.substring(0, 10) +
        ' at ' +
        params.value.insDate.substring(11, 16) +
        '  ',
      url: 'data:image/png;base64,' + '',
      subject: 'Share Invitation' //  for email
    };

    if (this.state.isLoading) {
      return (
        <View style={styles.contaianer}>
          {/* <Header/> */}
          {/* <SafeAreaView style={{ backgroundColor: "orange" }}>
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
                          alignItems: "flex-start",
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
                </View>
              </View>
              <View style={{ borderWidth: 1, borderColor: "orange" }} />
            </SafeAreaView> */}

          <Text style={styles.titleOfScreen}>QR Code Generation </Text>
          <View style={styles.progress}>
            <ActivityIndicator size="large" color="#F3B431" />
          </View>
        </View>
      );
    }
    console.log('Complete QRText Data -', this.state.qrText);
    return (
      <View style={{ flex: 1 }}>
        {/* <Header/> */}
        <ScrollView>
          {/* <SafeAreaView style={{ backgroundColor: "orange" }}>
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
                          alignItems: "flex-start",
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
                </View>
              </View>
              <View style={{ borderWidth: 1, borderColor: "orange" }} />
            </SafeAreaView> */}

          <NavigationEvents
            onWillFocus={payload => this.qrGeneration()}
            // onWillBlur={payload => this.getInvitationList()}
          />
          <Text style={styles.titleOfScreen}>Share QR Code</Text>
          {/* <Text>{this.state.qrShare}</Text> */}

          <View
            ref="View"
            style={{
              flex: 1,
              backgroundColor: '#F4F4F4',
              flexDirection: 'column'
            }}
          >
            <View
              style={{
                flexDirection: 'column',
                marginTop: hp('2%'),
                backgroundColor: '#fff',
                height: hp('16%')
              }}
            >
              <View
                style={{ flexDirection: 'row', flex: 1, marginTop: hp('1.4%') }}
              >
                <View style={{ width: '40%', marginLeft: hp('2%') }}>
                  <Text style={{ color: 'grey' }}>Association Name</Text>
                </View>
                <View style={{ height: '100%', width: '55%' }}>
                  <Text
                    style={{ color: 'black', fontWeight: '500' }}
                    numberOfLines={1}
                  >
                    {this.state.association === ''
                      ? ''
                      : this.state.association}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={{ width: '40%', marginLeft: hp('2%') }}>
                  <Text style={{ color: 'grey' }}>Purpose of Visit</Text>
                </View>
                <View style={{ height: '100%', width: '55%' }}>
                  <Text
                    style={{ color: 'black', fontWeight: '500' }}
                    numberOfLines={1}
                  >
                    {this.props.navigation.state.params.value.inpOfInv}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={{ width: '40%', marginLeft: hp('2%') }}>
                  <Text style={{ color: 'grey' }}>Invited On</Text>
                </View>
                <View style={{ height: '100%', width: '55%' }}>
                  <Text style={{ color: '#38BCDB', fontWeight: '500' }}>
                    {this.props.navigation.state.params.value.insDate.substring(
                      0,
                      10
                    )}{' '}
                    {this.props.navigation.state.params.value.insDate.substring(
                      11,
                      16
                    )}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', flex: 1 }}>
                {this.props.navigation.state.params.value.inVisCnt === 1 ? (
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ width: '40%', marginLeft: hp('2%') }}>
                      <Text style={{ color: 'grey' }}>Total Guest</Text>
                    </View>
                    <View style={{ height: '100%', width: '55%' }}>
                      <Text style={{ color: 'black', fontWeight: '500' }}>
                        {' '}
                        {this.props.navigation.state.params.value.inVisCnt}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 0.9, marginLeft: hp('2%') }}>
                      <Text style={{ color: 'grey' }}>Total Guests</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: 'black', fontWeight: '500' }}>
                        {this.props.navigation.state.params.value.inVisCnt}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* <View style={{ flexDirection: "row", flex: 1 }}>
                  <View style={{ flex: 0.9,marginLeft:hp('2%')  }}>
                    <Text style={{color:'grey'}}>Message</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{color:'black',fontWeight:'500'}}>
                            {params.value.infName} invites you to {params.value.asAssnID} for {params.value.inpOfInv} on {params.value.insDate.substring(0, 10)} at {params.value.insDate.substring(11, 16)}
                    </Text>
                  </View>
                </View>
               */}
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: hp('3%')
              }}
            >
              <QRCode
                logo={require('../../../icons/oyesafe_qr_logo.png')}
                logoSize={hp('8%')}
                size={hp('20%')}
                content={this.state.qrText}
                codeStyle="square"
                outerEyeStyle="square"
                innerEyeStyle="square"
              />
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                marginBottom: hp('5%')
              }}
            >
              {/* <TouchableOpacity onPress={()=>{
          Share.open(shareImageBase64);
        }}>
          <View style={styles.instructions}>
            <Text>Simple Share Image Base 64</Text>
          </View>
        </TouchableOpacity> */}

              <TouchableOpacity onPress={this.snapshot('View')}>
                <View
                  style={{
                    borderRadius: hp('1%'),
                    borderWidth: hp('0.1%'),
                    width: wp('80%'),
                    height: hp('6%'),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: hp('5%'),
                    backgroundColor: '#fff',
                    borderColor: '#797979'
                  }}
                >
                  <Text
                    style={{
                      fontSize: hp('2.5%'),
                      color: '#797979',
                      fontWeight: '700'
                    }}
                  >
                    Share QR Code
                  </Text>
                </View>
              </TouchableOpacity>

              {/* <Button style={{marginTop:20}} full rounded onPress = {() => {Share.open(shareImageBase64)}}>
                <Text style={{color:'white',fontSize:24,fontWeight:'500'}}>Share</Text>
            </Button>
            <Button style={{marginTop:20}} full rounded onPress = {() => {Share.open(shareOptions)}}>
                <Text style={{color:'white',fontSize:24,fontWeight:'500'}}>Share</Text>
            </Button> */}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    oyeURL: state.OyespaceReducer.oyeURL,
    SelectedAssociationID: state.UserReducer.SelectedAssociationID,
    SelectedUnitID: state.UserReducer.SelectedUnitID,
    MyOYEMemberID: state.UserReducer.MyOYEMemberID,
    SelectedMemberID: state.UserReducer.SelectedMemberID,
    dashBoardReducer: state.DashboardReducer,
    userReducer: state.UserReducer

  };
};

const styles = StyleSheet.create({
  contaianer: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column'
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
  },
  image1: {
    width: wp('17%'),
    height: hp('12%'),
    marginRight: hp('3%')
  },

  progress: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listItem: {
    flexDirection: 'row',
    padding: 20
  },
  iconContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B83227',
    borderRadius: 100
  },
  contactIcon: {
    fontSize: 28,
    color: '#fff'
  },
  infoContainer: {
    flexDirection: 'column'
  },
  infoText: {
    fontSize: 16,
    fontWeight: '400',
    paddingLeft: 10,
    paddingTop: 2
  },

  titleOfScreen: {
    marginTop: hp('1.5%'),
    textAlign: 'center',
    fontSize: hp('2.4%'),
    fontWeight: 'bold',
    marginBottom: hp('1.5%'),
    color: '#ff8c00'
  },

  floatButton: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    position: 'absolute',
    bottom: 10,
    right: 10,
    height: 60,
    backgroundColor: '#FF8C00',
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
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default connect(mapStateToProps)(QRCodeGeneration);

const REACT_ICON =
  'data:image/png;base64,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';
