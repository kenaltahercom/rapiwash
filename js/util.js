/* Util: format, WhatsApp, ikon, gambar. Bergantung pada config.js. */
(function () {
  var RW = window.RW;
  var cfg = RW.siteConfig;

  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  var pad2 = function (n) { return String(n).padStart(2, '0'); };

  RW.fmt = {
    rupiah: function (n) { return 'Rp' + Math.round(n).toLocaleString('id-ID'); },
    qty: function (n) { return Number(n).toLocaleString('id-ID', { maximumFractionDigits: 1 }); },
    hour: function (h) { return pad2(h) + '.00'; },
    slot: function (s) { return pad2(s.start) + '.00–' + pad2(s.end) + '.00'; },
    date: function (iso) {
      var p = iso.split('-').map(Number);
      return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      });
    },
    todayISO: function (offsetDays) {
      var d = new Date();
      d.setDate(d.getDate() + (offsetDays || 0));
      return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
    },
  };

  RW.esc = esc;

  RW.priceById = function (id) {
    return RW.pricing.find(function (p) { return p.id === id; });
  };

  /* Harga mulai sebuah layanan: harga terendah dari priceIds, atau null jika belum ada tarif. */
  RW.priceFrom = function (service) {
    var items = service.priceIds.map(RW.priceById).filter(Boolean);
    if (!items.length) return null;
    return items.reduce(function (a, b) { return b.price < a.price ? b : a; });
  };

  RW.priceLabel = function (item) {
    return RW.fmt.rupiah(item.price) + RW.unitLabels[item.unit].per;
  };

  /* ---- WhatsApp ---- */
  RW.wa = {
    url: function (message) {
      var base = 'https://wa.me/' + cfg.whatsapp;
      return message ? base + '?text=' + encodeURIComponent(message) : base;
    },
    /* Pesan umum: judul + baris "Label: nilai" + penutup. lines = [[label, value], ...] */
    compose: function (intro, lines, outro) {
      var out = [intro];
      var body = lines
        .filter(function (l) { return l && l[1] !== undefined && l[1] !== null && String(l[1]).trim() !== ''; })
        .map(function (l) { return l[0] + ': ' + String(l[1]).trim(); });
      if (body.length) out.push('', body.join('\n'));
      if (outro) out.push('', outro);
      return out.join('\n');
    },
    open: function (message) {
      // Catatan: window.open(..., 'noopener') selalu mengembalikan null, sehingga popup yang
      // diblokir tidak bisa dibedakan dari yang berhasil. Karena itu opener dilepas manual.
      var win = window.open(RW.wa.url(message), '_blank');
      if (win) { try { win.opener = null; } catch (e) { /* abaikan */ } }
      return !!win;
    },
  };

  /* ---- Ikon (CSS mask, mengikuti warna teks) ---- */
  RW.icon = function (name, cls) {
    return '<span class="ico i-' + name + (cls ? ' ' + cls : '') + '" aria-hidden="true"></span>';
  };

  /* ---- Gambar responsif: JPG ---- */
  RW.pic = function (name, opts) {
    opts = opts || {};
    var d = RW.images[name] || [800, 600];
    var w = d[0], h = d[1];
    var base = 'assets/img/' + name;
    return (
      '<img src="' + base + '.jpg"' +
      ' width="' + w + '" height="' + h + '" alt="' + esc(opts.alt || '') + '"' +
      (opts.cls ? ' class="' + opts.cls + '"' : '') +
      (opts.eager ? ' fetchpriority="high" decoding="async"' : ' loading="lazy" decoding="async"') +
      '>'
    );
  };

  /* Copy ke clipboard dengan fallback. */
  RW.copyText = function (text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy') ? resolve() : reject(new Error('copy failed')); }
      catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  };

  RW.prefersReducedMotion = function () {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };
})();
