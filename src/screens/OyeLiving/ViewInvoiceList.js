/*
 * @Author: Sarthak Mishra
 * @Date: 2019-10-07 12:14:58
 * @Last Modified by: Anooj Krishnan G
 * @Last Modified time: 2019-12-12 15:06:21
 */


import React from 'react';
import {
    Image,
    Text,
    TouchableHighlight,
    View,
    ScrollView,
    FlatList,
    TouchableOpacity,
    TextInput,
    Alert,
    Platform, DatePickerIOS, DatePickerAndroid, Dimensions, SafeAreaView, Linking, StyleSheet, PermissionsAndroid
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import { connect } from 'react-redux';
import base from '../../base';
import { Dropdown } from 'react-native-material-dropdown';
import Modal from "react-native-modal";
import {
    heightPercentageToDP as hp, widthPercentageToDP,
    widthPercentageToDP as wp
} from "react-native-responsive-screen";
import SelectMultiple from 'react-native-select-multiple';
import moment from "moment";
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import ElevatedView from "react-native-elevated-view";
import EmptyView from "../../components/common/EmptyView";
import AddExpenseStyles from "./Expenses/AddExpenseStyles";
const { height, width } = Dimensions.get('screen');
import {captureRef, captureScreen} from "react-native-view-shot";
import Share from "react-native-share";
import PatrollingReportStyles from "../Patrolling/PatrollingReportStyles";
import RNFS from 'react-native-fs';
import RNImageToPdf from 'react-native-image-to-pdf';
import ProgressLoader from "rn-progress-loader";
import OSButton from "../../components/osButton/OSButton";
import DatePicker from "react-native-datepicker";
import axios from "axios";
import Style from "../Resident/Dashboard/Style";


var radio_props1 = [
    {label: 'Debit', value: 0 },
    {label: 'Credit', value: 1 }
];




const catsSource = {
    uri: "https://i.imgur.com/5EOyTDQ.jpg"
};



let dt = new Date();
dt.setDate(dt.getDate());
let _dt = dt;

let radio_props = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 }
];







class ViewInvoiceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            invoicesList:[],
            selectedInitialDate: new Date(),
            selectedEndDate: new Date(),
            minDate: new Date(),
            maxDate: moment(new Date()).format('DD-MM-YYYY'),
            todayDate: moment(new Date()).format('DD-MM-YYYY'),
        }
    }


    componentDidMount() {
       this.getInvoiceMethodsList()
    }
    async getInvoiceMethodsList() {
        //this.props.dashBoardReducer.assId,this.props.dashBoardReducer.uniID,
        //         this.props.userReducer.MyAccountID
        //14956,42167,14883
        let stat = await base.services.OyeLivingApi.getTheInvoicesOfResident(this.props.dashBoardReducer.assId,
            this.props.dashBoardReducer.uniID,this.props.userReducer.MyAccountID)
        console.log('RESPONSE_INVOICES_RESIDENT',stat)
        try {
            if (stat.success) {
                let invoicesList=stat.data.invoices;
                this.setState({
                    invoicesList:invoicesList
                })

            }} catch (error) {

            console.log('error', error)
        }
    }
    async getTheInvoicesByDates() {
        //this.props.dashBoardReducer.assId,this.props.dashBoardReducer.uniID,
        //         this.props.userReducer.MyAccountID

        let data={
            "FromDate"   : this.state.selectedInitialDate,
            "ToDate"     : this.state.selectedEndDate,
            "ASAssnID"     : this.props.SelectedAssociationID,
            "UNUnitID"   : this.props.dashBoardReducer.uniID,
            "ACAccntID"  :  this.props.userReducer.MyAccountID
        }
        let stat = await base.services.OyeLivingApi.getTheInvoicesByDateSelection(data)
        console.log('RESPONSE_INVOICES_RESIDENT',stat,data)
        try {
            if (stat.success) {
                let invoicesList=stat.data.invoices;
                this.setState({
                    invoicesList:invoicesList
                })

            } else if (stat.error.message){
                this.setState({
                    invoicesList:[]
                })
            }
        } catch (error) {

            console.log('error', error)
        }
    }



    listOfInvoices(item) {
        console.log('FLATLIST_ITEM_INVOICES',item)
        return (
            <TouchableHighlight underlayColor={'transparent'} onPress={()=>this.props.navigation.navigate('ViewInvoice',{item:item})}>
                <View style={Style.invoiceView}>
                    <View style={Style.invoiceSubView}>
                        <Text style={Style.invoiceNumberText}>
                            Invoice No. {item.item.inNumber}
                        </Text>
                        <Text style={Style.billText}>
                            <Text style={Style.rupeeIcon}>{'\u20B9'}</Text>
                            {item.item.inTotVal}
                        </Text>
                    </View>
                    <View style={Style.invoiceSubView}>

                        <Text style={Style.dueDate}>Invoice Date {moment(item.item.inGenDate,'YYYY-MM-DD').format('DD-MMM-YYYY')}</Text>
                        {/*<OSButton
                            height={'80%'}
                            width={'25%'}
                            borderRadius={15}
                            oSBBackground={
                                item.item.inPaid === 'NO'
                                    ? base.theme.colors.grey
                                    : base.theme.colors.primary
                            }
                            oSBText={item.item.inPaid === 'YES' ? 'Paid' : 'Pay Now'}
                            oSBTextSize={11}
                        />*/}
                        <TouchableOpacity onPress={()=>Alert.alert('Payment gateway not implemented')} >
                            <Text style={{color:item.item.inPaid === "No"
                                    ? base.theme.colors.red
                                    : base.theme.colors.green,fontSize:14}}>{item.item.inPaid === 'Yes' ? 'Paid' : 'Pay Now'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }



    render() {
        //[
        //             {
        //                 "inid": "fa723241-4ceb-4444-9d6f-2e6ff12ba45d",
        //                 "inNumber": "B10320203550",
        //                 "inGenDate": "2020-02-07T00:00:00",
        //                 "inTotVal": 4.0,
        //                 "inPath": "",
        //                 "unUnitID": 42167,
        //                 "asAssnID": 14956,
        //                 "indCreated": "2020-02-07T14:06:04.5366667",
        //                 "indUpdated": "0001-01-01T00:00:00",
        //                 "inIsActive": true,
        //                 "inDsCVal": 0.0,
        //                 "blBlockID": 14651,
        //                 "ineSent": false,
        //                 "inPaid": "No",
        //                 "fromDate": "0001-01-01T00:00:00",
        //                 "toDate": "0001-01-01T00:00:00",
        //                 "inDisType": "",
        //                 "inAmtPaid": 0.0,
        //                 "inCrFreq": "",
        //                 "invoiceDetails": [
        //                     {
        //                         "inid": "fa723241-4ceb-4444-9d6f-2e6ff12ba45d",
        //                         "idDesc": "Fixed Maintenance",
        //                         "idValue": 4.0,
        //                         "idApplTo": "Fixed Maintenance"
        //                     }
        //                 ],
        //                 "expenses": null,
        //                 "payment": null,
        //                 "acAccntID": 14883
        //             },
        //             {
        //                 "inid": "e621794d-a0f4-4701-b2f7-b1ef3c7f925a",
        //                 "inNumber": "B10320203606",
        //                 "inGenDate": "2020-02-07T00:00:00",
        //                 "inTotVal": 1004.0,
        //                 "inPath": "",
        //                 "unUnitID": 42167,
        //                 "asAssnID": 14956,
        //                 "indCreated": "2020-02-07T14:04:51.7966667",
        //                 "indUpdated": "0001-01-01T00:00:00",
        //                 "inIsActive": true,
        //                 "inDsCVal": 0.0,
        //                 "blBlockID": 14651,
        //                 "ineSent": false,
        //                 "inPaid": "No",
        //                 "fromDate": "0001-01-01T00:00:00",
        //                 "toDate": "0001-01-01T00:00:00",
        //                 "inDisType": "",
        //                 "inAmtPaid": 0.0,
        //                 "inCrFreq": "",
        //                 "invoiceDetails": [
        //                     {
        //                         "inid": "e621794d-a0f4-4701-b2f7-b1ef3c7f925a",
        //                         "idDesc": "One Time OnBoarding Fees",
        //                         "idValue": 1000.0,
        //                         "idApplTo": "B103"
        //                     },
        //                     {
        //                         "inid": "e621794d-a0f4-4701-b2f7-b1ef3c7f925a",
        //                         "idDesc": "Fixed Maintenance",
        //                         "idValue": 4.0,
        //                         "idApplTo": "Fixed Maintenance"
        //                     },
        //                     {
        //                         "inid": "e621794d-a0f4-4701-b2f7-b1ef3c7f925a",
        //                         "idDesc": "Fixed Maintenance",
        //                         "idValue": 4.0,
        //                         "idApplTo": "Fixed Maintenance"
        //                     }
        //                 ],
        //                 "expenses": null,
        //                 "payment": null,
        //                 "acAccntID": 14883
        //             }
        //         ]

        let invoiceList = this.state.invoicesList;
        return (
            <View style={{ height: hp('97'), width: wp('100'), backgroundColor: base.theme.colors.white, alignSelf: 'center' }}>
                <SafeAreaView style={{
                    height: '100%',
                    width: '100%',
                    alignItems: 'center',
                }}>
                    <View style={{
                        backgroundColor: '#fff',
                        height: hp('7%'),
                        width: Dimensions.get('screen').width,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        elevation: 2,
                        position: 'relative', flexDirection: 'row'
                    }}>
                        <View style={{
                            flex: 0.3,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: 2
                        }}>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('ResDashBoard')}
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
                                        source={require('../../../icons/back.png')}
                                        style={{
                                            alignItems: 'flex-start',
                                            justifyContent: 'center',
                                            // width: hp('3%'),
                                            // height: hp('3%'),
                                            marginTop: 5
                                        }}
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
                                style={{
                                    // width: wp('34%'),
                                    // height: hp('18%'),
                                    marginRight: hp('3%')
                                }}
                                source={require('../../../icons/OyespaceSafe.png')}
                            />
                        </View>
                        {/*<TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            // onPress={()=>this.shareInvoice(invoiceData)}
                            style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                resizeMode={'center'}
                                style={{ height: hp('3'), width: hp('3') }}
                                source={require('../../../icons/share.png')} />

                        </TouchableHighlight>*/}
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.titleOfScreen}> Invoices </Text>
                    </View>
                    <View style={{ height: '10%',
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        marginTop: 25,
                        marginBottom: 5,}}>
                            <Text style={{color:base.theme.colors.blue}}>From</Text>
                        <View style={{ width: '30%',
                            borderWidth: 0.5,
                            height: '40%',
                            borderColor: base.theme.colors.grey,alignItems:'center',justifyContent:'center'}}>
                            <DatePicker
                                style={{width: 120, alignItems: 'center'}}
                                date={this.state.selectedInitialDate}
                                mode="date"
                                placeholder="select date"
                                format="DD-MM-YYYY"
                                minDate={'20-2-2019'}
                                maxDate={this.state.todayDate}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                iconSource={require('../../../icons/calender.png')}
                                customStyles={{
                                    dateIcon: {
                                        right:2,
                                        alignSelf: 'center',
                                        marginLeft: 0,
                                        height: 20,
                                        width: 20
                                    },
                                    dateInput: {
                                        borderWidth: 0,
                                        color: base.theme.colors.black,
                                        height: 20,
                                        width: 20,

                                    }
                                }}
                                onDateChange={(date) => {
                                    this.setState({selectedInitialDate: date})
                                }}
                            />
                        </View>
                        <Text style={{color:base.theme.colors.blue}}>To</Text>

                        <View style={{ width: '30%',
                            borderWidth: 0.5,
                            height: '40%',
                            borderColor: base.theme.colors.grey,alignItems:'center',justifyContent:'center'}}>
                            <DatePicker
                                style={{width: 120,}}
                                date={this.state.selectedEndDate}
                                mode="date"
                                placeholder="select date"
                                format="DD-MM-YYYY"
                                minDate={this.state.selectedInitialDate}
                                maxDate={this.state.maxDate}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                iconSource={require('../../../icons/calender.png')}
                                customStyles={{
                                    dateIcon: {
                                        //left: 2,
                                        alignSelf: 'center',
                                        marginLeft: 0,
                                        height: 20,
                                        width: 20,
                                        right:2
                                    },
                                    dateInput: {
                                        borderWidth: 0,
                                        color: base.theme.colors.black

                                    }
                                }}
                                onDateChange={(date) => {
                                    this.setState({selectedEndDate: date})
                                }}
                            />
                        </View>
                        <OSButton
                            height={'40%'}
                            width={'15%'}
                            borderRadius={20}
                            oSBBackground={base.theme.colors.primary}
                            oSBText={'Get'}
                            oSBTextSize={11}
                            onButtonClick={()=>this.getTheInvoicesByDates()}
                        />
                    </View>
                    {invoiceList.length > 0 ?
                        <ScrollView style={Style.scrollView}>
                            <FlatList
                                data={invoiceList}
                                extraData={this.state}
                                style={Style.inVoiceFlatList}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={(item) => this.listOfInvoices(item)}
                            />
                        </ScrollView>
                        :
                        <View style={Style.noDataView}>
                            <Text style={Style.noDataMsg}>No Invoices</Text>
                        </View>
                    }


                </SafeAreaView>

            </View>
        )
    }





}

const mapStateToProps = state => {
    return {
        oyeURL: state.OyespaceReducer.oyeURL,
        champBaseURL: state.OyespaceReducer.champBaseURL,
        oye247BaseURL: state.OyespaceReducer.oye247BaseURL,
        oyeBaseURL: state.OyespaceReducer.oyeBaseURL,
        userReducer: state.UserReducer,
        SelectedAssociationID: state.DashboardReducer.assId,
        dashBoardReducer: state.DashboardReducer,
        assId:state.DashboardReducer.assId ,
       uniID: state.DashboardReducer.uniID,

    }
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: '#fff'
    },
    buttonView: {
        width: '17%',
        justifyContent: 'center',
        height: '90%',
        paddingTop: 3,
        alignItems: 'center'
    },
    backButton: {
        height: '30%',
        width: '30%'
    },
    logoView: {
        height: 40,
        width: widthPercentageToDP('60%'),
        backgroundColor: base.theme.colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20
    },
    logo: {
        height: 50,
        width: 100,
        alignSelf: 'center'
    },
    scheduleReport: {
        borderWidth: 1,
        height: '40%',
        width: widthPercentageToDP('15%'),
        borderRadius: 10,
        marginRight: widthPercentageToDP('35%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'orange'
    },
    scheduleTextStyle: {
        color: 'orange',
        textAlign: 'center',
        width: widthPercentageToDP('20%'),
        fontFamily: base.theme.fonts.medium
    },
    reportImage: {height: '50%', width: widthPercentageToDP('20%')},

    viewStyle: {
        backgroundColor: '#fff',
        height: hp('7%'),
        width: Dimensions.get('screen').width,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
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

    titleOfScreen: {
        marginTop: hp('1.6%'),
        textAlign: 'center',
        fontSize: hp('2%'),
        fontWeight: 'bold',
        color: '#ff8c00',
        marginBottom: hp('1.6%')
    }
});


export default (connect(mapStateToProps)(ViewInvoiceList));
