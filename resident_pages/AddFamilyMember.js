import React, { Component } from 'react';
import {
    AppRegistry, View, Text, TextInput, StyleSheet, Button, Card,ActivityIndicator,
    Image, TouchableOpacity, alertMessage, Alert, ScrollView
} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import ImagePicker from 'react-native-image-picker'
import PhoneInput from "react-native-phone-input";
import { openDatabase } from 'react-native-sqlite-storage';
import { Fonts } from '../pages/src/utils/Fonts';
import CountryPicker, {
    getAllCountries
  } from 'react-native-country-picker-modal'
import {
    TextField
  } from
    'react-native-material-textfield';

var db = openDatabase({ name: global.DB_NAME });

const options = {
    title: 'Select a Photo',
    takePhotoButton: 'Take a Photo',
    chooseFromLibraryButton: 'Choose From Library',
    quality: 0.50,
    maxWidth: 600,
    maxHeight: 800,
    storageOptions: {
    skipBackup: true,
    },
    };

export default class AddFamilyMember extends Component {

   state = {
        FirstName: '',
        LastName: '',
        MobileNumber: '',
        Relation: '',
        imgPath: "",
        OTPNumber: ''
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

    constructor() {
        super();
        this.state = {
            imageSource: null,
            data: null,
            valid: "",
            type: "",
            value: "",
            isLoading: false,
            PickerValueHolder: '',
            cca2: 'IN',
            callingCode: '91',
            isLoading: false,
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

            });
        });

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
                    imgPath: response.uri,
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
            let number = '+' + this.state.callingCode + mobile;
            member = {
                "FMFName": first,
                "FMLName": last,
                "FMMobile": mobile,
                "FMISDCode": '+' + this.state.callingCode,
                "FMImgName": "",
                "MEMemID": global.MyOYEMemberID,
                "UNUnitID": global.SelectedUnitID,
                "FMRltn": relation,
                "ASAssnID": global.SelectedAssociationID,
            }

        
            const url = global.oye247BaseURL+'FamilyMember/create'

            console.log('FamilyMember', JSON.stringify(member));
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
                    console.log('AddFamilyMember response', responseJson);
                    if (responseJson.success) {

                        const imgName = 'PERSONAssociation' + global.SelectedAssociationID + 'Family' + responseJson.data.familyMember.fmid + '.jpg';
                        //      String imgName = PERSON + "Association" + prefManager.getAssociationId() + GUARD + movie.getGuardID() + ".jpg";
                        console.log('AddFamilyMember imgName ', imgName);

                        if (this.state.imgPath) {
                            var data = new FormData();
                            data.append('Test', { uri: this.state.imgPath, name: imgName, type: 'image/jpg' });
                            const config = {
                                method: 'POST',
                                headers: { "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
                                 "content-type": "multipart/form-data",
                                 "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE" },
                                body: data
                            };
                            console.log("AddFamilyMember Config", config);
                            fetch(global.uploadImageURL, config).then(responseData => {
                                console.log("AddFamilyMember sucess==>");
                                console.log(responseData._bodyText);
                                console.log(responseData);
                                //     alert("Image uploaded done! Image path=\nhttp://cohapi.careofhomes.com/Images/selfie.jpg")
                                this.props.navigation.navigate('ViewFamilyMembersListScreen');
                            }).catch(err => {
                                console.log("err==>");
                                alert("Error with image upload!")
                                this.props.navigation.navigate('ViewFamilyMembersListScreen');
                                console.log('AddFamilyMember err '+err);
                            });
                        } else {
                            console.log('AddFamilyMember else ', imgName);
                            this.props.navigation.navigate('ViewFamilyMembersListScreen');
                        }
                    } else {
                        console.log('AddFamilyMember', 'failed');
                        alert('failed to add Family Member !')
                    }
                })
                .catch((error) => {
                    console.error(error);
                    console.log('AddFamilyMember error', error);
                    alert('caught error in adding Family Member')
                });
        } else {
            console.log('Validation', "Failed");
        }

    }

    Validate(first, last, mobile, relation) {
        var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        const reg = /^[0]?[6789]\d{9}$/;
        if (first == ''|| first == undefined) {
            alert('Enter First Name')
            return false
        } 
       else if (format.test(first)) {
            alert('Invalid First Name. It should not contain any special characters ')
            return false
        } 
        else if (last == '' || last == undefined) {
            alert('Enter Last Name')
            return false
        }  else if (format.test(last)) {
            alert('Invalid Last Name. It should not contain any special characters ')
            return false
        } 
        else if (reg.test(mobile) === false || first == undefined) {
            alert('Enter valid Mobile Number')
            return false;
        } else if (relation == '' || relation == undefined) {
            alert('Select Relation')
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
        const { navigate } = this.props.navigation;
        let data = [{ value: 'Father', }, {  value: 'Mother', }, { value: 'Spouse', }, {
            value: 'Son',  }, {  value: 'Daughter',  }, { value: 'Brother',  }, {
            value: 'Sister', }, { value: 'Grand Father', }, { value: 'Grand Mother',  }, {
            value: 'Uncle',  }, { value: 'Aunt',  }, {  value: 'Father-In-Law', }, {
            value: 'Mother-In-Law',  }, { value: 'Sister-In-Law',  }, {
            value: 'Brother-In-Law',  }, {  value: 'Other',
        }];

        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, paddingTop: 20 }}>
                    <ActivityIndicator />
                </View>

            );
        }

        return (

            <View
            style={styles.container}>
            
            <View>
            
            <View style={{flexDirection:'row',}}>
                    <View style={{flex:1, marginTop:43,marginRight:0, justifyContent:'center',marginLeft:10}}>
                        <TouchableOpacity onPress={() => navigate(('ViewFamilyMembersListScreen'), { cat: '' })}
                        >
                        <Image source={require('../pages/assets/images/back.png')}
                        style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                        </TouchableOpacity>
                    </View>
                    {/* <TouchableOpacity 
                        style={{paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 1, alignItems: 'center', flexDirection: 'row',
                            paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:'6%'}}
                            onPress={() => this.props.navigation.navigate('SideMenu')}>
                        <Image source={require('../pages/assets/images/menu_button.png')}
                            style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                    </TouchableOpacity> */}
                    <View style={{ flex: 5, alignItems:'center', justifyContent:'center',}}>
                    <Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
                        style={{height: 40, width: 95, marginTop: 45,marginBottom:5}} />
                    </View>  
                    <View style={{flex:1,marginTop:45, marginRight:10, justifyContent:'center',}}>    
                    </View>                 
                </View> 

                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>Create Family Member</Text>
            
         
            
            </View>
          
                <ScrollView>
                    <View style={{ flexDirection: 'column' }}>
                        <Image source={this.state.imageSource !=
                            null ?
                            this.state.imageSource :
                            require('../pages/assets/images/icons8-manager-50.png')}
                            style={{ height: 120, width: 120, margin: 10, alignSelf: 'center', borderColor:
                                    'orange', margin: '3%', borderRadius: 60, borderWidth: 2,  }} />

                        <TouchableOpacity style={styles.loginScreenButton}
                            onPress={this.selectPhoto.bind(this)}   >
                            <Text style={{ padding: 3,fontSize: 15, alignSelf: 'center', color: 'black' }}>
                                Take a Photo </Text>
                        </TouchableOpacity>

                        <View style={styles.rectangle1}>
                            <View style={{ flexDirection: 'row' }}>
                              <View style={styles.inputWrap}>
                              <TextField
              label='First Name'
              autoCapitalize='words'
              labelHeight={12}
              characterRestriction={30}
              ref={input => { this.textInput1 = input }}
              maxLength={30}
              returnKeyType = { "next" }
              onSubmitEditing={() => { this.textInput2.focus(); }}
              activeLineWidth={0.5}
              fontSize={12}
              onChangeText=
              {this.Firstname}
            />
              </View>
              <View style={styles.inputWrap}>
              <TextField
              label='Last Name'
              returnKeyType = { "next" }
              autoCapitalize='words'
              labelHeight={12}
              characterRestriction={30}
              onSubmitEditing={() => { this.textInput3.focus(); }}
              ref={input => { this.textInput2 = input }}
              maxLength={30}
              activeLineWidth={0.5}
              fontSize={12}
              onChangeText={ this.Lastname}
            />
              </View>
              
          
          
                              
                            </View>
                            <View style={{ flexDirection: 'row', marginRight: '5%', marginLeft: '5%', }}>
          <View style={{ flex: 0.10, flexDirection: 'row', alignItems: 'center', }}>
            <CountryPicker
              onChange={value => {
                this.setState({ cca2: value.cca2, callingCode: value.callingCode })
              }}
              cca2={this.state.cca2}
              translation="eng"
            ></CountryPicker>
          </View>
          <View style={{ flex: 0.12, flexDirection: 'row', marginLeft: 2, alignItems: 'center' }}>
            <Text style={{ color: 'black', fontSize: 12 }}>+{this.state.callingCode}</Text>
          </View>

          <View style={{ flex: 0.90, marginTop: 20 }}>
            <TextField
              label='Mobile Number'
              fontSize={12}
              labelHeight={10}
              characterRestriction={10}
              returnKeyType = { "next" }
              onSubmitEditing={() => { this.textInput4.focus(); }}
              ref={input => { this.textInput3 = input }}
              activeLineWidth={0.5}
              keyboardType='numeric'
              maxLength={10}
              onChangeText={this.Mobile}
            />

          </View>
        </View>
                         
                            <View style={{ marginLeft: 15, paddingRight: 15 }}>
                                <Dropdown
                                    label='Select Relation'
                                    data={data}
                                    fontSize={12}
                                    ref={input => { this.textInput4 = input }}
                                   
                                    onChangeText= {this.Relation}
                                />
                            </View>
                            <TouchableOpacity style={styles.loginScreenButton}
                                onPress={this.AddMember.bind(this, this.state.FirstName, this.state.LastName,
                                    this.state.MobileNumber, this.state.Relation)}  >
                                <Text  style= {{ fontSize: 15, padding: 3, alignSelf: 'center', color: 'black' }}>
                                    Submit </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: { justifyContent: 'center', backgroundColor: "white", height: '100%', width: '100%', },

    rectangle: {
        backgroundColor: 'white', padding: 10, borderColor: 'orange',
        margin: 5, borderRadius: 2, borderWidth: 1, alignContent: 'center',
    },
    rectangle1: {
        backgroundColor: 'white', padding: 5, borderColor: 'orange',
        margin: 5, borderRadius: 2, borderWidth: 1, alignContent: 'center',
    },
    input: {
        marginLeft: 15, marginRight: 15, marginTop: 15, height: 40, borderColor: '#F2F2F2',
        backgroundColor: '#F2F2F2', borderWidth: 1.5, borderRadius: 2, flexDirection: 'row',
    },
    loginScreenButton:{
        alignSelf:'center',
         paddingTop:2,
         paddingBottom:2,
         backgroundColor:'white',
         borderRadius:5,
         borderWidth: 1,
         borderColor: 'orange'
       },
    inputWrap: {
        flex: 1,
        marginLeft:15,
        paddingRight:5
      },

    input_two: {
        marginLeft: 15, marginTop: 15, height: 40, borderColor: '#F2F2F2', backgroundColor: '#F2F2F2',
        borderWidth: 1.5, borderRadius: 2,
    },

    imagee: { height: 14, width: 14, margin: 10, },

    text: { fontSize: 13, color: 'black', justifyContent: 'center', },

    submitButton: { backgroundColor: '#7a42f4', padding: 10, margin: 15, height: 40, },

    submitButtonText: { color: '#FA9917' }

})