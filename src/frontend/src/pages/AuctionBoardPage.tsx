import { createActor } from "@/backend";
import type { AuctionListing } from "@/backend";
import PrivacyGate from "@/components/PrivacyGate";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import BackToTop from "@/components/ui/BackToTop";
import { useActor } from "@/hooks/useActor";
import { useSubmitPropertyEnquiry } from "@/hooks/usePropertyQueries";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Flame,
  Phone,
  Send,
  TrendingDown,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

function formatINR(n: bigint | number) {
  const v = typeof n === "bigint" ? Number(n) : n;
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(2)} L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(0)}K`;
  return `₹${v.toLocaleString("en-IN")}`;
}

function useAuctionListings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<AuctionListing[]>({
    queryKey: ["auctionListings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAuctionListings();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

function useCountdown(endsAt: bigint) {
  const [remaining, setRemaining] = useState("");
  useEffect(() => {
    const tick = () => {
      const diff = Number(endsAt) / 1_000_000 - Date.now();
      if (diff <= 0) {
        setRemaining("Expired");
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setRemaining(d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);
  return remaining;
}

function getAuctionStatus(
  listing: AuctionListing,
): "active" | "ending" | "closed" {
  if (listing.status === "Closed") return "closed";
  const diff = Number(listing.endsAt) / 1_000_000 - Date.now();
  if (diff <= 0) return "closed";
  if (diff < 24 * 60 * 60 * 1000) return "ending";
  return "active";
}

interface EnquiryFormState {
  name: string;
  phone: string;
  email: string;
  budget: string;
  indemnity: boolean;
}

function InterestModal({
  listing,
  onClose,
}: {
  listing: AuctionListing;
  onClose: () => void;
}) {
  const submitEnquiry = useSubmitPropertyEnquiry();
  const [form, setForm] = useState<EnquiryFormState>({
    name: "",
    phone: "",
    email: "",
    budget: "",
    indemnity: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^[+\d\s-]{8,}$/.test(form.phone))
      e.phone = "Enter a valid phone number";
    if (!form.indemnity) e.indemnity = "You must accept the terms";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      await submitEnquiry.mutateAsync({
        propertyId: listing.id,
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email,
        customerMessage: `Auction Interest — ${listing.title} @ ${listing.location}. Budget: ${form.budget}. Current Bid: ${formatINR(listing.currentBid)}`,
        preferredTime: "",
        visitDate: "",
      });
      setSubmitted(true);
    } catch {
      setErrors({ submit: "Submission failed. Please try again." });
    }
  };

  const set =
    (k: keyof EnquiryFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({
        ...p,
        [k]:
          (e.target as HTMLInputElement).type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : e.target.value,
      }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      data-ocid="auction.interest_dialog"
    >
      <div
        className="absolute inset-0 bg-obsidian-900/80 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close"
      />
      <div className="relative z-10 w-full max-w-md mx-4 bg-obsidian-800 border border-gold-800/40 rounded-sm shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gold-800/30">
          <div>
            <h2 className="font-serif text-lg text-gold-200 font-bold">
              Register Interest
            </h2>
            <p className="text-xs font-sans text-obsidian-300 mt-0.5 line-clamp-1">
              {listing.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-obsidian-700 rounded-sm"
            data-ocid="auction.interest_close_button"
          >
            <X size={18} className="text-gold-400" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <CheckCircle2 size={48} className="text-gold-400 mx-auto mb-4" />
            <h3 className="font-serif text-xl text-gold-200 mb-2">
              Interest Registered!
            </h3>
            <p className="font-sans text-sm text-obsidian-200 mb-6">
              Our team will contact you about this auction property shortly.
            </p>
            <a
              href="https://wa.me/919512609016"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold-600 text-obsidian-900 font-sans font-semibold text-sm rounded-sm hover:bg-gold-500 transition-all"
              data-ocid="auction.whatsapp_button"
            >
              <Phone size={16} /> WhatsApp: +91 9512609016
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Your name"
                  className="w-full tool-field-input"
                  data-ocid="auction.interest_name_input"
                />
                {errors.name && (
                  <p
                    className="text-xs text-red-400 mt-1"
                    data-ocid="auction.name_field_error"
                  >
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="+91 9XXXXXXXXX"
                  className="w-full tool-field-input"
                  data-ocid="auction.interest_phone_input"
                />
                {errors.phone && (
                  <p
                    className="text-xs text-red-400 mt-1"
                    data-ocid="auction.phone_field_error"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="your@email.com"
                className="w-full tool-field-input"
                data-ocid="auction.interest_email_input"
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                Your Budget
              </label>
              <select
                value={form.budget}
                onChange={set("budget")}
                className="w-full tool-field-input"
                data-ocid="auction.interest_budget_select"
              >
                <option value="">Select range</option>
                <option>Under ₹30L</option>
                <option>₹30–60L</option>
                <option>₹60L–1Cr</option>
                <option>₹1–2Cr</option>
                <option>₹2–5Cr</option>
                <option>Above ₹5Cr</option>
              </select>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.indemnity}
                onChange={(e) =>
                  setForm((p) => ({ ...p, indemnity: e.target.checked }))
                }
                className="mt-0.5 cursor-pointer accent-gold-500"
                data-ocid="auction.interest_indemnity_checkbox"
              />
              <span className="text-xs font-sans text-obsidian-200 leading-relaxed">
                I agree that{" "}
                <strong className="text-gold-400">
                  MSTC Global is a facilitator
                </strong>{" "}
                only. Auction properties are sold subject to independent
                verification. <span className="text-red-400">*</span>
              </span>
            </label>
            {errors.indemnity && (
              <p
                className="text-xs text-red-400"
                data-ocid="auction.indemnity_field_error"
              >
                {errors.indemnity}
              </p>
            )}
            {errors.submit && (
              <p
                className="text-xs text-red-400"
                data-ocid="auction.error_state"
              >
                {errors.submit}
              </p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-gold-700/40 text-gold-400 font-sans font-medium text-sm rounded-sm hover:bg-obsidian-700"
                data-ocid="auction.interest_cancel_button"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitEnquiry.isPending}
                className="flex-1 py-2.5 bg-gold-600 hover:bg-gold-500 disabled:opacity-60 text-obsidian-900 font-sans font-semibold text-sm tracking-wider uppercase rounded-sm flex items-center justify-center gap-2"
                data-ocid="auction.interest_submit_button"
              >
                {submitEnquiry.isPending ? (
                  <span className="w-4 h-4 border-2 border-obsidian-900/40 border-t-obsidian-900 rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={14} /> Register
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function AuctionCard({
  listing,
  index,
}: {
  listing: AuctionListing;
  index: number;
}) {
  const countdown = useCountdown(listing.endsAt);
  const status = getAuctionStatus(listing);
  const [modalOpen, setModalOpen] = useState(false);
  const discount =
    listing.currentBid > 0n && listing.startPrice > 0n
      ? Math.round(
          (1 - Number(listing.currentBid) / Number(listing.startPrice)) * 100,
        )
      : 0;

  const statusConfig = {
    active: {
      label: "Active",
      badge: "bg-emerald-900/30 text-emerald-400 border border-emerald-700/40",
      timer: "text-emerald-400 bg-emerald-900/10 border-emerald-700/20",
    },
    ending: {
      label: "Ending Soon",
      badge: "bg-orange-900/30 text-orange-400 border border-orange-700/40",
      timer: "text-orange-400 bg-orange-900/10 border-orange-700/20",
    },
    closed: {
      label: "Closed",
      badge:
        "bg-obsidian-700/50 text-obsidian-300 border border-obsidian-600/40",
      timer: "text-obsidian-400 bg-obsidian-700/20 border-obsidian-700/20",
    },
  }[status];

  return (
    <>
      <div
        className="flex flex-col bg-obsidian-800/60 border border-gold-800/30 hover:border-gold-600/50 rounded-sm overflow-hidden transition-all duration-300 group"
        data-ocid={`auction.card.${index + 1}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gold-800/20">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold font-sans ${statusConfig.badge}`}
            >
              {statusConfig.label}
            </span>
            <span className="text-[10px] font-sans text-obsidian-400">
              {listing.propertyType} · {listing.location}
            </span>
          </div>
          {discount > 0 && (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-900/20 border border-emerald-700/30 rounded px-2 py-0.5">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4">
          <h3 className="font-serif text-base font-semibold text-gold-200 leading-snug mb-1 line-clamp-2">
            {listing.title}
          </h3>
          <p className="font-sans text-xs text-obsidian-300 mb-3 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>

          {/* Bid info */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-obsidian-700/40 rounded p-2">
              <p className="text-[10px] font-sans text-obsidian-400 uppercase tracking-widest mb-0.5">
                Starting Price
              </p>
              <p className="font-serif text-sm font-bold text-gold-400">
                {formatINR(listing.startPrice)}
              </p>
            </div>
            <div className="bg-obsidian-700/40 rounded p-2">
              <p className="text-[10px] font-sans text-obsidian-400 uppercase tracking-widest mb-0.5">
                Current Bid
              </p>
              <p className="font-serif text-sm font-bold text-emerald-400">
                {formatINR(
                  listing.currentBid > 0n
                    ? listing.currentBid
                    : listing.startPrice,
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <p className="text-[10px] font-sans text-obsidian-400 uppercase tracking-widest">
                Min Increment
              </p>
              <p className="text-xs font-sans font-medium text-obsidian-100">
                {formatINR(listing.minimumBid)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-sans text-obsidian-400 uppercase tracking-widest">
                Total Bids
              </p>
              <p className="text-xs font-sans font-medium text-obsidian-100">
                {Number(listing.bidCount)}
              </p>
            </div>
          </div>

          {/* Features */}
          {listing.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {listing.features.slice(0, 3).map((f) => (
                <span
                  key={f}
                  className="px-1.5 py-0.5 text-[10px] font-sans bg-obsidian-700/60 text-obsidian-200 rounded"
                >
                  {f}
                </span>
              ))}
            </div>
          )}

          {/* Countdown */}
          <div
            className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded border ${statusConfig.timer} mb-4`}
          >
            <Clock size={13} />
            <span>
              Closes in: <strong>{countdown}</strong>
            </span>
            {status === "ending" && (
              <Zap size={11} className="text-orange-400 ml-auto" />
            )}
          </div>

          <div className="mt-auto">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              disabled={status === "closed"}
              className="w-full py-2.5 bg-gold-600 hover:bg-gold-500 disabled:opacity-40 disabled:cursor-not-allowed text-obsidian-900 font-sans font-semibold text-sm tracking-wider uppercase rounded-sm transition-all"
              data-ocid={`auction.register_button.${index + 1}`}
            >
              {status === "closed" ? "Auction Closed" : "Register Interest"}
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <InterestModal listing={listing} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}

function AuctionSkeleton() {
  return (
    <div className="flex flex-col bg-obsidian-800/60 border border-gold-800/20 rounded-sm h-80 animate-pulse">
      <div className="h-10 border-b border-gold-800/20 bg-obsidian-700/30" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-obsidian-700/50 rounded w-3/4" />
        <div className="h-3 bg-obsidian-700/40 rounded w-full" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-12 bg-obsidian-700/40 rounded" />
          <div className="h-12 bg-obsidian-700/40 rounded" />
        </div>
        <div className="h-8 bg-obsidian-700/30 rounded mt-auto" />
      </div>
    </div>
  );
}

export default function AuctionBoardPage() {
  const navigate = useNavigate();
  const { data: listings = [], isLoading, isError } = useAuctionListings();

  const activeCount = listings.filter(
    (l) => getAuctionStatus(l) !== "closed",
  ).length;
  const endingSoon = listings.filter(
    (l) => getAuctionStatus(l) === "ending",
  ).length;

  return (
    <PrivacyGate>
      <div className="min-h-screen bg-obsidian-900 text-gold-100">
        <Header />

        {/* Hero */}
        <section className="pt-20 pb-6 px-4 bg-obsidian-800/80 border-b border-gold-800/30">
          <div className="max-w-7xl mx-auto">
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="inline-flex items-center gap-2 text-sm font-sans text-obsidian-400 hover:text-gold-400 transition-colors mb-4"
              data-ocid="auction.back_button"
            >
              <ArrowLeft size={14} /> Back to Home
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Flame size={22} className="text-gold-500" />
                  <h1 className="font-serif font-bold text-3xl gold-text">
                    Live Auction Board
                  </h1>
                </div>
                <p className="font-sans text-sm text-obsidian-300">
                  Distress sales, bank auctions &amp; quick deals — grab the
                  best prices before they expire.
                </p>
              </div>
              {!isLoading && listings.length > 0 && (
                <div className="flex gap-4">
                  <div className="text-center bg-obsidian-700/40 border border-gold-800/30 rounded-sm px-4 py-2">
                    <p className="font-serif text-xl font-bold text-gold-400">
                      {activeCount}
                    </p>
                    <p className="text-[10px] font-sans text-obsidian-400 uppercase tracking-widest">
                      Active
                    </p>
                  </div>
                  {endingSoon > 0 && (
                    <div className="text-center bg-orange-900/20 border border-orange-700/30 rounded-sm px-4 py-2">
                      <p className="font-serif text-xl font-bold text-orange-400">
                        {endingSoon}
                      </p>
                      <p className="text-[10px] font-sans text-orange-400/70 uppercase tracking-widest">
                        Ending Soon
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {isLoading ? (
            <>
              <div className="flex items-center gap-2 mb-6 text-xs text-obsidian-400">
                <div className="h-3 w-48 bg-obsidian-700/50 rounded animate-pulse" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((k) => (
                  <AuctionSkeleton key={k} />
                ))}
              </div>
            </>
          ) : isError ? (
            <div className="text-center py-20" data-ocid="auction.error_state">
              <Flame
                size={40}
                className="text-gold-600 mx-auto mb-4 opacity-40"
              />
              <h3 className="font-serif text-xl text-gold-400 mb-2">
                Could Not Load Auctions
              </h3>
              <p className="font-sans text-sm text-obsidian-300">
                Please try refreshing the page.
              </p>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20" data-ocid="auction.empty_state">
              <Flame
                size={48}
                className="text-gold-700 mx-auto mb-4 opacity-30"
              />
              <h3 className="font-serif text-xl text-gold-400 mb-2">
                No Active Auctions
              </h3>
              <p className="font-sans text-sm text-obsidian-300 mb-6">
                New auction listings are added regularly. Check back soon.
              </p>
              <a
                href="https://wa.me/919512609016"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold-600 text-obsidian-900 font-sans font-semibold text-sm rounded-sm hover:bg-gold-500 transition-all"
              >
                <Phone size={15} /> Get Notified via WhatsApp
              </a>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-6 text-xs font-sans text-obsidian-400">
                <TrendingDown size={13} className="text-emerald-400" />
                <span>
                  {listings.length} listings · Live countdown timers · All
                  prices verified
                </span>
              </div>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                data-ocid="auction.list"
              >
                {listings.map((l, i) => (
                  <AuctionCard key={l.id} listing={l} index={i} />
                ))}
              </div>

              {/* Expert CTA */}
              <div className="mt-12 p-6 bg-obsidian-800/60 border border-gold-800/30 rounded-sm flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-gold-200 mb-1">
                    Need Auction Guidance?
                  </h3>
                  <p className="font-sans text-sm text-obsidian-200">
                    Our experts can help you navigate bank auctions and distress
                    sales safely.
                  </p>
                </div>
                <a
                  href="tel:+919512609016"
                  className="flex items-center gap-2 px-6 py-3 bg-gold-600 hover:bg-gold-500 text-obsidian-900 font-sans font-semibold text-sm tracking-widest uppercase rounded-sm transition-all"
                  data-ocid="auction.expert_cta_button"
                >
                  <Phone size={16} /> +91 9512609016
                </a>
              </div>
            </>
          )}
        </main>

        <Footer />
        <BackToTop />
      </div>
    </PrivacyGate>
  );
}
