import { JOIN_ASSOCIATION } from "./types";

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