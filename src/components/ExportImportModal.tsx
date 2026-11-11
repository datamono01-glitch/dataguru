import React, { useRef, useState } from 'react';
import { SchoolProfile, Student, AttendanceRecord, StudentGradeRecord, TeachingJournalEntry, CounselingCaseEntry } from '../types/index.ts';
import { Download, Upload, RefreshCw, FileSpreadsheet, Check, AlertCircle, Database } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  fullData: {
    profile: SchoolProfile;
    students: Student[];
    records: AttendanceRecord[];
    grades: StudentGradeRecord[];
    journals: TeachingJournalEntry[];
    cases: CounselingCaseEntry[];
  };
  onRestoreData: (restored: any) => void;
  onImportStudents: (newStudents: Student[]) => void;
  onResetDefault: () => void;
}

export const ExportImportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  fullData,
  onRestoreData,
  onImportStudents,
  onResetDefault,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. Export JSON Backup
  const handleExportBackup = () => {
    const payload = JSON.stringify(fullData, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_Administrasi_Guru_${fullData.profile.subject}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccessMsg('File cadangan database berhasil diunduh!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // 2. Restore JSON Backup
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.profile && Array.isArray(parsed.students)) {
          onRestoreData(parsed);
          setSuccessMsg('Data administrasi berhasil dipulihkan dari cadangan!');
          setTimeout(() => {
            setSuccessMsg(null);
            onClose();
          }, 1500);
        } else {
          throw new Error('Format file cadangan tidak sesuai.');
        }
      } catch (err: any) {
        setErrorMsg('Gagal membaca file: ' + err.message);
        setTimeout(() => setErrorMsg(null), 3500);
      }
    };
    reader.readAsText(file);
  };

  // 3. Download Student CSV Template
  const handleDownloadCsvTemplate = () => {
    const csv = 'NISN,Nama Siswa,Jenis Kelamin (L/P)\n0081234501,Ahmad Fadhilah,L\n0081234502,Bunga Citra Lestari,P\n0081234503,Dian Sastro,P';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Template_Daftar_Siswa.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // 4. Import Students CSV
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        const newStudents: Student[] = [];

        // skip header if line 0 contains NISN
        const startIndex = lines[0].toLowerCase().includes('nisn') ? 1 : 0;
        for (let i = startIndex; i < lines.length; i++) {
          const parts = lines[i].split(',').map(p => p.trim().replace(/^"|"$/g, ''));
          if (parts.length >= 2) {
            newStudents.push({
              id: `std-imp-${Date.now()}-${i}`,
              nisn: parts[0] || '0000000000',
              name: parts[1],
              gender: parts[2]?.toUpperCase() === 'P' ? 'P' : 'L',
            });
          }
        }

        if (newStudents.length > 0) {
          onImportStudents(newStudents);
          setSuccessMsg(`Berhasil mengimpor ${newStudents.length} siswa baru!`);
          setTimeout(() => {
            setSuccessMsg(null);
            onClose();
          }, 1500);
        } else {
          throw new Error('Tidak ada data siswa yang valid ditemukan.');
        }
      } catch (err: any) {
        setErrorMsg('Gagal memproses file CSV: ' + err.message);
        setTimeout(() => setErrorMsg(null), 3500);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Cadangan, Pemulihan & Impor Data
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="space-y-4 text-xs">
          {/* Card 1: Backup JSON */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
            <div>
              <p className="font-bold text-slate-900">Cadangkan Seluruh Data (JSON)</p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Simpan semua identitas sekolah, daftar siswa, presensi, nilai, dan jurnal ke file cadangan.
              </p>
            </div>
            <button
              onClick={handleExportBackup}
              className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold flex items-center gap-1.5 shrink-0 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh Backup
            </button>
          </div>

          {/* Card 2: Restore JSON */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
            <div>
              <p className="font-bold text-slate-900">Pulihkan dari File Cadangan</p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Unggah file JSON backup sebelumnya untuk memulihkan seluruh data aplikasi.
              </p>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold flex items-center gap-1.5 shrink-0 transition"
              >
                <Upload className="w-3.5 h-3.5" />
                Pilih File
              </button>
            </div>
          </div>

          {/* Card 3: Import Students CSV */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-900">Impor Siswa dari Excel / CSV</p>
              <button
                onClick={handleDownloadCsvTemplate}
                className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Unduh Templat CSV
              </button>
            </div>
            <p className="text-slate-500 text-[11px]">
              Upload file CSV berisi kolom: <code>NISN, Nama Siswa, L/P</code> untuk menambahkan murid ke rombel.
            </p>
            <div>
              <input
                type="file"
                ref={csvInputRef}
                accept=".csv"
                onChange={handleCsvUpload}
                className="hidden"
              />
              <button
                onClick={() => csvInputRef.current?.click()}
                className="px-3 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold flex items-center gap-1.5 transition text-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                Unggah File Siswa (CSV)
              </button>
            </div>
          </div>

          {/* Card 4: Reset Default */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">Ingin kembali ke data awal tutorial?</span>
            <button
              onClick={() => {
                if (window.confirm('Apakah Anda yakin ingin mereset seluruh data kembali ke data contoh bawaan?')) {
                  onResetDefault();
                  onClose();
                }
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Data Contoh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
