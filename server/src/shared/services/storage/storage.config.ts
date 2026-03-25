import {TStorageAdapter} from './storage.types';
import {LocalStorageAdapter} from './local-storage.adapter';
import {config} from '../../config';

/**
 * Gold Standard: Storage Factory
 * Returns the correct storage adapter based on the STORAGE_DRIVER env var.
 * To add a new driver (e.g. S3), create the adapter class and add a case here.
 */
let storageInstance: TStorageAdapter | null = null;

export function getStorageAdapter(): TStorageAdapter {
  if (!storageInstance) {
    switch (config.STORAGE_DRIVER) {
      case 'local':
      default:
        storageInstance = new LocalStorageAdapter();
        break;
      // Future: case 's3': storageInstance = new S3StorageAdapter(); break;
      // Future: case 'gcs': storageInstance = new GCSStorageAdapter(); break;
    }
  }
  return storageInstance;
}
