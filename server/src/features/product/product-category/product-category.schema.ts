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
