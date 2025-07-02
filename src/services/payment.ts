interface SnapResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status: string;
  pdf_url: string;
  finish_redirect_url: string;
}

export class PaymentService {
  static initializeSnap(
    token: string,
    containerId: string,
    callbacks: {
      onSuccess: (result: SnapResult) => void;
      onPending: () => void;
      onError: (result: SnapResult) => void;
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
