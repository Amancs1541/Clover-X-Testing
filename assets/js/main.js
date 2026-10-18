/* Clover-X website behaviour: loader, mobile menu, project filter, contact form. */
(function () {
  'use strict';

  /* ---- Loader: stays on screen for LOADER_MS, then fades out once the page has loaded ---- */
  var LOADER_MS = 5000; // how long the loading screen shows, in milliseconds (5000 = 5 seconds)
  var loader = document.querySelector('.loader');
  if (loader) {
    document.body.style.overflow = 'hidden';
    var hideLoader = function () {
      if (loader.classList.contains('is-done')) return;
      loader.classList.add('is-done');
      loader.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    var afterLoad = function () {
      // performance.now() counts from the moment the page started loading.
      var elapsed = (window.performance && performance.now) ? performance.now() : LOADER_MS;
      setTimeout(hideLoader, Math.max(0, LOADER_MS - elapsed));
    };
    if (document.readyState === 'complete') afterLoad();
    else window.addEventListener('load', afterLoad);
    setTimeout(hideLoader, LOADER_MS + 5000); // safety net if the load event never fires
  }

  /* ---- Header: shadow on scroll + mobile menu ---- */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  if (header && toggle) {
    var setOpen = function (open) {
      header.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', function () { setOpen(!header.classList.contains('menu-open')); });
    header.querySelectorAll('.site-nav a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('menu-open')) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 1100px)').addEventListener('change', function (e) { if (e.matches) setOpen(false); });
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Footer year ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- Project filter ---- */
  var filterBar = document.querySelector('.filters');
  if (filterBar) {
    var items = Array.prototype.slice.call(document.querySelectorAll('.projects > li'));
    var status = document.querySelector('[data-filter-status]');
    filterBar.hidden = false; // only shown when JavaScript is available
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      var f = btn.getAttribute('data-filter');
      filterBar.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      var shown = 0;
      items.forEach(function (li) {
        var on = f === 'all' || (' ' + li.getAttribute('data-domains') + ' ').indexOf(' ' + f + ' ') > -1;
        li.hidden = !on;
        if (on) shown++;
      });
      if (status) status.textContent = 'Showing ' + shown + ' project' + (shown === 1 ? '' : 's');
    });
  }

  /* ---- Contact form: validation + sending without leaving the page ---- */
  var form = document.querySelector('.contact-form');
  if (form) {
    form.noValidate = true; // we show our own, friendlier messages
    var messages = {
      name: function () { return 'Please enter your name.'; },
      email: function (el) { return el.value ? 'Please enter a valid email address, like name@company.com.' : 'Please enter your email address.'; },
      interest: function () { return 'Please choose an area of interest.'; },
      message: function (el) { return el.value ? 'Please add a little more detail (at least 10 characters).' : 'Please tell us a little about your project.'; },
      consent: function () { return 'Please confirm you agree so we can reply to you.'; }
    };
    var fields = Array.prototype.slice.call(form.querySelectorAll('[required]'));
    var check = function (el) {
      var err = document.getElementById(el.id + '-err');
      var ok = el.checkValidity();
      err.textContent = ok ? '' : messages[el.name](el);
      el.setAttribute('aria-invalid', String(!ok));
      return ok;
    };
    fields.forEach(function (el) {
      el.addEventListener('blur', function () { if (el.hasAttribute('aria-invalid')) check(el); });
      el.addEventListener('input', function () { if (el.getAttribute('aria-invalid') === 'true') check(el); });
      el.addEventListener('change', function () { if (el.getAttribute('aria-invalid') === 'true') check(el); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var invalid = fields.filter(function (el) { return !check(el); });
      if (invalid.length) { invalid[0].focus(); return; }

      var btn = form.querySelector('button[type="submit"]');
      var label = btn.querySelector('.btn-label');
      var errorBox = form.querySelector('.form-error');
      btn.classList.add('is-loading');
      btn.setAttribute('aria-disabled', 'true');
      label.textContent = 'Sending';
      errorBox.hidden = true;

      // FormSubmit's AJAX endpoint is the form's action with /ajax/ added.
      var endpoint = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
      fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
        .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
        .then(function (r) {
          if (!r.ok || String(r.data.success) !== 'true') throw new Error(r.data.message || 'Failed');
          var success = form.parentElement.querySelector('.form-success');
          form.hidden = true;
          success.hidden = false;
          success.focus();
        })
        .catch(function () {
          errorBox.hidden = false;
          btn.classList.remove('is-loading');
          btn.removeAttribute('aria-disabled');
          label.textContent = 'Send message';
        });
    });
  }
})();
