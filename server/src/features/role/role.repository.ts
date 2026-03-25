import {Prisma} from '@prisma/client';
import {prisma} from '../../shared/lib/prisma';
import {TCreateRole, TUpdateRole} from './role.schema';

export class RoleRepository {
  async getAll(params: {
    page: number;
    limit: number;
    search?: string;
    includeArchived?: boolean;
  }) {
    const {page, limit, search, includeArchived} = params;
    const skip = (page - 1) * limit;

    const where: Prisma.RoleWhereInput = {
      ...(includeArchived ? {} : {deletedAt: null}),
      AND: [
        search ? {
          OR: [
            {name: {contains: search, mode: 'insensitive'}},
            {description: {contains: search, mode: 'insensitive'}},
          ]
        } : {},
      ]
    };

    const [data, total] = await Promise.all([
      prisma.role.findMany({
        where,
        skip,
        take: limit,
        orderBy: {createdAt: 'desc'}
      }),
      prisma.role.count({where})
    ]);

    return {data, total};
  }

  async findById(id: string) {
    return await prisma.role.findUnique({
      where: {id, deletedAt: null},
      include: {
        _count: {
          select: {users: true}
        }
      }
    });
  }

  async findByName(name: string) {
    return await prisma.role.findUnique({
      where: {name, deletedAt: null}
    });
  }

  async create(data: TCreateRole) {
    return await prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        permissions: data.permissions
      }
    });
  }

  async update(id: string, data: TUpdateRole) {
    return await prisma.role.update({
      where: {id},
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        permissions: data.permissions
      }
    });
  }

  async delete(id: string) {
    return await prisma.role.update({
      where: {id},
      data: {deletedAt: new Date()}
    });
  }
}
