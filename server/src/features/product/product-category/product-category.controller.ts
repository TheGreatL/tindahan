import {Request, Response} from 'express';
import {asyncHandler} from '../../../shared/utils/async-handler';
import {ProductCategoryService} from './product-category.service';
import {ApiResponse} from '../../../shared/utils/api-response';
import {TCreateProductCategory, TUpdateProductCategory} from './product-category.schema';

const productService = new ProductCategoryService();
export class ProductCategoryController {
  static getAllProductCategory = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const all = Boolean(req.query.all) as boolean;

    const {data, total} = await productService.getAllProductCategory(page, limit, search, all);

    return ApiResponse.paginated(res, data, {total, page, limit}, 'Products retrieved successfully');
  });
  static createProductCategory = asyncHandler(async (req: Request, res: Response) => {
    const productCategory = req.body as TCreateProductCategory;
    const data = await productService.createProductCategory(productCategory);

    return ApiResponse.success(res, data, 'Product created successfully');
  });
  static updateProductCategory = asyncHandler(async (req: Request, res: Response) => {
    const productCategory = req.body as TUpdateProductCategory;
    const {id} = req.params as {id: string};
    const data = await productService.updateProductCategory(id, productCategory);

    return ApiResponse.success(res, data, 'Product updated successfully');
  });
  static archiveProductCategory = asyncHandler(async (req: Request, res: Response) => {
    const {id} = req.params as {id: string};
    const data = await productService.archiveProductCategory(id);

    return ApiResponse.success(res, data, 'Product archived successfully');
  });
}
