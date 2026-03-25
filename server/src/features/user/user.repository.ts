import {Prisma} from '@prisma/client';
import {prisma} from '../../shared/lib/prisma';

export type TUserWithRole = Prisma.UserGetPayload<{include: {role: true}}>;

export class UserRepository {
  async findById(id: string): Promise<TUserWithRole | null> {
    return await prisma.user.findUnique({
      where: {id, deletedAt: null},
      include: {role: true}
    });
  }

  async findByEmail(email: string): Promise<TUserWithRole | null> {
    return await prisma.user.findUnique({
      where: {email, deletedAt: null},
      include: {role: true}
    });
  }

  async findAll(skip?: number, take?: number, where?: Prisma.UserWhereInput): Promise<TUserWithRole[]> {
    return await prisma.user.findMany({
      skip,
      take,
      where: {...where, deletedAt: null},
      include: {role: true},
      orderBy: {createdAt: 'desc'}
    });
  }

  async count(where?: Prisma.UserWhereInput): Promise<number> {
    return await prisma.user.count({where: {...where, deletedAt: null}});
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<TUserWithRole> {
    return await prisma.user.update({
      where: {id},
      data,
      include: {role: true}
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<TUserWithRole> {
    return await prisma.user.create({
      data,
      include: {role: true}
    });
  }

  async delete(id: string): Promise<TUserWithRole> {
    return await prisma.user.update({
      where: {id},
      data: {deletedAt: new Date()},
      include: {role: true}
    });
  }
}



