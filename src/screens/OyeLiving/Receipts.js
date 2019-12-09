/*
 * @Author: Sarthak Mishra
 * @Date: 2019-10-07 11:58:24
 * @Last Modified by: Sarthak Mishra
 * @Last Modified time: 2019-10-25 18:24:53
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
    Platform,
    DatePickerIOS,
    DatePickerAndroid,
    Dimensions,
    SafeAreaView,
    Linking,
    StyleSheet,
    BackHandler,
    PermissionsAndroid
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
import {captureRef, captureScreen} from "react-native-view-shot";
import Share from "react-native-share";
import RNImageToPdf from 'react-native-image-to-pdf';

let RNFS = require('react-native-fs');


const catsSource = {
    uri: "https://i.imgur.com/5EOyTDQ.jpg"
};


let dt = new Date();
dt.setDate(dt.getDate());
let _dt = dt;

class Receipts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading:true,
            blockList: [],
            selectedBlock:'Select Block',
            blockId: '',
            isModalVisible: false,
            receiptsList: [],
            receiptsAllList: [],
            fromDate:'',
            toDate:'',
            selPayMethod: 'Select Payment Method',
            payMethodId: '',
            isCalenderOpen: false,
            unitName: '',
            associationName:'',
            isGenRecModal: false,
            isViewRecModal:false,
            recListByDates:[],
            selectedReceipt:{},
            amountFilter:'',
            amountCollapse:false,
            invoiceNumber:'',
            amountDue:'',
            amountPaid:'',
            paymentMethod:'',
            paymentDate:_dt,
            paymentDesc:'',
            getIndex:0,
            unitId:'',
            selectedUnit:'select Unit',
            value: {
                format: "png",
                quality: 0.9,
                result: "data-uri",
                snapshotContentContainer: false
            },
            previewSource: catsSource,
            shareSelected:false,
            isShare:false,
            isPermitted: false,
            selPayMode:'Select mode of payment'

        };

        this.bindComponent = this.bindComponent.bind(this);
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
                this.getTheBlockList()
        this.getPaymentMethodsList();
        this.getUnitName();
        this.getAssociationName();this.updateFields() }
        );
    }
    updateFields(){
       let self=this;
       self.setState({
           selectedBlock:'Select Block',
           blockId: '',
           receiptsList: [],
           receiptsAllList: [],
           getIndex:0,
           isModalVisible: false,
       })
    }

    componentWillUnmount() {
        this.didFocusListener.remove();
    }


    /*componentWillMount() {
        this.getTheBlockList()
        this.getPaymentMethodsList();
        this.getUnitName();
        this.getAssociationName();
    }*/

   async getAssociationName(){
       let stat = await base.services.OyeLivingApi.getAssociationNameById(this.props.userReducer.SelectedAssociationID)

       this.setState({
           isLoading:false
       })
       console.log('Get stat data',stat)
       try {
           if (stat.success && stat.data) {
               this.setState({
                   associationName:stat.data.association.asAsnName
               })
           }
       } catch (error) {
           console.log('Error', error)
       }
   }

    async getTheBlockList() {
        let stat = await base.services.OyeLivingApi.getTheListOfBlocksByAssociation(this.props.userReducer.SelectedAssociationID)
        console.log('Get the blocks data',stat)
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

    async getReceiptsList(value,index) {
        let self=this;
       let blockId = self.state.blockList[index].details.blBlockID;
        console.log('Get the changed block details',value,index,blockId)

        let stat = await base.services.OyeLivingApi.getReceiptsListByBlockId(self.state.blockId) //13714self.state.blockId)
        console.log('Get the receipts List::',stat)

        self.setState({
            isLoading:false
        })
        try {
            if (stat.success && stat.data) {
                self.setState({
                    receiptsList: stat.data.payments,
                    receiptsAllList: stat.data.payments,
                })
            }
        } catch (error) {
            self.setState({
                receiptsList: [],
                receiptsAllList: [],
            });
            console.log('Error', error)
        }
        self.setState({
            selectedBlock: value,
            blockId: blockId,
            getIndex:index
        })
    }

    async getRecListByDates(){
        console.log('Selected dates',this.state.fromDate,this.state.toDate,moment(this.state.fromDate).format('YYYY-MM-DD'),
            moment(this.state.toDate).format('YYYY-MM-DD'))
        let self=this;
        self.setState({isLoading:true})
        let input = {
            "UNUnitID" :self.props.dashBoardReducer.uniID,
            "ASAssnID"    : self.props.userReducer.SelectedAssociationID,
            "BLBlockID"    : self.state.blockId,
            "FromDate"    :moment(self.state.fromDate).format('YYYY-MM-DD'),
            "ToDate"    :moment(self.state.toDate).format('YYYY-MM-DD')
        };
        console.log('Selected dates',input);
        let stat = await base.services.OyeLivingApi.getTheReceiptsListByDates(input);
        self.setState({isLoading:false})
        console.log('data from the stat',stat)
        try{
            if (stat.success && stat.data.payment.length !== 0) {

                self.setState({
                    recListByDates:stat.data.payment,
                });
            }
        }catch(error){
            self.setState({
                recListByDates:[]
            })
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

    render() {
        console.log('Get the props@@@@@',this.props)
        return (
            <TouchableOpacity  onPress={() =>{this.clearTheFilters()}} disabled={!this.state.isModalVisible}>
                <View style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: this.state.isModalVisible ? 'rgba(52, 52, 52, 0.05)' : base.theme.colors.white
                }}>
                    <View>
                        <View style={{position: 'absolute',}}>
                            {this.renderModal()}
                        </View>
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
                                onChangeText={(value, index) => {this.setState({isLoading:true});this.getReceiptsList(value,index)}}
                            />
                            <TouchableOpacity
                                underlayColor={base.theme.colors.transparent}
                                onPress={() => this.state.selectedBlock=='' || this.state.selectedBlock=='Select Block'?Alert.alert('Please select block to Apply filters'):this.onModalOpen()}
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
                    <ScrollView style={{height: '90%'}}>
                        {this.state.receiptsList.length === 0 ?
                            <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
                                <Text>No Receipts details are there</Text>
                            </View> :
                            <FlatList
                                data={this.state.receiptsList}
                                extraData={this.state}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={(item) => this.selectedReceipt(item)}
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
                                        onPress={() => this.clearTheFilters()}
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
                                    borderBottomColor: base.theme.colors.lightgrey
                                }}>
                                    <TouchableHighlight
                                        underlayColor={base.theme.colors.transparent}
                                        onPress={() => this.setState({amountCollapse:!this.state.amountCollapse})}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Text style={{fontSize: 16,color: base.theme.colors.black}}>Amount</Text>
                                            <Image
                                                resizeMode={'contain'}
                                                style={{height: hp('4'), width: wp('4'), tintColor: base.theme.colors.black,}}
                                                source={!this.state.amountCollapse ? require('../../../icons/show_less.png') : require('../../../icons/show_more.png')}
                                            />
                                        </View>
                                    </TouchableHighlight>
                                    <Collapsible collapsed={this.state.amountCollapse}>
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
                                                onChangeText={(text) => this.setState({amountFilter:text})}
                                                value={this.state.amountFilter}
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

                    <TouchableOpacity style={{margin:10,alignSelf:'flex-end',backgroundColor:base.theme.colors.primary,borderRadius:30,
                        width:'40%',height:'6%',alignItems:'center',justifyContent:'center'}} onPress={this.bindComponent}>
                    <Text style={{color:base.theme.colors.white,fontSize:16,}}>Generate Receipt</Text>
                    </TouchableOpacity>
                    <ProgressLoader
                        isHUD={true}
                        isModal={true}
                        visible={this.state.isLoading}
                        color={base.theme.colors.primary}
                        hudColor={"#FFFFFF"}
                    />

                    {(Platform.OS === 'ios') ? this.openIOSCalender() : <View/>}
                    {this.state.isGenRecModal ? this.generateReceiptScreen() : <View/>}
                    {this.state.isViewRecModal ? this.viewReceiptScreen() : <View/>}


                </View>
            </TouchableOpacity>

        )
    }

    getAndroidPermissions() {
        let that = this;

        async function requestExternalWritePermission() {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    //If WRITE_EXTERNAL_STORAGE Permission is granted
                    //changing the state to show Create PDF option
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
    snapshot = refname => () =>
        (refname
                ? captureRef(this.refs[refname], this.state.value)
                : captureScreen(this.state.value)
        )
            .then(
                res =>
                    new Promise((success, failure) =>
                        Image.getSize(res, (width, height) => (
                            console.log("image ####",res, width, height), success(res)
                        ), failure))).then(res => this.setState({
                error: null, res, previewSource: {
                    uri: this.state.value.result === "base64" ? "data:image/" + this.state.value.format + ";base64," + res : res
                }
            }, () => this.share())
        )
            .catch(
                error => (
                    console.warn(error),

                        this.setState({error, res: null, previewSource: null,isLoading:false})
                )
            );

    share() {
        var image_data = this.state.previewSource.uri.split('data:image/png;base64,');
        console.log("Image:",this.state.previewSource.uri,this.state.isShare)

            image_data = image_data[1] //this.state.previewSource.uri;
            console.log("Image Data:",image_data)

            var path = RNFS.ExternalStorageDirectoryPath + '/image.png';
            RNFS.writeFile(path, image_data, 'base64')
                .then((success) => {
                    console.log('FILE WRITTEN!',path);
                    this.convertImageToPdf(path);
                })
                .catch((err) => {
                    this.setState({isLoading:false})
                    console.log(err.message);
                });
    }

    async convertImageToPdf(path){
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
                    var rnd = Math.random();
                    var path1 = RNFS.ExternalStorageDirectoryPath + '/invoice-'+rnd+".pdf";

                    RNFS.copyFile(path, path1)
                  .then((success) => {
                    console.log('FILE WRITTEN!',path);
                      this.setState({isLoading:false})
                      this.shareReceipt(path)
                })
                .catch((err) => {
                    console.log(err.message);
                    this.setState({isLoading:false})

                });

            //     }
            // })


            console.log(options);
        } catch(e) {
            this.setState({isLoading:false})
            console.log(e);
        }
    }

    shareReceipt(path,type = "application/pdf"){
        Share.open({
            url: "file://"+path,
            title: 'Receipt'
          })
    }

    getSharePdf(){
        let self=this;
        self.setState({isShare:true,isLoading:true})
        self.snapshot("View")
    }

    viewReceiptScreen(){
        console.log('Selected receipt data in list',this.state.selectedReceipt)
        let selReceipt=this.state.selectedReceipt;

        return (
            <Modal
                style={{height: '110%', width: '100%', alignSelf: 'center',}}
                visible={this.state.isViewRecModal}
                transparent={true}
                onRequestClose={this.close}>
                <View style={{height: '106%', width: '100%', backgroundColor: base.theme.colors.white}} >
                    <SafeAreaView style={AddExpenseStyles.safeArea}>
                        <View style={[styles.viewStyle, {flexDirection: 'row'}]}>
                            <View style={[styles.viewDetails1,]}>
                                <TouchableOpacity
                                    onPress={() => this.closeReceiptScreen()}
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
                            <View style={{
                                padding: 10,
                                width: 40,
                                height: 40,
                                borderRadius: 5,
                                marginTop:5,
                                alignItems:'center',
                                justifyContent:'center'
                            }}></View>
                            {/*<TouchableOpacity style={{
                                padding: 10,
                                width: 40,
                                height: 40,
                                borderRadius: 5,
                                marginTop:5,
                                alignItems:'center',
                                justifyContent:'center'
                            }} onPress={()=>this.getSharePdf()}>
                                <Image
                                    resizeMode={'contain'}
                                    style={{height: 20, width: 20,}}
                                    source={require('../../../icons/share.png')}
                                />
                            </TouchableOpacity>*/}
                        </View>
                        <View style={{backgroundColor:'#ffffff',width:'100%'}} ref='View'>
                        <View style={AddExpenseStyles.headerView}>
                            <Text
                                style={AddExpenseStyles.headerText}>View Receipt</Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',width:'90%',
                        justifyContent:'space-between',paddingBottom:10,alignSelf:'center'}}>
                            <Text style={{width:'50%',fontSize:16,color:base.theme.colors.black,}} numberOfLines={2}>{this.state.associationName}</Text>
                            <Text style={{width:'50%',textAlign:'right',fontSize:16,color:base.theme.colors.black,}} numberOfLines={2}>{selReceipt.unUniName==''?this.state.unitName:selReceipt.unUniName}</Text>

                        </View>
                        <View style={{backgroundColor:base.theme.colors.greyCard,width:'100%',alignItems:'center',justifyContent:'center',
                            paddingTop:5,paddingBottom:5}}>
                            <Text style={{fontSize:17,color:base.theme.colors.mediumGrey,}}>Receipt Summary</Text>
                        </View>
                        <View style={{paddingTop:10,paddingBottom:10,width:'100%',flexDirection:'row',
                            borderBottomColor:base.theme.colors.greyHead,borderBottomWidth:1}}>
                            <View style={{width:'50%',paddingLeft:15}}>
                                <Text style={{color:base.theme.colors.black,fontSize:15,fontWeight:'normal'}}>Receipt ID - <Text style={{fontWeight:'normal',color:base.theme.colors.primary}}>{selReceipt.pyid}</Text></Text>
                                <Text style={{color:base.theme.colors.black,fontSize:15,fontWeight:'normal'}}>Transaction ID -
                                     <Text style={{color:base.theme.colors.grey,fontWeight:'normal',}} numberOfLines={2}>{selReceipt.pyRefNo}</Text></Text>

                            </View>
                            <View style={{width:'50%',paddingRight:15}}>
                                <Text style={{color:base.theme.colors.black,fontSize:15,textAlign:'right'}}>Payment Date</Text>
                                <Text style={{color:base.theme.colors.primary,fontSize:15,textAlign:'right'}}>{selReceipt.pydCreated ==''?'': moment(selReceipt.pydCreated).format('DD-MM-YYYY')}</Text>

                            </View>
                        </View>
                        <View style={{padding:10,width:'100%',}}>
                            <Text style={{color:base.theme.colors.black,fontSize:15,paddingBottom:20}}>Invoice No. -
                                <Text style={{color:base.theme.colors.grey}} numberOfLines={2}>{selReceipt.inNumber}</Text></Text>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                <Text style={{color:base.theme.colors.black,fontSize:15,textAlign:'left'}}>Amount Due</Text>
                                <Text style={{color:base.theme.colors.black,fontSize:15,textAlign:'right'}}>{base.utils.strings.rupeeIconCode}{selReceipt.pyAmtDue}</Text>

                            </View>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingBottom:5,
                                borderBottomColor:base.theme.colors.greyCard,borderBottomWidth:1}}>
                                <Text style={{color:base.theme.colors.black,fontSize:15,textAlign:'left'}}>Amount Paid</Text>
                                <Text style={{color:base.theme.colors.black,fontSize:15,textAlign:'right'}}>{base.utils.strings.rupeeIconCode}{selReceipt.pyAmtPaid}</Text>
                            </View>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingBottom:25,paddingTop:5}}>
                                <Text style={{color:base.theme.colors.black,fontSize:15,textAlign:'left'}}>Current Outstanding</Text>
                                <Text style={{color:base.theme.colors.black,fontSize:15,textAlign:'right'}}>{base.utils.strings.rupeeIconCode}{selReceipt.pyBal}</Text>

                            </View>
                            <View style={AddExpenseStyles.textInputView}>
                                <Text style={{
                                    fontSize: 14,
                                    color: base.theme.colors.black,
                                    textAlign: 'left',
                                    paddingTop: 5,
                                    fontWeight:'bold'
                                }}>Description</Text>
                                <TextInput
                                    style={{
                                        height: 30,
                                        borderBottomWidth: 1,
                                        borderColor: base.theme.colors.lightgrey,
                                        paddingBottom: 5, color:base.theme.colors.black
                                    }}
                                    onChangeText={(text) => this.setState({raBudget: text})}
                                    value={"receipt desc"} //selReceipt.pyDesc.toString()
                                    placeholder="Payment Description"
                                    placeholderTextColor={base.theme.colors.grey}
                                    editable={false}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection:'row',width:'100%',height:'20%',}}>
                            <View style={{width:'60%',height:'100%',alignItems:'center',justifyContent:'flex-end',paddingBottom:15,}}>
                                <TouchableOpacity style={{width:'60%',height:'30%',borderRadius:20,
                                    backgroundColor:base.theme.colors.primary,alignItems:'center',justifyContent:'center'}}
                                                  onPress={this.snapshot("View")}
                                >
                                    <Text style={{fontSize:14,color:base.theme.colors.white}}>Share Receipt</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{width:'50%',alignItems:'center',marginTop:30,right:15}}>
                                <Image
                                    resizeMode="contain"
                                    source={require('../../../icons/oyesafe.png')}
                                    style={{width:50,height:50}}
                                />
                                <TouchableOpacity onPress={() => Linking.openURL(
                                    "https://www.oyespace.com"
                                )}
                                >
                                <Text style={{
                                    fontSize: 14,
                                    color: base.theme.colors.hyperLink,
                                    textDecorationLine: 'underline'}}>Powered by OyeLiving</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                        </View>

                    </SafeAreaView>
                </View>
            </Modal>
        )
    }

    downLoadPdf(){
        console.log('downloadPdf of html content')
    }


    closeReceiptScreen() {
        this.setState({isGenRecModal: false,isViewRecModal:false})
    }

    generateReceiptScreen() {
        console.log('Props in generate receipts',this.props,this.props.dashBoardReducer.dropdown1)
      let dropDown=this.props.dashBoardReducer.dropdown1;
        return (
            <Modal
                style={{height: '110%', width: '100%', alignSelf: 'center',}}
                visible={this.state.isGenRecModal}
                transparent={true}
                onRequestClose={this.close}>
                <View style={{height: '106%', width: '100%', backgroundColor: base.theme.colors.white}}>
                    <SafeAreaView style={AddExpenseStyles.safeArea}>
                        <View style={[styles.viewStyle, {flexDirection: 'row'}]}>
                            <View style={[styles.viewDetails1,]}>
                                <TouchableOpacity
                                    onPress={() => this.closeReceiptScreen()}
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
                                style={AddExpenseStyles.headerText}>Generate Receipt</Text>
                        </View>
                        <ScrollView style={AddExpenseStyles.mainContainer}
                                    showsVerticalScrollIndicator={false}>
                            <View style={[AddExpenseStyles.scrollContainer,{height:'100%'}]}>
                                <View style={{width:'80%',marginTop:20}}>
                                    <View style={{width:'100%',flexDirection:'row',marginBottom:10,alignItems:'center'}}>
                                    <Text style={{width:'40%',fontSize:16,color:base.theme.colors.mediumGrey,}}>Unit Name</Text>
                                        <Text style={{fontSize:16,color:base.theme.colors.black,fontFamily:base.theme.fonts.medium}}>A101</Text>
                                    </View>
                                    <View style={{width:'100%',flexDirection:'row',marginBottom:10,alignItems:'center'}}>
                                        <Text style={{width:'40%',fontSize:16,color:base.theme.colors.mediumGrey,}}>Invoice No.</Text>
                                        <Text style={{fontSize:16,color:base.theme.colors.black,fontFamily:base.theme.fonts.medium}}>A101</Text>
                                    </View>
                                    <View style={{width:'100%',flexDirection:'row',marginBottom:10,alignItems:'center'}}>
                                        <Text style={{width:'40%',fontSize:16,color:base.theme.colors.mediumGrey,}}>Invoice Date</Text>
                                        <Text style={{fontSize:16,color:base.theme.colors.black,fontFamily:base.theme.fonts.medium}}>A101</Text>
                                    </View>
                                    <View style={{width:'100%',flexDirection:'row',marginBottom:10,alignItems:'center'}}>
                                        <Text style={{width:'40%',fontSize:16,color:base.theme.colors.mediumGrey,}}>Amount Due</Text>
                                        <Text style={{fontSize:16,color:base.theme.colors.black,fontFamily:base.theme.fonts.medium}}>{base.utils.strings.rupeeIconCode}{' '}A101</Text>
                                    </View>
                                    <View style={{width:'100%',flexDirection:'row',marginBottom:10,alignItems:'center'}}>
                                        <Text style={{width:'40%',fontSize:16,color:base.theme.colors.mediumGrey,}}>Amount Paid</Text>
                                        <Text style={{fontSize:16,color:base.theme.colors.black,fontFamily:base.theme.fonts.medium}}>{base.utils.strings.rupeeIconCode}{' '}A101</Text>
                                    </View>
                                </View>
                                <View style={{width:'85%',marginTop:20,height:'0.5%',borderRadius:5,backgroundColor:base.theme.colors.primary}}>
                                </View>
                                <TouchableOpacity style={{flexDirection:'row',width:'85%',marginTop:20,height:'10%',
                                    borderRadius:5,backgroundColor:base.theme.colors.greyCard,alignItems:'center',marginBottom:20
                                }}>
                                    <Image
                                        resizeMode={'contain'}
                                        style={{
                                            height: hp('6%'),
                                            width: wp('6%'),
                                            tintColor: base.theme.colors.primary,
                                            alignSelf: 'center',
                                            marginLeft:10
                                        }}
                                        source={require('../../../icons/calender.png')}
                                    />
                                    <Text style={{marginLeft:10,fontSize:16,color:base.theme.colors.black}}>Payment Date</Text>
                                </TouchableOpacity>

                                <View style={{width: '85%',}}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: base.theme.colors.black,
                                        textAlign: 'left',
                                        paddingTop: 5,
                                    }}>Select mode of payment
                                        <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                                    <Dropdown
                                        value={this.state.selPayMode} // 'Select Payment Method *'
                                        labelFontSize={16}
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
                                                selPayMode: value,
                                            })
                                        }}
                                    />
                                </View>



                                <View style={{
                                    alignSelf: 'center',
                                    width: '60%',
                                    flexDirection: 'row',
                                    paddingTop: 25,
                                    paddingBottom: 25,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: 50,
                                    paddingLeft: 15,
                                    paddingRight: 15
                                }}>
                                    <OSButton
                                        height={30}
                                        width={'45%'}
                                        borderRadius={20}
                                        oSBBackground={base.theme.colors.red}
                                        oSBText={'Cancel'}
                                        onButtonClick={() => this.clearAllFields()}/>
                                    <OSButton
                                        height={30}
                                        width={'45%'}
                                        borderRadius={20}
                                        oSBBackground={base.theme.colors.primary}
                                        oSBText={'Submit'}
                                        onButtonClick={() => this.createExpenseValidation()}/>
                                </View>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
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
                            date={this.state.paymentDate}
                            style={{backgroundColor: base.theme.colors.white}}
                            maximumDate={_dt}
                            mode="date"
                            onDateChange={(date) => {
                                this.setState({paymentDate: date})
                            }}/>
                        <TouchableHighlight onPress={() => this.closeIOSCalenderAdd()} underlayColor='transparent'>
                            <View style={[PatrollingReportStyles.modalView, {width: width - 30}]}>
                                <Text
                                    style={PatrollingReportStyles.modalText}>{moment(this.state.paymentDate).format("MMM DD YYYY")}</Text>
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
                this.setState({paymentDate: date})
            }
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    };


    clearAllFields(){
        let self=this;
        self.setState({
            amountPaid:'',
            invoiceNumber:'',
           unitId:'',
            selectedUnit:'Select unit',
            payMethodId:'',
            selPayMethod:'Select Payment method',
            paymentDesc:'',
            amountDue:'',
            isGenRecModal:false
        })
    }

   async createExpenseValidation(title, message) {
        console.log('Validation for generate invoice')
        let self=this;
        console.log('State values',self.state)

        if(self.state.unitId==''){
            Alert.alert('Please select unit')
        }
        else if(self.state.invoiceNumber==''){
            Alert.alert('Please enter invoice number')
        }
        else if(self.state.amountDue==''){
            Alert.alert('Please enter amount due')
        }
        else if(self.state.amountPaid==''){
            Alert.alert('Please enter amount paid')
        }
        else if(self.state.payMethodId==''){
            Alert.alert('Please select payment method')
        }
        else{
            await self.createReceipt()
        }

    }

    async createReceipt(){
     console.log('Create receipt')
        let self=this;
        self.setState({isLoading:true})
        let input = {
            "MEMemID"  : "",
            "PYRefNo"  : "",
            "PYBkDet"  : "",
            "PYAmtPaid": self.state.amountPaid,
            "INNumber" : self.state.invoiceNumber,
            "UNUnitID" : self.state.unitId,
            "ASAssnID"    : self.props.userReducer.SelectedAssociationID,
            "PYTax"    : "",
            "PMID" : self.state.payMethodId,
            "PYDesc"  : self.state.paymentDesc
        };
        console.log('Selected dates',input);
        let stat = await base.services.OyeLivingApi.createNewReceipt(input);
       // self.setState({isLoading:false})
        console.log('data from the stat',stat)
        try{
            if (stat.success) {
                self.setState({
                    isGenRecModal:false
                })
                await self.getReceiptsList(self.state.selectedBlock,self.state.getIndex)
            }
            else{
                Alert.alert(stat.error.message)
            }
        }catch(error){
            self.setState({isLoading:false})
            Alert.alert('Invalid payment information')
            console.log('error',error)
        }
    }

    bindComponent() {
        this.setState({
            isViewRecModal:true
           // isGenRecModal: true,
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
                        this.getRecListByDates()
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
                        this.getRecListByDates()
                    }
                }
            }
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    };

    validationFilters(){
        let self=this;
        let amountFil=self.state.amountFilter;
        let filterData=self.state.recListByDates.length===0? self.state.receiptsAllList:self.state.recListByDates
        let dataFill=[]
        let j=0;

        if(amountFil !=''){

            for(let i=0;i<filterData.length;i++){
                if(amountFil== filterData[i].pyAmtDue){
                    dataFill[j]=filterData[i]
                }
            }
        }
        else{
            dataFill=filterData;
        }

        self.setState({
            receiptsList:dataFill,
            isModalVisible:false,
            fromDate:'',
            toDate:'',
            amountFilter:'',
        })
    }


    clearTheFilters() {
        let self=this;
       self.setState({
           fromDate:'',
           toDate:'',
           amountFilter:'',
           isModalVisible:false
       })

    }




    selectedReceipt(item) {
        console.log('item data',item)
        return (
                <View style={{ borderRadius: 5, borderColor: base.theme.colors.lightgrey, backgroundColor: base.theme.colors.white,
                    shadowColor: base.theme.colors.greyHead,
                    shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 1},
                    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.2,
                    shadowRadius: 1, elevation: 5, padding: 5, borderBottomWidth: 0.5, marginBottom: 10,flexDirection: 'row', marginTop: 10}}>
                    <View style={{marginLeft:5}}>
                        <Image
                            style={{height: 25, width: 25,}}
                            source={require('../../../icons/buil.png')}
                        />
                    </View>
                    <View style={{marginLeft:10, marginRight: 5,width:'75%'}}>
                        <Text
                            style={{fontSize: 14, color: base.theme.colors.black, paddingBottom: 5, fontWeight: 'bold'}}
                            numberOfLines={1}>
                            {item.item.unUniName==''?'': item.item.unUniName.toUpperCase()}
                        </Text>
                        <Text style={{fontSize: 13, color: base.theme.colors.black, paddingBottom: 3}}>Amount: <Text
                            style={{fontWeight: 'bold'}}>{base.utils.strings.rupeeIconCode} {item.item.pyAmtDue}</Text></Text>
                        <Text style={{fontSize: 13, color: base.theme.colors.black, paddingBottom: 3}}>Payment Date:
                            <Text
                                style={{color: base.theme.colors.black,fontWeight: 'bold'}}> </Text>{item.item.pydCreated==''?'':moment(item.item.pydCreated).format('DD-MM-YYYY')}</Text>
                    </View>
                    <View style={{
                        alignSelf: 'flex-end',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingRight: 10,
                        paddingLeft:10,
                    }}>
                        <TouchableOpacity style={{
                            padding: 10,
                            width: 40,
                            height: 40,
                            borderRadius: 5,
                            backgroundColor: base.theme.colors.shadedWhite,
                            marginTop:5,
                            alignItems:'center',
                            justifyContent:'center'
                        }} onPress={()=>this.sharePdf(item)}>
                            <Image
                                resizeMode={'contain'}
                                style={{height: 20, width: 20,}}
                                source={require('../../../icons/share.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            padding: 8,
                            width: 40,
                            height: 40,
                            borderRadius: 5,
                            backgroundColor: base.theme.colors.shadedWhite,
                            marginTop:5,marginBottom:5,
                            alignItems:'center',
                            justifyContent:'center'

                        }} onPress={() =>this.isVieRecModal(item)}>
                            <Image
                                resizeMode={'contain'}
                                style={{height: 20, width: 20}}
                                source={require('../../../icons/eye.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                )
    }


    isVieRecModal(item){
        console.log('Item in view rec modal',item)
        let self=this;
        self.setState({
            isViewRecModal:true,
            selectedReceipt:item.item

        })
    }

    sharePdf(item){
        let self=this;
        self.setState({
            isViewRecModal:true,
            selectedReceipt:item.item
        });
        self.snapshot()

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

export default (connect(mapStateToProps)(Receipts));
