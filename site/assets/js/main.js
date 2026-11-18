(function () {
  'use strict';
  var doc = document.documentElement;
  var cfg = window.LLA_CONFIG || {};
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var small = function () { return window.matchMedia('(max-width: 760px)').matches; };
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  window.dataLayer = window.dataLayer || [];
  var track = function (event, params) { var o = { event: event }; if (params) for (var k in params) o[k] = params[k]; window.dataLayer.push(o); };
  var isPlaceholder = function (v) { return !v || /X{4,}/.test(v); };

  /* Header + mobile CTA */
  var hdr = document.querySelector('.hdr');
  var hero = document.querySelector('.hero');
  var mcta = document.querySelector('.mcta');
  var formSec = document.getElementById('register');
  var waEl = document.querySelector('.wa');
  function onScroll() {
    var y = window.scrollY;
    if (hdr) hdr.classList.toggle('on', y > 30);
    if (mcta && hero) {
      var past = hero.getBoundingClientRect().bottom < window.innerHeight * 0.4;
      var atForm = formSec ? formSec.getBoundingClientRect().top < window.innerHeight * 0.9 : false;
      mcta.classList.toggle('show', past && !atForm);
      if (waEl) waEl.classList.toggle('show', past && !atForm);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var mbtn = document.querySelector('.menu-btn');
  var mnav = document.querySelector('.mnav');
  function setMenu(open) {
    doc.classList.toggle('menu-open', open);
    if (mbtn) mbtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (mnav) mnav.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (mbtn) mbtn.addEventListener('click', function () { setMenu(!doc.classList.contains('menu-open')); });
  if (mnav) mnav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* Video helpers */
  function srcFor(v) { return (small() && v.dataset.srcSm) || v.dataset.src; }
  function poster(v) { if (v && v.dataset.poster && !v.getAttribute('poster')) v.setAttribute('poster', v.dataset.poster); }
  function load(v) {
    if (!v || v.dataset.loaded) return;
    poster(v);
    var s = srcFor(v);
    if (!s) return;
    v.dataset.loaded = '1';
    v.src = s;
    v.muted = true;
  }
  function play(v) { if (!v) return; load(v); var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  var motionOK = !reduce && !saveData;

  /* Hero reel */
  var reel = document.querySelector('.reel');
  var beats = reel ? Array.prototype.slice.call(reel.querySelectorAll('video')) : [];
  var labels = Array.prototype.slice.call(document.querySelectorAll('.reel-ui button'));
  var BEAT = 6500, cur = 0, timer = null;
  function show(i) {
    cur = (i + beats.length) % beats.length;
    beats.forEach(function (v, k) {
      var on = k === cur;
      v.classList.toggle('on', on);
      if (on) { if (motionOK) { try { v.currentTime = 0; } catch (e) {} play(v); } }
      else if (motionOK) { setTimeout(function () { if (!v.classList.contains('on')) v.pause(); }, 1700); }
    });
    labels.forEach(function (b, k) {
      b.classList.toggle('on', k === cur);
      b.setAttribute('aria-pressed', k === cur ? 'true' : 'false');
      var bar = b.querySelector('i'); if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; }
    });
    var nx = beats[(cur + 1) % beats.length]; if (nx) { poster(nx); if (motionOK) { load(nx); nx.preload = 'auto'; } }
    poster(beats[cur]);
    clearTimeout(timer);
    if (motionOK) timer = setTimeout(function () { show(cur + 1); }, BEAT);
  }
  if (beats.length) {
    document.documentElement.style.setProperty('--beat', (BEAT / 1000) + 's');
    labels.forEach(function (b, k) { b.addEventListener('click', function () { show(k); }); });
    show(0);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { clearTimeout(timer); beats.forEach(function (v) { v.pause(); }); }
      else show(cur);
    });
  }

  /* Lazy background videos */
  var bgs = document.querySelectorAll('video[data-lazy]');
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { poster(e.target); if (motionOK) play(e.target); }
        else if (e.target.dataset.loaded) e.target.pause();
      });
    }, { rootMargin: '400px 0px' });
    bgs.forEach(function (v) { vio.observe(v); });
  } else { bgs.forEach(poster); }

  /* Reveal */
  var rs = document.querySelectorAll('[data-r]');
  if (!reduce && 'IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rs.forEach(function (el) { rio.observe(el); });
  } else {
    rs.forEach(function (el) { el.classList.add('in'); });
  }

  /* Parallax */
  var pars = Array.prototype.slice.call(document.querySelectorAll('[data-par]'));
  if (pars.length && !reduce) {
    var ticking = false;
    var runPar = function () {
      var vh = window.innerHeight;
      pars.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var f = parseFloat(el.dataset.par) || 0.08;
        var d = (r.top + r.height / 2 - vh / 2) * -f;
        el.style.transform = 'translate3d(0,' + d.toFixed(1) + 'px,0)';
      });
      ticking = false;
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(runPar); } }, { passive: true });
    window.addEventListener('resize', runPar);
    runPar();
  }

  /* Tilt */
  if (fine && !reduce) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var max = parseFloat(el.dataset.tilt) || 4;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(1200px) rotateY(' + (x * max).toFixed(2) + 'deg) rotateX(' + (-y * max).toFixed(2) + 'deg) translateZ(0)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* Sliders */
  document.querySelectorAll('[data-slider]').forEach(function (sl) {
    var tr = sl.querySelector('.track');
    var items = tr ? Array.prototype.slice.call(tr.children) : [];
    var prev = sl.querySelector('[data-prev]'), next = sl.querySelector('[data-next]');
    var curEl = sl.querySelector('[data-cur]');
    if (!tr || !items.length) return;
    var idx = function () {
      var left = tr.getBoundingClientRect().left + parseFloat(getComputedStyle(tr).paddingLeft || 0);
      var best = 0, bd = Infinity;
      items.forEach(function (it, i) { var d = Math.abs(it.getBoundingClientRect().left - left); if (d < bd) { bd = d; best = i; } });
      if (tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4) best = items.length - 1;
      return best;
    };
    var update = function () {
      var i = idx();
      if (curEl) curEl.textContent = i + 1;
      if (prev) prev.disabled = tr.scrollLeft <= 4;
      if (next) next.disabled = tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4;
    };
    var go = function (dir) {
      var i = Math.max(0, Math.min(items.length - 1, idx() + dir));
      var target = items[i].offsetLeft - parseFloat(getComputedStyle(tr).paddingLeft || 0);
      tr.scrollTo({ left: target, behavior: reduce ? 'auto' : 'smooth' });
    };
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    tr.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    tr.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } });
    window.addEventListener('resize', update);
    update();
  });

  /* FAQ: one open at a time */
  var dets = Array.prototype.slice.call(document.querySelectorAll('.faq details'));
  dets.forEach(function (d, i) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      dets.forEach(function (o) { if (o !== d) o.open = false; });
      track('faq_open', { faq_index: i + 1 });
    });
  });

  /* WhatsApp */
  var wa = document.querySelector('.wa');
  if (wa && cfg.whatsapp) wa.href = 'https://wa.me/' + cfg.whatsapp + '?text=' + encodeURIComponent('Hello, I would like information about the Professional Certificate in Longevity and Lifelong Wellbeing Advisory Practice.');

  /* Lead form */
  var form = document.getElementById('lead-form');
  if (form) {
    var qs = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'].forEach(function (k) {
      var el = form.querySelector('[name="' + k + '"]'); if (el && qs.get(k)) el.value = qs.get(k);
    });
    var started = false;
    form.addEventListener('input', function () { if (!started) { started = true; track('lead_form_start'); } });
    var check = function (el) {
      var v = (el.value || '').trim(), ok = true;
      if (el.type === 'checkbox') ok = el.checked;
      else if (el.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      else if (el.type === 'tel') ok = v.replace(/\D/g, '').length >= 7;
      else ok = v.length > 0;
      var wrap = el.closest('.fld');
      var err = wrap ? wrap.querySelector('.err') : form.querySelector('.consent-err');
      if (wrap) wrap.classList.toggle('bad', !ok);
      if (err) err.textContent = ok ? '' : (el.dataset.msg || 'Please complete this field.');
      el.setAttribute('aria-invalid', ok ? 'false' : 'true');
      return ok;
    };
    form.querySelectorAll('[required]').forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value || el.type === 'checkbox') check(el); });
      el.addEventListener('change', function () { if (el.closest('.fld.bad') || el.type === 'checkbox') check(el); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, first = null;
      form.querySelectorAll('[required]').forEach(function (el) { if (!check(el)) { ok = false; if (!first) first = el; } });
      if (!ok) { if (first) first.focus(); track('lead_form_error'); return; }
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      data.page = location.href; data.submitted_at = new Date().toISOString();
      var btn = form.querySelector('button[type="submit"]'); if (btn) btn.disabled = true;
      var done = function () {
        form.hidden = true;
        var t = document.getElementById('thanks'); if (t) { t.hidden = false; t.focus(); }
        track('generate_lead', { enrollment_timing: data.timing, main_goal: data.goal });
      };
      if (cfg.crmEndpoint) {
        fetch(cfg.crmEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(done, done);
      } else { done(); }
    });
  }

  /* Consent */
  var KEY = 'lla_barilan_consent_v1';
  var cookie = document.querySelector('.cookie');
  function applyConsent(c) {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: c.analytics ? 'granted' : 'denied', ad_storage: c.ads ? 'granted' : 'denied', ad_user_data: c.ads ? 'granted' : 'denied', ad_personalization: c.ads ? 'granted' : 'denied' });
    }
    if (c.analytics && !isPlaceholder(cfg.ga4)) {
      var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + cfg.ga4; document.head.appendChild(s);
      window.gtag('js', new Date()); window.gtag('config', cfg.ga4);
      if (c.ads && !isPlaceholder(cfg.googleAds)) window.gtag('config', cfg.googleAds);
    }
    if (c.ads && !isPlaceholder(cfg.metaPixel)) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', cfg.metaPixel); window.fbq('track', 'PageView');
    }
  }
  var saved = null; try { saved = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  if (saved) applyConsent(saved); else if (cookie) cookie.hidden = false;
  document.querySelectorAll('[data-cookie-settings]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); if (cookie) cookie.hidden = false; });
  });
  document.querySelectorAll('[data-consent]').forEach(function (b) {
    b.addEventListener('click', function () {
      var all = b.dataset.consent === 'all', c = { analytics: all, ads: all };
      try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
      if (cookie) cookie.hidden = true; applyConsent(c);
    });
  });
})();
