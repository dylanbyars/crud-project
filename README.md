# NestJS CRUD Project

## Features

- User management (CRUD)
- Post management (CRUD)
- Comment management (CRUD)
- Two strategy authentication process (Local Strategy for login, JWT Strategy for session management)
- Swagger API documentation

## Tech Stack

- NestJS
- TypeORM
- PostgreSQL
- Passport.js
- JSON Web Tokens (JWT)
- Swagger UI

## Authentication Flow

1. **Local Strategy (Initial Login)**
- Used for the /auth/login endpoint
- Validates user credentials (email/password) against the database
- If valid, generates and returns a JWT

2. **JWT Strategy (Subsequent Requests)**
- Used for all authenticated routes after login
- Extracts JWT from the Authorization header
- Validates the token and extracts user information

## Setup and Installation

1. Clone the repository w
2. Install dependencies: `npm install`
3. Set up your PostgreSQL database. I ran it in a `podman` container running the postgres image hosted on dockerhub # TODO: record this
5. Run migrations: `npm run migration:run`
6. Start the server: `npm run start:dev`

## API Documentation

API documentation is available via Swagger UI. After starting the server, navigate to `http://localhost:3000/api` in your web browser to view the interactive API documentation.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

