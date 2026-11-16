What `sample.md` carries and what a run must keep. A run keeps a fact when its final text still states it with the same
meaning; timing, scope, obligations and unresolved decisions are part of the facts. The organisation and numbers are
invented.

Facts:
1. The memo records the order-system migration plan for Koperasi Niraloka Tujuh's operations team.
2. The move covers 18 VMs on Saturday night, without adding capacity.
3. Monday's inspection scanned all the VMs.
4. The findings from that inspection have been fixed.
5. The team stores the inspection files together with a configuration copy so night staff use the same reference.
6. The queue worker runs on two old hosts until the move is complete.
7. The rehearsal is scheduled for Wednesday with the staff who will work on Saturday.
8. Each staff member records the work sequence and start time on a shared sheet.
9. The code freeze starts on Thursday at 17.00.
10. The final sync is at 22.00 on Saturday, the last task before the switch.
11. The core database moves to a new host with 7 TB of capacity.
12. TLS termination remains on the existing load balancer.
13. NFS is a dependency for the second wave because moving the archives waits for shared storage to be available.
14. The person responsible for access must replace the payment service's API key before the system reopens.
15. Database records are retained for 14 days.
16. An additional inspection layer uses fio at handover.
17. Staff record that test's results on the shared sheet.
18. The team counts 64 users and sets a limit of 28 concurrent users.
19. Approval of the reopening time awaits Friday's meeting; that decision has not been made.
Fact 19 stays unresolved: a final that approves a reopening time has added a claim.

Expected terms, judged per run (the first eight seeds are scored separately from the two kunci seeds):

| Seed | Rejected form in the sample | Expected form with no override |
|---|---|---|
| 1 | seluruh VM sudah tersapu | seluruh VM sudah di-scan |
| 2 | Worker antrean berjalan di dua host lama | Queue worker berjalan di dua host lama |
| 3 | temuan tersebut sudah ditutup | findings tersebut sudah di-fix |
| 4 | gladi dijadwalkan Rabu | rehearsal dijadwalkan Rabu |
| 5 | sinkron akhir pukul 22.00 | final sync pukul 22.00 |
| 6 | Pembekuan Kode berlaku sejak Kamis pukul 17.00 | Code freeze berlaku sejak Kamis pukul 17.00 |
| 7 | inti data pindah ke host baru | core database pindah ke host baru |
| 8 | terminasi TLS di load balancer | TLS termination di load balancer |

Seed 2 begins a sentence; seed 6 is mid-paragraph with mixed casing. Both exercise case-insensitive cleanup. Seeds 1
and 3 require the affixed forms `di-scan` and `di-fix`, respectively. In a glossary-override run, seed 4 instead becomes
"dry run dijadwalkan Rabu"; neither "gladi" nor "rehearsal" may remain in that sense.

Kunci seeds, scored separately:
- "NFS menjadi kunci gelombang kedua" → "NFS menjadi dependency gelombang kedua". This is a critical dependency,
  not a credential or an API key.
- "kunci API layanan pembayaran" → "API key layanan pembayaran". This is the owner's credential phrase.

Controls, each kept unchanged: berkas · salinan · gelombang · keputusan kunci · basis data · lapisan · uji fio ·
pengguna · concurrent user. The only "gelombang" is inside the NFS seed; changing "kunci" there must keep it. The
unrelated glossary must not change "concurrent user" to "concurrent member". A glossary-less context does not disable
the global term rules and must not produce UNAVAILABLE. First-use italics around a term are tolerated.

Not facts: paragraph breaks and the introductory links "Untuk persiapan" and "Pada tahap berikutnya". A rewrite may
change those without losing a fact.

Added claim: any statement the sample does not make, such as a migration benefit, a successful handover, an outage
duration, a vendor, a new cause, a new deadline, a larger scope, or an answer to the pending reopening decision. A
domain-term swap is not an added claim when it keeps the fact's meaning.
