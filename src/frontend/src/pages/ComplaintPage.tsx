import {
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  Search,
} from "lucide-react";
import { useState } from "react";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

const SERVICES = [
  "Property",
  "Finance & Loans",
  "RERA Consulting",
  "Events & Hospitality",
  "NGO & CSR",
  "Music & Cultural",
  "Media & Sports",
  "General",
];

interface TrackResult {
  status: string;
  service: string;
  notes: string;
}

export default function ComplaintPage() {
  const [tab, setTab] = useState<"file" | "track">("file");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: SERVICES[0],
    issue: "",
    priority: "Normal",
  });
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const [trackRef, setTrackRef] = useState("");
  const [trackResult, setTrackResult] = useState<TrackResult | null>(null);
  const [trackNotFound, setTrackNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!agreed || !form.name || !form.phone || !form.issue) return;
    setSubmitting(true);
    try {
      const mockRef = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
      setRefNumber(mockRef);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = () => {
    if (trackRef.startsWith("TKT-")) {
      setTrackResult({
        status: "In Progress",
        service: "Property",
        notes: "Our team is working on your complaint.",
      });
      setTrackNotFound(false);
    } else {
      setTrackResult(null);
      setTrackNotFound(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#06090f]">
      <Header />
      <main className="flex-1 px-4 py-12">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h1 className="text-3xl font-serif font-bold text-yellow-400">
              Complaints &amp; Support
            </h1>
            <p className="text-gray-400 mt-2">
              We take every concern seriously
            </p>
          </div>
          <div className="flex gap-1 mb-6 bg-black/40 p-1 rounded-xl border border-yellow-600/20">
            {(["file", "track"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                data-ocid={`complaint.${t}_tab`}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  tab === t
                    ? "bg-yellow-500 text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {t === "file" ? "File a Complaint" : "Track Complaint"}
              </button>
            ))}
          </div>

          {tab === "file" && !submitted && (
            <div className="bg-black/40 border border-yellow-600/20 rounded-2xl p-6 space-y-4">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your Name *"
                data-ocid="complaint.name_input"
                className="w-full bg-black/60 border border-yellow-600/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
              />
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone Number *"
                type="tel"
                data-ocid="complaint.phone_input"
                className="w-full bg-black/60 border border-yellow-600/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
              />
              <select
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                data-ocid="complaint.service_select"
                className="w-full bg-black/60 border border-yellow-600/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
              >
                {SERVICES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <textarea
                value={form.issue}
                onChange={(e) => setForm({ ...form, issue: e.target.value })}
                placeholder="Describe your issue *"
                rows={4}
                data-ocid="complaint.issue_textarea"
                className="w-full bg-black/60 border border-yellow-600/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 resize-none"
              />
              <div className="flex gap-3">
                {["Normal", "Urgent"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm({ ...form, priority: p })}
                    data-ocid={`complaint.priority_${p.toLowerCase()}_button`}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                      form.priority === p
                        ? "bg-yellow-500 text-black border-yellow-500"
                        : "border-yellow-600/30 text-gray-400 hover:border-yellow-400"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  data-ocid="complaint.terms_checkbox"
                  className="w-5 h-5 mt-0.5 accent-yellow-500"
                />
                <span className="text-gray-400 text-sm">
                  I agree to the Terms &amp; Conditions and Privacy Policy. I
                  confirm the information provided is accurate.
                </span>
              </label>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!agreed || submitting}
                data-ocid="complaint.submit_button"
                className="w-full py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Complaint"}
              </button>
            </div>
          )}

          {tab === "file" && submitted && (
            <div
              className="bg-black/40 border border-green-500/30 rounded-2xl p-8 text-center"
              data-ocid="complaint.success_state"
            >
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-bold text-white mb-2">
                Complaint Registered
              </h2>
              <p className="text-gray-400 mb-4">Your reference number:</p>
              <div className="text-3xl font-bold text-yellow-400 font-mono mb-6">
                {refNumber}
              </div>
              <p className="text-gray-400 text-sm mb-6">
                We will contact you within 24 hours on your registered phone
                number.
              </p>
              <a
                href={`https://wa.me/919512609016?text=Hi, I filed a complaint. Reference: ${refNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-500 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Follow up on WhatsApp
              </a>
            </div>
          )}

          {tab === "track" && (
            <div className="bg-black/40 border border-yellow-600/20 rounded-2xl p-6">
              <div className="flex gap-3 mb-4">
                <input
                  value={trackRef}
                  onChange={(e) => setTrackRef(e.target.value)}
                  placeholder="Enter reference number (e.g. TKT-12345)"
                  data-ocid="complaint.track_input"
                  className="flex-1 bg-black/60 border border-yellow-600/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                />
                <button
                  type="button"
                  onClick={handleTrack}
                  data-ocid="complaint.track_button"
                  className="px-5 py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
              {trackResult && (
                <div
                  className="p-4 bg-black/50 rounded-xl border border-yellow-600/20"
                  data-ocid="complaint.track_result"
                >
                  <p className="text-white font-semibold">
                    Status:{" "}
                    <span className="text-yellow-400">
                      {trackResult.status}
                    </span>
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Service: {trackResult.service}
                  </p>
                  <p className="text-gray-400 text-sm mt-1 italic">
                    {trackResult.notes}
                  </p>
                </div>
              )}
              {trackNotFound && (
                <p
                  className="text-gray-400 text-sm"
                  data-ocid="complaint.track_error_state"
                >
                  Reference not found. Contact us at +91 9512609016
                </p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
