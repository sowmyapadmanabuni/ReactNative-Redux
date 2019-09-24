import React from 'react';
import {ScrollView, Text, View, Image, Platform, TouchableOpacity, FlatList, Alert,Modal} from 'react-native';
import base from "../../base";
import CheckBox from "react-native-check-box";
import {connect} from "react-redux";
import {updateIdDashboard, updateSubscription} from "../../actions";
import moment from "moment";

class SubscriptionManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            oyeLivingProps: [{label: 'Platinum', value: 0},
                {label: 'Gold', value: 1}],
            isOyeLiving: false,
            isOyeSafe: false,
            isPlatinum: false,
            isGold: false,
            isShowModal: false,
            isDeviceName: null,
            dataToShowInDesc: [],
            existingSubDate: "",
            isSubValid: true,
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
          //this.props.userReducer.SelectedAssociationID 8 212
        let stat = await base.services.OyeSafeApiFamily.getLatestSubscriptionDetailsByAssId(this.props.userReducer.SelectedAssociationID)
        try {
            console.log('Status', stat)
            if (stat.success && stat.data.subscription !== null) {
                console.log('Status1', stat)

                let data = stat.data.subscription;
                const { updateSubscription} = this.props;
                        updateSubscription({
                            prop: 'platinumDevCount',
                            value: data.suNofPDev
                        });
                        updateSubscription({
                            prop: 'goldDevCount',
                            value: data.suNofGDe
                        });
                        updateSubscription({
                            prop: 'bioDevCount',
                            value: data.suNoofBio
                        });
                this.setState({
                    existingSubDate: moment(data.sueDate).format('DD-MMM-YYYY'),
                    isOyeSafe: true,
                    isPlatinum: data.suNofPDev !== 0,
                    isGold: data.suNofGDev !== 0,
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
                this.setState({
                    isSubValid: isSubValid
                })
                this.getCompletePriceCal()

            } else {
                console.log('Status2', stat)
                this.setState({
                    isOyeSafe: true,
                    isPlatinum: true,
                    isGold:true,
                });
                this.getCompletePriceCal()
            }
        } catch (error) {
            console.log('Status3', error)
            console.log('Error in get latest Subscription', error)
        }
    }

    getCompletePriceCal(){
        console.log('Caluclate details pltmjjh',this.props.subscriptionReducer)
        let pricePlatWithDev = base.utils.validate.getPrice(this.props.subscriptionReducer.platinumDevCount, this.props.subscriptionReducer.platDevPrice)
        let priceGoldWithDev=base.utils.validate.getPrice(this.props.subscriptionReducer.goldDevCount, this.props.subscriptionReducer.goldDevPrice)
        let priceBioWithDev=base.utils.validate.getPrice(this.props.subscriptionReducer.bioDevCount, this.props.subscriptionReducer.biometricPrice)
        console.log('Price Cal per dev', pricePlatWithDev,priceGoldWithDev,priceBioWithDev)
        const { updateSubscription} = this.props;
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

            this.getPricingOfDevForDuration()
    }

    async getPricingDetails() {
        console.log('PropsInSubScreenPricingData', this.props)
        let stat = await base.services.OyeSafeApiFamily.getPricingData(this.props.userReducer.SelectedAssociationID)
        try {
            console.log('Status in Pricing Details', stat)
            if (stat.success && stat.data.pricing.length !== 0) {

                const { updateSubscription} = this.props;
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
        console.log('PropsInSubScreenPricingData', this.props)

        let stat = await base.services.OyeSafeApiFamily.getDiscountingData(this.props.userReducer.SelectedAssociationID)
        try {
            const { updateSubscription} = this.props;

            console.log('Status in Discounting Details', stat)
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

                console.log('Discounting lists', oyeSafeList, oyeLivingList)
            }
        } catch (error) {
            console.log('Error in Pricing Details', error)
        }
    }

    async getDiscountingDetailsByAssociationId() {
        console.log('PropsInSubScreenPricingData', this.props)
        let stat = await base.services.OyeSafeApiFamily.getDiscountingDataByAssId(this.props.userReducer.SelectedAssociationID)
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
                console.log('Status in Description', stat.data.productDescription)
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
            console.log('Create new sub', stat)
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
        const { updateSubscription} = this.props;
        if (name === 'Platinum') {
            updateSubscription({
                prop: 'platinumDevCount',
                value: countOfDev
            });

        } else if (name === 'Gold') {
            updateSubscription({
                prop: 'goldDevCount',
                value: countOfDev
            });

        } else if (name === 'Biometric') {
            updateSubscription({
                prop: 'bioDevCount',
                value: countOfDev
            });
        }
        this.getPricingWithEachDev(name, countOfDev, unitPrice)
    }

    getPricingWithEachDev(name, countOfDev, unitPrice) {
        let pricingWithDev = base.utils.validate.getPrice(countOfDev, unitPrice)
        console.log('Total Pricing amount with devices', pricingWithDev,this.props)
        const { updateSubscription} = this.props;

        if (name === "Platinum") {
            updateSubscription({
                prop: 'platinumTotalPrice',
                value: pricingWithDev
            });
        } else if (name === "Gold") {
            updateSubscription({
                prop: 'goldTotalPrice',
                value: pricingWithDev
            });
        } else if (name === "Biometric") {
            updateSubscription({
                prop: 'biometricTotalPrice',
                value: pricingWithDev
            });
        }
        this.getPricingOfDevForDuration()

    }

    getPricingOfDevForDuration() {
        console.log('this props in getPricingofDev',this.props.subscriptionReducer)
        let oyeSafeList = this.props.subscriptionReducer.oyeSafeList;
        console.log('Get oyeSafeList', oyeSafeList);
        let totalPrice=this.props.subscriptionReducer.biometricTotalPrice+this.props.subscriptionReducer.platinumTotalPrice+this.props.subscriptionReducer.goldTotalPrice
        let priceOfDevWithDur, priceWithDis;

        for (let i = 0; i < oyeSafeList.length; i++) {
            priceOfDevWithDur = base.utils.validate.getTotalPriceWithDuration(totalPrice, oyeSafeList[i].pdDisDur)
            priceWithDis = base.utils.validate.getDiscountPrice(priceOfDevWithDur, oyeSafeList[i].pdDisPer)
            base.utils.validate.getPriceWithGST(priceWithDis, 18, function (totalAmountWithDis, disValue) {
                console.log('GST calculation', totalAmountWithDis, disValue)
                oyeSafeList[i].priceWithGST = totalAmountWithDis;
                oyeSafeList[i].valueOfGST = disValue;
            });

            oyeSafeList[i].priceOfDevWithDur = priceOfDevWithDur;
            oyeSafeList[i].priceWithDis = priceWithDis;
        }
        console.log("OyeSafe List", oyeSafeList)
        const { updateSubscription} = this.props;

        updateSubscription({
            prop: 'oyeSafeList',
            value: oyeSafeList
        });

        for(let i=0;i<oyeSafeList.length;i++){
            if(oyeSafeList[i].pdIsActive){
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

    checkBoxPlatinum(value){
        console.log('Value Before',value)
        const { updateSubscription} = this.props;

        if (this.state.isOyeSafe) {
            this.setState({
                isPlatinum: !this.state.isPlatinum,
            })
        } else {
            Alert.alert('Please select oyeSafe for editing')
        }
        if(value){
            updateSubscription({
                prop: 'platinumTotalPrice',
                value:0
            });
            updateSubscription({
                prop: 'biometricTotalPrice',
                value: 0
            });
            updateSubscription({
                prop: 'platinumDevCount',
                value:0
            });
            updateSubscription({
                prop: 'bioDevCount',
                value:0
            });
            this.getPricingOfDevForDuration()

        }
        else{
            this.getPricingOfDevForDuration()

        }
    }
    checkBoxGold(value){
        const { updateSubscription} = this.props;

        if (this.state.isOyeSafe) {
            this.setState({
                isGold: !this.state.isGold,
            })
        } else {
            Alert.alert('Please select oyeSafe for editing')
        }
        if(value){
            updateSubscription({
                prop: 'goldTotalPrice',
                value: 0
            });
            updateSubscription({
                prop: 'goldDevCount',
                value: 0
            });
            this.getPricingOfDevForDuration()
        }
        else{
            this.getPricingOfDevForDuration()

        }
    }



    render() {
        console.log('Props in SubScreen',this.props.subscriptionReducer)
        return (
            <ScrollView style={{height: '100%', width: '100%'}}>
                <View style={{
                    width: '100%', alignItems: 'center', backgroundColor: base.theme.colors.white, elevation: 2,
                    shadowColor: base.theme.colors.shadedWhite,
                    shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 4},
                    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.8,
                    shadowRadius: 5,
                }}>
                    <Text style={{fontSize: 18, color: base.theme.colors.primary, marginTop: 5, marginBottom: 15}}>
                        Subscription
                    </Text>
                </View>
                <View style={{width: '100%', alignItems: 'center',}}>
                    <Text style={{fontSize: 18, color: base.theme.colors.black, marginTop: 10, marginBottom: 20}}>Choose
                        Your Plan</Text>
                </View>
                <View style={{
                    height: 40,
                    width: '95%',
                    alignSelf: 'center',
                    backgroundColor: base.theme.colors.primary,
                    borderRadius: 25,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <CheckBox
                        style={{marginLeft: 20}}
                        onClick={() => {
                            this.setState({
                                isOyeSafe: !this.state.isOyeSafe,
                            })
                        }}
                        isChecked={this.state.isOyeSafe}
                        checkedImage={<Image source={require('../../../icons/checkbox.png')}
                                             style={{height: 30, width: 30}}/>}
                        unCheckedImage={<Image source={require('../../../icons/unchecked.png')}
                                               style={{height: 30, width: 30}}/>}
                    />
                    <Text style={{fontSize: 18, color: base.theme.colors.white, marginLeft: 10}}>OyeSafe:
                        <Text style={{fontSize: 14, color: base.theme.colors.black,}}>{' '}Security and Safety
                            Solution</Text>
                    </Text>
                </View>
                <View style={{
                    width: '90%',
                    borderWidth: 1,
                    alignSelf: 'center',
                    borderColor: base.theme.colors.shadedWhite,
                    alignItems: 'center'
                }}>
                    <View style={{height: 350, width: '100%', borderRadius: 20, alignItems: 'center',}}>
                        <View style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            marginTop: 10,
                            marginBottom: 10
                        }}>
                            <Text style={{fontSize: 14, color: base.theme.colors.primary,}}>
                                Existing Subscription -
                            </Text>
                            <Text style={{fontSize: 14, color: base.theme.colors.black,}}>
                                Valid Till:
                                <Text style={{
                                    fontSize: 14,
                                    color: this.state.isSubValid ? base.theme.colors.primary : base.theme.colors.red
                                }}>{' '}{this.state.existingSubDate}</Text>
                            </Text>
                        </View>
                        <View style={{
                            width: '98%', flexDirection: 'row', height: '8%',
                            backgroundColor: base.theme.colors.lightgrey,
                        }}>
                            <View style={{
                                width: '25%',
                                height: '100%',
                                borderRightWidth: 1,
                                borderColor: base.theme.colors.greyHead,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text style={{fontSize: 15, color: base.theme.colors.black}}>Device</Text>
                            </View>
                            <View style={{
                                width: '50%', height: '100%', alignItems: 'center', justifyContent: 'center',
                                borderRightWidth: 1, borderColor: base.theme.colors.shadedWhite,
                            }}>
                                <Text style={{fontSize: 15, color: base.theme.colors.black}}>Monthly Unit Price</Text>
                            </View>
                            <View
                                style={{width: '25%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{fontSize: 15, color: base.theme.colors.black}}>Quantity</Text>
                            </View>
                        </View>
                        <View style={{
                            width: '98%', flexDirection: 'row', height: '7%',
                            backgroundColor: this.state.isPlatinum ? base.theme.colors.greyCard : base.theme.colors.white,
                        }}>
                            <View style={{
                                width: '25%',
                                height: '100%',
                                borderRightWidth: 1,
                                borderColor: base.theme.colors.shadedWhite,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <CheckBox
                                    style={{marginLeft: 5}}
                                    onClick={(value) => {this.checkBoxPlatinum(this.state.isPlatinum)}}
                                    isChecked={this.state.isPlatinum}
                                    checkedImage={<Image source={require('../../../icons/checkbox1.png')}
                                                         style={{height: 15, width: 15}}/>}
                                    unCheckedImage={<Image source={require('../../../icons/unchecked.png')}
                                                           style={{height: 15, width: 15}}/>}
                                />
                                <TouchableOpacity onPress={() => this.showDescriptionModal(0)}>
                                    <Text style={{
                                        marginLeft: 5,
                                        fontSize: 12,
                                        color: base.theme.colors.hyperLink,
                                        textDecorationLine: 'underline'
                                    }}>Platinum</Text>
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
                                    color: base.theme.colors.black
                                }}>{this.props.subscriptionReducer.platDevPrice}</Text>
                            </View>
                            <View
                                style={{
                                    width: '25%',
                                    height: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'space-around',
                                    flexDirection: 'row'
                                }}>
                                {this.props.subscriptionReducer.platinumDevCount <= 1 || !this.state.isPlatinum ?
                                    <View style={{height: 15, width: 15}}/> :
                                    <TouchableOpacity
                                        onPress={() => this.changeTheCountOfDevices(0, 'Platinum', this.props.subscriptionReducer.platinumDevCount, this.props.subscriptionReducer.platDevPrice)}>
                                        <Image style={{height: 15, width: 15, alignSelf: 'center'}}
                                               source={require('../../../icons/subtract.png')}
                                        />
                                    </TouchableOpacity>}
                                <Text style={{
                                    fontSize: 12,
                                    color: base.theme.colors.black
                                }}>{this.props.subscriptionReducer.platinumDevCount}</Text>
                                {!this.state.isPlatinum ? <View style={{height: 15, width: 15}}/> :
                                    <TouchableOpacity
                                        onPress={() => this.changeTheCountOfDevices(1, 'Platinum', this.props.subscriptionReducer.platinumDevCount, this.props.subscriptionReducer.platDevPrice)}>
                                        <Image style={{height: 15, width: 15, alignSelf: 'center'}}
                                               source={require('../../../icons/add.png')}
                                        />
                                    </TouchableOpacity>}
                            </View>
                        </View>
                        <View style={{
                            width: '98%', flexDirection: 'row', height: '7%',
                            backgroundColor: this.state.isGold ? base.theme.colors.greyCard : base.theme.colors.white,
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
                                    onClick={(value) => {this.checkBoxGold(this.state.isGold)}}
                                    isChecked={this.state.isGold}
                                    checkedImage={<Image source={require('../../../icons/checkbox1.png')}
                                                         style={{height: 15, width: 15}}/>}
                                    unCheckedImage={<Image source={require('../../../icons/unchecked.png')}
                                                           style={{height: 15, width: 15}}/>}
                                />
                                <TouchableOpacity onPress={() => this.showDescriptionModal(1)}>
                                    <Text style={{
                                        marginLeft: 5,
                                        fontSize: 12,
                                        color: base.theme.colors.hyperLink,
                                        textDecorationLine: 'underline'
                                    }}>Gold</Text>
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
                                    color: base.theme.colors.black
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
                                {this.props.subscriptionReducer.goldDevCount <= 1 || !this.state.isGold ?
                                    <View style={{height: 15, width: 15}}/> :
                                    <TouchableOpacity
                                        onPress={() => this.changeTheCountOfDevices(0, 'Gold', this.props.subscriptionReducer.goldDevCount, this.props.subscriptionReducer.goldDevPrice)}>
                                        <Image style={{height: 15, width: 15, alignSelf: 'center'}}
                                               source={require('../../../icons/subtract.png')}
                                        />
                                    </TouchableOpacity>
                                }
                                <Text
                                    style={{fontSize: 12, color: base.theme.colors.black}}>{ this.props.subscriptionReducer.goldDevCount}</Text>
                                {!this.state.isGold ? <View style={{height: 15, width: 15}}/> :
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
                            backgroundColor: this.state.isPlatinum ? base.theme.colors.greyCard : base.theme.colors.white,
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
                                    onClick={() => {
                                        if (this.state.isOyeSafe) {
                                            this.state.isPlatinum ? Alert.alert('For Platinum Biometric is mandatory') : Alert.alert('You can select Biometric with Platinum only')
                                        } else {
                                            Alert.alert('Please select oyeSafe for editing')
                                        }

                                    }}
                                    isChecked={this.state.isPlatinum}
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
                                    color: base.theme.colors.black
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
                                {this.props.subscriptionReducer.bioDevCount <= 1 || !this.state.isPlatinum ?
                                    <View style={{height: 15, width: 15}}/> :
                                    <TouchableOpacity
                                        onPress={() => this.changeTheCountOfDevices(0, 'Biometric', this.props.subscriptionReducer.bioDevCount, this.props.subscriptionReducer.biometricPrice)}>
                                        <Image style={{height: 15, width: 15, alignSelf: 'center'}}
                                               source={require('../../../icons/subtract.png')}
                                        />
                                    </TouchableOpacity>
                                }
                                <Text style={{
                                    fontSize: 12,
                                    color: base.theme.colors.black
                                }}>{this.props.subscriptionReducer.bioDevCount}</Text>
                                {!this.state.isPlatinum ? <View style={{height: 15, width: 15}}/> :
                                    <TouchableOpacity
                                        onPress={() => this.changeTheCountOfDevices(1, 'Biometric', this.props.subscriptionReducer.bioDevCount, this.props.subscriptionReducer.biometricPrice)}>
                                        <Image style={{height: 15, width: 15, alignSelf: 'center'}}
                                               source={require('../../../icons/add.png')}
                                        />
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                        <View style={{width: '100%', marginTop: 25}}>
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
                                <Text style={{fontSize: 14, color: base.theme.colors.primary}}> Sub Total -
                                    <Text style={{color: base.theme.colors.black}}
                                          multiLine={true}
                                    > {base.utils.strings.rupeeIconCode}{this.props.subscriptionReducer.oyeSafePrice}</Text>
                                </Text>
                            </View>
                            <View style={{width: '50%',}}>
                                <Text style={{fontSize: 14, color: base.theme.colors.mediumGrey}}>Incl GST @ 18%:
                                    <Text multiLine={true}
                                    > {base.utils.strings.rupeeIconCode}{this.props.subscriptionReducer.oyeSafeGST}</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <Text style={{fontSize: 18, color: base.theme.colors.primary}}> Grand Total -
                        <Text style={{color: base.theme.colors.black}}
                              multiLine={true}
                        > {base.utils.strings.rupeeIconCode}{this.props.subscriptionReducer.grandTotal}</Text>
                    </Text>
                    <Text style={{fontSize: 14, color: base.theme.colors.mediumGrey}}>(Including all taxes)</Text>
                </View>
                {this.state.isShowModal ?
                    this.showModalDesc() :
                    <View/>}

                <TouchableOpacity onPress={() => Alert.alert('We will release payment gateway feature soon !!!')}
                                  style={{
                                      height:70,
                                      width: '100%',
                                      backgroundColor:this.state.isOyeSafe? base.theme.colors.primary: base.theme.colors.lightgrey,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      marginTop: 20,
                                  }} disabled={!this.state.isOyeSafe}>
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
                    backgroundColor: base.theme.colors.transparent,
                    height: '100%',
                    width: '100%'
                }}>
                    <View style={{width: '90%', backgroundColor: base.theme.colors.white, alignItems: 'center'}}>
                        <TouchableOpacity style={{width: '100%', alignItems: 'flex-end',}}
                                          onPress={() => this.closeModal()}>
                            <Image style={{height: 20, width: 20, alignSelf: 'flex-end'}}
                                   source={require('../../../icons/close_btn1.png')}
                            />
                        </TouchableOpacity>
                        <Text style={{
                            fontSize: 16,
                            color: base.theme.colors.primary,
                            marginBottom: 10,
                            marginTop: 10
                        }}>{device}</Text>
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
        console.log('Data in the descView', item, selDev)
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
                        fontSize: 11,
                        color: base.theme.colors.black,
                        textDecorationLine: item.item.pdIsActive ? 'none' : 'line-through',
                        textDecorationStyle: 'solid',
                        marginBottom: 5,
                        textDecorationColor: '#ffffff'
                    }} multiLine={true}>{item.item.pdDesc}</Text>
                </View>
            )
        }

    }

    closeModal() {
        this.setState({isShowModal: false})
    }

    arrangeTails(item, index) {
        console.log('TailsData',item, item.item, index)

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
                    marginLeft: 15,
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
                    }}>{base.utils.strings.rupeeIconCode}{item.item.priceWithDis}</Text>
                    <Text style={{
                        fontSize: 10,
                        marginLeft: 5,
                        marginRight: 5,
                        marginBottom: 10
                    }}>Save {item.item.pdDisPer}%</Text>

                </TouchableOpacity>
                {item.item.pdIsActive ?
                    <View style={{height: 40, width: 80, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 8}}>Valid Till</Text>
                        <Text style={{
                            fontSize: 10,
                            color: base.theme.colors.primary
                        }}>{moment(item.item.pdValTill).format('DD-MMM-YYYY')}</Text>
                    </View>
                    :
                    <View style={{height: 40, width: 80, alignItems: 'center', justifyContent: 'center'}}/>}
            </View>
        )

    }

    getCardSelected(item) {
        console.log('Selected Card:', item, this.props.subscriptionReducer.oyeSafeList)
        let oyeSafeDisList = this.props.subscriptionReducer.oyeSafeList;
        for (let i = 0; i < oyeSafeDisList.length; i++) {
               if(item.index===i){
                 oyeSafeDisList[i].pdIsActive=true
               }
               else{
                   oyeSafeDisList[i].pdIsActive=false
               }
        }
        const { updateSubscription} = this.props;
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
        subscriptionReducer:state.SubscriptionReducer,
    };
};

export default connect(
    mapStateToProps,{updateSubscription}
)(SubscriptionManagement)