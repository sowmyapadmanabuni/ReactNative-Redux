import { JOIN_ASSOCIATION } from "../actions/types";

const INITIAL_STATE = {
  joinedAssociations: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case JOIN_ASSOCIATION:
      return { ...state, joinedAssociations: action.payload };

    default:
      return state;
  }
};
