/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-07-01
 */

import { UPDATE_PATROLLING_CP_LIST,UPDATE_QR_BASE64 } from "./types";

export const updateSelectedCheckPoints = ({value }) => {
    return (dispatch) => {
        dispatch({
            type: UPDATE_PATROLLING_CP_LIST,
            payload: { value }
        })
    }
};

export const updateQRBase64 = ({value}) =>{
    return (dispatch) => {
        dispatch({
            type:UPDATE_QR_BASE64,
            payload: {value}
        })
    }
};