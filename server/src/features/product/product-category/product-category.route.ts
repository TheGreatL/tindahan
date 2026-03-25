import {Router} from 'express';
import {validateSchema} from '../../../shared/middleware/schema-validate.middleware';
import {authMiddleware, authorize} from '../../../shared/middleware/auth.middleware';
import {Permission} from '@prisma/client';
import {createProductCategorySchema, updateProductCategorySchema, productCategoryQuerySchema} from './product-category.schema';
import {ProductCategoryController} from './product-category.controller';

const route = Router();

route.get(
  '/list',
  authMiddleware,
  authorize([Permission.INVENTORY_VIEW]),
  validateSchema(productCategoryQuerySchema, 'query'),
  ProductCategoryController.getAllProductCategory
);
route.post(
  '/',
  authMiddleware,
  authorize([Permission.INVENTORY_EDIT]),
  validateSchema(createProductCategorySchema),
  ProductCategoryController.createProductCategory
);
route.patch(
  '/:id',
  authMiddleware,
  authorize([Permission.INVENTORY_EDIT]),
  validateSchema(updateProductCategorySchema),
  ProductCategoryController.updateProductCategory
);
route.delete('/:id', authMiddleware, authorize([Permission.INVENTORY_RECORDS_DELETE]), ProductCategoryController.archiveProductCategory);
export default route;
