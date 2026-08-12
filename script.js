/* ==========================================================================
   Elec Simon — booking site
   Vanilla JS, no dependencies. Everything degrades gracefully without it.
   ========================================================================== */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------- Footer year ----------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --------------------------- Sticky header ----------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------- Scroll reveal ---------------------------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------- Smooth anchor scroll ------------------------- */
  // Offsets by header height so the target isn't hidden under the sticky bar.
  function scrollToEl(target) {
    var headerH = header ? header.offsetHeight : 0;
    var top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
    window.scrollTo({
      top: top,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      scrollToEl(target);
      history.replaceState(null, '', id);
    });
  });

  /* ---------------------- Service card → booking form -------------------- */
  // Clicking a card's "Inquire" jumps to the form, preselects the event type
  // where it maps cleanly, and records which service prompted the inquiry.
  var eventTypeSelect = document.getElementById('event-type');
  var serviceInput = document.getElementById('service-interest');
  var bookingSection = document.getElementById('booking');

  document.querySelectorAll('[data-inquire]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var eventType = btn.getAttribute('data-inquire');
      var service = btn.getAttribute('data-service') || '';

      if (serviceInput) serviceInput.value = service;

      if (eventType && eventTypeSelect) {
        eventTypeSelect.value = eventType;
        clearError(eventTypeSelect);
      }

      if (bookingSection) scrollToEl(bookingSection);

      var nameField = document.getElementById('name');
      if (nameField) {
        // Wait for the smooth scroll to settle before focusing, otherwise the
        // browser snaps to the field and cancels the animation.
        window.setTimeout(function () {
          nameField.focus({ preventScroll: true });
        }, prefersReducedMotion ? 0 : 600);
      }
    });
  });

  /* ------------------------- Read Full Story toggle ---------------------- */
  var toggle = document.querySelector('.link-toggle');
  var collapse = document.getElementById('full-story');

  if (toggle && collapse) {
    toggle.addEventListener('click', function () {
      var isOpen = collapse.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.querySelector('.link-toggle__label').textContent =
        isOpen ? 'Hide Full Story' : 'Read Full Story';
    });
  }

  /* --------------------------- YouTube facade ---------------------------- */
  // The real iframe is only injected on click, so the page loads fast and
  // doesn't hand YouTube a tracking hit before anyone presses play.
  var facade = document.querySelector('.video__facade');
  if (facade) {
    facade.addEventListener('click', function () {
      var id = facade.getAttribute('data-video-id');
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id +
        '?autoplay=1&rel=0&modestbranding=1';
      iframe.title = 'Elec Simon live reel';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      facade.replaceWith(iframe);
    });
  }

  /* ----------------------------- Booking form ---------------------------- */
  var form = document.getElementById('booking-form');
  var successEl = document.getElementById('form-success');
  var errorEl = document.getElementById('form-error');
  var submitBtn = document.getElementById('submit-btn');

  function fieldOf(input) { return input.closest('.field'); }

  function clearError(input) {
    var field = fieldOf(input);
    if (field) field.classList.remove('has-error');
  }

  function showError(input) {
    var field = fieldOf(input);
    if (field) field.classList.add('has-error');
  }

  function showFormError(html) {
    if (!errorEl) return;
    errorEl.innerHTML = html;
    errorEl.hidden = false;
  }

  if (form) {
    var inputs = form.querySelectorAll('input, select, textarea');

    // Clear a field's error as soon as the visitor fixes it.
    inputs.forEach(function (input) {
      var evt = input.tagName === 'SELECT' ? 'change' : 'input';
      input.addEventListener(evt, function () {
        if (input.checkValidity()) clearError(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (errorEl) errorEl.hidden = true;

      // Validate with the browser's own rules, but render our own messages.
      var firstInvalid = null;
      inputs.forEach(function (input) {
        if (input.type === 'hidden' || input.name === '_gotcha') return;
        if (!input.checkValidity()) {
          showError(input);
          if (!firstInvalid) firstInvalid = input;
        } else {
          clearError(input);
        }
      });

      if (firstInvalid) {
        scrollToEl(fieldOf(firstInvalid) || firstInvalid);
        firstInvalid.focus({ preventScroll: true });
        return;
      }

      var endpoint = form.getAttribute('action');

      // Guard rail: fail loudly if the Formspree endpoint was never wired up,
      // rather than showing a success message and dropping a real inquiry.
      if (!endpoint || endpoint.indexOf('YOUR_FORM_ID') !== -1) {
        showFormError(
          '<strong>Form not connected yet.</strong> Add your Formspree ID to the ' +
          'form&rsquo;s <code>action</code> in <code>index.html</code>. ' +
          'In the meantime, email <a href="mailto:booking@elecsimon.com">booking@elecsimon.com</a>.'
        );
        return;
      }

      submitBtn.disabled = true;
      submitBtn.querySelector('.btn__label').textContent = 'Sending…';

      fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (res.ok) return res.json().catch(function () { return {}; });
          return res.json()
            .catch(function () { return {}; })
            .then(function (data) {
              var msg = data.errors
                ? data.errors.map(function (er) { return er.message; }).join(', ')
                : 'That didn’t go through (error ' + res.status + ').';
              throw new Error(msg);
            });
        })
        .then(function () {
          form.hidden = true;
          if (successEl) {
            successEl.hidden = false;
            successEl.focus && successEl.focus();
            scrollToEl(successEl);
          }
        })
        .catch(function (err) {
          submitBtn.disabled = false;
          submitBtn.querySelector('.btn__label').textContent = 'Send Booking Inquiry';
          showFormError(
            (err && err.message ? err.message : 'Something went wrong.') +
            ' Please email <a href="mailto:booking@elecsimon.com">booking@elecsimon.com</a> ' +
            'or text <a href="sms:+13309626207">330-962-6207</a>.'
          );
        });
    });

    // Can't book a date in the past.
    var dateInput = document.getElementById('event-date');
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
  }
})();
