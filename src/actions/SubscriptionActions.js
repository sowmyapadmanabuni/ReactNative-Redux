import {UPDATE_SUBSCRIPTION} from './types'

export const updateSubscription = ({prop, value}) => {

    return (dispatch) => {
        console.log("SubAction", prop, value);
        dispatch({
            type: UPDATE_SUBSCRIPTION,
            payload: {prop, value}
        })
    }
};