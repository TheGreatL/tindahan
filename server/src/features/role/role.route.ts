import {Router} from 'express';
import {RoleController} from './role.controller';
import {authMiddleware, authorize} from '../../shared/middleware/auth.middleware';
import {Permission} from '@prisma/client';
import {validateSchema} from '../../shared/middleware/schema-validate.middleware';
import {createRoleSchema, updateRoleSchema, getRolesQuerySchema} from './role.schema';

const route = Router();

route.get(
  '/',
  authMiddleware,
  authorize([Permission.USER_MANAGE_ROLES]),
  validateSchema(getRolesQuerySchema, 'query'),
  RoleController.getAllRoles
);

route.get(
  '/:id',
  authMiddleware,
  authorize([Permission.USER_MANAGE_ROLES]),
  RoleController.getRoleById
);

route.post(
  '/',
  authMiddleware,
  authorize([Permission.USER_MANAGE_ROLES]),
  validateSchema(createRoleSchema),
  RoleController.createRole
);

route.patch(
  '/:id',
  authMiddleware,
  authorize([Permission.USER_MANAGE_ROLES]),
  validateSchema(updateRoleSchema),
  RoleController.updateRole
);

route.delete(
  '/:id',
  authMiddleware,
  authorize([Permission.USER_MANAGE_ROLES]),
  RoleController.deleteRole
);

export default route;
