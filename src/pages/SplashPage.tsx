import { Link } from "react-router-dom";

export function SplashPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-brand-canvas px-4">
      <section className="w-full max-w-md rounded-md bg-brand-surface p-8 text-center shadow-panel">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-md bg-brand-primary text-4xl font-black text-brand-textInverse">
          G
        </div>
        <h1 className="mt-6 text-4xl font-black text-brand-dark">Grocery_SHOP</h1>
        <p className="mt-3 text-sm font-medium text-brand-textMuted">Fresh groceries, quick checkout.</p>
        <div className="mx-auto mt-6 h-2 w-40 overflow-hidden rounded-full bg-brand-surfaceMuted">
          <div className="h-full w-2/3 rounded-full bg-brand-primary" />
        </div>
        <Link
          className="mt-8 inline-flex rounded-md bg-brand-primary px-5 py-3 text-sm font-black text-brand-textInverse transition hover:bg-brand-primaryDark"
          to="/home"
        >
          Enter store
        </Link>
      </section>
    </main>
  );
}
