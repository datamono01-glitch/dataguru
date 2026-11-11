import React, { useState } from 'react';
import { BookOpen, Copy, Check, ExternalLink, Sparkles, FileText, Share2, Layers } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CopyPasteGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'panduan' | 'prompts'>('panduan');

  if (!isOpen) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const masterPrompts = [
    {
      title: 'Prompt 1: Generator Modul Ajar Kurikulum Merdeka Lengkap (Deep Learning)',
      desc: 'Menghasilkan Modul Ajar lengkap dengan asesmen diagnostik, formatif, sumatif, diferensiasi konten & proses, serta refleksi.',
      prompt: `Bertindaklah sebagai Pakar Pengembang Kurikulum Merdeka Kemendikbudristek Indonesia.
Buatlah Modul Ajar yang sangat lengkap, mendalam, dan siap digunakan untuk:
- Satuan Pendidikan: [Nama Sekolah Anda]
- Mata Pelajaran: [Mata Pelajaran, misal: Matematika]
- Fase / Kelas: [Fase D / Kelas VII]
- Alokasi Waktu: 2 JP (2 x 40 menit)
- Topik / Materi: [Operasi Bentuk Aljabar Suku Sejenis]
- Model Pembelajaran: Problem-Based Learning (PBL) terintegrasi Pembelajaran Berdiferensiasi

Format dokumen harus mencakup:
1. INFORMASI UMUM: Identitas modul, kompetensi awal, Profil Pelajar Pancasila (Bernalar Kritis, Gotong Royong, Mandiri), Sarana Prasarana, Target Siswa, Model Pembelajaran.
2. KOMPONEN INTI: Tujuan Pembelajaran (TP), Pemahaman Bermakna, Pertanyaan Pemantik, Kegiatan Pembelajaran Berurutan (Pendahuluan 10 menit, Inti 60 menit per fase PBL, Penutup 10 menit).
3. ASESMEN LENGKAP: Asesmen Awal (Diagnostik), Asesmen Formatif (Rubrik Kinerja LKPD), Asesmen Sumatif (5 butir soal HOTS + Kunci + Pedoman Penskoran).
4. REMEDIAL & PENGAYAAN: Skenario bimbingan khusus dan pengayaan menantang.
5. LAMPIRAN: Ringkasan bahan bacaan guru & siswa, LKPD terstruktur, dan Glosarium istilah.
Tuliskan dengan bahasa formal Indonesia, tanpa ada bagian yang disingkat atau placeholder.`,
    },
    {
      title: 'Prompt 2: Generator Alur Tujuan Pembelajaran (ATP) & Analisis CP',
      desc: 'Menganalisis Capaian Pembelajaran (CP) Kemendikbudristek menjadi TP berurutan dan teralokasikan jam pelajaran (JP).',
      prompt: `Bertindaklah sebagai Konsultan Akademik Kurikulum Merdeka.
Buatkan Alur Tujuan Pembelajaran (ATP) lengkap dalam bentuk tabel Markdown untuk:
- Jenjang: [SMP / Fase D]
- Mata Pelajaran: [Ilmu Pengetahuan Alam / IPAS]
- Elemen CP: [Pemahaman IPA & Keterampilan Proses]
- Alokasi Waktu Total: [72 JP per semester]

Sajikan dalam tabel dengan kolom:
1. No
2. Elemen CP
3. Kalimat Capaian Pembelajaran (CP) Asli
4. Tujuan Pembelajaran (TP) Terurai (menggunakan kata kerja operasional Taksonomi Bloom revisi)
5. Lingkup Materi / Materi Pokok
6. Alokasi Waktu (JP)
7. Dimensi Profil Pelajar Pancasila yang Dituju
8. Rencana Asesmen (Formatif & Sumatif)
Sertakan juga rasional urutan alur pembelajaran dari yang konkret ke abstrak.`,
    },
    {
      title: 'Prompt 3: Generator Kisi-kisi & Naskah Soal HOTS + Rubrik Penskoran',
      desc: 'Membuat bank soal asesmen sumatif level C4-C6 dengan stimulus kontekstual dan rubrik penilaian.',
      prompt: `Bertindaklah sebagai Tim Pembuat Soal Asesmen Standar Nasional Indonesia.
Buatkan Paket Soal Asesmen Sumatif Lingkup Materi Kurikulum Merdeka untuk:
- Mata Pelajaran: [Bahasa Indonesia]
- Kelas / Fase: [Kelas IV / Fase B]
- Materi: [Teks Eksplanasi & Teks Narasi]
- Jumlah Soal: 5 Butir (2 Pilihan Ganda Tunggal, 2 Pilihan Ganda Kompleks, 1 Soal Uraian Studi Kasus)

Persyaratan:
1. Setiap soal wajib menyajikan Stimulus Kontekstual berupa teks pendek/cerita/grafik fakta kehidupan nyata.
2. Soal harus berbasis HOTS (Higher Order Thinking Skills - Penalaran C4/C5/C6).
3. Sertakan Kunci Jawaban Resmi dan Pembahasan Lengkap.
4. Sertakan Rubrik Penskoran Analitis untuk soal uraian beserta interval nilainya.`,
    },
    {
      title: 'Prompt 4: Generator Lembar Kerja Peserta Didik (LKPD) Interaktif',
      desc: 'Membuat LKPD kelompok/mandiri dengan alur penemuan konsep dan lembar observasi.',
      prompt: `Bertindaklah sebagai Guru Kreatif dan Inovatif.
Buatkan Lembar Kerja Peserta Didik (LKPD) yang menarik dan interaktif untuk:
- Mata Pelajaran: [Informatika / IPA]
- Fase / Kelas: [Fase E / Kelas X]
- Topik: [Dampak Sosial Informatika & Etika Digital]
- Format: Aktivitas Kelompok Penyelidikan (4-5 siswa)

Struktur LKPD:
1. Judul & Identitas Kelompok (Nama Anggota, Kelas, Tanggal)
2. Petunjuk Belajar
3. Stimulus / Masalah Nyata (Studi Kasus Dilema Berita Hoaks & Keamanan Data)
4. Langkah Kerja & Penyelidikan Terarah
5. Tabel Isian / Lembar Analisis Siswa
6. Pertanyaan Reflektif & Kesimpulan
7. Rubrik Penilaian Antar-Teman / Asesmen Kinerja Kelompok.`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
              <BookOpen className="w-7 h-7 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Panduan Copy-Paste Link AI Studio & Prompt Administrasi Guru</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/40 text-emerald-100 border border-emerald-300/30 font-medium">
                  Tutorial Yefri Haryanto
                </span>
              </div>
              <p className="text-sm text-emerald-100/90 mt-1">
                Langkah praktis menyalin link, prompt master, dan mengintegrasikan hasil AI ke dokumen pembelajaran sekolah.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition"
            aria-label="Tutup Panduan"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('panduan')}
            className={`pb-3 px-4 font-semibold text-sm border-b-2 transition flex items-center gap-2 ${
              activeTab === 'panduan'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            Langkah-Langkah Tutorial
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`pb-3 px-4 font-semibold text-sm border-b-2 transition flex items-center gap-2 ${
              activeTab === 'prompts'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Bank Master Prompt AI Guru (1-Click Copy)
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
          {activeTab === 'panduan' ? (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-emerald-900">
                    Konsep Utama dari Tutorial Blog Yefri Haryanto:
                  </p>
                  <p className="text-emerald-800 mt-1">
                    Guru tidak perlu lagi mengetik perangkat ajar berhari-hari dari nol. Dengan menghubungkan instruksi kurikulum ke 
                    <strong> Google AI Studio</strong> atau generator aplikasi ini, seluruh dokumen (Modul Ajar, ATP, KKTP, Prota, Prosem, Soal HOTS) 
                    dapat dibuat seketika dengan format resmi standar Kemendikbudristek, lalu langsung disalin ke Word atau Google Docs!
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm hover:border-emerald-300 transition">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">1</span>
                    Akses & Siapkan Link AI Studio
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Buka link aplikasi AI Studio ini di browser Anda. Aplikasi ini sudah terhubung dengan server model Gemini 2.5 Flash yang telah dioptimasi khusus untuk struktur kurikulum Indonesia.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm hover:border-emerald-300 transition">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">2</span>
                    Atur Kop Surat & Data Guru
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Klik tombol <strong>"Profil & Kop Sekolah"</strong> di bilah atas. Masukkan nama sekolah, NPSN, nama kepala sekolah, NIP, serta mata pelajaran yang Anda ampu agar tertera otomatis di kop dan lembar pengesahan.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm hover:border-emerald-300 transition">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">3</span>
                    Pilih Dokumen & Klik Generate AI
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pilih menu <strong>"Generator Perangkat Ajar AI"</strong>, tentukan Fase/Kelas, Topik Materi, dan Model Pembelajaran (PBL/PjBL). Klik <strong>"Generate dengan AI"</strong> dan saksikan dokumen terisi secara instan dan mendalam.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm hover:border-emerald-300 transition">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">4</span>
                    Copy-Paste ke Word / Google Docs / Cetak
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Gunakan tombol <strong>"Salin ke Word / Docs"</strong> untuk menempelkan hasil format rapi ke aplikasi pengolah kata favorit Anda, atau klik <strong>"Cetak / Simpan PDF"</strong> untuk format cetak A4 siap arsip supervisi!
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  Tips Menggunakan Prompt di AI Studio Luar (gemini.google.com / aistudio.google.com)
                </h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
                  <li>Buka tab <strong>Bank Master Prompt</strong> di modal ini, lalu klik tombol "Salin Prompt".</li>
                  <li>Buka <code>https://aistudio.google.com</code> atau <code>https://gemini.google.com</code>.</li>
                  <li>Paste ke kolom prompt, gantilah bagian dalam kurung siku <code>[ ... ]</code> sesuai mata pelajaran dan materi Anda.</li>
                  <li>Tekan Run/Enter, lalu salin kembali hasilnya ke Google Docs atau Google Spreadsheet!</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Berikut adalah kumpulan <strong>Master Prompt</strong> standar Kurikulum Merdeka yang dapat langsung Anda salin dan jalankan di AI Studio atau platform AI manapun:
              </p>

              {masterPrompts.map((item, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm hover:border-emerald-300 transition space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(item.prompt, idx)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition shrink-0 ${
                        copiedIndex === idx
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Tersalin!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Salin Prompt
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed max-h-48">
                    {item.prompt}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span>Referensi:</span>
            <a
              href="https://www.yefriharyanto.id"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 font-medium hover:underline flex items-center gap-1"
            >
              yefriharyanto.id <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg shadow-sm transition"
          >
            Tutup & Mulai Gunakan
          </button>
        </div>
      </div>
    </div>
  );
};
