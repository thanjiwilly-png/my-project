const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const VALID_STATUSES = ['pending', 'completed'];

app.use(express.json());

let tasks = [];
let nextTaskId = 1;

function findTaskById(id) {
  return tasks.find((task) => task.id === Number(id));
}

function isValidStatus(status) {
  return VALID_STATUSES.includes(status);
}

function createTestScript(lines) {
  return {
    listen: 'test',
    script: {
      type: 'text/javascript',
      exec: lines,
    },
  };
}

function createJsonBody(body) {
  return {
    mode: 'raw',
    raw: JSON.stringify(body, null, 2),
  };
}

const postmanCollection = {
  info: {
    name: 'Task CRUD API',
    description: 'Postman tests for the Express.js Task CRUD API in task.js.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  variable: [
    {
      key: 'baseUrl',
      value: 'http://localhost:3000',
    },
    {
      key: 'taskId',
      value: '',
    },
  ],
  item: [
    {
      name: 'Welcome',
      request: {
        method: 'GET',
        header: [],
        url: '{{baseUrl}}/',
      },
      event: [
        createTestScript([
          "pm.test('Status code is 200', function () {",
          '  pm.response.to.have.status(200);',
          '});',
          '',
          "pm.test('API returns welcome message', function () {",
          '  const json = pm.response.json();',
          "  pm.expect(json.message).to.eql('Task API is running');",
          '});',
        ]),
      ],
    },
    {
      name: 'Create Task',
      request: {
        method: 'POST',
        header: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
        body: createJsonBody({
          title: 'Learn Postman',
          description: 'Test CRUD task API',
          status: 'pending',
        }),
        url: '{{baseUrl}}/tasks',
      },
      event: [
        createTestScript([
          "pm.test('Status code is 201', function () {",
          '  pm.response.to.have.status(201);',
          '});',
          '',
          "pm.test('Task is created with correct fields', function () {",
          '  const json = pm.response.json();',
          "  pm.expect(json).to.have.property('id');",
          "  pm.expect(json.title).to.eql('Learn Postman');",
          "  pm.expect(json.description).to.eql('Test CRUD task API');",
          "  pm.expect(json.status).to.eql('pending');",
          "  pm.collectionVariables.set('taskId', json.id);",
          '});',
        ]),
      ],
    },
    {
      name: 'Get All Tasks',
      request: {
        method: 'GET',
        header: [],
        url: '{{baseUrl}}/tasks',
      },
      event: [
        createTestScript([
          "pm.test('Status code is 200', function () {",
          '  pm.response.to.have.status(200);',
          '});',
          '',
          "pm.test('Response is an array', function () {",
          '  const json = pm.response.json();',
          "  pm.expect(json).to.be.an('array');",
          '});',
        ]),
      ],
    },
    {
      name: 'Get Task By ID',
      request: {
        method: 'GET',
        header: [],
        url: '{{baseUrl}}/tasks/{{taskId}}',
      },
      event: [
        createTestScript([
          "pm.test('Status code is 200', function () {",
          '  pm.response.to.have.status(200);',
          '});',
          '',
          "pm.test('Correct task is returned', function () {",
          '  const json = pm.response.json();',
          "  pm.expect(String(json.id)).to.eql(String(pm.collectionVariables.get('taskId')));",
          '});',
        ]),
      ],
    },
    {
      name: 'Update Task',
      request: {
        method: 'PUT',
        header: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
        body: createJsonBody({
          title: 'Learn Postman',
          description: 'Task API tested successfully',
          status: 'completed',
        }),
        url: '{{baseUrl}}/tasks/{{taskId}}',
      },
      event: [
        createTestScript([
          "pm.test('Status code is 200', function () {",
          '  pm.response.to.have.status(200);',
          '});',
          '',
          "pm.test('Task is updated', function () {",
          '  const json = pm.response.json();',
          "  pm.expect(json.description).to.eql('Task API tested successfully');",
          "  pm.expect(json.status).to.eql('completed');",
          '});',
        ]),
      ],
    },
    {
      name: 'Delete Task',
      request: {
        method: 'DELETE',
        header: [],
        url: '{{baseUrl}}/tasks/{{taskId}}',
      },
      event: [
        createTestScript([
          "pm.test('Status code is 200', function () {",
          '  pm.response.to.have.status(200);',
          '});',
          '',
          "pm.test('Task is deleted', function () {",
          '  const json = pm.response.json();',
          "  pm.expect(json.message).to.eql('Task deleted');",
          '});',
        ]),
      ],
    },
    {
      name: 'Confirm Deleted Task',
      request: {
        method: 'GET',
        header: [],
        url: '{{baseUrl}}/tasks/{{taskId}}',
      },
      event: [
        createTestScript([
          "pm.test('Status code is 404', function () {",
          '  pm.response.to.have.status(404);',
          '});',
          '',
          "pm.test('Task not found message is returned', function () {",
          '  const json = pm.response.json();',
          "  pm.expect(json.message).to.eql('Task not found');",
          '});',
        ]),
      ],
    },
  ],
};

app.get('/', (req, res) => {
  res.json({
    message: 'Task API is running',
    endpoints: {
      listTasks: 'GET /tasks',
      getTask: 'GET /tasks/:id',
      createTask: 'POST /tasks',
      updateTask: 'PUT /tasks/:id',
      deleteTask: 'DELETE /tasks/:id',
      postmanCollection: 'GET /postman-collection',
    },
  });
});

app.get('/postman-collection', (req, res) => {
  res.json(postmanCollection);
});

app.get('/postman-collection/download', (req, res) => {
  res.setHeader('Content-Disposition', 'attachment; filename="task-api.postman_collection.json"');
  res.json(postmanCollection);
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
  const { title, description = '', status = 'pending' } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ message: 'Title is required' });
  }

  if (!isValidStatus(status)) {
    return res.status(400).json({
      message: 'Status must be either pending or completed',
    });
  }

  const task = {
    id: nextTaskId,
    title: title.trim(),
    description,
    status,
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
    if (!isValidStatus(status)) {
      return res.status(400).json({
        message: 'Status must be either pending or completed',
      });
    }

    task.status = status;
  }

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

app.listen(PORT, () => {
  console.log(`Task API is running on http://localhost:${PORT}`);
});
