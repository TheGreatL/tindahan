import {Router} from 'express';
import authRoute from './features/auth/auth.route';
import userRoute from './features/user/user.route';
import productRoute from './features/product/product.route';

/**
 * Gold Standard:
 * Routes.ts is the central traffic controller for the API.
 * It gathers all feature-specific routes and mounts them under specific paths.
 */
const routes = Router();

// 1. Auth related routes (Login, Register, Token Refresh)
routes.use('/auth', authRoute);

// 2. User related routes (Profile management, user retrieval)
routes.use('/user', userRoute);
routes.use('/product', productRoute);

export default routes;

