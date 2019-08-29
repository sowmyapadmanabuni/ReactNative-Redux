/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */


/*
* Put Network call APIs for each screens inside OSApiConnector Function
 */

import axios from 'axios';

console.log("props in OSAPI:",this.props);

let instance = axios.create({
    baseURL: 'https://apiuat.oyespace.com/oyeliving/api/v1/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
    }
});

instance.interceptors.response.use((response) => {
    if (response.data !== undefined && response.data.errorCode !== undefined) {

    }

    if (response.request.responseURL !== undefined) {
        return response.data
    } else {
        return response.data
    }
}, (error) => {
    console.log("Error:", error);
    return null;
});


class OSApiConnector{


    static async loginScreen(detail){
        return await instance.post('account/sendotp',detail);
    }
    
}


export default OSApiConnector;