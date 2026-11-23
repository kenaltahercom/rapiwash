/* Galeri: filter kategori + lightbox (tombol, Escape, panah keyboard, swipe). */
(function () {
  var RW = window.RW;
  var esc = RW.esc;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var state = { cat: 'all', visible: RW.gallery.slice(), index: 0, opener: null };

  function renderFilters() {
    var wrap = $('#gallery-filters');
    wrap.innerHTML = RW.galleryCategories.map(function (c) {
      return '<button type="button" class="chip" data-cat="' + c.id + '" aria-pressed="' + (c.id === state.cat) + '">' + esc(c.label) + '</button>';
    }).join('');
    $$('.chip', wrap).forEach(function (chip) {
      chip.addEventListener('click', function () { applyFilter(chip.dataset.cat); });
    });
  }

  function renderGrid() {
    $('#gallery-grid').innerHTML = RW.gallery.map(function (g) {
      return '<div class="gallery-item" data-cat="' + g.cat + '" data-id="' + g.id + '">' +
        '<button type="button" class="gallery-btn" aria-label="Perbesar foto: ' + esc(g.caption) + '">' +
        RW.pic(g.img, { alt: g.alt, sizes: '(min-width:1100px) 280px, (min-width:600px) 44vw, 92vw' }) +
        '<span class="gallery-cap">' + esc(g.caption) + '</span></button></div>';
    }).join('');
    $$('.gallery-btn', $('#gallery-grid')).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.closest('.gallery-item').dataset.id;
        openLightbox(id, btn);
      });
    });
  }

  function applyFilter(cat) {
    state.cat = cat;
    $$('.chip', $('#gallery-filters')).forEach(function (c) {
      c.setAttribute('aria-pressed', String(c.dataset.cat === cat));
    });
    state.visible = RW.gallery.filter(function (g) { return cat === 'all' || g.cat === cat; });
    var shown = 0;
    $$('.gallery-item', $('#gallery-grid')).forEach(function (el) {
      var show = cat === 'all' || el.dataset.cat === cat;
      el.hidden = !show;
      el.classList.remove('is-entering');
      if (show) {
        el.style.setProperty('--i', Math.min(shown++, 8));
        void el.offsetWidth;
        el.classList.add('is-entering');
      }
    });
  }

  /* ---------- Lightbox ---------- */
  var dlg, img, cap, count, figure;

  function show(i) {
    var n = state.visible.length;
    state.index = (i + n) % n;
    var g = state.visible[state.index];
    figure.classList.remove('is-swap');
    void figure.offsetWidth;
    img.src = 'assets/img/' + g.img + '.jpg';
    img.alt = g.alt;
    img.width = RW.images[g.img][0];
    img.height = RW.images[g.img][1];
    cap.textContent = g.caption;
    count.textContent = (state.index + 1) + ' / ' + n;
    figure.classList.add('is-swap');
    var single = n < 2;
    $('#lb-prev').hidden = single;
    $('#lb-next').hidden = single;
  }

  function openLightbox(id, opener) {
    state.opener = opener;
    var i = state.visible.findIndex(function (g) { return g.id === id; });
    show(i < 0 ? 0 : i);
    dlg.showModal();
    document.body.classList.add('no-scroll');
    $('#lb-close').focus();
  }

  function initLightbox() {
    dlg = $('#lightbox');
    img = $('#lb-img');
    cap = $('#lb-caption');
    count = $('#lb-count');
    figure = $('#lb-figure');

    $('#lb-close').addEventListener('click', function () { dlg.close(); });
    $('#lb-prev').addEventListener('click', function () { show(state.index - 1); });
    $('#lb-next').addEventListener('click', function () { show(state.index + 1); });

    dlg.addEventListener('close', function () {
      document.body.classList.remove('no-scroll');
      if (state.opener) state.opener.focus();
    });
    // klik area gelap menutup
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg || e.target.classList.contains('lightbox-inner')) dlg.close();
    });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(state.index - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); show(state.index + 1); }
    });

    // swipe (sentuh/pena)
    var sx = null, sy = null;
    figure.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return;
      sx = e.clientX; sy = e.clientY;
    });
    figure.addEventListener('pointerup', function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      sx = sy = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) show(state.index + (dx < 0 ? 1 : -1));
    });
    figure.addEventListener('pointercancel', function () { sx = sy = null; });
  }

  RW.gallery_ui = {
    init: function () {
      renderFilters();
      renderGrid();
      initLightbox();
    },
  };
})();
