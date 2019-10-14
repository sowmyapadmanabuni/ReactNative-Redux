import React from 'react';
import {
    ActivityIndicator,
    Alert,
    BackHandler,
    Easing,
    FlatList,
    Image,
    Linking,
    Platform,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import {NavigationEvents} from 'react-navigation';

import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Input, Item} from 'native-base';

import ZoomImage from 'react-native-zoom-image';
import Style from './Style';
import base from '../../../../base';
import {connect} from 'react-redux';
import {updateIdDashboard} from '../../../../actions';

import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import IcoMoonConfig from '../../../../assets/selection.json';

const Icon = createIconSetFromIcoMoon(IcoMoonConfig);

class MyFamilyList extends React.Component {
    static navigationOptions = {
        title: 'MyFamilyList',
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            familyData: [],
            isLoading: true,
            dataSource: [],
            query: '',
            loading: false,
            error: null,
            myFamilyList: [],
            myfamily11: [],
            isModelVisible: true,
            searchText: ''
        };

        this.arrayholder = [];
    }


    renderFlatList(item) {
        let itemID = item.id;

        return (
            <TouchableHighlight onPress={() => this.deleteData(item.id)}>
                //some code
            </TouchableHighlight>
        );
    }

    deleteData(itemID) {
        console.log('fsdkjhfjsa', itemID);
        let itemId = itemID;

        fetch(
            `http://${this.props.oyeURL}/oyesafe/api/v1/FamilyMemberDetailsDelete/update`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
                },
                body: JSON.stringify({
                    FMID: itemId
                })
            }
        )
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson);
                let data = responseJson;
                if (data.success) {
                    this.myFamilyListGetData();
                } else {
                    alert(data.error.message);
                }
            })
            .catch(error => {
                console.log('error', error);
                alert(data.error.message);
            });
    }

    searchFilterFunction = text => {
        this.setState({
            value: text
        });
        const newData = this.arrayholder.filter(item => {
            const itemData = `${item.fmName.toUpperCase()} ${item.fmName.toUpperCase()} ${item.fmName.toUpperCase()}`;
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            dataSource: newData
        });
    };

    async myFamilyListGetData() {
        this.setState({loading: true});
        //console.log("Data sending to get family",this.props, this.props.dashBoardReducer.assId, this.props.dashBoardReducer.uniID,this.props.userReducer.MyAccountID)
        let myFamilyList = await base.services.OyeSafeApiFamily.myFamilyList(
            this.props.dashBoardReducer.uniID,
            this.props.dashBoardReducer.assId,
            this.props.userReducer.MyAccountID
        );
        //console.log("Get Family Data", myFamilyList); //this.props.userReducer.MyAccountID
        this.setState({isLoading: false, loading: false});
        try {
            if (myFamilyList.success && myFamilyList.data) {
                this.setState({
                    myfamily11: myFamilyList.data.familyMembers.sort((a, b) =>
                        a.fmName > b.fmName ? 1 : -1
                    ),
                    clonedList: myFamilyList.data.familyMembers.sort((a, b) =>
                        a.fmName > b.fmName ? 1 : -1
                    )
                });
                const {updateIdDashboard} = this.props;
                updateIdDashboard({
                    prop: 'familyMemberCount',
                    value: myFamilyList.data.familyMembers.length
                });
                this.setState({familyData: myFamilyList});
            } else {
                this.showAlert(stat.error.message, true);
            }
        } catch (error) {
            base.utils.logger.log(error);
            this.setState({error, loading: false});
            const {updateIdDashboard} = this.props;
            updateIdDashboard({
                prop: 'familyMemberCount',
                value: 0
            });
        }
    }

    showAlert(msg, ispop) {
        let self = this;
        setTimeout(() => {
            this.showMessage(this, '', msg, 'OK', function () {
            });
        }, 500);
    }

    showMessage(self, title, message, btn, callback) {
        Alert.alert(title, message, [
            {
                text: btn,
                onPress: () => {
                    self.setState({isLoading: false});
                    callback();
                }
            }
        ]);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                isLoading: false
            });
        }, 1500);
        base.utils.validate.checkSubscription(this.props.userReducer.SelectedAssociationID)
        this.myFamilyListGetData();
    }

    componentDidUpdate() {
        setTimeout(() => {
            BackHandler.addEventListener('hardwareBackPress', () =>
                this.processBackPress()
            );
        }, 100);
    }

    componentWillUnmount() {
        setTimeout(() => {
            BackHandler.removeEventListener('hardwareBackPress', () =>
                this.processBackPress()
            );
        }, 0);
    }

    processBackPress() {
        console.log('Part');
        const {goBack} = this.props.navigation;
        goBack(null);
        return true;
    }

    renderItem = ({item, index}) => {
        let itemID = item.id;
        console.log('Image issue', item, index);
        return (
            <View
                style={[
                    Style.tableView,
                    {marginBottom: index === this.state.myfamily11.length - 1 ? 270 : 0}
                ]}
            >
                <View style={Style.cellView}>
                    <View style={Style.imageContainerViewStyle}>
                        {item.fmImgName == '' ? (
                            <ZoomImage
                                source={{
                                    uri:
                                        'https://mediaupload.oyespace.com/' +
                                        base.utils.strings.noImageCapturedPlaceholder
                                }}
                                imgStyle={Style.placeholderImage}
                                duration={300}
                                enableScaling={true}
                                easingFunc={Easing.bounce}
                            />
                        ) : (
                            <ZoomImage
                                source={{
                                    uri: 'https://mediaupload.oyespace.com/' + item.fmImgName
                                }}
                                imgStyle={Style.placeholderImage}
                                duration={300}
                                enableScaling={true}
                                easingFunc={Easing.bounce}
                            />
                        )}
                    </View>
                    <View style={Style.middleFlexBlockForMemberDetailsViewContainer}>
                        <Text style={Style.familyMemberNameTextStyle}>{item.fmName}</Text>
                        <View style={Style.memberDetailFlexViewStyle}>
                            <Icon color="#ff8c00" size={wp('3.4%')} name="user"/>
                            {/* <Image
                    style={Style.memberDetailIconImageStyle}
                    source={require("../../../../../icons/user.png")}
                /> */}
                            <Text style={Style.memberDetailsTextStyle}>{item.fmRltn}</Text>
                        </View>

                        <View style={Style.memberDetailFlexViewStyle}>
                            <Icon color="#ff8c00" size={wp('3.4%')} name="call"/>
                            {/* <Image
                    style={Style.memberDetailIconImageStyle}
                    source={require("../../../../../icons/call.png")}
                /> */}
                            <Text style={Style.memberDetailsTextStyle}>{item.fmMobile}</Text>
                        </View>
                    </View>
                    <View style={Style.editAndCallIconsFlexStyle}>
                        <View style={Style.threeBtnStyle}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate('MyFamilyEdit', {
                                        myFamilyMobileNo: item.fmMobile.replace(item.fmisdCode, ''),
                                        acAccntID: item.acAccntID,
                                        asAssnID: item.asAssnID,
                                        fmGurName: item.fmGurName,
                                        fmImgName: item.fmImgName,
                                        fmIsActive: item.fmIsActive,
                                        fmMinor: item.fmMinor,
                                        fmMobile: item.fmMobile,
                                        fmName: item.fmName,
                                        fmRltn: item.fmRltn,
                                        fmid: item.fmid,
                                        fmisdCode: item.fmisdCode,
                                        fmlName: item.fmlName,
                                        meMemID: item.meMemID,
                                        unUnitID: item.unUnitID
                                    });
                                }}
                            >
                                <Icon color="#ff8c00" size={wp('5%')} name="edit"/>
                                {/* <Image
                  style={Style.editAndCallButtonIconImageStyle}
                  source={require("../../../../../icons/edit.png")}
                /> */}
                            </TouchableOpacity>
                        </View>

                        <View style={Style.threeBtnStyle}>
                            <TouchableOpacity
                                onPress={() => {
                                    {
                                        Platform.OS === 'android'
                                            ? Linking.openURL(`tel:${item.fmMobile}`)
                                            : Linking.openURL(`tel:${item.fmMobile}`);
                                    }
                                }}
                            >
                                <Icon color="#ff8c00" size={wp('5%')} name="call"/>
                                {/* <Image
                  style={Style.editAndCallButtonIconImageStyle}
                  source={require("../../../../../icons/call.png")}
                /> */}
                            </TouchableOpacity>
                        </View>

                        <View style={Style.threeBtnStyle}>
                            <TouchableOpacity onPress={() => this.deleteData(item.fmid)}>
                                <Icon color="#ff8c00" size={wp('5%')} name="delete"/>
                                {/* <Image
                  style={Style.editAndCallButtonIconImageStyle}
                  source={require("../../../../../icons/delete.png")}
                /> */}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={Style.lineAboveAndBelowFlatList}/>
            </View>
        );
    };

    handleSearch(text) {
        this.setState({searchText: text});
        console.log('Text', text);
        let sortList = this.state.clonedList;
        let filteredArray = [];
        if (text.length === 0) {
            filteredArray.push(this.state.clonedList);
        } else {
            for (let i in sortList) {
                if (
                    sortList[i].fmName.toLowerCase().includes(text.toLowerCase()) ||
                    sortList[i].fmRltn.toLowerCase().includes(text.toLowerCase()) ||
                    sortList[i].fmMobile.toLowerCase().includes(text.toLowerCase())
                ) {
                    filteredArray.push(sortList[i]);
                }
            }
        }
        this.setState({
            myfamily11: text.length === 0 ? filteredArray[0] : filteredArray
        });
    }

    render() {
        const {navigate} = this.props.navigation;

        console.log('Item issue', this.props);

        if (this.state.isLoading) {
            return (
                <View style={Style.mainView}>
                    {/* <Header /> */}

                    <SafeAreaView style={{backgroundColor: '#ff8c00'}}>
                        <View style={[Style.viewStyle1, {flexDirection: 'row'}]}>
                            <View style={Style.viewDetails1}>
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
                                            source={require('../../../../../icons/back.png')}
                                            style={Style.viewDetails2}
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
                                    style={[Style.image1]}
                                    source={require('../../../../../icons/OyespaceSafe.png')}
                                />
                            </View>
                            <View style={{flex: 0.2}}>
                                {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
                            </View>
                        </View>
                        <View style={{borderWidth: 1, borderColor: '#ff8c00'}}/>
                    </SafeAreaView>

                    <View style={Style.progressViewStyle}>
                        <ActivityIndicator size="large" color="#01CBC6"/>
                    </View>
                </View>
            );
        }
        return (
            <View style={Style.mainView}>
                {/* <Header /> */}

                <SafeAreaView style={{backgroundColor: '#ff8c00'}}>
                    <View style={[Style.viewStyle1, {flexDirection: 'row'}]}>
                        <View style={Style.viewDetails1}>
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
                                        source={require('../../../../../icons/back.png')}
                                        style={Style.viewDetails2}
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
                                style={[Style.image1]}
                                source={require('../../../../../icons/OyespaceSafe.png')}
                            />
                        </View>
                        <View style={{flex: 0.2}}>
                            {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
                        </View>
                    </View>
                    <View style={{borderWidth: 1, borderColor: '#ff8c00'}}/>
                </SafeAreaView>

                <NavigationEvents
                    onDidFocus={payload => this.myFamilyListGetData()}
                    onWillBlur={payload => this.myFamilyListGetData()}
                />
                <View style={Style.containerViewStyle}>
                    <Text style={Style.titleOfScreenStyle}>Family Members</Text>

                    <View style={{flexDirection: 'row'}}>
                        <Item style={Style.inputItem}>
                            <Input
                                marginBottom={hp('-1%')}
                                placeholder="Search...."
                                multiline={false}
                                onChangeText={text => this.handleSearch(text)}
                            />
                            <Icon
                                color="#ff8c00"
                                name="search"
                                size={hp('3%')}
                                style={Style.icon}
                            />
                        </Item>
                    </View>

                    
                        <FlatList
                            contentContainerStyle={this.state.myfamily11.length === 0 && Style.centerEmptySet}
                            style={{marginTop: hp('2%')}}
                            // data={this.state.dataSource.sort((a, b) =>
                            //   a.fmName.localeCompare(b.fmName)
                            // )}
                            data={this.state.myfamily11}
                            extraData={this.state}
                            renderItem={this.renderItem}
                            keyExtractor={(item, index) => item.fmid.toString()}
                            ListEmptyComponent={
                                <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'white'
                            }}
                        >
                            <Icon
                                size={hp('10%')}
                                style={{margin: hp('1%')}}
                                name="family-group-of-three"
                            />
                            {/* <Image source={require('../../../../../icons/family-group-of-three.png')} style={{width:hp('10%'), height:hp('10%'), margin:hp('1%')}}/> */}
                            <Text
                                style={{
                                    backgroundColor: 'white',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: hp('1.6%')
                                }}
                            >
                                Add your family details
                            </Text>
                        </View>
                            }
                        />
                    
                    <TouchableOpacity
                    style={Style.floatButton}
                    onPress={() => this.props.navigation.navigate('MyFamily')}
                >
                    <Text
                        style={Style.plusTextStyle}
                    >
                        +
                    </Text>
                </TouchableOpacity>

                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        associationid: state.DashboardReducer.associationid,
        selectedAssociation: state.DashboardReducer.selectedAssociation,
        oyeURL: state.OyespaceReducer.oyeURL,
        mediaupload: state.OyespaceReducer.mediaupload,
        dashBoardReducer: state.DashboardReducer,
        userReducer: state.UserReducer
    };
};

export default connect(
    mapStateToProps,
    {updateIdDashboard}
)(MyFamilyList);

// createIdsForData = () => {
//   // returns a new array with ids from index
//   let dataWithIds = this.state.myfamily11.map((item, index) => {
//     item.id = index
//   })

//   this.setState({
//     myfamily11: dataWithIds
//   })
// }

// removeHandler = id => {
//   // returns new array with item filtered out
//   this.setState({
//     myfamily11: this.state.myfamily11.filter(item => item.id === id)
//   })
// }

// deleteItemById = id => {
//   this.setState({
//     value: id
//   })
//   const filteredData = this.state.myfamily11.filter(item => {
//     item.id === myFamilyList.data.familyMembers.fmid

//     return myFamilyList.data.familyMembers.fmid
//   })
//   this.setState({ myfamily11: filteredData })
// }
