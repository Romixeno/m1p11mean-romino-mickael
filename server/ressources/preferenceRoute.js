import { Router } from "express";
import { createPreference,deletePreferenceByClient,getPreferenceByClient } from "../controllers/preferenceController.js";
export default Router()
    .post('/addPreference',createPreference)
    .get('/onePreference/:clientId',getPreferenceByClient)
    .patch('/updatePreference/:clientId',getPreferenceByClient) 
    .delete('/deletePreference/:clientId',deletePreferenceByClient) 