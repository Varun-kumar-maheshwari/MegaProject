# MegaProject

Node.js/Express REST API for project management with authentication, projects, tasks, subtasks, and notes. MongoDB is used for persistence and JWT is used for auth. The repository includes an HTTP collection (`project.routes.http`) for manual endpoint testing.

## Features

- User registration, login, JWT auth, and profile
- Project CRUD and project member management
- Task and subtask management per project
- Project notes
- Healthcheck endpoint

## Tech Stack

- Node.js (ESM)
- Express
- MongoDB + Mongoose
- JWT auth
- Mailtrap (email)
- Cloudinary (avatars)

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- MongoDB instance (local or cloud)

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file from the template:

   ```bash
   cp .env.example .env
   ```

3. Fill in the required values in `.env` (see below).

4. Start the server:

   ```bash
   npm start
   ```

The server runs at `http://localhost:8000` by default.

### Environment Variables

See `.env.example` for the full list. Key variables:

- `MONGO_URI` - MongoDB connection string
- `PORT` - API port (default 8000)
- `BASE_URL` - base URL used in email links
- `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`
- `ACCESS_TOKEN_EXPIRY`, `REFRESH_TOKEN_EXPIRY`
- `MAILTRAP_SMTP_*` - SMTP settings for email
- `CLOUDINARY_*` - Cloudinary credentials for avatar upload

## Scripts

- `npm start` - run the API
- `npm run dev` - run with nodemon

## API Usage

All routes are under `http://localhost:8000/api/v1`.

You can use the provided `project.routes.http` file for testing with a REST client that supports `.http` files (VS Code REST Client, IntelliJ HTTP client, etc).

### Route Groups (summary)

- Healthcheck: `/api/v1/healthcheck`
- Auth: `/api/v1/users/*`
- Projects: `/api/v1/projects/*`
- Tasks: `/api/v1/project/task/*`
- Notes: `/api/v1/project/notes/*`

For the full list of endpoints and example payloads, see `project.routes.http`.

## Project Structure

```
src/
  app.js                 Express app setup
  index.js               Server entry
  controllers/           Route handlers
  routes/                API routes
  models/                Mongoose models
  middlewares/           Auth and helpers
  utils/                 Shared utilities
  validators/            Request validators
```

## Notes

- Most endpoints require JWT. Obtain a token via `/users/login`.
- Project member role updates expect `newRole` in the request body.

## License

MIT
