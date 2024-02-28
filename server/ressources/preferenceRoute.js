import { Router } from "express";
import {
  createPreference,
  deletePreferenceByClient,
  getClientPreferencePopulated,
  getPreferenceByClient,
} from "../controllers/preferenceController.js";
import {
  addRemoveEmployeePreference,
  addRemoveServicePreference,
  getClientPreference,
} from "../controllers/clientController.js";
export default Router()
  .post("/addPreference", createPreference)
  .post("/addRemoveEmployeePreference/:_clientId", addRemoveEmployeePreference)
  .post("/addRemoveServicePreference/:_clientId", addRemoveServicePreference)
  .get("/onePreference/:_clientId", getPreferenceByClient)
  .get("/preferences/:_clientId", getClientPreference)
  .get("/preferencesPopulated/:_clientId", getClientPreferencePopulated)
  .patch("/updatePreference/:_clientId", getPreferenceByClient)
  .delete("/deletePreference/:clientId", deletePreferenceByClient);
