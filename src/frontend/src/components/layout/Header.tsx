import MegaMenu from "@/components/layout/MegaMenu";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Lock, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();

  // Dark/Light mode toggle
  const [isDark, setIsDark] = useState(() => {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("mstcTheme");
      if (saved) return saved === "dark";
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute("data-theme", "dark");
      root.classList.add("dark");
      localStorage.setItem("mstcTheme", "dark");
    } else {
      root.removeAttribute("data-theme");
      root.classList.remove("dark");
      localStorage.setItem("mstcTheme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("body-scroll-locked");
    } else {
      document.body.classList.remove("body-scroll-locked");
    }
    return () => {
      document.body.classList.remove("body-scroll-locked");
    };
  }, [menuOpen]);

  // PWA install prompt
  useEffect(() => {
    const checkPrompt = () => {
      if ((window as any).deferredPrompt) setCanInstall(true);
    };
    checkPrompt();
    const handler = () => setCanInstall(true);
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const currentPath = router.state.location.pathname;
    if (currentPath !== "/") {
      navigate({ to: "/" }).then(() => {
        setTimeout(() => {
          const el = document.querySelector(href);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      });
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-obsidian-800/95 backdrop-blur-md shadow-gold border-b border-gold-800/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNav("#home")}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <img
                src="/assets/generated/mstc-logo.dim_400x400.png"
                alt="MSTC GLOBAL Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif font-bold text-lg md:text-xl gold-text tracking-widest">
                MSTC
              </span>
              <span className="font-sans text-xs text-gold-400 tracking-[0.3em] uppercase">
                GLOBAL
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="px-4 py-2 text-sm font-sans font-medium text-gold-200 hover:text-gold-400 transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gold-500 group-hover:w-3/4 transition-all duration-300" />
              </button>
            ))}
            {/* Mega Menu Services */}
            <MegaMenu onNavigate={() => setMenuOpen(false)} />
            {/* Install App button */}
            {canInstall && (
              <button
                type="button"
                onClick={() => {
                  const prompt = (window as any).deferredPrompt;
                  if (prompt) {
                    prompt.prompt();
                    prompt.userChoice.then(() => {
                      (window as any).deferredPrompt = null;
                      setCanInstall(false);
                    });
                  }
                }}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#c9a84c]/10 border border-[#c9a84c]/40 rounded-lg text-[#c9a84c] text-sm hover:bg-[#c9a84c]/20 transition-colors"
                data-ocid="nav.install_app_button"
              >
                📲 Install App
              </button>
            )}
            {/* Dark/Light toggle */}
            <button
              type="button"
              onClick={() => setIsDark((d) => !d)}
              className="ml-1 w-9 h-9 rounded-full border border-gold-700/40 hover:border-gold-500/60 flex items-center justify-center text-gold-400 hover:text-gold-200 transition-all duration-200"
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              data-ocid="nav.theme_toggle"
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            {/* Login link */}
            <Link
              to="/admin"
              data-ocid="nav.login_link"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-sans font-semibold text-gold-400 hover:text-gold-300 border border-gold-600/50 hover:border-gold-400 rounded-sm transition-all duration-200 ml-2"
              onClick={() => setMenuOpen(false)}
            >
              <Lock size={13} />
              Login
            </Link>
          </nav>

          {/* Mobile Menu Toggle — must be above overlay (z-index: 9999) */}
          <button
            type="button"
            className="md:hidden p-2 rounded"
            style={{
              color: "#c9a84c",
              flexShrink: 0,
              position: "relative",
              zIndex: 9999,
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            data-ocid="nav.hamburger_button"
          >
            {menuOpen ? (
              <X size={26} color="#c9a84c" strokeWidth={2.5} />
            ) : (
              <Menu size={26} color="#c9a84c" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu — always rendered in DOM so transition works; slide-in via transform */}
      <div
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-[9998] transform transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{
          background: "#06090f",
          backgroundColor: "#06090f",
          borderTop: "2px solid rgba(201,168,76,0.5)",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          paddingTop: "80px",
          visibility: menuOpen ? "visible" : "hidden",
        }}
      >
        {/* X close button INSIDE the mobile menu panel */}
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 p-2 text-gold-400 hover:text-gold-300 transition-colors z-50"
          aria-label="Close menu"
          data-ocid="nav.mobile_menu_close_button"
        >
          <X size={24} />
        </button>
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "16px",
            gap: "4px",
            paddingBottom: "48px",
          }}
        >
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.href}
              onClick={() => handleNav(link.href)}
              style={{
                textAlign: "left",
                padding: "14px 16px",
                fontSize: "16px",
                fontWeight: 600,
                color: "#c9a84c",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid rgba(201,168,76,0.12)",
                borderRadius: "0",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "block",
                width: "100%",
                letterSpacing: "0.03em",
              }}
            >
              {link.label}
            </button>
          ))}
          {/* Mobile Mega Menu */}
          <MegaMenu mobile onNavigate={() => setMenuOpen(false)} />
          {/* Properties link */}
          <Link
            to="/property-portal"
            data-ocid="nav.mobile_properties_link"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              minHeight: "44px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#c9a84c",
              textDecoration: "none",
              borderRadius: "8px",
            }}
            onClick={() => setMenuOpen(false)}
          >
            Properties
          </Link>
          {/* Brochure link */}
          <Link
            to="/brochure"
            data-ocid="nav.mobile_brochure_link"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              minHeight: "44px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#c9a84c",
              textDecoration: "none",
              borderRadius: "8px",
            }}
            onClick={() => setMenuOpen(false)}
          >
            📄 Download Brochure
          </Link>
          {/* Dark/Light toggle row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 16px",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "#a89060",
                fontFamily: "sans-serif",
              }}
            >
              {isDark ? "Dark Mode" : "Light Mode"}
            </span>
            <button
              type="button"
              onClick={() => setIsDark((d) => !d)}
              style={{
                marginLeft: "auto",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "1px solid rgba(201,168,76,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#c9a84c",
                background: "transparent",
                cursor: "pointer",
              }}
              aria-label="Toggle theme"
              data-ocid="nav.mobile_theme_toggle"
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
          {/* Staff Access section */}
          <div
            style={{
              marginTop: "12px",
              borderTop: "1px solid rgba(201,168,76,0.25)",
              paddingTop: "12px",
            }}
          >
            <span
              style={{
                display: "block",
                padding: "0 16px 4px",
                fontSize: "11px",
                fontWeight: 600,
                color: "#a89060",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Staff Access
            </span>
            <Link
              to="/admin"
              data-ocid="nav.mobile_login_link"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 16px",
                minHeight: "44px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#c9a84c",
                textDecoration: "none",
                borderLeft: "2px solid #c9a84c",
                marginLeft: "8px",
              }}
              onClick={() => setMenuOpen(false)}
            >
              <Lock size={16} />
              Login
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
