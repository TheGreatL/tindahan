import {Prisma, ProductBrand} from '@prisma/client';
import {prisma} from '../../../shared/lib/prisma';

export class ProductBrandRepository {
  async findById(id: string): Promise<ProductBrand | null> {
    return await prisma.productBrand.findUnique({
      where: {id, deletedAt: null}
    });
  }

  async findByName(name: string): Promise<ProductBrand | null> {
    return await prisma.productBrand.findUnique({
      where: {
        name,
        deletedAt: null
      }
    });
  }

  async findAll(skip?: number, take?: number, where?: Prisma.ProductBrandWhereInput, includeArchived: boolean = false): Promise<ProductBrand[]> {
    return await prisma.productBrand.findMany({
      skip,
      take,
      orderBy: {
        name: 'asc'
      },
      where: {
        ...where,
        ...(includeArchived ? {} : {deletedAt: null})
      }
    });
  }

  async count(where?: Prisma.ProductBrandWhereInput, includeArchived: boolean = false): Promise<number> {
    return await prisma.productBrand.count({where: {...where, ...(includeArchived ? {} : {deletedAt: null})}});
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
