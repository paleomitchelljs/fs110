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
      prompts: ['Study more?', 'Study differently?', 'How far can each go?'],
      make(host) {
        host.classList.add('model');
        const dag = D.Dag(host);
        const chart = D.Chart(host, { x: 140, y: 40, w: 1320, h: 720 });
        return {
          show(b) {
            dag.live({ time: b === 0 || b === 1, method: b === 1 });
            host.classList.toggle('curve', b >= 2);
            chart.el.classList.toggle('on', b >= 2);
            dag.refresh(); chart.refresh();
          },
          reset() { dag.refresh(); chart.refresh(); }
        };
      }
    },

    /* 3. Claims you type, and a bench to test them on. */
    {
      id: 'claims', title: 'Claims',
      prompts: ['Why 28 of 42?', 'What would each look like?', ''],
      make(host) {
        host.classList.add('claims');
        const geo = Object.assign({ y0: 344, cellH: 50, rowPitch: 112 }, COLS);
        const rows = D.Rows(host, geo);
        const chart = D.Chart(host, { x: 140, y: 270, w: 1320, h: 520 });
        const cl = D.Claims(host, rows, chart, { x: 140, ty: 204, y: 300, rx: 20 });
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
    },

    /* 5. The model at chapter size. */
    {
      id: 'alloc', title: 'Where the time went',
      prompts: ['Where did the time go?'],
      make(host) { const al = D.Alloc(host); return { show() { al.refresh(); }, reset() { al.refresh(); } }; }
    }
  ];

  Deck.start(pages);
})();
