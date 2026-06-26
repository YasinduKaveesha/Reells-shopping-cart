type MobileBottomCartBarProps = {
  itemCount: number;
  total: number;
};

export function MobileBottomCartBar({ itemCount, total }: MobileBottomCartBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-brand-surface p-3 shadow-panel lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-primaryDark">Cart</p>
          <p className="text-sm font-black text-brand-dark">
            {itemCount} items | Rs. {total}
          </p>
        </div>
        <button className="rounded-md bg-brand-primary px-4 py-3 text-sm font-black text-brand-textInverse transition hover:bg-brand-primaryDark" type="button">
          View cart
        </button>
      </div>
    </div>
  );
}
