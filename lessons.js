/* ALC Math Binder — lesson data
   Each lesson is a list of "beats". One click = one beat = one small change.
   Beat fields:
     show : what the stage displays (title | story | columns | note | answer | recap)
     step : adds a numbered card to the running Steps list (the recipe)
     ref  : highlights an earlier recipe step (used during practice)
     ask  : question shown to the class under the stage
     askLabel : optional override for the label on the ask card
                (defaults to a rotation: "Your turn:", "Think:", ...)
     say  : presenter script (simple language, read as-is if needed)

   "columns" show spec, useful extras:
     carry / borrow : the little digits above the top row
     carryStrike    : column indices of carries that are used up — drawn crossed
                      out in grey so nobody adds them into the next row
     rows[].strike  : crossed-out digits in a row (subtraction regrouping)

     cue  : teacher-only note (presenter window only)
*/

/* Units and topics are ordered by what builds on what, not alphabetically or by
   the PDF binder's order. Within a unit, each topic assumes the ones above it.
   Place Value leads because every column algorithm depends on it; times tables
   land right before 2-digit multiplication because that lesson assumes them. */
const BINDER = [
  { unit: "Number Sense", topics: [
    { id: "place-value", title: "Place Value" },
    { title: "Compare Decimals", soon: true },
  ]},
  { unit: "Operations", topics: [
    { id: "add-facts", title: "Adding with Your Fingers" },
    { id: "sub-facts", title: "Subtracting by Counting Up" },
    { id: "counting-81", title: "Everything Is Counting" },
    { id: "add-large",  title: "Adding Large Numbers" },
    { id: "sub-large",  title: "Subtracting Large Numbers", soon: true },
    { id: "times-table", title: "Making a Times Table" },
    { id: "mult-2x2",   title: "Multiplying 2-Digit Numbers", soon: true },
    { title: "Dividing Multi-Digit Numbers", soon: true },
    { title: "Exponents", soon: true },
    { title: "Integers: Add, Subtract, Multiply, Divide", soon: true },
    { title: "Evaluating Expressions", soon: true },
  ]},
  { unit: "Factors & Multiples", topics: [
    { title: "Prime Numbers", soon: true },
    { title: "Factors and Multiples", soon: true },
    { title: "Finding LCM and GCF", soon: true },
  ]},
  { unit: "Fractions & Decimals", topics: [
    { title: "Naming Fractions", soon: true },
    { title: "Equivalent Fractions", soon: true },
    { title: "Multiplying and Dividing Fractions", soon: true },
    { title: "Dividing Fractions", soon: true },
    { title: "Decimal Operations", soon: true },
    { title: "Fractions, Decimals and Percentages", soon: true },
  ]},
  { unit: "Geometry", topics: [
    { title: "Points, Lines, Rays and Angles", soon: true },
    { title: "Types of Angles", soon: true },
    { title: "Types of Triangles", soon: true },
    { id: "area-perimeter", title: "Area and Perimeter of Rectangles" },
    { title: "Volume of a Rectangular Prism", soon: true },
  ]},
  { unit: "Coordinates", topics: [
    { title: "Using a Grid", soon: true },
    { title: "Plotting and Writing Coordinates", soon: true },
  ]},
];

const LESSONS = {};

/* ============================================================
   LESSON: Adding Large Numbers (Columnar Addition)
   Source PDF: "Adding and Subtracting Large Numbers"
   ============================================================ */

// helper: column-math stage specs (strings must all read as right-aligned, same width)
const ADD_ROWS = [{ t: "3,863" }, { t: "2,421", op: "+" }];
const TRY_ROWS = [{ t: "6,175" }, { t: "2,854", op: "+" }];

LESSONS["add-large"] = {
  id: "add-large",
  title: "Adding Large Numbers",
  beats: [

    {
      show: { kind: "title", kicker: "Operations", title: "Adding Large Numbers",
              goal: "We will add big numbers, one column at a time." },
      say: "Today we are adding big numbers. We will go slow, one column at a time. You already know how to add small numbers. This is the same thing, just more columns.",
    },

    {
      show: { kind: "story", text: "A park has 3,863 roses and 2,421 tulips. How many flowers are there in all?" },
      say: "Here is our problem. A park has 3,863 roses and 2,421 tulips. We want to know how many flowers there are in all. 'In all' means we add.",
      cue: "Ask: what word tells us to add? (\"in all\")",
    },

    {
      step: "Line up the numbers by place value.",
      show: { kind: "columns", labels: true, rows: ADD_ROWS,
              context: "3,863 roses + 2,421 tulips" },
      say: "Step one. We write one number on top of the other. The ones go under the ones. The tens go under the tens. Every column lines up.",
      cue: "Point to each place label. Have students name the places out loud.",
    },

    {
      step: "Add the ones. More than 9? Carry.",
      show: { kind: "columns", labels: true, rows: ADD_ROWS, focus: 0, result: "4",
              context: "3,863 roses + 2,421 tulips" },
      say: "Step two. We always start on the right, with the ones. 3 plus 1 is 4. We write 4 in the ones place. The card asks: is it more than 9? Four is not, so there is nothing to carry. We check that every single column.",
    },

    {
      step: "Add the tens and any carry. More than 9? Carry.",
      show: { kind: "columns", labels: true, rows: ADD_ROWS, focus: 1, result: "84",
              context: "3,863 roses + 2,421 tulips" },
      say: "Step three. Now the tens. 6 plus 2 is 8. We write 8 in the tens place.",
    },

    {
      step: "Add the hundreds and any carry. More than 9? Carry.",
      show: { kind: "columns", labels: true, rows: ADD_ROWS, focus: 2, result: "284",
              carry: "1    ",
              note: { title: "Regrouping", text: "8 + 4 = 12. That is more than 9. Write the 2. Carry the 1 to the next column." },
              context: "3,863 roses + 2,421 tulips" },
      say: "Step four. The hundreds. 8 plus 4 is 12. Twelve is more than 9, so it does not fit in one column. We write the 2, and we carry the 1 over to the thousands. That little red 1 is waiting for us there.",
      cue: "Common mistake: writing 12 in one column. Pause here and check.",
    },

    {
      step: "Add the thousands and any carry. More than 9? Carry.",
      show: { kind: "columns", labels: true, rows: ADD_ROWS, focus: 3, result: "6,284",
              carry: "1    ", resultFinal: true,
              context: "3,863 roses + 2,421 tulips" },
      say: "Step five. The thousands. First the carry: 1 plus 3 is 4, plus 2 is 6. We write 6. We are done. The answer is 6,284.",
    },

    {
      show: { kind: "answer", text: "The park has 6,284 flowers in all." },
      say: "So the park has 6,284 flowers in all. We answered the question with a full sentence.",
      cue: "Have the class read the answer sentence together.",
    },

    {
      ask: "Where do we start?",
      askLabel: "Your turn:",
      ref: 1,
      show: { kind: "columns", labels: true, rows: TRY_ROWS, context: "You try: 6,175 + 2,854" },
      say: "Your turn. Same steps, new numbers: 6,175 plus 2,854. The numbers are already lined up. Ask the class: where do we start?",
      cue: "Wait for: \"the ones\" / \"on the right\".",
    },

    {
      ref: 2,
      show: { kind: "columns", labels: true, rows: TRY_ROWS, focus: 0, result: "9",
              context: "You try: 6,175 + 2,854" },
      say: "We start with the ones. 5 plus 4 is 9. Write the 9.",
    },

    {
      ask: "What is 7 + 5?",
      askLabel: "Think:",
      ref: 3,
      show: { kind: "columns", labels: true, rows: TRY_ROWS, focus: 1, result: "9",
              context: "You try: 6,175 + 2,854" },
      say: "Now the tens. Ask the class: what is 7 plus 5?",
    },

    {
      ref: 3,
      show: { kind: "columns", labels: true, rows: TRY_ROWS, focus: 1, result: "29",
              carry: "  1  ",
              context: "You try: 6,175 + 2,854" },
      say: "7 plus 5 is 12. Too big for one column! Write the 2. Carry the 1 to the hundreds.",
      cue: "Point at the carry. Ask: why is there a little 1 up there?",
    },

    {
      ask: "What is 1 + 1 + 8?",
      askLabel: "You tell me:",
      ref: 4,
      show: { kind: "columns", labels: true, rows: TRY_ROWS, focus: 2, result: "29",
              carry: "  1  ",
              context: "You try: 6,175 + 2,854" },
      say: "The hundreds. Do not forget the carry. Ask the class: what is 1 plus 1 plus 8?",
    },

    {
      ref: 4,
      show: { kind: "columns", labels: true, rows: TRY_ROWS, focus: 2, result: "029",
              carry: "1 1  ",
              context: "You try: 6,175 + 2,854" },
      say: "1 plus 1 plus 8 is 10. Write the 0. Carry the 1 again, this time to the thousands.",
      cue: "Common mistake: skipping the carried 1. Slow down here.",
    },

    {
      ask: "What is 1 + 6 + 2?",
      askLabel: "Last one:",
      ref: 5,
      show: { kind: "columns", labels: true, rows: TRY_ROWS, focus: 3, result: "029",
              carry: "1 1  ",
              context: "You try: 6,175 + 2,854" },
      say: "Last column, the thousands. Ask the class: what is 1 plus 6 plus 2?",
    },

    {
      ref: 5,
      show: { kind: "columns", labels: true, rows: TRY_ROWS, focus: 3, result: "9,029",
              carry: "1 1  ", resultFinal: true,
              context: "You try: 6,175 + 2,854" },
      say: "1 plus 6 plus 2 is 9. Done! 6,175 plus 2,854 is 9,029.",
    },

    {
      show: { kind: "answer", text: "Great work! 6,175 + 2,854 = 9,029" },
      say: "Great work, everyone. You just added two big numbers.",
    },

    {
      show: { kind: "recap" },
      say: "Here is our recipe, all five steps. Any time you add big numbers, these same steps work. Line up. Start at the ones. Move left. Carry when you need to.",
      cue: "Leave this up. Students can copy the steps into their binders.",
    },
  ],
};

/* ============================================================
   LESSON: Subtracting Large Numbers (Columnar Subtraction)
   Source PDF: "Adding and Subtracting Large Numbers" (page 2)
   ============================================================ */

const SUB_ROWS = [{ t: "3,863" }, { t: "2,421", op: "−" }];
const SUBTRY = [{ t: "6,175" }, { t: "2,854", op: "−" }];
// after borrowing: cross out the 6 and the 1, write 5 and 11 above
const SUBTRY_B = [{ t: "6,175", strike: [0, 2] }, { t: "2,854", op: "−" }];
const B_ARR = ["5", "", "11", "", ""];

LESSONS["sub-large"] = {
  id: "sub-large",
  title: "Subtracting Large Numbers",
  beats: [

    {
      show: { kind: "title", kicker: "Operations", title: "Subtracting Large Numbers",
              goal: "We will subtract big numbers, one column at a time." },
      say: "Last time we added big numbers. Today we subtract them. Good news: it is the same plan. Line up the numbers. Start at the ones. Move left, one column at a time.",
    },

    {
      show: { kind: "story", text: "The park has 3,863 roses and 2,421 tulips. How many MORE roses are there than tulips?" },
      say: "Same park, same flowers. But now the question is different. How many MORE roses than tulips? 'How many more' means we subtract.",
      cue: "Ask: what words tell us to subtract? (\"how many more\")",
    },

    {
      step: "Line up the numbers. Big number on top.",
      show: { kind: "columns", labels: true, rows: SUB_ROWS,
              context: "3,863 roses − 2,421 tulips" },
      say: "Step one. Line up by place value, just like adding. One new rule: the bigger number goes on top. 3,863 is bigger, so it goes on top.",
      cue: "Check: which number is bigger? How do we know? (compare thousands first)",
    },

    {
      step: "Subtract the ones. Top digit too small? Borrow.",
      show: { kind: "columns", labels: true, rows: SUB_ROWS, focus: 0, result: "2",
              context: "3,863 roses − 2,421 tulips" },
      say: "Step two. Start at the ones, on the right. 3 take away 1 is 2. Write the 2. The card asks: is the top digit too small? Three is big enough, so we do not borrow. We check that every single column.",
    },

    {
      step: "Subtract the tens. Top digit too small? Borrow.",
      show: { kind: "columns", labels: true, rows: SUB_ROWS, focus: 1, result: "42",
              context: "3,863 roses − 2,421 tulips" },
      say: "Step three. The tens. 6 take away 2 is 4. Write the 4.",
    },

    {
      step: "Subtract the hundreds. Top digit too small? Borrow.",
      show: { kind: "columns", labels: true, rows: SUB_ROWS, focus: 2, result: "442",
              context: "3,863 roses − 2,421 tulips" },
      say: "Step four. The hundreds. 8 take away 4 is 4. Write the 4.",
    },

    {
      step: "Subtract the thousands. Top digit too small? Borrow.",
      show: { kind: "columns", labels: true, rows: SUB_ROWS, focus: 3, result: "1,442",
              resultFinal: true,
              context: "3,863 roses − 2,421 tulips" },
      say: "Step five. The thousands. 3 take away 2 is 1. Done. The answer is 1,442.",
    },

    {
      show: { kind: "answer", text: "There are 1,442 more roses than tulips." },
      say: "There are 1,442 more roses than tulips. Notice: that one went smoothly. Every top digit was big enough. But sometimes the top digit is too small. Let's learn what to do.",
    },

    {
      show: { kind: "note", title: "Borrowing",
              text: "If the top digit is too small, borrow 1 from the next column to the left. The next digit gets smaller by 1. Your digit gets 10 bigger." },
      say: "Here is the rule. If the top digit is too small, we borrow. We take 1 from the neighbor on the left. The neighbor goes down by 1. Our digit goes up by 10. You will see it in a moment.",
      cue: "This is the hard idea of the lesson. Read it twice. Slow is fine.",
    },

    {
      ask: "Where do we start?",
      askLabel: "Your turn:",
      ref: 1,
      show: { kind: "columns", labels: true, rows: SUBTRY, context: "You try: 6,175 − 2,854" },
      say: "Your turn. You know these numbers from last time! 6,175 take away 2,854. Ask the class: where do we start?",
      cue: "Wait for: \"the ones\" / \"on the right\".",
    },

    {
      ref: 2,
      show: { kind: "columns", labels: true, rows: SUBTRY, focus: 0, result: "1",
              context: "You try: 6,175 − 2,854" },
      say: "The ones. 5 take away 4 is 1. Write the 1.",
    },

    {
      ask: "Can we do 7 take away 5?",
      askLabel: "Think:",
      ref: 3,
      show: { kind: "columns", labels: true, rows: SUBTRY, focus: 1, result: "1",
              context: "You try: 6,175 − 2,854" },
      say: "The tens. Ask the class: can we do 7 take away 5? Is the top digit big enough?",
    },

    {
      ref: 3,
      show: { kind: "columns", labels: true, rows: SUBTRY, focus: 1, result: "21",
              context: "You try: 6,175 − 2,854" },
      say: "Yes. 7 is bigger than 5. 7 take away 5 is 2. Write the 2.",
    },

    {
      ask: "Can we do 1 take away 8?",
      askLabel: "Look closely:",
      ref: 4,
      show: { kind: "columns", labels: true, rows: SUBTRY, focus: 2, result: "21",
              context: "You try: 6,175 − 2,854" },
      say: "The hundreds. Ask the class: can we do 1 take away 8? Look closely at the top digit.",
      cue: "Wait for \"no\". Ask: why not? (1 is smaller than 8)",
    },

    {
      ref: 4,
      show: { kind: "columns", labels: true, rows: SUBTRY_B, borrow: B_ARR, focus: 2, result: "21",
              note: { title: "We borrowed!", text: "The 6 became 5. The 1 became 11." },
              context: "You try: 6,175 − 2,854" },
      say: "No. 1 is too small. So we borrow. We take 1 from the 6 thousands. The 6 becomes 5. The 1 becomes 11. Now we CAN subtract.",
      cue: "Point at the crossed-out digits. The number did not change, we just moved value over.",
    },

    {
      ref: 4,
      show: { kind: "columns", labels: true, rows: SUBTRY_B, borrow: B_ARR, focus: 2, result: "321",
              context: "You try: 6,175 − 2,854" },
      say: "11 take away 8 is 3. Write the 3.",
    },

    {
      ask: "What is 5 take away 2?",
      askLabel: "Last one:",
      ref: 5,
      show: { kind: "columns", labels: true, rows: SUBTRY_B, borrow: B_ARR, focus: 3, result: "321",
              context: "You try: 6,175 − 2,854" },
      say: "Last column, the thousands. Careful: the 6 is crossed out. It is a 5 now. Ask the class: what is 5 take away 2?",
      cue: "Common mistake: using the old 6 instead of the new 5.",
    },

    {
      ref: 5,
      show: { kind: "columns", labels: true, rows: SUBTRY_B, borrow: B_ARR, focus: 3, result: "3,321",
              resultFinal: true,
              context: "You try: 6,175 − 2,854" },
      say: "5 take away 2 is 3. Done! 6,175 take away 2,854 is 3,321.",
    },

    {
      show: { kind: "answer", text: "Great work! 6,175 − 2,854 = 3,321" },
      say: "Great work. You subtracted big numbers, and you borrowed like pros.",
    },

    {
      show: { kind: "recap" },
      say: "Here is our recipe. It is almost the same as adding. Line up, big number on top. Start at the ones. Move left. And if the top digit is too small, borrow from the neighbor.",
      cue: "Leave this up. Students can copy the steps into their binders.",
    },
  ],
};

/* ============================================================
   LESSON: Multiplying 2-Digit Numbers (Standard Algorithm)
   Source PDF: "Multiplying Two-Digit by Two-Digit Numbers"
   ============================================================ */

// 42 × 36 — column layout is 4 wide: "  42" / "  36" / " 252" / "1260" / "1512"
const M_ROWS       = [{ t: "42" }, { t: "36", op: "×" }];
const M_HL = (topCol, botCol) =>
  [{ t: "42", hl: topCol == null ? [] : [topCol] }, { t: "36", op: "×", hl: botCol == null ? [] : [botCol] }];
// You try: 21 × 34 — no carries while multiplying (a gentle first solo
// flight), though adding 84 + 630 does carry in the tens
const T_ROWS       = [{ t: "21" }, { t: "34", op: "×" }];
const T_HL = (topCol, botCol) =>
  [{ t: "21", hl: topCol == null ? [] : [topCol] }, { t: "34", op: "×", hl: botCol == null ? [] : [botCol] }];

LESSONS["mult-2x2"] = {
  id: "mult-2x2",
  title: "Multiplying 2-Digit Numbers",
  beats: [

    {
      show: { kind: "title", kicker: "Operations", title: "Multiplying 2-Digit Numbers",
              goal: "We will multiply two 2-digit numbers, one small step at a time." },
      say: "Today we multiply big numbers. Here is the secret: it is just times tables plus adding. You already know both. We will go one small step at a time.",
    },

    {
      show: { kind: "story", text: "There are 42 boxes of crayons. Each box has 36 crayons. How many crayons in all?" },
      say: "Here is our problem. 42 boxes. Each box has 36 crayons. 'Each' and 'in all' tell us to multiply. 42 times 36.",
      cue: "Ask: what word tells us to multiply? (\"each\")",
    },

    {
      step: "Line up the numbers.",
      show: { kind: "columns", rows: M_ROWS, context: "42 × 36" },
      say: "Step one. Write 42 on top and 36 under it, lined up on the right. The times sign goes on the left.",
    },

    {
      step: "Make a chart for each digit on the bottom.",
      show: { kind: "charts", factors: [6, 3], title: "Before you multiply",
              text: "The bottom number is 36. We will use the 6 and the 3, so build a chart for each one first." },
      say: "Before we multiply anything, we get our charts ready. Look at the bottom number, 36. We are going to use the 6 and we are going to use the 3. So we make a chart for the 6s and a chart for the 3s, exactly the way we did with the marks. Now every answer we need is already sitting in front of us.",
      cue: "Have them build these in their binders, or use the ones from the times table lesson. The point: never guess a fact mid-problem. Look it up.",
    },

    {
      step: "Multiply by the ones digit. More than 9? Carry.",
      show: { kind: "columns", rows: M_HL(3, 3), carry: "  1 ",
              work: [{ t: "   2" }], context: "42 × 36" },
      say: "Step two. We start with the ones digit of the bottom number. That is the 6. 6 times 2 is 12. Write the 2. Carry the 1, just like in adding.",
      cue: "Same carry idea as addition. Point at it.",
    },

    {
      ref: 3,
      show: { kind: "columns", rows: M_HL(2, 3), carry: "  1 ",
              work: [{ t: " 252" }], context: "42 × 36" },
      say: "Still the 6. 6 times 4 is 24. Add the carry: 24 plus 1 is 25. Write 25. Our first row is 252.",
    },

    {
      step: "Put a 0 to hold the ones place. Cross out the used carry.",
      show: { kind: "columns", rows: M_HL(null, 2), carry: "  1 ", carryStrike: [2],
              work: [{ t: " 252" }, { t: "   0", op: "+", red: [3] }], context: "42 × 36" },
      say: "Step three. Now we get ready for the 3. But look: the 3 is in the tens place. It is not really 3. It is 30. So before we multiply, we put a 0 in the ones place. That red zero holds the spot. And see the little 1 up top? It is crossed out now. We already used it. We do not use it again.",
      cue: "THE most-forgotten step in this whole binder. Make it a big deal. The crossed-out carry is the second thing to point at.",
    },

    {
      step: "Multiply by the tens digit. More than 9? Carry.",
      ask: "What is 3 × 2?",
      askLabel: "Think:",
      show: { kind: "columns", rows: M_HL(3, 2), carry: "  1 ", carryStrike: [2],
              work: [{ t: " 252" }, { t: "   0", op: "+", red: [3] }], context: "42 × 36" },
      say: "Step four. Multiply by the tens digit, the 3. Ask the class: what is 3 times 2?",
    },

    {
      ref: 5,
      show: { kind: "columns", rows: M_HL(3, 2), carry: "  1 ", carryStrike: [2],
              work: [{ t: " 252" }, { t: "  60", op: "+", red: [3] }], context: "42 × 36" },
      say: "3 times 2 is 6. Write the 6, right next to the zero. Six is not more than 9, so there is no carry this time.",
    },

    {
      ask: "What is 3 × 4?",
      askLabel: "You tell me:",
      ref: 5,
      show: { kind: "columns", rows: M_HL(2, 2), carry: "  1 ", carryStrike: [2],
              work: [{ t: " 252" }, { t: "  60", op: "+", red: [3] }], context: "42 × 36" },
      say: "Ask the class: what is 3 times 4?",
    },

    {
      ref: 5,
      show: { kind: "columns", rows: M_HL(2, 2), carry: "  1 ", carryStrike: [2],
              work: [{ t: " 252" }, { t: "1260", op: "+", red: [3] }], context: "42 × 36" },
      say: "3 times 4 is 12. Write 12. Second row done: 1260.",
    },

    {
      step: "Add the two rows. More than 9? Carry.",
      show: { kind: "columns", rows: M_ROWS, carry: "  1 ", carryStrike: [2],
              work: [{ t: " 252" }, { t: "1260", op: "+", red: [3] }],
              workCarry: " 1  ", result: "  12", context: "42 × 36" },
      say: "Step five, the last one. Add the two rows, just like we add any big numbers. Start at the ones: 2 plus 0 is 2. Now the tens: 5 plus 6 is 11. Is that more than 9? Yes. So we write the 1 and carry the 1 to the next column.",
      cue: "The carry rule again, this time inside a multiplication problem. Point at the new little 1 — it is a different carry from the crossed-out one on top.",
    },

    {
      ref: 6,
      show: { kind: "columns", rows: M_ROWS, carry: "  1 ", carryStrike: [2],
              work: [{ t: " 252" }, { t: "1260", op: "+", red: [3] }],
              workCarry: " 1  ", result: "1512", resultFinal: true, context: "42 × 36" },
      say: "Now the hundreds: 2 plus 2 is 4, plus the carry 1 makes 5. Then the thousands: nothing plus 1 is 1. Our answer is 1512.",
      cue: "Do not add the crossed-out 1 on top. It was used up long ago.",
    },

    {
      show: { kind: "answer", text: "There are 1,512 crayons in all." },
      say: "There are 1,512 crayons in all. One multiplication, five small steps.",
      cue: "Have the class read the answer sentence together.",
    },

    {
      ask: "Which two charts do we need?",
      askLabel: "Your turn:",
      ref: 2,
      show: { kind: "charts", factors: [4, 3], title: "You try: 21 \u00d7 34",
              text: "The bottom number is 34. Which two charts should we build before we start?" },
      say: "Your turn. 21 times 34. Before we multiply anything, what do we do first? Look at the bottom number. 34. So we need the 4s chart and the 3s chart. Here they are.",
      cue: "Wait for both. If they only say one, point at the other digit.",
    },

    {
      ask: "Which digit do we multiply by first?",
      askLabel: "Think:",
      ref: 3,
      show: { kind: "columns", rows: T_ROWS, context: "You try: 21 × 34" },
      say: "Charts ready. The numbers are lined up. Ask the class: which digit do we multiply by first?",
      cue: "Wait for: \"the 4\" / \"the ones digit of the bottom number\".",
    },

    {
      ref: 3,
      show: { kind: "columns", rows: T_HL(3, 3),
              work: [{ t: "   4" }], context: "You try: 21 × 34" },
      say: "The 4, the ones digit. 4 times 1 is 4. Write the 4. No carry this time.",
    },

    {
      ask: "What is 4 × 2?",
      askLabel: "Think:",
      ref: 3,
      show: { kind: "columns", rows: T_HL(2, 3),
              work: [{ t: "   4" }], context: "You try: 21 × 34" },
      say: "Ask the class: what is 4 times 2?",
    },

    {
      ref: 3,
      show: { kind: "columns", rows: T_HL(2, 3),
              work: [{ t: "  84" }], context: "You try: 21 × 34" },
      say: "4 times 2 is 8. Write the 8. First row done: 84.",
    },

    {
      ask: "Before we use the 3... what goes in the ones place?",
      askLabel: "Don't forget:",
      ref: 4,
      show: { kind: "columns", rows: T_HL(null, 2),
              work: [{ t: "  84" }], context: "You try: 21 × 34" },
      say: "Now the 3. But wait. Before we multiply by the 3, something goes in the ones place first. Ask the class: what is it?",
      cue: "Wait for: \"a zero!\" If nobody says it, point at the red zero from last time.",
    },

    {
      ref: 4,
      show: { kind: "columns", rows: T_HL(null, 2),
              work: [{ t: "  84" }, { t: "   0", op: "+", red: [3] }], context: "You try: 21 × 34" },
      say: "The zero! It holds the ones place, because the 3 really means 30.",
    },

    {
      ask: "What is 3 × 1?",
      askLabel: "You tell me:",
      ref: 5,
      show: { kind: "columns", rows: T_HL(3, 2),
              work: [{ t: "  84" }, { t: "   0", op: "+", red: [3] }], context: "You try: 21 × 34" },
      say: "Ask the class: what is 3 times 1?",
    },

    {
      ref: 5,
      show: { kind: "columns", rows: T_HL(3, 2),
              work: [{ t: "  84" }, { t: "  30", op: "+", red: [3] }], context: "You try: 21 × 34" },
      say: "3 times 1 is 3. Write the 3.",
    },

    {
      ask: "What is 3 × 2?",
      askLabel: "Try it:",
      ref: 5,
      show: { kind: "columns", rows: T_HL(2, 2),
              work: [{ t: "  84" }, { t: "  30", op: "+", red: [3] }], context: "You try: 21 × 34" },
      say: "Ask the class: what is 3 times 2?",
    },

    {
      ref: 5,
      show: { kind: "columns", rows: T_HL(2, 2),
              work: [{ t: "  84" }, { t: " 630", op: "+", red: [3] }], context: "You try: 21 × 34" },
      say: "3 times 2 is 6. Second row done: 630.",
    },

    {
      ask: "What is 84 + 630?",
      askLabel: "Last one:",
      ref: 6,
      show: { kind: "columns", rows: T_ROWS,
              work: [{ t: "  84" }, { t: " 630", op: "+", red: [3] }], context: "You try: 21 × 34" },
      say: "Last step. Add the rows. Ask the class: what is 84 plus 630? Add column by column, starting at the ones.",
      cue: "Column by column: ones 4+0=4, tens 8+3=11 (write 1, carry 1), hundreds 6+1=7. Answer: 714.",
    },

    {
      ref: 6,
      show: { kind: "columns", rows: T_ROWS,
              work: [{ t: "  84" }, { t: " 630", op: "+", red: [3] }],
              workCarry: " 1  ", result: "  14", context: "You try: 21 × 34" },
      say: "Start at the ones: 4 plus 0 is 4. Now the tens: 8 plus 3 is 11. More than 9! So we write the 1 and carry the 1 over to the hundreds.",
      cue: "The multiplying was carry-free, but the adding is not. This is the one carry in the whole problem — make sure they see it.",
    },

    {
      ref: 6,
      show: { kind: "columns", rows: T_ROWS,
              work: [{ t: "  84" }, { t: " 630", op: "+", red: [3] }],
              workCarry: " 1  ", result: " 714", resultFinal: true, context: "You try: 21 × 34" },
      say: "Now the hundreds: 6 plus the carry 1 is 7. Done! 21 times 34 is 714.",
    },

    {
      show: { kind: "answer", text: "Great work! 21 × 34 = 714" },
      say: "Great work. You just multiplied two 2-digit numbers all by yourselves.",
    },

    {
      show: { kind: "recap" },
      say: "Here is our recipe. Line up. Multiply by the ones digit. Put the zero. Multiply by the tens digit. Add the rows. Five steps, every single time.",
      cue: "Leave this up. Students can copy the steps into their binders.",
    },
  ],
};

/* ============================================================
   LESSON: Making a Times Table (tally-mark skip counting)
   Not from a PDF — Benjamin's classroom method, for students who
   do not have their multiplication facts memorised. Make one mark
   per unit, then tap the whole row over and over; every complete
   pass lands on the next multiple.
   ============================================================ */

LESSONS["times-table"] = {
  id: "times-table",
  title: "Making a Times Table",
  beats: [

    {
      show: { kind: "title", kicker: "Operations", title: "Making a Times Table",
              goal: "We will build the whole 8s chart by tapping and counting." },
      say: "Today we build a times table. Not remember one. Build one. If you do not know your 8s, that is fine. By the end you will have the whole chart, and you will be able to make one for any number you want.",
      cue: "Say the 'no memorising' part out loud. For a lot of these students that is the whole reason they shut down on multiplication.",
    },

    {
      show: { kind: "story", text: "What is 8 \u00d7 7? If you do not know it by heart, you can build it." },
      say: "Here is a question. 8 times 7. Some of you know it. Most of us do not. Either way, we have a way to get it every single time. We only need marks and counting, and you already know how to count.",
    },

    {
      step: "Make one mark for each.",
      show: { kind: "hashes", factor: 8, context: "Building the 8s" },
      say: "We are building the 8s. So we make eight marks. Count them with me. One, two, three, four, five, six, seven, eight. Eight marks. These marks do not change for the whole rest of the lesson.",
      cue: "Count the marks aloud together. Stress that the marks never change - only the counting moves.",
    },

    {
      step: "Start the chart at 0.",
      show: { kind: "hashes", factor: 8, filled: 0, context: "Building the 8s" },
      say: "Here is our chart. The top row is how many eights. The bottom row is the answer. We start at zero, because zero eights is nothing at all. Zero. We did not have to tap for that one.",
      cue: "Starting at 0 is what makes the finished chart usable for any single-digit multiplication. Worth one sentence.",
    },

    {
      step: "Tap every mark. Count out loud.",
      show: { kind: "hashes", factor: 8, pass: 1, filled: 1, context: "Building the 8s" },
      say: "Now we tap. Watch the screen and count with it. One, two, three, four, five, six, seven, eight. We tapped every mark and we landed on 8.",
      cue: "Tap your hand along with the screen. Slow and steady - the rhythm is what makes this stick. Hit 'Count again' if they need another go.",
    },

    {
      step: "Go again. Keep counting - never start over.",
      show: { kind: "hashes", factor: 8, pass: 2, filled: 2, context: "Building the 8s" },
      say: "Now the important part. We go back to the very first mark and tap all eight again. But we do not start over at one. We keep counting from where we stopped. Nine, ten, eleven, twelve, thirteen, fourteen, fifteen, sixteen. Two eights is 16.",
      cue: "THE mistake to watch for: restarting at one. If a student does, they land on 8 again instead of 16. Catch it right here.",
    },

    {
      ask: "Where will we land this time?",
      askLabel: "Think:",
      ref: 5,
      show: { kind: "hashes", factor: 8, pass: 3, filled: 3, context: "Building the 8s" },
      say: "Same thing again. Ask the class where we will land before we tap. Then count along. Seventeen all the way to twenty-four. Three eights is 24.",
    },

    {
      ref: 5,
      show: { kind: "hashes", factor: 8, pass: 4, filled: 4, context: "Building the 8s" },
      say: "Again. Twenty-five up to thirty-two. Four eights is 32.",
    },

    {
      ask: "Can you guess before we tap?",
      askLabel: "Your turn:",
      ref: 5,
      show: { kind: "hashes", factor: 8, pass: 5, filled: 5, context: "Building the 8s" },
      say: "Thirty-three up to forty. Five eights is 40. We are halfway.",
      cue: "Let the class carry the counting from here. You just watch for anyone restarting at one.",
    },

    {
      ref: 5,
      show: { kind: "hashes", factor: 8, pass: 6, filled: 6, context: "Building the 8s" },
      say: "Forty-one up to forty-eight. Six eights is 48.",
    },

    {
      ask: "What is 8 \u00d7 7?",
      askLabel: "Try it:",
      ref: 5,
      show: { kind: "hashes", factor: 8, pass: 7, filled: 7, context: "Building the 8s" },
      say: "Forty-nine up to fifty-six. Seven eights is 56. Look back at our question. 8 times 7. We just built the answer without knowing it by heart.",
      cue: "This is the payoff. Point back at the story card. Let it land before moving on.",
    },

    {
      ref: 5,
      show: { kind: "hashes", factor: 8, pass: 8, filled: 8, context: "Building the 8s" },
      say: "Fifty-seven up to sixty-four. Eight eights is 64.",
    },

    {
      ask: "Where do we land?",
      askLabel: "Last one:",
      ref: 5,
      show: { kind: "hashes", factor: 8, pass: 9, filled: 9, context: "Building the 8s" },
      say: "Sixty-five up to seventy-two. Nine eights is 72. And that is the whole chart.",
    },

    {
      show: { kind: "note", title: "Your chart is finished",
              text: "You can now multiply anything by 8. Find the top number, look under it, and there is your answer." },
      say: "Look at what you built. Any time somebody asks you an 8 times something, you find the number on the top row, look straight down, and the answer is sitting there. That is why we go all the way to nine.",
      cue: "Have them copy this chart into their binder. This is the artifact they keep.",
    },

    /* ---------- you try: the 4s ---------- */

    {
      ask: "How many marks do the 4s need?",
      askLabel: "Your turn:",
      ref: 1,
      show: { kind: "hashes", factor: 4, context: "You try: the 4s" },
      say: "Your turn. We are building the 4s. Ask the class: how many marks do we need?",
      cue: "Answer: four. If someone says eight they are copying the last problem - go back to step 1 together.",
    },

    {
      ask: "What goes in the first box?",
      askLabel: "Think:",
      ref: 2,
      show: { kind: "hashes", factor: 4, filled: 0, context: "You try: the 4s" },
      say: "Four marks. Now the chart. Ask the class what goes in the very first box. Zero fours is zero.",
    },

    {
      ref: 3,
      show: { kind: "hashes", factor: 4, pass: 1, filled: 1, context: "You try: the 4s" },
      say: "Tap all four and count. One, two, three, four. One four is 4.",
    },

    {
      ask: "Do we start over at one?",
      askLabel: "Careful:",
      ref: 4,
      show: { kind: "hashes", factor: 4, pass: 2, filled: 2, context: "You try: the 4s" },
      say: "Now we go again. Ask the class: do we start over at one? No. We keep counting. Five, six, seven, eight. Two fours is 8.",
      cue: "Wait for a 'no'. This is the one thing that makes the whole method work.",
    },

    {
      ref: 4,
      show: { kind: "hashes", factor: 4, pass: 3, filled: 3, context: "You try: the 4s" },
      say: "Nine, ten, eleven, twelve. Three fours is 12.",
    },

    {
      ref: 4,
      show: { kind: "hashes", factor: 4, pass: 4, filled: 4, context: "You try: the 4s" },
      say: "Thirteen up to sixteen. Four fours is 16.",
    },

    {
      ask: "Where now?",
      askLabel: "You tell me:",
      ref: 4,
      show: { kind: "hashes", factor: 4, pass: 5, filled: 5, context: "You try: the 4s" },
      say: "Seventeen up to twenty. Five fours is 20.",
    },

    {
      ref: 4,
      show: { kind: "hashes", factor: 4, pass: 6, filled: 6, context: "You try: the 4s" },
      say: "Twenty-one up to twenty-four. Six fours is 24.",
    },

    {
      ref: 4,
      show: { kind: "hashes", factor: 4, pass: 7, filled: 7, context: "You try: the 4s" },
      say: "Twenty-five up to twenty-eight. Seven fours is 28.",
    },

    {
      ref: 4,
      show: { kind: "hashes", factor: 4, pass: 8, filled: 8, context: "You try: the 4s" },
      say: "Twenty-nine up to thirty-two. Eight fours is 32.",
    },

    {
      ask: "What is 9 \u00d7 4?",
      askLabel: "Last one:",
      ref: 4,
      show: { kind: "hashes", factor: 4, pass: 9, filled: 9, context: "You try: the 4s" },
      say: "Thirty-three up to thirty-six. Nine fours is 36. Your 4s chart is done.",
    },

    {
      show: { kind: "answer", text: "You can build a chart for any number you need." },
      say: "That is the whole trick. Marks, tapping, counting, and a chart that starts at zero and stops at nine. If you ever forget a fact, you do not have to panic. You can build it.",
      cue: "Worth saying twice for the students who freeze on multiplication.",
    },

    {
      show: { kind: "recap" },
      say: "Here is our recipe. Make the marks. Start the chart at zero. Tap them all and count. Go again and keep counting. Five steps, any times table.",
      cue: "Leave this up. This is the one to copy into the binder.",
    },
  ],
};

/* ============================================================
   LESSON: Everything Is Counting (the 0-81 idea)
   Benjamin's framing lesson. No procedure — it makes one claim and
   then proves it on problems from the rest of the binder: the answers
   get big, but the facts never do. 9 x 9 = 81 is the ceiling, and any
   fact under it can be reached by counting.
   ============================================================ */

LESSONS["counting-81"] = {
  id: "counting-81",
  title: "Everything Is Counting",
  beats: [

    {
      show: { kind: "title", kicker: "Operations", title: "Everything Is Counting",
              goal: "Every big problem is made of small counts. You can already do all of them." },
      say: "Today we are not learning a new way to do math. Today I am going to show you something about all of it. Every problem in this whole binder is made out of one thing you can already do.",
      cue: "This lesson has no procedure. It is a promise. Slow down and let them look.",
    },

    {
      show: { kind: "answer", text: "1,512" },
      say: "Here is a number. One thousand, five hundred and twelve. This is a real answer to a real problem we will do together later.",
    },

    {
      ask: "Could you count all the way to 1,512?",
      askLabel: "Think:",
      show: { kind: "answer", text: "1,512" },
      say: "Ask the class: could you count all the way up to 1,512? Out loud? Right now?",
      cue: "Let them say no. Somebody will say it would take forever. They are right.",
    },

    {
      step: "The answers can be big.",
      show: { kind: "columns", rows: [{ t: "42" }, { t: "36", op: "×" }],
              work: [{ t: " 252" }, { t: "1260", op: "+" }],
              result: "1512", resultFinal: true, context: "42 × 36" },
      say: "You will never have to. Here is where that 1,512 came from. 42 times 36. It looks like a lot. But watch what it is actually made of.",
    },

    {
      step: "The facts are never big.",
      show: { kind: "note", title: "Every count inside 42 × 36",
              text: "6 × 2 &nbsp; 6 × 4 &nbsp; 3 × 2 &nbsp; 3 × 4 &nbsp; then a little adding. That is the whole problem." },
      say: "Six times two. Six times four. Three times two. Three times four. And then some adding. That is it. That is every piece of it. Not one of those is big. You could count to any of them today.",
      cue: "Point at each pair on the problem as you say it. They need to see the small facts living inside the big one.",
    },

    {
      ask: "What is the biggest times fact there is?",
      askLabel: "You tell me:",
      show: { kind: "grid" },
      say: "Here is every multiplication fact that exists. All of them. One times one in the corner, all the way across and down. Ask the class: which one is the biggest?",
      cue: "Let them hunt for it. The bottom right corner.",
    },

    {
      step: "The biggest fact of all is 9 × 9 = 81.",
      show: { kind: "grid", mark: [9, 9] },
      say: "Nine times nine is 81. That is the biggest one. There is nothing past it. Every single multiplication fact in the world is inside this box, and the whole box stops at 81.",
    },

    {
      show: { kind: "note", title: "And the rest are smaller",
              text: "The biggest add is 9 + 9 = 18. The biggest take away is 18 − 9. Multiplying tops out at 81." },
      say: "Adding is even smaller. The biggest add you will ever do in a column is nine plus nine, which is 18. Taking away never goes past 18 either. Only multiplying reaches 81.",
    },

    {
      step: "If you can count to 81, you can do all of it.",
      show: { kind: "answer", text: "0 to 81 is the whole job." },
      say: "So here is the promise. If you can count from zero to 81, you have everything you need to add, take away, and multiply any numbers anybody ever hands you. Not most of them. Any of them.",
      cue: "This is the sentence to repeat. Say it twice.",
    },

    {
      ask: "Can you count to 81?",
      askLabel: "Your turn:",
      ref: 4,
      show: { kind: "answer", text: "0 to 81 is the whole job." },
      say: "Ask the class: can you count to 81? Yes you can. You have been able to for years. Nobody has to memorise anything.",
      cue: "If anyone hesitates, remind them we can make marks and tap. Counting is allowed to be slow.",
    },

    {
      show: { kind: "note", title: "What about dividing?",
              text: "Dividing by a small number is the same counting, backwards. Big dividers are a lesson for later." },
      say: "Dividing works this way too, as long as the number we are dividing by is small. It is the same counting, just backwards. When the dividing number gets big we will need one more trick, and we will learn it later.",
      cue: "Being straight about this matters. Do not oversell it and lose them when division gets hard.",
    },

    {
      show: { kind: "answer", text: "The answers get big. The facts never do." },
      say: "Remember this one line. The answers get big. The facts never do. Everything else in this binder is just knowing where to write things down.",
      cue: "This is the line to put on the wall.",
    },

    {
      show: { kind: "recap" },
      say: "Here is what we learned. The answers can be big. The facts are never big. The biggest fact of all is nine times nine, 81. And if you can count to 81, you can do all of it. We are going to prove this, one lesson at a time.",
      cue: "Copy this into the binder. Come back to it any time somebody says they cannot do math.",
    },
  ],
};

/* ============================================================
   LESSON: Adding with Your Fingers (facts to 18)
   Benjamin's classroom method. Start at the LARGER number and count
   up the smaller one on your fingers. Starting at the larger number
   is the whole efficiency of it — fewer counts, fewer mistakes.
   ============================================================ */

LESSONS["add-facts"] = {
  id: "add-facts",
  title: "Adding with Your Fingers",
  beats: [

    {
      show: { kind: "title", kicker: "Operations", title: "Adding with Your Fingers",
              goal: "Add any two small numbers using nothing but counting." },
      say: "Today we add small numbers. You do not have to remember any of these. You have ten fingers and you can count. That is everything you need.",
      cue: "Nobody gets told to memorise anything in this lesson. Say that up front.",
    },

    {
      show: { kind: "story", text: "Maria has 3 stickers. Ben has 8 stickers. How many in all?" },
      say: "Maria has 3 stickers. Ben has 8 stickers. How many stickers in all? 'In all' tells us to add. So we need 3 plus 8.",
      cue: "Ask what words tell us to add. (\"in all\")",
    },

    {
      ask: "Which number is bigger?",
      askLabel: "Think:",
      step: "Start with the bigger number.",
      show: { kind: "fingers", label: "3 + 8", start: 0, up: 0 },
      say: "Here is our problem. 3 plus 8. Before we count anything, we find the bigger number. Ask the class: which one is bigger, the 3 or the 8?",
      cue: "Wait for 8. This step is the whole trick and it is easy to skip past.",
    },

    {
      ref: 1,
      show: { kind: "fingers", label: "Start at 8. Count up 3.", start: 8, up: 0 },
      say: "Eight is bigger. So we start at 8. We do not start at 3. Starting at the bigger number means less counting, and less counting means fewer mistakes.",
      cue: "If a student starts at 3 they still get 11, just slower with more chances to slip. Worth showing them once.",
    },

    {
      step: "Count up the smaller number on your fingers.",
      show: { kind: "fingers", label: "Start at 8. Count up 3.", start: 8, up: 3,
              emphasis: "count" },
      say: "Now we count up 3, because 3 was the smaller number. One finger for each. Nine. Ten. Eleven. Three fingers, three counts. Then we stop.",
      cue: "Count out loud with the screen and hold up your own fingers. The fingers are what tells you when to stop.",
    },

    {
      step: "Where you land is the answer.",
      show: { kind: "fingers", label: "Start at 8. Count up 3.", start: 8, up: 3,
              emphasis: "count", answer: "3 + 8 = 11" },
      say: "We landed on 11. So 3 plus 8 is 11. Maria and Ben have 11 stickers in all.",
    },

    {
      show: { kind: "note", title: "Why the bigger one first?",
              text: "Starting at 8 took 3 counts. Starting at 3 would take 8 counts. Same answer, three times the work." },
      say: "Look at why we started at the 8. Starting at 8 we counted three times. If we had started at the 3 we would have had to count eight times. Same answer. A lot more chances to get lost.",
    },

    /* ---------- second worked example ---------- */

    {
      ask: "Where do we start?",
      askLabel: "You tell me:",
      ref: 1,
      show: { kind: "fingers", label: "9 + 4", start: 0, up: 0 },
      say: "Another one. 9 plus 4. Ask the class: where do we start?",
      cue: "Answer: at 9. This time the bigger number is already first — they still have to check.",
    },

    {
      ref: 2,
      show: { kind: "fingers", label: "Start at 9. Count up 4.", start: 9, up: 4,
              emphasis: "count" },
      say: "Start at 9, count up 4. Ten. Eleven. Twelve. Thirteen. Four fingers up, and we stop.",
    },

    {
      ref: 3,
      show: { kind: "fingers", label: "Start at 9. Count up 4.", start: 9, up: 4,
              emphasis: "count", answer: "9 + 4 = 13" },
      say: "Thirteen. 9 plus 4 is 13.",
    },

    /* ---------- third worked example: the count runs off one hand ---------- */

    {
      ask: "Where do we start?",
      askLabel: "Next one:",
      ref: 1,
      show: { kind: "fingers", label: "7 + 9", start: 0, up: 0 },
      say: "Here is a bigger one. 7 plus 9. Where do we start?",
      cue: "Answer: at 9. Then ask how many counts. Seven. Let them notice that is more than one hand before you show it.",
    },

    {
      ref: 2,
      show: { kind: "fingers", label: "Start at 9. Count up 7.", start: 9, up: 5 },
      say: "Start at 9. Ten. Eleven. Twelve. Thirteen. Fourteen. Stop. That is one whole hand, thumb and all. But we only counted five, and we need seven. We are not finished.",
      cue: "Hold up your own full hand and freeze. Let the class feel that running out of fingers is not the same as being done.",
    },

    {
      ref: 2,
      show: { kind: "fingers", label: "Start at 9. Count up 7.", start: 9, up: 7,
              emphasis: "count" },
      say: "So we keep going on the other hand. We do not start over, and we do not go back to one. Fifteen. Sixteen. Now seven fingers are up, and seven is what we needed.",
      cue: "The mistake to watch for is a student restarting the count at one on the second hand.",
    },

    {
      ref: 3,
      show: { kind: "fingers", label: "Start at 9. Count up 7.", start: 9, up: 7,
              emphasis: "count", answer: "7 + 9 = 16" },
      say: "Sixteen. 7 plus 9 is 16. Same three steps as the small ones.",
    },

    {
      show: { kind: "note", title: "When one hand runs out",
              text: "Keep counting on the other hand. Never start over at one. Ten fingers is one long count, not two short ones." },
      say: "Write this one down. When a hand runs out, the other hand carries on the same count. Your two hands are one row of ten, not two rows of five.",
      cue: "Copy into the binder. This is the piece that breaks most kids on the bigger facts.",
    },

    /* ---------- you try ---------- */

    {
      ask: "Which number do we start at?",
      askLabel: "Your turn:",
      ref: 1,
      show: { kind: "fingers", label: "6 + 9", start: 0, up: 0 },
      say: "Your turn. 6 plus 9. Ask the class: which number do we start at?",
      cue: "Answer: 9. If someone says 6, ask which one is bigger. Do not just correct it.",
    },

    {
      ask: "How many fingers go up?",
      askLabel: "Think:",
      ref: 2,
      show: { kind: "fingers", label: "Start at 9. Count up 6.", start: 9, up: 0 },
      say: "We start at 9. Ask the class: how many fingers go up? Six, because 6 is the number we have left.",
    },

    {
      ref: 2,
      show: { kind: "fingers", label: "Start at 9. Count up 6.", start: 9, up: 6,
              emphasis: "count" },
      say: "Count with me. Ten. Eleven. Twelve. Thirteen. Fourteen — that hand is full — Fifteen on the other hand. Six fingers.",
    },

    {
      ask: "What is 6 + 9?",
      askLabel: "Last one:",
      ref: 3,
      show: { kind: "fingers", label: "Start at 9. Count up 6.", start: 9, up: 6,
              emphasis: "count", answer: "6 + 9 = 15" },
      say: "Fifteen. 6 plus 9 is 15. You did that with counting and nothing else.",
    },

    {
      ask: "How many fingers for 9 + 9?",
      askLabel: "Biggest one:",
      show: { kind: "fingers", label: "9 + 9", start: 9, up: 0 },
      say: "One more. 9 plus 9. Both numbers are the same, so we start at 9 either way. How many fingers go up?",
      cue: "Answer: nine. Ask whether they will run out. They will not, and that is the point.",
    },

    {
      show: { kind: "fingers", label: "Start at 9. Count up 9.", start: 9, up: 9,
              emphasis: "count", answer: "9 + 9 = 18" },
      say: "Ten, eleven, twelve, thirteen, fourteen, and on to the other hand, fifteen, sixteen, seventeen, eighteen. Nine fingers up. One finger left over.",
      cue: "Point at the finger that is still down. That spare finger is the proof for the next line.",
    },

    {
      show: { kind: "answer", text: "Two hands is enough for every one of these." },
      say: "The biggest add you will ever do this way is nine plus nine. That is nine counts, and you have ten fingers. Your hands are always big enough.",
      cue: "Tie this back to the counting lesson if you taught it.",
    },

    {
      show: { kind: "recap" },
      say: "Here is our recipe. Start with the bigger number. Count up the smaller number on your fingers. Where you land is the answer. Three steps, every time.",
      cue: "Copy into the binder. This one gets used in every column of every addition problem from here on.",
    },
  ],
};

/* ============================================================
   LESSON: Subtracting by Counting Up (facts to 18)
   Same fingers, same counting, same direction as adding — the only
   difference is what you read at the end. Adding: watch where you
   land. Subtracting: watch how many fingers are up. The lesson opens
   by calling back to [add-facts] on purpose.
   ============================================================ */

LESSONS["sub-facts"] = {
  id: "sub-facts",
  title: "Subtracting by Counting Up",
  beats: [

    {
      show: { kind: "title", kicker: "Operations", title: "Subtracting by Counting Up",
              goal: "Take away small numbers without ever counting backwards." },
      say: "Today we take numbers away. Here is the good news before we start: we are not going to learn anything new. We are going to use the exact same fingers and the exact same counting we used for adding. Forwards, not backwards.",
      cue: "They expect subtraction to be harder than adding. Undo that expectation in the first thirty seconds.",
    },

    {
      show: { kind: "note", title: "Remember adding?",
              text: "Bigger number first, count up on your fingers, and the number you land on is the answer." },
      say: "Remember what we did to add. We started at the bigger number, we counted up on our fingers, and wherever we landed was our answer. Every single piece of that comes back today. Only one thing changes.",
      cue: "If they did the adding lesson, have them say the three steps back to you before moving on.",
    },

    {
      show: { kind: "story", text: "There were 13 cookies. 8 got eaten. How many are left?" },
      say: "There were 13 cookies. Eight of them got eaten. How many are left? 'How many are left' tells us to take away. 13 take away 8.",
      cue: "Ask what words tell us to subtract. (\"how many are left\")",
    },

    {
      ask: "Do we have to count backwards?",
      askLabel: "Think:",
      show: { kind: "fingers", label: "13 − 8", start: 0, up: 0 },
      say: "Ask the class: to take 8 away from 13, do we have to count backwards? Most people think so. We do not. Counting backwards is hard and it is where mistakes come from.",
      cue: "Let them say yes. Then tell them no. That surprise is worth having.",
    },

    {
      step: "Start at the smaller number.",
      show: { kind: "fingers", label: "Start at 8.", start: 8, up: 0 },
      say: "We start at the smaller number, the 8. Not the 13. The small one.",
      cue: "This is backwards from the adding lesson, where we started at the bigger number. Name that out loud so it does not confuse them.",
    },

    {
      step: "Count up to the bigger number.",
      show: { kind: "fingers", label: "Start at 8. Count up to 13.", start: 8, up: 5,
              emphasis: "fingers" },
      say: "Now we count up until we reach 13. Nine. Ten. Eleven. Twelve. Thirteen. Stop. We got to 13, so we stop counting.",
      cue: "The bigger number tells you when to stop, the same way the smaller number did when we were adding.",
    },

    {
      step: "Your fingers are the answer.",
      show: { kind: "fingers", label: "Start at 8. Count up to 13.", start: 8, up: 5,
              emphasis: "fingers", answer: "13 − 8 = 5" },
      say: "Now look at your hand. Not at the numbers. At your fingers. Five fingers are up. Five is the answer. 13 take away 8 is 5. There are five cookies left.",
      cue: "Make them physically look at their own hand here. This is the moment the whole method lives or dies.",
    },

    {
      show: { kind: "note", title: "The only difference",
              text: "Adding: watch where you land. Subtracting: watch your fingers. Same counting, either way." },
      say: "That is the only thing that changed. When we add, we look at the number we land on. When we take away, we look at how many fingers went up. Same hands. Same counting. Same direction. You just look somewhere else at the end.",
      cue: "This card is the point of the lesson. Leave it up an extra beat.",
    },

    {
      show: { kind: "answer", text: "8 + 5 = 13, so 13 − 8 = 5." },
      say: "And here is why it works. We counted from 8 up to 13 and it took 5. That means 8 plus 5 is 13. So 13 take away 8 has to be 5. Adding and taking away are the same counting, just asked in a different order.",
      cue: "For students who are ready, this is the big idea. For the rest, the fingers still work. Do not get stuck here.",
    },

    /* ---------- second worked example ---------- */

    {
      ask: "Where do we start?",
      askLabel: "You tell me:",
      ref: 1,
      show: { kind: "fingers", label: "15 − 9", start: 0, up: 0 },
      say: "Another one. 15 take away 9. Ask the class: where do we start?",
      cue: "Answer: at 9, the smaller one. If they say 15, remind them we count up, so we start low.",
    },

    {
      ref: 2,
      show: { kind: "fingers", label: "Start at 9. Count up to 15.", start: 9, up: 6,
              emphasis: "fingers" },
      say: "Start at 9. Count up to 15. Ten, eleven, twelve, thirteen, fourteen, fifteen. Stop, we are at 15.",
    },

    {
      ask: "How many fingers are up?",
      askLabel: "Try it:",
      ref: 3,
      show: { kind: "fingers", label: "Start at 9. Count up to 15.", start: 9, up: 6,
              emphasis: "fingers", answer: "15 − 9 = 6" },
      say: "Ask the class: how many fingers are up? Six. So 15 take away 9 is 6.",
    },

    /* ---------- you try ---------- */

    {
      ask: "Which number do we start at?",
      askLabel: "Your turn:",
      ref: 1,
      show: { kind: "fingers", label: "12 − 7", start: 0, up: 0 },
      say: "Your turn. 12 take away 7. Ask the class: which number do we start at?",
      cue: "Answer: 7. Watch for anyone starting at 12 out of habit from the adding lesson.",
    },

    {
      ask: "What number tells us to stop?",
      askLabel: "Think:",
      ref: 2,
      show: { kind: "fingers", label: "Start at 7. Count up to 12.", start: 7, up: 0 },
      say: "We start at 7. Ask the class: what number tells us when to stop? Twelve, the bigger one.",
    },

    {
      ref: 2,
      show: { kind: "fingers", label: "Start at 7. Count up to 12.", start: 7, up: 5,
              emphasis: "fingers" },
      say: "Count with me. Eight. Nine. Ten. Eleven. Twelve. Stop.",
    },

    {
      ask: "What is 12 − 7?",
      askLabel: "Last one:",
      ref: 3,
      show: { kind: "fingers", label: "Start at 7. Count up to 12.", start: 7, up: 5,
              emphasis: "fingers", answer: "12 − 7 = 5" },
      say: "Look at your fingers. Five are up. 12 take away 7 is 5. You never once counted backwards.",
    },

    {
      ask: "Which number do we start at?",
      askLabel: "Biggest one:",
      ref: 1,
      show: { kind: "fingers", label: "17 \u2212 8", start: 0, up: 0 },
      say: "One more, and it is the biggest one we will ever do. 17 take away 8. Which number do we start at?",
      cue: "Answer: 8. This one runs past a whole hand, so slow it down.",
    },

    {
      ref: 2,
      show: { kind: "fingers", label: "Start at 8. Count up to 17.", start: 8, up: 5,
              emphasis: "fingers" },
      say: "Start at 8. Nine. Ten. Eleven. Twelve. Thirteen. That hand is full and we are not at 17 yet. We do not stop, and we do not start over.",
      cue: "Freeze on the full hand. Same rule as the adding lesson: the other hand carries on the same count.",
    },

    {
      ref: 2,
      show: { kind: "fingers", label: "Start at 8. Count up to 17.", start: 8, up: 9,
              emphasis: "fingers" },
      say: "Keep going on the other hand. Fourteen. Fifteen. Sixteen. Seventeen. Stop, we are at 17.",
    },

    {
      ask: "How many fingers are up?",
      askLabel: "Read your hands:",
      ref: 3,
      show: { kind: "fingers", label: "Start at 8. Count up to 17.", start: 8, up: 9,
              emphasis: "fingers", answer: "17 \u2212 8 = 9" },
      say: "Count the fingers that are up. Nine. So 17 take away 8 is 9. One finger still down, and two hands were plenty.",
      cue: "Point at the finger still down. Nothing in this lesson needs more fingers than you have.",
    },

    {
      show: { kind: "answer", text: "You never have to count backwards again." },
      say: "That is the whole lesson. Start small, count up to the big one, and read your fingers. Taking away is not harder than adding. It is the same thing.",
    },

    {
      show: { kind: "recap" },
      say: "Here is our recipe. Start at the smaller number. Count up to the bigger number. Your fingers are the answer. Three steps, and they are almost the same three steps we use for adding.",
      cue: "Put this next to the adding recipe in the binder so they can see how alike they are.",
    },
  ],
};

/* ============================================================
   LESSON: Place Value
   Source PDF: "Place Value"
   Ones through thousands only. The PDF's chart runs out to millions, but
   four places is what every column algorithm in this binder actually needs,
   and four big cells read from the back of the room. Millions gets one
   sentence at the end so nobody thinks the chart stops there.
   The numbers are 3,863 and 2,421 on purpose — they are the same numbers
   the Adding Large Numbers lesson uses, so that lesson opens on a picture
   the class has already met.
   Note: the source slide says every place gets ten times bigger "as you move
   to the right." That is backwards — its own arrows point left. Taught here
   the correct way round.
   ============================================================ */

LESSONS["place-value"] = {
  id: "place-value",
  title: "Place Value",
  beats: [

    {
      show: { kind: "title", kicker: "Number Sense", title: "Place Value",
              goal: "We will find out what each digit in a number is really worth." },
      say: "Today we are looking at what the digits in a number are actually worth. This is the lesson underneath every other lesson. Once you have this, adding and subtracting big numbers stop being confusing.",
    },

    {
      show: { kind: "story", text: "Two 3s. 3,863. Is one 3 worth more than the other?" },
      say: "Look at this number. Three thousand, eight hundred sixty-three. There are two 3s in it. Here is the question for today: is one of those 3s worth more than the other one?",
      cue: "Take a vote before you go on. Most classes split, and that is a good place to start from.",
    },

    {
      show: { kind: "note", title: "Three words", text: "A <b>digit</b> is one symbol: 0 1 2 3 4 5 6 7 8 9.<br>Its <b>place value</b> is where it sits in the number.<br>Its <b>value</b> is what it is actually worth." },
      say: "Three words we will use all lesson. A digit is just one symbol — zero through nine, that is all of them. Place value means where the digit sits. And value means what that digit is actually worth, once you know where it is sitting.",
      cue: "Say all three out loud together. They sound alike and students mix them up.",
    },

    {
      step: "Every place has a name. Ones on the right.",
      show: { kind: "pvchart", places: 4, reveal: true },
      say: "Here is a place value chart. Four columns, and each one has a name. Ones on the right. Then tens. Then hundreds. Then thousands, on the left. Always read the names from the right.",
      cue: "Point right to left as you name them. Right to left, every time.",
    },

    {
      step: "Write the number in, one digit per box.",
      show: { kind: "pvchart", places: 4, digits: "3863", caption: "3,863" },
      say: "Now we drop our number in. One digit in each box. 3 in the thousands. 8 in the hundreds. 6 in the tens. 3 in the ones. Notice that the digits stayed in exactly the same order — the chart just told us the name of each seat.",
    },

    {
      ask: "Which 3 is bigger?",
      askLabel: "Think:",
      show: { kind: "pvchart", places: 4, digits: "3863", caption: "3,863", focus: 0 },
      say: "Back to our question. Let us take the 3 on the right first, the one sitting in the ones. Ask the class what that 3 is worth.",
      cue: "Wait for an answer before clicking. This is the beat the whole lesson turns on.",
    },

    {
      step: "Name the digit, its place, and its value.",
      show: { kind: "pvchart", places: 4, digits: "3863", caption: "3,863", focus: 0,
              callouts: ["digit", "place", "value"] },
      say: "The digit is 3. Its place value is ones. And its value is 3. Three ones is just three. That one is easy.",
    },

    {
      show: { kind: "pvchart", places: 4, digits: "3863", caption: "3,863", focus: 3,
              callouts: ["digit", "place"] },
      say: "Now the other 3, over on the left. Same digit — still a 3. But its place value is thousands, not ones. So what is it worth?",
      cue: "Pause here. Let them say the number before you show it.",
    },

    {
      show: { kind: "pvchart", places: 4, digits: "3863", caption: "3,863", focus: 3,
              callouts: ["digit", "place", "value"] },
      say: "Three thousand. The same digit, three, is worth three thousand over here and worth three over there. Nothing about the digit changed. Only where it was sitting changed. That is place value.",
      cue: "Flip back one beat and forward again so they see the two 3s side by side.",
    },

    {
      show: { kind: "answer", text: "Same digit. Different seat. Different value." },
      say: "Same digit, different seat, different value. If you remember one sentence from today, make it that one.",
    },

    {
      show: { kind: "blocks", digits: "3863", caption: "3,863 in blocks", rows: 1 },
      say: "Let us stop talking about digits for a second and count something. Our number was 3,863. The 3 in the thousands means three of these. Each one is a cube built out of a thousand little squares. Not three squares. Three thousands.",
      cue: "Let them look at the cube. Every little square in it is a one.",
    },

    {
      show: { kind: "blocks", digits: "3863", caption: "3,863 in blocks", rows: 3 },
      say: "The 8 in the hundreds means eight flat squares, and each one of those is a hundred little squares. The 6 in the tens means six sticks, and each stick is ten. Each row is one seat in the chart, and each row is worth exactly what that seat is worth.",
      cue: "If anyone doubts a flat is a hundred, let them count it. Ten across, ten down.",
    },

    {
      show: { kind: "blocks", digits: "3863", caption: "3,863 in blocks", rows: 4, total: true },
      say: "And the 3 in the ones means three little squares. Now look at the top row and the bottom row. Both of them say three. Three up here, three down there. Same digit. Look at how much bigger the top row is. That is place value, and it is the difference between three and three thousand.",
      cue: "This is the beat to stop on. Point at the top row, then the bottom row, and wait.",
    },

    {
      step: "Each place to the left is 10 times bigger.",
      show: { kind: "pvchart", places: 4, worth: true, times10: true },
      say: "Here is why the seats are worth what they are worth. One box is worth one. Move one step left and it is worth ten. Ten times bigger. Step left again, a hundred. Again, a thousand. Every single step to the left multiplies by ten. That is what base ten means.",
      cue: "The binder PDF says this the other way round. Left is bigger. Its own arrows agree with us.",
    },

    {
      ask: "So what comes after thousands?",
      askLabel: "Think:",
      show: { kind: "pvchart", places: 4, worth: true, times10: true },
      say: "So if every step left is ten times bigger, ask the class: what is the next seat past thousands? Ten thousands. Then hundred thousands, then millions. The chart never stops. We only need these four today.",
    },

    {
      show: { kind: "pvchart", places: 4, digits: "...3", focus: 0, callouts: ["value"] },
      say: "Let me show you that ten times rule with one digit. Here is a single 3, sitting in the ones. It is worth three. Watch what happens when I move it one seat to the left. Nothing about the 3 changes. It is the same 3.",
      cue: "Keep clicking through the next three beats without stopping. It reads as one movement.",
    },

    {
      show: { kind: "pvchart", places: 4, digits: "..3.", focus: 1, callouts: ["value"], walked: true },
      say: "One seat left. Now it is worth thirty. Ten times bigger.",
    },

    {
      show: { kind: "pvchart", places: 4, digits: ".3..", focus: 2, callouts: ["value"], walked: true },
      say: "One more seat left. Three hundred. Ten times bigger again.",
    },

    {
      show: { kind: "pvchart", places: 4, digits: "3...", focus: 3, callouts: ["value"], walked: true,
              verdict: "The same 3, four times:  3  \u2192  30  \u2192  300  \u2192  3,000" },
      say: "And one more. Three thousand. It is the same 3 it always was. I never changed the digit. All I did was move it, and moving it left one seat made it worth ten times more, every single time. That is the whole idea.",
      cue: "Click back through all four if they want to see it again. It is worth the second pass.",
    },

    {
      ask: "What is the 0 doing in this number?",
      askLabel: "Think:",
      show: { kind: "pvchart", places: 4, digits: "3805", caption: "3,805", focus: 1,
              callouts: ["digit", "place", "value"] },
      say: "One more thing you have to know, and it is the thing that trips people up. Here is 3,805. There is a 0 in the tens. The digit is 0, the place value is tens, and the value is nothing at all. So ask them: if it is worth nothing, why is it there?",
      cue: "Wait for it. Someone usually says \u201cto hold the space,\u201d and they are exactly right.",
    },

    {
      show: { kind: "pvchart", places: 4,
              charts: [{ digits: "3805", caption: "3,805" }, { digits: "385", caption: "385" }],
              verdict: "Take the 0 out and every other digit slides right." },
      say: "Here is why. If you leave the 0 out, the 3 is not in the thousands any more. It slides down into the hundreds. The 8 falls into the tens, the 5 stays in the ones, and 3,805 has turned into 385. That is not a small mistake. That is almost three thousand five hundred dollars gone.",
      cue: "Read both numbers out loud. Three thousand eight hundred five, then three hundred eighty-five.",
    },

    {
      show: { kind: "answer", text: "0 is not nothing. It is holding a seat." },
      say: "So the 0 is not nothing. The 0 is holding a seat open so every other digit stays where it belongs. Whenever a number has a 0 in the middle of it, that is the 0 doing its job.",
    },

    {
      step: "Expanded form: write what each digit is worth.",
      show: { kind: "pvchart", places: 4, digits: "3863", caption: "3,863", expanded: 1 },
      say: "One more way to write a number, and it comes straight out of the chart. It is called expanded form. We just write down what each digit is really worth. The 3 in the thousands is worth three thousand. Write that first.",
    },

    {
      show: { kind: "pvchart", places: 4, digits: "3863", caption: "3,863", expanded: 3 },
      say: "The 8 in the hundreds is worth eight hundred. The 6 in the tens is worth sixty. We add them together as we go.",
    },

    {
      show: { kind: "pvchart", places: 4, digits: "3863", caption: "3,863", expanded: 4 },
      say: "And the 3 in the ones is worth three. Three thousand, plus eight hundred, plus sixty, plus three. Add all that up and you get 3,863 — the number we started with. Expanded form is just the number, told the long way.",
      cue: "Add it up out loud if the class doubts it.",
    },

    {
      ask: "Which digit is in the hundreds place?",
      askLabel: "Your turn:",
      ref: 1,
      show: { kind: "pvchart", places: 4, digits: "2421", caption: "2,421" },
      say: "Your turn. New number: two thousand, four hundred twenty-one. Written in the chart already. Ask the class which digit is sitting in the hundreds place.",
      cue: "Wait for: 4.",
    },

    {
      ref: 2,
      show: { kind: "pvchart", places: 4, digits: "2421", caption: "2,421", focus: 2,
              callouts: ["digit", "place", "value"] },
      say: "The digit is 4. Its place value is hundreds. So its value is four hundred. Not four — four hundred.",
    },

    {
      ask: "This number has two 2s. What is each one worth?",
      askLabel: "Your turn:",
      ref: 2,
      show: { kind: "pvchart", places: 4, digits: "2421", caption: "2,421", focus: 3,
              callouts: ["digit", "place", "value"] },
      say: "This number has two 2s in it, just like our first one had two 3s. This 2 is in the thousands, so it is worth two thousand. Ask them about the other one.",
      cue: "Wait for: twenty. The 2 in the tens is worth twenty, not two.",
    },

    {
      ref: 2,
      show: { kind: "pvchart", places: 4, digits: "2421", caption: "2,421", focus: 1,
              callouts: ["digit", "place", "value"] },
      say: "Twenty. Two tens is twenty. Same digit, different seat, different value — the same thing we found the first time.",
    },

    {
      ask: "Write 2,421 in expanded form.",
      askLabel: "Your turn:",
      ref: 3,
      show: { kind: "pvchart", places: 4, digits: "2421", caption: "2,421" },
      say: "Last one. Write two thousand four hundred twenty-one in expanded form. Take what each digit is worth and add them up.",
      cue: "Give them a minute on paper before you reveal it.",
    },

    {
      ref: 3,
      show: { kind: "pvchart", places: 4, digits: "2421", caption: "2,421", expanded: 4 },
      say: "Two thousand, plus four hundred, plus twenty, plus one. That is 2,421.",
    },

    {
      show: { kind: "answer", text: "You are ready to line numbers up in columns." },
      say: "This is why we care. When we add or subtract big numbers, we line the ones under the ones and the tens under the tens. Now you know why. Digits only add up if they are sitting in the same seat.",
      cue: "Go straight into Adding Large Numbers from here if you have time. It opens on 3,863.",
    },

    {
      show: { kind: "recap" },
      say: "Here is our recipe. Every place has a name, ones on the right. Write one digit per box. Then name the digit, its place, and its value. Each step left is ten times bigger. And expanded form is just what each digit is worth, added up.",
    },
  ],
};

/* ============================================================
   LESSON: Area and Perimeter of Rectangles
   Source PDF: "Area and Perimeter of Rectangles"
   Anchored to a garden bed seen from above, because both ideas are things
   you physically do to a garden: you fill the inside with plants (area, in
   square feet) and you build a fence around the outside (perimeter, in feet).
   Walking the fence is a real action, which is what makes perimeter stick.
   The bed is 5 ft by 3 ft: a real raised-bed size, whole numbers so the class
   can count the squares, and 15 against 16 so the area and the perimeter
   never come out as the same number and get mistaken for each other.
   The last movement is the one that makes the difference stick: two gardens
   with exactly the same 16 feet of fence, but 12 square feet of growing room
   against 16. Same perimeter, different area, so they cannot be the same
   thing — and the square bed really is the better buy.
   ============================================================ */

LESSONS["area-perimeter"] = {
  id: "area-perimeter",
  title: "Area and Perimeter of Rectangles",
  beats: [

    {
      show: { kind: "title", kicker: "Geometry", title: "Area and Perimeter",
              goal: "We will measure the inside of a shape and the outside of a shape." },
      say: "Today we are measuring two different things about the same shape. What fits inside it, and how far it is around it. We are going to build a garden.",
    },

    {
      show: { kind: "story", text: "You are planting a garden. You need soil to fill the inside. You need fence to go around the outside. Those are two different amounts, and the store sells them two different ways." },
      say: "Here is the job. You are planting a garden bed. You need soil and plants to fill the inside of it. And you need fence to go all the way around the outside so the rabbits stay out. Those are two completely different amounts, and if you get them mixed up at the store you go home with the wrong thing.",
      cue: "Ask if anyone has built a raised bed or put up a fence. Let them tell you.",
    },

    {
      show: { kind: "note", title: "Two words", text: "<b>Area</b> is the space <i>inside</i> a shape.<br><b>Perimeter</b> is the distance <i>around the outside</i>." },
      say: "Area is the space inside a shape. That is the soil. Perimeter is the distance around the outside. That is the fence. Say them back to me.",
      cue: "Perimeter has rim in the middle of it. Around the rim. That helps some students.",
    },

    {
      step: "Name the two sides: length and width.",
      show: { kind: "rect", len: 5, wid: 3, unit: "ft", grid: true, garden: true, labels: true,
              caption: "Your garden bed, looking down at it" },
      say: "Here is the bed, looking straight down at it from above. A rectangle has four sides and four square corners, and the two sides that matter have names. The long way across is the length. The short way down is the width. This bed is 5 feet long and 3 feet wide.",
      cue: "Point at the length, then the width. Make them say which is which.",
    },

    {
      step: "Area: count the squares inside.",
      show: { kind: "rect", len: 5, wid: 3, unit: "ft", grid: true, garden: true, labels: true,
              fill: "all", tally: true, caption: "How much do we plant?" },
      say: "Start with the planting. We have to fill the whole inside. I have marked the bed off into squares, and each square is one foot by one foot. So let us plant them one at a time and count. Count out loud with me.",
      cue: "Count along with the animation. Fifteen. Press Count again if they lost track.",
    },

    {
      show: { kind: "rect", len: 5, wid: 3, unit: "ft", grid: true, garden: true, labels: true,
              fill: "all", instant: true, result: "Area = 15 square feet",
              formula: "5 ft long  ×  3 ft wide  =  15 square feet" },
      say: "Fifteen squares. So the area is 15 square feet. And notice we did not really need to count all fifteen. There were 3 rows with 5 squares in each row. Five times three is fifteen. That is exactly why the formula is length times width.",
      cue: "Point at one row, then count the rows. Multiplication is faster than counting.",
    },

    {
      show: { kind: "note", title: "Area", text: "<b>A = L × W</b><br>Area is measured in <b>square</b> units, because you are counting squares." },
      say: "Area equals length times width. And the answer is always in square units. Square feet. Not feet. Square feet, because what you counted was squares.",
      cue: "The word square in the answer is the part they forget. Make a point of it.",
    },

    {
      step: "Perimeter: walk all the way around the outside.",
      show: { kind: "rect", len: 5, wid: 3, unit: "ft", grid: true, garden: true, labels: true,
              walk: "all", tally: true, caption: "How much fence do we need?" },
      say: "Now the fence. The fence does not care what is growing inside. It only goes around the edge. So we are going to walk it. Start in the corner and walk all the way around the outside, putting up one foot of fence at a time, and count your steps. Walk it with me.",
      cue: "Trace it with your finger on the screen as it builds. Sixteen.",
    },

    {
      show: { kind: "rect", len: 5, wid: 3, unit: "ft", grid: true, garden: true, labels: true,
              walk: "all", instant: true, mode: "perimeter",
              result: "Perimeter = 16 feet",
              formula: "5  +  3  +  5  +  3  =  16 feet" },
      say: "Sixteen feet of fence, and we are back where we started. And again there is a shortcut. Across the top was 5, down the side was 3, back across the bottom was 5, up the other side was 3. Add all four sides. Five plus three plus five plus three is sixteen.",
    },

    {
      show: { kind: "note", title: "Perimeter", text: "<b>P = add all the sides</b><br>Perimeter is measured in plain units, because you are measuring a distance." },
      say: "Perimeter is just adding up all the sides. And the answer is in plain units. Feet. Not square feet, because you did not count any squares. You walked a distance.",
    },

    {
      show: { kind: "answer", text: "Area fills the inside. Perimeter walks around the edge. Area is in square units. Perimeter is in plain units." },
      say: "That is the difference. Area fills the inside and comes out in square units. Perimeter walks around the edge and comes out in plain units. Soil goes inside. Fence goes around. If you can hold onto that, you have got the whole lesson.",
    },

    {
      ask: "Same fence. Which garden grows more?",
      askLabel: "Think:",
      show: { kind: "rect", caption: "Two gardens, exactly the same fence",
              rects: [
                { len: 6, wid: 2, unit: "ft", grid: true, garden: true, walk: "all", instant: true,
                  title: "Garden A: 6 ft × 2 ft", note: "16 ft of fence" },
                { len: 4, wid: 4, unit: "ft", grid: true, garden: true, walk: "all", instant: true,
                  title: "Garden B: 4 ft × 4 ft", note: "16 ft of fence" },
              ] },
      say: "Last thing, and this is the one that proves they are two different things. Here are two gardens. Walk around either one and you take exactly sixteen steps. The same roll of fence would go around either bed. Now ask the class: can you grow the same amount in both of them?",
      cue: "Take a vote. A lot of them will say yes. Let them be wrong first.",
    },

    {
      show: { kind: "rect", caption: "Same perimeter. Not the same area.",
              rects: [
                { len: 6, wid: 2, unit: "ft", grid: true, garden: true, fill: "all",
                  title: "Garden A: 6 ft × 2 ft", note: "12 square feet to plant", tally: true },
                { len: 4, wid: 4, unit: "ft", grid: true, garden: true, fill: "all",
                  title: "Garden B: 4 ft × 4 ft", note: "16 square feet to plant", tally: true },
              ] },
      say: "Plant them and count. The long skinny one holds twelve squares. The square one holds sixteen. Same fence, sixteen feet either way. Different growing room, twelve against sixteen. Four extra square feet of garden for exactly the same money on fence.",
      cue: "This is why raised beds are usually square-ish. Let that land.",
    },

    {
      show: { kind: "answer", text: "Same perimeter does not mean same area. They measure different things." },
      say: "So they are not the same thing and they never were. Two shapes can have the same perimeter and completely different areas. That is the whole reason we have two words for it.",
    },

    {
      ask: "What is the area of this bed?",
      askLabel: "Your turn:",
      ref: 2,
      show: { kind: "rect", len: 8, wid: 5, unit: "ft", grid: true, garden: true, labels: true,
              caption: "You try: a bed 8 ft by 5 ft" },
      say: "Your turn. A bigger bed, 8 feet long and 5 feet wide. Do not count the squares, use the formula. How much can we plant?",
      cue: "Wait for 8 times 5. If they are stuck on the fact, send them back to the times table lesson.",
    },

    {
      ref: 2,
      show: { kind: "rect", len: 8, wid: 5, unit: "ft", grid: true, garden: true, labels: true,
              fill: "all", instant: true, result: "Area = 40 square feet",
              formula: "8 ft  ×  5 ft  =  40 square feet" },
      say: "Eight times five is forty. Forty square feet of garden. Say the word square.",
    },

    {
      ask: "Now the fence. How far around?",
      askLabel: "Your turn:",
      ref: 3,
      show: { kind: "rect", len: 8, wid: 5, unit: "ft", grid: true, garden: true, labels: true,
              caption: "You try: a bed 8 ft by 5 ft" },
      say: "Same bed. Now how much fence do we have to buy? Walk it in your head and add up all four sides.",
      cue: "Watch for students who only add two sides. Eight plus five is the classic wrong answer.",
    },

    {
      ref: 3,
      show: { kind: "rect", len: 8, wid: 5, unit: "ft", grid: true, garden: true, labels: true,
              walk: "all", instant: true, mode: "perimeter",
              result: "Perimeter = 26 feet",
              formula: "8  +  5  +  8  +  5  =  26 feet" },
      say: "Eight plus five plus eight plus five. Twenty-six feet of fence. All four sides, not two. You have to walk the whole way around to get back to where you started.",
    },

    {
      show: { kind: "recap" },
      say: "Here is our recipe. Name the two sides, length and width. Area is the squares inside, length times width, in square units. Perimeter is the walk around the outside, add all the sides, in plain units.",
      cue: "Soil inside, fence around. If they remember that, they remember the lesson.",
    },
  ],
};
