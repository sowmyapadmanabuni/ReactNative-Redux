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


class QRScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            latLong: '0000',
            qrBase64: ''
        };
        console.log("Props:", props)
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
        console.log("DNKDVNDV:", this.props);
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text
                        style={styles.headerText}>Patrolling Check Points QR Code</Text>
                </View>
                <View style={styles.qrView}>
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
                    style={styles.cpTextView}>
                    <Text style={styles.cpTextStyle}>Patrolling Check Points QR Code</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: hp('100%'),
        width: wp("100%")
    },
    header: {
        alignItems: 'center',
        justifyContent: "center",
        height: "10%"
    },
    headerText: {
        fontSize: 15,
        fontFamily: base.theme.fonts.medium,
        color: base.theme.colors.primary
    },
    qrView: {
        justifyContent: 'center',
        alignSelf: 'center'
    },
    cpTextView: {
        borderWidth: 2,
        height: hp('8%'),
        width: wp('90%'),
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: base.theme.colors.grey
    },
    cpTextStyle: {
        color: base.theme.colors.grey,
        fontFamily: base.theme.fonts.bold
    }
});

const mapStateToProps = state => {
    return {
        patrollingReducer: state.PatrollingReducer
    }
};


export default connect(mapStateToProps, {updateQRBase64})(QRScreen);
