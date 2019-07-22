/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */


/*
* Put Network call APIs for each screens related to OyeLiving(Resident) inside OyeLivingApi Function
 */

import axios from 'axios';
import React from 'react';
import utils from '../utils';

let instance = axios.create({
    baseURL: utils.strings.oyeLivingDashBoard,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        "X-Champ-APIKey": utils.strings.oyeLivingApiKey
    }
});

instance.interceptors.response.use((response) => {

    utils.logger.logArgs(response);

    /**
     * Handle the success response here.
     * Uncomment if you have similar response structure
     */


    // if (response.data !== undefined && response.data.errorCode !== undefined) {
    //
    // }
    //
    // if (response.request.responseURL !== undefined) {
    //     return response.data
    // } else {
    //     return response.data
    // }
    return response.data

}, (error) => {
    utils.logger.logArgs(error);
    return null;
});


export default class OyeLivingApi{


    static async login(detail){
        return await instance.post('Account/GetAccountDetailsByMobileNumber',detail);
    }

    static async getAssociationListByAccountId(accountId){ 
        console.log("ASD",accountId)

        return await instance.get('Member/GetMemberListByAccountID/'+accountId)
    }

    static async getUnitListByAssoc(assocId){ 
        console.log("UNIT",assocId)

        return await instance.get('Member/GetMemUniOwnerTenantListByAssoc/'+assocId)
    }

    static async getProfileFromAccount(assocId){ 
        return await instance.get('GetAccountListByAccountID/'+assocId)
    }

    static async getUnitDetailByUnitId(unitId){
        console.log("Detail:",unitId);
        return await instance.get('Unit/GetUnitListByUnitID/'+unitId)
    }}
