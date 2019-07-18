/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-07-01
 */

import {UPDATE_PATROLLING_CP_LIST,UPDATE_QR_BASE64} from '../actions/types';

const INITIAL_STATE ={
  selectedCheckPoints:null,
    qrBase64:null
};

export default(state = INITIAL_STATE,action)=>{
    console.log("JFBKJEBEVJEK:",action,state);
    if (action.type === UPDATE_PATROLLING_CP_LIST) {
        return{...state,selectedCheckPoints:action.payload.value};
    }
    else if(action.type === UPDATE_QR_BASE64){
        return {...state,qrBase64:action.payload}
    }
    else {
        return state;
    }
}