import { 
	DASHBOARD_SUBSCRIPTION,
	DASHBOARD_ASSOCIATION,
	DASHBOARD_UNITS,
	DASHBOARD_RESIDENT_LIST,
	DASHBOARD_PIE,
	DASHBOARD_UNITS_START,
	DASHBOARD_UNITS_STOP,
	DASHBOARD_ASSOC_STOP
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
}

export default (state = INITIAL_STATE,  action) => {
	switch(action.type) {
		case DASHBOARD_SUBSCRIPTION:
			return { ...state, datasource: action.payload };

		case DASHBOARD_ASSOC_STOP:
			return { ...state, isLoading: false };

		case DASHBOARD_ASSOCIATION:
			return { ...state, dropdown:action.payload.dropdown,  associationid: action.payload.associationid, isLoading: false };

		case DASHBOARD_UNITS_START:
			return { ...state, isLoading: true };

		case DASHBOARD_UNITS_STOP:
			return { ...state, isLoading: false };

		case DASHBOARD_UNITS:
			return { ...state, dropdown1: action.payload, isLoading: false, selectedAssociation: action.association };

		case DASHBOARD_RESIDENT_LIST:
			return { ...state, residentList: action.payload };

		case DASHBOARD_PIE:
			return { ...state, [action.payload.prop]: action.payload.value };

		default:
			return state;
	}
}