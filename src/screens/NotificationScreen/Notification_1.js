import React, { Component } from 'react';
import { View, SafeAreaView, Image, Text, StyleSheet, Dimensions, TouchableOpacity, TouchableHighlight, Platform, ImageBackground } from 'react-native';
import base from '../../base';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import ElevatedView from 'react-native-elevated-view';


export default class Notification_1 extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            headerText: "Notifications",
            selectedView: 0
        }
    }

    renderHeader() {
        return (
            <SafeAreaView style={{ backgroundColor: '#ff8c00' }}>
                <View style={[styles.viewStyle1, { flexDirection: 'row' }]}>
                    <View style={styles.viewDetails1}>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate('ResDashBoard');
                            }}
                        >
                            <View
                                style={{
                                    height: hp('4%'),
                                    width: wp('15%'),
                                    alignItems: 'flex-start',
                                    justifyContent: 'center'
                                }}
                            >
                                <Image
                                    resizeMode="contain"
                                    source={require('../../../icons/back.png')}
                                    style={styles.viewDetails2}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Image
                            style={[styles.image1]}
                            source={require('../../../icons/OyespaceSafe.png')}
                        />
                    </View>
                    <View style={{ flex: 0.2 }}></View>
                </View>
                <View style={{ borderWidth: 1, borderColor: '#ff8c00' }} />
            </SafeAreaView>
        )
    }

    setView(param) {
        this.setState({ selectedView: param })
    }


    renderAdminView() {
        let isAdmin = true;
        let selectedView = this.state.selectedView;

        return (
            <ImageBackground
                style={{ width: wp('100'), height: hp('105') }}
                source={selectedView === 0 ? require('../../../icons/myunit_notifn.png') : require('../../../icons/admin_notifn.png')}>
                <View style={{ flexDirection: 'row', top: hp('5'), justifyContent: 'space-between', width: wp('65'), alignSelf: 'center', borderWidth: 0, alignItems: 'center' }}>
                    <TouchableHighlight
                        underlayColor={'transparent'}
                        onPress={() => this.setView(0)}>
                        <View style={{ flexDirection: 'row', bottom: hp('2'), justifyContent: 'center', width: wp('25'), alignSelf: 'center', borderWidth: 0, alignItems: 'center' }}>
                            <Text>My Unit(s)</Text>
                            <Image
                                resizeMode={'center'}
                                style={{
                                    width: hp('10%'),
                                    height: hp('10%'),
                                }}
                                source={require('../../../icons/OyespaceSafe.png')}
                            />
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor={'transparent'}
                        onPress={() => this.setView(1)}>
                        <View style={{ flexDirection: 'row', bottom: hp('2'), justifyContent: 'center', width: wp('35'), alignSelf: 'center', borderWidth: 0, alignItems: 'center', left: hp('5') }}>
                            <Text>Admin</Text>
                            <Image
                                resizeMode={'center'}
                                style={{
                                    width: hp('8%'),
                                    height: hp('10%'), marginRight: hp('1')
                                }}
                                source={require('../../../icons/OyespaceSafe.png')}
                            />
                        </View>
                    </TouchableHighlight>
                </View>
            </ImageBackground>
        )
    }


    render() {

        return (
            <View style={{ flex: 1, backgroundColor: base.theme.colors.white }}>
                {this.renderHeader()}
                <View style={{ height: hp('7'), width: wp('100'), alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                    <Text allowFontScaling={false} style={{ fontFamily: base.theme.fonts.bold, color: base.theme.colors.primary }}>{this.state.headerText}</Text>
                </View>
                {this.renderAdminView()}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        width: '100%',
        height: '100%'
    },
    img: {
        width: hp('12%'),
        height: hp('12%'),
        borderColor: 'orange',
        borderRadius: hp('6%'),
        // marginTop: hp("3%"),
        borderWidth: hp('0.2%')
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
    image1: {
        width: wp('34%'),
        height: hp('18%'),
        marginRight: hp('3%')
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
    }
});

