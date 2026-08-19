# Blog Platform — REST API

Backend REST API for a blog platform. Posts with tags, comments, image uploads, JWT authentication, rate limiting, Swagger documentation.

## Tech Stack

- **Runtime:** Node.js 24 + ESM
- **Framework:** NestJS 11
- **ORM:** Prisma 7.9 (driver adapter `@prisma/adapter-pg`)
- **Database:** PostgreSQL
- **Authentication:** Passport.js + JWT (access token, 6h)
- **Validation:** class-validator + class-transformer
- **Documentation:** Swagger/OpenAPI (`/api`)
- **Containerization:** Docker multi-stage build

## Features

- Registration and login (bcrypt + JWT)
- CRUD posts with tags (many-to-many) and images
- Comments on posts (ownership check)
- Image uploads (multer, disk storage)
- Rate limiting (10 req/min global, 3 req/min on auth endpoints)
- Global Exception Filter (structured error responses)
- Transform Interceptor (wraps responses in `{ data, meta }`)
- Logging Interceptor (logs request method, URL, duration)
- Multi-stage Dockerfile (builder → production)
- Healthcheck for Docker/Kubernetes

## Quick Start

### Local Development

```bash
# 1. Start PostgreSQL
docker compose up -d postgres

# 2. Install dependencies
npm install

# 3. Run migrations
npx prisma migrate dev

# 4. Start in dev mode
npm run start:dev
```

App: http://localhost:3000
Swagger: http://localhost:3000/api

### Docker (Full Build)

```bash
docker compose up --build
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection URL | `postgresql://user:pass@localhost:5430/blog` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |
| `JWT_EXPIRES_IN` | Token expiration time | `6h` |
| `PORT` | Application port | `3000` |

## API Endpoints

### Auth

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| `POST` | `/auth/register` | Register a new account | — |
| `POST` | `/auth/login` | Login (returns `access_token`) | — |
| `GET` | `/auth/me` | Current user profile | Bearer |

### Posts

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| `POST` | `/posts` | Create a post | Bearer |
| `GET` | `/posts` | All posts (`?authorId=N&tag=name`) | — |
| `GET` | `/posts/:id` | Post by ID (includes author and tags) | — |
| `PATCH` | `/posts/:id` | Update a post (author only) | Bearer |
| `DELETE` | `/posts/:id` | Delete a post (author only) | Bearer |

### Comments

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| `POST` | `/posts/:postId/comments` | Create a comment | Bearer |
| `GET` | `/posts/:postId/comments` | All comments on a post | Bearer |
| `GET` | `/posts/:postId/comments/:id` | Comment by ID | Bearer |
| `PATCH` | `/posts/:postId/comments/:id` | Update a comment (author only) | Bearer |
| `DELETE` | `/posts/:postId/comments/:id` | Delete a comment (author only) | Bearer |

### Users

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| `GET` | `/users` | All users | Bearer |
| `GET` | `/users/:userId` | User by ID | Bearer |

### Tags & Upload

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| `GET` | `/tags` | All tags | — |
| `POST` | `/upload/file` | Upload an image (jpeg/png/gif, max 5MB) | — |

## Database

```
User ──1:N── Post ──M:N── Tag
  │            │
  └──1:N── Comment
```

- **User** — id, email (unique), login (unique), password (bcrypt), createdAt, updatedAt
- **Post** — id, title, content, imageUrl?, authorId → User, createdAt, updatedAt
- **Tag** — id, name (unique)
- **Comment** — id, content, authorId → User, postId → Post, createdAt, updatedAt

## Project Structure

```
src/
├── main.ts                  # Bootstrap: ValidationPipe, interceptors, Swagger, filter
├── app.module.ts            # Root module
├── auth/                    # Authentication (JWT, Passport, guards)
├── users/                   # Users
├── posts/                   # Posts (CRUD + tags)
├── comments/                # Comments
├── tags/                    # Tags
├── uploads/                 # File uploads (multer)
├── prisma/                  # PrismaService (global)
└── common/                  # Filters, interceptors, pipes, DTOs
```

## Docker

**Dockerfile** — multi-stage build:
1. **Builder** — `npm ci` + `prisma generate` + `nest build`
2. **Production** — `npm ci --only=production`, copies dist/prisma/public, runs migrations via `start.sh`

**docker-compose.yml** — two services:
- `app` — NestJS application (port 3000)
- `postgres` — PostgreSQL (port 5430 external, 5432 internal)

## Swagger

API documentation available at: `/api`

Decorators used: `@ApiTags`, `@ApiOperation`, `@ApiBearerAuth`, `@ApiBody`, `@ApiOkResponse`, `@ApiNotFoundResponse`, `@ApiConflictResponse`, `@ApiUnauthorizedResponse`.
