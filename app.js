const express = require("express");
const bodyParser = require("body-parser");


const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");
const lobbyRoutes = require("./routes/lobby");

const app = express();
const port = 80;

app.use(bodyParser.json());

app.use(authRoutes);
app.use(messageRoutes);
app.use(lobbyRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
