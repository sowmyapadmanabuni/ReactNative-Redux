/**
 * Created by Anooj Krishnan G at Synclovis Systems Pvt. Ltd. on 2019-06-26
 */

import axios from 'axios';
import React from 'react';
import utils from '../utils';


let instance = axios.create({
    baseURL: utils.strings.gatecloudfuncurl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

instance.interceptors.response.use((response) => {

    utils.logger.logArgs(response);
    return response.data;

}, (error) => {
    utils.logger.logArgs(error);
    return null;
});


export default class fcmservice {

    static async sendGatePN(detail) {
        console.log("Hitting")
        return await instance.post('/sendUserNotification', detail);
    }
}
