import Preference from "../models/preferenceModels.js";
import Client from "../models/clientModels.js";
import mongoose from "mongoose";

// Fonction pour créer des préférences pour un client
export const createPreference = async (req, res) => {
  try {
    const { client, servicePreferences, employeePreferences } = req.body;

    // Générer un nouvel ID
    const newPreferenceId = mongoose.Types.ObjectId();

    const newPreference = new Preference({
      _id: newPreferenceId,
      client,
      servicePreferences,
      employeePreferences,
    });

    const savedPreference = await newPreference.save();

    res.status(201).json(savedPreference);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//  récupérer les préférences d'un client
export const getPreferenceByClient = async (req, res) => {
  try {
    const { _clientId } = req.params;

    if (!_clientId) {
      return res.status(400).json({ error: "Client ID is required" });
    }

    const preference = await Preference.findOne({ client: _clientId });

    if (!preference) {
      return res
        .status(404)
        .json({ message: "Preference not found for the client" });
    }

    res.status(200).json(preference);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fonction pour mettre à jour les préférences d'un client
export const updatePreferenceByClient = async (req, res) => {
  try {
    const { _clientId } = req.params;
    const { servicePreferences, employeePreferences } = req.body;

    if (!clientId || typeof clientId !== "string") {
      return res.status(400).json({ error: "Invalid client ID" });
    }
    //a verifier
    const updatedPreference = await Preference.findOneAndUpdate(
      { client: _clientId },
      { servicePreferences, employeePreferences },
      { new: true }
    );
    if (!updatedPreference) {
      return res
        .status(404)
        .json({ error: "Preference not found for the client" });
    }

    res.status(200).json(updatedPreference);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//  supprimer les préférences d'un client
export const deletePreferenceByClient = async (req, res) => {
  try {
    const { clientId } = req.params;

    await Preference.findOneAndDelete({ client: clientId });

    res.status(200).json({ message: "Preference deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getClientPreferencePopulated = async (req, res) => {
  try {
    const clientId = req.params._clientId;

    const clientPreference = await Client.findById(clientId).populate([
      {
        path: "preferences.favoriteService",
      },
      {
        path: "preferences.favoriteEmployee",
      },
    ]);

    if (!clientPreference) {
      return res.status(404).send("Client not found");
    }
    let { preferences } = clientPreference;
    return res.status(200).json(preferences);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
