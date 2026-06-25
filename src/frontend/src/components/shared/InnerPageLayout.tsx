import PrivacyGate from "@/components/PrivacyGate";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import BackToTop from "@/components/ui/BackToTop";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";

interface Props {
  serviceSlug: string;
  serviceName: string;
  innerPageTitle: string;
  innerPageSubtitle: string;
  bgGradient?: string;
  children: React.ReactNode;
}

export default function InnerPageLayout({
  serviceSlug,
  serviceName,
  innerPageTitle,
  innerPageSubtitle,
  children,
}: Props) {
  const navigate = useNavigate();
  return (
    <PrivacyGate>
      <div className="min-h-screen bg-background text-foreground">
        <Header />

        {/* Inner Hero */}
        <section className="inner-hero" style={{ paddingTop: "5rem" }}>
          <div className="inner-hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            {/* Breadcrumb */}
            <nav
              className="inner-hero-breadcrumb flex items-center gap-1.5"
              aria-label="Breadcrumb"
            >
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight size={12} />
              <Link
                to={`/services/${serviceSlug}` as never}
                className="hover:text-primary transition-colors"
              >
                {serviceName}
              </Link>
              <ChevronRight size={12} />
              <span className="text-primary">{innerPageTitle}</span>
            </nav>

            <div className="inner-hero-badge mt-4">{serviceName}</div>
            <h1 className="inner-hero-title">{innerPageTitle}</h1>
            <p className="font-sans text-muted-foreground max-w-2xl text-sm md:text-base leading-relaxed mt-2">
              {innerPageSubtitle}
            </p>

            <div className="flex items-center gap-3 mt-5">
              {/* Back button */}
              <button
                type="button"
                onClick={() =>
                  navigate({ to: `/services/${serviceSlug}` as never })
                }
                className="inline-flex items-center gap-2 text-sm font-sans text-primary hover:text-primary/80 transition-colors group"
                data-ocid="inner.back_to_service_button"
              >
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Back to {serviceName}
              </button>
            </div>
          </div>
        </section>

        {/* Page Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {children}
        </main>

        <Footer />
        <BackToTop />
      </div>
    </PrivacyGate>
  );
}
