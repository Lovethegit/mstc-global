import { RequestFormsSection } from "@/components/forms/RequestFormsSection";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import BackToTop from "@/components/ui/BackToTop";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  MapPin,
  Radio,
  Trophy,
  Tv,
} from "lucide-react";

const specializations = [
  {
    slug: "sports-events",
    label: "Sports Events",
    desc: "Tournament management, athlete coordination, and sponsorship facilitation.",
    icon: "🏆",
  },
  {
    slug: "travel-itineraries",
    label: "Travel Itineraries",
    desc: "Personalised travel planning with a multi-step trip planner tool.",
    icon: "🗺️",
  },
];

const offerings = [
  "Media production and content creation",
  "Digital media strategy and management",
  "Sports event organization and management",
  "Athlete management and sponsorship",
  "Tourism destination development",
  "Travel and hospitality packages",
  "Sports infrastructure consulting",
  "Broadcasting and media rights advisory",
];

const _stats = [
  { icon: Camera, label: "Media Productions", value: "75+" },
  { icon: Trophy, label: "Sports Events", value: "40+" },
  { icon: MapPin, label: "Tourism Destinations", value: "20+" },
  { icon: Radio, label: "Media Reach", value: "5M+" },
];

export default function MediaSportsTourismPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-obsidian-900 text-gold-100">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end justify-start overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&h=500&fit=crop"
            alt="Media Sports Tourism"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/70 to-obsidian-900/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian-900/80 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm font-sans mb-6 transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Home
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-sm bg-gold-600/30 border border-gold-600/50 flex items-center justify-center">
              <Tv size={20} className="text-gold-400" />
            </div>
            <span className="font-sans text-xs tracking-[0.4em] text-gold-400 uppercase">
              Division 08 · Media & Tourism
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-gold-200 font-bold leading-tight mb-4 text-shadow-gold">
            Media, Sports &<br />
            Tourism
          </h1>
          <p className="font-sans text-obsidian-100 max-w-2xl text-base md:text-lg leading-relaxed">
            Connecting stories, sports, and destinations — creating vibrant
            experiences that inspire and engage audiences worldwide.
          </p>
        </div>
      </section>

      {/* Stats removed — company is new */}

      {/* Specializations */}
      <section className="py-16 border-b border-gold-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="font-sans text-xs tracking-[0.4em] text-gold-400 uppercase">
              Explore
            </span>
            <h2 className="font-serif text-3xl text-gold-300 mt-2">
              Our Specializations
            </h2>
            <div className="section-divider w-24 mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {specializations.map((s) => (
              <Link
                key={s.slug}
                to={`/services/media-sports-tourism/${s.slug}` as never}
                className="block p-6 border border-gold-800/30 hover:border-gold-600/60 rounded-sm bg-obsidian-800/40 hover:bg-obsidian-800/70 transition-all duration-300 group"
                data-ocid={`media.spec_${s.slug}`}
              >
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-serif text-lg text-gold-300 group-hover:text-gold-200 mb-2">
                  {s.label}
                </h3>
                <p className="font-sans text-sm text-obsidian-200 leading-relaxed">
                  {s.desc}
                </p>
                <span className="inline-block mt-4 text-xs font-sans font-semibold text-gold-500 group-hover:text-gold-400 tracking-widest uppercase">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="font-sans text-xs tracking-[0.4em] text-gold-400 uppercase">
                About This Service
              </span>
              <h2 className="font-serif text-3xl text-gold-300 mt-2 mb-6">
                Stories That Move the World
              </h2>
              <div className="section-divider w-24 mb-8" />
              <p className="font-sans text-obsidian-100 leading-relaxed mb-5 text-sm md:text-base">
                MSTC GLOBAL's Media, Sports & Tourism division operates at the
                exciting intersection of content, competition, and exploration.
                We create compelling media content, manage high-profile sports
                events, and develop tourism experiences that showcase India's
                incredible diversity.
              </p>
              <p className="font-sans text-obsidian-100 leading-relaxed mb-5 text-sm md:text-base">
                Our media production capabilities span digital content,
                documentary filmmaking, advertising, and broadcast media. We
                help brands tell their stories in ways that resonate with
                audiences and drive engagement across all platforms.
              </p>
              <p className="font-sans text-obsidian-100 leading-relaxed text-sm md:text-base">
                In sports, we organize tournaments, manage athlete careers, and
                connect sports organizations with sponsors and media partners.
                Our tourism development work creates unique travel experiences
                that highlight India's natural beauty, cultural richness, and
                historical heritage.
              </p>
            </div>
            <div>
              <span className="font-sans text-xs tracking-[0.4em] text-gold-400 uppercase">
                Key Offerings
              </span>
              <h2 className="font-serif text-3xl text-gold-300 mt-2 mb-6">
                What We Provide
              </h2>
              <div className="section-divider w-24 mb-8" />
              <ul className="space-y-3">
                {offerings.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="text-gold-500 mt-0.5 flex-shrink-0"
                    />
                    <span className="font-sans text-obsidian-100 text-sm md:text-base">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="mt-16 rounded-xl overflow-hidden border border-gold-800/30"
            style={{ boxShadow: "0 0 30px 0 rgba(201,168,76,0.12)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop"
              alt="Media Sports Tourism"
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>

          <div className="mt-12 text-center">
            <p className="font-cormorant text-xl text-gold-400 italic mb-6">
              Your story deserves a global stage.
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="px-8 py-3 bg-gold-600 hover:bg-gold-500 text-obsidian-900 font-sans font-semibold text-sm tracking-widest uppercase rounded-sm transition-all duration-300 shadow-gold"
            >
              Contact Us Today
            </button>
          </div>

          <div className="mt-14">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-gold-400" />
              <h3 className="font-serif text-xl text-gold-300">
                Our Office Location
              </h3>
            </div>
            <div className="relative w-full overflow-hidden rounded-xl border border-yellow-600/30">
              <iframe
                src="https://maps.google.com/maps?q=23.0013511,72.5630849&z=17&output=embed"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MSTC GLOBAL Location"
              />
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "#c9a84c",
                marginTop: "8px",
                textAlign: "center",
              }}
            >
              MSTC Global — Ahmedabad, Gujarat, India
            </p>
          </div>
        </div>
      </section>

      <RequestFormsSection preselectedService="Media Sports & Tourism" />
      <Footer />
      <BackToTop />
    </div>
  );
}
