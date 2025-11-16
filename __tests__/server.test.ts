import request from 'supertest';
import app from '../src/index';

describe('API Server Health Check', () => {
  it('should respond with status ok when server is up', async () => {
    const response = await request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('message', 'API is up and running.');
  });
});

