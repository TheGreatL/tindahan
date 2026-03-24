import {Prisma, ProductBrand} from '@prisma/client';
import {prisma} from '../../../shared/lib/prisma';

export class ProductBrandRepository {
  async findById(id: string): Promise<ProductBrand | null> {
    return await prisma.productBrand.findUnique({
      where: {id}
    });
  }

  async findByName(name: string): Promise<ProductBrand | null> {
    return await prisma.productBrand.findUnique({
      where: {
        name
      }
    });
  }

  async findAll(skip?: number, take?: number, where?: Prisma.ProductBrandWhereInput): Promise<ProductBrand[]> {
    return await prisma.productBrand.findMany({
      skip,
      take,
      orderBy: {
        name: 'asc'
      },
      where: {
        ...where
      }
    });
  }

  async count(where?: Prisma.ProductBrandWhereInput): Promise<number> {
    return await prisma.productBrand.count({where});
  }

  async update(id: string, data: Prisma.ProductBrandUpdateInput): Promise<ProductBrand> {
    return await prisma.productBrand.update({
      where: {id},
      data
    });
  }

  async create(data: Prisma.ProductBrandCreateInput): Promise<ProductBrand> {
    return await prisma.productBrand.create({
      data
    });
  }
  async archive(id: string): Promise<ProductBrand> {
    return await prisma.productBrand.update({
      where: {
        id
      },
      data: {
        deletedAt: new Date()
      }
    });
  }

  async restore(id: string, data: Prisma.ProductBrandUpdateInput): Promise<ProductBrand> {
    return await prisma.productBrand.update({
      where: {id},
      data: {
        ...data,
        deletedAt: null
      }
    });
  }
}
