/**
 * Grade calculation and report descriptor logic for Kurikulum Merdeka & K13
 */

export interface FormatifInput {
  tp1?: number;
  tp2?: number;
  tp3?: number;
  tp4?: number;
}

export interface SumatifInput {
  lm1?: number;
  lm2?: number;
  sts?: number;
  sas?: number;
}

export function calculateAverage(scores: (number | undefined | null)[]): number {
  const valid = scores.filter((s): s is number => typeof s === 'number' && !isNaN(s));
  if (valid.length === 0) return 0;
  const sum = valid.reduce((acc, curr) => acc + curr, 0);
  return Math.round((sum / valid.length) * 10) / 10;
}

export function calculateFinalGrade(
  formatif: FormatifInput,
  sumatif: SumatifInput,
  weights = { formatifWeight: 0.4, sumatifWeight: 0.6 }
): number {
  const formatifAvg = calculateAverage([formatif.tp1, formatif.tp2, formatif.tp3, formatif.tp4]);
  const sumatifAvg = calculateAverage([sumatif.lm1, sumatif.lm2, sumatif.sts, sumatif.sas]);

  if (formatifAvg === 0 && sumatifAvg === 0) return 0;
  if (formatifAvg === 0) return sumatifAvg;
  if (sumatifAvg === 0) return formatifAvg;

  const total = (formatifAvg * weights.formatifWeight) + (sumatifAvg * weights.sumatifWeight);
  return Math.round(total * 10) / 10;
}

export function getPredicate(score: number, kkm = 75): 'A' | 'B' | 'C' | 'D' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= kkm) return 'C';
  return 'D';
}

export function getPredicateLabel(predicate: 'A' | 'B' | 'C' | 'D'): string {
  switch (predicate) {
    case 'A': return 'Sangat Baik';
    case 'B': return 'Baik';
    case 'C': return 'Cukup';
    case 'D': return 'Perlu Bimbingan';
  }
}

export function generateCompetencyDescriptor(
  studentName: string,
  subject: string,
  score: number,
  masteredTopic = 'pemahaman konsep materi pokok dan keterampilan penerapan',
  strugglingTopic?: string
): string {
  if (score >= 90) {
    return `${studentName} menunjukkan penguasaan yang sangat istimewa dalam ${masteredTopic} pada mata pelajaran ${subject}, serta mampu menyelesaikan tugas pemecahan masalah dengan mandiri dan kreatif.`;
  } else if (score >= 80) {
    return `${studentName} menunjukkan penguasaan yang baik dalam ${masteredTopic} pada mata pelajaran ${subject}. Perlu mempertahankan konsistensi belajar.`;
  } else if (score >= 75) {
    const struggleNote = strugglingTopic ? `namun perlu penguatan lebih lanjut dalam ${strugglingTopic}` : 'dengan ketekunan yang memadai';
    return `${studentName} telah mencapai ketuntasan tujuan pembelajaran dalam ${masteredTopic}, ${struggleNote}.`;
  } else {
    const struggleNote = strugglingTopic ? strugglingTopic : 'konsep dasar dan latihan terstruktur';
    return `${studentName} memerlukan pendampingan dan bimbingan khusus dalam ${struggleNote} agar mencapai ketuntasan kriteria tujuan pembelajaran yang diharapkan.`;
  }
}

export interface ClassStatistics {
  count: number;
  average: number;
  highest: number;
  lowest: number;
  passCount: number;
  failCount: number;
  passPercentage: number;
}

export function calculateClassStatistics(scores: number[], kkm = 75): ClassStatistics {
  const valid = scores.filter(s => typeof s === 'number' && !isNaN(s) && s > 0);
  if (valid.length === 0) {
    return {
      count: 0,
      average: 0,
      highest: 0,
      lowest: 0,
      passCount: 0,
      failCount: 0,
      passPercentage: 0,
    };
  }

  const sum = valid.reduce((a, b) => a + b, 0);
  const avg = Math.round((sum / valid.length) * 10) / 10;
  const highest = Math.max(...valid);
  const lowest = Math.min(...valid);
  const passCount = valid.filter(s => s >= kkm).length;
  const failCount = valid.length - passCount;
  const passPercentage = Math.round((passCount / valid.length) * 100);

  return {
    count: valid.length,
    average: avg,
    highest,
    lowest,
    passCount,
    failCount,
    passPercentage,
  };
}
