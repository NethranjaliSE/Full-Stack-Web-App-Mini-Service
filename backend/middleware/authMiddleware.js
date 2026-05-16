import jwt from "jsonwebtoken";


export const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    try {
      token = token.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "super_secret_interview_key",
      );
      req.user = decoded; 
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Not authorized, token validation failed" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, missing session token" });
  }
};

// Role authorization filter factory
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message: `Access denied. Action restricted to: ${allowedRoles.join(", ")}`,
        });
    }
    next();
  };
};
