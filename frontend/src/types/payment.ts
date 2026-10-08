export interface PayHereFields {
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  order_id: string;
  items: string;
  currency: string;
  amount: string;
  hash: string;
}

export interface PayHereCheckoutResponse {
  success: boolean;
  data: {
    paymentUrl: string;
    fields: PayHereFields;
  };
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency?: string;
  status?: string;
  paymentMethod?: string;
  createdAt?: string;
  updatedAt?: string;
}