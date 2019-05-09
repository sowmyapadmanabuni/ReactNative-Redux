import { JOIN_ASSOCIATION, APPROVE_ADMIN } from "../actions/types";

const INITIAL_STATE = {
	joinedAssociations: [],
	approvedAdmins: []
}

export default (state = INITIAL_STATE,  action) => {
	switch(action.type) {
        case JOIN_ASSOCIATION:
			return { ...state, joinedAssociations: action.payload };
			
		case APPROVE_ADMIN:
			return { ...state, approvedAdmins: action.payload };
            
		default:
			return state;
	}
}