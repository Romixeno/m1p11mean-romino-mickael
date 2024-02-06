import mongoose from 'mongoose'
const Schema = mongoose.Schema

const preferenceSchema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    servicePreferences: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    employeePreferences: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
});

const Preference = mongoose.model('Preference', preferenceSchema);

export default Preference;