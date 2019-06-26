/**
 * Created by Anooj Krishnan at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */

const isLogEnabled = true;

export default class logger {

    static async log(val){
        isLogEnabled?console.log(val):null;
    }

    static async logArgs(){
        isLogEnabled?console.log(arguments):null;
    }

    static async logToFile(){
        //@Todo: Save the log to file
    }

}