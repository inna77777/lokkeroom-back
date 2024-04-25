const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");
const lobbyRoutes = require("./routes/lobby");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.json());

app.use(authRoutes);
app.use(messageRoutes);
app.use(lobbyRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
