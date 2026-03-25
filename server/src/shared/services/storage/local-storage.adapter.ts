import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {TStorageAdapter, TUploadFile} from './storage.types';
import {config} from '../../config';

/**
 * Gold Standard: Local Storage Adapter
 * Saves files to server/uploads/ on disk.
 * Replace with S3StorageAdapter when moving to cloud hosting.
 */
export class LocalStorageAdapter implements TStorageAdapter {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), config.UPLOAD_DIR);
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, {recursive: true});
    }
  }

  async upload(file: TUploadFile): Promise<string> {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
    const filePath = path.join(this.uploadDir, uniqueName);

    await fs.promises.writeFile(filePath, file.buffer);

    // Return the relative key (used for URL generation and deletion)
    return uniqueName;
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(this.uploadDir, key);
    try {
      await fs.promises.unlink(filePath);
    } catch {
      // File may already be deleted — ignore
    }
  }

  getUrl(key: string): string {
    // Return a full URL so it passes z.url() validation
    return `http://localhost:${config.PORT}/uploads/${key}`;
  }
}
