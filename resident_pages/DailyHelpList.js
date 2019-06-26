import React, { Component } from 'react';
import { AppRegistry, Platform, Alert, TouchableOpacity, ScrollView, PermissionsAndroid, StyleSheet, Text, Image, View, FlatList, ActivityIndicator } from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
import DatePicker from 'react-native-datepicker'
import { DatePickerDialog } from 'react-native-datepicker-dialog'
import moment from 'moment';

import { Container, Content, List, ListItem, Body, Left, Right, Thumbnail, Icon } from 'native-base'

export default class DailyHelpList extends Component {

  ShowCurrentDate = () => {

    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    Alert.alert(date + '-' + month + '-' + year);
  }

  static navigationOptions = {
    title: 'Daily Help Report',
    headerStyle: {
      backgroundColor: '#FA9917',
    },
    headerTitleStyle: {
      color: '#fff',
    }
  };

  async componentDidMount() {

    await request_location_runtime_permission()

  }

  constructor() {
    super()
    this.state = {
      dataSource: [],
      isLoading: true,
      dobText: '2018-10-13',
      dobDate: null,
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
      this.makeRemoteRequest();
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
    this.makeRemoteRequest();
  }
  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });
    this.makeRemoteRequest();
  }
  setDate(newDate) {
    this.setState({ chosenDate: newDate });
    this.makeRemoteRequest();
  }

  renderItem = ({ item }) => {
    const { navigate } = this.props.navigation;
    return (
      <View
        style={styles.rectangle}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text style={styles.title}>Name: {item.firstName}</Text>
          <Text style={styles.text}>Start Time : {item.entryTime.substring(11, 21)}</Text>
          <Text style={styles.text}>End Time : {item.exitTime.substring(11, 21)}</Text>
          {/* <Image source={require('./team.png')}  /> */}
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
    const { params } = this.props.navigation.state;
    console.log(params.id)
    console.log('componentdidmount')
    const url = 'http://' + global.oyeURL + '/oye247/api/v1/OYERegularVisitorLog/GetOYERegularVisitorLogListByDate/'+global.SelectedAssociationID+'/' + this.state.dobText.toString()
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
          dataSource: responseJson.data.visitors,
          isLoading: false
        })
        console.log('anu', dataSource);
      })
      .catch((error) => {
        console.log(error)
      })
  }

  SampleFunction = () => {
    // Write your own code here, Which you want to execute on Floating Button Click Event.
    Alert.alert("Floating Button Clicked");
  }

  render() {
    console.log('ravi', this.state.dobText.toString())
    return (

      this.state.isLoading
        ?

        <View style={{ backgroundColor: '#FFF', height: '100%' }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#330066" animating />
          </View>
        </View>
        :

        <View style={{ backgroundColor: '#FFF' }}>
          <View style={{ height: '10%' }}>
            <View style={{ flex: 1, justify: 'center', flexDirection: 'row' }}>
              <Text style={{ fontSize: 18, color: 'green' }}>Select date</Text>
              <TouchableOpacity onPress={this.onDOBPress.bind(this)} >
                <View style={styles.datePickerBox}>
                  <Text style={styles.datePickerText}>{this.state.dobText}</Text>
                </View>
              </TouchableOpacity>
              <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />
            </View>
          </View>
          <View style={{ height: '90%' }}>
            <ScrollView>
              <FlatList
                data={this.state.dataSource}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => item.name}
                ItemSeparatorComponent={this.renderSeparator}      />
            </ScrollView>
            <TouchableOpacity activeOpacity={0.5} onPress={this.SampleFunction} style={styles.TouchableOpacityStyle} >
            </TouchableOpacity>
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
    flex: 1, backgroundColor: 'white', padding: 10, borderColor: 'orange',
    marginLeft: 5, marginRight: 5, marginTop: 5, borderRadius: 2, borderWidth: 1,
  },

  title: { fontSize: 18, fontFamily: Fonts.Tahoma, color: 'black', marginBottom: 8, fontWeight: 'bold' },

  text: { fontSize: 10, fontFamily: Fonts.OpenSansRegular, color: 'black', },

  TouchableOpacityStyle: {

    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
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
AppRegistry.registerComponent('createassociation', () => createassociation);
