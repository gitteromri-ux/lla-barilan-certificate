(function () {
  'use strict';
  var cfg = window.LLA_CONFIG || {};
  var isPlaceholder = function (v) { return !v || /X{4,}/.test(v); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  window.dataLayer = window.dataLayer || [];
  function track(event, params) { var o = { event: event }; for (var k in params) o[k] = params[k]; window.dataLayer.push(o); }

  var hdr = document.querySelector('.hdr');
  function onScroll() { if (hdr) hdr.classList.toggle('on', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function startVideo(v) {
    if (!v || v.dataset.loaded) return;
    var small = window.matchMedia('(max-width: 760px)').matches;
    var src = (small && v.dataset.srcSm) || v.dataset.src;
    if (!src) return;
    v.dataset.loaded = '1';
    v.src = src;
    v.muted = true;
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }
  if (!reduce && !saveData) {
    var heroV = document.querySelector('.hero video');
    startVideo(heroV);
    var lazy = document.querySelectorAll('video[data-lazy]');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { startVideo(e.target); }
          else if (e.target.dataset.loaded) { e.target.pause(); }
          if (e.isIntersecting && e.target.dataset.loaded && e.target.paused) { var p = e.target.play(); if (p && p.catch) p.catch(function () {}); }
        });
      }, { rootMargin: '200px 0px' });
      lazy.forEach(function (v) { io.observe(v); });
    }
  }

  var track_ = document.querySelector('.track');
  var bar = document.querySelector('.prog i');
  if (track_) {
    var step = function (dir) {
      var card = track_.querySelector('.course');
      var w = card ? card.getBoundingClientRect().width + 20 : 360;
      track_.scrollBy({ left: dir * w, behavior: reduce ? 'auto' : 'smooth' });
    };
    var prev = document.querySelector('[data-prev]');
    var next = document.querySelector('[data-next]');
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
    var upd = function () {
      if (!bar) return;
      var max = track_.scrollWidth - track_.clientWidth;
      var ratio = track_.clientWidth / track_.scrollWidth;
      bar.style.width = (ratio * 100) + '%';
      bar.style.transform = 'translateX(' + (max > 0 ? (track_.scrollLeft / max) * ((1 / ratio) - 1) * 100 : 0) + '%)';
    };
    track_.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  }

  document.querySelectorAll('.faq details').forEach(function (d, i) {
    d.addEventListener('toggle', function () { if (d.open) track('faq_open', { faq_index: i + 1 }); });
  });

  var wa = document.querySelector('.wa');
  if (wa && cfg.whatsapp) {
    wa.href = 'https://wa.me/' + cfg.whatsapp + '?text=' + encodeURIComponent('Hello, I would like to know more about the Bar-Ilan Longevity and Lifelong Wellbeing Advisor certificate.');
  }

  var form = document.getElementById('lead-form');
  if (form) {
    var params = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'].forEach(function (k) {
      var el = form.querySelector('[name="' + k + '"]');
      if (el && params.get(k)) el.value = params.get(k);
    });
    var started = false;
    form.addEventListener('input', function () { if (!started) { started = true; track('lead_form_start', {}); } });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (el) {
        var f = el.closest('.f') || el.closest('.chk');
        var valid = el.type === 'checkbox' ? el.checked : el.value.trim() !== '' && (el.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
        if (el.type === 'tel') valid = /[0-9]{6,}/.test(el.value.replace(/\D/g, ''));
        if (f) f.classList.toggle('bad', !valid);
        var err = f && f.querySelector('.err');
        if (err) err.textContent = valid ? '' : (el.dataset.msg || 'Please complete this field.');
        if (!valid) ok = false;
      });
      if (!ok) {
        var first = form.querySelector('.bad input, .bad select');
        if (first) first.focus();
        return;
      }
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      data.submitted_at = new Date().toISOString();
      data.page = location.href;
      var done = function () {
        form.hidden = true;
        var t = document.getElementById('thanks');
        if (t) { t.hidden = false; t.focus(); }
        track('generate_lead', { enrollment_timeline: data.timeline, main_goal: data.goal, pathway: data.pathway || '' });
      };
      if (cfg.crmEndpoint) {
        fetch(cfg.crmEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(done, done);
      } else {
        done();
      }
    });
  }

  var KEY = 'lla_barilan_consent_v1';
  var banner = document.querySelector('.consent');
  function apply(c) {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        analytics_storage: c.analytics ? 'granted' : 'denied',
        ad_storage: c.ads ? 'granted' : 'denied',
        ad_user_data: c.ads ? 'granted' : 'denied',
        ad_personalization: c.ads ? 'granted' : 'denied'
      });
    }
    if (c.analytics && !isPlaceholder(cfg.ga4)) {
      var s = document.createElement('script');
      s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + cfg.ga4;
      document.head.appendChild(s);
      gtag('js', new Date()); gtag('config', cfg.ga4);
      if (c.ads && !isPlaceholder(cfg.googleAds)) gtag('config', cfg.googleAds);
    }
    if (c.ads && !isPlaceholder(cfg.metaPixel)) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', cfg.metaPixel); fbq('track', 'PageView');
    }
  }
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  if (saved) { apply(saved); } else if (banner) { banner.hidden = false; }
  document.querySelectorAll('[data-consent]').forEach(function (b) {
    b.addEventListener('click', function () {
      var all = b.dataset.consent === 'all';
      var c = { analytics: all, ads: all };
      try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
      if (banner) banner.hidden = true;
      apply(c);
    });
  });
})();
