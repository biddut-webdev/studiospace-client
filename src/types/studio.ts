export type TReview = {
  _id: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type TStudio = {
  _id: string;
  title: string;
  rating?: number;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  images?: string[];
  amenities: string[];
  overview: string;
  hostName: string;
  hostEmail: string;
  createdAt: string;
  reviews?: TReview[];
};