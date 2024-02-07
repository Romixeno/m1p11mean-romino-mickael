import mongoose from "mongoose";
const Schema = mongoose.Schema;

const taskSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    commissionPercentage: {
        type: Number,
        required: true
    }
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
