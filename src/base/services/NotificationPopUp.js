/*
 * @Author: Sarthak Mishra 
 * @Date: 2020-03-09 16:13:08 
 * @Last Modified by: Sarthak Mishra
 * @Last Modified time: 2020-03-16 17:03:04
 */


import React, { Component } from 'react';
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableHighlight, Image } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ElevatedView from 'react-native-elevated-view';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { updateNotificationData } from '../../actions';
import Dialog, { DialogContent } from 'react-native-popup-dialog';


class NotificationPopUp extends React.Component {
    constructor(props) {
        super(props);
    }

    updateNotificationState() {
        console.log('Hitting:')
        const { updateNotificationData } = this.props;
        // updateNotificationData(true);
    }


    render() {
        let isNotification = this.props.isNotificationUnRead;
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', height: hp('100'), width: wp('90') }}>
                <Dialog
                    width={wp('90')}
                    height={hp('40')}
                    dialogStyle={{ borderTopRightRadius: hp('2'), borderTopLeftRadius: hp('2') }}
                    visible={!isNotification}
                >
                    <DialogContent style={{ justifyContent: 'center', alignItems: 'center' }} >

                        <LinearGradient
                            colors={['#ff8c00', '#ffaf4d']}
                            style={styles.gradientHeader}>
                            <Text allowFontScaling={false} style={styles.headerText}> Request to join Unit J102 as tenant</Text>
                        </LinearGradient>

                        <View style={styles.contentArea}>
                            <View style={styles.associationView}>
                                <Text allowFontScaling={false} style={styles.associationText}> Ajmer Association</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: wp('85'), alignSelf: 'center', height: hp('7'), alignItems: 'center' }}>
                                <Text allowFontScaling={false} style={{ fontSize: hp('1.5'), color: '#000', textAlign: 'center' }}> Current Owner:<Text style={{ color: "#14C8E5" }}>Jyothi Menda</Text></Text>

                                <TouchableHighlight onPress={() => this.updateNotificationState()}>
                                    <Text allowFontScaling={false} style={{ fontSize: hp('1.5'), color: '#000', textAlign: 'center' }}> 25 mins ago</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={{ borderWidth: 1, width: hp('100'), borderColor: '#e2e2e2' }} />
                            <View style={{
                                width: wp('10%'),
                                height: hp('12%'),
                                justifyContent: 'center',
                                alignSelf: 'center', bottom: hp('6'), borderWidth: 0
                            }}>
                                <Image
                                    resizeMode={'center'}
                                    style={{
                                        borderWidth: 0,
                                        width: wp('15%'),
                                        height: hp('15%'),
                                    }}
                                    source={require('../../../icons/img.png')}
                                />
                                <View style={{ width: wp('50'), height: hp('0'), borderWidth: 0, alignSelf: 'center', left: hp('1'), alignItems: 'center', justifyContent: 'center' }}>
                                    <Text numberOfLines={1} style={{ color: '#333333', textAlign: 'center' }}>Aditya Sharma</Text>
                                    <Text style={{ color: '#ff8c00', textAlign: 'center', fontSize: hp('1.5') }}>+919742202320</Text>
                                </View>
                            </View>
                        </View>
                    </DialogContent>

                    <Image
                        resizeMode={'center'}
                        style={{
                            position: 'absolute',
                            borderWidth: 0,
                            width: wp('8%'),
                            height: hp('8%'),
                            tintColor: 'red',
                            alignSelf: 'flex-end',
                            bottom: hp('33.5')
                        }}
                        source={require('../../../icons/close_btn1.png')}
                    />
                    <View style={{ height: hp('8'), width: wp('90'), backgroundColor: '#F0F0F0', bottom: hp('5'), borderTopRightRadius: hp('2'), borderTopLeftRadius: hp('2'), flexDirection: 'row' }}>
                        <View style={{ height: hp('8'), width: wp('45'), bottom: hp('1'), flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Image
                                resizeMode={'center'}
                                style={{
                                    borderWidth: 0,
                                    width: wp('5%'),
                                    height: hp('5%'),
                                    marginLeft: hp('2')
                                }}
                                source={require('../../../icons/police.png')}
                            />
                            <Text style={{ color: '#14C8E5', textAlign: 'center', fontSize: hp('1.5') }}> Leave With Guard</Text>
                        </View>
                        <View style={{ height: hp('8'), width: wp('45'), bottom: hp('1'), borderWidth: 0, flexDirection: 'row', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                resizeMode={'center'}
                                style={{
                                    borderWidth: 0,
                                    width: wp('6%'),
                                    height: hp('6%'),
                                    marginLeft: hp('2')
                                }}
                                source={require('../../../icons/allow_1.png')}
                            />
                            <Text style={{ color: 'green', textAlign: 'center', fontSize: hp('2') }}> Allow</Text>
                            <Image
                                resizeMode={'center'}
                                style={{
                                    borderWidth: 0,
                                    width: wp('6%'),
                                    height: hp('6%'),
                                    marginLeft: hp('2'),
                                    tintColor: 'red'
                                }}
                                source={require('../../../icons/close_btn1.png')}
                            />
                            <Text style={{ color: 'red', textAlign: 'center', fontSize: hp('2') }}> Deny</Text>
                        </View>
                    </View>
                </Dialog>
            </View>
        )
    }

}


const styles = StyleSheet.create({
    container: {
        height: hp('35'), width: wp('90'),
        alignSelf: 'center',
        borderRadius: hp('2'), alignSelf: 'center', backgroundColor: '#fff'
    },
    gradientHeader: {
        height: hp('5'), width: wp('90'), borderTopRightRadius: hp('2'),
        borderTopLeftRadius: hp('2'), justifyContent: 'center', alignItems: 'center'
    },
    headerText: {
        fontSize: hp('2.2'), color: '#fff'
    },
    contentArea: {
        flexDirection: 'column',
        height: hp('30'),
        borderWidth: 0
    },
    associationView: { justifyContent: 'center', height: hp('5'), alignSelf: 'center' },
    associationText: { fontSize: hp('2.2'), color: '#000', textAlign: 'center' }
})

const mapStateToProps = state => {
    console.log('State in NotificationPopUp:', state);
    return {
        isNotificationUnRead: state.DashboardReducer.isNotification
    }
}



export default connect(mapStateToProps, { updateNotificationData })(NotificationPopUp);