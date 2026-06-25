import { ChevronDown, Sparkles } from "lucide-react";

export default function Hero() {
  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-obsidian-900" />
      <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
        <img
          src="/assets/1772105687546.png"
          alt=""
          aria-hidden="true"
          className="w-full h-auto object-contain object-bottom"
          style={{ opacity: 0.12, transform: "rotate(0deg)", maxHeight: "80%" }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/80 via-transparent to-obsidian-900/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian-900/70 via-transparent to-obsidian-900/80" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-60" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-60" />

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="flex justify-center mb-6 animate-float">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gold-500/20 blur-2xl scale-150" />
            <img
              src="/assets/generated/mstc-logo.dim_400x400.png"
              alt="MSTC GLOBAL Logo"
              className="relative w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl"
            />
          </div>
        </div>
        <div className="mb-2">
          <span className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.5em] text-gold-400 uppercase mb-4">
            <Sparkles size={12} />
            Established Excellence
            <Sparkles size={12} />
          </span>
        </div>
        <h1 className="font-serif font-black text-5xl sm:text-6xl md:text-8xl gold-text mb-2 tracking-wider leading-none text-shadow-gold">
          MSTC
        </h1>
        <h2 className="font-serif font-light text-2xl sm:text-3xl md:text-4xl text-gold-400 tracking-[0.6em] uppercase mb-6 text-shadow-dark">
          GLOBAL
        </h2>
        <div className="section-divider w-48 mx-auto mb-6" />
        <p className="font-cormorant text-xl sm:text-2xl text-gold-400 italic mb-2 tracking-wide text-shadow-dark">
          Innovate. Integrate. Inspire.
        </p>
        <p className="font-sans text-sm sm:text-base text-obsidian-100 max-w-2xl mx-auto leading-relaxed mb-10 text-shadow-dark">
          A premier multi-dimensional conglomerate led by{" "}
          <span className="text-gold-400 font-medium">
            Love Vijaybhai Parekh (MD)
          </span>
          , delivering excellence across Infrastructure, Finance, Culture, and
          beyond.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => handleScroll("#services")}
            className="px-10 py-3 bg-gold-600 hover:bg-gold-500 text-obsidian-900 font-sans font-semibold text-sm tracking-widest uppercase rounded-sm transition-all duration-300 shadow-gold hover:shadow-gold-lg animate-pulse-gold"
            data-ocid="hero.our_services_button"
          >
            Our Services
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => handleScroll("#about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold-500 hover:text-gold-300 transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
}
