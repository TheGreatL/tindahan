import {extendZodWithOpenApi} from '@asteasolutions/zod-to-openapi';
import z from 'zod';
import {registry} from '../../shared/lib/openapi-registry';
import {RoleType, Permission} from '@prisma/client';
import {successResponseSchema, paginatedResponseSchema} from '../../shared/schema/response.schema';

extendZodWithOpenApi(z);

export const roleSchema = registry.register(
  'Role',
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().optional().nullable(),
    type: z.nativeEnum(RoleType),
    permissions: z.array(z.nativeEnum(Permission)),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().optional().nullable()
  })
);

export const createRoleSchema = registry.register(
  'CreateRoleRequest',
  z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    type: z.nativeEnum(RoleType).default(RoleType.EMPLOYEE),
    permissions: z.array(z.nativeEnum(Permission)).default([Permission.POS_ACCESS])
  })
);

export type TCreateRole = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = registry.register(
  'UpdateRoleRequest',
  createRoleSchema.partial()
);

export type TUpdateRole = z.infer<typeof updateRoleSchema>;

export const getRolesQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: z.string().optional()
});

export type TGetRolesQuery = z.infer<typeof getRolesQuerySchema>;

export const roleResponseSchema = registry.register(
  'RoleResponse',
  successResponseSchema.extend({
    data: roleSchema
  })
);

export const rolePaginatedResponseSchema = registry.register(
  'RolePaginatedResponse',
  paginatedResponseSchema.extend({
    data: z.array(roleSchema)
  })
);
