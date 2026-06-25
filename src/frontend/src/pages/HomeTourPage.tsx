import PrivacyGate from "@/components/PrivacyGate";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import BackToTop from "@/components/ui/BackToTop";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  Home,
  MapPin,
} from "lucide-react";
import { useState } from "react";

const ROOMS = [
  {
    id: "living",
    label: "Living Room",
    icon: "🛋️",
    description:
      "Spacious living room with premium furnishings, natural lighting, and elegant décor creating a warm welcoming atmosphere.",
    details: [
      "Premium sofa set with fabric upholstery",
      "LED ambient lighting with dimmer",
      '55" 4K Smart TV with surround sound',
      "Marble flooring with area rug",
      "Custom window treatments",
    ],
    area: "320 sq.ft",
    accent: "#c9a84c",
    mapX: 30,
    mapY: 35,
    perspective: "from-amber-900/20 to-stone-900/40",
    wallColor: "#1a1507",
    floorPattern: [
      { x: 5, y: 70, w: 45, h: 25, fill: "oklch(0.72 0.18 76 / 0.08)" },
    ],
    furniture: [
      { type: "sofa", x: 15, y: 55, w: 30, h: 10 },
      { type: "table", x: 22, y: 42, w: 16, h: 8 },
      { type: "tv", x: 10, y: 30, w: 20, h: 3 },
    ],
  },
  {
    id: "kitchen",
    label: "Kitchen",
    icon: "🍽️",
    description:
      "Modern modular kitchen with granite countertops, the latest appliances, and ample storage designed for serious cooking.",
    details: [
      "Modular cabinets with soft-close hinges",
      "Granite countertop with island",
      "Built-in chimney & gas hob",
      "Refrigerator & microwave included",
      "Under-cabinet LED strip lights",
    ],
    area: "140 sq.ft",
    accent: "#c9a84c",
    mapX: 68,
    mapY: 28,
    perspective: "from-emerald-900/20 to-stone-900/40",
    wallColor: "#0e1a0e",
    floorPattern: [
      { x: 52, y: 15, w: 42, h: 35, fill: "oklch(0.72 0.18 76 / 0.05)" },
    ],
    furniture: [
      { type: "counter", x: 55, y: 18, w: 35, h: 8 },
      { type: "island", x: 60, y: 30, w: 20, h: 10 },
    ],
  },
  {
    id: "bedroom1",
    label: "Master Bedroom",
    icon: "🛏️",
    description:
      "Luxurious master bedroom with attached bath, walk-in wardrobe, and city views — your personal sanctuary.",
    details: [
      "King-size bed with orthopedic mattress",
      "Walk-in wardrobe with mirror",
      "Attached bathroom with premium fittings",
      "Split AC, 1.5 ton inverter",
      "Dressing area with vanity",
    ],
    area: "220 sq.ft",
    accent: "#c9a84c",
    mapX: 20,
    mapY: 68,
    perspective: "from-indigo-900/20 to-stone-900/40",
    wallColor: "#0b0f1a",
    floorPattern: [
      { x: 5, y: 56, w: 38, h: 38, fill: "oklch(0.72 0.18 76 / 0.06)" },
    ],
    furniture: [
      { type: "bed", x: 8, y: 62, w: 25, h: 18 },
      { type: "wardrobe", x: 5, y: 58, w: 8, h: 25 },
    ],
  },
  {
    id: "bedroom2",
    label: "Bedroom 2",
    icon: "🛏️",
    description:
      "Comfortable second bedroom ideal for family or guests, with good ventilation and natural light.",
    details: [
      "Queen-size bed with storage",
      "Built-in wardrobe",
      "Natural ventilation & ceiling fan",
      "Study/work corner",
    ],
    area: "160 sq.ft",
    accent: "#c9a84c",
    mapX: 63,
    mapY: 68,
    perspective: "from-blue-900/20 to-stone-900/40",
    wallColor: "#080e1a",
    floorPattern: [
      { x: 50, y: 56, w: 40, h: 38, fill: "oklch(0.72 0.18 76 / 0.05)" },
    ],
    furniture: [
      { type: "bed", x: 53, y: 62, w: 22, h: 15 },
      { type: "desk", x: 76, y: 60, w: 12, h: 8 },
    ],
  },
  {
    id: "bathroom",
    label: "Bathroom",
    icon: "🚿",
    description:
      "Modern bathroom with premium fittings, glass shower enclosure, and spa-like finishing.",
    details: [
      "Premium fixtures — Jaguar/Kohler",
      "Glass shower enclosure + bathtub",
      "Exhaust fan with timer",
      "Mirror cabinet with lights",
      "Anti-slip ceramic tiles",
    ],
    area: "60 sq.ft",
    accent: "#c9a84c",
    mapX: 82,
    mapY: 52,
    perspective: "from-teal-900/20 to-stone-900/40",
    wallColor: "#061413",
    floorPattern: [
      { x: 73, y: 40, w: 20, h: 20, fill: "oklch(0.72 0.18 76 / 0.08)" },
    ],
    furniture: [
      { type: "shower", x: 75, y: 43, w: 8, h: 8 },
      { type: "sink", x: 84, y: 48, w: 7, h: 6 },
    ],
  },
  {
    id: "balcony",
    label: "Balcony / Terrace",
    icon: "🌅",
    description:
      "Scenic balcony with panoramic city views and garden area — a private oasis above the city.",
    details: [
      "Panoramic city view",
      "Garden furniture set",
      "Safety railing enclosure",
      "Outdoor plant area & herb garden",
      "Weather-resistant flooring",
    ],
    area: "80 sq.ft",
    accent: "#c9a84c",
    mapX: 45,
    mapY: 84,
    perspective: "from-orange-900/20 to-stone-900/40",
    wallColor: "#1a1006",
    floorPattern: [
      { x: 25, y: 77, w: 45, h: 18, fill: "oklch(0.72 0.18 76 / 0.07)" },
    ],
    furniture: [
      { type: "chair", x: 30, y: 80, w: 10, h: 10 },
      { type: "plant", x: 60, y: 79, w: 5, h: 8 },
    ],
  },
];

const ROOM_COUNT = ROOMS.length;

export default function HomeTourPage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeRoom = ROOMS[activeIdx];

  const goNext = () => setActiveIdx((i) => (i + 1) % ROOM_COUNT);
  const goPrev = () => setActiveIdx((i) => (i - 1 + ROOM_COUNT) % ROOM_COUNT);

  return (
    <PrivacyGate>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        {/* Page Header */}
        <section className="pt-24 pb-8 px-4 bg-card/50 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
              data-ocid="tour.back_button"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <Home size={24} className="text-primary" />
              <h1 className="font-serif font-bold text-3xl gold-text">
                3D Home Tour
              </h1>
            </div>
            <p className="font-sans text-sm text-muted-foreground">
              An immersive walkthrough of a luxury residence — navigate through
              each room using the arrows or floor plan.
            </p>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 py-10">
          {/* Main Tour Viewer */}
          <div className="grid lg:grid-cols-5 gap-6 mb-8">
            {/* 3D Room Panel */}
            <div className="lg:col-span-3 flex flex-col">
              {/* Immersive Room View */}
              <div
                className="relative rounded-2xl overflow-hidden border border-border"
                style={{ minHeight: 340 }}
              >
                {/* 3D perspective room */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${activeRoom.perspective}`}
                  style={{
                    background: activeRoom.wallColor,
                    perspective: "800px",
                  }}
                >
                  {/* Back wall */}
                  <div
                    className="absolute inset-x-6 top-6"
                    style={{
                      height: "55%",
                      background:
                        "linear-gradient(180deg, oklch(0.14 0.015 62) 0%, oklch(0.18 0.02 65) 100%)",
                      borderTop: "2px solid oklch(0.72 0.18 76 / 0.25)",
                      borderLeft: "2px solid oklch(0.72 0.18 76 / 0.15)",
                      borderRight: "2px solid oklch(0.72 0.18 76 / 0.15)",
                      transform: "perspective(600px) rotateX(2deg)",
                      borderRadius: "4px 4px 0 0",
                    }}
                  >
                    {/* Window/feature on back wall */}
                    <div
                      className="absolute"
                      style={{
                        top: "15%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "40%",
                        height: "60%",
                        border: "2px solid oklch(0.72 0.18 76 / 0.4)",
                        borderRadius: 4,
                        background:
                          "linear-gradient(135deg, oklch(0.3 0.05 220 / 0.4), oklch(0.4 0.08 200 / 0.3))",
                        boxShadow: "inset 0 0 30px oklch(0.72 0.18 76 / 0.1)",
                      }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.5 0.1 220 / 0.2) 0%, transparent 60%)",
                        }}
                      />
                      <div
                        className="absolute"
                        style={{
                          top: "50%",
                          left: 0,
                          right: 0,
                          height: 1,
                          background: "oklch(0.72 0.18 76 / 0.3)",
                        }}
                      />
                      <div
                        className="absolute"
                        style={{
                          left: "50%",
                          top: 0,
                          bottom: 0,
                          width: 1,
                          background: "oklch(0.72 0.18 76 / 0.3)",
                        }}
                      />
                    </div>
                    {/* Gold cornice */}
                    <div
                      className="absolute bottom-0 inset-x-0"
                      style={{
                        height: 3,
                        background:
                          "linear-gradient(90deg, transparent, oklch(0.72 0.18 76 / 0.6), transparent)",
                      }}
                    />
                  </div>

                  {/* Floor */}
                  <div
                    className="absolute inset-x-0 bottom-0"
                    style={{
                      top: "61%",
                      background:
                        "linear-gradient(180deg, oklch(0.2 0.02 65) 0%, oklch(0.14 0.015 62) 100%)",
                      transform: "perspective(600px) rotateX(-2deg)",
                    }}
                  >
                    {/* Floor grid lines */}
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="absolute inset-x-0"
                        style={{
                          top: `${n * 22}%`,
                          height: 1,
                          background: "oklch(0.72 0.18 76 / 0.08)",
                        }}
                      />
                    ))}
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className="absolute inset-y-0"
                        style={{
                          left: `${n * 18}%`,
                          width: 1,
                          background: "oklch(0.72 0.18 76 / 0.08)",
                        }}
                      />
                    ))}
                  </div>

                  {/* Left side wall */}
                  <div
                    className="absolute top-6 left-0"
                    style={{
                      bottom: "39%",
                      width: "6%",
                      background:
                        "linear-gradient(90deg, oklch(0.12 0.015 62), oklch(0.16 0.02 64))",
                      borderRight: "1px solid oklch(0.72 0.18 76 / 0.15)",
                    }}
                  />
                  {/* Right side wall */}
                  <div
                    className="absolute top-6 right-0"
                    style={{
                      bottom: "39%",
                      width: "6%",
                      background:
                        "linear-gradient(270deg, oklch(0.12 0.015 62), oklch(0.16 0.02 64))",
                      borderLeft: "1px solid oklch(0.72 0.18 76 / 0.15)",
                    }}
                  />

                  {/* Room icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className="text-center"
                      style={{
                        transform: "perspective(600px) translateZ(40px)",
                      }}
                    >
                      <div className="text-7xl mb-2 drop-shadow-xl">
                        {activeRoom.icon}
                      </div>
                      <div
                        className="font-serif font-bold text-lg"
                        style={{ color: "oklch(0.72 0.18 76)" }}
                      >
                        {activeRoom.label}
                      </div>
                      <div
                        className="text-xs mt-1 flex items-center gap-1 justify-center"
                        style={{ color: "oklch(0.65 0.06 78)" }}
                      >
                        <MapPin size={10} /> {activeRoom.area}
                      </div>
                    </div>
                  </div>

                  {/* Gold border accent */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-2xl"
                    style={{
                      border: "1px solid oklch(0.72 0.18 76 / 0.2)",
                      boxShadow: "inset 0 0 60px oklch(0.72 0.18 76 / 0.05)",
                    }}
                  />
                </div>

                {/* Nav arrows */}
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: "oklch(0.1 0.01 60 / 0.7)",
                    border: "1px solid oklch(0.72 0.18 76 / 0.4)",
                    color: "oklch(0.72 0.18 76)",
                  }}
                  aria-label="Previous room"
                  data-ocid="tour.prev_button"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: "oklch(0.1 0.01 60 / 0.7)",
                    border: "1px solid oklch(0.72 0.18 76 / 0.4)",
                    color: "oklch(0.72 0.18 76)",
                  }}
                  aria-label="Next room"
                  data-ocid="tour.next_button"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Room counter */}
                <div
                  className="absolute bottom-3 right-3 text-xs px-2 py-1 rounded-full"
                  style={{
                    background: "oklch(0.1 0.01 60 / 0.7)",
                    color: "oklch(0.72 0.18 76)",
                    border: "1px solid oklch(0.72 0.18 76 / 0.3)",
                  }}
                >
                  {activeIdx + 1} / {ROOM_COUNT}
                </div>
              </div>

              {/* Room tabs */}
              <div className="flex flex-wrap gap-2 mt-4">
                {ROOMS.map((room, i) => (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all border ${
                      activeIdx === i
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                    }`}
                    data-ocid={`tour.room_tab.${room.id}`}
                  >
                    {room.icon} {room.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Details Panel */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Details Card */}
              <div className="border border-border rounded-2xl bg-card p-5 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Eye size={14} className="text-primary" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Room Details
                  </span>
                </div>
                <h2 className="font-serif font-bold text-xl gold-text mb-2">
                  {activeRoom.label}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {activeRoom.description}
                </p>

                <div className="section-divider mb-4" />

                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Features &amp; Amenities
                </h4>
                <ul className="space-y-2">
                  {activeRoom.details.map((d) => (
                    <li
                      key={d}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: "oklch(0.72 0.18 76)" }}
                      />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Floor Plan Minimap */}
              <div className="border border-border rounded-xl bg-card p-4">
                <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">
                  Floor Plan
                </div>
                <div
                  className="relative rounded overflow-hidden"
                  style={{
                    paddingBottom: "75%",
                    background: "oklch(0.12 0.015 62)",
                  }}
                >
                  <div className="absolute inset-0">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Outer walls */}
                      <rect
                        x="4"
                        y="4"
                        width="92"
                        height="92"
                        fill="none"
                        stroke="oklch(0.72 0.18 76 / 0.4)"
                        strokeWidth="0.8"
                      />
                      {/* Room dividers */}
                      <line
                        x1="50"
                        y1="4"
                        x2="50"
                        y2="54"
                        stroke="oklch(0.72 0.18 76 / 0.2)"
                        strokeWidth="0.4"
                      />
                      <line
                        x1="4"
                        y1="54"
                        x2="96"
                        y2="54"
                        stroke="oklch(0.72 0.18 76 / 0.2)"
                        strokeWidth="0.4"
                      />
                      <line
                        x1="73"
                        y1="38"
                        x2="73"
                        y2="54"
                        stroke="oklch(0.72 0.18 76 / 0.2)"
                        strokeWidth="0.4"
                      />
                      <line
                        x1="4"
                        y1="76"
                        x2="96"
                        y2="76"
                        stroke="oklch(0.72 0.18 76 / 0.15)"
                        strokeWidth="0.3"
                      />
                      {/* Hotspots */}
                      {ROOMS.map((room, i) => (
                        <g
                          key={room.id}
                          onClick={() => setActiveIdx(i)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") setActiveIdx(i);
                          }}
                          style={{ cursor: "pointer" }}
                          role="button"
                          tabIndex={0}
                          aria-label={`View ${room.label}`}
                        >
                          <circle
                            cx={room.mapX}
                            cy={room.mapY}
                            r={activeIdx === i ? "5.5" : "4"}
                            fill={
                              activeIdx === i
                                ? "oklch(0.72 0.18 76)"
                                : "oklch(0.72 0.18 76 / 0.35)"
                            }
                            stroke="oklch(0.84 0.13 80)"
                            strokeWidth="0.6"
                          />
                          <text
                            x={room.mapX}
                            y={room.mapY + 9}
                            textAnchor="middle"
                            fill="oklch(0.9 0.04 80)"
                            fontSize="3.5"
                          >
                            {room.icon}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div
            className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.14 0.015 62), oklch(0.18 0.025 70))",
              border: "1px solid oklch(0.72 0.18 76 / 0.3)",
            }}
          >
            <div>
              <h3 className="font-serif font-bold text-xl gold-text mb-1">
                Interested in a Property Like This?
              </h3>
              <p className="text-sm text-muted-foreground">
                MSTC GLOBAL helps you find, evaluate, and acquire luxury
                residential properties across Ahmedabad.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                to="/property-portal"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:-translate-y-0.5"
                style={{
                  background: "oklch(0.72 0.18 76)",
                  color: "oklch(0.1 0.01 60)",
                }}
                data-ocid="tour.browse_properties_button"
              >
                Browse Properties <ArrowRight size={14} />
              </Link>
              <a
                href="https://wa.me/919512609016"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm"
                style={{ background: "#25D366", color: "#fff" }}
                data-ocid="tour.whatsapp_button"
              >
                WhatsApp MSTC
              </a>
            </div>
          </div>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </PrivacyGate>
  );
}
