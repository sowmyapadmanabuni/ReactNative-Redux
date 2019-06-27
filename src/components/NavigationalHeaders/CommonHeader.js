/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */


import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import base from "../../base";




export default class CommonHeader extends React.Component {
    constructor(props) {
        super(props);
        console.log("ldksnvifhkjv",this.props)
    }

    static propTypes = {
       isHidden:PropTypes.bool
    }

    static defaultProps = {
        isHidden:false
    };

    render() {
        console.log(this.props);
        let isHidden = this.props.isHidden;
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate("AdminFunction")
                    }
                    style={{width: "17%", justifyContent: 'flex-end', height: "50%"}}>
                    <Image
                        resizeMode={'center'}
                        style={styles.backButton}
                        source={require('../../../icons/arrowBack.png')}
                    />
                </TouchableOpacity>
                <View style={{width: "60%", justifyContent: 'flex-end', paddingTop: 10}}>
                    <Image
                        resizeMode={'center'}
                        style={styles.logo}
                        source={require('../../../icons/headerLogo.png')}
                    />
                </View>
                {!isHidden?
                <View style={{
                    borderWidth: 1,
                    height: "30%",
                    alignSelf: 'center',
                    width: "20%",
                    borderRadius: 10,
                    marginTop: '1%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: 'orange'
                }}>
                    <Text style={{color: 'orange', textAlign: 'center',fontFamily:base.theme.fonts.bold}}>Schedule</Text>
                </View>:<View style={{width: "20%",}}/>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: "12%",
        width: "100%",
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "orange",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    backButton: {
        alignSelf: 'center',
        height: "50%"
    },
    logo: {
        alignSelf: 'center',
        height: '75%',
    }
});