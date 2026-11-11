import { SchoolProfile, Student, TeachingJournalEntry, CounselingCaseEntry, StudentGradeRecord } from '../types/index.ts';

export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  schoolName: 'SMP NEGERI 1 TELADAN NUSANTARA',
  npsn: '10293847',
  address: 'Jl. Pendidikan Merdeka No. 45, Kebayoran Baru, Jakarta Selatan',
  academicYear: '2025/2026',
  semester: 'Ganjil',
  principalName: 'Drs. H. Mulyadi, M.Pd.',
  principalNip: '19700514 199512 1 002',
  teacherName: 'Yuliana Rahmawati, S.Pd., Gr.',
  teacherNip: '19880922 201101 2 008',
  subject: 'Matematika',
  grade: 'Kelas VII (Tujuh)',
  phase: 'D',
  curriculum: 'Kurikulum Merdeka',
  kkmThreshold: 75,
};

export const INITIAL_STUDENTS: Student[] = [
  { id: 'std-1', nisn: '0081234561', name: 'Aditya Pratama Putra', gender: 'L' },
  { id: 'std-2', nisn: '0081234562', name: 'Aisyah Putri Azzahra', gender: 'P' },
  { id: 'std-3', nisn: '0081234563', name: 'Bagas Satria Wijaya', gender: 'L' },
  { id: 'std-4', nisn: '0081234564', name: 'Cantika Dewi Lestari', gender: 'P' },
  { id: 'std-5', nisn: '0081234565', name: 'Dimas Arya Pamungkas', gender: 'L' },
  { id: 'std-6', nisn: '0081234566', name: 'Fadhil Muhammad Ihsan', gender: 'L' },
  { id: 'std-7', nisn: '0081234567', name: 'Gisella Amanda Putri', gender: 'P' },
  { id: 'std-8', nisn: '0081234568', name: 'Hafiz Rizky Alamsyah', gender: 'L' },
  { id: 'std-9', nisn: '0081234569', name: 'Indah Permata Sari', gender: 'P' },
  { id: 'std-10', nisn: '0081234570', name: 'Jovan Nathan Kusuma', gender: 'L' },
  { id: 'std-11', nisn: '0081234571', name: 'Keisha Aurelia Syahrani', gender: 'P' },
  { id: 'std-12', nisn: '0081234572', name: 'Luthfi Hakim Ramadhan', gender: 'L' },
];

export const INITIAL_GRADES: StudentGradeRecord[] = [
  {
    studentId: 'std-1',
    formatif: { tp1: 85, tp2: 88, tp3: 84, tp4: 90 },
    sumatif: { lm1: 86, lm2: 88, sts: 85, sas: 88 },
    finalScore: 87,
    predicate: 'B',
    descriptor: 'Aditya Pratama Putra menunjukkan pemahaman sangat baik dalam penguasaan konsep aljabar dan bilangan bulat, serta aktif menyelesaikan tugas mandiri.',
  },
  {
    studentId: 'std-2',
    formatif: { tp1: 94, tp2: 95, tp3: 92, tp4: 96 },
    sumatif: { lm1: 95, lm2: 94, sts: 96, sas: 95 },
    finalScore: 95,
    predicate: 'A',
    descriptor: 'Aisyah Putri Azzahra menunjukkan pencapaian yang sangat istimewa dalam menyelesaikan soal berbasis pemecahan masalah dan penalaran matematis.',
  },
  {
    studentId: 'std-3',
    formatif: { tp1: 76, tp2: 78, tp3: 75, tp4: 80 },
    sumatif: { lm1: 78, lm2: 76, sts: 77, sas: 79 },
    finalScore: 77,
    predicate: 'C',
    descriptor: 'Bagas Satria Wijaya telah mencapai kriteria ketuntasan tujuan pembelajaran dalam operasi hitung campuran, perlu penguatan ketelitian perhitungan.',
  },
  {
    studentId: 'std-4',
    formatif: { tp1: 90, tp2: 92, tp3: 88, tp4: 90 },
    sumatif: { lm1: 90, lm2: 89, sts: 92, sas: 91 },
    finalScore: 90.5,
    predicate: 'A',
    descriptor: 'Cantika Dewi Lestari sangat mahir dalam mengidentifikasi pola bilangan dan menyelesaikan proyek lembar kerja kelompok dengan cermat.',
  },
  {
    studentId: 'std-5',
    formatif: { tp1: 68, tp2: 72, tp3: 70, tp4: 74 },
    sumatif: { lm1: 70, lm2: 72, sts: 69, sas: 72 },
    finalScore: 71.3,
    predicate: 'D',
    descriptor: 'Dimas Arya Pamungkas memerlukan pendampingan berkala dalam memahami konsep dasar variabel dan pemodelan aljabar sederhana.',
  },
];

export const INITIAL_JOURNAL: TeachingJournalEntry[] = [
  {
    id: 'jrn-1',
    date: '2026-11-09',
    period: '1 - 3 (07.00 - 09.00)',
    classGroup: 'VII-A',
    subject: 'Matematika',
    topic: 'Operasi Penjumlahan dan Pengurangan Bentuk Aljabar',
    learningActivities: 'Model Problem-Based Learning: Siswa mengamati permasalahan kontekstual biaya belanja kantin, berdiskusi kelompok dengan LKPD Aljabar, dan mempresentasikan hasil kerja.',
    attendancePresent: 31,
    attendanceAbsent: 1,
    obstacles: 'Beberapa siswa masih keliru saat menjumlahkan suku-suku yang variabelnya tidak sejenis.',
    followUp: 'Diberikan lembar scaffolding latihan suku sejenis dan permainan kartu suku aljabar pada pertemuan berikutnya.',
  },
  {
    id: 'jrn-2',
    date: '2026-11-10',
    period: '4 - 5 (09.30 - 11.00)',
    classGroup: 'VII-B',
    subject: 'Matematika',
    topic: 'Penyederhanaan dan Perkalian Bentuk Aljabar',
    learningActivities: 'Diskusi kelompok berbasis Discovery Learning memanfaatkan alat peraga ubin aljabar (algebra tiles) digital.',
    attendancePresent: 32,
    attendanceAbsent: 0,
    obstacles: 'Waktu presentasi kelompok sedikit melebihi alokasi karena antusiasme tanya jawab.',
    followUp: 'Pengaturan waktu (time-keeper) per kelompok akan dipertegas di sesi berikutnya.',
  },
];

export const INITIAL_CASES: CounselingCaseEntry[] = [
  {
    id: 'case-1',
    date: '2026-11-08',
    studentName: 'Dimas Arya Pamungkas',
    classGroup: 'VII-A',
    incidentType: 'Akademik',
    description: 'Nilai asesmen formatif sub-materi aljabar di bawah KKM dan sering tampak pasif saat diskusi kelompok.',
    handlingAction: 'Dilakukan pembimbingan personal (coaching ringan) saat jam istirahat untuk memetakan kesulitan belajar dan gaya belajar siswa.',
    followUp: 'Dipasangkan dengan tutor sebaya (Aisyah Putri) dan diberikan latihan bertahap dengan pendampingan wali kelas.',
    status: 'Diproses',
  },
  {
    id: 'case-2',
    date: '2026-11-04',
    studentName: 'Bagas Satria Wijaya',
    classGroup: 'VII-A',
    incidentType: 'Kedisiplinan',
    description: 'Terlambat masuk kelas selama 15 menit pada jam pelajaran pertama sebanyak dua kali berturut-turut.',
    handlingAction: 'Wawancara klarifikasi bersama guru piket dan wali kelas terkait rute transportasi dan jam tidur malam.',
    followUp: 'Siswa berkomitmen mengatur jadwal tidur dan orang tua telah dihubungi via telepon untuk pemantauan bersama. Siswa kini hadir tepat waktu.',
    status: 'Selesai',
  },
];

export function getSampleDocument(type: string, profile: SchoolProfile, topic = 'Operasi Aljabar dan Persamaan Linear'): string {
  switch (type) {
    case 'modul_ajar':
      return `# MODUL AJAR KURIKULUM MERDEKA
**MATA PELAJARAN:** ${profile.subject.toUpperCase()}  
**SATUAN PENDIDIKAN:** ${profile.schoolName}  
**FASE / KELAS:** Fase ${profile.phase} / ${profile.grade}  
**ALOKASI WAKTU:** 2 x 40 Menit (1 Pertemuan)  
**TAHUN AJARAN:** ${profile.academicYear} | Semester ${profile.semester}  

---

### A. INFORMASI UMUM
1. **Identitas Modul**
   - Nama Penyusun: ${profile.teacherName} (NIP. ${profile.teacherNip})
   - Nama Satuan Pendidikan: ${profile.schoolName}
   - Mata Pelajaran: ${profile.subject}
   - Topik / Materi Pokok: ${topic}
   - Jenjang / Fase: SMP / Fase ${profile.phase}
   - Target Peserta Didik: Peserta Didik Reguler / Tipikal (32 Siswa)
   - Model Pembelajaran: *Problem-Based Learning (PBL)* terintegrasi Pembelajaran Berdiferensiasi

2. **Profil Pelajar Pancasila**
   - **Bernalar Kritis:** Mengidentifikasi informasi relevan, memodelkan masalah matematis, dan menganalisis solusi alternatif.
   - **Gotong Royong:** Bekerja sama secara aktif dan berbagi tugas dalam menyelesaikan Lembar Kerja Peserta Didik (LKPD).
   - **Mandiri:** Menumbuhkan rasa tanggung jawab atas proses dan hasil belajar pribadi.
   - **Kreatif:** Mengembangkan pemodelan aljabar yang fleksibel dalam konteks kehidupan sehari-hari.

3. **Sarana dan Prasarana**
   - Papan tulis, LCD Proyektor, Laptop/Gawai
   - Lembar Kerja Peserta Didik (LKPD Berdiferensiasi)
   - Media Konkret / Ubin Aljabar Digital
   - Buku Guru & Buku Siswa Kemendikbudristek

---

### B. KOMPONEN INTI
1. **Tujuan Pembelajaran (TP)**
   - Peserta didik mampu mengidentifikasi unsur-unsur aljabar (variabel, koefisien, konstanta, dan suku sejenis) secara tepat melalui pengamatan konteks nyata.
   - Peserta didik mampu menyelesaikan operasi hitung penjumlahan dan pengurangan suku sejenis dalam bentuk aljabar dengan cermat.
   - Peserta didik mampu memodelkan masalah kontekstual transaksi jual beli sederhana ke dalam bentuk persamaan aljabar linear.

2. **Pemahaman Bermakna**
   - Aljabar adalah bahasa simbolik universal untuk mempermudah perhitungan berbagai besaran yang nilainya belum diketahui pasti dalam kehidupan nyata (seperti biaya, jarak, waktu, dan inventaris).

3. **Pertanyaan Pemantik**
   - *"Jika kalian membeli 3 kotak pensil dan 4 buah pensil lepasan, bagaimana cara menuliskannya dalam bentuk matematika yang ringkas?"*
   - *"Mengapa kita bisa menjumlahkan jeruk dengan jeruk, tetapi tidak bisa menjumlahkan 3 jeruk dengan 2 buku menjadi satu jenis benda?"*

4. **Kegiatan Pembelajaran**
   #### a. Kegiatan Pendahuluan (10 Menit)
   - Guru membuka pembelajaran dengan salam hangat, doa bersama, dan presensi siswa.
   - Ice breaking pemusatan konsentrasi ("Tebak Pola Angka").
   - Apersepsi: Guru mengaitkan konsep operasi hitung bilangan bulat dengan simbol variabel.
   - Guru menyampaikan tujuan pembelajaran, skenario aktivitas, dan kriteria penilaian.

   #### b. Kegiatan Inti (60 Menit)
   - **Fase 1: Orientasi Siswa pada Masalah:** Guru menampilkan studi kasus grafis tentang pengadaan paket sembako di bazar sekolah.
   - **Fase 2: Mengorganisasikan Siswa:** Siswa dibagi ke dalam kelompok heterogen (4-5 siswa). Guru membagikan LKPD dengan tingkat tantangan bertingkat (*differentiated content*).
   - **Fase 3: Membimbing Penyelidikan Mandiri & Kelompok:** Guru berkeliling memberikan *scaffolding* pada kelompok yang memerlukan bantuan, serta memberi tantangan pengayaan pada kelompok cepat.
   - **Fase 4: Mengembangkan & Menyajikan Hasil Karya:** Perwakilan kelompok mempresentasikan hasil pemodelan aljabar di depan kelas dengan media visual.
   - **Fase 5: Menganalisis & Mengevaluasi Proses:** Guru dan peserta didik memberikan umpan balik, konfirmasi konsep suku sejenis, dan klarifikasi miskonsepsi.

   #### c. Kegiatan Penutup (10 Menit)
   - Guru bersama peserta didik menyimpulkan intisari materi.
   - Peserta didik mengerjakan kuis formatif singkat (3 soal exit ticket).
   - Refleksi bersama: *"Bagian mana yang paling menarik dan bagian mana yang masih menantang?"*
   - Guru menginformasikan materi untuk pertemuan berikutnya dan menutup dengan doa serta salam.

---

### C. ASESMEN DAN PENILAIAN
1. **Asesmen Diagnostik (Awal Pembelajaran):** Tanya jawab pemantik kesiapan belajar operasi bilangan bulat.
2. **Asesmen Formatif (Proses):** Observasi keaktifan diskusi kelompok menggunakan rubrik Profil Pelajar Pancasila & lembar observasi LKPD.
3. **Asesmen Sumatif (Akhir TP):** Tes tertulis 5 butir soal pemecahan masalah kontekstual.

---

### D. PENGAYAAN DAN REMEDIAL
- **Pengayaan:** Siswa dengan ketuntasan cepat diberikan tantangan problem-solving olimpiade mini atau proyek pembuatan kartu teka-teki aljabar.
- **Remedial:** Bimbingan khusus berpasangan (tutor sebaya) dengan fokus pemilahan suku sejenis menggunakan ubin warna.

---
*Dokumen ini disusun otomatis berdasarkan Standar Perangkat Kurikulum Merdeka.*`;

    case 'atp':
      return `# ALUR TUJUAN PEMBELAJARAN (ATP)
**MATA PELAJARAN:** ${profile.subject.toUpperCase()}  
**SATUAN PENDIDIKAN:** ${profile.schoolName}  
**FASE / KELAS:** Fase ${profile.phase} / ${profile.grade}  
**TAHUN PELAJARAN:** ${profile.academicYear}  

### Capaian Pembelajaran (CP) Elemen: Bilangan & Aljabar
*Di akhir Fase ${profile.phase}, peserta didik dapat mengenali, memprediksi, dan menggeneralisasi pola dalam bentuk susunan benda dan bilangan. Mereka dapat menyatakan suatu situasi ke dalam bentuk aljabar, menggunakan sifat-sifat operasi untuk menghasilkan bentuk aljabar yang ekuivalen, serta menyelesaikan persamaan dan pertidaksamaan linear satu variabel.*

| No | Elemen | Capaian Pembelajaran (CP) | Tujuan Pembelajaran (TP) | Materi Pokok / Lingkup Materi | Alokasi Waktu (JP) | Profil Pelajar Pancasila | Asesmen |
|---|---|---|---|---|---|---|---|
| 1 | Bilangan | Memahami sifat operasi bilangan rasional | TP 1.1: Membaca, menuliskan, dan membandingkan bilangan bulat positif dan negatif | Bilangan Bulat | 12 JP | Bernalar Kritis, Mandiri | Formatif & Sumatif Lingkup 1 |
| 2 | Bilangan | Menerapkan operasi hitung campuran | TP 1.2: Menyelesaikan masalah kontekstual menggunakan operasi hitung campuran | Operasi Hitung Campuran | 12 JP | Bernalar Kritis, Kreatif | Lembar Observasi & Portofolio |
| 3 | Aljabar | Menyatakan situasi ke bentuk aljabar | TP 2.1: Mengidentifikasi variabel, koefisien, konstanta, dan suku sejenis | Bentuk Aljabar Dasar | 10 JP | Gotong Royong, Bernalar Kritis | Diskusi Kelompok & Kuis |
| 4 | Aljabar | Operasi hitung aljabar | TP 2.2: Melakukan operasi penjumlahan, pengurangan, dan perkalian bentuk aljabar | Operasi Aljabar | 14 JP | Bernalar Kritis, Mandiri | Tes Tertulis & Presentasi |
| 5 | Aljabar | Persamaan Linear | TP 2.3: Menyelesaikan persamaan linear satu variabel (PLSV) dalam konteks nyata | PLSV & PtLSV | 16 JP | Bernalar Kritis, Kreatif | Proyek Pemodelan Masalah |

**Total Jam Pelajaran Semester Ganjil:** 64 Jam Pelajaran (JP)`;

    case 'kktp':
      return `# KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP)
**MATA PELAJARAN:** ${profile.subject.toUpperCase()}  
**SATUAN PENDIDIKAN:** ${profile.schoolName}  
**FASE / KELAS:** Fase ${profile.phase} / ${profile.grade}  

### Pendekatan Rubrik Deskripsi Kriteria
**Tujuan Pembelajaran (TP):** Peserta didik mampu memodelkan dan menyelesaikan operasi penjumlahan serta pengurangan bentuk aljabar suku sejenis.

| Indikator / Kriteria | Perlu Bimbingan (0 - 69) | Cukup (70 - 79) | Baik (80 - 89) | Sangat Baik (90 - 100) |
|---|---|---|---|---|
| **1. Identifikasi Unsur Aljabar** | Belum mampu membedakan variabel, koefisien, dan konstanta tanpa bimbingan langsung guru. | Mampu menyebutkan variabel dan koefisien tetapi masih ragu mengelompokkan suku sejenis. | Mampu mengidentifikasi suku sejenis dan variabel dengan tepat secara mandiri. | Mampu mengidentifikasi unsur aljabar pada bentuk ekspresi kompleks dan menjelaskannya ke rekan sejawat. |
| **2. Operasi Penjumlahan & Pengurangan** | Sering salah menjumlahkan koefisien suku yang berbeda variabel. | Mampu menjumlahkan suku sejenis satu variabel dengan sedikit kekeliruan tanda negatif. | Mampu menyelesaikan operasi hitung suku sejenis bertanda positif dan negatif dengan tepat. | Mampu menyelesaikan operasi suku majemuk bertingkat dengan tepat, teliti, dan runtut. |
| **3. Pemodelan Soal Cerita** | Belum dapat mengubah kalimat soal cerita ke dalam ekspresi matematika. | Mampu menuliskan variabel namun formula matematis belum lengkap. | Mampu menyusun ekspresi aljabar dari konteks nyata sehari-hari dengan benar. | Mampu memodelkan dan memberikan interpretasi mendalam terhadap makna variabel dalam kehidupan nyata. |

**Kesimpulan Ketercapaian:**  
- Peserta didik dinyatakan **Tuntas** jika minimal mencapai kategori **Baik** (Skor >= 80) pada minimal 2 kriteria, dan tidak ada kriteria yang masuk kategori *Perlu Bimbingan*.`;

    case 'lkpd':
      return `# LEMBAR KERJA PESERTA DIDIK (LKPD)
**MATA PELAJARAN:** ${profile.subject.toUpperCase()}  
**TOPIK:** ${topic}  
**KELOMPOK:** ............................................................  
**ANGGOTA KELOMPOK:**  
1. ............................................................ (No: ......)  
2. ............................................................ (No: ......)  
3. ............................................................ (No: ......)  
4. ............................................................ (No: ......)  

---

### A. PETUNJUK PENGERJAAN
1. Berdoalah sebelum memulai kegiatan bersama anggota kelompokmu.
2. Bacalah permasalahan kontekstual di bawah ini dengan teliti dan cermat.
3. Diskusikan solusi terbaik bersama kelompokmu dan tuliskan langkah pengerjaan secara jelas di lembar yang disediakan.

---

### B. STIMULUS & MASALAH KONTEKSTUAL
*Pak Danu adalah pemilik toko alat tulis "Cerdas Mandiri". Pada hari Senin, ia menerima kiriman barang berupa **5 kardus buku tulis** dan **8 buku tulis lepasan**. Pada hari Selasa, ia menerima kiriman tambahan berupa **3 kardus buku tulis** dan **12 buku tulis lepasan**.*

*Karena setiap kardus berisi jumlah buku yang sama persis namun belum dibuka, Pak Danu memisalkan jumlah buku dalam satu kardus sebagai huruf **x**.*

---

### C. AKTIVITAS PENYELIDIKAN
1. **Identifikasi Variabel:**  
   - Simbol variabel yang digunakan: ........................................  
   - Makna variabel tersebut dalam konteks: ........................................  

2. **Tuliskan Ekspresi Aljabar:**  
   - Bentuk aljabar kiriman hari Senin: ........................................  
   - Bentuk aljabar kiriman hari Selasa: ........................................  

3. **Operasi Penjumlahan Aljabar:**  
   - Jumlahkan seluruh kiriman hari Senin dan Selasa:  
     $$\\text{Total} = (........................................) + (........................................)$$  
   - Kelompokkan suku-suku yang sejenis:  
     $$\\text{Total} = (..... + .....)x + (..... + .....)$$  
   - Bentuk aljabar paling sederhana: ........................................  

4. **Tantangan Aplikasi Nyata:**  
   - Jika setelah dihitung satu kardus (*x*) ternyata berisi **40 buku tulis**, berapakah total seluruh buku yang diterima Pak Danu?  
     *Langkah hitung:* ........................................................................................  
     *Hasil akhir:* ........................................................................................  

---

### D. KESIMPULAN KELOMPOK
Tuliskan dengan bahasamu sendiri, aturan apa yang harus diingat saat menjumlahkan atau mengurangkan bentuk aljabar:  
*Jawab:* ...........................................................................................................................................`;

    case 'kisi_soal':
      return `# KISI-KISI & NASKAH ASESMEN SUMATIF (HOTS)
**MATA PELAJARAN:** ${profile.subject.toUpperCase()}  
**SATUAN PENDIDIKAN:** ${profile.schoolName}  
**FASE / KELAS:** Fase ${profile.phase} / ${profile.grade}  
**JUMLAH SOAL:** 5 Butir (Pilihan Ganda, Pilihan Ganda Kompleks, Uraian Berbasis Masalah)  

---

### A. KISI-KISI SOAL
| No | Capaian Pembelajaran (CP) | Materi Pokok | Indikator Soal | Level Kognitif | Bentuk Soal | No Soal |
|---|---|---|---|---|---|---|
| 1 | Memahami konsep aljabar | Unsur Aljabar | Disajikan ekspresi aljabar, siswa mampu menentukan koefisien dan suku sejenis dengan tepat | L2 (Aplikasi) | Pilihan Ganda | 1 |
| 2 | Operasi aljabar kontekstual | Operasi Penjumlahan | Disajikan stimulus transaksi pasar, siswa memodelkan dan menjumlahkan bentuk aljabar | L3 (Penalaran / HOTS) | PG Kompleks | 2 |
| 3 | Keliling & luas bangun aljabar | Geometri Aljabar | Disajikan gambar denah dengan panjang sisi berbentuk ekspresi aljabar, siswa menghitung keliling | L3 (Penalaran / HOTS) | Uraian | 3 |

---

### B. NASKAH BUTIR SOAL

**1. Pilihan Ganda (Tunggal)**  
Bentuk aljabar $5x^2 - 3x + 8y - 12$ memiliki konstanta sebesar ...  
A. $5$  
B. $-3$  
C. $8$  
D. $-12$  
*Kunci Jawaban: D*  
*Pembahasan: Konstanta adalah bilangan yang tidak memuat variabel. Pada bentuk tersebut konstantanya adalah -12.*

**2. Pilihan Ganda Kompleks (Pilih lebih dari satu jawaban benar)**  
Perhatikan bentuk aljabar: $4a + 7b - 2a + 3b - 9$.  
Pernyataan berikut yang benar adalah:  
[x] Suku $4a$ dan $-2a$ merupakan suku-suku yang sejenis  
[x] Bentuk sederhana dari ekspresi tersebut adalah $2a + 10b - 9$  
[ ] Koefisien dari variabel $b$ setelah disederhanakan adalah 7  
[x] Konstanta dari bentuk aljabar tersebut bernilai negatif  

**3. Soal Uraian (Studi Kasus HOTS)**  
Sebuah taman bermain berbentuk persegi panjang memiliki panjang $(3x + 4)$ meter dan lebar $(2x - 1)$ meter.  
a. Tuliskan rumus keliling taman tersebut dalam bentuk aljabar paling sederhana!  
b. Jika nilai $x = 8$, hitunglah keliling taman tersebut dalam satuan meter!  
*Rubrik Penskoran:*  
- Rumus keliling: $K = 2(p + l) = 2((3x+4) + (2x-1)) = 2(5x + 3) = 10x + 6$ *(Skor 5)*  
- Substitusi $x = 8$: $K = 10(8) + 6 = 80 + 6 = 86$ meter *(Skor 5)*  
- Total Skor Maksimal: 10`;

    case 'prota':
      return `# PROGRAM TAHUNAN (PROTA)
**MATA PELAJARAN:** ${profile.subject.toUpperCase()}  
**SATUAN PENDIDIKAN:** ${profile.schoolName}  
**FASE / KELAS:** Fase ${profile.phase} / ${profile.grade}  
**TAHUN AJARAN:** ${profile.academicYear}  

| Semester | No | Capaian / Tujuan Pembelajaran | Materi Pokok | Alokasi Waktu (JP) | Keterangan |
|---|---|---|---|---|---|
| **Ganjil** | 1 | TP 1.1: Memahami konsep bilangan bulat dan urutan bilangan | Bilangan Bulat | 16 JP | Modul 1 |
| Ganjil | 2 | TP 1.2: Melakukan operasi hitung bilangan bulat dan pecahan | Operasi Bilangan | 20 JP | Modul 2 |
| Ganjil | 3 | TP 2.1: Mengidentifikasi unsur dan suku aljabar | Unsur Aljabar | 12 JP | Modul 3 |
| Ganjil | 4 | TP 2.2: Operasi penjumlahan, pengurangan, perkalian aljabar | Operasi Aljabar | 16 JP | Modul 4 |
| Ganjil | - | Cadangan Jam & Asesmen Sumatif Akhir Semester | Asesmen SAS | 8 JP | Evaluasi |
| **Subtotal Semester Ganjil** | | | | **72 JP** | 18 Minggu Efektif x 4 JP |
| **Genap** | 5 | TP 3.1: Menyelesaikan Persamaan Linear Satu Variabel (PLSV) | PLSV | 18 JP | Modul 5 |
| Genap | 6 | TP 3.2: Menyelesaikan Pertidaksamaan Linear Satu Variabel | PtLSV | 14 JP | Modul 6 |
| Genap | 7 | TP 4.1: Menjelaskan konsep rasio dan skala peta | Perbandingan & Rasio | 18 JP | Modul 7 |
| Genap | 8 | TP 5.1: Mengolah data dalam bentuk diagram dan tabel | Statistika Dasar | 14 JP | Modul 8 |
| Genap | - | Cadangan Jam & Asesmen Sumatif Akhir Tahun | Asesmen SAT | 8 JP | Evaluasi |
| **Subtotal Semester Genap** | | | | **72 JP** | 18 Minggu Efektif x 4 JP |
| **TOTAL TAHUNAN** | | | | **144 JP** | 36 Minggu Efektif |`;

    case 'prosem':
      return `# PROGRAM SEMESTER (PROSEM)
**MATA PELAJARAN:** ${profile.subject.toUpperCase()}  
**SATUAN PENDIDIKAN:** ${profile.schoolName}  
**FASE / KELAS:** Fase ${profile.phase} / ${profile.grade}  
**SEMESTER:** ${profile.semester.toUpperCase()} | Tahun Ajaran ${profile.academicYear}  

| No | Tujuan Pembelajaran (TP) | Jml JP | Juli (1-4) | Agustus (1-4) | September (1-4) | Oktober (1-4) | November (1-4) | Desember (1-4) |
|---|---|---|---|---|---|---|---|---|
| 1 | TP 1.1: Bilangan Bulat Positif & Negatif | 16 JP | 4 4 - - | 4 4 - - | - - - - | - - - - | - - - - | - - - - |
| 2 | TP 1.2: Operasi Hitung Campuran & Pecahan | 20 JP | - - 4 4 | - - 4 4 | 4 - - - | - - - - | - - - - | - - - - |
| 3 | TP 2.1: Pengenalan Bentuk & Unsur Aljabar | 12 JP | - - - - | - - - - | - 4 4 4 | - - - - | - - - - | - - - - |
| 4 | Asesmen Sumatif Tengah Semester (STS) | 4 JP | - - - - | - - - - | - - - - | 4 - - - | - - - - | - - - - |
| 5 | TP 2.2: Operasi Hitung Suku Aljabar | 16 JP | - - - - | - - - - | - - - - | - 4 4 4 | 4 - - - | - - - - |
| 6 | Asesmen Sumatif Akhir Semester (SAS) & Rapor | 4 JP | - - - - | - - - - | - - - - | - - - - | - 4 4 4 | 4 4 4 - |

*Keterangan: Setiap pertemuan dialokasikan 4 Jam Pelajaran (JP) per minggu sesuai struktur Kurikulum Merdeka.*`;

    default:
      return `# JURNAL PEMBELAJARAN
**MATA PELAJARAN:** ${profile.subject}  
**KELAS / SEMESTER:** ${profile.grade} / ${profile.semester}  
**SATUAN PENDIDIKAN:** ${profile.schoolName}`;
  }
}
