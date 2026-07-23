<img width="500" height="500" alt="Image" src="https://github.com/user-attachments/assets/524fa5e8-d1e7-4c03-84bf-792b23b3fe66" />

# Sentryne · CNAPP Dashboard

<img width="1536" height="1024" alt="Image" src="https://github.com/user-attachments/assets/524fa5e8-d1e7-4c03-84bf-792b23b3fe66" />

A configurable, widget-based security dashboard built with React. Every widget on the page is driven by data, not hardcoded JSX: categories and widgets
come from a JSON config, live in a Zustand store, and can be added, removed, and searched entirely
on the client.

![tech](https://img.shields.io/badge/React-19-149eca) ![tech](https://img.shields.io/badge/Vite-8-646cff) ![tech](https://img.shields.io/badge/Zustand-5-orange)

---

## 1. Run it locally

**Requirements:** Node.js 18+ (Node 20 LTS recommended) and npm.

```bash
# 1. Move into the project folder
cd cnapp-dashboard

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open the URL Vite prints in your terminal — usually **http://localhost:5173**.

Other useful scripts:

```bash
npm run build     # production build, output goes to /dist
npm run preview   # serve the production build locally, to sanity-check it
npm run lint      # run oxlint over the src/ folder
```

No environment variables, backend, or API keys are needed — everything runs client-side.

---

## 2. What this covers

| # | Requirement | Where it lives |
|---|---|---|
| 1 | JSON drives categories + widgets | [`src/data/dashboardConfig.json`](src/data/dashboardConfig.json) |
| 2 | Add / remove a widget within a category | `AddWidgetDrawer.jsx` (checklist) + the ✕ on every `WidgetCard` |
| 3 | Widget content is placeholder data | Donut/bar widgets use illustrative numbers; custom widgets use whatever text you type in |
| 4 | "+ Add Widget" → name + text → added to category | The **Create a custom widget** form inside the drawer |
| 5 | ✕ on a widget removes it, or uncheck it in Add Widget | Both call the same store action, so they always agree |
| 6 | Search across all widgets | The search field in the top navbar |
| 7 | Local state management | [Zustand](https://github.com/pmndrs/zustand), persisted to `localStorage` |
| 8 | How to run it | This section ⬆️ |

---

## 3. How the data model works

`src/data/dashboardConfig.json` is the seed data. It looks like this (trimmed):

```json
{
  "categories": [
    {
      "id": "cspm",
      "tabLabel": "CSPM",
      "name": "CSPM Executive Dashboard",
      "accent": "indigo",
      "widgets": [
        {
          "id": "cloud-accounts",
          "name": "Cloud Accounts",
          "type": "donut",
          "active": true,
          "data": { "total": 4, "segments": [ ... ] }
        }
      ]
    }
  ]
}
```

- **A category** is a section on the dashboard (`CSPM Executive Dashboard`, `CWPP Dashboard`, …).
  Its `tabLabel` is also what shows up as a tab inside the Add Widget drawer.
- **A widget** belongs to exactly one category and always has an `active` flag. "Removing" a
  widget never deletes it from the catalog — it just flips `active` to `false`. That's what lets
  the same widget be un-removed later from the drawer's checklist without losing its
  configuration.
- **`type`** picks which renderer draws the widget: `donut`, `stackedBar`, `bar` (row progress
  bars), `empty` (the "No graph data available!" placeholder), or `text` (custom, user-created
  widgets).

This JSON is only the *seed*. On first load it's copied into the Zustand store, and from then on
the store is the single source of truth — the JSON file itself is never mutated at runtime.

## 4. State management (Zustand)

`src/store/useDashboardStore.js` exposes:

- `categories` — the live list of categories/widgets.
- `searchQuery` / `setSearchQuery`
- `setWidgetActive(categoryId, widgetId, active)` — toggle one widget.
- `removeWidget(categoryId, widgetId)` — the ✕ button; sets `active: false`.
- `addCustomWidget(categoryId, { name, text })` — appends a new `type: "text"` widget.
- `applyWidgetSelection(categoryId, selection)` — bulk-applies the drawer's checklist on Confirm.
- `resetDashboard()` — restores the original seed data (there's a reset icon in the navbar for this).

State is persisted to `localStorage` via Zustand's `persist` middleware under the key
`sentryne-cnapp-dashboard`, so your widget layout survives a page refresh. Clearing that key (or
hitting the reset button) puts the dashboard back to its default state.

## 5. Adding / removing widgets, in practice

- **Add:** click **+ Add Widget** (top right, or the dashed tile at the end of any category).
  Pick a tab, tick any existing widgets you want turned on, optionally fill in **Widget name** +
  **Widget text** and click **Add to list** to stage a brand-new widget, then **Confirm**.
  **Cancel** discards everything you changed in that session.
- **Remove:** click the ✕ in the top-right corner of any widget card. It's equivalent to
  unchecking that widget from the drawer — both update the same store field.
- **Search:** type into the navbar search box. Matching widgets stay visible, everything else (and
  any category left with no matches) is hidden, with a small banner showing the match count.

## 6. Project structure

```
src/
├── data/dashboardConfig.json     # seed categories + widgets
├── store/useDashboardStore.js    # Zustand store (single source of truth)
├── utils/tone.js                 # tone → CSS color mapping, number formatting
├── components/
│   ├── Navbar.jsx                # brand, breadcrumb, search, actions
│   ├── CategorySection.jsx       # one dashboard section (heading + grid + empty state)
│   ├── WidgetCard.jsx            # card shell + ✕ button, dispatches by widget type
│   ├── AddWidgetDrawer.jsx       # the "+ Add Widget" side panel
│   └── widgets/
│       ├── DonutWidget.jsx       # CSS conic-gradient donut, no chart library needed
│       ├── StackedBarWidget.jsx  # single segmented bar (e.g. Image Risk Assessment)
│       ├── ProgressBarWidget.jsx # multi-row progress bars (e.g. Compliance Score)
│       ├── EmptyWidget.jsx       # "No graph data available!" state
│       └── TextWidget.jsx        # user-created custom widgets
├── App.jsx                       # wires the store to the page
└── index.css                     # design tokens + all component styles
```

## 7. Design notes

The visual language leans on the source dashboard's cloud-security identity: a deep navy header,
a teal "live/active" accent, and a monospace face (JetBrains Mono) for every data figure so
numbers read like telemetry rather than body copy. Each category gets its own accent color (
indigo / teal / amber / violet) that shows up as a thin top bar on its widget cards — a quick,
functional way to tell at a glance which section a card belongs to, especially once search
results start mixing categories together.

No chart library was used — the donut and bar widgets are hand-built with `conic-gradient` and
flexbox, which keeps the bundle small and made it easier to theme them exactly to this palette.

## 8. Known trade-offs

- The "Last 2 days" style date filter from the reference design was left out — it wasn't part of
  the functional requirements, and adding a non-functional dropdown felt worse than leaving it
  out.
- Widget data for the seeded charts is illustrative (per the assignment brief); custom widgets are
  free-text, exactly as specified.

## 9. Screenshots

<img width="1365" height="641" alt="Image" src="https://github.com/user-attachments/assets/06b71491-f514-4864-85f7-eb573215f45f" />

<img width="1365" height="641" alt="Image" src="https://github.com/user-attachments/assets/968063e3-970e-4bc6-ab07-0ca6846bc52d" />

<img width="1365" height="642" alt="Image" src="https://github.com/user-attachments/assets/81a9ee49-8f28-4185-a1fb-25368f2f1b97" />
