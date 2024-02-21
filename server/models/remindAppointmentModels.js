import mongoose from "mongoose";

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({

    _clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
    _employeeId: { type: Schema.Types.ObjectId, ref: 'Employee' },
    _serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },

    startTime: {
        type:Date
    },
    endTime: {
        type:Date
    },
    date: {
        type: Date,
        required: true,
    },
    
    sentEmail: {
        type: Boolean,
        default: false, 
    },
    
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment
