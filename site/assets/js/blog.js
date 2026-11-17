(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const header = $('#header');
  const progress = header && $('.progress', header);
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (header) {
      header.classList.toggle('is-hidden', y > 600 && y > lastY + 4 && !document.body.classList.contains('menu-open'));
      if (y < lastY - 4) header.classList.remove('is-hidden');
    }
    if (progress) progress.style.transform = `scaleX(${h > 0 ? Math.min(1, y / h) : 0})`;
    lastY = y;
  }, { passive: true });

  const menuBtn = $('.menu-btn');
  const menu = $('#mobileMenu');
  if (menuBtn && menu) {
    const set = (open) => {
      document.body.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    menuBtn.addEventListener('click', () => set(!document.body.classList.contains('menu-open')));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  }

  $$('.j-filter button').forEach((b) => b.addEventListener('click', () => {
    $$('.j-filter button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const f = b.dataset.filter;
    $$('.j-card').forEach((c) => { c.hidden = f !== 'all' && c.dataset.stage !== f; });
  }));

  $$('.js-print').forEach((b) => b.addEventListener('click', () => {
    document.body.classList.add('print-summary');
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'summary_download', page: location.pathname });
    setTimeout(() => window.print(), 50);
  }));
  window.addEventListener('afterprint', () => document.body.classList.remove('print-summary'));
})();
