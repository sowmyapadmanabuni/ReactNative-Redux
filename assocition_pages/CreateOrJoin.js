import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {Card} from "native-base"
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import OSButton from "../src/components/osButton/OSButton";
import base from "../src/base";


class CreateOrJoin extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <View style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'flex-start',}}>
                <Image
                    resizeMode={'center'}
                    style={{height:'40%',width:'100%',marginTop:20,}}
                    source={require('../icons/apartment.png')}
                />
                <Text style={{fontSize:16,color:base.theme.colors.black,marginBottom:40}}>Do you want to join association?</Text>
                <OSButton
                    height={'5%'}
                    width={'20%'}
                    borderRadius={20}
                    oSBText={'Yes'}
                    onButtonClick={() => this.props.navigation.navigate('City')}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    welcomemadan: {
        color: '#ff8c00', marginTop: hp('1%'), alignItems: 'center'
    },
    thereisnorecordofthisnum: {
        alignItems: 'center', marginBottom: hp('1%'),
        color: '#f00', fontSize: hp('2.4%'),
    },
});

const mapStateToProps = state => {
    return {
        MyFirstName: state.UserReducer.MyFirstName,
        MyLastName: state.UserReducer.MyLastName,
        MyEmail: state.UserReducer.MyEmail,
        MyMobileNumber: state.UserReducer.MyMobileNumber,
        MyISDCode: state.UserReducer.MyISDCode,

        joinedAssociations: state.AppReducer.joinedAssociations,
        champBaseURL: state.OyespaceReducer.champBaseURL,
        oyeURL: state.OyespaceReducer.oyeURL,
        MyAccountID: state.UserReducer.MyAccountID
    };
};

export default connect(
    mapStateToProps
)(CreateOrJoin);

