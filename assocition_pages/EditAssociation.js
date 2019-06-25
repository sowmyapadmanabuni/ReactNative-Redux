
  import React, { Component } from 'react';
  import { Platform, StyleSheet,Button,Picker, Text,ToastAndroid,Alert,alertMessage, 
    ScrollView,TextInput,TouchableOpacity ,View } from 'react-native';
    import PhoneInput from "react-native-phone-input";
    import { mystyles} from '../pages/styles'
    import home from '../src/screens/dashboard_pages/ResApp'
    //import { View } from 'native-base';
  
  const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
      'Double tap R on your keyboard to reload,\n' +
      'Shake or press menu button for dev menu',
  });
  
  export default class EditAssociation extends Component {
    constructor(props) {
      super(props);
      global.MyVar = 'http://aboutreact.com';
    
      this.state = {
        value: this.props.navigation.state.params.name,
        Assocation_name: this.props.navigation.state.params.name,
      Pan_Number:this.props.navigation.state.params.panNo,
      PinCode:this.props.navigation.state.params.asPinCode,
      // Gps:this.props.navigation.state.params.gpsLocation,
      No_Units:this.props.navigation.state.params.asNofUnit,
      // Place:this.props.navigation.state.params.locality,
      Unit_Name:'',
      Mail:this.props.navigation.state.params.asAsnEmail,
      Manager_Name:this.props.navigation.state.params.asMgrName,
      Man_Mob_No:this.props.navigation.state.params.asMgrMobile,
      Referal_Code:this.props.navigation.state.params.asPrpName,
      Prop_Name:this.props.navigation.state.params.asPrpName,
      Prop_Type:'',
      PickerValueHolder : this.props.navigation.state.params.asPrpType,
      
      Ass_State:this.props.navigation.state.params.asState,
    Ass_City:this.props.navigation.state.params.locality,
  Manager_Email:this.props.navigation.state.params.asMgrEmail,
  ass_Adress:this.props.navigation.state.params.asAddress,
  Bank_Name:'',//this.props.navigation.state.params.asState,
  Account_Number:'',//this.props.navigation.state.params.asState,
  Account_type:'',//this.props.navigation.state.params.asState,
  IFSC_Code:'',//this.props.navigation.state.params.asState,
  Acc_Balence:'',//this.props.navigation.state.params.asState,

No_Blocks:this.props.navigation.state.params.asNofBlks,
Bill_Gen_Day:'',PickerValueHolder_acctype:''};
  
    //   this.handleChange = this.handleChange.bind(this);
      // this.assname=this.assname.bind(this);
      // this.handleSubmit = this.handleSubmit.bind(this);
    }
    // handleChange(event) {
    //   this.setState({value: event.target.value});
    // }
  //   state = {
  //     Assocation_name: '',
  //     Pan_Number:'',
  //     PinCode:'',
  //     Gps:'',
  //     No_Units:'',
  //     Place:'',
  //     Unit_Name:'',
  //     Mail:'',
  //     Manager_Name:'',
  //     Man_Mob_No:'',
  //     Referal_Code:'',
  //     Prop_Name:'',
  //     Prop_Type:'',
  //     PickerValueHolder : ''
  
  // }
  static navigationOptions = {
    title: 'Create Association',
    headerStyle:{
        backgroundColor:'#696969',
    },
    headerTitleStyle:{
        color:'#fff',
    }
  };
  
  Assname = (assocation_name) => {
 
    console.log('bff',assocation_name+' '+this.state.Assocation_name+' ');

    this.setState({ Assocation_name: assocation_name })
    console.log('af',assocation_name+' '+this.state.Assocation_name+' ');

  }
  billgen = (bill) => {
 
    
    this.setState({ Bill_Gen_Day: bill })
  }
  PanNumber = (pan_num) => {
    this.setState({ Pan_Number:pan_num })
  }
  Pincode = (pin) => {
    this.setState({ PinCode:pin })
  }
  Location = (gps) => {
    this.setState({ Gps:gps })
  }
  Units = (no_units) => {
    this.setState({ No_Units:no_units })
  }
  Locality = (locality) => {
    this.setState({ Place:locality })
  }
  UnitName = (unit_name) => {
    this.setState({ Unit_Name:unit_name })
  }
  Email = (mail) => {
    this.setState({ Mail:mail })
  }
  Mangername = (manager_name) => {
    this.setState({ Manager_Name:manager_name })
  }
  ManMobNo = (man_mob_no) => {
    this.setState({ Man_Mob_No:man_mob_no })
  }
  ReferalCode = (referal_code) => {
    this.setState({ Referal_Code:referal_code })
  }
  PropName = (prop_name) => {
    this.setState({ Prop_Name:prop_name })
  }
  PropType = (prop_type) => {
    this.setState({ Prop_Type:prop_type })
  }
  PropName = (prop_name) => {
    this.setState({ Prop_Name:prop_name })
  }
  PropType = (prop_type) => {
    this.setState({ Prop_Type:prop_type })
  }
  as_State = (as_state) => {
    this.setState({ Ass_State:as_state })
  }
  ass_City = (as_city) => {
    this.setState({ Ass_City:as_city })
  }
  Man_Mail = (man_mail) => {
    this.setState({ Manager_Email:man_mail })
  }
  ass_add = (as_add) => {
    this.setState({ ass_Adress:as_add })
  }
  bank_Nmae = (name) => {
    this.setState({ Bank_Name:name })
  }
  acc_no = (Acc_no) => {
    this.setState({ Account_Number: Acc_no})
  }
  IFSC = (ifsc) => {
    this.setState({ IFSC_Code: ifsc})
  }
  bal = (Bal) => {
    this.setState({ Acc_Balence: Bal})
  }
  No_blo = (block) => {
    this.setState({ No_Blocks: block})
  }
  reset = () => {
    console.log('ho','hii');
    this.setState({ Manager_Name:'' })
  }
 
  
    mobilevalidate=(assname,spinner,acc_type) =>{
      console.log('ravi',this.props.navigation.state.params.asNofUnit+","+this.props.navigation.state.params.asNofBlks);
      console.log('suvarna',this.state.Prop_Name);
      const { params } = this.props.navigation.state;
      massName=this.state.Assocation_name
      mproprname=this.state.Prop_Name
    
      mpannumber=this.state.Pan_Number;
      mPinCode=this.state.PinCode;
      //mGps=params.cat+','+params.cat1
      mnum_units=this.state.No_Units;
      mnum_blocks=this.state.No_Blocks;
      mPlace=this.state.Place;
      mUnitName=this.state.Unit_Name;
  
      mMail=this.state.Mail;
      mManager_Name=this.state.Manager_Name;
      mMobileNumber=this.state.Man_Mob_No;
      memil=this.state.Manager_Email;
    

      mstate=this.state.Ass_State;
      mCity=this.state.Ass_City;
      mAdress=this.state.ass_Adress

      mBank_name=this.state.Bank_Name;
      mAccount_Number=this.state.Account_Number;
      mIFSc=this.state.IFSC_Code;
      mbal=this.state.Acc_Balence
      console.log('datevalidation',mAdress+","+mnum_units+' '+mManager_Name+' '+ mMobileNumber);

  
      const reg = /^[0]?[789]\d{9}$/;
    let regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    let regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    let regIFSC=/^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/
    // this.props.navigation.navigate('AssnListScreen');

    if (massName.length==0||massName==='[object Object]' ){
      alert("Association name Cannot be Empty");
  
    }
  
    else if(massName.length<3){
             alert("Association name should be more than  3 Characters");
        }
        else if(mproprname.length==0){
          alert("property name cannot be empty");
     }
        
        else if(mstate.length==0) {
          alert("State cannot be Empty");
        }
        else if(mCity.length==0) {
          alert("City cannot be Empty");
        }
        else if(mAdress.length==0) {
          alert("Address  cannot be Empty");
        }
        else if(mPinCode.length==0){
          alert("Pin Code Cannot be Empty");
        }
        else if(mPinCode.length<6){
          alert("Invalid Pin Code");
        }
        else if(mnum_blocks.length==0){
          alert("Number of Blocks cannot be empty");
        }
        else if(mnum_blocks==='0'){
          Alert.alert(' Number Of Blocks cannot be zero');
        
        }
        else if(mnum_units.length==0){
          alert(" Number of Units cannot be Empty");
        }
        else if(mnum_units==='0'){
          Alert.alert(' Number Of Units cannot be zero');
        
        }
  
  
        // else if(mPlace.length==0){
        //   alert(" Number of Units cannot be Empty");
        // }
        // else if(mPlace.length<3){
        //   ToastAndroid.show('Invalid Location', ToastAndroid.SHORT);
        // }
        
    // else if(mUnitName.length<3){
    //   ToastAndroid.show('Invalid Unitname', ToastAndroid.SHORT);
    // }
    else if(mManager_Name.length==0)
    {
      alert(" Manager  Name cannot be Empty");
    }
    // else if(mManager_Name.length<3){
    //   ToastAndroid.show(' Manager Name should be more than 3 Characters', ToastAndroid.SHORT);
      
    // }
    else if(mMobileNumber.length==0)
    {
      alert(" Manager  Mobile Number cannot be Empty");
    }
    else if(mMobileNumber.length<10){
      alert("Mobile Number should be 10 Digits");
      }
      // else if (reg.test(mMobileNumber) === false) {
      //   alert(" Invalid Mobile Number");
    
      //     this.setState({
      //        mobilevalidate: false,
      //        telephone: mMobileNumber,
            
      //      });
      //      return false;
    
      // }
      // else if (reg.test(mMobileNumber) === false) {
      //   alert(" Invalid Mobile Number");
    
      //     this.setState({
      //        mobilevalidate: false,
      //        telephone: mMobileNumber,
            
      //      });
      //      return false;
    
      // }
      // else if(regemail.test(mMail)==false){
      //   alert(" Invalid Email Id");
        
      //   this.setState({
      //     mobilevalidate: false,
      //     telephone: mMail,
         
      //   });
      //   return false;
    
      // }
      // else if(regemail.test(memil)==false){
      //   alert(" Invalid Email Id");
        
      //   this.setState({
      //     mobilevalidate: false,
      //     telephone: memil,
         
      //   });
      //   return false;
    
      // }
      // else if(mUnitName.length==0){
      //   alert(" Unit Name cannot be Empty");
      // }
      
      // else if(mBank_name.length==0){
      //   alert(" Bank Name cannot be Empty");
      // }
      // else if(mAccount_Number.length<=10){
      //   alert(" Enter Valid Account Number");
      // }
      // else if(mIFSc.length==0){
      //   alert(" IFSC code Cannot be Empty");
      // }
      // // else if(regIFSC.test(mIFSc)==false){
      // //   alert(" Invalid IFSC code");
        
      // //   this.setState({
      // //     mobilevalidate: false,
      // //     telephone: mIFSc,
         
      // //   });
      // //   return false;
    
      // // }
      // else if(acc_type==0){
      //   alert("Select  Account Type");
      // }
      // else if(mbal.length==0){
      //   alert("Account Balence Cannot be Empty");
  
      // }
      // else if(mbal==='0'){
      //   Alert.alert(' Accopunt Balence cannot be zero');
      
      // }
      
      else 
      {
       res= {
          "ASAddress": mAdress,
        "ASRegrNum":"123456",
          "ASMgrName":mManager_Name,
          "ASMgrMobile":mMobileNumber,
          "ASNofUnit" :mnum_units,
          "ASLPChrg" :"8.9",
          "ASAssnID" :params.id
        }
        responseObj={
          "ASAddress": mAdress,
        "ASRegrNum":"123456",
          "ASMgrName":mManager_Name,
          "ASMgrMobile":mMobileNumber,
          "ASNofUnit" :mnum_units,
          "ASLPChrg" :"8.9",
          "ASAssnID" :params.id
        }
          console.log('request',responseObj);
  
              
            fetch('http://122.166.168.160/champ/api/v1/association/Update', 
            {
            
                    method: 'POST',
                    headers: {
        
                      'Content-Type': 'application/json',
                      "X-Champ-APIKey":"1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
        
    },
                    body: JSON.stringify(res
                        
                        
           )
              })
                  .then((response) => response.json())
                  .then((responseJson) => {
                       if(responseJson.success){
                          console.log('ravii',responseJson);
                         // Alert.alert(' Updated Succesfully');
                          this.props.navigation.navigate('AssnListScreen')
          
                     
                       }
                      else{
                        console.log('ravii else',responseJson);
                        Alert.alert(' Updated failed');
                          // console.log('hiii',failed);
                       
                       }
  
                   
                     /*  if(responseJson.success){
                        console.log('response',responseJson);
                        //alert('member added suceefully !')
                        Alert.alert(
                            'Association created successfully!',
                            alertMessage,
                            [
                              {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                              {text: 'OK',  onPress: () => navigate("ResDashBoard")},
                              
                            ]
                          )
                      }
                      else{
                        console.log('hiii',failed);
                        alert('failed to send  !')
                      } */
                   
                      
              console.log('suvarna','hi');
                  })
                  .catch((error) => {
                    console.error(error);
                    Alert.alert(' Caught Error while getting Response');
                  });
           
        }
      
  }
    
    datavalidate=(assname) =>{
      const { params } = this.props.navigation.state;
    
      mpannumber=this.state.Pan_Number;
      mPinCode=this.state.PinCode;
      //mGps=params.cat+','+params.cat1
      mnum_units=this.state.No_Units;
      mUnitName=this.state.Unit_Name;
      mMail=this.state.Mail;
      mManager_Name=this.state.Manager_Name;
  
      if(assname.length==0 && mpannumber.length==0 && mnum_units.length==0
       && mManager_Name.length==0){
          // this.props.navigation.navigate('ResDashBoard');
          
    }else{
      
         this.props.navigation.navigate('AssnListScreen')
          
      
      
    }
    
    }
  
  //Cancle function
  AddMember=(firstname,lastname,mobilenumber,relation) =>{
    var result = this.Validate(firstname,lastname,mobilenumber,relation)
    if(result === true){
  }
  else{
  
  }
  }
  
  Validate(firstname,lastname,mobilenumber,relation){
    if(firstname == ''){
          return false
    }else if(lastname == ''){
        Alert.alert(
            'Enter Last Name',
            alertMessage,
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
              {text: 'OK',  onPress: () => console.log('Ok Pressed!')},
            ]
          )
          return false
    }
  }
  
   
  render()
  {
      const { navigate } = this.props.navigation;
      const { params } = this.props.navigation.state;

      console.log('SelectedAssociationID ', global.SelectedAssociationID);

  return(
  
    <ScrollView style = {styles.container}>
    <View>

    <Text style={mystyles.formtitle} >Association Details</Text>
    
    
    <View style={mystyles.formrectangle}>
    <Text style={mystyles.whatisthenameofyourassoc} >Association Name
    <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>*</Text>
    </Text >
    <TextInput style = {styles.input}
       underlineColorAndroid = "transparent"
       placeholder = "eg: Prime City Owners Association"
       autoCapitalize = "none"
      //  onChangeText={this.Assname}
       
       value={this.state.Assocation_name} onChange={this.Assname}/>

  


     <Text style={mystyles.whatisthenameofyourassoc}>Property Name
     <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>*</Text></Text> 
      <TextInput style = {styles.input}
       underlineColorAndroid = "transparent"
       placeholder = " eg: Prime City"
       autoCapitalize = "none"
       onChangeText={this.PropName}
       value={this.state.Prop_Name}  
       

       />
      {/* <Text style={mystyles.whatisthenameofyourassoc}>Property Type</Text> */}
       {/* <Picker
          selectedValue={this.state.PickerValueHolder}
          style={{marginLeft:15}}
          onValueChange={(itemValue, itemIndex) => this.setState({PickerValueHolder: itemValue})} >
          <Picker.Item label="Residential" value="Residential" />
          <Picker.Item label="Comercial" value="Comercial" />
          <Picker.Item label="Residentail/Commercial" value="Residentail/Commercial" />
    
        </Picker> */}
  
       <Text style = {mystyles.whatisthenameofyourassoc}>PAN Number of your Association 
       <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>*</Text>
       {/* <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>*</Text> */}
      </Text>
    <Text style = {mystyles.whatisthenameofyourassoc}>{this.state.Pan_Number}</Text> 


      <Text style = {mystyles.whatisthenameofyourassoc}>Country
       <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>*</Text>
      </Text>
      <PhoneInput  style={styles.text}
style={{flex:2}}
ref={ref=> {
this.phone =ref;
}}
/>

        <Text style = {mystyles.whatisthenameofyourassoc}>State
       <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>*</Text>
      </Text>
       <TextInput style = {styles.input}
       underlineColorAndroid = "transparent"
      //  placeholder = "eg: ABCDE1234RS"
      //  autoCapitalize = "none"
       autofocus='true'
       value={this.state.Ass_State} onChange={this.as_State}
      />

       <Text style = {mystyles.whatisthenameofyourassoc}>City
       <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>*</Text>
      </Text>
       <TextInput style = {styles.input}
       underlineColorAndroid = "transparent"
      //  placeholder = "eg: ABCDE1234RS"
      //  autoCapitalize = "none"
       autofocus='true'
       value={this.state.Ass_City} onChange={this.ass_City}
      />

        <Text style = {mystyles.whatisthenameofyourassoc}>Association Address
       <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>*</Text>
      </Text>
       <TextInput style = {styles.input}
       underlineColorAndroid = "transparent"
      //  placeholder = "eg: ABCDE1234R"
      //  autoCapitalize = "none"
       autofocus='true'
       onChangeText={this.ass_add}
       value={this.state.ass_Adress}  
      //  value={this.state.ass_Adress} onChange={this.ass_add}
       />
  
  
        <Text style = {mystyles.whatisthenameofyourassoc}>PinCode 
        <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>*</Text>
        </Text> 
       <View style = {styles.input}>
       <TextInput underlineColorAndroid = "transparent"
       keyboardType={'numeric'}  
       maxLength={6}
       autoCapitalize = "none"
       value={this.state.PinCode} onChange={this.Pincode}/>
    
      </View>
  
      <Text>
              {/*  {params.cat}
            </Text>
            <Text>
             {params.cat1} */}
      </Text>

      <Text style = {mystyles.whatisthenameofyourassoc}>Total Number of Blocks
      <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>
        *</Text>
      </Text>
      <TextInput style = {styles.input}
       underlineColorAndroid = "transparent"
       keyboardType={'numeric'}
       maxLength={4}
       autoCapitalize = "none"
       onChangeText={this.No_blo}
       value={this.state.No_Blocks}  
      //  value={this.state.No_Blocks} onChange={this.No_blo}
      />

      <Text style = {mystyles.whatisthenameofyourassoc}>Total Number of Units 
      <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>
        *</Text>
      </Text>
      <TextInput style = {styles.input}
       underlineColorAndroid = "transparent"
       keyboardType={'numeric'}
       maxLength={4}
       autoCapitalize = "none"
       onChangeText={this.Units}
       value={this.state.No_Units}  
      //  value={this.state.No_Units} onChange={this.Units}
       />
  
        
       

      
  
      
     
      
  
  <Text style = {mystyles.whatisthenameofyourassoc}>Email ID of the Association 
  <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>*</Text>    </Text>
    <TextInput style = {styles.input}
       underlineColorAndroid = "transparent"
       autoCapitalize = "none"
       value={this.state.
        Mail} onChange={this.Email}
       />
  </View>
  
  <Text style={mystyles.formtitle} >Other Details</Text>
  <View style={mystyles.formrectangle}>
  
    <Text style = {mystyles.whatisthenameofyourassoc}>Name of your Manager
    <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>*</Text>    </Text>
       <TextInput style = {styles.input} underlineColorAndroid = "transparent"
       autoCapitalize = "none"
       onChangeText={this.Mangername}
       value={this.state.Manager_Name}  
      //  value={this.state.Manager_Name} onChange={this.Mangername}
      />
  
  
  <Text style = {mystyles.whatisthenameofyourassoc}>Mobile Number of your Manager
  <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>*</Text>       </Text>
       <TextInput style = {styles.input}
       underlineColorAndroid = "transparent"
       keyboardType={'numeric'}
       maxLength={10}
       autoCapitalize = "none"
       onChangeText={this.ManMobNo}
       value={this.state.Man_Mob_No}  
      //  value={this.state.Man_Mob_No} onChange={this.ManMobNo}
       />
        <Text style = {mystyles.whatisthenameofyourassoc}>EmailID of your Manager
  
       </Text>
       <TextInput style = {styles.input}
       underlineColorAndroid = "transparent"
      //  keyboardType={'numeric'}
       autoCapitalize = "none"
       value={this.state.Manager_Email} onChange={this.Man_Mail}
      />

  </View>


  {/* <View style={mystyles.formrectangle}>
  <Text style = {mystyles.whatisthenameofyourassoc}> Bank Name 
      <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>*</Text>
      </Text>
       <TextInput style = {styles.input}
       underlineColorAndroid = "transparent"
      //  autoCapitalize = "none"
       autofocus='true'
       value={this.state.Bank_Name} onChange={this.bank_Nmae}
       />
  
    <Text style = {mystyles.whatisthenameofyourassoc}>IFSC Code 
    <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>*</Text>
    </Text>
       <TextInput style = {styles.input} underlineColorAndroid = "transparent"
       autoCapitalize='characters'
       autofocus='true'
       value={this.state.IFSC_Code} onChange={this.IFSC}
      />
  
  
  <Text style = {mystyles.whatisthenameofyourassoc}>Account Number
  <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>*</Text>
       </Text>
       <TextInput style = {styles.input}
       underlineColorAndroid = "transparent"
       keyboardType={'numeric'}
       autoCapitalize = "none"
       value={this.state.Account_Number} onChange={this.acc_no}
      />

       <Text style = {mystyles.whatisthenameofyourassoc}>Account Type
  <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>*</Text>
       </Text>
       <Picker
          selectedValue={this.state.PickerValueHolder_acctype}
          style={{marginLeft:15}}
          onValueChange={(itemValue, itemIndex) => this.setState({PickerValueHolder_acctype: itemValue})} >
          <Picker.Item label="Select " value='0' />
          <Picker.Item label="Savings" value="Savings" />
          <Picker.Item label="Current" value="Current" />
          
    
        </Picker>
        <Text style = {mystyles.whatisthenameofyourassoc}>Account Balence
  <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>*</Text>
       </Text>
       <TextInput style = {styles.input}
       underlineColorAndroid = "transparent"
       keyboardType={'numeric'}
       autoCapitalize = "none"
       value={this.state.Acc_Balence} onChange={this.bal}
      />

       <Text style = {mystyles.whatisthenameofyourassoc}> Bill Generation Day
       <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>*</Text>
       </Text>
       <TextInput style = {styles.input}
       underlineColorAndroid = "transparent"
       keyboardType={'numeric'}
       autoCapitalize = "none"
       value={this.state.Bill_Gen_Day} onChange={this.billgen}
      />


  </View> */}
  
  
  
  
       
     {/* <Text style = {mystyles.whatisthenameofyourassoc}>Do you have any referral code?
     <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>*</Text>
       </Text>
       <TextInput style = {styles.input}
       underlineColorAndroid = "transparent"
       autoCapitalize = "none"
       onChangeText = {this.ReferalCode}/> */}
  
    
    <View style={{flex:1,flexDirection:'row',marginBottom:50}}>
    <TouchableOpacity
       style = {mystyles.rectangle}
       onPress={this.mobilevalidate.bind(this,this.state.Assocation_name,this.state.PickerValueHolder,)}>
       <Text style = {styles.submitButtonText}> Update </Text>
    </TouchableOpacity>
  
       <TouchableOpacity
       style = {mystyles.rectangle}
       onPress={this.datavalidate.bind(this,this.state.Assocation_name )}>
       <Text style = {styles.submitButtonText}> Cancel </Text>
    </TouchableOpacity>
    
    </View>
    </View>
    </ScrollView>
  
  );
  }
  
  
  }
  
  const styles = StyleSheet.create({
    container: {
       paddingTop: 15,
       backgroundColor:'white'
    },
    input: {
       marginLeft: 20, marginRight: 15, marginTop: 15, marginBottom: 15,
       height: 40,
       borderColor: '#F2F2F2',
       backgroundColor: '#F2F2F2',
       borderWidth: 1.5,
       borderRadius : 2,
       
    },
    submitButton: {
       backgroundColor: '#7a42f4',
       padding: 10,
       margin: 15,
       height: 40,
    },
    submitButtonText:{
       color: '#FA9917'
       
    }
  })
  
  
