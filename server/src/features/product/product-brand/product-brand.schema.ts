import {extendZodWithOpenApi} from '@asteasolutions/zod-to-openapi';
import z from 'zod';
import {registry} from '../../../shared/lib/openapi-registry';
import {paginatedResponseSchema, successResponseSchema} from '../../../shared/schema/response.schema';

extendZodWithOpenApi(z);

export const createProductBrandSchema = registry.register(
  'CreateProductBrandRequest',
  z.object({
    name: z.string('Invalid type').nonempty('Name is required'),
    description: z.string('Invalid type').optional()
  })
);
export type TCreateProductBrand = z.infer<typeof createProductBrandSchema>;

export const productBrandQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: z.string().optional(),
  includeArchived: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional().default(false)
});
export type TProductBrandQuery = z.infer<typeof productBrandQuerySchema>;

export const updateProductBrandSchema = registry.register(
  'UpdateProductBrandRequest',
  createProductBrandSchema.partial()
);
export type TUpdateProductBrand = z.infer<typeof updateProductBrandSchema>;

export const productBrandPaginatedResponseSchema = registry.register(
  'ProductBrandPaginatedResponseSchema',
  paginatedResponseSchema.extend({
    data: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string()
    })
  })
);
export const productBrandResponseSchema = registry.register(
  'ProductBrandResponseSchema',
  successResponseSchema.extend({
    data: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string()
    })
  })
);
