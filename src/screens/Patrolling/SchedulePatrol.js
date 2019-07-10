/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-25
 */

import React from 'react';
import {
    Alert,
    DatePickerIOS,
    FlatList,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TimePickerAndroid,
    TouchableHighlight,
    TouchableOpacity,
    View
} from 'react-native';
import {connect} from 'react-redux';
import base from "../../base";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {updateSelectedCheckPoints} from '../../../src/actions';
import moment from 'moment';
import Modal from 'react-native-modal'
import EmptyView from "../../components/common/EmptyView";
import {Icon, Picker} from "native-base";
import OSButton from "../../components/osButton/OSButton";


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
            isSnoozeEnabled: false

        });

        this.getDeviceList = this.getDeviceList.bind(this);
      //  this.openTimePicker = this.openTimePicker.bind(this);

    };

    onValueChange(data, key) {
        let self = this;
        console.log("Devi:", data, key);
        let deviceArr = this.state.deviceNameList;

        for (let i in deviceArr) {
            if (data === deviceArr[i].deviceName) {
                console.log(deviceArr[i]);
                self.setState({
                    selectedDevice: deviceArr[i].deviceName
                })
            }
        }
    }


    componentWillMount() {
        this.getDeviceList();
    }

    async getDeviceList() {
        let self = this;

        //let associationId = this.props.SelectedAssociationID;
        let associationId = 8;
        let stat = await base.services.OyeSafeApi.getDeviceList(associationId);
        console.log("Stat:", stat, associationId);
        try {
            if (stat) {
                let dataReceived = stat.data.deviceListByAssocID;
                let deviceName = [];
                for (let i in dataReceived) {
                    let deviceDetail = {
                        deviceName: dataReceived[i].deGateNo,
                        deviceId: dataReceived[i].deid
                    }
                    deviceName.push(deviceDetail)
                }

                self.setState({
                    deviceNameList: deviceName,
                    selectedDevice: dataReceived[0].deGateNo
                });
            }
        } catch (e) {
            console.log(e)
        }
    };

    async schedulePatrol(days, patrolCheckPointID) {
        let self = this;

        let detail = {
            PSSnooze: self.state.isSnoozeEnabled,
            PSSTime: moment(self.state.startTime).format("hh:mm:ss"),
            PSETime: moment(self.state.endTime).format("hh:mm:ss"),
            PSRepDays: days,
            PSChkPIDs: patrolCheckPointID,
            DEName: self.state.selectedDevice,
            PSSltName: self.state.slotName,
            ASAssnID: self.props.SelectedAssociationID
        };

        let stat = await base.services.OyeSafeApi.schedulePatrol(detail);
        console.log("ljvkdf:", stat)
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

    async goBack() {
        const {updateSelectedCheckPoints} = this.props;
        await updateSelectedCheckPoints({value: []});
        this.props.navigation.navigate("schedulePatrolling",{refresh:true});
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
        console.log("Selected Device:", this.state.selectedDevice);
        return (
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Schedule</Text>
                </View>
                <View style={{flexDirection: 'column', height: hp('18%'), borderBottomWidth: 1}}>
                    <Text style={{fontFamily: base.theme.fonts.medium, fontSize: 17, paddingLeft: 10}}>Select Start
                        Time</Text>
                    <TouchableHighlight
                        underlayColor={base.theme.colors.transparent}
                        onPress={() => this.openTimeSpinner(0)}
                        style={{
                            height: hp('8%'),
                            width: '25%',
                            marginTop: hp('2%'),
                            borderWidth: 1.5,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderColor: base.theme.colors.primary
                        }}>
                        <Text
                            style={{color: base.theme.colors.primary}}>{moment(this.state.startTime).format("hh:mm A")}</Text>
                    </TouchableHighlight>
                </View>
                <View style={{flexDirection: 'column', height: hp('17%'), borderBottomWidth: 1, marginTop: hp('4%')}}>
                    <Text style={{fontFamily: base.theme.fonts.medium, fontSize: 17, paddingLeft: 10}}>Select End
                        Time</Text>
                    <TouchableHighlight
                        underlayColor={base.theme.colors.transparent}
                        onPress={() => this.openTimeSpinner(1)}
                        style={{
                            height: 50,
                            width: '25%',
                            marginTop: hp('2%'),
                            borderWidth: 1.5,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderColor: base.theme.colors.primary
                        }}>
                        <Text
                            style={{color: base.theme.colors.primary}}>{moment(this.state.endTime).format("hh:mm A")}</Text>
                    </TouchableHighlight>
                    <View style={{height: hp('10%')}}>
                        {this.openTimePicker()}
                    </View>
                </View>
                <View style={{height: hp('17%'), borderBottomWidth: 1, justifyContent: 'center', marginTop: hp('4%')}}>
                    <View style={{width: wp('95%'), alignSelf: 'center'}}>
                        <FlatList
                            keyExtractor={(item, index) => index.toString()}
                            data={this.state.days}
                            horizontal={true}
                            renderItem={(item, index) => this._renderDays(item, index)}
                            extraData={this.state}/>
                    </View>
                    <View style={{
                        height: hp('10%'),
                        width: wp('22%'),
                        justifyContent: 'center',
                        alignItems: 'center',
                        justifySelf: 'flex-end'
                    }}>
                        <Text style={{fontFamily: base.theme.fonts.medium}}>Repeat</Text>
                    </View>
                </View>
                <View style={{
                    height: hp('12%'),
                    alignSelf: 'center',
                    width: wp('100%'),
                    borderBottomWidth: 1,
                    marginTop: hp('4%')
                }}>
                    <View style={{
                        width: wp('27%'),
                        justifyContent: 'center',
                        alignItems: 'center',
                        justifySelf: 'flex-end'
                    }}>
                        <Text style={{fontFamily: base.theme.fonts.medium}}>Slot Name</Text>
                    </View>
                    <TextInput
                        placeholder={"Please Enter Slot Name"}
                        style={{height: hp('10%'), width: wp('90%'), borderWidth: 0, alignSelf: 'center'}}
                        onChangeText={(text) => this.setState({slotName: text})}
                        value={this.state.slotName}
                    />
                </View>
                <View style={{
                    height: hp('12%'),
                    alignSelf: 'center',
                    width: wp('100%'),
                    borderBottomWidth: 1,
                    marginTop: hp('4%')
                }}>
                    <View style={{
                        width: wp('32%'),
                        justifyContent: 'center',
                        alignItems: 'center',
                        justifySelf: 'flex-end'
                    }}>
                        <Text style={{fontFamily: base.theme.fonts.medium}}>Select Device</Text>
                        <Picker
                            mode="dropdown"
                            iosHeader="Select Device"
                            iosIcon={<Icon name="arrow-down"/>}
                            style={{
                                width: wp('90%'),
                                height: hp('5%'),
                                alignSelf: 'center',
                                marginTop: hp('2%'),
                                marginLeft: wp('60%'),
                            }}
                            selectedValue={this.state.selectedDevice}
                            onValueChange={(key) => this.onValueChange(key)}>
                            {deviceList}
                        </Picker>
                    </View>
                </View>
                <View style={{
                    height: hp('8%'),
                    width: wp('100%'),
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    marginTop: hp('4%')
                }}>
                    <View style={{
                        width: wp('65%'),
                    }}>
                        <Text style={{fontFamily: base.theme.fonts.medium}}>Snooze</Text>
                    </View>
                    <Switch
                        onValueChange={() => this.changeSnooze()}
                        value={this.state.isSnoozeEnabled}/>
                </View>
                <View style={{
                    height: hp('12%'),
                    width: wp('100%'),
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                    marginTop: hp('4%')
                }}>
                    <OSButton onButtonClick={() => this.props.navigation.goBack(null)}
                              oSBText={'Cancel'} oSBType={"custom"}
                              oSBBackground={base.theme.colors.red}
                              height={30} borderRadius={10}/>
                    <OSButton onButtonClick={() => this.validateFields()}
                              oSBText={'Save'} oSBType={"custom"}
                              oSBBackground={base.theme.colors.primary}
                              height={30} borderRadius={10}/>
                </View>
                <EmptyView height={60}/>
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

        if (daysString.length === 0) {
            alert("Please select patrolling days")
        } else if (base.utils.validate.isBlank(this.state.slotName)) {
            alert("Please enter slot name");
        } else {
            this.schedulePatrol(daysString, patrolCheckPointID)
        }
    }


    changeSnooze() {
        this.setState({
            isSnoozeEnabled: !this.state.isSnoozeEnabled
        })
    }

    selectDay(data) {
        let dayArr = this.state.days;
        console.log("data:", data, dayArr);
        let selectedDay = 0;

        for (let i in dayArr) {
            if (dayArr[i].day === data.day) {
                dayArr[i].isSelected = !dayArr[i].isSelected;
            }
        }

        this.setState({
            days: dayArr,
            selectedDay: selectedDay
        }, () => console.log("BHDBVDHK:", this.state))
    }

    _renderDays(item, index) {
        let dayOfWeek = item.item.initial;
        let dayData = item.item;

        return (
            <TouchableOpacity
                underlayColor={base.theme.colors.transparent}
                onPress={() => this.selectDay(item.item)}
                style={{
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    borderWidth: 1,
                    margin: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: dayData.isSelected ? base.theme.colors.primary : base.theme.colors.white,
                    borderColor: dayData.isSelected ? base.theme.colors.white : base.theme.colors.blue,
                }}>
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
        console.log("State1234:",self.state.isSpinnerOpen);
        let isOpen  = self.state.isSpinnerOpen;
        Platform.OS === 'ios' ? self.renderTimeSpinnerModal() : isOpen? self.renderTimePicker(this.state.selType, {
            hour: 0,
            minute: 0,
            is24Hour: false,
            mode: 'spinner',
        }):null
    }


    renderTimeSpinnerModal() {
        return (
            <Modal isVisible={this.state.isSpinnerOpen}
                   style={{
                       flex: 1,
                       backgroundColor: base.theme.colors.transparent,
                       height: 50,
                       alignSelf: 'center',
                       width: wp('90%'),
                   }}
            >
                <View
                    style={{
                        height: hp("50%"),
                        justifyContent: 'flex-start',
                        backgroundColor: base.theme.colors.white,
                    }}>
                    <TouchableHighlight
                        underlayColor={base.theme.colors.transparent}
                        style={{
                            height: hp('7%'),
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            alignSelf: 'flex-end',
                            width: wp('20%'),
                        }}
                        onPress={() => this.setState({isSpinnerOpen: false})}>
                        <Text style={{
                            alignSelf: 'center',
                            color: base.theme.colors.primary,
                            fontFamily: base.theme.fonts.medium
                        }}>Close</Text>
                    </TouchableHighlight>
                    <DatePickerIOS
                        date={this.state.selType === 0 ? this.state.startTime : this.state.endTime}
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
                    // Selected hour (0-23), minute (0-59)
                    let time = new Date(hour,minute);
                    let hrs = moment(time).add(hour,'hours');
                    let minu = moment(hrs).add(minute,'minutes');
                    let selectedTime = minu._d;
                    console.log("Time:", moment(minu._d).format('hh:mm A'));
                    this.changeTime(selectedTime);
                }
                else {
                    let time = new Date(hour,minute);
                    let hrs = moment(time).add(hour,'hours');
                    let minu = moment(hrs).add(minute,'minutes');
                    let selectedTime = minu._d;
                    console.log("Time:", moment(minu._d).format('hh:mm A'));
                    this.changeTime(selectedTime);
                }

            } catch ({code, message}) {
                console.warn('Cannot open time picker', message);
            }
    }

    changeTime(time) {
        if (this.state.selType === 0) {
            this.setState({startTime: time,isSpinnerOpen:false})
        } else {
            this.setState({endTime: time,isSpinnerOpen:false})
        }
    }


}


const styles = StyleSheet.create({
    container: {
        height: hp("30%"),
        width: '100%',
        backgroundColor: base.theme.colors.white,
    },
    header: {
        alignItems: 'center',
        justifyContent: "center",
        height: "10%"
    },
    headerText: {
        fontSize: 15,
        fontFamily: base.theme.fonts.medium,
        color: base.theme.colors.primary
    },
    flatListView: {
        height: hp('75%'),
        flexDirection: 'row',
        justifyContent: 'center'
    },
    checkBoxView: {
        height: hp('17%'),
        width: "98%",
        borderBottomWidth: 1,
        alignSelf: 'center',
        flexDirection: 'row'
    },
    checkBoxStyle: {
        flex: 1,
        padding: 10
    },
    mapImage: {
        height: "70%",
        width: wp("20%")
    },
    centerView: {
        height: '70%',
        width: wp("40%"),
        alignSelf: 'center',
        marginLeft: wp('4%')
    },
    centerTextView: {
        height: hp('5%'),
        justifyContent: 'center'
    },
    centerTextStyle: {
        fontFamily: base.theme.fonts.bold,
        fontSize: 15
    },
    locationView: {
        flexDirection: 'row',
        height: hp('4%'),
        width: wp('38%'),
        alignItems: 'center',
    },
    locationImageStyle: {
        height: hp('3%'),
        width: hp('3%')
    },
    locationText: {
        width: wp('35%'),
        fontFamily: base.theme.fonts.thin
    },
    rightView: {
        height: "85%",
        width: wp('20%'),
        alignSelf: 'center',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    rightImageStyle: {
        height: hp('4%'),
        width: hp('4%')
    }
});

const mapStateToProps = state => {
    return {
        SelectedAssociationID: state.UserReducer.SelectedAssociationID,
        selectedCheckPoints: state.PatrollingReducer
    }
};

export default connect(mapStateToProps, {updateSelectedCheckPoints})(SchedulePatrol)