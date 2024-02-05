import mongoose from 'mongoose'
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    numberPhone: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ['Client', 'Employee', 'Manager'],
      default: 'Client',
      required: true,
    },
  });
  
  const User = mongoose.model('User', userSchema);
  
  export default User 