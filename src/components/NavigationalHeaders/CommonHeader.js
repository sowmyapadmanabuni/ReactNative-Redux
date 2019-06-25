/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */


import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';


export default class CommonHeader extends React.Component {
    constructor(props) {
        super(props);
        console.log("ldksnvifhkjv")
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{width: "17%", justifyContent: 'flex-end', height: "50%"}}>
                    <Image
                        resizeMode={'center'}
                        style={styles.backButton}
                        source={require('../../../icons/arrowBack.png')}
                    />
                </View>
                <View style={{width: "60%", justifyContent: 'flex-end', paddingTop: 10}}>
                    <Image
                        resizeMode={'center'}
                        style={styles.logo}
                        source={require('../../../icons/headerLogo.png')}
                    />
                </View>
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
                    <Text style={{color: 'orange',textAlign: 'center'}}>Schedule</Text>
                </View>
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
        justifyContent: 'center'
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