import request from 'supertest';
import index from '../index';

describe('API Endpoints', () => {
  describe('GET /', () => {
    it('should return 200 OK with hello message', async () => {
      const response = await request(index).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('HAJKMAT');
    });
  });

  describe('Error handling', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(index).get('/nonexistent-route');
      expect(response.status).toBe(404);
    });
  });
});
