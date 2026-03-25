import {describe, it, expect, vi, beforeEach} from 'vitest';
import request from 'supertest';
import app from '../../src/app';

// Mock storage adapter
vi.mock('../../src/shared/services/storage/storage.config', () => ({
  getStorageAdapter: () => ({
    upload: vi.fn().mockResolvedValue('unique-key.png'),
    getUrl: vi.fn().mockImplementation((key) => `http://localhost/uploads/${key}`),
    delete: vi.fn().mockResolvedValue(undefined)
  })
}));

// Mock auth middleware
vi.mock('../../src/shared/middleware/auth.middleware', () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.user = {
      id: 'admin-id',
      email: 'admin@example.com',
      role: {name: 'Admin', type: 'ADMIN', permissions: ['*']}
    };
    next();
  },
  authorize: () => (req: any, res: any, next: any) => next(),
  isAdmin: (req: any, res: any, next: any) => next(),
  authAttemptLimiter: (req: any, res: any, next: any) => next()
}));

describe('UploadController Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /api/upload should upload single file', async () => {
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', 'Bearer mock-token')
      .attach('file', Buffer.from('dummy image'), 'test.png');

    expect(res.status).toBe(201);
    expect(res.body.data.url).toContain('/uploads/unique-key.png');
  });
});
