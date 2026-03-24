import {Router} from 'express';
import productBrandRoute from './product-brand/product-brand.route';
import productCategoryRoute from './product-category/product-category.route';
const route = Router();

route.use('/brand', productBrandRoute);
route.use('/category', productCategoryRoute);

export default route;
