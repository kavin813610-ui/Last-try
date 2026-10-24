import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  WatchProduct,
  CartItem,
  CustomerOrder,
  CustomerEnquiry,
  StoreSettings,
  OrderStatus
} from '../types/store';
import {
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  INITIAL_ORDERS,
  INITIAL_ENQUIRIES
} from '../data/defaultProducts';

export type AppView =
  | 'home'
  | 'shop'
  | 'mens'
  | 'womens'
  | 'collections'
  | 'about'
  | 'contact'
  | 'product-detail'
  | 'checkout'
  | 'order-success'
  | 'track-order'
  | 'wishlist'
  | 'admin'
  | 'policy-terms'
  | 'policy-privacy'
  | 'policy-shipping'
  | 'policy-returns';

interface StoreContextType {
  products: WatchProduct[];
  cart: CartItem[];
  wishlist: string[];
  orders: CustomerOrder[];
  enquiries: CustomerEnquiry[];
  settings: StoreSettings;
  currentView: AppView;
  selectedProductId: string | null;
  selectedProduct: WatchProduct | null;
  isCartOpen: boolean;
  activeCoupon: string;
  appliedDiscountPercent: number;
  lastPlacedOrder: CustomerOrder | null;
  adminAuthenticated: boolean;
  searchFilterQuery: string;

  navigate: (view: AppView, productId?: string) => void;
  openProductDetail: (productId: string) => void;
  setIsCartOpen: (open: boolean) => void;
  setSearchFilterQuery: (q: string) => void;

  addToCart: (product: WatchProduct, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string, selectedColor: string) => void;
  updateCartQuantity: (productId: string, selectedColor: string, delta: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  placeOrder: (orderData: Omit<CustomerOrder, 'id' | 'createdAt'>) => CustomerOrder;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, courierName?: string) => void;

  submitEnquiry: (enquiry: Omit<CustomerEnquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateEnquiryStatus: (id: string, status: 'new' | 'replied' | 'archived') => void;

  setAdminAuthenticated: (auth: boolean) => void;
  addProduct: (product: Omit<WatchProduct, 'id' | 'dateAdded'>) => void;
  updateProduct: (id: string, updates: Partial<WatchProduct>) => void;
  deleteProduct: (id: string) => void;
  updateSettings: (updates: Partial<StoreSettings>) => void;
  resetAllData: () => void;

  cartSubtotal: number;
  cartDiscount: number;
  cartCount: number;
}

const STORAGE_PREFIX = 'n_collection_store_v2_';
const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<WatchProduct[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}products`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}cart`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}wishlist`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}orders`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ORDERS;
  });

  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}enquiries`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ENQUIRIES;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}settings`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SETTINGS;
  });

  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState('');
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState(0);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<CustomerOrder | null>(null);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [searchFilterQuery, setSearchFilterQuery] = useState('');

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}products`, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}cart`, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}wishlist`, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}enquiries`, JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(settings));
  }, [settings]);

  const navigate = (view: AppView, productId?: string) => {
    setCurrentView(view);
    if (productId) setSelectedProductId(productId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId) || null;

  const addToCart = (product: WatchProduct, quantity = 1, selectedColor?: string) => {
    const color = selectedColor || product.selectedDefaultColor || product.colors[0]?.name || 'Standard';
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedColor === color
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedColor === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor: color }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, selectedColor: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedColor === selectedColor)
      )
    );
  };

  const updateCartQuantity = (productId: string, selectedColor: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.selectedColor === selectedColor) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'NCOLLECTION10') {
      setActiveCoupon('NCOLLECTION10');
      setAppliedDiscountPercent(10);
      return { success: true, message: '10% promotional launch discount applied!' };
    }
    if (clean === 'FIRST15') {
      setActiveCoupon('FIRST15');
      setAppliedDiscountPercent(15);
      return { success: true, message: '15% welcome horologist discount applied!' };
    }
    return { success: false, message: 'Invalid coupon code. Try NCOLLECTION10' };
  };

  const removeCoupon = () => {
    setActiveCoupon('');
    setAppliedDiscountPercent(0);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartDiscount = Math.round((cartSubtotal * appliedDiscountPercent) / 100);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = (orderData: Omit<CustomerOrder, 'id' | 'createdAt'>): CustomerOrder => {
    const newOrder: CustomerOrder = {
      ...orderData,
      id: `NC-ORD-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString()
    };
    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    clearCart();
    removeCoupon();
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
    courierName?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              orderStatus: status,
              trackingNumber: trackingNumber ?? ord.trackingNumber,
              courierName: courierName ?? ord.courierName
            }
          : ord
      )
    );
  };

  const submitEnquiry = (enquiry: Omit<CustomerEnquiry, 'id' | 'createdAt' | 'status'>) => {
    const newEnq: CustomerEnquiry = {
      ...enquiry,
      id: `ENQ-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    setEnquiries((prev) => [newEnq, ...prev]);
  };

  const updateEnquiryStatus = (id: string, status: 'new' | 'replied' | 'archived') => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
  };

  const addProduct = (productData: Omit<WatchProduct, 'id' | 'dateAdded'>) => {
    const newProduct: WatchProduct = {
      ...productData,
      id: `NC-WAT-${Date.now().toString().slice(-4)}`,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<WatchProduct>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const resetAllData = () => {
    localStorage.clear();
    setProducts(INITIAL_PRODUCTS);
    setCart([]);
    setWishlist([]);
    setOrders(INITIAL_ORDERS);
    setEnquiries(INITIAL_ENQUIRIES);
    setSettings(INITIAL_SETTINGS);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        enquiries,
        settings,
        currentView,
        selectedProductId,
        selectedProduct,
        isCartOpen,
        activeCoupon,
        appliedDiscountPercent,
        lastPlacedOrder,
        adminAuthenticated,
        searchFilterQuery,
        navigate,
        openProductDetail,
        setIsCartOpen,
        setSearchFilterQuery,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        toggleWishlist,
        isInWishlist,
        placeOrder,
        updateOrderStatus,
        submitEnquiry,
        updateEnquiryStatus,
        setAdminAuthenticated,
        addProduct,
        updateProduct,
        deleteProduct,
        updateSettings,
        resetAllData,
        cartSubtotal,
        cartDiscount,
        cartCount
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};