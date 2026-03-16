import { useState, useEffect, useRef, useMemo, useContext, createContext } from "react";
import translations from "./translations";
import { getTheme } from "./constants";

/* ─────────────────────────────────────────────────────────────
   i18n CONTEXT
   Provides { lang, t } to any component via useI18n().
───────────────────────────────────────────────────────────── */
export const I18nContext = createContext();
export const useI18n = () => useContext(I18nContext);

/* ─────────────────────────────────────────────────────────────
   THEME CONTEXT
   Provides the active color palette to any component via useTheme().
───────────────────────────────────────────────────────────── */
export const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

/* ─────────────────────────────────────────────────────────────
   useReveal
   Triggers a visibility flag once the element enters the
   viewport. Disconnects the observer after first trigger to
   avoid repeated work.
───────────────────────────────────────────────────────────── */
export const useReveal = (threshold = 0.1) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // only animate once
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
};

/* ─────────────────────────────────────────────────────────────
   useHover
   Returns [isHovered, eventBindings].
   Handles both mouse and keyboard focus for accessibility.
───────────────────────────────────────────────────────────── */
export const useHover = () => {
  const [hovered, setHovered] = useState(false);

  // Memoised so bindings object is stable across renders
  const bind = useMemo(() => ({
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onFocus:      () => setHovered(true),
    onBlur:       () => setHovered(false),
  }), []);

  return [hovered, bind];
};

/* ─────────────────────────────────────────────────────────────
   sanitize
   Escapes HTML special characters to prevent XSS when
   building mailto: body strings from user input.
───────────────────────────────────────────────────────────── */
export const sanitize = (str) =>
  String(str).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));

/* ─────────────────────────────────────────────────────────────
   usePortfolioState
   Centralises all top-level state and side effects for the
   Portfolio component, keeping the JSX clean.
───────────────────────────────────────────────────────────── */
export const usePortfolioState = () => {
  const [lang, setLang] = useState("en");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState("light");

  const t = translations[lang];
  const theme = getTheme(mode);

  // Show a border on the navbar once the user scrolls past 80px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-close mobile menu when viewport widens beyond breakpoint
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return { lang, setLang, scrolled, menuOpen, setMenuOpen, t, mode, setMode, theme };
};
