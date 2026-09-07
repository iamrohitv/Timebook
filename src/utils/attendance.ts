// Attendance calculations — mathematically correct.
export function attendancePercentage(present: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((present / total) * 10000) / 100; // 2 decimals
}

export function classesToReachTarget(present: number, total: number, target: number): number {
  // t = target% (0-100). Solve (present + x)/(total + x) >= t/100
  // x >= (t*total - 100*present) / (100 - t)
  if (target <= 0) return 0;
  if (target >= 100) return present === total ? 0 : Infinity;
  if (attendancePercentage(present, total) >= target) return 0;
  const t = target;
  const x = (t * total - 100 * present) / (100 - t);
  return Math.max(0, Math.ceil(x));
}

export function classesCanMiss(present: number, total: number, target: number): number {
  // max m such that present/(total+m) >= t/100
  // m <= (100*present - t*total)/t
  if (target <= 0) return Infinity;
  if (target > 100) return 0;
  const current = attendancePercentage(present, total);
  if (current < target) return 0;
  const m = (100 * present - target * total) / target;
  return Math.max(0, Math.floor(m));
}

export function attendanceStatus(percentage: number, target = 75): "good" | "warning" | "danger" {
  if (percentage >= target) return "good";
  if (percentage >= target - 10) return "warning";
  return "danger";
}
