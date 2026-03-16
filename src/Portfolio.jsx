import { useState, useCallback, useMemo } from "react";
import { I18nContext, ThemeContext, useI18n, useTheme, useHover, useReveal, sanitize, usePortfolioState } from "./hooks";
import { skillTags, projectTech, heroStats, CV_FILES } from "./constants";

/* ─────────────────────────────────────────────────────────────
   GLOBAL STYLES
   Injected once at runtime. Includes resets, animations,
   responsive breakpoints, and scrollbar theming.
───────────────────────────────────────────────────────────── */
const GlobalStyles = () => {
  const C = useTheme();
  return (
    <style>{`
      *{margin:0;padding:0;box-sizing:border-box}
      html{scroll-behavior:smooth;scrollbar-width:thin;scrollbar-color:${C.accent} ${C.bg1}}
      body{line-height:1.6;overflow-x:hidden;background:${C.bg1};color:${C.t1}}
      @keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 0 0 ${C.green}60}50%{opacity:.7;box-shadow:0 0 0 6px ${C.green}00}}
      @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @media(max-width:768px){.desk-nav{display:none!important}.mob-btn{display:flex!important}.hero-stats-grid{gap:2rem!important}.grid-skills,.grid-projects{grid-template-columns:1fr!important}.grid-certs{grid-template-columns:1fr!important}.contact-grid{grid-template-columns:1fr!important}.hero-pad{padding:7rem 1.5rem 3rem!important}.sec-pad{padding:4rem 1.5rem!important}.footer-wrap{flex-direction:column;text-align:center}.hero-name{font-size:clamp(2.2rem,8vw,3rem)!important}.hero-name-offset{margin-left:0!important}.tab-grid{grid-template-columns:repeat(2,1fr)!important}}
      @media(max-width:480px){.hero-pad{padding:6rem 1rem 2rem!important}.sec-pad{padding:3rem 1rem!important}}
      ::selection{background:${C.accent}30;color:${C.t1}}
      button:focus:not(:focus-visible){outline:none}
      a:focus-visible,button:focus-visible{outline:2px solid ${C.accent};outline-offset:2px;border-radius:4px}
    `}</style>
  );
};

/* ─────────────────────────────────────────────────────────────
   SVG ICONS
   Inline SVGs as components to avoid an icon library dependency.
───────────────────────────────────────────────────────────── */
const EmailIcon    = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
const LinkedInIcon = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>;
const GitHubIcon   = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>;
const DownloadIcon = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;

/* ─────────────────────────────────────────────────────────────
   REVEAL
   Wraps any element in a fade+slide-up entrance animation
   triggered when it enters the viewport.
───────────────────────────────────────────────────────────── */
const Reveal = ({ children, delay = 0 }) => {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        height: "100%",
      }}
    >
      {children}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   NAV COMPONENTS
───────────────────────────────────────────────────────────── */
const NavLink = ({ href, children, onClick }) => {
  const C = useTheme();
  const [hovered, bind] = useHover();
  return (
    <a
      href={href}
      onClick={onClick}
      {...bind}
      style={{
        color: hovered ? C.accent : C.t2,
        textDecoration: "none",
        fontSize: "0.85rem",
        fontWeight: 500,
        letterSpacing: "0.03em",
        transition: "color 0.3s",
        position: "relative",
        paddingBottom: 6,
      }}
    >
      {children}
      <span style={{ position: "absolute", bottom: 0, left: 0, height: 2, width: hovered ? "100%" : "0%", background: C.accent, transition: "width 0.3s", borderRadius: 1 }} />
    </a>
  );
};

const LangToggle = ({ lang, setLang }) => {
  const C = useTheme();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "es" : "en")}
      aria-label={`Switch to ${lang === "en" ? "Spanish" : "English"}`}
      style={{
        background: C.accent + "12",
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        color: C.accent,
        fontWeight: 600,
        fontSize: "0.78rem",
        padding: "0.4rem 0.8rem",
        cursor: "pointer",
        fontFamily: "'Source Code Pro',monospace",
        transition: "all 0.3s",
        letterSpacing: "0.05em",
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      {lang === "en" ? "ES" : "EN"}
    </button>
  );
};

const ThemeToggle = ({ mode, setMode }) => {
  const C = useTheme();
  return (
    <button
      onClick={() => setMode(mode === "light" ? "dark" : "light")}
      aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
      style={{
        background: C.accent + "12",
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        color: C.accent,
        fontWeight: 600,
        fontSize: "0.78rem",
        padding: "0.4rem 0.8rem",
        cursor: "pointer",
        fontFamily: "'Source Code Pro',monospace",
        transition: "all 0.3s",
        letterSpacing: "0.05em",
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
      }}
    >
      {mode === "light" ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}
    </button>
  );
};

/* ─────────────────────────────────────────────────────────────
   SECTION HEADER
   Reusable heading with label, title, and accent underline.
───────────────────────────────────────────────────────────── */
const SectionHeader = ({ label, title }) => {
  const C = useTheme();
  return (
    <Reveal>
      <div style={{ marginBottom: "3.5rem" }}>
        <div style={{ fontFamily: "'Source Code Pro',monospace", fontSize: "0.75rem", color: C.accent, letterSpacing: "0.12em", marginBottom: "0.8rem" }}>
          {label}
        </div>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: "clamp(1.8rem,3.5vw,2.5rem)", letterSpacing: "-0.02em", color: C.t1 }}>
          {title}
        </h2>
        <div style={{ width: 50, height: 2, background: C.accent, borderRadius: 1, marginTop: "1rem" }} />
      </div>
    </Reveal>
  );
};

/* ─────────────────────────────────────────────────────────────
   CARD TITLE
   Clean sans-serif title with uniform bold weight.
───────────────────────────────────────────────────────────── */
const CardTitle = ({ children, style = {} }) => {
  const C = useTheme();
  return (
    <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: "1.15rem", marginBottom: "0.8rem", color: C.t1, lineHeight: 1.4, ...style }}>
      {children}
    </h3>
  );
};

/* ─────────────────────────────────────────────────────────────
   TAB BAR
   Horizontal tab buttons with animated underline indicator.
───────────────────────────────────────────────────────────── */
const TabBar = ({ tabs, activeIndex, onSelect, columns = 3 }) => {
  const C = useTheme();
  return (
    <div className="tab-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 0, marginBottom: "2rem", borderBottom: `1px solid ${C.border}` }}>
      {tabs.map((label, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            style={{
              padding: "0.7rem 0.5rem",
              background: "none",
              border: "none",
              borderBottom: `2px solid ${active ? C.accent : "transparent"}`,
              color: active ? C.accent : C.t3,
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontWeight: active ? 600 : 500,
              fontSize: "0.82rem",
              cursor: "pointer",
              transition: "all 0.25s ease",
              marginBottom: -1,
              outline: "none",
              textAlign: "left",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SKILL CARD
───────────────────────────────────────────────────────────── */
const SkillCard = ({ title, tags }) => {
  const C = useTheme();
  const [hovered, bind] = useHover();

  return (
    <div
      {...bind}
      role="article"
      style={{
        background: C.card,
        borderRadius: 16,
        padding: "2rem 2rem 1.8rem",
        position: "relative",
        overflow: "hidden",
        height: "100%",
        boxSizing: "border-box",
        border: `1px solid ${hovered ? C.accent + "50" : C.border}`,
        boxShadow: hovered
          ? "0 12px 32px rgba(31,46,31,0.12)"
          : "0 1px 4px rgba(31,46,31,0.04)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <CardTitle>{title}</CardTitle>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginTop: "1rem" }}>
        {tags.map(tag => (
          <span
            key={tag}
            style={{
              padding: "0.28rem 0.7rem",
              background: C.accent + "0c",
              border: `1px solid ${C.accent}20`,
              borderRadius: 20,
              fontFamily: "'Source Code Pro',monospace",
              fontSize: "0.72rem",
              color: C.accent,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   TIMELINE ITEM  (Experience section)
───────────────────────────────────────────────────────────── */
const TimelineItem = ({ date, title, company, desc, isFirst }) => {
  const C = useTheme();
  return (
    <div style={{ paddingLeft: 60, marginBottom: "3rem", position: "relative" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute", left: 12, top: 6,
          width: 16, height: 16, borderRadius: "50%",
          background: isFirst ? C.accent : C.bg1,
          border: `3px solid ${C.accent}`,
          zIndex: 2,
        }}
      />
      <div style={{ fontFamily: "'Source Code Pro',monospace", fontSize: "0.75rem", color: C.accent, letterSpacing: "0.05em", marginBottom: "0.4rem" }}>{date}</div>
      <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.3rem", color: C.t1 }}>{title}</h3>
      <div style={{ fontSize: "0.9rem", color: C.t2, marginBottom: "0.8rem" }}>{company}</div>
      <p style={{ fontSize: "0.88rem", color: C.t3, lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   TERMINAL BLOCK
   Decorative code snippet shown alongside the experience section.
───────────────────────────────────────────────────────────── */
const TerminalBlock = () => {
  const C = useTheme();
  const { t } = useI18n();
  return (
    <div
      style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", maxWidth: 600, boxShadow: "0 2px 12px rgba(31,46,31,0.05)" }}
      role="img"
      aria-label="Developer code snippet"
    >
      <div style={{ padding: "0.7rem 1rem", background: C.bg2, display: "flex", alignItems: "center", gap: "0.5rem" }} aria-hidden="true">
        {["#C4826A", "#C4A86A", "#7A9A6A"].map((color, i) => (
          <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block" }} />
        ))}
      </div>
      <pre style={{ padding: "1.2rem 1.5rem", fontFamily: "'Source Code Pro',monospace", fontSize: "0.78rem", lineHeight: 1.9, margin: 0, overflow: "auto", color: C.t1 }}>
        <code>
          <span style={{ color: C.accent }}>const</span> <span style={{ color: C.accent2 }}>developer</span> = {"{\n"}
          {"  "}<span style={{ color: C.accent2 }}>name</span>: <span style={{ color: C.accent }}>"Gabriel"</span>,{"\n"}
          {"  "}<span style={{ color: C.accent2 }}>role</span>: <span style={{ color: C.accent }}>"NetSuite Developer"</span>,{"\n"}
          {"  "}<span style={{ color: C.accent2 }}>experience</span>: <span style={{ color: C.accent }}>"6+ years"</span>,{"\n"}
          {"  "}<span style={{ color: C.accent2 }}>stack</span>: [<span style={{ color: C.accent }}>"SuiteScript 2.1"</span>, <span style={{ color: C.accent }}>"REST API"</span>, <span style={{ color: C.accent }}>"SuiteQL"</span>],{"\n"}
          {"  "}<span style={{ color: C.accent2 }}>passion</span>: <span style={{ color: C.accent }}>"{t.terminal.passion}"</span>{"\n"}
          {"};"}
          {"\n"}<span style={{ color: C.t3 }}>{t.terminal.comment}</span>
        </code>
      </pre>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   PROJECT CARD
───────────────────────────────────────────────────────────── */
const ProjectCard = ({ type, title, desc, tech }) => {
  const C = useTheme();
  const [hovered, bind] = useHover();
  return (
    <article
      {...bind}
      style={{
        background: C.card,
        borderRadius: 16,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        position: "relative",
        border: `1px solid ${hovered ? C.accent + "50" : C.border}`,
        boxShadow: hovered
          ? "0 12px 32px rgba(31,46,31,0.12)"
          : "0 1px 4px rgba(31,46,31,0.04)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div style={{ padding: "2rem 2rem 1rem", flex: 1 }}>
        <div style={{ fontFamily: "'Source Code Pro',monospace", fontSize: "0.68rem", color: C.accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
          {type}
        </div>
        <CardTitle style={{ fontSize: "1.2rem" }}>{title}</CardTitle>
        <p style={{ fontSize: "0.88rem", color: C.t3, lineHeight: 1.6 }}>{desc}</p>
      </div>

      <div style={{ padding: "1rem 2rem 1.8rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {tech.map(tag => (
          <span key={tag} style={{ padding: "0.28rem 0.65rem", background: C.accent + "0c", border: `1px solid ${C.accent}20`, borderRadius: 20, fontFamily: "'Source Code Pro',monospace", fontSize: "0.68rem", color: C.accent }}>
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
};

/* ─────────────────────────────────────────────────────────────
   CERT CARD
───────────────────────────────────────────────────────────── */
const CertCard = ({ title, org, desc }) => {
  const C = useTheme();
  const [hovered, bind] = useHover();
  return (
    <div
      {...bind}
      style={{
        background: C.card,
        borderRadius: 16,
        padding: "2rem 2rem 1.8rem",
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${hovered ? C.accent + "50" : C.border}`,
        boxShadow: hovered
          ? "0 12px 32px rgba(31,46,31,0.12)"
          : "0 1px 4px rgba(31,46,31,0.04)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <CardTitle style={{ fontSize: "1.05rem" }}>{title}</CardTitle>
      <p style={{ color: C.accent, fontFamily: "'Source Code Pro',monospace", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{org}</p>
      <p style={{ fontSize: "0.85rem", color: C.t3, lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   CONTACT COMPONENTS
───────────────────────────────────────────────────────────── */
const ContactLinkItem = ({ icon, label, href }) => {
  const C = useTheme();
  const [hovered, bind] = useHover();
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...bind}
      style={{
        display: "flex", alignItems: "center", gap: "1rem",
        padding: "1rem",
        background: hovered ? C.accent + "08" : "transparent",
        border: `1px solid ${hovered ? C.accent : C.border}`,
        borderRadius: 12,
        color: C.t1,
        textDecoration: "none",
        marginBottom: "0.8rem",
        transition: "all 0.3s",
        fontSize: "0.9rem",
      }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 10, background: C.accent + "12", display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, flexShrink: 0 }}>
        {icon}
      </div>
      {label}
    </a>
  );
};

const ContactForm = () => {
  const C = useTheme();
  const { t } = useI18n();
  const [focused, setFocused] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = useCallback((field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  // Opens the default email client pre-filled with sanitized form data
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const { name, email, subject, message } = form;
    if (!name || !email || !message) return;
    const body = encodeURIComponent(`Name: ${sanitize(name)}\nEmail: ${sanitize(email)}\n\n${sanitize(message)}`);
    window.open(`mailto:mansogabriel97@gmail.com?subject=${encodeURIComponent(sanitize(subject || "Portfolio Contact"))}&body=${body}`, "_self");
  }, [form]);

  const inputStyle = (fieldName) => ({
    padding: "1rem 1.2rem",
    background: C.card,
    border: `1px solid ${focused === fieldName ? C.accent : C.border}`,
    borderRadius: 12,
    color: C.t1,
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.3s",
    width: "100%",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <input style={inputStyle("name")}    placeholder={t.contact.name}    value={form.name}    onChange={handleChange("name")}    onFocus={() => setFocused("name")}    onBlur={() => setFocused(null)} autoComplete="name"  aria-label={t.contact.name} />
      <input style={inputStyle("email")}   placeholder={t.contact.email}   value={form.email}   onChange={handleChange("email")}   onFocus={() => setFocused("email")}   onBlur={() => setFocused(null)} autoComplete="email" type="email" aria-label={t.contact.email} />
      <input style={inputStyle("subject")} placeholder={t.contact.subject} value={form.subject} onChange={handleChange("subject")} onFocus={() => setFocused("subject")} onBlur={() => setFocused(null)} aria-label={t.contact.subject} />
      <textarea style={{ ...inputStyle("msg"), minHeight: 140, resize: "vertical" }} placeholder={t.contact.message} value={form.message} onChange={handleChange("message")} onFocus={() => setFocused("msg")} onBlur={() => setFocused(null)} aria-label={t.contact.message} />
      <button
        onClick={handleSubmit}
        aria-label={t.contact.send}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", padding: "0.9rem 2rem", background: C.accent, color: "#fff", fontWeight: 600, fontSize: "0.9rem", border: "none", borderRadius: 10, cursor: "pointer", transition: "all 0.3s", fontFamily: "'Plus Jakarta Sans',sans-serif" }}
      >
        {t.contact.send}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────────────── */
const Navbar = ({ scrolled, lang, setLang, navItems, menuOpen, setMenuOpen, status, mode, setMode }) => {
  const C = useTheme();
  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "1rem 2rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        background: C.bg1 + "ee",
        borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
        transition: "all 0.3s ease",
      }}
    >
      <a href="#" aria-label="Home" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.02em", color: C.t1, textDecoration: "none" }}>
        Gabriel<span style={{ color: C.accent }}>.</span>
      </a>

      <ul className="desk-nav" style={{ display: "flex", gap: "2rem", listStyle: "none", alignItems: "center" }}>
        {navItems.map(n => <li key={n.key}><NavLink href={`#${n.key}`}>{n.label}</NavLink></li>)}
      </ul>

      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <ThemeToggle mode={mode} setMode={setMode} />
        <LangToggle lang={lang} setLang={setLang} />
        <div className="desk-nav" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: C.green }}>
          <span style={{ width: 8, height: 8, background: C.green, borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }} />
          {status}
        </div>
        <button
          className="mob-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          style={{ display: "none", background: "none", border: "none", color: C.t1, fontSize: "1.5rem", cursor: "pointer", zIndex: 200, alignItems: "center", justifyContent: "center", width: 40, height: 40, marginLeft: "0.4rem" }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
    </nav>
  );
};

/* Full-screen overlay menu for mobile */
const MobileMenu = ({ navItems, onClose, status, open }) => {
  const C = useTheme();
  return (
    <div
      role="dialog"
      aria-label="Mobile navigation"
      aria-hidden={!open}
      style={{
        position: "fixed", inset: 0, zIndex: 150,
        background: C.bg1 + "f5", backdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem",
        opacity: open ? 1 : 0,
        visibility: open ? "visible" : "hidden",
        transition: "opacity 0.3s ease, visibility 0.3s ease",
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close menu"
        style={{ position: "absolute", top: "1.2rem", right: "1.5rem", background: "none", border: "none", color: C.t1, fontSize: "1.8rem", cursor: "pointer", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        ✕
      </button>
      {navItems.map(n => (
        <a key={n.key} href={`#${n.key}`} onClick={onClose} style={{ color: C.t1, textDecoration: "none", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: "1.5rem" }}>
          {n.label}
        </a>
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: C.green, marginTop: "1rem" }}>
        <span style={{ width: 8, height: 8, background: C.green, borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }} />
        {status}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SKILLS SECTION (Tabs)
───────────────────────────────────────────────────────────── */
const SkillsSection = ({ t }) => {
  const C = useTheme();
  const skillKeys = ["s1", "s2", "s3", "s4", "s5", "s6"];
  const tabLabels = skillKeys.map(k => t.skills[k]);
  const [active, setActive] = useState(0);

  return (
    <section id="skills" className="sec-pad" style={{ padding: "6rem 3rem", background: C.bg2 }}>
      <SectionHeader label={t.sections.skills.label} title={t.sections.skills.title} />
      <Reveal>
        <TabBar tabs={tabLabels} activeIndex={active} onSelect={setActive} />
      </Reveal>
      <Reveal key={active}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
          {skillTags[active].map(tag => (
            <span
              key={tag}
              style={{
                padding: "0.45rem 1rem",
                background: C.accent + "0c",
                border: `1px solid ${C.accent}20`,
                borderRadius: 24,
                fontFamily: "'Source Code Pro',monospace",
                fontSize: "0.8rem",
                color: C.accent,
                transition: "all 0.2s ease",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────
   PROJECTS SECTION (Tabs)
───────────────────────────────────────────────────────────── */
const projectKeys = ["p1", "p2", "p3", "p4", "p5", "p6"];

const ProjectsSection = ({ t }) => {
  const C = useTheme();
  const [active, setActive] = useState(0);
  const tabLabels = projectKeys.map(k => t.projects[k].title);
  const p = t.projects[projectKeys[active]];
  const tech = projectTech[active];

  return (
    <section id="projects" className="sec-pad" style={{ padding: "6rem 3rem", background: C.bg2 }}>
      <SectionHeader label={t.sections.projects.label} title={t.sections.projects.title} />
      <Reveal>
        <TabBar tabs={tabLabels} activeIndex={active} onSelect={setActive} />
      </Reveal>
      <Reveal key={active}>
        <div style={{
          background: C.card,
          borderRadius: 16,
          padding: "2.5rem",
          border: `1px solid ${C.border}`,
          boxShadow: "0 1px 4px rgba(31,46,31,0.04)",
          maxWidth: 700,
        }}>
          <div style={{ fontFamily: "'Source Code Pro',monospace", fontSize: "0.68rem", color: C.accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
            {p.type}
          </div>
          <CardTitle style={{ fontSize: "1.3rem" }}>{p.title}</CardTitle>
          <p style={{ fontSize: "0.92rem", color: C.t3, lineHeight: 1.7, marginBottom: "1.5rem" }}>{p.desc}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {tech.map(tag => (
              <span key={tag} style={{ padding: "0.28rem 0.75rem", background: C.accent + "0c", border: `1px solid ${C.accent}20`, borderRadius: 20, fontFamily: "'Source Code Pro',monospace", fontSize: "0.72rem", color: C.accent }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────
   PORTFOLIO  (root component)
───────────────────────────────────────────────────────────── */
const Portfolio = () => {
  const { lang, setLang, scrolled, menuOpen, setMenuOpen, t, mode, setMode, theme } = usePortfolioState();

  const closeMenu = useCallback(() => setMenuOpen(false), [setMenuOpen]);

  const navItems = useMemo(() => [
    { key: "skills",     label: t.nav.skills },
    { key: "experience", label: t.nav.experience },
    { key: "projects",   label: t.nav.projects },
    { key: "certs",      label: t.nav.certs },
    { key: "contact",    label: t.nav.contact },
  ], [t]);

  // Downloads the CV in the currently active language
  const handleDownloadCV = useCallback(() => {
    const file = CV_FILES[lang];
    const link = document.createElement("a");
    link.href = `/${file}`;
    link.download = file;
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [lang]);

  const ctxValue = useMemo(() => ({ lang, t }), [lang, t]);

  return (
    <I18nContext.Provider value={ctxValue}>
      <ThemeContext.Provider value={theme}>
        <div style={{ background: theme.bg1, color: theme.t1, fontFamily: "'Plus Jakarta Sans',sans-serif", minHeight: "100vh", overflowX: "hidden", transition: "background 0.3s, color 0.3s" }}>
          <GlobalStyles />

          <Navbar
            scrolled={scrolled}
            lang={lang}
            setLang={setLang}
            navItems={navItems}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            status={t.status}
            mode={mode}
            setMode={setMode}
          />

          <MobileMenu navItems={navItems} onClose={closeMenu} status={t.status} open={menuOpen} />

          <div key={lang} style={{ animation: "fadeIn 0.35s ease" }}>
          {/* ── HERO ──────────────────────────────────────────── */}
          <section className="hero-pad" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "8rem 3rem 4rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "relative", zIndex: 2, maxWidth: 900 }}>
              {/* Asymmetric name */}
              <div className="hero-name" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: "clamp(2.8rem,6vw,5.5rem)", lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: "1.5rem", animation: "slideUp 0.8s ease both" }}>
                <div style={{ color: theme.t1 }}>Gabriel</div>
                <div className="hero-name-offset" style={{ marginLeft: "clamp(2rem,8vw,6rem)", color: theme.accent }}>Manso</div>
              </div>

              {/* Divider */}
              <div style={{ width: 60, height: 2, background: theme.accent, marginBottom: "1.5rem", animation: "slideUp 0.8s ease 0.15s both" }} />

              {/* Role */}
              <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: "clamp(1.1rem,2vw,1.6rem)", color: theme.t2, lineHeight: 1.4, marginBottom: "1.5rem", animation: "slideUp 0.8s ease 0.2s both", maxWidth: 500 }}>
                {t.hero.h1_1}{t.hero.h1_accent}{" "}
                {t.hero.h1_2}
                {t.hero.h1_accent2}
              </h1>

              <p style={{ fontSize: "clamp(0.9rem,1.3vw,1.05rem)", color: theme.t3, maxWidth: 520, lineHeight: 1.8, marginBottom: "2.5rem", animation: "slideUp 0.8s ease 0.3s both" }}>
                {t.hero.desc}
              </p>

              {/* CTA buttons */}
              <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", animation: "slideUp 0.8s ease 0.4s both" }}>
                <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", padding: "0.85rem 1.8rem", background: theme.accent, color: "#fff", fontWeight: 600, fontSize: "0.88rem", border: "none", borderRadius: 10, textDecoration: "none", transition: "all 0.3s" }}>
                  <EmailIcon width="16" height="16" /> {t.hero.cta1}
                </a>
                <a href="#projects" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", padding: "0.85rem 1.8rem", background: "transparent", color: theme.t1, fontWeight: 600, fontSize: "0.88rem", border: `1px solid ${theme.border}`, borderRadius: 10, textDecoration: "none", transition: "all 0.3s" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                  {t.hero.cta2}
                </a>
                <button onClick={handleDownloadCV} style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", padding: "0.85rem 1.8rem", background: theme.accent + "12", color: theme.accent, fontWeight: 600, fontSize: "0.88rem", border: `1px solid ${theme.accent}30`, borderRadius: 10, cursor: "pointer", transition: "all 0.3s", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                  <DownloadIcon width="16" height="16" /> {t.hero.cta3}
                </button>
              </div>

              {/* Stats row */}
              <div className="hero-stats-grid" style={{ display: "flex", gap: "3rem", marginTop: "4rem", paddingTop: "3rem", borderTop: `1px solid ${theme.border}`, flexWrap: "wrap", animation: "slideUp 0.8s ease 0.5s both" }}>
                {heroStats.map(stat => (
                  <div key={stat.key}>
                    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: "2.5rem", color: theme.t1, lineHeight: 1 }}>
                      {stat.v}<span style={{ color: theme.accent }}>{stat.s}</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: theme.t3, letterSpacing: "0.05em", marginTop: "0.5rem" }}>
                      {t.hero[stat.key]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── SKILLS ────────────────────────────────────────── */}
          <SkillsSection t={t} />

          {/* ── EXPERIENCE ────────────────────────────────────── */}
          <section id="experience" className="sec-pad" style={{ padding: "6rem 3rem" }}>
            <SectionHeader label={t.sections.experience.label} title={t.sections.experience.title} />
            <div style={{ position: "relative", maxWidth: 800 }}>
              {/* Vertical timeline line */}
              <div aria-hidden="true" style={{ position: "absolute", left: 20, top: 0, bottom: 0, width: 2, background: theme.border }} />
              {["e1", "e2", "e3"].map((key, i) => (
                <Reveal key={key} delay={i * 100}>
                  <TimelineItem {...t.experience[key]} isFirst={i === 0} />
                </Reveal>
              ))}
            </div>
            <Reveal delay={300}><TerminalBlock /></Reveal>
          </section>

          {/* ── PROJECTS ──────────────────────────────────────── */}
          <ProjectsSection t={t} />

          {/* ── CERTIFICATIONS ────────────────────────────────── */}
          <section id="certs" className="sec-pad" style={{ padding: "6rem 3rem" }}>
            <SectionHeader label={t.sections.certs.label} title={t.sections.certs.title} />
            <div className="grid-certs" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.5rem" }}>
              <Reveal>       <CertCard title={t.certs.c1.title} org="Oracle" desc={t.certs.c1.desc} /></Reveal>
              <Reveal delay={100}><CertCard title={t.certs.c2.title} org="Oracle" desc={t.certs.c2.desc} /></Reveal>
            </div>
          </section>

          {/* ── CONTACT ───────────────────────────────────────── */}
          <section id="contact" className="sec-pad" style={{ padding: "6rem 3rem", background: theme.bg2 }}>
            <SectionHeader label={t.sections.contact.label} title={t.sections.contact.title} />
            <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", maxWidth: 900 }}>
              <Reveal>
                <div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: "1.5rem", marginBottom: "1rem", color: theme.t1 }}>{t.contact.heading}</h3>
                  <p style={{ color: theme.t2, fontSize: "0.95rem", lineHeight: 1.8, marginBottom: "2rem" }}>{t.contact.desc}</p>
                  <ContactLinkItem icon={<EmailIcon width="18" height="18" />}    label="mansogabriel97@gmail.com"         href="mailto:mansogabriel97@gmail.com" />
                  <ContactLinkItem icon={<LinkedInIcon width="18" height="18" />} label="LinkedIn Profile"                 href="https://www.linkedin.com/in/gabrielmanso" />
                  <ContactLinkItem icon={<GitHubIcon width="18" height="18" />}   label="GitHub Profile"                  href="https://github.com/MansoGabriel" />
                </div>
              </Reveal>
              <Reveal delay={150}><ContactForm /></Reveal>
            </div>
          </section>

          </div>{/* end lang fade wrapper */}

          {/* ── FOOTER ────────────────────────────────────────── */}
          <footer
            className="footer-wrap"
            style={{ padding: "2rem 3rem", borderTop: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", color: theme.t3, flexWrap: "wrap", gap: "1rem", background: theme.bg1 }}
          >
            <span>&copy; 2026 Gabriel. {t.footer.rights}</span>
            <span>{t.footer.tagline}</span>
          </footer>
        </div>
      </ThemeContext.Provider>
    </I18nContext.Provider>
  );
};

export default Portfolio;
