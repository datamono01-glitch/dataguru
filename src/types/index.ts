export type Phase = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type CurriculumType = 'Kurikulum Merdeka' | 'Kurikulum 2013 (K13)';

export interface SchoolProfile {
  schoolName: string;
  npsn: string;
  address: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  principalName: string;
  principalNip: string;
  teacherName: string;
  teacherNip: string;
  subject: string;
  grade: string;
  phase: Phase;
  curriculum: CurriculumType;
  kkmThreshold: number;
}

export type DocumentType = 
  | 'modul_ajar'
  | 'atp'
  | 'prota'
  | 'prosem'
  | 'kktp'
  | 'lkpd'
  | 'kisi_soal'
  | 'jurnal_mengajar';

export interface DocumentDraft {
  id: string;
  type: DocumentType;
  title: string;
  subject: string;
  grade: string;
  phase: Phase;
  content: string;
  createdAt: string;
  updatedAt: string;
  topic?: string;
}

export interface Student {
  id: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  status: 'H' | 'S' | 'I' | 'A';
  note?: string;
}

export interface FormatifGrade {
  tp1?: number;
  tp2?: number;
  tp3?: number;
  tp4?: number;
}

export interface SumatifGrade {
  lm1?: number; // Lingkup Materi 1
  lm2?: number; // Lingkup Materi 2
  sts?: number; // Sumatif Tengah Semester
  sas?: number; // Sumatif Akhir Semester
}

export interface StudentGradeRecord {
  studentId: string;
  formatif: FormatifGrade;
  sumatif: SumatifGrade;
  finalScore?: number;
  predicate?: 'A' | 'B' | 'C' | 'D';
  descriptor?: string;
}

export interface TeachingJournalEntry {
  id: string;
  date: string;
  period: string; // Jam Pelajaran (misal: "1 - 2")
  classGroup: string;
  subject: string;
  topic: string;
  learningActivities: string;
  attendancePresent: number;
  attendanceAbsent: number;
  obstacles: string;
  followUp: string;
}

export interface CounselingCaseEntry {
  id: string;
  date: string;
  studentName: string;
  classGroup: string;
  incidentType: 'Kedisiplinan' | 'Akademik' | 'Sosial/Perilaku' | 'Kehadiran' | 'Lainnya';
  description: string;
  handlingAction: string;
  followUp: string;
  status: 'Diproses' | 'Selesai' | 'Tindak Lanjut BK';
}
