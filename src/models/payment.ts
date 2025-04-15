export interface PaymentResult {
  order_id: string;
  status_code: string;
  status_message: string;
  transaction_id: string;
  transaction_status: string;
  transaction_time: string;
  payment_type: string;
  gross_amount: string;
  fraud_status: string | null;
  finish_redirect_url: string;
}

export interface PaymentError {
  status_code: string;
  finish_redirect_url?: string;
}

export interface PaymentUpdateRequest {
  order_id: string;
  status_code: string;
  transaction_id: string;
  transaction_status: string;
  transaction_time: string;
  payment_type: string;
  gross_amount: string;
  fraud_status: string | null;
  status_message: string;
  finish_redirect_url: string;
}
