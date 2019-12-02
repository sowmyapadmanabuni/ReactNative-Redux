/**
 * Created by Anooj Krishnan at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */

const isDev = true;

const isSecure = true;

const isMandatory = ' is required';

/*Change this urlType to
    1. apiuat  --- For testing server
    2. apidev  --- For development server
    3. api     --- For production server
*/
const urlType = 'apiuat';

const api = {
  oyeSafeApiDomainFamily: isDev
    ? `${urlType}.oyespace.com/oyesafe/api/v1/`
    : `${urlType}.oyespace.com/oyesafe/api/v1/`,
  oyeSafeDomain: isDev
    ? `${urlType}.oyespace.com/oye247`
    : `${urlType}.oyespace.com/oye247`,
  oyeDomain: isDev
    ? `${urlType}.oyespace.com/oyeliving`
    : `${urlType}.oyespace.com/oyeliving`,
  oyeLivingDomain: isDev
    ? `${urlType}.oyespace.com`
    : 'OyeLivingApi.oyespace.com',
  protocol: isSecure ? 'https://' : 'http://',
  oyeSafeApiPath: '/api/v1/',
  oyeLivingApiPath: '/oyeliving/OyeLivingApi/v1/',
  oyeSafeKey: '7470AD35-D51C-42AC-BC21-F45685805BBE',
  oyeLivingKey: '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
  CLOUD_FUNCTION_URL: 'https://us-central1-oyespace-dc544.cloudfunctions.net',
  GATE_CLOUD_FUNCTION_URL:
    'https://us-central1-oyespace-b7e2d.cloudfunctions.net'
};

//const imageUrl = 'https://mediauploaddev.oyespace.com/Images/'; //Development
const imageUrl = 'https://mediauploaduat.oyespace.com/Images/'; //Validation
//const imageUrl = 'https://mediaupload.oyespace.com/Images/'; //Production

const strings = {
  urlType: urlType,
  appName: 'OyeSpace',
  //oyeSafeUrl:api.protocol+api.oyeSafeDomain, Patrolling it is like this
  oyeSafeUrlFamily: api.protocol + api.oyeSafeApiDomainFamily,
  oyeSafeUrl: api.protocol + api.oyeSafeDomain + api.oyeSafeApiPath,
  oyeLivingUrl: api.protocol + api.oyeLivingDomain + api.oyeLivingApiPath,
  oyeLivingDashBoard: api.protocol + api.oyeDomain + api.oyeSafeApiPath,
  oyeSafeApiKey: api.oyeSafeKey,
  oyeLivingApiKey: api.oyeLivingKey,
  gatecloudfuncurl: api.GATE_CLOUD_FUNCTION_URL,
  residentcloudfuncurl: api.CLOUD_FUNCTION_URL,
  mandatory: {
    firstName: 'First Name' + isMandatory,
    lastName: 'Last Name' + isMandatory
  },
  staffPlaceHolder: 'https://via.placeholder.com/150/ff8c00/FFFFFF',
  StaffImageLink: 'http://mediaupload.oyespace.com/Images/',
  patrolId: 'PATROL_ID',
  rupeeIconCode: '\u20B9',
  mediaUploadUrl: 'http://mediaupload.oyespace.com/oyeliving/api/V1',
  oyeImageUploadKey: '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
  imageUrl: imageUrl,
  SOLD_OWNER_OCCUPIED_UNIT: 'Sold Owner Occupied Unit',
  SOLD_TENANT_OCCUPIED_UNIT: 'Sold Tenant Occupied Unit',
  UNSOLD_VACANT_UNIT: 'UnSold Vacant Unit',
  UNSOLD_TENANT_OCCUPIED_UNIT: 'UnSold Tenant Occupied Unit',
  SOLD_VACANT_UNIT: 'Sold Vacant Unit',
  USER_ADMIN: 1,
  USER_OWNER: 2,
  USER_TENANT: 3,
  firebaseconfig: {
    apiKey: 'AIzaSyAHw662K_LOVs6DW76D1HRu05PxjpOgyQw',
    authDomain: 'oyespace-b7e2d.firebaseapp.com',
    databaseURL: 'https://oyespace-b7e2d.firebaseio.com',
    projectId: 'oyespace-b7e2d',
    storageBucket: 'oyespace-b7e2d.appspot.com',
    messagingSenderId: '194451632723',
    appId: '1:194451632723:web:55842a54e3f70d54'
  },
  noImageCapturedPlaceholder: 'Images/no_img_captured.png',

  alertMessage: {
    selectOyeSafe: 'Please select oyeSafe for editing',
    biometricWithPlatinum:
      'For Platinum, biometric is mandatory. Please select Biometric only with Platinum plan.',
    biometricWithGold: 'You can select Biometric with Platinum only',
    paymentSuccess: 'We will release payment gateway feature soon !!!',
    subscriptionAlert1: 'Your subscription is going to end in',
    subscriptionAlert2: 'days. Please contact your association admin'
  }
};

export default strings;
