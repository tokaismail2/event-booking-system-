const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');

const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new ApiError('Authentication token missing', 401));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (error) {
    return next(new ApiError('Invalid or expired token', 401));
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  } else {
    return res.status(403).json({ message: 'Access denied, admin only' });
  }
}

  const isUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    return next();
  } else {
    return res.status(403).json({ message: 'Access denied, user only' });
  }
};

module.exports = { authenticateUser, isAdmin ,isUser};
