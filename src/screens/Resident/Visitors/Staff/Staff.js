import React from 'react';
import {
    Image, TouchableOpacity,
    View,
} from 'react-native';
import {connect} from "react-redux";
import base from "../../../../base";
import {Dropdown} from "react-native-material-dropdown";
import HeaderStyles from "../../../../components/dashBoardHeader/HeaderStyles";

class Staff extends React.Component {
    render() {
        let StaffList=[]
        return(
            <View style={{flex:1}}>
                <View style={{width:'100%',height:'10%', backgroundColor:base.theme.colors.primary}}>
                </View>
                <View style={{width:'100%',height:'8%',backgroundColor:base.theme.colors.lightgrey}}>
                </View>
                <View style={{width:'90%',height:'20%', marginLeft:20,marginRight:20, marginTop:10}}>
                <Dropdown
                    value="Select Staff"
                    data={StaffList}
                    textColor={base.theme.colors.black}
                    inputContainerStyle={{}}
                    dropdownOffset={{top: 10, left:0,}}
                    containerStyle={{}}
                    onChangeText={(value, index) =>
                        this.staffChange(value, index)
                    }
                />
                </View>
                <View style={{width:'100%',height:'30%', alignItems:'center'}}>
                    <Image style={HeaderStyles.imageStyles}
                           source={{uri:'https://via.placeholder.com/150/ff8c00/FFFFFF'}}>
                    </Image>
                    <TouchableOpacity>
                        {/*<Image style={HeaderStyles.imageStyles}*/}
                        {/*       source={require("../../../icons/headerLogo.png")}>*/}
                        {/*</Image>*/}
                    </TouchableOpacity>


                </View>
            </View>
        );

    }
    staffChange(){

    }
}

const mapStateToProps = state => {
    return {
        userReducer: state.UserReducer,
    };
};

export default connect(mapStateToProps)(Staff)

