import {UPDATE_STAFF_INFO} from '../actions/types';

const INITIAL_STATE={
    staffId:null,
    staffName:"",
    staffProfilePic:'',
    joinedDate:"",
    staffMobileNum:"",
    staffDesignation:"",
    startDate:"",
    endDate:""
};

export default (state = INITIAL_STATE, action) => {
    console.log("STAFF_ADDED",action.type)
    switch (action.type) {
        case UPDATE_STAFF_INFO:
            return { ...state, [action.payload.prop]: action.payload.value };

            default:
            return state;
    }
};

