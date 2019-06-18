import {
  DASHBOARD_SUBSCRIPTION,
  DASHBOARD_ASSOCIATION,
  DASHBOARD_UNITS,
  DASHBOARD_RESIDENT_LIST,
  DASHBOARD_PIE,
  DASHBOARD_UNITS_START,
  DASHBOARD_UNITS_STOP,
  DASHBOARD_ASSOC_STOP
} from "./types";
import axios from "axios";
import _ from "lodash";

export const getDashSub = (oyeURL, SelectedAssociationID) => {
  return dispatch => {
    console.log("oyeURL", oyeURL)
    fetch(
      `http://${oyeURL}/oyesafe/api/v1/Subscription/GetLatestSubscriptionByAssocID/${SelectedAssociationID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          dispatch({
            type: DASHBOARD_SUBSCRIPTION,
            payload: responseJson
          });
        }
      })
      .catch(error => console.log(error));
  };
};

export const getDashAssociation = (oyeURL, MyAccountID) => {
  return dispatch => {
    console.log(
      `http://${oyeURL}/oyeliving/api/v1/GetAssociationListByAccountID/${MyAccountID}`
    );
    // console.log(`http://${oyeURL}/oyeliving/api/v1/GetAssociationListByAccountID/${MyAccountID}`)
    fetch(
      `http://${oyeURL}/oyeliving/api/v1/GetAssociationListByAccountID/${MyAccountID}`,
      // fetch(`http://${oyeURL}/oyeliving/api/v1/GetAssociationListByAccountID/2`
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson)

        if (responseJson.success) {
          var count = Object.keys(responseJson.data.associationByAccount)
            .length;
          let drop_down_data = [];
          let associationid = [];

          for (var i = 0; i < count; i++) {
            let associationName =
              responseJson.data.associationByAccount[i].asAsnName;
            drop_down_data.push({
              value: associationName,
              name: associationName,
              id: i,
              associationId: responseJson.data.associationByAccount[i].asAssnID
            });
            associationid.push({
              id: responseJson.data.associationByAccount[i].asAssnID
            });
          }

          dispatch({
            type: DASHBOARD_ASSOCIATION,
            payload: { dropdown: drop_down_data, associationid }
          });
        } else {
          dispatch({ type: DASHBOARD_ASSOC_STOP });
        }
      })

      .catch(error => {
        dispatch({ type: DASHBOARD_ASSOC_STOP });
        console.log(error);
      });
  };
};

export const getDashUnits = (unit, oyeURL) => {
  return dispatch => {
    let sold = 100;
    let unsold = 100;
    let totalunits1 = 0;
    let sold2 = 0;
    let unsold2 = 0;
    let Residentlist = [];

    // console.log(`http://${oyeURL}/oyeliving/api/v1/Unit/GetUnitListByAssocID/${unit}`)

    dispatch({ type: DASHBOARD_UNITS_START });

    axios
      .get(
        `http://${oyeURL}/oyeliving/api/v1/Member/GetMemUniOwnerTenantListByAssoc/${unit}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
          }
        }
      )
      .then(response => {
        // if(response){

        // }
        let responseData = response.data.data;
        let unitOwner = responseData.unitOwner;
        let unitTenant = responseData.unitTenant;
        let residents = _.union(unitOwner, unitTenant);

        fetch(
          `http://${oyeURL}/oyeliving/api/v1/Unit/GetUnitListByAssocID/${unit}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
            }
          }
        )
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson.success) {
              let count = Object.keys(responseJson.data.unit).length;
              let sold_data = [];
              let name = [];
              let sold1 = 0;
              let unsold1 = 0;
              let totalunits = 0;
              Residentlist = name;

              for (var i = 0; i < count; i++) {
                sold_data.push({ value: responseJson.data.unit[i].unOcStat });
                var count1 = Object.keys(responseJson.data.unit[i].owner)
                  .length;

                for (var j = 0; j < count1; j++) {
                  let ownername = responseJson.data.unit[i].owner[j].uofName;
                  let unitname = responseJson.data.unit[i].unUniName;
                  let unitid = responseJson.data.unit[i].unUnitID;
                  let uoMobile = responseJson.data.unit[i].owner[j].uoMobile;
                  let admin = responseJson.data.unit[i].owner[j].acAccntID;

                  Residentlist.push({
                    name: ownername,
                    unit: unitname,
                    role: "Owner",
                    unitid: unitid,
                    uoMobile: uoMobile,
                    admin: admin
                  });
                }

                var count2 = Object.keys(responseJson.data.unit[i].tenant)
                  .length;

                for (var k = 0; k < count2; k++) {
                  let tenantname = responseJson.data.unit[i].tenant[k].utfName;
                  let unitname = responseJson.data.unit[i].unUniName;

                  Residentlist.push({
                    name: tenantname,
                    unit: unitname,
                    role: "Tenant"
                  });
                }
              }

              // Sold Owner Occupied
              // Sold Tenant Occupied
              // Sold Vacant
              // All Sold Flats

              // Unsold Vacant
              // Unsold Tenant Occupied
              
              
              // All Unsold Flats
              // All Units
              // Single Unit
              // All Vacant Units
              // All Occupied Units

              for (var j = 0; j < sold_data.length; j++) {
                if (
                  sold_data[j].value == "All Sold Flats" ||
                  sold_data[j].value == "Sold Owner Occupied" ||
                  sold_data[j].value == "Sold Tenant Occupied" ||
                  sold_data[j].value == "Sold Vacant"
                ) {
                   
                  sold1 = sold1 + 1;
                } else if (
                  sold_data[j].value == "Unsold Vacant" ||
                  sold_data[j].value == "Unsold Tenant Occupied" ||
                  sold_data[j].value == "NULL" ||
                  sold_data[j].value == ""
                ) {
                  unsold1 = unsold1 + 1;
                }
                totalunits++;
              }

              sold = ((sold1 / totalunits) * 100).toFixed(0);
              unsold = ((unsold1 / totalunits) * 100).toFixed(0);
              totalunits1 = totalunits;
              sold2 = sold1;
              unsold2 = unsold1;

              let units = [];

              responseJson.data.unit.map((data, index) => {
                // console.log(data);
                units.push({
                  value: data.unUniName,
                  name: data.unUniName,
                  unitId: data.unUnitID,
                  id: index
                });
              });

              let residentListOwner = [];
              let residentListTenant = [];

              Residentlist.map((val, i) => {
                if (val.role === "Owner") {
                  residentListOwner.push({ ...val });
                } else {
                  residentListTenant.push({ ...val });
                }
              });

              let newResidentOwner = [];
              let newResidentTenant = [];

              residentListOwner.map((val, i) => {
                newResidentOwner.push({
                  ...val,
                  ...unitOwner[i]
                });
              });

              residentListTenant.map((val, i) => {
                newResidentTenant.push({
                  ...val,
                  uoRoleID: 0
                });
              });

              let newResidents = _.union(newResidentOwner, newResidentTenant);

              // console.log(newArr)
              // console.log(unitOwner)
              // console.log(residentListOwner)
              console.log(newResidentOwner);
              // console.log(unitTenant)
              // console.log(residentListTenant)
              console.log(newResidentTenant);
              console.log(newResidents);
              // console.log(residents)
              // console.log(Residentlist)
              console.log("_________");

              dispatch({
                type: DASHBOARD_UNITS,
                payload: units,
                association: unit
              });

              dispatch({
                type: DASHBOARD_RESIDENT_LIST,
                payload: newResidents
              });

              dispatch({
                type: DASHBOARD_PIE,
                payload: { prop: "sold", value: sold }
              });

              dispatch({
                type: DASHBOARD_PIE,
                payload: { prop: "sold2", value: sold2 }
              });

              dispatch({
                type: DASHBOARD_PIE,
                payload: { prop: "unsold", value: unsold }
              });

              dispatch({
                type: DASHBOARD_PIE,
                payload: { prop: "unsold2", value: unsold2 }
              });
            } else {
              dispatch({ type: DASHBOARD_UNITS_STOP });
            }
          })
          .catch(error => {
            console.log(error);
            dispatch({ type: DASHBOARD_UNITS_STOP });
          });
      });
  };
};
