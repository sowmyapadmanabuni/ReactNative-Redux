import {
  DASHBOARD_SUBSCRIPTION,
  DASHBOARD_ASSOCIATION,
  DASHBOARD_UNITS,
  DASHBOARD_RESIDENT_LIST,
  DASHBOARD_PIE,
  DASHBOARD_UNITS_START,
  DASHBOARD_UNITS_STOP,
  DASHBOARD_ASSOC_STOP,
  GET_MEMBERLIST_SUCCESS,
  GET_MEMBERLIST_FAILED,
  UPDATE_ID_DASHBOARD,
  UPDATE_DROPDOWN_INDEX,
  DASHBOARD_NO_UNITS,
  UPDATE_SELECTED_DROPDOWN
} from "../actions/types";

const INITIAL_STATE = {
  datasource: null,
  dropdown: [],
  dropdown1: [],
  associationid: null,
  residentList: [],
  sold: 0,
  sold2: 0,
  unsold2: 0,
  unsold: 0,
  isLoading: true,
  selectedAssociation: null,
  memberList: [],
  assId: null,
  uniID: null,
  selectedAssociationIndex: null,
  selectedDropdown: "",
  selectedDropdown1: "",
  called: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DASHBOARD_SUBSCRIPTION:
      return { ...state, datasource: action.payload };

    case DASHBOARD_ASSOC_STOP:
      return { ...state, isLoading: false };

    case DASHBOARD_ASSOCIATION:
      return {
        ...state,
        dropdown: action.payload.dropdown,
        associationid: action.payload.associationid,
        isLoading: false,
        called: true
      };

    case DASHBOARD_UNITS_START:
      return {
        ...state,
        isLoading: false,
        dropdown1: [],
        selectedDropdown1: ""
      };

    case DASHBOARD_UNITS_STOP:
      return {
        ...state,
        isLoading: false,
        sold: 0,
        sold2: 0,
        unsold: 0,
        unsold2: 0,
        residentList: [],
        dropdown1: [],
        selectedAssociation: null
      };

    case DASHBOARD_UNITS:
      return {
        ...state,
        dropdown1: action.payload,
        isLoading: false,
        selectedAssociation: action.association
      };

    case DASHBOARD_RESIDENT_LIST:
      return { ...state, residentList: action.payload };

    case DASHBOARD_PIE:
      return { ...state, [action.payload.prop]: action.payload.value };

    case GET_MEMBERLIST_SUCCESS:
      return { ...state, memberList: action.payload };

    case GET_MEMBERLIST_FAILED:
      return { ...state, memberList: [] };

    case UPDATE_ID_DASHBOARD:
      return { ...state, [action.payload.prop]: action.payload.value };

    case UPDATE_DROPDOWN_INDEX:
      return { ...state, selectedAssociationIndex: action.payload };

    case UPDATE_SELECTED_DROPDOWN:
      return { ...state, [action.payload.prop]: action.payload.value };

    case DASHBOARD_NO_UNITS:
      return { ...state, dropdown: action.payload };

    default:
      return state;
  }
};
