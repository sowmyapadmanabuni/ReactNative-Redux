import React, {Component} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
// import { TextInputLayout } from 'rn-textinputlayout';
import {Fonts} from '../pages/src/utils/Fonts';

console.disableYellowBox = true;
export default class SelectMyRole extends Component {
    static navigationOptions = {
        title: 'Registration',
        headerStyle: {
            backgroundColor: '#696969',
        },
        headerTitleStyle: {
            color: '#fff',
        }
    };

    constructor(props) {
        super(props);


    }

    render() {

        return (

            <View
                style={{
                    flex: 1, flexDirection: 'column',
                    backgroundColor: '#fff'
                }}>
                <View style={{
                    width: '100%', height: '45%',
                    alignContent: 'flex-end', justifyContent: 'flex-end'
                }}>
                    <Image
                        source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
                        style={{width: 150, height: 130, alignSelf: 'center'}}
                    />
                </View>
                {/*   <Text style={styles.splashHeadline}> OYE SAFE</Text> */}
                <ActivityIndicator/>
                <Text style={{fontSize: 8, color: 'black', alignSelf: 'center'}}> Data is loading..</Text>
                <Text style={styles.yourSafetyIsPriceless}> Your Safety is Priceless</Text>
                <Image
                    source={require('../pages/assets/images/building_complex.png')}
                    style={{width: '100%', height: '35%', alignSelf: 'center'}}
                />
            </View>

        );
    }

    insert_Accounts(account_id, first_name, last_name, mobile_number, isd_code) {


    }

    syncMyMembers(cc, mobilenumber) {
        anu = {
            "ACMobile": cc + mobilenumber
        };
        url = global.champBaseURL + 'Member/GetMemberListByMobileNumber';
        console.log('anu', url + ' ff' + cc + mobilenumber);
        fetch(url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //  "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
                    "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
                },
                body: JSON.stringify(anu)
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('bf responseJson ', responseJson);

                if (responseJson.success) {
                    console.log('ravii', responseJson);
                    console.log('responseJson count', responseJson.data.memberList.length);
                    for (let i = 0; i < responseJson.data.memberList.length; ++i) {

                        console.log('Results MyMembership', responseJson.data.memberList[i].meMemID +
                            ' ' + responseJson.data.memberList[i].asAssnID + ' ' + responseJson.data.memberList[i].mrmRoleID);
                        // this.insert_MyMembership(responseJson.data.memberList[i].meMemID, responseJson.data.memberList[i].asAssnID,
                        // responseJson.data.memberList[i].oyeUnitID, responseJson.data.memberList[i].firstName,
                        // responseJson.data.memberList[i].lastName, responseJson.data.memberList[i].mobileNumber,
                        // responseJson.data.memberList[i].email, responseJson.data.memberList[i].parentAccountID,
                        // responseJson.data.memberList[i].mrmRoleID, responseJson.data.memberList[i].meIsActive,
                        // responseJson.data.memberList[i].acAccntID, responseJson.data.memberList[i].vehicleNumber);

                        this.insert_MyMembership_New(responseJson.data.memberList[i].meMemID, responseJson.data.memberList[i].asAssnID,
                            responseJson.data.memberList[i].unUnitID, responseJson.data.memberList[i].acMobile,
                            responseJson.data.memberList[i].mrmRoleID, responseJson.data.memberList[i].meIsActive,
                            responseJson.data.memberList[i].acAccntID);
                        this.syncAssns(responseJson.data.memberList[i].asAssnID);

                    }

                    //this.syncAssns(responseJson.data.memberList[0].asAssnID);
                } else {
                    //alert('You are not a Member of any Association');
                    this.props.navigation.navigate('CreateOrJoinScreen');
                }

                console.log('suvarna', 'hi');
            })
            .catch((error) => {
                console.error(error);
                alert(' Failed to Get');
            });
    }

    syncAssns(assnID) {
        console.log('bf assnID ', assnID);

        console.log('componentdidmount');
        const urlAsn = global.champBaseURL + 'association/getassociationlist';

        fetch(urlAsn, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    // dataSource: responseJson.data.associations, // dataSource: responseJson.data.associations.filter(x => x.associationID ==30) associationid
                    isLoading: false
                });

                console.log('anu', responseJson);

                if (responseJson.success) {

                    console.log('responseJson count Association ', responseJson.data.associations.length);

                    for (let i = 0; i < responseJson.data.associations.length; ++i) {

                        //     temp.push(results.rows.item(i));
                        //{ asiCrFreq: 0,   asAssnID: 6,  asPrpCode: '', asAddress: 'Electronic City', asCountry: 'India', asCity: 'Bangalore',
                        // asState: 'karnataka',  asPinCode: '560101', asAsnLogo: '122.166.168.160/Images/Robo.jpeg', asAsnName: 'Prime Flora',
                        // asPrpName: 'Electro',  asPrpType: '',  asRegrNum: '123456', asWebURL: 'www.careofhomes.com', asMgrName: 'Tapaswini',
                        // asMgrMobile: '7008295630',  asMgrEmail: 'tapaswiniransingh7@gmail.com', asAsnEmail: 'tapaswini_ransingh@careofhomes.com',
                        // aspanStat: 'True', aspanNum: '560066', aspanDoc: '', asNofBlks: 9, asNofUnit: 5, asgstNo: '', asTrnsCur: '', asRefCode: '',
                        // asMtType: '',  asMtDimBs: 0, asMtFRate: 0,asUniMsmt: '', asbGnDate: '2018-11-04T00:00:00',aslpcType: '', aslpChrg: 8.9,
                        // aslpsDate: '2018-11-04T00:00:00', asotpStat: 'ON', asopStat: 'ON', asonStat: 'ON', asomStat: 'ON', asoloStat: 'ON',
                        // asgpsPnt: null,  asdPyDate: '0001-01-01T00:00:00', asdCreated: '2018-11-04T00:00:00', asdUpdated: '2018-11-04T00:00:00',
                        //asIsActive: true, asbToggle: false,asavPymnt: false, asaInvc: false, asAlexaItg: false,  asaiPath: '', asOkGItg: false,
                        //asokgiPath: '',  asSiriItg: false, assiPath: '', asCorItg: false, asciPath: '', bankDetails: [], unit: null },} ] },

                        console.log('Results Association', responseJson.data.associations[i].asAssnID + ' ' + responseJson.data.associations[i].asAsnName + ' ' + responseJson.data.associations[i].aspanNum);

                        //association_id, name, country, locality, pan_number, pin_code, gps_location, total_units, property_code, fy_start,
                        //  maint_pymt_freq, otp_status, photo_status , name_status , mobile_status , logoff_status , validity

                        this.insert_associations(responseJson.data.associations[i].asAssnID,
                            responseJson.data.associations[i].asAsnName,
                            responseJson.data.associations[i].asCountry, responseJson.data.associations[i].asCity,
                            responseJson.data.associations[i].aspanNum, responseJson.data.associations[i].asPinCode,
                            responseJson.data.associations[i].gpsLocation, responseJson.data.associations[i].asNofUnit,
                            responseJson.data.associations[i].asPrpCode, responseJson.data.associations[i].asiCrFreq,
                            responseJson.data.associations[i].asMtFRate, 'off', 'off', 'off', 'off', 'off');

                    }
                    console.log('success');

                    this.syncUnits(assnID);

                } else {
                    console.log('failurre')
                }

            })
            .catch((error) => {
                console.log(error)
            })
    }

    insert_associations(association_id, name, country, city, pan_number, pin_code, gps_location, total_units, property_code, fy_start,
                        maint_pymt_freq, otp_status, photo_status, name_status, mobile_status, logoff_status) {
        console.log('bf INSERT Association ', association_id + ' ' + name);

    }

    syncUnits(assnID) {
        console.log('SelectMyRole bf syncUnits ', assnID);
        //const url = 'http://oye247api.oye247.com/oye247/api/v1/OYEUnit/OYEUnitlist/'+assnID
        const url = global.champBaseURL + 'Unit/GetUnitListByAssocID/' + assnID;
        console.log(url);
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('unitlist in ', responseJson);
                this.setState({

                    isLoading: false
                });

                if (responseJson.success) {
                    console.log('ravii', responseJson);
                    console.log('responseJson count unit ', responseJson.data.unit.length);
                    for (let i = 0; i < responseJson.data.unit.length; ++i) {
                        //     temp.push(results.rows.item(i));

                        console.log('Results unit', responseJson.data.unit[i].unUniName + ' ' + responseJson.data.unit[i].unUnitID);

                        this.insert_units(responseJson.data.unit[i].unUnitID,
                            responseJson.data.unit[i].asAssnID,
                            responseJson.data.unit[i].unUniName, responseJson.data.unit[i].unUniType,
                            responseJson.data.unit[i].flFloorID, responseJson.data.unit[i].unIsActive,
                            responseJson.data.unit[i].parkingLotNumber);

                    }

                    this.syncUnitOwners(assnID);
                } else {
                    console.log('failurre')
                }
            })
            .catch((error) => {
                this.setState({

                    isLoading: false
                });
                console.log(error);
                console.log('unitlist err ', error)

            })
    }

    insert_units(unit_id, association_id, UnitName, type, admin_account_id, created_date_time, parking_slot_number
    ) {

    }

    syncUnitOwners(assnID) {
        console.log('bf syncUnitOwners ', assnID);

        const url = global.champBaseURL + 'Member/GetMemUniOwnerTenantListByAssoc/' + assnID;
        //http://122.166.168.160/champ/api/v1/Member/GetMemUniOwnerTenantListByAssoc/30
        console.log(url);
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('syncUnitOwners in ', responseJson);
                this.setState({

                    isLoading: false
                });

                if (responseJson.success) {
                    console.log('ravii', responseJson);
                    console.log('responseJson count syncUnitOwners ', responseJson.data.unitOwner.length);
                    for (let i = 0; i < responseJson.data.unitOwner.length; ++i) {
                        //     temp.push(results.rows.item(i));

                        console.log('Results UnitOwner ', responseJson.data.unitOwner[i].uofName + ' ' + responseJson.data.unitOwner[i].unUnitID);

                        //  "uoid": 20, "uofName": "Basava",  "uolName": "K", "uoMobile": "+919480107369", "uoMobile1": "",
                        //  "uoMobile2": "", "uoMobile3": "",  "uoMobile4": "", "uoEmail": "",  "uoEmail1": "",
                        //  "uoEmail2": "", "uoEmail3": "", "uoEmail4": "",  "uocdAmnt": 12.36,  "uoisdCode": null,
                        // "unUnitID": 46,  "asAssnID": 30,  "uodCreated": "2018-11-20T09:55:20",
                        //  "uodUpdated": "0001-01-01T00:00:00",  "uoIsActive": true

                        this.insert_unitOwners(responseJson.data.unitOwner[i].uoid,
                            responseJson.data.unitOwner[i].unUnitID, responseJson.data.unitOwner[i].asAssnID,
                            responseJson.data.unitOwner[i].uofName, responseJson.data.unitOwner[i].uolName,
                            responseJson.data.unitOwner[i].uoMobile, responseJson.data.unitOwner[i].uoEmail,
                            responseJson.data.unitOwner[i].uocdAmnt, responseJson.data.unitOwner[i].uodCreated,
                            responseJson.data.unitOwner[i].uodUpdated, responseJson.data.unitOwner[i].uoIsActive);
                    }
                    console.log('syncUnitOwners success');
                    // alert('unitlist unitlist success');
                    this.syncWorkers(assnID);

                } else {
                    console.log('failurre')
                }
            })
            .catch((error) => {
                this.setState({

                    isLoading: false
                });
                console.log(error);
                console.log('unitlist err ', error)

            })

    }

    syncWorkers(assnID) {
        console.log('GetWorkersList componentdidmount ', assnID);

        const url = 'http://' + global.oyeURL + '/oye247/api/v1/GetWorkerListByAssocID/' + assnID;
        //const url = 'http://' + global.oyeURL + '/oye247/api/v1/GetWorkersList'

        console.log(url);
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
                "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('WorkersLis in ', responseJson);

                if (responseJson.success) {
                    console.log('ravii', responseJson);
                    console.log('responseJson count WorkersLis ', responseJson.data.worker.length);


                    for (let i = 0; i < responseJson.data.worker.length; ++i) {
                        //     temp.push(results.rows.item(i));
                        // "data": {  "workers": [  {
                        //           "wkWorkID": 8, "wkfName": "Sowmya",  "wklName": "Padmanabhuni",
                        //           "wkMobile": "+919490791520", "wkImgName": "Somu.jpeg",
                        //           "wkWrkType": "RegularVisitor",  "wkDesgn": "Developer",
                        //           "wkidCrdNo": "A00009", "vnVendorID": 1,  "blBlockID": 27,
                        //           "flFloorID": 18,  "asAssnID": 25,   "wkdCreated": "2018-11-12T10:43:25",
                        //           "wkdUpdated": "0001-01-01T00:00:00",  "wkIsActive": true
                        //       },
                        this.insert_Guards(responseJson.data.worker[i].wkWorkID,
                            responseJson.data.worker[i].asAssnID, responseJson.data.worker[i].wkfName,
                            responseJson.data.worker[i].wklName, responseJson.data.worker[i].wkMobile,
                            responseJson.data.worker[i].wkImgName, responseJson.data.worker[i].wkWrkType,
                            responseJson.data.worker[i].wkDesgn, responseJson.data.worker[i].wkidCrdNo,
                            responseJson.data.worker[i].vnVendorID, responseJson.data.worker[i].blBlockID,
                            responseJson.data.worker[i].flFloorID, responseJson.data.worker[i].wkdCreated,
                            responseJson.data.worker[i].wkdUpdated, responseJson.data.worker[i].wkIsActive);

                        console.log('Results WorkersLis', responseJson.data.worker[i].unUniName + ' ' + responseJson.data.worker[i].unUnitID);

                    }

                } else {
                    console.log('failurre')
                }
            })
            .catch((error) => {

                console.log('WorkersLis err ', error)
            });
        this.props.navigation.navigate('SplashScreen');
    }

    insert_Guards(work_id, assn_id, first_name, last_name, wk_mobile, wk_img_name, wrk_type,
                  desgn, idcrd_no, vendor_id, block_id, floor_id, created, updated, is_active) {

    }

    insert_unitOwners(owner_id, unit_id, association_id, owner_first_name, owner_last_name, owner_mobile,
                      owner_email, owner_due_amnt, owner_created, owner_updated, owne_is_active
    ) {

    }


    insert_MyMembership(oye_memberid, association_id, oye_unitid, first_name, last_name, mobile_number, email, parent_accountid,
                        oye_memberroleid, status, account_id, vehicle_number) {

    }

    insert_MyMembership_New(oye_memberid, association_id, oye_unitid, mobile_number,
                            oye_memberroleid, status, account_id) {

    }

}

const styles = StyleSheet.create({
    container: {
        paddingTop: 23
    },
    input: {
        margin: 15,
        height: 40,
        borderColor: '#7a42f4',
        borderWidth: 1
    },

    yourSafetyIsPriceless: {
        height: '10%', width: '100%', color: '#000', fontFamily: Fonts.Tahoma,
        textAlign: 'center', fontSize: 19, //lineheight: '23px',
    },

    splashHeadline: {
        height: '10%', width: '100%', color: '#000', fontFamily: Fonts.OpenSansExtraBold,
        textAlign: 'center', fontSize: 29,//lineheight: '23px',
    },
    input1: {
        marginLeft: 5, marginRight: 5, marginTop: 15, height: 40, borderColor: '#F2F2F2',
        backgroundColor: '#F2F2F2', borderWidth: 1.5, borderRadius: 2, flexDirection: 'row',
    },
    submitButton: {
        backgroundColor: '#7a42f4',
        padding: 10,
        margin: 15,
        height: 40,
    },
    submitButtonText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: Fonts.OpenSansExtraBold,
        fontSize: 12,
    }, container: {
        flex: 1,
        paddingTop: 100
    },
    imagee: {height: 14, width: 14, margin: 10,},
    textInput: {
        fontSize: 16,
        height: 40
    },
    inputLayout: {
        marginTop: 8,
        marginHorizontal: 6,
        height: 50
    },
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        margin: 20
    }

});
