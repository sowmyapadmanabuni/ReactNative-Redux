import React, {Component} from "react"
import {
    Alert,
    BackHandler,
    Image,
    PermissionsAndroid,
    Platform,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import ImagePicker from "react-native-image-picker";
import {Dropdown} from "react-native-material-dropdown";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import base from "../../../../base";
import {connect} from "react-redux";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view"
import ContactsWrapper from "react-native-contacts-wrapper";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Style from '../MyFamilyAdd/Style';

const RNFS = require('react-native-fs');

class MyFamilyEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            relationList: [
                {
                    value: "Spouse",
                    id: 0
                }, {
                    value: "Parents",
                    id: 1
                }, {
                    value: "Siblings",
                    id: 2
                }, {
                    value: "Child",
                    id: 3
                }, {
                    value: "Relative ",
                    id: 4
                }, {
                    value: "Other",
                    id: 5
                }],
            relationName: '',
            cCode: '',
            mobileNumber: '',
            sendNum: '',
            isMinor: false,
            firstName: '',
            lastName: '',
            minorProps: [{label: 'Yes', value: 0},
                {label: 'No', value: 1}],
            isMinorSelected: 0,
            guardianName: '',
            relativeImage: '',
            imageUrl: '',
            photo: null,
            photoDetails: null,
            isPhotoAvailable: false,
            filePath: '',
            isView:false
        }
        this.processBackPress = this.processBackPress.bind(this);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.processBackPress);
        console.log('Props in Edit Family', this.props.navigation.state.params);
        base.utils.validate.checkSubscription(this.props.assId)

        this.setState({
            firstName: this.props.navigation.state.params.fmName,
            lastName: this.props.navigation.state.params.fmlName,
            mobileNumber: this.props.navigation.state.params.fmMobile, //myFamilyMobileNo
            relationName: this.props.navigation.state.params.fmRltn,
            relativeImage: this.props.navigation.state.params.fmImgName !== '' ? "http://mediaupload.oyespace.com/" + this.props.navigation.state.params.fmImgName : "http://mediaupload.oyespace.com/" + base.utils.strings.noImageCapturedPlaceholder,
            isMinor: this.props.navigation.state.params.fmMinor,
            guardianName: this.props.navigation.state.params.fmGurName,
            cCode: this.props.navigation.state.params.fmisdCode,
            isMinorSelected: this.props.navigation.state.params.fmMinor ? 0 : 1,
            imageUrl: this.props.navigation.state.params.fmImgName,
            isView:this.props.navigation.state.params.isView


        })
    }

    componentDidUpdate() {
        /*setTimeout(() => {
            BackHandler.addEventListener('hardwareBackPress', () => this.processBackPress())
        }, 100)*/
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.processBackPress);
        /*setTimeout(() => {
            BackHandler.removeEventListener('hardwareBackPress', () => this.processBackPress())
        }, 0)*/

    }

    processBackPress() {
        // console.log("Part");
        // const {goBack} = this.props.navigation;
        // goBack(null);
        this.props.navigation.goBack(null);
        return true;
    }

    mobileNumberInputCheck(text) {
        let check = /^\d$/;
        if (check.test(text[text.length - 1]) || text==="+" || text.length === 0) {
            this.setState({ mobileNumber: text })
        }
    }

    render() {

        let mobPlaceHolder = this.state.isMinor && this.state.isMinorSelected === 0 ? "Guardian's Number" : "Mobile Number";
        return (
            <View style={Style.container}>

                <SafeAreaView style={{backgroundColor: "#ff8c00"}}>
                    <View style={[Style.viewStyle1, {flexDirection: "row"}]}>
                        <View style={Style.viewDetails1}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.goBack();
                                }}
                            >
                                <View
                                    style={{
                                        height: hp("4%"),
                                        width: wp("15%"),
                                        alignItems: 'flex-start',
                                        justifyContent: "center"
                                    }}
                                >
                                    <Image
                                        resizeMode="contain"
                                        source={require("../../../../../icons/back.png")}
                                        style={Style.viewDetails2}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <Image
                                style={[Style.image1]}
                                source={require("../../../../../icons/OyespaceSafe.png")}
                            />
                        </View>
                        <View style={{flex: 0.2}}>
                            {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
                        </View>
                    </View>
                    <View style={{borderWidth: 1, borderColor: "#ff8c00"}}/>
                </SafeAreaView>


                <Text style={Style.titleOfScreen}>{this.state.isView ? "View Family Member":"Edit Family Member"}</Text>


                <KeyboardAwareScrollView>
                    <View style={Style.subContainer}>
                        <TouchableOpacity style={Style.relativeImgView} onPress={() => this.setImage()}
                                          disabled={this.state.isView}
                        >
                            <Image style={{height: 90, width: 90, borderRadius: 45, alignSelf: 'center'}}
                                   source={{uri: this.state.relativeImage}}/>

                        </TouchableOpacity>
                    </View>
                    <View style={Style.famTextView}>
                        <Text style={Style.famText}>Family Details</Text>
                    </View>
                    <View style={Style.subMainView}>
                        <Dropdown
                            value={this.state.relationName}
                            data={this.state.relationList}
                            textColor={base.theme.colors.black}
                            inputContainerStyle={{}}
                            //  label="Select Relationship"
                            baseColor="rgba(0, 0, 0, 1)"
                            placeholder="Relationship*"
                            placeholderTextColor={base.theme.colors.black}
                            labelHeight={hp("4%")}
                            containerStyle={{
                                width: wp("85%"),
                                height: hp("8%"),
                            }}
                            rippleOpacity={0}
                            dropdownPosition={-6}
                            dropdownOffset={{top: 0, left: 0,}}
                            style={{fontSize: hp("2.2%")}}
                            onChangeText={(value, index) => this.changeFamilyMember(value, index)}
                            disabled={this.state.isView}

                        />
                        <View style={Style.textInputView}>
                            <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left'}}>First Name
                                <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                            <TextInput
                                style={{height: 50, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey,
                                color:base.theme.colors.black}}
                                onChangeText={(text) => this.setState({firstName: text})}
                                value={this.state.firstName}
                                placeholder="First Name"
                                placeholderTextColor={base.theme.colors.grey}
                                editable={!this.state.isView}
                            />
                        </View>
                        <View style={Style.textInputView}>
                            <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left'}}>Last Name
                                <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                            <TextInput
                                style={{height: 50, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey,
                                    color:base.theme.colors.black}}
                                onChangeText={(text) => this.setState({lastName: text})}
                                value={this.state.lastName}
                                placeholder="Last Name"
                                placeholderTextColor={base.theme.colors.grey}
                                keyboardType={'default'}
                                editable={!this.state.isView}
                            />
                        </View>
                        {this.state.relationName === 'Child' && !this.state.isView?
                            <View style={{
                                flexDirection: 'row',
                                height: '6%',
                                width: '90%',
                                justifyContent: 'flex-start',
                                marginTop: 25,
                            }}>
                                <Text style={{fontSize: 14, color: base.theme.colors.black}}>Minor</Text>
                                <RadioForm formHorizontal={true} animation={true}>
                                    {this.state.minorProps.map((obj, i) => {
                                        let onPress = (value, index) => {
                                            this.setState({
                                                isMinorSelected: value,
                                                guardianName: '',
                                                mobileNumber: '',
                                                cCode: '',
                                            })
                                        };
                                        return (
                                            <RadioButton labelHorizontal={true} key={i.toString()}>
                                                <RadioButtonInput
                                                    obj={obj}
                                                    index={i.toString()}
                                                    isSelected={this.state.isMinorSelected === i}
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
                            : <View/>}
                        {this.state.isMinor && this.state.isMinorSelected === 0 ?
                            <View style={Style.textInputView}>
                                <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left'}}>Guardian's
                                    Name
                                    <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                <TextInput
                                    style={{height: 50, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey,color:base.theme.colors.black}}
                                    onChangeText={(text) => this.setState({guardianName: text})}
                                    value={this.state.guardianName}
                                    placeholder="Guardian's Name"
                                    placeholderTextColor={base.theme.colors.grey}
                                    keyboardType={'default'}
                                    editable={!this.state.isView}
                                />
                            </View>
                            : <View/>}
                        <View style={[Style.textInputView, {
                            borderBottomWidth: 1,
                            borderColor: base.theme.colors.lightgrey, marginBottom: 10
                        }]}>
                            <Text style={{
                                fontSize: 14,
                                color: base.theme.colors.black,
                                textAlign: 'left'
                            }}>{mobPlaceHolder}
                                <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                            <View style={Style.mobNumView}>
                                <TextInput
                                    style={{height: 50, width: '80%',color:base.theme.colors.black}}
                                    onChangeText={(text) => this.mobileNumberInputCheck(text)}
                                    value={this.state.mobileNumber}
                                    placeholder={mobPlaceHolder}
                                    maxLength={13}
                                    placeholderTextColor={base.theme.colors.grey}
                                    keyboardType={'phone-pad'}
                                    editable={!this.state.isView}
                                />
                                <TouchableOpacity style={{width: 35, height: 35,}} onPress={() => this.getTheContact()}>
                                    <Image source={require("../../../../../icons/phone-book.png")}
                                           style={{width: 25, height: 25,}}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {this.state.isView ?
                            <View/> :
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                marginTop: hp("4%"),
                                marginBottom: hp("2%"),
                                marginHorizontal: hp("2%")
                            }}>
                                <TouchableOpacity
                                    bordered
                                    dark
                                    style={{
                                        width: wp("22%"),
                                        height: hp("4%"),
                                        borderRadius: hp("2.5%"),
                                        borderWidth: hp("0.2%"),
                                        borderColor: "#EF3939",
                                        backgroundColor: "#EF3939",
                                        alignItems: 'center',
                                        justifyContent: "center"
                                    }}
                                    onPress={() => {
                                        this.resetAllFields()
                                    }}
                                >
                                    <Text style={{
                                        color: "white",
                                        fontWeight: "600",
                                        fontSize: hp("2%")
                                    }}>Reset</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    bordered
                                    dark
                                    style={{
                                        width: wp("22%"),
                                        height: hp("4%"),
                                        borderRadius: hp("2.5%"),
                                        borderWidth: hp("0.2%"),
                                        borderColor: "orange",
                                        backgroundColor: "orange",
                                        alignItems: 'center',
                                        justifyContent: "center", marginLeft: 20
                                    }}
                                    onPress={() => this.validation()}
                                >
                                    <Text style={{
                                        color: "white",
                                        fontWeight: "600",
                                        fontSize: hp("2%")
                                    }}>Update</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                </KeyboardAwareScrollView>

            </View>
        )
    }

    setImage() {
        console.log('Set Image');
        const options = {
            quality: 0.5,
            maxWidth: 250,
            maxHeight: 250,
            cameraRoll: false,
            storageOptions: {
                skipBackup: true,
                path: 'tmp_files'
            },
        };
        let self = this;
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('ImagePicker1111 : ', response);

            } else if (response.error) {
                console.log('ImagePicker22222 : ', response);

            } else if (response.customButton) {
                console.log('ImagePicker3333 : ', response);

            } else {
                console.log('ImagePicker : ', response);
                console.log('response', response);
                this.setState({
                    photo: response.uri,
                    photoDetails: response,
                    isPhotoAvailable: true,
                    imagePath: response.path
                }, () => self.uploadImage(response));
            }
        });

    }

    async uploadImage(response) {
        let self = this;
        let source = (Platform.OS === 'ios') ? response.uri : response.uri;
        const form = new FormData();
        let imgObj = {
            name: (response.fileName !== undefined) ? response.fileName : "XXXXX.jpg",
            uri: source,
            type: (response.type !== undefined || response.type != null) ? response.type : "image/jpeg"
        };
        form.append('image', imgObj);
        let stat = await base.services.MediaUploadApi.uploadRelativeImage(form);
        console.log('Photo upload response', stat);
        if (stat) {
            try {
                self.setState({
                    relativeImage: response.uri,
                    imageUrl: stat
                })

            } catch (err) {
                console.log('err', err)
            }
        }

    }

    deleteImage() {
        let file = this.state.photo.split('///').pop();
        const filePath = file.substring(0, file.lastIndexOf('/'));
        console.warn("File Path: " + filePath);
        console.warn("File to DELETE: " + file);
        RNFS.readDir(filePath).then(files => {
            for (let t of files) {
                RNFS.unlink(t.path);
            }

        })
            .catch(err => {
                console.error(err)
            });
    }


    changeFamilyMember(value, index) {
        console.log('New Details', value, index);
        this.setState({
            relationName: value
        });
        if (value === 'Child') {
            this.setState({
                isMinor: true,
                // firsName:'',
                //lastName:'',
                mobileNumber: '',
                guardianName: ''
            })
        } else {
            this.setState({
                isMinor: false
            })
        }
    }

    async getTheContact() {
        console.log('Get details', Platform.OS);
        let isGranted = false;
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                isGranted = true
            }

        } else {
            isGranted = true
        }

        if (isGranted) {
            ContactsWrapper.getContact()
                .then((contact) => {
                    console.log('Details for mob', contact);
                    let name = contact.name.split(" ");
                    let mobCode = contact.phone.split('');
                    let mobNum = contact.phone.replaceAll(/[ !@#$%^&*()_\-=\[\]{};':"\\|,.<>\/?]/, '');
                    let sendMob = contact.phone.split(" ");

                    if (mobCode[0] === '+') {
                        console.log('plus');
                        let mobCode2 = contact.phone.split(" ");
                        console.log('mobCode', sendMob, mobCode, mobCode2, mobCode2[0]);
                        let arr = '';
                        for (let i = 1; i < sendMob.length; i++) {
                            arr = arr + sendMob[i]
                        }
                        console.log('mobbbbbb', arr);
                        this.setState({
                            cCode: mobCode2[0],
                            sendNum: arr
                        })

                    } else {
                        this.setState({
                            sendNum: mobNum
                        })
                    }
                    if (this.state.isMinor && this.state.isMinorSelected === 0) {
                        this.setState({
                            guardianName: name[0],
                            mobileNumber: mobNum
                        })
                    } else {
                        this.setState({
                            firstName: name[0],
                            lastName: name[1] !== "" ? name[1] : '',
                            mobileNumber: mobNum,
                        })
                    }
                })
                .catch((error) => {
                    console.log("ERROR CODE: ", error.code);
                    console.log("ERROR MESSAGE: ", error.message);
                });
        }
    }

    resetAllFields() {

        //Should we need to show alert ?

        this.setState({
            relationName: "",
            cCode: '',
            mobileNumber: "",
            sendNum: "",
            isMinor: false,
            firstName: "",
            lastName: "",
            isMinorSelected: 0,
            guardianName: "",
            relativeImage: "",
            imageUrl: "",
        })
    }

    validation() {
        console.log('Props**!!!', this.props);  //Validation for mobileNumber length

        let self = this;
        if (self.state.relationName === "") {
            alert('Please Select relation')
        } else if (self.state.firstName === "") {
            alert('First Name is required')
        } else if (self.state.isMinor && self.state.isMinorSelected === 0 && self.state.guardianName === '') {
            alert('Guardian name is Mandatory')
        } else if (self.state.mobileNumber === "") {
            alert('Please enter mobile number')
        }else if (self.state.mobileNumber.length<10) {
            alert('Please enter valid mobile number')
        } else if (self.props.dashBoardReducer.uniID === null) {
            alert('Unit id is null')
        } else if (self.props.dashBoardReducer.assId === null) {
            alert('Association id is null')
        } else {
            self.editRelativeDetails()

        }
    }

    async editRelativeDetails() {
        console.log('Props**', this.props, this.state);
        let self = this;

        let mobCode = this.state.mobileNumber.split('');
        console.log('MobCode Array', mobCode);
        let cCodeSend = this.state.cCode;
        if (mobCode[0] === '+') {
            cCodeSend = ''
        } else {
            cCodeSend = '+91'
        }

        let input = {
            "FMName": self.state.firstName,
            "FMMobile": self.state.mobileNumber,
            "FMISDCode": cCodeSend,
            "UNUnitID": self.props.dashBoardReducer.uniID,
            "FMRltn": self.state.relationName,
            "ASAssnID": self.props.dashBoardReducer.assId,
            "FMImgName": self.state.imageUrl,
            "FMMinor": self.state.isMinor,
            "FMLName": self.state.lastName,
            "FMGurName": self.state.guardianName,
            "MEMemID": self.props.navigation.state.params.meMemID,
            "FMID": self.props.navigation.state.params.fmid
        };
        let stat = await base.services.OyeSafeApiFamily.myFamilyEditMember(input);
        console.log('Stat in Edit family', stat, input);
        if (stat.success) {
            try {
                if (self.state.isPhotoAvailable) {
                    if (Platform.OS === 'android') {
                        self.deleteImage();
                    }
                }
                this.props.navigation.goBack()
            } catch (err) {
                console.log('Error in adding Family Member')
            }
        } else {
            this.showAlert(stat.error.message, true)
            // Alert.alert('Attention', stat.error.message, [
            //     {
            //         text: 'Ok',
            //         onPress: () => console.log('Cancel Pressed'),
            //         style: 'cancel',
            //     },], {cancelable: false});

        }
    }

    showAlert(msg, ispop) {
        let self = this;
        setTimeout(() => {
            this.showMessage(this, "", msg, "OK", function () {

            });
        }, 500)
    }

    showMessage(self, title, message, btn, callback) {
        Alert.alert(title, message, [
            {
                text: btn, onPress: () => {
                    self.setState({isLoading: false});
                    callback()
                }
            }
        ])
    }

}


const mapStateToProps = state => {
    return {
        associationid: state.DashboardReducer.assId,
        selectedAssociation: state.DashboardReducer.assId,
        oyeURL: state.OyespaceReducer.oyeURL,
        dashBoardReducer: state.DashboardReducer,
        userReducer: state.UserReducer,
        assId:state.DashboardReducer.assId ,
    uniID: state.DashboardReducer.uniID,

    };
};

export default connect(mapStateToProps)(MyFamilyEdit);