/**
 * Created by Anooj Krishnan at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */

const isDev = true;

const isSecure = true;

const isMandatory = " is required";

const api = {
    oyeSafeApiDomainFamily: isDev
        ? "apidev.oyespace.com/oyesafe/api/v1/"
        : "apidev.oyespace.com/oyesafe/api/v1/",
    oyeSafeDomain:isDev?"apidev.oyespace.com/oye247":"apidev.oyespace.com/oye247",
    oyeDomain:isDev?"apidev.oyespace.com/oyeliving":"apidev.oyespace.com/oyeliving",
    oyeLivingDomain:isDev?"apidev.oyespace.com":"OyeLivingApi.oyespace.com",
    mediaupload:isDev?"https://mediauploaddev.oyespace.com/":"http://mediaupload.oyespace.com/",
    protocol:isSecure?"https://":"http://",
    oyeSafeApiPath:"/api/v1/",
    oyeLivingApiPath:"/oyeliving/OyeLivingApi/v1/",
    oyeSafeKey:'7470AD35-D51C-42AC-BC21-F45685805BBE',
    oyeLivingKey:'1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
    CLOUD_FUNCTION_URL : 'https://us-central1-oyespace-dc544.cloudfunctions.net',
    GATE_CLOUD_FUNCTION_URL :'https://us-central1-oyespace-b7e2d.cloudfunctions.net'
};


////public static final String IMAGE_BASE_URL = "http://mediaupload.oyespace.com/";
// public static final String IMAGE_BASE_URL = "https://mediauploaddev.oyespace.com/";
//public static final String IMAGE_BASE_URL = "https://mediauploaduat.oyespace.com/";

const strings = {
  appName: "OyeSpace",
  //oyeSafeUrl:api.protocol+api.oyeSafeDomain, Patrolling it is like this
  oyeSafeUrlFamily: api.protocol + api.oyeSafeApiDomainFamily,
  oyeSafeUrl: api.protocol + api.oyeSafeDomain + api.oyeSafeApiPath,
  oyeLivingUrl: api.protocol + api.oyeLivingDomain + api.oyeLivingApiPath,
  oyeLivingDashBoard: api.protocol + api.oyeDomain + api.oyeSafeApiPath,
  oyeSafeApiKey: api.oyeSafeKey,
  oyeLivingApiKey: api.oyeLivingKey,
  gatecloudfuncurl: api.GATE_CLOUD_FUNCTION_URL,
  mandatory: {
    firstName: "First Name" + isMandatory,
    lastName: "Last Name" + isMandatory
  },
  staffPlaceHolder: "https://via.placeholder.com/150/ff8c00/FFFFFF",
  StaffImageLink: "http://mediauploaddev.oyespace.com/Images/",
  patrolId: "PATROL_ID",
  rupeeIconCode: "\u20B9",
  mediaUploadUrl: "http://mediaupload.oyespace.com/oyeliving/api/V1",
  oyeImageUploadKey: "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
};

export default strings;
