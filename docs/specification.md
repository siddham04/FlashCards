# Spanish Flashcards — Software Specification (TypeScript, Vite + React, Tailwind)

> Summary
> Single-page web app (no accounts) for learning **one Spanish word per card**. Three fixed decks (Food, Animals, Verbs). Uses browser storage for persistence of decks and overall stats. Per-session “redo” remembers wrong answers in memory only. Built with **Vite + React + TypeScript** and styled with **Tailwind CSS**.

---

# Table of contents

1. Goals & constraints
2. High-level user flows
3. Pages / routes
4. Main features & acceptance criteria
5. Data model & TypeScript interfaces
6. Component breakdown (props & responsibilities)
7. App state, storage & algorithms (randomization, MCQ generation, matching)
8. UI / UX notes & accessibility
9. Testing & quality checklist
10. Example file / key snippets (storage helper, MCQ generator, matching util)
11. Milestones for v1

---

# 1. Goals & constraints

* One Spanish **word per card** (no phrases).
* Three **fixed** decks: `food`, `animals`, `verbs`. No create/delete deck UI.
* No user accounts; app is single-user only.
* Persistence: **browser storage** (localStorage; small JSON). Deployment later is out of scope.
* Cards presented in **random order**.
* After flipping a card, user marks **Correct** or **Wrong**. Cards marked Wrong are added to an **in-memory per-session redo list**. That list is cleared on page reload / new session.
* Quiz/Test Mode: **Multiple choice** (distractors randomly chosen from same deck) and **Fill-in-the-blank** mode (case-insensitive, trimmed, diacritics-normalized matching).
* Statistics page: persistent stats in browser (counts per deck, accuracy %, studied total).
* Tech stack: Vite + React + TypeScript + Tailwind CSS. Use React functional components and hooks. Use React Context + `useReducer` for app state. No backend.

---

# 2. High-level user flows

1. Landing → Choose deck (Food / Animals / Verbs) or go to Statistics or Quiz/Test Mode.
2. Study Mode:

   * Cards shown one at a time (Spanish side first).
   * Tap/click card to flip and reveal English.
   * After flip: two buttons appear: **Wrong** and **Right**.
   * Marking **Wrong** adds card to session redo set; **Right** does not.
   * Next card is randomly chosen from remaining cards in deck (excluding previously completed cards in current study session unless user restarts).
   * Option to **Redo session** which will iterate only over session's wrong cards.
3. Quiz/Test Mode:

   * Choose deck and mode (Multiple Choice / Fill-in-the-Blank).
   * Multiple Choice shows Spanish word + 4 choices (one correct + 3 distractors from same deck, randomized).
   * Fill-in-the-Blank provides text input; check after submit using normalization rules.
   * Scoring shown at end of quiz + option to save results to stats.
4. Statistics:

   * Show totals (studied, correct, incorrect) per-deck and overall.
   * Show recent session summary and accuracy %.
   * Reset stats button (with confirmation).

---

# 3. Pages / routes

Single-page; recommended client-side routes (React Router or simple internal router):

* `/` — Home / Deck selection / Quick start
* `/study/:deckId` — Study mode for `food | animals | verbs`
* `/redo` — Session redo mode (only appears if session has wrong cards)
* `/quiz/:deckId` — Quiz/Test Mode (choice of MCQ or Fill-in)
* `/stats` — Statistics & history
* (Optional) `/settings` — App settings (e.g., toggle diacritics normalization) — minimal

---

# 4. Main features & acceptance criteria

### 4.1 Study Mode

* Acceptance:

  * Presents a Spanish word card (word only).
  * Clicking card flips to show English translation.
  * After flip, **Right** and **Wrong** buttons appear below the card.
  * Clicking **Wrong** registers it in an in-memory set for redo this session.
  * Clicking **Right** marks it as known for this session.
  * Cards are shown in **random order**; no repeats within the same session unless user chooses redo.
  * The session may persist progress (index) locally so the user can refresh and continue the session — this is optional; if used, clarify behavior.

### 4.2 Redo session

* Acceptance:

  * “Redo” option shows only cards marked Wrong in current session.
  * Redo list is **in-memory** and cleared when the user refreshes or closes the tab.
  * Ability to mark Wrong/Right again during redo.

### 4.3 Quiz/Test Mode

* Multiple choice:

  * For each question, produce **4 options** (1 correct + 3 distractors).
  * Distractors chosen randomly from same deck and must not include duplicate text or the correct answer.
  * Shuffle options randomly before rendering.
* Fill-in-the-blank:

  * Accept answers with normalization:

    * Trim whitespace, case-insensitive.
    * Normalize Unicode diacritics (é -> e) for matching decisions.
  * Provide immediate feedback (correct/incorrect).
  * Optionally allow near-match tolerance (configurable).

### 4.4 Statistics

* Acceptance:

  * Track and show: total cards studied, correct answers, incorrect answers per deck and overall.
  * Persist these stats in localStorage.
  * Show percentage accuracy and last session summary (date/time + numbers).
  * “Reset stats” button clears persisted stats (confirmation modal).

### 4.5 Persistence

* Deck definitions and cards embedded in the app (hard-coded JSON resource for initial three decks).
* Persistent stats stored in `localStorage` under a dedicated key (`flashcards_stats_v1`).
* Session redo/wrong cards stored in memory only.

---

# 5. Data model & TypeScript interfaces

```ts
// deckId: 'food' | 'animals' | 'verbs'
export type DeckId = 'food' | 'animals' | 'verbs';

export interface Card {
  id: string;                // uuid or stable string key
  deckId: DeckId;
  spanish: string;           // one word only (e.g., "manzana")
  english: string;           // one word only (e.g., "apple")
  // optional future fields:
  // example?: string;
}

export interface Deck {
  id: DeckId;
  title: string;
  description?: string;
  cards: Card[];
}

export interface Stats {
  perDeck: Record<DeckId, {
    studied: number;
    correct: number;
    incorrect: number;
    lastSession?: {
      dateISO: string;
      studied: number;
      correct: number;
      incorrect: number;
    }
  }>;
  overall: {
    studied: number;
    correct: number;
    incorrect: number;
  };
}
```

LocalStorage key suggestions:

* `FLASHCARDS_DECKS_V1` — for decks (initial app seed; optional editing)
* `FLASHCARDS_STATS_V1` — statistics (persisted)
* Session-only data will not be persisted.

---

# 6. Component breakdown (props & responsibilities)

> Use functional components + TypeScript + Tailwind.

### Top-level

* `App` — Router, Navigation, Theme wrapper.
* `DecksProvider` (Context + Reducer) — provides decks, stats update functions, session redo set, and action dispatchers.

### Pages / Containers

* `HomePage` — deck cards overview + start buttons
* `StudyPage` (`/study/:deckId`) — orchestrates study session
* `RedoPage` (`/redo`) — iterate over session-specific wrong cards
* `QuizPage` (`/quiz/:deckId`) — quiz controller; selects MCQ or Fill-in
* `StatsPage` (`/stats`) — displays persisted statistics

### Reusable UI components

* `CardView`

  * Props: `{ card: Card, flipped: boolean, onFlip: () => void }`
  * Renders Spanish or English depending on flipped state.
* `FlipableCard`

  * Wraps `CardView`, handles flip animation and keyboard accessibility.
* `RightWrongButtons`

  * Props: `{ onRight: () => void, onWrong: () => void }`
* `MCQQuestion`

  * Props: `{ card: Card, options: string[], onAnswer: (isCorrect:boolean) => void }`
* `FillInQuestion`

  * Props: `{ card: Card, onAnswer: (isCorrect:boolean, given:string) => void }`
* `StatsSummary` — shows charts / numbers (use simple SVG charts or a minimal chart library later)

---

# 7. App state, storage & algorithms

### 7.1 State design (Context + reducer)

Top-level context exposes:

* `decks: Record<DeckId, Deck>`
* `stats: Stats`
* `session: { currentDeck?: DeckId; studiedIds: Set<string>; wrongIds: Set<string> }` — in-memory
* actions: `startSession(deckId)`, `markRight(cardId)`, `markWrong(cardId)`, `redoSession()`, `recordQuizResult(...)`, `resetStats()`

### 7.2 Persistence helper (localStorage)

* `loadStats(): Stats | defaultStats`
* `saveStats(stats: Stats): void`
* Each time a question is answered in Study or Quiz and saved, update `stats` and call `saveStats`.

### 7.3 Randomization & order

* Study mode chooses the next card by:

  1. Start with the deck’s card list.
  2. Shuffle a local copy (Fisher–Yates) at session start.
  3. Keep an index pointer; present next unused card.
* Redo:

  * Build list from session `wrongIds` in random order; iterate.

### 7.4 MCQ distractor generation

* Input: `deckCards: Card[]`, `correctCard: Card`, `numOptions = 4`.
* Algorithm:

  1. Take all other cards in the deck (`deckCards.filter(c => c.id !== correctCard.id)`).
  2. Shuffle and pick the first `numOptions - 1` items whose `english` values are distinct from correct answer.
  3. Combine + shuffle the final options array.
* Guarantee: if deck has fewer than `numOptions` cards, fallback to smaller option count.

### 7.5 Fill-in-the-blank matching

* Normalize both `givenAnswer` and `expected`:

  1. Trim whitespace
  2. Lowercase
  3. Normalize Unicode NFD and remove diacritics (e.g., `manzana`, `árbol` → `arbol`)
  4. Remove extra internal spaces
* Accept as correct if normalized strings are exactly equal.
* Optional/advanced: allow fuzzy matching (Levenshtein ≤ 1) — document as future improvement.

---

# 8. UI / UX & Accessibility notes

* Use Tailwind utility classes. Keep UI minimal & mobile-first.
* Card interaction:

  * Click or press Space/Enter to flip card.
  * Buttons must be keyboard-focusable; provide aria-labels.
* Color contrast: ensure accessible color contrast for buttons and text.
* Provide visible feedback for correct/incorrect (green/red states) and an aria-live region for screen readers.
* Make controls large enough for touch (min 44px height typical).
* Provide clear affordance for redo functionality and stats export/reset.

---

# 9. Testing & quality checklist

* Tools: **Vitest** + **React Testing Library** for unit and component tests.
* Tests to include:

  * Unit tests for utilities: `shuffle`, `generateMCQOptions`, `normalizeAnswer`.
  * Component tests: `FlipableCard` flip behavior and keyboard access.
  * Integration test: Study flow — flip → mark Wrong → ensure `session.wrongIds` updated.
  * Persistence tests: loading/saving stats to localStorage (use jsdom mocks).
* Manual QA checklist:

  * Random order true: repeat sessions show different orders often.
  * Redo list cleared on refresh (confirm).
  * MCQ distractors never include the correct answer twice.

---

# 10. Example code snippets

### 10.1 Sample decks seed (keep in `src/data/decks.ts`)

```ts
// src/data/decks.ts
import { Deck } from '../types';

export const decks: Record<string, Deck> = {
  food: {
    id: 'food',
    title: 'Food',
    cards: [
      { id: 'f1', deckId: 'food', spanish: 'manzana', english: 'apple' },
      { id: 'f2', deckId: 'food', spanish: 'pan', english: 'bread' },
      // ...more single-word cards
    ],
  },
  animals: {
    id: 'animals',
    title: 'Animals',
    cards: [
      { id: 'a1', deckId: 'animals', spanish: 'gato', english: 'cat' },
      { id: 'a2', deckId: 'animals', spanish: 'perro', english: 'dog' },
      // ...
    ],
  },
  verbs: {
    id: 'verbs',
    title: 'Verbs',
    cards: [
      { id: 'v1', deckId: 'verbs', spanish: 'comer', english: 'eat' },
      { id: 'v2', deckId: 'verbs', spanish: 'beber', english: 'drink' },
      // ...
    ],
  }
}
```

### 10.2 Normalize answer util

```ts
// src/utils/normalize.ts
export function normalizeForCompare(s: string): string {
  if (!s) return '';
  // trim + lowercase
  let out = s.trim().toLowerCase();
  // normalize NFD and remove diacritics
  out = out.normalize('NFD').replace(/\p{Diacritic}/gu, '');
  // collapse inner whitespace
  out = out.replace(/\s+/g, ' ');
  return out;
}
```

### 10.3 MCQ generator

```ts
// src/utils/mcq.ts
import { Card } from '../types';

export function generateMCQOptions(deckCards: Card[], correct: Card, n = 4): string[] {
  const others = deckCards.filter(c => c.id !== correct.id);
  // shuffle
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }
  const distractors = Array.from(new Set(others.map(c => c.english))).slice(0, Math.max(0, n - 1));
  const options = [...distractors, correct.english];
  // final shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}
```

### 10.4 LocalStorage stats helper

```ts
// src/utils/storage.ts
import { Stats } from '../types';
const STATS_KEY = 'FLASHCARDS_STATS_V1';

export function loadStats(): Stats {
  const raw = localStorage.getItem(STATS_KEY);
  if (!raw) {
    // default zeroed stats
    return {
      perDeck: {
        food: { studied: 0, correct: 0, incorrect: 0 },
        animals: { studied: 0, correct: 0, incorrect: 0 },
        verbs: { studied: 0, correct: 0, incorrect: 0 },
      },
      overall: { studied: 0, correct: 0, incorrect: 0 }
    };
  }
  return JSON.parse(raw) as Stats;
}

export function saveStats(stats: Stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}
```

---

# 11. Milestones for v1 (suggested)

1. Project skeleton: Vite + React + TypeScript + Tailwind; TypeScript interfaces; decks seed.
2. Implement Study flow (flip card, mark right/wrong, session in-memory redo set).
3. Implement Redo page (session-only wrong cards).
4. Implement Stats persistence + UI.
5. Implement Quiz — MCQ & Fill-in.
6. Accessibility checks & responsive design.
7. Tests: utility & core component tests.
8. Polish + small UI animations (flip), deploy.

---

# Notes / Open items (future improvements)

* Add audio/pronunciation (browser TTS or uploaded audio).
* Add spaced repetition algorithm (SM-2) for scheduling reviews.
* Add deck editor (create / edit / import CSV).
* Add optional fuzzy matching tolerance for fill-in (# of acceptable typos).
* Add export/import of stats and decks.

---

If you'd like, I can now:

* Produce a **developer-ready folder layout** and `package.json` with exact dev dependencies and scripts, **or**
* Generate a **starter React component file** for the Study page (TypeScript + Tailwind) to get you coding immediately.

Which of those would you like next?
