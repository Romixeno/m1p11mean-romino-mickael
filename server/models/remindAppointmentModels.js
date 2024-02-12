import mongoose from "mongoose";

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({

    _clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
    _employeeId: { type: Schema.Types.ObjectId, ref: 'Employee' },
    _serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },

    date: {
        type: Date,
        required: true,
    },
    // Champ pour indiquer si l'e-mail de rappel a été envoyé ou non
    sentEmail: {
        type: Boolean,
        default: false, // Par défaut, l'e-mail de rappel n'a pas encore été envoyé
    },
    
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment
