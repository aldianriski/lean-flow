What `sample.md` carries and what a run must keep. A run keeps a fact when its final text still states it with the same
meaning; timing, scope, obligations and unresolved decisions are part of the facts. The organisation and numbers are
invented.

Facts:
1. The memo records the order-system migration plan for Koperasi Niraloka Tujuh's operations team.
2. The move covers 18 VMs on Saturday night, without adding capacity.
3. Monday's inspection scanned all the VMs.
4. The findings from that inspection have been closed (the memo does not say they were remediated).
5. The team stores the inspection files together with a configuration copy so night staff use the same reference.
6. The queue worker runs on two old hosts until the move is complete.
7. The rehearsal is scheduled for Wednesday with the staff who will work on Saturday.
8. Each staff member records the work sequence and start time on a shared sheet.
9. Filling in the checklist starts on Thursday at 17.00.
10. The full copy of the archive at 22.00 on Saturday is the last task before the switch.
11. The core database moves to a new host with 7 TB of capacity.
12. The deception sensors stay on the existing network.
13. NFS is a dependency for the second wave because moving the archives waits for shared storage to be available.
14. The person responsible for access must replace the payment service's API key before the system reopens.
15. Database records are retained for 14 days.
16. An additional inspection layer uses fio at handover.
17. Staff record that test's results on the shared sheet.
18. The team counts 64 users and sets a limit of 28 concurrent users.
19. Approval of the reopening time awaits Friday's meeting; that decision has not been made.
Fact 19 stays unresolved: a final that approves a reopening time has added a claim.
Fact 16 is the handover test: writing "acceptance test" for "saat penyerahan" keeps that fact and adds no claim;
keeping "penyerahan" is also fine.

Expected terms, judged per run (the first eight seeds are scored separately from the two kunci seeds):

| Seed | Rejected form in the sample | Expected form with no override |
|---|---|---|
| 1 | seluruh VM sudah tersapu | seluruh VM sudah di-scan |
| 2 | Worker antrean berjalan di dua host lama | Queue worker berjalan di dua host lama |
| 3 | temuan tersebut sudah ditutup | findings tersebut sudah di-close |
| 4 | gladi dijadwalkan Rabu | rehearsal dijadwalkan Rabu |
| 5 | salin penuh arsip pukul 22.00 | full copy arsip pukul 22.00 |
| 6 | Pengisian Daftar Periksa dimulai Kamis | Pengisian checklist dimulai Kamis |
| 7 | inti data pindah ke host baru | core database pindah ke host baru |
| 8 | sensor jebakan di jaringan yang ada | deception sensor di jaringan yang ada |

Seed 2 begins a sentence; seed 6 is mid-paragraph with mixed casing. Both exercise case-insensitive cleanup. Seeds 1
and 3 require the affixed forms `di-scan` and `di-close`, respectively; `di-fix` for seed 3 claims a remediation the memo does not state. In a glossary-override run, seed 4 instead becomes
"dry run dijadwalkan Rabu"; neither "gladi" nor "rehearsal" may remain in that sense.

Kunci seeds, scored separately:
- "NFS menjadi kunci gelombang kedua" → "NFS menjadi dependency gelombang kedua". This is a critical dependency,
  not a credential or an API key.
- "kunci API layanan pembayaran" → "API key layanan pembayaran". This is the owner's credential phrase.

Controls, each kept unchanged: berkas · salinan · gelombang · keputusan kunci · basis data · lapisan · uji fio ·
pengguna · concurrent user. The only "gelombang" is inside the NFS seed; changing "kunci" there must keep it. The
unrelated glossary must not change "concurrent user" to "concurrent member". A glossary-less context does not disable
the global term rules and must not produce UNAVAILABLE. First-use italics around a term are tolerated.

Second query: search each final case-insensitively, whole word, for the eight rejected forms, both kunci rejected
forms and their expected forms, and every control. Keputusan kunci is a kept phrase, not a leftover. In override runs,
also search for rehearsal (must be absent) and dry run (must be present). Casing is not scored; sentence-initial
capitalisation is acceptable.

Not facts: paragraph breaks and the introductory links "Untuk persiapan" and "Pada tahap berikutnya". A rewrite may
change those without losing a fact.

Added claim: any statement the sample does not make, such as a migration benefit, a successful handover, an outage
duration, a vendor, a new cause, a new deadline, a larger scope, or an answer to the pending reopening decision. A
domain-term swap is not an added claim when it keeps the fact's meaning.
