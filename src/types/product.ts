export interface Product {
  _id: string;
  name: string;
  slug: string;
  anime: string;
  category?: 'collections' | 'keychains' | 'charger' | 'cover_and_cases' | 'gifts';
  character?: string;
  description?: string;

  images: string[];

  price: number;
  discountPrice?: number;
  stock: number;

  isLimitedEdition: boolean;
  isPreOrder: boolean;
  releaseDate?: string;

  tags: string[];

  ratings: {
    average: number;
    count: number;
  };

  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
