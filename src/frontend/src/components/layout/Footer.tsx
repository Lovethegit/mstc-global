import { Link } from "@tanstack/react-router";
import { Globe, Heart, Lock, Mail, Phone } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "mstcglobal";
  const utmUrl = `https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="bg-obsidian-900 border-t border-gold-700/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/mstc-logo.dim_400x400.png"
                alt="MSTC GLOBAL"
                className="w-10 h-10 object-contain"
              />
              <div>
                <div className="font-serif font-bold text-xl gold-text tracking-widest">
                  MSTC
                </div>
                <div className="font-sans text-xs text-gold-400 tracking-[0.3em] uppercase">
                  GLOBAL
                </div>
              </div>
            </div>
            <p className="font-sans text-sm text-obsidian-100 leading-relaxed">
              Innovate. Integrate. Inspire.
              <br />A multi-dimensional conglomerate delivering excellence
              across industries.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif text-gold-300 font-semibold text-base mb-1">
              Contact Us
            </h4>
            <a
              href="tel:9512609016"
              className="flex items-center gap-2 text-sm text-obsidian-100 hover:text-gold-300 transition-colors font-sans"
            >
              <Phone size={14} className="text-gold-500" />
              +91 9512609016
            </a>
            <a
              href="tel:+917926638800"
              className="flex items-center gap-2 text-sm text-obsidian-100 hover:text-gold-300 transition-colors font-sans"
            >
              <Phone size={14} className="text-gold-500" />
              +91 079-26638800
            </a>
            <a
              href="mailto:mstc.gbl@gmail.com"
              className="flex items-center gap-2 text-sm text-obsidian-100 hover:text-gold-300 transition-colors font-sans"
            >
              <Mail size={14} className="text-gold-500" />
              mstc.gbl@gmail.com
            </a>
            <a
              href="https://mstcglobal-kh8.caffeine.xyz"
              className="flex items-center gap-2 text-sm text-obsidian-100 hover:text-gold-300 transition-colors font-sans"
            >
              <Globe size={14} className="text-gold-500" />
              mstcglobal-kh8.caffeine.xyz
            </a>
          </div>

          {/* Services Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif text-gold-300 font-semibold text-base mb-1">
              Our Divisions
            </h4>
            {[
              "Infrastructure & Property",
              "RERA & PR Consulting",
              "Purchase, Rent & Redevelopment",
              "Finance & Investment",
              "Music & Cultural Services",
              "Hospitality & Events",
              "NGO & CSR Initiatives",
              "Media, Sports & Tourism",
            ].map((s) => (
              <span
                key={s}
                className="text-sm text-obsidian-100 font-sans hover:text-gold-300 transition-colors cursor-default"
              >
                {s}
              </span>
            ))}
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif text-gold-300 font-semibold text-base mb-1">
              Resources
            </h4>
            <Link
              to="/news"
              className="text-sm text-obsidian-100 font-sans hover:text-gold-300 transition-colors"
              data-ocid="footer.news_link"
            >
              News &amp; Insights
            </Link>
            <Link
              to="/nri-corner"
              className="text-sm text-obsidian-100 font-sans hover:text-gold-300 transition-colors"
              data-ocid="footer.nri_link"
            >
              NRI Corner
            </Link>
            <Link
              to="/refer"
              className="text-sm text-obsidian-100 font-sans hover:text-gold-300 transition-colors"
              data-ocid="footer.referral_link"
            >
              Refer a Friend
            </Link>
            <Link
              to="/property-portal"
              className="text-sm text-obsidian-100 font-sans hover:text-gold-300 transition-colors"
              data-ocid="footer.property_portal_link"
            >
              Property Portal
            </Link>{" "}
            <Link
              to="/track-enquiry"
              className="text-sm text-obsidian-100 font-sans hover:text-gold-300 transition-colors"
              data-ocid="footer.track_enquiry_link"
            >
              Track Enquiry
            </Link>
            <Link
              to="/complaint"
              className="text-sm text-obsidian-100 font-sans hover:text-gold-300 transition-colors"
              data-ocid="footer.complaint_link"
            >
              File a Complaint
            </Link>
            <Link
              to="/brochure"
              className="text-sm font-semibold font-sans hover:text-gold-200 transition-colors"
              style={{ color: "#c9a84c" }}
              data-ocid="footer.brochure_link"
            >
              📄 Download Brochure
            </Link>
          </div>
        </div>

        <div className="section-divider my-8" />

        <div className="border-t border-[#c9a84c]/10 mt-4 pt-4 flex flex-wrap gap-x-4 gap-y-2 justify-center text-xs text-slate-500">
          <a
            href="/privacy-policy"
            className="hover:text-[#c9a84c] transition-colors"
          >
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-[#c9a84c] transition-colors">
            Terms &amp; Conditions
          </a>
          <a
            href="/cookie-policy"
            className="hover:text-[#c9a84c] transition-colors"
          >
            Cookie Policy
          </a>
          <a
            href="/disclaimer"
            className="hover:text-[#c9a84c] transition-colors"
          >
            Disclaimer
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-obsidian-200 font-sans">
            © {year} MSTC GLOBAL. All rights reserved. | Love Vijaybhai Parekh
            (MD)
          </p>
          <div className="flex items-center gap-4">
            <a
              href={utmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-obsidian-200 hover:text-gold-300 transition-colors font-sans flex items-center gap-1"
            >
              Built with{" "}
              <Heart size={12} className="text-gold-500 fill-gold-500" /> using
              caffeine.ai
            </a>
            <Link
              to="/admin"
              aria-label="Admin Login"
              className="flex items-center gap-1 text-gold-500 opacity-60 hover:opacity-100 transition-opacity"
              data-ocid="footer.admin_link"
            >
              <Lock size={20} />
              <span
                className="text-xs font-sans text-obsidian-200"
                style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}
              >
                Admin
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
