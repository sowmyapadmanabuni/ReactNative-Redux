import React from 'react';
import {
    View, Text, Platform,ScrollView
} from 'react-native';
import base from "../../base";
import ElevatedView from "react-native-elevated-view";

class SubscriptionManagement extends React.Component {
    constructor(props) {
        super(props);
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
                <View style={{width:'100%',height:'80%',borderWidth:1,alignItems:'center'}}>
                <Text style={{fontSize:14,color:base.theme.colors.black}}>Choose Plan</Text>
                    <View style={{height:'50%',width:'90%',borderWidth:1,marginTop:40}}>

                    </View>
                    <View style={{height:'50%',width:'90%',borderWidth:1,marginTop:40}}>

                    </View>
                </View>
            </View>
        );
    }
}

export default SubscriptionManagement;