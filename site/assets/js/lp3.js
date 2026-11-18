(function () {
  'use strict';
  var doc = document.documentElement;
  var cfg = window.LLA_CONFIG || {};
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var small = function () { return window.matchMedia('(max-width: 760px)').matches; };
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var motion = !reduce && hasGsap;
  var playOK = !reduce && !saveData;
  window.dataLayer = window.dataLayer || [];
  var track = function (event, params) { var o = { event: event }; if (params) for (var k in params) o[k] = params[k]; window.dataLayer.push(o); };
  var isPlaceholder = function (v) { return !v || /X{4,}/.test(v); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  if (!motion) doc.classList.remove('anim');

  /* ---------- Video helpers ---------- */
  function poster(v) { if (v && v.dataset.poster && !v.getAttribute('poster')) v.setAttribute('poster', v.dataset.poster); }
  function load(v) {
    if (!v || v.dataset.loaded) return;
    poster(v);
    var src = (small() && v.dataset.srcSm) || v.dataset.src;
    if (!src) return;
    v.dataset.loaded = '1'; v.muted = true; v.src = src;
  }
  function play(v) { if (!v) return; poster(v); if (!playOK) return; load(v); var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  function pause(v) { if (v && v.dataset.loaded && !v.paused) v.pause(); }

  /* ---------- Smooth scroll ---------- */
  var lenis = null;
  if (motion && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    lenis.on('scroll', window.ScrollTrigger.update);
    window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    window.gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
  }
  function scrollToTarget(el) {
    var off = small() ? -70 : -86;
    if (lenis) lenis.scrollTo(el, { offset: off, duration: 1.4 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + off, behavior: reduce ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var el = document.getElementById(id.slice(1));
    if (!el) return;
    e.preventDefault();
    setMenu(false);
    scrollToTarget(el);
    history.replaceState(null, '', id);
  });

  /* ---------- Header, menu, floating ---------- */
  var hdr = $('.hdr'), hero = $('.hero'), mcta = $('.mcta'), wa = $('.wa'), formSec = document.getElementById('register');
  function onScroll() {
    var y = window.scrollY || 0;
    if (hdr) hdr.classList.toggle('on', y > 30);
    if (hero) {
      var past = hero.getBoundingClientRect().bottom < window.innerHeight * 0.4;
      var atForm = formSec ? formSec.getBoundingClientRect().top < window.innerHeight * 0.85 : false;
      if (mcta) mcta.classList.toggle('show', past && !atForm);
      if (wa) wa.classList.toggle('show', past && !atForm);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  var mbtn = $('.mbtn'), mnav = $('.mnav');
  function setMenu(open) {
    doc.classList.toggle('menu-open', open);
    if (mbtn) mbtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (mnav) mnav.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (lenis) { open ? lenis.stop() : lenis.start(); } else { document.body.style.overflow = open ? 'hidden' : ''; }
  }
  if (mbtn) mbtn.addEventListener('click', function () { setMenu(!doc.classList.contains('menu-open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Hero reel ---------- */
  var beats = $$('.reel video'), labels = $$('.reelnav button'), grade = $('.grade');
  var BEAT = 6500, cur = 0, timer = null, warm = null;
  function show(i) {
    cur = (i + beats.length) % beats.length;
    beats.forEach(function (v, k) {
      var on = k === cur;
      v.classList.toggle('on', on);
      if (on) { poster(v); if (playOK) { try { v.currentTime = 0; } catch (e) {} play(v); } }
      else setTimeout(function () { if (!v.classList.contains('on')) pause(v); }, 1900);
    });
    if (grade && beats[cur].dataset.tint) grade.style.setProperty('--tint', beats[cur].dataset.tint);
    labels.forEach(function (b, k) { b.classList.toggle('on', k === cur); b.setAttribute('aria-pressed', k === cur ? 'true' : 'false'); var bar = b.querySelector('i'); if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; } });
    var nx = beats[(cur + 1) % beats.length];
    clearTimeout(warm);
    if (nx && nx !== beats[cur]) warm = setTimeout(function () { poster(nx); if (playOK) { load(nx); nx.preload = 'auto'; } }, 2500);
    clearTimeout(timer);
    if (playOK) timer = setTimeout(function () { show(cur + 1); }, BEAT);
  }
  if (beats.length) {
    doc.style.setProperty('--beat', (BEAT / 1000) + 's');
    labels.forEach(function (b, k) { b.addEventListener('click', function () { show(k); }); });
    show(0);
    document.addEventListener('visibilitychange', function () { if (document.hidden) { clearTimeout(timer); beats.forEach(pause); } else show(cur); });
  }

  /* ---------- Lazy background videos ---------- */
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { poster(en.target); play(en.target); } else pause(en.target); });
    }, { rootMargin: '300px 0px' });
    $$('video[data-lazy]').forEach(function (v) { vio.observe(v); });
  } else { $$('video[data-lazy]').forEach(poster); }

  /* ---------- Swipers ---------- */
  var swipers = {};
  function ctrl(name) { var c = $('.ctrl[data-for="' + name + '"]'); return { pg: c && c.querySelector('.pg'), prev: c && c.querySelector('.prev'), next: c && c.querySelector('.next'), count: c && c.querySelector('.count') }; }
  function playVisible(sw) {
    if (!sw.el.__near) return;
    sw.slides.forEach(function (s) {
      var v = s.querySelector('video'); if (!v) return;
      var vis = s.classList.contains('swiper-slide-visible') || s.classList.contains('swiper-slide-active');
      if (vis) play(v); else { poster(v); pause(v); }
    });
  }
  var auto = function (delay) { return reduce ? false : { delay: delay, disableOnInteraction: false, pauseOnMouseEnter: true }; };
  if (window.Swiper) {
    var c1 = ctrl('steps');
    swipers.steps = new window.Swiper('.steps-sw', {
      updateOnImagesReady: false,
      effect: 'cards', grabCursor: true, speed: 700,
      cardsEffect: { perSlideOffset: 9, perSlideRotate: 3, rotate: true, slideShadows: false },
      pagination: { el: c1.pg, clickable: true }, navigation: { nextEl: c1.next, prevEl: c1.prev },
      keyboard: { enabled: true, onlyInViewport: true }, autoplay: auto(4200), a11y: { enabled: true }
    });
    var c2 = ctrl('aud');
    swipers.aud = new window.Swiper('.aud-sw', {
      updateOnImagesReady: false,
      slidesPerView: 1.18, spaceBetween: 14, grabCursor: true, speed: 650, rewind: true,
      breakpoints: { 560: { slidesPerView: 1.6 }, 760: { slidesPerView: 2.15, spaceBetween: 18 }, 1080: { slidesPerView: 2.2, spaceBetween: 18 } },
      pagination: { el: c2.pg, clickable: true }, navigation: { nextEl: c2.next, prevEl: c2.prev },
      keyboard: { enabled: true, onlyInViewport: true }, autoplay: auto(3600), a11y: { enabled: true }
    });
    var c3 = ctrl('cur');
    var colors = $$('.cur-sw .course').map(function (c) { return getComputedStyle(c).getPropertyValue('--c').trim() || '#9FD8FF'; });
    swipers.cur = new window.Swiper('.cur-sw', {
      updateOnImagesReady: false,
      effect: 'coverflow', centeredSlides: true, slidesPerView: 'auto', loop: true, spaceBetween: 14, grabCursor: true, speed: 800, watchSlidesProgress: true,
      coverflowEffect: { rotate: 10, stretch: 0, depth: 140, modifier: 1, slideShadows: false },
      breakpoints: { 760: { spaceBetween: 34, coverflowEffect: { rotate: 14, stretch: 0, depth: 200, modifier: 1, slideShadows: false } } },
      pagination: { el: c3.pg, clickable: true, renderBullet: function (i, cls) { return '<span class="' + cls + '" style="--bc:' + colors[i] + '" aria-label="Go to course ' + (i + 1) + '"></span>'; } },
      navigation: { nextEl: c3.next, prevEl: c3.prev }, keyboard: { enabled: true, onlyInViewport: true }, a11y: { enabled: true },
      on: {
        init: function (sw) { updCount(sw); },
        slideChange: function (sw) { updCount(sw); },
        transitionEnd: function (sw) { playActive(sw); }
      }
    });
    function updCount(sw) { if (c3.count) c3.count.textContent = String(sw.realIndex + 1).padStart(2, '0') + ' / ' + String(sw.slides.length).padStart(2, '0'); }
    function playActive(sw) { if (!sw.el.__near) return; sw.slides.forEach(function (s, i) { var v = s.querySelector('video'); if (!v) return; if (i === sw.activeIndex) play(v); else { poster(v); pause(v); } }); }
    var c4 = ctrl('mom');
    swipers.mom = new window.Swiper('.mom-sw', {
      updateOnImagesReady: false,
      slidesPerView: 'auto', spaceBetween: 16, loop: true, grabCursor: true, speed: 900, watchSlidesProgress: true,
      pagination: { el: c4.pg, clickable: true }, navigation: { nextEl: c4.next, prevEl: c4.prev },
      keyboard: { enabled: true, onlyInViewport: true }, autoplay: auto(2800), a11y: { enabled: true },
      on: { slideChangeTransitionEnd: function (sw) { playVisible(sw); } }
    });
    var c5 = ctrl('ins');
    swipers.ins = new window.Swiper('.ins-sw', {
      updateOnImagesReady: false,
      slidesPerView: 1.14, spaceBetween: 16, grabCursor: true, speed: 700, rewind: true,
      breakpoints: { 560: { slidesPerView: 1.6, spaceBetween: 18 }, 760: { slidesPerView: 1.75, spaceBetween: 20 }, 1080: { slidesPerView: 2.6, spaceBetween: 20 }, 1400: { slidesPerView: 3.05, spaceBetween: 22 } },
      pagination: { el: c5.pg, clickable: true }, navigation: { nextEl: c5.next, prevEl: c5.prev },
      keyboard: { enabled: true, onlyInViewport: true }, autoplay: auto(5000), a11y: { enabled: true }
    });
    // Posters load only when a slider approaches; videos and autoplay run only while it is on screen
    if ('IntersectionObserver' in window) {
      var nio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.__near = true; nio.unobserve(en.target);
          $$('video', en.target).forEach(poster);
        });
      }, { rootMargin: '800px 0px' });
      $$('.swiper').forEach(function (el) { nio.observe(el); });
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var sw = en.target.swiper; if (!sw) return;
          if (en.isIntersecting) {
            if (sw.autoplay && sw.params.autoplay && sw.params.autoplay.enabled !== false && !reduce) sw.autoplay.start();
            if (sw === swipers.cur) playActive(sw); else if (sw === swipers.mom) playVisible(sw);
          } else {
            if (sw.autoplay && sw.autoplay.running) sw.autoplay.stop();
            sw.slides.forEach(function (s) { var v = s.querySelector('video'); if (v) pause(v); });
          }
        });
      }, { threshold: 0.15 });
      $$('.swiper').forEach(function (el) { sio.observe(el); });
    } else {
      $$('.swiper').forEach(function (el) { el.__near = true; $$('video', el).forEach(poster); });
    }
    window.__swipers = swipers;
  }

  /* ---------- Tilt + specular ---------- */
  if (fine && !reduce) {
    $$('[data-tilt]').forEach(function (el) {
      var max = parseFloat(el.dataset.tilt) || 4;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.transform = 'perspective(1200px) rotateY(' + ((x - 0.5) * max).toFixed(2) + 'deg) rotateX(' + ((0.5 - y) * max).toFixed(2) + 'deg) translateZ(0)';
        el.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
    $$('.g3:not([data-tilt]), .card-b:not([data-tilt])').forEach(function (el) {
      el.addEventListener('pointermove', function (e) { var r = el.getBoundingClientRect(); el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%'); el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%'); });
    });
  }

  /* ---------- Split headings ---------- */
  function splitEl(root) {
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var parts = n.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w';
            var inner = document.createElement('span'); inner.textContent = p; w.appendChild(inner); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') { walk(n); }
      });
    };
    walk(root);
  }
  function fixGrad() {
    $$('[data-split] .grad').forEach(function (g) {
      var gr = g.getBoundingClientRect();
      $$('.w > span', g).forEach(function (s) {
        var r = s.getBoundingClientRect();
        s.style.backgroundImage = getComputedStyle(g).backgroundImage;
        s.style.backgroundSize = Math.max(gr.width, 1) + 'px ' + Math.max(gr.height, 1) + 'px';
        s.style.backgroundPosition = (gr.left - r.left) + 'px ' + (gr.top - r.top) + 'px';
        s.style.webkitBackgroundClip = 'text'; s.style.backgroundClip = 'text';
        s.style.color = 'transparent'; s.style.webkitTextFillColor = 'transparent';
      });
    });
  }

  /* ---------- Counters ---------- */
  function countUp(el, delay) {
    var to = parseFloat(el.dataset.count); if (isNaN(to)) return;
    if (!motion) { el.textContent = to; return; }
    var o = { v: 0 }; el.textContent = '0';
    window.gsap.to(o, { v: to, duration: to > 50 ? 2.2 : 1.6, delay: delay || 0, ease: 'power3.out', onUpdate: function () { el.textContent = Math.round(o.v); } });
  }

  /* ---------- GSAP choreography ---------- */
  if (motion) {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);
    ST.config({ ignoreMobileResize: true });
    // Pinned "Why now"
    var why = $('.why .stage');
    if (why) {
      var chaps = $$('.why .chap'), figs = $$('.why .media figure'), bars = $$('.why .progress b'), active = -1, whyNear = false;
      var setChap = function (i, quiet) {
        if (i === active) return; active = i;
        chaps.forEach(function (c, k) { c.classList.toggle('on', k === i); });
        figs.forEach(function (f, k) { f.classList.toggle('on', k === i); var v = f.querySelector('video'); if (k === i) { if (whyNear) play(v); else poster(v); } else pause(v); });
        if (!quiet) track('why_chapter', { chapter: i + 1 });
      };
      setChap(0, true);
      ST.create({
        trigger: why, start: 'top top', end: '+=' + (chaps.length * 85) + '%', pin: true, pinSpacing: true, anticipatePin: 1,
        onUpdate: function (self) {
          var p = self.progress * chaps.length, i = Math.min(chaps.length - 1, Math.floor(p));
          setChap(i);
          bars.forEach(function (b, k) { b.style.transform = 'scaleX(' + Math.max(0, Math.min(1, p - k)).toFixed(3) + ')'; });
        }
      });
      ST.create({
        trigger: why.closest('section') || why, start: 'top bottom', end: 'bottom top',
        onToggle: function (self) {
          whyNear = self.isActive;
          var f = figs[active], v = f && f.querySelector('video');
          if (whyNear) play(v); else figs.forEach(function (g) { pause(g.querySelector('video')); });
        }
      });
    }
    $$('[data-split]').forEach(function (h) { splitEl(h); h.style.visibility = 'visible'; });
    fixGrad();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fixGrad(); ST.refresh(); });
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(fixGrad, 200); });

    // Hero intro
    var tl = gsap.timeline({ delay: 0.15 });
    tl.fromTo('.hero .chips-top', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' })
      .fromTo('.hero h1 .w > span', { yPercent: 115 }, { yPercent: 0, duration: 1.2, ease: 'power4.out', stagger: 0.06 }, '-=0.5')
      .fromTo('.hero .sub', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.7')
      .fromTo('.hero .ctas', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.75')
      .fromTo('.hero .counters', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', onStart: function () { $$('.hero [data-count]').forEach(function (el, i) { countUp(el, i * 0.12); }); } }, '-=0.7');

    // Split headings
    $$('[data-split]').forEach(function (h) {
      if (h.closest('.hero')) return;
      gsap.fromTo($$('.w > span', h), { yPercent: 115 }, { yPercent: 0, duration: 1.15, ease: 'power4.out', stagger: 0.045, scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
    });
    // Reveals
    $$('[data-rv]').forEach(function (el) {
      if (el.closest('.hero')) return;
      gsap.fromTo(el, { y: 46, opacity: 0 }, { y: 0, opacity: 1, duration: 1.15, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    // Counters outside hero
    $$('[data-count]').forEach(function (el) {
      if (el.closest('.hero')) return;
      ST.create({ trigger: el, start: 'top 90%', once: true, onEnter: function () { countUp(el, 0); } });
    });
    // Weight bar
    gsap.fromTo('.wbar span', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: '.wbar', start: 'top 85%', once: true } });
    // Parallax layers
    $$('[data-par]').forEach(function (el) {
      var f = parseFloat(el.dataset.par) || 0.1, sec = el.closest('section') || el.parentElement;
      gsap.fromTo(el, { y: -f * 400 }, { y: f * 400, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    window.addEventListener('load', function () { fixGrad(); ST.refresh(); });
  } else {
    $$('[data-count]').forEach(function (el) { el.textContent = el.dataset.count; });
    var whyFig = $('.why .media figure.on video'); if (whyFig) poster(whyFig);
  }

  /* ---------- FAQ ---------- */
  var dets = $$('.faq details');
  dets.forEach(function (d, i) { d.addEventListener('toggle', function () { if (!d.open) return; dets.forEach(function (o) { if (o !== d) o.open = false; }); track('faq_open', { faq_index: i + 1 }); if (motion) window.ScrollTrigger.refresh(); }); });

  /* ---------- WhatsApp ---------- */
  if (wa && cfg.whatsapp) wa.href = 'https://wa.me/' + cfg.whatsapp + '?text=' + encodeURIComponent('Hello, I would like information about the Professional Certificate in Longevity and Lifelong Wellbeing Advisory Practice.');

  /* ---------- Lead form ---------- */
  var form = document.getElementById('lead-form');
  if (form) {
    var qs = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'].forEach(function (k) { var el = form.querySelector('[name="' + k + '"]'); if (el && qs.get(k)) el.value = qs.get(k); });
    var started = false;
    form.addEventListener('input', function () { if (!started) { started = true; track('lead_form_start'); } });
    var check = function (el) {
      var v = (el.value || '').trim(), ok;
      if (el.type === 'checkbox') ok = el.checked;
      else if (el.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      else if (el.type === 'tel') ok = v.replace(/\D/g, '').length >= 7;
      else ok = v.length > 0;
      var wrap = el.closest('.fld'), err = wrap ? wrap.querySelector('.err') : form.querySelector('.consent-err');
      if (wrap) wrap.classList.toggle('bad', !ok);
      if (err) err.textContent = ok ? '' : (el.dataset.msg || 'Please complete this field.');
      el.setAttribute('aria-invalid', ok ? 'false' : 'true');
      return ok;
    };
    $$('[required]', form).forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value || el.type === 'checkbox') check(el); });
      el.addEventListener('change', function () { if (el.closest('.fld.bad') || el.type === 'checkbox') check(el); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, first = null;
      $$('[required]', form).forEach(function (el) { if (!check(el)) { ok = false; if (!first) first = el; } });
      if (!ok) { if (first) first.focus(); track('lead_form_error'); return; }
      var data = {}; new FormData(form).forEach(function (v, k) { data[k] = v; });
      data.page = location.href; data.submitted_at = new Date().toISOString();
      var btn = form.querySelector('button[type="submit"]'); if (btn) btn.disabled = true;
      var done = function () {
        form.hidden = true; var t = document.getElementById('thanks'); if (t) { t.hidden = false; t.focus(); }
        track('generate_lead', { enrollment_timing: data.timing, main_goal: data.goal });
        if (motion) window.ScrollTrigger.refresh();
      };
      if (cfg.crmEndpoint) fetch(cfg.crmEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(done, done);
      else done();
    });
  }

  /* ---------- Consent ---------- */
  var KEY = 'lla_barilan_consent_v1', cookie = $('.cookie');
  function applyConsent(c) {
    if (typeof window.gtag === 'function') window.gtag('consent', 'update', { analytics_storage: c.analytics ? 'granted' : 'denied', ad_storage: c.ads ? 'granted' : 'denied', ad_user_data: c.ads ? 'granted' : 'denied', ad_personalization: c.ads ? 'granted' : 'denied' });
    if (c.analytics && !isPlaceholder(cfg.ga4)) { var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + cfg.ga4; document.head.appendChild(s); window.gtag('js', new Date()); window.gtag('config', cfg.ga4); if (c.ads && !isPlaceholder(cfg.googleAds)) window.gtag('config', cfg.googleAds); }
    if (c.ads && !isPlaceholder(cfg.metaPixel)) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', cfg.metaPixel); window.fbq('track', 'PageView');
    }
  }
  var saved = null; try { saved = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  if (saved) applyConsent(saved); else if (cookie) cookie.hidden = false;
  $$('[data-cookie-settings]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); if (cookie) cookie.hidden = false; }); });
  $$('[data-consent]').forEach(function (b) { b.addEventListener('click', function () { var all = b.dataset.consent === 'all', c = { analytics: all, ads: all }; try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} if (cookie) cookie.hidden = true; applyConsent(c); }); });

  window.__lp3ready = true;
})();
