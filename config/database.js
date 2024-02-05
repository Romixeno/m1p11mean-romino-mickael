import mongoose from 'mongoose';

export const mongooseConnect = async ()=>{
    await mongoose.connect('mongodb://127.0.0.1:27017/salon_db');
}
  