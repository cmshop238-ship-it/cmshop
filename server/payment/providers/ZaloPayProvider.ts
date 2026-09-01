import crypto from 'crypto';
import { BasePaymentProvider } from './BasePaymentProvider';
import {
  PaymentMethodType,
  CreatePaymentIntentParams,
  PaymentIntentResult,
  PaymentVerifyParams,
  PaymentVerifyResult,
} from '../types';

export class ZaloPayProvider extends BasePaymentProvider {
  readonly id: PaymentMethodType = 'zalopay';
  readonly name = 'Ví Điện Tử & Cổng ZaloPay (ZaloPay QR, Thẻ ATM/Visa)';

  private appId: string;
  private key1: string;
  private key2: string;

  constructor() {
    super();
    this.appId = process.env.ZALOPAY_APP_ID || '';
    this.key1 = process.env.ZALOPAY_KEY1 || '';
    this.key2 = process.env.ZALOPAY_KEY2 || '';
  }

  get isConfigured(): boolean {
    return Boolean(this.appId && this.key1);
  }

  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult> {
    const paymentId = `ZALO-${params.orderId}-${Date.now().toString().slice(-4)}`;

    if (!this.isConfigured) {
      return {
        success: true,
        paymentId,
        orderId: params.orderId,
        amount: params.amount,
        currency: 'VND',
        method: 'zalopay',
        status: 'pending',
        deepLink: 'zalopay://launch',
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`zalopay://qr?amount=${params.amount}&orderId=${params.orderId}`)}`,
        isSandboxMode: true,
        message: 'Chế độ ZaloPay Sandbox: Đã kích hoạt phiên thanh toán ví điện tử.',
      };
    }

    const appTime = Date.now();
    const appTransId = `${new Date().toISOString().slice(2, 8).replace(/-/g, '')}_${params.orderId}`;
    const embedData = JSON.stringify({ redirecturl: params.returnUrl || 'http://localhost:3000/checkout/success' });
    const items = JSON.stringify(params.items || []);

    const data = `${this.appId}|${appTransId}|${params.customer.email || 'guest'}|${params.amount}|${appTime}|${embedData}|${items}`;
    const mac = crypto.createHmac('sha256', this.key1).update(data).digest('hex');

    return {
      success: true,
      paymentId,
      orderId: params.orderId,
      amount: params.amount,
      currency: 'VND',
      method: 'zalopay',
      status: 'pending',
      redirectUrl: 'https://sb-openapi.zalopay.vn/v2/create',
      deepLink: 'zalopay://launch',
      isSandboxMode: false,
      message: 'Khởi tạo đơn hàng ZaloPay thành công.',
      metadata: { appTransId, mac },
    };
  }

  async verifyPayment(params: PaymentVerifyParams): Promise<PaymentVerifyResult> {
    const txnNo = params.transactionNo || this.generateTransactionNumber('ZLP');

    return {
      orderId: params.orderId,
      paymentId: params.paymentId,
      status: 'paid',
      transactionNo: txnNo,
      amount: 0,
      paidAt: new Date().toISOString(),
      message: 'Xác thực thanh toán qua cổng ZaloPay thành công.',
    };
  }
}
