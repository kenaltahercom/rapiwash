# RapiWash Laundry — Landing Page (Demo)

Landing page statis (HTML + CSS + JavaScript biasa), tanpa backend dan tanpa build step.
Semua pemesanan berakhir di WhatsApp. Acuan: `docs/product/PRD.md` (v1.1).

## Menjalankan
Disarankan lewat server statis (font self-host dimuat normal). Membuka `index.html` langsung dari file tetap berfungsi, tetapi Chrome memblokir font lokal sehingga tampil dengan font sistem. Contoh server:

    python3 -m http.server 8000

## Mengganti data (semua ada di `js/config.js`)
| Yang diganti | Objek di config.js |
|---|---|
| Nama, tagline, telepon, WhatsApp, email, alamat, jam buka | `RW.siteConfig` |
| Aturan kalkulator (min/step kg, pewangi, ongkos, gratis antar-jemput) | `RW.siteConfig.rules` |
| Slot jam penjemputan | `RW.siteConfig.pickupSlots` |
| Harga & estimasi waktu | `RW.pricing` (kartu layanan mengambil harga dari sini) |
| Kartu layanan | `RW.services` |
| Promo, FAQ, testimoni, cabang, galeri, sosial media | `RW.promos`, `RW.faqs`, `RW.testimonials`, `RW.branches`, `RW.gallery`, `RW.socialLinks` |

Seluruh data bawaan adalah **simulasi** dan berlabel demo di tampilan.

## Yang masih perlu diganti manual saat deploy
- Domain `https://rapiwash.example` di `index.html` (canonical, Open Graph), `sitemap.xml`, `robots.txt`, dan `RW.siteConfig.siteUrl`.
- Nomor WhatsApp pada blok `<noscript>` di `index.html` (tidak bisa mengambil dari config).
- Tautan sosial media (saat ini mengarah ke beranda platform).
- Foto di `assets/img/` (nama file dipertahankan; ganti isinya, lalu perbarui ukuran di `RW.images`).

## Struktur
    index.html          kerangka halaman + SEO
    css/                styles.css, icons.css (dibuat oleh tools/build-icons.py dari assets/icons)
    tools/              build-icons.py (jalankan ulang bila ikon berubah)
    js/                 config → util → render → ui → gallery → estimator → forms → main
    assets/             brand, icons, img (JPG + WebP), fonts (self-host), decorative
    docs/product/       PRD
