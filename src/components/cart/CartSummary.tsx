type CartSummaryProps = {
  itemCount: number;
  total: number;
};

export function CartSummary({ itemCount, total }: CartSummaryProps) {
  return (
    <div className="rounded-md bg-brand-darkSoft p-4">
      <div className="flex items-center justify-between text-sm text-brand-borderStrong">
        <span>Items</span>
        <span>{itemCount}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-lg font-black text-brand-textInverse">
        <span>Total</span>
        <span>Rs. {total}</span>
      </div>
      <button
        className="mt-4 w-full rounded-md bg-brand-primary px-4 py-3 text-sm font-black text-brand-textInverse transition hover:bg-brand-primaryDark"
        type="button"
      >
        Checkout
      </button>
    </div>
  );
}
