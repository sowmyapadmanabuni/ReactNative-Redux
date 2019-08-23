import React from 'react';
import strings from "../utils/strings";
import moment from "moment";


export class validate{
    static handleNullImg(img) {
        try{
            let mImg = (img && img != "" ) ? strings.StaffImageLink+img: strings.staffPlaceHolder;
            return mImg;
        }
        catch(err){
            return strings.staffPlaceHolder;
        }
    }

    static ReportData(tableData) {
        let report = tableData;
        console.log("Report DATA:", report);


        let htmlContent =
            '       <meta charset="UTF-8">  '
        +' <table style="width:100%">\n'+
           ' <tr>\n' +
                '    <th style="background-color:orange;color:white;width:20%">Date </th>\n' +
                '    <th style="background-color:orange;color:white;width:20%">Entry Point </th> \n' +
                '    <th style="background-color:orange;color:white;width:20%">Entry Time </th>\n' +
                '    <th style="background-color:orange;color:white;width:20%">Exit Point </th>\n' +
                '    <th style="background-color:orange;color:white;width:20%">Exit Time</th>\n' +
                '  </tr>'
        '</table>';

        for (let i = 0; i < report.length; i++) {

            if(report[i].length===5) {

               htmlContent += '<table style="width:100%">' +
                   '  <tr>\n' +
                   '    <td style= "width:20%;text-align:center">' + report[i][0] + '</td>' +
                   '    <td style= "width:20%;text-align:center">' + report[i][1] + '</td>' +
                   '    <td style= "width:20%;text-align:center">' + report[i][2]+ '</td>' +
                   '    <td style= "width:20%;text-align:center">' + report[i][3] + '</td>' +
                   '    <td style= "width:20%;text-align:center">' + report[i][4] + '</td>' +
                   '  </tr>' + '</table>'
               ;
           }
           else {

               htmlContent += '<table style="width:100%">' +
                   '  <tr>\n' +
                   '    <td style= "width:20%;text-align:center">' + report[i][0] + '</td>' +
                   '    <td style="background-color: red; width:80%; color: white;text-align:center">' + report[i][1] + '</td>' +
                   '  </tr>' + '</table>'
               ;
           }
        };

        return htmlContent;

    }

    static patrollingReportData(tableHead,tableData) {
        let report = tableData;
        console.log("Report DATA:",report);


        let htmlContent =
            '       <meta charset="UTF-8">  '
            +' <table style="width:100%">\n'+
            ' <tr>\n' +
            '    <th style="background-color:orange;color:white;width:20%">Date </th>\n' +
            '    <th style="background-color:orange;color:white;width:20%">Start Time </th> \n' +
            '    <th style="background-color:orange;color:white;width:20%">End Time </th>\n' +
            '    <th style="background-color:orange;color:white;width:20%">Status </th>\n' +
            '    <th style="background-color:orange;color:white;width:20%">Patrolled by</th>\n' +
            '  </tr>'
        '</table>';

        for (let i = 0; i < report.length; i++) {

            if(report[i].length===5) {

                htmlContent += '<table style="width:100%">' +
                    '  <tr>\n' +
                    '    <td style= "width:20%;text-align:center">' + report[i][0] + '</td>' +
                    '    <td style= "width:20%;text-align:center">' + report[i][1] + '</td>' +
                    '    <td style= "width:20%;text-align:center">' + report[i][2]+ '</td>' +
                    '    <td style= "width:20%;text-align:center">' + report[i][3] + '</td>' +
                    '    <td style= "width:20%;text-align:center">' + report[i][4] + '</td>' +
                    '  </tr>' + '</table>'
                ;
            }
            else {

                htmlContent += '<table style="width:100%">' +
                    '  <tr>\n' +
                    '    <td style= "width:20%;text-align:center">' + report[i][0] + '</td>' +
                    '    <td style="background-color: red; width:80%; color: white;text-align:center">' + report[i][1] + '</td>' +
                    '  </tr>' + '</table>'
                ;
            }
        };

        return htmlContent;

    }


    static isBlank = (field) => {
        field += "";
        return !(field != null && field !== undefined && field !== "" && field.length > 0 && field !== "undefined");
    };


    static distanceMeasurement(lati1,lati2,longi1,longi2){
        Number.prototype.toRad = function() {
            return this * Math.PI / 180;
        };
        let lat2 = lati2;
        let lon2 = longi2;
        let lat1 = lati1;
        let lon1 = longi1;

        let R = 6371;
        let x1 = lat2-lat1;
        let dLat = x1.toRad();
        let x2 = lon2-lon1;
        let dLon = x2.toRad();
        let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        let d = R * c * 3280.84;  // Converting Km to Ft
        return d;

        // if(d<10 && d !== 0){
        //     return "less",d
        // }
        // else if(d>20){
        //     return 'more'
        // }
        // else if (d === 0){
        //     return 0,d;
        // }
        // else {
        //     return true,d
        // }
    }

    static strToArray(str){
        return str.split(" ")
    }

    static compareAssociationNames(a, b){
        if ( a.value < b.value ){
            return -1;
        }
        if ( a.value > b.value ){
            return 1;
        }
        return 0;
    }

    static validateTime(startTime,endTime,callback){
        try{
            let startTime=startTime;
            let endTime=endTime;

            let diff =moment(endTime).diff(startTime)

            let isValid=false

            if(diff >0){

               isValid =true;
            }
            else{
                isValid=false;
            }
            callback(isValid,diff);
        }
        catch (err) {
            console.log(err)
        }
    }

    static mobileNumberValidation=(mobNumber) =>{
        let re=/^(\d{8,10})$/;
        return re.test(mobNumber);
    };

    static alphabetValidation=(text) =>{
        let re=/^[A-Za-z]+$/;
        return re.test(text);
    };

   static validateEmailId=(email)=>{
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
   }

   static isBlank=(field)=>{
       field += "";
       if(field !== "" && field.length > 0 && field !== "undefined"){
           return false;
       }else{
           return true;
       }
   }
}