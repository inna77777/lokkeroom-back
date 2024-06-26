const pool = require("../db");

exports.createLobby = async (req, res) => {
  const { name } = req.body;
  const { private } = req.body;
  const { id } = req.user;
  try {
    const insertedValues = await pool.query(
      "INSERT INTO lobbies (name, private) VALUES($1, $2) RETURNING *",
      [name, private]
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
      "SELECT u.id, u.login,u.nickname,u.created_at, ul.lobby_id FROM users u INNER JOIN users_lobbies ul ON u.id = ul.user_id WHERE ul.lobby_id = $1 order by u.nickname asc",
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
      "SELECT u.nickname, m.* FROM messages m inner join users u on u.id = m.user_id WHERE lobby_id = $1 order  by m.created_at asc",
      [lobbyId]
    );
    res.json({ messages: messages.rows });
  } catch (err) {
    console.error("Error occurred get l:", err);
    res.json({ error: "Internal Server Error" });
  }
};

exports.getLobbyInfo = async (req, res) => {
  const { lobbyId } = req.params;
  try {
    const info = await pool.query(
      "SELECT l.*, count(*) as count, ul2.user_id as admin_id FROM lobbies l inner join users_lobbies ul on l.id = ul.lobby_id left join users_lobbies ul2 on l.id = ul2.lobby_id and ul2.admin = true where l.id = $1 group by l.id, ul2.user_id limit 1",
      [lobbyId]
    );
    res.json({ info: info.rows[0] });
  } catch (err) {
    console.error("Error occurred get l:", err);
    res.json({ error: "Internal Server Error" });
  }
};

exports.addUserToLobby = async (req, res) => {
  const { lobbyId } = req.params;
  const { userId } = req.params;

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
  const { userId } = req.params;

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
  const { id } = req.user;
  try {
    const userLobbies = await pool.query(
      `SELECT l.id, l.name,
        CASE
          WHEN COUNT(m.id) > 0 THEN MAX(m.created_at)
          ELSE l.created_at
            END AS latest_message_time
      FROM lobbies l
      LEFT JOIN messages m ON l.id = m.lobby_id
      INNER JOIN users_lobbies ul ON l.id = ul.lobby_id
      WHERE ul.user_id = $1
      GROUP BY l.id
      ORDER BY
        CASE
          WHEN COUNT(m.id) > 0 THEN MAX(m.created_at)
          ELSE l.created_at
        END DESC;`,
      [id]
    );
    res.json({ lobbies: userLobbies.rows });
  } catch (err) {
    console.error("Error occurred while getting user lobbies:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getPlatformUsersLobbies = async (req, res, next) => {
  const { id } = req.user;
  try {
    const users = await pool.query("SELECT * FROM users WHERE id != $1", [id]);

    const lobbies = await pool.query(
      `SELECT 
    l.*, 
    COUNT(DISTINCT ul.user_id) as user_count
FROM 
    lobbies l
INNER JOIN 
    users_lobbies ul ON l.id = ul.lobby_id
WHERE 
    l.id NOT IN (SELECT ul.lobby_id FROM users_lobbies ul WHERE ul.user_id = $1) 
    AND l.private = false
GROUP BY 
    l.id;`,
      [id]
    );
    res.json({ users: users.rows, lobbies: lobbies.rows });
  } catch (err) {
    console.error("Error occurred while getting user lobbies:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteUserFromLobby = async (req, res, next) => {
  const { userId, lobbyId } = req.params;
  try {
    const isAdmin = await pool.query(
      "SELECT EXISTS (SELECT 1 FROM public.users_lobbies WHERE user_id = $1 AND lobby_id = $2 AND admin)",
      [userId, lobbyId]
    );

    if (isAdmin.rows[0].exists) {
      await pool.query("DELETE FROM public.messages WHERE lobby_id = $1", [
        lobbyId,
      ]);
      await pool.query("DELETE FROM public.users_lobbies WHERE lobby_id = $1", [
        lobbyId,
      ]);
      await pool.query("DELETE FROM public.lobbies WHERE id = $1", [lobbyId]);
    } else {
      await pool.query(
        "DELETE FROM public.users_lobbies WHERE user_id = $1 AND lobby_id = $2",
        [userId, lobbyId]
      );
    }
    res.json("user was deleted");
  } catch (err) {
    console.error(err);
  }
};
