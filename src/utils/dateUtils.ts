// Hours displayed in the grid: 8am (slot start) through 6pm (last slot starts at 18, ends at 19)
export const HOUR_SLOTS: number[] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

export const SLOT_HEIGHT_PX = 60;

export function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function fromDateString(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function addDays(d: Date, n: number): Date {
  const date = new Date(d);
  date.setDate(date.getDate() + n);
  return date;
}

export function getWeekDays(anchor: Date, includeWeekends: boolean): Date[] {
  const monday = getMonday(anchor);
  const count = includeWeekends ? 7 : 5;
  return Array.from({ length: count }, (_, i) => addDays(monday, i));
}

export function formatHour(hour: number): string {
  if (hour === 12) return '12pm';
  if (hour > 12) return `${hour - 12}pm`;
  return `${hour}am`;
}

export function formatDateRange(days: Date[]): string {
  if (days.length === 1) {
    return days[0].toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  const first = days[0];
  const last = days[days.length - 1];
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const yearOpts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  if (first.getFullYear() === last.getFullYear()) {
    return `${first.toLocaleDateString('en-US', opts)} – ${last.toLocaleDateString('en-US', yearOpts)}`;
  }
  return `${first.toLocaleDateString('en-US', yearOpts)} – ${last.toLocaleDateString('en-US', yearOpts)}`;
}

export function formatDayHeader(d: Date): { weekday: string; date: string; isToday: boolean } {
  const today = toDateString(new Date());
  return {
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
    date: d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
    isToday: toDateString(d) === today,
  };
}

export function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}
