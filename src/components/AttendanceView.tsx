import React, { useState } from 'react';
import { Student, AttendanceRecord, SchoolProfile } from '../types/index.ts';
import { calculateAttendanceSummary, formatAttendanceTag } from '../utils/attendanceStats.ts';
import { Calendar, CheckCircle2, UserCheck, AlertTriangle, Printer, UserPlus } from 'lucide-react';

interface Props {
  students: Student[];
  records: AttendanceRecord[];
  onUpdateRecord: (record: AttendanceRecord) => void;
  onBulkUpdate: (records: AttendanceRecord[]) => void;
  onAddStudent: (name: string, nisn: string, gender: 'L' | 'P') => void;
  profile: SchoolProfile;
}

export const AttendanceView: React.FC<Props> = ({
  students,
  records,
  onUpdateRecord,
  onBulkUpdate,
  onAddStudent,
  profile,
}) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentNisn, setNewStudentNisn] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<'L' | 'P'>('L');

  // Filter records for the selected date
  const dateRecordsMap = new Map<string, AttendanceRecord>();
  records.filter(r => r.date === selectedDate).forEach(r => {
    dateRecordsMap.set(r.studentId, r);
  });

  const handleStatusChange = (studentId: string, status: 'H' | 'S' | 'I' | 'A') => {
    const existing = dateRecordsMap.get(studentId);
    onUpdateRecord({
      id: existing ? existing.id : `att-${selectedDate}-${studentId}`,
      date: selectedDate,
      studentId,
      status,
    });
  };

  const handleMarkAllPresent = () => {
    const newRecords: AttendanceRecord[] = students.map(std => {
      const existing = dateRecordsMap.get(std.id);
      return {
        id: existing ? existing.id : `att-${selectedDate}-${std.id}`,
        date: selectedDate,
        studentId: std.id,
        status: 'H',
      };
    });
    onBulkUpdate(newRecords);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    onAddStudent(newStudentName.trim(), newStudentNisn.trim() || '0000000000', newStudentGender);
    setNewStudentName('');
    setNewStudentNisn('');
    setShowAddModal(false);
  };

  // Calculate overall class summary for the selected date
  const todayRecords = students.map(std => {
    return dateRecordsMap.get(std.id) || { status: 'H' as const };
  });
  const todaySummary = calculateAttendanceSummary(todayRecords);

  return (
    <div className="space-y-6">
      {/* Top Controls & Statistics Banner */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">Tanggal Absensi:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={handleMarkAllPresent}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 transition"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Tandai Semua Hadir (H)
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <UserPlus className="w-4 h-4 text-slate-600" />
            Tambah Siswa
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
              Hadir: {todaySummary.hadir}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-bold">
              Sakit: {todaySummary.sakit}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-bold">
              Izin: {todaySummary.izin}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-bold">
              Alpa: {todaySummary.alpa}
            </span>
          </div>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition print:hidden"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Rekap
          </button>
        </div>
      </div>

      {/* Attendance Sheet Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Formal Kop for Printing */}
        <div className="hidden print:block p-6 text-center border-b border-slate-300 font-serif">
          <h2 className="text-base font-bold uppercase">{profile.schoolName}</h2>
          <p className="text-xs">DAFTAR HADIR / PRESENSI SISWA - KELAS {profile.grade}</p>
          <p className="text-xs text-slate-600">Tanggal: {selectedDate} | Mata Pelajaran: {profile.subject}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700">
                <th className="py-3 px-4 font-bold w-12 text-center">No</th>
                <th className="py-3 px-4 font-bold w-32">NISN</th>
                <th className="py-3 px-4 font-bold">Nama Lengkap Siswa</th>
                <th className="py-3 px-4 font-bold w-16 text-center">L/P</th>
                <th className="py-3 px-4 font-bold text-center w-72">Status Presensi Hari Ini</th>
                <th className="py-3 px-4 font-bold text-center w-40">Rekap Total & Persentase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {students.map((student, idx) => {
                const currentRecord = dateRecordsMap.get(student.id);
                const currentStatus = currentRecord?.status || 'H';

                // Calculate cumulative attendance for this student across all recorded dates
                const studentHistory = records.filter(r => r.studentId === student.id);
                const summary = calculateAttendanceSummary(
                  studentHistory.length > 0 ? studentHistory : [{ status: currentStatus }]
                );

                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 text-center font-medium text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{student.nisn}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{student.name}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        student.gender === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                      }`}>
                        {student.gender}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex rounded-lg border border-slate-300 p-0.5 bg-slate-50">
                        {(['H', 'S', 'I', 'A'] as const).map(statusKey => {
                          const tag = formatAttendanceTag(statusKey);
                          const isSelected = currentStatus === statusKey;
                          return (
                            <button
                              key={statusKey}
                              type="button"
                              onClick={() => handleStatusChange(student.id, statusKey)}
                              className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                                isSelected
                                  ? `${tag.bg} ${tag.text} shadow-xs`
                                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
                              }`}
                            >
                              {statusKey} ({tag.label})
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-bold text-slate-800 text-xs">
                          {summary.attendancePercentage}%
                        </span>
                        {summary.isAtRisk && (
                          <span
                            title="Tingkat kehadiran di bawah 80% atau Alpa >= 3 kali"
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold"
                          >
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            Perlu Perhatian
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-600" />
              Tambah Siswa Baru ke Kelas
            </h3>
            <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={e => setNewStudentName(e.target.value)}
                  placeholder="Contoh: Muhammad Farhan"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">NISN (10 Digit)</label>
                <input
                  type="text"
                  value={newStudentNisn}
                  onChange={e => setNewStudentNisn(e.target.value)}
                  placeholder="Contoh: 0081234579"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                <select
                  value={newStudentGender}
                  onChange={e => setNewStudentGender(e.target.value as 'L' | 'P')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                >
                  <option value="L">Laki-laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-xs"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
