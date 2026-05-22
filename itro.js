require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

function requestLogger(req, res, next) {
  const startedAt = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startedAt;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
}

// Middleware
app.use(cors());
app.use(requestLogger);
app.use(express.json());

// JSON parse error handling
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next(err);
});

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Routes
// Root will serve static index.html from /public by express.static
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.post('/api/echo', (req, res) => {
  res.json({ received: req.body, timestamp: new Date().toISOString() });
});

app.get('/week2', (req, res) => {
  res.json({
    week: 2,
    title: 'Week 2 API',
    message: 'This is the Week 2 endpoint',
    timestamp: new Date().toISOString()
  });
});

app.post('/user', (req, res) => {
  const { name = 'willy', username = 'thanjiwilly', email, extra = 'h' } = req.body;
  const user = {
    name,
    username,
    email,
    extra,
    createdAt: new Date().toISOString()
  };

  const lowerEmail = String(email || '').toLowerCase();
  const message = lowerEmail === 'thanjiwilly' ? `hello ${name}` : 'User created';

  res.status(201).json({ message, user });
});

app.get('/user/:id/profile', (req, res) => {
  const { id } = req.params;
  const user = {
    id,
    name: id === 'willy' ? 'willy' : 'Guest',
    username: id === 'willy' ? 'thanjiwilly' : 'guest',
    email: id === 'willy' ? 'thanjiwilly' : null,
    bio: id === 'willy' ? 'This is Willy’s profile.' : 'Profile not found.',
    createdAt: new Date().toISOString()
  };

  res.json({ profile: user });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
