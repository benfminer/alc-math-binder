# ALC Math Binder

A teacher-led, projector-friendly lesson player for TRACE Schools. Each topic from the
paper math binder becomes a click-through lesson: the worked example builds up one step
at a time on the big screen, while a running **Steps** list accumulates on the side, so
the class always sees the whole recipe so far.

Built for students with learning disabilities. That drives everything: plain language,
one idea per click, the same layout on every lesson, calm high-contrast visuals, and
nothing that ever advances on its own.

**Live site:** https://benfminer.github.io/alc-math-binder/

---

## Using it in class

1. Open the site. The **Binder** home screen lists every topic, grouped into units
   (Number Sense, Operations, Factors & Multiples, Fractions & Decimals, Geometry,
   Coordinates). Topics marked "soon" aren't written yet and don't open.
2. Press a card to start that lesson.
3. Click **Next** to advance one beat. Each click does exactly one small thing on the
   stage and adds one numbered card to the Steps list.
4. **Back** undoes a beat. Nothing auto-advances — you set the pace entirely.
5. **Binder** (top left) returns to the topic list.

### Keyboard and clicker

| Key | Does |
| --- | --- |
| `→` / `Space` / `Page Down` | Next beat |
| `←` / `Page Up` | Previous beat |

A standard presentation clicker sends Page Up / Page Down, so it works out of the box.

### Presenter mode

Click **Presenter** in the lesson title bar to open a second window you keep on your
laptop while the projector shows the main window. It shows, for the current beat:

- the **script** — what to say, in plain language, readable as-is
- a **live thumbnail of what's on the projector right now**, so you never crane at the big screen
- a **thumbnail of the next beat** plus a plain summary of what the next click does
- the **class question**, when the beat has one
- **teacher cues** — common mistakes and "pause and ask" prompts

The presenter window has its own Next/Back and accepts the same keys, so you can drive
the whole lesson from the laptop. Both windows stay in sync. Allow pop-ups for the site
the first time.

---

## Running it locally

No build step, no dependencies, no server. Clone the repo and double-click
`index.html` — it runs straight off `file://` and works fully offline, which is the
point on school machines.

The one quirk this creates: browsers block reading a `.css` file over `file://`, so the
stylesheet lives in **`styles.js`** as a JS string (`APP_CSS`) that `index.html` injects
into a `<style>` tag. Edit `styles.js`, not a CSS file. Don't "fix" this by moving to a
real stylesheet — it would break offline double-click use.

---

## Files

| File | What's in it |
| --- | --- |
| `index.html` | Page shell: binder screen, lesson player layout, script tags. Rarely changes. |
| `styles.js` | All CSS, as the `APP_CSS` string. See the quirk above. |
| `lessons.js` | All content: the `BINDER` table of contents and the `LESSONS` beat data. |
| `app.js` | The player: navigation, the Steps panel, presenter window, and every stage renderer. |
| `PLAN.md` | Original design plan and phase roadmap. |
| `web-pilot/` | Earlier style explorations, kept for reference. Not part of the app. |

Source PDFs stay local and are gitignored — they're Canva exports and aren't published
with the site.

---

## How a lesson is built

A lesson is a plain object in `lessons.js` with metadata and a list of **beats**. One
click = one beat = one small change. The player is generic; it just interprets beats.

```js
LESSONS["add-large"] = {
  id: "add-large",
  title: "Adding Large Numbers",
  beats: [
    { show: { kind: "title", title: "Adding Large Numbers",
              goal: "Add two big numbers, one column at a time." },
      say: "Today we add two big numbers. We go one column at a time." },

    { show: { kind: "columns", rows: ADD_ROWS, result: "4" },
      step: "Add the ones column.",
      ask:  "What is 3 plus 1?",
      cue:  "Common mistake: starting on the left. Point at the ones column.",
      say:  "Start on the right. Three plus one is four." },
  ],
};
```

### Beat fields

| Field | Purpose |
| --- | --- |
| `show` | What the stage displays this beat (see stage kinds below). |
| `step` | Text of the numbered card added to the running Steps list. |
| `ask` | A question shown under the stage — the predict-then-reveal moment. |
| `askLabel` | Overrides the label on the ask card (defaults to a rotation: "Your turn:", "Think:"). |
| `ref` | Highlights an earlier Steps card instead of adding a new one. Used during practice. |
| `say` | Presenter script for this beat. Presenter window only. |
| `cue` | Teacher-only note (mistakes to watch for). Presenter window only. |

`say` and `cue` are optional everywhere — a lesson with no script still works, the
presenter window just shows less.

### Stage kinds

`show.kind` picks the renderer:

| Kind | Renders |
| --- | --- |
| `title` | Title card: kicker, topic name, one-sentence goal. |
| `story` | A plain-sentence setup card. |
| `note` | A titled callout (recall facts, definitions). |
| `answer` | The reveal card after an `ask`. |
| `columns` | Vertical column arithmetic: carries, borrows, crossed-out regrouping, place-value colors. |
| `divbox` | Long division: the house, quotient above the bar, bring-down arrows, remainder. |
| `pvchart` | Place-value chart. |
| `blocks` | Base-ten blocks. |
| `fingers` | Finger-counting hands, for the addition/subtraction fact lessons. |
| `hashes` | Tally/hash-mark counting. |
| `grid` | Multiplication fact grid. |
| `charts` | Skip-counting charts for one or more factors. |
| `rect` | Rectangle with labeled sides, for area and perimeter. |
| `recap` | Final screen: the full Steps recipe at full size. |

The per-kind spec fields (`rows`, `carry`, `borrow`, `carryStrike`, `strike`, `context`,
`note`, …) are documented in the comment block at the top of `lessons.js`.

### Adding a topic

1. Add the topic to the right unit in `BINDER` with an `id`, and drop the `soon: true` flag.
2. Add `LESSONS["your-id"] = { id, title, beats: [...] }`.
3. Reuse an existing stage kind if one fits. If none does, add a `build*` function in
   `app.js` and wire it into the `stageDOM` chain.
4. Open `index.html` and click through the whole lesson start to finish, then check it
   again in Presenter mode.

Keep step text and scripts at roughly a 2nd–3rd grade reading level, and never let one
click change two things at once.

---

## Deploying

The site is plain static files at the repo root, so GitHub Pages serves it directly:
**Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**. Pushing to
`main` republishes it. No build, no Actions workflow.
