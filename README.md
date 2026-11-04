# NestJS + React + Vite + Tailwind + Turbo (with Google Auth)

This repository is a **full-stack monorepo template** using **npm workspaces** and **Turborepo** to manage a React frontend and a NestJS backend in a single repository.

It is based on a minimal monorepo foundation, with **Google OAuth authentication pre-wired using Google Cloud OAuth credentials** so you do not have to build the authentication plumbing from scratch. The backend is configured to use **PostgreSQL via NeonDB** with **Drizzle ORM** instead of a NoSQL database.

This is a **template**, not a production-ready system.

---

## What This Template Is

This template provides:

* A correct, minimal **monorepo setup**
* Clear separation of frontend and backend concerns
* Centralized dependency management
* Coordinated development scripts
* **Google OAuth authentication across the frontend and backend**
* JWT-based authentication for authenticated backend requests
* A shared `@repo/shared-types` package so the frontend and backend can consume the same TypeScript types instead of duplicating them
* **PostgreSQL + NeonDB persistence** using **Drizzle ORM**

Authentication is included, but only to the extent required to:

* Sign users in with Google on the frontend
* Send the Google authentication credential to the backend
* Verify the Google identity on the backend
* Establish an authenticated session using a backend-issued JWT

Everything else remains intentionally unopinionated.

---

## What This Template Is *Not*

This template does **not** try to be a full application starter.

It does **not** include:

* User roles or permissions
* Auth-based authorization rules
* API clients
* Deployment, Docker, or CI/CD
* Production session-management infrastructure

Those decisions are left to the user.

---

## Repository Structure

```text
.
├── apps/
│   ├── backend/          # NestJS backend (Google OAuth + JWT + PostgreSQL/NeonDB)
│   └── frontend/         # React + Vite + Tailwind (Google OAuth)
├── packages/
│   └── shared-types/     # @repo/shared-types - shared TypeScript types for frontend/backend
│       └── src/
│           ├── types/    # Domain types (e.g. UserPayload, AuthRequest)
│           ├── hooks/    # Hook return/prop types (e.g. UseGoogleAuthHook)
│           └── index.ts  # Re-exports shared types
├── package.json          # Root workspace + Turbo configuration
├── package-lock.json     # Single lockfile for the entire monorepo
├── turbo.json            # Turbo task pipeline
└── README.md
```

### Key Structural Notes

* This **is a monorepo**
* Dependency management is centralized at the **root**
* Each app remains a **standalone project**
* Shared TypeScript types live in `packages/shared-types` and are consumed via `@repo/shared-types`
* New shared types should be added under `packages/shared-types/src`, organized into folders by kind and re-exported from `packages/shared-types/src/index.ts`
* The `packages/` folder is intentionally included so shared logic, schemas, or types can be introduced later without duplicating code across apps

---

## Tech Stack

### Backend (`apps/backend`)

* NestJS
* TypeScript
* PostgreSQL
* NeonDB
* Google OAuth
* JWT-based session tokens
* Drizzle ORM

### Frontend (`apps/frontend`)

* React
* Vite
* TailwindCSS
* TypeScript
* Google OAuth

### Shared (`packages/shared-types`)

* TypeScript types shared between the frontend and backend, consumed as `@repo/shared-types`

### Tooling

* npm workspaces
* Turborepo

---

## Prerequisites

You need:

* Node.js (LTS recommended)
* npm (v7+ for workspaces)
* A Google Cloud project
* Google OAuth credentials
* A NeonDB account and PostgreSQL database

---

## Installation

From the **repository root**:

```bash
npm install
```

This installs dependencies for **all workspace packages** and generates a **single `package-lock.json`**.

Do not run `npm install` inside individual apps.

---

## Environment Variables

The repository includes example environment files for both applications:

```text
apps/
├── backend/
│   └── .env.example
└── frontend/
    └── .env.example
```

Use the example files as the source of truth for required environment variables:

* Backend example: [`apps/backend/.env.example`](apps/backend/.env.example)
* Frontend example: [`apps/frontend/.env.example`](apps/frontend/.env.example)

Copy each example file to `.env` before starting the application.

### Backend

```bash
cp apps/backend/.env.example apps/backend/.env
```

The backend environment variables should include:

```env
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES=604800000
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id_here
GOOGLE_OAUTH_CLIENT_SECRET=your_google_oauth_client_secret_here

NEON_DB_URL=your_neon_db_url_here
```

### Frontend

```bash
cp apps/frontend/.env.example apps/frontend/.env
```

The frontend should contain the backend URL and Google OAuth client ID:

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id_here
```

Because Vite exposes variables prefixed with `VITE_` to browser code, **never put the Google OAuth client secret in the frontend `.env` file**.

---

## Google OAuth Setup

Google authentication uses **OAuth 2.0 credentials from Google Cloud Console**.

Firebase is **not required** for authentication in this template.

### 1. Create or Select a Google Cloud Project

Open the [Google Cloud Console](https://console.cloud.google.com/) and create a new project or select an existing project.

---

### 2. Configure the OAuth Consent Screen

In Google Cloud Console:

1. Open **Google Auth Platform** / **OAuth consent screen**
2. Configure the application information
3. Select the appropriate audience for your application
4. Configure the scopes required by the application

For basic Google sign-in, the application generally needs access to the user's basic profile and email information.

If the application is in testing mode, make sure the Google accounts you intend to use are configured as test users.

---

### 3. Create OAuth Client Credentials

In Google Cloud Console, go to:

**Google Auth Platform → Clients**

Create an **OAuth 2.0 Client ID**.

For the React frontend, configure a **Web application** client.

Add the frontend origin used during local development to the authorized JavaScript origins:

```text
http://localhost:5173
```

If the application is deployed later, add the appropriate production origin as well.

> The exact Google Cloud Console navigation may change over time, but the application requires an OAuth 2.0 **Client ID** and **Client Secret**.

---

### 4. Configure the Credentials

Google provides:

* Client ID
* Client Secret

The **Client ID** is safe to use in the frontend and is also required by the backend.

The **Client Secret is confidential** and must only be available to the backend.

### Backend

```env
GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id_here
GOOGLE_OAUTH_CLIENT_SECRET=your_google_oauth_client_secret_here
```

### Frontend

```env
VITE_GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id_here
```

The same Google OAuth Client ID should be used in both applications.

---

## NeonDB PostgreSQL Setup

The backend uses **PostgreSQL hosted through NeonDB**.

### 1. Create a NeonDB Account

Create an account at [Neon](https://neon.tech/).

Create a new PostgreSQL project for the application.

---

### 2. Create or Select a Database

After creating the Neon project, select the PostgreSQL database associated with the project.

Neon provides a PostgreSQL connection string for the database.

It will generally look similar to:

```text
postgresql://username:password@host/database?sslmode=require
```

The exact connection string will be provided by Neon.

---

### 3. Add the Connection String to the Backend

Open:

```text
apps/backend/.env
```

and set:

```env
NEON_DB_URL=your_neon_db_url_here
```

For example:

```env
NEON_DB_URL=postgresql://username:password@ep-example.us-east-2.aws.neon.tech/freelance_dev?sslmode=require
```

Use the connection string provided by **your Neon project** rather than the example above.

---

## Drizzle ORM Setup

The backend uses [Drizzle ORM](https://orm.drizzle.team/) to define and manage the PostgreSQL schema. The schema is defined in [`apps/backend/src/schema.ts`](apps/backend/src/schema.ts), and Drizzle Kit is configured in [`apps/backend/src/config/drizzle.config.ts`](apps/backend/src/config/drizzle.config.ts).

### Generate and Apply Migrations

After making a schema change, open a terminal in the `apps/backend` directory and generate a migration:

```bash
npx drizzle-kit generate --config src/config/drizzle.config.ts
```

You can also use the backend's npm script:

```bash
npm run db:generate
```

After generating the migration, apply it to NeonDB from the same `apps/backend` directory:

```bash
npm run db:migrate
```

You can also run the migration command directly:

```bash
npx drizzle-kit migrate --config src/config/drizzle.config.ts
```

### Push Schema Changes Directly

For development, you can also push the current Drizzle schema directly to the database without generating migration files:

```bash
npm run db:push
```

This is useful when you are iterating on the schema locally and do not need to create migration files for each change.

For changes that should be tracked as migrations, use the `db:generate` followed by `db:migrate` workflow instead.

**Important:** `db:generate` creates the migration files but does not update NeonDB. `db:migrate` applies the generated migrations and pushes the schema changes to NeonDB. `db:push` applies the current schema directly without generating migration files.

---

## Development

Run all development servers concurrently:

```bash
npm run dev
```

This uses Turbo to:

* Start the NestJS backend
* Start the Vite frontend
* Stream logs with app prefixes

### Default Ports

* Backend: `http://localhost:3000`
* Frontend: `http://localhost:5173`

Make sure the frontend URL matches the URL configured in:

```env
FRONTEND_URL=http://localhost:5173
```

and the Google OAuth client's authorized JavaScript origins.

---

## Authentication Flow

The authentication flow is intentionally simple:

```text
┌─────────────┐
│   Browser   │
│ React/Vite  │
└──────┬──────┘
       │
       │ 1. Sign in with Google
       ▼
┌─────────────────┐
│  Google OAuth   │
└────────┬────────┘
         │
         │ 2. Google credential
         ▼
┌─────────────────┐
│ NestJS Backend  │
│                 │
│ Verify Google   │
│ identity        │
└────────┬────────┘
         │
         │ 3. Backend-issued JWT
         ▼
┌─────────────────┐
│ Authenticated   │
│ API requests    │
└─────────────────┘
```

Google is responsible for authenticating the user.

The backend is responsible for:

* Verifying the Google authentication credential
* Establishing trust in the authenticated Google account
* Issuing the application's JWT
* Authenticating subsequent API requests

This keeps the frontend and backend independently deployable while still providing a clear authentication boundary.

---

## Environment Variable Security

Do **not** commit local `.env` files.

The repository should contain:

```text
.env.example
```

while local secrets should remain in:

```text
.env
```

Make sure `.gitignore` excludes local environment files.

### OAuth Client ID vs Client Secret

The Google OAuth **Client ID is not considered a secret** and is expected to be used by the browser.

The **Client Secret is confidential** and should only be available to the backend.

The NeonDB connection string should also be treated as confidential because it contains database credentials.

---

## App Independence

Even with authentication included:

* Frontend and backend are **not tightly coupled**
* They can be deployed independently
* Shared packages are optional and can evolve as the project grows
* API communication remains explicit

Authentication establishes **trust**, not architectural dependency.
