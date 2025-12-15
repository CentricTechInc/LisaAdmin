## Goal
In colours ko theme mein officially add karna aur components (buttons, badges, table states) ko in colours ke saath consistent banana.

## Short Reason
Brand consistency + readability. Har page par same colours — Success/Failed chips, buttons, backgrounds — aasani se reuse honge.

## Kaise Karenge (Steps)
1) Global CSS Variables add
- `src/styles/globals.css` ke `:root` mein brand tokens add:
```css
:root {
  --brand-success: #00C950;
  --brand-success-ghost: #00C9501A; /* ~10% alpha */
  --brand-danger: #FF4460;
  --brand-danger-ghost: #FF44601A;
  --brand-text-dark: #40393A;
  --brand-surface: #F0F0F0;
  --brand-dark-bg: #13000A;
}
```
- Dark mode `(.dark)` mein zarurat par `--brand-dark-bg` use karke background adjust.
- Tailwind v4 tokens map (globals.css ke `@theme inline`) mein helpful aliases set: `--color-success`, `--color-success-ghost`, `--color-danger`, `--color-danger-ghost`, `--color-text-strong`, `--color-surface`.

2) UI Atoms update
- `Button` variants:
  - `primary` → default neutral rahe; 
  - naya variant `success` (bg: `var(--color-success)`, text white)
  - naya variant `danger` (bg: `var(--color-danger)`, text white)
  - `ghost` success/danger ke liye utility classes provide: background `success-ghost`/`danger-ghost`, text `success`/`danger`.
- `Input`/`Select` background: `varslate-400` aligned with `--brand-surface` in light theme.

3) Status Badges (Transactions jaisa UI)
- Chhota reusable Badge banaenge:
```tsx
<div className="inline-flex items-center rounded px-2 py-1 text-xs"
     style={{ backgroundColor: "var(--color-success-ghost)", color: "var(--color-success)" }}>
  Success
</div>
```
- Variants: `success`, `danger`, `pending` (pending ke liye text `var(--brand-text-dark)`, bg `var(--color-muted)`).

4) DataTable States
- `TableSkeleton` and hover states ko `--color-muted` se rakhen, borders ko `--color-border`.
- Error state ka red colour `--color-danger` use kare.

5) BaseLayout Controls
- Options menu/filters neutral rahein; Export/Import buttons ke liye:
  - Export → `success` variant (green)
  - Import → `ghost danger` (light red bg + red text) agar destructive ho.

6) Accessibility Check
- Contrast verify karein: green/red text + ghost background ≥ 4.5:1 for small text. Agar low ho to text ko white/black switch kar denge.

7) Performance/Theme
- Sirf CSS variables change; JS render cost same. Theme switch dark/light mein vars handle ho rahe hain.

## Expected Result
- Success chip hamesha green (#00C950) + light green bg (#00C9501A).
- Failed chip hamesha red (#FF4460) + light red bg (#FF44601A).
- Text strong #40393A, surfaces #F0F0F0, dark backgrounds #13000A.

## Example Snippets
- Button success:
```tsx
<Button variant="success">Unblock</Button>
```
- Badge failed:
```tsx
<span className="badge-danger">Failed</span>
```
- CSS helpers:
```css
.badge-success{background:var(--color-success-ghost);color:var(--color-success)}
.badge-danger{background:var(--color-danger-ghost);color:var(--color-danger)}
```

## Next Actions (on approval)
1. Globals mein brand variables + theme aliases add.
2. Button mein `success`/`danger` variants implement.
3. Badge utility/component create aur Transactions table par apply.
4. Minor UI polish in BaseLayout (Export/Import colours).