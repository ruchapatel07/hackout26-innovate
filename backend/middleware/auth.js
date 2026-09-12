import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { UserStore } from '../models/dynamoTables.js';

export const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized — Missing or malformed Bearer Token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await UserStore.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Unauthorized — User account not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Unauthorized — Invalid or expired token' });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden — Access requires one of the following roles: [${roles.join(', ')}]`
      });
    }
    next();
  };
};
