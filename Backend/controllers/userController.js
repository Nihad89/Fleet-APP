// controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // For PostgreSQL (or mongoose for MongoDB)

// Register user
const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    );
    res.status(201).json({ user: newUser.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (!user.rows[0]) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { registerUser, loginUser };
