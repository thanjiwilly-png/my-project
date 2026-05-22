# My API

A Node.js Express API with CORS support.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Copy `.env.example` to `.env` and adjust settings if needed. Set `PORT` in `.env` if you want a custom port.

## Running Locally

```bash
npm start
```

API will be available at `http://localhost:3000`

### Available Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check
- `POST /api/echo` - Echo back posted data

## Building

```bash
npm run build
```

## Deployment

### Option 1: Heroku (Recommended for beginners)

1. Create a Heroku account at https://www.heroku.com
2. Install Heroku CLI
3. Login: `heroku login`
4. Create app: `heroku create your-app-name`
5. Deploy: `git push heroku main`
6. View logs: `heroku logs --tail`

### Option 2: Railway

1. Go to https://railway.app and sign in.
2. Create a new project and choose "Deploy from GitHub".
3. Connect your repository and select this project.
4. Railway will detect Node.js automatically. If asked, use `npm install` for install and `npm start` for run.
5. A `railway.json` file is included in this repo to help Railway understand the Node.js service.
6. Deploy and open the app URL from Railway.

### Option 3: Render

1. Go to https://render.com and sign in.
2. Create a new Web Service.
3. Connect your GitHub repository and select this project.
4. For Root Directory, choose the project folder if needed.
5. Set Environment to `Node 18` or auto-detect.
6. Use `npm install` and `npm start` as the build/start commands if Render doesn't fill them automatically.
7. A `render.yaml` file is included in this repo for Render service configuration.
8. Render will use the `render.yaml` file at the repo root. If your repo branch is not `main`, update the `branch` field in `render.yaml`.
9. Deploy and open the live service URL.

### Option 4: Docker (Local/Cloud)

Create `Dockerfile`:
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "itro.js"]
```

Build and run:
```bash
docker build -t my-api .
docker run -p 3000:3000 my-api
```

## Testing

```bash
curl http://localhost:3000/api/health
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
