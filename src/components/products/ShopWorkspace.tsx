import type { Category, Product } from "../../types/product";
import { CategoryFilterBar } from "./CategoryFilterBar";
import { ProductGrid } from "./ProductGrid";
import { SearchInput } from "./SearchInput";

type ShopWorkspaceProps = {
  categories: Category[];
  products: Product[];
};

export function ShopWorkspace({ categories, products }: ShopWorkspaceProps) {
  return (
    <section className="flex-1 px-4 pb-28 pt-5 sm:px-6 lg:pb-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-primaryDark">Shopping workspace</p>
            <h1 className="mt-1 text-3xl font-black text-brand-dark">Browse groceries</h1>
          </div>
          <div className="w-full md:max-w-md">
            <SearchInput />
          </div>
        </div>

        <div className="mt-5">
          <CategoryFilterBar categories={categories} />
        </div>

        <div className="mt-6">
          <ProductGrid products={products} />
        </div>
      </div>
    </section>
  );
}
