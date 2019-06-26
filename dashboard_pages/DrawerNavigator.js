import React, { Component } from 'react';
import { AppRegistry, Dimensions } from 'react-native';
import { DrawerNavigator } from 'react-navigation';

import SideMenu from './SideMenu'
import stackNav from './stacknav';

const drawernav = DrawerNavigator({
  Item1: {
      screen: stackNav,
    }
  }, {
    contentComponent: SideMenu,
    drawerWidth:280,// Dimensions.get('window').width - 120,  
});
export default drawernav;
//AppRegistry.registerComponent('Demo', () => drawernav);