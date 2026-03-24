import {Router} from 'express';
import {UserController} from './user.controller';
import {authMiddleware, authorize, isAdmin} from '../../shared/middleware/auth.middleware';

const route = Router();

route.get('/', authMiddleware, isAdmin, UserController.getAllUsers);
route.get('/:id', authMiddleware, authorize([], {allowSelf: true}), UserController.getUserById);

export default route;

