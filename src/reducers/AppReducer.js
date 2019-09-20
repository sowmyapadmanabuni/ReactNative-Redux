import {APPROVE_ADMIN, JOIN_ASSOCIATION, UPDATE_SAVED_NOTIFICATION} from "../actions/types";

const INITIAL_STATE = {
    joinedAssociations: [],
    approvedAdmins: [],
    savedNoifId: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case JOIN_ASSOCIATION:
            return {...state, joinedAssociations: action.payload};

        case APPROVE_ADMIN:
            return {...state, approvedAdmins: action.payload};

        case UPDATE_SAVED_NOTIFICATION:
            return {...state, savedNoifId: action.payload};

        default:
            return state;
    }
};
