import React from 'react';
import {ScrollView, Text, View, Image, Platform, TouchableOpacity, FlatList, Alert, Modal} from 'react-native';
import base from "../../base";
import CheckBox from "react-native-check-box";
import {connect} from "react-redux";
import {updateSubscription} from "../../actions";
import moment from "moment";
import SubscriptionStyles from "./SubscriptionStyles";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
  } from 'react-native-responsive-screen';

class SubscriptionManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            oyeLivingProps: [{label: 'Platinum', value: 0},
                {label: 'Gold', value: 1}],
            isOyeLiving: false,
            isShowModal: false,
            isDeviceName: null,
            dataToShowInDesc: [],
            existingSubDate: "",
            isSubValid: true,
            enablePayment: false,
        }
    }

    componentWillMount() {
        this.getPricingDetails();
        this.getDiscountingDetails();
        this.getDiscountingDetailsByAssociationId();
        this.getProductDescriptionOfPlatinum();
        this.getLatestSubscription();

    }

    async getLatestSubscription() {
        // 8 212
        let stat = await base.services.OyeSafeApiFamily.getLatestSubscriptionDetailsByAssId(this.props.assId)
        try {
            if (stat.success && stat.data.subscription !== null) {
                let data = stat.data.subscription;
                const {updateSubscription} = this.props;
                updateSubscription({
                    prop: 'platinumDevCount',
                    value: data.suNofPDev
                });
                updateSubscription({
                    prop: 'goldDevCount',
                    value: data.suNofGDev
                });
                updateSubscription({
                    prop: 'isOyeSafe',
                    value: data.oyeSafeSubs
                });
                updateSubscription({
                    prop: 'isPlatinum',
                    value: data.suNofPDev !== 0
                });
                updateSubscription({
                    prop: 'isGold',
                    value: data.suNofGDev !== 0
                });

                this.setState({
                    existingSubDate: moment(data.sueDate).format('DD-MMM-YYYY'),
                });
                let date = moment(new Date()).format()
                let initialDateString = moment(date, "YYYY-MM-DDTHH:mm:ss a");
                let endDateString = moment(data.sueDate, "YYYY-MM-DDTHH:mm:ss a");
                let duration = moment.duration(endDateString.diff(initialDateString));
                await base.utils.logger.log(duration.days());
                let difference = duration.as('days');
                let isSubValid = true;
                if (difference < 0) {
                    isSubValid = false
                }
                if (parseInt(difference) <= 5) {
                    Alert.alert( base.utils.strings.alertMessage.subscriptionAlert1+ ' ' + parseInt(difference) + base.utils.strings.alertMessage.subscriptionAlert2, message)

                    this.setState({
                        enablePayment: true
                    })

                }
                this.setState({
                    isSubValid: isSubValid
                });
                this.getCompleteCalculation(data.suNofPDev, data.suNofGDev)

            } else {
                this.setState({
                    enablePayment: true
                });
                this.getCompleteCalculation(this.props.subscriptionReducer.platinumDevCount, this.props.subscriptionReducer.goldDevCount)
            }
        } catch (error) {
            console.log('Error in get latest Subscription', error)
        }
    }


    getCompleteCalculation(platinumCount, goldCount) {
        const {updateSubscription} = this.props;

        let pricePlatWithDev = base.utils.validate.getPrice(platinumCount, this.props.subscriptionReducer.platDevPrice);
        let priceGoldWithDev = base.utils.validate.getPrice(goldCount, this.props.subscriptionReducer.goldDevPrice);
        let priceBioWithDev = base.utils.validate.getPrice(platinumCount, this.props.subscriptionReducer.biometricPrice);
        let totalPrice = pricePlatWithDev + priceGoldWithDev + priceBioWithDev;
        let oyeSafeList = this.props.subscriptionReducer.oyeSafeList;
        let priceOfDevWithDur, priceWithDis;

        for (let i = 0; i < oyeSafeList.length; i++) {
            priceOfDevWithDur = base.utils.validate.getTotalPriceWithDuration(totalPrice, oyeSafeList[i].pdDisDur);
            priceWithDis = base.utils.validate.getDiscountPrice(priceOfDevWithDur, oyeSafeList[i].pdDisPer);
            base.utils.validate.getPriceWithGST(priceWithDis, 18, function (totalAmountWithDis, disValue) {
                oyeSafeList[i].priceWithGST = totalAmountWithDis;
                oyeSafeList[i].valueOfGST = disValue;
            });
            oyeSafeList[i].priceOfDevWithDur = priceOfDevWithDur;
            oyeSafeList[i].priceWithDis = priceWithDis;
        }

        updateSubscription({
            prop: 'oyeSafeList',
            value: oyeSafeList
        });
        updateSubscription({
            prop: 'platinumTotalPrice',
            value: pricePlatWithDev
        });

        updateSubscription({
            prop: 'goldTotalPrice',
            value: priceGoldWithDev
        });

        updateSubscription({
            prop: 'biometricTotalPrice',
            value: priceBioWithDev
        });

        for (let i = 0; i < oyeSafeList.length; i++) {
            if (oyeSafeList[i].pdIsActive) {
                updateSubscription({
                    prop: 'oyeSafePrice',
                    value: oyeSafeList[i].priceWithGST.toFixed(2)
                });
                updateSubscription({
                    prop: 'oyeSafeGST',
                    value: oyeSafeList[i].valueOfGST.toFixed(2)
                });
                updateSubscription({
                    prop: 'grandTotal',
                    value: oyeSafeList[i].priceWithGST.toFixed(2)
                });
            }
        }


    }


    async getPricingDetails() {
        let stat = await base.services.OyeSafeApiFamily.getPricingData(this.props.assId)
        try {
            if (stat.success && stat.data.pricing.length !== 0) {

                const {updateSubscription} = this.props;
                updateSubscription({
                    prop: 'platDevPrice',
                    value: stat.data.pricing[0].pdValue
                });
                updateSubscription({
                    prop: 'goldDevPrice',
                    value: stat.data.pricing[1].pdValue
                });
                updateSubscription({
                    prop: 'biometricPrice',
                    value: stat.data.pricing[2].pdValue
                });
            }
        } catch (error) {
            console.log('Error in Pricing Details', error)
        }
    }

    async getDiscountingDetails() {

        let stat = await base.services.OyeSafeApiFamily.getDiscountingData(this.props.assId)
        try {
            const {updateSubscription} = this.props;
            if (stat.success && stat.data.discounting.length !== 0) {
                let disList = stat.data.discounting;
                let oyeSafeList = [];
                let oyeLivingList = [];
                for (let i = 0; i < disList.length; i++) {
                    if (disList[i].pdName === 'OyeSafe') {
                        oyeSafeList.push(disList[i])
                    } else if (disList[i].pdName === 'OyeLiving') {
                        oyeLivingList.push(disList[i])
                    }
                }

                updateSubscription({
                    prop: 'oyeSafeList',
                    value: oyeSafeList
                });

                updateSubscription({
                    prop: 'oyeLivList',
                    value: oyeLivingList
                });

            }
        } catch (error) {
            console.log('Error in Pricing Details', error)
        }
    }

    async getDiscountingDetailsByAssociationId() {
        let stat = await base.services.OyeSafeApiFamily.getDiscountingDataByAssId(this.props.assId)
        try {
            console.log('Status in Discounting Details by AssId', stat)
        } catch (error) {
            console.log('Error in Pricing Details', error)
        }
    }

    async getProductDescriptionOfPlatinum() {
        let stat = await base.services.OyeSafeApiFamily.getDescriptionOfDevice('Platinum')
        try {
            if (stat.success && stat.data.productDescription.length !== 0) {
                let platinumArr = stat.data.productDescription;
                let dataArr = [];
                for (let i = 0; i < platinumArr.length; i++) {
                    dataArr[i] = platinumArr[i]
                }
                this.getProductDescriptionOfGold(dataArr)
            }
        } catch (error) {
            console.log('Error in Desc platinum Details', error)
        }
    }

    async getProductDescriptionOfGold(dataPlatinum) {
        let stat = await base.services.OyeSafeApiFamily.getDescriptionOfDevice('Gold')
        try {
            if (stat.success && stat.data.productDescription.length !== 0) {
                let goldArr = stat.data.productDescription;
                let dataArr = dataPlatinum;
                let len = goldArr.length + dataArr.length;
                let j = 0;
                for (let i = dataArr.length; i < len; i++) {
                    dataArr[i] = goldArr[j]
                    j = j + 1
                }
                this.setState({
                    dataToShowInDesc: dataArr
                })
            }
        } catch (error) {
            console.log('Error in Desc Details', error)
        }
    }

    async createNewSubscription() {
        let input = {
            "SUEDate": "2019-09-08",
            "SUNofPDev": 3,
            "SUNofGDev": 4,
            "SUTotVal": 1200,
            "SUGTotVal": 12320,
            "PRID": 1,
            "ASAssnID": 8,
            "OyeLivingSubs": false,
            "OyeSafeSubs": true,
            "DiscountPerc": 2,
            "PDID": 2,
            "DiscountVal": 200,
            "SUNoofBio": 1
        };
        let stat = await base.services.OyeSafeApiFamily.createSubscription(input);
        try {
        } catch (error) {
            console.log('Error in create subscription', error)
        }

    }

    changeTheCountOfDevices(value, name, count, unitPrice) {
        let countOfDev = count
        if (value === 0) {
            countOfDev = countOfDev - 1
        } else {
            countOfDev = countOfDev + 1
        }
        const {updateSubscription} = this.props;
        let goldDev = this.props.subscriptionReducer.goldDevCount;
        let platDev = this.props.subscriptionReducer.platinumDevCount;

        if (name === 'Platinum') {
            platDev = countOfDev;
            updateSubscription({
                prop: 'platinumDevCount',
                value: countOfDev
            });

        } else if (name === 'Gold') {
            goldDev = countOfDev;
            updateSubscription({
                prop: 'goldDevCount',
                value: countOfDev
            });

        }
        this.getCompleteCalculation(platDev, goldDev)
    }


    checkBoxPlatinum(title, message) {
        const {updateSubscription} = this.props;

        if (this.props.subscriptionReducer.isOyeSafe) {
            if (this.props.subscriptionReducer.isPlatinum) {

                updateSubscription({
                    prop: 'platinumDevCount',
                    value: 0
                });
                this.getCompleteCalculation(0, this.props.subscriptionReducer.goldDevCount)
            }
            updateSubscription({
                prop: 'isPlatinum',
                value: !this.props.subscriptionReducer.isPlatinum
            });

        } else {
            Alert.alert(base.utils.strings.alertMessage.selectOyeSafe, message)
        }

    }

    checkBoxGold(title, message) {

        const {updateSubscription} = this.props;

        if (this.props.subscriptionReducer.isOyeSafe) {
            if (this.props.subscriptionReducer.isGold) {
                updateSubscription({
                    prop: 'goldDevCount',
                    value: 0
                });
                this.getCompleteCalculation(this.props.subscriptionReducer.platinumDevCount, 0)
            }
            updateSubscription({
                prop: 'isGold',
                value: !this.props.subscriptionReducer.isGold
            });
        } else {
            Alert.alert(base.utils.strings.alertMessage.selectOyeSafe, message)
        }

    }


    render(title, message) {
        const {updateSubscription} = this.props;

        return (
            <ScrollView style={SubscriptionStyles.container}>
                <View style={SubscriptionStyles.headerView}>
                    <Text style={SubscriptionStyles.headerText}>
                        Subscription
                    </Text>
                </View>
                <View style={SubscriptionStyles.planView}>
                    <Text style={SubscriptionStyles.planText}>Choose
                        Your Plan</Text>
                </View>
                <View style={SubscriptionStyles.safeHeader}>
                    <CheckBox
                        style={SubscriptionStyles.checkBoxMargin}
                        onClick={() => {
                            updateSubscription({
                                prop: 'isOyeSafe',
                                value: !this.props.subscriptionReducer.isOyeSafe
                            });

                        }}
                        isChecked={this.props.subscriptionReducer.isOyeSafe}
                        checkedImage={<Image source={require('../../../icons/checkbox.png')}
                                             style={SubscriptionStyles.checkBoxImage}/>}
                        unCheckedImage={<Image source={require('../../../icons/unchecked.png')}
                                               style={SubscriptionStyles.checkBoxImage}/>}
                    />
                    <Text style={SubscriptionStyles.safeText}>OyeSafe:
                        <Text style={[SubscriptionStyles.textBlack,SubscriptionStyles.subFontSize]}>{' '}Security and Safety
                            Solution</Text>
                    </Text>
                </View>
                <View style={SubscriptionStyles.safeMainView}>
                    <View style={SubscriptionStyles.safeSubView}>
                        <View style={SubscriptionStyles.existSubView}>
                            <View style={{flex:1}}>
                                <Text style={[SubscriptionStyles.subFontSize,SubscriptionStyles.subPrimary]}>
                                    Existing Subscription -
                                </Text>
                            </View>
                            <View style={{flex:1}}>
                                <Text style={[SubscriptionStyles.subFontSize,SubscriptionStyles.textBlack]}>
                                Valid Till:
                                <Text style={[SubscriptionStyles.subFontSize,{color: this.state.isSubValid ? base.theme.colors.primary : base.theme.colors.red
                                }]}>{' '}{this.state.existingSubDate}</Text>
                            </Text>
                            </View>
                        </View>
                        <View style={SubscriptionStyles.safeTableHead}>
                            <View style={SubscriptionStyles.devView}>
                                <Text style={[SubscriptionStyles.mediumFontSize,SubscriptionStyles.textBlack]}>Device</Text>
                            </View>
                            <View style={SubscriptionStyles.priceView}>
                                <Text style={[SubscriptionStyles.subFontSize,SubscriptionStyles.textBlack]}>Monthly Unit Price</Text>
                            </View>
                            <View
                                style={SubscriptionStyles.devView}>
                                <Text style={[SubscriptionStyles.subFontSize,SubscriptionStyles.textBlack]}>Quantity</Text>
                            </View>
                        </View>
                        <View style={[SubscriptionStyles.safeTableSub,{backgroundColor: this.props.subscriptionReducer.isPlatinum ? base.theme.colors.greyCard : base.theme.colors.white,}]}>
                            <View style={[SubscriptionStyles.platView]}>
                                <CheckBox
                                    style={SubscriptionStyles.checkBoxMarginSub}
                                    onClick={() => {
                                        this.checkBoxPlatinum()
                                    }}
                                    isChecked={this.props.subscriptionReducer.isPlatinum}
                                    checkedImage={<Image source={require('../../../icons/checkbox1.png')}
                                                         style={SubscriptionStyles.checkBoxImageSub}/>}
                                    unCheckedImage={<Image source={require('../../../icons/unchecked.png')}
                                                           style={SubscriptionStyles.checkBoxImageSub}/>}
                                />
                                <TouchableOpacity onPress={() => this.showDescriptionModal(0)}>
                                    <Text style={SubscriptionStyles.platText}>Platinum</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[SubscriptionStyles.priceView,SubscriptionStyles.flexDir]}>
                                <Text style={[SubscriptionStyles.lowFontSize,SubscriptionStyles.textBlack]}>{base.utils.strings.rupeeIconCode}</Text>
                                <Text style={[SubscriptionStyles.lowFontSize,SubscriptionStyles.lowFontSize,SubscriptionStyles.textDecorStyle]}>{this.props.subscriptionReducer.platDevPrice}</Text>
                            </View>
                            <View style={SubscriptionStyles.devPlatCount}>
                                {this.props.subscriptionReducer.platinumDevCount === 0 || !this.props.subscriptionReducer.isPlatinum ?
                                    <View style={SubscriptionStyles.checkBoxImageSub}/> :
                                    <TouchableOpacity
                                        onPress={() => this.changeTheCountOfDevices(0, 'Platinum', this.props.subscriptionReducer.platinumDevCount, this.props.subscriptionReducer.platDevPrice)}>
                                        <Image style={[SubscriptionStyles.checkBoxImageSub,SubscriptionStyles.alignImage]}
                                               source={require('../../../icons/subtract.png')}
                                        />
                                    </TouchableOpacity>}
                                <Text style={[SubscriptionStyles.lowFontSize,SubscriptionStyles.textBlack]}>{this.props.subscriptionReducer.platinumDevCount}</Text>
                                {!this.props.subscriptionReducer.isPlatinum ? <View style={SubscriptionStyles.checkBoxImageSub}/> :
                                    <TouchableOpacity
                                        onPress={() => this.changeTheCountOfDevices(1, 'Platinum', this.props.subscriptionReducer.platinumDevCount, this.props.subscriptionReducer.platDevPrice)}>
                                        <Image style={[SubscriptionStyles.checkBoxImageSub,SubscriptionStyles.alignImage]}
                                               source={require('../../../icons/add.png')}
                                        />
                                    </TouchableOpacity>}
                            </View>
                        </View>
                        <View style={[SubscriptionStyles.safeTableSub,{backgroundColor: this.props.subscriptionReducer.isGold ? base.theme.colors.greyCard : base.theme.colors.white,}]}>
                            <View style={SubscriptionStyles.platView}>
                                <CheckBox
                                    style={SubscriptionStyles.checkBoxMarginSub}
                                    onClick={() => {
                                        this.checkBoxGold()
                                    }}
                                    isChecked={this.props.subscriptionReducer.isGold}
                                    checkedImage={<Image source={require('../../../icons/checkbox1.png')}
                                                         style={SubscriptionStyles.checkBoxImageSub}/>}
                                    unCheckedImage={<Image source={require('../../../icons/unchecked.png')}
                                                           style={SubscriptionStyles.checkBoxImageSub}/>}
                                />
                                <TouchableOpacity onPress={() => this.showDescriptionModal(1)}>
                                    <Text style={SubscriptionStyles.platText}>Gold</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                width: '50%', height: '100%', alignItems: 'center', justifyContent: 'center',
                                borderRightWidth: 1, borderColor: base.theme.colors.shadedWhite, flexDirection: 'row'
                            }}>
                                <Text style={{
                                    fontSize: 12,
                                    color: base.theme.colors.black
                                }}>{base.utils.strings.rupeeIconCode}</Text>

                                <Text style={{
                                    fontSize: 12,
                                    color: base.theme.colors.black,
                                    textDecorationLine: 'line-through',
                                    textDecorationStyle: 'solid',
                                    textDecorationColor: '#ffffff',
                                }}>{this.props.subscriptionReducer.goldDevPrice}</Text>
                            </View>
                            <View
                                style={{
                                    width: '25%',
                                    height: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'space-around',
                                    flexDirection: 'row'
                                }}>
                                {this.props.subscriptionReducer.goldDevCount === 0 || !this.props.subscriptionReducer.isGold ?
                                    <View style={{height: 15, width: 15}}/> :
                                    <TouchableOpacity
                                        onPress={() => this.changeTheCountOfDevices(0, 'Gold', this.props.subscriptionReducer.goldDevCount, this.props.subscriptionReducer.goldDevPrice)}>
                                        <Image style={{height: 15, width: 15, alignSelf: 'center'}}
                                               source={require('../../../icons/subtract.png')}
                                        />
                                    </TouchableOpacity>
                                }
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: base.theme.colors.black
                                    }}>{this.props.subscriptionReducer.goldDevCount}</Text>
                                {!this.props.subscriptionReducer.isGold ? <View style={{height: 15, width: 15}}/> :
                                    <TouchableOpacity
                                        onPress={() => this.changeTheCountOfDevices(1, 'Gold', this.props.subscriptionReducer.goldDevCount, this.props.subscriptionReducer.goldDevPrice)}>
                                        <Image style={{height: 15, width: 15, alignSelf: 'center'}}
                                               source={require('../../../icons/add.png')}
                                        />
                                    </TouchableOpacity>}
                            </View>
                        </View>
                        <View style={{
                            width: '98%', flexDirection: 'row', height: '7%',
                            backgroundColor: this.props.subscriptionReducer.isPlatinum ? base.theme.colors.greyCard : base.theme.colors.white,
                        }}>
                            <View style={{
                                width: '25%',
                                height: '100%',
                                borderRightWidth: 1,
                                borderColor: base.theme.colors.shadedWhite,
                                alignItems: 'center',
                                flexDirection: 'row'
                            }}>
                                <CheckBox
                                    style={{marginLeft: 5}}
                                    onClick={(title, message) => {
                                        if (this.props.subscriptionReducer.isOyeSafe) {
                                            this.props.subscriptionReducer.isPlatinum ? Alert.alert(base.utils.strings.alertMessage.biometricWithPlatinum,message) : Alert.alert(base.utils.strings.alertMessage.biometricWithGold, message)
                                        } else {
                                            Alert.alert(base.utils.strings.alertMessage.selectOyeSafe, message)
                                        }

                                    }}
                                    isChecked={this.props.subscriptionReducer.isPlatinum}
                                    checkedImage={<Image source={require('../../../icons/checkbox1.png')}
                                                         style={{height: 15, width: 15}}/>}
                                    unCheckedImage={<Image source={require('../../../icons/unchecked.png')}
                                                           style={{height: 15, width: 15}}/>}
                                />
                                <Text style={{
                                    marginLeft: 5,
                                    fontSize: 12,
                                    color: base.theme.colors.black
                                }}>Biometric</Text>
                            </View>
                            <View style={{
                                width: '50%', height: '100%', alignItems: 'center', justifyContent: 'center',
                                borderRightWidth: 1, borderColor: base.theme.colors.shadedWhite, flexDirection: 'row'
                            }}>
                                <Text style={{
                                    fontSize: 12,
                                    color: base.theme.colors.black
                                }}>{base.utils.strings.rupeeIconCode}</Text>

                                <Text style={{
                                    fontSize: 12,
                                    color: base.theme.colors.black,
                                    textDecorationLine: 'line-through',
                                    textDecorationStyle: 'solid',
                                    textDecorationColor: '#ffffff',
                                }}>{this.props.subscriptionReducer.biometricPrice}</Text>
                            </View>
                            <View
                                style={{
                                    width: '25%',
                                    height: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'space-around',
                                    flexDirection: 'row'
                                }}>

                                <View style={{height: 15, width: 15}}
                                />
                                <Text style={{
                                    fontSize: 12,
                                    color: base.theme.colors.black
                                }}>{this.props.subscriptionReducer.platinumDevCount}</Text>
                                <View style={{height: 15, width: 15}}/>
                            </View>
                        </View>
                        <View style={{width: '100%', marginTop: 25, alignItems: 'center'}}>
                            <FlatList
                                data={this.props.subscriptionReducer.oyeSafeList}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={(item, index) => this.arrangeTails(item, index)}
                                extraData={this.props}
                                horizontal={true}
                            />
                        </View>
                        <View style={{
                            width: '100%', borderWidth: 1, borderColor: base.theme.colors.lightgrey, height: '10%',
                            alignItems: 'center', justifyContent: 'space-around', marginTop: 10, flexDirection: 'row'
                        }}>
                            <View style={{width: '50%',}}>
                                <Text style={{fontSize: 14, color: base.theme.colors.primary}}> Sub Total - <Text style={{
                                        color: base.theme.colors.black, textDecorationLine: 'line-through',
                                        textDecorationStyle: 'solid',
                                        textDecorationColor: '#ffffff',
                                    }}
                                          multiLine={true}
                                    > {base.utils.strings.rupeeIconCode}{this.props.subscriptionReducer.oyeSafePrice}</Text>
                                </Text>
                            </View>
                            <View style={{width: '50%',}}>
                                <Text style={{fontSize: 14, color: base.theme.colors.mediumGrey,}}>Incl GST @ 18%:
                                    <Text multiLine={true} style={{
                                        textDecorationLine: 'line-through',
                                        textDecorationStyle: 'solid',
                                        textDecorationColor: '#ffffff',
                                    }}
                                    > {base.utils.strings.rupeeIconCode}{this.props.subscriptionReducer.oyeSafeGST}</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <Text style={{fontSize: 18, color: base.theme.colors.primary}}> Grand Total - <Text style={{
                            color: base.theme.colors.black, textDecorationLine: 'line-through',
                            textDecorationStyle: 'solid',
                            textDecorationColor: '#ffffff',
                        }}
                              multiLine={true}
                        > {base.utils.strings.rupeeIconCode}{this.props.subscriptionReducer.grandTotal}</Text>
                    </Text>
                    <Text style={{fontSize: 14, color: base.theme.colors.mediumGrey,}}>(Including all taxes)</Text>
                </View>

                {this.state.isShowModal ?
                    this.showModalDesc() :
                    <View/>}

                <TouchableOpacity onPress={() => Alert.alert(base.utils.strings.alertMessage.paymentSuccess,message)}
                                  style={{
                                      height: 70,
                                      width: '100%',
                                      backgroundColor: this.props.subscriptionReducer.isOyeSafe && this.state.enablePayment ? base.theme.colors.themeColor : base.theme.colors.lightgrey,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      marginTop: 20,
                                  }} disabled={!(this.props.subscriptionReducer.isOyeSafe && this.state.enablePayment)}>
                    <Text style={{fontSize: 18, color: base.theme.colors.white}}>Pay Now</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }

    showDescriptionModal(value) {
        this.setState({
            isShowModal: true,
            isDeviceName: value
        })
    }

    showModalDesc() {
        let device = this.state.isDeviceName === 0 ? 'Platinum Device' : 'Gold Device';
        return (
            <Modal
                visible={this.state.isShowModal}
                transparent={true}
                animationType={'fade'}
                onRequestClose={() => this.closeModal()}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    backgroundColor: '#00000090',
                    alignSelf:'center',
                    height: '100%',
                    width: '100%'
                }}>
                    <View style={{width:'90%',height: '16%',justifyContent:'center', backgroundColor: base.theme.colors.white,alignSelf:'center', alignItems: 'center'}}>
                        <View style={{alignItems:'center',justifyContent:'center', flexDirection:'row',marginTop:5}}>
                        <View style={{flex:1,}}/>
                        <View style={{flex:1,justifyContent:'center',alignItems:'center',}}>
                        <Text style={{
                            fontSize: 16,
                            color: base.theme.colors.primary,
                        }}>{device}</Text>
                        </View>
                        <View style={{flex:1,alignSelf:'center', alignItems:'center'}}>
                        <TouchableOpacity style={{width: '100%',height:'14%',justifyContent:'center', alignItems: 'flex-end',}}
                                          onPress={() => this.closeModal()}>
                            <Image style={{height: 20, width: 20,right:10 ,alignSelf: 'flex-end',}}
                                   source={require('../../../icons/close_btn1.png')}
                            />
                        </TouchableOpacity>
                        </View>
                        </View>
                        <FlatList
                            data={this.state.dataToShowInDesc}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={(item, index) => this.descPointsView(item, this.state.isDeviceName)}
                        />
                    </View>


                </View>

            </Modal>
        );
    }

    descPointsView(item, selDev) {
        let dev = selDev === 0 ? 'Platinum' : 'Gold';
        if (item.item.prName === dev) {
            return (
                <View style={{flexDirection: 'row', alignItems: 'center',}}>
                    <View style={{
                        alignSelf: 'center',
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: base.theme.colors.black,
                        marginLeft: 10,
                        marginRight: 5
                    }}/>
                    <Text style={{
                        fontSize: hp('1.4%'),
                        color: base.theme.colors.black,
                        textDecorationLine: item.item.pdIsActive ? 'none' : 'line-through',
                        textDecorationStyle: 'solid',
                        marginBottom: 5,
                        textDecorationColor: '#ffffff',
                    }} multiLine={true}>{item.item.pdDesc}</Text>
                </View>
            )
        }

    }

    closeModal() {
        this.setState({isShowModal: false})
    }

    arrangeTails(item, index) {

        let durNum, duration;

        if (parseInt(item.item.pdDisDur) < 12) {
            if (parseInt(item.item.pdDisDur) === 1) {
                duration = 'Month'
            } else {
                duration = 'Months'
            }
            durNum = parseInt(item.item.pdDisDur);
        } else if (parseInt(item.item.pdDisDur) === 12) {
            durNum = 1;
            duration = 'Year'
        } else {
            durNum = parseInt(item.item.pdDisDur) / 12;
            duration = 'Years'
        }

        return (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity onPress={() => this.getCardSelected(item)} style={{
                    borderRadius: 10,
                    backgroundColor: item.item.pdIsActive ? base.theme.colors.primary : base.theme.colors.greyCard,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        fontSize: 10,
                        marginLeft: 10,
                        marginRight: 10,
                        marginTop: 10
                    }}>{durNum + ' ' + duration}</Text>
                    <Text style={{
                        fontSize: 12,
                        textDecorationLine: 'line-through',
                        textDecorationStyle: 'solid',
                        textDecorationColor: '#ffffff', marginLeft: 5, marginRight: 5,
                    }}>{base.utils.strings.rupeeIconCode}{item.item.priceOfDevWithDur}</Text>
                    <Text style={{
                        fontSize: 14,
                        marginLeft: 5,
                        marginRight: 5,
                        textDecorationLine: 'line-through',
                        textDecorationStyle: 'solid',
                        textDecorationColor: '#ffffff',
                    }}>{base.utils.strings.rupeeIconCode}{item.item.priceWithDis}</Text>
                    <Text style={{
                        fontSize: 10,
                        marginLeft: 5,
                        marginRight: 5,
                        marginBottom: 10
                    }}>Save {item.item.pdDisPer}%</Text>

                </TouchableOpacity>
                {item.item.pdIsActive ?
                    <View style={{height: 40, width: 100, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 8}}>Valid Till</Text>
                        <Text style={{
                            fontSize: 10,
                            color: base.theme.colors.primary
                        }}>{moment(item.item.pdValTill).format('DD-MMM-YYYY')}</Text>
                    </View>
                    :
                    <View style={{height: 40, width: 100, alignItems: 'center', justifyContent: 'center'}}/>}
                    
            </View>
        )

    }

    getCardSelected(item) {
        let oyeSafeDisList = this.props.subscriptionReducer.oyeSafeList;
        for (let i = 0; i < oyeSafeDisList.length; i++) {
            if (item.index === i) {
                oyeSafeDisList[i].pdIsActive = true
            } else {
                oyeSafeDisList[i].pdIsActive = false
            }
        }
        const {updateSubscription} = this.props;
        updateSubscription({
            prop: 'oyeSafePrice',
            value: item.item.priceWithGST.toFixed(2)
        });
        updateSubscription({
            prop: 'oyeSafeGST',
            value: item.item.valueOfGST.toFixed(2)
        });
        updateSubscription({
            prop: 'grandTotal',
            value: item.item.priceWithGST.toFixed(2)
        });
        updateSubscription({
            prop: 'oyeSafeList',
            value: oyeSafeDisList
        });

    }
}

const mapStateToProps = state => {
    return {
        dashBoardReducer: state.DashboardReducer,
        userReducer: state.UserReducer,
        subscriptionReducer: state.SubscriptionReducer,
        assId:state.DashboardReducer.assId ,
        uniID: state.DashboardReducer.uniID,
    };
};

export default connect(
    mapStateToProps, {updateSubscription}
)(SubscriptionManagement)