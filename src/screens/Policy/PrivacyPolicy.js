import React from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions,
    TouchableHighlight,
    FlatList, Platform,
    WebView, BackHandler
} from 'react-native';



const {width, height} = Dimensions.get('window');

class PrivacyPolicy extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        BackHandler.addEventListener("hardwareBackPress", () => {
            this.goBack();
            return true;
        })
    }

    goBack() {
        this.props.navigation.goBack();
    }


    render() {
        return (
            <WebView
                source={{uri:"https://www.oyespace.com/privacy"}}
                style={{height: height, width: width}}
            />
        )
    }


}

export default PrivacyPolicy;