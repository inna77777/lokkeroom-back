const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message");
const authGuard = require("../guards/authGuard");
const lobbyGuard = require("../guards/lobbyGuard");
const messageGuard = require("../guards/messageGuard");

router.post(
  "/api/lobby/:lobbyId",
  authGuard,
  lobbyGuard,
  messageController.postMessage
);
router.patch(
  "/api/lobby/message/:messageId",
  authGuard,
  messageGuard,
  messageController.updateMessage
);
router.delete(
  "/api/messages/:messageId",
  authGuard,
  messageGuard,
  messageController.deleteMessage
);
router.post(
  "/api/chat/user/:recId",
  authGuard,
  messageController.sendUserToUserMess
);

router.get("/api/user/chats", authGuard, messageController.getUserChats);


router.get("/api/chat/:chatId", authGuard, messageController.getChatMessages);

module.exports = router;
