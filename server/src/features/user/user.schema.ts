import z from 'zod';
import {extendZodWithOpenApi} from '@asteasolutions/zod-to-openapi';
import {registry} from '../../shared/lib/openapi-registry';
import {paginatedResponseSchema, successResponseSchema} from '../../shared/schema/response.schema';

extendZodWithOpenApi(z);

/**
 * Schema for admin-only account creation.
 * Password is required, roleId assigns the user to a specific role.
 */
export const createUserSchema = registry.register(
  'CreateUserRequest',
  z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    roleId: z.string().uuid('Invalid role ID'),
    avatar: z.string().optional()
  })
);

export type TCreateUser = z.infer<typeof createUserSchema>;

/**
 * Schema for updating a user account.
 * Password is optional (only hashed if provided).
 */
export const updateUserSchema = registry.register(
  'UpdateUserRequest',
  z.object({
    email: z.email('Invalid email address').optional(),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    roleId: z.string().uuid('Invalid role ID').optional(),
    avatar: z.string().optional()
  })
);

export type TUpdateUser = z.infer<typeof updateUserSchema>;

export const getUsersQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: z.string().optional()
});

export type TGetUsersQuery = z.infer<typeof getUsersQuerySchema>;

// Response schemas for OpenAPI docs
export const userResponseSchema = registry.register(
  'UserResponse',
  successResponseSchema.extend({
    data: z.object({
      id: z.string(),
      email: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      avatar: z.string().nullable(),
      role: z.object({
        id: z.string(),
        name: z.string(),
        type: z.string()
      }),
      createdAt: z.date(),
      updatedAt: z.date()
    })
  })
);

export const userPaginatedResponseSchema = registry.register(
  'UserPaginatedResponse',
  paginatedResponseSchema.extend({
    data: z.array(
      z.object({
        id: z.string(),
        email: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        avatar: z.string().nullable(),
        role: z.object({
          id: z.string(),
          name: z.string(),
          type: z.string()
        }),
        createdAt: z.date(),
        updatedAt: z.date()
      })
    )
  })
);
