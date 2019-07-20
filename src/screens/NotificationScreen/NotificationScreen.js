import React, { Component } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  RefreshControl,
  TouchableWithoutFeedback
} from "react-native";
import { connect } from "react-redux";
import { ListItem, Header, Card } from "react-native-elements";
import {
  onNotificationOpen,
  storeOpenedNotif,
  getNotifications,
  refreshNotifications,
  toggleCollapsible
} from "../../actions";
import _ from "lodash";
import { NavigationEvents } from "react-navigation";
import Collapsible from "react-native-collapsible";

class NotificationScreen extends Component {
  keyExtractor = (item, index) => index.toString();

  onPress = (item, index) => {
    const { notifications, savedNoifId, oyeURL } = this.props;
    if (
      item.ntType === "Join" ||
      item.ntType === "Join_Status" ||
      item.ntType === "gate_app"
    ) {
      this.props.navigation.navigate("NotificationDetailScreen", {
        details: item
      });

      this.props.onNotificationOpen(notifications, index, oyeURL);
      this.props.storeOpenedNotif(savedNoifId, item.ntid);
    }
  };

  renderIcons = (type, item, index) => {
    const { savedNoifId } = this.props;
    // let status = _.includes(savedNoifId, item.ntid);

    if (type === "name") {
      if (!item.ntIsActive) {
        return "mail-read";
      } else {
        return "ios-mail-unread";
      }
    } else if (type === "type") {
      if (!item.ntIsActive) {
        return "octicon";
      } else {
        return "ionicon";
      }
    } else if (type === "style") {
      if (!item.ntIsActive) {
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

  renderStyle = active => {
    if (active) {
      return { backgroundColor: "#eee" };
    } else return { backgroundColor: "#fff" };
  };

  renderItem = ({ item, index }) => {
    const { savedNoifId, notifications, oyeURL } = this.props;
    let status = _.includes(savedNoifId, item.ntid);

    if (item.ntType !== "gate_app") {
      return (
        <Card>
          {item.ntType !== "gate_app" ? (
            <ListItem
              onPress={() => this.onPress(item, index)}
              title={this.renderTitle(item.ntType, item)}
              subtitle={item.ntDesc}
              leftIcon={{
                name: this.renderIcons("name", item, index),
                type: this.renderIcons("type", item, index),
                color: "#ED8A19"
              }}
              containerStyle={this.renderIcons("style", item, index)}
            />
          ) : (
            <View style={{ flex: 1 }}>
              <View>
                <Text> Request from Gate App</Text>
              </View>
              <Collapsible
                duration={100}
                style={{ flex: 1 }}
                collapsed={item.open}
              >
                <View style={{ backgroundColor: "#ED8A19" }}>
                  <Text> {item.ntDesc}</Text>
                </View>
              </Collapsible>
            </View>
          )}
          <Text> {item.ntdCreated}</Text>
        </Card>
      );
    } else {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            console.log(item.ntIsActive);
            if (item.ntIsActive) {
              this.props.onNotificationOpen(notifications, index, oyeURL);
            }
            this.props.toggleCollapsible(notifications, item.open, index);
          }}
        >
          <Card containerStyle={this.renderStyle(item.ntIsActive)}>
            {item.ntType !== "gate_app" ? (
              <ListItem
                onPress={() => this.onPress(item, index)}
                title={this.renderTitle(item.ntType, item)}
                subtitle={item.ntDesc}
                leftIcon={{
                  name: this.renderIcons("name", item, index),
                  type: this.renderIcons("type", item, index),
                  color: "#ED8A19"
                }}
                containerStyle={this.renderIcons("style", item, index)}
              />
            ) : (
              <View style={{ flex: 1 }}>
                <View>
                  <Text> Request from Gate App</Text>
                </View>
                <Collapsible
                  duration={300}
                  style={{ flex: 1 }}
                  collapsed={item.open}
                  align="center"
                >
                  <View
                    style={{
                      backgroundColor: "#ED8A19",
                      paddingVertical: 25,
                      margin: 4
                    }}
                  >
                    <Text> {item.ntDesc}</Text>
                  </View>
                </Collapsible>
              </View>
            )}
            <Text> {item.ntdUpdated}</Text>
          </Card>
        </TouchableWithoutFeedback>
      );
    }
  };

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
    refreshNotifications,
    toggleCollapsible
  }
)(NotificationScreen);
