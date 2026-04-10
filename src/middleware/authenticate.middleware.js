import logger from '#config/logger.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

/**
 * Authentication Middleware
 * Reads JWT from HTTP-only cookie and attaches decoded user data to req.user
 *
 * Usage:
 *   app.use(authenticate); // Apply globally
 *   or
 *   router.get('/protected', authenticate, requireAuth, controller); // Apply to specific routes
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const authenticate = (req, res, next) => {
  try {
    // Try to get token from cookies
    const token = cookies.get(req, 'token');

    // If no token, continue to next middleware (let route handle it)
    if (!token) {
      logger.debug('No token found in cookies', {
        path: req.path,
        method: req.method,
        ip: req.ip
      });
      return next();
    }

    // Verify and decode token
    const decoded = jwttoken.verify(token);

    // Attach user data to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    logger.info('User authenticated successfully', {
      userId: req.user.id,
      userEmail: req.user.email,
      userRole: req.user.role,
      path: req.path,
      method: req.method
    });

    next();
  } catch (error) {
    logger.warn('Token verification failed', {
      error: error.message,
      path: req.path,
      method: req.method,
      ip: req.ip
    });

    // Token is invalid/expired, continue to next middleware
    // Let the authorization middleware handle rejection
    return next();
  }
};

/**
 * Strict Authentication Middleware
 * Rejects request immediately if no valid token is provided
 *
 * Usage:
 *   router.get('/protected', authenticateStrict, controller);
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const authenticateStrict = (req, res, next) => {
  try {
    // Try to get token from cookies
    const token = cookies.get(req, 'token');

    // If no token, reject immediately
    if (!token) {
      logger.warn('Authentication failed - no token provided', {
        path: req.path,
        method: req.method,
        ip: req.ip
      });
      return res.status(401).json({
        message: 'Unauthorized. No authentication token provided.',
        error: 'MISSING_TOKEN'
      });
    }

    // Verify and decode token
    const decoded = jwttoken.verify(token);

    // Attach user data to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    logger.info('User authenticated successfully', {
      userId: req.user.id,
      userEmail: req.user.email,
      userRole: req.user.role,
      path: req.path,
      method: req.method
    });

    next();
  } catch (error) {
    logger.warn('Token verification failed', {
      error: error.message,
      path: req.path,
      method: req.method,
      ip: req.ip
    });

    // Token is invalid/expired
    return res.status(401).json({
      message: 'Unauthorized. Invalid or expired authentication token.',
      error: 'INVALID_TOKEN'
    });
  }
};

export default authenticate;

