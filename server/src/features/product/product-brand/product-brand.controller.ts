import {Request, Response} from 'express';
import {asyncHandler} from '../../../shared/utils/async-handler';
import {ProductBrandService} from './product-brand.service';
import {ApiResponse} from '../../../shared/utils/api-response';
import {TCreateProductBrand, TUpdateProductBrand} from './product-brand.schema';

const productService = new ProductBrandService();
export class ProductBrandController {
  static getAllProductBrand = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const all = Boolean(req.query.all) as boolean;

    const {data, total} = await productService.getAllProductBrand(page, limit, search, all);

    return ApiResponse.paginated(res, data, {total, page, limit}, 'Products retrieved successfully');
  });
  static createProductBrand = asyncHandler(async (req: Request, res: Response) => {
    const productBrand = req.body as TCreateProductBrand;
    const data = await productService.createProductBrand(productBrand);

    return ApiResponse.success(res, data, 'Product created successfully');
  });
  static updateProductBrand = asyncHandler(async (req: Request, res: Response) => {
    const productBrand = req.body as TUpdateProductBrand;
    const {id} = req.params as {id: string};
    const data = await productService.updateProductBrand(id, productBrand);

    return ApiResponse.success(res, data, 'Product updated successfully');
  });
  static archiveProductBrand = asyncHandler(async (req: Request, res: Response) => {
    const {id} = req.params as {id: string};
    const data = await productService.archiveProductBrand(id);

    return ApiResponse.success(res, data, 'Product archived successfully');
  });
}
