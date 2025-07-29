import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: String,
  googleId: String,
  otp: String,
});

export default mongoose.model('User', userSchema);
