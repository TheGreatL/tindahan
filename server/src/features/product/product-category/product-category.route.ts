import {Router} from 'express';
import {validateSchema} from '../../../shared/middleware/schema-validate.middleware';
import {authMiddleware} from '../../../shared/middleware/auth.middleware';
import {createProductCategorySchema, updateProductCategorySchema} from './product-category.schema';
import {ProductCategoryController} from './product-category.controller';

const route = Router();

route.get('/list', ProductCategoryController.getAllProductCategory);
route.post(
  '/',
  authMiddleware,
  validateSchema(createProductCategorySchema),
  ProductCategoryController.createProductCategory
);
route.patch(
  '/:id',
  authMiddleware,
  validateSchema(updateProductCategorySchema),
  ProductCategoryController.updateProductCategory
);
route.delete('/:id', authMiddleware, ProductCategoryController.archiveProductCategory);
export default route;
