const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "supersecreto";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No autorizado" });
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token faltante" });
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

module.exports = authMiddleware;
