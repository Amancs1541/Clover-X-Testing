/* Clover-X website behaviour: loader, mobile menu, project filter, contact form. */
(function () {
  'use strict';

  /* ---- Loader: shows for exactly LOADER_MS from the moment the page starts loading ---- */
  var LOADER_MS = 2000; // how long the loading screen shows, in milliseconds (2000 = 2 seconds)
  var loader = document.querySelector('.loader');
  if (loader) {
    document.body.style.overflow = 'hidden';
    // performance.now() counts from the moment the page started loading.
    var elapsed = (window.performance && performance.now) ? performance.now() : 0;
    setTimeout(function () {
      loader.classList.add('is-done');
      loader.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }, Math.max(0, LOADER_MS - elapsed));
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

  /* ---- Pop-up dialogs (e.g. Gabber early access): links with data-dialog open them ---- */
  document.querySelectorAll('a[data-dialog]').forEach(function (link) {
    var dialog = document.getElementById(link.getAttribute('data-dialog'));
    if (!dialog || typeof dialog.showModal !== 'function') return; // without support, the #link fallback shows it
    link.addEventListener('click', function (e) {
      e.preventDefault();
      dialog.showModal();
      var first = dialog.querySelector('input:not([type=hidden]):not([tabindex="-1"])');
      if (first) first.focus();
    });
  });
  document.querySelectorAll('dialog.modal').forEach(function (dialog) {
    dialog.querySelectorAll('[data-close]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); dialog.close(); });
    });
    // Click on the dimmed backdrop closes the dialog.
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    if (location.hash === '#' + dialog.id && typeof dialog.showModal === 'function') {
      history.replaceState(null, '', location.pathname);
      dialog.showModal();
    }
  });

  /* ---- Forms (contact + early access): validation + sending to Formspree without leaving the page ---- */
  var messages = {
    name: function () { return 'Please enter your name.'; },
    email: function (el) { return el.value ? 'Please enter a valid email address, like name@company.com.' : 'Please enter your email address.'; },
    interest: function () { return 'Please choose an area of interest.'; },
    message: function (el) { return el.value ? 'Please add a little more detail (at least 10 characters).' : 'Please tell us a little about your project.'; },
    consent: function () { return 'Please confirm you agree so we can reply to you.'; }
  };
  document.querySelectorAll('form.contact-form').forEach(function (form) {
    form.noValidate = true; // we show our own, friendlier messages
    // One entry per field; for a group of radio buttons, only the first one.
    var seen = {};
    var fields = Array.prototype.slice.call(form.querySelectorAll('[required]')).filter(function (el) {
      if (el.type !== 'radio') return true;
      if (seen[el.name]) return false;
      seen[el.name] = true;
      return true;
    });
    var check = function (el) {
      var err = document.getElementById(el.getAttribute('data-err') || el.id + '-err');
      var ok = el.checkValidity();
      var msg = el.getAttribute('data-error') || (messages[el.name] ? messages[el.name](el) : 'Please fill in this field.');
      if (!ok && el.value && el.getAttribute('data-error-invalid') && el.type !== 'radio' && el.type !== 'checkbox') msg = el.getAttribute('data-error-invalid');
      err.textContent = ok ? '' : msg;
      var group = el.type === 'radio' ? form.querySelectorAll('input[name="' + el.name + '"]') : [el];
      Array.prototype.forEach.call(group, function (g) { g.setAttribute('aria-invalid', String(!ok)); });
      return ok;
    };
    fields.forEach(function (el) {
      var group = el.type === 'radio' ? form.querySelectorAll('input[name="' + el.name + '"]') : [el];
      Array.prototype.forEach.call(group, function (g) {
        g.addEventListener('blur', function () { if (el.hasAttribute('aria-invalid')) check(el); });
        g.addEventListener('input', function () { if (el.getAttribute('aria-invalid') === 'true') check(el); });
        g.addEventListener('change', function () { if (el.getAttribute('aria-invalid') === 'true') check(el); });
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var invalid = fields.filter(function (el) { return !check(el); });
      if (invalid.length) { invalid[0].focus(); return; }

      var btn = form.querySelector('button[type="submit"]');
      var label = btn.querySelector('.btn-label');
      var labelText = label.textContent;
      var errorBox = form.querySelector('.form-error');
      btn.classList.add('is-loading');
      btn.setAttribute('aria-disabled', 'true');
      label.textContent = 'Sending';
      errorBox.hidden = true;

      // Send to Formspree (the form's action) and stay on the page.
      fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
        .then(function (res) {
          if (!res.ok) throw new Error('Formspree returned ' + res.status);
          var success = form.parentElement.querySelector('.form-success');
          form.hidden = true;
          success.hidden = false;
          success.focus();
        })
        .catch(function () {
          errorBox.hidden = false;
          btn.classList.remove('is-loading');
          btn.removeAttribute('aria-disabled');
          label.textContent = labelText;
        });
    });
  });
})();
