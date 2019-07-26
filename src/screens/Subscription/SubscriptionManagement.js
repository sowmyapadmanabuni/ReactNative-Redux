import React from 'react';
import {
    View, Text, Platform,ScrollView,TouchableOpacity,Image,FlatList
} from 'react-native';
import base from "../../base";

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