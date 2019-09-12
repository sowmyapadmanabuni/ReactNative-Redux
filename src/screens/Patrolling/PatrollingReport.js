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
    Text,
    TouchableHighlight,
    View,
    BackHandler
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {connect} from 'react-redux';
import base from '../../base';
import {Dropdown} from 'react-native-material-dropdown';
import moment from "moment";
import OSButton from "../../components/osButton/OSButton";
import Modal from "react-native-modal";
import PatrollingReportStyles from "./PatrollingReportStyles";

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

    componentDidUpdate() {
        setTimeout(()=>{
          BackHandler.addEventListener('hardwareBackPress',()=>this.processBackPress())
        },100)
      }
    
      componentWillUnmount() {
        setTimeout(()=>{
          BackHandler.removeEventListener('hardwareBackPress',()=> this.processBackPress())
        },0)
        
      }
    
       processBackPress(){
        console.log("Part");
        const {goBack} = this.props.navigation;
        goBack(null);
      }

    async getPatrolSlot() {
        let self = this;
        let stat = await base.services.OyeSafeApi.getPatrollingShiftListByAssociationID(this.props.SelectedAssociationID);
        try {
            if (stat.success) {
                let slotDataObj = {};
                let slotDataArr = [];
                for (let i in stat.data.patrollingShifts) {
                    slotDataObj = {
                        value: stat.data.patrollingShifts[i].psSltName,
                        id: stat.data.patrollingShifts[i].psPtrlSID,
                    }
                    slotDataArr.push(slotDataObj);
                }

                base.utils.logger.log(stat);
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
            <View style={PatrollingReportStyles.container}>
                <View style={PatrollingReportStyles.header}>
                    <Text style={PatrollingReportStyles.headerText}>Patrolling Report</Text>
                </View>
                <View style={PatrollingReportStyles.dropdownView}>
                    <Dropdown
                        label='Select Schedule'
                        dropdownPosition={Platform.OS === 'ios' ? 0 : -1.5}
                        fontSize={20}
                        inputContainerStyle={{
                            borderBottomColor: 'transparent',
                            bottom: Platform.OS === 'ios' ? 10 : 10
                        }}
                        containerStyle={{height: hp('5%'), justifyContent: 'center'}}
                        pickerStyle={PatrollingReportStyles.pickerStyles}
                        data={this.state.slotData}
                        onChangeText={(args, index, data) => this.setSelectedPatrol(args, data)}
                    />
                </View>
                {this.state.isSelected ? this.renderView() : <View/>}
                {(Platform.OS === 'ios') ? this.openIOSCalender() : <View/>}
            </View>
        );
    }

    openIOSCalender() {
        return (
            <Modal
                visible={this.state.isCalenderOpen}
                onRequestClose={this.close}>
                <View style={PatrollingReportStyles.ModalMainView}>
                    <View style={{flex: 1, justifyContent: 'center', width: width - 30}}>
                        <DatePickerIOS
                            date={this.state.selType === 0 ? this.state.startTime : this.state.endTime}
                            style={{backgroundColor: base.theme.colors.white}}
                            maximumDate={_dt}
                            mode="date"
                            onDateChange={(date) => {
                                this.state.selType === 0 ? this.setState({startTime: date}) : this.setState({endTime: date})
                            }}/>
                        <TouchableHighlight onPress={() => this.closeIOSCalender()} underlayColor='transparent'>
                            <View style={[PatrollingReportStyles.modalView, {width: width - 30}]}>
                                <Text
                                    style={PatrollingReportStyles.modalText}>{moment(this.state.selType === 0 ? this.state.startTime : this.state.endTime).format("MMM DD YYYY")}</Text>
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
        try {
            const {action, year, month, day} = await DatePickerAndroid.open(options);
            if (action === DatePickerAndroid.dismissedAction) {
            } else {
                let date = new Date(year, month, day);
                this.state.selType === 0 ? this.setState({startTime: date}) : this.setState({endTime: date})
            }
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    };

    renderView() {
        return (
            <View style={PatrollingReportStyles.viewStyle}>
                <View style={PatrollingReportStyles.slotDetail}>
                    <Image
                        resizeMode={'center'}
                        style={PatrollingReportStyles.entryTimeIcon}
                        source={require('../../../icons/entry_time.png')}/>
                    <View style={PatrollingReportStyles.slotText}>
                        <Text style={PatrollingReportStyles.slotName}>{this.state.slotName}</Text>
                        <Text style={PatrollingReportStyles.slotTime}>{this.state.slotTime}</Text>
                    </View>
                </View>
                {this.state.isMonthSelected ?
                    <View style={PatrollingReportStyles.calender}>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.openCalender(0)}>
                            <View style={PatrollingReportStyles.time}>
                                <Text
                                    style={PatrollingReportStyles.timeText}>{moment(this.state.startTime).format('DD-MM-YYYY')}</Text>
                                <Image
                                    resizeMode={'center'}
                                    style={PatrollingReportStyles.calenderIcon}
                                    source={require('../../../icons/calender.png')}/>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.openCalender(1)}>
                            <View style={PatrollingReportStyles.time}>
                                <Text
                                    style={PatrollingReportStyles.timeText}>{moment(this.state.endTime).format('DD-MM-YYYY')}</Text>
                                <Image
                                    resizeMode={'center'}
                                    style={PatrollingReportStyles.calenderIcon}
                                    source={require('../../../icons/calender.png')}/>
                            </View>
                        </TouchableHighlight>
                    </View> : <View/>}
                <View style={PatrollingReportStyles.radioView}>
                    <View style={PatrollingReportStyles.radioView1}>
                        <View style={PatrollingReportStyles.radioView1}>
                            <TouchableHighlight onPress={() => this.selectTime(0)}
                                                underlayColor={base.theme.colors.transparent}
                                                style={PatrollingReportStyles.radioView2}>
                                <View style={[PatrollingReportStyles.radioButtonView, {
                                    backgroundColor: this.state.isYesSelected ? base.theme.colors.primary : base.theme.colors.white
                                }]}/>
                            </TouchableHighlight>
                            <Text style={PatrollingReportStyles.selType}>Yesterday</Text>
                        </View>
                        <View style={PatrollingReportStyles.radioView1}>
                            <TouchableHighlight onPress={() => this.selectTime(1)}
                                                underlayColor={base.theme.colors.transparent}
                                                style={PatrollingReportStyles.radioView2}>
                                <View
                                    style={[PatrollingReportStyles.radioButtonView, {backgroundColor: this.state.isTodaySelected ? base.theme.colors.primary : base.theme.colors.white}]}/>
                            </TouchableHighlight>
                            <Text style={PatrollingReportStyles.selType}>Today</Text>
                        </View>
                    </View>
                    <View style={{alignSelf: 'flex-start', left: Platform.OS === 'ios' ? 44 : 55, top: 25}}>
                        <View style={PatrollingReportStyles.radioView_1}>
                            <TouchableHighlight onPress={() => this.selectTime(2)}
                                                underlayColor={base.theme.colors.transparent}
                                                style={PatrollingReportStyles.radioView2}>
                                <View style={[PatrollingReportStyles.radioButtonView, {
                                    backgroundColor: this.state.isMonthSelected ? base.theme.colors.primary : base.theme.colors.white
                                }]}/>
                            </TouchableHighlight>
                            <Text style={PatrollingReportStyles.selType}>Month Till Date</Text>
                        </View>
                    </View>
                </View>
                <View style={[PatrollingReportStyles.radioView, {alignItems: "center"}]}>
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
            PSPtrlSID: this.state.selectedSlotId,
            slotName: this.state.slotName,
            slotTime: this.state.slotTime
        };
        console.log("Detail:",detail)
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

    setSelectedPatrol(args, data) {
        let slotArr = this.state.slots;
        for (let i in slotArr) {
            if (slotArr[i].psSltName == args) {
                this.setState({
                    slotName: slotArr[i].psSltName,
                    slotTime: moment(slotArr[i].pssTime).format("hh:mmA") + " - " + moment(slotArr[i].pseTime).format("hh:mmA"),
                    isSelected: true,
                    selectedSlotId: slotArr[i].psPtrlSID
                })
            }
        }
    }
}

const mapStateToProps = state => {
    return {
        SelectedAssociationID: state.DashboardReducer.assId,
    }
};

export default connect(mapStateToProps)(PatrollingReport)