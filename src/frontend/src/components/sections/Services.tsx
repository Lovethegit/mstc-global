import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  FileText,
  Heart,
  Home,
  Music,
  TrendingUp,
  Tv,
} from "lucide-react";

const frontServices = [
  {
    icon: Building2,
    title: "Infrastructure, Land & Property Development",
    description:
      "Comprehensive real estate solutions — from land acquisition and infrastructure development to large-scale property projects across India.",
    badge: "01",
    route: "/services/infrastructure",
  },
  {
    icon: FileText,
    title: "RERA, Impact & PR Consulting",
    description:
      "Expert RERA compliance, regulatory advisory, impact assessment, and strategic public relations consulting for real estate and corporate clients.",
    badge: "02",
    route: "/services/rera-consulting",
  },
  {
    icon: Home,
    title: "Purchase, Rent & Redevelopment",
    description:
      "End-to-end property transaction services including purchase facilitation, rental management, and urban redevelopment projects.",
    badge: "03",
    route: "/services/purchase-rent",
  },
  {
    icon: TrendingUp,
    title: "Finance, Loans & Investment",
    description:
      "Tailored financial solutions including home loans, business financing, investment advisory, and wealth management services.",
    badge: "04",
    route: "/services/finance",
  },
];

const backServices = [
  {
    icon: Music,
    title: "Music & Cultural Services",
    description:
      "Promoting arts, music, and cultural heritage through events, artist management, and cultural exchange programs.",
    badge: "05",
    route: "/services/music-cultural",
  },
  {
    icon: CalendarDays,
    title: "Hospitality & Event Management",
    description:
      "Premium hospitality solutions and world-class event management for corporate, social, and cultural occasions.",
    badge: "06",
    route: "/services/hospitality-events",
  },
  {
    icon: Heart,
    title: "NGO & CSR Initiatives",
    description:
      "Driving social change through non-profit initiatives, corporate social responsibility programs, and community development projects.",
    badge: "07",
    route: "/services/ngo-csr",
  },
  {
    icon: Tv,
    title: "Media, Sports & Tourism",
    description:
      "Integrated media production, sports management, and tourism development creating vibrant experiences and opportunities.",
    badge: "08",
    route: "/services/media-sports-tourism",
  },
];

function ServiceCard({
  icon: Icon,
  title,
  description,
  badge,
  route,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  badge: string;
  route: string;
}) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="relative group p-6 border border-gold-800/40 rounded-sm bg-obsidian-800/80 hover:border-gold-500/60 transition-all duration-400 overflow-hidden hover:bg-obsidian-700/80 cursor-pointer text-left w-full"
      onClick={() => navigate({ to: route })}
    >
      <span className="absolute top-4 right-4 font-serif text-4xl font-black text-gold-700/25 group-hover:text-gold-600/35 transition-colors select-none">
        {badge}
      </span>
      <div className="w-12 h-12 rounded-sm bg-gold-600/20 border border-gold-600/40 flex items-center justify-center mb-4 group-hover:bg-gold-600/30 transition-all duration-300">
        <Icon
          size={22}
          className="text-gold-400 group-hover:text-gold-300 transition-colors"
        />
      </div>
      <h3 className="font-serif text-base md:text-lg text-gold-200 font-semibold mb-2 leading-snug pr-8">
        {title}
      </h3>
      <p className="font-sans text-xs md:text-sm text-obsidian-100 leading-relaxed mb-4">
        {description}
      </p>
      <div className="flex items-center gap-1 text-gold-500 text-xs font-sans font-medium tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span>Learn More</span>
        <ArrowRight size={12} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
}

export default function Services() {
  return (
    <section
      id="services"
      className="py-20 md:py-28 bg-obsidian-900 relative overflow-hidden"
    >
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-gold-600/5 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="font-sans text-xs tracking-[0.4em] text-gold-400 uppercase">
            What We Do
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-gold-300 mt-2 mb-4">
            Our Services
          </h2>
          <div className="section-divider w-32 mx-auto mb-6" />
          <p className="font-sans text-obsidian-100 max-w-2xl mx-auto text-sm md:text-base">
            Eight powerful divisions working in synergy to deliver comprehensive
            solutions across real estate, finance, culture, and social impact.
          </p>
        </div>
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-700/50" />
            <span className="font-sans text-xs tracking-[0.3em] text-gold-500 uppercase px-4 border border-gold-700/50 py-1 rounded-full bg-obsidian-800/60">
              Real Estate & Finance Division
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-700/50" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {frontServices.map((s) => (
              <ServiceCard key={s.badge} {...s} />
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-700/50" />
            <span className="font-sans text-xs tracking-[0.3em] text-gold-500 uppercase px-4 border border-gold-700/50 py-1 rounded-full bg-obsidian-800/60">
              Culture, Media & Social Division
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-700/50" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {backServices.map((s) => (
              <ServiceCard key={s.badge} {...s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
