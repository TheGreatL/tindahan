import {describe, it, expect, vi, beforeEach} from 'vitest';
import {UserService} from '../../src/features/user/user.service';
import {UserRepository} from '../../src/features/user/user.repository';
import bcrypt from 'bcrypt';

vi.mock('../../src/features/user/user.repository');
vi.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let repository: any;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new UserService();
    repository = (service as any).userRepository;
  });

  it('should create a user with hashed password', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      roleId: 'role-id'
    };

    repository.findByEmail.mockResolvedValue(null);
    vi.mocked(bcrypt.hash).mockResolvedValue('hashed-password' as any);
    repository.create.mockResolvedValue({id: 'user-id', ...userData, password: 'hashed-password'});

    const result = await service.createUser(userData);
    expect(result.id).toBe('user-id');
  });
});
