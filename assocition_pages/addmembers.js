import React, { Component } from 'react';
import { AppRegistry,View,Text,TextInput,StyleSheet,Button,Card,Image,TouchableOpacity,Alert,alertMessage} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';

export default class addmembers extends Component{
    static navigationOptions = {
        title: 'Add members',
        headerStyle:{
            backgroundColor:'#696969',
        },
        headerTitleStyle:{
            color:'#fff',
        }
    };

    constructor(props){
        super(props);
        this.state={
          imageLoading : true
        }
      }
      state = {
        FirstName: '',
        LastName: '',
        Mobilenumber: '',
        Relation: '',
     }

     handleFirstName = (firstname) => {
         this.setState({FirstName: firstname})
     }

     handleLastName = (lastname) => {
         this.setState({LastName: lastname})
     }
     handleMobile = (mobilenumber) => {
        this.setState({ Mobilenumber: mobilenumber })
     }
     handleRelation = (relation) => {
        this.setState({ Relation: relation })
     }
     
     //Function

     AddMember=(firstname,lastname,mobilenumber,relation) =>{
        var result = this.Validate(firstname,lastname,mobilenumber,relation)
        if(result === true){
        const { navigate } = this.props.navigation;
            member={"AssociationID":30,"OyeUnitID":548,"FirstName":firstname,"LastName":lastname,
            "MobileNumber":"+91"+mobilenumber,"VisitorType":"Family","AadharNumber":""}

            console.log('member',member);
            fetch('http://oye247api.oye247.com/oye247/api/v1/OYEFamilyMembers/create',
            {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      "X-OYE247-APIKey":"7470AD35-D51C-42AC-BC21-F45685805BBE",
                    },
                    body: JSON.stringify(member)
              })
                  .then((response) => response.json())
                  .then((responseJson) => {
                      if(responseJson.success){
                        console.log('response',responseJson);
                        //alert('member added suceefully !')
                        Alert.alert(
                            'Member added successfully!',
                            alertMessage,
                            [
                              {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                              {text: 'OK',  onPress: () => navigate('Other')},
                              
                            ]
                          )
                      }
                      else{
                        console.log('hiii',responseJson);
                        alert('failed to add member !')
                      }
              console.log('suvarna','hi');
                  })
                  .catch((error) => {
                    console.error(error);
                    alert('caught error in adding member')
                  });
                  
            }
    else{

    }
}

componentDidMount() {
    const { params } = this.props.navigation.state;
    console.log('add mrmber start ', params.id)
}

      Validate(firstname,lastname,mobilenumber,relation){
        if(firstname == ''){
            Alert.alert(
                'Enter First Name',
                alertMessage,
                [
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                  {text: 'OK',  onPress: () => console.log('Ok Pressed!')},
                ]
              )
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
        }/*else if(this.valMobile(mobilenumber)==false){
            Alert.alert(
                'Enter Mobile Number',
                alertMessage,
                [
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                  {text: 'OK',  onPress: () => console.log('Ok Pressed!')},
                ]
              )
              return false
        }*/
        return true
    }

     //Phone number
     valMobile(mobilenumber){
        let PHONE_REGEX = /^[6-9][0-9]{9}$/;
        //let phoneTest = NSPredicate(format, "SELF MATCHES %@", PHONE_REGEX)
        let result =  PHONE_REGEX.test(mobilenumber)
        return result
    }

    render(){
        let data = [{
            value: 'Father',
        }, {
            value: 'Mother',
        }, {
            value: 'Spouse',
        },{
            value: 'Son',
        },{
            value: 'Daughter',
        }, {
            value: 'Brother',
        },{
          value: 'Sister',
        },{
          value: 'Grand Father',
        },{
          value: 'Grand Mother',
        },{
            value: 'Uncle',
        },{
            value: 'Aunt',
        },{
            value: 'Father-In-Law',
        },{
            value: 'Mother-In-Law',
        },{
            value: 'Sister-In-Law',
        },{
            value: 'Brother-In-Law',
        },{
            value: 'Other',
        }];
        return(
            <View style={{display:'flex',backgroundColor:'#fff',width:'100%',height:'100%'}}>
                <Text>Add Members Screen</Text>
               {/*  <Image
                    source={require('../pages/assets/images/homee.png')}
                    style={{height:100,width:100,alignItems:"center"}}/> */}
                        <TextInput style = {styles.input}
                        underlineColorAndroid = "transparent"
                        placeholder = "First Name"
                        placeholderTextColor = "#9a73ef"
                        autoCapitalize = "none"
                        width = '80%'
                        onChangeText = {this.handleFirstName}/>
                        
                        <TextInput style = {styles.input}
                        underlineColorAndroid = "transparent"
                        placeholder = "Last Name"
                        placeholderTextColor = "#9a73ef"
                        autoCapitalize = "none"
                        width = '80%'
                        onChangeText = {this.handleLastName}/>

                         <TextInput style = {styles.input}
                        underlineColorAndroid = "transparent"
                        placeholder = "Mobile Number"
                        placeholderTextColor = "#9a73ef"
                        autoCapitalize = "none"
                        width = '80%'
                        onChangeText = {this.handleMobile}/>

                         <Dropdown style = {{width:'80%'}}
                        label='Select Relation..'
                        data={data}
                        onChangeText = {this.handleRelation}
                         />
                         <TouchableOpacity
                            style = {styles.submitButton}
                            onPress={this.AddMember.bind(this,this.state.FirstName,this.state.LastName,this.state.Mobilenumber,this.state.Relation,this.state.Relation)}
                            >
                            <Text style = {styles.submitButtonText}> Submit </Text>
                            </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
       paddingTop: 23
    },
    input: {
       margin: 15,
       height: 40,
       borderColor: '#7a42f4',
       borderWidth: 1
    },
    submitButton: {
       backgroundColor: '#7a42f4',
       padding: 10,
       margin: 15,
       height: 40,
    },
    submitButtonText:{
       color: 'white'
    }
 })
AppRegistry.registerComponent('addmembers', () => addmembers);