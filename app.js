/* ALC Math Binder — player engine */

const $ = s => document.querySelector(s);
const PLACE_NAMES = ["ones", "tens", "hundreds", "thousands", "ten-thousands"];

let state = { lessonId: null, i: 0 };
let prevSpec = null;          // last columns spec, for pop animation diffing
let presenterWin = null;

/* ================= binder (home) ================= */

function renderHome() {
  const root = $("#binder");
  root.innerHTML = "";
  for (const u of BINDER) {
    const sec = document.createElement("section");
    sec.className = "unit";
    const h = document.createElement("h2");
    h.textContent = u.unit;
    sec.appendChild(h);
    const grid = document.createElement("div");
    grid.className = "cards";
    for (const t of u.topics) {
      const ready = t.id && LESSONS[t.id] && !t.soon;
      const card = document.createElement("button");
      card.className = "card " + (ready ? "ready" : "locked");
      card.innerHTML = `<span>${t.title}</span>` +
        (ready ? `<span class="go">Start lesson &#9654;</span>` : `<span class="soon">coming soon</span>`);
      if (ready) card.addEventListener("click", () => openLesson(t.id));
      else card.disabled = true;
      grid.appendChild(card);
    }
    sec.appendChild(grid);
    root.appendChild(sec);
  }
}

/* Student-facing labels for "ask" beats. Rotated so the same words don't
   repeat all lesson; a beat can override with its own askLabel. */
const ASK_LABELS = ["Your turn:", "Think:", "You tell me:", "Try it:"];

function assignAskLabels(l) {
  if (l._askLabelled) return;
  let n = 0;
  l.beats.forEach(b => {
    if (!b.ask) return;
    if (!b.askLabel) b.askLabel = ASK_LABELS[n % ASK_LABELS.length];
    n++;
  });
  l._askLabelled = true;
}

function openLesson(id) {
  assignAskLabels(LESSONS[id]);
  state = { lessonId: id, i: 0 };
  prevSpec = null;
  $("#home").hidden = true;
  $("#player").hidden = false;
  $("#lessonName").textContent = LESSONS[id].title;
  render(true);
}

function goHome() {
  $("#player").hidden = true;
  $("#home").hidden = false;
  state.lessonId = null;
  updatePresenter();
}

/* ================= player core ================= */

const lesson = () => LESSONS[state.lessonId];
const beats = () => lesson().beats;
const beat = () => beats()[state.i];

function next() { if (state.lessonId && state.i < beats().length - 1) { state.i++; render(true); } }
function prev() { if (state.lessonId && state.i > 0) { state.i--; render(false); } }
function jump(n) { state.i = n; render(false); }

function render(forward) {
  const b = beat();
  renderStage(b, forward);
  renderSteps();
  renderDots();
  $("#btnBack").disabled = state.i === 0;
  $("#btnNext").disabled = state.i === beats().length - 1;
  updatePresenter();
}

/* ---------- running steps panel ---------- */

function stepInfo() {
  // steps introduced so far, and which one is "current"
  const list = [];
  let current = 0;
  for (let k = 0; k <= state.i; k++) {
    const bb = beats()[k];
    if (bb.step) { list.push(bb.step); if (k === state.i) current = list.length; }
    if (bb.ref && k === state.i) current = bb.ref;
  }
  if (!current && beat().step) current = list.length;
  return { list, current };
}

function renderSteps() {
  const { list, current } = stepInfo();
  const ol = $("#stepsList");
  ol.innerHTML = "";
  list.forEach((text, idx) => {
    const li = document.createElement("li");
    const n = idx + 1;
    li.className = "step-card " + (n === current ? "current" : "past");
    li.innerHTML = `<span class="num">${n}</span><span>${text}</span>`;
    ol.appendChild(li);
  });
  ol.parentElement.scrollTop = ol.parentElement.scrollHeight;
}

function renderDots() {
  const d = $("#dots");
  d.innerHTML = "";
  beats().forEach((_, n) => {
    const dot = document.createElement("button");
    dot.className = "dot " + (n < state.i ? "done" : n === state.i ? "now" : "");
    dot.title = "Go to part " + (n + 1);
    dot.addEventListener("click", () => jump(n));
    d.appendChild(dot);
  });
}

/* ---------- stage ---------- */

/* A card of prose, one sentence per line. Three sentences run together in a
   paragraph are a wall to a student who reads slowly; on their own lines they
   are three short things. On the live stage they also arrive one at a time, so
   each one gets a moment before the next appears. */
function sentenceCard(cls, text, live) {
  const card = document.createElement("div");
  card.className = cls;
  // Split only where a . ! or ? is followed by a space or the end of the text,
  // so "3,863." breaks but a decimal like "3.5" stays in one piece.
  const SPLIT = "\u0000";
  const parts = String(text).replace(/([.!?])(\s+|$)/g, "$1" + SPLIT).split(SPLIT);
  parts.map(t => t.trim()).filter(Boolean).forEach((t, i) => {
    const line = document.createElement("div");
    line.className = "line";
    line.innerHTML = t;
    if (live) {
      line.style.opacity = "0";
      cardTimers.push(setTimeout(() => {
        line.style.opacity = "";
        line.classList.add("in");
      }, SENTENCE_MS * i));
    }
    card.appendChild(line);
  });
  return card;
}

/* builds the stage content for a beat into a detached <div>.
   Used by the main stage AND by the presenter window's mini previews. */
function stageDOM(b, prevForPop, live) {
  const out = document.createElement("div");
  out.className = "stage-content";
  const s = b.show || {};
  // only hand the previous beat's spec on when it is the same kind of stage
  const prev = prevForPop && prevForPop.kind === s.kind ? prevForPop : null;

  if (s.kind === "title") {
    out.innerHTML = `<div class="title-card">
      <div class="kicker">${s.kicker || ""}</div>
      <h1>${s.title}</h1>
      <div class="goal">${s.goal || ""}</div></div>`;
  }
  else if (s.kind === "story") {
    out.appendChild(sentenceCard("story-card", s.text, live));
  }
  else if (s.kind === "answer") {
    out.appendChild(sentenceCard("answer-card", s.text, live));
  }
  else if (s.kind === "note") {
    out.innerHTML = `<div class="note-card big"><span class="note-title">${s.title}</span>${s.text}</div>`;
  }
  else if (s.kind === "recap") {
    const items = beats().filter(x => x.step)
      .map((x, idx) => `<li class="step-card"><span class="num">${idx + 1}</span><span>${x.step}</span></li>`).join("");
    out.innerHTML = `<div class="recap"><h2>Our recipe</h2><ol>${items}</ol></div>`;
  }
  else if (s.kind === "fingers") {
    out.appendChild(buildFingers(s, live, prev));
  }
  else if (s.kind === "pvchart") {
    out.appendChild(buildPVChart(s, live));
  }
  else if (s.kind === "blocks") {
    out.appendChild(buildBlocks(s));
  }
  else if (s.kind === "rect") {
    out.appendChild(buildRect(s, live));
  }
  else if (s.kind === "grid") {
    out.appendChild(buildFactGrid(s));
  }
  else if (s.kind === "charts") {
    if (s.text) {
      const note = document.createElement("div");
      note.className = "note-card";
      note.innerHTML = `<span class="note-title">${s.title || ""}</span>${s.text}`;
      out.appendChild(note);
    }
    s.factors.forEach(f => {
      const box = document.createElement("div");
      box.className = "chart-box";
      const lab = document.createElement("div");
      lab.className = "chart-label";
      lab.textContent = "The " + f + "s";
      box.appendChild(lab);
      box.appendChild(buildMChart(f, 9, false, true).el);
      out.appendChild(box);
    });
  }
  else if (s.kind === "hashes") {
    if (s.context) {
      const ctx = document.createElement("div");
      ctx.style.cssText = "font-size:1.25rem;color:var(--soft);font-weight:700";
      ctx.textContent = s.context;
      out.appendChild(ctx);
    }
    out.appendChild(buildHashes(s, live));
  }
  else if (s.kind === "divbox") {
    if (s.context) {
      const ctx = document.createElement("div");
      ctx.style.cssText = "font-size:1.25rem;color:var(--soft);font-weight:700";
      ctx.textContent = s.context;
      out.appendChild(ctx);
    }
    out.appendChild(buildDivBox(s, prev));
    if (s.note) {
      const note = document.createElement("div");
      note.className = "note-card";
      note.innerHTML = `<span class="note-title">${s.note.title}</span>${s.note.text}`;
      out.appendChild(note);
    }
  }
  else if (s.kind === "columns") {
    if (s.context) {
      const ctx = document.createElement("div");
      ctx.style.cssText = "font-size:1.25rem;color:var(--soft);font-weight:700";
      ctx.textContent = s.context;
      out.appendChild(ctx);
    }
    out.appendChild(buildColumns(s, prev));
    if (s.note) {
      const note = document.createElement("div");
      note.className = "note-card";
      note.innerHTML = `<span class="note-title">${s.note.title}</span>${s.note.text}`;
      out.appendChild(note);
    }
  }

  if (b.ask) {
    const ask = document.createElement("div");
    ask.className = "ask-card";
    ask.innerHTML = `<span class="ask-label"></span><span></span>`;
    ask.firstChild.textContent = (b.askLabel || ASK_LABELS[0]) + " ";
    ask.lastChild.textContent = b.ask;
    out.appendChild(ask);
  }
  return out;
}

function renderStage(b, forward) {
  const stage = $("#stage");
  stage.innerHTML = "";
  clearHashTimers();
  stage.appendChild(stageDOM(b, forward ? prevSpec : null, true));
  const s = b.show || {};
  prevSpec = (s.kind === "columns" || s.kind === "fingers" || s.kind === "divbox") ? s : null;
}


/* ---------- stage content: the place value chart ----------
   A bordered chart with one place per column, ones on the right. Everything
   is optional, so one renderer covers the whole lesson: the empty chart, a
   number written into it, one column picked out with its digit / place /
   value named, the x10 ladder, and expanded form.
     places   : how many columns (4 = ones..thousands)
     digits   : what to write in the cells, ones-last ("3863"). A space or a
                "." leaves that cell blank. Omit for an empty chart.
     worth    : true -> write what each place is WORTH (1, 10, 100, 1000)
                instead of a number's digits — the base-ten chart
     focus    : place index from the right to pick out (0 = ones)
     callouts : which lines to reveal under the chart, in order. Any of
                "digit", "place", "value".
     times10  : true -> draw the x10 arrows along the bottom
     caption  : the number written out normally, above the chart
     expanded : how many expanded-form terms to reveal, from the left. Use
                the number of places for the whole thing; omit for none. */
/* the colours are the binder's standard place colours (pl-0 = ones), so a
   column here is the same colour as its label in the column-math lessons */
const PV_PLACES = [
  { name: "Ones",      color: "pl-0" },
  { name: "Tens",      color: "pl-1" },
  { name: "Hundreds",  color: "pl-2" },
  { name: "Thousands", color: "pl-3" },
];

/* 3 in the hundreds place is not worth 3, it is worth 300. */
const placeValueOf = (digit, place) => digit * Math.pow(10, place);
const withCommas = n => n.toLocaleString("en-US");

/* Renders one chart — the boxes, plus whatever this chart is carrying under
   it (callouts, the x10 ladder, expanded form). buildPVChart may stack two of
   these, which is how the zero-placeholder beats put 3,805 above 385. */
function pvOneChart(cfg, n, live) {
  const unit = document.createElement("div");
  unit.className = "pv-unit";

  if (cfg.caption) {
    const cap = document.createElement("div");
    cap.className = "pv-caption";
    cap.textContent = cfg.caption;
    unit.appendChild(cap);
  }

  const chart = document.createElement("div");
  chart.className = "pv-chart";
  chart.style.gridTemplateColumns = `repeat(${n}, 1fr)`;

  const digits = cfg.digits ? String(cfg.digits).padStart(n, " ") : "";
  const cellFor = place => {
    if (cfg.worth) return withCommas(Math.pow(10, place));
    if (!digits) return "";
    const ch = digits[n - 1 - place];
    return ch === undefined || ch === " " || ch === "." ? "" : ch;
  };

  // columns are built left to right, so the highest place comes first
  for (let place = n - 1; place >= 0; place--) {
    const p = PV_PLACES[place];
    const col = document.createElement("div");
    col.className = "pv-col" + (cfg.focus === place ? " focus" : "");

    const head = document.createElement("div");
    head.className = "pv-head " + p.color;
    head.textContent = p.name;
    // reveal: the names arrive right to left, the way we read them out loud
    if (cfg.reveal && live) {
      head.style.opacity = "0";
      cardTimers.push(setTimeout(() => {
        head.style.opacity = "";
        head.classList.add("in");
      }, PLACE_MS * (place + 1)));
    }
    col.appendChild(head);

    const cell = document.createElement("div");
    cell.className = "pv-cell" + (cfg.worth ? " worth" : "")
                   + (cfg.walked && cfg.focus === place ? " walked" : "");
    cell.textContent = cellFor(place);
    col.appendChild(cell);

    chart.appendChild(col);
  }
  unit.appendChild(chart);

  if (cfg.times10) {
    // one arrow per gap between columns, each labelled x10
    const rung = document.createElement("div");
    rung.className = "pv-ladder";
    rung.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
    for (let i = 0; i < n; i++) {
      const slot = document.createElement("div");
      slot.className = "pv-rung";
      if (i > 0) slot.innerHTML = `<span class="pv-x10">&times;10</span>`;
      rung.appendChild(slot);
    }
    unit.appendChild(rung);
    const note = document.createElement("div");
    note.className = "pv-ladder-note";
    note.textContent = "Every step to the left is 10 times bigger.";
    unit.appendChild(note);
  }

  if (cfg.callouts && cfg.callouts.length && cfg.focus != null) {
    const d = Number(cellFor(cfg.focus)) || 0;
    const p = PV_PLACES[cfg.focus];
    const lines = {
      digit: ["Digit", String(d)],
      place: ["Place value", p.name.toLowerCase()],
      value: ["Value", withCommas(placeValueOf(d, cfg.focus))],
    };
    const box = document.createElement("div");
    box.className = "pv-callouts";
    cfg.callouts.forEach(key => {
      const row = document.createElement("div");
      row.className = "pv-callout" + (key === "value" ? " strong" : "");
      row.innerHTML = `<span class="pv-co-label"></span><span class="pv-co-val"></span>`;
      row.firstChild.textContent = lines[key][0];
      row.lastChild.textContent = lines[key][1];
      box.appendChild(row);
    });
    unit.appendChild(box);
  }

  if (cfg.expanded) {
    // one term per non-zero place, biggest first; zeros are skipped the way
    // we write expanded form out loud
    const terms = [];
    for (let place = n - 1; place >= 0; place--) {
      const d = Number(cellFor(place));
      if (d) terms.push({ place: place, text: withCommas(placeValueOf(d, place)) });
    }
    const box = document.createElement("div");
    box.className = "pv-expanded";
    terms.slice(0, cfg.expanded).forEach((t, i) => {
      if (i) {
        const plus = document.createElement("span");
        plus.className = "pv-plus";
        plus.textContent = "+";
        box.appendChild(plus);
      }
      const term = document.createElement("span");
      term.className = "pv-term " + PV_PLACES[t.place].color;
      term.textContent = t.text;
      box.appendChild(term);
    });
    unit.appendChild(box);
  }

  return unit;
}

function buildPVChart(spec, live) {
  const n = spec.places || 4;
  const wrap = document.createElement("div");
  wrap.className = "pv-wrap";
  (spec.charts || [spec]).forEach(cfg => wrap.appendChild(pvOneChart(cfg, n, live)));
  if (spec.verdict) {
    const v = document.createElement("div");
    v.className = "pv-verdict";
    v.textContent = spec.verdict;
    wrap.appendChild(v);
  }
  return wrap;
}

/* ---------- stage content: the same number, in base-ten blocks ----------
   Place value is an idea about worth, and blocks are the only version of it
   you can actually count. A ten is drawn as ten ones stacked; a hundred as a
   hundred ones in a square; a thousand as a cube of ten of those squares. The
   grid lines are the point — a student who does not believe a hundred-block
   is worth a hundred can sit and count it.
     digits : the number, ones-last ("3863")
     rows   : how many rows to reveal, counting from the biggest place. Omit
              for all of them.
     total  : true -> the "3,863 altogether" line at the bottom */
const BLOCK_NAME = ["one", "ten", "hundred", "thousand"];

/* One block, drawn at 10 svg units per little cube so every place is honestly
   to scale against the others: a ten really is ten ones tall. */
function blockEl(place, color) {
  const g = { 0: [12, 12], 1: [12, 102], 2: [102, 102], 3: [132, 132] }[place];
  const svg = svgEl("svg", { class: "bk bk-" + place + " " + color,
                             viewBox: `0 0 ${g[0]} ${g[1]}` });
  const cells = (x0, y0, cols, rows) => {
    svg.appendChild(svgEl("rect", { class: "bk-face", x: x0, y: y0,
                                    width: cols * 10, height: rows * 10 }));
    for (let i = 1; i < cols; i++)
      svg.appendChild(svgEl("line", { class: "bk-grid", x1: x0 + i * 10, y1: y0,
                                      x2: x0 + i * 10, y2: y0 + rows * 10 }));
    for (let j = 1; j < rows; j++)
      svg.appendChild(svgEl("line", { class: "bk-grid", x1: x0, y1: y0 + j * 10,
                                      x2: x0 + cols * 10, y2: y0 + j * 10 }));
  };

  if (place === 0) cells(1, 1, 1, 1);
  else if (place === 1) cells(1, 1, 1, 10);
  else if (place === 2) cells(1, 1, 10, 10);
  else {
    // a thousand is a cube: the front face is one hundred-square, and the top
    // and side faces show the other nine stacked behind it
    svg.appendChild(svgEl("polygon", { class: "bk-top",  points: "1,31 31,1 131,1 101,31" }));
    svg.appendChild(svgEl("polygon", { class: "bk-side", points: "101,31 131,1 131,101 101,131" }));
    cells(1, 31, 10, 10);
  }
  return svg;
}

function buildBlocks(spec) {
  const n = spec.places || 4;
  const digits = String(spec.digits).padStart(n, "0");
  const shown = spec.rows == null ? n : spec.rows;

  const wrap = document.createElement("div");
  wrap.className = "bk-wrap";

  if (spec.caption) {
    const cap = document.createElement("div");
    cap.className = "pv-caption";
    cap.textContent = spec.caption;
    wrap.appendChild(cap);
  }

  let done = 0;
  for (let place = n - 1; place >= 0 && done < shown; place--, done++) {
    const d = Number(digits[n - 1 - place]) || 0;
    const p = PV_PLACES[place];
    const row = document.createElement("div");
    row.className = "bk-row";

    const count = document.createElement("div");
    count.className = "bk-count " + p.color;
    count.textContent = d + " " + BLOCK_NAME[place] + (d === 1 ? "" : "s");
    row.appendChild(count);

    const strip = document.createElement("div");
    strip.className = "bk-strip";
    for (let i = 0; i < d; i++) strip.appendChild(blockEl(place, p.color));
    if (!d) {
      const none = document.createElement("div");
      none.className = "bk-none";
      none.textContent = "no blocks";
      strip.appendChild(none);
    }
    row.appendChild(strip);

    const sum = document.createElement("div");
    sum.className = "bk-sum";
    sum.textContent = "= " + withCommas(placeValueOf(d, place));
    row.appendChild(sum);

    wrap.appendChild(row);
  }

  if (spec.total) {
    const tot = document.createElement("div");
    tot.className = "bk-total";
    tot.textContent = withCommas(Number(spec.digits)) + " altogether";
    wrap.appendChild(tot);
  }
  return wrap;
}

/* ---------- stage content: area and perimeter of a rectangle ----------
   The rectangle is drawn on a grid of unit squares so both ideas can be
   counted rather than asserted. Area fills the squares one at a time;
   perimeter walks the edge one unit at a time. Same picture, two different
   things happening to it, which is the whole point of the lesson.
     len, wid : the rectangle, in whole units
     unit     : what one unit is called ("in")
     grid     : true -> draw the unit squares
     phone    : true -> draw a phone body around the screen
     fill     : how many squares are shaded ("all" for every one)
     walk     : how many edge units are traced ("all" for the whole way round)
     labels   : true -> LENGTH across the top, WIDTH down the side
     tally    : true -> the running count under the picture
     result   : the line revealed when the count finishes
     formula  : the formula line under the result
   Two rectangles can be shown side by side with rects:[{...},{...}], which is
   how the last beats put the same perimeter against two different areas. */
const RC_CELL = 40;
const RC_TAP_MS = 260;

function rectEl(cfg, live, onCount) {
  const L = cfg.len, W = cfg.wid;
  const w = L * RC_CELL, h = W * RC_CELL;
  const pad = cfg.garden ? 18 : 0;
  const mL = cfg.labels ? 52 : 14, mT = cfg.labels ? 46 : 14;
  const vbW = w + mL + pad * 2 + 62, vbH = h + mT + pad * 2 + 26;
  const svg = svgEl("svg", { class: "rc-svg",
    viewBox: `${-mL - pad} ${-mT - pad} ${vbW} ${vbH}` });
  // one unit square is --rc-u tall in every rectangle on the stage, so two
  // rectangles side by side can honestly be compared square for square
  svg.style.height = `calc(var(--rc-u) * ${(vbH / RC_CELL).toFixed(3)})`;

  if (cfg.garden) {
    // the grass the garden is sitting on, so the fence has somewhere to stand
    svg.appendChild(svgEl("rect", { class: "rc-ground", x: -pad, y: -pad,
      width: w + pad * 2, height: h + pad * 2, rx: 10 }));
  }
  svg.appendChild(svgEl("rect", { class: "rc-soil", x: 0, y: 0, width: w, height: h }));

  // one square per unit, filled in reading order when we count the area
  const cells = [];
  if (cfg.grid) {
    for (let r = 0; r < W; r++) for (let c = 0; c < L; c++) {
      const sq = svgEl("rect", { class: "rc-cell", x: c * RC_CELL, y: r * RC_CELL,
                                 width: RC_CELL, height: RC_CELL });
      svg.appendChild(sq);
      cells.push(sq);
    }
  }
  svg.appendChild(svgEl("rect", { class: "rc-edge", x: 0, y: 0, width: w, height: h }));

  // the edge, chopped into single units, clockwise from the top left corner
  const segs = [];
  const seg = (x1, y1, x2, y2) => {
    // one unit of fence, seen from above: a rail with a post at its near end
    const g = svgEl("g", { class: "rc-seg" });
    g.appendChild(svgEl("line", { class: "rc-rail", x1: x1, y1: y1, x2: x2, y2: y2 }));
    g.appendChild(svgEl("rect", { class: "rc-post", x: x1 - 8, y: y1 - 8,
                                  width: 16, height: 16, rx: 4 }));
    svg.appendChild(g);
    segs.push(g);
  };
  for (let i = 0; i < L; i++) seg(i * RC_CELL, 0, (i + 1) * RC_CELL, 0);
  for (let j = 0; j < W; j++) seg(w, j * RC_CELL, w, (j + 1) * RC_CELL);
  for (let i = 0; i < L; i++) seg(w - i * RC_CELL, h, w - (i + 1) * RC_CELL, h);
  for (let j = 0; j < W; j++) seg(0, h - j * RC_CELL, 0, h - (j + 1) * RC_CELL);

  if (cfg.labels) {
    const u = cfg.unit || "ft";
    svg.appendChild(svgEl("line", { class: "rc-tick", x1: 0, y1: -mT + 16, x2: w, y2: -mT + 16 }));
    const lt = svgEl("text", { class: "rc-lab len", x: w / 2, y: -mT + 4, "text-anchor": "middle" });
    lt.textContent = `LENGTH  ${L} ${u}`;
    svg.appendChild(lt);
    const wx = w + pad + 22;
    svg.appendChild(svgEl("line", { class: "rc-tick", x1: wx, y1: 0, x2: wx, y2: h }));
    const wt = svgEl("text", { class: "rc-lab wid", x: wx + 15, y: h / 2, "text-anchor": "middle",
                               transform: `rotate(90 ${wx + 15} ${h / 2})` });
    wt.textContent = `WIDTH  ${W} ${u}`;
    svg.appendChild(wt);
  }

  const total = cfg.walk != null ? 2 * (L + W) : L * W;
  const want = n => n === "all" ? total : (n || 0);
  const target = cfg.walk != null ? want(cfg.walk) : want(cfg.fill);

  const show = i => {
    if (cfg.walk != null) segs[i].classList.add("on");
    else if (cells[i]) cells[i].classList.add("on");
    if (onCount) onCount(i + 1);
  };
  const reset = () => {
    cells.forEach(c => c.classList.remove("on"));
    segs.forEach(sg => sg.classList.remove("on"));
    if (onCount) onCount(0);
  };
  const play = () => {
    reset();
    for (let i = 0; i < target; i++)
      hashTimers.push(setTimeout(() => show(i), RC_TAP_MS * (i + 1)));
  };

  return { svg: svg, play: play, still: () => { reset(); for (let i = 0; i < target; i++) show(i); },
           target: target, instant: !!cfg.instant };
}

function buildRect(spec, live) {
  const wrap = document.createElement("div");
  wrap.className = "rc-wrap";

  if (spec.caption) {
    const cap = document.createElement("div");
    cap.className = "pv-caption";
    cap.textContent = spec.caption;
    wrap.appendChild(cap);
  }

  const row = document.createElement("div");
  row.className = "rc-row";
  wrap.appendChild(row);

  const built = [];
  (spec.rects || [spec]).forEach(cfg => {
    const box = document.createElement("div");
    box.className = "rc-box";
    const tally = document.createElement("div");
    tally.className = "rc-tally" + (cfg.walk != null ? " walk" : "");

    const noun = cfg.walk != null ? (cfg.unit || "ft") : "squares";
    const r = rectEl(cfg, live, n => {
      tally.textContent = !n ? "" : (cfg.walk != null ? n + " " + noun : n + " " + noun);
    });
    box.appendChild(r.svg);
    if (cfg.title) {
      const t = document.createElement("div");
      t.className = "rc-title";
      t.textContent = cfg.title;
      box.appendChild(t);
    }
    if (cfg.tally) box.appendChild(tally);
    if (cfg.note) {
      const nt = document.createElement("div");
      nt.className = "rc-note";
      nt.textContent = cfg.note;
      box.appendChild(nt);
    }
    row.appendChild(box);
    built.push(r);
  });

  if (spec.result) {
    const res = document.createElement("div");
    res.className = "rc-result" + (spec.mode === "perimeter" ? " walk" : "");
    res.textContent = spec.result;
    wrap.appendChild(res);
  }
  if (spec.formula) {
    const f = document.createElement("div");
    f.className = "rc-formula";
    f.textContent = spec.formula;
    wrap.appendChild(f);
  }

  built.filter(b => b.instant).forEach(b => b.still());
  const toPlay = built.filter(b => !b.instant && b.target > 0);
  if (live && toPlay.length && !spec.instant) {
    clearHashTimers();
    toPlay.forEach(b => b.play());
    const again = document.createElement("button");
    again.className = "count-again";
    again.textContent = "↺  Count again";
    again.addEventListener("click", e => {
      e.currentTarget.blur();
      clearHashTimers();          // once for the whole beat, not once per shape
      toPlay.forEach(b => b.play());
    });
    wrap.appendChild(again);
  } else {
    built.forEach(b => b.still());
  }
  return wrap;
}

/* column-math renderer: right-aligned strings -> grid of big cells */
/* tally-mark skip counting. One mark per unit; tapping the whole row once
   lands on the next multiple, and each pass fills the next box of the chart.
   The taps play out as an animation so the class can count along without the
   teacher having to click once per number. spec:
     factor : the number whose table we are building (also the mark count)
     pass   : which pass this beat shows (1 = counting 1..factor). Omit for
              a beat that only puts the marks up.
     filled : highest multiplier written into the chart so far (0..9)
   The chart always starts at 0 and runs to the 9th multiple, so it can answer
   any single-digit multiplication once it is finished. */
/* Ten fingers, raised one at a time while counting up. Both basic-facts
   lessons use this; the only difference is what you watch at the end.
     label     : the line above the hands ("Start at 8. Count up 3.")
     start     : the number we begin from — the first finger says start + 1
     up        : how many fingers end up raised
     emphasis  : "count"   -> box the number we landed on (adding)
                 "fingers" -> box how many fingers are up (subtracting)
     answer    : line revealed once the counting finishes
   If the beat before this one showed the very same count, the hands come up
   already counted and the landed number just grows — the class is looking at
   the answer, not counting it a second time. "Count again" replays it.
   The hands are drawn as two open palms facing the class with every finger
   already up. Nothing on the hand moves; the counting numbers appear above
   the fingertips one at a time — first finger out to the pinky, thumb last,
   then the same on the other hand — so the class can follow along on their
   own hands without a fist to open first. */

const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl(name, attrs) {
  const el = document.createElementNS(SVG_NS, name);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/* Geometry for one right hand, palm to the class, thumb on the left. The hand
   is drawn as a single silhouette with every finger already up — nothing on
   the hand moves. Only the counting numbers appear, one at a time, above the
   fingertips. Each entry below is a fingertip: where its number floats (numX,
   numY) and where its nail sits, so the tip can tint as it gets counted. */
const HAND_VB = "-50 -34 322 334";
const HAND_MIRROR_X = 222;                 // axis the left hand flips about
/* The numbers fan out wider than the fingertips do (and sit on an arch, like
   the fingertips themselves) so ten badges never crowd each other. */
const HAND_PARTS = {
  thumb : { numX:   0, numY: 138, nail: { x: 34, y: 180, w: 21, h: 25, rot: -40 } },
  index : { numX:  69, numY:  14, nail: { x: 98, y:  62, w: 20, h: 26, rot:   0 } },
  middle: { numX: 126, numY:  -6, nail: { x: 132, y: 44, w: 21, h: 27, rot:   0 } },
  ring  : { numX: 183, numY:  10, nail: { x: 165, y: 60, w: 20, h: 26, rot:   0 } },
  pinky : { numX: 232, numY:  48, nail: { x: 194, y: 93, w: 18, h: 23, rot:   0 } },
};

/* The outline, traced once: up the thumb, round its tip, down to the heel of
   the palm, across the wrist, up the outside edge, then over the pinky, ring,
   middle and index in turn and back into the web of the thumb. */
const HAND_OUTLINE =
  "M 72 196 C 60 186 48 170 39 159 " +
  "A 17 17 0 0 0 13 181 " +
  "C 16 200 40 232 71 249 " +
  "C 78 262 84 276 110 278 " +
  "C 152 281 190 268 202 232 " +
  "C 208 214 209 162 207 122 " +
  "L 207 92 A 13 13 0 0 0 181 92 " +
  "C 181 118 180 140 180 158 " +
  "C 180 138 179.5 100 179.5 60 " +
  "A 14.5 14.5 0 0 0 150.5 60 " +
  "C 150.5 100 149 130 149 150 " +
  "C 148 118 147.5 70 147.5 45 " +
  "A 15.5 15.5 0 0 0 116.5 45 " +
  "C 116.5 92 115 125 115 148 " +
  "C 114 118 113 82 113 63 " +
  "A 15 15 0 0 0 83 63 " +
  "C 83 110 80 160 72 196 Z";

/* Soft creases so the palm reads as a hand and not a mitten. */
const HAND_CREASES = [
  "M 96 168 C 120 160 150 158 176 162",     // knuckle line
  "M 92 186 C 118 204 152 214 186 210",     // heart line
  "M 90 196 C 112 224 140 240 158 268",     // head line
  "M 88 200 C 104 226 108 250 106 272",     // life line
];

/* Counting goes the way we teach it with real hands: first finger, then out
   to the pinky, thumb last. One whole hand, then the same again on the other.
   The thumb going last is what makes "one hand is full" land at five. */
const HAND_ORDER = {
  left : ["index", "middle", "ring", "pinky", "thumb"],
  right: ["index", "middle", "ring", "pinky", "thumb"],
};

/* The hands are drawn as a mirrored pair with the thumbs pointing outward,
   away from each other. That is what a student sees looking down at their own
   two palms: left thumb out to the left, right thumb out to the right. (Thumbs
   pointing inward would be the back view — what the class sees of the teacher's
   hands, not what they see of their own.) It costs us a straight left-to-right
   count, since the right hand's fingers run inward toward its thumb, but the
   picture matches the hands in front of them. Set this false to draw both hands
   the same way round and read the count straight across instead. */
const HANDS_MIRRORED = true;

/* The fingers never move, so a counted finger is marked by tinting its nail.
   Without it the "how many fingers are up" beats in the subtracting lesson
   have nothing to look at — every finger is up the whole time. Set false to
   let the numbers carry the beat on their own. */
const SHOW_COUNTED_TIPS = true;

/* Builds one hand and returns { svg, parts } where parts[name] is
   { nail, num, text } — the fingertip to tint and its floating number. */
function buildHand(side) {
  const mir = HANDS_MIRRORED && side === "right";
  const svg = svgEl("svg", { class: "fsvg", viewBox: HAND_VB });
  const flip = svgEl("g", mir ? { transform: `translate(${HAND_MIRROR_X} 0) scale(-1 1)` } : {});
  svg.appendChild(flip);
  const parts = {};

  flip.appendChild(svgEl("path", { class: "fskin", d: HAND_OUTLINE }));
  HAND_CREASES.forEach(d => flip.appendChild(svgEl("path", { class: "fcrease", d: d })));

  for (const name in HAND_PARTS) {
    const n = HAND_PARTS[name].nail;
    const nail = svgEl("rect", {
      class: "fnail", x: n.x - n.w / 2, y: n.y - n.h / 2, width: n.w, height: n.h,
      rx: n.w / 2.4, transform: `rotate(${n.rot} ${n.x} ${n.y})`,
    });
    if (SHOW_COUNTED_TIPS) flip.appendChild(nail);
    parts[name] = { nail: nail };
  }

  // the counting numbers sit above the fingertips, outside the flipped group
  // so they always read left to right no matter which way the hand faces
  for (const name in HAND_PARTS) {
    const p = HAND_PARTS[name];
    const x = mir ? HAND_MIRROR_X - p.numX : p.numX;
    const num = svgEl("g", { class: "fnum" });
    num.appendChild(svgEl("rect", { class: "fnum-bg", x: x - 23, y: p.numY - 21, width: 46, height: 42, rx: 12 }));
    const text = svgEl("text", { x: x, y: p.numY + 1, "text-anchor": "middle", "dominant-baseline": "central" });
    num.appendChild(text);
    svg.appendChild(num);
    parts[name].num = num;
    parts[name].text = text;
  }

  return { svg, parts };
}

function buildFingers(spec, live, prev) {
  const sameCount = !!prev && prev.kind === "fingers" && prev.start === spec.start;
  const still = sameCount && prev.up === spec.up;
  // a beat that carries on from the one before starts with those fingers
  // already up and only counts the new ones — matching what the script says
  const from = sameCount && prev.up > 0 && prev.up < spec.up ? prev.up : 0;
  const wrap = document.createElement("div");
  wrap.className = "fing-wrap";

  if (spec.label) {
    const lab = document.createElement("div");
    lab.className = "fing-label";
    lab.textContent = spec.label;
    wrap.appendChild(lab);
  }

  const hands = document.createElement("div");
  hands.className = "hands";
  const fingers = [];
  ["left", "right"].forEach(side => {
    const hand = buildHand(side);
    const box = document.createElement("div");
    box.className = "hand";
    box.appendChild(hand.svg);
    hands.appendChild(box);
    HAND_ORDER[side].forEach(name => fingers.push(hand.parts[name]));
  });
  wrap.appendChild(hands);

  const tally = document.createElement("div");
  tally.className = "fing-tally" + (spec.emphasis === "fingers" ? " watch" : "");
  wrap.appendChild(tally);

  const ans = document.createElement("div");
  ans.className = "fing-answer";
  wrap.appendChild(ans);

  const raise = i => {
    const f = fingers[i];
    f.nail.classList.add("counted");
    f.num.classList.add("show");
    f.text.textContent = spec.start + i + 1;
    if (i === spec.up - 1 && spec.emphasis === "count") {
      f.nail.classList.add("landed");
      f.num.classList.add("landed");
      f.num.parentNode.appendChild(f.num);   // the big one sits over its neighbours
    }
    tally.textContent = (i + 1) + (i === 0 ? " finger counted" : " fingers counted");
  };
  const finish = () => { if (spec.answer) ans.textContent = spec.answer; };

  const play = () => {
    clearHashTimers();
    fingers.forEach(f => {
      f.nail.classList.remove("counted", "landed");
      f.num.classList.remove("show", "landed");
      f.text.textContent = "";
    });
    tally.textContent = "";
    ans.textContent = "";
    for (let i = 0; i < from; i++) raise(i);
    for (let i = from; i < spec.up; i++) {
      hashTimers.push(setTimeout(() => raise(i), HASH_TAP_MS * (i - from + 1)));
    }
    hashTimers.push(setTimeout(finish, HASH_TAP_MS * (spec.up - from + 1)));
  };

  if (spec.up > 0) {
    if (live && !still) play();
    else {
      for (let i = 0; i < spec.up; i++) raise(i);
      finish();
    }
    if (live) {
      const again = document.createElement("button");
      again.className = "count-again";
      again.textContent = "↺  Count again";
      again.addEventListener("click", e => { e.currentTarget.blur(); play(); });
      wrap.appendChild(again);
    }
  }
  return wrap;
}

/* The whole single-digit multiplication table in one box, 1x1 up to 9x9.
   Used once, to make the point that every fact that exists fits on one screen
   and the biggest one is 81. spec.mark = [row, col] to highlight one cell. */
function buildFactGrid(spec) {
  const g = document.createElement("div");
  g.className = "fgrid";
  const cell = (text, cls) => {
    const c = document.createElement("div");
    c.className = "fcell " + (cls || "");
    c.textContent = text;
    return c;
  };
  g.appendChild(cell("\u00d7", "fhead corner"));
  for (let c = 1; c <= 9; c++) g.appendChild(cell(c, "fhead"));
  for (let r = 1; r <= 9; r++) {
    g.appendChild(cell(r, "fhead"));
    for (let c = 1; c <= 9; c++) {
      const hit = spec.mark && spec.mark[0] === r && spec.mark[1] === c;
      g.appendChild(cell(r * c, hit ? "mark" : ""));
    }
  }
  return g;
}

/* A multiples chart: top row 0..9, products underneath. `filled` is the highest
   multiplier written in so far; pass filled = 9 for a finished chart. When
   `holdLast` is set the newest box is left blank and returned as `pending`, so
   the caller can fill it at the end of a counting animation. */
function buildMChart(factor, filled, holdLast, quiet) {
  const el = document.createElement("div");
  el.className = "mchart";
  let pending = null;
  for (let j = 0; j <= 9; j++) {
    const col = document.createElement("div");
    col.className = "mcol" + (j === filled && !quiet ? " new" : "");
    const top = document.createElement("div");
    top.className = "mtop";
    top.textContent = j;
    const bot = document.createElement("div");
    bot.className = "mbot";
    if (j < filled) bot.textContent = factor * j;
    else if (j === filled) { if (holdLast) pending = bot; else bot.textContent = factor * j; }
    col.appendChild(top);
    col.appendChild(bot);
    el.appendChild(col);
  }
  return { el, pending };
}

const HASH_TAP_MS = 420;
const SENTENCE_MS = 550;      // pause between sentences on a story/answer card
const PLACE_MS = 650;         // pause between place names as the chart fills in
let hashTimers = [];
let cardTimers = [];
function clearHashTimers() {
  hashTimers.forEach(clearTimeout); hashTimers = [];
  cardTimers.forEach(clearTimeout); cardTimers = [];
}

function buildHashes(spec, live) {
  const n = spec.factor;
  const wrap = document.createElement("div");
  wrap.className = "hash-wrap";

  const row = document.createElement("div");
  row.className = "hash-row";
  const marks = [];
  for (let i = 0; i < n; i++) {
    const h = document.createElement("div");
    h.className = "hash";
    h.innerHTML = '<div class="tick"></div><div class="cnt"></div>';
    row.appendChild(h);
    marks.push(h);
  }
  wrap.appendChild(row);

  const counts = spec.pass
    ? Array.from({ length: n }, (_, i) => (spec.pass - 1) * n + i + 1)
    : null;

  // the multiples chart: 0 through the 9th multiple
  let newCell = null;
  if (spec.filled != null) {
    const built = buildMChart(n, spec.filled, live && !!counts);
    newCell = built.pending;
    wrap.appendChild(built.el);
  }

  const tap = i => {
    marks[i].classList.add("tapped");
    marks[i].querySelector(".cnt").textContent = counts[i];
    if (i === n - 1) marks[i].classList.add("landed");
  };
  const writeIt = () => { if (newCell) newCell.textContent = n * spec.filled; };

  const play = () => {
    clearHashTimers();
    marks.forEach(m => {
      m.classList.remove("tapped", "landed");
      m.querySelector(".cnt").textContent = "";
    });
    if (newCell) newCell.textContent = "";
    counts.forEach((_, i) => hashTimers.push(setTimeout(() => tap(i), HASH_TAP_MS * (i + 1))));
    hashTimers.push(setTimeout(writeIt, HASH_TAP_MS * (n + 1)));
  };

  if (counts) {
    if (live) {
      play();
      const again = document.createElement("button");
      again.className = "count-again";
      again.textContent = "\u21ba  Count again";
      again.addEventListener("click", e => { e.currentTarget.blur(); play(); });
      wrap.appendChild(again);
    } else {
      counts.forEach((_, i) => tap(i));   // presenter preview: final state, no animation
    }
  }
  return wrap;
}

/* ---------- stage content: long division ----------
   The division house: divisor outside on the left, dividend under the bar,
   quotient written above it, and the divide / multiply / subtract / bring-down
   work stacked underneath.

   Everything lines up to the DIVIDEND's columns, so a work row is just a
   string padded to the dividend's width — the same trick buildColumns uses.
   One difference worth knowing: column indices here count from the LEFT
   (0 = the dividend's first digit), because long division is worked left to
   right. The column lessons index from the right, because those algorithms
   are worked right to left. Each matches the direction of its own algorithm.

     divisor   : the number outside the house ("7")
     dividend  : the number under the bar ("476")
     quotient  : padded string written above the bar. A space leaves a cell
                 blank, so " 6 " puts a 6 above the dividend's middle digit.
                 Digits that changed since the last beat pop in.
     hl        : dividend column indices to highlight — the digits we are
                 dividing into on this beat
     remainder : text printed to the right of the quotient ("R 3")
     rows      : the work under the house, top to bottom:
                   t     : padded to the dividend's width
                   op    : operator for the left slot, usually "−"
                   rule  : [from, to] — the subtraction line drawn under this
                           row, spanning only those columns
                   bring : column index of a digit just brought down. It gets
                           an arrow above it and lands in gold.
                   red   : the whole row in carry-red
                   hl    : column indices to highlight in this row
                   final : the landed answer, boxed like a result row      */

const DIV_ARROW = "↓";

function buildDivBox(spec, prevForPop) {
  const dividend = String(spec.dividend);
  const W = dividend.length;
  const pad = t => String(t == null ? "" : t).padEnd(W, " ").slice(0, W);

  const block = document.createElement("div");
  block.className = "div-block";

  /* Every row is: one left slot | one cell per dividend column. The left slot
     is a fixed width, so a work row lands under the digit it belongs to
     without any measuring. It holds the divisor on the house row and the
     operator on a work row — both live just outside the house wall, which is
     where they are written on paper. */
  const addSlot = (row, text, cls) => {
    const dv = document.createElement("div");
    dv.className = "cell dv-slot" + (cls || "");
    dv.textContent = text || "";
    row.appendChild(dv);
  };

  const mkRow = (cls, text, opts = {}) => {
    const row = document.createElement("div");
    row.className = "dv-row " + cls;
    const padded = pad(text);
    /* The operator belongs directly beside the number it acts on, the way it
       is written on paper. If this row starts partway into the house there is
       a blank cell there to put it in; if it starts at the far left there is
       not, so it falls back to the slot outside the wall. */
    const firstDigit = padded.search(/\S/);
    const opCol = opts.op && !opts.divisor && firstDigit > 0 ? firstDigit - 1 : -1;
    const slotText = opts.divisor || (opCol === -1 ? (opts.op || "") : "");
    addSlot(row, slotText,
            (opts.house ? " house" : "") + (slotText && !opts.divisor ? " is-op" : ""));
    const from = opts.popFrom == null ? null : pad(opts.popFrom);
    for (let c = 0; c < W; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      const ch = padded[c];
      const blank = ch === undefined || ch.trim() === "";
      cell.textContent = blank ? "" : ch;
      if (blank) cell.classList.add("empty");
      if (opts.house) cell.classList.add("under-bar");
      if (opts.hl && opts.hl.includes(c) && !blank) cell.classList.add("focus");
      if (opts.red && !blank) cell.classList.add("red");
      if (opts.bring === c && !blank) cell.classList.add("brought");
      if (from && !blank && ch !== from[c]) cell.classList.add("pop");
      if (c === opCol) {
        cell.textContent = opts.op;
        cell.classList.remove("empty");
        cell.classList.add("is-op");
      }
      row.appendChild(cell);
    }
    block.appendChild(row);
    return row;
  };

  // the subtraction line, drawn only under the columns being subtracted
  const mkRule = range => {
    const row = document.createElement("div");
    row.className = "dv-row dv-rule-row";
    // one unbroken line placed over the range, rather than a border per cell:
    // per-cell borders leave hairline seams that read as gaps in the rule
    row.style.gridTemplateColumns = `var(--dv-slot) repeat(${W}, var(--dv-cell))`;
    const line = document.createElement("div");
    line.className = "dv-ruleline";
    line.style.gridColumn = `${range[0] + 2} / span ${range[1] - range[0] + 1}`;
    row.appendChild(line);
    block.appendChild(row);
  };

  const mkArrow = col => {
    const row = document.createElement("div");
    row.className = "dv-row dv-arrow-row";
    addSlot(row, "", "");
    for (let c = 0; c < W; c++) {
      const slot = document.createElement("div");
      slot.className = "cell dv-arrow";
      slot.textContent = c === col ? DIV_ARROW : "";
      row.appendChild(slot);
    }
    block.appendChild(row);
  };

  // the quotient, above the bar
  const q = mkRow("dv-quot", spec.quotient || "", {
    popFrom: prevForPop ? (prevForPop.quotient || "") : null,
  });
  if (spec.remainder) {
    const rem = document.createElement("div");
    rem.className = "dv-rem";
    rem.textContent = spec.remainder;
    q.appendChild(rem);
  }

  // the house itself
  mkRow("dv-dividend", dividend, { divisor: spec.divisor, house: true, hl: spec.hl });

  (spec.rows || []).forEach((r, i) => {
    if (r.bring != null) mkArrow(r.bring);
    // a row that did not exist on the previous beat pops in whole; one that
    // did pops only the digits that changed (the brought-down digit)
    const prevRows = prevForPop && prevForPop.rows;
    const prevR = prevRows ? prevRows[i] : null;
    mkRow("dv-work" + (r.final ? " dv-final" : ""), r.t, {
      op: r.op, red: r.red, hl: r.hl, bring: r.bring,
      popFrom: prevForPop ? (prevR ? prevR.t : "") : null,
    });
    if (r.rule) mkRule(r.rule);
  });

  return block;
}

function buildColumns(spec, prevForPop) {
  const strings = [
    ...(spec.rows || []).map(r => r.t),
    ...(spec.work || []).map(w => w.t),
    spec.carry || "", spec.result || "",
  ];
  const W = Math.max(...strings.map(t => t.length));
  const pad = t => t.padStart(W, " ");
  const ref = pad(spec.rows[0].t);                       // where the commas are

  // digit place index (from the right, skipping commas) for each display column
  const placeOf = [];
  let d = 0;
  for (let c = W - 1; c >= 0; c--) {
    placeOf[c] = ref[c] === "," ? -1 : d++;
  }

  const block = document.createElement("div");
  block.className = "math-block";

  // text may be a padded string OR an array of W per-column entries (e.g. borrow "11")
  const mkRow = (cls, opChar, text, opts = {}) => {
    const row = document.createElement("div");
    row.className = "mrow " + cls;
    const op = document.createElement("div");
    op.className = "cell op";
    op.textContent = opChar || "";
    row.appendChild(op);
    const isArr = Array.isArray(text);
    const padded = isArr ? text : pad(text);
    for (let c = 0; c < W; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      const ch = padded[c] || "";
      cell.textContent = ch.trim() === "" ? "" : ch;
      if (ch.trim() === "") cell.classList.add("empty");
      // comma columns come from the reference row, not this row's own text —
      // the carry and label rows have no comma character but still need the
      // narrow column, or they end up wider than the digits and drift left
      if (ref[c] === ",") cell.classList.add("comma");
      if (spec.focus != null && placeOf[c] === spec.focus && ch !== "," && ch.trim() !== "") cell.classList.add("focus");
      if (opts.red && opts.red.includes(c)) cell.classList.add("red");
      if (opts.hl && opts.hl.includes(c)) cell.classList.add("focus");
      if (opts.strike && opts.strike.includes(c)) cell.classList.add("strike");
      if (opts.popFrom != null && ch !== (opts.popFrom[c] || " ") && ch.trim() !== "") cell.classList.add("pop");
      if (opts.places) {                                 // place-value label row
        const named = placeOf[c] >= 0 && ch.trim() !== "";
        cell.textContent = named ? (PLACE_NAMES[placeOf[c]] || "") : "";
        if (named) cell.classList.add("pl-" + placeOf[c]);
      }
      row.appendChild(cell);
    }
    block.appendChild(row);
    return row;
  };

  if (spec.labels) mkRow("labels", "", "x".repeat(W), { places: true });
  if (spec.borrow) {
    mkRow("carry", "", spec.borrow, {
      popFrom: prevForPop ? (prevForPop.borrow || []) : null,
    });
  }
  if (spec.carry) {
    mkRow("carry", "", spec.carry, {
      strike: spec.carryStrike,                          // carry already used up
      popFrom: prevForPop ? pad(prevForPop.carry || "") : null,
    });
  }
  (spec.rows || []).forEach(r => mkRow("", r.op || "", r.t, { strike: r.strike, red: r.red, hl: r.hl }));

  const mkRule = () => {
    const rule = document.createElement("div");
    rule.className = "rule";
    rule.style.width = "100%";
    block.appendChild(rule);
  };
  mkRule();

  // partial products (multiplication): work rows between two rules
  if (spec.work) {
    // carries for the addition of the partial products — these belong above the
    // work rows, not above the original problem, so they get their own row here
    if (spec.workCarry) {
      mkRow("carry", "", spec.workCarry, {
        strike: spec.workCarryStrike,
        popFrom: prevForPop ? pad(prevForPop.workCarry || "") : null,
      });
    }
    spec.work.forEach((w, i) => {
      const prevW = prevForPop && prevForPop.work && prevForPop.work[i];
      mkRow("work", w.op || "", w.t, {
        red: w.red, hl: w.hl,
        popFrom: prevW ? pad(prevW.t) : null,
      });
    });
    mkRule();
  }

  if (spec.result) {
    mkRow("result" + (spec.resultFinal ? " final" : ""), "", spec.result, {
      popFrom: prevForPop ? pad(prevForPop.result || "") : null,
    });
  }
  return block;
}

/* ================= presenter window ================= */

/* all app CSS lives in styles.js (APP_CSS), so the presenter window can always
   be styled directly — reading a .css file is blocked when running from file:// */
function appCssText() { return APP_CSS; }

function openPresenter() {
  // reuse our own live window if we have one; otherwise open (or reclaim) one.
  // A presenter left over from before a page reload is unreachable — detect that
  // and fall back to a brand-new window with a unique name.
  if (!presenterWin || presenterWin.closed) {
    presenterWin = window.open("", "alc_presenter", "width=560,height=740,resizable=yes");
    try { void presenterWin.document.body; }
    catch (e) { presenterWin = window.open("", "alc_presenter_" + Date.now(), "width=560,height=740,resizable=yes"); }
  }
  if (!presenterWin) { alert("Pop-up was blocked. Please allow pop-ups for this page."); return; }
  presenterWin.focus();

  const doc = presenterWin.document;
  doc.title = "Presenter — ALC Math Binder";
  doc.head.innerHTML = "";
  const base = doc.createElement("style");
  base.textContent = appCssText();
  doc.head.appendChild(base);
  presenterWin.__owner = window;
  doc.body.innerHTML = `
  <style>
    body{margin:0;background:#1e2a3a;color:#f5f1e8;font-family:-apple-system,"Segoe UI",system-ui,sans-serif;
         padding:1.2rem;font-size:17px;line-height:1.5}
    h1{font-size:1rem;letter-spacing:.1em;text-transform:uppercase;color:#8fa0b5;margin:0}
    .where{font-size:.95rem;color:#8fa0b5;margin:.2rem 0 1rem}
    .label{font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;color:#f2b544;margin:1.1rem 0 .3rem;font-weight:800}
    .script{font-size:1.35rem;line-height:1.55;background:#26344a;border-radius:12px;padding:1rem 1.2rem;min-height:6rem}
    .ask{background:#f2b544;color:#1e2a3a;font-weight:800;border-radius:10px;padding:.6rem .9rem;font-size:1.15rem}
    .cue{background:#43304a;border-left:5px solid #c24a7a;border-radius:8px;padding:.6rem .9rem;font-size:1.05rem}
    .next{color:#b9c6d6;font-size:1.05rem;background:#26344a;border-radius:10px;padding:.6rem .9rem}
    .bar{display:flex;gap:.8rem;margin-top:1.4rem}
    .bar button{flex:1;font:inherit;font-weight:800;font-size:1.2rem;padding:.8rem;border-radius:12px;border:0;cursor:pointer;box-shadow:none}
    #pBack{background:#3a4a63;color:#fff}
    #pNext{background:#e85d4a;color:#fff}
    .hide{display:none}
    .shots{display:flex;gap:1rem;align-items:flex-start;margin-top:.2rem}
    .shot-col{min-width:0}
    .shot-col.cur{flex:1.7}
    .shot-col.nxt{flex:1}
    .shot{background:#faf6ef;border-radius:12px;overflow:hidden;border:3px solid #3a4a63}
    .shot-inner{width:960px;display:flex;flex-direction:column;align-items:center;justify-content:center;
                gap:1rem;padding:1.5rem;transform-origin:top left;color:#1e2a3a}
    .shot-inner .stage-content{display:flex;flex-direction:column;align-items:center;gap:1rem;width:100%}
  </style>
  <h1>Presenter</h1>
  <div class="where" id="pWhere"></div>
  <div class="shots">
    <div class="shot-col cur"><div class="label">On screen now</div><div class="shot" id="pShotCur"><div class="shot-inner"></div></div></div>
    <div class="shot-col nxt"><div class="label">Next screen</div><div class="shot" id="pShotNext"><div class="shot-inner"></div></div></div>
  </div>
  <div class="label">Say</div>
  <div class="script" id="pSay"></div>
  <div id="pAskWrap"><div class="label">Ask the class</div><div class="ask" id="pAsk"></div></div>
  <div id="pCueWrap"><div class="label">Teacher note</div><div class="cue" id="pCue"></div></div>
  <div class="label">Next click</div>
  <div class="next" id="pNext2"></div>
  <div class="bar"><button id="pBack">&#9664; Back</button><button id="pNext">Next &#9654;</button></div>`;
  doc.getElementById("pBack").onclick = () => prev();
  doc.getElementById("pNext").onclick = () => next();
  if (!presenterWin.__wired) {
    presenterWin.__wired = true;
    presenterWin.addEventListener("resize", () => updatePresenter());
    // same keys as the main window: advance the lesson from either screen
    doc.addEventListener("keydown", e => {
      if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); next(); }
      else if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); prev(); }
    });
  }

  // if the main window reloads or closes, this presenter can no longer update:
  // tell the teacher instead of silently going stale
  const watchdog = doc.createElement("script");
  watchdog.textContent = `if(!window.__watchdog){window.__watchdog=setInterval(function(){
    var dead=false;
    try{ dead = !window.__owner || window.__owner.closed; }catch(e){ dead=true; }
    if(dead && !document.getElementById('deadNote')){
      var d=document.createElement('div');
      d.id='deadNote';
      d.style.cssText='position:fixed;inset:0;background:rgba(30,42,58,.97);color:#fff;display:flex;align-items:center;justify-content:center;text-align:center;padding:3rem;font-size:1.5rem;font-weight:700;z-index:99;line-height:1.6';
      d.textContent='Presenter got disconnected (the lesson window was reloaded or closed). Close this window, then press the Presenter button in the lesson again.';
      document.body.appendChild(d);
    }
  },2000);}`;
  doc.body.appendChild(watchdog);
  updatePresenter();
}

function updatePresenter() {
  if (!presenterWin || presenterWin.closed) return;
  const doc = presenterWin.document;
  const set = (id, text) => { doc.getElementById(id).textContent = text; };
  const toggle = (id, on) => { doc.getElementById(id).classList.toggle("hide", !on); };

  // scaled live previews of the current and next stage
  const fillShot = (id, bb) => {
    const shot = doc.getElementById(id);
    const inner = shot.firstElementChild;
    inner.innerHTML = "";
    if (!bb) {
      shot.style.height = "auto";
      inner.style.transform = "none"; inner.style.width = "auto"; inner.style.padding = "0";
      inner.innerHTML = "<div style='padding:.5rem 1rem;font-weight:700;color:#5b6b7d'>End of lesson</div>";
      return;
    }
    inner.style.padding = "";
    inner.style.width = "960px";
    inner.appendChild(doc.importNode(stageDOM(bb, null), true));
    const scale = (shot.clientWidth - 6) / 960;
    inner.style.transform = `scale(${scale})`;
    // fit height to the scaled content
    inner.style.height = "auto";
    const h = Math.max(inner.scrollHeight, 240);
    shot.style.height = (h * scale) + "px";
  };

  if (!state.lessonId) {
    set("pWhere", "No lesson open. Pick one from the binder.");
    set("pSay", ""); toggle("pAskWrap", false); toggle("pCueWrap", false); set("pNext2", "");
    fillShot("pShotCur", null); fillShot("pShotNext", null);
    return;
  }
  const b = beat();
  fillShot("pShotCur", b);
  fillShot("pShotNext", beats()[state.i + 1]);
  set("pWhere", `${lesson().title} — part ${state.i + 1} of ${beats().length}`);
  set("pSay", b.say || b.step || "(advance when ready)");
  toggle("pAskWrap", !!b.ask); if (b.ask) set("pAsk", (b.askLabel || ASK_LABELS[0]) + " " + b.ask);
  toggle("pCueWrap", !!b.cue); if (b.cue) set("pCue", b.cue);

  const nb = beats()[state.i + 1];
  set("pNext2", !nb ? "End of lesson." :
    nb.step ? "Reveal step: " + nb.step :
    nb.ask ? "Show class question: " + nb.ask :
    nb.show && nb.show.kind === "answer" ? "Show the answer sentence." :
    nb.show && nb.show.kind === "recap" ? "Show the full recipe." :
    nb.show && nb.show.kind === "story" ? "Show the story problem." :
    "Reveal the next part.");
}

/* ================= wiring ================= */

$("#btnNext").addEventListener("click", next);
$("#btnBack").addEventListener("click", prev);
$("#btnHome").addEventListener("click", goHome);
$("#btnPresenter").addEventListener("click", openPresenter);

document.addEventListener("keydown", e => {
  if ($("#player").hidden) return;
  if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); next(); }
  else if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); prev(); }
});

renderHome();

// deep link: index.html#lesson=add-large&beat=6  (beat is 1-based)
(function () {
  const h = new URLSearchParams(location.hash.slice(1));
  const id = h.get("lesson");
  if (id && LESSONS[id]) {
    openLesson(id);
    const b = parseInt(h.get("beat"), 10);
    if (b > 1) jump(Math.min(b, beats().length) - 1);
  }
})();
