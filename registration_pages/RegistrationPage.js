import React, {Component} from "react";
import {
    Alert,
    Dimensions,
    Image,
    PixelRatio,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
// import RNExitApp from "react-native-exit-app";
import {updateUserInfo} from "../src/actions";
import {connect} from "react-redux";
import base from "../src/base";
import ImagePicker from "react-native-image-picker";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen"
import {Button, Form, Input, Item, Label} from "native-base";
import CountryPicker from "react-native-country-picker-modal";
import Style from "../src/screens/Resident/MyFamilyScreen/MyFamilyAdd/Style";
import OSButton from "../src/components/osButton/OSButton";

console.disableYellowBox = true;

class AddRegularVisitor extends Component {
    state = {
        FirstName: "",
        LastName: "",
        MobileNumber: "",
        Mail: ""
    };

    constructor() {
        super();
        this.state = {
            data: null,
            valid: "",
            type: "",
            value: "",
            isLoading: false,
            profileUrl:"",
            urlToServer:"",
            firstName:"",
            lastName:"",
            emailAdd:""
        };

        this.renderInfo = this.renderInfo.bind(this);
    }

    validations(title, message){
        let self=this;
        if (base.utils.validate.isBlank(self.state.firstName)) {
            Alert.alert('First name is mandatory', message)
        } else if (self.state.firstName.length<3) {
            Alert.alert('Minimum number of characters should be 3', message)
        } else if (base.utils.validate.isBlank(self.state.lastName)) {
            Alert.alert('Last name is mandatory', message)
        } else if (self.state.lastName.length<3) {
            Alert.alert('Minimum number of characters should be 3', message)
        }else if (base.utils.validate.isBlank(self.state.emailAdd)) {
            Alert.alert('Email is mandatory', message)
        }else if (!base.utils.validate.validateEmailId(self.state.emailAdd)) {
            Alert.alert('Please enter valid email id', message)
        }else if (base.utils.validate.isBlank(self.state.profileUrl)) {
            Alert.alert('Profile Picture is mandatory', message)
        }else{
            //this.uploadImage(self.state.urlToServer)
            this.sendRegData()

        }

    }

    sendRegData(){
        let self =this;
        let member = {
            ACFName: self.state.firstName,
            ACLName: self.state.lastName,
            ACMobile: this.props.MyMobileNumber,
            ACMobile1: "",
            ACMobile2: "",
            ACMobile3: "",
            ACMobile4: "",
            ACEmail:self.state.emailAdd ,
            ACEmail1: "",
            ACEmail2: "",
            ACEmail3: "",
            ACEmail4: "",
            ACISDCode: this.props.MyISDCode,
            ACISDCode1: "",
            ACISDCode2: "",
            ACISDCode3: "",
            ACISDCode4: "",
            ACImgName:this.state.profileUrl
        };
        console.log('DATA TO REGISTER USER',member, this.props.champBaseURL)
        const url = this.props.champBaseURL + "account/signup";

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
                "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
            },
            body: JSON.stringify(member)
        })
            .then(response => response.json())
            .then(responseJson => {
                console.log("response", responseJson);

                if (responseJson.success) {
                    const {updateUserInfo} = this.props;
                    const {
                        acAccntID,
                        acfName,
                        aclName,
                        acMobile,
                        acEmail,
                        acisdCode
                    } = responseJson.data.account;
                    updateUserInfo({prop: "MyAccountID", value: acAccntID});
                    updateUserInfo({prop: "MyEmail", value: acEmail});
                    updateUserInfo({prop: "MyMobileNumber", value: acMobile});
                    updateUserInfo({prop: "MyFirstName", value: acfName});
                    updateUserInfo({prop: "MyLastName", value: aclName});
                    updateUserInfo({prop: "MyISDCode", value: acisdCode});
                    updateUserInfo({prop: "signedIn", value: true});

                    console.log('Association check', responseJson.success);

                    this.props.navigation.navigate('CreateOrJoinScreen')
                } else {
                    alert("failed to add user !");
                }
            })
            .catch(error => {
                console.error(error);
                alert("caught error in adding user");
            });
    }

    async uploadImage(response) {
        console.log("Image upload before", response);
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
        console.log('Photo upload response', stat, response);
        if (stat) {
            try {
                self.setState({
                   urlToServer:stat
                })

                this.sendRegData(stat)
            } catch (err) {
                console.log('err', err)
            }
        }

    }
    selectPhotoTapped() {
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
        //showImagePicker
        ImagePicker.showImagePicker(options, response => {
            //console.log("Response = ", response)
            if (response.didCancel) {
                console.log("User cancelled photo picker")
            } else if (response.error) {
                console.log("ImagePicker Error: ", response.error)
            } else if (response.customButton) {
                console.log("User tapped custom button: ", response.customButton)
            } else {
                console.log('Response',response)
                this.setState({
                    urlToServer:response,
                    profileUrl:response.data
                })
            }
        })
    }

    renderInfo() {
        if (this.state.value) {
            return (
                <View style={styles.info}>
                    <Text>
                        {" "}
                        Is Valid:{" "}
                        <Text style={{fontWeight: "bold"}}>
                            {this.state.valid.toString()}
                        </Text>
                    </Text>
                    <Text>
                        {" "}
                        Type: <Text style={{fontWeight: "bold"}}>{this.state.type}</Text>
                    </Text>
                    <Text>
                        {" "}
                        Value:{" "}
                        <Text style={{fontWeight: "bold"}}>{this.state.value}</Text>
                    </Text>
                </View>
            );
        }
    }



    render() {
        return (
            <View style={{height:'100%',width:'100%'}}>
                <ScrollView>
                    <View style={{height:200}}>
                        <Image
                            source={require("../pages/assets/images/building_complex.png")}
                            style={{width: "100%",height:'100%'}}
                        />
                    </View>
                    <View style={{flexDirection:'column',height:'7%',alignItems:'center',}}>
                     <Text style={{fontSize:20,color:base.theme.colors.primary}}> Registration</Text>
                  </View>
                    <KeyboardAwareScrollView>
                        <View style={{ height: '22%',
                            width: '100%',
                            alignItems: 'center', }}>
                            <TouchableOpacity style={Style.relativeImgView} onPress={() => this.selectPhotoTapped()}>
                                {this.state.profileUrl === '' || this.state.profileUrl==undefined || this.state.profileUrl==null
                                    || this.state.profileUrl=="null" ?
                                    <Image style={{height: 90, width: 90, borderRadius: 45, alignSelf: 'center'}}
                                           source={{uri: "https://mediaupload.oyespace.com/" + base.utils.strings.noImageCapturedPlaceholder}}
                                    />
                                    :
                                    <Image style={{height: 85, width: 85, borderRadius: 85 / 2, alignSelf: 'center'}}
                                           source={{uri: this.state.profileUrl}}/>
                                }
                            </TouchableOpacity>

                        </View>
                        <View style={{height: '10%',
                            width: '90%',
                            marginTop: 20,alignSelf:'center',}}>
                            <Text style={{fontSize: 14, color: base.theme.colors.gray, textAlign: 'left'}}>First Name
                                <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                            <TextInput
                                style={{height: 40, borderBottomWidth: 1, borderColor: base.theme.colors.gray}}
                                onChangeText={(text) => this.setState({firstName: text})}
                                value={this.state.firstName}
                                placeholder="First Name"
                                keyboardType="ascii-capable"
                                placeholderTextColor={base.theme.colors.black}
                            />
                        </View>
                        <View style={{height: '10%',
                            width: '90%',
                            marginTop: 20,alignSelf:'center',}}>
                            <Text style={{fontSize: 14, color: base.theme.colors.gray, textAlign: 'left'}}>Last Name
                                <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                            <TextInput
                                style={{height: 40, borderBottomWidth: 1, borderColor: base.theme.colors.gray}}
                                onChangeText={(text) => this.setState({lastName: text})}
                                value={this.state.lastName}
                                placeholder="Last Name"
                                keyboardType="ascii-capable"
                                placeholderTextColor={base.theme.colors.black}
                            />
                        </View>
                        <View style={{height: '10%',
                            width: '90%',
                            marginTop: 20,alignSelf:'center',}}>
                            <Text style={{fontSize: 14, color: base.theme.colors.gray, textAlign: 'left'}}>Mobile Number</Text>
                                <Text style={{height: 40, borderBottomWidth: 1, borderColor: base.theme.colors.gray,textAlignVertical:'center'}}>{this.props.MyISDCode}{''}-{' '}{this.props.MyMobileNumber}
                                </Text>
                            {/*<TextInput
                                style={{height: 40, borderBottomWidth: 1, borderColor: base.theme.colors.gray}}
                               // onChangeText={(text) => this.setState({lastName: text})}
                                value={this.props.MyMobileNumber}
                                placeholder="Mobile Number"
                                keyboardType="ascii-capable"
                                placeholderTextColor={base.theme.colors.black}
                                editable={false}
                            />*/}
                        </View>
                        <View style={{height: '10%',
                            width: '90%',
                            marginTop: 20,alignSelf:'center',}}>
                            <Text style={{fontSize: 14, color: base.theme.colors.gray, textAlign: 'left'}}>Email ID
                                <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                            <TextInput
                                style={{height: 40, borderBottomWidth: 1, borderColor: base.theme.colors.gray}}
                                onChangeText={(text) => this.setState({emailAdd: text})}
                                value={this.state.emailAdd}
                                placeholder="Email address"
                                keyboardType="email-address"
                                placeholderTextColor={base.theme.colors.black}
                            />
                        </View>
                        <View style={{height:10}}/>
                    </KeyboardAwareScrollView>
                    <View style={{alignSelf:'center',height:'5%',width:'30%'}}>
                    <OSButton
                        oSBText={'Register'}
                        oSBBackground={base.theme.colors.primary}
                        height={'100%'}
                    width={'100%'}
                    borderRadius={20}
                    onButtonClick={()=>this.validations()}/>
                    </View>
                    <View style={{height:50}}/>
                </ScrollView>
            </View>
        );
    }

    componentDidMount() {
        console.log("testing", this.props.oyeNonSpecialNameRegex.test("email"));
    }
}

const mapStateToProps = state => {
    return {
        MyMobileNumber: state.UserReducer.MyMobileNumber,
        MyISDCode: state.UserReducer.MyISDCode,
        champBaseURL: state.OyespaceReducer.champBaseURL,
        oyeNonSpecialNameRegex: state.OyespaceReducer.oyeNonSpecialNameRegex,
        oyeEmailRegex: state.OyespaceReducer.oyeEmailRegex
    };
};

export default connect(
    mapStateToProps,
    {updateUserInfo}
)(AddRegularVisitor);

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        backgroundColor: "#fff",
        height: "100%",
        width: "100%"
    },
    input1: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        height: 40,
        borderColor: "#F2F2F2",
        backgroundColor: "#F2F2F2",
        borderWidth: 1.5,
        borderRadius: 2,
        flexDirection: "row"
    },
    rectangle: {
        backgroundColor: "white",
        padding: 5,
        borderColor: "orange",
        height: 40,
        marginTop: 20,
        marginRight: 40,
        marginLeft: 40,
        borderRadius: 2,
        borderWidth: 1,
        alignContent: "center"
    },

    input: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 40,
        height: 40,
        borderColor: "#F2F2F2",
        backgroundColor: "#F2F2F2",
        borderWidth: 1.5,
        borderRadius: 2,
        flexDirection: "row"
    },

    input_two: {
        marginLeft: 15,
        marginTop: 15,
        height: 40,
        borderColor: "#F2F2F2",
        backgroundColor: "#F2F2F2",
        borderWidth: 1.5,
        borderRadius: 2
    },

    imagee: {height: 14, width: 14, margin: 10},

    text: {fontSize: 12, color: "black", justifyContent: "center"},
    text1: {
        fontSize: 12,
        color: "black",
        justifyContent: "center",
        width: "65%"
    },

    submitButton: {
        backgroundColor: "#7a42f4",
        padding: 10,
        margin: 15,
        height: 40
    },

    submitButtonText: {color: "#FA9917"},
    textWrapper: {
        height: hp("85%"),
        width: wp("95%")
    },
    viewStyle: {
        backgroundColor: "#fff",
        height: hp("8%"),
        width: '100%',
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        elevation: 2,
        position: "relative"
    },
    image: {
        width: wp("34%"),
        height: hp("18%")
    },
    emptyViewStyle: {
        flex: 1
    },
    mainViewStyle: {
        flex: 1
    },
    mainContainer: {
        flex: 1,
        marginTop: 0,
        paddingHorizontal: hp("1.4%"),
        // paddingBottom: 10,
        backgroundColor: "#fff",
        flexDirection: "column"
    },

    myProfileFlexStyle: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: hp("2%"),
        marginBottom: 0
    },

    viewForMyProfileText: {
        flex: 4,
        justifyContent: "center",
        alignSelf: "center"
    },
    myProfileTitleStyle: {
        textAlign: "center",
        fontSize: hp("2.5%"),
        fontWeight: "500",
        color: "#ff8c00"
    },

    containerView_ForProfilePicViewStyle: {
        justifyContent: "center",
        alignItems: "center",
        //backgroundColor: "yellow",
        alignSelf: "center",
        flexDirection: "row",
        borderColor: "orange"
    },

    viewForProfilePicImageStyle: {
        width: wp("15%"),
        height: hp("15%"),
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: hp("4%"),
        marginBottom: hp("2%"),
        marginLeft: hp("4%")
    },
    profilePicImageStyle: {
        //backgroundColor: "yellow",
        width: 110,
        height: 110,
        //width:wp('20%'),
        //height:hp('20%'),
        borderColor: "orange",
        borderRadius: 55,
        borderWidth: hp("0.2%") / PixelRatio.get()
    },

    imagesmallCircle: {
        alignItems: "flex-end",
        justifyContent: "flex-start",
        width: 10,
        height: 10,
        marginTop: hp("6%"),
        marginLeft: hp("3%"),
        borderRadius: 5,
    },

    smallImage: {
        width: wp("8%"),
        height: hp("4%"),
        justifyContent: "flex-start",
        alignItems: "flex-end"
        //alignItems: center
    },

    camStyle:{
        //backgroundColor:'yellow',
        width: wp("11%"),
        height: hp("6%"),
        justifyContent: "flex-start",
        alignItems: "flex-end"
        //alignItems: center
    },

    viewForPaddingAboveAndBelowButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: hp("4%"),
        marginBottom: hp("2%"),
        marginHorizontal: hp("2%")
    },
    buttonFamily: {
        width: wp("25%"),
        height: Platform.OS === 'ios'? hp("4.5%") : hp("4%"),
        borderRadius: hp("2.5%"),
        borderWidth: hp("0.2%"),
        borderColor: "#EF3939",
        backgroundColor: "#EF3939",
        justifyContent: "center",
        //alignItems:'center'
    },
    textFamilyVehicle: {
        color: "white",
        fontWeight: "600",
        fontSize: hp("2%")
    },
    buttonVehicle: {
        width: wp("25%"),
        height:Platform.OS === 'ios'?hp("4.5%"): hp("4%"),
        borderRadius: hp("2.5%"),
        borderWidth: hp("0.2%"),
        borderColor: "orange",
        backgroundColor: "orange",
        justifyContent: "center"
    },
    itemTextValues1: {
        fontSize: hp("2.2%"),
        fontWeight: "500",
        paddingTop: hp("0.8%"),
        paddingHorizontal: 0,

        alignItems: "flex-start",
        justifyContent: "flex-start",
        color: "#474749"
    },
    inputItem: {
        marginTop: wp("2%"),
        marginLeft: wp("4%"),
        marginRight: wp("4%"),
        borderColor: "#909091"
    },
    inputItem1: {
        flex: 0.65,
        marginTop: wp("2%"),
        marginLeft: wp("3%"),
        marginRight: wp("4%"),
        borderColor: "#909091"
    },
    number: {
        flexDirection: "row",
        width: Dimensions.get("screen").width,
        justifyContent: "center",
        alignItems: "center"
    },
    viewDetails2: {
        alignItems: "flex-start",
        justifyContent: "center",
        width: hp("2.5%"),
        height: hp("2.5%"),
        marginTop: 5
        // marginLeft: 10
    }
});
