import { UPDATE_USER_INFO } from "../actions/types";


<<<<<<< HEAD
// const oyeURL = "apidev.oyespace.com";
const oyeURL = "apiuat.oyespace.com";
// const oyeURL = "OyeLivingApi.oyespace.com";
const oyeBaseURL = "https://" + oyeURL + "/oye247/OyeLivingApi/v1/";
=======
const oyeURL = "apidev.oyespace.com";
// const oyeURL = "apiuat.oyespace.com";
// const oyeURL = "api.oyespace.com";
const oyeBaseURL = "https://" + oyeURL + "/oye247/api/v1/";
>>>>>>> d333328e5be6c6d80ebc45f75d2dbd266ce06957

const INITIAL_STATE = {
  oyeURL,
  champBaseURL: "https://" + oyeURL + "/oyeliving/OyeLivingApi/v1/",
  oye247BaseURL: "https://" + oyeURL + "/oye247/OyeLivingApi/v1/",
  oyeBaseURL,
  viewImageURL: "http://" + oyeBaseURL + "/Images/",
  uploadImageURL:
    "http://" + oyeBaseURL + "/oyeliving/OyeLivingApi/v1/association/upload",
  oyeMobileRegex: /^[0]?[456789]d{9}$/,
  oyeNonSpecialRegex: /[^0-9A-Za-z ,]/,
  oyeNonSpecialNameRegex: /[^0-9A-Za-z .]/,
  oyeEmailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  OyeFullName: /^[a-zA-Z ]+$/
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
