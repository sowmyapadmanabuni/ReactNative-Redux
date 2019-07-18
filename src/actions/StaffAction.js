import {UPDATE_STAFF_INFO} from './types'

export const updateStaffInfo = ({ prop, value }) => {

    return (dispatch) => {
        console.log("StaffAction",prop,value)
        dispatch({
            type: UPDATE_STAFF_INFO,
            payload: { prop, value }
        })
    }
}