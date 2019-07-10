import {StyleSheet} from "react-native";
import base from '../../../../base'
import {heightPercentageToDP as wp} from "react-native-responsive-screen";

const StaffReportStyle = StyleSheet.create({
    mainContainer: {
       flex:1,
    },
    detailsMainView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '15%',
        width: '90%',
        justifyContent: 'space-between',
        marginBottom:10,
        alignSelf:'center'
    },
    flatListStyle:{
        height:'20%',
        width:"90%",
        borderWidth: 1,
    },
    tableHeader:{
        height:"8%",
        alignItems: "center",
        backgroundColor:base.theme.colors.primary,
        borderWidth:1,
        borderColor:base.theme.colors.white,
        flexDirection:'row',
    },
    textView:{
        flexDirection:'row',
        width:41,
        height:'100%',
        alignItems:'center',
        marginLeft:5
    },
    headerText:{
        color:base.theme.colors.white,
        fontSize:12,
        marginLeft: 5
    },
    tableHead: {
        flexDirection:'row',
        height: 40,
        width:wp('56%'),
        backgroundColor:base.theme.colors.primary
    },
    textHead: {
        textAlign: 'left' ,
        color:base.theme.colors.white,
        fontSize:12
    },
    tableData:{
        textAlign: 'center',
        marginTop:5,
        marginBottom:5,
        fontSize: 8
    },
    tableView:{
        borderWidth: 2,
        borderColor: base.theme.colors.lightgrey
    },
    tableMainView:{
        height:'40%',
        width:'100%',
        alignItems:'center',
        justifyContent:'center',
        borderWidth:0.5
    },
    bottomView:{
        width:'60%',
        flexDirection: 'row',
        marginBottom:10,
        alignItems:'center',
        alignSelf:'center',
        justifyContent:'center',
        height:'15%',
    },
    arrowIcon:{
        height:30,
        width:30,
        alignSelf:'center',
        marginTop:5
    },
    viewPagerIcons:{
        alignItems:'center',
        justifyContent:'space-between',
        alignSelf:'center',
    },
    bottomTabView:{
        height:35,
        width:35,
        borderRadius:35/2,
        justifyContent:'center',
        alignSelf:'center',
        elevation:2,
        shadowColor: base.theme.colors.darkgrey,
        alignItems:'center',
        marginLeft:5,
        marginRight:5,
    },
    cellData:{
        fontSize:12,
        textAlign:'center',
    },
    scrollViewTable:{
        height:'70%',
        width:'100%'
    }
});

export default StaffReportStyle;