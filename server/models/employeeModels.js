import mongoose from "mongoose";
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  specialty: {
    type: String,
    ref: "ServiceType",
    required: true,
  },
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
  phoneNumber: {
    type: String,
    required: true,
  },

  workingHours: [
    {
      dayOfWeek: {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        required: true,
      },
      start: {
        type: String,
        required: true,
      },
      end: {
        type: String,
        required: true,
      },
    },
  ],
  commission: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  userType: {
    type: String,
    default: "Employee",
  },
  about: {
    type: String,
    
  }
});

const Employer = mongoose.model("Employee", employeeSchema);
export default Employer;
