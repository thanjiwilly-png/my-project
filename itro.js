require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const VALID_TASK_STATUSES = ['pending', 'completed'];

let tasks = [];
let nextTaskId = 1;
let todos = [
  {
    id: 1,
    task: 'Learn Node.js',
    completed: false,
  },
  {
    id: 2,
    task: 'Build CRUD API',
    completed: false,
  },
];
let nextTodoId = 3;
let tools = [
  {
    id: 1,
    name: 'VS Code',
    category: 'Code editor',
  },
  {
    id: 2,
    name: 'Postman',
    category: 'API testing',
  },
];

function requestLogger(req, res, next) {
  const startedAt = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startedAt;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
}

function findTaskById(id) {
  return tasks.find((task) => task.id === Number(id));
}

function isValidTaskStatus(status) {
  return VALID_TASK_STATUSES.includes(status);
}

function findToolById(id) {
  return tools.find((tool) => tool.id === Number(id));
}

function findTodoById(id) {
  return todos.find((todo) => todo.id === Number(id));
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

app.get('/tools/:id', (req, res) => {
  const tool = findToolById(req.params.id);

  if (!tool) {
    return res.status(404).json({ message: 'Tool not found' });
  }

  res.json(tool);
});

app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter((todo) => !todo.completed);

  res.json(activeTodos);
});

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.get('/todos/:id', (req, res) => {
  const todo = findTodoById(req.params.id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.json(todo);
});

app.post('/todos', (req, res) => {
  const { task, completed = false } = req.body;

  if (!task || typeof task !== 'string' || !task.trim()) {
    return res.status(400).json({ message: 'Task field is required' });
  }

  const todo = {
    id: nextTodoId,
    task: task.trim(),
    completed: Boolean(completed),
  };

  todos.push(todo);
  nextTodoId += 1;

  res.status(201).json(todo);
});

app.patch('/todos/:id', (req, res) => {
  const todo = findTodoById(req.params.id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  const { task, completed } = req.body;

  if (task !== undefined) {
    if (typeof task !== 'string' || !task.trim()) {
      return res.status(400).json({ message: 'Task field cannot be empty' });
    }

    todo.task = task.trim();
  }

  if (completed !== undefined) {
    todo.completed = Boolean(completed);
  }

  res.json(todo);
});

app.delete('/todos/:id', (req, res) => {
  const todo = findTodoById(req.params.id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  todos = todos.filter((currentTodo) => currentTodo.id !== todo.id);

  res.status(204).send();
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const task = findTaskById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json(task);
});

app.post('/tasks', (req, res) => {
  const { task: taskName, description = '', status = 'pending' } = req.body;

  if (!taskName || typeof taskName !== 'string' || !taskName.trim()) {
    return res.status(400).json({ message: 'Task field is required' });
  }

  if (!isValidTaskStatus(status)) {
    return res.status(400).json({
      message: 'Status must be either pending or completed',
    });
  }

  const task = {
    id: nextTaskId,
    task: taskName.trim(),
    description,
    status,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  nextTaskId += 1;

  res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
  const task = findTaskById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const { title, description, status } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }

    task.title = title.trim();
  }

  if (description !== undefined) {
    task.description = description;
  }

  if (status !== undefined) {
    if (!isValidTaskStatus(status)) {
      return res.status(400).json({
        message: 'Status must be either pending or completed',
      });
    }

    task.status = status;
  }

  task.updatedAt = new Date().toISOString();

  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const task = findTaskById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks = tasks.filter((currentTask) => currentTask.id !== task.id);

  res.json({ message: 'Task deleted', task });
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
