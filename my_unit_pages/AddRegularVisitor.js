import React, { Component } from 'react';
import { AppRegistry, View, Text, TextInput, StyleSheet, Button, Card,
    Image, TouchableOpacity, alertMessage, Alert, ScrollView,ActivityIndicator
} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import ImagePicker from 'react-native-image-picker'
import PhoneInput from "react-native-phone-input";
import { openDatabase } from 'react-native-sqlite-storage';
import { TextField } from 'react-native-material-textfield';
import CountryPicker, {
    getAllCountries
  } from 'react-native-country-picker-modal'

var db = openDatabase({ name: global.DB_NAME });

const options = {
    title: 'Select a Photo',
    takePhotoButton: 'Take a Photo',
    chooseFromLibraryButton: 'Choose From Library',
    quality: 1
};

export default class AddRegularVisitor extends Component {
   
    constructor() {
        super();
        const userCountryData = getAllCountries()
        let callingCode = null
     // this.onButtonPressed = this.onButtonPressed.bind(this);
        this.state = {
            imageSource: null,
            data: null,
            valid: "",
            type: "",
            value: "",
            PickerValueHolder: '',
            imgPath:"",
            FirstName: '',
            LastName: '',
            MobileNumber: '',
            Relation: '',
            cca2:'IN',
            callingCode : '91'
        };

        this.renderInfo = this.renderInfo.bind(this);

        db.transaction(tx => {
            //SELECT B.* From (select max(Time) Time, GuardID FROM RouteTracker group by GuardID ) " +
            // " A inner join RouteTracker B using (Time,GuardID)
            tx.executeSql('SELECT Distinct M.AssociationID, A.Name FROM MyMembership M inner Join Association A on M.AssociationID=A.AssociationID ', [], (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                    console.log('Results UnitID', results.rows.item(i).Name + ' ' + results.rows.item(i).AssociationID);
                    // this.innsert(results.rows.item(i).UnitID,results.rows.item(i).UnitName,results.rows.item(i).Type);
                }

                this.setState({
                    dataSource: temp,
                });
            });
        });

    }

    Firstname = (firstname) => {
        this.setState({ FirstName: firstname })
    }

    Lastname = (lastname) => {
        this.setState({ LastName: lastname })
    }

    Mobile = (mobile) => {
        this.setState({ MobileNumber: mobile })
    }

    Relation = (relation) => {
        this.setState({ Relation: relation })
    }
    //Function
    selectPhoto() {

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
                this.setState({
                    imageSource: source,
                    imgPath:response.uri,
                    data: response.data
                });
            }
        });

    }

    AddMember = (first, last, mobile, relation) => {

        // this.setState({
        //     valid: this.phone.isValidNumber(),
        //     type: this.phone.getNumberType(),
        //     value: this.phone.getValue()
        // });

        var result = this.Validate(first, last, mobile, relation)
        if (result === true) {
            member = {
                "REFName": first,
                "RELName": last,
                "REMobile": mobile,
                "REISDCode": '+'+this.state.callingCode,
                "FMImgName": "",
                "MEMemID": global.MyOYEMemberID,
                "UNUnitID": global.SelectedUnitID ,
                "WKWrkType": relation,
                "ASAssnID":  global.SelectedAssociationID,
            }
            
            /* {
	"REFName"		: "Sowmya",	"RELName"		: "Padmanabhuni",
	"REMobile"		: "9490791859",	"REISDCode" 	: "+91",	"MEMemID"		: 2,
	"UNUnitID"		: 1,	"WKWrkType"		: "Visitor",	"ASAssnID"		: 25
} */
            const url = 'http://' + global.oyeURL + '/oye247/api/v1/RegularVisitor/create'
            //  const url = 'http://122.166.168.160/oye247/api/v1/RegularVisitor/create'

            console.log('AddRegularVisitor member', JSON.stringify(member));
            fetch(url,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
                    },
                    body: JSON.stringify(member)
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log('AddRegularVisitor response', responseJson);
                    if (responseJson.success) {
                        
                     //   "data": {  "regularVisitor": {  "reRgVisID": 49,
                        alert('Regular Visitor Added Successfully !')
                        const imgName='PERSONAssociation'+ global.SelectedAssociationID+'Regular'+responseJson.data.regularVisitor.reRgVisID+'.jpg';

                        //  this.props.navigation.navigate('ResDashBoard');
                        if (this.state.imgPath) {
                          //  alert("start with image upload!")

                            var data = new FormData();
                            data.append('Test', { uri: this.state.imgPath, name: imgName, type: 'image/jpg' });
                            const config = {
                                method: 'POST',
                                headers: {"X-Champ-APIKey":"1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1","content-type": "multipart/form-data"},
                                body: data };
                                console.log("Config",config);
                                 fetch(global.uploadImageURL, config).then(responseData => {
                                   console.log("sucess==>");
                                 console.log(responseData._bodyText);
                                 console.log(responseData);
                            //     alert("Image uploaded done! Image path=\nhttp://cohapi.careofhomes.com/Images/selfie.jpg")
                                 alert('Regular Visitor added Successfully!')
                                 this.props.navigation.navigate('ResDashBoard');
                                }).catch(err => {
                                   console.log("err==>");
                                   alert("Error with image upload!")
                                   this.props.navigation.navigate('ResDashBoard');
                                   console.log(err);
                                });
                        }else{
                            alert('Regular Visitor added Successfully!')
                            this.props.navigation.navigate('ResDashBoard');
                        }
                        
                    } else {
                        console.log('AddRegularVisitor ', 'failed');
                        alert('failed to add member !')
                    }
                    console.log('suvarna', 'hi');
                })
                .catch((error) => {
                    console.error('AddRegularVisitor '+error);
                    alert('caught error in adding member')
                });
        } else {
            console.log('Validation', "Failed");
        }

    }

    Validate(first, last, mobile, relation) {

        const reg = /^[0]?[6789]\d{9}$/;
        if (first == '' || first == undefined) {
            alert('Enter First Name')
            return false;
        } else if(global.oyeOnlyAlpha.test(first) === false){
            alert("First Name should not contain special characters or numbers")
            return false;
        } else if (last == '' || last == undefined) {
            alert('Enter Last Name')
            return false;
        } else if(global.oyeOnlyAlpha.test(last) === false){
            alert("Last Name should not contain special characters or numbers")
           return false;
        } else if ( mobile.length == 0) {
            alert('Enter Mobile Number')
            return false;
        } else if (reg.test(mobile) === false || mobile == undefined) {
            alert('Enter valid Mobile Number')
            return false;
        } else if (relation == '' || relation == undefined) {
            alert('Select Work Type')
            return false
        }
        return true

    }

    GetPickerSelectedItemValue = () => {
        Alert.alert(this.state.PickerValueHolder);
    }

    renderInfo() {

        if (this.state.value) {
            return (
                <View style={styles.info}>
                    <Text> Is Valid:{" "}
                        <Text style={{ fontWeight: "bold" }}>
                            {this.state.valid.toString()}
                        </Text>
                    </Text>
                    <Text> Type: <Text style={{ fontWeight: "bold" }}>{this.state.type}</Text>
                    </Text>
                    <Text>   Value:{" "}
                        <Text style={{ fontWeight: "bold" }}>{this.state.value}</Text>
                    </Text>
                </View>
            );
        }
    }

    render() {
        let dpWorkType = [{ value: 'Aunt',  },{value: 'Baby Sitter', }, { value: 'Beautician', }, { value: 'Care Taker', }, { value: 'Carpenter',  }, {value: 'Coach',  }, {  value: 'Cook', }, { value: 'Dance Teacher',  },{ value: 'Dietitian',  },{  
                        value: 'Doctor', }, { value: 'Driver', }, { value: 'Electrician',  }, {  value: 'Father-In-Law', }, {  value: 'Gym Trainer', },
                        {value: 'Hair dresser',  },{ value: 'Health Instructor',  }, {value: 'Laundry',  },
                        {  value: 'Maid',  },{ value: 'Music Teacher',  },{value: 'Nurse', },
                        { value: 'Physiotherapist',  },{  value: 'Plumber', },{
                            value: 'Sports Teacher',  },{ value: 'Stay at Home Maid',  }, { value: 'Trainer',  },
                            { value: 'Tuition Teacher',  }, {
                                value: 'Uncle',  }, {  
                                    value: 'Others', }          
                 ];

      //  "Care Taker", "Cook", "Driver", "Laundry", "Maid","Stay at Home Maid", "Baby Sitter", 
       // "Beautician", "Carpenter", "Coach",  "Dance Teacher", "Dietitian", 
       // "Doctor", "Electrician",  "Gym Trainer", "Hair dresser", "Health Instructor",
       // "Music Teacher", "Nurse", "Physiotherapist", "Plumber", 
       // "Sports Teacher", "Trainer", "Tuition Teacher","Others"

        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, paddingTop: 20 }}>
                    <ActivityIndicator />
                </View>

            );
        }

        return (

            <View style={styles.container}>
                <ScrollView>
                    <View style={{ flexDirection: 'column' }}>
                        <Image source={this.state.imageSource !=
                            null ?
                            this.state.imageSource :
                            require('../pages/assets/images/icons8-manager-50.png')}
                            style={{ height: 80, width: 80, margin: 10, alignSelf: 'center', borderColor:
                                    'orange', margin: '3%', borderRadius: 40, borderWidth: 2,  }} />

                        <TouchableOpacity style={styles.loginScreenButton}
                            onPress={this.selectPhoto.bind(this)}   >
                            <Text style={{ fontSize: 15,fontWeight:'bold', alignSelf: 'center', color: 'white',  marginLeft:'5%',
       marginRight:'5%', }}>
                                TAKE A PHOTO </Text>
                        </TouchableOpacity>

                        <View style={styles.rectangle1}>
                        <View style={styles.row}>
                        <View style={styles.inputWrap}>
                        <TextField
        label='First Name'
        autoCapitalize='sentences'
        labelHeight={15}
        maxLength={30}
        activeLineWidth={0.5}
        fontSize={12}
        onChangeText={ this.Firstname }
      />
        </View>
        <View style={styles.inputWrap}>
        <TextField
        label='Last Name'
        autoCapitalize='sentences'
        labelHeight={15}
        maxLength={30}
        activeLineWidth={0.5}
        fontSize={12}
        onChangeText={ this.Lastname }
      />
        </View>
        
    
      </View>
      <View style={{ flexDirection: 'row',marginLeft:15,paddingRight:15 }}>
                            <View style={{ flex: 0.10, flexDirection: 'row', marginTop:'3.5%' }}>
                            <CountryPicker
          onChange={value => {
            this.setState({ cca2: value.cca2, callingCode: value.callingCode })
          }}
          cca2={this.state.cca2}
          translation="eng"
        /> 
        </View>
        <View style={{ flex: 0.10, flexDirection: 'row',marginTop:'4.5%' }}>
           <Text style={{color:'black',fontSize:12}}>+{this.state.callingCode}</Text></View>
                            
                            <View style={{ flex: 0.85 }}>
                            <TextField
        label='Mobile Number'
        fontSize={12}
        labelHeight={10}
        characterRestriction={10}
        activeLineWidth={0.5}
        keyboardType='numeric'
        maxLength={10}
        onChangeText={ this.Mobile }
      />
        </View>
                        </View>
                        <View style={{ marginLeft: 15, paddingRight: 15 }}>
                                <Dropdown
                                    label='Select Work Type'
                                    data={dpWorkType}
                                    labelHeight={10}
                                    fontSize={12}
                                    onChangeText= {this.Relation}
                                />
                            </View> 
                            {/* <View style={{ flexDirection: 'row' }}>
                                <View style={{flex: 1, flexDirection: 'row', marginLeft:
                                        '2%', marginTop: 5, borderColor: '#F2F2F2', backgroundColor:
                                        '#F2F2F2', borderWidth: 1.5, borderRadius: 2, }}>

                                    <Image source={require('../pages/assets/images/man-user.png')}
                                        style={styles.imagee} /> */}
       
                                   {/*  <TextInput style={styles.text}
                                        underlineColorAndroid="transparent"
                                        placeholder="First Name"
                                        placeholderTextColor="#828282"
                                        autoCapitalize="words"
                                        //value={this.state.FirstName}
                                        onChangeText={this.Firstname} /> */}
                                {/* </View> */}

                                {/* <View style={{ flex: 1, flexDirection: 'row', marginLeft:
                                        '2%', marginRight: 5, marginTop: 5, height:
                                        40, borderColor: '#F2F2F2', backgroundColor:
                                        '#F2F2F2', borderWidth: 1.5, borderRadius: 2, }}>

                                    <Image source={require('../pages/assets/images/man-user.png')}
                                        style={styles.imagee} />
                                    <TextInput style={styles.text}
                                        underlineColorAndroid="transparent"
                                        placeholder="Last Name"
                                        placeholderTextColor="#828282"
                                        autoCapitalize="words"
                                        onChangeText={this.Lastname} />
                                </View>
                            </View>
                            <View style={styles.input}>
                                <Image style={{ flex: 1 }}
                                    source={require('../pages/assets/images/call-answer.png')}
                                    style={styles.imagee} />
                                <PhoneInput style={styles.text}
                                    style={{ flex: 2 }}
                                    ref={ref => {
                                        this.phone = ref;
                                    }}
                                />
                                <TextInput
                                    style={styles.text}
                                    style={{ flex: 5 }}
                                    underlineColorAndroid="transparent"
                                    placeholder="Mobile Number"
                                    placeholderTextColor="#828282"
                                    autoCapitalize="none"
                                    keyboardType={'numeric'}
                                    maxLength={10}
                                    onChangeText={this.Mobile} />
                            </View> */}

                            {/*  <View style={styles.input}>
                                <Image source={require('../pages/assets/images/envelope.png')}
                                    style={styles.imagee} />
                                <TextInput style={styles.text}
                                    underlineColorAndroid="transparent"
                                    placeholder="Email ID"
                                    placeholderTextColor="#828282"
                                    autoCapitalize="none"
                                    onChangeText={this.Email} />
                            </View> */}
                            {/* <View style={{ marginLeft: 15, paddingRight: 15 }}>
                                <Dropdown
                                    label='Select Work Type'
                                    data={dpWorkType}
                                    onChangeText= {this.Relation}
                                />
                            </View> */}
                            <TouchableOpacity style={styles.loginScreenButton}
                                onPress={this.AddMember.bind(this, this.state.FirstName, this.state.LastName,
                                    this.state.MobileNumber, this.state.Relation)} >
                                <Text  style= {{ fontSize: 15,fontWeight:'bold',padding: 3, alignSelf: 'center', color: 'white',  marginLeft:'5%',
       marginRight:'5%', }}>
                                    SUBMIT </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: { justifyContent: 'center', backgroundColor: "#fff", height: '100%', width: '100%', },

    rectangle: {
        backgroundColor: 'white', padding: 10, borderColor: 'orange',
        margin: 5, borderRadius: 2, borderWidth: 1, alignContent: 'center',
    },
    rectangle1: {
        backgroundColor: 'white', padding: 5, borderColor: 'orange',
        margin: 5, borderRadius: 2, borderWidth: 1, alignContent: 'center',
    },
    loginScreenButton:{
       alignSelf:'center',
       marginTop:5,
        paddingTop:2,
        paddingBottom:2,
        backgroundColor:'#696969',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
      },
    input: {
        marginLeft: 15, marginRight: 15, marginTop: 15, height: 40, borderColor: '#F2F2F2',
        backgroundColor: '#F2F2F2', borderWidth: 1.5, borderRadius: 2, flexDirection: 'row',
    },

    input_two: {
        marginLeft: 15, marginTop: 15, height: 40, borderColor: '#F2F2F2', backgroundColor: '#F2F2F2',
        borderWidth: 1.5, borderRadius: 2,
    },

    imagee: { height: 14, width: 14, margin: 10, },

    text: { fontSize: 13, color: 'black', justifyContent: 'center', },

    submitButton: { backgroundColor: '#7a42f4', padding: 10, margin: 15, height: 40, },
    row: {
        flex: 1,
        flexDirection: "row",
      },
      inputWrap: {
        flex: 1,
        marginLeft:15,
        paddingRight:15
      },

    submitButtonText: { color: '#FA9917' }

})