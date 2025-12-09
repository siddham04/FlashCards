Below is a **phased TODO list with checkboxes**, ordered from **easiest → hardest**, each with **clear acceptance criteria**.
This is designed so you can implement the project step-by-step without being overwhelmed.

---

# ✅ **Phased TODO List with Acceptance Criteria**

### *For Spanish Flashcards App — React + TypeScript + Vite + Tailwind*

---

# **Phase 1 — Project Setup (Easy)**

### **[x] Initialize project**

**Tasks**

* Create Vite + React + TypeScript project.
* Configure Tailwind CSS.
* Add basic folder structure (`components/`, `pages/`, `context/`, `utils/`, `data/`).

**Acceptance Criteria**

* ✅ Running the dev server shows a blank page with Tailwind styles working (e.g., a big `text-red-500` heading).
* ✅ No TypeScript errors on start.

---

### **[x] Add fixed decks data**

**Tasks**

* Create `/src/data/decks.ts` with Food, Animals, Verbs decks.
* Ensure each card contains `id`, `deckId`, `spanish`, `english`.

**Acceptance Criteria**

* ✅ App loads the decks without crashing.
* ✅ Calling `import { decks } from './data/decks'` works from any component.

---

### **[x] Define TypeScript types**

**Tasks**

* Add interfaces: `Card`, `Deck`, `Stats`, `DeckId`.

**Acceptance Criteria**

* ✅ Types compile.
* ✅ Decks data matches these interfaces correctly.

---

---

# **Phase 2 — Basic Navigation & Pages (Easy → Medium)**

### **[x] Add routing**

**Tasks**

* Install React Router.
* Add routes: `/`, `/study/:deckId`, `/redo`, `/quiz/:deckId`, `/stats`.

**Acceptance Criteria**

* ✅ Navigating to these URLs shows placeholder pages without errors.

---

### **[x] Build Home Page with deck selection**

**Tasks**

* List 3 deck cards (Food, Animals, Verbs).
* Buttons: **Study**, **Quiz**, **Stats**.

**Acceptance Criteria**

* ✅ Clicking **Study** navigates to `/study/<id>`.
* ✅ Clicking **Quiz** navigates to `/quiz/<id>`.
* ✅ Clicking **Stats** navigates to `/stats`.

---

---

# **Phase 3 — Study Mode (Core Feature — Medium difficulty)**

### **[x] Create FlipableCard component**

**Tasks**

* Show Spanish → click → flip → show English.
* Add simple flip animation (Tailwind + CSS transform).

**Acceptance Criteria**

* ✅ Clicking the card reliably flips between Spanish/English.
* ✅ Both keyboard & mouse work.

---

### **[x] Study session logic**

**Tasks**

* Shuffle deck cards using Fisher–Yates.
* Maintain "current card index" in state.
* Show Right/Wrong buttons only after flipping.

**Acceptance Criteria**

* ✅ Cards appear in random order on each session start.
* ✅ After clicking Right/Wrong, the next card appears.
* ✅ No card repeats in the same session unless undone.

---

### **[x] Implement session Wrong cards tracking (in memory only)**

**Tasks**

* Add `wrongIds: Set<string>` to session state.
* Mark Wrong adds card to set.
* Mark Right does nothing.

**Acceptance Criteria**

* ✅ Wrong cards are stored only until reload.
* ✅ Wrong count persists while navigating around the app.

---

---

# **Phase 4 — Redo Mode (Medium)**

### **[x] RedoPage — study only wrong cards**

**Tasks**

* Read session `wrongIds`.
* Build random order list from those cards.
* After finishing redo, allow restarting or going home.

**Acceptance Criteria**

* ✅ Only previously wrong cards appear.
* ✅ Redo list is cleared on browser refresh.
* ✅ If no wrong cards exist, `/redo` redirects to home.

---

---

# **Phase 5 — Statistics (Medium)**

### **[x] Implement localStorage stats**

**Tasks**

* Add `loadStats()` and `saveStats()` functions.
* Update stats every time user marks Right/Wrong or finishes quiz.

**Acceptance Criteria**

* ✅ Refresh does NOT reset stats.
* ✅ Stats JSON shown in dev console reflects new answers.

---

### **[x] Statistics page UI**

**Tasks**

* Show:

  * Studied count (deck + overall)
  * Correct count
  * Incorrect count
  * Accuracy %
* Add "Reset Stats" button.

**Acceptance Criteria**

* ✅ Stats numbers match interactions.
* ✅ Reset clears the numbers after confirmation.

---

---

# **Phase 6 — Quiz/Test Mode (Hard)**

### **[x] Multiple Choice Mode**

**Tasks**

* Generate MCQ options (1 correct + 3 distractors).
* Distractors must come from same deck.
* Shuffle option order.

**Acceptance Criteria**

* ✅ Every MCQ question shows 4 unique options.
* ✅ Correct answer appears exactly once.
* ✅ Decks with <4 cards show fewer options gracefully.

---

### **[x] Fill-in-the-blank Mode**

**Tasks**

* Create text input field.
* Normalize user text using `normalizeForCompare`.
* Determine correct/incorrect.

**Acceptance Criteria**

* ✅ "árbol" typed as "arbol" is considered correct.
* ✅ Case-insensitive.
* ✅ Leading/trailing whitespace ignored.

---

### **[x] Quiz summary screen**

**Tasks**

* Show score: correct, wrong, percentage.
* Allow "Retake", "Return Home", "Save to Stats".

**Acceptance Criteria**

* ✅ Saving updates stats correctly.
* ✅ Retake resets quiz state.

---

---

# **Phase 7 — Global Polish (Medium → Hard)**

### **[x] Accessibility pass**

**Tasks**

* Add aria-labels to buttons.
* Add keyboard support for flipping card.
* Ensure color contrast meets WCAG.

**Acceptance Criteria**

* ✅ App usable fully with keyboard (Enter/Space for card flip, tab navigation).
* ✅ Screen reader announces flips + correctness (aria-labels on cards and buttons).
* ✅ Color contrast meets WCAG standards (high contrast colors used).

---

### **[x] Responsive & mobile design**

**Tasks**

* Ensure cards scale properly on mobile.
* Buttons are at least 44px tall (touch-friendly).

**Acceptance Criteria**

* ✅ Works correctly on phone viewport (responsive grid: `grid-cols-1 md:grid-cols-3`).
* ✅ No overlapping UI elements.
* ✅ Buttons are touch-friendly (min-h-[44px], py-3/py-4 padding).

---

---

# **Phase 8 — Automated Tests (Hard)**

### **[x] Unit tests for utilities**

**Tasks**

* Test shuffle() randomness.
* Test MCQ generator correctness.
* Test normalizeForCompare.

**Acceptance Criteria**

* ✅ All tests pass (7 shuffle tests, 8 MCQ tests, 7 normalize tests, 8 storage tests).
* ✅ Edge cases (small decks) validated.

---

### **[x] Component tests**

**Tasks**

* FlipableCard flip logic.
* MCQ selection.
* Fill-in form submission.

**Acceptance Criteria**

* ✅ Components mount in test environment (7 FlipableCard tests, 4 RightWrongButtons tests).
* ✅ Interactions behave as expected.
* ✅ Page components tested (HomePage, QuizPage).

---

### **[x] Integration test: full study flow**

**Tasks**

* Simulate:

  * Flip
  * Wrong
  * Flip
  * Right
* Check session and stats are updated.

**Acceptance Criteria**

* ✅ Test passes and covers main user path (4 integration tests).
* ✅ Session context tested (3 tests).

---

---

# **Phase 9 — Final Polish & Deployment (Optional)**

### **[x] Add small transition animations**

* ✅ Flip animation polish (3D card flip with smooth transitions).
* ✅ Smooth transitions between pages (fadeIn animations, button hover effects).
* ✅ Card hover effects added.

### **[x] Optimize build & deploy**

* ✅ Build optimized (production build working).
* ✅ Deployment configs created (GitHub Actions, Netlify, Vercel).
* ✅ README with deployment instructions.

---

If you'd like, I can also create:

✅ A **Kanban Board version** (To Do / In Progress / Done)
or
✅ A printable **PDF version of the TODO list**
or
✅ A GitHub-style **issues list** you can paste directly into GitHub Issues.

Which one do you prefer?
