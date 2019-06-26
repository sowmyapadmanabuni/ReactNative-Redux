
import React, { Component } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator,
    Platform, alertMessage, Image, Picker, Button, Alert, ScrollView
} from "react-native";
import PhoneInput from "react-native-phone-input";
import ImagePicker from 'react-native-image-picker';


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
export default class EditWorker extends Component {

    state = {
        FirstName: '',
        LastName: '',
        MobileNumber: '',
        EmailId: '',
        AadhaarNumber: '',
        DesgnPickerValueHolder: '0',

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

    Email = (email) => {
        this.setState({ EmailId: email })
    }

    Aadhaar = (aadhaar) => {
        this.setState({ AadhaarNumber: aadhaar })
    }

    constructor() {
        super();
        this.state = {
            valid: "",
            type: "",
            value: "",
            isLoading: true,
            DesgnPickerValueHolder: '0',
            imgPath: "",
        };

        this.renderInfo = this.renderInfo.bind(this);

    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        console.log('WorkersByWorkerID componentdidmount start ', params.id)
        //const url = 'http://localhost:64284/oye247/api/v1/GetWorkersListByWorkerID/{WorkerID}
        const url = 'http://' + global.oyeURL + '/oye247/api/v1/GetWorkersListByWorkerID/' + params.id
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
                this.setState({ isLoading: false })
                //  console.log('unitlist in ', responseJson)
                if (responseJson.success) {
                    console.log('responseJson count WorkersByWorkerID: ', responseJson.data.workers.wkWorkID);
                    console.log('Results WorkersByWorkerID', responseJson.data.workers.wkidCrdNo + ' ' + responseJson.data.workers.wkWrkType);

                    this.setState({
                        FirstName: responseJson.data.workers.wkfName,
                        LastName: responseJson.data.workers.wklName,
                        MobileNumber: responseJson.data.workers.wkMobile,
                        Relation: responseJson.data.workers.wkWrkType,
                        DesgnPickerValueHolder: responseJson.data.workers.wkDesgn,
                        AadhaarNumber: responseJson.data.workers.wkidCrdNo,

                    });
                    console.log('Results WorkersByWorkerID', responseJson.data.workers.wkidCrdNo + ' ' + responseJson.data.workers.wkWrkType);

                } else {
                    console.log('WorkersByWorkerID failurre')
                }
            })
            .catch((error) => {
                this.setState({ isLoading: false })
                console.log('WorkersByWorkerID err ', error)
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
            console.log('img size  = ', response.data.length);
        });

    }

    onAddGuard = (first, last, mobile, DesgnPickerValueHolder, aadhaar) => {

        const { params } = this.props.navigation.state;
        

        var result = this.Validate(first, last, mobile, DesgnPickerValueHolder, aadhaar)

        if (result === true) {
            console.log('Validation', "Passed");
            
            const imgName = "PERSONAssociation" + params.asAssnID + "GUARD" + params.id + ".jpg";

            member = {
                "WKFName": first,
                "WKLName": last,
                "WKMobile": mobile,
                "WKISDCode": mobile,
                "WKImgName": imgName,
                "WKDesgn": this.state.DesgnPickerValueHolder,
                "WKWrkType": "Security",
                "WKIDCrdNo": aadhaar,
                "WKIsActive": "true",
                "WKWorkID": params.id
            }

            console.log('member', member);
            //const url = 'http://localhost:64284/oye247/api/v1/Worker/WorkerDetailsUpdate'
            const url = 'http://' + global.oyeURL + '/oye247/api/v1/Worker/WorkerDetailsUpdate'
            //const url = 'http://oye247api.oye247.com/oye247/api/v1/OYESecurityGuard/Add'
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
                },
                body: JSON.stringify(member)

            })
                .then((response) => response.json())
                .then((responseJson) => {

                    if (responseJson.success) {
                        console.log('response', responseJson);
                        // alert('Guard Edited Successfully!');
                        //  this.props.navigation.navigate('GuardListScreen');
                        if (this.state.imgPath) {
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
                                this.props.navigation.navigate('GuardListScreen');
                            }).catch(err => {
                                console.log("err==>");
                                alert("Error with image upload!")
                                this.props.navigation.navigate('GuardListScreen');
                                console.log(err);
                            });
                        } else {
                            this.props.navigation.navigate('GuardListScreen');
                        }
                    } else {
                        console.log('hiii', 'failed');
                        alert('Failed to Edit Worker !')
                    }
                    console.log('suvarna', 'hi');
                })
                .catch((error) => {
                    console.error(error);
                    alert('aught error in Edit Worker')
                });
        } else {
            console.log('Validation', "Failed");
            //  alert('caught Validation in Failed guard')
        }

    }

    Validate(first, last, mobile, DesgnPickerValueHolder, aadhaar) {

        const reg = /^[0]?[6789]\d{9}$/;
        let regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        console.log('Ok Pressed!' + this.state.DesgnPickerValueHolder + ' ' + DesgnPickerValueHolder);
        if (first == '' || first == undefined) {
            alert('Enter First Name');
            return false

        } else if (last == '' || last == undefined) {
            alert('Enter Last Name');
            return false
        } else if (this.state.DesgnPickerValueHolder == '0' || this.state.DesgnPickerValueHolder == undefined) {
            alert('Select Work Type');
            return false
        }

        return true

    }

    GetPickerSelectedItemValue = () => {
        Alert.alert(this.state.DesgnPickerValueHolder);
    }

    renderInfo() {
        if (this.state.value) {

            return (
                <View style={styles.info}>
                    <Text>Is Valid:{" "}
                        <Text style={{ fontWeight: "bold" }}>
                            {this.state.valid.toString()}
                        </Text>
                    </Text>
                    <Text>Type: <Text style={{ fontWeight: "bold" }}>{this.state.type}</Text>
                    </Text>
                    <Text>Value:{" "}
                        <Text style={{ fontWeight: "bold" }}>{this.state.value}</Text>
                    </Text>
                </View>

            );
        }
    }

    render() {

        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, paddingTop: 20 }}>
                    <ActivityIndicator />
                </View>
            );
        }
        const { params } = this.props.navigation.state;
        
        const {
            navigate } = this.props.navigation;
        return (

            <View style={styles.container}>
            <View>
            <View style={{flexDirection:'row',}}>
                    <View style={{flex:1, marginTop:43,marginRight:0, justifyContent:'center',marginLeft:10}}>
                        <TouchableOpacity onPress={() => navigate(('GuardListScreen'), { cat: '' })}
                        >
                        <Image source={require('../pages/assets/images/back.png')}
                        style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                        </TouchableOpacity>
                    </View>
                   
                    <View style={{ flex: 5, alignItems:'center', justifyContent:'center'}}>
                    <Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
                        style={{height: 40, width: 95, marginTop: 45,marginBottom:5}} />
                    </View>  
                    <View style={{flex:1,marginTop:45, marginRight:10, justifyContent:'center',}}>    
                    </View>                 
                </View> 

                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>Edit Worker</Text>
            </View>
                <ScrollView>
                    <View style={{ flexDirection: 'column' }}>
                        <Image
                            source={this.state.imageSource !=
                                null ?
                                this.state.imageSource : {
                                    uri: global.viewImageURL+'PERSONAssociation' + params.asAssnID + 'GUARD' + params.id + '.jpg'
                                }}

                            style={{
                                height: 120, width: 120, margin: 10, alignSelf: 'center', borderColor:
                                    'orange', margin: 15, borderRadius: 60, borderWidth: 2,
                            }} />

                        <TouchableOpacity
                            style={styles.rectangle}
                            onPress={this.selectPhoto.bind(this)}  >
                            <Text style={{ fontSize: 16, alignSelf: 'center', color: 'orange' }}>
                                Take a photo </Text>
                        </TouchableOpacity>

                        <View style={styles.rectangle}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{
                                    flex: 1, flexDirection: 'row', marginLeft: '2%', marginTop: '2%', height:
                                        40, borderColor: '#F2F2F2', backgroundColor: '#F2F2F2', borderWidth:
                                        1.5, borderRadius: 2,
                                }}>

                                    <Image
                                        source={require('../pages/assets/images/man-user.png')}
                                        style={styles.imagee} />

                                    <TextInput style={styles.text2}
                                        underlineColorAndroid="transparent"
                                        placeholder="First Name"
                                        placeholderTextColor="#828282"
                                        autoCapitalize="words"
                                        maxLength={50}
                                        value={this.state.FirstName}
                                        onChangeText={this.Firstname} />

                                </View>

                                <View style={{
                                    flex: 1, flexDirection: 'row', marginLeft: '2%', marginRight: '2%', marginTop:
                                        '2%', height: 40, borderColor: '#F2F2F2', backgroundColor: '#F2F2F2', borderWidth:
                                        1.5, borderRadius: 2,
                                }}>

                                    <Image
                                        source={require('../pages/assets/images/man-user.png')}
                                        style={styles.imagee} />

                                    <TextInput style={styles.text2}
                                        underlineColorAndroid="transparent"
                                        placeholder="Last Name"
                                        placeholderTextColor="#828282"
                                        autoCapitalize="words"
                                        maxLength={50}
                                        value={this.state.LastName}
                                        onChangeText={this.Lastname} />
                                </View>

                            </View>

                            
                            <Picker style={{ fontSize: 5 }}
                                selectedValue={this.state.DesgnPickerValueHolder}
                                onValueChange={(itemValue, itemIndex) => this.setState({ DesgnPickerValueHolder: itemValue })} >

                                <Picker.Item label="Select Worker Type" value='0' />
                                <Picker.Item label="Security Guard" value='Security Guard' />
                                <Picker.Item label="Supervisor" value='Supervisor' />
                            </Picker>
                            
                            <View style={styles.input}>

                                <Image
                                    source={require('../pages/assets/images/icons8-name-tag-80.png')}
                                    style={styles.imagee} />

                                <TextInput style={styles.text1}
                                    underlineColorAndroid="transparent"
                                    placeholder="ID Card Number"
                                    placeholderTextColor="#828282"
                                    autoCapitalize="characters"
                                    maxLength={50}
                                    value={this.state.AadhaarNumber}
                                    onChangeText={this.Aadhaar} />

                            </View>

                            <TouchableOpacity style={styles.rectangle}
                                onPress={this.onAddGuard.bind(this, this.state.FirstName,
                                    this.state.LastName,
                                    this.state.MobileNumber,
                                    this.state.DesgnPickerValueHolder,
                                    this.state.AadhaarNumber)}>

                                <Text style={{ fontSize: 16, padding: 3, alignSelf: 'center', color: 'orange' }}>
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

    container: {
        justifyContent: 'center', backgroundColor: "#fff", height: '100%', width: '100%',
    },

    rectangle: {
        backgroundColor: 'white', padding: 10, borderColor: 'orange',
        margin: 15, borderRadius: 2, borderWidth: 1, alignContent: 'center',
    },

    input: {
        marginLeft: '2%', marginRight: '2%', marginTop: '2%', height: 40, borderColor: '#F2F2F2',
        backgroundColor: '#F2F2F2', borderWidth: 1.5, borderRadius: 2,
        flexDirection: 'row',
    },

    input_two: {
        marginLeft: 15, marginTop: 15, height: 40,
        borderColor: '#F2F2F2', backgroundColor: '#F2F2F2',
        borderWidth: 1.5, borderRadius: 2,
    },

    imagee: { height: 14, width: 14, margin: 10, },

    text: { fontSize: 13, color: 'black', justifyContent: 'center', },
    text1: { fontSize: 13, color: 'black', justifyContent: 'center', width: '80%' },
    text2: { fontSize: 13, color: 'black', justifyContent: 'center', width: '65%' },
    submitButton: {
        backgroundColor: '#7a42f4', padding: 10, margin: 15, height: 40,
    },

    submitButtonText: { color: '#FA9917' }

})

module.exports = EditWorker;