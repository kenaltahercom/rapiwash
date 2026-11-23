/* Render: membangun section dari data di config.js. */
(function () {
  var RW = window.RW;
  var cfg = RW.siteConfig;
  var esc = RW.esc;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function mount(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html;
    return el;
  }

  function waAttrs(source, text) {
    return ' data-wa data-wa-source="' + esc(source) + '"' + (text ? ' data-wa-text="' + esc(text) + '"' : '');
  }

  /* ---------- Navigasi ---------- */
  function renderNav() {
    var links = RW.nav.map(function (n) {
      return '<li><a href="#' + n.id + '" data-nav="' + n.id + '">' + esc(n.label) + '</a></li>';
    }).join('');
    mount('nav-list', links + '<li class="nav-indicator" aria-hidden="true"></li>');
    mount('mobile-list', links);
    mount('footer-nav', RW.nav.map(function (n) {
      return '<li><a href="#' + n.id + '">' + esc(n.label) + '</a></li>';
    }).join(''));
  }

  /* ---------- Benefit & Tentang ---------- */
  function renderBenefits() {
    mount('benefit-grid', RW.benefits.map(function (b) {
      return '<li class="reveal"><div class="benefit-card">' +
        '<span class="benefit-ico">' + RW.icon(b.icon) + '</span>' +
        '<h3>' + esc(b.title) + '</h3><p>' + esc(b.text) + '</p></div></li>';
    }).join(''));
  }

  function renderAbout() {
    $('#about-title').textContent = RW.about.title;
    mount('about-text', RW.about.paragraphs.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join(''));
    mount('about-points', RW.about.points.map(function (p) {
      return '<li>' + RW.icon('check') + '<span>' + esc(p) + '</span></li>';
    }).join(''));
  }

  /* ---------- Layanan ---------- */
  function servicePriceText(s) {
    var from = RW.priceFrom(s);
    return from ? 'Mulai ' + RW.priceLabel(from) : 'Tanya harga via WhatsApp';
  }

  function serviceMessage(s) {
    var from = RW.priceFrom(s);
    return RW.wa.compose(
      'Halo RapiWash Laundry, saya ingin memesan layanan ' + s.name + '.',
      [
        ['Layanan', s.name],
        ['Harga', from ? 'mulai ' + RW.priceLabel(from) + ' (estimasi dari website)' : 'mohon info harga'],
        ['Estimasi waktu', s.turnaround],
        ['Sumber', 'Website RapiWash (kartu layanan)'],
      ],
      'Mohon info ketersediaan dan jadwalnya. Terima kasih.'
    );
  }

  function renderServices() {
    mount('service-grid', RW.services.map(function (s) {
      return '<div class="reveal"><article class="card service-card">' +
        '<div class="service-media">' +
        RW.pic(s.photo, { alt: s.alt, sizes: '(min-width:1100px) 280px, (min-width:768px) 44vw, 92vw' }) +
        '</div><div class="service-body">' +
        '<h3>' + esc(s.name) + '</h3><p>' + esc(s.desc) + '</p>' +
        '<div class="service-meta"><span class="price">' + esc(servicePriceText(s)) + '</span>' +
        '<span class="time">' + RW.icon('clock') + esc(s.turnaround) + '</span></div>' +
        '<a class="btn btn-primary btn-sm"' + waAttrs('Kartu layanan: ' + s.name, serviceMessage(s)) + '>' +
        'Pesan' + RW.icon('arrow-right', 'btn-arrow') + '</a>' +
        '</div></article></div>';
    }).join(''));
  }

  /* ---------- Harga (tab) ---------- */
  function priceRowMessage(p) {
    return RW.wa.compose(
      'Halo RapiWash Laundry, saya ingin memesan ' + p.name + '.',
      [
        ['Layanan', p.name],
        ['Tarif', RW.priceLabel(p) + ' (estimasi dari website)'],
        ['Estimasi waktu', p.turnaround],
        ['Sumber', 'Website RapiWash (daftar harga)'],
      ],
      'Mohon info ketersediaan dan jadwalnya. Terima kasih.'
    );
  }

  function renderPricingPanel(catId) {
    var items = RW.pricing.filter(function (p) { return p.category === catId; });
    var panel = document.getElementById('pricing-panel');
    panel.innerHTML = '<ul class="price-list">' + items.map(function (p) {
      return '<li class="price-row">' +
        '<div class="price-main"><h3>' + esc(p.name) + '</h3><p>' + esc(p.note) + '</p></div>' +
        '<div class="price-info"><span>' + esc(p.minOrder) + '</span><span>' + RW.icon('clock') + esc(p.turnaround) + '</span></div>' +
        '<div class="price-amount"><strong>' + RW.fmt.rupiah(p.price) + '</strong><span>' + RW.unitLabels[p.unit].per + '</span></div>' +
        '<a class="btn btn-outline btn-sm"' + waAttrs('Daftar harga: ' + p.name, priceRowMessage(p)) + '>Pesan' + RW.icon('arrow-right', 'btn-arrow') + '</a>' +
        '</li>';
    }).join('') + '</ul>';
    panel.classList.remove('is-swapping');
    void panel.offsetWidth; // restart animasi
    panel.classList.add('is-swapping');
  }

  function selectPricingTab(tab, focus) {
    $$('[role="tab"]', document.getElementById('pricing-tabs')).forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    document.getElementById('pricing-panel').setAttribute('aria-labelledby', tab.id);
    renderPricingPanel(tab.dataset.cat);
    RW.bindWhatsApp(document.getElementById('pricing-panel'));
    if (focus) tab.focus();
  }

  function renderPricing() {
    var tabsEl = mount('pricing-tabs', RW.pricingCategories.map(function (c, i) {
      return '<button type="button" role="tab" class="tab" id="tab-' + c.id + '" data-cat="' + c.id + '"' +
        ' aria-controls="pricing-panel" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">' + esc(c.label) + '</button>';
    }).join(''));
    var tabs = $$('[role="tab"]', tabsEl);
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { selectPricingTab(tab); });
      tab.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') n = tabs[0];
        else if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); selectPricingTab(n, true); }
      });
    });
    document.getElementById('pricing-panel').setAttribute('aria-labelledby', tabs[0].id);
    renderPricingPanel(tabs[0].dataset.cat);
  }

  /* ---------- Promo ---------- */
  function renderPromos() {
    mount('promo-grid', RW.promos.map(function (p) {
      var msg = RW.wa.compose(
        'Halo RapiWash Laundry, saya tertarik dengan promo "' + p.title + '".',
        [['Promo', p.title], ['Kode', p.code], ['Sumber', 'Website RapiWash (promo demo)']],
        'Mohon info syarat dan cara menggunakannya. Terima kasih.'
      );
      return '<div class="reveal"><article class="card promo-card">' +
        '<div class="promo-top"><span class="tag">' + esc(p.tag) + '</span><span class="demo-tag">Demo</span></div>' +
        '<h3>' + esc(p.title) + '</h3><p>' + esc(p.text) + '</p>' +
        (p.code ? '<p class="promo-code">Kode contoh: <strong>' + esc(p.code) + '</strong></p>' : '') +
        '<details class="terms"><summary>Syarat &amp; ketentuan' + RW.icon('chevron-down', 'terms-chev') + '</summary>' +
        '<ul>' + p.terms.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></details>' +
        '<a class="btn btn-primary btn-sm"' + waAttrs('Promo: ' + p.title, msg) + '>' + RW.icon('whatsapp') + 'Gunakan Promo</a>' +
        '</article></div>';
    }).join(''));
  }

  /* ---------- Lokasi ---------- */
  function hoursRows() {
    var h = cfg.hours;
    return [h.weekday, h.sunday];
  }

  function renderBranches() {
    var mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(cfg.mapsQuery);
    var html = RW.branches.map(function (b) {
      var msg = RW.wa.compose('Halo RapiWash Laundry, saya ingin bertanya tentang ' + b.name + '.', [['Sumber', 'Website RapiWash (lokasi cabang)']]);
      return '<div class="reveal"><article class="card branch-card">' +
        '<div class="branch-head"><span class="demo-tag">Alamat demo</span><h3>' + esc(b.name) + '</h3></div>' +
        '<ul class="info-list">' +
        '<li>' + RW.icon('location') + '<span>' + esc(b.address) + '</span></li>' +
        hoursRows().map(function (r) {
          return '<li>' + RW.icon('clock') + '<span>' + esc(r.label) + ': ' + RW.fmt.hour(r.open) + '–' + RW.fmt.hour(r.close) + ' WIB</span></li>';
        }).join('') +
        '<li>' + RW.icon('phone') + '<a href="tel:' + cfg.phoneTel + '">' + esc(cfg.phoneDisplay) + '</a></li>' +
        '</ul>' +
        '<div class="branch-actions">' +
        '<a class="btn btn-primary btn-sm"' + waAttrs('Lokasi cabang: ' + b.name, msg) + '>' + RW.icon('whatsapp') + 'WhatsApp</a>' +
        '<a class="btn btn-outline btn-sm" href="tel:' + cfg.phoneTel + '">' + RW.icon('phone') + 'Telepon</a>' +
        '</div></article></div>' +
        '<div class="reveal"><aside class="card map-card">' +
        '<span class="map-pin">' + RW.icon('location') + '</span>' +
        '<h3>Cari di Google Maps</h3>' +
        '<p>Tautan ini membuka pencarian untuk alamat contoh. ' + esc(b.note) + '</p>' +
        '<a class="btn btn-primary" href="' + mapsUrl + '" target="_blank" rel="noopener noreferrer">Buka Google Maps' + RW.icon('external') + '</a>' +
        '</aside></div>';
    }).join('');
    mount('branch-grid', html);
  }

  /* ---------- Testimoni ---------- */
  function initials(name) {
    var parts = name.replace('Contoh ', '').split(' ');
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  }

  function renderTestimonials() {
    mount('testi-track', RW.testimonials.map(function (t, i) {
      return '<li class="carousel-item" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' dari ' + RW.testimonials.length + '">' +
        '<figure class="card testi-card"><blockquote>' + esc(t.text) + '</blockquote>' +
        '<figcaption><span class="avatar" aria-hidden="true">' + esc(initials(t.name)) + '</span>' +
        '<span><strong>' + esc(t.name) + '</strong><small>' + esc(t.role) + '</small></span>' +
        '<span class="demo-tag">Demo</span></figcaption></figure></li>';
    }).join(''));
  }

  /* ---------- FAQ ---------- */
  function renderFaq() {
    mount('faq-list', RW.faqs.map(function (f, i) {
      return '<div class="faq-item"><h3><button type="button" class="faq-q" id="faq-b-' + i + '" aria-expanded="false" aria-controls="faq-p-' + i + '">' +
        '<span>' + esc(f.q) + '</span>' + RW.icon('chevron-down', 'faq-chev') + '</button></h3>' +
        '<div class="faq-a" id="faq-p-' + i + '" role="region" aria-labelledby="faq-b-' + i + '"><div class="faq-a-inner"><p>' + esc(f.a) + '</p></div></div></div>';
    }).join(''));
  }

  /* ---------- Kontak, sosial, footer ---------- */
  function socialHTML() {
    return RW.socialLinks.map(function (s) {
      return '<li><a class="social-link" href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer"' +
        ' aria-label="' + esc(s.label + ' ' + s.handle + ' (akun demo, membuka beranda ' + s.label + ')') + '" title="' + esc(s.label + ': ' + s.handle + ' (demo)') + '">' +
        RW.icon(s.icon) + '</a></li>';
    }).join('');
  }

  function renderContact() {
    var addr = cfg.address.street + ', ' + cfg.address.city + ', ' + cfg.address.region;
    var generic = RW.wa.compose('Halo RapiWash Laundry, saya ingin bertanya.', [['Sumber', 'Website RapiWash (kontak)']]);
    mount('contact-list',
      '<li>' + RW.icon('phone') + '<span><small>Telepon</small><a href="tel:' + cfg.phoneTel + '">' + esc(cfg.phoneDisplay) + '</a></span></li>' +
      '<li>' + RW.icon('whatsapp') + '<span><small>WhatsApp</small><a' + waAttrs('Kontak', generic) + '>' + esc(cfg.phoneDisplay) + '</a></span></li>' +
      '<li>' + RW.icon('mail') + '<span><small>Email (contoh)</small><a href="mailto:' + esc(cfg.email) + '">' + esc(cfg.email) + '</a></span></li>' +
      '<li>' + RW.icon('location') + '<span><small>Alamat (simulasi)</small>' + esc(addr) + '</span></li>' +
      '<li>' + RW.icon('clock') + '<span><small>Jam operasional (contoh)</small>' +
      hoursRows().map(function (r) { return esc(r.label) + ': ' + RW.fmt.hour(r.open) + '–' + RW.fmt.hour(r.close) + ' WIB'; }).join('<br>') + '</span></li>'
    );
    mount('contact-social', socialHTML());
    mount('footer-social', socialHTML());
  }

  function renderFooter() {
    mount('footer-services', RW.services.map(function (s) {
      return '<li><a href="#layanan">' + esc(s.name) + '</a></li>';
    }).join(''));
    mount('footer-contact',
      '<li><a href="tel:' + cfg.phoneTel + '">' + esc(cfg.phoneDisplay) + '</a></li>' +
      '<li><a href="mailto:' + esc(cfg.email) + '">' + esc(cfg.email) + '</a></li>' +
      '<li>' + esc(cfg.address.street + ', ' + cfg.address.city) + '</li>'
    );
    mount('footer-hours', hoursRows().map(function (r) {
      return '<li>' + esc(r.label) + ': ' + RW.fmt.hour(r.open) + '–' + RW.fmt.hour(r.close) + '</li>';
    }).join(''));
    $('#year').textContent = new Date().getFullYear();
  }

  /* ---------- Binding teks & WhatsApp ---------- */
  function bindText() {
    var values = {
      freePickupFromKg: RW.fmt.qty(cfg.rules.freePickupFromKg),
      fragranceLabel: '+' + RW.fmt.rupiah(cfg.rules.fragrancePerKg) + '/kg',
      tagline: cfg.tagline,
    };
    $$('[data-bind]').forEach(function (el) {
      var v = values[el.dataset.bind];
      if (v !== undefined) el.textContent = v;
    });
  }

  RW.bindWhatsApp = function (root) {
    $$('[data-wa]', root).forEach(function (a) {
      var text = a.getAttribute('data-wa-text') || RW.wa.compose(
        'Halo RapiWash Laundry, saya ingin memesan layanan laundry.',
        [['Sumber', 'Website RapiWash (' + (a.getAttribute('data-wa-source') || 'tombol') + ')']]
      );
      a.href = RW.wa.url(text);
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });
  };

  RW.renderAll = function () {
    renderNav();
    renderBenefits();
    renderAbout();
    renderServices();
    renderPricing();
    renderPromos();
    renderBranches();
    renderTestimonials();
    renderFaq();
    renderContact();
    renderFooter();
    bindText();
    RW.bindWhatsApp(document);
  };
})();
