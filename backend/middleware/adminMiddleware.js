/**
 * adminMiddleware.js - Restrict route access to admin users only
 * Use after authMiddleware so req.user is already set.
 */

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

module.exports = { adminOnly };
