import React, { Component } from 'react';
import { View, Image, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native';
import { connect } from 'react-redux';
import { ListItem, Header, Card } from 'react-native-elements'
import { onNotificationOpen } from '../../actions/NotificationAction';
import TimeAgo from 'react-native-timeago';
import moment from 'moment';

class NotificationScreen extends Component {
    keyExtractor = (item, index) => index.toString();

    onPress = (item, index) => {
        const { notifications } = this.props;
        if(item.ntType === 'Join') {
            this.props.navigation.navigate('NotificationDetailScreen', {
                details: item
            })

            // this.props.onNotificationOpen(notifications, index);
        }
    }

    renderItem = ({ item, index }) => {
        // // console.log(item)
        // console.log(moment(item.ntdUpdated).fromNow())
        // console.log(moment().calendar(item.ntdUpdated))
        return (
            <Card>
                <ListItem
                    onPress={() => this.onPress(item, index)}
                    // bottomDivider
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
                <TimeAgo time={item.ntdUpdated} />
                {/* <Text> {moment(item.ntdUpdated).fromNow()} </Text> */}
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
                    data={notifications.reverse()}
                    renderItem={this.renderItem}
                    extraData={this.props.notifications}
                    // onRefresh={() => this.onRefresh()}
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
        loading: state.NotificationReducer.loading
    }
}

export default connect(mapStateToProps, { onNotificationOpen })(NotificationScreen)