/*
 * @Author: Sarthak Mishra 
 * @Date: 2020-03-09 16:13:08 
 * @Last Modified by: Sarthak Mishra
 * @Last Modified time: 2020-03-12 17:33:32
 */


import React, { Component } from 'react';
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native'
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
        console.log('Hittin:')
        const { updateNotificationData } = this.props;
        updateNotificationData(true);
    }


    render() {
        let isNotification = this.props.isNotificationUnRead;
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', height: hp('100'), width: wp('90'), position: 'absolute' }}>
                <Dialog
                    width={wp('90')}
                    dialogStyle={{borderTopRightRadius:hp('2'),borderTopLeftRadius:hp('2')}}
                    visible={!isNotification}
                >
                    <DialogContent style={{justifyContent:'center',alignItems:'center'}} >
                        <LinearGradient
                            colors={['#ff8c00', '#ffaf4d']}
                            style={styles.gradientHeader}>
                            <Text allowFontScaling={false} style={styles.headerText}> Request to join Unit J102 as tenant</Text>
                        </LinearGradient>
                        <View style={styles.contentArea}>
                            <View style={styles.associationView}>
                                <Text allowFontScaling={false} style={styles.associationText}> Ajmera Association</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: wp('88'), alignSelf: 'center' }}>
                                <Text allowFontScaling={false} style={{ fontSize: hp('1.5'), color: '#000', textAlign: 'center' }}> Current Owner:<Text>Jyothi Menda</Text></Text>
                                <TouchableHighlight onPress={this.updateNotificationState()}
                                    style={{ borderWidth: 1 }}>
                                    <Text allowFontScaling={false} style={{ fontSize: hp('1.5'), color: '#000', textAlign: 'center' }}> Ajmera Association</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </DialogContent>

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