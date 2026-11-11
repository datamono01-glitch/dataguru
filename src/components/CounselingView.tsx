import React, { useState } from 'react';
import { CounselingCaseEntry, SchoolProfile } from '../types/index.ts';
import { ShieldAlert, Plus, Printer, CheckCircle2, Clock, Trash2 } from 'lucide-react';

interface Props {
  entries: CounselingCaseEntry[];
  onAddEntry: (entry: CounselingCaseEntry) => void;
  onUpdateStatus: (id: string, status: 'Diproses' | 'Selesai' | 'Tindak Lanjut BK') => void;
  onDeleteEntry: (id: string) => void;
  profile: SchoolProfile;
}

export const CounselingView: React.FC<Props> = ({
  entries,
  onAddEntry,
  onUpdateStatus,
  onDeleteEntry,
  profile,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [studentName, setStudentName] = useState('');
  const [classGroup, setClassGroup] = useState(profile.grade);
  const [incidentType, setIncidentType] = useState<CounselingCaseEntry['incidentType']>('Akademik');
  const [description, setDescription] = useState('');
  const [handlingAction, setHandlingAction] = useState('');
  const [followUp, setFollowUp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !description.trim()) return;

    onAddEntry({
      id: `case-${Date.now()}`,
      date,
      studentName: studentName.trim(),
      classGroup: classGroup.trim(),
      incidentType,
      description: description.trim(),
      handlingAction: handlingAction.trim() || 'Wawancara klarifikasi dan pembinaan suportif.',
      followUp: followUp.trim() || 'Pemantauan perkembangan sikap dalam dua pekan ke depan.',
      status: 'Diproses',
    });

    setStudentName('');
    setDescription('');
    setHandlingAction('');
    setFollowUp('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-600" />
            Buku Catatan Kasus & Bimbingan Siswa (Wali Kelas / BK)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pencatatan pembinaan kedisiplinan, akademik, dan pendampingan karakter peserta didik secara rahasia dan profesional.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Catat Kasus Baru
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition print:hidden"
          >
            <Printer className="w-4 h-4" />
            Cetak Rekap
          </button>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Printable Kop */}
        <div className="hidden print:block p-6 text-center border-b border-slate-300 font-serif">
          <h2 className="text-base font-bold uppercase">{profile.schoolName}</h2>
          <p className="text-xs">BUKU CATATAN PEMBINAAN & KASUS SISWA</p>
          <p className="text-xs text-slate-600">Wali Kelas / Guru Pengampu: {profile.teacherName} | Tahun Ajaran: {profile.academicYear}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="py-3 px-3 font-bold w-10 text-center">No</th>
                <th className="py-3 px-3 font-bold w-24">Tanggal</th>
                <th className="py-3 px-3 font-bold w-40">Nama Siswa / Rombel</th>
                <th className="py-3 px-3 font-bold w-28">Kategori</th>
                <th className="py-3 px-4 font-bold min-w-44">Uraian Masalah / Kasus</th>
                <th className="py-3 px-4 font-bold min-w-44">Tindakan Penanganan & Solusi</th>
                <th className="py-3 px-3 font-bold w-32 text-center">Status</th>
                <th className="py-3 px-2 font-bold w-12 text-center print:hidden">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {entries.map((entry, idx) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 text-center text-slate-500 font-medium">{idx + 1}</td>
                  <td className="py-3 px-3 text-slate-700 font-medium whitespace-nowrap">
                    {new Date(entry.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-900">{entry.studentName}</p>
                    <p className="text-[10px] text-slate-500">{entry.classGroup}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {entry.incidentType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed text-[11px]">
                    {entry.description}
                  </td>
                  <td className="py-3 px-4 text-[11px]">
                    <p className="text-slate-800 font-medium">{entry.handlingAction}</p>
                    <p className="text-emerald-800 text-[10px] mt-0.5">Tindak Lanjut: {entry.followUp}</p>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <select
                      value={entry.status}
                      onChange={e => onUpdateStatus(entry.id, e.target.value as any)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border focus:outline-none ${
                        entry.status === 'Selesai'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : entry.status === 'Diproses'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-blue-50 text-blue-800 border-blue-300'
                      }`}
                    >
                      <option value="Diproses">Diproses</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Tindak Lanjut BK">Tindak Lanjut BK</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 text-center print:hidden">
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                      title="Hapus catatan"
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

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 my-8">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              Catat Kasus / Pembinaan Siswa Baru
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Kejadian</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori Kasus</label>
                  <select
                    value={incidentType}
                    onChange={e => setIncidentType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-xs"
                  >
                    <option value="Kedisiplinan">Kedisiplinan (Keterlambatan, Seragam)</option>
                    <option value="Akademik">Akademik (Tugas, KKM, Nilai Rendah)</option>
                    <option value="Sosial/Perilaku">Sosial/Perilaku (Relasi Teman, Gadget)</option>
                    <option value="Kehadiran">Kehadiran (Alpa, Bolos)</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Siswa</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    placeholder="Contoh: Dimas Arya"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelas / Rombel</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Uraian Masalah / Deskripsi Kejadian</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Uraikan apa yang terjadi secara objektif..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tindakan Penanganan yang Diberikan</label>
                <input
                  type="text"
                  value={handlingAction}
                  onChange={e => setHandlingAction(e.target.value)}
                  placeholder="Contoh: Wawancara klarifikasi dan pembinaan personal"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rencana Tindak Lanjut / Kolaborasi Orang Tua</label>
                <input
                  type="text"
                  value={followUp}
                  onChange={e => setFollowUp(e.target.value)}
                  placeholder="Contoh: Komunikasi via WhatsApp dengan orang tua dan evaluasi 1 pekan"
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
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
