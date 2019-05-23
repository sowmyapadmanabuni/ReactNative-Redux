import React, { Component } from "react"
import { StyleSheet, TouchableWithoutFeedback, View, Keyboard, FlatList, Text, Image,SafeAreaView,TouchableOpacity,Dimensions,Alert} from "react-native";
import { Card, CardItem, Container, Left, Body, Right, Title, Row,Button } from 'native-base';
import { TextInput } from "react-native-gesture-handler";
import { NavigationEvents } from 'react-navigation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Dropdown } from 'react-native-material-dropdown'
import axios from 'axios';
import _ from 'lodash';

let data = [{
  value:'Admin',id:1
},
{
  value:'Owner',id:2
}];

var data1=[];
var test = [];
let without = [];
const role = [];

class resident extends Component {
  
  state = {
    fulldata:[],
    query:'',
    residentList:[],
    dataSource:[],
    selectedRoleData: 0,
    units: [],
    memberList: [],
    loading: true,
  }

  static navigationOptions = {
    title: 'resident',
    header: null
  }

  residentialListGetMethod=()=>{
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    // const { units } = this.state;
    let units = params.data.sort((a, b) => a.unit.localeCompare(b.unit));

    const promises = [];

    let completeList = [];
    let comp = this;
    let admins = _.map(units, (admin, index) => {
      console.log(admin.admin)
      if(admin.admin) {
        // promises[index] = axios.get(`http://${global.oyeURL}/oyeliving/api/v1/Member/GetMemberListByAccountID/2180`, {
        promises[index] = axios.get(`http://${global.oyeURL}/oyeliving/api/v1/Member/GetMemberListByAccountID/${admin.admin}`, {
          headers: {
            'Content-Type': 'application/json',
            "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
          },
        })
        .then((res) => {
          if(res.data.success) {
            let responseData = res.data.data;
            return responseData;
          }
        })
      }
    })

    Promise.all(promises)
    .then(function(values, index) {
      completeList = values;
      console.log('values', values)

      let indexValue = _.map(completeList, (value, index) => {
        return { ...value, id: index };
      });
      
      indexValue.map((data, index, allData) => {
        // arr[index]; 
        _.map(data, (mem, i, j) => {
          // console.log('mem', mem)
          // console.log('i', i)
          // console.log('j', j)
            let a = _.map(j.memberListByAccount, (sorted) => {
              return { ...sorted, id: j.id }
            })

            test.push(a);
          return mem
        })

      })

      let filtered = test.filter(function (el) {
        return el.length != 0;
    })

      // console.log('filtered', filtered);
      
        _.map(filtered, (value) => {
        _.map(value, (data) => {

          if(data.unUnitID === units[data.id].unitid && data.mrmRoleID === 1) {
            role.push({ ...data, isAdmin: true });
          } else {
            // role.push({ ...data, isAdmin: false });
          }

        })
      })

      let freeDup = _.unionBy(role, 'acMobile');

      console.log(freeDup);

      // secUnits = units;

      secUnits = _.map(units, (data, i) => {
        return { ...data, isAdmin: false }
      })

      secArr = _.map(units, (data, i) => {
        if(freeDup[i]) {
          secUnits[freeDup[i].id].isAdmin = true
          console.log(secUnits[freeDup[i].id].isAdmin)
        } else {
        }
      })

      console.log(secArr)
      console.log(secUnits)
      let newData = [ ...secUnits ]
      comp.setState({ residentList: newData, loading: false });

    })
    .catch((error, index )=> {
      console.log(error)
      console.log(index)
    })

  }

  changeRole = () => {
    //http://localhost:54400/oyeliving/api/v1/MemberRoleChangeToAdminOwnerUpdate
    const url = `http://${global.oyeURL}/oyeliving/api/v1/MemberRoleChangeToOwnerToAdminUpdate`;
    
    console.log(url)
    requestBody = {
      "ACMobile":this.state.selectedRoleData.uoMobile,
      "UNUnitID": this.state.selectedRoleData.unitid,
    "MRMRoleID" : this.state.selectedRoleData.selRolId,
      // global.MyOYEMemberID 
    }

    fetch(url, {

      method: 'POST',

      headers: {

        'Content-Type': 'application/json',

        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",

      },
      body: JSON.stringify(requestBody)
     

    })
    
      .then((response) => response.json())

      .then((responseJson) => {
        console.log("%%%%%%%%%%", responseJson)
        this.props.navigation.goBack()
        
      })
      .catch((error) => {
        console.log('err ' + error)
        Alert.alert("No Data for Selected");
      })
  }

  selectRole = (item, index) => {
    let sortedList = this.state.residentList.sort((a, b) => a.unit.localeCompare(b.unit));
    // console.log(sortedList)
    return (
      <Dropdown
        label='Select Role'
        value= {data.value}
        data={data}
        containerStyle={20}
        onChangeText={(val, vals) => {
          // console.log(val, vals)
          let currSel = sortedList[index];
          let value = { ...currSel, selRolId: vals = vals+1, selRolName: val }
          this.setState({ selectedRoleData: value })
          // console.log("mobie",this.state.selectedRoleData.uoMobile)
        }}
      /> 
    )
    
  }

  handleSearch = text => {
    const { residentList } = this.state;
    const {params} = this.props.navigation.state;
    this.setState({ query:text });

    let sortResident = params.data;

    
    this.setState({ residentList:  [ ...sortResident.filter(item => item.unit.toUpperCase().includes(text) || item.name.toUpperCase().includes(text)  )  ]})
  }

  render() {
    const {params} = this.props.navigation.state;
    return (
      <View style = {{flex:1, flexDirection: 'column' }}>
        <NavigationEvents 
          onDidFocus={payload => {
            residentList = params.data;
            this.setState({ residentList: residentList.sort((a, b) => a.unit.localeCompare(b.unit)) });
            residentList.sort((a, b) => a.unit.localeCompare(b.unit))
            this.setState({ units: residentList })
          }}
        />
      <SafeAreaView style={{backgroundColor:'orange'}}>
            <View style={[styles.viewStyle1,{flexDirection:'row'}]}>
                <View style={styles.viewDetails1}>
                <TouchableOpacity onPress={()=> {this.props.navigation.navigate('ResDashBoard')}}>
                <View style={{ height:hp("3%"),width:wp("5%"),alignItems:'center',justifyContent:'center'}}>
                  <Image 
                    resizeMode="contain" 
                    source={require('../icons/back.png')} 
                    style={styles.viewDetails2}
                  />
                </View>
                    </TouchableOpacity>  
                </View>
                <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
                    <Image style={[styles.image1]} source={require('../icons/OyeSpace.png')}/>
                </View>
                <View style={{flex:0.2, }}>
                    {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
                </View>
            </View>
            <View style={{borderWidth:1,borderColor:'orange'}}></View>
        </SafeAreaView>
        <View style={styles.textWrapper}>
        <Text style={styles.residentialListTitle}> Resident List </Text>  
        <View style={{flexDirection:'row'}}>
        <View style={{ flex:0.8,height:hp("5.5%"),marginStart:hp("2%")}}>
          <TextInput style={styles.viewDetails3} placeholder="  search...." round autoCapitalize="characters"  onChangeText = {this.handleSearch}/>
        </View>
        <View style={{flex:0.3,height:hp("5.5%"),alignItems:'flex-end'}}>
                <View style={{alignItems:'flex-end',marginEnd:hp("2%")}}>
                {this.state.selectedRoleData.selRolId == 1 || this.state.selectedRoleData.selRolId == 2 ?  
                <Button rounded warning style={{height:hp('5.5%'),width:wp('19%')}} onPress ={() => {this.changeRole()}}><Text style={{color:'white',paddingStart:hp(' 0.9%')}}>  Update</Text></Button>
                : <Button rounded  style={styles.viewDetails4} ><Text style={{color:'white',paddingStart:hp('0.9%')}}>  Update</Text></Button> }
                </View>
                </View>
                </View>
          <View style={styles.viewDetails}>
            
              <View style={{flex:1}} >
                {this.state.loading ? <Text> Loding </Text> : 
                <FlatList
                    data={this.state.residentList}
                    keyExtractor={(item, index) => item.unit + index}
                    extraData={this.state.residentList}
                    renderItem={({ item, index }) =>
                    <Card style={{height:hp("14%")}}>
                      <View style={{height: 1, backgroundColor: 'lightgray'}}/>
                      <View style={{flexDirection:'row',flex:1}}>
                              <View style={{flex:1}}>
                              <View Style={{flexDirection:'column'}}>
                                  <Text style={styles.textDetails}>{`Name: ${item.name}`}</Text>
                                  <Text style={styles.textDetails}>{`Unit: ${item.unit}`}</Text>
                                  <Text style={styles.textDetails}>{`Role: ${item.role}`}</Text>
                      
                              </View>
                              </View>
                            
                      <View style={{flex:0.5,marginRight:hp("3%")}}>
                            {item.role == 'Owner' ? this.selectRole(item, index): <Text>       </Text> }
                            {item.isAdmin && item.role=='Owner' ?   <Text> is Admin  </Text> : <Text> Not Admin </Text> }
                      </View>
                      </View>
                      <View style={{height: 1, backgroundColor: 'lightgray'}}/>
                    </Card>
                    
                }/>
              }
                </View>
                

            </View>
          </View>
         </View>

    )
  }
}

export default resident


const styles = StyleSheet.create({
  residentialListTitle: {
    textAlign: 'center',
    fontSize: hp("4%"),
    fontWeight: 'bold',
    marginTop: hp("2%"),
    marginBottom:hp('1%')
  },
  viewDetails: {
    flexDirection: 'column',
    flex:1,
    paddingTop:hp("0.2%"),
    paddingLeft:hp("0.5%"),
    paddingRight:hp("0.5%")
  },
  cardDetails: {
    height:60
  },
  
  textDetails: {
     
    fontSize: hp("1.9%"),
    paddingLeft: hp("5%"),
    paddingTop: hp('0.9%'),
    paddingBottom: hp('0.5%'),
    fontWeight:'bold',
    color:'black'
    
  },
  viewStyle1: {
    backgroundColor: '#fff',
    height: hp("7%"),
    width:Dimensions.get('screen').width,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative',
},
  image1: {
    width:wp("17%"),
    height:hp("12%"),
    marginRight:hp("3%")
},
textWrapper: {
  height: hp('85%'), // 70% of height device screen
  width: wp('100%')   // 80% of width device screen
},
viewDetails1:{
  flex:0.3,
  flexDirection:'row',
   justifyContent:'center',
   alignItems:'center', 
   marginLeft:3
},
viewDetails2:{
  alignItems:'flex-start',
  justifyContent:'center',
  width: hp("3.5%"),
  height:hp("3.5%"),
  marginTop: 5
  // marginLeft: 10
},
viewDetails3:{
  height:hp("5.5%"),
 backgroundColor:'#F5F5F5',
 borderRadius:hp("7%"),
 fontSize:hp("1.8%"),
 paddingLeft: hp('2%')
},
viewDetails4:{
  height:hp('5.5%'),
  width:wp('19%'),
  backgroundColor:'#DCDCDC',
  alignContent:'center'
,}
})

