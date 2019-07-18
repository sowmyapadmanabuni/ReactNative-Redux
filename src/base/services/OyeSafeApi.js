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

    utils.logger.logArgs(response);

    /**
     * Handle the success response here.
     */
    return response.data
}, (error) => {
    utils.logger.logArgs(error);
    return null;
});


export default class OyeSafeApi{

    static async getallguardsofassociation(assnid){
        return await instance.get('GetWorkerListByAssocID/'+assnid);
    }

    
    static async getPatrollingSchedules(){
        return await instance.get('/Patrolling/GetPatrollingList');
    }

    static async getPatrollingShiftListByAssociationID(associationId){
        console.log(associationId);
        return await instance.get('oye247/api/v1/GetPatrollingShiftsListByAssocID/'+associationId);
    };

    static async addCheckPoint(details){
        return await instance.post('oye247/api/v1/CheckPoint/Create',details);
    }

    static async editCheckPoint(details){
        console.log("Details in net call:",details);
        return await instance.post('oye247/api/v1/CheckPointGPS/Update',details)
    }

    static async getCheckPointList(associationId){
        return await instance.get('oye247/api/v1/CheckPoint/GetCheckPointByAssocID/'+associationId)
    }

    static async getDeviceList(associationId){
        return await instance.get('oyesafe/api/v1/Device/GetDeviceListByAssocID/'+associationId);
    }

    static async schedulePatrol(detail){
        return await instance.post('oye247/api/v1/PatrollingShifts/create',detail)
    }

    static async updatePatrol(detail){
        return await instance.post('oye247/api/v1/PatrollingShifts/Update',detail)
    }

    static async deleteCP(detail){
        return await instance.post('oye247/api/v1/CheckPoint/DeleteCheckPoint',detail)
    }

    static async deletePatrolSlot(detail){
        console.log("djnskvnvn",detail);
        return await instance.post('oye247/api/v1/PatrollingShiftSlotDelete/Update',detail)
    }

    static async updateSnooze(detail){
        return await instance.post('oye247/api/v1/PatrollingShiftSlot/Update',detail)
    };

    static async getReport(detail){
        return await instance.post('oye247/api/v1/GetPatrollingReportByDates',detail)
    }

    static async getStaffListByAssociationId(associationId){
        console.log("AsId",associationId);
        return await instance.get('/GetWorkerListByAssocID/'+associationId)

    }

    static async getStaffReportByDate(input){
        console.log("Data", input)
        return await instance.post('/Worker/GetWorkerListByDates/',input)
    }

}
