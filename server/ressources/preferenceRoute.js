import { Router } from "express";
import {
  createPreference,
  deletePreferenceByClient,
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
  .patch("/updatePreference/:_clientId", getPreferenceByClient)
  .delete("/deletePreference/:clientId", deletePreferenceByClient);
