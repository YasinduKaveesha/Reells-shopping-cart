import { Plus } from "lucide-react";
import { useState } from "react";
import type { Product } from "../../types/product";

type ProductCardProps = {
  product: Product;
  flat?: boolean;
  compact?: boolean;
};

export function ProductCard({ product, flat = false }: ProductCardProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const selectedVariant = product.variants[selectedVariantIndex] ?? product.variants[0];
  const price = selectedVariant?.price ?? product.price;
  const priceUnit = product.unit.replace(/^per\s+/i, "");
  const hasVariants = product.variants.length > 1;
  const isFreshProduct = product.category === "Vegetables" || product.category === "Fruits";

  return (
    <article
      className={[
        "group flex h-[clamp(340px,36vh,390px)] flex-col overflow-hidden rounded-xl bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01]",
        flat ? "shadow-none hover:shadow-none" : "shadow-[0_12px_36px_rgba(15,23,42,0.08)] hover:shadow-[0_20px_52px_rgba(15,23,42,0.14)]"
      ].join(" ")}
    >
      <div className="relative flex min-h-0 flex-[0_0_48%] items-center justify-center overflow-hidden border-b border-slate-100 bg-white px-4 py-3">
        {!imageFailed && product.image ? (
          <img
            className="max-h-[86%] max-w-[88%] object-contain object-center transition duration-300 group-hover:scale-[1.035]"
            src={product.image}
            alt={product.name}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="grid h-full w-full place-items-center rounded-lg bg-[#F5FBF4]">
            <span className="h-12 w-12 rounded-full bg-brand-primarySoft" aria-hidden="true" />
          </div>
        )}

        {isFreshProduct && (
          <span className="absolute left-3 top-3 rounded-full bg-[#FF6A3D] px-3 py-1 text-[0.68rem] font-black leading-none text-white shadow-[0_8px_18px_rgba(255,106,61,0.22)]">
            Fresh
          </span>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-3.5">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-lg font-black leading-snug text-brand-dark">
          {product.name}
        </h3>

        {hasVariants ? (
          <select
            className="mt-2 h-9 w-full rounded-lg border border-brand-primarySoft bg-[#F7FAF5] px-3 text-sm font-bold text-brand-textSecondary outline-none transition focus:border-[#64BF47] focus:ring-2 focus:ring-brand-primary/10"
            value={selectedVariantIndex}
            onChange={(event) => setSelectedVariantIndex(Number(event.target.value))}
            aria-label={`Choose ${product.name} variant`}
          >
            {product.variants.map((variant, index) => (
              <option key={`${product.id}-${variant.label}`} value={index}>
                {variant.label}
              </option>
            ))}
          </select>
        ) : null}

        <p className="mt-2 text-2xl font-black leading-tight text-brand-primaryDark">
          Rs. {price.toLocaleString()} / {priceUnit}
        </p>

        <button
          className="mt-auto inline-flex h-8 w-full items-center justify-center gap-2 rounded-lg bg-brand-primary text-base font-black text-brand-textInverse shadow-[0_10px_22px_rgba(100,191,71,0.24)] transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.015] hover:bg-brand-primaryDark hover:shadow-[0_14px_28px_rgba(100,191,71,0.34)] active:scale-[0.98]"
          type="button"
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
          Add
        </button>
      </div>
    </article>
  );
}
