import React from 'react';
import strings from "../utils/strings";
import moment from "moment";


export class validate{
    static handleNullImg(img) {
        try{
            console.log("Validate",img,strings.StaffImageLink,strings.StaffImageLink+img)

            let mImg = (img && img != "" ) ? strings.StaffImageLink+img: strings.staffPlaceHolder;
            return mImg;
        }
        catch(err){
            return strings.staffPlaceHolder;
        }
    }

    static ReportData(tableData) {
        let report = tableData;
        console.log("Report DATA:", report, report[0] ,report[0][0] ,report[0].length);


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


}