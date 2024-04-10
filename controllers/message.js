const pool = require("../db");

exports.postMessage = async (req, res) => {
  const { message } = req.body;
  const { id: userId } = req.user;
  const { lobbyId } = req.params;
  try {
    const insertedValues = await pool.query(
      "INSERT INTO messages (content, user_id, lobby_id) VALUES($1, $2, $3) RETURNING *",
      [message, userId, lobbyId]
    );
    res.json({ message: insertedValues.rows[0] });
  } catch (err) {
    console.error("Error occurred:", err);
    res.json({ error: "Internal Server Error" });
  }
};

exports.updateMessage = async (req, res) => {
  const { messageId } = req.params;
  const { id: userId } = req.user;
  const { message: newMessageContent } = req.body;

  try {
    const isUserWhoCreatedMess = await pool.query(
      "SELECT * FROM messages WHERE id = $1 AND user_id = $2",
      [messageId, userId]
    );

    if (isUserWhoCreatedMess.rowCount > 0) {
      const oldMessage = await pool.query(
        "SELECT * FROM messages WHERE id = $1",
        [messageId]
      );

      await pool.query(
        "UPDATE messages SET content = $1 WHERE id = $2 AND user_id = $3",
        [newMessageContent, messageId, userId]
      );

      return res.json({
        message: "Message updated successfully",
        oldContent: oldMessage.rows[0].content,
        newContent: newMessageContent,
      });
    }

    const isAdminOfTheLobby = await pool.query(
      "SELECT * FROM messages m INNER JOIN users_lobbies ul ON m.lobby_id = ul.lobby_id WHERE m.id = $1 AND ul.user_id = $2",
      [messageId, userId]
    );

    if (isAdminOfTheLobby.rows[0].admin) {
      const oldMessage = await pool.query(
        "SELECT * FROM messages WHERE id = $1",
        [messageId]
      );

      await pool.query("UPDATE messages SET content = $1 WHERE id = $2", [
        newMessageContent,
        messageId,
      ]);

      return res.json({
        message: "Message updated successfully",
        oldContent: oldMessage.rows[0].content,
        newContent: newMessageContent,
      });
    }

    res.json({
      error: "You are not authorized to update this message",
    });
  } catch (err) {
    console.error("Error occurred while updating message:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const { id: userId } = req.user;

  try {
    const isUserWhoCreatedMess = await pool.query(
      "SELECT * FROM messages WHERE id = $1 AND user_id = $2",
      [messageId, userId]
    );

    if (isUserWhoCreatedMess.rowCount > 0) {
      await pool.query("DELETE FROM messages WHERE id = $1 AND user_id = $2", [
        messageId,
        userId,
      ]);
      return res.json({ message: "message was deleted" });
    }

    const isAdminOfTheLobby = await pool.query(
      "SELECT * FROM messages m INNER JOIN users_lobbies ul ON m.lobby_id = ul.lobby_id WHERE m.id = $1 AND ul.user_id = $2",
      [messageId, userId]
    );
    console.log(isAdminOfTheLobby.rows[0]);

    if (isAdminOfTheLobby.rows[0].admin) {
      await pool.query("DELETE FROM messages WHERE id = $1", [messageId]);
      return res.json({ message: "message was deleted" });
    }

    res.json({
      message: "blabla",
    });
  } catch (err) {
    console.error("Error occurred while adding user to lobby:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.sendUserToUserMess = async (req, res) => {
  const { recId } = req.params;
  const { id: userId } = req.user;
  const { message } = req.body;

  try {
    const inputedValues = await pool.query(
      "INSERT INTO private_messages (content, user_sender_id, user_receiver_id) VALUES($1,$2,$3) RETURNING *",
      [message, userId, recId]
    );
    res.json({
      message: "message was sent",
      content: inputedValues.rows[0],
    });
  } catch (err) {
    console.error("Error occurred while adding user to lobby:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};