import {
  IPaymentProvider,
  PaymentMethodType,
  CreatePaymentIntentParams,
  PaymentIntentResult,
  PaymentVerifyParams,
  PaymentVerifyResult,
} from './types';
import { VNPayProvider } from './providers/VNPayProvider';
import { MoMoProvider } from './providers/MoMoProvider';
import { ZaloPayProvider } from './providers/ZaloPayProvider';
import { StripeProvider } from './providers/StripeProvider';
import { VietQRBankTransferProvider } from './providers/VietQRBankTransferProvider';
import { CodProvider } from './providers/CodProvider';

/**
 * Payment Gateway Manager
 * Strategy pattern implementation allowing seamless plug-and-play addition of payment gateways
 * without client code modifications and without exposing credentials.
 */
export class PaymentGatewayManager {
  private static instance: PaymentGatewayManager;
  private providers: Map<PaymentMethodType, IPaymentProvider> = new Map();

  private constructor() {
    this.registerProvider(new CodProvider());
    this.registerProvider(new VietQRBankTransferProvider());
    this.registerProvider(new VNPayProvider());
    this.registerProvider(new MoMoProvider());
    this.registerProvider(new ZaloPayProvider());
    this.registerProvider(new StripeProvider());
  }

  public static getInstance(): PaymentGatewayManager {
    if (!PaymentGatewayManager.instance) {
      PaymentGatewayManager.instance = new PaymentGatewayManager();
    }
    return PaymentGatewayManager.instance;
  }

  public registerProvider(provider: IPaymentProvider): void {
    this.providers.set(provider.id, provider);
  }

  public getProvider(method: PaymentMethodType): IPaymentProvider {
    const provider = this.providers.get(method);
    if (!provider) {
      throw new Error(`Cổng thanh toán '${method}' chưa được hỗ trợ hoặc đăng ký trong hệ thống.`);
    }
    return provider;
  }

  public getAvailableMethods(): Array<{
    id: PaymentMethodType;
    name: string;
    isConfigured: boolean;
    mode: 'live' | 'sandbox';
  }> {
    return Array.from(this.providers.values()).map((p) => ({
      id: p.id,
      name: p.name,
      isConfigured: p.isConfigured,
      mode: p.isConfigured ? 'live' : 'sandbox',
    }));
  }

  public async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult> {
    const provider = this.getProvider(params.method);
    return await provider.createPaymentIntent(params);
  }

  public async verifyPayment(params: PaymentVerifyParams): Promise<PaymentVerifyResult> {
    const method = params.method || this.guessMethodFromPaymentId(params.paymentId);
    const provider = this.getProvider(method);
    return await provider.verifyPayment(params);
  }

  public async handleWebhook(
    method: PaymentMethodType,
    rawBody: any,
    headers: Record<string, string | string[] | undefined>
  ) {
    const provider = this.getProvider(method);
    return await provider.handleWebhook(rawBody, headers);
  }

  private guessMethodFromPaymentId(paymentId: string): PaymentMethodType {
    if (paymentId.startsWith('QR-') || paymentId.startsWith('VQR-')) return 'bank_transfer';
    if (paymentId.startsWith('VNPAY-') || paymentId.startsWith('VNP-')) return 'vnpay';
    if (paymentId.startsWith('MOMO-')) return 'momo';
    if (paymentId.startsWith('ZALO-') || paymentId.startsWith('ZLP-')) return 'zalopay';
    if (paymentId.startsWith('STRIPE-') || paymentId.startsWith('CARD-') || paymentId.startsWith('STP-')) return 'credit_card';
    return 'cod';
  }
}

export const paymentGatewayManager = PaymentGatewayManager.getInstance();
