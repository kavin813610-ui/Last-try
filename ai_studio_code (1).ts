export type GenderCategory = 'Men' | 'Women' | 'Unisex';

export type WatchCategory =
  | 'Luxury Automatic'
  | 'Chrono Sport'
  | 'Heritage Diver'
  | 'Dress & Vintage'
  | 'Minimalist'
  | 'Accessories';

export type WatchStyle = 'Dress' | 'Sport' | 'Diver' | 'Chronograph' | 'Casual' | 'Luxury';

export type WatchCondition = 'Brand New' | 'Mint / Box & Papers' | 'Near Mint' | 'Collector Grade';

export interface WatchColorVariant {
  name: string;
  hex: string;
  inStock: boolean;
}

export interface WatchProduct {
  id: string;
  name: string;
  brand: string;
  reference: string;
  price: number; // in INR (₹)
  originalPrice: number; // MRP in INR
  discountPercent: number;
  gender: GenderCategory;
  category: WatchCategory;
  style: WatchStyle;
  condition: WatchCondition;
  colors: WatchColorVariant[];
  selectedDefaultColor?: string;
  images: string[];
  caseSize: string; // e.g. "40mm"
  caseMaterial: string; // e.g. "316L Stainless Steel"
  lugWidth: string;
  thickness: string;
  movement: string;
  powerReserve: string;
  waterResistance: string;
  dialColor: string;
  glassType: string;
  strapMaterial: string;
  warranty: string;
  stockCount: number;
  isAvailable: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isSpecialOffer?: boolean;
  rating: number;
  reviewsCount: number;
  summary: string;
  description: string;
  features: string[];
  isDemonstration: boolean;
  dateAdded: string;
}

export interface CartItem {
  product: WatchProduct;
  quantity: number;
  selectedColor: string;
}

export type OrderStatus =
  | 'Confirmed'
  | 'Dispatched from Andaman'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'cod' | 'upi' | 'bank_transfer' | 'gateway_pending';

export type PaymentStatus = 'pending' | 'verified' | 'paid' | 'cod_pending';

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface CustomerOrder {
  id: string;
  createdAt: string;
  items: CartItem[];
  customer: CustomerDetails;
  shippingMethod: 'free_speedpost' | 'express_air';
  shippingFee: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  courierName?: string;
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  total: number;
  notes?: string;
}

export interface CustomerEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'replied' | 'archived';
}

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  location: string;
  currency: string;
  freeShippingThreshold: number;
  expressShippingFee: number;
  codAvailable: boolean;
  codFee: number;
  upiId: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  businessHours: string;
  gatewayEnabled: boolean;
}