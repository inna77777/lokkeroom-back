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
router.patch(
  "/api/chat/message/:messageId",
  authGuard,
  messageController.updateChatMessage
);

router.delete(
  "/api/chat/messages/:messageId",
  authGuard,
  messageController.deleteChatMessage
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

router.get("/api/chat/friend/:userId", authGuard, messageController.getChatUser);
router.delete("/delete/chat/:chatId", authGuard, messageController.deleteChat);

module.exports = router;
