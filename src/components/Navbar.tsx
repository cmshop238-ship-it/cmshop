import React, { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, ShieldAlert } from 'lucide-react';
import { Logo } from './Logo';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPath?: string;
  onNavigate: (path: string) => void;
  isTransparent?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath = '/',
  onNavigate,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { totalQuantity, openCart } = useCart();
  const { wishlistIds, openWishlist } = useWishlist();
  const { openSearch } = useShop();
  const { user, openAuthModal, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Sản phẩm', path: '/products' },
    { label: 'Danh mục', path: '/categories' },
    { label: 'Bộ sưu tập', path: '/lookbook' },
    { label: 'Về CM', path: '/about' },
    { label: 'Liên hệ', path: '/contact' },
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-white/95 backdrop-blur-md text-[#1A1A1A] border-b border-[#E5E5E1] ${
        isScrolled ? 'shadow-xs' : ''
      }`}
    >
      {/* Top Banner for Geometric Announcements */}
      <div className="w-full bg-[#1A1A1A] text-[#E5E5E1] text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.2em] text-center py-2 px-4 uppercase border-b border-[#E5E5E1]/10 flex items-center justify-center gap-4">
        <span>Miễn phí giao hàng tiêu chuẩn toàn quốc cho đơn từ 2.000.000đ</span>
        <span className="hidden md:inline text-neutral-500">•</span>
        <span className="hidden md:inline text-neutral-300">Mã ưu đãi: <strong className="text-white font-semibold">CM10</strong> (-10%)</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Left: Mobile menu button & Logo */}
          <div className="flex items-center gap-8 lg:gap-12">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-inherit hover:opacity-60 transition-opacity cursor-pointer"
              aria-label="Mở menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              id="brand-logo-btn"
              onClick={() => {
                onNavigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="focus:outline-none text-left cursor-pointer transition-opacity hover:opacity-80"
            >
              <Logo variant="dark" size="md" />
            </button>

            {/* Desktop Navigation Menu adjacent to Logo */}
            <nav id="desktop-nav" className="hidden lg:flex items-center space-x-8 text-[11px] font-semibold tracking-[0.2em] uppercase">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => onNavigate(link.path)}
                    className={`transition-opacity cursor-pointer py-1 relative ${
                      isActive
                        ? 'opacity-100 font-bold border-b border-current pb-0.5'
                        : 'opacity-70 hover:opacity-100 font-semibold'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions (Search, Account, Wishlist, Cart, Admin quick-tag) */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-sm">
            {/* Admin Portal Quick Jump button */}
            {isAdmin && (
              <button
                id="admin-dashboard-jump-btn"
                onClick={() => onNavigate('/admin')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase bg-[#1A1A1A] text-white hover:bg-neutral-800 transition-colors border border-neutral-700 cursor-pointer"
                title="Truy cập Bảng điều khiển Quản trị viên"
              >
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                <span>Admin</span>
              </button>
            )}

            {/* Search Trigger */}
            <button
              id="search-trigger-btn"
              onClick={openSearch}
              className="p-1.5 text-inherit hover:opacity-60 transition-opacity cursor-pointer relative"
              aria-label="Tìm kiếm sản phẩm"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Account / Login Trigger */}
            <button
              id="account-nav-btn"
              onClick={() => {
                if (user) {
                  onNavigate('/account');
                } else {
                  openAuthModal('login');
                }
              }}
              className="p-1.5 text-inherit hover:opacity-60 transition-opacity cursor-pointer relative"
              aria-label="Tài khoản"
            >
              <User className="w-5 h-5 stroke-[1.5]" />
              {user && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              )}
            </button>

            {/* Wishlist Trigger */}
            <button
              id="wishlist-nav-btn"
              onClick={openWishlist}
              className="p-1.5 text-inherit hover:opacity-60 transition-opacity cursor-pointer relative"
              aria-label="Danh sách yêu thích"
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-[#1A1A1A] text-white text-[8px] font-bold flex items-center justify-center rounded-full border border-white">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              id="cart-nav-btn"
              onClick={openCart}
              className="p-1.5 text-inherit hover:opacity-60 transition-opacity cursor-pointer relative"
              aria-label="Giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-[#1A1A1A] text-white text-[8px] font-bold flex items-center justify-center rounded-full border border-white">
                  {totalQuantity}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Overlay Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-sm bg-[#F9F9F7] text-[#1A1A1A] h-full shadow-2xl z-10 flex flex-col p-8 overflow-y-auto border-r border-[#E5E5E1]">
            <div className="flex items-center justify-between pb-6 border-b border-[#E5E5E1]">
              <Logo size="sm" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-neutral-600 hover:text-black cursor-pointer"
                aria-label="Đóng menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex flex-col space-y-4 py-6">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => {
                      onNavigate(link.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left text-xs font-semibold tracking-[0.2em] uppercase py-2 transition-opacity cursor-pointer ${
                      isActive ? 'font-bold text-[#1A1A1A] opacity-100' : 'text-[#1A1A1A] opacity-70 hover:opacity-100'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}

              <div className="pt-6 border-t border-[#E5E5E1] flex flex-col gap-3">
                <button
                  onClick={() => {
                    onNavigate('/admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-800 flex items-center gap-2 py-1"
                >
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>Trang Quản trị (Admin)</span>
                </button>

                <button
                  onClick={() => {
                    if (user) {
                      onNavigate('/account');
                    } else {
                      openAuthModal('login');
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-[11px] tracking-[0.15em] uppercase text-neutral-600 hover:text-black flex items-center gap-2 py-1"
                >
                  <User className="w-4 h-4" />
                  <span>{user ? `Tài khoản (${user.fullName})` : 'Đăng nhập / Đăng ký'}</span>
                </button>
              </div>
            </div>

            {/* Mobile Footer Info */}
            <div className="mt-auto pt-6 border-t border-[#E5E5E1] text-[10px] tracking-wider text-neutral-500 leading-relaxed uppercase">
              <p className="font-bold text-[#1A1A1A]">CM QUALITY PRODUCTS</p>
              <p>Hotline: 1900 8899 (08:00 - 22:00)</p>
              <p>Email: concierge@cm.luxury</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
