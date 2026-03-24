import {Prisma, ProductCategory} from '@prisma/client';
import {ProductCategoryRepository} from './product-category.repository';
import {TCreateProductCategory, TUpdateProductCategory} from './product-category.schema';
import {AlreadyExistException} from '../../../shared/exceptions/already-exist-exception';
import {NotFoundException} from '../../../shared/exceptions/not-found-exception';

export type TDependencies = {
  productCategoryRepository: ProductCategoryRepository;
};
export class ProductCategoryService {
  private productCategoryRepository: ProductCategoryRepository;
  constructor(dependencies?: TDependencies) {
    this.productCategoryRepository = dependencies?.productCategoryRepository || new ProductCategoryRepository();
  }
  async getAllProductCategory(
    page = 1,
    limit = 10,
    search?: string,
    includeArchive: boolean = false
  ): Promise<{data: ProductCategory[]; total: number}> {
    const skip = (page - 1) * limit;

    const where: Prisma.ProductCategoryWhereInput = {
      AND: [
        {
          name: {contains: search, mode: 'insensitive'}
        },
        {
          deletedAt: includeArchive ? undefined : null
        }
      ]
    };
    const [data, total] = await Promise.all([
      this.productCategoryRepository.findAll(skip, limit, where),
      this.productCategoryRepository.count(where)
    ]);
    return {data, total};
  }
  async createProductCategory(data: TCreateProductCategory): Promise<ProductCategory> {
    const existing = await this.productCategoryRepository.findByName(data.name);

    if (existing) {
      if (existing.deletedAt) {
        // Restore soft-deleted record
        return this.productCategoryRepository.restore(existing.id, data);
      }
      throw new AlreadyExistException('Product category name already exists');
    }

    return this.productCategoryRepository.create(data);
  }
  async updateProductCategory(id: string, data: TUpdateProductCategory) {
    await this.checkProductName(data?.name ?? '');

    const productCategory = await this.productCategoryRepository.update(id, data);
    return productCategory;
  }
  async archiveProductCategory(id: string) {
    const isProductCategory = await this.productCategoryRepository.findById(id);
    if (!isProductCategory) throw new NotFoundException('Product category not found');
    if (isProductCategory.deletedAt) throw new AlreadyExistException('Product category is already archived');
    const productCategory = await this.productCategoryRepository.archive(id);
    return productCategory;
  }
  private async checkProductName(name: string) {
    const productName = await this.productCategoryRepository.findByName(name);
    console.log(productName);
    if (productName) throw new AlreadyExistException('Product name is already existing');
  }
}
