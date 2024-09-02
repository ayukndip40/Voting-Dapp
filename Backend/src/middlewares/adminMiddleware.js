// Middleware to check if user is an admin
const adminAuth = (req, res, next) => {
  // Check if user is authenticated and has admin role
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Unauthorized' });
  }
  next();
};

module.exports = {adminAuth};
