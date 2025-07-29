import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { sendOtp } from '../utils/otp';
import passport from 'passport';

const router = express.Router();

router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  let user = await User.findOne({ email });
  if (!user) user = await User.create({ email });
  user.otp = otp;
  await user.save();

  await sendOtp(email, otp);
  res.json({ message: 'OTP sent to email' });
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || '', { expiresIn: '1d' });
  res.json({ token });
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req: any, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET || '', { expiresIn: '1d' });
    res.redirect(`http://localhost:3000?token=${token}`);
  });

export default router;
