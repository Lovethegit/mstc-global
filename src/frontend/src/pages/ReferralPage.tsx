import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useCreateReferral } from "@/hooks/useReferralQueries";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Gift,
  MessageSquare,
  Phone,
  Share2,
  Shield,
} from "lucide-react";
import { useState } from "react";

const SITE_URL = "https://mstcglobal-kh8.caffeine.xyz";

export default function ReferralPage() {
  const createReferral = useCreateReferral();
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const shareUrl = `${SITE_URL}?ref=${code}`;
  const waMessage = encodeURIComponent(
    `Hi! 👋 Check out MSTC GLOBAL — Ahmedabad's trusted platform for property, finance, and investment services.\n\n${shareUrl}\n\nMentioned by ${form.name || "a friend"}.`,
  );
  void waMessage; // retained for future use

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }
    setError("");
    try {
      const newCode = await createReferral.mutateAsync(form);
      setCode(newCode);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).catch(() => {
      // fallback
      const el = document.createElement("input");
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="min-h-screen bg-obsidian-900 text-gold-100">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-28 pb-12 px-4 bg-gradient-to-b from-obsidian-800 to-obsidian-900 border-b border-gold-800/30 text-center">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm font-sans mb-8 transition-colors"
              data-ocid="referral.back_link"
            >
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <div className="flex items-center justify-center mb-5">
              <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center">
                <Gift size={28} className="text-obsidian-900" />
              </div>
            </div>
            <h1 className="font-serif font-bold text-3xl md:text-5xl gold-text mb-4">
              Refer a Friend
            </h1>
            <p className="font-sans text-base text-obsidian-100 max-w-xl mx-auto leading-relaxed">
              Know someone looking for property, finance, or investment services
              in Ahmedabad? Share MSTC GLOBAL with them and help them find their
              perfect solution.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="py-14 px-4 bg-obsidian-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif font-bold text-2xl gold-text text-center mb-10">
              How It Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  num: "1",
                  title: "Fill Your Details",
                  desc: "Enter your name, phone, and email to generate your unique referral link.",
                  icon: <Phone size={20} />,
                },
                {
                  num: "2",
                  title: "Share Your Link",
                  desc: "Copy and share your link via WhatsApp, email, or any platform.",
                  icon: <Share2 size={20} />,
                },
                {
                  num: "3",
                  title: "Your Friend Benefits",
                  desc: "Your friend gets connected to MSTC GLOBAL's expert team for personalised service.",
                  icon: <Gift size={20} />,
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className="rounded-xl p-6 bg-card border border-gold-800/30 text-center"
                >
                  <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4 text-obsidian-900">
                    {step.icon}
                  </div>
                  <span className="block font-serif font-bold text-3xl gold-text mb-2">
                    {step.num}
                  </span>
                  <h3 className="font-serif font-semibold text-gold-300 mb-2">
                    {step.title}
                  </h3>
                  <p className="font-sans text-sm text-obsidian-100 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form / Result */}
        <section className="py-12 px-4 bg-obsidian-800/40">
          <div className="max-w-lg mx-auto">
            {!code ? (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl p-6 md:p-8 bg-card border border-gold-800/30 space-y-5"
                data-ocid="referral.form"
              >
                <h3 className="font-serif font-bold text-xl gold-text text-center">
                  Generate Your Referral Link
                </h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gold-400 uppercase tracking-wider">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    required
                    className="px-3 py-2 rounded-lg bg-obsidian-900 border border-gold-700/40 text-foreground text-sm focus:outline-none focus:border-gold-500 font-sans"
                    placeholder="Your name"
                    data-ocid="referral.name.input"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gold-400 uppercase tracking-wider">
                    Your Phone *
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    required
                    className="px-3 py-2 rounded-lg bg-obsidian-900 border border-gold-700/40 text-foreground text-sm focus:outline-none focus:border-gold-500 font-sans"
                    placeholder="+91 98765 43210"
                    data-ocid="referral.phone.input"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gold-400 uppercase tracking-wider">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="px-3 py-2 rounded-lg bg-obsidian-900 border border-gold-700/40 text-foreground text-sm focus:outline-none focus:border-gold-500 font-sans"
                    placeholder="you@email.com"
                    data-ocid="referral.email.input"
                  />
                </div>

                {error && (
                  <p
                    className="text-destructive text-sm text-center"
                    data-ocid="referral.form.error_state"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={createReferral.isPending}
                  className="w-full py-3 rounded-lg gold-gradient text-obsidian-900 font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 font-sans"
                  data-ocid="referral.form.submit_button"
                >
                  {createReferral.isPending
                    ? "Generating…"
                    : "Generate My Referral Link"}
                </button>
              </form>
            ) : (
              <div
                className="rounded-2xl p-6 md:p-8 bg-card border border-gold-500/40 space-y-6"
                data-ocid="referral.result.card"
              >
                <div className="text-center">
                  <CheckCircle2
                    size={48}
                    className="text-gold-400 mx-auto mb-3"
                  />
                  <h3 className="font-serif font-bold text-xl gold-text mb-1">
                    Your Referral Link is Ready!
                  </h3>
                  <p className="font-sans text-sm text-obsidian-100">
                    Share this link with your friends and family:
                  </p>
                </div>

                {/* Code badge */}
                <div className="text-center">
                  <span className="inline-block px-5 py-2 rounded-full gold-gradient text-obsidian-900 font-bold font-mono text-lg tracking-widest">
                    {code}
                  </span>
                  <p className="text-xs text-gold-500 mt-2 font-sans">
                    Your unique referral code
                  </p>
                </div>

                {/* Link box */}
                <div className="flex items-center gap-2 rounded-lg bg-obsidian-900/80 border border-gold-700/40 p-3">
                  <span className="text-sm text-gold-200 font-mono flex-1 truncate">
                    {shareUrl}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium gold-gradient text-obsidian-900 hover:opacity-90 transition-opacity"
                    data-ocid="referral.copy_button"
                  >
                    {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                {/* Share referral link */}
                <div
                  className="flex items-center gap-2 p-3 rounded-lg border border-gold-800/30"
                  style={{ background: "oklch(var(--muted))" }}
                >
                  <MessageSquare size={14} className="text-gold-400 shrink-0" />
                  <p className="font-sans text-xs text-obsidian-100 leading-relaxed">
                    Share your referral link via any messaging app. Copy the
                    link above and send it to your contacts.
                  </p>
                </div>

                {/* Note */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-obsidian-800/60 border border-gold-800/20">
                  <Shield size={14} className="text-gold-500 shrink-0 mt-0.5" />
                  <p className="font-sans text-xs text-obsidian-100 leading-relaxed">
                    Your referral code is unique to you. When someone visits
                    MSTC GLOBAL using your link, it is tracked and your details
                    are on record for any rewards or acknowledgements in the
                    future.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCode("");
                    setForm({ name: "", phone: "", email: "" });
                  }}
                  className="w-full py-2 rounded-lg border border-gold-700/40 text-gold-400 font-sans text-sm hover:bg-obsidian-700/40 transition-colors"
                  data-ocid="referral.new_referral_button"
                >
                  Generate Another Link
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
