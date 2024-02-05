import mongoose from "mongoose";
const Schema = mongoose.Schema;

const managerSchema = new Schema({

    employees: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
    services: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    client: [{ type: Schema.Types.ObjectId, ref: 'Client' }],
  });

const Manager = mongoose.model('Manager', managerSchema);
export default Manager