import React, { Component } from 'react';
import {
  Platform, StyleSheet, Button, Text, View, TextInput,
  FlatList, ActivityIndicator, TouchableOpacity, Image, Alert,
  ScrollView
} from 'react-native';
import ActionButton from 'react-native-action-button';
//import { Fonts } from '../pages/src/utils/Fonts';

export default class adminfunction extends Component {

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ backgroundColor: '#FFF', height: '100%' }}>

        <View style={{flexDirection:'row',marginTop:45,}}>
                    <View style={{flex:1,marginRight:0, justifyContent:'center',marginLeft:'2%'}}>
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
                    <View style={{ flex: 6, alignItems:'center', justifyContent:'center',}}>
                    <Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
                        style={{height: 40, width: 95,marginBottom:5}} />
                    </View>  
                    <View style={{flex:1, marginRight:10, justifyContent:'center',}}>    
                    </View>                 
                </View> 

                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>Admin Functions</Text>
         <ScrollView>


             <View style={styles.rectangle}>
             
             {/* <View style={{flex:1,flexDirection:'row'}}>
             <TouchableOpacity style={{flex:1,flexDirection:'row',marginTop:'3%'}} onPress={()=>this.props.navigation.navigate('CreatePatrollingShift')}>
               <Image source={require('../pages/assets/images/clock_orange.png')}
                       style={{height:40,width:40}}
               />
               <Text style={{flex:1, alignSelf:'center',marginLeft:'4%'}}>Petrolling Shift Schedule</Text>
               </TouchableOpacity >        
             </View> */}
             <View style={{flex:1,flexDirection:'row'}}>
             <TouchableOpacity style={{flex:1,flexDirection:'row',marginTop:'3%'}} 
            //  onPress={()=>this.props.navigation.navigate('CheckPointListScreen')}
             >
               <Image source={require('../pages/assets/images/checkpoint_orange.png')}
                       style={{height:40,width:40}}
               />
               <Text style={{flex:1,alignSelf:'center',marginLeft:'4%'}}>Patrolling Check Points (Features to come)</Text>
               </TouchableOpacity>       
             </View>
             {/* <View style={{flex:1,flexDirection:'row'}}>
             <TouchableOpacity style={{flex:1,flexDirection:'row',marginTop:'3%'}} onPress={()=>this.props.navigation.navigate('SecurityDailyReportScreen')}>
               <Image source={require('../pages/assets/images/attendance_report_orange.png')}
                       style={{height:40,width:40}}
               />
               <Text style={{flex:1,alignSelf:'center',marginLeft:'4%'}}>Attendance Reports</Text>
               </TouchableOpacity>        
             </View> */}
             <View style={{flex:1,flexDirection:'row'}}>
             <TouchableOpacity style={{flex:1,flexDirection:'row',marginTop:'3%'}} onPress={()=>this.props.navigation.navigate('ViewAllVisitorsScreen')}>
               <Image source={require('../pages/assets/images/my_visitors_orange.png')}
                       style={{height:40,width:40}}
               />
               <Text style={{flex:1,alignSelf:'center',marginLeft:'4%'}}>View All Visitors</Text>
               </TouchableOpacity>       
             </View>
             <View style={{flex:1,flexDirection:'row'}}>
             <TouchableOpacity style={{flex:1,flexDirection:'row',marginTop:'3%'}} 
            //  onPress={()=>this.props.navigation.navigate('AdminSettingsScreen')}
            >
               <Image source={require('../pages/assets/images/admin_functions.png')}
                       style={{height:40,width:40}}
               />
               <Text style={{flex:1,alignSelf:'center',marginLeft:'4%'}}>Admin Settings (Feature to come)</Text>
               </TouchableOpacity>        
             </View>
             <View style={{flex:1,flexDirection:'row'}}>
             <TouchableOpacity style={{flex:1,flexDirection:'row',marginTop:'3%'}} 
             onPress={()=>this.props.navigation.navigate('AssnListScreen')}
            >
               <Image source={require('../pages/assets/images/join_association_orange.png')}
                       style={{height:40,width:40}}
               />
               <Text style={{flex:1,alignSelf:'center',marginLeft:'4%'}}>Join Association</Text>
               </TouchableOpacity>        
             </View>
             <View style={{flex:1,flexDirection:'row'}}>
            <TouchableOpacity style={{flex:1,flexDirection:'row',marginTop:'3%',marginBottom:'3%'}} 
            onPress={()=>this.props.navigation.navigate('CreateAssnScreen')}
            >
               <Image source={require('../pages/assets/images/building.png')}
                       style={{height:40,width:40}}
               />
               <Text style={{flex:1,alignSelf:'center',marginLeft:'4%'}}>Create Association</Text>
            </TouchableOpacity>            
             </View>
             <View style={{flex:1,flexDirection:'row'}}>
            <TouchableOpacity style={{flex:1,flexDirection:'row',marginTop:'3%',marginBottom:'3%'}} 
            onPress={()=>this.props.navigation.navigate('CreateBlockScreen')}
            >
               <Image source={require('../pages/assets/images/building.png')}
                       style={{height:40,width:40}}
               />
               <Text style={{flex:1,alignSelf:'center',marginLeft:'4%'}}>Create Blocks and Units</Text>
            </TouchableOpacity>            
             </View>
             {/* <View style={{flex:1, flexDirection:'row'}}>
             <TouchableOpacity style={{flex:1,flexDirection:'row',marginTop:'3%',marginBottom:'3%'}} onPress={()=>this.props.navigation.navigate('SubscriptionScreen')}>
               <Image source={require('../pages/assets/images/building.png')}
                       style={{height:40,width:40}}
               />
               <Text style={{flex:1,alignSelf:'center',marginLeft:'4%'}}>Subscriptions</Text>
            </TouchableOpacity>
             </View> */}
             </View>
       
          </ScrollView>
        
         
      </View>

    );

  }

  
}

const styles = StyleSheet.create({

  container: {  flex: 1, alignItems: 'center', backgroundColor: 'white' },

  rectangle: { flex: 1, backgroundColor: 'white', padding: 10, borderColor: 'orange',
    marginLeft: 5, marginRight: 5, marginTop: 5, borderRadius: 2, borderWidth: 1,
  },



});
