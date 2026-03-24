import {Prisma, ProductCategory} from '@prisma/client';
import {prisma} from '../../../shared/lib/prisma';

export class ProductCategoryRepository {
  async findById(id: string): Promise<ProductCategory | null> {
    return await prisma.productCategory.findUnique({
      where: {id}
    });
  }

  async findByName(name: string): Promise<ProductCategory | null> {
    return await prisma.productCategory.findUnique({
      where: {
        name
      }
    });
  }

  async findAll(skip?: number, take?: number, where?: Prisma.ProductCategoryWhereInput): Promise<ProductCategory[]> {
    return await prisma.productCategory.findMany({
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

  async count(where?: Prisma.ProductCategoryWhereInput): Promise<number> {
    return await prisma.productCategory.count({where});
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
