import { DASHBOARD_SUBSCRIPTION, DASHBOARD_ASSOCIATION } from "./types";

export const getDashSub = () => {
    return (dispatch) => {
        fetch(`http://${global.oyeURL}/oyesafe/api/v1/Subscription/GetLatestSubscriptionByAssocID/${global.SelectedAssociationID}`
        , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
            },
        })
        .then(response => response.json())
        .then(responseJson => {
            dispatch({
                type: DASHBOARD_SUBSCRIPTION,
                payload: responseJson
            })
        })
        .catch( error => console.log(error))
    }
}

export const getDashAssociation = () => {
    return (dispatch) => {
        console.log(global.MyAccountID)
        console.log(`http://${global.oyeURL}/oyeliving/api/v1/GetAssociationListByAccountID/${global.MyAccountID}`)
        fetch(`http://${global.oyeURL}/oyeliving/api/v1/GetAssociationListByAccountID/${global.MyAccountID}`
        , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
            },
        })
        .then(response => response.json())
        .then((responseJson) => {
            console.log(responseJson)
            var count = Object.keys(responseJson.data.associationByAccount).length;
            let drop_down_data = [];
            let associationid = [];

            for(var i=0;i<count;i++){
                let associationName = responseJson.data.associationByAccount[i].asAsnName;
                drop_down_data.push({ value: associationName, name: associationName, id:i });
                associationid.push({ id: responseJson.data.associationByAccount[i].asAssnID })
            }

            dispatch({ 
                type: DASHBOARD_ASSOCIATION,
                payload: { dropdown: drop_down_data, associationid }
            })
        })
        
        .catch(error => console.log(error))
    }
}