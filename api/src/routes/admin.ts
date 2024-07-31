import { Router, Request, Response } from 'express';
import User from '../models/User';
import { adminMiddleware, authMiddleware } from '../services/adminAuth';
import bcrypt from 'bcryptjs';

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

// Add a new user
router.post('/users', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { username, password, isAdmin } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const newUser = new User({
      username,
      password: await bcrypt.hash(password, 10), // Hash the password before saving
      isAdmin
    });

    const savedUser = await newUser.save();
    const { password: _, ...userWithoutPassword } = savedUser.toObject(); // Exclude password from response
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).send('Server error');
  }
});

// Delete a user
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Server error');
  }
});

// Update a user
router.put('/users/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, password, isAdmin } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const updateData: { [key: string]: any } = {};
    if (username) updateData.username = username;
    if (isAdmin !== undefined) updateData.isAdmin = isAdmin;
    if (password) updateData.password = await bcrypt.hash(password, 10); // Hash the new password

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Server error');
  }
});

export default router;
