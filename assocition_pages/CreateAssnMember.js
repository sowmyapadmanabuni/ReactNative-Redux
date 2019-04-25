
import React, { Component } from 'react';
import { AppRegistry, View, Text, TextInput, StyleSheet, Button, Card,
    Image, TouchableOpacity, Alert, alertMessage } from 'react-native';
    import { mystyles} from '../pages/styles'

import { Dropdown } from 'react-native-material-dropdown';


export default class addmembers extends Component {

    static navigationOptions = {
        title: 'Add members',
        headerStyle: { backgroundColor: '#696969', },
        headerTitleStyle: { color: '#fff', }
    };

    constructor(props) {
        super(props);
        this.state = {
            imageLoading:true
        }
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        console.log('add mrmber start ', params.id)
    }
    state = {
        FirstName:'',
        LastName:'',
        Mobilenumber:'',
        MemberType:'',
    }

    handleFirstName = (firstname) => {
        this.setState({
            FirstName:     firstname
        })
    }

    handleLastName = (lastname)=> {
        this.setState({
            LastName: lastname
        })
    }

    handleMobile = (mobilenumber)=> {
        this.setState({
            Mobilenumber:  mobilenumber
        })
    }

    handleRelation = (relation)=> {
        this.setState({
            Relation:  relation
        })
    }

    //Function
    AddMember = (firstname, lastname, mobilenumber, relation)=> {

        var result = this.Validate(firstname, lastname, mobilenumber, relation)

        if (result ===true) {

            const {  navigate } = this.props.navigation;
            member = {
                "AssociationID": 30, "OyeUnitID": 548, "FirstName": firstname, "LastName": lastname,
                "MobileNumber": "+91" + mobilenumber, "VisitorType": "Family", "AadharNumber": "5555"
            }

            console.log('member', member);

            fetch('http://oye247api.oye247.com/oye247/api/v1/OYEFamilyMembers/create',

                {
                    method:'POST',
                    headers: {
                        'Content-Type':'application/json',
                        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
                    },

                    body: JSON.stringify(member)
                })

                .then((response)=>response.json())

                .then((responseJson)=> {

                    if (responseJson.success) {
                        console.log('response', responseJson);
                        //alert('member added suceefully !')
                        Alert.alert(
                            'Member added successfully!',
                            alertMessage,
                            [
                                {
                                    text: 'Cancel', onPress: ()=>
                                            console.log('Cancel Pressed!')
                                },
                                {
                                    text:'OK', onPress: ()  =>
                                            navigate('Other')
                                },
                            ]
                        )
                    }else {
                        console.log('hiii', failed);
                        alert('failed to add member !')
                    }
                    console.log('suvarna', 'hi');
                })
                .catch((error)=> {
                    console.error(error);
                    alert('caught error in adding member')
                });
        }else {

        }

    }

    Validate(firstname, lastname, mobilenumber, relation) {

        if (firstname =='') {

            Alert.alert('Enter First Name',alertMessage,
                [
                    {
                        text:'Cancel', onPress: () =>
                        console.log('Cancel Pressed!')
                    },
                    {
                        text:'OK', onPress: () =>
                        console.log('Ok Pressed!')
                    },
                ]
            )
            return false

        } else
            if (lastname =='') {
                Alert.alert('Enter Last Name', alertMessage,
                    [
                        {
                            text: 'Cancel', onPress: () =>
                            console.log('Cancel Pressed!')
                        },
                        {
                            text:'OK', onPress: ()=>
                            console.log('Ok Pressed!')
                        },
                    ]
                )
                return  false

            }
            /*else if(this.valMobile(mobilenumber)==false){
                Alert.alert('Enter Mobile Number',alertMessage,
                    [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                        {text: 'OK', onPress: () => console.log('Ok Pressed!')},
                    ]
                )
                return false
            }*/

        return  true

    }

    //Phone number
    valMobile(mobilenumber) {
        let  PHONE_REGEX = /^[6-9][0-9]{9}$/;
        //let phoneTest = NSPredicate(format, "SELF MATCHES %@", PHONE_REGEX)
        let  result = PHONE_REGEX.test(mobilenumber)
        return result
    }

    render() {
        let  data = [{value:'Admin',},{ value:'Resident',}];//, {value:'Tenant',}

        return (

            <View
                style={{ display: 'flex', backgroundColor: '#fff', width: '100%', height: '100%' }}>
               {/*  <Text>Add Members Screen</Text> */}
              <View style={{ display: 'flex', flexDirection:'row', backgroundColor: '#fff', width: '100%' }} >
              <TextInput  style = {styles.input1}
                    underlineColorAndroid= "transparent"
                    placeholder="First Name"
                    placeholderTextColor="black"
                    autoCapitalize="words"
                    width='40%'
                    onChangeText={this.handleFirstName} />

                <TextInput style={styles.input1}
                    underlineColorAndroid="transparent"
                    placeholder="Last Name"
                    placeholderTextColor="black"
                    autoCapitalize="words"
                    width='40%'
                    onChangeText={this.handleLastName} />

              </View>
              <TextInput style={styles.input1}
                    underlineColorAndroid="transparent"
                    placeholder="Email ID"
                    placeholderTextColor="black"
                    autoCapitalize="none"
                    width='80%'
                    onChangeText={this.handleLastName} />

                <TextInput
                    style={styles.input1}
                    underlineColorAndroid="transparent"
                    placeholder="Mobile Number"
                    keyboardType={'numeric'}
                    placeholderTextColor="black"
                    autoCapitalize="none"
                    width='80%'
                    onChangeText={this.handleMobile} />

                <Dropdown
                    style={{ width: '80%' }}
                    label='Select Member Type'
                    data={data}
                    onChangeText= {this.handleRelation} />

                <TouchableOpacity
                    
                    onPress={this.AddMember.bind(this, this.state.FirstName,
                        this.state.LastName, this.state.Mobilenumber,
                        this.state.Relation)}>

                    <Text style={styles.submitButton}> Submit</Text>

                </TouchableOpacity>

            </View>

        );

    }

}

const styles = StyleSheet.create({
    container: {  paddingTop:23},
    input: { margin: 15,  height: 40,  borderColor:'#7a42f4',  borderWidth:1},
    input1: {
        marginLeft: 20, marginRight: 15, marginTop: 15, marginBottom: 15,
        height: 40,
        borderColor: '#F2F2F2',
        backgroundColor: '#F2F2F2',
        borderWidth: 1.5,
        borderRadius : 10,
        
     },
    submitButton: { backgroundColor: 'white', padding:10, borderColor: 'orange',  margin:15, height:40,
        borderRadius: 2, borderWidth: 1,justifyContent:'flex-end'},
    submitButtonText: {color:'white'},
    rectangle1: { flex: 1, backgroundColor: 'white', padding:10, borderColor: 'orange',
 marginLeft:5, marginRight:5, marginTop:5,marginBottom:20, borderRadius: 2, borderWidth: 1, },
})

AppRegistry.registerComponent('addmembers', () =>addmembers);