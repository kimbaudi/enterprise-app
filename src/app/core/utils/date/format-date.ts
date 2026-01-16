/**
 * Format date to string
 */
export function formatDate(date: Date | string | number, format = 'MM/dd/yyyy'): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const pad = (n: number) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());

  const replacements: Record<string, string> = {
    yyyy: String(year),
    yy: String(year).slice(-2),
    MM: month,
    M: String(d.getMonth() + 1),
    dd: day,
    d: String(d.getDate()),
    HH: hours,
    H: String(d.getHours()),
    mm: minutes,
    m: String(d.getMinutes()),
    ss: seconds,
    s: String(d.getSeconds()),
  };

  return format.replace(
    /yyyy|yy|MM|M|dd|d|HH|H|mm|m|ss|s/g,
    (match) => replacements[match] || match,
  );
}
