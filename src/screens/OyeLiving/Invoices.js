/*
 * @Author: Sarthak Mishra 
 * @Date: 2019-10-07 12:14:58 
 * @Last Modified by: Sarthak Mishra
 * @Last Modified time: 2019-10-22 15:07:18
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
import Collapsible from 'react-native-collapsible';

import { connect } from 'react-redux';
import base from '../../base';
import { Dropdown } from 'react-native-material-dropdown';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from "react-native-responsive-screen";
import SelectMultiple from 'react-native-select-multiple';
import moment from "moment";
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';



let dt = new Date();
dt.setDate(dt.getDate());
let _dt = dt;

let radio_props = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 }
];







class Invoices extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            blockList: [],
            blockListAdd: [],
            isLoading: false,
            selectedBlock: '',
            selectedBlock: '',
            blockId: '',
            isModalVisible: false,
            collapse1: false,
            invoiceNumber: "",
            expenseCollapse: false,
            invoiceDateCollapse:false,
            dueDateCollapse:false,
            invoiceList:[]

        }
    }


    componentDidMount() {
        this.getBlockList();
    }

    async getBlockList() {
        let self = this;
        let stat = await base.services.OyeLivingApi.getTheListOfBlocksByAssociation(this.props.userReducer.SelectedAssociationID);
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
            })
            console.log('error', error)
        }


    }


    async getInvoiceList(val, index) {
        let self = this;
        let blockId = self.state.blockList[index].details.blBlockID;
        let associationId = self.props.userReducer.SelectedAssociationID
        self.setState({
            isLoading: true,
            selectedBlock: val,
            blockId: blockId,
            getIndex: index
        })
        console.log("Selected Block Data:", val, index);
        let stat = await base.services.OyeLivingApi.getInvoices(associationId,blockId);
        console.log("Stat111111:",stat.data.invoices)
        try {
            if(stat.success && stat.data.invoices.length!==0){
                self.setState({
                    invoiceList:stat.data.invoices
                })
            }
            else{
                self.setState({
                    invoiceList:stat.data.invoices
                })
            }
            
        } catch (error) {
            console.log(error)
        }
    }


    clearTheFilters() {

    }

    onModalOpen() {
        this.setState({
            isModalVisible: !this.state.isModalVisible,
            collapse1: true
        })
    }


    render() {
        return (
            <TouchableOpacity>
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
                            value={'Select Block'}
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
                            dropdownPosition={-3}
                            rippleOpacity={0}
                            onChangeText={(value, index) => {
                                this.getInvoiceList(value, index)
                            }}
                        />
                        <TouchableOpacity
                            underlayColor={base.theme.colors.transparent}
                            onPress={() => this.state.selectedBlock == '' ? alert('Please select block to Apply filters') : this.onModalOpen()}
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
                    {this.state.isModalVisible ?
                        <View style={{
                            position: 'absolute', height: hp('50'),
                            width: wp('60'), backgroundColor: base.theme.colors.white,
                            alignSelf: 'flex-end',
                            marginTop: 40
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
                                                onChangeText={(text) => this.setState({ amountStart: text })}
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
                                                onChangeText={(text) => this.setState({ amountEnd: text })}
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
                                                        <Text style={{ width: 80, }}>{this.state.toDate == '' ? this.state.toDate : moment(this.state.toDate).format('DD-MM-YYYY')}</Text>
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
                                        onPress={() => this.setState({ expenseCollapse: !this.state.expenseCollapse })}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Text style={{ fontSize: 16, color: base.theme.colors.black }}>Expense Name</Text>
                                            <Image
                                                resizeMode={'contain'}
                                                style={{ height: hp('4'), width: wp('4'), tintColor: base.theme.colors.black, }}
                                                source={this.state.expenseCollapse ? require('../../../icons/show_less.png') : require('../../../icons/show_more.png')}
                                            />
                                        </View>
                                    </TouchableHighlight>
                                    <Collapsible collapsed={!this.state.expenseCollapse}>
                                        <View style={{ flexDirection: 'row', marginTop: hp('2') }}>
                                            <RadioForm
                                                radio_props={radio_props}
                                                initial={0}
                                                formHorizontal={true}
                                                labelHorizontal={true}
                                                buttonColor={base.theme.colors.primary}
                                                selectedButtonColor={base.theme.colors.primary}
                                                radioStyle={{ paddingRight: 20 }}
                                                animation={true}
                                                onPress={(value) => { this.setState({ value: value }) }}
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
                                        onPress={() => this.setState({ dueDateCollapse: !this.state.dueDateCollapse })}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Text style={{ fontSize: 16, color: base.theme.colors.black }}>Due Date</Text>
                                            <Image
                                                resizeMode={'contain'}
                                                style={{ height: hp('4'), width: wp('4'), tintColor: base.theme.colors.black, }}
                                                source={this.state.dueDateCollapse ? require('../../../icons/show_less.png') : require('../../../icons/show_more.png')}
                                            />
                                        </View>
                                    </TouchableHighlight> 
                                    <Collapsible collapsed={!this.state.dueDateCollapse}>                     
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
                                                        <Text style={{ width: 80, }}>{this.state.toDate == '' ? this.state.toDate : moment(this.state.toDate).format('DD-MM-YYYY')}</Text>
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
                </View>
            </TouchableOpacity>
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

    }
};

export default (connect(mapStateToProps)(Invoices));
