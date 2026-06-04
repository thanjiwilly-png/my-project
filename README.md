# Week 3 Todo API

Production-ready Express Todo API for Week 3 assignment, configured for Render deployment.

## Quick Start

### Local Development

```powershell
# Install dependencies
npm install

# Run with auto-reload (requires nodemon)
npm run dev

# Run production mode
npm start
```

API will be available at `http://localhost:3000`

## API Endpoints

### Health Check
- **GET /**: Returns status and uptime

### Todos (CRUD)
- **GET /todos**: List all todos
- **GET /todos/:id**: Get specific todo by ID
- **POST /todos**: Create new todo
  - Body: `{ title: string, completed?: boolean }`
- **PATCH /todos/:id**: Update todo
  - Body: `{ title?: string, completed?: boolean }`
- **DELETE /todos/:id**: Delete todo

## Request Examples

```bash
# Create a todo
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","completed":false}'

# Get all todos
curl http://localhost:3000/todos

# Update a todo
curl -X PATCH http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete a todo
curl -X DELETE http://localhost:3000/todos/1
```

## Deployment to Render

1. **Push to GitHub**:
   ```powershell
   git init
   git add .
   git commit -m "Week 3 Todo API - Complete"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **On Render.com**:
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render will auto-detect `render.yaml` configuration
   - Click "Deploy"

3. **Your live API**: `https://your-service-name.onrender.com`

## Features

✅ Full CRUD operations for todos  
✅ Request logging and monitoring  
✅ Error handling with proper HTTP status codes  
✅ JSON data validation  
✅ Automatic timestamps (createdAt, updatedAt)  
✅ Production-ready configuration  
✅ Zero-config Render deployment  

## Environment Variables

- `PORT`: Server port (default: 3000, Render overrides automatically)

## Automatic Deploy via GitHub Actions

This repository includes a GitHub Actions workflow at `.github/workflows/deploy-to-render.yml` that triggers a Render deploy when you push to `main`.

To enable automatic deploys:

1. Create a Render API key: go to Render dashboard → Account → API Keys → New API Key.
2. Get your Render **Service ID** for the web service (visible in the service's settings or URL, it looks like `srv-xxxxx`).
3. In your GitHub repository, go to Settings → Secrets and variables → Actions → New repository secret, then add:
  - `RENDER_API_KEY` — the API key from Render
  - `RENDER_SERVICE_ID` — the service ID for your web service
4. Push to `main` and the workflow will trigger a deploy to Render.

If you prefer, you can also deploy manually via the Render web UI and submit the live URL as your assignment link.
