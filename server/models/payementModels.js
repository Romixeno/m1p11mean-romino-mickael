import mongoose from "mongoose";

const Schema = mongoose.Schema;

const paymentSchema = new mongoose.Schema({
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    service: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    state: {
        type: Boolean,
        default: false,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;