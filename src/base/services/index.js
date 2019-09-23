/**
 * Created by Anooj Krishnan at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */

import OyeLivingApi from './OyeLivingApi';
import OyeSafeApi from './OyeSafeApi';
import fcmservice from './fcmservice';
import frtdbservice from './frtdbservice';
import residentfcmservice from './residentfcmservice';
import OyeSafeApiFamily from './OyeSafeApiFamily';
import MediaUploadApi from './MediaUploadApi'

const services = {
    OyeLivingApi,
    OyeSafeApi,
    fcmservice,
    residentfcmservice,
    OyeSafeApiFamily,
    MediaUploadApi,
    frtdbservice
};

export default services;