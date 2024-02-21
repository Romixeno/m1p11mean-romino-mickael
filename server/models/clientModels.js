import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Modèle pour le client

const clientSchema = new Schema({
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
    image: { 
        type : String ,
        required : false
    },
    appointments: [{
        type: Schema.Types.ObjectId, ref: 'Appointment',
    }],
    preferences: {
        favoriteService: { type: Schema.Types.ObjectId, ref: 'Service' },
        favoriteEmployee: { type: Schema.Types.ObjectId, ref: 'Employee' },
    },
    specialOffersNotification: { type: Boolean, default: true },
});
const Client = mongoose.model('Client', clientSchema);
export default Client


