import React from 'react';
import {View} from 'react-native'
import strings from './strings'

export class validate{
    /*static handleNullImage(img){
        try{
            let nImg=(img && img !="")?img:base.utils.strings.defaultImage
        }
    }*/

    static isBlank = (field) => {
        field += "";
        return !(field != null && field !== undefined && field !== "" && field.length > 0 && field !== "undefined");
    }

}