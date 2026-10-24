# Humanizer: Indonesian pattern catalog

Read this in full, in addition to `patterns-en.md`, when the text is Indonesian or mixed Indonesian-English. The English catalog still applies (section numbers below point to it); this file adds the Indonesian forms of the same tells, Indonesian-only tells, and a term policy.

Register: developer code-mixed Indonesian. Keep the English technical term where the KBBI coinage is uncommon or shifts the meaning.

## A. Slop patterns

Each pattern names the English section it shares. The English problem statements and "when not to act" rules carry over.

### Shared with the English catalog

**ID-1 (§1) Bukan X, melainkan Y.** Watch for: "Tidak hanya X, tetapi juga Y", "Bukan sekadar X, melainkan Y", "Bukan hanya X, namun Y", "Ini bukan tentang X, ini tentang Y", and the split form "Ini bukan berarti X. Ini berarti Y."
> Sebelum: Fitur ini bukan sekadar cache, melainkan lapisan yang menyimpan hasil query selama 60 detik.
> Sesudah: Fitur ini menyimpan hasil query selama 60 detik.

**ID-2 (§2) Penutup satu kalimat.** Watch for: "Itulah kuncinya.", "Itulah yang membuatnya istimewa.", "Dan itu penting.", "Hasilnya? Luar biasa.", a row of fragments ("Tanpa ribet. Tanpa drama.").
> Sebelum: Retry menutupi gangguan singkat. Itulah kuncinya.
> Sesudah: Retry menutupi gangguan singkat.

**ID-3 (§3) Ungkapan yang terdengar dalam.** Watch for: "Pada intinya", "Pada hakikatnya", "Hakikatnya", "Sejatinya", "Esensinya", "Yang terpenting", "Inti dari permasalahannya".
> Sebelum: Pada intinya, rilis tertunda karena tim belum siap.
> Sesudah: Rilis tertunda karena tim belum siap.

**ID-4 (§4) Pengantar sebelum poin.** Watch for: "Mari kita selami", "Mari kita bahas", "Mari kita bedah", "Mari kita eksplorasi", "Berikut yang perlu Anda ketahui", "Tanpa basa-basi lagi", "Yuk, kita mulai".
> Sebelum: Mari kita selami cara kerja caching di Next.js. Berikut yang perlu Anda ketahui: Next.js men-cache data di tiga lapisan.
> Sesudah: Next.js men-cache data di tiga lapisan.

**ID-5 (§5) Membantah yang tidak ada.** Watch for: "Perlu dicatat bahwa", "Perlu diingat bahwa", "Jangan salah paham", "Bukan berarti ... tidak penting", "Mungkin Anda berpikir ... tetapi".
> Sebelum: Perlu diingat bahwa build gagal karena versi Node yang salah. Jangan salah paham, ini bukan soal ukuran bundle.
> Sesudah: Build gagal karena versi Node yang salah, bukan karena ukuran bundle.

**ID-6 (§12, §13) Kata AI dan inflasi makna.** Watch for: krusial, esensial, signifikan (figuratif), lanskap (kiasan), memainkan peran penting/kunci/vital, di era digital ini, di tengah pesatnya perkembangan, tonggak sejarah, menjadi bukti nyata, berperan sebagai katalis, ekosistem (kiasan), holistik, komprehensif, mumpuni, seamless (kalau dipakai sebagai kata hias), "masa depan yang cerah", "semakin relevan". Keep the fact, drop the significance.
> Sebelum: Di era digital ini, log memainkan peran krusial dalam lanskap rekayasa perangkat lunak: tim memakai log untuk melacak service yang lambat.
> Sesudah: Tim memakai log untuk melacak service yang lambat.

**ID-7 (§15) Penunjang "-nya".** Watch for: ", menjadikannya ...", ", sehingga memastikan ...", ", yang mencerminkan ...", ", menyoroti pentingnya ...", ", yang pada akhirnya berkontribusi pada ...". Keep the rider only if the source supports it.
> Sebelum: Modul ini dipisah per domain, menjadikannya mudah dirawat dan mencerminkan komitmen pada kualitas.
> Sesudah: Modul ini dipisah per domain, jadi lebih mudah dirawat.

**ID-8 (§16, §18) Bahasa promosi dan kata kerja berputar.** Watch for: "menawarkan", "menghadirkan", "hadir dengan", "berfungsi sebagai", "merupakan", "mampu", "solusi inovatif", "pengalaman yang tak tertandingi", "luar biasa". Use *adalah*, *punya*, *ada*.
> Sebelum: Dashboard ini hadir sebagai solusi inovatif yang menawarkan pengalaman luar biasa dan menampilkan error rate per endpoint.
> Sesudah: Dashboard ini menampilkan error rate per endpoint.

**ID-9 (§22) Sisa chatbot.** Watch for: "Tentu saja!", "Tentu!", "Pertanyaan yang bagus!", "Anda benar sekali", "Semoga membantu!", "Semoga bermanfaat!", "Jangan ragu untuk bertanya", "Silakan beri tahu saya jika ...", "Apakah Anda ingin saya ...?", "Berikut adalah ...". Remove the wrapper, keep the content.
> Sebelum: Tentu saja! Berikut penjelasannya. Index dipakai untuk mempercepat pencarian. Semoga membantu! Jangan ragu untuk bertanya lagi.
> Sesudah: Index mempercepat pencarian.

**ID-10 (§23) Batas pengetahuan dan tebakan.** Watch for: "Berdasarkan informasi yang tersedia", "Sejauh pengetahuan saya", "Per tanggal ...", "diyakini bahwa", "kemungkinan besar". State what the source does not show, or cut.
> Sebelum: Sejauh pengetahuan saya, library ini dirilis pada 2019.
> Sesudah: Library ini dirilis pada 2019. (If the source does not confirm the year, say that instead of guessing.)

### Indonesian-only tells

**ID-11 Konektor formal bertumpuk.** Watch for: "Selain itu, ... Lebih lanjut, ... Oleh karena itu, ... Dengan demikian, ... Di sisi lain, ..." opening most sentences; also "Dalam hal ini", "Sebagai tambahan", "Perlu digarisbawahi". Real writing leaves most links implicit. Keep a connector only when the relation is not obvious.
> Sebelum: Selain itu, build jadi lebih cepat. Lebih lanjut, ukuran bundle menyusut. Oleh karena itu, tim memilih migrasi.
> Sesudah: Build jadi lebih cepat dan bundle lebih kecil, jadi tim memilih migrasi.

**ID-12 "Adapun".** Watch for: "Adapun X, ..." as a topic marker in text that is not formal writing.
> Sebelum: Adapun fitur ekspor, fitur ini mendukung CSV.
> Sesudah: Ekspor mendukung CSV.

**ID-13 Pembuka dan penutup serba "dalam rangka".** Watch for: "dalam rangka meningkatkan", "guna memastikan", "demi mewujudkan", "sebagai upaya untuk" before a plain action. Say what is done: "supaya", "untuk", or drop it.
> Sebelum: Dilakukan refactor dalam rangka meningkatkan keterbacaan kode.
> Sesudah: Kode di-refactor supaya lebih mudah dibaca.

**ID-14 Imbuhan berlapis dan kata benda abstrak.** Watch for: "melakukan pengecekan", "melakukan penambahan", "dilakukan perbaikan", "terjadinya peningkatan" where one verb does the job. Use the verb: "cek", "tambah", "perbaiki".
> Sebelum: Tim melakukan pengecekan terhadap konfigurasi dan melakukan perbaikan.
> Sesudah: Tim mengecek konfigurasi dan memperbaikinya.

**ID-15 Anda yang terlalu formal.** Watch for: "Anda" repeated through casual developer text (README, PR description, chat) where writers use *kamu*, *kita*, or no pronoun. *Anda* is correct in formal docs, so act only when other tells are present and the surrounding register is casual.
> Sebelum: Anda dapat menjalankan perintah ini jika Anda ingin Anda melihat log.
> Sesudah: Jalankan perintah ini untuk melihat log.

**ID-16 Daftar bernomor "Pertama, Kedua, Ketiga" dan "Kesimpulan".** Watch for: "Pertama, ... Kedua, ... Ketiga, ..." for three points that need no order, and a closing "Kesimpulannya", "Singkatnya", "Secara keseluruhan" paragraph that repeats the text. Same tell as §6 and §2.
> Sebelum: Pertama, build lebih cepat. Kedua, bundle lebih kecil. Ketiga, deploy lebih mudah. Kesimpulannya, migrasi ini bermanfaat.
> Sesudah: Migrasi ini bermanfaat: build lebih cepat, bundle lebih kecil, dan deploy lebih mudah.

**ID-17 Hiasan "yang".** Watch for: "hal yang perlu diperhatikan adalah bahwa", "merupakan sebuah ... yang", "sebuah ... yang sangat". Cut the scaffolding, keep the claim.
> Sebelum: Hal yang perlu diperhatikan adalah bahwa token merupakan sebuah kredensial yang kedaluwarsa setelah 24 jam.
> Sesudah: Token adalah kredensial yang kedaluwarsa setelah 24 jam.

## B. Term policy

### Keep the English term (uncommon or shifts the meaning)

| KBBI coinage | Keep | Reason |
|---|---|---|
| galat | error | galat reads as a statistics term; developers say error |
| peladen | server | nobody says peladen in practice |
| tetikus | mouse | tetikus is not what people say for the device |
| sangkil | efficient | archaic, no developer uses it |
| mangkus | effective | archaic; also confused with sangkil |
| awakutu | debug | coinage reads as a joke; debug is a verb in daily use |
| pranala | link | uncommon; tautan is the common Indonesian word if one is wanted |
| kuki | cookie | transliteration of the English word, so keep the English spelling |
| surel | email | surel is rare outside government writing |
| pelantar | platform | uncommon; platform is already an Indonesian word form |
| swafoto | selfie | selfie is the word people use |
| purwarupa | prototype | rare; prototype is standard |
| unggah-ulang | re-upload | mechanical compound; see below |
| laman | page | halaman or page is what people write; laman is rare in dev chat |
| daring / luring | online / offline | news and government wording, rare in dev chat |
| gawai | device | education and government wording |
| peramban | browser | appears in UI strings, developers say browser |
| pustaka | library | docs-only wording; library is standard in dev chat |
| kerangka kerja | framework | correct but long; framework is standard |
| pengawakutu | debugger | follows awakutu |
| utas | thread | utas is rare; thread is standard |
| templat | template | template reads natural |
| peretas | hacker | news wording; hacker in dev text |
| narahubung | contact person | rare outside formal letters |

### Keep Indonesian (common and natural)

unduh · unggah · kata sandi · pengguna · basis data · perangkat lunak · berkas · tautan · pindai · cadangan · akun · aplikasi · jaringan · layar · tangkapan layar · peringatan · pembaruan · pemrograman · antarmuka · pengembang · kode sumber · mesin pencari · tenggat

### Unggah versus unggah-ulang

*Unggah* (upload) is established: people say it and read it without a second look, so it stays Indonesian. *Unggah-ulang* is a mechanical compound built from it. Nobody says it, and "upload ulang" or *re-upload* is what appears in real text. The rule: keep the base coinage when the community uses it, but do not extend it by compounding. Prefer the English term for compounds ("re-upload", "re-run", "re-deploy").

### Mixed-language forms

Attach Indonesian affixes to an English verb with a hyphen and keep the English spelling: *di-deploy*, *men-cache*, *meng-commit*, *di-merge*. Do not respell to match Indonesian phonology ("di-depoi").

## C. Italics rule

Italicize a foreign term (a term kept in English inside Indonesian prose) in rendered Markdown prose only (docs, PR bodies), never in plain-text commit messages, code, identifiers, paths or URLs.

- Italicize every foreign term at its first use in a rendered Markdown doc; later uses of the same term stay plain.
- No borderline class: everyday dev words (*server*, *error*, *deploy*) are italicized at first use too.
- Plain-text targets such as a commit message, a terminal output line, or a code comment take no markup at all: write `error`, not `*error*`.
- Inside inline code, code blocks, identifiers, file paths and URLs, leave every character unchanged.
