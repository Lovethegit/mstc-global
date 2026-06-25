import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const services = [
  {
    slug: "infrastructure",
    label: "Infrastructure & Property",
    innerPages: [
      { slug: "residential", label: "Residential" },
      { slug: "commercial", label: "Commercial" },
      { slug: "industrial", label: "Industrial" },
    ],
  },
  {
    slug: "rera-consulting",
    label: "RERA & PR Consulting",
    innerPages: [
      { slug: "promoter-registration", label: "Promoter Registration" },
      { slug: "agent-compliance", label: "Agent Compliance" },
    ],
  },
  {
    slug: "purchase-rent",
    label: "Purchase, Rent & Redevelopment",
    innerPages: [
      { slug: "residential-rent", label: "Residential Rent" },
      { slug: "commercial-rent", label: "Commercial Rent" },
      { slug: "redevelopment", label: "Redevelopment" },
      { slug: "__portal__", label: "🔍 Property Portal" },
      { slug: "__tools__", label: "🛠️ Property Tools" },
    ],
  },
  {
    slug: "finance",
    label: "Finance & Investment",
    innerPages: [
      { slug: "home-loans", label: "Home Loans" },
      { slug: "business-loans", label: "Business Loans" },
      { slug: "equity-funding", label: "Equity Funding" },
      { slug: "__finance-tools__", label: "Finance Tools" },
    ],
  },
  {
    slug: "music-cultural",
    label: "Music & Cultural Services",
    innerPages: [
      { slug: "artist-management", label: "Artist Management" },
      { slug: "music-production", label: "Music Production" },
    ],
  },
  {
    slug: "hospitality-events",
    label: "Hospitality & Events",
    innerPages: [
      { slug: "venue-booking", label: "Venue Booking" },
      { slug: "corporate-events", label: "Corporate Events" },
    ],
  },
  {
    slug: "ngo-csr",
    label: "NGO & CSR Initiatives",
    innerPages: [
      { slug: "csr-fund-management", label: "CSR Fund Management" },
      { slug: "social-impact", label: "Social Impact" },
    ],
  },
  {
    slug: "media-sports-tourism",
    label: "Media, Sports & Tourism",
    innerPages: [
      { slug: "sports-events", label: "Sports Events" },
      { slug: "travel-itineraries", label: "Travel Itineraries" },
      { slug: "__talent__", label: "🎭 Talent Portal" },
    ],
  },
];

interface Props {
  onNavigate?: () => void;
  mobile?: boolean;
}

export default function MegaMenu({ onNavigate, mobile = false }: Props) {
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (mobile) {
    // Inline styles guarantee visibility on any dark background — no Tailwind class resolution issues
    const mobileItemStyle: React.CSSProperties = {
      display: "block",
      padding: "8px 16px",
      fontSize: "13px",
      color: "#c9a84c",
      textDecoration: "none",
      background: "transparent",
    };
    const mobileSubItemStyle: React.CSSProperties = {
      display: "block",
      padding: "6px 16px 6px 28px",
      fontSize: "12px",
      color: "#d4b87a",
      textDecoration: "none",
      background: "transparent",
    };
    const mobileHeadingStyle: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      textAlign: "left",
      padding: "12px 16px",
      fontSize: "14px",
      fontWeight: 600,
      color: "#e8d5a3",
      background: "transparent",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
    };

    return (
      <div>
        <button
          type="button"
          style={mobileHeadingStyle}
          onClick={() => setMobileExpanded(!mobileExpanded)}
          data-ocid="nav.mobile_services_toggle"
        >
          <span>Services</span>
          <ChevronDown
            size={14}
            style={{
              transition: "transform 0.2s",
              transform: mobileExpanded ? "rotate(180deg)" : "none",
              color: "#c9a84c",
            }}
          />
        </button>
        {mobileExpanded && (
          <div
            style={{
              marginLeft: "8px",
              marginTop: "4px",
              paddingBottom: "8px",
            }}
          >
            {services.map((svc) => (
              <div key={svc.slug} style={{ marginBottom: "8px" }}>
                <Link
                  to={`/services/${svc.slug}` as never}
                  style={{
                    ...mobileItemStyle,
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.08em",
                    color: "#c9a84c",
                  }}
                  onClick={onNavigate}
                  data-ocid={`nav.mobile_service_${svc.slug}`}
                >
                  {svc.label}
                </Link>
                <div>
                  {svc.innerPages.map((pg) =>
                    pg.slug === "__portal__" ? (
                      <Link
                        key={pg.slug}
                        to={"/property-portal" as never}
                        style={{
                          ...mobileSubItemStyle,
                          fontWeight: 600,
                          color: "#c9a84c",
                        }}
                        onClick={onNavigate}
                        data-ocid="nav.mobile_property_portal"
                      >
                        → {pg.label}
                      </Link>
                    ) : pg.slug === "__tools__" ? (
                      <Link
                        key={pg.slug}
                        to={"/property-tools" as never}
                        style={{
                          ...mobileSubItemStyle,
                          fontWeight: 600,
                          color: "#c9a84c",
                        }}
                        onClick={onNavigate}
                        data-ocid="nav.mobile_property_tools"
                      >
                        → {pg.label}
                      </Link>
                    ) : pg.slug === "__talent__" ? (
                      <Link
                        key={pg.slug}
                        to={"/talent-portal" as never}
                        style={{
                          ...mobileSubItemStyle,
                          fontWeight: 600,
                          color: "#c9a84c",
                        }}
                        onClick={onNavigate}
                        data-ocid="nav.mobile_talent_portal"
                      >
                        → {pg.label}
                      </Link>
                    ) : pg.slug === "__finance-tools__" ? (
                      <Link
                        key={pg.slug}
                        to={"/finance-tools" as never}
                        style={{
                          ...mobileSubItemStyle,
                          fontWeight: 600,
                          color: "#c9a84c",
                        }}
                        onClick={onNavigate}
                        data-ocid="nav.mobile_finance_tools"
                      >
                        → {pg.label}
                      </Link>
                    ) : (
                      <Link
                        key={pg.slug}
                        to={`/services/${svc.slug}/${pg.slug}` as never}
                        style={mobileSubItemStyle}
                        onClick={onNavigate}
                        data-ocid={`nav.mobile_inner_${svc.slug}_${pg.slug}`}
                      >
                        → {pg.label}
                      </Link>
                    ),
                  )}
                </div>
              </div>
            ))}
            {/* Resources section */}
            <div
              style={{
                marginTop: "8px",
                paddingTop: "8px",
                borderTop: "1px solid rgba(201,168,76,0.2)",
              }}
            >
              <span
                style={{
                  display: "block",
                  padding: "0 16px 6px",
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#a89060",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Resources
              </span>
              <Link
                to={"/nri-corner" as never}
                style={mobileSubItemStyle}
                onClick={onNavigate}
                data-ocid="nav.mobile_nri_corner"
              >
                → NRI Corner
              </Link>
              <Link
                to={"/news" as never}
                style={mobileSubItemStyle}
                onClick={onNavigate}
                data-ocid="nav.mobile_news"
              >
                → Latest News
              </Link>
              <Link
                to={"/brochure" as never}
                style={{
                  ...mobileSubItemStyle,
                  fontWeight: 700,
                  color: "#c9a84c",
                }}
                onClick={onNavigate}
                data-ocid="nav.mobile_brochure"
              >
                → 📄 Download Brochure
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        className="flex items-center gap-1 px-4 py-2 text-sm font-sans font-medium text-gold-200 hover:text-gold-400 transition-colors duration-200 relative group"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        data-ocid="nav.services_toggle"
        aria-haspopup="true"
        aria-expanded={open}
      >
        Services
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gold-500 group-hover:w-3/4 transition-all duration-300" />
      </button>

      <div
        className={`mega-menu ${open ? "open" : ""}`}
        onMouseLeave={() => setOpen(false)}
        role="menu"
      >
        {services.map((svc) => (
          <div key={svc.slug} className="mega-menu-section">
            <Link
              to={`/services/${svc.slug}` as never}
              className="mega-menu-title block hover:underline"
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              data-ocid={`nav.service_${svc.slug}`}
            >
              {svc.label}
            </Link>
            {svc.innerPages.map((pg) =>
              pg.slug === "__portal__" ? (
                <Link
                  key={pg.slug}
                  to={"/property-portal" as never}
                  className="mega-menu-link block font-semibold"
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                  data-ocid="nav.property_portal"
                >
                  {pg.label}
                </Link>
              ) : pg.slug === "__tools__" ? (
                <Link
                  key={pg.slug}
                  to={"/property-tools" as never}
                  className="mega-menu-link block font-semibold"
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                  data-ocid="nav.property_tools"
                >
                  {pg.label}
                </Link>
              ) : pg.slug === "__talent__" ? (
                <Link
                  key={pg.slug}
                  to={"/talent-portal" as never}
                  className="mega-menu-link block font-semibold"
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                  data-ocid="nav.talent_portal"
                >
                  {pg.label}
                </Link>
              ) : pg.slug === "__finance-tools__" ? (
                <Link
                  key={pg.slug}
                  to={"/finance-tools" as never}
                  className="mega-menu-link block font-semibold"
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                  data-ocid="nav.finance_tools"
                >
                  {pg.label}
                </Link>
              ) : (
                <Link
                  key={pg.slug}
                  to={`/services/${svc.slug}/${pg.slug}` as never}
                  className="mega-menu-link block"
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                  data-ocid={`nav.inner_${svc.slug}_${pg.slug}`}
                >
                  {pg.label}
                </Link>
              ),
            )}
          </div>
        ))}
        {/* Resources sub-section — subtle, at bottom of dropdown */}
        <div
          className="mega-menu-section"
          style={{
            borderTop: "1px solid oklch(var(--gold-800) / 0.25)",
            paddingTop: "0.75rem",
          }}
        >
          <span className="block text-[10px] font-semibold text-gold-600 uppercase tracking-widest mb-2">
            Resources
          </span>
          <Link
            to={"/nri-corner" as never}
            className="mega-menu-link block"
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
            data-ocid="nav.nri_corner"
          >
            NRI Corner
          </Link>
          <Link
            to={"/news" as never}
            className="mega-menu-link block"
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
            data-ocid="nav.news"
          >
            Latest News
          </Link>{" "}
          <Link
            to={"/brochure" as never}
            className="mega-menu-link block font-semibold"
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
            data-ocid="nav.brochure"
          >
            Download Brochure
          </Link>
        </div>
      </div>
    </div>
  );
}
