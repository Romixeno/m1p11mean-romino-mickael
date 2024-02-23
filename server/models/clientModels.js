import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Modèle pour le client

const clientSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  appointments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  preferences: {
    favoriteService: { type: Schema.Types.ObjectId, ref: "Service" },
    favoriteEmployee: { type: Schema.Types.ObjectId, ref: "Employee" },
  },
  specialOffersNotification: { type: Boolean, default: true },
  userType: {
    type: String,
    default: "Client",
  },
});
const Client = mongoose.model("Client", clientSchema);
export default Client;
