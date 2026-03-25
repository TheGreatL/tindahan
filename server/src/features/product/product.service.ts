import {ProductRepository} from './product.repository';
import {HttpException} from '../../shared/exceptions/http-exception';
import httpStatus from 'http-status';
import {TCreateProduct, TUpdateProduct, TProductQuery} from './product.schema';

export class ProductService {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  async getAllProducts(query: TProductQuery) {
    return await this.repository.getAll({
      page: query.page || 1,
      limit: query.limit || 10,
      search: query.search,
      categoryId: query.categoryId,
      brandId: query.brandId,
      includeArchived: query.includeArchived
    });
  }

  async getProductById(id: string) {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new HttpException('Product not found', httpStatus.NOT_FOUND);
    }
    return product;
  }

  async createProduct(data: TCreateProduct) {
    // Check if code or SKU already exists could be added here
    return await this.repository.create(data);
  }

  async updateProduct(id: string, data: TUpdateProduct) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new HttpException('Product not found', httpStatus.NOT_FOUND);
    }
    return await this.repository.update(id, data);
  }

  async deleteProduct(id: string) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new HttpException('Product not found', httpStatus.NOT_FOUND);
    }
    return await this.repository.delete(id);
  }
}
