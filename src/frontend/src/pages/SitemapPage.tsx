import { ArrowLeft, Home, Lock } from "lucide-react";

// SECURITY: Only public-facing pages listed here. No internal app routes.
const publicPages = [
  {
    category: "Main",
    pages: [
      { label: "Home", path: "/", description: "MSTC GLOBAL homepage" },
      {
        label: "About Us",
        path: "/#about",
        description: "About MSTC GLOBAL and our leadership",
      },
      {
        label: "Contact Us",
        path: "/#contact",
        description: "Reach our team in Ahmedabad",
      },
    ],
  },
  {
    category: "Our Services",
    pages: [
      {
        label: "Infrastructure & Property",
        path: "/#services",
        description: "Development and advisory",
      },
      {
        label: "RERA & PR Consulting",
        path: "/#services",
        description: "RERA registration and compliance",
      },
      {
        label: "Purchase, Rent & Redevelopment",
        path: "/#services",
        description: "Buy, sell, and lease",
      },
      {
        label: "Finance & Investment",
        path: "/#services",
        description: "Loans and investment advisory",
      },
      {
        label: "Music & Cultural Services",
        path: "/#services",
        description: "Artist management and events",
      },
      {
        label: "Hospitality & Events",
        path: "/#services",
        description: "Corporate and private events",
      },
      {
        label: "NGO & CSR Initiatives",
        path: "/#services",
        description: "Social impact programs",
      },
      {
        label: "Media, Sports & Tourism",
        path: "/#services",
        description: "Media and sports management",
      },
    ],
  },
  {
    category: "Legal & Policies",
    pages: [
      {
        label: "Privacy Policy",
        path: "/privacy-policy",
        description: "How we handle your data",
      },
      {
        label: "Terms & Conditions",
        path: "/terms",
        description: "Terms governing use of our services",
      },
      {
        label: "Cookie Policy",
        path: "/cookie-policy",
        description: "Our use of cookies",
      },
      {
        label: "Disclaimer",
        path: "/disclaimer",
        description: "Important legal disclaimers",
      },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen" style={{ background: "#06090f" }}>
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-primary/20 bg-card/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                window.location.href = "/";
              }
            }}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-sans text-sm transition-colors"
            data-ocid="sitemap.back_button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-primary" />
            <span className="font-serif font-bold text-primary text-sm tracking-widest uppercase">
              MSTC GLOBAL
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-3">
            Site Map
          </h1>
          <p className="font-sans text-sm text-muted-foreground">
            Public pages and sections available on MSTC GLOBAL
          </p>
        </div>

        {/* Security notice */}
        <div className="mb-8 p-4 rounded-xl border border-primary/20 bg-card flex items-start gap-3">
          <Lock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="font-sans text-xs text-muted-foreground leading-relaxed">
            This sitemap lists public-facing pages only. Internal business
            applications, staff portals, and administrative tools are not listed
            here and are accessible only to authorized personnel.
          </p>
        </div>

        <div className="space-y-8">
          {publicPages.map((group) => (
            <div key={group.category}>
              <h2 className="font-serif text-lg font-bold text-primary mb-4 border-b border-primary/20 pb-2">
                {group.category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {group.pages.map((page) => (
                  <a
                    key={page.path + page.label}
                    href={page.path}
                    className="group flex items-start gap-3 p-4 rounded-lg border border-primary/10 bg-card hover:border-primary/30 hover:bg-card/80 transition-all duration-200"
                    data-ocid={`sitemap.${group.category.toLowerCase().replace(/[^a-z0-9]/g, "_")}.link`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary mt-1.5 shrink-0 transition-colors" />
                    <div>
                      <div className="font-sans text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {page.label}
                      </div>
                      <div className="font-sans text-xs text-muted-foreground mt-0.5">
                        {page.description}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-primary/10 py-6">
        <p className="text-center font-sans text-xs text-muted-foreground/50">
          &copy; {new Date().getFullYear()} MSTC GLOBAL. All rights reserved.
        </p>
      </div>
    </div>
  );
}
