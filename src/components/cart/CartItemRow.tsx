import type { CartItem } from "../../types/cart";
import { QuantityStepper } from "./QuantityStepper";

type CartItemRowProps = {
  item: CartItem;
};

export function CartItemRow({ item }: CartItemRowProps) {
  const lineTotal = item.price * item.quantity;

  return (
    <article className="rounded-md bg-brand-darkSoft p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-brand-textInverse">{item.name}</h3>
          <p className="mt-1 text-xs text-brand-borderStrong">
            Rs. {item.price} / {item.unit}
          </p>
        </div>
        <p className="text-sm font-black text-brand-accentSoft">Rs. {lineTotal}</p>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <QuantityStepper quantity={item.quantity} />
        <button className="text-xs font-bold text-brand-dangerSoft" type="button">
          Remove
        </button>
      </div>
    </article>
  );
}
