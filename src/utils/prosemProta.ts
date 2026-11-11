/**
 * Program Tahunan (Prota) and Program Semester (Prosem) calculation and distribution logic
 */

export interface LearningUnit {
  id: string;
  code: string; // e.g. "TP 1.1" or "Materi 1"
  title: string;
  estimatedJp: number;
  semester: 1 | 2;
}

export interface ProtaProsemCalculation {
  totalWeeksSemester1: number;
  totalWeeksSemester2: number;
  effectiveWeeksSemester1: number;
  effectiveWeeksSemester2: number;
  jpPerWeek: number;
  totalAvailableJpSemester1: number;
  totalAvailableJpSemester2: number;
  totalAvailableJpYear: number;
  allocatedJpSemester1: number;
  allocatedJpSemester2: number;
  totalAllocatedJp: number;
  remainingJpSemester1: number;
  remainingJpSemester2: number;
}

export function calculateProtaProsem(
  effectiveWeeksSemester1: number,
  effectiveWeeksSemester2: number,
  jpPerWeek: number,
  units: LearningUnit[]
): ProtaProsemCalculation {
  const totalAvailableJpSemester1 = effectiveWeeksSemester1 * jpPerWeek;
  const totalAvailableJpSemester2 = effectiveWeeksSemester2 * jpPerWeek;
  const totalAvailableJpYear = totalAvailableJpSemester1 + totalAvailableJpSemester2;

  const allocatedJpSemester1 = units
    .filter(u => u.semester === 1)
    .reduce((sum, u) => sum + (u.estimatedJp || 0), 0);

  const allocatedJpSemester2 = units
    .filter(u => u.semester === 2)
    .reduce((sum, u) => sum + (u.estimatedJp || 0), 0);

  const totalAllocatedJp = allocatedJpSemester1 + allocatedJpSemester2;

  return {
    totalWeeksSemester1: 26,
    totalWeeksSemester2: 26,
    effectiveWeeksSemester1,
    effectiveWeeksSemester2,
    jpPerWeek,
    totalAvailableJpSemester1,
    totalAvailableJpSemester2,
    totalAvailableJpYear,
    allocatedJpSemester1,
    allocatedJpSemester2,
    totalAllocatedJp,
    remainingJpSemester1: totalAvailableJpSemester1 - allocatedJpSemester1,
    remainingJpSemester2: totalAvailableJpSemester2 - allocatedJpSemester2,
  };
}
