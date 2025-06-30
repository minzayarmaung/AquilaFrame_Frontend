export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  icon: string;
}

export interface Notification {
  message: string;
  timestamp: string;
}
