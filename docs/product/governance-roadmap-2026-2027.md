---
owner: Maintainer
last_updated: 2026-09-10
update_trigger: The EPIC-016 pilot's scope, target dates, or phase gating changes
status: current
---

# Lean Flow — Revisi Roadmap MVP Dashboard Agentic Governance

Tanggal: **9 September 2026** · Revisi berdasarkan target Aldi: **AI bisa dimanfaatkan, dipantau, dan dikendalikan melalui dashboard secepat mungkin**.

Dokumen ini menggantikan prioritas roadmap sebelumnya untuk delivery awal. Target sekarang adalah satu pilot operasional dengan dashboard. Penutupan seluruh epic platform menjadi jalur pengembangan berikutnya.

## 1. Target waktu yang baru

**Target utama: 20 hari kerja atau sekitar empat minggu untuk pilot yang sudah diuji. Alur dashboard yang dapat dipakai ditargetkan pada hari kerja ke-10–15.**

Jika mulai **Kamis, 10 September 2026**, jadwalnya:

| Milestone | Target | Kemampuan yang tersedia |
|---|---|---|
| Satu run nyata dari dashboard | **16 Sep — hari ke-5** | Login, pilih repo/workflow, start, lihat aktivitas, stop, lihat hasil |
| Alur kendali utama | **23 Sep — hari ke-10** | Approval/deny dari Inbox, scope terikat revision, verification dan hasil dapat ditelusuri |
| MVP operasional | **30 Sep — hari ke-15** | Queue, prioritas, dua slot worker, budget/durasi, retry terbatas, jadwal sederhana |
| Pilot selesai diuji | **7 Okt — hari ke-20** | Dua repo, run nyata, uji kegagalan dan pemulihan, runbook, review penerimaan |

Asumsi: satu builder berpengalaman bekerja penuh waktu dengan AI coding; owner tersedia sekitar 30–60 menit per hari untuk keputusan dan review; tersedia reviewer lain sekitar 2–4 jam pada minggu kedua dan keempat. Builder dapat merupakan Aldi sendiri. Environment Linux, akses repo, serta akses runtime yang sah siap pada hari pertama. Hari kerja dihitung Senin–Jumat; kalender cuti/libur tim belum dimasukkan.

Budget awal: **15 hari implementasi/integrasi dan 5 hari pilot, perbaikan, serta review**. Ini target agresif berbasis scope sempit, bukan hasil velocity yang sudah diukur. Validasi kemampuan runtime pada dua hari pertama menentukan apakah forecast tetap 20 hari. Bila integrasi kendali atau environment memerlukan pekerjaan tambahan, rentang cadangan **25–30 hari kerja, sampai 14–21 Oktober 2026**. Kemampuan start/stop/approval yang nyata tetap menjadi syarat rilis.

## 2. Mengapa jadwalnya dapat dipercepat

Roadmap sebelumnya menjadikan penyelesaian migrasi engine, Fleet formal, protocol lintas runtime, dan pembuktian platform luas sebagai prasyarat dashboard. Untuk tujuan baru, kita dapat membangun **satu alur utuh di atas runtime yang sudah digunakan Lean Flow** dan menguji manfaatnya lebih awal.

| Keputusan percepatan | Scope pilot |
|---|---|
| Runtime | **Satu runtime dahulu: Claude Code**, karena launcher repo sudah menggunakannya; versi runtime dan plugin dipin setelah smoke test |
| Pengguna | Satu organisasi/workspace, owner dan operator pilot sederhana |
| Repo | Satu repo pada minggu pertama; dua repo pada penerimaan pilot |
| Workflow | Satu workflow software: analisis → persetujuan scope → implementasi → verification → review hasil |
| Worker | Maksimal dua run independen bersamaan setelah isolasi dan kapasitas terbukti |
| Interface | Satu dashboard dengan lima area utama; komponen UI siap pakai |
| Infrastruktur | Satu deployment Linux, satu service kendali dengan supervisor worker, satu durable store |
| Engine | Gunakan checker yang tersedia sesuai coverage; TS cutover penuh tidak berada pada jalur kritis pilot |
| Kontrak | Schema internal kecil, berversi dan memiliki pemilik; generalisasi protocol diturunkan dari evidence pilot berikutnya |

Akses Codex/Kimi/Hermes/OpenClaw, workflow lintas domain, organisasi multi-tenant, memory platform, dan abstraksi multi-runtime dijadwalkan setelah pilot. Kontrak adapter menjaga ruang perluasan tanpa mengimplementasikan semuanya sekarang.

## 3. Dashboard yang akan dipakai

| Area | Yang dilihat | Yang bisa dilakukan |
|---|---|---|
| **Command Center** | Task aktif/antre/terblokir, keputusan yang menunggu, worker online, hasil terbaru, estimasi biaya | Buka masalah prioritas, hentikan dispatch baru, stop semua run yang dikelola |
| **Work & Queue** | Tujuan, repo, scope, acceptance, status, prioritas, dependensi sederhana | Buat task, pilih workflow, atur prioritas, start, batalkan antrean |
| **Run Detail** | Tahap kerja, aktivitas operasional, tool yang tercatat, durasi, penggunaan yang tersedia, diff, hasil verification, alasan berhenti | Stop, minta revisi, buat attempt baru, terima/tolak hasil |
| **Approval Inbox** | Keputusan yang dibutuhkan, input/revision, capability yang diminta, alasan eskalasi | Approve/deny dengan identitas dan waktu yang tercatat; ubah scope sebagai revision baru |
| **Workers & Policy** | Slot aktif, heartbeat, health, konfigurasi workflow, batas resource/run | Atur concurrency, tool/repo scope, durasi, batas attempt dan budget; aktif/nonaktifkan jadwal |

**“Kontrol penuh” pada pilot berarti kendali operasional atas semua run yang didaftarkan dan dijalankan lewat service ini.** Sesi CLI di luar service belum otomatis dapat dipantau atau dihentikan dari dashboard. Run yang dikelola memiliki owner, izin, batas, status, dan bukti hasil yang terlihat.

Semantik tombol harus jelas:

- **Stop** meminta penghentian nyata; UI menampilkan STOPPING sampai supervisor mengonfirmasi worker berhenti. Efek yang sudah terjadi dan request provider yang telanjur dikirim tetap perlu direkonsiliasi.
- **Pause queue** menahan dispatch berikutnya. Untuk task aktif, tunggu checkpoint fase atau gunakan Stop.
- **Approve and continue** membuka fase berikutnya berdasarkan keputusan yang tercatat, dengan attempt baru bila proses sebelumnya telah berakhir.
- **Retry** membuat attempt baru yang terhubung ke attempt sebelumnya, dengan pengecekan efek agar pekerjaan eksternal tidak tergandakan.

## 4. Satu alur kerja yang lengkap

1. Aldi memasukkan tujuan, repo, acceptance, batas tool, durasi, dan budget.
2. Agent melakukan analisis dalam scope yang diberikan dan menghasilkan plan/diff proposal.
3. Keputusan yang belum tercakup izin masuk Approval Inbox. Task menunggu; ketiadaan jawaban tidak dianggap persetujuan.
4. Setelah scope disetujui, worker mengerjakan perubahan dan pemeriksaan yang sudah diotorisasi tanpa meminta konfirmasi berulang untuk scope yang sama.
5. Supervisor mengumpulkan verification, diff, artefak, biaya yang tersedia, dan terminal reason.
6. Aldi menerima hasil, meminta revisi terbatas, atau menghentikan task. Task independen berikutnya dapat mengisi slot yang kosong.

Planner, builder, dan verifier adalah tahap/capability workflow. Pilot tidak memerlukan organisasi virtual dengan banyak agent manager. Review hasil tetap memiliki konteks dan bukti yang dapat diperiksa terpisah dari klaim pembuat perubahan.

## 5. Arsitektur minimum dan batas authority

| Komponen | Peran | Batas |
|---|---|---|
| Web dashboard | Interface operator dan live updates | Tidak memegang credential worker/provider |
| Control API + supervisor | Auth, validasi approval, queue, lease/heartbeat, dispatch, cancel, rekonsiliasi | Menjadi authority untuk status operasional dan grant yang diterbitkannya |
| Durable store | Work item, run/attempt, approval, event, status, budget reservation | Hanya service yang menulis keputusan authority; worker tidak memegang akses langsung |
| Runtime adapter | Menjalankan runtime yang dipin dan menormalisasi output/event | Tidak menentukan sendiri izin atau kelulusan workflow |
| Worker terisolasi | Menjalankan fase di checkout/worktree yang ditentukan | Akses filesystem/network/tool dibatasi; credential control plane tidak tersedia |
| Lean Flow + Git | Workflow/aturan yang dipin, input revision, artefak, evidence export, checker | Git memiliki source/artifact authority; live queue tidak diduplikasi menjadi dua sumber status |

Gunakan frontend yang paling cepat dikerjakan builder, satu API TypeScript yang sesuai toolchain tim, serta satu database yang mendukung transaksi/claim antrean. Tidak ada kebutuhan awal untuk cluster, event bus terpisah, atau vector database. Pilihan library/database dikunci hari pertama dari komponen yang sudah dikuasai; benchmark kapasitas pilot menentukan perubahan berikutnya.

**Integrasi runtime yang dipilih untuk jalur awal:** CLI headless dengan event stream di bawah supervisor, memakai Lean Flow yang dipin. G1/G2 dijalankan sebagai checkpoint oleh controller. Model bekerja dengan izin yang sudah disetujui di dalam fase tersebut.

Launcher saat ini memaksa `dontAsk`. Mode ini menolak aksi yang belum diizinkan dan tidak meneruskan permintaan itu ke callback approval. Karena itu dashboard tidak cukup ditempelkan pada log launcher. Supervisor harus memiliki kontrol proses dan checkpoint yang jelas. Ketika ada kebutuhan izin baru, task park lalu dibuat fase/attempt terotorisasi berikutnya. Integrasi SDK untuk approval per tool di tengah proses dapat ditambahkan jika kebutuhan pilot membuktikannya; jangan mengubah mode permission tanpa pengujian. [Launcher repo](https://github.com/aldianriski/lean-flow/blob/da7da8c400c5cd8c9eec1b2aa48f67d1057bdb70/scripts/night-run.sh), [permission runtime](https://code.claude.com/docs/en/agent-sdk/permissions).

Claude Code mendokumentasikan mode headless dan event stream, sehingga runtime ini layak menjadi titik awal adapter. Metadata cost yang dilaporkannya merupakan estimasi sisi client dan dapat berbeda dari tagihan. Kemampuan stop, streaming, skill/plugin loading, dan pembatasan yang benar-benar aktif tetap dibuktikan pada versi yang dipakai di hari 1–2. [Programmatic usage](https://code.claude.com/docs/en/headless).

## 6. Rencana eksekusi 20 hari kerja

| Hari | Tanggal | Pekerjaan | Bukti akhir tahap |
|---|---|---|---|
| **1–2** | **10–11 Sep** | Catat admission pilot dan batas authority; pilih stack; pin runtime/plugin; uji start, stream, stop, deny tool, scope filesystem/network; tetapkan satu workflow | Satu run nyata melalui adapter, event dapat dibaca, tool di luar scope ditolak, stop dikonfirmasi; risiko integrasi yang tersisa diketahui |
| **3–5** | **14–16 Sep** | Auth owner, API/state/event minimum, supervisor, satu worker, UI create/start/run detail, diff/hasil | Dari browser: buat task → run nyata → aktivitas → stop atau hasil; restart browser tidak menghilangkan run |
| **6–8** | **17–21 Sep** | Approval Inbox, identitas approver, valid commit/input digest, capability per fase, checkpoint J2, required verification/final verdict | Approval kedaluwarsa atau untuk revision lain ditolak; J2 menunggu; pemeriksaan tidak selesai tidak meluluskan task |
| **9–10** | **22–23 Sep** | Integrasi review hasil, deny/revise, terminal status, pengujian kontrol, review independen | Workflow lengkap dapat dipakai lewat dashboard; tidak perlu membuka terminal untuk alur normal |
| **11–13** | **24–28 Sep** | Antrean durable, prioritas, heartbeat/lease, dua worker terisolasi, lock per resource, usage/budget/duration, retry terbatas | Dua task independen berjalan; task konflik menunggu; double-click/event ganda tidak membuat dispatch ganda |
| **14–15** | **29–30 Sep** | Jadwal sederhana, pause queue, stop semua, ringkasan hasil/biaya, filter perhatian, onboarding repo kedua | MVP operasional mengerjakan antrean terotorisasi dengan batas yang bisa dikendalikan |
| **16–20** | **1–7 Okt** | Pilot dua repo, uji crash/restart/disconnect/revocation/timeout, rekonsiliasi hasil, perbaikan, runbook dan review penerimaan | Hasil normal dan kegagalan terbaca; kontrol bekerja; pilot dapat dijalankan operator |

Data minimal yang cukup untuk implementasi: `WorkItem`, `Run/Attempt`, `Approval`, `RunEvent`, `Artifact/EvidenceRef`, `WorkerLease`, `PolicySnapshot`. Setiap keputusan mengikat work item, revision/input digest, policy, capability, budget, actor, dan waktu. Simpan event penting serta referensi bukti; minimalkan payload dan credential dari awal.

Rencana ini memakai satu builder. Pekerjaan AI dapat dibagi menjadi unit UI, adapter, serta pengujian yang terisolasi, dengan satu pemilik shared contract dan integration branch. Setiap hari harus menghasilkan satu alur yang bisa didemokan; hindari membangun semua layar sebelum koneksi ke worker hidup.

## 7. Temuan audit yang masuk jalur kritis

| Temuan | Tindakan minimum sebelum fitur terkait aktif | Pekerjaan luas sesudah pilot |
|---|---|---|
| F01 — signer/authority | Approval dashboard berasal dari session terautentikasi dan grant server; worker tidak bisa menyatakan approval sah sendiri | Attestation Git lintas principal/delegasi tetap perlu diperbaiki sebelum klaim tersebut diandalkan |
| F02 — pin hanya bentuk teks | Resolve commit/snapshot dan ikat approval ke isi/revision yang benar; mismatch menahan dispatch | Generalisasi input non-Git |
| F03 — coverage gap tampak lulus | Required checks memiliki status lengkap/incomplete/failed; label conformance yang belum terbukti tidak menjadi syarat otomatis “accepted” | Coverage/cutover engine penuh |
| F04 — gate belum enforced | API/supervisor, credential scope, protected policy, dan sandbox menjadi penghalang nyata untuk jalur pilot | Profile organisasi dan integrasi repo lebih luas |
| F05 — QA tanpa verdict | Caller menahan acceptance bila pemeriksaan crash, timeout, atau tidak menghasilkan final verdict | Optimasi seluruh profile QA |
| F06–F08 — applicability, docs, context | Perbaiki masalah yang memblokir workflow/consumer pilot; dokumentasikan prasyarat; muat instruksi yang diperlukan task | Cleanup menyeluruh dan optimasi berbasis data pilot |

Approval dashboard tidak diberi label Git Attested hanya karena ada record di database. Bukti pilot terbatas pada trust boundary yang benar-benar diuji.

Minimum isolasi mencakup worker terpisah dari database/credential control plane, aturan tool, serta batas filesystem/network. Git worktree memisahkan perubahan tetapi tidak sendirian menjadi sandbox. Sandbox bawaan Bash juga memiliki cakupan spesifik; seluruh permukaan worker harus diperiksa sebelum memberi capability tulis. [Runtime sandboxing](https://code.claude.com/docs/en/sandboxing).

## 8. Utilisasi AI yang dioptimalkan

- **Antrean berprioritas:** task siap dan sudah diotorisasi otomatis mengisi slot kosong.
- **Paralel yang independen:** awalnya satu slot; naik menjadi dua setelah isolasi, resource, quota provider, dan konflik repo diuji. Worker tidak bersamaan mengintegrasikan perubahan ke resource yang sama.
- **Approval hanya saat keputusan baru:** batas tugas, scope, capability, atau tindakan sensitif yang berubah memicu keputusan baru. J1 tetap berjalan dalam izin yang ada.
- **Bounded repair:** satu siklus perbaikan awal untuk temuan yang masuk scope; batas final diselaraskan dengan aturan repair repo yang berlaku.
- **Jadwal terbatas:** recurring task memakai template, owner, scope, budget, expiry/revocation, dan stop condition. Setiap kejadian menghasilkan attempt baru yang dapat ditelusuri.
- **Konteks sesuai task:** pin workflow dan referensi penting; hindari memuat seluruh sejarah untuk setiap run. Optimasi model/context berikutnya memakai hasil pengukuran.

Dashboard menampilkan throughput hasil accepted, antrean dan wait time, worker busy/idle, kegagalan verifikasi, intervensi manusia, serta biaya per hasil accepted. Tujuannya menaikkan hasil terverifikasi dengan biaya dan waktu yang terkendali.

Budget dibedakan menurut kemampuan enforcement. Durasi, jumlah attempt, dan concurrency dapat dibatasi oleh supervisor. Batas biaya runtime/provider perlu diuji; biaya yang tersedia ditampilkan dengan timestamp dan label estimasi. Untuk budget bersama, reserve alokasi sebelum dispatch dan rekonsiliasi sesudahnya. Request yang sedang berjalan dapat tetap menimbulkan biaya, sehingga jangan menjanjikan batas tagihan presisi tanpa dukungan provider yang terbukti.

## 9. Kriteria pilot selesai

Target pembelajaran: **minimal 10 task nyata pada dua repo, mencakup sukses, revisi, dan eskalasi manusia**, ditambah pengujian negatif yang terpisah. Sampel ini bukan bukti statistical reliability produksi.

Pilot diterima ketika:

1. Task normal dapat dibuat, dijalankan, dipantau, diputuskan, dan diperiksa hasilnya dari dashboard.
2. Approval identitas/revision/scope salah ditolak; J2 tidak menjalankan tindakan baru sebelum authority tersedia.
3. Scope tool/resource benar-benar dibatasi; worker tidak dapat mengubah grant, bukti verification terpercaya, atau credential controller.
4. Verification yang gagal/tidak lengkap mencegah acceptance otomatis.
5. Stop dan stop semua mengakhiri proses yang dikelola serta mencatat status yang sesuai; efek yang telanjur terjadi dapat ditelusuri.
6. Dua run independen dapat berjalan, sementara konflik/dispatch ganda dicegah.
7. Restart/disconnect tidak diam-diam menggandakan pekerjaan atau membuat run tampak berhasil. Status yang belum diketahui ditandai dan direkonsiliasi sebelum retry.
8. Antrean, approval, hasil, dan event penting bertahan saat service restart; operator dapat mengikuti runbook pemulihan.

Target ini diuji pada deployment dan versi runtime pilot. Kemampuan production deployment otomatis dan akses lintas sistem diaktifkan melalui scope lanjutan yang memiliki kontrol sepadan.

## 10. Hubungan dengan roadmap repo dan langkah setelah pilot

Repo saat ini memisahkan observer, connected workspace, gateway, dan managed execution melalui admission berjenjang. Pilot ini mengambil **subset operasional dari beberapa epic**. Catat sebagai track pilot khusus dengan ADR untuk batas repo/service, data authority, evidence, dan perubahan admission. Pengguna sudah mengarahkan prioritas ke dashboard; pekerjaan perencanaan tidak perlu tertahan oleh urutan investasi sebelumnya.

Subset tersebut tidak menutup EPIC-005–015 secara otomatis. Existing closed-when tetap dipakai ketika kita mengklaim penutupan epic formal. Source standard dan plugin yang dipakai tetap dipin; detail service tidak menjadi aturan normatif tersembunyi. [Sequencing repo](https://github.com/aldianriski/lean-flow/blob/da7da8c400c5cd8c9eec1b2aa48f67d1057bdb70/docs/research/adlc-epic-sequencing.md).

Setelah pilot, pilih perluasan dari bottleneck yang terukur: runtime kedua, integrasi PR/deployment, lebih banyak workflow, peningkatan kapasitas, atau policy organisasi. Selesaikan engine migration dan protocol formal sesuai manfaat serta dependensi yang sudah teramati. Estimasi fase berikutnya dibuat dari data pilot, bukan dimasukkan kembali sebagai syarat agar dashboard pertama bisa digunakan.

Dasar repo diverifikasi pada **da7da8c400c5cd8c9eec1b2aa48f67d1057bdb70**, 9 September 2026. Arah dashboard dan gateway minimum sudah ada dalam [dashboard user flows](https://github.com/aldianriski/lean-flow/blob/da7da8c400c5cd8c9eec1b2aa48f67d1057bdb70/docs/strategy/adlc/08-ADLC-DASHBOARD-DESIGN-USER-FLOWS.md) dan [gateway operating model](https://github.com/aldianriski/lean-flow/blob/da7da8c400c5cd8c9eec1b2aa48f67d1057bdb70/docs/strategy/adlc/09-ADLC-RUNTIME-GATEWAY-OPERATING-MODEL.md). Ketersediaan fitur runtime dibaca dari dokumentasi resmi; integrasi live belum diuji pada penyusunan rencana. Tanggal serta effort di atas adalah estimasi revisi, bukan fitur yang sudah selesai dibangun.
