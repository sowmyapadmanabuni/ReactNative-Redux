import React, { Component } from 'react';
import { AppRegistry, View, Text, TextInput, StyleSheet, Button, Card,TouchableHighlight,
    Image, TouchableOpacity, alertMessage, Alert, ScrollView
} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import ImagePicker from 'react-native-image-picker'
import PhoneInput from "react-native-phone-input";


const options = {
    title: 'Select a Photo',
    takePhotoButton: 'Take a Photo',
    chooseFromLibraryButton: 'Choose From Library',
    quality: 1
};

export default class EditRegularVisitor extends Component {

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
            imgPath:"",
        };

        this.renderInfo = this.renderInfo.bind(this);

        this.state = {
            dataSource: [],
        };

    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        console.log('componentdidmount fmid start ', params.id)
        //const url = 'http://oye247api.oye247.com/oye247/api/v1/OYEUnit/OYEUnitlist/'+params.id
        const url = 'http://'+ global.oyeURL +'/oye247/api/v1/RegularVisitor/GetRegularVisitorListByRVID/' + params.id
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
                    console.log('responseJson count fmid ', responseJson.data.regularVisitors.reRgVisID);

                    //{{ oyeUnitID: 547,    unitName: 'a190', unitType: 'Flat',
                    //    parkingLotNumber: 'A190',   associationID: 30,  accountID: 247, status: 'Active' },
                 //   alert('get  member !')
                    console.log('Results oyeUnits', responseJson.data.regularVisitors.wkWrkType + ' ' + responseJson.data.regularVisitors.refName);

                    this.setState({
                        FirstName: responseJson.data.regularVisitors.refName,
                        LastName: responseJson.data.regularVisitors.relName,
                        MobileNumber: responseJson.data.regularVisitors.reMobile,
                        Relation: responseJson.data.regularVisitors.wkWrkType,
                    });
                    console.log('Results oyeUnits', responseJson.data.regularVisitors.wkWrkType + ' ' + responseJson.data.regularVisitors.refName);

                } else {
                    console.log('failurre')
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false
                })
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
                    imgPath:response.uri,
                    data: response.data
                });
            }
        });

    }

    AddMember = (first, last, mobile, relation) => {

      /*   this.setState({
            valid: this.phone.isValidNumber(),
            type: this.phone.getNumberType(),
            value: this.phone.getValue()
        }); */
        const { params } = this.props.navigation.state;
        console.log('fmid start ', params.id)
        var result = this.Validate(first, last, mobile, relation)
        if (result === true) {
            //let number = this.phone.getValue() + mobile;
            member = {
                "REFName": first,
                "RELName": last,
                "REMobile": this.state.MobileNumber,
                "MEMemID": global.MyOYEMemberID,
                "UNUnitID": global.SelectedUnitID,
                "WKWrkType": relation,
                "ASAssnID": global.SelectedAssociationID,
                "RERgVisID":params.id
            }
            
            /* {
	"REFName"		: "Sowmya",	"RELName"		: "Padmanabhuni",
	"REMobile"		: "9490791859",	"REISDCode" 	: "+91",	"MEMemID"		: 2,
	"UNUnitID"		: 1,	"WKWrkType"		: "Visitor",	"ASAssnID"		: 25
} */
            const url = 'http://' + global.oyeURL + '/oye247/api/v1/RegularVisitorDetails/update'
            //  const url = 'http://122.166.168.160/oye247/api/v1/RegularVisitor/create'
        //    http://localhost:64284/oye247/api/v1/RegularVisitorDetails/update
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
                     //   "data": {  "regularVisitor": {  "reRgVisID": 49,
                       // alert('Member Added successfully !')
                      //  const imgName='Assn'+responseJson.data.regularVisitor.asAssnID+'Worker'+responseJson.data.regularVisitor.reRgVisID+'.jpg';
                        const imgName='PERSONAssociation'+global.SelectedAssociationID+'Regular'+params.id+'.jpg';

                        //  this.props.navigation.navigate('ResDashBoard');
                        if (this.state.imgPath) {

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
                                 this.props.navigation.navigate('ViewRegularVisitorScreen');
                                }).catch(err => {
                                   console.log("err==>");
                                   alert("Error with image upload!")
                                   this.props.navigation.navigate('ViewRegularVisitorScreen');
                                   console.log(err);
                                });
                        }else{
                            console.log('RegularVisitorDetails ', 'no image');
                            this.props.navigation.navigate('ViewRegularVisitorScreen');
                        }
                    } else {
                        console.log('hiii', 'failed');
                        alert('failed to add member !')
                    }
                    console.log('suvarna', 'hi');
                })
                .catch((error) => {
                    console.error(error);
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
            return false
        } else if (last == '' || last == undefined) {
            alert('Enter Last Name')
            return false
       // } else if (reg.test(mobile) === false || first == undefined) {
        //    alert('Enter valid Mobile Number')
         //   return false;
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
        const { params } = this.props.navigation.state;

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
        let data = [{ value: 'Aunt',  },{value: 'Baby Sitter', }, { value: 'Beautician', }, { value: 'Care Taker', }, { value: 'Carpenter',  }, {value: 'Coach',  }, {  value: 'Cook', }, { value: 'Dance Teacher',  },{ value: 'Dietitian',  },{  
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
        const { params } = this.props.navigation.state;

        return (

            <View style={styles.container}>

<View style={{ backgroundColor: '#FFF', height: '100%' }}>
      <View>
        <View
          style={{
            paddingTop: 25, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
            borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
            marginTop:10,
          }}>
          <TouchableOpacity onPress={() => navigate(('ViewRegularVisitorScreen'), { cat: '' })}
            style={{ flex: 1 }}>
            <Image source={require('../pages/assets/images/back.png')}
              style={{ height: 25, width: 25, margin: 10, alignSelf: 'center' }} />
          </TouchableOpacity>
          <Text style={{ flex: 3, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>
          <Text style={{ flex: 6, fontSize: 16, color: 'black',fontWeight:'bold',alignContent:'center',justifyContent:'center', marginTop: 16, }}>Edit Regular Visitor</Text>
          <View style={{ flex: 4, alignSelf: 'center' }}>
            <Image source={require('../pages/assets/images/OyeSpace_hor.png')}
              style={{
                height: 35, width: 105, margin: 5,
                alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
              }} />
          </View>
        </View>
        <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
       
      </View>
                <ScrollView>
                    <View style={{ flexDirection: 'column' }}>
                    <TouchableHighlight

style={[styles.profileImgContainer, {
    borderColor: 'orange',alignSelf: 'center',
    borderWidth: 1,
}]}
>
                        <Image source={this.state.imageSource !=
                            null ?
                            this.state.imageSource : {
                                uri: global.viewImageURL+'PERSONAssociation' + global.SelectedAssociationID + 'REGULAR' + params.id + '.jpg'
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
                                <View style={{flex: 1, flexDirection: 'row', marginLeft:
                                        '2%', marginTop: 5, height: 40, borderColor: '#F2F2F2', backgroundColor:
                                        '#F2F2F2', borderWidth: 1.5, borderRadius: 2, }}>

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

                                <View style={{ flex: 1, flexDirection: 'row', marginLeft:
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
                            </View>
 */}
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
                                    label='Select Work Type'
                                    data={data}
                                    value={this.state.Relation}
                                    onChangeText= {this.Relation}
                                />
                            </View>
                            <TouchableOpacity style={styles.rectangle}
                                onPress={this.AddMember.bind(this, this.state.FirstName, this.state.LastName,
                                    this.state.MobileNumber, this.state.Relation)}  >
                                <Text  style= {{ fontSize: 16, padding: 3, alignSelf: 'center', color: 'orange' }}>
                                    Submit </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                </View>
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
    profileImg: {  height: 120, width: 120, borderRadius: 60, },

    imagee: { height: 14, width: 14, margin: 10, },

    text: { fontSize: 13, color: 'black', justifyContent: 'center', },

    submitButton: { backgroundColor: '#7a42f4', padding: 10, margin: 15, height: 40, },

    submitButtonText: { color: '#FA9917' }

})