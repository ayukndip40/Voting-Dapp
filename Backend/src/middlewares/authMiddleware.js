const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const ACCESS_TOKEN_SECRET = 'your_jwt_secret';
const REFRESH_TOKEN_SECRET = 'your_refresh_secret';

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const refreshToken = req.headers['x-refresh-token'];

  if (!authHeader) {
    return res.status(401).json({ msg: 'Access token is required' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ msg: 'Access token is required' });
  }

  try {
    // Verify the access token
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = await User.findById(decoded.user.id); // Attach user to request object
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError' && refreshToken) {
      try {
        // Verify the refresh token
        const decodedRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

        // Issue a new access token
        const newAccessToken = jwt.sign(
          { user: { id: decodedRefreshToken.user.id } },
          ACCESS_TOKEN_SECRET,
          { expiresIn: '15m' }
        );

        // Send the new access token to the client
        res.setHeader('Authorization', `Bearer ${newAccessToken}`);
        
        // Attach the user to the request object
        req.user = await User.findById(decodedRefreshToken.user.id);

        return next();
      } catch (refreshError) {
        return res.status(403).json({ msg: 'Invalid or expired refresh token' });
      }
    }
    return res.status(403).json({ msg: 'Invalid or expired token' });
  }
};

module.exports = { authenticateToken };
