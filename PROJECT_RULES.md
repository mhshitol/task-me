# PROJECT_RULES.md
# TASK ME — Permanent Project Reference

> **STATUS: LOCKED** — This document is the single source of truth for the TASK ME project.
> No architecture, naming, or structural changes may be made without explicit user instruction.

---

## 1. Project Vision

**TASK ME** is a production-level, smart task management web application.

| Attribute      | Detail                                                                 |
|----------------|------------------------------------------------------------------------|
| **App Name**   | TASK ME                                                                |
| **Goal**       | Help users manage tasks efficiently with a clean, modern interface     |
| **Design Bar** | Notion + Linear + Todoist quality — professional, minimal, fast        |
| **Audience**   | Individual users (Phase 1–2), Teams (Phase 3)                          |
| **Deployment** | Vercel (frontend) + Supabase (backend/database)                        |

### Core User Capabilities
- Create, edit, delete tasks
- Mark tasks complete / incomplete
- Organize tasks by categories
- Assign due dates and priorities (Low / Medium / High)
- View a progress overview dashboard

---

## 2. Approved Tech Stack

> **LOCKED. Do not change any layer without explicit instruction.**

| Layer              | Technology                        | Version / Notes                          |
|--------------------|-----------------------------------|------------------------------------------|
| **Framework**      | Next.js (App Router)              | v14+, full-stack monorepo                |
| **Language**       | TypeScript                        | Strict mode enabled                      |
| **Styling**        | Tailwind CSS                      | v3+                                      |
| **Component Lib**  | shadcn/ui                         | On top of Tailwind, Radix primitives     |
| **Database**       | PostgreSQL                        | Hosted via Supabase                      |
| **ORM**            | Prisma                            | Type-safe queries + migrations           |
| **Auth**           | Supabase Auth                     | Email + OAuth (Google), JWT cookies      |
| **Server State**   | TanStack Query (React Query)      | v5+, caching + optimistic updates        |
| **UI State**       | Zustand                           | Modals, sidebar, filters                 |
| **Validation**     | Zod                               | Shared client + server schemas           |
| **Deployment**     | Vercel + Supabase                 | Free tier to start                       |

---

## 3. Folder Structure

> **LOCKED. Do not rename or move any folder or file without explicit instruction.**

```
task-me/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── tasks/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── categories/
│   │       └── page.tsx
│   ├── api/
│   │   ├── tasks/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   └── categories/
│   │       └── route.ts
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/                         ← shadcn/ui auto-generated base components
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskFilters.tsx
│   │   └── TaskStatusBadge.tsx
│   ├── categories/
│   │   ├── CategoryPill.tsx
│   │   └── CategorySidebar.tsx
│   ├── dashboard/
│   │   ├── ProgressRing.tsx
│   │   ├── StatsCard.tsx
│   │   └── QuickAddTask.tsx
│   └── layout/
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── ThemeToggle.tsx
│
├── lib/
│   ├── prisma.ts
│   ├── supabase.ts
│   ├── validations/
│   │   ├── task.schema.ts
│   │   └── category.schema.ts
│   └── utils.ts
│
├── hooks/
│   ├── useTasks.ts
│   ├── useCategories.ts
│   └── useTaskFilters.ts
│
├── store/
│   └── useUIStore.ts
│
├── types/
│   └── index.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── middleware.ts
├── PROJECT_RULES.md                ← This file
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Naming Conventions

### Files & Folders
| Type              | Convention          | Example                     |
|-------------------|---------------------|-----------------------------|
| Pages             | `page.tsx`          | `app/(dashboard)/page.tsx`  |
| Layouts           | `layout.tsx`        | `app/(dashboard)/layout.tsx`|
| Components        | PascalCase          | `TaskCard.tsx`              |
| Hooks             | camelCase + `use`   | `useTasks.ts`               |
| Stores            | camelCase + `use`   | `useUIStore.ts`             |
| API Routes        | `route.ts`          | `app/api/tasks/route.ts`    |
| Schemas           | camelCase + `.schema` | `task.schema.ts`          |
| Utilities         | camelCase           | `utils.ts`                  |
| Types file        | `index.ts`          | `types/index.ts`            |

### Code Conventions
| Type              | Convention          | Example                          |
|-------------------|---------------------|----------------------------------|
| React components  | PascalCase          | `TaskCard`, `CategoryPill`       |
| Functions         | camelCase           | `createTask`, `updateStatus`     |
| Constants         | SCREAMING_SNAKE     | `MAX_TASKS`, `DEFAULT_PRIORITY`  |
| TypeScript types  | PascalCase          | `Task`, `Category`, `User`       |
| TypeScript enums  | PascalCase          | `Priority`, `TaskStatus`         |
| Database tables   | snake_case          | `tasks`, `categories`, `users`   |
| Database columns  | snake_case          | `due_date`, `user_id`            |
| API endpoints     | kebab-case          | `/api/tasks`, `/api/categories`  |
| CSS classes       | Tailwind utilities  | `bg-indigo-500 text-sm`          |
| Env variables     | SCREAMING_SNAKE     | `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL` |

---

## 5. UI/UX Guidelines

### Color Palette
| Token             | Value           | Usage                                |
|-------------------|-----------------|--------------------------------------|
| Primary           | `indigo-500` (#6366f1) | Buttons, active states, links   |
| Primary Dark      | `indigo-600`    | Button hover                         |
| Success           | `emerald-500`   | Completed tasks, done states         |
| Warning           | `amber-500`     | Medium priority, due-soon indicators |
| Danger            | `rose-500`      | High priority, delete actions        |
| Background Light  | `neutral-50`    | Page background (light mode)         |
| Background Dark   | `neutral-950`   | Page background (dark mode)          |
| Card Light        | `white`         | Card surfaces (light mode)           |
| Card Dark         | `neutral-900`   | Card surfaces (dark mode)            |
| Border Light      | `neutral-200`   | Dividers, card borders               |
| Border Dark       | `neutral-800`   | Dividers, card borders (dark)        |
| Text Primary      | `neutral-900`   | Headings, body text                  |
| Text Muted        | `neutral-500`   | Subtitles, metadata                  |

### Typography
| Element       | Style                                    |
|---------------|------------------------------------------|
| Font family   | `Inter` (Google Fonts)                   |
| Page title    | `text-2xl font-semibold`                 |
| Section title | `text-lg font-medium`                    |
| Body          | `text-sm` (14px)                         |
| Metadata      | `text-xs text-neutral-500`               |
| Code          | `font-mono text-sm`                      |

### Spacing & Layout
| Rule              | Value                                    |
|-------------------|------------------------------------------|
| Border radius     | `rounded-xl` for cards, `rounded-lg` for inputs |
| Card padding      | `p-4` or `p-5`                           |
| Section spacing   | `gap-4` or `gap-6`                       |
| Sidebar width     | `w-64` (256px)                           |
| Max content width | `max-w-5xl`                              |
| Shadow style      | `shadow-sm` — subtle, no heavy elevation |

### Layout Pattern
```
┌──────────────┬──────────────────────────────────────────┐
│              │  Header: Page Title + Actions            │
│   Sidebar    ├──────────────────────────────────────────┤
│   (w-64)     │  Stats Bar (Progress + counts)           │
│              ├──────────────────────────────────────────┤
│  Categories  │  Filter Bar                              │
│  + Nav       ├──────────────────────────────────────────┤
│              │  Task List / Board                       │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

### Inspiration Apps
- **Notion** — whitespace, typography, sidebar navigation
- **Linear** — speed, micro-interactions, status badges
- **Todoist** — task hierarchy, priority color system

### UX Rules
- Optimistic UI updates — never make users wait for a spinner on simple actions
- Empty states — every list must have a helpful empty state with a call to action
- Keyboard accessible — all interactive elements must be keyboard navigable
- Mobile responsive — all layouts must work on screens ≥ 375px
- Dark/light mode — both modes must be fully styled

---

## 6. Coding Standards

### General
- TypeScript strict mode (`"strict": true` in tsconfig)
- No `any` types — use `unknown` if type is truly unknown
- All functions must have explicit return types
- Prefer `const` over `let`; never use `var`
- No inline styles — use Tailwind classes only
- No commented-out code in committed files

### React / Next.js
- Use Server Components by default; add `"use client"` only when needed
- Co-locate component-specific logic with the component file
- All forms validated with Zod before submission
- API errors must be caught and shown to users (no silent failures)
- Use `next/image` for all images
- Use `next/link` for all internal navigation

### API Routes
- Every route handler must validate request body with Zod
- Every route handler must verify authentication via Supabase JWT
- Return consistent JSON shape: `{ data, error, message }`
- Use appropriate HTTP status codes (200, 201, 400, 401, 403, 404, 500)

### Database / Prisma
- Never run raw SQL queries — use Prisma client only
- All database writes go through server-side Route Handlers (never from client)
- Always use `select` to limit returned fields
- Use transactions for multi-step writes

### Git Conventions
| Type       | Format                         | Example                           |
|------------|--------------------------------|-----------------------------------|
| Feature    | `feat: description`            | `feat: add task priority filter`  |
| Fix        | `fix: description`             | `fix: due date not saving`        |
| Style      | `style: description`           | `style: update card hover state`  |
| Refactor   | `refactor: description`        | `refactor: extract task hook`     |
| Config     | `chore: description`           | `chore: add prisma migration`     |

---

## 7. Database Schema

```
User
────────────────────────────────
id            UUID        PK, default uuid_generate_v4()
email         String      UNIQUE, NOT NULL
name          String?
avatar_url    String?
created_at    DateTime    default now()

Category
────────────────────────────────
id            UUID        PK, default uuid_generate_v4()
name          String      NOT NULL
color         String      NOT NULL  ← hex code e.g. "#6366f1"
user_id       UUID        FK → User.id, CASCADE DELETE
created_at    DateTime    default now()

Task
────────────────────────────────
id            UUID        PK, default uuid_generate_v4()
title         String      NOT NULL
description   String?
status        Enum        TODO | IN_PROGRESS | DONE   default TODO
priority      Enum        LOW | MEDIUM | HIGH          default MEDIUM
due_date      DateTime?
position      Int         NOT NULL default 0  ← for ordering
category_id   UUID?       FK → Category.id, SET NULL
user_id       UUID        FK → User.id, CASCADE DELETE
created_at    DateTime    default now()
updated_at    DateTime    updatedAt

[Phase 3 — Subtask]
────────────────────────────────
id            UUID        PK
title         String      NOT NULL
is_complete   Boolean     default false
task_id       UUID        FK → Task.id, CASCADE DELETE
position      Int         NOT NULL default 0
```

### Relationships
- `User` → `Category` : one-to-many
- `User` → `Task` : one-to-many
- `Category` → `Task` : one-to-many (nullable — tasks can be uncategorized)
- `Task` → `Subtask` : one-to-many (Phase 3)

---

## 8. Phase Roadmap

### Phase 1 — MVP (Core)
> Deliverable: Deployable, usable app

- [ ] Project setup (Next.js, Tailwind, shadcn/ui, Prisma, Supabase)
- [ ] Auth: sign up, login, logout
- [ ] Database schema + migrations
- [ ] Task CRUD (create, read, update, delete)
- [ ] Mark task complete / incomplete
- [ ] Task fields: title, description, due date, priority
- [ ] Default "Inbox" category
- [ ] Basic task list view
- [ ] Basic dashboard (total / completed count)

### Phase 2 — Enhanced
> Deliverable: Polished, feature-rich app

- [ ] Multiple categories with custom colors
- [ ] Filter & sort (priority, date, status, category)
- [ ] Progress overview (completion %, per-category stats)
- [ ] Due date visual indicators (overdue, due soon)
- [ ] Dark / light mode toggle
- [ ] Responsive mobile layout
- [ ] Optimistic UI updates
- [ ] Improved empty states and loading skeletons

### Phase 3 — Advanced
> Deliverable: Power-user ready

- [ ] Drag-and-drop task reordering (dnd-kit)
- [ ] Subtasks / nested tasks
- [ ] Global search
- [ ] Activity log per task
- [ ] Recurring tasks
- [ ] Email notifications (Resend)
- [ ] Export to CSV
- [ ] Collaboration / sharing (multi-user categories)

---

## 9. Environment Variables

```bash
# .env.local (never commit this file)

# Supabase
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXTAUTH_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 10. Rules of Engagement

1. **Architecture is locked.** No changes without explicit user instruction.
2. **Folder structure is locked.** No renames or moves without explicit instruction.
3. **Generate one step at a time.** Wait for user approval before proceeding.
4. **No code until asked.** Planning and architecture always comes first.
5. **Every file generated must match this document exactly.**
6. **When in doubt, reference this document first.**

---

*Last updated: Project initialization*
*Version: 1.0.0 — LOCKED*
