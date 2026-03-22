// from schema.prisma
export const softDeleteModels = [
  'User',
  'UserRole',
  'Purchase',
  'PurchaseItem',
  'Sales',
  'Role',
  'Permission',
  'RolePermission',
  'Resource',
  'ProductCategory',
  'ProductBrand',
  'Product',
  'ProductImage',
  'Attribute',
  'AttributeValue',
  'VariantAttributeValue',
  'ProductVariant',
  'ProductInventory',
  'Expense',
  'Customer',
  'CustomerDebt',
  'CustomerDebtItem',
  'Session',
  'ActivityLog'
] as const;
export const nestedModelNamesWithSoftDelete = [
  'user',
  'userRole',
  'purchase',
  'purchaseItem',
  'sales',
  'role',
  'permission',
  'rolePermission',
  'resource',
  'productCategory',
  'productBrand',
  'product',
  'productImage',
  'attribute',
  'attributeValue',
  'variantAttributeValue',
  'productVariant',
  'productInventory',
  'expense',
  'customer',
  'customerDebt',
  'customerDebtItem',
  'session',
  'activityLog'
] as const;
export default function injectDeletedAtFilter(model: string, args: any, isNested: boolean = false) {
  if (!args) return args;

  // Check if current model is a soft-delete model
  const isSoftDeleteModel = (isNested ? nestedModelNamesWithSoftDelete : softDeleteModels).includes(
    model as never
  );

  if (isSoftDeleteModel) {
    if (args === true) {
      return {
        where: {
          deletedAt: null
        }
      };
    } else if (typeof args === 'object') {
      if (args.includeDeleted) {
        delete args.includeDeleted;
        return args;
      }

      if (args.onlyDeleted) {
        args.where = {...args.where, deletedAt: {not: null}};
        delete args.onlyDeleted;
        return args;
      }

      // Default: filter out deleted
      if (args.where) {
        args.where = {...args.where, deletedAt: null};
      } else {
        args.where = {deletedAt: null};
      }
    }
  }

  // Handle nested recursion for include, select, and methods like upsert
  if (typeof args === 'object') {
    if (args.include) {
      for (const key of Object.keys(args.include)) {
        if (args.include[key]) {
          args.include[key] = injectDeletedAtFilter(key, args.include[key], true);
        }
      }
    }

    if (args.select) {
      for (const key of Object.keys(args.select)) {
        if (typeof args.select[key] === 'object' || args.select[key] === true) {
          args.select[key] = injectDeletedAtFilter(key, args.select[key], true);
        }
      }
    }

    // Special handling for upsert where clause
    if (args.update && args.create && args.where && isSoftDeleteModel) {
      // For upsert, we want to ensure we're not upserting into a deleted record unless specified
      args.where = {...args.where, deletedAt: null};
    }
  }

  return args;
}
