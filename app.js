const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");

const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");
const lobbyRoutes = require("./routes/lobby");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(multer({ storage: fileStorage }).single("image"));

app.use(authRoutes);
app.use(messageRoutes);
app.use(lobbyRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
