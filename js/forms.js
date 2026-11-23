/* Formulir antar-jemput & kontak: validasi + hand-off ke WhatsApp (tanpa backend). */
(function () {
  var RW = window.RW;
  var cfg = RW.siteConfig;
  var esc = RW.esc;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };

  /* ---------- Validator (mengembalikan teks galat atau '') ---------- */
  var V = {
    name: function (v) {
      v = v.trim();
      if (!v) return 'Nama wajib diisi.';
      if (v.length < 2) return 'Nama minimal 2 karakter.';
      if (v.length > 60) return 'Nama maksimal 60 karakter.';
      return '';
    },
    phone: function (v) {
      var n = v.replace(/[\s\-().]/g, '');
      if (!n) return 'Nomor WhatsApp wajib diisi.';
      if (!/^(\+62|62|0)8[1-9]\d{7,10}$/.test(n)) return 'Gunakan nomor seluler Indonesia yang valid, contoh 0812xxxxxxxx.';
      return '';
    },
    service: function (v) { return v ? '' : 'Pilih layanan terlebih dahulu.'; },
    date: function (v) {
      if (!v) return 'Tanggal jemput wajib diisi.';
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'Format tanggal tidak valid.';
      if (v < RW.fmt.todayISO(0)) return 'Tanggal tidak boleh sudah lewat.';
      if (v > RW.fmt.todayISO(60)) return 'Pilih tanggal dalam 60 hari ke depan.';
      return '';
    },
    time: function (v, all) {
      if (v === '') return 'Pilih jam jemput.';
      var slot = cfg.pickupSlots[Number(v)];
      if (!slot) return 'Jam jemput tidak valid.';
      var dateErr = V.date(all.date);
      if (!dateErr) {
        var why = slotProblem(all.date, slot);
        if (why) return why;
      }
      return '';
    },
    address: function (v) {
      v = v.trim();
      if (!v) return 'Alamat penjemputan wajib diisi.';
      if (v.length < 10) return 'Alamat terlalu singkat. Tulis jalan, nomor, dan patokan.';
      if (v.length > 250) return 'Alamat maksimal 250 karakter.';
      return '';
    },
    notes: function (v) { return v.trim().length > 300 ? 'Catatan maksimal 300 karakter.' : ''; },
    message: function (v) {
      v = v.trim();
      if (!v) return 'Pesan wajib diisi.';
      if (v.length < 10) return 'Pesan minimal 10 karakter.';
      if (v.length > 500) return 'Pesan maksimal 500 karakter.';
      return '';
    },
  };

  function hoursFor(iso) {
    var p = iso.split('-').map(Number);
    var day = new Date(p[0], p[1] - 1, p[2]).getDay();
    return day === 0 ? cfg.hours.sunday : cfg.hours.weekday;
  }

  /* Alasan slot tidak bisa dipakai pada tanggal tertentu, atau '' bila boleh. */
  function slotProblem(iso, slot) {
    var h = hoursFor(iso);
    if (slot.start < h.open || slot.end > h.close) {
      return 'Jam ini di luar jam operasional ' + h.label + ' (' + RW.fmt.hour(h.open) + '–' + RW.fmt.hour(h.close) + ').';
    }
    if (iso === RW.fmt.todayISO(0) && new Date().getHours() >= slot.end) return 'Jam ini sudah lewat. Pilih jam lain atau tanggal besok.';
    return '';
  }

  /* ---------- Mesin formulir generik ---------- */
  function setupForm(opts) {
    var form = $(opts.form);
    var submit = $(opts.submit);
    var label = $('.btn-label', submit);
    var handoff = $(opts.handoff);
    var touched = {};

    function values() {
      var o = {};
      opts.fields.forEach(function (f) { o[f] = form.elements[f].value; });
      return o;
    }

    function showError(field, msg) {
      var input = form.elements[field];
      var err = $('#' + opts.prefix + '-' + field + '-error');
      err.textContent = msg;
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      input.closest('.field').classList.toggle('has-error', !!msg);
    }

    function check(field, all) {
      var msg = V[field](all[field], all);
      showError(field, msg);
      return msg;
    }

    function validateAll() {
      var all = values();
      var firstBad = null;
      opts.fields.forEach(function (f) {
        touched[f] = true;
        if (check(f, all) && !firstBad) firstBad = f;
      });
      return firstBad;
    }

    opts.fields.forEach(function (f) {
      var el = form.elements[f];
      var evt = el.tagName === 'SELECT' || el.type === 'date' ? 'change' : 'input';
      el.addEventListener('blur', function () { touched[f] = true; check(f, values()); });
      el.addEventListener(evt, function () {
        if (opts.onChange) opts.onChange(f, values());
        var all = values();
        if (touched[f]) check(f, all);
        ((opts.deps && opts.deps[f]) || []).forEach(function (d) { if (touched[d]) check(d, all); });
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = validateAll();
      if (bad) { form.elements[bad].focus(); return; }
      var message = opts.buildMessage(values());
      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');
      label.textContent = 'Menyiapkan WhatsApp…';
      var opened = RW.wa.open(message); // sinkron di dalam event klik agar tidak diblokir popup blocker
      showHandoff(handoff, message, opened);
      setTimeout(function () {
        submit.disabled = false;
        submit.removeAttribute('aria-busy');
        label.textContent = 'Kirim via WhatsApp';
      }, 1200);
    });

    return { form: form, values: values, check: check };
  }

  function showHandoff(container, message, opened) {
    container.hidden = false;
    container.setAttribute('role', 'status');
    container.innerHTML =
      '<p class="handoff-title">' + RW.icon('check') + (opened ? 'WhatsApp akan dibuka untuk mengirim permintaan Anda.' : 'Browser memblokir jendela baru.') + '</p>' +
      '<p class="handoff-text">' + (opened
        ? 'Permintaan baru terkirim setelah Anda menekan tombol kirim di WhatsApp, dan baru dianggap diterima setelah tim membalas.'
        : 'Gunakan tombol Buka WhatsApp di bawah, atau salin pesan dan kirim sendiri. Permintaan baru terkirim setelah Anda menekan kirim di WhatsApp.') + '</p>' +
      '<pre class="handoff-preview" tabindex="0" aria-label="Pratinjau pesan WhatsApp">' + esc(message) + '</pre>' +
      '<div class="handoff-actions">' +
      '<a class="btn btn-primary btn-sm" href="' + RW.wa.url(message) + '" target="_blank" rel="noopener noreferrer">' + RW.icon('whatsapp') + 'Buka WhatsApp</a>' +
      '<button type="button" class="btn btn-outline btn-sm" data-copy>' + RW.icon('copy') + '<span>Salin pesan</span></button>' +
      '</div>';
    var copyBtn = container.querySelector('[data-copy]');
    copyBtn.addEventListener('click', function () {
      var span = copyBtn.querySelector('span');
      RW.copyText(message).then(function () { span.textContent = 'Tersalin'; })
        .catch(function () { span.textContent = 'Gagal menyalin, salin manual dari pratinjau'; })
        .then(function () { setTimeout(function () { span.textContent = 'Salin pesan'; }, 2200); });
    });
    container.scrollIntoView({ behavior: RW.prefersReducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
  }

  /* ---------- Formulir antar-jemput ---------- */
  function initPickup() {
    var svc = $('#pk-service');
    svc.innerHTML = '<option value="">Pilih layanan</option>' +
      RW.services.map(function (s) { return '<option value="' + esc(s.name) + '">' + esc(s.name) + '</option>'; }).join('');

    var date = $('#pk-date');
    date.min = RW.fmt.todayISO(0);
    date.max = RW.fmt.todayISO(60);

    var time = $('#pk-time');
    time.innerHTML = '<option value="">Pilih jam</option>' +
      cfg.pickupSlots.map(function (s, i) { return '<option value="' + i + '">' + RW.fmt.slot(s) + ' WIB</option>'; }).join('');

    function refreshSlots(all) {
      var ok = !V.date(all.date);
      Array.prototype.forEach.call(time.options, function (opt, i) {
        if (i === 0) return;
        var slot = cfg.pickupSlots[i - 1];
        var problem = ok ? slotProblem(all.date, slot) : '';
        opt.disabled = !!problem;
        opt.textContent = RW.fmt.slot(slot) + ' WIB' + (problem ? ' (tidak tersedia)' : '');
      });
      if (time.selectedOptions[0] && time.selectedOptions[0].disabled) time.value = '';
    }

    setupForm({
      form: '#pickup-form', submit: '#pk-submit', handoff: '#pk-handoff', prefix: 'pk',
      fields: ['name', 'phone', 'service', 'date', 'time', 'address', 'notes'],
      deps: { date: ['time'] },
      onChange: function (f, all) { if (f === 'date') refreshSlots(all); },
      buildMessage: function (v) {
        var slot = cfg.pickupSlots[Number(v.time)];
        return RW.wa.compose(
          'Halo RapiWash Laundry, saya ingin request antar-jemput laundry (dari formulir website).',
          [
            ['Nama', v.name],
            ['No. WhatsApp', v.phone],
            ['Layanan', v.service],
            ['Alamat jemput', v.address],
            ['Tanggal', RW.fmt.date(v.date)],
            ['Jam', RW.fmt.slot(slot) + ' WIB'],
            ['Catatan', v.notes],
          ],
          'Mohon konfirmasi ketersediaan jadwal dan estimasi biayanya. Terima kasih.'
        );
      },
    });
  }

  /* ---------- Formulir kontak ---------- */
  function initContact() {
    var msg = $('#ct-message');
    var counter = $('#ct-message-count');
    var updateCount = function () { counter.textContent = msg.value.length + '/500'; };
    msg.addEventListener('input', updateCount);
    updateCount();

    setupForm({
      form: '#contact-form', submit: '#ct-submit', handoff: '#ct-handoff', prefix: 'ct',
      fields: ['name', 'phone', 'message'],
      buildMessage: function (v) {
        return RW.wa.compose(
          'Halo RapiWash Laundry, saya ingin bertanya (dari formulir kontak website).',
          [['Nama', v.name], ['No. WhatsApp', v.phone], ['Pesan', v.message]],
          'Terima kasih.'
        );
      },
    });
  }

  RW.forms = {
    validators: V,
    init: function () { initPickup(); initContact(); },
  };
})();
