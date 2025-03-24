# Lockeroom Backend

Lockeroom is a powerful messaging and lobby management system designed to facilitate secure communication and collaboration among users. It provides a robust backend API built using **Node.js** and **Express.js**, ensuring fast and efficient handling of user requests while ensuring scalability and maintainability. Lockeroom leverages **PostgreSQL** as the database to store and manage user data, messages, and lobby information securely.

## Overview

The Lockeroom backend exposes a **RESTful API** for various features like user authentication, lobby creation, messaging, and community interaction. This allows users to register, log in, join lobbies, send messages, and interact with other members efficiently.

### Key Features:

1. **User Authentication**:
   - Secure user registration and login using **bcrypt** for password hashing.
   - JWT (JSON Web Tokens) are used for authentication and authorization, ensuring secure communication between clients and the server.

2. **User Data Retrieval**:
   - Users can retrieve their profile data based on their JWT token.

3. **Lobby Management**:
   - Users can create and manage lobbies, which are essentially rooms where users can communicate.
   - Lobbies can be public or private, and users can join or leave them at any time.
   - Users can manage other users within the lobby, including adding and removing members.

4. **Messaging**:
   - Users can send messages in lobbies and private chats.
   - Messages can be updated or deleted, providing complete control over the chat history.
   - The system stores the history of messages in each lobby or chat session, making it possible for users to retrieve past conversations.

5. **Community Interaction**:
   - The system allows users to browse and join lobbies that are available to the community, excluding those they are already a part of.
   - Users can also view details of specific lobbies they are interested in, even if they haven't joined yet.

---

## API Endpoints

### **User Authentication**

- **POST /api/register**: Registers a new user. The body should contain the user's `login`, `password`, `nickname`, and `description`.
- **POST /api/login**: Logs in a user and generates a JWT token for authenticated communication.
- **GET /api/user**: Retrieves user data based on the JWT token.

### **Lobby Management**

- **POST /api/lobbies**: Creates a new lobby. The body should contain the lobby's `name`, and whether it is `private`.
- **GET /api/lobby/:lobbyId/user/:userId**: Retrieves information about a specific user within a lobby.
- **GET /api/lobby/:lobbyId/users**: Retrieves a list of users in a specific lobby.
- **GET /api/lobby/:lobbyId**: Retrieves messages within a specific lobby.
- **GET /api/lobby/info/:lobbyId**: Retrieves detailed information about a specific lobby.
- **GET /api/lobby/:lobbyId/:messageId**: Retrieves a single message within a specific lobby.
- **POST /api/lobby/:lobbyId/add-user/:userId**: Adds a user to a specific lobby.
- **DELETE /api/lobby/:lobbyId/remove-user/:userId**: Removes a user from a specific lobby.
- **GET /user/lobbies**: Retrieves a list of lobbies that the authenticated user belongs to.
- **GET /community**: Retrieves lobbies that are available to the community.
- **DELETE /delete/lobby/:lobbyId/user/:userId**: Deletes a user from a specific lobby.

### **Messaging**

- **POST /api/lobby/:lobbyId**: Posts a message to a specific lobby.
- **PATCH /api/lobby/message/:messageId**: Updates a message within a lobby.
- **PATCH /api/chat/message/:messageId**: Updates a message within a chat.
- **DELETE /api/chat/messages/:messageId**: Deletes a message within a chat.
- **DELETE /api/messages/:messageId**: Deletes a message within a lobby.
- **POST /api/chat/user/:recId**: Sends a message from one user to another in a chat.
- **GET /api/user/chats**: Retrieves a list of chats the user is involved in.
- **GET /api/chat/:chatId**: Retrieves messages from a specific chat.
- **GET /api/chat/friend/:userId**: Retrieves information about a specific user who is a chat partner.
- **DELETE /delete/chat/:chatId**: Deletes a chat and its associated messages.

---

## Database Schema

The backend system uses a **PostgreSQL** database to manage the following entities:

### **Users**
- `users`: Stores user details.
  - Columns: `login`, `password`, `id`, `nickname`, `description`, `created_at`
  
### **Chats**
- `chats`: Stores chat session information.
  - Columns: `chat_id`, `user_id`, `chat_with_id`
- `chats_messages`: Records messages within chats.
  - Columns: `id`, `chat_id`, `content`, `created_at`, `user_id`

### **Failed Login Attempts**
- `failed_login_attempts`: Logs failed login attempts for monitoring and security purposes.
  - Columns: `id`, `login`, `timestamp`

### **Lobbies**
- `lobbies`: Stores information about the chat lobbies.
  - Columns: `id`, `name`, `created_at`, `private`
- `messages`: Stores messages within lobbies.
  - Columns: `id`, `content`, `user_id`, `lobby_id`, `created_at`

### **User-Lobby Relationships**
- `users_lobbies`: Manages the users' participation in lobbies (with admin roles).
  - Columns: `id`, `user_id`, `lobby_id`, `admin`

---

## Technologies Used

- **Node.js**: The runtime environment for executing JavaScript code on the server.
- **Express.js**: Web framework for building the RESTful API.
- **PostgreSQL**: Database for managing user data, chat history, and lobby information.
- **bcrypt**: Library for hashing passwords to ensure secure authentication.
- **JSON Web Tokens (JWT)**: Secure token-based authentication for users.

---

## Security Considerations

1. **JWT Authentication**: All endpoints that require user identification are protected using JWT tokens. Users must authenticate with a valid token to access these endpoints.
2. **Password Hashing**: Passwords are hashed using bcrypt before being stored in the database to prevent password leakage.
3. **Rate Limiting**: The system may implement rate limiting for login attempts to prevent brute-force attacks.
4. **Private Lobbies**: Users can create private lobbies to restrict access to only invited members.

---

## Future Enhancements

1. **Push Notifications**: Adding real-time notifications for new messages or updates in lobbies.
2. **File Uploads**: Allowing users to send files (images, documents) within chats or lobbies.
3. **User Roles**: Introducing more roles and permissions, such as moderators and administrators within lobbies.
4. **Search Functionality**: Implementing the ability to search for users, chats, or lobbies.

---

How to Get Started
1. Clone the Repository
  ```bash
git clone https://github.com/inna77777/lokkeroom-back.git
```

2.Navigate to the project directory:
```bash
cd lokkeroom-back
```
3. Install Dependencies
```bash
npm install

```

4. Run project
```bash
npm start
```


