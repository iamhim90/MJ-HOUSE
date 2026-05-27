import { useEffect, useState } from "react";

import logo from "../../assets/logo.png";
import { navigation } from "../../data/navigation";
import { siteContent } from "../../data/siteContent";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <>
      <header
        className={[
          "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
          isScrolled
            ? "border-b border-[#3a2a18]/70 bg-[#0b0906]/95 shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-md"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="mx-auto flex h-20 w-full max-w-none items-center justify-between px-6 sm:px-[50px]">
          <a
            href="#"
            className="group flex items-center gap-[18px]"
            aria-label={`${siteContent.siteName} home`}
          >
            <img
              src={logo}
              alt=""
              className="h-[50px] w-[50px] rounded-[12px] object-cover shadow-[0_0_18px_rgba(216,183,115,0.12)] sm:h-[55px] sm:w-[55px]"
            />
            <span className="font-display hidden select-none text-[22px] font-medium uppercase leading-none tracking-[0.16em] text-[#f6f1e8] transition-colors duration-300 group-hover:text-[#d8b773] sm:block">
              {siteContent.siteName}
            </span>
          </a>

          <nav className="hidden items-center gap-[38px] min-[1200px]:flex" aria-label="Main navigation">
            {navigation.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-[14px] font-semibold uppercase tracking-[0.22em] text-[#c8c1b6]/78 transition-colors duration-300 hover:text-[#d8b773]"
              >
                {label}
              </a>
            ))}
          </nav>

          <button
            className="mj-menu-toggle h-11 w-11 items-center justify-center rounded-[4px] border border-white/10 text-[#f6f1e8] transition hover:border-[#d8b773]/60"
            style={{
              position: "fixed",
              top: 18,
              right: 24,
              zIndex: 80,
              display: "flex",
              color: "#f6f1e8",
            }}
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span className="flex h-5 w-5 flex-col items-center justify-center gap-[5px]" aria-hidden="true">
              <span
                className={[
                  "block h-px w-5 bg-current transition-transform duration-300",
                  menuOpen ? "translate-y-[6px] rotate-45" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "block h-px w-5 bg-current transition-opacity duration-300",
                  menuOpen ? "opacity-0" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "block h-px w-5 bg-current transition-transform duration-300",
                  menuOpen ? "-translate-y-[6px] -rotate-45" : "",
                ].join(" ")}
              />
            </span>
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={[
          "fixed inset-0 z-40 flex flex-col bg-[#0b0906]/97 backdrop-blur-lg transition-all duration-300 lg:hidden",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div className="h-20" />

        <nav className="flex flex-1 flex-col items-center justify-center gap-2 px-8 pb-16">
          {navigation.map(({ label, href }, index) => (
            <a
              key={label}
              href={href}
              onClick={handleLinkClick}
              style={{
                transitionDelay: menuOpen ? `${index * 45}ms` : "0ms",
                transform: menuOpen ? "translateY(0)" : "translateY(12px)",
                opacity: menuOpen ? 1 : 0,
                transition: "opacity 300ms ease, transform 300ms ease",
              }}
              className="w-full max-w-xs border-b border-white/10 py-4 text-center text-[13px] font-semibold uppercase tracking-[0.22em] text-[#c8c1b6]/80 transition-colors duration-200 hover:text-[#d8b773]"
            >
              {label}
            </a>
          ))}
        </nav>

        <p className="pb-8 text-center text-[11px] uppercase tracking-[0.24em] text-white/20">
          MJ Culture · Dahod, Gujarat
        </p>
      </div>
    </>
  );
}
