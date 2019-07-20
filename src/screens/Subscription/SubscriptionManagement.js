import React from 'react';
import {
    View, Text, Platform,ScrollView,TouchableOpacity,Image,FlatList
} from 'react-native';
import base from "../../base";
import ElevatedView from "react-native-elevated-view";

class SubscriptionManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            offerTailsList:[1,2,3,4,5]
        }
    }
    render(){
        return(
            <View style={{flex:1,alignItems:'center'}}>
                <View style={{width:'100%',height:'10%',alignItems:'center',backgroundColor:base.theme.colors.white,elevation:1,
                    shadowColor: base.theme.colors.darkgrey,
                    shadowOffset: {width: 0, height: Platform.OS==='ios'?3:2},
                    shadowOpacity: Platform.OS==='ios'?0.3:0.8,
                    shadowRadius: 2,}}>
                    <Text style={{fontSize:18,color:base.theme.colors.primary,marginTop:15}}>
                       Subscription
                    </Text>
                </View>
                <ScrollView style={{width:'100%',height:'100%',}} contentContainerStyle={{alignItems:'center'}} showsVerticalScrollIndicator={false}>
                <View style={{width:'90%',alignItems:'center',}}>
                    <View style={{width:'100%',height:'200%',alignItems:'center',}}>
                    <View style={{height:'6%',width:'100%',alignItems:'center',}}>
                        <Text style={{fontSize:14,color:base.theme.colors.black,marginTop:10}}>Choose Plan</Text>
                    </View>
                    <View style={{width:'100%',alignItems:'center',height:'100%',marginBottom:10,borderWidth:1}}>
                        <View style={{height:'100%',width:'100%',borderWidth:1,flexDirection:'column',
                        alignItems:'flex-start'}}>
                            <View style={{width:'100%', height:'6%',flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
                                <Text style={{fontSize:12,color:base.theme.colors.primary,}}>
                                    Existing Subscription -
                                </Text>
                                <Text style={{fontSize:12,color:base.theme.colors.black,}}>
                                    Valid Till:
                                    <Text style={{fontSize:12,color:base.theme.colors.primary}}>07-dec-2019</Text>
                                </Text>
                            </View>
                            <View style={{width:'100%',height:'15%',borderWidth:1,flexDirection:'row'}}>
                                <View style={{width:'25%',height:'100%',borderWidth:1}}>
                                    <View style={{width:'100%',height:'25%',borderWidth:1,borderColor:'red',
                                        backgroundColor:base.theme.colors.lightgrey,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={{fontSize:12,color:base.theme.colors.black}}>Device</Text>
                                    </View>
                                    <View style={{width:'100%',height:'75%',borderWidth:1,borderColor:'red'}}>
                                        <View style={{flexDirection:'row',width:'100%',height:'33%',alignItems:'center'}}>
                                            <TouchableOpacity>
                                        <Text style={{fontSize:12,color:base.theme.colors.hyperLink,textDecorationLine:'underline'}}>Platinum</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{flexDirection:'row',width:'100%',height:'33%',alignItems:'center'}}>
                                            <TouchableOpacity>
                                        <Text style={{fontSize:12,color:base.theme.colors.hyperLink,textDecorationLine:'underline'}} >Gold</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{flexDirection:'row',width:'100%',height:'33%',alignItems:'center' }}>
                                            <Text style={{fontSize:12,color:base.theme.colors.black}}>Biometric</Text>
                                        </View>

                                    </View>
                                </View>
                                <View style={{width:'50%',height:'100%',borderWidth:1}}>
                                    <View style={{width:'100%',height:'25%',borderWidth:1,borderColor:'red',
                                        backgroundColor:base.theme.colors.lightgrey,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={{fontSize:12,color:base.theme.colors.black}}>Monthly Unit Price</Text>
                                    </View>
                                    <View style={{width:'100%',height:'75%',borderWidth:1,borderColor:'red'}}>
                                        <View style={{flexDirection:'row',width:'100%',height:'33%',alignItems:'center',justifyContent:'center'}}>
                                            <Text style={{fontSize:12,color:base.theme.colors.black}}>{base.utils.strings.rupeeIconCode}</Text>

                                            <Text style={{fontSize:12,color:base.theme.colors.black}}>1990</Text>
                                        </View>
                                        <View style={{flexDirection:'row',width:'100%',height:'33%',alignItems:'center',justifyContent:'center'}}>
                                            <Text style={{fontSize:12,color:base.theme.colors.black}}>{base.utils.strings.rupeeIconCode}</Text>

                                            <Text style={{fontSize:12,color:base.theme.colors.black}}>1990</Text>
                                        </View>
                                        <View style={{flexDirection:'row',width:'100%',height:'33%',alignItems:'center',justifyContent:'center' }}>
                                            <Text style={{fontSize:12,color:base.theme.colors.black}}>{base.utils.strings.rupeeIconCode}</Text>

                                            <Text style={{fontSize:12,color:base.theme.colors.black}}>1990</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{width:'25%',height:'100%',borderWidth:1}}>
                                    <View style={{width:'100%',height:'25%',borderWidth:1,borderColor:'red',
                                        backgroundColor:base.theme.colors.lightgrey,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={{fontSize:12,color:base.theme.colors.black}}>Quantity</Text>
                                    </View>
                                    <View style={{width:'100%',height:'75%',borderWidth:1,borderColor:'red'}}>
                                        <View style={{flexDirection:'row',width:'100%',height:'33%',alignItems:'center',justifyContent:'space-around'}}>
                                            <TouchableOpacity>
                                                <Image style={{height:20,width:20,alignSelf:'center'}}
                                                       source={require('../../../icons/add_btn.png')}
                                                />
                                            </TouchableOpacity>

                                            <Text style={{fontSize:12,color:base.theme.colors.black}}>1990</Text>
                                            <TouchableOpacity>
                                                <Image style={{height:20,width:20,alignSelf:'center'}}
                                                       source={require('../../../icons/add_btn.png')}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{flexDirection:'row',width:'100%',height:'33%',alignItems:'center',justifyContent:'space-around'}}>
                                            <TouchableOpacity>
                                                <Image style={{height:20,width:20,alignSelf:'center'}}
                                                       source={require('../../../icons/add_btn.png')}
                                                />
                                            </TouchableOpacity>

                                            <Text style={{fontSize:12,color:base.theme.colors.black}}>1990</Text>
                                            <TouchableOpacity>
                                                <Image style={{height:20,width:20,alignSelf:'center'}}
                                                       source={require('../../../icons/add_btn.png')}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{flexDirection:'row',width:'100%',height:'33%',alignItems:'center',justifyContent:'space-around' }}>
                                            <TouchableOpacity>
                                                <Image style={{height:20,width:20,alignSelf:'center'}}
                                                       source={require('../../../icons/add_btn.png')}
                                                />
                                            </TouchableOpacity>

                                            <Text style={{fontSize:12,color:base.theme.colors.black}}>1990</Text>
                                            <TouchableOpacity>
                                                <Image style={{height:20,width:20,alignSelf:'center'}}
                                                       source={require('../../../icons/add_btn.png')}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{height:'14%',width:'100%',borderWidth:1,borderColor:base.theme.colors.hyperLink}}>
                                <FlatList
                                    data={this.state.offerTailsList}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={(item,index) => this.arrangeTails(item,index)}
                                    extraData={this.state}
                                    horizontal={true}
                                />
                            </View>
                            <View style={{height:'3%',width:'100%',borderWidth:1,borderColor:base.theme.colors.lightgrey,alignItems:'center',justifyContent:'center'}}>
                                <Text style={{fontSize:12,color:base.theme.colors.primary}}> Sub Total -
                                    <Text style={{color:base.theme.colors.black}}> {base.utils.strings.rupeeIconCode}1239030</Text>
                                </Text>
                            </View>

                    </View>
                        {/*<View style={{height:'3%',width:'100%', backgroundColor:base.theme.colors.primary,borderRadius:20,position:'absolute'}}>

                        </View>*/}
                    </View>
                    </View>
                   {/* <View style={{width:'100%',alignItems:'center',height:'100%',}}>
                        <View style={{height:'100%',width:'90%',borderWidth:1,}}>

                        </View>
                        <View style={{height:'20%',width:'95%', backgroundColor:base.theme.colors.primary,borderRadius:20,position:'absolute'}}>

                        </View>
                    </View>*/}
                </View>
                </ScrollView>
            </View>
        );
    }
    arrangeTails(item,index){
        console.log('TailsData',item,index)
        return(
            <View style={{alignItems:'center',justifyContent:'center'}}>
            <TouchableOpacity style={{ width:80,height:80,borderRadius:15,backgroundColor:base.theme.colors.grey,
                marginLeft:20,alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:10}}>6 Months</Text>
                <Text style={{fontSize:12,textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}>{base.utils.strings.rupeeIconCode}20000</Text>
                <Text style={{fontSize:14,}}>{base.utils.strings.rupeeIconCode}20000</Text>
                <Text style={{fontSize:10,}}>Save 5%</Text>

            </TouchableOpacity>
                <View style={{height:40,width:80,marginLeft:20,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:8}}>Valid Till</Text>
                    <Text style={{fontSize:10,color:base.theme.colors.primary}}>28-NOV-2021</Text>
                </View>
            </View>
        )


    }
}

export default SubscriptionManagement;