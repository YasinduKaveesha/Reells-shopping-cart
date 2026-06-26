import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-md px-3 py-2 text-sm font-medium transition outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30",
    isActive ? "bg-brand-primary text-brand-textInverse" : "text-brand-textSecondary hover:bg-brand-surfaceMuted"
  ].join(" ");

export function Header() {
  const location = useLocation();
  const [shopTransitioning, setShopTransitioning] = useState(false);
  const showHeaderSearch = location.pathname !== "/shop" && !shopTransitioning;

  useEffect(() => {
    if (location.pathname === "/shop") {
      setShopTransitioning(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const hideSearch = () => setShopTransitioning(true);
    window.addEventListener("shop-transition-start", hideSearch);
    return () => window.removeEventListener("shop-transition-start", hideSearch);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-30 min-h-[8vh] transition-[background-color,backdrop-filter] duration-200",
        shopTransitioning || location.pathname === "/shop" ? "bg-brand-header" : "bg-brand-header/95 backdrop-blur"
      ].join(" ")}
    >
      <div className="mx-auto grid min-h-[8vh] max-w-[96vw] grid-cols-1 items-center gap-3 px-[2vw] py-[1vh] md:grid-cols-[minmax(18rem,1fr)_40vw_minmax(12rem,1fr)] md:gap-[2.5vw]">
        <div className="flex items-center gap-5 lg:gap-6">
          <NavLink to="/home" className="flex shrink-0 items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30">
            <span className="grid h-[5vh] min-h-10 w-[5vh] min-w-10 place-items-center rounded-md bg-brand-primary text-lg font-black text-brand-textInverse">
              G
            </span>
            <span className="text-lg font-black tracking-normal text-brand-dark">Grocery_SHOP</span>
          </NavLink>

          <NavLink
            to="/shop"
            className="shrink-0 rounded-md bg-brand-surface px-4 py-2 text-sm font-semibold text-brand-textPrimary outline-none transition hover:text-brand-primaryDark focus-visible:ring-2 focus-visible:ring-brand-primary/30"
          >
            Cart
          </NavLink>
        </div>

        <label
          className={[
            "relative block w-full justify-self-center transition-all duration-500 ease-out md:w-[20vw]",
            showHeaderSearch ? "translate-y-0 opacity-100" : "-translate-y-2 pointer-events-none opacity-0"
          ].join(" ")}
        >
          <span className="sr-only">Search products</span>
          <input
            className="h-8 w-full rounded-full border border-[#64BF47] bg-brand-surface py-0 pl-5 pr-10 text-sm outline-none transition placeholder:text-brand-textMuted focus:ring-2 focus:ring-brand-primary/10 md:h-[1.85vw] md:min-h-7 md:pl-[2vw]"
            placeholder="Search products..."
            type="text"
          />
          <button
            className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-brand-primaryDark transition hover:bg-brand-primarySoft"
            type="button"
            aria-label="Search products"
          >
            <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
        </label>

        <nav className="hidden shrink-0 items-center justify-self-end gap-1 md:flex">
          <NavLink to="/home" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/shop" className={navLinkClass}>
            Shop
          </NavLink>
          <button className="rounded-md px-3 py-2 text-sm font-medium text-brand-textMuted" type="button">
            Profile
          </button>
        </nav>
      </div>
    </header>
  );
}
