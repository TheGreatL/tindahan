import request from 'supertest';
import app from '../../../src/app';
import {describe, it, expect, beforeEach} from 'vitest';
import {prisma} from '../../../src/shared/lib/prisma';
import httpCode from 'http-status';
import {TCreateProductBrand} from '../../../src/features/product/product-brand/product-brand.schema';
describe('Product Brand API', () => {
  const baseUrl = '/api/product/brand';
  const payload = {name: 'Nike', description: 'Nike a shoe brand'} as TCreateProductBrand;
  const accessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNkMDVmYTJlLTgzODctNGYyOC1iZGFlLTM0Zjc0N2NiMWEwZiIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTc3NDE2NDcwOSwiZXhwIjoxNzc0MTY1NjA5fQ.Ut0uaJT0cVsiQqqvVM_MSSKgzdC6duSOKbwiN90AWrs';
  beforeEach(async () => {
    console.log('before each call back');
    await prisma.productBrand.deleteMany({where: {name: payload.name}});
  });
  describe('CREATE Product Brand', () => {
    // CREATE
    it(`POST ${baseUrl}/ should create a product brand`, async () => {
      const res = await request(app).post(baseUrl).set('Authorization', `Bearer ${accessToken}`).send(payload);

      expect(res.status).toBe(httpCode.OK);
      expect(res.body).toMatchObject({name: payload.name});

      const dbRecord = await prisma.productBrand.findUnique({where: {name: payload.name}});
      expect(dbRecord).not.toBeNull();
    });

    it(`POST ${baseUrl}/ should reject duplicate`, async () => {
      await request(app).post(baseUrl).set('Authorization', `Bearer ${accessToken}`).send(payload);
      const res = await request(app).post(baseUrl).set('Authorization', `Bearer ${accessToken}`).send(payload);

      expect(res.status).toBe(httpCode.CONFLICT);
      expect(res.body.message).toContain('already existing');
    });

    it(`POST ${baseUrl}/ should reject missing body`, async () => {
      const res = await request(app).post(baseUrl).set('Authorization', `Bearer ${accessToken}`).send({});
      expect(res.status).toBe(httpCode.BAD_REQUEST);
    });
  });
  // READ
  describe('GET Product Brand', () => {
    it(`GET ${baseUrl}/list should return product brands`, async () => {
      await prisma.productBrand.create({data: payload});
      const res = await request(app).get(`${baseUrl}/list`);

      expect(res.status).toBe(httpCode.OK);
      expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({name: payload.name})]));
    });
  });

  // UPDATE
  describe('PATCH', () => {
    it(`PUT ${baseUrl}/:id should update brand`, async () => {
      const brand = await prisma.productBrand.create({data: payload});
      const updated = {name: 'Adidas', description: 'Updated desc'};

      const res = await request(app)
        .put(`${baseUrl}/${brand.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updated);

      expect(res.status).toBe(httpCode.OK);
      expect(res.body.name).toBe('Adidas');

      const dbRecord = await prisma.productBrand.findUnique({where: {id: brand.id}});
      expect(dbRecord?.name).toBe('Adidas');
    });
  });

  describe('DELETE', () => {
    // DELETE
    it(`DELETE ${baseUrl}/:id should remove brand`, async () => {
      const brand = await prisma.productBrand.create({data: payload});
      const res = await request(app).delete(`${baseUrl}/${brand.id}`).set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(httpCode.NO_CONTENT);

      const dbRecord = await prisma.productBrand.findUnique({where: {id: brand.id}});
      expect(dbRecord).toBeNull();
    });
  });
});
