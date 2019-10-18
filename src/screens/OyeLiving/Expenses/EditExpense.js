import React, { Component } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Platform,
    ScrollView, TextInput, SafeAreaView, DatePickerAndroid, DatePickerIOS, TouchableHighlight,Linking
} from 'react-native';
import AddExpenseStyles from './AddExpenseStyles'
import base from "../../../base";
import {Dropdown} from "react-native-material-dropdown";
import DocumentPicker from "react-native-document-picker";
import OSButton from "../../../components/osButton/OSButton";
import {connect} from "react-redux";
import moment from "moment";
import Modal from "react-native-modal";
import PatrollingReportStyles from "../../Patrolling/PatrollingReportStyles";
import ImagePicker from "react-native-image-picker";
import {FlatList} from "react-native-gesture-handler";
import CreateSOSStyles from "../../SOS/CreateSOSStyles";
import {heightPercentageToDP} from "react-native-responsive-screen";
import Collapsible from "react-native-collapsible";
const {height, width} = Dimensions.get('screen');
let RNFS = require('react-native-fs');



let dt = new Date();
dt.setDate(dt.getDate());
let _dt = dt;

class EditExpense extends Component {
    constructor(props) {
        super(props);

        this.state={
            blockList:[],
            selectedBlock:'',
            blockId:'',
            poNumberList:[{value:'PO1',details:'PO1'},{value:'PO2',details:'PO2'}],
            selectedPoNum:'PO1',
            expRecurrenceType:[],
            selectedExpRecType:'',
            expRecurrenceId:'',
            expAppList:[],
            selectedAppList:'',
            expApplicabilityId:'',
            expType:[{value:'Fixed',details:'E1'},{value:'Variable',details:'E2'}],
            selectedExpType:'',
            distributionType:[{value:'Dimension Based',details:'D1'},{value:'Per Unit',details:'D2'}],
            selDistribution:'',
            selectBankList:[{value:'SBI',details:'B1'},{value:'Andra Bank',details:'B2'},{value:'ICICI Bank',details:'B3'},{value:'HDFC Bank',details:'B3'},
                {value:'AXIS Bank',details:'B5'},{value:'Canera Bank',details:'B6'}],
            selectedBank:'',
            payeeBankList:[{value:'SBI',details:'B1'},{value:'Andra Bank',details:'B2'},{value:'ICICI Bank',details:'B3'},{value:'HDFC Bank',details:'B3'},
                {value:'AXIS Bank',details:'B5'},{value:'Canera Bank',details:'B6'}],
            selPayeeBank:'',
            paymentMethodList:[],
            selPayMethod:'',
            payMethodId:'',
            payeeName:'',
            expenditureDate:_dt,
            bpIdentifier:'',
            raBudget:'',
            vendorName:'',
            poValue:'',
            expHead:'',
            expDesc:'',
            amountPaid:'',
            isCalenderOpen:false,
            invoiceNum:'',
            invoiceCopyList:[],
            uploadedFile:'',
            isModalOpen:false,
            isCollapse:false,
            expenseId:''
        }
    }

    componentWillMount() {
        console.log('Props in edit screen',this.props)
        //this.setTheValues();
        this.getTheBlockList();
        this.getExpenseRecurrenceType();
        this.getExpenseApplicableUnitList();
        this.getPaymentMethodsList();
    }

    setTheValues(){
        let self=this;
        self.setState({
            selectedBlock:'',
            blockId:'',
            poNumberList:[{value:'PO1',details:'PO1'},{value:'PO2',details:'PO2'}],
            selectedPoNum:'PO1',
            expRecurrenceType:[],
            selectedExpRecType:'',
            expRecurrenceId:'',
            expAppList:[],
            selectedAppList:'',
            expApplicabilityId:'',
            expType:[{value:'Fixed',details:'E1'},{value:'Variable',details:'E2'}],
            selectedExpType:'',
            distributionType:[{value:'Dimension Based',details:'D1'},{value:'Per Unit',details:'D2'}],
            selDistribution:'',
            selectBankList:[{value:'SBI',details:'B1'},{value:'Andra Bank',details:'B2'},{value:'ICICI Bank',details:'B3'},{value:'HDFC Bank',details:'B3'},
                {value:'AXIS Bank',details:'B5'},{value:'Canera Bank',details:'B6'}],
            selectedBank:'',
            payeeBankList:[{value:'SBI',details:'B1'},{value:'Andra Bank',details:'B2'},{value:'ICICI Bank',details:'B3'},{value:'HDFC Bank',details:'B3'},
                {value:'AXIS Bank',details:'B5'},{value:'Canera Bank',details:'B6'}],
            selPayeeBank:'',
            paymentMethodList:[],
            selPayMethod:'',
            payMethodId:'',
            payeeName:'',
            expenditureDate:_dt,
            bpIdentifier:'',
            raBudget:'',
            vendorName:'',
            poValue:'',
            expHead:'',
            expDesc:'',
            amountPaid:'',
            isCalenderOpen:false,
            invoiceNum:'',
            invoiceCopyList:[],
            uploadedFile:'',
            isModalOpen:false,
            isCollapse:false,
            expenseId:''
        })
    }

    async getTheBlockList(){
        let stat = await base.services.OyeLivingApi.getTheListOfBlocksByAssociation(this.props.userReducer.SelectedAssociationID)
        console.log('Get the block list',stat)
        try{
            if(stat.success && stat.data.blocksByAssoc.length!==0){
                let blockList=[];
                let data=stat.data.blocksByAssoc;
                for(let i=0; i<data.length;i++){
                    blockList.push({value: data[i].blBlkName,
                        details: data[i]})
                }
                this.setState({
                    blockList:blockList
                })
            }
        }
        catch(error){
            console.log('error',error)
        }

    }
    async getExpenseRecurrenceType(){
        let stat = await base.services.OyeLivingApi.getExpenseRecTypeList(this.props.userReducer.SelectedAssociationID)
        console.log('Get the block list1',stat)
        try{
            if(stat.success && stat.data.expenseReccurrance.length!==0){
                let expRecurrence=[];
                let data=stat.data.expenseReccurrance;

                for(let i=0; i<data.length;i++){
                    expRecurrence.push({value: data[i].erType,
                        details: data[i]})
                }
                this.setState({
                    expRecurrenceType:expRecurrence
                })
            }
        }
        catch(error){
            console.log('error',error)
        }

    }
    async getExpenseApplicableUnitList(){
        let stat = await base.services.OyeLivingApi.getExpenseApplicabilityList(this.props.userReducer.SelectedAssociationID)
        console.log('Get the block list2',stat)
        try{
            if(stat.success && stat.data.expenseApplicabilites.length!==0){
                let expAppList=[];
                let data=stat.data.expenseApplicabilites;

                for(let i=0; i<data.length;i++){
                    expAppList.push({value: data[i].eaApplTo,
                        details: data[i]})
                }
                this.setState({
                    expAppList:expAppList
                })
            }
        }
        catch(error){
            console.log('error',error)
        }

    }
    async getPaymentMethodsList(){
        let stat = await base.services.OyeLivingApi.getPaymentMethodList(this.props.userReducer.SelectedAssociationID)
        console.log('Get the block list3',stat)
        try{
            if(stat.success && stat.data.paymentMethod.length!==0){
                let paymentList=[];
                let data=stat.data.paymentMethod;

                for(let i=0; i<data.length;i++){
                    paymentList.push({value:data[i].pmName,
                        details: data[i]})
                }
                this.setState({
                    paymentMethodList:paymentList
                })
            }
        }
        catch(error){
            console.log('error',error)
        }
    }

    async updateExpense(){
        console.log('State of variables',this.state.uploadedFile)
        let input = {
            "EXHead"    : this.state.expHead,
            "EXDesc"    : this.state.expDesc,
            "EXPAmnt"   : this.state.amountPaid,
            "EXApplTO"  : this.state.selectedAppList,
            "EXRecurr"  : this.state.selectedExpRecType,
            "EXType"    : this.state.expType,
            "BABName"   : this.state.selectedBank,
            "PMID"      : this.state.payMethodId,
            "EXPName"   : this.state.payeeName,
            "EXPBName"  : this.state.selPayeeBank,
            "EXChqNo"   : "sdf",
            "EXChqDate" : moment(this.state.expenditureDate).format('YYYY-MM-DD'),
            "EXPyCopy"  : this.state.uploadedFile,
            "VNName"    : '',
            "EXDisType" : this.state.selDistribution,
            "UNUnitID"  : this.props.dashboardReducer.uniID,
            "BLBlockID" : this.state.blockId,
            "ASAssnID"  : this.props.userReducer.SelectedAssociationID,
            "EXID"      : this.state.expenseId
        };
        let stat = await base.services.OyeLivingApi.updateExpense(input)
        console.log('Get the expense response',stat)
        try{
            if(stat.success){
                console.log('Move to Expenses page')
                this.props.navigation.navigate('expenses')
            }
        }
        catch(error){

        }

    }


    async selectFile(){
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            console.log(
                "File Selected",res,
                res.uri,
                res.type, // mime type
                res.name,
                res.size
            );
            this.uploadFile(res)
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }

    selectImage() {
        console.log('Set Image');
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
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
            } else if (response.error) {
            } else if (response.customButton) {
            } else {
                console.log('ImagePicker : ', response);
                this.setState({
                    photo: response.uri,
                    photoDetails: response,
                    isPhotoAvailable: true,
                    imagePath: response.path
                }, () => self.uploadFile(response));

            }
        });

    }

    async uploadFile(response) {
        let self = this;
        let source = (Platform.OS === 'ios') ? response.uri : response.uri;
        const form = new FormData();
        let imgObj = {
            name: (response.fileName || response.name !== undefined) ? response.fileName? response.fileName:response.name : "XXXXX.jpg",
            uri: source,
            type: (response.type !== undefined || response.type != null) ? response.type : "image/jpeg"
        };
        form.append('image', imgObj);
        console.log('Form object',imgObj)
        let stat = await base.services.MediaUploadApi.uploadRelativeImage(form);
        console.log('Photo upload response', stat);
        if (stat) {
            try {
                let img=this.state.invoiceCopyList;
                img.push({fileUrl:response.fileName?response.uri:stat,type:response.fileName?'Image':'Pdf'})
                self.setState({
                    uploadedFile:this.state.uploadedFile !=''?this.state.uploadedFile+','+stat:stat,
                    invoiceCopyList:img,
                })
            } catch (err) {
                console.log('err', err)
            }
        }

    }

    render() {
        return(
            <SafeAreaView style={AddExpenseStyles.safeArea}>
                <View style={AddExpenseStyles.headerView}>
                    <Text style={AddExpenseStyles.headerText}>Add Expense</Text>
                </View>
                <View style={AddExpenseStyles.subHeadView}>
                    <Text style={AddExpenseStyles.subHeadText}>Expense Details</Text>
                </View>
                <ScrollView style={AddExpenseStyles.mainContainer}
                            showsVerticalScrollIndicator={false}>
                    <View style={[AddExpenseStyles.scrollContainer]} >
                        <View style={{width:'100%'}}>
                            <Dropdown
                                value={'Select Block*'} //this.state.selectedBlock
                                labelFontSize={18}
                                labelPadding={-5}
                                placeHolder={'Selected Block'}
                                baseColor="rgba(0, 0, 0, 1)"
                                data={this.state.blockList}
                                containerStyle={{
                                    width: '100%',
                                }}
                                textColor={base.theme.colors.black}
                                inputContainerStyle={{
                                    borderColor:base.theme.colors.lightgrey,
                                }}
                                dropdownOffset={{ top: 10, left: 0 }}
                                dropdownPosition={-5}
                                rippleOpacity={0}
                                onChangeText={(value, index) => {
                                    this.setState({
                                        selectedBlock:value,
                                        blockId:this.state.blockList[index].details.blBlockID
                                    })
                                }}
                            />
                        </View>
                        <View style={{backgroundColor:base.theme.colors.lightgrey}}>
                            <View style={{width:'100%'}}>
                                <Dropdown
                                    value={'PO Number *'} //this.state.selectedPoNum
                                    labelFontSize={18}
                                    labelPadding={-5}
                                    baseColor="rgba(0, 0, 0, 1)"
                                    data={this.state.poNumberList}
                                    containerStyle={{
                                        width: '100%',
                                    }}
                                    textColor={base.theme.colors.black}
                                    inputContainerStyle={{
                                        borderColor:base.theme.colors.lightgrey,
                                    }}
                                    dropdownOffset={{ top: 10, left: 0 }}
                                    dropdownPosition={ -3}
                                    rippleOpacity={0}
                                    onChangeText={(value, index) => {
                                        this.setState({
                                            selectedPoNum:value
                                        })
                                    }}
                                    disabled={true}
                                />
                            </View>
                            <View style={AddExpenseStyles.textInputView}>
                                <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left',}}>Budget Projection Identifier
                                    <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                <TextInput
                                    style={{height:30, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey,paddingBottom:5}}
                                    onChangeText={(text) => this.setState({bpIdentifier: text})}
                                    value={this.state.bpIdentifier}
                                    placeholder="Budget Projection Identifier"
                                    placeholderTextColor={base.theme.colors.grey}
                                    editable={false}
                                />
                            </View>
                            <View style={AddExpenseStyles.textInputView}>
                                <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left',paddingTop:5}}>Remaining Approved Budget
                                    <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                <TextInput
                                    style={{height:30, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey,paddingBottom:5}}
                                    onChangeText={(text) => this.setState({raBudget: text})}
                                    value={this.state.raBudget}
                                    placeholder="Remaining Approved Budget"
                                    placeholderTextColor={base.theme.colors.grey}
                                    editable={false}
                                />
                            </View>
                            <View style={AddExpenseStyles.textInputView}>
                                <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left',paddingTop:5,}}>Vendor Name
                                    <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                <TextInput
                                    style={{height:30, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey,paddingBottom:5
                                    }}
                                    onChangeText={(text) => this.setState({vendorName: text})}
                                    value={this.state.vendorName}
                                    placeholder="Vendor Name"
                                    placeholderTextColor={base.theme.colors.grey}
                                    editable={false}
                                />
                            </View>
                            <View style={AddExpenseStyles.textInputView}>
                                <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left',paddingTop:5,}}>PO Value
                                    <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                <TextInput
                                    style={{height:30, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey,paddingBottom:5
                                    }}
                                    onChangeText={(text) => this.setState({poValue: text})}
                                    value={this.state.poValue}
                                    placeholder="PO Value"
                                    placeholderTextColor={base.theme.colors.grey}
                                    editable={false}
                                />
                            </View>
                        </View>
                        <View style={AddExpenseStyles.textInputView}>
                            <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left',paddingTop:5,}}>Expense Head
                                <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                            <TextInput
                                style={{height:30, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey,paddingBottom:5
                                }}
                                onChangeText={(text) => this.setState({expHead: text})}
                                value={this.state.expHead}
                                placeholder="Expense Head"
                                placeholderTextColor={base.theme.colors.grey}
                            />
                        </View>
                        <View style={AddExpenseStyles.textInputView}>
                            <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left',paddingTop:5,}}>Expense Description
                                <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                            <TextInput
                                style={{height:30, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey,paddingBottom:5
                                }}
                                onChangeText={(text) => this.setState({expDesc: text})}
                                value={this.state.expDesc}
                                placeholder="Expense Description"
                                placeholderTextColor={base.theme.colors.grey}
                            />
                        </View>
                        <View style={{paddingTop:5,paddingBottom:5,width:'100%'}}>
                            <Dropdown
                                value={'Expense Recurrence Type *'} //this.state.selectedExpRecType
                                labelFontSize={18}
                                labelPadding={-5}
                                baseColor="rgba(0, 0, 0, 1)"
                                data={this.state.expRecurrenceType}
                                containerStyle={{
                                    width: '100%',
                                }}
                                textColor={base.theme.colors.black}
                                inputContainerStyle={{
                                    borderColor:base.theme.colors.lightgrey,
                                }}
                                dropdownOffset={{ top: 10, left: 0 }}
                                dropdownPosition={ -5}
                                rippleOpacity={0}
                                onChangeText={(value, index) => {
                                    this.setState({
                                        selectedExpRecType:value,
                                        expRecurrenceId:this.state.expRecurrenceType[index].details.erid
                                    })
                                }}
                            />
                        </View>
                        <View style={{width:'100%',flexDirection:'row'}}>
                            <Dropdown
                                value={'Applicable to Unit *'} //this.state.selectedAppList
                                labelFontSize={18}
                                labelPadding={-5}
                                baseColor="rgba(0, 0, 0, 1)"
                                data={this.state.expAppList}
                                containerStyle={{
                                    width: '50%',
                                }}
                                textColor={base.theme.colors.black}
                                inputContainerStyle={{
                                    borderColor:base.theme.colors.lightgrey,
                                }}
                                dropdownOffset={{ top: 10, left: 0 }}
                                dropdownPosition={ -5}
                                rippleOpacity={0}
                                onChangeText={(value, index) => {
                                    this.setState({
                                        selectedAppList:value,
                                        expApplicabilityId:this.state.expAppList[index].details.eaid,                                })
                                }}
                            />
                            <Dropdown
                                value={'Expense Type *'} //this.state.selectedExpType
                                labelFontSize={18}
                                labelPadding={-5}
                                baseColor="rgba(0, 0, 0, 1)"
                                data={this.state.expType}
                                containerStyle={{
                                    width: '50%',
                                }}
                                textColor={base.theme.colors.black}
                                inputContainerStyle={{
                                    borderColor:base.theme.colors.lightgrey,
                                }}
                                dropdownOffset={{ top: 10, left: 0 }}
                                dropdownPosition={ -3}
                                rippleOpacity={0}
                                onChangeText={(value, index) => {
                                    this.setState({
                                        selectedExpType:value
                                    })
                                }}
                            />
                        </View>
                        <View style={{width:'100%',flexDirection:'row',}}>
                            <View style={{width:'70%',}}>
                                <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left',paddingTop:5,}}>Amount Paid
                                    <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                <TextInput
                                    style={{height:30, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey,paddingBottom:5
                                    }}
                                    onChangeText={(text) => this.setState({amountPaid: text})}
                                    value={this.state.amountPaid}
                                    placeholder="Amount Paid"
                                    placeholderTextColor={base.theme.colors.grey}
                                    keyboardType={'numeric'}
                                />
                            </View>
                            <Image
                                style={{height:50,width:50, marginLeft:30}}
                                source={require('../../../../icons/rupee1.png')}
                            />
                        </View>
                        <View style={{paddingTop:5,paddingBottom:5,width:'100%'}}>
                            <Dropdown
                                value={'Select Distribution Type *'} //this.state.selDistribution
                                labelFontSize={18}
                                labelPadding={-5}
                                baseColor="rgba(0, 0, 0, 1)"
                                data={this.state.distributionType}
                                containerStyle={{
                                    width: '100%',
                                }}
                                textColor={base.theme.colors.black}
                                inputContainerStyle={{
                                    borderColor:base.theme.colors.lightgrey,
                                }}
                                dropdownOffset={{ top: 10, left: 0 }}
                                dropdownPosition={ -3}
                                rippleOpacity={0}
                                onChangeText={(value, index) => {
                                    this.setState({
                                        selDistribution:value
                                    })
                                }}
                            />
                        </View>
                        <View style={{paddingTop:5,paddingBottom:5,width:'100%'}}>
                            <Dropdown
                                value={'Select Bank *'} //this.state.selectedExpRecType
                                labelFontSize={18}
                                labelPadding={-5}
                                baseColor="rgba(0, 0, 0, 1)"
                                data={this.state.selectBankList}
                                containerStyle={{
                                    width: '100%',
                                }}
                                textColor={base.theme.colors.black}
                                inputContainerStyle={{
                                    borderColor:base.theme.colors.lightgrey,
                                }}
                                dropdownOffset={{ top: 10, left: 0 }}
                                dropdownPosition={ -5}
                                rippleOpacity={0}
                                onChangeText={(value, index) => {
                                    this.setState({
                                        selectedBank:value
                                    })
                                }}
                            />
                        </View>
                        <View style={{width:'100%',flexDirection:'row'}}>
                            <View style={{width:'70%',flexDirection:'row'}}>

                                <Dropdown
                                    value={'Select Payment Method *'} //this.state.selPayMethod
                                    labelFontSize={18}
                                    labelPadding={-5}
                                    baseColor="rgba(0, 0, 0, 1)"
                                    data={this.state.paymentMethodList}
                                    containerStyle={{
                                        width: '100%',
                                    }}
                                    textColor={base.theme.colors.black}
                                    inputContainerStyle={{
                                        borderColor:base.theme.colors.lightgrey,
                                    }}
                                    dropdownOffset={{ top: 10, left: 0 }}
                                    dropdownPosition={ -5}
                                    rippleOpacity={0}
                                    onChangeText={(value, index) => {
                                        this.setState({
                                            selPayMethod:value,
                                            payMethodId:this.state.paymentMethodList[index].details.pmid,                                })
                                    }}
                                />
                            </View>
                            <Image
                                style={{height:50,width:50, marginLeft:30}}
                                source={require('../../../../icons/atm_card.png')}
                            />
                        </View>
                        <View style={AddExpenseStyles.textInputView}>
                            <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left',paddingTop:5,}}>Payee Name
                                <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                            <TextInput
                                style={{height:30, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey,paddingBottom:5
                                }}
                                onChangeText={(text) => this.setState({payeeName: text})}
                                value={this.state.payeeName}
                                placeholder="Payee Name"
                                placeholderTextColor={base.theme.colors.grey}
                            />
                        </View>
                        <View style={{paddingTop:5,paddingBottom:5,width:'100%',flexDirection:'row'}}>
                            {/*
                        <Text style={{color: base.theme.colors.primary, fontSize: 14,position:'absolute',marginLeft:140,marginTop:16}}>*</Text>
*/}
                            <Dropdown
                                value={'Payee Bank Name *'} //this.state.selPayeeBank
                                labelFontSize={18}
                                labelPadding={-5}
                                baseColor="rgba(0, 0, 0, 1)"
                                data={this.state.payeeBankList}
                                containerStyle={{
                                    width: '100%',
                                }}
                                textColor={base.theme.colors.black}
                                inputContainerStyle={{
                                    borderColor:base.theme.colors.lightgrey,
                                }}
                                dropdownOffset={{ top: 10, left: 0 }}
                                dropdownPosition={ -5}
                                rippleOpacity={0}
                                onChangeText={(value, index) => {
                                    this.setState({
                                        selPayeeBank:value
                                    })
                                }}
                            />
                        </View>
                        <View style={[AddExpenseStyles.textInputView, {flexDirection:'row',borderBottomWidth: 1,
                            borderColor: base.theme.colors.lightgrey,alignItems:'flex-end',justifyContent:'space-between'}]}>
                            <View>
                                <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left',paddingTop:5,}}>Expenditure Date
                                    <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                <TextInput
                                    style={{height:30, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey,paddingBottom:5
                                    }}
                                    value={moment( this.state.expenditureDate).format("MMM DD YYYY")}
                                    placeholder="Expenditure Date"
                                    placeholderTextColor={base.theme.colors.grey}
                                    editable={false}
                                />
                            </View>
                            <TouchableOpacity onPress={() => this.openCalender()}>
                                <Image
                                    style={{height:25,width:25,marginBottom:7}}
                                    source={require('../../../../icons/calender.png')}
                                />
                            </TouchableOpacity>
                            {(Platform.OS === 'ios') ? this.openIOSCalender() : <View/>}
                        </View>
                        <View style={AddExpenseStyles.textInputView}>
                            <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left',paddingTop:5,}}>Invoice No / Receipt No</Text>
                            <TextInput
                                style={{height:30, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey,paddingBottom:5
                                }}
                                onChangeText={(text) => this.setState({invoiceNum: text})}
                                value={this.state.invoiceNum}
                                placeholder="Invoice No / Receipt No"
                                placeholderTextColor={base.theme.colors.grey}
                            />
                        </View>
                        <View style={[AddExpenseStyles.textInputView,{paddingTop:25,paddingBottom:10}]}>
                            <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left',paddingTop:5,}}>Invoice / Payment Copy</Text>
                        </View>
                        <View style={{borderRadius: 5,flexDirection:'row',borderStyle:'dashed',height:80,width:'95%',alignSelf:'center',
                            borderWidth:1.8,borderColor:base.theme.colors.blue,alignItems:'center',justifyContent:'center',marginBottom:this.state.isCollapse?0:60}}>
                            {this.state.invoiceCopyList.length !==0 ?
                                <FlatList
                                    keyExtractor={(item, index) => index.toString()}
                                    data={this.state.invoiceCopyList}
                                    renderItem={(item, index) => this.renderImages(item, index)}
                                    horizontal={true}
                                />
                                : <View/>}
                            {this.state.invoiceCopyList.length===5?
                                <View/>:
                                <TouchableOpacity onPress={() => this.setState({isCollapse:!this.state.isCollapse})}>
                                    <Image borderStyle
                                           style={{height:30,width:30,tintColor:base.theme.colors.blue}}
                                           source={require('../../../../icons/add.png')}
                                    />
                                </TouchableOpacity>}
                        </View>
                        {this.state.isCollapse ||( this.state.invoiceCopyList.length<=5 && this.state.invoiceCopyList.length!==0)?
                            <View style={{flexDirection:'row',width:'100%',height:'8%',borderRadius:20,alignSelf:'center',
                                marginBottom:60,alignItems:'center',justifyContent:'center',borderColor:base.theme.colors.lightgrey,
                                shadowColor:base.theme.colors.darkgrey,
                                shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 2},
                                shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.6,
                                shadowRadius: 2,elevation:5}}>
                                <TouchableOpacity  onPress={() => this.selectFile()}>
                                    <Image borderStyle
                                           style={{height:50,width:50,}}
                                           source={require('../../../../icons/upload.png')}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.selectImage()}>
                                    <Image borderStyle
                                           style={{height:50,width:50, marginLeft:10}}
                                           source={require('../../../../icons/camera.png')}
                                    />
                                </TouchableOpacity>
                            </View>:<View/>}
                    </View>
                    <View style={{alignSelf:'center',width:'70%',flexDirection:'row',paddingTop:25,paddingBottom:25,alignItems:'center',justifyContent:'space-between',
                        marginBottom:30,paddingLeft:15,paddingRight:15}}>
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
                            oSBText={'Update Expense'}
                            onButtonClick={() => this.updateExpense()}/>
                    </View>
                    {this._renderModal1()}
                </ScrollView>

            </SafeAreaView>
        )
    }

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
        console.log("Sele:", imageURI);
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
        console.log('Images list ',item)
        let imageURI = {uri: item.item.fileUrl};

        return (
            item.item.type !='Pdf'?
                <TouchableHighlight
                    onPress={() => this._enlargeImage(imageURI)}
                    style={{height: 90, width: 90, flexDirection: 'row', justifyContent: "space-around", marginLeft: 10}}>
                    <Image
                        style={CreateSOSStyles.imageView}
                        source={imageURI}
                    />
                </TouchableHighlight >
                :
                <TouchableOpacity onPress={() => {
                    Linking.openURL('https://mediaupload.oyespace.com/'+item.item.fileUrl)
                }}>
                    <Image
                        style={CreateSOSStyles.imageView}
                        source={require('../../../../icons/camera.png')}
                    />
                </TouchableOpacity>
        )

    }


    openIOSCalender() {
        return (
            <Modal
                visible={this.state.isCalenderOpen}
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
                        <TouchableHighlight onPress={() => this.closeIOSCalender()} underlayColor='transparent'>
                            <View style={[PatrollingReportStyles.modalView, {width: width - 30}]}>
                                <Text
                                    style={PatrollingReportStyles.modalText}>{moment( this.state.expenditureDate).format("MMM DD YYYY")}</Text>
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

    openCalender() {
        let dt = new Date();
        dt.setDate(dt.getDate());
        let _dt = dt;
        let self = this;
        Platform.OS === 'ios' ? (self.setState({isCalenderOpen: true})) : self.showPicker('cal', {
            date: _dt,
            maxDate: _dt
        });
    }

    showPicker = async (stateKey, options) => {
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



    clearAllFields(){
        let self=this;
        self.setState({
            expHEAD:'',
            expDesc:'',
            amountPaid:'',
            selectedAppList:'',
            selectedExpRecType:'',
            expType:'',
            selectedBank:'',
            payMethodId:'',
            payeeName:'',
            selPayeeBank:'',
            uploadedFile:'',
            expenditureDate:_dt,
            invoiceCopyList:[],
            selDistribution:'',
            blockId:''
        });
    }



}

const mapStateToProps = state => {
    return {
        dashBoardReducer: state.DashboardReducer,
        userReducer: state.UserReducer,
    };
};
export default connect(mapStateToProps)(EditExpense)