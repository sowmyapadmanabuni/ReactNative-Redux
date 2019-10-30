/*
 * @Author: Sarthak Mishra 
 * @Date: 2019-10-07 11:58:24 
 * @Last Modified by: Sarthak Mishra
 * @Last Modified time: 2019-10-22 12:21:21
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
    Platform, DatePickerIOS, DatePickerAndroid, Dimensions, SafeAreaView, Linking, StyleSheet
} from 'react-native';

const {width} = Dimensions.get('screen');
import Collapsible from 'react-native-collapsible';
import {Dropdown} from 'react-native-material-dropdown';
import Modal from 'react-native-modal';
import {
    heightPercentageToDP,
    heightPercentageToDP as hp, widthPercentageToDP,
    widthPercentageToDP as wp
} from "react-native-responsive-screen";
import {connect} from 'react-redux';
import ProgressLoader from 'rn-progress-loader';
import base from '../../base';
import SelectMultiple from 'react-native-select-multiple';
import moment from "moment";
import {NavigationActions, SwitchActions} from "react-navigation";
import PatrollingReportStyles from "../Patrolling/PatrollingReportStyles";
import DocumentPicker from "react-native-document-picker";
import ImagePicker from "react-native-image-picker";
import AddExpenseStyles from "./Expenses/AddExpenseStyles";
import OSButton from "../../components/osButton/OSButton";
import CreateSOSStyles from "../SOS/CreateSOSStyles";
import PDFView from "react-native-view-pdf";
import CheckBox from "react-native-check-box";
import PatrollingCheckPointsStyles from "../Patrolling/PatrollingCheckPointsStyles";

let RNFS = require('react-native-fs');


const status = ['Invoice Input', 'Review Rejected', 'Review Accepted', 'Approved', 'Rejected', 'Invoiced'];


let dt = new Date();
dt.setDate(dt.getDate());
let _dt = dt;

class Expenses extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading:true,
            blockList: [],
            selectedBlock:'Select Block',
            blockId: '',
            expenseDetail: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            isModalVisible: false,
            collapse1: false,
            amountCollapse: false,
            isChecked: false,
            statusSelected: [],
            expensesList: [],
            expensesAllList: [],
            amountStart:'0',
            amountEnd:'0',
            isTabSelected: 0,
            expenseCollapse: false,
            expenseNameFil: '',
            fromDate:'',
            toDate:'',
            getIndex: 0,
            isCalenderOpenAdd: false,
            blockListAdd: [],
            selectedBlockAdd: 'Select Block',
            selectedExpRecType: 'Expense Recurrence Type',
            selectedAppList: 'Applicable to Unit',
            selectedExpType: 'Expense Type',
            selDistribution: 'Select Distribution Type',
            selectedBank: 'Select Bank',
            selPayeeBank: 'Payee Bank Name',
            selPayMethod: 'Select Payment Method',
            blockIdAdd: '',
            poNumberList: [{value: 'PO1', details: 'PO1'}, {value: 'PO2', details: 'PO2'}],
            selectedPoNum: 'PO1',
            expRecurrenceType: [],
            expRecurrenceId: '',
            expAppList: [],
            expApplicabilityId: '',
            expType: [{value: 'Fixed', details: 'E1'}, {value: 'Variable', details: 'E2'}],
            distributionType: [{value: 'Dimension Based', details: 'D1'}, {value: 'Per Unit', details: 'D2'}],
            selectBankList: [{value: 'SBI', details: 'B1'}, {value: 'Andra Bank', details: 'B2'}, {
                value: 'ICICI Bank',
                details: 'B3'
            }, {value: 'HDFC Bank', details: 'B3'},
                {value: 'AXIS Bank', details: 'B5'}, {value: 'Canera Bank', details: 'B6'}],
            payeeBankList: [{value: 'SBI', details: 'B1'}, {value: 'Andra Bank', details: 'B2'}, {
                value: 'ICICI Bank',
                details: 'B3'
            }, {value: 'HDFC Bank', details: 'B3'},
                {value: 'AXIS Bank', details: 'B5'}, {value: 'Canera Bank', details: 'B6'}],
            paymentMethodList: [],
            payMethodId: '',
            payeeName: '',
            expenditureDate: _dt,
            bpIdentifier: '',
            raBudget: '',
            vendorName: '',
            poValue: '',
            expHead: '',
            expDesc: '',
            amountPaid:'',
            isCalenderOpen: false,
            invoiceNum: '',
            invoiceCopyList: [],
            uploadedFile: '',
            isModalOpen: false,
            isCollapse: false,
            unitName: '',
            isAddExpenseModal: false,
            isEditExpense: false,
            selectedExpToEdit: {},
            base64ToViePdf: "",
            openPdf: false,
            selExpenseId:'',
            selectedImage:{},
            expListByDates:[],
            exChqNo  : '', //min 6 digits max 12
            exChqDate :'', //it should allow future date upto 3 months from current date
            exVoucherNo:'', //
            exDDNo   : '', // min 6 digits max 12
            exDDDate : '' ,//it should allow past date upto 3 months from current date,
            inCopyListExp:[{},{},{},{},{}]

        };

        this.bindComponent = this.bindComponent.bind(this);
    }

    componentDidMount() {
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            () =>  {console.log('Get the All ApIs');
                this.setState({isLoading:true})
                this.getTheBlockList()
                this.getExpenseRecurrenceType();
                this.getExpenseApplicableUnitList();
                this.getPaymentMethodsList();
                this.getUnitName();
            this.updateValues()}
        );
    }

    componentWillUnmount() {
        this.didFocusListener.remove();
    }
    updateValues(){
        let self=this;
        self.setState({
            selectedBlock:'Select Block',
            blockId: '',
            getIndex: 0,
            expensesList: [],
            expensesAllList: [],
            statusSelected: [],
            amountStart:'0',
            amountEnd:'0',
            fromDate: '',
            toDate: '',
            expenseNameFil: '',
            expListByDates:[],
            isTabSelected: 0,
            isModalVisible:false
        })

    }

    /*componentWillMount() {
        this.getTheBlockList()
        this.getExpenseRecurrenceType();
        this.getExpenseApplicableUnitList();
        this.getPaymentMethodsList();
        this.getUnitName();
    }*/

    onSelectionsChange = (statusSelected) => {
        console.log('data@@@@@@', statusSelected)
        this.setState({statusSelected})
    };

    async getTheBlockList() {
        let stat = await base.services.OyeLivingApi.getTheListOfBlocksByAssociation(this.props.userReducer.SelectedAssociationID)
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
                isLoading:false
            })
            console.log('error', error)
        }

    }

    async getExpenseRecurrenceType() {
        let stat = await base.services.OyeLivingApi.getExpenseRecTypeList(this.props.userReducer.SelectedAssociationID)
        try {
            if (stat.success && stat.data.expenseReccurrance.length !== 0) {
                let expRecurrence = [];
                let data = stat.data.expenseReccurrance;

                for (let i = 0; i < data.length; i++) {
                    expRecurrence.push({
                        value: data[i].erType,
                        details: data[i]
                    })
                }
                this.setState({
                    expRecurrenceType: expRecurrence
                })
            }
        } catch (error) {

            this.setState({
                isLoading:false
            })
            console.log('error', error)
        }

    }

    async getExpenseApplicableUnitList() {
        let stat = await base.services.OyeLivingApi.getExpenseApplicabilityList(this.props.userReducer.SelectedAssociationID)
        try {
            if (stat.success && stat.data.expenseApplicabilites.length !== 0) {
                let expAppList = [];
                let data = stat.data.expenseApplicabilites;

                for (let i = 0; i < data.length; i++) {
                    expAppList.push({
                        value: data[i].eaApplTo,
                        details: data[i]
                    })
                }
                this.setState({
                    expAppList: expAppList
                })
            }
        } catch (error) {

            this.setState({
                isLoading:false
            })
            console.log('error', error)
        }

    }

    async getPaymentMethodsList() {
        let stat = await base.services.OyeLivingApi.getPaymentMethodList(this.props.userReducer.SelectedAssociationID)
        console.log('Pay list',stat)
        try {
            if (stat.success && stat.data.paymentMethod.length !== 0) {
                let paymentList = [];
                let data = stat.data.paymentMethod;

                for (let i = 0; i < data.length; i++) {
                    paymentList.push({
                        value: data[i].pmName,
                        details: data[i]
                    })
                }
                this.setState({
                    paymentMethodList: paymentList
                })
            }
        } catch (error) {

            this.setState({
                isLoading:false
            })
            console.log('error', error)
        }
    }

    async getUnitName() {
        let stat = await base.services.OyeLivingApi.getUnitDetailByUnitId(this.props.dashBoardReducer.uniID)

        this.setState({
            isLoading:false
        })
        try {
            if (stat.success && stat.data) {
                this.setState({
                    unitName: stat.data.unit.unUniName
                })
            }
        } catch (error) {
            console.log('Error', error)
        }
    }

    async createExpense() {
        var imgUrl=this.state.uploadedFile;

        if(this.state.isEditExpense){
        let invoiceCopyList=this.state.invoiceCopyList;
        if(invoiceCopyList.length !==0){
            for(let i=0;i<invoiceCopyList.length;i++){
                if(invoiceCopyList[i].isUpload){
                  imgUrl=imgUrl !=''?imgUrl+','+invoiceCopyList[i].fileUrl:invoiceCopyList[i].fileUrl
                }
            }
        }}
     let input = {
            //"POEAmnt"   :'',
            //"BPID"      : '',
         "EXDCreated":moment(this.state.expenditureDate).format('YYYY-MM-DD'),
            "EXHead": this.state.expHead,
            "EXDesc": this.state.expDesc,
            "EXPAmnt": parseFloat(this.state.amountPaid).toFixed(2),
            //"EXDate":moment(this.state.expenditureDate).format('YYYY-MM-DD'),
            "EXApplTO": this.state.selectedAppList,
            "EXRecurr": this.state.selectedExpRecType,
            "EXType": this.state.selectedExpType,
            "BABName": this.state.selectedBank,
            "PMID": this.state.payMethodId,
            "EXPName": this.state.payeeName,
            "EXPBName": this.state.selPayeeBank,
            //"EXChqNo"   : "",
            //"EXChqDate" : moment(this.state.expenditureDate).format('YYYY-MM-DD'),
            "EXPyCopy": imgUrl,
            "VNName": '',
            "EXDisType": this.state.selDistribution,
            "UNUnitID": this.props.dashBoardReducer.uniID,
            "BLBlockID": this.state.blockIdAdd,
            "ASAssnID": this.props.userReducer.SelectedAssociationID,
            "INNumber": this.state.invoiceNum,
            "EXID":this.state.isEditExpense?this.state.selExpenseId:'',
            "UnUniIden":this.state.unitName

        };

        console.log('Sending Data',input)
        let stat = this.state.isEditExpense?await base.services.OyeLivingApi.updateExpense(input):
            await base.services.OyeLivingApi.addNewExpense(input);
        try {
            if (stat.success) {
                this.setState({
                    isEditExpense:false,
                    isAddExpenseModal: false,
                });
                this.clearAllFields();

                await this.getTheExpenseList(this.state.selectedBlock, this.state.getIndex)
            }
        } catch (error) {
            this.setState({
                isLoading:false
            })
            console.log('Error', error)
        }

    }

    async selectFile() {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });
            console.log(
                "File Selected", res,
                res.uri,
                res.type, // mime type
                res.name,
                res.size
            );
            await RNFS.readFile(res.uri, 'base64').then(data => {
                let img = this.state.invoiceCopyList;
                img.push({fileUrl: data, type: 'Pdf', res: res,isUpload:false})
                this.setState({
                    invoiceCopyList: img,
                });
            })

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
        this.setState({
            isCollapse: false
        });
    }


    selectImage() {
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
        self.setState({
            isCollapse: false
        });
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
            } else if (response.error) {
            } else if (response.customButton) {
            } else {
                let img = self.state.invoiceCopyList;
                img.push({fileUrl: response.uri, type: 'Image', res: response,isUpload:false})
                self.setState({
                    invoiceCopyList: img,
                })
            }
        });

    }

    async uploadFile() {
        this.setState({isLoading:true})
        let self = this;
        let invoiceCopies = self.state.invoiceCopyList;
        for (let i = 0; i < invoiceCopies.length; i++) {
            if(!invoiceCopies[i].isUpload) {
                let source = (Platform.OS === 'ios') ? invoiceCopies[i].res.uri : invoiceCopies[i].res.uri;
                const form = new FormData();
                let imgObj = {
                    name: (invoiceCopies[i].res.fileName || invoiceCopies[i].res.name !== undefined) ? invoiceCopies[i].res.fileName ? invoiceCopies[i].res.fileName : invoiceCopies[i].res.name : "XXXXX.jpg",
                    uri: source,
                    type: (invoiceCopies[i].res.type !== undefined || invoiceCopies[i].res.type != null) ? invoiceCopies[i].res.type : "image/jpeg"
                };
                form.append('image', imgObj);
                let stat = await base.services.MediaUploadApi.uploadRelativeImage(form);
                if (stat) {
                    try {
                        self.setState({
                            uploadedFile: self.state.uploadedFile != '' ? self.state.uploadedFile + ',' + stat : stat,
                        })
                    } catch (err) {
                        self.setState({
                            isLoading: false
                        })
                        console.log('err', err)
                    }
                }
            }
        }
        this.createExpense()
    }


    async getTheExpenseList(value, index) {
        let self = this;
        let blockId = self.state.blockList[index].details.blBlockID;
        console.log('Values of expenses', value, index, blockId)

        let stat = await base.services.OyeLivingApi.getTheExpenseListByBlockId(blockId) //1
        console.log('Data in stat', stat)
            self.setState({isLoading:false})
        try {
            if (stat.success && stat.data.expenseByBlock.length !== 0) {
                let expensesList = stat.data.expenseByBlock;
                let newList = []
                for (let i = 0; i < expensesList.length; i++) {
                    newList.push({item: expensesList[i], open: false,isChecked:false})
                }
                self.setState({
                    expensesList: newList,
                    expensesAllList: newList
                });
                console.log('Expense List@@@@', newList)
                self.getSelectedInvoices(self.state.isTabSelected, newList)
            }
        } catch (error) {
            self.setState({expenseList: [],expensesAllList:[]});
            console.log('error', error)
        }


        this.setState({
            selectedBlock: value,
            blockId: blockId,
            getIndex: index
        })
    }

    async filterExpListByDates(){
        console.log('Selected dates',this.state.fromDate,this.state.toDate,moment(this.state.fromDate).format('YYYY-MM-DD'),
            moment(this.state.toDate).format('YYYY-MM-DD'))
        let self=this;
        self.setState({isLoading:true})
        let input = {
            "ASAssnID"    : self.props.userReducer.SelectedAssociationID,
            "BLBlockID"    : self.state.blockId,
            "startdate"    :moment(self.state.fromDate).format('YYYY-MM-DD'),
            "enddate"    :moment(self.state.toDate).format('YYYY-MM-DD')
    };
        console.log('Selected dates',input);
        let stat = await base.services.OyeLivingApi.getTheExpenseListByDates(input)
        self.setState({isLoading:false})
        console.log('data from the stat',stat)
        try{
            if (stat.success && stat.data.expense.length !== 0) {
                let expensesList = stat.data.expense;
                let newList = []
                for (let i = 0; i < expensesList.length; i++) {
                    newList.push({item: expensesList[i], open: false,isChecked:false})
                }
                self.setState({
                    expListByDates: newList,
                });
            }
        }catch(error){
            self.setState({
                expListByDates:[]
            })
          console.log('error',error)
        }


    }

    async deleteInvoice(expenseId) {
        let self = this;
        let input = {
            "EXID": expenseId
        };
        let stat = await base.services.OyeLivingApi.deleteInvoice(input)
        try {
            if (stat.success) {
                await self.getTheExpenseList(self.state.selectedBlock, self.state.getIndex)
            }
        } catch (error) {
            console.log('error', error)
        }

    }


    onModalOpen() {
        this.setState({
            isModalVisible: !this.state.isModalVisible,
            collapse1: true
        })
    }

    renderModal() {
        return (
            <Modal isModalVisible={this.state.isModalVisible}>
                <View style={{
                    height: hp('30'),
                    width: wp('50'),
                    backgroundColor: base.theme.colors.primary,
                    alignSelf: 'center'
                }}>
                    <Text>I am the modal content!</Text>
                </View>
            </Modal>
        )
    }

    async generateInvoices(){
        let self = this;
        let associationId = self.props.userReducer.SelectedAssociationID;
        console.log('Get the Details for generate invoice', self.props,associationId,self.state.blockId)
        let stat = await base.services.OyeLivingApi.getInvoices(associationId,self.state.blockId); // 1, 4
        console.log("Stat in generate invoices:",stat)
        try {
            if (stat.success) {
                Alert.alert('Invoices generated successfully')
                await self.getTheExpenseList(self.state.selectedBlock, self.state.getIndex)
            } else {
                Alert.alert(stat.error.message)
            }
        }catch(error){
            console.log(error);
            Alert.alert('No Expenses To Be Invoiced')
        }

    }

    render() {
        console.log("State:@@@@@@", this.state.expensesList,this.state.expensesAllList)
        return (
            <TouchableOpacity  onPress={() =>{this.clearTheFilters(this.state.isTabSelected,this.state.expensesAllList)}} disabled={!this.state.isModalVisible}>
            <View style={{
                height: '100%',
                width: '100%',
                backgroundColor: this.state.isModalVisible ? 'rgba(52, 52, 52, 0.09)' : base.theme.colors.white
            }}>
                {this.state.isTabSelected !==0?
                <TouchableOpacity style={{width:'100%',justifyContent:'flex-end',alignItems:'flex-end',height:25,paddingRight:15,alignSelf:'flex-end',}} onPress={() => {
                   this.generateInvoices()
                }}>
                    <Text style={{color:base.theme.colors.blue}}>Generate Invoice</Text>
                </TouchableOpacity>
                    :
                    <View/>}
                <View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: wp('95'),
                        alignSelf: 'center',
                    }}>
                        <Dropdown
                            value={this.state.selectedBlock}
                            labelFontSize={18}
                            labelPadding={-5}
                            placeHolder={'Selected Block'}
                            baseColor="rgba(0, 0, 0, 1)"
                            data={this.state.blockList}
                            containerStyle={{width: wp('50')}}
                            textColor={base.theme.colors.black}
                            inputContainerStyle={{
                                borderBottomColor: base.theme.colors.primary,
                                borderBottomWidth: 1,
                            }}
                            dropdownOffset={{top: 10, left: 0}}
                            dropdownPosition={-5}
                            rippleOpacity={0}
                            onChangeText={(value, index) => {this.setState({isLoading:true});
                                this.getTheExpenseList(value, index)}}
                        />
                        <TouchableOpacity
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.state.selectedBlock=='' || this.state.selectedBlock=='Select Block' ?Alert.alert('Please select block to Apply filters'):this.onModalOpen()}
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
                            <Text style={{fontSize: 16, marginBottom: 5}}>Filter</Text>
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
                </View>
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    height: '7%',
                    backgroundColor: base.theme.colors.lightgrey
                }}>
                    <TouchableOpacity style={{
                        width: '33.35%',
                        backgroundColor: this.state.isTabSelected === 0 ? base.theme.colors.greyHead : base.theme.colors.greyCard,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                                      onPress={() => this.getSelectedInvoices(0, this.state.expensesAllList)}
                    >
                        <Text style={{fontSize: 14, color: base.theme.colors.blue}}>Invoiced</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        width: '33.35%',
                        backgroundColor: this.state.isTabSelected === 1 ? base.theme.colors.greyHead : base.theme.colors.greyCard,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                                      onPress={() => this.getSelectedInvoices(1, this.state.expensesAllList)}
                    >
                        <Text style={{fontSize: 14, color: base.theme.colors.blue}}>Uninvoiced</Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        width: '33.35%',
                        backgroundColor: this.state.isTabSelected === 2 ? base.theme.colors.greyHead : base.theme.colors.greyCard,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                                      onPress={() => this.getSelectedInvoices(2, this.state.expensesAllList)}
                    >
                        <Text style={{fontSize: 14, color: base.theme.colors.blue}}>All</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{height: '90%'}}>
                    {this.state.expensesList.length === 0 ?
                        <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
                            <Text>No expense details is there</Text>
                        </View> :
                        <FlatList
                            data={this.state.expensesList}
                            extraData={this.state}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={(item) => this.selectedExpense(item)}
                        />}
                </ScrollView>
                {this.state.isModalVisible ?
                    <View style={{
                        position: 'absolute', height: hp('50'),
                        width: wp('60'), backgroundColor: base.theme.colors.white,
                        alignSelf: 'flex-end',
                        marginTop:40
                    }}>

                        <ScrollView>
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
                            <Text style={{fontSize: 14, color: base.theme.colors.black}}>Filter by:</Text>
                            <TouchableHighlight
                                underlayColor={base.theme.colors.transparent}
                                onPress={() => this.clearTheFilters(this.state.isTabSelected, this.state.expensesAllList)}
                            >
                                <Text style={{color: base.theme.colors.blue}}>Clear All</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                underlayColor={base.theme.colors.transparent}
                                onPress={() => this.validationFilters()}
                            >
                                <Text style={{color: base.theme.colors.primary}}>Apply</Text>
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
                                    this.setState({collapse1:!this.state.collapse1})
                                }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <Text style={{fontSize: 16, color: base.theme.colors.black}}>Status</Text>
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
                                <SelectMultiple
                                    items={status}
                                    rowStyle={{borderBottomWidth: 0, height: 30}}
                                    // renderLabel={this.renderLabel}
                                    selectedItems={this.state.statusSelected}
                                    selectedCheckboxStyle={{tintColor: base.theme.colors.blue}}
                                    onSelectionsChange={this.onSelectionsChange}/>
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
                                onPress={() => this.setState({amountCollapse: !this.state.amountCollapse})}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <Text style={{fontSize: 16, color: base.theme.colors.black}}>Amount</Text>
                                    <Image
                                        resizeMode={'contain'}
                                        style={{height: hp('4'), width: wp('4'), tintColor: base.theme.colors.black,}}
                                        source={!this.state.amountCollapse ? require('../../../icons/show_less.png') : require('../../../icons/show_more.png')}
                                    />
                                </View>
                            </TouchableHighlight>
                            <Collapsible collapsed={this.state.amountCollapse}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{fontSize: 13, marginRight: 2}}>Between</Text>
                                    <TextInput
                                        onChangeText={(value) =>{
                                            let num = value.replace(/[^0-9].[^0-9]{1,2}/g,  '');
                                            if (isNaN(num)) {
                                                // Its not a number
                                            } else {
                                                this.setState({amountStart:num})
                                            }}}
                                       // onChangeText={(text) => this.setState({amountStart:text})}
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
                                        maxLength={20}
                                        placeholderTextColor={base.theme.colors.grey}
                                        keyboardType={'phone-pad'}
                                    />
                                    <Text style={{fontSize: 13, marginRight: 2, marginLeft: 2}}>To</Text>
                                    <TextInput
                                        onChangeText={(value) =>{
                                            let num = value.replace(/[^0-9].[^0-9]{1,2}/g,  '');
                                            if (isNaN(num)) {
                                                // Its not a number
                                            } else {
                                                this.setState({amountEnd:num})
                                            }}}
                                        //onChangeText={(text) => this.setState({amountEnd:text})}
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
                                        maxLength={20}
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
                                onPress={() => this.setState({expenseCollapse: !this.state.expenseCollapse})}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <Text style={{fontSize: 16,color: base.theme.colors.black}}>Expense Name</Text>
                                    <Image
                                        resizeMode={'contain'}
                                        style={{height: hp('4'), width: wp('4'), tintColor: base.theme.colors.black,}}
                                        source={!this.state.expenseCollapse ? require('../../../icons/show_less.png') : require('../../../icons/show_more.png')}
                                    />
                                </View>
                            </TouchableHighlight>
                            <Collapsible collapsed={this.state.expenseCollapse}>
                                <View style={{flexDirection: 'row'}}>
                                    <TextInput
                                        style={{
                                            width: 150,
                                            fontSize: 12,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: 20,
                                            paddingTop: -10,
                                            paddingBottom: -10,
                                            borderColor: base.theme.colors.greyHead,
                                            borderWidth: 1
                                        }}
                                        onChangeText={(value) =>{
                                            let num = value.replace(/^[a-zA-Z0-9 ]+$/g,  '');
                                            if (isNaN(num)) {
                                                // Its not a number
                                            } else {
                                                this.setState({expenseNameFil:value})
                                            }}}
                                        maxLength={20}
                                        keyboardType={Platform.OS === 'ios'? 'ascii-capable':'visible-password'}
                                        //onChangeText={(text) => this.setState({expenseNameFil: text})}
                                        value={this.state.expenseNameFil}
                                        placeholderTextColor={base.theme.colors.grey}

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
                            //borderBottomWidth: 1,
                           // borderBottomColor: base.theme.colors.lightgrey
                        }}>
                            <TouchableHighlight
                                underlayColor={base.theme.colors.transparent}
                                onPress={() => this.openCalender(0)}>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                                    <Text style={{fontSize: 15,color: base.theme.colors.grey,width:80}}>From Date</Text>
                                    <TouchableOpacity onPress={() => this.openCalender(0)}>
                                        <View style={{
                                            flexDirection: 'row',
                                            width:140,
                                            height: 20,
                                            alignItems: 'center'
                                        }}>
                                            <View style={{width:80,
                                                height: 20,
                                                borderWidth: 1,
                                                borderColor: base.theme.colors.lightgrey,
                                                alignItems: 'center'}}>
                                            <Text style={{width:80,color:base.theme.colors.black}}>{this.state.fromDate==''?this.state.fromDate:moment(this.state.fromDate).format('DD-MM-YYYY')}</Text>
                                            </View>
                                                <Image
                                                resizeMode={'contain'}
                                                style={{height: hp('6'), width: wp('6'), left: wp('5')}}
                                                source={require('../../../icons/cal.png')}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </TouchableHighlight>
                            <TouchableOpacity
                                underlayColor={base.theme.colors.transparent}
                                onPress={() => this.openCalender(0)}>
                                <View style={{ flexDirection: 'row', alignItems: 'center',marginBottom:10 }}>
                                    <Text style={{fontSize: 15, color: base.theme.colors.grey,width:80,}}>To Date</Text>
                                    <TouchableOpacity onPress={() =>this.openCalender(1)}>
                                        <View style={{flexDirection:'row',width:140,height:20,
                                           alignItems:'center'}}>
                                            <View style={{width:80,
                                                height: 20,
                                                borderWidth: 1,
                                                borderColor: base.theme.colors.lightgrey,
                                                alignItems: 'center'}}>
                                            <Text style={{width:80,color:base.theme.colors.black}}>{this.state.toDate==''?this.state.toDate:moment(this.state.toDate).format('DD-MM-YYYY')}</Text>
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
                        </View>
                        </ScrollView>

                    </View>

                    : <View/>}

                <TouchableOpacity onPress={this.bindComponent}>
                    <Image
                        resizeMode={'contain'}
                        style={{alignSelf: 'flex-end', height: 80, width: 80}}
                        source={require('../../../icons/add_btn.png')}
                    />
                </TouchableOpacity>
                <ProgressLoader
                    isHUD={true}
                    isModal={true}
                    visible={this.state.isLoading}
                    color={base.theme.colors.primary}
                    hudColor={"#FFFFFF"}
                />

                {(Platform.OS === 'ios') ? this.openIOSCalender() : <View/>}
                {this.state.isAddExpenseModal ? this.addExpenseScreen() : <View/>}

            </View>
            </TouchableOpacity>

        )
    }

    editExpense(selectedExpense) {
        this.setState({isLoading:true})
        let blockName = '';
        let blockList=this.state.blockListAdd;

        for (let i = 0; i < blockList.length; i++) {

            if (selectedExpense.blBlockID === blockList[i].details.blBlockID) {
                blockName = blockList[i].details.blBlkName
            }
        }
        let paymentList=this.state.paymentMethodList
        let paymentName='';
        for(let j=0;j<paymentList.length;j++){
            if (selectedExpense.pmid === paymentList[j].details.pmid) {
                paymentName = paymentList[j].details.pmName
            }
        }
        //ImageList array
        let imageString= selectedExpense.exPyCopy
        let imageArray=imageString==''?[]:imageString.split(',');
        let img=[];
        for(let i=0;i<imageArray.length;i++){
            let imgType=imageArray.length !=0?imageArray[i].split('.'):[];
            img.push({fileUrl: "https://mediaupload.oyespace.com/"+imageArray[i], isUpload:true,type:imgType[1]=="pdf"?'Pdf':'Image'})
        }
        this.setState({
            expHead: selectedExpense.exHead,
            expDesc: selectedExpense.exDesc,
            amountPaid: selectedExpense.expAmnt.toString(),
            selectedAppList: selectedExpense.exApplTO,
            selectedExpRecType: selectedExpense.exRecurr,
            selectedExpType: selectedExpense.exType,
            selectedBank: selectedExpense.babName,
            payMethodId: selectedExpense.pmid,
            payeeName: selectedExpense.expName,
            selPayeeBank: selectedExpense.expbName,
           // uploadedFile: selectedExpense.exPyCopy,
            expenditureDate: selectedExpense.exdCreated,
            invoiceCopyList: img,
            selDistribution: selectedExpense.exDisType,
            blockIdAdd: selectedExpense.blBlockID,
            invoiceNum: selectedExpense.inNumber.toString(),
            selectedExpToEdit: selectedExpense,
            isEditExpense: true,
            isAddExpenseModal: true,
            selectedBlockAdd:blockName,
            selPayMethod:paymentName,
            isLoading:false,
            selExpenseId:selectedExpense.exid
        })
    }

    closeExpenseScreen() {
        this.setState({isAddExpenseModal: false, selectedExpToEdit: {}, isEditExpense: false})
        this.clearAllFields()
    }

    addExpenseScreen() {
        let selectedExpense = this.state.selectedExpToEdit
        let isEdit = Object.keys(selectedExpense).length === 0;
        return (
            <Modal
                style={{height: '110%', width: '100%', alignSelf: 'center',}}
                visible={this.state.isAddExpenseModal}
                transparent={true}
                onRequestClose={this.close}>
                <View style={{height: '106%', width: '100%', backgroundColor: base.theme.colors.white}}>
                    <SafeAreaView style={AddExpenseStyles.safeArea}>
                        <View style={[styles.viewStyle, {flexDirection: 'row'}]}>
                            <View style={[styles.viewDetails1,]}>
                                <TouchableOpacity
                                    onPress={() => this.closeExpenseScreen()}
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
                                    source={require('../../../icons/OyespaceSafe.png')}
                                />
                            </View>
                            <View style={{flex: 0.2}}>
                            </View>
                        </View>
                        <View style={AddExpenseStyles.headerView}>
                            <Text
                                style={AddExpenseStyles.headerText}>{this.state.isEditExpense ? 'Edit Expense' : 'Add Expense'}</Text>
                        </View>
                        <View style={AddExpenseStyles.subHeadView}>
                            <Text style={AddExpenseStyles.subHeadText}>Expense Details</Text>
                        </View>
                        <ScrollView style={AddExpenseStyles.mainContainer}
                                    showsVerticalScrollIndicator={false}>
                            <View style={[AddExpenseStyles.scrollContainer]}>
                                <View style={{width: '100%'}}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: base.theme.colors.black,
                                        textAlign: 'left',
                                        paddingTop: 5,
                                    }}>Select Block
                                        <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                    <Dropdown
                                        value={this.state.selectedBlockAdd} //Select Block *
                                        labelFontSize={18}
                                        labelPadding={-5}
                                        placeHolder={'Selected Block'}
                                        baseColor="rgba(0, 0, 0, 1)"
                                        data={this.state.blockListAdd}
                                        containerStyle={{
                                            width: '100%',
                                        }}
                                        textColor={base.theme.colors.black}
                                        inputContainerStyle={{
                                            borderColor: base.theme.colors.lightgrey,
                                        }}
                                        dropdownOffset={{top: 10, left: 0}}
                                        dropdownPosition={-5}
                                        rippleOpacity={0}
                                        onChangeText={(value, index) => {
                                            this.setState({
                                                selectedBlockAdd: value,
                                                blockIdAdd: this.state.blockListAdd[index].details.blBlockID
                                            })
                                        }}
                                    />
                                </View>
                                <View style={{backgroundColor: base.theme.colors.greyCard}}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: base.theme.colors.black,
                                        textAlign: 'left',
                                        paddingTop: 5,
                                    }}>PO Number
                                        <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                    <View style={{width: '100%'}}>
                                        <Dropdown
                                            value={'PO Number'} //this.state.selectedPoNum
                                            labelFontSize={18}
                                            labelPadding={-5}
                                            baseColor="rgba(0, 0, 0, 1)"
                                            data={this.state.poNumberList}
                                            containerStyle={{
                                                width: '100%',
                                            }}
                                            textColor={base.theme.colors.black}
                                            inputContainerStyle={{
                                                borderColor: base.theme.colors.lightgrey,
                                            }}
                                            dropdownOffset={{top: 10, left: 0}}
                                            dropdownPosition={-3}
                                            rippleOpacity={0}
                                            onChangeText={(value, index) => {
                                                this.setState({
                                                    selectedPoNum: value
                                                })
                                            }}
                                            disabled={true}
                                        />
                                    </View>
                                    <View style={AddExpenseStyles.textInputView}>
                                        <Text
                                            style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left',}}>Budget
                                            Projection Identifier
                                            <Text
                                                style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                        <TextInput
                                            style={{
                                                height: 30,
                                                borderBottomWidth: 1,
                                                borderColor: base.theme.colors.lightgrey,
                                                paddingBottom: 5
                                            }}

                                            onChangeText={(text) => this.setState({bpIdentifier: text})}
                                            value={this.state.bpIdentifier}
                                            placeholder="Budget Projection Identifier"
                                            placeholderTextColor={base.theme.colors.grey}
                                            editable={false}
                                            keyboardType={Platform.OS === 'ios'? 'ascii-capable':'visible-password'}

                                        />
                                    </View>
                                    <View style={AddExpenseStyles.textInputView}>
                                        <Text style={{
                                            fontSize: 14,
                                            color: base.theme.colors.black,
                                            textAlign: 'left',
                                            paddingTop: 5
                                        }}>Remaining Approved Budget
                                            <Text
                                                style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                        <TextInput
                                            style={{
                                                height: 30,
                                                borderBottomWidth: 1,
                                                borderColor: base.theme.colors.lightgrey,
                                                paddingBottom: 5
                                            }}
                                            onChangeText={(text) => this.setState({raBudget: text})}
                                            value={this.state.raBudget}
                                            placeholder="Remaining Approved Budget"
                                            placeholderTextColor={base.theme.colors.grey}
                                            editable={false}
                                            keyboardType={Platform.OS === 'ios'? 'ascii-capable':'visible-password'}

                                        />
                                    </View>
                                    <View style={AddExpenseStyles.textInputView}>
                                        <Text style={{
                                            fontSize: 14,
                                            color: base.theme.colors.black,
                                            textAlign: 'left',
                                            paddingTop: 5,
                                        }}>Vendor Name
                                            <Text
                                                style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                        <TextInput
                                            style={{
                                                height: 30,
                                                borderBottomWidth: 1,
                                                borderColor: base.theme.colors.lightgrey,
                                                paddingBottom: 5
                                            }}
                                            onChangeText={(text) => this.setState({vendorName: text})}
                                            value={this.state.vendorName}
                                            placeholder="Vendor Name"
                                            placeholderTextColor={base.theme.colors.grey}
                                            editable={false}
                                            keyboardType={Platform.OS === 'ios'? 'ascii-capable':'visible-password'}

                                        />
                                    </View>
                                    <View style={AddExpenseStyles.textInputView}>
                                        <Text style={{
                                            fontSize: 14,
                                            color: base.theme.colors.black,
                                            textAlign: 'left',
                                            paddingTop: 5,
                                        }}>PO Value
                                            <Text
                                                style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                        <TextInput
                                            style={{
                                                height: 30,
                                                borderBottomWidth: 1,
                                                borderColor: base.theme.colors.lightgrey,
                                                paddingBottom: 5
                                            }}
                                            onChangeText={(text) => this.setState({poValue: text})}
                                            value={this.state.poValue}
                                            placeholder="PO Value"
                                            placeholderTextColor={base.theme.colors.grey}
                                            editable={false}
                                            keyboardType={Platform.OS === 'ios'? 'ascii-capable':'visible-password'}

                                        />
                                    </View>
                                </View>
                                <View style={AddExpenseStyles.textInputView}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: base.theme.colors.black,
                                        textAlign: 'left',
                                        paddingTop: 5,
                                    }}>Expense Head
                                        <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                    <TextInput
                                        style={{
                                            height: 30,
                                            borderBottomWidth: 1,
                                            borderColor: base.theme.colors.lightgrey,
                                            paddingBottom: 5
                                        }}
                                        onChangeText={(value) =>{
                                            let num = value.replace(/^[a-zA-Z0-9 ]+$/g,  '');
                                            if (isNaN(num)) {
                                                // Its not a number
                                            } else {
                                                this.setState({expHead:value})
                                            }}}
                                       // onChangeText={(text) => this.setState({expHead: text})}
                                        value={this.state.expHead}
                                        placeholder="Expense Head"
                                        maxLength={20}
                                        placeholderTextColor={base.theme.colors.grey}
                                        keyboardType={Platform.OS === 'ios'? 'ascii-capable':'visible-password'}
                                    />
                                </View>
                                <View style={AddExpenseStyles.textInputView}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: base.theme.colors.black,
                                        textAlign: 'left',
                                        paddingTop: 5,
                                    }}>Expense Description
                                        <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                    <TextInput
                                        style={{
                                            height: 30,
                                            borderBottomWidth: 1,
                                            borderColor: base.theme.colors.lightgrey,
                                            paddingBottom: 5
                                        }}
                                        onChangeText={(value) =>{
                                            let num = value.replace(/^[a-zA-Z0-9 ]+$/g,  '');
                                            if (isNaN(num)) {
                                                // Its not a number
                                            } else {
                                                this.setState({expDesc:value})
                                            }}}
                                       // onChangeText={(text) => this.setState({expDesc: text})}
                                        value={this.state.expDesc}
                                        placeholder="Expense Description"
                                        maxLength={40}
                                        placeholderTextColor={base.theme.colors.grey}
                                        keyboardType={Platform.OS === 'ios'? 'ascii-capable':'visible-password'}

                                    />
                                </View>
                                <View style={{paddingTop: 5, paddingBottom: 5, width: '100%'}}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: base.theme.colors.black,
                                        textAlign: 'left',
                                        paddingTop: 5,
                                    }}>Expense Recurrence Type
                                        <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                    <Dropdown
                                        value={this.state.selectedExpRecType} //'Expense Recurrence Type *'
                                        labelFontSize={18}
                                        labelPadding={-5}
                                        baseColor="rgba(0, 0, 0, 1)"
                                        data={this.state.expRecurrenceType}
                                        containerStyle={{
                                            width: '100%',
                                        }}
                                        textColor={base.theme.colors.black}
                                        inputContainerStyle={{
                                            borderColor: base.theme.colors.lightgrey,
                                        }}
                                        dropdownOffset={{top: 10, left: 0}}
                                        dropdownPosition={-5}
                                        rippleOpacity={0}
                                        onChangeText={(value, index) => {
                                            this.setState({
                                                selectedExpRecType: value,
                                                expRecurrenceId: this.state.expRecurrenceType[index].details.erid
                                            })
                                        }}
                                    />
                                </View>
                                <View style={{width:'100%',}}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: base.theme.colors.black,
                                        textAlign: 'left',
                                        paddingTop: 5,
                                    }}>Applicable to Unit
                                        <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                    <Dropdown
                                        value={this.state.selectedAppList} // 'Applicable to Unit *'
                                        labelFontSize={18}
                                        labelPadding={-5}
                                        baseColor="rgba(0, 0, 0, 1)"
                                        data={this.state.expAppList}
                                        containerStyle={{
                                            width: '100%',
                                        }}
                                        textColor={base.theme.colors.black}
                                        inputContainerStyle={{
                                            borderColor: base.theme.colors.lightgrey,
                                        }}
                                        dropdownOffset={{top: 10, left: 0}}
                                        dropdownPosition={-5}
                                        rippleOpacity={0}
                                        onChangeText={(value, index) => {
                                            this.setState({
                                                selectedAppList: value,
                                                expApplicabilityId: this.state.expAppList[index].details.eaid,
                                            })
                                        }}
                                    />
                                </View>
                                <View style={{width: '100%', }}>

                                        <Text style={{
                                            fontSize: 14,
                                            color: base.theme.colors.black,
                                            textAlign: 'left',
                                            paddingTop: 5,
                                        }}>Expense Type
                                            <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                    <Dropdown
                                        value={this.state.selectedExpType} // 'Expense Type *'
                                        labelFontSize={18}
                                        labelPadding={-5}
                                        baseColor="rgba(0, 0, 0, 1)"
                                        data={this.state.expType}
                                        containerStyle={{
                                            width: '100%',
                                        }}
                                        textColor={base.theme.colors.black}
                                        inputContainerStyle={{
                                            borderColor: base.theme.colors.lightgrey,
                                        }}
                                        dropdownOffset={{top: 10, left: 0}}
                                        dropdownPosition={-3}
                                        rippleOpacity={0}
                                        onChangeText={(value, index) => {
                                            this.setState({
                                                selectedExpType: value
                                            })
                                        }}
                                    />
                                </View>
                                <View style={{width: '100%', flexDirection: 'row',}}>
                                    <View style={{width: '70%',}}>
                                        <Text style={{
                                            fontSize: 14,
                                            color: base.theme.colors.black,
                                            textAlign: 'left',
                                            paddingTop: 5,
                                        }}>Amount Paid
                                            <Text
                                                style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                        <TextInput
                                            style={{
                                                height: 30,
                                                borderBottomWidth: 1,
                                                borderColor: base.theme.colors.lightgrey,
                                                paddingBottom: 5
                                            }}
                                            onChangeText={(value) =>{
                                                let num = value.replace(/[^0-9].[^0-9]{2}/g,  '');
                                                if (isNaN(num)) {
                                                // Its not a number
                                            } else {
                                                this.setState({amountPaid:num})
                                            }}}
                                            value={this.state.amountPaid}
                                            placeholder="Amount Paid"
                                            placeholderTextColor={base.theme.colors.grey}
                                            keyboardType={'numeric'}
                                            maxLength={30}
                                        />
                                    </View>
                                    <Image
                                        style={{height: 50, width: 50, marginLeft: 30}}
                                        source={require('../../../icons/rupee1.png')}
                                    />
                                </View>
                                <View style={{paddingTop: 5, paddingBottom: 5, width: '100%'}}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: base.theme.colors.black,
                                        textAlign: 'left',
                                        paddingTop: 5,
                                    }}>Select Distribution Type
                                        <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                    <Dropdown
                                        value={this.state.selDistribution} // 'Select Distribution Type *'
                                        labelFontSize={18}
                                        labelPadding={-5}
                                        baseColor="rgba(0, 0, 0, 1)"
                                        data={this.state.distributionType}
                                        containerStyle={{
                                            width: '100%',
                                        }}
                                        textColor={base.theme.colors.black}
                                        inputContainerStyle={{
                                            borderColor: base.theme.colors.lightgrey,
                                        }}
                                        dropdownOffset={{top: 10, left: 0}}
                                        dropdownPosition={-3}
                                        rippleOpacity={0}
                                        onChangeText={(value, index) => {
                                            this.setState({
                                                selDistribution: value
                                            })
                                        }}
                                    />
                                </View>
                                {this.state.selPayMethod!="Cash"?
                                <View style={{paddingTop: 5, paddingBottom: 5, width: '100%'}}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: base.theme.colors.black,
                                        textAlign: 'left',
                                        paddingTop: 5,
                                    }}>Select Bank
                                        <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                    <Dropdown
                                        value={this.state.selectedBank} // 'Select Bank *'
                                        labelFontSize={18}
                                        labelPadding={-5}
                                        baseColor="rgba(0, 0, 0, 1)"
                                        data={this.state.selectBankList}
                                        containerStyle={{
                                            width: '100%',
                                        }}
                                        textColor={base.theme.colors.black}
                                        inputContainerStyle={{
                                            borderColor: base.theme.colors.lightgrey,
                                        }}
                                        dropdownOffset={{top: 10, left: 0}}
                                        dropdownPosition={-5}
                                        rippleOpacity={0}
                                        onChangeText={(value, index) => {
                                            this.setState({
                                                selectedBank: value
                                            })
                                        }}
                                    />
                                </View>:
                                    <View/>}
                                <View style={{width: '100%', flexDirection: 'row'}}>
                                    <View style={{width: '70%',}}>
                                        <Text style={{
                                            fontSize: 14,
                                            color: base.theme.colors.black,
                                            textAlign: 'left',
                                            paddingTop: 5,
                                        }}>Select Payment Method
                                            <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                        <Dropdown
                                            value={this.state.selPayMethod} // 'Select Payment Method *'
                                            labelFontSize={18}
                                            labelPadding={-5}
                                            baseColor="rgba(0, 0, 0, 1)"
                                            data={this.state.paymentMethodList}
                                            containerStyle={{
                                                width: '100%',
                                            }}
                                            textColor={base.theme.colors.black}
                                            inputContainerStyle={{
                                                borderColor: base.theme.colors.lightgrey,
                                            }}
                                            dropdownOffset={{top: 10, left: 0}}
                                            dropdownPosition={-5}
                                            rippleOpacity={0}
                                            onChangeText={(value, index) => {
                                                this.setState({
                                                    selPayMethod: value,
                                                    payMethodId: this.state.paymentMethodList[index].details.pmid,
                                                })
                                            }}
                                        />
                                    </View>
                                    <Image
                                        style={{height: 50, width: 50, marginLeft: 30}}
                                        source={require('../../../icons/atm_card.png')}
                                    />
                                </View>
                                <View style={AddExpenseStyles.textInputView}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: base.theme.colors.black,
                                        textAlign: 'left',
                                        paddingTop: 5,
                                    }}>Payee Name
                                        <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                    <TextInput
                                        style={{
                                            height: 30,
                                            borderBottomWidth: 1,
                                            borderColor: base.theme.colors.lightgrey,
                                            paddingBottom: 5
                                        }}
                                        onChangeText={(value) =>{
                                            let num = value.replace(/^[a-zA-Z ]+$/g,  '');
                                            if (isNaN(num)) {
                                                // Its not a number
                                            } else {
                                                this.setState({payeeName:value})
                                            }}}
                                       // onChangeText={(text) => this.setState({payeeName: text})}
                                        value={this.state.payeeName}
                                        placeholder="Payee Name"
                                        keyboardType={Platform.OS === 'ios'? 'ascii-capable':'visible-password'}
                                        placeholderTextColor={base.theme.colors.grey}
                                        maxLength={20}
                                    />
                                </View>
                               {/* {this.state.selPayMethod =="Cheque"?
                                <View style={AddExpenseStyles.textInputView}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: base.theme.colors.black,
                                        textAlign: 'left',
                                        paddingTop: 5,
                                    }}>Cheque Number
                                        <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                    <TextInput
                                        style={{
                                            height: 30,
                                            borderBottomWidth: 1,
                                            borderColor: base.theme.colors.lightgrey,
                                            paddingBottom: 5
                                        }}
                                        onChangeText={(value) =>{
                                            let num = value.replace(/[^0-9]/g,  '');
                                            if (isNaN(num)) {
                                                // Its not a number
                                            } else {
                                                this.setState({exChqNo:value})
                                            }}}
                                        value={this.state.exChqNo}
                                        placeholder="Cheque Number"
                                        keyboardType={Platform.OS === 'ios'? 'ascii-capable':'visible-password'}
                                        placeholderTextColor={base.theme.colors.grey}
                                        maxLength={20}
                                    />
                                </View>
                                    :<View/>}
                                {this.state.selPayMethod =="Cheque"?
                                    <View style={[AddExpenseStyles.textInputView, {
                                        flexDirection: 'row',
                                        borderBottomWidth: 1,
                                        borderColor: base.theme.colors.lightgrey,
                                        alignItems: 'flex-end',
                                        justifyContent: 'space-between'
                                    }]}>
                                        <View>
                                            <Text style={{
                                                fontSize: 14,
                                                color: base.theme.colors.black,
                                                textAlign: 'left',
                                                paddingTop: 5,
                                            }}>Cheque Date
                                                <Text
                                                    style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                            <TextInput
                                                style={{
                                                    height: 30,
                                                    paddingBottom: 5,
                                                    color:base.theme.colors.black
                                                }}
                                                value={moment(this.state.exChqDate).format("MMM DD YYYY")}
                                                placeholder="Cheque Date"
                                                placeholderTextColor={base.theme.colors.grey}
                                                editable={false}
                                            />
                                        </View>
                                        <TouchableOpacity onPress={() => this.openCalenderAdd(0,'CHEQUE')}>
                                            <Image
                                                style={{height: 25, width: 25, marginBottom: 7}}
                                                source={require('../../../icons/calender.png')}
                                            />
                                        </TouchableOpacity>
                                        {(Platform.OS === 'ios') ? this.openIOSCalenderAdd(0,'CHEQUE') : <View/>}
                                    </View>
                                    :<View/>}
                                {this.state.selPayMethod =="DD"?
                                <View style={AddExpenseStyles.textInputView}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: base.theme.colors.black,
                                        textAlign: 'left',
                                        paddingTop: 5,
                                    }}>DD Number
                                        <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                    <TextInput
                                        style={{
                                            height: 30,
                                            borderBottomWidth: 1,
                                            borderColor: base.theme.colors.lightgrey,
                                            paddingBottom: 5
                                        }}
                                        onChangeText={(value) =>{
                                            let num = value.replace(/[^0-9]/g,  '');
                                            if (isNaN(num)) {
                                                // Its not a number
                                            } else {
                                                this.setState({payeeName:value})
                                            }}}
                                        // onChangeText={(text) => this.setState({payeeName: text})}
                                        value={this.state.exDDNo}
                                        placeholder="DD Number"
                                        keyboardType={Platform.OS === 'ios'? 'ascii-capable':'visible-password'}
                                        placeholderTextColor={base.theme.colors.grey}
                                        maxLength={20}
                                    />
                                </View>
                                    :<View/>}
                                {this.state.selPayMethod =="DD"?
                                    <View style={[AddExpenseStyles.textInputView, {
                                        flexDirection: 'row',
                                        borderBottomWidth: 1,
                                        borderColor: base.theme.colors.lightgrey,
                                        alignItems: 'flex-end',
                                        justifyContent: 'space-between'
                                    }]}>
                                        <View>
                                            <Text style={{
                                                fontSize: 14,
                                                color: base.theme.colors.black,
                                                textAlign: 'left',
                                                paddingTop: 5,
                                            }}>DD Date
                                                <Text
                                                    style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                            <TextInput
                                                style={{
                                                    height: 30,
                                                    paddingBottom: 5,
                                                    color:base.theme.colors.black
                                                }}
                                                value={moment(this.state.exDDDate).format("MMM DD YYYY")}
                                                placeholder="DD Date"
                                                placeholderTextColor={base.theme.colors.grey}
                                                editable={false}
                                            />
                                        </View>
                                        <TouchableOpacity onPress={() => this.openCalenderAdd(1,'DD')}>
                                            <Image
                                                style={{height: 25, width: 25, marginBottom: 7}}
                                                source={require('../../../icons/calender.png')}
                                            />
                                        </TouchableOpacity>
                                        {(Platform.OS === 'ios') ? this.openIOSCalenderAdd(1,'DD') : <View/>}
                                    </View>
                                    :<View/>}
                                {this.state.selPayMethod =="Cash"?
                                    <View style={AddExpenseStyles.textInputView}>
                                        <Text style={{
                                            fontSize: 14,
                                            color: base.theme.colors.black,
                                            textAlign: 'left',
                                            paddingTop: 5,
                                        }}>Voucher Number
                                            <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                        <TextInput
                                            style={{
                                                height: 30,
                                                borderBottomWidth: 1,
                                                borderColor: base.theme.colors.lightgrey,
                                                paddingBottom: 5
                                            }}
                                            onChangeText={(value) =>{
                                                let num = value.replace(/[^0-9]/g,  '');
                                                if (isNaN(num)) {
                                                    // Its not a number
                                                } else {
                                                    this.setState({exVoucherNo:value})
                                                }}}
                                            value={this.state.exVoucherNo}
                                            placeholder="Payee Name"
                                            keyboardType={Platform.OS === 'ios'? 'ascii-capable':'visible-password'}
                                            placeholderTextColor={base.theme.colors.grey}
                                            maxLength={20}
                                        />
                                    </View>
                                    :<View/>}*/}
                                {this.state.selPayMethod!="Cash"?
                                <View style={{paddingTop: 5, paddingBottom: 5, width: '100%',}}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: base.theme.colors.black,
                                        textAlign: 'left',
                                        paddingTop: 5,
                                    }}>Payee Bank Name
                                        <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                    <Dropdown
                                        value={this.state.selPayeeBank} // 'Payee Bank Name *'
                                        labelFontSize={18}
                                        labelPadding={-5}
                                        baseColor="rgba(0, 0, 0, 1)"
                                        data={this.state.payeeBankList}
                                        containerStyle={{
                                            width: '100%',
                                        }}
                                        textColor={base.theme.colors.black}
                                        inputContainerStyle={{
                                            borderColor: base.theme.colors.lightgrey,
                                        }}
                                        dropdownOffset={{top: 10, left: 0}}
                                        dropdownPosition={-5}
                                        rippleOpacity={0}
                                        onChangeText={(value, index) => {
                                            this.setState({
                                                selPayeeBank: value
                                            })
                                        }}
                                    />
                                </View>:
                                    <View/>}
                                <View style={[AddExpenseStyles.textInputView, {
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    borderColor: base.theme.colors.lightgrey,
                                    alignItems: 'flex-end',
                                    justifyContent: 'space-between'
                                }]}>
                                    <View>
                                        <Text style={{
                                            fontSize: 14,
                                            color: base.theme.colors.black,
                                            textAlign: 'left',
                                            paddingTop: 5,
                                        }}>Expenditure Date
                                            <Text
                                                style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                        <TextInput
                                            style={{
                                                height: 30,
                                               // borderBottomWidth: 1,
                                               // borderColor: base.theme.colors.lightgrey,
                                                paddingBottom: 5,
                                                color:base.theme.colors.black
                                            }}
                                            value={moment(this.state.expenditureDate).format("MMM DD YYYY")}
                                            placeholder="Expenditure Date"
                                            placeholderTextColor={base.theme.colors.grey}
                                            editable={false}
                                        />
                                    </View>
                                    <TouchableOpacity onPress={() => this.openCalenderAdd()}>
                                        <Image
                                            style={{height: 25, width: 25, marginBottom: 7}}
                                            source={require('../../../icons/calender.png')}
                                        />
                                    </TouchableOpacity>
                                    {(Platform.OS === 'ios') ? this.openIOSCalenderAdd() : <View/>}
                                </View>
                                <View style={AddExpenseStyles.textInputView}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: base.theme.colors.black,
                                        textAlign: 'left',
                                        paddingTop: 5,
                                    }}>Invoice No / Receipt No</Text>
                                    <TextInput
                                        style={{
                                            height: 30,
                                            borderBottomWidth: 1,
                                            borderColor: base.theme.colors.lightgrey,
                                            paddingBottom: 5
                                        }}
                                        onChangeText={(value) =>{
                                            let num = value.replace(/^[a-zA-Z0-9]+$/g,  '');
                                            if (isNaN(num)) {
                                                // Its not a number
                                            } else {
                                                this.setState({invoiceNum:value})
                                            }}}
                                     //   onChangeText={(text) => this.setState({invoiceNum: text})}
                                        value={this.state.invoiceNum}
                                        placeholder="Invoice No / Receipt No"
                                        placeholderTextColor={base.theme.colors.grey}
                                        keyboardType={Platform.OS === 'ios'? 'ascii-capable':'visible-password'}
                                        maxLength={20}
                                    />
                                </View>
                                <View style={[AddExpenseStyles.textInputView, {paddingTop: 25, paddingBottom: 10}]}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: base.theme.colors.black,
                                        textAlign: 'left',
                                        paddingTop: 5,
                                    }}>Invoice / Payment Copy</Text>
                                </View>
                                <View style={{
                                    borderRadius: 5,
                                    flexDirection: 'row',
                                    borderStyle: 'dashed',
                                    height: 90,
                                    width: '95%',
                                    alignSelf: 'center',
                                    borderWidth: 1.8,
                                    borderColor: base.theme.colors.blue,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: this.state.isCollapse ? 0 : 60
                                }}>
                                    {this.state.invoiceCopyList.length !== 0 ?
                                        <FlatList
                                            keyExtractor={(item, index) => index.toString()}
                                            data={this.state.invoiceCopyList}
                                            renderItem={(item, index) => this.renderImages(item, index)}
                                            horizontal={true}
                                        />
                                        : <View/>}
                                    {this.state.invoiceCopyList.length === 5 ?
                                        <View/> :
                                        <TouchableOpacity
                                            onPress={() => this.setState({isCollapse: !this.state.isCollapse})}>
                                            <View style={{
                                                height: 80,
                                                width: 70,
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Image borderStyle
                                                       style={{
                                                           height: 30,
                                                           width: 30,
                                                           tintColor: base.theme.colors.blue
                                                       }}
                                                       source={require('../../../icons/add.png')}
                                                />
                                            </View>
                                        </TouchableOpacity>}
                                </View>
                                {this.state.isCollapse ?
                                    <View style={{
                                        flexDirection: 'row',
                                        width: '100%',
                                        height: '8%',
                                        borderRadius: 20,
                                        alignSelf: 'center',
                                        marginBottom: 60,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderColor: base.theme.colors.lightgrey,
                                        shadowColor: base.theme.colors.darkgrey,
                                        shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 2},
                                        shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.6,
                                        shadowRadius: 2,
                                        elevation: 5
                                    }}>
                                        <TouchableOpacity onPress={() => this.selectFile()}>
                                            <Image borderStyle
                                                   style={{height: 50, width: 50,}}
                                                   source={require('../../../icons/upload.png')}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.selectImage()}>
                                            <Image borderStyle
                                                   style={{height: 50, width: 50, marginLeft: 10}}
                                                   source={require('../../../icons/camera.png')}
                                            />
                                        </TouchableOpacity>
                                    </View> : <View/>}
                            </View>
                            <View style={{
                                alignSelf: 'center',
                                width: '70%',
                                flexDirection: 'row',
                                paddingTop: 25,
                                paddingBottom: 25,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 130,
                                paddingLeft: 15,
                                paddingRight: 15
                            }}>
                                <OSButton
                                    height={30}
                                    width={'35%'}
                                    borderRadius={20}
                                    oSBBackground={base.theme.colors.red}
                                    oSBText={'Reset'}
                                    onButtonClick={() => this.clearAllFields()}/>
                                <OSButton
                                    height={30}
                                    width={'50%'}
                                    borderRadius={20}
                                    oSBBackground={base.theme.colors.primary}
                                    oSBText={!isEdit ? 'Edit Expense' : 'Add Expense'}
                                    onButtonClick={() => this.createExpenseValidation()}/>
                            </View>
                            {this._renderModal1()}
                            {this.openPdfFile()}
                        </ScrollView>
                    </SafeAreaView>
                </View>

            </Modal>
        )
    }

    createExpenseValidation(title, message) {
        if (base.utils.validate.isBlank(this.state.blockIdAdd)) {
            Alert.alert('Please select the block', message)
        } else if (base.utils.validate.isBlank(this.state.expHead)) {
            Alert.alert('Expense heading is Mandatory', message)
        } else if (base.utils.validate.isBlank(this.state.expDesc)) {
            Alert.alert('Expense Description is Mandatory', message)

        } else if (base.utils.validate.isBlank(this.state.selectedExpRecType) || (this.state.selectedExpRecType =='Expense Recurrence Type')) {
            Alert.alert('Expense Recurrence is Mandatory', message)

        } else if (base.utils.validate.isBlank(this.state.selectedAppList) || (this.state.selectedAppList =='Applicable to Unit')) {
            Alert.alert('Expense Applicability is Mandatory', message)

        } else if (base.utils.validate.isBlank(this.state.selectedExpType) || (this.state.selectedExpType =='Expense Type')) {
            Alert.alert('Expense Type is Mandatory', message)

        } else if (base.utils.validate.isBlank(this.state.amountPaid)) {
            Alert.alert('Amount paid to an expense is Mandatory', message)
        } else if (base.utils.validate.isBlank(this.state.selDistribution) || (this.state.selDistribution =='Select Distribution Type')) {
            Alert.alert('Type of distribution is Mandatory', message)
        } else if (this.state.selPayMethod!="Cash" && (base.utils.validate.isBlank(this.state.selectedBank) || (this.state.selectedBank =='Select Bank'))) {
            Alert.alert('Select the bank  is Mandatory', message)
        } else if (base.utils.validate.isBlank(this.state.selPayMethod) || (this.state.selPayMethod =='Select Payment Method')) {
            Alert.alert('Select the payment method is Mandatory', message)
        } else if (base.utils.validate.isBlank(this.state.payeeName) ) {
            Alert.alert('Select the payee name is Mandatory', message)
        } else if (this.state.selPayMethod!="Cash" && (base.utils.validate.isBlank(this.state.selPayeeBank) || (this.state.selPayeeBank =='Payee Bank Name'))) {
            Alert.alert('Select the payee bank is Mandatory', message)
        } else {
            this.uploadFile()
        }



    }

    bindComponent() {
        this.setState({
            isAddExpenseModal: true,
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
                        this.filterExpListByDates()
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
                        this.filterExpListByDates()
                    }
                }
            }
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    };

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
        }else{
           self.applyFilters(difference,stAmount,endAmount)
        }
    }

    applyFilters(difference,stAmount,endAmount) {
        console.log('Filtered list')

        let self=this;
        let presentList =self.state.expensesAllList;
        if(self.state.expListByDates.length!=0){
            presentList=self.state.expListByDates
        }
        let newList=[]
        if(difference>=1){
            let j=0;
            for (let i = 0; i < presentList.length; i++) {
                console.log('Filtered list',presentList[i].item.expAmnt)
                console.log('Filtered list1111',typeof(stAmount),typeof(endAmount),stAmount,endAmount,typeof(presentList[i].item.expAmnt))
                if (presentList[i].item.expAmnt >= stAmount && presentList[i].item.expAmnt <= endAmount) {
                    console.log('Filtered list2222',typeof(stAmount),typeof(endAmount),stAmount,endAmount,typeof(presentList[i].item.expAmnt))
                    newList[j] = presentList[i]
                    j = j + 1;
                }
            }
        }else{
            newList=self.state.expensesAllList;
        }
        console.log('Filtered list222233333',newList)


        let filteredList=[];
        let statusFilters=self.state.statusSelected;
        if(statusFilters.length!=0) {
            let k = 0;
            for (let i = 0; i < newList.length; i++) {
                console.log('Filtered list3333', newList[i].item.expAmnt, i)

                for (let j = 0; j < statusFilters.length; j++) {
                    console.log('Filtered list4444', newList[i].item.expAmnt, i, j, statusFilters[j], statusFilters[j].value)
                    if (statusFilters[j].value == newList[i].item.exStatus) {
                        console.log('Filtered list4444', newList[i].item.expAmnt, i, j, statusFilters[j], statusFilters[j].value)
                        filteredList[k] = newList[i];
                        k = k + 1;
                    }
                }
                console.log('Filtered list5555', filteredList)

            }
        }
        else{
            filteredList=newList
        }
        let filteredNameList=[];
        let j=0;
        if(self.state.expenseNameFil!=''){
            for(let i=0;i<filteredList.length;i++){
                console.log('Filtered list66666',filteredList,i,self.state.expenseNameFil.toUpperCase(),filteredList[i].item.exHead.toUpperCase())
                if(self.state.expenseNameFil.toUpperCase()===filteredList[i].item.exHead.toUpperCase()){
                    console.log('Filtered list77777',filteredList,i,self.state.expenseNameFil.toUpperCase(),filteredList[i].item.exHead.toUpperCase())
                      filteredNameList[j]=filteredList[i]
                    j=j+1;
                }
            }
        }
        else{
            filteredNameList=filteredList
        }
        console.log('Filtered list88888',filteredNameList)


        self.onModalOpen();

        self.getSelectedInvoices(self.state.isTabSelected,filteredNameList)
    }

    clearTheFilters(id, expensesList) {
        let self = this;
        self.setState({
            statusSelected: [],
            amountStart:'0',
            amountEnd:'0',
            fromDate: '',
            toDate: '',
            expenseNameFil: '',
            expListByDates:[]
        });
        self.onModalOpen()
        self.getSelectedInvoices(id, expensesList)
    }


    getSelectedInvoices(id, expensesList) {
        console.log('Id###########', id, expensesList);
        let self = this;
        let listOfExpenses = [];
        if (id === 0) {
            console.log('Id###########111111', id, expensesList);

            let j = 0;
            for (let i = 0; i < expensesList.length; i++) {
                console.log('Id###########2222', id, expensesList,expensesList[i].item.exIsInvD);
                if (expensesList[i].item.exIsInvD) {
                    listOfExpenses[j] = expensesList[i]
                    j = j + 1;
                }
            }
        } else if (id === 1) {
            let j = 0;
            for (let i = 0; i < expensesList.length; i++) {
                console.log('Id###########33333', id, expensesList);
                if (!expensesList[i].item.exIsInvD) {
                    listOfExpenses[j] = expensesList[i];
                    j = j + 1;
                }
            }
        } else if (id === 2) {
            console.log('Id###########44444', id, expensesList);

            listOfExpenses = expensesList;
        }

        console.log('Expenses List', id, listOfExpenses)

        self.setState({
            isLoading:false,
            isTabSelected:id,
            expensesList: listOfExpenses
        })
    }
    checkTheExpense=(index,value)=>{
        let data = [...this.state.expensesList];
        data[index].isChecked = !value;
        this.setState({expensesList: data});
    };



    selectedExpense(item) {
        let selectedExpense = item.item.item;
        return (
            <TouchableOpacity style={{
                borderRadius: 5, borderColor: base.theme.colors.lightgrey, backgroundColor: base.theme.colors.white,
                shadowColor: base.theme.colors.greyHead,
                shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 1},
                shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.2,
                shadowRadius: 1, elevation: 5, padding: 5, borderBottomWidth: 0.5, marginBottom: 10
            }}
                              onPress={() => this.toggleCollapsible(item.index, item.item.open)}>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                    {/*<View style={{flexDirection:'row',width:'10%',padding:5,alignItems:'center',justifyContent:'center',alignSelf:'center'}}>
                    <CheckBox
                        style={{flex: 1,
                            }}
                        checkBoxColor={base.theme.colors.grey}
                        checkedCheckBoxColor={base.theme.colors.blue}
                        onClick={() => {
                            this.checkTheExpense(item.index,item.item.isChecked)
                        }}
                        isChecked={item.item.isChecked} />
                    </View>*/}
                    <View style={{marginLeft:5}}>
                        <Image
                            style={{height: 25, width: 25,}}
                            source={require('../../../icons/OyeLiving.png')}
                        />
                    </View>
                    <View style={{marginLeft:10, marginRight: 5,width:'45%'}}>
                        <Text
                            style={{fontSize: 14, color: base.theme.colors.black, paddingBottom: 5, fontWeight: 'bold'}}
                            numberOfLines={1}>
                            {selectedExpense.exHead}
                        </Text>
                        <Text style={{fontSize: 13, color: base.theme.colors.black, paddingBottom: 3}}>Status:
                            <Text
                                style={{color: selectedExpense.exStatus == "Review Rejected" ? base.theme.colors.red : base.theme.colors.blue}}>{' '}{selectedExpense.exStatus}</Text></Text>
                        <Text style={{fontSize: 13, color: base.theme.colors.black, paddingBottom: 3}}>Amount: <Text
                            style={{fontWeight: 'bold'}}>{base.utils.strings.rupeeIconCode}{selectedExpense.expAmnt}</Text></Text>
                        <Collapsible duration={100} collapsed={!item.item.open}>
                            <Text style={{fontSize: 13, color: base.theme.colors.black, paddingBottom: 3}}>Invoice Date:
                                <Text
                                    style={{color: base.theme.colors.black}}> {moment(selectedExpense.exdCreated).format('DD-MM-YYYY')}</Text></Text>
                            <Text style={{fontSize: 13, color: base.theme.colors.black, paddingBottom: 3}}>Applicability:
                                <Text style={{fontWeight: 'bold'}}> {selectedExpense.exApplTO}</Text></Text>
                            <Text style={{fontSize: 13, color: base.theme.colors.black}}>Added By:
                                <Text style={{fontWeight: 'bold'}}> {this.props.userReducer.MyFirstName}</Text></Text>
                            <View style={{
                                borderRadius: 5,
                                flexDirection: 'row',
                                borderStyle: 'dashed',
                                height: 90,
                                width: '95%',
                                alignSelf: 'center',
                                borderWidth: 1.8,
                                borderColor: base.theme.colors.blue,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: this.state.isCollapse ? 0 : 60
                            }}>
                                {this.state.inCopyListExp.length !== 0 ?
                                    <FlatList
                                        keyExtractor={(item, index) => index.toString()}
                                        data={this.state.inCopyListExp}
                                        renderItem={(item, index) => this.renderImages(item, index)}
                                        horizontal={true}
                                    />
                                    : <View/>}
                            </View>

                        </Collapsible>
                    </View>
                    <View style={{marginLeft:1, marginRight: 5,width:'20%'}}>
                        <Text style={{color: base.theme.colors.primary,width:80,}} numberOfLines={2}>{selectedExpense.unUniIden}</Text>
                    </View>

                </View>
                {selectedExpense.exIsInvD ?
                    <View/> :
                    <View style={{
                        position: 'absolute',
                        alignSelf: 'flex-end',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingRight: 10,
                        marginTop: 10
                    }}>
                        <TouchableOpacity style={{
                            padding: 10,
                            width: 40,
                            height: 40,
                            borderRadius: 5,
                            backgroundColor: base.theme.colors.shadedWhite,
                            marginBottom: 2
                        }} onPress={() => this.editExpense(selectedExpense)}>
                            <Image
                                resizeMode={'contain'}
                                style={{height: 20, width: 20,}}
                                source={require('../../../icons/edit.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            padding: 8,
                            width: 40,
                            height: 40,
                            borderRadius: 5,
                            backgroundColor: base.theme.colors.shadedWhite
                        }} onPress={() => this.deleteInvoice(selectedExpense.exid)}>
                            <Image
                                resizeMode={'contain'}
                                style={{height: 20, width: 20}}
                                source={require('../../../icons/delete.png')}
                            />
                        </TouchableOpacity>
                    </View>}
                <View style={{alignSelf: 'center', marginBottom: 10, marginTop: 10}}>
                    <TouchableOpacity style={{
                        width: 35,
                        borderRadius: 15,
                        height:4,
                        backgroundColor: base.theme.colors.lightgrey,
                        alignSelf: 'center'
                    }} onPress={() => this.toggleCollapsible(item.index, item.item.open)}>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    toggleCollapsible = (index, value) => {
        let data = [...this.state.expensesList];
        data[index].open = !value;
        this.setState({expensesList: data});
    };

    _renderModal1() {
        return (
            <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={this.state.invoiceCopyList}
                horizontal={true}
                renderItem={(item, index) => this._renderModal(item, index)}
            />
        )
    }

    _enlargeImage(imageURI) {
        this.setState({
            selectedImage: imageURI,
            isModalOpen: true
        })
    }

    _renderModal() {
        return (
            <Modal
                onRequestClose={() => this.setState({isModalOpen: false})}
                isVisible={this.state.isModalOpen}>
                <View style={{height: heightPercentageToDP('50%'), justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                        style={{
                            height: heightPercentageToDP('50%'),
                            width: heightPercentageToDP('50%'),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        source={this.state.selectedImage}
                    />
                    <TouchableHighlight
                        underlayColor={base.theme.colors.transparent}
                        style={{top: 20}}
                        onPress={() => this.setState({isModalOpen: false})}>
                        <Text style={CreateSOSStyles.emergencyHeader}>Close</Text>
                    </TouchableHighlight>
                </View>
            </Modal>
        )
    }

    renderImages(item, index) {
        let imageURI = {uri: item.item.fileUrl};

        return (
            <View style={{
                height: 80,
                width: 90,
                flexDirection: 'row',
                marginLeft: 10,
                backgroundColor: base.theme.colors.shadedWhite,
                borderRadius: 10,
                padding: 5
            }}>
                {
                    item.item.type != 'Pdf'  ?
                    <TouchableOpacity
                        style={{alignSelf: 'flex-end',}}
                        onPress={() => this._enlargeImage(imageURI)}
                    >
                        <Image
                            style={CreateSOSStyles.imageViewExp}
                            source={imageURI}
                        />
                    </TouchableOpacity> :
                    <TouchableOpacity style={{alignSelf: 'flex-end',}}
                                      onPress={() => {
                                          item.item.isUpload? Linking.openURL(item.item.fileUrl):this.openPdfModal(item)
                                      }}>
                        <Image
                            style={CreateSOSStyles.imageViewExp}
                            source={require('../../../icons/file_upload.png')}
                        />
                    </TouchableOpacity>}
                <TouchableOpacity
                    style={{height: 20, width: 20,}}
                    onPress={() => this.deleteImageFromList(item)}
                >
                    <Image
                        style={{height: 20, width: 20, position: 'absolute', alignSelf: 'flex-start', marginLeft: 3}}
                        source={require('../../../icons/close_btn1.png')}
                    />
                </TouchableOpacity>
            </View>
        )

    }


    deleteImageFromList(item) {
        let self = this;
        let imageList = self.state.invoiceCopyList;
        let newImgList = [];
        let j = 0;
        for (let i = 0; i < imageList.length; i++) {
            if (item.index != i) {
                newImgList[j] = imageList[i]
                j = j + 1
            }
        }
        self.setState({
            invoiceCopyList: newImgList
        })
    }

    openPdfModal(item) {
        this.setState({
            base64ToViePdf: item.item.fileUrl,
            openPdf: true
        })
    }

    openPdfFile() {
        const resourceType = 'base64';
        const resources = {
            //file: Platform.OS === 'ios' ? 'downloadedDocument.pdf' : '/sdcard/Download/downloadedDocument.pdf',
            //url: 'https://www.ets.org/Media/Tests/TOEFL/pdf/SampleQuestions.pdf',
            base64: this.state.base64ToViePdf,
        };

        return (
            <Modal
                onRequestClose={() => this.setState({openPdf: false})}
                isVisible={this.state.openPdf}>
                <View style={{height: '106%', width: '110%', alignSelf: 'center'}}>
                    <View style={[styles.viewStyle, {flexDirection: 'row'}]}>
                        <View style={[styles.viewDetails1,]}>
                            <TouchableOpacity
                                onPress={() => this.setState({openPdf: false})}
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
                                source={require('../../../icons/OyespaceSafe.png')}
                            />
                        </View>
                        <View style={{flex: 0.2}}>
                            {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
                        </View>
                    </View>
                    <PDFView
                        fadeInDuration={250.0}
                        style={{flex: 1}}
                        resource={resources[resourceType]}
                        resourceType={resourceType}
                        onLoad={() => console.log(`PDF rendered from server ${resourceType}`)}
                        onError={(error) => console.log('Cannot render PDF', error)}
                    />
                </View>

            </Modal>
        )

    }


    openIOSCalenderAdd() {
        return (
            <Modal
                visible={this.state.isCalenderOpenAdd}
                onRequestClose={this.close}>
                <View style={PatrollingReportStyles.ModalMainView}>
                    <View style={{flex: 1, justifyContent: 'center', width: width - 30}}>
                        <DatePickerIOS
                            date={this.state.expenditureDate}
                            style={{backgroundColor: base.theme.colors.white}}
                            maximumDate={_dt}
                            mode="date"
                            onDateChange={(date) => {
                                this.setState({expenditureDate: date})
                            }}/>
                        <TouchableHighlight onPress={() => this.closeIOSCalenderAdd()} underlayColor='transparent'>
                            <View style={[PatrollingReportStyles.modalView, {width: width - 30}]}>
                                <Text
                                    style={PatrollingReportStyles.modalText}>{moment(this.state.expenditureDate).format("MMM DD YYYY")}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }

    closeIOSCalenderAdd() {
        this.setState({
            isCalenderOpenAdd: false,
        })
    }

    openCalenderAdd() {
        let dt = new Date();
        dt.setDate(dt.getDate());
        let _dt = dt;
        let self = this;
        Platform.OS === 'ios' ? (self.setState({isCalenderOpenAdd: true})) : self.showPickerAdd('cal', {
            date: _dt,
            maxDate: _dt
        });
    }

    showPickerAdd = async (stateKey, options) => {
        try {
            const {action, year, month, day} = await DatePickerAndroid.open(options);
            if (action === DatePickerAndroid.dismissedAction) {
            } else {
                let date = new Date(year, month, day);
                this.setState({expenditureDate: date})
            }
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    };


    clearAllFields() {
        let self = this;
        self.setState({
            expHead: '',
            expDesc: '',
            amountPaid: '',
            payMethodId: '',
            payeeName: '',
            uploadedFile: '',
            expenditureDate: _dt,
            invoiceCopyList: [],
            blockIdAdd: '',
            invoiceNum: '',
            selectedBlockAdd: 'Select Block',
            selectedExpRecType: 'Expense Recurrence Type',
            selectedAppList: 'Applicable to Unit',
            selectedExpType: 'Expense Type',
            selDistribution: 'Select Distribution Type',
            selectedBank: 'Select Bank',
            selPayeeBank: 'Payee Bank Name',
            selPayMethod: 'Select Payment Method',
            selExpenseId:self.state.isEditExpense?self.state.selExpenseId:'',
        });
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

export default (connect(mapStateToProps)(Expenses));
