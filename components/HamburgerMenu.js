import React from "react";
import { Icon } from "react-native-elements";
import { View } from "react-native-animatable";

const HamburgerMenu = props => {
  return (
    <View >
    <Icon
      color="orange"
      name="menu"
      onPress={() => props.navigation.toggleDrawer()}
    />
    </View>
  );
};

export default HamburgerMenu;