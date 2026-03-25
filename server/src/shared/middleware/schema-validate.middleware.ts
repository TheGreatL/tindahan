import {Request, Response, NextFunction} from 'express';
import {ZodType} from 'zod';
import httpStatus from 'http-status';
import {ApiResponse} from '../utils/api-response';

export const validateSchema = (schema: ZodType, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[source]);
      Object.defineProperty(req, source, {
        value: parsed,
        writable: true,
        configurable: true,
        enumerable: true
      });
      next();
    } catch (err: any) {
      if (err.name === 'ZodError') {
        console.log(`Validation Error in ${source}:`, JSON.stringify({
          data: req[source],
          issues: err.issues
        }, null, 2));
        return ApiResponse.error(res, 'Validation error', httpStatus.BAD_REQUEST, err.issues);
      }
      next(err);
    }
  };
};
