import {Router} from 'express';
import productBrandRoute from './product-brand/product-brand.route';
import productCategoryRoute from './product-category/product-category.route';
import productAttributeRoute from './product-attribute/product-attribute.route';
import {ProductController} from './product.controller';
import {authMiddleware, authorize} from '../../shared/middleware/auth.middleware';
import {Permission} from '@prisma/client';
import {validateSchema} from '../../shared/middleware/schema-validate.middleware';
import {createProductSchema, updateProductSchema} from './product.schema';

const route = Router();

// 1. Nested Routes
route.use('/brand', productBrandRoute);
route.use('/category', productCategoryRoute);
route.use('/attribute', productAttributeRoute);

// 2. Main Product CRUD
route.get('/', authMiddleware, authorize([Permission.INVENTORY_VIEW]), ProductController.getAllProducts);

route.get('/:id', authMiddleware, authorize([Permission.INVENTORY_VIEW]), ProductController.getProductById);

route.post(
  '/',
  authMiddleware,
  authorize([Permission.INVENTORY_EDIT]),
  validateSchema(createProductSchema),
  ProductController.createProduct
);

route.patch(
  '/:id',
  authMiddleware,
  authorize([Permission.INVENTORY_EDIT]),
  validateSchema(updateProductSchema),
  ProductController.updateProduct
);

route.delete('/:id', authMiddleware, authorize([Permission.INVENTORY_RECORDS_DELETE]), ProductController.deleteProduct);

export default route;
