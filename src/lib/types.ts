export interface Country {
  code: string;
  name: string;
  flag: string;
  region: string;
}

export interface Plan {
  id: string;
  countryCode: string;
  name: string;
  data: string;
  validity: string;
  price: number;
  type: 'physical' | 'api';
  coverage: string[];
  speed: string;
  features: string[];
}

export interface PhysicalESIM {
  id: string;
  countryCode: string;
  planId: string;
  qrCode: string; // Can be image URL or text
  qrCodeType: 'image' | 'text';
  status: 'available' | 'sold' | 'shipped';
  soldAt?: Date;
  shippedAt?: Date;
  customerEmail?: string;
}

export interface CartItem {
  plan: Plan;
  quantity: number;
}

export interface Customer {
  email: string;
  country: string;
  deviceType: string;
  name?: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  assignedESIMs?: PhysicalESIM[];
}
