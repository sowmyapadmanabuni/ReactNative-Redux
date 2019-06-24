import React, { Component } from 'react';
import {
    AppRegistry, View, Text, TextInput, StyleSheet, Button, Card, TouchableHighlight,
    Image, TouchableOpacity, alertMessage, Alert, ScrollView
} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import ImagePicker from 'react-native-image-picker'
import PhoneInput from "react-native-phone-input";
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: global.DB_NAME });

const options = {
    title: 'Select a Photo',
    takePhotoButton: 'Take a Photo',
    chooseFromLibraryButton: 'Choose From Library',
    quality: 1
};

export default class EditFamilyMember extends Component {

    state = {
        FirstName: '',
        LastName: '',
        MobileNumber: '',
        Relation: '',
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
            isLoading: true,
            PickerValueHolder: '',
            imgPath: "",
        };

        this.renderInfo = this.renderInfo.bind(this);

        this.state = {
            dataSource: [],
        };

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

    componentDidMount() {
        const { params } = this.props.navigation.state;
        console.log('fmid start ', params.id)
        console.log('componentdidmount')
        //const url = 'http://oye247api.oye247.com/oye247/api/v1/OYEUnit/OYEUnitlist/'+params.id
        const url = 'http://' + global.oyeURL + '/oye247/OyeLivingApi/v1/FamilyMember/GetFamilyMemberListByFMemID/' + params.id
        console.log(url)
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    // dataSource: responseJson.data.oyeUnits,
                    isLoading: false
                })
                console.log('unitlist in ', responseJson)
                if (responseJson.success) {
                    console.log('ravii', responseJson);
                    console.log('responseJson count fmid ', responseJson.data.familyMember.fmid);

                    //{{ oyeUnitID: 547,    unitName: 'a190', unitType: 'Flat',
                    //    parkingLotNumber: 'A190',   associationID: 30,  accountID: 247, status: 'Active' },
                    //   alert('get  member !')
                    console.log('Results oyeUnits', responseJson.data.familyMember.fmRltn + ' ' + responseJson.data.familyMember.fmlName);

                    this.setState({
                        FirstName: responseJson.data.familyMember.fmfName,
                        LastName: responseJson.data.familyMember.fmlName,
                        MobileNumber: responseJson.data.familyMember.fmMobile,
                        Relation: responseJson.data.familyMember.fmRltn,
                    });
                    console.log('Results oyeUnits', responseJson.data.familyMember.fmRltn + ' ' + responseJson.data.familyMember.fmlName);

                    console.log('success')

                } else {
                    console.log('failurre')
                }
            })
            .catch((error) => {
                this.setState({

                    isLoading: false
                })
                console.log(error)
                console.log('unitlist err ', error)

            })
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

        /* this.setState({
            valid: this.phone.isValidNumber(),
            type: this.phone.getNumberType(),
            value: this.phone.getValue()
        });
 */
        const { params } = this.props.navigation.state;
        console.log('fmid start ', params.id)
        var result = this.Validate(first, last, mobile, relation)
        if (result === true) {
            //let number = this.phone.getValue() + mobile;
            member = {
                "FMFName": first,
                "FMLName": last,
                "FMMobile": this.state.MobileNumber,
                "FMImgName": "",
                "MEMemID": global.MyOYEMemberID,
                "UNUnitID": global.SelectedUnitID,
                "FMRltn": relation,
                "ASAssnID": global.SelectedAssociationID,
                "FMID": params.id
            }

            /* "{
                ""FMFName""	: ""Sowmya"", ""FMLName""	: ""Padmanabhuni"",
                ""FMMobile""	: ""9490791526"",  ""FMISDCode"" : ""+91"",
                ""FMImgName""	: ""Somujpeg"",  ""MEMemID""	: ""2"",
                ""UNUnitID""	: ""1"",  ""FMRltn""	: ""Sister"",   ""ASAssnID""	: 6
            }" */
            const url = 'http://' + global.oyeURL + '/oye247/OyeLivingApi/v1/FamilyMemberDetails/update'
            //  const url = 'http://192.168.1.254:27/oye247/api/v1/FamilyMemberDetails/update'

            console.log('member', JSON.stringify(member));
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
                    console.log('response', responseJson);
                    if (responseJson.success) {

                        //  alert('Member Added successfully !')
                        // this.props.navigation.navigate('ViewFamilyMembersListScreen');
                        const imgName = 'PERSONAssociation' + global.SelectedAssociationID + 'Family' + params.id + '.jpg';
                        //   {associationId}Family{ oyeFamilyMemberID}.jpg based on Family Member ID
                        if (this.state.imgPath) {
                            //   alert("start with image upload!")

                            var data = new FormData();
                            data.append('Test', { uri: this.state.imgPath, name: imgName, type: 'image/jpg' });
                            const config = {
                                method: 'POST',
                                headers: { "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1", "content-type": "multipart/form-data" },
                                body: data
                            };
                            console.log("Config", config);
                            fetch(global.uploadImageURL, config).then(responseData => {
                                console.log("sucess==>");
                                console.log(responseData._bodyText);
                                console.log(responseData);
                                //     alert("Image uploaded done! Image path=\nhttp://cohapi.careofhomes.com/Images/selfie.jpg")
                                this.props.navigation.navigate('ViewFamilyMembersListScreen');
                            }).catch(err => {
                                console.log("err==>");
                                alert("Error with image upload!")
                                this.props.navigation.navigate('ViewFamilyMembersListScreen');
                                console.log(err);
                            });
                        } else {
                            console.log('FamilyMemberDetails ', 'no image');
                            this.props.navigation.navigate('ViewFamilyMembersListScreen');
                        }
                    } else {
                        //console.log('hiii', failed);
                        alert('failed to update member !')
                    }
                    console.log('suvarna', 'hi');
                })
                .catch((error) => {
                    console.error(error);
                    alert('caught error in editing member')
                });
        } else {
            console.log('Validation', "Failed");
        }

    }

    Validate(first, last, mobile, relation) {

        const reg = /^[0]?[6789]\d{9}$/;
        if (first == '' || first == undefined) {
            alert('Enter First Name')
            return false
        } else if (last == '' || last == undefined) {
            alert('Enter Last Name')
            return false
            // } else if (reg.test(mobile) === false || mobile == undefined) {
            //   alert('Enter valid Mobile Number')
            //   return false;
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
        const { params } = this.props.navigation.state;
        const {
            navigate } = this.props.navigation;
        let data = [{ value: 'Father', }, { value: 'Mother', }, { value: 'Spouse', }, {
            value: 'Son',
        }, { value: 'Daughter', }, { value: 'Brother', }, {
            value: 'Sister',
        }, { value: 'Grand Father', }, { value: 'Grand Mother', }, {
            value: 'Uncle',
        }, { value: 'Aunt', }, { value: 'Father-In-Law', }, {
            value: 'Mother-In-Law',
        }, { value: 'Sister-In-Law', }, { value: 'Brother-In-Law', }, {
            value: 'Other',
        }];

        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, paddingTop: 20 }}>
                    <ActivityIndicator />
                </View>

            );
        }

        return (

            <View style={styles.container}>
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
                    <View style={{ flex: 5, alignItems:'center', justifyContent:'center'}}>
                    <Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
                        style={{height: 40, width: 95, marginTop: 45,marginBottom:5}} />
                    </View>  
                    <View style={{flex:1,marginTop:45, marginRight:10, justifyContent:'center',}}>    
                    </View>                 
                </View> 

                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>Edit Family Member</Text>
            </View>
                <ScrollView>
                    <View style={{ flexDirection: 'column' }}>
                        <TouchableHighlight

                            style={[styles.profileImgContainer, {
                                borderColor: 'orange', alignSelf: 'center',
                                borderWidth: 1,
                            }]}
                        >
                            <Image source={this.state.imageSource !=
                                null ?
                                this.state.imageSource : {
                                    uri: global.viewImageURL + 'PERSONAssociation' + global.SelectedAssociationID + 'Family' + params.id + '.jpg'
                                }}
                                style={styles.profileImg} />
                        </TouchableHighlight>

                        <TouchableOpacity style={styles.rectangle}
                            onPress={this.selectPhoto.bind(this)}   >
                            <Text style={{ fontSize: 16, alignSelf: 'center', color: 'orange' }}>
                                Take a photo </Text>
                        </TouchableOpacity>

                        <View style={styles.rectangle1}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{
                                    flex: 1, flexDirection: 'row', marginLeft:
                                        '2%', marginTop: 5, height: 40, borderColor: '#F2F2F2', backgroundColor:
                                        '#F2F2F2', borderWidth: 1.5, borderRadius: 2,
                                }}>

                                    <Image source={require('../pages/assets/images/man-user.png')}
                                        style={styles.imagee} />
                                    <TextInput style={styles.text}
                                        underlineColorAndroid="transparent"
                                        placeholder="First Name"
                                        placeholderTextColor="#828282"
                                        autoCapitalize="words"
                                        value={this.state.FirstName}
                                        onChangeText={this.Firstname} />
                                </View>

                                <View style={{
                                    flex: 1, flexDirection: 'row', marginLeft:
                                        '2%', marginRight: 5, marginTop: 5, height:
                                        40, borderColor: '#F2F2F2', backgroundColor:
                                        '#F2F2F2', borderWidth: 1.5, borderRadius: 2,
                                }}>

                                    <Image source={require('../pages/assets/images/man-user.png')}
                                        style={styles.imagee} />
                                    <TextInput style={styles.text}
                                        underlineColorAndroid="transparent"
                                        placeholder="Last Name"
                                        placeholderTextColor="#828282"
                                        autoCapitalize="words"
                                        value={this.state.LastName}
                                        onChangeText={this.Lastname} />
                                </View>
                            </View>
                            {/*  <View style={styles.input}>
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
                            <View style={{ marginLeft: 15, paddingRight: 15 }}>
                                <Dropdown
                                    label='Select Relation'
                                    data={data}
                                    value={this.state.Relation}
                                    onChangeText={this.Relation}
                                />
                            </View>
                            <TouchableOpacity style={styles.rectangle}
                                onPress={this.AddMember.bind(this, this.state.FirstName, this.state.LastName,
                                    this.state.MobileNumber, this.state.Relation)}  >
                                <Text style={{ fontSize: 16, padding: 3, alignSelf: 'center', color: 'orange' }}>
                                    Update </Text>
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
    input: {
        marginLeft: 15, marginRight: 15, marginTop: 15, height: 40, borderColor: '#F2F2F2',
        backgroundColor: '#F2F2F2', borderWidth: 1.5, borderRadius: 2, flexDirection: 'row',
    },

    input_two: {
        marginLeft: 15, marginTop: 15, height: 40, borderColor: '#F2F2F2', backgroundColor: '#F2F2F2',
        borderWidth: 1.5, borderRadius: 2,
    },
    profileImgContainer: { marginTop: 5, height: 120, width: 120, borderRadius: 60, },
    profileImg: { height: 120, width: 120, borderRadius: 60, },

    imagee: { height: 14, width: 14, margin: 10, },

    text: { fontSize: 13, color: 'black', justifyContent: 'center', },

    submitButton: { backgroundColor: '#7a42f4', padding: 10, margin: 15, height: 40, },

    submitButtonText: { color: '#FA9917' }

})