const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = 'your_jwt_secret'; // Replace with your actual JWT secret
const REFRESH_TOKEN_SECRET = 'your_refresh_secret'; // Replace with your actual refresh token secret

const generateToken = (payload, isRefreshToken = false) => {
  const secret = isRefreshToken ? REFRESH_TOKEN_SECRET : ACCESS_TOKEN_SECRET;
  const expiresIn = isRefreshToken ? '77d' : '7d'; // Refresh token expires in 7 days, access token in 15 minutes
  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = { generateToken };