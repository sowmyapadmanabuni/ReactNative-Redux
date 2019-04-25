/**
* Sample React Native App
* https://github.com/facebook/react-native
*
* @format
* @flow
*/

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, FlatList, ActivityIndicator,TouchableOpacity,ToastAndroid } from 'react-native';
import {  mystyles} from './styles'
  import ActionButton from 'react-native-action-button';
  import Icon from 'react-native-vector-icons/Ionicons';

export default class SchedulemeetingList extends Component {
  constructor() {
    super()
    this.state = {
      dataSource: [],
      isLoading: true
    }
    console.log('anu123','constructor');
  }
  static navigationOptions = {
    title: 'Meeting List',
    headerStyle:{
        backgroundColor:'#696969',
    },
    headerTitleStyle:{
        color:'#fff',
    }
  };
  renderItem = ({ item }) => {
    return (
      
      <TouchableOpacity style={{ flex: 1, flexDirection: 'row', marginBottom: 3 }}
     /* onPress={() => ToastAndroid.show(item.book_title,ToastAndroid.SHORT)}*/
     
     onPress={() => alert(item.subject)}>
      console.log('anu234',item.subject+', '+item.agenda);
    
       
       <View style={{ flex: 1, justifyContent: 'center', marginLeft: 5 }}>
          <Text style={{ fontSize: 18, color: 'green', marginBottom: 15 }}>
            {item.subject}
          </Text>
          <Text style={{ fontSize: 16, color: 'red' }}>
            {item.agenda}
          </Text>
        </View>
      </TouchableOpacity>
    ) 
  }

  renderSeparator = () => {
    return (
      <View
        style={{ height: 1, width: '100%', backgroundColor: 'darkgrey' }}>
      </View>
    )
  }

  componentDidMount() {
    console.log('anu23467','componentdidmount')
    const url = 'http://oye247api.oye247.com/oye247/api/v1/NoticeBoards/30'
    fetch(url, {
      method: 'GET',
      headers: {

       'Content-Type': 'application/json',
       "X-OYE247-APIKey":"7470AD35-D51C-42AC-BC21-F45685805BBE",

     },
   })
      .then((response) => response.json())
      .then((responseJson) => {
       
        this.setState({
          dataSource: responseJson.data.noticeBoard,
          isLoading: false
        })
        console.log('anu',responseJson);
      
      })
    
      .catch((error) => {
        console.log(error)
      })
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      this.state.isLoading
        ?
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#330066" animating />
        </View>
        :
        <View style={{flex: 1, flexDirection:'row',  marginLeft: 5  }}>
        <FlatList
        
          data={this.state.dataSource}
          renderItem={({item}) => 
          <View
          style={mystyles.rectangle}>
          
                      <View style={{flex: 1, flexDirection:'row',  padding: 2  }}>
                               
                      <View style={{flex: 1, flexDirection:'column' }}>
                        <Text style={mystyles.title}>Subject: {item.subject}</Text>
                        <Text style={mystyles.text}>Agenda :{item.agenda} </Text>
                        <Text style={mystyles.text}>Location :{item.location}</Text>
                        <Text style={mystyles.text}>Date :{item.scheduledTime}</Text>
                        <Text style={mystyles.text}>Gps Point :{item.gpsPoint}</Text>
                     </View>
                       </View>
          
                       </View>
          
          }
          keyExtractor={({noticeBoardID}, index) => noticeBoardID}
        />
          <ActionButton buttonColor="rgba(231,76,60,1)"  
           onPress={() => navigate('Meeting',{cat:'Category two'})}   ></ActionButton>

       
      </View>
//         <View style={styles.container}>
//           <FlatList
          
//             data={this.state.dataSource}
//             renderItem={({item}) => 
//             <View style={{flex: 1, flexDirection:'row',  marginLeft: 5  }}>
            
//    <View style={{flex: 1, flexDirection:'column' }}>
//      <Text style={{ fontSize: 10, color: 'black' }}>Subject: {item.subject}</Text>
//      <Text style={{ fontSize: 10, color: 'black' }}>Agenda :{item.agenda}</Text>
//      <Text style={{ fontSize: 10, color: 'black' }}>Location :{item.location}</Text>
//      <Text style={{ fontSize: 10, color: 'black' }}>Date :{item.scheduledTime}</Text>
//      <Text style={{ fontSize: 10, color: 'black' }}>Gps Point :{item.gpsPoint}</Text>
     

//     {/* <Image source={require('./team.png')}  /> */}
   
  
                   
//                    </View>

//      {/* <Image source={{uri: 'http://cohapi.careofhomes.com/Images/PERSONAssociation30NONREGULAR'+item.oyeNonRegularVisitorID+'.jpg'}}
// style={{width: 40, height: 40,resizeMode : 'stretch'}} /> */}
//    </View>
//             // <View style={{backgroundColor: 'powderblue',marginBottom: 5,}}>
//             //  <Text>{item.subject}, {item.details}</Text>
//             // <Text >{item.scheduledTime}, {item.location}</Text>
//             // <Text >{item.gpsPoint}, {item.agenda}</Text>
//             // <Text >{item.meetingFor}, {item.scheduledBy}</Text>
//             // <Text style={{backgroundColor: '#F5FCFF',}}></Text>
//             // </View>
//             }
//             keyExtractor={({noticeBoardID}, index) => noticeBoardID}
//           />
  
         
//         </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  }

});
