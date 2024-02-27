import mongoose from "mongoose";

const Schema = mongoose.Schema;

// const paymentSchema = new mongoose.Schema({
//     client: { type: Schema.Types.ObjectId, ref: 'Client' },
//     service: {
//         type: String,
//         required: true,
//     },
//     amount: {
//         type: Number,
//         required: true,
//     },
//     state: {
//         type: Boolean,
//         default: false,
//     },
//     paymentDate: {
//         type: Date,
//         default: Date.now,
//     },
// });
const paymentSchema = new mongoose.Schema({
  client: { type: Schema.Types.ObjectId, ref: "Client" },
  transactionId: {
    type: String,
    unique: true,
    required: true,
  },
  appointmentId: {
    type: Schema.Types.ObjectId,
    ref: "AppointmentV2",
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "completed",
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
