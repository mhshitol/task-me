# TASK ME

> Smart task management — stay organized, move fast.

A production-level task management web app built with Next.js 14, Supabase, Prisma, Tailwind CSS, and shadcn/ui.

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | Next.js 14 (App Router, TypeScript) |
| Styling      | Tailwind CSS + shadcn/ui            |
| Database     | PostgreSQL via Supabase             |
| ORM          | Prisma                              |
| Auth         | Supabase Auth                       |
| Server State | TanStack Query                      |
| UI State     | Zustand                             |
| Validation   | Zod + React Hook Form               |
| Deployment   | Vercel + Supabase                   |

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
# Fill in all values from your Supabase dashboard
```

### 3. Push database schema
```bash
npm run db:push
```

### 4. Generate Prisma client
```bash
npm run db:generate
```

### 5. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Scripts

| Command              | Description                    |
|----------------------|--------------------------------|
| `npm run dev`        | Start development server       |
| `npm run build`      | Build for production           |
| `npm run start`      | Start production server        |
| `npm run lint`       | Run ESLint                     |
| `npm run db:push`    | Push schema to database        |
| `npm run db:generate`| Regenerate Prisma client       |
| `npm run db:studio`  | Open Prisma Studio GUI         |
| `npm run db:migrate` | Create & run a migration       |

---

## Project Structure

See `PROJECT_RULES.md` for the full locked architecture reference.

---

## Phase Roadmap

- **Phase 1** — Auth, Task CRUD, dashboard
- **Phase 2** — Categories, filters, dark mode, mobile
- **Phase 3** — Drag-and-drop, subtasks, search, notifications
