/* ─────────────────────────────────────────────────────────────
   TRANSLATIONS  (i18n)
   Supported languages: "en" | "es"
   Add a new language by duplicating a block and translating.
───────────────────────────────────────────────────────────── */
const translations = {
  en: {
    nav: {
      skills: "Skills",
      experience: "Experience",
      projects: "Projects",
      certs: "Certifications",
      contact: "Contact",
    },
    status: "Available for hire",
    hero: {
      tag: "NetSuite Developer & Technical Consultant",
      h1_1: "Building ",
      h1_accent: "scalable ERP",
      h1_2: " solutions with ",
      h1_accent2: "SuiteScript",
      desc: "6+ years crafting custom NetSuite solutions — from SuiteScript automation and REST API integrations to Latin American tax compliance and WMS customizations. 100+ projects delivered across manufacturing, logistics, and beyond.",
      cta1: "Get in Touch",
      cta2: "View Projects",
      cta3: "Download CV",
      stat1: "Years of Experience",
      stat2: "Projects Delivered",
      stat3: "Oracle Certifications",
      stat4: "Industries Served",
    },
    sections: {
      skills:     { label: "// what I do",       title: "Technical Skills" },
      experience: { label: "// career path",      title: "Experience" },
      projects:   { label: "// selected work",    title: "Projects" },
      certs:      { label: "// credentials",      title: "Certifications" },
      contact:    { label: "// let's connect",    title: "Get in Touch" },
    },
    contact: {
      heading: "Open to new opportunities",
      desc: "Whether you need a NetSuite developer for a custom SuiteScript project, a full ERP implementation, or an integration with external systems — I'm ready to help turn your requirements into clean, maintainable code.",
      name: "Your name",
      email: "Your email",
      subject: "Subject",
      message: "Tell me about your project...",
      send: "Send Message",
    },
    footer: {
      rights: "All rights reserved.",
      tagline: "Built with SuiteScript-level precision",
    },
    terminal: {
      passion: "Turning complex ERP challenges into clean code",
      comment: "// Open to new opportunities →",
    },
    skills: {
      s1: "SuiteScript Development",
      s2: "Integrations & APIs",
      s3: "NetSuite Platform",
      s4: "ERP Functional Knowledge",
      s5: "LATAM Tax Compliance",
      s6: "Web Development & Tooling",
    },
    experience: {
      e1: {
        date: "August 2025 — Present",
        title: "NetSuite Consultant & Developer",
        company: "Witbor",
        desc: "Participating in NetSuite implementation and continuous improvement projects for regional clients. Diagnosing and resolving complex incidents in production environments. Designing customizations using SuiteScript 1.0, 2.0, and 2.1, including automations, validations, and custom reports. Providing technical and functional support, and creating documentation for implemented solutions.",
      },
      e2: {
        date: "January 2023 — August 2025",
        title: "NetSuite Consultant & Developer",
        company: "BeApps Adistec",
        desc: "Led the design and development of REST API integrations connecting NetSuite with third-party platforms, including e-commerce systems, payment gateways, and LATAM fiscal providers via OAuth 1.0/TBA. Built scalable Map/Reduce and RESTlet-based architectures for high-volume data exchange. Spearheaded SuiteQL adoption for advanced reporting and collaborated on Oracle Integration Cloud (OIC) connector projects.",
      },
      e3: {
        date: "December 2019 — December 2022",
        title: "NetSuite Developer",
        company: "Adistec",
        desc: "Developed custom SuiteScript scripts focused on process automation in finance, sales, and logistics. Created and maintained workflows (SuiteFlow) and custom forms (SuiteBuilder). Provided support to key users, handled technical tickets, and collaborated on system expansion to new countries within the Adistec group.",
      },
    },
    projects: {
      p1: { type: "Tax Integration",       title: "LATAM Electronic Invoicing Suite",    desc: "End-to-end integration with Uruguayan CFE, Mexican CFDI (GoSocket API), Chilean DTE, and Argentine fiscal systems. Handles tax-inclusive pricing, net-amount reconciliation, and automated XML generation." },
      p2: { type: "Inventory Automation",  title: "FEFO Lot Assignment Engine",          desc: "Map/Reduce script for automatic FEFO (First Expired, First Out) lot assignment on Work Orders. Optimized governance handling for high-volume manufacturing environments." },
      p3: { type: "Full-Stack Web App",    title: "Entre Telas — Product Catalog",       desc: "Full-stack e-commerce catalog for a fabric store, featuring JWT authentication, Excel/CSV bulk product upload, category management, and responsive product browsing." },
      p4: { type: "ERP Solution",          title: "Leasing & Rental Management System",  desc: "Complete rental lifecycle system built natively in NetSuite — contract management, automated billing schedules, asset tracking, and custom dashboards." },
      p5: { type: "WMS Customization",     title: "Extended WMS Mobile Operations",      desc: 'Custom WMS Mobile extensions for bin transfers, inventory status changes, and "Consumo de Materiales" workflows with pallet numbering logic.' },
      p6: { type: "Integration",           title: "OIC ↔ NetSuite RESTlet Bridge",       desc: "Oracle Integration Cloud connector to NetSuite RESTlets using OAuth 1.0/TBA. Includes multipart/form-data HTTP requests and secure credential management." },
    },
    certs: {
      c1: { title: "NetSuite Certified AI Foundations Associate", desc: "Proficiency in AI capabilities within the NetSuite ecosystem" },
      c2: { title: "NetSuite SuiteFoundation",                    desc: "Core knowledge of NetSuite platform, data model, and administration" },
    },
  },

  es: {
    nav: {
      skills: "Habilidades",
      experience: "Experiencia",
      projects: "Proyectos",
      certs: "Certificaciones",
      contact: "Contacto",
    },
    status: "Disponible para contratar",
    hero: {
      tag: "Desarrollador NetSuite & Consultor Técnico",
      h1_1: "Construyendo ",
      h1_accent: "soluciones ERP",
      h1_2: " escalables con ",
      h1_accent2: "SuiteScript",
      desc: "6+ años creando soluciones NetSuite personalizadas — desde automatización con SuiteScript e integraciones REST API hasta cumplimiento fiscal latinoamericano y customizaciones WMS. 100+ proyectos entregados en manufactura, logística y más.",
      cta1: "Contactar",
      cta2: "Ver Proyectos",
      cta3: "Descargar CV",
      stat1: "Años de Experiencia",
      stat2: "Proyectos Entregados",
      stat3: "Certificaciones Oracle",
      stat4: "Industrias Atendidas",
    },
    sections: {
      skills:     { label: "// lo que hago",   title: "Habilidades Técnicas" },
      experience: { label: "// trayectoria",   title: "Experiencia" },
      projects:   { label: "// trabajo selecto", title: "Proyectos" },
      certs:      { label: "// credenciales",  title: "Certificaciones" },
      contact:    { label: "// conectemos",    title: "Contacto" },
    },
    contact: {
      heading: "Abierto a nuevas oportunidades",
      desc: "Ya sea que necesites un desarrollador NetSuite para un proyecto SuiteScript personalizado, una implementación ERP completa, o una integración con sistemas externos — estoy listo para convertir tus requerimientos en código limpio y mantenible.",
      name: "Tu nombre",
      email: "Tu email",
      subject: "Asunto",
      message: "Contame sobre tu proyecto...",
      send: "Enviar Mensaje",
    },
    footer: {
      rights: "Todos los derechos reservados.",
      tagline: "Construido con precisión nivel SuiteScript",
    },
    terminal: {
      passion: "Convertir desafíos ERP complejos en código limpio",
      comment: "// Abierto a nuevas oportunidades →",
    },
    skills: {
      s1: "Desarrollo SuiteScript",
      s2: "Integraciones & APIs",
      s3: "Plataforma NetSuite",
      s4: "Conocimiento Funcional ERP",
      s5: "Cumplimiento Fiscal LATAM",
      s6: "Desarrollo Web & Herramientas",
    },
    experience: {
      e1: {
        date: "Agosto 2025 — Presente",
        title: "Consultor & Desarrollador NetSuite",
        company: "Witbor",
        desc: "Participación en proyectos de implementación y mejora continua de NetSuite para clientes regionales. Diagnóstico y resolución de incidencias complejas en entornos productivos. Diseño y desarrollo de personalizaciones utilizando SuiteScript 1.0, 2.0 y 2.1, incluyendo automatizaciones, validaciones y reportes personalizados. Asistencia técnica y funcional a usuarios, y documentación de soluciones implementadas.",
      },
      e2: {
        date: "Enero 2023 — Agosto 2025",
        title: "Consultor & Desarrollador NetSuite",
        company: "BeApps Adistec",
        desc: "Lideré el diseño y desarrollo de integraciones REST API conectando NetSuite con plataformas externas, incluyendo sistemas de e-commerce, pasarelas de pago y proveedores fiscales de LATAM mediante OAuth 1.0/TBA. Construcción de arquitecturas escalables basadas en Map/Reduce y RESTlets para intercambio de datos de alto volumen. Impulso en la adopción de SuiteQL para reportes avanzados y colaboración en proyectos de conectores con Oracle Integration Cloud (OIC).",
      },
      e3: {
        date: "Diciembre 2019 — Diciembre 2022",
        title: "Desarrollador NetSuite",
        company: "Adistec",
        desc: "Desarrollo de scripts personalizados con SuiteScript enfocados en automatización de procesos en finanzas, ventas y logística. Creación y mantenimiento de flujos de trabajo (SuiteFlow) y formularios personalizados (SuiteBuilder). Soporte a usuarios clave y colaboración en la expansión del sistema a nuevos países dentro del grupo Adistec.",
      },
    },
    projects: {
      p1: { type: "Integración Fiscal",          title: "Suite de Facturación Electrónica LATAM", desc: "Integración end-to-end con CFE uruguayo, CFDI mexicano (GoSocket API), DTE chileno y sistemas fiscales argentinos. Maneja precios con impuestos incluidos, conciliación de montos netos y generación automática de XML." },
      p2: { type: "Automatización de Inventario", title: "Motor de Asignación de Lotes FEFO",      desc: "Script Map/Reduce para asignación automática de lotes FEFO en Órdenes de Trabajo. Optimización de governance para entornos de manufactura de alto volumen." },
      p3: { type: "App Web Full-Stack",            title: "Entre Telas — Catálogo de Productos",    desc: "Catálogo e-commerce full-stack para tienda de telas, con autenticación JWT, carga masiva Excel/CSV, gestión de categorías y navegación responsive." },
      p4: { type: "Solución ERP",                  title: "Sistema de Gestión de Alquileres",        desc: "Sistema completo de ciclo de vida de alquileres construido nativamente en NetSuite — gestión de contratos, facturación automatizada, seguimiento de activos y dashboards personalizados." },
      p5: { type: "Customización WMS",             title: "Operaciones WMS Mobile Extendidas",       desc: "Extensiones WMS Mobile para transferencias de bins, cambios de estado de inventario y flujos de \"Consumo de Materiales\" con lógica de numeración de pallets." },
      p6: { type: "Integración",                   title: "OIC ↔ NetSuite RESTlet Bridge",           desc: "Conector Oracle Integration Cloud a RESTlets de NetSuite usando OAuth 1.0/TBA. Incluye requests HTTP multipart/form-data y gestión segura de credenciales." },
    },
    certs: {
      c1: { title: "NetSuite Certified AI Foundations Associate", desc: "Competencia en capacidades de IA dentro del ecosistema NetSuite" },
      c2: { title: "NetSuite SuiteFoundation",                    desc: "Conocimiento central de la plataforma NetSuite, modelo de datos y administración" },
    },
  },
};

export default translations;
