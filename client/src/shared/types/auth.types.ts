export enum RoleType {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

export enum Permission {
  // POS Permissions
  POS_ACCESS = 'POS_ACCESS',
  POS_VOID_SALE = 'POS_VOID_SALE',
  POS_REPRINT_RECEIPT = 'POS_REPRINT_RECEIPT',

  // Inventory Permissions
  INVENTORY_VIEW = 'INVENTORY_VIEW',
  INVENTORY_EDIT = 'INVENTORY_EDIT',
  INVENTORY_ADD_STOCK = 'INVENTORY_ADD_STOCK',
  INVENTORY_RECORDS_DELETE = 'INVENTORY_RECORDS_DELETE',

  // Customer Permissions
  CUSTOMER_VIEW = 'CUSTOMER_VIEW',
  CUSTOMER_EDIT = 'CUSTOMER_EDIT',
  CUSTOMER_DELETE = 'CUSTOMER_DELETE',

  // Financial Permissions
  FINANCIALS_VIEW = 'FINANCIAL_VIEW',
  FINANCIALS_MANAGE_EXPENSES = 'FINANCIALS_MANAGE_EXPENSES',
  FINANCIALS_PROFIT_LOSS_VIEW = 'FINANCIALS_PROFIT_LOSS_VIEW',

  // User/Employee Management
  USER_VIEW = 'USER_VIEW',
  USER_MANAGE_ROLES = 'USER_MANAGE_ROLES',
  USER_DELETE = 'USER_DELETE',

  // System
  SYSTEM_SETTINGS = 'SYSTEM_SETTINGS',
  SYSTEM_BACKUP = 'SYSTEM_BACKUP',
}

export interface TRole {
  id: string
  name: string
  description?: string | null
  type: RoleType
  permissions: Permission[]
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  _count?: {
    users: number
  }
}
