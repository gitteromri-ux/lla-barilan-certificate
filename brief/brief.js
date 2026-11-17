(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const tabs = $$('.tab');
  const panels = $$('.panel');
  function show(id, push) {
    if (!panels.some((p) => p.id === id)) id = 'overview';
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.getAttribute('aria-controls') === id)));
    panels.forEach((p) => p.classList.toggle('is-on', p.id === id));
    if (push) history.replaceState(null, '', '#' + id);
    if (id === 'landing') { const f = $('#lp'); if (f && !f.dataset.loaded) { f.dataset.loaded = '1'; } requestAnimationFrame(fit); }
  }
  tabs.forEach((t) => t.addEventListener('click', () => { show(t.getAttribute('aria-controls'), true); window.scrollTo({ top: $('.tabs').offsetTop, behavior: 'smooth' }); }));
  window.addEventListener('hashchange', () => show(location.hash.slice(1)));
  show(location.hash.slice(1) || 'overview');

  const frame = $('#frame');
  const vp = $('#viewport');
  const iframe = $('#lp');
  let device = 'desktop';
  const SIZES = { desktop: [1440, 900], mobile: [390, 844] };
  function fit() {
    if (!vp || !iframe) return;
    const [w, h] = SIZES[device];
    const avail = device === 'mobile' ? Math.min(w, frame.clientWidth - 28) : vp.clientWidth || frame.clientWidth;
    const scale = Math.min(1, avail / w);
    iframe.style.width = w + 'px';
    iframe.style.height = h + 'px';
    iframe.style.transform = `scale(${scale})`;
    vp.style.height = Math.round(h * scale) + 'px';
    if (device === 'mobile') vp.style.width = Math.round(w * scale) + 'px'; else vp.style.width = '';
  }
  $$('.seg button').forEach((b) => b.addEventListener('click', () => {
    device = b.dataset.device;
    $$('.seg button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    frame.classList.toggle('mobile', device === 'mobile');
    requestAnimationFrame(fit);
  }));
  window.addEventListener('resize', fit);
  if (iframe) iframe.addEventListener('load', fit);

  $$('[data-jump]').forEach((b) => b.addEventListener('click', () => {
    try {
      const doc = iframe.contentWindow.document;
      const el = doc.getElementById(b.dataset.jump);
      if (el) iframe.contentWindow.scrollTo({ top: el.getBoundingClientRect().top + iframe.contentWindow.scrollY - (b.dataset.jump === 'top' ? 0 : 70), behavior: 'smooth' });
    } catch (e) {
      window.open('site/index.html#' + b.dataset.jump, '_blank', 'noopener');
    }
  }));
})();
