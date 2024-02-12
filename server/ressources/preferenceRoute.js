import { Router } from "express";
import { createPreference,deletePreferenceByClient,getPreferenceByClient } from "../controllers/preferenceController.js";
export default Router()
    .post('/addPreference',createPreference)
    .get('/onePreference/:_clientId',getPreferenceByClient)
    .patch('/updatePreference/:_clientId',getPreferenceByClient) 
    .delete('/deletePreference/:clientId',deletePreferenceByClient) 