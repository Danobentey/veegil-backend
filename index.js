const express = require('express');
const connectDB = require('./db')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

connectDB(app);

// Middleware
app.use(bodyParser.json()); // Parse JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded requests

// JWT secret key (replace with a more secure secret)
const jwtSecret = 'secret_key';

// Middleware to handle authentication (you can customize this)
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, jwtSecret, (err, user) => {
    console.log("Decoded user:", user) //TODO: Delete before production
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
}

// Sample route to check if the server is running
app.get('/', (req, res) => {
  res.send('Banking API is up and running!');
});

// Import and use your route files here
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

app.use('/users', userRoutes); // Example: http://localhost:3000/users/signup
app.use('/transactions', authenticateToken, transactionRoutes); // Requires authentication

// Start the server
