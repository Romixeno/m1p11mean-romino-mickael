import mongoose from "mongoose";

const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  commission: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
});

const Service = mongoose.model("Service", serviceSchema);
export default Service;
