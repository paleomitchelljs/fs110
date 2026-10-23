/* The pages. Each one is a view of the same four students: columns, a model, claims, chapters, and where the time went. */
(function () {
  'use strict';
  const D = Deck;
  const COLS = { x0: 140, pitch: 26 };

  const pages = [
    /* 1. The four students, one column per question. */
    {
      id: 'columns', title: 'Four students',
      prompts: ['Four students', 'Same grade. Why?'],
      make(host) {
        const rows = D.Rows(host, Object.assign({ y0: 120, cellH: 96, rowPitch: 160 }, COLS));
        return {
          show(b) { rows.set({ layout: 'exam', scores: b >= 1 }); },
          reset() { rows.clearDraws(); }
        };
      }
    },

    /* 2. learning-dag.png, with Time and Study Methods live; then the same model as a curve. */
    {
      id: 'model', title: 'The model',
      prompts: ['Study more?', 'Study differently?'],
      make(host) {
        host.classList.add('model');
        const dag = D.Dag(host);
        return {
          show(b) {
            dag.live({ time: b === 0 || b === 1, method: b === 1 });
            dag.refresh();
          },
          reset() { dag.refresh(); }
        };
      }
    },

    /* 3. Four blank cards, then four explanations to pick from. The questions regroup by whichever are picked; luck sits beside them. */
    {
      id: 'claims', title: 'Claims',
      prompts: ['Why 28 of 42?', 'Pick some'],
      make(host) {
        host.classList.add('claims');
        const rows = D.Rows(host, Object.assign({ y0: 300, cellH: 60, rowPitch: 120 }, COLS));
        const cl = D.Claims(host, rows, { x: 50, ty: 24, rx: 20, dy: 176 });
        return { show: cl.show, key: cl.key, reset: cl.reset };
      }
    },

    /* 4. The reveal: color the questions by chapter, regroup, count, ask whether luck would do it. */
    {
      id: 'chapters', title: 'Chapters',
      prompts: ['Chapters', 'Group them', 'Percent right', 'Luck?', 'Which chapter?'],
      make(host) {
        const rows = D.Rows(host, Object.assign({ y0: 170, cellH: 66, rowPitch: 150 }, COLS));
        const deal = D.dealTools(host, rows, 'right:20px;top:56px');
        let b0 = 0;
        const plan = [
          { layout: 'exam', caps: true },
          { layout: 'chapter', caps: true, head: true },
          { layout: 'chapter', caps: true, head: true, pct: true },
          { layout: 'chapter', caps: true, head: true, pct: true, luck: true },
          { layout: 'chapter', caps: true, head: true, pct: true, luck: true, ring: true }
        ];
        return {
          show(b) {
            b0 = b;
            const base = { layout: 'exam', caps: false, head: false, pct: false, luck: false, ring: false, thirds: false, cls: false, scores: false };
            if (b !== 3 && rows.dealt) rows.real();
            rows.set(Object.assign(base, plan[b]));
            deal.classList.toggle('on', b >= 3);
          },
          key(e) {
            if (b0 < 3) return false;
            if (e.key.toLowerCase() === 'd') { rows.deal(e.shiftKey ? 100 : 1); return true; }
            return false;
          },
          reset() { rows.clearDraws(); }
        };
      }
    }
  ];

  Deck.start(pages);
})();
