const jwt = require('jsonwebtoken');
const secretKey = 'secretKey';

function verifyToken(req, res, next) {
    // Get the token from the Authorization header
    const authorization = req.headers['authorization'];

    // Check if the token exists
    if (!authorization) {
      return res.status(401).json({ message: 'Token not provided' });
    }
  
    const token = req.headers.authorization.split(" ")[1];
    
    // Verify the token
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
  
      // Store the decoded token in the request object for further use
      req.user = decoded;
      next();
    });
  }
  
  module.exports = { verifyToken };