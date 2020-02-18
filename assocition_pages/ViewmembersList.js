/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-07-24
 */


import React from "react";
import {
    ActivityIndicator,
    BackHandler,
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {Card} from "native-base";
import {TextInput} from "react-native-gesture-handler";
import {NavigationEvents} from "react-navigation";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {Dropdown} from "react-native-material-dropdown";
import {connect} from "react-redux";
import {getDashUnits} from "../src/actions";
import base from "../src/base";
import OSButton from '../src/components/osButton/OSButton'
import StaffStyle from "../src/screens/Resident/Visitors/Staff/StaffStyle";

import {createIconSetFromIcoMoon} from "react-native-vector-icons"
import IcoMoonConfig from '../src/assets/selection.json';
import * as fb from 'firebase';

const Icon = createIconSetFromIcoMoon(IcoMoonConfig);

let data = [
    {
        value: "Admin",
        id: 1
    },
    {
        value: "Owner",
        id: 2
    }
];

var data1 = [];
var test = [];
let without = [];
const role = [];

class Resident extends React.Component {
    static navigationOptions = {
        title: "resident",
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            fulldata: [],
            query: "",
            residentList: [],
            dataSource: [],
            selectedRoleData: 0,
            units: [],
            memberList: [],
            loading: true,
            residentData: [],
            selectedUser: {},
            clonedList: [],
            isLoading: true
        };

        this.getMemberList = this.getMemberList.bind(this);
    }

    componentWillMount() {
        base.utils.validate.checkSubscription(this.props.userReducer.SelectedAssociationID)
        this.getMemberList();
    }

    componentDidUpdate() {
        setTimeout(() => {
            BackHandler.addEventListener('hardwareBackPress', () => this.processBackPress())
        }, 100)
    }

    componentWillUnmount() {
        setTimeout(() => {
            BackHandler.removeEventListener('hardwareBackPress', () => this.processBackPress())
        }, 0)

    }

    processBackPress() {
        console.log("Part");
        const {goBack} = this.props.navigation;
        goBack(null);
    }

    async getMemberList() {
        let self = this;
        let associationId = self.props.selectedAssociation;

        console.log('get association', associationId);

        //console.log( base.services.OyeLivingApi.getUnitListByAssoc(associationId) );
        let stat = await base.services.OyeLivingApi.getUnitListByAssoc(associationId);
        console.log('getMemberList####', stat);

        try {
            if (stat) {
                let unitOwner = stat.data.unitOwner;
                let unitTenant = stat.data.unitTenant;
                for (let i in unitOwner) {
                    unitOwner[i].name = unitOwner[i].uofName;
                    if (unitOwner[i].uoRoleID === 0) {
                        unitOwner[i].uoRoleID = 2
                    }
                }

                for (let i in unitTenant) {
                    unitTenant[i].uoRoleID = 3;
                    unitTenant[i].name = unitTenant[i].utfName;
                }

                let allMembers = [...unitOwner, ...unitTenant];
                console.log("ALLEMEMBERS", allMembers);
                self.addUnitDetail(allMembers, associationId);


            }

        } catch (e) {
            console.log(e);
            this.setState({isLoading: false})

        }
    }

    async addUnitDetail(memberArr, associationId) {
        let self = this;
     //   console.log("Stat12345");

        let stat = await base.services.OyeLivingApi.getUnitListByAssociationId(associationId);
        try {
            if (stat) {
                let unitArr = stat.data.unit;
                console.log("Stat:", stat);
                for (let i in memberArr) {
                    for (let k in unitArr) {
                        if (memberArr[i].unUnitID === unitArr[k].unUnitID) {
                            memberArr[i].unitName = unitArr[k].unUniName
                        }
                    }
                }
                console.log("memberArr", memberArr);
                self.setState({
                    residentData: memberArr,
                    clonedList: memberArr,
                    isLoading: false
                })
            }
        } catch (e) {
            console.log(e);
            this.setState({isLoading: false})
        }


    }

    async updateRolesFRTDB(user, roleId) {

        var dbref = base.services.frtdbservice.ref('rolechange/' + user.acAccntID);
        dbref.set({
            associationID: user.asAssnID,
            unit: user.unUnitID,
            role: roleId,
            user: user.acAccntID
        }).then((data) => {
            //success callback
            console.log('data ', data)
        }).catch((error) => {
            //error callback
            console.log('error ', error)
        })
        // let obj = {
        //     sbSubID: ""+user.acAccntID+""+user.unUnitID+"usernotif",
        //     ntTitle: "Role Changed",
        //     ntDesc:
        //       "Your role in unit has been changed",
        //     ntType: "Role_Change",
        //     associationID: user.asAssnID
        //   }
        // console.log("sendRoleNotification",obj)
        // let notification = await base.services.residentfcmservice.sendUniqueResidentPN(obj)
        // console.log("notificationResp",notification);
    }

    //For updating the role if the user as in ADMIN or OWNER
    changeRole = (title, message) => {
        try {
            const {getDashUnits, selectedAssociation} = this.props;
            console.log('Props in role managment', this.props);
            const url = `http://${this.props.oyeURL}/oyeliving/api/v1/MemberRoleChangeToOwnerToAdminUpdate`;
            console.log("selectedUser:", this.state.selectedUser); //+91

            // let mobile=this.state.selectedUser.uoMobile.split(" ")
            let mobile = this.state.selectedUser.uoMobile.split('');
            let mobNumber = this.state.selectedUser.uoMobile;
            console.log('Mob Array', mobile);

            if (mobile[0] === '+') {
                console.log('No need to add')
            } else {
                console.log('Add');
                mobNumber = '+91' + mobNumber
            }

            let requestBody = {
                ACMobile: mobNumber,
                UNUnitID: this.state.selectedUser.unUnitID,
                MRMRoleID: this.state.selectedRoleData.selRolId,
                ASAssnID: this.props.selectedAssociation
            };
            console.log('reqBody role managment', requestBody);

            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
                },
                body: JSON.stringify(requestBody)
            })
                .then(response => response.json())
                .then(responseJson => {
                    this.updateRolesFRTDB(this.state.selectedUser, this.state.selectedRoleData.selRolId);
                    this.props.navigation.goBack();
                })
                .catch(error => {
                    console.log("err " + error);
                });
        } catch (e) {
            console.log("STATE:", this.state);
        }

    };

    selectRole = (item, index) => {
        let sortedList = this.state.residentList.sort((a, b) =>
            a.unit.localeCompare(b.unit)
        );
        return (
            <Dropdown
                label="Select Role"
                value={data.value}
                data={data}
                containerStyle={20}
                onChangeText={(val, vals) => {
                    // console.log(val, vals)
                    let currSel = sortedList[index];
                    let value = {
                        ...currSel,
                        selRolId: (vals = vals + 1),
                        selRolName: val
                    };
                    console.log("Role:", value);
                    this.setState({selectedRoleData: value, selectedUser: item});
                }}
            />
        );
    };

    handleSearch(text) {
        console.log("Search (",text,")");
        this.setState({query: text});
        let sortResident = this.state.clonedList; //search from entire list
        let filteredArray = [];
        console.log('Res List', sortResident);
        let roleId = "";
        if (text.length === 0) {
            console.log("filteredArray ",filteredArray);
        } else {
            for (let i in sortResident) {
                console.log("Sort:", sortResident[i]);
                if (sortResident[i].uoRoleID === 1) {
                    roleId = "Admin"
                } else if (sortResident[i].uoRoleID === 2) {
                    roleId = "Owner"
                } else if (sortResident[i].uoRoleID === 3) {
                    roleId = "Tenant"
                }

                if ((sortResident[i].name.toLowerCase()).includes(text.toLowerCase()) || sortResident[i].unitName.includes(text) || (roleId.toLowerCase()).includes(text.toLowerCase())) {
                    filteredArray.push(sortResident[i]) //make case insensitive
                }
            }
        }

        this.setState({
            residentData: text.length === 0 ? filteredArray[0] : filteredArray
        });
    };

    renderAdminStatus = item => {
        if (item.uoRoleID === 1) {
            return <Text> Admin</Text>;
        } else return null;
    };

    render() {
        // console.log('Data inside####', this.state.residentData)
        let residentList = this.props.dashBoardReducer.residentList;
        const {params} = this.props.navigation.state;
        let currentUserID = this.props.userReducer.MyAccountID;
        return (
            <View style={{flex: 1, flexDirection: "column"}}>
                <NavigationEvents
                    onDidFocus={payload => {
                        residentList = params.data;
                        this.setState({
                            residentList: residentList.sort((a, b) =>
                                a.unit.localeCompare(b.unit)
                            )
                        });
                        residentList.sort((a, b) => a.unit.localeCompare(b.unit));
                        this.setState({units: residentList});
                    }}
                />
                <SafeAreaView style={{backgroundColor: "#ff8c00"}}>
                    <View style={[styles.viewStyle1, {flexDirection: "row"}]}>
                        <View style={styles.viewDetails1}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate("ResDashBoard");
                                }}
                            >
                                <View
                                    style={{
                                        height: hp("4%"),
                                        width: wp("15%"),
                                        alignItems: 'flex-start',
                                        justifyContent: "center"
                                    }}
                                >
                                    <Image
                                        resizeMode="contain"
                                        source={require("../icons/back.png")}
                                        style={styles.viewDetails2}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <Image
                                style={[styles.image1]}
                                source={require("../icons/OyespaceSafe.png")}
                            />
                        </View>
                        <View style={{flex: 0.2}}>
                            {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
                        </View>
                    </View>
                    <View style={{borderWidth: 1, borderColor: "orange"}}/>
                </SafeAreaView>
                <View style={styles.textWrapper}>
                    <Text style={styles.residentialListTitle}> Resident List </Text>
                    <View style={{flexDirection: "row"}}>
                        <View
                            style={{flex: 0.8, height: hp("5.5%"), marginStart: hp("2%")}}
                        >
                            <View style={{
                                flexDirection: 'row', borderBottomWidth: 0.7,
                            }}>
                                <TextInput
                                    style={styles.viewDetails3}
                                    placeholder="Search...."
                                    round
                                    onChangeText={(text) => this.handleSearch(text)}
                                />
                                <Icon color="#ff8c00" size={hp('2.6%')}
                                      style={{marginRight: hp('1.2%'), marginTop: hp('2%')}} name="search"/>
                                {/* <Image
                                    style={{top:10}}
                                    source={require('../icons/search.png')}
                                /> */}
                            </View>
                        </View>
                        <View
                            style={{flex: 0.3, height: hp("5.5%"), alignItems: "flex-end"}}
                        >
                            <View style={{alignItems: "flex-end", marginEnd: hp("2%"), top: 15}}>
                                {this.state.selectedRoleData.selRolId === 1 ||
                                this.state.selectedRoleData.selRolId === 2 ?
                                    <OSButton height={hp('3%')} onButtonClick={() => this.changeRole()} width={hp('8%')}
                                              oSBText={"Update"}
                                              borderRadius={hp('20%')}
                                              oSBBackground={this.state.selectedRoleData.selRolId === 1 ||
                                              this.state.selectedRoleData.selRolId === 2 ? base.theme.colors.primary : base.theme.colors.grey

                                              }/> :
                                    <View style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: hp("3%"),
                                        borderRadius: hp("3%"),
                                        width: hp('8%'),
                                        backgroundColor: base.theme.colors.grey
                                    }}>
                                        <Text>Update</Text>
                                    </View>}
                            </View>
                        </View>
                    </View>
                    {!this.state.isLoading ?
                        <View style={styles.viewDetails}>
                            {this.state.residentData.length !== 0 ?
                                <View style={{flex: 1,}}>
                                    <Text style={{color: base.theme.colors.black, margin: 20}}>* You can update only one
                                        at
                                        a time</Text>
                                    <FlatList
                                        data={this.state.residentData}
                                        keyExtractor={(item, index) => index.toString()}
                                        extraData={this.state}
                                        renderItem={({item, index}) => (

                                            <Card style={{height: hp("14%")}}>
                                                <View style={{height: 1, backgroundColor: "lightgray"}}/>
                                                <View style={{flexDirection: "row", flex: 1}}>
                                                    <View style={{flex: 1}}>
                                                        <View Style={{flexDirection: "column"}}>
                                                            <Text style={styles.textDetails}>{`Name: ${
                                                                item.name
                                                            }`}</Text>
                                                            <Text style={styles.textDetails}>{`Unit: ${
                                                                item.unitName
                                                            }`}</Text>
                                                            <Text style={styles.textDetails}>{`Role: ${
                                                                item.uoRoleID === 1 ? "Admin" : item.uoRoleID === 2 ? "Owner" : "Tenant"
                                                            }`}</Text>
                                                        </View>
                                                    </View>

                                                    <View style={{flex: 0.5, marginRight: hp("3%")}}>
                                                        {(item.uoRoleID === 1 || item.uoRoleID === 2) && currentUserID !== item.acAccntID ? (
                                                            this.selectRole(item, index)
                                                        ) : (
                                                            <Text> </Text>
                                                        )}
                                                        {/*{this.renderAdminStatus(item)}*/}
                                                        {/* {item.isAdmin && item.role=='Owner' ?   <Text> is Admin  </Text> : <Text> Owner </Text> } */}
                                                    </View>
                                                </View>
                                                <View style={{height: 1, backgroundColor: "lightgray"}}/>
                                            </Card>

                                        )}
                                    />

                                </View> :
                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text>No Data for the selected association </Text>
                                </View>}
                        </View> :
                        <View style={StaffStyle.activityIndicator}>
                            <ActivityIndicator size="large" color={base.theme.colors.primary}/>
                        </View>}
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
        dashBoardReducer: state.DashboardReducer,
        userReducer: state.UserReducer
    };
};

export default connect(
    mapStateToProps,
    {getDashUnits}
)(Resident);

const styles = StyleSheet.create({
    residentialListTitle: {
        textAlign: "center",
        fontSize: hp("2.8%"),
        fontWeight: "bold",
        marginTop: hp("2%"),
        marginBottom: hp("1%"),
        color: 'orange'
    },
    viewDetails: {
        flexDirection: "column",
        flex: 1,
        paddingTop: hp("0.2%"),
        paddingLeft: hp("0.5%"),
        paddingRight: hp("0.5%")
    },
    cardDetails: {
        height: 60
    },

    textDetails: {
        fontSize: hp("1.9%"),
        paddingLeft: hp("5%"),
        paddingTop: hp("0.9%"),
        paddingBottom: hp("0.5%"),
        fontWeight: "bold",
        color: "black"
    },


    textWrapper: {
        height: hp("85%"), // 70% of height device screen
        width: wp("100%") // 80% of width device screen
    },

    viewDetails3: {
        height: hp("5.5%"),
        width: wp('60%'),
        backgroundColor: base.theme.colors.transparent,
        paddingTop: 10,
        paddingRight: 2,
        fontSize: hp("1.8%"),
    },
    viewDetails4: {
        height: hp("5.5%"),
        width: wp("19%"),
        alignContent: "center"
    },

    viewStyle1: {
        backgroundColor: "#fff",
        height: hp("7%"),
        width: Dimensions.get("screen").width,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        elevation: 2,
        position: "relative"
    },
    image1: {
        width: wp("34%"),
        height: hp("18%"),
        marginRight: hp("3%")
    },


    viewDetails1: {
        flex: 0.3,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 3
    },
    viewDetails2: {
        alignItems: "flex-start",
        justifyContent: "center",
        width: hp("3%"),
        height: hp("3%"),
        marginTop: 5
    },
});

