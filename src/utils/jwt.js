import jwt from 'jsonwebtoken';
import logger from '#config/logger.js';

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change it before production';
const JWT_EXPIRES_IN = '1d';

export const jwttoken = {
  sign: payload => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (error) {
      logger.error('Failed to authenticate token');
      throw new Error('Failed to authenticate token', { cause: error });
    }
  },
  verify: token => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.error('Failed to authenticate token', error);
      throw new Error('Failed to authenticate token', { cause: error });
    }
  },
};
