import React, { Component } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { connect } from "react-redux";
import { Switch } from "react-native-switch";
import HeaderComp from "../../common/Header";
import { toggleAdminNotification } from "../../actions";

class AdminSettingScreen extends Component {
  render() {
    const { receiveNotifications, toggleAdminNotification } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <Text
          style={{
            marginLeft: 10,
            fontWeight: "600",
            fontSize: 17,
            marginRight: 18
          }}
        >
          RECEIVE NOTIFICATION :
        </Text>
        <Switch
          style={{ overflow: "hidden", marginLeft: 10, zIndex: 100 }}
          value={receiveNotifications}
          onValueChange={val => toggleAdminNotification(val)}
          activeText="On"
          inActiveText="Off"
          renderActiveText={receiveNotifications}
          renderInActiveText={!receiveNotifications}
          circleSize={25}
          barHeight={20}
          circleBorderWidth={0}
          backgroundActive={"#000000"}
          backgroundInactive={"gray"}
          circleActiveColor={"#FF8C00"}
          circleInActiveColor={"#000000"}
          switchLeftPx={3}
          switchRightPx={3}
          switchWidthMultiplier={2}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    receiveNotifications: state.NotificationReducer.receiveNotifications
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row"
  }
});

export default connect(
  mapStateToProps,
  { toggleAdminNotification }
)(AdminSettingScreen);
