export function checkPermission(permission) {
  return (req, res, next) => {
    const admin = req.admin;
    if (!admin || !admin.permissions.includes(permission)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
    next();
  };
}