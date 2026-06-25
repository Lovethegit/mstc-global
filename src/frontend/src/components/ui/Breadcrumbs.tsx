import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

/** Map path segments to human-readable labels */
const PATH_LABELS: Record<string, string> = {
  master: "Master Control",
  apps: "App Launcher",
  command: "Command Center",
  security: "Security",
  "legal-command": "Legalities",
  ai: "AI Universe",
  staff: "Staff Directory",
  admin: "Admin",
  settings: "Settings",
  briefing: "Briefing",
  properties: "Properties",
  intelligence: "Property Intelligence",
  redevelopment: "Redevelopment",
  rera: "RERA",
  rentals: "Rentals",
  commercial: "Commercial",
  crm: "CRM",
  leads: "Leads",
  clients: "Clients",
  proposals: "Proposals",
  appointments: "Appointments",
  finance: "Finance",
  legal: "Legal",
  tax: "Tax",
  billing: "Billing",
  documents: "Documents",
  campaigns: "Campaigns",
  whatsapp: "WhatsApp",
  notifications: "Notifications",
  reviews: "Reviews",
  referrals: "Referrals",
  events: "Events",
  hospitality: "Hospitality",
  calendar: "Calendar",
  ngo: "NGO",
  csr: "CSR",
  sports: "Sports",
  music: "Music",
  tourism: "Tourism",
  analytics: "Analytics",
  market: "Market Intel",
  competitors: "Competitors",
  health: "Health",
  deployments: "Deployments",
  api: "API",
  observe: "Observer",
  exchange: "Exchange",
  franchise: "Franchise",
  academy: "Academy",
  builder: "Website Builder",
  studio: "Studio",
  media: "Media",
  seo: "SEO",
  announcements: "Announcements",
};

function toLabel(segment: string): string {
  return (
    PATH_LABELS[segment] ??
    segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

type BreadcrumbsProps = {
  className?: string;
};

/**
 * Auto-generates breadcrumbs from the current pathname.
 * Splits on "/", maps to readable labels.
 * Only renders when depth > 1 (not on root "/").
 */
export default function Breadcrumbs({ className = "" }: BreadcrumbsProps) {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  if (segments.length <= 1) return null;

  const crumbs = segments.map((seg, i) => ({
    label: toLabel(seg),
    path: `/${segments.slice(0, i + 1).join("/")}`,
  }));

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1 flex-wrap text-xs font-sans text-muted-foreground ${className}`}
      data-ocid="nav.breadcrumbs"
    >
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-primary transition-colors"
        data-ocid="nav.breadcrumbs.home"
      >
        <Home size={12} />
        <span>Home</span>
      </Link>

      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.path} className="flex items-center gap-1">
            <ChevronRight size={12} className="text-muted-foreground/40" />
            {isLast ? (
              <span className="text-primary font-medium">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.path}
                className="hover:text-primary transition-colors"
                data-ocid={`nav.breadcrumbs.item.${i + 1}`}
              >
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
