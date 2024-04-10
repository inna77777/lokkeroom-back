const pool = require("../db");

module.exports = async (req, res, next) => {
  try {
    const { lobbyId } = req.params;
    const { id: currentUser } = req.user;

    const rows = await pool.query(
      "SELECT * FROM users_lobbies WHERE user_id = $1 AND lobby_id = $2 ",
      [currentUser, lobbyId]
    );

    if (rows.rowCount > 0) {
      return next();
    }

    return res.json({ error: "you are not in the lobby" }, 404);
  } catch (err) {
    console.error("Error occurred:", err);
    return res.json({ error: "Error server" }, 400);
  }
};
