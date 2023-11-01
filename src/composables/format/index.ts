import { date } from 'quasar';

export const useFormatOperational = (operational: string) => {
  const dateObject = new Date(operational);
  return date.formatDate(dateObject, 'dddd MMMM YYYY HH:mm A');
};

export const useFormatOperationalEnd = (operational: string) => {
  const dateObject = new Date(operational);
  return date.formatDate(dateObject, 'd MMMM YYYY HH:mm A');
};

export function useRemoveDecimal(number: number, decimalCount: number): string {
  return number.toFixed(decimalCount).slice(0, -3);
}
