import mongoose from "mongoose";

const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    commission: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', default: null },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
});

const Service = mongoose.model('Service', serviceSchema);
export default Service