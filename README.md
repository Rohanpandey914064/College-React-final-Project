# ByteBite — Molecular Culinary Transformer

> **A pure React + Vite web application that decodes food flavor at the molecular level.**  
> No backend. No API keys. Runs entirely in the browser using local JSON data.

---

##  Table of Contents

- [Overview](#overview)
- [Live Preview](#live-preview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Features](#pages--features)
- [Data Architecture](#data-architecture)
- [Components](#components)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [Migration Summary](#migration-summary)
- [Coming Soon](#coming-soon)
- [Credits](#credits)

## Overview

ByteBite is a **computational gastronomy** tool that helps you:

- **Deconstruct** any food ingredient into its molecular flavor components
- **Substitute** unhealthy ingredients with healthier alternatives that taste the same
- **Explore** all 900+ known food ingredients organized by category
- **Visualize** how ingredients connect through shared flavor molecules as an interactive network graph

This version is a complete **frontend-only migration** from the original Next.js 14 + FastAPI stack.  
All data is served from local JSON files — no internet connection or backend server required.

---

## Live Preview

Start the app locally:

```bash
cd ZenByte/react-app
npm install
npm run dev
```

Open your browser at: **http://localhost:5173**

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server (lightning fast HMR) |
| **React Router DOM v6** | Client-side routing (replaces Next.js file routing) |
| **Framer Motion** | Page & element animations |
| **Lucide React** | Icon library |
| **Vanilla CSS** | Styling via `globals.css` design system |
| **HTML5 Canvas** | Interactive network graph visualizations |

> ❌ No TypeScript · ❌ No Backend · ❌ No Database · ❌ No API Calls

---

## Project Structure

```
react-app/
│
├── index.html                   ← App entry point with SEO meta tags
├── vite.config.js               ← Vite configuration
├── package.json                 ← Dependencies
│
└── src/
    ├── main.jsx                 ← Root render (BrowserRouter + global components)
    ├── App.jsx                  ← Route definitions (6 routes)
    │
    ├── styles/
    │   └── globals.css          ← Full design system (colors, fonts, animations, utilities)
    │
    ├── data/
    │   ├── entities.json        ← 4677 food ingredients {entity_id, name, category}
    │   ├── flavor_data.json     ← Pre-built flavor profiles for 24 popular ingredients
    │   └── substitutions.json  ← Pre-computed substitution pairs for 7 key ingredients
    │
    ├── components/
    │   ├── Navbar.jsx           ← Fixed top navigation bar with active link highlighting
    │   ├── FoodBackground.jsx   ← Animated floating food emoji background
    │   └── DynamicNetwork.jsx   ← Interactive canvas-based force graph
    │
    └── pages/
        ├── Home.jsx             ← Landing page with feature cards
        ├── Deconstruct.jsx      ← Ingredient → flavor profile analysis
        ├── Substitute.jsx       ← Ingredient → healthier alternatives
        ├── Explore.jsx          ← Browse all ingredients by category
        ├── Visualize.jsx        ← Force-directed flavor network graph
        └── Localize.jsx         ← Coming Soon stub
```

---

## Pages & Features

### 🏠 Home `/`
The landing page showcases ByteBite's capabilities.
- Large animated hero section with gradient title
- **5 feature cards** linking to all tools (Deconstruct, Substitute, Explore, Visualize, Localize)
- Floating food emojis in the background
- CTA buttons: **Start Deconstructing** and **Explore Flavor Map**

---

### 🧪 Deconstruct `/deconstruct`
Breaks an ingredient into its molecular flavor components.

**How to use:**
1. Type any ingredient in the search bar (fuzzy search over all 4677 entities)
2. OR click one of the quick-pick buttons: Butter, Cheese, Apple, Coffee, Garlic, Cinnamon, Tomato

**What you get:**
- **Flavor Profile Network** — interactive canvas graph showing all taste notes (creamy, buttery, sweet…)
- **Molecular Composition Network** — key chemical compounds (Diacetyl, Linalool, Butyric Acid…)
- **Taste Dimensions bar chart** — % breakdown of sweet, savory, salty, bitter, sour

> For ingredients not in the pre-built dataset, a graceful "Detailed analysis coming soon" card is shown.

---

### 🌿 Substitute `/substitute`
Finds healthier ingredient alternatives with a molecularly similar flavor profile.

**How to use:**
1. Type or search any ingredient
2. OR use quick-picks: Butter, Cheese, Apple, Coffee, Garlic, Cinnamon

**What you get:**
- Ranked list of alternatives (e.g. Butter → Ghee 70%, Milk 57%, Yogurt 50%…)
- **% Flavor Match** score (based on combined molecule + flavor similarity)
- Shared molecule count and shared flavor tags for each alternative
- Category badge for each substitute

---

### 🔍 Explore `/explore`
Browse the entire ingredient database of **4677 entries** organized by category.

**How to use:**
1. Browse or search the **category grid** (20+ categories: Fruit, Dairy, Spice, Herb, Seafood…)
2. Click a category to see all its ingredients
3. Click any ingredient to see its profile

**What you get:**
- If the ingredient has a pre-built profile: full **DynamicNetwork** visualization + taste dimensions
- If no profile yet: a "Coming Soon" info card

---

### 🌐 Visualize `/visualize`
Interactive force-directed graph showing how 50 ingredients relate to each other through shared flavor compounds.

**Features:**
- Nodes colored by food category (green = fruit, blue = dairy, orange = spice…)
- Edges represent shared flavor molecule connections
- Hover over a node to see its name and molecule count
- Connected nodes are highlighted on hover
- Physics simulation runs in real time (repulsion + attraction forces)
- Color-coded legend at the bottom

---

### 🌍 Localize `/localize`
*(Coming Soon)*  
A polished placeholder page for the Recipe Localization feature — recreating international dishes using local ingredients matched by molecular flavor profiles.

---

## Data Architecture

All data is stored as static JSON files inside `src/data/` and imported directly by React components.

### `entities.json`
- **Source:** Copied from `ZenByte/backend/data/entities.json`
- **Shape:** `{ entity_id: number, name: string, category: string }`
- **Size:** 4677 ingredients
- **Used by:** Search autocomplete in Deconstruct, Substitute, and Explore

```json
{ "entity_id": 60, "name": "Butter", "category": "Dairy" }
```

---

### `flavor_data.json`
- **Shape:** Array of flavor profile objects
- **Coverage:** 24 pre-built ingredients (Butter, Cheese, Ghee, Milk, Yogurt, Apple, Coffee, Garlic, Cinnamon, Tomato, Vanilla, Chocolate, Salmon, Onion, Ginger, Lemon, Strawberry, Olive Oil, Honey, Basil, Mint, Sugar, Black Pepper, and more)

```json
{
  "entity_id": 60,
  "name": "Butter",
  "category": "Dairy",
  "molecule_count": 23,
  "flavor_profile": ["creamy", "fatty", "sweet", "buttery", "milky"],
  "taste_dimensions": { "sweet": 0.3, "savory": 0.6, "salty": 0.1 },
  "top_molecules": [
    { "name": "Diacetyl", "flavor_profile": ["buttery", "creamy"], "pubchem_id": 650 }
  ]
}
```

---

### `substitutions.json`
- **Shape:** Object keyed by `entity_id` (as string)
- **Coverage:** Butter (60), Cheese (62), Apple (162), Coffee (46), Garlic (259), Cinnamon (330), Tomato (364)

```json
{
  "60": {
    "source": { "entity_id": 60, "name": "Butter", ... },
    "substitutions": [
      {
        "entity_id": 87, "name": "Ghee",
        "similarity": {
          "molecule_similarity": 0.72,
          "flavor_similarity": 0.68,
          "combined_score": 0.70,
          "shared_molecule_count": 16,
          "shared_flavors": ["creamy", "buttery", "fatty"]
        }
      }
    ]
  }
}
```

---

## Components

### `Navbar.jsx`
- Fixed top bar, always visible
- Logo: 🧬 ByteBite (links to `/`)
- 6 nav links: Home, Deconstruct, Substitute, Explore, Visualize, Localize
- Active link is highlighted in amber
- Fully responsive — collapses to a hamburger menu on mobile

### `FoodBackground.jsx`
- 12 randomly positioned food emoji items (🍔 🍕 🌮 🧀 ☕ 🍎 …)
- Each floats upward with a slow Framer Motion animation
- Subtle blur and low opacity — purely decorative, `pointer-events: none`

### `DynamicNetwork.jsx`
- Renders on an HTML5 `<canvas>` element
- Center node = the ingredient name (gold circle)
- Satellite nodes = flavor notes or molecule names (colored circles)
- Physics engine: repulsion between nodes + spring attraction to center
- Fully interactive — nodes can be **clicked and dragged** with mouse or touch
- No external libraries — entirely custom canvas logic

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### Installation

```bash
# 1. Navigate to the react app directory
cd ZenByte/react-app

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder — ready to deploy to any static host (Netlify, Vercel, GitHub Pages, etc.).

---

## How It Works

### Search (Deconstruct & Substitute)
```
User types "app"
  → entities.json is filtered client-side:
    e.name.toLowerCase().includes("app")
  → Returns: Apple, Apple Brandy, Apple Cider...
  → Shown in dropdown (debounced at 200ms)
```

### Deconstruct Lookup
```
User selects "Butter" (entity_id: 60)
  → Search flavor_data.json for entity_id === 60
  → Found? → Render DynamicNetwork + taste bars
  → Not found? → Show "Coming Soon" amber card
```

### Substitute Lookup
```
User selects "Butter" (entity_id: 60)
  → Access substitutions.json["60"]
  → Found? → Render ranked alternative cards
  → Not found? → Show "Coming soon" placeholder with helpful tip
```

### Explore Browsing
```
Mount → Group entities.json by category
  → 20+ category cards rendered
  → Click "Dairy" → list of all 35 Dairy ingredients
  → Click "Butter" → load flavor_data.json profile (if available)
```

### Visualize Graph
```
Mount → Take first 50 entities from entities.json
  → Position in a circle around center
  → Build edges: same-category pairs get 40% connection probability
  → Run physics simulation on canvas (requestAnimationFrame loop)
  → Hover reveals node name + molecule count
```

---

## Migration Summary

This app was migrated from:

| Before | After |
|---|---|
| Next.js 14 (App Router) | Vite + React 18 |
| FastAPI Python backend | No backend |
| `fetch("/api/...")` calls | Local JSON imports |
| `next/link` | `react-router-dom Link` |
| `usePathname()` | `useLocation().pathname` |
| TypeScript (`.tsx`) | Plain JavaScript (`.jsx`) |
| `"use client"` directives | Not needed (Vite = client-only) |

The original `ZenByte/frontend/` and `ZenByte/backend/` folders are **untouched and preserved**.

---

## Coming Soon

| Feature | Status |
|---|---|
| Recipe Localization | 🔜 Requires FlavorDB API |
| Full deconstruct for all 4677 ingredients | 🔜 Needs full FlavorDB dataset |
| Substitutions for all ingredients | 🔜 Needs full dataset |
| 3D Galaxy visualization | 🔜 Three.js integration |
| Save / share results | 🔜 Future feature |

---

## Credits

- **FlavorDB** — Flavor molecule database by IIIT Delhi: [cosylab.iiitd.edu.in/flavordb](https://cosylab.iiitd.edu.in/flavordb/)
- **RecipeDB** — Recipe database by IIIT Delhi: [cosylab.iiitd.edu.in/recipedb](https://cosylab.iiitd.edu.in/recipedb/)
- Built with ❤️ using React, Vite, and Framer Motion

---

*ByteBite — Where Molecular Science Meets Culinary Art* 🧬🍽️
