import {
    DASHBOARD_ASSOC_STOP,
    DASHBOARD_ASSOCIATION,
    DASHBOARD_ASSOCIATION_SYNC,
    DASHBOARD_NO_UNITS,
    DASHBOARD_PIE,
    DASHBOARD_RESIDENT_LIST,
    DASHBOARD_SUBSCRIPTION,
    DASHBOARD_UNITS,
    DASHBOARD_UNITS_START,
    DASHBOARD_UNITS_STOP,
    GET_MEMBERLIST_FAILED,
    GET_MEMBERLIST_SUCCESS,
    UPDATE_DROPDOWN_INDEX,
    UPDATE_ID_DASHBOARD,
    UPDATE_SELECTED_DROPDOWN,
    USER_ROLE,
    IS_NOTIFICATION
} from "../actions/types";

const INITIAL_STATE = {
    datasource: null,
    dropdown: [],
    dropdown1: [],
    allAssociations:[],
    associationid: null,
    residentList: [],
    sold: 0,
    sold2: 0,
    unsold2: 0,
    unsold: 0,
    isLoading:true,
    selectedAssociation: null,
    memberList: [],
    assId: null,
    uniID: null,
    selectedAssociationIndex: null,
    selectedDropdown: "",
    selectedDropdown1: "",
    called: false,
    role: "",
    familyMemberCount: "",
    vehiclesCount: "",
    roleId: null,
    isInternetConnected:true,
    userQRCode:"",
    isNotification:false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case DASHBOARD_SUBSCRIPTION:
            return {...state, datasource: action.payload};

        case DASHBOARD_ASSOC_STOP:
            return {...state, isLoading:false};

        case DASHBOARD_ASSOCIATION:
            return {
                ...state,
                dropdown: action.payload.dropdown,
                associationid: action.payload.associationid,
                allAssociations:action.payload.allAssociations,
                selectedDropdown:action.payload.allAssociations[0].value,
                assId:action.payload.allAssociations[0].associationId,
                SelectedAssociationID:action.payload.allAssociations[0].associationId,
                selectedDropdown1:action.payload.allAssociations[0].unit.length>0?action.payload.allAssociations[0].unit[0].value:"",
                SelectedUnitID:action.payload.allAssociations[0].unit.length>0?action.payload.allAssociations[0].unit[0].value:"",
                unitID:action.payload.allAssociations[0].unit.length>0?action.payload.allAssociations[0].unit[0].value:"",
                role:action.payload.allAssociations[0].roleId,
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
            return {...state, residentList: action.payload,isLoading:false};

        case DASHBOARD_PIE:
            return {...state, [action.payload.prop]: action.payload.value,isLoading:false};

        case GET_MEMBERLIST_SUCCESS:
            return {...state, memberList: action.payload};

        case GET_MEMBERLIST_FAILED:
            return {...state, memberList: []};

        case UPDATE_ID_DASHBOARD:
            return {...state, [action.payload.prop]: action.payload.value};

        case UPDATE_DROPDOWN_INDEX:
            return {...state, selectedAssociationIndex: action.payload};

        case UPDATE_SELECTED_DROPDOWN:
            return {...state, [action.payload.prop]: action.payload.value};

        case DASHBOARD_NO_UNITS:
            return {...state, dropdown: action.payload};
        case USER_ROLE:
            //return { ...state, userRole: action.payload };
            return {...state, [action.payload.prop]: action.payload.value};

        case IS_NOTIFICATION:
            return {...state,isNotification:action.payload}

        case DASHBOARD_ASSOCIATION_SYNC:
            return {
                ...state,
                dropdown: action.payload.dropdown,
                associationid: action.payload.associationid,isLoading:false
            };

        default:
            return state;
    }
};