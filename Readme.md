# Lockeroom Backend
Lockeroom is a messaging and lobby management system designed to facilitate communication and collaboration among users.

## Overview
Lockeroom backend provides a RESTful API for user registration, authentication, lobby management, and messaging functionalities. It ensures secure communication and efficient handling of user data.

## Features
User Authentication: Handles user registration and login securely using bcrypt hashing and JWT token generation.

User Data Retrieval: Retrieves user data based on the provided JWT token.

Lobby Management: Allows users to create lobbies, add or remove users from lobbies, and fetch information about lobbies and their members.

Messaging: Enables users to send messages within lobbies and chats, update or delete messages, and retrieve message history.

Community Interaction: Provides functionality to view lobbies available to the community, excluding those already joined by the user.

## API Endpoints

**POST /api/register:** Register a new user.

**POST /api/login:** Login user and generate JWT token.

**GET /api/user:** Retrieve user data based on JWT token.
Lobby Management

**POST /api/lobbies:** Create a new lobby.

**GET /api/lobby/:lobbyId/user/:userId:** Retrieve information about a specific user within a lobby.

**GET /api/lobby/:lobbyId/users:** Retrieve a list of users belonging to a specific lobby.

**GET /api/lobby/:lobbyId:** Retrieve messages within a specific lobby.

**GET /api/lobby/info/:lobbyId:** Retrieve information about a specific lobby.

**GET /api/lobby/:lobbyId/:messageId:** Retrieve a single message within a specific lobby.

**POST /api/lobby/:lobbyId/add-user/:userId:** Add a user to a specific lobby.

**DELETE /api/lobby/:lobbyId/remove-user/:userId:** Remove a user from a specific lobby.

**GET /user/lobbies:** Retrieve a list of lobbies that the authenticated user belongs to.

**GET /community:** Retrieve lobbies available to the community.

**DELETE /delete/lobby/:lobbyId/user/:userId:** Delete a user from a specific lobby.
Messaging

**POST /api/lobby/:lobbyId:** Post a message to a specific lobby.

**PATCH /api/lobby/message/:messageId:** Update a message within a lobby.

**PATCH /api/chat/message/:messageId:** Update a message within a chat.

**DELETE /api/chat/messages/:messageId:** Delete a message within a chat.

**DELETE /api/messages/:messageId:** Delete a message within a lobby.

**POST /api/chat/user/:recId:** Send a message from one user to another.

**GET /api/user/chats:** Retrieve a list of user's chats.

**GET /api/chat/:chatId:** Retrieve messages from a specific chat.

**GET /api/chat/friend/:userId:** Retrieve information about a specific user who is a chat partner.

**DELETE /delete/chat/:chatId:** Delete a chat and its associated messages.

## Tables

**chats:** Stores information about individual chat sessions between users.
Columns: chat_id, user_id, chat_with_id

**chats_messages:** Records messages exchanged within chats.
Columns: id, chat_id, content, created_at, user_id

**failed_login_attempts:** Logs failed login attempts for security monitoring.
Columns: id, login, timestamp

**lobbies:** Manages information related to chat lobbies.
Columns: id, name, created_at, private

**messages:** Contains messages sent within lobbies.
Columns: id, content, user_id, lobby_id, created_at

**users:** Stores user account details.
Columns: login, password, id, nickname, description, created_at

**users_lobbies:** Manages user participation in lobbies.
Columns: id, user_id, lobby_id, admin



Technologies Used
Node.js
Express.js
PostgreSQL
bcrypt
JSON Web Tokens (JWT)


## What do i wanna add?


Some styles
Uploading images as avatars 
