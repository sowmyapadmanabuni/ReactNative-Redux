import { 
} from "../actions/types";

const INITIAL_STATE = {
	joinedAssociations: [],
	approvedAdmins: [],
	savedNoifId: [],

}

export default (state = INITIAL_STATE,  action) => {
	switch(action.type) {
            
		default:
			return state;
	}
}