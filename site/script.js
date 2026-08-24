(function () {
  'use strict';

  function initStickyHeader() {
    var header = document.getElementById('site-header');
    if (!header) return;

    var ticking = false;

    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 80);
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  function initMobileMenu() {
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    function openMenu() {
      menu.hidden = false;
      document.body.classList.add('has-open-menu');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Menü schließen');
    }

    function closeMenu() {
      menu.hidden = true;
      document.body.classList.remove('has-open-menu');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Menü öffnen');
      toggle.focus();
    }

    toggle.addEventListener('click', function () {
      if (toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
      } else {
        openMenu();
      }
    });

    menu.addEventListener('click', function (event) {
      if (event.target.closest('.mobile-menu__link') && !event.target.closest('.mobile-menu__dropdown-toggle')) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !menu.hidden) {
        closeMenu();
      }
    });
  }

  function initDropdown() {
    var toggles = document.querySelectorAll('.mobile-menu__dropdown-toggle');

    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function (event) {
        event.stopPropagation();
        var isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggles.forEach(function (other) {
          other.setAttribute('aria-expanded', 'false');
        });
        toggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      });
    });

    document.addEventListener('click', function () {
      toggles.forEach(function (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function initCurrentYear() {
    var el = document.getElementById('current-year');
    if (!el) return;
    el.textContent = new Date().getFullYear();
  }

  function initTrustStats() {
    var group = document.getElementById('trust-stats');
    if (!group) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var numbers = group.querySelectorAll('.trust-stat__number');
    var duration = 900;

    function animateNumber(el, delay) {
      var target = parseFloat(el.getAttribute('data-count-to'));
      var decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;

      setTimeout(function () {
        var start = null;

        function step(timestamp) {
          if (start === null) start = timestamp;
          var progress = Math.min((timestamp - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var value = target * eased;
          el.textContent = decimals
            ? value.toFixed(decimals).replace('.', ',')
            : String(Math.round(value));
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        }

        window.requestAnimationFrame(step);
      }, delay);
    }

    group.classList.add('trust-stats--ready');

    var observer = new IntersectionObserver(
      function (entries, obs) {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        group.classList.add('trust-stats--visible');
        animateNumber(numbers[0], 0);
        animateNumber(numbers[1], 120);
      },
      { threshold: 0.4 }
    );

    observer.observe(group);
  }

  /* Positioniert die gestrichelte Verbindungslinie in #ablauf so, dass sie
     exakt an der Mitte der ersten und der letzten Nummern-Badge beginnt und
     endet. Auf Mobile (Schritte untereinander, unterschiedlich hoch je nach
     Zeilenumbruch der Beschreibung) lässt sich das nicht aus CSS allein
     berechnen — anders als bei den gleich breiten Desktop-Spalten, die
     styles.css rein über calc() aus Breite und Gap herleitet. */
  function initAblaufLine() {
    var list = document.querySelector('.ablauf-steps');
    if (!list) return;

    var numbers = list.querySelectorAll('.step-number');
    if (numbers.length < 2) return;

    var first = numbers[0];
    var last = numbers[numbers.length - 1];
    var ticking = false;

    function update() {
      var listRect = list.getBoundingClientRect();
      var firstRect = first.getBoundingClientRect();
      var lastRect = last.getBoundingClientRect();
      var start = firstRect.top + firstRect.height / 2 - listRect.top;
      var end = listRect.bottom - (lastRect.top + lastRect.height / 2);
      list.style.setProperty('--ablauf-line-start', start + 'px');
      list.style.setProperty('--ablauf-line-end', end + 'px');
      ticking = false;
    }

    update();

    window.addEventListener(
      'resize',
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );

    if (window.document.fonts && window.document.fonts.ready) {
      window.document.fonts.ready.then(update);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initStickyHeader();
    initMobileMenu();
    initDropdown();
    initCurrentYear();
    initTrustStats();
    initAblaufLine();
  });
})();
