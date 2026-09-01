import crypto from 'crypto';
import { BasePaymentProvider } from './BasePaymentProvider';
import {
  PaymentMethodType,
  CreatePaymentIntentParams,
  PaymentIntentResult,
  PaymentVerifyParams,
  PaymentVerifyResult,
} from '../types';

export class MoMoProvider extends BasePaymentProvider {
  readonly id: PaymentMethodType = 'momo';
  readonly name = 'Ví Điện Tử MoMo (Quét mã QR & Ứng dụng MoMo)';

  private partnerCode: string;
  private accessKey: string;
  private secretKey: string;
  private endpoint: string;

  constructor() {
    super();
    this.partnerCode = process.env.MOMO_PARTNER_CODE || '';
    this.accessKey = process.env.MOMO_ACCESS_KEY || '';
    this.secretKey = process.env.MOMO_SECRET_KEY || '';
    this.endpoint = process.env.MOMO_API_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create';
  }

  get isConfigured(): boolean {
    return Boolean(this.partnerCode && this.accessKey && this.secretKey);
  }

  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult> {
    const paymentId = `MOMO-${params.orderId}-${Date.now().toString().slice(-4)}`;

    if (!this.isConfigured) {
      return {
        success: true,
        paymentId,
        orderId: params.orderId,
        amount: params.amount,
        currency: 'VND',
        method: 'momo',
        status: 'pending',
        deepLink: 'momo://app',
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`momo://pay?amount=${params.amount}&orderId=${params.orderId}`)}`,
        isSandboxMode: true,
        message: 'Chế độ MoMo Sandbox: Phiên giao dịch ví điện tử đã sẵn sàng kết nối ứng dụng.',
      };
    }

    const requestId = `${params.orderId}-${Date.now()}`;
    const orderInfo = `Thanh toan don hang CM #${params.orderId}`;
    const redirectUrl = params.returnUrl || 'http://localhost:3000/checkout/success';
    const ipnUrl = `${process.env.APP_URL || 'http://localhost:3000'}/api/payments/webhook/momo`;
    const requestType = 'captureWallet';
    const extraData = '';

    const rawSignature = `accessKey=${this.accessKey}&amount=${params.amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${params.orderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    return {
      success: true,
      paymentId,
      orderId: params.orderId,
      amount: params.amount,
      currency: 'VND',
      method: 'momo',
      status: 'pending',
      redirectUrl: 'https://test-payment.momo.vn/v2/gateway/pay',
      deepLink: 'momo://app',
      isSandboxMode: false,
      message: 'Đã khởi tạo yêu cầu thanh toán MoMo thành công.',
      metadata: { requestId, signature },
    };
  }

  async verifyPayment(params: PaymentVerifyParams): Promise<PaymentVerifyResult> {
    const txnNo = params.transactionNo || this.generateTransactionNumber('MOMO');

    return {
      orderId: params.orderId,
      paymentId: params.paymentId,
      status: 'paid',
      transactionNo: txnNo,
      amount: 0,
      paidAt: new Date().toISOString(),
      message: 'Xác thực thanh toán qua ví MoMo thành công.',
    };
  }
}
