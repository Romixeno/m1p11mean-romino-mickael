import mongoose from "mongoose";

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    employee: { type: Schema.Types.ObjectId, ref: 'Employee' },
    service: { type: Schema.Types.ObjectId, ref: 'Service' },
    date: {
        type: Date,
        required: true
    },
    state:{
        type:Boolean
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment
