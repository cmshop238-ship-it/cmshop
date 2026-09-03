import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { QuickViewModal } from './components/QuickViewModal';
import { AuthModal } from './components/AuthModal';
import { FloatingContactWidget } from './components/FloatingContactWidget';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AccountPage } from './pages/AccountPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LookbookPage } from './pages/LookbookPage';
import { ProductCategory } from './types';

// Map slug to category name helper
const getCategoryFromSlug = (slug: string): ProductCategory | undefined => {
  const map: Record<string, ProductCategory> = {
    'thoi-trang': 'Thời trang',
    'giay': 'Giày',
    'dong-ho': 'Đồng hồ',
    'tui-vi': 'Túi & Ví',
    'cong-nghe': 'Công nghệ',
    'phu-kien': 'Phụ kiện',
    'Thời trang': 'Thời trang',
    'Giày': 'Giày',
    'Đồng hồ': 'Đồng hồ',
    'Túi & Ví': 'Túi & Ví',
    'Công nghệ': 'Công nghệ',
    'Phụ kiện': 'Phụ kiện',
  };
  return map[slug] || map[decodeURIComponent(slug)];
};

const MainApp: React.FC = () => {
  // Current route path state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Custom SPA navigator with smooth top scroll
  const handleNavigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Route matching parser
  const renderCurrentPage = () => {
    // 1. Home
    if (currentPath === '/' || currentPath === '') {
      return <HomePage onNavigate={handleNavigate} />;
    }

    // 2. Checkout
    if (currentPath === '/checkout') {
      return <CheckoutPage onNavigate={handleNavigate} />;
    }

    // 3. Order Success (/order-success/:orderId)
    if (currentPath.startsWith('/order-success')) {
      const orderId = currentPath.split('/')[2] || '';
      return <OrderSuccessPage orderId={orderId} onNavigate={handleNavigate} />;
    }

    // 4. Account
    if (currentPath === '/account') {
      return <AccountPage onNavigate={handleNavigate} />;
    }

    // 5. Admin Dashboard
    if (currentPath === '/admin') {
      return <AdminDashboardPage onNavigate={handleNavigate} />;
    }

    // 6. About
    if (currentPath === '/about') {
      return <AboutPage onNavigate={handleNavigate} />;
    }

    // 7. Contact
    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    // 8. Lookbook
    if (currentPath === '/lookbook') {
      return <LookbookPage onNavigate={handleNavigate} />;
    }

    // 9. Categories overview page (/categories)
    if (currentPath === '/categories') {
      return <ProductsPage onNavigate={handleNavigate} />;
    }

    // 10. Category page (/category/:slug)
    if (currentPath.startsWith('/category/')) {
      const categorySlug = currentPath.split('/')[2];
      const matchedCategory = getCategoryFromSlug(categorySlug);
      return <ProductsPage key={categorySlug} initialCategory={matchedCategory} onNavigate={handleNavigate} />;
    }

    // 11. Product Detail page (/products/:slug)
    if (currentPath.startsWith('/products/') && currentPath.split('/')[2]) {
      const productSlug = currentPath.split('/')[2];
      return <ProductDetailPage slug={productSlug} onNavigate={handleNavigate} />;
    }

    // 12. All Products (/products)
    if (currentPath === '/products') {
      return <ProductsPage onNavigate={handleNavigate} />;
    }

    // Default Fallback to ProductsPage
    return <HomePage onNavigate={handleNavigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#111111] font-sans-clean antialiased selection:bg-neutral-900 selection:text-white">
      {/* Navigation Header */}
      <Navbar onNavigate={handleNavigate} currentPath={currentPath} />

      {/* Main Routed Page Body */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Global Interactive Modals & Drawers */}
      <CartDrawer onNavigate={handleNavigate} />
      <WishlistDrawer onNavigate={handleNavigate} />
      <SearchModal onNavigate={handleNavigate} />
      <QuickViewModal onNavigate={handleNavigate} />
      <AuthModal />
      <FloatingContactWidget onNavigate={handleNavigate} />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ShopProvider>
          <WishlistProvider>
            <CartProvider>
              <MainApp />
            </CartProvider>
          </WishlistProvider>
        </ShopProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
