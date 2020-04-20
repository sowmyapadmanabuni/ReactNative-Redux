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
  UPDATE_SELECTED_DROPDOWN,
  DASHBOARD_NO_UNITS,
  UPDATE_USER_INFO,
  USER_ROLE,
  DASHBOARD_ASSOCIATION_SYNC,
  IS_NOTIFICATION,
  IS_SOS
} from './types';
import axios from 'axios';
import _ from 'lodash';
import base from '../base';
import firebase from 'react-native-firebase'


export const getDashAssoSync = (
  oyeURL,
  MyAccountID,
  selectedAsso,
  selectedUnit
) => {
  return dispatch => {
    const getUnits = (unit, oyeURL, MyAccountID) => {
      // dispatch({ type: DASHBOARD_UNITS_START });
      console.log('called from sync');
      axios
        .get(
          `http://${oyeURL}/oyeliving/api/v1/Member/GetMemberByAccountID/${MyAccountID}/${unit}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1'
            }
          }
        )
        .then(response => {
          console.log('response in Units by My Account Id', response);
          let responseData = response.data.data;

          let units = [];

          responseData.memberListByAccount.map((data, index) => {
            // console.log(data, "data");
            units.push({
              value: data.unUniName,
              name: data.unUniName,
              unitId: data.unUnitID,
              id: index
            });
          });

          let sortedUnit = _.sortBy(units, ['value'], ['asc']);

          console.log('Sorted Unit:', sortedUnit);

          let withoutString = [];

          sortedUnit.map((data, index) => {
            if (data.name.length >= 1) {
              withoutString.push({ ...data });
            }
          });

          if (selectedUnit !== withoutString[0].value) {
            if (withoutString.length > 0) {
              dispatch({
                type: UPDATE_SELECTED_DROPDOWN,
                payload: {
                  prop: 'selectedDropdown1',
                  value: withoutString[0].value
                }
              });

              dispatch({
                type: UPDATE_SELECTED_DROPDOWN,
                payload: {
                  prop: 'uniID',
                  value: withoutString[0].unitId
                }
              });
            }
          }

          dispatch({
            type: DASHBOARD_UNITS,
            payload: [...withoutString],
            association: unit
          });
        })
        .catch(error => {
          console.log(error, 'error while fetching units');
        });
    };

    fetch(
      `http://${oyeURL}/oyeliving/api/v1/Member/GetMemberListByAccountID//${MyAccountID}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1'
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log('GET THE REPSONSE',responseJson)
        if (responseJson.success) {
          let associations = responseJson.data.memberListByAccount;

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

          let removeDuplicates = _.uniqBy(withoutString, 'associationId');

          let sorted = removeDuplicates.sort(
            base.utils.validate.compareAssociationNames
          );

          dispatch({
            type: DASHBOARD_ASSOCIATION_SYNC,
            payload: {
              dropdown: removeDuplicates.sort(
                base.utils.validate.compareAssociationNames
              ),
              associationid: associationIds
            }
          });

          console.log('sorted asso', sorted);

          if (sorted.length === 1) {
            dispatch({
              type: UPDATE_SELECTED_DROPDOWN,
              payload: {
                prop: 'selectedDropdown',
                value: sorted[0].value
              }
            });

            getUnits(sorted[0].associationId, oyeURL, MyAccountID);
          }
        } else {
          dispatch({
            type: DASHBOARD_ASSOCIATION_SYNC,
            payload: {
              dropdown: [],
              associationid: []
            }
          });

          dispatch({
            type: UPDATE_SELECTED_DROPDOWN,
            payload: {
              prop: 'selectedDropdown',
              value: ''
            }
          });

          dispatch({
            type: UPDATE_SELECTED_DROPDOWN,
            payload: {
              prop: 'selectedDropdown1',
              value: ''
            }
          });
        }
      });
  };
};

export const getDashSub = (oyeURL, SelectedAssociationID) => {
  return dispatch => {
    console.log('oyeURL', oyeURL);
    fetch(
      `http://${oyeURL}/oyesafe/api/v1/Subscription/GetLatestSubscriptionByAssocID/${SelectedAssociationID}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
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
  console.log("getDashAssociation_ACTI",`http://${oyeURL}/oyeliving/api/v1/Member/GetMemberListByAccountID//${MyAccountID}`)
  return dispatch => {
    //  ("http://apidev.oyespace.com/oyeliving/api/v1/Member/GetMemberListByAccountID/1");
    fetch(
      `https://${oyeURL}/oyeliving/api/v1/Member/GetMemberListByAccountID/${MyAccountID}/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1'
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          console.log("Association in Dashboard:",)
          let associations = responseJson.data.memberListByAccount;

          console.log("Association in Dashboard:",responseJson);
          let associationIds = [];
          let drop_down_data = [];

          associations.map((data, index) => {
            drop_down_data.push({
              value: data.asAsnName,
              name: data.asAsnName,
              id: index,
              associationId: `${data.asAssnID}`,
              memberId: data.meMemID,
              roleId: data.mrmRoleID,
              raw:data
            });
            associationIds.push({
              id: data.asAssnID
            });
          });


          let assnList = _.filter(associations, item => item.unUniName != "");
          console.log("ASSNIST_II",assnList)
          firebase.messaging().hasPermission().
    then((enabled) => {
      console.log("FCM_PERMI",enabled)
        if (enabled) {
            messaging.getToken()
                .then(token => { console.log("FCMTOKE::",token) })
                .catch(error => { console.log("FCMTOKE::",error)  });
        } else {
            messaging.requestPermission()
                .then(() => { console.log("FCMTOKE::GOTPERMISSION")  })
                .catch(error => { console.log("FCMTOKE::NOPERMISSION") });
        }
    })
    .catch(error => { console.log("FCMTOKE::NOPERMISSION_CATCH") });



          let withoutString = [];

          drop_down_data.map((data, index) => {
            if (data.name.length >= 1) {
              withoutString.push({ ...data });
            }
          });

          let removeDuplicates = _.uniqBy(withoutString, 'associationId');

          let sorted = removeDuplicates.sort(
            base.utils.validate.compareAssociationNames
          );

          console.log(sorted, 'dttttt');
          dispatch({
            type: DASHBOARD_ASSOCIATION,
            payload: {
              dropdown: sorted,
              allAssociations:associations,
              associationid: associationIds
            }
          });

          if (sorted.length > 0) {
            dispatch({
              type: USER_ROLE,
              payload: { prop: 'role', value: sorted[0].roleId }
            });

            dispatch({
              type: UPDATE_SELECTED_DROPDOWN,
              payload: {
                prop: 'selectedDropdown',
                value: sorted[0].value
              }
            });

            dispatch({
              type: UPDATE_SELECTED_DROPDOWN,
              payload: {
                prop: 'assId',
                value: sorted[0].associationId
              }
            });

            let filterAssociations = [];

            getDashUnits_s = (
              unit,
              oyeURL,
              accountId,
              associations,
              allData,
              index
            ) => {
              if (index === 0) {
                console.log('Data to get the units', unit, oyeURL, accountId);
                dispatch({ type: DASHBOARD_UNITS_START });

                axios
                  .get(
                    `http://${oyeURL}/oyeliving/api/v1/Member/GetMemberByAccountID/${accountId}/${unit}`,
                    {
                      headers: {
                        'Content-Type': 'application/json',
                        'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1'
                      }
                    }
                  )
                  .then(resUnits => {
                    console.log('Response in Get Units', resUnits);
                    let responseDataUnits = resUnits.data.data;

                    let units = [];

                    responseDataUnits.memberListByAccount.map((data, index) => {
                      units.push({
                        value: data.unUniName,
                        name: data.unUniName,
                        unitId: data.unUnitID,
                        id: index,
                        myRoleId: data.mrmRoleID,
                        raw:data
                      });
                    });

                    console.log('unitshshs', units);

                    let withoutString_units = [];

                    let sortedUnits = _.sortBy(units, ['value'], ['asc']);

                    sortedUnits.map((data, index) => {
                      if (data.name.length >= 1) {
                        withoutString_units.push({
                          ...data
                        });
                      }
                    });

                    console.log(withoutString_units, 'withoutString_units');

                    if (withoutString_units.length > 0) {
                      filterAssociations.push({ ...associations });

                      // dispatch({
                      //   type: DASHBOARD_NO_UNITS,
                      //   payload: filterAssociations
                      // });

                      if (allData[0]) {
                        dispatch({
                          type: UPDATE_SELECTED_DROPDOWN,
                          payload: {
                            prop: 'selectedDropdown1',
                            value: withoutString_units[0].value
                          }
                        });

                        dispatch({
                          type: UPDATE_SELECTED_DROPDOWN,
                          payload: {
                            prop: 'uniID',
                            value: withoutString_units[0].unitId
                          }
                        });
                      }
                    }

                    dispatch({
                      type: DASHBOARD_UNITS,
                      payload: [...withoutString_units],
                      association: unit
                    });
                  })
                  .catch(error => {
                    console.log(error, 'error while fetching units');
                  });
              }
            };

            sorted.map((data, index, allData) => {
              console.log(
                sorted[index].associationId,
                index,
                allData,
                'mapped'
              );
              getDashUnits_s(
                sorted[index].associationId,
                oyeURL,
                MyAccountID,
                sorted[index],
                allData,
                index
              );
            });
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
        console.log(error, 'error while fetching associations in action');
      });
  };
};

export const getDashUnits = (
  unit,
  oyeURL,
  MyAccountID,
  associations,
  selectedAssociation,
  allUnits
) => {
  return dispatch => {
    dispatch({ type: DASHBOARD_UNITS_START });
    console.log('called from sync');
    console.log('DASH_UNITS_ACTI',`http://${oyeURL}/oyeliving/api/v1/Member/GetMemberByAccountID/${MyAccountID}/${unit}`)
    axios
      .get(
        `http://${oyeURL}/oyeliving/api/v1/Member/GetMemberByAccountID/${MyAccountID}/${unit}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1'
          }
        }
      )
      .then(response => {
        console.log('response in Units by My Account Id', response);
        let responseData = response.data.data;

        let units = [];

        responseData.memberListByAccount.map((data, index) => {
          // console.log(data, "data");
          units.push({
            value: data.unUniName,
            name: data.unUniName,
            unitId: data.unUnitID,
            id: index,
            myRoleId: data.mrmRoleID
          });
        });

        let sortedUnit = _.sortBy(units, ['value'], ['asc']);

        console.log('Sorted Unit:', sortedUnit);

        let withoutString = [];

        sortedUnit.map((data, index) => {
          if (data.name.length >= 1) {
            withoutString.push({ ...data });
          }
        });

        if (withoutString.length > 0) {
          dispatch({
            type: UPDATE_SELECTED_DROPDOWN,
            payload: {
              prop: 'selectedDropdown1',
              value: withoutString[0].value
            }
          });

          dispatch({
            type: UPDATE_SELECTED_DROPDOWN,
            payload: {
              prop: 'uniID',
              value: withoutString[0].unitId
            }
          });
        }

        dispatch({
          type: DASHBOARD_UNITS,
          payload: [...withoutString],
          association: unit
        });

        console.log(responseData, 'responseDatas');

        axios
          .get(
            `http://${oyeURL}/oyeliving/api/v1/Member/GetMemUniOwnerTenantListByAssoc/${unit}`,
            {
              headers: {
                'Content-Type': 'application/json',
                'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1'
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
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1'
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
                        role: 'Owner',
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
                        role: 'Tenant'
                      });
                    }
                  }

                  let residentListOwner = [];
                  let residentListTenant = [];

                  Residentlist.map((val, i) => {
                    if (val.role === 'Owner') {
                      residentListOwner.push({ ...val });
                    } else {
                      residentListTenant.push({ ...val });
                    }
                  });

                  console.log(units, 'units');
                  console.log(Residentlist, 'Residentlist');

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

                console.log(responseJson, 'responseJson');
              })
              .catch(error => {
                console.log(error, 'error in get units action');
                dispatch({ type: DASHBOARD_UNITS_STOP });
              });
          })
          .catch(error => {
            console.log(error, 'error while fetching');
          });
      })
      .catch(error => {
        console.log(error, 'error while fetching units');
      });
  };
};

export const getAssoMembers = (oyeURL, accountId,assId) => {
  return dispatch => {
    axios
      .get(
        `http://${oyeURL}/oyeliving/api/v1/Member/GetMemberByAccountID/${accountId}/${assId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1'
          }
        }
      )
      .then(response => {
        let resData = response.data.data.memberListByAccount;
        console.log('GETTHEMEMEBERLISTFORJOINREQUEST',resData,response)
        resData.map((data, index) => {
          // console.log(data.meJoinStat + index);
        });

        let removedDuplicates = _.uniqBy(resData, 'unUnitID');
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
    // console.log("DASHBOARDAction", prop, value);
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

export const updateuserRole = ({ prop, value }) => {
  return dispatch => {
    dispatch({
      type: USER_ROLE,
      payload: { prop, value }
    });
  };
};

export const updateUnitDropdown = ({value,associationId}) => {
  console.log("GettheselectedAssocitation:",value)
  return dispatch => {
    dispatch({
      type:DASHBOARD_UNITS,
      payload:value,
      associationId:associationId
    })
  }
}

export const fetchAssociationByAccountId = (oyeURL,accountId,callBack) => {
  console.log('IN New API Response>>>>>>>>>>>>>>>>>>>>>>:',oyeURL,accountId)
  return (dispatch) => {

    axios
      .get(
        `https://${oyeURL}/oyeliving/api/v1/Member/GetMemberListByAccountID/${accountId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1'
          }
        }
      )
      .then(responseJson => {
        console.log("API__&&RESP",responseJson)
        let data = responseJson.data.data.memberListByAccount;
        console.log("IN New API Response>>>>>>>>>>>>>>>>>>>>>>:1:",data)
        if(data.length !==0){
          let associationArray = [];
          let associationIdArray = [];
          for (let i in data) {
            let associationDetail = data[i].association[0];
            
            let unitArray = associationDetail.unit;
            let units = [];
  
            console.log('GET ALL THE UNITS DATA TO SEGRIGATE',unitArray)

            unitArray.map((mappedData)=>{
              units.push({
              value:mappedData.unUniName,
              name:mappedData.unUniName,
              unitId:mappedData.unUnitID,
              myRoleId:data[i].mrmRoleID,
              acUnit:mappedData
              })
            })

           
           
            
            
          //   unitArray.map((mappedData)=>{
          //     let roleId=5 ;
          //     if(mappedData.owner.length !==0){


          //       if(mappedData.owner[0].acAccntID==accountId){
          //        // console.log('GET ALL THE UNITS DATA TO SEGRIGATE111111111111',mappedData,mappedData.owner.length,mappedData.owner[0].acAccntID,accountId)

          //          roleId=mappedData.owner[0].uoRoleID
          //       }
          //     }
          // //   console.log('GET ALL THE UNITS DATA TO SEGRIGATE111111111111@@@@@@@@########',roleId)
             
          //     units.push({
          //     value:mappedData.unUniName,
          //     name:mappedData.unUniName,
          //     unitId:mappedData.unUnitID,
          //     myRoleId: roleId,
          //     })
          //   })
           // console.log('GET ALL THE UNITS DATA TO SEGRIGATE111111111111@@@@@@@@',unitArray)
         
            
           
           console.log('GET ALL THE UNITS DATA TO SEGRIGATE111111111111',units)

  
            let associationData = {
              value:associationDetail.asAsnName,
              name:associationDetail.asAsnName,
              id:i,
              associationId:associationDetail.asAssnID,
              roleId:data[i].mrmRoleID,
              unit:units
            }
  
            associationArray.push(associationData)
            associationIdArray.push({id:associationDetail.asAssnID})
          }
  
          let sortedAssociationData = associationArray.sort(base.utils.validate.compareAssociationNames);
          console.log("sortedAssociationData",sortedAssociationData)
  
            dispatch({
              type:DASHBOARD_ASSOCIATION,
              payload:{
                dropdown:sortedAssociationData,
                allAssociations:sortedAssociationData,
                associationId:associationIdArray,
                //memberList:data
              }
            })
    
            dispatch({
              type:UPDATE_SELECTED_DROPDOWN,
              payload:{
                prop:"selectedDropdown",
                value:sortedAssociationData[0].value
              }
            })
            
            dispatch({
              type:UPDATE_ID_DASHBOARD,
              payload:{
                prop:"assId",
                value:sortedAssociationData[0].associationId
              }
            })
    
          dispatch({
              type:UPDATE_SELECTED_DROPDOWN,
              payload:{
                prop:"selectedDropdown1",
                value:sortedAssociationData[0].unit.length===0 ?"":sortedAssociationData[0].unit[0].value
              }
            }); 
            
            dispatch({
              type:DASHBOARD_UNITS,
              payload:sortedAssociationData[0].unit
            })
    
            dispatch({
              type:USER_ROLE,
              payload:{
                prop:"role",
                value:sortedAssociationData[0].unit.length===0 ?5:sortedAssociationData[0].roleId
              }
            })
    
            dispatch({
              type:UPDATE_ID_DASHBOARD,
              payload:{
                prop:"roleId",
                value:sortedAssociationData[0].unit.length===0 ?5:sortedAssociationData[0].roleId
              }
            })
    
             dispatch({
              type:UPDATE_ID_DASHBOARD,
              payload:{
                prop:"uniID",
                value:sortedAssociationData[0].unit.length===0 ?"":sortedAssociationData[0].unit[0].unitId
              }
            })
            callBack(true);
        }
        else{
          callBack(false);
          dispatch({
            type:DASHBOARD_ASSOC_STOP
          });
        }
        
          

          })
      .catch(error => {
        dispatch({
          type:DASHBOARD_ASSOC_STOP
        });
        callBack(false);
        console.log(error);
      })
  }
};


export const updateNotificationData = (payload) => {
  return (dispatch) => {
    dispatch({
      type:IS_NOTIFICATION,
      payload:payload
    })
  }
}


export const updateSOS = (payload) => {
  return (dispatch) => {
    dispatch({
      type:IS_SOS,
      payload:payload
    })
  }
}


// value: data.asAsnName,
// name: data.asAsnName,
// id: index,
// associationId: `${data.asAssnID}`,
// memberId: data.meMemID,
// roleId: data.mrmRoleID,
// raw:data