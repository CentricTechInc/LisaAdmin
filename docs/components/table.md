# DataTable Component

## Summary
Reusable, fully-typed table with sorting, filtering, pagination, selection, column visibility, and a11y support.

## Import
`import { DataTable } from "@/components/table/DataTable"`

## Props
- `columns`: Array of column configs (`id`, `header`, `field` or `accessor`, `sortable`, `visible`, `width`)
- `data`: Array of row objects
- `selectable`: Enable row selection (default: true)
- `initialSort`: `{ columnId, direction }`
- `page`, `pageSize`, `onPageChange`, `onPageSizeChange`
- `onSortChange`: Callback with current sort
- `globalFilter`: String used to filter visible columns
- `loading`, `error`, `onRetry`

## Example
```tsx
type Row = { name: string; email: string }
const columns = [
  { id: "name", header: "Name", field: "name", sortable: true },
  { id: "email", header: "Email", field: "email", sortable: true },
]
<DataTable<Row> columns={columns} data={rows} page={1} pageSize={10} />
```

## Accessibility
- `role="table"` applied
- `aria-sort` on sortable headers
- Keyboard focus rings via Tailwind
- `role="status"` and `role="alert"` used for loading/error states

## Performance
- `useMemo` for filtered/sorted rows
- Stable keys for rows
- Optional windowing toggle can be added later for 1k+ rows

## Theming
- Tailwind v4 + CSS variables from `src/styles/globals.css`

## Related
- `BaseLayout` for search, pagination, options
