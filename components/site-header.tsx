"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";

type NavLabels = {
  home: string;
  menu: string;
  about: string;
  eventi: string;
  contact: string;
  openMenu: string;
  closeMenu: string;
};

export function SiteHeader({
  locale,
  nav,
}: {
  locale: Locale;
  nav: NavLabels;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Chiude il menu mobile al cambio rotta (reset in fase di render, non in un effetto).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: `/${locale}`, label: nav.home },
    { href: `/${locale}/menu`, label: nav.menu },
    { href: `/${locale}/chi-siamo`, label: nav.about },
    { href: `/${locale}/eventi`, label: nav.eventi },
    { href: `/${locale}/prenota`, label: nav.contact },
  ];

  const isActive = (href: string) =>
    href === `/${locale}` ? pathname === href : pathname.startsWith(href);

  /* Stessa pagina, lingua diversa: sostituisce solo il prefisso locale. */
  const pathFor = (target: Locale) => {
    const rest = pathname.replace(new RegExp(`^/${locale}`), "");
    return `/${target}${rest}`;
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-gold/10 bg-[rgba(14,12,10,0.85)] backdrop-blur-[12px]"
          : "bg-transparent",
      )}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.05 }}
        className={cn(
          "mx-auto flex max-w-[1200px] items-center justify-between px-6 transition-[height] duration-300",
          scrolled ? "h-16" : "h-20",
        )}
      >
        <Link
          href={`/${locale}`}
          className="font-display text-xl tracking-wide text-cream transition-colors duration-300 hover:text-gold-bright"
        >
          Tortellino <span className="italic text-gold">d&rsquo;Oro</span>
        </Link>

        <nav aria-label="principale" className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-300",
                isActive(link.href)
                  ? "text-gold-bright"
                  : "text-cream-muted hover:text-cream",
              )}
            >
              {link.label}
            </Link>
          ))}

          <div className="ml-2 flex items-center gap-2 border-l border-line pl-6 font-mono text-[11px] uppercase tracking-[0.2em]">
            {locales.map((l, i) => (
              <span key={l} className="flex items-center gap-2">
                {i > 0 && <span className="text-line">|</span>}
                <Link
                  href={pathFor(l)}
                  aria-current={l === locale ? "true" : undefined}
                  className={cn(
                    "transition-colors duration-300",
                    l === locale
                      ? "text-gold"
                      : "text-cream-muted hover:text-cream",
                  )}
                >
                  {l.toUpperCase()}
                </Link>
              </span>
            ))}
          </div>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? nav.closeMenu : nav.openMenu}
          aria-expanded={open}
          className="text-cream transition-colors hover:text-gold-bright md:hidden"
        >
          {open ? (
            <X size={22} strokeWidth={1.5} />
          ) : (
            <Menu size={22} strokeWidth={1.5} />
          )}
        </button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn(
              "fixed inset-x-0 bottom-0 z-40 flex flex-col justify-between bg-deep/[0.98] px-6 pb-12 pt-10 md:hidden",
              scrolled ? "top-16" : "top-20",
            )}
          >
            <nav aria-label="principale mobile" className="flex flex-col gap-2">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.4, ease: "easeOut" }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block border-b border-line/60 py-5 font-display text-4xl",
                      isActive(link.href) ? "text-gold" : "text-cream",
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="flex items-center gap-3 font-mono text-sm uppercase tracking-[0.2em]">
              {locales.map((l, i) => (
                <span key={l} className="flex items-center gap-3">
                  {i > 0 && <span className="text-line">|</span>}
                  <Link
                    href={pathFor(l)}
                    className={l === locale ? "text-gold" : "text-cream-muted"}
                  >
                    {l.toUpperCase()}
                  </Link>
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
