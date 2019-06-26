import React, { PureComponent } from 'react';
import { AppRegistry, Platform, Alert, TouchableOpacity, ScrollView, PermissionsAndroid, StyleSheet, Text, Image, View, FlatList, ActivityIndicator } from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
import moment from 'moment';
//import { Fonts } from '../pages/src/utils/Fonts'

console.disableYellowBox = true;

export default class home extends PureComponent {
  ShowCurrentDate = () => {

    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    Alert.alert(date + '-' + month + '-' + year);
  }


  static navigationOptions = {
    title: 'Patrolling List',
    headerStyle: {
      backgroundColor: '#696969',
    },
    headerTitleStyle: {
      color: '#fff',
    }
  };
  constructor() {
    super()
    this.state = {
      dataSource: [],
      isLoading: true,
      dobText: '2018-10-13',
      dobDate: null,
      WorkerName: [],
      imageLoading: true,
      chosenDate: new Date(),

    }
    this.setDate = this.setDate.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    console.log('anu123', 'constructor');

  }
  onDOBPress = () => {
    let dobDate = this.state.dobDate;

    if (!dobDate || dobDate == null) {
      dobDate = new Date();
      this.setState({
        dobDate: dobDate
      });
      //  this.makeRemoteRequest();
    }
    this.refs.dobDialog.open({
      date: dobDate,
      maxDate: new Date() //To restirct future date
    });

  }
  onDOBDatePicked = (date) => {
    this.setState({
      dobDate: date,
      dobText: moment(date).format('YYYY-MM-DD')

    });
    //  this.makeRemoteRequest();
  }
  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });
    //   this.makeRemoteRequest();
  }
  setDate(newDate) {
    this.setState({ chosenDate: newDate });
    //  this.makeRemoteRequest();
  }

  renderItem = ({ item }) => {
    // db.transaction(tx => {
    //   tx.executeSql('SELECT FName FROM Workers where WorkID=' + item.wkWorkID, [], (tx, results) => {
    //     console.log('Results', results.rowsAffected);
    //     var temp = [];
    //     for (let i = 0; i < results.rows.length; i++) {
    //       temp.push(results.rows.item(i));
    //       console.log('Guards Name', results.rows.item(i).FName);
    //       this.setState({
    //         WorkerName: results.rows.item(i).FName
    //       });
    //     }
    //     console.log('guardName', WorkerName);
    //   });
    // });
    return (

      <View style={styles.rectangle}>

        <View style={{ flex: 1, flexDirection: 'row', }}>
          <View style={{ flex: 1, flexDirection: 'column', marginLeft: 10 }}>
            <Text style={styles.title}>Guard Name: {this.state.WorkerName}</Text>
            <Text style={styles.text}>Patrolling Start Time: {item.ptdCreated.substring(0, 10)}, {item.ptdCreated.substring(12, 16)}</Text>
            <Text style={styles.text}>Patrolling End Time: {item.pteDateT.substring(0, 10)}, {item.pteDateT.substring(12, 16)}</Text>
            {/* <Image source={require('./team.png')}  /> */}

          </View>
        </View>

        {/* <Image source={{uri: 'http://cohapi.careofhomes.com/Images/PERSONAssociation30NONREGULAR'+item.oyeNonRegularVisitorID+'.jpg'}}
       style={{width: 40, height: 40,resizeMode : 'stretch'}} /> */}
      </View>
    )

  }
  renderSeparator = () => {
    return (
      <View
        style={{ height: 2, width: '100%', backgroundColor: '#fff' }}>
      </View>
    )
  }

  componentDidMount() {
    console.log('anu', this.state.dobText.toString);
    this.makeRemoteRequest();

  }

  makeRemoteRequest = () => {
    const { } = this.props.navigation.state;

    console.log('componentdidmount')
    const url = global.oye247BaseURL + 'Patrolling/GetPatrollingList'
    console.log(url)
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          //dataSource: responseJson.data.patrolling,
          dataSource: responseJson.data.patrolling.filter(x => x.asAssnID == global.SelectedAssociationID),
          isLoading: false
        })
        console.log('anu', dataSource);
      })
      .catch((error) => {
        console.log(error)
      })
  }

  SampleFunction = () => {
    this.props.navigation.navigate('InviteGuest');
    // Write your own code here, Which you want to execute on Floating Button Click Event.
    //  Alert.alert("Floating Button Clicked");

  }
  render() {
    const { navigate } = this.props.navigation;
    return (

      this.state.isLoading
        ?

        <View style={{ backgroundColor: '#FFF', height: '100%' }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#330066" animating />
          </View>
        </View>
        :
       
<View
style={{
backgroundColor: 
'#FFF' }}>

<View
style={{
height: '0.5%' }}>

</View>
<View style={{flexDirection:'row',}}>
                    <View style={{flex:0.5, marginTop:43,marginRight:0, justifyContent:'center',marginLeft:10}}>
                        <TouchableOpacity onPress={() => navigate(('ResDashBoard'), { cat: '' })}
                        >
                        <Image source={require('../pages/assets/images/back.png')}
                        style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity 
                        style={{paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 1, alignItems: 'center', flexDirection: 'row',
                            paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:'6%'}}
                            onPress={() => this.props.navigation.navigate('SideMenu')}>
                        <Image source={require('../pages/assets/images/menu_button.png')}
                            style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <View style={{ flex: 5, alignItems:'center', justifyContent:'center',marginRight:'6%'}}>
                    <Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
                        style={{height: 40, width: 95, marginTop: 45,marginBottom:5}} />
                    </View>  
                    <View style={{flex:1,marginTop:45, marginRight:10, justifyContent:'center',}}>    
                    </View>                 
                </View> 

                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>Patrolling List</Text>

{/* <View

style={{

paddingTop: 
2, paddingRight: 
2, paddingLeft: 
2, flexDirection: 
'row', paddingBottom: 
2,

borderColor: 
'white', borderRadius: 
0, borderWidth: 
2, textAlign: 
'center',

marginTop:25,

}}> */}

{/* <TouchableOpacity
onPress={()=> navigate(('ResDashBoard'), {
cat: '' })}

style={{
flex: 1 ,
alignSelf:'center'}}>

<Image
source={require('../pages/assets/images/back.png')}

style={{
height: 25,
width: 25,
margin: 10,
alignSelf: 'center' }}
/>

</TouchableOpacity> */}
{/* 
<Text
style={{
flex: 4,
paddingLeft: 5,
fontSize: 14,
color: 'black',
alignContent: 
'flex-start', alignSelf: 
'center' }}>
</Text> */}

{/* <Text
style={{
flex: 5,
fontSize: 16,
color: 'black',
fontWeight:'bold',
alignSelf: 'center',
justifyContent:'center',alignContent:'center' }}>Patrolling
 List</Text>
 */}
{/* <View
style={{
flex: 4,
alignSelf: 'center' }}>

<Image
source={require('../pages/assets/images/OyeSpace_hor.png')}

style={{

height: 35,
width: 105,
margin: 5,

alignSelf: 
'center', justifyContent: 
'center', alignItems: 
'center'

}} />

</View> */}

{/* </View>    */}

{/* <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View> */}
          
          <View style={{ height: '100%' }}>
            <ScrollView>
              <FlatList
                data={this.state.dataSource}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => item.wkWorkID}
                ItemSeparatorComponent={this.renderSeparator}
                ListHeaderComponent={() => (!this.state.dataSource.length ?
                  <Text style={{ alignSelf: 'center', color: 'black', marginTop: '65%' }}>No Data Found!</Text>
                  : null)
                }
              />
            </ScrollView>

            {/* <TouchableOpacity activeOpacity={0.5} onPress={this.SampleFunction} style={styles.TouchableOpacityStyle} >
              <Image source={{ uri: 'https://reactnativecode.com/wp-content/uploads/2017/11/Floating_Button.png' }}
                style={styles.FloatingButtonStyle} />
            </TouchableOpacity> */}
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCDCDC',
  },
  rectangle: {
    flex: 1, backgroundColor: 'white', padding: 2, borderColor: 'orange',
    marginLeft: 2, marginRight: 2, marginTop: 2, borderRadius: 2, borderWidth: 1,
  },

  text: { fontSize: 13,  color: 'black', },
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  title: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold'
  },
  datePickerBox: {
    marginTop: 9,
    borderColor: '#ABABAB',
    borderWidth: 0.5,
    padding: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    height: 38,
    justifyContent: 'center'
  },
  datePickerText: {
    fontSize: 14,
    marginLeft: 5,
    borderWidth: 0,
    color: '#121212',
  },

  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
  }
});
AppRegistry.registerComponent('IncidentList', () => IncidentList);
