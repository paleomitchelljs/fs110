/* Where did the time go? One study-time tank per chapter, and the score the model gives each chapter from it.
 * Every tank starts at 75%. Drag one down and its chapter's score falls hard; drag one up and nothing much happens.
 * The grade is the questions-weighted sum, so the total is the same kind of number as on the other pages.
 */
(function () {
  'use strict';
  const D = Deck, M = Model, X = EXAM, clamp = D.clamp;
  const CHAPS = [10, 11, 12];
  const NQ = D.modelNQ;
  const TOP = 160, H = 440, BASE = Math.round(M.score(M.T0, M.M0));

  D.Alloc = function (host) {
    const root = D.el('div', 'alloc', host);
    const a = () => D.modelState().TC;
    const cols = CHAPS.map((c, i) => {
      const cx = 330 + i * 410;
      const tank = D.el('div', 'tank ch', root, '<i class="tf"></i><i class="was"></i><b class="tn"></b>');
      tank.dataset.ch = c; tank.style.cssText = 'left:' + (cx - 190) + 'px;top:' + TOP + 'px;height:' + H + 'px';
      const bar = D.el('div', 'sbar', root, '<i class="sf"></i><i class="was"></i><b class="sn"></b>');
      bar.style.cssText = 'left:' + (cx + 10) + 'px;top:' + TOP + 'px;height:' + H + 'px';
      const pill = D.el('div', 'gpill on', root, String(c)); pill.dataset.ch = c;
      pill.style.cssText = 'left:' + (cx - 190) + 'px;width:260px;top:' + (TOP + H + 26) + 'px';
      const ghost = (e, v) => { e.querySelector('.was').style.bottom = (v * 100) + '%'; };
      ghost(tank, M.T0); ghost(bar, M.U(M.T0, M.M0));
      D.drag(tank, root, (x, y) => { const tc = a().slice(); tc[i] = clamp(1 - (y - TOP) / H, 0, 1); D.setModel({ TC: tc }); });
      return { tank, bar };
    });
    const out = D.el('div', 'tot', root, '<b></b><small>/' + M.N + '</small><u></u>');
    const rs = D.el('button', 'tool', root, D.icons.real); rs.type = 'button'; rs.title = 'Every chapter back to 75%'; rs.setAttribute('aria-label', 'Reset');
    rs.style.cssText = 'left:1400px;top:520px';
    rs.addEventListener('click', () => { D.setModel({ T: M.T0 }); });

    function render() {
      const t = a(), m = D.modelState().M;
      let total = 0;
      cols.forEach((c, i) => {
        const u = M.U(t[i], m);
        total += NQ[i] * u;
        c.tank.querySelector('.tf').style.height = (t[i] * 100) + '%';
        c.tank.querySelector('.tn').textContent = Math.round(t[i] * 100) + '%';
        c.bar.querySelector('.sf').style.height = (u * 100) + '%';
        c.bar.querySelector('.sn').textContent = Math.round(u * 100);
      });
      const d = Math.round(total) - Math.round(M.N * M.U(M.T0, m));
      out.querySelector('b').textContent = Math.round(total);
      const u = out.querySelector('u'); u.textContent = d ? (d > 0 ? '+' : '−') + Math.abs(d) : ''; u.className = d > 0 ? 'up' : 'dn';
    }
    D.onModel(render);
    render();
    return { refresh: render };
  };
})();
