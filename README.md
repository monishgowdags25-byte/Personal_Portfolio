# Monish Gowda GS - Personal Portfolio Website

This is a complete, production-ready personal portfolio website for **Monish Gowda GS**.

## Architecture & Tech Stack

- **Frontend**: React.js (Vite) + Tailwind CSS v4 + Framer Motion (for animations) + Spline 3D (hero visual).
- **Backend**: Node.js + Express.js + CORS + Helmet + express-rate-limit + express-validator.
- **Database**: Supabase (Postgres) to dynamically serve project lists, count profile visits, and record contact messages.

---

## Directory Structure

```text
/
├── package.json          # Root scripts orchestration using concurrently
├── schema.sql            # Supabase SQL table schemas & visitor RPC increment function
├── client/               # React + Vite frontend
│   ├── public/           # Static assets, including the downloadable resume PDF
│   └── src/              # App.jsx, index.css, main.jsx
└── server/               # Express.js backend API
    ├── index.js          # REST API endpoints & Supabase integration
    └── .env.example      # Backend configuration example
```

---

## Getting Started

### 1. Database Setup (Supabase)
1. Go to [Supabase Console](https://supabase.com) and create a new project.
2. Navigate to the **SQL Editor** in the side navigation.
3. Click **New Query**, paste the contents of `schema.sql` (found at the root of this project), and click **Run**.
   This will:
   - Create the `projects`, `messages`, and `visitors` tables.
   - Set up Row Level Security (RLS) policies.
   - Insert seed project data.
   - Create a PL/pgSQL database function `increment_visitor_count()` to atomically update the visitor counter.

### 2. Environment Configurations
In the `server` directory, create a `.env` file from the example:
```bash
cp server/.env.example server/.env
```
Open `server/.env` and update the variables:
```env
PORT=5000
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
FRONTEND_URL=http://localhost:5173
```
*Note: If no Supabase environment variables are provided, the backend will gracefully run in **Mock Database Mode**, using local memory variables so the app remains fully testable without database configuration.*

### 3. Install Dependencies & Start Development
From the root directory, install all dependencies (root, client, and server) with a single command:
```bash
npm run install:all
```

Then, boot up both the frontend and backend development servers concurrently:
```bash
npm run dev
```

The frontend will run on [http://localhost:5173](http://localhost:5173) and the backend on [http://localhost:5000](http://localhost:5000).

---

## API Endpoints

- `GET /api/projects`: Fetches the list of portfolio projects (featured ones first).
- `GET /api/visitors`: Atomically increments and returns the total portfolio view count.
- `POST /api/contact`: Accepts and sanitizes contact form submissions (`name`, `email`, `message`), checks a honeypot field for bot/spam prevention, and inserts entries into the database.
- `GET /api/health`: Basic API health check endpoint.
