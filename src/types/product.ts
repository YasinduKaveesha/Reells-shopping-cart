export type Category = {
  id: number;
  name: string;
  slug: string;
  icon: string;
};

export type ProductVariant = {
  label: string;
  price: number;
};

export type Product = {
  id: number;
  categoryId: number;
  category: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  imageLabel: string;
  image?: string;
  variants: ProductVariant[];
};
