type HomePanelProps = {
  title?: string;
  eyebrow: string;
  children: React.ReactNode;
  bg?: string;
  eyebrowStyle?: React.CSSProperties;
  accentWave?: boolean;
};

export function HomePanel({ title, eyebrow, children, bg = "#F5FBF4", eyebrowStyle, accentWave = false }: HomePanelProps) {
  const hasEyebrow = Boolean(eyebrow);
  const hasHeading = Boolean(eyebrow || title);

  return (
    <section className="rounded-md p-5 shadow-panel transition-shadow duration-300" style={{ background: bg, fontFamily: "'Poppins', sans-serif" }}>
      {hasEyebrow && accentWave ? (
        <div className="relative inline-block">
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "#FD9C46",
              clipPath: "polygon(0 0, 88% 0, 96% 18%, 100% 50%, 96% 82%, 88% 100%, 0 100%)",
              borderRadius: "4px 0 0 4px",
              opacity: 0.35,
            }}
          />
          <p
            className="relative font-bold uppercase tracking-wider"
            style={{ ...(eyebrowStyle ?? { fontSize: "clamp(0.7rem,0.9vw,1.1rem)" }), padding: "2px 28px 2px 4px" }}
          >
            {eyebrow}
          </p>
        </div>
      ) : hasEyebrow ? (
        <p
          className="font-bold uppercase tracking-wider text-brand-primaryDark"
          style={eyebrowStyle ?? { fontSize: "clamp(0.7rem,0.9vw,1.1rem)" }}
        >
          {eyebrow}
        </p>
      ) : null}
      {title && (
        <h2
          className="mt-2 font-black text-brand-dark"
          style={{ fontSize: "clamp(1.39rem,1.76vw,2.21rem)" }}
        >
          {title}
        </h2>
      )}
      <div className={hasHeading ? "mt-4" : ""}>{children}</div>
    </section>
  );
}
