import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomePanel } from "../components/home/HomePanel";
import { ProductCard } from "../components/products/ProductCard";
import { mockCategories, mockProducts } from "../data/mockData";

const ALL_CATEGORY_ID = mockCategories[0]?.id ?? 1;
const SHOP_TRANSITION_MS = 760;
const SHOP_ROUTE_DELAY_MS = 620;
const SHOP_TRANSITION_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const offerImages = [
  "/images/offers/offerImg1.png",
  "/images/offers/offerImg3.png",
  "/images/offers/offerImg2.png"
];

export function HomePage() {
  const navigate = useNavigate();
  const [openingShop, setOpeningShop] = useState(false);
  const [heroLeaving, setHeroLeaving] = useState(false);
  const [heroButtonTransition, setHeroButtonTransition] = useState(false);
  const [transitionCategoryId, setTransitionCategoryId] = useState(ALL_CATEGORY_ID);
  const [bestSellingOffset, setBestSellingOffset] = useState(0);
  const [offerSlide, setOfferSlide] = useState(0);
  const [offerSliding, setOfferSliding] = useState(true);
  const previewProducts = mockProducts.slice(0, 6);
  const offerTrackImages = [...offerImages, offerImages[0]];

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const portalRef = useRef<HTMLElement>(null);
  const productGridRef = useRef<HTMLDivElement>(null);
  const openingShopRef = useRef(false);

  const openShop = useCallback((categoryId: number = ALL_CATEGORY_ID) => {
    navigate("/shop", { state: { categoryId } });
  }, [navigate]);

  const transitionProducts = useMemo(() => {
    const selectedCategory = mockCategories.find((category) => category.id === transitionCategoryId);

    if (!selectedCategory || selectedCategory.slug === "all") {
      return mockProducts;
    }

    return mockProducts.filter((product) => product.categoryId === selectedCategory.id);
  }, [transitionCategoryId]);
  const homeTransitionProducts = transitionProducts.slice(0, 18);
  const visibleTransitionProducts = openingShop || heroButtonTransition ? transitionProducts : homeTransitionProducts;

  const animateIntoShop = useCallback((categoryId: number = ALL_CATEGORY_ID) => {
    if (openingShopRef.current) return;

    openingShopRef.current = true;
    window.dispatchEvent(new Event("shop-transition-start"));
    setTransitionCategoryId(categoryId);

    const beforeRects = new Map<string, DOMRect>();
    productGridRef.current?.querySelectorAll<HTMLElement>("[data-product-id]").forEach((card) => {
      beforeRects.set(card.dataset.productId ?? "", card.getBoundingClientRect());
    });

    setOpeningShop(true);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        productGridRef.current?.querySelectorAll<HTMLElement>("[data-product-id]").forEach((card) => {
          const id = card.dataset.productId ?? "";
          const before = beforeRects.get(id);
          if (!before) return;

          const after = card.getBoundingClientRect();
          const deltaX = before.left - after.left;
          const deltaY = before.top - after.top;

          card.animate(
            [
              { transform: `translate(${deltaX}px, ${deltaY}px)`, opacity: 0.98 },
              { transform: "translate(0, 0)", opacity: 1 }
            ],
            {
              duration: SHOP_TRANSITION_MS,
              easing: SHOP_TRANSITION_EASING,
              fill: "both"
            }
          );
        });
      });
    });

    window.setTimeout(() => {
      openShop(categoryId);
    }, SHOP_ROUTE_DELAY_MS);
  }, [openShop]);

  const startShoppingFromHero = useCallback(() => {
    if (openingShopRef.current) return;

    openingShopRef.current = true;
    setHeroLeaving(true);
    setHeroButtonTransition(true);
    window.dispatchEvent(new Event("shop-transition-start"));

    window.setTimeout(() => {
      containerRef.current?.scrollTo({ top: portalRef.current?.offsetTop ?? 0, behavior: "smooth" });
    }, 80);

    window.setTimeout(() => {
      openShop(ALL_CATEGORY_ID);
    }, 760);
  }, [openShop]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setOfferSliding(true);
      setOfferSlide((current) => current + 1);
    }, 3500);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBestSellingOffset((current) => (current + 1) % 6);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (offerSlide !== offerImages.length) return;

    const resetTimer = window.setTimeout(() => {
      setOfferSliding(false);
      setOfferSlide(0);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setOfferSliding(true));
      });
    }, 500);

    return () => window.clearTimeout(resetTimer);
  }, [offerSlide]);

  // Deterministic, gesture-aware scrolling (native non-passive listener so preventDefault works).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let step = el.scrollTop > el.clientHeight / 2 ? 1 : 0;
    let activeGestureOwner: "main" | "best-selling" | null = null;
    let mainLocked = false;
    let pendingMainDelta: number | null = null;
    let bestSellingLocked = false;
    let pendingBestSellingDelta: number | null = null;
    let mainUnlockTimer: number | undefined;
    let bestSellingQuietTimer: number | undefined;
    let gestureTimer: number | undefined;
    let lastWheelAt = 0;
    let lastWheelAbs = 0;
    let mainLockStartedAt = 0;

    const MAIN_SCROLL_FALLBACK_MS = 760;
    const BEST_SELLING_ACTION_MS = 700;
    const WHEEL_SESSION_GAP_MS = 35;

    const extendWheelSession = (owner: "main" | "best-selling") => {
      activeGestureOwner = owner;

      if (gestureTimer) {
        window.clearTimeout(gestureTimer);
      }

      gestureTimer = window.setTimeout(() => {
        activeGestureOwner = null;
      }, WHEEL_SESSION_GAP_MS);
    };

    const lockMainUntilScrollFinishes = () => {
      mainLocked = true;
      mainLockStartedAt = performance.now();
      pendingMainDelta = null;

      const finishAction = () => {
        el.removeEventListener("scrollend", finishAction);
        if (mainUnlockTimer) {
          window.clearTimeout(mainUnlockTimer);
          mainUnlockTimer = undefined;
        }

        mainLocked = false;

        if (pendingMainDelta !== null) {
          const deltaY = pendingMainDelta;
          pendingMainDelta = null;
          runMainAction(deltaY);
        }
      };

      if (mainUnlockTimer) {
        window.clearTimeout(mainUnlockTimer);
      }

      el.addEventListener("scrollend", finishAction);
      mainUnlockTimer = window.setTimeout(finishAction, MAIN_SCROLL_FALLBACK_MS);
    };

    const lockBestSellingUntilAnimationFinishes = () => {
      bestSellingLocked = true;
      pendingBestSellingDelta = null;

      if (bestSellingQuietTimer) {
        window.clearTimeout(bestSellingQuietTimer);
      }

      bestSellingQuietTimer = window.setTimeout(() => {
        bestSellingLocked = false;

        if (pendingBestSellingDelta !== null) {
          const deltaY = pendingBestSellingDelta;
          pendingBestSellingDelta = null;
          runBestSellingAction(deltaY);
        }
      }, BEST_SELLING_ACTION_MS);
    };

    const runBestSellingAction = (deltaY: number) => {
      if (bestSellingLocked) {
        pendingBestSellingDelta = deltaY;
        return;
      }

      lockBestSellingUntilAnimationFinishes();
      setBestSellingOffset((prev) => (
        deltaY > 0 ? (prev + 1) % 6 : (prev - 1 + 6) % 6
      ));
    };

    const runMainAction = (deltaY: number) => {
      if (mainLocked) {
        pendingMainDelta = deltaY;
        return;
      }

      if (deltaY > 0) {
        if (step === 0) {
          // Scroll 1: hero -> image 2 (one clean snap).
          step = 1;
          lockMainUntilScrollFinishes();
          el.scrollTo({ top: portalRef.current?.offsetTop ?? el.clientHeight, behavior: "smooth" });
        } else {
          // Scroll 2: image 2 morphs upward into the shop layout, then routes.
          mainLocked = true;
          pendingMainDelta = null;
          animateIntoShop();
        }
      } else if (deltaY < 0 && step === 1) {
        // Scroll back up to the hero.
        step = 0;
        lockMainUntilScrollFinishes();
        el.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    const runGesture = (deltaY: number, intendedOwner: "main" | "best-selling") => {
      if (intendedOwner === "best-selling") {
        runBestSellingAction(deltaY);
      } else {
        runMainAction(deltaY);
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const wheelAbs = Math.abs(event.deltaY);
      if (wheelAbs < 4) return;

      const target = event.target instanceof Element ? event.target : null;
      const intendedOwner = target?.closest("[data-best-selling-scroller]") ? "best-selling" : "main";
      const now = performance.now();
      const wheelGap = lastWheelAt ? now - lastWheelAt : Number.POSITIVE_INFINITY;
      const previousWheelAbs = lastWheelAbs;
      const isNewSession = activeGestureOwner === null || wheelGap >= WHEEL_SESSION_GAP_MS;
      lastWheelAt = now;
      lastWheelAbs = wheelAbs;

      if (intendedOwner === "main" && mainLocked) {
        const hasFreshGestureShape = wheelAbs > Math.max(25, previousWheelAbs * 1.45);
        const lockHasSettled = now - mainLockStartedAt > 260;

        if (isNewSession && lockHasSettled && hasFreshGestureShape) {
          pendingMainDelta = event.deltaY;
        }

        extendWheelSession("main");
        return;
      }

      if (!isNewSession) {
        extendWheelSession(activeGestureOwner ?? intendedOwner);
        return;
      }

      extendWheelSession(intendedOwner);
      runGesture(event.deltaY, intendedOwner);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      if (mainUnlockTimer) {
        window.clearTimeout(mainUnlockTimer);
      }
      if (bestSellingQuietTimer) {
        window.clearTimeout(bestSellingQuietTimer);
      }
      if (gestureTimer) {
        window.clearTimeout(gestureTimer);
      }

      el.removeEventListener("wheel", onWheel);
    };
  }, [animateIntoShop]);

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-8vh)] overflow-hidden scroll-smooth snap-y snap-mandatory bg-brand-canvas"
    >
      <div className="mx-auto max-w-[89vw] px-[2vw]">
        <section
          ref={heroRef}
          className={[
            "mx-auto mt-[2vh] aspect-[1979/794] w-[77.9vw] snap-start rounded-md bg-brand-surface bg-cover bg-center p-[2vw] shadow-panel transition-all duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            heroLeaving ? "-translate-y-4 opacity-0" : "translate-y-0 opacity-100"
          ].join(" ")}
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.82) 38%, rgba(255,255,255,0.1) 70%), url('/images/herosection.png')"
          }}
        >
          <div className="flex h-full max-w-[44vw] flex-col justify-center">
            <h1 className="mt-[1vh] font-black leading-tight text-brand-dark" style={{ fontSize: "clamp(2.2rem,2.8vw,3.5rem)" }}>
              <span style={{ fontSize: "1.3em", color: "#4fa136" }}>Fresh</span>
              {" "}groceries,<br />ready for{" "}
              <span style={{ color: "#FD9C46" }}>your cart.</span>
            </h1>
            <p className="mt-[1.5vh] max-w-[34vw] text-sm leading-6 text-brand-textMuted">
              Browse daily essentials, fresh produce, and grocery deals in one simple shopping flow.
            </p>
            <div className="mt-[3.5vh] flex items-center gap-4">
              <button
                className="inline-flex w-fit rounded-md bg-brand-primary font-black text-brand-textInverse transition hover:bg-brand-primaryDark"
                style={{ padding: "clamp(0.6rem,1.1vh,0.9rem) clamp(1.2rem,2.4vw,2rem)", fontSize: "clamp(0.9rem,1.1vw,1.15rem)" }}
                onClick={startShoppingFromHero}
                type="button"
              >
                Start shopping
              </button>
              <button
                className="inline-flex w-fit rounded-md font-black transition"
                style={{
                  padding: "clamp(0.6rem,1.1vh,0.9rem) clamp(1.2rem,2.4vw,2rem)",
                  fontSize: "clamp(0.9rem,1.1vw,1.15rem)",
                  color: "#FD9C46",
                  border: "1.5px solid #FD9C46",
                  background: "transparent"
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#fff3e8")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                onClick={() => animateIntoShop()}
                type="button"
              >
                View deals
              </button>
            </div>
          </div>
        </section>

        {/* Image 2. The next shopping action routes into the real /shop page. */}
        <section ref={portalRef} className="flex h-[calc(100vh-8vh)] snap-start flex-col overflow-visible pt-[2vh]">
          <div className={["relative z-10 flex-none", openingShop || heroButtonTransition ? "overflow-hidden" : "overflow-visible"].join(" ")}>
            <div
              className={[
                "transition-[max-height,transform,opacity] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                openingShop || heroButtonTransition ? "max-h-0 -translate-y-[22vh] overflow-hidden opacity-0" : "max-h-[70vh] translate-y-0 overflow-visible",
                !openingShop && !heroButtonTransition ? "opacity-100" : ""
              ].join(" ")}
            >
              <div className="mx-auto w-[77.9vw]">
              <div
                className={[
                  "grid gap-[2.5vw] transition-[opacity,filter] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:grid-cols-[1.618fr_1fr]",
                  openingShop || heroButtonTransition ? "opacity-0" : "opacity-100"
                ].join(" ")}
              >
              <div
                className="relative"
                data-best-selling-scroller
              >
                {/* Dot indicator */}
                <div style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  zIndex: 10,
                }}>
                  {previewProducts.map((_, i) => (
                    <div key={i} style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: i === bestSellingOffset ? "#FD9C46" : "#64BF47",
                      transition: "background 0.32s ease",
                    }} />
                  ))}
                </div>
                <HomePanel eyebrow="Best Selling" bg="#F5FBF4" eyebrowStyle={{ fontSize: "clamp(1.58rem,2.02vw,2.52rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.02em", color: "#0f172a" }}>
                  <div
                    key={bestSellingOffset}
                    className="grid gap-[1vw] sm:grid-cols-3"
                    style={{ animation: "bsFadeUp 0.7s ease" }}
                  >
                    {[0, 1, 2].map((i) => {
                      const product = previewProducts[(bestSellingOffset + i) % previewProducts.length];
                      return (
                        <div className="overflow-hidden rounded-md" style={{ height: "30vh", background: "#FDFDFD" }} key={product.id}>
                          <div className="grid place-items-center rounded-t-md" style={{ height: "22.5vh", background: "#FDFDFD" }}>
                            {product.image
                              ? <img src={product.image} alt={product.name} style={{ maxHeight: "22.5vh", maxWidth: "100%", width: "auto", height: "auto" }} />
                              : <span className="text-xs font-bold text-brand-textMuted">{product.imageLabel}</span>
                            }
                          </div>
                          <div className="flex flex-col justify-center px-[0.7vw]" style={{ height: "7.5vh" }}>
                            <p className="truncate text-sm font-black text-brand-dark">{product.name}</p>
                            <p className="text-xs font-bold text-brand-primaryDark">Rs. {product.price}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </HomePanel>
              </div>

              <section
                className="overflow-hidden rounded-md bg-[#FEF5EA] shadow-panel transition-shadow duration-300"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  height: "calc(30vh + 3.5rem + clamp(2.37rem,3.03vw,3.78rem))"
                }}
              >
                <div className="relative h-full overflow-hidden bg-[#FEF5EA] text-brand-textPrimary">
                  <div
                    className={[
                      "flex h-full",
                      offerSliding ? "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" : ""
                    ].join(" ")}
                    style={{ transform: `translateX(-${offerSlide * 100}%)` }}
                  >
                    {offerTrackImages.map((image, index) => (
                      <button
                        className="relative h-full min-w-full overflow-hidden"
                        key={`${image}-${index}`}
                        onClick={() => animateIntoShop()}
                        type="button"
                        aria-label={`Open offer ${(index % offerImages.length) + 1}`}
                      >
                        <img
                          className="h-full w-full object-contain"
                          src={image}
                          alt={`Quick offer ${(index % offerImages.length) + 1}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </section>
              </div>
              </div>
            </div>
          </div>

          {/* Category bar + product preview. Click or scroll down once more to open /shop. */}
          <div
            className={[
              "relative flex min-h-0 flex-1 flex-col px-[1.4vw] pb-[1.4vw] transition-[margin,max-width,transform] duration-[760ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              openingShop || heroButtonTransition
                ? "z-20 mx-auto mt-0 w-full max-w-[85vw]"
                : "z-0 mx-auto mt-[2vh] w-full max-w-[77.9vw]"
            ].join(" ")}
            aria-label="Category section"
          >
            <div className="flex flex-none flex-wrap items-center justify-center gap-3 p-0">
              {mockCategories.map((category) => (
                <button
                  className={[
                    "inline-flex items-center rounded-full px-5 py-2 text-sm font-bold transition hover:bg-brand-primarySoft hover:text-brand-primaryDark",
                    openingShop || heroButtonTransition ? "shadow-none" : "shadow-panel",
                    category.id === transitionCategoryId
                      ? "bg-brand-primarySoft text-brand-primaryDark"
                      : "bg-brand-surface text-brand-textSecondary"
                  ].join(" ")}
                  key={category.id}
                  onClick={() => animateIntoShop(category.id)}
                  type="button"
                >
                  <span className="mr-2" aria-hidden="true">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>

            <div
              className="mt-[2vh] min-h-0 flex-1 cursor-pointer overflow-hidden rounded-md bg-[linear-gradient(135deg,#F5FBF4_0%,#F8FBF1_48%,#FFF7EC_100%)] px-[0.95vw] pt-[2vh] shadow-[0_0_48px_rgba(15,23,42,0.08)] transition-[transform,opacity] duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              onClick={() => animateIntoShop()}
            >
              <div
                ref={productGridRef}
                className={[
                  "grid grid-cols-1 gap-4 transition-[grid-template-columns,opacity,transform] duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:grid-cols-2",
                  openingShop || heroButtonTransition ? "translate-y-0 opacity-100 xl:grid-cols-9" : "translate-y-[1.2vh] opacity-95 xl:grid-cols-7"
                ].join(" ")}
              >
                {visibleTransitionProducts.map((product) => (
                  <div data-product-id={product.id} key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


