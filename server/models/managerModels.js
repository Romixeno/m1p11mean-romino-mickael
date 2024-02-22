import mongoose from "mongoose";
const Schema = mongoose.Schema;

const managerSchema = new Schema({
  // employees: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
  // services: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
  // client: [{ type: Schema.Types.ObjectId, ref: 'Client' }],
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    default: "Manager",
  },
});

const Manager = mongoose.model("Manager", managerSchema);
export default Manager;
