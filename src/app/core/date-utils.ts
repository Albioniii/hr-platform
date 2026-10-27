// Funksione ndihmëse për datat.
// Datat i ruajmë si tekst "yyyy-MM-dd" sepse krahasohen lehtë dhe ruhen pa probleme në localStorage.

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** Lëviz përpara (ose prapa, nëse n < 0) n ditë pune, duke kapërcyer fundjavat. */
export function addWorkingDays(date: Date, n: number): Date {
  const step = n >= 0 ? 1 : -1;
  let result = new Date(date);
  while (isWeekend(result)) {
    result = addDays(result, step);
  }
  let remaining = Math.abs(n);
  while (remaining > 0) {
    result = addDays(result, step);
    if (!isWeekend(result)) {
      remaining--;
    }
  }
  return result;
}

/** Numëron ditët e punës (E hënë – E premte) nga start deri te end, përfshirë të dyja. */
export function countWorkingDays(startIso: string, endIso: string): number {
  let current = fromISODate(startIso);
  const end = fromISODate(endIso);
  let count = 0;
  while (current <= end) {
    if (!isWeekend(current)) {
      count++;
    }
    current = addDays(current, 1);
  }
  return count;
}

/** A mbivendosen dy periudha? (Datat ISO krahasohen drejt si tekst.) */
export function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart <= bEnd && bStart <= aEnd;
}

export function startOfWeek(date: Date): Date {
  // Java fillon të hënën.
  return addDays(date, -((date.getDay() + 6) % 7));
}
