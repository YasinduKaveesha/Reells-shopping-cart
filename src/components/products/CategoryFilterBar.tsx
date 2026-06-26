import type { Category } from "../../types/product";

type CategoryFilterBarProps = {
  categories: Category[];
};

export function CategoryFilterBar({ categories }: CategoryFilterBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {categories.map((category, index) => (
        <button
          className={[
            "shrink-0 rounded-md px-4 py-2 text-sm font-bold",
            index === 0
              ? "bg-brand-primarySoft text-brand-primaryDark"
              : "bg-brand-surface text-brand-textSecondary"
          ].join(" ")}
          key={category.id}
          type="button"
        >
          <span className="mr-2" aria-hidden="true">{category.icon}</span>
          {category.name}
        </button>
      ))}
    </div>
  );
}
