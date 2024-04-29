const express = require("express");
const router = express.Router();
const lobbyController = require("../controllers/lobby");
const authGuard = require("../guards/authGuard");
const adminGuard = require("../guards/adminGuard");
const lobbyGuard = require("../guards/lobbyGuard");
const lobbyUserGuard = require("../guards/lobbyUserGuard");

router.post("/api/lobbies", authGuard, lobbyController.createLobby);
router.get(
  "/api/lobby/:lobbyId/user/:userId",
  authGuard,
  lobbyGuard,
  lobbyController.getLobbyUser
);
router.get(
  "/api/lobby/:lobbyId/users",
  authGuard,
  lobbyGuard,
  lobbyUserGuard,
  lobbyController.getLobbyUsers
);
router.get(
  "/api/lobby/:lobbyId",
  authGuard,
  lobbyGuard,
  lobbyUserGuard,
  lobbyController.getLobbyMessages
);
router.get(
  "/api/lobby/info/:lobbyId",
  authGuard,
  lobbyGuard,
  lobbyController.getLobbyInfo
);
router.get(
  "/api/lobby/:lobbyId/:messageId",
  authGuard,
  lobbyGuard,
  lobbyUserGuard,
  lobbyController.getLobbySingleMessages
);
router.post(
  "/api/lobby/:lobbyId/add-user",
  authGuard,
  adminGuard,
  lobbyGuard,
  lobbyController.addUserToLobby
);
router.post(
  "/api/lobby/:lobbyId/remove-user",
  authGuard,
  adminGuard,
  lobbyGuard,
  lobbyController.removeUserFromLobby
);

router.get("/user/lobbies", authGuard, lobbyController.getUserLobbies);
router.get("/community", authGuard, lobbyController.getPlatformUsers);


module.exports = router;
