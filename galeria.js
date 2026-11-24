/* Galería «Ramos»: botón arriba a la derecha que abre una cuadrícula con todos los ramos.
   Cada página de día define antes window.GALERIA_TEMA (colores, letras y tipo de fondo)
   y carga ../dias.js (window.RAMOS) y este archivo. */
(() => {
  'use strict';
  const T = Object.assign({
    modo: 'liso', fondo: '#111', fondo2: '#222', texto: '#eee', acento: '#e66', suave: '#999',
    borde: '#444', celda: '#1a1a1a', fTitulo: 'Georgia,serif', fTexto: 'Georgia,serif',
    tamTitulo: '44px', tamTexto: '17px', rampa: null,
  }, window.GALERIA_TEMA || {});
  const PIXEL = T.modo === 'pixel';
  const INICIO = [2026, 11, 24], BLOQUES = 4, POR_BLOQUE = 81, HORA_CAMBIO = 7;
  const MES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const MES3 = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  if (window.ES_MOVIL === false) return;

  /* ---------- Estilos ---------- */
  const marco = PIXEL ? `box-shadow:0 0 0 2px ${T.celda},0 0 0 4px ${T.borde},4px 4px 0 4px rgba(0,0,0,.45);border-radius:0;`
                      : `border:1px solid ${T.borde};border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.18);`;
  const css = `
  .gr-btn{position:fixed;top:calc(14px + env(safe-area-inset-top,0px));right:calc(14px + env(safe-area-inset-right,0px));z-index:50;
    display:inline-flex;align-items:center;padding:8px 13px 9px;cursor:pointer;color:${T.texto};
    font:400 ${PIXEL ? '18px' : '17px'}/1 ${T.fTexto};letter-spacing:${PIXEL ? '.02em' : '.08em'};
    background:${PIXEL ? T.celda : 'color-mix(in srgb,' + T.fondo + ' 70%, transparent)'};
    ${PIXEL ? 'border:0;' : 'backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);'}${PIXEL ? marco : `border:1px solid ${T.borde};border-radius:999px;`}
    -webkit-tap-highlight-color:transparent}
  .gr canvas{position:static;left:auto;top:auto;transform:none;margin:0}
  .gr-btn:active{transform:translate(1px,1px)}
  .gr-btn:focus-visible,.gr-cerrar:focus-visible,.gr-celda:focus-visible{outline:2px solid ${T.acento};outline-offset:3px}
  .gr{position:fixed;inset:0;z-index:60;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;touch-action:pan-y;background:${T.fondo};color:${T.texto}}
  .gr[hidden]{display:none!important}
  .gr .gr-fondo{position:fixed;inset:0;left:0;top:0;transform:none;width:100%;height:100%;display:block;pointer-events:none;${PIXEL ? 'image-rendering:pixelated;' : ''}}
  .gr-pag{position:relative;max-width:520px;margin:0 auto;
    padding:calc(18px + env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) calc(40px + env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px))}
  .gr-cab{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:12px;
    margin:0 -8px 10px;padding:12px 8px 14px;background:linear-gradient(${T.fondo} 72%, transparent)}
  .gr-tit{display:flex;flex-direction:column;gap:6px}
  .gr-tit h2{margin:0;font:400 ${T.tamTitulo}/1 ${T.fTitulo};color:${T.acento};${PIXEL ? 'text-shadow:3px 3px 0 ' + T.celda + ';' : ''}}
  .gr-cuenta{font:italic 400 ${T.tamTexto}/1.2 ${T.fTexto};color:${T.suave}}
  .gr-cerrar{flex:none;width:44px;height:44px;cursor:pointer;color:${T.texto};font:400 26px/1 ${T.fTexto};
    background:${PIXEL ? T.celda : 'transparent'};${PIXEL ? 'border:0;' + marco : `border:1px solid ${T.borde};border-radius:50%;`}}
  .gr-bloque{margin:0 0 30px}
  .gr-bcab{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin:0 2px 10px;font:400 ${T.tamTexto}/1 ${T.fTexto};color:${T.texto}}
  .gr-bcab small{font:italic 400 ${T.tamTexto}/1 ${T.fTexto};color:${T.suave}}
  .gr-rej{display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:${PIXEL ? '5px' : '6px'};padding:8px;
    background:${PIXEL ? '#0a0205' : 'color-mix(in srgb,' + T.fondo + ' 82%, ' + T.texto + ')'};${marco}}
  .gr-celda{position:relative;display:block;aspect-ratio:1;overflow:hidden;text-decoration:none;
    ${PIXEL ? 'box-shadow:0 0 0 1px ' + T.borde + ';' : 'border-radius:7px;box-shadow:0 1px 3px rgba(0,0,0,.25);'}transition:transform .12s}
  .gr .gr-celda canvas{position:static;transform:none;display:block;width:100%;height:100%;${PIXEL ? 'image-rendering:pixelated;' : ''}}
  .gr-num{position:absolute;right:2px;bottom:1px;font:400 ${PIXEL ? '9px' : '10px'}/1 ${T.fTexto};color:#fffaf0;text-shadow:1px 1px 0 rgba(0,0,0,.7)}
  .gr-celda:active{transform:scale(.92)}
  .gr-hoy{box-shadow:0 0 0 2px ${T.acento},0 0 0 4px ${T.fondo};z-index:1}
  .gr-nada{display:flex;align-items:center;justify-content:center;cursor:default;color:${T.suave};
    font:400 ${PIXEL ? '24px' : '19px'}/1 ${T.fTitulo};
    background:${PIXEL ? 'repeating-conic-gradient(' + T.celda + ' 0 25%, ' + (T.rampa ? T.rampa[2] : T.fondo2) + ' 0 50%) 0 0/4px 4px' : T.celda};
    opacity:${PIXEL ? 1 : 0.85}}
  .gr-nada:active{transform:none}
  .gr-ley{display:flex;flex-wrap:wrap;gap:8px 18px;justify-content:center;margin:0;font:italic 400 ${T.tamTexto}/1.3 ${T.fTexto};color:${T.suave}}
  .gr-ley i{font-style:normal;color:${T.acento}}
  @media (prefers-reduced-motion:reduce){.gr-celda,.gr-btn{transition:none}}`;
  const st = document.createElement('style');
  st.textContent = css;
  document.head.append(st);

  /* ---------- Estructura ---------- */
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'gr-btn'; btn.setAttribute('aria-haspopup', 'dialog');
  btn.textContent = 'Ramos';

  const gal = document.createElement('section');
  gal.className = 'gr'; gal.hidden = true;
  gal.setAttribute('role', 'dialog'); gal.setAttribute('aria-modal', 'true'); gal.setAttribute('aria-label', 'Ramos');
  const fondo = document.createElement('canvas'); fondo.className = 'gr-fondo'; fondo.setAttribute('aria-hidden', 'true');
  const pag = document.createElement('div'); pag.className = 'gr-pag';
  const cab = document.createElement('div'); cab.className = 'gr-cab';
  const tit = document.createElement('div'); tit.className = 'gr-tit';
  const h2 = document.createElement('h2'); h2.textContent = 'Ramos';
  const cuenta = document.createElement('span'); cuenta.className = 'gr-cuenta';
  tit.append(h2, cuenta);
  const cerrar = document.createElement('button');
  cerrar.type = 'button'; cerrar.className = 'gr-cerrar'; cerrar.setAttribute('aria-label', 'Cerrar'); cerrar.textContent = '×';
  cab.append(tit, cerrar);
  const bloques = document.createElement('div');
  const ley = document.createElement('p'); ley.className = 'gr-ley';
  const l1 = document.createElement('span'); const li = document.createElement('i'); li.textContent = '▣'; l1.append(li, document.createTextNode(' hoy'));
  const l2 = document.createElement('span'); l2.textContent = '? todavía no ha salido';
  ley.append(l1, l2);
  pag.append(cab, bloques, ley);
  gal.append(fondo, pag);
  document.body.append(btn, gal);

  // Que tocar el botón o la galería no reinicie la animación de debajo.
  for (const el of [btn, gal]) for (const ev of ['pointerdown', 'mousedown', 'touchstart', 'keydown']) el.addEventListener(ev, (e) => e.stopPropagation());

  /* ---------- Datos ---------- */
  const p2 = (n) => String(n).padStart(2, '0');
  const iso = (d) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
  const ahora = new Date();
  if (ahora.getHours() < HORA_CAMBIO) ahora.setDate(ahora.getDate() - 1);
  const hoy = iso(ahora);
  const ramos = new Map((Array.isArray(window.RAMOS) ? window.RAMOS : []).filter((r) => r && r.fecha).map((r) => [r.fecha, r]));
  const dia = (i) => new Date(INICIO[0], INICIO[1] - 1, INICIO[2] + i);

  /* ---------- Miniaturas: cada una en el estilo de su propio ramo ---------- */
  const ICONO = ['..p.p.p..', '.ppppppp.', '.ppcccpp.', 'pppcccppp', '.ppcccpp.', '.ppppppp.', '.l..l..l.', '..llllll.', '....l....'];
  function miniatura(r) {
    const col = Array.isArray(r.colores) ? r.colores : ['#c66', '#fd9', '#696'];
    const c = document.createElement('canvas');
    c.setAttribute('aria-hidden', 'true');
    if (/pixel/i.test(r.estilo || '')) {
      c.width = 9; c.height = 9; c.style.imageRendering = 'pixelated';
      const x = c.getContext('2d');
      x.fillStyle = r.fondo || '#000'; x.fillRect(0, 0, 9, 9);
      const m = { p: col[0], c: col[1], l: col[2] };
      ICONO.forEach((f, j) => [...f].forEach((k, i) => { if (m[k]) { x.fillStyle = m[k]; x.fillRect(i, j, 1, 1); } }));
      return c;
    }
    const S = 72; c.width = S; c.height = S;
    const x = c.getContext('2d');
    x.fillStyle = r.fondo || '#000'; x.fillRect(0, 0, S, S);
    const tinta = /tinta/i.test(r.estilo || ''), real = /realista/i.test(r.estilo || '');
    const cx = S / 2, cy = S * 0.44, R = S * 0.27;
    x.lineWidth = 2; x.strokeStyle = 'rgba(40,28,20,.85)';
    for (const s of [-1, 1]) {
      x.save(); x.translate(cx + s * R * 0.55, cy + R * 1.05); x.rotate(s * 0.7);
      x.beginPath(); x.ellipse(0, 0, R * 0.55, R * 0.24, 0, 0, Math.PI * 2);
      x.fillStyle = col[2]; x.fill(); if (tinta) x.stroke(); x.restore();
    }
    for (let k = 0; k < 7; k++) {
      const a = k / 7 * Math.PI * 2;
      x.save(); x.translate(cx + Math.cos(a) * R * 0.55, cy + Math.sin(a) * R * 0.55); x.rotate(a);
      x.beginPath(); x.ellipse(0, 0, R * 0.62, R * 0.42, 0, 0, Math.PI * 2);
      if (real) { const g = x.createRadialGradient(0, 0, 1, 0, 0, R * 0.7); g.addColorStop(0, col[1]); g.addColorStop(1, col[0]); x.fillStyle = g; }
      else x.fillStyle = col[0];
      x.fill(); if (tinta) x.stroke(); x.restore();
    }
    x.beginPath(); x.arc(cx, cy, R * 0.38, 0, Math.PI * 2); x.fillStyle = col[1]; x.fill(); if (tinta) x.stroke();
    if (tinta) { x.beginPath(); for (let t = 0; t < 1; t += 0.05) { const a = t * 11, rr = R * 0.32 * t; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } x.stroke(); }
    return c;
  }

  /* ---------- Rejilla en bloques de 9×9 ---------- */
  let salidos = 0;
  for (let b = 0; b < BLOQUES; b++) {
    const ini = dia(b * POR_BLOQUE), fin = dia(b * POR_BLOQUE + POR_BLOQUE - 1);
    const sec = document.createElement('section'); sec.className = 'gr-bloque';
    const bc = document.createElement('div'); bc.className = 'gr-bcab';
    const t = document.createElement('span'); t.textContent = `Bloque ${b + 1}`;
    const s = document.createElement('small');
    s.textContent = `${ini.getDate()} ${MES3[ini.getMonth()]} – ${fin.getDate()} ${MES3[fin.getMonth()]} ${fin.getFullYear()}`;
    bc.append(t, s);
    const rej = document.createElement('div'); rej.className = 'gr-rej';
    for (let i = 0; i < POR_BLOQUE; i++) {
      const d = dia(b * POR_BLOQUE + i), f = iso(d), r = ramos.get(f);
      if (r && f <= hoy) {
        salidos++;
        const a = document.createElement('a');
        a.className = 'gr-celda' + (f === hoy ? ' gr-hoy' : '');
        a.href = `${f}.html`;
        a.title = `${d.getDate()} de ${MES[d.getMonth()]} · ${r.estilo || ''}`;
        a.setAttribute('aria-label', `Ramo del ${d.getDate()} de ${MES[d.getMonth()]}`);
        const n = document.createElement('span'); n.className = 'gr-num'; n.textContent = String(d.getDate());
        a.append(miniatura(r), n);
        rej.append(a);
      } else {
        const v = document.createElement('div');
        v.className = 'gr-celda gr-nada'; v.textContent = '?';
        v.setAttribute('aria-label', `${d.getDate()} de ${MES[d.getMonth()]}: todavía no ha salido`);
        rej.append(v);
      }
    }
    sec.append(bc, rej);
    bloques.append(sec);
  }
  cuenta.textContent = salidos === 1 ? '1 ramo hasta hoy' : `${salidos} ramos hasta hoy`;

  /* ---------- Fondo de la galería, según el estilo del día ---------- */
  const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  function rnd(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }
  function pintarFondo() {
    const vw = window.innerWidth, vh = window.innerHeight;
    if (PIXEL) {
      const PX = 4, w = Math.ceil(vw / PX), h = Math.ceil(vh / PX);
      fondo.width = w; fondo.height = h;
      const x = fondo.getContext('2d'), R = T.rampa || [T.fondo, T.fondo2], n = R.length - 1;
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
        const dx = (i - w / 2) / w, dy = (j - h * 0.35) / h;
        const v = 0.12 + 0.22 * (j / h) + 0.35 * Math.max(0, 1 - Math.hypot(dx * 1.4, dy) * 2.2) ** 2;
        x.fillStyle = R[Math.min(n, Math.floor(v * n + (BAY[(i & 3) | ((j & 3) << 2)] + 0.5) / 16))];
        x.fillRect(i, j, 1, 1);
      }
      const r = rnd(7), est = Math.round(w * h / 160);
      for (let e = 0; e < est; e++) {
        const i = (r() * w) | 0, j = (r() * h) | 0, b = r();
        x.fillStyle = b > 0.93 ? T.texto : b > 0.6 ? T.suave : T.borde;
        x.fillRect(i, j, 1, 1);
      }
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2), W = Math.round(vw * dpr), H = Math.round(vh * dpr);
    fondo.width = W; fondo.height = H;
    const x = fondo.getContext('2d'), r = rnd(11);
    if (T.modo === 'papel') {
      x.fillStyle = T.fondo; x.fillRect(0, 0, W, H);
      for (let i = 0, n = W * H / 600; i < n; i++) {
        x.fillStyle = r() < 0.6 ? `rgba(59,42,30,${0.03 + r() * 0.05})` : `rgba(255,255,255,${0.15 + r() * 0.2})`;
        const s = (0.6 + r() * 1.4) * dpr; x.fillRect(r() * W, r() * H, s, s);
      }
      x.strokeStyle = 'rgba(59,42,30,0.06)'; x.lineWidth = 0.7 * dpr;
      for (let i = 0; i < 70; i++) {
        const px = r() * W, py = r() * H, l = (8 + r() * 26) * dpr, a = r() * 6.28;
        x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + Math.cos(a + 0.6) * l / 2, py + Math.sin(a + 0.6) * l / 2, px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke();
      }
      const g = x.createRadialGradient(W / 2, H * 0.4, Math.min(W, H) * 0.2, W / 2, H * 0.4, Math.max(W, H) * 0.8);
      g.addColorStop(0, 'rgba(59,42,30,0)'); g.addColorStop(1, 'rgba(59,42,30,0.14)');
      x.fillStyle = g; x.fillRect(0, 0, W, H);
      return;
    }
    const g = x.createRadialGradient(W / 2, H * 0.3, 0, W / 2, H * 0.3, Math.max(W, H) * 0.85);
    g.addColorStop(0, T.fondo2); g.addColorStop(0.6, T.fondo); g.addColorStop(1, T.fondo);
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    if (T.modo === 'noche') {
      x.globalCompositeOperation = 'lighter';
      for (let k = 0; k < 16; k++) {
        const px = r() * W, py = r() * H, rr = (0.03 + r() * 0.07) * W, col = k % 2 ? T.acento : T.suave;
        const gg = x.createRadialGradient(px, py, 0, px, py, rr);
        gg.addColorStop(0, col + '22'); gg.addColorStop(0.7, col + '14'); gg.addColorStop(1, col + '00');
        x.fillStyle = gg; x.beginPath(); x.arc(px, py, rr, 0, 6.29); x.fill();
      }
      x.globalCompositeOperation = 'source-over';
    }
  }

  /* ---------- Abrir y cerrar ---------- */
  const abrir = () => { pintarFondo(); gal.hidden = false; gal.scrollTop = 0; cerrar.focus({ preventScroll: true }); };
  const cerrarGal = () => { gal.hidden = true; btn.focus({ preventScroll: true }); };
  btn.addEventListener('click', abrir);
  cerrar.addEventListener('click', cerrarGal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !gal.hidden) cerrarGal(); });
  window.addEventListener('resize', () => { if (!gal.hidden) pintarFondo(); });
})();
