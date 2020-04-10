import React from 'react';
//import react in our code. 
import { Button, Text, View, TouchableOpacity, StyleSheet,Image } from 'react-native';
//import all the basic component we have used
//import Ionicons to show the icon for bottom options
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
//import StackNavigator, TabNavigator, TabBarBottom in our project
 
class BottomNavigationScreen extends React.Component {
  //Home Screen to show in Home Option
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ marginTop:50, fontSize:25 }}>Home!</Text>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={styles.button} 
              onPress={() => this.props.navigation.navigate('Settings')}>
            <Text>Go to settng Tab</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} 
              onPress={() => this.props.navigation.navigate('Details')}>
            <Text>Open Details Screen</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
 
class SettingsScreen extends React.Component {
  //Setting Screen to show in Setting Option
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{  fontSize:25 }}>Setting!</Text>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={styles.button} 
              onPress={() => this.props.navigation.navigate('Home')}>
            <Text>Go to Home Tab</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} 
              onPress={() => this.props.navigation.navigate('Details')}>
            <Text>Open Detail Screen</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} 
              onPress={() => this.props.navigation.navigate('AddVehiclesScreen')}>
            <Text>Open AddVehiclesScreen Screen</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
 
class DetailsScreen extends React.Component {
  //Detail Screen to show from any Open detail button
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Details!</Text>
      </View>
    );
  }
}
 
class ProfileScreen extends React.Component {
  //Profile Screen to show from Open profile button
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Profile!</Text>
      </View>
    );
  }
}
 
const HomeStack = StackNavigator({
  //Defination of Navigaton from home screen
  Home: { screen: BottomNavigationScreen },
  Details: { screen: DetailsScreen },
},{
    navigationOptions: {
      //Header customization of the particular Screen
      headerStyle: {
      //  backgroundColor: '#42f44b',
      },
      header:null,
      //headerTintColor: '#FFFFFF',
     // title: 'Bottom Tab Example',
      //Header title
    },
  }
);
 
const SettingsStack = StackNavigator({
  //Defination of Navigaton from setting screen
  Settings: { screen: SettingsScreen },
  Details: { screen: DetailsScreen },
  Profile: { screen: ProfileScreen },
},{
    navigationOptions: {
      //Header customization of the particular Screen
      headerStyle: {
       // backgroundColor: '#42f44b',
      },
       header:null,
    // {
    //     visible: true
    //   }
      //headerTintColor: '#FFFFFF',
      //title: 'Bottom Tab Example',
      //Header title
    },
  });
 
export default TabNavigator(
  {
    //Defination of Navigaton bottom options
    Home: { screen: HomeStack },
    Settings: { screen: SettingsStack },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = `ios-information-circle${focused ? '' : '-outline'}`;
        } else if (routeName === 'Settings') {
          iconName = `ios-options${focused ? '' : '-outline'}`;
        }
        return <Image name={iconName} size={25} color={tintColor} />
      }
    }),
    tabBarComponent: TabBarBottom,
    //We need to import TabBarBottom to make Bottom TabBar
    tabBarPosition: 'top',
    tabBarOptions: {
      activeTintColor: '#42f44b',
      inactiveTintColor: 'gray',
    },
    animationEnabled: true,
    swipeEnabled: false,
  }
);
const styles = StyleSheet.create ({
    button: {
      alignItems: 'center',
      backgroundColor: '#DDDDDD',
      padding: 10,
      width:300,
      marginTop:16
    },
});