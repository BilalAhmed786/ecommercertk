function checkUserRole(role) {
  return (req, res, next) => {
    const userRole = req.user?.userrole;

    if (userRole !== role) {
      console.log(`Access denied: Required ${role}, found ${userRole}`);
      return res.status(403).json({ message: `Access denied: Requires ${role}` });
    }

    return next();
  };
}

module.exports = checkUserRole;
