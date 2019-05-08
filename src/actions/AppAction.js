import { JOIN_ASSOCIATION } from "./types";

export const updateJoinedAssociation = (prevAsso, newAsso) => {
    return (dispatch) => {
        console.log(prevAsso)
        let updatedList = prevAsso;
        updatedList.push({ test: '1'})
        console.log(prevAsso)

        dispatch({
            type: JOIN_ASSOCIATION,
            payload: updatedList
        })
    }
}