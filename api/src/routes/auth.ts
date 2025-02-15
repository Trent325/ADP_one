import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import LoginRecord from '../models/LoginRecord';

const router = Router();

// Login route
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user: IUser | null = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, 'your_jwt_secret', {
      expiresIn: '1h',
    });

    // Record the login
    const loginRecord = new LoginRecord({ userId: user._id, username: user.username });
    await loginRecord.save();

    res.json({ token, isAdmin: user.isAdmin });
  } catch (error) {
    console.error('Error during login process:', error);
    res.status(500).send('Server error');
  }
});

// Register route
router.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during registration process:', error);
    res.status(500).send('Server error');
  }
});

router.get('/logins', async (req: Request, res: Response) => {
  try {
    const loginRecords = await LoginRecord.find().sort({ loginTime: -1 }); // Sort by loginTime in descending order
    res.json(loginRecords);
  } catch (error) {
    console.error('Error fetching login records:', error);
    res.status(500).send('Server error');
  }
});

export default router;
