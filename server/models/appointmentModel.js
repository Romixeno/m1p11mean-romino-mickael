import mongoose from "mongoose";

const Schema = mongoose.Schema;

const appointmentSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  services: [
    {
      serviceType: {
        type: String,
        ref: "ServiceType",
      },
      employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
      serviceIds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
        },
      ],
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  totalDuration: {
    type: Number,
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AppointmentModel = mongoose.model("AppointmentV2", appointmentSchema);
export default AppointmentModel;
