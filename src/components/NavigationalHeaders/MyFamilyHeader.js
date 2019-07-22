/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */


import React from 'react';
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import base from "../../base";
import {widthPercentageToDP} from "react-native-responsive-screen";
import {connect} from 'react-redux';


class MyFamilyHeader extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        const {goBack} = this.props.navigation;
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => goBack(null)}
                    style={styles.buttonView}>
                    <Image
                        resizeMode={'center'}
                        style={styles.backButton}
                        source={require('../../../icons/arrowBack.png')}
                    />
                </TouchableOpacity>
                <View style={styles.logoView}>
                    <Image
                        resizeMode={'cover'}
                        style={styles.logo}
                        source={require('../../../icons/headerLogo.png')}
                    />
                </View>

                <TouchableOpacity onPress={() => this.onNextButtonClick()}
                                          style={styles.scheduleReport}>
                            <Text style={styles.scheduleTextStyle}>Next</Text>
                </TouchableOpacity>
            </View>
        )
    }
    onNextButtonClick() {
       console.log('NextButtonClick',this.props)
    }

}

const styles = StyleSheet.create({
    container: {
        height: "8%",
        width: "100%",
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderColor: "orange",
        flexDirection: 'row',
        alignItems: 'center',
        //justifyContent: 'center',
        paddingLeft: 10,
        marginTop: Platform.OS === 'ios' ? 20 : 0
    },
    buttonView: {
        width: "17%",
        justifyContent: 'center',
        height: "90%",
        paddingTop: 3
    },
    backButton: {
        height: "50%"
    },
    logoView: {
        height: 40,
        width: widthPercentageToDP('60%'),
        backgroundColor: base.theme.colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20
    },
    logo: {
        height: 50,
        width: 100,
        alignSelf: 'center'
    },
    scheduleReport: {
        borderWidth: 1,
        height: "40%",
        width: widthPercentageToDP("15%"),
        borderRadius: 10,
        marginRight: widthPercentageToDP('35%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'orange'
    },
    scheduleTextStyle: {
        color: 'orange',
        textAlign: 'center',
        width: widthPercentageToDP('20%'),
        fontFamily: base.theme.fonts.medium
    },
    reportImage: {height: "50%",width: widthPercentageToDP("20%")}
});


const mapStateToProps = state => {
    return {
        //selectedCheckPoints: state.PatrollingReducer
    }
};

export default connect(mapStateToProps)(MyFamilyHeader);

