import {Router} from 'express';
import {UserController} from './user.controller';
import {authMiddleware, authorize, isAdmin} from '../../shared/middleware/auth.middleware';
import {validateSchema} from '../../shared/middleware/schema-validate.middleware';
import {createUserSchema, updateUserSchema, getUsersQuerySchema} from './user.schema';

const route = Router();

// Administrative routes
route.get('/', authMiddleware, isAdmin, validateSchema(getUsersQuerySchema, 'query'), UserController.getAllUsers);

route.post(
  '/',
  authMiddleware,
  isAdmin,
  validateSchema(createUserSchema),
  UserController.createUser
);

route.patch(
  '/:id',
  authMiddleware,
  isAdmin,
  validateSchema(updateUserSchema),
  UserController.updateUser
);

route.delete('/:id', authMiddleware, isAdmin, UserController.deleteUser);

// Profile / Specific user routes
route.get('/:id', authMiddleware, authorize([], {allowSelf: true}), UserController.getUserById);

export default route;

