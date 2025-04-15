export class PaymentService {
  static initializeSnap(
    token: string,
    containerId: string,
    callbacks: {
      onSuccess: (result: any) => void;
      onPending: () => void;
      onError: (result: any) => void;
      onClose: () => void;
    }
  ) {
    if (window.snap && !document.querySelector('.snap-iframe')) {
      window.snap.embed(token, {
        embedId: containerId,
        ...callbacks,
      });
      return true;
    }
    return false;
  }

  static cleanupPayment() {
    const container = document.getElementById('snap-container');
    if (container) {
      container.innerHTML = '';
    }
    localStorage.removeItem('paymentToken');
  }
}
