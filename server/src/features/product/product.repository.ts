import {Prisma} from '@prisma/client';
import {prisma} from '../../shared/lib/prisma';
import {TCreateProduct, TUpdateProduct} from './product.schema';

export class ProductRepository {
  async getAll(params: {
    page: number;
    limit: number;
    search?: string;
    categoryId?: string;
    brandId?: string;
    includeArchived?: boolean;
  }) {
    const {page, limit, search, categoryId, brandId, includeArchived} = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      ...(includeArchived ? {} : {deletedAt: null}),
      AND: [
        search ? {
          OR: [
            {name: {contains: search, mode: 'insensitive'}},
            {code: {contains: search, mode: 'insensitive'}},
            {description: {contains: search, mode: 'insensitive'}},
          ]
        } : {},
        categoryId ? {categoryId} : {},
        brandId ? {productBrandId: brandId} : {},
      ]
    };

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          brand: true,
          images: true,
          productVariants: {
            include: {
              productInventories: true,
              variantAttributes: {
                include: {
                  attributeValue: {
                    include: {
                      attribute: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {createdAt: 'desc'}
      }),
      prisma.product.count({where})
    ]);

    return {data, total};
  }

  async findById(id: string) {
    return await prisma.product.findUnique({
      where: {id, deletedAt: null},
      include: {
        category: true,
        brand: true,
        images: true,
        productVariants: {
          include: {
            productInventories: true,
            variantAttributes: {
              include: {
                attributeValue: {
                  include: {
                    attribute: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  async create(data: TCreateProduct) {
    return await prisma.product.create({
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
        categoryId: data.categoryId,
        productBrandId: data.productBrandId,
        images: {
          create: data.images?.map((image: string) => ({image})) || []
        },
        productVariants: {
          create: data.variants.map((v) => ({
            productInventories: {
              create: {
                sku: v.sku,
                barCode: v.barCode,
                stock: v.stock
              }
            },
            variantAttributes: {
              create: v.attributeValueIds?.map((avId: string) => ({
                attributeValueId: avId
              })) || []
            }
          }))
        }
      },
      include: {
        images: true,
        productVariants: {
          include: {
            productInventories: true
          }
        }
      }
    });
  }

  async update(id: string, data: TUpdateProduct) {
    return await prisma.product.update({
      where: {id},
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
        categoryId: data.categoryId,
        productBrandId: data.productBrandId,
      },
      include: {
        category: true,
        brand: true
      }
    });
  }

  async delete(id: string) {
    const now = new Date();
    return await prisma.$transaction([
      prisma.product.update({
        where: {id},
        data: {deletedAt: now}
      }),
      prisma.productVariant.updateMany({
        where: {productId: id},
        data: {deletedAt: now}
      }),
      prisma.productImage.updateMany({
        where: {productId: id},
        data: {deletedAt: now}
      })
    ]);
  }
}
