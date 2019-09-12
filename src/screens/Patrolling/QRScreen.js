/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-07-08
 */

import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View,Image,BackHandler} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import base from "../../base";
import QRCode from 'react-native-qrcode-svg';
import EmptyView from "../../components/common/EmptyView";
import {updateQRBase64} from '../../../src/actions';
import {connect} from 'react-redux';
import QRScreenStyles from "./QRScreenStyles";
import ViewShot, { captureRef, captureScreen } from "react-native-view-shot";
import RNFS from "react-native-fs";
const catsSource = {
    uri: "https://i.imgur.com/5EOyTDQ.jpg"
};



class QRScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            latLong: '0000',
            qrBase64: '',
            error: null,
            res: null,
            imageURI: "",
            cpName:"",
            value: {
                format: "png",
                quality: 0.9,
                result: "tmpfile",
                snapshotContentContainer: false
            },
            previewSource: catsSource,
        };
    }

    componentWillMount() {
        console.log("DATA For QR:",this.props)
        let splitData = this.props.navigation.state.params.dataToBeSent.split(",");
        console.log("Split Data:",splitData)

        this.setState({
            cpName:splitData[0],
            latLong: this.props.navigation.state.params.dataToBeSent
        })
    }


    takeScreenShot = refname => {
        const { params } = this.props.navigation.state;
        (refname
                ? captureRef(this.refs[qrdata], this.state.value)
                :
                //captureScreen(this.state.value)
                console.log("htiing")
        )
            .then(
                res =>
                    this.state.value.result !== "tmpfile"
                        ? res
                        : new Promise((success, failure) =>
                            // just a test to ensure res can be used in Image.getSize
                            Image.getSize(
                                res,
                                (width, height) => (
                                    console.log(res, width, height), success(res)
                                ),
                                failure
                            )
                        )
            )
            .then(
                //callback function to get the result URL of the screnshot
                uri => {
                    this.setState({ imageURI: uri }),
                        RNFS.readFile(this.state.imageURI, "base64").then(data => {
                            // binary data
                            console.log("data base64 " + data,uri);
                            this.setState({ qrBase64: data });
                            this.updateStore();

                        });
                },
                error => {
                    console.error("Oops, Something Went Wrong", error),
                        console.log("error uploadImage ", error);
                }
            );
    };

    componentDidMount () {
        this.refs.viewShot.capture().then(uri => {
            console.log("do something with ", uri);
            this.setState({ imageURI: uri }),
                RNFS.readFile(this.state.imageURI, "base64").then(data => {
                    // binary data
                    console.log("data base64 " + data,uri);
                    this.setState({ qrBase64: data });
                    this.updateStore();

                });
        });
    }



    updateStore() {
        const {updateQRBase64} = this.props;
        updateQRBase64({value: this.state.qrBase64})
    }


    render() {
        return (
            <View style={QRScreenStyles.container}>
                <View style={QRScreenStyles.header}>
                    <Text
                        style={QRScreenStyles.headerText}>Patrolling Check Points QR Code</Text>
                </View>
                <ViewShot ref="viewShot" style={{backgroundColor:"white"}} options={{ format: "jpg", quality: 0.9 }}>
                    <View  style={QRScreenStyles.qrView}>
                        <QRCode
                            value={this.state.latLong}
                            logo={require('../../../icons/headerLogo.png')}
                            // getRef={(c) => (this.qrcode = c)}
                            size={200}
                            logoSize={50}
                        />
                    </View>
                    <Text style={{alignSelf:'center',marginTop:10,fontFamily:base.theme.fonts.bold,color:base.theme.colors.black}}>
                        Association Name : {this.props.dashboardReducer.selectedDropdown}
                    </Text>
                    <Text style={{alignSelf:'center',marginTop:10-3 ,fontFamily:base.theme.fonts.bold,color:base.theme.colors.black}}>
                        Check Point Name : {this.state.cpName}
                    </Text>
                </ViewShot>
                <EmptyView height={30}/>
                <TouchableHighlight
                    underlayColor={base.theme.colors.transparent}
                    onPress={() => this.props.navigation.goBack(null)}
                    style={QRScreenStyles.cpTextView}>
                    <Text style={QRScreenStyles.cpTextStyle}>Patrolling Check Points QR Code</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        patrollingReducer: state.PatrollingReducer,
        dashboardReducer : state.DashboardReducer
    }
};


export default connect(mapStateToProps, {updateQRBase64})(QRScreen);
