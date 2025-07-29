import express from 'express';
import jwt from 'jsonwebtoken';
import Note from '../models/Note';

const router = express.Router();

const auth = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as any;
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(403).json({ message: 'Invalid token' });
  }
};

router.get('/', auth, async (req, res) => {
  const notes = await Note.find({ userId: req.user });
  res.json(notes);
});

router.post('/', auth, async (req, res) => {
  const note = await Note.create({ userId: req.user, content: req.body.content });
  res.json(note);
});

router.delete('/:id', auth, async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, userId: req.user });
  res.json({ message: 'Note deleted' });
});

export default router;
