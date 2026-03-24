import {Router} from 'express';
import {authMiddleware} from '../../../shared/middleware/auth.middleware';
import {ProductBrandController} from './product-brand.controller';
import {validateSchema} from '../../../shared/middleware/schema-validate.middleware';
import {createProductBrandSchema, updateProductBrandSchema} from './product-brand.schema';

const router = Router();
router.get('/list', ProductBrandController.getAllProductBrand);
router.post('/', authMiddleware, validateSchema(createProductBrandSchema), ProductBrandController.createProductBrand);
router.patch(
  '/:id',
  authMiddleware,
  validateSchema(updateProductBrandSchema),
  ProductBrandController.updateProductBrand
);
router.delete('/:id', authMiddleware, ProductBrandController.archiveProductBrand);

export default router;
