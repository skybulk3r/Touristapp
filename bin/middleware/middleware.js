const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      status: 'fail',
      message: 'Access denied. No token provided.',
    });
  }

  const token = authHeader.split(' ')[1]; 
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired token. Please authenticate.',
    });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 1) {
    return next();
  } else {
    console.warn('Unauthorized Access Attempt (Admin):', req.user); a
    return res.status(403).json({
      status: 'fail',
      message: 'Access denied. Admins only.',
    });
  }
};

const verifyUser = (req, res, next) => {
  if (req.user && req.user.role === 2) {
    return next();
  } else {
    console.warn('Unauthorized Access Attempt (User):', req.user); 
    return res.status(403).json({
      status: 'fail',
      message: 'Access denied. Registered users only.',
    });
  }
};

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyUser,
};