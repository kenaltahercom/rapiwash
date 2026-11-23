# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# RAPIWASH LAUNDRY — v1.1

**Status:** Ready for implementation  
**Product type:** Responsive service-business landing page  
**Brand:** RapiWash Laundry & Garment Care  
**Tagline:** Bersih Terawat, Waktu Lebih Hemat.  
**Primary conversion:** WhatsApp inquiry / booking handoff  

---

## 1. Product objective

Membangun landing page demo laundry yang meyakinkan, informatif, mobile-first, dan dapat dipakai sebagai template presentasi kepada pemilik usaha laundry. Website harus mengubah pengunjung menjadi calon pelanggan melalui informasi layanan yang jelas, estimasi biaya, formulir pickup, dan pemesanan WhatsApp. Semua konten bisnis bersifat simulasi dan mudah diganti.

## 2. Demo brand and business data

- Brand: RapiWash Laundry & Garment Care
- Tagline: Bersih Terawat, Waktu Lebih Hemat.
- Deskripsi: layanan perawatan pakaian modern dengan hasil bersih, harum, rapi, dan proses pemesanan praktis.
- Nomor telepon/WhatsApp: **0812-5759-1101**
- Format WhatsApp: **6281257591101**
- WhatsApp URL: `https://wa.me/6281257591101`
- Email contoh: `hello@rapiwash.example`
- Alamat contoh: Jl. Melati Raya No. 12, Semarang, Jawa Tengah (alamat simulasi; jangan arahkan ke lokasi bisnis nyata sebelum diverifikasi).
- Jam demo: Senin–Sabtu 08.00–21.00 WIB; Minggu 09.00–17.00 WIB.
- Instagram contoh: `@rapiwash.demo`
- TikTok contoh: `@rapiwash.demo`
- Facebook contoh: `RapiWash Laundry Demo`
- YouTube contoh: `RapiWash Laundry Demo`

Akun sosial, alamat, email, jam operasional, promo, harga, statistik, serta testimoni merupakan placeholder. Jangan menampilkan statistik pelanggan atau rating seolah-olah nyata. Semua tautan sosial perlu dipusatkan di satu file konfigurasi agar mudah diganti.

## 3. Audience and value proposition

**Audience:** mahasiswa/anak kos, pekerja kantoran, keluarga, pelanggan umum, pelanggan express, serta pelanggan yang membutuhkan antar-jemput.

**Value proposition:** perawatan pakaian yang praktis dengan pilihan layanan dan tarif yang mudah dipahami, kalkulasi estimasi transparan, serta jalur pemesanan WhatsApp.

## 4. Design system

### Palette
| Token | Hex | Usage |
|---|---|---|
| Primary teal | `#087F75` | CTA, icon, active state |
| Dark navy | `#163B4D` | Heading, footer, strong text |
| Warm amber | `#F6B75C` | Promo highlight, small accent |
| Mint | `#E3F5F1` | Soft section background |
| Off-white | `#F8FAF9` | Main background |
| Body text | `#263238` | Paragraphs |
| Muted text | `#718096` | Supporting copy |

### Typography
- Heading: Plus Jakarta Sans (800/700/600).
- Body: Inter (400/500/600).
- Fallback: system sans-serif.

### UI style
Clean modern premium; spacious layout; consistent 12–24px radii; subtle shadows; clear contrast; photo-led service cards; thin teal icon strokes; no excessive gradients, glassmorphism, or decorative movement.

## 5. Navigation

Sticky navbar links: Beranda, Tentang Kami, Layanan, Daftar Harga, Lokasi Cabang, Estimasi Biaya, Testimoni, FAQ, Kontak. Primary CTA: Pesan Sekarang.

Behavior: anchor navigation with smooth scroll; active section indicator; navbar gains a subtle shadow/background after scrolling; mobile hamburger opens/closes; menu closes after selection, Escape, or outside click; focus is managed for keyboard users.

## 6. Page structure and content requirements

1. **Hero:** headline “Bersih Terawat, Waktu Lebih Hemat.”, short value proposition, Pesan Sekarang and Lihat Layanan buttons, main laundry image, 2–3 concise service highlights. Do not invent customer-count or rating statistics.
2. **Benefits:** Bersih & Higienis, Wangi & Segar, Pengerjaan Tepat Waktu, Ditangani Profesional. Avoid unsupported guarantees; qualify operational claims as demo copy.
3. **About:** brand introduction, service approach, team/outlet photo, values and service standards.
4. **Services:** Laundry Kiloan, Cuci Kering Setrika, Express, Setrika Saja, Dry Cleaning, Cuci Sepatu, Cuci Tas, Bed Cover/perlengkapan rumah. Cards show name, short copy, starting price, indicative turnaround, and action.
5. **Pricing:** filter tabs by Kiloan, Satuan, Express; display tariff, unit, minimum order, indicative turnaround, and CTA.
6. **Promo:** sample promo, terms accordion/modal, CTA prefilled to WhatsApp. Clearly label all promo content as demo.
7. **Estimator:** reactive calculation based on selected service, unit/weight, add-ons, and pickup fee.
8. **Pickup & delivery:** validated form for name, WhatsApp number, address, date, time slot, service, and notes; submit creates a WhatsApp draft. No database or confirmed booking is implied.
9. **Gallery:** filters Outlet, Proses, Hasil; lightbox with previous/next, close, Escape, and mobile swipe.
10. **Branch:** demo address, opening hours, phone, WhatsApp, and map-search link. The address is not a verified outlet.
11. **Testimonials:** sample cards explicitly labeled as demo content until replaced by real reviews; manual carousel controls.
12. **FAQ:** service time, express availability, pickup, pricing, garment handling, payments, shoes/bags, booking. Accordion accessible by keyboard.
13. **Contact:** phone, WhatsApp, email placeholder, sample socials, validated contact form generating WhatsApp message.
14. **Footer:** logo, tagline, navigation, services, contact, opening hours, social links, privacy/terms placeholder, back-to-top.

## 7. Sample pricing data and estimator logic

| Service | Unit | Demo price |
|---|---|---:|
| Cuci Kering Lipat | kg | Rp7.000 |
| Cuci Kering Setrika | kg | Rp9.000 |
| Setrika Saja | kg | Rp6.000 |
| Express Same Day | kg | Rp15.000 |
| Express 3 Jam | kg | Rp20.000 |
| Bed Cover | item | Rp30.000 |
| Cuci Sepatu | pair | Rp35.000 |
| Cuci Tas | item | Rp30.000 |

Rules:
- Kiloan minimum 1 kg, increment 0,5 kg.
- Item-based services use integer quantity.
- Premium fragrance add-on: Rp2.000/kg (optional).
- Pickup fee: Rp5.000 for orders below 5 kg within the demo coverage; free from 5 kg. Outside radius, quote via WhatsApp; do not auto-apply free pickup.
- Estimated total = unit price × selected quantity + add-ons + pickup fee.
- Live total updates without page reload; show line-item breakdown and “estimasi, bukan invoice”.
- Reset returns to default service and quantity. Validate quantity and selected add-ons.

## 8. WhatsApp and form behavior

All WhatsApp CTAs use `https://wa.me/6281257591101?text={URL_ENCODED_MESSAGE}`. Message templates must include source context (service card, promo, estimator, pickup, or contact) and all relevant entered selections. Do not claim “booking confirmed”; show “WhatsApp akan dibuka untuk mengirim permintaan”.

Phone links use `tel:+6281257591101`. Contact form and pickup form validate required fields, Indonesian phone number format, date/time, and message length. On submit: create a human-readable summary, URL-encode it, open WhatsApp, and show a fallback copy-message action if popup navigation is blocked. There is no backend persistence.

## 9. Social media

Provide Instagram, TikTok, Facebook, and YouTube icons. Demo profile handles are placeholders and must be stored in one configuration object. Open external social links in a new tab with `rel="noopener noreferrer"`. If a demo profile has not been created, link to the platform's main page or render the icon as disabled text rather than a broken profile.

## 10. Asset manifest

Use assets from the accompanying `rapiwash-assets` package.

| Asset | Format | Placement / purpose |
|---|---|---|
| `brand/rapiwash-logo.svg` | SVG | Navbar and footer wordmark |
| `brand/rapiwash-logo.png` | Transparent PNG | Platforms that do not accept SVG |
| `brand/rapiwash-mark.svg` / `.png` | SVG / PNG | Mobile compact mark and avatar |
| `brand/favicon-32.png` | PNG | Browser favicon |
| `brand/favicon-512.png` | PNG | PWA/app icon |
| `photos/hero-laundry.jpg` | JPG | Main hero visual |
| `photos/about-care.jpg` | JPG | About section |
| `photos/service-*.jpg` | JPG | Service cards |
| `photos/pickup-delivery.jpg` | JPG | Pickup/delivery promotional section |
| `photos/gallery-*.jpg` | JPG | Gallery thumbnails |
| `icons/*.svg` | SVG | Service, benefit, contact, and social icons |
| `decorative/water-wave.svg` | SVG | Low-contrast section background |
| `references/*.png` | PNG | Design reference only; do not use as a full-page website image |

**Asset note:** current JPG photos are concept placeholders cropped from generated visual boards. Replace with original business photography before a real client launch. Keep image alt text descriptive; decorative images use empty alt.

## 11. Animation and motion specification

All motion should reinforce hierarchy and feedback, not delay access to content. Use CSS transform/opacity where possible; avoid large layout shifts and scroll hijacking.

- **Hero entrance:** headline and copy fade in with 16–20px upward movement over 600–750ms; CTA follows with 100ms stagger; hero photo fades/scales from 0.97 to 1 over 700–900ms. Run once on first load.
- **Decorative motion:** a soft blurred teal/mint shape may float 8–12px over 7–9 seconds; water accents can move slowly. Keep decorative motion subtle and behind content.
- **Scroll reveal:** sections/cards fade in and translate Y 14–20px when entering viewport; duration 450–600ms; stagger sibling cards by 70–100ms. Trigger once using IntersectionObserver. Content remains visible if observer or JS is unavailable.
- **Navbar:** active-link underline animates over 180–240ms; background/shadow transition over 200ms after scroll.
- **Cards:** hover lift 3–5px, shadow softens, image scale max 1.03 over 200–260ms. Disable lift on touch-only devices.
- **Buttons:** hover Y -1/-2px and icon shift 2–3px; press scale 0.98; transition 150–200ms. Focus-visible ring must remain clear.
- **Estimator:** total amount changes with a short 180–250ms numeric transition; do not animate so much that the figure becomes unreadable.
- **Gallery:** overlay fade 180ms, image scale 0.98 to 1 over 220ms; close/next/previous controls accessible.
- **FAQ:** accordion height/opacity transition 200–260ms; respect reduced motion.
- **Testimonials:** manual carousel by default. No compulsory autoplay. If optional autoplay is added, pause on hover, keyboard focus, touch interaction, and prefers-reduced-motion.
- **Forms:** field focus border transition 150ms; validation message fades/slides in subtly; submit button displays disabled/loading state only while opening the handoff, without claiming that the business received the message.
- **Back-to-top:** appears after scrolling 500px; fades/raises into view over 180ms.
- **Mobile sticky CTA:** optionally show a compact Pesan WhatsApp bar after the hero; ensure it does not cover form fields or browser safe areas.

### Accessibility and reduced motion

Respect `prefers-reduced-motion: reduce`: remove floating/parallax effects, disable reveal transforms and autoplay, use instant or very short transitions, and preserve all content visibility. Support keyboard operation, visible focus, logical focus order, adequate contrast, accessible labels, aria-expanded for accordions, dialog focus trap and Escape close for lightbox, and touch targets of at least 44×44px.

## 12. Responsive behavior

- Mobile: 320–767px; single-column sections, compact navbar, full-width forms/CTA, no horizontal overflow.
- Tablet: 768–1023px; two-column service/pricing layout when space permits.
- Desktop: 1024px+; max content width around 1200–1280px, multi-column cards, generous whitespace.
- Images use responsive `srcset`/`sizes` where supported, explicit width/height or aspect ratio, lazy loading below the fold, and eager/high priority only for the hero image.

## 13. Technical requirements

- Frontend-only static landing page; backend not required for demo.
- Reusable components and centralized content configuration (`siteConfig`, `services`, `pricing`, `socialLinks`, `faqs`, `testimonials`).
- Separate UI from content data; no repeated hardcoded phone numbers or prices across components.
- Semantic HTML, SEO metadata, Open Graph image, favicon, sitemap, robots.txt, and basic LocalBusiness structured data only after business details are verified.
- Use optimized image formats; serve WebP/AVIF when build tooling supports, retaining JPG fallback.
- Avoid heavy animation libraries for simple CSS/IntersectionObserver motion.
- Ensure no console errors, broken links, dead buttons, layout shifts, or horizontal overflow.

## 14. SEO

Title: `RapiWash Laundry | Laundry Bersih, Wangi & Praktis di Semarang`

Meta description: `Nikmati layanan laundry kiloan, express, setrika, sepatu, dan tas bersama RapiWash Laundry. Hitung estimasi biaya dan ajukan pemesanan melalui WhatsApp.`

Example keywords: laundry Semarang, laundry kiloan Semarang, laundry express Semarang, laundry antar jemput. Keywords and LocalBusiness schema must be revised for actual client location and services.

## 15. Acceptance criteria

1. All 14 page sections render responsively.
2. Every navbar link and CTA performs its stated action.
3. All WhatsApp paths use `6281257591101` and generate encoded contextual messages.
4. The estimator calculates correct totals for all service/unit combinations, add-ons, and pickup rules.
5. Pickup/contact forms validate and hand off to WhatsApp with a summary.
6. Social icons lead to valid, configured URLs or are visibly disabled placeholders.
7. Gallery filters and lightbox work with keyboard and touch.
8. Testimonials carousel works with manual controls.
9. FAQ accordion works with keyboard and screen readers.
10. Google Maps link is clearly identified as a demo search address until verified.
11. Motion is subtle, non-blocking, and reduced-motion aware.
12. No fake business statistics, false booking confirmation, or unverified testimonials are presented as facts.
13. Desktop, tablet, and mobile show no horizontal overflow.
14. No dead buttons, broken images, console errors, or inaccessible focus states.
15. All brand and business data can be replaced through centralized configuration.

## 16. Project principle

**Every element must work.** Visual polish, real interactions, accessibility, performance, and replaceable content are equally important. The website must feel like a complete, professional laundry business experience while remaining honest that all business data is demo content.
