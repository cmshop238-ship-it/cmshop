import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, UserAddress } from '../types';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register' | 'forgot';
  openAuthModal: (tab?: 'login' | 'register' | 'forgot') => void;
  closeAuthModal: () => void;
  login: (email: string, passwordPlain: string) => Promise<boolean>;
  register: (email: string, passwordPlain: string, fullName: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  addAddress: (address: Omit<UserAddress, 'id'>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { success, info, error } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot'>('login');

  const refreshUser = useCallback(async () => {
    try {
      const me = await authService.getMe();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const openAuthModal = useCallback((tab: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const login = useCallback(
    async (email: string, passwordPlain: string): Promise<boolean> => {
      try {
        const { user: loggedUser } = await authService.login(email, passwordPlain);
        setUser(loggedUser);
        setIsAuthModalOpen(false);
        success(`Đăng nhập thành công. Chào mừng ${loggedUser.fullName}!`);
        return true;
      } catch (err: any) {
        error(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.');
        return false;
      }
    },
    [success, error]
  );

  const register = useCallback(
    async (email: string, passwordPlain: string, fullName: string, phone?: string): Promise<boolean> => {
      try {
        const { user: registeredUser } = await authService.register(email, passwordPlain, fullName, phone);
        setUser(registeredUser);
        setIsAuthModalOpen(false);
        success(`Đăng ký thành công! Chào mừng thành viên mới ${fullName}`);
        return true;
      } catch (err: any) {
        error(err.message || 'Đăng ký thất bại.');
        return false;
      }
    },
    [success, error]
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    info('Đã đăng xuất khỏi tài khoản CM.');
  }, [info]);

  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      try {
        const updated = await authService.updateProfile(updates);
        setUser(updated);
        success('Đã cập nhật thông tin tài khoản.');
      } catch (err: any) {
        error(err.message || 'Không thể cập nhật thông tin.');
      }
    },
    [success, error]
  );

  const addAddress = useCallback(
    async (addr: Omit<UserAddress, 'id'>) => {
      try {
        const res = await authService.addAddress(addr);
        if (user) {
          setUser({ ...user, addresses: res.addresses });
        }
        success('Đã lưu địa chỉ giao hàng mới.');
      } catch (err: any) {
        error(err.message || 'Không thể thêm địa chỉ.');
      }
    },
    [user, success, error]
  );

  const deleteAddress = useCallback(
    async (addressId: string) => {
      try {
        const res = await authService.deleteAddress(addressId);
        if (user) {
          setUser({ ...user, addresses: res.addresses });
        }
        info('Đã xóa địa chỉ.');
      } catch (err: any) {
        error(err.message || 'Không thể xóa địa chỉ.');
      }
    },
    [user, info, error]
  );

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoading,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
