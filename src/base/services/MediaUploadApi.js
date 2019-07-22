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
    baseURL: utils.strings.mediaUploadUrl,
    timeout: 10000,
    headers: {
        "Content-Type": "multipart/form-data",
        "X-Champ-APIKey": utils.strings.oyeImageUploadKey

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


export default class MediaUploadApi{

    static async uploadRelativeImage(form){
        console.log('Image upload server')
        return await instance.post('/association/upload',form);
    }




}
