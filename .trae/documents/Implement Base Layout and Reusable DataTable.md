## Goal
Admin Panel mein ek generic Base Layout aur fully-typed reusable DataTable banana, jismein search + debounce, client-side pagination, options dropdown, sorting, export/import, aur accessibility + performance ko cover kare.

## Current Repo Analysis
- Framework: Next.js (Pages Router) with React (`src/pages/_app.tsx`:5).
- Styling/Theme: Tailwind v4 + CSS variables (`src/styles/globals.css`:8–41, 96–128).
- No existing `layouts/` ya `components/` folders; home page (`src/pages/index.tsx`) demo content.
- Testing/Storybook abhi installed nahi.

## High-Level Architecture
- **Folders**:
  - `src/layouts/BaseLayout.tsx`: Page wrapper with SearchBar, Pagination, OptionsMenu, children area.
  - `src/components/table/DataTable.tsx`: Reusable table.
  - `src/components/table/types.ts`: Strong TypeScript types.
  - `src/components/table/TableHeader.tsx`, `TableBody.tsx`, `TableSkeleton.tsx`, `TableError.tsx`.
  - `src/components/ui/*`: Small UI atoms (Input, Button, Select, Dropdown) via Tailwind.
  - `src/tests/*`: Unit tests via Vitest + Testing Library.
  - `.storybook/*`: Storybook setup.
  - `docs/components/table.md`: Documentation.

## BaseLayout Features
1. **Search**: Debounced input (default 300ms), clear button, optional filters via props.
2. **Pagination**: Client-side; page-size selector (5/10/25/50), prev/next + numbered pager, current page + total count.
3. **Options Menu**: Dropdown actions; optional sorting shortcuts; export CSV + import CSV handlers via props.
4. **Theme + A11y**: Tailwind + CSS variables; keyboard nav, focus states, proper `aria-*`.
5. **Props (overview)**:
   - `onSearch(term)`, `onClear()`, `filters`, `page`, `pageSize`, `onPageChange`, `onPageSizeChange`, `actions`, `onExport()`, `onImport(file)`.

## DataTable Features
- **Header**: Configurable columns, sortable, responsive, column visibility toggles.
- **Body**: Dynamic rows, selection (checkbox + shift-range), hover effects, loading states.
- **Error/Empty**: Dedicated components with retry.
- **Perf**: `useMemo`, `useCallback`, stable keys, optional windowing toggle for large lists.
- **A11y**: `role="table"`, `aria-sort`, focusable headers, keyboard selection.

## Core Types (sketch)
```ts
export type Column<T> = {
  id: string
  header: string
  accessor?: (row: T) => React.ReactNode
  field?: keyof T
  sortable?: boolean
  visible?: boolean
  width?: string | number
}

export type SortState = { columnId: string; direction: 'asc' | 'desc' }

export type DataTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  selectable?: boolean
  initialSort?: SortState
  page?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  onSortChange?: (s: SortState | null) => void
  loading?: boolean
  error?: string | null
  onRetry?: () => void
}
```

## Example Usage (Home page)
- `src/pages/index.tsx` mein `BaseLayout` + `DataTable` import karke sample professionals list render karna, taa ke screenshots jaisa UI dikh sake.

## Testing Plan
- Install Vitest + RTL; write tests for:
  - Debounce search calls.
  - Pagination transitions + page-size.
  - Sorting ascending/descending.
  - Column toggle visibility.
  - Selection behavior.
  - A11y roles/labels.

## Storybook Plan
- Story files for: Default, Loading, Error, Empty, WithSelection, WithColumnToggles, LargeData.
- Controls for page size, sorting, theme switch (light/dark).

## Documentation
- `docs/components/table.md`: Props table, examples, a11y notes, perf tips.

## Commands (to be run after approval)
- Testing: `npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom`
- Storybook: `npm i -D @storybook/react vite-tsconfig-paths` then `npx storybook init`
- CSV helpers (optional): `npm i -D papaparse` or use native APIs.

## Implementation Steps
1. Create `layouts/BaseLayout` with SearchBar, Pagination, OptionsMenu.
2. Build UI atoms (`Input`, `Button`, `Select`, `Dropdown`) with Tailwind.
3. Implement `DataTable` + subcomponents and types; wire sorting/pagination/selection.
4. Add loading skeletons and error/empty states.
5. Update `pages/index.tsx` demo to use layout + table.
6. Add unit tests.
7. Add Storybook stories.
8. Write docs.

## Expected Result
- Reusable, typed table + layout, theme-aware and accessible, verified by tests + stories, demo visible on Home page.