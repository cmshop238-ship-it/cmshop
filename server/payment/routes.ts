import { Router, Request, Response } from 'express';
import { paymentGatewayManager } from './PaymentGatewayManager';
import { CreatePaymentIntentParams, PaymentVerifyParams, PaymentMethodType } from './types';

export const paymentRouter = Router();

/**
 * GET /api/payments/methods
 * Returns list of supported payment channels and their configuration status
 */
paymentRouter.get('/methods', (req: Request, res: Response) => {
  try {
    const methods = paymentGatewayManager.getAvailableMethods();
    res.json({
      success: true,
      methods,
      meta: {
        total: methods.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/payments/create-intent
 * Creates a server-authoritative payment intent with cryptographic signatures
 */
paymentRouter.post('/create-intent', async (req: Request, res: Response) => {
  try {
    const params: CreatePaymentIntentParams = req.body;

    if (!params.orderId || !params.amount || !params.method) {
      return res.status(400).json({
        success: false,
        error: 'Thiếu thông tin bắt buộc (orderId, amount, method).',
      });
    }

    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    params.ipAddress = clientIp.split(',')[0].trim();

    const result = await paymentGatewayManager.createPaymentIntent(params);
    return res.json({ success: true, ...result });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Lỗi xử lý tạo yêu cầu thanh toán trên máy chủ.',
    });
  }
});

/**
 * POST /api/payments/verify
 * Validates transaction outcome and signs digital proof
 */
paymentRouter.post('/verify', async (req: Request, res: Response) => {
  try {
    const params: PaymentVerifyParams = req.body;

    if (!params.orderId || !params.paymentId) {
      return res.status(400).json({
        success: false,
        error: 'Thiếu thông tin đối soát thanh toán (orderId, paymentId).',
      });
    }

    const result = await paymentGatewayManager.verifyPayment(params);
    return res.json({ success: true, ...result });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Lỗi đối soát giao dịch thanh toán.',
    });
  }
});

/**
 * POST /api/payments/webhook/:provider
 * Handles asynchronous IPN callbacks from external payment providers
 */
paymentRouter.post('/webhook/:provider', async (req: Request, res: Response) => {
  try {
    const providerId = req.params.provider as PaymentMethodType;
    const webhookResult = await paymentGatewayManager.handleWebhook(
      providerId,
      req.body,
      req.headers
    );

    // Standard acknowledge response for payment gateways
    return res.json({
      RspCode: '00',
      Message: 'Confirm Success',
      data: webhookResult,
    });
  } catch (error: any) {
    return res.status(400).json({
      RspCode: '99',
      Message: error.message || 'Unknown Error in Webhook Handler',
    });
  }
});
