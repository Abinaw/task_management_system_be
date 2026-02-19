const jwt = require("jsonwebtoken");
const { UnauthorizedException } = require("../errors/AppError");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedException("Unauthorized, no token");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    throw new UnauthorizedException("Unauthorized, invalid token");
  }
};

module.exports = { protect };
