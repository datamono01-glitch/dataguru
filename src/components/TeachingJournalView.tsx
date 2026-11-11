import React, { useState } from 'react';
import { TeachingJournalEntry, SchoolProfile } from '../types/index.ts';
import { BookOpenCheck, Plus, Printer, CheckCircle, Trash2, Calendar } from 'lucide-react';

interface Props {
  entries: TeachingJournalEntry[];
  onAddEntry: (entry: TeachingJournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  profile: SchoolProfile;
}

export const TeachingJournalView: React.FC<Props> = ({
  entries,
  onAddEntry,
  onDeleteEntry,
  profile,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [period, setPeriod] = useState('1 - 2 (07.00 - 08.20)');
  const [classGroup, setClassGroup] = useState('VII-A');
  const [topic, setTopic] = useState('');
  const [learningActivities, setLearningActivities] = useState('');
  const [attendancePresent, setAttendancePresent] = useState(32);
  const [attendanceAbsent, setAttendanceAbsent] = useState(0);
  const [obstacles, setObstacles] = useState('');
  const [followUp, setFollowUp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    onAddEntry({
      id: `jrn-${Date.now()}`,
      date,
      period,
      classGroup,
      subject: profile.subject,
      topic: topic.trim(),
      learningActivities: learningActivities.trim() || 'Aktivitas pembelajaran sesuai skenario modul ajar.',
      attendancePresent: Number(attendancePresent),
      attendanceAbsent: Number(attendanceAbsent),
      obstacles: obstacles.trim() || 'Pembelajaran terlaksana dengan tertib dan lancar.',
      followUp: followUp.trim() || 'Melanjutkan ke indikator tujuan pembelajaran berikutnya.',
    });

    setTopic('');
    setLearningActivities('');
    setObstacles('');
    setFollowUp('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-emerald-600" />
            Agenda & Jurnal Mengajar Harian Guru
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Catatan terlaksananya pembelajaran, kehadiran siswa, hambatan, serta rencana tindak lanjut per pertemuan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Tambah Jurnal Baru
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition print:hidden"
          >
            <Printer className="w-4 h-4" />
            Cetak Jurnal
          </button>
        </div>
      </div>

      {/* Journal Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Printable Kop */}
        <div className="hidden print:block p-6 text-center border-b border-slate-300 font-serif">
          <h2 className="text-base font-bold uppercase">{profile.schoolName}</h2>
          <p className="text-xs">JURNAL AGENDA MENGAJAR GURU - SEMESTER {profile.semester.toUpperCase()}</p>
          <p className="text-xs text-slate-600">Guru: {profile.teacherName} (NIP. {profile.teacherNip}) | Mapel: {profile.subject}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="py-3 px-3 font-bold w-10 text-center">No</th>
                <th className="py-3 px-3 font-bold w-28">Hari / Tgl</th>
                <th className="py-3 px-3 font-bold w-20">Jam Ke-</th>
                <th className="py-3 px-3 font-bold w-16">Kelas</th>
                <th className="py-3 px-4 font-bold min-w-48">Materi & Aktivitas Pembelajaran</th>
                <th className="py-3 px-3 font-bold w-28 text-center">Kehadiran</th>
                <th className="py-3 px-4 font-bold min-w-44">Kendala & Solusi Tindak Lanjut</th>
                <th className="py-3 px-2 font-bold w-12 text-center print:hidden">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {entries.map((entry, idx) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 text-center text-slate-500 font-medium">{idx + 1}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">
                    {new Date(entry.date).toLocaleDateString('id-ID', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3 px-3 text-slate-700">{entry.period}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{entry.classGroup}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 mb-0.5">{entry.topic}</p>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{entry.learningActivities}</p>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-emerald-700 font-bold block">{entry.attendancePresent} Hadir</span>
                    {entry.attendanceAbsent > 0 && (
                      <span className="text-rose-600 text-[10px] block font-medium">{entry.attendanceAbsent} Absen</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[11px]">
                    <p className="text-slate-800"><span className="font-semibold text-slate-600">Kendala:</span> {entry.obstacles}</p>
                    <p className="text-emerald-800 mt-1"><span className="font-semibold text-emerald-900">Tindak Lanjut:</span> {entry.followUp}</p>
                  </td>
                  <td className="py-3 px-2 text-center print:hidden">
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                      title="Hapus baris jurnal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Journal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 my-8">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              Catat Agenda & Jurnal Mengajar Harian
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Pertemuan</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelas</label>
                  <input
                    type="text"
                    required
                    value={classGroup}
                    onChange={e => setClassGroup(e.target.value)}
                    placeholder="VII-A"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jam Pelajaran Ke-</label>
                <input
                  type="text"
                  value={period}
                  onChange={e => setPeriod(e.target.value)}
                  placeholder="Contoh: 1 - 2 (07.00 - 08.20)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Materi Pokok / Topik Pembelajaran</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="Contoh: Operasi Penjumlahan Aljabar Suku Sejenis"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Aktivitas / Kegiatan Pembelajaran Terlaksana</label>
                <textarea
                  rows={2}
                  value={learningActivities}
                  onChange={e => setLearningActivities(e.target.value)}
                  placeholder="Deskripsi singkat model atau tahapan belajar siswa..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jumlah Hadir (Siswa)</label>
                  <input
                    type="number"
                    min={0}
                    value={attendancePresent}
                    onChange={e => setAttendancePresent(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jumlah Absen (Siswa)</label>
                  <input
                    type="number"
                    min={0}
                    value={attendanceAbsent}
                    onChange={e => setAttendanceAbsent(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hambatan / Kendala yang Terjadi</label>
                <input
                  type="text"
                  value={obstacles}
                  onChange={e => setObstacles(e.target.value)}
                  placeholder="Contoh: Beberapa siswa kesulitan membedakan suku tidak sejenis"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rencana Tindak Lanjut</label>
                <input
                  type="text"
                  value={followUp}
                  onChange={e => setFollowUp(e.target.value)}
                  placeholder="Contoh: Diberikan lembar latihan scaffolding pada pertemuan berikutnya"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-1.5 border border-slate-300 text-slate-700 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-xs"
                >
                  Simpan Jurnal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
