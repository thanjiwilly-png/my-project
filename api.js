
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Middleware for logging requests
app.use((req, res, next) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
	next();
});

let todos = [];
let nextId = 1;

app.get('/', (req, res) => {
	res.json({ status: 'ok', message: 'Week 3 Todo API', uptime: process.uptime() });
});

app.get('/todos', (req, res) => {
	res.json(todos);
});

app.get('/todos/:id', (req, res) => {
	const id = Number(req.params.id);
	const todo = todos.find((item) => item.id === id);
	if (!todo) return res.status(404).json({ error: 'Todo not found' });
	res.json(todo);
});

app.post('/todos', (req, res) => {
	const { title, completed = false } = req.body;
	if (!title || typeof title !== 'string') return res.status(400).json({ error: 'title is required' });
	const todo = { id: nextId++, title: title.trim(), completed: Boolean(completed), createdAt: new Date().toISOString() };
	todos.push(todo);
	res.status(201).json(todo);
});

app.patch('/todos/:id', (req, res) => {
	const id = Number(req.params.id);
	const todo = todos.find((item) => item.id === id);
	if (!todo) return res.status(404).json({ error: 'Todo not found' });
	const { title, completed } = req.body;
	if (title !== undefined) {
		if (typeof title !== 'string' || !title.trim()) return res.status(400).json({ error: 'title must be a non-empty string' });
		todo.title = title.trim();
	}
	if (completed !== undefined) todo.completed = Boolean(completed);
	todo.updatedAt = new Date().toISOString();
	res.json(todo);
});

app.delete('/todos/:id', (req, res) => {
	const id = Number(req.params.id);
	const index = todos.findIndex((item) => item.id === id);
	if (index === -1) return res.status(404).json({ error: 'Todo not found' });
	const removed = todos.splice(index, 1)[0];
	res.json(removed);
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
	console.error('Error:', err);
	res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => console.log(`Todo API listening on port ${port}`));

