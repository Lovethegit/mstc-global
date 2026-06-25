import { RequestFormsSection } from "@/components/forms/RequestFormsSection";
import {
  Link,
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useLocation,
} from "@tanstack/react-router";
import React, { Suspense, lazy, useEffect, useState } from "react";
import AnnouncementBanner from "./components/AnnouncementBanner";
import CallbackButton from "./components/CallbackButton";
import GlobalSearch from "./components/GlobalSearch";
import LiveNewsFeed from "./components/LiveNewsFeed";
import PrivacyGate from "./components/PrivacyGate";
import ChatWidget from "./components/chat/ChatWidget";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import About from "./components/sections/About";
import Contact from "./components/sections/Contact";
import Hero from "./components/sections/Hero";
import Services from "./components/sections/Services";
import { useGetLatestNews } from "./hooks/useNewsQueries";
import { useLogReferralClick } from "./hooks/useReferralQueries";
import AcademyPage from "./pages/AcademyPage";
import AnnouncementManagerPage from "./pages/AnnouncementManagerPage";
import ClientPortalPage from "./pages/ClientPortalPage";
import CompetitiveIntelPage from "./pages/CompetitiveIntelPage";
import DocumentCenterPage from "./pages/DocumentCenterPage";
import ExchangePage from "./pages/ExchangePage";
import FranchisePage from "./pages/FranchisePage";
import HospitalityPage from "./pages/HospitalityPage";
import LeadManagerPage from "./pages/LeadManagerPage";
import LegalVaultPage from "./pages/LegalVaultPage";
import MarketIntelligencePage from "./pages/MarketIntelligencePage";
import MusicCulturePage from "./pages/MusicCulturePage";
import NewsPage from "./pages/NewsPage";
import NotificationCenterPage from "./pages/NotificationCenterPage";
import ReviewManagerPage from "./pages/ReviewManagerPage";
import SportsDeskPage from "./pages/SportsDeskPage";
import TaxCompliancePage from "./pages/TaxCompliancePage";
import TourismPlannerPage from "./pages/TourismPlannerPage";

// Lazy-loaded pages
const AdminPage = lazy(() => import("./pages/AdminPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const NriCornerPage = lazy(() => import("./pages/NriCornerPage"));
const PropertyPortalPage = lazy(() => import("./pages/PropertyPortalPage"));
const ReferralPage = lazy(() => import("./pages/ReferralPage"));
const AuctionBoardPage = lazy(() => import("./pages/AuctionBoardPage"));
const DealMatchmakerPage = lazy(() => import("./pages/DealMatchmakerPage"));
const NeighborhoodExplorerPage = lazy(
  () => import("./pages/NeighborhoodExplorerPage"),
);
const NewsletterPage = lazy(() => import("./pages/NewsletterPage"));
const LegalDocsGeneratorPage = lazy(
  () => import("./pages/LegalDocsGeneratorPage"),
);
const HomeTourPage = lazy(() => import("./pages/HomeTourPage"));
const EventBookingPage = lazy(() => import("./pages/EventBookingPage"));
const ArtistShowcasePage = lazy(() => import("./pages/ArtistShowcasePage"));
const CsrImpactPage = lazy(() => import("./pages/CsrImpactPage"));
const NriSimulatorPage = lazy(() => import("./pages/NriSimulatorPage"));
const PartnerNetworkPage = lazy(() => import("./pages/PartnerNetworkPage"));
const BuilderProfilesPage = lazy(() => import("./pages/BuilderProfilesPage"));
const TrackEnquiryPage = lazy(() => import("./pages/TrackEnquiryPage"));
const ComplaintPage = lazy(() => import("./pages/ComplaintPage"));
const AreaGuidesPage = lazy(() => import("./pages/AreaGuidesPage"));
const AreaGuidePage = lazy(() => import("./pages/AreaGuidePage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const EventToolsPage = lazy(() => import("./pages/EventToolsPage"));
const CsrToolsPage = lazy(() => import("./pages/CsrToolsPage"));
const SportsPortalPage = lazy(() => import("./pages/SportsPortalPage"));
const TravelCustomizerPage = lazy(() => import("./pages/TravelCustomizerPage"));
const TalentPortalPage = lazy(() => import("./pages/TalentPortalPage"));
const BrochurePage = lazy(() => import("./pages/BrochurePage"));
const PropertyToolsPage = lazy(() => import("./pages/PropertyToolsPage"));
const FinanceToolsPage = lazy(() => import("./pages/FinanceToolsPage"));
const ObserverPage = lazy(() => import("./pages/ObserverPage"));
const TutorialEngine = lazy(
  () => import("./components/tutorial/TutorialEngine"),
);

// Internal app pages (secured)
const MasterControlPage = lazy(() => import("./pages/MasterControlPage"));
const AppLauncherPage = lazy(() => import("./pages/AppLauncherPage"));
const CommandCenterPage = lazy(() => import("./pages/CommandCenterPage"));
const ExecutiveBriefingPage = lazy(
  () => import("./pages/ExecutiveBriefingPage"),
);
const SecurityAppPage = lazy(() => import("./pages/SecurityAppPage"));
const LegalitiesAppPage = lazy(() => import("./pages/LegalitiesAppPage"));
const AIUniversePage = lazy(() => import("./pages/AIUniversePage"));
const StaffDirectoryPage = lazy(() => import("./pages/StaffDirectoryPage"));

// Lazy inner pages
const FinanceBusinessLoansPage = lazy(
  () => import("./pages/inner/finance/BusinessLoansPage"),
);
const FinanceEquityFundingPage = lazy(
  () => import("./pages/inner/finance/EquityFundingPage"),
);
const FinanceHomeLoansPage = lazy(
  () => import("./pages/inner/finance/HomeLoansPage"),
);
const HospCorporatePage = lazy(
  () => import("./pages/inner/hospitality-events/CorporateEventsPage"),
);
const HospVenuePage = lazy(
  () => import("./pages/inner/hospitality-events/VenueBookingPage"),
);
const InfraCommercialPage = lazy(
  () => import("./pages/inner/infrastructure/CommercialPage"),
);
const InfraIndustrialPage = lazy(
  () => import("./pages/inner/infrastructure/IndustrialPage"),
);
const InfraResidentialPage = lazy(
  () => import("./pages/inner/infrastructure/ResidentialPage"),
);
const MediaSportsPage = lazy(
  () => import("./pages/inner/media-sports-tourism/SportsEventsPage"),
);
const MediaTravelPage = lazy(
  () => import("./pages/inner/media-sports-tourism/TravelItinerariesPage"),
);
const MusicArtistPage = lazy(
  () => import("./pages/inner/music-cultural/ArtistManagementPage"),
);
const MusicProductionPage = lazy(
  () => import("./pages/inner/music-cultural/MusicProductionPage"),
);
const NgoCsrFundPage = lazy(
  () => import("./pages/inner/ngo-csr/CsrFundManagementPage"),
);
const NgoSocialPage = lazy(
  () => import("./pages/inner/ngo-csr/SocialImpactPage"),
);
const PurchaseCommercialRentPage = lazy(
  () => import("./pages/inner/purchase-rent/CommercialRentPage"),
);
const PurchaseRedevelopmentPage = lazy(
  () => import("./pages/inner/purchase-rent/RedevelopmentPage"),
);
const PurchaseResidentialRentPage = lazy(
  () => import("./pages/inner/purchase-rent/ResidentialRentPage"),
);
const ReraAgentPage = lazy(
  () => import("./pages/inner/rera-consulting/AgentCompliancePage"),
);
const ReraPromoterPage = lazy(
  () => import("./pages/inner/rera-consulting/PromoterRegistrationPage"),
);
const FinancePage = lazy(() => import("./pages/services/FinancePage"));
const HospitalityEventsPage = lazy(
  () => import("./pages/services/HospitalityEventsPage"),
);
const InfrastructurePage = lazy(
  () => import("./pages/services/InfrastructurePage"),
);
const MediaSportsTourismPage = lazy(
  () => import("./pages/services/MediaSportsTourismPage"),
);
const MusicCulturalPage = lazy(
  () => import("./pages/services/MusicCulturalPage"),
);
const NgoCsrPage = lazy(() => import("./pages/services/NgoCsrPage"));
const PurchaseRentPage = lazy(
  () => import("./pages/services/PurchaseRentPage"),
);
const ReraConsultingPage = lazy(
  () => import("./pages/services/ReraConsultingPage"),
);

// Legal pages (lazy)
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const CookiePolicyPage = lazy(() => import("./pages/CookiePolicyPage"));
const DisclaimerPage = lazy(() => import("./pages/DisclaimerPage"));
const _SitemapPage = lazy(() => import("./pages/SitemapPage"));

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

function ReferralTracker() {
  const logClick = useLogReferralClick();
  const logged =
    typeof sessionStorage !== "undefined"
      ? sessionStorage.getItem("mstc_ref_logged")
      : null;
  if (!logged && typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      sessionStorage.setItem("mstc_ref_logged", "1");
      logClick.mutate(ref);
    }
  }
  return null;
}

function NewsCard({
  article,
}: { article: import("./hooks/useNewsQueries").NewsArticle }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gold-800/30 bg-card hover:border-gold-500/40 transition-all duration-300 flex flex-col">
      {article.imageUrl && (
        <div className="h-40 overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gold-700/20 text-gold-400 font-sans w-fit">
          {article.category}
        </span>
        <h4 className="font-serif font-semibold text-sm text-foreground leading-snug line-clamp-2">
          {article.title}
        </h4>
        <p className="font-sans text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {article.summary}
        </p>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gold-800/20">
          <span className="text-[10px] text-gold-600 font-sans">
            {article.source}
          </span>
          <Link
            to="/news"
            className="text-xs text-gold-400 hover:text-gold-300 font-sans transition-colors"
            data-ocid="home.news.read_more_link"
          >
            View all →
          </Link>
        </div>
      </div>
    </div>
  );
}

function HomeNewsSection() {
  const { data: articles = [], isLoading } = useGetLatestNews();
  const featured = articles.slice(0, 3);

  return (
    <section
      className="py-16 px-4 bg-obsidian-800/30 border-t border-gold-800/20"
      id="news"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif font-bold text-2xl md:text-3xl gold-text">
              Latest News &amp; Insights
            </h2>
            <p className="font-sans text-sm text-obsidian-100 mt-1">
              Real estate, RERA, finance &amp; investment updates
            </p>
          </div>
          <Link
            to="/news"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gold-700/40 text-gold-400 hover:border-gold-500/60 transition-colors text-sm font-sans"
            data-ocid="home.news.view_all_button"
          >
            View all articles →
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-52 rounded-xl bg-obsidian-700/40 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {featured.map((a) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
        )}
        <div className="mt-6 text-center sm:hidden">
          <Link
            to="/news"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg border border-gold-700/40 text-gold-400 font-sans text-sm"
            data-ocid="home.news.mobile_view_all_button"
          >
            View all articles →
          </Link>
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-obsidian-900 text-gold-100">
      <AnnouncementBanner />
      <Header />
      <main>
        <Hero />
        <Services />
        <About />

        <Contact />
        <RequestFormsSection />
        <HomeNewsSection />
        {/* Live News Feed */}
        <section
          className="py-16 px-4 bg-background border-t border-gold-800/15"
          id="live-news"
        >
          <div className="max-w-7xl mx-auto">
            <LiveNewsFeed limit={6} compact={false} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function GlobalSearchTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return open ? <GlobalSearch onClose={() => setOpen(false)} /> : null;
}

function RootLayout() {
  const location = useLocation();
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally re-run on location change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);
  return (
    <Suspense fallback={null}>
      <TutorialEngine>
        <Outlet />
      </TutorialEngine>
      <GlobalSearchTrigger />
    </Suspense>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const infrastructureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/infrastructure",
  component: () => (
    <Lazy>
      <InfrastructurePage />
    </Lazy>
  ),
});
const reraConsultingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/rera-consulting",
  component: () => (
    <Lazy>
      <ReraConsultingPage />
    </Lazy>
  ),
});
const purchaseRentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/purchase-rent",
  component: () => (
    <Lazy>
      <PurchaseRentPage />
    </Lazy>
  ),
});
const financeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/finance",
  component: () => (
    <Lazy>
      <FinancePage />
    </Lazy>
  ),
});
const musicCulturalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/music-cultural",
  component: () => (
    <Lazy>
      <MusicCulturalPage />
    </Lazy>
  ),
});
const hospitalityEventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/hospitality-events",
  component: () => (
    <Lazy>
      <HospitalityEventsPage />
    </Lazy>
  ),
});
const ngoCsrRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/ngo-csr",
  component: () => (
    <Lazy>
      <NgoCsrPage />
    </Lazy>
  ),
});
const mediaSportsTourismRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/media-sports-tourism",
  component: () => (
    <Lazy>
      <MediaSportsTourismPage />
    </Lazy>
  ),
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <Lazy>
      <AdminPage />
    </Lazy>
  ),
});

const auctionBoardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auction-board",
  component: () => (
    <Lazy>
      <AuctionBoardPage />
    </Lazy>
  ),
});

const dealMatchmakerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/deal-matchmaker",
  component: () => (
    <Lazy>
      <DealMatchmakerPage />
    </Lazy>
  ),
});

const neighborhoodExplorerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/neighborhood-explorer",
  component: () => (
    <Lazy>
      <NeighborhoodExplorerPage />
    </Lazy>
  ),
});

const newsletterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/newsletter",
  component: () => (
    <Lazy>
      <NewsletterPage />
    </Lazy>
  ),
});

const legalDocsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/legal-docs-generator",
  component: () => (
    <Lazy>
      <LegalDocsGeneratorPage />
    </Lazy>
  ),
});

const homeTourRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/3d-home-tour",
  component: () => (
    <Lazy>
      <HomeTourPage />
    </Lazy>
  ),
});

const eventBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/event-booking",
  component: () => (
    <Lazy>
      <EventBookingPage />
    </Lazy>
  ),
});

const artistShowcaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/artist-showcase",
  component: () => (
    <Lazy>
      <ArtistShowcasePage />
    </Lazy>
  ),
});

const csrImpactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/csr-impact",
  component: () => (
    <Lazy>
      <CsrImpactPage />
    </Lazy>
  ),
});

const nriSimulatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nri-simulator",
  component: () => (
    <Lazy>
      <NriSimulatorPage />
    </Lazy>
  ),
});

// Inner routes (lazy)
const infraResidentialRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/infrastructure/residential",
  component: () => (
    <Lazy>
      <InfraResidentialPage />
    </Lazy>
  ),
});
const infraCommercialRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/infrastructure/commercial",
  component: () => (
    <Lazy>
      <InfraCommercialPage />
    </Lazy>
  ),
});
const infraIndustrialRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/infrastructure/industrial",
  component: () => (
    <Lazy>
      <InfraIndustrialPage />
    </Lazy>
  ),
});
const reraPromoterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/rera-consulting/promoter-registration",
  component: () => (
    <Lazy>
      <ReraPromoterPage />
    </Lazy>
  ),
});
const reraAgentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/rera-consulting/agent-compliance",
  component: () => (
    <Lazy>
      <ReraAgentPage />
    </Lazy>
  ),
});
const purchaseResRentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/purchase-rent/residential-rent",
  component: () => (
    <Lazy>
      <PurchaseResidentialRentPage />
    </Lazy>
  ),
});
const purchaseComRentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/purchase-rent/commercial-rent",
  component: () => (
    <Lazy>
      <PurchaseCommercialRentPage />
    </Lazy>
  ),
});
const purchaseRedevelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/purchase-rent/redevelopment",
  component: () => (
    <Lazy>
      <PurchaseRedevelopmentPage />
    </Lazy>
  ),
});
const finHomeLoansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/finance/home-loans",
  component: () => (
    <Lazy>
      <FinanceHomeLoansPage />
    </Lazy>
  ),
});
const finBizLoansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/finance/business-loans",
  component: () => (
    <Lazy>
      <FinanceBusinessLoansPage />
    </Lazy>
  ),
});
const finEquityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/finance/equity-funding",
  component: () => (
    <Lazy>
      <FinanceEquityFundingPage />
    </Lazy>
  ),
});
const musicArtistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/music-cultural/artist-management",
  component: () => (
    <Lazy>
      <MusicArtistPage />
    </Lazy>
  ),
});
const musicProdRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/music-cultural/music-production",
  component: () => (
    <Lazy>
      <MusicProductionPage />
    </Lazy>
  ),
});
const hospVenueRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/hospitality-events/venue-booking",
  component: () => (
    <Lazy>
      <HospVenuePage />
    </Lazy>
  ),
});
const hospCorpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/hospitality-events/corporate-events",
  component: () => (
    <Lazy>
      <HospCorporatePage />
    </Lazy>
  ),
});
const ngoCsrFundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/ngo-csr/csr-fund-management",
  component: () => (
    <Lazy>
      <NgoCsrFundPage />
    </Lazy>
  ),
});
const ngoSocialRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/ngo-csr/social-impact",
  component: () => (
    <Lazy>
      <NgoSocialPage />
    </Lazy>
  ),
});
const mediaSportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/media-sports-tourism/sports-events",
  component: () => (
    <Lazy>
      <MediaSportsPage />
    </Lazy>
  ),
});
const mediaTravelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/media-sports-tourism/travel-itineraries",
  component: () => (
    <Lazy>
      <MediaTravelPage />
    </Lazy>
  ),
});

const propertyPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/property-portal",
  component: () => (
    <Lazy>
      <PropertyPortalPage />
    </Lazy>
  ),
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: () => (
    <Lazy>
      <BlogPage />
    </Lazy>
  ),
});

const newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/news",
  component: () => (
    <Lazy>
      <NewsPage />
    </Lazy>
  ),
});

const partnersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/partners",
  component: () => (
    <Lazy>
      <PartnerNetworkPage />
    </Lazy>
  ),
});

const nriCornerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nri-corner",
  component: () => (
    <Lazy>
      <NriCornerPage />
    </Lazy>
  ),
});

const referralRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/refer",
  component: () => (
    <Lazy>
      <ReferralPage />
    </Lazy>
  ),
});

const trackEnquiryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/track-enquiry",
  component: () => (
    <Lazy>
      <TrackEnquiryPage />
    </Lazy>
  ),
});

const complaintRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/complaint",
  component: () => (
    <Lazy>
      <ComplaintPage />
    </Lazy>
  ),
});

const builderProfilesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/builder-profiles",
  component: () => (
    <Lazy>
      <BuilderProfilesPage />
    </Lazy>
  ),
});

const areaGuidesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/area-guides",
  component: () => (
    <Lazy>
      <AreaGuidesPage />
    </Lazy>
  ),
});

const areaGuideRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/area-guides/$locality",
  component: () => (
    <Lazy>
      <AreaGuidePage />
    </Lazy>
  ),
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faq",
  component: () => (
    <Lazy>
      <FaqPage />
    </Lazy>
  ),
});

const eventToolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/event-tools",
  component: () => (
    <Lazy>
      <EventToolsPage />
    </Lazy>
  ),
});

const csrToolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/csr-tools",
  component: () => (
    <Lazy>
      <CsrToolsPage />
    </Lazy>
  ),
});

const sportsPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sports-portal",
  component: () => (
    <Lazy>
      <SportsPortalPage />
    </Lazy>
  ),
});

const travelCustomizerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/travel-customizer",
  component: () => (
    <Lazy>
      <TravelCustomizerPage />
    </Lazy>
  ),
});
const talentPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/talent-portal",
  component: () => (
    <Lazy>
      <TalentPortalPage />
    </Lazy>
  ),
});

const brochureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/brochure",
  component: () => (
    <Lazy>
      <BrochurePage />
    </Lazy>
  ),
});

const propertyToolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/property-tools",
  component: () => (
    <Lazy>
      <PropertyToolsPage />
    </Lazy>
  ),
});

const financeToolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/finance-tools",
  component: () => (
    <Lazy>
      <FinanceToolsPage />
    </Lazy>
  ),
});

const observeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/observe",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ObserverPage />
    </Suspense>
  ),
});

const masterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/master",
  component: () => (
    <Lazy>
      <MasterControlPage />
    </Lazy>
  ),
});

const appsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/apps",
  component: () => (
    <Lazy>
      <AppLauncherPage />
    </Lazy>
  ),
});

const appsDownloadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/apps/download",
  component: () => (
    <Lazy>
      <AppDownloadPage />
    </Lazy>
  ),
});

const commandRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/command",
  component: () => (
    <Lazy>
      <CommandCenterPage />
    </Lazy>
  ),
});

const briefingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/briefing",
  component: () => (
    <Lazy>
      <ExecutiveBriefingPage />
    </Lazy>
  ),
});

const securityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/security",
  component: () => (
    <Lazy>
      <SecurityAppPage />
    </Lazy>
  ),
});

const legalCommandRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/legal-command",
  component: () => (
    <Lazy>
      <LegalitiesAppPage />
    </Lazy>
  ),
});
const aiUniverseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai",
  component: () => (
    <Lazy>
      <AIUniversePage />
    </Lazy>
  ),
});

const staffDirectoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/staff",
  component: () => (
    <Lazy>
      <StaffDirectoryPage />
    </Lazy>
  ),
});

// ─── New internal app routes ──────────────────────────────────────────────────
const AppDownloadPage = lazy(() => import("./pages/AppDownloadPage"));
const ContentStudioPage = lazy(() => import("./pages/ContentStudioPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const NGOHubPage = lazy(() => import("./pages/NGOHubPage"));
const CSRDashboardPage = lazy(() => import("./pages/CSRDashboardPage"));
const CrmPage = lazy(() => import("./pages/CrmPage"));
const LeadsPage = lazy(() => import("./pages/LeadsPage"));
const ClientsPage = lazy(() => import("./pages/ClientsPage"));
const ProposalsPage = lazy(() => import("./pages/ProposalsPage"));
const AppointmentsPage = lazy(() => import("./pages/AppointmentsPage"));
const PropertiesAdminPage = lazy(() => import("./pages/PropertiesAdminPage"));
const PropertyIntelligencePage = lazy(
  () => import("./pages/PropertyIntelligencePage"),
);
const RedevelopmentPage = lazy(() => import("./pages/RedevelopmentPage"));
const ReraAdminPage = lazy(() => import("./pages/ReraAdminPage"));
const RentalsPage = lazy(() => import("./pages/RentalsPage"));
const CommercialPage = lazy(() => import("./pages/CommercialPage"));
const FinanceAdminPage = lazy(() => import("./pages/FinanceAdminPage"));
const LegalCommandPage = lazy(() => import("./pages/LegalCommandPage"));
const TaxPage = lazy(() => import("./pages/TaxPage"));
const BillingPage = lazy(() => import("./pages/BillingPage"));
const DocumentsAdminPage = lazy(() => import("./pages/DocumentsAdminPage"));
const CampaignsPage = lazy(() => import("./pages/CampaignsPage"));
const WhatsappAdminPage = lazy(() => import("./pages/WhatsappAdminPage"));
const NotificationsAdminPage = lazy(
  () => import("./pages/NotificationsAdminPage"),
);
const ReviewsAdminPage = lazy(() => import("./pages/ReviewsAdminPage"));
const ReferralsAdminPage = lazy(() => import("./pages/ReferralsAdminPage"));
const EventsAdminPage = lazy(() => import("./pages/EventsAdminPage"));
const HospitalityAdminPage = lazy(() => import("./pages/HospitalityAdminPage"));
const CalendarAdminPage = lazy(() => import("./pages/CalendarAdminPage"));
const NgoAdminPage = lazy(() => import("./pages/NgoAdminPage"));
const CsrAdminPage = lazy(() => import("./pages/CsrAdminPage"));
const SportsAdminPage = lazy(() => import("./pages/SportsAdminPage"));
const MusicAdminPage = lazy(() => import("./pages/MusicAdminPage"));
const TourismAdminPage = lazy(() => import("./pages/TourismAdminPage"));
const AnalyticsAdminPage = lazy(() => import("./pages/AnalyticsAdminPage"));
const MarketAdminPage = lazy(() => import("./pages/MarketAdminPage"));
const CompetitorsPage = lazy(() => import("./pages/CompetitorsPage"));
const PlatformHealthPage = lazy(() => import("./pages/PlatformHealthPage"));
const DeploymentsPage = lazy(() => import("./pages/DeploymentsPage"));
const ApiManagerPage = lazy(() => import("./pages/ApiManagerPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const BuilderPage = lazy(() => import("./pages/BuilderPage"));
const MediaLibraryPage = lazy(() => import("./pages/MediaLibraryPage"));
const SeoManagerPage = lazy(() => import("./pages/SeoManagerPage"));
const AnnouncementsPage = lazy(() => import("./pages/AnnouncementsPage"));

const contentStudioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/content",
  component: () => (
    <Lazy>
      <ContentStudioPage />
    </Lazy>
  ),
});
const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events",
  component: () => (
    <Lazy>
      <EventsPage />
    </Lazy>
  ),
});
const ngoHubRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ngo",
  component: () => (
    <Lazy>
      <NGOHubPage />
    </Lazy>
  ),
});
const csrDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/csr",
  component: () => (
    <Lazy>
      <CSRDashboardPage />
    </Lazy>
  ),
});
const crmRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/crm",
  component: () => (
    <Lazy>
      <CrmPage />
    </Lazy>
  ),
});
const leadsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leads",
  component: () => (
    <Lazy>
      <LeadsPage />
    </Lazy>
  ),
});
const clientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/clients",
  component: () => (
    <Lazy>
      <ClientsPage />
    </Lazy>
  ),
});
const proposalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/proposals",
  component: () => (
    <Lazy>
      <ProposalsPage />
    </Lazy>
  ),
});
const appointmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/appointments",
  component: () => (
    <Lazy>
      <AppointmentsPage />
    </Lazy>
  ),
});
const propertiesAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/properties-admin",
  component: () => (
    <Lazy>
      <PropertiesAdminPage />
    </Lazy>
  ),
});
const intelligenceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/intelligence",
  component: () => (
    <Lazy>
      <PropertyIntelligencePage />
    </Lazy>
  ),
});
const redevelopmentAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/redevelopment",
  component: () => (
    <Lazy>
      <RedevelopmentPage />
    </Lazy>
  ),
});
const reraAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rera-admin",
  component: () => (
    <Lazy>
      <ReraAdminPage />
    </Lazy>
  ),
});
const rentalsAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rentals",
  component: () => (
    <Lazy>
      <RentalsPage />
    </Lazy>
  ),
});
const commercialAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/commercial",
  component: () => (
    <Lazy>
      <CommercialPage />
    </Lazy>
  ),
});
const financeAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/finance-admin",
  component: () => (
    <Lazy>
      <FinanceAdminPage />
    </Lazy>
  ),
});
const legalCommandAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/legal-command-admin",
  component: () => (
    <Lazy>
      <LegalCommandPage />
    </Lazy>
  ),
});
const taxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tax",
  component: () => (
    <Lazy>
      <TaxPage />
    </Lazy>
  ),
});
const billingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/billing",
  component: () => (
    <Lazy>
      <BillingPage />
    </Lazy>
  ),
});
const documentsAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/documents-admin",
  component: () => (
    <Lazy>
      <DocumentsAdminPage />
    </Lazy>
  ),
});
const campaignsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/campaigns",
  component: () => (
    <Lazy>
      <CampaignsPage />
    </Lazy>
  ),
});
const whatsappAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/whatsapp-admin",
  component: () => (
    <Lazy>
      <WhatsappAdminPage />
    </Lazy>
  ),
});
const notificationsAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications-admin",
  component: () => (
    <Lazy>
      <NotificationsAdminPage />
    </Lazy>
  ),
});
const reviewsAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reviews-admin",
  component: () => (
    <Lazy>
      <ReviewsAdminPage />
    </Lazy>
  ),
});
const referralsAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/referrals-admin",
  component: () => (
    <Lazy>
      <ReferralsAdminPage />
    </Lazy>
  ),
});
const eventsAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events-admin",
  component: () => (
    <Lazy>
      <EventsAdminPage />
    </Lazy>
  ),
});
const hospitalityAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hospitality-admin",
  component: () => (
    <Lazy>
      <HospitalityAdminPage />
    </Lazy>
  ),
});
const calendarAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/calendar-admin",
  component: () => (
    <Lazy>
      <CalendarAdminPage />
    </Lazy>
  ),
});
const ngoAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ngo-admin",
  component: () => (
    <Lazy>
      <NgoAdminPage />
    </Lazy>
  ),
});
const csrAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/csr-admin",
  component: () => (
    <Lazy>
      <CsrAdminPage />
    </Lazy>
  ),
});
const sportsAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sports-admin",
  component: () => (
    <Lazy>
      <SportsAdminPage />
    </Lazy>
  ),
});
const musicAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/music-admin",
  component: () => (
    <Lazy>
      <MusicAdminPage />
    </Lazy>
  ),
});
const tourismAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tourism-admin",
  component: () => (
    <Lazy>
      <TourismAdminPage />
    </Lazy>
  ),
});
const analyticsAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics-admin",
  component: () => (
    <Lazy>
      <AnalyticsAdminPage />
    </Lazy>
  ),
});
const marketAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/market-admin",
  component: () => (
    <Lazy>
      <MarketAdminPage />
    </Lazy>
  ),
});
const competitorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/competitors",
  component: () => (
    <Lazy>
      <CompetitorsPage />
    </Lazy>
  ),
});
const healthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/health",
  component: () => (
    <Lazy>
      <PlatformHealthPage />
    </Lazy>
  ),
});
const deploymentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/deployments",
  component: () => (
    <Lazy>
      <DeploymentsPage />
    </Lazy>
  ),
});
const apiManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/api-manager",
  component: () => (
    <Lazy>
      <ApiManagerPage />
    </Lazy>
  ),
});
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <Lazy>
      <SettingsPage />
    </Lazy>
  ),
});
const builderAppRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/builder",
  component: () => (
    <Lazy>
      <BuilderPage />
    </Lazy>
  ),
});

// ─── Friendly alias routes for AppLauncher paths ─────────────────────────────
const mediaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/media",
  component: () => (
    <Lazy>
      <MediaLibraryPage />
    </Lazy>
  ),
});
const seoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/seo",
  component: () => (
    <Lazy>
      <SeoManagerPage />
    </Lazy>
  ),
});
const announcementManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/announcement-manager",
  component: () => (
    <Lazy>
      <AnnouncementManagerPage />
    </Lazy>
  ),
});
const announcementsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/announcements",
  component: () => (
    <Lazy>
      <AnnouncementsPage />
    </Lazy>
  ),
});
// Alias: /finance-desk → FinanceAdminPage
const financeDeskRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/finance-desk",
  component: () => (
    <Lazy>
      <FinanceAdminPage />
    </Lazy>
  ),
});
// Alias: /analytics → AnalyticsAdminPage
const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics",
  component: () => (
    <Lazy>
      <AnalyticsAdminPage />
    </Lazy>
  ),
});
// Alias: /market → MarketAdminPage
const marketRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/market",
  component: () => (
    <Lazy>
      <MarketAdminPage />
    </Lazy>
  ),
});
// Alias: /calendar → CalendarAdminPage
const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/calendar",
  component: () => (
    <Lazy>
      <CalendarAdminPage />
    </Lazy>
  ),
});
// Alias: /rera → ReraAdminPage
const reraRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rera",
  component: () => (
    <Lazy>
      <ReraAdminPage />
    </Lazy>
  ),
});
// Alias: /hospitality → HospitalityAdminPage
const hospitalityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hospitality",
  component: () => (
    <Lazy>
      <HospitalityAdminPage />
    </Lazy>
  ),
});
// Alias: /sports → SportsAdminPage
const sportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sports",
  component: () => (
    <Lazy>
      <SportsAdminPage />
    </Lazy>
  ),
});
// Alias: /music → MusicAdminPage
const musicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/music",
  component: () => (
    <Lazy>
      <MusicAdminPage />
    </Lazy>
  ),
});
// Alias: /tourism → TourismAdminPage
const tourismRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tourism",
  component: () => (
    <Lazy>
      <TourismAdminPage />
    </Lazy>
  ),
});
// Alias: /whatsapp → WhatsappAdminPage
const whatsappRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/whatsapp",
  component: () => (
    <Lazy>
      <WhatsappAdminPage />
    </Lazy>
  ),
});
// Alias: /notifications → NotificationsAdminPage
const notificationsAliasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: () => (
    <Lazy>
      <NotificationsAdminPage />
    </Lazy>
  ),
});
// Alias: /reviews → ReviewsAdminPage
const reviewsAliasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reviews",
  component: () => (
    <Lazy>
      <ReviewsAdminPage />
    </Lazy>
  ),
});
// Alias: /referrals → ReferralsAdminPage
const referralsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/referrals",
  component: () => (
    <Lazy>
      <ReferralsAdminPage />
    </Lazy>
  ),
});
// Alias: /documents → DocumentsAdminPage
const documentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/documents",
  component: () => (
    <Lazy>
      <DocumentsAdminPage />
    </Lazy>
  ),
});
// Alias: /api → ApiManagerPage
const apiAliasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/api",
  component: () => (
    <Lazy>
      <ApiManagerPage />
    </Lazy>
  ),
});
// Alias: /legal → LegalCommandPage
const legalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/legal",
  component: () => (
    <Lazy>
      <LegalCommandPage />
    </Lazy>
  ),
});
// Alias: /properties → PropertiesAdminPage
const propertiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/properties",
  component: () => (
    <Lazy>
      <PropertiesAdminPage />
    </Lazy>
  ),
});
// Alias: /studio → ContentStudioPage
const studioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/studio",
  component: () => (
    <Lazy>
      <ContentStudioPage />
    </Lazy>
  ),
});

// Legal page routes
const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy-policy",
  component: () => (
    <Lazy>
      <PrivacyPolicyPage />
    </Lazy>
  ),
});
const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: () => (
    <Lazy>
      <TermsPage />
    </Lazy>
  ),
});
const cookiePolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cookie-policy",
  component: () => (
    <Lazy>
      <CookiePolicyPage />
    </Lazy>
  ),
});
const disclaimerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/disclaimer",
  component: () => (
    <Lazy>
      <DisclaimerPage />
    </Lazy>
  ),
});
const sitemapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sitemap",
  component: () => React.createElement(Navigate, { to: "/admin" }),
});

const platformRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/platform",
  component: () => (
    <Lazy>
      <PlatformHealthPage />
    </Lazy>
  ),
});
const competitiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/competitive",
  component: () => (
    <Lazy>
      <CompetitiveIntelPage />
    </Lazy>
  ),
});
const clientPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/client-portal",
  component: () => (
    <Lazy>
      <ClientPortalPage />
    </Lazy>
  ),
});
const leadManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lead-manager",
  component: () => (
    <Lazy>
      <LeadManagerPage />
    </Lazy>
  ),
});
const taxComplianceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tax-compliance",
  component: () => (
    <Lazy>
      <TaxCompliancePage />
    </Lazy>
  ),
});
const documentCenterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/document-center",
  component: () => (
    <Lazy>
      <DocumentCenterPage />
    </Lazy>
  ),
});
const legalVaultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/legal-vault",
  component: () => (
    <Lazy>
      <LegalVaultPage />
    </Lazy>
  ),
});
const musicCultureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/music-culture",
  component: () => (
    <Lazy>
      <MusicCulturePage />
    </Lazy>
  ),
});
const sportsDeskRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sports-desk",
  component: () => (
    <Lazy>
      <SportsDeskPage />
    </Lazy>
  ),
});
const marketIntelligenceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/market-intelligence",
  component: () => (
    <Lazy>
      <MarketIntelligencePage />
    </Lazy>
  ),
});
const tourismPlannerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tourism-planner",
  component: () => (
    <Lazy>
      <TourismPlannerPage />
    </Lazy>
  ),
});
const contentStudioHubRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/content-studio",
  component: () => (
    <Lazy>
      <ContentStudioPage />
    </Lazy>
  ),
});
const propertyIntelligenceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/property-intelligence",
  component: () => (
    <Lazy>
      <PropertyIntelligencePage />
    </Lazy>
  ),
});

// ─── Additional alias routes ────────────────────────────────────────────────
const websiteBuilderAliasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/website-builder",
  component: () => (
    <Lazy>
      <BuilderPage />
    </Lazy>
  ),
});
const competitiveIntelAliasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/competitive-intelligence",
  component: () => (
    <Lazy>
      <CompetitiveIntelPage />
    </Lazy>
  ),
});
const platformHealthAliasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/platform-health",
  component: () => (
    <Lazy>
      <PlatformHealthPage />
    </Lazy>
  ),
});
const deploymentAliasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/deployment",
  component: () => (
    <Lazy>
      <DeploymentsPage />
    </Lazy>
  ),
});
const exchangeAliasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/exchange",
  component: () => (
    <Lazy>
      <ExchangePage />
    </Lazy>
  ),
});
const franchiseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/franchise",
  component: () => (
    <Lazy>
      <FranchisePage />
    </Lazy>
  ),
});
const auctionAliasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auction",
  component: () => (
    <Lazy>
      <AuctionBoardPage />
    </Lazy>
  ),
});
const dealRoomAliasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/deal-room",
  component: () => (
    <Lazy>
      <DealMatchmakerPage />
    </Lazy>
  ),
});
const academyAliasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/academy",
  component: () => (
    <Lazy>
      <AcademyPage />
    </Lazy>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  infrastructureRoute,
  infraResidentialRoute,
  infraCommercialRoute,
  infraIndustrialRoute,
  reraConsultingRoute,
  reraPromoterRoute,
  reraAgentRoute,
  purchaseRentRoute,
  purchaseResRentRoute,
  purchaseComRentRoute,
  purchaseRedevelRoute,
  financeRoute,
  finHomeLoansRoute,
  finBizLoansRoute,
  finEquityRoute,
  musicCulturalRoute,
  musicArtistRoute,
  musicProdRoute,
  hospitalityEventsRoute,
  hospVenueRoute,
  hospCorpRoute,
  ngoCsrRoute,
  ngoCsrFundRoute,
  ngoSocialRoute,
  mediaSportsTourismRoute,
  mediaSportsRoute,
  mediaTravelRoute,
  propertyPortalRoute,
  blogRoute,
  partnersRoute,
  nriCornerRoute,
  referralRoute,
  adminRoute,
  auctionBoardRoute,
  dealMatchmakerRoute,
  neighborhoodExplorerRoute,
  newsletterRoute,
  legalDocsRoute,
  homeTourRoute,
  eventBookingRoute,
  artistShowcaseRoute,
  csrImpactRoute,
  nriSimulatorRoute,
  trackEnquiryRoute,
  complaintRoute,
  builderProfilesRoute,
  areaGuidesRoute,
  areaGuideRoute,
  faqRoute,
  eventToolsRoute,
  csrToolsRoute,
  sportsPortalRoute,
  travelCustomizerRoute,
  talentPortalRoute,
  brochureRoute,
  propertyToolsRoute,
  financeToolsRoute,
  newsRoute,
  observeRoute,
  masterRoute,
  appsRoute,
  // appsDownloadRoute uses AppDownloadPage
  appsDownloadRoute,
  commandRoute,
  briefingRoute,
  securityRoute,
  legalCommandRoute,
  aiUniverseRoute,
  staffDirectoryRoute,
  // new internal app routes
  crmRoute,
  leadsRoute,
  clientsRoute,
  proposalsRoute,
  appointmentsRoute,
  propertiesAdminRoute,
  intelligenceRoute,
  redevelopmentAdminRoute,
  reraAdminRoute,
  rentalsAdminRoute,
  commercialAdminRoute,
  financeAdminRoute,
  legalCommandAdminRoute,
  taxRoute,
  billingRoute,
  documentsAdminRoute,
  campaignsRoute,
  whatsappAdminRoute,
  notificationsAdminRoute,
  reviewsAdminRoute,
  referralsAdminRoute,
  eventsAdminRoute,
  hospitalityAdminRoute,
  calendarAdminRoute,
  ngoAdminRoute,
  csrAdminRoute,
  sportsAdminRoute,
  musicAdminRoute,
  tourismAdminRoute,
  analyticsAdminRoute,
  marketAdminRoute,
  competitorsRoute,
  healthRoute,
  deploymentsRoute,
  apiManagerRoute,
  settingsRoute,
  builderAppRoute,
  contentStudioRoute,
  eventsRoute,
  ngoHubRoute,
  csrDashboardRoute,
  // Friendly alias routes (used by AppLauncher)
  mediaRoute,
  seoRoute,
  announcementManagerRoute,
  announcementsRoute,
  financeDeskRoute,
  analyticsRoute,
  marketRoute,
  calendarRoute,
  reraRoute,
  hospitalityRoute,
  sportsRoute,
  musicRoute,
  tourismRoute,
  whatsappRoute,
  notificationsAliasRoute,
  reviewsAliasRoute,
  referralsRoute,
  documentsRoute,
  apiAliasRoute,
  legalRoute,
  propertiesRoute,
  studioRoute,
  // Missing routes now added
  platformRoute,
  competitiveRoute,
  clientPortalRoute,
  leadManagerRoute,
  taxComplianceRoute,
  documentCenterRoute,
  legalVaultRoute,
  musicCultureRoute,
  sportsDeskRoute,
  marketIntelligenceRoute,
  tourismPlannerRoute,
  contentStudioHubRoute,
  propertyIntelligenceRoute,
  // Additional alias routes
  websiteBuilderAliasRoute,
  competitiveIntelAliasRoute,
  platformHealthAliasRoute,
  deploymentAliasRoute,
  exchangeAliasRoute,
  auctionAliasRoute,
  dealRoomAliasRoute,
  // Legal pages
  privacyPolicyRoute,
  termsRoute,
  cookiePolicyRoute,
  disclaimerRoute,
  sitemapRoute,
  academyAliasRoute,
  franchiseRoute,
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <PrivacyGate>
      <ReferralTracker />
      <RouterProvider router={router} />
      <ChatWidget />
      <CallbackButton />
    </PrivacyGate>
  );
}
