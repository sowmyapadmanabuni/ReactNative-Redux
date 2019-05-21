import React from 'react';
import { Text, View, SafeAreaView,Dimensions, Image, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Header = (props) =>  {
    return (
        <SafeAreaView style={{backgroundColor:'orange'}}>
            <View style={[styles.viewStyle,{flexDirection:'row'}]}>
                <View style={{flex:0.3,flexDirection:'row', justifyContent:'center',alignItems:'center', marginLeft:16}}>
                    <TouchableOpacity onPress={() => props.navigate.navigate('EditProfileScreen')}>
                        <View style={{width:30,height:30, borderRadius:15, borderColor:'orange',borderWidth:1, justifyContent:'center',alignItems:'center'}}>
                            <Text>{global.MyFirstName[0].toUpperCase()}{global.MyLastName[0].toUpperCase()}</Text>
                        </View>
                        {/* <Image style={{width:30,height:30, borderRadius:15, borderColor:'orange',borderWidth:1,}} source={{ uri: global.viewImageURL + 'PERSON' + global.MyAccountID + '.jpg' }}/> */}
                    </TouchableOpacity>
                    <Text style={{marginLeft:5,fontWeight:'bold'}}>{global.MyFirstName}</Text>
                </View>
                <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
                    <Image style={[styles.image]} source={require('../icons/OyeSpace.png')}/>
                </View>
                <TouchableWithoutFeedback onPress={() => props.navigate.navigate('NotificationScreen')}>
                    <View style={{flex:0.2, alignItems:'center',justifyContent:'center' }}>
                        <Image source={require('../icons/notifications.png')} style={{width:hp("4.5%"), height:hp("4%"), justifyContent:'center',alignItems:'flex-end' }}/>
                    </View>
                </TouchableWithoutFeedback>
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