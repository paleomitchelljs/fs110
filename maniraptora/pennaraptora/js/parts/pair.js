/* A silhouette beside a fossil, one caption under both.
 *
 *   pair    sil: { src, credit }  fig: { src, crop: [l, t, r, b] }  cap
 *           silW: share of the width (or, with stack, the height) for the silhouette.
 *           stack: silhouette above the fossil instead of beside it.
 *           credit is the second, smaller caption line (silhouette taxon and artist).
 */
(function () {
  'use strict';
  const D = window.Deck;
  const dims = (src) => window.DIMS[src.replace(/^img\//, '')];
  D.parts.pair = function (def, host) {
    const BW = def.box[2], BH = def.box[3], G = 22, CAPH = def.sil.credit ? 58 : 34;
    const SW = Math.round(BW * (def.silW || 0.34)), H = BH - CAPH;
    host.innerHTML = '<img class="pr-sil" draggable="false" alt=""><div class="pc-frame"><img draggable="false" alt=""></div><div class="pr-cap"></div>';
    const sil = host.querySelector('.pr-sil'), frame = host.querySelector('.pc-frame'), img = frame.querySelector('img'), cap = host.querySelector('.pr-cap');

    const [sw0, sh0] = dims(def.sil.src), [W, Hh] = dims(def.fig.src), c = def.fig.crop || [0, 0, 1, 1];
    const cw = W * (c[2] - c[0]), ch = Hh * (c[3] - c[1]);
    let sx, sy, ss, fx, fy, s;
    if (def.stack) {
      /* silhouette above, fossil below, centred as a column */
      const SH = Math.round(H * (def.silW || 0.36));
      ss = Math.min(BW / sw0, SH / sh0);
      s = Math.min(BW / cw, (H - SH - G) / ch);
      const tot = sh0 * ss + G + ch * s, y0 = (H - tot) / 2;
      sx = (BW - sw0 * ss) / 2; sy = y0; fx = (BW - cw * s) / 2; fy = y0 + sh0 * ss + G;
    } else {
      /* silhouette left, fossil right, centred as a row */
      ss = Math.min(SW / sw0, H * 0.8 / sh0);
      s = Math.min((BW - sw0 * ss - G) / cw, H / ch);
      const tot = sw0 * ss + G + cw * s, x0 = (BW - tot) / 2;
      sx = x0; sy = (H - sh0 * ss) / 2; fx = x0 + sw0 * ss + G; fy = (H - ch * s) / 2;
    }
    sil.src = def.sil.src;
    sil.style.cssText = `left:${sx.toFixed(1)}px;top:${sy.toFixed(1)}px;width:${(sw0 * ss).toFixed(1)}px;height:${(sh0 * ss).toFixed(1)}px;`;
    frame.style.cssText = `left:${fx.toFixed(1)}px;top:${fy.toFixed(1)}px;width:${(cw * s).toFixed(1)}px;height:${(ch * s).toFixed(1)}px;`;
    img.src = def.fig.src;
    img.style.cssText = `width:${(W * s).toFixed(1)}px;height:${(Hh * s).toFixed(1)}px;left:${(-c[0] * W * s).toFixed(1)}px;top:${(-c[1] * Hh * s).toFixed(1)}px;`;

    cap.style.top = (H + 6) + 'px';
    cap.innerHTML = `<div>${D.fmt(def.cap || '')}</div>` + (def.sil.credit ? `<div class="pr-credit">${D.fmt(def.sil.credit)}</div>` : '');
    return { show() {} };
  };
})();
