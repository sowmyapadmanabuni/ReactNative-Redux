import React, { Component } from 'react';
//import react in our code.
import { StyleSheet , Platform ,StatusBar, View , Text , Image , 
         TouchableOpacity , YellowBox } from 'react-native';
// import all basic components
import { DrawerNavigator, StackNavigator } from 'react-navigation';
//import DrawerNavigator , StackNavigator
import Pie from 'react-native-pie';
import { mystyles} from './styles' ;

class NavigationDrawerStructure extends Component {
  //Structure for the navigatin Drawer
  toggleDrawer = () => {
    //Props to open/close the drawer
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          {/*Donute Button Image */}
          <Image
           // source={require('./menu_ham.png')}
            style={{ width: 25, height: 25, marginLeft: 5 }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
 
class Screen1 extends Component {
  //Screen1 Component
  render() {
    return (
      <View style={{flex: 1,
      paddingTop: 20,
      alignItems: 'center',
      marginTop: 5}}>
        <Text style={{ fontSize: 23 }}> Screen 1 </Text>
        <View style={{flexDirection:"row"}}>
        <Pie
     radius={70}
     //completly filled pie chart with radius 70
     series={[10, 20, 30, 40]}
     //values to show and color sequentially
     colors={['#f00', '#0f0', '#00f', '#ff0']}
/>
<Pie
          radius={70}
          //completly filled pie chart with radius 70
          series={[56, 11, 77]}
          //values to show and color sequentially
          colors={['yellow', 'green', 'orange']}
        />
        </View>

        <Text>Solid/Filled Pie Chart</Text>
        <View style={{flexDirection:"row"}}>
        <Pie
          radius={70}
          //completly filled pie chart with radius 70
          innerRadius={40}
          //to make donut pie chart define inner radius
          series={[10, 20, 30, 40]}
          //values to show and color sequentially
          colors={['#f00', '#0f0', '#00f', '#ff0']}
        />
        <Text>Donut Pie Chart</Text>
        
          <Pie
            radius={70}
            //completly filled pie chart with radius 100
            innerRadius={65}
            series={[55]}
            //values to show and color sequentially
            colors={['#f00']}
            backgroundColor="#ddd"
          />
          </View>
      </View>
    );
  }
}
 
class Screen2 extends Component {
  //Screen2 Component
  render() {
    return (
      
      
        <View 
style={mystyles.rectangle}>
  <Text style={{ fontSize: 23 }}> Screen ddddddddddd </Text>
<View 
style={{flex:1,flexDirection:'column'}}>

<Text 
style={mystyles.title}>Hello World</Text>

<Text 
style={mystyles.subtext}>Hello World</Text>

<View 
style={{flex:1,flexDirection:'row'}}>

<View 
style={{flex:1,flexDirection:'column'}}>

<Text 
style={mystyles.text}>Country :
Hello World</Text>

<Text 
style={mystyles.text}>Total Units :
Hello World</Text>

</View>


</View>

</View>

</View>

     
    );
  }
}
 
class Screen3 extends Component {
  //Screen3 Component
  render() {
    return (
      <View style={styles.MainContainer}>
        <Text style={{ fontSize: 23 }}> Screen 3 </Text>
      </View>
    );
  }
}
 
const FirstActivity_StackNavigator = StackNavigator({
  //All the screen from the Screen1 will be indexed here 
  First: {
    screen: Screen1,
    navigationOptions: ({ navigation }) => ({
      title: 'Screen1',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
 
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});
 
const Screen2_StackNavigator = StackNavigator({
  //All the screen from the Screen2 will be indexed here
  Second: {
    screen: Screen2,
    navigationOptions: ({ navigation }) => ({
      title: 'Screen2',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
 
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});
 
const Screen3_StackNavigator = StackNavigator({
  //All the screen from the Screen3 will be indexed here
  Third: {
    screen: Screen3,
    navigationOptions: ({ navigation }) => ({
      title: 'Screen3',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
 
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});
 
const DrawerNavigatorExample = DrawerNavigator({
  //Drawer Optons and indexing
  Screen1: { //Title
    screen: FirstActivity_StackNavigator,
  },
 
  Screen2: {//Title
    screen: Screen2_StackNavigator,
  },
 
  Screen3: {//Title
    screen: Screen3_StackNavigator,
  },
});
export default DrawerNavigatorExample;
 
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    marginTop: 50,
    justifyContent: 'center',
  },
});