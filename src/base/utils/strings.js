/**
 * Created by Anooj Krishnan at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */

const isDev = true;

const isSecure = true;

const isMandatory = " is required";


const api = {
  oyeSafeApiDomainFamily: isDev
    ? "apiuat.oyespace.com/oyesafe/api/v1/"
    : "apiuat.oyespace.com/oyesafe/api/v1/",
  oyeSafeDomain: isDev
    ? "apiuat.oyespace.com/oye247"
    : "apiuat.oyespace.com/oye247",
  oyeDomain: isDev
    ? "apiuat.oyespace.com/oyeliving"
    : "apiuat.oyespace.com/oyeliving",
  oyeLivingDomain: isDev ? "apiuat.oyespace.com" : "OyeLivingApi.oyespace.com",
  protocol: isSecure ? "https://" : "http://",
  oyeSafeApiPath: "/api/v1/",
  oyeLivingApiPath: "/oyeliving/OyeLivingApi/v1/",
  oyeSafeKey: "7470AD35-D51C-42AC-BC21-F45685805BBE",
  oyeLivingKey: "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
  CLOUD_FUNCTION_URL: "https://us-central1-oyespace-dc544.cloudfunctions.net",
  GATE_CLOUD_FUNCTION_URL:
    "https://us-central1-oyespace-b7e2d.cloudfunctions.net"


//PRODUCTION
// oyeSafeApiDomainFamily: isDev
//     ? "api.oyespace.com/oyesafe/api/v1/"
//     : "api.oyespace.com/oyesafe/api/v1/",
//   oyeSafeDomain: isDev
//     ? "api.oyespace.com/oye247"
//     : "api.oyespace.com/oye247",
//   oyeDomain: isDev
//     ? "api.oyespace.com/oyeliving"
//     : "api.oyespace.com/oyeliving",
//   oyeLivingDomain: isDev ? "api.oyespace.com" : "OyeLivingApi.oyespace.com",
//   protocol: isSecure ? "https://" : "http://",
//   oyeSafeApiPath: "/api/v1/",
//   oyeLivingApiPath: "/oyeliving/OyeLivingApi/v1/",
//   oyeSafeKey: "7470AD35-D51C-42AC-BC21-F45685805BBE",
//   oyeLivingKey: "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
//   CLOUD_FUNCTION_URL: "https://us-central1-oyespace-dc544.cloudfunctions.net",
//   GATE_CLOUD_FUNCTION_URL:
//     "https://us-central1-oyespace-b7e2d.cloudfunctions.net"


};


// const imageUrl = "https://mediauploaddev.oyespace.com/Images/"  //Development
// const imageUrl = "https://mediauploaduat.oyespace.com/Images/"; //Validation
const imageUrl = "https://mediaupload.oyespace.com/Images/"; //Production

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
  residentcloudfuncurl:api.CLOUD_FUNCTION_URL,
  mandatory: {
    firstName: "First Name" + isMandatory,
    lastName: "Last Name" + isMandatory
  },
  staffPlaceHolder: "https://via.placeholder.com/150/ff8c00/FFFFFF",
  StaffImageLink: "http://mediaupload.oyespace.com/Images/",
  patrolId: "PATROL_ID",
  rupeeIconCode: "\u20B9",
  mediaUploadUrl: "http://mediaupload.oyespace.com/oyeliving/api/V1",
  oyeImageUploadKey: "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
  imageUrl: imageUrl,
  SOLD_OWNER_OCCUPIED_UNIT:"Sold Owner Occupied Unit",
  SOLD_TENANT_OCCUPIED_UNIT:"Sold Tenant Occupied Unit",
  UNSOLD_VACANT_UNIT:"UnSold Vacant Unit",
  UNSOLD_TENANT_OCCUPIED_UNIT:"UnSold Tenant Occupied Unit",
  SOLD_VACANT_UNIT:"Sold Vacant Unit",

  USER_ADMIN:1,
  USER_OWNER:2,
  USER_TENANT:3

};

export default strings;
