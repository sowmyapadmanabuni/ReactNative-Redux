import axios from "axios"
import React from "react"
import utils from "../utils"

let instance = axios.create({
    baseURL: utils.strings.oyeSafeUrlFamily,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        "X-OYE247-APIKey": utils.strings.oyeSafeApiKey
    }
});

instance.interceptors.response.use(
    response => {
        /**
         * Uncomment below line only for debugging complete response
         */

        utils.logger.logArgs(response);

        /**
         * Handle the success response here.
         */
        return response.data
    },
    error => {
        utils.logger.logArgs(error);
        return null
    }
);

export default class OyeSafeApiFamily {
    static async myFamilyList(unitId, associationId, accountId) {
        console.log("MyFamilyMessage", unitId, associationId, accountId);
        return await instance.get("GetFamilyMemberListByAssocAndUnitID/" + unitId + "/" + associationId + "/" + accountId)
    }

    static async myFamilyAddMember(input) {
        console.log("MyFamily add member", input);
        return await instance.post("FamilyMember/create", input)
    }

    static async myFamilyEditMember(input) {
        console.log("My Family edit member", input);
        return await instance.post("FamilyMemberDetails/update", input)
    }
    static async getLatestSubscriptionDetailsByAssId(associationId) {
        console.log("SubAssId", associationId);
        return await instance.get('Subscription/GetLatestSubscriptionByAssocID/' + associationId)

    }
    static async createSubscription(input) {
        console.log("CreateSubInput", input);
        return await instance.get('Subscription/Create',input)

    }
    static async getPricingData(associationId) {
        console.log("SubAssId", associationId);
        return await instance.get('Subscription/GetPricingData')

    }
    static async getDiscountingData(associationId) {
        console.log("SubAssId", associationId);
        return await instance.get('Subscription/GetDiscountingDetails')

    }
    static async getDiscountingDataByAssId(associationId) {
        console.log("SubAssId", associationId);
        return await instance.get('Subscription/GetDiscountingDetailsByAssociationID/'+associationId)
    }
    static async getDescriptionOfDevice(productId) {
        console.log("SubAssId", productId);
        return await instance.get('Subscription/GetProductDetailsByProductName/'+productId)
    }



}

