import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

const router = Router();

// Login route
// Login route
router.post('/login', async (req: Request, res: Response) => {
  console.log('Received login request');
  const { username, password } = req.body;
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);

  try {
    // Find user by username
    console.log('Searching for user in the database...');
    const user: IUser | null = await User.findOne({ username });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log('User found:', user);

    // Check password
    console.log('Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match: ${isMatch}`);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    console.log('Generating JWT...');
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, 'your_jwt_secret', {
      expiresIn: '1h',
    });
    console.log('JWT generated:', token);

    res.json({ token, isAdmin: user.isAdmin });
  } catch (error) {
    console.error('Error during login process:', error);
    res.status(500).send('Server error');
  }
});

// Register route
router.post('/register', async (req: Request, res: Response) => {
  console.log('Received registration request');
  const { username, password } = req.body;
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);

  try {
    // Check if user already exists
    console.log('Checking if user already exists...');
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed:', hashedPassword);

    // Create new user
    console.log('Creating new user...');
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    console.log('User created:', newUser);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during registration process:', error);
    res.status(500).send('Server error');
  }
});

export default router;
