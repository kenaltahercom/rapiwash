/* UI: navbar, scrollspy, menu seluler, reveal, FAQ, carousel, tombol mengambang, dialog legal. */
(function () {
  var RW = window.RW;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- Navbar: bayangan saat scroll + indikator aktif ---------- */
  function initNavbar() {
    var header = $('#site-header');
    var list = $('#nav-list');
    var indicator = $('.nav-indicator', list);
    var links = $$('[data-nav]', list);
    var mobileLinks = $$('[data-nav]', $('#mobile-list'));
    var sections = RW.nav.map(function (n) { return document.getElementById(n.id); });
    var current = null;
    var isClickNav = false;
    var clickTimer = null;

    function moveIndicator(id) {
      var link = links.filter(function (l) { return l.dataset.nav === id; })[0];
      if (!link || !indicator) return;
      indicator.style.width = link.offsetWidth + 'px';
      indicator.style.transform = 'translateX(' + link.offsetLeft + 'px)';
      indicator.classList.add('is-on');
    }

    function setActive(id) {
      current = id;
      links.concat(mobileLinks).forEach(function (l) {
        if (l.dataset.nav === id) l.setAttribute('aria-current', 'true');
        else l.removeAttribute('aria-current');
      });
      moveIndicator(id);
    }

    // Pindah halus langsung saat menu diklik tanpa tersendat di section perantara
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        var id = link.dataset.nav;
        if (!id) return;
        isClickNav = true;
        if (clickTimer) clearTimeout(clickTimer);
        setActive(id);
        clickTimer = setTimeout(function () {
          isClickNav = false;
        }, 850);
      });
    });

    var ticking = false;
    function update() {
      ticking = false;
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      if (isClickNav) return;

      var probe = header.offsetHeight + 40;
      var active = RW.nav[0].id;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i] && sections[i].getBoundingClientRect().top <= probe) active = RW.nav[i].id;
      }
      // di dasar halaman, aktifkan item terakhir
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6) {
        active = RW.nav[RW.nav.length - 1].id;
      }
      if (active !== current) setActive(active);
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', function () { if (current) moveIndicator(current); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (current) moveIndicator(current); });
    update();
  }

  /* ---------- Menu seluler ---------- */
  function initMobileMenu() {
    var toggle = $('#nav-toggle');
    var menu = $('#mobile-menu');
    var header = $('#site-header');
    var icon = $('.ico', toggle);

    function focusables() {
      return $$('a[href], button', menu).concat([toggle]);
    }

    function setOpen(open, returnFocus) {
      menu.classList.toggle('is-open', open);
      header.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
      icon.classList.toggle('i-menu', !open);
      icon.classList.toggle('i-close', open);
      document.body.classList.toggle('no-scroll', open);
      if (open) {
        var first = $('a', menu);
        if (first) first.focus();
      } else if (returnFocus) {
        toggle.focus();
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(!menu.classList.contains('is-open'), false);
    });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false, false); });
    });
    document.addEventListener('keydown', function (e) {
      if (!menu.classList.contains('is-open')) return;
      if (e.key === 'Escape') { setOpen(false, true); return; }
      if (e.key === 'Tab') {
        var f = focusables();
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('is-open') && !menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false, false);
    });
    // menu otomatis tertutup bila layar melebar ke desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1200 && menu.classList.contains('is-open')) setOpen(false, false);
    });
  }

  /* ---------- Reveal saat scroll (sekali jalan) ---------- */
  function initReveal() {
    $$('[data-stagger]').forEach(function (group) {
      $$(':scope > .reveal', group).forEach(function (el, i) {
        el.style.setProperty('--i', Math.min(i, 7));
      });
    });
    var items = $$('.reveal');
    if (!('IntersectionObserver' in window) || RW.prefersReducedMotion()) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- FAQ accordion ---------- */
  function initFaq() {
    $$('.faq-q').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        btn.closest('.faq-item').classList.toggle('is-open', !open);
      });
    });
  }

  /* ---------- Carousel testimoni (manual) ---------- */
  function initCarousel() {
    var scroller = $('#testi-carousel');
    var track = $('#testi-track');
    var prev = $('#testi-prev');
    var next = $('#testi-next');
    var count = $('#testi-count');
    var items = $$('.carousel-item', track);
    if (!scroller || !items.length) return;

    function step() {
      return items[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0);
    }
    function index() { return Math.round(scroller.scrollLeft / step()); }
    function perView() { return Math.max(1, Math.round(scroller.clientWidth / step())); }
    function maxIndex() { return Math.max(0, items.length - perView()); }

    function update() {
      var i = Math.min(index(), maxIndex());
      prev.disabled = scroller.scrollLeft <= 2;
      next.disabled = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 2;
      var last = Math.min(items.length, i + perView());
      count.textContent = (perView() > 1 ? (i + 1) + '–' + last : (i + 1)) + ' / ' + items.length;
    }
    function go(dir) {
      scroller.scrollTo({ left: scroller.scrollLeft + dir * step(), behavior: RW.prefersReducedMotion() ? 'auto' : 'smooth' });
    }
    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });
    scroller.addEventListener('scroll', function () { requestAnimationFrame(update); }, { passive: true });
    scroller.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Tombol mengambang ---------- */
  function initFloating() {
    var top = $('#fab-top');
    var onScroll = function () { top.classList.toggle('is-visible', window.scrollY > 500); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: RW.prefersReducedMotion() ? 'auto' : 'smooth' });
      var brand = $('.brand');
      if (brand) brand.focus({ preventScroll: true });
    });
  }

  /* ---------- Dialog legal (placeholder) ---------- */
  function initLegal() {
    var dlg = $('#legal-dialog');
    $$('[data-legal]').forEach(function (b) {
      b.addEventListener('click', function () {
        var d = RW.legal[b.dataset.legal];
        $('#legal-title').textContent = d.title;
        $('#legal-text').textContent = d.text;
        dlg.showModal();
      });
    });
    $('#legal-close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  }

  /* ---------- Animasi teks berganti: Hemat, Cepat, Bersih, Murah, Wangi ---------- */
  function initHeroRotator() {
    var rotator = $('#hero-rotator');
    if (!rotator) return;
    var words = ['Hemat', 'Cepat', 'Bersih', 'Murah', 'Wangi'];
    var idx = 0;

    if (RW.prefersReducedMotion()) return;

    setInterval(function () {
      idx = (idx + 1) % words.length;
      var nextWord = words[idx];
      var currentEl = rotator.querySelector('.hero-rotator-word:not(.is-leaving)');

      var nextEl = document.createElement('span');
      nextEl.className = 'hero-rotator-word is-entering';
      nextEl.textContent = nextWord;
      rotator.appendChild(nextEl);

      // Trigger reflow
      void nextEl.offsetWidth;

      if (currentEl) {
        currentEl.classList.remove('is-active');
        currentEl.classList.add('is-leaving');
        setTimeout(function () {
          if (currentEl.parentNode) currentEl.parentNode.removeChild(currentEl);
        }, 550);
      }

      nextEl.classList.remove('is-entering');
      nextEl.classList.add('is-active');
      rotator.setAttribute('aria-label', nextWord);
    }, 2400);
  }

  RW.ui = {
    init: function () {
      initNavbar();
      initMobileMenu();
      initReveal();
      initHeroRotator();
      initFaq();
      initCarousel();
      initFloating();
      initLegal();
    },
  };
})();
