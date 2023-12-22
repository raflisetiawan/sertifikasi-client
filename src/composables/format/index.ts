import { date } from 'quasar';

export const useFormatOperational = (operational: string) => {
  const dateObject = new Date(operational);
  return date.formatDate(dateObject, 'dddd MMMM YYYY ');
};

export const useFormatOperationalEnd = (operational: string) => {
  const dateObject = new Date(operational);
  return date.formatDate(dateObject, 'd MMMM YYYY ');
};

export function useRemoveDecimal(number: number, decimalCount: number): string {
  return number.toFixed(decimalCount).slice(0, -3);
}

export function useFormatDateRange(
  operationalStart: string,
  operationalEnd: string
): string {
  const start = new Date(operationalStart);
  const end = new Date(operationalEnd);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  // Jika bulan dan tahun sama
  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return `${start.getDate()} - ${end.getDate()} ${new Intl.DateTimeFormat(
      'en-US',
      { month: 'long' }
    ).format(end)} ${end.getFullYear()}`;
  }

  // Jika bulan dan tahun berbeda
  return `${start.getDate()} ${new Intl.DateTimeFormat('en-US', {
    month: 'long',
  }).format(start)} - ${end.getDate()} ${new Intl.DateTimeFormat('en-US', {
    month: 'long',
  }).format(end)} ${end.getFullYear()}`;
}

export function useDateFormat(tanggal: string): string {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = new Date(tanggal).toLocaleDateString('id-ID', options);
  return formattedDate;
}

export function useSimplifyUrl(originalUrl: string, length: number): string {
  if (originalUrl.length <= length) {
    return originalUrl;
  }

  const truncatedUrl = originalUrl.substring(0, length - 3) + '...';
  return truncatedUrl;
}
