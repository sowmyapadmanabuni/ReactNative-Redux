import React, { PureComponent } from 'react';
import {View, Text, NetInfo, Dimensions, StyleSheet, Platform} from 'react-native';
import base from "../index";

const { width } = Dimensions.get('window');

function MiniOfflineSign() {
    return (
        <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>No Internet Connection</Text>
        </View>
    );
}

class CheckInternet extends PureComponent {
    state = {
        isConnected: true
    };

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    handleConnectivityChange = isConnected => {
        if (isConnected) {
            this.setState({ isConnected });
        } else {
            this.setState({ isConnected });
        }
    };

    render() {
        console.log('Is Internet connected',this.state.isConnected)
        if (!this.state.isConnected) {
            return <MiniOfflineSign />;
        }
        else{
            return null;
        }
    }
}

const styles = StyleSheet.create({
    offlineContainer: {
        backgroundColor:base.theme.colors.primary,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width,
        marginTop:Platform.OS==='ios' ? 20:0
    },
    offlineText: { color: '#fff' }
});

export default CheckInternet;