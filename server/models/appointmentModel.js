import mongoose from "mongoose";

const Schema = mongoose.Schema;

const appointmentSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
  },
  services: [
    {
      serviceType: {
        type: mongoose.Schema.Types.ObjectId,
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
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
