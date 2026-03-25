import {describe, it, expect, vi, beforeEach} from 'vitest';
import {RoleService} from '../../src/features/role/role.service';
import {RoleRepository} from '../../src/features/role/role.repository';
import {Permission, RoleType} from '@prisma/client';

vi.mock('../../src/features/role/role.repository');

describe('RoleService', () => {
  let service: RoleService;
  let repository: any;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new RoleService();
    // Manually inject mock repository if needed
    repository = {
      findByName: vi.fn(),
      create: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      getAll: vi.fn()
    };
    (service as any).repository = repository;
  });

  it('should create a role', async () => {
    const roleData = {
      name: 'New Role',
      description: 'Test',
      type: RoleType.EMPLOYEE,
      permissions: [Permission.POS_ACCESS]
    };

    repository.findByName.mockResolvedValue(null);
    repository.create.mockResolvedValue({id: 'role-id', ...roleData});

    const result = await service.createRole(roleData);
    expect(result.id).toBe('role-id');
    expect(repository.create).toHaveBeenCalled();
  });
});
