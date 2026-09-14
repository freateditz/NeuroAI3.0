import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          detail: 'Invalid authentication credentials'
        });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({
        success: false,
        detail: error.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token'
      });
    }
  } else {
    res.status(401).json({
      success: false,
      detail: 'Not authorized, no token'
    });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        detail: `Role ${req.user?.role || 'guest'} is not authorized to access this resource. Required roles: ${roles.join(', ')}`
      });
    }
    next();
  };
};
