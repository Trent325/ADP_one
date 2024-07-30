import { Router, Request, Response } from 'express';
import User from '../models/User';
import { adminMiddleware, authMiddleware } from '../services/adminAuth';

const router = Router();

router.get('/users', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password from response
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Server error');
  }
});

export default router;
