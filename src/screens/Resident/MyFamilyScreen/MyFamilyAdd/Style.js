import {Platform, StyleSheet} from "react-native"
import base from "../../../../base";

const Style = StyleSheet.create({
  container:{
    height: '100%', width: '100%',alignItems:'center'
  },
  headerStyles:{
    height: '8%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
    borderColor: base.theme.colors.primary,
    borderBottomWidth: 1.5,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
  backIcon:{
    width: 15,
    height: 15,
    marginLeft: 10
  },
  nextView:{
    width: '30%', alignItems: 'flex-end'
  },
  nextButton:{
    height: '40%', width: '40%', alignItems: 'center', justifyContent: 'center',
    borderColor: base.theme.colors.primary, borderRadius: 10, marginRight: 10,
    borderWidth: 1
  },
  nextText:{
    fontSize: 10, color: base.theme.colors.primary
  },
  addFamilyMem:{
    height: '5%', width: '100%', alignItems: 'center', marginTop: 10,
  },
  addFamilyText:{
    fontSize: 18, color: base.theme.colors.primary
  },
  subContainer:{
    height: '15%', width: '100%', alignItems: 'center', marginTop: 20,
  },
  relativeImgView:{
    height: 90,
    width: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: base.theme.colors.primary,
    backgroundColor: base.theme.colors.lightgrey,
    alignItems: 'center',
    justifyContent: 'center'
  },
  famTextView:{
    height: '4%', width: '100%', alignItems: 'center', marginTop: 40,
  },
  famText:{
    fontSize: 16, color: base.theme.colors.primary
  },
  subMainView:{
    height: '72%', width: '100%', alignItems: 'center'
  },
  textInputView:{
    height: '15%', width: '90%', marginTop: 20,
  },
  mobNumView:{
    height: '10%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }

});

export default Style