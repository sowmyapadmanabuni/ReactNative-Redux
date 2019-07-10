/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-07-08
 */

import React from 'react';
import {
    DatePickerAndroid,
    DatePickerIOS,
    Dimensions,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {connect} from 'react-redux';
import base from '../../base';
import {Dropdown} from 'react-native-material-dropdown';
import moment from "moment";
import OSButton from "../../components/osButton/OSButton";
import Modal from "react-native-modal";

const {height, width} = Dimensions.get('screen');

let dt = new Date();
dt.setDate(dt.getDate());
let _dt = dt;


class PatrollingReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            slots: [],
            slotData: [],
            isSelected: false,
            slotName: "",
            slotTime: "",
            startTime: _dt,
            endTime: _dt,
            isYesSelected: true,
            isTodaySelected: false,
            isMonthSelected: false,
            value: 0,
            isCalenderOpen: false,
            selType: 0,
            selectedSlotId: 0
        };

        this.getPatrolSlot = this.getPatrolSlot.bind(this);
    }


    componentWillMount() {
        this.getPatrolSlot()
    }

    async getPatrolSlot() {
        let self = this;
        let stat = await base.services.OyeSafeApi.getPatrollingShiftListByAssociationID(this.props.SelectedAssociationID);
        console.log("Stat in schedule patrolling", stat);
        try {
            if (stat.success) {
                let slotDataObj = {};
                let slotDataArr = [];
                for (let i in stat.data.patrollingShifts) {
                    slotDataObj = {
                        value: stat.data.patrollingShifts[i].psSltName,
                        id: stat.data.patrollingShifts[i].psPtrlSID,

                    }
                }
                slotDataArr.push(slotDataObj);
                self.setState({
                    slots: stat.data.patrollingShifts,
                    slotData: slotDataArr
                })
            }
        } catch (e) {
            console.log(e)
        }
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Patrolling Report</Text>
                </View>
                <View style={styles.dropdownView}>
                    <Dropdown
                        label='Select Schedule'
                        dropdownPosition={Platform.OS==='ios'?0:-1.5}
                        fontSize={20}
                        inputContainerStyle={{borderBottomColor: 'transparent', bottom: Platform.OS === 'ios' ? 10 : 10}}
                        containerStyle={{height: hp('5%'), justifyContent: 'center'}}
                        pickerStyle={styles.pickerStyles}
                        data={this.state.slotData}
                        onChangeText={(args, index, data) => this.setSelectedPatrol(data)}
                    />
                </View>
                {this.state.isSelected ? this.renderView() : <View/>}
                {(Platform.OS === 'ios') ? this.openIOSCalender() : <View/>}
            </View>
        );
    }

    openIOSCalender() {
        console.log("Opejkebnv", _dt);
        return (
            <Modal
                visible={this.state.isCalenderOpen}
                onRequestClose={this.close}>
                <View style={{
                    flex: 1,
                    backgroundColor: base.theme.colors.transparent,
                    height: hp('50%'),
                    width: wp('50%'),
                    alignSelf: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{flex: 1, justifyContent: 'center', width: width - 30}}>
                        <DatePickerIOS
                            date={this.state.selType === 0 ? this.state.startTime : this.state.endTime}
                            style={{backgroundColor: base.theme.colors.white}}
                            maximumDate={_dt}
                            mode="date"
                            onDateChange={(date) => {
                                console.log("SCBHDJVCD:", date, this.state.selType)
                                this.state.selType === 0 ? this.setState({startTime: date}) : this.setState({endTime: date})
                            }}/>
                        <TouchableHighlight onPress={() => this.closeIOSCalender()} underlayColor='transparent'>
                            <View style={{
                                backgroundColor: base.theme.colors.primary,
                                height: 50,
                                width: width - 30,
                                alignSelf: 'center',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    fontFamily: base.theme.fonts.medium,
                                    fontSize: 18,
                                    color: base.theme.colors.white,
                                    alignSelf: 'center'
                                }}>{moment(this.state.selType === 0 ? this.state.startTime : this.state.endTime).format("MMM DD YYYY")}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }

    closeIOSCalender() {
        this.setState({
            isCalenderOpen: false,
        })
    }

    openCalender(selType) {
        let dt = new Date();
        dt.setDate(dt.getDate());
        let _dt = dt;
        let self = this;
        Platform.OS === 'ios' ? (self.setState({isCalenderOpen: true, selType: selType})) : self.showPicker('cal', {
            date: _dt,
            maxDate: _dt
        })
        this.setState({
            selType: selType
        })
    }

    showPicker = async (stateKey, options) => {
        console.log("dknvkjfnvf:", stateKey, options)
        try {
            const {action, year, month, day} = await DatePickerAndroid.open(options);
            if (action === DatePickerAndroid.dismissedAction) {
                console.log("kdnksjdbvs")
            } else {
                let date = new Date(year, month, day);
                console.log("DVHDVJD", date);
                this.state.selType === 0 ? this.setState({startTime: date}) : this.setState({endTime: date})
            }
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    };

    renderView() {
        return (
            <View style={styles.viewStyle}>
                <View style={styles.slotDetail}>
                    <Image source={require('../../../icons/entry_time.png')}/>
                    <View style={styles.slotText}>
                        <Text style={styles.slotName}>{this.state.slotName}</Text>
                        <Text style={styles.slotTime}>{this.state.slotTime}</Text>
                    </View>
                </View>
                {this.state.isMonthSelected ?
                    <View style={styles.calender}>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.openCalender(0)}>
                            <View style={styles.time}>
                                <Text style={styles.timeText}>{moment(this.state.startTime).format('DD-MM-YYYY')}</Text>
                                <Image source={require('../../../icons/calender.png')}/>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.openCalender(1)}>
                            <View style={styles.time}>
                                <Text style={styles.timeText}>{moment(this.state.endTime).format('DD-MM-YYYY')}</Text>
                                <Image source={require('../../../icons/calender.png')}/>
                            </View>
                        </TouchableHighlight>
                    </View> : <View/>}
                <View style={styles.radioView}>
                    <View style={styles.radioView1}>
                        <View style={styles.radioView1}>
                            <TouchableHighlight onPress={() => this.selectTime(0)}
                                                underlayColor={base.theme.colors.transparent} style={styles.radioView2}>
                                <View style={{
                                    height: hp('3%'),
                                    width: hp('3%'),
                                    borderRadius: hp('1.5%'),
                                    backgroundColor: this.state.isYesSelected ? base.theme.colors.grey : base.theme.colors.white
                                }}/>
                            </TouchableHighlight>
                            <Text style={styles.selType}>Yesterday</Text>
                        </View>
                        <View style={styles.radioView1}>
                            <TouchableHighlight onPress={() => this.selectTime(1)}
                                                underlayColor={base.theme.colors.transparent} style={styles.radioView2}>
                                <View style={{
                                    height: hp('3%'),
                                    width: hp('3%'),
                                    borderRadius: hp('1.5%'),
                                    backgroundColor: this.state.isTodaySelected ? base.theme.colors.grey : base.theme.colors.white
                                }}/>
                            </TouchableHighlight>
                            <Text style={styles.selType}>Today</Text>
                        </View>
                    </View>
                    <View style={{alignSelf: 'flex-start', left: Platform.OS === 'ios' ? 44 : 44, top: 25}}>
                        <View style={styles.radioView_1}>
                            <TouchableHighlight onPress={() => this.selectTime(2)}
                                                underlayColor={base.theme.colors.transparent} style={styles.radioView2}>
                                <View style={{
                                    height: hp('3%'),
                                    width: hp('3%'),
                                    borderRadius: hp('1.5%'),
                                    backgroundColor: this.state.isMonthSelected ? base.theme.colors.grey : base.theme.colors.white
                                }}/>
                            </TouchableHighlight>
                            <Text style={styles.selType}>Month Till Date</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.radioView, {alignItems: "center"}]}>
                    <OSButton oSBType={'custom'} onButtonClick={() => this.getReport()}
                              borderRadius={hp('5%')}
                              width={wp('40%')}
                              oSBTextColor={base.theme.colors.white} oSBText={"Get Report"}/>
                </View>
            </View>
        )
    }

    getReport() {
        let selectedDate = new Date();
        let selectedStartDate = '';
        let selectedEndDate = '';
        if (this.state.isYesSelected) {
            selectedStartDate = moment(selectedDate).subtract(1, 'day');
            selectedEndDate = moment(selectedDate).subtract(1, 'day');
        } else if (this.state.isTodaySelected) {
            selectedStartDate = selectedDate;
            selectedEndDate = selectedDate;
        } else {
            selectedStartDate = this.state.startTime;
            selectedEndDate = this.state.endTime;
        }
        let detail = {
            FromDate: moment(selectedStartDate).format("YYYY-MM-DD"),
            ToDate: moment(selectedEndDate).format("YYYY-MM-DD"),
            ASAssnID: this.props.SelectedAssociationID,
            PSPtrlSID: this.state.selectedSlotId
        };

        console.log("Detail:", detail)

        this.props.navigation.navigate('reportScreen', {detail})

    }

    selectTime(val) {
        if (val === 0) {
            this.setState({
                isYesSelected: true,
                isTodaySelected: false,
                isMonthSelected: false,
            })
        } else if (val === 1) {
            this.setState({
                isYesSelected: false,
                isTodaySelected: true,
                isMonthSelected: false,
            })
        } else {
            this.setState({
                isYesSelected: false,
                isTodaySelected: false,
                isMonthSelected: true,
            })
        }
    }

    setSelectedPatrol(data) {
        let slotArr = this.state.slots;
        let selectedSlotId = data[0].id;
        for (let i in slotArr) {
            if (slotArr[i].psPtrlSID === selectedSlotId) {
                console.log(slotArr[i])
                this.setState({
                    slotName: slotArr[i].psSltName,
                    slotTime: moment(slotArr[i].pseTime).format("hh:mmA") + " - " + moment(slotArr[i].pssTime).format("hh:mmA"),
                    isSelected: true,
                    selectedSlotId: selectedSlotId
                })
            }
        }
    }
}

const styles = StyleSheet.create({
    container: {
        height: hp('100%'),
        width: wp('100%'),
        color: base.theme.colors.white
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
    dropdownView: {
        width: wp('90%'),
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: base.theme.colors.grey,
        justifyContent: 'center'
    },
    pickerStyles: {
        width: wp('80%'),
        alignSelf: 'center',
        marginLeft: 15,
        bottom: Platform.OS === 'ios' ? 13 : 0
    },
    viewStyle: {
        height: hp('85%'),
        width: wp('100%'),
    },
    slotDetail: {
        borderWidth: 0,
        width: wp('50%'),
        height: hp('12%'),
        flexDirection: 'row',
        alignItems: 'center',
        left: 20
    },
    slotText: {
        flexDirection: 'column',
        left: 10
    },
    slotName: {
        fontSize: 20,
        fontFamily: base.theme.fonts.bold,

    },
    slotTime: {
        fontSize: 18,
        color: base.theme.colors.primary,
        top: 3
    },
    calender: {
        borderWidth: 0,
        alignSelf: 'center',
        width: wp('90%'),
        height: hp('12%'),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    time: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        width: wp('30%')
    },
    timeText: {
        fontFamily: base.theme.fonts.medium
    },
    radioView: {
        borderWidth: 0,
        alignSelf: 'center',
        justifyContent: 'center',
        width: wp('90%'),
        height: hp('20%'),
    },
    radioView1: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'},
    radioView_1: {flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around'},
    radioView2: {
        height: hp('4%'),
        width: hp('4%'),
        borderRadius: hp('2%'),
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: base.theme.colors.grey
    },
    selType: {
        left: 10,
        fontSize: 15,
        fontFamily: base.theme.fonts.medium
    },
    buttonView: {}
});


const mapStateToProps = state => {
    return {
        SelectedAssociationID: state.UserReducer.SelectedAssociationID
    }
};

export default connect(mapStateToProps)(PatrollingReport)