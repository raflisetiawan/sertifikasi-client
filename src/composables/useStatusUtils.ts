export function useStatusUtils() {
  const getPaymentStatusColor = (status: string | undefined): string => {
    if (!status) return 'grey';

    const colors: Record<string, string> = {
      settlement: 'positive',
      pending: 'warning',
      expire: 'negative',
      cancel: 'grey'
    };
    return colors[status] || 'grey';
  };

  const getPaymentStatusLabel = (status: string | undefined): string => {
    if (!status) return '-';

    const labels: Record<string, string> = {
      settlement: 'Lunas',
      pending: 'Menunggu',
      expire: 'Kadaluarsa',
      cancel: 'Dibatalkan'
    };
    return labels[status] || status;
  };

  const getProgressColor = (status: string | undefined): string => {
    if (!status) return 'grey';

    const colors: Record<string, string> = {
      completed: 'positive',
      in_progress: 'info',
      not_started: 'grey'
    };
    return colors[status] || 'grey';
  };

  const getProgressStatusLabel = (status: string | undefined): string => {
    if (!status) return 'Belum Dimulai';

    const labels: Record<string, string> = {
      completed: 'Selesai',
      in_progress: 'Sedang Berlangsung',
      not_started: 'Belum Dimulai'
    };
    return labels[status] || status;
  };

  const getProgressStatusColor = getProgressColor;

  const getModuleTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      module: 'primary',
      prework: 'purple',
      final: 'deep-orange'
    };
    return colors[type] || 'grey';
  };

  const getModuleTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      module: 'Modul',
      prework: 'Prework',
      final: 'Final'
    };
    return labels[type] || type;
  };

  return {
    getPaymentStatusColor,
    getPaymentStatusLabel,
    getProgressColor,
    getProgressStatusLabel,
    getProgressStatusColor,
    getModuleTypeColor,
    getModuleTypeLabel
  };
}
