import { UPDATE_USER_INFO } from "../actions/types";

//DB
// const oyeURL = "apidev.oyespace.com"; //Development
<<<<<<< HEAD
// const oyeURL = "apiuat.oyespace.com"; //Validation/
const oyeURL = "api.oyespace.com"; //Production
=======
const oyeURL = "apiuat.oyespace.com"; //Validation/
// const oyeURL = "api.oyespace.com"; //Production
>>>>>>> 61959c5e43a06489c834a00121cf22c1f4a9e7a1

//Image Domains
// const mediaUpload = "https://mediauploaddev.oyespace.com/Images/"; //Development

<<<<<<< HEAD
// const mediaUpload = "https://mediauploaduat.oyespace.com/Images/"; //Validation
const mediaUpload = "https://mediaupload.oyespace.com/Images/"; //Production
=======
const mediaUpload = "https://mediauploaduat.oyespace.com/Images/"; //Validation
// const mediaUpload = "https://mediaupload.oyespace.com/Images/"; //Production

//No Image Url 
// const noImage = "http://mediauploaddev.oyespace.com/Images/no_img_captured.png" //Development
const noImage = "http://mediauploaduat.oyespace.com/Images/no_img_captured.png" //Validation
// const noImage = "http://mediaupload.oyespace.com/Images/no_img_captured.png"  //Production

>>>>>>> 61959c5e43a06489c834a00121cf22c1f4a9e7a1
const oyeBaseURL = "http://" + oyeURL + "/oye247/api/v1/";

const INITIAL_STATE = {
  oyeURL,
  champBaseURL: "http://" + oyeURL + "/oyeliving/api/v1/",
  oye247BaseURL: "https://" + oyeURL + "/oye247/api/v1/",

  oyeBaseURL,
  viewImageURL: "http://" + oyeBaseURL + "/Images/",
  uploadImageURL:
    "http://" + oyeBaseURL + "/oyeliving/OyeLivingApi/v1/association/upload",
  oyeMobileRegex: /^[0]?[456789]d{9}$/,
  oyeNonSpecialRegex: /[^0-9A-Za-z ,]/,
  oyeNonSpecialNameRegex: /[^0-9A-Za-z .]/,
  oyeEmailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  OyeFullName: /^[a-zA-Z ]+$/,
  mediaupload: mediaUpload,
  noImage: noImage
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
