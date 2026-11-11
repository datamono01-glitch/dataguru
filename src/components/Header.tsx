import React from 'react';
import { SchoolProfile } from '../types/index.ts';
import {
  GraduationCap,
  Building2,
  BookOpen,
  Database,
  Sparkles,
  Layers,
  CalendarCheck,
  Check,
} from 'lucide-react';

interface Props {
  profile: SchoolProfile;
  activeTab: 'generator' | 'presensi' | 'nilai' | 'jurnal' | 'kasus';
  onSelectTab: (tab: 'generator' | 'presensi' | 'nilai' | 'jurnal' | 'kasus') => void;
  onOpenProfileModal: () => void;
  onOpenGuideModal: () => void;
  onOpenBackupModal: () => void;
  hasGeminiKey: boolean;
}

export const Header: React.FC<Props> = ({
  profile,
  activeTab,
  onSelectTab,
  onOpenProfileModal,
  onOpenGuideModal,
  onOpenBackupModal,
  hasGeminiKey,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner & Profile Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-700 via-teal-700 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
            <GraduationCap className="w-6 h-6 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Administrasi Guru Lengkap Berbasis AI
              </h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                {profile.curriculum}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Sistem Otomasi Perangkat Ajar, Presensi, Leger Nilai & Jurnal Harian • Terintegrasi AI Studio
            </p>
          </div>
        </div>

        {/* School Summary Pill & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* School Badge Pill */}
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition group"
            title="Klik untuk mengubah profil & kop surat sekolah"
          >
            <Building2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition" />
            <div className="text-xs leading-tight">
              <p className="font-bold text-slate-800 truncate max-w-48 sm:max-w-56">
                {profile.schoolName}
              </p>
              <p className="text-[10px] text-slate-500">
                {profile.teacherName} • {profile.subject} ({profile.grade})
              </p>
            </div>
          </button>

          {/* Tutorial / Copy-Paste AI Studio Modal Trigger */}
          <button
            onClick={onOpenGuideModal}
            className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            title="Panduan Copy-Paste AI Studio & Bank Prompt Master Guru"
          >
            <BookOpen className="w-4 h-4 text-emerald-200" />
            <span className="hidden sm:inline">Panduan Copy-Paste</span>
            <span className="sm:hidden">Panduan</span>
          </button>

          {/* Backup / Export Trigger */}
          <button
            onClick={onOpenBackupModal}
            className="p-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl transition"
            title="Cadangkan dan Impor Data"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* AI Connectivity Indicator */}
          <div
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1.5 ${
              hasGeminiKey
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-teal-50 text-teal-800 border border-teal-200'
            }`}
            title={hasGeminiKey ? 'Terhubung dengan model Gemini 2.5 Flash' : 'Mode Offline Siap Pakai & Gemini Fallback'}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{hasGeminiKey ? 'Gemini 2.5 AI Aktif' : 'AI Kurikulum Siap'}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2 no-scrollbar">
          {[
            {
              id: 'generator' as const,
              label: 'Generator Perangkat Ajar AI',
              icon: Sparkles,
              badge: 'Modul Ajar, ATP, Soal',
            },
            {
              id: 'presensi' as const,
              label: 'Presensi & Absensi Siswa',
              icon: CalendarCheck,
              badge: 'Harian & Rekap %',
            },
            {
              id: 'nilai' as const,
              label: 'Leger Nilai & Asesmen',
              icon: Layers,
              badge: 'Formatif, Sumatif, Rapor',
            },
            {
              id: 'jurnal' as const,
              label: 'Jurnal Agenda Mengajar',
              icon: BookOpen,
              badge: 'Aktivitas Harian',
            },
            {
              id: 'kasus' as const,
              label: 'Buku Kasus & Bimbingan',
              icon: GraduationCap,
              badge: 'Wali Kelas / BK',
            },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-200' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                <span
                  className={`hidden md:inline-block text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    isActive ? 'bg-emerald-800/80 text-emerald-100' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
