import {} from "../actions/types";

const INITIAL_STATE = {
  selectedUnit: {},
  units: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
