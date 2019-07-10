import React, { Component } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  RefreshControl
} from "react-native";
import { connect } from "react-redux";
import { ListItem, Header, Card } from "react-native-elements";
import {
  onNotificationOpen,
  storeOpenedNotif,
  getNotifications,
  refreshNotifications
} from "../../actions";
import TimeAgo from "react-native-timeago";
import _ from "lodash";
import { NavigationEvents } from "react-navigation";
// import console = require('console');

class NotificationScreen extends Component {
  componentDidMount() {
    // console.log("didmount");
  }
  keyExtractor = (item, index) => index.toString();

  onPress = (item, index) => {
    const { notifications, savedNoifId } = this.props;
    if (
      item.ntType === "Join" ||
      item.ntType === "Join_Status" ||
      item.ntType === "gate_app"
    ) {
      this.props.navigation.navigate("NotificationDetailScreen", {
        details: item
      });

      this.props.onNotificationOpen(notifications, index);
      this.props.storeOpenedNotif(savedNoifId, item.ntid);
    }
  };

  renderIcons = (type, item, index) => {
    const { savedNoifId } = this.props;

    let status = _.includes(savedNoifId, item.ntid);
    // if(index === 0) {
    //     console.log('ststus', !status || item.read)
    //     console.log('sat only', !status)
    //     console.log('read', item.read)
    // }

    if (type === "name") {
      if (status || item.read) {
        // console.log('here')
        // return 'ios-mail-unread'
        return "mail-read";
      } else {
        // console.log('here2')
        // return 'mail-read'
        return "ios-mail-unread";
      }
    } else if (type === "type") {
      if (status || item.read) {
        return "octicon";
        // return 'ionicon'
      } else {
        // return 'octicon'
        return "ionicon";
      }
    } else if (type === "style") {
      if (status || item.read) {
        return { backgroundColor: "#fff" };
      } else {
        return { backgroundColor: "#eee" };
      }
    }
  };

  renderTitle = type => {
    if (type === "Join") {
      return "Request to Join";
    } else if (type === "Join_Status") {
      return "Request to Join Status";
    } else if (type === "gate_app") {
      return "Request from Gate App";
    }
  };

  renderItem = ({ item, index }) => {
    const { savedNoifId } = this.props;
    let status = _.includes(savedNoifId, item.ntid);
    return (
      <Card>
        <ListItem
          onPress={() => this.onPress(item, index)}
          // bottomDivider
          title={this.renderTitle(item.ntType, item)}
          subtitle={item.ntDesc}
          leftIcon={{
            // name:   (!item.read || !status) ? 'ios-mail-unread' : 'mail-read',
            name: this.renderIcons("name", item, index),
            // type:  (!item.read || !status) ? 'ionicon' : 'octicon',
            type: this.renderIcons("type", item, index),
            color: "#ED8A19"
          }}
          containerStyle={this.renderIcons("style", item, index)}
          // containerStyle={(!item.read || !status) ?
          //     { backgroundColor: '#eee'} :
          //     { backgroundColor: '#fff' }
          // }
        />
        <Text> {item.ntdUpdated}</Text>
      </Card>
    );
  };

  onRefresh = () => {};

  renderComponent = () => {
    const {
      loading,
      isCreateLoading,
      notifications,
      refresh,
      refreshNotifications,
      oyeURL,
      MyAccountID
    } = this.props;
    // console.log(loading)
    // console.log(isCreateLoading)
    if (loading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff"
          }}
        >
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <FlatList
          keyExtractor={this.keyExtractor}
          data={notifications}
          renderItem={this.renderItem}
          extraData={this.props.notifications}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => refreshNotifications(oyeURL, MyAccountID)}
              progressBackgroundColor="#fff"
              tintColor="#ED8A19"
              colors={["#ED8A19"]}
            />
          }
        />
      );
    }
  };

  render() {
    const { navigation, notifications, oyeURL, MyAccountID } = this.props;
    const refresh = navigation.getParam("refresh", "NO-ID");
    return (
      <View style={styles.container}>
        <NavigationEvents />
        <Header
          leftComponent={{
            icon: "arrow-left",
            color: "#ED8A19",
            type: "material-community",
            onPress: () => navigation.pop()
          }}
          containerStyle={{
            borderBottomColor: "#ED8A19",
            borderBottomWidth: 2
          }}
          centerComponent={
            <Image
              source={require("../../../pages/assets/images/OyeSpace.png")}
              style={{ height: 90, width: 90 }}
            />
          }
          backgroundColor="#fff"
        />
        {this.renderComponent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1
  }
});

const mapStateToProps = state => {
  return {
    notifications: state.NotificationReducer.notifications,
    isCreateLoading: state.NotificationReducer.isCreateLoading,
    loading: state.NotificationReducer.loading,
    savedNoifId: state.AppReducer.savedNoifId,
    oyeURL: state.OyespaceReducer.oyeURL,
    MyAccountID: state.UserReducer.MyAccountID,
    refresh: state.NotificationReducer.refresh
  };
};

export default connect(
  mapStateToProps,
  {
    onNotificationOpen,
    storeOpenedNotif,
    getNotifications,
    refreshNotifications
  }
)(NotificationScreen);
