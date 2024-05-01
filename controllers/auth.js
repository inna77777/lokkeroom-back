const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

exports.registerUser = async (req, res) => {
  const { login, password, nickname, description } = req.body;

  try {

    const existingUser = await pool.query(
      "SELECT login FROM users WHERE login = $1",
      [login]
    );
    if (existingUser.rows.length > 0) {
      return res.json({ error: "User already exists" });
    }
    const bcryptPassword = await bcrypt.hash(password, 12);
    const insertValues = await pool.query(
      "INSERT INTO users (login, password, nickname, description, image) VALUES($1, $2,$3,$4) RETURNING *",
      [login, bcryptPassword, nickname, description]
    );
    res.json({ user: insertValues.rows[0] });
  } catch (err) {
    console.error("Error executing database query:", err);
    res.json({ error: "Internal Server Error" });
  }
};

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_HOURS = 1;

exports.loginUser = async (req, res) => {
  const { login, password } = req.body;

  try {
    const failedAttempts = await pool.query(
      "SELECT COUNT(*) AS count FROM failed_login_attempts WHERE login = $1 AND timestamp >= NOW() - interval '1 hour'",
      [login]
    );

    if (failedAttempts.rows[0].count >= MAX_LOGIN_ATTEMPTS) {
      return res
        .status(429)
        .json({ error: "Too many failed login attempts. Try again later." });
    }

    const user = await pool.query("SELECT * FROM users WHERE login = $1", [
      login,
    ]);

    if (
      user.rows.length === 0 ||
      !(await bcrypt.compare(password, user.rows[0].password))
    ) {
      await pool.query(
        "INSERT INTO failed_login_attempts (login) VALUES ($1)",
        [login]
      );

      return res.status(401).json({ error: "Invalid login or password" });
    }

    await pool.query("DELETE FROM failed_login_attempts WHERE login = $1", [
      login,
    ]);

    const token = jwt.sign({ id: user.rows[0].id }, "secret_key");
    res.json({ token });
  } catch (err) {
    console.error("Error executing database query:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserData = async (req, res, next) => {
  const { id } = req.user;
  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    res.json({ user: user.rows });
  } catch (err) {
    console.error("Error occurred while getting user data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
