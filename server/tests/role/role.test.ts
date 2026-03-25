import {describe, it, expect, vi, beforeEach} from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import {prisma} from '../../src/shared/lib/prisma';

// Mock Prisma
vi.mock('../../src/shared/lib/prisma', () => ({
  prisma: {
    role: {
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

describe('RoleController Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/role should return roles', async () => {
    (prisma.role.findMany as any).mockResolvedValue([{id: '1', name: 'Admin'}]);
    (prisma.role.count as any).mockResolvedValue(1);

    const res = await request(app)
      .get('/api/role')
      .set('Authorization', 'Bearer mock-token');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('POST /api/role should create a new role', async () => {
    const roleData = {
      name: 'Manager',
      description: 'Test',
      type: 'EMPLOYEE',
      permissions: ['POS_ACCESS']
    };

    (prisma.role.findUnique as any).mockResolvedValue(null);
    (prisma.role.create as any).mockResolvedValue({id: 'new-id', ...roleData});

    const res = await request(app)
      .post('/api/role')
      .set('Authorization', 'Bearer mock-token')
      .send(roleData);

    expect(res.status).toBe(201);
    expect(res.body.message).toContain('created successfully');
  });
});
