import logger from '#config/logger.js';

/**
 * Middleware to check if user is authenticated
 */
export const requireAuth = (req, res, next) => {
  if (!req.user) {
    logger.warn('Unauthorized access attempt', {
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
    return res.status(401).json({
      message: 'Unauthorized. Please login first.',
      error: 'UNAUTHORIZED',
    });
  }
  next();
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    logger.warn('Unauthorized access attempt - no user', {
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
    return res.status(401).json({
      message: 'Unauthorized. Please login first.',
      error: 'UNAUTHORIZED',
    });
  }

  if (req.user.role !== 'admin') {
    logger.warn('Forbidden access attempt - non-admin user', {
      userId: req.user.id,
      userRole: req.user.role,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
    return res.status(403).json({
      message: 'Forbidden. Admin access required.',
      error: 'FORBIDDEN',
    });
  }

  next();
};

/**
 * Middleware to allow users to access only their own data, or admins to access any
 * Usage: requireAuthOrAdmin(req, res, next) before controller
 */
export const requireAuthOrAdmin = (req, res, next) => {
  if (!req.user) {
    logger.warn('Unauthorized access attempt', {
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
    return res.status(401).json({
      message: 'Unauthorized. Please login first.',
      error: 'UNAUTHORIZED',
    });
  }

  const targetUserId = parseInt(req.params.id);
  const isOwnData = req.user.id === targetUserId;
  const isAdmin = req.user.role === 'admin';

  if (!isOwnData && !isAdmin) {
    logger.warn('Forbidden access attempt - accessing other users data', {
      userId: req.user.id,
      userRole: req.user.role,
      targetUserId,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
    return res.status(403).json({
      message: 'Forbidden. You can only access your own information.',
      error: 'FORBIDDEN',
    });
  }

  next();
};
