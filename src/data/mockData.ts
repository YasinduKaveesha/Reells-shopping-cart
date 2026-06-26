import catalog from "./grocery_shop_products.json";
import type { CartItem } from "../types/cart";
import type { Category, Product, ProductVariant } from "../types/product";

type RawCategory = {
  id: number;
  name: string;
  slug: string;
};

type RawProduct = {
  id: number;
  name: string;
  slug: string;
  category: string;
  unit: string;
  image?: string;
  description?: string;
  variants?: ProductVariant[];
};

const categoryIcons: Record<string, string> = {
  all: "🛒",
  vegetables: "🥦",
  fruits: "🍎",
  "biscuits-snacks": "🍪",
  "eggs-dairy": "🥛",
  "frozen-food": "❄️"
};

const rawCategories = catalog.categories as RawCategory[];
const rawProducts = catalog.products as RawProduct[];

const categoryIdByName = new Map(rawCategories.map((category) => [category.name, category.id]));

const describeProduct = (product: RawProduct) => {
  if (product.description?.trim()) return product.description.trim();

  if (product.category === "Vegetables" || product.category === "Fruits") {
    return "Fresh daily grocery pick.";
  }

  return "Packed for quick grocery orders.";
};

const categoryImageCounters = new Map<string, number>();

const getProductImage = (product: RawProduct) => {
  if (product.category === "Vegetables") {
    const nextIndex = (categoryImageCounters.get(product.category) ?? 0) + 1;
    categoryImageCounters.set(product.category, nextIndex);
    return `/images/products/vegg/${nextIndex}.png`;
  }

  if (product.category === "Fruits") {
    const nextIndex = (categoryImageCounters.get(product.category) ?? 0) + 1;
    categoryImageCounters.set(product.category, nextIndex);
    return `/images/products/fruits/${nextIndex}.png`;
  }

  return product.image;
};

export const mockCategories: Category[] = [
  { id: 0, name: "All", slug: "all", icon: categoryIcons.all },
  ...rawCategories.map((category) => ({
    ...category,
    icon: categoryIcons[category.slug] ?? "•"
  }))
];

export const mockProducts: Product[] = rawProducts.map((product) => {
  const variants = product.variants?.length ? product.variants : [{ label: product.unit, price: 0 }];
  const firstVariant = variants[0];

  return {
    id: product.id,
    categoryId: categoryIdByName.get(product.category) ?? 0,
    category: product.category,
    slug: product.slug,
    name: product.name,
    description: describeProduct(product),
    price: firstVariant.price,
    unit: product.unit,
    imageLabel: product.name,
    image: getProductImage(product),
    variants
  };
});

export const mockCartItems: CartItem[] = [];
