import React from "react";

const defaultStories = [
  {
    quote:
      "MSTC GLOBAL helped us find our dream home in Satellite within our budget. The entire process was smooth and transparent.",
    name: "Priya S.",
    service: "Property Purchase",
  },
  {
    quote:
      "The RERA guidance we received saved us from a problematic project. Truly expert advice that protected our investment.",
    name: "Rajesh M.",
    service: "RERA Consulting",
  },
  {
    quote:
      "The finance team at MSTC helped us get a home loan at a great rate. They handled every document and made it stress-free.",
    name: "Harsha P.",
    service: "Finance & Investment",
  },
];

export default function About() {
  const [stories] = React.useState<
    { quote: string; name: string; service: string }[]
  >(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("mstc_success_stories") || "null") ||
        defaultStories
      );
    } catch {
      return defaultStories;
    }
  });

  return (
    <section
      id="about"
      className="py-20 md:py-28 bg-obsidian-800 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-600/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-sans text-xs tracking-[0.4em] text-gold-400 uppercase">
            About Us
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-gold-300 mt-2 mb-4">
            Leadership & Vision
          </h2>
          <div className="section-divider w-32 mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Profile */}
          <div className="flex flex-col items-center lg:items-start gap-6">
            <div className="relative">
              {/* Gold ring decoration */}
              <div className="absolute -inset-3 rounded-full border-2 border-gold-600/40" />
              <div className="absolute -inset-6 rounded-full border border-gold-700/25" />
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-gold-500 shadow-gold-lg relative">
                <img
                  src="/assets/generated/profile-about.dim_400x400.png"
                  alt="Love Vijaybhai Parekh"
                  className="w-full h-full object-cover object-top"
                  style={{ objectPosition: "50% 15%" }}
                />
              </div>
              {/* MD Badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gold-600 text-obsidian-900 text-xs font-sans font-bold px-4 py-1 rounded-full tracking-widest uppercase shadow-gold">
                MD
              </div>
            </div>

            <div className="text-center lg:text-left">
              <h3 className="font-serif text-2xl md:text-3xl text-gold-200 font-bold">
                Love Vijaybhai Parekh
              </h3>
              <p className="font-sans text-gold-400 text-sm tracking-widest uppercase mt-1">
                Managing Director — MSTC GLOBAL
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6">
            <div className="border-l-2 border-gold-500 pl-6 bg-obsidian-700/30 py-3 pr-3 rounded-r-sm">
              <p className="font-cormorant text-xl text-gold-200 italic leading-relaxed">
                "Our mission is to build bridges between opportunity and
                excellence — across infrastructure, culture, finance, and human
                potential."
              </p>
            </div>

            <p className="font-sans text-obsidian-100 leading-relaxed text-sm md:text-base">
              MSTC GLOBAL is a visionary multi-sector conglomerate headquartered
              in Ahmedabad, India. Under the dynamic leadership of{" "}
              <strong className="text-gold-400">
                Love Vijaybhai Parekh (MD)
              </strong>
              , the organization has grown into a powerhouse spanning real
              estate, finance, cultural services, hospitality, media, and social
              initiatives.
            </p>

            <p className="font-sans text-obsidian-200 leading-relaxed text-sm md:text-base">
              With a commitment to innovation and integrity, MSTC GLOBAL
              partners with clients, communities, and institutions to create
              lasting value and transformative impact across every domain it
              touches.
            </p>

            {/* Contact Quick Info */}
            <div className="flex flex-wrap gap-4 mt-2">
              <span className="flex items-center gap-2 text-sm font-sans text-gold-300 border border-gold-600/50 px-4 py-2 rounded-sm bg-obsidian-700/40">
                📱 +91 9512609016
              </span>
              <span className="flex items-center gap-2 text-sm font-sans text-gold-300 border border-gold-600/50 px-4 py-2 rounded-sm bg-obsidian-700/40">
                ✉️ lovevijaybhai@gmail.com
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories Section */}
      <div className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <span className="font-sans text-xs tracking-[0.4em] text-gold-400 uppercase">
            Client Stories
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-gold-300 mt-2 mb-3">
            Stories That Inspire Us
          </h2>
          <div className="w-16 h-0.5 bg-[#c9a84c] mx-auto mb-4" />
          <p className="font-sans text-sm text-obsidian-200 max-w-lg mx-auto">
            Real experiences from people we've had the privilege to serve
          </p>
          <p className="font-sans text-xs text-gold-500 mt-2">
            ✦ Real stories shared by our clients — add yours through the admin
            dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story, idx) => (
            <div
              key={story.name}
              className="bg-obsidian-700/50 rounded-xl border border-[#c9a84c]/20 p-6 flex flex-col gap-4 hover:border-[#c9a84c]/50 transition-colors"
              data-ocid={`about.story_card.${idx + 1}`}
            >
              <span className="text-5xl text-[#c9a84c]/40 font-serif leading-none select-none">
                &ldquo;
              </span>
              <p className="font-sans text-sm text-obsidian-100 leading-relaxed -mt-4">
                {story.quote}
              </p>
              <div className="mt-auto flex items-center justify-between">
                <span className="font-serif text-gold-300 font-semibold text-sm">
                  — {story.name}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/30">
                  {story.service}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
