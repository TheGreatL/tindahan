import {Request, Response} from 'express';
import {asyncHandler} from '../../shared/utils/async-handler';
import {ApiResponse} from '../../shared/utils/api-response';
import {getStorageAdapter} from '../../shared/services/storage/storage.config';
import httpStatus from 'http-status';

const storage = getStorageAdapter();

export class UploadController {
  /**
   * @swagger
   * /upload:
   *   post:
   *     summary: Upload a single file
   *     tags: [Upload]
   */
  static uploadSingle = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return ApiResponse.error(res, 'No file provided', httpStatus.BAD_REQUEST);
    }

    const key = await storage.upload({
      buffer: req.file.buffer,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    const url = storage.getUrl(key);

    return ApiResponse.success(res, {key, url}, 'File uploaded successfully', 201);
  });

  /**
   * @swagger
   * /upload/multiple:
   *   post:
   *     summary: Upload multiple files
   *     tags: [Upload]
   */
  static uploadMultiple = asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return ApiResponse.error(res, 'No files provided', httpStatus.BAD_REQUEST);
    }

    const results = await Promise.all(
      files.map(async (file) => {
        const key = await storage.upload({
          buffer: file.buffer,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size
        });
        return {key, url: storage.getUrl(key)};
      })
    );

    return ApiResponse.success(res, results, 'Files uploaded successfully', 201);
  });

  /**
   * @swagger
   * /upload/{key}:
   *   delete:
   *     summary: Delete an uploaded file
   *     tags: [Upload]
   */
  static deleteFile = asyncHandler(async (req: Request, res: Response) => {
    const key = req.params.key as string;

    if (!key) {
      return ApiResponse.error(res, 'File key is required', httpStatus.BAD_REQUEST);
    }

    await storage.delete(key);

    return ApiResponse.success(res, null, 'File deleted successfully');
  });
}
