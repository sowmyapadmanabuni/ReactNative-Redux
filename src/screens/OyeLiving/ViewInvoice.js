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
import {connect} from 'react-redux';
import base from '../../base';
import {Dropdown} from 'react-native-material-dropdown';
import Modal from "react-native-modal";
import {
    heightPercentageToDP as hp, widthPercentageToDP,
    widthPercentageToDP as wp
} from "react-native-responsive-screen";
import SelectMultiple from 'react-native-select-multiple';
import moment from "moment";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import ElevatedView from "react-native-elevated-view";
import EmptyView from "../../components/common/EmptyView";
import AddExpenseStyles from "./Expenses/AddExpenseStyles";

const {height, width} = Dimensions.get('screen');
import {captureRef, captureScreen} from "react-native-view-shot";
import Share from "react-native-share";
import PatrollingReportStyles from "../Patrolling/PatrollingReportStyles";
import RNFS from 'react-native-fs';
import RNImageToPdf from 'react-native-image-to-pdf';
import ProgressLoader from "rn-progress-loader";
import OSButton from "../../components/osButton/OSButton";
import DatePicker from "react-native-datepicker";
import axios from "axios";


var radio_props1 = [
    {label: 'Debit', value: 0},
    {label: 'Credit', value: 1}
];


const catsSource = {
    uri: "https://i.imgur.com/5EOyTDQ.jpg"
};


let dt = new Date();
dt.setDate(dt.getDate());
let _dt = dt;

let radio_props = [
    {label: 'Yes', value: 1},
    {label: 'No', value: 0}
];


class ViewInvoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoiceData: {},
            userDetail: [],
            unitName: "",
            assDetail: {},
            value: {
                format: "png",
                quality: 0.9,
                result: "data-uri",
                snapshotContentContainer: false
            },
            valueRec: {
                format: "png",
                quality: 0.9,
                result: "data-uri",
                snapshotContentContainer: false
            },
            isPermitted:false,
            isShare:false,

        }
    }

    componentWillMount() {
        console.log('NAVIGATION PARAMS IN VIEW INVOICE', this.props.navigation.state.params.item.item)
        this.setState({
            invoiceData: this.props.navigation.state.params.item.item
        })
        this.getAssiciationDetail(this.props.navigation.state.params.item.item.asAssnID)

        this.fetchUserDetailByUnitId(this.props.navigation.state.params.item.item.unUnitID)

    }
    componentDidMount() {
        if (Platform.OS === 'android') {
            this.getAndroidPermissions()
        } else {
            this.setState({
                isPermitted: true
            })
        }
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


    async getAssiciationDetail() {
        let self = this;
        let assId = self.props.assId;
        let stat = await base.services.OyeLivingApi.getAssDetail(assId);
        console.log("Stat in ass Deyai:", stat)
        try {
            if (stat.success) {
                self.setState({
                    assDetail: stat.data.association
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    async fetchUserDetailByUnitId(unitId) {
        let self = this;
        console.log("Selected Val:", unitId);

        let rResp = await base.services.OyeLivingApi.getUnitDetailByUnitId(unitId);
        console.log('RESPONSE COMING ',rResp)
        try {

            if (rResp.success) {
                let dataToShow = rResp.data.unit.tenant.length == 0 ? rResp.data.unit.owner.length == 0 ? {} : rResp.data.unit.owner[0] : rResp.data.unit.tenant[0]

                self.setState({
                    userDetail: dataToShow,
                    unitName: rResp.data.unit.unUniName
                })
                console.log("User Detail:", rResp, dataToShow);

            }

        } catch (e) {
            console.log("e:", e)
        }
    }


    render() {
        let invoiceData = this.state.invoiceData;
        let invoiceBreakUp = this.state.invoiceData.invoiceDetails;
        let userDetail = this.state.userDetail;
        let discObjArr = [{
            idApplTo: "All Sold Owner Occupied Units",
            idDesc: "Discount",
            idValue: invoiceData.inDsCVal,
            inid: "0",
        }];
        console.log("Invoice Data:", discObjArr, userDetail);
        let newArr = [...invoiceBreakUp, ...discObjArr];
        console.log('Invoice Data', this.state.invoiceData)
        return (
            <View style={{
                height: hp('97'),
                width: wp('100'),
                backgroundColor: base.theme.colors.white,
                alignSelf: 'center'
            }}>
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
                        shadowOffset: {width: 0, height: 2},
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
                                    // width: wp('34%'),
                                    // height: hp('18%'),
                                    marginRight: hp('3%')
                                }}
                                source={require('../../../icons/OyespaceSafe.png')}
                            />
                        </View>
                        <TouchableHighlight
                            underlayColor={base.theme.colors.transparent}
                            onPress={this.snapshotShare("view")}
                            style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
                            <Image
                                resizeMode={'center'}
                                style={{height: hp('3'), width: hp('3')}}
                                source={require('../../../icons/share.png')}/>

                        </TouchableHighlight>
                    </View>

                    <View ref={'view'} style={{backgroundColor: '#FFFFFF'}}>
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingTop: 10,
                            paddingBottom: 20,
                        }}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: base.theme.colors.primary
                                }}>View Invoice
                            </Text>
                        </View>
                        <ScrollView>

                            <View style={{
                                height: hp('3'),
                                width: wp('95'),
                                alignSelf: 'center',
                                borderWidth: 0,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start'
                            }}>
                                <Text style={{
                                    fontSize: 17,
                                    color: base.theme.colors.black
                                }}>{this.props.dashBoardReducer.selectedDropdown}</Text>
                                <Text style={{
                                    fontSize: 17,
                                    color: base.theme.colors.black
                                }}>{this.state.unitName}</Text>
                            </View>
                            <View style={{
                                height: hp('5'),
                                width: wp('100'),
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: base.theme.colors.primary,
                                marginTop: 10
                            }}>
                                <Text style={{
                                    fontFamily: base.theme.fonts.medium,
                                    fontSize: hp('2'),
                                    color: base.theme.colors.white
                                }}>Invoice</Text>
                            </View>
                            <View style={{
                                height: hp('5'),
                                width: wp('100'),
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: base.theme.colors.white,
                                marginTop: 10,
                                borderBottomWidth: 1,
                                borderBottomColor: base.theme.colors.primary
                            }}>
                                <Text style={{
                                    fontFamily: base.theme.fonts.medium,
                                    fontSize: hp('1.7'),
                                    color: base.theme.colors.black,
                                    paddingLeft: 10
                                }}>Invoice Date:
                                    <Text style={{
                                        fontFamily: base.theme.fonts.light,
                                        fontSize: hp('2'),
                                        color: base.theme.colors.black
                                    }}>{moment(invoiceData.inGenDate).format("DD-MM-YYYY")}</Text>
                                </Text>
                                <Text style={{
                                    fontFamily: base.theme.fonts.medium,
                                    fontSize: hp('1.7'),
                                    color: base.theme.colors.black,
                                    paddingRight: 10
                                }}>Invoice No.
                                    <Text style={{
                                        fontFamily: base.theme.fonts.light,
                                        fontSize: hp('2'),
                                        color: base.theme.colors.black
                                    }}>{(invoiceData.inNumber)}</Text>
                                </Text>
                            </View>
                            <View style={{
                                height: hp('9'),
                                width: wp('100'),
                                borderBottomWidth: 0,
                                borderBottomColor: base.theme.colors.primary
                            }}>
                                <View style={{
                                    height: hp('3'),
                                    width: wp('95'),
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    backgroundColor: base.theme.colors.white,
                                    marginTop: 10,
                                    borderBottomWidth: 0,
                                    borderBottomColor: base.theme.colors.primary
                                }}>
                                    <Text style={{
                                        fontFamily: base.theme.fonts.medium,
                                        fontSize: hp('2'),
                                        color: base.theme.colors.black
                                    }}>To:{' '}
                                        <Text style={{
                                            fontFamily: base.theme.fonts.light,
                                            color: base.theme.colors.black
                                        }}> {(userDetail.utfName == null || userDetail.utfName == undefined) ? userDetail.uofName : userDetail.utfName} {(userDetail.utlName == null || userDetail.utlName == undefined) ? userDetail.uolName : userDetail.utlName}</Text>
                                    </Text>
                                    <Text style={{
                                        fontFamily: base.theme.fonts.medium,
                                        fontSize: hp('2'),
                                        color: base.theme.colors.black
                                    }}>Due Date</Text>
                                </View>
                                <View style={{
                                    height: hp('2'),
                                    width: wp('95'),
                                    justifyContent: 'space-between',
                                    alignSelf: 'center',
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    backgroundColor: base.theme.colors.white,
                                    marginTop: 0
                                }}>
                                    <Text numberOfLines={1} style={{
                                        fontFamily: base.theme.fonts.light,
                                        fontSize: hp('2'),
                                        color: base.theme.colors.black,
                                        width: wp('50')
                                    }}>{(userDetail.utEmail == null || userDetail.utEmail == undefined) ? userDetail.uoEmail : userDetail.utEmail}</Text>
                                    <Text style={{
                                        fontFamily: base.theme.fonts.light,
                                        fontSize: hp('2'),
                                        color: base.theme.colors.red
                                    }}>{moment().format('DD-MM-YYYY')}</Text>
                                </View>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                width: wp('100'),
                                height: hp('5'),
                                alignSelf: 'center',
                                alignItems: 'center',
                                backgroundColor: base.theme.colors.grey
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: wp('85'),
                                    height: hp('5'),
                                    borderWidth: 0,
                                    alignItems: 'center',
                                    alignSelf: 'center'
                                }}>
                                    <Text style={{color: base.theme.colors.white}}>Sr. No.</Text>
                                    <Text style={{color: base.theme.colors.white}}>Description</Text>
                                    <Text style={{color: base.theme.colors.white}}>Amount</Text>
                                </View>
                            </View>
                            <View style={{}}>
                                <FlatList
                                    keyExtractor={(item, index) => index.toString()}
                                    data={newArr} renderItem={(item, index) => this._renderDes(item, index, newArr)}/>
                            </View>
                            <View style={{width: wp('100'), flexDirection: 'row'}}>
                                <View style={{width: wp('50'), alignItems: 'center'}}>
                                    {invoiceData.payment != undefined && invoiceData.payment.length != 0 ?
                                        <Image
                                            resizeMode={'cover'}
                                            style={{height: 120, width: wp('42'),}}
                                            source={require('../../../icons/paid.png')}/>
                                        :
                                        <View/>}
                                </View>
                                <View style={{width: wp('50')}}>
                                    <View style={{alignItems: 'flex-end', height: hp('5'), width: wp('50')}}>
                                        <View style={{
                                            width: wp('50'),
                                            borderWidth: 0,
                                            justifyContent: 'space-around',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            right: hp('2'),
                                            height: hp('5')
                                        }}>
                                            <Text style={{color: base.theme.colors.primary}}>Sub Total </Text>
                                            <Text
                                                style={{color: base.theme.colors.black}}>₹{invoiceData.inTotVal - invoiceData.inDsCVal}</Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        alignItems: 'flex-end',
                                        width: wp('50'),
                                        borderBottomWidth: 0.5,
                                        borderBottomColor: base.theme.colors.grey,
                                        height: hp('4.5')
                                    }}>
                                        <View style={{
                                            width: wp('45'),
                                            borderWidth: 0,
                                            height: hp('4.5'),
                                            justifyContent: 'space-around',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            right: hp('2')
                                        }}>
                                            <Text style={{color: base.theme.colors.primary}}>Tax </Text>
                                            <Text style={{color: base.theme.colors.black}}>₹0</Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        alignItems: 'flex-end',
                                        width: wp('50'),
                                        borderBottomWidth: 0,
                                        borderBottomColor: base.theme.colors.grey,
                                        height: hp('5')
                                    }}>
                                        <View style={{
                                            width: wp('53'),
                                            height: hp('5'),
                                            borderWidth: 0,
                                            justifyContent: 'space-around',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            right: hp('2')
                                        }}>
                                            <Text style={{color: base.theme.colors.primary}}>Total Due </Text>
                                            <Text
                                                style={{color: base.theme.colors.black}}>₹{invoiceData.inTotVal - invoiceData.inDsCVal}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View>

                                </View>
                            </View>
                            <ElevatedView elevation={2} style={{
                                height: hp('5'),
                                width: wp('100'),
                                backgroundColor: base.theme.colors.shadedWhite,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <View style={{
                                    width: wp('85'),
                                    alignItems: 'center',
                                    marginTop: hp('0'),
                                    flexDirection: 'row',
                                    alignSelf: 'center',
                                    left: hp('3')
                                }}>
                                    <Text style={{
                                        fontFamily: base.theme.fonts.light,
                                        fontSize: hp('2'),
                                        color: base.theme.colors.black
                                    }}>Total Due: </Text>
                                    <Text style={{
                                        fontFamily: base.theme.fonts.bold,
                                        fontSize: hp('2'),
                                        color: base.theme.colors.black
                                    }}>₹{invoiceData.inTotVal - invoiceData.inDsCVal} Only</Text>
                                </View>
                                {invoiceData.payment != undefined && invoiceData.payment.length != 0 ?
                                    <View/> :
                                    <View style={{
                                        height: hp('4'),
                                        borderRadius: hp('2'),
                                        width: wp('20'),
                                        backgroundColor: base.theme.colors.primary,
                                        right: hp('5'),
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{
                                            fontFamily: base.theme.fonts.medium,
                                            fontSize: hp('2'),
                                            color: base.theme.colors.white
                                        }}>Pay Now</Text>
                                    </View>
                                }
                            </ElevatedView>
                            <View style={{
                                height: hp('15'),
                                width: wp('100'),
                                borderBottomWidth: 1,
                                borderBottomColor: base.theme.colors.grey,
                                justifyContent: 'flex-start',
                                backgroundColor: base.theme.colors.white,
                                marginTop: 15,
                                paddingLeft: 10,
                                marginBottom: 5,
                            }}>
                                <Text style={{
                                    fontFamily: base.theme.fonts.light,
                                    fontSize: hp('2'),
                                    color: base.theme.colors.red,
                                }}>Due upon receipt</Text>
                                <Text style={{
                                    fontFamily: base.theme.fonts.bold,
                                    fontSize: hp('2'),
                                    color: base.theme.colors.black,
                                    marginTop: hp('.5')
                                }}>{this.props.dashBoardReducer.selectedDropdown}</Text>
                                <Text style={{
                                    fontFamily: base.theme.fonts.light,
                                    fontSize: hp('2'),
                                    color: base.theme.colors.black,
                                    marginTop: hp('.5')
                                }}>Tel: {this.props.userReducer.MyMobileNumber}</Text>
                                <Text style={{
                                    fontFamily: base.theme.fonts.light,
                                    fontSize: hp('2'),
                                    color: base.theme.colors.black,
                                    marginTop: hp('.5'),
                                }}>{this.state.assDetail.asCity} {this.state.assDetail.asCountry} {this.state.assDetail.asPinCode}</Text>
                            </View>
                            <View style={{
                                marginBottom: 150,
                                width: wp('100'), height: hp('7'), borderWidth: 0,
                                flexDirection: 'row',
                                paddingLeft: 10, paddingRight: 10,
                            }}>
                                <TouchableOpacity onPress={this.snapshot("view")}
                                                  style={{justifyContent: 'center', alignItems: 'center',}}>
                                    <Image
                                        resizeMode={'center'}
                                        style={{height: hp('10'), width: wp('8'), alignSelf: 'flex-start'}}
                                        source={require('../../../icons/printer.png')}/>
                                </TouchableOpacity>
                               {/* <View style={{width: '90%', alignItems: 'center', justifyContent: 'center'}}>
                                    {invoiceData.payment != undefined && invoiceData.payment.length != 0 ?
                                        <TouchableHighlight underlayColor={base.theme.colors.transparent}
                                                            onPress={() => this.isVieRecModal(invoiceData)} style={{
                                            height: hp('4.5'),
                                            borderRadius: hp('5'),
                                            width: wp('31'),
                                            backgroundColor: base.theme.colors.primary,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            <Text style={{
                                                fontFamily: base.theme.fonts.medium,
                                                fontSize: hp('1.9'),
                                                color: base.theme.colors.white,
                                            }}>Show Receipt</Text>
                                        </TouchableHighlight>
                                        :
                                        <TouchableHighlight underlayColor={base.theme.colors.transparent}
                                                            onPress={() => this.bindComponent(invoiceData)} style={{
                                            height: hp('4.5'),
                                            borderRadius: hp('5'),
                                            width: wp('33'),
                                            backgroundColor: base.theme.colors.primary,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            <Text style={{
                                                fontFamily: base.theme.fonts.medium,
                                                fontSize: hp('1.9'),
                                                color: base.theme.colors.white,
                                            }}>Generate Receipt</Text>
                                        </TouchableHighlight>

                                    }
                                </View>*/}
                            </View>
                        </ScrollView>
                    </View>
                </SafeAreaView>

            </View>
        )
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


    _renderDes(item, index, newArr) {
        let billDetail = item.item;
        let arrLength = newArr.length;
        let itemIndex = item.index;
        let isLastItem = itemIndex === arrLength - 1;
        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: wp('100'),
                borderBottomWidth: 1,
                borderBottomColor: base.theme.colors.greyHead,
                alignSelf: 'center',
                alignItems: 'center',
                backgroundColor: base.theme.colors.greyCard,
                paddingTop: 7,
                paddingBottom: 7
            }}>
                <View style={{borderWidth: 0, width: wp('8'), alignSelf: 'center', right: 0,}}>
                    <Text style={{textAlign: 'center', color: base.theme.colors.black}}>{item.index + 1}</Text>
                </View>
                <View style={{borderWidth: 0, width: wp('30'), alignSelf: 'center', left: hp('3')}}>
                    <Text style={{
                        borderWidth: 0,
                        textAlign: 'center',
                        color: base.theme.colors.black
                    }}>{billDetail.idDesc}</Text>
                </View>
                <View style={{borderWidth: 0, width: wp('25'), alignSelf: 'center', left: hp('2')}}>
                    <Text style={{
                        textAlign: 'center',
                        color: base.theme.colors.black
                    }}>{isLastItem ? "(-)" : "(+)"} ₹{billDetail.idValue}</Text>
                </View>
            </View>
        )
    }

    snapshotShare = refname => () =>
        (refname
                ? captureRef(this.refs[refname], this.state.valueRec)
                : captureScreen(this.state.valueRec)
        )
            .then(
                res =>
                    new Promise((success, failure) =>
                        Image.getSize(res, (width, height) => (
                            console.log(res, width, height), success(res)
                        ), failure))).then(res => this.setState({
                error: null, res, previewSource: {
                    uri: this.state.valueRec.result === "base64" ? "data:application/pdf" + ";base64," + res : res
                }
            }, () => this.sharePdf())
        )
            .catch(
                error => (
                    console.warn(error),
                        this.setState({error, res: null, previewSource: null})
                )
            );

    sharePdf() {
        var image_data = this.state.previewSource.uri.split('data:image/png;base64,');
        console.log("Image:", this.state.previewSource.uri)


        image_data = image_data[1]
        console.log("Image Data:", image_data)

        var path = RNFS.ExternalStorageDirectoryPath + '/image.png';
        RNFS.writeFile(path, image_data, 'base64')
            .then((success) => {
                console.log('FILE WRITTEN!', path);
                this.convertImageToPdf(path);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }
    async convertImageToPdf(path) {
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
            var rnd = this.state.invoiceData.inNumber
            var path1 = RNFS.ExternalStorageDirectoryPath + '/invoice-' + rnd + ".pdf";

            RNFS.copyFile(path, path1)
                .then((success) => {
                    console.log('FILE WRITTEN!', path,);
                    this.shareReceipt(path)
                })
                .catch((err) => {
                    console.log(err.message);
                });

            //     }
            // })


            console.log(options);
        } catch (e) {
            console.log(e);
        }
    }
    shareReceipt(path,type = "application/pdf"){
        Share.open({
            url: "file://"+path,
            title: 'Invoices'
        })

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
        console.log("Image:", this.state.previewSource.uri)


        image_data = image_data[1]//this.state.previewSource.uri;
        console.log("Image Data:", image_data)

        var path = RNFS.ExternalStorageDirectoryPath + '/image.png';
        RNFS.writeFile(path, image_data, 'base64')
            .then((success) => {
                console.log('FILE WRITTEN!', path);
                this.convertImaheToPdf(path);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }



    async convertImaheToPdf(path) {
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
            var rnd = this.state.invoiceData.inNumber
            var path1 = RNFS.ExternalStorageDirectoryPath + '/invoice-' + rnd + ".pdf";

            RNFS.copyFile(path, path1)
                .then((success) => {
                    console.log('FILE WRITTEN!', path,);
                   Alert.alert("Downloaded!",'File downloaded as PDF')

                })
                .catch((err) => {
                    console.log(err.message);
                });

            //     }
            // })


            console.log(options);
        } catch (e) {
            console.log(e);
        }
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


export default (connect(mapStateToProps)(ViewInvoice));
