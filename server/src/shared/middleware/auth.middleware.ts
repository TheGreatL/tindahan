import {Response, NextFunction} from 'express';
import httpStatus from 'http-status';
import {TokenService} from '../services/token.service';
import {ApiResponse} from '../utils/api-response';
import {TAuthenticatedRequest, TJWTPayload} from '../types/auth.types';
import {Permission, RoleType} from '@prisma/client';
import rateLimit from 'express-rate-limit';

/**
 * Gold Standard Authentication:
 * Verifies the Bearer token and attaches the user payload to the request.
 */
export const authMiddleware = async (req: TAuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ApiResponse.error(res, 'Unauthorized - No token provided', httpStatus.UNAUTHORIZED);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await TokenService.verifyAccessToken(token) as TJWTPayload;
    req.user = decoded;
    next();
  } catch {
    return ApiResponse.error(res, 'Unauthorized - Invalid or expired token', httpStatus.UNAUTHORIZED);
  }
};

/**
 * Gold Standard Authorization:
 * Checks if the authenticated user has the required permissions or meets specialized criteria.
 */
export const authorize = (
  requiredPermissions: Permission[] = [],
  options: {allowSelf?: boolean; paramName?: string} = {allowSelf: false, paramName: 'id'}
) => {
  return (req: TAuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return ApiResponse.error(res, 'Unauthorized', httpStatus.UNAUTHORIZED);
    }

    // 1. Always allow Admins full access
    if (user.role.type === RoleType.ADMIN) {
      return next();
    }

    // 2. Check for "Self" access if enabled (e.g., user accessing their own profile)
    if (options.allowSelf && req.params[options.paramName || 'id'] === user.id) {
      return next();
    }

    // 3. Check for specific permissions
    const hasPermission = requiredPermissions.length === 0 || 
      requiredPermissions.some(p => user.role.permissions.includes(p));

    if (hasPermission) {
      return next();
    }

    return ApiResponse.error(
      res, 
      'Forbidden - You do not have permission to perform this action', 
      httpStatus.FORBIDDEN
    );
  };
};

/**
 * Shorthand: Only allows Admin users
 */
export const isAdmin = authorize([], {allowSelf: false});

export const authAttemptLimiter = rateLimit({
  windowMs: 1000 * 60 * 15,
  limit: 8,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req, res) => {
    ApiResponse.error(res, 'Too many attempts. Please try again after 15 minutes.', 429);
  }
});

