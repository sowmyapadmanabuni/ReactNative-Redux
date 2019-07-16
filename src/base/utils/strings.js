/**
 * Created by Anooj Krishnan at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */

const isDev = true;

const isSecure = true;

const isMandatory = " is required";


const api = {
    oyeSafeDomain:isDev?"apidev.oyespace.com/":"apidev.oyespace.com/",
    oyeLivingDomain:isDev?"apiuat.oyespace.com":"OyeLivingApi.oyespace.com",
    protocol:isSecure?"https://":"http://",
    oyeSafeApiPath:"/api/v1/",
    oyeLivingApiPath:"/oyeliving/OyeLivingApi/v1/",
    oyeSafeKey:'7470AD35-D51C-42AC-BC21-F45685805BBE',
    oyeLivingKey:'1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
    CLOUD_FUNCTION_URL : 'https://us-central1-oyespace-dc544.cloudfunctions.net',
    GATE_CLOUD_FUNCTION_URL :'https://us-central1-oyespace-b7e2d.cloudfunctions.net'
};

const strings = {

    appName:"OyeSpace",
    oyeSafeUrl:api.protocol+api.oyeSafeDomain,
    oyeLivingUrl:api.protocol+api.oyeLivingDomain+api.oyeLivingApiPath,
    oyeSafeApiKey:api.oyeSafeKey,
    oyeLivingApiKey:api.oyeLivingKey,
    gatecloudfuncurl:api.GATE_CLOUD_FUNCTION_URL,
    mandatory:{
        firstName:"First Name"+isMandatory,
        lastName:"Last Name"+isMandatory,
    },
    staffPlaceHolder:'https://via.placeholder.com/150/ff8c00/FFFFFF',
    StaffImageLink:'http://mediauploaddev.oyespace.com/Images/',
    patrolId:"PATROL_ID"

};




export default strings;