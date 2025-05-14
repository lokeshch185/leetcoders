import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  
const JWT_SECRET = process.env.JWT_SECRET;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userid = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
