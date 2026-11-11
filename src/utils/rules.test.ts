import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAverage,
  calculateFinalGrade,
  getPredicate,
  calculateClassStatistics,
  generateCompetencyDescriptor,
} from './gradeCalculator.ts';
import { calculateAttendanceSummary } from './attendanceStats.ts';
import { calculateProtaProsem } from './prosemProta.ts';

test('calculateAverage handles valid arrays and empty arrays', () => {
  assert.equal(calculateAverage([80, 90, 100]), 90);
  assert.equal(calculateAverage([75, undefined, 85]), 80);
  assert.equal(calculateAverage([]), 0);
});

test('calculateFinalGrade computes weighted scores properly', () => {
  // formatif (40%), sumatif (60%)
  // Formatif avg: 80, Sumatif avg: 90 => (80 * 0.4) + (90 * 0.6) = 32 + 54 = 86
  const final = calculateFinalGrade(
    { tp1: 80, tp2: 80 },
    { lm1: 90, lm2: 90 }
  );
  assert.equal(final, 86);
});

test('getPredicate assigns A, B, C, D based on score and KKM', () => {
  assert.equal(getPredicate(95, 75), 'A');
  assert.equal(getPredicate(84, 75), 'B');
  assert.equal(getPredicate(76, 75), 'C');
  assert.equal(getPredicate(70, 75), 'D');
});

test('generateCompetencyDescriptor provides descriptive narrative', () => {
  const desc = generateCompetencyDescriptor('Ahmad', 'Matematika', 92, 'Aljabar Linear');
  assert.ok(desc.includes('Ahmad'));
  assert.ok(desc.includes('Matematika'));
  assert.ok(desc.includes('Aljabar Linear'));
});

test('calculateClassStatistics calculates accurate summary', () => {
  const stats = calculateClassStatistics([70, 80, 90, 100], 75);
  assert.equal(stats.count, 4);
  assert.equal(stats.average, 85);
  assert.equal(stats.highest, 100);
  assert.equal(stats.lowest, 70);
  assert.equal(stats.passCount, 3);
  assert.equal(stats.failCount, 1);
  assert.equal(stats.passPercentage, 75);
});

test('calculateAttendanceSummary calculates rates and flags risk', () => {
  const normal = calculateAttendanceSummary([
    { status: 'H' },
    { status: 'H' },
    { status: 'H' },
    { status: 'S' },
  ]);
  assert.equal(normal.hadir, 3);
  assert.equal(normal.sakit, 1);
  assert.equal(normal.attendancePercentage, 75);
  assert.equal(normal.isAtRisk, true); // < 80%

  const perfect = calculateAttendanceSummary([
    { status: 'H' },
    { status: 'H' },
    { status: 'H' },
    { status: 'H' },
    { status: 'H' },
  ]);
  assert.equal(perfect.attendancePercentage, 100);
  assert.equal(perfect.isAtRisk, false);
});

test('calculateProtaProsem computes available and allocated hours', () => {
  const result = calculateProtaProsem(18, 16, 4, [
    { id: '1', code: 'TP 1', title: 'Bilangan Bulat', estimatedJp: 24, semester: 1 },
    { id: '2', code: 'TP 2', title: 'Geometri', estimatedJp: 30, semester: 2 },
  ]);
  assert.equal(result.totalAvailableJpSemester1, 72); // 18 * 4
  assert.equal(result.totalAvailableJpSemester2, 64); // 16 * 4
  assert.equal(result.totalAvailableJpYear, 136);
  assert.equal(result.allocatedJpSemester1, 24);
  assert.equal(result.allocatedJpSemester2, 30);
  assert.equal(result.remainingJpSemester1, 48);
});
