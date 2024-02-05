import mongoose from "mongoose";
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true
    },
    numberPhone:{
        type:Number,
        required:true
    },
    appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }],
    workingHours: {
        type: String,
        required: false
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
