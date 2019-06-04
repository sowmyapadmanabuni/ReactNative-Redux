import { UPDATE_USER_INFO } from "../actions/types";

const oyeURL = "apidev.oyespace.com";
const oyeBaseURL = "https://" + oyeURL + "/oye247/api/v1/";

const INITIAL_STATE = {
  oyeURL,
  champBaseURL: "https://" + oyeURL + "/oyeliving/api/v1/",
  oye247BaseURL: "https://" + oyeURL + "/oye247/api/v1/",
  oyeBaseURL,
  viewImageURL: "http://" + oyeBaseURL + "/Images/",
  uploadImageURL:
    "http://" + oyeBaseURL + "/oyeliving/api/v1/association/upload",
  oyeMobileRegex: "/^[0]?[456789]d{9}$/",
  oyeNonSpecialRegex: "/[^0-9A-Za-z ,]/",
  oyeNonSpecialNameRegex: "/[^0-9A-Za-z .]/",
  oyeEmailRegex: "/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,10})+$/",
  OyeFullName: "/^[a-zA-Z ]+$/"
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
