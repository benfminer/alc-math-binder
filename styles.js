const APP_CSS = `
/* ALC Math Binder — calm, warm, high-contrast, projector-first */

:root{
  --bg:#faf6ef;
  --panel:#ffffff;
  --ink:#1e2a3a;
  --soft:#5b6b7d;
  --line:#e5ddcf;
  --accent:#e85d4a;        /* coral — buttons, highlights */
  --accent-dark:#c74533;
  --gold:#f2b544;

  /* consistent place-value colors, same in every lesson */
  --p-units:#0e7c7b;       /* teal   */
  --p-tens:#d97b29;        /* orange */
  --p-hundreds:#7a4fbf;    /* purple */
  --p-thousands:#c24a7a;   /* pink   */
  --carry:#d33a2f;         /* red    */

  --radius:16px;
}

*{box-sizing:border-box}
html,body{height:100%}
body{
  margin:0; background:var(--bg); color:var(--ink);
  font-family:-apple-system, "Segoe UI", system-ui, Roboto, sans-serif;
  font-size:20px; line-height:1.5;
}
button{font:inherit; cursor:pointer}
[hidden]{display:none !important}

/* ---------- buttons ---------- */
.btn{
  border:3px solid var(--ink); border-radius:12px; background:var(--panel);
  color:var(--ink); font-weight:700; padding:.5rem 1.1rem;
  box-shadow:0 3px 0 var(--ink); transition:transform .08s;
}
.btn:active{transform:translateY(3px); box-shadow:none}
.btn.primary{background:var(--accent); color:#fff; border-color:var(--accent-dark); box-shadow:0 3px 0 var(--accent-dark)}
.btn.big{font-size:1.35rem; padding:.7rem 1.6rem}
.btn.ghost{background:transparent; box-shadow:none; border-color:transparent; color:var(--soft)}
.btn.ghost:hover{color:var(--ink)}
.btn:disabled{opacity:.35; cursor:default}
:focus-visible{outline:4px solid var(--accent); outline-offset:3px}

/* ---------- home / binder ---------- */
.home{max-width:68rem; margin:0 auto; padding:2rem 1.5rem 4rem}
.home-head h1{font-size:3rem; margin:.2rem 0 0}
.tagline{color:var(--soft); font-size:1.3rem; margin:.2rem 0 1.5rem}
.unit{margin:1.6rem 0}
.unit h2{font-size:1.25rem; text-transform:uppercase; letter-spacing:.08em; color:var(--soft); border-bottom:3px solid var(--line); padding-bottom:.3rem}
.cards{display:grid; grid-template-columns:repeat(auto-fill,minmax(15rem,1fr)); gap:1rem}
.card{
  text-align:left; background:var(--panel); border:3px solid var(--ink); border-radius:var(--radius);
  padding:1rem 1.1rem; font-size:1.15rem; font-weight:700; box-shadow:0 4px 0 var(--ink);
  min-height:5.2rem; display:flex; flex-direction:column; justify-content:space-between; gap:.4rem;
}
.card:hover{background:#fff8ea}
.card:active{transform:translateY(4px); box-shadow:none}
.card .soon{font-size:.85rem; font-weight:600; color:var(--soft)}
.card.ready .go{font-size:.85rem; color:var(--accent); font-weight:800}
.card.locked{opacity:.55; box-shadow:none; border-style:dashed; cursor:default}
.home-foot{margin-top:3rem; color:var(--soft); font-size:.95rem}

/* ---------- player layout ---------- */
.player{height:100vh; display:flex; flex-direction:column}
.player-grid{flex:1; display:grid; grid-template-columns:1fr 21rem; gap:1rem; padding:1rem 1rem 0; min-height:0}
.stage-wrap{display:flex; flex-direction:column; min-width:0}
.lesson-title-bar{display:flex; align-items:center; gap:.6rem}
.lesson-title-bar h2{flex:1; text-align:center; margin:.2rem 0; font-size:1.5rem}

.stage{
  flex:1; background:var(--panel); border:3px solid var(--ink); border-radius:var(--radius);
  margin-top:.4rem; padding:1.5rem; overflow:auto;
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.2rem;
}
.stage-content{display:flex; flex-direction:column; align-items:center; gap:1.2rem; width:100%}

/* ---------- running steps panel ---------- */
.steps-wrap{
  background:#f3ecdf; border:3px solid var(--ink); border-radius:var(--radius);
  padding:1rem; overflow:auto; display:flex; flex-direction:column;
}
.steps-title{margin:0 0 .8rem; font-size:1.3rem; letter-spacing:.04em}
.steps-list{list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:.6rem}
.step-card{
  background:var(--panel); border:2px solid var(--ink); border-radius:12px;
  padding:.6rem .8rem .6rem .7rem; display:flex; gap:.6rem; align-items:flex-start;
  font-size:1.02rem; line-height:1.35;
  animation:slideIn .35s ease;
}
.step-card .num{
  flex:none; width:1.7rem; height:1.7rem; border-radius:50%;
  background:var(--ink); color:#fff; font-weight:800; font-size:.95rem;
  display:flex; align-items:center; justify-content:center; margin-top:.1rem;
}
.step-card.past{opacity:.55}
.step-card.current{border-color:var(--accent); border-width:3px; box-shadow:0 3px 0 var(--accent)}
.step-card.current .num{background:var(--accent)}
@keyframes slideIn{from{opacity:0; transform:translateX(1.2rem)} to{opacity:1; transform:none}}

/* ---------- teacher bar ---------- */
.teacher-bar{
  display:flex; align-items:center; justify-content:space-between; gap:1rem;
  padding:.8rem 1rem 1rem;
}
.dots{display:flex; gap:.45rem; flex-wrap:wrap; justify-content:center}
.dot{width:.85rem; height:.85rem; border-radius:50%; background:#d8cfbe; border:2px solid transparent}
.dot.done{background:var(--ink)}
.dot.now{background:var(--accent); border-color:var(--accent-dark); transform:scale(1.35)}

/* ---------- stage content: cards ---------- */
.title-card{text-align:center; max-width:38rem}
.title-card .kicker{color:var(--accent); font-weight:800; letter-spacing:.1em; text-transform:uppercase; font-size:1.05rem}
.title-card h1{font-size:3.2rem; margin:.3rem 0 .6rem; line-height:1.15}
.title-card .goal{font-size:1.6rem; color:var(--soft)}

.story-card{
  background:#fff4dd; border:3px solid var(--gold); border-radius:var(--radius);
  padding:1.6rem 2.2rem; font-size:2rem; max-width:42rem; text-align:center; line-height:1.35;
}
/* one sentence per line, with real air between them, and each one fading in
   after the one before it so the class is not handed a wall of words */
.story-card .line, .answer-card .line{transition:opacity .3s ease}
.story-card .line + .line{margin-top:.9rem}
.answer-card .line + .line{margin-top:.7rem}
.story-card .line.in, .answer-card .line.in{animation:sentence-in .4s ease}
@keyframes sentence-in{from{opacity:0; transform:translateY(.4rem)} to{opacity:1; transform:none}}

.note-card{
  background:#eef2ff; border:3px solid #6272c9; border-radius:var(--radius);
  padding:1rem 1.4rem; font-size:1.35rem; max-width:32rem; text-align:center;
}
.note-card .note-title{font-weight:800; color:#3a4aa5; display:block; margin-bottom:.2rem}

.answer-card{
  background:#e7f6ec; border:3px solid #2c8a52; border-radius:var(--radius);
  padding:1.4rem 2rem; font-size:1.9rem; max-width:42rem; text-align:center;
  font-weight:700; line-height:1.35;
}

.ask-card{
  background:var(--ink); color:#fff; border-radius:999px;
  padding:.8rem 1.8rem; font-size:1.5rem; font-weight:700;
  animation:slideIn .35s ease;
}
.ask-card .ask-label{color:var(--gold); font-weight:800}

/* ---------- stage content: counting on fingers ---------- */
.fing-wrap{display:flex; flex-direction:column; align-items:center; gap:clamp(.4rem, 1.2vh, 1rem)}
.fing-label{font-size:clamp(1.2rem, 2.8vh, 2rem); font-weight:800; color:var(--ink)}
.hands{display:flex; gap:0; align-items:flex-end}
.fsvg{height:clamp(9rem, 36vh, 21rem); width:auto; display:block; overflow:visible}
.fskin{fill:#f6dcc3; stroke:#c08f66; stroke-width:4.5; stroke-linejoin:round; stroke-linecap:round}
.fcrease{fill:none; stroke:#d9a985; stroke-width:3; stroke-linecap:round}
/* fingertips tint as they are counted, so "how many fingers" stays readable
   even though every finger is up the whole time */
.fnail{
  fill:#eccbb0; stroke:#c08f66; stroke-width:2.5;
  transition:fill .18s ease, stroke .18s ease;
}
.fnail.counted{fill:var(--gold); stroke:#9a7420}
.fnail.landed{fill:var(--carry); stroke:var(--carry)}
.fnum{
  opacity:0; transform-box:fill-box; transform-origin:center;
  transition:opacity .18s ease, transform .3s cubic-bezier(.34, 1.6, .5, 1);
}
.fnum.show{opacity:1; animation:pop .25s ease}
.fnum-bg{fill:#fff1cc; stroke:var(--gold); stroke-width:3}
.fnum text{fill:var(--ink); font-weight:800; font-size:30px; font-family:inherit}
/* the number you land on is the point of the whole beat: it grows */
.fnum.landed{animation:none; transform:scale(1.34)}
.fnum.landed .fnum-bg{fill:#ffe2de; stroke:var(--carry); stroke-width:4}
.fing-tally{font-size:clamp(1rem, 2.2vh, 1.5rem); font-weight:800; color:var(--soft); min-height:1.4em}
.fing-tally.watch{
  background:#fff1cc; box-shadow:inset 0 0 0 3px var(--gold); border-radius:10px;
  color:var(--ink); padding:.15rem .9rem;
}
.fing-tally.watch:empty{background:none; box-shadow:none}
.fing-answer{font-size:clamp(1.4rem, 3.2vh, 2.3rem); font-weight:800; color:var(--ink); min-height:1.3em}

/* ---------- stage content: the place value chart ---------- */
.pv-wrap{display:flex; flex-direction:column; align-items:center; gap:clamp(.5rem, 1.4vh, 1.1rem)}
.pv-caption{font-size:clamp(1.4rem, 3.2vh, 2.4rem); font-weight:800; color:var(--ink); letter-spacing:.01em}
.pv-chart{
  display:grid; border:4px solid var(--ink); border-radius:14px;
  overflow:hidden; background:var(--panel);
}
.pv-col{display:flex; flex-direction:column; border-right:3px solid var(--ink)}
.pv-col:last-child{border-right:none}
.pv-head{
  font-size:clamp(.75rem, 1.7vh, 1.15rem); font-weight:800; text-transform:uppercase;
  letter-spacing:.06em; text-align:center; padding:.45rem .9rem;
  border-bottom:3px solid var(--ink); background:#fbf7f0; white-space:nowrap;
}
.pv-cell{
  display:flex; align-items:center; justify-content:center;
  min-width:clamp(3.6rem, 9vh, 6.4rem); height:clamp(3.6rem, 9vh, 6.4rem);
  font-size:clamp(2rem, 5.4vh, 4rem); font-weight:800; color:var(--ink);
}
/* the base-ten chart writes what a place is worth, which needs more room */
.pv-cell.worth{font-size:clamp(1rem, 2.4vh, 1.7rem); padding:0 .5rem}
.pv-head{transition:opacity .3s ease}
.pv-head.in{animation:sentence-in .4s ease}
.pv-col.focus .pv-cell{background:#fff1cc; box-shadow:inset 0 0 0 4px var(--gold)}
.pv-col.focus .pv-head{background:#fff1cc}

/* the x10 ladder under the base-ten chart */
.pv-ladder{display:grid; width:100%}
.pv-rung{display:flex; justify-content:flex-start; align-items:center; height:1.9rem}
.pv-x10{
  font-size:clamp(.8rem, 1.8vh, 1.15rem); font-weight:800; color:var(--carry);
  transform:translateX(-50%); white-space:nowrap;
}
.pv-x10::before{content:"← "}
.pv-ladder-note{font-size:clamp(.95rem, 2.1vh, 1.35rem); font-weight:700; color:var(--soft)}

/* digit / place value / value, revealed one line at a time */
.pv-callouts{display:flex; flex-direction:column; gap:.35rem; align-items:stretch; min-width:min(24rem, 70vw)}
.pv-callout{
  display:flex; gap:.8rem; align-items:baseline; justify-content:space-between;
  background:#fbf7f0; border:3px solid var(--line); border-radius:12px;
  padding:.3rem .9rem; animation:pop .25s ease;
}
.pv-callout.strong{background:#fff1cc; border-color:var(--gold)}
.pv-co-label{
  font-size:clamp(.8rem, 1.8vh, 1.15rem); font-weight:800; color:var(--soft);
  text-transform:uppercase; letter-spacing:.05em;
}
.pv-co-val{font-size:clamp(1.2rem, 2.8vh, 2rem); font-weight:800; color:var(--ink)}

/* two charts stacked, for comparing one number against another */
.pv-unit{display:flex; flex-direction:column; align-items:center; gap:clamp(.4rem, 1.1vh, .9rem)}
.pv-wrap > .pv-unit + .pv-unit{margin-top:clamp(.5rem, 1.6vh, 1.2rem)}
.pv-verdict{
  font-size:clamp(1.1rem, 2.6vh, 1.8rem); font-weight:800; color:var(--ink);
  background:#fff1cc; box-shadow:inset 0 0 0 3px var(--gold); border-radius:12px;
  padding:.3rem 1.1rem; text-align:center;
}
/* the digit walking one seat to the left */
.pv-cell.walked{animation:pv-walk .4s cubic-bezier(.34, 1.3, .5, 1)}
@keyframes pv-walk{from{transform:translateX(105%); opacity:.15} to{transform:translateX(0); opacity:1}}

/* expanded form, built up one term at a time */
.pv-expanded{
  display:flex; flex-wrap:wrap; gap:.5rem; align-items:baseline; justify-content:center;
  font-size:clamp(1.4rem, 3.4vh, 2.6rem); font-weight:800;
}
.pv-expanded .pv-term{animation:pop .25s ease}
.pv-plus{color:var(--soft)}

/* ---------- stage content: the same number, in base-ten blocks ---------- */
/* one little cube is --u tall, and every block is drawn to that same scale, so
   a ten really is ten ones tall and a hundred really is a hundred of them */
.bk-wrap{--u:clamp(.4rem, .9vh, .68rem); display:flex; flex-direction:column; align-items:center; gap:clamp(.3rem, .9vh, .7rem)}
.bk-row{
  display:grid; grid-template-columns:minmax(7.5rem, auto) 1fr minmax(5rem, auto);
  align-items:center; gap:clamp(.6rem, 2vw, 1.4rem);
  width:min(58rem, 94%); padding:.35rem .9rem;
  background:var(--panel); border:3px solid var(--line); border-radius:14px;
  animation:pop .25s ease;
}
.bk-count{font-size:clamp(.95rem, 2.2vh, 1.5rem); font-weight:800; white-space:nowrap}
.bk-strip{display:flex; flex-wrap:wrap; gap:.35rem; align-items:flex-end}
.bk-sum{font-size:clamp(.95rem, 2.2vh, 1.5rem); font-weight:800; color:var(--ink); text-align:right; white-space:nowrap}
.bk-none{font-size:clamp(.75rem, 1.7vh, 1.05rem); font-weight:700; color:var(--soft); font-style:italic}
.bk{display:block; width:auto}
.bk-0{height:calc(var(--u) * 1.2)}
.bk-1{height:calc(var(--u) * 10.2)}
.bk-2{height:calc(var(--u) * 10.2)}
.bk-3{height:calc(var(--u) * 13.2)}
.bk-face{fill:currentColor; fill-opacity:.28; stroke:currentColor; stroke-width:2.5}
.bk-grid{stroke:currentColor; stroke-width:1.1; stroke-opacity:.65}
.bk-top{fill:currentColor; fill-opacity:.5; stroke:currentColor; stroke-width:2.5; stroke-linejoin:round}
.bk-side{fill:currentColor; fill-opacity:.42; stroke:currentColor; stroke-width:2.5; stroke-linejoin:round}
.bk-total{
  font-size:clamp(1.2rem, 3vh, 2rem); font-weight:800; color:var(--ink);
  background:#fff1cc; box-shadow:inset 0 0 0 3px var(--gold);
  border-radius:12px; padding:.25rem 1.2rem; margin-top:.3rem;
}

/* ---------- stage content: area and perimeter ---------- */
/* --rc-u is the on-screen size of one unit square, shared by every rectangle
   on the stage so areas can be compared by eye */
.rc-wrap{--rc-u:clamp(1.5rem, 5.2vh, 3.2rem); display:flex; flex-direction:column; align-items:center; gap:clamp(.4rem, 1.2vh, .9rem)}
/* two shapes on one beat sit on a shared baseline, like objects on a desk, so
   their labels line up instead of stair-stepping when one is shorter */
.rc-row{display:flex; gap:clamp(1.2rem, 4vw, 3.5rem); align-items:stretch; flex-wrap:wrap; justify-content:center}
.rc-box{display:flex; flex-direction:column; align-items:center; justify-content:flex-end; gap:.4rem}
.rc-svg{width:auto; max-width:100%; display:block; overflow:visible}
.rc-title{font-size:clamp(.95rem, 2.2vh, 1.45rem); font-weight:800; color:var(--ink)}
.rc-note{font-size:clamp(.85rem, 1.9vh, 1.2rem); font-weight:700; color:var(--soft)}

/* the garden seen from above: grass around it, bare soil inside, and a wooden
   fence that gets built one length at a time when we walk the perimeter */
.rc-ground{fill:#cfe0bd; stroke:#a9c48d; stroke-width:3}
.rc-soil{fill:#e3d0b4; stroke:none}
/* pop scales about the element's own box; without transform-box an SVG rect
   would scale about the origin of the whole drawing and fly off the plot */
.rc-cell{
  fill:transparent; stroke:#b09468; stroke-width:2;
  transform-box:fill-box; transform-origin:center;
  transition:fill .15s ease, stroke .15s ease;
}
/* a counted square: this is the garden filling up with plants. Its outline
   turns green too, so a planted square still reads as one square and not as
   part of one big green blob. */
.rc-cell.on{fill:#59993d; stroke:#3d6d29; animation:pop .2s ease}
.rc-edge{fill:none; stroke:#a98b62; stroke-width:3}
/* one length of fence. Invisible until we walk past it. */
.rc-seg{transform-box:fill-box; transform-origin:center}
.rc-seg .rc-rail{stroke:transparent; stroke-width:9; stroke-linecap:round; transition:stroke .12s ease}
.rc-seg .rc-post{fill:transparent; stroke:transparent; stroke-width:2; transition:fill .12s ease, stroke .12s ease}
.rc-seg.on{animation:pop .2s ease}
.rc-seg.on .rc-rail{stroke:#a9713a}
.rc-seg.on .rc-post{fill:#7a4d22; stroke:#5c3818}

.rc-tick{stroke:var(--soft); stroke-width:2.5}
.rc-lab{font-size:19px; font-weight:800; font-family:inherit; fill:var(--soft); letter-spacing:.04em}

.rc-tally{
  font-size:clamp(1rem, 2.3vh, 1.5rem); font-weight:800; color:var(--ink); min-height:1.5em;
  background:#dcecd0; border-radius:10px; padding:.1rem .8rem;
}
.rc-tally.walk{background:#f0dcc4}
.rc-tally:empty{background:none}
.rc-result{
  font-size:clamp(1.3rem, 3.2vh, 2.2rem); font-weight:800; color:var(--ink);
  background:#dcecd0; box-shadow:inset 0 0 0 3px #5e8f44; border-radius:12px;
  padding:.25rem 1.2rem; animation:pop .25s ease;
}
.rc-result.walk{background:#f0dcc4; box-shadow:inset 0 0 0 3px #a9713a}
.rc-formula{font-size:clamp(1rem, 2.4vh, 1.6rem); font-weight:800; color:var(--soft); letter-spacing:.03em}

/* ---------- stage content: money ---------- */
/* --cn-u is one millimetre of coin, shared by every coin on the stage, so a
   dime really is smaller than a penny. Do not size coins individually. */
.cn-wrap{
  --cn-max:clamp(.20rem, .80vh, .44rem); --cn-u:var(--cn-max);
  display:flex; flex-direction:column; align-items:center;
  gap:clamp(.5rem, 1.4vh, 1rem);
}
.cn-wrap.big{--cn-u:clamp(.30rem, 1.5vh, .80rem)}
.cn-row{display:flex; align-items:flex-end; justify-content:center; flex-wrap:wrap;
        gap:clamp(.4rem, 1.4vh, 1rem) clamp(.3rem, 1vh, .7rem)}
.cn-coin{display:flex; flex-direction:column; align-items:center; gap:.25rem}
.cn-coin.gap{margin-right:clamp(1rem, 3.5vh, 2.6rem)}
.cn-coin.dim{opacity:.32}
.cn-svg{width:auto; display:block; overflow:visible;
        transform-box:fill-box; transform-origin:center}
.cn-val{
  font-size:clamp(.8rem, 1.9vh, 1.25rem); font-weight:800; color:var(--soft);
  letter-spacing:.01em;
}
/* one coin held up on its own gets its value read from the back row too */
.cn-wrap.big .cn-val{font-size:clamp(1.3rem, 3.4vh, 2.3rem); color:var(--ink)}

/* the coin itself: a rim, a face, and the coin's own name written on it */
.cn-rim{fill:#b9c0c8; stroke:#8d959e; stroke-width:.7}
.cn-face-c{fill:#dfe4e9; stroke:none}
.cn-svg.copper .cn-rim{fill:#c98b4e; stroke:#96622f; stroke-width:.7}
.cn-svg.copper .cn-face-c{fill:#e0a76d}
.cn-face{font-family:inherit; font-weight:800; fill:#46505c; letter-spacing:.02em}
.cn-svg.copper .cn-face{fill:#5e3a18}

/* a coin we have already counted: gold ring, same gold as a landed count
   everywhere else in the binder */
.cn-coin.on .cn-svg{animation:pop .22s ease}
.cn-coin.on .cn-rim{fill:var(--gold); stroke:#b4801c}
.cn-coin.on .cn-face-c{fill:#ffe6ac}
.cn-coin.on .cn-face{fill:#6b4a08}
.cn-coin.on .cn-val{color:var(--ink)}
.cn-coin.hl .cn-rim{stroke:var(--accent); stroke-width:1.6}
.cn-coin.hl .cn-val{color:var(--accent-dark)}

/* bills, all one size, drawn flat so they read from the back of the room */
.cn-bill{fill:#d8e8d2; stroke:#3f6b39; stroke-width:1.4}
.cn-bill-in{fill:none; stroke:#7aa270; stroke-width:.8}
.cn-face.bill{font-size:11px; fill:#26492a}
.cn-corner{font-family:inherit; font-size:5px; font-weight:800; fill:#3f6b39}
.cn-coin.on .cn-bill{fill:#fff1cc; stroke:#b4801c}
.cn-coin.on .cn-bill-in{stroke:var(--gold)}
.cn-coin.on .cn-face.bill,.cn-coin.on .cn-corner{fill:#6b4a08}

/* the running total, and the amount we are climbing towards */
.cn-tally{
  font-size:clamp(1.4rem, 3.4vh, 2.4rem); font-weight:800; color:var(--ink);
  background:#e7eef6; border-radius:12px; padding:.1rem 1.1rem; min-height:1.3em;
}
.cn-tally.landed{background:#fff1cc; box-shadow:inset 0 0 0 3px var(--gold)}
.cn-goal{
  font-size:clamp(.95rem, 2.2vh, 1.45rem); font-weight:800; color:var(--soft);
  border:3px dashed #cfc5b4; border-radius:12px; padding:.1rem .9rem;
}
.cn-goal.hit{border-color:var(--gold); border-style:solid; color:var(--ink); background:#fff1cc}
.cn-result{
  font-size:clamp(1.3rem, 3.2vh, 2.2rem); font-weight:800; color:var(--ink);
  background:#dcecd0; box-shadow:inset 0 0 0 3px #5e8f44; border-radius:12px;
  padding:.25rem 1.2rem; animation:pop .25s ease;
}

/* ---------- stage content: tally-mark skip counting ---------- */
.hash-wrap{display:flex; flex-direction:column; align-items:center; gap:clamp(.8rem, 2vh, 1.5rem)}
.hash-row{display:flex; gap:clamp(.45rem, 1.2vh, 1rem); align-items:flex-start}
.hash{display:flex; flex-direction:column; align-items:center; gap:.35rem}
.tick{
  width:clamp(.45rem, 1vh, .75rem); height:clamp(2rem, 4.8vh, 3.6rem);
  background:var(--ink); border-radius:99px; transform:rotate(8deg);
  transition:background .15s ease;
}
.hash.tapped .tick{background:var(--gold)}
.hash.landed .tick{background:var(--carry)}
.cnt{
  font-size:clamp(1rem, 2.2vh, 1.6rem); font-weight:800; color:var(--soft);
  min-height:1.3em; padding:.1rem .4rem;
}
.hash.tapped .cnt{animation:pop .25s ease}
.hash.landed .cnt{
  background:#fff1cc; box-shadow:inset 0 0 0 3px var(--gold); border-radius:8px;
  color:var(--ink);
}
.count-again{
  font:inherit; font-size:1rem; font-weight:700; color:var(--soft);
  background:transparent; border:2px solid #d8cfc0; border-radius:99px;
  padding:.3rem 1rem; cursor:pointer;
}
.count-again:hover{background:#f3ece1; color:var(--ink)}

/* every single-digit multiplication fact there is, in one box */
.fgrid{display:grid; grid-template-columns:repeat(10, auto); border:3px solid var(--ink); border-radius:10px; overflow:hidden}
.fcell{
  font-size:clamp(.85rem, 2.1vh, 1.6rem); font-weight:700; color:var(--ink);
  min-width:clamp(1.8rem, 4.2vh, 3.6rem); padding:clamp(.2rem, .7vh, .5rem) .2rem;
  text-align:center; border-right:1px solid #dde3ea; border-bottom:1px solid #dde3ea;
}
.fcell.fhead{background:#f4f7fa; color:var(--soft); font-weight:800}
.fcell.corner{background:#e8edf3}
.fcell.mark{background:#fff1cc; box-shadow:inset 0 0 0 3px var(--gold); font-weight:800}

.chart-box{display:flex; flex-direction:column; align-items:center; gap:.3rem}
.chart-label{font-size:clamp(.95rem, 2vh, 1.25rem); font-weight:800; color:var(--soft)}

/* the multiples chart: 0 through the 9th multiple */
.mchart{display:grid; grid-auto-flow:column; border:3px solid var(--ink); border-radius:10px; overflow:hidden}
.mcol{display:flex; flex-direction:column; border-right:2px solid #cfd6de}
.mcol:last-child{border-right:0}
.mtop{
  font-size:clamp(.85rem, 1.9vh, 1.2rem); font-weight:800; color:var(--soft);
  text-align:center; padding:.15rem 0; border-bottom:2px solid #cfd6de; background:#f4f7fa;
}
.mbot{
  font-size:clamp(1.3rem, 3.2vh, 2.3rem); font-weight:800; color:var(--ink);
  text-align:center; min-width:clamp(2.6rem, 5.6vh, 4rem); padding:.35rem .3rem;
  min-height:1.4em;
}
.mcol.new .mbot{background:#fff1cc; box-shadow:inset 0 0 0 3px var(--gold)}

/* ---------- stage content: column math ---------- */
.math-block{display:flex; flex-direction:column; align-items:flex-end}
.mrow{display:grid; grid-auto-flow:column}
.cell{
  width:clamp(2.8rem, 5.2vh, 4.2rem); height:clamp(3.2rem, 6.2vh, 5rem);
  display:flex; align-items:center; justify-content:center;
  font-size:clamp(2.2rem, 4.7vh, 3.8rem); font-weight:700; font-variant-numeric:tabular-nums;
}
.cell.op{color:var(--soft)}
.cell.focus{background:#fff1cc; border-radius:10px; box-shadow:inset 0 0 0 3px var(--gold)}
.cell.red{color:var(--carry)}
.cell.pop{animation:pop .4s ease}
.cell.strike{position:relative; color:#a9b2bd}
.cell.strike::after{content:""; position:absolute; left:15%; right:15%; top:50%;
  border-top:5px solid var(--carry); transform:rotate(-18deg); border-radius:3px}
.note-card.big{font-size:1.6rem; max-width:36rem; padding:1.4rem 1.8rem}
@keyframes pop{0%{transform:scale(.3); opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1)}}

.cell.comma{width:clamp(.9rem, 1.6vh, 1.3rem); font-size:clamp(1.5rem, 3vh, 2.4rem); align-items:flex-end; padding-bottom:.6rem}
.mrow.labels .cell.comma, .mrow.carry .cell.comma{visibility:hidden}
.mrow.carry .cell{height:clamp(1.7rem, 3.2vh, 2.6rem); font-size:clamp(1.2rem, 2.4vh, 1.9rem); color:var(--carry); font-weight:800}
/* a carry that has been used up: retired quietly, in grey, so nobody adds it twice */
.mrow.carry .cell.strike{color:#5f6b78}
/* the carry cell is far wider than the single digit in it, so the slash is
   sized to the glyph — a full-width rule reads as a stray pen mark */
.mrow.carry .cell.strike::after{border-top-color:#aab3bd; border-top-width:3px; left:30%; right:30%}
.mrow.labels .cell{height:2.2rem; font-size:.85rem; font-weight:800; letter-spacing:.02em}
.rule{height:0; border-top:6px solid var(--ink); border-radius:3px; margin:.3rem 0; justify-self:stretch}
.mrow.result .cell{color:var(--ink)}
.mrow.result.final .cell:not(.empty):not(.op){background:#ffe3b0; border-radius:10px}

/* long division: the house.
   The bracket is the left slot's right border meeting the dividend cells' top
   border — two straight strokes of the same weight, which is exactly the shape
   students see in the binder. --dv-cell repeats .cell's width so the rule rows,
   which are placed on an explicit grid, line up with the digit rows. */
.div-block{display:flex; flex-direction:column; align-items:flex-start;
  --dv-cell:clamp(2.8rem, 5.2vh, 4.2rem); --dv-slot:clamp(3rem, 5.6vh, 4.6rem)}
.dv-row{display:grid; grid-auto-flow:column; align-items:center}
/* the left slot: divisor on the house row, operator on a work row */
.dv-slot{width:var(--dv-slot); justify-content:flex-end; padding-right:.4rem}
.dv-slot.is-op, .cell.is-op{color:var(--soft)}
.dv-slot.house{border-right:7px solid var(--ink)}
.dv-dividend .under-bar{border-top:7px solid var(--ink)}
/* the subtraction line spans only the columns being subtracted, so it never
   reaches under a digit we have not touched yet */
.dv-rule-row{margin:.1rem 0; height:.5rem}
.dv-ruleline{border-top:6px solid var(--ink); border-radius:3px}
/* the bring-down arrow, in the same gold as the digit it drags down */
.dv-arrow-row .cell{height:clamp(1.3rem, 2.6vh, 2rem); font-size:clamp(1.2rem, 2.6vh, 1.9rem);
  color:var(--gold); font-weight:900; line-height:1}
.cell.brought{color:var(--gold)}
.dv-row.dv-final .cell:not(.empty):not(.dv-slot):not(.is-op){background:#ffe3b0; border-radius:10px}
.dv-rem{display:flex; align-items:center; white-space:nowrap; padding-left:.7rem;
  font-size:clamp(1.3rem, 2.9vh, 2.3rem); font-weight:800; color:var(--accent)}

/* place-value colors (labels + focused column tint follow these) */
.pl-0{color:var(--p-units)} .pl-1{color:var(--p-tens)} .pl-2{color:var(--p-hundreds)} .pl-3{color:var(--p-thousands)}

/* recipe recap */
.recap{max-width:34rem; width:100%}
.recap h2{text-align:center; font-size:2.2rem; margin:0 0 1rem}
.recap ol{list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:.7rem}
.recap .step-card{font-size:1.25rem}

@media (max-width:900px){
  .player-grid{grid-template-columns:1fr; grid-template-rows:1fr auto}
  .steps-wrap{max-height:11rem}
  .cell{width:3rem; height:3.6rem; font-size:2.6rem}
}
`;
