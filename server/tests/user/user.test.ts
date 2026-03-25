import {describe, it, expect, vi, beforeEach} from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import {prisma} from '../../src/shared/lib/prisma';

// Mock Prisma
vi.mock('../../src/shared/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn()
    }
  }
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

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed-pass'),
    compare: vi.fn().mockResolvedValue(true)
  }
}));

describe('UserController Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /api/user should create account as admin', async () => {
    const userData = {
      email: 'new@example.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'User',
      roleId: '00000000-0000-0000-0000-000000000000'
    };

    (prisma.user.findUnique as any).mockResolvedValue(null);
    (prisma.user.create as any).mockResolvedValue({id: 'new-user-id', ...userData});

    const res = await request(app)
      .post('/api/user')
      .set('Authorization', 'Bearer mock-token')
      .send(userData);

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe('new-user-id');
  });

  it('DELETE /api/user/:id should soft delete account', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({id: 'target-id'});
    (prisma.user.update as any).mockResolvedValue({id: 'target-id', deletedAt: new Date()});

    const res = await request(app)
      .delete('/api/user/target-id')
      .set('Authorization', 'Bearer mock-token');

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('deleted successfully');
  });
});
