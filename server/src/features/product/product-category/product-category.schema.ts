import {extendZodWithOpenApi} from '@asteasolutions/zod-to-openapi';
import z from 'zod';
import {registry} from '../../../shared/lib/openapi-registry';
import {paginatedResponseSchema, successResponseSchema} from '../../../shared/schema/response.schema';

extendZodWithOpenApi(z);

export const createProductCategorySchema = registry.register(
  'CreateProductCategoryRequest',
  z.object({
    name: z.string('Invalid type').nonempty('Name is required'),
    description: z.string('Invalid type').optional()
  })
);
export type TCreateProductCategory = z.infer<typeof createProductCategorySchema>;

export const productCategoryQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: z.string().optional(),
  includeArchived: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional().default(false)
});
export type TProductCategoryQuery = z.infer<typeof productCategoryQuerySchema>;

export const updateProductCategorySchema = registry.register(
  'UpdateProductCategoryRequest',
  createProductCategorySchema.partial()
);
export type TUpdateProductCategory = z.infer<typeof updateProductCategorySchema>;

export const productCategoryPaginatedResponseSchema = registry.register(
  'ProductCategoryPaginatedResponseSchema',
  paginatedResponseSchema.extend({
    data: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string()
    })
  })
);
export const productCategoryResponseSchema = registry.register(
  'ProductCategoryResponseSchema',
  successResponseSchema.extend({
    data: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string()
    })
  })
);
