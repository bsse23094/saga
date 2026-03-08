# ⚔️ SAGA — The Path of Self-Mastery

> *"A true warrior needs no blade."* — **Thors, Vinland Saga**

**SAGA** is a self-mastery web app inspired by the philosophies of **Vinland Saga** and **Vagabond** — two manga that explore what it truly means to be strong. Track your mental clarity, build daily habits, and visualize your year-long journey on one beautiful parchment canvas.

![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

---

## 🌍 Live Demo

**[saga — live on GitHub Pages](https://bsse23094.github.io/saga/)**

---

## 📖 The Three Chapters

SAGA is structured as three chapters — each representing a phase on the warrior's path:

### Chapter I — The Clearing ⚔️
*"Like a warrior entering the clearing — release the noise and find your path."*

A journaling space to separate **noise** (mental clutter) from **path** (actionable clarity). Inspired by Thorfinn's transformation from a rage-driven fighter to a man of purpose.

- Dual-column journal entries (Noise vs. Path)
- Tag system for categorizing thoughts
- Full-screen slide-over drawer for writing
- Chronological timeline with quick delete

### Chapter II — The Farmland 🌾
*"Thorfinn traded his blade for a hoe. Plant your seeds daily."*

A habit tracker modeled after the **Farmland Arc** — where the mightiest warrior learns that planting seeds every day is the truest form of strength.

- Add habits with Lucide icons (no emojis — clean icon system)
- Daily toggle with satisfying animations
- 14-day visual trail per habit
- Streak counter with golden highlights
- Progress bar for today's harvest

### Chapter III — The Mountain 🏔️
*"Like Musashi surveying the valley — step back and see how far you've climbed."*

A macro overview of your entire year. Contribution heatmap, cumulative effort chart, and key stats — inspired by Musashi's relentless pursuit of mastery in Vagabond.

- Full-year contribution heatmap (correctly aligned month labels)
- 30-day cumulative effort area chart
- Stats: journal entries, habits completed, current streak, active days
- Mobile-optimized with responsive grid

---

## ✨ Features

| Feature | Description |
|---|---|
| **Splash Intro** | Cinematic entry screen with rotating quotes from 100+ Vinland Saga, Vagabond & warrior philosophy quotes |
| **Quote Engine** | Seeded daily rotation — unique quote every day, never repeats until full cycle (~4 months) |
| **Chapter Banners** | Each view has a thematic banner with a contextual quote that refreshes on every visit |
| **Parchment Design** | Warm light theme (#f5f0e6) with paper-grain texture, earth tones, and ink-wash aesthetics |
| **Persistent Storage** | All data saved to `localStorage` via Zustand — no backend required |
| **Mobile-First** | Responsive design from 320px to ultrawide; icon-only nav on small screens |
| **Smooth Animations** | Framer Motion page transitions, spring physics, staggered list animations |
| **Design System** | Custom `s-*` component classes (s-card, s-btn-crimson, s-heading, etc.) |

---

## 🛠️ Tech Stack

| Technology | Role |
|---|---|
| [Vite 7](https://vite.dev) | Build tool & dev server |
| [React 19](https://react.dev) | UI library |
| [TypeScript 5.8](https://typescriptlang.org) | Type safety |
| [Tailwind CSS 4](https://tailwindcss.com) | Utility-first styling |
| [Framer Motion](https://motion.dev) | Animations & transitions |
| [Zustand](https://zustand.docs.pmnd.rs) | State management with persistence |
| [Recharts](https://recharts.org) | Area chart visualization |
| [Lucide React](https://lucide.dev) | Icon system |

---

## 📁 Project Structure

```
saga/
├── src/
│   ├── components/
│   │   ├── layout/          # AppShell, TopNav, SplashIntro
│   │   ├── mind/            # TheClearingView, EntryDrawer
│   │   ├── micro/           # TheFarmlandView, AddHabitModal
│   │   └── macro/           # TheMountainView, Heatmap, EffortChart, StatCard
│   ├── store/               # Zustand store with persist middleware
│   ├── styles/              # globals.css (design system)
│   ├── utils/               # quotes.ts, dateUtils.ts, habitIcons.ts
│   ├── App.tsx
│   └── main.tsx
├── tailwind.config.ts       # Custom SAGA color palette & typography
├── vite.config.ts
└── package.json
```

---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/bsse23094/saga.git
cd saga

# Install
npm install

# Dev server
npm run dev

# Production build
npm run build
```

---

## 🎨 Design Philosophy

SAGA's design draws from the visual language of both manga:

- **Cinzel** — serif headers evoking carved Viking runes
- **IM Fell English** — body text with old-world manuscript feel
- **JetBrains Mono** — data & stats in clean monospace
- **Earth Palette** — parchment, wheat, forest, crimson, steel
- **Ink Aesthetic** — subtle paper-grain texture, low-contrast borders, muted tones

> *"The earth doesn't judge. It only returns what you put in."* — Farmland Saga

---

## 📜 Quote Engine

Over **100 curated quotes** organized into 6 categories:

- ⚔️ **Warrior** — Combat philosophy & discipline
- ☮️ **Peace** — Thors' "no enemies" ideology
- 🌱 **Growth** — Self-improvement & mastery
- 🌾 **Farmland** — Patience, planting, harvest
- 🎯 **Ambition** — Dreams, voyages, goals
- 🪞 **Reflection** — Self-awareness & wisdom

Sources include Thors, Thorfinn, Askeladd, Canute, Einar, Musashi, Miyamoto Musashi's *Book of Five Rings*, Hávamál, Japanese proverbs, Zen philosophy, and more.

---

## 📄 License

MIT

---

<p align="center">
  <em>"I have no enemies."</em><br/>
  <strong>— Thorfinn, Vinland Saga</strong>
</p>
