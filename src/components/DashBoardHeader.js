import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, StatusBar, Platform, StatusBarIOS, Image} from 'react-native';
import base from '../base';
import {connect} from "react-redux";


class DashBoardHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.viewImageURL +
            "PERSON" +
            this.props.MyAccountID +
            ".jpg" +
            "?random_number=" +
            new Date().getTime())
        //{this.props.userName}
        //{this.props.userStatus}
        return (
            <View style={styles.container}>
                <View style={styles.subContainerLeft}>
                    <TouchableOpacity>
                        <Image style={styles.imageStyles}
                               source={require("../../icons/user.png")}>
                        </Image>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={styles.textContainer}>
                            <Text style={styles.residentName}
                                  numberOfLines={1}>Jyothi</Text>
                            <Text style={styles.statusText}
                                  numberOfLines={1}>Owener</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.subContainerRight}>
                    <Image style={styles.appLogoStyles}
                           source={require("../../icons/headerLogo.png")}>
                    </Image>
                </View>
                <View style={styles.subContainerRight}>
                    <TouchableOpacity>
                        <Image style={styles.logoStyles}
                               source={require("../../icons/notifications.png")}>
                        </Image>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 70,
        width: '100%',
        backgroundColor: base.theme.colors.white,
        borderBottomWidth: 2,
        borderBottomColor: base.theme.colors.primary,
        marginTop: Platform.OS === 'ios' ? 20 : 0,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    subContainerLeft: {
        height: 60,
        width: "30%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: 10
    },
    subContainerRight: {
        height: 60,
        width: "20%",
        backgroundColor: base.theme.colors.white,
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginRight: 20

    },
    textContainer: {
        marginLeft: 5,
    },
    residentName: {
        fontSize: 14,
        color: base.theme.colors.black,
        // fontFamily:base.theme.fonts.bold
    },
    imageStyles: {
        height: 25,
        width: 25,
        borderRadius: 25 / 2
    },
    logoStyles: {
        height: 40,
        width: 40,
        alignSelf: 'center'
    },
    notifIconStyles: {
        height: 40,
        width: 40,
    },
    statusText: {
        fontSize: 10,
        color: base.theme.colors.black,
        //fontFamily:"HelveticaNeue-Bold"
    },
    appLogoStyles: {
        height: 60,
        width: 60,
        alignSelf: 'center'
    }


});

const mapStateToProps = state => {
    return {
        OyespaceReducer: state.OyespaceReducer,
        oyeURL: state.OyespaceReducer.oyeURL,
        MyAccountID: state.UserReducer.MyAccountID,
        MyFirstName: state.UserReducer.MyFirstName,
        viewImageURL: state.OyespaceReducer.viewImageURL
    };
};

export default connect(mapStateToProps)(DashBoardHeader)