import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Updates", href: "#updates" },
  { label: "FAQ", href: "#faq" },
  { label: "Book Now", href: "#booking", highlight: true },
  { label: "Pay", href: "#payment" },
];

// Placeholder logo — swap with your actual logo asset
function LogoMark() {
  return (
    <div className="w-11 h-11 rounded-xl bg-teal-800 border border-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
      <span
        className="text-amber-200 font-bold text-lg leading-none select-none"
        style={{ fontFamily: "Georgia, serif", letterSpacing: "-0.03em" }}
      >
        MJ
      </span>
    </div>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Add backdrop + border after scrolling past 40px
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-stone-950/90 backdrop-blur-md border-b border-white/10 shadow-lg"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 sm:h-[72px]">

          {/* ── Brand ── */}
          <a
            href="#"
            className="flex items-center gap-3 group"
            aria-label="MJ Culture – Home"
          >
            <LogoMark />
            <span
              className="text-white text-sm font-semibold tracking-[0.22em] uppercase select-none group-hover:text-amber-200 transition-colors duration-200"
              style={{ fontFamily: "'Trebuchet MS', sans-serif" }}
            >
              MJ Culture
            </span>
          </a>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, href, highlight }) =>
              highlight ? (
                <a
                  key={label}
                  href={href}
                  className="ml-2 px-4 py-1.5 rounded border border-amber-400/70 text-amber-300 text-xs font-semibold tracking-[0.15em] uppercase hover:bg-amber-400/10 hover:border-amber-300 transition-all duration-200"
                >
                  {label}
                </a>
              ) : (
                <a
                  key={label}
                  href={href}
                  className="px-3.5 py-2 text-white/75 text-xs font-medium tracking-[0.15em] uppercase hover:text-amber-200 transition-colors duration-200 relative group"
                >
                  {label}
                  <span className="absolute bottom-0.5 left-3.5 right-3.5 h-px bg-amber-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                </a>
              )
            )}
          </nav>

          {/* ── Mobile hamburger ── */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={[
                "block h-px w-6 bg-white transition-all duration-300 origin-center",
                menuOpen ? "rotate-45 translate-y-[3px]" : "",
              ].join(" ")}
            />
            <span
              className={[
                "block h-px w-6 bg-white transition-all duration-300",
                menuOpen ? "opacity-0 scale-x-0" : "",
              ].join(" ")}
            />
            <span
              className={[
                "block h-px w-6 bg-white transition-all duration-300 origin-center",
                menuOpen ? "-rotate-45 -translate-y-[9px]" : "",
              ].join(" ")}
            />
          </button>
        </div>
      </header>

      {/* ── Mobile menu overlay ── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={[
          "fixed inset-0 z-40 flex flex-col bg-stone-950/97 backdrop-blur-lg transition-all duration-300 md:hidden",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        {/* spacer for header height */}
        <div className="h-16 sm:h-[72px]" />

        <nav className="flex flex-col items-center justify-center flex-1 gap-2 px-8 pb-16">
          {NAV_LINKS.map(({ label, href, highlight }, i) => (
            <a
              key={label}
              href={href}
              onClick={handleLinkClick}
              style={{
                transitionDelay: menuOpen ? `${i * 45}ms` : "0ms",
                transform: menuOpen ? "translateY(0)" : "translateY(12px)",
                opacity: menuOpen ? 1 : 0,
                transition: "opacity 300ms ease, transform 300ms ease",
              }}
              className={[
                "w-full max-w-xs text-center py-3.5 text-sm tracking-[0.2em] uppercase font-medium border-b transition-colors duration-200",
                highlight
                  ? "text-amber-300 border-amber-400/40 hover:text-amber-200"
                  : "text-white/70 border-white/10 hover:text-amber-200",
              ].join(" ")}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Decorative bottom branding */}
        <p className="text-center text-white/20 text-xs tracking-[0.2em] uppercase pb-8">
          MJ Culture · Dahod, Gujarat
        </p>
      </div>
    </>
  );
}