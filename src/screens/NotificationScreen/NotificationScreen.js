import React, { Component } from 'react';
import { View, Image, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native';
import { connect } from 'react-redux';
import { ListItem, Header, Card } from 'react-native-elements'
import { onNotificationOpen, storeOpenedNotif } from '../../actions';
import TimeAgo from 'react-native-timeago';
import { Map } from 'immutable';
import _ from 'lodash';
// import console = require('console');

class NotificationScreen extends Component {
    keyExtractor = (item, index) => index.toString();

    onPress = (item, index) => {
        const { notifications, savedNoifId } = this.props;
        if(item.ntType === 'Join') {
            this.props.navigation.navigate('NotificationDetailScreen', {
                details: item
            })


           this.props.storeOpenedNotif(savedNoifId, item.ntid)
        }
    }

    renderItem = ({ item, index }) => {
        const { savedNoifId } = this.props;

        // console.log(item)
        // let subId = details.sbSubID;
        let status = _.includes(savedNoifId, item.ntid)
        console.log(this.props)
        console.log(status)
        return (
            <Card>
                <ListItem
                    onPress={() => this.onPress(item, index)}
                    // bottomDivider
                    title={item.ntType === 'Join' ? 'Request to Join' : 'Test' }
                    subtitle={item.ntDesc}
                    leftIcon={{
                        name:   !status ? 'ios-mail-unread' : 'mail-read',
                        type:  !status ? 'ionicon' : 'octicon',
                        color: '#ED8A19',
                    }}
                    containerStyle={!status ?
                        { backgroundColor: '#eee'} :
                        { backgroundColor: '#fff' }
                    }
                />
                <TimeAgo time={item.ntdUpdated} />
            </Card>
    )}

    onRefresh = () => {

    }

    renderComponent = () => {
        const { loading, isCreateLoading, notifications } = this.props;
        // console.log(loading)
        // console.log(isCreateLoading)
        if(loading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                    <ActivityIndicator />
                </View>
            )
        } else {
            return (
                <FlatList
                    keyExtractor={this.keyExtractor}
                    data={notifications}
                    renderItem={this.renderItem}
                    extraData={Map({
                        savedNoifId: this.props.savedNoifId,
                    })}
                />
            )
        }
    }

    render() {
        // console.log(global.MyAccountID)
        const { navigation, notifications } = this.props;
        const refresh = navigation.getParam('refresh', 'NO-ID');
        return (
            <View style={styles.container}>
                <Header 
                    leftComponent={{ 
                        icon:'arrow-left', 
                        color: '#ED8A19', 
                        type: "material-community",
                        onPress: () => navigation.pop()
                    }}
                    containerStyle={{ borderBottomColor: '#ED8A19', borderBottomWidth: 2 }}
                    centerComponent={
                        <Image 
                            source={require('../../../pages/assets/images/OyeSpace.png')}
                            style={{ height: 90, width: 90 }}
                        />
                    }
                    backgroundColor="#fff"/>
                {this.renderComponent()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    }
})

const mapStateToProps = state => {
    return {
        notifications: state.NotificationReducer.notifications,
        isCreateLoading: state.NotificationReducer.isCreateLoading,
        loading: state.NotificationReducer.loading,
        savedNoifId: state.AppReducer.savedNoifId,
    }
}

export default connect(mapStateToProps, { onNotificationOpen, storeOpenedNotif })(NotificationScreen)