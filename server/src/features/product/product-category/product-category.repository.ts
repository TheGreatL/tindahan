import {Prisma, ProductCategory} from '@prisma/client';
import {prisma} from '../../../shared/lib/prisma';

export class ProductCategoryRepository {
  async findById(id: string): Promise<ProductCategory | null> {
    return await prisma.productCategory.findUnique({
      where: {id, deletedAt: null}
    });
  }

  async findByName(name: string): Promise<ProductCategory | null> {
    return await prisma.productCategory.findUnique({
      where: {
        name,
        deletedAt: null
      }
    });
  }

  async findAll(skip?: number, take?: number, where?: Prisma.ProductCategoryWhereInput, includeArchived: boolean = false): Promise<ProductCategory[]> {
    return await prisma.productCategory.findMany({
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

  async count(where?: Prisma.ProductCategoryWhereInput, includeArchived: boolean = false): Promise<number> {
    return await prisma.productCategory.count({where: {...where, ...(includeArchived ? {} : {deletedAt: null})}});
  }

  async update(id: string, data: Prisma.ProductCategoryUpdateInput): Promise<ProductCategory> {
    return await prisma.productCategory.update({
      where: {id},
      data
    });
  }

  async create(data: Prisma.ProductCategoryCreateInput): Promise<ProductCategory> {
    return await prisma.productCategory.create({
      data
    });
  }
  async archive(id: string): Promise<ProductCategory> {
    return await prisma.productCategory.update({
      where: {
        id
      },
      data: {
        deletedAt: new Date()
      }
    });
  }

  async restore(id: string, data: Prisma.ProductCategoryUpdateInput): Promise<ProductCategory> {
    return await prisma.productCategory.update({
      where: {id},
      data: {
        ...data,
        deletedAt: null
      }
    });
  }
}
