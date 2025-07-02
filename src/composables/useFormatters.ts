import { date } from 'quasar';
import toRupiah from '@develoka/angka-rupiah-js';

export function useFormatters() {
  const formatDate = (dateString: string | undefined | null): string => {
    return dateString ? date.formatDate(dateString, 'D MMMM YYYY') : '-';
  };

  const formatCurrency = (amount: string | undefined | null): string => {
    return amount ? toRupiah(amount) : 'Rp 0';
  };

  return {
    formatDate,
    formatCurrency
  };
}
