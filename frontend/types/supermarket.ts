export interface Supermarket {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  description?: string;
  color?: string;
  discountItems?: DiscountItem[];
}

export interface DiscountItem {
  id: string;
  name: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  supermarketId: string;
  image?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}
