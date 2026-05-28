# Frontend Development Guide

## Overview
React 19 SPA frontend for fingerprint IoT attendance system. Built with Vite, TailwindCSS, React Router, React Hook Form, React Query, and Zustand state management.

---

## Tech Stack & Tools

| Layer | Tools |
|-------|-------|
| **Build & Dev** | Vite 8 (lightning fast bundler), Node 22+ |
| **Framework** | React 19 + React DOM |
| **Routing** | React Router DOM 7 |
| **Styling** | TailwindCSS 4 + Lucide React icons |
| **State** | Zustand 5 (auth store), React Query 5 (server state) |
| **Forms** | React Hook Form 7 + Zod 4 validation + @hookform/resolvers |
| **UI/UX** | SweetAlert2 (modals) |
| **Lang** | TypeScript 6 + ESLint |

### Scripts
```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build production bundle
npm run lint         # Check code quality
npm run preview      # Preview production build
```

---

## Project Structure

```
src/
├── app/
│   ├── layouts/          # AuthLayout, DashboardLayout (wrapper components)
│   ├── providers/        # AppProvider (Query Client setup)
│   └── router/index.tsx  # Route definitions
├── pages/                # Route page components (LoginPage, DashboardPage, etc)
├── components/           # Reusable UI components
├── features/             # Feature-specific logic (attendance, devices)
│   ├── api/              # API query functions
│   └── hooks/            # Feature hooks (useAttendance, etc)
├── services/
│   └── fetcher.ts        # HTTP client (BASE_URL: http://localhost:3000)
├── store/                # Zustand stores (authStore.ts)
└── styles/               # Global styles (tailwind.css)
```

---

## Creating a New Page

### 1. Create Page Component
```typescript
// src/pages/NewFeaturePage.tsx
import { useEffect, useState } from 'react'
import DashboardLayout from '../app/layouts/DashboardLayout'
import { useQuery } from '@tanstack/react-query'
import { fetcher } from '../services/fetcher'

export default function NewFeaturePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['newFeature'],
    queryFn: () => fetcher<any>('/api/newfeature'),
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">New Feature</h1>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error loading data</p>}
        {data && <div>{/* Render data */}</div>}
      </div>
    </DashboardLayout>
  )
}
```

### 2. Register Route in Router
```typescript
// src/app/router/index.tsx
import NewFeaturePage from '../../pages/NewFeaturePage'

export const AppRouter = createBrowserRouter([
  // ... existing routes
  {
    path: '/newfeature',
    element: <NewFeaturePage />,
  },
])
```

### 3. Add Navigation Link
- Update layout navigation or create menu items linking to `/newfeature`

---

## Backend Integration

### API Communication Pattern

**1. Fetch Data (GET)**
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['key', dependency],
  queryFn: () => fetcher<ResponseType>('/api/endpoint'),
})
```

**2. Mutate Data (POST/PUT/DELETE)**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()
const mutation = useMutation({
  mutationFn: (payload) => 
    fetcher('/api/endpoint', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['key'] })
    Swal.fire('Success!', 'Done', 'success')
  },
  onError: (error) => Swal.fire('Error', error.message, 'error'),
})

mutation.mutate(formData)
```

**3. Form Submission with Validation**
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  field1: z.string().min(1, 'Required'),
  field2: z.number(),
})

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
})

const onSubmit = (data) => mutation.mutate(data)

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <input {...register('field1')} />
    {errors.field1 && <span>{errors.field1.message}</span>}
  </form>
)
```

### Base URL Configuration
Edit `src/services/fetcher.ts` `BASE_URL` if backend port changes (currently `http://localhost:3000`).

### API Endpoints (from backend)
- `POST /api/auth/login` — Authentication
- `GET /api/attendance` — Fetch attendance records
- `GET /api/employees` — List employees
- `POST /api/device/log` — Log device activity
- See backend routes for full list

---

## State Management

**Authentication State (Zustand)**
```typescript
import { useAuthStore } from '../store/authStore'

const { token, setToken, logout } = useAuthStore()
```

**Server State (React Query)**
- Automatic caching, refetching, synchronization
- Use `queryClient.invalidateQueries()` to refresh after mutations

---

## Development Workflow

1. **Create feature** → `src/features/{feature}/` (API functions, hooks)
2. **Create page** → `src/pages/{FeaturePage}.tsx`
3. **Register route** → `src/app/router/index.tsx`
4. **Use queries/mutations** → `useQuery()`, `useMutation()` from React Query
5. **Style with TailwindCSS** → Utility classes (`className="..."`), use dark mode (already set)
6. **Handle forms** → React Hook Form + Zod validation
7. **Show feedback** → `SweetAlert2` for modals/alerts

---

## Common Patterns

**Dark Theme** — TailwindCSS dark mode active; use `dark:` prefix if needed
**Error Boundary** — Wrap mutations in `try/catch` or use `onError` callback
**Loading States** — Always handle `isLoading`, `isPending` from queries/mutations
**Auth Guards** — Check `useAuthStore().token` before rendering protected pages
