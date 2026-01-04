export interface MenuItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalText: string;
  imageUrl?: string;
  imageType?: 'ai' | 'photo';
  createdAt: string;
  updatedAt: string;
}