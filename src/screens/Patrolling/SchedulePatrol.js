/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-25
 */

import React from 'react';
import {
    Alert,
    AsyncStorage,
    BackHandler,
    DatePickerIOS,
    FlatList,
    Platform,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TimePickerAndroid,
    TouchableHighlight,
    TouchableOpacity,
    View
} from 'react-native';
import {connect} from 'react-redux';
import axios from "axios";
import base from "../../base";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {updateSelectedCheckPoints} from '../../../src/actions';
import moment from 'moment';
import Modal from 'react-native-modal'
import EmptyView from "../../components/common/EmptyView";
import {Icon, Picker} from "native-base";
import OSButton from "../../components/osButton/OSButton";
import SchedulePatrolStyles from "./SchedulePatrolStyles";


let currentDate = new Date();


class SchedulePatrol extends React.Component {
    constructor(props) {
        super(props);

        this.state = ({
            startTime: currentDate,
            endTime: currentDate,
            isSpinnerOpen: false,
            selType: 0,
            days: [{day: "Sunday", initial: "S", isSelected: false, dayOfWeek: 1}, {
                day: "Monday",
                initial: "M",
                isSelected: false,
                dayOfWeek: 2
            }, {
                day: "Tuesday",
                initial: "T", isSelected: false, dayOfWeek: 3
            }, {day: "Wednesday", initial: "W", isSelected: false, dayOfWeek: 4}, {
                day: "Thursday",
                initial: "T",
                isSelected: false, dayOfWeek: 5
            }, {
                day: "friday",
                initial: "F", isSelected: false, dayOfWeek: 6
            }, {day: "Saturday", initial: "S", isSelected: false, dayOfWeek: 7}],
            slotName: '',
            deviceNameList: [],
            selectedDevice: "",
            isSnoozeEnabled: false,
            patrolId: null,
            patrolData: {},
            pcid: []
        });

        console.log("TIME:", props);
        this.getDeviceList = this.getDeviceList.bind(this);
        //  this.openTimePicker = this.openTimePicker.bind(this);

    };

    onValueChange(data, key) {
        let self = this;
        let deviceArr = this.state.deviceNameList;
        console.log("Hitting Here",data,deviceArr)

        for (let i in deviceArr) {
            if (data === deviceArr[i].deviceName) {
                self.setState({
                    selectedDevice: deviceArr[i].deviceName
                })
            }
        }
    }

    componentDidUpdate() {
        setTimeout(() => {
            BackHandler.addEventListener('hardwareBackPress', () => this.processBackPress())
        }, 100)
    }

    componentWillUnmount() {
        setTimeout(() => {
            BackHandler.removeEventListener('hardwareBackPress', () => this.processBackPress())
        }, 0)

    }

    processBackPress() {
        console.log("Part");
        const {goBack} = this.props.navigation;
        goBack(null);
    }


    async componentWillMount() {
        let key = base.utils.strings.patrolId;
        let key1 = "PCID";
        let data = await AsyncStorage.getItem(key);
        let pcid = await AsyncStorage.getItem(key1);
        console.log("PCID:", pcid);
        if (data !== null || data !== undefined) {
            this.setState({patrolId: data, pcid: pcid}, () => this.getDeviceList())
        }
       // this.getDeviceList();
    }

    async getPatrolData() {
        let self = this;

        let stat = await base.services.OyeSafeApi.getPatrollingShiftListByAssociationID(this.props.SelectedAssociationID);
        //let stat = await base.services.OyeSafeApi.getPatrollingShiftListByAssociationID(8);
        try {
            if (stat.success) {
                let patrollArr = stat.data.patrollingShifts;
                for (let i in patrollArr) {
                    if (self.state.patrolId == patrollArr[i].psPtrlSID) {
                        self.setState({
                            patrolData: patrollArr[i]
                        }, () => self.setData())
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }

    }


    setData() {
        //moment.utc(yourDate).format()
        let data = this.state.patrolData;
        console.log("DATA:", data);

        let sdt = new Date(data.pssTime);
        let edt = new Date(data.pseTime);
        sdt.setDate(sdt.getDate());
        edt.setDate(edt.getDate());
        let _sdt = sdt;
        let _edt = edt;
        let days = this.state.days;
        let receivedDays = data.psRepDays.split(',');
        console.log("Days:", data.deName, this.state.deviceNameList);
        for (let i in days) {
            for (let j in receivedDays) {
                if (days[i].day === receivedDays[j]) {
                    console.log(days[i].day, receivedDays[j]);
                    days[i].isSelected = true
                }
            }
        }

        // let deviceArr = this.state.deviceNameList;
        // let deviceName = '';
        // for (let i in deviceArr){
        //     if(deviceArr[i].deviceName == data.deName){
        //         console.log("Days123:", data.deName, deviceArr[i].deviceName); 
        //          deviceName = deviceArr[i].deviceName
        //     }  
        // }

        this.onValueChange(data.deName)

        this.setState({
            startTime: _sdt,
            endTime: _edt,
            slotName: data.psSltName,
            isSnoozeEnabled: data.psSnooze,
            days: days,
            //selectedDevice:deviceName
        })
    }

    async getDeviceList() {
        let self = this;

        const {
            oyeURL
        } = this.props;


        var headers = {
            "Content-Type": "application/json",
            "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
        };

        console.log("OyeURL:", oyeURL);

        //let stat = await base.services.OyeSafeApi.getDeviceList(associationId);
        let associationId = this.props.SelectedAssociationID;
        //let associationId = 8;
        axios
            .get(
                `http://${oyeURL}/oyesafe/api/v1/Device/GetDeviceListByAssocID/${associationId}`,
                {
                    headers: headers
                }
            )
            .then(stat => {
                console.log("Stat:", stat);
                try {
                    if (stat) {
                        let dataReceived = stat.data.data.deviceListByAssocID;
                        let deviceName = [];
                        for (let i in dataReceived) {
                            let deviceDetail = {
                                deviceName: dataReceived[i].deGateNo,
                                deviceId: dataReceived[i].deid
                            };
                            deviceName.push(deviceDetail)
                        }

                        self.setState({
                            deviceNameList: deviceName,
                            selectedDevice: dataReceived[0].deGateNo
                        },()=>this.getPatrolData());
                    }
                } catch (e) {
                    console.log(e)
                }
            })

    };

    async schedulePatrol(days, patrolCheckPointID) {
        let self = this;


        let detail = {
            PSSnooze: self.state.isSnoozeEnabled,
            PSSTime: moment(self.state.startTime).format("HH:mm:ss"),
            PSETime: moment(self.state.endTime).format("HH:mm:ss"),
            PSRepDays: days,
            PSChkPIDs: patrolCheckPointID,
            DEName: self.state.selectedDevice,
            PSSltName: self.state.slotName,
            ASAssnID: self.props.SelectedAssociationID,
            //ASAssnID: 8
        };

        console.log("Detail for network call:", detail);

        let stat = await base.services.OyeSafeApi.schedulePatrol(detail);
        try {
            if (stat) {
                if (stat.success) {
                    Alert.alert(
                        'Success',
                        'Patrolling has be successfully scheduled',
                        [
                            {text: 'Go back', onPress: () => self.goBack()},
                        ],
                        {cancelable: false},
                    );
                } else {
                    alert(stat.error.message);
                }
            }
        } catch (e) {
            base.utils.logger.log(e);
        }
    };

    async updatePatrol(days, patrolCheckPointID) {
        let self = this;
        let pcids = '';

        let statePcid = JSON.parse(self.state.pcid);

        for (let i in statePcid) {
            console.log("PCIS:", JSON.parse(self.state.pcid));
            pcids = pcids === "" ? pcids + statePcid[i] : pcids + "," + statePcid[i]

        }

        let detail = {
            PSSnooze: self.state.isSnoozeEnabled,
            PSSTime: moment(self.state.startTime).format("HH:mm:ss"),
            PSETime: moment(self.state.endTime).format("HH:mm:ss"),
            PSRepDays: days,
            PSChkPIDs: patrolCheckPointID,
            DEName: self.state.selectedDevice,
            PSSltName: self.state.slotName,
            ASAssnID: self.props.SelectedAssociationID,
            //ASAssnID: 8,
            PSPtrlSID: self.state.patrolId,
            PCIDs: pcids
        };
        let stat = await base.services.OyeSafeApi.updatePatrol(detail);
        console.log("KHJDKVHDV<HDKJVDV<:", stat,detail);
        try {
            if (stat) {
                if (stat.success) {
                    Alert.alert(
                        'Success',
                        'Patrolling has be successfully updated',
                        [
                            {text: 'Go back', onPress: () => self.goBack()},
                        ],
                        {cancelable: false},
                    );
                } else {
                    alert(stat.error.message);
                }
            }
        } catch (e) {
            base.utils.logger.log(e);
        }
    }

    async goBack() {
        const {updateSelectedCheckPoints} = this.props;
        await updateSelectedCheckPoints({value: []});
        this.props.navigation.navigate("schedulePatrolling", {refresh: true});
    }

    openTimeSpinner(selType) {
        this.setState({
            selType: selType,
            isSpinnerOpen: true
        });
    }

    render() {
        let deviceList = this.state.deviceNameList.map((d, i) => {
            return <Picker.Item key={d.deviceId} label={d.deviceName} value={d.deviceName}/>
        });
        return (
            <ScrollView style={SchedulePatrolStyles.container}>
                <View style={SchedulePatrolStyles.header}>
                    <Text style={SchedulePatrolStyles.headerText}>Schedule</Text>
                </View>
                <View style={SchedulePatrolStyles.startTimeView}>
                    <Text style={SchedulePatrolStyles.startText}>Select Start
                        Time</Text>
                    <TouchableHighlight
                        underlayColor={base.theme.colors.transparent}
                        onPress={() => this.openTimeSpinner(0)}
                        style={SchedulePatrolStyles.endTimeText}>
                        <Text
                            style={{color: base.theme.colors.primary}}>{moment(this.state.startTime).format("hh:mm A")}</Text>
                    </TouchableHighlight>
                </View>
                <View style={SchedulePatrolStyles.endTimeView}>
                    <Text style={SchedulePatrolStyles.endText}>Select End
                        Time</Text>
                    <TouchableHighlight
                        underlayColor={base.theme.colors.transparent}
                        onPress={() => this.openTimeSpinner(1)}
                        style={SchedulePatrolStyles.endTimeText}>
                        <Text
                            style={{color: base.theme.colors.primary}}>{moment(this.state.endTime).format("hh:mm A")}</Text>
                    </TouchableHighlight>
                    <View style={{height: hp('10%')}}>
                        {this.openTimePicker()}
                    </View>
                </View>
                <View style={SchedulePatrolStyles.flatListMainView}>
                    <View style={SchedulePatrolStyles.flatList}>
                        <FlatList
                            keyExtractor={(item, index) => index.toString()}
                            data={this.state.days}
                            horizontal={true}
                            renderItem={(item, index) => this._renderDays(item, index)}
                            extraData={this.state}/>
                    </View>
                    <View style={SchedulePatrolStyles.repeatTextView}>
                        <Text style={{fontFamily: base.theme.fonts.medium}}>Repeat</Text>
                    </View>
                </View>
                <View style={SchedulePatrolStyles.slotMainView}>
                    <View style={SchedulePatrolStyles.slotSubView}>
                        <Text style={{fontFamily: base.theme.fonts.medium}}>Slot Name</Text>
                    </View>
                    <TextInput
                        placeholder={"Please Enter Slot Name"}
                        style={SchedulePatrolStyles.textInputView}
                        onChangeText={(text) => this.setState({slotName: text})}
                        value={this.state.slotName}
                    />
                </View>
                <View style={SchedulePatrolStyles.selectDevMainView}>
                    <View style={SchedulePatrolStyles.selectDevView}>
                        <Text style={{fontFamily: base.theme.fonts.medium}}>Select Device</Text>
                        <Picker
                            mode="dropdown"
                            iosHeader="Select Device"
                            iosIcon={<Icon name="arrow-down"/>}
                            style={SchedulePatrolStyles.picker}
                            selectedValue={this.state.selectedDevice}
                            onValueChange={(key) => this.onValueChange(key)}>
                            {deviceList}
                        </Picker>
                    </View>
                </View>
                <View style={SchedulePatrolStyles.snozeMainView}>
                    <View style={{
                        width: wp('65%'),
                    }}>
                        <Text style={{fontFamily: base.theme.fonts.medium}}>Snooze</Text>
                    </View>
                    <Switch
                        onValueChange={() => this.changeSnooze()}
                        value={this.state.isSnoozeEnabled}/>
                </View>
                <View style={SchedulePatrolStyles.osButtonView}>
                    <OSButton onButtonClick={() => this.props.navigation.goBack(null)}
                              oSBText={'Cancel'} oSBType={"custom"}
                              oSBBackground={base.theme.colors.red}
                              height={30} borderRadius={10}/>
                    <OSButton onButtonClick={() => this.validateFields()}
                              oSBText={this.state.patrolId === null ? 'Save' : 'Update'} oSBType={"custom"}
                              oSBBackground={base.theme.colors.primary}
                              height={30} borderRadius={10}/>
                </View>
                <EmptyView height={60}/>
                {this.renderTimeSpinnerModal()}
            </ScrollView>
        )
    }

    validateFields() {
        let dayArr = this.state.days;
        let daysString = "";
        let patrolCheckPointID = "";
        for (let i in dayArr) {
            if (dayArr[i].isSelected) {
                daysString = daysString === "" ? daysString + dayArr[i].day : daysString + "," + dayArr[i].day
            }
        }

        for (let i in this.props.selectedCheckPoints.selectedCheckPoints) {
            patrolCheckPointID = patrolCheckPointID === "" ? patrolCheckPointID + this.props.selectedCheckPoints.selectedCheckPoints[i].cpChkPntID : patrolCheckPointID + "," + this.props.selectedCheckPoints.selectedCheckPoints[i].cpChkPntID
        }

        let startTime = moment(this.state.startTime).format("HH:mm");
        let endTime = moment(this.state.endTime).format("HH:mm");
        console.log('Time at validation:', (this.state.startTime), (this.state.endTime));

        console.log("Disfffff:", this.compareTime(startTime, endTime));
        let diff = this.compareTime(startTime, endTime);
        if (!diff) {
            alert("Patrol end time can not be earlier than or equal to patrol start time");
        } else if (daysString.length === 0) {
            alert("Please select patrolling days")
        } else if (base.utils.validate.isBlank(this.state.slotName)) {
            alert("Please enter slot name");
        } else {
            this.state.patrolId === null ? this.schedulePatrol(daysString, patrolCheckPointID) : this.updatePatrol(daysString, patrolCheckPointID)
        }
    }


    compareTime(startTime, endTime) {
        let startTimeArr = startTime.split(":");
        let endTimeArr = endTime.split(":");
        console.log("Time Arr:", startTimeArr, endTimeArr);

        if (startTimeArr[0] > endTimeArr[0]) {
            return false
        } else if (startTimeArr[0] < endTimeArr[0]) {
            return true
        } else {
            if (startTimeArr[1] > endTimeArr[1]) {
                return false
            } else if (startTimeArr[0] === endTimeArr[0]) {
                if (startTimeArr[1] === endTimeArr[1]) {
                    return false
                } else {
                    return true
                }
            } else {
                return true
            }
        }


    }


    changeSnooze() {
        this.setState({
            isSnoozeEnabled: !this.state.isSnoozeEnabled
        })
    }

    selectDay(data) {
        let dayArr = this.state.days;
        let selectedDay = 0;

        for (let i in dayArr) {
            if (dayArr[i].day === data.day) {
                dayArr[i].isSelected = !dayArr[i].isSelected;
            }
        }

        this.setState({
            days: dayArr,
            selectedDay: selectedDay
        })
    }

    _renderDays(item, index) {
        let dayOfWeek = item.item.initial;
        let dayData = item.item;

        return (
            <TouchableOpacity
                underlayColor={base.theme.colors.transparent}
                onPress={() => this.selectDay(item.item)}
                style={[SchedulePatrolStyles.dataWeekView, {
                    backgroundColor: dayData.isSelected ? base.theme.colors.primary : base.theme.colors.white,
                    borderColor: dayData.isSelected ? base.theme.colors.white : base.theme.colors.blue
                }]}>
                <Text
                    style={{
                        color: dayData.isSelected ? base.theme.colors.white : base.theme.colors.black,
                        textAlign: 'center'
                    }}>{dayOfWeek}</Text>
            </TouchableOpacity>
        )
    }

    openTimePicker() {
        let self = this;
        let isOpen = self.state.isSpinnerOpen;
        let hr = moment().get('hour');
        let min = moment().get('minute');
        console.log("JDHH:", hr, min);
        Platform.OS === 'ios' ? self.renderTimeSpinnerModal() : isOpen ? self.renderTimePicker(this.state.selType, {
            hour: hr,
            minute: min,
            is24Hour: false,
            mode: 'spinner',
        }) : null
    }


    renderTimeSpinnerModal() {
        let sTime = this.state.startTime;
        let eTime = this.state.endTime;
        let selectedDate = this.state.selType === 0 ? sTime : eTime;

        return (
            <Modal isVisible={Platform.OS === 'ios' ? this.state.isSpinnerOpen : false}
                   style={SchedulePatrolStyles.spinModal}
            >
                <View
                    style={SchedulePatrolStyles.spinMainView}>
                    <TouchableHighlight
                        underlayColor={base.theme.colors.transparent}
                        style={SchedulePatrolStyles.closeTextView}
                        onPress={() => this.setState({isSpinnerOpen: false})}>
                        <Text style={SchedulePatrolStyles.closeText}>Close</Text>
                    </TouchableHighlight>
                    <DatePickerIOS
                        date={selectedDate}
                        mode={'time'}
                        height={100}
                        style={{height: 100}}
                        onDateChange={(time) => this.changeTime(time)}
                    />
                </View>
            </Modal>
        )
    }

    renderTimePicker = async (stateKey, options) => {
        try {
            let newState = {};
            const {action, hour, minute} = await TimePickerAndroid.open(options);
            if (action !== TimePickerAndroid.dismissedAction) {
                let newTime = new Date();
                newTime.setHours(hour);
                newTime.setMinutes(minute);
                console.log("SELELMEKVJBHEJV:", newTime);
                this.changeTime(newTime);
            } else {
                let newTime = new Date();
                newTime.setHours(hour);
                newTime.setMinutes(minute);
                console.log("SELELMEKVJBHEJV111111", newTime, currentDate);
                this.changeTime(currentDate);
            }

        } catch ({code, message}) {
            console.warn('Cannot open time picker', message);
        }
    };

    changeTime(time) {
        console.log("Old Time:", time);
        let selTime = time === "Invalid Date" ? currentDate : time;
        console.log("Time:", selTime, (time), currentDate);
        if (this.state.selType === 0) {
            this.setState({startTime: selTime, isSpinnerOpen: false})
        } else {
            this.setState({endTime: selTime, isSpinnerOpen: false})
        }
    }


}

const mapStateToProps = state => {
    return {
        SelectedAssociationID: state.DashboardReducer.assId,
        selectedCheckPoints: state.PatrollingReducer,
        oyeURL: state.OyespaceReducer.oyeURL,
    }
};

export default connect(mapStateToProps, {updateSelectedCheckPoints})(SchedulePatrol)