import {Prisma, ProductBrand} from '@prisma/client';
import {ProductBrandRepository} from './product-brand.repository';
import {TCreateProductBrand, TUpdateProductBrand} from './product-brand.schema';
import {AlreadyExistException} from '../../../shared/exceptions/already-exist-exception';
import {NotFoundException} from '../../../shared/exceptions/not-found-exception';

export type TDependencies = {
  productBrandRepository: ProductBrandRepository;
};
export class ProductBrandService {
  private productBrandRepository: ProductBrandRepository;
  constructor(dependencies?: TDependencies) {
    this.productBrandRepository = dependencies?.productBrandRepository || new ProductBrandRepository();
  }
  async getAllProductBrand(
    page = 1,
    limit = 10,
    search?: string,
    includeArchive: boolean = false
  ): Promise<{data: ProductBrand[]; total: number}> {
    const skip = (page - 1) * limit;

    const where: Prisma.ProductBrandWhereInput = search
      ? {
          name: {contains: search, mode: 'insensitive'}
        }
      : {};
    const [data, total] = await Promise.all([
      this.productBrandRepository.findAll(skip, limit, where, includeArchive),
      this.productBrandRepository.count(where, includeArchive)
    ]);
    return {data, total};
  }
  async createProductBrand(data: TCreateProductBrand): Promise<ProductBrand> {
    const existing = await this.productBrandRepository.findByName(data.name);

    if (existing) {
      if (existing.deletedAt) {
        // Restore soft-deleted record
        return this.productBrandRepository.restore(existing.id, data);
      }
      throw new AlreadyExistException('Product brand name already exists');
    }

    return this.productBrandRepository.create(data);
  }
  async updateProductBrand(id: string, data: TUpdateProductBrand) {
    await this.checkProductName(data?.name ?? '');

    const productBrand = await this.productBrandRepository.update(id, data);
    return productBrand;
  }
  async archiveProductBrand(id: string) {
    const isProductBrand = await this.productBrandRepository.findById(id);
    if (!isProductBrand) throw new NotFoundException('Product brand not found');
    if (isProductBrand.deletedAt) throw new AlreadyExistException('Product brand is already archived');
    const productBrand = await this.productBrandRepository.archive(id);
    return productBrand;
  }
  private async checkProductName(name: string) {
    const productName = await this.productBrandRepository.findByName(name);
    console.log(productName);
    if (productName) throw new AlreadyExistException('Product name is already existing');
  }
}
