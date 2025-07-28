import { date } from 'quasar';
import toRupiah from '@develoka/angka-rupiah-js';

export function useFormatters() {
  const formatDate = (dateString: string | undefined | null): string => {
    return dateString ? date.formatDate(dateString, 'D MMMM YYYY') : '-';
  };

  const formatTime = (timeString: string | undefined | null): string => {
    if (!timeString) return '-';
    // Assuming timeString is in 'HH:mm:ss' or 'HH:mm' format
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const formatCurrency = (amount: string | undefined | null): string => {
    return amount ? toRupiah(amount) : 'Rp 0';
  };

  const formatPrice = (price: number | null | undefined): string => {
    if (price === 0) {
      return 'Gratis';
    }
    if (!price) {
      return '-';
    }
    return toRupiah(price);
  };

  return {
    formatDate,
    formatTime,
    formatCurrency,
    formatPrice,
  };
}
