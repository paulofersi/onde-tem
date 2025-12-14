export interface FormData {
  name: string;
  originalPrice: string;
  discountPrice: string;
  supermarketId: string;
  image?: string;
}

export interface FormErrors {
  name?: string;
  originalPrice?: string;
  discountPrice?: string;
  supermarketId?: string;
  image?: string;
}
