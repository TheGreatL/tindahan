import {extendZodWithOpenApi} from '@asteasolutions/zod-to-openapi';
import {z} from 'zod';
import {registry} from '../../../shared/lib/openapi-registry';

extendZodWithOpenApi(z);

export const createAttributeSchema = registry.register(
  'CreateAttributeRequest',
  z.object({
    name: z.string().min(1, 'Attribute name is required')
  })
);

export const updateAttributeSchema = registry.register('UpdateAttributeRequest', createAttributeSchema.partial());

export const createAttributeValueSchema = registry.register(
  'CreateAttributeValueRequest',
  z.object({
    attributeId: z.uuid(),
    value: z.string().min(1, 'Value is required')
  })
);

export const updateAttributeValueSchema = registry.register(
  'UpdateAttributeValueRequest',
  createAttributeValueSchema.partial()
);

export type TCreateAttribute = z.infer<typeof createAttributeSchema>;
export type TUpdateAttribute = z.infer<typeof updateAttributeSchema>;
export type TCreateAttributeValue = z.infer<typeof createAttributeValueSchema>;
export type TUpdateAttributeValue = z.infer<typeof updateAttributeValueSchema>;
