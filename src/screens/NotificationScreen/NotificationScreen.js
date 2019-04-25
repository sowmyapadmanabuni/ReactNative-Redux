import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { ListItem } from 'react-native-elements'
import { onNotificationOpen } from '../../actions/NotificationAction';

class NotificationScreen extends Component {
    keyExtractor = (item, index) => index.toString();

    onPress = (item, index) => {
        const { notifications } = this.props;
        if(item.ntType === 'Join') {
            this.props.navigation.navigate('NotificationDetailScreen', {
                details: item
            })

            this.props.onNotificationOpen(notifications, index);
        }
    }

    renderItem = ({ item, index }) => {
        return (
            <ListItem
                onPress={() => this.onPress(item, index)}
                bottomDivider
                title={item.ntType === 'Join' ? 'Request to Join' : 'Test' }
                subtitle={item.ntDesc}
                leftIcon={{
                    name:   item.ntIsActive ? 'ios-mail-unread' : 'mail-read',
                    type:  item.ntIsActive ? 'ionicon' : 'octicon',
                    color: '#ED8A19',
                }}
                containerStyle={item.ntIsActive ?
                    { backgroundColor: '#eee'} :
                    { backgroundColor: '#fff' }
                }
            />
    )}

    onRefresh = () => {

    }

    render() {
        // console.log(global.MyAccountID)
        const { navigation } = this.props;
        const { notifications } = this.props;
        const refresh = navigation.getParam('refresh', 'NO-ID');
        return (
            <View style={styles.container}>
                <FlatList
                    keyExtractor={this.keyExtractor}
                    data={notifications.notificationListByAssocAcctID}
                    renderItem={this.renderItem}
                    extraData={this.props.notifications}
                    // onRefresh={() => this.onRefresh()}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff'
    }
})

const mapStateToProps = state => {
    return {
        notifications: state.NotificationReducer.notifications
    }
}

export default connect(mapStateToProps, { onNotificationOpen })(NotificationScreen)