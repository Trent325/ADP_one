import request from 'supertest';
import express from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import authRoutes from '../src/routes/auth';
import User from '../src/models/User';
import bcrypt from 'bcryptjs';

let mongoServer: MongoMemoryServer;
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Connect to in-memory MongoDB
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {});
});

// Close the connection and stop MongoDB server
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Clear all test data after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User created successfully');

    const user = await User.findOne({ username: 'testuser' });
    expect(user).not.toBeNull();
  });

  it('should not register a user with existing username', async () => {
    await new User({ username: 'testuser', password: 'password123' }).save();

    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });

  it('should login an existing user', async () => {
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    await new User({ username: 'testuser', password: hashedPassword }).save();

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.isAdmin).toBe(false);
  });

  it('should not login a user with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'nonexistentuser', password: 'wrongpassword' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('should get a list of all logins', async () =>{
    const res = await request(app)
    .get('/api/auth/logins');

    expect(res.status).toBe(200);
  })
});
