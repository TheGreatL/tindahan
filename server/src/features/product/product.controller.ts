import {Request, Response} from 'express';
import {asyncHandler} from '../../shared/utils/async-handler';
import {ProductService} from './product.service';
import {ApiResponse} from '../../shared/utils/api-response';
import {TCreateProduct, TUpdateProduct, TProductQuery} from './product.schema';

const productService = new ProductService();

export class ProductController {
  /**
   * @swagger
   * /product:
   *   get:
   *     summary: Get all products with pagination and filters
   *     tags: [Product]
   */
  static getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as TProductQuery;
    const {data, total} = await productService.getAllProducts(query);

    return ApiResponse.paginated(
      res, 
      data, 
      {total, page: query.page || 1, limit: query.limit || 10}, 
      'Products retrieved successfully'
    );
  });

  /**
   * @swagger
   * /product/{id}:
   *   get:
   *     summary: Get product by ID
   *     tags: [Product]
   */
  static getProductById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const data = await productService.getProductById(id);
    return ApiResponse.success(res, data, 'Product retrieved successfully');
  });

  /**
   * @swagger
   * /product:
   *   post:
   *     summary: Create a new product
   *     tags: [Product]
   */
  static createProduct = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as TCreateProduct;
    const product = await productService.createProduct(data);
    return ApiResponse.success(res, product, 'Product created successfully', 201);
  });

  /**
   * @swagger
   * /product/{id}:
   *   patch:
   *     summary: Update product
   *     tags: [Product]
   */
  static updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const data = req.body as TUpdateProduct;
    const product = await productService.updateProduct(id, data);
    return ApiResponse.success(res, product, 'Product updated successfully');
  });

  /**
   * @swagger
   * /product/{id}:
   *   delete:
   *     summary: Delete product (soft delete)
   *     tags: [Product]
   */
  static deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await productService.deleteProduct(id);
    return ApiResponse.success(res, null, 'Product deleted successfully');
  });
}

