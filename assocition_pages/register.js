import React, { Component } from 'react';
import { Alert, Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View,ActivityIndicator } from 'react-native';
import { Card } from 'native-base';
import moment from 'moment';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import axios from 'axios';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { createUserNotification, getAssoMembers, updateJoinedAssociation } from '../src/actions';
import _ from 'lodash';
import { CLOUD_FUNCTION_URL } from '../constant';
import firebase from 'react-native-firebase';
import * as fb from 'firebase';
import base from '../src/base';

class RegisterMe extends Component {
    static navigationOptions = {
        title: 'Register Me',
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            //date picker
            dobText: 'Select Date of Occupancy', //year + '-' + month + '-' + date,
            dobDate: '',
            unitofperson: false,
            unitofperson1: false,
            sent: false,
            isLoading:false
        };
    }

    componentDidMount() {
        const { getAssoMembers, oyeURL, MyAccountID } = this.props;
        getAssoMembers(oyeURL, MyAccountID);
    }

    onDOBPress = () => {
        let dobDate = this.state.dobDate;
        if (!dobDate || dobDate == null) {
            dobDate = new Date();
            this.setState({
                dobDate: dobDate
            });
        }
        this.refs.dobDialog.open({
            date: dobDate
            // minDate: new Date() //To restirct past dates
        });
    };

    onDOBDatePicked = date => {
        this.setState({
            dobDate: date,
            dobText: moment(date).format('YYYY-MM-DD')
        });
    };


    submitForOwnwer = () => {
        const {
            AssnId,
            associationName,
            unitList
        } = this.props.navigation.state.params;

        const { getAssoMembers, oyeURL, MyAccountID } = this.props;
        const { fetchAssociationByAccountId } =this.props;

    
       this.setState({
        isLoading:true
    })
        let checkOwner = this.checkForOwner();
          
        if (this.state.dobText == 'Select Date of Occupancy') {
            this.setState({
                isLoading:false
            })
            alert('Select Date of Occupancy');

        } else if (checkOwner.stat) {
            this.setState({
                isLoading:false
            })
            alert("You are an active member and can't join");

        } else if (this.checkStatus()) {
            this.setState({
                isLoading:false
            })
            alert('You already requested to join this unit');

        } else if (this.state.sent) {
            this.setState({
                isLoading:false
            })
            alert('Request already sent');

        } else {
           let anu = {
                ASAssnID: unitList.asAssnID,
                BLBlockID: unitList.blBlockID,
                UNUnitID: unitList.unUnitID,
                MRMRoleID: parseInt('6'),
                FirstName: this.props.MyFirstName,
                MobileNumber: this.props.userReducer.MyMobileNumber,
                ISDCode: this.props.userReducer.MyISDCode,
                LastName: this.props.MyLastName,
                Email: this.props.MyEmail,
                SoldDate: this.state.dobText,
                OccupancyDate: this.state.dobText
            };
            console.log('ANU', anu);
            console.log(this.props);
            let champBaseURL = this.props.champBaseURL;
            this.setState({ sent: true, loading: true });

            axios
                .post(
                    `${champBaseURL}/association/join`,
                    {
                        ASAssnID: unitList.asAssnID,
                        BLBlockID: unitList.blBlockID,
                        UNUnitID: unitList.unUnitID,
                        MRMRoleID: parseInt('6'),
                        FirstName: this.props.MyFirstName,
                        MobileNumber: this.props.userReducer.MyMobileNumber,
                        ISDCode: this.props.userReducer.MyISDCode,
                        LastName: this.props.MyLastName,
                        Email: this.props.MyEmail,
                        SoldDate: this.state.dobText,
                        OccupancyDate: this.state.dobText
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1'
                        }
                    }
                )
                .then(response => {
                    let responseData_1 = response.data;
                    let mobileNo = this.props.userReducer.MyISDCode + this.props.userReducer.MyMobileNumber;
                    console.log('GET THE DETAILS@@@@@@@@@',responseData_1,mobileNo,unitList.asAssnID,unitList.unUnitID)
                    if (responseData_1.success) {

                        let headers_2 = {
                            'Content-Type': 'application/json',
                            'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1'
                        };

                        
                        axios
                            .post(
                                'http://' +
                                this.props.oyeURL +
                                '/oyeliving/api/v1/Member/GetRequestorDetails',
                                {
                                    ACMobile: mobileNo,
                                    ASAssnID: unitList.asAssnID,
                                    UNUnitID: unitList.unUnitID,
                                    MRMRoleID: parseInt('6')
                                },
                                {
                                    headers: headers_2
                                }
                            )
                            .then(response_2 => {
                                let responseData_2 = response_2.data.data.member;
                                console.log('*******');
                                console.log('here_2 ', responseData_2);

                                if (!_.isEmpty(responseData_2)) {
                                    let userID = this.props.MyAccountID;
                                    let sbUnitID = unitList.unUnitID;
                                    let unitName = unitList.unUniName;
                                    let adminAccId = unitList.acAccntID;
                                    let sbSubID =
                                        this.props.MyAccountID.toString() +
                                        unitList.unUnitID.toString() +
                                        'usernotif';
                                    let sbRoleId = '2';
                                    let sbMemID = responseData_2.meMemID;
                                    let sbName =
                                        this.props.MyFirstName + ' ' + this.props.MyLastName;
                                    let associationID = AssnId;
                                    // let associationName = associationName;
                                    let ntType = 'Join';
                                    let ntTitle =
                                        'Request to join' +
                                        ' ' +
                                        associationName +
                                        ' ' +
                                        'Association';
                                    let roleName = 'Owner';
                                    let ntDesc =
                                        sbName +
                                        ' ' +
                                        'requested to join ' +
                                        unitName +
                                        ' ' +
                                        'unit in ' +
                                        associationName +
                                        ' ' +
                                        'association as ' +
                                        roleName;
                                    let soldDate = this.state.dobText;
                                    let occupancyDate = this.state.dobText;

                                    firebase.messaging().subscribeToTopic(sbSubID);

                                    // Send a push notification to the admin here

                                    axios
                                        .post(`${CLOUD_FUNCTION_URL}/sendAdminNotification`, {
                                            userID: userID.toString(),
                                            sbUnitID: sbUnitID.toString(),
                                            unitName: unitName.toString(),
                                            sbSubID: sbSubID.toString(),
                                            sbRoleId: sbRoleId,
                                            sbMemID: sbMemID.toString(),
                                            sbName: sbName,
                                            //  associationID: AssnId.toString(),
                                            associationID: checkOwner.admin
                                                ? 'admin_not_send'
                                                : AssnId.toString(),
                                            associationName: associationName,
                                            ntType: ntType,
                                            ntTitle: ntTitle,
                                            ntDesc: ntDesc,
                                            roleName: roleName,
                                            soldDate: soldDate,
                                            occupancyDate: occupancyDate
                                        })
                                        .then(response_3 => {
                                            this.setState({ loading: false });

                                            axios
                                                .get(
                                                    'http://' +
                                                    this.props.oyeURL +
                                                    `/oyeliving/api/v1/Member/GetMemberListByAssocID/${AssnId}`,
                                                    {
                                                        headers: {
                                                            'X-Champ-APIKey':
                                                                '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
                                                            'Content-Type': 'application/json'
                                                        }
                                                    }
                                                )
                                                .then(res => {
                                                    let memberList =
                                                        res.data.data.memberListByAssociation;

                                                    memberList.map(data => {
                                                        if (
                                                            data.mrmRoleID === 1 &&
                                                            data.meIsActive &&
                                                            data.acAccntID !== this.props.MyAccountID
                                                        ) {
                                                            console.log('adminssss', data);
                                                            this.props.createUserNotification(
                                                                ntType,
                                                                this.props.oyeURL,
                                                                data.acAccntID,
                                                                this.props.navigation.state.params.AssnId.toString(),
                                                                ntDesc,
                                                                sbUnitID.toString(),
                                                                sbMemID.toString(),
                                                                sbSubID.toString(),
                                                                sbRoleId,
                                                                this.props.navigation.state.params
                                                                    .associationName,
                                                                unitName.toString(),
                                                                occupancyDate,
                                                                soldDate,
                                                                false,
                                                                this.props.MyAccountID,
                                                                this.props.userReducer.MyISDCode+this.props.userReducer.MyMobileNumber,
                                                                this.props.userReducer.userProfilePic
                                                            );
                                                        }
                                                    });

                                                    //ass members list 

                                                    setTimeout(()=>{
                                                        let isAssocNotificationUpdating = 0;
                                                        let associationPath = `syncdashboard/isAssociationRefreshing/${unitList.asAssnID}/${unitList.unUnitID}`;
                                                        fb.database().ref(associationPath).set({
                                                            isAssocNotificationUpdating
                                                        }).then((data) => {
                                                            console.log('Data added to FRTDB:', data);
                                                        }).catch(error => {
                                                            console.log("Error:", error);
                                                    })
                                                    },2000)
                                                    this.setState({
                                                        isLoading:false
                                                    })
                                                    Alert.alert(
                                                        'Oyespace',
                                                        'Request sent to Admin',
                                                        [
                                                            {
                                                                text: 'Ok',
                                                                onPress: () =>
                                                                this.listenToFirebase(unitList.unUnitID)
                                                                    //this.props.navigation.navigate('ResDashBoard')
                                                            }
                                                        ],
                                                        {
                                                            cancelable: false
                                                        }
                                                    );
                                                })
                                                .catch(error => {
                                                   // getAssoMembers(oyeURL, MyAccountID);
                                                    this.setState({
                                                        loading: false
                                                    });
                                                    Alert.alert(
                                                        'Alert',
                                                        'Request not sent..!',
                                                        [
                                                            {
                                                                text: 'Ok',
                                                                onPress: () => {
                                                                }
                                                            }
                                                        ],
                                                        {
                                                            cancelable: false
                                                        }
                                                    );
                                                    console.log(error, 'errorAdmin');
                                                });

                                            // this.props.navigation.navigate("SplashScreen");
                                        });
                                } else {
                                    this.setState({
                                        loading: false,
                                        sent: true
                                    });
                                    Alert.alert(
                                        'Alert',
                                        'You have already requested to join previously, your request is under review. You would be notified once review is complete',
                                        [{
                                            text: 'Ok', onPress: () => {
                                            }
                                        }],
                                        { cancelable: false }
                                    );
                                }
                            })
                            .catch(error => {
                                this.setState({
                                    isLoading:false,
                                    loading: false,
                                    sent: false
                                });
                                console.log('********');
                                console.log(error);
                                console.log('********');
                                this.setState({ sent: false });
                            });
                    } else {
                        this.setState({ isLoading:false,loading: false, sent: false });
                        Alert.alert(
                            'Alert',
                            'Request not sent..!',
                            [{
                                text: 'Ok', onPress: () => {
                                }
                            }],
                            { cancelable: false }
                        );
                        this.setState({ sent: false });
                    }
                })
                .catch(error => {
                    console.log('second error', error);
                    this.setState({ isLoading:false,loading: false, sent: false });
                    Alert.alert(
                        'Alert',
                        'Request not sent..!',
                        [{
                            text: 'Ok', onPress: () => {
                            }
                        }],
                        { cancelable: false }
                    );
                });
        }
    };

   
    submitForTenant = () => {
        const {
            AssnId,
            associationName,
            unitList
        } = this.props.navigation.state.params;

        const { getAssoMembers, oyeURL, MyAccountID } = this.props;
        const { fetchAssociationByAccountId}=this.props;
        
        /**
         else if (this.state.sent) {
      alert("Request already sent");
    } else if (this.checkTenant()) {
      alert("You are an active member and can't join");
    } else if (this.checkStatus()) {
      alert("You already requested to join this unit");
    }
         */
        this.setState({
            isLoading:true
        })

        let checkTenant = this.checkTenant();
        console.log(checkTenant, 'checkTenant');
        if (this.state.dobText == 'Select Date of Occupancy') {
            this.setState({
                isLoading:false
            })
            alert('Select Date of Occupancy'); 

        } else if (this.state.sent) {
            this.setState({
                isLoading:false
            })
            alert('Request already sent');

        } else if (checkTenant.stat) {
            this.setState({
                isLoading:false
            })
            alert("You are an active member and can't join");

        } else if (this.checkStatus()) {
            this.setState({
                isLoading:false
            })
            alert('You already requested to join this unit');

        } else {
           let anu = {
                ASAssnID: unitList.asAssnID,
                BLBlockID: unitList.blBlockID,
                UNUnitID: unitList.unUnitID,
                MRMRoleID: parseInt('7'),
                FirstName: this.props.MyFirstName,
                MobileNumber: this.props.MyMobileNumber,
                ISDCode: this.props.MyISDCode,
                LastName: this.props.MyLastName,
                Email: this.props.MyEmail,
                SoldDate: this.state.dobText,
                OccupancyDate: this.state.dobText
            };

            let champBaseURL = this.props.champBaseURL;
            console.log(champBaseURL);
            this.setState({ sent: true });

            axios
                .post(
                    `${champBaseURL}/association/join`,
                    {
                        ASAssnID: unitList.asAssnID,
                        BLBlockID: unitList.blBlockID,
                        UNUnitID: unitList.unUnitID,
                        MRMRoleID: parseInt('7'),
                        FirstName: this.props.MyFirstName,
                        MobileNumber: this.props.MyMobileNumber,
                        ISDCode: this.props.MyISDCode,
                        LastName: this.props.MyLastName,
                        Email: this.props.MyEmail,
                        SoldDate: this.state.dobText,
                        OccupancyDate: this.state.dobText
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1'
                        }
                    }
                )
                .then(response => {
                    console.log('*******');
                    console.log('here_1 ');
                    console.log('*******');
                    let responseData_1 = response.data;
                    if (responseData_1.success) {
                        
                        let headers_2 = {
                            'Content-Type': 'application/json',
                            'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1'
                        };

                        let mobileNo = this.props.userReducer.MyISDCode+this.props.userReducer.MyMobileNumber;
                        console.log("GEMOBNUM",mobileNo);
                        axios
                            .post(
                                'http://' +
                                this.props.oyeURL +
                                '/oyeliving/api/v1/Member/GetRequestorDetails',
                                {
                                    ACMobile: mobileNo,
                                    ASAssnID: this.props.navigation.state.params.AssnId,
                                    UNUnitID: unitList.unUnitID,
                                    MRMRoleID: parseInt('7')
                                },
                                {
                                    headers: headers_2
                                }
                            )
                            .then(response_2 => {
                                let responseData_2 = response_2.data.data.member;
                                console.log('*******');
                                console.log('here_2 ', responseData_2);

                                if (!_.isEmpty(responseData_2)) {
                                    let userID = this.props.MyAccountID;
                                    let adminAccId = unitList.acAccntID;
                                    let sbUnitID = unitList.unUnitID;
                                    let unitName = unitList.unUniName;
                                    let sbSubID =
                                        this.props.MyAccountID.toString() +
                                        unitList.unUnitID.toString() +
                                        'usernotif';
                                    let sbRoleId = '3';
                                    let sbMemID = responseData_2.meMemID;
                                    let sbName =
                                        this.props.MyFirstName + ' ' + this.props.MyLastName;
                                    let associationID = AssnId;
                                    let ntType = 'Join';
                                    let ntTitle =
                                        'Request to join' +
                                        ' ' +
                                        associationName +
                                        ' ' +
                                        'Association';
                                    let roleName = 'Tenant';
                                    let ntDesc =
                                        sbName +
                                        ' ' +
                                        'requested to join ' +
                                        unitName +
                                        ' ' +
                                        'unit in ' +
                                        associationName +
                                        ' ' +
                                        'association as ' +
                                        roleName;
                                    let soldDate = this.state.dobText;
                                    let occupancyDate = this.state.dobText;

                                    firebase.messaging().subscribeToTopic(sbSubID);
                                    // alert(sbSubID)
                                    // Send a push notification to the admin here
                                    axios
                                        .post(`${CLOUD_FUNCTION_URL}/sendAdminNotification`, {
                                            userID: userID.toString(),
                                            sbUnitID: sbUnitID.toString(),
                                            unitName: unitName.toString(),
                                            sbSubID: sbSubID.toString(),
                                            sbRoleId: sbRoleId,
                                            sbMemID: sbMemID.toString(),
                                            sbName: sbName,
                                            associationID: checkTenant.admin
                                                ? 'admin_not_send'
                                                : this.props.navigation.state.params.AssnId.toString(),
                                            associationName: this.props.navigation.state.params
                                                .associationName,
                                            ntType: ntType,
                                            ntTitle: ntTitle,
                                            ntDesc: ntDesc,
                                            roleName: roleName,
                                            soldDate: soldDate,
                                            occupancyDate: occupancyDate
                                        })
                                        .then(response_3 => {
                                            this.setState({ loading: false });

                                            axios
                                                .get(
                                                    'http://' +
                                                    this.props.oyeURL +
                                                    `/oyeliving/api/v1/Member/GetMemberListByAssocID/${AssnId}`,
                                                    {
                                                        headers: {
                                                            'X-Champ-APIKey':
                                                                '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
                                                            'Content-Type': 'application/json'
                                                        }
                                                    }
                                                )
                                                .then(res => {
                                                    let memberList =
                                                        res.data.data.memberListByAssociation;

                                                    memberList.map(data => {
                                                        if (
                                                            data.mrmRoleID === 1 &&
                                                            data.meIsActive &&
                                                            data.acAccntID !== this.props.MyAccountID
                                                        ) {
                                                            console.log('adminssss', data);
                                                            this.props.createUserNotification(
                                                                ntType,
                                                                this.props.oyeURL,
                                                                data.acAccntID,
                                                                this.props.navigation.state.params.AssnId.toString(),
                                                                ntDesc,
                                                                sbUnitID.toString(),
                                                                sbMemID.toString(),
                                                                sbSubID.toString(),
                                                                sbRoleId,
                                                                this.props.navigation.state.params
                                                                    .associationName,
                                                                unitName.toString(),
                                                                occupancyDate,
                                                                soldDate,
                                                                false,
                                                                this.props.MyAccountID,
                                                                this.props.userReducer.MyISDCode+this.props.userReducer.MyMobileNumber,
                                                                this.props.userReducer.userProfilePic
                                                            );
                                                        }
                                                    });

                                                    getAssoMembers(oyeURL, MyAccountID);
                                                    setTimeout(()=>{
                                                        let isAssocNotificationUpdating = 0;
                                                        let associationPath = `syncdashboard/isAssociationRefreshing/${unitList.asAssnID}/${unitList.unUnitID}`;
                                                        fb.database().ref(associationPath).set({
                                                            isAssocNotificationUpdating
                                                        }).then((data) => {
                                                            console.log('Data added to FRTDB:', data);
                                                        }).catch(error => {
                                                            console.log("Error:", error);
                                                    })
                                                    },2000)
                                                   
                                                    this.setState({
                                                        isLoading:false
                                                    })
 
                                                    Alert.alert(
                                                        'Oyespace',
                                                        'Request sent to Admin',
                                                        [
                                                            {
                                                                text: 'Ok',
                                                                onPress: () =>
                                                                    this.listenToFirebase(unitList.unUnitID)
                                                                   //this.props.navigation.navigate('ResDashBoard')
                                                            }
                                                        ],
                                                        {
                                                            cancelable: false
                                                        }
                                                    );
                                                })
                                                .catch(error => {
                                                    getAssoMembers(oyeURL, MyAccountID);
                                                    this.setState({isLoading:false,
                                                        loading: false
                                                    });
                                                    Alert.alert(
                                                        'Alert',
                                                        'Request not sent..!',
                                                        [
                                                            {
                                                                text: 'Ok',
                                                                onPress: () => {
                                                                }
                                                            }
                                                        ],
                                                        {
                                                            cancelable: false
                                                        }
                                                    );
                                                    console.log(error, 'errorAdmin');
                                                });

                                            // this.props.navigation.navigate("SplashScreen");
                                        });
                                } else {
                                    this.setState({isLoading:false,
                                        loading: false,
                                        sent: true
                                    });
                                    Alert.alert(
                                        'Alert',
                                        'You have already requested to join previously, your request is under review. You would be notified once review is complete',
                                        [{
                                            text: 'Ok', onPress: () => {
                                            }
                                        }],
                                        { cancelable: false }
                                    );
                                }
                            })
                            .catch(error => {
                                this.setState({isLoading:false,
                                    loading: false,
                                    sent: false
                                });
                                console.log('********');
                                console.log(error);
                                console.log('********');
                            });
                    } else {
                        this.setState({ isLoading:false,loading: false, sent: false });
                        Alert.alert(
                            'Alert',
                            'Request not sent..!',
                            [{
                                text: 'Ok', onPress: () => {
                                }
                            }],
                            { cancelable: false }
                        );
                    }
                })
                .catch(error => {
                    console.log('second error', error);
                    this.setState({ isLoading:false,loading: false, sent: false });
                    Alert.alert(
                        'Alert',
                        'Request not sent..!',
                        [{
                            text: 'Ok', onPress: () => {
                            }
                        }],
                        { cancelable: false }
                    );
                });
        }
    };


    listenToFirebase(unitId){
     //   console.log("Data on listen:",anu,this.props);
        //const {MyAccountID} = this.props;
       // firebase.messaging().subscribeToTopic('' + MyAccountID + unitId + 'usernotif').then((data)=>{
         //   console.log("Data:",data,'' + MyAccountID + unitId + 'usernotif')
            this.props.navigation.navigate('ResDashBoard')
        //});
        //  
    }

    checkStatus = () => {
        const { unitList, AssnId } = this.props.navigation.state.params;
        const { joinedAssociations, memberList } = this.props;
        let unitID = unitList.unUnitID;

        let joinStat = _.includes(joinedAssociations, unitID);
        let status;
        // console.log(memberList, "memberList");

        let matchUnit = _.find(memberList, function (o) {
            console.log(o, 'values');
            return o.unUnitID === unitID;
        });

        console.log(matchUnit, 'matchUnit');

        if (matchUnit) {
            if (
                // matchUnit.meJoinStat === 'Approved' ||
                matchUnit.meJoinStat === 'Requested'
                // (matchUnit.meJoinStat === 'Accepted' && matchUnit.meIsActive)
            ) {
                status = true;
            } else {
                status = false;
            }
        } else {
            status = false;
        }

        return status;

        // return false;
    };

    checkForOwner = () => {
        const { memberList } = this.props;
        const { unitList } = this.props.navigation.state.params;

        let unitID = unitList.unUnitID;
        let status;

        // console.log(unitID, "unitID");
        console.log(memberList, 'memberList');

        let matchUnit = _.find(memberList, function (o) {
            console.log(o, 'values');
            console.log(o.unUnitID, 'member', unitID, 'unitID');
            return o.unUnitID === unitID;
        });

        console.log('matchUnit', matchUnit, memberList);

        if (matchUnit) {
            if (
                (matchUnit.mrmRoleID === 2 && matchUnit.meIsActive)
                ||
                (matchUnit.mrmRoleID === 14 && matchUnit.meIsActive)
            ) {
                status = { stat: true, admin: false };
                // } else if (matchUnit.mrmRoleID === 3 && matchUnit.meIsActive) {
                //   status = true;
            } else if (matchUnit.mrmRoleID === 1) {
                status = { stat: false, admin: true };
            } else {
                status = { stat: false, admin: false };
            }
        } else {
            status = { stat: false, admin: false };
        }

        return status;
    };

    checkFamily = () => {
        const { memberList } = this.props;
        const { unitList } = this.props.navigation.state.params;

        let unitID = unitList.unUnitID;
        let status;

        // console.log(unitID, "unitID");
        console.log(memberList, 'memberList');

        let matchUnit = _.find(memberList, function (o) {
            console.log(o, 'values');
            console.log(o.unUnitID, 'member', unitID, 'unitID');
            return o.unUnitID === unitID;
        });

        console.log('matchUnit', matchUnit, memberList);

        if (matchUnit) {
            if (matchUnit.mrmRoleID === 14 && matchUnit.meIsActive) {
                status = { stat: true, admin: false };
                // } else if (matchUnit.mrmRoleID === 3 && matchUnit.meIsActive) {
                //   status = true;
            } else if (matchUnit.mrmRoleID === 1) {
                status = { stat: false, admin: true };
            } else {
                status = { stat: false, admin: false };
            }
        } else {
            status = { stat: false, admin: false };
        }

        return status;
    };

    checkTenant = () => {
        const { memberList } = this.props;
        const { unitList } = this.props.navigation.state.params;

        let unitID = unitList.unUnitID;
        let status;

        // console.log(unitID, "unitID");

        let matchUnit = _.find(memberList, function (o) {
            console.log(o, 'values');
            console.log(o.unUnitID, 'member', unitID, 'unitID');
            return o.unUnitID === unitID;
        });

        console.log('matchUnit', matchUnit, memberList);

        if (matchUnit) {
            if (
                (matchUnit.mrmRoleID === 3 && matchUnit.meIsActive) ||
                (matchUnit.mrmRoleID === 14 && matchUnit.meIsActive)
            ) {
                console.log('In_Here');
                status = { stat: true, admin: false };
                // } else if (matchUnit.mrmRoleID === 3 && matchUnit.meIsActive) {
                //   status = true;
            } else if (matchUnit.mrmRoleID === 1) {
                status = { stat: false, admin: true };
            } else {
                status = { stat: false, admin: false };
            }
        } else {
            status = { stat: false, admin: false };
        }

        return status;
    };

    checkCommon = () => {
        let status;

        const { unUniName } = this.props.navigation.state.params.unitList;

        if (unUniName === 'Common' || unUniName === 'common') {
            status = true;
        } else {
            status = false;
        }

        return status;
    };

    renderButton = () => {
        let status;

        const { unUniName } = this.props.navigation.state.params.unitList;

        let lowerCaseName = unUniName.toLowerCase();

        if (lowerCaseName.includes('common')) {
            status = true;
        } else {
            status = false;
        }

        return status;
    };

    render() {
        const { unitList, AssnId } = this.props.navigation.state.params;
        // console.log('unitList', unitList);
        console.log('GET THE VALUE OF LOADER *****',this.state.isLoading)

        return (
               !this.state.isLoading ?
            <View style={styles.container}>
                <SafeAreaView style={{ backgroundColor: '#ff8c00' }}>
                    <View style={[styles.viewStyle1, { flexDirection: 'row' }]}>
                        <View style={styles.viewDetails1}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.goBack();
                                }}
                            >
                                <View
                                    style={{
                                        height: hp('4%'),
                                        width: wp('15%'),
                                        alignItems: 'flex-start',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Image
                                        resizeMode="contain"
                                        source={require('../icons/back.png')}
                                        style={styles.viewDetails2}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Image
                                style={[styles.image1]}
                                source={require('../icons/OyespaceSafe.png')}
                            />
                        </View>
                        <View style={{ flex: 0.2 }}>
                            {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
                        </View>
                    </View>
                    <View style={{ borderWidth: 1, borderColor: '#ff8c00' }} />
                </SafeAreaView>

                <Text style={styles.titleOfScreen}>Register Me</Text>
                {/* {unitList.owner.length > 0 ? ( */}
                <View style={{ flexDirection: 'column' }}>
                    {/* <View style={styles.box}>
                        <Text style={{ color: "#fff", fontSize: hp("2.2%") }}>Join Us</Text>
                    </View>*/}
                    <View style={styles.View}>
                        <Card style={styles.DateCard}>
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <TouchableOpacity onPress={this.onDOBPress.bind(this)}>
                                    <View style={styles.datePickerBox}>
                                        <View style={styles.calView}>
                                            <Image
                                                style={styles.viewDatePickerImageStyle}
                                                source={require('../icons/cal.png')}
                                            />
                                        </View>

                                        <Text style={styles.datePickerText}>
                                            {this.state.dobText}{' '}
                                        </Text>
                                        <DatePickerDialog
                                            ref="dobDialog"
                                            onDatePicked={this.onDOBDatePicked.bind(this)}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </Card>
                    </View>

                    <View style={{ flexDirection: 'column', marginTop: hp('3%') }}>
                        <View style={styles.View}>
                            {this.renderButton() ? null : (
                                <TouchableOpacity onPress={() => this.submitForOwnwer()}>
                                    <Card style={styles.Card}>
                                        <View
                                            style={{
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Text style={{ fontSize: hp('2%') }}>Join As Owner</Text>
                                        </View>
                                    </Card>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={styles.View}>
                            {this.renderButton() ? null : (
                                <TouchableOpacity onPress={() => this.submitForTenant()}>
                                    <Card style={styles.Card}>
                                        <View
                                            style={{
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Text style={{ fontSize: hp('2%') }}>Join As Tenant</Text>
                                        </View>
                                    </Card>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                   {/* {this.state.isLoading ?      
                    <View style={styles.container2}>
                <ActivityIndicator size="large" color="#F3B431" />
                </View>
                :
                <View/>
                   } */}

                   
                </View> 
                
            </View>
             :
             <View style={styles.container2}>
                <ActivityIndicator size="large" color="#F3B431" />
                </View>
                                        
               
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: base.theme.colors.white
    },
    container2: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: base.theme.colors.transparent
    },
    titleOfScreen: {
        marginTop: hp('1.6%'),
        textAlign: 'center',
        fontSize: hp('2%'),
        fontWeight: 'bold',
        color: '#ff8c00',
        marginBottom: hp('1.6%')
    },
    viewStyle1: {
        backgroundColor: '#fff',
        height: hp('7%'),
        width: Dimensions.get('screen').width,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
        position: 'relative'
    },
    image1: {
        width: wp('34%'),
        height: hp('18%'),
        marginRight: hp('3%')
    },

    viewDetails1: {
        flex: 0.3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 3
    },
    viewDetails2: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: hp('3%'),
        height: hp('3%'),
        marginTop: 5
        // marginLeft: 10
    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff8c00',
        height: hp('5%'),
        marginLeft: hp('2%'),
        marginRight: hp('2%')
    },
    View: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },
    Card: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        width: hp('30%'),
        height: hp('6%'),
        borderRadius: hp('2%'),
        marginBottom: hp('2%')
    },
    DateCard: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        width: hp('35%'),
        height: hp('6%'),
        marginTop: hp('5%')
    },
    datePickerBox: {
        margin: hp('1.0%'),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: hp('4%'),
        padding: 0
    },
    datePickerText: {
        fontSize: hp('2%'),
        marginLeft: hp('2%'),
        marginRight: hp('2%'),
        color: '#474749'
    },
    calView: {
        width: hp('3%'),
        height: hp('3%'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    viewDatePickerImageStyle: {
        width: wp('4.5%'),
        height: hp('3%'),
        marginRight: hp('0.2%')
    }
});

const mapStateToProps = state => {
    let userdata = state.UserReducer.userData;
    const user =
        userdata != undefined &&
            userdata.data != undefined &&
            userdata.data.account != undefined &&
            userdata.data.account.length != undefined &&
            userdata.data.account.length > 0
            ? userdata.data.account[0]
            : null;
    return {
        MyFirstName: user != null ? user.acfName : state.UserReducer.MyFirstName,
        MyLastName: user != null ? user.aclName : state.UserReducer.MyLastName,
        MyEmail: user != null ? user.acEmail : state.UserReducer.MyEmail,
        MyMobileNumber:
            user != null ? user.acMobile : state.UserReducer.MyMobileNumber,
        MyISDCode: user != null ? user.acisdCode : state.UserReducer.MyISDCode,
        userData: state.UserReducer,
       joinedAssociations: state.JoinAssociationReducer.joinedAssociations,
        champBaseURL: state.OyespaceReducer.champBaseURL,
        oyeURL: state.OyespaceReducer.oyeURL,
        MyAccountID: state.UserReducer.MyAccountID,
        memberList: state.DashboardReducer.memberList,
        userReducer:state.UserReducer,
        userImage:state.UserReducer.userProfilePic,
        userReducer: state.UserReducer,
    };
};

export default connect(
    mapStateToProps,
    { updateJoinedAssociation, createUserNotification, getAssoMembers }
)(RegisterMe);

