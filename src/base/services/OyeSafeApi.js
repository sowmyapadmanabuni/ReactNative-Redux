/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */


/*
* Put Network call APIs for each screens related to OyeSafe(Admin) inside OyeSafeApi Function
 */

import axios from 'axios';
import React from 'react';
import utils from '../utils';


let instance = axios.create({
    baseURL: utils.strings.oyeSafeUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        "X-OYE247-APIKey": utils.strings.oyeSafeApiKey
    }
});

instance.interceptors.response.use((response) => {
    /**
     * Uncomment below line only for debugging complete response
     */

    //utils.logger.logArgs(response);

    /**
     * Handle the success response here.
     */
    return response.data
}, (error) => {
    utils.logger.logArgs(error);
    return null;
});


export default class OyeSafeApi{
    static async getPatrollingSchedules(){
        return await instance.get('/Patrolling/GetPatrollingList')
        //return await instance.get('/GetPatrollingShiftsList')
    }

    static async getPatrollingShiftListByAssociationID(associationId){
        console.log(associationId);
        return await instance.get('/GetPatrollingShiftsListByAssocID/'+associationId)
    }
}
