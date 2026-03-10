/* ─────────────────────────────────────────────────────────────
   THEME COLORS
   Single source of truth for all colors used across the app.
───────────────────────────────────────────────────────────── */
export const C = {
  // Backgrounds
  bg1: "#0a0a0f",
  bg2: "#111118",
  card: "#16161f",
  cardH: "#1c1c28", // card hover state

  // Accent palette
  accent: "#4f6df5",
  accentG: "#4f6df540", // accent with 25% opacity (for glows)
  accent2: "#7c5bf5",

  // Text hierarchy
  t1: "#e8e8f0",  // primary
  t2: "#8888a0",  // secondary
  t3: "#55556a",  // tertiary / muted

  // Borders
  border: "#22223a",

  // Status / semantic colors
  green: "#34d399",
  orange: "#f59e0b",
  cyan: "#22d3ee",
  red: "#ef4444",
};

/* ─────────────────────────────────────────────────────────────
   SKILLS DATA
   Each index corresponds to one skill card in order:
   0-SuiteScript, 1-APIs, 2-NS Platform, 3-ERP, 4-LATAM, 5-Web
───────────────────────────────────────────────────────────── */
export const skillTags = [
  ["SuiteScript 2.1","User Event","Client Script","Map/Reduce","Scheduled","RESTlet","Suitelet","Workflow Action","Portlet","Mass Update"],
  ["REST API","SuiteQL","SOAP Web Services","OAuth 1.0 / TBA","OAuth 2.0 M2M","SSO / SAML 2.0","Webhooks","Oracle Integration Cloud"],
  ["SDF / SuiteCloud","Saved Searches","Custom Records","Workflows","Advanced PDF / HTML","FreeMarker","Roles & Permissions","CSV Import","Bundles"],
  ["Manufacturing (WO/WIP)","WMS Mobile","Inventory Management","FEFO / Lot Tracking","Order to Cash","Procure to Pay","GL & Accounting","Multi-Subsidiary"],
  ["Uruguay CFE","Mexico CFDI","Argentina Fiscal","Chile DTE","GoSocket API","Withholding Calc","Tax Detail Scripting"],
  ["JavaScript ES6+","TypeScript","React","Node.js","Express","MongoDB","HTML / CSS","Git / GitLab","VS Code","Postman","VBA"],
];

export const skillIcons = ["⚡", "🔗", "🏗️", "🏭", "🌎", "🛠️"];
export const skillColors = ["blue", "purple", "green", "orange", "cyan", "red"];

// Maps a color key to the background/foreground used in skill card icons
export const iconColorMap = {
  blue:   { background: "#4f6df518", color: "#4f6df5" },
  purple: { background: "#7c5bf518", color: "#7c5bf5" },
  green:  { background: "#34d39918", color: "#34d399" },
  orange: { background: "#f59e0b18", color: "#f59e0b" },
  cyan:   { background: "#22d3ee18", color: "#22d3ee" },
  red:    { background: "#ef444418", color: "#ef4444" },
};

/* ─────────────────────────────────────────────────────────────
   PROJECTS DATA
   Tech stacks listed per project, matching translation order:
   p1-LATAM, p2-FEFO, p3-EntreTelas, p4-Leasing, p5-WMS, p6-OIC
───────────────────────────────────────────────────────────── */
export const projectTech = [
  ["SuiteScript 2.1", "REST API", "User Event", "Map/Reduce", "FreeMarker"],
  ["Map/Reduce", "SuiteQL", "Inventory Detail", "Work Orders"],
  ["React", "Node.js", "Express", "MongoDB", "JWT"],
  ["Suitelet", "Custom Records", "Scheduled Script", "Workflows"],
  ["WMS Mobile", "User Event", "Client Script", "Bin Transfers"],
  ["RESTlet", "OAuth 1.0", "OIC", "API Secrets", "PDF Rendering"],
];

/* Hero stats — value, suffix, translation key */
export const heroStats = [
  { v: "6",   s: "+", key: "stat1" },
  { v: "100", s: "+", key: "stat2" },
  { v: "2",   s: "",  key: "stat3" },
  { v: "5",   s: "+", key: "stat4" },
];

/* CV filenames per language */
export const CV_FILES = {
  en: "Gabriel_Manso_CV_EN.pdf",
  es: "Gabriel_Manso_CV_ES.pdf",
};
