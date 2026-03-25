import {describe, it, expect, vi, beforeEach} from 'vitest';
import fs from 'fs';
import {LocalStorageAdapter} from '../../src/shared/services/storage/local-storage.adapter';

vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    promises: {
      writeFile: vi.fn(),
      unlink: vi.fn()
    }
  }
}));

describe('LocalStorageAdapter', () => {
  let adapter: LocalStorageAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new LocalStorageAdapter();
  });

  it('should create upload directory if it does not exist', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    new LocalStorageAdapter();
    expect(fs.mkdirSync).toHaveBeenCalled();
  });

  it('should upload a file and return a unique key', async () => {
    const file = {
      buffer: Buffer.from('test'),
      originalname: 'test.png',
      mimetype: 'image/png',
      size: 4
    };

    const key = await adapter.upload(file);
    expect(key).toContain('.png');
    expect(fs.promises.writeFile).toHaveBeenCalled();
  });
});
