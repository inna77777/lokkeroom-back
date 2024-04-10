const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization?.split(" ")[1];
    const { id } = jwt.verify(token, "secret_key");
    req.user = { id };
    return next();
  } catch (err) {
    console.error("Error occurred:", err);
    return res.json({ error: "Error unauthorized" }, 401);
  }
};
