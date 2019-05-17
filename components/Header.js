import React from 'react';
import { Text, View, SafeAreaView,Dimensions, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Header = (props) =>  {
    return (
        <SafeAreaView style={{backgroundColor:'orange'}}>
            <View style={[styles.viewStyle,{flexDirection:'row'}]}>
                <View style={{flex:0.3,flexDirection:'row', justifyContent:'center',alignItems:'center', marginLeft:16}}>
                    <Image style={{width:30,height:30, borderRadius:15, borderColor:'orange',borderWidth:1,}} source={require('../icons/OyeSpace.png')}/>
                    <Text style={{marginLeft:5}}>Manas</Text>
                </View>
                <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
                    <Image style={[styles.image]} source={require('../icons/OyeSpace.png')}/>
                </View>
                <View style={{flex:0.2, }}>
                    <Image source={require('../icons/notifications.png')} style={{width:wp("5%"), height:hp("5%"), justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/>
                </View>
            </View>
            <View style={{borderWidth:1,borderColor:'orange'}}></View>
        </SafeAreaView>
        
    );
};

const styles = {
    viewStyle: {
        backgroundColor: '#fff',
        height: hp("7%"),
        width:Dimensions.get('screen').width,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
        position: 'relative',
    },
    image: {
        width:wp("17%"),
        height:hp("12%"),
        marginRight:30
    },
};

export default Header;