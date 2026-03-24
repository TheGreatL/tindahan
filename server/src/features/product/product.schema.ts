import {extendZodWithOpenApi} from '@asteasolutions/zod-to-openapi';
import {z} from 'zod';
import {registry} from '../../shared/lib/openapi-registry';
import {paginatedResponseSchema, successResponseSchema} from '../../shared/schema/response.schema';

extendZodWithOpenApi(z);

export const createProductSchema = registry.register(
  'CreateProductRequest',
  z.object({
    categoryId: z.string().uuid(),
    productBrandId: z.string().uuid(),
    code: z.string().min(1, 'Product code is required'),
    name: z.string().min(1, 'Product name is required'),
    description: z.string().optional(),
    images: z.array(z.string().url()).optional(),
    variants: z.array(z.object({
      sku: z.string().min(1, 'SKU is required'),
      barCode: z.string().min(1, 'Barcode is required'),
      stock: z.number().int().min(0),
      attributeValueIds: z.array(z.string().uuid()).optional()
    })).min(1, 'At least one variant is required')
  })
);

export const updateProductSchema = registry.register(
  'UpdateProductRequest',
  createProductSchema.partial()
);

export const productQuerySchema = z.object({
  page: z.string().optional().transform(val => (val ? parseInt(val) : 1)),
  limit: z.string().optional().transform(val => (val ? parseInt(val) : 10)),
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  brandId: z.string().uuid().optional()
});

export const productPaginatedResponseSchema = registry.register(
  'ProductPaginatedResponseSchema',
  paginatedResponseSchema.extend({
    data: z.array(z.object({
      id: z.string(),
      name: z.string(),
      code: z.string(),
      description: z.string().nullable(),
      category: z.object({name: z.string()}),
      brand: z.object({name: z.string()})
    }))
  })
);

export type TCreateProduct = z.infer<typeof createProductSchema>;
export type TUpdateProduct = z.infer<typeof updateProductSchema>;
export type TProductQuery = z.infer<typeof productQuerySchema>;
