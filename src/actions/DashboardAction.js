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
  UPDATE_ID_DASHBOARD,
  UPDATE_DROPDOWN_INDEX,
  UPDATE_SELECTED_DROPDOWN
} from "./types";
import axios from "axios";
import _ from "lodash";
import base from "../base";

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
          let associations = responseJson.data.memberListByAccount;

          console.log(associations, "associations");

          let associationIds = [];
          let drop_down_data = [];

          associations.map((data, index) => {
            drop_down_data.push({
              value: data.asAsnName,
              name: data.asAsnName,
              id: index,
              associationId: `${data.asAssnID}`,
              memberId: data.meMemID,
              roleId: data.mrmRoleID
            });
            associationIds.push({
              id: data.asAssnID
            });
          });

          let withoutString = [];

          drop_down_data.map((data, index) => {
            if (data.name.length >= 1) {
              withoutString.push({ ...data });
            }
          });

          let removeDuplicates = _.uniqBy(withoutString, "associationId");

          dispatch({
            type: DASHBOARD_ASSOCIATION,
            payload: {
              dropdown:removeDuplicates.sort(
                  base.utils.validate.compareAssociationNames
              ),
              associationid: associationIds
            }
          });

          if (removeDuplicates.length > 0) {
            dispatch({
              type: UPDATE_SELECTED_DROPDOWN,
              payload: {
                prop: "selectedDropdown",
                value: removeDuplicates[0].value
              }
            });

            getDashUnits_s = (unit, oyeURL, accountId) => {
              console.log('Data to get the units', unit, oyeURL, accountId)
              dispatch({ type: DASHBOARD_UNITS_START });

              axios
                .get(
                  // `http://${oyeURL}/oyeliving/api/v1/Member/GetMemUniOwnerTenantListByAssoc/${unit}`,
                  `http://${oyeURL}/oyeliving/api/v1/Unit/GetUnitListByAccountIDAndAssocID/${accountId}/${unit}`,
                  {
                    headers: {
                      "Content-Type": "application/json",
                      "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
                    }
                  }
                )
                .then(resUnits => {
                  console.log("Response in Get Units",resUnits)
                  let responseDataUnits = resUnits.data.data;

                  let units = [];

                  responseDataUnits.unit.map((data, index) => {
                    units.push({
                      value: data.unUniName,
                      name: data.unUniName,
                      unitId: data.unUnitID,
                      id: index
                    });
                  });

                  let withoutString_units = [];

                  units.map((data, index) => {
                    if (data.name.length >= 1) {
                      withoutString_units.push({
                        ...data
                      });
                    }
                  });

                  if (withoutString_units.length > 0) {
                    dispatch({
                      type: UPDATE_SELECTED_DROPDOWN,
                      payload: {
                        prop: "selectedDropdown1",
                        value: withoutString_units[0].value
                      }
                    });
                  }

                  dispatch({
                    type: DASHBOARD_UNITS,
                    payload: [...withoutString_units],
                    association: unit
                  });

                  axios
                    .get(
                      `http://${oyeURL}/oyeliving/api/v1/Member/GetMemUniOwnerTenantListByAssoc/${unit}`,
                      {
                        headers: {
                          "Content-Type": "application/json",
                          "X-Champ-APIKey":
                            "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
                        }
                      }
                    )
                    .then(res1 => {
                      let responseData = res1.data.data;
                      let unitOwner = responseData.unitOwner;
                      let unitTenant = responseData.unitTenant;
                      let residents = _.union(unitOwner, unitTenant);

                      fetch(
                        `http://${oyeURL}/oyeliving/api/v1/Unit/GetUnitListByAssocID/${unit}`,
                        {
                          method: "GET",
                          headers: {
                            "Content-Type": "application/json",
                            "X-Champ-APIKey":
                              "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
                          }
                        }
                      )
                        .then(res => res.json())
                        .then(responseJson => {
                          if (responseJson.success) {
                            let count = Object.keys(responseJson.data.unit)
                              .length;

                            let Residentlist = [];

                            for (var i = 0; i < count; i++) {
                              var count1 = Object.keys(
                                responseJson.data.unit[i].owner
                              ).length;

                              for (var j = 0; j < count1; j++) {
                                let ownername =
                                  responseJson.data.unit[i].owner[j].uofName;
                                let unitname =
                                  responseJson.data.unit[i].unUniName;
                                let unitid = responseJson.data.unit[i].unUnitID;
                                let uoMobile =
                                  responseJson.data.unit[i].owner[j].uoMobile;
                                let admin =
                                  responseJson.data.unit[i].owner[j].acAccntID;

                                Residentlist.push({
                                  name: ownername,
                                  unit: unitname,
                                  role: "Owner",
                                  unitid: unitid,
                                  uoMobile: uoMobile,
                                  admin: admin
                                });
                              }

                              var count2 = Object.keys(
                                responseJson.data.unit[i].tenant
                              ).length;

                              for (var k = 0; k < count2; k++) {
                                let tenantname =
                                  responseJson.data.unit[i].tenant[k].utfName;
                                let unitname =
                                  responseJson.data.unit[i].unUniName;

                                Residentlist.push({
                                  name: tenantname,
                                  unit: unitname,
                                  role: "Tenant"
                                });
                              }
                            }

                            let residentListOwner = [];
                            let residentListTenant = [];

                            Residentlist.map((val, i) => {
                              if (val.role === "Owner") {
                                residentListOwner.push({
                                  ...val
                                });
                              } else {
                                residentListTenant.push({
                                  ...val
                                });
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

                            dispatch({
                              type: DASHBOARD_RESIDENT_LIST,
                              payload: newResidents
                            });
                          } else {
                            dispatch({
                              type: DASHBOARD_UNITS_STOP
                            });
                          }

                          console.log(responseJson, "responseJson");
                        })
                        .catch(error => {
                          console.log(error, "error in get units action");
                          dispatch({
                            type: DASHBOARD_UNITS_STOP
                          });
                        });
                    })
                    .catch(error => {
                      console.log(error, "error while fetching");
                    });
                })
                .catch(error => {
                  console.log(error, "error while fetching units");
                });
            };

            getDashUnits_s(
              removeDuplicates[0].associationId,
              oyeURL,
              MyAccountID
            );
          }
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
        console.log(error, "error while fetching associations in action");
      });
  };
};

export const getDashUnits = (unit, oyeURL, MyAccountID) => {
  console.log(unit, "Unittts");
  return dispatch => {
    dispatch({ type: DASHBOARD_UNITS_START });

    axios
      .get(
        `http://${oyeURL}/oyeliving/api/v1/Unit/GetUnitListByAccountIDAndAssocID/${MyAccountID}/${unit}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
          }
        }
      )
      .then(response => {
        console.log('response in Units by My Account Id',response)
        let responseData = response.data.data;

        let units = [];

        responseData.unit.map((data, index) => {
          // console.log(data, "data");
          units.push({
            value: data.unUniName,
            name: data.unUniName,
            unitId: data.unUnitID,
            id: index
          });
        });

        let withoutString = [];

        units.map((data, index) => {
          if (data.name.length >= 1) {
            withoutString.push({ ...data });
          }
        });

        if (withoutString.length > 0) {
          dispatch({
            type: UPDATE_SELECTED_DROPDOWN,
            payload: {
              prop: "selectedDropdown1",
              value: withoutString[0].value
            }
          });
        }

        dispatch({
          type: DASHBOARD_UNITS,
          payload: [...withoutString],
          association: unit
        });

        console.log(responseData, "responseDatas");

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
          .then(res1 => {
            let responseData = res1.data.data;
            let unitOwner = responseData.unitOwner;
            let unitTenant = responseData.unitTenant;
            let residents = _.union(unitOwner, unitTenant);
            let Residentlist = [];

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
              .then(res => res.json())
              .then(responseJson => {

                if (responseJson.success) {
                  let count = Object.keys(responseJson.data.unit).length;

                  Residentlist = [];

                  for (var i = 0; i < count; i++) {
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

                  let residentListOwner = [];
                  let residentListTenant = [];

                  Residentlist.map((val, i) => {
                    if (val.role === "Owner") {
                      residentListOwner.push({ ...val });
                    } else {
                      residentListTenant.push({ ...val });
                    }
                  });

                  console.log(units, "units");
                  console.log(Residentlist, "Residentlist");

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

                  dispatch({
                    type: DASHBOARD_RESIDENT_LIST,
                    payload: newResidents
                  });
                } else {
                  dispatch({ type: DASHBOARD_UNITS_STOP });
                }

                console.log(responseJson, "responseJson");
              })
              .catch(error => {
                console.log(error, "error in get units action");
                dispatch({ type: DASHBOARD_UNITS_STOP });
              });
          })
          .catch(error => {
            console.log(error, "error while fetching");
          });
      })
      .catch(error => {
        console.log(error, "error while fetching units");
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

        resData.map((data, index) => {
          console.log(data.meJoinStat + index);
        });
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

export const updateIdDashboard = ({ prop, value }) => {
  return dispatch => {
    console.log("DASHBOARDAction", prop, value);
    dispatch({
      type: UPDATE_ID_DASHBOARD,
      payload: { prop, value }
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

export const updateSelectedDropDown = ({ prop, value }) => {
  return dispatch => {
    dispatch({ type: UPDATE_SELECTED_DROPDOWN, payload: { prop, value } });
  };
};
