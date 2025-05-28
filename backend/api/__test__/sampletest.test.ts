import request from 'supertest';
import app from '../app';

describe('API Endpoints', () => {
  describe('GET /', () => {
    it('should return 200 OK with hello message', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('API is running');
    });
  });

  describe('Error handling', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app).get('/nonexistent-route');
      expect(response.status).toBe(404);
    });
  });
});
