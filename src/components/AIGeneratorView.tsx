import React, { useState } from 'react';
import { SchoolProfile, DocumentType } from '../types/index.ts';
import { getSampleDocument } from '../data/defaultTemplates.ts';
import { DocumentPreview } from './DocumentPreview.tsx';
import { Sparkles, FileText, CheckCircle2, RefreshCw, Wand2, BookOpen, AlertCircle } from 'lucide-react';

interface Props {
  profile: SchoolProfile;
}

export const AIGeneratorView: React.FC<Props> = ({ profile }) => {
  const [docType, setDocType] = useState<DocumentType>('modul_ajar');
  const [subject, setSubject] = useState(profile.subject);
  const [grade, setGrade] = useState(profile.grade);
  const [phase, setPhase] = useState(profile.phase);
  const [topic, setTopic] = useState('Operasi Aljabar dan Persamaan Linear');
  const [learningModel, setLearningModel] = useState('Problem-Based Learning (PBL)');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>(() =>
    getSampleDocument('modul_ajar', profile, 'Operasi Aljabar dan Persamaan Linear')
  );
  const [lastSource, setLastSource] = useState<'gemini' | 'template' | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Sync profile defaults if profile updates
  React.useEffect(() => {
    setSubject(profile.subject);
    setGrade(profile.grade);
    setPhase(profile.phase);
  }, [profile]);

  const documentOptions: { id: DocumentType; label: string; badge: string; desc: string }[] = [
    {
      id: 'modul_ajar',
      label: 'Modul Ajar / RPP Plus',
      badge: 'Lengkap',
      desc: 'Mencakup Profil Pancasila, TP, apersepsi, skenario PBL, asesmen diagnostik & sumatif.',
    },
    {
      id: 'atp',
      label: 'Alur Tujuan Pembelajaran (ATP)',
      badge: 'Tabel CP',
      desc: 'Pemetaan Capaian Pembelajaran (CP) ke TP bertahap dan alokasi JP.',
    },
    {
      id: 'kktp',
      label: 'Kriteria KKTP & Rubrik',
      badge: 'Asesmen',
      desc: 'Rubrik kriteria ketuntasan 4 interval (Perlu Bimbingan s.d Sangat Baik).',
    },
    {
      id: 'lkpd',
      label: 'Lembar Kerja Peserta Didik (LKPD)',
      badge: 'Interaktif',
      desc: 'Lembar aktivitas penyelidikan kelompok dengan stimulus masalah kontekstual.',
    },
    {
      id: 'kisi_soal',
      label: 'Kisi-Kisi & Soal HOTS',
      badge: 'Sumatif',
      desc: 'Soal PG, PG Kompleks, Uraian level C4-C6 lengkap kunci dan pedoman skor.',
    },
    {
      id: 'prota',
      label: 'Program Tahunan (Prota)',
      badge: '1 Tahun',
      desc: 'Distribusi materi dan alokasi JP efektif selama Semester Ganjil & Genap.',
    },
    {
      id: 'prosem',
      label: 'Program Semester (Prosem)',
      badge: 'Matriks',
      desc: 'Matriks pemetaan materi per minggu dan bulan dalam satu semester.',
    },
  ];

  const quickTopics: Record<string, string[]> = {
    Matematika: [
      'Operasi Aljabar dan Persamaan Linear',
      'Bilangan Bulat dan Pecahan Rasional',
      'Teorema Pythagoras dan Tripel Pythagoras',
      'Statistika, Mean, Median dan Modus',
      'Transformasi Geometri (Refleksi, Rotasi)',
    ],
    'Bahasa Indonesia': [
      'Teks Laporan Hasil Observasi (LHO)',
      'Teks Eksplanasi Fenomena Alam dan Sosial',
      'Menulis Puisi dengan Gaya Bahasa Majas',
      'Teks Prosedur Kompleks dalam Kehidupan Sehari-hari',
    ],
    'Ilmu Pengetahuan Alam': [
      'Struktur dan Fungsi Sel Hewan serta Tumbuhan',
      'Ekosistem dan Interaksi Antarmakhluk Hidup',
      'Zat Aditif dan Zat Adiktif dalam Makanan',
      'Listrik Dinamis dan Energi Terbarukan',
    ],
    Informatika: [
      'Berpikir Komputasional & Dekomposisi Masalah',
      'Algoritma Pemrograman Sederhana',
      'Dampak Sosial Informatika & Etika Berinternet',
      'Pengolahan Data dengan Spreadsheet',
    ],
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStatusMessage('Menghubungkan ke AI Studio Gemini untuk merancang dokumen...');

    try {
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: docType,
          subject,
          grade,
          phase,
          topic,
          schoolProfile: profile,
          learningModel,
          customPrompt,
        }),
      });

      const data = await response.json();
      if (data.success && data.content) {
        setGeneratedContent(data.content);
        setLastSource(data.source === 'gemini' ? 'gemini' : 'template');
        setStatusMessage(
          data.source === 'gemini'
            ? 'Dokumen berhasil di-generate secara real-time oleh model Gemini 2.5 Flash!'
            : (data.note || 'Dokumen berhasil disusun menggunakan standar kurikulum nasional.')
        );
      } else {
        throw new Error(data.error || 'Respon generator tidak valid');
      }
    } catch (err: any) {
      console.warn('Fallback to local document template:', err);
      const fallback = getSampleDocument(docType, profile, topic);
      setGeneratedContent(fallback);
      setLastSource('template');
      setStatusMessage('Menggunakan template standar kurikulum (mode offline aman).');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Generator Form Controls */}
      <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-5">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-emerald-600" />
              Generator Dokumen Pembelajaran AI
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              Kurikulum Merdeka
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pilih jenis dokumen, mata pelajaran, dan topik. AI akan menyusun dokumen berstruktur lengkap.
          </p>
        </div>

        {/* 1. Document Type Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            1. Jenis Dokumen Administrasi
          </label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
            {documentOptions.map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setDocType(opt.id)}
                className={`p-2.5 rounded-xl border text-left transition flex items-start justify-between gap-2 ${
                  docType === opt.id
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${docType === opt.id ? 'text-emerald-900' : 'text-slate-800'}`}>
                      {opt.label}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {opt.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{opt.desc}</p>
                </div>
                {docType === opt.id && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Subject, Grade, Phase */}
        <div className="grid grid-cols-3 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Kelas</label>
            <input
              type="text"
              value={grade}
              onChange={e => setGrade(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Fase</label>
            <select
              value={phase}
              onChange={e => setPhase(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="A">Fase A (SD 1-2)</option>
              <option value="B">Fase B (SD 3-4)</option>
              <option value="C">Fase C (SD 5-6)</option>
              <option value="D">Fase D (SMP 7-9)</option>
              <option value="E">Fase E (SMA 10)</option>
              <option value="F">Fase F (SMA 11-12)</option>
            </select>
          </div>
        </div>

        {/* 3. Topic & Quick Suggestions */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            2. Topik / Materi Pokok Pembelajaran
          </label>
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="Contoh: Operasi Aljabar, Ekosistem, Cerita Pendek"
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium text-slate-800"
          />

          {quickTopics[subject] && (
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="text-[10px] text-slate-400 self-center mr-1">Rekomendasi:</span>
              {quickTopics[subject].slice(0, 3).map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTopic(item)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-600 transition"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. Model Pembelajaran */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Model Pembelajaran
          </label>
          <select
            value={learningModel}
            onChange={e => setLearningModel(e.target.value)}
            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="Problem-Based Learning (PBL)">Problem-Based Learning (PBL) - Pemecahan Masalah</option>
            <option value="Project-Based Learning (PjBL)">Project-Based Learning (PjBL) - Proyek Karya</option>
            <option value="Discovery Learning">Discovery Learning - Penemuan Konsep</option>
            <option value="Inquiry Learning">Inquiry Learning - Penyelidikan Ilmiah</option>
            <option value="Differentiated Learning">Pembelajaran Berdiferensiasi (Konten & Proses)</option>
          </select>
        </div>

        {/* 5. Custom extra prompt */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Instruksi Khusus / Tambahan (Opsional)
          </label>
          <textarea
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            rows={2}
            placeholder="Contoh: Fokuskan contoh pada kearifan lokal daerah, tambahkan 1 permainan ice-breaking..."
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Generate Action Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className="w-full py-3 px-4 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-800 hover:to-teal-800 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Sedang Merancang Dokumen dengan AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Generate Dokumen dengan AI</span>
            </>
          )}
        </button>
      </div>

      {/* Right Column: Interactive Document Preview */}
      <div className="lg:col-span-7 h-[780px]">
        <DocumentPreview
          content={generatedContent}
          profile={profile}
          documentTitle={documentOptions.find(d => d.id === docType)?.label || 'Dokumen Administrasi'}
          onUpdateContent={setGeneratedContent}
        />
      </div>
    </div>
  );
};
