import { BasePaymentProvider } from './BasePaymentProvider';
import {
  PaymentMethodType,
  CreatePaymentIntentParams,
  PaymentIntentResult,
  PaymentVerifyParams,
  PaymentVerifyResult,
} from '../types';

export class CodProvider extends BasePaymentProvider {
  readonly id: PaymentMethodType = 'cod';
  readonly name = 'Thanh toán tiền mặt khi nhận hàng (COD)';

  readonly isConfigured = true;

  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult> {
    const paymentId = `COD-${params.orderId}-${Date.now().toString().slice(-4)}`;

    return {
      success: true,
      paymentId,
      orderId: params.orderId,
      amount: params.amount,
      currency: 'VND',
      method: 'cod',
      status: 'pending',
      isSandboxMode: false,
      message: 'Đơn hàng sẽ được thanh toán trực tiếp cho nhân viên vận chuyển khi quý khách đồng kiểm sản phẩm.',
      metadata: {
        codFee: 0,
        inspectionAllowed: true,
      },
    };
  }

  async verifyPayment(params: PaymentVerifyParams): Promise<PaymentVerifyResult> {
    return {
      orderId: params.orderId,
      paymentId: params.paymentId,
      status: 'paid',
      transactionNo: this.generateTransactionNumber('COD'),
      amount: 0,
      paidAt: new Date().toISOString(),
      message: 'Ghi nhận thanh toán COD hoàn tất khi giao hàng.',
    };
  }
}
