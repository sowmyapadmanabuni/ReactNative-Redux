import { 
	DASHBOARD_SUBSCRIPTION,
	DASHBOARD_ASSOCIATION
} from "../actions/types";

const INITIAL_STATE = {
	datasource: null,
	dropdown: [],
	associationid: null,
}

export default (state = INITIAL_STATE,  action) => {
	switch(action.type) {
		case DASHBOARD_SUBSCRIPTION:
			return { ...state, datasource: action.payload };

		case DASHBOARD_ASSOCIATION:
			return { ...state, dropdown:action.payload.dropdown,  associationid: action.payload.associationid };

		default:
			return state;
	}
}