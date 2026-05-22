# Task Manager API

A simple Express.js API for creating, reading, updating, and deleting tasks.

Each task has:

```json
{
  "id": 1,
  "title": "Learn Express",
  "description": "Build a CRUD API",
  "status": "pending"
}
```

Allowed task statuses:

- `pending`
- `completed`

## Setup

Install dependencies:

```bash
npm install
```

## Run

```bash
npm start
```

The API runs at:

```text
http://localhost:3000
```

## Endpoints

```text
GET    /                         API welcome message
GET    /tasks                    Get all tasks
GET    /tasks/:id                Get one task
POST   /tasks                    Create a task
PUT    /tasks/:id                Update a task
DELETE /tasks/:id                Delete a task
GET    /postman-collection       Get the Postman collection JSON
GET    /postman-collection/download
```

## Example Create Request

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Learn Postman\",\"description\":\"Test CRUD task API\",\"status\":\"pending\"}"
```

## Postman Testing

Start the API first:

```bash
npm start
```

Then import this URL in Postman:

```text
http://localhost:3000/postman-collection
```

The Postman collection includes tests for creating, reading, updating, deleting, and confirming deletion of a task.
