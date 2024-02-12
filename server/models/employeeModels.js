import mongoose from "mongoose";
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    lastname: {
        type: String,
        required: true
    },
    numberPhone: {
        type: Number,
        required: true
    },

    workingHours: {
        type: String,
        required: true
    },
    commissionPercentage: {
        type: Number,
        required: false
    },
    image: {
        type: String,
        require: false
    },
});

const Employer = mongoose.model('Employee', employeeSchema);
export default Employer
