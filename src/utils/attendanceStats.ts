/**
 * Attendance statistics and calculation logic
 */

export interface AttendanceRecordBasic {
  status: 'H' | 'S' | 'I' | 'A';
}

export interface AttendanceSummary {
  hadir: number;
  sakit: number;
  izin: number;
  alpa: number;
  totalMeetings: number;
  attendancePercentage: number;
  isAtRisk: boolean;
}

export function calculateAttendanceSummary(records: AttendanceRecordBasic[]): AttendanceSummary {
  const hadir = records.filter(r => r.status === 'H').length;
  const sakit = records.filter(r => r.status === 'S').length;
  const izin = records.filter(r => r.status === 'I').length;
  const alpa = records.filter(r => r.status === 'A').length;
  const totalMeetings = records.length;

  if (totalMeetings === 0) {
    return {
      hadir: 0,
      sakit: 0,
      izin: 0,
      alpa: 0,
      totalMeetings: 0,
      attendancePercentage: 100,
      isAtRisk: false,
    };
  }

  // Attendance rate considers Hadir as present. Sakit/Izin with reason might not deduct severely, but standard rate is Hadir / Total
  const attendancePercentage = Math.round((hadir / totalMeetings) * 100);
  const isAtRisk = alpa >= 3 || attendancePercentage < 80;

  return {
    hadir,
    sakit,
    izin,
    alpa,
    totalMeetings,
    attendancePercentage,
    isAtRisk,
  };
}

export function formatAttendanceTag(status: 'H' | 'S' | 'I' | 'A'): { label: string; bg: string; text: string } {
  switch (status) {
    case 'H':
      return { label: 'Hadir', bg: 'bg-emerald-100', text: 'text-emerald-800' };
    case 'S':
      return { label: 'Sakit', bg: 'bg-amber-100', text: 'text-amber-800' };
    case 'I':
      return { label: 'Izin', bg: 'bg-blue-100', text: 'text-blue-800' };
    case 'A':
      return { label: 'Alpa', bg: 'bg-rose-100', text: 'text-rose-800' };
  }
}
