import React, { useState } from 'react';
import { SchoolProfile, Phase, CurriculumType } from '../types/index.ts';
import { Building2, Save, FileCheck, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  profile: SchoolProfile;
  onSave: (updated: SchoolProfile) => void;
  onClose: () => void;
}

export const SchoolProfileModal: React.FC<Props> = ({
  isOpen,
  profile,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<SchoolProfile>({ ...profile });
  const [savedAlert, setSavedAlert] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'kkmThreshold' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedAlert(true);
    setTimeout(() => {
      setSavedAlert(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Building2 className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Identitas Sekolah, Guru & Kop Surat</h2>
              <p className="text-xs text-slate-300">
                Data ini dicetak otomatis pada kop dokumen, lembar pengesahan, dan administrasi siswa.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {savedAlert && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
              <Check className="w-5 h-5 text-emerald-600" />
              <span>Identitas sekolah dan guru berhasil diperbarui!</span>
            </div>
          )}

          {/* Section 1: Data Sekolah */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              1. Identitas Satuan Pendidikan & Kop Surat
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Satuan Pendidikan (Kop Surat)
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: SMP NEGERI 1 TELADAN NUSANTARA"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NPSN (Nomor Pokok Sekolah Nasional)
                </label>
                <input
                  type="text"
                  name="npsn"
                  value={formData.npsn}
                  onChange={handleChange}
                  placeholder="Contoh: 10293847"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kurikulum Berlaku
                </label>
                <select
                  name="curriculum"
                  value={formData.curriculum}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Kurikulum Merdeka">Kurikulum Merdeka</option>
                  <option value="Kurikulum 2013 (K13)">Kurikulum 2013 (K13)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Sekolah & Kontak
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Jl. Pendidikan No. 45, Kebayoran Baru, Jakarta Selatan"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pimpinan & Pengampu */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              2. Kepala Sekolah & Guru Mata Pelajaran
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Kepala Sekolah & Gelar
                </label>
                <input
                  type="text"
                  name="principalName"
                  value={formData.principalName}
                  onChange={handleChange}
                  required
                  placeholder="Drs. H. Mulyadi, M.Pd."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIP Kepala Sekolah
                </label>
                <input
                  type="text"
                  name="principalNip"
                  value={formData.principalNip}
                  onChange={handleChange}
                  placeholder="19700514 199512 1 002"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Guru Pengampu & Gelar
                </label>
                <input
                  type="text"
                  name="teacherName"
                  value={formData.teacherName}
                  onChange={handleChange}
                  required
                  placeholder="Yuliana Rahmawati, S.Pd., Gr."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIP Guru Pengampu
                </label>
                <input
                  type="text"
                  name="teacherNip"
                  value={formData.teacherNip}
                  onChange={handleChange}
                  placeholder="19880922 201101 2 008"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Kelas & Tahun Ajaran */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              3. Konfigurasi Akademik & Kelas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mata Pelajaran
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Matematika"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kelas / Rombel
                </label>
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                  placeholder="Kelas VII (Tujuh)"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fase Kurikulum
                </label>
                <select
                  name="phase"
                  value={formData.phase}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="A">Fase A (Kelas 1-2 SD)</option>
                  <option value="B">Fase B (Kelas 3-4 SD)</option>
                  <option value="C">Fase C (Kelas 5-6 SD)</option>
                  <option value="D">Fase D (Kelas 7-9 SMP)</option>
                  <option value="E">Fase E (Kelas 10 SMA/SMK)</option>
                  <option value="F">Fase F (Kelas 11-12 SMA/SMK)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  KKM / Kriteria KKTP
                </label>
                <input
                  type="number"
                  name="kkmThreshold"
                  min={50}
                  max={100}
                  value={formData.kkmThreshold}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tahun Ajaran
                </label>
                <input
                  type="text"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  placeholder="2025/2026"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Semester
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Ganjil">Semester Ganjil</option>
                  <option value="Genap">Semester Genap</option>
                </select>
              </div>
            </div>
          </div>

          {/* Kop Surat Preview Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Pratinjau Kop Surat Resmi:
            </span>
            <div className="bg-white p-4 border border-dashed border-slate-300 rounded-lg text-center font-serif text-slate-800">
              <p className="text-xs font-semibold tracking-wider uppercase text-slate-600">
                PEMERINTAH DAERAH PROVINSI / KABUPATEN
              </p>
              <p className="text-xs font-semibold tracking-wider uppercase text-slate-600">
                DINAS PENDIDIKAN DAN KEBUDAYAAN
              </p>
              <h4 className="text-base font-bold tracking-wide uppercase mt-0.5 text-slate-900">
                {formData.schoolName || 'NAMA SATUAN PENDIDIKAN'}
              </h4>
              <p className="text-[11px] text-slate-500 italic mt-0.5">
                NPSN: {formData.npsn || '10293847'} | Alamat: {formData.address || 'Alamat Sekolah'}
              </p>
              <div className="border-b-2 border-slate-900 mt-2 mb-0.5"></div>
              <div className="border-b border-slate-600"></div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg shadow-sm flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              Simpan Identitas Sekolah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
