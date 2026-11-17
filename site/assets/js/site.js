(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const CFG = window.LLA_CONFIG || {};
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const isSmall = () => window.matchMedia('(max-width: 760px)').matches;
  const isPlaceholder = (id) => !id || /X{4,}/.test(id);

  const track = (event, params = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event }, params));
  };

  /* ---------- Split headings into masked words ---------- */
  function splitWords(el) {
    let i = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          const parts = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'w';
            const inner = document.createElement('span');
            inner.textContent = p;
            inner.style.setProperty('--i', i++);
            w.appendChild(inner);
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName === 'SUP') {
          const w = document.createElement('span');
          w.className = 'w';
          const inner = document.createElement('span');
          inner.style.setProperty('--i', i++);
          child.replaceWith(w);
          inner.appendChild(child);
          w.appendChild(inner);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    };
    walk(el);
    el.classList.add('split');
  }
  $$('[data-split]').forEach(splitWords);

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = $$('[data-reveal], .split, .draw, .architecture');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-in'));
  }
  $$('.draw path, .draw circle.draw-c').forEach((p) => {
    try { if (!p.style.getPropertyValue('--len')) p.style.setProperty('--len', Math.ceil(p.getTotalLength())); } catch (e) { /* not rendered */ }
  });

  /* ---------- Header, progress, current section ---------- */
  const header = $('#header');
  const progress = $('.progress', header);
  let lastY = window.scrollY;
  let ticking = false;
  const navLinks = $$('.nav a');
  const sections = navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  const sticky = $('.sticky-cta');
  const hero = $('.hero');
  const register = $('#register');

  function onScroll() {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-scrolled', y > 40);
    const menuOpen = document.body.classList.contains('menu-open');
    header.classList.toggle('is-hidden', !menuOpen && y > 700 && y > lastY + 4);
    if (y < lastY - 4) header.classList.remove('is-hidden');
    if (progress) progress.style.transform = `scaleX(${h > 0 ? Math.min(1, y / h) : 0})`;
    let current = null;
    sections.forEach((s) => { if (s.getBoundingClientRect().top < window.innerHeight * 0.35) current = s; });
    navLinks.forEach((a) => a.classList.toggle('is-current', current && a.getAttribute('href') === '#' + current.id));
    if (hero) document.body.classList.toggle('past-hero', hero.getBoundingClientRect().bottom < window.innerHeight * 0.35);
    if (sticky && hero && register) {
      const pastHero = hero.getBoundingClientRect().bottom < 0;
      const r = register.getBoundingClientRect();
      const nearForm = r.top < window.innerHeight && r.bottom > 0;
      sticky.classList.toggle('is-on', pastHero && !nearForm);
    }
    parallax();
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  /* ---------- Parallax ---------- */
  const parallaxEls = reduceMotion ? [] : $$('[data-parallax]');
  function parallax() {
    parallaxEls.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const k = parseFloat(el.dataset.parallax) || -0.06;
      const offset = (r.top + r.height / 2 - window.innerHeight / 2) * k;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
  }
  onScroll();

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('.menu-btn');
  const menu = $('#mobileMenu');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- Video: lazy load, play only in view ---------- */
  const autoplayOK = !reduceMotion && !saveData;
  function srcFor(v) { return (isSmall() && v.dataset.srcSm) || v.dataset.src; }
  function ensurePoster(v) { if (v.dataset.poster && !v.getAttribute('poster')) v.setAttribute('poster', v.dataset.poster); }
  function ensureSrc(v) {
    ensurePoster(v);
    if (!v.dataset.src || v.dataset.loaded) return;
    v.src = srcFor(v);
    v.dataset.loaded = '1';
    v.load();
  }
  function playVideo(v) {
    if (!autoplayOK) return;
    ensureSrc(v);
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  }
  const lazyVideos = $$('video.lv');
  if ('IntersectionObserver' in window) {
    const vio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const v = e.target;
        const item = v.closest('.screen-item');
        if (item && !item.classList.contains('is-on')) return;
        if (e.isIntersecting) { ensurePoster(v); playVideo(v); } else if (!v.paused) v.pause();
      });
    }, { rootMargin: '400px 0px', threshold: 0.01 });
    lazyVideos.forEach((v) => vio.observe(v));
  } else {
    lazyVideos.forEach(ensurePoster);
  }

  /* ---------- Hero reel ---------- */
  const heroVideos = $$('.hero-v');
  const beats = $$('.beat');
  let beat = 0;
  let beatTimer = null;
  const BEAT_MS = 6500;
  function showBeat(n, user) {
    beat = (n + heroVideos.length) % heroVideos.length;
    heroVideos.forEach((v, i) => {
      const on = i === beat;
      v.classList.toggle('is-on', on);
      if (on) { playVideo(v); try { v.currentTime = 0; } catch (e) { /* not ready */ } } else if (!v.paused) setTimeout(() => v.pause(), 1600);
    });
    beats.forEach((b, i) => {
      b.classList.toggle('is-on', i === beat);
      b.classList.toggle('is-done', i < beat);
      b.setAttribute('aria-selected', String(i === beat));
      b.style.setProperty('--beat', BEAT_MS + 'ms');
    });
    const next = heroVideos[(beat + 1) % heroVideos.length];
    if (next && autoplayOK) ensureSrc(next);
    clearTimeout(beatTimer);
    if (autoplayOK) beatTimer = setTimeout(() => showBeat(beat + 1), BEAT_MS);
    if (user) track('hero_reel_select', { beat: beat + 1 });
  }
  if (heroVideos.length) {
    beats.forEach((b, i) => b.addEventListener('click', () => showBeat(i, true)));
    if (autoplayOK) {
      const first = heroVideos[0];
      ensureSrc(first);
      first.addEventListener('playing', () => { const p = $('.hero-poster'); if (p) p.style.opacity = '0'; }, { once: true });
      showBeat(0);
      const hio = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) { clearTimeout(beatTimer); heroVideos.forEach((v) => v.pause()); } else { showBeat(beat); }
      }, { threshold: 0.05 });
      hio.observe(hero);
    } else {
      beats.forEach((b) => b.classList.remove('is-on'));
    }
  }

  /* ---------- Pointer spotlight + tilt ---------- */
  $$('.spot').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      el.style.setProperty('--mx', x + 'px');
      el.style.setProperty('--my', y + 'px');
      if (el.classList.contains('stage-card') && !reduceMotion && e.pointerType === 'mouse') {
        const rx = ((y / r.height) - 0.5) * -6;
        const ry = ((x / r.width) - 0.5) * 6;
        el.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
      }
    });
    el.addEventListener('pointerleave', () => { if (el.classList.contains('stage-card')) el.style.transform = ''; });
  });

  /* ---------- Lesson architecture highlight ---------- */
  const bars = $$('.arch-bars span');
  $$('.arch-legend button').forEach((btn) => {
    const g = btn.dataset.hl;
    const on = () => { bars.forEach((b) => b.classList.toggle('is-hl', b.dataset.group === g)); $('.arch-bars').style.setProperty('--dim', '1'); $('.arch-bars').classList.add('is-tracing'); };
    const off = () => { bars.forEach((b) => b.classList.remove('is-hl')); $('.arch-bars').classList.remove('is-tracing'); };
    btn.addEventListener('mouseenter', on); btn.addEventListener('focus', on);
    btn.addEventListener('mouseleave', off); btn.addEventListener('blur', off);
  });
  bars.forEach((b) => b.addEventListener('mouseenter', () => bars.forEach((x) => x.classList.toggle('is-hl', x.dataset.group === b.dataset.group))));

  /* ---------- Stages & screens ---------- */
  const stageCards = $$('.stage-card');
  const stageCount = $('.js-stage-count');
  function activateItem(panel, id) {
    $$('.screen-item', panel).forEach((it) => {
      const on = it.id === id;
      it.classList.toggle('is-on', on);
      const v = $('video', it);
      if (v) { if (on) { ensurePoster(v); playVideo(v); } else v.pause(); }
    });
    $$('.rail-card', panel).forEach((c) => { const on = c.dataset.item === id; c.classList.toggle('is-on', on); c.setAttribute('aria-selected', String(on)); });
  }
  function activateStage(card, user) {
    const id = card.getAttribute('aria-controls');
    stageCards.forEach((c) => c.setAttribute('aria-selected', String(c === card)));
    $$('.stage-panel').forEach((p) => {
      const on = p.id === id;
      p.classList.toggle('is-on', on);
      if (on) { const cur = $('.screen-item.is-on', p); if (cur) activateItem(p, cur.id); } else { $$('video', p).forEach((v) => v.pause()); }
    });
    if (stageCount) stageCount.textContent = `${stageCards.indexOf(card) + 1} / ${stageCards.length} · Swipe through the stages`;
    if (user) {
      track('stage_select', { stage: card.dataset.stage });
      const panel = $('#' + id);
      if (panel && isSmall()) panel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  }
  stageCards.forEach((card) => card.addEventListener('click', () => activateStage(card, true)));
  $$('.stage-panel').forEach((panel) => {
    $$('.rail-card', panel).forEach((c) => c.addEventListener('click', () => { activateItem(panel, c.dataset.item); track('course_select', { item: c.dataset.item }); }));
  });
  const stageRail = $('.stage-cards');
  if (stageRail && stageCount) {
    stageRail.addEventListener('scroll', () => {
      const w = stageRail.scrollWidth / stageCards.length;
      const idx = Math.min(stageCards.length - 1, Math.round(stageRail.scrollLeft / w));
      stageCount.textContent = `${idx + 1} / ${stageCards.length} · Swipe through the stages`;
    }, { passive: true });
  }

  /* ---------- Framework model ---------- */
  const fwSvg = $('.fw-svg');
  const layers = $$('.fw-layer');
  function focusLayer(layer, key) {
    if (!fwSvg) return;
    fwSvg.classList.toggle('has-focus', !!layer);
    $$('[data-el]', fwSvg).forEach((g) => g.classList.toggle('is-focus', !!layer && g.dataset.layer === layer && (!key || g.dataset.key === key || g.dataset.layer === layer)));
  }
  function openLayer(name, user) {
    layers.forEach((l) => {
      const on = l.dataset.layer === name;
      l.classList.toggle('is-on', on);
      $('.fl-head', l).setAttribute('aria-expanded', String(on));
    });
    if (user) track('framework_layer', { layer: name });
  }
  layers.forEach((l) => {
    const head = $('.fl-head', l);
    head.addEventListener('click', () => openLayer(l.dataset.layer, true));
    l.addEventListener('mouseenter', () => focusLayer(l.dataset.layer));
    l.addEventListener('mouseleave', () => focusLayer(null));
    head.addEventListener('focus', () => focusLayer(l.dataset.layer));
    head.addEventListener('blur', () => focusLayer(null));
  });
  if (fwSvg) {
    $$('[data-el]', fwSvg).forEach((g) => {
      g.addEventListener('mouseenter', () => focusLayer(g.dataset.layer, g.dataset.key));
      g.addEventListener('mouseleave', () => focusLayer(null));
      const pick = () => openLayer(g.dataset.layer, true);
      g.addEventListener('click', pick);
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    });
  }
  const mToggle = $('.matrix-toggle');
  if (mToggle) {
    mToggle.addEventListener('click', () => {
      const open = mToggle.getAttribute('aria-expanded') !== 'true';
      mToggle.setAttribute('aria-expanded', String(open));
      $('#matrixBody').classList.toggle('is-open', open);
    });
  }

  /* ---------- Opportunities triptych ---------- */
  const trips = $$('.trip');
  trips.forEach((t) => {
    const open = () => { if (isSmall()) return; trips.forEach((x) => x.classList.toggle('is-open', x === t)); };
    t.addEventListener('mouseenter', open);
    t.addEventListener('focus', open);
    t.addEventListener('click', open);
  });

  /* ---------- Role explorer ---------- */
  const ROLES = [
    { t: 'Design, deliver and evaluate evidence-informed longevity and wellbeing initiatives.', d: 'For health promotion and public health professionals: assess population or community needs, build programs on the best available evidence, and review and communicate results to stakeholders.', a: ['org', 'com'] },
    { t: 'Add structured, non-diagnostic wellbeing assessment and behavior-change support to your role.', d: 'For nurses and other professionals in health systems: co-develop realistic plans, support goal setting and review progress, always within your existing license and the program’s non-clinical scope, and refer when specialist input is needed.', a: ['ind', 'org'] },
    { t: 'Assess workforce needs and embed wellbeing into organizational practice and culture.', d: 'For welfare, employee-wellbeing and HR managers: lead or contribute to wellbeing initiatives, advise teams on applying healthy-longevity principles, and evaluate and refine programs over time.', a: ['org'] },
    { t: 'Develop and review community programs that support healthy aging across the life course.', d: 'For professionals and program staff in local authorities: identify community priorities, coordinate cross-sector initiatives, and build supportive environments for social participation.', a: ['com', 'org'] },
    { t: 'Bring evidence-informed wellbeing planning to community-based and residential elder care.', d: 'For elder-care professionals: structured, non-diagnostic assessment, realistic plans, and approaches to purpose and social connection that support healthy aging, with clear referral when needed.', a: ['com', 'ind'] },
    { t: 'Turn longevity evidence into practical programs and resources for the people you serve.', d: 'For nonprofit, civil-society and community organizations: develop evidence-informed plans, interventions or educational resources that address a defined longevity or wellbeing need.', a: ['com', 'org'] },
    { t: 'Add a defined advisory specialization to work in health, education or community programming.', d: 'For other qualified professionals whose current role includes health, wellbeing, education, workforce development or community programming, or who want to build an independent coaching or advisory practice.', a: ['ind', 'org', 'com'] }
  ];
  const ARENA = { org: ['Within organizations', 'var(--s1)'], ind: ['With individuals', 'var(--s2)'], com: ['In communities', 'var(--s3)'] };
  const roleChips = $$('.role-chip');
  roleChips.forEach((chip) => chip.addEventListener('click', () => {
    const r = ROLES[+chip.dataset.role];
    roleChips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    $('.js-role-t').textContent = r.t;
    $('.js-role-d').textContent = r.d;
    $('.js-role-tags').innerHTML = r.a.map((k) => `<span class="chip chip-dot" style="--c:${ARENA[k][1]}">${ARENA[k][0]}</span>`).join('');
    track('role_select', { role: chip.textContent.trim() });
  }));

  /* ---------- Tuition toggle ---------- */
  $$('.plan-switch button').forEach((b) => b.addEventListener('click', () => {
    $$('.plan-switch button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $$('.price-view').forEach((v) => v.classList.toggle('is-on', v.dataset.view === b.dataset.plan));
    track('tuition_view', { plan: b.dataset.plan });
  }));

  /* ---------- FAQ ---------- */
  $$('.faq-q').forEach((q) => q.addEventListener('click', () => {
    const open = q.getAttribute('aria-expanded') !== 'true';
    q.setAttribute('aria-expanded', String(open));
    q.nextElementSibling.classList.toggle('is-open', open);
    if (open) track('faq_open', { question: q.textContent.trim().slice(3, 80) });
  }));

  /* ---------- Insights rail ---------- */
  const insRail = $('.ins-rail');
  const step = () => (insRail.firstElementChild ? insRail.firstElementChild.getBoundingClientRect().width + 18 : 320);
  const prev = $('.js-ins-prev');
  const next = $('.js-ins-next');
  if (insRail && prev && next) {
    prev.addEventListener('click', () => insRail.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => insRail.scrollBy({ left: step(), behavior: 'smooth' }));
  }

  /* ---------- Classroom clock ---------- */
  const clock = $('.js-clock');
  if (clock && !reduceMotion) {
    let s = 27 * 60 + 41;
    setInterval(() => { s += 1; const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, ss = s % 60; clock.textContent = [h, m, ss].map((n) => String(n).padStart(2, '0')).join(':'); }, 1000);
  }

  /* ---------- WhatsApp ---------- */
  if (CFG.whatsapp) {
    $$('.js-wa').forEach((a) => {
      const text = encodeURIComponent('Hello, I would like to learn more about the Professional Certificate in Longevity and Lifelong Wellbeing Advisory Practice.');
      a.href = `https://api.whatsapp.com/send/?phone=${CFG.whatsapp}&text=${text}`;
      a.addEventListener('click', () => track('whatsapp_click', { location: a.dataset.cta || 'inline' }));
    });
  }

  /* ---------- Lead form ---------- */
  const form = $('#leadForm');
  if (form) {
    const steps = $$('.fstep', form);
    const dots = $$('.steps span');
    const back = $('.fback', form);
    const nextBtn = $('.js-next', form);
    let cur = 0;
    const params = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'].forEach((k) => { if (params.get(k)) form.elements[k].value = params.get(k); });
    form.elements.landing_page.value = location.href.split('#')[0];
    form.elements.referrer.value = document.referrer || '';

    $$('[data-interest]').forEach((a) => a.addEventListener('click', () => {
      const v = a.dataset.interest;
      const pathway = v === 'full' ? 'full' : v === 'single' ? 'single' : null;
      if (pathway) { const r = form.querySelector(`input[name="pathway"][value="${pathway}"]`); if (r) r.checked = true; }
      if (v === 'sponsor') { const o = form.elements.objective; o.value = 'Sponsor or train staff in my organization'; }
    }));
    $$('[data-cta]').forEach((a) => a.addEventListener('click', () => track('cta_click', { location: a.dataset.cta })));

    const labelFor = (i) => ['Continue', 'Continue', 'Submit & verify', 'Verify & finish'][i];
    function setStep(i) {
      cur = i;
      steps.forEach((s, k) => s.classList.toggle('is-on', k === i));
      dots.forEach((d, k) => { d.classList.toggle('is-on', k === i); d.classList.toggle('is-done', k < i); });
      back.hidden = i === 0;
      nextBtn.firstChild.textContent = labelFor(i);
      const first = steps[i].querySelector('input:not([type=hidden]), select');
      if (first && i > 0) setTimeout(() => first.focus({ preventScroll: true }), 50);
    }
    function validate(i) {
      let ok = true;
      const s = steps[i];
      $$('.field', s).forEach((f) => f.classList.remove('has-error'));
      $$('input[required], select[required]', s).forEach((el) => {
        if (el.type === 'radio') return;
        if (el.type === 'checkbox') return;
        let valid = !!el.value.trim();
        if (valid && el.type === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim());
        if (valid && el.type === 'tel') valid = el.value.replace(/\D/g, '').length >= 7;
        if (!valid) { ok = false; el.closest('.field').classList.add('has-error'); }
      });
      $$('[data-required-group]', s).forEach((g) => {
        const name = g.querySelector('input').name;
        if (!form.querySelector(`input[name="${name}"]:checked`)) { ok = false; g.closest('.field').classList.add('has-error'); }
      });
      const consent = s.querySelector('input[name="consent"]');
      if (consent) { const e = $('.js-consent-err', s); e.style.display = consent.checked ? 'none' : 'block'; if (!consent.checked) ok = false; }
      if (!ok) { const bad = s.querySelector('.has-error input, .has-error select'); if (bad) bad.focus(); }
      return ok;
    }
    const otp = $$('.otp input', form);
    otp.forEach((inp, k) => {
      inp.addEventListener('input', () => { inp.value = inp.value.replace(/\D/g, '').slice(0, 1); if (inp.value && otp[k + 1]) otp[k + 1].focus(); });
      inp.addEventListener('keydown', (e) => { if (e.key === 'Backspace' && !inp.value && otp[k - 1]) otp[k - 1].focus(); });
      inp.addEventListener('paste', (e) => {
        const d = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
        if (d.length > 1) { e.preventDefault(); otp.forEach((o, j) => { o.value = d[j] || ''; }); (otp[d.length] || otp[5]).focus(); }
      });
    });
    function payload() {
      const fd = new FormData(form);
      const data = {};
      fd.forEach((v, k) => { if (data[k]) data[k] = [].concat(data[k], v); else data[k] = v; });
      data.program = 'Professional Certificate in Longevity and Lifelong Wellbeing Advisory Practice';
      data.source = 'LLA × Bar-Ilan pre-pilot landing page';
      data.submitted_at = new Date().toISOString();
      return data;
    }
    function sendToCRM(data) {
      if (!CFG.crmEndpoint) return Promise.resolve({ preview: true });
      return fetch(CFG.crmEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    }
    back.addEventListener('click', () => setStep(Math.max(0, cur - 1)));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (cur < 3) {
        if (!validate(cur)) { track('lead_form_error', { step: cur + 1 }); return; }
        track('lead_form_step', { step: cur + 1 });
        if (cur === 2) {
          $('.js-phone-echo').textContent = `${form.elements.phone_country_code.value} ${form.elements.phone.value}`;
          sendToCRM(Object.assign(payload(), { status: 'unverified' })).catch(() => {});
          track('lead_submit_unverified', { pathway: form.querySelector('input[name="pathway"]:checked').value, timeline: form.querySelector('input[name="enrollment_timeline"]:checked').value });
        }
        setStep(cur + 1);
        return;
      }
      const code = otp.map((o) => o.value).join('');
      const err = $('.js-otp-err', form);
      if (code.length < 6) { err.style.display = 'block'; otp[code.length].focus(); return; }
      err.style.display = 'none';
      sendToCRM(Object.assign(payload(), { status: 'verified' })).catch(() => {});
      track('generate_lead', { form: 'lla-barilan-interest', verified: true });
      if (window.fbq) window.fbq('track', 'Lead');
      if (window.gtag && !isPlaceholder(CFG.googleAds) && !isPlaceholder(CFG.googleAdsLeadLabel)) window.gtag('event', 'conversion', { send_to: `${CFG.googleAds}/${CFG.googleAdsLeadLabel}` });
      const name = form.elements.first_name.value.trim();
      $('.js-thanks-name').textContent = name ? `, ${name}` : '';
      form.hidden = true;
      $('.steps').hidden = true;
      $('.thanks').classList.add('is-on');
      $('.thanks').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    });
    setStep(0);
  }

  /* ---------- Consent + analytics ---------- */
  const consent = $('.consent');
  const KEY = 'lla_barilan_consent_v1';
  function loadScript(src) { const s = document.createElement('script'); s.async = true; s.src = src; document.head.appendChild(s); }
  function applyConsent(c) {
    gtag('consent', 'update', {
      analytics_storage: c.analytics ? 'granted' : 'denied',
      ad_storage: c.ads ? 'granted' : 'denied',
      ad_user_data: c.ads ? 'granted' : 'denied',
      ad_personalization: c.ads ? 'granted' : 'denied'
    });
    const gid = !isPlaceholder(CFG.ga4) ? CFG.ga4 : (!isPlaceholder(CFG.googleAds) ? CFG.googleAds : null);
    if ((c.analytics || c.ads) && gid && !window.__gtagLoaded) {
      window.__gtagLoaded = true;
      loadScript(`https://www.googletagmanager.com/gtag/js?id=${gid}`);
      gtag('js', new Date());
      if (!isPlaceholder(CFG.ga4)) gtag('config', CFG.ga4, { anonymize_ip: true });
      if (!isPlaceholder(CFG.googleAds)) gtag('config', CFG.googleAds);
    }
    if (c.ads && !isPlaceholder(CFG.metaPixel) && !window.fbq) {
      /* Meta Pixel base code */
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', CFG.metaPixel);
      window.fbq('track', 'PageView');
    }
  }
  function saveConsent(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) { /* storage blocked */ } applyConsent(c); consent.classList.remove('is-open'); track('consent_update', c); }
  if (consent) {
    let stored = null;
    try { stored = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { stored = null; }
    if (stored) applyConsent(stored); else setTimeout(() => consent.classList.add('is-open'), 1600);
    $('.js-c-accept', consent).addEventListener('click', () => saveConsent({ analytics: true, ads: true }));
    $('.js-c-reject', consent).addEventListener('click', () => saveConsent({ analytics: false, ads: false }));
    $('.js-c-prefs', consent).addEventListener('click', () => { consent.classList.add('show-prefs'); $('.js-c-save', consent).hidden = false; $('.js-c-prefs', consent).hidden = true; });
    $('.js-c-save', consent).addEventListener('click', () => saveConsent({ analytics: $('.js-c-analytics', consent).checked, ads: $('.js-c-ads', consent).checked }));
    $$('.js-consent-open').forEach((b) => b.addEventListener('click', () => { consent.classList.add('is-open', 'show-prefs'); $('.js-c-save', consent).hidden = false; $('.js-c-prefs', consent).hidden = true; }));
  }

  track('lp_view', { page: 'lla-barilan-certificate' });
})();
