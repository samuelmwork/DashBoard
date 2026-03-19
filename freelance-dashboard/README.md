# Freelance OS — Premium Admin Dashboard

A production-grade freelance management dashboard built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it auto-redirects to `/dashboard`.

## Pages

| Route | Description |
|---|---|
| `/dashboard` | KPI overview, recent leads, pipeline, revenue chart |
| `/leads` | Full leads table with search, filter, add, delete, status update |
| `/projects` | Kanban board — Upcoming / Active / Completed |
| `/finance` | Revenue charts, KPIs, top earners, split visualization |

## Features

- ✅ Add & delete leads
- ✅ Update lead status (modal)
- ✅ Add & delete projects
- ✅ Move projects through pipeline stages
- ✅ Set final price on projects
- ✅ Revenue charts (area + bar)
- ✅ Framer Motion page transitions & staggered animations
- ✅ Fully responsive
- ✅ Global state via React Context

## Design System

| Token | Value |
|---|---|
| Page Background | `#0A0A0A` |
| Section Background | `#111111` |
| Hover / Active | `#1A1A1A` |
| Border | `#262626` |
| Accent Blue | `#3B82F6` |
| Accent Orange | `#F97316` |
| Success | `#22C55E` |
| Danger | `#EF4444` |

## Folder Structure

```
freelance-dashboard/
├── app/
│   ├── layout.tsx          # Root layout with sidebar + topbar
│   ├── globals.css
│   ├── page.tsx            # Redirects to /dashboard
│   ├── dashboard/page.tsx
│   ├── leads/page.tsx
│   ├── projects/page.tsx
│   └── finance/page.tsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── Topbar.tsx
│   ├── charts/
│   │   └── RevenueChart.tsx
│   └── ui/
│       └── index.tsx       # Card, Button, Input, Modal, Badge, etc.
└── lib/
    ├── data.ts             # Types + mock data
    ├── utils.ts            # cn(), formatCurrency(), statusConfig
    └── store.tsx           # React Context global state
```
# DashBoard
