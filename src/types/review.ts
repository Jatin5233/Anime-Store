export interface Review {
  _id: string;
  userId: {
    name: string;
    avatar?: string;
  };
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
  helpful: number;
}
