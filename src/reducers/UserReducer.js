import { 
    UPDATE_USER_INFO
} from "../actions/types";

const INITIAL_STATE = {
    MyAccountID: null,
    MyEmail: null,
    MyFirstName: null,
    MyLastName: null,
    MyISDCode: null,
    MyMobileNumber: null
}

export default (state = INITIAL_STATE,  action) => {
	switch(action.type) {
        
        case UPDATE_USER_INFO:
            return { ...state, [action.payload.prop] : action.payload.value };

		default:
			return state;
	}
}