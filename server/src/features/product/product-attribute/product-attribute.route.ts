import {Router} from 'express';
import {ProductAttributeController} from './product-attribute.controller';
import {authMiddleware, authorize} from '../../../shared/middleware/auth.middleware';
import {Permission} from '@prisma/client';
import {validateSchema} from '../../../shared/middleware/schema-validate.middleware';
import {
  createAttributeSchema, 
  updateAttributeSchema, 
  createAttributeValueSchema, 
  updateAttributeValueSchema
} from './product-attribute.schema';

const route = Router();

// --- Attributes ---
route.get(
  '/', 
  authMiddleware, 
  authorize([Permission.INVENTORY_VIEW]), 
  ProductAttributeController.getAllAttributes
);

route.post(
  '/', 
  authMiddleware, 
  authorize([Permission.INVENTORY_EDIT]), 
  validateSchema(createAttributeSchema), 
  ProductAttributeController.createAttribute
);

route.patch(
  '/:id', 
  authMiddleware, 
  authorize([Permission.INVENTORY_EDIT]), 
  validateSchema(updateAttributeSchema), 
  ProductAttributeController.updateAttribute
);

route.delete(
  '/:id', 
  authMiddleware, 
  authorize([Permission.INVENTORY_RECORDS_DELETE]), 
  ProductAttributeController.deleteAttribute
);

// --- Attribute Values ---
route.post(
  '/value', 
  authMiddleware, 
  authorize([Permission.INVENTORY_EDIT]), 
  validateSchema(createAttributeValueSchema), 
  ProductAttributeController.createAttributeValue
);

route.patch(
  '/value/:id', 
  authMiddleware, 
  authorize([Permission.INVENTORY_EDIT]), 
  validateSchema(updateAttributeValueSchema), 
  ProductAttributeController.updateAttributeValue
);

route.delete(
  '/value/:id', 
  authMiddleware, 
  authorize([Permission.INVENTORY_RECORDS_DELETE]), 
  ProductAttributeController.deleteAttributeValue
);

export default route;
