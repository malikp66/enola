# Product Requirements Document

## Enola Scented Hijab Market Validation Dashboard

- Status: Draft for internal alignment
- Audience: Founder dan brand team Enola
- Product type: Internal business validation and presentation dashboard
- Platform: Website dashboard
- Primary objective: Mempercepat pemahaman insight survei, memperkuat kesiapan pitching, dan membantu keputusan lanjut market test
- Document note: Produk ini adalah dashboard presentasi dan validasi bisnis untuk brand Enola, bukan tugas kampus atau dashboard akademik

## 1. Executive Summary

### Problem Statement

Hasil survei Google Form untuk validasi ide bisnis Enola saat ini belum tersaji dalam format yang cukup kuat untuk presentasi bisnis. Tampilan bawaan Google Forms dan Google Sheets kurang premium, kurang fleksibel secara visual, dan tidak cukup baik untuk menjelaskan insight pasar, potensi pembelian, relevansi masalah konsumen, serta kesiapan market testing secara cepat kepada founder dan brand team.

### Proposed Solution

Membangun website dashboard visualisasi data survei untuk Enola yang membaca file CSV dari folder `public`, memproses data otomatis di frontend, lalu menyajikan insight bisnis dalam bentuk card, chart animatif, summary otomatis, dan guided tour dinamis. Dashboard harus terasa seperti product analytics dashboard modern untuk brand fashion/beauty, dengan desain feminin, premium, dan siap dipakai untuk pitching internal maupun presentasi validasi pasar.

### Success Criteria

1. Founder atau brand team dapat memahami kondisi pasar, minat produk, pricing fit, dan potensi market test dalam waktu maksimal 5 menit sejak membuka dashboard.
2. Semua metric utama dan final recommendation tampil otomatis dari file `/public/data/enola-survey.csv` tanpa backend dan tanpa upload manual.
3. Guided tour menjelaskan hasil aktual dari setiap chart dan card dengan konten dinamis berbasis data CSV.
4. Dashboard memuat state `loading`, `empty`, dan `error` yang jelas jika file tidak ditemukan atau struktur kolom tidak valid.
5. Final Business Validation Score dapat dipakai sebagai ringkasan keputusan untuk melanjutkan, menyesuaikan, atau menunda market testing.

## 2. Background

Enola sedang mengembangkan ide produk `scented hijab`, yaitu kerudung dengan aroma lembut dan segar untuk membantu pengguna merasa lebih nyaman, segar, dan percaya diri saat beraktivitas. Sebelum masuk ke tahap market testing, Enola perlu membuktikan apakah masalah pengguna memang cukup relevan, apakah ada ketertarikan terhadap konsep produk, apakah aroma yang dipilih sesuai selera pasar, dan apakah rentang harga MVP berada dalam kisaran yang bisa diterima.

Survei Google Form sudah menjadi sumber validasi awal. Tantangan berikutnya bukan lagi mengumpulkan data, tetapi mengubah data mentah menjadi narasi bisnis yang tajam, visual, dan mudah dipresentasikan.

## 3. Product Context

Dashboard ini adalah alat internal untuk:

- Membaca hasil survei validasi ide bisnis Enola dari file CSV.
- Mengubah data mentah menjadi insight yang cepat dipahami.
- Menunjukkan apakah ide scented hijab cukup kuat untuk diuji ke market.
- Membantu founder menjelaskan hasil survei dengan tampilan yang lebih baik daripada Google Forms.
- Menyatukan sudut pandang bisnis, desain, dan frontend implementation dalam satu sumber spesifikasi.

Dashboard ini bukan:

- Form pengisian survei.
- Sistem upload data manual.
- Admin panel operasional.
- Dashboard akademik atau tugas kampus.
- Sistem BI multi-tenant atau data warehouse.

## 4. Goals

### Business Goals

1. Menyederhanakan pembacaan hasil validasi pasar untuk internal Enola.
2. Meningkatkan kualitas presentasi ide bisnis scented hijab.
3. Memberi dasar keputusan yang lebih objektif untuk market testing MVP.
4. Menentukan sinyal awal tentang problem-market fit, preferred scent, dan price acceptance.

### Product Goals

1. Membaca CSV dari public path secara otomatis saat halaman dibuka.
2. Menghasilkan metric, score, insight summary, dan recommendation tanpa backend.
3. Menyediakan guided tour untuk setiap section utama dan setiap card/chart penting.
4. Menampilkan chart yang animatif, halus, dan presentable.
5. Menjaga desain desktop-first yang premium, feminin, modern, dan professional.

## 5. Non-Goals

1. Tidak membangun fitur upload CSV oleh user.
2. Tidak membangun integrasi langsung ke Google Sheets API pada MVP.
3. Tidak membangun autentikasi atau role-based access pada MVP.
4. Tidak membangun filter kompleks multi-dimensi seperti cohort, date range, atau segmentation engine pada MVP.
5. Tidak membangun generator aset campaign Instagram/TikTok berbasis AI pada MVP.

Catatan klarifikasi: istilah `social media assets` pada scope ini diinterpretasikan sebagai ikon visual untuk chart atau card yang merepresentasikan channel pembelian responden, bukan generator copywriting campaign.

## 6. Target Users

### Primary Persona

#### Founder / Brand Lead Enola

- Ingin memahami apakah ide scented hijab cukup layak untuk diuji.
- Butuh tampilan yang profesional untuk menjelaskan hasil survei dengan cepat.
- Fokus pada keputusan bisnis, bukan detail teknis spreadsheet.

### Secondary Persona

#### Internal Brand Strategist / Business Team

- Ingin melihat pola masalah pengguna, minat pasar, aroma favorit, dan harga yang diterima.
- Membutuhkan insight yang bisa langsung diterjemahkan menjadi langkah market test.

## 7. User Stories

### Story 1

Sebagai founder Enola, saya ingin membuka satu halaman dashboard dan langsung melihat insight utama hasil survei agar saya tidak perlu membaca spreadsheet mentah.

Acceptance Criteria:

- Dashboard otomatis mengambil CSV dari `/data/enola-survey.csv` saat halaman dibuka.
- Dashboard menampilkan total responden, top province, key scores, dan final recommendation tanpa interaksi tambahan.
- Dashboard menampilkan loading state sebelum data siap.

### Story 2

Sebagai brand team, saya ingin setiap chart menjelaskan hasilnya melalui guided tour agar saya dapat mempresentasikan insight dengan narasi yang konsisten.

Acceptance Criteria:

- Tersedia tombol `Start Dashboard Tour` di hero section.
- Tour mencakup setiap section utama dan setiap chart/card penting.
- Isi tour mengambil nilai aktual dari hasil analytics, bukan teks statis.
- Tour memiliki tombol `next`, `previous`, `finish`, dan `skip`.

### Story 3

Sebagai decision maker, saya ingin mendapatkan final business validation score agar keputusan market test bisa diringkas menjadi satu indikator yang mudah dikomunikasikan.

Acceptance Criteria:

- Dashboard menghitung `Market Interest Score`, `Purchase Intention Score`, `Problem Relevance Score`, `Price Fit Score`, dan `Final Business Validation Score`.
- Final score dikonversi ke status `Strong validation`, `Promising, test further`, `Needs refinement`, atau `Weak validation`.
- Final insight section menjelaskan alasan di balik status tersebut.

### Story 4

Sebagai internal presenter, saya ingin dashboard tetap terlihat premium di desktop dan tetap responsif di mobile agar dapat dipakai baik saat pitching maupun saat dibuka cepat dari perangkat lain.

Acceptance Criteria:

- Layout dioptimalkan untuk desktop presentation.
- Semua section tetap dapat diakses di mobile tanpa konten terpotong.
- Card, chart, button, dan tooltip memiliki motion yang halus dan tidak mengganggu.

### Story 5

Sebagai frontend developer, saya ingin spesifikasi data dan mapping kolom jelas agar dashboard tetap berfungsi walaupun label pertanyaan Google Form berubah sedikit.

Acceptance Criteria:

- PRD mendefinisikan mapping kolom berbasis keyword, bukan exact match.
- Sistem menampilkan error message yang mudah dipahami jika kolom wajib tidak ditemukan.
- Sistem aman untuk jawaban multi-select yang dipisahkan dengan koma.

## 8. User Flow

1. User membuka halaman dashboard Enola.
2. Halaman menampilkan hero section dengan branding Enola, ringkasan tujuan dashboard, dan CTA `Start Dashboard Tour`.
3. Client fetch membaca file `/data/enola-survey.csv`.
4. CSV diparse, dibersihkan, dan dimapping ke field analitik berdasarkan keyword.
5. Jika file tidak ditemukan, dashboard menampilkan empty state.
6. Jika kolom inti tidak valid, dashboard menampilkan error state dengan penjelasan field yang tidak terbaca.
7. Jika parsing berhasil, dashboard menampilkan seluruh section dari Market Overview hingga Final Business Validation.
8. User dapat menjalankan guided tour untuk memahami arti setiap chart dan hasil aktualnya.
9. User men-scroll hingga final recommendation untuk memutuskan apakah produk layak masuk ke tahap market testing.

## 9. User Experience and Visual Direction

Dashboard harus mengikuti arah visual berikut:

- High-fidelity
- Clean
- Premium
- Elegant
- Feminine
- Modern
- Soft but professional
- Business-presentation friendly

### Visual Principles

1. Gunakan warna bernuansa cream, beige, soft pink, rose, brown, nude, dan aksen gold lembut.
2. Hindari tampilan dashboard admin yang kaku atau terlalu korporat.
3. Gunakan spacing luas, rounded corner besar, soft border, subtle shadow, dan gradient background lembut.
4. Gunakan dekorasi ringan seperti glow, blob, mesh gradient, atau soft pattern untuk menjaga kesan brand fashion/beauty.
5. Prioritaskan desktop composition yang kuat, dengan responsive adaptation untuk tablet dan mobile.

## 10. Functional Requirements

### Data Ingestion

FR-01. Dashboard harus membaca file CSV dari public path, default: `/data/enola-survey.csv`.

FR-02. Dashboard harus memproses data secara otomatis saat halaman dibuka.

FR-03. Dashboard tidak boleh menyediakan upload CSV manual pada MVP.

FR-04. Dashboard harus menampilkan loading state selama file sedang dibaca atau diparse.

FR-05. Dashboard harus menampilkan empty state jika file CSV tidak ditemukan.

FR-06. Dashboard harus menampilkan error state yang mudah dipahami jika struktur CSV tidak valid atau kolom kunci tidak ditemukan.

### Analytics and Business Logic

FR-07. Dashboard harus menghitung total responden.

FR-08. Dashboard harus menghitung jumlah responden per provinsi dan menentukan provinsi dengan responden terbanyak.

FR-09. Dashboard harus menampilkan persentase pengguna kerudung aktif hanya jika terdapat kolom usage frequency yang relevan; bila tidak tersedia, metric harus tampil sebagai `Data belum tersedia di survei saat ini`.

FR-10. Dashboard harus menghitung distribusi frekuensi pembelian kerudung.

FR-11. Dashboard harus menghitung distribusi tempat pembelian kerudung.

FR-12. Dashboard harus menghitung distribusi masalah utama pengguna, termasuk parsing jawaban multi-select.

FR-13. Dashboard harus menghitung `Market Interest Score` dari jawaban `Sangat tertarik` dan `Tertarik`.

FR-14. Dashboard harus menghitung preferensi aroma dan menentukan aroma dengan jumlah pilihan tertinggi.

FR-15. Dashboard harus menghitung `Price Fit Score` berdasarkan kecocokan terhadap target harga MVP Enola `Rp100.000 - Rp200.000`.

FR-16. Dashboard harus menghitung `Purchase Intention Score` dari jawaban `Sangat mungkin` dan `Mungkin`.

FR-17. Dashboard harus menghitung `Problem Relevance Score` dan `Final Business Validation Score`.

FR-18. Dashboard harus menghasilkan insight summary otomatis berdasarkan hasil aktual data.

FR-19. Dashboard harus menghasilkan final recommendation dan suggested market testing strategy.

FR-19a. Setiap pertanyaan survei yang berhasil dimapping ke dashboard harus menghasilkan minimal satu insight dinamis yang dipakai di guided tour.

FR-19b. Setiap kelompok jawaban utama dari pertanyaan survei harus divisualisasikan dalam chart atau visual summary yang animatif, sehingga user tidak hanya melihat angka agregat tetapi juga distribusi jawaban.

### Guided Tour

FR-20. Dashboard harus menggunakan `shadcn-tour` dari repository `https://github.com/NiazMorshed2007/shadcn-tour.git`.

FR-21. Hero section harus memiliki tombol `Start Dashboard Tour`.

FR-22. Tour harus dapat di-restart kapan saja.

FR-23. Setiap statistic card, chart card, dan final insight card penting harus memiliki `data-tour` atau identifier khusus.

FR-24. Konten tour harus dinamis berdasarkan hasil analitik aktual.

FR-25. Tour content tidak boleh hanya menjelaskan fungsi komponen; tour harus menyertakan summary insight aktual.

FR-25a. Tour harus menjelaskan insight untuk masing-masing pertanyaan survei utama, termasuk apa arti distribusi jawabannya bagi keputusan bisnis Enola.

FR-25b. Jika satu pertanyaan memiliki beberapa opsi jawaban dominan, tour harus menampilkan pemenang utama, runner-up, dan implikasi bisnis singkat bila relevan.

### Presentation and Motion

FR-26. Semua section harus memiliki entrance animation.

FR-27. Semua card harus memiliki hover animation yang halus.

FR-28. Semua chart container harus memiliki fade/scale animation saat masuk viewport.

FR-29. Statistic cards harus memiliki animated number atau count-up.

FR-30. Recharts animation harus aktif dan terasa halus pada donut chart, bar chart, dan progress visualization.

FR-30a. Visual chart tidak boleh menggunakan style default bawaan Recharts secara mentah; semua chart harus memiliki styling kustom Enola seperti gradient fill, rounded bars, custom tooltip, soft gridline, branded legend, dan label treatment yang konsisten.

FR-30b. Chart harus terasa seperti presentational analytics component, bukan chart demo library.

### Channel Visual Assets

FR-31. Chart tempat pembelian harus menggunakan icon visual yang relevan untuk membantu pembacaan channel, misalnya toko offline, marketplace, Instagram shop, TikTok shop, reseller/WhatsApp, atau teman.

FR-32. Icon channel harus tampil sebagai bagian dari card, legend, label, atau helper visual yang konsisten dengan brand style.

## 11. Non-Functional Requirements

1. Next.js App Router wajib digunakan.
2. TypeScript wajib digunakan untuk semua logic dan component props.
3. Tailwind CSS wajib digunakan untuk styling.
4. `shadcn/ui` wajib digunakan untuk fondasi komponen UI.
5. `Recharts` wajib digunakan untuk visualisasi chart.
6. `Motion` atau `Framer Motion` wajib digunakan untuk animation layer.
7. `Lucide React` wajib digunakan untuk icon.
8. Tidak boleh ada dependency backend untuk MVP.
9. Dashboard harus deployable ke Vercel tanpa konfigurasi server tambahan.
10. Waktu render awal yang ditargetkan adalah < 2.5 detik pada desktop modern untuk CSV hingga 1.5 MB.
11. Dashboard harus tetap usable jika animation reduction dibutuhkan oleh user preference.
12. Type-safety harus dijaga melalui interface, parser utility, dan analytics helper yang jelas.
13. Target Lighthouse desktop: Performance >= 85, Accessibility >= 95, Best Practices >= 95.
14. Gaya visual chart dan card harus konsisten secara sistemik sehingga keseluruhan dashboard tidak terlihat seperti kumpulan komponen default.

## 12. Technical Specifications

### Architecture Overview

Client-side architecture pada MVP:

1. `app/page.tsx` memicu fetch ke `/data/enola-survey.csv`.
2. `lib/csv.ts` melakukan fetch, parse, sanitize, dan schema detection.
3. `lib/analytics.ts` mengubah raw rows menjadi metric, breakdown, ranking, score, dan summary object.
4. `lib/insights.ts` mengubah metric menjadi copy insight dan recommendation.
5. `lib/tour-steps.ts` membangun langkah tour dinamis berbasis analytics result dan insight per pertanyaan survei.
6. Komponen section menampilkan data melalui card dan chart Recharts.
7. `TourProvider.tsx` memasok state dan step untuk `shadcn-tour`.

### Recommended File Structure

- `app/page.tsx`
- `components/dashboard/HeroSection.tsx`
- `components/dashboard/MarketOverview.tsx`
- `components/dashboard/CustomerProblem.tsx`
- `components/dashboard/ProductInterest.tsx`
- `components/dashboard/PreferredScent.tsx`
- `components/dashboard/PriceAcceptance.tsx`
- `components/dashboard/PurchaseIntention.tsx`
- `components/dashboard/FinalValidation.tsx`
- `components/dashboard/PurchaseChannelAssets.tsx`
- `components/dashboard/TourProvider.tsx`
- `components/ui/MetricCard.tsx`
- `components/ui/ChartCard.tsx`
- `components/ui/InsightCard.tsx`
- `lib/csv.ts`
- `lib/analytics.ts`
- `lib/insights.ts`
- `lib/tour-steps.ts`
- `types/survey.ts`

### Integration Points

1. CSV source: `/public/data/enola-survey.csv`
2. Tour library: `shadcn-tour`
3. Animation library: `motion` atau `framer-motion`
4. Chart library: `recharts`
5. UI library: `shadcn/ui`

### Security and Privacy

Karena CSV disimpan di folder `public`, data yang tersedia akan dapat diakses sebagai asset publik. Oleh karena itu:

1. CSV tidak boleh mengandung email, nomor telepon, nama lengkap, atau PII lain.
2. Dashboard hanya boleh menggunakan data agregat untuk visualisasi.
3. Bila source Google Form masih mengandung PII, file export harus dibersihkan sebelum ditempatkan di `public/data`.

## 13. Data Source Requirements

1. Data harus berasal dari file CSV hasil export Google Sheets atau Google Forms.
2. File harus disimpan di folder public project website.
3. Default path yang dipakai MVP adalah `/data/enola-survey.csv`.
4. Penggantian data dilakukan dengan mengganti file CSV, tanpa proses sinkronisasi real-time.
5. Sistem harus tahan terhadap nama kolom Google Forms yang panjang.
6. Sistem harus memetakan kolom berdasarkan keyword matching, bukan exact title.

## 14. CSV Structure Requirements

### Format Expectations

1. Baris pertama adalah header.
2. Setiap baris berikutnya adalah satu responden.
3. Jawaban multi-select kemungkinan dipisahkan dengan koma.
4. Header bisa mengandung spasi ekstra dan tanda baca.
5. Nilai text perlu dinormalisasi melalui trim, lowercase, dan normalisasi dash/en dash.

### Current Sample Header Observations

File contoh yang tersedia saat penulisan PRD berada di:

- `C:\Users\malik\Documents\enola-cek\public\data\enola-survey.csv`

Kolom inti yang terdeteksi dari sample saat ini:

1. `Asal daerah Ibu/Bunda`
2. `Seberapa sering Ibu/Bunda membeli kerudung baru?`
3. `Biasanya Ibu/Bunda membeli kerudung di mana?`
4. `Masalah apa yang paling sering Ibu/Bunda rasakan saat memakai kerudung?`
5. `Apakah Ibu/Bunda pernah merasa kurang nyaman karena kerudung terasa bau atau tidak segar?`
6. `Jika ada kerudung dengan aroma wangi lembut dan segar, apakah Ibu/Bunda tertarik?`
7. `Aroma seperti apa yang paling Ibu/Bunda sukai untuk kerudung?`
8. `Jika kerudung wangi dijual dengan kualitas bahan yang nyaman, berapa harga yang masih cocok menurut Ibu/Bunda?`
9. `Jika produk ini tersedia, seberapa besar kemungkinan Ibu/Bunda ingin mencoba membelinya?`

### Mapping Requirements

| Business field | Keyword mapping example | Current sample |
| --- | --- | --- |
| Province | `asal daerah`, `provinsi`, `domisili` | Available |
| Buying frequency | `seberapa sering`, `membeli kerudung baru` | Available |
| Purchase channel | `membeli kerudung di mana`, `tempat beli` | Available |
| Main problem | `masalah`, `memakai kerudung` | Available |
| Freshness discomfort | `bau`, `tidak segar`, `kurang nyaman` | Available |
| Product interest | `tertarik` | Available |
| Preferred scent | `aroma`, `sukai` | Available |
| Price acceptance | `harga yang masih cocok`, `kualitas bahan yang nyaman` | Available |
| Purchase intention | `kemungkinan`, `mencoba membelinya` | Available |
| Active hijab usage | `seberapa sering memakai kerudung`, `pengguna kerudung aktif` | Not available in current sample |

### Required Fallback Rule

Jika kolom untuk `active hijab users` tidak ditemukan, dashboard tidak boleh memalsukan perhitungan. Component harus menampilkan state `Data belum tersedia di survei saat ini` dan PRD merekomendasikan penambahan pertanyaan khusus pada survei berikutnya.

## 15. CSV Processing Logic

### Parsing Pipeline

1. Fetch file CSV dari public path.
2. Validasi bahwa file berhasil diambil dan tidak kosong.
3. Parse CSV menggunakan parser yang aman untuk quoted string.
4. Normalisasi header: trim, lowercase, collapse spaces, remove punctuation noise.
5. Deteksi field berdasarkan keyword mapping.
6. Normalisasi cell values: trim, unify separators, normalisasi dash harga, hilangkan whitespace berlebih.
7. Split jawaban multi-select berdasarkan koma, sambil menjaga quoted segment tetap utuh.
8. Bentuk object row yang sudah dimapping ke schema internal.
9. Jalankan agregasi dan scoring.
10. Bangun insight summary dan tour content dari analytics result.

### Metric Calculations

1. `Total Respondents`
   - Jumlah semua row data valid setelah header.

2. `Top Province`
   - Hitung frekuensi setiap provinsi.
   - Ambil provinsi dengan frekuensi tertinggi.

3. `Active Hijab Users Percentage`
   - Hanya dihitung jika kolom usage frequency tersedia.
   - Rumus default: persentase responden yang menjawab setara dengan `setiap hari`, `sering`, atau `kadang-kadang`, sesuai kamus mapping final.

4. `Buying Frequency`
   - Breakdown semua jawaban pada kolom frekuensi pembelian.
   - Tampilkan urutan dari terbesar ke terkecil.

5. `Purchase Channel`
   - Breakdown semua channel pembelian.
   - Gunakan visual icon yang sesuai untuk tiap channel utama.

6. `Main Problem`
   - Parse jawaban multi-select.
   - Hitung frekuensi tiap masalah seperti `bau`, `gerah/panas`, `lepek`, `kusut`, `susah dibentuk`, dan `tidak ada masalah`.

7. `Market Interest Score`
   - Rumus: `(jumlah jawaban "Sangat tertarik" + jumlah jawaban "Tertarik") / total responden valid x 100`

8. `Preferred Scent`
   - Breakdown semua jawaban aroma.
   - Ambil aroma dengan frekuensi tertinggi sebagai `top scent`.

9. `Price Acceptance`
   - Breakdown semua jawaban pada kolom harga yang masih cocok.
   - Identifikasi rentang harga dominan.

10. `Purchase Intention Score`
    - Rumus: `(jumlah jawaban "Sangat mungkin" + jumlah jawaban "Mungkin") / total responden valid x 100`

## 16. Business Scoring Logic

### 16.1 Market Interest Score

- Definisi: Persentase responden yang menjawab `Sangat tertarik` atau `Tertarik`.
- Formula:
  - `marketInterestScore = ((sangatTertarik + tertarik) / totalValidInterestResponses) * 100`

### 16.2 Purchase Intention Score

- Definisi: Persentase responden yang menjawab `Sangat mungkin` atau `Mungkin`.
- Formula:
  - `purchaseIntentionScore = ((sangatMungkin + mungkin) / totalValidPurchaseResponses) * 100`

### 16.3 Problem Relevance Score

- Definisi: Mengukur seberapa relevan masalah pengguna terhadap proposisi scented hijab Enola.
- Komponen:
  - `problemAnyShare = persentase responden yang memilih masalah selain "Tidak ada masalah"`
  - `coreProblemShare = persentase responden yang memilih setidaknya satu dari "bau", "gerah/panas", atau "lepek"`
- Formula:
  - `problemRelevanceScore = (problemAnyShare * 0.4) + (coreProblemShare * 0.6)`
- Interpretasi:
  - Jika `coreProblemShare` tinggi, scented hijab punya relevansi kebutuhan yang lebih kuat.

### 16.4 Price Fit Score

- Definisi: Mengukur kecocokan pasar terhadap target harga MVP Enola `Rp100.000 - Rp200.000`.
- Formula:
  - `priceFitScore = (jumlah responden yang memilih Rp100.000 - Rp200.000 / total valid price responses) * 100`
- Narrative rules:
  - Jika rentang `Rp100.000 - Rp200.000` adalah pilihan dominan, pricing MVP dianggap sesuai.
  - Jika pilihan dominan berada di bawah `Rp100.000`, harga target dinilai terlalu tinggi.
  - Jika pilihan dominan berada di atas `Rp200.000`, ada peluang premium positioning, tetapi MVP tetap harus diuji hati-hati.

### 16.5 Final Business Validation Score

- Formula:
  - `finalValidationScore = average(marketInterestScore, purchaseIntentionScore, problemRelevanceScore, priceFitScore)`

### 16.6 Validation Status

- `80 - 100`: Strong validation
- `60 - 79`: Promising, test further
- `40 - 59`: Needs refinement
- `< 40`: Weak validation

## 17. Business Insight Logic

Dashboard harus menghasilkan insight otomatis dengan template yang mengambil data aktual. Contoh format:

1. `Total responden survei saat ini adalah {totalRespondents} orang.`
2. `Provinsi dengan responden terbanyak adalah {topProvince}.`
3. `Masalah utama yang paling sering muncul adalah {topProblem}.`
4. `Market Interest Score Enola mencapai {marketInterestScore}%.`
5. `Aroma yang paling disukai responden adalah {topScent}.`
6. `Rentang harga yang paling diterima adalah {topPriceRange}.`
7. `Purchase Potential Score mencapai {purchaseIntentionScore}%.`
8. `Berdasarkan final score {finalValidationScore}, ide produk Enola masuk kategori {validationStatus}.`

### Final Recommendation Rules

1. Jika final score >= 80:
   - Rekomendasi: lanjutkan ke market testing terkontrol.
2. Jika final score 60 - 79:
   - Rekomendasi: market testing layak dilakukan dengan penyesuaian aroma, pricing, atau messaging.
3. Jika final score 40 - 59:
   - Rekomendasi: ide menarik tetapi perlu refinement pada positioning atau offer sebelum testing.
4. Jika final score < 40:
   - Rekomendasi: lakukan riset tambahan sebelum investasi market test.

## 18. Dashboard Sections

### 18.1 Hero / Header Section

Komponen:

- Brand name `Enola`
- Tagline `Scented Hijab Market Validation Dashboard`
- Short description
- CTA button `Start Dashboard Tour`
- CTA button `View Final Insight`
- Decorative soft gradient / blob / pattern
- Relevan icon: `Sparkles`, `Flower`, `BarChart3`, `Users`, `MapPin`

Required identifiers:

- `data-tour="hero-start-tour"`
- `data-tour="hero-final-insight"`

### 18.2 Market Overview Section

Komponen:

- `Total Respondents Card`
- `Top Province Card`
- `Active Hijab Users Card`
- `Buying Frequency Chart`
- `Purchase Channel Chart`

Insight dalam tour:

- Menjelaskan ukuran sampel.
- Menjelaskan provinsi dominan dan arti geografis awalnya.
- Menjelaskan apakah data penggunaan aktif tersedia atau belum.
- Menjelaskan pola frekuensi pembelian yang paling dominan.
- Menjelaskan channel pembelian paling dominan dan implikasinya untuk distribusi awal.

Chart recommendation:

- KPI cards dengan count-up animation
- Rounded vertical bar chart untuk buying frequency
- Icon-assisted horizontal bar chart atau segmented bar untuk purchase channel

Required identifiers:

- `data-tour="total-respondents-card"`
- `data-tour="top-province-card"`
- `data-tour="active-hijab-users-card"`
- `data-tour="buying-frequency-chart"`
- `data-tour="purchase-channel-chart"`

### 18.3 Customer Problem Section

Komponen:

- `Main Problem Highlight Card`
- `Horizontal Bar Chart` masalah utama
- `Problem Relevance Score Card`

Insight dalam tour:

- Menjelaskan masalah utama yang paling banyak dipilih.
- Menjelaskan masalah peringkat kedua bila relevan.
- Menjelaskan seberapa kuat masalah tersebut berhubungan dengan proposisi scented hijab.

Chart recommendation:

- Horizontal bar chart dengan gradient fill dan stagger animation
- Problem highlight card dengan supporting narrative

Required identifiers:

- `data-tour="main-problem-card"`
- `data-tour="problem-chart"`
- `data-tour="problem-score-card"`

### 18.4 Product Interest Section

Komponen:

- `Market Interest Score Card`
- `Donut Chart` tingkat ketertarikan
- `Interest Breakdown Card`

Insight dalam tour:

- Menjelaskan gabungan `Sangat tertarik` dan `Tertarik` sebagai market interest.
- Menjelaskan apakah minat didorong kuat oleh `Sangat tertarik` atau lebih banyak berada di level `Tertarik`.

Chart recommendation:

- Animated donut chart dengan center score
- Small breakdown list dengan motion entry

Required identifiers:

- `data-tour="market-interest-card"`
- `data-tour="interest-chart"`
- `data-tour="interest-breakdown-card"`

### 18.5 Preferred Scent Section

Komponen:

- `Top Scent Card`
- `Bar Chart` aroma favorit
- `MVP Scent Recommendation Card`

Insight dalam tour:

- Menjelaskan aroma paling dominan.
- Menjelaskan aroma cadangan yang bisa menjadi varian kedua bila selisihnya tipis.
- Menjelaskan hubungan hasil ini dengan keputusan MVP scent strategy.

Chart recommendation:

- Animated bar chart dengan rounded caps
- Top scent card dengan icon `Flower`, `Leaf`, atau `Sparkles`

Required identifiers:

- `data-tour="top-scent-card"`
- `data-tour="preferred-scent-chart"`
- `data-tour="mvp-scent-card"`

### 18.6 Price Acceptance Section

Komponen:

- `Best Price Range Card`
- `Bar Chart` rentang harga
- `Price Fit Score Card`

Insight dalam tour:

- Menjelaskan rentang harga dominan.
- Menjelaskan kecocokan atau ketidakcocokan terhadap target harga Enola `Rp100.000 - Rp200.000`.
- Menjelaskan risiko jika preferensi pasar bergerak di bawah atau di atas target.

Chart recommendation:

- Vertical bar chart dengan highlight khusus pada bar `Rp100.000 - Rp200.000`
- Optional progress meter untuk price fit

Required identifiers:

- `data-tour="best-price-card"`
- `data-tour="price-chart"`
- `data-tour="price-fit-card"`

### 18.7 Purchase Intention Section

Komponen:

- `Purchase Potential Score Card`
- `Donut Chart` kemungkinan membeli
- `Conversion Opportunity Card`

Insight dalam tour:

- Menjelaskan gabungan `Sangat mungkin` dan `Mungkin` sebagai purchase potential.
- Menjelaskan apakah intent cukup kuat untuk mendorong testing atau baru sebatas curiosity.

Chart recommendation:

- Donut chart animatif dengan center percentage
- Opportunity card yang menuliskan sinyal readiness to try

Required identifiers:

- `data-tour="purchase-potential-card"`
- `data-tour="purchase-intention-chart"`
- `data-tour="conversion-opportunity-card"`

### 18.8 Final Business Validation Section

Komponen:

- `Final Business Validation Score`
- `Market Interest Score`
- `Purchase Intention Score`
- `Problem Relevance Score`
- `Price Fit Score`
- `Final Recommendation Card`
- `Suggested Market Testing Strategy`

Chart recommendation:

- Score ring atau large radial summary
- Weighted score cards dengan animated progress

Required identifiers:

- `data-tour="final-validation-score"`
- `data-tour="final-recommendation-card"`
- `data-tour="testing-strategy-card"`

### 18.9 Purchase Channel Visual Assets Section

Tujuan:

- Memperjelas di mana user biasanya membeli kerudung melalui chart yang kaya visual.
- Menggunakan icon channel untuk mempercepat pembacaan hasil survei.

Komponen:

- `Purchase Channel Insight Card`
- `Channel Icon Legend`
- `Animated Purchase Channel Chart`

Contoh icon mapping:

- Offline store: `Store`
- Marketplace: `ShoppingBag`
- Instagram shop: `Instagram`
- TikTok channel: `Video`
- WhatsApp / reseller: `MessageCircle`
- Friend referral: `Users`

Catatan scope:

- Section ini menggantikan interpretasi lama tentang social media assets berupa copywriting campaign.
- Fokus MVP adalah visual asset/icon untuk chart channel pembelian.

Required identifiers:

- `data-tour="purchase-channel-insight"`
- `data-tour="channel-icon-legend"`

## 19. Chart Recommendations

1. Gunakan `Recharts` sebagai library utama.
2. Semua chart harus memiliki animation aktif saat initial render.
3. Gunakan warna chart yang konsisten dengan palette Enola.
4. Hindari chart yang terlalu kompleks atau padat.
5. Utamakan visual yang cepat dibaca saat presentasi.
6. Hindari tampilan default Recharts seperti tooltip polos, stroke generik, atau gridline standar tanpa styling.
7. Setiap chart harus dibungkus dalam card presentasi premium dengan hierarchy jelas, supporting label, dan optional micro-copy insight.
8. Gunakan custom tooltip, custom legend, rounded shapes, gradient, opacity layering, dan branded empty state agar visual terasa bespoke.

Recommended chart types:

1. Metric cards dengan count-up
2. Donut chart untuk interest dan purchase intention
3. Horizontal bar chart untuk customer problems
4. Vertical bar chart untuk buying frequency, scent preference, dan price acceptance
5. Progress bar atau radial summary untuk final scores

### Chart Styling Rules

1. Bar chart harus memakai rounded corner besar, gradient fill, dan highlight warna untuk kategori teratas.
2. Donut chart harus memiliki center label besar, subtle outer glow, dan transition yang halus saat mount.
3. Tooltip harus custom dengan background cream/rose yang selaras brand, bukan tooltip default hitam polos.
4. Legend harus tampil sebagai UI brand component dengan icon atau dot style yang dirapikan.
5. Gridline harus tipis, lembut, dan tidak mendominasi.
6. Label angka dan persentase harus menggunakan hierarchy tipografi yang rapi dan tidak tampak seperti default SVG text mentah.
7. Jika ada chart dengan banyak kategori, gunakan layout yang menjaga keterbacaan tanpa terlihat padat.

### Answer Visualization Rules

1. Setiap pertanyaan utama yang dibawa ke dashboard harus punya visualisasi jawaban, baik dalam chart utama, breakdown list, atau insight meter.
2. Visualisasi tidak boleh berhenti di satu angka KPI jika distribusi jawaban masih penting untuk dipahami.
3. Untuk pertanyaan multi-select, dashboard harus menampilkan persebaran tiap opsi jawaban secara jelas.
4. Untuk pertanyaan single-select, dashboard harus menampilkan distribusi kategori dan menyorot jawaban teratas.

## 20. Guided Tour Requirements

1. Gunakan `shadcn-tour`.
2. Tour harus dapat dimulai dari hero CTA.
3. Tour harus menargetkan elemen dengan selector stabil melalui `data-tour`.
4. Tour harus tersedia untuk setiap section utama.
5. Tour content harus dinamis mengikuti hasil analytics.
6. Tour UI harus modern, ringkas, dan tidak merusak visual dashboard.
7. Tour harus memiliki tombol `next`, `previous`, `finish`, dan `skip`.
8. Tour harus dapat dimulai ulang kapan saja.
9. Tour harus meng-cover insight dari setiap pertanyaan survei utama yang divisualisasikan di dashboard.
10. Setiap step tour harus mengandung dua lapis informasi: apa yang dilihat user dan apa makna bisnisnya untuk Enola.
11. Bila ada metric yang tidak bisa dihitung karena kolom tidak tersedia, tour harus menjelaskannya secara jujur, bukan melewatkannya diam-diam.

### Dynamic Tour Content Examples

1. `Total responden saat ini adalah {totalRespondents}. Jumlah ini menjadi dasar awal untuk membaca hasil validasi market.`
2. `Provinsi dengan responden terbanyak adalah {topProvince}, sehingga insight awal paling kuat berasal dari wilayah ini.`
3. `Market Interest Score Enola adalah {marketInterestScore}%, dihitung dari responden yang menjawab Sangat tertarik dan Tertarik.`
4. `Aroma paling disukai adalah {topScent}, sehingga aroma ini dapat menjadi prioritas untuk varian MVP.`
5. `Rentang harga paling diterima adalah {topPriceRange}, sehingga harga ini bisa menjadi acuan strategi pricing awal.`
6. `Masalah yang paling dominan adalah {topProblem}, diikuti oleh {secondaryProblem}. Ini menunjukkan bahwa proposisi Enola paling relevan jika difokuskan pada rasa segar dan nyaman saat dipakai lebih lama.`
7. `Channel pembelian paling dominan adalah {topPurchaseChannel}. Insight ini memberi sinyal awal tentang channel distribusi atau channel campaign yang paling dekat dengan perilaku belanja target market.`
8. `Distribusi jawaban pada chart ini menunjukkan bahwa {leadingAnswer} adalah pilihan terbanyak, sementara {runnerUpAnswer} berada di posisi berikutnya. Artinya, Enola perlu memprioritaskan {businessImplication}.`

## 21. Animation Requirements

1. Gunakan `Motion` atau `Framer Motion` pada semua section utama.
2. Semua section harus memiliki entrance animation berbasis fade, translate, atau scale yang halus.
3. Semua card harus memiliki hover animation ringan.
4. Chart container harus memiliki reveal animation ketika muncul.
5. Donut chart dan bar chart harus memanfaatkan animation bawaan Recharts.
6. Progress bar dan radial score harus memiliki transisi nilai yang smooth.
7. Tombol CTA dan trigger tour harus memiliki micro-interaction.
8. Animasi tidak boleh terasa berlebihan atau menghambat pembacaan data.
9. Chart animation harus terasa seperti bagian dari storytelling presentasi, bukan sekadar efek dekoratif.
10. Hover, tooltip, dan active state chart harus dikustomisasi agar interaksi terasa premium dan tidak default.

## 22. Icon Requirements

Gunakan `Lucide React` untuk icon utama:

1. `Users` untuk total responden
2. `MapPin` untuk provinsi terbanyak
3. `ShoppingBag` untuk tempat pembelian
4. `Repeat` atau `Calendar` untuk frekuensi pembelian
5. `AlertCircle`, `Flame`, atau `Droplets` untuk masalah pengguna
6. `Heart` atau `Sparkles` untuk product interest
7. `Flower`, `SprayCan`, atau `Leaf` untuk aroma
8. `BadgeDollarSign`, `Wallet`, atau `Tag` untuk harga
9. `TrendingUp` atau `MousePointerClick` untuk purchase intention
10. `BarChart3` atau `PieChart` untuk analytics
11. `CheckCircle` atau `Target` untuk final validation score

## 23. Success Metrics

### Business Success Metrics

1. Founder dapat menyimpulkan status validasi bisnis dalam < 5 menit.
2. Dashboard dapat dipakai sebagai materi pitching internal tanpa perlu membuka Google Forms.
3. Dashboard membantu menghasilkan keputusan `lanjut test`, `test dengan refinement`, atau `revisit concept`.

### Product Success Metrics

1. 100% metric utama termuat otomatis dari CSV saat schema valid.
2. 100% chart dan card penting memiliki langkah tour.
3. 0 kebutuhan backend untuk MVP.
4. Error handling dapat membedakan file missing vs schema invalid.

## 24. MVP Scope

MVP mencakup:

1. Satu halaman dashboard di `app/page.tsx`
2. Fetch CSV dari public folder
3. Schema mapping berbasis keyword
4. Analytics untuk metric utama dan score utama
5. Section hero, market overview, customer problem, product interest, preferred scent, price acceptance, purchase intention, final validation, dan purchase channel visual assets
6. Guided tour dinamis
7. Motion animation
8. Empty, loading, dan error state

## 25. Future Improvements

### v1.1

1. Export dashboard ke PDF atau image untuk pitching.
2. Configurable target price range tanpa ubah code.
3. Filter per provinsi atau kelompok jawaban tertentu.
4. Compare current survey vs future survey wave.

### v2.0

1. Support beberapa file CSV sekaligus.
2. Time-series comparison antar batch survei.
3. Scenario simulator untuk pricing dan interest threshold.
4. Optional private data mode jika kelak butuh data non-public.

## 26. Risks and Dependencies

### Key Risks

1. Header CSV dapat berubah dan membuat schema detection gagal.
2. CSV public berisiko membuka data mentah jika belum dibersihkan dari PII.
3. Tidak adanya kolom `active hijab users` pada sample saat ini menyebabkan satu metric tidak dapat dihitung secara valid.
4. Jawaban multi-select yang tidak konsisten dapat memerlukan normalisasi tambahan.
5. Animasi berlebihan dapat menurunkan kesan profesional jika tidak dikontrol.

### Mitigation

1. Gunakan keyword mapping dan fallback message yang jelas.
2. Bersihkan file source sebelum dipindahkan ke `public/data`.
3. Tampilkan `Data belum tersedia` untuk metric yang memang tidak ada di CSV.
4. Bangun util normalisasi untuk sinonim jawaban utama.
5. Gunakan motion dengan durasi dan easing yang konservatif.

## 27. Phased Rollout

### MVP

- Static single-dashboard
- CSV from public folder
- Dynamic scoring and guided tour

### v1.1

- Better filtering
- Export-ready presentation mode
- Configurable pricing assumptions

### v2.0

- Multi-wave validation comparison
- Optional richer analytics layer
- Optional private data management

## 28. Implementation Notes for Engineering

1. Semua komponen penting wajib diberi `data-tour` identifier.
2. Semua chart harus animatif dan tetap performant.
3. `Price Fit Score` harus menggunakan target harga Enola `Rp100.000 - Rp200.000`.
4. `Purchase Channel Visual Assets` harus dianggap sebagai implementasi resmi dari klarifikasi `social media assets`.
5. Jika field tertentu hilang, system tidak boleh crash; tampilkan informative fallback.

## 29. Final Recommendation

Dashboard Enola harus dibangun sebagai website presentasi validasi bisnis yang memadukan data CSV, analytic scoring, narrative insight, guided tour, dan chart animatif dalam tampilan premium yang lebih kuat daripada Google Forms. Fokus MVP adalah mengubah data survei menjadi alat keputusan bisnis yang cepat, elegan, dan siap dipakai founder untuk menentukan apakah scented hijab Enola layak diuji ke pasar.
