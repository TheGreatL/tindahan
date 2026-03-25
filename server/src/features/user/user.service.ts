import {User, Prisma} from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import {UserRepository} from './user.repository';
import {HttpException} from '../../shared/exceptions/http-exception';
import {TCreateUser, TUpdateUser} from './user.schema';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(query: {page?: number; limit?: number; search?: string; includeArchived?: boolean}): Promise<{data: User[]; total: number}> {
    const {page = 1, limit = 10, search, includeArchived} = query;
    const skip = (page - 1) * limit;
 
    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            {firstName: {contains: search, mode: Prisma.QueryMode.insensitive}},
            {lastName: {contains: search, mode: Prisma.QueryMode.insensitive}},
            {email: {contains: search, mode: Prisma.QueryMode.insensitive}}
          ]
        }
      : {};
 
    const [data, total] = await Promise.all([
      this.userRepository.findAll(skip, limit, where, includeArchived),
      this.userRepository.count(where, includeArchived)
    ]);
    return {data, total};
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new HttpException('User not found', httpStatus.NOT_FOUND);
    }
    return user;
  }

  async createUser(data: TCreateUser): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new HttpException('User with this email already exists', httpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      avatar: data.avatar,
      role: {connect: {id: data.roleId}}
    });
  }

  async updateUser(id: string, data: TUpdateUser): Promise<User> {
    await this.getUserById(id); // Ensure exists

    const updateData: Prisma.UserUpdateInput = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      avatar: data.avatar
    };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    if (data.roleId) {
      updateData.role = {connect: {id: data.roleId}};
    }

    return this.userRepository.update(id, updateData);
  }

  async deleteUser(id: string): Promise<User> {
    await this.getUserById(id); // Ensure exists
    return this.userRepository.delete(id);
  }
}
