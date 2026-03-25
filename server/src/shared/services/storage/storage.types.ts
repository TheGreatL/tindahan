/**
 * Gold Standard: Storage Adapter Interface
 * All storage implementations (local, S3, GCS) must implement this interface.
 * Swap adapters by changing the STORAGE_DRIVER env var.
 */
export interface TStorageAdapter {
  /**
   * Upload a file buffer and return its public-facing key/path.
   */
  upload(file: TUploadFile): Promise<string>;

  /**
   * Delete a file by its key/path.
   */
  delete(key: string): Promise<void>;

  /**
   * Get the full public URL for a stored file key.
   */
  getUrl(key: string): string;
}

export interface TUploadFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}
