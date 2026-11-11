import React, { useState } from 'react';
import { Student, StudentGradeRecord, SchoolProfile } from '../types/index.ts';
import {
  calculateFinalGrade,
  getPredicate,
  getPredicateLabel,
  generateCompetencyDescriptor,
  calculateClassStatistics,
} from '../utils/gradeCalculator.ts';
import { Award, Sparkles, Download, Printer, CheckCircle, BarChart3, Edit3 } from 'lucide-react';

interface Props {
  students: Student[];
  grades: StudentGradeRecord[];
  onUpdateGrade: (updated: StudentGradeRecord) => void;
  profile: SchoolProfile;
}

export const GradesView: React.FC<Props> = ({
  students,
  grades,
  onUpdateGrade,
  profile,
}) => {
  const [selectedStudentForDesc, setSelectedStudentForDesc] = useState<string | null>(null);
  const [aiGeneratingId, setAiGeneratingId] = useState<string | null>(null);

  // Map studentId -> StudentGradeRecord
  const gradesMap = new Map<string, StudentGradeRecord>();
  grades.forEach(g => gradesMap.set(g.studentId, g));

  const handleScoreChange = (
    studentId: string,
    category: 'formatif' | 'sumatif',
    field: string,
    val: string
  ) => {
    const num = val === '' ? undefined : Math.min(100, Math.max(0, Number(val)));
    const current = gradesMap.get(studentId) || {
      studentId,
      formatif: {},
      sumatif: {},
    };

    const updatedFormatif = {
      ...current.formatif,
      ...(category === 'formatif' ? { [field]: num } : {}),
    };
    const updatedSumatif = {
      ...current.sumatif,
      ...(category === 'sumatif' ? { [field]: num } : {}),
    };

    const finalScore = calculateFinalGrade(updatedFormatif, updatedSumatif);
    const predicate = getPredicate(finalScore, profile.kkmThreshold);

    onUpdateGrade({
      ...current,
      formatif: updatedFormatif,
      sumatif: updatedSumatif,
      finalScore,
      predicate,
    });
  };

  const handleGenerateAIDescriptor = async (studentId: string, studentName: string) => {
    setAiGeneratingId(studentId);
    const record = gradesMap.get(studentId);
    const finalScore = record?.finalScore || 80;

    try {
      const res = await fetch('/api/generate-descriptor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          subject: profile.subject,
          finalScore,
          highCompetency: 'operasi aljabar dan penalaran matematis',
          lowCompetency: finalScore < 75 ? 'latihan soal terstruktur aljabar' : undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.descriptor) {
        onUpdateGrade({
          ...record!,
          studentId,
          formatif: record?.formatif || {},
          sumatif: record?.sumatif || {},
          descriptor: data.descriptor,
        });
      }
    } catch (e) {
      // Fallback to rule-based generator
      const ruleDesc = generateCompetencyDescriptor(studentName, profile.subject, finalScore);
      onUpdateGrade({
        ...record!,
        studentId,
        formatif: record?.formatif || {},
        sumatif: record?.sumatif || {},
        descriptor: ruleDesc,
      });
    } finally {
      setAiGeneratingId(null);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'No',
      'NISN',
      'Nama Siswa',
      'L/P',
      'TP1',
      'TP2',
      'TP3',
      'TP4',
      'LM1',
      'LM2',
      'STS',
      'SAS',
      'Nilai Akhir',
      'Predikat',
      'Deskripsi Capaian Rapor',
    ];

    const rows = students.map((std, idx) => {
      const rec = gradesMap.get(std.id);
      return [
        idx + 1,
        `"${std.nisn}"`,
        `"${std.name}"`,
        std.gender,
        rec?.formatif.tp1 ?? '',
        rec?.formatif.tp2 ?? '',
        rec?.formatif.tp3 ?? '',
        rec?.formatif.tp4 ?? '',
        rec?.sumatif.lm1 ?? '',
        rec?.sumatif.lm2 ?? '',
        rec?.sumatif.sts ?? '',
        rec?.sumatif.sas ?? '',
        rec?.finalScore ?? '',
        rec?.predicate ?? '',
        `"${rec?.descriptor?.replace(/"/g, '""') || ''}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Leger_Nilai_${profile.subject}_${profile.grade}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Class Statistics
  const allFinalScores = students
    .map(std => gradesMap.get(std.id)?.finalScore)
    .filter((s): s is number => typeof s === 'number' && s > 0);
  const stats = calculateClassStatistics(allFinalScores, profile.kkmThreshold);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Rata-Rata Kelas</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats.average}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">KKM / KKTP: {profile.kkmThreshold}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Nilai Tertinggi</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{stats.highest}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Pencapaian Terbaik</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Nilai Terendah</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{stats.lowest}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Perlu Remedial</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ketuntasan Siswa</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{stats.passPercentage}%</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{stats.passCount} Tuntas / {stats.failCount} Bimbingan</p>
        </div>

        <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 flex flex-col justify-between col-span-2 md:col-span-1">
          <div>
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Tindakan Cepat</span>
            <p className="text-xs text-emerald-900 mt-0.5 font-medium">Ekspor Leger Nilai</p>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleExportCSV}
              className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              CSV Excel
            </button>
            <button
              onClick={() => window.print()}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak
            </button>
          </div>
        </div>
      </div>

      {/* Grade Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Leger & Pengolahan Nilai Asesmen Kurikulum Merdeka
            </h3>
          </div>
          <span className="text-xs text-slate-500 italic">
            Formatif (Bobot 40%) | Sumatif LM, STS, SAS (Bobot 60%)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                <th rowSpan={2} className="py-2.5 px-3 font-bold w-10 text-center border-r border-slate-200">No</th>
                <th rowSpan={2} className="py-2.5 px-3 font-bold border-r border-slate-200 min-w-44">Nama Siswa</th>
                <th colSpan={4} className="py-1.5 px-2 font-bold text-center bg-blue-50/70 border-r border-slate-200 text-blue-900">
                  Formatif (TP)
                </th>
                <th colSpan={4} className="py-1.5 px-2 font-bold text-center bg-teal-50/70 border-r border-slate-200 text-teal-900">
                  Sumatif (LM & Tes)
                </th>
                <th rowSpan={2} className="py-2.5 px-2 font-bold text-center bg-emerald-50 text-emerald-950 border-r border-slate-200 w-16">
                  NA
                </th>
                <th rowSpan={2} className="py-2.5 px-2 font-bold text-center border-r border-slate-200 w-12">
                  Pred
                </th>
                <th rowSpan={2} className="py-2.5 px-3 font-bold min-w-64">
                  Deskripsi Capaian Rapor (AI Generator)
                </th>
              </tr>
              <tr className="bg-slate-100 text-slate-600 border-b border-slate-300 text-[11px]">
                <th className="py-1 px-1.5 text-center bg-blue-50/70 border-r border-slate-200">TP1</th>
                <th className="py-1 px-1.5 text-center bg-blue-50/70 border-r border-slate-200">TP2</th>
                <th className="py-1 px-1.5 text-center bg-blue-50/70 border-r border-slate-200">TP3</th>
                <th className="py-1 px-1.5 text-center bg-blue-50/70 border-r border-slate-200">TP4</th>
                <th className="py-1 px-1.5 text-center bg-teal-50/70 border-r border-slate-200">LM1</th>
                <th className="py-1 px-1.5 text-center bg-teal-50/70 border-r border-slate-200">LM2</th>
                <th className="py-1 px-1.5 text-center bg-teal-50/70 border-r border-slate-200">STS</th>
                <th className="py-1 px-1.5 text-center bg-teal-50/70 border-r border-slate-200">SAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {students.map((std, idx) => {
                const rec = gradesMap.get(std.id);
                const formatif = rec?.formatif || {};
                const sumatif = rec?.sumatif || {};
                const finalScore = rec?.finalScore ?? 0;
                const predicate = rec?.predicate ?? '-';
                const descriptor = rec?.descriptor || '';

                return (
                  <tr key={std.id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3 text-center text-slate-500 border-r border-slate-200">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 border-r border-slate-200">
                      <div>{std.name}</div>
                      <span className="text-[10px] text-slate-400 font-mono">NISN: {std.nisn}</span>
                    </td>

                    {/* Formatif inputs */}
                    {(['tp1', 'tp2', 'tp3', 'tp4'] as const).map(k => (
                      <td key={k} className="p-1 border-r border-slate-200 text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={formatif[k] ?? ''}
                          onChange={e => handleScoreChange(std.id, 'formatif', k, e.target.value)}
                          className="w-12 text-center py-1 text-xs border border-slate-200 rounded focus:border-emerald-500 focus:outline-none"
                        />
                      </td>
                    ))}

                    {/* Sumatif inputs */}
                    {(['lm1', 'lm2', 'sts', 'sas'] as const).map(k => (
                      <td key={k} className="p-1 border-r border-slate-200 text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={sumatif[k] ?? ''}
                          onChange={e => handleScoreChange(std.id, 'sumatif', k, e.target.value)}
                          className="w-12 text-center py-1 text-xs border border-slate-200 rounded focus:border-emerald-500 focus:outline-none"
                        />
                      </td>
                    ))}

                    {/* Nilai Akhir & Predikat */}
                    <td className="py-2.5 px-2 text-center font-bold text-slate-900 bg-emerald-50/50 border-r border-slate-200">
                      {finalScore > 0 ? finalScore : '-'}
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold border-r border-slate-200">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        predicate === 'A' ? 'bg-emerald-100 text-emerald-800' :
                        predicate === 'B' ? 'bg-blue-100 text-blue-800' :
                        predicate === 'C' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {predicate}
                      </span>
                    </td>

                    {/* Deskripsi Capaian */}
                    <td className="py-2 px-3">
                      <div className="flex items-start gap-2">
                        <p className="text-[11px] text-slate-700 leading-snug flex-1">
                          {descriptor || (
                            <span className="text-slate-400 italic">
                              Belum ada deskripsi rapor. Klik tombol AI di samping untuk generate otomatis.
                            </span>
                          )}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleGenerateAIDescriptor(std.id, std.name)}
                          disabled={aiGeneratingId === std.id}
                          className="px-2 py-1 text-[10px] font-bold rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1 shrink-0 transition"
                          title="Generate Deskripsi Rapor dengan AI"
                        >
                          <Sparkles className={`w-3 h-3 text-emerald-600 ${aiGeneratingId === std.id ? 'animate-spin' : ''}`} />
                          <span>AI Deskripsi</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
