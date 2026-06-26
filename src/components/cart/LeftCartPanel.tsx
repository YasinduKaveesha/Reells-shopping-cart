import { Link } from "react-router-dom";
import type { CartItem } from "../../types/cart";
import { CartItemRow } from "./CartItemRow";
import { CartSummary } from "./CartSummary";

type LeftCartPanelProps = {
  items: CartItem[];
};

export function LeftCartPanel({ items }: LeftCartPanelProps) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <aside className="hidden min-h-[calc(100vh-73px)] w-[340px] shrink-0 bg-brand-dark p-5 lg:flex lg:flex-col">
      <Link
        to="/home"
        className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-brand-darkSoft text-xl font-black text-brand-textInverse"
        aria-label="Go home"
      >
        G
      </Link>

      <div className="mt-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-primarySoft">Persistent cart</p>
          <h2 className="mt-1 text-3xl font-black text-brand-textInverse">Cart</h2>
        </div>
        <span className="rounded-full bg-brand-darkSoft px-3 py-1 text-xs font-bold text-brand-textInverse">{itemCount} items</span>
      </div>

      <div className="mt-5 flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
        {items.map((item) => (
          <CartItemRow item={item} key={item.id} />
        ))}
      </div>

      <div className="mt-5">
        <CartSummary itemCount={itemCount} total={total} />
      </div>
    </aside>
  );
}
