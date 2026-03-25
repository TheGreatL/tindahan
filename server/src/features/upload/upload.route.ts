import {Router} from 'express';
import {UploadController} from './upload.controller';
import {authMiddleware} from '../../shared/middleware/auth.middleware';
import {uploadSingle, uploadMultiple} from '../../shared/middleware/upload.middleware';

const route = Router();

// Single file upload
route.post(
  '/',
  authMiddleware,
  uploadSingle('file'),
  UploadController.uploadSingle
);

// Multiple files upload
route.post(
  '/multiple',
  authMiddleware,
  uploadMultiple('files', 10),
  UploadController.uploadMultiple
);

// Delete an uploaded file
route.delete(
  '/:key',
  authMiddleware,
  UploadController.deleteFile
);

export default route;
