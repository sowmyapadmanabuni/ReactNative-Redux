/**
 * Created by Anooj Krishnan at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */
import {AsyncStorage} from 'react-native';

export default class storage {

    static storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log(error)
        }
    };

    static retrieveData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            return value;
        } catch (error) {
            return null;
        }
    };

    static removeData = async (key) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.log(error)
        }
    };

    static removeAllData = async () => {
        try {
            await AsyncStorage.removeAll()
        } catch (error) {
            console.log(error)
        }
    }
}