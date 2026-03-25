import {describe, it, expect, vi, beforeEach} from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import {prisma} from '../../src/shared/lib/prisma';
import {Permission} from '@prisma/client';

// Mock Prisma
vi.mock('../../src/shared/lib/prisma', () => ({
  prisma: {
    product: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn()
    }
  }
}));

// Mock auth
vi.mock('../../src/shared/middleware/auth.middleware', () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.user = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'admin@example.com',
      role: {
        name: 'Admin',
        type: 'ADMIN',
        permissions: [Permission.INVENTORY_EDIT, Permission.INVENTORY_VIEW]
      }
    };
    next();
  },
  authorize: (permissions: Permission[]) => (req: any, res: any, next: any) => next(),
  isAdmin: (req: any, res: any, next: any) => next(),
  authAttemptLimiter: (req: any, res: any, next: any) => next()
}));

describe('ProductController Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validData = {
    name: 'Test Product',
    code: 'PROD-001',
    description: 'A test product',
    categoryId: '550e8400-e29b-41d4-a716-446655440002',
    productBrandId: '550e8400-e29b-41d4-a716-446655440003',
    images: ['https://example.com/img1.png'],
    variants: [
      {
        sku: 'SKU-001',
        barCode: '123456789',
        stock: 100
      }
    ]
  };

  it('POST /api/product should create a product with images and variants', async () => {
    (prisma.product.create as any).mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440004',
      ...validData,
      createdAt: new Date()
    });

    const res = await request(app)
      .post('/api/product')
      .set('Authorization', 'Bearer mock-token')
      .send(validData);

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBeDefined();
  });

  it('POST /api/product should return 400 if validation fails', async () => {
    const invalidData = {...validData, variants: []};
    const res = await request(app)
      .post('/api/product')
      .set('Authorization', 'Bearer mock-token')
      .send(invalidData);
    expect(res.status).toBe(400);
  });
});
