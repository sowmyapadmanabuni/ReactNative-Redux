import {
  DASHBOARD_SUBSCRIPTION,
  DASHBOARD_ASSOCIATION,
  DASHBOARD_UNITS,
  DASHBOARD_RESIDENT_LIST,
  DASHBOARD_PIE,
  DASHBOARD_UNITS_START,
  DASHBOARD_UNITS_STOP,
  DASHBOARD_ASSOC_STOP,
  GET_MEMBERLIST_SUCCESS,
  GET_MEMBERLIST_FAILED,
  UPDATE_DROPDOWN_INDEX
} from "./types";
import axios from "axios";
import _ from "lodash";

export const getDashSub = (oyeURL, SelectedAssociationID) => {
  return dispatch => {
    console.log("oyeURL", oyeURL);
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
    //  ("http://apidev.oyespace.com/oyeliving/api/v1/Member/GetMemberListByAccountID/1");
    fetch(
      `http://${oyeURL}/oyeliving/api/v1/Member/GetMemberListByAccountID//${MyAccountID}`,
      // `http://${oyeURL}/oyeliving/api/v1/GetAssociationListByAccountID/${MyAccountID}`,
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
        // console.log(responseJson);
        if (responseJson.success) {
          let associations = responseJson.data.memberListByAccount;

          let associationIds = [];
          let drop_down_data = [];

          associations.map((data, index) => {
            drop_down_data.push({
              value: data.asAsnName,
              name: data.asAsnName,
              id: index,
              associationId: data.asAssnID,
              memberId: data.meMemID
            });
            associationIds.push({
              id: data.asAssnID
            });
          });

          // drop_down_data.map((data, index) => {
          //   associationIds.push({ id: data.associationId });
          // });

          console.log("associations", associations);

          let removeDuplicates = [];

          removeDuplicates = _.uniqBy(drop_down_data, "associationId");
          removeidDuplicates = _.uniqBy(associationIds, "id");

          dispatch({
            type: DASHBOARD_ASSOCIATION,
            payload: {
              dropdown: removeDuplicates,
              associationid: removeidDuplicates
            }
          });
        } else {
          dispatch({
            type: DASHBOARD_ASSOC_STOP
          });
        }
      })

      .catch(error => {
        dispatch({
          type: DASHBOARD_ASSOC_STOP
        });
        console.log(error);
      });
  };
};

export const getDashUnits = (unit, oyeURL, notifications, MyAccountID) => {
  // console.log(notifications);
  return dispatch => {
    let sold = 100;
    let unsold = 100;
    let totalunits1 = 0;
    let sold2 = 0;
    let unsold2 = 0;
    let Residentlist = [];

    // console.log(`http://${oyeURL}/oyeliving/api/v1/Unit/GetUnitListByAssocID/${unit}`)

    dispatch({ type: DASHBOARD_UNITS_START });
    // "http://apidev.oyespace.com/oyeliving/api/v1/Member/GetMemberByAccountID/accountid/associationid";
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
        axios
          .get(
            //  `http://${oyeURL}/oyeliving/api/v1/Member/GetMemUniOwnerTenantListByAssoc/${unit}`,
            `http://${oyeURL}/oyeliving/api/v1/Member/GetMemberByAccountID/${MyAccountID}/${unit}`,
            {
              headers: {
                "Content-Type": "application/json",
                "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
              }
            }
          )
          .then(res => {
            let filteredUnits = res.data.data.memberListByAccount;
            let responseData = response.data.data;
            let unitOwner = responseData.unitOwner;
            let unitTenant = responseData.unitTenant;
            let residents = _.union(unitOwner, unitTenant);
            console.log("filetred", filteredUnits);
            let selUnits = [];

            filteredUnits.map((data, index) => {
              selUnits.push({
                value: data.unUniName,
                name: data.unUniName,
                unitId: data.unUnitID,
                id: index
              });
            });

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
                    sold_data.push({
                      value: responseJson.data.unit[i].unOcStat
                    });
                    var count1 = Object.keys(responseJson.data.unit[i].owner)
                      .length;

                    for (var j = 0; j < count1; j++) {
                      let ownername =
                        responseJson.data.unit[i].owner[j].uofName;
                      let unitname = responseJson.data.unit[i].unUniName;
                      let unitid = responseJson.data.unit[i].unUnitID;
                      let uoMobile =
                        responseJson.data.unit[i].owner[j].uoMobile;
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
                      let tenantname =
                        responseJson.data.unit[i].tenant[k].utfName;
                      let unitname = responseJson.data.unit[i].unUniName;

                      Residentlist.push({
                        name: tenantname,
                        unit: unitname,
                        role: "Tenant"
                      });
                    }
                  }

                  for (var j = 0; j < sold_data.length; j++) {
                    if (
                      sold_data[j].value == "Sold Owner Occupied Unit" ||
                      sold_data[j].value == "Sold Tenant Occupied Unit" ||
                      sold_data[j].value == "Sold Vacant Unit"
                    ) {
                      sold1 = sold1 + 1;
                    } else if (
                      sold_data[j].value == "Unsold Vacant Unit" ||
                      sold_data[j].value == "Unsold Tenant Occupied Unit"
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

                  // responseJson.data.unit.map((data, index) => {
                  //   // console.log(data);
                  //   units.push({
                  //     value: data.unUniName,
                  //     name: data.unUniName,
                  //     unitId: data.unUnitID,
                  //     id: index
                  //   });
                  // });

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

                  let newResidents = _.union(
                    newResidentOwner,
                    newResidentTenant
                  );

                  // console.log("filetred", filteredUnits);

                  dispatch({
                    type: DASHBOARD_UNITS,
                    payload: selUnits,
                    association: res.data.data.memberListByAccount
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
          })
          .catch(() => {});
      });
  };
};

export const getAssoMembers = (oyeURL, id) => {
  return dispatch => {
    axios
      .get(
        `http://${oyeURL}/oyeliving/api/v1/Member/GetMemberListByAccountID/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
          }
        }
      )
      .then(response => {
        let resData = response.data.data.memberListByAccount;
        dispatch({
          type: GET_MEMBERLIST_SUCCESS,
          payload: resData
        });
      })
      .catch(error => {
        dispatch({
          type: GET_MEMBERLIST_FAILED
        });
      });
  };
};

export const updateDropDownIndex = index => {
  return dispatch => {
    dispatch({
      type: UPDATE_DROPDOWN_INDEX,
      payload: index
    });
  };
};
