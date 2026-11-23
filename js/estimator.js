/* Kalkulator estimasi biaya. Aturan tarif diambil dari config.js (rules + pricing). */
(function () {
  var RW = window.RW;
  var cfg = RW.siteConfig;
  var R = cfg.rules;
  var esc = RW.esc;
  var $ = function (sel) { return document.querySelector(sel); };

  var DEFAULTS = { id: 'cuci-kering-setrika', qty: 3 };

  /* ---------- Logika murni (bisa diuji tanpa DOM) ---------- */

  /* Ubah teks jumlah ("3,5" / "3.5" / "4") menjadi angka; NaN bila format salah. */
  function parseQty(raw) {
    var s = String(raw).trim().replace(',', '.');
    if (!/^\d+(\.\d+)?$/.test(s)) return NaN;
    return Number(s);
  }

  /* Kembalikan teks galat atau '' bila jumlah valid untuk layanan tersebut. */
  function validateQty(item, qty) {
    var u = RW.unitLabels[item.unit];
    if (Number.isNaN(qty)) return 'Masukkan angka yang valid, contoh: ' + (item.unit === 'kg' ? '2,5' : '2') + '.';
    if (item.unit === 'kg') {
      if (qty < R.minKg) return 'Berat minimal ' + RW.fmt.qty(R.minKg) + ' kg.';
      if (qty > R.maxKg) return 'Maksimal ' + RW.fmt.qty(R.maxKg) + ' kg per estimasi. Untuk jumlah lebih besar, tanyakan via WhatsApp.';
      if (Math.abs(qty / R.stepKg - Math.round(qty / R.stepKg)) > 1e-9) return 'Berat harus kelipatan ' + RW.fmt.qty(R.stepKg) + ' kg (contoh: 2; 2,5; 3).';
      return '';
    }
    if (!Number.isInteger(qty)) return 'Jumlah harus bilangan bulat.';
    if (qty < 1) return 'Jumlah minimal 1 ' + u.short + '.';
    if (qty > R.maxItems) return 'Maksimal ' + R.maxItems + ' ' + u.short + ' per estimasi. Untuk jumlah lebih besar, tanyakan via WhatsApp.';
    return '';
  }

  /*
   * Hitung estimasi.
   * input: { id, qty, fragrance, pickup, zone: 'in'|'out' }
   * Total = harga satuan × jumlah + pewangi + ongkos antar-jemput.
   * - Pewangi hanya untuk layanan per-kg.
   * - Antar-jemput dalam radius: layanan per-kg gratis mulai freePickupFromKg, di bawahnya pickupFee;
   *   layanan satuan selalu pickupFee. Di luar radius: tidak ditambahkan, dikonfirmasi via WhatsApp.
   */
  function calcEstimate(input) {
    var item = RW.priceById(input.id);
    if (!item) return { valid: false, error: 'Layanan tidak ditemukan.' };
    var error = validateQty(item, input.qty);
    if (error) return { valid: false, error: error, item: item };

    var u = RW.unitLabels[item.unit];
    var isKg = item.unit === 'kg';
    var lines = [];
    var base = item.price * input.qty;
    lines.push({ key: 'base', label: item.name, detail: RW.fmt.rupiah(item.price) + ' × ' + RW.fmt.qty(input.qty) + ' ' + u.short, amount: base });

    var total = base;
    if (isKg && input.fragrance) {
      var f = R.fragrancePerKg * input.qty;
      lines.push({ key: 'fragrance', label: 'Pewangi premium', detail: RW.fmt.rupiah(R.fragrancePerKg) + ' × ' + RW.fmt.qty(input.qty) + ' kg', amount: f });
      total += f;
    }

    var pickupPending = false;
    if (input.pickup) {
      if (input.zone === 'out') {
        pickupPending = true;
        lines.push({ key: 'pickup', label: 'Antar-jemput', detail: 'Di luar radius demo', amountText: 'Dikonfirmasi via WhatsApp', amount: 0 });
      } else {
        var free = isKg && input.qty >= R.freePickupFromKg;
        var fee = free ? 0 : R.pickupFee;
        lines.push({ key: 'pickup', label: 'Antar-jemput', detail: free ? 'Gratis mulai ' + RW.fmt.qty(R.freePickupFromKg) + ' kg' : 'Dalam radius demo', amountText: free ? 'Gratis' : null, amount: fee });
        total += fee;
      }
    }
    return { valid: true, item: item, lines: lines, total: total, pickupPending: pickupPending, qty: input.qty };
  }

  RW.estimator = { parseQty: parseQty, validateQty: validateQty, calc: calcEstimate };

  /* ---------- UI ---------- */
  var els = {};
  var state = { id: DEFAULTS.id, raw: String(DEFAULTS.qty), fragrance: false, pickup: false, zone: 'in' };
  var shownTotal = 0;
  var anim = null;

  function defaultQty(item) { return item.unit === 'kg' ? DEFAULTS.qty : 1; }

  function fillSelect() {
    var groups = RW.pricingCategories.map(function (c) {
      var opts = RW.pricing.filter(function (p) { return p.category === c.id; }).map(function (p) {
        return '<option value="' + p.id + '">' + esc(p.name) + ' — ' + RW.priceLabel(p) + '</option>';
      }).join('');
      return '<optgroup label="' + esc(c.label) + '">' + opts + '</optgroup>';
    }).join('');
    els.service.innerHTML = groups;
    els.service.value = state.id;
  }

  function setTotal(n) {
    els.total.textContent = RW.fmt.rupiah(n);
    shownTotal = n;
  }

  function animateTotal(to) {
    if (anim) cancelAnimationFrame(anim);
    var from = shownTotal;
    if (RW.prefersReducedMotion() || from === to) { setTotal(to); return; }
    var start = null, dur = 220;
    function frame(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      els.total.textContent = RW.fmt.rupiah(from + (to - from) * eased);
      if (t < 1) anim = requestAnimationFrame(frame);
      else { setTotal(to); anim = null; }
    }
    anim = requestAnimationFrame(frame);
  }

  function breakdownHTML(res) {
    return res.lines.map(function (l) {
      var amount = l.amountText || RW.fmt.rupiah(l.amount);
      return '<div class="bd-row"><dt>' + esc(l.label) + '<small>' + esc(l.detail) + '</small></dt><dd>' + esc(amount) + '</dd></div>';
    }).join('');
  }

  function orderMessage(res) {
    var u = RW.unitLabels[res.item.unit];
    var lines = res.lines.map(function (l) {
      return '- ' + l.label + ': ' + l.detail + ' = ' + (l.amountText || RW.fmt.rupiah(l.amount));
    }).join('\n');
    return RW.wa.compose(
      'Halo RapiWash Laundry, saya ingin memesan sesuai estimasi dari website.',
      [
        ['Layanan', res.item.name],
        ['Jumlah', RW.fmt.qty(res.qty) + ' ' + u.short],
        ['Pewangi premium', res.item.unit === 'kg' ? (state.fragrance ? 'Ya' : 'Tidak') : ''],
        ['Antar-jemput', state.pickup ? (state.zone === 'out' ? 'Ya (di luar radius demo, mohon info ongkos)' : 'Ya (dalam radius demo)') : 'Tidak'],
        ['Sumber', 'Website RapiWash (kalkulator estimasi)'],
      ],
      'Rincian:\n' + lines + '\nTotal estimasi: ' + RW.fmt.rupiah(res.total) +
        (res.pickupPending ? ' (belum termasuk ongkos antar-jemput)' : '') +
        ' — estimasi, bukan invoice.\n\nMohon konfirmasi harga dan jadwalnya. Terima kasih.'
    );
  }

  function render() {
    var item = RW.priceById(state.id);
    var isKg = item.unit === 'kg';
    var u = RW.unitLabels[item.unit];

    els.qtyLabel.textContent = (isKg ? 'Berat' : 'Jumlah') + ' (' + u.short + ')';
    els.qtyHint.textContent = isKg
      ? 'Minimal ' + RW.fmt.qty(R.minKg) + ' kg, kelipatan ' + RW.fmt.qty(R.stepKg) + ' kg.'
      : 'Bilangan bulat, minimal 1 ' + u.short + '.';
    els.fragranceWrap.hidden = !isKg;
    els.pickupHint.textContent = isKg
      ? 'Gratis mulai ' + RW.fmt.qty(R.freePickupFromKg) + ' kg, di bawahnya ' + RW.fmt.rupiah(R.pickupFee)
      : RW.fmt.rupiah(R.pickupFee) + ' per pesanan, dalam radius demo';
    els.zoneField.hidden = !state.pickup;

    var qty = RW.estimator.parseQty(state.raw);
    if (els.pickupBadge) {
      var isFree = isKg && !Number.isNaN(qty) && qty >= R.freePickupFromKg;
      els.pickupBadge.textContent = isKg
        ? (isFree ? 'Gratis' : '+' + RW.fmt.rupiah(R.pickupFee))
        : '+' + RW.fmt.rupiah(R.pickupFee);
    }
    var res = calcEstimate({ id: state.id, qty: qty, fragrance: state.fragrance && isKg, pickup: state.pickup, zone: state.zone });

    els.qty.setAttribute('aria-invalid', String(!res.valid));
    els.qtyError.textContent = res.valid ? '' : res.error;

    if (!res.valid) {
      els.breakdown.innerHTML = '<div class="bd-empty">Lengkapi jumlah yang valid untuk melihat rincian.</div>';
      els.totalSr.textContent = 'Jumlah belum valid.';
      animateTotal(0);
      els.order.setAttribute('aria-disabled', 'true');
      els.order.removeAttribute('href');
      return;
    }

    els.breakdown.innerHTML = breakdownHTML(res);
    animateTotal(res.total);
    els.totalSr.textContent = 'Total estimasi ' + RW.fmt.rupiah(res.total) + (res.pickupPending ? ', belum termasuk ongkos antar-jemput' : '');
    els.note.textContent = res.pickupPending
      ? 'Belum termasuk ongkos antar-jemput (di luar radius, dikonfirmasi via WhatsApp). Estimasi, bukan invoice. Tarif contoh (demo).'
      : 'Estimasi, bukan invoice. Tarif contoh (demo).';
    els.order.removeAttribute('aria-disabled');
    els.order.href = RW.wa.url(orderMessage(res));
    els.order.target = '_blank';
    els.order.rel = 'noopener noreferrer';
  }

  function step(dir) {
    var item = RW.priceById(state.id);
    var isKg = item.unit === 'kg';
    var cur = RW.estimator.parseQty(state.raw);
    var min = isKg ? R.minKg : 1;
    var max = isKg ? R.maxKg : R.maxItems;
    var inc = isKg ? R.stepKg : 1;
    if (Number.isNaN(cur)) cur = isKg ? R.minKg : 1;
    // rapikan ke kelipatan terdekat sebelum menambah/mengurangi
    cur = Math.round(cur / inc) * inc;
    var next = Math.min(max, Math.max(min, cur + dir * inc));
    state.raw = RW.fmt.qty(next);
    els.qty.value = state.raw;
    render();
  }

  function reset() {
    state = { id: DEFAULTS.id, raw: String(DEFAULTS.qty), fragrance: false, pickup: false, zone: 'in' };
    els.service.value = state.id;
    els.qty.value = state.raw;
    els.fragrance.checked = false;
    els.pickup.checked = false;
    els.zone.value = 'in';
    render();
  }

  function init() {
    els = {
      form: $('#est-form'), service: $('#est-service'), qty: $('#est-qty'), qtyLabel: $('#est-qty-label'),
      qtyHint: $('#est-qty-hint'), qtyError: $('#est-qty-error'), fragrance: $('#est-fragrance'),
      fragranceWrap: $('#est-fragrance-wrap'), pickup: $('#est-pickup'), pickupHint: $('#est-pickup-hint'),
      pickupBadge: $('#est-pickup-badge'),
      zoneField: $('#est-zone-field'), zone: $('#est-zone'), breakdown: $('#est-breakdown'),
      total: $('#est-total'), totalSr: $('#est-total-sr'), note: $('#est-note'), order: $('#est-order'),
      reset: $('#est-reset'),
    };
    if (!els.form) return;
    fillSelect();
    els.qty.value = state.raw;

    els.service.addEventListener('change', function () {
      var prev = RW.priceById(state.id);
      var next = RW.priceById(els.service.value);
      state.id = next.id;
      if (prev.unit !== next.unit || next.unit !== 'kg') {
        state.raw = String(defaultQty(next));
        els.qty.value = state.raw;
      }
      if (next.unit !== 'kg') { state.fragrance = false; els.fragrance.checked = false; }
      render();
    });
    els.qty.addEventListener('input', function () { state.raw = els.qty.value; render(); });
    els.qty.addEventListener('blur', function () {
      var q = RW.estimator.parseQty(state.raw);
      if (!Number.isNaN(q)) { state.raw = RW.fmt.qty(q); els.qty.value = state.raw; }
    });
    Array.prototype.forEach.call(els.form.querySelectorAll('.stepper-btn'), function (b) {
      b.addEventListener('click', function () { step(Number(b.dataset.step)); });
    });
    els.fragrance.addEventListener('change', function () { state.fragrance = els.fragrance.checked; render(); });
    els.pickup.addEventListener('change', function () { state.pickup = els.pickup.checked; render(); });
    els.zone.addEventListener('change', function () { state.zone = els.zone.value; render(); });
    els.reset.addEventListener('click', reset);
    els.form.addEventListener('submit', function (e) { e.preventDefault(); });
    els.order.addEventListener('click', function (e) {
      if (els.order.getAttribute('aria-disabled') === 'true') { e.preventDefault(); els.qty.focus(); }
    });
    render();
  }

  RW.estimator.init = init;
})();
