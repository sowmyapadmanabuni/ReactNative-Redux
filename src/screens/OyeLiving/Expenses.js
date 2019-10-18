/*
 * @Author: Sarthak Mishra 
 * @Date: 2019-10-07 11:58:24 
 * @Last Modified by: Sarthak Mishra
 * @Last Modified time: 2019-10-09 13:05:47
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
import { Dropdown } from 'react-native-material-dropdown';
import Modal from 'react-native-modal';
import {
    heightPercentageToDP,
    heightPercentageToDP as hp, widthPercentageToDP,
    widthPercentageToDP as wp
} from "react-native-responsive-screen";
import { connect } from 'react-redux';
import ProgressLoader from 'rn-progress-loader';
import base from '../../base';
import SelectMultiple from 'react-native-select-multiple';
import moment from "moment";
import { NavigationActions, SwitchActions} from "react-navigation";
import PatrollingReportStyles from "../Patrolling/PatrollingReportStyles";
import DocumentPicker from "react-native-document-picker";
import ImagePicker from "react-native-image-picker";
import AddExpenseStyles from "./Expenses/AddExpenseStyles";
import OSButton from "../../components/osButton/OSButton";
import CreateSOSStyles from "../SOS/CreateSOSStyles";


const status = ['Invoice Input', 'Review Rejected', 'Review Accepted','Approved','Rejected','Invoiced'];


let dt = new Date();
dt.setDate(dt.getDate());
let _dt = dt;

class Expenses extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            blockList: [],
            selectedBlock:'',
            blockId:'',
            expenseDetail: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            isModalVisible: false,
            collapse1: false,
            amountCollapse:false,
            isChecked: false,
            statusSelected: [],
            expensesList:[],
            expensesAllList:[],
            amountStart:'0',
            amountEnd:'0',
            isTabSelected:0,
            expenseCollapse:false,
            expenseNameFil:'',
            fromDate:_dt,
            toDate:_dt,
            getIndex:0,
            isCalenderOpenAdd:false,
            blockListAdd:[],
            selectedBlockAdd:'',
            blockIdAdd:'',
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
            unitName:'',
            isAddExpenseModal:false,
            isEditExpense:false,
            selectedExpToEdit:{}
        };

        this.bindComponent = this.bindComponent.bind(this);

        console.log("Props in Expenses", props)
    }

    componentWillMount() {
        this.getTheBlockList()
        this.getExpenseRecurrenceType();
        this.getExpenseApplicableUnitList();
        this.getPaymentMethodsList();
        this.getUnitName();
    }

    onSelectionsChange = (statusSelected) => {
        console.log('data@@@@@@',statusSelected)
        this.setState({ statusSelected })
        // this.applyFilters(statusSelected)
    }

    async getTheBlockList(){
        let stat = await base.services.OyeLivingApi.getTheListOfBlocksByAssociation(this.props.userReducer.SelectedAssociationID)
        try{
            if(stat.success && stat.data.blocksByAssoc.length!==0){
                let blockList=[];
                let data=stat.data.blocksByAssoc;

                for(let i=0; i<data.length;i++){
                    blockList.push({value: data[i].blBlkName,
                        details: data[i]})
                }
                console.log('Get the blocks list @@@@@',blockList)
                this.setState({
                    blockList:blockList,
                    blockListAdd:blockList
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
    async getUnitName(){
        console.log('Get Id',this.props)
        let stat = await base.services.OyeLivingApi.getUnitDetailByUnitId(this.props.dashBoardReducer.uniID)
        console.log('Stat in get unit name',stat)
        try{
            if(stat.success && stat.data){
                this.setState({
                    unitName:stat.data.unit.unUniName
                })
            }
        }catch(error){
            console.log('Error',error)
        }
    }

    async createExpense(){
        console.log('State of variables',this.state.uploadedFile)
        let input = {
            //"POEAmnt"   :'',
            //"BPID"      : '',
            "EXHead"    : this.state.expHead,
            "EXDesc"    : this.state.expDesc,
            "EXPAmnt"   : this.state.amountPaid,
            "EXApplTO"  : this.state.selectedAppList,
            "EXRecurr"  : this.state.selectedExpRecType,
            "EXType"    : this.state.selectedExpType,
            "BABName"   : this.state.selectedBank,
            "PMID"      : this.state.payMethodId,
            "EXPName"   : this.state.payeeName,
            "EXPBName"  : this.state.selPayeeBank,
            //"EXChqNo"   : "",
            //"EXChqDate" : moment(this.state.expenditureDate).format('YYYY-MM-DD'),
            "EXPyCopy"  : this.state.uploadedFile,
            "VNName"    : '',
            "EXDisType" : this.state.selDistribution,
            "UNUnitID"  : this.props.dashBoardReducer.uniID,
            "BLBlockID" : this.state.blockIdAdd,
            "ASAssnID"  : this.props.userReducer.SelectedAssociationID,
            "INNumber":this.state.invoiceNum
        };
        console.log('Send the data to create expense',input)
        let stat = await base.services.OyeLivingApi.addNewExpense(input)
        console.log('Get the expense response',stat)
        try{
            if(stat.success){
                console.log('Move to Expenses page')
                this.setState({isAddExpenseModal:false,expHead:'',
                    expDesc:'',
                    amountPaid:'',
                    selectedAppList:'',
                    selectedExpRecType:'',
                    selectedExpType:'',
                    selectedBank:'',
                    payMethodId:'',
                    payeeName:'',
                    selPayeeBank:'',
                    uploadedFile:'',
                    expenditureDate:_dt,
                    invoiceCopyList:[],
                    selDistribution:'',
                    blockIdAdd:'',
                    invoiceNum:'' })

                await this.getTheExpenseList(this.state.selectedBlock, this.state.getIndex)
                //this.props.navigation.navigate('expenses')
            }
        }
        catch(error){
            console.log('Error',error)
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
            this.setState({
                isCollapse:false
            });
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
        self.setState({
            isCollapse:false
        });
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


    async getTheExpenseList(value,index){
        let self=this;
        let blockId=self.state.blockList[index].details.blBlockID;
        console.log('Values of expenses',value,index,blockId)

        let stat = await base.services.OyeLivingApi.getTheExpenseListByBlockId(blockId) //blockId
        try{
            if(stat.success && stat.data.expenseByBlock.length!==0){
                let expensesList=stat.data.expenseByBlock;
                let newList=[]
                for(let i=0; i<expensesList.length;i++){
                    newList.push({item:expensesList[i],open:false})
                }
                self.setState({
                    expensesList:newList,
                    expensesAllList:newList
                });
                console.log('Expense List@@@@',newList)
                self.getSelectedInvoices(self.state.isTabSelected,newList)
            }
        }
        catch(error){
            console.log('error',error)
        }



        this.setState({
            selectedBlock:value,
            blockId:blockId,
            getIndex:index
        })
    }

    async deleteInvoice(expenseId){
        console.log('Delete API call',expenseId,this.state.selectedBlock,this.state.getIndex)
        let self=this;
        let input = {
            "EXID" :expenseId
        };
        let stat = await base.services.OyeLivingApi.deleteInvoice(input)
        console.log('get response delete',stat)
        try{
            if(stat.success){
                await self.getTheExpenseList(self.state.selectedBlock, self.state.getIndex)
            }
        }catch(error){
            console.log('error',error)
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
                <View style={{ height: hp('30'), width: wp('50'), backgroundColor: base.theme.colors.primary, alignSelf: 'center' }}>
                    <Text>I am the modal content!</Text>
                </View>
            </Modal>
        )
    }

    render() {
        console.log("State:@@@@@@", this.props)
        return (
            <View style={{ height:'100%',width:'100%', backgroundColor: this.state.isModalVisible ? "#d1d1d1" : base.theme.colors.white }}>
                    <View>
                        <View style={{ position: 'absolute' }}>
                            {this.renderModal()}
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: wp('95'), alignSelf: 'center' }}>
                            <Dropdown
                                value={'Select Block'}
                                labelFontSize={18}
                                labelPadding={-5}
                                placeHolder={'Selected Block'}
                                baseColor="rgba(0, 0, 0, 1)"
                                data={this.state.blockList}
                                containerStyle={{ width: wp('50') }}
                                textColor={base.theme.colors.black}
                                inputContainerStyle={{
                                    borderBottomColor:base.theme.colors.primary,
                                    borderBottomWidth:1,
                                }}
                                dropdownOffset={{ top: 10, left: 0 }}
                                dropdownPosition={-5}
                                rippleOpacity={0}
                                onChangeText={(value, index) => this.getTheExpenseList(value,index)}
                            />
                            <TouchableOpacity
                                underlayColor={base.theme.colors.transparent}
                                onPress={() => this.onModalOpen()}
                                style={{marginTop:5,
                                    flexDirection: 'row', alignItems: 'center', width: wp('40'),
                                    borderBottomWidth:1, justifyContent: 'space-between', borderBottomColor:base.theme.colors.primary,
                                }}
                            >
                                <Text style={{fontSize:16,marginBottom:5}}>Filter</Text>
                                    <Image
                                        resizeMode={'contain'}
                                        style={{ height:20,width:20,tintColor: base.theme.colors.primary, alignSelf: 'center',marginBottom:5}}
                                        source={require('../../../icons/filter.png')}
                                    />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',width:'100%',height:'7%', backgroundColor:base.theme.colors.lightgrey}}>
                        <TouchableOpacity style={{width:'33.35%',backgroundColor:this.state.isTabSelected===0?base.theme.colors.greyHead:base.theme.colors.greyCard,alignItems:'center',justifyContent:'center'}}
                                          onPress={() => this.getSelectedInvoices(0,this.state.expensesAllList)}
                        >
                            <Text style={{fontSize:14,color:base.theme.colors.blue}}>Invoiced</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width:'33.35%',backgroundColor:this.state.isTabSelected===1?base.theme.colors.greyHead:base.theme.colors.greyCard,alignItems:'center',justifyContent:'center'}}
                                          onPress={() => this.getSelectedInvoices(1,this.state.expensesAllList)}
                        >
                            <Text style={{fontSize:14,color:base.theme.colors.blue}}>Uninvoiced</Text>

                        </TouchableOpacity>
                        <TouchableOpacity style={{width:'33.35%',backgroundColor:this.state.isTabSelected===2?base.theme.colors.greyHead:base.theme.colors.greyCard,alignItems:'center',justifyContent:'center'}}
                                          onPress={() => this.getSelectedInvoices(2,this.state.expensesAllList)}
                        >
                            <Text style={{fontSize:14,color:base.theme.colors.blue}}>All</Text>
                        </TouchableOpacity>

                    </View>
                    <ScrollView style={{height:'90%'}}>
                        {this.state.expensesList.length===0 ?
                            <View style={{alignItems:'center',justifyContent:'center',marginTop:20}}>
                                <Text>No expense details is there</Text>
                            </View>:
                        <FlatList
                            data={this.state.expensesList}
                            extraData={this.state}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={(item) => this.selectedExpense(item)}
                        />}
                    </ScrollView>
                {this.state.isModalVisible ?
                    <View style={{ position:'absolute',height: hp('50'),
                        width: wp('60'), backgroundColor: base.theme.colors.white,
                        alignSelf: 'flex-end' ,marginTop:40}} >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: hp('5'), width: wp('59.5'), backgroundColor: base.theme.colors.shadedWhite, alignItems: 'center', alignSelf: 'center',padding:10 }}>
                            <Text style={{fontSize:14,color:base.theme.colors.black}}>Filter by:</Text>
                            <TouchableHighlight
                                underlayColor={base.theme.colors.transparent}
                                onPress={() => this.clearTheFilters(this.state.isTabSelected,this.state.expensesAllList)}
                            >
                                <Text style={{ color: base.theme.colors.blue }}>Clear All</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                underlayColor={base.theme.colors.transparent}
                                onPress={() => this.applyFilters(this.state.statusSelected)}
                            >
                                <Text style={{ color: base.theme.colors.primary }}>Apply</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={{ padding:15,flexDirection: 'column', justifyContent: 'space-between', width: wp('59.5'), backgroundColor: base.theme.colors.white, alignSelf: 'center',
                            borderBottomWidth:1,borderBottomColor:base.theme.colors.lightgrey }}>
                            <TouchableHighlight
                                underlayColor={base.theme.colors.transparent}
                                onPress={() => {this.setState({ collapse1: !this.state.collapse1 })}}>
                                <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent:'space-between'}}>
                                    <Text style={{fontSize:16, color: base.theme.colors.black }}>Status</Text>
                                    <Image
                                        resizeMode={'contain'}
                                        style={{ height:15, width:15,alignSelf:'center', tintColor: base.theme.colors.black,  }}
                                        source={!this.state.collapse1 ? require('../../../icons/show_less.png') : require('../../../icons/show_more.png')}
                                    />
                                </View>
                            </TouchableHighlight>
                            <Collapsible collapsed={this.state.collapse1}>
                                <SelectMultiple
                                    items={status}
                                    rowStyle={{borderBottomWidth:0,height:30}}
                                    // renderLabel={this.renderLabel}
                                    selectedItems={this.state.statusSelected}
                                    selectedCheckboxStyle={{tintColor:base.theme.colors.blue}}
                                    onSelectionsChange={this.onSelectionsChange} />
                            </Collapsible>
                        </View>
                        <View style={{ padding:15,flexDirection: 'column', justifyContent: 'space-between', width: wp('59.5'), backgroundColor: base.theme.colors.white, alignSelf: 'center',
                            borderBottomWidth:1,borderBottomColor:base.theme.colors.lightgrey }}>
                            <TouchableHighlight
                                underlayColor={base.theme.colors.transparent}
                                onPress={() => this.setState({ amountCollapse: !this.state.amountCollapse })}>
                                <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent:'space-between'}}>
                                    <Text style={{fontSize:16, color: base.theme.colors.black }}>Amount</Text>
                                    <Image
                                        resizeMode={'contain'}
                                        style={{ height: hp('4'), width: wp('4'), tintColor: base.theme.colors.black, }}
                                        source={!this.state.amountCollapse? require('../../../icons/show_less.png') : require('../../../icons/show_more.png')}
                                    />
                                </View>
                            </TouchableHighlight>
                            <Collapsible collapsed={this.state.amountCollapse}>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{fontSize:13,marginRight:2}}>Between</Text>
                                        <TextInput
                                            onChangeText={(text) => this.setState({amountStart:text})}
                                            value={this.state.amountStart}
                                            style={{width:60,fontSize:12,alignItems:'center',justifyContent:'center',height:20,
                                                paddingTop:-10,paddingBottom:-10,borderColor:base.theme.colors.greyHead,borderWidth:1}}
                                            placeholderTextColor={base.theme.colors.grey}
                                            keyboardType={'phone-pad'}
                                        />
                                    <Text style={{fontSize:13,marginRight:2,marginLeft:2}}>To</Text>
                                        <TextInput
                                            onChangeText={(text) => this.setState({amountEnd: text})}
                                            value={this.state.amountEnd}
                                            style={{width:60,fontSize:12,alignItems:'center',justifyContent:'center',height:20,
                                                paddingTop:-10,paddingBottom:-10,borderColor:base.theme.colors.greyHead,borderWidth:1}}
                                            placeholderTextColor={base.theme.colors.grey}
                                            keyboardType={'phone-pad'}
                                        />
                                </View>
                            </Collapsible>
                        </View>
                        <View style={{ padding:15,flexDirection: 'column', justifyContent: 'space-between', width: wp('59.5'), backgroundColor: base.theme.colors.white, alignSelf: 'center',
                            borderBottomWidth:1,borderBottomColor:base.theme.colors.lightgrey }}>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.setState({ expenseCollapse: !this.state.expenseCollapse })}>
                            <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent:'space-between'}}>
                                <Text style={{ color: base.theme.colors.black }}>Expense Name</Text>
                                <Image
                                    resizeMode={'contain'}
                                    style={{ height: hp('4'), width: wp('4'), tintColor: base.theme.colors.black, }}
                                    source={!this.state.expenseCollapse? require('../../../icons/show_less.png') : require('../../../icons/show_more.png')}
                                />
                            </View>
                        </TouchableHighlight>
                        <Collapsible collapsed={this.state.expenseCollapse}>
                            <View style={{flexDirection:'row'}}>
                                    <TextInput
                                        style={{width:150,fontSize:12,alignItems:'center',justifyContent:'center',height:20,
                                            paddingTop:-10,paddingBottom:-10,borderColor:base.theme.colors.greyHead,borderWidth:1}}
                                        onChangeText={(text) => this.setState({expenseNameFil:text})}
                                        value={this.state.expenseNameFil}
                                        placeholderTextColor={base.theme.colors.grey}
                                    />
                            </View>
                        </Collapsible>
                        </View>
                        <View style={{ padding:15,flexDirection: 'column', justifyContent: 'space-between', width: wp('59.5'), backgroundColor: base.theme.colors.white, alignSelf: 'center',
                            borderBottomWidth:1,borderBottomColor:base.theme.colors.lightgrey }}>
                            <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.openCalender(0)}>
                            <View style={{ flexDirection: 'row', alignItems: 'center',marginBottom:10 }}>
                                <Text style={{ color: base.theme.colors.black }}>From Date</Text>
                                <TouchableOpacity onPress={() =>this.openCalender(0)}>
                                    <View style={{flexDirection:'row',width:80,height:20,borderWidth:1,borderColor:base.theme.colors.lightgrey,alignItems:'center'}}>
                                        <Text>{moment(this.state.fromDate).format('DD-MM-YYYY')}</Text>
                                        <Image
                                            resizeMode={'contain'}
                                            style={{ height: hp('5'), width: wp('5'), left: wp('5') }}
                                            source={require('../../../icons/cal.png')}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.openCalender(1)}>
                            <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent:'space-between' }}>
                                <Text style={{ color: base.theme.colors.black }}>To Date</Text>
                                <TouchableOpacity onPress={() =>this.openCalender(1)}>
                                    <View style={{marginRight:'',flexDirection:'row',width:80,height:20,borderWidth:1,borderColor:base.theme.colors.lightgrey,alignItems:'center'}}>
                                        <Text>{moment(this.state.toDate).format('DD-MM-YYYY')}</Text>
                                        <Image
                                            resizeMode={'contain'}
                                            style={{ height: hp('5'), width: wp('5'), }}
                                            source={require('../../../icons/cal.png')}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </TouchableHighlight>
                        </View>
                    </View> : <View />}

              <TouchableOpacity onPress={this.bindComponent}>
                    <Image
                        resizeMode={'contain'}
                        style={{ alignSelf: 'flex-end',height:80,width:80 }}
                        source={require('../../../icons/add_btn.png')}
                    />
                </TouchableOpacity>
                <ProgressLoader
                    visible={this.state.isLoading}
                    isModal={true} isHUD={true}
                    hudColor={"#000000"}
                    color={"#FFFFFF"} />

                    {(Platform.OS === 'ios') ? this.openIOSCalender() : <View/>}
                {this.state.isAddExpenseModal?this.addExpenseScreen():<View/>}

            </View>
        )
    }

    editExpense(selectedExpense){
        console.log('SelectedExpense',selectedExpense)
        let self=this;
        let blockName='';
        for(let i=0;i<this.state.blockListAdd;i++){
            if(selectedExpense.blBlockID===this.state.blockListAdd[i].blBlockID){
               blockName=this.state.blockListAdd[i].blBlkName
            }
        }
        //ImageList array
        self.setState({
            expHead:selectedExpense.exHead,
            expDesc:selectedExpense.exDesc,
            amountPaid:selectedExpense.expAmnt,
            selectedAppList:selectedExpense.exApplTO,
            selectedExpRecType:selectedExpense.exRecurr,
            selectedExpType:selectedExpense.exType,
            selectedBank:selectedExpense.babName,
            payMethodId:selectedExpense.pmid,
            payeeName:selectedExpense.expName,
            selPayeeBank:selectedExpense.expbName,
            uploadedFile:selectedExpense.exPyCopy,
            expenditureDate:selectedExpense.exdCreated,
            invoiceCopyList:[],
            selDistribution:selectedExpense.exDisType,
            blockIdAdd:selectedExpense.blBlockID,
            invoiceNum:selectedExpense.inNumber,
            selectedExpToEdit:selectedExpense,
            isEditExpense:true,
            isAddExpenseModal:true,
            selectedBlockAdd:blockName
        })
    }
    closeExpenseScreen(){
        this.setState({isAddExpenseModal:false,selectedExpToEdit:{},isEditExpense:false})
    }

    addExpenseScreen(){
        let selectedExpense=this.state.selectedExpToEdit
        let isEdit=Object.keys(selectedExpense ).length=== 0;
        console.log('Expense in edit list',this.state,isEdit,selectedExpense,this.state.isEditExpense,this.state.isAddExpenseModal)

        return (
            <Modal
                style={{height:'110%',width:'100%',alignSelf:'center',}}
                visible={this.state.isAddExpenseModal}
                transparent={true}
                onRequestClose={this.close}>
                <View style={{height:'110%',width:'100%',backgroundColor:base.theme.colors.white}}>
                    <SafeAreaView style={AddExpenseStyles.safeArea}>
                        <View style={[styles.viewStyle, {flexDirection: 'row'}]}>
                            <View style={styles.viewDetails1}>
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
                                {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
                            </View>
                        </View>
                        <View style={AddExpenseStyles.headerView}>
                            <Text style={AddExpenseStyles.headerText}>{this.state.isEditExpense?'Edit Expense':'Add Expense'}</Text>
                        </View>
                        <View style={AddExpenseStyles.subHeadView}>
                            <Text style={AddExpenseStyles.subHeadText}>Expense Details</Text>
                        </View>
                        <ScrollView style={AddExpenseStyles.mainContainer}
                                    showsVerticalScrollIndicator={false}>
                            <View style={[AddExpenseStyles.scrollContainer]} >
                                <View style={{width:'100%'}}>
                                    <Dropdown
                                        value={isEdit?'Select Block*':this.state.selectedBlockAdd} //this.state.selectedBlockAdd
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
                                            borderColor:base.theme.colors.lightgrey,
                                        }}
                                        dropdownOffset={{ top: 10, left: 0 }}
                                        dropdownPosition={-5}
                                        rippleOpacity={0}
                                        onChangeText={(value, index) => {
                                            this.setState({
                                                selectedBlockAdd:value,
                                                blockIdAdd:this.state.blockListAdd[index].details.blBlockID
                                            })
                                        }}
                                    />
                                </View>
                                <View style={{backgroundColor:base.theme.colors.greyCard}}>
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
                                            value={selectedExpense.expAmnt}
                                            placeholder="Amount Paid"
                                            placeholderTextColor={base.theme.colors.grey}
                                            keyboardType={'numeric'}
                                        />
                                    </View>
                                    <Image
                                        style={{height:50,width:50, marginLeft:30}}
                                        source={require('../../../icons/rupee1.png')}
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
                                        source={require('../../../icons/atm_card.png')}
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
                                    <TouchableOpacity onPress={() => this.openCalenderAdd()}>
                                        <Image
                                            style={{height:25,width:25,marginBottom:7}}
                                            source={require('../../../icons/calender.png')}
                                        />
                                    </TouchableOpacity>
                                    {(Platform.OS === 'ios') ? this.openIOSCalenderAdd() : <View/>}
                                </View>
                                <View style={AddExpenseStyles.textInputView}>
                                    <Text style={{fontSize: 14, color: base.theme.colors.black, textAlign: 'left',paddingTop:5,}}>Invoice No / Receipt No</Text>
                                    <TextInput
                                        style={{height:30, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey,paddingBottom:5
                                        }}
                                        onChangeText={(text) => this.setState({invoiceNum:text})}
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
                                                   source={require('../../../icons/add.png')}
                                            />
                                        </TouchableOpacity>}
                                </View>
                                {this.state.isCollapse || ( this.state.invoiceCopyList.length<=5 && this.state.invoiceCopyList.length!==0)?
                                    <View style={{flexDirection:'row',width:'100%',height:'8%',borderRadius:20,alignSelf:'center',
                                        marginBottom:60,alignItems:'center',justifyContent:'center',borderColor:base.theme.colors.lightgrey,
                                        shadowColor:base.theme.colors.darkgrey,
                                        shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 2},
                                        shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.6,
                                        shadowRadius: 2,elevation:5}}>
                                        <TouchableOpacity  onPress={() => this.selectFile()}>
                                            <Image borderStyle
                                                   style={{height:50,width:50,}}
                                                   source={require('../../../icons/upload.png')}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.selectImage()}>
                                            <Image borderStyle
                                                   style={{height:50,width:50, marginLeft:10}}
                                                   source={require('../../../icons/camera.png')}
                                            />
                                        </TouchableOpacity>
                                    </View>:<View/>}
                            </View>
                            <View style={{alignSelf:'center',width:'70%',flexDirection:'row',paddingTop:25,paddingBottom:25,alignItems:'center',justifyContent:'space-between',
                                marginBottom:130,paddingLeft:15,paddingRight:15}}>
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
                                    oSBText={!isEdit?'Edit Expense':'Add Expense'}
                                    onButtonClick={() => this.createExpenseValidation()}/>
                            </View>
                            {this._renderModal1()}
                        </ScrollView>
                    </SafeAreaView>
                </View>

            </Modal>
        )
    }

    createExpenseValidation(title, message){

        //Invoice length less than 10

        if(base.utils.validate.isBlank(this.state.expHead)){
            Alert.alert('Expense heading is Mandatory',message)
        }else if(base.utils.validate.isBlank(this.state.expDesc)){
            Alert.alert('Expense Description is Mandatory',message)

        }else if(base.utils.validate.isBlank(this.state.amountPaid)){
            Alert.alert('Amount paid to an expense is Mandatory',message)

        }else if(base.utils.validate.isBlank(this.state.selectedAppList)){
            Alert.alert('Expense Applicability is Mandatory',message)

        }else if(base.utils.validate.isBlank(this.state.selectedExpRecType)){
            Alert.alert('Expense Recurrence is Mandatory',message)

        }else if(base.utils.validate.isBlank(this.state.selectedExpType)){
            Alert.alert('Expense Type is Mandatory', message)

        }else if(base.utils.validate.isBlank(this.state.selectedBank)){
            Alert.alert('Select the bank  is Mandatory',message)
        }else if(base.utils.validate.isBlank(this.state.selDistribution)){
            Alert.alert('Type of distribution is Mandatory',message)
        }else if(base.utils.validate.isBlank(this.state.blockIdAdd)){
            Alert.alert('Please select the block',message)
        }
        else{
            this.createExpense();
        }




    }

    bindComponent() {
        this.setState({
            isAddExpenseModal:true
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
                    console.log('DATES IS COMING',initialDateString,endDateString,this.state.fromDate,date)
                    let duration = moment.duration(endDateString.diff(initialDateString));
                    console.log(duration.as('days'));
                    let difference = duration.as('days');
                    if (difference < 0) {
                        Alert.alert('Please select a valid date')
                    }else{
                        this.setState({toDate: date})
                    }
                }
                else{
                    let initialDateString = moment(date);
                    let endDateString = moment(this.state.toDate);
                    console.log('DATES IS COMING',initialDateString,endDateString,this.state.toDate,date)
                    let duration = moment.duration(endDateString.diff(initialDateString));
                    console.log(duration.as('days'));
                    let difference = duration.as('days');
                    if (difference < 0) {
                        Alert.alert('Please select a valid date')
                    }
                    else{
                        this.setState({fromDate: date})
                    }
                }
            }
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    };

    checkTheValue(start,end,presentExpList){
        console.log('Get the check value',start,end)
        let self=this;
        let diff=end-start;
        //let presentExpList=self.state.expensesList;
        let newExpList=[]
        let j=0;
        if(diff<0){
            Alert.alert('Intial amount must less than end amount')
        }
        else{
            for(let i=0; i<presentExpList.length;i++){
                if(presentExpList[i].item.expAmnt >start && presentExpList[i].item.expAmnt <end){
                    newExpList[j]=presentExpList[i]
                    j=j+1;
                }
            }
            /* self.setState({
                 expensesList:newExpList
             })
             self.onModalOpen();*/
            self.filterByName(newExpList)
        }
    }

    filterByName(newExpList){
        let self=this;
        let nameFilter=self.state.expenseNameFil;
        let listFilByName=[]
        let j=0;
        for(let i=0;i<newExpList.length;i++){
            if(nameFilter==newExpList[i].item.expName){
                listFilByName[j]=newExpList[i]
                j=j++;
            }
        }

        self.onModalOpen();
        self.setState({
            expensesList:listFilByName
        })
    }

    applyFilters(statusFilters){
        let self=this;
        //let statusFilters=self.state.statusSelected;
        let presentList=self.state.expensesList;
        //check the status keyword
        console.log('Get filters list',statusFilters,presentList)
        let filteredList=[];
        let k=0;
         for(let i=0;i<presentList.length;i++){
             for(let j=0;j<statusFilters.length;j++){
                 if(statusFilters[j].value==presentList[i].item.exStatus){
                      filteredList[k]=presentList[i];
                      k=k+1;
                 }
             }
         }
         //this.setState({expensesList:filteredList});
        this.checkTheValue(this.state.amountStart,this.state.amountEnd,filteredList);
        //this.onModalOpen();
    }

    clearTheFilters(id,expensesList){
        let self=this;
        self.setState({
            statusSelected:[],
            amountStart:0,
            amountEnd:0,
            fromDate:_dt,
            toDate:_dt,
            expenseNameFil:''
        });
        self.onModalOpen()
        self.getSelectedInvoices(id,expensesList)
    }




    getSelectedInvoices(id,expensesList){
        console.log('Id###########',id,expensesList);
        let self=this;
        let listOfExpenses=[];
        if(id===0){
            let j=0;
            for(let i=0; i<expensesList.length;i++){
              if(expensesList[i].exIsInvD){
                 listOfExpenses[j]=expensesList[i]
                  j=j+1;
              }
            }
        }else if(id===1){
            let j=0;
            for(let i=0; i<expensesList.length;i++){
                if(!expensesList[i].exIsInvD){
                    listOfExpenses[j]=expensesList[i]
                    j=j+1;
                }
            }
        }else if(id===2){
            listOfExpenses=expensesList;
        }

        console.log('Expenses List',id,listOfExpenses)

        self.setState({
            isTabSelected:id,
            expensesList:listOfExpenses
        })
    }



    selectedExpense(item){
        let selectedExpense=item.item.item;
        console.log('Get the selected expense',selectedExpense,item.item.item,item.item.open);

        return(
            <TouchableOpacity style={{borderRadius:5,borderColor:base.theme.colors.lightgrey,backgroundColor:base.theme.colors.white,
                shadowColor:base.theme.colors.greyCard,
                shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 2},
                shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.2,
                shadowRadius:1,elevation:5,padding:5,borderBottomWidth:0.5,marginBottom:10}}
                              onPress={() =>this.toggleCollapsible(item.index,item.item.open)}>
            <View style={{flexDirection:'row',marginTop:10}}>
                <View style={{marginLeft:5}} >
                    <Image
                        style={{ height: 20, width:20, }}
                        source={require('../../../icons/OyeLiving.png')}
                    />
                </View>
                <View style={{marginLeft:5,marginRight:5}}>
                    <Text style={{fontSize:14,color:base.theme.colors.black,paddingBottom:5,fontWeight:'bold'}} numberOfLines={1}>
                        {selectedExpense.exHead}
                    </Text>
                    <Text style={{fontSize:12,color:base.theme.colors.black,paddingBottom:3}}>Status:
                        <Text style={{color:selectedExpense.exStatus=="Review Rejected"?base.theme.colors.red:base.theme.colors.blue}}>{selectedExpense.exStatus}</Text></Text>
                    <Text style={{fontSize:12,color:base.theme.colors.black,paddingBottom:3}}>Amount: <Text style={{fontWeight:'bold'}}> {base.utils.strings.rupeeIconCode}{selectedExpense.expAmnt}</Text></Text>
                    <Collapsible duration={100} collapsed={!item.item.open}>
                        <Text style={{fontSize:12,color:base.theme.colors.black,paddingBottom:3}}>Invoice Date:
                            <Text style={{color:base.theme.colors.black}}> {moment(selectedExpense.exdCreated).format('DD-MM-YYYY')}</Text></Text>
                        <Text style={{fontSize:12,color:base.theme.colors.black,paddingBottom:3}}>Applicability:
                            <Text style={{fontWeight:'bold'}}> {selectedExpense.exApplTO}</Text></Text>
                        <Text style={{fontSize:12,color:base.theme.colors.black}}>Added By:
                            <Text style={{fontWeight:'bold'}}> {this.props.userReducer.MyFirstName}</Text></Text>
                    </Collapsible>
                </View>
                <View>
                    <Text style={{color:base.theme.colors.primary}}>{selectedExpense.unUniIden}</Text>
                </View>

            </View>
                {selectedExpense.exIsInvD?
                    <View/>:
                <View style={{position:'absolute',alignSelf:'flex-end', alignItems:'center',justifyContent:'center',paddingRight:10,marginTop:10}}>
                    <TouchableOpacity style={{padding:8,width:40,height:40,borderRadius:5,backgroundColor:base.theme.colors.shadedWhite,marginBottom:2}} onPress={() =>this.editExpense(selectedExpense)}>
                        <Image
                            resizeMode={'contain'}
                            style={{ height:20, width: 20,}}
                            source={require('../../../icons/edit.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={{padding:5,width:40,height:40,borderRadius:5,backgroundColor:base.theme.colors.shadedWhite}} onPress={() =>this.deleteInvoice(selectedExpense.exid)}>
                        <Image
                            resizeMode={'contain'}
                            style={{ height:20, width: 20}}
                            source={require('../../../icons/delete.png')}
                        />
                    </TouchableOpacity>
                </View>}
                <View style={{alignSelf:'center',marginBottom:10,marginTop:10}}>
                <TouchableOpacity style={{width:35,borderRadius:15,height:1,backgroundColor:base.theme.colors.lightgrey, alignSelf:'center'}}
                                  onPress={() =>this.toggleCollapsible(item.index,item.item.open)}>
                </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    toggleCollapsible = (index, value) => {
        console.log(' Get the value toggle',index,value)
        let data = [...this.state.expensesList];
        data[index].open = !value;
        this.setState({ expensesList: data });
    };

     renderLabel(label, style){
        return (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{marginLeft: 10}}>
              <Text style={style}>{label}</Text>
            </View>
          </View>
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
                </TouchableHighlight>
                :
                <TouchableOpacity onPress={() => {
                    Linking.openURL('https://mediaupload.oyespace.com/'+item.item.fileUrl)
                }}>
                    <Image
                        style={CreateSOSStyles.imageView}
                        source={require('../../../icons/file_upload.png')}
                    />
                </TouchableOpacity>
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
                                    style={PatrollingReportStyles.modalText}>{moment( this.state.expenditureDate).format("MMM DD YYYY")}</Text>
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



    clearAllFields(){
        let self=this;
        self.setState({
            expHead:'',
            expDesc:'',
            amountPaid:'',
            selectedAppList:'',
            selectedExpRecType:'',
            selectedExpType:'',
            selectedBank:'',
            payMethodId:'',
            payeeName:'',
            selPayeeBank:'',
            uploadedFile:'',
            expenditureDate:_dt,
            invoiceCopyList:[],
            selDistribution:'',
            blockIdAdd:'',
            invoiceNum:''
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
