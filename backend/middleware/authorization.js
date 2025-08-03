const jwt = require('jsonwebtoken');

const Authorize = (req, res, next) => {
  const token = req.cookies.token;
 
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log('decoded user:', decoded); 
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = Authorize;
