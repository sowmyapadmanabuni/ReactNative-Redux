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
    timeout: 30000,
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


export default class OyeLivingApi {


    static async login(detail) {
        return await instance.post('Account/GetAccountDetailsByMobileNumber', detail);
    }

    static async getAssociationListByAccountId(accountId) {
        return await instance.get('Member/GetMemberListByAccountID/' + accountId)
    }

    static async getUnitListByAssoc(assocId) {
        return await instance.get('Member/GetMemUniOwnerTenantListByAssoc/' + assocId)
    }

    static async getProfileFromAccount(assocId) {
        return await instance.get('GetAccountListByAccountID/' + assocId)
    }

    static async getUnitDetailByUnitId(unitId) {
        return await instance.get('Unit/GetUnitListByUnitID/' + unitId)
    };


    static async getUnitListByAssociationId(associationId) {
        return await instance.get("Unit/GetUnitListByAssocID/" + associationId)
    }

    static async getUnitListByAssociationIdWithPagination(associationId, page) {
        return await instance.get('Unit/GetUnitListByAssocIDWithPage/' + associationId + '/' + page)

    }

    static async deleteVehicle(data) {
        return await instance.post('Vehicle/VehicleStatusUpdate', data);
    }

    static async getTheListOfBlocksByAssociation(assId){
        return await instance.get('Block/GetBlockListByAssocID/' +assId);
    }

    static async getExpenseRecTypeList(assId){
        return await instance.get('GetExpenseReccurranceList');
    }

    static async getExpenseApplicabilityList (assId){
        return await instance.get('GetExpenseApplicabilityList');
    }

    static async getPaymentMethodList(assId){
        return await instance.get('PaymentMethod/GetPaymentMethodList');
    }

    static async addNewExpense(input){
        return await instance.post('Expense/Create',input);
    }
    static async updateExpense(input){
        return await instance.post('Expense/ExpenseUpdate',input);
    }

    static async getTheExpenseListByAssociationId(input){
        return await instance.get('Expense/GetExpenseListByAssocID/'+assId);
    }

    static async getTheExpenseListByBlockId(blockId){
        return await instance.get('Expense/GetExpenseListByBlockID/'+blockId);
    }

    static async getTheExpenseListByDates(input){
        return await instance.post('Expense/ExpenseListByDatesAndID',input);
    }

    static async deleteInvoice(input){
        return await instance.post('Expense/ExpenseDeleteUpdate',input);
    }
    static async getUnitName(uniId){
        return await instance.get('Unit/GetUnitListByUnitID/'+uniId);
    }






}
