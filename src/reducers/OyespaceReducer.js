import { UPDATE_USER_INFO } from "../actions/types";

const oyeURL = "apidev.oyespace.com";
// const oyeURL = "apiuat.oyespace.com";
// const oyeURL = "api.oyespace.com";
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
  OyeFullName: /^[a-zA-Z ]+$/
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
