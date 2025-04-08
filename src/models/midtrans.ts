export interface MidtransResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status: string;
  finish_redirect_url: string;
}

export enum MidtransErrorCode {
  VALIDATION_ERROR = '400',
  UNAUTHORIZED = '401',
  PAYMENT_TYPE_ERROR = '402',
  INVALID_FORMAT = '403',
  NOT_FOUND = '404',
  METHOD_NOT_ALLOWED = '405',
  DUPLICATE_ORDER = '406',
  EXPIRED = '407',
  WRONG_DATA_TYPE = '408',
  GOPAY_BLOCKED = '410',
  INVALID_TOKEN = '411',
  STATUS_UPDATE_ERROR = '412',
  SYNTAX_ERROR = '413',
  INSUFFICIENT_FUNDS = '414',
  RATE_LIMIT = '429',
  INTERNAL_ERROR = '500',
  FEATURE_UNAVAILABLE = '501',
  BANK_CONNECTION = '502',
  SERVICE_UNAVAILABLE = '503',
  FRAUD_SYSTEM_ERROR = '504',
  VA_CREATION_ERROR = '505',
  MOVED_PERMANENTLY = '300',
}

export const getMidtransErrorMessage = (code: string): string => {
  switch (code) {
    case MidtransErrorCode.VALIDATION_ERROR:
      return 'Validasi gagal. Mohon periksa data pembayaran Anda';
    case MidtransErrorCode.UNAUTHORIZED:
      return 'Akses ditolak. Mohon hubungi admin';
    case MidtransErrorCode.MOVED_PERMANENTLY:
      return 'Permintaan dialihkan secara permanen ke URL baru';
    case MidtransErrorCode.PAYMENT_TYPE_ERROR:
      return 'Metode pembayaran tidak tersedia';
    case MidtransErrorCode.NOT_FOUND:
      return 'Transaksi tidak ditemukan';
    case MidtransErrorCode.DUPLICATE_ORDER:
      return 'ID pesanan sudah digunakan';
    case MidtransErrorCode.EXPIRED:
      return 'Transaksi telah kadaluarsa';
    case MidtransErrorCode.GOPAY_BLOCKED:
      return 'Pengguna GoPay diblokir';
    case MidtransErrorCode.INVALID_TOKEN:
      return 'Token tidak valid atau kadaluarsa';
    case MidtransErrorCode.INSUFFICIENT_FUNDS:
      return 'Dana merchant tidak mencukupi';
    case MidtransErrorCode.RATE_LIMIT:
      return 'Batas API terlampaui';
    case MidtransErrorCode.INTERNAL_ERROR:
    case MidtransErrorCode.BANK_CONNECTION:
    case MidtransErrorCode.SERVICE_UNAVAILABLE:
    case MidtransErrorCode.FRAUD_SYSTEM_ERROR:
    case MidtransErrorCode.VA_CREATION_ERROR:
      return 'Terjadi kesalahan sistem. Mohon coba beberapa saat lagi';
    default:
      return 'Terjadi kesalahan yang tidak diketahui';
  }
};
