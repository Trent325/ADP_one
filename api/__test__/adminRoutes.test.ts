import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import adminRoutes from '../src/routes/admin';
import User from '../src/models/User';
import bcrypt from 'bcryptjs';

// Mocking middleware
jest.mock('../src/services/adminAuth', () => ({
  authMiddleware: (req: Request, res: Response, next: NextFunction) => next(),
  adminMiddleware: (req: Request, res: Response, next: NextFunction) => next(),
}));

let mongoServer: MongoMemoryServer;
const app = express();
app.use(express.json());
app.use('/api/admin', adminRoutes);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

describe('Admin Routes', () => {
  it('should fetch all users', async () => {
    const user = new User({ username: 'testuser', password: 'password123', isAdmin: false });
    await user.save();

    const res = await request(app).get('/api/admin/users');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].username).toBe('testuser');
    expect(res.body[0]).not.toHaveProperty('password');
  });

  it('should add a new user', async () => {
    const res = await request(app)
      .post('/api/admin/users')
      .send({ username: 'newuser', password: 'newpassword', isAdmin: false });

    expect(res.status).toBe(201);
    expect(res.body.username).toBe('newuser');
    expect(res.body).not.toHaveProperty('password');

    const user = await User.findOne({ username: 'newuser' });
    expect(user).not.toBeNull();
  });

  it('should delete a user', async () => {
    const user = new User({ username: 'deleteuser', password: 'password123', isAdmin: false });
    await user.save();

    const res = await request(app).delete(`/api/admin/users/${user._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User deleted successfully');

    const deletedUser = await User.findById(user._id);
    expect(deletedUser).toBeNull();
  });

  it('should update a user', async () => {
    const user = new User({ username: 'updateuser', password: 'password123', isAdmin: false });
    await user.save();

    const res = await request(app)
      .put(`/api/admin/users/${user._id}`)
      .send({ username: 'updateduser', password: 'newpassword', isAdmin: true });

    expect(res.status).toBe(200);
    expect(res.body.username).toBe('updateduser');
    expect(res.body.isAdmin).toBe(true);

    const updatedUser = await User.findById(user._id);
    expect(updatedUser).not.toBeNull();
    expect(updatedUser?.username).toBe('updateduser');
    expect(updatedUser?.isAdmin).toBe(true);
  });
});
