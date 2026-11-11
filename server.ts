import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { getSampleDocument, DEFAULT_SCHOOL_PROFILE } from './src/data/defaultTemplates.ts';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Health / status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    nodeEnv: process.env.NODE_ENV || 'development',
    time: new Date().toISOString(),
  });
});

// Document Generation Endpoint
app.post('/api/generate-document', async (req, res) => {
  try {
    const {
      documentType = 'modul_ajar',
      subject = 'Matematika',
      grade = 'Kelas VII (Tujuh)',
      phase = 'D',
      topic = 'Operasi Aljabar',
      schoolProfile = DEFAULT_SCHOOL_PROFILE,
      learningModel = 'Problem-Based Learning (PBL)',
      customPrompt = '',
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini API Key is available, invoke Gemini 2.5 Flash
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const systemInstruction = `Anda adalah Asisten Pakar Pengembang Kurikulum dan Administrasi Guru Profesional di Indonesia, menguasai standar Kurikulum Merdeka (Kepmendikbudristek & BSKAP 033/H/KR/2022) serta Kurikulum 2013.
Tugas Anda adalah menghasilkan dokumen administrasi guru yang lengkap, terstruktur, mendalam, praktis, dan siap cetak atau disalin langsung ke Google Docs / Microsoft Word.
Gunakan Bahasa Indonesia formal, rapi, dengan format Markdown terstruktur lengkap (tabel, poin, sub-judul, rubrik). Hindari membuat dokumen terpotong atau singkatan kosong seperti "dll", "..." atau placeholder.`;

        const documentTitles: Record<string, string> = {
          modul_ajar: 'MODUL AJAR KURIKULUM MERDEKA (LENGKAP DENGAN LANGKAH KEGIATAN & ASESMEN)',
          atp: 'ALUR TUJUAN PEMBELAJARAN (ATP) DAN PEMETAAN CP KE TP LENGKAP',
          prota: 'PROGRAM TAHUNAN (PROTA) DENGAN PERHITUNGAN MINGGU EFEKTIF',
          prosem: 'PROGRAM SEMESTER (PROSEM) DISTRIBUSI JAM PER BULAN',
          kktp: 'KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP) PENDEKATAN RUBRIK DESKRIPSI',
          lkpd: 'LEMBAR KERJA PESERTA DIDIK (LKPD) BERBASIS AKTIVITAS PENYELIDIKAN & MASALAH NYATA',
          kisi_soal: 'KISI-KISI SOAL, NASKAH ASESMEN SUMATIF HOTS, KUNCI JAWABAN & RUBRIK PENSKORAN',
          jurnal_mengajar: 'JURNAL AGENDA MENGAJAR HARIAN GURU',
        };

        const targetTitle = documentTitles[documentType] || 'DOKUMEN ADMINISTRASI PEMBELAJARAN';

        const prompt = `Buatlah dokumen **${targetTitle}** untuk:
- Satuan Pendidikan: ${schoolProfile.schoolName || 'SMP NEGERI 1 TELADAN NUSANTARA'}
- Mata Pelajaran: ${subject}
- Fase / Kelas: Fase ${phase} / ${grade}
- Tahun Ajaran / Semester: ${schoolProfile.academicYear || '2025/2026'} / ${schoolProfile.semester || 'Ganjil'}
- Topik / Materi Pembelajaran: ${topic}
- Model Pembelajaran: ${learningModel}
- Guru Pengampu: ${schoolProfile.teacherName || 'Guru Mata Pelajaran'} (NIP: ${schoolProfile.teacherNip || '-'})
- Kepala Sekolah: ${schoolProfile.principalName || 'Kepala Sekolah'} (NIP: ${schoolProfile.principalNip || '-'})
${customPrompt ? `- Instruksi Tambahan: ${customPrompt}` : ''}

Format Dokumen yang Wajib Disajikan:
1. Header Identitas Resmi (Kop Standar Sekolah)
2. Komponen Lengkap sesuai jenis dokumen (Modul Ajar mencakup Informasi Umum, Profil Pelajar Pancasila, Sarana Prasarana, Target Siswa, Komponen Inti: TP, Pemahaman Bermakna, Pertanyaan Pemantik, Kegiatan Pendahuluan-Inti-Penutup, Asesmen Diagnostik-Formatif-Sumatif, Remedial & Pengayaan).
3. Jika ATP/Prota/Prosem/KKTP/Kisi-kisi: Sajikan tabel Markdown yang rapi dengan kolom yang terperinci.
4. Jika LKPD: Berikan petunjuk pengerjaan, stimulus konteks nyata, lembar isian siswa, dan kesimpulan.
5. Jika Kisi-kisi/Soal: Sajikan tabel kisi-kisi dan minimal 5 butir soal HOTS (Pilihan Ganda, PG Kompleks, Uraian) lengkap dengan kunci jawaban serta rubrik penilaian.
6. Bagian Tanda Tangan Resmi Pengesahan di bagian bawah (Mengetahui Kepala Sekolah dan Guru Mata Pelajaran).`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const generatedText = response.text;
        if (generatedText && generatedText.trim().length > 100) {
          return res.json({
            success: true,
            source: 'gemini',
            content: generatedText,
          });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to rich curriculum template:', geminiError?.message || geminiError);
      }
    }

    // Fallback: Return verified rich curriculum template
    const fallbackText = getSampleDocument(documentType, schoolProfile, topic);
    return res.json({
      success: true,
      source: apiKey ? 'template_after_error' : 'offline_template',
      content: fallbackText,
      note: apiKey ? 'Dokumen dibuat dengan templat standar karena respons AI mengalami kendala.' : 'Dokumen dibuat dengan templat standar Kurikulum Merdeka.',
    });
  } catch (error: any) {
    console.error('Error generating document:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Gagal memproses pembuatan dokumen',
    });
  }
});

// Student Descriptor Generator Endpoint
app.post('/api/generate-descriptor', async (req, res) => {
  try {
    const { studentName, subject, finalScore, highCompetency, lowCompetency } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Buatlah 1-2 kalimat narasi deskripsi capaian rapor Kurikulum Merdeka yang ramah, konstruktif, dan sesuai standar rapor untuk:
Nama Siswa: ${studentName}
Mata Pelajaran: ${subject}
Nilai Akhir: ${finalScore}
Kompetensi yang sangat dikuasai: ${highCompetency || 'pemahaman konsep materi dan keaktifan diskusi'}
${lowCompetency ? `Kompetensi yang perlu penguatan: ${lowCompetency}` : ''}
Berikan teks langsung tanpa tanda kutip atau penjelasan tambahan.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const text = response.text?.trim();
        if (text) {
          return res.json({ success: true, descriptor: text });
        }
      } catch (e) {
        console.warn('Gemini descriptor failed, fallback to rule-based:', e);
      }
    }

    // Rule-based fallback
    let desc = '';
    if (finalScore >= 90) {
      desc = `${studentName} menunjukkan penguasaan yang sangat istimewa dalam ${highCompetency || 'tujuan pembelajaran materi pokok'}, serta sangat mandiri dan kritis dalam menyelesaikan tugas.`;
    } else if (finalScore >= 80) {
      desc = `${studentName} menunjukkan penguasaan yang baik dalam ${highCompetency || 'materi pokok yang dipelajari'}. Diharapkan mempertahankan capaian belajarnya.`;
    } else if (finalScore >= 75) {
      desc = `${studentName} telah mencapai kriteria ketuntasan tujuan pembelajaran dalam ${highCompetency || 'materi pokok'}, perlu bimbingan lanjutan pada ${lowCompetency || 'ketelitian latihan'}.`;
    } else {
      desc = `${studentName} memerlukan pendampingan dan latihan intensif dalam ${lowCompetency || 'pemahaman konsep dasar dan pengerjaan soal'}.`;
    }

    res.json({ success: true, descriptor: desc });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Setup dev server with Vite middlewares or production static files
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
