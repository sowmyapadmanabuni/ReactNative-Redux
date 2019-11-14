import {Platform, StyleSheet} from "react-native";
import base from '../../../base'

const AddExpenseStyles = StyleSheet.create({
    safeArea:{
        height:'110%',
        width:'100%',
        alignItems:'center',
    },
    mainContainer:{
        height:'110%',
        width:'95%',
        backgroundColor:base.theme.colors.white,
    },
    scrollContainer:{
        borderWidth:1,
        borderColor:base.theme.colors.lightgrey,
        paddingLeft:6,
        paddingRight:6,
        alignItems:'center',
        justifyContent:'center'
    },
    headerView:{
        alignItems:'center',
        justifyContent:'center',
        paddingTop:10,
        paddingBottom:20,
      //  height:'10%'
    },
    headerText:{
        fontSize:16,
        color:base.theme.colors.primary,
       // fontFamily:base.theme.fonts.medium
    },
    subHeadView:{
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:base.theme.colors.primary,
        paddingTop:10,
        paddingBottom:10,
        width:'95%',
        alignSelf:'center',
       // height:'7%'
    },
    subHeadText:{
        fontSize:14,
        color: base.theme.colors.white
    },
    mainView:{
        alignItems:'center',
        justifyContent:'center',
        width:'95%',
        alignSelf: 'center',
        height:'100%',
    },
    textInputView:{
       // height: '10%',
        width: '100%',
    }
});
export default AddExpenseStyles;
