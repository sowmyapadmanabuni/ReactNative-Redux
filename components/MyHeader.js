import React from "react";
import { Header } from "react-native-elements";
import {Image} from "react-native"
import HamburgerMenu from "./HamburgerMenu";

const MyHeader = props => {
  return (
    <Header
    backgroundColor={'white'}
    leftComponent={<HamburgerMenu navigation={props.navigation} />}
    centerComponent={<Image source={require('../pages/assets/images/OyeSpace_hor.png')}
    style={{ height: 20, width: 105, margin: 5, alignSelf: 'center' }}  />}
      // leftComponent={<HamburgerMenu navigation={props.navigation} />}
      // centerComponent={{
      //   text: props.title,
      //   style: { color: "white", fontWeight: "bold", }
        
      // }}
     
      // statusBarProps={{ barStyle: "light-content",backgroundColor:'orange' }}
    />
  );
};

export default MyHeader;