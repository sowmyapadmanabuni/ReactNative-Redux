/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-07-08
 */

import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import base from "../../base";
import QRCode from 'react-native-qrcode-svg';
import EmptyView from "../../components/common/EmptyView";
import {updateQRBase64} from '../../../src/actions';
import {connect} from 'react-redux';
import QRScreenStyles from "./QRScreenStyles";


class QRScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            latLong: '0000',
            qrBase64: ''
        };
    }

    componentWillMount() {
        this.setState({
            latLong: this.props.navigation.state.params.latLongData
        }, () => this.handlePress())
    }

    updateStore() {
        const {updateQRBase64} = this.props;
        updateQRBase64({value: this.state.qrBase64})
    }

    handlePress = () => {
        let self = this;
        self.qrcode.toDataURL((data) => {
            self.setState({
                qrBase64: data
            }, () => self.updateStore())
        });
    };

    render() {
        return (
            <View style={QRScreenStyles.container}>
                <View style={QRScreenStyles.header}>
                    <Text
                        style={QRScreenStyles.headerText}>Patrolling Check Points QR Code</Text>
                </View>
                <View style={QRScreenStyles.qrView}>
                    <QRCode
                        value={this.state.latLong}
                        logo={require('../../../icons/headerLogo.png')}
                        getRef={(c) => (this.qrcode = c)}
                        size={200}
                        logoSize={50}
                    />
                </View>
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
        patrollingReducer: state.PatrollingReducer
    }
};


export default connect(mapStateToProps, {updateQRBase64})(QRScreen);
