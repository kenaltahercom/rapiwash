/*
 * RapiWash — pusat data & konfigurasi.
 * Semua teks bisnis, harga, kontak, sosial media, FAQ, dan testimoni ada di file ini.
 * Ganti nilai di sini; komponen tidak menyimpan nomor/harga sendiri.
 * SELURUH DATA DI BAWAH ADALAH SIMULASI (DEMO) sampai dikonfirmasi pemilik usaha.
 */
window.RW = window.RW || {};

RW.siteConfig = {
  isDemo: true,
  brand: 'RapiWash Laundry',
  brandLong: 'RapiWash Laundry & Garment Care',
  tagline: 'Bersih Terawat, Waktu Lebih Hemat.',
  // Ganti dengan domain asli saat deploy (dipakai untuk canonical, Open Graph, sitemap).
  siteUrl: 'https://rapiwash.example',

  phoneDisplay: '0812-5759-1101',
  phoneTel: '+6281257591101',
  whatsapp: '6281257591101', // format internasional tanpa +
  email: 'hello@rapiwash.example',

  address: {
    street: 'Jl. Melati Raya No. 12',
    city: 'Semarang',
    region: 'Jawa Tengah',
  },
  mapsQuery: 'Jl. Melati Raya No. 12, Semarang',

  // open/close dalam jam (24 jam). Dipakai juga untuk validasi jam penjemputan.
  hours: {
    weekday: { label: 'Senin–Sabtu', open: 8, close: 21 },
    sunday: { label: 'Minggu', open: 9, close: 17 },
  },

  // Aturan tarif tambahan & kalkulator
  rules: {
    minKg: 1,
    stepKg: 0.5,
    maxKg: 100,
    maxItems: 50,
    fragrancePerKg: 2000,
    pickupFee: 5000,
    freePickupFromKg: 5,
  },

  // Slot jam penjemputan (jam mulai–selesai, 24 jam)
  pickupSlots: [
    { start: 8, end: 10 },
    { start: 10, end: 12 },
    { start: 13, end: 15 },
    { start: 15, end: 17 },
    { start: 17, end: 19 },
    { start: 19, end: 21 },
  ],
};

/* Akun sosial: ganti url/handle dengan akun asli. Saat ini mengarah ke beranda platform
   karena akun demo belum dibuat (hindari tautan ke profil orang lain). */
RW.socialLinks = [
  { id: 'instagram', label: 'Instagram', handle: '@rapiwash.demo', url: 'https://www.instagram.com/', icon: 'instagram' },
  { id: 'tiktok', label: 'TikTok', handle: '@rapiwash.demo', url: 'https://www.tiktok.com/', icon: 'tiktok' },
  { id: 'facebook', label: 'Facebook', handle: 'RapiWash Laundry Demo', url: 'https://www.facebook.com/', icon: 'facebook' },
  { id: 'youtube', label: 'YouTube', handle: 'RapiWash Laundry Demo', url: 'https://www.youtube.com/', icon: 'youtube' },
];

/* Ukuran gambar asli (untuk atribut width/height agar tidak ada layout shift).
   [lebar, tinggi, lebar varian kecil atau 0 jika tidak ada] */
RW.images = {
  'hero-laundry': [1200, 900, 0],
  'about-care': [1200, 800, 0],
  'pickup-delivery': [1000, 800, 0],
  'service-kiloan': [1000, 667, 0],
  'service-ironing': [736, 981, 0],
  'service-express': [555, 450, 0],
  'service-dry-cleaning': [736, 1308, 0],
  'service-shoes': [736, 1104, 0],
  'service-bag': [1000, 1500, 0],
  'service-bed-cover': [1200, 1200, 0],
  'gallery-garments': [960, 1280, 0],
  'gallery-folding': [736, 981, 0],
  'gallery-outlet': [1200, 2133, 0],
  'hero-alt': [736, 1044, 0],
  'tas-laundry': [1200, 1200, 0],
};

/* Navigasi: urutan mengikuti urutan section di halaman agar indikator aktif bergerak berurutan. */
RW.nav = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'tentang', label: 'Tentang Kami' },
  { id: 'layanan', label: 'Layanan' },
  { id: 'harga', label: 'Daftar Harga' },
  { id: 'estimasi', label: 'Estimasi Biaya' },
  { id: 'lokasi', label: 'Lokasi Cabang' },
  { id: 'testimoni', label: 'Testimoni' },
  { id: 'faq', label: 'FAQ' },
  { id: 'kontak', label: 'Kontak' },
];

RW.benefits = [
  { icon: 'shield-check', title: 'Bersih & Higienis', text: 'Pakaian dicuci dengan prosedur yang menjaga kebersihan.' },
  { icon: 'droplet', title: 'Wangi & Segar', text: 'Aroma segar yang tahan lebih lama, pewangi premium opsional.' },
  { icon: 'clock', title: 'Pengerjaan Tepat Waktu', text: 'Estimasi selesai jelas, tersedia opsi express.' },
  { icon: 'hanger', title: 'Ditangani Profesional', text: 'Dikerjakan tim yang terbiasa merawat berbagai jenis pakaian.' },
];

/* Harga demo. unit: kg | item | pair. category: kiloan | satuan | express */
RW.pricing = [
  { id: 'cuci-kering-lipat', name: 'Cuci Kering Lipat', category: 'kiloan', unit: 'kg', price: 7000, minOrder: 'Min. 1 kg', turnaround: '2–3 hari kerja', note: 'Dicuci, dikeringkan, dan dilipat rapi.' },
  { id: 'cuci-kering-setrika', name: 'Cuci Kering Setrika', category: 'kiloan', unit: 'kg', price: 9000, minOrder: 'Min. 1 kg', turnaround: '2–3 hari kerja', note: 'Dicuci, dikeringkan, disetrika, dan dilipat.' },
  { id: 'setrika-saja', name: 'Setrika Saja', category: 'kiloan', unit: 'kg', price: 6000, minOrder: 'Min. 1 kg', turnaround: '1–2 hari kerja', note: 'Khusus pakaian bersih yang hanya perlu disetrika.' },
  { id: 'bed-cover', name: 'Bed Cover', category: 'satuan', unit: 'item', price: 30000, minOrder: 'Min. 1 item', turnaround: '3–4 hari kerja', note: 'Bed cover, selimut, dan perlengkapan rumah serupa.' },
  { id: 'cuci-sepatu', name: 'Cuci Sepatu', category: 'satuan', unit: 'pair', price: 35000, minOrder: 'Min. 1 pasang', turnaround: '3–4 hari kerja', note: 'Pembersihan sepatu harian dan sneakers.' },
  { id: 'cuci-tas', name: 'Cuci Tas', category: 'satuan', unit: 'item', price: 30000, minOrder: 'Min. 1 item', turnaround: '3–5 hari kerja', note: 'Perawatan tas sesuai bahan.' },
  { id: 'express-same-day', name: 'Express Same Day', category: 'express', unit: 'kg', price: 15000, minOrder: 'Min. 1 kg', turnaround: 'Hari yang sama*', note: '*Untuk pesanan masuk sebelum jam batas outlet.' },
  { id: 'express-3-jam', name: 'Express 3 Jam', category: 'express', unit: 'kg', price: 20000, minOrder: 'Min. 1 kg', turnaround: '±3 jam*', note: '*Tergantung antrean; konfirmasi via WhatsApp.' },
];

RW.pricingCategories = [
  { id: 'kiloan', label: 'Kiloan' },
  { id: 'satuan', label: 'Satuan' },
  { id: 'express', label: 'Express' },
];

RW.unitLabels = {
  kg: { short: 'kg', per: '/kg', long: 'kilogram' },
  item: { short: 'item', per: '/item', long: 'item' },
  pair: { short: 'pasang', per: '/pasang', long: 'pasang' },
};

/* Kartu layanan. priceIds → harga mulai diambil dari RW.pricing (tidak ditulis ulang).
   Dry Cleaning belum punya tarif di PRD → priceIds kosong, tampil "Tanya harga". */
RW.services = [
  { id: 'kiloan', name: 'Laundry Kiloan', desc: 'Cuci kering lipat untuk pakaian harian, dihitung per kilogram.', photo: 'service-kiloan', alt: 'Pakaian laundry kiloan bersih dan rapi', priceIds: ['cuci-kering-lipat'], turnaround: '2–3 hari kerja' },
  { id: 'cks', name: 'Cuci Kering Setrika', desc: 'Bersih, kering, dan disetrika rapi sehingga siap masuk lemari.', photo: 'gallery-garments', alt: 'Pakaian cuci kering setrika terlipat rapi', priceIds: ['cuci-kering-setrika'], turnaround: '2–3 hari kerja' },
  { id: 'express', name: 'Express', desc: 'Untuk kebutuhan mendesak: pilih same day atau express 3 jam.', photo: 'service-express', alt: 'Layanan laundry express cepat dan rapi', priceIds: ['express-same-day', 'express-3-jam'], turnaround: '3 jam – hari yang sama*' },
  { id: 'setrika', name: 'Setrika Saja', desc: 'Pakaian sudah bersih, tinggal disetrika dan dilipat rapi.', photo: 'service-ironing', alt: 'Penyetrikaan pakaian rapi dan licin', priceIds: ['setrika-saja'], turnaround: '1–2 hari kerja' },
  { id: 'dry-cleaning', name: 'Dry Cleaning', desc: 'Perawatan jas, blazer, dan pakaian bahan khusus.', photo: 'service-dry-cleaning', alt: 'Perawatan dry cleaning pakaian formal dan jas', priceIds: [], turnaround: '3–4 hari kerja' },
  { id: 'sepatu', name: 'Cuci Sepatu', desc: 'Sepatu harian dan sneakers dibersihkan hingga tampak segar.', photo: 'service-shoes', alt: 'Pembersihan dan cuci sepatu bersih seperti baru', priceIds: ['cuci-sepatu'], turnaround: '3–4 hari kerja' },
  { id: 'tas', name: 'Cuci Tas', desc: 'Perawatan tas dengan teknik yang disesuaikan bahan.', photo: 'service-bag', alt: 'Cuci dan perawatan tas bersih terawat', priceIds: ['cuci-tas'], turnaround: '3–5 hari kerja' },
  { id: 'bed-cover', name: 'Bed Cover', desc: 'Bed cover, selimut, dan perlengkapan tidur agar kembali lembut.', photo: 'service-bed-cover', alt: 'Cuci bed cover dan selimut lembut serta wangi', priceIds: ['bed-cover'], turnaround: '3–4 hari kerja' },
];

/* Promo contoh. Semuanya berlabel demo di UI. */
RW.promos = [
  {
    id: 'pelanggan-baru',
    tag: 'Pelanggan Baru',
    title: 'Diskon 10% pesanan pertama',
    text: 'Contoh promo untuk pelanggan yang pertama kali mencoba layanan.',
    terms: ['Maksimal potongan Rp15.000 (contoh).', 'Berlaku untuk layanan kiloan.', 'Sebutkan kode promo saat memesan via WhatsApp.'],
    code: 'BARU10',
  },
  {
    id: 'paket-bulanan',
    tag: 'Paket Bulanan',
    title: 'Paket 20 kg Cuci Kering Lipat',
    text: 'Contoh paket langganan: Rp125.000 untuk 20 kg, lebih hemat dari tarif normal.',
    terms: ['Kuota 20 kg berlaku 30 hari sejak pembelian (contoh).', 'Sisa kuota tidak dapat diuangkan.', 'Pembayaran dikonfirmasi lewat WhatsApp.'],
    code: 'PAKET20',
  },
  {
    id: 'antar-jemput',
    tag: 'Antar-Jemput',
    title: 'Gratis antar-jemput mulai 5 kg',
    text: 'Untuk pesanan kiloan dalam radius demo. Di bawah 5 kg dikenakan Rp5.000.',
    terms: ['Berlaku dalam radius layanan demo.', 'Di luar radius: ongkos dikonfirmasi via WhatsApp.', 'Jadwal jemput mengikuti ketersediaan kurir.'],
    code: '',
  },
];

RW.about = {
  title: 'Perawatan Pakaian Lebih Mudah Bersama Kami',
  paragraphs: [
    'RapiWash Laundry hadir sebagai konsep layanan perawatan pakaian modern: pilihan layanan jelas, tarif mudah dipahami, dan pemesanan cukup lewat WhatsApp.',
    'Kami membayangkan proses yang rapi dari awal sampai akhir — pakaian dipilah, dicuci sesuai jenisnya, dikeringkan, disetrika bila perlu, lalu dilipat dan dikemas.',
  ],
  points: ['Pilihan layanan lengkap untuk berbagai kebutuhan', 'Estimasi biaya transparan sebelum memesan', 'Antar-jemput untuk pelanggan yang sibuk'],
};

RW.gallery = [
  { id: 'g1', cat: 'outlet', img: 'gallery-outlet', alt: 'Deretan mesin cuci di area outlet laundry', caption: 'Area mesin cuci' },
  { id: 'g2', cat: 'outlet', img: 'hero-laundry', alt: 'Peralatan dan hasil cucian bersih dan rapi', caption: 'Peralatan & hasil cucian' },
  { id: 'g3', cat: 'outlet', img: 'service-kiloan', alt: 'Keranjang laundry berisi cucian rapi', caption: 'Laundry kiloan rapi' },
  { id: 'g4', cat: 'proses', img: 'gallery-folding', alt: 'Pakaian dilipat rapi dan higienis', caption: 'Pelipatan rapi' },
  { id: 'g5', cat: 'proses', img: 'pickup-delivery', alt: 'Kurir layanan antar jemput laundry', caption: 'Layanan antar-jemput' },
  { id: 'g6', cat: 'proses', img: 'service-ironing', alt: 'Penyetrikaan rapi dengan setrika uap', caption: 'Penyetrikaan uap' },
  { id: 'g7', cat: 'hasil', img: 'service-bed-cover', alt: 'Bed cover bersih dan wangi', caption: 'Bed cover bersih' },
  { id: 'g8', cat: 'hasil', img: 'service-dry-cleaning', alt: 'Hasil dry cleaning jas rapi', caption: 'Hasil dry cleaning' },
  { id: 'g9', cat: 'hasil', img: 'service-shoes', alt: 'Sepatu sneakers bersih dan segar', caption: 'Hasil cuci sepatu' },
  { id: 'g10', cat: 'hasil', img: 'service-bag', alt: 'Tas bersih dan terawat dengan baik', caption: 'Hasil cuci tas' },
  { id: 'g11', cat: 'hasil', img: 'gallery-garments', alt: 'Pakaian cuci kering setrika siap pakai', caption: 'Cuci kering setrika' },
  { id: 'g12', cat: 'proses', img: 'about-care', alt: 'Pakaian dan handuk bersih higienis', caption: 'Pakaian bersih higienis' },
];

RW.galleryCategories = [
  { id: 'all', label: 'Semua' },
  { id: 'outlet', label: 'Outlet' },
  { id: 'proses', label: 'Proses' },
  { id: 'hasil', label: 'Hasil' },
];

RW.branches = [
  {
    id: 'melati-raya',
    name: 'Outlet Melati Raya (Demo)',
    address: 'Jl. Melati Raya No. 12, Semarang, Jawa Tengah',
    note: 'Alamat simulasi, bukan outlet terverifikasi.',
  },
];

/* Contoh testimoni — wajib tetap berlabel demo sampai diganti ulasan asli. Tanpa rating bintang. */
RW.testimonials = [
  { name: 'Contoh Pelanggan A', role: 'Anak kos', text: 'Contoh testimoni: pesan lewat WhatsApp, pakaian dijemput, lalu kembali bersih dan terlipat rapi.' },
  { name: 'Contoh Pelanggan B', role: 'Pekerja kantoran', text: 'Contoh testimoni: kalkulator estimasinya membantu saya tahu perkiraan biaya sebelum memesan.' },
  { name: 'Contoh Pelanggan C', role: 'Ibu rumah tangga', text: 'Contoh testimoni: bed cover dan seprai kembali wangi, pilihan layanannya mudah dipahami.' },
  { name: 'Contoh Pelanggan D', role: 'Pelanggan express', text: 'Contoh testimoni: saat butuh cepat, opsi express memudahkan jadwal saya.' },
];

/* FAQ — jawaban adalah contoh dan perlu disesuaikan dengan kebijakan usaha nyata. */
RW.faqs = [
  { q: 'Berapa lama waktu pengerjaan laundry?', a: 'Layanan kiloan reguler diperkirakan 2–3 hari kerja. Pakaian yang hanya disetrika 1–2 hari kerja, sedangkan sepatu, tas, dan bed cover 3–5 hari kerja. Estimasi akhir dikonfirmasi saat pesanan diterima.' },
  { q: 'Apakah tersedia layanan express?', a: 'Ya, tersedia Express Same Day dan Express 3 Jam. Ketersediaan bergantung pada antrean outlet, jadi mohon konfirmasi lewat WhatsApp sebelum menyerahkan pakaian.' },
  { q: 'Bagaimana cara antar-jemput bekerja?', a: 'Isi formulir antar-jemput atau hubungi WhatsApp. Dalam radius demo, antar-jemput gratis mulai 5 kg; di bawah itu dikenakan Rp5.000. Di luar radius, ongkos dikonfirmasi lewat WhatsApp.' },
  { q: 'Bagaimana tarif dihitung?', a: 'Kiloan dihitung per kilogram (minimum 1 kg, kelipatan 0,5 kg). Layanan satuan seperti bed cover, sepatu, dan tas dihitung per item atau pasang. Gunakan kalkulator estimasi untuk perkiraan biaya.' },
  { q: 'Bagaimana dengan pakaian yang butuh perlakuan khusus?', a: 'Beri tahu kami di kolom catatan, misalnya bahan sensitif, noda tertentu, atau pakaian yang tidak boleh diperas. Tim akan memberi saran sebelum proses dimulai.' },
  { q: 'Metode pembayaran apa yang tersedia?', a: 'Metode pembayaran akan dikonfirmasi saat pesanan dibuat lewat WhatsApp. (Konten FAQ ini contoh; sesuaikan dengan kebijakan usaha Anda.)' },
  { q: 'Apakah sepatu dan tas bisa dicuci?', a: 'Bisa. Tersedia layanan Cuci Sepatu dan Cuci Tas per item. Hasil tergantung bahan dan kondisi awal; kami akan memberi tahu jika ada risiko sebelum dikerjakan.' },
  { q: 'Bagaimana cara memesan?', a: 'Klik Pesan Sekarang, isi formulir antar-jemput, atau pakai kalkulator estimasi. WhatsApp akan terbuka dengan pesan yang sudah terisi; pesanan baru dianggap masuk setelah Anda mengirim pesan itu dan tim membalas.' },
];

RW.legal = {
  privacy: { title: 'Kebijakan Privasi', text: 'Halaman ini adalah placeholder. Ganti dengan kebijakan privasi usaha Anda. Pada versi demo ini, data formulir tidak disimpan di server — hanya dipakai untuk menyusun pesan WhatsApp di perangkat Anda.' },
  terms: { title: 'Syarat & Ketentuan', text: 'Halaman ini adalah placeholder. Ganti dengan syarat dan ketentuan layanan usaha Anda. Seluruh harga, promo, dan estimasi di situs demo ini adalah contoh dan bukan penawaran resmi.' },
};
