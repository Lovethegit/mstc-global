/**
 * router/index.tsx
 * Centralised route catalogue for MSTC GLOBAL.
 * All new routes should be registered here and imported into App.tsx.
 */

export const ROUTES = {
  // Public
  home: "/",
  privacyPolicy: "/privacy-policy",
  terms: "/terms",
  cookiePolicy: "/cookie-policy",
  disclaimer: "/disclaimer",

  // Admin apps
  master: "/master",
  apps: "/apps",
  command: "/command",
  ai: "/ai",
  staff: "/staff",
  admin: "/admin",
  settings: "/settings",
  briefing: "/briefing",

  // Property
  properties: "/properties",
  intelligence: "/intelligence",
  redevelopment: "/redevelopment",
  rera: "/rera",
  rentals: "/rentals",
  commercial: "/commercial",

  // CRM
  crm: "/crm",
  leads: "/leads",
  clients: "/clients",
  proposals: "/proposals",
  appointments: "/appointments",

  // Finance
  finance: "/finance-admin",
  legal: "/legal",
  tax: "/tax",
  billing: "/billing",
  documents: "/documents",

  // Communication
  campaigns: "/campaigns",
  whatsapp: "/whatsapp",
  notifications: "/notifications",
  reviews: "/reviews",
  referrals: "/referrals",

  // Events
  events: "/events",
  hospitality: "/hospitality",
  calendar: "/calendar",

  // NGO & CSR
  ngo: "/ngo",
  csr: "/csr",

  // Sports, Music, Tourism
  sports: "/sports",
  music: "/music",
  tourism: "/tourism",

  // Analytics
  analytics: "/analytics",
  market: "/market",
  competitors: "/competitors",

  // Platform
  health: "/health",
  deployments: "/deployments",
  api: "/api",

  // Special
  security: "/security",
  legalCommand: "/legal-command",
  observe: "/observe",

  // New routes
  exchange: "/exchange",
  franchise: "/franchise",
  academy: "/academy",
  appDownload: "/apps/download",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
