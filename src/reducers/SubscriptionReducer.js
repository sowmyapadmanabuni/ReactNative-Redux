import {UPDATE_SUBSCRIPTION} from '../actions/types';

const INITIAL_STATE = {
  oyeSafePrice:'0.00',
    oyeSafeGST:'0.00',
    grandTotal:'0.00',
    oyeLivingSub: '0.00',
    oyeLivingGST: '0.00',
    platDevPrice:0,
    goldDevPrice:0,
    biometricPrice:0,
    platinumTotalPrice:0,
    goldTotalPrice:0,
    biometricTotalPrice:0,
    platinumDevCount:0,
    goldDevCount:0,
    bioDevCount:0,
    oyeSafeList:[],
    oyeLivList:[],
    isOyeLiving: true,
    isOyeSafe: true,
    isPlatinum: true,
    isGold: true,

};

export default (state = INITIAL_STATE, action) => {
    console.log("SUB", action.type);
    if (action.type === UPDATE_SUBSCRIPTION) {
        return {...state, [action.payload.prop]: action.payload.value};
    } else {
        return state;
    }
};
