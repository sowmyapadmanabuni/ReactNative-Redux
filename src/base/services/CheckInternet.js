import React, {PureComponent} from 'react';
import {Dimensions, Platform, StyleSheet, Text, View} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import base from "../index";
import {updateIdDashboard} from "../../actions";
import {connect} from "react-redux";

const {width} = Dimensions.get('window');

function MiniOfflineSign() {
    return (
        <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>No Internet Connection</Text>
        </View>
    );
}

class CheckInternet extends PureComponent {
    constructor(props) {
        super(props);
        this.props = props;
    
        this.state = {
            isConnected: true
        }
    }
    

    componentDidMount() {
        //NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            this.setState({
                isConnected:state.isConnected
            })
            const { updateIdDashboard } = this.props;
        updateIdDashboard({
            prop: 'isInternetConnected',
            value: state.isConnected
        });
        });
    }

    componentWillUnmount() {
        //NetInfo.removeEventListener(state);
    }

    handleConnectivityChange = isConnected => {
        console.log('GET THE CHAGE LOG',isConnected)
        if (isConnected) {
            this.setState({isConnected});
        } else {
            this.setState({isConnected});
        }
        const { updateIdDashboard } = this.props;
        updateIdDashboard({
            prop: 'isInternetConnected',
            value: isConnected
        });

    };

    render() {
        console.log('Is Internet connected', this.state.isConnected);
        if (!this.state.isConnected) {
            return <MiniOfflineSign/>;
        } else {
            return null;
        }
    }
}

const styles = StyleSheet.create({
    offlineContainer: {
        backgroundColor: base.theme.colors.themeColor,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width,
        marginTop: Platform.OS === 'ios' ? 20 : 0
    },
    offlineText: {color: '#fff'}
});

const mapStateToProps = state => {
    return {
        dashBoardReducer: state.DashboardReducer
    }
};


export default connect(mapStateToProps,{updateIdDashboard})(CheckInternet);
