import React, { Component } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Platform,
    ScrollView, TextInput, SafeAreaView, TouchableHighlight, Linking, Alert, BackHandler
} from 'react-native';
import AddExpenseStyles from "./Expenses/AddExpenseStyles";
import Dropdown from "react-native-material-dropdown/src/components/dropdown";
const {height, width} = Dimensions.get('screen');
import {connect} from "react-redux";
import base from "../../base";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from "react-native-simple-radio-button";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import {
    heightPercentageToDP as hp, widthPercentageToDP,
    widthPercentageToDP as wp
} from "react-native-responsive-screen";
import OSButton from "../../components/osButton/OSButton";


class Accounting extends Component {
  constructor(props) {
    super(props);
    this.state={
       selectedBank:"Select Bank",
        listOfBanks:[{value:'SBI',details:'B1'},{value:'Andhra Bank',details:'B2'},{value:'ICICI Bank',details:'B3'},{value:'HDFC Bank',details:'B3'},
            {value:'AXIS Bank',details:'B5'},{value:'Canera Bank',details:'B6'}],
        accountNumber:"",
        ifscCode:"",
        minorProps: [{label: 'Flat Rate Value', value: 0},
            {label: 'Dimension Based', value: 1}],
        isMinorSelected: 0,
        flatRateValue:"",
        maintenanceValue:"",
        dueDate:moment().format('DD-MM-YYYY'),
        todayDate:moment().format('DD-MM-YYYY'),
        paymentType:"Late Payment Charge Type",
        paymentTypeList:[],
        blockList:[],
        selectedBlock:'Selected Block',
        blockId:"",
        unitList:[],
        selectedUnit:'Unit Name',
        unitId:'',
        paymentCharge:"",
        minorProps1: [{label: 'Yes', value: 0},
            {label: 'No', value: 1}],
        isMinorSelected1: 0,
        unitRate:"",
        unitDimension:"",
        distributionType:[{value:'Dimension Based',details:'D1'},{value:'Flat Rate Value',details:'D2'}],
        selDistribution:"",
        selectedAppList: '',
        expApplicabilityId:'',
        expAppList:[]




    }
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
        this.getExpenseRecurrenceType();
        this.getTheBlockList();
        this.getExpenseApplicableUnitList()
    }

  componentDidMount() {
      if(Platform.OS!='ios'){
          BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
      }
  }

  componentWillUnmount() {
      if(Platform.OS!='ios'){
          BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
      }
  }

    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    async getExpenseRecurrenceType(){
        let stat = await base.services.OyeLivingApi.getExpenseRecTypeList(this.props.userReducer.SelectedAssociationID)
        console.log('Get the block list1',stat)
        try{
            if(stat.success && stat.data.expenseReccurrance.length!==0){
                let expRecurrence=[];
                let data=stat.data.expenseReccurrance;

                for(let i=0; i<data.length;i++){
                    expRecurrence.push({value: data[i].erType,
                        details: data[i]})
                }
                this.setState({
                    paymentTypeList:expRecurrence
                })
            }
        }
        catch(error){
            console.log('error',error)
        }

    }

    async getTheBlockList(){
        let stat = await base.services.OyeLivingApi.getTheListOfBlocksByAssociation(this.props.userReducer.SelectedAssociationID)
        console.log('Get the block list',stat)
        try{
            if(stat.success && stat.data.blocksByAssoc.length!==0){
                let blockList=[];
                let data=stat.data.blocksByAssoc;

                for(let i=0; i<data.length;i++){
                    blockList.push({value: data[i].blBlkName,
                        details: data[i]})
                }
                this.setState({
                    blockList:blockList
                })
            }
        }
        catch(error){
            console.log('error',error)
        }

    }

    async getUnitListByBlocks(blockId) {
        let self=this;
        let stat = await base.services.OyeLivingApi.getUnitListByBlockId(blockId)
        console.log('data@@@@@@##########>>>>>>>', stat)

        try {
            if (stat.success && stat.data.unitsByBlockID.length !=0) {
                let unitList = [];
                let data = stat.data.unitsByBlockID;

                for (let i = 0; i < data.length; i++) {
                    unitList.push({
                        value: data[i].unUniName,
                        details: data[i]
                    })
                }
                console.log('data@@@@@@##########>>>>>>>', unitList)

                self.setState({
                    unitList:unitList
                })
            }
            else{
                self.setState({
                    unitList:[]
                })
            }
        } catch (error) {


            console.log('error', error)
        }

    }

    async getExpenseApplicableUnitList() {
        let stat = await base.services.OyeLivingApi.getExpenseApplicabilityList(this.props.userReducer.SelectedAssociationID)
        console.log('jhjhjhjkkhkhk',stat)
        try {
            if (stat.success && stat.data.expenseApplicabilites.length !== 0) {
                let expAppList = [];
                let data = stat.data.expenseApplicabilites;

                for (let i = 0; i < data.length; i++) {
                    expAppList.push({
                        value: data[i].eaApplTo,
                        details: data[i]
                    })
                }
                this.setState({
                    expAppList: expAppList
                })
            }
        } catch (error) {

            this.setState({
                isLoading:false
            })
            console.log('error', error)
        }

    }

    render() {
    return(
        <SafeAreaView style={AddExpenseStyles.safeArea}>
          <View style={AddExpenseStyles.headerView}>
            <Text style={AddExpenseStyles.headerText}>Accounting</Text>
          </View>
          <View style={AddExpenseStyles.subHeadView}>
            <Text style={AddExpenseStyles.subHeadText}>Accounting Details</Text>
          </View>
          <ScrollView style={AddExpenseStyles.mainContainer}
                      showsVerticalScrollIndicator={false}>
              <View style={[AddExpenseStyles.scrollContainer]} >
              <Dropdown
                  value={this.state.selectedBank}
                  labelFontSize={18}
                  labelPadding={-5}
                  placeHolder={'Select Bank'}
                  baseColor="rgba(0, 0, 0, 1)"
                  data={this.state.listOfBanks}
                  containerStyle={{
                      width: '100%',
                  }}
                  textColor={base.theme.colors.black}
                  inputContainerStyle={{
                      borderColor:base.theme.colors.lightgrey,
                  }}
                  dropdownOffset={{ top: 10, left: 0 }}
                  dropdownPosition={-5}
                  rippleOpacity={0}
                  onChangeText={(value, index) => {
                      this.setState({
                          selectedBank:value
                      })
                  }}
              />
              <View style={AddExpenseStyles.textInputView}>
                  <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left',paddingTop:5,}}>Account Number</Text>
                  <TextInput
                      style={{height:30, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey,paddingBottom:5
                      }}
                      value={this.state.accountNumber}
                      placeholder="Account Number"
                      placeholderTextColor={base.theme.colors.grey}
                      onChangeText={(value) =>{
                          let num = value.replace(".", '');
                          if (isNaN(num)) {
                              // Its not a number
                          } else {
                              this.setState({accountNumber:value})
                          }}}
                      keyboardType={'phone-pad'}
                      maxLength={20}
                  />
              </View>
              <View style={AddExpenseStyles.textInputView}>
                  <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left',paddingTop:5,}}>IFSC Code</Text>
                  <TextInput
                      style={{height:30, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey,paddingBottom:5
                      }}
                      value={this.state.ifscCode}
                      placeholder="IFSC Code"
                      placeholderTextColor={base.theme.colors.grey}
                      onChangeText={(value) =>{
                          let num = value.replace(/^[a-zA-Z0-9 ]+$/g,  '');
                          if (isNaN(num)) {
                              // Its not a number
                          } else {
                              this.setState({ifscCode:value})
                          }}}
                      keyboardType={Platform.OS === 'ios'? 'ascii-capable':'visible-password'}
                      maxLength={20}
                  />
              </View>
              <View style={AddExpenseStyles.textInputView}>
                  <Text style={{fontSize: 14, color: base.theme.colors.grey, textAlign: 'left',paddingTop:15,}}>Select Rate</Text>
              </View>
              <View style={{
                  flexDirection: 'row',
                  height: '6%',
                  width: '100%',
                  justifyContent: 'flex-start',
                  marginTop: 10,
                  marginBottom:10
              }}>
                  <RadioForm formHorizontal={true} animation={true}>
                      {this.state.minorProps.map((obj, i) => {
                          let onPress = (value, index) => {
                              this.setState({
                                  isMinorSelected: value,
                              })
                          };
                          return (
                              <RadioButton labelHorizontal={true} key={i.toString()}>
                                  <RadioButtonInput
                                      obj={obj}
                                      index={i.toString()}
                                      isSelected={this.state.isMinorSelected === i}
                                      onPress={onPress}
                                      buttonInnerColor={base.theme.colors.blue}
                                      buttonOuterColor={base.theme.colors.blue}
                                      buttonSize={10}
                                      buttonStyle={{borderWidth: 0.7}}
                                      buttonWrapStyle={{marginLeft: 40}}
                                  />
                                  <RadioButtonLabel
                                      obj={obj}
                                      index={i.toString()}
                                      onPress={onPress}
                                      labelStyle={{color: base.theme.colors.black}}
                                      labelWrapStyle={{marginLeft: 10}}
                                  />
                              </RadioButton>
                          )
                      })}
                  </RadioForm>
              </View>
              <View style={{width:'100%',flexDirection:'row'}}>
                  <View style={{width:'50%'}}>
                      <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left',paddingTop:5,}}>Flat Rate Value</Text>
                      <TextInput
                          style={{height:30, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey,paddingBottom:5,width:'95%'
                          }}
                          value={this.state.flatRateValue}
                          placeholder="Flat Rate Value"
                          placeholderTextColor={base.theme.colors.grey}
                          onChangeText={(value) =>{
                              let num = value.replace(/[^0-9].[^0-9]{2}/g,  '');
                              if (isNaN(num)) {
                                  // Its not a number
                              } else {
                                  this.setState({flatRateValue:num})
                              }}}
                          keyboardType={'numeric'}
                      />
                      <Text style={{fontSize: 14, color: base.theme.colors.red, textAlign: 'left',paddingTop:5,}}>Amount to be changed</Text>
                  </View>
                  <View style={{width:'50%'}}>
                      <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left',paddingTop:5,}}>Maintenance Value</Text>
                      <TextInput
                          style={{height:30, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey,paddingBottom:5,width:'95%'
                          }}
                          value={this.state.maintenanceValue}
                          placeholder="Maintenance Value"
                          placeholderTextColor={base.theme.colors.grey}
                          onChangeText={(value) =>{
                              let num = value.replace(/[^0-9].[^0-9]{2}/g,  '');
                              if (isNaN(num)) {
                                  // Its not a number
                              } else {
                                  this.setState({maintenanceValue:num})
                              }}}
                          keyboardType={'numeric'}

                      />
                      <Text style={{fontSize: 14, color: base.theme.colors.red, textAlign: 'left',paddingTop:5,}}>RATE (SQFT/SQMTR)</Text>
                  </View>
              </View>
              <TouchableOpacity style={{width:'100%',borderBottomWidth:1,borderBottomColor:base.theme.colors.lightgrey,flexDirection:'row',
                  alignItems:'center',justifyContent:'space-between'
              }}>
                  <DatePicker
                      style={{width: '100%',}}
                      date={this.state.dueDate}
                      mode="date"
                      placeholder="select date"
                      format="DD-MM-YYYY"
                      minDate={this.state.todayDate}
                     // maxDate={this.state.todayDate}
                      iconSource={require('../../../icons/calender.png')}
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      showIcon={true}
                      customStyles={{
                          dateIcon: {
                              left: 2,
                              alignSelf: 'flex-end',
                              marginLeft: 0,
                              marginBottom:2


                          },
                          dateInput: {
                              borderWidth: 0,
                              color: base.theme.colors.black,
                              height: 30,
                              width: 30,
                              alignItems:'flex-start',

                          }
                      }}
                      onDateChange={(date) => {
                          this.setState({dueDate:date})
                      }}
                  />
                  {/*<Image
                      resizeMode={'contain'}
                      style={{
                          height: hp('6%'),
                          width: wp('6%'),
                          tintColor: base.theme.colors.primary,
                          alignSelf: 'center',
                          marginLeft:10
                      }}
                      source={require('../../../icons/calender.png')}
                  />*/}
              </TouchableOpacity>
              <Dropdown
                  value={this.state.paymentType}
                  labelFontSize={18}
                  labelPadding={-5}
                  placeHolder={'Late Payment Charge Type'}
                  baseColor="rgba(0, 0, 0, 1)"
                  data={this.state.paymentTypeList}
                  containerStyle={{
                      width: '100%',
                  }}
                  textColor={base.theme.colors.black}
                  inputContainerStyle={{
                      borderColor:base.theme.colors.lightgrey,
                  }}
                  dropdownOffset={{ top: 10, left: 0 }}
                  dropdownPosition={-5}
                  rippleOpacity={0}
                  onChangeText={(value, index) => {
                      this.setState({
                          paymentType:value,
                          paymentTypeId:this.state.paymentTypeList[index].details.erid
                      })
                  }}
              />
              <View style={AddExpenseStyles.textInputView}>
                  <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left',paddingTop:5,}}>Payment Charge</Text>
                  <TextInput
                      style={{height:30, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey,paddingBottom:5
                      }}
                      value={this.state.paymentCharge}
                      placeholder="Payment Charge"
                      placeholderTextColor={base.theme.colors.grey}
                      onChangeText={(value) =>{
                          let num = value.replace(/[^0-9].[^0-9]{2}/g,  '');
                          if (isNaN(num)) {
                              // Its not a number
                          } else {
                              this.setState({paymentCharge:num})
                          }}}
                      keyboardType={'numeric'}

                  />
              </View>
              <View style={AddExpenseStyles.textInputView}>
                  <Text style={{fontSize: 14, color: base.theme.colors.grey, textAlign: 'left',paddingTop:15,}}>Invoice Generation Automatic</Text>
              </View>
              <View style={{
                  flexDirection: 'row',
                  height: '6%',
                  width: '100%',
                  justifyContent: 'flex-start',
                  marginTop: 10,
                  marginBottom:10
              }}>
                  <RadioForm formHorizontal={true} animation={true}>
                      {this.state.minorProps1.map((obj, i) => {
                          let onPress = (value, index) => {
                              this.setState({
                                  isMinorSelected1: value,
                              })
                          };
                          return (
                              <RadioButton labelHorizontal={true} key={i.toString()}>
                                  <RadioButtonInput
                                      obj={obj}
                                      index={i.toString()}
                                      isSelected={this.state.isMinorSelected1 === i}
                                      onPress={onPress}
                                      buttonInnerColor={base.theme.colors.primary}
                                      buttonOuterColor={base.theme.colors.primary}
                                      buttonSize={10}
                                      buttonStyle={{borderWidth: 0.7}}
                                      buttonWrapStyle={{marginLeft: 40}}
                                  />
                                  <RadioButtonLabel
                                      obj={obj}
                                      index={i.toString()}
                                      onPress={onPress}
                                      labelStyle={{color: base.theme.colors.black}}
                                      labelWrapStyle={{marginLeft: 10}}
                                  />
                              </RadioButton>
                          )
                      })}
                  </RadioForm>
              </View>
              <Dropdown
                  value={this.state.selectedBlock}
                  labelFontSize={18}
                  labelPadding={-5}
                  placeHolder={'Selected Block'}
                  baseColor="rgba(0, 0, 0, 1)"
                  data={this.state.blockList}
                  containerStyle={{
                      width: '100%',
                  }}
                  textColor={base.theme.colors.black}
                  inputContainerStyle={{
                      borderColor:base.theme.colors.lightgrey,
                  }}
                  dropdownOffset={{ top: 10, left: 0 }}
                  dropdownPosition={this.state.blockList.length > 2 ? -5 : -2}
                  rippleOpacity={0}
                  onChangeText={(value, index) => {
                      this.setState({
                          selectedBlock:value,
                          blockId:this.state.blockList[index].details.blBlockID
                      });
                      this.getUnitListByBlocks(this.state.blockList[index].details.blBlockID);

                  }}
              />
              <Dropdown
                  value={this.state.selectedUnit}
                  labelFontSize={18}
                  labelPadding={-5}
                  placeHolder={'Selected Unit'}
                  baseColor="rgba(0, 0, 0, 1)"
                  data={this.state.unitList}
                  containerStyle={{
                      width: '100%',
                  }}
                  textColor={base.theme.colors.black}
                  inputContainerStyle={{
                      borderColor:base.theme.colors.lightgrey,
                  }}
                  dropdownOffset={{ top: 10, left: 0 }}
                  dropdownPosition={-5}
                  rippleOpacity={0}
                  onChangeText={(value, index) => {
                      this.setState({
                          selectedUnit:value,
                          unitId:this.state.unitList[index].details.unUnitID

                      });
                  }}
              />
              <View style={{ borderRadius: 5, borderColor: base.theme.colors.lightgrey,
                  shadowColor: base.theme.colors.greyHead,
                  shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 1},
                  shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.2,
                  shadowRadius: 1, elevation: 5, padding: 5, borderBottomWidth: 0.5, flexDirection: 'column', marginTop: 10,
                  height: hp('35'),
                  width: wp('90'),  alignSelf: 'center', backgroundColor: base.theme.colors.white,marginBottom:10 }}>
                  <View style={AddExpenseStyles.textInputView}>
                      <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left',paddingTop:5,}}>Unit Rate</Text>
                      <TextInput
                          style={{height:30, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey,paddingBottom:5
                          }}
                          value={this.state.unitRate}
                          placeholder="Unit Rate"
                          placeholderTextColor={base.theme.colors.grey}
                          onChangeText={(value) =>{
                              let num = value.replace(/[^0-9].[^0-9]{2}/g,  '');
                              if (isNaN(num)) {
                                  // Its not a number
                              } else {
                                  this.setState({unitRate:num})
                              }}}
                          keyboardType={'numeric'}
                      />
                  </View>
                  <Dropdown
                      value={'Select Distribution Type'} //this.state.selDistribution
                      labelFontSize={18}
                      labelPadding={-5}
                      baseColor="rgba(0, 0, 0, 1)"
                      data={this.state.distributionType}
                      containerStyle={{
                          width: '100%',
                      }}
                      textColor={base.theme.colors.black}
                      inputContainerStyle={{
                          borderColor:base.theme.colors.lightgrey,
                      }}
                      dropdownOffset={{ top: 10, left: 0 }}
                      dropdownPosition={ -3}
                      rippleOpacity={0}
                      onChangeText={(value, index) => {
                          this.setState({
                              selDistribution:value,
                          })
                      }}
                  />
                  <View style={AddExpenseStyles.textInputView}>
                      <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left',paddingTop:5,}}>Unit Dimension</Text>
                      <TextInput
                          style={{height:30, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey,paddingBottom:5
                          }}
                          value={this.state.unitDimension}
                          placeholder="Unit Dimension"
                          placeholderTextColor={base.theme.colors.grey}
                          onChangeText={(value) =>{
                              let num = value.replace(/[^0-9].[^0-9]{2}/g,  '');
                              if (isNaN(num)) {
                                  // Its not a number
                              } else {
                                  this.setState({unitDimension:num})
                              }}}
                          keyboardType={'numeric'}

                      />
                  </View>
                  <Dropdown
                      value={'Occupancy & Owner Status'} // 'Applicable to Unit *' this.state.selectedAppList
                      labelFontSize={18}
                      labelPadding={-5}
                      baseColor="rgba(0, 0, 0, 1)"
                      data={this.state.expAppList}
                      containerStyle={{
                          width: '100%',
                      }}
                      textColor={base.theme.colors.black}
                      inputContainerStyle={{
                          borderColor: base.theme.colors.lightgrey,
                      }}
                      dropdownOffset={{top: 10, left: 0}}
                      dropdownPosition={-5}
                      rippleOpacity={0}
                      onChangeText={(value, index) => {
                          console.log('Get the values @@@$$$$',value ,this.state.expAppList[index].details.eaid)


                          this.setState({
                              selectedAppList: value,
                              expApplicabilityId:this.state.expAppList[index].details.eaid,
                          })
                      }}
                  />
                  <TouchableOpacity style={{alignItems:'center',marginTop:10,height:'10%'}} onPress={() => this.validationForUpdateUnitDetails()}>
                      <Text style={{color:base.theme.colors.blue,fontSize:16}}>UPDATE</Text>
                  </TouchableOpacity>
              </View>
              </View>
              <View style={{alignSelf:'center',width:'70%',flexDirection:'row',paddingTop:25,paddingBottom:25,alignItems:'center',justifyContent:'space-between',
                  marginBottom:150,paddingLeft:15,paddingRight:15}}>
                  <OSButton
                      height={30}
                      width={'35%'}
                      borderRadius={20}
                      oSBBackground={base.theme.colors.red}
                      oSBText={'Skip'}
                      onButtonClick={() => this.props.navigation.navigate('oyeLiving')}/>
                  <OSButton
                      height={30}
                      width={'50%'}
                      borderRadius={20}
                      oSBBackground={base.theme.colors.primary}
                      oSBText={'Submit'}
                      onButtonClick={() => this.createAccounting()}/>
              </View>

          </ScrollView>

        </SafeAreaView>
    )
  }

    async createAccounting(){
      console.log('CreateAccounting')
        let self=this;
        let input={
            "ASAssnID"  : this.props.dashBoardReducer.assId,
            "ASMtType"  : "FlatRate",
            "ASMtDimBs" : self.state.maintenanceValue,
            "ASMtFRate" : self.state.flatRateValue,
            "ASLPCType" : self.state.paymentType,
            "ASLPChrg"  : self.state.paymentCharge,
            "InvGAuto"  : false,
            "ASDPyDate" : moment(self.state.dueDate,'DD-MM-YYYY').format('YYYY-MM-DD'),
            "BLBlockID" : self.state.blockId,
            "BankDetails" :
                [{
                    "BABName" : self.state.selectedBank=='Select Bank'?"":self.state.selectedBank,
                    "BAIFSC"    : self.state.ifscCode,
                    "BAActNo"   : self.state.accountNumber
                }]
        }
        let stat = await base.services.OyeLivingApi.updateBlockDetails(input)
        console.log('STATUS IN CREATE ACCOUNTING',input,stat)

        if(stat.success) {
            Alert.alert('Accounting Details updated Successfully')
            this.props.navigation.navigate('oyeLiving')
        }

  }


    validationForUpdateUnitDetails(){
      let self=this;
      if(base.utils.validate.isBlank(self.state.blockId)){
          Alert.alert('Please select the block to update unit details')
      }
      else if(base.utils.validate.isBlank(self.state.unitId)){
          Alert.alert('Please select the unit to update unit details')
      }
      else if(base.utils.validate.isBlank(self.state.unitRate)){
          Alert.alert('Please select the unit Rate to update unit details')
      }
      else if(base.utils.validate.isBlank(self.state.selDistribution)){
          Alert.alert('Please select the distribution type to update unit details')
      }
      else if(base.utils.validate.isBlank(self.state.unitDimension)){
          Alert.alert('Please select the unit dimension to update unit details')
      }
      else if(base.utils.validate.isBlank(self.state.selectedAppList)){
          Alert.alert('Please select the Occupancy & Ownership status to update unit details')
      }
      else {
          self.updateUnitDetailsApi()
      }

    }

    async updateUnitDetailsApi(){
      let self=this;

        let input= {
            "UNRate"    : self.state.unitRate,
            "UNCalType" : self.state.selDistribution,
            "UNDimens"  : self.state.unitDimension,
            "UNOcStat"  : self.state.selectedAppList,
            "BLBlockID" : self.state.blockId,
            "UNUnitID"  : self.state.unitId
        }


        let stat = await base.services.OyeLivingApi.updateUnitDetails(input)
        console.log('STATUS IN CREATE ACCOUNTING #######',input,stat)
        if(stat.data.success){
            Alert.alert('Unit Details Updated successfully ')
        }
    }
}

const mapStateToProps = state => {
  return {
    dashBoardReducer: state.DashboardReducer,
    userReducer: state.UserReducer,
  };
};
export default connect(mapStateToProps)(Accounting)
