import jwt from 'jsonwebtoken';

// Manually define JWT secret
const JWT_SECRET = 'Tarun'; // Static JWT secret

export const fetchuser = (req, res, next) => {
  const token = req.header('authToken');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Log the JWT secret to the console when verifying

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    // Ensure the token contains the 'user' object with 'id'
    if (!decoded.user || !decoded.user.id) {
      return res.status(400).json({ message: 'Invalid token structure' });
    }
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

