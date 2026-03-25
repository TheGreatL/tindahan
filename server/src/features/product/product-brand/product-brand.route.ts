import {Router} from 'express';
import {authMiddleware, authorize} from '../../../shared/middleware/auth.middleware';
import {Permission} from '@prisma/client';
import {ProductBrandController} from './product-brand.controller';
import {validateSchema} from '../../../shared/middleware/schema-validate.middleware';
import {createProductBrandSchema, updateProductBrandSchema, productBrandQuerySchema} from './product-brand.schema';

const router = Router();
router.get(
  '/list',
  authMiddleware,
  authorize([Permission.INVENTORY_VIEW]),
  validateSchema(productBrandQuerySchema, 'query'),
  ProductBrandController.getAllProductBrand
);
router.post(
  '/',
  authMiddleware,
  authorize([Permission.INVENTORY_EDIT]),
  validateSchema(createProductBrandSchema),
  ProductBrandController.createProductBrand
);
router.patch(
  '/:id',
  authMiddleware,
  authorize([Permission.INVENTORY_EDIT]),
  validateSchema(updateProductBrandSchema),
  ProductBrandController.updateProductBrand
);
router.delete('/:id', authMiddleware, authorize([Permission.INVENTORY_RECORDS_DELETE]), ProductBrandController.archiveProductBrand);

export default router;
