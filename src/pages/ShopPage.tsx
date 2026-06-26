import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { ProductCard } from "../components/products/ProductCard";
import { mockCategories, mockProducts } from "../data/mockData";

export function ShopPage() {
  const location = useLocation();
  const initialCategoryId = (location.state as { categoryId?: number } | null)?.categoryId ?? mockCategories[0]?.id ?? 1;
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);
  const [showPanelSearch, setShowPanelSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowPanelSearch(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    const selectedCategory = mockCategories.find((category) => category.id === selectedCategoryId);
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return mockProducts.filter((product) => {
      const matchesCategory = !selectedCategory || selectedCategory.slug === "all" || product.categoryId === selectedCategory.id;
      const matchesSearch = !normalizedSearch
        || product.name.toLowerCase().includes(normalizedSearch)
        || product.category.toLowerCase().includes(normalizedSearch)
        || product.unit.toLowerCase().includes(normalizedSearch)
        || product.variants.some((variant) => variant.label.toLowerCase().includes(normalizedSearch));

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategoryId]);

  return (
    <div className="h-[calc(100vh-8vh)] overflow-hidden bg-brand-canvas pt-[2vh]">
      <div className="mx-auto flex h-full w-full gap-[1.4vw] px-[2vw] pb-0">
        <aside
          className="flex h-full basis-[30%] flex-col overflow-hidden rounded-md bg-brand-surface shadow-panel"
          aria-label="Cart sidebar"
        >
          <div className="flex flex-none items-center justify-between border-b border-brand-primarySoft px-5 py-4">
            <button
              className="grid h-10 w-10 place-items-center rounded-md bg-brand-primary text-brand-textInverse shadow-panel transition hover:bg-brand-primaryDark active:scale-95"
              type="button"
              aria-label="Go home"
            >
              G
            </button>
            <button
              className="rounded-full px-4 py-2 text-sm font-bold text-brand-textMuted transition hover:bg-brand-primarySoft hover:text-brand-primaryDark"
              type="button"
            >
              Cancel
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center px-5 text-center text-sm font-semibold text-brand-textMuted">
            Select products to build your cart.
          </div>

          <div className="flex flex-none items-center justify-between border-t border-brand-primarySoft px-5 py-4">
            <span className="text-sm font-bold text-brand-dark">Cart</span>
            <span className="text-sm font-black text-brand-primaryDark">Rs. 0</span>
          </div>
        </aside>

        <section
          className="relative flex h-full min-w-0 basis-[70%] flex-col overflow-hidden pb-0"
          aria-label="Shop products"
        >
        <div className="flex flex-none flex-wrap items-center justify-center gap-3 p-0">
          {mockCategories.map((category) => (
            <button
              className={[
                "inline-flex items-center rounded-full px-5 py-2 text-sm font-bold shadow-panel transition hover:bg-brand-primarySoft hover:text-brand-primaryDark",
                selectedCategoryId === category.id
                  ? "bg-brand-primarySoft text-brand-primaryDark"
                  : "bg-brand-surface text-brand-textSecondary"
              ].join(" ")}
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              type="button"
            >
              <span className="mr-2" aria-hidden="true">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        <div className="scrollbar-none mt-[2vh] min-h-0 flex-1 overflow-y-auto rounded-md bg-[linear-gradient(135deg,#F5FBF4_0%,#F8FBF1_48%,#FFF7EC_100%)] px-[0.95vw] pt-[2vh] shadow-[0_0_48px_rgba(15,23,42,0.08)]">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </div>

        <label
          className={[
            "pointer-events-auto absolute bottom-[2.6vh] left-1/2 block w-[min(29.4vw,30.8rem)] -translate-x-1/2 rounded-full shadow-[0_0_34px_rgba(100,191,71,0.24),0_12px_28px_rgba(100,191,71,0.14)] transition-all duration-[488ms] ease-out hover:scale-[1.025] hover:shadow-[0_0_42px_rgba(100,191,71,0.34),0_16px_34px_rgba(100,191,71,0.2)] active:scale-[0.992] focus-within:scale-[1.025] focus-within:shadow-[0_0_46px_rgba(100,191,71,0.38),0_16px_36px_rgba(100,191,71,0.22)]",
            showPanelSearch ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          ].join(" ")}
        >
          <span className="sr-only">Search products</span>
          <input
            className="h-12 w-full rounded-full border border-transparent bg-brand-surface py-0 pl-6 pr-12 text-sm shadow-panel outline-none transition placeholder:text-brand-textMuted focus:border-[#64BF47] focus:ring-2 focus:ring-brand-primary/10"
            placeholder="Search products..."
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button
            className="absolute right-4 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-brand-primaryDark transition hover:bg-brand-primarySoft"
            type="button"
            aria-label="Search products"
          >
            <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
        </label>
        </section>
      </div>
    </div>
  );
}
