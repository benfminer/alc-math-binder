# ALC Math Binder — Interactive Lesson Player (Plan)

A fresh project (separate from web-pilot). A teacher-led, projector-friendly web app that turns each
PDF topic into a click-through lesson: the worked example builds up one step at a time on screen,
while a running "Steps" list accumulates on the side so the class always sees the full recipe so far.

## Who this is for

This is for **TRACE schools students with disabilities.** That drives every design and
content decision:

- **Simple language everywhere.** Step cards, scripts, and prompts written in short, plain
  sentences (roughly 2nd–3rd grade reading level). No idioms, no math jargon without an
  immediate plain-word meaning ("addends — the numbers we are adding").
- **One idea per click.** Each advance does exactly one small thing. Never two changes at once.
- **Predictable structure.** Every lesson has the same layout, same colors, same rhythm,
  so students spend zero energy figuring out the format.
- **Calm visuals.** High contrast, big text, generous spacing, no clutter, no flashing,
  animations slow and meaningful.
- **No time pressure.** Nothing auto-advances; the teacher sets the pace, and going back
  is always one click.

## 1. What it is

**One static web app, no server, no build tools.** A folder you open in any browser
(`index.html`), works offline on any school machine. Plain HTML/CSS/JS.

Two screens:

1. **The Binder (home).** A table of contents mirroring the PDF binder, grouped into units
   (Number Sense, Operations, Fractions & Decimals, Expressions, Geometry, Coordinates).
   Big tappable cards, one per topic. You pick the lesson you're teaching today.
2. **The Lesson Player.** Full-screen lesson with three zones:
   - **Stage (center, ~70% width):** the math itself, rendered large for a projector.
     Digits, fractions, and shapes appear/animate as you advance.
   - **Running Steps panel (right side):** every time you advance, a numbered instruction
     card slides in ("Step 2: Put a zero to hold the ones place") and stays. By the end,
     the panel reads as the complete recipe. Past steps dim slightly; current step is highlighted.
   - **Teacher bar (bottom):** Back / Next buttons, progress dots, and a step counter.

**Controls built for presenting:** Space/→ advances, ← goes back, so a presentation clicker
works out of the box. Nothing advances on its own; you control the pace completely.

### Presenter mode (private second window)

Like PowerPoint's presenter view: from the lesson player you click "Presenter mode" and a
second window opens that you keep on your laptop screen while the projector shows the lesson.
The presenter window stays in sync with the main window and shows, for the current step:

- **The script** — what to say, written per beat in plain, friendly language (authored as
  part of each lesson's data, alongside the step itself).
- **What's on the projector right now** — a small text summary of the current stage state,
  so you never have to crane at the big screen.
- **What the next click does** — so you're never surprised by your own slide.
- **Teacher cues** — common mistakes, "pause here and ask" prompts.

Advancing from either window moves both (the presenter window has its own Next/Back too,
so you can drive the whole lesson from the laptop). The two windows talk directly via
`window.open` + `window.opener`, which works on plain `file://` pages with no server —
keeps the zero-setup promise. The script is optional per beat: lessons work fine with no
script written, and the presenter window just shows the step list and cues.

## 2. Anatomy of a lesson

Every lesson follows the same beat structure, adapted from the PDFs:

1. **Title card** — topic name + the goal in one plain sentence ("Today: multiply any two
   2-digit numbers").
2. **Recall card** (when the PDF has one) — e.g., "A whole number is a fraction over 1."
3. **Worked example, step by step** — the heart of it. Each advance does one small thing
   on the stage AND adds its instruction to the running list. Example for 42 × 36:
   - Beat 1: problem appears stacked vertically
   - Beat 2: the 6 highlights, 6×2=12 → the 2 lands, the carry-1 *flies up* above the 4
   - Beat 3: 6×4+1 → 25 lands, row reads 252
   - Beat 4: the red 0 slides into the ones place (Step 2 card appears)
   - ...and so on to 1512, which gets the highlight box like the PDF
4. **"You try" practice** — 1–2 fresh problems of the same type. Same step-by-step reveal,
   but each beat starts with a **"Ask the class"** prompt (e.g., "What goes in the ones
   place?") before you click to reveal the answer. This is reveal-based, not typed input.
5. **Recipe recap** — final card showing just the completed running-steps list, full size.

**Teacher cues:** small, visually distinct notes only meaningful to the presenter
("Common mistake: forgetting the placeholder zero — pause here"). Styled quietly so they
don't compete with the math.

## 3. Engagement techniques (per lesson type)

- **Consistent color coding:** ones digits always one color, tens another, carries a third —
  same palette across every lesson so the visual language transfers between topics.
- **Motion with meaning only:** the carry flying up, the reciprocal fraction physically
  flipping upside down, the placeholder zero sliding in, area squares filling a rectangle
  one row at a time. No decorative animation.
- **Predict-then-reveal:** the "Ask the class" beats create the engagement moment without
  needing typed input.
- **Big and readable:** minimum ~40px math on stage, high contrast, tested at projector
  distance. Design style: clean, warm, friendly — new look, not the Nintendo pilot.

## 4. How lessons are authored (the pipeline)

Each lesson is a **data file** (one JS object): metadata + a list of beats, where each beat has
`{ stage-action, step-card-text, teacher-cue? }`. The player is generic; it interprets beats
using a small set of shared **renderers**:

1. **Vertical arithmetic renderer** — column add/subtract/multiply/divide with carries,
   borrows, regrouping. Covers ~8 topics.
2. **Fraction renderer** — stacked fractions, flip animation, cross-multiply arrows,
   equivalence bars. Covers ~7 topics.
3. **Geometry/grid renderer** — SVG shapes, labeled sides, coordinate grids, angle arcs,
   unit-square fills. Covers ~8 topics.
4. **Text/number-line renderer** — place value charts, comparing decimals, exponents,
   prime/composite sorting. Covers the rest.

Once the renderers exist, adding a topic is mostly writing its beat list from the PDF —
fast to batch.

## 5. Phases

- **Phase 1 — Player shell.** Binder home, lesson player layout, running-steps panel,
  keyboard/clicker controls, presenter mode window + sync, visual design.
- **Phase 2 — Three pilot lessons** (all vertical arithmetic, so that renderer gets
  fully proven — carries, borrows, place-value labels — before the others are built):
  1. *Columnar Addition* (from Adding and Subtracting Large Numbers: 3,863 + 2,421,
     with the regrouping recall; practice: 6,175 + 2,854 from the PDF's Quick Exercise)
  2. *Columnar Subtraction* (3,863 − 2,421; practice: 5,502 − 1,967, which forces
     borrowing — great "you try")
  3. *Multiplying Two-Digit by Two-Digit* (42 × 36, standard algorithm)

  The fraction and geometry renderers move to Phase 4, built when their first topics come up.
- **Phase 3 — You test it** on the actual projector setup; adjust sizing, pacing, colors.
- **Phase 4 — Batch the remaining ~25 topics** using the proven pipeline.
- **Phase 5 — Polish/extras:** a printable one-page "recipe" per lesson (the finished step
  list) for students' physical binders; per-lesson resume (remember where you left off).

## 6. Open decisions / tradeoffs

- **Plain JS vs React:** plain JS keeps it a double-clickable folder with zero setup, at the
  cost of slightly more hand-rolled code. Recommended: plain JS — nothing here needs React.
- **Practice problems:** reveal-based ("walkthrough + try one"), per your call. Typed-input
  checking could be added later per topic if you ever want a student-facing mode.
- **Poster-style PDFs** (Types of Angles, Types of Triangles, Types of Lines): these aren't
  procedures, so instead of steps they become "reveal one type at a time" lessons — same
  player, different beat flavor.
