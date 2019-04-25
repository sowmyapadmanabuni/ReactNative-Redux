
import { StyleSheet } from 'react-native'
import { Fonts } from './src/utils/Fonts'

const mystyles = StyleSheet.create({

  /* 
   title:{  fontSize: 14, fontFamily: Fonts.OpenSansBold , color : 'black', marginBottom:8, },
   textcenter:{   fontSize: 10, fontFamily: Fonts.OpenSansRegular , color : 'black', justifyContent:'center',   },
   */

container: {  marginTop: 150, flexWrap: 'wrap', justifyContent: 'center', },

title: { fontSize: 18, fontFamily: Fonts.Tahoma, color : 'black', marginBottom:8,fontWeight:'bold'},

title1: { fontSize: 14, fontFamily: Fonts.OpenSansBold , color : 'black', marginBottom:8,},

formtitle: { fontSize: 16, fontFamily: Fonts.OpenSansBoldItalic , color : 'black', marginBottom:8,marginLeft:8},

subtext: { fontSize: 12, fontFamily: Fonts.OpenSansRegular , color : 'black', marginBottom:10, },

text: { fontSize: 10, fontFamily: Fonts.OpenSansRegular , color : 'black', },

lighttext: { fontSize: 13, fontFamily: Fonts.OpenSansRegular , color : 'white', },

hightext: { fontSize: 12, fontFamily: Fonts.OpenSansBold , color : 'black', },

rectangle: { flex: 1, backgroundColor: 'white', padding:10, borderColor: 'orange',
 marginLeft:5, marginRight:5, marginTop:5, borderRadius: 2, borderWidth: 1, },

 rectangle1: { flex: 1, backgroundColor: 'white', padding:10, borderColor: 'orange',
 marginLeft:5, marginRight:5, marginTop:5,marginBottom:20, borderRadius: 2, borderWidth: 1, },

 formrectangle: { flex: 1, backgroundColor: 'white', borderColor: 'orange',
 marginLeft:8, marginRight:8,marginBottom:8, borderRadius: 0, borderWidth: 1.5, },

mybutton: { backgroundColor: 'orange',width:'50%', paddingTop:8, marginRight:'25%', marginLeft:'25%',
paddingBottom:8, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign:'center', color:'white',
justifyContent:'center'},

mybutton1: {   backgroundColor: 'orange',  paddingTop:8,  paddingRight:12,   paddingLeft:12,
  paddingBottom:8,  borderColor: 'white',  borderRadius: 0,  borderWidth: 2,  textAlign:'center', },

yourSafetyIsPriceless :{  height: '10%',  width: '100%',   color: '#000', fontFamily: Fonts.Tahoma, 
 textAlign:'center',  fontSize: 19, //lineheight: '23px',
},

splashHeadline :{  height: '10%',  width: '100%',   color: '#000', fontFamily: Fonts.OpenSansExtraBold,
  textAlign:'center',  fontSize: 29,//lineheight: '23px',
},

openlogo: {  height: '23.42%',  width: '52.19%',},

signin: {  height: '14px',    width: '48px',     color: '#060606',  fontFamily: Fonts.Tahoma,     
 fontSize: 12, //fontweight: 700, lineheight: '14px',
},

rectangle2 :{   height: '35px',    width: '320px',    backgroundColor: '#FFF',    
  //boxshadow: 0 1px 2px 0 rgba(0,0,0,0.5),
},

hguard_name:{
  fontSize: 14, fontFamily: Fonts.OpenSansRegular ,
  color :  'black',  marginBottom:8,
  marginRight:20, width:'35%'
  },
  
  guard_name:{
  fontSize:  14, fontFamily:  Fonts.OpenSansRegular ,
  color :  'black', marginBottom:8, marginRight:20,width:'35%'
  },
  
  intime:{
  fontSize: 14,fontFamily: Fonts.OpenSansRegular ,
  color : 'black',marginLeft:15
  },
  
  hintime:{
  fontSize: 14,fontFamily: Fonts.OpenSansRegular ,
  color : 'black', marginLeft:15
  },

mobilenumberverification: { height: '10%', width: '100%', marginTop:'5%', color: '#060606', textAlign:'center',   
 fontFamily: Fonts.Tahoma,   fontSize: 19, //lineheight: '17px',
},

pleaseenteryourmobilenumbe : { height: '10%', width: '80%', color: '#060606', textAlign:'center', 
  alignSelf:'center' ,  fontFamily: Fonts.Tahoma,   fontSize: 15, //lineheight: '13px',
},

thereisnorecordofthisnum : {  marginLeft:25 , marginRight:25, color: '#f00', fontFamily: Fonts.Tahoma, 
   fontSize: 17, //lineheight: '23px',
},

icons8horizontalline : {   height: '25px',    width: '25px',},

rectangle1 : {   height: '31px',    width: '210px',    backgroundColor: '#FBA330', 
 // boxshadow: 0 1px 4px 0 rgba(0,0,0,0.5),
},

getotp :{  height: '12px',    width: '50px',     color: '#FFFEFE',  fontFamily: Fonts.Tahoma,
  fontSize: 12, //fontweight: 700, //lineheight: '12px',    textalign: 'center',
},

ihavereadandacceptthepri : { height: '15%', width: '80%', marginTop:'5%',  color: '#020202',   
  justifyContent:'center',alignSelf:'center', fontFamily: Fonts.Tahoma,   fontSize: 12,  //lineheight: '8px',
},

oval :{ height: '29.05%',  width: '50.94%',   // boxsizing: borderbox,  border: 15px solid #FA9917,
},

})

export { mystyles }
