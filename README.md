<div align="center">

#  TASK ME

**A smart, modern task management web app — built for focus and clarity.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-task--me--one.vercel.app-6366f1?style=for-the-badge&logo=vercel)](https://task-me-one.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-mhshitol/task--me-181717?style=for-the-badge&logo=github)](https://github.com/mhshitol/task-me)

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

##  Live Demo

> **[https://task-me-one.vercel.app](https://task-me-one.vercel.app)**

Sign up for a free account and start managing your tasks instantly.

---

##  Overview

TASK ME is a production-level task management application inspired by Notion and Linear. It features a clean, minimal UI with dark/light mode, drag-and-drop task reordering, subtasks, category management, and CSV export.

---

##  Features

### Phase 1 — Core
-  Authentication (signup, login, logout) via Supabase Auth
-  Create, edit, delete tasks
-  Toggle task status (Todo → In Progress → Done)
-  Priority levels (Low, Medium, High)
-  Due dates
-  Dashboard with progress overview

### Phase 2 — Enhanced
-  Category management with custom colors
-  Search tasks in real time
-  Filter by status, priority, category
-  Sort by position, due date, priority, created date
-  Dark / light mode toggle
-  Loading skeletons
-  Overdue task alerts

### Phase 3 — Advanced
-  Drag-and-drop task reordering
-  Subtasks with progress tracking
-  Full task detail page
-  Quick add task bar
-  Export all tasks to CSV

---

##  Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Auth | Supabase Auth |
| Server State | TanStack Query (React Query v5) |
| UI State | Zustand |
| Validation | Zod + React Hook Form |
| Drag & Drop | @dnd-kit |
| Deployment | Vercel + Supabase |

---

##  Project Structure

```
task-me/
├── app/
│   ├── (auth)/           # Login & signup pages
│   ├── dashboard/        # Main app pages
│   │   ├── page.tsx      # Dashboard overview
│   │   ├── tasks/        # Task list + detail
│   │   └── categories/   # Category management
│   └── api/              # Route handlers
│       ├── tasks/        # CRUD + reorder + export
│       └── categories/   # CRUD
├── components/
│   ├── layout/           # Sidebar, Header, ThemeToggle
│   ├── tasks/            # TaskCard, TaskForm, TaskList, TaskFilters, SubtaskList
│   ├── dashboard/        # QuickAddTask, StatsCard, ProgressRing
│   └── categories/       # CategoryModalGlobal
├── hooks/                # TanStack Query hooks
├── store/                # Zustand UI store
├── lib/                  # Prisma, Supabase, utils, validations
├── types/                # Shared TypeScript types
└── prisma/               # Schema + migrations
```

---

##  Database Schema

```
User ──< Category
User ──< Task ──< Subtask
Category ──< Task
```

| Table | Key Fields |
|---|---|
| `users` | id, email, name, avatar_url |
| `categories` | id, name, color, user_id |
| `tasks` | id, title, description, status, priority, due_date, position, category_id, user_id |
| `subtasks` | id, title, is_complete, position, task_id |

---

##  Getting Started

### Prerequisites
- Node.js v20+
- A [Supabase](https://supabase.com) account

### 1. Clone the repository
```bash
git clone https://github.com/mhshitol/task-me.git
cd task-me
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials in `.env.local`:
```bash
DATABASE_URL=postgresql://...?pgbouncer=true
DIRECT_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set up the database
```bash
# Push schema to Supabase
npm run db:push

# Generate Prisma client
npm run db:generate
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

##  Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:migrate` | Create and run a migration |

---

##  Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase PostgreSQL connection string (transaction pooler) |
| `DIRECT_URL` | Supabase direct connection (for migrations) |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL |

---

##  Security

- Row Level Security (RLS) enabled on all Supabase tables
- Users can only access their own data
- JWT authentication via Supabase Auth
- Server-side auth validation on every API route
- Environment variables never exposed to the client (except `NEXT_PUBLIC_*`)

---

##  Roadmap

- [ ] Email notifications for due tasks
- [ ] Recurring tasks
- [ ] Team collaboration / shared categories
- [ ] Mobile app (React Native)

---

##  License

MIT License — feel free to use this project for personal or commercial purposes.

---

<div align="center">

Built with  using Next.js + Supabase

**[Star this repo](https://github.com/mhshitol/task-me)** if you found it useful!

</div>
