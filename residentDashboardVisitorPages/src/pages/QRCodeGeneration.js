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
//import { QRCode } from 'react-native-custom-qr-codes';
import QRCode from 'react-native-qrcode-svg';

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
    base.utils.validate.checkSubscription(this.props.SelectedAssociationID)
    this.associationName();
   // this.qrGeneration();
  }
  onCancel() {
    console.log('CANCEL');
    this.setState({ visible: false });
  }
  onOpen() {
    console.log('OPEN');
    this.setState({ visible: true });
  }

  /*qrGeneration = () => {
    const { params } = this.props.navigation.state;
    console.log('Params@!@#!@#!@#', params);


    let txt ="{"+ "infName"+":"+ params.value.infName + ',' +
        "inMobile"+":"+ params.value.inMobile.substring(3, 13) + ',' +
        "inInvtID"+":"+params.value.inInvtID + ',' +
        "unUnitID"+":"+params.value.unUnitID + ',' +
        "insDate"+":" + params.value.insDate + ',' +
        "ineDate"+":"+params.value.ineDate + ',' +
        "inVisCnt"+":"+params.value.inVisCnt + ',' +
        "asAssnID"+":"+ params.value.asAssnID + ',' +
        "inIsActive"+":"+params.value.inMultiEy+"}";

    console.log('Share QR code',JSON.stringify(txt))
    this.setState({
      qrText: JSON.stringify(txt),
      qrShare: JSON.stringify(txt)
    });
  };*/

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
    console.log("QR Content:!!!!!", typeof (params.shareCode),params)



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
            <ActivityIndicator size="large" color="#B51414" />
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
           // onWillFocus={payload => this.qrGeneration()}
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
              {/*<QRCode
                logo={require('../../../icons/oyesafe_qr_logo.png')}
                logoSize={hp('8%')}
                size={hp('20%')}
                content={params.shareCode}
                codeStyle="square"
                outerEyeStyle="square"
                innerEyeStyle="square"
              />*/}
              <QRCode
                   logo={require('../../../icons/OyespaceSafe.png')}
                   logoSize={hp('6%')}
                   size={hp('25%')}
                  // logo={require('../../../icons/oyesafe_qr_logo.png')}
                  // logoSize={hp('5%')}
                  // size={hp('25%')}
                  value={params.shareCode}
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
    SelectedAssociationID: state.DashboardReducer.assId,
    SelectedUnitID: state.DashboardReducer.uniID,
    MyOYEMemberID: state.UserReducer.MyOYEMemberID,
    SelectedMemberID: state.UserReducer.SelectedMemberID,
    dashBoardReducer: state.DashboardReducer,
    userReducer: state.UserReducer,
    assId:state.DashboardReducer.assId ,
    uniID: state.DashboardReducer.uniID,

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

