import express, { Request, Response } from 'express';
import connectDB from './services/db';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin'
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Define a single route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, this is your basic REST API!');
});

// Use auth routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
