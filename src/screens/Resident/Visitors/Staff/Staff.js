import React, {Component} from 'react';
import {
    View, Image, Text, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import base from "../../../../base";
import {Dropdown} from "react-native-material-dropdown";
import Share from 'react-native-share';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import OSButton from "../../../../components/osButton/OSButton";
import moment from "moment";
import DatePicker from 'react-native-datepicker'
import {connect} from "react-redux";
import {updateStaffInfo} from "../../../../actions";
import StaffStyle from "./StaffStyle";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
  } from "react-native-responsive-screen";

class Staff extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            isLoading:true,
            staffList: [],
            staffName: "",
            departmentName:"",
            staffPic: "",
            staffMobileNum: "",
            staffId: '',
            selectedInitialDate: new Date(),
            selectedEndDate: new Date(),
            minDate: new Date(),
            maxDate: moment(new Date()).format('DD-MM-YYYY'),
            todayDate: moment(new Date()).format('DD-MM-YYYY'),
            isMonthSelected: true,
            dayRadioProps: [{label: 'YESTERDAY', value: 0}, {label: 'TODAY', value: 1}],
            daySelected: -1,
            radioButtonMonth: [{label: 'MONTH TILL DATE', value: 0}],
        };
        this.getListOfStaff = this.getListOfStaff.bind(this);
    }

    componentWillMount() {
        this.getListOfStaff();
    }

    async getListOfStaff() {
        let self = this;
        //http://apiuat.oyespace.com/oye247/api/v1/GetWorkerListByAssocIDAndAccountID/70/21
        console.log("StaffList Input@#@#@#@#",self.props.userReducer.SelectedAssociationID,self.props.userReducer.MyAccountID)
        let stat = await base.services.OyeSafeApi.getStaffListByAssociationId(self.props.userReducer.SelectedAssociationID,self.props.userReducer.MyAccountID);// 1
        self.setState({isLoading: false})
        console.log("Check Data",stat)
        try {
            if (stat && stat.data && !stat.data.errorResponse) {
                let staffNamesList = [];
                for (let i = 0; i < stat.data.worker.length; i++) {
                    if (stat.data.worker[i].wkIsActive) {
                        staffNamesList.push({value: stat.data.worker[i].wkfName, staffDetails: stat.data.worker[i]})
                    }
                }
                staffNamesList.sort(function(a, b) {
                    let nameA = a.value.toUpperCase();
                    let nameB = b.value.toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
                self.setState({
                    staffName: staffNamesList[0].staffDetails.wkfName,
                    departmentName: staffNamesList[0].staffDetails.wkDesgn,
                    staffPic: staffNamesList[0].staffDetails.wkEntryImg,
                    staffMobileNum: staffNamesList[0].staffDetails.wkMobile,
                    staffList: staffNamesList,
                    staffId: staffNamesList[0].staffDetails.wkWorkID,
                    minDate: moment(staffNamesList[0].staffDetails.wkdCreated).format('DD-MM-YYYY'),
                })
            }
        } catch (error) {
            base.utils.logger.log(error)
        }

    }

    render() {
        let staffList = this.state.staffList;
        console.log('Add',this.state.staffPic)
        return (
            !this.state.isLoading?
                <View style={StaffStyle.mainContainer}>
                {this.state.staffList.length!==0?
                <View style={StaffStyle.dropDownView}>
                    <Dropdown
                        label="Select Staff"
                        value={this.state.staffName}
                        data={staffList}
                        textColor={base.theme.colors.black}
                        inputContainerStyle={{}}
                        containerStyle={{}}
                        rippleOpacity={0}
                        dropdownOffset={{top: 10, left: 0,}}
                        onChangeText={(value, index) =>
                            this.selectDifferentWorker(value, index)
                        }
                    />
                </View>
                    :<View/>}
                {this.state.staffList.length!==0?
                <View style={StaffStyle.detailsMainView}>
                    <View style={StaffStyle.detailsLeftView}>
                        {this.state.staffPic ==='' ?
                            <Image style={StaffStyle.staffImg}
                                   source={{uri:base.utils.strings.staffPlaceHolder}}
                            />
                            :
                            <Image style={StaffStyle.staffImg}
                                   source={{uri:base.utils.strings.imageUrl + this.state.staffPic}}
                            />
                        }
                        <View style={StaffStyle.textView}>
                            <Text style={StaffStyle.staffText}
                                  numberofLines={1} ellipsizeMode={'tail'}>{this.state.staffName} </Text>
                        </View>
                        {this.state.departmentName?
                        <Text style={StaffStyle.desigText}> ({this.state.departmentName})</Text>
                            :<View/>}

                    </View>
                    <View style={StaffStyle.detailsRightView}>
                        <TouchableOpacity onPress={() => this.shareWorkerDetails()}>
                            <Image style={StaffStyle.shareImg}
                                   source={require('../../../../../icons/share.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                    :
                    <View style={StaffStyle.noStaffData}>
                        <Image source={require('../../../../../icons/service.png')} style={{width:hp('10%'), height:hp('10%'), margin:hp('1%')}}/>
                        <Text style={StaffStyle.noStaffDataText}> No staff is there in the Selected Association </Text>
                    </View>}
                {this.state.staffList.length!==0?
                <View style={StaffStyle.datePickerMainView}>
                    <View style={StaffStyle.datePickerSubView}>
                        <DatePicker
                            style={{width: 150, alignItems: 'center'}}
                            date={this.state.selectedInitialDate}
                            mode="date"
                            placeholder="select date"
                            format="DD-MM-YYYY"
                            minDate={'20-2-2019'}
                            maxDate={this.state.todayDate}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            iconSource={require('../../../../../icons/calender.png')}
                            customStyles={{
                                dateIcon: {
                                    left: 2,
                                    alignSelf: 'center',
                                    marginLeft: 0,
                                },
                                dateInput: {
                                    borderWidth: 0,
                                    color: base.theme.colors.black,
                                    height:30,
                                    width:30

                                }
                            }}
                            onDateChange={(date) => {
                                this.setState({selectedInitialDate: date})
                            }}
                            disabled={!this.state.isMonthSelected}
                        />
                    </View>
                    <View style={StaffStyle.datePickerSubView}>
                        <DatePicker
                            style={{width: 150,}}
                            date={this.state.selectedEndDate}
                            mode="date"
                            placeholder="select date"
                            format="DD-MM-YYYY"
                            minDate={this.state.selectedInitialDate}
                            maxDate={this.state.maxDate}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            iconSource={require('../../../../../icons/calender.png')}
                            customStyles={{
                                dateIcon: {
                                    left: 2,
                                    alignSelf: 'center',
                                    marginLeft: 0,
                                    height:30,
                                    width:30
                                },
                                dateInput: {
                                    borderWidth: 0,
                                    color: base.theme.colors.black

                                }
                            }}
                            onDateChange={(date) => {
                                this.setState({selectedEndDate: date})
                            }}
                            disabled={!this.state.isMonthSelected}
                        />
                    </View>
                </View>
                    :<View/>}

                {this.state.staffList.length!==0?
                    <View style={StaffStyle.radioButtonView}>
                    <RadioForm formHorizontal={true} animation={true}>
                        {this.state.dayRadioProps.map((obj, i) => {
                            let onPress = (value, index) => {this.setDateInCalendar(value,index)};
                            return (
                                <View style={{width: '50%'}}>
                                    <RadioButton labelHorizontal={true} key={i}>
                                        <RadioButtonInput
                                            obj={obj}
                                            index={i.toString()}
                                            isSelected={this.state.daySelected === i}
                                            onPress={onPress}
                                            buttonInnerColor={base.theme.colors.mediumGrey}
                                            buttonOuterColor={base.theme.colors.mediumGrey}
                                            buttonSize={15}
                                            buttonStyle={{}}
                                            buttonWrapStyle={{marginLeft: 20}}
                                        />
                                        <RadioButtonLabel
                                            obj={obj}
                                            index={i.toString()}
                                            onPress={onPress}
                                            labelStyle={{fontWeight: 'bold', color: base.theme.colors.mediumGrey}}
                                            labelWrapStyle={{marginLeft: 5}}
                                        />
                                    </RadioButton>
                                </View>
                            )
                        })}
                    </RadioForm>
                    <RadioForm formHorizontal={true} animation={true}>
                        {this.state.radioButtonMonth.map((obj, j) => {
                            let onPress = (value, index) => {
                                this.setState({
                                    daySelected: -1,
                                    isMonthSelected: true,
                                })
                            };
                            return (
                                <View style={{width: '100%'}}>
                                    <RadioButton labelHorizontal={true} key={j.toString()}>
                                        <RadioButtonInput
                                            obj={obj}
                                            index={j.toString()}
                                            isSelected={this.state.isMonthSelected}
                                            onPress={onPress}
                                            buttonInnerColor={base.theme.colors.mediumGrey}
                                            buttonOuterColor={base.theme.colors.mediumGrey}
                                            buttonSize={15}
                                            buttonStyle={{}}
                                            buttonWrapStyle={{marginLeft: 20}}
                                        />
                                        <RadioButtonLabel
                                            obj={obj}
                                            index={j.toString()}
                                            onPress={onPress}
                                            labelStyle={{fontWeight: 'bold', color: base.theme.colors.mediumGrey}}
                                            labelWrapStyle={{marginLeft: 5}}
                                        />
                                    </RadioButton>
                                </View>
                            )
                        })}
                    </RadioForm>
                </View>
                    :
                    <View/>}
                {this.state.staffList.length!==0?
                <OSButton
                    height={'8%'}
                    width={'45%'}
                    borderRadius={20}
                    oSBText={'Get Report'}
                    onButtonClick={() => this.getStaffReport()}/>
                    :<View/>}
            </View>
                :
                <View style={StaffStyle.activityIndicator}>
                    <ActivityIndicator size="large" color={base.theme.colors.primary}/>
                </View>
        )
    }

    setDateInCalendar(value,index){

        if(value===0){
            let initialDate = moment(new Date()).subtract(1, 'day').format('DD-MM-YYYY')
            this.setState({
                daySelected: value,
                isMonthSelected: false,
                selectedInitialDate: initialDate,
                selectedEndDate: initialDate
            })
        }
        else{
            this.setState({
                daySelected: value,
                isMonthSelected: false,
                selectedInitialDate: moment(new Date()).format('DD-MM-YYYY'),
                selectedEndDate: moment(new Date()).format('DD-MM-YYYY')
            })
        }


    }


    getStaffReport = () => {
        let self = this;
        let fromDate = moment(self.state.selectedInitialDate, "DD-MM-YYYY").format('YYYY-MM-DD');
        let toDate = moment(self.state.selectedEndDate, "DD-MM-YYYY").format('YYYY-MM-DD');
        if (!self.state.isMonthSelected) {
            if (self.state.daySelected === 0) {
                fromDate = moment().subtract(1, 'days').format(),
                    toDate = fromDate;
            } else {
                fromDate = moment().format(),
                    toDate = fromDate;
            }
            const {updateStaffInfo} = this.props;
            updateStaffInfo({prop: "startDate", value: moment(fromDate).format('YYYY-MM-DD')})
            updateStaffInfo({prop: "endDate", value:  moment(toDate).format('YYYY-MM-DD')})
            updateStaffInfo({prop: "staffName", value: self.state.staffName})
            updateStaffInfo({prop: "staffId", value: self.state.staffId})
            updateStaffInfo({prop: "staffProfilePic", value: self.state.staffPic})
            updateStaffInfo({prop: "staffDesignation", value: self.state.departmentName})
            updateStaffInfo({prop: "joinedDate", value: self.state.minDate})

            this.props.navigation.navigate('getStaffReports',)

        } else {
            let initialDateString = moment(fromDate);
            let endDateString = moment(toDate)
            let duration = moment.duration(endDateString.diff(initialDateString));
            console.log(duration.as('days'))
            let difference = duration.as('days')
            if (difference > 31) {
                alert('Maximum Limit is 31 Days. You can not select more than that')
            } else {
                const {updateStaffInfo} = this.props;
                updateStaffInfo({prop: "startDate", value: moment(fromDate).format('YYYY-MM-DD')})
                updateStaffInfo({prop: "endDate", value:  moment(toDate).format('YYYY-MM-DD')})
                updateStaffInfo({prop: "staffName", value: self.state.staffName})
                updateStaffInfo({prop: "staffId", value: self.state.staffId})
                updateStaffInfo({prop: "staffProfilePic", value: self.state.staffPic})
                updateStaffInfo({prop: "staffDesignation", value: self.state.departmentName})
                updateStaffInfo({prop: "joinedDate", value: self.state.minDate})
                this.props.navigation.navigate('getStaffReports')
            }
        }
    };

    shareWorkerDetails() {
        let self = this;
        let mobileNumber = '';
        if (self.state.staffMobileNum) {
            mobileNumber = "Staff Mobile Number:" + self.state.staffMobileNum
        }
        let shareOptions = {
            title: "Staff Details",
            message: "Staff Name:" + self.state.staffName + '\n' + "Staff Designation:" + self.state.departmentName + '\n' + mobileNumber,
        };

        Share.open(shareOptions).then((res) => {
            console.log("Share data ", res, shareOptions)
        })
            .catch(err => console.log("error", err));
    }

    selectDifferentWorker(value, index) {
        let self = this;
        let staffList = self.state.staffList;
        let departmentName, staffPic, staffMobNum, workerId, minDate;
        for (let i = 0; i < staffList.length; i++) {
            if (i === index) {
                departmentName = staffList[i].staffDetails.wkDesgn;
                staffPic = staffList[i].staffDetails.wkEntryImg;
                staffMobNum = staffList[i].staffDetails.wkMobile;
                workerId = staffList[i].staffDetails.wkWorkID;
                minDate = staffList[i].staffDetails.wkdCreated
            }
        }
        self.setState({
            staffName: value,
            departmentName: departmentName,
            staffPic: staffPic,
            staffMobileNum: staffMobNum,
            staffId: workerId,
            minDate: moment(minDate).format('DD-MM-YYYY'),

        });

    }
}

const mapStateToProps = state => {
    return {
        userReducer: state.UserReducer,
        staffReducer: state.StaffReducer
    };
};

export default connect(mapStateToProps, {updateStaffInfo})(Staff);
