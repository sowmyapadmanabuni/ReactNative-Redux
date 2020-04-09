import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    Dimensions,
    Image
} from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import Styles from './AccountingStyles.js';
import { Card, Button, Form, Input, Item } from 'native-base';
import { Dropdown } from 'react-native-material-dropdown';
import base from '../../base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RadioButton, RadioGroup } from 'react-native-flexi-radio-button';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import moment from 'moment';

const WIDTH = Dimensions.get('screen').width - 20;
const HEIGHT = Dimensions.get('screen').height;

const BankName = [
    { id: 1, value: 'State Bank of India' },
    { id: 2, value: 'Central Bank of India' },
    { id: 3, value: 'karnataka Bank' },
    { id: 4, value: 'Axis Bank' },
    { id: 5, value: 'ICICI Bank' }
];
export default class HelloWorldApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dobText: 'Due Date', //year + '-' + month + '-' + date,
            dobDate: '',

            dobText1: 'Invoice Generation Date', //year + '-' + month + '-' + date,
            dobDate1: ''
        };
    }
    // onSelect(index, value) {
    //     this.setState({
    //         text: `${value}`
    //     });
    // }

    //Date Picker - 1
    onDOBPress = () => {
        let dobDate = this.state.dobDate;
        if (!dobDate || dobDate == null) {
            dobDate = new Date();
            this.setState({
                dobDate: dobDate
            });
        }
        this.refs.dobDialog.open({
            date: dobDate
            // minDate: new Date() //To restirct past dates
        });
    };

    onDOBDatePicked = date => {
        this.setState({
            dobDate: date,
            dobText: moment(date).format('YYYY-MM-DD')
        });
    };

    //Date Picker - 2
    onDOBPress = () => {
        let dobDate = this.state.dobDate1;
        if (!dobDate || dobDate == null) {
            dobDate = new Date();
            this.setState({
                dobDate1: dobDate
            });
        }
        this.refs.dobDialog1.open({
            date: dobDate
            // minDate: new Date() //To restirct past dates
        });
    };

    onDOBDatePicked = date => {
        this.setState({
            dobDate1: date,
            dobText1: moment(date).format('YYYY-MM-DD')
        });
    };

    render() {
        return (
            <View style={Styles.container}>
                <SafeAreaView style={{ backgroundColor: '#ff8c00' }}>
                    <View style={[Styles.viewStyle1, { flexDirection: 'row' }]}>
                        <View style={Styles.viewDetails1}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.goBack();
                                }}
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
                                        style={Styles.viewDetails2}
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
                                style={[Styles.image1]}
                                source={require('../../../icons/OyespaceSafe.png')}
                            />
                        </View>
                        <View style={{ flex: 0.2 }}></View>
                    </View>
                    <View style={{ borderWidth: 1, borderColor: '#EBECED' }} />
                </SafeAreaView>

                <Text style={Styles.titleOfScreen}>Accounting</Text>
                <KeyboardAwareScrollView>
                    <Card style={Styles.card}>
                        <View style={Styles.accountingDetails}>
                            <Text style={Styles.accountingDetailsText}>
                                Accounting Details
                            </Text>
                        </View>
                        <View style={Styles.dropDownView}>
                            <Dropdown
                                //   value={BankName}
                                data={BankName}
                                textColor={base.theme.colors.black}
                                inputContainerStyle={{}}
                                //  label="Select Relationship"
                                baseColor="rgba(0, 0, 0, 1)"
                                placeholder="Select Bank"
                                placeholderTextColor={base.theme.colors.black}
                                placeholderStyle={{ fontWeight: 'bold' }}
                                labelHeight={hp('4%')}
                                containerStyle={{
                                    width: wp('85%'),
                                    height: hp('8%')
                                }}
                                rippleOpacity={0}
                                dropdownPosition={-6}
                                dropdownOffset={{ top: 0, left: 0 }}
                                style={{ fontSize: hp('2.2%') }}
                                // onChangeText={(value, index) => this.changeFamilyMember(value, index)}
                            />
                        </View>
                        <Form>
                            <Item style={Styles.inputItem}>
                                <Input
                                    autoCorrect={false}
                                    autoCapitalize="characters"
                                    keyboardType="default"
                                    placeholder="Account Number"
                                    // onChangeText={vehName => this.setState({vehName: vehName})}
                                />
                            </Item>
                            <Item style={Styles.inputItem}>
                                <Input
                                    autoCorrect={false}
                                    autoCapitalize="characters"
                                    keyboardType="default"
                                    placeholder="IFSC Code"
                                    // onChangeText={vehNum => this.setState({vehNum: vehNum})}
                                />
                            </Item>
                        </Form>
                        <View style={Styles.selectRateStyle}>
                            <Text style={Styles.text}>Select Rate</Text>
                        </View>
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                flexDirection: 'row',
                                height: hp('7%')
                            }}
                        >
                            <RadioGroup
                                color={base.theme.colors.blue}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    flex: 1
                                }}
                                selectedIndex={0}
                                // onSelect={(index, value) => this.onSelect(index, value)}
                            >
                                <RadioButton value={'Flat Rate Value'}>
                                    <Text>Flat Rate Value</Text>
                                </RadioButton>
                                <RadioButton value={'Dimension Based'}>
                                    <Text>Dimension Based</Text>
                                </RadioButton>
                            </RadioGroup>
                        </View>
                        <View
                            style={{
                                borderBottomRadius: hp('0.1%'),
                                borderBottomWidth: hp('0.1%'),
                                marginHorizontal: hp('2.5%')
                            }}
                        >
                            <TouchableOpacity onPress={this.onDOBPress.bind(this)}>
                                <View style={Styles.datePickerBox}>
                                    <Text>{this.state.dobText} </Text>
                                    <DatePickerDialog
                                        ref="dobDialog"
                                        onDatePicked={this.onDOBDatePicked.bind(this)}
                                    />
                                    <View style={Styles.calView}>
                                        <Image
                                            style={Styles.viewDatePickerImageStyle}
                                            source={require('../../../icons/calender.png')}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={Styles.dropDownView}>
                            <Dropdown
                                //   value={BankName}
                                data={BankName}
                                textColor={base.theme.colors.black}
                                inputContainerStyle={{}}
                                //  label="Select Relationship"
                                baseColor="rgba(0, 0, 0, 1)"
                                placeholder="Late Payment Charge Type"
                                placeholderTextColor={base.theme.colors.black}
                                placeholderStyle={{ fontWeight: 'bold' }}
                                labelHeight={hp('4%')}
                                containerStyle={{
                                    width: wp('85%'),
                                    height: hp('8%')
                                }}
                                rippleOpacity={0}
                                dropdownPosition={-6}
                                dropdownOffset={{ top: 0, left: 0 }}
                                style={{ fontSize: hp('2.2%') }}
                                // onChangeText={(value, index) => this.changeFamilyMember(value, index)}
                            />
                        </View>
                        <Form>
                            <Item style={Styles.inputItem}>
                                <Input
                                    autoCorrect={false}
                                    autoCapitalize="characters"
                                    keyboardType="default"
                                    placeholder="Late Payment Charge"
                                    // onChangeText={vehName => this.setState({vehName: vehName})}
                                />
                            </Item>
                        </Form>

                        <View style={Styles.selectRateStyle}>
                            <Text style={Styles.text}>Invoice Generation Automatic</Text>
                        </View>
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                flexDirection: 'row',
                                paddingHorizontal: hp('1.5%'),
                                height: hp('7%')
                            }}
                        >
                            <RadioGroup
                                color={base.theme.colors.blue}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    flex: 1
                                }}
                                selectedIndex={1}
                                // onSelect1={(index, value) => this.onSelect(index, value)}
                            >
                                <RadioButton value={'Flat Rate Value'}>
                                    <Text>Yes</Text>
                                </RadioButton>
                                <RadioButton
                                    style={{ marginHorizontal: hp('5%') }}
                                    value={'Dimension Based'}
                                >
                                    <Text>No</Text>
                                </RadioButton>
                            </RadioGroup>
                        </View>

                        <Form>
                            <Item style={Styles.inputItem}>
                                <Input
                                    autoCorrect={false}
                                    autoCapitalize="characters"
                                    keyboardType="default"
                                    placeholder="Invoice Creation"
                                    // onChangeText={vehName => this.setState({vehName: vehName})}
                                />
                            </Item>
                            <Item style={Styles.inputItem}>
                                <Input
                                    autoCorrect={false}
                                    autoCapitalize="characters"
                                    keyboardType="default"
                                    placeholder="Frequency"
                                    // onChangeText={vehNum => this.setState({vehNum: vehNum})}
                                />
                            </Item>
                        </Form>

                        <View
                            style={{
                                borderBottomRadius: hp('0.1%'),
                                borderBottomWidth: hp('0.1%'),
                                marginTop: hp('1%'),
                                marginHorizontal: hp('2.5%')
                            }}
                        >
                            <TouchableOpacity onPress={this.onDOBPress.bind(this)}>
                                <View style={Styles.datePickerBox}>
                                    <Text>{this.state.dobText1} </Text>
                                    <DatePickerDialog
                                        ref="dobDialog1"
                                        onDatePicked={this.onDOBDatePicked.bind(this)}
                                    />
                                    <View style={Styles.calView}>
                                        <Image
                                            style={Styles.viewDatePickerImageStyle}
                                            source={require('../../../icons/calender.png')}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={Styles.dropDownView}>
                            <Dropdown
                                //   value={BankName}
                                data={BankName}
                                textColor={base.theme.colors.black}
                                inputContainerStyle={{}}
                                //  label="Select Relationship"
                                baseColor="rgba(0, 0, 0, 1)"
                                placeholder="Block"
                                placeholderTextColor={base.theme.colors.black}
                                placeholderStyle={{ fontWeight: 'bold' }}
                                labelHeight={hp('4%')}
                                containerStyle={{
                                    width: wp('85%'),
                                    height: hp('8%')
                                }}
                                rippleOpacity={0}
                                dropdownPosition={-6}
                                dropdownOffset={{ top: 0, left: 0 }}
                                style={{ fontSize: hp('2.2%') }}
                                // onChangeText={(value, index) => this.changeFamilyMember(value, index)}
                            />
                        </View>

                        <View style={Styles.dropDownView}>
                            <Dropdown
                                //   value={BankName}
                                data={BankName}
                                textColor={base.theme.colors.black}
                                inputContainerStyle={{}}
                                //  label="Select Relationship"
                                baseColor="rgba(0, 0, 0, 1)"
                                placeholder="Unit Name"
                                placeholderTextColor={base.theme.colors.black}
                                placeholderStyle={{ fontWeight: 'bold' }}
                                labelHeight={hp('4%')}
                                containerStyle={{
                                    width: wp('85%'),
                                    height: hp('8%')
                                }}
                                rippleOpacity={0}
                                dropdownPosition={-6}
                                dropdownOffset={{ top: 0, left: 0 }}
                                style={{ fontSize: hp('2.2%') }}
                                // onChangeText={(value, index) => this.changeFamilyMember(value, index)}
                            />
                        </View>
                    </Card>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}
