# FindIt — Smart Lost & Found

**Lost Something? Let's Find It.**

FindIt is a Class 10 Little Kites web development project built with **React + Vite**. It helps
a school community report lost belongings, post found items, search and filter reports, and see
lightweight "possible match" suggestions — all stored locally in the browser with `localStorage`.

> This is a frontend-only demo. There is no backend, login system, or server. Data is stored only
> in the current browser and is not shared between devices.

---

## ✨ Features

- Premium glassmorphism UI with a full light/dark theme toggle.
- **Honesty Rewards** page (`/rewards`): points, five tiers, six badges, a "valuable things still
  waiting for their owner" shelf and a school honour board built from the reports in this browser.
- Report lost or found items with validation, image upload (compressed client-side), and a success screen.
- Browse page with search, category/type/location/date filters, sorting, and pagination.
- A transparent, explainable "possible match" scoring engine (no external AI).
- "My Reports" page to edit, resolve/reopen, delete, export/import, and load sample demo data.
- A safe "I think this is mine" claim flow for found items.
- Fully responsive, accessible (keyboard + screen-reader friendly), and optimized for low-end devices.

### Motion & performance

Every animation is compositor-only (`transform` / `opacity`) and there is a global
`prefers-reduced-motion` kill-switch. Scroll reveals use a one-shot `IntersectionObserver` that
disconnects after firing, the aurora background is a static radial-gradient layer (no `filter: blur()`
repaints), and scroll/pointer handlers are `requestAnimationFrame`-throttled.

### Honesty points

| Action | Points |
| --- | --- |
| Report a lost item | +5 |
| Hand in a found item | +15 |
| Mark a find as valuable | +35 |
| Found item returned to its owner | +45 |
| Your lost item comes home | +25 |
| Claim submitted | +8 |

Tiers: First Spark → Helpful Hand (40) → Trusted Finder (120) → Honest Heart (220) → Gold Guardian (360).

## 🧱 Tech Stack

- React 19 + Vite
- React Router
- Lucide React icons
- Tailwind CSS v4 (utility classes) + custom CSS variables for the design system
- Browser `localStorage` for persistence

## 🚀 Running locally (in VS Code or any terminal)

1. Install [Node.js](https://nodejs.org/) (v18 or newer).
2. Open this folder in VS Code.
3. Open a terminal (``Terminal → New Terminal``) and run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the URL shown in the terminal (usually `http://localhost:5173`).

## 📦 Production build

```bash
npm run build
npm run preview
```

The optimized static site is generated in the `dist/` folder.

## 🌐 Deploying to GitHub Pages

1. Push this project to a GitHub repository.
2. Build the project: `npm run build`.
3. Deploy the contents of `dist/` to the `gh-pages` branch (for example using the
   [`gh-pages`](https://www.npmjs.com/package/gh-pages) npm package, or GitHub Actions).
4. Because this app uses React Router with real URLs (like `/browse`), GitHub Pages needs a
   fallback so deep links don't 404. Copy `dist/index.html` to `dist/404.html` before deploying —
   GitHub Pages serves `404.html` for unknown routes, which lets React Router take over.

## 🗂 Project structure

```
src/
├── components/   Reusable UI building blocks (cards, forms, modals, nav, etc.)
├── pages/        One file per route/page
├── hooks/        Shared state via React Context (reports, theme, toasts)
├── utils/        Storage, matching algorithm, and validation logic
├── styles/       CSS variables, base styles, and reusable utility classes
└── types.ts      Shared data shapes (Report, Claim, categories)
```

## 🔒 Privacy note

All reports are saved using your browser's `localStorage`. This is convenient for a classroom
demo, but it is **not** a secure, multi-user database — anyone using the same browser profile can
see saved reports. Never enter phone numbers, home addresses, or ID numbers into any report.
