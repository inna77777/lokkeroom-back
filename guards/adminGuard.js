const pool = require("../db");

module.exports = async (req, res, next) => {
  const { id } = req.user;
  const { lobbyId } = req.params;
  try {
    const userInLobby = await pool.query(
      "SELECT * FROM users_lobbies WHERE user_id = $1 and lobby_id = $2",
      [id, lobbyId]
    );
    console.log(userInLobby.rows[0]);

    if (!userInLobby.rows[0].admin) {
      return res.json({ message: "only admins allowdeed to do it" });
    }
    next();
  } catch (err) {
    return res.json({ error: "Error in adminGuards" });
  }
};
