const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Extract token from the "Authorization" header
  const token = req.headers["authorization"]?.split(" ")[1]; // Use optional chaining for safety
  if (!token) return res.status(401).send("Access denied. No token provided.");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid token.");
    req.user = user; // Attach user info to the request object
    next(); // Proceed to the next middleware or route handler
  });
};
