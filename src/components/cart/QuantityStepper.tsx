type QuantityStepperProps = {
  quantity: number;
};

export function QuantityStepper({ quantity }: QuantityStepperProps) {
  return (
    <div className="grid h-9 w-28 grid-cols-3 overflow-hidden rounded-md bg-brand-surface text-sm font-bold">
      <button className="bg-brand-accentSoft text-brand-accentDark transition hover:bg-brand-accent hover:text-brand-textInverse" type="button" aria-label="Decrease quantity">
        -
      </button>
      <span className="grid place-items-center text-brand-dark">{quantity}</span>
      <button className="bg-brand-accentSoft text-brand-accentDark transition hover:bg-brand-accent hover:text-brand-textInverse" type="button" aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}
