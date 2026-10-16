/* ALC Math Binder — Makey Makey practice

   Teacher at the projector, one student on the foil pads, the class calling
   out. Random adding and subtracting problems, worked one column at a time
   the way the binder teaches them:
     adding      start at the bigger digit, count up the smaller one (and one
                 more tap for a carried 1), touch DONE, THEN "more than 9?"
     subtracting "top digit too small? borrow?" FIRST, then start at the bottom
                 digit and count UP to the top one. The taps are the answer.
   Nobody ever counts down.

   A Makey Makey is just a keyboard to the computer, so every pad is a key:
     Count = Space   YES = Up   NO = Down   DONE = Right   hidden teacher pad = Left (undo)
   Teacher-only keys the pads never send: N new problem, 1-5 level,
   P prompts on/off, M add / subtract / mixed.

   The drawing comes from app.js: buildColumns for the problem and buildHand
   for the two hands, so a problem here looks exactly like it does in the
   Adding and Subtracting Large Numbers lessons. */

const PR_LEVELS = [
  { n: 1, name: "Adding facts" },
  { n: 2, name: "Subtracting facts" },
  { n: 3, name: "2-digit, no regrouping" },
  { n: 4, name: "2-digit, regrouping" },
  { n: 5, name: "3 and 4 digits" },
];
const PR_MODES = ["mixed", "add", "sub"];
const PR_MODE_NAMES = { mixed: "Adding + subtracting", add: "Adding only", sub: "Subtracting only" };
const PR_MAX_TAPS = 10;            // ten fingers; 9 plus a carried 1 is the most a column needs

/* ---------- problems ---------- */

const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
const digitsOf = (n, len) => Array.from({ length: len }, (_, i) => Math.floor(n / 10 ** i) % 10);  // ones first

/* Walks a column problem the way the student will and reports what happens,
   so the generator can keep or throw away a candidate. */
function analyze(op, a, b, len) {
  const A = digitsOf(a, len), B = digitsOf(b, len);
  let regroups = 0, ok = true, carry = 0, maxTaps = 0;
  if (op === "+") {
    for (let i = 0; i < len; i++) {
      const s = A[i] + B[i] + carry;
      maxTaps = Math.max(maxTaps, Math.min(A[i], B[i]) + carry);
      carry = s > 9 ? 1 : 0;
      if (carry) regroups++;
    }
    if (carry) ok = false;                         // no carry out of the front column
  } else {
    const eff = A.slice();
    for (let i = 0; i < len; i++) {
      if (eff[i] < B[i]) {
        if (i === len - 1 || A[i + 1] === 0) { ok = false; break; }   // nothing to borrow, or borrowing across a zero
        eff[i] += 10; eff[i + 1] -= 1; regroups++;
      }
      maxTaps = Math.max(maxTaps, eff[i] - B[i]);
    }
    if (ok && eff[len - 1] - B[len - 1] < 1) ok = false;               // no leading zero, no negatives
  }
  return { ok, regroups, maxTaps };
}

function makeProblem(level, mode) {
  if (level === 1) {
    const x = rnd(2, 9), y = rnd(2, 9);
    return { op: "+", a: x, b: y, fact: true, len: 1 };
  }
  if (level === 2) {
    const b = rnd(2, 9), d = rnd(1, 9);
    return { op: "−", a: b + d, b: b, fact: true, len: 1 };
  }
  const op = mode === "add" ? "+" : mode === "sub" ? "−" : (Math.random() < .5 ? "+" : "−");
  const len = level === 5 ? rnd(3, 4) : 2;
  const lo = 10 ** (len - 1), hi = 10 ** len - 1;
  for (;;) {
    let a = rnd(lo, hi), b = rnd(lo, hi);
    if (op === "−" && b > a) [a, b] = [b, a];
    const r = analyze(op === "+" ? "+" : "-", a, b, len);
    if (!r.ok) continue;
    if (level === 3 && r.regroups !== 0) continue;
    if (level >= 4 && r.regroups === 0) continue;
    return { op, a, b, fact: false, len };
  }
}

/* ---------- state ---------- */

let pr = null;                     // the problem being worked, plus where we are in it
let prLevel = 3, prMode = "mixed", prPrompts = true, prSolved = 0;
let prHistory = [];                // snapshots for the hidden undo pad
let prLastSpec = null;             // last columns spec, so new digits pop

function startProblem() {
  const p = makeProblem(prLevel, prMode);
  pr = {
    p, col: 0, taps: 0, miss: null, wrong: false,
    A: digitsOf(p.a, p.len), B: digitsOf(p.b, p.len),
    eff: digitsOf(p.a, p.len),     // the top digits after any borrowing
    struck: [],                    // places whose top digit was crossed out
    carryIn: Array(p.len + 1).fill(0),
    result: [],
    phase: null,
  };
  pr.phase = firstPhase();
  prHistory = [];
  prLastSpec = null;
  prRender();
}

const isAdd = () => pr.p.op === "+";
const firstPhase = () => (!pr.p.fact && !isAdd()) ? "borrowQ" : "count";

/* where the count starts, how many taps it needs, and where it should land */
function countInfo() {
  const c = pr.col;
  if (pr.p.fact) {
    if (isAdd()) {
      const start = Math.max(pr.p.a, pr.p.b), need = Math.min(pr.p.a, pr.p.b);
      return { start, need, land: start + need };
    }
    return { start: pr.p.b, need: pr.p.a - pr.p.b, land: pr.p.a };
  }
  if (isAdd()) {
    const start = Math.max(pr.A[c], pr.B[c]), small = Math.min(pr.A[c], pr.B[c]);
    const carry = pr.carryIn[c];
    return { start, small, carry, need: small + carry, land: start + small + carry };
  }
  return { start: pr.B[c], need: pr.eff[c] - pr.B[c], land: pr.eff[c] };
}

const snapshot = () => prHistory.push(JSON.stringify(pr));

/* ---------- the pads ---------- */

function padCount() {
  if (pr.phase !== "count") return nudge("count");
  if (pr.taps >= PR_MAX_TAPS && !pr.miss) return shakeHands();
  snapshot();
  // after a miss the next tap wipes the hands and is the first tap of the recount
  if (pr.miss) { pr.miss = null; pr.taps = 0; }
  pr.taps++;
  prRender();
}

function padDone() {
  if (pr.phase !== "count" || pr.miss) return nudge("done");
  snapshot();
  const ci = countInfo();
  if (pr.taps !== ci.need) {
    pr.miss = { landed: ci.start + pr.taps };
    return prRender();
  }
  if (pr.p.fact) { finish(); return prRender(); }
  if (isAdd()) {
    pr.phase = "carryQ";
  } else {
    pr.result[pr.col] = pr.taps;
    nextColumn();
  }
  prRender();
}

function padAnswer(yes) {
  if (pr.phase !== "carryQ" && pr.phase !== "borrowQ") return nudge(yes ? "yes" : "no");
  snapshot();
  const c = pr.col;
  if (pr.phase === "carryQ") {
    const sum = countInfo().land;
    if (yes !== (sum > 9)) { pr.wrong = true; return prRender(); }
    pr.wrong = false;
    pr.result[c] = sum % 10;
    if (sum > 9) pr.carryIn[c + 1] = 1;
    nextColumn();
  } else {
    const tooSmall = pr.eff[c] < pr.B[c];
    if (yes !== tooSmall) { pr.wrong = true; return prRender(); }
    pr.wrong = false;
    if (tooSmall) {
      pr.eff[c] += 10; pr.eff[c + 1] -= 1;
      if (!pr.struck.includes(c)) pr.struck.push(c);
      if (!pr.struck.includes(c + 1)) pr.struck.push(c + 1);
    }
    pr.phase = "count";
    pr.taps = 0;
  }
  prRender();
}

function nextColumn() {
  pr.col++;
  pr.taps = 0;
  pr.miss = null;
  if (pr.col >= pr.p.len) finish();
  else pr.phase = isAdd() ? "count" : "borrowQ";
}

function finish() {
  pr.phase = "solved";
  prSolved++;
}

function padUndo() {
  if (!prHistory.length) return;
  const was = pr.phase;
  pr = JSON.parse(prHistory.pop());
  if (was === "solved") prSolved--;
  prRender();
}

/* ---------- drawing ---------- */

const $p = s => document.querySelector(s);
let prFingers = [];                // the ten fingertips, in counting order
let prHandsKey = null;             // which count the hands are showing

function buildPracticeHands() {
  const hands = $p("#prHands");
  hands.innerHTML = "";
  prFingers = [];
  ["left", "right"].forEach(side => {
    const hand = buildHand(side);
    const box = document.createElement("div");
    box.className = "hand";
    box.appendChild(hand.svg);
    hands.appendChild(box);
    HAND_ORDER[side].forEach(name => prFingers.push(hand.parts[name]));
  });
}

/* The hands stay on screen and only the changed fingertips are touched, so
   a tap pops one new number instead of replaying the whole count. */
function syncHands(start, taps, landed) {
  const key = pr.p.a + pr.p.op + pr.p.b + ":" + pr.col + ":" + start;
  if (key !== prHandsKey) { buildPracticeHands(); prHandsKey = key; }
  prFingers.forEach((f, i) => {
    const on = i < taps;
    if (on && !f.num.classList.contains("show")) {
      f.nail.classList.add("counted");
      f.num.classList.add("show");
    }
    if (!on) {
      f.nail.classList.remove("counted", "landed");
      f.num.classList.remove("show", "landed");
    }
    f.text.textContent = on ? start + i + 1 : "";
    const isLanded = on && landed && i === taps - 1;
    f.nail.classList.toggle("landed", isLanded);
    f.num.classList.toggle("landed", isLanded);
    if (isLanded) f.num.parentNode.appendChild(f.num);
  });
}

function shakeHands() {
  const h = $p("#prHands");
  h.classList.remove("pr-shake");
  void h.offsetWidth;
  h.classList.add("pr-shake");
}

function nudge(pad) {
  const el = document.querySelector(`.pr-pad[data-pad="${pad}"]`);
  if (!el) return;
  el.classList.remove("pr-nope");
  void el.offsetWidth;
  el.classList.add("pr-nope");
}

function flashPad(pad) {
  const el = document.querySelector(`.pr-pad[data-pad="${pad}"]`);
  if (!el) return;
  el.classList.remove("pr-hit");
  void el.offsetWidth;
  el.classList.add("pr-hit");
}

const fmt = (n, len) => len >= 4 ? n.toLocaleString("en-US") : String(n);

function columnsSpec() {
  const len = pr.p.len;
  const top = fmt(pr.p.a, len), bot = fmt(pr.p.b, len);
  const W = top.length;
  const disp = [];                                   // place -> display column
  for (let c = W - 1; c >= 0; c--) if (top[c] !== ",") disp.push(c);

  const res = Array(W).fill(" ");
  pr.result.forEach((d, place) => { if (d != null) res[disp[place]] = String(d); });
  for (let c = 1; c < W; c++) if (top[c] === ",") res[c] = res[c - 1] !== " " ? "," : " ";

  const spec = {
    rows: [{ t: top, strike: pr.struck.map(p => disp[p]) }, { t: bot, op: pr.p.op }],
    result: res.join(""),
    resultFinal: pr.phase === "solved",
    labels: len <= 3,                                // four place names do not fit over four digits
  };
  if (pr.phase !== "solved") spec.focus = pr.col;
  if (isAdd()) {
    const carry = Array(W).fill(" ");
    pr.carryIn.forEach((v, place) => { if (v && place < len) carry[disp[place]] = "1"; });
    spec.carry = carry.join("");
  } else {
    const borrow = Array(W).fill("");
    pr.struck.forEach(place => { borrow[disp[place]] = String(pr.eff[place]); });
    spec.borrow = borrow;
  }
  return { spec, disp };
}

function renderProblem() {
  const box = $p("#prProblem");
  box.innerHTML = "";
  if (pr.p.fact) {
    const ans = pr.phase === "solved" ? (isAdd() ? pr.p.a + pr.p.b : pr.p.a - pr.p.b) : "";
    box.innerHTML = `<div class="pr-fact"><span>${pr.p.a}</span><span class="op">${pr.p.op}</span>` +
      `<span>${pr.p.b}</span><span class="op">=</span><span class="pr-fact-ans${ans !== "" ? " pop" : ""}">${ans}</span></div>`;
    return;
  }
  const { spec, disp } = columnsSpec();
  const block = buildColumns(spec, prLastSpec);
  prLastSpec = spec;
  // the carried 1 lights up on the tap that counts it
  if (isAdd() && pr.phase === "count") {
    const ci = countInfo();
    if (ci.carry && pr.taps > ci.small) {
      const cell = block.querySelector(".mrow.carry").children[1 + disp[pr.col]];
      if (cell) cell.classList.add("pr-lit");
    }
  }
  box.appendChild(block);
}

const plural = (n, one, many) => n === 1 ? one : many;

function prRender() {
  renderProblem();

  const ci = pr.phase === "solved" || pr.phase === "count" || pr.phase === "carryQ" ? countInfo() : null;
  const counting = pr.phase === "count" || pr.phase === "carryQ" || (pr.phase === "solved" && pr.p.fact);
  const start = ci ? ci.start : 0;
  const taps = counting ? pr.taps : 0;
  const landedOK = pr.phase === "carryQ" || (pr.phase === "solved" && pr.p.fact);
  syncHands(start, taps, landedOK && isAdd());

  // the count readout beside the hands
  const lab = $p("#prStart"), big = $p("#prNow"), tally = $p("#prTally");
  if (pr.phase === "count" || pr.phase === "carryQ" || (pr.phase === "solved" && pr.p.fact)) {
    lab.textContent = "Start at " + start;
    big.textContent = start + taps;
    big.className = "pr-now" + (pr.miss ? " miss" : landedOK ? " landed" : "");
    tally.textContent = taps ? taps + plural(taps, " finger", " fingers") + " counted" : "";
    tally.className = "fing-tally" + (!isAdd() && landedOK ? " watch" : "");
  } else {
    lab.textContent = "";
    big.textContent = "";
    big.className = "pr-now";
    tally.textContent = "";
    tally.className = "fing-tally";
  }

  // the banner: what is happening right now, in as few words as will do
  const ban = $p("#prBanner");
  let cls = "pr-banner", main = "", sub = "";
  if (pr.phase === "count") {
    if (pr.miss) {
      cls += " miss";
      main = "You landed on " + pr.miss.landed + ".";
      sub = "Where should we land? Touch COUNT to count again from " + start + ".";
    } else if (isAdd()) {
      main = "Start at " + start + ". Count up " + ci.small + (ci.carry ? ", plus 1 for the carry." : ".");
      if (pr.p.fact) main = "Start at " + start + ". Count up " + ci.need + ".";
      sub = "Touch DONE when you land.";
    } else {
      main = "Start at " + start + ". Count up to " + ci.land + ".";
      sub = "Touch DONE when you land.";
    }
    if (!prPrompts && !pr.miss) { main = "Start at " + start + "."; sub = ""; }
  } else if (pr.phase === "carryQ") {
    cls += " ask" + (pr.wrong ? " wrong" : "");
    main = "Is " + ci.land + " more than 9? Carry?";
    sub = pr.wrong ? "Check again." : prPrompts ? "Touch YES or NO." : "";
  } else if (pr.phase === "borrowQ") {
    cls += " ask" + (pr.wrong ? " wrong" : "");
    const t = pr.eff[pr.col], b = pr.B[pr.col];
    // one question, so YES always means borrow. "Can we do 5 take away 4?"
    // would flip it: "yes we can" is a NO here.
    main = t + " take away " + b + ". Top digit too small? Borrow?";
    sub = pr.wrong ? "Check again." : prPrompts ? "Touch YES or NO." : "";
  } else if (pr.phase === "solved") {
    cls += " solved";
    const ans = isAdd() ? pr.p.a + pr.p.b : pr.p.a - pr.p.b;
    const L = pr.p.len;
    main = fmt(pr.p.a, L) + " " + pr.p.op + " " + fmt(pr.p.b, L) + " = " + fmt(ans, L);
    sub = pr.p.fact && !isAdd() ? "The fingers you counted are the answer." : "Solved!";
  }
  ban.className = cls;
  ban.innerHTML = "";
  const m = document.createElement("div"); m.className = "pr-main"; m.textContent = main;
  const s = document.createElement("div"); s.className = "pr-sub"; s.textContent = sub;
  ban.append(m, s);

  // which pads make sense right now (lit only while prompts are on)
  const want = pr.phase === "count" ? (pr.miss ? ["count"] : ["count", "done"])
             : pr.phase === "carryQ" || pr.phase === "borrowQ" ? ["yes", "no"] : [];
  document.querySelectorAll(".pr-pad").forEach(el => {
    el.classList.toggle("want", prPrompts && want.includes(el.dataset.pad));
  });

  // teacher bar
  document.querySelectorAll(".pr-level").forEach(el => el.classList.toggle("on", +el.dataset.level === prLevel));
  $p("#prMode").textContent = PR_MODE_NAMES[prMode];
  $p("#prMode").disabled = prLevel <= 2;
  $p("#prPrompts").textContent = "Prompts: " + (prPrompts ? "on" : "off");
  $p("#prSolved").textContent = prSolved;
}

/* ---------- keys ----------
   A finger resting on foil holds the key down, and the computer repeats a
   held key, so a pad only counts once it has been let go of. A light touch
   can also flicker on and off as it lifts, so a press within PR_GAP_MS of the
   last release is treated as the same touch. */
const PR_GAP_MS = 70;
const PR_PADS = { " ": "count", ArrowUp: "yes", ArrowDown: "no", ArrowRight: "done", ArrowLeft: "undo" };
const prHeld = {}, prUp = {};

function onPad(pad) {
  if (pad === "count") padCount();
  else if (pad === "done") padDone();
  else if (pad === "yes") padAnswer(true);
  else if (pad === "no") padAnswer(false);
  else if (pad === "undo") padUndo();
  if (pad !== "undo") flashPad(pad);
}

function setLevel(n) { prLevel = n; startProblem(); }

function wirePractice() {
  document.addEventListener("keydown", e => {
    const pad = PR_PADS[e.key];
    if (pad) {
      e.preventDefault();
      if (e.repeat || prHeld[e.key]) return;
      prHeld[e.key] = true;
      if (performance.now() - (prUp[e.key] || -1e9) < PR_GAP_MS) return;
      onPad(pad);
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === "n") startProblem();
    else if (k >= "1" && k <= "5") setLevel(+k);
    else if (k === "p") { prPrompts = !prPrompts; prRender(); }
    else if (k === "m") { prMode = PR_MODES[(PR_MODES.indexOf(prMode) + 1) % 3]; startProblem(); }
  });
  document.addEventListener("keyup", e => {
    if (!PR_PADS[e.key]) return;
    prHeld[e.key] = false;
    prUp[e.key] = performance.now();
  });
  // if the window loses focus mid-touch the keyup never arrives
  window.addEventListener("blur", () => { for (const k in prHeld) prHeld[k] = false; });

  // everything is clickable too, for a day without the board
  document.querySelectorAll(".pr-pad").forEach(el =>
    el.addEventListener("click", e => { e.currentTarget.blur(); onPad(el.dataset.pad); }));
  const levels = $p("#prLevels");
  PR_LEVELS.forEach(l => {
    const b = document.createElement("button");
    b.className = "btn pr-level";
    b.dataset.level = l.n;
    b.title = "Key " + l.n;
    b.innerHTML = `<span class="k">${l.n}</span> ${l.name}`;
    b.addEventListener("click", e => { e.currentTarget.blur(); setLevel(l.n); });
    levels.appendChild(b);
  });
  $p("#prMode").addEventListener("click", e => { e.currentTarget.blur(); prMode = PR_MODES[(PR_MODES.indexOf(prMode) + 1) % 3]; startProblem(); });
  $p("#prPrompts").addEventListener("click", e => { e.currentTarget.blur(); prPrompts = !prPrompts; prRender(); });
  $p("#prNew").addEventListener("click", e => { e.currentTarget.blur(); startProblem(); });

  // practice.html#level=4  opens on a level (handy for testing)
  const lv = parseInt(new URLSearchParams(location.hash.slice(1)).get("level"), 10);
  if (lv >= 1 && lv <= 5) prLevel = lv;
  startProblem();
}

if (typeof document !== "undefined" && document.getElementById("prStage")) wirePractice();
if (typeof module !== "undefined") module.exports = { makeProblem, analyze, digitsOf };
