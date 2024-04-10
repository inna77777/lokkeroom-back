const pool = require('../db')

module.exports = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const rows = await pool.query("SELECT * FROM messages WHERE id = $1", [
      messageId,
    ]);
    if (rows.rowCount > 0) {
      return next();
    }
    return res.json({ error: "Message not found" }, 404);
  } catch (err) {
    console.error("Error occurred messageGuard:", err);
    return res.json({ error: "Error server messageGuard;" }, 400);
  }
};
