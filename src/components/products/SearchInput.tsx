export function SearchInput() {
  return (
    <label className="block">
      <span className="sr-only">Search products</span>
      <input
        className="h-12 w-full rounded-md bg-brand-surface px-4 text-sm outline-none transition placeholder:text-brand-textMuted focus:ring-2 focus:ring-brand-primary/10"
        placeholder="Search items..."
        type="search"
      />
    </label>
  );
}
