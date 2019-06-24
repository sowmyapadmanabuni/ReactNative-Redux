import React, { Component } from 'react'
import { Platform,  Text,  } from 'react-native'
import { StyleSheet, ScrollView, View, FlatList,Button ,Image,ActivityIndicator, TouchableOpacity} from 'react-native'
import ImageLoad from 'react-native-image-placeholder';
import ActionButton from 'react-native-action-button';
//import { Fonts } from '../pages/src/utils/Fonts'
import PTRView from 'react-native-pull-to-refresh';

export default class ViewFamilyMembersList extends Component{
  constructor() {
    super()
    this.state = {
      dataSource: [],
      isLoading: true
    }
    console.log('ViewFamilyMembersList ','constructor');
  }
  static navigationOptions = {
    title: 'Family Members List',
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
        <TouchableOpacity
              style={styles.mybutton1}
              onPress={() => navigate('Unit', { id: item.associationID })}  /*Products is navigation name*/>
              <Text style={styles.lighttext}> JOIN </Text>
            </TouchableOpacity>
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
    this.refresh();

  }
      refresh(){

    const url = global.oye247BaseURL+'FamilyMember/GetFamilyMemberListByAssocID/'+global.SelectedAssociationID
    console.log('ViewFamilyMembersList','componentdidmount'+url)

    fetch(url, {
      method: 'GET',
      headers: {
       'Content-Type': 'application/json',
       "X-OYE247-APIKey":"7470AD35-D51C-42AC-BC21-F45685805BBE",
     },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('ViewFamilyMembersList res ',responseJson+' ');

        this.setState({
          dataSource: responseJson.data.familyMembers.filter(x => x.meMemID ===global.MyOYEMemberID),
          isLoading: false
        })
      
      })
    
      .catch((error) => {
        console.log('ViewFamilyMembersList error ',error+' ');

        this.setState({
          isLoading: false
        })
      })
      return new Promise((resolve) => {
        setTimeout(() => { resolve() }, 2000)
          });
  }

/**
                    "fmid": 4,
                "fmfName": "Sowmya",
                "fmlName": "Padmanabhuni",
                "fmMobile": "+919490791523",
                "fmImgName": "Somujpeg",
                "meMemID": 2,
                "unUnitID": 1,
                "fmRltn": "Sister",
                "fmisdCode": null,
                "asAssnID": 6,
                "fmdCreated": "2018-11-10T04:14:51",
                "fmdUpdated": "0001-01-01T00:00:00",
                "fmIsActive": true */    

               /*  global.viewImageURL = 'http://'+global.oyeURL +'/Images/';
    global.uploadImageURL = 'http://'+global.oyeURL +'/oyeliving/OyeLivingApi/v1/';
    //http://122.166.168.160/Images/assigned_task_orange.png
    //http://122.166.168.160/oyeliving/api/V1/association/upload */
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ backgroundColor: '#FFF' }}>
    
<View style={{ height: '100%' }}>
<View>

<View style={{flexDirection:'row',}}>
                    <View style={{flex:1, marginTop:43,marginRight:0, justifyContent:'center',marginLeft:10}}>
                        <TouchableOpacity onPress={() => navigate(('ResDashBoard'), { cat: '' })}
                        >
                        <Image source={require('../pages/assets/images/back.png')}
                        style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                        </TouchableOpacity>
                    </View>
                    {/* <TouchableOpacity 
                        style={{paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 1, alignItems: 'center', flexDirection: 'row',
                            paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:'6%'}}
                            onPress={() => this.props.navigation.navigate('SideMenu')}>
                        <Image source={require('../pages/assets/images/menu_button.png')}
                            style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                    </TouchableOpacity> */}
                    <View style={{ flex: 5, alignItems:'center', justifyContent:'center',}}>
                    <Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
                        style={{height: 40, width: 95, marginTop: 45,marginBottom:5}} />
                    </View>  
                    <View style={{flex:1,marginTop:45, marginRight:10, justifyContent:'center',}}>    
                    </View>                 
                </View> 

                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>My Family Members</Text>
{/* <View
style={{
paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
marginTop:25,
}}>
<TouchableOpacity onPress={() => navigate(('ResDashBoard'), { cat: '' })}
style={{ flex: 1 }}>
<Image source={require('../pages/assets/images/back.png')}
style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
</TouchableOpacity>
<Text style={{ flex: 2, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>
<Text style={{ flex: 6, fontSize: 16, color: 'black', alignSelf: 'center',fontWeight:'bold',justifyContent:'center',alignContent:'center',marginLeft:20 }}>My Family Members</Text>
<View style={{ flex: 3, alignSelf: 'center' }}>
<Image source={require('../pages/assets/images/OyeSpace_hor.png')}
style={{
height: 35, width: 105, margin: 5,
alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
}} />
</View>
</View>
<View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View> */}
</View>
        {this.state.isLoading
        ?
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#330066" animating />
        </View>
        :
        <View style={styles.container}> 
<View style={{backgroundColor:'Mystic'}}>
          <Text style={{fontSize: 10, color: 'black', alignSelf: 'center',justifyContent:'center',alignContent:'center'}}>Pull to refresh!</Text>
        </View>
        <PTRView onRefresh={this.refresh()} >
          <FlatList
            data={this.state.dataSource}
            renderItem={({item}) => 
            <View
            style={styles.rectangle}> 
                        <View style={{flex: 3, flexDirection:'row',  padding: 2  }}>
                        <ImageLoad style={{ width: 80, height: 100,marginRight:10, }}
     loadingStyle={{ size: 'large', color: 'blue' }}
     source={{ uri: global.viewImageURL+'PERSONAssociation'+global.SelectedAssociationID+'Family'+item.fmid+'.jpg' }} />                          
                        <View style={{flex: 4, flexDirection:'column' }}>
                          <Text style={styles.title}> {item.fmfName+' '+item.fmlName}</Text>
                          <Text style={styles.text}>{item.fmMobile}</Text>
                          <Text style={styles.text}> {item.fmRltn} </Text>
                       </View>
                       <TouchableOpacity
             style = {{flex:1,  backgroundColor: 'white', }}
             onPress={() => navigate('EditFamilyMemberScreen', {id:item.fmid})}>
             <Image source={require('../pages/assets/images/edit.png')}style={{height: 30, width: 30, alignItems: "flex-end", }} />

          </TouchableOpacity>
                         </View>
                         </View>
   
            }
            keyExtractor={({oyeFamilyMemberID}, index) => oyeFamilyMemberID}
            ListHeaderComponent={() => (!this.state.dataSource.length ?
              <Text style={{ alignSelf: 'center', color: 'black', marginTop: '65%' }}>No Family Members Added</Text>
              : null)
            }
          />
          
          </PTRView>
        </View>
         }
         <ActionButton buttonColor="#FA9917" onPress={() => navigate('AddFamilyMemberScreen', { cat: '' })}  >
         </ActionButton>
       {/*   <ActionButton buttonColor="rgba(250,153,23,1)" onPress={() => navigate('AddFamilyMemberScreen', { cat: ' ' })}  >
          </ActionButton> */}
       </View>
     </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {    flex: 1,    backgroundColor: '#F5FCFF',  },
  rectangle: { flex: 1, backgroundColor: 'white', padding:10, borderColor: 'orange',
 marginLeft:5, marginRight:5, marginTop:5, borderRadius: 2, borderWidth: 1, },
  title: { fontSize: 14,  color : 'black', marginBottom:8,fontWeight:'bold',marginLeft:5},
  mybutton1: {   backgroundColor: 'orange',  paddingTop:8,  paddingRight:12,   paddingLeft:12,
  paddingBottom:8,  borderColor: 'white',  borderRadius: 0,  borderWidth: 2,  textAlign:'center', },
  text: { fontSize: 12, color : 'black',marginLeft:5 },
  lighttext: { fontSize: 13,  color : 'white', },

});