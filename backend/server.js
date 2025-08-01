const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Replace with your MySQL username
  password: '',  // Replace with your MySQL password
  database: 'wipro_talent'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
  
  // Create database if it doesn't exist
  db.query('CREATE DATABASE IF NOT EXISTS login_system', (err) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    
    // Use the database
    db.query('USE login_system', (err) => {
      if (err) {
        console.error('Error using database:', err);
        return;
      }
      
      // Create users table if it doesn't exist
      const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      db.query(createUsersTableQuery, (err) => {
        if (err) {
          console.error('Error creating users table:', err);
          return;
        }
        console.log('Users table created or already exists');
        
        // Create todos table if it doesn't exist
        const createTodosTableQuery = `
          CREATE TABLE IF NOT EXISTS todos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          )
        `;
        
        db.query(createTodosTableQuery, (err) => {
          if (err) {
            console.error('Error creating todos table:', err);
            return;
          }
          console.log('Todos table created or already exists');
        });
      });
    });
  });
});

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register endpoint
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if email already exists
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ Status: 'Error', Error: 'Database error' });
    }
    
    if (result.length > 0) {
      return res.json({ Status: 'Error', Error: 'Email already exists' });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user
    db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.json({ Status: 'Error', Error: 'Failed to register user' });
        }
        
        return res.json({ Status: 'Success' });
      }
    );
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ Status: 'Error', Error: 'Database error' });
    }
    
    if (result.length === 0) {
      return res.json({ Status: 'Error', Error: 'Email not found' });
    }
    
    // Compare passwords
    const user = result[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.json({ Status: 'Error', Error: 'Invalid password' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h'
    });
    
    return res.json({ Status: 'Success', Token: token });
  });
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.json({ Status: 'Error', Error: 'Token not provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.json({ Status: 'Error', Error: 'Invalid token' });
  }
};

// TODO CRUD endpoints

// Get all todos for a user
app.get('/todos', verifyToken, (req, res) => {
  const userId = req.user.id;
  
  db.query('SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ Status: 'Error', Error: 'Database error' });
    }
    
    return res.json({ Status: 'Success', todos: result });
  });
});

// Create a new todo
app.post('/todos', verifyToken, (req, res) => {
  const userId = req.user.id;
  const { title, description } = req.body;
  
  if (!title) {
    return res.json({ Status: 'Error', Error: 'Title is required' });
  }
  
  db.query(
    'INSERT INTO todos (user_id, title, description) VALUES (?, ?, ?)',
    [userId, title, description || ''],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ Status: 'Error', Error: 'Failed to create todo' });
      }
      
      return res.json({ Status: 'Success', id: result.insertId });
    }
  );
});

// Update a todo
app.put('/todos/:id', verifyToken, (req, res) => {
  const userId = req.user.id;
  const todoId = req.params.id;
  const { title, description, completed } = req.body;
  
  db.query(
    'UPDATE todos SET title = ?, description = ?, completed = ? WHERE id = ? AND user_id = ?',
    [title, description, completed, todoId, userId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ Status: 'Error', Error: 'Failed to update todo' });
      }
      
      if (result.affectedRows === 0) {
        return res.json({ Status: 'Error', Error: 'Todo not found or unauthorized' });
      }
      
      return res.json({ Status: 'Success' });
    }
  );
});

// Delete a todo
app.delete('/todos/:id', verifyToken, (req, res) => {
  const userId = req.user.id;
  const todoId = req.params.id;
  
  db.query(
    'DELETE FROM todos WHERE id = ? AND user_id = ?',
    [todoId, userId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ Status: 'Error', Error: 'Failed to delete todo' });
      }
      
      if (result.affectedRows === 0) {
        return res.json({ Status: 'Error', Error: 'Todo not found or unauthorized' });
      }
      
      return res.json({ Status: 'Success' });
    }
  );
});

// Protected route example
app.get('/protected', verifyToken, (req, res) => {
  return res.json({ Status: 'Success', user: req.user });
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});