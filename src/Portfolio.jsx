import { useState, useCallback, useMemo } from "react";
import { I18nContext, useI18n, useHover, useReveal, sanitize, usePortfolioState } from "./hooks";
import { C, skillTags, skillIcons, skillColors, iconColorMap, projectTech, heroStats, CV_FILES } from "./constants";

/* ─────────────────────────────────────────────────────────────
   GLOBAL STYLES
   Injected once at runtime. Includes resets, animations,
   responsive breakpoints, and scrollbar theming.
───────────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    *{margin:0;padding:0;box-sizing:border-box}
    html{scroll-behavior:smooth;scrollbar-width:thin;scrollbar-color:${C.accent} ${C.bg1}}
    body{line-height:1.6;overflow-x:hidden;background:${C.bg1}}
    body::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");pointer-events:none;z-index:9999}
    @keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 0 0 #34d39960}50%{opacity:.7;box-shadow:0 0 0 6px #34d39900}}
    @keyframes float{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-30px) scale(1.05)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
    @media(max-width:768px){.desk-nav{display:none!important}.mob-btn{display:flex!important}.hero-stats-grid{gap:2rem!important}.grid-skills,.grid-projects{grid-template-columns:1fr!important}.grid-certs{grid-template-columns:1fr!important}.contact-grid{grid-template-columns:1fr!important}.hero-pad{padding:7rem 1.5rem 3rem!important}.sec-pad{padding:4rem 1.5rem!important}.footer-wrap{flex-direction:column;text-align:center}}
    @media(max-width:480px){.hero-pad{padding:6rem 1rem 2rem!important}.sec-pad{padding:3rem 1rem!important}}
    ::selection{background:${C.accent}40;color:#fff}
    a:focus-visible,button:focus-visible{outline:2px solid ${C.accent};outline-offset:2px;border-radius:4px}
  `}</style>
);

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

/* Shared top-border gradient that slides in on hover — used by all cards */
const HoverBar = ({ visible }) => (
  <div
    aria-hidden="true"
    style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 3,
      background: `linear-gradient(90deg,${C.accent},${C.accent2})`,
      transform: visible ? "scaleX(1)" : "scaleX(0)",
      transformOrigin: "left",
      transition: "transform 0.4s ease",
    }}
  />
);

/* Shared hover style values used by all interactive cards */
const cardHoverStyle = (hovered) => ({
  background:  hovered ? C.cardH : C.card,
  border:      `1px solid ${hovered ? C.accent + "40" : C.border}`,
  transform:   hovered ? "translateY(-4px)" : "translateY(0)",
  boxShadow:   hovered ? "0 20px 40px #00000040" : "none",
  transition:  "all 0.4s ease",
});

/* ─────────────────────────────────────────────────────────────
   NAV COMPONENTS
───────────────────────────────────────────────────────────── */
const NavLink = ({ href, children, onClick }) => {
  const [hovered, bind] = useHover();
  return (
    <a
      href={href}
      onClick={onClick}
      {...bind}
      style={{
        color: hovered ? C.t1 : C.t2,
        textDecoration: "none",
        fontSize: "0.85rem",
        fontWeight: 500,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        transition: "color 0.3s",
        position: "relative",
        paddingBottom: 6,
      }}
    >
      {children}
      {/* Animated underline */}
      <span style={{ position: "absolute", bottom: 0, left: 0, height: 2, width: hovered ? "100%" : "0%", background: C.accent, transition: "width 0.3s" }} />
    </a>
  );
};

const LangToggle = ({ lang, setLang }) => (
  <button
    onClick={() => setLang(lang === "en" ? "es" : "en")}
    aria-label={`Switch to ${lang === "en" ? "Spanish" : "English"}`}
    style={{
      background: C.accent + "15",
      border: `1px solid ${C.accent}40`,
      borderRadius: 8,
      color: C.t1,
      fontWeight: 700,
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

/* ─────────────────────────────────────────────────────────────
   SECTION HEADER
   Reusable heading with label, title, and accent underline.
───────────────────────────────────────────────────────────── */
const SectionHeader = ({ label, title }) => (
  <Reveal>
    <div style={{ marginBottom: "3.5rem" }}>
      <div style={{ fontFamily: "'Source Code Pro',monospace", fontSize: "0.75rem", color: C.accent, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.8rem" }}>
        {label}
      </div>
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "clamp(1.8rem,3.5vw,2.5rem)", letterSpacing: "-0.02em" }}>
        {title}
      </h2>
      <div style={{ width: 60, height: 3, background: `linear-gradient(90deg,${C.accent},${C.accent2})`, borderRadius: 2, marginTop: "1rem" }} />
    </div>
  </Reveal>
);

/* ─────────────────────────────────────────────────────────────
   SKILL CARD
───────────────────────────────────────────────────────────── */
const SkillCard = ({ icon, colorKey, title, tags }) => {
  const [hovered, bind] = useHover();
  const iconColors = iconColorMap[colorKey];

  return (
    <div
      {...bind}
      role="article"
      style={{
        ...cardHoverStyle(hovered),
        borderRadius: 16,
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <HoverBar visible={hovered} />

      {/* Category icon */}
      <div
        aria-hidden="true"
        style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", marginBottom: "1.2rem", ...iconColors }}
      >
        {icon}
      </div>

      <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.15rem", marginBottom: "0.8rem" }}>{title}</h3>

      {/* Tech tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {tags.map(tag => (
          <span
            key={tag}
            style={{
              padding: "0.3rem 0.75rem",
              background: C.accent + "10",
              border: `1px solid ${hovered ? C.accent + "40" : C.accent + "20"}`,
              borderRadius: 6,
              fontFamily: "'Source Code Pro',monospace",
              fontSize: "0.72rem",
              color: hovered ? C.t1 : C.t2,
              transition: "all 0.3s",
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
const TimelineItem = ({ date, title, company, desc, isFirst }) => (
  <div style={{ paddingLeft: 60, marginBottom: "3rem", position: "relative" }}>
    {/* Timeline dot — filled for current role */}
    <div
      aria-hidden="true"
      style={{
        position: "absolute", left: 12, top: 6,
        width: 18, height: 18, borderRadius: "50%",
        background: isFirst ? C.accent : C.bg1,
        border: `3px solid ${C.accent}`,
        zIndex: 2,
        boxShadow: isFirst ? `0 0 15px ${C.accentG}` : "none",
      }}
    />
    <div style={{ fontFamily: "'Source Code Pro',monospace", fontSize: "0.75rem", color: C.accent, letterSpacing: "0.05em", marginBottom: "0.4rem" }}>{date}</div>
    <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.3rem" }}>{title}</h3>
    <div style={{ fontSize: "0.9rem", color: C.t2, marginBottom: "0.8rem" }}>{company}</div>
    <p style={{ fontSize: "0.88rem", color: C.t3, lineHeight: 1.7 }}>{desc}</p>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   TERMINAL BLOCK
   Decorative code snippet shown alongside the experience section.
───────────────────────────────────────────────────────────── */
const TerminalBlock = () => {
  const { t } = useI18n();
  return (
    <div
      style={{ background: "#0d0d14", border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", maxWidth: 600 }}
      role="img"
      aria-label="Developer code snippet"
    >
      {/* Mac-style traffic lights */}
      <div style={{ padding: "0.7rem 1rem", background: "#12121c", display: "flex", alignItems: "center", gap: "0.5rem" }} aria-hidden="true">
        {[C.red, C.orange, C.green].map((color, i) => (
          <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block" }} />
        ))}
      </div>
      <pre style={{ padding: "1.2rem 1.5rem", fontFamily: "'Source Code Pro',monospace", fontSize: "0.78rem", lineHeight: 1.9, margin: 0, overflow: "auto" }}>
        <code>
          <span style={{ color: C.accent }}>const</span> <span style={{ color: C.orange }}>developer</span> = {"{\n"}
          {"  "}<span style={{ color: C.orange }}>name</span>: <span style={{ color: C.green }}>"Gabriel"</span>,{"\n"}
          {"  "}<span style={{ color: C.orange }}>role</span>: <span style={{ color: C.green }}>"NetSuite Developer"</span>,{"\n"}
          {"  "}<span style={{ color: C.orange }}>experience</span>: <span style={{ color: C.green }}>"6+ years"</span>,{"\n"}
          {"  "}<span style={{ color: C.orange }}>stack</span>: [<span style={{ color: C.green }}>"SuiteScript 2.1"</span>, <span style={{ color: C.green }}>"REST API"</span>, <span style={{ color: C.green }}>"SuiteQL"</span>],{"\n"}
          {"  "}<span style={{ color: C.orange }}>passion</span>: <span style={{ color: C.green }}>"{t.terminal.passion}"</span>{"\n"}
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
  const [hovered, bind] = useHover();
  return (
    <article
      {...bind}
      style={{
        ...cardHoverStyle(hovered),
        borderRadius: 16,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <HoverBar visible={hovered} />

      {/* Content area grows to fill available space */}
      <div style={{ padding: "2rem 2rem 1rem", flex: 1 }}>
        <div style={{ fontFamily: "'Source Code Pro',monospace", fontSize: "0.7rem", color: C.accent, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.6rem" }}>
          {type}
        </div>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.6rem" }}>{title}</h3>
        <p style={{ fontSize: "0.85rem", color: C.t3, lineHeight: 1.7 }}>{desc}</p>
      </div>

      {/* Tech stack tags — always pinned to the bottom */}
      <div style={{ padding: "1rem 2rem 1.5rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {tech.map(tag => (
          <span key={tag} style={{ padding: "0.25rem 0.6rem", background: C.bg1, borderRadius: 4, fontFamily: "'Source Code Pro',monospace", fontSize: "0.68rem", color: C.t2 }}>
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
const CertCard = ({ emoji, title, org, desc }) => {
  const [hovered, bind] = useHover();
  return (
    <div
      {...bind}
      style={{
        ...cardHoverStyle(hovered),
        borderRadius: 16,
        padding: "2rem",
        display: "flex",
        gap: "1.2rem",
        alignItems: "flex-start",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <HoverBar visible={hovered} />

      <div
        aria-hidden="true"
        style={{ flexShrink: 0, width: 50, height: 50, borderRadius: 12, background: `linear-gradient(135deg,${C.accent}20,${C.accent2}20)`, border: `1px solid ${C.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}
      >
        {emoji}
      </div>

      <div>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: "0.3rem" }}>{title}</h3>
        <p style={{ color: C.accent, fontFamily: "'Source Code Pro',monospace", fontSize: "0.72rem", marginBottom: "0.3rem" }}>{org}</p>
        <p style={{ fontSize: "0.8rem", color: C.t3 }}>{desc}</p>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   CONTACT COMPONENTS
───────────────────────────────────────────────────────────── */
const ContactLinkItem = ({ icon, label, href }) => {
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
        background: hovered ? C.cardH : C.card,
        border: `1px solid ${hovered ? C.accent : C.border}`,
        borderRadius: 12,
        color: C.t1,
        textDecoration: "none",
        marginBottom: "0.8rem",
        transition: "all 0.3s",
        fontSize: "0.9rem",
        transform: hovered ? "translateX(4px)" : "none",
      }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 10, background: C.accent + "15", display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, flexShrink: 0 }}>
        {icon}
      </div>
      {label}
    </a>
  );
};

const ContactForm = () => {
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
    fontFamily: "'DM Sans',sans-serif",
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
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", padding: "0.9rem 2rem", background: C.accent, color: "#fff", fontWeight: 600, fontSize: "0.9rem", border: "none", borderRadius: 10, cursor: "pointer", transition: "all 0.3s", fontFamily: "'DM Sans',sans-serif" }}
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
const Navbar = ({ scrolled, lang, setLang, navItems, menuOpen, setMenuOpen, status }) => (
  <nav
    role="navigation"
    aria-label="Main navigation"
    style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "1rem 2rem",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      background: "#0a0a0fcc",
      borderBottom: `1px solid ${scrolled ? C.accent + "20" : C.border}`,
      transition: "all 0.3s ease",
    }}
  >
    <a href="#" aria-label="Home" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.3rem", letterSpacing: "-0.02em", color: C.t1, textDecoration: "none" }}>
      &lt;G<span style={{ color: C.accent }}>.</span>dev /&gt;
    </a>

    <ul className="desk-nav" style={{ display: "flex", gap: "2rem", listStyle: "none", alignItems: "center" }}>
      {navItems.map(n => <li key={n.key}><NavLink href={`#${n.key}`}>{n.label}</NavLink></li>)}
    </ul>

    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
        style={{ display: "none", background: "none", border: "none", color: C.t1, fontSize: "1.5rem", cursor: "pointer", zIndex: 200, alignItems: "center", justifyContent: "center", width: 40, height: 40 }}
      >
        {menuOpen ? "✕" : "☰"}
      </button>
    </div>
  </nav>
);

/* Full-screen overlay menu for mobile */
const MobileMenu = ({ navItems, onClose, status }) => (
  <div
    role="dialog"
    aria-label="Mobile navigation"
    style={{ position: "fixed", inset: 0, zIndex: 150, background: "#0a0a0ff0", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem" }}
  >
    {navItems.map(n => (
      <a key={n.key} href={`#${n.key}`} onClick={onClose} style={{ color: C.t1, textDecoration: "none", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.5rem" }}>
        {n.label}
      </a>
    ))}
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: C.green, marginTop: "1rem" }}>
      <span style={{ width: 8, height: 8, background: C.green, borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }} />
      {status}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   PORTFOLIO  (root component)
───────────────────────────────────────────────────────────── */
const Portfolio = () => {
  const { lang, setLang, scrolled, menuOpen, setMenuOpen, t } = usePortfolioState();

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
      <div style={{ background: C.bg1, color: C.t1, fontFamily: "'DM Sans',sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
        <GlobalStyles />

        <Navbar
          scrolled={scrolled}
          lang={lang}
          setLang={setLang}
          navItems={navItems}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          status={t.status}
        />

        {menuOpen && <MobileMenu navItems={navItems} onClose={closeMenu} status={t.status} />}

        {/* ── HERO ──────────────────────────────────────────── */}
        <section className="hero-pad" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "8rem 3rem 4rem", position: "relative", overflow: "hidden" }}>
          {/* Decorative background elements */}
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`, backgroundSize: "60px 60px", opacity: 0.3, maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%,black,transparent)", WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%,black,transparent)" }} />
          <div aria-hidden="true" style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle,${C.accentG},transparent 70%)`, top: "10%", right: "-10%", filter: "blur(80px)", animation: "float 8s ease-in-out infinite" }} />
          <div aria-hidden="true" style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,#7c5bf520,transparent 70%)", bottom: "10%", left: "-5%", filter: "blur(60px)", animation: "float 10s ease-in-out infinite reverse" }} />

          <div style={{ position: "relative", zIndex: 2, maxWidth: 900 }}>
            {/* Role badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", padding: "0.5rem 1.2rem", background: C.accent + "12", border: `1px solid ${C.accent}30`, borderRadius: 100, fontFamily: "'Source Code Pro',monospace", fontSize: "0.8rem", color: C.accent, marginBottom: "2rem", animation: "slideUp 0.8s ease both" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
              {t.hero.tag}
            </div>

            <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "clamp(2.4rem,5.5vw,4.8rem)", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "1.5rem", animation: "slideUp 0.8s ease 0.15s both" }}>
              {t.hero.h1_1}<span style={{ color: C.accent }}>{t.hero.h1_accent}</span><br />
              {t.hero.h1_2}<br />
              <span style={{ color: C.accent2 }}>{t.hero.h1_accent2}</span>
            </h1>

            <p style={{ fontSize: "clamp(0.95rem,1.5vw,1.15rem)", color: C.t2, maxWidth: 600, lineHeight: 1.8, marginBottom: "2.5rem", animation: "slideUp 0.8s ease 0.3s both" }}>
              {t.hero.desc}
            </p>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", animation: "slideUp 0.8s ease 0.45s both" }}>
              <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", padding: "0.85rem 1.8rem", background: C.accent, color: "#fff", fontWeight: 600, fontSize: "0.88rem", border: "none", borderRadius: 10, textDecoration: "none", transition: "all 0.3s" }}>
                <EmailIcon width="16" height="16" /> {t.hero.cta1}
              </a>
              <a href="#projects" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", padding: "0.85rem 1.8rem", background: "transparent", color: C.t1, fontWeight: 600, fontSize: "0.88rem", border: `1px solid ${C.border}`, borderRadius: 10, textDecoration: "none", transition: "all 0.3s" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                {t.hero.cta2}
              </a>
              <button onClick={handleDownloadCV} style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", padding: "0.85rem 1.8rem", background: C.green + "18", color: C.green, fontWeight: 600, fontSize: "0.88rem", border: `1px solid ${C.green}40`, borderRadius: 10, cursor: "pointer", transition: "all 0.3s", fontFamily: "'DM Sans',sans-serif" }}>
                <DownloadIcon width="16" height="16" /> {t.hero.cta3}
              </button>
            </div>

            {/* Stats row */}
            <div className="hero-stats-grid" style={{ display: "flex", gap: "3rem", marginTop: "4rem", paddingTop: "3rem", borderTop: `1px solid ${C.border}`, flexWrap: "wrap", animation: "slideUp 0.8s ease 0.6s both" }}>
              {heroStats.map(stat => (
                <div key={stat.key}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "3rem", color: C.t1, lineHeight: 1 }}>
                    {stat.v}<span style={{ color: C.accent }}>{stat.s}</span>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: C.t3, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "0.6rem" }}>
                    {t.hero[stat.key]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SKILLS ────────────────────────────────────────── */}
        <section id="skills" className="sec-pad" style={{ padding: "6rem 3rem", background: C.bg2 }}>
          <SectionHeader label={t.sections.skills.label} title={t.sections.skills.title} />
          <div className="grid-skills" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "1.5rem" }}>
            {[t.skills.s1, t.skills.s2, t.skills.s3, t.skills.s4, t.skills.s5, t.skills.s6].map((title, i) => (
              <Reveal key={i} delay={i * 80}>
                <SkillCard icon={skillIcons[i]} colorKey={skillColors[i]} title={title} tags={skillTags[i]} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── EXPERIENCE ────────────────────────────────────── */}
        <section id="experience" className="sec-pad" style={{ padding: "6rem 3rem" }}>
          <SectionHeader label={t.sections.experience.label} title={t.sections.experience.title} />
          <div style={{ position: "relative", maxWidth: 800 }}>
            {/* Vertical timeline line */}
            <div aria-hidden="true" style={{ position: "absolute", left: 20, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom,${C.accent},${C.accent2},transparent)` }} />
            {["e1", "e2", "e3"].map((key, i) => (
              <Reveal key={key} delay={i * 100}>
                <TimelineItem {...t.experience[key]} isFirst={i === 0} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={300}><TerminalBlock /></Reveal>
        </section>

        {/* ── PROJECTS ──────────────────────────────────────── */}
        <section id="projects" className="sec-pad" style={{ padding: "6rem 3rem", background: C.bg2 }}>
          <SectionHeader label={t.sections.projects.label} title={t.sections.projects.title} />
          <div className="grid-projects" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: "1.5rem" }}>
            {["p1", "p2", "p3", "p4", "p5", "p6"].map((key, i) => (
              <Reveal key={key} delay={i * 80}>
                <ProjectCard {...t.projects[key]} tech={projectTech[i]} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── CERTIFICATIONS ────────────────────────────────── */}
        <section id="certs" className="sec-pad" style={{ padding: "6rem 3rem" }}>
          <SectionHeader label={t.sections.certs.label} title={t.sections.certs.title} />
          <div className="grid-certs" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.5rem" }}>
            <Reveal>       <CertCard emoji="🎓" title={t.certs.c1.title} org="Oracle" desc={t.certs.c1.desc} /></Reveal>
            <Reveal delay={100}><CertCard emoji="🏆" title={t.certs.c2.title} org="Oracle" desc={t.certs.c2.desc} /></Reveal>
          </div>
        </section>

        {/* ── CONTACT ───────────────────────────────────────── */}
        <section id="contact" className="sec-pad" style={{ padding: "6rem 3rem", background: C.bg2 }}>
          <SectionHeader label={t.sections.contact.label} title={t.sections.contact.title} />
          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", maxWidth: 900 }}>
            <Reveal>
              <div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.5rem", marginBottom: "1rem" }}>{t.contact.heading}</h3>
                <p style={{ color: C.t2, fontSize: "0.95rem", lineHeight: 1.8, marginBottom: "2rem" }}>{t.contact.desc}</p>
                <ContactLinkItem icon={<EmailIcon width="18" height="18" />}    label="mansogabriel97@gmail.com"         href="mailto:mansogabriel97@gmail.com" />
                <ContactLinkItem icon={<LinkedInIcon width="18" height="18" />} label="LinkedIn Profile"                 href="https://www.linkedin.com/in/gabrielmanso" />
                <ContactLinkItem icon={<GitHubIcon width="18" height="18" />}   label="GitHub Profile"                  href="https://github.com/MansoGabriel" />
              </div>
            </Reveal>
            <Reveal delay={150}><ContactForm /></Reveal>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────── */}
        <footer
          className="footer-wrap"
          style={{ padding: "2rem 3rem", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", color: C.t3, flexWrap: "wrap", gap: "1rem" }}
        >
          <span>&copy; 2026 Gabriel. {t.footer.rights}</span>
          <span>{t.footer.tagline}</span>
        </footer>
      </div>
    </I18nContext.Provider>
  );
};

export default Portfolio;
