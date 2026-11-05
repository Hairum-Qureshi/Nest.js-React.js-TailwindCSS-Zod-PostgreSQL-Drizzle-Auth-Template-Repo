
# NestJS + React + Vite + Tailwind + Zod + Turbo (with Google Auth)

This repository is a **basic full-stack monorepo starter** using **npm workspaces** and **Turborepo** to manage a React frontend and a NestJS backend in a single repository. It is intended to give you a simple setup to get started, not a fully featured or production-ready application.

It is based on a minimal monorepo foundation, with **Google OAuth authentication pre-wired using Google Cloud OAuth credentials** so you do not have to build the authentication plumbing from scratch. The backend is configured to use **PostgreSQL via NeonDB** with **Drizzle ORM** instead of a NoSQL database.

It also includes a basic **Zod** setup in `packages/shared-types/src` so schemas and inferred types can be shared between the frontend and backend.

This is a **template**, not a production-ready system.

---

## What This Template Is

This template provides:

- A correct, minimal **monorepo setup**
- Clear separation of frontend and backend concerns
- Centralized dependency management
- Coordinated development scripts
- **Google OAuth authentication across the frontend and backend**
- JWT-based authentication for authenticated backend requests
- A shared `@repo/shared-types` package for Zod schemas and TypeScript types, so the frontend and backend can reuse validation rules and types instead of duplicating them
- **PostgreSQL + NeonDB persistence** using **Drizzle ORM**

Authentication is included, but only to the extent required to:

- Sign users in with Google on the frontend
- Send the Google authentication credential to the backend
- Verify the Google identity on the backend
- Establish an authenticated session using a backend-issued JWT

Everything else remains intentionally unopinionated.

---

## What This Template Is _Not_

This template does **not** try to be a full application starter.

It does **not** include:

- User roles or permissions
- Auth-based authorization rules
- API clients
- Deployment, Docker, or CI/CD
- Production session-management infrastructure

Those decisions are left to the user.

---

## Repository Structure

```text
.
├── apps/
│   ├── backend/          # NestJS backend (Google OAuth + JWT + PostgreSQL/NeonDB)
│   │   └── .env.example  # Backend environment variable reference
│   └── frontend/         # React + Vite + Tailwind (Google OAuth)
│       └── .env.example  # Frontend environment variable reference
├── packages/
│   └── shared-types/     # @repo/shared-types - shared TypeScript types for frontend/backend
│       └── src/
│           ├── schemas/  # Shared Zod schemas (e.g. UserPayloadSchema)
│           ├── types/    # Shared domain types (e.g. AuthRequest)
│           ├── hooks/    # Hook return/prop types (e.g. UseGoogleAuthHook)
│           └── index.ts  # Re-exports shared schemas and types
├── package.json          # Root workspace + Turbo configuration
├── package-lock.json     # Single lockfile for the entire monorepo
├── turbo.json            # Turbo task pipeline
└── README.md
```

### Key Structural Notes

- This **is a monorepo**
- Dependency management is centralized at the **root**
- Each app remains a **standalone project**
- Shared TypeScript types live in `packages/shared-types` and are consumed via `@repo/shared-types`
- Shared Zod schemas and their inferred types live under `packages/shared-types/src/schemas`; export them from `packages/shared-types/src/index.ts` so both apps can consume them through `@repo/shared-types`
- New shared types should be added under `packages/shared-types/src`, organized into folders by kind and re-exported from `packages/shared-types/src/index.ts`
- The `packages/` folder is intentionally included so shared logic, schemas, or types can be introduced later without duplicating code across apps

---

## Tech Stack

### Backend (`apps/backend`)

- NestJS
- TypeScript
- PostgreSQL
- NeonDB
- Google OAuth
- JWT-based session tokens
- Drizzle ORM

### Frontend (`apps/frontend`)

- React
- Vite
- TailwindCSS
- TypeScript
- Google OAuth

### Shared (`packages/shared-types`)

- Zod schemas and TypeScript types shared between the frontend and backend, consumed as `@repo/shared-types`
- `drizzle-zod` is included in the backend dependencies as an optional utility; the current shared schema is defined directly with Zod

### Shared Validation with Zod

The basic validation setup uses **Zod**, with shared schemas in `packages/shared-types/src/schemas`. The schemas are intended to be imported by both the frontend and backend, so validation rules can be defined once instead of duplicated across the two applications. The TypeScript types can be inferred from those schemas and shared from the same package.

For example, `UserPayloadSchema` is defined in `packages/shared-types/src/schemas/user.schema.ts` and exported from the `@repo/shared-types` package entry point:

```ts
import { UserPayloadSchema } from "@repo/shared-types";

const user = UserPayloadSchema.parse(value);
```

This template does **not** use `class-validator` or `class-transformer`. `drizzle-zod` is present in the backend dependencies for possible Drizzle schema integration, but it is not required by the current shared Zod schema setup. Keep this starter simple and extend the validation approach as your application needs grow.

### Tooling

- npm workspaces
- Turborepo

---

## Prerequisites

You need:

- Node.js (LTS recommended)
- npm (v7+ for workspaces)
- A Google Cloud project
- Google OAuth credentials
- A NeonDB account and PostgreSQL database

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

The frontend and backend each have their own environment configuration. The example files in the repository are the **source of truth** for the required variables and their names:

- **Backend:** [`apps/backend/.env.example`](apps/backend/.env.example)
- **Frontend:** [`apps/frontend/.env.example`](apps/frontend/.env.example)

From the repository root, copy both examples to local `.env` files:

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

Then open each `.env` file and replace the example values with your own configuration. Use the respective example file when adding or updating variables; this README intentionally does not duplicate their contents.

**Important configuration notes:**

- The Google OAuth Client ID must be the same in the frontend and backend (`VITE_GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_ID`, respectively).
- The Google OAuth Client Secret (`GOOGLE_OAUTH_CLIENT_SECRET`) belongs **only** in the backend environment.
- The backend's `NEON_DB_URL` must be the PostgreSQL connection string from your Neon project.
- The backend's `FRONTEND_URL` should match the origin where the React app is running; the frontend's `VITE_BACKEND_URL` should point to the NestJS backend.
- Generate a strong, unpredictable value for the backend's `JWT_SECRET` rather than reusing a placeholder.

Because Vite exposes variables prefixed with `VITE_` to browser code, **never store secrets in frontend `VITE_` variables**. Keep local `.env` files out of version control.

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

Google provides an OAuth **Client ID** and **Client Secret**. Add them to the appropriate local environment files, using the repository examples as a reference:

- **Backend:** [`apps/backend/.env.example`](apps/backend/.env.example) — configure `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET`.
- **Frontend:** [`apps/frontend/.env.example`](apps/frontend/.env.example) — configure `VITE_GOOGLE_OAUTH_CLIENT_ID`.

Use the **same Client ID** in both applications. The Client ID can be exposed to the browser, but the **Client Secret must remain on the backend**.

---

## NeonDB PostgreSQL Setup

The backend uses **PostgreSQL hosted through NeonDB**.

### 1. Create a NeonDB Account

Create an account at [Neon](https://neon.tech/).

Create a new PostgreSQL project for the application.

---

### 2. Create or Select a Database

After creating the Neon project, select the PostgreSQL database associated with the project. Neon will provide a PostgreSQL connection string containing the database connection details and credentials.

### 3. Configure the Backend Connection

Copy the connection string from your Neon project and assign it to `NEON_DB_URL` in `apps/backend/.env`. Refer to [`apps/backend/.env.example`](apps/backend/.env.example) for the variable name and the rest of the backend configuration.

Treat this connection string as a **secret** because it contains database credentials. Do not commit it to the repository.

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

- Start the NestJS backend
- Start the Vite frontend
- Stream logs with app prefixes

### Default Ports

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

Make sure the backend's `FRONTEND_URL` matches the frontend's actual origin and the Google OAuth client's authorized JavaScript origins. If you change the default ports, also update `VITE_BACKEND_URL` in the frontend environment to point to the correct backend URL. See the respective `.env.example` files for configuration details.

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

- Verifying the Google authentication credential
- Establishing trust in the authenticated Google account
- Issuing the application's JWT
- Authenticating subsequent API requests

This keeps the frontend and backend independently deployable while still providing a clear authentication boundary.

---

## Environment Variable Security

Commit the example files so other developers know which variables to configure, but **do not commit your local `.env` files**. Ensure `.gitignore` excludes local environment files without excluding the `.env.example` files.

- The **Google OAuth Client ID** is public configuration and can be used by the frontend.
- The **Google OAuth Client Secret** and **JWT secret** must remain private to the backend.
- The **NeonDB connection string** contains database credentials and must remain private to the backend.
- Any frontend variable prefixed with `VITE_` is exposed to browser code; never put secrets there.

If a credential is accidentally committed or exposed, rotate it through the corresponding provider.

---

## App Independence

Even with authentication included:

- Frontend and backend are **not tightly coupled**
- They can be deployed independently
- Shared packages are optional and can evolve as the project grows
- API communication remains explicit

Authentication establishes **trust**, not architectural dependency.
