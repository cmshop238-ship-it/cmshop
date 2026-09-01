export type PaymentMethodType =
  | 'cod'
  | 'bank_transfer'
  | 'vnpay'
  | 'momo'
  | 'zalopay'
  | 'stripe'
  | 'credit_card';

export type PaymentStatusType =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export interface PaymentCustomerInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface CreatePaymentIntentParams {
  orderId: string;
  amount: number;
  currency?: 'VND' | 'USD';
  method: PaymentMethodType;
  customer: PaymentCustomerInfo;
  orderInfo?: string;
  returnUrl?: string;
  cancelUrl?: string;
  ipAddress?: string;
  items?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export interface BankTransferDetails {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  amount: number;
  transferContent: string;
  qrCodeUrl: string;
}

export interface PaymentIntentResult {
  success: boolean;
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  method: PaymentMethodType;
  status: PaymentStatusType;
  redirectUrl?: string;
  qrCodeUrl?: string;
  deepLink?: string;
  bankDetails?: BankTransferDetails;
  clientSecret?: string;
  isSandboxMode: boolean;
  message: string;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentVerifyParams {
  orderId: string;
  paymentId: string;
  transactionNo?: string;
  method?: PaymentMethodType;
  queryPayload?: Record<string, string>;
}

export interface PaymentVerifyResult {
  orderId: string;
  paymentId: string;
  status: PaymentStatusType;
  transactionNo: string;
  amount: number;
  paidAt: string;
  message: string;
  providerRawResponse?: Record<string, unknown>;
}

export interface IPaymentProvider {
  readonly id: PaymentMethodType;
  readonly name: string;
  readonly isConfigured: boolean;
  createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult>;
  verifyPayment(params: PaymentVerifyParams): Promise<PaymentVerifyResult>;
  handleWebhook(rawBody: any, headers: Record<string, string | string[] | undefined>): Promise<{ received: boolean; status: PaymentStatusType; orderId: string }>;
}
