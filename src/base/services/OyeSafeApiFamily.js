import axios from "axios"
import React from "react"
import utils from "../utils"

let instance = axios.create({
  baseURL: utils.strings.oyeSafeUrlFamily,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "X-OYE247-APIKey": utils.strings.oyeSafeApiKey
  }
})

instance.interceptors.response.use(
  response => {
    /**
     * Uncomment below line only for debugging complete response
     */

    utils.logger.logArgs(response)

    /**
     * Handle the success response here.
     */
    return response.data
  },
  error => {
    utils.logger.logArgs(error)
    return null
  }
)

export default class OyeSafeApiFamily {
  static async myFamilyList(associationId, userId) {
    console.log("MyFamilyMessage");
    return await instance.get("GetFamilyMemberListByAssocAndUnitID/" + associationId + "/" + userId)
  }

  static async myFamilyAddMember(input) {
    console.log("MyFamily add member", input)
    return await instance.post("FamilyMember/create", input)
  }

  static async myFamilyEditMember(input) {
    console.log("My Family edit member", input)
    return await instance.post("FamilyMemberDetails/update", input)
  }

  
}

