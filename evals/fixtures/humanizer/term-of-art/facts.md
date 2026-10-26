What `sample.md` carries and what a run must keep. A run keeps a fact when its final text still states it with the same
meaning; a qualifier counts as part of the fact ("sekitar 300" kept as "300" is a changed fact).

Facts:
1. The memo requests additional server and storage capacity for the internal reporting platform.
2. It is addressed to the IT Manager (Manajer TI) of PT Arunika Data Nusantara.
3. The platform serves 120 concurrent users now.
4. The number is expected to rise to about 300 in the first quarter of 2027.
5. Storage is sufficient, with 40 TB available.
6. At least 25% free space must be kept at all times.
7. RAM goes from 128 GB to 256 GB per node.
8. RAID 6 tolerates two failed drives (fault tolerance of two drives).
9. The RAID 6 write penalty of 6 has been accounted for.
10. Users download daily report files.
11. Backups are made every night at 01.00.
12. The capacity must be proven by an fio test at the acceptance test (a testing obligation; it must stay stated).
13. Open item: whether the third node is bought this year or next year.
14. Open item: who is responsible for the fio test.
15. Open item: whether the offsite backup budget is approved.
Each open item (13 to 15) stays open: a final that answers one has added a claim, and a final that drops one has lost a
fact. How the list is presented is T2's concern; in a TASK-525 run it is judged only as facts.

Expected terms, judged per run:
- Terms of art, each present in English in the final: concurrent user · free space · fault tolerance · write penalty ·
  acceptance test. In the sample, "concurrent user" and "write penalty" are already English; "ruang kosong",
  "toleransi drive rusak" and "serah terima" are the word-by-word Indonesian forms the fixed pass should return to English.
- General vocabulary, each still Indonesian in the final (anglicized = a fail): pengguna · berkas · cadangan · mengunduh
  (or unduh) · laporan.

Not facts (dressing; cutting it is correct): "Di era digital ini", "memainkan peran krusial bagi operasional
perusahaan", "Oleh karena itu", "Selain itu", the bold `Storage:`, `Memori:`, `RAID:` and `Penggunaan:` labels, the
hedging words "di atas kertas" and "tetap harus" (the test obligation they wrap is fact 12), and the label-first fragments
"Storage cukup." and "RAM ditambah." as fragments (their content is facts 5 and 7).

Added claim: any statement the sample does not make, such as a benefit, a cause, a deadline, a decided answer to an open
item, a vendor, or a scope ("all servers", "every office").
