import request from 'supertest';
import { app } from '../index'; // You should export your app instance from your main application file
import Article from '../models/articaleModel';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import server from '../index';
import mongoose from 'mongoose';


// Make sure to clear the database before each test
beforeEach(async () => {
  await Article.deleteMany({});
  await User.deleteMany({});
});

// Start the server before all tests
beforeAll(async () => {
    await server;
  });
  
  // Close the server after all tests
  afterAll(async () => {
    await server.close();
  });
  

describe('Article Controller', () => {
  test('Should add an article for an existing user', async () => {
    // Create an existing user
    const existingUser = new User({
      name: 'Existing User',
      contactNumber: '0987654321',
      email: 'test@example.com',
      role: 'admin',
      username: 'existinguser',
      password: 'existingpassword',
    });
    await existingUser.save();

    // Generate a JWT token for authentication
    const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    // Send the request to add the article
    const response = await request(app)
      .post('/api/admin/addArticle') // Make sure this route matches the actual route in your application
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Article',
        body: 'This is a test article.',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Article added successfully');
    expect(response.body.data.title).toBe('Test Article');
    expect(response.body.data.body).toBe('This is a test article.');
    expect(response.body.data.author).toBe(existingUser.name);
  });

  test('Should not add an article for a non-existing user', async () => {
    // Generate a valid ObjectId for a non-existing user
    const nonExistentUserId = new mongoose.Types.ObjectId();
  
    // Generate an invalid JWT token for authentication
    const token = jwt.sign({ id: nonExistentUserId, email: 'nonexistent@example.com' }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });
  
    // Send the request to add the article
    const response = await request(app)
      .post('/api/admin/addArticle') // Make sure this route matches the actual route in your application
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Article',
        body: 'This is a test article.',
      });
  
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Author not found');
  });
  

  // You can write additional tests for other edge cases and scenarios
});
