import {TokenService} from '../../src/shared/services/token.service';
import {RoleType} from '@prisma/client';

export class TestHelper {
  static async getAdminToken() {
    return await TokenService.signAccessToken({
      id: 'admin-id',
      email: 'admin@example.com',
      role: {
        name: 'Admin',
        type: RoleType.ADMIN,
        permissions: ['*'] as any
      }
    });
  }

  static async getCashierToken() {
    return await TokenService.signAccessToken({
      id: 'cashier-id',
      email: 'cashier@example.com',
      role: {
        name: 'Cashier',
        type: RoleType.EMPLOYEE,
        permissions: ['POS_ACCESS'] as any
      }
    });
  }
}
