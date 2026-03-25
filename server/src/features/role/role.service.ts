import {RoleRepository} from './role.repository';
import {HttpException} from '../../shared/exceptions/http-exception';
import httpStatus from 'http-status';
import {TCreateRole, TUpdateRole, TGetRolesQuery} from './role.schema';

export class RoleService {
  private repository: RoleRepository;

  constructor() {
    this.repository = new RoleRepository();
  }

  async getAllRoles(query: TGetRolesQuery) {
    return await this.repository.getAll({
      page: query.page || 1,
      limit: query.limit || 10,
      search: query.search
    });
  }

  async getRoleById(id: string) {
    const role = await this.repository.findById(id);
    if (!role) {
      throw new HttpException('Role not found', httpStatus.NOT_FOUND);
    }
    return role;
  }

  async createRole(data: TCreateRole) {
    const existing = await this.repository.findByName(data.name);
    if (existing) {
      throw new HttpException('Role name already exists', httpStatus.BAD_REQUEST);
    }
    return await this.repository.create(data);
  }

  async updateRole(id: string, data: TUpdateRole) {
    const existingRole = await this.repository.findById(id);
    if (!existingRole) {
      throw new HttpException('Role not found', httpStatus.NOT_FOUND);
    }

    if (data.name && data.name !== existingRole.name) {
      const nameConflict = await this.repository.findByName(data.name);
      if (nameConflict) {
        throw new HttpException('Role name already exists', httpStatus.BAD_REQUEST);
      }
    }

    return await this.repository.update(id, data);
  }

  async deleteRole(id: string) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new HttpException('Role not found', httpStatus.NOT_FOUND);
    }

    // Check if any users are using this role
    if (existing._count.users > 0) {
      throw new HttpException('Cannot delete role that is assigned to users', httpStatus.BAD_REQUEST);
    }

    return await this.repository.delete(id);
  }
}
