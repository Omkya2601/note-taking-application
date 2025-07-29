import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import './utils/googleAuth';

import authRoutes from './routes/auth';
import noteRoutes from './routes/notes';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

mongoose.connect(process.env.MONGO_URI || '')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('DB error:', err));

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
