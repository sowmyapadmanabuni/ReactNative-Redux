import React, { Component } from 'react'
import { Platform,  Text,  } from 'react-native'
import { StyleSheet,Dimensions,StatusBar, ScrollView,TouchableOpacity,TextInput, View,Image, FlatList,Button,TouchableWithoutFeedback ,ActivityIndicator,Animated,  PermissionsAndroid,SafeAreaView} from 'react-native'
import ImageLoad from 'react-native-image-placeholder';
import { mystyles} from '../pages/styles' ;
import ActionButton from 'react-native-action-button';
import { Fonts } from '../pages/src/utils/Fonts';

// import Search from 'react-native-search-box';

import RNHTMLtoPDF from 'react-native-html-to-pdf';

import FileViewer from 'react-native-file-viewer';

import MyHeader from "../components/MyHeader";

import moment from 'moment';

import { DatePickerDialog } from 'react-native-datepicker-dialog'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/AntDesign';

import SearchHeader from 'react-native-search-header';


import * as Animatable from 'react-native-animatable';

var date = new Date().getDate();

var month = new Date().getMonth() + 1;

var year = new Date().getFullYear();

var htmlVariable="No";

const rowHeight = 40;

const DEVICE_WIDTH = Dimensions.get(`window`).width;

export default class ViewRegularVisitor extends Component{

  static navigationOptions = {
    tabBarLabel: 'Regular Visitors',
    drawerIcon: ({tintColor}) => {
        return (
          <Image source={require('../pages/assets/images/service_provider_orange.png')}
          style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
        );
    }
}
ShowCurrentDate = () => {

  Alert.alert(date + '-' + month + '-' + year);

}

  constructor() {
    super()
    this.state = {
      username:'',
      dataSource: [],
      isLoading: true,

      dobText:  moment(new Date()).format('YYYY-MM-DD'),//year + '-' + month + '-' + date,
      dobText1:  moment(new Date()).format('YYYY-MM-DD'),//year + '-' + month + '-' + date,
      dobDate: null,
      dobDate1: null,

      htmlData:'No Data',
      totalRegularVisitors : 0,

      animation: new Animated.Value(0)

    }
    this.handleChange = this.handleChange.bind(this);
  }
    
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

  makeRemoteRequest=()=>{
    console.log('anu23467','componentdidmount')
    const url = 'http://' + global.oyeURL + '/oye247/OyeLivingApi/v1/RegularVisitor/GetRegularVisitorListByAssocID/'+global.SelectedAssociationID
    fetch(url, {
      method: 'GET',
      headers: {
       'Content-Type': 'application/json',
       "X-OYE247-APIKey":"7470AD35-D51C-42AC-BC21-F45685805BBE",
     },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('anu res ',responseJson+'');

        this.setState({
          dataSource: responseJson.data.regularVisitorsByAssocID,
          //          dataSource: responseJson.data.invitation.filter(x => x.asAssnID == global.SelectedAssociationID),

        //   dataSource: responseJson.data.familyMembers.filter(x => x.fmRltn ==='Family'),
          isLoading: false
        })
        var total = 0;
        this.setState({
          htmlData: "No Data "
        })
        htmlVariable="";
        for (var i=0; i<this.state.dataSource.length; i++) {
            total += this.state.dataSource[i].vlVisCnt;
            htmlVariable+='<p style="text-align: center;"> '+this.state.dataSource[i].refName + '         ' + this.state.dataSource[i].relName +
            '        ' + this.state.dataSource[i].reMobile + '         ' + this.state.dataSource[i].wkWrkType  +'</p>';
         
        }
        this.setState({
        totalRegularVisitors:total,
        htmlData:htmlVariable
        })
      
      })
    
      .catch((error) => {
        console.log(error)
      })
  }
  
  // componentDidMount() {
  //   console.log('anu23467','componentdidmount')
  //   const url = 'http://' + global.oyeURL + '/oye247/OyeLivingApi/v1/RegularVisitor/GetRegularVisitorListByAssocID/'+global.SelectedAssociationID
  //   fetch(url, {
  //     method: 'GET',
  //     headers: {
  //      'Content-Type': 'application/json',
  //      "X-OYE247-APIKey":"7470AD35-D51C-42AC-BC21-F45685805BBE",
  //    },
  //   })
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       console.log('anu res ',responseJson+'');

  //       this.setState({
  //         dataSource: responseJson.data.regularVisitorsByAssocID,
  //         //          dataSource: responseJson.data.invitation.filter(x => x.asAssnID == global.SelectedAssociationID),

  //       //   dataSource: responseJson.data.familyMembers.filter(x => x.fmRltn ==='Family'),
  //         isLoading: false
  //       })
  //       var total = 0;
  //       this.setState({
  //         htmlData: "No Data "
  //       })
  //       htmlVariable="";
  //       for (var i=0; i<this.state.dataSource.length; i++) {
  //           total += this.state.dataSource[i].vlVisCnt;
  //           htmlVariable+='<p style="text-align: center;"> '+this.state.dataSource[i].refName + '         ' + this.state.dataSource[i].relName +
  //           '        ' + this.state.dataSource[i].reMobile + '         ' + this.state.dataSource[i].wkWrkType  +'</p>';
         
  //       }
  //       this.setState({
  //       totalRegularVisitors:total,
  //       htmlData:htmlVariable
  //       })
      
  //     })
    
  //     .catch((error) => {
  //       console.log(error)
  //     })
  // }

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

  onDOBPress1 = () => {

    let dobDate = this.state.dobDate1;
    if (!dobDate || dobDate == null) {
      dobDate = new Date();
      this.setState({
        dobDate: dobDate
      });
      this.makeRemoteRequest();
    }
    this.refs.dobDialog1.open({
      date: dobDate,
      maxDate: new Date() //To restirct future date
    });
  }

  onDOBDatePicked = (date) => {
    this.setState({
      dobDate: date,
      dobText: moment(date).format('YYYY-MM-DD'),
    });
    this.makeRemoteRequest();
  }

  onDOBDatePicked1 = (date) => {
    this.setState({
      dobDate1: date,
      dobText1: moment(date).format('YYYY-MM-DD'),
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


  handleChange(e) {
    this.setState({
      username: e.nativeEvent.text
    });
  }

  handlePressLocalFile = () => {

    

    //Android

    console.log('bf ' + this.state.filePath);

    FileViewer.open(this.state.filePath)

    .then(() => {

        // success

        console.log('success ' + this.state.filePath);

    })

    .catch(error => {

        // error

        console.log('error ' + this.state.filePath);

    });

}

async createPDF() {

  let options = {

    //Content to print

    html:

      '<h1 style="text-align: center;"><strong>Visitor Report on ' + this.state.dobText+'</strong></h1>'+

      '<h3 style="text-align: center;">Visitors Count : '+this.state.totalVisitors+', Entries : '+this.state.dataSource.length+', Report Generated: '+moment(new Date()).format('YYYY-MM-DD hh:mm a')+'</h3>'+

      '<p style="text-align: center;">'+this.state.htmlData+'</p>',

      

    //File Name

    fileName: 'VisitorReport'+global.SelectedAssociationID+'_' + this.state.dobText,

    html:

    '<h1 style="text-align: center;"><strong>Visitor Report on ' + this.state.dobText1+'</strong></h1>'+

    '<h3 style="text-align: center;">Visitors Count : '+this.state.totalVisitors+', Entries : '+this.state.dataSource.length+', Report Generated: '+moment(new Date()).format('YYYY-MM-DD hh:mm a')+'</h3>'+

    '<p style="text-align: center;">'+this.state.htmlData+'</p>',

    

  //File Name

  fileName: 'VisitorReport'+global.SelectedAssociationID+'_' + this.state.dobText1,

    //File directory

    directory: 'docs',

  };

  let file = await RNHTMLtoPDF.convert(options);

  console.log(file.filePath);

  this.setState({filePath:file.filePath});

   FileViewer.open(this.state.filePath)

    .then(() => {

        // success

        console.log('success ' + this.state.filePath);

      //  Alert.alert("PDF Created");

    })

    .catch(error => {

        // error

        console.log('error ' + this.state.filePath);

       // Alert.alert("PDF Created at "+ this.state.filePath);

    }); 

    Linking.canOpenURL(file.filePath).then(supported => {

      if (!supported) {

        console.log('Can\'t handle url: ' + file.filePath);

        return Linking.openURL(file.filePath);

      } else {

        return Linking.openURL(file.filePath);

      }

    }).catch(err => console.error('An error occurred', err));

    

  }

  renderRow = (item, sectionId, index) => {
    return (
      <TouchableHightLight
        style={{
          height: rowHeight,
          justifyContent: 'center',
          alignItems: 'center'}}
      >
        <Text>{item.name}</Text>
      </TouchableHightLight>
    );
  }

  beforeFocus = () => {
    return new Promise((resolve, reject) => {
        console.log('beforeFocus');
        resolve();
    });
}
onFocus = (text) => {
  return new Promise((resolve, reject) => {
      console.log('onFocus', text);
      resolve();
  });
}
afterFocus = () => {
  return new Promise((resolve, reject) => {
      console.log('afterFocus');
      resolve();
  });
}


/**
                   {
                "reRgVisID": 7,
                "refName": "",
                "relName": "",
                "reMobile": "",
                "reisdCode": null,
                "meMemID": 2,
                "unUnitID": 1,
                "wkWrkType": "",
                "asAssnID": 6,
                "redCreated": "2018-11-15T03:41:30",
                "redUpdated": "0001-01-01T12:00:00",
                "reIsActive": true
            } */    

toggleOpen = () => {
  const toValue = this._open ? 0 : 1;
  Animated.timing(this.state.animation, {
    toValue,
    duration:200,
  }).start();

  this._open = !this._open;
}
  render() {
    const { navigate } = this.props.navigation;
    const addBtn = {
      transform: [{
        scale:this.state.animation
      }, {
        translateY: this.state.animation.interpolate({
          inputRange:[0,1],
          outputRange:[0,-70],
        })
      }]
    }
    const createPdfBtn = {
      transform: [{
        scale:this.state.animation
      }, {
        translateY: this.state.animation.interpolate({
          inputRange:[0,1],
          outputRange:[0,-140],
        })
      }]
    }
    const labelPositionInterpolate = this.state.animation.interpolate({
      inputRange:[0,1],
      outputRange:[-30,-90],
    })
    const opacityInterpolate = this.state.animation.interpolate({
      inputRange:[0,0.8,1],
      outputRange:[0,0,1],
    })
    const labelStyle = {
      // opacity: opacityInterpolate,
      // transform: [{
      //   translateX: labelPositionInterpolate
      // }]
    }
    const bgStyle = {
      transform: [{
        scale: this.state.animation.interpolate({
          inputRange: [0,1],
          outputRange: [0,40],
        })
      }]
    }
    //           ='PERSONAssociation'+ global.SelectedAssociationID+'Regular'+responseJson.data.regularVisitor.reRgVisID+'.jpg';

    return (
     
      <View style={{ backgroundColor: '#FFF', height: '100%' }}>

<View style={{flexDirection:'row',}}>
<StatusBar barStyle = 'light-content' />
                    <View style={{flex:0.5, marginTop:43,marginRight:0, justifyContent:'center',marginLeft:10}}>
                        <TouchableOpacity onPress={() => navigate(('ResDashBoard'), { cat: '' })}
                        >
                        <Image source={require('../pages/assets/images/back.png')}
                        style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:4,alignContent:'flex-start',marginLeft:5}}>
                        <MyHeader navigation={this.props.navigation} title="Menu"
                        style={{ height: 50, width: 80}}  />
                    </View> 
                    {/* <View style={{ flex: 5, alignContent:'flex-start',alignSelf:'flex-start',alignItems:'flex-start',justifyContent:'flex-start',marginRight:80}}>
                        <Image source={require('../pages/assets/images/OyeSpace_hor.png')}
                            style={{
                            height: 35, width: 105, marginTop: 50,
                        }} />
                    </View>    */}
                    <View style={{flex:1,marginTop:45, marginRight:10, justifyContent:'center',}}>
                        {/* <TouchableOpacity>
                          <View>
                            <Image source={require('../pages/assets/images/search.png')}
                              onPress = {() => this.searchHeader.show()}
                            />                            
                          </View>
                      </TouchableOpacity>; */}
                      <Button
                          title = 'S'
                          color = '#000'
                          onPress = {() => this.searchHeader.show()}
                      />
                    </View>                 
                </View>
                <SearchHeader
                    ref = {(searchHeader) => {
                        this.searchHeader = searchHeader;
                    }}
                    placeholder = 'Search...'
                    placeholderColor = 'gray'
                    onClear = {() => {
                        console.log(`Clearing input!`);
                    }}
                    onSearch={this.handleChange}
                    
                    
                  />
                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>Regular Visitors</Text>

      {/* <View>
        <View
          style={{
            paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
            borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:10,
          }}>
          <TouchableOpacity onPress={() => navigate(('ResDashBoard'), { cat: '' })}
            style={{ flex: 1 }}>
            <Image source={require('../pages/assets/images/back.png')}
              style={{ height: 25, width: 25, margin: 10, alignSelf: 'center' }} />
          </TouchableOpacity>
          <Text style={{ flex: 2, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>
          <Text style={{ flex: 6, fontSize: 16, color: 'black', fontFamily: Fonts.Tahoma, alignSelf: 'center',fontWeight:'bold',justifyContent:'center',alignItems:'center' }}>Regular Visitors</Text>
          <View style={{ flex: 3, alignSelf: 'center' }}>
            <Image source={require('../pages/assets/images/OyeSpace_hor.png')}
              style={{
                height: 35, width: 105, marginRight: 15,
                alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
              }} />
          </View>
        </View>
       
      </View> */}
      {/* <View style={{height:50, backgroundColor:'white',justifyContent:'center',paddingHorizontal:5,}}>
  <Animatable.View animation="slideInRight" duration={500} style={{ height:45, backgroundColor:'white', flexDirection:'row', padding:10,margin:15, alignItems:'center',borderColor:'orange',borderWidth:1,borderRadius:25}}>
  <Animatable.View animation={this.state.searchBarFocused? "fadeInLeft" : "fadeInRight"}>
      <Image source={this.state.searchBarFocused? require('../pages/assets/images/back.png'): require('../pages/assets/images/search.png') } style={{width:18,height:18,}}/>
  </Animatable.View>
    <TextInput placeholder="Search By Name" style={{flex:1, fontSize:16,marginLeft:10,}} 
      onChangeText={this.handleSearch}  

    />
  </Animatable.View>
  </View> */}
<View style={{ flexDirection: 'row', justify: 'center', margin: 1, }}>
                  <View style={{ flex: 0.4, flexDirection: 'row',padding:'3%',}}>
                      <Text style={{ fontSize: 14, color: 'black', margin: 2}}>From Date:</Text>
                      <TouchableOpacity onPress={this.onDOBPress.bind(this)}>
                        <View style={styles.datePickerBox}>
                          <Text style={styles.datePickerText}>{this.state.dobText} </Text>
                          <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />
                        </View >
                      </TouchableOpacity>
                  </View>
                  <View style={{ flex: 0.4, flexDirection: 'row',padding:'3%', marginLeft:'5%' }}>
                      <Text style={{ fontSize: 14, color: 'black', margin: 2}}>To Date:</Text>
                      <TouchableOpacity onPress={this.onDOBPress1.bind(this)}>
                        <View style={styles.datePickerBox}>
                          <Text style={styles.datePickerText}>{this.state.dobText1} </Text>
                          <DatePickerDialog ref="dobDialog1" onDatePicked={this.onDOBDatePicked1.bind(this)} />
                        </View >
                      </TouchableOpacity>
                  </View>
                  <View style={{ flex: 0.2, padding:2 }}>
                    <Button title="GET" onPress={this.makeRemoteRequest}
                    />
                  </View>
              </View>
              {/* <View style={{alignSelf:'flex-end', justifyContent:'flex-end'}}>
            <TouchableOpacity  style={styles.rectangle} onPress={this.createPDF.bind(this)}>
              <View>
                <Text style={styles.createPDFButtonText}>Create PDF</Text>
              </View>
            </TouchableOpacity>
          </View> */}
{/* <View style={{height:50, backgroundColor:'white',justifyContent:'center',paddingHorizontal:5,}}>
<View style={{ height:45, backgroundColor:'white', flexDirection:'row', padding:10,margin:15, alignItems:'center',borderColor:'orange',borderWidth:1,borderRadius:25}}>

<Image
            source={require('../pages/assets/images/search.png')}
            style={{width:18,height:18,}}
          />

<TextInput style={{flex:1, fontSize:16,marginLeft:10,}}
  placeholder="Search by Name"
  onChange={this.handleChange
  }
/>
</View>
   <View style={{flex: 1.5, backgroundColor: '#ffffff',marginLeft:15,marginTop:7}}>

   </View>
 </View> */}

      {this.state.isLoading
        ?
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white'
        }}>
          <ActivityIndicator
            size="large"
            color="#330066"
            animating />
        </View>
        :
        this.state.dataSource.length == 0 ?
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}   >
            <Text style={{ backgroundColor: 'white' }}>No Regular Visitors </Text>
          </View>
          :
        <View style={styles.container}> 




          <FlatList
            data={this.state.dataSource.filter(item => item.refName.includes(this.state.username) )}

            //this.state.dataSource.sort((a, b) => a.localeCompare(b))}
            renderItem={({item}) => 
            <View style={mystyles.rectangle}>
              <View style={{flex: 3, flexDirection:'row',  padding: 2  }}>
                <ImageLoad style={{ width: 80, height: 80 }}
                  loadingStyle={{ size: 'large', color: 'blue' }}
                  source={{ uri: global.viewImageURL+'PERSONAssociation'+ global.SelectedAssociationID+'REGULAR'+item.reRgVisID+'.jpg' }} />  
    
               
                <View style={{flex: 4, flexDirection:'column' }}>
                  <Text style={styles.title}> {item.refName+' '+item.relName}</Text>
                  <Text style={styles.text}>{item.reMobile} </Text>
                  <Text style={styles.text}> {item.wkWrkType}</Text>
                </View>
                <TouchableOpacity
                  style = {{flex:1,  backgroundColor: 'white', }}
                  onPress={() => navigate('EditRegularVisitorScreen', {id:item.reRgVisID})}>
                  <Image source={require('../pages/assets/images/edit.png')}style={{height: 30, width: 30, alignItems: "flex-end", }} />

                </TouchableOpacity>
              </View>

            </View>
               }
            keyExtractor={({oyeFamilyMemberID}, index) => oyeFamilyMemberID}
          />
        </View>
        
      }

      <Animated.View style={[styles.background, bgStyle]}></Animated.View>
      <TouchableWithoutFeedback onPress={this.createPDF.bind(this)}>
        <Animated.View style={[styles.button, styles.other,createPdfBtn]}>
          {/* <Animated.Text style={[styles.label, labelStyle]}>Create PDF</Animated.Text> */}
          <Icon name="file-pdf-box" size={30} color="#555"/>
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={() => navigate('AddRegularVisitorScreen', { cat: ' ' })}>
        <Animated.View style={[styles.button, styles.other, addBtn]}>
          {/* <Animated.Text style={[styles.label, labelStyle]}>Add</Animated.Text> */}
          <Icon1 name="adduser" size={30} color="#555"/>
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={this.toggleOpen}>
        <View style={[styles.button, styles.pay, labelStyle]}>
          <Text style={styles.payText}>+</Text>
        </View>
      </TouchableWithoutFeedback>
      {/* <ActionButton buttonColor="rgba(250,153,23,1)" onPress={() => navigate('AddRegularVisitorScreen', { cat: ' ' })}  >
          </ActionButton> */}
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {    flex: 1,    backgroundColor: '#F5FCFF',  },
  
  title: { fontSize: 14,  color : 'black', marginBottom:8,fontWeight:'bold',marginLeft:5},
  
  text: { fontSize: 12, color : 'black',marginLeft:5 },
  searchInput: {flex:1,
    height: 30, padding: 4, fontSize: 14, borderWidth: 1,margin:2,
    borderColor: '#F2F2F2', borderRadius: 8, color: 'black',backgroundColor: '#ffffff' ,flexDirection:'row',flex:4.5
  },

  searchInputText: {
    padding: 2, fontSize: 14, color: 'black', alignSelf:'center'
  },

  status: {
    zIndex: 10,
    elevation: 2,
    width: DEVICE_WIDTH,
    height: 21,
    backgroundColor: '#0097a7'
},
header: {
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: DEVICE_WIDTH,
    height: 56,
    marginBottom: 6,
    backgroundColor: '#00bcd4'
},


  button:{
    width:60,
    height:60,
    alignItems:'center',
    justifyContent:'center',
    shadowColor:'#333',
    shadowOpacity:0.1,
    shadowOffset: {x:2, y:0},
    shadowRadius:2,
    borderRadius:30,
    position:'absolute',
    bottom:20,
    right:20,
  },
  pay:{
    backgroundColor:'orange',
  },
  payText:{
    color:'#fff',
    fontSize:40,
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'center',
    marginBottom:5,
  },
  other:{
    backgroundColor:'#fff',
  },

  label:{
    color:'#fff',
    position:'absolute',
    fontSize:18,
    backgroundColor:"transparent",

  },
  background: {
    backgroundColor:"rgba(0,0,0,0.6)",
    position:'absolute',
    width:60,
    height:60,
    bottom:20,
    right:20,
    borderRadius:30,

  },

  ImageStyle: {
  
    padding: 10,
    alignSelf:'center',
    height: 10,
    width: 10,
    marginLeft:5
    
  },
  
  TouchableOpacityStyle: {

    position: 'absolute', width: 50, height: 50, alignItems: 'center',

    justifyContent: 'center', right: 30, bottom: 30,

  },



  mybutton1: {

    backgroundColor: 'orange', paddingTop: 8, paddingRight: 12, paddingLeft: 12,

    paddingBottom: 8, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',

  },

  datePickerBox: {

    margin: 2, borderColor: '#ABABAB', borderWidth: 0.5, padding: 0,

    borderTopLeftRadius: 4, borderTopRightRadius: 4, borderBottomLeftRadius: 4, borderBottomRightRadius: 4,

    justifyContent: 'center'

  },



  datePickerText: { fontSize: 15, marginLeft: 5, marginRight: 5, borderWidth: 0, color: '#121212', },



  profileImgContainer: { marginLeft: 3, width: 80, marginTop: 5, borderRadius: 40, },



  profileImg: { height: 120, width: 80, borderRadius: 40, },



  vehicleNum: { backgroundColor: '#E0E0E0', padding: 2, borderRadius: 10, borderWidth: 1, borderColor: '#fff' },



  FloatingButtonStyle: { resizeMode: 'contain', width: 50, height: 50, },

  rectangle: {
    backgroundColor: 'white', padding: 10, borderColor: 'orange',
    margin: 5, borderRadius: 2, borderWidth: 1, alignContent: 'center', marginBottom:'10%',marginRight:'5%',
},

createPDFButtonText: { color: '#FA9917' },


});