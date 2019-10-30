/*
 * @Author: Sarthak Mishra
 * @Date: 2019-10-07 12:14:58
 * @Last Modified by: Sarthak Mishra
 * @Last Modified time: 2019-10-29 15:12:28
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
    heightPercentageToDP as hp,
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







class Invoices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blockList: [],
            blockListAdd: [],
            isLoading: false,
            selectedBlock: 'Select Block',
            blockId: '',
            isModalVisible: false,
            collapse1: false,
            invoiceNumber: "",
            expenseCollapse: false,
            invoiceDateCollapse: false,
            dueDateCollapse: false,
            invoiceList: [],
            isDiscountModalOpen: false,
            dInvoiceNumber: "",
            dAmount: 110,
            reason: "",
            selectedVal: {},
            showDetailedInvoice: false,
            invoiceDetailedArr: [],
            userDetail: {},
            value: {
                format: "png",
                quality: 0.9,
                result: "data-uri",
                snapshotContentContainer: false
            },
            previewSource: catsSource,
            error: null,
            res: null,
            isCapturing: false,
            invoiceListByDates:[],
            fromDate:'',
            toDate:'',
            invoiceListAll:[],
            amountStart:'0',
            amountEnd:'0',
            isDisEnabled:false,
            assDetail:{},
            isPermitted:false
        }
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            this.getAndroidPermissions()
        } else {
            this.setState({
                isPermitted: true
            })
        }
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            () =>  {console.log('Get the All ApIs');
                this.setState({isLoading:true})
                this.getBlockList();
                this.getAssiciationDetail();
            this.updateValues()}
        );
    }
    updateValues(){
        let self=this;
        self.setState({
            selectedBlock: 'Select Block',
            blockId: '',
            isModalVisible: false,
            invoiceList: [],
        })
    }
    getAndroidPermissions() {
        let that = this;

        async function requestExternalWritePermission() {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    that.setState({isPermitted: true});
                } else {
                    alert('WRITE_EXTERNAL_STORAGE permission denied');
                }
            } catch (err) {
                alert('Write permission err', err);
                console.warn(err);
            }
        }

        //Calling the External Write permission function
        requestExternalWritePermission();
    }

    componentWillUnmount() {
        this.didFocusListener.remove();
    }


    /*componentDidMount() {
        this.getBlockList();
        this.getAssiciationDetail()
    }*/


    async getAssiciationDetail(){
        let self = this;
        let assId = self.props.userReducer.SelectedAssociationID;
        let stat = await base.services.OyeLivingApi.getAssDetail(assId);
        console.log("Stat in ass Deyai:",stat)
        try{
            if(stat.success){
                self.setState({
                    assDetail:stat.data.association
                })
            }
        }catch(e){
            console.log(e)
        }
    }

    async getBlockList() {
        let self = this;
        let associationId = self.props.userReducer.SelectedAssociationID;

        let stat = await base.services.OyeLivingApi.getTheListOfBlocksByAssociation(associationId);
        console.log("Stat:", stat);
        try {
            if (stat.success && stat.data.blocksByAssoc.length !== 0) {
                let blockList = [];
                let data = stat.data.blocksByAssoc;

                for (let i = 0; i < data.length; i++) {
                    blockList.push({
                        value: data[i].blBlkName,
                        details: data[i]
                    })
                }
                this.setState({
                    blockList: blockList,
                    blockListAdd: blockList
                })
            }
        } catch (error) {

            this.setState({
                isLoading: false
            });
            console.log('error', error)
        }


    }


    async getInvoiceList(val, index) {
        let self = this;
        let blockId = self.state.blockList[index].details.blBlockID;
        let associationId = self.props.userReducer.SelectedAssociationID;
        self.setState({
            isLoading: true,
            selectedBlock: val,
            blockId: blockId,
            getIndex: index
        });
        console.log("Selected Block Data:", val, index);
        let stat = await base.services.OyeLivingApi.getInvoiceData(associationId, blockId);
        console.log("Stat111111:", stat);
        try {
            if (stat.success && stat.data.invoices.length !== 0) {
                self.setState({
                   invoiceList: stat.data.invoices,
                    invoiceListAll:stat.data.invoices
                });
            }
            else {
                self.setState({
                    invoiceList: stat.data.invoices,
                    invoiceListAll:stat.data.invoices
                });
            }

        } catch (error) {
            console.log(error)
        }
    }


    onModalOpen() {
        this.setState({
            isModalVisible: !this.state.isModalVisible,
            collapse1: true
        });
    }


    render() {
        console.log("State of invoices@@@@:", this.state.invoiceList)
        return (
            <View style={{
                height: '100%',
                width: '100%',
                backgroundColor: this.state.isModalVisible ? 'rgba(52, 52, 52, 0.05)' : base.theme.colors.white
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: wp('95'),
                    alignSelf: 'center'
                }}>
                    <Dropdown
                        value={this.state.selectedBlock}
                        labelFontSize={18}
                        labelPadding={-5}
                        placeHolder={'Selected Block'}
                        baseColor="rgba(0, 0, 0, 1)"
                        data={this.state.blockList}
                        containerStyle={{ width: wp('50') }}
                        textColor={base.theme.colors.black}
                        inputContainerStyle={{
                            borderBottomColor: base.theme.colors.primary,
                            borderBottomWidth: 1,
                        }}
                        dropdownOffset={{ top: 10, left: 0 }}
                        dropdownPosition={-5}
                        rippleOpacity={0}
                        onChangeText={(value, index) => {
                            this.getInvoiceList(value, index)
                        }}
                    />
                    <TouchableOpacity
                        underlayColor={base.theme.colors.transparent}
                        onPress={() => this.state.selectedBlock == '' || this.state.selectedBlock=='Select Block' ? alert('Please select block to Apply filters') : this.onModalOpen()}
                        style={{
                            marginTop: 5,
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40'),
                            borderBottomWidth: 1,
                            justifyContent: 'space-between',
                            borderBottomColor: base.theme.colors.primary,
                        }}
                    >
                        <Text style={{ fontSize: 16, marginBottom: 5 }}>Filter</Text>
                        <Image
                            resizeMode={'contain'}
                            style={{
                                height: 20,
                                width: 20,
                                tintColor: base.theme.colors.primary,
                                alignSelf: 'center',
                                marginBottom: 5
                            }}
                            source={require('../../../icons/filter.png')}
                        />
                    </TouchableOpacity>
                </View>
                {this.state.invoiceList.length !== 0 ?
                    <FlatList
                        keyExtractor={(item, index) => index.toFixed()}
                        data={this.state.invoiceList}
                        showsVerticalScrollIndicator={false}
                        renderItem={(item, index) => this._renderInvoiceList(item, index)}
                        extraData={this.state}
                        /> :
                    <View style={{ height: hp('70'), width: wp('100'), justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: base.theme.colors.primary, fontSize: hp('2'), fontFamily: base.theme.fonts.medium }}>No Invoices to display</Text>
                    </View>}
                {this.state.isModalVisible ?
                    <View style={{
                        position: 'absolute', height: hp('40'),
                        width: wp('60'), backgroundColor: base.theme.colors.white,
                        alignSelf: 'flex-end',
                        marginTop: 40
                    }}>

                        <ScrollView style={{ backgroundColor: base.theme.colors.white }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                height: hp('5'),
                                width: wp('59.5'),
                                backgroundColor: base.theme.colors.shadedWhite,
                                alignItems: 'center',
                                alignSelf: 'center',
                                padding: 10
                            }}>
                                <Text style={{ fontSize: 14, color: base.theme.colors.black }}>Filter by:</Text>
                                <TouchableHighlight
                                    underlayColor={base.theme.colors.transparent}
                                    onPress={() => this.clearTheFilters(this.state.isTabSelected, this.state.expensesAllList)}
                                >
                                    <Text style={{ color: base.theme.colors.blue }}>Clear All</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    underlayColor={base.theme.colors.transparent}
                                    onPress={() => this.validationFilters()}
                                >
                                    <Text style={{ color: base.theme.colors.primary }}>Apply</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={{
                                padding: 15,
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                width: wp('59.5'),
                                backgroundColor: base.theme.colors.white,
                                alignSelf: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: base.theme.colors.lightgrey,
                            }}>
                                <TouchableHighlight
                                    underlayColor={base.theme.colors.transparent}
                                    onPress={() => {
                                        this.setState({ collapse1: !this.state.collapse1 })
                                    }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Text style={{ fontSize: 16, color: base.theme.colors.black }}>Invoice Number</Text>
                                        <Image
                                            resizeMode={'contain'}
                                            style={{
                                                height: 15,
                                                width: 15,
                                                alignSelf: 'center',
                                                tintColor: base.theme.colors.black,
                                            }}
                                            source={!this.state.collapse1 ? require('../../../icons/show_less.png') : require('../../../icons/show_more.png')}
                                        />
                                    </View>
                                </TouchableHighlight>
                                <Collapsible collapsed={this.state.collapse1}>
                                    <TextInput
                                        onChangeText={(text) => this.setState({ invoiceNumber: text })}
                                        value={this.state.invoiceNumber}
                                        style={{
                                            width: wp('50'),
                                            fontSize: 12,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: hp('4'),
                                            paddingTop: 10,
                                            marginTop: hp('2'),
                                            borderColor: base.theme.colors.greyHead,
                                            borderWidth: 1
                                        }}
                                        placeholderTextColor={base.theme.colors.grey}
                                    />
                                </Collapsible>
                            </View>
                            <View style={{
                                padding: 15,
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                width: wp('59.5'),
                                backgroundColor: base.theme.colors.white,
                                alignSelf: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: base.theme.colors.lightgrey
                            }}>
                                <TouchableHighlight
                                    underlayColor={base.theme.colors.transparent}
                                    onPress={() => this.setState({ amountCollapse: !this.state.amountCollapse })}>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Text style={{ fontSize: 16, color: base.theme.colors.black }}>Current Invoice Amount</Text>
                                        <Image
                                            resizeMode={'contain'}
                                            style={{ height: hp('4'), width: wp('4'), tintColor: base.theme.colors.black, }}
                                            source={!this.state.amountCollapse ? require('../../../icons/show_less.png') : require('../../../icons/show_more.png')}
                                        />
                                    </View>
                                </TouchableHighlight>
                                <Collapsible collapsed={this.state.amountCollapse}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 13, marginRight: 2 }}>Between</Text>
                                        <TextInput
                                            onChangeText={(value) =>{
                                                let num = value.replace(/[^0-9].[^0-9]{1,2}/g,  '');
                                                if (isNaN(num)) {
                                                    // Its not a number
                                                } else {
                                                    this.setState({amountStart:num})
                                                }}}
                                           // onChangeText={(text) => this.setState({ amountStart: text })}
                                            value={this.state.amountStart}
                                            style={{
                                                width: 60,
                                                fontSize: 12,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: 20,
                                                paddingTop: -10,
                                                paddingBottom: -10,
                                                borderColor: base.theme.colors.greyHead,
                                                borderWidth: 1
                                            }}
                                            placeholderTextColor={base.theme.colors.grey}
                                            keyboardType={'phone-pad'}
                                        />
                                        <Text style={{ fontSize: 13, marginRight: 2, marginLeft: 2 }}>To</Text>
                                        <TextInput
                                            onChangeText={(value) =>{
                                                let num = value.replace(/[^0-9].[^0-9]{1,2}/g,  '');
                                                if (isNaN(num)) {
                                                    // Its not a number
                                                } else {
                                                    this.setState({amountEnd:num})
                                                }}}
                                            //onChangeText={(text) => this.setState({ amountEnd: text })}
                                            value={this.state.amountEnd}
                                            style={{
                                                width: 60,
                                                fontSize: 12,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: 20,
                                                paddingTop: -10,
                                                paddingBottom: -10,
                                                borderColor: base.theme.colors.greyHead,
                                                borderWidth: 1
                                            }}
                                            placeholderTextColor={base.theme.colors.grey}
                                            keyboardType={'phone-pad'}
                                        />
                                    </View>
                                </Collapsible>
                            </View>
                            <View style={{
                                padding: 15,
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                width: wp('59.5'),
                                backgroundColor: base.theme.colors.white,
                                alignSelf: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: base.theme.colors.lightgrey
                            }}>
                                <TouchableHighlight
                                    underlayColor={base.theme.colors.transparent}
                                    onPress={() => this.setState({ invoiceDateCollapse: !this.state.invoiceDateCollapse })}>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Text style={{ fontSize: 16, color: base.theme.colors.black }}>Invoice Date</Text>
                                        <Image
                                            resizeMode={'contain'}
                                            style={{ height: hp('4'), width: wp('4'), tintColor: base.theme.colors.black, }}
                                            source={this.state.invoiceDateCollapse ? require('../../../icons/show_less.png') : require('../../../icons/show_more.png')}
                                        />
                                    </View>
                                </TouchableHighlight>
                                <Collapsible collapsed={!this.state.invoiceDateCollapse}>
                                    <TouchableHighlight
                                        underlayColor={base.theme.colors.transparent}
                                        onPress={() => this.openCalender(0)}>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: hp('3') }}>
                                            <Text style={{ fontSize: 15, color: base.theme.colors.grey, width: 80 }}>From Date</Text>
                                            <TouchableOpacity onPress={() => this.openCalender(0)}>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    width: 140,
                                                    height: 20,
                                                    alignItems: 'center'
                                                }}>
                                                    <View style={{
                                                        width: 80,
                                                        height: 20,
                                                        borderWidth: 1,
                                                        borderColor: base.theme.colors.lightgrey,
                                                        alignItems: 'center'
                                                    }}>
                                                        <Text style={{ width: 80, }}>{this.state.fromDate == '' ? this.state.fromDate : moment(this.state.fromDate).format('DD-MM-YYYY')}</Text>
                                                    </View>
                                                    <Image
                                                        resizeMode={'contain'}
                                                        style={{ height: hp('6'), width: wp('6'), left: wp('5') }}
                                                        source={require('../../../icons/cal.png')}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableOpacity
                                        underlayColor={base.theme.colors.transparent}
                                        onPress={() => this.openCalender(0)}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                            <Text style={{ fontSize: 15, color: base.theme.colors.grey, width: 80, }}>To Date</Text>
                                            <TouchableOpacity onPress={() => this.openCalender(1)}>
                                                <View style={{
                                                    flexDirection: 'row', width: 140, height: 20,
                                                    alignItems: 'center'
                                                }}>
                                                    <View style={{
                                                        width: 80,
                                                        height: 20,
                                                        borderWidth: 1,
                                                        borderColor: base.theme.colors.lightgrey,
                                                        alignItems: 'center'
                                                    }}>
                                                        <Text style={{ width: 80, }}>{this.state.toDate === '' ? this.state.toDate : moment(this.state.toDate).format('DD-MM-YYYY')}</Text>
                                                    </View>
                                                    <Image
                                                        resizeMode={'contain'}
                                                        style={{ height: hp('6'), width: wp('6'), left: wp('5') }}
                                                        source={require('../../../icons/cal.png')}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                </Collapsible>
                            </View>
                        </ScrollView>

                    </View>

                    : <View />}
                <ScrollView>

                    <Modal
                        onBackdropPress={() => this.setState({ isDiscountModalOpen: false })}
                        isVisible={this.state.isDiscountModalOpen}>
                        {this.renderDiscountModal()}
                    </Modal>
                    <Modal
                        coverScreen={true}
                        backdropColor={base.theme.colors.black}
                        onBackdropPress={() => this.setState({ showDetailedInvoice: false })}
                        isVisible={this.state.showDetailedInvoice}
                    >
                        {this._renderDetailedView()}
                    </Modal>
                </ScrollView>
                {/*<ProgressLoader
                    isHUD={true}
                    isModal={true}
                    visible={this.state.isLoading}
                    color={base.theme.colors.primary}
                    hudColor={"#FFFFFF"}
                />*/}
                {(Platform.OS === 'ios') ? this.openIOSCalender() : <View/>}
            </View>
        )
    }

    closeInvoiceScreen() {
        this.setState({ showDetailedInvoice: false, })
    }

    snapshot = refname => () =>
        (refname
                ? captureRef(this.refs[refname], this.state.value)
                : captureScreen(this.state.value)
        )
            .then(
                res =>
                    new Promise((success, failure) =>
                        Image.getSize(res, (width, height) => (
                            console.log(res, width, height), success(res)
                        ), failure))).then(res => this.setState({
                error: null, res, previewSource: {
                    uri: this.state.value.result === "base64" ? "data:application/pdf" + ";base64," + res : res
                }
            }, () => this.share())
        )
            .catch(
                error => (
                    console.warn(error),
                        this.setState({error, res: null, previewSource: null})
                )
            );

    share() {
        var image_data = this.state.previewSource.uri.split('data:image/png;base64,');
        console.log("Image:",this.state.previewSource.uri)
            
            
            image_data = image_data[1]//this.state.previewSource.uri;
            console.log("Image Data:",image_data)

            var path = RNFS.ExternalStorageDirectoryPath + '/image.png';
            RNFS.writeFile(path, image_data, 'base64')
                .then((success) => {
                    console.log('FILE WRITTEN!',path);
                    this.convertImaheToPdf(path);
                })
                .catch((err) => {
                    console.log(err.message);
                });
    }

    async convertImaheToPdf(path){
        try {
            // RNFS.exists(path).then(exists => {
            //     if (exists) {
                let updatedpath = path
                    const options = {
                        imagePaths: [updatedpath],
                        name: 'PDFName.pdf',
                     //   quality: .7, // optional compression paramter
                    };
                    console.log(updatedpath)
                    const pdf = await RNImageToPdf.createPDFbyImages(options);
                    console.log(pdf)
                    console.log(pdf.filePath)

                    var path = pdf.filePath;
                    var rnd = this.state.selectedVal.inNumber
                    var path1 = RNFS.ExternalStorageDirectoryPath + '/invoice-'+rnd+".pdf";

                    RNFS.copyFile(path, path1)
                  .then((success) => {
                    console.log('FILE WRITTEN!',path);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        
            //     }
            // })

            
            console.log(options);
        } catch(e) {
            console.log(e);
        }
    }


    _renderDetailedView() {
        let invoiceData = this.state.selectedVal;
        let invoiceBreakUp = this.state.invoiceDetailedArr;
        let userDetail = this.state.userDetail;
        let discObjArr = [{
            idApplTo: "All Sold Owner Occupied Units",
            idDesc: "Discount",
            idValue: invoiceData.inDsCVal,
            inid: "0",
        }];
        console.log("Invoice Data:", discObjArr, userDetail);
        let newArr = [...invoiceBreakUp, ...discObjArr];

        return (
            <View style={{ height: hp('100'), width: wp('100'), backgroundColor: base.theme.colors.white, alignSelf: 'center' }}>
                <SafeAreaView style={{
                    height: '110%',
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
                                onPress={() => this.closeInvoiceScreen()}
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
                                            width: hp('3%'),
                                            height: hp('3%'),
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
                                    width: wp('34%'),
                                    height: hp('18%'),
                                    marginRight: hp('3%')
                                }}
                                source={require('../../../icons/OyespaceSafe.png')}
                            />
                        </View>
                        <TouchableHighlight
                        underlayColor={base.theme.colors.transparent}
                        onPress={()=>this.shareInvoice(invoiceData)}
                        style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                resizeMode={'center'}
                                style={{ height: hp('3'), width: hp('3') }}
                                source={require('../../../icons/share.png')} />

                        </TouchableHighlight>
                    </View>
                    <View ref={'view'} style={{backgroundColor: '#FFFFFF'}} >
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: 10,
                        paddingBottom: 20,
                    }}>
                        <Text
                            style={{
                                fontSize: 20,
                                color: base.theme.colors.primary
                            }}>View Invoice</Text>
                    </View>

                    <View style={{ height: hp('3'), width: wp('95'), alignSelf: 'center', borderWidth: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Text style={{
                            fontSize: 17,
                            color: base.theme.colors.black
                        }}>{this.props.dashBoardReducer.selectedDropdown}</Text>
                        <Text style={{
                            fontSize: 17,
                            color: base.theme.colors.black
                        }}>{this.props.dashBoardReducer.selectedDropdown1}</Text>
                    </View>
                    <View style={{ height: hp('5'), width: wp('100'), justifyContent: 'center', alignItems: 'center', backgroundColor: base.theme.colors.primary, marginTop: 10 }}>
                        <Text style={{ fontFamily: base.theme.fonts.medium, fontSize: hp('2'), color: base.theme.colors.white }}>Invoice</Text>
                    </View>
                    <View style={{ height: hp('5'), width: wp('100'), justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', backgroundColor: base.theme.colors.white, marginTop: 10, borderBottomWidth: 1, borderBottomColor: base.theme.colors.primary }}>
                        <Text style={{ fontFamily: base.theme.fonts.medium, fontSize: hp('2'), color: base.theme.colors.black }}>Invoice Date: <Text style={{ fontFamily: base.theme.fonts.light, fontSize: hp('2'), color: base.theme.colors.black }}>{moment(invoiceData.inGenDate).format("DD-MM-YYYY")}</Text></Text>
                        <Text style={{ fontFamily: base.theme.fonts.medium, fontSize: hp('2'), color: base.theme.colors.black }}>Invoice No. <Text style={{ fontFamily: base.theme.fonts.light, fontSize: hp('2'), color: base.theme.colors.black }}>{(invoiceData.inNumber)}</Text></Text>
                    </View>
                    <View style={{ height: hp('9'), width: wp('100'), borderBottomWidth: 0, borderBottomColor: base.theme.colors.primary }}>
                        <View style={{ height: hp('3'), width: wp('95'), justifyContent: 'space-between', flexDirection: 'row', alignSelf: 'center', alignItems: 'center', backgroundColor: base.theme.colors.white, marginTop: 10, borderBottomWidth: 0, borderBottomColor: base.theme.colors.primary }}>
                            <Text style={{ fontFamily: base.theme.fonts.medium, fontSize: hp('2'), color: base.theme.colors.black }}>To: {userDetail.uofName} {userDetail.uolName}</Text>
                            <Text style={{ fontFamily: base.theme.fonts.medium, fontSize: hp('2'), color: base.theme.colors.black }}>Due Date</Text>
                        </View>
                        <View style={{ height: hp('2'), width: wp('95'), justifyContent: 'space-between', alignSelf: 'center', flexDirection: 'row', alignItems: 'flex-start', backgroundColor: base.theme.colors.white, marginTop: 0 }}>
                            <Text numberOfLines={1} style={{ fontFamily: base.theme.fonts.medium, fontSize: hp('2'), color: base.theme.colors.black, width: wp('50') }}>{userDetail.uoEmail}</Text>
                            <Text style={{ fontFamily: base.theme.fonts.medium, fontSize: hp('2'), color: base.theme.colors.red }}>{moment().format('DD-MM-YYYY')}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', width: wp('100'), height: hp('5'), alignSelf: 'center', alignItems: 'center', backgroundColor: base.theme.colors.grey }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: wp('85'), height: hp('5'), borderWidth: 0, alignItems: 'center', alignSelf: 'center' }}>
                            <Text>Sr. No.</Text>
                            <Text>Description</Text>
                            <Text>Amount</Text>
                        </View>
                    </View>
                    <View style={{ height: hp('20') }}>
                        <FlatList
                            keyExtractor={(item, index) => index.toString()}
                            data={newArr} renderItem={(item, index) => this._renderDes(item, index, newArr)} />
                    </View>
                    <View style={{ height: hp('9'), width: wp('100'), backgroundColor: "#ffffff" }}>
                        <View style={{ alignItems: 'flex-end', width: wp('100'), borderBottomWidth: 1, borderBottomColor: base.theme.colors.grey, height: hp('3.3') }}>
                            <View style={{ width: wp('50'), borderWidth: 0, justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center', right: hp('2') }}>
                                <Text style={{ color: base.theme.colors.primary }}>Sub Total </Text>
                                <Text style={{ color: base.theme.colors.primary }}>₹{invoiceData.inTotVal - invoiceData.inDsCVal}</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'flex-end', width: wp('100'), borderBottomWidth: 1, borderBottomColor: base.theme.colors.grey, height: hp('3.3') }}>
                            <View style={{ width: wp('45'), borderWidth: 0, justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center', right: hp('2') }}>
                                <Text style={{ color: base.theme.colors.primary }}>Tax </Text>
                                <Text style={{ color: base.theme.colors.primary }}>₹0</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'flex-end', width: wp('100'), borderBottomWidth: 0, borderBottomColor: base.theme.colors.grey, height: hp('3.3') }}>
                            <View style={{ width: wp('53'), borderWidth: 0, justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center', right: hp('2') }}>
                                <Text style={{ color: base.theme.colors.primary }}>Total Due </Text>
                                <Text style={{ color: base.theme.colors.primary }}>₹{invoiceData.inTotVal - invoiceData.inDsCVal}</Text>
                            </View>
                        </View>
                        <View>

                        </View>
                    </View>
                    <View style={{ height: hp('5'), width: wp('100'), backgroundColor: '#e1e1e1', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ width: wp('85'), alignItems: 'center', marginTop: hp('0'), flexDirection: 'row', alignSelf: 'center', left: hp('3') }}>
                            <Text style={{ fontFamily: base.theme.fonts.medium, fontSize: hp('2'), color: base.theme.colors.black }}>Total Due: </Text>
                            <Text style={{ fontFamily: base.theme.fonts.bold, fontSize: hp('2'), color: base.theme.colors.black }}>₹{invoiceData.inTotVal - invoiceData.inDsCVal} only</Text>
                        </View>
                        <View style={{ height: hp('4'), borderRadius: hp('2'), width: wp('20'), backgroundColor: base.theme.colors.primary, right: hp('5'), justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontFamily: base.theme.fonts.medium, fontSize: hp('2'), color: base.theme.colors.white }}>Pay Now</Text>
                        </View>     
                    </View>
                    <View style={{ height: hp('12'), width: wp('86'), justifyContent: 'flex-start', backgroundColor: base.theme.colors.white, marginTop: 10 }}>
                        <Text style={{ fontFamily: base.theme.fonts.medium, fontSize: hp('2'), color: base.theme.colors.red }}>Due upon receipt</Text>
                        <Text style={{ fontFamily: base.theme.fonts.bold, fontSize: hp('2'), color: base.theme.colors.black }}>Anesh Association</Text>
                        <Text style={{ fontFamily: base.theme.fonts.medium, fontSize: hp('2'), color: base.theme.colors.black,marginTop:hp('1') }}>Tel:- {this.props.userReducer.MyMobileNumber}</Text>
                        <Text style={{ fontFamily: base.theme.fonts.medium, fontSize: hp('2'), color: base.theme.colors.black }}>{this.state.assDetail.asCity} {this.state.assDetail.asCountry}</Text>
                    </View>
                    <View style={{width:wp('86'),height:hp('10'),borderWidth:0,alignSelf:'center',alignItems:'center',flexDirection:'row',justifyContent:'space-between'}}>
                    <TouchableHighlight underlayColor={base.theme.colors.transparent}  onPress={this.snapshot("view")} style={{ height: hp('3'), borderRadius: hp('5'), width: wp('25'), backgroundColor: base.theme.colors.primary,alignSelf:'flex-start', justifyContent: 'center',alignItems:'center' }}>
                        <Text style={{ fontFamily: base.theme.fonts.medium, fontSize: hp('1.5'), color: base.theme.colors.white }}>Print Invoice</Text>
                    </TouchableHighlight>
                    <View style={{ height: hp('5'),width: wp('30'),alignSelf:'flex-start', justifyContent: 'center',alignItems:'center',flexDirection:'column' }}>
                    <Image
                        style={{borderWidth:1,bottom:hp('5')}}
                        resizeMode={'contain'}
                        source={require('../../../icons/logo_QR.png')} />
                        <Text style={{ fontFamily: base.theme.fonts.medium, fontSize: hp('1.5'), color: base.theme.colors.blue,bottom:hp('6') }}>Powered By Oyeliving</Text>
                    </View>
                    </View> 
                    </View>
                </SafeAreaView>
            </View>
        )
    }

    _renderDes(item, index, newArr) {
        let billDetail = item.item;
        let arrLength = newArr.length;
        let itemIndex = item.index;
        let isLastItem = itemIndex === arrLength - 1;
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: wp('100'), height: hp('4'), borderBottomWidth: 1, borderBottomColor: base.theme.colors.grey, alignSelf: 'center', alignItems: 'center' }}>
                <View style={{ borderWidth: 0, width: wp('8'), alignSelf: 'center', right: 0 }}>
                    <Text style={{ textAlign: 'center' }}>{item.index + 1}</Text>
                </View>
                <View style={{ borderWidth: 0, width: wp('30'), alignSelf: 'center', left: hp('3') }}>
                    <Text style={{ borderWidth: 0, textAlign: 'center' }}>{billDetail.idDesc}</Text>
                </View>
                <View style={{ borderWidth: 0, width: wp('25'), alignSelf: 'center', left: hp('2') }}>
                    <Text style={{ textAlign: 'center' }}>{isLastItem ? "(-)" : "(+)"} ₹{billDetail.idValue}</Text>
                </View>
            </View>
        )
    }

    onChangeText(param, val) {
        if (param === 0) {
            this.setState({ dAmount: val })
        } else if (param === 1) {
            this.setState({ reason: val })
        }
    }

    async updateDiscVal() {
        let self = this;
        let detail = {
            "INID": self.state.selectedVal.inid,
            "IDDesc": self.state.reason === undefined ? "" : self.state.reason,
            "INDsCVal": self.state.dAmount,
            "INDisType"  : self.state.isDisEnabled
        };
        console.log("Detil:", detail);
        let stat = await base.services.OyeLivingApi.updateDiscVal(detail);
        console.log("Stat in disc val update:", stat)


    }

    setVal(param){
        console.log("Val:",param)
            this.setState({isDisEnabled:param===0?"Debit":"Credit"})
    }

    renderDiscountModal() {
        console.log(("Selected Invoice:", this.state.selectedVal));
        let invoiceDetail = this.state.selectedVal;
        return (
            <View style={{ height: hp('60'), width: wp('80'), alignSelf: 'center', backgroundColor: base.theme.colors.white }}>
                <TouchableHighlight
                    underlayColor={base.theme.colors.transparent}
                    onPress={() => this.setState({ isDiscountModalOpen: false })}
                    style={{
                        backgroundColor: base.theme.colors.white,
                        height: hp('4.5'), width: hp('4.5'),
                        borderRadius: hp('2'), position: "relative",
                        justifyContent: 'center',
                        alignItems: 'center',
                        left: 10,
                        bottom: 20, alignSelf: 'flex-end'
                    }}>
                    <Image
                        style={{ tintColor: base.theme.colors.red }}
                        source={require('../../../icons/close_btn1.png')} />
                </TouchableHighlight>

                <View style={{ height: hp('5'), width: wp('80'), justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Text style={{ fontFamily: base.theme.fonts.medium, fontSize: hp('2'), color: base.theme.colors.primary }}>Discount Value</Text>
                </View>
                <View style={{ height: hp('5'), width: wp('80'), justifyContent: 'center', alignItems: 'center', backgroundColor: base.theme.colors.primary }}>
                    <Text style={{ fontFamily: base.theme.fonts.medium, fontSize: hp('2'), color: base.theme.colors.white }}>Invoice Details</Text>
                </View>
                <View style={{width:wp('70'),alignSelf:'center',borderWidth:0,alignItems:'center'}}>
                <RadioForm
                    radio_props={radio_props1}
                        initial={0}
                        formHorizontal={true}
                        labelHorizontal={true}
                        buttonColor={base.theme.colors.primary}
                        selectedButtonColor={base.theme.colors.primary}
                        radioStyle={{ paddingRight: 20,marginTop:5 }}
                        animation={true}
                        onPress={(value) => {this.setVal(value)}}
                    />
                    </View>
                <EmptyView height={hp('2')} />
                <View style={{ height: hp('30'), width: wp('70'), alignSelf: 'center', borderWidth: 0 }}>
                    <Text>Invoice Number<Text style={{ color: base.theme.colors.primary }}>*</Text></Text>
                    <Text style={{ width: wp('70'), borderBottomWidth: 0.5, height: hp('3'), marginTop: 10, color: base.theme.colors.black }}>{invoiceDetail.inNumber}</Text>
                    <Text style={{ marginTop: hp('2') }}>Discounted Amount<Text style={{ color: base.theme.colors.primary }}>*</Text></Text>
                    <TextInput
                        placeholder={`${invoiceDetail.inDsCVal}`}
                        onChangeText={(text) => this.onChangeText(0, text)}
                        value={this.state.dAmount}
                        style={{ borderBottomWidth: 0.4 }}
                        keyboardType={'numeric'}
                    />
                    <Text style={{ marginTop: hp('2') }}>Discounted Reason<Text style={{ color: base.theme.colors.primary }}>*</Text></Text>
                    <TextInput
                        placeholder={"Type a reason here"}
                        onChangeText={(text) => this.onChangeText(1, text)}
                        value={this.state.reason}
                        style={{ borderBottomWidth: 0.4 }}
                    />
                </View>

                <View style={{ width: wp('60'), height: hp('10'), borderWidth: 0, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                    <TouchableHighlight
                        underlayColor={base.theme.colors.transparent}
                        onPress={() => this.setState({ isDiscountModalOpen: false })}
                        style={{ height: hp('5'), width: wp('25'), backgroundColor: base.theme.colors.red, borderRadius: hp('5'), justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: base.theme.colors.white }}>Cancel</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor={base.theme.colors.transparent}
                        onPress={() => this.setState({ isDiscountModalOpen: false }, () => this.updateDiscVal())}
                        style={{ height: hp('5'), width: wp('25'), backgroundColor: base.theme.colors.primary, borderRadius: hp('5'), justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: base.theme.colors.white }}>Save</Text>
                    </TouchableHighlight>
                </View>

            </View>
        )
    }

    setData(invoiceDetail) {
        this.setState({
            isDiscountModalOpen: !this.state.isDiscountModalOpen,
            selectedVal: invoiceDetail,
            dAmount: invoiceDetail.inDsCVal
        })
    }

    async shareInvoice(invoiceDetail) {
        let self = this;
        let detail = {
            INID: invoiceDetail.inid
        };
        console.log("Invoice Id:", detail);
        let stat = await base.services.OyeLivingApi.sendInvoiceViaMail(detail);
        console.log("Stat:", stat)
        try {
            if (stat.success) {
                alert("Invoice sent successfully")
            }
            else {
                alert('Something went wrong')
            }
        } catch (e) {
            console.log(e)
        }

    }

    detailViewData(invoiceDetail) {
        this.setState({
            selectedVal: invoiceDetail
        });
        this.fetchUserDetailByUnitId(invoiceDetail.unUnitID)
        this.fetchInvoiceData(invoiceDetail.inid, invoiceDetail.unUnitID)

    }

    async fetchInvoiceData(invoiceId, unitId) {
        let self = this;
        console.log("Detail:", invoiceId, unitId);

        let lResp = await base.services.OyeLivingApi.getInvoiceDetail(invoiceId, unitId);
        console.log("lResp:", lResp);
        try {
            if (lResp.success && lResp.data.invoiceDetails.length !== 0) {
                self.setState({
                    invoiceDetailedArr: lResp.data.invoiceDetails,
                    showDetailedInvoice: true
                })
            }
            else {
                self.setState({
                    invoiceDetailedArr: [],
                    showDetailedInvoice: false
                })

                alert("Invoice detail is not available");
            }
        } catch (e) {
            console.log(e)
        }
    }

    async fetchUserDetailByUnitId(unitId) {
        let self = this;
        console.log("Selected Val:", unitId);

        let rResp = await base.services.OyeLivingApi.getUnitDetailByUnitId(unitId);
        try {
            console.log("User Detail:", rResp);
            if (rResp.success) {
                self.setState({
                    userDetail: rResp.data.unit.owner[0]
                })
            }
        } catch (e) {
            console.log("e:", e)
        }
    }

    _renderInvoiceList(item, index) {
        let invoiceDetail = item.item;
        //console.log("Item:",invoiceDetail);
        return (
            <View style={{ borderRadius: 5, borderColor: base.theme.colors.lightgrey,
                shadowColor: base.theme.colors.greyHead,
                shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 1},
                shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.2,
                shadowRadius: 1, elevation: 5, padding: 5, borderBottomWidth: 0.5, marginBottom: 10,flexDirection: 'row', marginTop: 10,
                height: hp('20'),
                width: wp('100'),  alignSelf: 'center', backgroundColor: base.theme.colors.white }}>
                <View style={{ flexDirection: 'row', height: hp('20'), alignItems: 'center' }}>
                    <View style={{ height: hp('11'), width: wp('10') }}>
                        <Image
                            source={require('../../../icons/documents.png')} />
                    </View>
                    <View style={{ height: hp('10'), borderWidth: 0, justifyContent: 'center', alignSelf: 'center', left: hp('1'), width: wp('80') }}>
                        <Text style={{ fontFamily: base.theme.fonts.bold, fontSize: hp('2') }}>{invoiceDetail.inNumber}</Text>
                        <Text style={{ fontFamily: base.theme.fonts.light, fontSize: hp('2'), marginTop: hp('1') }}>Current Invoice Amount:₹<Text style={{ fontFamily: base.theme.fonts.bold, fontSize: hp('2') }}>{invoiceDetail.inTotVal}</Text></Text>
                        <Text style={{ fontFamily: base.theme.fonts.light, fontSize: hp('2') }}>Invoice Date: <Text style={{ fontFamily: base.theme.fonts.bold, fontSize: hp('2') }}>{moment(invoiceDetail.inGenDate).format("DD-MM-YYYY")}</Text></Text>
                        <Text style={{ fontFamily: base.theme.fonts.light, fontSize: hp('2') }}>Invoice Billed: <Text style={{ fontFamily: base.theme.fonts.bold, fontSize: hp('2'), color: invoiceDetail.ineSent ? base.theme.colors.black : base.theme.colors.red }}>{invoiceDetail.ineSent ? "Yes" : "No"}</Text></Text>
                        <Text style={{ fontFamily: base.theme.fonts.light, fontSize: hp('2') }}>Due Date: <Text style={{ fontFamily: base.theme.fonts.bold, fontSize: hp('2') }}>{moment(invoiceDetail.toDate).format(("DD-MM-YYYY"))}</Text></Text>
                    </View>
                    <View style={{ flexDirection: 'column', borderWidth: 0 }}>
                        <ElevatedView elevation={5} style={{ height: hp('5'), width: hp('5'), margin: 2, justifyContent: 'center', alignItems: 'center', borderRadius: hp('0.5') }}>
                            <TouchableHighlight
                                underlayColor={base.theme.colors.transparent}
                                onPress={() => this.shareInvoice(invoiceDetail)}>
                                <Image
                                    resizeMode={'center'}
                                    style={{ height: hp('3'), width: hp('3') }}
                                    source={require('../../../icons/share.png')} />
                            </TouchableHighlight>
                        </ElevatedView>
                        <ElevatedView elevation={5} style={{ height: hp('5'), width: hp('5'), margin: 2, justifyContent: 'center', alignItems: 'center', borderRadius: hp('0.5') }}>
                            <TouchableHighlight
                                underlayColor={base.theme.colors.transparent}
                                onPress={() => this.detailViewData(invoiceDetail)}>
                                <Image
                                    resizeMode={'center'}
                                    style={{ height: hp('3'), width: hp('3') }}
                                    source={require('../../../icons/eye.png')} />
                            </TouchableHighlight>
                        </ElevatedView>
                        <ElevatedView elevation={5} style={{ height: hp('5'), width: hp('5'), margin: 2, justifyContent: 'center', alignItems: 'center', borderRadius: hp('0.5') }}>
                            <TouchableHighlight
                                underlayColor={base.theme.colors.transparent}
                                onPress={() => this.setData(invoiceDetail)}>
                                <Image
                                    resizeMode={'center'}
                                    style={{ height: hp('3'), width: hp('3') }}
                                    source={require('../../../icons/offer_zone.png')} />
                            </TouchableHighlight>
                        </ElevatedView>
                    </View>
                </View>
            </View>
        )
    }

    async getInvoiceByDates(){
        let self = this;
        let detail = {
            "FromDate"   : moment(self.state.fromDate).format('YYYY-MM-DD'),
            "ToDate"     :  moment(self.state.toDate).format('YYYY-MM-DD'),
            "ASAssnID" : self.props.userReducer.SelectedAssociationID,
            "BLBlockID"  : self.state.blockId
        }
        console.log("Invoice Id@@@@@:", detail);
        let stat = await base.services.OyeLivingApi.getInvoiceListByDates(detail);
        console.log("Stat:", stat)
        try {
            if (stat.success && stat.data.invoices.length !== 0) {
                self.setState({
                    invoiceListByDates:stat.data.invoices
                })
            }
        } catch (e) {
            self.setState({
                invoiceListByDates:[]
            })
            console.log(e)
        }
    }

    async getInvoiceByInvoiceNumber(difference,stAmount,endAmount) {
        let self = this;
        console.log("Selected Val:", self.state.invoiceNumber);

        let stat = await base.services.OyeLivingApi.getInvoiceListByInvoiceNumber(self.state.invoiceNumber);
        console.log("Invoice  Details:", stat,self.state.invoiceNumber);
        let invoiceData=[];
        try {
            if(stat){
                 invoiceData=(stat.data.invoices);
                self.applyFilters(difference,stAmount,endAmount,invoiceData)
            }
            else{
                self.applyFilters(difference,stAmount,endAmount,invoiceData)
            }

        } catch (e) {
            console.log("e:", e)
        }
    }

    clearTheFilters() {

        let self=this;
        self.setState({
            amountStart:'0',
            amountEnd:'0',
            fromDate:'',
            toDate:'',
            invoiceNumber:'',
            isModalVisible:false
        })
    }

    validationFilters(){
        let self=this;
        self.setState({isLoading:true})
        let stAmount=parseFloat(self.state.amountStart);
        let endAmount=parseFloat(self.state.amountEnd);
        let difference=endAmount-stAmount;
        console.log('Get the amount diff',difference)
        if(difference<0){
            self.setState({isLoading:false})
            Alert.alert('Please enter valid amount')
        }else if(self.state.invoiceNumber !=''){
                self.getInvoiceByInvoiceNumber(difference, stAmount, endAmount);
        }else {
            let invoiceByNum=[]
            self.applyFilters(difference,stAmount,endAmount,invoiceByNum)
        }
    }

    applyFilters(difference,stAmount,endAmount,invoiceByNum){
        let self=this;
        let invoicesList=[];
        console.log('Invoice By Nume:',invoiceByNum,self.state.invoiceListByDates)
        if(invoiceByNum.length===0 && self.state.invoiceListByDates.length===0){
            invoicesList=self.state.invoiceListAll
        }
        else if(invoiceByNum.length===0 && self.state.invoiceListByDates.length !==0){
            invoicesList=self.state.invoiceListByDates
        }
        else if(invoiceByNum.length !==0 && self.state.invoiceListByDates.length ===0){
            invoicesList=invoiceByNum
        }
        else if(invoiceByNum.length !==0 && self.state.invoiceListByDates.length !==0) {
            let j=0;
            for(let i=0;i<self.state.invoiceListByDates.length;i++){

               if(invoiceByNum[i].inNumber===self.state.invoiceListByDates[i].inNumber){
                   invoicesList[j]=invoiceByNum[i];
                   j=j+1;
               }
            }
        }

         // let invoicesList=self.state.invoiceListByDates.length===0? (invoiceByNum.length===0 ?self.state.invoiceListAll:invoiceByNum) :self.state.invoiceListByDates;
          let newList=[];

        if(difference>=1){
            let j=0;
            for (let i = 0; i < invoicesList.length; i++) {

                if (invoicesList[i].inTotVal >= stAmount && invoicesList[i].inTotVal <= endAmount) {
                    newList[j] = invoicesList[i]
                    j = j + 1;
                }
            }
        }else{
            newList=invoicesList;
        }


        console.log("Filtered Invoice List:",newList,invoiceByNum);

        self.setState({
            invoiceList:newList,
            isModalVisible:false
        })


    }




    openIOSCalender() {
        return (
            <Modal
                visible={this.state.isCalenderOpen}
                onRequestClose={this.close}>
                <View style={PatrollingReportStyles.ModalMainView}>
                    <View style={{flex: 1, justifyContent: 'center', width: width - 30}}>
                        <DatePickerIOS
                            date={this.state.selType === 0 ? this.state.fromDate : this.state.toDate}
                            style={{backgroundColor: base.theme.colors.white}}
                            maximumDate={_dt}
                            mode="date"
                            onDateChange={(date) => {
                                this.state.selType === 0 ? this.setState({fromDate: date}) : this.setState({toDate: date})
                            }}/>
                        <TouchableHighlight onPress={() => this.closeIOSCalender()} underlayColor='transparent'>
                            <View style={[PatrollingReportStyles.modalView, {width: width - 30}]}>
                                <Text
                                    style={PatrollingReportStyles.modalText}>{moment(this.state.selType === 0 ? this.state.fromDate : this.state.toDate).format("MMM DD YYYY")}</Text>
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
        console.log('Selection type',selType)
        let dt = new Date();
        dt.setDate(dt.getDate());
        let _dt = dt;
        let self = this;
        Platform.OS === 'ios' ? (self.setState({isCalenderOpen: true, selType: selType})) : self.showPicker('cal', {
            date: _dt,
            maxDate: _dt
        });
        this.setState({
            selType: selType
        })
    }

    showPicker = async (stateKey, options) => {
        try {
            const {action, year, month, day} = await DatePickerAndroid.open(options);
            if (action !== DatePickerAndroid.dismissedAction) {
                let date = new Date(year, month, day);
                if (this.state.selType === 1) {
                    let initialDateString = moment(this.state.fromDate);
                    let endDateString = moment(date);
                    console.log('DATES IS COMING11111', initialDateString, endDateString, this.state.fromDate, date)
                    let duration = moment.duration(endDateString.diff(initialDateString));
                    console.log(duration.as('days'));
                    let difference = duration.as('days');
                    if (difference < 0) {
                        Alert.alert('Please select a valid date')
                    } else {
                        this.setState({toDate: date})
                        this.getInvoiceByDates()
                    }
                } else {
                    let initialDateString = moment(date);
                    let endDateString = moment(this.state.toDate);
                    console.log('DATES IS COMING2222222', initialDateString, endDateString, this.state.toDate, date)
                    let duration = moment.duration(endDateString.diff(initialDateString));
                    console.log(duration.as('days'));
                    let difference = duration.as('days');
                    if (difference < 0) {
                        Alert.alert('Please select a valid date')
                    } else {
                        this.setState({fromDate: date})
                        this.getInvoiceByDates()
                    }
                }
            }
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    };


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

    }
};

export default (connect(mapStateToProps)(Invoices));
