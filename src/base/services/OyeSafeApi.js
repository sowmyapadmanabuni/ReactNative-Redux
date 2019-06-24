/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */


/*
* Put Network call APIs for each screens related to OyeSafe(Admin) inside OyeSafeApi Function
 */

import axios from 'axios';
import React from 'react';
import base from '../../base';


let instance = axios.create({
    baseURL: base.utils.strings.oyeSafeUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        "X-OYE247-APIKey": base.utils.strings.oyeSafeApiKey
    }
});

instance.interceptors.response.use((response) => {

    base.utils.logger.logArgs(response);

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

}, (error) => {
    base.utils.logger.logArgs(error);
    return null;
});


export default class OyeSafeApi{



}
