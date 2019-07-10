/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */


import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View,Platform} from 'react-native';
import PropTypes from 'prop-types';
import base from "../../base";
import EmptyView from "../common/EmptyView";


export default class PatrollingCommonHeader extends React.Component {
    constructor(props) {
        super(props);
    }


    static propTypes = {
        isHidden: PropTypes.bool,
        isReportVisible: PropTypes.bool
    };

    static defaultProps = {
        isHidden: false,
        isReportVisible: true
    };

    render() {
        console.log("PatrollingHeader", this.props)

        console.log(this.props);
        let isHidden = this.props.isHidden;
        let isReportVisible = this.props.isReportVisible;
        const {goBack} = this.props.navigation;
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => goBack(null)}   //Passing null for as a parameter in the case of nested StackNavigators   --Sarthak Mishra(Synclovis Systems Pvt. Ltd.)
                    style={styles.buttonView}>
                    <Image
                        resizeMode={'center'}
                        style={styles.backButton}
                        source={require('../../../icons/arrowBack.png')}
                    />
                </TouchableOpacity>
                <View style={styles.logoView}>
                    <Image
                        resizeMode={'center'}
                        style={styles.logo}
                        source={require('../../../icons/headerLogo.png')}
                    />
                </View>
                {!isHidden ?
                    isReportVisible ?
                        <View style={{
                            borderWidth: 1,
                            height: "40%",
                            alignSelf: 'center',
                            width: "25%",
                            borderRadius: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: 'orange'
                        }}>
                            <Text style={{
                                color: 'orange',
                                textAlign: 'center',
                                fontFamily: base.theme.fonts.bold
                            }}>Schedule</Text>
                        </View>
                        : <Image source={require('../../../icons/reload.png')}/>
                    : <EmptyView width={"20%"}/>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: "10%",
        width: "100%",
        backgroundColor: "white",
        //borderWidth: 1,
        borderColor: "orange",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop:Platform.OS === 'ios'?20:0,
        borderBottomWidth:1
    },
    buttonView: {
        width: "17%",
        justifyContent: 'flex-end',
        height: "50%"
    },
    backButton: {
        alignSelf: 'center',
        height: "50%"
    },
    logoView: {
        width: "65%",
        justifyContent: 'flex-end',
        paddingTop: 10
    },
    logo: {
        alignSelf: 'center',
        height: '120%',
    }
});