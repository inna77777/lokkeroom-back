const pool = require("../db");

exports.createLobby = async (req, res) => {
  const { name } = req.body;
  const { id } = req.user;
  try {
    const insertedValues = await pool.query(
      "INSERT INTO lobbies (name) VALUES($1) RETURNING *",
      [name]
    );
    await pool.query(
      "INSERT INTO users_lobbies (user_id, lobby_id, admin) VALUES($1, $2, $3)",
      [id, insertedValues.rows[0].id, true]
    );
    res.json({ message: "Lobby was created", lobby: insertedValues.rows[0] });
  } catch (err) {
    console.error("Error occurred:", err);
    res.json({ error: "Internal Server Error creating lobby" });
  }
};

exports.getLobbyUser = async (req, res) => {
  const { userId } = req.params;
  const { lobbyId } = req.params;

  try {
    const userInfo = await pool.query(
      "SELECT u.nickname, u.description  FROM users u LEFT JOIN users_lobbies ul ON u.id = ul.user_id WHERE user_id = $1 AND lobby_id = $2",
      [userId, lobbyId]
    );
    if (userInfo.rowCount > 0) {
      return res.json({ user: userInfo.rows[0] });
    }

    res.json({ error: "user not found" });
  } catch (err) {
    console.error("Error occurred while adding user to lobby:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getLobbyUsers = async (req, res) => {
  const { lobbyId } = req.params;

  try {
    const userInLobby = await pool.query(
      "SELECT u.id, u.login, ul.lobby_id FROM users u INNER JOIN users_lobbies ul ON u.id = ul.user_id WHERE ul.lobby_id = $1",
      [lobbyId]
    );
    res.json({
      users: userInLobby.rows,
    });
  } catch (err) {
    console.error("Error occurred while adding user to lobby:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getLobbySingleMessages = async (req, res) => {
  const { lobbyId, messageId } = req.params;
  try {
    const message = await pool.query(
      "SELECT * FROM messages WHERE lobby_id = $1 and id = $2",
      [lobbyId, messageId]
    );
    res.json({ message: message.rows[0] });
  } catch (err) {
    console.error("Error occurred l/m:", err);
    res.json({ error: "Internal Server Error" });
  }
};
exports.getLobbyMessages = async (req, res) => {
  const { lobbyId } = req.params;
  try {
    const messages = await pool.query(
      "SELECT * FROM messages WHERE lobby_id = $1",
      [lobbyId]
    );
    res.json({ messages: messages.rows });
  } catch (err) {
    console.error("Error occurred get l:", err);
    res.json({ error: "Internal Server Error" });
  }
};

exports.addUserToLobby = async (req, res) => {
  const { lobbyId } = req.params;
  const { userId } = req.body;

  try {
    const userInLobby = await pool.query(
      "SELECT * FROM users_lobbies WHERE user_id = $1 AND lobby_id = $2",
      [userId, lobbyId]
    );
    if (userInLobby.rows.length > 0) {
      return res.json({ error: "User is already in the lobby" });
    }
    await pool.query(
      "INSERT INTO users_lobbies (user_id, lobby_id, admin) VALUES($1, $2, $3)",
      [userId, lobbyId, false]
    );

    res.json({
      message: "user has been added",
    });
  } catch (err) {
    console.error("Error occurred while adding user to lobby:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.removeUserFromLobby = async (req, res) => {
  const { lobbyId } = req.params;
  const { userId } = req.body;

  try {
    const userInLobby = await pool.query(
      "SELECT * FROM users_lobbies WHERE user_id = $1 AND lobby_id = $2",
      [userId, lobbyId]
    );
    if (!userInLobby.rows.length > 0) {
      return res.json({ error: "User is not in the lobby" });
    }
    console.log(lobbyId, userId);
    await pool.query(
      "DELETE FROM users_lobbies WHERE  user_id = $1 AND lobby_id = $2",
      [userId, lobbyId]
    );

    res.json({
      message: "user has been DELETED from the lobby",
    });
  } catch (err) {
    console.error("Error occurred while adding user to lobby:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserLobbies = async (req, res, next) => {
  const { userId } = req.user;
  try {
    const userLobbies = await pool.query(
      "SELECT l.* FROM lobbies l INNER JOIN users_lobbies ul ON l.id = ul.lobby_id WHERE ul.user_id = $1",
      [id]
    );
    res.json({ lobbies: userLobbies.rows });
  } catch (err) {
    console.error("Error occurred while getting user lobbies:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
