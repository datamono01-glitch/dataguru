import React, { useState, useEffect } from 'react';
import {
  SchoolProfile,
  Student,
  AttendanceRecord,
  StudentGradeRecord,
  TeachingJournalEntry,
  CounselingCaseEntry,
} from './types/index.ts';
import {
  DEFAULT_SCHOOL_PROFILE,
  INITIAL_STUDENTS,
  INITIAL_GRADES,
  INITIAL_JOURNAL,
  INITIAL_CASES,
} from './data/defaultTemplates.ts';
import { Header } from './components/Header.tsx';
import { AIGeneratorView } from './components/AIGeneratorView.tsx';
import { AttendanceView } from './components/AttendanceView.tsx';
import { GradesView } from './components/GradesView.tsx';
import { TeachingJournalView } from './components/TeachingJournalView.tsx';
import { CounselingView } from './components/CounselingView.tsx';
import { SchoolProfileModal } from './components/SchoolProfileModal.tsx';
import { CopyPasteGuideModal } from './components/CopyPasteGuideModal.tsx';
import { ExportImportModal } from './components/ExportImportModal.tsx';
import { BookOpen, Sparkles, Heart } from 'lucide-react';

export default function App() {
  // Persistence Helpers
  const [profile, setProfile] = useState<SchoolProfile>(() => {
    try {
      const saved = localStorage.getItem('guru_school_profile');
      return saved ? JSON.parse(saved) : DEFAULT_SCHOOL_PROFILE;
    } catch {
      return DEFAULT_SCHOOL_PROFILE;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('guru_students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('guru_attendance');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [grades, setGrades] = useState<StudentGradeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('guru_grades');
      return saved ? JSON.parse(saved) : INITIAL_GRADES;
    } catch {
      return INITIAL_GRADES;
    }
  });

  const [journals, setJournals] = useState<TeachingJournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('guru_journals');
      return saved ? JSON.parse(saved) : INITIAL_JOURNAL;
    } catch {
      return INITIAL_JOURNAL;
    }
  });

  const [cases, setCases] = useState<CounselingCaseEntry[]>(() => {
    try {
      const saved = localStorage.getItem('guru_cases');
      return saved ? JSON.parse(saved) : INITIAL_CASES;
    } catch {
      return INITIAL_CASES;
    }
  });

  const [activeTab, setActiveTab] = useState<'generator' | 'presensi' | 'nilai' | 'jurnal' | 'kasus'>('generator');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('guru_school_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('guru_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('guru_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('guru_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('guru_journals', JSON.stringify(journals));
  }, [journals]);

  useEffect(() => {
    localStorage.setItem('guru_cases', JSON.stringify(cases));
  }, [cases]);

  // Check backend Gemini status
  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => {
        if (data.hasGeminiKey) {
          setHasGeminiKey(true);
        }
      })
      .catch(() => {});
  }, []);

  // Update handlers
  const handleUpdateRecord = (record: AttendanceRecord) => {
    setAttendanceRecords(prev => {
      const index = prev.findIndex(r => r.date === record.date && r.studentId === record.studentId);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = record;
        return copy;
      }
      return [...prev, record];
    });
  };

  const handleBulkAttendanceUpdate = (newRecords: AttendanceRecord[]) => {
    setAttendanceRecords(prev => {
      const dateToUpdate = newRecords[0]?.date;
      const filtered = prev.filter(r => r.date !== dateToUpdate);
      return [...filtered, ...newRecords];
    });
  };

  const handleAddStudent = (name: string, nisn: string, gender: 'L' | 'P') => {
    const newStudent: Student = {
      id: `std-${Date.now()}`,
      name,
      nisn,
      gender,
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const handleUpdateGrade = (updated: StudentGradeRecord) => {
    setGrades(prev => {
      const idx = prev.findIndex(g => g.studentId === updated.studentId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [...prev, updated];
    });
  };

  const handleAddJournal = (entry: TeachingJournalEntry) => {
    setJournals(prev => [entry, ...prev]);
  };

  const handleDeleteJournal = (id: string) => {
    setJournals(prev => prev.filter(j => j.id !== id));
  };

  const handleAddCase = (entry: CounselingCaseEntry) => {
    setCases(prev => [entry, ...prev]);
  };

  const handleUpdateCaseStatus = (id: string, status: 'Diproses' | 'Selesai' | 'Tindak Lanjut BK') => {
    setCases(prev => prev.map(c => (c.id === id ? { ...c, status } : c)));
  };

  const handleDeleteCase = (id: string) => {
    setCases(prev => prev.filter(c => c.id !== id));
  };

  const handleRestoreFullData = (restored: any) => {
    if (restored.profile) setProfile(restored.profile);
    if (restored.students) setStudents(restored.students);
    if (restored.records) setAttendanceRecords(restored.records);
    if (restored.grades) setGrades(restored.grades);
    if (restored.journals) setJournals(restored.journals);
    if (restored.cases) setCases(restored.cases);
  };

  const handleResetToDefault = () => {
    setProfile(DEFAULT_SCHOOL_PROFILE);
    setStudents(INITIAL_STUDENTS);
    setAttendanceRecords([]);
    setGrades(INITIAL_GRADES);
    setJournals(INITIAL_JOURNAL);
    setCases(INITIAL_CASES);
    localStorage.clear();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <Header
        profile={profile}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenProfileModal={() => setIsProfileOpen(true)}
        onOpenGuideModal={() => setIsGuideOpen(true)}
        onOpenBackupModal={() => setIsBackupOpen(true)}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'generator' && <AIGeneratorView profile={profile} />}
        {activeTab === 'presensi' && (
          <AttendanceView
            students={students}
            records={attendanceRecords}
            onUpdateRecord={handleUpdateRecord}
            onBulkUpdate={handleBulkAttendanceUpdate}
            onAddStudent={handleAddStudent}
            profile={profile}
          />
        )}
        {activeTab === 'nilai' && (
          <GradesView
            students={students}
            grades={grades}
            onUpdateGrade={handleUpdateGrade}
            profile={profile}
          />
        )}
        {activeTab === 'jurnal' && (
          <TeachingJournalView
            entries={journals}
            onAddEntry={handleAddJournal}
            onDeleteEntry={handleDeleteJournal}
            profile={profile}
          />
        )}
        {activeTab === 'kasus' && (
          <CounselingView
            entries={cases}
            onAddEntry={handleAddCase}
            onUpdateStatus={handleUpdateCaseStatus}
            onDeleteEntry={handleDeleteCase}
            profile={profile}
          />
        )}
      </main>

      {/* Floating Action Button for Guide */}
      <div className="fixed bottom-6 right-6 z-30 print:hidden">
        <button
          onClick={() => setIsGuideOpen(true)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition flex items-center gap-2 group"
          title="Buka Panduan Copy-Paste Link AI Studio & Bank Prompt Master"
        >
          <BookOpen className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition" />
          <span className="text-xs font-bold pr-1 hidden sm:inline">
            Panduan AI Studio & Prompt
          </span>
        </button>
      </div>

      {/* Modals */}
      <SchoolProfileModal
        isOpen={isProfileOpen}
        profile={profile}
        onSave={setProfile}
        onClose={() => setIsProfileOpen(false)}
      />

      <CopyPasteGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <ExportImportModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        fullData={{
          profile,
          students,
          records: attendanceRecords,
          grades,
          journals,
          cases,
        }}
        onRestoreData={handleRestoreFullData}
        onImportStudents={newStds => setStudents(prev => [...prev, ...newStds])}
        onResetDefault={handleResetToDefault}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Administrasi Guru Lengkap AI</span>
            <span>•</span>
            <span>Standar Kurikulum Merdeka & Kurikulum 2013</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-emerald-700 font-medium transition"
            >
              Tutorial & Master Prompt Yefri Haryanto
            </button>
            <span>•</span>
            <span>Diberdayakan oleh Google AI Studio & Gemini</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
