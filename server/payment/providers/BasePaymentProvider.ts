import {
  IPaymentProvider,
  PaymentMethodType,
  CreatePaymentIntentParams,
  PaymentIntentResult,
  PaymentVerifyParams,
  PaymentVerifyResult,
  PaymentStatusType,
} from '../types';

export abstract class BasePaymentProvider implements IPaymentProvider {
  abstract readonly id: PaymentMethodType;
  abstract readonly name: string;
  abstract readonly isConfigured: boolean;

  abstract createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult>;
  abstract verifyPayment(params: PaymentVerifyParams): Promise<PaymentVerifyResult>;

  async handleWebhook(
    rawBody: any,
    headers: Record<string, string | string[] | undefined>
  ): Promise<{ received: boolean; status: PaymentStatusType; orderId: string }> {
    return {
      received: true,
      status: 'paid',
      orderId: rawBody?.orderId || rawBody?.vnp_TxnRef || 'unknown',
    };
  }

  protected generateTransactionNumber(prefix: string): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${timestamp}-${random}`;
  }
}
