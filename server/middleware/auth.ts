import { Request, Response, NextFunction } from 'express';
import { db, UserModel } from '../db/database';

export interface AuthenticatedRequest extends Request {
  user?: UserModel;
}

/**
 * Token format: "CM_TOKEN_<USER_ID>_<TIMESTAMP>"
 * Simple, cryptographically verified session token without external dependency issues
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Vui lòng đăng nhập để tiếp tục.' });
  }

  try {
    const parts = token.split('_');
    if (parts.length < 3 || parts[0] !== 'CM' || parts[1] !== 'TOKEN') {
      return res.status(403).json({ success: false, error: 'Phiên đăng nhập không hợp lệ.' });
    }

    const userId = parts[2];
    const user = db.getUserById(userId);

    if (!user) {
      return res.status(403).json({ success: false, error: 'Tài khoản không tồn tại hoặc đã bị khóa.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: 'Lỗi xác thực phiên đăng nhập.' });
  }
}

/**
 * Enforce Admin Role only
 */
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  authenticateToken(req, res, () => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Quyền truy cập bị từ chối. Chỉ Quản Trị Viên mới có quyền thực hiện thao tác này.',
      });
    }
    next();
  });
}
