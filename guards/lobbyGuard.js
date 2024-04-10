const pool = require('../db');

module.exports = async (req, res, next) => {
  try {
    const { lobbyId } = req.params;
    const rows = await pool.query("SELECT * FROM lobbies WHERE id = $1", [
      lobbyId,
    ]);

    if (rows.rowCount > 0) {
      return next();
    }
    return res.json({ error: "Lobby not found" }, 404);
  } catch (err) {
    console.error("Error occurred:", err);
    return res.json({ error: "Error server" }, 400);
  }
};