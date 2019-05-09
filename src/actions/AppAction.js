import { JOIN_ASSOCIATION, APPROVE_ADMIN } from "./types";

export const updateJoinedAssociation = (prevAsso, newAsso) => {
    return (dispatch) => {
        
        let updatedList = prevAsso;
        updatedList.push(newAsso)

        dispatch({
            type: JOIN_ASSOCIATION,
            payload: updatedList
        })
    }
}

export const updateApproveAdmin = (prevAdmin, newAdmin) => {
    return (dispatch) => {
        
        let updatedList = prevAdmin;
        updatedList.push(newAdmin)

        dispatch({
            type: APPROVE_ADMIN,
            payload: updatedList
        })
    }
}