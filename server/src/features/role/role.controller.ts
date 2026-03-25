import {Request, Response} from 'express';
import {asyncHandler} from '../../shared/utils/async-handler';
import {RoleService} from './role.service';
import {ApiResponse} from '../../shared/utils/api-response';
import {TCreateRole, TUpdateRole, TGetRolesQuery} from './role.schema';

const roleService = new RoleService();

export class RoleController {
  /**
   * @swagger
   * /role:
   *   get:
   *     summary: Get all roles with pagination and search
   *     tags: [Role]
   */
  static getAllRoles = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as TGetRolesQuery;
    const {data, total} = await roleService.getAllRoles(query);

    return ApiResponse.paginated(
      res,
      data,
      {total, page: query.page, limit: query.limit},
      'Roles retrieved successfully'
    );
  });

  /**
   * @swagger
   * /role/{id}:
   *   get:
   *     summary: Get role by ID
   *     tags: [Role]
   */
  static getRoleById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const data = await roleService.getRoleById(id);
    return ApiResponse.success(res, data, 'Role retrieved successfully');
  });

  /**
   * @swagger
   * /role:
   *   post:
   *     summary: Create a new role
   *     tags: [Role]
   */
  static createRole = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as TCreateRole;
    const role = await roleService.createRole(data);
    return ApiResponse.success(res, role, 'Role created successfully', 201);
  });

  /**
   * @swagger
   * /role/{id}:
   *   patch:
   *     summary: Update role
   *     tags: [Role]
   */
  static updateRole = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const data = req.body as TUpdateRole;
    const role = await roleService.updateRole(id, data);
    return ApiResponse.success(res, role, 'Role updated successfully');
  });

  /**
   * @swagger
   * /role/{id}:
   *   delete:
   *     summary: Delete role (soft delete)
   *     tags: [Role]
   */
  static deleteRole = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await roleService.deleteRole(id);
    return ApiResponse.success(res, null, 'Role deleted successfully');
  });
}
