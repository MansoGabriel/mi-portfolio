/* ─────────────────────────────────────────────────────────────
   THEME COLORS
   Light and dark palettes. Use getTheme(mode) to select.
───────────────────────────────────────────────────────────── */
export const lightTheme = {
  bg1: "#F5F2EC", bg2: "#EDE9E0", card: "#FFFFFF", cardH: "#FAFAF7",
  accent: "#5C7A4A", accentG: "#5C7A4A40", accent2: "#8B7D3C",
  t1: "#1F2E1F", t2: "#5A6B58", t3: "#7A8A72",
  border: "#D5CFC4",
  green: "#5C7A4A", orange: "#8B7D3C", cyan: "#4A7A6A", red: "#A0522D",
};

export const darkTheme = {
  bg1: "#121a12", bg2: "#1a241a", card: "#1e2a1e", cardH: "#243024",
  accent: "#7fa568", accentG: "#7fa56840", accent2: "#c4b060",
  t1: "#e8ece4", t2: "#b0bca8", t3: "#8a9a80",
  border: "#2e3e2e",
  green: "#7fa568", orange: "#c4b060", cyan: "#6aaa90", red: "#d08060",
};

export const getTheme = (mode) => mode === "dark" ? darkTheme : lightTheme;

/* Backward-compat alias (used during migration) */
export const C = lightTheme;

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

/* Accent color per skill card (used for decorative initial) */
export const skillAccents = [
  "#5C7A4A",  // olive
  "#8B7D3C",  // mustard
  "#4A7A6A",  // teal sage
  "#A07850",  // warm amber
  "#6B8F71",  // sage green
  "#A0522D",  // terracotta
];

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
