import multer from 'multer';
import {Request, Response, NextFunction} from 'express';
import {ApiResponse} from '../utils/api-response';
import httpStatus from 'http-status';

/**
 * Gold Standard: Upload Middleware
 * Uses memoryStorage so the storage adapter handles persistence.
 * This keeps multer decoupled from the storage backend.
 */
const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`));
    }
  }
});

/**
 * Middleware for single file upload.
 * Usage: uploadSingle('file') in route definition.
 */
export const uploadSingle = (fieldName: string = 'file') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const handler = upload.single(fieldName);
    handler(req, res, (err: unknown) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return ApiResponse.error(res, `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`, httpStatus.BAD_REQUEST);
        }
        return ApiResponse.error(res, err.message, httpStatus.BAD_REQUEST);
      }
      if (err instanceof Error) {
        return ApiResponse.error(res, err.message, httpStatus.BAD_REQUEST);
      }
      next();
    });
  };
};

/**
 * Middleware for multiple file upload.
 * Usage: uploadMultiple('files', 10) in route definition.
 */
export const uploadMultiple = (fieldName: string = 'files', maxCount: number = 10) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const handler = upload.array(fieldName, maxCount);
    handler(req, res, (err: unknown) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return ApiResponse.error(res, `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`, httpStatus.BAD_REQUEST);
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return ApiResponse.error(res, `Too many files. Maximum is ${maxCount}`, httpStatus.BAD_REQUEST);
        }
        return ApiResponse.error(res, err.message, httpStatus.BAD_REQUEST);
      }
      if (err instanceof Error) {
        return ApiResponse.error(res, err.message, httpStatus.BAD_REQUEST);
      }
      next();
    });
  };
};
